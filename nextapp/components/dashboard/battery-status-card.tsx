'use client';

import * as React from "react";
import { Battery } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import BatteryIcon from "@/components/ui/battery-icon";
import { formatDateTime, formatNumber, getHealthStatusColor, getHealthStatusText } from "@/lib/utils";

interface BatteryStatusCardProps {
  battery: Battery | null;
  isLoading?: boolean;
}

export default function BatteryStatusCard({ battery, isLoading = false }: BatteryStatusCardProps) {
  if (isLoading) {
    return (
      <Card className="overflow-hidden border border-border/40 bg-gradient-to-br from-card/50 to-card shadow-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold">
            <Skeleton className="h-7 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-16 w-10" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!battery) {
    return (
      <Card className="overflow-hidden border border-border/40 bg-gradient-to-br from-card/50 to-card shadow-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold">Battery Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No battery selected</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border border-border/40 bg-gradient-to-br from-card/50 to-card shadow-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold group">
          <span className="bg-gradient-to-br from-foreground/90 to-foreground/60 bg-clip-text text-transparent">
            {battery.name}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <BatteryIcon percentage={battery.health} status={battery.status} />
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
              <div className="font-medium text-muted-foreground">Status:</div>
              <div className="font-semibold">{battery.status}</div>
              
              <div className="font-medium text-muted-foreground">Health:</div>
              <div className={`font-semibold ${getHealthStatusColor(battery.health)}`}>
                {battery.health}% ({getHealthStatusText(battery.health)})
              </div>
              
              <div className="font-medium text-muted-foreground">Capacity:</div>
              <div className="font-semibold">{formatNumber(battery.capacity)} mAh</div>
              
              <div className="font-medium text-muted-foreground">Voltage:</div>
              <div className="font-semibold">{battery.voltage}V</div>
              
              <div className="font-medium text-muted-foreground">Cycles:</div>
              <div className="font-semibold">{battery.cycleCount}</div>
              
              <div className="font-medium text-muted-foreground">Last checked:</div>
              <div className="font-semibold">{formatDateTime(battery.lastChecked)}</div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground">
          <div><span className="font-medium">Serial:</span> {battery.serialNumber}</div>
          <div><span className="font-medium">Model:</span> {battery.model}</div>
          <div><span className="font-medium">Manufacturer:</span> {battery.manufacturer}</div>
        </div>
      </CardContent>
    </Card>
  );
}