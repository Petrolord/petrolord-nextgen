-- ============================================================================
-- DR1 GO LIVE (HELD): make Well Design & Surveys enrollable.
--
-- DO NOT APPLY until a NextGen production upload carries the
-- WellDesignLearningPage route (/dashboard/apps/welldesign) and the deep-course
-- routes. Flipping status to 'available' is what puts the course on EnrollPage
-- and lets a learner pay for it, so applying this early sells a course whose
-- app page 404s.
--
-- RC1 through RC7 are held on the SAME gate. One production upload releases
-- all of them together with this course, and each has its own go-live file
-- asserting its own preconditions; this file asserts only welldesign's.
--
-- Precondition checklist, all verifiable before running this file:
--   1. nextgen.petrolord.com serves a build containing /dashboard/apps/welldesign.
--   2. academy_course_structures has three active welldesign rows.
--   3. academy_quiz_questions holds 396 welldesign rows (132 per tier).
--   4. academy_capstones holds the three welldesign rows (inert while the
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
begin
  select count(*) into v_structures
    from public.academy_course_structures
   where app_slug = 'welldesign' and active;
  if v_structures <> 3 then
    raise exception 'DR1 go-live refused: welldesign has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions
    from public.academy_quiz_questions where app_slug = 'welldesign';
  if v_questions <> 396 then
    raise exception 'DR1 go-live refused: welldesign has % quiz questions, expected 396 (132 per tier)', v_questions;
  end if;

  select count(*) into v_capstones
    from public.academy_capstones where app_slug = 'welldesign';
  if v_capstones <> 3 then
    raise exception 'DR1 go-live refused: welldesign has % capstones, expected 3', v_capstones;
  end if;

  -- THE SCOPE ASSERTION. engines/drilling implements the ISCWSA MWD magnetic
  -- error model and nothing else: no gyroscopic error models, no multi-station
  -- analysis, no in-field referencing, no relief well ranging, and no
  -- probabilistic collision risk. Expert module m05 l04 teaches all four and
  -- certifies none of them. Assert that no later edit has quietly graded one.
  select count(*) into v_graded
    from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'welldesign'
     and (f->>'key' ilike '%gyro%'
       or f->>'key' ilike '%msa%'
       or f->>'key' ilike '%multistation%'
       or f->>'key' ilike '%multi_station%'
       or f->>'key' ilike '%ifr%'
       or f->>'key' ilike '%in_field%'
       or f->>'key' ilike '%ranging%'
       or f->>'key' ilike '%relief%'
       or f->>'key' ilike '%collision_prob%'
       or f->>'key' ilike '%pcol%');
  if v_graded <> 0 then
    raise exception 'DR1 go-live refused: % capstone field(s) grade a quantity this engine cannot produce; the course teaches those and certifies none of them', v_graded;
  end if;

  -- THE NEGATIVE-FACTOR ASSERTION. The Expert tier grades offset well 10's
  -- minimum separation factor at k 3.5 AND at k 5.0, precisely so that the
  -- learner has to see that raising the confidence factor moves a NEGATIVE
  -- factor towards zero without either well moving. Grading only one of the
  -- two turns the sharpest lesson in the tier back into a claim.
  select count(*) into v_graded
    from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'welldesign' and c.tier = 'advanced'
     and f->>'key' in ('well10_min_sf', 'well10_min_sf_at_k5')
     and (f->>'expected')::numeric < 0;
  if v_graded <> 2 then
    raise exception 'DR1 go-live refused: the Expert capstone grades % of the 2 negative separation factors, so the k-sensitivity comparison cannot be made', v_graded;
  end if;

  -- THE PUBLISHED-REFERENCE ASSERTION. Associate field 2 is the tangential
  -- method's TVD less the PUBLISHED minimum-curvature value of 1653.99 ft, not
  -- less the engine's own 1653.986686265376. The two differ in the third
  -- decimal and the tolerance is 0.005, so an error computed against the
  -- engine's own answer fails. It is graded as a NEGATIVE number, because the
  -- tangential method reads shallow on a build.
  if not exists (
    select 1 from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f
     where c.app_slug = 'welldesign' and c.tier = 'beginner'
       and f->>'key' = 'ade_tangential_tvd_error'
       and (f->>'expected')::numeric < 0
  ) then
    raise exception 'DR1 go-live refused: the Associate tangential-error field is missing or is not graded as a negative value';
  end if;

  -- TIER SEPARATION. The Associate tier grades the survey calculation, the
  -- Professional tier one station's uncertainty, and the Expert tier two
  -- wells' separation. Assert all three, so that a stale course migration
  -- applied out of order cannot grade a lower tier's work at a higher fee.
  select count(*) into v_graded
    from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'welldesign' and c.tier = 'beginner'
     and f->>'key' in ('ade_mincurve_tvd', 'golden_ft_vertical_section', 'buildhold_end_tvd');
  if v_graded <> 3 then
    raise exception 'DR1 go-live refused: the Associate capstone grades % of its 3 survey-calculation fields', v_graded;
  end if;

  select count(*) into v_graded
    from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'welldesign' and c.tier = 'intermediate'
     and f->>'key' in ('well1_sigma_lateral', 'well1_ellipse95_semimajor', 'well1_amil_share_pct');
  if v_graded <> 3 then
    raise exception 'DR1 go-live refused: the Professional capstone grades % of its 3 uncertainty fields', v_graded;
  end if;

  select count(*) into v_graded
    from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'welldesign' and c.tier = 'advanced'
     and f->>'key' in ('well01_min_sf', 'well09_min_sf', 'wmm_declination_at_80n_0e');
  if v_graded <> 3 then
    raise exception 'DR1 go-live refused: the Expert capstone grades % of its 3 clearance and magnetic fields', v_graded;
  end if;

  -- THE VARIANCE ASSERTION. Professional field 1 is a covariance ENTRY in
  -- square metres, not a sigma in metres. Its square root is about 92 m, which
  -- is close enough to the lateral sigma of the same station to look right if
  -- the field is ever quietly changed to a sigma.
  if not exists (
    select 1 from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f
     where c.app_slug = 'welldesign' and c.tier = 'intermediate'
       and f->>'key' = 'well1_cov_nn' and f->>'unit' = 'm2'
       and (f->>'expected')::numeric > 1000
  ) then
    raise exception 'DR1 go-live refused: the north-north covariance field is missing, is not in square metres, or has been replaced by a sigma';
  end if;

  if not exists (
    select 1 from public.academy_apps
     where slug = 'welldesign' and module = 'drilling'
  ) then
    raise exception 'DR1 go-live refused: welldesign catalog row is missing or not mapped to the drilling module (the Expert bridge trigger needs it)';
  end if;
end
$$;

update public.academy_apps set status = 'available' where slug = 'welldesign';
