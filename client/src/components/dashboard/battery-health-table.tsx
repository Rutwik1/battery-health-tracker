// import { useState, useRef } from "react";
// import { useQueryClient } from "@tanstack/react-query";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Card,
//   CardContent,
// } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";
// import { Battery } from "@shared/schema";
// import { format } from "date-fns";
// import { Link } from "wouter";
// import { Filter, RefreshCcw, Eye, Trash2, X } from "lucide-react";
// import { getBatteryStatusColor } from "@/lib/utils/battery";
// import { useToast } from "@/hooks/use-toast";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle
// } from "@/components/ui/alert-dialog";

// interface BatteryHealthTableProps {
//   batteries: Battery[];
//   isLoading: boolean;
//   refetch?: () => Promise<any>;
// }

// export default function BatteryHealthTable({ batteries, isLoading, refetch }: BatteryHealthTableProps) {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [filterBattery, setFilterBattery] = useState<string | null>(null);
//   const [filterStatus, setFilterStatus] = useState<string | null>(null);
//   const [showHealthBelow, setShowHealthBelow] = useState(false);
//   const [healthThreshold, setHealthThreshold] = useState("80");
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [batteryToDelete, setBatteryToDelete] = useState<number | null>(null);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const { toast } = useToast();
//   const queryClient = useQueryClient();
//   const itemsPerPage = 4;

//   // Get unique battery names and statuses for filters
//   const batteryNames = Array.from(new Set(batteries.map(b => b.name)));
//   const statusTypes = Array.from(new Set(batteries.map(b => b.status)));

//   // Apply filters
//   const filteredBatteries = batteries.filter(battery => {
//     // Filter by battery name
//     if (filterBattery && battery.name !== filterBattery) {
//       return false;
//     }

//     // Filter by status
//     if (filterStatus && battery.status !== filterStatus) {
//       return false;
//     }

//     // Filter by health threshold
//     if (showHealthBelow && battery.healthPercentage > parseInt(healthThreshold)) {
//       return false;
//     }

//     return true;
//   });

//   // Reset to first page when filters change
//   const resetFilters = () => {
//     setFilterBattery(null);
//     setFilterStatus(null);
//     setShowHealthBelow(false);
//     setHealthThreshold("80");
//     setCurrentPage(1);
//   };

//   // Function to handle opening the delete confirmation dialog
//   const handleDeleteBattery = (batteryId: number) => {
//     setBatteryToDelete(batteryId);
//     setIsDeleteDialogOpen(true);
//   };

//   // Function to confirm and execute battery deletion
//   const confirmDeleteBattery = async () => {
//     if (!batteryToDelete) return;

//     setIsDeleting(true);

//     try {
//       // Directly remove from client cache first (optimistic update)
//       queryClient.setQueryData(['/api/batteries'], (oldData: Battery[] | undefined) => {
//         if (!oldData) return [];
//         return oldData.filter(battery => battery.id !== batteryToDelete);
//       });

//       // Then delete via API
//       console.log(`Deleting battery with ID: ${batteryToDelete}`);
//       const response = await fetch(`/api/batteries/${batteryToDelete}`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });

//       console.log('Delete response status:', response.status);

//       // Parse the response data
//       let responseData;
//       try {
//         responseData = await response.json();
//         console.log('Delete response data:', responseData);
//       } catch (e) {
//         console.log('No JSON in delete response');
//       }

//       if (response.ok || response.status === 200) {
//         toast({
//           title: "Battery deleted",
//           description: "Battery has been successfully removed from your inventory.",
//         });
//       } else {
//         // If deletion failed, refresh to restore data
//         if (refetch) {
//           await refetch();
//         }
//         throw new Error(responseData?.message || 'Failed to delete battery');
//       }
//     } catch (error) {
//       console.error('Error deleting battery:', error);
//       toast({
//         title: "Error",
//         description: "Failed to delete the battery. Please try again.",
//         variant: "destructive",
//       });

