import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { Battery } from "@shared/schema";
import { getBatteryStatusColor } from "@/lib/utils/battery";
import { apiFetch } from "@/lib/api"; // Import apiFetch

export default function CycleChart() {
  // Fetch batteries from the API
  const { data: batteries, isLoading } = useQuery<Battery[]>({
    queryKey: ['/api/batteries'],
    queryFn: () => apiFetch('/api/batteries')
  });

  // Convert status colors to CSS variables
  const getBarColors = (battery: Battery) => {
    const statusColor = getBatteryStatusColor(battery.status);
    switch (statusColor) {
      case 'text-success': return 'hsl(var(--success))';
      case 'text-warning': return 'hsl(var(--warning))';
      case 'text-danger': return 'hsl(var(--danger))';
      default: return 'hsl(var(--primary))';
    }
  };

  // Prepare chart data
  const chartData = batteries?.map(battery => ({
    name: battery.name,
    cycles: battery.cycleCount,
    expectedCycles: battery.expectedCycles,
    color: getBarColors(battery),
  })) ?? [];

  // Custom Tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentUsed = Math.round((data.cycles / data.expectedCycles) * 100);

      return (
        <div className="bg-muted/90 p-3 rounded-lg border border-border/50 backdrop-blur-md shadow-lg">
          <p className="text-xs font-medium text-foreground mb-2">{label}</p>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }} />
            <p className="text-xs">
              <span className="font-medium">Cycles:</span>{' '}
              <span className="text-foreground">{data.cycles}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-muted-foreground/50" />
            <p className="text-xs">
              <span className="font-medium">Expected:</span>{' '}
              <span className="text-foreground">{data.expectedCycles}</span>
            </p>
          </div>
          <div className="mt-1 pt-1 border-t border-border/30">
            <p className="text-xs">
              <span className="font-medium">Usage:</span>{' '}
              <span className="text-foreground">{percentUsed}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      {isLoading ? (
        <div className="h-full w-full bg-muted/20 animate-pulse rounded-lg flex items-center justify-center">
          <span className="text-muted-foreground">Loading chart data...</span>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            barSize={40}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} vertical={false} />
            <XAxis
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="cycles"
              name="Charge Cycles"
              radius={6}
              background={{ fill: 'hsl(var(--muted))', radius: 6 }}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
