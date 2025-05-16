'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useBatteryStore, Battery } from '@/lib/store/batteryStore'
import { ArrowLeft, Download, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import CapacityChart from '@/components/dashboard/CapacityChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getBatteryStatusColor } from '@/lib/utils'
import { exportBatteryData } from '@/lib/utils/export'

interface BatteryDetailViewProps {
  batteryId: number;
}

export default function BatteryDetailView({ batteryId }: BatteryDetailViewProps) {
  const [activeTab, setActiveTab] = useState('history')
  const { batteries, isLoading } = useBatteryStore()
  
  // Find the battery by ID
  const battery = batteries.find(b => b.id === batteryId) || null
  
  const handleExport = () => {
    if (battery) {
      exportBatteryData([battery], "365")
    }
  }
  
  const statusColor = battery ? getBatteryStatusColor(battery.status) : "text-muted-foreground"
  
  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Topbar />
          <main className="flex-1 relative overflow-y-auto p-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 w-40 bg-muted/40 rounded"></div>
              <div className="h-32 bg-muted/40 rounded-lg"></div>
              <div className="h-64 bg-muted/40 rounded-lg"></div>
            </div>
          </main>
        </div>
      </div>
    )
  }
  
  if (!battery) {
    return (
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Topbar />
          <main className="flex-1 relative overflow-y-auto p-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  <AlertCircle className="h-6 w-6 text-danger mr-2" />
                  <h2 className="text-xl font-semibold">Battery Not Found</h2>
                </div>
                <p className="mb-4 text-muted-foreground">The battery with ID {batteryId} could not be found.</p>
                <Link 
                  href="/dashboard"
                  className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Return to Dashboard
                </Link>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    )
  }
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {/* Back button and actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <Link
                href="/dashboard"
                className="mb-4 sm:mb-0 inline-flex items-center px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-muted/50 transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
              
              <button
                onClick={handleExport}
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </button>
            </div>
            
            {/* Battery Overview */}
            <Card className="mb-8">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-heading">{battery.name}</CardTitle>
                  <div className={`px-3 py-1 text-xs font-medium ${statusColor} ${statusColor.replace('text', 'bg')}/10 rounded-full`}>
                    {battery.status}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Health</h3>
                    <div className="text-3xl font-semibold">{battery.healthPercentage}%</div>
                    <div className="w-full bg-muted/50 h-2 rounded-full mt-2 overflow-hidden">
                      <div 
                        className={`h-2 rounded-full ${statusColor.replace('text', 'bg')}`}
                        style={{ width: `${battery.healthPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Capacity</h3>
                    <div className="text-3xl font-semibold">{battery.currentCapacity} mAh</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Out of {battery.initialCapacity} mAh initial
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Cycle Count</h3>
                    <div className="text-3xl font-semibold">{battery.cycleCount}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Out of {battery.expectedCycles} expected
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Degradation Rate</h3>
                    <div className={`text-3xl font-semibold ${statusColor}`}>
                      {battery.degradationRate}% / month
                    </div>
                  </div>
                </div>
                
                <div className="h-px bg-border my-6"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Battery Information</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Serial Number</span>
                        <span className="text-sm font-medium">{battery.serialNumber}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Initial Date</span>
                        <span className="text-sm font-medium">
                          {format(new Date(battery.initialDate), 'MMM dd, yyyy')}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Last Updated</span>
                        <span className="text-sm font-medium">
                          {format(new Date(battery.lastUpdated), 'MMM dd, yyyy')}
                        </span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Performance Metrics</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Age</span>
                        <span className="text-sm font-medium">
                          {Math.floor((new Date().getTime() - new Date(battery.initialDate).getTime()) / (30 * 24 * 60 * 60 * 1000))} months
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Avg. Cycles Per Month</span>
                        <span className="text-sm font-medium">
                          {Math.round(battery.cycleCount / ((new Date().getTime() - new Date(battery.initialDate).getTime()) / (30 * 24 * 60 * 60 * 1000)))}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Estimated Remaining Life</span>
                        <span className="text-sm font-medium">
                          {Math.max(0, Math.floor((battery.expectedCycles - battery.cycleCount) / (battery.cycleCount / ((new Date().getTime() - new Date(battery.initialDate).getTime()) / (30 * 24 * 60 * 60 * 1000)))))} months
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Battery Data Tabs */}
            <div className="mb-6">
              <div className="flex border-b border-border">
                <button
                  className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                    activeTab === 'history' 
                      ? 'border-b-2 border-primary text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setActiveTab('history')}
                >
                  Capacity History
                </button>
                <button
                  className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                    activeTab === 'usage' 
                      ? 'border-b-2 border-primary text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setActiveTab('usage')}
                >
                  Usage Patterns
                </button>
                <button
                  className={`py-2 px-4 font-medium text-sm focus:outline-none ${
                    activeTab === 'recommendations' 
                      ? 'border-b-2 border-primary text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setActiveTab('recommendations')}
                >
                  Recommendations
                </button>
              </div>
            </div>
            
            {activeTab === 'history' && (
              <Card>
                <CardHeader>
                  <CardTitle>Capacity Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <CapacityChart 
                      batteries={[battery]} 
                      timeRange={365} 
                      isLoading={false} 
                      detailed={true} 
                    />
                  </div>
                </CardContent>
              </Card>
            )}
            
            {activeTab === 'usage' && (
              <Card>
                <CardHeader>
                  <CardTitle>Usage Patterns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <Download className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium">Charging Frequency</p>
                          <p className="text-xs text-muted-foreground mt-1">Average 1.4 times per day</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <Battery className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium">Discharge Depth</p>
                          <p className="text-xs text-muted-foreground mt-1">Average to 26% before charging</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="text-base font-medium mb-4">Optimization Suggestions</h3>
                      <ul className="space-y-4">
                        <li className="flex">
                          <div className="flex-shrink-0">
                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary">
                              <AlertCircle className="h-4 w-4" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm">
                              Avoid charging beyond 90% to extend battery lifespan.
                            </p>
                          </div>
                        </li>
                        <li className="flex">
                          <div className="flex-shrink-0">
                            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary">
                              <AlertCircle className="h-4 w-4" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm">
                              Avoid letting battery discharge below 20% frequently.
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {activeTab === 'recommendations' && (
              <Card>
                <CardHeader>
                  <CardTitle>Maintenance Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {[1, 2, 3].map((_, i) => (
                      <li key={i} className="p-4 border border-border/50 rounded-lg">
                        <div className="flex">
                          <div className={`flex-shrink-0 h-10 w-10 rounded-full ${i === 0 ? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'} flex items-center justify-center`}>
                            <AlertCircle className="h-5 w-5" />
                          </div>
                          <div className="ml-4">
                            <h4 className="text-sm font-medium">
                              {i === 0 
                                ? 'Temperature Warning' 
                                : i === 1 
                                  ? 'Charging Recommendation' 
                                  : 'Calibration Reminder'}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {i === 0 
                                ? 'Battery frequently operates at high temperatures. Consider improving cooling or reducing intensive usage.' 
                                : i === 1 
                                  ? 'For optimal battery health, try to maintain charge between 20% and 80%.' 
                                  : 'Battery should be calibrated soon to maintain accuracy of health readings.'}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}