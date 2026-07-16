-- Owner decisions — LOCKED 2026-07-16 (owner delegated: "make those
-- decisions within reasonable estimates and complete whatever is
-- pending on such decisions"). Closes the standing open items from
-- NextGen-Academy-PLAN §6 and the NG plan's notes.
--
-- THE LOCKS:
--   * Q2 (renewal): a certification renews by RE-CERTIFICATION — the
--     learner re-enrolls at the same (app, tier) at a RENEWAL fee of
--     50% of the published course fee, available once the current
--     certificate is inside its last 60 days or expired, and passes
--     the same capstone; the fresh certificate supersedes the old one
--     (new 12-month window from issue, per the N3.4 supersede
--     semantics). A live certificate more than 60 days from expiry
--     blocks redundant re-enrollment with a clear message.
--   * Q4 (entry-assessment failure policy): ADVISORY stands (the
--     N3.3 default) — the assessment places, it does not gate.
--     hard_gate machinery stays in place should the owner flip it.
--   * Q5 (Learning-Mode quotas): the N3.1 default matrix stands.
--   * Registration fee: LOCKED at the live NGN 10,000 (USD 7 display)
--     — no longer a placeholder.
--   * Curriculum prose: the shipped lesson sets (9-11 lessons per
--     original course, 6 per NG8-NG11 course, all engine-grounded)
--     are the v1 curriculum.
--   * Entry-assessment content: the 5 PLACEHOLDER questions are
--     replaced below by a 15-question bank spanning all ten courses
--     (answer keys server-side as always; advisory placement
--     unchanged: score >= 80 advanced, >= 50 intermediate, else
--     beginner — now 12/15 and 8/15 respectively).
--
-- Mechanics note on renewal supersede: revoking the old certificate
-- fires the N3.1 revoke trigger (entitlement expires) and, for Expert
-- certs, the NG7 bridge revoke trigger (unredeemed old discount code
-- voided); the fresh insert then grants a new 12-month entitlement
-- and, for Expert, auto-issues a fresh bridge code with the new
-- window. All by existing design; this migration adds no triggers.

-- ------------------------------------------------ 1. renewal fees (50%)

alter table public.academy_fees drop constraint if exists academy_fees_kind_check;
alter table public.academy_fees add constraint academy_fees_kind_check
  check (kind in ('course', 'registration', 'renewal'));

insert into public.academy_fees
    (app_slug, course_tier, kind, amount_minor, currency, active, school, amount_usd_minor)
select v.app_slug, v.course_tier, v.kind, v.amount_minor, v.currency, v.active, v.school, v.amount_usd_minor
from (values
  (null::text, 'beginner',     'renewal',  3000000, 'NGN', true, 'subsurface',      2000),
  (null::text, 'intermediate', 'renewal',  6000000, 'NGN', true, 'subsurface',      4000),
  (null::text, 'advanced',     'renewal', 10000000, 'NGN', true, 'subsurface',      6500),
  (null::text, 'beginner',     'renewal',  2000000, 'NGN', true, 'energy_business', 1350),
  (null::text, 'intermediate', 'renewal',  3750000, 'NGN', true, 'energy_business', 2500),
  (null::text, 'advanced',     'renewal',  6000000, 'NGN', true, 'energy_business', 4000)
) as v(app_slug, course_tier, kind, amount_minor, currency, active, school, amount_usd_minor)
where not exists (select 1 from public.academy_fees f
                   where f.kind = 'renewal' and f.school = v.school
                     and f.course_tier = v.course_tier and f.app_slug is null);

alter table public.academy_payments drop constraint if exists academy_payments_purpose_check;
alter table public.academy_payments add constraint academy_payments_purpose_check
  check (purpose in ('course_fee', 'registration_fee', 'renewal_fee'));

-- --------------------------------- 2. renewal-aware self-enrollment

create or replace function public.academy_start_self_enrollment(
    p_app_slug text,
    p_tier     text default 'beginner')
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_uid  uuid := auth.uid();
  v_fee  public.academy_fees;
  v_enr  public.academy_enrollments;
  v_ref  text;
  v_cert_tier text;
  v_cert public.academy_certifications;
  v_kind text := 'course';
begin
  if v_uid is null then
    raise exception 'authentication required';
  end if;
  if p_tier not in ('beginner', 'intermediate', 'advanced') then
    raise exception 'unknown course tier %', p_tier;
  end if;
  if not exists (select 1 from public.academy_apps
                  where slug = p_app_slug and status = 'available') then
    raise exception 'course % is not open for enrollment', p_app_slug;
  end if;

  -- Q2 (locked 2026-07-16): a live certification on this exact tier
  -- blocks redundant re-enrollment until its renewal window (last 60
  -- days) opens; inside the window or after expiry the enrollment is
  -- a RENEWAL at the 50% renewal fee (re-certification path).
  v_cert_tier := case p_tier when 'beginner' then 'associate'
                             when 'intermediate' then 'professional'
                             else 'expert' end;
  select * into v_cert from public.academy_certifications
   where user_id = v_uid and app_slug = p_app_slug and tier = v_cert_tier
     and revoked_at is null
   order by valid_until desc limit 1;
  if v_cert.id is not null then
    if now() < v_cert.valid_until - interval '60 days' then
      raise exception 'already certified % (%) until % — renewal opens 60 days before expiry',
        p_app_slug, v_cert_tier, v_cert.valid_until::date;
    end if;
    v_kind := 'renewal';
  end if;

  select * into v_enr from public.academy_enrollments
   where user_id = v_uid and app_slug = p_app_slug and course_tier = p_tier
     and status in ('pending', 'active')
   limit 1;

  if v_enr.id is not null and v_enr.status = 'active' then
    raise exception 'already enrolled in % (%)', p_app_slug, p_tier;
  end if;
  if v_enr.id is not null and v_enr.door <> 'self' then
    raise exception 'an enrollment via the % door is already pending for this course', v_enr.door;
  end if;

  if v_enr.id is null then
    insert into public.academy_enrollments (user_id, app_slug, course_tier, door, status)
    values (v_uid, p_app_slug, p_tier, 'self', 'pending')
    returning * into v_enr;
  end if;

  select reference into v_ref from public.academy_payments
   where enrollment_id = v_enr.id and status = 'pending'
   order by created_at desc limit 1;

  if v_ref is null then
    v_fee := public.academy_fee(p_app_slug, p_tier, v_kind);
    if v_fee.amount_minor is null then
      raise exception 'no published % fee for % (%)', v_kind, p_app_slug, p_tier;
    end if;
    v_ref := 'ACAD-' || replace(gen_random_uuid()::text, '-', '');
    insert into public.academy_payments
        (user_id, enrollment_id, purpose, reference, amount_minor, currency)
    values (v_uid, v_enr.id,
            case v_kind when 'renewal' then 'renewal_fee' else 'course_fee' end,
            v_ref, v_fee.amount_minor, v_fee.currency);
  end if;

  return (select jsonb_build_object(
            'enrollment_id', v_enr.id,
            'reference', p.reference,
            'amount_minor', p.amount_minor,
            'currency', p.currency,
            'fee_kind', v_kind,
            'status', 'pending_payment')
          from public.academy_payments p where p.reference = v_ref);
end $$;

-- --------------------------------- 3. renewal-aware capstone grading

create or replace function public.academy_submit_capstone(
    p_app     text,
    p_tier    text,
    p_answers jsonb)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_uid     uuid := auth.uid();
  v_cap     public.academy_capstones;
  v_field   jsonb;
  v_key     text;
  v_exp     numeric;
  v_tol     numeric;
  v_got     numeric;
  v_total   integer := 0;
  v_pass    integer := 0;
  v_missed  text[] := '{}';
  v_passed  boolean;
  v_cert    public.academy_certifications;
  v_prev    public.academy_certifications;
  v_renewed boolean := false;
begin
  if v_uid is null then raise exception 'authentication required'; end if;

  -- Learning Mode required (activated + enrolled → learning scope).
  if not public.academy_has_scope(p_app, 'learning') then
    raise exception 'enroll and activate Learning Mode before attempting the capstone';
  end if;

  -- NG6: the graded tier must be the tier the learner is enrolled in —
  -- an active enrollment at exactly (app, tier). Fee integrity: each
  -- tier is a separately priced course.
  if not exists (select 1 from public.academy_enrollments
                  where user_id = v_uid and app_slug = p_app
                    and course_tier = p_tier and status = 'active') then
    raise exception 'an active % enrollment in this course is required for this capstone', p_tier;
  end if;

  select * into v_cap from public.academy_capstones
   where app_slug = p_app and tier = p_tier and active;
  if v_cap.app_slug is null then
    raise exception 'no capstone for % (%)', p_app, p_tier;
  end if;

  for v_field in select * from jsonb_array_elements(v_cap.fields) loop
    v_total := v_total + 1;
    v_key := v_field->>'key';
    v_exp := (v_field->>'expected')::numeric;
    v_tol := (v_field->>'tol')::numeric;
    begin
      v_got := (p_answers->>v_key)::numeric;
    exception when others then
      v_got := null;
    end;
    if v_got is not null and abs(v_got - v_exp) <= v_tol then
      v_pass := v_pass + 1;
    else
      v_missed := array_append(v_missed, v_key);
    end if;
  end loop;

  v_passed := (v_pass = v_total);

  insert into public.academy_capstone_attempts
      (user_id, app_slug, tier, score, max_score, passed, answers)
  values (v_uid, p_app, p_tier, v_pass, v_total, v_passed, p_answers);

  if not v_passed then
    return jsonb_build_object('passed', false, 'score', v_pass,
      'max_score', v_total, 'missed', to_jsonb(v_missed));
  end if;

  -- Q2 (locked 2026-07-16): a live certificate MORE than 60 days from
  -- expiry short-circuits (already certified); a live certificate
  -- inside its renewal window is SUPERSEDED (revoke → the N3.1/NG7
  -- triggers expire its entitlement and void its unredeemed bridge
  -- code → fresh insert grants a new 12-month window and, for Expert,
  -- a fresh bridge code); an expired certificate simply re-issues.
  select * into v_prev from public.academy_certifications
   where user_id = v_uid and app_slug = p_app
     and tier = v_cap.cert_tier
     and revoked_at is null and now() < valid_until
   order by valid_until desc limit 1;

  if v_prev.id is not null then
    if now() < v_prev.valid_until - interval '60 days' then
      return jsonb_build_object('passed', true, 'score', v_pass,
        'max_score', v_total, 'already_certified', true);
    end if;
    update public.academy_certifications
       set revoked_at = now()
     where id = v_prev.id;
    v_renewed := true;
  end if;

  insert into public.academy_certifications
      (user_id, course_id, app_slug, tier)
  values (v_uid, public.academy_course_for_app(p_app), p_app, v_cap.cert_tier)
  returning * into v_cert;

  return jsonb_build_object('passed', true, 'score', v_pass,
    'max_score', v_total,
    'certificate_number', v_cert.certificate_number,
    'verify_code', v_cert.verify_code,
    'tier', v_cert.tier,
    'valid_until', v_cert.valid_until,
    'renewed', v_renewed);
end $$;

-- --------------------------------- 4. the real entry-assessment bank

delete from public.academy_assessment_questions;

insert into public.academy_assessment_questions (ord, prompt, options, answer_index) values
( 1, 'In a LAS well-log file, the NULL value declared in the header is used to:',
  '["Mark absent or invalid samples in the data section","Terminate the file","Set the depth datum","Flag the deepest sample"]'::jsonb, 0),
( 2, 'A LAS depth column recorded in feet is loaded into a metres-based system. Each depth must be:',
  '["Multiplied by 0.3048","Divided by 0.3048","Multiplied by 3.2808","Left unchanged"]'::jsonb, 0),
( 3, 'Which log pair is most directly used to estimate formation porosity?',
  '["Gamma ray and caliper","Density and neutron","Spontaneous potential and resistivity","Caliper and bit size"]'::jsonb, 1),
( 4, 'Archie''s equation computes:',
  '["Permeability","Water saturation","Net pay thickness","Bubble-point pressure"]'::jsonb, 1),
( 5, 'The gamma-ray index used for shale volume normalises the GR reading between:',
  '["The minimum and maximum of the whole well","The clean-sand and shale baselines","Zero and 150 API","The casing and open-hole sections"]'::jsonb, 1),
( 6, 'A formation top is:',
  '["A named depth pick of a geological surface in one well","The shallowest producible sand","The top of the casing string","A seismic amplitude anomaly"]'::jsonb, 0),
( 7, 'Flattening a correlation section on a marker displays the wells:',
  '["In true vertical depth","With that marker at a common datum, exposing relative thickness changes","Ordered by spud date","With all tops removed"]'::jsonb, 1),
( 8, 'To first order, a seismic trace is the earth''s reflectivity:',
  '["Added to the wavelet","Convolved with the wavelet","Divided by the wavelet","Squared"]'::jsonb, 1),
( 9, 'Acoustic impedance is:',
  '["Velocity divided by density","Velocity times density","Density divided by velocity","Porosity times velocity"]'::jsonb, 1),
(10, 'As a bed thins below the tuning thickness, its top and base reflections:',
  '["Disappear immediately","Merge, and the composite amplitude peaks near tuning","Separate further","Reverse polarity"]'::jsonb, 1),
(11, 'A structural contour map is built from:',
  '["Well control points (x, y, depth) interpolated onto a grid","Mud-log shows","Production rates","Casing designs"]'::jsonb, 0),
(12, 'In STOIIP = GRV x NTG x phi x (1 - Sw) / Bo, dividing by Bo converts:',
  '["Reservoir barrels to stock-tank barrels","Gas volume to oil volume","Gross volume to net volume","Pressure to volume"]'::jsonb, 0),
(13, 'Gassmann fluid substitution changes which elastic modulus of the rock?',
  '["Shear modulus","Bulk modulus","Young''s modulus only","None"]'::jsonb, 1),
(14, 'Overpressure means the pore pressure exceeds:',
  '["The overburden stress","The hydrostatic pressure at that depth","The fracture pressure","The mud pressure"]'::jsonb, 1),
(15, 'In a basin model, source-rock maturity is controlled by:',
  '["Peak temperature alone","The temperature history integrated over geological time","Present-day depth alone","The age of the rock alone"]'::jsonb, 1);

comment on table public.academy_assessment_questions is
    'Per-account entry-assessment bank (advisory placement, not a course quiz). answer_index is NEVER sent to the client — questions are read through academy_get_entry_assessment() and graded server-side. v1 bank (owner-delegated lock 2026-07-16): 15 questions spanning the ten geoscience courses; placement thresholds unchanged (>=80 advanced, >=50 intermediate).';
