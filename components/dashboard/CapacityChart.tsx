'use client'

import React, { useEffect, useState } from 'react'
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Battery } from '@/lib/store/batteryStore'
import { getBatteryStatusColor, formatDate } from '@/lib/utils'

interface CapacityChartProps {
  batteries: Battery[];
  timeRange: number;
  isLoading: boolean;
  detailed?: boolean;
}

export default function CapacityChart({ batteries, timeRange, isLoading, detailed = false }: CapacityChartProps) {
  const [data, setData] = useState<any[]>([])
  
  // Generate chart data based on selected time frame and batteries
  useEffect(() => {
    if (batteries.length === 0) return
    
    // For detailed view of a single battery
    if (detailed && batteries.length === 1) {
      const battery = batteries[0]
      const today = new Date()
      const historyData = []
      
      // Generate data points for the specified number of days
      for (let i = timeRange - 1; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        
        // Calculate degradation for this point in time
        const dailyDegradation = battery.degradationRate / 30 // % per day
        const healthDecreaseTotal = dailyDegradation * i
        const healthAtThisPoint = Math.min(100, battery.healthPercentage + healthDecreaseTotal)
        
        historyData.push({
          date: formatDate(date, 'MMM dd'),
          [battery.name]: healthAtThisPoint
        })
      }
      
      setData(historyData)
      return
    }
    
    // For overview of multiple batteries
    const today = new Date()
    const historyData = []
    
    // Calculate number of data points based on time range
    let points = 12 // Default for yearly view
    let stepSize = Math.ceil(timeRange / points) // Days between points
    
    if (timeRange <= 30) {
      points = 6 // 6 points for 30 days
      stepSize = 5 // Every 5 days
    } else if (timeRange <= 90) {
      points = 9 // 9 points for 90 days
      stepSize = 10 // Every 10 days
    } else if (timeRange <= 180) {
      points = 12 // 12 points for 180 days
      stepSize = 15 // Every 15 days
    }
    
    // Generate data for chart
    for (let i = points - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - (i * stepSize))
      
      const dataPoint: any = {
        date: formatDate(date, 'MMM dd')
      }
      
      // Calculate health for each battery at this point in time
      batteries.forEach(battery => {
        const daysAgo = i * stepSize
        const dailyDegradation = battery.degradationRate / 30 // % per day
        const healthDecreaseTotal = dailyDegradation * daysAgo
        const healthAtThisPoint = Math.min(100, battery.healthPercentage + healthDecreaseTotal)
        
        dataPoint[battery.name] = healthAtThisPoint
      })
      
      historyData.push(dataPoint)
    }
    
    setData(historyData)
  }, [batteries, timeRange, detailed])
  
  // Generate line colors based on battery status
  const getLineColors = (battery: Battery) => {
    const baseColor = getBatteryStatusColor(battery.status)
    
    switch (baseColor) {
      case 'text-success':
        return '#10b981'
      case 'text-primary':
        return '#3b82f6'
      case 'text-warning':
        return '#f59e0b'
      case 'text-destructive':
        return '#ef4444'
      default:
        return '#6b7280'
    }
  }
  
  if (isLoading) {
    return <div className="w-full h-full flex items-center justify-center">Loading...</div>
  }
  
  if (batteries.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
        No battery data available
      </div>
    )
  }
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" opacity={0.2} />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12 }} 
          stroke="#888888"
          tickMargin={10}
        />
        <YAxis 
          domain={[0, 100]} 
          tick={{ fontSize: 12 }} 
          stroke="#888888"
          tickMargin={10}
          label={{ 
            value: 'Health %', 
            angle: -90, 
            position: 'insideLeft',
            style: { textAnchor: 'middle', fill: '#888888', fontSize: 12 },
            offset: -5
          }}
        />
        <Tooltip 
          formatter={(value: number) => [`${value.toFixed(1)}%`, 'Health']}
          contentStyle={{ 
            backgroundColor: 'rgba(30, 30, 30, 0.8)',
            borderColor: 'rgba(100, 100, 100, 0.2)',
            borderRadius: '6px',
            fontSize: '12px'
          }}
        />
        <Legend 
          verticalAlign="top" 
          height={36}
          formatter={(value) => <span style={{ fontSize: '12px', color: '#d1d5db' }}>{value}</span>}
        />
        
        {batteries.map((battery) => (
          <Line
            key={battery.id}
            type="monotone"
            dataKey={battery.name}
            stroke={getLineColors(battery)}
            strokeWidth={2}
            dot={detailed ? { r: 4, strokeWidth: 1 } : false}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}