interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  label = 'Loading resources...' 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative flex items-center justify-center">
        {/* Glow backdrop effect */}
        <div className={`absolute rounded-full bg-secondary/20 blur-xl animate-pulse ${
          size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-14 h-14' : 'w-24 h-24'
        }`} />
        
        {/* Spinner circle */}
        <div
          className={`${sizeClasses[size]} rounded-full border-surface-container-high border-t-secondary animate-spin`}
          role="status"
          aria-label="loading"
        />
      </div>
      {label && (
        <span className="text-on-surface-variant text-body-sm animate-pulse font-sans">
          {label}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;
