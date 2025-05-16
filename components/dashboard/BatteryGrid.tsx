import React from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Battery } from '../../store/batteryStore';

interface BatteryGridProps {
  batteries: Battery[];
  isLoading: boolean;
}

const getStatusClass = (status: string) => {
  switch(status) {
    case 'Good': return 'bg-green-900/30 text-green-400';
    case 'Fair': return 'bg-yellow-900/30 text-yellow-400';
    case 'Poor': return 'bg-orange-900/30 text-orange-400';
    case 'Critical': return 'bg-red-900/30 text-red-400';
    default: return 'bg-blue-900/30 text-blue-400';
  }
};

const getHealthColor = (health: number) => {
  if (health > 80) return 'bg-green-500';
  if (health > 60) return 'bg-yellow-500';
  if (health > 40) return 'bg-orange-500';
  return 'bg-red-500';
};

const BatteryCard = ({ battery }: { battery: Battery }) => {
  // Format the last updated time using date-fns
  const lastUpdatedText = formatDistanceToNow(
    new Date(battery.lastUpdated), 
    { addSuffix: true }
  );
  
  // Calculate cycle percentage
  const cyclePercentage = Math.min(100, Math.round((battery.cycleCount / battery.expectedCycles) * 100));
  
  return (
    <div className="battery-card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{battery.name}</h3>
          <p className="text-sm text-gray-400">{battery.serialNumber}</p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClass(battery.status)}`}>
          {battery.status}
        </span>
      </div>
      
      <div className="space-y-5">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-300">Health</span>
            <span className="text-sm font-medium text-gray-300">{battery.healthPercentage}%</span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full">
            <div 
              className={`h-full rounded-full ${getHealthColor(battery.healthPercentage)}`}
              style={{ width: `${battery.healthPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-300">Cycles</span>
            <span className="text-sm font-medium text-gray-300">{battery.cycleCount} of {battery.expectedCycles}</span>
          </div>
          <div className="w-full h-2 bg-gray-800 rounded-full">
            <div 
              className="h-full rounded-full bg-blue-500"
              style={{ width: `${cyclePercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-gray-400">Capacity</span>
            <p className="text-white font-medium">{battery.currentCapacity} mAh</p>
          </div>
          <div>
            <span className="text-xs text-gray-400">Rate</span>
            <p className="text-white font-medium">-{battery.degradationRate}%/mo</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-800">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Updated {lastUpdatedText}</span>
          <Link href={`/battery/${battery.id}`}>
            <a className="text-xs text-purple-400 hover:text-purple-300">View Details</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

const LoadingCard = () => (
  <div className="battery-card animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div>
        <div className="h-6 w-32 bg-gray-800 rounded mb-2"></div>
        <div className="h-4 w-24 bg-gray-800 rounded"></div>
      </div>
      <div className="px-2.5 py-1 rounded-full bg-gray-800 h-6 w-16"></div>
    </div>
    
    <div className="space-y-5">
      <div>
        <div className="flex justify-between mb-1">
          <div className="h-4 w-16 bg-gray-800 rounded"></div>
          <div className="h-4 w-12 bg-gray-800 rounded"></div>
        </div>
        <div className="w-full h-2 bg-gray-800 rounded-full"></div>
      </div>
      
      <div>
        <div className="flex justify-between mb-1">
          <div className="h-4 w-16 bg-gray-800 rounded"></div>
          <div className="h-4 w-20 bg-gray-800 rounded"></div>
        </div>
        <div className="w-full h-2 bg-gray-800 rounded-full"></div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="h-4 w-16 bg-gray-800 rounded mb-1"></div>
          <div className="h-5 w-20 bg-gray-800 rounded"></div>
        </div>
        <div>
          <div className="h-4 w-12 bg-gray-800 rounded mb-1"></div>
          <div className="h-5 w-14 bg-gray-800 rounded"></div>
        </div>
      </div>
    </div>
    
    <div className="mt-4 pt-3 border-t border-gray-800">
      <div className="flex justify-between items-center">
        <div className="h-4 w-28 bg-gray-800 rounded"></div>
        <div className="h-4 w-20 bg-gray-800 rounded"></div>
      </div>
    </div>
  </div>
);

export default function BatteryGrid({ batteries, isLoading }: BatteryGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <LoadingCard key={i} />
        ))}
      </div>
    );
  }
  
  if (batteries.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-10 text-center border border-purple-900/30">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="text-xl font-medium text-gray-400 mb-2">No Batteries Found</h3>
        <p className="text-gray-500 mb-6">Add your first battery to start monitoring battery health.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {batteries.map(battery => (
        <BatteryCard key={battery.id} battery={battery} />
      ))}
    </div>
  );
}