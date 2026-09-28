import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"
import { useThemeClass } from "@/design/themeClass"
import { usePortalThemeProps } from "@/design/themeContext"

// Design system: inside a scope each legacy class string maps to the Suite's
// version on theme roles; outside one tc() returns the legacy string unchanged.
const THEMED = {
  "z-50 overflow-hidden rounded-md border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-50 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2":
    "z-50 overflow-hidden rounded-md border px-3 py-1.5 text-xs shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 border-transparent bg-pl-text text-pl-surface shadow-pl-md",
}

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => {
  const tc = useThemeClass(THEMED)
  const portalProps = usePortalThemeProps()
  return (
  <TooltipPrimitive.Content
    ref={ref}
    {...portalProps}
    sideOffset={sideOffset}
    className={cn(
      tc("z-50 overflow-hidden rounded-md border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-50 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"),
      className
    )}
    {...props} />
  )
})
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }