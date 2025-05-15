import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Battery } from "@shared/schema";
import { format } from "date-fns";
import { Link } from "wouter";
import { Filter, RefreshCcw } from "lucide-react";
import { getBatteryStatusColor } from "@/lib/utils/battery";

interface BatteryHealthTableProps {
  batteries: Battery[];
  isLoading: boolean;
}

export default function BatteryHealthTable({ batteries, isLoading }: BatteryHealthTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  
  const totalPages = Math.ceil(batteries.length / itemsPerPage);
  const displayedBatteries = batteries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  return (
    <Card>
      <CardHeader className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-heading font-semibold text-neutral">
            Battery Health Details
          </CardTitle>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCcw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="text-xs font-medium text-neutral-lighter uppercase">
                  Battery
                </TableHead>
                <TableHead className="text-xs font-medium text-neutral-lighter uppercase">
                  Status
                </TableHead>
                <TableHead className="text-xs font-medium text-neutral-lighter uppercase">
                  Capacity
                </TableHead>
                <TableHead className="text-xs font-medium text-neutral-lighter uppercase">
                  Cycles
                </TableHead>
                <TableHead className="text-xs font-medium text-neutral-lighter uppercase">
                  Initial Date
                </TableHead>
                <TableHead className="text-xs font-medium text-neutral-lighter uppercase">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-200">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={6}>
                      <div className="h-16 bg-gray-100 animate-pulse rounded-md"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : displayedBatteries.map((battery) => {
                const statusColor = getBatteryStatusColor(battery.status);
                const statusBgColor = `${statusColor.replace('text-', 'bg-')} bg-opacity-10`;
                
                return (
                  <TableRow key={battery.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-md bg-blue-50 text-primary">
                          <i className="ri-battery-2-line text-xl"></i>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-neutral">{battery.name}</div>
                          <div className="text-sm text-neutral-lighter">ID: {battery.serialNumber}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2.5 py-0.5 text-xs font-medium ${statusBgColor} ${statusColor} rounded-full`}>
                        {battery.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-neutral">{battery.healthPercentage}%</div>
                      <div className="text-xs text-neutral-lighter">{battery.currentCapacity} mAh</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-neutral">{battery.cycleCount}</div>
                      <div className="text-xs text-neutral-lighter">of {battery.expectedCycles} expected</div>
                    </TableCell>
                    <TableCell className="text-sm text-neutral-light">
                      {format(new Date(battery.initialDate), 'yyyy-MM-dd')}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      <Link href={`/battery/${battery.id}`}>
                        <a className="text-primary hover:text-blue-700 mr-3">View</a>
                      </Link>
                      <button className="text-neutral-light hover:text-neutral">Report</button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-neutral-light">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, batteries.length)}
                </span>{" "}
                of <span className="font-medium">{batteries.length}</span> batteries
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-l-md border border-gray-300"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <span className="sr-only">Previous</span>
                  <i className="ri-arrow-left-s-line text-xl"></i>
                </Button>
                <Button
                  variant="secondary"
                  className="border border-gray-300"
                >
                  {currentPage}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-r-md border border-gray-300"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  <span className="sr-only">Next</span>
                  <i className="ri-arrow-right-s-line text-xl"></i>
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
