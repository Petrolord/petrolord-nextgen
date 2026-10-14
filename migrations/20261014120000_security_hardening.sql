-- ============================================================================
-- Security hardening, 2026-10-14 (owner + second engineer approved).
--
-- Closes the database half of the 2026-10-14 read-only audit:
--
--   H1  handle_new_user() honoured raw_user_meta_data->>'role' for
--       'student' and 'lecturer'. User metadata is client-supplied at
--       signup, so a caller could self-assign lecturer (which may issue
--       certifications). The role now comes only from raw_app_meta_data
--       (server-set via the admin API), otherwise the base identity
--       'learner'. Every other line of the function is unchanged.
--       (No live profile holds student or lecturer; no auth user carries
--       either in user metadata, checked 2026-10-14.)
--   H2  notifications "System can insert notifications" (INSERT, public,
--       with check true) let anon write a notification to any user. The
--       only client insert (NotificationService.createNotification) runs
--       as a signed-in user. Replaced with an authenticated policy: a user
--       may notify themselves; admin and super_admin may notify anyone.
--   M1  audit_logs "Allow service role to insert audit logs" and email_logs
--       "Allow service-role to insert logs" (INSERT, public, true) are
--       dropped: the service role bypasses RLS and never needed them. The
--       two audit_logs policies that only checked auth.role() =
--       'authenticated' are replaced by one that pins user_id = auth.uid().
--       audit_logs.user_id defaults to auth.uid() so the live client's
--       src/lib/auditLogger.js logAction (which omits user_id) keeps
--       writing rows for the signed-in user.
--   L1  academy_scope(uuid,text) and academy_quota(uuid,text) were
--       executable by PUBLIC/anon and returned any user's entitlements.
--       academy_scope is only called by other SECURITY DEFINER functions
--       (academy_has_scope, academy_quota), so client execute is revoked.
--       academy_quota is called by the client with its own id
--       (academyService.js), so it keeps authenticated execute and now
--       returns NULL unless p_user is the caller or the caller is admin
--       (service role and owner contexts, where auth.uid() is null, are
--       unaffected; anon can no longer execute it at all).
--       academy_is_activated(uuid) and academy_has_prereq_waiver(uuid,text)
--       are only called by SECURITY DEFINER functions: authenticated
--       execute revoked.
--   L2  academy_setting_text / academy_setting_int are only called by
--       SECURITY DEFINER functions (academy_doors_status,
--       academy_activation_status, academy_recompute_activation, ...):
--       client execute revoked.
--   L4  analytics_events "Insert events" (INSERT, public, true) replaced by
--       an authenticated policy with user_id = auth.uid() (matches
--       analyticsService.logEvent).
--   +   get_user_role() and is_super_admin() are SECURITY DEFINER without a
--       pinned search_path: pinned to public.
--
-- SECURITY DEFINER callers run as the owner (postgres), so the revokes do
-- not affect them. All calls verified against pg_proc bodies, pg_policies,
-- pg_views and the repo source on 2026-10-14.
--
-- Idempotent: drop policy if exists / create; create or replace; grants
-- and revokes are repeatable. No transaction control in this file.
--
-- ROLLBACK (run as one script; restores the 2026-10-14 pre-migration
-- state exactly). Also saved as migrations/docs/20261014120000_security_hardening_rollback.sql.
--
--   drop policy if exists notifications_insert_self_or_admin on public.notifications;
--   create policy "System can insert notifications" on public.notifications
--     for insert to public with check (true);
--   drop policy if exists audit_logs_insert_own on public.audit_logs;
--   create policy "Allow service role to insert audit logs" on public.audit_logs
--     for insert to public with check (true);
--   create policy "Allow authenticated insert audit logs" on public.audit_logs
--     for insert to public with check (auth.role() = 'authenticated'::text);
--   create policy "Authenticated users can insert audit logs" on public.audit_logs
--     for insert to public with check (auth.role() = 'authenticated'::text);
--   alter table public.audit_logs alter column user_id drop default;
--   create policy "Allow service-role to insert logs" on public.email_logs
--     for insert to public with check (true);
--   drop policy if exists analytics_events_insert_own on public.analytics_events;
--   create policy "Insert events" on public.analytics_events
--     for insert to public with check (true);
--   grant execute on function public.academy_scope(uuid, text) to public, anon, authenticated;
--   grant execute on function public.academy_quota(uuid, text) to public, anon, authenticated;
--   grant execute on function public.academy_is_activated(uuid) to authenticated;
--   grant execute on function public.academy_has_prereq_waiver(uuid, text) to authenticated;
--   grant execute on function public.academy_setting_text(text, text) to public, anon, authenticated;
--   grant execute on function public.academy_setting_int(text, integer) to public, anon, authenticated;
--   alter function public.get_user_role() reset search_path;
--   alter function public.is_super_admin() reset search_path;
--   -- academy_quota and handle_new_user: re-create the pre-migration
--   -- bodies (full text in the rollback file).
-- ============================================================================

