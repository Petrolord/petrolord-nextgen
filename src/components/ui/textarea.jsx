import * as React from "react"

import { cn } from "@/lib/utils"
import { useDsTheme } from "@/design/themeContext"

// Design system: matches Input inside a scope (the Suite's textarea).
const THEMED_TEXTAREA = "flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-pl-border-strong bg-pl-surface text-pl-text ring-offset-pl-bg placeholder:text-pl-muted focus-visible:ring-pl-focus"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  const ds = useDsTheme()
  return (
    <textarea
      className={cn(
        ds ? THEMED_TEXTAREA : "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }