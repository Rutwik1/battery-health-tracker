"use client"

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import * as Tabs from "@radix-ui/react-tabs"
import { format } from 'date-fns'

// Mock data representing a specific battery
const batteryDetails = {
  id: 1,
  name: "Battery #1",
  health: 94,
  status: "Excellent",
  statusColor: "bg-emerald-500",
  cycleCount: 156,
  maxCycles: 1000,
  capacity: 3760,
  initialCapacity: 4000,
  capacityUnit: "mAh",
  trend: 2,
  trendDirection: "up",
  serialNumber: "BAT-001",
  initialDate: new Date("2023-05-12"),
  lastUpdated: new Date("2025-05-17"),
  age: 24,
  avgCyclesPerMonth: 6,
  estimatedRemainingLife: 132,
  degradationRate: 0.5
}

// Mock data for usage patterns
const usagePatterns = {
  chargingFrequency: "Average 1.4 times per day",
  dischargeDepth: "Average to 26% before charging",
  chargeDuration: "Average 1 hour 42 minutes",
  operatingTemperature: "Average 28°C during usage"
}

// Mock data for recommendations
const recommendations = [
  { id: 1, message: "Avoid charging Battery #1 beyond 90% to extend lifespan." },
  { id: 2, message: "Optimal charging practice: keep battery between 20% and 80%." }
]

// Mock capacity history data (for chart)
const capacityHistory = [
  { month: "Jun", value: 95 },
  { month: "Jul", value: 95.2 },
  { month: "Aug", value: 95.5 },
  { month: "Sep", value: 95.8 },
  { month: "Oct", value: 96 },
  { month: "Nov", value: 96.2 },
  { month: "Dec", value: 96.5 },
  { month: "Jan", value: 97 },
  { month: "Feb", value: 97.5 },
  { month: "Mar", value: 98 },
  { month: "Apr", value: 98.5 },
  { month: "May", value: 99 }
]

