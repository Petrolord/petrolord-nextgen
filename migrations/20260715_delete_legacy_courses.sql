-- Delete the legacy course catalog permanently (owner directive
-- 2026-07-15: "Delete the legacy courses permanently, we won't need
-- them"). Second and final step of the legacy retirement pass —
-- supersedes the soft retirement in
-- 20260715_retire_legacy_course_catalog.sql, which kept the rows for
-- possible reuse; the owner has ruled that out.
--
-- Pre-delete state, verified live 2026-07-15:
--   courses 26, course_modules 45, course_lessons 115,
--   course_passing_requirements 26, quizzes 2 — and ZERO learner data
--   anywhere in the legacy LMS (certificates, enrollments across all
--   four enrollment tables, completions, progress, notes, analytics
--   all empty). academy_enrollments/academy_certifications course_id
--   links: 0 rows (academy courses live in academy_apps, not here).
--   No lesson video/thumbnail URLs point at project storage (videos
--   are external links), so no storage objects are orphaned.
--
-- All child FKs cascade (or SET NULL for the academy links); the one
-- NO ACTION FK, course_progress_tracking.course_id, has 0 rows.
-- A single delete on courses therefore removes the whole tree.
-- Tables are NOT dropped here: the wider legacy LMS surface
-- (lecturer/university flows) still compiles against them; dropping
-- is a separate decision.

delete from public.courses;

-- Verify the tree is empty.
do $$
declare
  remaining int;
begin
  select (select count(*) from public.courses)
       + (select count(*) from public.course_modules)
       + (select count(*) from public.course_lessons)
       + (select count(*) from public.course_passing_requirements)
       + (select count(*) from public.quizzes)
    into remaining;
  if remaining <> 0 then
    raise exception 'legacy course rows remain after delete: %', remaining;
  end if;
end $$;
