"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  Battery, 
  BarChart3, 
  Settings, 
  Menu, 
  X 
} from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  
  // Handle sidebar toggle
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }
  
  // Close sidebar when clicking on a link (mobile only)
  const handleNavItemClick = () => {
    if (sidebarOpen) {
      setSidebarOpen(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-background grid-background flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 backdrop-blur-sm bg-background/80">
        <div className="container flex h-16 items-center">
          <div className="md:hidden mr-2">
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl gradient-text">Coulomb.ai</span>
          </div>
          <div className="flex-1"></div>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" size="sm">Help</Button>
            <Button variant="gradient" size="sm">
              <UserIcon className="h-4 w-4 mr-2" />
              Account
            </Button>
          </nav>
        </div>
      </header>
      
      <div className="flex-1 flex">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed top-16 bottom-0 z-50 w-64 border-r border-border/40 bg-background transition-transform md:translate-x-0 md:static md:z-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex flex-col h-full overflow-y-auto">
            <div className="flex items-center justify-between p-4 md:hidden">
              <span className="font-bold gradient-text">Menu</span>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5" />
                <span className="sr-only">Close Menu</span>
              </Button>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              <NavItem 
                href="/dashboard" 
                icon={<LayoutDashboard className="h-5 w-5" />} 
                active={pathname === "/dashboard"}
                onClick={handleNavItemClick}
              >
                Dashboard
              </NavItem>
              <NavItem 
                href="/dashboard/batteries" 
                icon={<Battery className="h-5 w-5" />}
                active={pathname.startsWith("/dashboard/batteries")}
                onClick={handleNavItemClick}
              >
                Batteries
              </NavItem>
              <NavItem 
                href="/dashboard/analytics" 
                icon={<BarChart3 className="h-5 w-5" />}
                active={pathname.startsWith("/dashboard/analytics")}
                onClick={handleNavItemClick}
              >
                Analytics
              </NavItem>
              <NavItem 
                href="/dashboard/settings" 
                icon={<Settings className="h-5 w-5" />}
                active={pathname.startsWith("/dashboard/settings")}
                onClick={handleNavItemClick}
              >
                Settings
              </NavItem>
            </nav>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
}

function NavItem({ href, icon, children, active, onClick }: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {icon}
      <span>{children}</span>
    </Link>
  )
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  )
}