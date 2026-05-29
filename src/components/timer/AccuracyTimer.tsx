"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  RotateCcw, Save, Trash2, BookOpen, Timer as TimerIcon, Zap, Clock
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { logAuditAction } from "@/lib/audit-logger";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { doc, setDoc, deleteDoc, collection, query, orderBy } from "firebase/firestore";
import { useMemoFirebase } from "@/firebase/use-memo-firebase";

interface AccuracyLog {
  id: string;
  subject: string;
  topic: string;
  time: number;
  date: string;
}

export function AccuracyTimer() {
  const [mounted, setMounted] = useState(false);
  const { user } = useUser();
  const db = useFirestore();
  
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [localLogs, setLocalLogs] = useState<AccuracyLog[]>([]);
  const [currentSubject, setCurrentSubject] = useState("Reasoning");
  const [currentTopic, setCurrentTopic] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const timerRef = useRef<any>(null);

  // Cloud Sync Logic
  const logsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(db, 'users', user.uid, 'accuracyLogs'), orderBy('serverTimestamp', 'desc'));
  }, [db, user]);
  
  const { data: cloudLogs } = useCollection<AccuracyLog>(logsQuery);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("accuracy-logs");
    if (saved) {
      try { setLocalLogs(JSON.parse(saved)); } catch (e) { console.error("Failed to parse local accuracy logs"); }
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => setTime((prev) => prev + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive]);

  const displayLogs = user ? cloudLogs : localLogs;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    return `${m.toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  };

  const handleSaveLog = () => {
    if (!currentTopic || time === 0) return;
    
    const newLog: AccuracyLog = {
      id: Date.now().toString(),
      subject: currentSubject,
      topic: currentTopic,
      time: time,
      date: new Date().toLocaleDateString(),
    };
    
    // 1. Update Local Vault
    const updated = [newLog, ...localLogs];
    setLocalLogs(updated);
    localStorage.setItem("accuracy-logs", JSON.stringify(updated));

    // 2. Update Cloud Vault (Asynchronous)
    if (user && db) {
      const logRef = doc(db, 'users', user.uid, 'accuracyLogs', newLog.id);
      setDoc(logRef, { 
        ...newLog, 
        serverTimestamp: new Date() 
      }).catch(err => console.warn("Cloud Sync Delay:", err));
    }

    logAuditAction("Performance", "Practice Archived", `${currentTopic} - ${formatTime(time)}`);
    
    // Reset Terminal State
    setTime(0); 
    setIsActive(false); 
    setIsDialogOpen(false);
    setCurrentTopic("");
  };

  const deleteLog = (id: string) => {
    // 1. Remove from Local
    const updated = localLogs.filter(l => l.id !== id);
    setLocalLogs(updated);
    localStorage.setItem("accuracy-logs", JSON.stringify(updated));

    // 2. Remove from Cloud
    if (user && db) {
      const logRef = doc(db, 'users', user.uid, 'accuracyLogs', id);
      deleteDoc(logRef).catch(err => console.warn("Cloud Delete Delay:", err));
    }

    logAuditAction("Performance", "Log Purged", "Practice unit removed from archives.");
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <Card className="bento-card border-none shadow-xl bg-card/40 backdrop-blur-sm">
        <CardHeader className="bg-accent/5 py-6 border-b border-border/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-[1.25rem] bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl md:text-2xl font-headline font-black tracking-tight">Precision Console</CardTitle>
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Active Mission Control</div>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-2xl bg-primary text-primary-foreground font-black uppercase text-[10px] tracking-widest h-14 px-8 shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                  <TimerIcon className="w-4 h-4 mr-3" /> Initiate Live Unit
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] border-none shadow-2xl bg-card">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-headline font-black text-center pt-4">Operational Precision</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center py-6 px-4">
                  <div className="relative mb-10">
                    <div className="text-8xl font-headline font-black text-primary tracking-tighter tabular-nums drop-shadow-2xl">
                      {formatTime(time)}
                    </div>
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                       <span className="text-[8px] font-black text-primary uppercase tracking-[0.3em]">{isActive ? "Unit in Progress" : "Terminal Paused"}</span>
                    </div>
                  </div>

                  <div className="grid gap-4 w-full mb-10">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Strategic Subject</label>
                      <Select value={currentSubject} onValueChange={(v) => setCurrentSubject(v)}>
                        <SelectTrigger className="rounded-2xl h-12 bg-accent/30 border-none font-bold shadow-inner"><SelectValue /></SelectTrigger>
                        <SelectContent className="rounded-2xl font-bold">
                          <SelectItem value="Reasoning">Reasoning</SelectItem>
                          <SelectItem value="Quants">Quants</SelectItem>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="GA">General Awareness</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Tactical Topic</label>
                      <Input 
                        placeholder="e.g. Data Interpretation" 
                        value={currentTopic} 
                        onChange={(e) => setCurrentTopic(e.target.value)} 
                        className="rounded-2xl h-12 bg-accent/30 border-none font-bold shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 w-full mb-6">
                    <Button 
                      className="flex-1 rounded-[1.5rem] h-16 font-black uppercase text-xs tracking-[0.2em] shadow-lg" 
                      onClick={() => setIsActive(!isActive)} 
                      variant={isActive ? "outline" : "default"}
                    >
                      {isActive ? "Hold Protocol" : "Engage Unit"}
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => {setIsActive(false); setTime(0);}} 
                      className="rounded-[1.5rem] h-16 w-16 hover:bg-accent border-2 transition-transform active:rotate-180 duration-500"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </Button>
                  </div>
                  
                  <Button 
                    className="w-full bg-success text-success-foreground rounded-[1.5rem] h-16 font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-success/20 transition-all hover:scale-[1.02]" 
                    onClick={handleSaveLog} 
                    disabled={time === 0 || !currentTopic}
                  >
                    <Save className="w-5 h-5 mr-3" /> Archive to Hybrid Vault
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-8">
          {displayLogs.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {displayLogs.map((log) => (
                <div key={log.id} className="group relative flex items-center justify-between p-6 rounded-[2rem] border-2 border-border/40 bg-card hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-xl">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center text-muted-foreground group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-500">
                      {log.subject === 'Quants' ? <Zap className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="font-bold text-lg tracking-tight">{log.topic}</div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{log.date}</span>
                        <div className="w-1 h-1 rounded-full bg-border" />
                        <span className="text-[10px] text-primary font-black uppercase tracking-widest">{log.subject}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right flex flex-col items-end">
                      <div className="flex items-center gap-2 text-primary">
                        <Clock className="w-4 h-4 opacity-40" />
                        <span className="font-headline font-black text-3xl tracking-tighter tabular-nums">{formatTime(log.time)}</span>
                      </div>
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1 opacity-50">Unit Time</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteLog(log.id)} 
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive h-10 w-10 transition-all rounded-xl hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
               <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6 opacity-20">
                  <TimerIcon className="w-8 h-8" />
               </div>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30">No Operational Units Archived</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
