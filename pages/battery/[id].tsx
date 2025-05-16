import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useBatteryStore, Battery, BatteryHistory } from '../../store/batteryStore';
import { format, subDays } from 'date-fns';

// Chart component for displaying battery health history
const HealthHistoryChart: React.FC<{ history: BatteryHistory[] }> = ({ history }) => {
  const sortedHistory = [...history].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Get dimensions and scale
  const width = 100;
  const height = 50;
  const maxHealth = 100;
  
  // Generate points for the SVG path
  const points = sortedHistory.map((entry, index) => {
    const x = (index / (sortedHistory.length - 1)) * width;
    const y = height - (entry.healthPercentage / maxHealth) * height;
    return `${x},${y}`;
  }).join(' ');
  
  // Generate gradient based on health status
  const healthColor = sortedHistory[sortedHistory.length - 1]?.healthPercentage || 0;
  const gradientColor = healthColor > 80 ? "#10b981" : 
                        healthColor > 60 ? "#f59e0b" :
                        healthColor > 40 ? "#f97316" : "#ef4444";
  
  return (
    <div className="relative h-40">
      <svg 
        width="100%" 
        height="100%" 
        viewBox={`0 0 ${width} ${height}`} 
        preserveAspectRatio="none"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="healthGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={gradientColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor={gradientColor} stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        {/* Area under the line */}
        <path 
          d={`M0,${height} ${points} ${width},${height} Z`}
          fill="url(#healthGradient)"
          opacity="0.5"
        />
        
        {/* Line chart */}
        <polyline
          points={points}
          fill="none"
          stroke={gradientColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Points on the line */}
        {sortedHistory.map((entry, index) => {
          const x = (index / (sortedHistory.length - 1)) * width;
          const y = height - (entry.healthPercentage / maxHealth) * height;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="1.5"
              fill="#fff"
              stroke={gradientColor}
              strokeWidth="1"
            />
          );
        })}
      </svg>
      
      {/* X-axis labels */}
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        {sortedHistory.length > 0 && (
          <>
            <span>
              {format(new Date(sortedHistory[0].date), 'MMM d')}
            </span>
            <span>
              {format(new Date(sortedHistory[sortedHistory.length - 1].date), 'MMM d')}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

const BatteryDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const batteryId = typeof id === 'string' ? parseInt(id, 10) : null;
  
  const { 
    batteries, 
    fetchBatteries, 
    fetchBatteryHistory,
    batteryHistories,
    isLoading 
  } = useBatteryStore();
  
  const [battery, setBattery] = useState<Battery | null>(null);
  const [history, setHistory] = useState<BatteryHistory[]>([]);
  
  useEffect(() => {
    // Fetch all batteries if not already loaded
    if (batteries.length === 0) {
      fetchBatteries();
    }
    
    // Find the specific battery
    if (batteryId && batteries.length > 0) {
      const foundBattery = batteries.find(b => b.id === batteryId);
      setBattery(foundBattery || null);
      
      // Fetch battery history
      if (foundBattery) {
        // Check if we already have history or need to fetch it
        const existingHistory = batteryHistories[foundBattery.id];
        if (existingHistory) {
          setHistory(existingHistory);
        } else {
          fetchBatteryHistory(foundBattery.id).then(historyData => {
            setHistory(historyData);
          });
        }
      }
    }
  }, [batteryId, batteries, fetchBatteries, fetchBatteryHistory, batteryHistories]);
  
  // Calculate statistics
  const lifetimePercentage = battery 
    ? Math.round((battery.cycleCount / battery.expectedCycles) * 100) 
    : 0;
    
  const estimatedRemainingCycles = battery 
    ? Math.max(0, battery.expectedCycles - battery.cycleCount)
    : 0;
    
  const getHealthStatusClass = (health: number) => {
    if (health > 80) return 'text-green-400';
    if (health > 60) return 'text-yellow-400';
    if (health > 40) return 'text-orange-400';
    return 'text-red-400';
  };
  
  return (
    <>
      <Head>
        <title>{battery ? `${battery.name} Details` : 'Battery Details'} | Coulomb.ai</title>
        <meta name="description" content="Detailed battery health information and performance analytics." />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-gray-200">
        <div className="container mx-auto px-4 py-8">
          {/* Header with back navigation */}
          <div className="mb-6">
            <Link href="/dashboard">
              <a className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 mb-4">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="mr-1"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </a>
            </Link>
            <h1 className="text-2xl font-bold text-white">
              {battery?.name || 'Battery Details'}
            </h1>
            <p className="text-gray-400">{battery?.serialNumber || 'Loading...'}</p>
          </div>
          
          {isLoading || !battery ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main battery stats */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 shadow-xl border border-purple-900/30 animate-glow">
                  <h2 className="text-xl font-semibold text-white mb-4">Battery Health Status</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Health</div>
                      <div className="flex items-baseline">
                        <span className={`text-4xl font-bold ${getHealthStatusClass(battery.healthPercentage)}`}>
                          {battery.healthPercentage}%
                        </span>
                        <span className={`ml-2 text-sm ${battery.degradationRate > 1 ? 'text-red-400' : 'text-gray-400'}`}>
                          {battery.degradationRate > 0 ? `-${battery.degradationRate.toFixed(1)}% / month` : 'Stable'}
                        </span>
                      </div>
                      <div className="w-full h-3 bg-gray-800 rounded-full mt-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            battery.healthPercentage > 80 ? 'bg-green-500' :
                            battery.healthPercentage > 60 ? 'bg-yellow-500' :
                            battery.healthPercentage > 40 ? 'bg-orange-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${battery.healthPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Cycle Count</div>
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-white">{battery.cycleCount}</span>
                        <span className="ml-2 text-sm text-gray-400">/ {battery.expectedCycles}</span>
                      </div>
                      <div className="w-full h-3 bg-gray-800 rounded-full mt-2 overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-blue-500"
                          style={{ width: `${lifetimePercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="text-sm text-gray-400 mb-2">Health History</div>
                    <HealthHistoryChart history={history} />
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 shadow-xl border border-purple-900/30 animate-glow">
                  <h2 className="text-xl font-semibold text-white mb-4">Battery Specifications</h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-gray-400">Capacity</div>
                      <div className="text-lg font-medium text-white">{battery.currentCapacity} mAh</div>
                      <div className="text-xs text-gray-500">
                        of {battery.initialCapacity} mAh
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-400">Status</div>
                      <div className={`text-lg font-medium ${getHealthStatusClass(battery.healthPercentage)}`}>
                        {battery.status}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-400">Installation Date</div>
                      <div className="text-lg font-medium text-white">
                        {format(new Date(battery.initialDate), 'MMM d, yyyy')}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-400">Last Updated</div>
                      <div className="text-lg font-medium text-white">
                        {format(new Date(battery.lastUpdated), 'MMM d, yyyy')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Sidebar with additional info */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 shadow-xl border border-purple-900/30 animate-glow">
                  <h2 className="text-xl font-semibold text-white mb-4">Performance Analysis</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Estimated Life Remaining</div>
                      <div className="flex items-baseline">
                        <span className="text-2xl font-bold text-white">{estimatedRemainingCycles}</span>
                        <span className="ml-2 text-sm text-gray-400">cycles</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Lifetime Used</div>
                      <div className="flex items-baseline">
                        <span className="text-2xl font-bold text-white">{lifetimePercentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-800 rounded-full mt-1 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            lifetimePercentage > 90 ? 'bg-red-500' :
                            lifetimePercentage > 70 ? 'bg-orange-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${lifetimePercentage}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Degradation Rate</div>
                      <div className="flex items-baseline">
                        <span className={`text-2xl font-bold ${
                          battery.degradationRate > 1.0 ? 'text-red-400' :
                          battery.degradationRate > 0.5 ? 'text-orange-400' :
                          'text-green-400'
                        }`}>
                          {battery.degradationRate.toFixed(1)}%
                        </span>
                        <span className="ml-2 text-sm text-gray-400">/ month</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 shadow-xl border border-purple-900/30 animate-glow">
                  <h2 className="text-xl font-semibold text-white mb-4">Recommendations</h2>
                  
                  {battery.healthPercentage < 40 ? (
                    <div className="p-3 bg-red-900/30 border border-red-900/50 rounded-lg mb-3">
                      <div className="font-medium text-red-400">Critical: Replace Battery</div>
                      <div className="text-sm text-gray-300 mt-1">
                        Battery health is critically low at {battery.healthPercentage}%. 
                        Performance and reliability are severely compromised.
                      </div>
                    </div>
                  ) : battery.healthPercentage < 70 ? (
                    <div className="p-3 bg-orange-900/30 border border-orange-900/50 rounded-lg mb-3">
                      <div className="font-medium text-orange-400">Warning: Plan Replacement</div>
                      <div className="text-sm text-gray-300 mt-1">
                        Battery health is at {battery.healthPercentage}%. Plan for replacement 
                        within the next few months to avoid unexpected failures.
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-green-900/30 border border-green-900/50 rounded-lg mb-3">
                      <div className="font-medium text-green-400">Good Condition</div>
                      <div className="text-sm text-gray-300 mt-1">
                        Battery is healthy at {battery.healthPercentage}%. 
                        Continue regular monitoring.
                      </div>
                    </div>
                  )}
                  
                  {battery.cycleCount > battery.expectedCycles * 0.8 && (
                    <div className="p-3 bg-yellow-900/30 border border-yellow-900/50 rounded-lg">
                      <div className="font-medium text-yellow-400">Approaching End of Cycle Life</div>
                      <div className="text-sm text-gray-300 mt-1">
                        Battery has used {lifetimePercentage}% of its expected cycle life.
                        Consider budgeting for future replacement.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BatteryDetailPage;