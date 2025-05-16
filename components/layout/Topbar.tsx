'use client'

import React from 'react'
import { Search, Bell, Menu } from 'lucide-react'
import { useState } from 'react'

export default function Topbar() {
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  
  return (
    <div className="bg-background/60 backdrop-blur-md border-b border-border/20 py-3 px-4 md:py-4 md:px-6 flex items-center justify-between">
      {/* Mobile Menu Button */}
      <button className="md:hidden p-2 rounded-lg hover:bg-muted/50">
        <Menu size={22} />
      </button>
      
      {/* Search */}
      <div className={`relative hidden md:flex items-center rounded-lg bg-muted/30 border ${isSearchFocused ? 'border-primary/50 ring-1 ring-primary/20' : 'border-border/50'} w-80 transition-all`}>
        <Search className="h-4 w-4 absolute left-3 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Search batteries, devices..." 
          className="bg-transparent border-none focus:outline-none py-2 pl-10 pr-4 w-full text-sm"
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
        />
      </div>
      
      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-muted/50">
          <Bell size={20} className="text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
        </button>
        
        {/* User Profile */}
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary/10 mr-2 flex items-center justify-center text-primary font-medium">
            AK
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-medium">Admin</div>
            <div className="text-xs text-muted-foreground">admin@coulomb.ai</div>
          </div>
        </div>
      </div>
    </div>
  )
}