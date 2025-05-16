'use client'

import React, { useMemo } from 'react'
import { format, subDays } from 'date-fns'
import { Battery, BatteryHistory } from '@/lib/store/batteryStore'
import { getBatteryStatusColor, formatNumber } from '@/lib/utils'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'

interface CapacityChartProps {
  batteries: Battery[];
  timeRange: number;
  isLoading: boolean;
  detailed?: boolean;
}

export default function CapacityChart({ batteries, timeRange, isLoading, detailed = false }: CapacityChartProps) {
  // Generate sample data for demonstration
  const chartData = useMemo(() => {
    if (batteries.length === 0) return []
    
    const days = timeRange
    const now = new Date()
    const data: Array<{
      date: string;
      [key: string]: string | number;
    }> = []
    
    // Create date points from past to now
    for (let i = days; i >= 0; i--) {
      const date = subDays(now, i)
      const formattedDate = format(date, 'MMM dd')
      const dataPoint: { date: string; [key: string]: string | number } = { date: formattedDate }
      
      // For each battery, calculate its health at this date point
      batteries.forEach(battery => {
        // Calculate health at this point (this is a simplified model)
        const daysPassed = days - i
        const healthDecreasePerDay = battery.degradationRate / 30 // Convert monthly to daily rate
        
        // Initial health is the current plus the degradation over the time period
        const initialHealth = Math.min(100, battery.healthPercentage + (healthDecreasePerDay * daysPassed))
        
        // Add to data point using battery name as key
        dataPoint[battery.name] = initialHealth
      })
      
      data.push(dataPoint)
    }
    
    return data
  }, [batteries, timeRange])
  
  const getLineColors = (battery: Battery) => {
    const statusColor = getBatteryStatusColor(battery.status)
    
    // Extract the color code (assuming tailwind text-* classes)
    // We want to convert something like 'text-success' to 'rgb(var(--success))' 
    // Since these are custom properties in our CSS
    const colorKey = statusColor.replace('text-', '')
    return `rgb(var(--${colorKey}))`
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-muted/10 rounded-md">
        <div className="animate-pulse space-y-4 w-full px-8">
          <div className="h-4 bg-muted/30 rounded w-1/4 mx-auto"></div>
          <div className="h-[200px] bg-muted/20 rounded"></div>
          <div className="flex justify-center space-x-2">
            <div className="h-3 w-16 bg-muted/30 rounded"></div>
            <div className="h-3 w-16 bg-muted/30 rounded"></div>
            <div className="h-3 w-16 bg-muted/30 rounded"></div>
          </div>
        </div>
      </div>
    )
  }
  
  if (batteries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-muted/10 rounded-md p-8">
        <p className="text-muted-foreground mb-2">No battery data to display</p>
        <button className="px-3 py-1 text-sm border border-border rounded-md hover:bg-muted transition-colors">
          Add Battery
        </button>
      </div>
    )
  }
  
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
          <XAxis 
            dataKey="date" 
            stroke="var(--muted-foreground)" 
            fontSize={12}
            tickMargin={10} 
          />
          <YAxis 
            stroke="var(--muted-foreground)" 
            fontSize={12}
            tickFormatter={(value) => `${value}%`}
            domain={[0, 100]}
            tickMargin={10}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
              borderRadius: '0.375rem',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
            }}
            itemStyle={{ padding: '2px 0' }}
            formatter={(value: number, name: string) => [
              `${value.toFixed(1)}%`, 
              name
            ]}
            labelStyle={{ 
              color: 'var(--muted-foreground)',
              marginBottom: '4px',
              fontSize: '14px'
            }}
          />
          <Legend 
            formatter={(value) => (
              <span style={{ color: 'var(--foreground)', fontSize: '14px' }}>{value}</span>
            )}
          />
          {batteries.map((battery) => (
            <Line
              key={battery.id}
              type="monotone"
              dataKey={battery.name}
              stroke={getLineColors(battery)}
              strokeWidth={2}
              dot={{ r: 3, strokeWidth: 1 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}