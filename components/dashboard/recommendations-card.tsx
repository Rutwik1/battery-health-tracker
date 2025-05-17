'use client';

import React from 'react';
import { Lightbulb, CheckCircle, AlertTriangle, BatteryWarning, Wrench, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Battery } from '../../app/types/schema';
import { formatDate } from '../../lib/utils';

interface RecommendationsCardProps {
  batteries: Battery[];
  isLoading: boolean;
}

export default function RecommendationsCard({ batteries, isLoading }: RecommendationsCardProps) {
  // In a real implementation, this would fetch the recommendations from an API
  // Generate some mock recommendations based on battery data
  const recommendations = batteries.flatMap(battery => {
    const recommendations = [];
    
    // Replacement recommendation for batteries with low health
    if (battery.healthPercentage < 50) {
      recommendations.push({
        id: `replace-${battery.id}`,
        batteryId: battery.id,
        type: "Replacement",
        message: `Battery "${battery.name}" health is at ${battery.healthPercentage}%, consider replacing soon.`,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        resolved: false,
        batteryName: battery.name
      });
    }
    
    // Maintenance recommendation based on cycle count
    if (battery.cycleCount > 0.8 * battery.expectedCycles) {
      recommendations.push({
        id: `cycles-${battery.id}`,
        batteryId: battery.id,
        type: "Maintenance",
        message: `Battery "${battery.name}" has completed ${battery.cycleCount} of ${battery.expectedCycles} expected cycles.`,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        resolved: false,
        batteryName: battery.name
      });
    }
    
    // Usage recommendation for batteries with high degradation rate
    if (battery.degradationRate > 0.8) {
      recommendations.push({
        id: `usage-${battery.id}`,
        batteryId: battery.id,
        type: "Usage",
        message: `Battery "${battery.name}" is degrading faster than expected (${battery.degradationRate.toFixed(1)}% per month).`,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        resolved: false,
        batteryName: battery.name
      });
    }
    
    return recommendations;
  });
  
  // Sort recommendations by priority (unresolved first) then by date (newest first)
  const sortedRecommendations = [...recommendations].sort((a, b) => {
    if (a.resolved !== b.resolved) {
      return a.resolved ? 1 : -1;  // Unresolved first
    }
    return b.createdAt.getTime() - a.createdAt.getTime();  // Newest first
  });

  // Calculate some stats
  const totalRecommendations = recommendations.length;
  const unresolvedRecommendations = recommendations.filter(r => !r.resolved).length;
  
  // Loading state
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center">
            <div className="h-5 w-40 bg-muted/20 animate-pulse rounded"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-8 bg-muted/20 animate-pulse rounded"></div>
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="p-3 bg-muted/10 animate-pulse rounded-lg"></div>
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
          <Lightbulb className="mr-2 h-5 w-5 text-primary" />
          Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary stats */}
          {batteries.length === 0 ? (
            <div className="border rounded-md p-4 text-center">
              <p className="text-sm text-muted-foreground">Add batteries to see recommendations</p>
            </div>
          ) : totalRecommendations === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto h-12 w-12 text-success mb-2 opacity-80" />
              <h3 className="text-lg font-medium">All batteries healthy</h3>
              <p className="text-sm text-muted-foreground mt-1">
                No recommendations at this time
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Active Recommendations</p>
                  <p className="text-xs text-muted-foreground">
                    {unresolvedRecommendations} of {totalRecommendations} remaining
                  </p>
                </div>
                <div className="text-2xl font-bold">
                  {unresolvedRecommendations}
                </div>
              </div>
              
              <div className="space-y-3">
                {sortedRecommendations.slice(0, 5).map((recommendation) => (
                  <div
                    key={recommendation.id}
                    className={`relative p-3 rounded-lg border ${
                      recommendation.resolved ? 'bg-muted/10 opacity-70' : 'bg-muted/20'
                    }`}
                  >
                    {recommendation.resolved && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                      </div>
                    )}
                    <div className="flex items-start space-x-3">
                      <div>
                        {recommendation.type === "Replacement" ? (
                          <BatteryWarning className="h-5 w-5 text-destructive" />
                        ) : recommendation.type === "Maintenance" ? (
                          <Wrench className="h-5 w-5 text-warning" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {recommendation.type === "Replacement" ? "Replace Battery" :
                           recommendation.type === "Maintenance" ? "Perform Maintenance" :
                           "Usage Optimization"}
                        </p>
                        <p className="text-xs mt-1">
                          {recommendation.message}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-xs text-muted-foreground">
                            {recommendation.batteryName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(recommendation.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {sortedRecommendations.length > 5 && (
                  <p className="text-center text-xs text-muted-foreground">
                    + {sortedRecommendations.length - 5} more recommendations
                  </p>
                )}
              </div>
            </>
          )}
          
          {/* Schedule tip */}
          <div className="mt-4 text-xs text-muted-foreground border-t pt-2">
            <div className="flex items-center">
              <RotateCcw className="h-3 w-3 mr-1" />
              <span>Recommendations are updated daily based on battery telemetry</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}