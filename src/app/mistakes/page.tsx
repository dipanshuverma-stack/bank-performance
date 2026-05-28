
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, AlertCircle, CheckCircle2, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Mistake {
  id: string;
  topic: string;
  type: 'Silly' | 'Concept' | 'Time' | 'Calculation';
  note: string;
  resolved: boolean;
  date: string;
}

export default function MistakesPage() {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [newTopic, setNewTopic] = useState("");
  const [newType, setNewType] = useState<any>("Silly");
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("elite-mistakes");
    if (saved) {
      try { setMistakes(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem("elite-mistakes", JSON.stringify(mistakes));
  }, [mistakes, mounted]);

  const addMistake = () => {
    if (!newTopic || !newNote) return;
    const mistake: Mistake = {
      id: Math.random().toString(36).substr(2, 9),
      topic: newTopic,
      type: newType,
      note: newNote,
      resolved: false,
      date: new Date().toLocaleDateString(),
    };
    setMistakes([mistake, ...mistakes]);
    setIsDialogOpen(false);
    setNewTopic(""); setNewNote("");
    toast({ title: "Mistake Archived", description: "This error has been logged for revision." });
  };

  const toggleResolved = (id: string) => {
    setMistakes(mistakes.map(m => m.id === id ? { ...m, resolved: !m.resolved } : m));
  };

  const deleteMistake = (id: string) => {
    setMistakes(mistakes.filter(m => m.id !== id));
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] text-primary font-black uppercase tracking-widest">Growth Engine</span>
          <h2 className="text-2xl md:text-4xl font-headline font-extrabold tracking-tight text-foreground">Mistake Journal</h2>
          <p className="text-muted-foreground max-w-xl">Archive your errors to prevent repetition. Elite performance is built on analyzed failures.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-2xl h-14 px-8 bg-destructive text-destructive-foreground font-black uppercase tracking-widest shadow-xl shadow-destructive/20">
              <Plus className="w-5 h-5 mr-3" /> Log Error
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl border-none">
            <DialogHeader><DialogTitle className="text-2xl font-bold">Log Correction Unit</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Topic/Chapter</label>
                <Input value={newTopic} onChange={(e) => setNewTopic(e.target.value)} placeholder="e.g. Syllogism Possibility" className="rounded-xl h-11 bg-accent/30 font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Error Nature</label>
                <Select value={newType} onValueChange={setNewType}>
                  <SelectTrigger className="rounded-xl h-11 bg-accent/30 font-bold"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Silly">Silly Mistake</SelectItem>
                    <SelectItem value="Concept">Conceptual Error</SelectItem>
                    <SelectItem value="Time">Time Pressure</SelectItem>
                    <SelectItem value="Calculation">Calculation Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Analysis/Correction Note</label>
                <Input value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="What went wrong? How to fix it?" className="rounded-xl h-11 bg-accent/30 font-bold" />
              </div>
              <Button onClick={addMistake} className="w-full h-12 bg-primary text-primary-foreground font-bold rounded-xl mt-4">Archive in Journal</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {mistakes.length > 0 ? (
          mistakes.map((m) => (
            <div key={m.id} className={`group flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-[2rem] border-2 transition-all duration-300 ${m.resolved ? 'bg-success/5 border-success/20 opacity-60' : 'bg-card border-border/40 hover:border-primary/30 shadow-lg'}`}>
              <div className="flex items-start gap-5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${m.resolved ? 'bg-success/20 text-success' : 'bg-destructive/10 text-destructive'}`}>
                  {m.resolved ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-lg">{m.topic}</span>
                    <Badge variant="outline" className={`text-[9px] font-black uppercase ${m.type === 'Silly' ? 'text-blue-500 border-blue-500/20' : m.type === 'Concept' ? 'text-purple-500 border-purple-500/20' : 'text-orange-500 border-orange-500/20'}`}>
                      {m.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium italic">"{m.note}"</p>
                  <div className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest mt-2">{m.date}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4 md:mt-0 ml-auto md:ml-0">
                <Button variant="ghost" size="sm" onClick={() => toggleResolved(m.id)} className={`rounded-xl h-10 px-4 font-bold ${m.resolved ? 'text-success' : 'text-primary bg-primary/5'}`}>
                  {m.resolved ? "Resolved" : "Mark Resolved"}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteMistake(m.id)} className="text-muted-foreground hover:text-destructive transition-colors rounded-xl h-10 w-10">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-24 text-center text-muted-foreground/20 uppercase tracking-[0.3em] font-black flex flex-col items-center gap-4">
             <AlertCircle className="w-16 h-16 opacity-10" />
             No mistakes logged in journal
          </div>
        )}
      </div>
    </div>
  );
}
