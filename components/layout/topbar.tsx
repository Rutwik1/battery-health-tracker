"use client"

import * as React from 'react'
import { useEffect, useState } from 'react'
import { Menu, Search, Bell } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { Sidebar } from './sidebar'
import { Button } from '@/components/ui/button'

export function Topbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const mobileMenu = document.querySelector('#mobile-menu')
      if (isOpen && mobileMenu && !mobileMenu.contains(event.target as Element)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isOpen])

  return (
    <header className={cn(
      "sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur transition-all",
      isScrolled ? "border-border shadow-sm" : "border-transparent"
    )}>
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <Sidebar isMobile onNavItemClick={() => {}} />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex-1">
        <form className="hidden md:block">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search batteries, alerts..."
              className="w-full max-w-sm rounded-md border border-input bg-background pl-8 shadow-sm focus-visible:ring-1"
            />
          </div>
        </form>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <Button variant="gradient" size="sm" className="hidden md:flex">
          Add Battery
        </Button>
      </div>
    </header>
  )
}

function Button({
  variant = "default",
  size = "default",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost" | "gradient"
  size?: "default" | "sm" | "lg" | "icon"
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        {
          "bg-primary text-primary-foreground hover:bg-primary/90": variant === "default",
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground": variant === "outline",
          "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
          "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90": variant === "gradient",
          "h-10 px-4 py-2": size === "default",
          "h-9 rounded-md px-3": size === "sm",
          "h-11 rounded-md px-8": size === "lg",
          "h-10 w-10 p-0": size === "icon",
        },
        className
      )}
      {...props}
    />
  )
}

function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
        "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}