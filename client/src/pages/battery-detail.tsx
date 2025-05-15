import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ArrowLeft, Download, AlertCircle, Calendar } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { Battery } from "@shared/schema";
import CapacityChart from "@/components/dashboard/capacity-chart";
import { exportBatteryData } from "@/lib/utils/export";
import { getBatteryStatusColor } from "@/lib/utils/battery";

export default function BatteryDetail() {
  const [, params] = useRoute<{ id: string }>("/battery/:id");
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState<string>("365");
  
  const batteryId = params?.id ? parseInt(params.id) : null;
  
  const { data: battery, isLoading, error } = useQuery<Battery>({
    queryKey: [`/api/batteries/${batteryId}`],
    enabled: !!batteryId,
  });

  if (!batteryId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <div className="flex mb-4">
              <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
              <h2 className="text-xl font-semibold">Invalid Battery ID</h2>
            </div>
            <p className="mb-4">Unable to find the battery you're looking for.</p>
            <Link href="/">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleExport = () => {
    if (battery) {
      exportBatteryData([battery], timeRange);
      toast({
        title: "Data Exported",
        description: `Battery data for ${battery.name} has been exported.`
      });
    }
  };

  const statusColor = battery ? getBatteryStatusColor(battery.status) : "bg-gray-400";

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-background">
          {/* Background effects */}
          <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-primary/5 via-accent/3 to-transparent -z-10"></div>
          <div className="absolute top-40 left-20 w-[800px] h-[800px] rounded-full bg-primary/5 blur-[120px] -z-10"></div>
          <div className="absolute top-80 right-20 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[100px] -z-10"></div>
          <div className="absolute bottom-40 left-1/2 w-[400px] h-[400px] rounded-full bg-success/5 blur-[80px] -z-10"></div>
          
          <div className="py-6 px-4 sm:px-6 lg:px-8 relative z-0">
            {/* Back button and actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <Link href="/">
                <Button variant="outline" className="mb-4 sm:mb-0">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              
              <Button onClick={handleExport} disabled={isLoading || !battery}>
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
            
            {isLoading ? (
              <div className="h-[200px] bg-white animate-pulse rounded-lg mb-8"></div>
            ) : error ? (
              <div className="bg-red-50 p-6 rounded-lg mb-8">
                <div className="flex items-center">
                  <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
                  <h2 className="text-lg font-semibold text-red-800">Error Loading Battery</h2>
                </div>
                <p className="mt-2 text-red-700">Unable to load battery details. Please try again later.</p>
              </div>
            ) : battery ? (
              <>
                {/* Battery Overview */}
                <Card className="mb-8">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl font-heading">{battery.name}</CardTitle>
                      <div className={`px-3 py-1 text-xs font-medium ${statusColor} bg-opacity-10 rounded-full`}>
                        {battery.status}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-neutral-lighter mb-1">Health</h3>
                        <div className="text-3xl font-semibold">{battery.healthPercentage}%</div>
                        <Progress 
                          value={battery.healthPercentage} 
                          className={`h-2 mt-2 ${statusColor.replace('text-', 'bg-')}`} 
                        />
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-neutral-lighter mb-1">Capacity</h3>
                        <div className="text-3xl font-semibold">{battery.currentCapacity} mAh</div>
                        <div className="text-xs text-neutral-lighter mt-1">
                          Out of {battery.initialCapacity} mAh initial
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-neutral-lighter mb-1">Cycle Count</h3>
                        <div className="text-3xl font-semibold">{battery.cycleCount}</div>
                        <div className="text-xs text-neutral-lighter mt-1">
                          Out of {battery.expectedCycles} expected
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-neutral-lighter mb-1">Degradation Rate</h3>
                        <div className={`text-3xl font-semibold ${getBatteryStatusColor(battery.status)}`}>
                          {battery.degradationRate}% / month
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-neutral-lighter mb-2">Battery Information</h3>
                        <ul className="space-y-2">
                          <li className="flex justify-between">
                            <span className="text-sm text-neutral-lighter">Serial Number</span>
                            <span className="text-sm font-medium">{battery.serialNumber}</span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-sm text-neutral-lighter">Initial Date</span>
                            <span className="text-sm font-medium">
                              {format(new Date(battery.initialDate), 'MMM dd, yyyy')}
                            </span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-sm text-neutral-lighter">Last Updated</span>
                            <span className="text-sm font-medium">
                              {format(new Date(battery.lastUpdated), 'MMM dd, yyyy')}
                            </span>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-neutral-lighter mb-2">Performance Metrics</h3>
                        <ul className="space-y-2">
                          <li className="flex justify-between">
                            <span className="text-sm text-neutral-lighter">Age</span>
                            <span className="text-sm font-medium">
                              {Math.floor((new Date().getTime() - new Date(battery.initialDate).getTime()) / (30 * 24 * 60 * 60 * 1000))} months
                            </span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-sm text-neutral-lighter">Avg. Cycles Per Month</span>
                            <span className="text-sm font-medium">
                              {Math.round(battery.cycleCount / ((new Date().getTime() - new Date(battery.initialDate).getTime()) / (30 * 24 * 60 * 60 * 1000)))}
                            </span>
                          </li>
                          <li className="flex justify-between">
                            <span className="text-sm text-neutral-lighter">Estimated Remaining Life</span>
                            <span className="text-sm font-medium">
                              {Math.max(0, Math.floor((battery.expectedCycles - battery.cycleCount) / (battery.cycleCount / ((new Date().getTime() - new Date(battery.initialDate).getTime()) / (30 * 24 * 60 * 60 * 1000)))))} months
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Battery Data Tabs */}
                <Tabs defaultValue="history" className="mb-8">
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="history">Capacity History</TabsTrigger>
                    <TabsTrigger value="usage">Usage Patterns</TabsTrigger>
                    <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="history">
                    <Card>
                      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <CardTitle>Capacity Over Time</CardTitle>
                        <div className="flex items-center space-x-2 bg-muted/30 p-1.5 pl-3 rounded-lg border border-border/50 backdrop-blur-md min-w-[180px]">
                          <Calendar className="h-4 w-4 text-primary" />
                          <Select value={timeRange} onValueChange={setTimeRange}>
                            <SelectTrigger className="w-[160px] border-0 bg-transparent focus:ring-0">
                              <SelectValue placeholder="Select time range" />
                            </SelectTrigger>
                            <SelectContent className="bg-gradient-card border border-border/50 backdrop-blur-md">
                              <SelectItem value="7">Last 7 Days</SelectItem>
                              <SelectItem value="30">Last 30 Days</SelectItem>
                              <SelectItem value="90">Last 90 Days</SelectItem>
                              <SelectItem value="180">Last 6 Months</SelectItem>
                              <SelectItem value="365">Last Year</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[400px]">
                          <CapacityChart 
                            batteries={[battery]} 
                            timeRange={parseInt(timeRange)} 
                            isLoading={false} 
                            detailed={true} 
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="usage">
                    <Card>
                      <CardHeader>
                        <CardTitle>Usage Patterns</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center">
                              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-primary">
                                <i className="ri-charging-pile-2-line text-xl"></i>
                              </div>
                              <div className="ml-4">
                                <p className="text-sm font-medium text-neutral">Charging Frequency</p>
                                <p className="text-xs text-neutral-lighter mt-1">Average 1.4 times per day</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-primary">
                                <i className="ri-battery-low-line text-xl"></i>
                              </div>
                              <div className="ml-4">
                                <p className="text-sm font-medium text-neutral">Discharge Depth</p>
                                <p className="text-xs text-neutral-lighter mt-1">Average to 26% before charging</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-primary">
                                <i className="ri-timer-line text-xl"></i>
                              </div>
                              <div className="ml-4">
                                <p className="text-sm font-medium text-neutral">Charge Duration</p>
                                <p className="text-xs text-neutral-lighter mt-1">Average 1 hour 42 minutes</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-primary">
                                <i className="ri-temp-hot-line text-xl"></i>
                              </div>
                              <div className="ml-4">
                                <p className="text-sm font-medium text-neutral">Operating Temperature</p>
                                <p className="text-xs text-neutral-lighter mt-1">Average 28°C during usage</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-8">
                            <h3 className="text-base font-medium mb-4">Optimization Suggestions</h3>
                            <ul className="space-y-4">
                              <li className="flex">
                                <div className="flex-shrink-0">
                                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-primary">
                                    <i className="ri-information-line"></i>
                                  </div>
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm text-neutral">
                                    Avoid charging beyond 90% to extend battery lifespan.
                                  </p>
                                </div>
                              </li>
                              <li className="flex">
                                <div className="flex-shrink-0">
                                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-primary">
                                    <i className="ri-information-line"></i>
                                  </div>
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm text-neutral">
                                    Avoid letting battery discharge below 20% frequently.
                                  </p>
                                </div>
                              </li>
                              <li className="flex">
                                <div className="flex-shrink-0">
                                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-primary">
                                    <i className="ri-information-line"></i>
                                  </div>
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm text-neutral">
                                    Keep battery temperature between 20°C and 30°C for optimal performance.
                                  </p>
                                </div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="recommendations">
                    <Card>
                      <CardHeader>
                        <CardTitle>Recommendations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-4">
                          <li className="flex">
                            <div className="flex-shrink-0">
                              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-success">
                                <i className="ri-check-line"></i>
                              </div>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-neutral">
                                Avoid charging {battery.name} beyond 90% to extend lifespan.
                              </p>
                            </div>
                          </li>
                          
                          {battery.status === "Poor" && (
                            <li className="flex">
                              <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-red-100 text-danger">
                                  <i className="ri-alert-line"></i>
                                </div>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm text-neutral">
                                  Consider replacing {battery.name} within the next 2 months.
                                </p>
                              </div>
                            </li>
                          )}
                          
                          {battery.status === "Fair" && (
                            <li className="flex">
                              <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-yellow-100 text-warning">
                                  <i className="ri-error-warning-line"></i>
                                </div>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm text-neutral">
                                  {battery.name} is experiencing faster than normal degradation rate.
                                </p>
                              </div>
                            </li>
                          )}
                          
                          <li className="flex">
                            <div className="flex-shrink-0">
                              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-primary">
                                <i className="ri-information-line"></i>
                              </div>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-neutral">
                                Optimal charging practice: keep battery between 20% and 80%.
                              </p>
                            </div>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}
