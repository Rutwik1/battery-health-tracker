'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Battery, 
  BarChart2, 
  Calendar, 
  AlertTriangle, 
  Settings, 
  HelpCircle,
  X 
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
    <Link 
      href={href} 
      onClick={onClick}
      className={`
        flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors
        ${active 
          ? 'bg-primary/10 text-primary' 
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'}
      `}
    >
      <span className="text-base">{icon}</span>
      <span>{children}</span>
    </Link>
  );
};

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  
  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-72 border-r border-border/40 bg-background p-6 
          shadow-lg transition-transform duration-300 ease-in-out md:shadow-none
          ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Mobile close button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-4 top-4 md:hidden" 
          onClick={onClose}
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close sidebar</span>
        </Button>
        
        {/* Logo */}
        <div className="mb-10 flex items-center">
          <Link href="/dashboard" className="flex items-center space-x-2" onClick={onClose}>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center">
              <Battery className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
              Coulomb.ai
            </span>
          </Link>
        </div>
        
        {/* Navigation */}
        <nav className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-muted-foreground px-3 uppercase tracking-wider">
              Overview
            </h3>
            <NavItem 
              href="/dashboard" 
              icon={<BarChart2 className="h-5 w-5" />} 
              active={pathname === '/dashboard'}
              onClick={onClose}
            >
              Dashboard
            </NavItem>
            <NavItem 
              href="/calendar" 
              icon={<Calendar className="h-5 w-5" />}
              active={pathname === '/calendar'}
              onClick={onClose}
            >
              Maintenance
            </NavItem>
            <NavItem 
              href="/alerts" 
              icon={<AlertTriangle className="h-5 w-5" />}
              active={pathname === '/alerts'}
              onClick={onClose}
            >
              Alerts
            </NavItem>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-muted-foreground px-3 uppercase tracking-wider">
              Settings
            </h3>
            <NavItem 
              href="/settings" 
              icon={<Settings className="h-5 w-5" />}
              active={pathname === '/settings'}
              onClick={onClose}
            >
              Settings
            </NavItem>
            <NavItem 
              href="/help" 
              icon={<HelpCircle className="h-5 w-5" />}
              active={pathname === '/help'}
              onClick={onClose}
            >
              Help & Support
            </NavItem>
          </div>
        </nav>
        
        {/* Status indicator */}
        <div className="mt-auto pt-4">
          <div className="rounded-md bg-primary/10 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">AI Status</span>
              <span className="flex h-2 w-2 rounded-full bg-green-500" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Predictive analytics system is actively monitoring battery health
            </p>
          </div>
        </div>
      </div>
    </>
  );
}