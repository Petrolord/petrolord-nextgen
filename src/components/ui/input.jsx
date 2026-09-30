import React from 'react';
import { cn } from "@/lib/utils";

// Design system: the Suite's current input styling, on theme roles.
export const THEMED_INPUT = "flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-pl-border-strong bg-pl-surface text-pl-text ring-offset-pl-bg placeholder:text-pl-muted focus-visible:ring-pl-focus";

const Input = React.forwardRef(({ className, type, ...props }, ref) => (
  <input type={type} className={cn(THEMED_INPUT, className)} ref={ref} {...props} />
));
Input.displayName = "Input";

export { Input };