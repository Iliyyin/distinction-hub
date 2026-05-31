"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // Toggles between Login and Register
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isSignUp) {
      // --- SIGN UP LOGIC ---
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Account created!", { description: "You can now log in." });
        setIsSignUp(false); // Switch back to login view
      }
    } else {
      // --- SIGN IN LOGIC ---
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Authentication successful.", { description: "Welcome to the Hub." });
        router.push("/"); // Redirect to the main dashboard
      }
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 bg-primary rounded-md flex items-center justify-center font-bold text-primary-foreground text-xl shadow-lg shadow-primary/20">
              DH
            </div>
          </div>
          <CardTitle className="text-2xl text-center">
            {isSignUp ? "Create an Account" : "Enter the Hub"}
          </CardTitle>
          <CardDescription className="text-center">
            {isSignUp 
              ? "Join your cohort's 60-Day Compression marathon." 
              : "Enter your credentials to access your dashboard."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="medstudent@leadcity.edu" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Processing..." : (isSignUp ? "Sign Up" : "Sign In")}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Button 
            variant="ghost" 
            className="w-full text-sm text-muted-foreground" 
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}