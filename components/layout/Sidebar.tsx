'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Battery, 
  Settings, 
  Bell, 
  Users, 
  Zap,
  ChevronsLeft, 
  ChevronsRight,
  Gauge,
  BarChart3,
  FileText
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Batteries', href: '/batteries', icon: Battery },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Alerts', href: '/alerts', icon: Bell },
  ]
  
  const secondaryNavigation = [
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Team', href: '/team', icon: Users },
  ]
  
  return (
    <div 
      className={cn(
        "h-full bg-card border-r flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo Section */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex-shrink-0 relative w-8 h-8">
            <Battery className="h-8 w-8 text-primary absolute" />
            <Zap className="h-4 w-4 text-primary-foreground absolute left-2 top-2 z-10" />
          </div>
          
          {!collapsed && (
            <div>
              <h1 className="font-bold text-lg tracking-tight">Coulomb.ai</h1>
              <p className="text-xs text-muted-foreground -mt-1">Battery Health</p>
            </div>
          )}
        </div>
        
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-muted/50 text-muted-foreground"
        >
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
        </button>
      </div>
      
      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>
        
        <div className="mt-8 pt-4 border-t">
          <h3 className={cn(
            "px-3 mb-2 text-xs font-semibold text-muted-foreground",
            collapsed && "text-center"
          )}>
            {!collapsed ? "System" : "···"}
          </h3>
          
          <nav className="space-y-1">
            {secondaryNavigation.map((item) => {
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                    isActive 
                      ? "bg-muted text-foreground font-medium" 
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
      
      {/* User Profile */}
      <div className={cn(
        "border-t p-4",
        collapsed ? "flex justify-center" : "flex items-center gap-3"
      )}>
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Users className="h-4 w-4" />
        </div>
        
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium">Admin User</div>
            <div className="text-xs text-muted-foreground truncate">admin@coulomb.ai</div>
          </div>
        )}
      </div>
    </div>
  )
}