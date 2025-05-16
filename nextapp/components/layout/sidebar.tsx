'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, LayoutDashboard, Battery, Activity, Settings, ChevronRight, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

const NavItem = ({ href, icon, children, active, onClick }: NavItemProps) => {
  return (
    <Link href={href} onClick={onClick} className="block">
      <div 
        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
          active 
            ? 'bg-primary/10 text-primary glow-soft-primary' 
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
        }`}
      >
        <span className="text-lg">{icon}</span>
        <span className="flex-1">{children}</span>
        {active && <ChevronRight className="h-4 w-4" />}
      </div>
    </Link>
  );
};

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  
  // Handle small screen sidebar
  const sidebarClasses = open 
    ? "translate-x-0 opacity-100" 
    : "-translate-x-full opacity-0 lg:translate-x-0 lg:opacity-100";
  
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed lg:sticky top-0 z-50 h-full w-64 bg-gradient-to-b from-gray-900 to-slate-950 border-r border-border/40 p-4 transform transition-all duration-300 ease-in-out ${sidebarClasses}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Battery className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg bg-gradient-primary text-transparent bg-clip-text">Coulomb.ai</span>
            </Link>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Navigation */}
          <nav className="space-y-1 mb-6">
            <NavItem 
              href="/dashboard" 
              icon={<LayoutDashboard />}
              active={pathname === '/dashboard'}
              onClick={onClose}
            >
              Dashboard
            </NavItem>
            <NavItem 
              href="/dashboard/batteries" 
              icon={<Battery />}
              active={pathname === '/dashboard/batteries'}
              onClick={onClose}
            >
              Batteries
            </NavItem>
            <NavItem 
              href="/dashboard/analytics" 
              icon={<BarChart3 />}
              active={pathname === '/dashboard/analytics'}
              onClick={onClose}
            >
              Analytics
            </NavItem>
            <NavItem 
              href="/dashboard/monitoring" 
              icon={<Activity />}
              active={pathname === '/dashboard/monitoring'}
              onClick={onClose}
            >
              Monitoring
            </NavItem>
          </nav>
          
          {/* Footer */}
          <div className="mt-auto">
            <NavItem 
              href="/dashboard/settings" 
              icon={<Settings />}
              active={pathname === '/dashboard/settings'}
              onClick={onClose}
            >
              Settings
            </NavItem>
          </div>
        </div>
      </div>
    </>
  );
}