export default function BatteryDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const batteryId = params.id

  const [activeTab, setActiveTab] = useState("capacity-history")

  // Helper function to render the health bar
  const renderHealthBar = (health: number) => {
    return (
      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full" 
          style={{ width: `${health}%` }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div className="flex justify-between items-center">
        <Link 
          href="/"
          className="flex items-center gap-2 bg-gray-900/50 hover:bg-gray-900/70 transition-colors px-3 py-2 rounded-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
          </svg>
          <span>Back to Dashboard</span>
        </Link>

        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
            <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
          </svg>
          <span>Export Data</span>
        </button>
      </div>

      {/* Battery Info Panel */}
      <div className="bg-gray-900/70 rounded-lg p-6 border border-indigo-900/30">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex justify-between items-center">
            <span>{batteryDetails.name}</span>
            <span className="text-sm px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
              {batteryDetails.status}
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mt-6">
            {/* Health */}
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Health</div>
              <div className="text-4xl font-bold text-white">{batteryDetails.health}%</div>
              {renderHealthBar(batteryDetails.health)}
            </div>

            {/* Capacity */}
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Capacity</div>
              <div className="text-4xl font-bold text-white">{batteryDetails.capacity} mAh</div>
              <div className="text-xs text-gray-500">Out of {batteryDetails.initialCapacity} mAh initial</div>
            </div>

            {/* Cycle Count */}
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Cycle Count</div>
              <div className="text-4xl font-bold text-white">{batteryDetails.cycleCount}</div>
              <div className="text-xs text-gray-500">Out of {batteryDetails.maxCycles} expected</div>
            </div>

            {/* Degradation Rate */}
            <div className="space-y-2">
              <div className="text-sm text-gray-500">Degradation Rate</div>
              <div className="text-4xl font-bold text-emerald-400">{batteryDetails.degradationRate}% / month</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">
            {/* Battery Information */}
            <div>
              <h3 className="text-sm text-gray-500 mb-4">Battery Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-sm text-gray-500">Serial Number</div>
                <div className="text-sm text-right">{batteryDetails.serialNumber}</div>
                
                <div className="text-sm text-gray-500">Initial Date</div>
                <div className="text-sm text-right">{format(batteryDetails.initialDate, 'MMM dd, yyyy')}</div>
                
                <div className="text-sm text-gray-500">Last Updated</div>
                <div className="text-sm text-right">{format(batteryDetails.lastUpdated, 'MMM dd, yyyy')}</div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div>
              <h3 className="text-sm text-gray-500 mb-4">Performance Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-sm text-gray-500">Age</div>
                <div className="text-sm text-right">{batteryDetails.age} months</div>
                
                <div className="text-sm text-gray-500">Avg. Cycles Per Month</div>
                <div className="text-sm text-right">{batteryDetails.avgCyclesPerMonth}</div>
                
                <div className="text-sm text-gray-500">Estimated Remaining Life</div>
                <div className="text-sm text-right">{batteryDetails.estimatedRemainingLife} months</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs.Root 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full"
      >
        <Tabs.List className="flex w-full bg-gray-900/70 rounded-lg border border-indigo-900/30 overflow-hidden" aria-label="Battery details">
          <Tabs.Trigger 
            value="capacity-history"
            className={`flex-1 py-3 px-4 text-center transition-colors ${activeTab === 'capacity-history' ? 'bg-indigo-900/50 text-white border-b-2 border-indigo-500' : 'text-gray-400 hover:text-white'}`}
          >
            Capacity History
          </Tabs.Trigger>
          <Tabs.Trigger 
            value="usage-patterns"
            className={`flex-1 py-3 px-4 text-center transition-colors ${activeTab === 'usage-patterns' ? 'bg-indigo-900/50 text-white border-b-2 border-indigo-500' : 'text-gray-400 hover:text-white'}`}
          >
            Usage Patterns
          </Tabs.Trigger>
          <Tabs.Trigger 
            value="recommendations"
            className={`flex-1 py-3 px-4 text-center transition-colors ${activeTab === 'recommendations' ? 'bg-indigo-900/50 text-white border-b-2 border-indigo-500' : 'text-gray-400 hover:text-white'}`}
          >
            Recommendations
          </Tabs.Trigger>
        </Tabs.List>

        {/* Capacity History Content */}
        <Tabs.Content value="capacity-history" className="mt-6">
          <div className="bg-gray-900/70 rounded-lg p-6 border border-indigo-900/30">
            <h3 className="text-xl font-semibold mb-4">Capacity Over Time</h3>
            
            <div className="h-72 w-full rounded bg-gray-900/50 p-4 flex flex-col">
              {/* Simple visualization of capacity over time */}
              <div className="text-xs text-gray-400 mb-2">100%</div>
              
              <div className="relative flex-1">
                {/* Y-axis labels */}
                <div className="absolute top-1/4 -left-6 text-xs text-gray-400">80%</div>
                <div className="absolute top-1/2 -left-6 text-xs text-gray-400">65%</div>
                <div className="absolute bottom-0 -left-6 text-xs text-gray-400">50%</div>
                
                {/* Horizontal gridlines */}
                <div className="absolute top-0 w-full h-px bg-gray-800"></div>
                <div className="absolute top-1/4 w-full h-px bg-gray-800"></div>
                <div className="absolute top-1/2 w-full h-px bg-gray-800"></div>
                <div className="absolute top-3/4 w-full h-px bg-gray-800"></div>
                <div className="absolute bottom-0 w-full h-px bg-gray-800"></div>
                
                {/* The actual line chart */}
                <svg className="absolute inset-0 w-full h-full overflow-visible">
                  <path 
                    d={`M 0,${100 - capacityHistory[0].value} ${capacityHistory.map((point, i) => 
                          `L ${(i / (capacityHistory.length - 1)) * 100}%,${100 - point.value}`).join(' ')}`}
                    fill="none" 
                    stroke="url(#lineGradient)" 
                    strokeWidth="2" 
                    className="transform scale-y-100" 
                  />
                  
                  {/* Data points */}
                  {capacityHistory.map((point, i) => (
                    <circle 
                      key={i}
                      cx={`${(i / (capacityHistory.length - 1)) * 100}%`} 
                      cy={`${100 - point.value}%`} 
                      r="4" 
                      className="fill-emerald-500" 
                    />
                  ))}
                  
                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#6366F1" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              
              {/* X-axis labels */}
              <div className="flex justify-between mt-2">
                {capacityHistory.map((point, i) => (
                  i % 2 === 0 ? <div key={i} className="text-xs text-gray-400">{point.month}</div> : <div key={i}></div>
                ))}
              </div>
              
              <div className="flex justify-center mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-sm text-gray-400">Battery #1</span>
                </div>
              </div>
            </div>
          </div>
        </Tabs.Content>

        {/* Usage Patterns Content */}
        <Tabs.Content value="usage-patterns" className="mt-6">
          <div className="bg-gray-900/70 rounded-lg p-6 border border-indigo-900/30">
            <h3 className="text-xl font-semibold mb-6">Usage Patterns</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Charging Frequency */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                  </svg>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Charging Frequency</div>
                  <div>{usagePatterns.chargingFrequency}</div>
                </div>
              </div>

              {/* Discharge Depth */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Discharge Depth</div>
                  <div>{usagePatterns.dischargeDepth}</div>
                </div>
              </div>

              {/* Charge Duration */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Charge Duration</div>
                  <div>{usagePatterns.chargeDuration}</div>
                </div>
              </div>

              {/* Operating Temperature */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M10 2a3 3 0 00-3 3v1.5a.5.5 0 01-1 0V5a4 4 0 118 0v1.5a.5.5 0 01-1 0V5a3 3 0 00-3-3z" />
                    <path d="M2 9.5a.5.5 0 01.5-.5h15a.5.5 0 010 1H2.5a.5.5 0 01-.5-.5zM2 12a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9A.5.5 0 012 12zM2 14.5a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5z" />
                  </svg>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Operating Temperature</div>
                  <div>{usagePatterns.operatingTemperature}</div>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold mt-12 mb-6">Optimization Suggestions</h3>
            
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div key={rec.id} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full mt-0.5 bg-emerald-900/50 flex items-center justify-center text-emerald-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p>{rec.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Tabs.Content>

        {/* Recommendations Content */}
        <Tabs.Content value="recommendations" className="mt-6">
          <div className="bg-gray-900/70 rounded-lg p-6 border border-indigo-900/30">
            <h3 className="text-xl font-semibold mb-6">Recommendations</h3>
            
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div key={rec.id} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full mt-0.5 bg-indigo-900/50 flex items-center justify-center text-indigo-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p>{rec.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}