import React, { useEffect, useId, useRef, useState } from "react";
import { X, ScanLine } from "lucide-react";
import { toast } from "sonner";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import { SCANNER_CONFIG, APP_NAME } from "../../constants";
import { logger } from "../../lib/logger";

interface ScannerOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onManualEntry?: () => void;
  isScanning: boolean;
  successName: string;
  onScanSuccess: (decodedText: string) => void;
}

const CAMERA_FALLBACKS: MediaTrackConstraints[] = [
  { facingMode: "environment" },
  { facingMode: "user" },
];

const getCameraErrorMessage = (err: unknown) => {
  const name = err instanceof DOMException ? err.name : "";
  const message = err instanceof Error ? err.message : String(err ?? "");

  if (!window.isSecureContext) {
    return "Camera requires HTTPS, localhost, or 127.0.0.1. Open this app on a secure URL.";
  }

  if (!navigator.mediaDevices?.getUserMedia) {
    return "This browser does not expose camera access. Try Chrome, Edge, or Safari.";
  }

  if (name === "NotAllowedError" || message.includes("NotAllowedError")) {
    return "Camera access denied. Allow camera permission in browser settings.";
  }

  if (name === "NotFoundError" || message.includes("NotFoundError")) {
    return "No camera found on this device.";
  }

  if (name === "NotReadableError" || message.includes("NotReadableError")) {
    return "Camera is already in use by another app or browser tab.";
  }

  return message || "Camera failed to start.";
};

const browserCanUseCamera = () =>
  window.isSecureContext && Boolean(navigator.mediaDevices?.getUserMedia);

const startScanner = async (
  scanner: Html5Qrcode,
  onScan: (decodedText: string) => void,
) => {
  let lastError: unknown;

  for (const cameraConfig of CAMERA_FALLBACKS) {
    try {
      await scanner.start(cameraConfig, SCANNER_CONFIG, onScan, () => {});
      return;
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError;
};

const stopScanner = async (scanner: Html5Qrcode, readerId: string) => {
  if (scanner.isScanning) {
    try {
      await scanner.stop();
    } catch (err) {
      logger.warn("[ScannerOverlay] Failed to stop scanner", err);
    }
  }

  if (!document.getElementById(readerId)) return;

  try {
    scanner.clear();
  } catch (err) {
    logger.warn("[ScannerOverlay] Failed to clear scanner", err);
  }
};

export const ScannerOverlay: React.FC<ScannerOverlayProps> = ({
  isOpen,
  onClose,
  onManualEntry,
  isScanning,
  successName,
  onScanSuccess,
}) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const callbackRef = useRef(onScanSuccess);
  const reactReaderId = useId();
  const readerId = `qr-reader-${reactReaderId.replace(/:/g, "")}`;
  const [cameraError, setCameraError] = useState("");

  useEffect(() => {
    callbackRef.current = onScanSuccess;
  }, [onScanSuccess]);

  useEffect(() => {
    if (!isOpen) return;

    let active = true;
    const scannerElement = document.getElementById(readerId);

    const openCamera = async () => {
      setCameraError("");

      if (!browserCanUseCamera()) {
        const message = getCameraErrorMessage(null);
        setCameraError(message);
        toast.error(message);
        return;
      }

      if (!scannerElement) return;

      const scanner = new Html5Qrcode(readerId);
      scannerRef.current = scanner;

      const onScan = (text: string) => {
        if (!active || scanner.getState() !== Html5QrcodeScannerState.SCANNING) return;

        scanner.pause(true);
        callbackRef.current(text);
      };

      try {
        await startScanner(scanner, onScan);

        if (!active) {
          await stopScanner(scanner, readerId);
        }
      } catch (err) {
        if (!active) return;

        const message = getCameraErrorMessage(err);
        setCameraError(message);
        toast.error(message);
        await stopScanner(scanner, readerId);
        scannerRef.current = null;
      }
    };

    void openCamera();

    return () => {
      active = false;
      const scanner = scannerRef.current;

      if (scanner) {
        scannerRef.current = null;
        void stopScanner(scanner, readerId);
      }
    };
  }, [isOpen, readerId]);

  if (!isOpen) return null;

  const cornerColor = successName ? "border-tertiary-fixed-dim" : "border-secondary";

  return (
    <div className="fixed inset-0 bg-black/95 flex flex-col z-50 animate-fade-in select-none">
      {/* Top Bar */}
      <div className="absolute top-0 w-full flex justify-between items-center px-6 py-5 z-20">
        <button
          onClick={onClose}
          className="w-12 h-12 rounded-full bg-surface/20 hover:bg-surface/30 backdrop-blur-md flex items-center justify-center transition-colors cursor-pointer border border-white/10"
          aria-label="Close scanner"
        >
          <X className="w-5 h-5 text-white" />
        </button>
        <div className="text-title-md text-white font-bold tracking-tight">{APP_NAME} View</div>
        <div className="w-12" />
      </div>

      {/* Viewfinder */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center flex-1 pb-16">
        <p className="text-white text-center mb-8 px-6 py-2 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-[13px] font-medium tracking-wide z-20">
          {isScanning ? "Position the QR code within the frame" : "Attendance verified successfully!"}
        </p>

        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
          {/* Camera feed */}
          <div
            id={readerId}
            className={`scanner-reader absolute inset-0 rounded-xl overflow-hidden [&_video]:object-cover [&_video]:w-full [&_video]:h-full transition-opacity duration-300 ${successName ? "opacity-0" : "opacity-100"}`}
            style={{ border: "none" }}
          />

          {/* Overlay decorations */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="absolute inset-0 border border-white/20 rounded-xl" />
            <div className={`absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 rounded-tl-xl ${cornerColor}`} />
            <div className={`absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 rounded-tr-xl ${cornerColor}`} />
            <div className={`absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 rounded-bl-xl ${cornerColor}`} />
            <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 rounded-br-xl ${cornerColor}`} />

            {isScanning && (
              <div className="absolute top-0 left-0 w-full h-1 bg-secondary shadow-[0_0_12px_#4f46e5] opacity-90 animate-[bounce_2s_infinite_ease-in-out]" />
            )}

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white/40 font-mono text-[10px] uppercase tracking-widest text-center select-none flex flex-col items-center gap-2">
                <ScanLine className={`w-12 h-12 transition-all ${isScanning ? "animate-pulse text-white/30" : "text-tertiary-fixed-dim"}`} />
                {isScanning ? "Scanning..." : "Verified"}
              </div>
            </div>
          </div>
        </div>

        {cameraError && (
          <div className="mt-6 max-w-sm rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-center text-body-sm text-white backdrop-blur-md">
            {cameraError}
          </div>
        )}
      </div>

      {/* Bottom */}
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/95 to-transparent pt-16 pb-8 px-6 flex flex-col items-center gap-6 z-20">
        <button
          onClick={() => {
            onClose();
            onManualEntry?.();
          }}
          className="text-secondary-fixed-dim hover:text-secondary-fixed underline underline-offset-4 text-body-sm font-semibold transition-colors cursor-pointer"
        >
          Manual Entry
        </button>
      </div>
    </div>
  );
};

export default ScannerOverlay;
