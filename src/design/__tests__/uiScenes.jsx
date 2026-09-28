// TEST-ONLY. One scene per adapted @/components/ui piece, open where the
// piece renders into a portal, so a test can compare what each renders:
// outside a scope (legacyUi.test.jsx: byte for byte what main rendered
// before wave 0) and inside one (uiKitScope.test.jsx: theme roles only).
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectLabel, SelectSeparator, SelectGroup } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription,
  AlertDialogFooter, AlertDialogAction, AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Toast, ToastTitle, ToastDescription, ToastClose, ToastAction, ToastProvider, ToastViewport } from '@/components/ui/toast';

const BUTTON_VARIANTS = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'];

export const UI_SCENES = [
  ['button', () => (
    <div>
      {BUTTON_VARIANTS.map((v) => <Button key={v} variant={v}>{v}</Button>)}
      <Button size="sm">sm</Button>
      <Button size="lg">lg</Button>
      <Button size="icon">i</Button>
      <Button disabled>off</Button>
    </div>
  )],
  ['badge', () => (
    <div>
      {['default', 'secondary', 'destructive', 'outline'].map((v) => <Badge key={v} variant={v}>{v}</Badge>)}
    </div>
  )],
  ['card', () => (
    <Card>
      <CardHeader><CardTitle>Title</CardTitle><CardDescription>Description</CardDescription></CardHeader>
      <CardContent>Body</CardContent>
      <CardFooter>Footer</CardFooter>
    </Card>
  )],
  ['fields', () => (
    <div>
      <Label htmlFor="a">Label</Label>
      <Input id="a" placeholder="Input" />
      <Input type="number" disabled defaultValue="4" />
      <Textarea placeholder="Textarea" />
    </div>
  )],
  ['select', () => (
    <Select open value="b" onValueChange={() => {}}>
      <SelectTrigger><SelectValue placeholder="Pick" /></SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Group</SelectLabel>
          <SelectItem value="a">Alpha</SelectItem>
          <SelectItem value="b">Beta</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectItem value="c" disabled>Gamma</SelectItem>
      </SelectContent>
    </Select>
  )],
  ['tabs', () => (
    <Tabs defaultValue="one">
      <TabsList>
        <TabsTrigger value="one">One</TabsTrigger>
        <TabsTrigger value="two">Two</TabsTrigger>
      </TabsList>
      <TabsContent value="one">First</TabsContent>
      <TabsContent value="two">Second</TabsContent>
    </Tabs>
  )],
  ['dialog', () => (
    <Dialog open>
      <DialogContent>
        <DialogHeader><DialogTitle>Dialog title</DialogTitle><DialogDescription>Dialog text</DialogDescription></DialogHeader>
        <DialogFooter><Button>OK</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  )],
  ['alert-dialog', () => (
    <AlertDialog open>
      <AlertDialogContent>
        <AlertDialogHeader><AlertDialogTitle>Sure?</AlertDialogTitle><AlertDialogDescription>It cannot be undone.</AlertDialogDescription></AlertDialogHeader>
        <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction>Go</AlertDialogAction></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )],
  ['dropdown-menu', () => (
    <DropdownMenu open>
      <DropdownMenuTrigger>Open</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Menu</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Item</DropdownMenuItem>
        <DropdownMenuCheckboxItem checked>Checked</DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )],
  ['toggles', () => (
    <div>
      <Switch checked onCheckedChange={() => {}} />
      <Switch checked={false} onCheckedChange={() => {}} />
      <Checkbox checked onCheckedChange={() => {}} />
      <Checkbox checked={false} onCheckedChange={() => {}} />
      <RadioGroup value="x" onValueChange={() => {}}>
        <RadioGroupItem value="x" />
        <RadioGroupItem value="y" />
      </RadioGroup>
    </div>
  )],
  ['alert', () => (
    <div>
      <Alert><AlertTitle>Note</AlertTitle><AlertDescription>Plain</AlertDescription></Alert>
      <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>Bad</AlertDescription></Alert>
    </div>
  )],
  ['table', () => (
    <Table>
      <TableCaption>Caption</TableCaption>
      <TableHeader><TableRow><TableHead>H</TableHead></TableRow></TableHeader>
      <TableBody><TableRow><TableCell>C</TableCell></TableRow></TableBody>
    </Table>
  )],
  ['misc', () => (
    <div>
      <Progress value={40} />
      <Separator />
      <Avatar><AvatarFallback>AB</AvatarFallback></Avatar>
      <ScrollArea className="h-10"><p>Scroll</p></ScrollArea>
    </div>
  )],
  ['popover', () => (
    <Popover open>
      <PopoverTrigger>Open</PopoverTrigger>
      <PopoverContent>Popover body</PopoverContent>
    </Popover>
  )],
  ['tooltip', () => (
    <TooltipProvider>
      <Tooltip open>
        <TooltipTrigger>Hover</TooltipTrigger>
        <TooltipContent>Tip</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )],
  ['toast', () => (
    <ToastProvider>
      <Toast open>
        <div><ToastTitle>Saved</ToastTitle><ToastDescription>All good</ToastDescription></div>
        <ToastAction altText="Undo">Undo</ToastAction>
        <ToastClose />
      </Toast>
      <Toast open variant="destructive"><ToastTitle>Failed</ToastTitle><ToastClose /></Toast>
      <ToastViewport />
    </ToastProvider>
  )],
];

/** Markup with the per-render ids React and Radix generate normalised away. */
export function normaliseMarkup(html) {
  return html
    .replace(/radix-:r[0-9a-z]+:/g, 'radix-:id:')
    .replace(/:r[0-9a-z]+:/g, ':id:');
}
