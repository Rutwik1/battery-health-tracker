import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertBatterySchema } from "@shared/schema";
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

// Schema without currentCapacity (we'll calculate it)
const formSchema = z.object({
  name: z.string().min(3, { message: "Battery name must be at least 3 characters" }),
  serialNumber: z.string().min(5, { message: "Serial number must be at least 5 characters" }),
  initialCapacity: z.coerce.number().min(100, { message: "Capacity must be at least 100 mAh" }),
  healthPercentage: z.coerce.number().min(0).max(100, { message: "Health percentage must be between 0-100%" }),
  cycleCount: z.coerce.number().min(0, { message: "Cycle count must be 0 or higher" }),
  expectedCycles: z.coerce.number().min(100, { message: "Expected cycles must be at least 100" }),
  status: z.string().min(1, { message: "Status is required" }),
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
  const today = new Date().toISOString().split("T")[0];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      serialNumber: "",
      initialCapacity: 5000,
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
      const processedData = {
        ...data,
        initialDate: new Date(data.initialDate).toISOString(),
        lastUpdated: new Date().toISOString(),
      };

      // Optional cleanup
      ["manufacturer", "model", "installationLocation"].forEach((key) => {
        if (processedData[key] === "") delete processedData[key];
      });

      // Validate final object
      insertBatterySchema.parse(processedData);

      const response = await fetch("/api/batteries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(processedData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to add battery");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/batteries"] });
      toast({ title: "Battery added successfully" });
      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to add battery",
        description: "There was an error adding the battery. Please try again.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const initialDate = new Date(values.initialDate);
      const currentCapacity = Math.round((values.initialCapacity * values.healthPercentage) / 100);

      const battery = {
        ...values,
        initialCapacity: Number(values.initialCapacity),
        currentCapacity,
        healthPercentage: Number(values.healthPercentage),
        cycleCount: Number(values.cycleCount),
        expectedCycles: Number(values.expectedCycles),
        initialDate,
        lastUpdated: new Date(),
        degradationRate: 0.5,
      };

      mutation.mutate(battery);
    } catch (error) {
      toast({
        title: "Form Error",
        description: "There was an error processing your form data.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2 rounded-lg bg-gradient-to-r from-primary/20 to-accent/10 text-foreground hover:bg-muted hover:text-primary">
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
            Enter the battery details. Fields marked with an asterisk (*) are required.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Grid sections go here (unchanged layout from previous version) */}
            {/* ... you can keep your form fields as-is, just remove currentCapacity input if present ... */}

            <FormField
              control={form.control}
              name="initialDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Installation Date</FormLabel>
                  <FormControl>
                    <Input type="date" max={today} {...field} className="bg-muted/30 border-border/50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="bg-muted/50 border-border/50 hover:bg-muted">
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
