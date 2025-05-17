import "./globals.css"
import type { Metadata } from "next"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"

export const metadata: Metadata = {
  title: "Battery Health Dashboard | Coulomb.ai",
  description: "Advanced battery monitoring and health tracking dashboard",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          <div className="flex h-full flex-1">
            <div className="hidden md:flex">
              <Sidebar />
            </div>
            <div className="flex flex-1 flex-col">
              <Topbar />
              <main className="flex-1 p-6">{children}</main>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}