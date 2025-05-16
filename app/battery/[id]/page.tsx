'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import BatteryDetailView from '@/components/battery/BatteryDetailView'

export default function BatteryDetailPage() {
  const params = useParams()
  const batteryId = parseInt(params?.id as string, 10)
  
  if (isNaN(batteryId)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Invalid Battery ID</h1>
          <p className="text-muted-foreground mt-2">The battery ID is invalid or not provided.</p>
          <a 
            href="/dashboard" 
            className="mt-4 inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    )
  }
  
  return <BatteryDetailView batteryId={batteryId} />
}