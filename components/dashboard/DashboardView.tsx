'use client'

import React, { useEffect, useState } from 'react'
import { useBatteryStore, Battery } from '@/lib/store/batteryStore'
import {
  Download,
  Battery as BatteryIcon,
  Plus,
  RefreshCw,
  Filter,
  ArrowUpDown
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import BatteryStatusCard from '@/components/dashboard/BatteryStatusCard'
import CapacityChart from '@/components/dashboard/CapacityChart'
import CycleChart from '@/components/dashboard/CycleChart'
import BatteryHealthTable from '@/components/dashboard/BatteryHealthTable'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import { exportBatteryData } from '@/lib/utils/export'
import { useRouter } from 'next/navigation'

export default function DashboardView() {
  const router = useRouter()
  const { batteries, isLoading, fetchBatteries } = useBatteryStore()
  const [timeRange, setTimeRange] = useState<number>(90)
  const [showAddBattery, setShowAddBattery] = useState(false)
  
  // Initial data fetch
  useEffect(() => {
    fetchBatteries()
  }, [fetchBatteries])
  
  // Handle time range change
  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeRange(Number(e.target.value))
  }
  
  // Export data
  const handleExport = () => {
    exportBatteryData(batteries, timeRange.toString())
  }
  
  // Open battery detail page
  const handleOpenBattery = (id: number) => {
    router.push(`/battery/${id}`)
  }
  
  // Get battery health summary
  const getHealthSummary = () => {
    if (batteries.length === 0) return { healthy: 0, good: 0, fair: 0, poor: 0 }
    
    return batteries.reduce((acc, battery) => {
      if (battery.healthPercentage >= 90) acc.healthy++
      else if (battery.healthPercentage >= 80) acc.good++
      else if (battery.healthPercentage >= 70) acc.fair++
      else acc.poor++
      
      return acc
    }, { healthy: 0, good: 0, fair: 0, poor: 0 })
  }
  
  const healthSummary = getHealthSummary()
  
  // Get batteries with critical health
  const criticalBatteries = batteries.filter(b => b.healthPercentage < 70)
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Battery Dashboard</h1>
              <p className="text-muted-foreground">
                Monitor and manage your battery fleet
              </p>
            </div>
            
            <div className="flex space-x-2">
              <div className="relative">
                <select
                  className="appearance-none bg-transparent border border-border rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                  value={timeRange}
                  onChange={handleTimeRangeChange}
                >
                  <option value={30}>Last 30 Days</option>
                  <option value={90}>Last 90 Days</option>
                  <option value={180}>Last 6 Months</option>
                  <option value={365}>Last Year</option>
                </select>
              </div>
              
              <button
                onClick={handleExport}
                className="inline-flex items-center px-4 py-2 border border-border rounded-md hover:bg-muted/50 transition-colors"
              >
                <Download className="mr-2 h-4 w-4 text-muted-foreground" />
                Export Data
              </button>
              
              <button
                onClick={() => setShowAddBattery(true)}
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Battery
              </button>
            </div>
          </div>
          
          {/* Health Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BatteryIcon className="mr-2 h-5 w-5 text-success" />
                  Healthy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{healthSummary.healthy}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {Math.round((healthSummary.healthy / batteries.length) * 100) || 0}% of batteries
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BatteryIcon className="mr-2 h-5 w-5 text-primary" />
                  Good
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{healthSummary.good}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {Math.round((healthSummary.good / batteries.length) * 100) || 0}% of batteries
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BatteryIcon className="mr-2 h-5 w-5 text-warning" />
                  Fair
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{healthSummary.fair}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {Math.round((healthSummary.fair / batteries.length) * 100) || 0}% of batteries
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BatteryIcon className="mr-2 h-5 w-5 text-destructive" />
                  Poor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{healthSummary.poor}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {Math.round((healthSummary.poor / batteries.length) * 100) || 0}% of batteries
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Charts Section */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* Capacity Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Battery Capacity Trend</CardTitle>
                    <CardDescription>
                      Health percentage over time for all batteries
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      <CapacityChart 
                        batteries={batteries}
                        timeRange={timeRange}
                        isLoading={isLoading}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                {/* Cycle Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Charge Cycles</CardTitle>
                    <CardDescription>
                      Current cycle count and maximum expected cycles
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      <CycleChart 
                        batteries={batteries}
                        isLoading={isLoading}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Status Cards Section */}
            <div>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Critical Batteries</CardTitle>
                    <CardDescription>
                      Batteries with health below 70%
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-0">
                    {criticalBatteries.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-sm text-muted-foreground">No critical batteries</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {criticalBatteries.map(battery => (
                          <div 
                            key={battery.id}
                            className="px-6 hover:bg-muted/50 transition-colors py-2 cursor-pointer"
                            onClick={() => handleOpenBattery(battery.id)}
                          >
                            <BatteryStatusCard battery={battery} />
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Recently Updated */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Recently Updated</CardTitle>
                      <button className="p-1 hover:bg-muted/50 rounded-full">
                        <RefreshCw className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent className="px-0">
                    {batteries.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-sm text-muted-foreground">No recent updates</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {batteries
                          .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
                          .slice(0, 3)
                          .map(battery => (
                            <div 
                              key={battery.id}
                              className="px-6 hover:bg-muted/50 transition-colors py-2 cursor-pointer"
                              onClick={() => handleOpenBattery(battery.id)}
                            >
                              <BatteryStatusCard battery={battery} />
                            </div>
                          ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          
          {/* Battery Health Table */}
          <div className="mb-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Battery Health</CardTitle>
                  <div className="flex space-x-2">
                    <button className="p-2 hover:bg-muted/50 rounded-md text-sm text-muted-foreground">
                      <Filter className="h-4 w-4 mr-1 inline-block" />
                      Filter
                    </button>
                    <button className="p-2 hover:bg-muted/50 rounded-md text-sm text-muted-foreground">
                      <ArrowUpDown className="h-4 w-4 mr-1 inline-block" />
                      Sort
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <BatteryHealthTable 
                  batteries={batteries}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}