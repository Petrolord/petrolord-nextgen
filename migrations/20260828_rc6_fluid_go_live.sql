-- ============================================================================
-- RC6 GO LIVE (HELD): make Fluid Properties & PVT enrollable.
--
-- DO NOT APPLY until a NextGen production upload carries the
-- FluidLearningPage route (/dashboard/apps/fluid) and the deep-course routes.
-- Flipping status to 'available' is what puts the course on EnrollPage and
-- lets a learner pay for it, so applying this early sells a course whose app
-- page 404s.
--
-- RC1 dca, RC2 mbal, RC3 scal, RC4 waterflood and RC5 sim are held on the
-- SAME gate. One production upload releases all six, and each has its own
-- go-live file asserting its own preconditions; this file asserts only
-- fluid's.
--
-- Precondition checklist, all verifiable before running this file:
--   1. nextgen.petrolord.com serves a build containing /dashboard/apps/fluid.
--   2. academy_course_structures has three active fluid rows.
--   3. academy_quiz_questions holds 396 fluid rows (132 per tier).
--   4. academy_capstones holds the three fluid rows (inert while the catalog
--      row is coming_soon).
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
   where app_slug = 'fluid' and active;
  if v_structures <> 3 then
    raise exception 'RC6 go-live refused: fluid has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions
    from public.academy_quiz_questions where app_slug = 'fluid';
  if v_questions <> 396 then
    raise exception 'RC6 go-live refused: fluid has % quiz questions, expected 396 (132 per tier)', v_questions;
  end if;

  select count(*) into v_capstones
    from public.academy_capstones where app_slug = 'fluid';
  if v_capstones <> 3 then
    raise exception 'RC6 go-live refused: fluid has % capstones, expected 3', v_capstones;
  end if;

  -- The course grades every provenance tier EXCEPT `screening`, and the Expert
  -- module on screening quantities contributes no capstone field. Assert that
  -- no screening quantity has been graded into a capstone by a later edit:
  -- LBC viscosity, interfacial tension and the black-oil separator split are
  -- taught and never certified.
  select count(*) into v_graded
    from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'fluid'
     and (f->>'key' ilike '%lbc%'
       or f->>'key' ilike '%viscosity%'
       or f->>'key' ilike '%tension%'
       or f->>'key' ilike '%parachor%');
  if v_graded <> 0 then
    raise exception 'RC6 go-live refused: % capstone field(s) grade a screening quantity; the course teaches those and certifies none of them', v_graded;
  end if;

  -- The Expert tier grades TUNED values and the Professional tier UNTUNED
  -- ones. Assert both are present and on the right tiers, so that a stale
  -- course migration applied out of order cannot grade the untuned answer at
  -- the Expert fee or the reverse.
  select count(*) into v_graded
    from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'fluid' and c.tier = 'advanced'
     and f->>'key' in ('good_oil_tuned_psat_psia', 'tuned_splus_knob', 'tuning_ssr_reduction');
  if v_graded <> 3 then
    raise exception 'RC6 go-live refused: the Expert capstone grades % of its 3 tuning fields', v_graded;
  end if;

  select count(*) into v_graded
    from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'fluid' and c.tier = 'intermediate'
     and f->>'key' in ('good_oil_untuned_psat_psia', 'good_oil_untuned_sto_api', 'good_oil_api_bias');
  if v_graded <> 3 then
    raise exception 'RC6 go-live refused: the Professional capstone grades % of its 3 untuned fields', v_graded;
  end if;

  if not exists (
    select 1 from public.academy_apps
     where slug = 'fluid' and module = 'reservoir'
  ) then
    raise exception 'RC6 go-live refused: fluid catalog row is missing or not mapped to the reservoir module (the Expert bridge trigger needs it)';
  end if;
end
$$;

update public.academy_apps set status = 'available' where slug = 'fluid';
