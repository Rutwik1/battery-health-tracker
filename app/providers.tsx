'use client'

import { ThemeProvider } from 'next-themes'
import { ReactNode, useEffect } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  // Ensure the dark theme is applied immediately to avoid flicker
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      {children}
    </ThemeProvider>
  )
}