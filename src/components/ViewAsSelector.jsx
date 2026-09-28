import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Eye, ShieldAlert } from 'lucide-react';
import { useRole, ROLES, ROLE_LABELS } from '@/contexts/RoleContext';
import { useThemeClass } from '@/design/themeClass';

// Design system: theme roles inside the signed-in scope, legacy classes
// (unchanged) elsewhere. See docs/scope/DesignSystem-Rollout.md.

const ViewAsSelector = () => {
  const { viewRole, changeViewRole, canImpersonate, actualRole } = useRole();
  const tc = useThemeClass();

  if (!canImpersonate) return null;

  const isImpersonating = viewRole !== actualRole;

  return (
    <div className={tc("flex items-center gap-2 bg-slate-900/50 p-2 rounded-lg border border-slate-800", "flex items-center gap-2 bg-pl-sunken p-2 rounded-lg border border-pl-border")}>
      <div className={tc("flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wider pl-2", "flex items-center gap-2 text-xs font-medium text-pl-muted uppercase tracking-wider pl-2")}>
        {isImpersonating ? <Eye className={tc("w-3 h-3 text-[#BFFF00]", "w-3 h-3 text-pl-accent-text")} /> : <ShieldAlert className="w-3 h-3" />}
        <span>View As:</span>
      </div>
      <Select value={viewRole} onValueChange={changeViewRole}>
        <SelectTrigger className={tc("w-[180px] h-8 bg-slate-950 border-slate-700 text-slate-200 text-xs focus:ring-[#BFFF00]/20", "w-[180px] h-8 text-xs")}>
          <SelectValue placeholder="Select Role" />
        </SelectTrigger>
        <SelectContent className={tc("bg-slate-900 border-slate-800 text-slate-200", undefined)}>
          {Object.values(ROLES).map((role) => (
            <SelectItem 
              key={role} 
              value={role}
              className={tc("text-xs hover:bg-slate-800 focus:bg-slate-800 cursor-pointer", "text-xs cursor-pointer")}
            >
              {ROLE_LABELS[role]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isImpersonating && (
        <Badge variant={tc("outline", "selected")} className={tc("text-[10px] h-5 border-[#BFFF00] text-[#BFFF00] bg-[#BFFF00]/10 ml-1", "text-[10px] h-5 ml-1")}>
          Preview Mode
        </Badge>
      )}
    </div>
  );
};

export default ViewAsSelector;