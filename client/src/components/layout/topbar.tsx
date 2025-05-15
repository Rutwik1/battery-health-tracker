import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./sidebar";

export default function Topbar() {
  const [search, setSearch] = useState("");

  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow-sm">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="md:hidden px-4 text-primary">
            <i className="ri-menu-line text-2xl"></i>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      <div className="flex-1 px-4 flex justify-between">
        <div className="flex-1 flex">
          <div className="w-full flex md:ml-0 mt-3 md:mt-0">
            <div className="relative w-full text-neutral-lighter">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="ri-search-line text-xl"></i>
              </div>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md leading-5 bg-gray-50 placeholder-neutral-lighter focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Search..."
              />
            </div>
          </div>
        </div>
        <div className="ml-4 flex items-center md:ml-6">
          <Button variant="ghost" size="icon" className="text-neutral-light hover:text-primary">
            <i className="ri-notification-3-line text-xl"></i>
          </Button>
          <Button variant="ghost" size="icon" className="text-neutral-light hover:text-primary">
            <i className="ri-question-line text-xl"></i>
          </Button>
          <Button variant="ghost" size="icon" className="text-neutral-light hover:text-primary">
            <i className="ri-settings-4-line text-xl"></i>
          </Button>
        </div>
      </div>
    </div>
  );
}
