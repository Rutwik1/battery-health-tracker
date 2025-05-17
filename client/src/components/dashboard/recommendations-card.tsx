import { Battery, Recommendation } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { LightbulbIcon, ArrowRightIcon, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";

interface RecommendationsCardProps {
  batteries: Battery[];
  isLoading: boolean;
}

export default function RecommendationsCard({ batteries, isLoading }: RecommendationsCardProps) {
  // Get recommendations for the first battery
  const batteryId = batteries.length > 0 ? batteries[0].id : 0;
  
  const { data: recommendations, isLoading: recommendationsLoading } = useQuery<Recommendation[]>({
    queryKey: [`/api/batteries/${batteryId}/recommendations`],
    enabled: batteryId > 0
  });
  
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
          {[...Array(4)].map((_, i) => (
            <li key={i} className="h-12 bg-muted/20 animate-pulse rounded-lg"></li>
          ))}
        </ul>
      ) : (
        <ul className="space-y-3">
          {/* Dynamic recommendations from API only - removed hardcoded recommendations */}
          
          {/* Dynamic recommendations from API */}
          {recommendations.slice(0, 3).map((recommendation) => {
            const { icon, bgColor, textColor, borderColor } = getRecommendationStyle(recommendation.type);
            
            return (
              <li 
                key={recommendation.id} 
                className={`flex p-3 rounded-lg ${bgColor} border ${borderColor} backdrop-blur-sm transition-transform duration-200 hover:scale-[1.02] cursor-pointer`}
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
