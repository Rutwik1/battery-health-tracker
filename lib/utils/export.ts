import { Battery } from '@/lib/store/batteryStore'
import { formatDate } from '@/lib/utils'

/**
 * Exports battery data to CSV
 */
export function exportBatteryData(batteries: Battery[], timeRange: string) {
  // Define CSV headers
  const headers = [
    'Name',
    'Serial Number',
    'Health Percentage',
    'Current Capacity (mAh)',
    'Initial Capacity (mAh)',
    'Cycle Count',
    'Expected Cycles',
    'Degradation Rate (% per month)',
    'Status',
    'Initial Date',
    'Last Updated'
  ]
  
  // Map battery data to CSV format
  const rows = batteries.map(battery => [
    battery.name,
    battery.serialNumber,
    `${battery.healthPercentage}%`,
    battery.currentCapacity.toString(),
    battery.initialCapacity.toString(),
    battery.cycleCount.toString(),
    battery.expectedCycles.toString(),
    `${battery.degradationRate}%`,
    battery.status,
    formatDate(battery.initialDate, 'yyyy-MM-dd'),
    formatDate(battery.lastUpdated, 'yyyy-MM-dd')
  ])
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n')
  
  // Create a blob and download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  
  link.setAttribute('href', url)
  link.setAttribute('download', `battery-data-${timeRange}-days.csv`)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}