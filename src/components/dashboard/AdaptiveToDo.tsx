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
  
  // Manual Input State
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
    
    // 1. Get data from logs
    const mockLogs = JSON.parse(localStorage.getItem("elite-mock-logs") || "[]");

    // 2. Aggregate manual weak areas and low-accuracy topics
    const weakTopics = mockLogs
      .filter((m: any) => m.accuracy < 75 || (m.weakTopics && m.weakTopics.length > 0))
      .flatMap((m: any) => m.weakTopics || []);

    // 3. Combine and deduplicate
    const uniqueWeakTopics = Array.from(new Set(weakTopics as string[]));

    const detectedWeakAreas = uniqueWeakTopics.map((topic: string) => ({
      subject: 'Exam Priority',
      chapter: topic
    }));

    return detectedWeakAreas.slice(0, 5);
  };

  const generateStrategicTasksLocally = (weakAreas: any[]) => {
    const fallbackTasks: Task[] = [];
    
    // Add up to 2 tasks from weak areas
    weakAreas.slice(0, 2).forEach(area => {
      fallbackTasks.push({
        id: Math.random().toString(36).substr(2, 9),
        subject: area.subject === 'Exam Priority' ? 'Reasoning' : area.subject,
        chapter: area.chapter,
        time: 45,
        completed: false,
        isAiSuggested: true,
        isFallback: true,
        reason: "Manual Weakness Target"
      });
    });

    // Fill the rest with high-impact defaults
    const fillers = [
      { subject: 'Quants', chapter: 'Data Interpretation (Table)', reason: 'High Exam Weightage' },
      { subject: 'Reasoning', chapter: 'Puzzles (Floor & Flat)', reason: 'Core Scoring Pillar' },
      { subject: 'Quants', chapter: 'Arithmetic core (Profit & Loss)', reason: 'Fundamental concept' }
    ];

    fillers.slice(0, 4 - fallbackTasks.length).forEach(filler => {
      fallbackTasks.push({
        id: Math.random().toString(36).substr(2, 9),
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
        availableStudyTimeMinutes: 180
      });
      
      if (result.dailyToDoList && result.dailyToDoList.length > 0) {
        const newAiTasks: Task[] = result.dailyToDoList.map(item => ({
          id: Math.random().toString(36).substr(2, 9),
          subject: item.subject,
          chapter: item.chapter,
          time: item.estimatedTimeMinutes,
          completed: false,
          isAiSuggested: true,
          reason: item.reason
        }));
        
        setTasks(prev => [...newAiTasks, ...prev.filter(t => !t.isAiSuggested)]);
        toast({ 
          title: "Strategic Intelligence Active", 
          description: "Roadmap updated via AI strategic analysis." 
        });
      }
    } catch (err: any) {
      console.error("AI Strategy Error:", err);
      const isQuotaError = err.message?.includes("429") || err.message?.includes("quota");
      
      // CODE FALLBACK: If AI fails, use the code strategist
      const fallbackTasks = generateStrategicTasksLocally(weakAreas);
      setTasks(prev => [...fallbackTasks, ...prev.filter(t => !t.isAiSuggested)]);
      
      toast({ 
        title: isQuotaError ? "Quota Limit Reached" : "Code Strategist Active", 
        description: isQuotaError 
          ? "The AI is resting due to high usage. Using local strategic logic for now."
          : "AI is busy. Using local logic to prioritize identified weak areas." 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <Card className="bento-card h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-4 bg-accent/5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <ListTodo className="w-5 h-5" />
            </div>
            <CardTitle className="text-xl font-headline font-bold">Study Roadmap</CardTitle>
          </div>
          <CardDescription className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground ml-10">
            Precision Strategic Execution
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-xl border-2 h-9 w-9">
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-3xl border-none">
              <DialogHeader>
                <DialogTitle className="text-xl font-headline font-bold">Manual Task Entry</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Topic Name</label>
                  <Input placeholder="e.g. Percentage Basics" value={newChapter} onChange={(e) => setNewChapter(e.target.value)} className="rounded-xl h-11 bg-accent/30 font-bold" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Subject</label>
                    <Select value={newSubject} onValueChange={setNewSubject}>
                      <SelectTrigger className="rounded-xl h-11 bg-accent/30 font-bold"><SelectValue /></SelectTrigger>
                      <SelectContent className="rounded-xl font-bold">
                        <SelectItem value="Reasoning">Reasoning</SelectItem>
                        <SelectItem value="Quants">Quants</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Duration (Min)</label>
                    <Input type="number" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="rounded-xl h-11 bg-accent/30 font-bold text-center" />
                  </div>
                </div>
                <Button onClick={addTask} className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20">Add to Roadmap</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm" onClick={getAiSuggestion} disabled={loading} className="rounded-xl border-2 bg-background h-9 shadow-sm group">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-primary mr-2" />}
            <span className="font-bold text-[10px] uppercase tracking-wider">Smart Strategize</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[400px] scrollbar-hide">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} className={`group relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 ${task.completed ? 'opacity-60 grayscale bg-slate-50' : task.isAiSuggested ? 'bg-primary/[0.03] border-primary/20' : 'bg-card border-border/40'}`}>
              <Checkbox id={task.id} checked={task.completed} onCheckedChange={() => toggleTask(task.id)} className="h-5 w-5 rounded-md border-2" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <label htmlFor={task.id} className={`text-sm font-bold truncate cursor-pointer ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{task.chapter}</label>
                  {task.isAiSuggested && (
                    <Badge variant="default" className="bg-primary/20 text-primary text-[7px] px-1.5 h-3.5 rounded-sm font-black uppercase tracking-tighter border-none shrink-0 flex items-center gap-1">
                      {task.isFallback ? <ShieldCheck className="w-2.5 h-2.5" /> : <Sparkles className="w-2.5 h-2.5" />}
                      {task.isFallback ? "Code Optimized" : "AI Priority"}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-bold uppercase">
                  <span className="flex items-center gap-1"><Zap className={`w-3 h-3 ${task.subject === 'Quants' ? 'text-blue-500' : 'text-purple-500'}`} />{task.subject}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{task.time}m</span>
                  {task.reason && <span className="text-primary italic normal-case truncate max-w-[150px]"> — {task.reason}</span>}
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeTask(task.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10 rounded-lg shrink-0"><Trash2 className="w-4 h-4" /></Button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground/30">
            <Brain className="w-12 h-12 mb-4 opacity-20" />
            <h4 className="font-bold text-sm text-foreground/40 uppercase tracking-widest">Roadmap Empty</h4>
            <p className="text-[10px] font-black uppercase mt-1">Use "Smart Strategize" for a plan based on manual & auto-detected weak areas</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
