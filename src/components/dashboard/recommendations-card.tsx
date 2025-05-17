"use client";

import { useState, useEffect } from "react";
import { Recommendation } from "@/lib/db/schema";
import { formatDate, getRecommendationColor } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, AlertCircle, InfoIcon, WrenchIcon } from "lucide-react";

export default function RecommendationsCard() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch recommendations for all batteries
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const batResponse = await fetch('/api/batteries');
        if (!batResponse.ok) {
          throw new Error('Failed to fetch batteries');
        }
        
        const batteries = await batResponse.json();
        
        // Fetch recommendations for each battery
        const recommendationsPromises = batteries.map((battery: any) => 
          fetch(`/api/batteries/${battery.id}/recommendations`)
            .then(res => res.json())
            .catch(err => {
              console.error(`Error fetching recommendations for battery ${battery.id}:`, err);
              return [];
            })
        );
        
        const recommendationsArrays = await Promise.all(recommendationsPromises);
        
        // Flatten the arrays and sort by creation date (newest first)
        const allRecommendations = recommendationsArrays
          .flat()
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setRecommendations(allRecommendations);
      } catch (err) {
        setError('Error loading recommendations');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const handleResolve = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/recommendations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resolved: !currentStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update recommendation');
      }
      
      // Update local state
      setRecommendations(prev => 
        prev.map(rec => 
          rec.id === id 
            ? { ...rec, resolved: !currentStatus } 
            : rec
        )
      );
    } catch (err) {
      console.error('Error updating recommendation:', err);
    }
  };

  // Get icon based on recommendation type
  const getRecommendationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'info':
        return <InfoIcon className="h-5 w-5 text-secondary" />;
      case 'maintenance':
        return <WrenchIcon className="h-5 w-5 text-primary" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-warning" />;
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-danger" />;
      default:
        return <InfoIcon className="h-5 w-5 text-muted-foreground" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 text-danger">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 text-sm underline hover:text-danger/80"
        >
          Try again
        </button>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="text-center p-6 text-muted-foreground">
        <p>No recommendations at this time</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
      {recommendations.map((rec) => (
        <div 
          key={rec.id} 
          className={`p-4 border rounded-xl flex items-start gap-3 ${
            rec.resolved 
              ? 'bg-muted/20 border-border/30'
              : 'bg-gradient-dark border-border/50'
          }`}
        >
          <div className="flex-shrink-0 mt-1">
            {getRecommendationIcon(rec.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className={`text-xs font-medium ${getRecommendationColor(rec.type)}`}>
                {rec.type.toUpperCase()}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDate(rec.createdAt as string, "MMM d")}
              </p>
            </div>
            
            <p className={`mt-1 ${rec.resolved ? 'text-muted-foreground' : ''}`}>
              {rec.message}
            </p>
          </div>
          
          <button
            onClick={() => handleResolve(rec.id, rec.resolved)}
            className={`flex-shrink-0 p-1.5 rounded-full transition-colors ${
              rec.resolved
                ? 'text-success bg-success/10 hover:bg-success/20'
                : 'text-muted-foreground bg-muted/20 hover:bg-muted/30'
            }`}
            title={rec.resolved ? "Mark as unresolved" : "Mark as resolved"}
          >
            <CheckCircle className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}