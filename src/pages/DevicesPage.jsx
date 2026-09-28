import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, MonitorSmartphone, Shield, LogOut } from 'lucide-react';
import {
  listMyDevices, revokeDevice, listMySessions, getDeviceId,
} from '@/services/academyService';

const EVENT_LABEL = {
  register: 'New device registered',
  resume: 'Signed in',
  revoke: 'Device signed out',
  denied: 'Blocked (device limit)',
};

// Learner self-service: manage the two registered devices and review the
// session-monitoring feed for this account (N3.3).
// Design system (batch 2A): inside the signed-in scope, on theme roles.
const DevicesPage = () => {
  const { toast } = useToast();
  const [devices, setDevices] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const thisDevice = getDeviceId();

  const refresh = async () => {
    try {
      const [d, s] = await Promise.all([listMyDevices(), listMySessions()]);
      setDevices(d);
      setSessions(s);
    } catch (e) {
      toast({ title: 'Failed to load devices', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRevoke = async (deviceId) => {
    setBusy(true);
    try {
      await revokeDevice(deviceId);
      toast({ title: 'Device signed out' });
      await refresh();
    } catch (e) {
      toast({ title: 'Revoke failed', description: e.message, variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-pl-primary-text" />
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Devices & Sessions - Petrolord NextGen Academy</title></Helmet>
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto px-4 py-6 sm:p-6 space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-pl-text flex items-center gap-2">
            <MonitorSmartphone className="h-7 w-7 text-pl-primary-text" aria-hidden="true" /> Devices & sessions
          </h1>
          <p className="mt-1 text-pl-muted">
            Your account is limited to two registered devices. Sign out a device to free a slot.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-pl-text">Registered devices ({devices.length})</CardTitle>
            <CardDescription>Signing out a device frees it immediately.</CardDescription>
          </CardHeader>
          <CardContent>
            {devices.length === 0 ? (
              <p className="text-pl-muted text-sm">No registered devices.</p>
            ) : (
              <div className="space-y-2">
                {devices.map((d) => (
                  <div key={d.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-pl-border bg-pl-raised px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-pl-text font-medium flex items-center gap-2">
                        {d.label || 'Device'}
                        {d.device_id === thisDevice && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-pl-primary/10 text-pl-primary-text border border-pl-primary/40">this device</span>
                        )}
                      </p>
                      <p className="text-xs text-pl-muted truncate max-w-md">{d.user_agent || 'n/a'}</p>
                      <p className="text-xs text-pl-muted">last active {new Date(d.last_seen).toLocaleString()}</p>
                    </div>
                    <Button
                      size="sm" variant="outline" disabled={busy}
                      className="border-pl-danger/50 text-pl-danger-text hover:bg-pl-danger-bg hover:text-pl-danger-text"
                      onClick={() => handleRevoke(d.device_id)}
                    >
                      <LogOut className="h-4 w-4 mr-1" /> Sign out
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-pl-text flex items-center gap-2">
              <Shield className="h-5 w-5 text-pl-primary-text" aria-hidden="true" /> Recent session activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <p className="text-pl-muted text-sm">No activity yet.</p>
            ) : (
              <div className="space-y-1">
                {sessions.map((s) => (
                  <div key={s.id} className="flex items-center justify-between gap-3 text-sm border-b border-pl-border py-1.5">
                    <span className={s.event === 'denied' ? 'text-pl-danger-text font-medium' : 'text-pl-text'}>
                      {EVENT_LABEL[s.event] || s.event}
                    </span>
                    <span className="text-pl-muted text-xs">{new Date(s.created_at).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default DevicesPage;
