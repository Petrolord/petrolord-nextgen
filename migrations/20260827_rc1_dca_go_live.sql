-- ============================================================================
-- RC1 GO LIVE (HELD): make Decline Curve Analysis enrollable.
--
-- DO NOT APPLY until a NextGen production upload carries the DcaLearningPage
-- route (/dashboard/apps/dca) and the deep-course routes. Flipping status to
-- 'available' is what puts the course on EnrollPage and lets a learner pay for
-- it, so applying this early sells a course whose app page 404s.
--
-- Precondition checklist, all verifiable before running this file:
--   1. nextgen.petrolord.com serves a build containing /dashboard/apps/dca.
--   2. academy_course_structures has active rows for dca at every tier that
--      this release ships (beginner at minimum).
--   3. academy_capstones has the three dca rows (they ship with the course
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
begin
  select count(*) into v_structures
    from public.academy_course_structures
   where app_slug = 'dca' and active;
  if v_structures < 1 then
    raise exception 'RC1 go-live refused: dca has % active deep structures, expected at least 1', v_structures;
  end if;

  select count(*) into v_capstones
    from public.academy_capstones where app_slug = 'dca';
  if v_capstones <> 3 then
    raise exception 'RC1 go-live refused: dca has % capstones, expected 3', v_capstones;
  end if;

  if not exists (
    select 1 from public.academy_apps
     where slug = 'dca' and module = 'reservoir'
  ) then
    raise exception 'RC1 go-live refused: dca catalog row is missing or not mapped to the reservoir module (the Expert bridge trigger needs it)';
  end if;
end
$$;

update public.academy_apps set status = 'available' where slug = 'dca';
