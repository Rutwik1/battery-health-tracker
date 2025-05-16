'use client'

import React, { ReactNode, useEffect } from 'react'
import { ThemeProvider } from 'next-themes'
import { useBatteryStore } from '@/lib/store/batteryStore'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const { fetchBatteries, startRealtimeUpdates, stopRealtimeUpdates } = useBatteryStore()
  
  // Initialize the data store and start real-time updates
  useEffect(() => {
    // Fetch initial data
    fetchBatteries()
    
    // Start real-time updates
    startRealtimeUpdates()
    
    // Cleanup on unmount
    return () => {
      stopRealtimeUpdates()
    }
  }, [fetchBatteries, startRealtimeUpdates, stopRealtimeUpdates])
  
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      {children}
    </ThemeProvider>
  )
}