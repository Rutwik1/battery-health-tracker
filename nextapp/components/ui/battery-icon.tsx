'use client';

interface BatteryIconProps {
  percentage: number;
  status: string;
  className?: string;
}

export default function BatteryIcon({ percentage, status, className = '' }: BatteryIconProps) {
  const safePercentage = Math.max(0, Math.min(100, percentage));
  
  // Determine color based on battery health percentage
  const getColor = () => {
    if (safePercentage >= 70) return 'rgb(34, 197, 94)'; // Green
    if (safePercentage >= 40) return 'rgb(234, 179, 8)';  // Yellow
    return 'rgb(239, 68, 68)'; // Red
  };
  
  // Handle special status indicators
  const getStatusIndicator = () => {
    switch (status?.toLowerCase()) {
      case 'charging':
        return (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <svg 
              className="h-6 w-6 text-blue-500" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <svg 
              className="h-6 w-6 text-red-500" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };
  
  // Animation for the battery fill
  const fillAnimation = status?.toLowerCase() === 'charging' ? 'pulse 2s infinite' : 'none';
  
  return (
    <div className={`relative ${className}`}>
      {/* Battery outline */}
      <div className="relative w-full h-full">
        {/* Main battery body */}
        <div 
          className="w-[85%] h-full border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden"
          style={{ 
            boxShadow: '0 0 10px rgba(120, 120, 255, 0.2)' 
          }}
        >
          {/* Fill level */}
          <div 
            className="h-full transition-all duration-1000 ease-in-out"
            style={{ 
              width: `${safePercentage}%`,
              backgroundColor: getColor(),
              animation: fillAnimation,
              boxShadow: `0 0 10px ${getColor()}80`
            }}
          />
        </div>
        
        {/* Battery terminal/nub */}
        <div 
          className="absolute top-1/2 right-0 w-[15%] h-[40%] bg-gray-300 dark:bg-gray-600 rounded-r-sm"
          style={{ transform: 'translateY(-50%)' }}
        />
        
        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium" style={{ color: safePercentage > 50 ? 'white' : 'inherit' }}>
          {safePercentage}%
        </div>
      </div>
      
      {/* Status indicator (charging, error, etc.) */}
      {getStatusIndicator()}
      
      {/* Glowing effect for charging or critical status */}
      {(status?.toLowerCase() === 'charging' || safePercentage < 20) && (
        <div 
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{ 
            background: `radial-gradient(circle at center, ${getColor()}30 0%, transparent 70%)`,
            animation: 'pulse 2s infinite'
          }}
        />
      )}
    </div>
  );
}