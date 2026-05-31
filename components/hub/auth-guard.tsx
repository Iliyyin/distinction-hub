"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      // Ask Supabase if there is a currently logged-in user in the browser's memory
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // No session found? Kick them to the login screen.
        router.push("/login");
      } else {
        // Session found? Let them in.
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center animate-pulse text-muted-foreground">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p>Verifying Credentials...</p>
        </div>
      </div>
    );
  }

  // If they aren't authenticated, render nothing while the router kicks them out
  if (!isAuthenticated) return null;

  // If they are authenticated, render the dashboard
  return <>{children}</>;
}