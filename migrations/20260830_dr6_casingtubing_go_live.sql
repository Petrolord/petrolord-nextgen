-- ============================================================================
-- DR6 GO LIVE (HELD): make Casing and Tubing Design enrollable.
--
-- DO NOT APPLY until a NextGen production upload carries the
-- CasingTubingLearningPage route (/dashboard/apps/casingtubing) and the deep
-- course routes. RC1 through RC7 and DR1 through DR5 are held on the SAME
-- gate.
--
-- Precondition checklist:
--   1. nextgen.petrolord.com serves a build containing /dashboard/apps/casingtubing.
--   2. academy_course_structures has three active casingtubing rows.
--   3. academy_quiz_questions holds 396 casingtubing rows (132 per tier).
--   4. academy_capstones holds the three casingtubing rows.
-- ============================================================================

do $$
declare
  v_structures integer;
  v_capstones  integer;
  v_questions  integer;
  v_graded     integer;
  v_piston     numeric;
  v_balloon    numeric;
  v_thermal    numeric;
  v_total      numeric;
  v_helical    numeric;
  v_dl         numeric;
  v_body       numeric;
  v_joint      numeric;
  v_col        numeric;
  v_colt       numeric;
begin
  select count(*) into v_structures
    from public.academy_course_structures where app_slug = 'casingtubing' and active;
  if v_structures <> 3 then
    raise exception 'DR6 go-live refused: casingtubing has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions
    from public.academy_quiz_questions where app_slug = 'casingtubing';
  if v_questions <> 396 then
    raise exception 'DR6 go-live refused: casingtubing has % quiz questions, expected 396 (132 per tier)', v_questions;
  end if;

  select count(*) into v_capstones
    from public.academy_capstones where app_slug = 'casingtubing';
  if v_capstones <> 3 then
    raise exception 'DR6 go-live refused: casingtubing has % capstones, expected 3', v_capstones;
  end if;

  -- THE SCOPE ASSERTION. Eight things are taught in Expert m05 and certified
  -- nowhere: the buckling length change, annular pressure buildup, seal and
  -- wall friction, the erosional velocity as a design criterion, connection
  -- sealing, casing wear, fatigue, and temperature derating of the yield
  -- strength. A course that teaches a topic implies it is worth learning; one
  -- that GRADES it implies the learner can produce the answer AND that the
  -- answer is worth producing. For every item on that list at least one of
  -- those two is false, and this migration keeps the two claims apart.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'casingtubing'
     and (f->>'key' ilike '%buckling_length%'
       or f->>'key' ilike '%buckle_length%'
       or f->>'key' ilike '%annular_pressure%'
       or f->>'key' ilike '%apb%'
       or f->>'key' ilike '%friction%'
       or f->>'key' ilike '%erosion%'
       or f->>'key' ilike '%velocity%'
       or f->>'key' ilike '%seal_rating%'
       or f->>'key' ilike '%leak%'
       or f->>'key' ilike '%wear%'
       or f->>'key' ilike '%fatigue%'
       or f->>'key' ilike '%cycles%'
       or f->>'key' ilike '%derate%'
       or f->>'key' ilike '%temperature_derat%');
  if v_graded <> 0 then
    raise exception 'DR6 go-live refused: % capstone field(s) grade a quantity these planning forms cannot produce or should not certify; Expert m05 teaches eight such topics and certifies none of them', v_graded;
  end if;

  -- THE PUBLISHED-GOLDEN ASSERTION, WHICH DR4 EARNED. The pairwise collision
  -- test catches two graded fields colliding with EACH OTHER; it does NOT
  -- catch a graded field colliding with a value the GOLDENS PUBLISH, which
  -- would turn a calculation into a lookup. Five of this course's most
  -- quotable published values are checked by name here, and the full
  -- 797-value sweep is asserted in casingTubingLab.test.js.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'casingtubing'
     and (abs((f->>'expected')::numeric - 3554024.408995863) < 50    -- published 20in 94# collapse, flat at every grade
       or abs((f->>'expected')::numeric - 65086506.08) < 50          -- published 9-5/8 47# P-110 burst
       or abs((f->>'expected')::numeric - 6641014.317138594) < 50    -- published 9-5/8 47# P-110 body yield
       or abs((f->>'expected')::numeric - 115872.96889413144) < 0.5  -- published helical limit on the lessons' tubing
       or abs((f->>'expected')::numeric - 1.6904923854809817) < 0.000005); -- published gas kick section 1 burst SF
  if v_graded <> 0 then
    raise exception 'DR6 go-live refused: % graded field(s) sit within tolerance of a value the goldens publish, which makes them a lookup rather than a calculation', v_graded;
  end if;

  -- THE FORCE-SUM ASSERTION, AND THE TWO INEQUALITIES THAT MUST GO THE OTHER
  -- WAY. Piston plus ballooning plus thermal must equal the total EXACTLY,
  -- because they are three collinear forces on one body. Then the two
  -- verdicts the Expert capstone turns on must both be failures: the
  -- compression must EXCEED the helical limit and the length change must
  -- EXCEED the stroke of 2 m. If either inequality flipped, the capstone
  -- would be a completion that works, and the whole of Expert m05's argument
  -- that the two limits are independent would have nothing to stand on.
  select (f->>'expected')::numeric into v_piston from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='casingtubing' and f->>'key'='piston_N';
  select (f->>'expected')::numeric into v_balloon from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='casingtubing' and f->>'key'='ballooning_N';
  select (f->>'expected')::numeric into v_thermal from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='casingtubing' and f->>'key'='thermal_N';
  select (f->>'expected')::numeric into v_total from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='casingtubing' and f->>'key'='total_force_N';
  select (f->>'expected')::numeric into v_helical from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='casingtubing' and f->>'key'='helical_limit_N';
  select (f->>'expected')::numeric into v_dl from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='casingtubing' and f->>'key'='total_length_change_m';
  if v_piston is null or v_balloon is null or v_thermal is null or v_total is null
     or v_helical is null or v_dl is null then
    raise exception 'DR6 go-live refused: one or more of the six Expert force fields is missing';
  end if;
  if abs((v_piston + v_balloon + v_thermal) - v_total) > 0.5 then
    raise exception 'DR6 go-live refused: the three Expert forces sum to % against a reported total of %, so one of them has the wrong sign', v_piston + v_balloon + v_thermal, v_total;
  end if;
  if v_thermal >= 0 then
    raise exception 'DR6 go-live refused: the thermal force is % and must be NEGATIVE at a positive temperature change, because a restrained string that is heated goes into compression', v_thermal;
  end if;
  if -v_total <= v_helical then
    raise exception 'DR6 go-live refused: the Expert compression of % does not exceed the helical limit of %, so the capstone completion no longer buckles and Expert m04 has lost its worked case', -v_total, v_helical;
  end if;
  if v_dl <= 2.0 then
    raise exception 'DR6 go-live refused: the Expert length change of % is inside the 2 m stroke, so the capstone completion no longer strokes out and Expert m03 has lost its worked case', v_dl;
  end if;

  -- THE PAIR OF SUMS WHERE ONE MUST CLOSE AND THE OTHER MUST NOT, WHICH IS THE
  -- PATTERN DR5 EARNED. On the Associate capstone the joint strength MUST be
  -- exactly three quarters of the pipe body yield, because short thread is
  -- 0.75. The collapse under tension MUST NOT equal the collapse without it,
  -- because this pipe is not in the elastic regime. A single assertion of
  -- either kind would pass on a course that had quietly moved the capstone
  -- pipe into the elastic regime, where the second equality WOULD hold and the
  -- whole of Associate m04 would be teaching something the capstone denies.
  select (f->>'expected')::numeric into v_body from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='casingtubing' and f->>'key'='body_yield_N';
  select (f->>'expected')::numeric into v_joint from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='casingtubing' and f->>'key'='joint_strength_N';
  select (f->>'expected')::numeric into v_col from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='casingtubing' and f->>'key'='collapse_Pa';
  select (f->>'expected')::numeric into v_colt from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='casingtubing' and f->>'key'='collapse_at_55pct_tension_Pa';
  if v_body is null or v_joint is null or v_col is null or v_colt is null then
    raise exception 'DR6 go-live refused: one or more of the four Associate rating fields is missing';
  end if;
  if abs(v_joint - 0.75 * v_body) > 50 then
    raise exception 'DR6 go-live refused: the joint strength of % is not three quarters of the pipe body yield of %, so the connection efficiency is not the short thread one the capstone states', v_joint, v_body;
  end if;
  if abs(v_col - v_colt) < 1000000 then
    raise exception 'DR6 go-live refused: the collapse under tension is within 1 MPa of the collapse without it, which means the capstone pipe has reached the elastic regime and the combined-loading derating Associate m04 teaches has nothing to bite on';
  end if;

  -- THE BURST TOLERANCE ASSERTION. The Associate burst rating is 0.875 times
  -- the nominal-wall Barlow value for a 13-3/8 inch 68 lb/ft joint at C-90,
  -- and nothing else. If the tolerance factor were dropped the field would be
  -- 14.3 percent higher, which no tolerance on the field would catch and which
  -- is the single easiest error in the tier.
  if not exists (
    select 1 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug='casingtubing' and f->>'key'='burst_rating_Pa'
       and abs((f->>'expected')::numeric - 0.875 * 2 * 620528130 * 0.012192 / 0.339725) < 50
  ) then
    raise exception 'DR6 go-live refused: the burst field is not 0.875 times the nominal-wall Barlow value at C-90, so the wall undertolerance has been dropped or the geometry has drifted';
  end if;

  -- THE GOVERNING-DEPTH ASSERTION, WRITTEN AS AN ORDERING. On the
  -- Professional capstone the gas kick governs section 1 at the WELLHEAD and
  -- the pressure test governs section 2 at the SHOE, so the gas kick number
  -- must be the LARGER of the two even though it is on the shallower and
  -- stronger section. If a later edit reversed the two gradients, both cases
  -- would govern at the same end and this ordering would break.
  if not exists (
    select 1
      from public.academy_capstones c,
           lateral jsonb_array_elements(c.fields) f1,
           lateral jsonb_array_elements(c.fields) f2
     where c.app_slug='casingtubing'
       and f1->>'key'='gaskick_sec1_burst_sf' and f2->>'key'='pressuretest_sec2_burst_sf'
       and (f1->>'expected')::numeric > (f2->>'expected')::numeric
  ) then
    raise exception 'DR6 go-live refused: the gas kick burst safety factor does not exceed the pressure test one, so the two governing depths are no longer at opposite ends of the string';
  end if;

  -- THE EVACUATION ASSERTION. On the Professional capstone the fluid level at
  -- an evacuation fraction of 0.7 lands INSIDE the top section, so the partial
  -- evacuation number must be strictly LARGER than the full evacuation one on
  -- section 2 and the full evacuation one must be the only field below 1.
  if not exists (
    select 1
      from public.academy_capstones c,
           lateral jsonb_array_elements(c.fields) f1,
           lateral jsonb_array_elements(c.fields) f2
     where c.app_slug='casingtubing'
       and f1->>'key'='partialevac_sec2_collapse_sf' and f2->>'key'='fullevac_sec2_collapse_sf'
       and (f1->>'expected')::numeric > (f2->>'expected')::numeric + 0.5
  ) then
    raise exception 'DR6 go-live refused: the partial evacuation collapse factor does not exceed the full evacuation one by a clear margin, so the fluid level has moved and Professional m03 no longer holds';
  end if;
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug='casingtubing' and c.tier='intermediate'
     and (f->>'expected')::numeric < 1.0;
  if v_graded <> 1 then
    raise exception 'DR6 go-live refused: % of the six Professional safety factors are below unity, expected exactly 1 (the full evacuation collapse on the lower section)', v_graded;
  end if;

  -- THE UNITS ASSERTION. Five graded quantities have a plausible wrong unit a
  -- factor of about 6895 away, because the collapse polynomials work in psi
  -- internally: the pressures are graded in PASCALS. Four more are forces in
  -- NEWTONS rather than kilonewtons.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug='casingtubing'
     and f->>'key' in ('burst_rating_Pa','collapse_Pa','collapse_at_55pct_tension_Pa')
     and f->>'unit' = 'Pa';
  if v_graded <> 3 then
    raise exception 'DR6 go-live refused: % of the 3 Associate pressure fields are graded in pascals', v_graded;
  end if;
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug='casingtubing'
     and f->>'key' in ('body_yield_N','joint_strength_N','piston_N','ballooning_N','thermal_N','total_force_N','helical_limit_N')
     and f->>'unit' = 'N';
  if v_graded <> 7 then
    raise exception 'DR6 go-live refused: % of the 7 force fields are graded in newtons', v_graded;
  end if;

  -- TIER SEPARATION. Each tier grades its own three signature quantities.
  select count(*) into v_graded from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug='casingtubing' and c.tier='beginner'
     and f->>'key' in ('burst_rating_Pa','collapse_at_55pct_tension_Pa','dt_plastic_transition_boundary');
  if v_graded <> 3 then
    raise exception 'DR6 go-live refused: the Associate capstone grades % of its 3 rating fields', v_graded;
  end if;
  select count(*) into v_graded from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug='casingtubing' and c.tier='intermediate'
     and f->>'key' in ('gaskick_sec1_burst_sf','fullevac_sec2_collapse_sf','pressuretest_sec2_triax_sf');
  if v_graded <> 3 then
    raise exception 'DR6 go-live refused: the Professional capstone grades % of its 3 load-case fields', v_graded;
  end if;
  select count(*) into v_graded from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug='casingtubing' and c.tier='advanced'
     and f->>'key' in ('thermal_N','helical_limit_N','total_length_change_m');
  if v_graded <> 3 then
    raise exception 'DR6 go-live refused: the Expert capstone grades % of its 3 tubing-packer fields', v_graded;
  end if;

  if not exists (select 1 from public.academy_apps where slug='casingtubing' and module='drilling') then
    raise exception 'DR6 go-live refused: casingtubing catalog row is missing or not mapped to the drilling module';
  end if;
  if not exists (select 1 from public.academy_apps where slug='casingtubing' and path_order=23) then
    raise exception 'DR6 go-live refused: casingtubing is not at path_order 23, which is its place in the Drilling and Completions ladder';
  end if;
end
$$;

update public.academy_apps set status = 'available' where slug = 'casingtubing';
