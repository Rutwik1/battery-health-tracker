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
import { Battery } from "@shared/schema";
import { format } from "date-fns";
import { Link } from "wouter";
import { Filter, RefreshCcw, Eye, AlertTriangle } from "lucide-react";
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
    <div>
      <div className="px-6 py-5 flex items-center justify-between">
        <h2 className="text-lg font-heading font-semibold flex items-center">
          <Eye className="h-5 w-5 mr-2 text-primary" />
          Battery Health Details
        </h2>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm"
            className="bg-muted/50 border-border/50 text-foreground rounded-lg hover:bg-muted hover:text-primary"
          >
            <Filter className="h-4 w-4 mr-1" />
            Filter
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="bg-muted/50 border-border/50 text-foreground rounded-lg hover:bg-muted hover:text-primary"
          >
            <RefreshCcw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>
      
      <div className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-b border-border/50">
                <TableHead className="text-xs font-medium text-muted-foreground uppercase">
                  Battery
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase">
                  Status
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase">
                  Capacity
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase">
                  Cycles
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase">
                  Initial Date
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border/30">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <TableRow key={i} className="border-0">
                    <TableCell colSpan={6}>
                      <div className="h-16 bg-muted/20 animate-pulse rounded-lg"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : displayedBatteries.map((battery) => {
                const statusColor = getBatteryStatusColor(battery.status);
                
                // Convert color classes to CSS variables for gradients
                const gradientColor = statusColor === 'text-success' ? 'from-success to-success/70' :
                                    statusColor === 'text-warning' ? 'from-warning to-warning/70' :
                                    statusColor === 'text-danger' ? 'from-danger to-danger/70' :
                                    'from-primary to-primary/70';
                
                return (
                  <TableRow key={battery.id} className="border-0 hover:bg-muted/20">
                    <TableCell>
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/10">
                          <i className="ri-battery-2-line text-lg text-primary"></i>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium">{battery.name}</div>
                          <div className="text-xs text-muted-foreground">{battery.serialNumber}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2.5 py-1 text-xs font-medium ${statusColor} ${statusColor.replace('text-', 'bg-')}/10 rounded-full`}>
                        {battery.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{battery.healthPercentage}%</div>
                      <div className="text-xs text-muted-foreground">{battery.currentCapacity} mAh</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{battery.cycleCount}</div>
                      <div className="text-xs text-muted-foreground">of {battery.expectedCycles}</div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(battery.initialDate), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <Link href={`/battery/${battery.id}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground bg-primary/10 rounded-lg hover:text-primary hover:bg-primary/20"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground bg-warning/10 rounded-lg hover:text-warning hover:bg-warning/20"
                        >
                          <AlertTriangle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        <div className="bg-muted/30 px-6 py-4 flex items-center justify-between border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
            <span className="font-medium text-foreground">
              {Math.min(currentPage * itemsPerPage, batteries.length)}
            </span>{" "}
            of <span className="font-medium text-foreground">{batteries.length}</span> batteries
          </p>
          
          <div>
            <div className="flex rounded-lg overflow-hidden border border-border/50 divide-x divide-border/50">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-none text-foreground bg-muted/50 hover:bg-muted hover:text-primary"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <i className="ri-arrow-left-s-line text-lg"></i>
              </Button>
              <div className="h-8 px-3 flex items-center justify-center bg-muted/70 text-sm font-medium">
                {currentPage}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-none text-foreground bg-muted/50 hover:bg-muted hover:text-primary"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <i className="ri-arrow-right-s-line text-lg"></i>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
