import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { Battery } from "@shared/schema";
import { getBatteryStatusColor } from "@/lib/utils/battery";
import { TrendingDown } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function DegradationCard() {
  const { data: batteries = [], isLoading } = useQuery<Battery[]>({
    queryKey: ['/api/batteries'],
    queryFn: () => apiFetch('/api/batteries'),
  });

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

  // Calculate average degradation width for progress bar
  const averageDegradationWidth = (averageDegradation / 2.5) * 100;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center">
        <TrendingDown className="h-5 w-5 mr-2 text-danger" />
        <h2 className="text-lg font-heading font-semibold">
          Battery Degradation Rate
        </h2>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-muted/20 animate-pulse rounded-lg"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-5">
          {batteries.map((battery) => {
            const statusColor = getBatteryStatusColor(battery.status);
            const progressWidth = (battery.degradationRate / 2.5) * 100;
            const gradientColor = statusColor === 'text-success' ? 'from-success to-success/70' :
              statusColor === 'text-warning' ? 'from-warning to-warning/70' :
                statusColor === 'text-danger' ? 'from-danger to-danger/70' :
                  'from-primary to-primary/70';

            return (
              <div key={battery.id}>
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-medium">{battery.name}</div>
                  <div className={`text-sm font-medium ${statusColor}`}>{battery.degradationRate}% / month</div>
                </div>
                <div className="h-2 bg-muted/30 rounded-full overflow-hidden backdrop-blur-sm">
                  <div
                    className={`h-full bg-gradient-to-r ${gradientColor}`}
                    style={{ width: `${progressWidth}%` }}
                  />
                </div>
              </div>
            );
          })}

          <div className="mt-6 pt-4 border-t border-border/30">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">Average degradation</span>
              <span className={`text-base font-bold ${averageStatusColor}`}>{averageDegradation.toFixed(2)}% / month</span>
            </div>

            <div className="mt-2 h-3 bg-muted/30 rounded-full overflow-hidden backdrop-blur-sm">
              <div
                className={`h-full bg-gradient-to-r ${averageStatusColor === 'text-success' ? 'from-success to-success/70' :
                    averageStatusColor === 'text-warning' ? 'from-warning to-warning/70' :
                      'from-danger to-danger/70'
                  }`}
                style={{ width: `${averageDegradationWidth}%` }}
              />
            </div>

            <div className="mt-4 text-xs text-muted-foreground">
              <p>Optimal degradation rate is below 0.8% per month</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
