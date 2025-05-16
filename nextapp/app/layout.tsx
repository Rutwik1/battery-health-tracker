'use client';

import { Metadata } from 'next';
import './globals.css';

const metadata: Metadata = {
  title: 'Coulomb.ai - Battery Health Monitoring Dashboard',
  description: 'Real-time battery health monitoring, analytics, and predictive maintenance platform',
  applicationName: 'Coulomb.ai',
  authors: [{ name: 'Coulomb.ai' }],
  keywords: ['battery', 'health', 'monitoring', 'analytics', 'dashboard', 'maintenance', 'energy'],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{metadata.title as string}</title>
        <meta name="description" content={metadata.description as string} />
        <meta name="application-name" content={metadata.applicationName as string} />
        <meta name="keywords" content={(metadata.keywords as string[]).join(', ')} />
        
        {/* Open Graph */}
        <meta property="og:title" content={metadata.title as string} />
        <meta property="og:description" content={metadata.description as string} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Coulomb.ai" />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}