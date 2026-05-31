import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Target, Trophy, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-background">
      
      {/* Background Glow Effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-50 pointer-events-none"></div>

      <div className="z-10 flex flex-col items-center text-center px-6 max-w-3xl">
      <div className="mb-8 shadow-2xl shadow-primary/20 ring-1 ring-white/10 rounded-xl overflow-hidden">
          <Image 
            src="/logo.jpg" 
            alt="Distinction Hub Logo" 
            width={64} 
            height={64} 
            className="h-16 w-16 object-cover"
          />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
          Distinction Hub
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
          The high-performance medical vault. Master the syllabus, lock in your daily cap, and climb the Arena rankings through ruthless accountability.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link href="/login">
            <Button size="lg" className="h-12 px-8 text-base font-semibold group">
              Enter the Vault
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl text-left border-t border-border/50 pt-16">
          <div className="flex flex-col space-y-2">
            <Target className="h-6 w-6 text-primary" />
            <h3 className="font-semibold text-foreground">4-Hour Cap</h3>
            <p className="text-sm text-muted-foreground">Track adherence to the Cortex System limits and optimize high-yield compression.</p>
          </div>
          <div className="flex flex-col space-y-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h3 className="font-semibold text-foreground">Watchman Split</h3>
            <p className="text-sm text-muted-foreground">Automated daily curriculum injections locking you strictly into the master syllabus.</p>
          </div>
          <div className="flex flex-col space-y-2">
            <Trophy className="h-6 w-6 text-primary" />
            <h3 className="font-semibold text-foreground">The Arena</h3>
            <p className="text-sm text-muted-foreground">Real-time aggregate scoring and weekly mock standings against your peers.</p>
          </div>
        </div>
      </div>
    </div>
  );
}