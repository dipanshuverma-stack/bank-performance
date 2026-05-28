"use client";

import { useState } from "react";
import { ADDA247_SYLLABUS } from "@/lib/syllabus";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookMarked, CheckCircle2 } from "lucide-react";

export function SyllabusTracker() {
  const [syllabus, setSyllabus] = useState(ADDA247_SYLLABUS);

  const toggleSubtopic = (subjectIndex: number, chapterIndex: number, subtopicIndex: number) => {
    const newSyllabus = [...syllabus];
    newSyllabus[subjectIndex].chapters[chapterIndex].subtopics[subtopicIndex].completed = 
      !newSyllabus[subjectIndex].chapters[chapterIndex].subtopics[subtopicIndex].completed;
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

  return (
    <Card className="bento-card">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <BookMarked className="w-5 h-5 text-primary" />
          <CardTitle className="text-xl font-headline">Adda247 Syllabus Tracker</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="Reasoning">
          <TabsList className="w-full grid grid-cols-2 mb-6">
            {syllabus.map((subject, idx) => (
              <TabsTrigger key={subject.name} value={subject.name} className="relative">
                {subject.name}
                <span className="ml-2 text-[10px] bg-primary/10 text-primary px-1.5 rounded-full">
                  {calculateProgress(idx)}%
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {syllabus.map((subject, sIdx) => (
            <TabsContent key={subject.name} value={subject.name}>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Overall Completion</span>
                  <span className="text-sm font-bold">{calculateProgress(sIdx)}%</span>
                </div>
                <Progress value={calculateProgress(sIdx)} className="h-2" />
              </div>

              <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
                {subject.chapters.map((chapter, cIdx) => (
                  <div key={chapter.id} className="space-y-3">
                    <h4 className="font-headline font-semibold text-slate-800 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {chapter.name}
                    </h4>
                    <div className="grid gap-2 pl-4">
                      {chapter.subtopics.map((sub, stIdx) => (
                        <div key={sub.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                          <Checkbox 
                            id={sub.id} 
                            checked={sub.completed} 
                            onCheckedChange={() => toggleSubtopic(sIdx, cIdx, stIdx)}
                          />
                          <label 
                            htmlFor={sub.id} 
                            className={`text-sm cursor-pointer transition-all ${sub.completed ? 'text-muted-foreground line-through' : 'font-medium'}`}
                          >
                            {sub.name}
                          </label>
                          {sub.completed && <CheckCircle2 className="w-3.5 h-3.5 text-success ml-auto" />}
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
