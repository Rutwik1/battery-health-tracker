import { Battery } from "../../../../shared/schema";

/**
 * Export battery data as a CSV file
 */
export function exportBatteryData(batteries: Battery[], timeRange: string): void {
  // Create CSV header
  let csvContent = "Name,Serial Number,Health %,Capacity (mAh),Cycles,Status,Degradation Rate,Initial Date\n";

  // Add data rows
  batteries.forEach(battery => {
    const row = [
      battery.name,
      battery.serialNumber,
      battery.healthPercentage,
      battery.currentCapacity,
      battery.cycleCount,
      battery.status,
      battery.degradationRate,
      new Date(battery.initialDate).toISOString().split("T")[0]
    ].join(",");

    csvContent += row + "\n";
  });

  // Create blob and trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  // Format filename with date and time range
  const date = new Date().toISOString().split("T")[0];
  link.setAttribute("href", url);
  link.setAttribute("download", `battery-data-${date}-${timeRange}days.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export detailed battery history as a CSV file
 */
export function exportBatteryHistory(batteryId: number, history: any[]): void {
  if (history.length === 0) return;

  // Create CSV header based on first history object keys
  const headers = Object.keys(history[0]).filter(key => key !== "id");
  let csvContent = headers.join(",") + "\n";

  // Add data rows
  history.forEach(record => {
    const row = headers.map(header => {
      const value = record[header];
      // Format dates
      if (header === "date" && value instanceof Date) {
        return value.toISOString().split("T")[0];
      }
      return value;
    }).join(",");

    csvContent += row + "\n";
  });

  // Create blob and trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  // Format filename
  const date = new Date().toISOString().split("T")[0];
  link.setAttribute("href", url);
  link.setAttribute("download", `battery-history-${batteryId}-${date}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
