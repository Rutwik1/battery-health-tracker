'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Plus } from 'lucide-react';

import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { useBatteryStore } from '../../app/store/useBatteryStore';

// Form schema with validation
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Battery name must be at least 2 characters.",
  }),
  serialNumber: z.string().min(3, {
    message: "Serial number is required.",
  }),
  initialCapacity: z.coerce.number().min(100, {
    message: "Capacity must be at least 100 mAh.",
  }),
  cycleCount: z.coerce.number().min(0, {
    message: "Cycle count must be a positive number.",
  }),
  expectedCycles: z.coerce.number().min(100, {
    message: "Expected cycles must be at least 100.",
  }),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  chemistry: z.string().optional(),
  voltage: z.coerce.number().optional(),
  installationLocation: z.string().optional(),
});

export function AddBatteryDialog() {
  const [open, setOpen] = React.useState(false);
  const { addBattery } = useBatteryStore();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      serialNumber: "",
      initialCapacity: 5000,
      cycleCount: 0,
      expectedCycles: 500,
      manufacturer: "",
      model: "",
      chemistry: "Lithium Ion",
      voltage: 3.7,
      installationLocation: "",
    },
  });

  // Function to handle form submission
  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      // Calculate initial health (assuming 100% at start)
      const healthPercentage = 100;
      const currentCapacity = data.initialCapacity;
      
      // Add status based on health
      let status = "Excellent";
      
      // Create the new battery
      await addBattery({
        name: data.name,
        serialNumber: data.serialNumber,
        initialCapacity: data.initialCapacity,
        currentCapacity,
        healthPercentage,
        cycleCount: data.cycleCount,
        expectedCycles: data.expectedCycles,
        status,
        initialDate: new Date(),
        lastUpdated: new Date(),
        degradationRate: 0.5,  // Default degradation rate (0.5% per month)
        manufacturer: data.manufacturer || undefined,
        model: data.model || undefined,
        chemistry: data.chemistry || undefined,
        voltage: data.voltage || undefined,
        installationLocation: data.installationLocation || undefined,
      });
      
      // Reset form and close dialog
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Error adding battery:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="gradient" size="sm" className="h-8">
          <Plus className="h-4 w-4 mr-1" />
          Add Battery
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Battery</DialogTitle>
          <DialogDescription>
            Enter the details of the battery you want to add to your monitoring system.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Battery Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Server Room Battery 1" {...field} />
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
                  <FormLabel>Serial Number</FormLabel>
                  <FormControl>
                    <Input placeholder="SN12345678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="initialCapacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Capacity (mAh)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cycleCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Cycle Count</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="expectedCycles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Total Cycles</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="manufacturer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manufacturer</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional" {...field} />
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
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="chemistry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chemistry</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select chemistry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Lithium Ion">Lithium Ion</SelectItem>
                        <SelectItem value="Lithium Polymer">Lithium Polymer</SelectItem>
                        <SelectItem value="Lithium Iron Phosphate">Lithium Iron Phosphate</SelectItem>
                        <SelectItem value="Lead Acid">Lead Acid</SelectItem>
                        <SelectItem value="Nickel Cadmium">Nickel Cadmium</SelectItem>
                        <SelectItem value="Nickel Metal Hydride">Nickel Metal Hydride</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="voltage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Voltage (V)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="Optional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="installationLocation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Installation Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Server Room A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button type="submit" className="w-full">Add Battery</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}