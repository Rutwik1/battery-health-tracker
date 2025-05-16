import React, { useState } from 'react';
import Sidebar from '@/components/layout/sidebar';
import Topbar from '@/components/layout/topbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  return (
    <div className="h-screen flex flex-col md:flex-row">
      {/* Mobile sidebar overlay */}
      {showMobileMenu && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setShowMobileMenu(false)}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={`${
          showMobileMenu ? 'fixed inset-y-0 left-0 z-50' : 'hidden'
        } md:relative md:flex md:w-64 md:flex-col md:z-auto`}
      >
        <Sidebar 
          isMobile={showMobileMenu} 
          onNavItemClick={() => setShowMobileMenu(false)} 
        />
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar onMenuClick={() => setShowMobileMenu(true)} />
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}