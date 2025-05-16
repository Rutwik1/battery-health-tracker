"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Battery, 
  BarChart3, 
  Bell, 
  ChevronDown, 
  Home, 
  LineChart, 
  Menu,
  RefreshCw, 
  Search, 
  Settings,
  User
} from "lucide-react";
import { useBatteryStore } from "../../lib/store/battery-store";

export default function Dashboard() {
  const router = useRouter();
  const { 
    batteries, 
    initializeBatteries, 
    startRealTimeUpdates, 
    stopRealTimeUpdates 
  } = useBatteryStore();

  useEffect(() => {
    // Initialize batteries data when component mounts
    initializeBatteries();
    
    // Start simulated real-time updates
    startRealTimeUpdates();
    
    // Clean up when component unmounts
    return () => {
      stopRealTimeUpdates();
    };
  }, [initializeBatteries, startRealTimeUpdates, stopRealTimeUpdates]);

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-border/50 bg-gradient-dark">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4 mb-6">
              <Image 
                src="/logo.svg" 
                alt="Coulomb.ai Logo" 
                width={150} 
                height={40}
                className="h-10 w-auto"
              />
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              <a 
                href="#" 
                className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-md bg-primary/20 text-primary"
              >
                <Home className="mr-3 h-5 w-5" />
                Dashboard
              </a>
              <a 
                href="#" 
                className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              >
                <Battery className="mr-3 h-5 w-5" />
                Batteries
              </a>
              <a 
                href="#" 
                className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              >
                <LineChart className="mr-3 h-5 w-5" />
                Analytics
              </a>
              <a 
                href="#" 
                className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              >
                <BarChart3 className="mr-3 h-5 w-5" />
                Reports
              </a>
              <a 
                href="#" 
                className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              >
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </a>
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-border/50 p-4">
            <a href="#" className="flex-shrink-0 group block">
              <div className="flex items-center">
                <div>
                  <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <User className="h-5 w-5" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-muted-foreground">View profile</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-gradient-dark border-b border-border/50 backdrop-blur-sm">
          <button className="md:hidden px-4 text-primary">
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 px-4 md:px-6 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full max-w-md flex md:ml-0 mt-3 md:mt-0">
                <div className="relative w-full text-muted-foreground">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5" />
                  </div>
                  <input
                    className="block w-full pl-10 pr-3 py-2 rounded-lg leading-5 bg-muted/50 border-border/50 placeholder-muted-foreground focus:outline-none focus:ring-primary/50 focus:border-primary/50"
                    placeholder="Search batteries..."
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted/50">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted/50">
                <RefreshCw className="h-5 w-5" />
              </button>
              
              <div className="h-8 w-px mx-2 bg-border/50 hidden sm:block"></div>
              
              <button className="ml-2 px-3 py-1.5 rounded-lg bg-muted/50 border-border/50 text-foreground hover:bg-muted hover:text-primary hidden sm:flex items-center">
                <Battery className="h-4 w-4 mr-1.5" />
                Add Battery
              </button>
            </div>
          </div>
        </div>
        
        {/* Main dashboard content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-semibold gradient-heading">Battery Health Dashboard</h1>
              <p className="text-muted-foreground mt-1">Monitor and analyze your battery performance in real-time</p>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
              {/* Cards for key metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Total Batteries */}
                <div className="bg-card/30 backdrop-blur-md p-5 rounded-xl border border-border/30 card-glow">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Batteries</h3>
                    <span className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                      <Battery className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="text-3xl font-semibold">{batteries.length}</p>
                    <p className="mt-1 text-xs text-success flex items-center">
                      <span className="inline-block h-2 w-2 rounded-full bg-success mr-1"></span>
                      All systems operational
                    </p>
                  </div>
                </div>
                
                {/* Average Health */}
                <div className="bg-card/30 backdrop-blur-md p-5 rounded-xl border border-border/30 card-glow">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-muted-foreground">Average Health</h3>
                    <span className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                      <LineChart className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="text-3xl font-semibold">
                      {batteries.length > 0 
                        ? `${Math.round(batteries.reduce((acc, battery) => acc + battery.healthPercentage, 0) / batteries.length)}%` 
                        : "0%"}
                    </p>
                    <div className="mt-1 h-1.5 w-full bg-muted/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full" 
                        style={{ 
                          width: batteries.length > 0 
                            ? `${Math.round(batteries.reduce((acc, battery) => acc + battery.healthPercentage, 0) / batteries.length)}%` 
                            : "0%" 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                {/* Critical Status */}
                <div className="bg-card/30 backdrop-blur-md p-5 rounded-xl border border-border/30 card-glow">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-muted-foreground">Critical Status</h3>
                    <span className="h-8 w-8 rounded-lg bg-danger/20 flex items-center justify-center text-danger">
                      <Battery className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="text-3xl font-semibold">
                      {batteries.filter(b => b.status === "Critical").length}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Batteries requiring immediate attention
                    </p>
                  </div>
                </div>
                
                {/* Capacity Loss Rate */}
                <div className="bg-card/30 backdrop-blur-md p-5 rounded-xl border border-border/30 card-glow">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-muted-foreground">Capacity Loss Rate</h3>
                    <span className="h-8 w-8 rounded-lg bg-warning/20 flex items-center justify-center text-warning">
                      <BarChart3 className="h-4 w-4" />
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="text-3xl font-semibold">0.8%</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Average monthly capacity loss
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Main content grid */}
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Battery status list - wider column */}
                <div className="lg:col-span-2 bg-card/30 backdrop-blur-md rounded-xl border border-border/30 shadow-lg shadow-primary/5 card-glow">
                  <div className="p-5 border-b border-border/50">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Battery Health Details</h3>
                      <div className="flex space-x-2">
                        <button className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted/50">
                          <RefreshCw className="h-4 w-4" />
                        </button>
                        <button className="flex items-center p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-muted/50">
                          <span className="text-sm mr-1">Filter</span>
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-border/30">
                        <thead>
                          <tr>
                            <th className="px-3 py-3.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              Battery
                            </th>
                            <th className="px-3 py-3.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-3 py-3.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              Health
                            </th>
                            <th className="px-3 py-3.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              Cycles
                            </th>
                            <th className="px-3 py-3.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-transparent divide-y divide-border/30">
                          {batteries.length > 0 ? (
                            batteries.map((battery) => (
                              <tr key={battery.id} className="hover:bg-muted/20">
                                <td className="px-3 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-accent/10">
                                      <Battery className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="ml-3">
                                      <div className="text-sm font-medium">{battery.name}</div>
                                      <div className="text-xs text-muted-foreground">{battery.serialNumber}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-3 py-4 whitespace-nowrap">
                                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full
                                    ${battery.status === 'Good' ? 'bg-success/10 text-success' : 
                                      battery.status === 'Fair' ? 'bg-warning/10 text-warning' : 
                                      battery.status === 'Poor' ? 'bg-warning/10 text-warning' : 
                                      'bg-danger/10 text-danger'}`}
                                  >
                                    {battery.status}
                                  </span>
                                </td>
                                <td className="px-3 py-4 whitespace-nowrap">
                                  <div>
                                    <div className="text-sm">{battery.healthPercentage}%</div>
                                    <div className="mt-1 h-1 w-16 bg-muted/50 rounded-full overflow-hidden">
                                      <div 
                                        className={`h-full rounded-full ${
                                          battery.healthPercentage > 80 ? 'bg-success' : 
                                          battery.healthPercentage > 60 ? 'bg-warning' : 
                                          'bg-danger'
                                        }`} 
                                        style={{ width: `${battery.healthPercentage}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-3 py-4 whitespace-nowrap">
                                  <div className="text-sm">{battery.cycleCount}</div>
                                  <div className="text-xs text-muted-foreground">of {battery.expectedCycles}</div>
                                </td>
                                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                                  <div className="flex space-x-2">
                                    <button 
                                      className="p-1.5 text-muted-foreground bg-primary/10 rounded-lg hover:text-primary hover:bg-primary/20"
                                      onClick={() => router.push(`/dashboard/battery/${battery.id}`)}
                                    >
                                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                    </button>
                                    <button 
                                      className="p-1.5 text-muted-foreground bg-danger/10 rounded-lg hover:text-danger hover:bg-danger/20"
                                    >
                                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="px-3 py-6 text-center text-muted-foreground">
                                No batteries found. Add a new battery to get started.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                
                {/* Sidebar content - narrower column */}
                <div className="space-y-6">
                  {/* Battery Health Status */}
                  <div className="bg-card/30 backdrop-blur-md rounded-xl border border-border/30 shadow-lg shadow-primary/5 card-glow overflow-hidden">
                    <div className="p-5 border-b border-border/50">
                      <h3 className="text-lg font-medium">Battery Status</h3>
                    </div>
                    <div className="p-5">
                      {batteries.length > 0 ? (
                        <div className="space-y-5">
                          {batteries.map((battery, index) => (
                            index < 2 && (
                              <div key={battery.id} className="flex items-center">
                                <div className="relative mr-4">
                                  <div className="h-16 w-9 rounded-md border-2 border-border flex flex-col">
                                    <div 
                                      className={`w-full ${
                                        battery.healthPercentage > 80 ? 'bg-success' : 
                                        battery.healthPercentage > 60 ? 'bg-warning' : 
                                        'bg-danger'
                                      }`} 
                                      style={{ height: `${battery.healthPercentage}%` }}
                                    ></div>
                                  </div>
                                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-1 bg-border rounded-t-full"></div>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium">{battery.name}</h4>
                                  <p className="text-xs text-muted-foreground">{battery.serialNumber}</p>
                                  <div className="mt-1 flex items-center">
                                    <span className={`text-xs font-bold ${
                                      battery.healthPercentage > 80 ? 'text-success' : 
                                      battery.healthPercentage > 60 ? 'text-warning' : 
                                      'text-danger'
                                    }`}>
                                      {battery.healthPercentage}%
                                    </span>
                                    <span className="mx-1 text-muted-foreground">•</span>
                                    <span className="text-xs text-muted-foreground">
                                      {battery.currentCapacity} mAh
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )
                          ))}
                        </div>
                      ) : (
                        <div className="py-3 text-center text-muted-foreground text-sm">
                          No battery data available
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Recommendations */}
                  <div className="bg-card/30 backdrop-blur-md rounded-xl border border-border/30 shadow-lg shadow-primary/5 card-glow">
                    <div className="p-5 border-b border-border/50">
                      <h3 className="text-lg font-medium">Recommendations</h3>
                    </div>
                    <div className="p-5">
                      <ul className="space-y-3">
                        <li className="flex space-x-3 items-start">
                          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-warning/20 flex items-center justify-center text-warning">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 9V13M12 17.01L12.01 16.999M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Battery #2 needs calibration</h4>
                            <p className="text-xs text-muted-foreground mt-1">Health readings are inconsistent, consider a full calibration cycle.</p>
                          </div>
                        </li>
                        <li className="flex space-x-3 items-start">
                          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-success/20 flex items-center justify-center text-success">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Optimal charging patterns detected</h4>
                            <p className="text-xs text-muted-foreground mt-1">Battery #1 shows ideal charging pattern, continue as is.</p>
                          </div>
                        </li>
                        <li className="flex space-x-3 items-start">
                          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-danger/20 flex items-center justify-center text-danger">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 9V13M12 17.01L12.01 16.999M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Replace Battery #4</h4>
                            <p className="text-xs text-muted-foreground mt-1">Health below critical threshold, replacement recommended.</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}