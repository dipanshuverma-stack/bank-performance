"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Save, 
  Trash2, 
  Plus, 
  Target, 
  BookOpen,
  Timer as TimerIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ADDA247_SYLLABUS } from "@/lib/syllabus";
import { logAuditAction } from "@/lib/audit-logger";

export function AccuracyTimer() {
  const [mounted, setMounted] = useState(false);
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
      try { setLogs(JSON.parse(saved)); } catch (e) { console.error("Failed to parse logs"); }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("accuracy-logs", JSON.stringify(logs));
    }
  }, [logs, mounted]);

  const availableTopics = useMemo(() => {
    const subjectData = ADDA247_SYLLABUS.find(s => s.name === currentSubject);
    if (!subjectData) return [];
    return subjectData.chapters.map(chapter => ({
      chapterName: chapter.name,
      topics: chapter.subtopics
    }));
  }, [currentSubject]);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => setTime((prev) => prev + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartPause = () => setIsActive(!isActive);
  const handleReset = () => { setIsActive(false); setTime(0); };

  const handleSaveLog = () => {
    if (!currentTopic || time === 0) return;
    const newLog = {
      id: Date.now(),
      subject: currentSubject,
      topic: currentTopic,
      time: time,
      date: new Date().toLocaleDateString(),
    };
    setLogs([newLog, ...logs]);
    logAuditAction("Performance", "Practice Unit Saved", `${currentTopic} (${currentSubject}) - Time: ${formatTime(time)}`);
    handleReset();
    setCurrentTopic("");
    setIsDialogOpen(false);
  };

  const deleteLog = (id: number) => {
    const logToRemove = logs.find(l => l.id === id);
    if (logToRemove) {
      logAuditAction("Performance", "Practice Unit Purged", `${logToRemove.topic} session log removed.`);
    }
    setLogs(logs.filter(l => l.id !== id));
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <Card className="bento-card border-none shadow-xl bg-slate-50/50 dark:bg-white/5">
        <CardHeader className="bg-accent/5 py-6 border-b border-border/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-headline font-bold">Precision Console</CardTitle>
                <CardDescription className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Session Efficiency Logs</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="rounded-lg border-primary/20 text-primary font-black uppercase tracking-tighter text-[10px] h-10 px-4">
                {logs.length} Recorded Units
              </Badge>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 px-6 shadow-lg shadow-primary/20">
                    <TimerIcon className="w-4 h-4 mr-2" />
                    New Practice Session
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] rounded-3xl border-none shadow-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-headline font-bold flex items-center gap-2">
                      <Target className="w-6 h-6 text-primary" />
                      Active Precision
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col items-center py-8">
                    <div className="text-7xl font-headline font-bold text-primary mb-8 tracking-tighter tabular-nums drop-shadow-sm">
                      {formatTime(time)}
                    </div>
                    <div className="grid gap-4 w-full mb-8">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Domain</label>
                        <Select value={currentSubject} onValueChange={(val) => { setCurrentSubject(val); setCurrentTopic(""); }}>
                          <SelectTrigger className="rounded-2xl h-11 bg-accent/30 font-bold"><SelectValue /></SelectTrigger>
                          <SelectContent className="rounded-2xl">
                            <SelectItem value="Reasoning" className="font-bold">Reasoning</SelectItem>
                            <SelectItem value="Quants" className="font-bold">Quants</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Sub-Topic</label>
                        <Select value={currentTopic} onValueChange={setCurrentTopic}>
                          <SelectTrigger className="rounded-2xl h-11 bg-accent/30 font-bold"><SelectValue placeholder="Identify sub-topic..." /></SelectTrigger>
                          <SelectContent className="max-h-[300px] rounded-2xl">
                            {availableTopics.map((group, gIdx) => (
                              <SelectGroup key={gIdx}>
                                <SelectLabel className="text-[10px] uppercase tracking-tighter text-primary font-black px-2 py-1 bg-primary/5 mb-1">{group.chapterName}</SelectLabel>
                                {group.topics.map(topic => (
                                  <SelectItem key={topic.id} value={topic.name} className="text-xs font-semibold">{topic.name}</SelectItem>
                                ))}
                              </SelectGroup>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex gap-4 w-full mb-4">
                      <Button className={`flex-1 rounded-2xl h-14 font-black text-xs uppercase tracking-widest transition-all ${isActive ? 'bg-destructive/10 text-destructive border-destructive/20' : 'bg-primary text-primary-foreground'}`} onClick={handleStartPause} variant={isActive ? "outline" : "default"}>
                        {isActive ? <Pause className="w-5 h-5 mr-3" /> : <Play className="w-5 h-5 mr-3" />}
                        {isActive ? "Pause" : "Start Live"}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={handleReset} className="rounded-2xl h-14 w-14 hover:bg-accent border-2 border-transparent">
                        <RotateCcw className="w-5 h-5" />
                      </Button>
                    </div>
                    <Button className="w-full bg-success hover:bg-success/90 rounded-2xl font-black uppercase tracking-widest h-14 shadow-xl shadow-success/20 text-white disabled:opacity-30" onClick={handleSaveLog} disabled={time === 0 || !currentTopic}>
                      <Save className="w-5 h-5 mr-3" /> Archive Unit
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground/30 text-center">
              <Plus className="w-16 h-16 mb-6 opacity-20" />
              <p className="font-bold text-lg text-foreground/40 uppercase tracking-widest">No Active Sessions</p>
              <p className="text-[10px] font-black uppercase mt-2">Start a practice session to track your sub-topic speed</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
              {logs.map((log) => (
                <div key={log.id} className="group flex items-center justify-between p-5 rounded-3xl border-2 border-border/40 bg-card hover:border-primary/30 transition-all duration-300">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-foreground text-base">{log.topic}</span>
                      <Badge variant="secondary" className="text-[10px] font-black uppercase h-5 px-2 bg-primary/10 text-primary border-none">{log.subject}</Badge>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{log.date}</span>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="font-headline font-bold text-2xl text-primary tabular-nums leading-none mb-1">{formatTime(log.time)}</div>
                      <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Session Time</div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteLog(log.id)} className="opacity-0 group-hover:opacity-100 transition-all text-destructive hover:bg-destructive/10 rounded-2xl h-10 w-10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
