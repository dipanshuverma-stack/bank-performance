
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Target, Clock, BookOpen, Save, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState({
    name: "Dipanshu",
    targetExam: "SBI PO",
    targetDate: "2025-11-15",
    dailyStudyHours: "8",
    weakSubjects: ["Arithmetic", "Puzzles"],
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
      title: "Profile Synchronized",
      description: "AI study parameters have been updated based on your latest settings.",
    });
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
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
          </CardContent>
        </Card>

        <Card className="bento-card bg-card/50">
          <CardHeader>
            <div className="flex items-center gap-3">
               <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-500"><Target className="w-5 h-5" /></div>
               <CardTitle className="text-xl font-bold">Exam Target</CardTitle>
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
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Target Date</label>
              <Input type="date" value={profile.targetDate} onChange={(e) => setProfile({...profile, targetDate: e.target.value})} className="rounded-xl h-12 bg-accent/20 font-bold" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="rounded-2xl h-14 px-10 bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-xl shadow-primary/20">
          <Save className="w-5 h-5 mr-3" /> Save Changes
        </Button>
      </div>
    </div>
  );
}
