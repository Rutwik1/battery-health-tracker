import React from 'react';
import { useBatteryStore, Battery } from '../../store/batteryStore';

interface BatteryStatusCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

export const BatteryStatusCard: React.FC<BatteryStatusCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
  className,
}) => {
  const getTrendIcon = () => {
    if (trend === 'up') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
      );
    }
    if (trend === 'down') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      );
    }
    return null;
  };

  return (
    <div className={`bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 shadow-xl border border-purple-900/30 animate-glow ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-1">{title}</h3>
          <div className="flex items-baseline space-x-1">
            <p className="text-3xl font-bold text-white">{value}</p>
            {trendValue && (
              <span className={`text-xs font-medium ${
                trend === 'up' ? 'text-green-500' : 
                trend === 'down' ? 'text-red-500' : 
                'text-gray-400'
              }`}>
                {trendValue}
              </span>
            )}
          </div>
          {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        </div>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      {trend && (
        <div className="flex items-center space-x-1 mt-4">
          {getTrendIcon()}
          <span className={`text-xs font-medium ${
            trend === 'up' ? 'text-green-500' : 
            trend === 'down' ? 'text-red-500' : 
            'text-gray-400'
          }`}>
            {trend === 'up' ? 'Increasing' : trend === 'down' ? 'Decreasing' : 'Stable'}
          </span>
        </div>
      )}
    </div>
  );
};

interface BatteryOverviewProps {
  batteries: Battery[];
}

export const BatteryOverview: React.FC<BatteryOverviewProps> = ({ batteries }) => {
  // Calculate summary statistics
  const totalBatteries = batteries.length;
  
  const averageHealth = batteries.length 
    ? batteries.reduce((sum, b) => sum + b.healthPercentage, 0) / batteries.length 
    : 0;
    
  const criticalBatteries = batteries.filter(b => b.status === "Critical").length;
  
  const totalCycleCount = batteries.reduce((sum, b) => sum + b.cycleCount, 0);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <BatteryStatusCard
        title="Total Batteries"
        value={totalBatteries}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="6" width="18" height="12" rx="2" />
            <line x1="23" y1="13" x2="23" y2="11" />
          </svg>
        }
      />
      
      <BatteryStatusCard
        title="Average Health"
        value={`${averageHealth.toFixed(1)}%`}
        trend={averageHealth > 70 ? 'up' : averageHealth > 50 ? 'neutral' : 'down'}
        trendValue={averageHealth > 80 ? "Good" : averageHealth > 60 ? "Fair" : "Needs attention"}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        }
      />
      
      <BatteryStatusCard
        title="Critical Status"
        value={criticalBatteries}
        trend={criticalBatteries > 0 ? 'down' : 'up'}
        trendValue={criticalBatteries > 0 ? `${criticalBatteries} require attention` : "All good"}
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        }
      />
      
      <BatteryStatusCard
        title="Total Cycles"
        value={totalCycleCount}
        description="Cumulative for all batteries"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        }
      />
    </div>
  );
};