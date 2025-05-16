'use client'

import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { Battery } from '@/lib/store/batteryStore'
import { getBatteryStatusColor, formatNumber } from '@/lib/utils'

interface CycleChartProps {
  batteries: Battery[];
  isLoading: boolean;
}

export default function CycleChart({ batteries, isLoading }: CycleChartProps) {
  // Generate chart data for cycle comparison
  const data = batteries.map(battery => {
    const cyclePercentage = Math.round((battery.cycleCount / battery.expectedCycles) * 100)
    
    return {
      name: battery.name,
      cycleCount: battery.cycleCount,
      expectedCycles: battery.expectedCycles,
      cyclePercentage,
      status: battery.status,
      id: battery.id
    }
  })
  
  // Get color for bars based on battery status
  const getBarColors = (battery: Battery) => {
    const baseColor = getBatteryStatusColor(battery.status)
    
    switch (baseColor) {
      case 'text-success':
        return ['#10b981', '#065f46']
      case 'text-primary':
        return ['#3b82f6', '#1d4ed8']
      case 'text-warning':
        return ['#f59e0b', '#b45309']
      case 'text-destructive':
        return ['#ef4444', '#b91c1c']
      default:
        return ['#6b7280', '#374151']
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
      <BarChart
        data={data}
        layout="vertical"
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
        barGap={8}
        barSize={20}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" opacity={0.2} horizontal={false} />
        <XAxis 
          type="number" 
          tick={{ fontSize: 12 }} 
          stroke="#888888"
          tickMargin={5}
          axisLine={{ stroke: '#888888', strokeWidth: 1, opacity: 0.3 }}
          domain={[0, (dataMax: number) => Math.max(dataMax, Math.max(...batteries.map(b => b.expectedCycles)))]}
        />
        <YAxis 
          dataKey="name" 
          type="category" 
          scale="band" 
          tick={{ fontSize: 12 }} 
          stroke="#888888"
          tickMargin={5}
          width={100}
          axisLine={{ stroke: '#888888', strokeWidth: 1, opacity: 0.3 }}
        />
        <Tooltip 
          formatter={(value: number, name: string) => {
            if (name === 'cycleCount') return [`${formatNumber(value)} cycles`, 'Current Cycles']
            return [`${formatNumber(value)} cycles`, 'Expected Cycles']
          }}
          contentStyle={{
            backgroundColor: 'rgba(30, 30, 30, 0.8)',
            borderColor: 'rgba(100, 100, 100, 0.2)',
            borderRadius: '6px',
            fontSize: '12px'
          }}
          labelStyle={{ fontWeight: 'bold', marginBottom: '5px' }}
        />
        <Legend 
          formatter={(value) => {
            if (value === 'cycleCount') return <span style={{ fontSize: '12px', color: '#d1d5db' }}>Current Cycles</span>
            return <span style={{ fontSize: '12px', color: '#d1d5db' }}>Expected Cycles</span>
          }}
          iconSize={10}
          iconType="circle"
          wrapperStyle={{ paddingTop: '10px' }}
        />
        
        <Bar 
          dataKey="expectedCycles" 
          radius={[0, 4, 4, 0]}
          stackId="expected"
          opacity={0.3}
        >
          {batteries.map((battery, index) => {
            const colors = getBarColors(battery)
            return <Cell key={`expected-${index}`} fill={colors[1]} />
          })}
        </Bar>
        
        <Bar 
          dataKey="cycleCount" 
          radius={[0, 4, 4, 0]}
          stackId="current"
        >
          {batteries.map((battery, index) => {
            const colors = getBarColors(battery)
            return <Cell key={`current-${index}`} fill={colors[0]} />
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}