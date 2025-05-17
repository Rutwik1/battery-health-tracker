"use client"

import React from "react"
import Link from "next/link"

// Battery data with accurate format matching the screenshot
const batteryData = [
  { 
    id: 1, 
    name: "Battery #1", 
    health: 96.192, 
    status: "Good", 
    statusColor: "bg-green-500",
    cycleCount: 20, 
    maxCycles: 1000, 
    serialNumber: "BT-2023-001"
  },
  { 
    id: 2, 
    name: "Battery #2", 
    health: 89.402, 
    status: "Good", 
    statusColor: "bg-green-500",
    cycleCount: 115, 
    maxCycles: 1000, 
    serialNumber: "BT-2023-002"
  },
  { 
    id: 3, 
    name: "Battery #3", 
    health: 69.005, 
    status: "Poor", 
    statusColor: "bg-amber-500",
    cycleCount: 320, 
    maxCycles: 1000, 
    serialNumber: "BT-2023-003"
  },
  { 
    id: 4, 
    name: "Battery #4", 
    health: 48.904, 
    status: "Critical", 
    statusColor: "bg-red-500",
    cycleCount: 650, 
    maxCycles: 1000, 
    serialNumber: "BT-2023-004"
  }
]

// Battery status data with percentage and capacity info
const batteryStatusData = [
  {
    id: 1,
    name: "Battery #1",
    health: "96.1923843839373%",
    capacity: "4988 mAh",
    serialNumber: "BT-2023-001"
  },
  {
    id: 2,
    name: "Battery #2",
    health: "89.4020038755035%",
    capacity: "4705 mAh", 
    serialNumber: "BT-2023-002"
  }
]

// Recommendations data
const recommendationsData = [
  {
    id: 1,
    title: "Battery #2 needs calibration",
    description: "Full discharge and recharge recommended, consider a complete cycle to improve accuracy.",
    type: "maintenance",
    icon: "⚙️"
  },
  {
    id: 2,
    title: "Optimal charging patterns detected",
    description: "Current smart charging pattern, continue as is.",
    type: "info",
    icon: "✓"
  },
  {
    id: 3,
    title: "Replace Battery #4", 
    description: "Health below critical threshold, replacement recommended.",
    type: "critical",
    icon: "⚠️"
  }
]

