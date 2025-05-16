'use client';

import { Button } from '@/components/ui/button';
import { Bell, Menu, Search, Settings, SunMoon } from 'lucide-react';
import { useState } from 'react';

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-950 sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="lg:hidden"
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </Button>
      
      {/* Search bar */}
      <div className="hidden md:flex-1 md:flex md:gap-4 lg:gap-8">
        <form className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <input
            type="search"
            placeholder="Search batteries, alerts, analytics..."
            className="h-9 w-full rounded-md border border-gray-200 bg-white pl-8 pr-4 text-sm text-gray-700 outline-none transition-colors focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300 dark:focus:border-indigo-500"
          />
        </form>
      </div>
      
      {/* Right side icons */}
      <div className="flex flex-1 items-center justify-end gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="relative hidden md:flex"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
            3
          </span>
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          aria-label="Toggle theme"
        >
          <SunMoon className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex"
          aria-label="Settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
        
        <div className="relative flex h-9 w-9 shrink-0 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
          <img
            src="https://ui-avatars.com/api/?name=Admin+User&background=6366F1&color=fff"
            alt="Admin User"
            className="rounded-full"
          />
        </div>
      </div>
    </header>
  );
}