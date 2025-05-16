'use client';

import Link from 'next/link';
import { Menu, Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/30 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Mobile menu button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden" 
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>
      
      {/* Logo for mobile (centered) */}
      <div className="md:hidden flex-1 flex justify-center">
        <Link href="/dashboard" className="flex items-center">
          <span className="font-bold text-lg bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
            Coulomb.ai
          </span>
        </Link>
      </div>
      
      {/* Search bar (hidden on mobile) */}
      <div className="hidden md:flex flex-1 items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input 
          type="search" 
          placeholder="Search batteries, alerts, reports..." 
          className="flex-1 h-9 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      
      {/* Right actions */}
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
        >
          <Bell className="h-5 w-5" />
          {/* Notification indicator */}
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
          <span className="sr-only">Notifications</span>
        </Button>
        
        {/* User avatar */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full overflow-hidden bg-muted"
        >
          <span className="sr-only">User menu</span>
          <div className="h-full w-full flex items-center justify-center text-xs font-medium">
            AR
          </div>
        </Button>
      </div>
    </header>
  );
}