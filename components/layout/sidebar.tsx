'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Battery, BarChart2, Home, PieChart, Settings, Info, HelpCircle } from 'lucide-react';

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
      className={`flex items-center rounded-lg p-3 text-sm font-medium transition-colors 
      ${active 
        ? 'bg-primary/10 text-primary' 
        : 'hover:bg-muted/30 text-muted-foreground hover:text-foreground'}`}
      onClick={onClick}
    >
      <div className="mr-3 h-5 w-5">{icon}</div>
      <span>{children}</span>
    </Link>
  );
};

export default function Sidebar({ isMobile, onNavItemClick }: { isMobile?: boolean; onNavItemClick?: () => void }) {
  const pathname = usePathname();
  
  return (
    <div className={`${isMobile ? 'w-full min-h-screen' : 'hidden md:flex w-64 flex-col fixed inset-y-0'}`}>
      <div className="flex flex-col min-h-0 flex-1 bg-gradient-dark border-r border-border/50">
        <div className="flex items-center h-16 px-6 border-b border-border/50">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mr-3">
              <Battery className="h-4 w-4 text-white" />
            </div>
            <div className="font-bold text-lg text-gradient">Coulomb.ai</div>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="mt-5 flex-1 px-4 space-y-1">
            <NavItem 
              href="/" 
              icon={<Home className="h-5 w-5" />} 
              active={pathname === '/'} 
              onClick={onNavItemClick}
            >
              Dashboard
            </NavItem>
            
            <NavItem 
              href="/batteries" 
              icon={<Battery className="h-5 w-5" />} 
              active={pathname === '/batteries'} 
              onClick={onNavItemClick}
            >
              Batteries
            </NavItem>
            
            <NavItem 
              href="/analytics" 
              icon={<BarChart2 className="h-5 w-5" />} 
              active={pathname === '/analytics'} 
              onClick={onNavItemClick}
            >
              Analytics
            </NavItem>
            
            <NavItem 
              href="/reports" 
              icon={<PieChart className="h-5 w-5" />} 
              active={pathname === '/reports'} 
              onClick={onNavItemClick}
            >
              Reports
            </NavItem>
            
            <div className="pt-5 mt-6 border-t border-border/30">
              <h3 className="px-3 mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Support
              </h3>
              
              <NavItem 
                href="/help" 
                icon={<HelpCircle className="h-5 w-5" />} 
                active={pathname === '/help'} 
                onClick={onNavItemClick}
              >
                Help Center
              </NavItem>
              
              <NavItem 
                href="/about" 
                icon={<Info className="h-5 w-5" />} 
                active={pathname === '/about'} 
                onClick={onNavItemClick}
              >
                About
              </NavItem>
              
              <NavItem 
                href="/settings" 
                icon={<Settings className="h-5 w-5" />} 
                active={pathname === '/settings'} 
                onClick={onNavItemClick}
              >
                Settings
              </NavItem>
            </div>
          </nav>
        </div>
        
        <div className="flex-shrink-0 flex p-4 border-t border-border/50">
          <div className="flex items-center w-full">
            <div className="flex-shrink-0">
              <div className="h-9 w-9 rounded-full bg-muted/30 flex items-center justify-center">
                <span className="text-sm font-medium">JD</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}