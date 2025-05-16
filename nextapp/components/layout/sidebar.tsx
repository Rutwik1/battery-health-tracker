'use client';

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Battery, 
  BarChart3, 
  Home, 
  Settings, 
  HelpCircle, 
  X,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";

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
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
        active ? "bg-muted/50 font-medium text-primary" : "text-muted-foreground"
      )}
      onClick={onClick}
    >
      {React.cloneElement(icon as React.ReactElement, {
        className: "h-5 w-5",
        strokeWidth: active ? 2.5 : 2
      })}
      <span>{children}</span>
    </Link>
  );
};

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  
  // Close sidebar on small screens when clicking a nav item
  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop overlay */}
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 border-r bg-gradient-to-b from-background/95 to-background/80 backdrop-blur-sm transition-transform duration-300 ease-in-out md:translate-x-0 md:z-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pl-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg">
                <Battery className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                Coulomb.ai
              </h1>
            </Link>
            
            <button 
              className="p-1 rounded-md hover:bg-muted md:hidden" 
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Navigation */}
          <div className="space-y-1 py-2">
            <NavItem 
              href="/dashboard" 
              icon={<Home />} 
              active={pathname === '/dashboard'}
              onClick={handleNavClick}
            >
              Dashboard
            </NavItem>
            <NavItem 
              href="/batteries" 
              icon={<Battery />} 
              active={pathname === '/batteries' || pathname.startsWith('/batteries/')}
              onClick={handleNavClick}
            >
              Batteries
            </NavItem>
            <NavItem 
              href="/analytics" 
              icon={<BarChart3 />} 
              active={pathname === '/analytics'}
              onClick={handleNavClick}
            >
              Analytics
            </NavItem>
            <NavItem 
              href="/alerts" 
              icon={<AlertTriangle />} 
              active={pathname === '/alerts'}
              onClick={handleNavClick}
            >
              Alerts
            </NavItem>
          </div>
          
          <div className="mt-auto space-y-1 py-2">
            <NavItem 
              href="/settings" 
              icon={<Settings />} 
              active={pathname === '/settings'}
              onClick={handleNavClick}
            >
              Settings
            </NavItem>
            <NavItem 
              href="/help" 
              icon={<HelpCircle />} 
              active={pathname === '/help'}
              onClick={handleNavClick}
            >
              Help & Support
            </NavItem>
          </div>
          
          {/* Footer */}
          <div className="pt-4 text-xs text-muted-foreground">
            <p>© 2025 Coulomb.ai</p>
            <p>Battery Monitoring System</p>
          </div>
        </div>
      </div>
    </>
  );
}