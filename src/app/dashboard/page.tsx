import { Suspense } from "react"
import Link from "next/link"
import BatteryOverview from "@/components/dashboard/battery-overview"
import BatteryGrid from "@/components/dashboard/battery-grid"
import RecommendationsCard from "@/components/dashboard/recommendations-card"
import PerformanceMetrics from "@/components/dashboard/performance-metrics"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "Dashboard | Coulomb.ai",
  description: "Battery health monitoring dashboard",
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 md:items-center md:flex-row md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your battery health monitoring center
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/batteries"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground h-9 px-4 py-2 bg-gradient-primary hover:opacity-90"
          >
            View All Batteries
          </Link>
        </div>
      </div>

      {/* Overview Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<Skeleton className="w-full h-[120px] rounded-lg" />}>
          <BatteryOverview />
        </Suspense>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Battery Grid */}
        <div className="md:col-span-2 lg:col-span-4">
          <div className="battery-card h-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Battery Health</h2>
                <Link
                  href="/dashboard/batteries"
                  className="text-sm text-primary hover:underline"
                >
                  View all
                </Link>
              </div>
              <Suspense fallback={<Skeleton className="w-full h-[300px] rounded-lg" />}>
                <BatteryGrid />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="md:col-span-2 lg:col-span-3">
          <div className="battery-card h-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Recommendations</h2>
              <Suspense fallback={<Skeleton className="w-full h-[300px] rounded-lg" />}>
                <RecommendationsCard />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="md:col-span-2 lg:col-span-7">
          <div className="battery-card h-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Performance Metrics</h2>
              <Suspense fallback={<Skeleton className="w-full h-[300px] rounded-lg" />}>
                <PerformanceMetrics />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}