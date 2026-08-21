-- ============================================================================
-- Reviewer door (owner decision 2026-08-21): super_admin self-service
-- review access to the whole live catalog, so the owner can review every
-- course and app as they are developed without walking the paid funnel.
--
-- Design (doctrine-conformant, RLS-only):
--   * No client-side bypass and no change to learner-facing gates. Review
--     access is REAL ROWS in the real tables, written by one definer
--     function, auditable and revocable.
--   * Entitlements ride the ladder's existing instructor_override lane:
--     time-boxed (valid_until = now() + p_days) and carrying the note
--     'reviewer door', exactly as the entitlements table comment demands.
--     Scope 'full' so quota-gated behavior is reviewable too.
--   * Enrollments (needed by academy_submit_capstone since NG6 requires an
--     ACTIVE enrollment at the exact app/tier) are attempted per tier and
--     tagged payment_ref = 'reviewer-door'. The prereq and ladder
--     progression triggers stay FULLY in force: a tier the reviewer has
--     not earned the way a learner would is skipped and reported, not
--     forced. Re-running the function after earning a certification picks
--     up the newly unlockable tiers - and after new courses ship, the new
--     apps. "Re-run to refresh" is the contract.
--   * Activation is completed administratively for the caller (orientation
--     + entry-assessment timestamps); the entry-assessment policy stays
--     advisory per the locked owner decisions.
--   * super_admin only. Admins/instructors keep their existing issuance
--     tools; this door is for the owner reviewing the product.
-- ============================================================================

create or replace function public.academy_grant_review_access(p_days integer default 90)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_uid  uuid := auth.uid();
  v_role text;
  v_app  record;
  v_tier text;
  v_apps int := 0;
  v_enr  int := 0;
  v_skip jsonb := '[]'::jsonb;
begin
  if v_uid is null then
    raise exception 'authentication required';
  end if;
  select role into v_role from public.profiles where id = v_uid;
  if v_role is distinct from 'super_admin' then
    raise exception 'insufficient privileges';
  end if;
  if p_days is null or p_days < 1 or p_days > 365 then
    raise exception 'p_days must be between 1 and 365';
  end if;

  -- Activation, completed administratively for the reviewer.
  perform public.academy_ensure_account_state();
  update public.academy_account_state
     set orientation_completed_at = coalesce(orientation_completed_at, now()),
         entry_assessment_at      = coalesce(entry_assessment_at, now()),
         updated_at               = now()
   where user_id = v_uid;
  perform public.academy_recompute_activation(v_uid);

  for v_app in
    select slug from public.academy_apps where status = 'available' order by slug
  loop
    v_apps := v_apps + 1;

    -- Full-scope review entitlement: extend the active reviewer-door row
    -- if one exists, otherwise insert a fresh time-boxed one.
    update public.academy_entitlements
       set valid_until = now() + make_interval(days => p_days)
     where user_id = v_uid and app_slug = v_app.slug
       and granted_by = 'instructor_override' and note = 'reviewer door'
       and (valid_until is null or valid_until > now());
    if not found then
      insert into public.academy_entitlements
          (user_id, app_slug, scope, granted_by, valid_until, note, created_by)
      values (v_uid, v_app.slug, 'full', 'instructor_override',
              now() + make_interval(days => p_days), 'reviewer door', v_uid);
    end if;

    -- Capstone-grading enrollments, ladder-honest: the integrity triggers
    -- (prereq + tier progression) decide; refusals are reported, not forced.
    foreach v_tier in array array['beginner', 'intermediate', 'advanced'] loop
      if exists (select 1 from public.academy_enrollments
                  where user_id = v_uid and app_slug = v_app.slug
                    and course_tier = v_tier and status = 'active') then
        continue;
      end if;
      begin
        insert into public.academy_enrollments
            (user_id, app_slug, course_tier, door, status, payment_ref)
        values (v_uid, v_app.slug, v_tier, 'sponsored', 'active', 'reviewer-door');
        v_enr := v_enr + 1;
      exception when others then
        v_skip := v_skip || jsonb_build_object(
          'app', v_app.slug, 'tier', v_tier, 'reason', sqlerrm);
      end;
    end loop;
  end loop;

  return jsonb_build_object(
    'activated', public.academy_is_activated(v_uid),
    'apps_covered', v_apps,
    'enrollments_created', v_enr,
    'valid_days', p_days,
    'skipped', v_skip);
end $$;

comment on function public.academy_grant_review_access(integer) is
  'Reviewer door: super_admin self-grants time-boxed full-scope review entitlements on every available course plus ladder-honest reviewer enrollments. Re-run to refresh after new courses ship or certifications unlock tiers.';

-- Undo: expire the reviewer-door entitlements and cancel the reviewer
-- enrollments (the enrollment status trigger expires their learning
-- entitlements). Certifications the reviewer earned stand - they were
-- earned through the real graded path.
create or replace function public.academy_revoke_review_access()
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_uid  uuid := auth.uid();
  v_role text;
  v_ents int;
  v_enrs int;
begin
  if v_uid is null then
    raise exception 'authentication required';
  end if;
  select role into v_role from public.profiles where id = v_uid;
  if v_role is distinct from 'super_admin' then
    raise exception 'insufficient privileges';
  end if;

  update public.academy_entitlements
     set valid_until = now()
   where user_id = v_uid
     and granted_by = 'instructor_override' and note = 'reviewer door'
     and (valid_until is null or valid_until > now());
  get diagnostics v_ents = row_count;

  update public.academy_enrollments
     set status = 'cancelled', updated_at = now()
   where user_id = v_uid and payment_ref = 'reviewer-door' and status = 'active';
  get diagnostics v_enrs = row_count;

  return jsonb_build_object('entitlements_expired', v_ents,
                            'enrollments_cancelled', v_enrs);
end $$;

comment on function public.academy_revoke_review_access() is
  'Expires the caller''s reviewer-door entitlements and cancels reviewer enrollments. Earned certifications stand.';

revoke all on function public.academy_grant_review_access(integer) from public, anon;
grant execute on function public.academy_grant_review_access(integer) to authenticated;
revoke all on function public.academy_revoke_review_access() from public, anon;
grant execute on function public.academy_revoke_review_access() to authenticated;
