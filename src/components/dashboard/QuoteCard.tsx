"use client";

import { useEffect, useState } from "react";
import { generateMotivationalQuote } from "@/ai/flows/personalized-motivational-quotes-flow";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, Sparkles, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const FALLBACK_QUOTES = [
  { quote: "The best way to predict the future is to create it.", author: "Abraham Lincoln" },
  { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { quote: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { quote: "Arise, awake, and stop not until the goal is reached.", author: "Swami Vivekananda" },
  { quote: "Dream is not that which you see while sleeping, it is something that does not let you sleep.", author: "Dr. APJ Abdul Kalam" },
  { quote: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { quote: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
];

type QuoteData = {
  quote: string;
  author: string;
  dateFetched?: string;
  isAiGenerated?: boolean;
};

export function QuoteCard({ className }: { className?: string }) {
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchQuote = async (forceAi = false) => {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];

    try {
      if (forceAi) {
        const result = await generateMotivationalQuote({});
        const data = { ...result, dateFetched: today, isAiGenerated: true };
        setQuoteData(data);
        localStorage.setItem("elite-daily-quote", JSON.stringify(data));
      } else {
        const cached = localStorage.getItem("elite-daily-quote");
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (parsed.dateFetched === today) {
              setQuoteData(parsed);
              setLoading(false);
              return;
            }
          } catch (e) {
            console.warn("Invalid quote cache detected.");
          }
        }

        try {
          const result = await generateMotivationalQuote({});
          const data = { ...result, dateFetched: today, isAiGenerated: true };
          setQuoteData(data);
          localStorage.setItem("elite-daily-quote", JSON.stringify(data));
        } catch (e) {
          const randomFallback = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
          const data = { ...randomFallback, dateFetched: today, isAiGenerated: false };
          setQuoteData(data);
          localStorage.setItem("elite-daily-quote", JSON.stringify(data));
        }
      }
    } catch (error) {
      const randomFallback = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
      setQuoteData({ ...randomFallback, dateFetched: today, isAiGenerated: false });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <Card className={cn("bento-card border-none bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-2xl shadow-primary/20 flex items-center min-h-[120px] group overflow-visible", className)}>
      <CardContent className="p-6 md:p-8 py-6 flex-1 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start md:items-center gap-6 flex-1 min-w-0">
          <div className="p-4 bg-white/20 rounded-[1.75rem] backdrop-blur-2xl shrink-0 shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 border border-white/10">
            <Quote className="w-6 h-6 text-white opacity-100 rotate-180" />
          </div>
          
          <div className="flex-1 min-w-0 space-y-2">
            {quoteData && !loading ? (
              <>
                <p className="text-base md:text-lg lg:text-xl font-bold leading-tight italic text-pretty">
                  "{quoteData.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-px w-6 bg-white/40" />
                  <p className="text-[11px] font-black uppercase tracking-[0.3em] truncate opacity-90">
                    {quoteData.author}
                  </p>
                  {quoteData.isAiGenerated && (
                    <span className="text-[8px] bg-white/15 px-3 py-1 rounded-full font-black uppercase tracking-widest ml-auto border border-white/10">
                      AI Curated
                    </span>
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-3 w-full">
                <Skeleton className="h-6 w-full bg-white/20 rounded-xl" />
                <Skeleton className="h-6 w-4/5 bg-white/20 rounded-xl" />
                <Skeleton className="h-4 w-1/4 bg-white/20 rounded-xl" />
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-row md:flex-col items-center md:items-end gap-4 shrink-0 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => fetchQuote(true)} 
            disabled={loading}
            className="h-10 w-10 rounded-2xl bg-white/10 hover:bg-white/25 text-white border-none transition-all active:rotate-180 duration-700"
            title="Generate New AI Quote"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          </Button>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 mb-1">
               <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
               <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">Intelligence</span>
            </div>
            <span className="text-[8px] font-black uppercase tracking-[0.1em] opacity-40">Operational Daily Brief</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}