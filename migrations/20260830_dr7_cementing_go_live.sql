-- ============================================================================
-- DR7 GO LIVE (HELD): make Cementing enrollable.
--
-- DO NOT APPLY until a NextGen production upload carries the
-- CementingLearningPage route (/dashboard/apps/cementing) and the deep course
-- routes. RC1 through RC7 and DR1 through DR6 are held on the SAME gate.
--
-- Precondition checklist:
--   1. nextgen.petrolord.com serves a build containing /dashboard/apps/cementing.
--   2. academy_course_structures has three active cementing rows.
--   3. academy_quiz_questions holds 396 cementing rows (132 per tier).
--   4. academy_capstones holds the three cementing rows.
-- ============================================================================

do $$
declare
  v_structures integer;
  v_capstones  integer;
  v_questions  integer;
  v_graded     integer;
  v_ann        numeric;
  v_track      numeric;
  v_slurry     numeric;
  v_disp       numeric;
  v_sacks      numeric;
  v_bore       numeric;
  v_minr       numeric;
  v_maxr       numeric;
  v_width      numeric;
  v_ecd        numeric;
  v_endp       numeric;
  v_float      numeric;
  v_so         numeric;
  v_soc        numeric;
  v_rigid      numeric;
  v_req        numeric;
  v_k          numeric;
