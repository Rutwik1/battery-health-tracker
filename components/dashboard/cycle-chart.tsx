'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Battery as BatteryType } from '../../app/types/schema';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { calculateRemainingCycles } from '../../lib/utils';

interface CycleChartProps {
  batteries: BatteryType[];
  isLoading: boolean;
}

export default function CycleChart({ batteries, isLoading }: CycleChartProps) {
  // Prepare data for the chart
  const chartData = batteries.map(battery => {
    const remaining = calculateRemainingCycles(battery.cycleCount, battery.expectedCycles);
    
    return {
      name: battery.name,
      id: battery.id,
      used: battery.cycleCount,
      remaining: remaining,
      total: battery.expectedCycles,
      status: battery.status
    };
  });

  // Function to determine color based on battery status
  const getBarColors = (battery: BatteryType) => {
    switch (battery.status) {
      case "Excellent":
        return { used: "#10b981", remaining: "#d1fae5" };
      case "Good":
        return { used: "#6366f1", remaining: "#e0e7ff" };
      case "Fair":
        return { used: "#f59e0b", remaining: "#fef3c7" };
      case "Poor":
        return { used: "#ef4444", remaining: "#fee2e2" };
      default:
        return { used: "#6b7280", remaining: "#f3f4f6" };
    }
  };

  // Create a loading skeleton
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

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Battery Cycle Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {batteries.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-muted-foreground mb-2">No battery data available</p>
              <p className="text-sm text-muted-foreground">Add batteries to view cycle information</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
                barGap={10}
                barSize={25}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fill: 'rgba(255,255,255,0.7)' }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fill: 'rgba(255,255,255,0.7)' }}
                  label={{ 
                    value: 'Cycles', 
                    angle: -90, 
                    position: 'insideLeft',
                    fill: 'rgba(255,255,255,0.7)'
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(17, 24, 39, 0.9)',
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    color: 'rgba(255, 255, 255, 0.9)'
                  }}
                  itemStyle={{ color: 'rgba(255, 255, 255, 0.9)' }}
                  formatter={(value) => [`${value} cycles`, '']}
                  labelFormatter={(label) => `Battery: ${label}`}
                />
                <Bar 
                  dataKey="used" 
                  name="Used Cycles" 
                  stackId="a"
                  radius={[4, 4, 0, 0]}
                >
                  {chartData.map((entry, index) => {
                    const colors = getBarColors(batteries[index]);
                    return <Cell key={`cell-used-${index}`} fill={colors.used} />
                  })}
                </Bar>
                <Bar 
                  dataKey="remaining" 
                  name="Remaining Cycles" 
                  stackId="a"
                  radius={[4, 4, 0, 0]}
                >
                  {chartData.map((entry, index) => {
                    const colors = getBarColors(batteries[index]);
                    return <Cell key={`cell-remaining-${index}`} fill={colors.remaining} />
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}