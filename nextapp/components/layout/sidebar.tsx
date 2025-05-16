'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Battery, 
  ChevronRight, 
  Home, 
  Info, 
  LineChart, 
  Settings, 
  X, 
  AlertCircle, 
  BarChart3,
  Download,
  Upload 
} from 'lucide-react';
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
        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          active
            ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900 dark:text-indigo-100'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100'
        }`}
      >
        <span className="mr-3 h-5 w-5">{icon}</span>
        <span>{children}</span>
      </div>
    </Link>
  );
};

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  
  // Prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return null;
  }
  
  // Mobile sidebar overlay
  const overlayClasses = open
    ? 'fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden'
    : 'hidden';
  
  return (
    <>
      {/* Mobile sidebar overlay */}
      <div className={overlayClasses} onClick={onClose} />
      
      {/* Sidebar container */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-50 flex flex-col w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center">
            <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Battery className="h-5 w-5 text-white" />
            </div>
            <span className="ml-2 text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
              Coulomb.ai
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            <NavItem
              href="/dashboard"
              icon={<Home className="h-5 w-5" />}
              active={pathname === '/dashboard'}
              onClick={onClose}
            >
              Dashboard
            </NavItem>
            <NavItem
              href="/batteries"
              icon={<Battery className="h-5 w-5" />}
              active={pathname === '/batteries'}
              onClick={onClose}
            >
              Batteries
            </NavItem>
            <NavItem
              href="/analytics"
              icon={<LineChart className="h-5 w-5" />}
              active={pathname === '/analytics'}
              onClick={onClose}
            >
              Analytics
            </NavItem>
            <NavItem
              href="/recommendations"
              icon={<AlertCircle className="h-5 w-5" />}
              active={pathname === '/recommendations'}
              onClick={onClose}
            >
              Recommendations
            </NavItem>
            <NavItem
              href="/reports"
              icon={<BarChart3 className="h-5 w-5" />}
              active={pathname === '/reports'}
              onClick={onClose}
            >
              Reports
            </NavItem>
          </div>
          
          <div className="mt-8">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Data Management
            </h3>
            <div className="mt-2 space-y-1">
              <NavItem
                href="/import"
                icon={<Upload className="h-5 w-5" />}
                active={pathname === '/import'}
                onClick={onClose}
              >
                Import Data
              </NavItem>
              <NavItem
                href="/export"
                icon={<Download className="h-5 w-5" />}
                active={pathname === '/export'}
                onClick={onClose}
              >
                Export Data
              </NavItem>
            </div>
          </div>
        </div>
        
        {/* Bottom links */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="space-y-1">
            <NavItem
              href="/settings"
              icon={<Settings className="h-5 w-5" />}
              active={pathname === '/settings'}
              onClick={onClose}
            >
              Settings
            </NavItem>
            <NavItem
              href="/about"
              icon={<Info className="h-5 w-5" />}
              active={pathname === '/about'}
              onClick={onClose}
            >
              About
            </NavItem>
          </div>
          
          {/* Version info */}
          <div className="mt-4 px-3 py-2 text-xs text-gray-500 dark:text-gray-400">
            <p>Battery Monitor v2.1.0</p>
            <p>© 2025 Coulomb.ai</p>
          </div>
        </div>
      </div>
    </>
  );
}