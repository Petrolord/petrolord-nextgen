// The ink rail's item classes (docs/scope/DesignSystem-Rollout.md section
// 5.2, batch 1A), shared by the Sidebar and its course navigation. They are
// pl-* roles that resolve inside the rail's fixed dark scope.
export const RAIL_ITEM = 'flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-200 group text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pl-focus';
export const RAIL_ITEM_ACTIVE = 'bg-pl-raised text-pl-text font-medium shadow-[inset_3px_0_0_rgb(var(--pl-accent))]';
export const RAIL_ITEM_IDLE = 'text-pl-muted hover:text-pl-text hover:bg-pl-raised/60';
