"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function DailyTracker() {
  const [adherenceMinutes, setAdherenceMinutes] = useState(0);
  const [recallSheets, setRecallSheets] = useState(0);
  const [compressionTests, setCompressionTests] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const adherencePercentage = Math.min((adherenceMinutes / 240) * 100, 100);

  useEffect(() => {
    async function fetchOrCreateTodayStats() {
      // 1. Explicitly grab the user's VIP Badge
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];

      // 2. Ask the database for this specific user's stats for today
      let { data, error } = await supabase
        .from('daily_tracker')
        .select('*')
        .eq('log_date', today)
        .eq('user_id', user.id) // Strictly filter by user
        .single();

      // 3. If no row exists, create it and EXPLICITLY attach their User ID
      if (error && error.code === 'PGRST116') {
        const { data: newData, error: insertError } = await supabase
          .from('daily_tracker')
          .insert([{ log_date: today, user_id: user.id }])
          .select()
          .single();

        if (insertError) {
          console.error("Critical Insert Error:", insertError);
        } else {
          data = newData;
        }
      }

      // 4. Load the data
      if (data) {
        setAdherenceMinutes(data.adherence_minutes || 0);
        setRecallSheets(data.recall_sheets || 0);
        setCompressionTests(data.compression_tests || 0);
      }
      setIsLoading(false);
    }
    
    fetchOrCreateTodayStats();
  }, []);

  const updateMetric = async (column: string, newValue: number) => {
    // Double check the user exists before saving
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const today = new Date().toISOString().split('T')[0];
    
    // Notice the `.select()` at the end. We are forcing Supabase to return what it just edited.
    const { error, data } = await supabase
      .from('daily_tracker')
      .update({ [column]: newValue })
      .eq('log_date', today)
      .eq('user_id', user.id)
      .select(); 

    if (error) {
      console.error("Save Error:", error);
      toast.error("Network error. Metric not saved.");
      return false; 
    }

    // THE SILENT FAILURE CATCHER
    if (data && data.length === 0) {
      console.error("Silent Failure: No database row found to update!");
      toast.error("Save failed. Row missing.");
      return false;
    }

    return true; 
  };

  const addTime = async () => {
    const newTime = adherenceMinutes + 30;
    setAdherenceMinutes(newTime);
    const success = await updateMetric('adherence_minutes', newTime);
    if (success) toast.success("+30 Mins Logged", { description: "Time added to the 4-Hour Cap." });
  };

  const adjustRecall = async (amount: number) => {
    const newAmount = Math.max(recallSheets + amount, 0);
    setRecallSheets(newAmount);
    await updateMetric('recall_sheets', newAmount);
  };

  const adjustTests = async (amount: number) => {
    const newAmount = Math.max(compressionTests + amount, 0);
    setCompressionTests(newAmount);
    await updateMetric('compression_tests', newAmount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      <Card className="transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/30">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">4-Hour Cap Adherence</CardTitle>
          <Button variant="outline" size="sm" onClick={addTime} disabled={isLoading}>+ 30 Mins</Button>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mb-4">
            {isLoading ? "..." : `${Math.round(adherencePercentage)}%`}
          </div>
          <Progress value={adherencePercentage} className="h-2" />
        </CardContent>
      </Card>

      <Card className="transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Scrap-Recall Sheets</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="text-4xl font-bold">{isLoading ? "..." : recallSheets}</div>
          <div className="space-x-2">
            <Button variant="outline" size="icon" onClick={() => adjustRecall(-1)} disabled={isLoading}>-</Button>
            <Button variant="outline" size="icon" onClick={() => adjustRecall(1)} disabled={isLoading}>+</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Compression Tests</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="text-4xl font-bold">{isLoading ? "..." : compressionTests}</div>
          <div className="space-x-2">
            <Button variant="outline" size="icon" onClick={() => adjustTests(-1)} disabled={isLoading}>-</Button>
            <Button variant="outline" size="icon" onClick={() => adjustTests(1)} disabled={isLoading}>+</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}