import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Battery } from "@shared/schema";
import { getBatteryStatusColor } from "@/lib/utils/battery";

interface DegradationCardProps {
  batteries: Battery[];
  isLoading: boolean;
}

export default function DegradationCard({ batteries, isLoading }: DegradationCardProps) {
  // Calculate average degradation rate
  const averageDegradation = batteries.length > 0
    ? batteries.reduce((sum, battery) => sum + battery.degradationRate, 0) / batteries.length
    : 0;
  
  // Determine average status color
  let averageStatusColor = "text-success";
  if (averageDegradation > 1.5) {
    averageStatusColor = "text-danger";
  } else if (averageDegradation > 1.0) {
    averageStatusColor = "text-warning";
  }
  
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-heading font-semibold text-neutral mb-6">
          Battery Degradation Rate
        </h2>
        
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 animate-pulse rounded-md"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {batteries.map((battery) => {
              const statusColor = getBatteryStatusColor(battery.status);
              // Calculate width percentage for progress bar (relative to worst degradation)
              const progressWidth = (battery.degradationRate / 2.5) * 100;
              
              return (
                <div key={battery.id}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-medium text-neutral">{battery.name}</div>
                    <div className={`text-sm font-medium ${statusColor}`}>{battery.degradationRate}% / month</div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <Progress value={progressWidth} className={`h-2 ${statusColor.replace('text-', 'bg-')}`} />
                  </div>
                </div>
              );
            })}
            
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-neutral-lighter">Average degradation:</span>
                <span className={`font-medium ${averageStatusColor}`}>{averageDegradation.toFixed(2)}% / month</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
