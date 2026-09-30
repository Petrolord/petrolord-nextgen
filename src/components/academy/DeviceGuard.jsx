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
import { FixedTheme } from '@/design/ThemeProvider';

// Registers this browser as a device on login (two-device limit, N3.3).
// If the limit is reached, prompts the learner to revoke one of their
// other devices. Only learners are registered.
//
// Design system (docs/scope/DesignSystem-Rollout.md, batch 1A): the guard is
// mounted at the app root, outside every scope. Like the toaster its dialog
// follows the theme of the screen on show (useActiveTheme), on theme roles;
// with no themed screen mounted (the homepage) it is light.
const DeviceGuard = ({ children }) => {
  const { user } = useAuth();
  const { isViewAsStudent } = useRole();
  const [limitInfo, setLimitInfo] = useState(null);
  const [busy, setBusy] = useState(false);
  const attempted = useRef(false);
  const active = useActiveTheme();

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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-pl-text flex items-center gap-2">
              <MonitorSmartphone className="h-5 w-5 text-pl-accent-text" aria-hidden="true" /> Device limit reached
            </AlertDialogTitle>
            <AlertDialogDescription className="text-pl-muted">
              Your account is limited to {limitInfo?.limit} devices. Sign out one of these to use this device.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            {(limitInfo?.devices || []).map((d) => (
              <div key={d.device_id} className="flex items-center justify-between rounded-md border border-pl-border bg-pl-surface px-3 py-2">
                <div className="text-sm">
                  <p className="text-pl-text">{d.label || 'Device'}</p>
                  <p className="text-pl-muted text-xs">last active {new Date(d.last_seen).toLocaleString()}</p>
                </div>
                <Button
                  size="sm" variant="outline" disabled={busy}
                  className="border-pl-danger/60 text-pl-danger-text hover:bg-pl-danger-bg hover:text-pl-danger-text"
                  onClick={() => handleRevoke(d.device_id)}
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign out'}
                </Button>
              </div>
            ))}
          </div>
          <AlertDialogFooter>
            <p className="text-xs text-pl-muted">
              Until you free a slot, this device stays in read-only Learning previews.
            </p>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
  );

  return (
    <>
      {children}
      <FixedTheme theme={active || 'light'}>{dialog}</FixedTheme>
    </>
  );
};

export default DeviceGuard;
