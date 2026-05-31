"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    // 1. Tell the Supabase backend to destroy the VIP badge
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Logout Error:", error);
      toast.error("Failed to log out. Please try again.");
      setIsLoggingOut(false);
    } else {
      // 2. Clear the frontend and violently kick them to the login screen
      toast.success("Securely logged out.");
      router.push("/login");
      router.refresh(); // Forces Next.js to dump any cached dashboard data
    }
  };

  return (
    <Button 
      variant="ghost" 
      className="w-full justify-start text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors mt-auto" 
      onClick={handleLogout}
      disabled={isLoggingOut}
    >
      {/* Visual feedback so the user knows the system is processing */}
      {isLoggingOut ? (
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          <span>Escaping...</span>
        </div>
      ) : (
        "Log Out"
      )}
    </Button>
  );
}