'use client';

import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <head>
        <title>Coulomb.ai - Battery Health Monitoring</title>
        <meta name="description" content="Advanced battery health monitoring and predictive analytics platform for optimal battery performance." />
        <meta property="og:title" content="Coulomb.ai - Battery Health Monitoring" />
        <meta property="og:description" content="Advanced battery health monitoring and predictive analytics platform for optimal battery performance." />
        <meta property="og:type" content="website" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Add favicon */}
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 antialiased`}>
        {children}
      </body>
    </html>
  );
}