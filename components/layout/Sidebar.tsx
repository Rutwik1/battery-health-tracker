'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Battery,
  LayoutDashboard,
  Settings,
  Bell,
  Users,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Lightning,
  BarChart3
} from 'lucide-react'
import Image from 'next/image'

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  
  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true
    if (path !== '/' && pathname.startsWith(path)) return true
    return false
  }
  
  return (
    <div
      className={`${
        collapsed ? 'w-16' : 'w-64'
      } bg-muted/50 border-r border-border transition-all duration-300 ease-in-out flex flex-col h-screen relative group`}
    >
      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 bg-background border border-border rounded-full p-1 shadow-sm z-10 text-muted-foreground hover:text-foreground transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>
      
      {/* Logo */}
      <div className={`p-4 flex items-center ${collapsed ? 'justify-center' : 'justify-start'}`}>
        <div className="relative h-8 w-8 mr-2 rounded-full overflow-hidden">
          <Image 
            src="/battery-icon.png" 
            alt="Coulomb.ai logo" 
            width={32} 
            height={32}
            priority
          />
        </div>
        <div className={`${collapsed ? 'hidden' : 'block'} transition-all duration-300`}>
          <h1 className="text-lg font-bold">Coulomb.ai</h1>
          <p className="text-xs text-muted-foreground -mt-1">Battery Analytics</p>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="mt-6 px-2 flex-1">
        <div className="space-y-1">
          <Link 
            href="/"
            className={`
              flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
              ${isActive('/') 
                ? 'bg-primary/10 text-primary' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'}
            `}
          >
            <LayoutDashboard className={`h-5 w-5 ${collapsed ? 'mx-auto' : 'mr-3'}`} />
            <span className={collapsed ? 'hidden' : 'block'}>Dashboard</span>
          </Link>
          
          <div className={`px-3 py-2 text-xs font-semibold text-muted-foreground ${collapsed ? 'hidden' : 'block'}`}>
            Monitoring
          </div>
          
          <Link 
            href="/batteries"
            className={`
              flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
              ${isActive('/batteries') 
                ? 'bg-primary/10 text-primary' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'}
            `}
          >
            <Battery className={`h-5 w-5 ${collapsed ? 'mx-auto' : 'mr-3'}`} />
            <span className={collapsed ? 'hidden' : 'block'}>Batteries</span>
          </Link>
          
          <Link 
            href="/analytics"
            className={`
              flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
              ${isActive('/analytics') 
                ? 'bg-primary/10 text-primary' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'}
            `}
          >
            <BarChart3 className={`h-5 w-5 ${collapsed ? 'mx-auto' : 'mr-3'}`} />
            <span className={collapsed ? 'hidden' : 'block'}>Analytics</span>
          </Link>
          
          <Link 
            href="/forecasts"
            className={`
              flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
              ${isActive('/forecasts') 
                ? 'bg-primary/10 text-primary' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'}
            `}
          >
            <Lightning className={`h-5 w-5 ${collapsed ? 'mx-auto' : 'mr-3'}`} />
            <span className={collapsed ? 'hidden' : 'block'}>Forecasts</span>
          </Link>
          
          <div className={`px-3 py-2 text-xs font-semibold text-muted-foreground ${collapsed ? 'hidden' : 'block'}`}>
            System
          </div>
          
          <Link 
            href="/notifications"
            className={`
              flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
              ${isActive('/notifications') 
                ? 'bg-primary/10 text-primary' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'}
            `}
          >
            <Bell className={`h-5 w-5 ${collapsed ? 'mx-auto' : 'mr-3'}`} />
            <span className={collapsed ? 'hidden' : 'block'}>Notifications</span>
          </Link>
          
          <Link 
            href="/users"
            className={`
              flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
              ${isActive('/users') 
                ? 'bg-primary/10 text-primary' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'}
            `}
          >
            <Users className={`h-5 w-5 ${collapsed ? 'mx-auto' : 'mr-3'}`} />
            <span className={collapsed ? 'hidden' : 'block'}>Users</span>
          </Link>
          
          <Link 
            href="/settings"
            className={`
              flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
              ${isActive('/settings') 
                ? 'bg-primary/10 text-primary' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'}
            `}
          >
            <Settings className={`h-5 w-5 ${collapsed ? 'mx-auto' : 'mr-3'}`} />
            <span className={collapsed ? 'hidden' : 'block'}>Settings</span>
          </Link>
        </div>
      </nav>
      
      {/* Footer */}
      <div className={`p-4 border-t border-border ${collapsed ? 'hidden' : 'block'}`}>
        <Link 
          href="/help"
          className="flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <HelpCircle className="h-4 w-4 mr-2" />
          <span>Help & Documentation</span>
        </Link>
        <div className="mt-3 text-xs text-muted-foreground">
          <span>Version 2.0.4</span>
        </div>
      </div>
    </div>
  )
}