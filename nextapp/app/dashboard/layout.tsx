'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/sidebar';
import Topbar from '@/components/layout/topbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="relative flex min-h-screen flex-col">
      <Topbar onMenuClick={() => setSidebarOpen(true)} />
      
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 p-4 md:p-6 pt-6">
        {children}
      </main>
    </div>
  );
}