'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Battery, 
  BarChart2, 
  Settings, 
  History,
  Users,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { cn } from '../../lib/utils';

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
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
        active ? "bg-muted font-medium text-primary" : "text-muted-foreground hover:bg-muted/50"
      )}
      onClick={onClick}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
};

export default function Sidebar({ isMobile, onNavItemClick }: { isMobile?: boolean; onNavItemClick?: () => void }) {
  const pathname = usePathname();
  
  return (
    <div className={cn(
      "pb-12",
      isMobile ? "px-2 py-4" : "p-4 border-r min-h-screen"
    )}>
      <div className="space-y-4 py-4">
        <div className="flex items-center justify-center mb-10">
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M14 6h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2" />
              <path d="M6 6h6v10H6z" />
              <line x1="6" y1="10" x2="12" y2="10" />
            </svg>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-background"></div>
          </div>
          <h1 className="px-2 text-xl font-bold">Coulomb.ai</h1>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-1 text-xs font-semibold tracking-tight">Overview</h2>
          <div className="space-y-1">
            <NavItem 
              href="/" 
              icon={<LayoutDashboard className="h-4 w-4" />} 
              active={pathname === "/"} 
              onClick={onNavItemClick}
            >
              Dashboard
            </NavItem>
            <NavItem 
              href="/batteries" 
              icon={<Battery className="h-4 w-4" />} 
              active={pathname === "/batteries"} 
              onClick={onNavItemClick}
            >
              Batteries
            </NavItem>
            <NavItem 
              href="/analytics" 
              icon={<BarChart2 className="h-4 w-4" />} 
              active={pathname === "/analytics"} 
              onClick={onNavItemClick}
            >
              Analytics
            </NavItem>
            <NavItem 
              href="/history" 
              icon={<History className="h-4 w-4" />}
              active={pathname === "/history"} 
              onClick={onNavItemClick}
            >
              History
            </NavItem>
          </div>
        </div>
        
        <div className="px-3 py-2">
          <h2 className="mb-2 px-1 text-xs font-semibold tracking-tight">Settings</h2>
          <div className="space-y-1">
            <NavItem 
              href="/settings" 
              icon={<Settings className="h-4 w-4" />} 
              active={pathname === "/settings"} 
              onClick={onNavItemClick}
            >
              General
            </NavItem>
            <NavItem 
              href="/users" 
              icon={<Users className="h-4 w-4" />} 
              active={pathname === "/users"} 
              onClick={onNavItemClick}
            >
              Users
            </NavItem>
          </div>
        </div>
      </div>
      
      <div className="fixed bottom-4 left-4 right-4 space-y-1">
        <NavItem 
          href="/help" 
          icon={<HelpCircle className="h-4 w-4" />} 
          active={pathname === "/help"} 
          onClick={onNavItemClick}
        >
          Help & Resources
        </NavItem>
        <NavItem 
          href="/logout" 
          icon={<LogOut className="h-4 w-4" />} 
          active={false} 
          onClick={onNavItemClick}
        >
          Logout
        </NavItem>
      </div>
    </div>
  );
}