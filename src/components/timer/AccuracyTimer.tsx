"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Save, Trash2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AccuracyTimer() {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [currentSubject, setCurrentSubject] = useState("Reasoning");
  const [currentTopic, setCurrentTopic] = useState("");
  const timerRef = useRef<any>(null);

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
  };

  const deleteLog = (id: number) => {
    setLogs(logs.filter(l => l.id !== id));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1 bento-card">
        <CardHeader>
          <CardTitle className="text-xl font-headline">Precision Timer</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="text-6xl font-headline font-bold text-primary mb-8 tracking-tighter tabular-nums">
            {formatTime(time)}
          </div>
          
          <div className="grid gap-4 w-full mb-6">
            <Select value={currentSubject} onValueChange={setCurrentSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Reasoning">Reasoning</SelectItem>
                <SelectItem value="Quants">Quants</SelectItem>
              </SelectContent>
            </Select>
            <Input 
              placeholder="Chapter/Topic Name" 
              value={currentTopic}
              onChange={(e) => setCurrentTopic(e.target.value)}
            />
          </div>

          <div className="flex gap-4 w-full">
            <Button className="flex-1" onClick={handleStartPause} variant={isActive ? "outline" : "default"}>
              {isActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isActive ? "Pause" : "Start"}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-success hover:bg-success/90" onClick={handleSaveLog} disabled={time === 0}>
            <Save className="w-4 h-4 mr-2" />
            Log Session
          </Button>
        </CardFooter>
      </Card>

      <Card className="lg:col-span-2 bento-card">
        <CardHeader>
          <CardTitle className="text-xl font-headline">Session History</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground opacity-50">
              <Plus className="w-12 h-12 mb-2" />
              <p>No active sessions logged today</p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 rounded-xl border bg-slate-50">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{log.topic}</span>
                      <Badge variant="outline" className="text-[10px]">{log.subject}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{log.date}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="font-headline font-bold text-lg">{formatTime(log.time)}</div>
                      <div className="text-[10px] text-muted-foreground uppercase">Duration</div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteLog(log.id)} className="text-error hover:text-error hover:bg-error/10">
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
