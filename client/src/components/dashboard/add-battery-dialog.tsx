import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertBatterySchema, type InsertBattery } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Battery, Loader2, Plus } from "lucide-react";

// Extend the insert schema with additional validation
const formSchema = z.object({
  name: z.string().min(3, {
    message: "Battery name must be at least 3 characters",
  }),
  serialNumber: z.string().min(5, {
    message: "Serial number must be at least 5 characters",
  }),
  initialCapacity: z.coerce.number().min(100, {
    message: "Capacity must be at least 100 mAh",
  }),
  currentCapacity: z.coerce.number().min(100, {
    message: "Current capacity must be at least 100 mAh",
  }),
  healthPercentage: z.coerce.number().min(0).max(100, {
    message: "Health percentage must be between 0-100%",
  }),
  cycleCount: z.coerce.number().min(0, {
    message: "Cycle count must be 0 or higher",
  }),
  expectedCycles: z.coerce.number().min(100, {
    message: "Expected cycles must be at least 100",
  }),
  status: z.string().min(1, {
    message: "Status is required",
  }),
  initialDate: z.string(),
  manufacturer: z.string().min(2).optional(),
  model: z.string().min(2).optional(),
  chemistry: z.string().optional(),
  voltage: z.coerce.number().min(1).optional(),
  installationLocation: z.string().optional(),
});

export function AddBatteryDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  // Get today's date in ISO format
  const today = new Date().toISOString().split("T")[0];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      serialNumber: "",
      initialCapacity: 5000,
      currentCapacity: 5000,
      healthPercentage: 100,
      cycleCount: 0,
      expectedCycles: 500,
      status: "Good",
      initialDate: today,
      manufacturer: "",
      model: "",
      chemistry: "Lithium-ion",
      voltage: 3.7,
      installationLocation: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/batteries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to add battery");
      }
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch the batteries list
      queryClient.invalidateQueries({ queryKey: ["/api/batteries"] });
      
      // Show success toast and close dialog
      toast({
        title: "Battery added successfully",
        description: "The new battery has been added to your inventory.",
      });
      
      // Reset form and close dialog
      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      console.error("Error adding battery:", error);
      toast({
        title: "Failed to add battery",
        description: "There was an error adding the battery. Please try again.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    // Calculate current capacity based on health percentage if it wasn't already set
    if (data.currentCapacity === data.initialCapacity && data.healthPercentage < 100) {
      data.currentCapacity = Math.round((data.initialCapacity * data.healthPercentage) / 100);
    }
    
    // Add required fields that aren't in the form
    const batteryData = {
      name: data.name,
      serialNumber: data.serialNumber,
      initialCapacity: data.initialCapacity,
      currentCapacity: data.currentCapacity,
      healthPercentage: data.healthPercentage,
      cycleCount: data.cycleCount,
      expectedCycles: data.expectedCycles,
      status: data.status,
      initialDate: new Date(data.initialDate),
      lastUpdated: new Date(),
      degradationRate: 0.5, // Default degradation rate (% per month)
    };
    
    console.log('Submitting battery data:', batteryData);
    
    // Submit the data
    mutation.mutate(batteryData);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-2 rounded-lg bg-gradient-to-r from-primary/20 to-accent/10 text-foreground hover:bg-muted hover:text-primary"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Battery
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-gradient-dark border border-border/50 backdrop-blur-md shadow-xl shadow-primary/10">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Battery className="mr-2 h-5 w-5 text-primary" />
            Add New Battery
          </DialogTitle>
          <DialogDescription>
            Enter the details of the new battery to add it to your inventory.
            Complete all required fields marked with an asterisk (*).
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <div className="text-sm font-medium text-primary mb-2">Basic Information</div>
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Battery Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Battery #5" {...field} className="bg-muted/30 border-border/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="serialNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Serial Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., BAT-2025-0005" {...field} className="bg-muted/30 border-border/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="manufacturer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manufacturer *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Tesla" {...field} className="bg-muted/30 border-border/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., PowerCell X5" {...field} className="bg-muted/30 border-border/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Technical Specifications Section */}
              <div className="space-y-4">
                <div className="text-sm font-medium text-primary mb-2">Technical Specifications</div>
                
                <FormField
                  control={form.control}
                  name="initialCapacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial Capacity (mAh) *</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 5000" {...field} className="bg-muted/30 border-border/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="voltage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Voltage (V) *</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="e.g., 3.7" {...field} className="bg-muted/30 border-border/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="chemistry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chemistry</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-muted/30 border-border/50">
                            <SelectValue placeholder="Select chemistry type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gradient-card border border-border/50 backdrop-blur-md">
                          <SelectItem value="Lithium-ion">Lithium-ion</SelectItem>
                          <SelectItem value="LiFePO4">LiFePO4 (Lithium Iron Phosphate)</SelectItem>
                          <SelectItem value="NiMH">NiMH (Nickel-Metal Hydride)</SelectItem>
                          <SelectItem value="Lead-acid">Lead-acid</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="expectedCycles"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Cycle Life</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 500" {...field} className="bg-muted/30 border-border/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Condition & Installation Section */}
              <div className="space-y-4">
                <div className="text-sm font-medium text-primary mb-2">Condition & Installation</div>
                
                <FormField
                  control={form.control}
                  name="cycleCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Cycle Count</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 0" {...field} className="bg-muted/30 border-border/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="healthPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Health Percentage (%)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 100" {...field} className="bg-muted/30 border-border/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-muted/30 border-border/50">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gradient-card border border-border/50 backdrop-blur-md">
                          <SelectItem value="Good">Good</SelectItem>
                          <SelectItem value="Fair">Fair</SelectItem>
                          <SelectItem value="Poor">Poor</SelectItem>
                          <SelectItem value="Critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="installationLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Installation Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Building A, Room 101" {...field} className="bg-muted/30 border-border/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Dates Section */}
              <div className="space-y-4">
                <div className="text-sm font-medium text-primary mb-2">Installation Date</div>
                
                <FormField
                  control={form.control}
                  name="initialDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Installation Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} className="bg-muted/30 border-border/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <DialogFooter className="gap-2 sm:gap-0">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                className="bg-muted/50 border-border/50 hover:bg-muted"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-gradient-to-r from-primary to-accent text-background hover:opacity-90"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Battery
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}