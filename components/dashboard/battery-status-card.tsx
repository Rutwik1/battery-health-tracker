'use client';

import React from 'react';
import { Battery, BatteryIcon, BatteryLow } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBatteryStatusColor, formatNumber } from "@/lib/utils";
import { Battery as BatteryType } from "@/app/types/schema";

interface BatteryStatusCardProps {
  battery: BatteryType | null;
  isLoading?: boolean;
}

export default function BatteryStatusCard({ battery, isLoading = false }: BatteryStatusCardProps) {
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center">
            <div className="h-5 w-32 bg-muted/20 animate-pulse rounded"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="h-32 w-32 bg-muted/20 animate-pulse rounded-full"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted/20 animate-pulse rounded"></div>
              <div className="h-4 w-2/3 bg-muted/20 animate-pulse rounded"></div>
              <div className="h-4 w-3/4 bg-muted/20 animate-pulse rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!battery) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center">
            <BatteryLow className="mr-2 h-5 w-5 text-muted-foreground" />
            No Battery Selected
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[280px]">
          <p className="text-muted-foreground text-center">
            Select a battery to view detailed information.
          </p>
        </CardContent>
      </Card>
    );
  }

  const statusColor = getBatteryStatusColor(battery.status);
  const healthPercentage = battery.healthPercentage;
  
  // We'll use this to calculate the gradient positions
  const healthGradient = 
    healthPercentage > 90 ? "from-success via-success to-success/50" :
    healthPercentage > 70 ? "from-primary via-primary to-primary/50" :
    healthPercentage > 50 ? "from-warning via-warning to-warning/50" :
    "from-danger via-danger to-danger/50";

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <Battery className="mr-2 h-5 w-5 text-primary" />
          Battery Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="relative w-40 h-40 flex items-center justify-center">
              {/* Background gradient circle */}
              <div className={`absolute w-full h-full rounded-full opacity-10 bg-gradient-to-tl ${healthGradient}`}></div>
              
              {/* Percentage circle with gradient border */}
              <div className="relative w-32 h-32 rounded-full flex items-center justify-center">
                <div 
                  className={`absolute inset-0 rounded-full bg-gradient-to-br ${healthGradient}`} 
                  style={{
                    clipPath: `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% ${100 - healthPercentage}%)`
                  }}
                ></div>
                <div className="absolute inset-1 rounded-full bg-card"></div>
                <div className="relative">
                  <span className="text-4xl font-bold">{healthPercentage}</span>
                  <span className="text-xl">%</span>
                  <div className={`text-sm ${statusColor}`}>{battery.status}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Capacity:</span>
              <span className="font-medium">{formatNumber(battery.currentCapacity)} / {formatNumber(battery.initialCapacity)} mAh</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Cycles:</span>
              <span className="font-medium">{battery.cycleCount} / {battery.expectedCycles}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Model:</span>
              <span className="font-medium">{battery.model || "N/A"}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Chemistry:</span>
              <span className="font-medium">{battery.chemistry || "Unknown"}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}