//       // Refresh data to ensure UI is in sync with server
//       if (refetch) {
//         await refetch();
//       }
//     } finally {
//       setIsDeleting(false);
//       setIsDeleteDialogOpen(false);
//       setBatteryToDelete(null);
//     }
//   };

//   const totalPages = Math.ceil(filteredBatteries.length / itemsPerPage);
//   const displayedBatteries = filteredBatteries.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   // Close popover when clicking outside
//   const handlePopoverOpenChange = (open: boolean) => {
//     setIsFilterOpen(open);
//   };

//   return (
//     <div>
//       <div className="px-6 py-5 flex items-center justify-between">
//         <h2 className="text-lg font-heading font-semibold flex items-center">
//           <Eye className="h-5 w-5 mr-2 text-primary" />
//           Battery Health Details
//         </h2>
//         <div className="flex items-center space-x-3">
//           <Popover open={isFilterOpen} onOpenChange={handlePopoverOpenChange}>
//             <PopoverTrigger asChild>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className={`bg-muted/50 border-border/50 rounded-lg hover:bg-muted hover:text-primary ${isFilterOpen || (filterBattery || filterStatus || showHealthBelow) ? 'bg-primary/20 text-primary border-primary/30' : 'text-foreground'}`}
//               >
//                 <Filter className="h-4 w-4 mr-1" />
//                 Filter
//                 {(filterBattery || filterStatus || showHealthBelow) && (
//                   <span className="ml-1 bg-primary text-background text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                     {(filterBattery ? 1 : 0) + (filterStatus ? 1 : 0) + (showHealthBelow ? 1 : 0)}
//                   </span>
//                 )}
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent
//               className="w-80 p-0 bg-gradient-dark border border-border/50 shadow-lg shadow-primary/10 backdrop-blur-md"
//               align="end"
//             >
//               <div className="p-4 border-b border-border/50 flex items-center justify-between">
//                 <div className="text-sm font-medium">Filter Batteries</div>
//                 {(filterBattery || filterStatus || showHealthBelow) && (
//                   <Button variant="ghost" size="sm" onClick={resetFilters} className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground">
//                     <X className="h-3 w-3 mr-1" />
//                     Clear All
//                   </Button>
//                 )}
//               </div>

//               <div className="p-4 space-y-4">
//                 {/* Battery filter */}
//                 <div className="space-y-2">
//                   <Label className="text-xs font-medium text-muted-foreground uppercase">Battery Model</Label>
//                   <Select value={filterBattery || "all"} onValueChange={value => setFilterBattery(value === "all" ? null : value)}>
//                     <SelectTrigger className="w-full bg-muted/30 border-border/50">
//                       <SelectValue placeholder="All batteries" />
//                     </SelectTrigger>
//                     <SelectContent className="bg-gradient-card border border-border/50 backdrop-blur-md">
//                       <SelectItem value="all">All batteries</SelectItem>
//                       {batteryNames.map(name => (
//                         <SelectItem key={name} value={name}>{name}</SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 {/* Status filter */}
//                 <div className="space-y-2">
//                   <Label className="text-xs font-medium text-muted-foreground uppercase">Status</Label>
//                   <Select value={filterStatus || "all"} onValueChange={value => setFilterStatus(value === "all" ? null : value)}>
//                     <SelectTrigger className="w-full bg-muted/30 border-border/50">
//                       <SelectValue placeholder="All statuses" />
//                     </SelectTrigger>
//                     <SelectContent className="bg-gradient-card border border-border/50 backdrop-blur-md">
//                       <SelectItem value="all">All statuses</SelectItem>
//                       {statusTypes.map(status => (
//                         <SelectItem key={status} value={status}>{status}</SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 {/* Health threshold */}
//                 <div className="space-y-2">
//                   <div className="flex items-center space-x-2">
//                     <Checkbox id="health-threshold"
//                       checked={showHealthBelow}
//                       onCheckedChange={checked => setShowHealthBelow(!!checked)}
//                       className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
//                     />
//                     <Label htmlFor="health-threshold" className="text-sm cursor-pointer">
//                       Show batteries with health below
//                     </Label>
//                   </div>

