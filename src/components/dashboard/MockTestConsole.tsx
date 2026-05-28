"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Trophy, 
  Trash2,
  Award,
  CheckCircle2,
  XCircle,
  BarChart3,
  AlertTriangle,
  X,
  ChevronDown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ADDA247_SYLLABUS } from "@/lib/syllabus";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
  weakTopics: string[];
  date: string;
}

const EXAM_TYPES = [
  "SBI PO", "IBPS PO", "SBI Clerk", "IBPS Clerk", 
  "RBI Grade B", "RBI Assistant", "RRB PO", "RRB Clerk", "Other"
];

export function MockTestConsole() {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [mocks, setMocks] = useState<MockLog[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
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
  const [selectedWeakTopics, setSelectedWeakTopics] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
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
    if (mounted) {
      localStorage.setItem("elite-mock-logs", JSON.stringify(mocks));
    }
  }, [mocks, mounted]);

  const addMock = () => {
    if (!mockName || !score || !correct || !wrong) {
      toast({ variant: "destructive", title: "Missing Metrics", description: "Please fill in the core performance details (Name, Score, Correct/Wrong)." });
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
      weakTopics: selectedWeakTopics,
      date: new Date().toLocaleDateString(),
    };

    setMocks([newMock, ...mocks]);
    setIsDialogOpen(false);
    
    // Reset Form
    setMockName(""); setScore(""); setQuantsCorrect(""); 
    setReasoningCorrect(""); setEnglishCorrect(""); setCorrect(""); setWrong("");
    setSelectedWeakTopics([]);
    
    toast({ title: "Performance Archived", description: `${examType} ${mockName} metrics saved.` });
  };

  const removeMock = (id: string) => {
    setMocks(mocks.filter(m => m.id !== id));
  };

  const toggleTopic = (topic: string) => {
    setSelectedWeakTopics(prev => 
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  const avgAccuracy = mocks.length > 0 
    ? (mocks.reduce((acc, m) => acc + m.accuracy, 0) / mocks.length).toFixed(1)
    : "0";

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <Card className="bento-card border-none bg-slate-50/50 dark:bg-white/5 shadow-xl">
        <CardHeader className="bg-accent/5 py-6 border-b border-border/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-headline font-bold">Analytics Vault</CardTitle>
                <CardDescription className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Historical Performance Matrix</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Global Precision</div>
                <div className="text-xl font-headline font-bold text-primary">{avgAccuracy}%</div>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 px-6 shadow-lg shadow-primary/20">
                    <Plus className="w-4 h-4 mr-2" />
                    Log New Mock
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] rounded-3xl border-none shadow-2xl overflow-y-auto max-h-[90vh]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-headline font-bold">Deep Metric Logger</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Series</label>
                        <Select value={examType} onValueChange={setExamType}>
                          <SelectTrigger className="rounded-2xl h-11 bg-accent/30 font-bold text-xs">
                            <SelectValue />
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
                        <Input placeholder="e.g. Mock 1" value={mockName} onChange={(e) => setMockName(e.target.value)} className="rounded-2xl h-11 bg-accent/30 font-bold text-xs" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Obtained Score</label>
                        <Input type="number" placeholder="0.0" value={score} onChange={(e) => setScore(e.target.value)} className="rounded-2xl h-11 bg-primary/5 border-primary/20 font-bold text-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Total Marks</label>
                        <Input type="number" value={totalMarks} onChange={(e) => setTotalMarks(e.target.value)} className="rounded-2xl h-11 bg-accent/30 font-bold text-sm" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Correct Answers Breakdown</label>
                      <div className="grid grid-cols-3 gap-3">
                        <Input type="number" placeholder="Quants" value={quantsCorrect} onChange={(e) => setQuantsCorrect(e.target.value)} className="rounded-xl h-9 text-xs text-center font-bold" />
                        <Input type="number" placeholder="Reason" value={reasoningCorrect} onChange={(e) => setReasoningCorrect(e.target.value)} className="rounded-xl h-9 text-xs text-center font-bold" />
                        <Input type="number" placeholder="English" value={englishCorrect} onChange={(e) => setEnglishCorrect(e.target.value)} className="rounded-xl h-9 text-xs text-center font-bold" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-success ml-1 flex items-center gap-1"><CheckCircle2 className="w-2.5 h-2.5" /> Total Correct</label>
                        <Input type="number" value={correct} onChange={(e) => setCorrect(e.target.value)} className="rounded-2xl h-11 bg-success/5 border-success/20 font-bold text-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-destructive ml-1 flex items-center gap-1"><XCircle className="w-2.5 h-2.5" /> Total Wrong</label>
                        <Input type="number" value={wrong} onChange={(e) => setWrong(e.target.value)} className="rounded-2xl h-11 bg-destructive/5 border-destructive/20 font-bold text-sm" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-yellow-500 ml-1 flex items-center gap-1"><AlertTriangle className="w-2.5 h-2.5" /> Identify Weak Sub-topics (Optional)</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-between rounded-2xl h-11 bg-yellow-500/5 border-yellow-500/20 font-bold text-xs">
                            {selectedWeakTopics.length > 0 ? `${selectedWeakTopics.length} Topics Selected` : "Select Areas of Struggle"}
                            <ChevronDown className="w-4 h-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[450px] p-0 rounded-2xl shadow-2xl border-none" align="start">
                          <ScrollArea className="h-[400px] p-4">
                            <div className="space-y-4">
                              {ADDA247_SYLLABUS.map((subject) => (
                                <div key={subject.name} className="space-y-2">
                                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                    <div className="w-1 h-3 bg-primary rounded-full" />
                                    {subject.name}
                                  </h4>
                                  <div className="grid grid-cols-2 gap-2">
                                    {subject.chapters.flatMap(ch => ch.subtopics).map((sub) => (
                                      <div key={sub.id} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                                        <Checkbox 
                                          id={`weak-${sub.id}`} 
                                          checked={selectedWeakTopics.includes(sub.name)}
                                          onCheckedChange={() => toggleTopic(sub.name)}
                                        />
                                        <label htmlFor={`weak-${sub.id}`} className="text-[11px] font-semibold leading-none cursor-pointer">{sub.name}</label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </PopoverContent>
                      </Popover>
                      {selectedWeakTopics.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedWeakTopics.map(topic => (
                            <Badge key={topic} variant="secondary" className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                              {topic}
                              <X className="w-2.5 h-2.5 cursor-pointer" onClick={() => toggleTopic(topic)} />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <Button onClick={addMock} className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-xl shadow-primary/20">Archive Performance</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          {mocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground/30 text-center">
              <Activity className="w-16 h-16 mb-6 opacity-20" />
              <p className="font-bold text-lg text-foreground/40 uppercase tracking-widest">Vault Empty</p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-2">Log your first mock to see deep analytics</p>
            </div>
          ) : (
            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
              {mocks.map((mock) => (
                <div key={mock.id} className="group relative p-6 rounded-3xl border-2 border-border/40 bg-card hover:border-primary/30 transition-all duration-300 shadow-sm">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0"><Award className="w-6 h-6" /></div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="bg-primary/10 text-primary text-[8px] font-black h-4 px-2 uppercase border-none">{mock.examType}</Badge>
                          <span className="font-bold text-foreground">{mock.name}</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{mock.date} • {mock.score}/{mock.totalMarks} Marks</div>
                        {mock.weakTopics && mock.weakTopics.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {mock.weakTopics.map(topic => (
                              <Badge key={topic} variant="outline" className="text-[8px] text-yellow-600 border-yellow-200 dark:text-yellow-400 dark:border-yellow-900 font-bold uppercase tracking-tighter">
                                <AlertTriangle className="w-2.5 h-2.5 mr-1" />
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                      <div className="text-center">
                        <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Accuracy</div>
                        <div className="text-xl font-headline font-bold text-primary">{mock.accuracy}%</div>
                      </div>
                      <div className="text-center border-l border-border/50 pl-8">
                        <div className="text-[10px] text-success font-black uppercase tracking-widest mb-1">Correct</div>
                        <div className="text-xl font-headline font-bold text-success">{mock.correct}</div>
                      </div>
                      <div className="text-center border-l border-border/50 pl-8">
                        <div className="text-[10px] text-destructive font-black uppercase tracking-widest mb-1">Wrong</div>
                        <div className="text-xl font-headline font-bold text-destructive">{mock.wrong}</div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeMock(mock.id)} className="opacity-0 group-hover:opacity-100 transition-all text-destructive hover:bg-destructive/10 rounded-xl h-10 w-10">
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
  );
}
