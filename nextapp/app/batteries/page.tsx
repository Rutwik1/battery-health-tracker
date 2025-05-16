'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Filter, 
  ChevronDown, 
  Download, 
  SlidersHorizontal,
  AlertTriangle
} from 'lucide-react';
import { useBatteryStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import BatteryHealthTable from '@/components/dashboard/battery-health-table';
import { Battery } from '@/types';

export default function BatteriesPage() {
  const router = useRouter();
  const { 
    batteries, 
    fetchBatteries, 
    deleteBattery,
    isLoading,
    error,
    clearError
  } = useBatteryStore();
  
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  
  // Fetch batteries on mount
  useEffect(() => {
    fetchBatteries();
  }, [fetchBatteries]);
  
  // Handle selecting a battery
  const handleSelectBattery = (id: number) => {
    router.push(`/batteries/${id}`);
  };
  
  // Handle deleting a battery
  const handleDeleteBattery = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this battery? This action cannot be undone.')) {
      try {
        await deleteBattery(id);
      } catch (err) {
        console.error('Error deleting battery:', err);
      }
    }
  };
  
  // Handle editing a battery
  const handleEditBattery = (battery: Battery) => {
    // In a real application, this would open a modal or navigate to an edit page
    console.log('Edit battery:', battery);
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Batteries</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage and monitor your battery inventory
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="hidden sm:flex">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <div className="relative">
            <Button 
              variant="outline" 
              onClick={() => setFilterMenuOpen(!filterMenuOpen)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
            
            {filterMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 p-3 bg-white dark:bg-gray-950 rounded-md shadow-lg border border-gray-200 dark:border-gray-800 z-10">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Filter Batteries</h3>
                  
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 dark:text-gray-400">
                      Status
                    </label>
                    <div className="flex flex-wrap gap-1">
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        All
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        Charging
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        Discharging
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        Idle
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500 dark:text-gray-400">
                      Health
                    </label>
                    <div className="flex flex-wrap gap-1">
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        All
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        Excellent
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        Good
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        Fair
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        Poor
                      </Button>
                    </div>
                  </div>
                  
                  <Button size="sm" className="w-full mt-2">
                    Apply Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Battery
          </Button>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-red-800 dark:text-red-300">Error loading batteries</h3>
            <p className="text-sm text-red-700 dark:text-red-400 mt-1">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
              onClick={() => {
                clearError();
                fetchBatteries();
              }}
            >
              Try Again
            </Button>
          </div>
        </div>
      )}
      
      {/* Main table */}
      <BatteryHealthTable 
        batteries={batteries}
        isLoading={isLoading}
        onSelectBattery={handleSelectBattery}
        onDeleteBattery={handleDeleteBattery}
        onEditBattery={handleEditBattery}
      />
      
      {/* Settings panel */}
      <Card className="p-4 bg-gray-50 dark:bg-gray-900/50 border border-dashed">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <h3 className="font-medium">Table Settings</h3>
          </div>
          <Button variant="ghost" size="sm">
            Customize View
          </Button>
        </div>
      </Card>
    </div>
  );
}