//                   <Select
//                     value={healthThreshold}
//                     onValueChange={setHealthThreshold}
//                     disabled={!showHealthBelow}
//                   >
//                     <SelectTrigger className="w-full bg-muted/30 border-border/50">
//                       <SelectValue placeholder="Select threshold" />
//                     </SelectTrigger>
//                     <SelectContent className="bg-gradient-card border border-border/50 backdrop-blur-md">
//                       <SelectItem value="90">90%</SelectItem>
//                       <SelectItem value="80">80%</SelectItem>
//                       <SelectItem value="70">70%</SelectItem>
//                       <SelectItem value="60">60%</SelectItem>
//                       <SelectItem value="50">50%</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 {/* Apply filters button */}
//                 <Button
//                   className="w-full mt-6 bg-gradient-primary hover:opacity-90 text-background"
//                   onClick={() => setIsFilterOpen(false)}
//                 >
//                   Apply Filters
//                 </Button>
//               </div>
//             </PopoverContent>
//           </Popover>

//           <Button
//             variant="outline"
//             size="sm"
//             className="bg-muted/50 border-border/50 text-foreground rounded-lg hover:bg-muted hover:text-primary relative overflow-hidden"
//             onClick={async () => {
//               // Add a visual spinning effect for refresh
//               const button = document.getElementById('refresh-button');
//               if (button) {
//                 button.classList.add('animate-spin');
//               }

//               try {
//                 // If refetch is available, call it to get fresh data
//                 if (refetch) {
//                   await refetch();
//                 }

//                 // Reset filters and page
//                 resetFilters();
//               } catch (error) {
//                 console.error("Error refreshing data:", error);
//               } finally {
//                 // Stop the spinning effect
//                 if (button) {
//                   setTimeout(() => {
//                     button.classList.remove('animate-spin');
//                   }, 1000);
//                 }
//               }
//             }}
//           >
//             <RefreshCcw id="refresh-button" className="h-4 w-4 mr-1 transition-all duration-500" />
//             Refresh
//           </Button>
//         </div>
//       </div>

//       <div className="p-0">
//         <div className="overflow-x-auto">
//           <Table>
//             <TableHeader className="bg-muted/30">
//               <TableRow className="border-b border-border/50">
//                 <TableHead className="text-xs font-medium text-muted-foreground uppercase">
//                   Battery
//                 </TableHead>
//                 <TableHead className="text-xs font-medium text-muted-foreground uppercase">
//                   Status
//                 </TableHead>
//                 <TableHead className="text-xs font-medium text-muted-foreground uppercase">
//                   Capacity
//                 </TableHead>
//                 <TableHead className="text-xs font-medium text-muted-foreground uppercase">
//                   Cycles
//                 </TableHead>
//                 <TableHead className="text-xs font-medium text-muted-foreground uppercase">
//                   Initial Date
//                 </TableHead>
//                 <TableHead className="text-xs font-medium text-muted-foreground uppercase">
//                   Actions
//                 </TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody className="divide-y divide-border/30">
//               {isLoading ? (
//                 [...Array(4)].map((_, i) => (
//                   <TableRow key={i} className="border-0">
//                     <TableCell colSpan={6}>
//                       <div className="h-16 bg-muted/20 animate-pulse rounded-lg"></div>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               ) : displayedBatteries.map((battery) => {
//                 const statusColor = getBatteryStatusColor(battery.status);

//                 // Convert color classes to CSS variables for gradients
//                 const gradientColor = statusColor === 'text-success' ? 'from-success to-success/70' :
//                   statusColor === 'text-warning' ? 'from-warning to-warning/70' :
//                     statusColor === 'text-danger' ? 'from-danger to-danger/70' :
//                       'from-primary to-primary/70';

