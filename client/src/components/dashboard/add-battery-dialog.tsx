
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "../../lib/queryClient";
import { insertBatterySchema, type InsertBattery } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "../../hooks/use-toast";
import { API_BASE_URL } from "../../lib/apiConfig";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
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

  // Get today's date in full ISO format
  const today = new Date().toISOString();

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
      try {
        // Make sure dates are properly formatted as strings
        const formattedData = {
          ...data,
          // Ensure these are properly formatted ISO strings
          initialDate: typeof data.initialDate === 'string' ? data.initialDate : data.initialDate.toISOString(),
          lastUpdated: typeof data.lastUpdated === 'string' ? data.lastUpdated : new Date().toISOString()
        };

        console.log("Submitting battery:", formattedData);

        // Use the centralized API_BASE_URL for consistent behavior
        const url = `${API_BASE_URL}/batteries`;
        console.log("Sending request to:", url);

        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedData),
          credentials: 'include'
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
          try {
            // Try to get error message from JSON response
            const errorData = await response.json();
            console.error("Server response error:", errorData);
            throw new Error(errorData.message || "Failed to add battery");
          } catch (jsonError) {
            // If response isn't valid JSON, use status text
            console.error("Non-JSON error response:", response.statusText);
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
          }
        }

        // For debugging
        const rawResponse = await response.text();
        console.log("Raw response:", rawResponse);

        try {
          // If empty response, return a default success object
          if (!rawResponse.trim()) {
            return { success: true, message: "Battery added successfully" };
          }

          // Otherwise parse the JSON
          return JSON.parse(rawResponse);
        } catch (parseError) {
          console.error("Error parsing response:", parseError);
          // Return a default success object if parsing fails
          return { success: true, message: "Battery added successfully" };
        }
      } catch (error) {
        console.error("Mutation error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch the batteries list - use multiple formats to handle all environments
      queryClient.invalidateQueries({ queryKey: ["/api/batteries"] });
      queryClient.invalidateQueries({ queryKey: ["batteries"] });

      // Force a direct refresh of data
      setTimeout(() => {
        fetch(`${API_BASE_URL}/batteries`)
          .then(response => {
            console.log("Manually refreshing battery data");
            if (response.ok) {
              // No need to process the response, just trigger a refresh
            }
          })
          .catch(error => console.error("Error manually refreshing data:", error));
      }, 500);

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

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Calculate current capacity based on health percentage
      const currentCapacity = Math.round((Number(values.initialCapacity) * Number(values.healthPercentage)) / 100);

      // Get current date as string for lastUpdated
      const now = new Date().toISOString();

      // Create a complete battery object with all required fields
      // For all date fields, ensure they are strings (not Date objects)
      const battery = {
        name: values.name,
        serialNumber: values.serialNumber,
        initialCapacity: Number(values.initialCapacity),
        currentCapacity: currentCapacity,
        healthPercentage: Number(values.healthPercentage),
        cycleCount: Number(values.cycleCount),
        expectedCycles: Number(values.expectedCycles),
        status: values.status,
        // Make sure initialDate is properly formatted as ISO string
        initialDate: values.initialDate,
        lastUpdated: now,
        degradationRate: 0.5
      };

      console.log('Submitting battery:', battery);

      // Submit the data
      mutation.mutate(battery);
    } catch (error) {
      console.error("Error in form submission:", error);
      toast({
        title: "Form Error",
        description: "There was an error processing your form data. Please check all fields and try again.",
        variant: "destructive",
      });
    }
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
      <DialogContent className="sm:max-w-[600px] bg-gradient-dark border border-border/50 backdrop-blur-md shadow-xl shadow-primary/10 max-h-[90vh] overflow-y-auto">
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