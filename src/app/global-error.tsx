'use client'

import { Plus_Jakarta_Sans, Outfit } from 'next/font/google'
import '@/app/globals.css'

/**
 * @fileOverview Global fatal error boundary. 
 * Handles errors at the root layout level, providing a clean system reset.
 */

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${outfit.variable}`}>
      <body className="font-body bg-background text-foreground flex min-h-screen flex-col items-center justify-center p-8 text-center">
        <div className="max-w-md w-full space-y-10">
          <div className="inline-block p-5 bg-primary/10 rounded-[2.5rem] mb-2 shadow-inner">
             <div className="w-16 h-16 bg-primary rounded-[2rem] flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/40">
                <span className="font-black text-3xl">!</span>
             </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-headline font-black tracking-tighter text-foreground leading-none">
              CRITICAL <span className="text-primary italic">FAILURE</span>
            </h1>
            <p className="text-muted-foreground font-black uppercase tracking-[0.3em] text-[10px] opacity-60">
              Emergency System Shutdown Initiated
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              A fatal error occurred at the system kernel level. All active missions have been suspended 
              to preserve the integrity of the performance archives.
            </p>
          </div>

          <button
            onClick={() => reset()}
            className="w-full h-16 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-[1.02] transition-transform flex items-center justify-center gap-3 active:scale-95"
          >
            Reset System Kernel
          </button>
          
          <div className="pt-10 border-t border-border/40">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30">
              Elite Performance Terminal v3.1.2 • Operational Recovery
            </p>
          </div>
        </div>
      </body>
    </html>
  )
}
