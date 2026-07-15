import { supabase } from '@/lib/customSupabaseClient';

// N3.2 four-door enrollment service. All writes go through SECURITY
// DEFINER door functions or edge functions — the client never writes
// academy_* tables directly (commercial-records RLS).

export const TIERS = ['beginner', 'intermediate', 'advanced'];

export async function listAcademyApps() {
  const { data, error } = await supabase
    .from('academy_apps')
    .select('*')
    .order('path_order');
  if (error) throw error;
  return data;
}

export async function listFees() {
  const { data, error } = await supabase.from('academy_fees').select('*');
  if (error) throw error;
  return data;
}

export function feeFor(fees, appSlug, tier, kind = 'course') {
  const candidates = (fees || []).filter(
    (f) =>
      f.kind === kind &&
      f.active &&
      (f.app_slug === appSlug || f.app_slug === '*') &&
      (f.course_tier === tier || f.course_tier === '*'),
  );
  candidates.sort(
    (a, b) =>
      (b.app_slug === appSlug) - (a.app_slug === appSlug) ||
      (b.course_tier === tier) - (a.course_tier === tier),
  );
  return candidates[0] || null;
}

export function formatFee(fee) {
  if (!fee) return '—';
  const major = fee.amount_minor / 100;
  return `${fee.currency === 'NGN' ? '₦' : fee.currency + ' '}${major.toLocaleString()}`;
}

export async function listMyEnrollments() {
  const { data, error } = await supabase
    .from('academy_enrollments')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function listMyResidencyApplications() {
  const { data, error } = await supabase
    .from('academy_residency_applications')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function startSelfEnrollment(appSlug, tier) {
  const { data, error } = await supabase.rpc('academy_start_self_enrollment', {
    p_app_slug: appSlug,
    p_tier: tier,
  });
  if (error) throw error;
  return data;
}

export async function redeemCode(code, appSlug, tier, universityEmail = null) {
  const { data, error } = await supabase.rpc('academy_redeem_code', {
    p_code: code,
    p_app_slug: appSlug,
    p_tier: tier,
    p_university_email: universityEmail,
  });
  if (error) throw error;
  return data;
}

export async function applyResidency(appSlug, motivation) {
  const { data, error } = await supabase.rpc('academy_apply_residency', {
    p_app_slug: appSlug,
    p_motivation: motivation,
  });
  if (error) throw error;
  return data;
}

// Opens Paystack hosted checkout for a pending payment reference.
export async function startCheckout(reference) {
  const { data, error } = await supabase.functions.invoke('academy-checkout', {
    body: { reference },
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
}

// Idempotent server-side verification — safe to poll after returning
// from Paystack.
export async function verifyPayment(reference) {
  const { data, error } = await supabase.functions.invoke('academy-verify', {
    body: { reference },
  });
  if (error) throw error;
  return data;
}

// ---- admin (Petrolord admin / super_admin only; RLS + fn checks) ----

export async function adminListCodes() {
  const { data, error } = await supabase
    .from('academy_codes')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function adminIssueCode(opts) {
  const { data, error } = await supabase.rpc('academy_issue_code', {
    p_kind: opts.kind,
    p_organization: opts.organization,
    p_issuer: opts.issuer || null,
    p_app_slugs: opts.appSlugs || [],
    p_max_redemptions: opts.maxRedemptions ?? null,
    p_valid_until: opts.validUntil || null,
    p_code: opts.code || null,
  });
  if (error) throw error;
  return data;
}

export async function adminListResidencyApplications() {
  // No direct FK between residency applications and profiles (both hang
  // off auth.users), so PostgREST can't embed — join client-side.
  const { data, error } = await supabase
    .from('academy_residency_applications')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  const userIds = [...new Set((data || []).map((a) => a.user_id))];
  if (!userIds.length) return data;
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, display_name, email')
    .in('id', userIds);
  const byId = Object.fromEntries((profiles || []).map((p) => [p.id, p]));
  return data.map((a) => ({ ...a, applicant: byId[a.user_id] || null }));
}

export async function adminDecideResidency(applicationId, decision, note = null) {
  const { data, error } = await supabase.rpc('academy_decide_residency', {
    p_application: applicationId,
    p_decision: decision,
    p_note: note,
  });
  if (error) throw error;
  return data;
}
