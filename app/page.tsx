"use client"

import React, { useState } from "react"

const batteryData = [
  { 
    id: 1, 
    name: "Battery #1", 
    health: 94, 
    status: "Excellent", 
    statusColor: "bg-emerald-500",
    cycleCount: 92, 
    maxCycles: 1000, 
    capacity: 3000, 
    capacityUnit: "mAh", 
    trend: 2,
    trendDirection: "up"
  },
  { 
    id: 2, 
    name: "Battery #2", 
    health: 87, 
    status: "Good", 
    statusColor: "bg-green-500",
    cycleCount: 203, 
    maxCycles: 1000, 
    capacity: 3000, 
    capacityUnit: "mAh", 
    trend: 0,
    trendDirection: "neutral"
  },
  { 
    id: 3, 
    name: "Battery #3", 
    health: 73, 
    status: "Fair", 
    statusColor: "bg-amber-500",
    cycleCount: 412, 
    maxCycles: 1000, 
    capacity: 2000, 
    capacityUnit: "mAh", 
    trend: 0,
    trendDirection: "neutral"
  },
  { 
    id: 4, 
    name: "Battery #4", 
    health: 58, 
    status: "Poor", 
    statusColor: "bg-red-500",
    cycleCount: 873, 
    maxCycles: 1000, 
    capacity: 2000, 
    capacityUnit: "mAh", 
    trend: -4,
    trendDirection: "down"
  }
]

// Helper function to get color class based on health percentage
function getHealthColorClass(health: number) {
  if (health >= 90) return "text-emerald-500";
  if (health >= 80) return "text-green-500";
  if (health >= 70) return "text-amber-500";
  return "text-red-500";
}

// Helper function to get status color class
function getStatusColorClass(status: string) {
  if (status === "Excellent") return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
  if (status === "Good") return "bg-green-500/10 text-green-500 border-green-500/20";
  if (status === "Fair") return "bg-amber-500/10 text-amber-500 border-amber-500/20";
  return "bg-red-500/10 text-red-500 border-red-500/20";
}

