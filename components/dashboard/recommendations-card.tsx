'use client';

import React from 'react';
import { Battery } from '../../app/types/schema';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { formatDate } from '../../lib/utils';
import { AlertTriangle, CheckCircle2, Wrench } from 'lucide-react';

interface RecommendationsCardProps {
  batteries: Battery[];
  isLoading: boolean;
}

export default function RecommendationsCard({ batteries, isLoading }: RecommendationsCardProps) {
  // In a real implementation, this would fetch the recommendations from the API
  // For now, we'll generate some dummy recommendations based on battery status
  const recommendations = batteries.flatMap(battery => {
    const recs = [];
    
    // Generate recommendations based on battery health
    if (battery.healthPercentage < 50) {
      recs.push({
        id: `rec-${battery.id}-1`,
        batteryId: battery.id,
        type: "Replacement",
        message: `${battery.name} health below 50%. Schedule replacement within the next 30 days.`,
        createdAt: new Date(new Date().setDate(new Date().getDate() - 5)),
        resolved: false,
        batteryName: battery.name
      });
    }
    
    if (battery.cycleCount > battery.expectedCycles * 0.7) {
      recs.push({
        id: `rec-${battery.id}-2`,
        batteryId: battery.id,
        type: "Maintenance",
        message: `${battery.name} approaching end of cycle life. Consider testing under load to verify capacity.`,
        createdAt: new Date(new Date().setDate(new Date().getDate() - 15)),
        resolved: battery.id !== 3,
        batteryName: battery.name
      });
    }
    
    // For batteries in "Fair" condition, add a usage recommendation
    if (battery.status === "Fair") {
      recs.push({
        id: `rec-${battery.id}-3`,
        batteryId: battery.id,
        type: "Usage",
        message: `Consider adjusting charging pattern for ${battery.name} to avoid deep discharges.`,
        createdAt: new Date(new Date().setDate(new Date().getDate() - 20)),
        resolved: false,
        batteryName: battery.name
      });
    }
    
    return recs;
  });
  
  // Sort recommendations by creation date (newest first) and unresolved first
  const sortedRecommendations = [...recommendations].sort((a, b) => {
    // Unresolved recommendations first
    if (a.resolved !== b.resolved) {
      return a.resolved ? 1 : -1;
    }
    // Then sort by date (newest first)
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
  
  // Function to get icon based on recommendation type
  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case "Replacement":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "Maintenance":
        return <Wrench className="h-4 w-4 text-warning" />;
      case "Usage":
        return <CheckCircle2 className="h-4 w-4 text-primary" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  // Function to get badge color based on recommendation type
  const getRecommendationBadgeColor = (type: string) => {
    switch (type) {
      case "Replacement":
        return "destructive";
      case "Maintenance":
        return "warning";
      case "Usage":
        return "default";
      default:
        return "secondary";
    }
  };

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
              <div key={i} className="space-y-2 p-3 rounded-lg bg-muted/10 animate-pulse">
                <div className="flex justify-between items-center">
                  <div className="h-4 w-28 bg-muted/20 animate-pulse rounded"></div>
                  <div className="h-4 w-16 bg-muted/20 animate-pulse rounded"></div>
                </div>
                <div className="h-3 w-full bg-muted/20 animate-pulse rounded"></div>
                <div className="h-3 w-2/3 bg-muted/20 animate-pulse rounded"></div>
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
          <AlertTriangle className="mr-2 h-5 w-5 text-primary" />
          Maintenance Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedRecommendations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[240px] text-center">
            <p className="text-muted-foreground mb-2">No recommendations available</p>
            <p className="text-sm text-muted-foreground">All batteries are performing optimally</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
            {sortedRecommendations.map((recommendation) => (
              <div 
                key={recommendation.id} 
                className={`p-3 rounded-lg ${
                  recommendation.resolved 
                    ? 'bg-muted/10 opacity-70' 
                    : 'bg-muted/20 border-l-4 border-primary'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center">
                    {getRecommendationIcon(recommendation.type)}
                    <Badge 
                      variant={getRecommendationBadgeColor(recommendation.type) as any} 
                      className="ml-2 text-xs"
                    >
                      {recommendation.type}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatDate(recommendation.createdAt)}
                  </div>
                </div>
                <p className="text-sm mb-1">{recommendation.message}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground">
                    Battery: {recommendation.batteryName}
                  </span>
                  {recommendation.resolved && (
                    <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">
                      Resolved
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}