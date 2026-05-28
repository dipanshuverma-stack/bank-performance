"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Save, Trash2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ADDA247_SYLLABUS } from "@/lib/syllabus";

export function AccuracyTimer() {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [currentSubject, setCurrentSubject] = useState("Reasoning");
  const [currentTopic, setCurrentTopic] = useState("");
  const timerRef = useRef<any>(null);

  // Get available chapters for the current subject
  const availableChapters = useMemo(() => {
    const subjectData = ADDA247_SYLLABUS.find(s => s.name === currentSubject);
    return subjectData ? subjectData.chapters : [];
  }, [currentSubject]);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartPause = () => setIsActive(!isActive);
  const handleReset = () => {
    setIsActive(false);
    setTime(0);
  };

  const handleSaveLog = () => {
    if (!currentTopic) return;
    const newLog = {
      id: Date.now(),
      subject: currentSubject,
      topic: currentTopic,
      time: time,
      date: new Date().toLocaleDateString(),
    };
    setLogs([newLog, ...logs]);
    handleReset();
    setCurrentTopic("");
  };

  const deleteLog = (id: number) => {
    setLogs(logs.filter(l => l.id !== id));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1 bento-card">
        <CardHeader>
          <CardTitle className="text-xl font-headline font-bold">Precision Timer</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center p-6 pt-0">
          <div className="text-6xl font-headline font-bold text-primary mb-8 tracking-tighter tabular-nums">
            {formatTime(time)}
          </div>
          
          <div className="grid gap-4 w-full mb-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground ml-1">Subject</label>
              <Select value={currentSubject} onValueChange={(val) => {
                setCurrentSubject(val);
                setCurrentTopic("");
              }}>
                <SelectTrigger className="rounded-xl border-2 h-11 bg-accent/30 border-transparent focus:ring-primary">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Reasoning">Reasoning</SelectItem>
                  <SelectItem value="Quants">Quants</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground ml-1">Chapter / Topic</label>
              <Select value={currentTopic} onValueChange={setCurrentTopic}>
                <SelectTrigger className="rounded-xl border-2 h-11 bg-accent/30 border-transparent focus:ring-primary">
                  <SelectValue placeholder="Choose a chapter..." />
                </SelectTrigger>
                <SelectContent>
                  {availableChapters.map(chapter => (
                    <SelectItem key={chapter.id} value={chapter.name}>
                      {chapter.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4 w-full">
            <Button 
              className="flex-1 rounded-xl h-11 font-bold shadow-lg shadow-primary/20" 
              onClick={handleStartPause} 
              variant={isActive ? "outline" : "default"}
            >
              {isActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isActive ? "Pause Session" : "Start Session"}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleReset} className="rounded-xl h-11 w-11 hover:bg-accent">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <Button 
            className="w-full bg-success hover:bg-success/90 rounded-xl font-bold h-11 shadow-lg shadow-success/20 transition-all active:scale-95" 
            onClick={handleSaveLog} 
            disabled={time === 0 || !currentTopic}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Performance
          </Button>
        </CardFooter>
      </Card>

      <Card className="lg:col-span-2 bento-card">
        <CardHeader className="bg-accent/5 py-4">
          <CardTitle className="text-xl font-headline font-bold">Session Activity Log</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/30">
              <div className="w-16 h-16 rounded-full bg-accent/50 flex items-center justify-center mb-4">
                <Plus className="w-8 h-8" />
              </div>
              <p className="font-bold text-sm text-foreground/50">No active sessions logged</p>
              <p className="text-[10px] uppercase font-bold tracking-widest mt-1">Start tracking to build data</p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="group flex items-center justify-between p-4 rounded-2xl border-2 border-border/50 bg-card hover:border-primary/20 transition-all duration-300">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-foreground text-sm">{log.topic}</span>
                      <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-tighter h-4 px-1.5 rounded-md">
                        {log.subject}
                      </Badge>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{log.date}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="font-headline font-bold text-xl text-primary tabular-nums leading-none mb-1">{formatTime(log.time)}</div>
                      <div className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em]">Duration</div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteLog(log.id)} 
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10 rounded-xl shrink-0"
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
  );
}
