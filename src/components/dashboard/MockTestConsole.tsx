"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Award, BarChart3, Target, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useUser } from "@/firebase";
import { useRealtimeCollection } from "@/hooks/use-database";
import { DatabaseService } from "@/services/database";
import { useToast } from "@/hooks/use-toast";
import { orderBy } from "firebase/firestore";

export function MockTestConsole() {
  const { toast } = useToast();
  const user = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [mockName, setMockName] = useState("");
  const [score, setScore] = useState("");
  const [accuracy, setAccuracy] = useState("");

  const { data: mocks, loading } = useRealtimeCollection('mocks', [orderBy('createdAt', 'desc')]);

  const addMock = async () => {
    if (!user || !mockName || !score) return;
    try {
      await DatabaseService.save(user.uid, 'mocks', {
        name: mockName,
        score: parseFloat(score),
        accuracy: parseFloat(accuracy) || 0,
        date: new Date().toLocaleDateString(),
      });
      setIsDialogOpen(false);
      setMockName(""); setScore(""); setAccuracy("");
      toast({ title: "Mock Archived", description: "Performance unit synced to cloud." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Write Error", description: err.message });
    }
  };

  return (
    <div className="space-y-8">
      <Card className="bento-card bg-card/40 border-white/5 shadow-2xl">
        <CardHeader className="bg-white/5 border-b border-white/5 flex flex-row items-center justify-between p-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner"><Award /></div>
            <CardTitle className="text-2xl font-headline font-black">Performance Vault</CardTitle>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-2xl bg-primary text-primary-foreground font-black uppercase text-[10px] tracking-widest px-8 h-12 shadow-xl">
                <Plus className="mr-2" /> Archive Unit
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-[2.5rem] bg-card border-none shadow-2xl">
              <DialogHeader><DialogTitle className="text-2xl font-headline font-black">Performance Logger</DialogTitle></DialogHeader>
              <div className="space-y-6 py-4">
                <Input placeholder="Mock Designation..." value={mockName} onChange={(e) => setMockName(e.target.value)} className="h-14 rounded-2xl bg-white/5 border-none font-bold" />
                <div className="grid grid-cols-2 gap-4">
                  <Input type="number" placeholder="Score" value={score} onChange={(e) => setScore(e.target.value)} className="h-14 rounded-2xl bg-white/5 border-none font-bold text-center" />
                  <Input type="number" placeholder="Accuracy %" value={accuracy} onChange={(e) => setAccuracy(e.target.value)} className="h-14 rounded-2xl bg-white/5 border-none font-bold text-center" />
                </div>
                <Button onClick={addMock} className="w-full h-16 rounded-2xl bg-primary font-black uppercase tracking-widest">Commit to Vault</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        
        <CardContent className="p-8">
          <div className="space-y-4">
            {mocks.map((mock: any) => (
              <div key={mock.id} className="group p-6 rounded-[2rem] border border-white/5 bg-white/5 flex items-center justify-between hover:border-primary/20 transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center shadow-inner"><BarChart3 /></div>
                  <div>
                    <div className="font-black text-xl tracking-tight">{mock.name}</div>
                    <div className="text-[10px] font-black uppercase text-muted-foreground tracking-widest opacity-60">{mock.date} • {mock.score} Marks</div>
                  </div>
                </div>
                <div className="flex items-center gap-10">
                  <div className="text-right">
                    <div className="text-3xl font-headline font-black text-primary tracking-tighter tabular-nums">{mock.accuracy}%</div>
                    <div className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Precision</div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => user && DatabaseService.remove(user.uid, 'mocks', mock.id)} className="opacity-0 group-hover:opacity-100 text-destructive"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
            {loading && <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary opacity-20" /></div>}
            {!loading && mocks.length === 0 && <div className="py-20 text-center font-black uppercase opacity-20 tracking-widest">Vault Empty</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
