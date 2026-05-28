
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Activity, 
  Trophy, 
  Target, 
  Trash2,
  TrendingUp,
  History
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MockLog {
  id: string;
  name: string;
  score: number;
  accuracy: number;
  date: string;
}

export function MockTestConsole() {
  const { toast } = useToast();
  const [mocks, setMocks] = useState<MockLog[]>([]);
  const [mockName, setMockName] = useState("");
  const [score, setScore] = useState("");
  const [accuracy, setAccuracy] = useState("");

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
    if (!mockName || !score || !accuracy) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all mock test details.",
      });
      return;
    }

    const newMock: MockLog = {
      id: Math.random().toString(36).substr(2, 9),
      name: mockName,
      score: parseFloat(score),
      accuracy: parseFloat(accuracy),
      date: new Date().toLocaleDateString(),
    };

    setMocks([newMock, ...mocks]);
    setMockName("");
    setScore("");
    setAccuracy("");
    
    toast({
      title: "Performance Logged",
      description: `Successfully added ${mockName} to your records.`,
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Mock Logger Input */}
        <Card className="bento-card lg:col-span-1 border-primary/10">
          <CardHeader className="bg-primary/5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Trophy className="w-5 h-5" />
              </div>
              <CardTitle className="text-xl font-headline font-bold">Log Mock Test</CardTitle>
            </div>
            <CardDescription className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-10">
              Session Metric Capture
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-6 space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Mock Name/Number</label>
              <Input 
                placeholder="e.g. SBI PO Mock 12" 
                value={mockName}
                onChange={(e) => setMockName(e.target.value)}
                className="rounded-2xl border-2 h-12 bg-accent/30 dark:bg-slate-900 border-transparent focus:ring-primary font-bold"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Score</label>
                <Input 
                  type="number"
                  placeholder="0.0" 
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  className="rounded-2xl border-2 h-12 bg-accent/30 dark:bg-slate-900 border-transparent focus:ring-primary font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Accuracy %</label>
                <Input 
                  type="number"
                  placeholder="0.0" 
                  value={accuracy}
                  onChange={(e) => setAccuracy(e.target.value)}
                  className="rounded-2xl border-2 h-12 bg-accent/30 dark:bg-slate-900 border-transparent focus:ring-primary font-bold"
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

        {/* Mock Summary & History */}
        <Card className="bento-card lg:col-span-2 border-none bg-slate-50/50 dark:bg-white/5 shadow-xl">
          <CardHeader className="bg-accent/5 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                <CardTitle className="text-xl font-headline font-bold">Mock Analytics</CardTitle>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Avg Accuracy</div>
                  <div className="text-xl font-headline font-bold text-primary">{avgAccuracy}%</div>
                </div>
                <Badge variant="outline" className="rounded-lg border-primary/20 text-primary font-black uppercase tracking-tighter text-[10px] h-8 px-3">
                  {totalMocks} Total Mocks
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            {mocks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/30">
                <div className="w-20 h-20 rounded-3xl bg-accent/50 flex items-center justify-center mb-6">
                  <Activity className="w-10 h-10" />
                </div>
                <p className="font-bold text-lg text-foreground/40">No mock tests recorded</p>
                <p className="text-[10px] uppercase font-black tracking-[0.2em] mt-2 bg-primary/10 text-primary px-3 py-1 rounded-full">
                  Elite aspirants track every attempt
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 scrollbar-hide">
                {mocks.map((mock) => (
                  <div key={mock.id} className="group flex items-center justify-between p-5 rounded-3xl border-2 border-border/40 bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Target className="w-6 h-6" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground text-sm lg:text-base">{mock.name}</span>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{mock.date}</span>
                          <Badge variant="secondary" className="bg-success/10 text-success text-[8px] font-black uppercase h-4 px-1.5 border-none">
                            Verified
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Score</div>
                        <div className="text-xl font-headline font-bold text-foreground">{mock.score}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Accuracy</div>
                        <div className="text-xl font-headline font-bold text-success">{mock.accuracy}%</div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeMock(mock.id)} 
                        className="opacity-0 group-hover:opacity-100 transition-all text-destructive hover:bg-destructive/10 rounded-2xl h-10 w-10 shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
