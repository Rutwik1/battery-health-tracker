"use client";

import { useState, useEffect } from 'react';
import { Battery, BatteryHistory } from '@/lib/db/schema';
import { formatDate, getChartColor } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';

export default function PerformanceMetrics() {
  const [batteries, setBatteries] = useState<Battery[]>([]);
  const [batteryHistory, setBatteryHistory] = useState<Record<number, BatteryHistory[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState(3); // months

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch batteries
        const batteriesResponse = await fetch('/api/batteries');
        if (!batteriesResponse.ok) {
          throw new Error('Failed to fetch batteries');
        }
        const batteriesData = await batteriesResponse.json();
        setBatteries(batteriesData);
        
        // Fetch history for each battery
        const historyData: Record<number, BatteryHistory[]> = {};
        
        await Promise.all(batteriesData.map(async (battery: Battery) => {
          const historyResponse = await fetch(`/api/batteries/${battery.id}/history`);
          if (historyResponse.ok) {
            const history = await historyResponse.json();
            historyData[battery.id] = history;
          }
        }));
        
        setBatteryHistory(historyData);
      } catch (err) {
        setError('Error loading performance data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Function to filter data based on time range
  const getFilteredData = () => {
    const threshold = new Date();
    threshold.setMonth(threshold.getMonth() - timeRange);
    
    const chartData: any[] = [];
    const allDates = new Set<string>();
    
    // Collect all dates and prepare data structure
    Object.entries(batteryHistory).forEach(([batteryId, history]) => {
      history.forEach(entry => {
        const entryDate = new Date(entry.date);
        if (entryDate >= threshold) {
          allDates.add(formatDate(entry.date as string, "MMM d"));
        }
      });
    });
    
    // Sort dates chronologically
    const sortedDates = Array.from(allDates).sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    });
    
    // Create data points for each date
    sortedDates.forEach(date => {
      const dataPoint: any = { date };
      
      batteries.forEach(battery => {
        const history = batteryHistory[battery.id] || [];
        const entry = history.find(h => formatDate(h.date as string, "MMM d") === date);
        
        if (entry) {
          dataPoint[`battery${battery.id}`] = Number(entry.health);
          dataPoint[`batteryName${battery.id}`] = battery.name;
        }
      });
      
      chartData.push(dataPoint);
    });
    
    return chartData;
  };

  if (isLoading) {
    return <Skeleton className="w-full h-[300px] rounded-xl" />;
  }

  if (error) {
    return (
      <div className="text-center p-6 text-danger">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 text-sm underline hover:text-danger/80"
        >
          Try again
        </button>
      </div>
    );
  }

  const chartData = getFilteredData();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Battery Health Over Time</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange(1)}
            className={`px-2 py-1 text-xs rounded-full ${
              timeRange === 1 
                ? 'bg-primary/20 text-primary' 
                : 'bg-muted/20 text-muted-foreground hover:bg-muted/30'
            }`}
          >
            1M
          </button>
          <button
            onClick={() => setTimeRange(3)}
            className={`px-2 py-1 text-xs rounded-full ${
              timeRange === 3 
                ? 'bg-primary/20 text-primary' 
                : 'bg-muted/20 text-muted-foreground hover:bg-muted/30'
            }`}
          >
            3M
          </button>
          <button
            onClick={() => setTimeRange(6)}
            className={`px-2 py-1 text-xs rounded-full ${
              timeRange === 6 
                ? 'bg-primary/20 text-primary' 
                : 'bg-muted/20 text-muted-foreground hover:bg-muted/30'
            }`}
          >
            6M
          </button>
          <button
            onClick={() => setTimeRange(12)}
            className={`px-2 py-1 text-xs rounded-full ${
              timeRange === 12 
                ? 'bg-primary/20 text-primary' 
                : 'bg-muted/20 text-muted-foreground hover:bg-muted/30'
            }`}
          >
            12M
          </button>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="date" 
              stroke="rgba(255,255,255,0.5)" 
              tick={{ fill: 'rgba(255,255,255,0.7)' }}
            />
            <YAxis 
              domain={[0, 100]} 
              stroke="rgba(255,255,255,0.5)" 
              tick={{ fill: 'rgba(255,255,255,0.7)' }}
              label={{ 
                value: 'Health %', 
                angle: -90, 
                position: 'insideLeft',
                style: { fill: 'rgba(255,255,255,0.7)' }
              }} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 15, 30, 0.9)',
                borderColor: 'rgba(255,255,255,0.2)',
                color: 'rgba(255,255,255,0.9)',
                borderRadius: '0.5rem'
              }}
              formatter={(value: any, name: string) => {
                const batteryId = name.replace('battery', '');
                const batteryName = chartData[0]?.[`batteryName${batteryId}`] || name;
                return [value + '%', batteryName];
              }}
              labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
            />
            <Legend 
              formatter={(value: string) => {
                const batteryId = value.replace('battery', '');
                const battery = batteries.find(b => b.id === parseInt(batteryId));
                return battery ? battery.name : value;
              }}
              wrapperStyle={{ color: 'rgba(255,255,255,0.7)' }}
            />
            {batteries.map((battery) => (
              <Line
                key={battery.id}
                type="monotone"
                dataKey={`battery${battery.id}`}
                stroke={getChartColor(battery.id)}
                strokeWidth={2}
                dot={{ r: 3, fill: getChartColor(battery.id) }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}