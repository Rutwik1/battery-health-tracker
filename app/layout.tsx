import * as React from "react"
import type { Metadata } from "next"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import "./globals.css"

export const metadata: Metadata = {
  title: "Coulomb.ai | Battery Health Monitoring",
  description: "Advanced battery health monitoring dashboard",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="flex h-screen overflow-hidden">
          <div className="hidden md:block">
            <Sidebar />
          </div>
          <div className="flex w-full flex-1 flex-col">
            <Topbar />
            <main className="flex-1 overflow-auto p-4 md:p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}