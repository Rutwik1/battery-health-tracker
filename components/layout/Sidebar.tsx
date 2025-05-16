'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Battery, 
  History, 
  Settings, 
  Bell, 
  ChevronRight,
  LogOut
} from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()
  
  const isActive = (path: string) => {
    if (path === '/' || path === '/dashboard') {
      return pathname === '/' || pathname === '/dashboard' || pathname.startsWith('/dashboard')
    }
    return pathname.startsWith(path)
  }

  const menuItems = [
    { 
      icon: <LayoutDashboard size={20} />, 
      label: 'Dashboard', 
      path: '/dashboard',
      active: isActive('/dashboard')
    },
    { 
      icon: <Battery size={20} />, 
      label: 'Batteries', 
      path: '/batteries',
      active: isActive('/batteries')
    },
    { 
      icon: <History size={20} />, 
      label: 'History', 
      path: '/history',
      active: isActive('/history')
    },
    { 
      icon: <Bell size={20} />, 
      label: 'Notifications', 
      path: '/notifications',
      active: isActive('/notifications')
    },
    { 
      icon: <Settings size={20} />, 
      label: 'Settings', 
      path: '/settings',
      active: isActive('/settings')
    }
  ]

  return (
    <div className="hidden md:flex h-screen w-64 flex-col bg-card/50 backdrop-blur-md border-r border-border/20">
      {/* Logo */}
      <div className="p-4 border-b border-border/20">
        <div className="flex items-center">
          <div className="h-8 w-8 mr-3 rounded-md bg-primary/10 flex items-center justify-center">
            <Battery className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-xl font-bold">
            Coulomb<span className="text-primary">.ai</span>
          </h1>
        </div>
      </div>
      
      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-6 px-3">
        <ul className="space-y-1">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link 
                href={item.path}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${item.active ? 'bg-primary/10 text-primary hover:bg-primary/15' : 'hover:bg-muted/50 text-foreground/80 hover:text-foreground'}`}
              >
                <div className="flex items-center">
                  <span className={`mr-3 ${item.active ? 'text-primary' : 'text-muted-foreground'}`}>
                    {item.icon}
                  </span>
                  {item.label}
                </div>
                {item.active && <ChevronRight size={16} className="text-primary" />}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* User Menu */}
      <div className="border-t border-border/20 p-4">
        <button className="flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:bg-muted/50 hover:text-foreground transition-colors">
          <LogOut size={18} className="mr-3 text-muted-foreground" />
          Logout
        </button>
      </div>
    </div>
  )
}