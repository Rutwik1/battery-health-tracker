'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Search,
  Bell,
  HelpCircle,
  User,
  Menu,
  ChevronDown,
  LogOut,
  Settings,
  UserCircle
} from 'lucide-react'

export default function Topbar() {
  const pathname = usePathname()
  
  return (
    <header className="h-16 border-b border-border bg-muted/20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile menu button & breadcrumbs */}
      <div className="flex items-center">
        <button className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 md:hidden">
          <Menu className="h-5 w-5" />
        </button>
        
        <div className="ml-4 md:ml-0">
          <div className="text-sm breadcrumbs hidden md:flex items-center text-muted-foreground">
            <ul className="flex items-center space-x-1">
              <li>
                <Link href="/" className="hover:text-foreground">
                  Home
                </Link>
              </li>
              
              {pathname.split('/').filter(Boolean).map((segment, index, segments) => {
                const href = `/${segments.slice(0, index + 1).join('/')}`
                const isLast = index === segments.length - 1
                const name = segment.charAt(0).toUpperCase() + segment.slice(1)
                
                return (
                  <React.Fragment key={segment}>
                    <li className="text-muted-foreground">/</li>
                    <li>
                      {isLast ? (
                        <span className="font-medium text-foreground">{name}</span>
                      ) : (
                        <Link href={href} className="hover:text-foreground">
                          {name}
                        </Link>
                      )}
                    </li>
                  </React.Fragment>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Right: Search, notifications, help, profile */}
      <div className="flex items-center space-x-3">
        {/* Search */}
        <div className="hidden md:block relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="search"
            placeholder="Search..."
            className="block w-60 rounded-md border border-input pl-10 pr-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        
        {/* Notifications */}
        <button className="relative p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
        </button>
        
        {/* Help */}
        <button className="p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50">
          <HelpCircle className="h-5 w-5" />
        </button>
        
        {/* Profile Dropdown */}
        <div className="relative">
          <button className="flex items-center space-x-1 p-1 rounded-md hover:bg-muted/50 text-sm">
            <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-primary border border-border">
              <UserCircle className="h-6 w-6" />
            </div>
            <span className="hidden sm:inline-block font-medium">Admin User</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
          
          {/* Hidden dropdown menu (for illustration) */}
          <div className="hidden absolute right-0 mt-1 w-48 py-1 bg-background rounded-md shadow-lg border border-border z-10">
            <Link href="/profile" className="flex items-center px-4 py-2 text-sm hover:bg-muted/50">
              <User className="mr-2 h-4 w-4" />
              Your Profile
            </Link>
            <Link href="/settings" className="flex items-center px-4 py-2 text-sm hover:bg-muted/50">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
            <div className="border-t border-border my-1"></div>
            <button className="flex w-full items-center px-4 py-2 text-sm text-danger hover:bg-muted/50">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}