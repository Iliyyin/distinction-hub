"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface LeaderboardEntry {
  id: string;
  full_name: string;
  initials: string;
  mastery_score?: number;
  streak_days?: number;
  highest_score?: number; // Added for the mock standings
}

export function ArenaLeaderboard() {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'week' | 'all-time' | 'mocks'>('week');
  
  // State for logging a new mock score
  const [mockScore, setMockScore] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    
    let viewName = 'weekly_leaderboard';
    let sortColumn = 'mastery_score';

    if (timeframe === 'all-time') {
      viewName = 'leaderboard';
    } else if (timeframe === 'mocks') {
      viewName = 'mock_standings';
      sortColumn = 'highest_score';
    }

    const { data, error } = await supabase
      .from(viewName)
      .select('*')
      .order(sortColumn, { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching leaderboard:", error);
    } else if (data) {
      setLeaders(data);
    }
    setIsLoading(false);
  };

  // Re-fetch whenever the tab changes
  useEffect(() => {
    fetchLeaderboard();
  }, [timeframe]);

  // The engine to submit a new mock score
  const submitMockScore = async () => {
    const score = parseInt(mockScore);
    if (isNaN(score) || score < 0 || score > 100) {
      toast.error("Invalid Score", { description: "Please enter a percentage between 0 and 100." });
      return;
    }

    setIsSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error } = await supabase
        .from('mock_exams')
        .insert([{ 
          user_id: user.id, 
          score_percentage: score,
          exam_date: new Date().toISOString().split('T')[0]
        }]);

      if (error) {
        if (error.code === '23505') {
          toast.error("Score already logged", { description: "You can only log one mock score per day." });
        } else {
          toast.error("Failed to save score.");
        }
      } else {
        toast.success("Mock Score Locked In!");
        setMockScore("");
        fetchLeaderboard(); // Refresh the board instantly
      }
    }
    setIsSubmitting(false);
  };

  return (
    <Card className="h-full border-border/50 bg-black/40 backdrop-blur-md flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <CardTitle className="text-md font-medium text-muted-foreground">The Arena</CardTitle>
        <div className="flex space-x-1 bg-secondary/50 p-1 rounded-lg">
          <Button variant={timeframe === 'week' ? 'default' : 'ghost'} size="sm" className="h-7 text-xs px-2" onClick={() => setTimeframe('week')}>Week</Button>
          <Button variant={timeframe === 'all-time' ? 'default' : 'ghost'} size="sm" className="h-7 text-xs px-2" onClick={() => setTimeframe('all-time')}>All-Time</Button>
          <Button variant={timeframe === 'mocks' ? 'default' : 'ghost'} size="sm" className="h-7 text-xs px-2" onClick={() => setTimeframe('mocks')}>Mocks</Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 mt-4 flex-1 overflow-y-auto">
        {/* Score Submission UI - Only visible on the Mocks tab */}
        {timeframe === 'mocks' && (
          <div className="flex space-x-2 mb-6 bg-secondary/20 p-3 rounded-lg border border-border/50">
            <Input 
              type="number" 
              placeholder="Enter Mock %" 
              value={mockScore}
              onChange={(e) => setMockScore(e.target.value)}
              className="h-9 bg-background/50 border-border/50"
              min="0"
              max="100"
            />
            <Button size="sm" className="h-9" onClick={submitMockScore} disabled={isSubmitting || !mockScore}>
              {isSubmitting ? "..." : "Log Score"}
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : leaders.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-4">No data yet.</div>
        ) : (
          leaders.map((student, index) => (
            <div key={student.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-bold text-muted-foreground w-4">{index + 1}</span>
                <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold ring-1 ring-primary/30">
                  {student.initials}
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">{student.full_name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {timeframe === 'mocks' 
                      ? `Score: ${student.highest_score}%` 
                      : `Mastery: ${student.mastery_score}`
                    }
                  </p>
                </div>
              </div>
              {timeframe !== 'mocks' && (
                <div className="flex items-center text-orange-500 font-medium text-sm space-x-1 bg-orange-500/10 px-2 py-1 rounded-md">
                  <span>🔥</span>
                  <span>{student.streak_days}</span>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}