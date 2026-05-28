"use client";

import { useEffect, useState } from "react";
import { generateMotivationalQuote } from "@/ai/flows/personalized-motivational-quotes-flow";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type QuoteData = {
  quote: string;
  author: string;
};

export function QuoteCard() {
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);

  useEffect(() => {
    async function loadQuote() {
      try {
        const result = await generateMotivationalQuote({});
        setQuoteData(result);
      } catch (error) {
        setQuoteData({
          quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
          author: "Winston Churchill"
        });
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
          {quoteData ? (
            <div className="w-full">
              <p className="text-lg font-medium leading-relaxed italic mb-2">
                "{quoteData.quote}"
              </p>
              <p className="text-xs font-bold text-right opacity-80 uppercase tracking-widest">
                — {quoteData.author}
              </p>
            </div>
          ) : (
            <div className="space-y-2 w-full">
              <Skeleton className="h-4 w-full bg-white/20" />
              <Skeleton className="h-4 w-3/4 bg-white/20" />
              <div className="flex justify-end">
                <Skeleton className="h-3 w-1/4 bg-white/20" />
              </div>
            </div>
          )}
        </div>
        
        <div className="text-[10px] uppercase tracking-widest opacity-60 text-right mt-2">
          Wisdom of the Elite
        </div>
      </CardContent>
    </Card>
  );
}
