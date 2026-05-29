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
  ShieldCheck
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
  
  const [newChapter, setNewChapter] = useState("");
  const [newSubject, setNewSubject] = useState("Reasoning");
  const [newTime, setNewTime] = useState("45");

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("elite-tasks");
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse tasks");
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("elite-tasks", JSON.stringify(tasks));
    }
  }, [tasks, mounted]);

  const addTask = () => {
    if (!newChapter) return;
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      subject: newSubject,
      chapter: newChapter,
      time: parseInt(newTime),
      completed: false,
    };
    setTasks([newTask, ...tasks]);
    setNewChapter("");
    setIsDialogOpen(false);
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const analyzeWeakAreasFromLogs = () => {
    if (typeof window === 'undefined') return [];
    const mockLogs = JSON.parse(localStorage.getItem("elite-mock-logs") || "[]");
    const weakTopics = mockLogs
      .filter((m: any) => m.accuracy < 75 || (m.weakTopics && m.weakTopics.length > 0))
      .flatMap((m: any) => m.weakTopics || []);
    const uniqueWeakTopics = Array.from(new Set(weakTopics as string[]));
    return uniqueWeakTopics.map((topic: string) => ({
      subject: 'Exam Priority',
      chapter: topic
    })).slice(0, 5);
  };

  const generateStrategicTasksLocally = (weakAreas: any[]) => {
    const fallbackTasks: Task[] = [];
    weakAreas.slice(0, 2).forEach(area => {
      fallbackTasks.push({
        id: "local-" + Math.random().toString(36).substr(2, 5),
        subject: area.subject === 'Exam Priority' ? 'Reasoning' : area.subject,
        chapter: area.chapter,
        time: 45,
        completed: false,
        isAiSuggested: true,
        isFallback: true,
        reason: "Strategic Weakness Target"
      });
    });
    const fillers = [
      { subject: 'Quants', chapter: 'Advanced Data Interpretation', reason: 'High Exam Weightage' },
      { subject: 'Reasoning', chapter: 'Complex Puzzles & Arrangements', reason: 'Core Scoring Pillar' },
      { subject: 'Quants', chapter: 'Arithmetic Core Mechanics', reason: 'Foundational Mastery' }
    ];
    fillers.slice(0, 4 - fallbackTasks.length).forEach(filler => {
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
    const weakAreas = analyzeWeakAreasFromLogs();
    
    try {
      const result = await generateAdaptiveToDoList({
        weakAreas: weakAreas,
        availableStudyTimeMinutes: 240
      });
      
      if (result.dailyToDoList && result.dailyToDoList.length > 0) {
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
        toast({ title: "Strategy Synchronized", description: "Strategic roadmap updated via AI uplink." });
      }
    } catch (err: any) {
      const fallbackTasks = generateStrategicTasksLocally(weakAreas);
      setTasks(prev => [...fallbackTasks, ...prev.filter(t => !t.isAiSuggested)]);
      toast({ title: "Strategic Fallback Active", description: "AI Uplink busy. Using local operational logic." });
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <Card className="bento-card h-full flex flex-col bg-card/60 backdrop-blur-3xl shadow-xl min-w-0">
      <CardHeader className="flex flex-row items-center justify-between p-6 xl:p-8 bg-accent/5 border-b border-white/5">
        <div className="flex flex-col gap-1.5 min-w-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
              <ListTodo className="w-5 h-5" />
            </div>
            <CardTitle className="text-xl font-headline font-black tracking-tight truncate">Mission Roadmap</CardTitle>
          </div>
          <CardDescription className="text-[8px] uppercase tracking-[0.3em] font-black text-muted-foreground ml-13 opacity-60">
            Daily Execution
          </CardDescription>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-xl border h-10 w-10 hover:bg-white/5 shadow-sm">
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] rounded-[2rem] p-8">
              <DialogHeader>
                <DialogTitle className="text-2xl font-headline font-black tracking-tight">Manual Entry</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Objective</label>
                  <Input placeholder="e.g. Critical Thinking Unit" value={newChapter} onChange={(e) => setNewChapter(e.target.value)} className="rounded-xl h-12 bg-accent/30 font-bold" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category</label>
                    <Select value={newSubject} onValueChange={setNewSubject}>
                      <SelectTrigger className="rounded-xl h-12 bg-accent/30 font-bold"><SelectValue /></SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="Reasoning">Reasoning</SelectItem>
                        <SelectItem value="Quants">Quants</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Min</label>
                    <Input type="number" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="rounded-xl h-12 bg-accent/30 font-bold text-center" />
                  </div>
                </div>
                <Button onClick={addTask} className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-black uppercase text-[10px] tracking-widest mt-2">Archive to Roadmap</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={getAiSuggestion} disabled={loading} className="h-10 px-4 rounded-xl border bg-background group shadow-md">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-primary mr-2 group-hover:animate-pulse" />}
            <span className="font-black text-[9px] uppercase tracking-widest hidden sm:inline">Strategize</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-6 xl:p-8 space-y-4 overflow-y-auto max-h-[500px] scrollbar-hide">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} className={`group relative flex items-center gap-4 p-5 rounded-2xl border transition-all duration-500 ${task.completed ? 'opacity-40 bg-slate-50 dark:bg-white/5 border-transparent' : task.isAiSuggested ? 'bg-primary/[0.03] border-primary/20 shadow-sm' : 'bg-card border-border/60 hover:border-primary/20'}`}>
              <Checkbox id={task.id} checked={task.completed} onCheckedChange={() => toggleTask(task.id)} className="h-6 w-6 rounded-lg border-2 transition-all duration-300 data-[state=checked]:bg-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-0.5">
                  <label htmlFor={task.id} className={`text-sm xl:text-base font-bold truncate cursor-pointer transition-all ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{task.chapter}</label>
                  {task.isAiSuggested && (
                    <Badge variant="default" className="bg-primary/10 text-primary text-[7px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest border-none shrink-0 flex items-center gap-1">
                      {task.isFallback ? <ShieldCheck className="w-2.5 h-2.5" /> : <Sparkles className="w-2.5 h-2.5" />}
                      {task.isFallback ? "Local" : "AI"}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-[9px] text-muted-foreground font-black uppercase tracking-widest opacity-60">
                  <span className="flex items-center gap-1.5"><Zap className={`w-3 h-3 ${task.subject === 'Quants' ? 'text-blue-500' : 'text-purple-500'}`} />{task.subject}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{task.time}M</span>
                  {task.reason && <span className="text-primary italic normal-case truncate max-w-[150px] opacity-90 hidden xl:inline">— {task.reason}</span>}
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeTask(task.id)} className="opacity-0 group-hover:opacity-100 transition-all text-destructive hover:bg-destructive/10 rounded-lg h-9 w-9 shrink-0"><Trash2 className="w-4 h-4" /></Button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Brain className="w-12 h-12 mb-4 opacity-10" />
            <h4 className="font-black text-sm text-foreground/30 uppercase tracking-[0.3em]">Roadmap Inactive</h4>
            <p className="text-[9px] font-black uppercase tracking-widest mt-2 opacity-20">Engage "Strategize" to begin</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
