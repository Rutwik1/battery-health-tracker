'use client';

import { useState } from 'react';
import { Battery } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import Link from 'next/link';
import { 
  Filter, 
  RefreshCcw, 
  Eye, 
  Trash2, 
  X, 
  ChevronLeft, 
  ChevronRight,
  ListFilter,
  Battery
} from 'lucide-react';
import { getBatteryStatusColor, getBatteryStatusBgColor } from '@/lib/utils';

interface BatteryHealthTableProps {
  batteries: Battery[];
  isLoading: boolean;
  refetch?: () => Promise<any>;
}

export default function BatteryHealthTable({ 
  batteries, 
  isLoading, 
  refetch 
}: BatteryHealthTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterBattery, setFilterBattery] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [showHealthBelow, setShowHealthBelow] = useState(false);
  const [healthThreshold, setHealthThreshold] = useState("80");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [batteryToDelete, setBatteryToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const itemsPerPage = 4;
  
  // Filter batteries based on filter criteria
  const filteredBatteries = batteries.filter(battery => {
    if (filterBattery && !battery.name.toLowerCase().includes(filterBattery.toLowerCase())) {
      return false;
    }
    
    if (filterStatus && battery.status !== filterStatus) {
      return false;
    }
    
    if (showHealthBelow && battery.healthPercentage >= parseInt(healthThreshold)) {
      return false;
    }
    
    return true;
  });
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredBatteries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredBatteries.length);
  const currentBatteries = filteredBatteries.slice(startIndex, endIndex);
  
  // Handle page changes
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilterBattery(null);
    setFilterStatus(null);
    setShowHealthBelow(false);
    setHealthThreshold("80");
  };
  
  // Handle battery deletion
  const handleDeleteBattery = (batteryId: number) => {
    setBatteryToDelete(batteryId);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDeleteBattery = async () => {
    if (!batteryToDelete) return;
    
    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/batteries/${batteryToDelete}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Show toast notification here
        console.log("Battery deleted successfully");
        
        if (refetch) {
          await refetch();
        }
      } else {
        throw new Error('Failed to delete battery');
      }
    } catch (error) {
      console.error("Error deleting battery:", error);
      // Show error toast here
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setBatteryToDelete(null);
    }
  };
  
  return (
    <Card className="bg-card/30 border border-border/30 rounded-xl shadow-xl shadow-primary/5">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <ListFilter className="h-5 w-5 text-primary" />
            Battery Health Details
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={isFilterOpen ? "bg-primary/10 text-primary" : ""}
            >
              <Filter className="h-4 w-4 mr-1" />
              Filter
              {(filterBattery || filterStatus || showHealthBelow) && (
                <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {(filterBattery ? 1 : 0) + (filterStatus ? 1 : 0) + (showHealthBelow ? 1 : 0)}
                </span>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch && refetch()}
              disabled={isLoading}
            >
              <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="sr-only">Refresh</span>
            </Button>
          </div>
        </div>
        
        {isFilterOpen && (
          <div className="mt-4 bg-secondary/30 p-4 rounded-lg border border-border/50 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <div className="w-full sm:w-auto">
                <label htmlFor="batteryFilter" className="block text-sm font-medium mb-1">
                  Battery Name
                </label>
                <input
                  id="batteryFilter"
                  type="text"
                  className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Filter by name"
                  value={filterBattery || ''}
                  onChange={(e) => setFilterBattery(e.target.value || null)}
                />
              </div>
              
              <div className="w-full sm:w-auto">
                <label htmlFor="statusFilter" className="block text-sm font-medium mb-1">
                  Status
                </label>
                <select
                  id="statusFilter"
                  className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  value={filterStatus || ''}
                  onChange={(e) => setFilterStatus(e.target.value || null)}
                >
                  <option value="">All Statuses</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              
              <div className="w-full sm:w-auto flex items-end gap-2">
                <div>
                  <div className="flex items-center mb-1">
                    <input
                      id="healthThreshold"
                      type="checkbox"
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                      checked={showHealthBelow}
                      onChange={(e) => setShowHealthBelow(e.target.checked)}
                    />
                    <label htmlFor="healthThreshold" className="ml-2 block text-sm font-medium">
                      Health below
                    </label>
                  </div>
                  <input
                    type="text"
                    className="w-16 px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    value={healthThreshold}
                    onChange={(e) => setHealthThreshold(e.target.value)}
                    disabled={!showHealthBelow}
                  />
                  <span className="ml-1">%</span>
                </div>
              </div>
              
              <div className="w-full sm:w-auto mt-4 sm:mt-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="flex items-center"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/40">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Serial</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Health</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Cycles</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBatteries.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                        No batteries match the current filters.
                      </td>
                    </tr>
                  ) : (
                    currentBatteries.map((battery) => (
                      <tr key={battery.id} className="border-b border-border/20 hover:bg-secondary/10">
                        <td className="px-4 py-3 text-sm">
                          <div className="font-medium">{battery.name}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {battery.serialNumber}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-full max-w-24 bg-secondary/30 rounded-full h-2.5">
                              <div 
                                className={`h-2.5 rounded-full ${getBatteryStatusBgColor(battery.status)}`}
                                style={{ width: `${battery.healthPercentage}%` }}
                              ></div>
                            </div>
                            <span>{battery.healthPercentage.toFixed(0)}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {Math.floor(battery.cycleCount)} / {battery.expectedCycles}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBatteryStatusBgColor(battery.status)} ${getBatteryStatusColor(battery.status)}`}>
                            {battery.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Link href={`/dashboard/batteries/${battery.id}`}>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="View Details">
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive/80"
                              onClick={() => handleDeleteBattery(battery.id)}
                              title="Delete Battery"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                  <span className="font-medium">{endIndex}</span> of{" "}
                  <span className="font-medium">{filteredBatteries.length}</span> batteries
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous page</span>
                  </Button>
                  <div className="text-sm">
                    Page <span className="font-medium">{currentPage}</span> of{" "}
                    <span className="font-medium">{totalPages}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next page</span>
                  </Button>
                </div>
              </div>
            )}
            
            {/* Delete Confirmation Dialog */}
            {isDeleteDialogOpen && (
              <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="bg-card border border-border rounded-lg shadow-lg max-w-md w-full p-6">
                  <h3 className="text-lg font-medium mb-4">Confirm Battery Deletion</h3>
                  <p className="text-muted-foreground mb-6">
                    Are you sure you want to delete this battery? This action cannot be undone.
                  </p>
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsDeleteDialogOpen(false);
                        setBatteryToDelete(null);
                      }}
                      disabled={isDeleting}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={confirmDeleteBattery}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete Battery"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}