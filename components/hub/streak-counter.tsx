"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function StreakCounter({ finalStreak }: { finalStreak: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500; // 1.5 seconds animation
    if (finalStreak === 0) return;
    
    const increment = finalStreak / (duration / 16); 

    const timer = setInterval(() => {
      start += increment;
      if (start >= finalStreak) {
        setCount(finalStreak);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [finalStreak]);

  if (finalStreak === 0) return null; // Hide if they have no streak yet

  return (
    <div className="flex items-center space-x-2 bg-orange-500/10 text-orange-500 px-4 py-2 rounded-full font-bold border border-orange-500/20 shadow-sm">
      <motion.span 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex items-center gap-2"
      >
        🔥 {count} Day Streak
      </motion.span>
    </div>
  );
}