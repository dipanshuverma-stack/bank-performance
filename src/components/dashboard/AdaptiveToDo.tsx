"use client";

import { useEffect, useState } from "react";
import { generateAdaptiveToDoList } from "@/ai/flows/generate-adaptive-to-do-list-flow";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  ListTodo, 
  RefreshCw, 
  Loader2, 
  Sparkles, 
  Clock, 
  Target,
  ChevronRight,
  Brain,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

export function AdaptiveToDo() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<any[]>([]);
  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Configuration State
  const [studyMinutes, setStudyMinutes] = useState([300]);
  const [focusArea, setFocusArea] = useState("Both");
  const [goals, setGoals] = useState("");

  const refreshTasks = async (customParams?: any) => {
    setLoading(true);
    setError(null);
    try {
      const weakAreas = [
        { subject: 'Quants', chapter: 'Arithmetic Word Problems', subtopics: ['Profit, Loss & Discount'], reason: 'Accuracy volatility' },
        { subject: 'Reasoning', chapter: 'Puzzles & Seating Arrangement', subtopics: ['Circular Seating'], reason: 'High completion time' }
      ];

      const payload = {
        weakAreas: focusArea === "Both" ? weakAreas : weakAreas.filter(w => w.subject === focusArea),
        availableStudyTimeMinutes: customParams?.time || studyMinutes[0],
        studyGoals: customParams?.goals || goals || "Maximize accuracy in weak sub-topics",
        syllabusContext: "Adda247 Comprehensive Bank Exam Syllabus"
      };
      
      const result = await generateAdaptiveToDoList(payload);
      setTasks(result.dailyToDoList);
      setRecommendation(result.overallRecommendation || "");
      setIsDialogOpen(false);
    } catch (err: any) {
      console.error("Failed to generate planner:", err);
      const errorMessage = err.message?.includes("429") 
        ? "AI Busy: Too many requests. Please wait a moment and try again." 
        : "Could not generate plan. Using offline fallback.";
      
      setError(errorMessage);
      
      // Fallback data if AI fails
      setTasks([
        { subject: 'Quants', chapter: 'Number Series', taskDescription: 'Practice 20 wrong number series questions.', estimatedTimeMinutes: 30 },
        { subject: 'Reasoning', chapter: 'Syllogism', taskDescription: 'Solve 15 Only-a-Few case problems.', estimatedTimeMinutes: 25 }
      ]);
      
      toast({
        variant: "destructive",
        title: "Intelligence Offline",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshTasks();
  }, []);

  return (
    <Card className="bento-card h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-accent/5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <ListTodo className="w-5 h-5" />
            </div>
            <CardTitle className="text-xl font-headline font-bold">Daily Study Planner</CardTitle>
          </div>
          <CardDescription className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground ml-10">
            AI-Optimized Roadmap
          </CardDescription>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-xl border-2 hover:bg-primary hover:text-white transition-all gap-2 h-9">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-xs font-bold">Personalize</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-3xl">
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl">Planner Intelligence</DialogTitle>
              <DialogDescription>
                Configure your daily constraints to allow the AI to optimize your focus.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-bold flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Available Time
                  </Label>
                  <span className="text-xs font-mono bg-accent px-2 py-1 rounded-md">{studyMinutes[0]} mins</span>
                </div>
                <Slider 
                  value={studyMinutes} 
                  onValueChange={setStudyMinutes} 
                  max={600} 
                  step={30} 
                  className="py-2"
                />
              </div>
              
              <div className="space-y-3">
                <Label className="text-sm font-bold flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Primary Focus
                </Label>
                <Select value={focusArea} onValueChange={setFocusArea}>
                  <SelectTrigger className="rounded-xl border-2">
                    <SelectValue placeholder="Select Area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Quants">Quants Specialized</SelectItem>
                    <SelectItem value="Reasoning">Reasoning Intensive</SelectItem>
                    <SelectItem value="Both">Balanced (Hybrid)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-bold flex items-center gap-2">
                  <Brain className="w-4 h-4 text-primary" />
                  Specific Goal (Optional)
                </Label>
                <Input 
                  placeholder="e.g. Master Seating Arrangements" 
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  className="rounded-xl border-2"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={() => refreshTasks()} 
                disabled={loading}
                className="w-full rounded-2xl h-12 text-md font-bold shadow-lg shadow-primary/20"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
                Generate Elite Plan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent className="flex-1 p-6">
        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-primary animate-pulse" />
              </div>
              <p className="text-sm font-bold text-muted-foreground animate-pulse tracking-widest uppercase">Analyzing Weak Areas...</p>
            </div>
          ) : tasks.length > 0 ? (
            <>
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-2 text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-tight">{error}</span>
                </div>
              )}
              {recommendation && !error && (
                <div className="mb-6 p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs font-medium text-primary leading-relaxed italic">
                    {recommendation}
                  </p>
                </div>
              )}
              
              <div className="space-y-3">
                {tasks.map((task, i) => (
                  <div key={i} className="group relative flex items-start gap-4 p-4 rounded-2xl border-2 border-transparent bg-slate-50 dark:bg-white/5 hover:border-primary/20 hover:bg-white dark:hover:bg-white/10 transition-all duration-300 shadow-sm hover:shadow-md">
                    <Checkbox id={`task-${i}`} className="mt-1 h-5 w-5 rounded-md border-2" />
                    <div className="flex-1 grid gap-1.5">
                      <div className="flex items-center justify-between">
                        <label htmlFor={`task-${i}`} className="text-sm font-bold leading-none cursor-pointer group-hover:text-primary transition-colors">
                          {task.chapter}
                        </label>
                        <Badge variant="secondary" className="text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-tighter">
                          {task.subject}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-snug">
                        {task.taskDescription}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                         <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold">
                            <Clock className="w-3 h-3" />
                            {task.estimatedTimeMinutes} mins
                         </div>
                         {task.subtopic && (
                           <div className="text-[10px] text-primary/60 font-medium">
                              #{task.subtopic.replace(/\s+/g, '')}
                           </div>
                         )}
                      </div>
                    </div>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
             <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
                  <ListTodo className="w-8 h-8 text-muted-foreground/40" />
                </div>
                <h4 className="font-bold mb-1">No plan generated</h4>
                <p className="text-sm text-muted-foreground max-w-[200px]">Use the personalize button to create your daily mission.</p>
             </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}