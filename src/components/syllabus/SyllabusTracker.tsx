
"use client";

import { useState, useEffect } from "react";
import { ADDA247_SYLLABUS } from "@/lib/syllabus";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookMarked, CheckCircle2 } from "lucide-react";

export function SyllabusTracker() {
  const [mounted, setMounted] = useState(false);
  const [syllabus, setSyllabus] = useState(ADDA247_SYLLABUS);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("elite-syllabus-v2");
    if (saved) {
      try {
        setSyllabus(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load syllabus");
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("elite-syllabus-v2", JSON.stringify(syllabus));
    }
  }, [syllabus, mounted]);

  const logAuditAction = (category: string, action: string, details: string) => {
    const audit = JSON.parse(localStorage.getItem("elite-audit-logs") || "[]");
    const newLog = {
      id: Math.random().toString(36).substr(2, 9),
      category,
      action,
      details,
      timestamp: new Date().toLocaleString(),
    };
    localStorage.setItem("elite-audit-logs", JSON.stringify([newLog, ...audit].slice(0, 50)));
  };

  const toggleSubtopic = (subjectIndex: number, chapterIndex: number, subtopicIndex: number) => {
    const newSyllabus = [...syllabus];
    const subtopic = newSyllabus[subjectIndex].chapters[chapterIndex].subtopics[subtopicIndex];
    subtopic.completed = !subtopic.completed;
    
    logAuditAction("Knowledge", "Topic Protocol Updated", `${subtopic.name} status: ${subtopic.completed ? 'Completed' : 'Reset'}`);
    
    setSyllabus(newSyllabus);
  };

  const calculateProgress = (subjectIndex: number) => {
    const chapters = syllabus[subjectIndex].chapters;
    let total = 0;
    let completed = 0;
    chapters.forEach(ch => {
      ch.subtopics.forEach(sub => {
        total++;
        if (sub.completed) completed++;
      });
    });
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  if (!mounted) return null;

  return (
    <Card className="bento-card bg-card/50">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <BookMarked className="w-5 h-5 text-primary" />
          <CardTitle className="text-xl font-headline font-bold">Adda247 Syllabus Tracker</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="Reasoning">
          <TabsList className="w-full grid grid-cols-2 mb-6 bg-accent/20 rounded-xl p-1 h-11">
            {syllabus.map((subject, idx) => (
              <TabsTrigger key={subject.name} value={subject.name} className="relative font-bold text-xs rounded-lg data-[state=active]:bg-card">
                {subject.name}
                <span className="ml-2 text-[10px] bg-primary/10 text-primary px-1.5 rounded-full">
                  {calculateProgress(idx)}%
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {syllabus.map((subject, sIdx) => (
            <TabsContent key={subject.name} value={subject.name}>
              <div className="mb-8 p-6 rounded-2xl bg-accent/10 border border-border/50">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Subject Readiness</span>
                  <span className="text-lg font-headline font-black text-primary">{calculateProgress(sIdx)}%</span>
                </div>
                <Progress value={calculateProgress(sIdx)} className="h-2 bg-primary/10" />
              </div>

              <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
                {subject.chapters.map((chapter, cIdx) => (
                  <div key={chapter.id} className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/70 flex items-center gap-2 mb-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {chapter.name}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {chapter.subtopics.map((sub, stIdx) => (
                        <div key={sub.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-300 ${sub.completed ? 'bg-primary/[0.03] border-primary/10' : 'bg-card border-border/40 hover:border-primary/20'}`}>
                          <Checkbox 
                            id={sub.id} 
                            checked={sub.completed} 
                            onCheckedChange={() => toggleSubtopic(sIdx, cIdx, stIdx)}
                            className="rounded-md border-2"
                          />
                          <label 
                            htmlFor={sub.id} 
                            className={`text-xs cursor-pointer transition-all leading-tight ${sub.completed ? 'text-muted-foreground/60 line-through' : 'font-bold text-foreground/80'}`}
                          >
                            {sub.name}
                          </label>
                          {sub.completed && <CheckCircle2 className="w-3.5 h-3.5 text-primary ml-auto" />}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
