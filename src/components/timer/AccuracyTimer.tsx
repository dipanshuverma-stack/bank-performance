"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Save, Trash2, Plus, Target, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ADDA247_SYLLABUS } from "@/lib/syllabus";

export function AccuracyTimer() {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [currentSubject, setCurrentSubject] = useState("Reasoning");
  const [currentTopic, setCurrentTopic] = useState("");
  const timerRef = useRef<any>(null);

  // Load logs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("accuracy-logs");
    if (saved) {
      try {
        setLogs(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse logs");
      }
    }
  }, []);

  // Save logs to localStorage
  useEffect(() => {
    localStorage.setItem("accuracy-logs", JSON.stringify(logs));
  }, [logs]);

  // Flatten the syllabus to get all topics (subtopics) for the current subject
  const availableTopics = useMemo(() => {
    const subjectData = ADDA247_SYLLABUS.find(s => s.name === currentSubject);
    if (!subjectData) return [];
    
    return subjectData.chapters.map(chapter => ({
      chapterName: chapter.name,
      topics: chapter.subtopics
    }));
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Timer Control Card */}
      <Card className="lg:col-span-1 bento-card shadow-2xl border-primary/10">
        <CardHeader className="bg-primary/5 pb-2">
          <CardTitle className="text-xl font-headline font-bold flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Precision Console
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center p-8 pt-6">
          <div className="text-7xl font-headline font-bold text-primary mb-10 tracking-tighter tabular-nums drop-shadow-sm">
            {formatTime(time)}
          </div>
          
          <div className="grid gap-5 w-full mb-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Domain</label>
              <Select value={currentSubject} onValueChange={(val) => {
                setCurrentSubject(val);
                setCurrentTopic("");
              }}>
                <SelectTrigger className="rounded-2xl border-2 h-12 bg-accent/30 dark:bg-slate-900 border-transparent focus:ring-primary font-bold">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="Reasoning" className="font-bold">Reasoning</SelectItem>
                  <SelectItem value="Quants" className="font-bold">Quants</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Syllabus Topic</label>
              <Select value={currentTopic} onValueChange={setCurrentTopic}>
                <SelectTrigger className="rounded-2xl border-2 h-12 bg-accent/30 dark:bg-slate-900 border-transparent focus:ring-primary font-bold">
                  <SelectValue placeholder="Identify sub-topic..." />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] rounded-2xl">
                  {availableTopics.map((group, gIdx) => (
                    <SelectGroup key={gIdx}>
                      <SelectLabel className="text-[10px] uppercase tracking-tighter text-primary font-black px-2 py-1 bg-primary/5 mb-1">
                        {group.chapterName}
                      </SelectLabel>
                      {group.topics.map(topic => (
                        <SelectItem key={topic.id} value={topic.name} className="text-xs font-semibold">
                          {topic.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4 w-full">
            <Button 
              className={`flex-1 rounded-2xl h-14 font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95 ${isActive ? 'bg-destructive/10 text-destructive border-destructive/20' : 'bg-primary text-primary-foreground shadow-primary/30'}`}
              onClick={handleStartPause} 
              variant={isActive ? "outline" : "default"}
            >
              {isActive ? <Pause className="w-5 h-5 mr-3" /> : <Play className="w-5 h-5 mr-3" />}
              {isActive ? "Pause" : "Live Start"}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleReset} className="rounded-2xl h-14 w-14 hover:bg-accent border-2 border-transparent">
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
        <CardFooter className="pt-2 px-8 pb-8">
          <Button 
            className="w-full bg-success hover:bg-success/90 rounded-2xl font-black uppercase tracking-widest h-14 shadow-xl shadow-success/20 transition-all active:scale-95 text-white disabled:opacity-30" 
            onClick={handleSaveLog} 
            disabled={time === 0 || !currentTopic}
          >
            <Save className="w-5 h-5 mr-3" />
            Log Performance
          </Button>
        </CardFooter>
      </Card>

      {/* Session Logs Card */}
      <Card className="lg:col-span-2 bento-card border-none shadow-xl bg-slate-50/50 dark:bg-white/5">
        <CardHeader className="bg-accent/5 py-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-headline font-bold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Session History
            </CardTitle>
            <Badge variant="outline" className="rounded-lg border-primary/20 text-primary font-black uppercase tracking-tighter text-[10px]">
              {logs.length} Recorded
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground/30">
              <div className="w-20 h-20 rounded-3xl bg-accent/50 flex items-center justify-center mb-6">
                <Plus className="w-10 h-10" />
              </div>
              <p className="font-bold text-lg text-foreground/40">No active performance data</p>
              <p className="text-[10px] uppercase font-black tracking-[0.2em] mt-2 bg-primary/10 text-primary px-3 py-1 rounded-full">
                Begin a timer session to build metrics
              </p>
            </div>
          ) : (
            <div className="space-y-5 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
              {logs.map((log) => (
                <div key={log.id} className="group flex items-center justify-between p-5 rounded-3xl border-2 border-border/40 bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="font-bold text-foreground text-sm lg:text-base">{log.topic}</span>
                      <Badge variant="secondary" className="text-[10px] font-black uppercase tracking-tighter h-5 px-2 rounded-lg bg-primary/10 text-primary border-none">
                        {log.subject}
                      </Badge>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                      {log.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="font-headline font-bold text-2xl text-primary tabular-nums leading-none mb-1.5">{formatTime(log.time)}</div>
                      <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Efficiency</div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteLog(log.id)} 
                      className="opacity-0 group-hover:opacity-100 transition-all text-destructive hover:bg-destructive/10 rounded-2xl shrink-0 h-12 w-12"
                    >
                      <Trash2 className="w-5 h-5" />
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