-- H1 ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_role text;
  v_display_name text;
  v_phase integer;
begin
  v_role := new.raw_app_meta_data->>'role';               -- server-set only
  if v_role is null then
    v_role := 'learner';                                  -- base identity; user metadata never sets a role
  end if;

  v_display_name := coalesce(new.raw_user_meta_data->>'display_name',
                             split_part(new.email, '@', 1));
  begin
    v_phase := (new.raw_user_meta_data->>'phase')::integer;
  exception when others then
    v_phase := 1;
  end;
  v_phase := coalesce(v_phase, 1);

  insert into public.profiles
      (id, email, display_name, role, phase, created_at, status, updated_at)
  values
      (new.id, new.email, v_display_name, v_role, v_phase,
       coalesce(new.created_at, now()), 'active', now())
  on conflict (id) do update set
      email = excluded.email,
      role = v_role,
      status = 'active',
      updated_at = now();

  return new;
exception when others then
  raise warning 'Error in handle_new_user trigger: %', sqlerrm;
  return new;
end $function$;

-- H2 ---------------------------------------------------------------------------
drop policy if exists "System can insert notifications" on public.notifications;
drop policy if exists notifications_insert_self_or_admin on public.notifications;
create policy notifications_insert_self_or_admin on public.notifications
  for insert to authenticated
  with check (
    user_id = auth.uid()
    or public.get_user_role() in ('admin', 'super_admin')
  );

-- M1 ---------------------------------------------------------------------------
drop policy if exists "Allow service role to insert audit logs" on public.audit_logs;
drop policy if exists "Allow authenticated insert audit logs" on public.audit_logs;
drop policy if exists "Authenticated users can insert audit logs" on public.audit_logs;
drop policy if exists audit_logs_insert_own on public.audit_logs;
create policy audit_logs_insert_own on public.audit_logs
  for insert to authenticated
  with check (user_id = auth.uid());
alter table public.audit_logs alter column user_id set default auth.uid();

drop policy if exists "Allow service-role to insert logs" on public.email_logs;

-- L4 ---------------------------------------------------------------------------
drop policy if exists "Insert events" on public.analytics_events;
drop policy if exists analytics_events_insert_own on public.analytics_events;
create policy analytics_events_insert_own on public.analytics_events
  for insert to authenticated
  with check (user_id = auth.uid());

-- L1 ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.academy_quota(p_user uuid, p_app text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select q.quotas from public.academy_scope_quotas q
   where q.scope = public.academy_scope(p_user, p_app)
     and q.app_slug in (p_app, '*')
     and (auth.uid() is null              -- service role / owner context
          or p_user = auth.uid()
          or public.academy_is_admin())
   order by (q.app_slug = p_app) desc
   limit 1;
$function$;

revoke execute on function public.academy_scope(uuid, text) from public, anon, authenticated;
revoke execute on function public.academy_quota(uuid, text) from public, anon;
grant  execute on function public.academy_quota(uuid, text) to authenticated, service_role;
revoke execute on function public.academy_is_activated(uuid) from public, anon, authenticated;
revoke execute on function public.academy_has_prereq_waiver(uuid, text) from public, anon, authenticated;

-- L2 ---------------------------------------------------------------------------
revoke execute on function public.academy_setting_text(text, text) from public, anon, authenticated;
revoke execute on function public.academy_setting_int(text, integer) from public, anon, authenticated;

-- search_path pin --------------------------------------------------------------
alter function public.get_user_role() set search_path = public;
alter function public.is_super_admin() set search_path = public;
