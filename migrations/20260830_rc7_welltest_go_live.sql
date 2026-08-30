-- ============================================================================
-- RC7 GO LIVE (HELD): make Well Test Analysis enrollable.
--
-- DO NOT APPLY until a NextGen production upload carries the
-- WellTestLearningPage route (/dashboard/apps/welltest) and the deep-course
-- routes. Flipping status to 'available' is what puts the course on EnrollPage
-- and lets a learner pay for it, so applying this early sells a course whose
-- app page 404s.
--
-- RC1 dca, RC2 mbal, RC3 scal, RC4 waterflood, RC5 sim and RC6 fluid are held
-- on the SAME gate. One production upload releases all seven, and each has its
-- own go-live file asserting its own preconditions; this file asserts only
-- welltest's.
--
-- Precondition checklist, all verifiable before running this file:
--   1. nextgen.petrolord.com serves a build containing /dashboard/apps/welltest.
--   2. academy_course_structures has three active welltest rows.
--   3. academy_quiz_questions holds 396 welltest rows (132 per tier).
--   4. academy_capstones holds the three welltest rows (inert while the
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
   where app_slug = 'welltest' and active;
  if v_structures <> 3 then
    raise exception 'RC7 go-live refused: welltest has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions
    from public.academy_quiz_questions where app_slug = 'welltest';
  if v_questions <> 396 then
    raise exception 'RC7 go-live refused: welltest has % quiz questions, expected 396 (132 per tier)', v_questions;
  end if;

  select count(*) into v_capstones
    from public.academy_capstones where app_slug = 'welltest';
  if v_capstones <> 3 then
    raise exception 'RC7 go-live refused: welltest has % capstones, expected 3', v_capstones;
  end if;

  -- THE SCOPE ASSERTION. engines/welltest has no deconvolution, no
  -- interference or multi-well analysis, and no way to separate a gas well's
  -- apparent skin into its Darcy and non-Darcy parts. Expert module m06
  -- teaches all three and certifies none of them. Assert that no later edit
  -- has quietly graded one of them.
  select count(*) into v_graded
    from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'welltest'
     and (f->>'key' ilike '%deconvol%'
       or f->>'key' ilike '%interference%'
       or f->>'key' ilike '%non_darcy%'
       or f->>'key' ilike '%nondarcy%'
       or f->>'key' ilike '%apparent_skin%');
  if v_graded <> 0 then
    raise exception 'RC7 go-live refused: % capstone field(s) grade a quantity this engine cannot produce; the course teaches those and certifies none of them', v_graded;
  end if;

  -- THE PHANTOM-FAULT ASSERTION. The Expert tier grades the sealing-fault
  -- model fitted to the FAULT fixture, which returns 793.8937564207687 ft and
  -- moves 0.021 ft under a 4.5e-13 psi rewrite of the same data. It must never
  -- grade the same model fitted to the boundary-free buildup, which returns
  -- about 3100 ft and moves 116 ft under that same rewrite. Any expert field
  -- whose expected distance sits above 1500 ft is that phantom.
  select count(*) into v_graded
    from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'welltest' and c.tier = 'advanced'
     and f->>'unit' = 'ft'
     and (f->>'expected')::numeric > 1500;
  if v_graded <> 0 then
    raise exception 'RC7 go-live refused: % Expert capstone field(s) grade a distance above 1500 ft, which is the phantom fault rather than the real one', v_graded;
  end if;

  -- The Expert tier grades the two PRODUCTION-DATA volumes and the
  -- Professional tier the DIAGNOSTIC quantities. Assert both, so that a stale
  -- course migration applied out of order cannot grade a lower tier's work at
  -- the Expert fee or the reverse.
  select count(*) into v_graded
    from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'welltest' and c.tier = 'advanced'
     and f->>'key' in ('rta_oil_n_stb', 'rta_gas_g_mscf', 'fault_fit_distance_ft');
  if v_graded <> 3 then
    raise exception 'RC7 go-live refused: the Expert capstone grades % of its 3 regression and production-data fields', v_graded;
  end if;

  select count(*) into v_graded
    from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'welltest' and c.tier = 'intermediate'
     and f->>'key' in ('radial_plateau_psi', 'fault_late_k_md', 'dp_dip_ratio');
  if v_graded <> 3 then
    raise exception 'RC7 go-live refused: the Professional capstone grades % of its 3 derivative fields', v_graded;
  end if;

  -- The drainage area is graded in SQUARE FEET rather than acres. In acres it
  -- is 64.28165910874567, which sits 0.0041 from the Expert tier's equivalent
  -- producing time of 64.28571428571429 and inside its 0.005 tolerance, so a
  -- Professional answer would score full marks on an Expert field.
  if not exists (
    select 1 from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f
     where c.app_slug = 'welltest' and c.tier = 'intermediate'
       and f->>'key' = 'rect_drainage_area_ft2' and f->>'unit' = 'ft2'
  ) then
    raise exception 'RC7 go-live refused: the drainage area field is missing or is not graded in square feet';
  end if;

  if not exists (
    select 1 from public.academy_apps
     where slug = 'welltest' and module = 'reservoir'
  ) then
    raise exception 'RC7 go-live refused: welltest catalog row is missing or not mapped to the reservoir module (the Expert bridge trigger needs it)';
  end if;
end
$$;

update public.academy_apps set status = 'available' where slug = 'welltest';
