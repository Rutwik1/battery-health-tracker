"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import BatteryIcon from "@/components/ui/battery-icon";
import { Battery } from "@/lib/db/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, getStatusColor, getHealthColor } from "@/lib/utils";
import { RefreshCcw, Filter, PlusCircle, Search, ChevronDown, X, Trash2 } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function BatteriesPage() {
  const [batteries, setBatteries] = useState<Battery[]>([]);
  const [filteredBatteries, setFilteredBatteries] = useState<Battery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [showHealthBelow, setShowHealthBelow] = useState(false);
  const [healthThreshold, setHealthThreshold] = useState("80");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [batteryToDelete, setBatteryToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch batteries from API
  useState(() => {
    const fetchBatteries = async () => {
      try {
        const response = await fetch('/api/batteries');
        if (!response.ok) {
          throw new Error('Failed to fetch batteries');
        }
        const data = await response.json();
        setBatteries(data);
        setFilteredBatteries(data);
      } catch (err) {
        setError('Error loading battery data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBatteries();
  }, []);

  // Apply filters
  useState(() => {
    if (!batteries.length) return;

    let result = [...batteries];

    // Apply status filter
    if (filterStatus) {
      result = result.filter(b => b.status === filterStatus);
    }

    // Apply type filter
    if (filterType) {
      result = result.filter(b => b.type === filterType);
    }

    // Apply health threshold filter
    if (showHealthBelow) {
      const threshold = parseFloat(healthThreshold);
      if (!isNaN(threshold)) {
        result = result.filter(b => Number(b.currentHealth) < threshold);
      }
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(b => 
        b.name.toLowerCase().includes(query) || 
        b.serialNumber.toLowerCase().includes(query) ||
        b.manufacturer.toLowerCase().includes(query) ||
        b.model.toLowerCase().includes(query) ||
        (b.location && b.location.toLowerCase().includes(query))
      );
    }

    setFilteredBatteries(result);
  }, [batteries, filterStatus, filterType, showHealthBelow, healthThreshold, searchQuery]);

  // Get unique battery types for filter
  const batteryTypes = [...new Set(batteries.map(b => b.type))];

  // Refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/batteries');
      if (!response.ok) {
        throw new Error('Failed to fetch batteries');
      }
      const data = await response.json();
      setBatteries(data);
    } catch (err) {
      console.error('Error refreshing data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setFilterStatus(null);
    setFilterType(null);
    setShowHealthBelow(false);
    setHealthThreshold("80");
    setSearchQuery("");
  };
  
  // Function to handle opening the delete confirmation dialog
  const handleDeleteBattery = (batteryId: number) => {
    setBatteryToDelete(batteryId);
    setIsDeleteDialogOpen(true);
  };
  
  // Function to confirm and execute battery deletion
  const confirmDeleteBattery = async () => {
    if (!batteryToDelete) return;
    
    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/batteries/${batteryToDelete}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Remove from local state
        setBatteries(prev => prev.filter(b => b.id !== batteryToDelete));
        setFilteredBatteries(prev => prev.filter(b => b.id !== batteryToDelete));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete battery');
      }
    } catch (error) {
      console.error('Error deleting battery:', error);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setBatteryToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2 md:items-center md:flex-row md:justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Batteries</h1>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-24 rounded-md" />
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
        </div>
        <div className="battery-card p-6">
          <div className="grid gap-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:items-center sm:flex-row sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Batteries</h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={isRefreshing ? "refresh-spin" : ""}
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="gradient" size="sm" asChild>
            <Link href="/dashboard/batteries/add">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Battery
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative w-full md:w-auto md:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search batteries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-lg bg-muted border border-border/50 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-primary/10 text-primary border-primary/30" : ""}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>
          
          {(filterStatus || filterType || showHealthBelow) && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={resetFilters}
            >
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>
      </div>
      
      {/* Applied Filters */}
      {(filterStatus || filterType || showHealthBelow) && (
        <div className="flex flex-wrap gap-2">
          {filterStatus && (
            <div className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/30 flex items-center">
              Status: {filterStatus}
              <button onClick={() => setFilterStatus(null)} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {filterType && (
            <div className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/30 flex items-center">
              Type: {filterType}
              <button onClick={() => setFilterType(null)} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {showHealthBelow && (
            <div className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/30 flex items-center">
              Health &lt; {healthThreshold}%
              <button onClick={() => setShowHealthBelow(false)} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Filter Panel */}
      {showFilters && (
        <div className="battery-card p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterStatus(filterStatus === 'good' ? null : 'good')}
                  className={`px-2 py-1 text-xs rounded-full ${
                    filterStatus === 'good'
                      ? 'bg-success/20 text-success border border-success/30'
                      : 'bg-muted/20 text-muted-foreground border border-border/30 hover:bg-muted/40'
                  }`}
                >
                  Good
                </button>
                <button
                  onClick={() => setFilterStatus(filterStatus === 'warning' ? null : 'warning')}
                  className={`px-2 py-1 text-xs rounded-full ${
                    filterStatus === 'warning'
                      ? 'bg-warning/20 text-warning border border-warning/30'
                      : 'bg-muted/20 text-muted-foreground border border-border/30 hover:bg-muted/40'
                  }`}
                >
                  Warning
                </button>
                <button
                  onClick={() => setFilterStatus(filterStatus === 'critical' ? null : 'critical')}
                  className={`px-2 py-1 text-xs rounded-full ${
                    filterStatus === 'critical'
                      ? 'bg-danger/20 text-danger border border-danger/30'
                      : 'bg-muted/20 text-muted-foreground border border-border/30 hover:bg-muted/40'
                  }`}
                >
                  Critical
                </button>
              </div>
            </div>
            
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Battery Type</label>
              <div className="flex flex-wrap gap-2">
                {batteryTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setFilterType(filterType === type ? null : type)}
                    className={`px-2 py-1 text-xs rounded-full ${
                      filterType === type
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'bg-muted/20 text-muted-foreground border border-border/30 hover:bg-muted/40'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Health Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Health</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowHealthBelow(!showHealthBelow)}
                  className={`px-2 py-1 text-xs rounded-full ${
                    showHealthBelow
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'bg-muted/20 text-muted-foreground border border-border/30 hover:bg-muted/40'
                  }`}
                >
                  Below
                </button>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={healthThreshold}
                  onChange={(e) => setHealthThreshold(e.target.value)}
                  className="w-16 h-7 px-2 rounded bg-muted border border-border/50 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  disabled={!showHealthBelow}
                />
                <span className="text-sm">%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Battery List */}
      <div className="battery-card">
        <div className="p-0">
          {error ? (
            <div className="p-6 text-center text-danger">
              <p>{error}</p>
              <button 
                onClick={handleRefresh} 
                className="mt-2 text-sm underline hover:text-danger/80"
              >
                Try again
              </button>
            </div>
          ) : filteredBatteries.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <p>No batteries found matching your filters</p>
              {(filterStatus || filterType || showHealthBelow || searchQuery) && (
                <button 
                  onClick={resetFilters} 
                  className="mt-2 text-sm underline text-primary hover:text-primary/80"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {filteredBatteries.map((battery) => (
                <div key={battery.id} className="flex items-center p-4 hover:bg-muted/20">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start">
                      <Link 
                        href={`/dashboard/batteries/${battery.id}`}
                        className="flex-1 min-w-0"
                      >
                        <div className="flex items-center">
                          <h3 className="font-medium truncate">{battery.name}</h3>
                          <div className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getStatusColor(battery.status)}`}>
                            {battery.status}
                          </div>
                        </div>
                        <div className="mt-1 text-sm flex flex-col sm:flex-row sm:gap-4">
                          <div className="text-muted-foreground">S/N: {battery.serialNumber}</div>
                          <div className="text-muted-foreground">{battery.manufacturer} {battery.model}</div>
                        </div>
                      </Link>
                      
                      <div className="hidden sm:block ml-4">
                        <BatteryIcon percentage={Number(battery.currentHealth)} status={battery.status} />
                      </div>
                    </div>
                    
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-x-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Health: </span>
                        <span className={getHealthColor(Number(battery.currentHealth))}>
                          {battery.currentHealth}%
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Cycles: </span>
                        <span>{battery.cycleCount}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Charged: </span>
                        <span>{formatDate(battery.lastCharged as string, "MMM d, yyyy")}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Capacity: </span>
                        <span>{battery.capacity} mAh</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="h-8 w-8 text-danger hover:text-danger hover:bg-danger/10"
                      onClick={() => handleDeleteBattery(battery.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      asChild
                    >
                      <Link href={`/dashboard/batteries/${battery.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-gradient-dark border border-border/50 backdrop-blur-md shadow-xl shadow-primary/10">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Battery Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this battery? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="bg-muted/50 border-border/50 hover:bg-muted"
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-danger hover:bg-danger/90 text-white"
              onClick={(e) => {
                e.preventDefault(); // Prevent dialog from closing automatically
                confirmDeleteBattery();
              }}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                  Deleting...
                </>
              ) : (
                "Delete Battery"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}