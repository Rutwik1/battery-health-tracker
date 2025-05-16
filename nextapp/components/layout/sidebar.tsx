import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Battery, 
  Gauge, 
  Home,
  Settings,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
        active 
          ? "bg-primary/10 text-primary glow-text-primary" 
          : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
      )}
      onClick={onClick}
    >
      <div className="text-lg">{icon}</div>
      <div>{children}</div>
    </Link>
  );
};

export default function Sidebar({ 
  isMobile, 
  onNavItemClick 
}: { 
  isMobile?: boolean; 
  onNavItemClick?: () => void 
}) {
  const pathname = usePathname();

  return (
    <div className={cn(
      "flex flex-col gap-4 h-full bg-gradient-dark",
      isMobile ? "p-4" : "py-6 px-4"
    )}>
      {/* Logo/Brand */}
      <div className="px-3 py-2 mb-6 flex items-center">
        <div className="relative w-10 h-10 mr-3">
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" />
          <div className="absolute inset-0.5 rounded-full bg-primary/30" />
          <div className="absolute inset-1 rounded-full bg-gradient-primary flex items-center justify-center">
            <Battery className="w-5 h-5 text-white" />
          </div>
        </div>
        {!isMobile && (
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight bg-gradient-primary bg-clip-text text-transparent">
              Coulomb.ai
            </span>
            <span className="text-xs text-muted-foreground">
              Battery Analytics
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 px-2 flex-1">
        <NavItem 
          href="/" 
          icon={<Home />} 
          active={pathname === '/'} 
          onClick={onNavItemClick}
        >
          Dashboard
        </NavItem>
        <NavItem 
          href="/batteries" 
          icon={<Battery />} 
          active={pathname === '/batteries' || pathname.startsWith('/batteries/')} 
          onClick={onNavItemClick}
        >
          Batteries
        </NavItem>
        <NavItem 
          href="/analytics" 
          icon={<BarChart3 />} 
          active={pathname === '/analytics'} 
          onClick={onNavItemClick}
        >
          Analytics
        </NavItem>
        <NavItem 
          href="/performance" 
          icon={<Gauge />} 
          active={pathname === '/performance'} 
          onClick={onNavItemClick}
        >
          Performance
        </NavItem>
      </nav>

      {/* Bottom links */}
      <div className="mt-auto border-t border-border/40 pt-4 px-2">
        <NavItem 
          href="/settings" 
          icon={<Settings />} 
          active={pathname === '/settings'} 
          onClick={onNavItemClick}
        >
          Settings
        </NavItem>
        <NavItem 
          href="/help" 
          icon={<HelpCircle />} 
          active={pathname === '/help'} 
          onClick={onNavItemClick}
        >
          Help
        </NavItem>
      </div>
    </div>
  );
}