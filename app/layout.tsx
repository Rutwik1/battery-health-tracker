import * as React from 'react'
import type { Metadata } from 'next'
import { Sidebar } from '../components/layout/sidebar'
import { Topbar } from '../components/layout/topbar'
import './globals.css'

export const metadata: Metadata = {
  title: 'Coulomb.ai - Battery Health Dashboard',
  description: 'Comprehensive battery health monitoring with advanced analytics and visualization',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-slate-950 to-indigo-950 text-foreground antialiased">
        <div className="relative flex min-h-screen">
          <div className="hidden md:block">
            <Sidebar />
          </div>
          <div className="flex w-full flex-1 flex-col">
            <Topbar />
            <main className="flex-1 p-4 md:p-8">{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}