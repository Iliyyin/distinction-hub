"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; 

import { DailyTracker } from "@/components/hub/daily-tracker";
import { WatchmanSplit } from "@/components/hub/watchman-split";
import { ArenaLeaderboard } from "@/components/hub/arena-leaderboard";
import { AuthGuard } from "@/components/hub/auth-guard"; 
import { StreakCounter } from "@/components/hub/streak-counter"; // <-- NEW IMPORT

export default function Dashboard() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [firstName, setFirstName] = useState(""); 
  const [streakDays, setStreakDays] = useState(0); // <-- NEW STATE FOR STREAK

  useEffect(() => {
    const checkOnboarding = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsChecking(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      const emailPrefix = user.email?.split('@')[0];
      if (profile?.full_name === emailPrefix) {
        router.push("/onboarding");
      } else {
        if (profile?.full_name) {
          setFirstName(profile.full_name.split(' ')[0]); 
        }

        // <-- NEW: Fetch the total days they have logged in the tracker
        const { count } = await supabase
          .from('daily_tracker')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        
        setStreakDays(count || 0);

        setIsChecking(false); 
      }
    };

    checkOnboarding();
  }, [router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-muted-foreground">
        <div className="animate-pulse font-medium text-lg">Scanning Vault Credentials...</div>
      </div>
    );
  }

  return (
    <AuthGuard> 
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* HEADER WITH STREAK COUNTER */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 bg-primary rounded-md flex items-center justify-center font-bold text-primary-foreground shadow-lg shadow-primary/20">
              DH
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Welcome back, {firstName || "Watchman"}
              </h1>
              <p className="text-muted-foreground">Here is your operational overview for today.</p>
            </div>
          </div>
          
          {/* <-- NEW: The Animated Component --> */}
          <StreakCounter finalStreak={streakDays} />
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