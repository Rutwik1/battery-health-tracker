"use client"

import * as React from 'react'
import Link from 'next/link'
import { cn } from '../../lib/utils'
import { 
  Battery, 
  BarChart3, 
  Cpu, 
  Home, 
  History, 
  Settings, 
  Bell, 
  FileText,
  Zap
} from 'lucide-react'

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
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-indigo-900/20",
        active ? "bg-indigo-900/30 text-white" : "text-gray-400 hover:text-white"
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
  return (
    <div className={cn(
      "flex h-screen flex-col border-r border-indigo-900/40 bg-gradient-to-b from-gray-950 to-indigo-950/70 text-white",
      isMobile ? "w-full" : "w-64"
    )}>
      <div className="flex h-14 items-center border-b border-indigo-900/40 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Zap className="h-6 w-6 text-indigo-400" />
          <span className="text-xl font-bold text-gradient">Coulomb.ai</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 py-2 space-y-1">
          <NavItem href="/" icon={<Home className="h-4 w-4" />} active onClick={onNavItemClick}>
            Dashboard
          </NavItem>
          <NavItem href="/batteries" icon={<Battery className="h-4 w-4" />} onClick={onNavItemClick}>
            Batteries
          </NavItem>
          <NavItem href="/analytics" icon={<BarChart3 className="h-4 w-4" />} onClick={onNavItemClick}>
            Analytics
          </NavItem>
          <NavItem href="/history" icon={<History className="h-4 w-4" />} onClick={onNavItemClick}>
            History
          </NavItem>
          <NavItem href="/recommendations" icon={<FileText className="h-4 w-4" />} onClick={onNavItemClick}>
            Recommendations
          </NavItem>
          <NavItem href="/alerts" icon={<Bell className="h-4 w-4" />} onClick={onNavItemClick}>
            Alerts
          </NavItem>
          <NavItem href="/systems" icon={<Cpu className="h-4 w-4" />} onClick={onNavItemClick}>
            Systems
          </NavItem>
        </nav>
      </div>
      <div className="mt-auto border-t border-indigo-900/40 p-4">
        <NavItem href="/settings" icon={<Settings className="h-4 w-4" />} onClick={onNavItemClick}>
          Settings
        </NavItem>
      </div>
    </div>
  )
}