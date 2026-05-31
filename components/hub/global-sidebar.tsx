"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Target, ShieldCheck, Trophy } from "lucide-react";
import { LogoutButton } from "@/components/hub/logout-button";

export function GlobalSidebar() {
  const pathname = usePathname();

  // THE INVISIBILITY CLOAK: If the URL is exactly /login, render absolutely nothing.
  if (pathname === "/login" || pathname==="/") return null;

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col hidden md:flex">
      <div className="h-20 flex items-center px-6 border-b border-border/50">
      <div className="mr-3 shadow-lg shadow-primary/20 rounded-md overflow-hidden flex-shrink-0">
          <Image 
            src="/logo.jpg" 
            alt="Distinction Hub Logo" 
            width={32} 
            height={32} 
            className="h-8 w-8 object-cover"
          />
        </div>
        <span className="font-bold tracking-tight text-lg">Distinction Hub</span>
      </div>
      
      <nav className="flex-1 py-8 px-4 space-y-2">
        <Link href="/dashboard" className="flex items-center space-x-3 px-3 py-2.5 rounded-md bg-primary/10 text-primary font-medium transition-colors">
          <LayoutDashboard className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>
        <Link href="/tracker" className="flex items-center space-x-3 px-3 py-2.5 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
          <Target className="h-5 w-5" />
          <span>Tracker</span>
        </Link>
        <Link href="/watchman" className="flex items-center space-x-3 px-3 py-2.5 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
          <ShieldCheck className="h-5 w-5" />
          <span>Watchman</span>
        </Link>
        <Link href="/arena" className="flex items-center space-x-3 px-3 py-2.5 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
          <Trophy className="h-5 w-5" />
          <span>Arena</span>
        </Link>
      </nav>

      {/* ESCAPE HATCH: Pinned to the bottom */}
      <div className="p-4 border-t border-border/50">
        <LogoutButton />
      </div>
    </aside>
  );
}