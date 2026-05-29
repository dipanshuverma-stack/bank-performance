"use client";

import { useState, useEffect } from "react";
import { generateAdaptiveToDoList } from "@/ai/flows/generate-adaptive-to-do-list-flow";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  ListTodo, 
  Sparkles, 
  Clock, 
  Plus, 
  Trash2, 
  Loader2,
  Brain,
  Zap,
  ShieldCheck,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  subject: string;
  chapter: string;
  time: number;
  completed: boolean;
  isAiSuggested?: boolean;
  isFallback?: boolean;
  reason?: string;
}

export function AdaptiveToDo() {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Logger State
  const [newChapter, setNewChapter] = useState("");
  const [newSubject, setNewSubject] = useState("Reasoning");
  const [newTime, setNewTime] = useState("45");

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("elite-tasks");
    if (saved) {
      try { setTasks(JSON.parse(saved)); } catch (e) { console.warn("Failed to parse tasks"); }
    }
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem("elite-tasks", JSON.stringify(tasks));
  }, [tasks, mounted]);

  const addTask = () => {
    if (!newChapter.trim()) return;
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      subject: newSubject,
      chapter: newChapter,
      time: parseInt(newTime) || 45,
      completed: false,
    };
    setTasks([newTask, ...tasks]);
    setNewChapter("");
    setIsDialogOpen(false);
    toast({ title: "Objective Added", description: "Strategic study unit archived to roadmap." });
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const generateStrategicTasksLocally = () => {
    const mockLogs = JSON.parse(localStorage.getItem("elite-mock-logs") || "[]");
    const weakTopics = mockLogs
      .filter((m: any) => m.accuracy < 75)
      .flatMap((m: any) => m.weakTopics || []);
    
    const uniqueWeak = Array.from(new Set(weakTopics as string[])).slice(0, 2);
    const fallbackTasks: Task[] = uniqueWeak.map(topic => ({
      id: "local-" + Math.random().toString(36).substr(2, 5),
      subject: 'Exam Priority',
      chapter: topic,
      time: 45,
      completed: false,
      isAiSuggested: true,
      isFallback: true,
      reason: "Diagnostic Weakness Target"
    }));

    const highImpact = [
      { subject: 'Quants', chapter: 'Compound Interest & Installments', reason: 'High Exam Weightage' },
      { subject: 'Reasoning', chapter: 'Floor-Flat Puzzles (Advanced)', reason: 'Core Scoring Pillar' }
    ];

    highImpact.slice(0, 4 - fallbackTasks.length).forEach(filler => {
      fallbackTasks.push({
        id: "local-" + Math.random().toString(36).substr(2, 5),
        subject: filler.subject,
        chapter: filler.chapter,
        time: 60,
        completed: false,
        isAiSuggested: true,
        isFallback: true,
        reason: filler.reason
      });
    });

    return fallbackTasks;
  };

  const getAiSuggestion = async () => {
    setLoading(true);
    try {
      const mockLogs = JSON.parse(localStorage.getItem("elite-mock-logs") || "[]");
      const weakAreas = mockLogs
        .filter((m: any) => m.accuracy < 75)
        .flatMap((m: any) => (m.weakTopics || []).map((t: string) => ({ subject: m.examType, chapter: t })))
        .slice(0, 5);

      const result = await generateAdaptiveToDoList({
        weakAreas: weakAreas,
        availableStudyTimeMinutes: 240
      });
      
      if (result.dailyToDoList?.length > 0) {
        const newAiTasks: Task[] = result.dailyToDoList.map(item => ({
          id: "ai-" + Math.random().toString(36).substr(2, 5),
          subject: item.subject,
          chapter: item.chapter,
          time: item.estimatedTimeMinutes,
          completed: false,
          isAiSuggested: true,
          reason: item.reason
        }));
        setTasks(prev => [...newAiTasks, ...prev.filter(t => !t.isAiSuggested)]);
        toast({ title: "Intelligence Synced", description: "Daily roadmap recalibrated via AI uplink." });
      }
    } catch (err: any) {
      const fallback = generateStrategicTasksLocally();
      setTasks(prev => [...fallback, ...prev.filter(t => !t.isAiSuggested)]);
      toast({ title: "Deterministic Fallback", description: "AI Uplink busy. Using local diagnostic logic." });
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <Card className="bento-card h-full flex flex-col bg-card/60 backdrop-blur-3xl shadow-xl min-w-0 border-white/5">
      <CardHeader className="flex flex-row items-center justify-between p-6 xl:p-8 bg-accent/5 border-b border-white/5">
        <div className="flex flex-col gap-1.5 min-w-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
              <ListTodo className="w-6 h-6" />
            </div>
            <div>
               <CardTitle className="text-2xl font-headline font-black tracking-tight truncate leading-none">Roadmap</CardTitle>
               <CardDescription className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground mt-1.5 opacity-60">Daily Execution Protocols</CardDescription>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-xl border-2 h-12 w-12 hover:bg-white/5 shadow-lg active:scale-95 transition-all">
                <Plus className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] p-10 bg-card border-none shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-3xl font-headline font-black tracking-tight">Manual Entry</DialogTitle>
              </DialogHeader>
              <div className="space-y-8 py-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Study Objective</label>
                  <Input placeholder="e.g. Critical Puzzle Drill" value={newChapter} onChange={(e) => setNewChapter(e.target.value)} className="rounded-2xl h-14 bg-accent/30 border-none font-bold shadow-inner" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Category</label>
                    <Select value={newSubject} onValueChange={setNewSubject}>
                      <SelectTrigger className="rounded-2xl h-14 bg-accent/30 border-none font-bold shadow-inner"><SelectValue /></SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-2xl">
                        <SelectItem value="Reasoning" className="font-bold">Reasoning</SelectItem>
                        <SelectItem value="Quants" className="font-bold">Quants</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Time (Min)</label>
                    <Input type="number" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="rounded-2xl h-14 bg-accent/30 border-none font-bold text-center shadow-inner" />
                  </div>
                </div>
                <Button onClick={addTask} className="w-full h-16 rounded-2xl bg-primary text-primary-foreground font-black uppercase text-[11px] tracking-[0.2em] mt-4 shadow-2xl shadow-primary/30 active:scale-[0.98]">Archive to Roadmap</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={getAiSuggestion} disabled={loading} className="h-12 px-6 rounded-xl border-2 bg-background group shadow-lg active:scale-95 transition-all">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-primary mr-3 group-hover:animate-pulse" />}
            <span className="font-black text-[10px] uppercase tracking-widest hidden sm:inline">Strategize</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-6 xl:p-8 space-y-4 overflow-y-auto max-h-[550px] scrollbar-hide">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} className={`group relative flex items-center gap-5 p-6 rounded-[1.75rem] border-2 transition-all duration-500 ${task.completed ? 'opacity-40 bg-slate-50 dark:bg-white/5 border-transparent grayscale' : task.isAiSuggested ? 'bg-primary/[0.04] border-primary/20 shadow-md' : 'bg-card border-border/40 hover:border-primary/40 shadow-sm'}`}>
              <Checkbox id={task.id} checked={task.completed} onCheckedChange={() => toggleTask(task.id)} className="h-7 w-7 rounded-xl border-2 transition-all duration-500 data-[state=checked]:bg-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <label htmlFor={task.id} className={`text-base xl:text-lg font-black tracking-tight truncate cursor-pointer transition-all ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{task.chapter}</label>
                  {task.isAiSuggested && (
                    <Badge variant="default" className="bg-primary/10 text-primary text-[7px] px-2.5 py-1 rounded-lg font-black uppercase tracking-widest border-none shrink-0 flex items-center gap-1.5">
                      {task.isFallback ? <ShieldCheck className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                      {task.isFallback ? "Local" : "AI"}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-5 text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">
                  <span className="flex items-center gap-2"><Zap className={`w-3.5 h-3.5 ${task.subject === 'Quants' ? 'text-blue-500' : 'text-purple-500'}`} />{task.subject}</span>
                  <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" />{task.time}M</span>
                  {task.reason && <span className="text-primary italic normal-case truncate max-w-[180px] opacity-80 hidden xl:inline group-hover:opacity-100 transition-opacity">— {task.reason}</span>}
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeTask(task.id)} className="opacity-0 group-hover:opacity-100 transition-all text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl h-11 w-11 shrink-0"><Trash2 className="w-5 h-5" /></Button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-[2rem] bg-accent/20 flex items-center justify-center mb-6 opacity-30 shadow-inner">
               <Brain className="w-10 h-10" />
            </div>
            <h4 className="font-black text-sm text-foreground/30 uppercase tracking-[0.4em]">Roadmap Inactive</h4>
            <p className="text-[10px] font-black uppercase tracking-widest mt-3 opacity-20 max-w-xs leading-relaxed">Engage the "Strategize" engine to generate a mission roadmap based on your latest metrics.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
