import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Coulomb.ai | Battery Health Management',
  description: 'Advanced battery health monitoring system with AI-powered predictive analytics',
  keywords: 'battery health, monitoring, coulomb, analytics, predictive maintenance',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-b from-background to-background/90 text-foreground">
          {children}
        </div>
      </body>
    </html>
  );
}