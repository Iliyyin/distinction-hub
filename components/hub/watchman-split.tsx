"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

type WatchmanTask = {
  id: number;
  day: string;
  phase: string;
  topic: string;
  is_complete: boolean; // <-- WE ADDED THIS
};

export function WatchmanSplit() {
  const [tasks, setTasks] = useState<WatchmanTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      const { data, error } = await supabase
        .from('watchman_tasks')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error("Database Error:", error);
        toast.error("Failed to sync with the Cortex database.");
      } else if (data) {
        setTasks(data);
      }
      setIsLoading(false);
    }
    fetchTasks();
  }, []);

  // --- THE NEW WRITE PIPELINE ---
  const toggleTask = async (taskId: number, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    // 1. Optimistic UI Update: Instantly change it on screen so it feels fast
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, is_complete: newStatus } : task
    ));

    if (newStatus) {
      toast.success("Artifact Logged", { description: "Watchman sequence updated successfully." });
    } else {
      toast("Action Reversed", { description: "Task returned to active queue." });
    }

    // 2. Background Database Sync: Tell Supabase to save it permanently
    const { error } = await supabase
      .from('watchman_tasks')
      .update({ is_complete: newStatus })
      .eq('id', taskId);

    if (error) {
      console.error("Save Error:", error);
      toast.error("Network error. Progress not saved.");
      // Revert the UI if the database failed
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, is_complete: currentStatus } : task
      ));
    }
  };

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/30">
      <CardHeader>
        <CardTitle>Watchman Split: Biochemistry</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground animate-pulse">
            <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-medium">Syncing with Cortex Database...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Day</TableHead>
                <TableHead>Phase</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id} className={task.is_complete ? "opacity-50" : ""}>
                  <TableCell className="font-medium">{task.day}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      task.phase === "Input" ? "bg-blue-500/20 text-blue-400" :
                      task.phase === "Compression" ? "bg-red-500/20 text-red-400" :
                      "bg-purple-500/20 text-purple-400"
                    }`}>
                      {task.phase}
                    </span>
                  </TableCell>
                  <TableCell className={task.is_complete ? "line-through" : ""}>{task.topic}</TableCell>
                  <TableCell className="text-right">
                    {/* Notice we pass the current status to the function now */}
                    <Button 
                      variant={task.is_complete ? "secondary" : "default"} 
                      size="sm" 
                      onClick={() => toggleTask(task.id, task.is_complete)}
                    >
                      {task.is_complete ? "Undo" : "Complete"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}