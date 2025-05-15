import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Battery } from "@shared/schema";
import { getBatteryStatusColor } from "@/lib/utils/battery";

interface CycleChartProps {
  batteries: Battery[];
  isLoading: boolean;
}

export default function CycleChart({ batteries, isLoading }: CycleChartProps) {
  // Prepare chart data
  const chartData = batteries.map(battery => ({
    name: battery.name,
    cycles: battery.cycleCount,
    color: getBatteryStatusColor(battery.status).replace('text-', '#'),
  }));

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-heading font-semibold text-neutral">
            Charge Cycles by Battery
          </h2>
          <div>
            <button className="text-sm text-neutral-lighter hover:text-primary">
              <i className="ri-more-2-fill text-xl"></i>
            </button>
          </div>
        </div>
        
        <div className="chart-container">
          {isLoading ? (
            <div className="h-full w-full bg-gray-100 animate-pulse rounded-md flex items-center justify-center">
              <span className="text-neutral-lighter">Loading chart data...</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} cycles`, 'Cycles']}
                />
                <Legend />
                <Bar 
                  dataKey="cycles" 
                  name="Charge Cycles" 
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
