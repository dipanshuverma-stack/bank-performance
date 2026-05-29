"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Target, Save, ShieldCheck, History, Trash2, FileJson, UserCircle, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { logAuditAction, type AuditLog } from "@/lib/audit-logger";

export default function ProfilePage() {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
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
    
    const loadLogs = () => {
      const logs = localStorage.getItem("elite-audit-logs");
      if (logs) {
        try { setAuditLogs(JSON.parse(logs)); } catch (e) {}
      }
    };

    loadLogs();
    window.addEventListener('elite-audit-updated', loadLogs);
    return () => window.removeEventListener('elite-audit-updated', loadLogs);
  }, []);

  const handleSave = () => {
    localStorage.setItem("elite-user-profile", JSON.stringify(profile));
    logAuditAction("Settings", "Profile Recalibrated", `Target: ${profile.targetExam}, Goal: ${profile.targetDate}`);
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
      auditLogs,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `elite-perf-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    logAuditAction("Strategic", "Data Export Initiated", "Full performance report generated.");
    toast({ title: "Report Exported", description: "Your performance data has been downloaded." });
  };

  const clearLogs = () => {
    setAuditLogs([]);
    localStorage.removeItem("elite-audit-logs");
    toast({ title: "Audit Vault Purged", description: "Operational logs have been cleared." });
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-24 px-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
           <div className="h-1 w-8 bg-primary rounded-full" />
           <span className="text-[10px] text-primary font-black uppercase tracking-[0.3em]">Aspirant Identity</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-headline font-black tracking-tighter text-foreground leading-none">Operational <span className="text-primary italic">Settings</span></h2>
        <p className="text-muted-foreground max-w-xl text-sm font-medium">Configure your target milestones and study constraints to personalize the AI strategy flows.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bento-card border-none bg-card/40 backdrop-blur-md shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
               <div className="p-2.5 bg-primary/10 rounded-xl text-primary shadow-inner"><User className="w-5 h-5" /></div>
               <CardTitle className="text-xl font-headline font-bold">Personal Parameters</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
              <Input value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="rounded-2xl h-12 bg-accent/20 border-border/40 font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Daily Study Budget (Hours)</label>
              <Input type="number" value={profile.dailyStudyHours} onChange={(e) => setProfile({...profile, dailyStudyHours: e.target.value})} className="rounded-2xl h-12 bg-accent/20 border-border/40 font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Peak Focus Timing</label>
              <Select value={profile.preferredTiming} onValueChange={(val) => setProfile({...profile, preferredTiming: val})}>
                <SelectTrigger className="rounded-2xl h-12 bg-accent/20 border-border/40 font-bold"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="Early Morning" className="font-bold">Early Morning (4AM - 8AM)</SelectItem>
                  <SelectItem value="Morning" className="font-bold">Morning (9AM - 1PM)</SelectItem>
                  <SelectItem value="Evening" className="font-bold">Evening (5PM - 9PM)</SelectItem>
                  <SelectItem value="Night" className="font-bold">Night Owl (10PM - 2AM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="bento-card border-none bg-card/40 backdrop-blur-md shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
               <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-500 shadow-inner"><Target className="w-5 h-5" /></div>
               <CardTitle className="text-xl font-headline font-bold">Exam Intelligence</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Primary Objective</label>
              <Select value={profile.targetExam} onValueChange={(val) => setProfile({...profile, targetExam: val})}>
                <SelectTrigger className="rounded-2xl h-12 bg-accent/20 border-border/40 font-bold"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-2xl font-bold">
                  <SelectItem value="SBI PO">SBI PO</SelectItem>
                  <SelectItem value="IBPS PO">IBPS PO</SelectItem>
                  <SelectItem value="RBI Grade B">RBI Grade B</SelectItem>
                  <SelectItem value="Other">Other Standard Exam</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Target Milestone Date</label>
              <Input type="date" value={profile.targetDate} onChange={(e) => setProfile({...profile, targetDate: e.target.value})} className="rounded-2xl h-12 bg-accent/20 border-border/40 font-bold" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bento-card border-none bg-card/40 backdrop-blur-md shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-500 shadow-inner"><Brain className="w-5 h-5" /></div>
             <CardTitle className="text-xl font-headline font-bold">AI Strategy Anchors</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-destructive ml-1">Weak Sub-topics (AI Priority)</label>
            <Textarea value={profile.weakSubjects} onChange={(e) => setProfile({...profile, weakSubjects: e.target.value})} placeholder="e.g. Mensuration, Critical Reasoning" className="rounded-2xl min-h-[120px] bg-accent/20 border-border/40 font-bold text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-success ml-1">Strong Pillars (Strategy Anchor)</label>
            <Textarea value={profile.strongSubjects} onChange={(e) => setProfile({...profile, strongSubjects: e.target.value})} placeholder="e.g. Syllogism, Data Interpretation" className="rounded-2xl min-h-[120px] bg-accent/20 border-border/40 font-bold text-sm" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <Button onClick={handleSave} className="rounded-2xl h-14 bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-xl shadow-primary/20 w-full transition-all hover:scale-[1.02]">
            <Save className="w-5 h-5 mr-3" /> Save Intelligence
          </Button>
          <Button onClick={handleExport} variant="outline" className="rounded-2xl h-14 border-2 font-black uppercase tracking-widest w-full hover:bg-accent group">
            <FileJson className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" /> Export Report
          </Button>
        </div>
        
        <Card className="lg:col-span-2 bento-card border-none bg-slate-900 shadow-2xl overflow-hidden group">
          <CardHeader className="bg-white/5 py-4 border-b border-white/5 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <History className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg font-headline font-bold text-white tracking-tight">Operational Audit Logs</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={clearLogs} className="h-8 px-3 text-[9px] font-black uppercase text-white/40 hover:text-destructive hover:bg-destructive/10 rounded-xl">
              <Trash2 className="w-3.5 h-3.5 mr-2" /> Purge Logs
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[280px]">
              {auditLogs.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="p-5 hover:bg-white/[0.02] transition-colors group/log">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[8px] font-black h-5 px-2 uppercase">{log.category}</Badge>
                          <span className="text-sm font-bold text-white tracking-tight">{log.action}</span>
                        </div>
                        <span className="text-[9px] font-mono text-white/30 font-bold uppercase">{log.timestamp}</span>
                      </div>
                      <p className="text-[10px] text-white/50 leading-relaxed italic ml-2 border-l border-white/10 pl-3">
                        {log.details}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-[280px] flex flex-col items-center justify-center text-white/10 p-10 text-center uppercase tracking-widest font-black">
                   <ShieldCheck className="w-12 h-12 mb-4 opacity-5" />
                   Vault Integrity Verified
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
