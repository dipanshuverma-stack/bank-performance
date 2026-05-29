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
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { logAuditAction } from "@/lib/audit-logger";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { doc, setDoc, collection, deleteDoc, query, orderBy } from "firebase/firestore";
import { useMemoFirebase } from "@/firebase/use-memo-firebase";
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
  const { user } = useUser();
  const db = useFirestore();
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
  const { data: cloudMocks } = useCollection<MockLog>(mocksQuery);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("elite-mock-logs");
    if (saved) {
      try { setLocalMocks(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const mocks = user ? (cloudMocks || []) : localMocks;
  const filteredMocks = mocks.filter(m => m.stage === activeStage);

  const addMock = () => {
    if (!mockName || !score || !correct || !wrong) {
      toast({ variant: "destructive", title: "Missing Metrics", description: "Fill core details." });
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

    const updated = [newMock, ...localMocks];
    setLocalMocks(updated);
    localStorage.setItem("elite-mock-logs", JSON.stringify(updated));

    if (user && db) {
      const mockRef = doc(db, 'users', user.uid, 'mocks', newMock.id);
      setDoc(mockRef, { ...newMock, serverTimestamp: new Date() });
    }

    setIsDialogOpen(false);
    logAuditAction("Performance", "Mock Archived", `${examType} - ${newMock.accuracy}% Accuracy`);
    toast({ title: "Performance Synchronized", description: "Data logged to Hybrid Vault." });
    
    // Reset
    setMockName(""); setScore(""); setCorrect(""); setWrong(""); 
    setWeakTopics([]); setQScore(""); setRScore(""); setEScore(""); setGAScore("");
  };

  const removeMock = (id: string) => {
    const updated = localMocks.filter(m => m.id !== id);
    setLocalMocks(updated);
    localStorage.setItem("elite-mock-logs", JSON.stringify(updated));

    if (user && db) {
      const mockRef = doc(db, 'users', user.uid, 'mocks', id);
      deleteDoc(mockRef);
    }
    logAuditAction("Performance", "Mock Removed", "Entry purged from vault.");
  };

  const filteredSyllabus = ADDA247_SYLLABUS.filter(subject => {
    if (stage === 'Prelims') {
      return subject.name !== 'General Awareness';
    }
    return true;
  });

  const handleTopicAdd = (topic: string) => {
    if (!weakTopics.includes(topic)) {
      setWeakTopics([...weakTopics, topic]);
    }
  };

  const handleTopicRemove = (topic: string) => {
    setWeakTopics(weakTopics.filter(t => t !== topic));
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <Card className="bento-card border-none bg-slate-50/50 dark:bg-white/5 shadow-xl">
        <CardHeader className="bg-accent/5 py-6 border-b border-border/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <BarChart3 className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl font-headline font-bold">Mock Analytics Vault</CardTitle>
            </div>
            <div className="flex items-center gap-4">
               <Tabs value={activeStage} onValueChange={(val: any) => setActiveStage(val)} className="w-[200px]">
                <TabsList className="grid grid-cols-2 w-full h-11 bg-primary/10 rounded-2xl p-1 border border-primary/20">
                  <TabsTrigger value="Prelims" className="text-[10px] font-black uppercase tracking-widest rounded-xl">Prelims</TabsTrigger>
                  <TabsTrigger value="Mains" className="text-[10px] font-black uppercase tracking-widest rounded-xl">Mains</TabsTrigger>
                </TabsList>
              </Tabs>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-2xl bg-primary text-primary-foreground font-bold h-12 px-6 shadow-xl shadow-primary/20">
                    <Plus className="w-4 h-4 mr-2" /> Log New Mock
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] rounded-[2rem] border-none shadow-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader><DialogTitle className="text-2xl font-headline font-bold">Metric Logger</DialogTitle></DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Exam Category</label>
                        <Select value={examType} onValueChange={setExamType}>
                          <SelectTrigger className="rounded-2xl h-11 bg-accent/30 font-bold border-none"><SelectValue /></SelectTrigger>
                          <SelectContent className="rounded-2xl">
                            {EXAM_TYPES.map((type) => (<SelectItem key={type} value={type}>{type}</SelectItem>))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Exam Stage</label>
                        <Select value={stage} onValueChange={(val: any) => { setStage(val); setWeakTopics([]); }}>
                          <SelectTrigger className="rounded-2xl h-11 bg-accent/30 font-bold border-none"><SelectValue /></SelectTrigger>
                          <SelectContent className="rounded-2xl">
                            <SelectItem value="Prelims">Prelims</SelectItem>
                            <SelectItem value="Mains">Mains</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Mock Identification</label>
                      <Input placeholder="e.g. SBI PO Mock 1" value={mockName} onChange={(e) => setMockName(e.target.value)} className="rounded-2xl h-11 bg-accent/30 font-bold border-none shadow-inner" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-primary ml-1">Final Score</label>
                        <Input type="number" placeholder="Score" value={score} onChange={(e) => setScore(e.target.value)} className="rounded-2xl h-11 bg-primary/5 border-primary/20 font-bold" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Total Marks</label>
                        <Input type="number" placeholder="Total" value={totalMarks} onChange={(e) => setTotalMarks(e.target.value)} className="rounded-2xl h-11 bg-accent/30 border-none shadow-inner font-bold" />
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-accent/10 border border-border/40 space-y-4">
                      <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Subject-Wise Diagnostics (Optional)</div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase text-muted-foreground">Quants</label>
                          <Input type="number" value={qScore} onChange={(e) => setQScore(e.target.value)} className="h-9 rounded-xl bg-background border-none text-xs font-bold" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase text-muted-foreground">Reasoning</label>
                          <Input type="number" value={rScore} onChange={(e) => setRScore(e.target.value)} className="h-9 rounded-xl bg-background border-none text-xs font-bold" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-black uppercase text-muted-foreground">English</label>
                          <Input type="number" value={eScore} onChange={(e) => setEScore(e.target.value)} className="h-9 rounded-xl bg-background border-none text-xs font-bold" />
                        </div>
                        {stage === 'Mains' && (
                          <div className="space-y-1">
                            <label className="text-[8px] font-black uppercase text-muted-foreground">GA</label>
                            <Input type="number" value={gaScore} onChange={(e) => setGAScore(e.target.value)} className="h-9 rounded-xl bg-background border-none text-xs font-bold" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Tactical Weak Areas</label>
                      <Select onValueChange={handleTopicAdd}>
                        <SelectTrigger className="rounded-2xl h-11 bg-accent/30 font-bold border-none"><SelectValue placeholder="Identify struggle zones..." /></SelectTrigger>
                        <SelectContent className="rounded-2xl max-h-[300px]">
                          {filteredSyllabus.map((subject) => (
                            <SelectGroup key={subject.name}>
                              <SelectLabel className="text-[8px] font-black uppercase text-primary px-4 py-2 bg-primary/5">{subject.name}</SelectLabel>
                              {subject.chapters.flatMap(ch => ch.subtopics).map((sub) => (
                                <SelectItem key={sub.id} value={sub.name} className="text-xs font-bold">{sub.name}</SelectItem>
                              ))}
                            </SelectGroup>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {weakTopics.map(topic => (
                          <Badge key={topic} variant="secondary" className="pl-3 pr-1 py-1 rounded-xl bg-primary/10 text-primary border-primary/20 flex items-center gap-1">
                            <span className="text-[10px] font-bold">{topic}</span>
                            <button onClick={() => handleTopicRemove(topic)} className="hover:bg-primary/20 rounded-full p-0.5"><X className="w-3 h-3" /></button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-success ml-1">Correct Hits</label>
                        <Input type="number" placeholder="Correct" value={correct} onChange={(e) => setCorrect(e.target.value)} className="rounded-2xl h-11 bg-success/5 border-success/20 font-bold" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-destructive ml-1">Wrong Hits</label>
                        <Input type="number" placeholder="Wrong" value={wrong} onChange={(e) => setWrong(e.target.value)} className="rounded-2xl h-11 bg-destructive/5 border-destructive/20 font-bold" />
                      </div>
                    </div>
                    <Button onClick={addMock} className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]">Archive to Vault</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          {filteredMocks.length > 0 ? (
            filteredMocks.map((mock) => (
              <div key={mock.id} className="group relative p-6 rounded-3xl border-2 border-border/40 bg-card hover:border-primary/30 transition-all duration-300 mb-4 shadow-sm hover:shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner shrink-0"><Award className="w-6 h-6" /></div>
                    <div>
                      <div className="font-black text-xl tracking-tight">{mock.name}</div>
                      <div className="flex flex-wrap items-center gap-3 mt-1">
                        <Badge variant="outline" className="text-[9px] font-black uppercase border-primary/20 bg-primary/5 text-primary">{mock.examType}</Badge>
                        <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{mock.date} • {mock.score}/{mock.totalMarks} Marks</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="text-3xl font-headline font-black text-primary tracking-tighter">{mock.accuracy}%</div>
                      <div className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Precision</div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeMock(mock.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive h-10 w-10 transition-all hover:bg-destructive/10 rounded-xl"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
                {mock.weakTopics && mock.weakTopics.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border/40 flex flex-wrap gap-2">
                    {mock.weakTopics.map(topic => (
                      <Badge key={topic} variant="ghost" className="text-[9px] font-black text-muted-foreground uppercase tracking-wider bg-accent/40 rounded-lg px-3 py-1">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="py-20 text-center text-muted-foreground/20 uppercase tracking-[0.3em] font-black flex flex-col items-center gap-4">
               <BarChart3 className="w-16 h-16 opacity-5" />
               No Archived Units Found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
