// import { Switch, Route } from "wouter";
// import { queryClient } from "./lib/queryClient";
// import { QueryClientProvider } from "@tanstack/react-query";
// import { Toaster } from './components/ui/toaster';
// // import { Toaster } from './components/ui/toaster';
// import { TooltipProvider } from './components/ui/tooltip';
// import Dashboard from './pages/dashboard';
// import BatteryDetail from './pages/battery-detail';
// import Login from './pages/login';
// import Register from './pages/register';
// import Verify from './pages/verify';
// import NotFound from './pages/not-found';
// import { ThemeProvider } from "next-themes";
// import { useEffect } from "react";
// import { useAuthCheck } from './hooks/useAuthCheck';

// // Protected route component that checks authentication
// function ProtectedRoute({ component: Component, ...rest }: { component: React.ComponentType<any>, path?: string }) {
//   const { isLoading } = useAuthCheck();

//   if (isLoading) {
//     return (
//       <div className="flex h-screen w-screen items-center justify-center bg-background">
//         <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
//       </div>
//     );
//   }

//   return <Component {...rest} />;
// }



// // Public route component that redirects to dashboard if already authenticated
// function PublicRoute({ component: Component, ...rest }: { component: React.ComponentType<any>, path?: string }) {
//   const { isLoading } = useAuthCheck('/', true);

//   if (isLoading) {
//     return (
//       <div className="flex h-screen w-screen items-center justify-center bg-background">
//         <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
//       </div>
//     );
//   }

//   return <Component {...rest} />;
// }

// function Router() {
//   return (
//     <Switch>
//       {/* Public routes */}
//       <Route path="/login" component={(props) => <PublicRoute component={Login} {...props} />} />
//       <Route path="/register" component={(props) => <PublicRoute component={Register} {...props} />} />
//       <Route path="/verify" component={Verify} />

//       {/* Protected routes */}
//       <Route path="/" component={(props) => <ProtectedRoute component={Dashboard} {...props} />} />
//       <Route path="/battery/:id" component={(props) => <ProtectedRoute component={BatteryDetail} {...props} />} />
//       <Route path="/batteries" component={(props) => <ProtectedRoute component={Dashboard} {...props} />} />
//       <Route path="/history" component={(props) => <ProtectedRoute component={Dashboard} {...props} />} />
//       <Route path="/settings" component={(props) => <ProtectedRoute component={Dashboard} {...props} />} />
//       <Route path="/notifications" component={(props) => <ProtectedRoute component={Dashboard} {...props} />} />

//       {/* 404 route */}
//       <Route component={NotFound} />
//     </Switch>
//   );
// }

// function App() {
//   // Ensure the dark theme is applied immediately to avoid flicker
//   useEffect(() => {
//     document.documentElement.classList.add('dark');
//   }, []);

//   return (
//     <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
//       <QueryClientProvider client={queryClient}>
//         <TooltipProvider>
//           <div className="bg-background text-foreground">
//             <Toaster />
//             <Router />
//           </div>
//         </TooltipProvider>
//       </QueryClientProvider>
//     </ThemeProvider>
//   );
// }

// export default App;










// --------------------new code updated 

import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from './components/ui/toaster';
import { TooltipProvider } from './components/ui/tooltip';
import Dashboard from './pages/dashboard';
import BatteryDetail from './pages/battery-detail';
import Login from './pages/login';
import Register from './pages/register';
import Verify from './pages/verify';
import NotFound from './pages/not-found';
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import { useAuthCheck } from './hooks/useAuthCheck';
import { supabase } from './lib/auth';

// Protected route component that checks authentication
function ProtectedRoute({ component: Component, ...rest }: { component: React.ComponentType<any>, path?: string }) {
  const { isLoading } = useAuthCheck();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  return <Component {...rest} />;
}

// Public route component that redirects to dashboard if already authenticated
function PublicRoute({ component: Component, ...rest }: { component: React.ComponentType<any>, path?: string }) {
  const { isLoading } = useAuthCheck('/', true);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  return <Component {...rest} />;
}

// Auth callback handler for Google login
function AuthCallback() {
  const [_, setLocation] = useLocation();

  useEffect(() => {
    // Process the auth callback and redirect
    const handleCallback = async () => {
      try {
        // Get the current session
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error in auth callback:', error);
          setLocation('/login');
          return;
        }

        if (data.session) {
          // If we have a session, go to dashboard
          console.log('Authentication successful, redirecting to dashboard');
          setLocation('/');
        } else {
          // No session, go to login
          console.log('No session found, redirecting to login');
          setLocation('/login');
        }
      } catch (err) {
        console.error('Failed to process auth callback:', err);
        setLocation('/login');
      }
    };

    handleCallback();
  }, [setLocation]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      <div className="ml-4">Processing authentication...</div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/login" component={(props) => <PublicRoute component={Login} {...props} />} />
      <Route path="/register" component={(props) => <PublicRoute component={Register} {...props} />} />
      <Route path="/verify" component={Verify} />

      {/* Add this new route for auth callback */}
      <Route path="/auth/callback" component={AuthCallback} />

      {/* Protected routes */}
      <Route path="/" component={(props) => <ProtectedRoute component={Dashboard} {...props} />} />
      <Route path="/battery/:id" component={(props) => <ProtectedRoute component={BatteryDetail} {...props} />} />
      <Route path="/batteries" component={(props) => <ProtectedRoute component={Dashboard} {...props} />} />
      <Route path="/history" component={(props) => <ProtectedRoute component={Dashboard} {...props} />} />
      <Route path="/settings" component={(props) => <ProtectedRoute component={Dashboard} {...props} />} />
      <Route path="/notifications" component={(props) => <ProtectedRoute component={Dashboard} {...props} />} />

      {/* 404 route */}
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