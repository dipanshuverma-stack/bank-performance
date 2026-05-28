"use client";

import { Card, CardContent } from "@/components/ui/card";
import { UPCOMING_EXAMS } from "@/lib/mock-data";
import { Timer, CalendarDays, Settings2, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Exam {
  name: string;
  date: string;
  icon: string;
  days?: number;
}

export function CountdownCard() {
  const { toast } = useToast();
  const [exams, setExams] = useState<Exam[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newIcon, setNewIcon] = useState("🏦");

  // Load from localStorage or defaults
  useEffect(() => {
    const saved = localStorage.getItem("elite-exams");
    if (saved) {
      try {
        setExams(JSON.parse(saved));
      } catch (e) {
        setExams(UPCOMING_EXAMS);
      }
    } else {
      setExams(UPCOMING_EXAMS);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (exams.length > 0) {
      localStorage.setItem("elite-exams", JSON.stringify(exams));
    }
  }, [exams]);

  const examCountdowns = exams.map(exam => {
    const diff = new Date(exam.date).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return { ...exam, days };
  }).sort((a, b) => (a.days || 0) - (b.days || 0));

  const addExam = () => {
    if (!newName || !newDate) {
      toast({
        variant: "destructive",
        title: "Missing Info",
        description: "Please provide an exam name and date.",
      });
      return;
    }
    const newExam: Exam = { name: newName, date: newDate, icon: newIcon };
    setExams([...exams, newExam]);
    setNewName("");
    setNewDate("");
    toast({
      title: "Exam Tracked",
      description: `${newName} has been added to your target list.`,
    });
  };

  const removeExam = (name: string) => {
    setExams(exams.filter(e => e.name !== name));
  };

  return (
    <Card className="bento-card bg-slate-950 dark:bg-slate-900 border-none shadow-2xl shadow-slate-300 dark:shadow-none group transition-all duration-500 overflow-visible">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 dark:bg-primary/10 p-2.5 rounded-2xl text-primary transition-all group-hover:scale-110">
              <Timer className="w-5 h-5" />
            </div>
            <h3 className="font-headline text-lg font-bold tracking-tight text-white">Exam Countdown</h3>
          </div>
          
          <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                <Settings2 className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-3xl border-none shadow-2xl bg-card">
              <DialogHeader>
                <DialogTitle className="text-xl font-headline font-bold">Exam Target Editor</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-4 p-4 rounded-2xl bg-accent/30 border border-border/50">
                  <div className="grid gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Exam Name</label>
                      <Input 
                        placeholder="e.g. SBI PO Prelims" 
                        value={newName} 
                        onChange={(e) => setNewName(e.target.value)}
                        className="rounded-xl border-none h-11 bg-background font-bold text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Target Date</label>
                        <Input 
                          type="date" 
                          value={newDate} 
                          onChange={(e) => setNewDate(e.target.value)}
                          className="rounded-xl border-none h-11 bg-background font-bold text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Icon</label>
                        <Input 
                          placeholder="🏦, 📝, 🏛️" 
                          value={newIcon} 
                          onChange={(e) => setNewIcon(e.target.value)}
                          className="rounded-xl border-none h-11 bg-background text-center text-lg"
                        />
                      </div>
                    </div>
                    <Button onClick={addExam} className="w-full rounded-xl font-bold h-11 bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                      <Plus className="w-4 h-4 mr-2" />
                      Add to Schedule
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 scrollbar-hide">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Active Targets</label>
                  {exams.map((exam, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-accent/20 border border-border/20 group/row">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{exam.icon}</span>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-foreground">{exam.name}</span>
                          <span className="text-[10px] text-muted-foreground font-medium">{exam.date}</span>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeExam(exam.name)}
                        className="h-8 w-8 text-destructive opacity-0 group-hover/row:opacity-100 hover:bg-destructive/10 rounded-lg transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="space-y-7">
          {examCountdowns.length > 0 ? (
            examCountdowns.map((exam, i) => (
              <div key={i} className="flex items-center justify-between border-b border-white/10 pb-5 last:border-0 last:pb-0 group/item">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center text-2xl group-hover/item:scale-110 transition-transform border border-white/5">
                    {exam.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white group-hover/item:text-primary transition-colors">{exam.name}</span>
                    <span className="text-[9px] text-slate-400 uppercase tracking-[0.2em] font-black">Target Milestone</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-4xl font-headline font-bold tracking-tighter leading-none text-white tabular-nums">
                    {exam.days !== undefined && exam.days > 0 ? `${exam.days}d` : exam.days === 0 ? 'Now' : 'Done'}
                  </span>
                  <span className="text-[9px] text-primary uppercase tracking-[0.2em] font-black mt-1.5 opacity-80">
                    {exam.days !== undefined && exam.days > 0 ? 'Remaining' : 'In Progress'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-white/30 text-sm font-bold flex flex-col items-center gap-3">
              <CalendarDays className="w-8 h-8 opacity-20" />
              <p className="uppercase tracking-widest text-[10px]">No active exam targets</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}