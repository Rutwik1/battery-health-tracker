import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Battery } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { UsagePattern } from "@shared/schema";

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
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-heading font-semibold text-neutral mb-6">
          Usage Patterns
        </h2>
        
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 animate-pulse rounded-md"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-primary">
                <i className="ri-charging-pile-2-line text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral">Charging Frequency</p>
                <p className="text-xs text-neutral-lighter mt-1">
                  Average {usagePattern.chargingFrequency.toFixed(1)} times per day
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-primary">
                <i className="ri-battery-low-line text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral">Discharge Depth</p>
                <p className="text-xs text-neutral-lighter mt-1">
                  Average to {usagePattern.dischargeDepth}% before charging
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-primary">
                <i className="ri-timer-line text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral">Charge Duration</p>
                <p className="text-xs text-neutral-lighter mt-1">
                  Average {Math.floor(usagePattern.chargeDuration / 60)} hour {usagePattern.chargeDuration % 60} minutes
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-primary">
                <i className="ri-temp-hot-line text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral">Operating Temperature</p>
                <p className="text-xs text-neutral-lighter mt-1">
                  Average {usagePattern.operatingTemperature}°C during usage
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-6 pt-4 border-t">
          <Button variant="primary" className="w-full" disabled={loading}>
            View Detailed Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
