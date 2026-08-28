-- ============================================================================
-- RC4 GO LIVE (HELD): make Waterflood Management enrollable.
--
-- DO NOT APPLY until a NextGen production upload carries the
-- WaterfloodLearningPage route (/dashboard/apps/waterflood) and the deep-course
-- routes. Flipping status to 'available' is what puts the course on EnrollPage
-- and lets a learner pay for it, so applying this early sells a course whose
-- app page 404s.
--
-- RC1 dca, RC2 mbal and RC3 scal are held on the SAME gate. One production
-- upload releases all four, and each has its own go-live file asserting its own
-- preconditions; this file asserts only waterflood's.
--
-- Precondition checklist, all verifiable before running this file:
--   1. nextgen.petrolord.com serves a build containing /dashboard/apps/waterflood.
--   2. academy_course_structures has three active waterflood rows.
--   3. academy_quiz_questions holds 396 waterflood rows (132 per tier).
--   4. academy_capstones holds the three waterflood rows (inert while the
--      catalog row is coming_soon).
--
-- The module is already mapped to 'reservoir' on the catalog row, which the
-- Expert Suite-bridge trigger requires before any Expert certificate is
-- issued. That mapping is NOT part of this file; it landed with the course.
-- ============================================================================

do $$
declare
  v_structures integer;
  v_capstones  integer;
  v_questions  integer;
  v_graded     integer;
begin
  select count(*) into v_structures
    from public.academy_course_structures
   where app_slug = 'waterflood' and active;
  if v_structures <> 3 then
    raise exception 'RC4 go-live refused: waterflood has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions
    from public.academy_quiz_questions where app_slug = 'waterflood';
  if v_questions <> 396 then
    raise exception 'RC4 go-live refused: waterflood has % quiz questions, expected 396 (132 per tier)', v_questions;
  end if;

  select count(*) into v_capstones
    from public.academy_capstones where app_slug = 'waterflood';
  if v_capstones <> 3 then
    raise exception 'RC4 go-live refused: waterflood has % capstones, expected 3', v_capstones;
  end if;

  -- The Professional capstone field was replaced before seeding because the
  -- original graded a value the Associate tier's own answer satisfied. Assert
  -- the replacement is what is actually live, so that a stale course migration
  -- applied out of order cannot quietly sell the broken field.
  select count(*) into v_graded
    from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'waterflood'
     and c.tier = 'intermediate'
     and f->>'key' = 'chan_slope_e6';
  if v_graded <> 1 then
    raise exception 'RC4 go-live refused: the Professional capstone does not grade chan_slope_e6 (found % matching fields); a stale course migration may have been applied', v_graded;
  end if;

  if exists (
    select 1
      from public.academy_capstones c,
           lateral jsonb_array_elements(c.fields) f
     where c.app_slug = 'waterflood'
       and f->>'key' = 'tracked_vs_frozen_vrr'
  ) then
    raise exception 'RC4 go-live refused: the retired field tracked_vs_frozen_vrr is still graded somewhere on waterflood';
  end if;

  if not exists (
    select 1 from public.academy_apps
     where slug = 'waterflood' and module = 'reservoir'
  ) then
    raise exception 'RC4 go-live refused: waterflood catalog row is missing or not mapped to the reservoir module (the Expert bridge trigger needs it)';
  end if;
end
$$;

update public.academy_apps set status = 'available' where slug = 'waterflood';
