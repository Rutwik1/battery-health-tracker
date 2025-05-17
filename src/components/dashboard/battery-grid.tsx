"use client";

import { useState, useEffect } from "react";
import { Battery } from "@/lib/db/schema";
import { formatDate, getHealthColor, getStatusColor } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import BatteryIcon from "@/components/ui/battery-icon";
import Link from "next/link";

export default function BatteryGrid() {
  const [batteries, setBatteries] = useState<Battery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBatteries = async () => {
      try {
        const response = await fetch('/api/batteries');
        if (!response.ok) {
          throw new Error('Failed to fetch batteries');
        }
        const data = await response.json();
        setBatteries(data);
      } catch (err) {
        setError('Error loading battery data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBatteries();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-36 rounded-xl" />
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {batteries.map((battery) => (
        <Link 
          href={`/dashboard/batteries/${battery.id}`} 
          key={battery.id}
          className="block hover:scale-[1.02] transition-transform"
        >
          <div className="relative p-4 bg-gradient-dark backdrop-blur-md rounded-xl border border-border/50 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{battery.name}</h3>
                <p className="text-xs text-muted-foreground">{battery.serialNumber}</p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(battery.status)}`}>
                {battery.status.charAt(0).toUpperCase() + battery.status.slice(1)}
              </div>
            </div>
            
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-muted-foreground">Health</p>
                <p className={`font-medium ${getHealthColor(Number(battery.currentHealth))}`}>
                  {battery.currentHealth}%
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Type</p>
                <p className="font-medium">{battery.type}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Cycles</p>
                <p className="font-medium">{battery.cycleCount}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Last Charged</p>
                <p className="font-medium">{formatDate(battery.lastCharged as string, "MMM d")}</p>
              </div>
            </div>
            
            <div className="absolute bottom-3 right-3">
              <BatteryIcon 
                percentage={Number(battery.currentHealth)} 
                status={battery.status} 
              />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}