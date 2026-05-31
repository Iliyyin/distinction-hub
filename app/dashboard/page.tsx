import { DailyTracker } from "@/components/hub/daily-tracker";
import { WatchmanSplit } from "@/components/hub/watchman-split";
import { ArenaLeaderboard } from "@/components/hub/arena-leaderboard";
import { AuthGuard } from "@/components/hub/auth-guard"; 

export default function Dashboard() {
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