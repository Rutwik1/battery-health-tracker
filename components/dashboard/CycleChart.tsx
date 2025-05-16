'use client'

import React from 'react'
import { format } from 'date-fns'
import { Battery } from '@/lib/store/batteryStore'
import { getBatteryStatusColor, formatNumber } from '@/lib/utils'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ReferenceLine
} from 'recharts'

interface CycleChartProps {
  batteries: Battery[];
  isLoading: boolean;
}

export default function CycleChart({ batteries, isLoading }: CycleChartProps) {
  const chartData = batteries.map(battery => ({
    name: battery.name,
    cycles: battery.cycleCount,
    expected: battery.expectedCycles,
    status: battery.status,
    used: Math.round((battery.cycleCount / battery.expectedCycles) * 100),
  }))
  
  const getBarColors = (battery: Battery) => {
    const statusColor = getBatteryStatusColor(battery.status)
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
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          barSize={40}
          barGap={8}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="var(--muted-foreground)" 
            fontSize={12}
            tickMargin={10} 
          />
          <YAxis
            stroke="var(--muted-foreground)"
            fontSize={12}
            tickFormatter={(value) => formatNumber(value)}
            label={{ 
              value: 'Charge Cycles', 
              angle: -90, 
              position: 'insideLeft',
              style: { 
                textAnchor: 'middle',
                fill: 'var(--muted-foreground)',
                fontSize: 12
              }
            }}
          />
          <Tooltip
            contentStyle={{ 
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
              borderRadius: '0.375rem',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
            }}
            itemStyle={{ padding: '2px 0' }}
            formatter={(value: number, name: string) => {
              if (name === 'cycles') return [`${formatNumber(value)} cycles`, 'Current']
              if (name === 'expected') return [`${formatNumber(value)} cycles`, 'Expected Lifespan']
              if (name === 'used') return [`${value}%`, 'Used Lifespan']
              return [value, name]
            }}
            labelStyle={{ 
              color: 'var(--muted-foreground)',
              marginBottom: '4px',
              fontSize: '14px'
            }}
          />
          <Legend 
            formatter={(value, entry) => {
              const displayName = {
                cycles: 'Current Cycles',
                expected: 'Expected Lifespan'
              }[value as string] || value
              
              return <span style={{ color: 'var(--foreground)', fontSize: '14px' }}>{displayName}</span>
            }}
          />
          <Bar 
            dataKey="cycles" 
            radius={[4, 4, 0, 0]}
          >
            {chartData.map((entry, index) => {
              const battery = batteries[index]
              return (
                <Cell 
                  key={`cycles-${index}`}
                  fill={getBarColors(battery)} 
                  fillOpacity={0.8}
                />
              )
            })}
          </Bar>
          <Bar 
            dataKey="expected" 
            radius={[4, 4, 0, 0]}
            fillOpacity={0.15}
          >
            {chartData.map((entry, index) => {
              const battery = batteries[index]
              return (
                <Cell 
                  key={`expected-${index}`}
                  fill={getBarColors(battery)}
                />
              )
            })}
          </Bar>
          
          {/* Critical Threshold Line at 80% of expected cycles */}
          <ReferenceLine 
            y={Math.max(...batteries.map(b => b.expectedCycles)) * 0.8} 
            stroke="var(--warning)" 
            strokeDasharray="3 3"
            label={{
              value: "80% Critical Threshold",
              position: "insideBottomLeft",
              fill: "var(--warning)",
              fontSize: 12
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}