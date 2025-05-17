'use client';

import React, { useState } from 'react';
import { 
  Battery, 
  MoreHorizontal, 
  RefreshCcw, 
  Trash, 
  Info, 
  ChevronDown
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '../../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';

import { Button } from '../../components/ui/button';
import { Battery as BatteryType } from '../../app/types/schema';
import { useBatteryStore } from '../../app/store/useBatteryStore';
import { formatDate, formatNumber, getBatteryStatusColor } from '../../lib/utils';

interface BatteryHealthTableProps {
  batteries: BatteryType[];
  isLoading: boolean;
  refetch?: () => Promise<any>;
}

export default function BatteryHealthTable({ 
  batteries, 
  isLoading, 
  refetch 
}: BatteryHealthTableProps) {
  const [sortBy, setSortBy] = useState<string>('healthPercentage');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedBatteryId, setSelectedBatteryId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  const { deleteBattery } = useBatteryStore();

  // Sort batteries based on current sort settings
  const sortedBatteries = [...batteries].sort((a, b) => {
    let valueA = a[sortBy as keyof BatteryType];
    let valueB = b[sortBy as keyof BatteryType];
    
    // Special handling for dates
    if (valueA instanceof Date && valueB instanceof Date) {
      valueA = valueA.getTime();
      valueB = valueB.getTime();
    }
    
    if (valueA < valueB) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (valueA > valueB) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });
  
  // Apply filters
  const filteredBatteries = sortedBatteries.filter(battery => {
    if (!filterStatus) return true;
    return battery.status === filterStatus;
  });

  // Handle sort column click
  const handleSort = (column: string) => {
    if (sortBy === column) {
      // Toggle direction if same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, default to descending for most columns (ascending for name)
      setSortBy(column);
      setSortDirection(column === 'name' ? 'asc' : 'desc');
    }
  };
  
  // Handle refresh click
  const handleRefresh = async () => {
    if (refetch) {
      setRefreshing(true);
      await refetch();
      setRefreshing(false);
    }
  };
  
  // Handle delete battery
  const handleDeleteClick = (batteryId: number) => {
    setSelectedBatteryId(batteryId);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    if (selectedBatteryId !== null) {
      await deleteBattery(selectedBatteryId);
      setDeleteDialogOpen(false);
      if (refetch) await refetch();
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center justify-between">
            <div className="h-5 w-40 bg-muted/20 animate-pulse rounded"></div>
            <div className="h-8 w-24 bg-muted/20 animate-pulse rounded"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <div className="h-10 bg-muted/10 animate-pulse"></div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-muted/5 animate-pulse border-t border-border/50"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center">
            <Battery className="mr-2 h-5 w-5 text-primary" />
            Battery Health Details
          </CardTitle>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  {filterStatus || 'All Statuses'}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilterStatus(null)}>
                  All Statuses
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('Excellent')}>
                  Excellent
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('Good')}>
                  Good
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('Fair')}>
                  Fair
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('Poor')}>
                  Poor
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              size="sm"
              variant="outline"
              className="h-8"
              onClick={handleRefresh}
              disabled={refreshing || !refetch}
            >
              <RefreshCcw className={`h-4 w-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="w-[200px] cursor-pointer hover:bg-muted/10"
                  onClick={() => handleSort('name')}
                >
                  Battery Name
                  {sortBy === 'name' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer hover:bg-muted/10"
                  onClick={() => handleSort('healthPercentage')}
                >
                  Health
                  {sortBy === 'healthPercentage' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer hover:bg-muted/10"
                  onClick={() => handleSort('cycleCount')}
                >
                  Cycles
                  {sortBy === 'cycleCount' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer hover:bg-muted/10"
                  onClick={() => handleSort('currentCapacity')}
                >
                  Capacity
                  {sortBy === 'currentCapacity' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </TableHead>
                <TableHead 
                  className="text-right cursor-pointer hover:bg-muted/10"
                  onClick={() => handleSort('lastUpdated')}
                >
                  Last Updated
                  {sortBy === 'lastUpdated' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </TableHead>
                <TableHead className="text-right w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBatteries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No batteries found.
                    {filterStatus && (
                      <span className="block text-sm text-muted-foreground mt-1">
                        Try changing the filter or adding new batteries
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredBatteries.map((battery) => (
                  <TableRow key={battery.id}>
                    <TableCell className="font-medium">{battery.name}</TableCell>
                    <TableCell className="text-right">
                      <span className={`font-medium ${getBatteryStatusColor(battery.status)}`}>
                        {battery.healthPercentage}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {battery.cycleCount} / {battery.expectedCycles}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumber(battery.currentCapacity)} mAh
                    </TableCell>
                    <TableCell className="text-right">
                      {formatDate(battery.lastUpdated)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              // View details action
                              console.log(`View details for ${battery.id}`);
                            }}
                          >
                            <Info className="mr-2 h-4 w-4" />
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(battery.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              battery and all related data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}