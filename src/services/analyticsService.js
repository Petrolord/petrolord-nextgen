import { supabase } from '@/lib/customSupabaseClient';

// Admin analytics over the academy spine (academy_* tables + profiles).
// Reads rely on the admin SELECT policies on academy_enrollments,
// academy_certifications, academy_payments and academy_sessions.

const count = async (table, filter) => {
  let query = supabase.from(table).select('*', { count: 'exact', head: true });
  if (filter) query = filter(query);
  const { count: n, error } = await query;
  if (error) throw error;
  return n || 0;
};

const fetchDisplayNames = async (userIds) => {
  const unique = [...new Set(userIds)].filter(Boolean);
  if (unique.length === 0) return {};
  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name, email')
    .in('id', unique);
  if (error) throw error;
  return Object.fromEntries(data.map((p) => [p.id, p]));
};

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

export const analyticsService = {
  // --- Tracking ---

  async logEvent(eventType, eventData = {}) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from('analytics_events').insert({
        user_id: user.id,
        event_type: eventType,
        event_data: eventData,
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      });

      if (error) console.error('Error logging event:', error);
    } catch (err) {
      console.error('Analytics logging failed:', err);
    }
  },

  // --- Dashboard Data Fetching ---

  async getDashboardMetrics() {
    try {
      const [totalUsers, totalEnrollments, activeEnrollments, certificatesIssued, activeUsers] =
        await Promise.all([
          count('profiles'),
          count('academy_enrollments'),
          count('academy_enrollments', (q) => q.eq('status', 'active')),
          count('academy_certifications', (q) => q.is('revoked_at', null)),
          count('profiles', (q) => q.gte('last_login', daysAgo(30))),
        ]);

      return { totalUsers, totalEnrollments, activeEnrollments, certificatesIssued, activeUsers };
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      throw error;
    }
  },

  async getSystemMetrics() {
    try {
      const [userCount, learnerCount, activeUsers, enrollmentCount, certificateCount] =
        await Promise.all([
          count('profiles'),
          count('profiles', (q) => q.in('role', ['learner', 'student'])),
          count('profiles', (q) => q.gte('last_login', daysAgo(1))),
          count('academy_enrollments'),
          count('academy_certifications', (q) => q.is('revoked_at', null)),
        ]);

      return { userCount, learnerCount, activeUsers, enrollmentCount, certificateCount };
    } catch (error) {
      console.error('Error fetching system metrics:', error);
      return { userCount: 0, learnerCount: 0, activeUsers: 0, enrollmentCount: 0, certificateCount: 0 };
    }
  },

  async getChartsData() {
    // User growth: real monthly sign-up counts from profiles.created_at.
    const { data: profileRows, error: profilesError } = await supabase
      .from('profiles')
      .select('created_at');
    if (profilesError) throw profilesError;

    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        name: d.toLocaleString('en', { month: 'short' }),
        value: 0,
      });
    }
    const monthIndex = Object.fromEntries(months.map((m, i) => [m.key, i]));
    profileRows.forEach((p) => {
      const d = new Date(p.created_at);
      const idx = monthIndex[`${d.getFullYear()}-${d.getMonth()}`];
      if (idx !== undefined) months[idx].value += 1;
    });
    const userGrowth = months.map(({ name, value }) => ({ name, value }));

    // Enrollment breakdowns from the academy spine.
    const { data: enrollments, error: enrollError } = await supabase
      .from('academy_enrollments')
      .select('status, door');
    if (enrollError) throw enrollError;

    const byStatus = {};
    const byDoor = {};
    enrollments.forEach((e) => {
      byStatus[e.status] = (byStatus[e.status] || 0) + 1;
      byDoor[e.door] = (byDoor[e.door] || 0) + 1;
    });
    const label = (s) => s.replaceAll('_', ' ').replace(/^./, (c) => c.toUpperCase());
    const enrollmentStatus = Object.entries(byStatus).map(([name, value]) => ({ name: label(name), value }));
    const enrollmentsByDoor = Object.entries(byDoor).map(([name, value]) => ({ name: label(name), value }));

    // Daily activity: session events per day for the last 14 days.
    const { data: sessions, error: sessionsError } = await supabase
      .from('academy_sessions')
      .select('created_at')
      .gte('created_at', daysAgo(14));
    if (sessionsError) throw sessionsError;

    const days = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push({ key: d.toDateString(), name: d.toLocaleString('en', { weekday: 'short' }), value: 0 });
    }
    const dayIndex = Object.fromEntries(days.map((d, i) => [d.key, i]));
    sessions.forEach((s) => {
      const idx = dayIndex[new Date(s.created_at).toDateString()];
      if (idx !== undefined) days[idx].value += 1;
    });
    const activeUsersTrend = days.map(({ name, value }) => ({ name, value }));

    return { userGrowth, enrollmentStatus, enrollmentsByDoor, activeUsersTrend };
  },

  // --- Reports ---

  async getUserActivityReport(dateRange) {
    let query = supabase.from('academy_sessions').select('*');
    if (dateRange?.start) query = query.gte('created_at', dateRange.start.toISOString());
    if (dateRange?.end) query = query.lte('created_at', dateRange.end.toISOString());

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;

    const names = await fetchDisplayNames(data.map((s) => s.user_id));
    return data.map((s) => ({
      user: names[s.user_id]?.display_name || 'Unknown',
      email: names[s.user_id]?.email || 'N/A',
      event: s.event,
      device: s.device_id || 'N/A',
      at: new Date(s.created_at).toLocaleString(),
    }));
  },

  async getEnrollmentReport(dateRange) {
    let query = supabase.from('academy_enrollments').select('*');
    if (dateRange?.start) query = query.gte('created_at', dateRange.start.toISOString());
    if (dateRange?.end) query = query.lte('created_at', dateRange.end.toISOString());

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;

    const names = await fetchDisplayNames(data.map((e) => e.user_id));
    return data.map((e) => ({
      learner: names[e.user_id]?.display_name || 'Unknown',
      course: e.app_slug,
      tier: e.course_tier,
      door: e.door,
      status: e.status,
      enrolledAt: new Date(e.created_at).toLocaleDateString(),
    }));
  },

  async getCertificationReport(dateRange) {
    let query = supabase.from('academy_certifications').select('*');
    if (dateRange?.start) query = query.gte('issued_at', dateRange.start.toISOString());
    if (dateRange?.end) query = query.lte('issued_at', dateRange.end.toISOString());

    const { data, error } = await query.order('issued_at', { ascending: false });
    if (error) throw error;

    const names = await fetchDisplayNames(data.map((c) => c.user_id));
    return data.map((c) => ({
      learner: names[c.user_id]?.display_name || 'Unknown',
      course: c.app_slug,
      tier: c.tier,
      number: c.certificate_number,
      issued: new Date(c.issued_at).toLocaleDateString(),
      validUntil: c.valid_until ? new Date(c.valid_until).toLocaleDateString() : 'N/A',
      status: c.revoked_at ? 'Revoked' : 'Live',
    }));
  },

  async getPaymentReport(dateRange) {
    let query = supabase.from('academy_payments').select('*');
    if (dateRange?.start) query = query.gte('created_at', dateRange.start.toISOString());
    if (dateRange?.end) query = query.lte('created_at', dateRange.end.toISOString());

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;

    const names = await fetchDisplayNames(data.map((p) => p.user_id));
    return data.map((p) => ({
      payer: names[p.user_id]?.display_name || 'Unknown',
      reference: p.reference,
      purpose: p.purpose,
      amount: `${p.currency} ${(p.amount_minor / 100).toLocaleString()}`,
      status: p.status,
      paidAt: p.paid_at ? new Date(p.paid_at).toLocaleString() : 'N/A',
    }));
  },
};
