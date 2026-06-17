import React, { useEffect, useRef } from "react";
import { X, ScanLine } from "lucide-react";
import { toast } from "sonner";
import { Html5Qrcode } from "html5-qrcode";
import { SCANNER_CONFIG, APP_NAME } from "../../constants";

interface ScannerOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  isScanning: boolean;
  successName: string;
  onScanSuccess: (decodedText: string) => void;
}

export const ScannerOverlay: React.FC<ScannerOverlayProps> = ({
  isOpen,
  onClose,
  isScanning,
  successName,
  onScanSuccess,
}) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const callbackRef = useRef(onScanSuccess);
  callbackRef.current = onScanSuccess;

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    const start = async () => {
      // Wait for #reader div to mount
      await new Promise((r) => setTimeout(r, 400));
      if (cancelled) return;

      const scanner = new Html5Qrcode("reader");
      scannerRef.current = scanner;

      const onScan = (text: string) => {
        if (scanner.isScanning) scanner.pause();
        callbackRef.current(text);
      };

      try {
        await scanner.start({ facingMode: "environment" }, SCANNER_CONFIG, onScan, () => {});
      } catch {
        if (cancelled) return;
        try {
          await scanner.start({ facingMode: "user" }, SCANNER_CONFIG, onScan, () => {});
        } catch (err: any) {
          if (cancelled) return;
          const msg = err?.message ?? "";
          if (msg.includes("NotAllowedError")) {
            toast.error("Camera access denied. Allow permissions in browser settings.");
          } else if (msg.includes("NotFoundError")) {
            toast.error("No camera found on this device.");
          } else {
            toast.error("Camera failed. Ensure HTTPS or localhost.");
          }
        }
      }
    };

    start();

    return () => {
      cancelled = true;
      const s = scannerRef.current;
      if (s) {
        s.stop().catch(() => {}).finally(() => s.clear());
        scannerRef.current = null;
      }
    };
  }, [isOpen]);

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
        <div className="font-title-md text-white font-bold tracking-tight">{APP_NAME} Viewfinder</div>
        <div className="w-12" />
      </div>

      {/* Viewfinder */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center flex-1 pb-16">
        <p className="font-body-sm text-white text-center mb-8 px-6 py-2 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-[13px] font-medium tracking-wide z-20">
          {isScanning ? "Position the QR code within the frame" : "Attendance verified successfully!"}
        </p>

        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
          {/* Camera feed */}
          <div
            id="reader"
            className={`absolute inset-0 rounded-xl overflow-hidden [&>video]:object-cover [&>video]:w-full [&>video]:h-full transition-opacity duration-300 ${successName ? "opacity-0" : "opacity-100"}`}
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
              <div className="absolute top-0 left-0 w-full h-1 bg-secondary shadow-[0_0_10px_#0051d5] opacity-85 animate-[bounce_2s_infinite_ease-in-out]" />
            )}

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white/40 font-mono text-[10px] uppercase tracking-widest text-center select-none flex flex-col items-center gap-2">
                <ScanLine className={`w-12 h-12 transition-all ${isScanning ? "animate-pulse text-white/30" : "text-tertiary-fixed-dim"}`} />
                {isScanning ? "Scanning..." : "Verified"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/95 to-transparent pt-16 pb-8 px-6 flex flex-col items-center gap-6 z-20">
        <button
          onClick={() => { onClose(); toast.info("Switched to manual verification mode."); }}
          className="text-secondary-fixed-dim hover:text-secondary-fixed underline underline-offset-4 text-body-sm font-semibold transition-colors cursor-pointer"
        >
          Manual Entry
        </button>
      </div>
    </div>
  );
};

export default ScannerOverlay;
