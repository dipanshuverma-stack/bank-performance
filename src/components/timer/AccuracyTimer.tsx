"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Play, Pause, RotateCcw, Save, Trash2, Plus, Target, BookOpen, Timer as TimerIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ADDA247_SYLLABUS } from "@/lib/syllabus";
import { logAuditAction } from "@/lib/audit-logger";
import { useUser, useFirestore } from "@/firebase";
import { doc, setDoc, deleteDoc } from "firebase/firestore";

export function AccuracyTimer() {
  const [mounted, setMounted] = useState(false);
  const { user } = useUser();
  const db = useFirestore();
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [currentSubject, setCurrentSubject] = useState("Reasoning");
  const [currentTopic, setCurrentTopic] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("accuracy-logs");
    if (saved) {
      try { setLogs(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem("accuracy-logs", JSON.stringify(logs));
  }, [logs, mounted]);

  useEffect(() => {
    if (isActive) timerRef.current = setInterval(() => setTime((prev) => prev + 1), 1000);
    else clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [isActive]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    return `${m.toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  };

  const handleSaveLog = () => {
    if (!currentTopic || time === 0) return;
    const newLog = {
      id: Date.now().toString(),
      subject: currentSubject,
      topic: currentTopic,
      time: time,
      date: new Date().toLocaleDateString(),
    };
    
    // 1. Local
    setLogs([newLog, ...logs]);

    // 2. Cloud
    if (user && db) {
      const logRef = doc(db, 'users', user.uid, 'accuracyLogs', newLog.id);
      setDoc(logRef, { ...newLog, serverTimestamp: new Date() });
    }

    logAuditAction("Performance", "Practice Logged", `${currentTopic} - ${formatTime(time)}`);
    setTime(0); setIsActive(false); setIsDialogOpen(false);
  };

  const deleteLog = (id: string) => {
    setLogs(logs.filter(l => l.id !== id));
    if (user && db) {
      const logRef = doc(db, 'users', user.uid, 'accuracyLogs', id);
      deleteDoc(logRef);
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <Card className="bento-card border-none shadow-xl bg-slate-50/50 dark:bg-white/5">
        <CardHeader className="bg-accent/5 py-6 border-b border-border/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><BookOpen className="w-6 h-6" /></div>
              <div>
                <CardTitle className="text-xl font-headline font-bold">Precision Console</CardTitle>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-2xl bg-primary text-primary-foreground font-bold h-12 px-6 shadow-lg shadow-primary/20">
                  <TimerIcon className="w-4 h-4 mr-2" /> Start Live Unit
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] rounded-3xl border-none shadow-2xl">
                <DialogHeader><DialogTitle className="text-2xl font-headline font-bold">Active Precision</DialogTitle></DialogHeader>
                <div className="flex flex-col items-center py-8">
                  <div className="text-7xl font-headline font-bold text-primary mb-8 tracking-tighter tabular-nums">{formatTime(time)}</div>
                  <div className="grid gap-4 w-full mb-8">
                    <Select value={currentSubject} onValueChange={(v) => {setCurrentSubject(v); setCurrentTopic("");}}>
                      <SelectTrigger className="rounded-2xl h-11 bg-accent/30 font-bold"><SelectValue /></SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        <SelectItem value="Reasoning">Reasoning</SelectItem>
                        <SelectItem value="Quants">Quants</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder="Topic Name" value={currentTopic} onChange={(e) => setCurrentTopic(e.target.value)} className="rounded-2xl h-11 bg-accent/30" />
                  </div>
                  <div className="flex gap-4 w-full mb-4">
                    <Button className="flex-1 rounded-2xl h-14 font-black uppercase text-xs tracking-widest" onClick={() => setIsActive(!isActive)} variant={isActive ? "outline" : "default"}>
                      {isActive ? "Pause" : "Start Live"}
                    </Button>
                    <Button variant="ghost" onClick={() => {setIsActive(false); setTime(0);}} className="rounded-2xl h-14 w-14 hover:bg-accent border-2"><RotateCcw className="w-5 h-5" /></Button>
                  </div>
                  <Button className="w-full bg-success text-white rounded-2xl h-14 font-black uppercase tracking-widest shadow-xl shadow-success/20" onClick={handleSaveLog} disabled={time === 0 || !currentTopic}>
                    <Save className="w-5 h-5 mr-3" /> Archive to Hybrid Vault
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          {logs.map((log) => (
            <div key={log.id} className="group flex items-center justify-between p-5 rounded-3xl border-2 border-border/40 bg-card hover:border-primary/30 transition-all mb-4">
              <div>
                <div className="font-bold">{log.topic}</div>
                <div className="text-[10px] text-muted-foreground font-black uppercase">{log.date} • {log.subject}</div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <div className="font-headline font-bold text-2xl text-primary">{formatTime(log.time)}</div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteLog(log.id)} className="opacity-0 group-hover:opacity-100 text-destructive"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
