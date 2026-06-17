import React from 'react';
import { X, ScanLine, Camera } from 'lucide-react';
import { toast } from 'sonner';

interface ScannerOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  isScanning: boolean;
  successName: string;
}

export const ScannerOverlay: React.FC<ScannerOverlayProps> = ({
  isOpen,
  onClose,
  isScanning,
  successName
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/95 flex flex-col z-50 animate-fade-in select-none">
      {/* Top Bar for Scanner (Close Scanner button) */}
      <div className="absolute top-0 w-full flex justify-between items-center px-6 py-5 z-20">
        <button 
          onClick={onClose}
          className="w-12 h-12 rounded-full bg-surface/20 hover:bg-surface/30 backdrop-blur-md flex items-center justify-center text-on-primary transition-colors cursor-pointer border border-white/10"
          aria-label="Close scanner"
        >
          <X className="w-5 h-5 text-white" />
        </button>
        <div className="font-title-md text-white font-bold tracking-tight">AttendPro Viewfinder</div>
        <div className="w-12" /> {/* Spacer */}
      </div>

      {/* Viewfinder Target Area */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center flex-1 pb-16">
        <p className="font-body-sm text-white text-center mb-8 px-6 py-2 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-[13px] font-medium tracking-wide">
          {isScanning ? 'Position the QR code within the frame' : 'Attendance verified successfully!'}
        </p>

        {/* Viewfinder Frame (Stylistic corner brackets - matches Stitch) */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center transition-all duration-300">
          {/* Outer Shadow Overlay (Simulated box-shadow of viewfinder) */}
          <div className="absolute inset-0 border border-white/20 rounded-xl" />
          
          {/* Corner brackets */}
          <div className={`absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 rounded-tl-xl transition-colors duration-300 ${successName ? 'border-tertiary-fixed-dim' : 'border-secondary'}`} />
          <div className={`absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 rounded-tr-xl transition-colors duration-300 ${successName ? 'border-tertiary-fixed-dim' : 'border-secondary'}`} />
          <div className={`absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 rounded-bl-xl transition-colors duration-300 ${successName ? 'border-tertiary-fixed-dim' : 'border-secondary'}`} />
          <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 rounded-br-xl transition-colors duration-300 ${successName ? 'border-tertiary-fixed-dim' : 'border-secondary'}`} />
          
          {/* Pulsing red/blue laser line scanning up and down */}
          {isScanning && (
            <div className="absolute top-0 left-0 w-full h-1 bg-secondary shadow-[0_0_10px_#0051d5] opacity-85 animate-[bounce_2s_infinite_ease-in-out]" />
          )}

          {/* Viewfinder target contents */}
          <div className="text-white/40 font-mono text-[10px] uppercase tracking-widest text-center select-none flex flex-col items-center gap-2">
            <ScanLine className={`w-12 h-12 transition-all ${isScanning ? 'animate-pulse text-white/30' : 'text-tertiary-fixed-dim'}`} />
            {isScanning ? 'Scanning...' : 'Verified'}
          </div>
        </div>
      </div>

      {/* Bottom Control Actions (Flash toggle & manual code entry) */}
      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/95 to-transparent pt-16 pb-8 px-6 flex flex-col items-center gap-6 z-20">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => toast.info('Flashlight toggled.')}
            className="flex flex-col items-center gap-1.5 text-white/70 hover:text-white transition-colors cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-full bg-white/10 group-hover:bg-white/20 border border-white/10 flex items-center justify-center backdrop-blur-md transition-colors">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="font-sans text-[11px] font-bold uppercase tracking-wider">Toggle Flash</span>
          </button>
        </div>
        <button 
          onClick={() => {
            onClose();
            toast.info('Switched to manual verification mode.');
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
