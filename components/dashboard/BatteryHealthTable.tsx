'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Battery } from '@/lib/store/batteryStore'
import { getBatteryStatusColor, formatNumber, formatRelativeTime } from '@/lib/utils'
import { 
  ChevronDown, 
  ChevronUp, 
  Battery as BatteryIcon, 
  Zap, 
  Clock, 
  ArrowUpDown,
  AlertTriangle,
  CheckCircle,
  ExternalLink
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface BatteryHealthTableProps {
  batteries: Battery[];
  isLoading: boolean;
}

export default function BatteryHealthTable({ batteries, isLoading }: BatteryHealthTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Battery;
    direction: 'ascending' | 'descending';
  }>({
    key: 'healthPercentage',
    direction: 'descending',
  })
  
  const requestSort = (key: keyof Battery) => {
    let direction: 'ascending' | 'descending' = 'ascending'
    
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    
    setSortConfig({ key, direction })
  }
  
  const sortedBatteries = React.useMemo(() => {
    const sortableBatteries = [...batteries]
    
    if (sortConfig.key) {
      sortableBatteries.sort((a, b) => {
        // Handle dates specially
        if (sortConfig.key === 'initialDate' || sortConfig.key === 'lastUpdated') {
          const dateA = new Date(a[sortConfig.key] as string).getTime()
          const dateB = new Date(b[sortConfig.key] as string).getTime()
          
          if (sortConfig.direction === 'ascending') {
            return dateA - dateB
          }
          return dateB - dateA
        }
        
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
    }
    
    return sortableBatteries
  }, [batteries, sortConfig])
  
  // Create table header with sorting buttons
  const SortableHeader = ({ label, sortKey }: { label: string; sortKey: keyof Battery }) => {
    const isSorted = sortConfig.key === sortKey
    
    return (
      <button
        onClick={() => requestSort(sortKey)}
        className="flex items-center text-left font-medium text-xs uppercase tracking-wider focus:outline-none group"
      >
        <span>{label}</span>
        <span className="ml-1 text-muted-foreground">
          {isSorted ? (
            sortConfig.direction === 'ascending' ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )
          ) : (
            <ArrowUpDown className="h-4 w-4 opacity-0 group-hover:opacity-50" />
          )}
        </span>
      </button>
    )
  }
  
  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center">
          <BatteryIcon className="mr-2 h-5 w-5 text-primary" />
          <span>Battery Health Table</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-4 overflow-auto rounded-md border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="whitespace-nowrap py-3 px-4 text-left">
                  <SortableHeader label="Battery" sortKey="name" />
                </th>
                <th className="whitespace-nowrap py-3 px-4 text-left">
                  <SortableHeader label="Serial Number" sortKey="serialNumber" />
                </th>
                <th className="whitespace-nowrap py-3 px-4 text-left">
                  <SortableHeader label="Health" sortKey="healthPercentage" />
                </th>
                <th className="whitespace-nowrap py-3 px-4 text-left">
                  <SortableHeader label="Current Capacity" sortKey="currentCapacity" />
                </th>
                <th className="whitespace-nowrap py-3 px-4 text-left">
                  <SortableHeader label="Cycles" sortKey="cycleCount" />
                </th>
                <th className="whitespace-nowrap py-3 px-4 text-left">
                  <SortableHeader label="Degradation" sortKey="degradationRate" />
                </th>
                <th className="whitespace-nowrap py-3 px-4 text-left">
                  <SortableHeader label="Status" sortKey="status" />
                </th>
                <th className="whitespace-nowrap py-3 px-4 text-left">
                  <SortableHeader label="Last Updated" sortKey="lastUpdated" />
                </th>
                <th className="whitespace-nowrap py-3 px-4 text-left">
                  <span className="text-xs uppercase font-medium">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                // Skeleton loading rows
                Array(5).fill(0).map((_, index) => (
                  <tr key={index} className="animate-pulse bg-background hover:bg-muted/50">
                    <td className="p-4"><div className="h-4 w-32 bg-muted rounded"></div></td>
                    <td className="p-4"><div className="h-4 w-32 bg-muted rounded"></div></td>
                    <td className="p-4"><div className="h-4 w-16 bg-muted rounded"></div></td>
                    <td className="p-4"><div className="h-4 w-24 bg-muted rounded"></div></td>
                    <td className="p-4"><div className="h-4 w-16 bg-muted rounded"></div></td>
                    <td className="p-4"><div className="h-4 w-16 bg-muted rounded"></div></td>
                    <td className="p-4"><div className="h-4 w-16 bg-muted rounded"></div></td>
                    <td className="p-4"><div className="h-4 w-24 bg-muted rounded"></div></td>
                    <td className="p-4"><div className="h-4 w-16 bg-muted rounded"></div></td>
                  </tr>
                ))
              ) : sortedBatteries.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-muted-foreground">
                    <BatteryIcon className="mx-auto h-8 w-8 mb-2 text-muted-foreground/50" />
                    <p>No batteries found</p>
                    <button className="mt-2 inline-flex items-center px-2 py-1 text-xs border rounded-md border-border bg-muted/10 hover:bg-muted/30">
                      Add Battery
                    </button>
                  </td>
                </tr>
              ) : (
                sortedBatteries.map((battery) => {
                  const statusColor = getBatteryStatusColor(battery.status)
                  
                  return (
                    <tr key={battery.id} className="bg-background hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">
                        <div className="flex items-center">
                          <div className={`mr-2 w-2 h-2 rounded-full ${statusColor.replace('text', 'bg')}`}></div>
                          {battery.name}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-muted-foreground">
                        {battery.serialNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="relative w-16 h-2 bg-muted/50 rounded-full overflow-hidden mr-2">
                            <div
                              className={`absolute top-0 left-0 h-full ${statusColor.replace('text', 'bg')}`}
                              style={{ width: `${battery.healthPercentage}%` }}
                            ></div>
                          </div>
                          <span className={`text-xs font-medium ${statusColor}`}>
                            {battery.healthPercentage}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Zap className={`h-3 w-3 mr-1.5 ${statusColor}`} />
                          <span>
                            {formatNumber(battery.currentCapacity)} <span className="text-xs text-muted-foreground">mAh</span>
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <span>
                            {battery.cycleCount} <span className="text-xs text-muted-foreground">/ {battery.expectedCycles}</span>
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <span className={battery.degradationRate > 1 ? 'text-danger' : 'text-success'}>
                            {battery.degradationRate}% <span className="text-xs text-muted-foreground">/ month</span>
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted/30">
                          {battery.status === 'Poor' ? (
                            <AlertTriangle className={`h-3 w-3 mr-1 ${statusColor}`} />
                          ) : (
                            <CheckCircle className={`h-3 w-3 mr-1 ${statusColor}`} />
                          )}
                          <span className={statusColor}>{battery.status}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1.5" />
                          <span>{formatRelativeTime(battery.lastUpdated)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Link href={`/battery/${battery.id}`} passHref className="inline-flex items-center text-primary hover:text-primary/80 text-sm">
                          <span>Details</span>
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}