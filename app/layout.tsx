import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import React from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Battery Health Visualization Dashboard',
  description: 'Real-time monitoring and insights for your battery fleet',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}