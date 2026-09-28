import React from 'react';
import { cn } from '@/lib/utils';
import { useDsTheme } from '@/design/themeContext';

// Design system: inside a scope the card uses the theme roles (as the
// Suite's card); outside one the legacy classes render unchanged.
const THEMED_CARD = "rounded-lg border border-pl-border bg-pl-surface text-pl-text shadow-pl-sm";
const THEMED_DESCRIPTION = "text-sm text-pl-muted";

const Card = React.forwardRef(({ className, ...props }, ref) => {
  const ds = useDsTheme();
  return (
    <div
      ref={ref}
      className={cn(
        ds ? THEMED_CARD : "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  );
});
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, ...props }, ref) => {
  const ds = useDsTheme();
  return (
    <p
      ref={ref}
      className={cn(ds ? THEMED_DESCRIPTION : "text-sm text-muted-foreground", className)}
      {...props}
    />
  );
});
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };