// Is the signed-in learner a training lead for any sponsor (2026-09-07)?
// Drives the Sponsor console entry in the sidebar. Reads through the
// definer function so RLS decides; false until the answer arrives.
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { mySponsorPools } from '@/services/academyService';

export default function useIsSponsorLead() {
  const { user } = useAuth();
  const [lead, setLead] = useState(false);
  useEffect(() => {
    let alive = true;
    if (!user) { setLead(false); return undefined; }
    mySponsorPools().then((groups) => { if (alive) setLead(Array.isArray(groups) && groups.length > 0); }).catch(() => { if (alive) setLead(false); });
    return () => { alive = false; };
  }, [user]);
  return lead;
}
