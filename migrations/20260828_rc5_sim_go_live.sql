-- ============================================================================
-- RC5 GO LIVE (HELD): make Reservoir Simulation Essentials enrollable.
--
-- DO NOT APPLY until a NextGen production upload carries the SimLearningPage
-- route (/dashboard/apps/sim) and the deep-course routes. Flipping status to
-- 'available' is what puts the course on EnrollPage and lets a learner pay for
-- it, so applying this early sells a course whose app page 404s.
--
-- RC1 dca, RC2 mbal, RC3 scal and RC4 waterflood are held on the SAME gate.
-- One production upload releases all five, and each has its own go-live file
-- asserting its own preconditions; this file asserts only sim's.
--
-- Precondition checklist, all verifiable before running this file:
--   1. nextgen.petrolord.com serves a build containing /dashboard/apps/sim.
--   2. academy_course_structures has three active sim rows.
--   3. academy_quiz_questions holds 396 sim rows (132 per tier).
--   4. academy_capstones holds the three sim rows (inert while the catalog row
--      is coming_soon).
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
   where app_slug = 'sim' and active;
  if v_structures <> 3 then
    raise exception 'RC5 go-live refused: sim has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions
    from public.academy_quiz_questions where app_slug = 'sim';
  if v_questions <> 396 then
    raise exception 'RC5 go-live refused: sim has % quiz questions, expected 396 (132 per tier)', v_questions;
  end if;

  select count(*) into v_capstones
    from public.academy_capstones where app_slug = 'sim';
  if v_capstones <> 3 then
    raise exception 'RC5 go-live refused: sim has % capstones, expected 3', v_capstones;
  end if;

  -- Two capstone fields were replaced before seeding because each graded a
  -- quantity a DIFFERENT tier owns. Assert the replacements are what is
  -- actually live, so that a stale course migration applied out of order
  -- cannot quietly sell a field that cannot distinguish anything.
  select count(*) into v_graded
    from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'sim'
     and c.tier = 'intermediate'
     and f->>'key' = 'correlated_bo_at_pi';
  if v_graded <> 1 then
    raise exception 'RC5 go-live refused: the Professional capstone does not grade correlated_bo_at_pi (found % matching fields); a stale course migration may have been applied', v_graded;
  end if;

  select count(*) into v_graded
    from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'sim'
     and c.tier = 'advanced'
     and f->>'key' = 'calibration_regional_mean_m';
  if v_graded <> 1 then
    raise exception 'RC5 go-live refused: the Expert capstone does not grade calibration_regional_mean_m (found % matching fields); a stale course migration may have been applied', v_graded;
  end if;

  if exists (
    select 1
      from public.academy_capstones c,
           lateral jsonb_array_elements(c.fields) f
     where c.app_slug = 'sim'
       and f->>'key' in ('bo_at_pb', 'deck_stoiip_tapered_stb')
  ) then
    raise exception 'RC5 go-live refused: a retired field (bo_at_pb or deck_stoiip_tapered_stb) is still graded somewhere on sim';
  end if;

  if not exists (
    select 1 from public.academy_apps
     where slug = 'sim' and module = 'reservoir'
  ) then
    raise exception 'RC5 go-live refused: sim catalog row is missing or not mapped to the reservoir module (the Expert bridge trigger needs it)';
  end if;
end
$$;

update public.academy_apps set status = 'available' where slug = 'sim';
