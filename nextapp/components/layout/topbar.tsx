'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, Menu, Moon, Search, Sun, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Initialize theme from local storage on component mount
  useEffect(() => {
    // Check for saved theme preference or respect OS preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);
  
  // Toggle between light and dark mode
  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark');
    }
  };
  
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      {/* Mobile menu button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden ml-2" 
        onClick={onMenuClick}
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </Button>
      
      {/* Search bar */}
      <div className="flex w-full max-w-md items-center gap-2 ml-4">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <input
            type="search"
            placeholder="Search batteries, users, settings..."
            className="h-10 w-full rounded-md border border-gray-200 bg-transparent pl-9 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-gray-800 dark:text-gray-50"
          />
        </div>
      </div>
      
      {/* Right side actions */}
      <div className="ml-auto flex items-center gap-4 px-4">
        {/* Theme toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme}
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50"
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
        
        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="icon"
          aria-label="View notifications"
          className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50"
        >
          <Bell className="h-5 w-5" />
        </Button>
        
        {/* User menu */}
        <Link href="/profile">
          <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 to-purple-600">
            <User className="h-5 w-5 text-white" />
          </div>
        </Link>
      </div>
    </header>
  );
}