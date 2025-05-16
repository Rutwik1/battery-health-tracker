'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useBatteryStore } from '@/lib/store/battery-store';
import BatteryStatusCard from '@/components/dashboard/battery-status-card';
import CapacityChart from '@/components/dashboard/capacity-chart';
import BatteryHealthTable from '@/components/dashboard/battery-health-table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
 
  // If the user is not authenticated, redirect to login
  if (status === 'unauthenticated') {
    redirect('/login');
  }

  const {
    batteries,
    isLoading,
    setBatteries,
    setIsLoading,
  } = useBatteryStore();
  
  // Fetch batteries on initial load
  useEffect(() => {
    const fetchBatteries = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/batteries');
        
        if (!response.ok) {
          throw new Error('Failed to fetch batteries');
        }
        
        const data = await response.json();
        setBatteries(data);
      } catch (error) {
        console.error('Error fetching batteries:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBatteries();
  }, [setBatteries, setIsLoading]);
  
  // Set up simulated real-time updates
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/realtime');
        
        if (!response.ok) {
          throw new Error('Failed to fetch real-time updates');
        }
        
        const data = await response.json();
        setBatteries(data);
      } catch (error) {
        console.error('Error fetching real-time updates:', error);
      }
    }, 15000); // Update every 15 seconds
    
    return () => clearInterval(interval);
  }, [setBatteries]);
  
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/batteries');
      const data = await response.json();
      setBatteries(data);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <main className="flex-1 overflow-y-auto bg-gradient-dark p-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Battery Health Dashboard</h1>
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            size="sm" 
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <BatteryStatusCard 
            battery={batteries?.[0] || null} 
            isLoading={isLoading} 
          />
          <Card className="col-span-2 backdrop-blur-md bg-card/30 border border-border/30 rounded-xl overflow-hidden shadow-xl shadow-primary/5">
            <CapacityChart 
              batteries={batteries || []} 
              timeRange={30} 
              isLoading={isLoading} 
            />
          </Card>
        </div>
        
        <div className="grid grid-cols-1 gap-8 mb-12">
          <Card className="backdrop-blur-md bg-card/30 border border-border/30 rounded-xl overflow-hidden shadow-xl shadow-primary/5">
            <BatteryHealthTable 
              batteries={batteries || []} 
              isLoading={isLoading} 
              refetch={handleRefresh} 
            />
          </Card>
        </div>
      </div>
    </main>
  );
}