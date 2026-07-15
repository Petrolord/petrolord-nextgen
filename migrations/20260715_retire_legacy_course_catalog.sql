-- Retire the legacy course catalog from learner view (owner directive
-- 2026-07-15: "Remove all the courses that you did not create. We
-- should avoid confusion as much as possible.")
--
-- The legacy LMS `courses` table (26 rows, created 2026-01/02 + a July
-- demo) predates the academy and is NOT the academy course system —
-- academy courses live in academy_apps and are delivered through the
-- Learning Mode apps. Showing both catalogs confused learners.
--
-- This unpublishes EVERY legacy course (is_published + the legacy
-- published flag), removing them all from the learner catalog.
-- Deliberately NOT a hard delete: seven courses carry authored lesson
-- content (6–22 lessons each) that can be folded into future academy
-- courses; the rows and lessons stay in the database, invisible, and
-- can be re-published or exported at the owner's call. First step of
-- the planned legacy retirement pass.

update public.courses
   set is_published = false,
       published    = false
 where is_published = true or published = true;
