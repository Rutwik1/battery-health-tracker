"use client"

import * as React from "react"
import { BarChart3, Battery, Maximize, Settings, LucideIcon, LayoutDashboard, Gauge, Zap, History } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItemProps {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
}

const NavItem = ({ href, icon, children, active, onClick }: NavItemProps) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-x-2 text-sm font-medium transition-all hover:text-primary",
        active ? "text-primary" : "text-muted-foreground",
        "group flex h-10 w-full cursor-pointer items-center rounded-md px-3 py-2 hover:bg-accent/50"
      )}
    >
      <div className="flex h-5 w-5 items-center justify-center">
        {icon}
      </div>
      <div>{children}</div>
    </a>
  )
}

export function Sidebar({ isMobile, onNavItemClick }: { isMobile?: boolean; onNavItemClick?: () => void }) {
  return (
    <div className={cn(
      "flex h-screen w-[240px] flex-col border-r px-3 py-4", 
      isMobile && "w-full border-none"
    )}>
      <div className="flex items-center gap-2 px-4 py-2">
        <Battery className="h-6 w-6 text-primary" />
        <div className="flex flex-col">
          <span className="text-xl font-bold gradient-text">Coulomb.ai</span>
          <span className="text-xs text-muted-foreground">Battery Intelligence</span>
        </div>
      </div>
      
      <div className="mt-8 space-y-1">
        <p className="px-4 text-xs font-semibold text-muted-foreground">OVERVIEW</p>
      
        <NavItem 
          href="/" 
          icon={<LayoutDashboard className="h-4 w-4" />}
          active={true}
          onClick={onNavItemClick}
        >
          Dashboard
        </NavItem>
        
        <NavItem 
          href="/analytics" 
          icon={<BarChart3 className="h-4 w-4" />}
          onClick={onNavItemClick}
        >
          Analytics
        </NavItem>
        
        <NavItem 
          href="/predictions" 
          icon={<Gauge className="h-4 w-4" />}
          onClick={onNavItemClick}
        >
          Predictions
        </NavItem>
      </div>
      
      <div className="mt-8 space-y-1">
        <p className="px-4 text-xs font-semibold text-muted-foreground">BATTERY MANAGEMENT</p>
      
        <NavItem 
          href="/inventory" 
          icon={<Battery className="h-4 w-4" />}
          onClick={onNavItemClick}
        >
          Inventory
        </NavItem>
        
        <NavItem 
          href="/history" 
          icon={<History className="h-4 w-4" />}
          onClick={onNavItemClick}
        >
          History
        </NavItem>
        
        <NavItem 
          href="/health" 
          icon={<Zap className="h-4 w-4" />}
          onClick={onNavItemClick}
        >
          Health Tracking
        </NavItem>
      </div>
      
      <div className="mt-auto">
        <NavItem 
          href="/settings" 
          icon={<Settings className="h-4 w-4" />}
          onClick={onNavItemClick}
        >
          Settings
        </NavItem>
      </div>
    </div>
  )
}