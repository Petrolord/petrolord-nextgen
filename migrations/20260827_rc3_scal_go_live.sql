-- ============================================================================
-- RC3 GO LIVE (HELD): make SCAL & Displacement enrollable.
--
-- DO NOT APPLY until a NextGen production upload carries the ScalLearningPage
-- route (/dashboard/apps/scal) and the deep-course routes. Flipping status to
-- 'available' is what puts the course on EnrollPage and lets a learner pay for
-- it, so applying this early sells a course whose app page 404s.
--
-- Precondition checklist, all verifiable before running this file:
--   1. nextgen.petrolord.com serves a build containing /dashboard/apps/scal.
--   2. academy_course_structures has active rows for scal at every tier that
--      this release ships (beginner at minimum).
--   3. academy_capstones has the three scal rows (they ship with the course
--      migration and are inert while the catalog row is coming_soon).
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
begin
  -- The ladder is complete now, so this asserts the whole of it rather than
  -- "at least one tier": flipping the course to available with a tier missing
  -- would sell a path that dead-ends.
  select count(*) into v_structures
    from public.academy_course_structures
   where app_slug = 'scal' and active;
  if v_structures <> 3 then
    raise exception 'RC3 go-live refused: scal has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions
    from public.academy_quiz_questions where app_slug = 'scal';
  if v_questions <> 396 then
    raise exception 'RC3 go-live refused: scal has % quiz questions, expected 396 (132 per tier)', v_questions;
  end if;

  select count(*) into v_capstones
    from public.academy_capstones where app_slug = 'scal';
  if v_capstones <> 3 then
    raise exception 'RC3 go-live refused: scal has % capstones, expected 3', v_capstones;
  end if;

  if not exists (
    select 1 from public.academy_apps
     where slug = 'scal' and module = 'reservoir'
  ) then
    raise exception 'RC3 go-live refused: scal catalog row is missing or not mapped to the reservoir module (the Expert bridge trigger needs it)';
  end if;
end
$$;

update public.academy_apps set status = 'available' where slug = 'scal';
