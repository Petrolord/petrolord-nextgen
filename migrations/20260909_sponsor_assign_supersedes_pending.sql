-- Sponsor assignment supersedes a PENDING enrolment (2026-09-09).
--
-- Found during the Breeze Energy / pioneer onboarding: a learner who had
-- clicked Enrol on the self door (a 'pending' row waiting for a Paystack
-- checkout) could not then be given a seat by their training lead, because
-- academy_sponsor_assign refused ANY open enrolment for the course tier:
--   "<name> already has an open enrollment for petrophysics (beginner) via
--    the self door"
-- The only way out was for the learner to pay, which is the opposite of
-- what a sponsored seat is for. Two Breeze learners sat in exactly this
-- state on the live project.
--
-- Rule now: an ACTIVE enrolment still refuses (the seat would buy nothing).
-- A PENDING one is superseded inside the same transaction:
--   * its unpaid course-fee checkout rows go to status 'failed' with
--     paystack_status 'superseded' (a registration-fee payment is per
--     account, may cover other campus enrolments, and is left alone);
--   * the pending enrolment goes to 'cancelled' with payment_ref
--     'superseded:sponsor-pool:<pool id>' as the audit trail;
--   * the sponsored enrolment is inserted ACTIVE through the existing spine
--     exactly as before (entitlement trigger, prerequisite and tier
--     triggers, one-open-enrolment index all unchanged);
--   * the result carries 'superseded_door' so the console can say so.
-- Nothing else in the function changes; the body is the 20260908 version
-- with the open-enrolment block rewritten.

create or replace function public.academy_sponsor_assign(
    p_pool_id  uuid,
    p_email    text,
    p_app_slug text,
    p_tier     text default 'beginner',
    p_note     text default null)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_pool   public.academy_sponsor_pools;
  v_app    public.academy_apps;
  v_bonus  boolean;
  v_ladder boolean := false;
  v_user   uuid;
  v_name   text;
  v_open   public.academy_enrollments;
  v_enr    public.academy_enrollments;
  v_asg    public.academy_sponsor_assignments;
  v_free   boolean;
  v_superseded text := null;
begin
  if auth.uid() is null then
    raise exception 'authentication required';
  end if;
  select * into v_pool from public.academy_sponsor_pools where id = p_pool_id for update;
  if v_pool.id is null then
    raise exception 'unknown pool';
  end if;
  if not public.academy_sponsor_can_manage(v_pool.sponsor_id) then
    raise exception 'insufficient privileges';
  end if;
  if v_pool.status <> 'active' then
    raise exception 'this pool is closed';
  end if;
  if now() < v_pool.valid_from or now() >= v_pool.valid_until then
    raise exception 'this pool is outside its validity window';
  end if;
  if p_tier not in ('beginner', 'intermediate', 'advanced') then
    raise exception 'unknown course tier %', p_tier;
  end if;
  select * into v_app from public.academy_apps where slug = p_app_slug and status = 'available';
  if v_app.slug is null then
    raise exception 'course % is not open for enrollment', p_app_slug;
  end if;
  if array_length(v_pool.app_slugs, 1) is not null and not (p_app_slug = any (v_pool.app_slugs)) then
    raise exception 'this pool does not cover %', p_app_slug;
  end if;
  if array_length(v_pool.tiers, 1) is not null and not (p_tier = any (v_pool.tiers)) then
    raise exception 'this pool does not cover the % tier', p_tier;
  end if;

  select id, display_name into v_user, v_name from public.profiles
   where lower(email) = lower(trim(coalesce(p_email, '')))
   limit 1;
  if v_user is null then
    raise exception 'no NextGen account for %: ask them to register first', p_email;
  end if;

  -- Bonus tier (2026-09-08): never a seat.
  v_bonus := p_tier = any (coalesce(v_app.bonus_tiers, '{}'::text[]));
  -- Course-scope pool: the learner's later tiers of a course they already
  -- hold a live seat for in this pool ride on that seat.
  if not v_bonus and v_pool.seat_scope = 'course' then
    v_ladder := exists (select 1 from public.academy_sponsor_assignments a
                         where a.pool_id = v_pool.id and a.user_id = v_user
                           and a.app_slug = p_app_slug and a.status = 'active'
                           and a.seat_consumed);
  end if;
  v_free := v_bonus or v_ladder;
  if not v_free and v_pool.seats_used >= v_pool.seats then
    raise exception 'no seats left in this pool (% of % used)', v_pool.seats_used, v_pool.seats;
  end if;

  select * into v_open from public.academy_enrollments
   where user_id = v_user and app_slug = p_app_slug and course_tier = p_tier
     and status in ('pending', 'active')
   limit 1
   for update;
  if v_open.id is not null and v_open.status = 'active' then
    raise exception '% already has an active enrollment for % (%) via the % door', coalesce(v_name, p_email), p_app_slug, p_tier, v_open.door;
  end if;
  if v_open.id is not null then
    -- Pending (unpaid): the seat supersedes it. Close its unpaid checkout
    -- so "Complete payment" disappears and a late charge cannot land on a
    -- cancelled row; a registration fee is per account and stays.
    update public.academy_payments
       set status = 'failed', paystack_status = 'superseded', updated_at = now()
     where enrollment_id = v_open.id and status = 'pending'
       and purpose <> 'registration_fee';
    update public.academy_enrollments
       set status = 'cancelled',
           payment_ref = 'superseded:sponsor-pool:' || v_pool.id::text,
           updated_at = now()
     where id = v_open.id;
    v_superseded := v_open.door;
  end if;

  -- The sponsored enrolment. The prerequisite and tier-progression triggers
  -- stay fully in force; their messages surface to the lead unchanged.
  insert into public.academy_enrollments
      (user_id, app_slug, course_tier, door, code_id, pool_id, payment_ref, status)
  values (v_user, p_app_slug, p_tier, 'sponsored', null, v_pool.id,
          case when v_bonus then 'sponsor-pool-bonus:' when v_ladder then 'sponsor-pool-ladder:' else 'sponsor-pool:' end || v_pool.id::text,
          'active')
  returning * into v_enr;

  insert into public.academy_sponsor_assignments
      (pool_id, sponsor_id, user_id, app_slug, course_tier, enrollment_id, note, assigned_by, seat_consumed)
  values (v_pool.id, v_pool.sponsor_id, v_user, p_app_slug, p_tier, v_enr.id, p_note, auth.uid(), not v_free)
  returning * into v_asg;

  if not v_free then
    update public.academy_sponsor_pools
       set seats_used = seats_used + 1, updated_at = now()
     where id = v_pool.id;
  end if;

  return jsonb_build_object(
    'assignment_id', v_asg.id, 'enrollment_id', v_enr.id, 'user_id', v_user,
    'display_name', v_name, 'app_slug', p_app_slug, 'course_tier', p_tier,
    'seat_consumed', not v_free,
    'seat_reason', case when v_bonus then 'bonus_tier' when v_ladder then 'course_seat' else null end,
    'superseded_door', v_superseded,
    'seats_used', v_pool.seats_used + case when v_free then 0 else 1 end, 'seats', v_pool.seats);
end $$;

revoke all on function public.academy_sponsor_assign(uuid, text, text, text, text) from public, anon;
grant execute on function public.academy_sponsor_assign(uuid, text, text, text, text) to authenticated;
