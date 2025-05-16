import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coulomb.ai Battery Management Dashboard",
  description: "Advanced analytics and visualization for battery health monitoring",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}