"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  User, Target, Save, ShieldCheck, History, Trash2, 
  FileJson, Brain, Database, RefreshCcw, LogIn, LogOut, Cloud
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { logAuditAction, type AuditLog } from "@/lib/audit-logger";
import { useUser, useAuth, useFirestore } from "@/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function ProfilePage() {
  const { toast } = useToast();
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [storageSize, setStorageSize] = useState("0 KB");
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
      
      let total = 0;
      for (let x in localStorage) {
        if (localStorage.hasOwnProperty(x)) {
          total += (localStorage[x].length + x.length) * 2;
        }
      }
      setStorageSize((total / 1024).toFixed(2) + " KB");
    };

    loadLogs();
    window.addEventListener('elite-audit-updated', loadLogs);
    return () => window.removeEventListener('elite-audit-updated', loadLogs);
  }, []);

  const handleSave = () => {
    localStorage.setItem("elite-user-profile", JSON.stringify(profile));
    
    // Sync to Firestore if logged in
    if (user && db) {
      const userRef = doc(db, 'users', user.uid);
      setDoc(userRef, { profile, lastUpdated: new Date() }, { merge: true });
    }

    logAuditAction("Settings", "Profile Recalibrated", `Target: ${profile.targetExam}`);
    toast({
      title: "Operational Settings Synchronized",
      description: "Local vault and Cloud backup updated.",
    });
  };

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      logAuditAction("Security", "Cloud Uplink Established", "User authenticated via Google.");
      toast({ title: "Cloud Uplink Established", description: "Terminal is now synchronizing with the server." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Authentication Failed", description: error.message });
    }
  };

  const handleSignOut = async () => {
    if (!auth) return;
    await signOut(auth);
    logAuditAction("Security", "Cloud Uplink Severed", "User signed out.");
    toast({ title: "Cloud Uplink Severed", description: "Data will only be saved locally." });
  };

  const handleExport = () => {
    const data = {
      profile,
      mocks: JSON.parse(localStorage.getItem("elite-mock-logs") || "[]"),
      mistakes: JSON.parse(localStorage.getItem("elite-mistakes") || "[]"),
      accuracyLogs: JSON.parse(localStorage.getItem("accuracy-logs") || "[]"),
      syllabus: JSON.parse(localStorage.getItem("elite-syllabus-v2") || "[]"),
      auditLogs,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `elite-perf-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    logAuditAction("Strategic", "Data Export Initiated", "Full performance report generated.");
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-24 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
             <div className="h-1 w-8 bg-primary rounded-full" />
             <span className="text-[10px] text-primary font-black uppercase tracking-[0.3em]">Aspirant Identity</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-headline font-black tracking-tighter text-foreground leading-none">Operational <span className="text-primary italic">Settings</span></h2>
        </div>
        
        <Card className="bg-primary/5 border-primary/20 rounded-2xl p-4 flex items-center gap-4 border-2">
          {user ? (
            <>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary border-2 border-primary/40 overflow-hidden">
                {user.photoURL ? <img src={user.photoURL} alt="User" /> : <User className="w-6 h-6" />}
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-black uppercase tracking-widest text-primary">Cloud Active</div>
                <div className="text-sm font-bold truncate max-w-[120px]">{user.displayName || "Elite Aspirant"}</div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleSignOut} className="text-muted-foreground hover:text-destructive h-8 w-8 rounded-lg">
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button onClick={handleGoogleSignIn} variant="outline" className="rounded-xl border-primary/40 hover:bg-primary/10 h-10 font-black uppercase text-[10px] tracking-widest">
              <Cloud className="w-4 h-4 mr-2" /> Activate Cloud Sync
            </Button>
          )}
        </Card>
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
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Peak Focus Timing</label>
              <Select value={profile.preferredTiming} onValueChange={(val) => setProfile({...profile, preferredTiming: val})}>
                <SelectTrigger className="rounded-2xl h-12 bg-accent/20 border-border/40 font-bold"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="Early Morning" className="font-bold">Early Morning</SelectItem>
                  <SelectItem value="Morning" className="font-bold">Morning</SelectItem>
                  <SelectItem value="Evening" className="font-bold">Evening</SelectItem>
                  <SelectItem value="Night" className="font-bold">Night Owl</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="bento-card border-none bg-slate-900 shadow-2xl overflow-hidden group">
          <CardHeader className="pb-2">
             <div className="flex items-center gap-3">
               <div className="p-2.5 bg-primary/20 rounded-xl text-primary"><Database className="w-5 h-5" /></div>
               <CardTitle className="text-lg font-headline font-bold text-white tracking-tight">Hybrid Vault</CardTitle>
             </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
             <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex justify-between items-center">
                   <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Storage Mode</span>
                   <Badge variant="outline" className={user ? "bg-primary/10 text-primary border-primary/20 text-[8px] font-black" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[8px] font-black"}>
                     {user ? "CLOUD SYNC" : "LOCAL ONLY"}
                   </Badge>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Vault Weight</span>
                   <span className="text-xs font-bold text-white">{storageSize}</span>
                </div>
             </div>
             <p className="text-[10px] text-slate-500 leading-relaxed italic">
               All performance logs are synchronized between your local browser and the Firebase server for seamless multi-device access.
             </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <Button onClick={handleSave} className="rounded-2xl h-14 bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-xl shadow-primary/20 w-full transition-all hover:scale-[1.02]">
            <Save className="w-5 h-5 mr-3" /> Synchronize All
          </Button>
          <Button onClick={handleExport} variant="outline" className="rounded-2xl h-14 border-2 font-black uppercase tracking-widest w-full hover:bg-accent group">
            <FileJson className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" /> Export Local Report
          </Button>
        </div>
        
        <Card className="lg:col-span-2 bento-card border-none bg-slate-900 shadow-2xl overflow-hidden group">
          <CardHeader className="bg-white/5 py-4 border-b border-white/5 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <History className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg font-headline font-bold text-white tracking-tight">Tactical Audit Log</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[280px]">
              {auditLogs.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="p-5 hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-start justify-between gap-4 mb-1">
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
                   Log Vault Clear
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
