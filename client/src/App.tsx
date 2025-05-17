import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import BatteryDetail from "@/pages/battery-detail";
import NotFound from "@/pages/not-found";
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/battery/:id" component={BatteryDetail} />
      <Route path="/batteries" component={Dashboard} />
      <Route path="/history" component={Dashboard} />
      <Route path="/settings" component={Dashboard} />
      <Route path="/notifications" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Ensure the dark theme is applied immediately to avoid flicker
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="bg-background text-foreground">
            <Toaster />
            <Router />
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
