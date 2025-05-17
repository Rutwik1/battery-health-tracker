'use client';

import React from 'react';
import { Battery } from '../../app/types/schema';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import { formatNumber } from '../../lib/utils';
import { TrendingDown } from 'lucide-react';

interface DegradationCardProps {
  batteries: Battery[];
  isLoading: boolean;
}

export default function DegradationCard({ batteries, isLoading }: DegradationCardProps) {
  // Get batteries sorted by degradation rate (highest first)
  const sortedBatteries = [...batteries].sort((a, b) => b.degradationRate - a.degradationRate);
  
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
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="h-4 w-28 bg-muted/20 animate-pulse rounded"></div>
                  <div className="h-4 w-16 bg-muted/20 animate-pulse rounded"></div>
                </div>
                <div className="h-2 w-full bg-muted/20 animate-pulse rounded-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate the maximum degradation rate for scaling the progress bars
  const maxDegradation = Math.max(...batteries.map(b => b.degradationRate), 2);
  
  // Function to get color based on degradation rate
  const getDegradationColor = (rate: number) => {
    if (rate < 0.5) return "bg-success text-success-foreground";
    if (rate < 1.0) return "bg-primary text-primary-foreground";
    if (rate < 1.5) return "bg-warning text-warning-foreground";
    return "bg-destructive text-destructive-foreground";
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <TrendingDown className="mr-2 h-5 w-5 text-primary" />
          Degradation Rates
        </CardTitle>
      </CardHeader>
      <CardContent>
        {batteries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[240px] text-center">
            <p className="text-muted-foreground mb-2">No degradation data available</p>
            <p className="text-sm text-muted-foreground">Add batteries to view degradation rates</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedBatteries.slice(0, 5).map(battery => (
              <div key={battery.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="font-medium text-sm mr-2 truncate max-w-[180px]">{battery.name}</span>
                    <Badge 
                      variant="outline" 
                      className={`${getDegradationColor(battery.degradationRate)} text-xs`}
                    >
                      {battery.degradationRate.toFixed(1)}%/month
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatNumber(battery.currentCapacity)} mAh
                  </span>
                </div>
                <div className="relative pt-1">
                  <Progress 
                    value={(battery.degradationRate / maxDegradation) * 100} 
                    className="h-2"
                    indicatorClassName={
                      battery.degradationRate < 0.5 ? "bg-gradient-to-r from-success to-success/70" :
                      battery.degradationRate < 1.0 ? "bg-gradient-to-r from-primary to-primary/70" :
                      battery.degradationRate < 1.5 ? "bg-gradient-to-r from-warning to-warning/70" :
                      "bg-gradient-to-r from-destructive to-destructive/70"
                    }
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Initial: {formatNumber(battery.initialCapacity)} mAh</span>
                  <span>Lost: {formatNumber(battery.initialCapacity - battery.currentCapacity)} mAh</span>
                </div>
              </div>
            ))}
            
            {sortedBatteries.length > 5 && (
              <div className="text-center text-sm text-muted-foreground pt-2">
                + {sortedBatteries.length - 5} more batteries
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}