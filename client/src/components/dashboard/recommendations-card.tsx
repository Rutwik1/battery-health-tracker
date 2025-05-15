import { Card, CardContent } from "@/components/ui/card";
import { Battery, Recommendation } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

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
        return { icon: 'ri-check-line', bgColor: 'bg-green-100', textColor: 'text-success' };
      case 'error':
        return { icon: 'ri-alert-line', bgColor: 'bg-red-100', textColor: 'text-danger' };
      case 'warning':
        return { icon: 'ri-error-warning-line', bgColor: 'bg-yellow-100', textColor: 'text-warning' };
      case 'info':
      default:
        return { icon: 'ri-information-line', bgColor: 'bg-blue-100', textColor: 'text-primary' };
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-heading font-semibold text-neutral mb-4">
          Recommendations
        </h2>
        
        {loading ? (
          <ul className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <li key={i} className="h-12 bg-gray-100 animate-pulse rounded-md"></li>
            ))}
          </ul>
        ) : (
          <ul className="space-y-4">
            {recommendations.map((recommendation) => {
              const { icon, bgColor, textColor } = getRecommendationStyle(recommendation.type);
              
              return (
                <li key={recommendation.id} className="flex">
                  <div className="flex-shrink-0">
                    <div className={`flex items-center justify-center h-8 w-8 rounded-full ${bgColor} ${textColor}`}>
                      <i className={icon}></i>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-neutral">{recommendation.message}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        
        <div className="mt-6 pt-4 border-t">
          <a href="#" className="text-sm font-medium text-primary hover:text-blue-700">
            View all recommendations <i className="ri-arrow-right-line ml-1"></i>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
