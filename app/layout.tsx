import * as React from 'react'
import type { Metadata } from 'next'
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
      <body className="min-h-screen bg-gradient-to-br from-slate-950 to-indigo-950 text-white antialiased">
        <div className="relative flex min-h-screen">
          {/* Static Sidebar */}
          <div className="hidden md:flex md:w-64 md:flex-col">
            <div className="flex h-full flex-col border-r border-indigo-800/40 bg-gradient-to-b from-gray-950 to-indigo-950/70">
              <div className="flex h-14 items-center border-b border-indigo-900/40 px-4">
                <div className="flex items-center gap-2 font-semibold">
                  <svg className="h-6 w-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">Coulomb.ai</span>
                </div>
              </div>
              <div className="flex-1 overflow-auto py-2">
                <nav className="grid items-start px-2 py-2 space-y-1">
                  <a href="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all bg-indigo-900/30 text-white">
                    <div className="flex h-6 w-6 items-center justify-center">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <span>Dashboard</span>
                  </a>
                  <a href="/batteries" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all text-gray-400 hover:text-white hover:bg-indigo-900/20">
                    <div className="flex h-6 w-6 items-center justify-center">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <span>Batteries</span>
                  </a>
                </nav>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex w-full flex-1 flex-col">
            {/* Static Topbar */}
            <div className="flex h-14 items-center border-b border-indigo-800/40 px-4 bg-gray-950">
              <div className="md:hidden flex items-center gap-2 font-semibold">
                <svg className="h-6 w-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">Coulomb.ai</span>
              </div>
            </div>
            <main className="flex-1 p-4 md:p-8">{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}