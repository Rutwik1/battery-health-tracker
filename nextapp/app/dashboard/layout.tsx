'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/sidebar';
import Topbar from '@/components/layout/topbar';
import { useBatteryStore } from '@/lib/store';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { fetchBatteries } = useBatteryStore();

  // Fetch batteries data on initial load
  useEffect(() => {
    fetchBatteries();
  }, [fetchBatteries]);

  return (
    <div className="flex min-h-screen flex-col">
      <Topbar onMenuClick={() => setSidebarOpen(true)} />
      
      <div className="flex flex-1">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}