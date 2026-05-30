"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  User as UserIcon, Save, History, Database, LogOut, Cloud, ShieldCheck, Download, Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { logAuditAction, type AuditLog } from "@/lib/audit-logger";
import { useEliteAuth, useFirestore, useCollection, useDoc, useMemoFirebase } from "@/firebase";
import { doc, setDoc, collection, query, orderBy, limit } from "firebase/firestore";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const { toast } = useToast();
  const db = useFirestore();
  const { user } = useEliteAuth();
  const [mounted, setMounted] = useState(false);
  const [storageSize, setStorageSize] = useState("0 KB");
  const [localAuditLogs, setLocalAuditLogs] = useState<AuditLog[]>([]);
  
  const [profile, setProfile] = useState({
    name: "Dipanshu",
    targetExam: "SBI PO",
    targetDate: "2025-11-15",
    dailyStudyHours: "8",
    preferredTiming: "Early Morning",
    weakSubjects: "Arithmetic, Puzzles",
    strongSubjects: "Syllogism, English Grammar",
  });

  const userRef = useMemoFirebase(() =>  user && db ? doc(db, 'users', user.uid) : null, [db, user]);
  const { data: cloudProfile } = useDoc(userRef);

  const auditQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'users', user.uid, 'auditLogs'), orderBy('serverTimestamp', 'desc'), limit(50));
  }, [db, user]);
  const { data: cloudAuditLogs } = useCollection<AuditLog>(auditQuery);

  const refreshLocalLogs = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem("elite-audit-logs");
      if (saved) {
        const logs: AuditLog[] = JSON.parse(saved);
        const twelveHoursAgo = Date.now() - (12 * 60 * 60 * 1000);
        const purged = logs.filter(l => l.createdAt && l.createdAt > twelveHoursAgo);
        if (purged.length !== logs.length) localStorage.setItem("elite-audit-logs", JSON.stringify(purged));
        setLocalAuditLogs(purged);
      }
    } catch (e) { console.warn("Audit log refresh failed"); }
  }, []);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("elite-user-profile");
    if (saved) { try { setProfile(JSON.parse(saved)); } catch (e) {} }
    refreshLocalLogs();
    
    let total = 0;
    for (let x in localStorage) {
      if (Object.prototype.hasOwnProperty.call(localStorage, x)) total += (localStorage[x].length + x.length) * 2;
    }
    setStorageSize((total / 1024).toFixed(2) + " KB");

    window.addEventListener('elite-audit-updated', refreshLocalLogs);
    return () => window.removeEventListener('elite-audit-updated', refreshLocalLogs);
  }, [refreshLocalLogs]);

  useEffect(() => {
    if (cloudProfile?.profile) {
      setProfile(cloudProfile.profile);
      localStorage.setItem("elite-user-profile", JSON.stringify(cloudProfile.profile));
    }
  }, [cloudProfile]);

  const displayLogs = user ? (cloudAuditLogs && cloudAuditLogs.length > 0 ? cloudAuditLogs : localAuditLogs) : localAuditLogs;

  const handleSave = async () => {
    localStorage.setItem("elite-user-profile", JSON.stringify(profile));
    if (user && db) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, { profile, lastUpdated: new Date() }, { merge: true });
        toast({ title: "Protocol Synchronized", description: "Local Vault and Cloud Uplink updated." });
      } catch (err: any) {
        toast({ variant: "destructive", title: "Sync Fault", description: err.message });
      }
    }
    logAuditAction("Settings", "Profile Sync", `Operational parameters synchronized. Target: ${profile.targetExam}`);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    logAuditAction("Security", "Cloud Uplink severed", "Manual sign-out initiated.");
    toast({ title: "Cloud Uplink Severed", description: "Operational mode switched to Local Only." });
  };

  const handleExport = () => {
    if (typeof window === 'undefined') return;
    const data = {
      profile,
      mocks: JSON.parse(localStorage.getItem("elite-mock-logs") || "[]"),
      mistakes: JSON.parse(localStorage.getItem("elite-mistakes") || "[]"),
      accuracyLogs: JSON.parse(localStorage.getItem("accuracy-logs") || "[]"),
      syllabus: JSON.parse(localStorage.getItem("elite-syllabus-v2") || "[]"),
      auditLogs: displayLogs,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `elite-terminal-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    logAuditAction("Strategic", "Export initiated", "Full performance dossier generated.");
    toast({ title: "Dossier Generated", description: "Operational data exported to JSON." });
  };

  const clearAuditLog = () => {
    localStorage.setItem("elite-audit-logs", "[]");
    setLocalAuditLogs([]);
    logAuditAction("System", "Log Purge", "Audit archives cleared manually.");
    toast({ title: "Archives Cleared", description: "Tactical audit log purged from Local Vault." });
  };

  if (!mounted) return null;

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 px-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
             <div className="h-1 w-10 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.6)]" />
             <span className="text-[10px] text-primary font-black uppercase tracking-[0.3em]">Operational L1</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-headline font-black tracking-tighter text-foreground leading-none">Terminal <span className="text-primary italic">Settings</span></h2>
        </div>
        
        <Card className="bg-primary/5 border-2 border-primary/20 rounded-[2rem] p-5 flex items-center gap-5 shadow-xl backdrop-blur-xl">
          {user ? (
            <>
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary border-2 border-primary/40 overflow-hidden shadow-inner shrink-0">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="User" referrerPolicy="no-referrer" />
                ) : (
                  <UserIcon className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Supabase Uplink Active</div>
                <div className="text-sm font-black truncate max-w-[140px] tracking-tight">
                  {user.displayName || user.email || "Elite Aspirant"}
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleSignOut} className="text-muted-foreground hover:text-destructive h-10 w-10 rounded-xl hover:bg-destructive/10 transition-colors">
                <LogOut className="w-5 h-5" />
              </Button>
            </>
          ) : (
             <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-4">Local Mode Active</div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <Card className="bento-card border-none bg-card/60 backdrop-blur-xl shadow-2xl overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-inner shrink-0"><UserIcon className="w-6 h-6" /></div>
               <CardTitle className="text-2xl font-headline font-black tracking-tight">Aspirant Profile</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-4 space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Identity Tag</label>
              <Input value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="rounded-2xl h-14 bg-accent/30 border-none font-bold shadow-inner" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Target Milestone</label>
              <Select value={profile.targetExam} onValueChange={(v) => setProfile({...profile, targetExam: v})}>
                <SelectTrigger className="rounded-2xl h-14 bg-accent/30 border-none font-bold shadow-inner"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-2xl">
                  {EXAM_TYPES.map(e => <SelectItem key={e} value={e} className="font-bold">{e}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Peak Operational Window</label>
              <Select value={profile.preferredTiming} onValueChange={(val) => setProfile({...profile, preferredTiming: val})}>
                <SelectTrigger className="rounded-2xl h-14 bg-accent/30 border-none font-bold shadow-inner"><SelectValue /></SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-2xl">
                  <SelectItem value="Early Morning" className="font-bold">Early Morning (4AM - 8AM)</SelectItem>
                  <SelectItem value="Morning" className="font-bold">Standard Morning</SelectItem>
                  <SelectItem value="Evening" className="font-bold">Evening Flow</SelectItem>
                  <SelectItem value="Night" className="font-bold">Night Owl (10PM+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8 lg:space-y-12">
          <Card className="bento-card border-none bg-slate-900 shadow-2xl overflow-hidden group">
            <CardHeader className="p-8 pb-4">
               <div className="flex items-center gap-4">
                 <div className="p-3 bg-primary/20 rounded-2xl text-primary shadow-inner shrink-0"><Database className="w-6 h-6" /></div>
                 <CardTitle className="text-xl font-headline font-black text-white tracking-tight leading-none">Hybrid Vault</CardTitle>
               </div>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-8">
               <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4 shadow-inner">
                  <div className="flex justify-between items-center">
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none">Storage Status</span>
                     <Badge variant="outline" className={user ? "bg-primary/10 text-primary border-primary/40 text-[9px] font-black py-1 px-3" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/40 text-[9px] font-black py-1 px-3"}>
                       {user ? "SYNCED" : "OFFLINE"}
                     </Badge>
                  </div>
                  <div className="flex justify-between items-center border-t border-white/5 pt-4">
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none">Vault Saturation</span>
                     <span className="text-sm font-black text-white tracking-tighter">{storageSize}</span>
                  </div>
               </div>
               <p className="text-[11px] text-slate-500 leading-relaxed italic border-l-2 border-white/10 pl-4">
                 Auth provided by Supabase. Data archived in Firestore and mirrored locally for cross-device operational continuity.
               </p>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button onClick={handleSave} className="rounded-2xl h-16 bg-primary text-primary-foreground font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-primary/30 active:scale-[0.98] transition-all">
              <Save className="w-5 h-5 mr-3" /> Synchronize
            </Button>
            <Button onClick={handleExport} variant="outline" className="rounded-2xl h-16 border-2 border-border/60 font-black uppercase text-[11px] tracking-[0.2em] hover:bg-accent active:scale-[0.98] transition-all group">
              <Download className="w-5 h-5 mr-3 group-hover:translate-y-0.5 transition-transform" /> Export Report
            </Button>
          </div>
        </div>
      </div>

      <Card className="bento-card border-none bg-slate-900 shadow-2xl overflow-hidden group">
        <CardHeader className="bg-white/5 p-6 lg:p-8 border-b border-white/5 flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-primary/20 rounded-xl text-primary shrink-0"><History className="w-5 h-5" /></div>
            <CardTitle className="text-xl font-headline font-black text-white tracking-tight">Audit Archive</CardTitle>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/40 text-[8px] font-black py-1 px-3 uppercase tracking-widest hidden sm:flex">
              12H Auto-Purge Active
            </Badge>
            <Button variant="ghost" size="sm" onClick={clearAuditLog} className="text-[10px] font-black uppercase text-slate-500 hover:text-destructive h-10 px-4 rounded-xl hover:bg-destructive/10">
              <Trash2 className="w-4 h-4 mr-2" /> Purge Logs
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px]">
            {displayLogs && displayLogs.length > 0 ? (
              <div className="divide-y divide-white/5">
                {displayLogs.map((log) => (
                  <div key={log.id} className="p-6 lg:px-10 hover:bg-white/[0.02] transition-colors group/item">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/40 text-[8px] font-black h-5 px-2.5 uppercase tracking-widest">{log.category}</Badge>
                        <span className="text-base font-black text-white tracking-tight">{log.action}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 font-bold uppercase shrink-0">{log.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic ml-2 border-l border-white/10 pl-5 py-1">
                      {log.details}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[400px] flex flex-col items-center justify-center p-12 text-center">
                 <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-8 opacity-20 shadow-inner">
                    <ShieldCheck className="w-8 h-8" />
                 </div>
                 <p className="text-[12px] font-black uppercase tracking-[0.4em] text-white/20 leading-none">Log Vault Clear</p>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-white/10 mt-4 max-w-[200px]">Tactical interactions will be recorded here for performance diagnostics.</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

const EXAM_TYPES = [
  "SBI PO", "IBPS PO", "SBI Clerk", "IBPS Clerk", 
  "RBI Grade B", "RBI Assistant", "RRB PO", "RRB Clerk", "Other"
];
