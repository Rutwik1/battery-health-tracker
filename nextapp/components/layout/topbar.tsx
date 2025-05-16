import React, { useState } from 'react';
import { Menu, Bell, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const [showSearch, setShowSearch] = useState(false);
  
  return (
    <div className="flex h-16 items-center px-4 border-b border-border/40 bg-gradient-dark">
      {/* Menu button (mobile only) */}
      <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
      </Button>
      
      {/* Page title/breadcrumb (hidden when search is active on mobile) */}
      {!(showSearch && window.innerWidth < 768) && (
        <div className="flex items-center">
          <h2 className="text-lg font-medium">Dashboard</h2>
        </div>
      )}
      
      {/* Search bar */}
      <div className={cn(
        "ml-auto flex items-center gap-4",
        showSearch ? "flex-1 md:flex-none md:ml-auto" : ""
      )}>
        {showSearch ? (
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search batteries..."
              className="w-full bg-background/50 border border-border/50 rounded-md py-2 pl-9 pr-4 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1.5 h-6 w-6"
              onClick={() => setShowSearch(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSearch(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
        )}
        
        {/* Notifications */}
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        
        {/* User profile button */}
        <Button variant="ghost" size="icon" className="rounded-full bg-primary/10">
          <span className="font-medium text-sm">JD</span>
        </Button>
      </div>
    </div>
  );
}