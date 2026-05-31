"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; // Adjust if your supabase client is in a different folder

import { DailyTracker } from "@/components/hub/daily-tracker";
import { WatchmanSplit } from "@/components/hub/watchman-split";
import { ArenaLeaderboard } from "@/components/hub/arena-leaderboard";
import { AuthGuard } from "@/components/hub/auth-guard"; 

export default function Dashboard() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkOnboarding = async () => {
      // 1. Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsChecking(false);
        return;
      }

      // 2. Fetch their profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      // 3. The Guard Check: If their name is just their email prefix, kick them to Onboarding
      const emailPrefix = user.email?.split('@')[0];
      if (profile?.full_name === emailPrefix) {
        router.push("/onboarding");
      } else {
        setIsChecking(false); // Name looks good, open the gates!
      }
    };

    checkOnboarding();
  }, [router]);

  // Show a sleek loading screen for a split second while it checks their credentials
  if (isChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-muted-foreground">
        <div className="animate-pulse font-medium text-lg">Scanning Vault Credentials...</div>
      </div>
    );
  }

  return (
    // THE SECURITY GUARD WRAPPING THE ENTIRE PAGE
    <AuthGuard> 
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="h-10 w-10 bg-primary rounded-md flex items-center justify-center font-bold text-primary-foreground shadow-lg shadow-primary/20">
            DH
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        </div>

        {/* COMPONENT MODULES */}
        <DailyTracker />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <WatchmanSplit />
          </div>
          <div>
            <ArenaLeaderboard />
          </div>
        </div>

      </div>
    </AuthGuard>
  );
}