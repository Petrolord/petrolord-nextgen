-- ============================================================================
-- DR2 GO LIVE (HELD): make Torque, Drag & Casing Wear enrollable.
--
-- DO NOT APPLY until a NextGen production upload carries the
-- TorqueDragLearningPage route (/dashboard/apps/torquedrag) and the deep-course
-- routes. Flipping status to 'available' is what puts the course on EnrollPage
-- and lets a learner pay for it, so applying this early sells a course whose
-- app page 404s.
--
-- RC1 through RC7 and DR1 are held on the SAME gate. One production upload
-- releases all of them together with this course, and each has its own go-live
-- file asserting its own preconditions; this file asserts only torquedrag's.
--
-- Precondition checklist, all verifiable before running this file:
--   1. nextgen.petrolord.com serves a build containing /dashboard/apps/torquedrag.
--   2. academy_course_structures has three active torquedrag rows.
--   3. academy_quiz_questions holds 396 torquedrag rows (132 per tier).
--   4. academy_capstones holds the three torquedrag rows (inert while the
--      catalog row is coming_soon).
--
-- The module is already mapped to 'drilling' on the catalog row, which the
-- Expert Suite-bridge trigger requires before any Expert certificate is
-- issued. That mapping is NOT part of this file; it landed with the course.
-- ============================================================================

do $$
declare
  v_structures integer;
  v_capstones  integer;
  v_questions  integer;
  v_graded     integer;
  v_sin        numeric;
  v_hel        numeric;
