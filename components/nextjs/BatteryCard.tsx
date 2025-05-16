import React from 'react';
import { Battery } from '../../store/batteryStore';
import { formatDistanceToNow } from 'date-fns';

interface BatteryCardProps {
  battery: Battery;
}

const getStatusColor = (status: string) => {
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

export default function BatteryCard({ battery }: BatteryCardProps) {
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
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(battery.status)}`}>
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
            <span className="text-xs text-gray-400">Status</span>
            <p className="text-white font-medium">{battery.status}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-800">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Updated {lastUpdatedText}</span>
          <button className="text-xs text-purple-400 hover:text-purple-300">View Details</button>
        </div>
      </div>
    </div>
  );
}