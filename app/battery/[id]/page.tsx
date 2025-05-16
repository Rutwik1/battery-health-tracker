'use client'

import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useBatteryStore } from '@/lib/store/batteryStore'
import BatteryDetailView from '@/components/battery/BatteryDetailView'

export default function BatteryDetailPage() {
  const params = useParams()
  const { fetchBatteries } = useBatteryStore()
  
  const batteryId = params?.id ? parseInt(params.id as string) : null
  
  useEffect(() => {
    // Fetch initial data if not already loaded
    fetchBatteries()
  }, [fetchBatteries])
  
  if (!batteryId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="bg-card/30 backdrop-blur-md border border-border/30 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-3">Invalid Battery ID</h2>
          <p className="text-muted-foreground mb-4">No battery ID was provided or the ID is invalid.</p>
          <a href="/dashboard" className="bg-primary text-primary-foreground px-4 py-2 rounded-md inline-block">
            Return to Dashboard
          </a>
        </div>
      </div>
    )
  }
  
  return <BatteryDetailView batteryId={batteryId} />
}