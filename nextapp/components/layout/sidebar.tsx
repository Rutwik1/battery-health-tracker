'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Battery, 
  Home, 
  BarChart3, 
  Settings, 
  LineChart, 
  AlertTriangle,
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
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
        active 
          ? "bg-primary/10 text-primary" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <span className="text-lg">{icon}</span>
      <span>{children}</span>
    </Link>
  )
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  
  return (
    <>
      {/* Overlay */}
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 w-60 bg-card/70 backdrop-blur-xl border-r border-border/30 p-4 transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Battery size={24} className="text-primary" />
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
              Coulomb.ai
            </span>
          </Link>
          
          <button 
            onClick={onClose}
            className="p-1 rounded-md hover:bg-muted md:hidden"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="space-y-1.5">
          <NavItem 
            href="/dashboard" 
            icon={<Home size={18} />} 
            active={pathname === '/dashboard'}
            onClick={onClose}
          >
            Dashboard
          </NavItem>
          
          <NavItem 
            href="/batteries" 
            icon={<Battery size={18} />} 
            active={pathname === '/batteries'}
            onClick={onClose}
          >
            Batteries
          </NavItem>
          
          <NavItem 
            href="/analytics" 
            icon={<BarChart3 size={18} />} 
            active={pathname === '/analytics'}
            onClick={onClose}
          >
            Analytics
          </NavItem>
          
          <NavItem 
            href="/reports" 
            icon={<LineChart size={18} />} 
            active={pathname === '/reports'}
            onClick={onClose}
          >
            Reports
          </NavItem>
          
          <NavItem 
            href="/alerts" 
            icon={<AlertTriangle size={18} />} 
            active={pathname === '/alerts'}
            onClick={onClose}
          >
            Alerts
          </NavItem>
        </nav>
        
        {/* Footer */}
        <div className="mt-auto">
          <NavItem 
            href="/settings" 
            icon={<Settings size={18} />} 
            active={pathname === '/settings'}
            onClick={onClose}
          >
            Settings
          </NavItem>
        </div>
      </div>
    </>
  );
}