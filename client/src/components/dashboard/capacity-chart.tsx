import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { Battery, BatteryHistory } from "@shared/schema";
import { getBatteryStatusColor } from "@/lib/utils/battery";
import { format, subDays } from "date-fns";

interface CapacityChartProps {
  batteries: Battery[];
  timeRange: number;
  isLoading: boolean;
  detailed?: boolean;
}

export default function CapacityChart({ batteries, timeRange, isLoading, detailed = false }: CapacityChartProps) {
  // Get all battery histories
  const batteryHistoryQueries = batteries.map(battery => 
    useQuery<BatteryHistory[]>({
      queryKey: [`/api/batteries/${battery.id}/history`],
      enabled: batteries.length > 0
    })
  );

  // Check if all queries are loaded
  const isHistoryLoading = batteryHistoryQueries.some(query => query.isLoading);
  const hasHistoryError = batteryHistoryQueries.some(query => query.isError);

  // Prepare chart data
  const prepareChartData = () => {
    if (isHistoryLoading || hasHistoryError || batteries.length === 0) {
      return [];
    }

    // Generate dates for x-axis
    const dates = [];
    const today = new Date();
    
    // For monthly data (12 months)
    if (timeRange >= 365 || detailed) {
      for (let i = 11; i >= 0; i--) {
        const date = new Date(today);
        date.setMonth(today.getMonth() - i);
        dates.push(format(date, 'MMM'));
      }
    } 
    // For daily data
    else {
      const interval = Math.ceil(timeRange / 12); // Show ~12 labels
      for (let i = timeRange - 1; i >= 0; i -= interval) {
        dates.push(format(subDays(today, i), 'd MMM'));
      }
      dates.push(format(today, 'd MMM'));
    }

    // Combine all data
    return dates.map((date, index) => {
      const dataPoint: any = { date };
      
      batteries.forEach((battery, batteryIndex) => {
        // Get battery history data
        const historyData = batteryHistoryQueries[batteryIndex].data;
        if (!historyData) return;
        
        // Use the actual historical data point or extrapolate
        const normalizedIndex = Math.floor((index / (dates.length - 1)) * (historyData.length - 1));
        const historyPoint = historyData[normalizedIndex];
        
        if (historyPoint) {
          dataPoint[battery.name] = historyPoint.healthPercentage;
        } else {
          // Fallback if no data
          dataPoint[battery.name] = battery.healthPercentage;
        }
      });
      
      return dataPoint;
    });
  };

  const chartData = prepareChartData();

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-heading font-semibold text-neutral">
            Battery Capacity Over Time
          </h2>
          <div>
            <button className="text-sm text-neutral-lighter hover:text-primary">
              <i className="ri-more-2-fill text-xl"></i>
            </button>
          </div>
        </div>
        
        <div className={`chart-container ${detailed ? 'h-[350px]' : ''}`}>
          {isLoading || isHistoryLoading ? (
            <div className="h-full w-full bg-gray-100 animate-pulse rounded-md flex items-center justify-center">
              <span className="text-neutral-lighter">Loading chart data...</span>
            </div>
          ) : hasHistoryError ? (
            <div className="h-full w-full bg-red-50 rounded-md flex items-center justify-center">
              <span className="text-red-500">Failed to load chart data</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[50, 100]} />
                <Tooltip />
                <Legend />
                {batteries.map((battery) => (
                  <Line
                    key={battery.id}
                    type="monotone"
                    dataKey={battery.name}
                    stroke={getBatteryStatusColor(battery.status).replace('text-', '#')}
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
