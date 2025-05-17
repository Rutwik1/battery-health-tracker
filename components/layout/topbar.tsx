'use client';

import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '../../components/ui/sheet';
import { Bell, Menu, Search, User, Moon, Sun } from 'lucide-react';
import { AddBatteryDialog } from '../../components/dashboard/add-battery-dialog';
import Sidebar from './sidebar';
import { useTheme } from 'next-themes';

export default function Topbar() {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <a href="/" className="mr-6 flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M14 6h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2" />
              <path d="M6 6h6v10H6z" />
              <line x1="6" y1="10" x2="12" y2="10" />
            </svg>
            <span className="font-bold">Coulomb.ai</span>
          </a>
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="mr-2 md:hidden">
              <Menu className="h-4 w-4" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0 sm:max-w-xs">
            <Sidebar isMobile={true} onNavItemClick={() => {}} />
          </SheetContent>
        </Sheet>
        
        {/* Search */}
        <div className={`flex items-center ${isSearchExpanded ? 'w-full' : 'w-auto'} md:w-auto`}>
          <div className={`relative ${isSearchExpanded ? 'w-full' : 'w-auto'} md:w-auto`}>
            {isSearchExpanded ? (
              <Input
                placeholder="Search batteries, reports, users..."
                className="h-9 md:w-[300px] lg:w-[400px]"
                autoFocus
                onBlur={() => setIsSearchExpanded(false)}
              />
            ) : (
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setIsSearchExpanded(true)}
                className="h-9 w-9 md:hidden"
              >
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            )}
            <div className="hidden md:flex items-center relative">
              <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search batteries, reports, users..."
                className="w-[300px] pl-8"
              />
            </div>
          </div>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
          <AddBatteryDialog />
          
          <Button
            variant="outline"
            size="icon"
            className="ml-auto hidden h-9 md:flex"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          <Button variant="outline" size="icon" className="h-9 w-9 relative">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-xs leading-4 text-destructive-foreground flex items-center justify-center">2</span>
          </Button>
          
          <Button variant="outline" size="icon" className="h-9 w-9">
            <User className="h-4 w-4" />
            <span className="sr-only">User account</span>
          </Button>
        </div>
      </div>
    </header>
  );
}