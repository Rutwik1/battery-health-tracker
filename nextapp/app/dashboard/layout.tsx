'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/layout/sidebar';
import Topbar from '@/components/layout/topbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="relative min-h-screen bg-background">
      <Sidebar open={sidebarOpen} onClose={closeSidebar} />
      
      <div className="flex flex-col md:pl-72">
        <Topbar onMenuClick={openSidebar} />
        
        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}