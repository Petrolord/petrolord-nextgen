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
        <Loader2 className="h-8 w-8 animate-spin text-[#BFFF00]" />
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Devices & Sessions - Petrolord NextGen Academy</title></Helmet>
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto p-6 space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <MonitorSmartphone className="h-7 w-7 text-[#BFFF00]" /> Devices & sessions
          </h1>
          <p className="mt-1 text-gray-400">
            Your account is limited to two registered devices. Sign out a device to free a slot.
          </p>
        </div>

        <Card className="bg-[#1E293B] border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Registered devices ({devices.length})</CardTitle>
            <CardDescription>Signing out a device frees it immediately.</CardDescription>
          </CardHeader>
          <CardContent>
            {devices.length === 0 ? (
              <p className="text-gray-500 text-sm">No registered devices.</p>
            ) : (
              <div className="space-y-2">
                {devices.map((d) => (
                  <div key={d.id} className="flex items-center justify-between rounded-md border border-gray-700 bg-[#0F172A] px-4 py-3">
                    <div>
                      <p className="text-white font-medium flex items-center gap-2">
                        {d.label || 'Device'}
                        {d.device_id === thisDevice && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#BFFF00]/20 text-[#BFFF00] border border-[#BFFF00]/40">this device</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 truncate max-w-md">{d.user_agent || '—'}</p>
                      <p className="text-xs text-gray-600">last active {new Date(d.last_seen).toLocaleString()}</p>
                    </div>
                    <Button
                      size="sm" variant="outline" disabled={busy}
                      className="border-red-700 text-red-400 hover:bg-red-900/30"
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

        <Card className="bg-[#1E293B] border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#BFFF00]" /> Recent session activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <p className="text-gray-500 text-sm">No activity yet.</p>
            ) : (
              <div className="space-y-1">
                {sessions.map((s) => (
                  <div key={s.id} className="flex items-center justify-between text-sm border-b border-gray-800 py-1.5">
                    <span className={s.event === 'denied' ? 'text-red-400' : 'text-gray-300'}>
                      {EVENT_LABEL[s.event] || s.event}
                    </span>
                    <span className="text-gray-500 text-xs">{new Date(s.created_at).toLocaleString()}</span>
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
