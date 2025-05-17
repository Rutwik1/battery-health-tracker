"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { 
  Home, 
  Battery, 
  BarChart2, 
  BellRing, 
  Settings, 
  HelpCircle, 
  LogOut,
  FileText,
  Zap
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
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
        active
          ? "bg-primary/20 text-primary"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
      onClick={onClick}
    >
      {icon}
      <span>{children}</span>
    </Link>
  )
}

export function Sidebar({ isMobile, onNavItemClick }: { isMobile?: boolean; onNavItemClick?: () => void }) {
  return (
    <div className="flex h-full w-60 flex-col border-r border-border bg-background">
      <div className="flex h-14 items-center border-b border-border px-4">
        <Link className="flex items-center gap-2 font-semibold" href="/">
          <Zap className="h-5 w-5 text-primary" />
          <span className="gradient-text text-lg font-bold">Coulomb.ai</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start gap-1 px-2">
          <NavItem 
            href="/" 
            icon={<Home className="h-4 w-4" />}
            active
            onClick={onNavItemClick}
          >
            Dashboard
          </NavItem>
          <NavItem 
            href="/batteries" 
            icon={<Battery className="h-4 w-4" />}
            onClick={onNavItemClick}
          >
            Batteries
          </NavItem>
          <NavItem 
            href="/analytics" 
            icon={<BarChart2 className="h-4 w-4" />}
            onClick={onNavItemClick}
          >
            Analytics
          </NavItem>
          <NavItem 
            href="/alerts" 
            icon={<BellRing className="h-4 w-4" />}
            onClick={onNavItemClick}
          >
            Alerts
          </NavItem>
          <NavItem 
            href="/reports" 
            icon={<FileText className="h-4 w-4" />}
            onClick={onNavItemClick}
          >
            Reports
          </NavItem>
        </nav>
      </div>
      <div className="sticky inset-x-0 bottom-0 mt-auto border-t border-border bg-background p-2">
        <nav className="grid items-start gap-1 px-2 py-2">
          <NavItem 
            href="/settings" 
            icon={<Settings className="h-4 w-4" />}
            onClick={onNavItemClick}
          >
            Settings
          </NavItem>
          <NavItem 
            href="/support" 
            icon={<HelpCircle className="h-4 w-4" />}
            onClick={onNavItemClick}
          >
            Support
          </NavItem>
          <NavItem 
            href="/logout" 
            icon={<LogOut className="h-4 w-4" />}
            onClick={onNavItemClick}
          >
            Logout
          </NavItem>
        </nav>
      </div>
    </div>
  )
}