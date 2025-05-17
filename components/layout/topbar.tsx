"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Bell, HelpCircle, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Sidebar } from "./sidebar"

export function Topbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu)
  }
  
  return (
    <>
      <div className="flex h-14 items-center border-b border-border px-4 lg:px-6">
        <button
          className="mr-2 rounded-md p-2 text-muted-foreground hover:bg-secondary md:hidden"
          onClick={toggleMobileMenu}
        >
          {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          <span className="sr-only">Toggle menu</span>
        </button>
        <div className="relative md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search batteries..."
            className="w-full rounded-md border border-input bg-background py-2 pl-8 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            className="rounded-full p-2 text-muted-foreground hover:bg-secondary"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>
          <button
            className="rounded-full p-2 text-muted-foreground hover:bg-secondary"
            aria-label="Help"
          >
            <HelpCircle className="h-5 w-5" />
          </button>
          <Link
            href="/batteries/add"
            className="ml-2 inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <span className="mr-1">+</span> Add Battery
          </Link>
        </div>
      </div>
      
      {/* Mobile sidebar */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={toggleMobileMenu} />
          <div className="fixed left-0 top-0 h-full w-72 border-r border-border bg-background p-0">
            <Sidebar isMobile={true} onNavItemClick={toggleMobileMenu} />
          </div>
        </div>
      )}
    </>
  )
}