//                 return (
//                   <TableRow key={battery.id} className="border-0 hover:bg-muted/20">
//                     <TableCell>
//                       <div className="flex items-center">
//                         <div className="flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/10">
//                           <i className="ri-battery-2-line text-lg text-primary"></i>
//                         </div>
//                         <div className="ml-3">
//                           <div className="text-sm font-medium">{battery.name}</div>
//                           <div className="text-xs text-muted-foreground">{battery.serialNumber}</div>
//                         </div>
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <span className={`px-2.5 py-1 text-xs font-medium ${statusColor} ${statusColor.replace('text-', 'bg-')}/10 rounded-full`}>
//                         {battery.status}
//                       </span>
//                     </TableCell>
//                     <TableCell>
//                       <div className="text-sm">{battery.healthPercentage}%</div>
//                       <div className="text-xs text-muted-foreground">{battery.currentCapacity} mAh</div>
//                     </TableCell>
//                     <TableCell>
//                       <div className="text-sm">{battery.cycleCount}</div>
//                       <div className="text-xs text-muted-foreground">of {battery.expectedCycles}</div>
//                     </TableCell>
//                     <TableCell className="text-sm text-muted-foreground">
//                       {format(new Date(battery.initialDate), 'MMM dd, yyyy')}
//                     </TableCell>
//                     <TableCell className="text-sm font-medium">
//                       <div className="flex items-center space-x-3">
//                         <Link href={`/battery/${battery.id}`}>
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             className="h-8 w-8 text-muted-foreground bg-primary/10 rounded-lg hover:text-primary hover:bg-primary/20"
//                           >
//                             <Eye className="h-4 w-4" />
//                           </Button>
//                         </Link>
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           className="h-8 w-8 text-muted-foreground bg-danger/10 rounded-lg hover:text-danger hover:bg-danger/20"
//                           onClick={() => handleDeleteBattery(battery.id)}
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 );
//               })}
//             </TableBody>
//           </Table>
//         </div>

//         <div className="bg-muted/30 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-border/50">
//           <div className="flex flex-col md:flex-row md:items-center gap-2">
//             <p className="text-sm text-muted-foreground">
//               Showing <span className="font-medium text-foreground">{filteredBatteries.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to{" "}
//               <span className="font-medium text-foreground">
//                 {Math.min(currentPage * itemsPerPage, filteredBatteries.length)}
//               </span>{" "}
//               of <span className="font-medium text-foreground">{filteredBatteries.length}</span> batteries
//             </p>

//             {/* Active filters indicators */}
//             {(filterBattery || filterStatus || showHealthBelow) && (
//               <div className="flex flex-wrap gap-2 mt-2 md:mt-0 md:ml-3">
//                 {filterBattery && (
//                   <div className="flex items-center text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
//                     <span>Battery: {filterBattery}</span>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="h-4 w-4 ml-1 hover:bg-transparent hover:text-primary/80"
//                       onClick={() => setFilterBattery(null)}
//                     >
//                       <X className="h-3 w-3" />
//                     </Button>
//                   </div>
//                 )}

//                 {filterStatus && (
//                   <div className="flex items-center text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
//                     <span>Status: {filterStatus}</span>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="h-4 w-4 ml-1 hover:bg-transparent hover:text-primary/80"
//                       onClick={() => setFilterStatus(null)}
//                     >
//                       <X className="h-3 w-3" />
//                     </Button>
//                   </div>
//                 )}

