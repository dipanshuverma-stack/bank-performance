"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Trophy, 
  Target, 
  Trash2,
  Award,
  CheckCircle2,
  XCircle,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MockLog {
  id: string;
  name: string;
  examType: string;
  score: number;
  totalMarks: number;
  quantsCorrect: number;
  reasoningCorrect: number;
  englishCorrect: number;
  correct: number;
  wrong: number;
  accuracy: number;
  date: string;
}

const EXAM_TYPES = [
  "SBI PO",
  "IBPS PO",
  "SBI Clerk",
  "IBPS Clerk",
  "RBI Grade B",
  "RBI Assistant",
  "RRB PO",
  "RRB Clerk",
  "Other"
];

export function MockTestConsole() {
  const { toast } = useToast();
  const [mocks, setMocks] = useState<MockLog[]>([]);
  
  // Form State
  const [mockName, setMockName] = useState("");
  const [examType, setExamType] = useState("SBI PO");
  const [score, setScore] = useState("");
  const [totalMarks, setTotalMarks] = useState("100");
  const [quantsCorrect, setQuantsCorrect] = useState("");
  const [reasoningCorrect, setReasoningCorrect] = useState("");
  const [englishCorrect, setEnglishCorrect] = useState("");
  const [correct, setCorrect] = useState("");
  const [wrong, setWrong] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("elite-mock-logs");
    if (saved) {
      try {
        setMocks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse mocks");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("elite-mock-logs", JSON.stringify(mocks));
  }, [mocks]);

  const addMock = () => {
    if (!mockName || !score || !correct || !wrong) {
      toast({
        variant: "destructive",
        title: "Missing Metrics",
        description: "Please fill in the core performance details (Name, Score, Correct/Wrong).",
      });
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
      score: parseFloat(score),
      totalMarks: parseFloat(totalMarks),
      quantsCorrect: parseInt(quantsCorrect) || 0,
      reasoningCorrect: parseInt(reasoningCorrect) || 0,
      englishCorrect: parseInt(englishCorrect) || 0,
      correct: correctNum,
      wrong: wrongNum,
      accuracy: Math.round(accuracyValue * 10) / 10,
      date: new Date().toLocaleDateString(),
    };

    setMocks([newMock, ...mocks]);
    
    // Reset Form
    setMockName("");
    setScore("");
    setQuantsCorrect("");
    setReasoningCorrect("");
    setEnglishCorrect("");
    setCorrect("");
    setWrong("");
    
    toast({
      title: "Performance Archived",
      description: `${examType} ${mockName} metrics added to the vault.`,
    });
  };

  const removeMock = (id: string) => {
    setMocks(mocks.filter(m => m.id !== id));
  };

  const totalMocks = mocks.length;
  const avgAccuracy = mocks.length > 0 
    ? (mocks.reduce((acc, m) => acc + m.accuracy, 0) / mocks.length).toFixed(1)
    : "0";

  return (
    <div className="space-y-8" id="mock-console">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Deep Metric Logger */}
        <Card className="bento-card xl:col-span-1 border-primary/10 shadow-2xl">
          <CardHeader className="bg-primary/5 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Target className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl font-headline font-bold">Deep Metric Logger</CardTitle>
            </div>
            <CardDescription className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-10">
              Granular Performance Capture
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Series</label>
                <Select value={examType} onValueChange={setExamType}>
                  <SelectTrigger className="rounded-2xl border-2 h-11 bg-accent/30 dark:bg-slate-900 border-transparent focus:ring-primary font-bold text-xs">
                    <SelectValue placeholder="Exam" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {EXAM_TYPES.map((type) => (
                      <SelectItem key={type} value={type} className="font-bold">{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Mock Name</label>
                <Input 
                  placeholder="e.g. Mock 1" 
                  value={mockName}
                  onChange={(e) => setMockName(e.target.value)}
                  className="rounded-2xl border-2 h-11 bg-accent/30 dark:bg-slate-900 border-transparent focus:ring-primary font-bold text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 text-primary">Obtained Score</label>
                <Input 
                  type="number"
                  placeholder="0.0" 
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  className="rounded-2xl border-2 h-11 bg-primary/5 dark:bg-primary/10 border-primary/20 focus:ring-primary font-bold text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Total Marks</label>
                <Input 
                  type="number"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(e.target.value)}
                  className="rounded-2xl border-2 h-11 bg-accent/30 dark:bg-slate-900 border-transparent focus:ring-primary font-bold text-sm"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Correct Answers Breakdown</label>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-muted-foreground block text-center uppercase">Quants</span>
                  <Input type="number" placeholder="0" value={quantsCorrect} onChange={(e) => setQuantsCorrect(e.target.value)} className="rounded-xl h-9 text-xs text-center font-bold" />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-muted-foreground block text-center uppercase">Reasoning</span>
                  <Input type="number" placeholder="0" value={reasoningCorrect} onChange={(e) => setReasoningCorrect(e.target.value)} className="rounded-xl h-9 text-xs text-center font-bold" />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-muted-foreground block text-center uppercase">English</span>
                  <Input type="number" placeholder="0" value={englishCorrect} onChange={(e) => setEnglishCorrect(e.target.value)} className="rounded-xl h-9 text-xs text-center font-bold" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-success ml-1 flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Total Correct
                </label>
                <Input 
                  type="number"
                  placeholder="0" 
                  value={correct}
                  onChange={(e) => setCorrect(e.target.value)}
                  className="rounded-2xl border-2 h-11 bg-success/5 border-success/20 focus:ring-success font-bold text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-destructive ml-1 flex items-center gap-1">
                  <XCircle className="w-2.5 h-2.5" /> Total Wrong
                </label>
                <Input 
                  type="number"
                  placeholder="0" 
                  value={wrong}
                  onChange={(e) => setWrong(e.target.value)}
                  className="rounded-2xl border-2 h-11 bg-destructive/5 border-destructive/20 focus:ring-destructive font-bold text-sm"
                />
              </div>
            </div>

            <Button 
              onClick={addMock}
              className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-95"
            >
              <Plus className="w-5 h-5 mr-3" />
              Save Performance
            </Button>
          </CardContent>
        </Card>

        {/* Dynamic Analytics History */}
        <Card className="bento-card xl:col-span-2 border-none bg-slate-50/50 dark:bg-white/5 shadow-xl flex flex-col">
          <CardHeader className="bg-accent/5 py-6 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <CardTitle className="text-xl font-headline font-bold">Analytics Vault</CardTitle>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Global Precision</div>
                  <div className="text-xl font-headline font-bold text-primary">{avgAccuracy}%</div>
                </div>
                <div className="hidden sm:flex flex-col items-end">
                   <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Total Attempts</div>
                   <Badge variant="outline" className="rounded-lg border-primary/20 text-primary font-black uppercase tracking-tighter text-[10px] h-6 px-3">
                    {totalMocks} Units
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 flex-1 overflow-hidden">
            {mocks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-muted-foreground/30">
                <div className="w-20 h-20 rounded-3xl bg-accent/50 flex items-center justify-center mb-6">
                  <Activity className="w-10 h-10" />
                </div>
                <p className="font-bold text-lg text-foreground/40">Vault currently empty</p>
                <p className="text-[10px] uppercase font-black tracking-[0.2em] mt-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full">
                  Begin capturing mock telemetry
                </p>
              </div>
            ) : (
              <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4 scrollbar-hide">
                {mocks.map((mock) => (
                  <div key={mock.id} className="group relative p-6 rounded-3xl border-2 border-border/40 bg-card hover:border-primary/30 hover:shadow-xl transition-all duration-300">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/5">
                          <Award className="w-7 h-7" />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="bg-primary/20 text-primary text-[8px] font-black uppercase h-4 px-2 border-none rounded-sm">
                              {mock.examType}
                            </Badge>
                            <span className="font-bold text-foreground text-lg">{mock.name}</span>
                          </div>
                          <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-2">
                            {mock.date} • {mock.score}/{mock.totalMarks} Total
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                        <div className="text-center">
                          <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1.5 opacity-60">Accuracy</div>
                          <div className="text-xl font-headline font-bold text-primary">{mock.accuracy}%</div>
                        </div>
                        <div className="hidden sm:block text-center border-l border-border/50 pl-8">
                          <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1.5 opacity-60">Subject Correct (Q|R|E)</div>
                          <div className="text-sm font-bold text-foreground">
                            {mock.quantsCorrect} | {mock.reasoningCorrect} | {mock.englishCorrect}
                          </div>
                        </div>
                        <div className="text-center border-l border-border/50 pl-8">
                          <div className="text-[10px] text-success font-black uppercase tracking-widest mb-1.5">Total Correct</div>
                          <div className="text-xl font-headline font-bold text-success">{mock.correct}</div>
                        </div>
                        <div className="text-center border-l border-border/50 pl-8">
                          <div className="text-[10px] text-destructive font-black uppercase tracking-widest mb-1.5">Total Wrong</div>
                          <div className="text-xl font-headline font-bold text-destructive">{mock.wrong}</div>
                        </div>
                      </div>

                      <div className="absolute top-4 right-4 sm:static flex items-center">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeMock(mock.id)} 
                          className="opacity-0 group-hover:opacity-100 transition-all text-destructive hover:bg-destructive/10 rounded-2xl h-10 w-10 shrink-0 border border-transparent hover:border-destructive/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
