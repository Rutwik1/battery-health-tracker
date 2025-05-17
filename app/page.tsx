"use client"

import { useEffect } from "react"
import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import BatteryStatusCard from "@/components/dashboard/battery-status-card"
import CapacityChart from "@/components/dashboard/capacity-chart"
import CycleChart from "@/components/dashboard/cycle-chart"
import BatteryHealthTable from "@/components/dashboard/battery-health-table"
import RecommendationsCard from "@/components/dashboard/recommendations-card"
import DegradationCard from "@/components/dashboard/degradation-card"
import UsagePatternCard from "@/components/dashboard/usage-pattern-card"
import { useBatteryStore } from "./store/useBatteryStore"

export default function Dashboard() {
  const { fetchBatteries, batteries, isLoading } = useBatteryStore()
  
  useEffect(() => {
    fetchBatteries()
  }, [fetchBatteries])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <BatteryStatusCard 
          battery={batteries[0] || null} 
          isLoading={isLoading} 
        />
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Energy Storage</CardTitle>
            <CardDescription>Combined capacity of all batteries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                `${batteries.reduce((sum, b) => sum + b.currentCapacity, 0).toLocaleString()} mAh`
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {isLoading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                `${batteries.length} batteries monitored`
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Average Health</CardTitle>
            <CardDescription>Across all battery units</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {isLoading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                `${(batteries.reduce((sum, b) => sum + b.healthPercentage, 0) / (batteries.length || 1)).toFixed(1)}%`
              )}
            </div>
            <div className="mt-1 flex h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="bg-primary"
                style={{
                  width: isLoading
                    ? "0%"
                    : `${batteries.reduce((sum, b) => sum + b.healthPercentage, 0) / (batteries.length || 1)}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DegradationCard batteries={batteries} isLoading={isLoading} />
        <UsagePatternCard batteries={batteries} isLoading={isLoading} />
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Remaining Cycle Life</CardTitle>
            <CardDescription>Expected cycles left before replacement</CardDescription>
          </CardHeader>
          <CardContent>
            <CycleChart batteries={batteries} isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Capacity Over Time</CardTitle>
            <CardDescription>Track battery capacity trends</CardDescription>
          </CardHeader>
          <CardContent>
            <CapacityChart 
              batteries={batteries} 
              timeRange={30} 
              isLoading={isLoading} 
            />
          </CardContent>
        </Card>
        <RecommendationsCard batteries={batteries} isLoading={isLoading} />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Battery Health Overview</CardTitle>
          <CardDescription>
            Detailed status of all monitored batteries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BatteryHealthTable 
            batteries={batteries} 
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  )
}