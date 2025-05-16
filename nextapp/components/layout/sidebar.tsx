'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Battery, 
  Settings, 
  AlertTriangle, 
  BarChart2, 
  History, 
  Info, 
  Users,
  X
} from 'lucide-react';
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
        "flex items-center gap-3 px-3 py-2 text-base rounded-md transition-colors",
        active 
          ? "bg-gradient-to-r from-primary/20 to-primary/10 text-primary font-medium" 
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      )}
      onClick={onClick}
    >
      <div className="shrink-0 w-5 h-5">{icon}</div>
      <span>{children}</span>
      {active && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"></div>
      )}
    </Link>
  );
};

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  
  return (
    <>
      {/* Backdrop */}
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed top-0 z-50 h-screen w-72 border-r border-border/50 bg-gradient-to-b from-background/95 to-background/80 backdrop-blur-md backdrop-saturate-150 p-4 transition-transform duration-300 md:translate-x-0 md:z-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile close button */}
        <button 
          className="absolute right-4 top-4 rounded-sm p-1 text-foreground/80 hover:bg-muted md:hidden"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>
        
        {/* Logo */}
        <div className="mb-8 flex h-12 items-center gap-2 px-3 mt-2">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Battery className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="font-bold text-lg bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Coulomb.ai
          </div>
        </div>
        
        {/* Main navigation */}
        <div className="space-y-1 mb-8">
          <NavItem 
            href="/dashboard" 
            icon={<LayoutDashboard className="h-5 w-5" />}
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
            icon={<BarChart2 className="h-5 w-5" />}
            active={pathname === '/analytics'}
            onClick={onClose}
          >
            Analytics
          </NavItem>
          
          <NavItem 
            href="/alerts" 
            icon={<AlertTriangle className="h-5 w-5" />}
            active={pathname === '/alerts'}
            onClick={onClose}
          >
            Alerts
          </NavItem>
          
          <NavItem 
            href="/history" 
            icon={<History className="h-5 w-5" />}
            active={pathname === '/history'}
            onClick={onClose}
          >
            History
          </NavItem>
        </div>
        
        {/* Secondary navigation */}
        <div className="space-y-1">
          <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
            Settings
          </div>
          
          <NavItem 
            href="/team" 
            icon={<Users className="h-5 w-5" />}
            active={pathname === '/team'}
            onClick={onClose}
          >
            Team
          </NavItem>
          
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
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between px-3 py-2 text-xs text-muted-foreground border-t border-border/40 pt-4">
          <div>Coulomb.ai</div>
          <div>v2.0.0</div>
        </div>
      </div>
    </>
  );
}