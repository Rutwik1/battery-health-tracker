import { Battery } from '@/lib/store/batteryStore'
import { format } from 'date-fns'

/**
 * Exports battery data to CSV
 */
export function exportBatteryData(batteries: Battery[], timeRange: string) {
  // Prepare CSV headers
  const headers = [
    'Name',
    'Serial Number',
    'Initial Capacity (mAh)',
    'Current Capacity (mAh)',
    'Health (%)',
    'Cycle Count',
    'Expected Cycles',
    'Status',
    'Initial Date',
    'Last Updated',
    'Degradation Rate (%/month)'
  ].join(',')
  
  // Prepare CSV rows
  const rows = batteries.map(battery => {
    return [
      battery.name,
      battery.serialNumber,
      battery.initialCapacity,
      battery.currentCapacity,
      battery.healthPercentage,
      battery.cycleCount,
      battery.expectedCycles,
      battery.status,
      format(new Date(battery.initialDate), 'yyyy-MM-dd'),
      format(new Date(battery.lastUpdated), 'yyyy-MM-dd'),
      battery.degradationRate
    ].join(',')
  })
  
  // Combine headers and rows
  const csvContent = [headers, ...rows].join('\n')
  
  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  
  // Create temp link and trigger download
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `battery_data_${timeRange}_days.csv`)
  document.body.appendChild(link)
  link.click()
  
  // Clean up
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}