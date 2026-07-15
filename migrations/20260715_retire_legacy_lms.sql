-- ============================================================================
-- 20260715_retire_legacy_lms.sql
-- Legacy LMS retirement pass: drop every remaining legacy table, trigger and
-- function left from the Horizons-era LMS. The academy spine (academy_*) is
-- the only learning system; chassis tables that surviving code still reads
-- (profiles, audit/email/notification/report/compliance/anonymization,
-- system_settings, analytics_events, feature_toggles, filter_presets,
-- retention_policies, user_preferences) are kept.
--
-- Pre-flight verified 2026-07-15:
--   * every dropped table has ZERO code references in src/ and
--     supabase/functions after the frontend purge commit
--   * every dropped table has 0 rows EXCEPT: universities (1),
--     university_applications (42), university_members (1), applications (24),
--     modules (6), login_activity (4), role_permissions (26 seed rows,
--     never queried), password_reset_tokens (11 stale tokens; auth flows use
--     supabase.auth, not this table)
--   * university* rows archived server-side at
--     /root/nextgen-legacy-archive/*-20260715.json before the drop
--   * academy_certifications.course_id / academy_enrollments.course_id FKs
--     into legacy courses are dropped by CASCADE; the nullable uuid columns
--     stay (spine function signatures unchanged)
--   * deployed delete-user edge fn warn-and-continues on missing tables and
--     is redeployed without legacy cleanup in the same pass
-- ============================================================================

begin;

-- ---------------------------------------------------------------------------
-- 1. Profile triggers that write legacy tables (would break signups/updates
--    once their targets are gone)
-- ---------------------------------------------------------------------------
drop trigger if exists on_new_profile_grant_access on public.profiles;      -- lecturer_application_access
drop trigger if exists on_profile_module_change on public.profiles;         -- courses/course_enrollments
drop trigger if exists trigger_auto_issue_lecturer_license on public.profiles; -- licenses

-- ---------------------------------------------------------------------------
-- 2. academy_course_for_app queried the legacy courses catalog to backlink
--    certificates. The catalog is gone (and was empty); the link is vestigial.
--    Redefine before dropping courses so capstone auto-certification
--    (academy_submit_capstone -> academy_issue_certification) keeps working.
-- ---------------------------------------------------------------------------
create or replace function public.academy_course_for_app(p_app text)
returns uuid
language sql
stable
as $$
  select null::uuid;
$$;

-- ---------------------------------------------------------------------------
-- 3. Drop legacy tables. CASCADE is deliberate: in-set FKs/policies cross-
--    reference each other (same gotcha as the N2 drop), and the two academy
--    course_id FKs into courses must go with the table.
-- ---------------------------------------------------------------------------
-- course/lesson core
drop table if exists public.course_progress_tracking cascade;
drop table if exists public.course_completions cascade;
drop table if exists public.course_enrollments cascade;
drop table if exists public.course_passing_requirements cascade;
drop table if exists public.course_content cascade;
drop table if exists public.course_materials cascade;
drop table if exists public.course_lessons cascade;
drop table if exists public.course_modules cascade;
drop table if exists public.lesson_progress cascade;
drop table if exists public.lesson_content cascade;
drop table if exists public.lesson_notes cascade;
drop table if exists public.lesson_resources cascade;
drop table if exists public.lesson_videos cascade;
drop table if exists public.lessons cascade;
drop table if exists public.courses cascade;
-- quiz engine
drop table if exists public.quiz_attempt_answers cascade;
drop table if exists public.quiz_attempts cascade;
drop table if exists public.quiz_options cascade;
drop table if exists public.quiz_questions cascade;
drop table if exists public.quizzes cascade;
-- study extras
drop table if exists public.flashcards cascade;
drop table if exists public.study_materials cascade;
drop table if exists public.video_analytics cascade;
drop table if exists public.video_events cascade;
-- gamification + legacy certificates
drop table if exists public.certificates cascade;
drop table if exists public.user_achievements cascade;
drop table if exists public.achievements cascade;
drop table if exists public.learning_streaks cascade;
drop table if exists public.learning_analytics cascade;
-- student_* family
drop table if exists public.student_academic_level cascade;
drop table if exists public.student_application_access cascade;
drop table if exists public.student_course_attempts cascade;
drop table if exists public.student_course_enrollment cascade;
drop table if exists public.student_course_enrollments cascade;
drop table if exists public.student_course_progress cascade;
drop table if exists public.student_lesson_progress cascade;
drop table if exists public.student_login_logs cascade;
drop table if exists public.student_module_assignments cascade;
drop table if exists public.student_progress cascade;
drop table if exists public.student_quiz_grades cascade;
-- licensing
drop table if exists public.licenses cascade;
drop table if exists public.license_settings cascade;
-- university machinery (rows archived, see header)
drop table if exists public.university_members cascade;
drop table if exists public.university_departments cascade;
drop table if exists public.university_applications cascade;
drop table if exists public.universities cascade;
-- lecturer machinery
drop table if exists public.lecturer_application_access cascade;
drop table if exists public.lecturer_department_assignments cascade;
drop table if exists public.lecturer_module_assignments cascade;
-- module/application access system
drop table if exists public.department_module_mapping cascade;
drop table if exists public.module_access_locks cascade;
drop table if exists public.application_metrics cascade;
drop table if exists public.applications cascade;
drop table if exists public.modules cascade;
-- university-era bulk import
drop table if exists public.bulk_import_records cascade;
drop table if exists public.bulk_import_logs cascade;
drop table if exists public.scheduled_imports cascade;
-- writer-less / never-queried orphans
drop table if exists public.login_activity cascade;
drop table if exists public.marketplace_items cascade;
drop table if exists public.workflows cascade;
drop table if exists public.support_tickets cascade;
drop table if exists public.alumni_downloads cascade;
drop table if exists public.alumni_grace_period_extensions cascade;
drop table if exists public.users cascade;                 -- empty shadow of auth.users
drop table if exists public.user_activity cascade;
drop table if exists public.password_reset_tokens cascade;
drop table if exists public.api_keys cascade;
drop table if exists public.role_permissions cascade;
drop table if exists public.alerts cascade;
drop table if exists public.alert_rules cascade;
drop table if exists public.alert_history cascade;
drop table if exists public.compliance_logs cascade;
drop table if exists public.notification_templates cascade;

-- ---------------------------------------------------------------------------
-- 4. Legacy helper/trigger functions (their tables are gone)
-- ---------------------------------------------------------------------------
drop function if exists public.assign_modules_to_lecturer cascade;
drop function if exists public.assign_modules_to_student cascade;
drop function if exists public.auto_assign_module_to_student cascade;
drop function if exists public.auto_enroll_student_in_courses cascade;
drop function if exists public.auto_issue_lecturer_license cascade;
drop function if exists public.auto_issue_student_license cascade;
drop function if exists public.can_student_retake_course cascade;
drop function if exists public.check_license_status cascade;
drop function if exists public.create_course_passing_requirement cascade;
drop function if exists public.create_initial_course_attempt cascade;
drop function if exists public.enroll_student_in_course cascade;
drop function if exists public.get_course_details cascade;
drop function if exists public.get_courses_by_module cascade;
drop function if exists public.get_student_module cascade;
drop function if exists public.grant_application_access cascade;
drop function if exists public.handle_new_completion cascade;
drop function if exists public.handle_new_profile_role_access cascade;
drop function if exists public.handle_profile_course_enrollment cascade;
drop function if exists public.issue_lecturer_license cascade;
drop function if exists public.issue_student_license cascade;
drop function if exists public.mark_course_completion cascade;
drop function if exists public.mark_lesson_complete cascade;
drop function if exists public.update_module_access_lock cascade;

-- ---------------------------------------------------------------------------
-- 5. profiles cleanup: module_id belonged to the legacy module-assignment
--    system (last writer and reader removed in the frontend purge).
--    'phase' stays (handle_new_user still writes it).
-- ---------------------------------------------------------------------------
alter table public.profiles drop column if exists module_id;

-- ---------------------------------------------------------------------------
-- 6. Retire the university_admin role: the university machinery is gone;
--    those accounts fold back to the base learner identity.
-- ---------------------------------------------------------------------------
update public.profiles set role = 'learner', updated_at = now()
 where role = 'university_admin';

-- ---------------------------------------------------------------------------
-- 7. Admin read access on enrollments for the academy-native admin surfaces
--    (compliance enrollment report, analytics, user detail). Mirrors the
--    N3.4 admin SELECT policy on academy_certifications. Read-only; all
--    writes remain server-side.
-- ---------------------------------------------------------------------------
drop policy if exists academy_enrollments_select_admin on public.academy_enrollments;
create policy academy_enrollments_select_admin
  on public.academy_enrollments for select
  using (public.get_user_role() = any (array['lecturer','admin','super_admin']));

commit;