//                 {showHealthBelow && (
//                   <div className="flex items-center text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
//                     <span>Health below {healthThreshold}%</span>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="h-4 w-4 ml-1 hover:bg-transparent hover:text-primary/80"
//                       onClick={() => setShowHealthBelow(false)}
//                     >
//                       <X className="h-3 w-3" />
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           <div>
//             <div className="flex rounded-lg overflow-hidden border border-border/50 divide-x divide-border/50">
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="h-8 w-8 rounded-none text-foreground bg-muted/50 hover:bg-muted hover:text-primary"
//                 onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//                 disabled={currentPage === 1 || filteredBatteries.length === 0}
//               >
//                 <i className="ri-arrow-left-s-line text-lg"></i>
//               </Button>
//               <div className="h-8 px-3 flex items-center justify-center bg-muted/70 text-sm font-medium">
//                 {currentPage} / {totalPages || 1}
//               </div>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="h-8 w-8 rounded-none text-foreground bg-muted/50 hover:bg-muted hover:text-primary"
//                 onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
//                 disabled={currentPage === totalPages || totalPages === 0}
//               >
//                 <i className="ri-arrow-right-s-line text-lg"></i>
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Delete Confirmation Dialog */}
//       <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
//         <AlertDialogContent className="bg-gradient-dark border border-border/50 backdrop-blur-md shadow-xl shadow-primary/10">
//           <AlertDialogHeader>
//             <AlertDialogTitle>Confirm Battery Deletion</AlertDialogTitle>
//             <AlertDialogDescription>
//               Are you sure you want to delete this battery? This action cannot be undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel
//               className="bg-muted/50 border-border/50 hover:bg-muted"
//               disabled={isDeleting}
//             >
//               Cancel
//             </AlertDialogCancel>
//             <AlertDialogAction
//               className="bg-danger hover:bg-danger/90 text-white"
//               onClick={(e) => {
//                 e.preventDefault(); // Prevent dialog from closing automatically
//                 confirmDeleteBattery();
//               }}
//               disabled={isDeleting}
//             >
//               {isDeleting ? (
//                 <>
//                   <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
//                   Deleting...
//                 </>
//               ) : (
//                 "Delete Battery"
//               )}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// }



import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getApiUrl } from "@/lib/apiConfig";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Battery } from "@shared/schema";
import { format } from "date-fns";
import { Link } from "wouter";
import { Filter, RefreshCcw, Eye, Trash2, X } from "lucide-react";
import { getBatteryStatusColor } from "@/lib/utils/battery";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

interface BatteryHealthTableProps {
  batteries: Battery[];
  isLoading: boolean;
  refetch?: () => Promise<any>;
}

