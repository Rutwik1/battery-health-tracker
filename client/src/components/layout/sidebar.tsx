import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { supabase, signOut } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

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
  const [location, setLocation] = useLocation();
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);

    // Get the current user data
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUserData();
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
            href="/"
            icon="ri-battery-line"
            active={isClient && location === "/batteries"}
            onClick={() => {
              if (onNavItemClick) onNavItemClick();
              setLocation("/");
            }}
          >
            Batteries
          </NavItem>
          <NavItem
            href="/"
            icon="ri-history-line"
            active={isClient && location === "/history"}
            onClick={() => {
              if (onNavItemClick) onNavItemClick();
              setLocation("/");
            }}
          >
            History
          </NavItem>
          <NavItem
            href="/"
            icon="ri-settings-3-line"
            active={isClient && location === "/settings"}
            onClick={() => {
              if (onNavItemClick) onNavItemClick();
              setLocation("/");
            }}
          >
            Settings
          </NavItem>
          <NavItem
            href="/"
            icon="ri-notification-line"
            active={isClient && location === "/notifications"}
            onClick={() => {
              if (onNavItemClick) onNavItemClick();
              setLocation("/");
            }}
          >
            Notifications
          </NavItem>
        </nav>
      </div>
      <div className="p-4 m-3 border-t border-border/50 rounded-lg bg-muted/50 mt-auto">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center text-background shadow-md">
                <span className="text-sm font-semibold">
                  {user ? (user.user_metadata?.username?.[0] || user.email?.[0] || '?').toUpperCase() : '?'}
                </span>
              </div>
            </div>
            <div className="ml-3 flex-grow">
              <p className="text-sm font-medium text-foreground">
                {user ? (user.user_metadata?.username || user.email?.split('@')[0] || 'User') : 'Loading...'}
              </p>
              <p className="text-xs text-muted-foreground">
                {user?.email || ''}
              </p>
            </div>
          </div>
          <button
            onClick={async () => {
              try {
                setLoading(true);
                await signOut();
                toast({
                  title: "Success",
                  description: "You have been logged out.",
                  variant: "default",
                });
                setLocation("/login");
              } catch (error: any) {
                toast({
                  title: "Error",
                  description: error.message || "Failed to log out. Please try again.",
                  variant: "destructive",
                });
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
            className="w-full px-3 py-2 text-sm font-medium rounded-md bg-white/5 hover:bg-white/10 text-foreground transition-colors flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span className="animate-spin h-4 w-4 border-2 border-foreground/30 border-t-foreground rounded-full mr-2"></span>
            ) : (
              <i className="ri-logout-box-line mr-2"></i>
            )}
            <span>{loading ? "Logging out..." : "Logout"}</span>
          </button>
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
