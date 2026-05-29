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
    <Card className={cn("bento-card border-none bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-xl shadow-primary/10 flex items-center min-h-[100px]", className)}>
      <CardContent className="p-5 md:p-6 py-4 flex-1 flex flex-row items-center justify-between gap-6 md:gap-8">
        <div className="flex items-center gap-4 md:gap-5 flex-1 min-w-0">
          <div className="p-2.5 md:p-3 bg-white/20 rounded-2xl backdrop-blur-xl shrink-0">
            <Quote className="w-4 h-4 md:w-5 md:h-5 text-white opacity-90 rotate-180" />
          </div>
          
          <div className="flex-1 min-w-0">
            {quoteData ? (
              <div className="space-y-1.5">
                <p className="text-xs md:text-sm lg:text-base font-bold leading-tight italic text-pretty">
                  "{quoteData.quote}"
                </p>
                <div className="flex items-center gap-2 opacity-80">
                  <div className="h-px w-3 md:w-4 bg-white/50" />
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] truncate">
                    {quoteData.author}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2 w-full">
                <Skeleton className="h-4 w-full bg-white/20" />
                <Skeleton className="h-3 w-1/4 bg-white/20" />
              </div>
            )}
          </div>
        </div>
        
        <div className="hidden sm:flex flex-col items-end gap-1 shrink-0 ml-2">
          <Sparkles className="w-4 h-4 opacity-50 animate-pulse text-white" />
          <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40 text-right">
            Daily Wisdom
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
