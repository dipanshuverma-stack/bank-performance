"use client";

import { useEffect, useState } from "react";
import { generateMotivationalQuote } from "@/ai/flows/personalized-motivational-quotes-flow";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function QuoteCard() {
  const [quote, setQuote] = useState<string | null>(null);

  useEffect(() => {
    async function loadQuote() {
      try {
        const result = await generateMotivationalQuote({});
        setQuote(result.quote);
      } catch (error) {
        setQuote("Success is not final, failure is not fatal: it is the courage to continue that counts.");
      }
    }
    loadQuote();
  }, []);

  return (
    <Card className="bento-card border-none bg-gradient-to-br from-indigo-500 to-indigo-700 text-white">
      <CardContent className="p-6 h-full flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <Quote className="w-8 h-8 opacity-40 rotate-180" />
          <Sparkles className="w-4 h-4 opacity-50 animate-pulse" />
        </div>
        
        <div className="flex-1 flex items-center py-4">
          {quote ? (
            <p className="text-lg font-medium leading-relaxed italic">
              "{quote}"
            </p>
          ) : (
            <div className="space-y-2 w-full">
              <Skeleton className="h-4 w-full bg-white/20" />
              <Skeleton className="h-4 w-3/4 bg-white/20" />
            </div>
          )}
        </div>
        
        <div className="text-[10px] uppercase tracking-widest opacity-60 text-right">
          Daily Inspiration Hub
        </div>
      </CardContent>
    </Card>
  );
}
