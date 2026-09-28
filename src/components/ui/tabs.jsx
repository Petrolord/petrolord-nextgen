import React from 'react';
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";
import { useThemeClass } from "@/design/themeClass";

// Design system: the Suite's tabs on theme roles inside a scope; the legacy
// lime tabs outside one, unchanged.

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef(({ className, ...props }, ref) => {
  const tc = useThemeClass();
  return (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      tc(
        "inline-flex h-10 items-center justify-center rounded-md bg-slate-800 p-1 text-slate-400",
        "inline-flex h-10 items-center justify-center rounded-md border border-pl-border bg-pl-sunken p-1 text-pl-muted"
      ),
      className
    )}
    {...props}
  />
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => {
  const tc = useThemeClass();
  return (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      tc(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-slate-950 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-[#BFFF00] data-[state=active]:text-slate-950 data-[state=active]:shadow-sm",
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-pl-bg transition-all hover:text-pl-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pl-focus focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-pl-surface data-[state=active]:text-pl-text data-[state=active]:shadow-pl-sm"
      ),
      className
    )}
    {...props}
  />
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef(({ className, ...props }, ref) => {
  const tc = useThemeClass();
  return (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      tc(
        "mt-2 ring-offset-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2",
        "mt-2 ring-offset-pl-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pl-focus focus-visible:ring-offset-2"
      ),
      className
    )}
    {...props}
  />
  );
});
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