begin
  select count(*) into v_structures
    from public.academy_course_structures where app_slug = 'cementing' and active;
  if v_structures <> 3 then
    raise exception 'DR7 go-live refused: cementing has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions
    from public.academy_quiz_questions where app_slug = 'cementing';
  if v_questions <> 396 then
    raise exception 'DR7 go-live refused: cementing has % quiz questions, expected 396 (132 per tier)', v_questions;
  end if;

  select count(*) into v_capstones
    from public.academy_capstones where app_slug = 'cementing';
  if v_capstones <> 3 then
    raise exception 'DR7 go-live refused: cementing has % capstones, expected 3', v_capstones;
  end if;

  -- THE SCOPE ASSERTION. Nine things are taught in Expert m05 and certified
  -- nowhere: casing rotation and reciprocation, intermixing and contamination,
  -- thickening time and compressive strength, temperature, losses to the
  -- formation, gas migration after placement, the transient free-fall rate,
  -- tension times dogleg in the standoff, and cement bond evaluation. For each
  -- of them either this engine cannot produce the answer at all, or it
  -- produces a screening version that should not carry a certificate. A course
  -- that TEACHES a topic says it is worth knowing about; one that GRADES it
  -- says the learner can produce the answer AND that the answer is worth
  -- producing. This migration keeps those two claims apart.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'cementing'
     and (f->>'key' ilike '%rotat%'
       or f->>'key' ilike '%reciproc%'
       or f->>'key' ilike '%contamin%'
       or f->>'key' ilike '%mixing%'
       or f->>'key' ilike '%thicken%'
       or f->>'key' ilike '%compressive%'
       or f->>'key' ilike '%strength%'
       or f->>'key' ilike '%temperature%'
       or f->>'key' ilike '%thermal%'
       or f->>'key' ilike '%loss%'
       or f->>'key' ilike '%migration%'
       or f->>'key' ilike '%fall_rate%'
       or f->>'key' ilike '%dogleg%'
       or f->>'key' ilike '%bond%'
       or f->>'key' ilike '%efficiency%');
  if v_graded <> 0 then
    raise exception 'DR7 go-live refused: % capstone field(s) grade a quantity this plug-flow isothermal engine cannot produce or should not certify; Expert m05 teaches nine such topics and certifies none of them', v_graded;
  end if;

  -- THE PUBLISHED-GOLDEN ASSERTION, WHICH DR4 EARNED. The pairwise collision
  -- test catches two graded fields colliding with EACH OTHER; it does NOT
  -- catch a graded field colliding with a value the GOLDENS PUBLISH, which
  -- would turn a calculation into a lookup. Six of this course's most quotable
  -- published values are checked by name here, and the full 977-value sweep is
  -- asserted in cementingLab.test.js.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'cementing'
     and (abs((f->>'expected')::numeric - 24.34828356497546) < 0.0000005    -- published annular slurry, both wells
       or abs((f->>'expected')::numeric - 0.7750973779907808) < 0.0000005   -- published shoe track, both wells
       or abs((f->>'expected')::numeric - 57.357205971317775) < 0.0000005   -- published slant displacement
       or abs((f->>'expected')::numeric - 657.6801293970221) < 0.0005       -- published sacks, both wells
       or abs((f->>'expected')::numeric - 0.742357202445576) < 0.0000005    -- published slant minimum standoff
       or abs((f->>'expected')::numeric - 13.05523892558449) < 0.0000005);  -- published slant required spacing
  if v_graded <> 0 then
    raise exception 'DR7 go-live refused: % graded field(s) sit within tolerance of a value the goldens publish, which makes them a lookup rather than a calculation', v_graded;
  end if;

  select (f->>'expected')::numeric into v_ann from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='cementing' and f->>'key'='annulus_slurry_m3';
  select (f->>'expected')::numeric into v_track from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='cementing' and f->>'key'='shoe_track_m3';
  select (f->>'expected')::numeric into v_slurry from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='cementing' and f->>'key'='slurry_m3';
  select (f->>'expected')::numeric into v_disp from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='cementing' and f->>'key'='displacement_m3';
  select (f->>'expected')::numeric into v_sacks from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='cementing' and f->>'key'='sacks';
  select (f->>'expected')::numeric into v_bore from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='cementing' and f->>'key'='open_hole_effective_bore_m';
  if v_ann is null or v_track is null or v_slurry is null or v_disp is null
     or v_sacks is null or v_bore is null then
    raise exception 'DR7 go-live refused: one or more of the six Associate volume fields is missing';
  end if;

  -- THE VOLUME SUM. The annular slurry plus the shoe track is the total
  -- slurry, exactly, and the sacks times the stated yield is the same number.
  if abs((v_ann + v_track) - v_slurry) > 0.0000005 then
    raise exception 'DR7 go-live refused: the annular slurry of % plus the shoe track of % is not the total slurry of %', v_ann, v_track, v_slurry;
  end if;
  if abs(v_sacks * 0.0402 - v_slurry) > 0.0001 then
    raise exception 'DR7 go-live refused: the sacks of % at a yield of 0.0402 give % against a total slurry of %, so one of the two was computed on the wrong volume', v_sacks, v_sacks * 0.0402, v_slurry;
  end if;

  -- THE EXCESS ASSERTION. The effective bore must lie STRICTLY between the
  -- 12-1/4 inch bit size and the 13-3/8 inch casing bore above it. Below the
  -- bit size means the excess was applied as a divisor; above the casing bore
  -- means it was applied to the DIAMETER rather than to the area, which is the
  -- single easiest error in the Associate tier and which no tolerance on the
  -- field itself would catch.
  if v_bore <= 0.31115 or v_bore >= 0.315341 then
    raise exception 'DR7 go-live refused: the effective open hole bore of % is outside the bit size of 0.31115 and the casing bore of 0.315341, so the excess was applied to the wrong quantity', v_bore;
  end if;

  select (f->>'expected')::numeric into v_minr from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='cementing' and f->>'key'='min_rate_no_free_fall_m3s';
  select (f->>'expected')::numeric into v_maxr from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='cementing' and f->>'key'='max_rate_under_ecd_limit_m3s';
  select (f->>'expected')::numeric into v_width from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='cementing' and f->>'key'='rate_window_width_m3s';
  select (f->>'expected')::numeric into v_ecd from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='cementing' and f->>'key'='max_ecd_prev_shoe_kgm3';
  select (f->>'expected')::numeric into v_endp from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='cementing' and f->>'key'='end_pump_pressure_pa';
  select (f->>'expected')::numeric into v_float from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='cementing' and f->>'key'='float_diff_pa';
  if v_minr is null or v_maxr is null or v_width is null or v_ecd is null
     or v_endp is null or v_float is null then
    raise exception 'DR7 go-live refused: one or more of the six Professional placement fields is missing';
  end if;

  -- THE RATE WINDOW, AS A PAIR WHERE ONE INEQUALITY MUST HOLD AND THE OTHER
  -- MUST FAIL. The width is the difference of the two edges, exactly. The
  -- window must be CLOSED, because a capstone whose window was open would take
  -- the whole of Professional m04's argument away from it. AND the design rate
  -- of 0.028 must sit INSIDE the ECD constraint, because the point of this
  -- capstone is that it is FREE FALL rather than fracturing that makes the job
  -- impossible. If both inequalities went the same way, the capstone would be
  -- a job that simply cannot be pumped for either reason, which teaches less.
  if abs((v_maxr - v_minr) - v_width) > 0.0000005 then
    raise exception 'DR7 go-live refused: the two rate edges differ by % against a reported window width of %', v_maxr - v_minr, v_width;
  end if;
  if v_width >= 0 then
    raise exception 'DR7 go-live refused: the Professional rate window is % and must be NEGATIVE; a capstone whose window is open leaves Professional m04 with no worked case', v_width;
  end if;
  if v_maxr <= 0.028 then
    raise exception 'DR7 go-live refused: the fastest rate under the ECD limit is % and must EXCEED the design rate of 0.028, because on this capstone it is free fall and not fracturing that closes the window', v_maxr;
  end if;
  if v_ecd >= 1600 then
    raise exception 'DR7 go-live refused: the peak ECD at the previous shoe is % and must be BELOW the stated leak-off of 1600, for the same reason', v_ecd;
  end if;
  if v_endp <= v_float then
    raise exception 'DR7 go-live refused: the end pump pressure of % does not exceed the float differential of %, so the friction at the last step has come out negative', v_endp, v_float;
  end if;

  select (f->>'expected')::numeric into v_so from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='cementing' and f->>'key'='min_standoff';
  select (f->>'expected')::numeric into v_soc from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='cementing' and f->>'key'='standoff_at_centralizer_at_min';
  select (f->>'expected')::numeric into v_rigid from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='cementing' and f->>'key'='min_standoff_rigid';
  select (f->>'expected')::numeric into v_req from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='cementing' and f->>'key'='required_spacing_m';
  select (f->>'expected')::numeric into v_k from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='cementing' and f->>'key'='centralizer_spring_rate_n_per_m';
  if v_so is null or v_soc is null or v_rigid is null or v_req is null or v_k is null then
    raise exception 'DR7 go-live refused: one or more of the Expert centralization fields is missing';
  end if;

  -- THE SAG ASSERTION. The reported minimum standoff is the mid-span value and
  -- the value at the centralizer is larger, ALWAYS, because the sag is never
  -- negative. If a later edit made them equal, the sag term would have been
  -- lost and the whole of Expert m03 would be teaching something the capstone
  -- denies. The gap must also be real rather than a rounding artefact.
  if v_so > v_soc then
    raise exception 'DR7 go-live refused: the reported minimum standoff of % exceeds the value at the centralizer of %, which is impossible while the sag is non-negative', v_so, v_soc;
  end if;
  if (v_soc - v_so) < 0.001 then
    raise exception 'DR7 go-live refused: the mid-span standoff is within a thousandth of the value at the centralizer, so the sag term has been lost and Expert m03 has no worked case';
  end if;

  -- A SECOND PAIR WHERE ONE MUST PASS AND THE OTHER MUST FAIL. The bow spring
  -- must clear the API 67 percent target and the rigid blade must NOT, because
  -- Expert m02's argument is that a fixed blade is capped by its own ratio
  -- while a spring is not. If both passed, the comparison would have nothing
  -- to compare; if both failed, the capstone would say a bow spring cannot
  -- centralize this string, which is the opposite of what it teaches.
  if v_so < 0.67 then
    raise exception 'DR7 go-live refused: the bow spring standoff of % fails the API 67 percent target, and Expert m02 needs it to pass', v_so;
  end if;
  if v_rigid >= 0.67 then
    raise exception 'DR7 go-live refused: the rigid blade standoff of % clears the API 67 percent target, and Expert m02 needs it to FAIL so the blade-ratio ceiling has something to demonstrate', v_rigid;
  end if;

  -- THE REQUIRED SPACING must exceed the 10.5 m the capstone runs, because the
  -- bow spring passes. A bisection returning less than the spacing being run
  -- would mean the profile and the verdict disagree.
  if v_req <= 10.5 then
    raise exception 'DR7 go-live refused: the required spacing of % is at or below the 10.5 m the capstone runs, which contradicts the bow spring passing the target', v_req;
  end if;

  -- THE SPRING RATE must return the stated restoring force when multiplied
  -- back by (1 - 0.67) and the NOMINAL open hole clearance of 0.0333375 m.
  -- Using the 30 percent excess clearance instead would give about 787000
  -- rather than about 1000000, and no tolerance on the field would catch it.
  if abs(v_k * 0.33 * 0.0333375 - 11000) > 1 then
    raise exception 'DR7 go-live refused: the spring rate of % does not return 11000 N at the nominal open hole clearance, so the excess-inflated clearance was probably used instead', v_k;
  end if;

  -- THE UNITS ASSERTION. Volumes in cubic metres, pressures in pascals, rates
  -- in cubic metres a second, and one density in kg/m3.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug='cementing'
     and f->>'key' in ('annulus_slurry_m3','shoe_track_m3','slurry_m3','displacement_m3')
     and f->>'unit' = 'm3';
  if v_graded <> 4 then
    raise exception 'DR7 go-live refused: % of the 4 Associate volume fields are graded in cubic metres', v_graded;
  end if;
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug='cementing'
     and f->>'key' in ('min_rate_no_free_fall_m3s','max_rate_under_ecd_limit_m3s','rate_window_width_m3s')
     and f->>'unit' = 'm3/s';
  if v_graded <> 3 then
    raise exception 'DR7 go-live refused: % of the 3 Professional rate fields are graded in cubic metres a second', v_graded;
  end if;

  -- TIER SEPARATION. Each tier grades its own three signature quantities.
  select count(*) into v_graded from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug='cementing' and c.tier='beginner'
     and f->>'key' in ('annulus_slurry_m3','sacks','open_hole_effective_bore_m');
  if v_graded <> 3 then
    raise exception 'DR7 go-live refused: the Associate capstone grades % of its 3 volume-sheet fields', v_graded;
  end if;
  select count(*) into v_graded from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug='cementing' and c.tier='intermediate'
     and f->>'key' in ('max_ecd_prev_shoe_kgm3','min_rate_no_free_fall_m3s','rate_window_width_m3s');
  if v_graded <> 3 then
    raise exception 'DR7 go-live refused: the Professional capstone grades % of its 3 placement fields', v_graded;
  end if;
  select count(*) into v_graded from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug='cementing' and c.tier='advanced'
     and f->>'key' in ('min_standoff','required_spacing_m','min_standoff_rigid');
  if v_graded <> 3 then
    raise exception 'DR7 go-live refused: the Expert capstone grades % of its 3 centralization fields', v_graded;
  end if;

  if not exists (select 1 from public.academy_apps where slug='cementing' and module='drilling') then
    raise exception 'DR7 go-live refused: cementing catalog row is missing or not mapped to the drilling module';
  end if;
  if not exists (select 1 from public.academy_apps where slug='cementing' and path_order=24) then
    raise exception 'DR7 go-live refused: cementing is not at path_order 24, which is its place in the Drilling and Completions ladder';
  end if;
end
$$;

update public.academy_apps set status = 'available' where slug = 'cementing';
