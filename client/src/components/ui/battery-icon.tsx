import { cn } from "@/lib/utils";
import { getBatteryStatusColor } from "@/lib/utils/battery";
import { useEffect, useState } from "react";

interface BatteryIconProps {
  percentage: number;
  status: string;
  className?: string;
}

export default function BatteryIcon({ percentage, status, className }: BatteryIconProps) {
  const [pulse, setPulse] = useState(false);
  const statusColor = getBatteryStatusColor(status);
  
  // Generate random pulse timing
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(prev => !prev);
    }, 2000 + Math.random() * 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Convert status color to CSS variables for gradients
  const solidColor = statusColor === 'text-success' ? 'hsl(var(--success))' : 
                    statusColor === 'text-warning' ? 'hsl(var(--warning))' : 
                    statusColor === 'text-danger' ? 'hsl(var(--danger))' : 
                    'hsl(var(--primary))';
                    
  const gradientColor = statusColor === 'text-success' ? 'from-success to-success/70' :
                        statusColor === 'text-warning' ? 'from-warning to-warning/70' :
                        statusColor === 'text-danger' ? 'from-danger to-danger/70' :
                        'from-primary to-primary/70';
  
  const glowColor = statusColor === 'text-success' ? 'success' :
                   statusColor === 'text-warning' ? 'warning' :
                   statusColor === 'text-danger' ? 'danger' :
                   'primary';
  
  return (
    <div className={cn(
      "battery-icon relative w-14 h-7 rounded-lg border border-border/50 bg-card/50 backdrop-blur-lg shadow-inner overflow-hidden", 
      className
    )}>
      {/* Glow effect behind the battery */}
      <div 
        className={`absolute inset-0 blur-md bg-${glowColor}/20 opacity-${pulse ? '60' : '40'} transition-opacity duration-1000 z-0`}
      />
      
      {/* Battery pattern design */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-white/0 via-white/20 to-white/0"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-white/0 via-white/5 to-white/0"></div>
      </div>
      
      {/* Battery level with gradient */}
      <div 
        className={`battery-level absolute top-[3px] bottom-[3px] left-[3px] z-10 rounded-md bg-gradient-to-r ${gradientColor}`}
        style={{ width: `${Math.min(Math.max(percentage - 4, 0), 80)}%` }}
      >
        {/* Animated charging effect */}
        <div 
          className="absolute inset-0 bg-white/10 animate-pulse-slow"
          style={{ 
            backgroundImage: `linear-gradient(90deg, 
              transparent 0%, 
              transparent 40%, 
              rgba(255, 255, 255, 0.15) 50%, 
              transparent 60%, 
              transparent 100%)`,
            backgroundSize: '200% 100%',
            animation: 'shimmer 3s infinite linear'
          }}
        ></div>
        
        {/* Small dots for design */}
        <div className="absolute top-1 right-1 w-0.5 h-0.5 rounded-full bg-white/30"></div>
        <div className="absolute bottom-1 right-2 w-0.5 h-0.5 rounded-full bg-white/30"></div>
      </div>
      
      {/* Battery terminal */}
      <div className={`absolute -right-[2px] top-[8px] bottom-[8px] w-1 z-10 rounded-r-md bg-gradient-to-b ${gradientColor}`}>
        <div className="absolute inset-0 bg-white/10 animate-pulse-slow"></div>
      </div>
      
      {/* Shadow inside for 3D effect */}
      <div className="absolute inset-0 shadow-[inset_0_0_2px_rgba(0,0,0,0.3)] rounded-lg pointer-events-none z-20"></div>
      
      {/* Percentage overlay for low battery levels */}
      {percentage < 20 && (
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <span 
            className="text-[10px] font-bold text-white drop-shadow-md animate-pulse"
            style={{ 
              textShadow: `0 0 8px ${solidColor}`
            }}
          >
            {percentage}%
          </span>
        </div>
      )}
      
      {/* Add keyframes for shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
