"use client";

import { useState, useEffect } from "react";
import { generateAdaptiveToDoList } from "@/ai/flows/generate-adaptive-to-do-list-flow";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  ListTodo, 
  Sparkles, 
  Clock, 
  Plus, 
  Trash2, 
  Loader2,
  Brain,
  CheckCircle2,
  BookOpen
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
}

export function AdaptiveToDo() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Manual Input State
  const [newChapter, setNewChapter] = useState("");
  const [newSubject, setNewSubject] = useState("Reasoning");
  const [newTime, setNewTime] = useState("45");

  // Load tasks from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("elite-tasks");
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse tasks");
      }
    }
  }, []);

  // Save tasks to localStorage on change
  useEffect(() => {
    localStorage.setItem("elite-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (subject: string, chapter: string, time: number) => {
    if (!chapter) return;
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      subject,
      chapter,
      time,
      completed: false,
    };
    setTasks([newTask, ...tasks]);
    setNewChapter("");
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const getAiSuggestion = async () => {
    setLoading(true);
    try {
      const result = await generateAdaptiveToDoList({
        weakAreas: [
          { subject: 'Quants', chapter: 'Arithmetic' },
          { subject: 'Reasoning', chapter: 'Puzzles' }
        ],
        availableStudyTimeMinutes: 120
      });
      
      const suggestion = result.dailyToDoList[0];
      if (suggestion) {
        setNewChapter(suggestion.chapter);
        setNewSubject(suggestion.subject);
        setNewTime(String(suggestion.estimatedTimeMinutes || 45));
        
        toast({
          title: "AI Suggestion Ready",
          description: `Focus on ${suggestion.chapter} in ${suggestion.subject}.`,
        });
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "AI Busy",
        description: "Could not fetch suggestion. Please try manual entry.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bento-card h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-4 bg-accent/5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <ListTodo className="w-5 h-5" />
            </div>
            <CardTitle className="text-xl font-headline font-bold">Daily Study Planner</CardTitle>
          </div>
          <CardDescription className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground ml-10">
            Manual Control • AI Insights
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-6 space-y-6">
        {/* Manual Input Area */}
        <div className="space-y-4 p-4 rounded-2xl bg-accent/30 border-2 border-dashed border-border/50 group hover:border-primary/30 transition-all">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground ml-1">Chapter / Topic</label>
              <Input 
                placeholder="Enter study topic..." 
                value={newChapter}
                onChange={(e) => setNewChapter(e.target.value)}
                className="rounded-xl border-none bg-background/50 focus-visible:ring-primary shadow-sm h-11"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground ml-1">Subject</label>
                <Select value={newSubject} onValueChange={setNewSubject}>
                  <SelectTrigger className="rounded-xl border-none bg-background/50 h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Reasoning">Reasoning</SelectItem>
                    <SelectItem value="Quants">Quants</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground ml-1">Minutes</label>
                <Input 
                  type="number"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="rounded-xl border-none bg-background/50 h-11"
                />
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => addTask(newSubject, newChapter, parseInt(newTime))}
              className="flex-1 rounded-xl h-11 font-bold shadow-lg shadow-primary/20"
              disabled={!newChapter}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
            <Button 
              variant="outline" 
              onClick={getAiSuggestion}
              disabled={loading}
              className="rounded-xl h-11 border-2 bg-background hover:bg-primary/5 group/ai"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-primary group-hover/ai:animate-pulse" />}
              <span className="hidden sm:inline ml-2 font-bold text-xs">AI Suggest</span>
            </Button>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div 
                key={task.id} 
                className={`group relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 ${
                  task.completed 
                  ? 'bg-slate-50/50 dark:bg-white/5 border-transparent opacity-60' 
                  : 'bg-card border-slate-100 dark:border-white/5 hover:border-primary/20 hover:shadow-md'
                }`}
              >
                <Checkbox 
                  id={task.id} 
                  checked={task.completed} 
                  onCheckedChange={() => toggleTask(task.id)}
                  className="h-5 w-5 rounded-md border-2"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <label 
                      htmlFor={task.id} 
                      className={`text-sm font-bold truncate cursor-pointer ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}
                    >
                      {task.chapter}
                    </label>
                    <Badge variant="secondary" className="text-[8px] px-1.5 h-4 rounded-md font-black uppercase tracking-tighter shrink-0">
                      {task.subject}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold">
                    <Clock className="w-3 h-3" />
                    {task.time} minutes
                    {task.completed && (
                      <span className="flex items-center gap-1 text-success">
                        <CheckCircle2 className="w-3 h-3" />
                        Completed
                      </span>
                    )}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10 rounded-lg shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-accent/50 rounded-full flex items-center justify-center mb-4 text-muted-foreground/30">
                <BookOpen className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-sm text-foreground mb-1">No Study Tasks Yet</h4>
              <p className="text-xs text-muted-foreground max-w-[200px]">Add your own tasks or let the AI suggest your next focus area.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
