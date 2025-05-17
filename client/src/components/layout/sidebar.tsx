import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface NavItemProps {
  href: string;
  icon: string;
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

const NavItem = ({ href, icon, children, active, onClick }: NavItemProps) => {
  return (
    <a 
      href={href} 
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200",
        active
          ? "bg-gradient-to-r from-primary/20 to-accent/10 text-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      )}
    >
      <i
        className={cn(
          `${icon} mr-3 text-xl`,
          active ? "text-primary" : "text-muted-foreground group-hover:text-primary"
        )}
      ></i>
      {children}
    </a>
  );
};

export default function Sidebar({ isMobile, onNavItemClick }: { isMobile?: boolean; onNavItemClick?: () => void }) {
  const [location] = useLocation();
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  const sidebarContent = (
    <div className={`flex flex-col flex-grow overflow-y-auto bg-gradient-dark border-r border-border/50 ${isMobile ? "h-full" : ""}`}>
      <div className="px-5 py-6 border-b border-border/50">
        <h1 className="text-xl font-heading font-bold flex items-center">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center mr-3 shadow-lg shadow-primary/20">
            <i className="ri-battery-2-charge-line text-lg text-background"></i>
          </div>
          <span className="text-gradient">Coulomb</span>
        </h1>
      </div>
      <div className="flex-grow flex flex-col mt-8">
        <nav className="flex-1 px-3 space-y-2">
          <NavItem 
            href="/" 
            icon="ri-dashboard-line" 
            active={isClient && location === "/"}
            onClick={onNavItemClick}
          >
            Dashboard
          </NavItem>
          <NavItem 
            href="/batteries" 
            icon="ri-battery-line" 
            active={isClient && location === "/batteries"}
            onClick={onNavItemClick}
          >
            Batteries
          </NavItem>
          <NavItem 
            href="/history" 
            icon="ri-history-line" 
            active={isClient && location === "/history"}
            onClick={onNavItemClick}
          >
            History
          </NavItem>
          <NavItem 
            href="/settings" 
            icon="ri-settings-3-line" 
            active={isClient && location === "/settings"}
            onClick={onNavItemClick}
          >
            Settings
          </NavItem>
          <NavItem 
            href="/notifications" 
            icon="ri-notification-line" 
            active={isClient && location === "/notifications"}
            onClick={onNavItemClick}
          >
            Notifications
          </NavItem>
        </nav>
      </div>
      <div className="p-4 m-3 border-t border-border/50 rounded-lg bg-muted/50 mt-auto">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center text-background shadow-md">
              <span className="text-sm font-semibold">JS</span>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-foreground">John Smith</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );

  // For desktop view
  if (!isMobile) {
    return (
      <div className="hidden md:flex md:w-64 md:flex-col">
        {sidebarContent}
      </div>
    );
  }

  // For mobile view (passed to SheetContent)
  return sidebarContent;
}
