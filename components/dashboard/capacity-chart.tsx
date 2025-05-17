'use client';

import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend, ReferenceLine
} from 'recharts';
import { Battery } from '../../app/types/schema';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '../../components/ui/toggle-group';
import { formatNumber } from '../../lib/utils';

interface CapacityChartProps {
  batteries: Battery[];
  timeRange: number;
  isLoading: boolean;
  detailed?: boolean;
}

export default function CapacityChart({ 
  batteries, 
  timeRange, 
  isLoading, 
  detailed = false 
}: CapacityChartProps) {
  const [selectedBatteries, setSelectedBatteries] = useState<string[]>(
    batteries.slice(0, 2).map(b => b.id.toString())
  );

  // Generate time labels for the chart (last 30 days by default)
  const generateTimeLabels = () => {
    const labels = [];
    const today = new Date();
    
    for (let i = timeRange; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    
    return labels;
  };

  // Generate data points using demo data
  const generateChartData = () => {
    const timeLabels = generateTimeLabels();
    const chartData = [];

    // Generate data points for each time label
    for (let i = 0; i < timeLabels.length; i++) {
      const dataPoint: any = { date: timeLabels[i] };

      // Add capacity data for each battery
      batteries.forEach(battery => {
        // Calculate a slightly decreasing capacity over time
        const daysPassed = timeRange - i;
        const dailyDegradation = battery.degradationRate / 30;
        const totalDegradation = dailyDegradation * daysPassed;
        
        const capacityPercentage = Math.max(battery.healthPercentage, 100 - totalDegradation);
        const capacity = Math.round((battery.initialCapacity * capacityPercentage) / 100);
        
        dataPoint[`battery${battery.id}`] = capacity;
      });
      
      chartData.push(dataPoint);
    }
    
    return chartData;
  };

  // Get line colors based on battery status
  const getLineColors = (battery: Battery) => {
    switch (battery.status) {
      case "Excellent":
        return "#10b981";
      case "Good":
        return "#6366f1";
      case "Fair":
        return "#f59e0b";
      case "Poor":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  // Toggle battery selection
  const toggleBattery = (batteryId: string) => {
    setSelectedBatteries(prev => {
      if (prev.includes(batteryId)) {
        return prev.filter(id => id !== batteryId);
      } else {
        return [...prev, batteryId];
      }
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center">
            <div className="h-5 w-32 bg-muted/20 animate-pulse rounded"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full bg-muted/10 animate-pulse rounded"></div>
        </CardContent>
      </Card>
    );
  }

  const chartData = generateChartData();

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Battery Capacity Trends</CardTitle>
      </CardHeader>
      <CardContent>
        {batteries.length > 0 && (
          <div className="mb-4">
            <ToggleGroup type="multiple" variant="outline" className="justify-start">
              {batteries.map(battery => (
                <ToggleGroupItem 
                  key={battery.id}
                  value={battery.id.toString()}
                  aria-label={`Toggle ${battery.name}`}
                  pressed={selectedBatteries.includes(battery.id.toString())}
                  onClick={() => toggleBattery(battery.id.toString())}
                  className="text-xs sm:text-sm"
                >
                  <div 
                    className="w-2 h-2 rounded-full mr-1.5" 
                    style={{ backgroundColor: getLineColors(battery) }}
                  />
                  {detailed ? battery.name : battery.name.split(' ')[0]}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        )}

        <div className="h-[280px] w-full">
          {batteries.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-muted-foreground mb-2">No battery data available</p>
              <p className="text-sm text-muted-foreground">Add batteries to view capacity trends</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 20, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} 
                  stroke="rgba(255,255,255,0.5)"
                />
                <YAxis 
                  tickFormatter={(value) => `${formatNumber(value)}`} 
                  tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                  stroke="rgba(255,255,255,0.5)"
                  label={{ 
                    value: 'Capacity (mAh)', 
                    angle: -90, 
                    position: 'insideLeft',
                    fill: 'rgba(255,255,255,0.7)',
                    fontSize: 12
                  }}
                />
                <Tooltip 
                  formatter={(value) => [`${formatNumber(value)} mAh`, '']}
                  contentStyle={{
                    backgroundColor: 'rgba(17, 24, 39, 0.9)',
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    color: 'rgba(255, 255, 255, 0.9)'
                  }}
                />
                <Legend />
                
                {batteries.map(battery => (
                  selectedBatteries.includes(battery.id.toString()) && (
                    <Line
                      key={battery.id}
                      type="monotone"
                      dataKey={`battery${battery.id}`}
                      name={battery.name}
                      stroke={getLineColors(battery)}
                      strokeWidth={2}
                      dot={{ r: 3, strokeWidth: 1 }}
                      activeDot={{ r: 5, strokeWidth: 0 }}
                    />
                  )
                ))}
                
                {/* Add warning threshold at 70% capacity */}
                {batteries.map(battery => (
                  selectedBatteries.includes(battery.id.toString()) && (
                    <ReferenceLine 
                      key={`threshold-${battery.id}`}
                      y={battery.initialCapacity * 0.7}
                      stroke="rgba(245, 158, 11, 0.4)"
                      strokeDasharray="3 3"
                    />
                  )
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}