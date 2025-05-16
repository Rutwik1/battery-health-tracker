'use client';

import React from 'react';
import { Battery } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Battery as BatteryIcon, 
  ArrowUpDown, 
  MoreHorizontal, 
  Download, 
  FileBarChart2, 
  Trash2,
  PencilLine,
  ArrowDown10, 
  ArrowUp10 
} from 'lucide-react';
import { 
  formatDateTime, 
  formatNumber, 
  getHealthStatusColor, 
  getHealthStatusText 
} from '@/lib/utils';

interface BatteryHealthTableProps {
  batteries: Battery[];
  isLoading: boolean;
  onSelectBattery?: (id: number) => void;
  onDeleteBattery?: (id: number) => void;
  onEditBattery?: (battery: Battery) => void;
}

export default function BatteryHealthTable({ 
  batteries, 
  isLoading, 
  onSelectBattery,
  onDeleteBattery,
  onEditBattery 
}: BatteryHealthTableProps) {
  const [sortField, setSortField] = React.useState<keyof Battery>('health');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc');
  
  // Handle sort change
  const handleSort = (field: keyof Battery) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, set default sort direction based on field
      setSortField(field);
      
      // Default sort direction by column
      if (field === 'name' || field === 'manufacturer' || field === 'model') {
        setSortDirection('asc');
      } else {
        setSortDirection('desc');
      }
    }
  };
  
  // Sort batteries based on current sort settings
  const sortedBatteries = [...batteries].sort((a, b) => {
    // Handle different data types
    if (typeof a[sortField] === 'string' && typeof b[sortField] === 'string') {
      const aStr = a[sortField] as string;
      const bStr = b[sortField] as string;
      return sortDirection === 'asc' 
        ? aStr.localeCompare(bStr) 
        : bStr.localeCompare(aStr);
    } else if (typeof a[sortField] === 'number' && typeof b[sortField] === 'number') {
      const aNum = a[sortField] as number;
      const bNum = b[sortField] as number;
      return sortDirection === 'asc' 
        ? aNum - bNum 
        : bNum - aNum;
    } else if (a[sortField] instanceof Date && b[sortField] instanceof Date) {
      const aDate = a[sortField] as unknown as Date;
      const bDate = b[sortField] as unknown as Date;
      return sortDirection === 'asc' 
        ? aDate.getTime() - bDate.getTime() 
        : bDate.getTime() - aDate.getTime();
    } else {
      // Default string comparison for ISODate strings, etc.
      const aVal = String(a[sortField]);
      const bVal = String(b[sortField]);
      return sortDirection === 'asc' 
        ? aVal.localeCompare(bVal) 
        : bVal.localeCompare(aVal);
    }
  });
  
  // Get header cell classes
  const getHeaderClasses = (field: keyof Battery) => {
    return `px-4 py-3 text-left text-xs font-medium tracking-wide text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
      sortField === field ? 'bg-gray-50 dark:bg-gray-800' : ''
    }`;
  };
  
  // Get sort icon
  const getSortIcon = (field: keyof Battery) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 ml-1" />;
    }
    return sortDirection === 'asc' 
      ? <ArrowUp10 className="h-4 w-4 ml-1" /> 
      : <ArrowDown10 className="h-4 w-4 ml-1" />;
  };
  
  // Export data to CSV
  const exportToCSV = () => {
    // Define CSV header
    const headers = [
      'Name', 'Serial Number', 'Manufacturer', 'Model',
      'Manufacture Date', 'Capacity (Wh)', 'Voltage (V)', 
      'Cycle Count', 'Health (%)', 'Status', 'Last Checked'
    ].join(',');
    
    // Convert each battery to CSV row
    const rows = sortedBatteries.map(battery => {
      return [
        battery.name,
        battery.serialNumber,
        battery.manufacturer,
        battery.model,
        battery.manufactureDate,
        battery.capacity,
        battery.voltage,
        battery.cycleCount,
        battery.health,
        battery.status,
        battery.lastChecked
      ].join(',');
    });
    
    // Create CSV content
    const csvContent = [headers, ...rows].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link and click it
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `battery_health_data_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Battery Health Status</CardTitle>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportToCSV}
            className="text-gray-700 dark:text-gray-300"
            title="Export to CSV"
          >
            <Download className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-gray-700 dark:text-gray-300"
            title="View Analytics"
          >
            <FileBarChart2 className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Analytics</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th 
                  className={getHeaderClasses('name')}
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Battery
                    {getSortIcon('name')}
                  </div>
                </th>
                <th 
                  className={getHeaderClasses('model')}
                  onClick={() => handleSort('model')}
                >
                  <div className="flex items-center">
                    Model
                    {getSortIcon('model')}
                  </div>
                </th>
                <th 
                  className={getHeaderClasses('capacity')}
                  onClick={() => handleSort('capacity')}
                >
                  <div className="flex items-center">
                    Capacity
                    {getSortIcon('capacity')}
                  </div>
                </th>
                <th 
                  className={getHeaderClasses('cycleCount')}
                  onClick={() => handleSort('cycleCount')}
                >
                  <div className="flex items-center">
                    Cycles
                    {getSortIcon('cycleCount')}
                  </div>
                </th>
                <th 
                  className={getHeaderClasses('health')}
                  onClick={() => handleSort('health')}
                >
                  <div className="flex items-center">
                    Health
                    {getSortIcon('health')}
                  </div>
                </th>
                <th 
                  className={getHeaderClasses('status')}
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    {getSortIcon('status')}
                  </div>
                </th>
                <th 
                  className={getHeaderClasses('lastChecked')}
                  onClick={() => handleSort('lastChecked')}
                >
                  <div className="flex items-center">
                    Last Checked
                    {getSortIcon('lastChecked')}
                  </div>
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium tracking-wide text-gray-500 dark:text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                // Loading skeleton
                Array(5).fill(0).map((_, index) => (
                  <tr key={`skeleton-${index}`} className="bg-white dark:bg-gray-950">
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <Skeleton className="h-8 w-8 rounded-full mr-3" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="px-4 py-4">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="px-4 py-4">
                      <Skeleton className="h-4 w-12" />
                    </td>
                    <td className="px-4 py-4">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="px-4 py-4">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="px-4 py-4">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Skeleton className="h-8 w-20 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : sortedBatteries.length === 0 ? (
                // Empty state
                <tr className="bg-white dark:bg-gray-950">
                  <td colSpan={8} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <BatteryIcon className="h-8 w-8 text-gray-400 dark:text-gray-600" strokeWidth={1.5} />
                      <p>No batteries found</p>
                      <Button variant="outline" size="sm">
                        Add Battery
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                // Battery rows
                sortedBatteries.map(battery => (
                  <tr 
                    key={battery.id} 
                    className="bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer transition-colors"
                    onClick={() => onSelectBattery && onSelectBattery(battery.id)}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className={`h-8 w-8 flex items-center justify-center rounded-full mr-3
                          ${battery.health > 70 ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 
                            battery.health > 30 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' :
                            'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'}`}
                        >
                          <BatteryIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{battery.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{battery.serialNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                      <div>{battery.model}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{battery.manufacturer}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {formatNumber(battery.capacity / 1000, 1)} kWh
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {battery.cycleCount}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div 
                          className={`w-16 h-2 rounded-full mr-2 ${
                            battery.health > 70 ? 'bg-gradient-to-r from-green-400 to-green-500' : 
                            battery.health > 30 ? 'bg-gradient-to-r from-amber-400 to-amber-500' :
                            'bg-gradient-to-r from-red-400 to-red-500'
                          }`}
                        >
                          <div 
                            className="h-full rounded-full bg-green-500" 
                            style={{ width: `${battery.health}%` }}
                          />
                        </div>
                        <span className={`text-sm font-medium ${getHealthStatusColor(battery.health)}`}>
                          {battery.health}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {getHealthStatusText(battery.health)}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        battery.status.toLowerCase() === 'charging' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                        battery.status.toLowerCase() === 'discharging' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' :
                        battery.status.toLowerCase() === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                      }`}>
                        {battery.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {formatDateTime(battery.lastChecked)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex justify-end space-x-1" onClick={e => e.stopPropagation()}>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-7 w-7 text-gray-600 dark:text-gray-400"
                          onClick={() => onEditBattery && onEditBattery(battery)}
                          title="Edit battery"
                        >
                          <PencilLine className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-7 w-7 text-gray-600 dark:text-gray-400"
                          onClick={() => onDeleteBattery && onDeleteBattery(battery.id)}
                          title="Delete battery"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-7 w-7 text-gray-600 dark:text-gray-400"
                          title="More actions"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}