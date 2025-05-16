'use client'

import React, { useState, useEffect } from 'react'
import { useBatteryStore } from '@/lib/store/batteryStore'
import { 
  Download,
  Plus,
  BarChart,
  Battery,
  TrendingUp,
  ListFilter,
  ChevronDown
} from 'lucide-react'
import BatteryStatusCard from '@/components/dashboard/BatteryStatusCard'
import CapacityChart from '@/components/dashboard/CapacityChart'
import CycleChart from '@/components/dashboard/CycleChart'
import BatteryHealthTable from '@/components/dashboard/BatteryHealthTable'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import { exportBatteryData } from '@/lib/utils/export'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardView() {
  const { batteries, isLoading, fetchBatteries, startRealtimeUpdates } = useBatteryStore()
  const [timeRange, setTimeRange] = useState<number>(90)
  const [activeTab, setActiveTab] = useState<'overview' | 'table'>('overview')
  
  useEffect(() => {
    fetchBatteries()
    startRealtimeUpdates()
    
    return () => {
      useBatteryStore.getState().stopRealtimeUpdates()
    }
  }, [fetchBatteries, startRealtimeUpdates])
  
  const exportData = () => {
    exportBatteryData(batteries, timeRange.toString())
  }
  
  const batteryStatusSummary = {
    healthy: batteries.filter(b => b.status === 'Healthy').length,
    good: batteries.filter(b => b.status === 'Good').length,
    fair: batteries.filter(b => b.status === 'Fair').length,
    poor: batteries.filter(b => b.status === 'Poor').length,
    total: batteries.length
  }
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none pt-2">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h1 className="text-2xl font-semibold mb-4 md:mb-0">Battery Health Dashboard</h1>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="relative">
                  <button
                    className="inline-flex items-center space-x-1 px-4 py-2 border border-border rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <ListFilter className="h-4 w-4 text-muted-foreground" />
                    <span>Filter</span>
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  </button>
                </div>
                
                <div className="relative">
                  <select
                    className="appearance-none bg-transparent border border-border rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                    value={timeRange}
                    onChange={(e) => setTimeRange(Number(e.target.value))}
                  >
                    <option value={30}>Last 30 Days</option>
                    <option value={90}>Last 90 Days</option>
                    <option value={180}>Last 6 Months</option>
                    <option value={365}>Last Year</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                </div>
                
                <button
                  onClick={exportData}
                  className="inline-flex items-center px-4 py-2 border border-border rounded-md hover:bg-muted/50 transition-colors"
                >
                  <Download className="mr-2 h-4 w-4 text-muted-foreground" />
                  Export Data
                </button>
                
                <button className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Battery
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-success/10 border-success/30">
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Healthy</p>
                      <p className="text-2xl font-semibold text-success">{batteryStatusSummary.healthy}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center">
                      <Battery className="h-5 w-5 text-success" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-primary/10 border-primary/30">
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Good</p>
                      <p className="text-2xl font-semibold text-primary">{batteryStatusSummary.good}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Battery className="h-5 w-5 text-primary" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-warning/10 border-warning/30">
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Fair</p>
                      <p className="text-2xl font-semibold text-warning">{batteryStatusSummary.fair}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-warning/20 flex items-center justify-center">
                      <Battery className="h-5 w-5 text-warning" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-danger/10 border-danger/30">
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Poor</p>
                      <p className="text-2xl font-semibold text-danger">{batteryStatusSummary.poor}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-danger/20 flex items-center justify-center">
                      <Battery className="h-5 w-5 text-danger" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="border-b border-border">
                <div className="flex -mb-px">
                  <button
                    className={`py-4 px-6 border-b-2 font-medium text-sm focus:outline-none ${
                      activeTab === 'overview'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                    }`}
                    onClick={() => setActiveTab('overview')}
                  >
                    Overview
                  </button>
                  <button
                    className={`py-4 px-6 border-b-2 font-medium text-sm focus:outline-none ${
                      activeTab === 'table'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                    }`}
                    onClick={() => setActiveTab('table')}
                  >
                    Health Table
                  </button>
                </div>
              </div>
            </div>
            
            {activeTab === 'overview' ? (
              <>
                <div className="mb-8">
                  <Card>
                    <CardHeader className="pb-0">
                      <CardTitle className="flex items-center">
                        <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                        <span>Battery Capacity Trends</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[350px] w-full mt-4">
                        <CapacityChart 
                          batteries={batteries} 
                          timeRange={timeRange} 
                          isLoading={isLoading} 
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mb-8">
                  <Card>
                    <CardHeader className="pb-0">
                      <CardTitle className="flex items-center">
                        <BarChart className="mr-2 h-5 w-5 text-primary" />
                        <span>Battery Cycle Counts</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] w-full mt-4">
                        <CycleChart batteries={batteries} isLoading={isLoading} />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mb-8">
                  <h2 className="text-lg font-medium mb-4">Battery Status</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {isLoading ? (
                      // Skeleton loading
                      Array(4).fill(0).map((_, index) => (
                        <Card key={index} className="animate-pulse">
                          <CardContent className="p-6">
                            <div className="h-6 bg-muted/50 rounded mb-4"></div>
                            <div className="h-4 bg-muted/30 rounded w-1/2 mb-2"></div>
                            <div className="h-2 bg-muted/30 rounded mb-4"></div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="h-12 bg-muted/30 rounded"></div>
                              <div className="h-12 bg-muted/30 rounded"></div>
                              <div className="h-12 bg-muted/30 rounded"></div>
                              <div className="h-12 bg-muted/30 rounded"></div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : batteries.length === 0 ? (
                      <div className="col-span-4 text-center py-12 bg-muted/10 rounded-lg border border-border">
                        <Battery className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                        <h3 className="text-lg font-medium">No Batteries Found</h3>
                        <p className="text-muted-foreground">Add batteries to monitor their health and performance</p>
                        <button className="mt-4 inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Battery
                        </button>
                      </div>
                    ) : (
                      batteries.map((battery) => (
                        <BatteryStatusCard key={battery.id} battery={battery} />
                      ))
                    )}
                  </div>
                </div>
              </>
            ) : (
              <BatteryHealthTable batteries={batteries} isLoading={isLoading} />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}