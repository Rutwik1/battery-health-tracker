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
          "group flex items-center px-2 py-3 text-sm font-medium rounded-md",
          active
            ? "text-primary bg-blue-50"
            : "text-neutral-light hover:text-primary hover:bg-blue-50"
        )}
      >
        <i
          className={cn(
            `${icon} mr-3 text-xl`,
            active ? "text-primary" : "text-neutral-lighter"
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
      <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r">
        <div className="px-4 pb-4 border-b">
          <h1 className="text-xl font-heading font-bold text-primary flex items-center">
            <i className="ri-battery-2-charge-line mr-2 text-2xl"></i>
            BatteryViz
          </h1>
        </div>
        <div className="flex-grow flex flex-col mt-5">
          <nav className="flex-1 px-2 space-y-1">
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
        <div className="p-4 border-t">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
                <span className="text-sm font-semibold">JS</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">John Smith</p>
              <p className="text-xs text-neutral-lighter">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
