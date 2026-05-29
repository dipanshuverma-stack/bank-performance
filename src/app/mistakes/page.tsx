
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, AlertCircle, CheckCircle2, Search, Filter, BookOpen, AlertOctagon, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Mistake {
  id: string;
  topic: string;
  type: 'Silly' | 'Concept' | 'Time' | 'Calculation';
  note: string;
  correctMethod: string;
  resolved: boolean;
  date: string;
}

export default function MistakesPage() {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  
  const [newTopic, setNewTopic] = useState("");
  const [newType, setNewType] = useState<any>("Silly");
  const [newNote, setNewNote] = useState("");
  const [newCorrectMethod, setNewCorrectMethod] = useState("");

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
      correctMethod: newCorrectMethod,
      resolved: false,
      date: new Date().toLocaleDateString(),
    };
    setMistakes([mistake, ...mistakes]);
    setIsDialogOpen(false);
    setNewTopic(""); setNewNote(""); setNewCorrectMethod("");
    toast({ title: "Mistake Archived", description: "Strategic correction unit saved to journal." });
  };

  const toggleResolved = (id: string) => {
    setMistakes(mistakes.map(m => m.id === id ? { ...m, resolved: !m.resolved } : m));
  };

  const deleteMistake = (id: string) => {
    setMistakes(mistakes.filter(m => m.id !== id));
  };

  const filteredMistakes = mistakes.filter(m => {
    const matchesSearch = m.topic.toLowerCase().includes(searchQuery.toLowerCase()) || m.note.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "All" || m.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const analytics = {
    silly: mistakes.filter(m => m.type === 'Silly').length,
    concept: mistakes.filter(m => m.type === 'Concept').length,
    time: mistakes.filter(m => m.type === 'Time').length,
    calc: mistakes.filter(m => m.type === 'Calculation').length,
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] text-primary font-black uppercase tracking-widest">Growth Analytics</span>
          <h2 className="text-2xl md:text-4xl font-headline font-extrabold tracking-tight text-foreground">Mistake Intelligence</h2>
          <p className="text-muted-foreground max-w-xl">Archive your errors to prevent repetition. Elite performance is built on analyzed failures.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-2xl h-14 px-8 bg-destructive text-destructive-foreground font-black uppercase tracking-widest shadow-xl shadow-destructive/20 transition-all hover:scale-[1.02]">
              <Plus className="w-5 h-5 mr-3" /> Archive Error
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl border-none shadow-2xl max-w-2xl overflow-y-auto max-h-[90vh]">
            <DialogHeader><DialogTitle className="text-2xl font-bold">Strategic Correction Unit</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Error Analysis</label>
                <Textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="What went wrong specifically?" className="rounded-xl min-h-[80px] bg-accent/30 font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-success">Correct Strategic Method</label>
                <Textarea value={newCorrectMethod} onChange={(e) => setNewCorrectMethod(e.target.value)} placeholder="How to solve this correctly next time?" className="rounded-xl min-h-[80px] bg-success/5 border-success/20 font-bold" />
              </div>
              <Button onClick={addMistake} className="w-full h-14 bg-primary text-primary-foreground font-black uppercase tracking-widest rounded-2xl mt-4 shadow-xl shadow-primary/20">Archive in Journal</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Silly Mistakes", val: analytics.silly, color: "text-blue-500 bg-blue-500/10" },
          { label: "Concept Gaps", val: analytics.concept, color: "text-purple-500 bg-purple-500/10" },
          { label: "Time Pressure", val: analytics.time, color: "text-orange-500 bg-orange-500/10" },
          { label: "Calc Errors", val: analytics.calc, color: "text-rose-500 bg-rose-500/10" },
        ].map((stat, i) => (
          <div key={i} className={`p-4 rounded-3xl border ${stat.color} border-current/10 flex flex-col items-center justify-center text-center`}>
            <div className="text-2xl font-black">{stat.val}</div>
            <div className="text-[9px] font-black uppercase tracking-widest opacity-80">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search journal..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12 rounded-2xl h-12 bg-card/50" />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full md:w-[200px] rounded-2xl h-12 bg-card/50 font-bold"><SelectValue /></SelectTrigger>
          <SelectContent className="rounded-xl font-bold">
            <SelectItem value="All">All Types</SelectItem>
            <SelectItem value="Silly">Silly</SelectItem>
            <SelectItem value="Concept">Concept</SelectItem>
            <SelectItem value="Time">Time</SelectItem>
            <SelectItem value="Calculation">Calculation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredMistakes.length > 0 ? (
          filteredMistakes.map((m) => (
            <Card key={m.id} className={`group bento-card border-2 transition-all duration-300 ${m.resolved ? 'bg-success/5 border-success/20 opacity-60' : 'bg-card border-border/40 hover:border-primary/30 shadow-lg'}`}>
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                  <div className="flex gap-5 flex-1">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${m.resolved ? 'bg-success/20 text-success' : 'bg-destructive/10 text-destructive'}`}>
                      {m.resolved ? <CheckCircle2 className="w-6 h-6" /> : <AlertOctagon className="w-6 h-6" />}
                    </div>
                    <div className="space-y-4 flex-1">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-xl">{m.topic}</span>
                          <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-widest">{m.type}</Badge>
                        </div>
                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{m.date}</div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 rounded-2xl bg-accent/30 border border-border/50">
                           <div className="text-[9px] font-black text-destructive uppercase tracking-widest mb-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Problem Analysis</div>
                           <p className="text-sm font-medium italic">"{m.note}"</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-success/5 border border-success/20">
                           <div className="text-[9px] font-black text-success uppercase tracking-widest mb-2 flex items-center gap-1"><Brain className="w-3 h-3" /> Corrective Strategy</div>
                           <p className="text-sm font-bold text-foreground">{m.correctMethod || "No method recorded."}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <Button variant="outline" onClick={() => toggleResolved(m.id)} className={`rounded-xl h-10 px-4 font-black uppercase tracking-widest text-[10px] border-2 ${m.resolved ? 'text-success border-success/20' : 'text-primary border-primary/20'}`}>
                      {m.resolved ? "Resolved" : "Active Error"}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteMistake(m.id)} className="text-muted-foreground hover:text-destructive transition-colors rounded-xl h-10 w-10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="py-24 text-center text-muted-foreground/20 uppercase tracking-[0.3em] font-black flex flex-col items-center gap-4">
             <BookOpen className="w-16 h-16 opacity-10" />
             Journal entries not found
          </div>
        )}
      </div>
    </div>
  );
}
