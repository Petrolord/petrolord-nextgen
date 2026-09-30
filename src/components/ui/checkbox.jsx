import React from "react";
import * as CheckboxPrimitives from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

// Design system: the Suite's version on theme roles.

const Checkbox = React.forwardRef(({ className, ...props }, ref) => {
  return (
  <CheckboxPrimitives.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-[4px] border-pl-border-strong bg-pl-surface ring-offset-pl-bg focus-visible:ring-pl-focus data-[state=checked]:border-pl-primary data-[state=checked]:bg-pl-primary data-[state=checked]:text-pl-primary-fg",
      className
    )}
    {...props}
  >
    <CheckboxPrimitives.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitives.Indicator>
  </CheckboxPrimitives.Root>
  )
});
Checkbox.displayName = CheckboxPrimitives.Root.displayName;

export { Checkbox };