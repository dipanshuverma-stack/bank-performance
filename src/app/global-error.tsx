'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-50 flex min-h-screen items-center justify-center p-8 text-center font-sans">
        <div className="max-w-md w-full space-y-8">
          <div className="text-6xl">⚠️</div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Critical Failure</h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            A fatal error occurred at the system root.
            <br />
            <span className="text-xs font-mono opacity-50 block mt-4">
              {error.message || 'Fatal Kernel Error'}
            </span>
          </p>
          <button
            onClick={() => reset()}
            className="w-full h-16 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-indigo-500/20 active:scale-95 transition-all"
          >
            Reset System Kernel
          </button>
        </div>
      </body>
    </html>
  );
}
