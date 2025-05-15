import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./sidebar";

export default function Topbar() {
  const [search, setSearch] = useState("");

  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-gradient-dark border-b border-border/50 backdrop-blur-sm">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="md:hidden px-4 text-primary">
            <i className="ri-menu-line text-2xl"></i>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 bg-gradient-dark border-r border-border/50">
          <Sidebar />
        </SheetContent>
      </Sheet>

      <div className="flex-1 px-6 flex justify-between">
        <div className="flex-1 flex">
          <div className="w-full max-w-md flex md:ml-0 mt-3 md:mt-0">
            <div className="relative w-full text-muted-foreground">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
          
          <div className="h-8 w-px mx-2 bg-border/50"></div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-2 rounded-lg bg-muted/50 border-border/50 text-foreground hover:bg-muted hover:text-primary"
          >
            <i className="ri-add-line mr-1"></i>
            Add Battery
          </Button>
        </div>
      </div>
    </div>
  );
}
