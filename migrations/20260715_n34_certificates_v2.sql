-- N3.4 — Certificates v2
-- (petrolord-suite docs/scope/NextGen-Academy-PLAN.md §3. Doctrine §1:
-- "Certificates carry verifiable IDs with a public verification page
-- from day one.")
--
-- N3.1 already shipped the verifiable-ID scheme:
--   * academy_certifications (certificate_number PLA-YYYY-######,
--     unguessable verify_code, issued_at, valid_until = +12 months
--     [Q1 locked], revoked_at) + the certification→entitlement trigger
--     + the revoke→expire trigger.
--   * academy_verify_certificate(verify_code) — anon-executable, the
--     backend for the public verification page.
--
-- What was missing and lands here: the ISSUANCE path (nothing could
-- create a certification row yet) and the RE-CERTIFICATION path. The
-- public verification page + learner/admin UIs are the frontend half.
--
-- Q2 (renewal mechanism — re-certification exam vs subscription) is an
-- open owner decision on PRICING SHAPE only; the spine stores validity
-- either way. Re-certification here = issuing a fresh 12-month cert that
-- supersedes the prior one; whether that is gated behind an exam (N4
-- capstone) or a subscription charge is decided above this layer.

-- --------------------------------------------------------- issuance

-- Issue (or re-issue) a certification. Caller must be an instructor/admin
-- (lecturer / admin / super_admin) OR the trusted server (service role —
-- auth.uid() is null; used by the N4 auto-grade-on-capstone path). Anon
-- and plain learners cannot self-certify.
--
-- Re-certification: any existing non-revoked, unexpired certification for
-- the same (user, app, tier) is superseded (revoked_at = now()), which
-- expires its entitlement via the N3.1 revoke trigger; the fresh insert
-- then grants a new entitlement window. One canonical current cert per
-- (user, app, tier).
create or replace function public.academy_issue_certification(
    p_user      uuid,
    p_app_slug  text,
    p_tier      text,
    p_course_id uuid default null,
    p_note      text default null)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_caller_role text;
  v_row         public.academy_certifications;
begin
  -- authorization: instructor/admin, or the trusted server (service role)
  if auth.uid() is not null then
    select role into v_caller_role from public.profiles where id = auth.uid();
    if v_caller_role is null
       or v_caller_role not in ('lecturer','admin','super_admin') then
      raise exception 'insufficient privileges to issue certifications';
    end if;
  end if;

  if p_tier not in ('associate','professional','expert') then
    raise exception 'tier must be associate, professional or expert';
  end if;
  if not exists (select 1 from auth.users where id = p_user) then
    raise exception 'unknown user';
  end if;

  -- supersede a live cert for the same (user, app, tier) → re-certification
  update public.academy_certifications
     set revoked_at = now()
   where user_id = p_user and app_slug = p_app_slug and tier = p_tier
     and revoked_at is null and now() < valid_until;

  insert into public.academy_certifications
      (user_id, course_id, app_slug, tier)
  values (p_user, p_course_id, p_app_slug, p_tier)
  returning * into v_row;

  return jsonb_build_object(
    'id', v_row.id,
    'certificate_number', v_row.certificate_number,
    'verify_code', v_row.verify_code,
    'app_slug', v_row.app_slug,
    'tier', v_row.tier,
    'issued_at', v_row.issued_at,
    'valid_until', v_row.valid_until,
    'note', p_note);
end $$;

-- Explicit revocation (instructor/admin). Idempotent.
create or replace function public.academy_revoke_certification(
    p_cert_id uuid,
    p_reason  text default null)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_caller_role text;
  v_row         public.academy_certifications;
begin
  select role into v_caller_role from public.profiles where id = auth.uid();
  if v_caller_role is null
     or v_caller_role not in ('lecturer','admin','super_admin') then
    raise exception 'insufficient privileges to revoke certifications';
  end if;

  update public.academy_certifications
     set revoked_at = coalesce(revoked_at, now())
   where id = p_cert_id
  returning * into v_row;

  if v_row.id is null then
    return jsonb_build_object('status','not_found');
  end if;
  return jsonb_build_object('status','revoked',
    'certificate_number', v_row.certificate_number,
    'revoked_at', v_row.revoked_at, 'reason', p_reason);
end $$;

-- ------------------------------------------------------------- grants

revoke all on function public.academy_issue_certification(uuid, text, text, uuid, text) from public, anon;
grant execute on function public.academy_issue_certification(uuid, text, text, uuid, text) to authenticated, service_role;

revoke all on function public.academy_revoke_certification(uuid, text) from public, anon;
grant execute on function public.academy_revoke_certification(uuid, text) to authenticated;

-- --------------------------------------------------------------- RLS

-- Learners already read their own certs (N3.1). Add an admin/instructor
-- read for the issuance console (verify page stays anon via the fn).
drop policy if exists "academy_certifications_select_admin" on public.academy_certifications;
create policy "academy_certifications_select_admin"
    on public.academy_certifications for select
    using (public.get_user_role() in ('lecturer','admin','super_admin'));
