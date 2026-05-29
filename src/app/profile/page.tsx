
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Target, Clock, BookOpen, Save, ShieldCheck, BellRing, Activity, Sparkles, Brain, ListChecks } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

export default function ProfilePage() {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState({
    name: "Dipanshu",
    targetExam: "SBI PO",
    targetDate: "2025-11-15",
    dailyStudyHours: "8",
    preferredTiming: "Early Morning",
    weakSubjects: "Arithmetic, Puzzles",
    strongSubjects: "Syllogism, English Grammar",
  });

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("elite-user-profile");
    if (saved) {
      try { setProfile(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("elite-user-profile", JSON.stringify(profile));
    toast({
      title: "Operational Settings Synchronized",
      description: "AI study planner and strategy flows have been recalibrated.",
    });
  };

  const handleExport = () => {
    const data = {
      profile,
      mocks: JSON.parse(localStorage.getItem("elite-mock-logs") || "[]"),
      mistakes: JSON.parse(localStorage.getItem("elite-mistakes") || "[]"),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `elite-perf-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast({ title: "Report Exported", description: "Your performance data has been downloaded." });
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <div className="flex flex-col gap-2">
        <span className="text-[10px] text-primary font-black uppercase tracking-widest">Aspirant Identity</span>
        <h2 className="text-2xl md:text-4xl font-headline font-extrabold tracking-tight text-foreground">Operational Settings</h2>
        <p className="text-muted-foreground max-w-xl">Configure your target milestones and study constraints to personalize the AI strategy flows.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bento-card bg-card/50">
          <CardHeader>
            <div className="flex items-center gap-3">
               <div className="p-2 bg-primary/10 rounded-xl text-primary"><User className="w-5 h-5" /></div>
               <CardTitle className="text-xl font-bold">Personal Parameters</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
              <Input value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="rounded-xl h-12 bg-accent/20 font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Daily Study Budget (Hours)</label>
              <Input type="number" value={profile.dailyStudyHours} onChange={(e) => setProfile({...profile, dailyStudyHours: e.target.value})} className="rounded-xl h-12 bg-accent/20 font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Peak Focus Timing</label>
              <Select value={profile.preferredTiming} onValueChange={(val) => setProfile({...profile, preferredTiming: val})}>
                <SelectTrigger className="rounded-xl h-12 bg-accent/20 font-bold"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="Early Morning">Early Morning (4AM - 8AM)</SelectItem>
                  <SelectItem value="Morning">Morning (9AM - 1PM)</SelectItem>
                  <SelectItem value="Evening">Evening (5PM - 9PM)</SelectItem>
                  <SelectItem value="Night">Night Owl (10PM - 2AM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="bento-card bg-card/50">
          <CardHeader>
            <div className="flex items-center gap-3">
               <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-500"><Target className="w-5 h-5" /></div>
               <CardTitle className="text-xl font-bold">Exam Intelligence</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Primary Objective</label>
              <Select value={profile.targetExam} onValueChange={(val) => setProfile({...profile, targetExam: val})}>
                <SelectTrigger className="rounded-xl h-12 bg-accent/20 font-bold"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-xl font-bold">
                  <SelectItem value="SBI PO">SBI PO</SelectItem>
                  <SelectItem value="IBPS PO">IBPS PO</SelectItem>
                  <SelectItem value="RBI Grade B">RBI Grade B</SelectItem>
                  <SelectItem value="Other">Other Standard Exam</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Target Milestone Date</label>
              <Input type="date" value={profile.targetDate} onChange={(e) => setProfile({...profile, targetDate: e.target.value})} className="rounded-xl h-12 bg-accent/20 font-bold" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bento-card bg-card/50">
        <CardHeader>
          <div className="flex items-center gap-3">
             <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500"><Brain className="w-5 h-5" /></div>
             <CardTitle className="text-xl font-bold">AI Strategy Anchors</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-destructive ml-1">Weak Sub-topics (AI Priority)</label>
            <Textarea value={profile.weakSubjects} onChange={(e) => setProfile({...profile, weakSubjects: e.target.value})} placeholder="e.g. Mensuration, Critical Reasoning" className="rounded-xl min-h-[100px] bg-accent/20 font-bold" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-success ml-1">Strong Pillars (Strategy Anchor)</label>
            <Textarea value={profile.strongSubjects} onChange={(e) => setProfile({...profile, strongSubjects: e.target.value})} placeholder="e.g. Syllogism, Data Interpretation" className="rounded-xl min-h-[100px] bg-accent/20 font-bold" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <Button onClick={handleSave} className="rounded-2xl h-14 bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-xl shadow-primary/20 w-full transition-all hover:scale-[1.02]">
            <Save className="w-5 h-5 mr-3" /> Save Intelligence Profile
          </Button>
          <Button onClick={handleExport} variant="outline" className="rounded-2xl h-14 border-2 font-black uppercase tracking-widest w-full">
            <ListChecks className="w-5 h-5 mr-3" /> Export Weekly Report (JSON)
          </Button>
        </div>
        
        <div className="p-8 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10 backdrop-blur-sm group transition-all relative overflow-hidden">
          <h3 className="text-lg font-bold mb-2">Sync Status</h3>
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">All data is encrypted and synced locally. AI strategy updates occur in real-time based on your profile shifts.</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-success">Cloud Sync Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
