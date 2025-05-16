'use client'

import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Battery } from '@/lib/store/batteryStore'
import { getBatteryStatusColor } from '@/lib/utils'

interface CycleChartProps {
  batteries: Battery[];
  isLoading: boolean;
}

export default function CycleChart({ batteries, isLoading }: CycleChartProps) {
  // Prepare chart data
  const chartData = batteries.map(battery => {
    const percentUsed = (battery.cycleCount / battery.expectedCycles) * 100
    return {
      name: battery.name,
      cycles: battery.cycleCount,
      remaining: battery.expectedCycles - battery.cycleCount,
      percentUsed: Math.min(percentUsed, 100).toFixed(1)
    }
  })

  // Convert status colors to CSS variables
  const getBarColors = (battery: Battery) => {
    const statusColor = getBatteryStatusColor(battery.status)
    switch(statusColor) {
      case 'text-success': return 'hsl(var(--success))'
      case 'text-warning': return 'hsl(var(--warning))'
      case 'text-danger': return 'hsl(var(--danger))'
      default: return 'hsl(var(--primary))'
    }
  }

  // Custom Tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-muted/90 p-3 rounded-lg border border-border/50 backdrop-blur-md shadow-lg">
          <p className="text-xs font-medium text-foreground mb-2">{label}</p>
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: payload[0].fill }}
            />
            <p className="text-xs">
              <span className="font-medium">Used Cycles:</span>{' '}
              <span className="text-foreground">{payload[0].value}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-3 h-3 rounded-full bg-muted-foreground/30"
            />
            <p className="text-xs">
              <span className="font-medium">Remaining:</span>{' '}
              <span className="text-foreground">{payload[1]?.value}</span>
            </p>
          </div>
          <div className="mt-1 pt-1 border-t border-border/50">
            <p className="text-xs">
              <span className="font-medium">Lifespan Used:</span>{' '}
              <span className="text-foreground">{payload[0].payload.percentUsed}%</span>
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-[300px]">
      {isLoading ? (
        <div className="h-full w-full bg-muted/20 animate-pulse rounded-lg flex items-center justify-center">
          <span className="text-muted-foreground">Loading chart data...</span>
        </div>
      ) : chartData.length === 0 ? (
        <div className="h-full w-full bg-danger/10 rounded-lg flex items-center justify-center border border-danger/20">
          <span className="text-danger">No battery data available</span>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} horizontal={false} />
            <XAxis 
              type="number" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {batteries.map((battery, index) => (
              <Bar 
                key={`cycles-${index}`} 
                dataKey="cycles" 
                stackId="a" 
                fill={getBarColors(battery)} 
                radius={[4, 0, 0, 4]}
              />
            ))}
            <Bar 
              dataKey="remaining" 
              stackId="a" 
              fill="hsl(var(--muted-foreground)/0.2)" 
              radius={[0, 4, 4, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}