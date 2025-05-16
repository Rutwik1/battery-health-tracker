'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Battery,
  Settings,
  Activity,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

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
        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all",
        active ? "bg-primary/10 text-primary" : "hover:bg-accent/10 hover:text-accent"
      )}
      onClick={onClick}
    >
      <span className={cn("h-5 w-5", active ? "text-primary" : "")}>{icon}</span>
      <span>{children}</span>
    </Link>
  );
};

export default function Sidebar({ 
  isMobile = false, 
  onNavItemClick 
}: { 
  isMobile?: boolean; 
  onNavItemClick?: () => void;
}) {
  const pathname = usePathname();
  
  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    await signOut({ callbackUrl: '/login' });
  };
  
  return (
    <div className={cn(
      "flex flex-col border-r border-border bg-card/30 backdrop-blur-md",
      isMobile ? "w-full h-full p-6" : "w-64 py-8 px-4"
    )}>
      <div className="flex items-center gap-2 px-2 mb-8">
        <Battery className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold gradient-text">Coulomb.ai</h1>
      </div>
      
      <div className="space-y-1">
        <NavItem 
          href="/dashboard" 
          icon={<LayoutDashboard />} 
          active={pathname === '/dashboard'}
          onClick={onNavItemClick}
        >
          Dashboard
        </NavItem>
        <NavItem 
          href="/batteries" 
          icon={<Battery />} 
          active={pathname.startsWith('/batteries')}
          onClick={onNavItemClick}
        >
          Batteries
        </NavItem>
        <NavItem 
          href="/analytics" 
          icon={<Activity />} 
          active={pathname.startsWith('/analytics')}
          onClick={onNavItemClick}
        >
          Analytics
        </NavItem>
        <NavItem 
          href="/settings" 
          icon={<Settings />} 
          active={pathname.startsWith('/settings')}
          onClick={onNavItemClick}
        >
          Settings
        </NavItem>
      </div>
      
      <div className="mt-auto pt-4">
        <Button 
          variant="outline"
          className="w-full justify-start"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}