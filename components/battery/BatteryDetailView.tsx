'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useBatteryStore, Battery, BatteryHistory, UsagePattern, Recommendation } from '@/lib/store/batteryStore'
import { 
  Battery as BatteryIcon, ChevronLeft, Download, BarChart3, Zap, Thermometer, AlertTriangle, Clock
} from 'lucide-react'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import CapacityChart from '@/components/dashboard/CapacityChart'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { getBatteryStatusColor, formatNumber, calculateRemainingLifespan, formatDate, formatRelativeTime } from '@/lib/utils'
import { exportBatteryData } from '@/lib/utils/export'

interface BatteryDetailViewProps {
  batteryId: number;
}

export default function BatteryDetailView({ batteryId }: BatteryDetailViewProps) {
  const router = useRouter()
  const { batteries, isLoading, fetchBatteries, fetchBatteryHistory, fetchUsagePattern, fetchRecommendations } = useBatteryStore()
  
  const [timeRange, setTimeRange] = useState<number>(90)
  const [batteryHistory, setBatteryHistory] = useState<BatteryHistory[]>([])
  const [usagePattern, setUsagePattern] = useState<UsagePattern | null>(null)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  
  // Find the battery from the store
  const battery = batteries.find(b => b.id === batteryId)
  
  // Fetch data when component mounts
  useEffect(() => {
    if (batteries.length === 0) {
      fetchBatteries()
    }
    
    const loadData = async () => {
      // Fetch battery history with selected time range
      const history = await fetchBatteryHistory(batteryId, timeRange)
      setBatteryHistory(history)
      
      // Fetch usage pattern
      const pattern = await fetchUsagePattern(batteryId)
      setUsagePattern(pattern || null)
      
      // Fetch recommendations
      const recs = await fetchRecommendations(batteryId)
      setRecommendations(recs)
    }
    
    if (batteryId) {
      loadData()
    }
  }, [batteryId, fetchBatteries, fetchBatteryHistory, fetchUsagePattern, fetchRecommendations, batteries.length, timeRange])
  
  // Go back to dashboard
  const handleGoBack = () => {
    router.push('/dashboard')
  }
  
  // Export battery data
  const handleExport = () => {
    if (battery) {
      exportBatteryData([battery], timeRange.toString())
    }
  }
  
  // If loading or battery not found, show loading state
  if (isLoading || !battery) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <Topbar />
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center mb-6">
              <button 
                onClick={handleGoBack}
                className="mr-4 p-2 rounded-md hover:bg-muted/50 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="animate-pulse bg-muted/50 h-8 w-48 rounded"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                {Array(3).fill(0).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-muted/50 w-40 rounded mb-2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] bg-muted/30 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="space-y-6">
                {Array(4).fill(0).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-5 bg-muted/50 w-32 rounded"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="h-4 bg-muted/30 rounded"></div>
                        <div className="h-4 bg-muted/30 rounded"></div>
                        <div className="h-4 bg-muted/30 rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }
  
  // Determine battery status color
  const statusColor = getBatteryStatusColor(battery.status)
  
  // Calculate remaining lifespan
  const remainingLifespan = calculateRemainingLifespan(
    battery.healthPercentage,
    battery.degradationRate
  )
  
  // Calculate cycle percentage
  const cyclePercentage = Math.round((battery.cycleCount / battery.expectedCycles) * 100)
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Header with Navigation */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <button 
                onClick={handleGoBack}
                className="mr-4 p-2 rounded-md hover:bg-muted/50 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-semibold flex items-center">
                  <BatteryIcon className={`mr-2 h-6 w-6 ${statusColor}`} />
                  {battery.name}
                </h1>
                <p className="text-sm text-muted-foreground font-mono">{battery.serialNumber}</p>
              </div>
            </div>
            
            <div className="flex space-x-2">
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
              </div>
              
              <button
                onClick={handleExport}
                className="inline-flex items-center px-4 py-2 border border-border rounded-md hover:bg-muted/50 transition-colors"
              >
                <Download className="mr-2 h-4 w-4 text-muted-foreground" />
                Export Data
              </button>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column (Charts and Data) */}
            <div className="md:col-span-2 space-y-6">
              {/* Battery Health Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BatteryIcon className={`mr-2 h-5 w-5 ${statusColor}`} />
                    Battery Health Overview
                  </CardTitle>
                  <CardDescription>
                    Current health: <span className={`font-medium ${statusColor}`}>{battery.healthPercentage}%</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4 px-2">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Initial Capacity</p>
                      <p className="text-lg font-medium">{formatNumber(battery.initialCapacity)} mAh</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Current Capacity</p>
                      <p className="text-lg font-medium">{formatNumber(battery.currentCapacity)} mAh</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Degradation</p>
                      <p className="text-lg font-medium">{battery.degradationRate}% / month</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Remaining Life</p>
                      <p className="text-lg font-medium">{remainingLifespan} months</p>
                    </div>
                  </div>
                  
                  {/* Battery Health Visualization */}
                  <div className="h-[350px] w-full mt-8">
                    <CapacityChart 
                      batteries={[battery]} 
                      timeRange={timeRange} 
                      isLoading={false} 
                      detailed={true}
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Charge Cycles */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5 text-primary" />
                    Charge Cycles
                  </CardTitle>
                  <CardDescription>
                    {battery.cycleCount} cycles used out of {battery.expectedCycles} expected cycles ({cyclePercentage}%)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="px-2">
                    <div className="flex justify-between mb-2 text-sm">
                      <span>0</span>
                      <span>{battery.expectedCycles}</span>
                    </div>
                    <div className="w-full bg-muted/50 h-4 rounded-full overflow-hidden">
                      <div 
                        className={`h-4 ${statusColor.replace('text', 'bg')}`}
                        style={{ width: `${cyclePercentage}%` }}
                      ></div>
                    </div>
                    <div className="mt-1 text-xs text-right text-muted-foreground">
                      {100 - cyclePercentage}% remaining
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-muted/10 p-4 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">First Used</p>
                      <p className="font-medium">{formatDate(battery.initialDate)}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatRelativeTime(battery.initialDate)}
                      </p>
                    </div>
                    
                    <div className="bg-muted/10 p-4 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Last Updated</p>
                      <p className="font-medium">{formatDate(battery.lastUpdated)}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatRelativeTime(battery.lastUpdated)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right Column (Stats and Info) */}
            <div className="space-y-6">
              {/* Battery Status */}
              <Card className={`border-${statusColor.replace('text-', '')}/30`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold mb-1">
                        <span className={statusColor}>{battery.status}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {battery.status === 'Healthy' && 'Battery is in excellent condition'}
                        {battery.status === 'Good' && 'Battery is performing well'}
                        {battery.status === 'Fair' && 'Battery shows signs of wear'}
                        {battery.status === 'Poor' && 'Battery needs attention'}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${statusColor.replace('text', 'bg')}/10`}>
                      <BatteryIcon className={`h-6 w-6 ${statusColor}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Usage Patterns */}
              {usagePattern && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Zap className="mr-2 h-5 w-5 text-primary" />
                      Usage Pattern
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Usage Type</span>
                        <span className="font-medium">{usagePattern.usageType}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Charging Frequency</span>
                        <span className="font-medium">{usagePattern.chargingFrequency}x daily</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Discharge Cycles</span>
                        <span className="font-medium">{usagePattern.dischargeCycles}x daily</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Discharge Rate</span>
                        <span className="font-medium">{usagePattern.averageDischargeRate}% / hour</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Temperature</span>
                        <div className="flex items-center">
                          <Thermometer className="h-4 w-4 mr-1 text-warning" />
                          <span className="font-medium">{usagePattern.temperatureExposure}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Recommendations */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5 text-warning" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recommendations.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No recommendations at this time</p>
                  ) : (
                    <div className="space-y-4">
                      {recommendations.map(rec => (
                        <div 
                          key={rec.id} 
                          className={`p-3 rounded-lg ${rec.resolved ? 'bg-success/5 border border-success/20' : 'bg-warning/5 border border-warning/20'}`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs font-medium ${rec.resolved ? 'text-success' : 'text-warning'}`}>
                              {rec.type}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatRelativeTime(rec.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm">{rec.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Battery Specs */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Serial Number</span>
                      <span className="font-mono text-sm">{battery.serialNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Initial Capacity</span>
                      <span>{formatNumber(battery.initialCapacity)} mAh</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Expected Cycles</span>
                      <span>{formatNumber(battery.expectedCycles)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Installation Date</span>
                      <span>{formatDate(battery.initialDate)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}