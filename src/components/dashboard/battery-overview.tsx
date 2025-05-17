"use client";

import React, { useEffect, useState } from 'react';
import { Battery } from '@/lib/db/schema';
import { getHealthColor, getStatusColor } from '@/lib/utils';

export default function BatteryOverview() {
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

  // Calculate overview statistics
  const totalBatteries = batteries.length;
  const healthyBatteries = batteries.filter(b => b.status === 'good').length;
  const warningBatteries = batteries.filter(b => b.status === 'warning').length;
  const criticalBatteries = batteries.filter(b => b.status === 'critical').length;

  // Calculate average health
  const averageHealth = batteries.length > 0
    ? batteries.reduce((sum, b) => sum + Number(b.currentHealth), 0) / batteries.length
    : 0;

  return (
    <>
      {/* Total Batteries */}
      <div className="battery-card p-6">
        <div className="flex flex-col space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Total Batteries</p>
          <div className="flex items-center">
            <div className="text-2xl font-bold">{totalBatteries}</div>
          </div>
        </div>
      </div>

      {/* Average Health */}
      <div className="battery-card p-6">
        <div className="flex flex-col space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Average Health</p>
          <div className="flex items-center">
            <div className={`text-2xl font-bold ${getHealthColor(averageHealth)}`}>
              {Math.round(averageHealth)}%
            </div>
          </div>
        </div>
      </div>

      {/* Status Summary */}
      <div className="battery-card p-6">
        <div className="flex flex-col space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Status</p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-success"></div>
              <span className="text-sm">{healthyBatteries}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-warning"></div>
              <span className="text-sm">{warningBatteries}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-danger"></div>
              <span className="text-sm">{criticalBatteries}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Required */}
      <div className="battery-card p-6">
        <div className="flex flex-col space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Action Required</p>
          <div className="flex items-center">
            <div className="text-2xl font-bold text-danger">{criticalBatteries + warningBatteries}</div>
          </div>
        </div>
      </div>
    </>
  );
}