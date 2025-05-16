import { Battery } from '@/lib/store/batteryStore'
import { format } from 'date-fns'

/**
 * Exports battery data to CSV
 */
export function exportBatteryData(batteries: Battery[], timeRange: string) {
  if (!batteries.length) return
  
  // Header row
  let csvContent = "Serial Number,Name,Initial Capacity,Current Capacity,Health %,Cycle Count,Status,Initial Date,Last Updated,Degradation Rate\n"
  
  // Add battery data rows
  batteries.forEach(battery => {
    const row = [
      `"${battery.serialNumber}"`,
      `"${battery.name}"`,
      battery.initialCapacity,
      battery.currentCapacity,
      battery.healthPercentage,
      battery.cycleCount,
      `"${battery.status}"`,
      format(new Date(battery.initialDate), 'yyyy-MM-dd'),
      format(new Date(battery.lastUpdated), 'yyyy-MM-dd'),
      battery.degradationRate
    ]
    csvContent += row.join(',') + "\n"
  })
  
  // Create a blob and download the file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const timestamp = format(new Date(), 'yyyyMMdd_HHmmss')
  
  link.setAttribute('href', url)
  link.setAttribute('download', `battery_report_${timestamp}.csv`)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}