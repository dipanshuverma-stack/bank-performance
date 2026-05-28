"use client";

import { useEffect, useState } from "react";
import { generateAdaptiveToDoList } from "@/ai/flows/generate-adaptive-to-do-list-flow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ListTodo, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdaptiveToDo() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshTasks = async () => {
    setLoading(true);
    try {
      // Mocked weak areas based on performance logs logic
      const weakAreas = [
        { subject: 'Quants', chapter: 'Profit, Loss & Discount', reason: 'Accuracy below 50%' },
        { subject: 'Reasoning', chapter: 'Circular Seating', reason: 'High time per question' }
      ];
      
      const result = await generateAdaptiveToDoList({
        weakAreas,
        availableStudyTimeMinutes: 300
      });
      setTasks(result.dailyToDoList);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshTasks();
  }, []);

  return (
    <Card className="bento-card h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <ListTodo className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg font-headline">Adaptive To-Do</CardTitle>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={refreshTasks} 
          disabled={loading}
          className="h-8 w-8"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.length > 0 ? tasks.map((task, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg border bg-accent/5 hover:bg-accent/10 transition-colors">
              <Checkbox id={`task-${i}`} className="mt-1" />
              <div className="grid gap-1">
                <label htmlFor={`task-${i}`} className="text-sm font-semibold leading-none cursor-pointer">
                  {task.chapter}
                </label>
                <p className="text-xs text-muted-foreground leading-tight">
                  {task.taskDescription}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    {task.subject}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">
                    {task.estimatedTimeMinutes} mins
                  </span>
                </div>
              </div>
            </div>
          )) : (
             <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <p className="text-sm">Optimizing your schedule...</p>
             </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
