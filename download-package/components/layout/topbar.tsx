'use client';

import { useState } from 'react';
import { Bell, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Sidebar from './sidebar';
import { useSession } from 'next-auth/react';

export default function Topbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  
  return (
    <>
      <header className="border-b border-border bg-card/30 backdrop-blur-md sticky top-0 z-10">
        <div className="flex h-16 items-center px-4 sm:px-6">
          <Button
            variant="ghost"
            size="sm"
            className="mr-2 md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="relative"
            >
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary"></span>
            </Button>
            
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full overflow-hidden bg-primary">
                {session?.user?.image ? (
                  <img 
                    src={session.user.image} 
                    alt={session.user.name || 'User avatar'} 
                    className="h-full w-full object-cover" 
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-primary text-primary-foreground font-medium">
                    {session?.user?.name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{session?.user?.name || 'Demo User'}</p>
                <p className="text-xs text-muted-foreground">{session?.user?.email || 'demo@coulomb.ai'}</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background md:hidden">
          <div className="absolute right-4 top-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          
          <Sidebar 
            isMobile 
            onNavItemClick={() => setIsMobileMenuOpen(false)} 
          />
        </div>
      )}
    </>
  );
}