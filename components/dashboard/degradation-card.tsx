'use client';

import React from 'react';
import { Battery, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import { Battery as BatteryType } from '../../app/types/schema';
import { formatNumber } from '../../lib/utils';

interface DegradationCardProps {
  batteries: BatteryType[];
  isLoading: boolean;
}

export default function DegradationCard({ batteries, isLoading }: DegradationCardProps) {
  // Sort batteries by degradation rate (highest first)
  const sortedBatteries = [...batteries].sort((a, b) => 
    b.degradationRate - a.degradationRate
  ).slice(0, 5); // Take top 5 highest degradation rates

  // Calculate averages
  const avgDegradationRate = batteries.length > 0 
    ? batteries.reduce((sum, battery) => sum + battery.degradationRate, 0) / batteries.length
    : 0;

  // Calculate threshold for concerning degradation (above 0.8% per month)
  const concerningThreshold = 0.8;
  const concerningCount = batteries.filter(b => b.degradationRate > concerningThreshold).length;
  
  // Loading state
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center">
            <div className="h-5 w-48 bg-muted/20 animate-pulse rounded"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-8 bg-muted/20 animate-pulse rounded"></div>
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 bg-muted/20 animate-pulse rounded"></div>
                <div className="h-4 bg-muted/10 animate-pulse rounded-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <TrendingDown className="mr-2 h-5 w-5 text-primary" />
          Degradation Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall summary */}
          <div className="border-b pb-4">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-sm font-medium">Average Degradation Rate</h3>
              <Badge variant={avgDegradationRate > concerningThreshold ? "warning" : "success"}>
                {avgDegradationRate.toFixed(2)}% / month
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              {concerningCount > 0 ? (
                <span>{concerningCount} batteries showing concerning degradation rates</span>
              ) : (
                <span>All batteries showing normal degradation rates</span>
              )}
            </p>
            <Progress 
              value={Math.min(100, avgDegradationRate * 50)} 
              className="h-2" 
              indicator={avgDegradationRate > concerningThreshold ? "bg-warning" : "bg-success"}
            />
          </div>
          
          {/* Individual batteries with highest degradation */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Batteries with Highest Degradation</h3>
            
            {sortedBatteries.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">No battery data available</p>
              </div>
            ) : (
              sortedBatteries.map((battery) => (
                <div key={battery.id} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Battery className="h-4 w-4 mr-1 text-primary" />
                      <span className="text-sm">{battery.name}</span>
                    </div>
                    <span className="text-sm font-medium">{battery.degradationRate.toFixed(2)}% / month</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Initial: {formatNumber(battery.initialCapacity)} mAh</span>
                    <span>Current: {formatNumber(battery.currentCapacity)} mAh</span>
                  </div>
                  <Progress 
                    value={Math.min(100, battery.degradationRate * 50)} 
                    className="h-1.5" 
                    indicator={battery.degradationRate > concerningThreshold ? "bg-warning" : "bg-success"}
                  />
                </div>
              ))
            )}
          </div>
          
          {/* Tip at bottom */}
          <div className="mt-auto pt-2 text-xs text-muted-foreground border-t">
            <p>
              <span className="font-medium">Tip:</span> Normal battery degradation is typically 0.5-0.8% per month.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}