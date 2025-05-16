"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the dashboard or login page based on authentication
    router.push("/dashboard");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-4 bg-card rounded-lg shadow-lg animate-pulse">
        <div className="h-8 bg-primary/20 rounded-md w-3/4 mx-auto"></div>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded-md"></div>
          <div className="h-4 bg-muted rounded-md w-5/6"></div>
          <div className="h-4 bg-muted rounded-md w-4/6"></div>
        </div>
      </div>
    </div>
  );
}