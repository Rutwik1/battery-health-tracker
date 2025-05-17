import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import Sidebar from "./sidebar";
import { AddBatteryDialog } from "@/components/dashboard/add-battery-dialog";

export default function Topbar() {
  const [search, setSearch] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavItemClick = () => {
    // Close the mobile menu when a nav item is clicked
    setIsMenuOpen(false);
  };

  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-gradient-dark border-b border-border/50 backdrop-blur-sm">
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            className="md:hidden flex items-center justify-center my-auto px-5 py-2 text-primary" 
            style={{ position: 'relative', top: '1px' }}
          >
            <div className="flex flex-col justify-center items-center w-9 h-9">
              <span className="h-[3px] w-7 bg-primary rounded-full mb-[6px]"></span>
              <span className="h-[3px] w-7 bg-primary rounded-full mb-[6px]"></span>
              <span className="h-[3px] w-7 bg-primary rounded-full"></span>
            </div>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 bg-gradient-dark border-r border-border/50" onCloseAutoFocus={(e) => e.preventDefault()}>
          <Sidebar isMobile={true} onNavItemClick={handleNavItemClick} />
        </SheetContent>
      </Sheet>

      <div className="flex-1 px-4 md:px-6 flex justify-between">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md flex">
            <div className="relative w-full text-muted-foreground">
              <div className="absolute left-0 top-0 bottom-0 pl-3 flex items-center justify-center pointer-events-none">
                <i className="ri-search-line text-xl"></i>
              </div>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 rounded-lg leading-5 bg-muted/50 border-border/50 placeholder-muted-foreground focus:outline-none focus:ring-primary/50 focus:border-primary/50"
                placeholder="Search batteries..."
              />
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-lg text-muted-foreground hover:text-primary hover:bg-muted/50"
          >
            <i className="ri-notification-3-line text-xl"></i>
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-lg text-muted-foreground hover:text-primary hover:bg-muted/50"
          >
            <i className="ri-question-line text-xl"></i>
          </Button>
          
          <div className="h-8 w-px mx-2 bg-border/50 hidden sm:block"></div>
          
          <AddBatteryDialog />
        </div>
      </div>
    </div>
  );
}
