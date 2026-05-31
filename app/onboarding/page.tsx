"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; // adjust your import path
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function OnboardingPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    // Update the profile table
    await supabase
      .from("profiles")
      .update({ 
        full_name: name, 
        initials: name.split(' ').map(n => n[0]).join('').toUpperCase() 
      })
      .eq("id", user?.id);

    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Arena</h1>
      <p className="mb-6 text-muted-foreground">Complete your profile to join the leaderboard.</p>
      <Input 
        placeholder="Enter your full name" 
        value={name} 
        onChange={(e) => setName(e.target.value)}
        className="max-w-xs mb-4"
      />
      <Button onClick={handleUpdate} disabled={loading}>
        {loading ? "Saving..." : "Enter the Arena"}
      </Button>
    </div>
  );
}