export default function Dashboard() {
  // Calculate stats
  const totalBatteries = batteryData.length;
  const operationalCount = batteryData.filter(b => b.status !== "Critical").length;
  const operationalPercentage = Math.round((operationalCount / totalBatteries) * 100);
  
  const averageHealth = batteryData.reduce((sum, battery) => sum + battery.health, 0) / totalBatteries;
  
  const criticalCount = batteryData.filter(b => b.status === "Critical").length;
  
  return (
    <div className="flex flex-col space-y-6 px-4 py-6 bg-[#101025] text-white">
      <h1 className="text-2xl font-bold text-purple-400">
        Battery Health Dashboard
      </h1>
      <p className="text-gray-400 text-sm -mt-4">
        Monitor and analyze your battery performance in real-time
      </p>
      
      {/* Total Batteries Card */}
      <div className="flex flex-col bg-[#161638] rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-400">Total Batteries</div>
          <div className="bg-purple-800 rounded-md w-7 h-7 flex items-center justify-center">
            <span className="text-white font-medium text-xs">{totalBatteries}</span>
          </div>
        </div>
        <div className="text-4xl font-bold mt-2">{totalBatteries}</div>
        <div className="text-sm text-green-500 mt-1">
          {operationalPercentage}% of systems operational
        </div>
      </div>
      
      {/* Average Health Card */}
      <div className="flex flex-col bg-[#161638] rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-400">Average Health</div>
          <div className="bg-purple-800 rounded-md w-7 h-7 flex items-center justify-center">
            <span className="text-white font-medium text-xs">%</span>
          </div>
        </div>
        <div className="text-4xl font-bold mt-2">{Math.round(averageHealth)}%</div>
        <div className="w-full bg-gray-800 rounded-full h-1.5 mt-2">
          <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: `${averageHealth}%` }}></div>
        </div>
      </div>
      
      {/* Critical Status Card */}
      <div className="flex flex-col bg-[#161638] rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-400">Critical Status</div>
          <div className="bg-red-900 rounded-md w-7 h-7 flex items-center justify-center">
            <span className="text-white font-medium text-xs">{criticalCount}</span>
          </div>
        </div>
        <div className="text-4xl font-bold mt-2">{criticalCount}</div>
        {criticalCount > 0 && (
          <div className="flex items-center mt-1 bg-red-900/30 text-red-500 text-sm rounded px-2 py-1 w-fit">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
              <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            1 battery needs immediate attention
          </div>
        )}
      </div>
      
      {/* Capacity Loss Rate Card */}
      <div className="flex flex-col bg-[#161638] rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-400">Capacity Loss Rate</div>
          <div className="bg-amber-800 rounded-md w-7 h-7 flex items-center justify-center">
            <span className="text-white font-medium text-xs">%</span>
          </div>
        </div>
        <div className="text-4xl font-bold mt-2">0.8%</div>
        <div className="text-sm text-gray-400 mt-1">
          Average monthly capacity loss
        </div>
      </div>
      
      {/* Battery Health Details Section */}
      <div className="mt-2">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-white">Battery Health Details</h3>
          <button className="text-gray-400 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z" clipRule="evenodd" />
            </svg>
            Filter
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-xs text-gray-400 px-2 mb-2">
          <div>BATTERY</div>
          <div>STATUS</div>
          <div>HEALTH</div>
        </div>
        
        {batteryData.map((battery) => (
          <div 
            key={battery.id} 
            className="flex items-center justify-between bg-[#161638] mb-2 rounded-lg p-3"
          >
            <div className="flex items-center gap-2 w-1/3">
              <div className="text-purple-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M4 7a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zm4-2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z" />
                  <path d="M10 3h4v4h-4z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium">{battery.name}</div>
                <div className="text-xs text-gray-500">{battery.serialNumber}</div>
              </div>
            </div>
            
            <div className="w-1/3">
              <span className={`px-2 py-0.5 text-xs rounded-full
                ${battery.status === "Good" ? "bg-green-900/30 text-green-500" : 
                battery.status === "Poor" ? "bg-amber-900/30 text-amber-500" : 
                "bg-red-900/30 text-red-500"}`}>
                {battery.status}
              </span>
            </div>
            
            <div className="w-1/3">
              <div className="flex items-center gap-1">
                {battery.status === "Good" && (
                  <div className="w-16 bg-gray-700 rounded-full h-1.5">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${battery.health}%` }}></div>
                  </div>
                )}
                {battery.status === "Poor" && (
                  <div className="w-16 bg-gray-700 rounded-full h-1.5">
                    <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${battery.health}%` }}></div>
                  </div>
                )}
                {battery.status === "Critical" && (
                  <div className="w-16 bg-gray-700 rounded-full h-1.5">
                    <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${battery.health}%` }}></div>
                  </div>
                )}
                <span className="text-xs">{battery.health.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Battery Status Section */}
      <div className="mt-2">
        <h3 className="text-lg font-semibold text-white mb-3">Battery Status</h3>
        
        {batteryStatusData.map((battery) => (
          <div key={battery.id} className="flex items-center gap-3 mb-4">
            <div className="h-10 w-1.5 bg-green-500 rounded-sm"></div>
            <div className="flex-1">
              <div className="text-sm font-medium">{battery.name}</div>
              <div className="text-xs text-gray-500">{battery.serialNumber}</div>
              <div className="text-xs text-gray-300">{battery.health} • {battery.capacity}</div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Recommendations Section */}
      <div className="mt-2">
        <h3 className="text-lg font-semibold text-white mb-3">Recommendations</h3>
        
        {recommendationsData.map((rec) => (
          <div key={rec.id} className="flex gap-3 mb-4">
            <div className={`flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full
              ${rec.type === 'maintenance' ? "bg-amber-900/50 text-amber-400" : 
                rec.type === 'info' ? "bg-green-900/50 text-green-400" : 
                "bg-red-900/50 text-red-400"}`}>
              <span>{rec.icon}</span>
            </div>
            <div>
              <div className="text-sm font-medium">{rec.title}</div>
              <div className="text-xs text-gray-400">{rec.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}