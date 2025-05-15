import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Battery } from "@shared/schema";
import BatteryIcon from "@/components/ui/battery-icon";
import { getBatteryStatusColor } from "@/lib/utils/battery";
import { Link } from "wouter";

interface BatteryStatusCardProps {
  battery: Battery;
}

export default function BatteryStatusCard({ battery }: BatteryStatusCardProps) {
  const statusColor = getBatteryStatusColor(battery.status);
  
  // Calculate health change direction
  const healthChange = battery.healthPercentage > 90 ? 2 : 
                      battery.healthPercentage < 70 ? -4 : 0;
  
  return (
    <Link href={`/battery/${battery.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BatteryIcon 
                percentage={battery.healthPercentage} 
                status={battery.status} 
              />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-neutral-lighter truncate">
                  {battery.name}
                </dt>
                <dd>
                  <div className="flex items-baseline">
                    <div className={`text-2xl font-semibold ${statusColor}`}>
                      {battery.healthPercentage}%
                    </div>
                    {healthChange !== 0 && (
                      <div className={`ml-2 flex items-baseline text-sm font-medium ${healthChange > 0 ? 'text-success' : 'text-danger'}`}>
                        <i className={`${healthChange > 0 ? 'ri-arrow-up-s-fill' : 'ri-arrow-down-s-fill'} text-xl`}></i>
                        <span className="sr-only">{healthChange > 0 ? 'Increased' : 'Decreased'} by</span>
                        {Math.abs(healthChange)}%
                      </div>
                    )}
                    {healthChange === 0 && (
                      <div className="ml-2 flex items-baseline text-sm font-medium text-neutral-lighter">
                        <i className="ri-subtract-line"></i>
                        <span className="sr-only">No change</span>
                        0%
                      </div>
                    )}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 px-5 py-3 border-t">
          <div className="text-sm flex justify-between w-full">
            <span className="font-medium text-neutral-light">{battery.cycleCount} cycles</span>
            <span className={`font-medium ${statusColor}`}>{battery.status}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
