import React from 'react';
import { cn } from "@/lib/utils";
import { useDsTheme } from "@/design/themeContext";

// Design system: the Suite's current input styling, inside a scope only.
// Outside one the legacy classes render unchanged.
export const THEMED_INPUT = "flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-pl-border-strong bg-pl-surface text-pl-text ring-offset-pl-bg placeholder:text-pl-muted focus-visible:ring-pl-focus";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  const ds = useDsTheme();
  return (
    (<input
      type={type}
      className={cn(
        ds ? THEMED_INPUT : "flex h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 ring-offset-slate-950 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BFFF00] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props} />)
  );
});
Input.displayName = "Input";

export { Input };