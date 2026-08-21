-- ============================================================================
-- Reviewer-door prereq exemption (owner APPROVED 2026-08-21; follows the
-- reviewer door shipped in 20260821_reviewer_door.sql).
--
-- Problem: academy_grant_review_access writes ladder-honest reviewer
-- enrollments tagged payment_ref = 'reviewer-door', and the prereq +
-- ladder-progression checks in academy_enforce_prereq refuse any tier the
-- reviewer has not earned as a learner. Course content is fully reviewable
-- (full-scope entitlements) and capstone QUESTIONS are visible
-- (academy_get_capstone is ungated), but capstone SUBMISSION requires an
-- active enrollment at the exact (app, tier), so the owner could not
-- test-submit capstones on prereq-locked courses without walking the
-- ladder for real.
--
-- Fix: one narrow exemption inside academy_enforce_prereq - skip the
-- prereq and ladder checks ONLY when the incoming enrollment carries
-- payment_ref = 'reviewer-door' AND the enrollee is super_admin.
--
-- Why learner behavior is byte-identical:
--   * Clients have no INSERT on academy_enrollments (commercial-records
--     RLS: zero client write policies), so the tag cannot arrive from
--     outside. The only writer of that tag is
--     academy_grant_review_access, itself super_admin-only.
--   * The super_admin re-check on profiles here is belt and braces on top
--     of that.
--   * Every other insert path falls through to the NG6 logic UNCHANGED
--     (tier progression first, then the app prerequisite with the
--     same-app grandfather clauses).
--
-- After applying, re-run academy_grant_review_access() to pick up the
-- tiers previously skipped by the triggers ("re-run to refresh" is the
-- door's contract).
--
-- No table, policy, or trigger-wiring changes - function body only.
-- ============================================================================

create or replace function public.academy_enforce_prereq()
returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v_prereq text;
  v_name   text;
  v_need   text;
begin
  -- Reviewer-door exemption (owner-approved 2026-08-21): enrollments
  -- written by academy_grant_review_access carry payment_ref =
  -- 'reviewer-door'; clients cannot INSERT into academy_enrollments, so
  -- the tag is unforgeable from outside. Require super_admin on the
  -- enrollee as well, then skip prereq + ladder so the reviewer can
  -- grade-submit capstones on prereq-locked courses.
  if new.payment_ref = 'reviewer-door' and exists (
       select 1 from public.profiles
        where id = new.user_id and role = 'super_admin') then
    return new;
  end if;

  -- Tier progression FIRST (never bypassed by same-app grandfathering):
  -- intermediate needs Associate, advanced needs Professional — a
  -- non-revoked certification on the same app (expiry does not block,
  -- revocation does).
  v_need := case new.course_tier
              when 'intermediate' then 'associate'
              when 'advanced' then 'professional'
              else null end;
  if v_need is not null and not exists (
       select 1 from public.academy_certifications
        where user_id = new.user_id and app_slug = new.app_slug
          and tier = v_need and revoked_at is null) then
    raise exception 'ladder progression: a % certification on this course is required before enrolling in the % tier',
      v_need, new.course_tier;
  end if;

  -- App prerequisite (NG1: the well-registry root).
  select prereq_slug into v_prereq from public.academy_apps
   where slug = new.app_slug;
  if v_prereq is null then
    return new;
  end if;

  if exists (select 1 from public.academy_enrollments
              where user_id = new.user_id and app_slug = new.app_slug) then
    return new;
  end if;
  if exists (select 1 from public.academy_certifications
              where user_id = new.user_id and app_slug = new.app_slug
                and revoked_at is null and now() < valid_until) then
    return new;
  end if;

  if not exists (select 1 from public.academy_certifications
                  where user_id = new.user_id and app_slug = v_prereq
                    and revoked_at is null and now() < valid_until) then
    select name into v_name from public.academy_apps where slug = v_prereq;
    raise exception 'prerequisite not met: certify % (Associate) before enrolling in this course',
      coalesce(v_name, v_prereq);
  end if;
  return new;
end $$;
