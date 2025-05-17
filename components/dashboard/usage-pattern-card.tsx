'use client';

import React from 'react';
import { Battery } from '../../app/types/schema';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import {
  Droplet,
  Thermometer,
  Zap,
  Cloud,
  Home,
  Timer,
  PlugZap
} from 'lucide-react';

interface UsagePatternCardProps {
  batteries: Battery[];
  isLoading: boolean;
}

export default function UsagePatternCard({ batteries, isLoading }: UsagePatternCardProps) {
  // In a real implementation, this would fetch the usage patterns from the API
  // For now, we'll generate some dummy usage patterns based on battery status
  const usagePatterns = batteries.map(battery => {
    const tempRange = battery.status === "Excellent" ? 
      { min: 20, max: 24 } : 
      battery.status === "Good" ? 
      { min: 18, max: 26 } : 
      battery.status === "Fair" ? 
      { min: 16, max: 28 } : 
      { min: 14, max: 30 };
    
    const fastChargingPct = battery.status === "Excellent" ? 
      10 : 
      battery.status === "Good" ? 
      30 : 
      battery.status === "Fair" ? 
      50 : 
      70;
      
    const chargingFrequency = battery.status === "Excellent" ? 
      2 : 
      battery.status === "Good" ? 
      4 : 
      battery.status === "Fair" ? 
      6 : 
      8;
      
    const dischargeDepth = battery.status === "Excellent" ? 
      20 : 
      battery.status === "Good" ? 
      40 : 
      battery.status === "Fair" ? 
      60 : 
      80;
      
    const usageType = battery.status === "Excellent" ? 
      "Light" : 
      battery.status === "Good" ? 
      "Moderate" : 
      battery.status === "Fair" ? 
      "Heavy" : 
      "Extreme";
      
    const environmentalConditions = 
      battery.installationLocation?.includes("Room") ? "Indoor" :
      battery.installationLocation?.includes("Center") ? "Controlled" :
      battery.installationLocation?.includes("Mobile") ? "Mixed" :
      "Outdoor";
      
    return {
      id: `pattern-${battery.id}`,
      batteryId: battery.id,
      batteryName: battery.name,
      chargingFrequency,
      dischargeDepth,
      temperatureExposure: (tempRange.min + tempRange.max) / 2,
      tempRange,
      usageType,
      environmentalConditions,
      fastChargingPercentage: fastChargingPct,
      status: battery.status
    };
  });

  // Select the first battery with the most interesting pattern
  // In a real app, this would be the selected battery or all batteries with pagination
  const selectedPattern = usagePatterns.find(p => p.status === "Fair") || 
                         usagePatterns.find(p => p.status === "Poor") || 
                         usagePatterns[0];

  // Loading state
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center">
            <div className="h-5 w-32 bg-muted/20 animate-pulse rounded"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-muted/10 animate-pulse rounded-lg"></div>
        </CardContent>
      </Card>
    );
  }

  // Get colors based on usage status
  const getStatusColors = (status: string) => {
    switch (status) {
      case "Light":
        return "text-success";
      case "Moderate":
        return "text-primary";
      case "Heavy":
        return "text-warning";
      case "Extreme":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  // Get temp range color
  const getTempColor = (temp: number) => {
    if (temp < 22) return "text-blue-400";
    if (temp < 26) return "text-green-400";
    if (temp < 30) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <Zap className="mr-2 h-5 w-5 text-primary" />
          Usage Patterns
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!selectedPattern ? (
          <div className="flex flex-col items-center justify-center h-[240px] text-center">
            <p className="text-muted-foreground mb-2">No usage data available</p>
            <p className="text-sm text-muted-foreground">Add batteries to view usage patterns</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-medium">{selectedPattern.batteryName}</h3>
              <Badge 
                variant={
                  selectedPattern.usageType === "Light" ? "success" :
                  selectedPattern.usageType === "Moderate" ? "default" :
                  selectedPattern.usageType === "Heavy" ? "warning" :
                  "destructive"
                }
                className="text-xs"
              >
                {selectedPattern.usageType} Usage
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              {/* Discharge Depth */}
              <div className="bg-muted/20 rounded-lg p-4 relative overflow-hidden">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500/20 to-transparent"
                  style={{ height: `${selectedPattern.dischargeDepth}%` }}
                ></div>
                <div className="relative z-10">
                  <Droplet className="h-8 w-8 mb-2 text-blue-400" />
                  <h4 className="text-sm font-medium">Discharge Depth</h4>
                  <div className="mt-1 flex items-baseline">
                    <span className="text-2xl font-bold">{selectedPattern.dischargeDepth}</span>
                    <span className="text-sm ml-1 text-muted-foreground">%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Average depth of discharge per cycle
                  </p>
                </div>
              </div>
              
              {/* Temperature */}
              <div className="bg-muted/20 rounded-lg p-4">
                <Thermometer className={`h-8 w-8 mb-2 ${getTempColor(selectedPattern.temperatureExposure)}`} />
                <h4 className="text-sm font-medium">Temperature Range</h4>
                <div className="mt-1 flex items-baseline">
                  <span className="text-2xl font-bold">{selectedPattern.tempRange.min}-{selectedPattern.tempRange.max}</span>
                  <span className="text-sm ml-1 text-muted-foreground">°C</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Typical operating temperature
                </p>
              </div>
              
              {/* Charging Frequency */}
              <div className="bg-muted/20 rounded-lg p-4">
                <Timer className="h-8 w-8 mb-2 text-indigo-400" />
                <h4 className="text-sm font-medium">Charging Frequency</h4>
                <div className="mt-1 flex items-baseline">
                  <span className="text-2xl font-bold">{selectedPattern.chargingFrequency}</span>
                  <span className="text-sm ml-1 text-muted-foreground">x / week</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Average number of charge cycles weekly
                </p>
              </div>
              
              {/* Fast Charging */}
              <div className="bg-muted/20 rounded-lg p-4 relative overflow-hidden">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-yellow-500/20 to-transparent"
                  style={{ height: `${selectedPattern.fastChargingPercentage}%` }}
                ></div>
                <div className="relative z-10">
                  <PlugZap className="h-8 w-8 mb-2 text-yellow-400" />
                  <h4 className="text-sm font-medium">Fast Charging</h4>
                  <div className="mt-1 flex items-baseline">
                    <span className="text-2xl font-bold">{selectedPattern.fastChargingPercentage}</span>
                    <span className="text-sm ml-1 text-muted-foreground">%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Percentage of charges using fast charging
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-4 pt-2 border-t border-muted">
              <div className="flex items-center">
                {selectedPattern.environmentalConditions === "Indoor" ? (
                  <Home className="h-4 w-4 mr-1 text-primary" />
                ) : selectedPattern.environmentalConditions === "Outdoor" ? (
                  <Cloud className="h-4 w-4 mr-1 text-primary" />
                ) : (
                  <div className="flex">
                    <Home className="h-4 w-4 mr-1 text-primary" />
                    <Cloud className="h-4 w-4 mr-1 text-primary" />
                  </div>
                )}
                <span className="text-xs text-muted-foreground">{selectedPattern.environmentalConditions} Environment</span>
              </div>
              
              {usagePatterns.length > 1 && (
                <span className="text-xs text-muted-foreground">
                  + {usagePatterns.length - 1} more batteries
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}