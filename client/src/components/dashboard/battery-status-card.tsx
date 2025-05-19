import { Card, CardContent } from "@/components/ui/card";
import { Battery } from "@shared/schema";
import BatteryIcon from "@/components/ui/battery-icon";
import { getBatteryStatusColor } from "@/lib/utils/battery";
import { Link } from "wouter";
import { ArrowUpRightIcon, Zap } from "lucide-react";

interface BatteryStatusCardProps {
  battery: Battery | null;
  isLoading?: boolean;
}

export default function BatteryStatusCard({ battery, isLoading = false }: BatteryStatusCardProps) {
  if (isLoading || !battery) {
    return (
      <Card className="rounded-xl overflow-hidden bg-gradient-card border-border/50 h-[164px]">
        <CardContent className="p-5">
          <div className="h-full flex flex-col justify-between">
            <div className="h-4 w-1/2 mb-2 bg-muted/20 animate-pulse rounded-md"></div>
            <div className="flex items-center">
              <div className="h-10 w-14 bg-muted/20 animate-pulse rounded-md"></div>
              <div className="ml-4 flex-1">
                <div className="h-8 w-24 bg-muted/20 animate-pulse rounded-md"></div>
                <div className="h-3 w-16 mt-1 bg-muted/20 animate-pulse rounded-md"></div>
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <div className="h-10 w-16 bg-muted/20 animate-pulse rounded-md"></div>
              <div className="h-10 w-16 bg-muted/20 animate-pulse rounded-md"></div>
              <div className="h-10 w-5 bg-muted/20 animate-pulse rounded-md"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const statusColor = getBatteryStatusColor(battery.status);
  const glowClass = statusColor === 'text-success' ? 'battery-glow-success' :
    statusColor === 'text-warning' ? 'battery-glow-warning' :
      statusColor === 'text-danger' ? 'battery-glow-danger' : '';

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
      <div className="battery-glow relative group transition-all duration-300 hover:-translate-y-1">
        <Card className={`rounded-xl overflow-hidden backdrop-blur-md bg-gradient-card border-border/50 ${glowClass}`}>
          <CardContent className="p-0">
            <div className="relative">
              {/* Animated Status Bar */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${gradientColor} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-white/10 animate-pulse-slow"></div>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-medium truncate pr-2 flex items-center">
                    <Zap className="h-3.5 w-3.5 mr-1.5 text-accent inline-block" />
                    {battery.name}
                  </h3>
                  <div className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor} bg-opacity-15 ${statusColor.replace('text-', 'bg-')}/10 backdrop-blur-sm`}>
                    {battery.status}
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex-shrink-0 relative group-hover:animate-float">
                    <BatteryIcon
                      percentage={battery.healthPercentage}
                      status={battery.status}
                      className="h-10 w-14"
                    />
                    {/* Glow effect */}
                    <div className={`absolute inset-0 ${statusColor.replace('text-', 'bg-')}/20 blur-md -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  </div>
                  <div className="ml-4">
                    <div className="flex items-baseline">
                      <div className={`text-2xl font-bold ${statusColor}`}>
                        {parseFloat(battery.healthPercentage.toFixed(2))}%
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

                  <div className="h-7 w-7 rounded-full flex items-center justify-center bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                    <ArrowUpRightIcon className="h-3.5 w-3.5 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Link>
  );
}
