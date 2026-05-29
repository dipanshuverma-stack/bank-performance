"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, AlertCircle, CheckCircle2, Search, BookOpen, AlertOctagon, Brain, Filter, X, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { logAuditAction } from "@/lib/audit-logger";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { doc, setDoc, collection, deleteDoc, query, orderBy } from "firebase/firestore";

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
  const { user } = useUser();
  const db = useFirestore();
  
  const [mounted, setMounted] = useState(false);
  const [localMistakes, setLocalMistakes] = useState<Mistake[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  
  const [newTopic, setNewTopic] = useState("");
  const [newType, setNewType] = useState<any>("Silly");
  const [newNote, setNewNote] = useState("");
  const [newCorrectMethod, setNewCorrectMethod] = useState("");

  const mistakesQuery = useMemoFirebase(() => {
    if (!user || !db) return null;
    return query(collection(db, 'users', user.uid, 'mistakes'), orderBy('serverTimestamp', 'desc'));
  }, [db, user]);
  
  const { data: cloudMistakes } = useCollection<Mistake>(mistakesQuery);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("elite-mistakes");
    if (saved) {
      try { setLocalMistakes(JSON.parse(saved)); } catch (e) { console.warn("Failed to parse local mistakes"); }
    }
  }, []);

  const mistakes = (user && cloudMistakes && cloudMistakes.length > 0) ? cloudMistakes : localMistakes;

  const addMistake = () => {
    if (!newTopic.trim() || !newNote.trim()) {
      toast({ variant: "destructive", title: "Metadata Missing", description: "Topic and Analysis are required for archival." });
      return;
    }
    const mistake: Mistake = {
      id: Math.random().toString(36).substr(2, 9),
      topic: newTopic,
      type: newType,
      note: newNote,
      correctMethod: newCorrectMethod,
      resolved: false,
      date: new Date().toLocaleDateString(),
    };

    const updated = [mistake, ...localMistakes];
    setLocalMistakes(updated);
    localStorage.setItem("elite-mistakes", JSON.stringify(updated));

    if (user && db) {
      const mistakeRef = doc(db, 'users', user.uid, 'mistakes', mistake.id);
      setDoc(mistakeRef, { ...mistake, serverTimestamp: new Date() }, { merge: true });
    }

    setIsDialogOpen(false);
    logAuditAction("Journal", "Mistake Archived", `${newTopic} (${newType}) unit archived in journal.`);
    
    setNewTopic(""); setNewNote(""); setNewCorrectMethod("");
    toast({ title: "Mistake Archived", description: "Strategic correction unit secured in Tactical Journal." });
  };

  const toggleResolved = (id: string) => {
    const updated = localMistakes.map(m => {
      if (m.id === id) {
        const newState = !m.resolved;
        logAuditAction("Journal", "Status Update", `${m.topic} marked as ${newState ? 'Resolved' : 'Active'}`);
        
        if (user && db) {
          const mistakeRef = doc(db, 'users', user.uid, 'mistakes', id);
          setDoc(mistakeRef, { resolved: newState }, { merge: true });
        }
        
        return { ...m, resolved: newState };
      }
      return m;
    });
    setLocalMistakes(updated);
    localStorage.setItem("elite-mistakes", JSON.stringify(updated));
  };

  const deleteMistake = (id: string) => {
    const updated = localMistakes.filter(m => m.id !== id);
    setLocalMistakes(updated);
    localStorage.setItem("elite-mistakes", JSON.stringify(updated));

    if (user && db) {
      const mistakeRef = doc(db, 'users', user.uid, 'mistakes', id);
      deleteDoc(mistakeRef);
    }

    logAuditAction("Journal", "Record Purged", "Mistake unit removed from Tactical Journal.");
    toast({ title: "Record Purged", description: "Operational error entry removed from archives." });
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
    <div className="space-y-10 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
             <div className="h-1 w-8 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.6)]" />
             <span className="text-[10px] text-primary font-black uppercase tracking-[0.3em]">Operational Readiness</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-headline font-black tracking-tighter text-foreground leading-none">Tactical <span className="text-primary italic">Journal</span></h2>
          <p className="text-muted-foreground max-w-xl font-medium text-sm mt-2 leading-relaxed">Elite performance is built on analyzed failures. Archive every error to prevent strategic repetition.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-[1.5rem] h-16 px-10 bg-destructive text-destructive-foreground font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-destructive/30 transition-all hover:scale-[1.02] active:scale-[0.98]">
              <Plus className="w-5 h-5 mr-3" /> Archive Error
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-[2.5rem] border-none shadow-2xl max-w-2xl bg-card overflow-y-auto max-h-[90vh]">
            <DialogHeader><DialogTitle className="text-3xl font-headline font-black tracking-tight">Struggle Archive</DialogTitle></DialogHeader>
            <div className="space-y-8 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Topic / Chapter</label>
                  <Input value={newTopic} onChange={(e) => setNewTopic(e.target.value)} placeholder="e.g. Syllogism Possibility" className="rounded-2xl h-14 bg-accent/30 border-none font-bold shadow-inner" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Error Classification</label>
                  <Select value={newType} onValueChange={setNewType}>
                    <SelectTrigger className="rounded-2xl h-14 bg-accent/30 border-none font-bold shadow-inner"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl font-bold">
                      <SelectItem value="Silly">Silly Mistake</SelectItem>
                      <SelectItem value="Concept">Conceptual Error</SelectItem>
                      <SelectItem value="Time">Time Pressure</SelectItem>
                      <SelectItem value="Calculation">Calculation Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-destructive ml-1">Problem Analysis</label>
                <Textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="What went wrong specifically? Document the logic gap." className="rounded-2xl min-h-[100px] bg-destructive/5 border-2 border-destructive/10 font-bold shadow-inner py-4" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-success ml-1">Corrective Strategy</label>
                <Textarea value={newCorrectMethod} onChange={(e) => setNewCorrectMethod(e.target.value)} placeholder="How to solve this correctly next time? Define the protocol." className="rounded-2xl min-h-[100px] bg-success/5 border-2 border-success/10 font-bold shadow-inner py-4" />
              </div>
              <Button onClick={addMistake} className="w-full h-16 bg-primary text-primary-foreground font-black uppercase text-[12px] tracking-[0.2em] rounded-2xl mt-4 shadow-2xl shadow-primary/30 transition-all active:scale-[0.98]">Commit to Journal</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Silly Hits", val: analytics.silly, color: "text-blue-500 bg-blue-500/5 border-blue-500/20" },
          { label: "Concept Gaps", val: analytics.concept, color: "text-purple-500 bg-purple-500/5 border-purple-500/20" },
          { label: "Time Pressure", val: analytics.time, color: "text-orange-500 bg-orange-500/5 border-orange-500/20" },
          { label: "Calc Errors", val: analytics.calc, color: "text-rose-500 bg-rose-500/5 border-rose-500/20" },
        ].map((stat, i) => (
          <div key={i} className={`p-6 rounded-[2rem] border-2 ${stat.color} flex flex-col items-center justify-center text-center shadow-sm group hover:scale-[1.02] transition-all`}>
            <div className="text-4xl font-headline font-black tracking-tighter mb-1 tabular-nums">{stat.val}</div>
            <div className="text-[9px] font-black uppercase tracking-[0.3em] opacity-60 leading-none">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-center">
        <div className="relative w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground opacity-40" />
          <Input placeholder="Search archives for topics or notes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-14 rounded-2xl h-14 bg-card/60 backdrop-blur-xl border-border/40 font-bold focus:ring-4 ring-primary/10 shadow-lg" />
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="bg-card/60 backdrop-blur-xl rounded-2xl border-2 border-border/40 p-1.5 flex items-center h-14 shadow-lg shrink-0">
             <Filter className="w-4 h-4 text-muted-foreground ml-3 mr-2 opacity-40" />
             <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px] border-none font-black uppercase text-[10px] tracking-widest focus:ring-0 shadow-none"><SelectValue /></SelectTrigger>
              <SelectContent className="rounded-2xl font-black uppercase text-[10px] tracking-widest border-none shadow-2xl">
                <SelectItem value="All">All Anomalies</SelectItem>
                <SelectItem value="Silly">Silly Mistakes</SelectItem>
                <SelectItem value="Concept">Conceptual Gaps</SelectItem>
                <SelectItem value="Time">Time Violations</SelectItem>
                <SelectItem value="Calculation">Calc Failures</SelectItem>
              </SelectContent>
            </Select>
          </div>
          { (searchQuery || filterType !== 'All') && (
            <Button variant="ghost" onClick={() => { setSearchQuery(""); setFilterType("All"); }} className="h-14 w-14 rounded-2xl bg-card/60 border-2 border-border/40 text-muted-foreground hover:text-foreground shrink-0"><X className="w-5 h-5" /></Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredMistakes.length > 0 ? (
          filteredMistakes.map((m) => (
            <Card key={m.id} className={`group bento-card border-2 transition-all duration-500 ${m.resolved ? 'bg-success/5 border-success/10 opacity-60 scale-[0.98]' : 'bg-card/60 border-border/40 hover:border-primary/40 shadow-xl'}`}>
              <CardContent className="p-6 md:p-10">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                  <div className="flex gap-8 flex-1">
                    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shrink-0 shadow-inner transition-transform duration-700 group-hover:scale-105 ${m.resolved ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                      {m.resolved ? <CheckCircle2 className="w-8 h-8" /> : <AlertOctagon className="w-8 h-8 animate-pulse" />}
                    </div>
                    <div className="space-y-6 flex-1 min-w-0">
                      <div>
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <span className="font-black text-2xl tracking-tight text-foreground">{m.topic}</span>
                          <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-[0.2em] h-5 px-3 bg-accent/60 border-none">{m.type}</Badge>
                        </div>
                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-60">{m.date} Archive Unit</div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
                        <div className="p-6 rounded-[2rem] bg-destructive/[0.03] border-2 border-destructive/5 relative overflow-hidden group/box">
                           <div className="text-[9px] font-black text-destructive uppercase tracking-[0.3em] mb-3 flex items-center gap-2 relative z-10"><AlertCircle className="w-3.5 h-3.5" /> Problem Analysis</div>
                           <p className="text-sm font-bold italic leading-relaxed text-foreground/80 relative z-10">"{m.note}"</p>
                           <AlertOctagon className="absolute bottom-[-20px] right-[-20px] w-32 h-32 text-destructive/5 rotate-12 transition-transform duration-1000 group-hover/box:scale-110" />
                        </div>
                        <div className="p-6 rounded-[2rem] bg-success/[0.03] border-2 border-success/5 relative overflow-hidden group/box">
                           <div className="text-[9px] font-black text-success uppercase tracking-[0.3em] mb-3 flex items-center gap-2 relative z-10"><Brain className="w-3.5 h-3.5" /> Corrective Protocol</div>
                           <p className="text-sm font-black text-foreground relative z-10 leading-relaxed">{m.correctMethod || "Method not archived."}</p>
                           <ShieldCheck className="absolute bottom-[-20px] right-[-20px] w-32 h-32 text-success/5 rotate-12 transition-transform duration-1000 group-hover/box:scale-110" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full lg:w-auto justify-end">
                    <Button variant="outline" onClick={() => toggleResolved(m.id)} className={`rounded-2xl h-12 px-6 font-black uppercase tracking-widest text-[10px] border-2 transition-all active:scale-95 ${m.resolved ? 'text-success border-success/20 bg-success/5' : 'text-primary border-primary/20 bg-primary/5 hover:bg-primary/10'}`}>
                      {m.resolved ? "Unit Resolved" : "Active Anomaly"}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteMistake(m.id)} className="text-muted-foreground hover:text-destructive transition-colors rounded-2xl h-12 w-12 hover:bg-destructive/10 shrink-0">
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="py-40 text-center flex flex-col items-center gap-8">
             <div className="w-24 h-24 rounded-[2.5rem] bg-accent/20 flex items-center justify-center opacity-30 shadow-inner">
                <BookOpen className="w-10 h-10" />
             </div>
             <div>
               <p className="text-sm font-black uppercase tracking-[0.5em] text-muted-foreground/30">Journal Exhausted</p>
               <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/20 mt-4 max-w-xs leading-relaxed">No tactical anomalies detected for the current filter criteria.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