begin
  select count(*) into v_structures
    from public.academy_course_structures
   where app_slug = 'torquedrag' and active;
  if v_structures <> 3 then
    raise exception 'DR2 go-live refused: torquedrag has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions
    from public.academy_quiz_questions where app_slug = 'torquedrag';
  if v_questions <> 396 then
    raise exception 'DR2 go-live refused: torquedrag has % quiz questions, expected 396 (132 per tier)', v_questions;
  end if;

  select count(*) into v_capstones
    from public.academy_capstones where app_slug = 'torquedrag';
  if v_capstones <> 3 then
    raise exception 'DR2 go-live refused: torquedrag has % capstones, expected 3', v_capstones;
  end if;

  -- THE SCOPE ASSERTION. engines/drilling implements a SOFT-STRING model. It
  -- has no stiff-string analysis, no dynamics, no hydraulic or thermal effects
  -- on the string, and no post-lock-up behaviour. Expert m05 l05 teaches all
  -- four and certifies none. Assert that no later edit has quietly graded one.
  select count(*) into v_graded
    from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'torquedrag'
     and (f->>'key' ilike '%stiff%'
       or f->>'key' ilike '%stick_slip%'
       or f->>'key' ilike '%stickslip%'
       or f->>'key' ilike '%whirl%'
       or f->>'key' ilike '%dynamic%'
       or f->>'key' ilike '%piston%'
       or f->>'key' ilike '%balloon%'
       or f->>'key' ilike '%thermal%'
       or f->>'key' ilike '%lockup%'
       or f->>'key' ilike '%lock_up%'
       or f->>'key' ilike '%reach_limit%');
  if v_graded <> 0 then
    raise exception 'DR2 go-live refused: % capstone field(s) grade a quantity this soft-string engine cannot produce; the course teaches those and certifies none of them', v_graded;
  end if;

  -- THE BUCKLING-RATIO ASSERTION. Both limits come from the same expression
  -- with a different constant in front, so the helical field MUST be
  -- 2*sqrt(2) - 1 times the sinusoidal one. If a later edit recomputes one of
  -- them at a different inclination, a different hole size or a different mud,
  -- and not the other, this catches it.
  select (f->>'expected')::numeric into v_sin
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'torquedrag' and f->>'key' = 'dp_sinusoidal_limit_90deg_N';
  select (f->>'expected')::numeric into v_hel
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'torquedrag' and f->>'key' = 'dp_helical_limit_90deg_N';
  if v_sin is null or v_hel is null then
    raise exception 'DR2 go-live refused: one or both buckling limit fields are missing';
  end if;
  if abs(v_hel / v_sin - (2 * sqrt(2::numeric) - 1)) > 0.000001 then
    raise exception 'DR2 go-live refused: the helical limit is % times the sinusoidal one, expected 2*sqrt(2)-1; the two fields are no longer the same case', v_hel / v_sin;
  end if;

  -- THE CAPSTONE-CONDITIONS ASSERTION. The capstone runs at 1500 kg/m3 mud and
  -- a two-entry rotating schedule, NOT the 1440 kg/m3 and single 50 h at
  -- 120 rpm the lessons teach on. If a later edit moves a graded field back
  -- onto the lessons' conditions, the tier-leakage sweep would fail and the
  -- capstone would become a copying exercise. Two witnesses: the buoyancy
  -- factor must be the 1500 value and not the 1440 one, and the sliding
  -- distance must be the two-entry schedule's and not 50 h at 120 rpm.
  if not exists (
    select 1 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug = 'torquedrag' and f->>'key' = 'buoyancy_factor_1500'
       and abs((f->>'expected')::numeric - 0.8089171974522293) < 0.0000001
  ) then
    raise exception 'DR2 go-live refused: the buoyancy field is missing or is not the 1500 kg/m3 value the capstone runs at';
  end if;
  if exists (
    select 1 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug = 'torquedrag' and f->>'key' = 'casing_sliding_distance_m'
       and abs((f->>'expected')::numeric - 190314.54136181608) < 0.5
  ) then
    raise exception 'DR2 go-live refused: the sliding distance field has been moved onto the lessons own 50 hour, 120 rpm schedule, which the lessons print';
  end if;

  -- TIER SEPARATION. The Associate tier grades hookloads, the Professional
  -- tier torque, side force and a fitted friction factor, and the Expert tier
  -- buckling, utilization and wear. Assert all three, so that a stale course
  -- migration applied out of order cannot grade a lower tier's work at a
  -- higher fee.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'torquedrag' and c.tier = 'beginner'
     and f->>'key' in ('vertical_hookload_N', 'slant_drag_swing_N', 'horizontal_slackoff_hookload_N');
  if v_graded <> 3 then
    raise exception 'DR2 go-live refused: the Associate capstone grades % of its 3 hookload fields', v_graded;
  end if;

  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'torquedrag' and c.tier = 'intermediate'
     and f->>'key' in ('buildhold_rot_torque_Nm', 'buildhold_max_side_force_Npm', 'buildhold_mu_for_1100kN_pickup');
  if v_graded <> 3 then
    raise exception 'DR2 go-live refused: the Professional capstone grades % of its 3 friction and torque fields', v_graded;
  end if;

  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'torquedrag' and c.tier = 'advanced'
     and f->>'key' in ('dp_sinusoidal_limit_90deg_N', 'hz_max_torsion_utilization', 'casing_worst_wall_loss_pct');
  if v_graded <> 3 then
    raise exception 'DR2 go-live refused: the Expert capstone grades % of its 3 buckling, capacity and wear fields', v_graded;
  end if;

  -- THE NEGATIVE-HOOKLOAD ASSERTION. The Associate capstone grades the
  -- horizontal well's slack-off hookload precisely because it is NEGATIVE:
  -- the string will not go in under its own weight, which is the one result in
  -- this tier that says the model has left its own domain. A sign dropped here
  -- gives a plausible small positive number.
  if not exists (
    select 1 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug = 'torquedrag' and c.tier = 'beginner'
       and f->>'key' = 'horizontal_slackoff_hookload_N'
       and (f->>'expected')::numeric < 0
  ) then
    raise exception 'DR2 go-live refused: the horizontal slack-off field is missing or is not graded as a negative value';
  end if;

  -- THE UNITS ASSERTION. Side force is per METRE of string and wear depth is
  -- in MILLIMETRES. Both are quantities whose plausible-looking wrong unit is
  -- a factor of a thousand away, which a tolerance cannot catch.
  if not exists (
    select 1 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug = 'torquedrag' and f->>'key' = 'buildhold_max_side_force_Npm' and f->>'unit' = 'N/m'
  ) then
    raise exception 'DR2 go-live refused: the side force field is missing or is not graded per metre';
  end if;
  if not exists (
    select 1 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug = 'torquedrag' and f->>'key' = 'casing_max_wear_depth_mm' and f->>'unit' = 'mm'
  ) then
    raise exception 'DR2 go-live refused: the wear depth field is missing or is not graded in millimetres';
  end if;

  if not exists (
    select 1 from public.academy_apps
     where slug = 'torquedrag' and module = 'drilling'
  ) then
    raise exception 'DR2 go-live refused: torquedrag catalog row is missing or not mapped to the drilling module (the Expert bridge trigger needs it)';
  end if;
end
$$;

update public.academy_apps set status = 'available' where slug = 'torquedrag';
