import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Menu } from "lucide-react";
import Sidebar from "./sidebar";

export default function Topbar() {
  const [search, setSearch] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative z-20 flex-shrink-0 flex h-16 bg-gradient-dark border-b border-border/50 backdrop-blur-md">
      {/* Mobile Menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="md:hidden px-4 text-primary">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 bg-gradient-dark border-r border-border/50 w-[280px]">
          <Sidebar className="h-full" />
        </SheetContent>
      </Sheet>

      {/* Desktop Logo - Hidden on Mobile */}
      <div className="hidden md:flex items-center pl-6">
        <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <i className="ri-battery-2-charge-line text-lg text-background"></i>
        </div>
      </div>

      <div className="flex-1 px-4 md:px-6 flex justify-between">
        <div className="flex-1 flex">
          {/* Search Box */}
          <div className="w-full max-w-md flex mt-3 md:mt-0 md:ml-4">
            <div className="relative w-full text-muted-foreground">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="ri-search-line text-xl"></i>
              </div>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 rounded-lg leading-5 backdrop-blur-sm bg-muted/20 border-border/50 placeholder-muted-foreground focus:outline-none focus:ring-primary/50 focus:border-primary/50"
                placeholder="Search batteries..."
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1">
          <TooltipProvider>
            {/* Notification Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-lg text-muted-foreground hover:text-primary hover:bg-muted/50"
                >
                  <div className="relative">
                    <i className="ri-notification-3-line text-xl"></i>
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full"></span>
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
            
            {/* Help Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-lg text-muted-foreground hover:text-primary hover:bg-muted/50"
                >
                  <i className="ri-question-line text-xl"></i>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Help</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="h-8 w-px mx-2 bg-border/50 hidden sm:block"></div>
          
          {/* Add Battery Button - Hidden on smallest screens */}
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden sm:flex ml-2 rounded-lg bg-muted/30 backdrop-blur-sm border-border/50 text-foreground hover:bg-muted/50 hover:text-primary"
          >
            <i className="ri-add-line mr-1"></i>
            Add Battery
          </Button>
          
          {/* Mobile Add Button - Visible only on smallest screens */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="sm:hidden rounded-lg text-muted-foreground hover:text-primary hover:bg-muted/50"
          >
            <i className="ri-add-line text-xl"></i>
          </Button>
        </div>
      </div>
    </div>
  );
}
