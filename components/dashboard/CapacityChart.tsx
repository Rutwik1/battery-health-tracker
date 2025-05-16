'use client'

import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useBatteryStore, Battery, BatteryHistory } from '@/lib/store/batteryStore'
import { getBatteryStatusColor } from '@/lib/utils'
import { format, subDays } from 'date-fns'

interface CapacityChartProps {
  batteries: Battery[];
  timeRange: number;
  isLoading: boolean;
  detailed?: boolean;
}

export default function CapacityChart({ batteries, timeRange, isLoading, detailed = false }: CapacityChartProps) {
  const [chartData, setChartData] = useState<any[]>([])
  const { batteryHistories } = useBatteryStore()
  
  // Prepare chart data whenever batteries or time range changes
  useEffect(() => {
    if (isLoading || batteries.length === 0) {
      setChartData([])
      return
    }

    // Generate dates for x-axis
    const dates: string[] = []
    const today = new Date()
    
    // For monthly data (12 months)
    if (timeRange >= 365 || detailed) {
      for (let i = 11; i >= 0; i--) {
        const date = new Date(today)
        date.setMonth(today.getMonth() - i)
        dates.push(format(date, 'MMM'))
      }
    } 
    // For daily data
    else {
      const interval = Math.ceil(timeRange / 12) // Show ~12 labels
      for (let i = timeRange - 1; i >= 0; i -= interval) {
        dates.push(format(subDays(today, i), 'd MMM'))
      }
      dates.push(format(today, 'd MMM'))
    }

    // Combine all data
    const data = dates.map((date, index) => {
      const dataPoint: any = { date }
      
      batteries.forEach((battery) => {
        // Get battery history data
        const historyData = batteryHistories[battery.id] || []
        if (historyData.length === 0) return
        
        // Use the actual historical data point or extrapolate
        const normalizedIndex = Math.floor((index / (dates.length - 1)) * (historyData.length - 1))
        const historyPoint = historyData[normalizedIndex]
        
        if (historyPoint) {
          dataPoint[battery.name] = historyPoint.healthPercentage
        } else {
          // Fallback if no data
          dataPoint[battery.name] = battery.healthPercentage
        }
      })
      
      return dataPoint
    })

    setChartData(data)
  }, [batteries, timeRange, isLoading, batteryHistories, detailed])

  // Convert status colors to CSS variables
  const getLineColors = (battery: Battery) => {
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
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center gap-2 mb-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.stroke }}
              />
              <p className="text-xs">
                <span className="font-medium">{entry.name}:</span>{' '}
                <span className="text-foreground">{entry.value}%</span>
              </p>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className={`chart-container ${detailed ? 'h-[350px]' : 'h-[300px]'}`}>
      {isLoading ? (
        <div className="h-full w-full bg-muted/20 animate-pulse rounded-lg flex items-center justify-center">
          <span className="text-muted-foreground">Loading chart data...</span>
        </div>
      ) : chartData.length === 0 ? (
        <div className="h-full w-full bg-danger/10 rounded-lg flex items-center justify-center border border-danger/20">
          <span className="text-danger">Failed to load chart data</span>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              domain={[50, 100]} 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ 
                fontSize: "12px", 
                color: "hsl(var(--muted-foreground))" 
              }}
            />
            {batteries.map((battery) => (
              <Line
                key={battery.id}
                type="monotone"
                dataKey={battery.name}
                stroke={getLineColors(battery)}
                activeDot={{ r: 6, fill: getLineColors(battery), strokeWidth: 1 }}
                strokeWidth={2.5}
                dot={{ r: 4, fill: "hsl(var(--background))", strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}