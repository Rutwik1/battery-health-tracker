import { Button } from "@/components/ui/button";
import { Battery } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { UsagePattern } from "@shared/schema";
import { Activity, BatteryLow, Timer, Thermometer, BarChart2 } from "lucide-react";

interface UsagePatternCardProps {
  batteries: Battery[];
  isLoading: boolean;
}

export default function UsagePatternCard({ batteries, isLoading }: UsagePatternCardProps) {
  // Get usage pattern for the first battery
  const batteryId = batteries.length > 0 ? batteries[0].id : 0;
  
  const { data: usagePattern, isLoading: patternLoading } = useQuery<UsagePattern>({
    queryKey: [`/api/batteries/${batteryId}/usage`],
    enabled: batteryId > 0
  });
  
  const loading = isLoading || patternLoading || !usagePattern;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center">
        <Activity className="h-5 w-5 mr-2 text-success" />
        <h2 className="text-lg font-heading font-semibold">
          Usage Analytics
        </h2>
      </div>
      
      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-muted/20 animate-pulse rounded-lg"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center group">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm flex items-center justify-center text-primary border border-primary/10 transition-colors duration-300 group-hover:border-primary/30">
              <BarChart2 className="h-5 w-5" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium">Charging Frequency</p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary/50 mr-1.5"></span>
                Average <span className="text-foreground font-medium ml-1 mr-1">{usagePattern.chargingFrequency.toFixed(1)}</span> times per day
              </p>
            </div>
          </div>
          
          <div className="flex items-center group">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 backdrop-blur-sm flex items-center justify-center text-accent border border-accent/10 transition-colors duration-300 group-hover:border-accent/30">
              <BatteryLow className="h-5 w-5" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium">Discharge Depth</p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent/50 mr-1.5"></span>
                Average to <span className="text-foreground font-medium ml-1 mr-1">{usagePattern.dischargeDepth}%</span> before charging
              </p>
            </div>
          </div>
          
          <div className="flex items-center group">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-success/20 to-success/5 backdrop-blur-sm flex items-center justify-center text-success border border-success/10 transition-colors duration-300 group-hover:border-success/30">
              <Timer className="h-5 w-5" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium">Charge Duration</p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-success/50 mr-1.5"></span>
                Average <span className="text-foreground font-medium ml-1 mr-1">
                  {Math.floor(usagePattern.chargeDuration / 60)}h {usagePattern.chargeDuration % 60}m
                </span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center group">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-warning/20 to-warning/5 backdrop-blur-sm flex items-center justify-center text-warning border border-warning/10 transition-colors duration-300 group-hover:border-warning/30">
              <Thermometer className="h-5 w-5" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium">Operating Temperature</p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-warning/50 mr-1.5"></span>
                Average <span className="text-foreground font-medium ml-1 mr-1">{usagePattern.operatingTemperature}°C</span> during usage
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-6 pt-4 border-t border-border/30">
        <Button 
          variant="outline" 
          className="w-full bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 backdrop-blur-sm transition-all duration-300 text-foreground border-border/50" 
          disabled={loading}
        >
          View Detailed Analytics
        </Button>
      </div>
    </div>
  );
}
