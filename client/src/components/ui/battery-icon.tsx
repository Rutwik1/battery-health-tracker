import { cn } from "@/lib/utils";
import { getBatteryStatusColor } from "@/lib/utils/battery";

interface BatteryIconProps {
  percentage: number;
  status: string;
  className?: string;
}

export default function BatteryIcon({ percentage, status, className }: BatteryIconProps) {
  const statusColor = getBatteryStatusColor(status);
  
  return (
    <div className={cn("battery-icon relative w-14 h-7 rounded border-2 border-current", statusColor, className)}>
      <div 
        className={`battery-level absolute top-1 bottom-1 left-1 rounded-sm ${statusColor.replace('text-', 'bg-')}`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
      <div 
        className={`absolute -right-1.5 top-1.5 bottom-1.5 w-1 rounded-r-sm ${statusColor.replace('text-', 'bg-')}`}
      />
    </div>
  );
}
