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
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Plus, 
  Activity, 
  Trash2,
  Award,
  BarChart3,
  ChevronDown,
  Search,
  Layers
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ADDA247_SYLLABUS } from "@/lib/syllabus";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { logAuditAction } from "@/lib/audit-logger";
import { useUser, useFirestore } from "@/firebase";
import { doc, setDoc, collection, addDoc, deleteDoc } from "firebase/firestore";

interface MockLog {
  id: string;
  name: string;
  examType: string;
  stage: 'Prelims' | 'Mains';
  score: number;
  totalMarks: number;
  quantsCorrect: number;
  reasoningCorrect: number;
  englishCorrect: number;
  gaCorrect?: number;
  correct: number;
  wrong: number;
  accuracy: number;
  weakTopics: string[];
  date: string;
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
  const [mocks, setMocks] = useState<MockLog[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeStage, setActiveStage] = useState<"Prelims" | "Mains">("Prelims");
  
  const [mockName, setMockName] = useState("");
  const [examType, setExamType] = useState("SBI PO");
  const [stage, setStage] = useState<'Prelims' | 'Mains'>('Prelims');
  const [score, setScore] = useState("");
  const [totalMarks, setTotalMarks] = useState("100");
  const [quantsCorrect, setQuantsCorrect] = useState("");
  const [reasoningCorrect, setReasoningCorrect] = useState("");
  const [englishCorrect, setEnglishCorrect] = useState("");
  const [gaCorrect, setGaCorrect] = useState("");
  const [correct, setCorrect] = useState("");
  const [wrong, setWrong] = useState("");
  const [selectedWeakTopics, setSelectedWeakTopics] = useState<string[]>([]);
  const [topicSearch, setTopicSearch] = useState("");

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("elite-mock-logs");
    if (saved) {
      try { setMocks(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("elite-mock-logs", JSON.stringify(mocks));
    }
  }, [mocks, mounted]);

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
      id: Math.random().toString(36).substr(2, 9),
      name: mockName,
      examType: examType,
      stage: stage,
      score: parseFloat(score),
      totalMarks: parseFloat(totalMarks),
      quantsCorrect: parseInt(quantsCorrect) || 0,
      reasoningCorrect: parseInt(reasoningCorrect) || 0,
      englishCorrect: parseInt(englishCorrect) || 0,
      gaCorrect: stage === 'Mains' ? (parseInt(gaCorrect) || 0) : undefined,
      correct: correctNum,
      wrong: wrongNum,
      accuracy: Math.round(accuracyValue * 10) / 10,
      weakTopics: selectedWeakTopics,
      date: new Date().toLocaleDateString(),
    };

    // 1. Local Update
    setMocks([newMock, ...mocks]);

    // 2. Cloud Update if Auth
    if (user && db) {
      const mockRef = doc(db, 'users', user.uid, 'mocks', newMock.id);
      setDoc(mockRef, { ...newMock, serverTimestamp: new Date() });
    }

    setIsDialogOpen(false);
    logAuditAction("Performance", "Mock Archived", `${examType} - ${newMock.accuracy}% Accuracy`);
    toast({ title: "Performance Synchronized", description: "Data logged to Hybrid Vault." });
  };

  const removeMock = (id: string) => {
    setMocks(mocks.filter(m => m.id !== id));
    if (user && db) {
      const mockRef = doc(db, 'users', user.uid, 'mocks', id);
      deleteDoc(mockRef);
    }
    logAuditAction("Performance", "Mock Removed", "Entry purged from vault.");
  };

  const filteredMocks = mocks.filter(m => m.stage === activeStage);

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
              <div>
                <CardTitle className="text-xl font-headline font-bold">Analytics Vault</CardTitle>
              </div>
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
                  <Button className="rounded-2xl bg-primary text-primary-foreground font-bold h-12 px-6 shadow-lg shadow-primary/20">
                    <Plus className="w-4 h-4 mr-2" /> Log Mock
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] rounded-3xl border-none shadow-2xl overflow-y-auto max-h-[90vh]">
                  <DialogHeader><DialogTitle className="text-2xl font-headline font-bold">Metric Logger</DialogTitle></DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Series</label>
                        <Select value={examType} onValueChange={setExamType}>
                          <SelectTrigger className="rounded-2xl h-11 bg-accent/30 font-bold"><SelectValue /></SelectTrigger>
                          <SelectContent className="rounded-2xl">
                            {EXAM_TYPES.map((type) => (<SelectItem key={type} value={type}>{type}</SelectItem>))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Stage</label>
                        <Select value={stage} onValueChange={(val: any) => setStage(val)}>
                          <SelectTrigger className="rounded-2xl h-11 bg-accent/30 font-bold"><SelectValue /></SelectTrigger>
                          <SelectContent className="rounded-2xl">
                            <SelectItem value="Prelims">Prelims</SelectItem>
                            <SelectItem value="Mains">Mains</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Mock Name</label>
                      <Input value={mockName} onChange={(e) => setMockName(e.target.value)} className="rounded-2xl h-11 bg-accent/30 font-bold" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input type="number" placeholder="Score" value={score} onChange={(e) => setScore(e.target.value)} className="rounded-2xl h-11 bg-primary/5 border-primary/20" />
                      <Input type="number" placeholder="Total" value={totalMarks} onChange={(e) => setTotalMarks(e.target.value)} className="rounded-2xl h-11 bg-accent/30" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input type="number" placeholder="Correct" value={correct} onChange={(e) => setCorrect(e.target.value)} className="rounded-2xl h-11 bg-success/5 border-success/20" />
                      <Input type="number" placeholder="Wrong" value={wrong} onChange={(e) => setWrong(e.target.value)} className="rounded-2xl h-11 bg-destructive/5 border-destructive/20" />
                    </div>
                    <Button onClick={addMock} className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest">Archive to Hybrid Vault</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          {filteredMocks.map((mock) => (
            <div key={mock.id} className="group relative p-6 rounded-3xl border-2 border-border/40 bg-card hover:border-primary/30 transition-all duration-300 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><Award className="w-5 h-5" /></div>
                  <div>
                    <div className="font-bold">{mock.name} ({mock.examType})</div>
                    <div className="text-[10px] text-muted-foreground uppercase font-black">{mock.date} • {mock.score}/{mock.totalMarks} Marks</div>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <div className="text-xl font-headline font-bold text-primary">{mock.accuracy}%</div>
                    <div className="text-[10px] text-muted-foreground uppercase font-black">Accuracy</div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeMock(mock.id)} className="opacity-0 group-hover:opacity-100 text-destructive h-10 w-10"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
