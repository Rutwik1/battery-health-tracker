import './globals.css'
import type { Metadata } from 'next'
import { Sidebar } from '@/components/layout/sidebar'

export const metadata: Metadata = {
  title: 'Coulomb.ai Battery Health Dashboard',
  description: 'Real-time battery health monitoring and analytics dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <div className="flex h-screen overflow-hidden">
          <div className="hidden md:flex md:w-64 md:flex-col">
            <Sidebar />
          </div>
          <div className="flex flex-1 flex-col overflow-hidden">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}