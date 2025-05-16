'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Battery } from '@/lib/store/batteryStore'
import { getBatteryStatusColor } from '@/lib/utils'
import { 
  ChevronUp, 
  ChevronDown, 
  Search, 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  Plus
} from 'lucide-react'
import { format } from 'date-fns'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface BatteryHealthTableProps {
  batteries: Battery[];
  isLoading: boolean;
}

export default function BatteryHealthTable({ batteries, isLoading }: BatteryHealthTableProps) {
  const [sortField, setSortField] = useState<string>('healthPercentage')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [searchTerm, setSearchTerm] = useState('')
  
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }
  
  const filteredBatteries = batteries.filter(battery => 
    battery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    battery.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    battery.status.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  const sortedBatteries = [...filteredBatteries].sort((a, b) => {
    const fieldA = a[sortField as keyof Battery]
    const fieldB = b[sortField as keyof Battery]
    
    if (typeof fieldA === 'string' && typeof fieldB === 'string') {
      return sortDirection === 'asc' 
        ? fieldA.localeCompare(fieldB) 
        : fieldB.localeCompare(fieldA)
    }
    
    if (typeof fieldA === 'number' && typeof fieldB === 'number') {
      return sortDirection === 'asc' ? fieldA - fieldB : fieldB - fieldA
    }
    
    if (fieldA instanceof Date && fieldB instanceof Date) {
      return sortDirection === 'asc' 
        ? fieldA.getTime() - fieldB.getTime() 
        : fieldB.getTime() - fieldA.getTime()
    }
    
    return 0
  })
  
  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
  }
  
  return (
    <div>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-4">
        <div>
          <CardTitle className="text-xl flex items-center">
            Battery Health Table
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Detailed performance metrics of all monitored batteries
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search batteries..."
              className="w-full pl-9 py-2 pr-4 border border-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors w-full sm:w-auto justify-center">
            <Plus className="h-4 w-4" />
            <span>Add Battery</span>
          </button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="relative overflow-x-auto">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-muted/30 rounded-md"></div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-muted/20 rounded-md"></div>
              ))}
            </div>
          ) : sortedBatteries.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No batteries found matching your search criteria.</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted/30">
                <tr>
                  <th className="px-4 py-3 font-medium cursor-pointer" onClick={() => handleSort('name')}>
                    <div className="flex items-center">
                      Battery Name <SortIcon field="name" />
                    </div>
                  </th>
                  <th className="px-4 py-3 font-medium cursor-pointer" onClick={() => handleSort('serialNumber')}>
                    <div className="flex items-center">
                      Serial <SortIcon field="serialNumber" />
                    </div>
                  </th>
                  <th className="px-4 py-3 font-medium cursor-pointer" onClick={() => handleSort('healthPercentage')}>
                    <div className="flex items-center">
                      Health % <SortIcon field="healthPercentage" />
                    </div>
                  </th>
                  <th className="px-4 py-3 font-medium cursor-pointer" onClick={() => handleSort('cycleCount')}>
                    <div className="flex items-center">
                      Cycles <SortIcon field="cycleCount" />
                    </div>
                  </th>
                  <th className="px-4 py-3 font-medium cursor-pointer" onClick={() => handleSort('status')}>
                    <div className="flex items-center">
                      Status <SortIcon field="status" />
                    </div>
                  </th>
                  <th className="px-4 py-3 font-medium cursor-pointer" onClick={() => handleSort('lastUpdated')}>
                    <div className="flex items-center">
                      Last Updated <SortIcon field="lastUpdated" />
                    </div>
                  </th>
                  <th className="px-4 py-3 font-medium text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedBatteries.map((battery) => {
                  const statusColor = getBatteryStatusColor(battery.status)
                  
                  return (
                    <tr key={battery.id} className="border-b border-border/40 hover:bg-muted/20">
                      <td className="px-4 py-4 font-medium">
                        <Link 
                          href={`/battery/${battery.id}`}
                          className="hover:text-primary transition-colors"
                        >
                          {battery.name}
                        </Link>
                      </td>
                      <td className="px-4 py-4 font-mono text-xs text-muted-foreground">
                        {battery.serialNumber}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="w-full max-w-[80px] bg-muted/50 rounded-full h-1.5 mr-2">
                            <div 
                              className={`h-1.5 rounded-full ${statusColor.replace('text', 'bg')}`}
                              style={{ width: `${battery.healthPercentage}%` }}
                            ></div>
                          </div>
                          <span className={`${statusColor} text-sm font-medium`}>{battery.healthPercentage}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {battery.cycleCount} <span className="text-muted-foreground">/ {battery.expectedCycles}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor} ${statusColor.replace('text', 'bg')}/10`}>
                          {battery.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">
                        {format(new Date(battery.lastUpdated), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1 hover:bg-muted/50 rounded-md text-muted-foreground hover:text-foreground">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-1 hover:bg-muted/50 rounded-md text-muted-foreground hover:text-foreground">
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button className="p-1 hover:bg-muted/50 rounded-md text-muted-foreground hover:text-foreground">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </CardContent>
    </div>
  )
}