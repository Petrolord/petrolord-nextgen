import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useRole } from '@/contexts/RoleContext';
import { getActivationStatus } from '@/services/academyService';

// N3.3 activation gate: reads the caller's academy_account_state via the
// definer RPC. Only learners are gated; admins/lecturers are exempt.
export function useActivation() {
  const { user } = useAuth();
  const { isViewAsStudent } = useRole();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user || !isViewAsStudent) {
      setStatus(null);
      setLoading(false);
      return;
    }
    try {
      const s = await getActivationStatus();
      setStatus(s);
    } catch (e) {
      console.error('activation status error', e);
    } finally {
      setLoading(false);
    }
  }, [user, isViewAsStudent]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    status,
    loading,
    refresh,
    // gated learners who haven't cleared the gate
    needsActivation: !!user && isViewAsStudent && !loading && status && !status.activated,
  };
}
