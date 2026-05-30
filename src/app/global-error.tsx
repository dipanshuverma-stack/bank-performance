'use client';

/**
 * @fileOverview Minimalist Root Error Boundary.
 * Next.js 15 requires global-error to have its own html and body tags.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-50 flex items-center justify-center min-h-screen p-6 text-center font-sans">
        <div className="max-w-md w-full space-y-6">
          <div className="text-6xl mb-4">🚨</div>
          <h1 className="text-2xl font-black uppercase tracking-tighter">System Critical</h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            The terminal kernel has encountered a fatal exception. Global synchronization has been suspended.
          </p>
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-left">
            <pre className="text-[10px] text-red-400 overflow-auto whitespace-pre-wrap font-mono">
              {error.message || 'Kernel Failure'}
            </pre>
          </div>
          <button
            onClick={() => reset()}
            className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-colors shadow-lg shadow-indigo-500/20"
          >
            Reboot Kernel
          </button>
        </div>
      </body>
    </html>
  );
}
