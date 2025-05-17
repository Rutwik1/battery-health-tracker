"use client"

import * as React from "react"
import Link from "next/link"
import { Search, Bell, User, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Sidebar } from "./sidebar"

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <Sidebar isMobile />
          </SheetContent>
        </Sheet>
      </div>
      
      <div className="flex w-full items-center gap-2 md:gap-4">
        <form className="flex-1 md:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[240px] lg:w-[340px]"
            />
          </div>
        </form>
        
        <div className="flex flex-1 items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-primary" />
            <span className="sr-only">Notifications</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label="User profile"
          >
            <User className="h-5 w-5" />
            <span className="sr-only">User profile</span>
          </Button>
        </div>
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
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
        variant === "default" && "bg-primary text-primary-foreground hover:bg-primary/90",
        variant === "ghost" && "hover:bg-accent hover:text-accent-foreground",
        variant === "outline" && "border border-input hover:bg-accent hover:text-accent-foreground",
        size === "default" && "h-10 py-2 px-4",
        size === "sm" && "h-9 px-3",
        size === "lg" && "h-11 px-8",
        size === "icon" && "h-10 w-10",
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
        "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm",
        "ring-offset-background placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}