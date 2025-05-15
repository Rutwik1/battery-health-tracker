import { useLocation, Link } from "wouter";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  icon: string;
  children: React.ReactNode;
  active?: boolean;
}

const NavItem = ({ href, icon, children, active }: NavItemProps) => {
  return (
    <Link href={href}>
      <a
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
    </Link>
  );
};

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow overflow-y-auto bg-gradient-dark border-r border-border/50">
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
              active={location === "/"}>
              Dashboard
            </NavItem>
            <NavItem 
              href="/batteries" 
              icon="ri-battery-line" 
              active={location === "/batteries"}>
              Batteries
            </NavItem>
            <NavItem 
              href="/history" 
              icon="ri-history-line" 
              active={location === "/history"}>
              History
            </NavItem>
            <NavItem 
              href="/settings" 
              icon="ri-settings-3-line" 
              active={location === "/settings"}>
              Settings
            </NavItem>
            <NavItem 
              href="/notifications" 
              icon="ri-notification-line" 
              active={location === "/notifications"}>
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
    </div>
  );
}
