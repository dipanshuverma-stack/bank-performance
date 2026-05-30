"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectGroup,
  SelectItem, 
  SelectLabel,
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Plus, 
  Trash2,
  Award,
  BarChart3,
  X,
  Target,
  ChevronRight,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { logAuditAction } from "@/lib/audit-logger";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { doc, setDoc, collection, deleteDoc, query, orderBy } from "firebase/firestore";
import { ADDA247_SYLLABUS } from "@/lib/syllabus";

interface MockLog {
  id: string;
  name: string;
  examType: string;
  stage: 'Prelims' | 'Mains';
  score: number;
  totalMarks: number;
  correct: number;
  wrong: number;
  accuracy: number;
  date: string;
  weakTopics?: string[];
  subjectScores?: {
    reasoning?: number;
    quants?: number;
    english?: number;
    ga?: number;
  };
}

const EXAM_TYPES = [
  "SBI PO", "IBPS PO", "SBI Clerk", "IBPS Clerk", 
  "RBI Grade B", "RBI Assistant", "RRB PO", "RRB Clerk", "Other"
];

export function MockTestConsole() {
  const { toast } = useToast();
  const db = useFirestore();
  const { user, loading: authLoading } = useUser();
  const [mounted, setMounted] = useState(false);
  const [localMocks, setLocalMocks] = useState<MockLog[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeStage, setActiveStage] = useState<"Prelims" | "Mains">("Prelims");
  
  const [mockName, setMockName] = useState("");
  const [examType, setExamType] = useState("SBI PO");
  const [stage, setStage] = useState<'Prelims' | 'Mains'>('Prelims');
  const [score, setScore] = useState("");
  const [totalMarks, setTotalMarks] = useState("100");
  const [correct, setCorrect] = useState("");
  const [wrong, setWrong] = useState("");
  const [weakTopics, setWeakTopics] = useState<string[]>([]);
  
  const [qScore, setQScore] = useState("");
  const [rScore, setRScore] = useState("");
  const [eScore, setEScore] = useState("");
  const [gaScore, setGAScore] = useState("");

  const mocksQuery = useMemoFirebase(() => {
    if (!user || !db) return null;
    return query(collection(db, 'users', user.uid, 'mocks'), orderBy('serverTimestamp', 'desc'));
  }, [db, user]);
  
  const { data: cloudMocks, loading: cloudLoading } = useCollection<MockLog>(mocksQuery);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("elite-mock-logs");
    if (saved) {
      try { setLocalMocks(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  // ENFORCED ONE SOURCE OF TRUTH: Firestore when authenticated
  const mocks = (user && db) ? (cloudMocks || []) : localMocks;
  const filteredMocks = mocks.filter(m => m.stage === activeStage);

  const addMock = async () => {
    if (!mockName || !score || !correct || !wrong) {
      toast({ variant: "destructive", title: "Metrics Required", description: "Aggregate score and counts are mandatory." });
      return;
    }

    const correctNum = parseInt(correct);
    const wrongNum = parseInt(wrong);
    const totalAttempted = correctNum + wrongNum;
    const accuracyValue = totalAttempted > 0 ? (correctNum / totalAttempted) * 100 : 0;

    const newMock: MockLog = {
      id: Date.now().toString(),
      name: mockName,
      examType: examType,
      stage: stage,
      score: parseFloat(score),
      totalMarks: parseFloat(totalMarks),
      correct: correctNum,
      wrong: wrongNum,
      accuracy: Math.round(accuracyValue * 10) / 10,
      date: new Date().toLocaleDateString(),
      weakTopics: weakTopics,
      subjectScores: {
        quants: qScore ? parseFloat(qScore) : undefined,
        reasoning: rScore ? parseFloat(rScore) : undefined,
        english: eScore ? parseFloat(eScore) : undefined,
        ga: gaScore ? parseFloat(gaScore) : undefined,
      }
    };

    // Buffer to local storage
    const updatedLocal = [newMock, ...localMocks];
    setLocalMocks(updatedLocal);
    localStorage.setItem("elite-mock-logs", JSON.stringify(updatedLocal));

    if (user && db) {
      try {
        const mockRef = doc(db, 'users', user.uid, 'mocks', newMock.id);
        await setDoc(mockRef, { ...newMock, serverTimestamp: new Date() }, { merge: true });
        console.log(`[Firestore] Write Success: users/${user.uid}/mocks/${newMock.id}`);
        toast({ title: "Cloud Archive Secure", description: "Performance unit synced to Hybrid Vault." });
      } catch (error: any) {
        console.error(`[Firestore] Write Failure:`, error.message);
        toast({ variant: "destructive", title: "Cloud Sync Fault", description: "Archived locally only. Check connection." });
      }
    }

    setIsDialogOpen(false);
    logAuditAction("Performance", "Mock Archived", `${mockName} recorded in terminal.`);
    setMockName(""); setScore(""); setCorrect(""); setWrong(""); 
    setWeakTopics([]); setQScore(""); setRScore(""); setEScore(""); setGAScore("");
  };

  const removeMock = async (id: string) => {
    const updated = localMocks.filter(m => m.id !== id);
    setLocalMocks(updated);
    localStorage.setItem("elite-mock-logs", JSON.stringify(updated));

    if (user && db) {
      try {
        const mockRef = doc(db, 'users', user.uid, 'mocks', id);
        await deleteDoc(mockRef);
        console.log(`[Firestore] Purge Success: users/${user.uid}/mocks/${id}`);
      } catch (error: any) {
        console.error(`[Firestore] Write Failure (Delete):`, error.message);
      }
    }
  };

  const currentSyllabus = ADDA247_SYLLABUS.filter(subject => stage === 'Prelims' ? subject.name !== 'General Awareness' : true);

  if (!mounted || authLoading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-40">
      <Loader2 className="w-10 h-10 animate-spin" />
      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Validating Archives...</span>
    </div>
  );

  return (
    <div className="space-y-8">
      <Card className="bento-card border-none bg-card/40 backdrop-blur-3xl shadow-2xl overflow-hidden">
        <CardHeader className="bg-accent/5 p-6 lg:p-8 border-b border-border/40">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-headline font-black tracking-tight">Mock Vault</CardTitle>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mt-1 opacity-80 flex items-center gap-2">
                   <div className={`w-1.5 h-1.5 rounded-full ${user && db ? 'bg-emerald-500 animate-pulse' : 'bg-orange-500'}`} />
                   {user && db ? "Cloud Sync Active" : "Local Vault Mode"}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
               <Tabs value={activeStage} onValueChange={(val: any) => setActiveStage(val)} className="w-full sm:w-[240px]">
                <TabsList className="grid grid-cols-2 w-full h-12 bg-primary/10 rounded-2xl p-1.5 border border-primary/20">
                  <TabsTrigger value="Prelims" className="text-[10px] font-black uppercase tracking-widest rounded-xl transition-all data-[state=active]:bg-card">Prelims</TabsTrigger>
                  <TabsTrigger value="Mains" className="text-[10px] font-black uppercase tracking-widest rounded-xl transition-all data-[state=active]:bg-card">Mains</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto rounded-2xl bg-primary text-primary-foreground font-black uppercase text-[10px] tracking-widest h-12 px-8 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
                    <Plus className="w-4 h-4 mr-3" /> Archive Unit
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[650px] rounded-[2.5rem] border-none shadow-2xl max-h-[90vh] overflow-y-auto bg-card">
                  <DialogHeader><DialogTitle className="text-2xl font-headline font-black tracking-tight">Performance Logger</DialogTitle></DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Target Exam</label>
                        <Select value={examType} onValueChange={setExamType}>
                          <SelectTrigger className="rounded-xl h-12 bg-accent/30 border-none font-bold shadow-inner"><SelectValue /></SelectTrigger>
                          <SelectContent className="rounded-xl border-none shadow-2xl">
                            {EXAM_TYPES.map((type) => (<SelectItem key={type} value={type} className="font-bold">{type}</SelectItem>))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Mission Phase</label>
                        <Select value={stage} onValueChange={(val: any) => { setStage(val); setWeakTopics([]); }}>
                          <SelectTrigger className="rounded-xl h-12 bg-accent/30 border-none font-bold shadow-inner"><SelectValue /></SelectTrigger>
                          <SelectContent className="rounded-xl border-none shadow-2xl">
                            <SelectItem value="Prelims" className="font-bold">Prelims Phase</SelectItem>
                            <SelectItem value="Mains" className="font-bold">Mains Phase</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Unit Designation</label>
                      <Input placeholder="e.g. SBI PO Mock 1" value={mockName} onChange={(e) => setMockName(e.target.value)} className="rounded-xl h-12 bg-accent/30 border-none font-bold shadow-inner" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-primary ml-1">Aggregate Score</label>
                        <Input type="number" placeholder="Score" value={score} onChange={(e) => setScore(e.target.value)} className="rounded-xl h-12 bg-primary/5 border-2 border-primary/20 font-bold text-center" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Max Marks</label>
                        <Input type="number" placeholder="Total" value={totalMarks} onChange={(e) => setTotalMarks(e.target.value)} className="rounded-xl h-12 bg-accent/30 border-none font-bold text-center shadow-inner" />
                      </div>
                    </div>

                    <div className="p-5 rounded-3xl bg-accent/10 border border-border/40 space-y-4 shadow-inner">
                      <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sectional Drill-Down</div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {['quants', 'reasoning', 'english', 'ga'].map((sub) => {
                          if (sub === 'ga' && stage === 'Prelims') return null;
                          const val = sub === 'quants' ? qScore : sub === 'reasoning' ? rScore : sub === 'english' ? eScore : gaScore;
                          const setter = sub === 'quants' ? setQScore : sub === 'reasoning' ? setRScore : sub === 'english' ? setEScore : setGAScore;
                          return (
                            <div key={sub} className="space-y-1">
                              <label className="text-[8px] font-black uppercase text-muted-foreground ml-1">{sub}</label>
                              <Input type="number" value={val} onChange={(e) => setter(e.target.value)} className="h-10 rounded-xl bg-background border-none text-xs font-bold text-center" />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2"><Target className="w-3 h-3" /> Struggle Zones (Stage-Specific)</label>
                      <Select onValueChange={(topic) => { if (!weakTopics.includes(topic)) setWeakTopics([...weakTopics, topic]); }}>
                        <SelectTrigger className="rounded-xl h-12 bg-accent/30 border-none font-bold shadow-inner"><SelectValue placeholder="Identify gaps in this stage..." /></SelectTrigger>
                        <SelectContent className="rounded-xl border-none shadow-2xl max-h-[300px]">
                          {currentSyllabus.map((subject) => (
                            <SelectGroup key={subject.name}>
                              <SelectLabel className="text-[8px] font-black uppercase text-primary px-4 py-2 bg-primary/5 flex items-center gap-2"><ChevronRight className="w-2.5 h-2.5" /> {subject.name}</SelectLabel>
                              {subject.chapters.flatMap(ch => ch.subtopics).map((sub) => (
                                <SelectItem key={sub.id} value={sub.name} className="text-xs font-bold transition-colors">{sub.name}</SelectItem>
                              ))}
                            </SelectGroup>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {weakTopics.map(topic => (
                          <Badge key={topic} variant="secondary" className="pl-3 pr-1 py-1.5 rounded-xl bg-primary/10 text-primary border-primary/20 flex items-center gap-2">
                            <span className="text-[9px] font-black uppercase">{topic}</span>
                            <button onClick={() => setWeakTopics(weakTopics.filter(t => t !== topic))} className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"><X className="w-3 h-3" /></button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-border/20 pt-6">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-success ml-1">Correct Hits</label>
                        <Input type="number" placeholder="Count" value={correct} onChange={(e) => setCorrect(e.target.value)} className="rounded-xl h-12 bg-success/5 border-2 border-success/20 font-bold text-center" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-destructive ml-1">Errors</label>
                        <Input type="number" placeholder="Count" value={wrong} onChange={(e) => setWrong(e.target.value)} className="rounded-xl h-12 bg-destructive/5 border-2 border-destructive/20 font-bold text-center" />
                      </div>
                    </div>
                    <Button onClick={addMock} className="w-full h-16 rounded-2xl bg-primary text-primary-foreground font-black uppercase text-[12px] tracking-[0.2em] shadow-2xl shadow-primary/30 mt-4 active:scale-95 transition-all">Archive Unit to Vault</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 lg:p-10">
          {cloudLoading ? (
            <div className="py-20 text-center animate-pulse flex flex-col items-center gap-4">
               <BarChart3 className="w-10 h-10 text-muted-foreground/20" />
               <div className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">Synchronizing Archives...</div>
            </div>
          ) : filteredMocks.length > 0 ? (
            <div className="space-y-4">
              {filteredMocks.map((mock) => (
                <div key={mock.id} className="group relative p-6 rounded-3xl border-2 border-border/40 bg-card/60 hover:border-primary/40 transition-all duration-500 shadow-sm hover:shadow-xl">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center shadow-inner shrink-0"><Award className="w-7 h-7" /></div>
                      <div>
                        <div className="font-black text-xl tracking-tight text-foreground leading-tight">{mock.name}</div>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5">
                          <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-primary/20 bg-primary/5 text-primary h-5">{mock.examType}</Badge>
                          <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest opacity-60">{mock.date} • {mock.score}/{mock.totalMarks} Marks</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-10">
                      <div className="text-right">
                        <div className="text-4xl font-headline font-black text-primary tracking-tighter tabular-nums leading-none">{mock.accuracy}%</div>
                        <div className="text-[9px] text-muted-foreground uppercase font-black tracking-[0.2em] mt-1 opacity-60 text-right">Precision</div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeMock(mock.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive h-12 w-12 rounded-2xl shrink-0"><Trash2 className="w-5 h-5" /></Button>
                    </div>
                  </div>
                  
                  {(mock.weakTopics && mock.weakTopics.length > 0) || mock.subjectScores ? (
                    <div className="mt-6 pt-6 border-t border-border/40 space-y-4">
                      {mock.subjectScores && (
                         <div className="flex flex-wrap gap-4">
                            {Object.entries(mock.subjectScores).map(([key, val]) => val !== undefined && (
                              <div key={key} className="flex flex-col">
                                <span className="text-[7px] font-black uppercase text-muted-foreground tracking-widest">{key}</span>
                                <span className="text-xs font-bold text-foreground">{val}</span>
                              </div>
                            ))}
                         </div>
                      )}
                      {mock.weakTopics && mock.weakTopics.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {mock.weakTopics.map(topic => (
                            <Badge key={topic} variant="secondary" className="text-[8px] font-black text-muted-foreground uppercase tracking-wider bg-accent/40 rounded-lg px-2.5 py-1">{topic}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center flex flex-col items-center gap-6">
               <div className="w-20 h-20 rounded-[2rem] bg-accent/20 flex items-center justify-center opacity-30 shadow-inner"><BarChart3 className="w-10 h-10" /></div>
               <div>
                 <p className="text-xs font-black uppercase tracking-[0.4em] text-muted-foreground/30">Vault Segment Empty</p>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/20 mt-2 leading-relaxed">Archive a {activeStage} performance unit to activate cloud-synced analytics.</p>
               </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
