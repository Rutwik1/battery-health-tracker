'use client';

import * as React from "react";
import Link from "next/link";
import { Menu, Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm sm:px-6">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>
      
      {/* Search bar */}
      <div className="relative flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search batteries, alerts..."
            className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>
      
      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Notification button */}
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
            3
          </span>
        </Button>
        
        {/* User menu */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full border"
          aria-label="User menu"
        >
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}