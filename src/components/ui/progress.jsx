import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"
import { useThemeClass } from "@/design/themeClass"

// Design system: inside a scope each legacy class string maps to the Suite's
// version on theme roles; outside one tc() returns the legacy string unchanged.
const THEMED = {
  "relative h-4 w-full overflow-hidden rounded-full bg-secondary":
    "relative h-4 w-full overflow-hidden rounded-full bg-pl-border",
  "h-full w-full flex-1 bg-primary transition-all":
    "h-full w-full flex-1 bg-pl-primary transition-all",
}

const Progress = React.forwardRef(({ className, value, ...props }, ref) => {
  const tc = useThemeClass(THEMED)
  return (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      tc("relative h-4 w-full overflow-hidden rounded-full bg-secondary"),
      className
    )}
    {...props}>
    <ProgressPrimitive.Indicator
      className={tc("h-full w-full flex-1 bg-primary transition-all")}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }} />
  </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }