"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Battery, 
  History, 
  Settings, 
  Bell 
} from "lucide-react"

interface NavItemProps {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
}

const NavItem = ({ href, icon, children, active, onClick }: NavItemProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
        active ? "bg-secondary text-primary" : "text-muted-foreground"
      )}
      onClick={onClick}
    >
      <div className="flex h-6 w-6 items-center justify-center">
        {icon}
      </div>
      <span>{children}</span>
    </Link>
  )
}

export function Sidebar({ isMobile, onNavItemClick }: { isMobile?: boolean; onNavItemClick?: () => void }) {
  const pathname = usePathname()
  
  return (
    <div className="flex h-full w-full flex-col border-r border-border bg-background/50 backdrop-blur-sm">
      <div className="flex h-14 items-center border-b border-border px-4">
        <Link 
          href="/" 
          className="flex items-center gap-2 font-semibold text-xl text-primary"
          onClick={onNavItemClick}
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
            <span className="text-primary-foreground font-bold text-sm">C</span>
          </div>
          <span>Coulomb</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          <NavItem 
            href="/" 
            icon={<LayoutDashboard className="h-5 w-5" />} 
            active={pathname === "/"}
            onClick={onNavItemClick}
          >
            Dashboard
          </NavItem>
          <NavItem 
            href="/batteries" 
            icon={<Battery className="h-5 w-5" />} 
            active={pathname === "/batteries"}
            onClick={onNavItemClick}
          >
            Batteries
          </NavItem>
          <NavItem 
            href="/history" 
            icon={<History className="h-5 w-5" />}
            active={pathname === "/history"}
            onClick={onNavItemClick}
          >
            History
          </NavItem>
          <NavItem 
            href="/settings" 
            icon={<Settings className="h-5 w-5" />}
            active={pathname === "/settings"}
            onClick={onNavItemClick}
          >
            Settings
          </NavItem>
          <NavItem 
            href="/notifications" 
            icon={<Bell className="h-5 w-5" />}
            active={pathname === "/notifications"}
            onClick={onNavItemClick}
          >
            Notifications
          </NavItem>
        </nav>
      </div>
      <div className="mt-auto border-t border-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <span className="text-sm font-medium">JS</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">John Smith</span>
            <span className="text-xs text-muted-foreground">Administrator</span>
          </div>
        </div>
      </div>
    </div>
  )
}