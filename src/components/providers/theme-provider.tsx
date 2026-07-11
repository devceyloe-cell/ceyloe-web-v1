"use client";

/**
 * Site is light-only. Avoid next-themes ThemeProvider — it injects a <script>
 * from a client component, which triggers React 19's console warning:
 * "Encountered a script tag while rendering React component".
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
