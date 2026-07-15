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

// ---- N3.3 activation gate + integrity controls ----

export async function getActivationStatus() {
  const { data, error } = await supabase.rpc('academy_activation_status');
  if (error) throw error;
  return data;
}

export async function completeOrientation() {
  const { data, error } = await supabase.rpc('academy_complete_orientation');
  if (error) throw error;
  return data;
}

export async function getEntryAssessment() {
  const { data, error } = await supabase.rpc('academy_get_entry_assessment');
  if (error) throw error;
  return data;
}

// answers: { [questionId]: selectedIndex }
export async function submitEntryAssessment(answers) {
  const { data, error } = await supabase.rpc('academy_submit_entry_assessment', {
    p_answers: answers,
  });
  if (error) throw error;
  return data;
}

export async function registerDevice(deviceId, label = null) {
  const { data, error } = await supabase.rpc('academy_register_device', {
    p_device_id: deviceId,
    p_user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    p_ip: null,
    p_label: label,
  });
  if (error) throw error;
  return data;
}

export async function revokeDevice(deviceId) {
  const { data, error } = await supabase.rpc('academy_revoke_device', {
    p_device_id: deviceId,
  });
  if (error) throw error;
  return data;
}

export async function listMyDevices() {
  const { data, error } = await supabase
    .from('academy_devices')
    .select('*')
    .is('revoked_at', null)
    .order('last_seen', { ascending: false });
  if (error) throw error;
  return data;
}

export async function listMySessions(limit = 25) {
  const { data, error } = await supabase
    .from('academy_sessions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

// ---- N4 Learning Mode + capstone ----

// Effective scope + quota on an app (RLS-real; gates Learning Mode).
export async function hasScope(appSlug, minScope = 'learning') {
  const { data, error } = await supabase.rpc('academy_has_scope', {
    p_app: appSlug,
    p_min: minScope,
  });
  if (error) throw error;
  return !!data;
}

export async function getQuota(appSlug) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase.rpc('academy_quota', {
    p_user: user.id,
    p_app: appSlug,
  });
  if (error) throw error;
  return data;
}

export async function getCapstone(appSlug, tier) {
  const { data, error } = await supabase.rpc('academy_get_capstone', {
    p_app: appSlug,
    p_tier: tier,
  });
  if (error) throw error;
  return data;
}

export async function submitCapstone(appSlug, tier, answers) {
  const { data, error } = await supabase.rpc('academy_submit_capstone', {
    p_app: appSlug,
    p_tier: tier,
    p_answers: answers,
  });
  if (error) throw error;
  return data;
}

// ---- N3.4 certificates v2 ----

// Public, no-auth certificate verification (anon-executable definer fn).
export async function verifyCertificate(verifyCode) {
  const { data, error } = await supabase.rpc('academy_verify_certificate', {
    p_verify_code: verifyCode,
  });
  if (error) throw error;
  return data; // null when not found
}

export async function listMyCertifications() {
  const { data, error } = await supabase
    .from('academy_certifications')
    .select('*')
    .order('issued_at', { ascending: false });
  if (error) throw error;
  return data;
}

export function certificateStatus(cert) {
  if (cert.revoked_at) return 'revoked';
  if (new Date(cert.valid_until) <= new Date()) return 'expired';
  return 'valid';
}

export function verificationUrl(verifyCode) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}/verify/${verifyCode}`;
}

// admin/instructor issuance
export async function issueCertification({ userId, appSlug, tier, courseId = null, note = null }) {
  const { data, error } = await supabase.rpc('academy_issue_certification', {
    p_user: userId,
    p_app_slug: appSlug,
    p_tier: tier,
    p_course_id: courseId,
    p_note: note,
  });
  if (error) throw error;
  return data;
}

export async function revokeCertification(certId, reason = null) {
  const { data, error } = await supabase.rpc('academy_revoke_certification', {
    p_cert_id: certId,
    p_reason: reason,
  });
  if (error) throw error;
  return data;
}

export async function adminListCertifications(limit = 100) {
  const { data, error } = await supabase
    .from('academy_certifications')
    .select('*')
    .order('issued_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  const userIds = [...new Set((data || []).map((c) => c.user_id))];
  if (!userIds.length) return data;
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, display_name, email')
    .in('id', userIds);
  const byId = Object.fromEntries((profiles || []).map((p) => [p.id, p]));
  return data.map((c) => ({ ...c, holder: byId[c.user_id] || null }));
}

// look up a learner by email for issuance (admins can read profiles)
export async function findProfileByEmail(email) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name, email, role')
    .ilike('email', email.trim())
    .maybeSingle();
  if (error) throw error;
  return data;
}

// admin session-monitoring feed (admins read all via RLS)
export async function adminListSessions(limit = 100) {
  const { data, error } = await supabase
    .from('academy_sessions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  const userIds = [...new Set((data || []).map((s) => s.user_id))];
  if (!userIds.length) return data;
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, display_name, email')
    .in('id', userIds);
  const byId = Object.fromEntries((profiles || []).map((p) => [p.id, p]));
  return data.map((s) => ({ ...s, actor: byId[s.user_id] || null }));
}

// Stable per-browser device id (opaque; not PII).
export function getDeviceId() {
  const KEY = 'petrolord_academy_device_id';
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    // storage blocked — fall back to an ephemeral id (limit still applies server-side)
    return 'ephemeral-' + Math.random().toString(36).slice(2);
  }
}
