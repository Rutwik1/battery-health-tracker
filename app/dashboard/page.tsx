'use client'

import { useEffect } from 'react'
import { useBatteryStore } from '@/lib/store/batteryStore'
import DashboardView from '@/components/dashboard/DashboardView'

export default function DashboardPage() {
  const { fetchBatteries, startRealtimeUpdates, stopRealtimeUpdates } = useBatteryStore()
  
  useEffect(() => {
    // Fetch initial data
    fetchBatteries()
    
    // Start real-time updates simulation
    startRealtimeUpdates()
    
    // Clean up on unmount
    return () => {
      stopRealtimeUpdates()
    }
  }, [fetchBatteries, startRealtimeUpdates, stopRealtimeUpdates])
  
  return <DashboardView />
}