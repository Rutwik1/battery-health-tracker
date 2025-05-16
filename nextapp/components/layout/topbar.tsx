'use client';

import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 border-b border-border/40 bg-gradient-to-r from-slate-950 to-slate-900">
      {/* Mobile menu button */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onMenuClick}
        className="lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </Button>
      
      {/* Left section - Title on desktop */}
      <div className="hidden lg:block">
        <h1 className="text-lg font-medium">Battery Health Monitoring</h1>
      </div>
      
      {/* Right section */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          className="rounded-full bg-primary/10"
        >
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}