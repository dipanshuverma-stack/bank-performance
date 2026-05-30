"use client";

import { useEffect, useState } from "react";
import { generateMotivationalQuote } from "@/ai/flows/personalized-motivational-quotes-flow";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, Sparkles, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Predefined elite quotes to reduce Gemini usage and provide offline fallback
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
    // Use ISO string to ensure consistent daily tracking regardless of locale
    const today = new Date().toISOString().split('T')[0];

    try {
      if (forceAi) {
        // Manual refresh always tries the AI path
        const result = await generateMotivationalQuote({});
        const data = { ...result, dateFetched: today, isAiGenerated: true };
        setQuoteData(data);
        localStorage.setItem("elite-daily-quote", JSON.stringify(data));
      } else {
        // Check for cached daily quote first
        const cached = localStorage.getItem("elite-daily-quote");
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            // If the cached quote is from today, use it to save Gemini usage
            if (parsed.dateFetched === today) {
              setQuoteData(parsed);
              setLoading(false);
              return;
            }
          } catch (e) {
            console.warn("Invalid quote cache detected.");
          }
        }

        // If no cache for today, attempt AI curation
        try {
          const result = await generateMotivationalQuote({});
          const data = { ...result, dateFetched: today, isAiGenerated: true };
          setQuoteData(data);
          localStorage.setItem("elite-daily-quote", JSON.stringify(data));
        } catch (e) {
          // Fallback to random local quote if AI fails or limits reached
          const randomFallback = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
          const data = { ...randomFallback, dateFetched: today, isAiGenerated: false };
          setQuoteData(data);
          localStorage.setItem("elite-daily-quote", JSON.stringify(data));
        }
      }
    } catch (error) {
      // Emergency catch-all
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
    <Card className={cn("bento-card border-none bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-xl shadow-primary/10 flex items-center min-h-[110px] group overflow-visible", className)}>
      <CardContent className="p-5 md:p-6 py-5 flex-1 flex flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 md:gap-6 flex-1 min-w-0">
          <div className="p-3 md:p-4 bg-white/20 rounded-2xl backdrop-blur-xl shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-500 border border-white/10">
            <Quote className="w-5 h-5 md:w-6 md:h-6 text-white opacity-90 rotate-180" />
          </div>
          
          <div className="flex-1 min-w-0">
            {quoteData && !loading ? (
              <div className="space-y-2">
                <p className="text-sm md:text-base lg:text-lg font-bold leading-relaxed italic text-pretty">
                  "{quoteData.quote}"
                </p>
                <div className="flex items-center gap-3 opacity-80">
                  <div className="h-px w-4 bg-white/50" />
                  <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] truncate">
                    {quoteData.author}
                  </p>
                  {quoteData.isAiGenerated && (
                    <span className="text-[8px] bg-white/10 px-2 py-0.5 rounded-md font-black uppercase tracking-widest ml-auto border border-white/10">
                      AI Curated
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3 w-full">
                <Skeleton className="h-5 w-full bg-white/20 rounded-lg" />
                <Skeleton className="h-5 w-4/5 bg-white/20 rounded-lg" />
                <Skeleton className="h-3 w-1/4 bg-white/20 rounded-lg" />
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-3 shrink-0 ml-2">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => fetchQuote(true)} 
              disabled={loading}
              className="h-8 w-8 rounded-xl bg-white/10 hover:bg-white/20 text-white border-none transition-all active:scale-90"
              title="Generate New AI Quote"
            >
              <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
            </Button>
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
              <Sparkles className="w-4 h-4 opacity-80 animate-pulse text-white" />
            </div>
          </div>
          <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 text-right whitespace-nowrap">
            Daily Intelligence
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
