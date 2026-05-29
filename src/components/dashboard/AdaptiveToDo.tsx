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
    <Card className="bento-card h-full flex flex-col bg-card/60 backdrop-blur-3xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)]">
      <CardHeader className="flex flex-row items-center justify-between p-10 bg-accent/5 border-b border-white/5">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[1.25rem] bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <ListTodo className="w-7 h-7" />
            </div>
            <CardTitle className="text-3xl font-headline font-black tracking-tight">Mission Roadmap</CardTitle>
          </div>
          <CardDescription className="text-xs uppercase tracking-[0.4em] font-black text-muted-foreground ml-16 opacity-60">
            Tactical Daily Execution
          </CardDescription>
        </div>
        <div className="flex items-center gap-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-2xl border-2 h-12 w-12 hover:bg-white/5 shadow-lg">
                <Plus className="w-6 h-6" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] rounded-[2.5rem] border-none shadow-2xl p-10">
              <DialogHeader>
                <DialogTitle className="text-3xl font-headline font-black tracking-tight">Manual Mission Entry</DialogTitle>
              </DialogHeader>
              <div className="space-y-8 py-8">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Objective Name</label>
                  <Input placeholder="e.g. Critical Thinking Unit" value={newChapter} onChange={(e) => setNewChapter(e.target.value)} className="rounded-2xl h-14 bg-accent/30 font-bold text-lg border-none shadow-inner" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Category</label>
                    <Select value={newSubject} onValueChange={setNewSubject}>
                      <SelectTrigger className="rounded-2xl h-14 bg-accent/30 font-bold border-none shadow-inner"><SelectValue /></SelectTrigger>
                      <SelectContent className="rounded-2xl font-bold">
                        <SelectItem value="Reasoning" className="py-3">Reasoning</SelectItem>
                        <SelectItem value="Quants" className="py-3">Quants</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Duration (Min)</label>
                    <Input type="number" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="rounded-2xl h-14 bg-accent/30 font-bold text-center text-lg border-none shadow-inner" />
                  </div>
                </div>
                <Button onClick={addTask} className="w-full h-16 rounded-2xl bg-primary text-primary-foreground font-black uppercase text-sm tracking-widest shadow-2xl shadow-primary/30 mt-4 transition-all hover:scale-[1.02]">Archive to Roadmap</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={getAiSuggestion} disabled={loading} className="h-12 px-8 rounded-2xl border-2 bg-background shadow-xl group transition-all duration-500 hover:border-primary/40">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 text-primary mr-3 group-hover:animate-pulse" />}
            <span className="font-black text-xs uppercase tracking-widest">Strategize</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-10 xl:p-14 space-y-6 overflow-y-auto max-h-[600px] scrollbar-hide">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} className={`group relative flex items-center gap-8 p-8 rounded-[2rem] border-2 transition-all duration-500 ${task.completed ? 'opacity-40 grayscale bg-slate-50 dark:bg-white/5' : task.isAiSuggested ? 'bg-primary/[0.04] border-primary/30 shadow-lg shadow-primary/5' : 'bg-card border-border/60 hover:border-primary/30'}`}>
              <Checkbox id={task.id} checked={task.completed} onCheckedChange={() => toggleTask(task.id)} className="h-8 w-8 rounded-xl border-2 transition-all duration-500 data-[state=checked]:bg-primary" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-4 mb-1">
                  <label htmlFor={task.id} className={`text-xl xl:text-2xl font-black truncate cursor-pointer transition-all duration-500 ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{task.chapter}</label>
                  {task.isAiSuggested && (
                    <Badge variant="default" className="bg-primary/20 text-primary text-[10px] px-3 py-1 rounded-md font-black uppercase tracking-widest border-none shrink-0 flex items-center gap-2">
                      {task.isFallback ? <ShieldCheck className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                      {task.isFallback ? "Local Opt" : "AI Core"}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-5 text-xs text-muted-foreground font-black uppercase tracking-widest opacity-60">
                  <span className="flex items-center gap-2"><Zap className={`w-4 h-4 ${task.subject === 'Quants' ? 'text-blue-500' : 'text-purple-500'}`} />{task.subject}</span>
                  <span className="flex items-center gap-2"><Clock className="w-4 h-4" />{task.time}M</span>
                  {task.reason && <span className="text-primary italic normal-case truncate max-w-[250px] opacity-100">— {task.reason}</span>}
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeTask(task.id)} className="opacity-0 group-hover:opacity-100 transition-all text-destructive hover:bg-destructive/10 rounded-2xl h-12 w-12 duration-500"><Trash2 className="w-6 h-6" /></Button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <Brain className="w-20 h-20 mb-8 opacity-10" />
            <h4 className="font-black text-xl text-foreground/30 uppercase tracking-[0.4em]">Roadmap Inactive</h4>
            <p className="text-[11px] font-black uppercase tracking-widest mt-3 opacity-20">Engage "Strategize" to generate mission parameters</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}