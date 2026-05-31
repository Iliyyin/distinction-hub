import { ArenaLeaderboard } from "@/components/hub/arena-leaderboard";

export default function ArenaPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">The Arena</h1>
        <p className="text-muted-foreground">Peer-to-peer accountability and mastery rankings.</p>
      </div>
      
      {/* Injecting our isolated component here */}
      <ArenaLeaderboard />
    </div>
  );
}