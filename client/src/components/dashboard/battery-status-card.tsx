import { Card, CardContent } from "@/components/ui/card";
import { Battery } from "@shared/schema";
import BatteryIcon from "@/components/ui/battery-icon";
import { getBatteryStatusColor } from "@/lib/utils/battery";
import { Link } from "wouter";
import { ArrowUpRightIcon } from "lucide-react";

interface BatteryStatusCardProps {
  battery: Battery;
}

export default function BatteryStatusCard({ battery }: BatteryStatusCardProps) {
  const statusColor = getBatteryStatusColor(battery.status);
  
  // Calculate health change direction
  const healthChange = battery.healthPercentage > 90 ? 2 : 
                      battery.healthPercentage < 70 ? -4 : 0;
  
  // Convert color classes to CSS variables for gradients
  const gradientColor = statusColor === 'text-success' ? 'from-success to-success/70' :
                        statusColor === 'text-warning' ? 'from-warning to-warning/70' :
                        statusColor === 'text-danger' ? 'from-danger to-danger/70' :
                        'from-primary to-primary/70';
  
  return (
    <Link href={`/battery/${battery.id}`}>
      <Card className="card-hover rounded-xl overflow-hidden bg-gradient-card border-border/50">
        <CardContent className="p-0">
          <div className="relative">
            {/* Status Bar */}
            <div className={`h-1.5 w-full bg-gradient-to-r ${gradientColor}`}></div>
            
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-medium truncate pr-2">{battery.name}</h3>
                <div className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor} bg-opacity-15 ${statusColor.replace('text-', 'bg-')}/10`}>
                  {battery.status}
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BatteryIcon 
                    percentage={battery.healthPercentage} 
                    status={battery.status}
                    className="h-10 w-14" 
                  />
                </div>
                <div className="ml-4">
                  <div className="flex items-baseline">
                    <div className={`text-2xl font-bold ${statusColor}`}>
                      {battery.healthPercentage}%
                    </div>
                    {healthChange !== 0 && (
                      <div className={`ml-2 flex items-baseline text-sm font-medium ${healthChange > 0 ? 'text-success' : 'text-danger'}`}>
                        <i className={`${healthChange > 0 ? 'ri-arrow-up-s-fill' : 'ri-arrow-down-s-fill'} text-xl`}></i>
                        <span className="sr-only">{healthChange > 0 ? 'Increased' : 'Decreased'} by</span>
                        {Math.abs(healthChange)}%
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Health Status</p>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Cycle Count</p>
                  <p className="text-sm font-medium">
                    {battery.cycleCount} <span className="text-xs text-muted-foreground">/ {battery.expectedCycles}</span>
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground">Capacity</p>
                  <p className="text-sm font-medium">
                    {Math.floor(battery.currentCapacity / 1000)}K <span className="text-xs text-muted-foreground">mAh</span>
                  </p>
                </div>
                
                <ArrowUpRightIcon className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
