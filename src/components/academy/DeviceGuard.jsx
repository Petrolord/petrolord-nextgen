import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useRole } from '@/contexts/RoleContext';
import { getDeviceId, registerDevice, revokeDevice } from '@/services/academyService';
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Loader2, MonitorSmartphone } from 'lucide-react';
import { useActiveTheme } from '@/design/activeTheme';
import { themeClassPicker } from '@/design/themeClass';
import { FixedTheme } from '@/design/ThemeProvider';

// Registers this browser as a device on login (two-device limit, N3.3).
// If the limit is reached, prompts the learner to revoke one of their
// other devices. Only learners are registered.
//
// Design system (docs/scope/DesignSystem-Rollout.md, batch 1A): the guard is
// mounted at the app root, outside every scope. Like the toaster its dialog
// follows the theme of the screen on show (useActiveTheme), on theme roles;
// with no themed screen mounted it renders exactly what it rendered before.
const DeviceGuard = ({ children }) => {
  const { user } = useAuth();
  const { isViewAsStudent } = useRole();
  const [limitInfo, setLimitInfo] = useState(null);
  const [busy, setBusy] = useState(false);
  const attempted = useRef(false);
  const active = useActiveTheme();
  const tc = themeClassPicker(active ? { theme: active } : null);

  const attempt = async () => {
    try {
      const res = await registerDevice(getDeviceId());
      if (res?.status === 'limit_reached') setLimitInfo(res);
      else setLimitInfo(null);
    } catch (e) {
      console.error('device register error', e);
    }
  };

  useEffect(() => {
    if (!user || !isViewAsStudent || attempted.current) return;
    attempted.current = true;
    attempt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isViewAsStudent]);

  const handleRevoke = async (deviceId) => {
    setBusy(true);
    try {
      await revokeDevice(deviceId);
      await attempt();
    } finally {
      setBusy(false);
    }
  };

  const dialog = (
      <AlertDialog open={!!limitInfo}>
        <AlertDialogContent className={tc("bg-[#1E293B] border-gray-700", undefined)}>
          <AlertDialogHeader>
            <AlertDialogTitle className={tc("text-white flex items-center gap-2", "text-pl-text flex items-center gap-2")}>
              <MonitorSmartphone className={tc("h-5 w-5 text-[#BFFF00]", "h-5 w-5 text-pl-accent-text")} aria-hidden={tc(undefined, 'true')} /> Device limit reached
            </AlertDialogTitle>
            <AlertDialogDescription className={tc("text-gray-400", "text-pl-muted")}>
              Your account is limited to {limitInfo?.limit} devices. Sign out one of these to use this device.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            {(limitInfo?.devices || []).map((d) => (
              <div key={d.device_id} className={tc("flex items-center justify-between rounded-md border border-gray-700 bg-[#0F172A] px-3 py-2", "flex items-center justify-between rounded-md border border-pl-border bg-pl-surface px-3 py-2")}>
                <div className="text-sm">
                  <p className={tc("text-white", "text-pl-text")}>{d.label || 'Device'}</p>
                  <p className={tc("text-gray-500 text-xs", "text-pl-muted text-xs")}>last active {new Date(d.last_seen).toLocaleString()}</p>
                </div>
                <Button
                  size="sm" variant="outline" disabled={busy}
                  className={tc("border-red-700 text-red-400 hover:bg-red-900/30", "border-pl-danger/60 text-pl-danger-text hover:bg-pl-danger-bg hover:text-pl-danger-text")}
                  onClick={() => handleRevoke(d.device_id)}
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign out'}
                </Button>
              </div>
            ))}
          </div>
          <AlertDialogFooter>
            <p className={tc("text-xs text-gray-500", "text-xs text-pl-muted")}>
              Until you free a slot, this device stays in read-only Learning previews.
            </p>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
  );

  return (
    <>
      {children}
      {active ? <FixedTheme theme={active}>{dialog}</FixedTheme> : dialog}
    </>
  );
};

export default DeviceGuard;
