'use client';

/**
 * @fileOverview Segment-level error boundary.
 * Hardened with inline styles to survive asset loading failures.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 20px; text-align: center; background-color: rgba(2, 6, 23, 0.5); border-radius: 32px; border: 2px dashed rgba(239, 68, 68, 0.2); margin: 40px auto; max-width: 600px; font-family: system-ui, sans-serif;">
      <div style="width: 64px; height: 64px; background-color: rgba(239, 68, 68, 0.1); border-radius: 20px; display: flex; align-items: center; justify-content: center; fontSize: 32px; margin-bottom: 24px;">
        ⚠️
      </div>
      <h2 style="fontSize: 22px; font-weight: 900; margin-bottom: 12px; color: #f8fafc; letter-spacing: -0.01em;">MODULE FAULT</h2>
      <p style="color: #94a3b8; fontSize: 14px; max-width: 350px; margin-bottom: 32px; line-height: 1.5;">
        {error?.message || "A system sub-module has encountered a resource conflict."}
      </p>
      <button
        onClick={() => reset()}
        style="height: 52px; padding: 0 32px; background-color: #4f46e5; color: white; border: none; border-radius: 14px; font-weight: 900; fontSize: 12px; text-transform: uppercase; letter-spacing: 0.1em; cursor: pointer;"
      >
        Retry Module
      </button>
    </div>
  );
}
