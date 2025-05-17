import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coulomb.ai - Battery Health Monitoring Platform",
  description: "Advanced battery health monitoring and analytics platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}