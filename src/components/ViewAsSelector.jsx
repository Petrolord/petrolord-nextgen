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

// Design system: theme roles. See docs/scope/DesignSystem-Rollout.md.

const ViewAsSelector = () => {
  const { viewRole, changeViewRole, canImpersonate, actualRole } = useRole();

  if (!canImpersonate) return null;

  const isImpersonating = viewRole !== actualRole;

  return (
    <div className="flex items-center gap-2 bg-pl-sunken p-2 rounded-lg border border-pl-border">
      <div className="flex items-center gap-2 text-xs font-medium text-pl-muted uppercase tracking-wider pl-2">
        {isImpersonating ? <Eye className="w-3 h-3 text-pl-accent-text" /> : <ShieldAlert className="w-3 h-3" />}
        <span>View As:</span>
      </div>
      <Select value={viewRole} onValueChange={changeViewRole}>
        <SelectTrigger className="w-[180px] h-8 text-xs">
          <SelectValue placeholder="Select Role" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(ROLES).map((role) => (
            <SelectItem 
              key={role} 
              value={role}
              className="text-xs cursor-pointer"
            >
              {ROLE_LABELS[role]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isImpersonating && (
        <Badge variant="selected" className="text-[10px] h-5 ml-1">
          Preview Mode
        </Badge>
      )}
    </div>
  );
};

export default ViewAsSelector;