
"use client";

import { useEffect, useState } from "react";
import { generateMotivationalQuote } from "@/ai/flows/personalized-motivational-quotes-flow";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type QuoteData = {
  quote: string;
  author: string;
  dateFetched?: string;
};

export function QuoteCard({ className }: { className?: string }) {
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);

  useEffect(() => {
    async function loadQuote() {
      // Check cache first to save AI quota
      const cached = localStorage.getItem("elite-daily-quote");
      const today = new Date().toLocaleDateString();
      
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed.dateFetched === today) {
            setQuoteData(parsed);
            return;
          }
        } catch (e) {
          // Ignore parse error and fetch fresh
        }
      }

      try {
        const result = await generateMotivationalQuote({});
        const dataWithDate = { ...result, dateFetched: today };
        setQuoteData(dataWithDate);
        localStorage.setItem("elite-daily-quote", JSON.stringify(dataWithDate));
      } catch (error) {
        setQuoteData({
          quote: "Dream is not that which you see while sleeping, it is something that does not let you sleep.",
          author: "Dr. APJ Abdul Kalam"
        });
      }
    }
    loadQuote();
  }, []);

  return (
    <Card className={cn("bento-card border-none bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-xl shadow-primary/10 flex flex-col", className)}>
      <CardContent className="p-6 flex-1 flex flex-col justify-between">
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
