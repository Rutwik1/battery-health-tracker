import { cn } from "@/lib/utils";
import { getBatteryStatusColor } from "@/lib/utils/battery";

interface BatteryIconProps {
  percentage: number;
  status: string;
  className?: string;
}

export default function BatteryIcon({ percentage, status, className }: BatteryIconProps) {
  const statusColor = getBatteryStatusColor(status);
  
  // Convert status color to CSS variables for gradients
  const gradientColor = statusColor === 'text-success' ? 'from-success to-success/70' :
                         statusColor === 'text-warning' ? 'from-warning to-warning/70' :
                         statusColor === 'text-danger' ? 'from-danger to-danger/70' :
                         'from-primary to-primary/70';
  
  return (
    <div className={cn(
      "battery-icon relative w-14 h-7 rounded-lg border border-border/50 bg-muted/30 backdrop-blur-sm shadow-inner", 
      className
    )}>
      {/* Battery level with gradient */}
      <div 
        className={`battery-level absolute top-[3px] bottom-[3px] left-[3px] rounded-md bg-gradient-to-r ${gradientColor}`}
        style={{ width: `${Math.min(Math.max(percentage - 3, 0), 80)}%` }}
      >
        {/* Add subtle animation */}
        <div className="absolute inset-0 bg-white opacity-10 animate-pulse"></div>
      </div>
      
      {/* Battery terminal */}
      <div 
        className={`absolute -right-[2px] top-[6px] bottom-[6px] w-1 rounded-r-md bg-gradient-to-b ${gradientColor}`}
      />
      
      {/* Percentage overlay for low battery levels */}
      {percentage < 20 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-bold text-white drop-shadow-md">
            {percentage}%
          </span>
        </div>
      )}
    </div>
  );
}
