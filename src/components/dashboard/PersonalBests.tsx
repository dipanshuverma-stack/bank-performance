"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Zap, Target, Flame, Timer } from "lucide-react";

interface Bests {
  fastestMock: string;
  highestAccuracy: number;
  longestStreak: number;
  bestQuantTime: string;
}

export function PersonalBests() {
  const [bests, setBests] = useState<Bests>({
    fastestMock: "--:--",
    highestAccuracy: 0,
    longestStreak: 0,
    bestQuantTime: "--:--",
  });

  useEffect(() => {
    const mockLogs = JSON.parse(localStorage.getItem("elite-mock-logs") || "[]");
    const accuracyLogs = JSON.parse(localStorage.getItem("accuracy-logs") || "[]");

    let maxAcc = 0;
    mockLogs.forEach((m: any) => {
      if (m.accuracy > maxAcc) maxAcc = m.accuracy;
    });

    let bestQ = Infinity;
    accuracyLogs.forEach((l: any) => {
      if (l.subject === "Quants" && l.time < bestQ) bestQ = l.time;
    });

    // Simple streak calculation (count of active days)
    const dates = new Set([...mockLogs, ...accuracyLogs].map((l: any) => l.date));
    
    setBests({
      fastestMock: "--:--", 
      highestAccuracy: maxAcc,
      longestStreak: dates.size,
      bestQuantTime: bestQ === Infinity ? "--:--" : `${Math.floor(bestQ / 60)}m ${bestQ % 60}s`,
    });
  }, []);

  const records = [
    { 
      label: "Highest Accuracy", 
      value: bests.highestAccuracy > 0 ? `${bests.highestAccuracy}%` : "0%", 
      icon: Target, 
      color: "text-emerald-400", 
      bg: "bg-emerald-500/10",
      description: "All-time mock peak"
    },
    { 
      label: "Best Quant Speed", 
      value: bests.bestQuantTime, 
      icon: Zap, 
      color: "text-blue-400", 
      bg: "bg-blue-500/10",
      description: "Fastest Quant unit"
    },
    { 
      label: "Active Days", 
      value: `${bests.longestStreak}`, 
      icon: Flame, 
      color: "text-orange-400", 
      bg: "bg-orange-500/10",
      description: "Consistency log"
    },
    { 
      label: "Fastest Mock", 
      value: bests.fastestMock, 
      icon: Timer, 
      color: "text-purple-400", 
      bg: "bg-purple-500/10",
      description: "Full mock record"
    },
  ];

  return (
    <Card className="bento-card border-none bg-slate-950/40 backdrop-blur-xl shadow-2xl overflow-hidden group">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-yellow-500/10 rounded-lg">
            <Trophy className="w-5 h-5 text-yellow-500" />
          </div>
          <CardTitle className="text-lg font-headline font-bold text-white tracking-tight">Personal Bests</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {records.map((record, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.08] transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-1.5 rounded-lg ${record.bg}`}>
                  <record.icon className={`w-3.5 h-3.5 ${record.color}`} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{record.label}</span>
              </div>
              <div className="text-xl font-headline font-black text-white">{record.value}</div>
              <div className="text-[8px] font-bold text-slate-500 mt-1 uppercase tracking-tighter">{record.description}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
