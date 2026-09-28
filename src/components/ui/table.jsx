import * as React from "react"
import { cn } from "@/lib/utils"
import { useThemeClass } from "@/design/themeClass"

// Design system: inside a scope each legacy class string maps to the Suite's
// version on theme roles; outside one tc() returns the legacy string unchanged.
const THEMED = {
  "[&_tr]:border-b":
    "[&_tr]:border-b bg-pl-sunken",
  "bg-primary font-medium text-primary-foreground":
    "border-t border-pl-border bg-pl-sunken font-medium text-pl-text",
  "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted":
    "border-b transition-colors border-pl-border hover:bg-pl-sunken/60 data-[state=selected]:bg-pl-sunken",
  "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0":
    "px-4 text-left align-middle [&:has([role=checkbox])]:pr-0 h-10 text-xs font-semibold uppercase tracking-wide text-pl-muted",
  "p-4 align-middle [&:has([role=checkbox])]:pr-0":
    "p-4 align-middle [&:has([role=checkbox])]:pr-0 text-pl-text",
  "mt-4 text-sm text-muted-foreground":
    "mt-4 text-sm text-pl-muted",
}

const Table = React.forwardRef(({ className, ...props }, ref) => {
  const tc = useThemeClass(THEMED)
  return (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props} />
  </div>
  )
})
Table.displayName = "Table"

const TableHeader = React.forwardRef(({ className, ...props }, ref) => {
  const tc = useThemeClass(THEMED)
  return (
  <thead ref={ref} className={cn(tc("[&_tr]:border-b"), className)} {...props} />
  )
})
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef(({ className, ...props }, ref) => {
  const tc = useThemeClass(THEMED)
  return (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props} />
  )
})
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef(({ className, ...props }, ref) => {
  const tc = useThemeClass(THEMED)
  return (
  <tfoot
    ref={ref}
    className={cn(tc("bg-primary font-medium text-primary-foreground"), className)}
    {...props} />
  )
})
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef(({ className, ...props }, ref) => {
  const tc = useThemeClass(THEMED)
  return (
  <tr
    ref={ref}
    className={cn(
      tc("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"),
      className
    )}
    {...props} />
  )
})
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef(({ className, ...props }, ref) => {
  const tc = useThemeClass(THEMED)
  return (
  <th
    ref={ref}
    className={cn(
      tc("h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"),
      className
    )}
    {...props} />
  )
})
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef(({ className, ...props }, ref) => {
  const tc = useThemeClass(THEMED)
  return (
  <td
    ref={ref}
    className={cn(tc("p-4 align-middle [&:has([role=checkbox])]:pr-0"), className)}
    {...props} />
  )
})
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef(({ className, ...props }, ref) => {
  const tc = useThemeClass(THEMED)
  return (
  <caption
    ref={ref}
    className={cn(tc("mt-4 text-sm text-muted-foreground"), className)}
    {...props} />
  )
})
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}