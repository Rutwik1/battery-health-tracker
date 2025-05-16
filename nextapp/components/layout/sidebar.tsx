'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Battery, BarChart3, Box, Home, Settings, Shield, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <Link 
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-gray-900 dark:hover:text-gray-50",
        active 
          ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50" 
          : "text-gray-500 dark:text-gray-400"
      )}
      onClick={onClick}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
};

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  
  // Close sidebar when clicking a link on mobile
  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      onClose();
    }
  };
  
  return (
    <>
      {/* Overlay */}
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-gray-950/80 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-gray-200 bg-white pb-4 transition-transform duration-200 dark:border-gray-800 dark:bg-gray-950 md:static md:z-0 md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center px-6 border-b border-gray-200 dark:border-gray-800">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700">
              <Battery className="h-4 w-4 text-white" strokeWidth={3} />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Coulomb.ai
            </span>
          </Link>
          
          {/* Close button (mobile only) */}
          <button 
            className="ml-auto rounded-lg p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 md:hidden"
            onClick={onClose}
          >
            <span className="sr-only">Close sidebar</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid gap-1 px-4">
            <NavItem
              href="/dashboard"
              icon={<Home className="h-5 w-5" />}
              active={pathname === '/dashboard'}
              onClick={handleNavClick}
            >
              Dashboard
            </NavItem>
            <NavItem
              href="/batteries"
              icon={<Battery className="h-5 w-5" />}
              active={pathname?.startsWith('/batteries')}
              onClick={handleNavClick}
            >
              Batteries
            </NavItem>
            <NavItem
              href="/analytics"
              icon={<BarChart3 className="h-5 w-5" />}
              active={pathname?.startsWith('/analytics')}
              onClick={handleNavClick}
            >
              Analytics
            </NavItem>
            <NavItem
              href="/inventory"
              icon={<Box className="h-5 w-5" />}
              active={pathname?.startsWith('/inventory')}
              onClick={handleNavClick}
            >
              Inventory
            </NavItem>
            <NavItem
              href="/security"
              icon={<Shield className="h-5 w-5" />}
              active={pathname?.startsWith('/security')}
              onClick={handleNavClick}
            >
              Security
            </NavItem>
          </nav>
        </div>
        
        {/* Bottom section */}
        <div className="mt-auto px-4 py-3">
          <nav className="grid gap-1">
            <NavItem
              href="/settings"
              icon={<Settings className="h-5 w-5" />}
              active={pathname?.startsWith('/settings')}
              onClick={handleNavClick}
            >
              Settings
            </NavItem>
            <NavItem
              href="/team"
              icon={<Users className="h-5 w-5" />}
              active={pathname?.startsWith('/team')}
              onClick={handleNavClick}
            >
              Team
            </NavItem>
          </nav>
        </div>
      </aside>
    </>
  );
}