// Helper function to get trend indicator 
function getTrendIndicator(direction: string, value: number) {
  if (direction === "up") return (
    <span className="text-emerald-500 flex items-center text-sm">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
        <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clipRule="evenodd" />
      </svg> 
      {value}%
    </span>
  );
  
  if (direction === "down") return (
    <span className="text-red-500 flex items-center text-sm">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
        <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clipRule="evenodd" />
      </svg>
      {Math.abs(value)}%
    </span>
  );
  
  return <span className="text-gray-400 text-sm">Stable</span>;
}

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState(30); // Days
  
  // Calculate total and average metrics
  const totalCapacity = batteryData.reduce((acc, battery) => acc + battery.capacity, 0);
  const averageHealth = batteryData.reduce((acc, battery) => acc + battery.health, 0) / batteryData.length;
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-indigo-400">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="text-sm font-medium">Coulomb.ai Analytics</span>
        </div>
        
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">Battery Performance</span> Dashboard
          </h1>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-indigo-950/50 border border-indigo-900/70 px-3 py-1.5 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-indigo-400">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Last {timeRange} Days</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-500">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </div>
            
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-md transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
                <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
              </svg>
              <span className="text-sm font-medium">Export Battery Data</span>
            </button>
          </div>
        </div>
        
        <p className="text-gray-400">Real-time monitoring and insights for your battery fleet</p>
      </div>
      
      {/* Battery Status Overview */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-lg font-semibold text-white">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-indigo-400">
            <path d="M4.5 1A2.5 2.5 0 002 3.5V4h16v-.5A2.5 2.5 0 0015.5 1h-11zM2 7.5A2.5 2.5 0 014.5 5h11A2.5 2.5 0 0118 7.5v9.07a2.5 2.5 0 01-3.387 2.353l-4.133-1.376a.75.75 0 00-.48 0l-4.133 1.376A2.5 2.5 0 012 16.57V7.5z" />
          </svg>
          <span>Battery Status Overview</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {batteryData.map(battery => (
            <div key={battery.id} className="bg-gray-900/50 border border-indigo-900/30 rounded-lg p-4 hover:border-indigo-700/50 transition-colors">
              <div className="flex justify-between mb-2">
                <div className="flex items-center gap-2 text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-indigo-400">
                    <path d="M4.5 1A2.5 2.5 0 002 3.5V4h16v-.5A2.5 2.5 0 0015.5 1h-11zM2 7.5A2.5 2.5 0 014.5 5h11A2.5 2.5 0 0118 7.5v9.07a2.5 2.5 0 01-3.387 2.353l-4.133-1.376a.75.75 0 00-.48 0l-4.133 1.376A2.5 2.5 0 012 16.57V7.5z" />
                  </svg>
                  <span className="text-sm font-medium">{battery.name}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColorClass(battery.status)}`}>
                  {battery.status}
                </span>
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-7 h-7 rounded ${battery.statusColor}`}></div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-bold ${getHealthColorClass(battery.health)}`}>{battery.health}%</span>
                  {getTrendIndicator(battery.trendDirection, battery.trend)}
                </div>
              </div>
              
              <div className="text-xs text-gray-500 mb-1">Health Status</div>
              
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Cycle Count</div>
                  <div className="text-sm font-medium">{battery.cycleCount} / {battery.maxCycles}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Capacity</div>
                  <div className="text-sm font-medium">{battery.capacity} {battery.capacityUnit}</div>
                </div>
              </div>
              
              <div className="flex justify-end mt-2">
                <button className="text-indigo-400 hover:text-indigo-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Performance Metrics */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-lg font-semibold text-white">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-indigo-400">
            <path d="M15.5 2A1.5 1.5 0 0014 3.5v13a1.5 1.5 0 001.5 1.5h1a1.5 1.5 0 001.5-1.5v-13A1.5 1.5 0 0016.5 2h-1zM9.5 6A1.5 1.5 0 008 7.5v9A1.5 1.5 0 009.5 18h1a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0010.5 6h-1zM3.5 10A1.5 1.5 0 002 11.5v5A1.5 1.5 0 003.5 18h1A1.5 1.5 0 006 16.5v-5A1.5 1.5 0 004.5 10h-1z" />
          </svg>
          <span>Performance Metrics</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Capacity Trends */}
          <div className="bg-gray-900/50 border border-indigo-900/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-indigo-400">
                  <path d="M15.5 2A1.5 1.5 0 0014 3.5v13a1.5 1.5 0 001.5 1.5h1a1.5 1.5 0 001.5-1.5v-13A1.5 1.5 0 0016.5 2h-1zM9.5 6A1.5 1.5 0 008 7.5v9A1.5 1.5 0 009.5 18h1a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0010.5 6h-1zM3.5 10A1.5 1.5 0 002 11.5v5A1.5 1.5 0 003.5 18h1A1.5 1.5 0 006 16.5v-5A1.5 1.5 0 004.5 10h-1z" />
                </svg>
                <span className="font-medium">Capacity Trends</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="flex items-center justify-center w-7 h-7 rounded-md bg-indigo-900/30 text-indigo-400 hover:bg-indigo-800/40">
                  7d
                </button>
                <button className="flex items-center justify-center w-7 h-7 rounded-md bg-indigo-500/80 text-white">
                  30d
                </button>
                <button className="flex items-center justify-center w-7 h-7 rounded-md bg-indigo-900/30 text-indigo-400 hover:bg-indigo-800/40">
                  90d
                </button>
                <button className="flex items-center justify-center w-7 h-7 rounded-md bg-indigo-900/30 text-indigo-400 hover:bg-indigo-800/40">
                  1y
                </button>
              </div>
            </div>
            
            <div className="h-40 w-full rounded bg-indigo-950/30 flex items-end justify-between p-2 gap-1">
              {/* Placeholder for chart - in a real app you would use recharts or another charting library */}
              <div className="w-1/6 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t" style={{ height: '90%' }}></div>
              <div className="w-1/6 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t" style={{ height: '88%' }}></div>
              <div className="w-1/6 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t" style={{ height: '85%' }}></div>
              <div className="w-1/6 bg-gradient-to-t from-green-500 to-green-400 rounded-t" style={{ height: '80%' }}></div>
              <div className="w-1/6 bg-gradient-to-t from-green-500 to-green-400 rounded-t" style={{ height: '78%' }}></div>
              <div className="w-1/6 bg-gradient-to-t from-amber-500 to-amber-400 rounded-t" style={{ height: '73%' }}></div>
              <div className="w-1/6 bg-gradient-to-t from-amber-500 to-amber-400 rounded-t" style={{ height: '70%' }}></div>
              <div className="w-1/6 bg-gradient-to-t from-amber-500 to-amber-400 rounded-t" style={{ height: '68%' }}></div>
              <div className="w-1/6 bg-gradient-to-t from-amber-500 to-amber-400 rounded-t" style={{ height: '65%' }}></div>
              <div className="w-1/6 bg-gradient-to-t from-red-500 to-red-400 rounded-t" style={{ height: '60%' }}></div>
              <div className="w-1/6 bg-gradient-to-t from-red-500 to-red-400 rounded-t" style={{ height: '58%' }}></div>
              <div className="w-1/6 bg-gradient-to-t from-red-500 to-red-400 rounded-t" style={{ height: '55%' }}></div>
            </div>
            
            <div className="mt-3 grid grid-cols-4 gap-2">
              {batteryData.map(battery => (
                <div key={battery.id} className="flex items-center gap-1.5">
                  <div className={`w-3 h-3 rounded-full ${battery.statusColor}`}></div>
                  <span className="text-xs text-gray-400">{battery.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Charge Cycle Analysis */}
          <div className="bg-gray-900/50 border border-indigo-900/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-indigo-400">
                  <path fillRule="evenodd" d="M1 2.75A.75.75 0 011.75 2h16.5a.75.75 0 010 1.5H1.75A.75.75 0 011 2.75zm0 5A.75.75 0 011.75 7h16.5a.75.75 0 010 1.5H1.75A.75.75 0 011 7.75zM1.75 12h16.5a.75.75 0 010 1.5H1.75a.75.75 0 010-1.5z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Charge Cycle Analysis</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-indigo-950/30 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-2">Average Health</div>
                <div className="text-2xl font-bold">{averageHealth.toFixed(1)}%</div>
                
                <div className="h-2 w-full rounded-full bg-gray-800 mt-2">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" 
                    style={{ width: `${averageHealth}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
              
              <div className="bg-indigo-950/30 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-2">Total Capacity</div>
                <div className="text-2xl font-bold">{totalCapacity.toLocaleString()} mAh</div>
                
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex-1 h-4 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <span className="text-xs text-gray-400">60%</span>
                </div>
                
                <div className="text-xs text-gray-500 mt-2">
                  of optimal capacity
                </div>
              </div>
            </div>
            
            <div className="mt-4 bg-indigo-950/30 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-2">Remaining Lifecycle</div>
              
              <div className="grid grid-cols-4 gap-2">
                {batteryData.map(battery => (
                  <div key={battery.id} className="text-center">
                    <div className="text-xs text-gray-400 mb-1">{battery.name}</div>
                    <div className="text-sm font-semibold">{battery.maxCycles - battery.cycleCount} cycles</div>
                    <div className="h-1 w-full bg-gray-800 mt-1 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${battery.statusColor}`} 
                        style={{ width: `${100 - (battery.cycleCount / battery.maxCycles * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Battery Health Table */}
      <div className="bg-gray-900/50 border border-indigo-900/30 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-indigo-400">
              <path fillRule="evenodd" d="M.99 5.24A2.25 2.25 0 013.25 3h13.5A2.25 2.25 0 0119 5.25l.01 9.5A2.25 2.25 0 0116.76 17H3.26A2.267 2.267 0 011 14.74l-.01-9.5zm8.26 9.52v-.625a.75.75 0 00-.75-.75H3.25a.75.75 0 00-.75.75v.615c0 .414.336.75.75.75h5.373a.75.75 0 00.627-.74zm1.5 0a.75.75 0 00.627.74h5.373a.75.75 0 00.75-.75v-.615a.75.75 0 00-.75-.75H11.5a.75.75 0 00-.75.75v.625zm6.75-3.63v-.625a.75.75 0 00-.75-.75H11.5a.75.75 0 00-.75.75v.625c0 .414.336.75.75.75h5.25a.75.75 0 00.75-.75zm-8.25 0v-.625a.75.75 0 00-.75-.75H3.25a.75.75 0 00-.75.75v.625c0 .414.336.75.75.75H8.5a.75.75 0 00.75-.75zM17.5 7.5v-.625a.75.75 0 00-.75-.75H11.5a.75.75 0 00-.75.75V7.5c0 .414.336.75.75.75h5.25a.75.75 0 00.75-.75zm-8.25 0v-.625a.75.75 0 00-.75-.75H3.25a.75.75 0 00-.75.75V7.5c0 .414.336.75.75.75H8.5a.75.75 0 00.75-.75z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Battery Health Overview</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 bg-indigo-950/50 hover:bg-indigo-900/40 px-2 py-1 rounded-md text-sm transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z" clipRule="evenodd" />
              </svg>
              <span>Filter</span>
            </button>
            
            <button className="flex items-center gap-1.5 bg-indigo-950/50 hover:bg-indigo-900/40 px-2 py-1 rounded-md text-sm transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              <span>Add Battery</span>
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-indigo-900/30">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Battery</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Health</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cycles</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Capacity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Voltage</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-900/20">
              {batteryData.map(battery => (
                <tr key={battery.id} className="hover:bg-indigo-900/10">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${battery.statusColor}`}></div>
                      <span className="font-medium">{battery.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${getHealthColorClass(battery.health)}`}>{battery.health}%</span>
                      {getTrendIndicator(battery.trendDirection, battery.trend)}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <span>{battery.cycleCount} / {battery.maxCycles}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span>{battery.capacity} {battery.capacityUnit}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span>3.7 V</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColorClass(battery.status)}`}>
                      {battery.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <button className="text-indigo-400 hover:text-indigo-300 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                        <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                      </svg>
                    </button>
                    <button className="text-gray-400 hover:text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}