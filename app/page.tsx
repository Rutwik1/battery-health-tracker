"use client"

import React from "react"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Battery Health Dashboard</h1>
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold leading-none tracking-tight">Battery Status</h3>
          <p className="text-sm text-muted-foreground">Current status of main battery</p>
          <div className="mt-4">
            <div className="text-3xl font-bold">85%</div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div className="bg-green-500 h-full" style={{ width: "85%" }} />
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold leading-none tracking-tight">Total Energy Storage</h3>
          <p className="text-sm text-muted-foreground">Combined capacity of all batteries</p>
          <div className="mt-4">
            <div className="text-3xl font-bold">15,000 mAh</div>
            <div className="text-sm text-muted-foreground">4 batteries monitored</div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold leading-none tracking-tight">Average Health</h3>
          <p className="text-sm text-muted-foreground">Across all battery units</p>
          <div className="mt-4">
            <div className="text-3xl font-bold">78.5%</div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div className="bg-primary h-full" style={{ width: "78.5%" }} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold leading-none tracking-tight">Degradation Rates</h3>
          <p className="text-sm text-muted-foreground">Monthly capacity loss</p>
          <div className="mt-6 flex items-center justify-around">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">1.2%</div>
              <div className="text-xs text-muted-foreground">Highest</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">0.8%</div>
              <div className="text-xs text-muted-foreground">Average</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">0.5%</div>
              <div className="text-xs text-muted-foreground">Lowest</div>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold leading-none tracking-tight">Recommendations</h3>
          <p className="text-sm text-muted-foreground">Battery maintenance alerts</p>
          <div className="mt-4 space-y-3">
            <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 p-3 rounded-md">
              <span className="font-medium text-amber-800 dark:text-amber-200">Battery #2 requires maintenance</span>
            </div>
            <div className="flex items-start gap-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-3 rounded-md">
              <span className="font-medium text-red-800 dark:text-red-200">Battery #3 needs replacement</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="p-6 pb-4">
          <h3 className="text-lg font-semibold leading-none tracking-tight">Battery Health Overview</h3>
          <p className="text-sm text-muted-foreground">Detailed status of all monitored batteries</p>
        </div>
        <div className="px-6">
          <div className="rounded-md border">
            <div className="grid grid-cols-5 gap-4 bg-muted/50 p-4 font-medium">
              <div>Name</div>
              <div>Health</div>
              <div>Cycles</div>
              <div>Capacity</div>
              <div>Status</div>
            </div>
            <div className="grid grid-cols-5 gap-4 p-4 border-t">
              <div>Main Battery</div>
              <div>85%</div>
              <div>125/500</div>
              <div>4,800 mAh</div>
              <div><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Good</span></div>
            </div>
            <div className="grid grid-cols-5 gap-4 p-4 border-t">
              <div>Backup Battery</div>
              <div>65%</div>
              <div>320/500</div>
              <div>3,200 mAh</div>
              <div><span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs">Fair</span></div>
            </div>
            <div className="grid grid-cols-5 gap-4 p-4 border-t">
              <div>System Battery</div>
              <div>45%</div>
              <div>425/500</div>
              <div>2,300 mAh</div>
              <div><span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Poor</span></div>
            </div>
            <div className="grid grid-cols-5 gap-4 p-4 border-t">
              <div>Emergency Battery</div>
              <div>92%</div>
              <div>42/500</div>
              <div>4,700 mAh</div>
              <div><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Excellent</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}