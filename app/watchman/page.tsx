import { WatchmanSplit } from "@/components/hub/watchman-split";

export default function WatchmanPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Watchman Protocols</h1>
        <p className="text-muted-foreground">Execute the 60-Day Compression Modules. Strict adherence required.</p>
      </div>
      
      {/* Injecting our isolated component here */}
      <WatchmanSplit />
    </div>
  );
}