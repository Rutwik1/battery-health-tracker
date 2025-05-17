import { Battery, Recommendation } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { LightbulbIcon, ArrowRightIcon, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { useState, useEffect } from "react";

interface RecommendationsCardProps {
  batteries: Battery[];
  isLoading: boolean;
}

export default function RecommendationsCard({ batteries, isLoading }: RecommendationsCardProps) {
  // Get recommendations for the first battery
  const batteryId = batteries.length > 0 ? batteries[0].id : 0;
  
  // State for fixed recommendations
  const [fixedRecommendations, setFixedRecommendations] = useState<Recommendation[]>([]);
  // State for the dynamic recommendation
  const [dynamicRecommendation, setDynamicRecommendation] = useState<Recommendation | null>(null);
  
  const { data: recommendations, isLoading: recommendationsLoading } = useQuery<Recommendation[]>({
    queryKey: [`/api/batteries/${batteryId}/recommendations`],
    enabled: batteryId > 0
  });
  
  // Setup fixed and dynamic recommendations
  useEffect(() => {
    if (recommendations && recommendations.length > 0) {
      // Set two fixed recommendations that don't change
      const fixedRecs = recommendations.slice(0, 2);
      setFixedRecommendations(fixedRecs);
      
      // Get the latest recommendation as the dynamic one that changes
      if (recommendations.length > 2) {
        setDynamicRecommendation(recommendations[recommendations.length - 1]);
      }
    }
  }, [recommendations]);
  
  const loading = isLoading || recommendationsLoading || !recommendations;

  // Helper function to get icon and color based on recommendation type
  const getRecommendationStyle = (type: string) => {
    switch (type) {
      case 'success':
        return { 
          icon: <CheckCircle2 className="h-4 w-4" />, 
          bgColor: 'bg-success/10', 
          textColor: 'text-success',
          borderColor: 'border-success/20' 
        };
      case 'error':
        return { 
          icon: <AlertCircle className="h-4 w-4" />, 
          bgColor: 'bg-danger/10', 
          textColor: 'text-danger',
          borderColor: 'border-danger/20'  
        };
      case 'warning':
        return { 
          icon: <AlertTriangle className="h-4 w-4" />, 
          bgColor: 'bg-warning/10', 
          textColor: 'text-warning',
          borderColor: 'border-warning/20'  
        };
      case 'info':
      default:
        return { 
          icon: <Info className="h-4 w-4" />, 
          bgColor: 'bg-primary/10', 
          textColor: 'text-primary',
          borderColor: 'border-primary/20'  
        };
    }
  };

  return (
    <div className="p-6">
      <div className="mb-5 flex items-center">
        <LightbulbIcon className="h-5 w-5 mr-2 text-accent" />
        <h2 className="text-lg font-heading font-semibold">
          Smart Recommendations
        </h2>
      </div>
      
      {loading ? (
        <ul className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <li key={i} className="h-12 bg-muted/20 animate-pulse rounded-lg"></li>
          ))}
        </ul>
      ) : (
        <ul className="space-y-3">
          {/* Fixed recommendations that don't change */}
          {fixedRecommendations.map((recommendation) => {
            const { icon, bgColor, textColor, borderColor } = getRecommendationStyle(recommendation.type);
            
            return (
              <li 
                key={recommendation.id} 
                className={`flex p-3 rounded-lg ${bgColor} border ${borderColor} backdrop-blur-sm cursor-pointer`}
              >
                <div className="flex-shrink-0">
                  <div className={`flex items-center justify-center h-7 w-7 rounded-full bg-card/50 ${textColor}`}>
                    {icon}
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm">{recommendation.message}</p>
                </div>
              </li>
            );
          })}
          
          {/* Single dynamic recommendation that updates in real-time */}
          {dynamicRecommendation && (
            <li 
              key={dynamicRecommendation.id} 
              className={`flex p-3 rounded-lg ${getRecommendationStyle(dynamicRecommendation.type).bgColor} 
                border ${getRecommendationStyle(dynamicRecommendation.type).borderColor} 
                backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] 
                animate-pulse-subtle cursor-pointer relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer pointer-events-none"></div>
              <div className="flex-shrink-0">
                <div className={`flex items-center justify-center h-7 w-7 rounded-full bg-card/50 ${getRecommendationStyle(dynamicRecommendation.type).textColor}`}>
                  {getRecommendationStyle(dynamicRecommendation.type).icon}
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm">{dynamicRecommendation.message}</p>
              </div>
            </li>
          )}
        </ul>
      )}
      
      <div className="mt-6 pt-4 border-t border-border/30">
        <a href="#" className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/90 transition-colors">
          View all recommendations 
          <ArrowRightIcon className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>
    </div>
  );
}