export default function BatteryHealthTable({ batteries, isLoading, refetch }: BatteryHealthTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterBattery, setFilterBattery] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [showHealthBelow, setShowHealthBelow] = useState(false);
  const [healthThreshold, setHealthThreshold] = useState("80");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [batteryToDelete, setBatteryToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const itemsPerPage = 4;

  // Get unique battery names and statuses for filters
  const batteryNames = Array.from(new Set(batteries.map(b => b.name)));
  const statusTypes = Array.from(new Set(batteries.map(b => b.status)));

  // Apply filters
  const filteredBatteries = batteries.filter(battery => {
    // Filter by battery name
    if (filterBattery && battery.name !== filterBattery) {
      return false;
    }

    // Filter by status
    if (filterStatus && battery.status !== filterStatus) {
      return false;
    }

    // Filter by health threshold
    if (showHealthBelow && battery.healthPercentage > parseInt(healthThreshold)) {
      return false;
    }

    return true;
  });

  // Reset to first page when filters change
  const resetFilters = () => {
    setFilterBattery(null);
    setFilterStatus(null);
    setShowHealthBelow(false);
    setHealthThreshold("80");
    setCurrentPage(1);
  };

  // Function to handle opening the delete confirmation dialog
  const handleDeleteBattery = (batteryId: number) => {
    setBatteryToDelete(batteryId);
    setIsDeleteDialogOpen(true);
  };

  // Function to confirm and execute battery deletion
  const confirmDeleteBattery = async () => {
    if (!batteryToDelete) return;

    setIsDeleting(true);

    try {
      // Directly remove from client cache first (optimistic update)
      queryClient.setQueryData(['/api/batteries'], (oldData: Battery[] | undefined) => {
        if (!oldData) return [];
        return oldData.filter(battery => battery.id !== batteryToDelete);
      });

      // Also invalidate battery history query to prevent 404 errors
      queryClient.removeQueries({
        queryKey: [`/api/batteries/${batteryToDelete}/history`]
      });

      // Then delete via API
      console.log(`Deleting battery with ID: ${batteryToDelete}`);

      // Use the centralized API URL configuration for consistent behavior
      const apiUrl = getApiUrl(`batteries/${batteryToDelete}`);

      console.log(`Using API URL for deletion: ${apiUrl}`);

      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Delete response status:', response.status);

      // Parse the response data
      let responseData;
      try {
        responseData = await response.json();
        console.log('Delete response data:', responseData);
      } catch (e) {
        console.log('No JSON in delete response');
      }

      if (response.ok || response.status === 200) {
        // Successfully deleted - update the UI
        toast({
          title: "Battery deleted",
          description: "Battery has been successfully removed from your inventory.",
        });

        // Force a refetch to update the battery list
        if (refetch) {
          await refetch();
        }
      } else {
        // If deletion failed, refresh to restore data
        if (refetch) {
          await refetch();
        }
        throw new Error(responseData?.message || 'Failed to delete battery');
      }
    } catch (error) {
      console.error('Error deleting battery:', error);
      toast({
        title: "Error",
        description: "Failed to delete the battery. Please try again.",
        variant: "destructive",
      });

      // Refresh data to ensure UI is in sync with server
      if (refetch) {
        await refetch();
      }
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setBatteryToDelete(null);
    }
  };

  const totalPages = Math.ceil(filteredBatteries.length / itemsPerPage);
  const displayedBatteries = filteredBatteries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Close popover when clicking outside
  const handlePopoverOpenChange = (open: boolean) => {
    setIsFilterOpen(open);
  };

  return (
    <div>
      <div className="px-6 py-5 flex items-center justify-between">
        <h2 className="text-lg font-heading font-semibold flex items-center">
          <Eye className="h-5 w-5 mr-2 text-primary" />
          Battery Health Details
        </h2>
        <div className="flex items-center space-x-3">
          <Popover open={isFilterOpen} onOpenChange={handlePopoverOpenChange}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`bg-muted/50 border-border/50 rounded-lg hover:bg-muted hover:text-primary ${isFilterOpen || (filterBattery || filterStatus || showHealthBelow) ? 'bg-primary/20 text-primary border-primary/30' : 'text-foreground'}`}
              >
                <Filter className="h-4 w-4 mr-1" />
                Filter
                {(filterBattery || filterStatus || showHealthBelow) && (
                  <span className="ml-1 bg-primary text-background text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {(filterBattery ? 1 : 0) + (filterStatus ? 1 : 0) + (showHealthBelow ? 1 : 0)}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 p-0 bg-gradient-dark border border-border/50 shadow-lg shadow-primary/10 backdrop-blur-md"
              align="end"
            >
              <div className="p-4 border-b border-border/50 flex items-center justify-between">
                <div className="text-sm font-medium">Filter Batteries</div>
                {(filterBattery || filterStatus || showHealthBelow) && (
                  <Button variant="ghost" size="sm" onClick={resetFilters} className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground">
                    <X className="h-3 w-3 mr-1" />
                    Clear All
                  </Button>
                )}
              </div>

              <div className="p-4 space-y-4">
                {/* Battery filter */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground uppercase">Battery Model</Label>
                  <Select value={filterBattery || "all"} onValueChange={value => setFilterBattery(value === "all" ? null : value)}>
                    <SelectTrigger className="w-full bg-muted/30 border-border/50">
                      <SelectValue placeholder="All batteries" />
                    </SelectTrigger>
                    <SelectContent className="bg-gradient-card border border-border/50 backdrop-blur-md">
                      <SelectItem value="all">All batteries</SelectItem>
                      {batteryNames.map(name => (
                        <SelectItem key={name} value={name}>{name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status filter */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground uppercase">Status</Label>
                  <Select value={filterStatus || "all"} onValueChange={value => setFilterStatus(value === "all" ? null : value)}>
                    <SelectTrigger className="w-full bg-muted/30 border-border/50">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent className="bg-gradient-card border border-border/50 backdrop-blur-md">
                      <SelectItem value="all">All statuses</SelectItem>
                      {statusTypes.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Health threshold */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="health-threshold"
                      checked={showHealthBelow}
                      onCheckedChange={checked => setShowHealthBelow(!!checked)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <Label htmlFor="health-threshold" className="text-sm cursor-pointer">
                      Show batteries with health below
                    </Label>
                  </div>

                  <Select
                    value={healthThreshold}
                    onValueChange={setHealthThreshold}
                    disabled={!showHealthBelow}
                  >
                    <SelectTrigger className="w-full bg-muted/30 border-border/50">
                      <SelectValue placeholder="Select threshold" />
                    </SelectTrigger>
                    <SelectContent className="bg-gradient-card border border-border/50 backdrop-blur-md">
                      <SelectItem value="90">90%</SelectItem>
                      <SelectItem value="80">80%</SelectItem>
                      <SelectItem value="70">70%</SelectItem>
                      <SelectItem value="60">60%</SelectItem>
                      <SelectItem value="50">50%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Apply filters button */}
                <Button
                  className="w-full mt-6 bg-gradient-primary hover:opacity-90 text-background"
                  onClick={() => setIsFilterOpen(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="outline"
            size="sm"
            className="bg-muted/50 border-border/50 text-foreground rounded-lg hover:bg-muted hover:text-primary relative overflow-hidden"
            onClick={async () => {
              // Add a visual spinning effect for refresh
              const button = document.getElementById('refresh-button');
              if (button) {
                button.classList.add('animate-spin');
              }

              try {
                // If refetch is available, call it to get fresh data
                if (refetch) {
                  await refetch();
                }

                // Reset filters and page
                resetFilters();
              } catch (error) {
                console.error("Error refreshing data:", error);
              } finally {
                // Stop the spinning effect
                if (button) {
                  setTimeout(() => {
                    button.classList.remove('animate-spin');
                  }, 1000);
                }
              }
            }}
          >
            <RefreshCcw id="refresh-button" className="h-4 w-4 mr-1 transition-all duration-500" />
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
                      <div className="text-sm">{parseFloat(battery.healthPercentage.toFixed(2))}%</div>
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
                          className="h-8 w-8 text-muted-foreground bg-danger/10 rounded-lg hover:text-danger hover:bg-danger/20"
                          onClick={() => handleDeleteBattery(battery.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="bg-muted/30 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-border/50">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filteredBatteries.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to{" "}
              <span className="font-medium text-foreground">
                {Math.min(currentPage * itemsPerPage, filteredBatteries.length)}
              </span>{" "}
              of <span className="font-medium text-foreground">{filteredBatteries.length}</span> batteries
            </p>

            {/* Active filters indicators */}
            {(filterBattery || filterStatus || showHealthBelow) && (
              <div className="flex flex-wrap gap-2 mt-2 md:mt-0 md:ml-3">
                {filterBattery && (
                  <div className="flex items-center text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                    <span>Battery: {filterBattery}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 hover:bg-transparent hover:text-primary/80"
                      onClick={() => setFilterBattery(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}

                {filterStatus && (
                  <div className="flex items-center text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                    <span>Status: {filterStatus}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 hover:bg-transparent hover:text-primary/80"
                      onClick={() => setFilterStatus(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}

                {showHealthBelow && (
                  <div className="flex items-center text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                    <span>Health below {healthThreshold}%</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 hover:bg-transparent hover:text-primary/80"
                      onClick={() => setShowHealthBelow(false)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <div className="flex rounded-lg overflow-hidden border border-border/50 divide-x divide-border/50">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-none text-foreground bg-muted/50 hover:bg-muted hover:text-primary"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1 || filteredBatteries.length === 0}
              >
                <i className="ri-arrow-left-s-line text-lg"></i>
              </Button>
              <div className="h-8 px-3 flex items-center justify-center bg-muted/70 text-sm font-medium">
                {currentPage} / {totalPages || 1}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-gradient-dark border border-border/50 backdrop-blur-md shadow-xl shadow-primary/10">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Battery Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this battery? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-muted/50 border-border/50 hover:bg-muted"
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-danger hover:bg-danger/90 !text-white"
              onClick={(e) => {
                e.preventDefault(); // Prevent dialog from closing automatically
                confirmDeleteBattery();
              }}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                  Deleting...
                </>
              ) : (
                "Delete Battery"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}



