-- ============================================================================
-- DR8 GO LIVE (HELD): make Completion Design enrollable.
--
-- DO NOT APPLY until a NextGen production upload carries the
-- CompletionLearningPage route (/dashboard/apps/completion) and the deep course
-- routes. RC1 through RC7 and DR1 through DR7 are held on the SAME gate.
--
-- Precondition checklist:
--   1. nextgen.petrolord.com serves a build containing /dashboard/apps/completion.
--   2. academy_course_structures has three active completion rows.
--   3. academy_quiz_questions holds 396 completion rows (132 per tier).
--   4. academy_capstones holds the three completion rows.
--
-- Every assertion below is written from the ENGINE's output rather than from
-- the intuition the capstone prompts were written with, which is the lesson
-- DR7's go-live proof taught when its first clean run refused on a bound that
-- asserted the course's own finding away.
-- ============================================================================

do $$
declare
  v_structures integer;
  v_capstones  integer;
  v_questions  integer;
  v_graded     integer;
  v_bottom     numeric;
  v_packer     numeric;
  v_dliner     numeric;
  v_dsurf      numeric;
  v_cap        numeric;
  v_disp       numeric;
  v_worst      numeric;
  v_spm        numeric;
  v_tbmin      numeric;
  v_tbpkr      numeric;
  v_ann        numeric;
  v_below      numeric;
  v_availup    numeric;
  v_availdn    numeric;
  v_remup      numeric;
  v_remdn      numeric;
  v_mininsert  numeric;
  v_minpbr     numeric;
  c_in         constant numeric := 0.0254;
begin
  select count(*) into v_structures
    from public.academy_course_structures where app_slug = 'completion' and active;
  if v_structures <> 3 then
    raise exception 'DR8 go-live refused: completion has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions
    from public.academy_quiz_questions where app_slug = 'completion';
  if v_questions <> 396 then
    raise exception 'DR8 go-live refused: completion has % quiz questions, expected 396 (132 per tier)', v_questions;
  end if;

  select count(*) into v_capstones
    from public.academy_capstones where app_slug = 'completion';
  if v_capstones <> 3 then
    raise exception 'DR8 go-live refused: completion has % capstones, expected 3', v_capstones;
  end if;

  -- THE SCOPE ASSERTION. Six families of thing are taught in Expert m05 and
  -- certified nowhere: deviation and doglegs, running mechanics and drag, the
  -- thermal and pressure length changes themselves, buckling, time (scale,
  -- corrosion, elastomer degradation, wear) and flow. For each of them this
  -- engine has no input that could produce the answer. A course that TEACHES a
  -- topic says it is worth knowing about; one that GRADES it says the learner
  -- can produce the answer AND that the answer is worth producing. This
  -- migration keeps those two claims apart. Note what is deliberately NOT on
  -- the list: elongation and contraction ARE graded, because the Expert tier
  -- takes them as inputs from Casing and Tubing Design and grades only the
  -- geometry that follows from them.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'completion'
     and (f->>'key' ilike '%dogleg%'
       or f->>'key' ilike '%inclination%'
       or f->>'key' ilike '%deviation%'
       or f->>'key' ilike '%survey%'
       or f->>'key' ilike '%drag%'
       or f->>'key' ilike '%hook%'
       or f->>'key' ilike '%friction%'
       or f->>'key' ilike '%temperature%'
       or f->>'key' ilike '%thermal%'
       or f->>'key' ilike '%buckl%'
       or f->>'key' ilike '%scale%'
       or f->>'key' ilike '%corros%'
       or f->>'key' ilike '%erosion%'
       or f->>'key' ilike '%velocity%'
       or f->>'key' ilike '%rate%'
       or f->>'key' ilike '%stress%'
       or f->>'key' ilike '%tvd%');
  if v_graded <> 0 then
    raise exception 'DR8 go-live refused: % capstone field(s) grade a quantity this geometry-only engine cannot produce or should not certify; Expert m05 teaches six such families and certifies none of them', v_graded;
  end if;

  -- THE PUBLISHED-GOLDEN ASSERTION, WHICH DR4 EARNED. The pairwise collision
  -- test catches two graded fields colliding with EACH OTHER; it does NOT
  -- catch a graded field colliding with a value the GOLDENS PUBLISH, which
  -- would turn a calculation into a lookup. Ten of this course's most quotable
  -- published values are checked by name here, and the full sweep over every
  -- number completion_cases.json publishes is asserted in completionLab.test.js.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'completion'
     and (abs((f->>'expected')::numeric - 2606.25) < 0.0000005              -- published string bottom
       or abs((f->>'expected')::numeric - 2600.5) < 0.0000005               -- published packer depth
       or abs((f->>'expected')::numeric - 0.0046736) < 0.00000005           -- published tightest clearance
       or abs((f->>'expected')::numeric - 0.10222865000000002) < 0.00000005 -- published first-row clearance
       or abs((f->>'expected')::numeric - 0.066929) < 0.00000005            -- published through bore
       or abs((f->>'expected')::numeric - 11.818033334715857) < 0.0000005   -- published string capacity
       or abs((f->>'expected')::numeric - 26.77123794995821) < 0.0000005    -- published string displacement
       or abs((f->>'expected')::numeric - 67.85040666426387) < 0.0000005    -- published annulus above packer
       or abs((f->>'expected')::numeric - 7.694446290083848) < 0.0000005    -- published volume below packer
       or abs((f->>'expected')::numeric - 3.1) < 0.0000005);                -- published available elongation
  if v_graded <> 0 then
    raise exception 'DR8 go-live refused: % graded field(s) sit within tolerance of a value the goldens publish, which makes them a lookup rather than a calculation', v_graded;
  end if;

  select (f->>'expected')::numeric into v_bottom from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='completion' and f->>'key'='bottom_md_m';
  select (f->>'expected')::numeric into v_packer from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='completion' and f->>'key'='packer_bottom_md_m';
  select (f->>'expected')::numeric into v_dliner from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='completion' and f->>'key'='drift_liner_m';
  select (f->>'expected')::numeric into v_dsurf from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='completion' and f->>'key'='drift_surface_casing_m';
  select (f->>'expected')::numeric into v_cap from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='completion' and f->>'key'='string_capacity_m3';
  select (f->>'expected')::numeric into v_disp from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='completion' and f->>'key'='string_displacement_m3';
  if v_bottom is null or v_packer is null or v_dliner is null or v_dsurf is null
     or v_cap is null or v_disp is null then
    raise exception 'DR8 go-live refused: one or more of the six Associate fields is missing';
  end if;

  -- THE TELESCOPING IDENTITY. The hanger is at surface, so the bottom depth is
  -- the sum of the fourteen component lengths and nothing else can change it.
  if abs(v_bottom - (180 + 0.9 + 2.2 + 0.9 + 2100 + 6.1 + 2.4 + 300 + 0.4 + 1.5 + 2.5 + 0.45 + 3.0 + 0.3)) > 0.0000005 then
    raise exception 'DR8 go-live refused: the string bottom of % is not the sum of the fourteen component lengths', v_bottom;
  end if;
  -- The packer bottom must sit exactly the length of the four components below
  -- it above the string bottom: 2.5 + 0.45 + 3.0 + 0.3.
  if abs((v_bottom - v_packer) - 6.25) > 0.0000005 then
    raise exception 'DR8 go-live refused: the packer bottom of % is % above the string bottom, and the four components below it are 6.25 m', v_packer, v_bottom - v_packer;
  end if;
  if v_disp <= v_cap then
    raise exception 'DR8 go-live refused: the string displacement of % does not exceed the capacity of %, so a component has its diameters the wrong way round', v_disp, v_cap;
  end if;

  -- THE DRIFT CLASS ASSERTION, AS A PAIR OF EQUALITIES OF WHICH ONE MUST CLOSE
  -- AND THE OTHER MUST NOT. The 13-3/8 inch surface casing sits EXACTLY on a
  -- class boundary, and the ranges are inclusive at the top, so it takes the
  -- 5/32 inch deduction and NOT the 3/16 inch one. No row in any real catalog
  -- exercises that comparison, so an off-by-one in the classification would
  -- survive every test written from the catalog and would show up here as a
  -- drift a thirty second of an inch too small. Asserting only the 5/32 form
  -- would pass on an engine that had quietly moved the boundary; asserting
  -- that the 3/16 form does NOT hold is what catches it.
  if abs(v_dsurf - (12.415 * c_in - (5.0/32.0) * c_in)) > 0.00000005 then
    raise exception 'DR8 go-live refused: the 13-3/8 inch surface casing drift of % is not its bore less the 5/32 inch deduction, so the inclusive class boundary has been read as exclusive', v_dsurf;
  end if;
  if abs(v_dsurf - (12.415 * c_in - (3.0/16.0) * c_in)) < 0.00000005 then
    raise exception 'DR8 go-live refused: the 13-3/8 inch surface casing drift of % equals its bore less the 3/16 inch deduction, which puts a boundary size in the class ABOVE it', v_dsurf;
  end if;
  if abs(v_dliner - (6.094 * c_in - (1.0/8.0) * c_in)) > 0.00000005 then
    raise exception 'DR8 go-live refused: the 7 inch liner drift of % is not its bore less the 1/8 inch deduction', v_dliner;
  end if;
  -- And the two must sit in DIFFERENT classes, which is the whole point of
  -- grading both. If a later edit gave them the same deduction, module 2 would
  -- lose its worked boundary case.
  if abs((12.415 * c_in - v_dsurf) - (6.094 * c_in - v_dliner)) < 0.00000005 then
    raise exception 'DR8 go-live refused: the surface casing and the liner take the same drift deduction, so the Associate capstone no longer exercises two classes';
  end if;

  select (f->>'expected')::numeric into v_worst from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='completion' and f->>'key'='worst_clearance_m';
  select (f->>'expected')::numeric into v_spm from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='completion' and f->>'key'='spm_clearance_m';
  select (f->>'expected')::numeric into v_tbmin from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='completion' and f->>'key'='through_bore_min_id_m';
  select (f->>'expected')::numeric into v_tbpkr from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='completion' and f->>'key'='through_bore_at_packer_id_m';
  select (f->>'expected')::numeric into v_ann from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='completion' and f->>'key'='annulus_above_packer_m3';
  select (f->>'expected')::numeric into v_below from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='completion' and f->>'key'='below_packer_m3';
  if v_worst is null or v_spm is null or v_tbmin is null or v_tbpkr is null
     or v_ann is null or v_below is null then
    raise exception 'DR8 go-live refused: one or more of the six Professional fields is missing';
  end if;

  -- THE WORST ROW ASSERTION, WHICH IS THE DEFECT THIS COURSE FOUND, TURNED
  -- INTO A GATE. The worst clearance must be no larger than the side pocket
  -- mandrel's, because the mandrel is one of the fourteen rows. Under the OLD
  -- status-only ranking the worst row on this string would have been the first
  -- tubing joint, whose clearance is far larger than the mandrel's, so this one
  -- inequality refuses a regression of the exact defect the course teaches.
  if v_worst > v_spm then
    raise exception 'DR8 go-live refused: the worst clearance of % exceeds the side pocket mandrel clearance of %, so the worst-row selection has degenerated to a row that is not the tightest', v_worst, v_spm;
  end if;
  -- The two tight rows share a governing drift, so their clearances differ by
  -- EXACTLY the difference of the two outside diameters, 5.875 less 5.0 inches.
  -- If a later edit checked one of them against a different string, this closes
  -- no longer.
  if abs((v_spm - v_worst) - (5.875 - 5.0) * c_in) > 0.00000005 then
    raise exception 'DR8 go-live refused: the mandrel and the worst row differ by % rather than by the 0.875 inch difference in their outside diameters, so they are not governed by the same drift', v_spm - v_worst;
  end if;

  -- A PAIR WHERE ONE INEQUALITY MUST HOLD AND THE OTHER MUST FAIL. The capstone
  -- packer must WARN: strictly positive, so the string goes, and strictly below
  -- the 0.003 m warn margin, so it goes with less room than the design wants.
  -- The published completion's packer PASSES at 0.0046736 on a 29 lb/ft liner,
  -- and the capstone is tighter only because its liner is 32 lb/ft. If a later
  -- edit made the capstone pass outright, Professional m02 would lose the one
  -- worked case where the tightest row is not comfortable; if it made it fail,
  -- the capstone would be a string that cannot be run at all, which teaches
  -- less than one that can be run and should be argued about.
  if v_worst <= 0 then
    raise exception 'DR8 go-live refused: the worst clearance of % is not positive, so the capstone string cannot be run and Professional m02 has no argument left', v_worst;
  end if;
  if v_worst >= 0.003 then
    raise exception 'DR8 go-live refused: the worst clearance of % clears the 0.003 m warn margin, and the capstone needs its tightest row to WARN so that the tighter liner has something to demonstrate', v_worst;
  end if;

  -- THE THROUGH BORE PAIR. The running minimum can only step down, so the value
  -- at the packer must be at least the minimum over the whole string, and on
  -- this capstone it must be STRICTLY larger by a real margin, because the XN
  -- no-go nipple sits BELOW the packer. A capstone where the two were equal
  -- would put the controlling restriction above the packer and take Professional
  -- m03's extreme-versus-extent argument away from it.
  if v_tbpkr < v_tbmin then
    raise exception 'DR8 go-live refused: the through bore at the packer of % is smaller than the minimum over the string of %, which is impossible for a running minimum', v_tbpkr, v_tbmin;
  end if;
  if (v_tbpkr - v_tbmin) < 0.002 then
    raise exception 'DR8 go-live refused: the through bore at the packer is within 2 mm of the string minimum, so the controlling restriction is no longer below the packer and Professional m03 has no worked case';
  end if;
  -- The controlling restriction is the XN no-go bore of 2.205 inches and the
  -- value at the packer is the X seat bore of 2.313, both exactly.
  if abs(v_tbmin - 2.205 * c_in) > 0.00000005 then
    raise exception 'DR8 go-live refused: the minimum through bore of % is not the 2.205 inch XN no-go bore', v_tbmin;
  end if;
  if abs(v_tbpkr - 2.313 * c_in) > 0.00000005 then
    raise exception 'DR8 go-live refused: the through bore at the packer of % is not the 2.313 inch X seat bore', v_tbpkr;
  end if;
  -- The annulus is the largest of the four volumes by a wide margin, and it must
  -- dwarf both the string capacity and the volume below the packer.
  if v_ann <= 5 * v_cap or v_ann <= v_below then
    raise exception 'DR8 go-live refused: the annulus above the packer of % is not the largest volume by the expected margin against a capacity of % and a below-packer volume of %', v_ann, v_cap, v_below;
  end if;

  select (f->>'expected')::numeric into v_availup from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='completion' and f->>'key'='available_elongation_m';
  select (f->>'expected')::numeric into v_availdn from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='completion' and f->>'key'='available_contraction_m';
  select (f->>'expected')::numeric into v_remup from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='completion' and f->>'key'='remaining_elongation_m';
  select (f->>'expected')::numeric into v_remdn from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='completion' and f->>'key'='remaining_contraction_m';
  select (f->>'expected')::numeric into v_mininsert from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='completion' and f->>'key'='min_insertion_both_pass_m';
  select (f->>'expected')::numeric into v_minpbr from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='completion' and f->>'key'='min_pbr_length_m';
  if v_availup is null or v_availdn is null or v_remup is null or v_remdn is null
     or v_mininsert is null or v_minpbr is null then
    raise exception 'DR8 go-live refused: one or more of the six Expert fields is missing';
  end if;

  -- THE BUDGET IDENTITY, WHICH IS THE WHOLE EXPERT TIER IN ONE LINE. The two
  -- available travels sum to the receptacle length at every landing, so if this
  -- does not close the two directions have been computed from different bores.
  if abs((v_availup + v_availdn) - 5.35) > 0.0000005 then
    raise exception 'DR8 go-live refused: the two available travels sum to % rather than to the 5.35 m polished bore, so the landing is creating or destroying travel', v_availup + v_availdn;
  end if;
  -- Contraction consumes the insertion depth ITSELF, so the available travel
  -- against it is the 2.28 m as landed. Elongation consumes what is below the
  -- seals. Swapping the two is the single most likely error in the tier, and
  -- it would leave the sum above unchanged, so it needs its own assertion.
  if abs(v_availdn - 2.28) > 0.0000005 then
    raise exception 'DR8 go-live refused: the available contraction travel of % is not the 2.28 m insertion depth, so the two directions have been swapped', v_availdn;
  end if;
  if abs(v_remup - (v_availup - 0.65)) > 0.0000005 then
    raise exception 'DR8 go-live refused: the elongation remaining of % is not the available travel of % less the 0.65 m case', v_remup, v_availup;
  end if;
  if abs(v_remdn - (v_availdn - 3.15)) > 0.0000005 then
    raise exception 'DR8 go-live refused: the contraction remaining of % is not the available travel of % less the 3.15 m case', v_remdn, v_availdn;
  end if;

  -- A PAIR OF INEQUALITIES OF WHICH ONE MUST PASS AND THE OTHER MUST FAIL. The
  -- elongation case must clear the 0.4 m margin and the contraction case must
  -- come out NEGATIVE. The Expert capstone's whole point is a landing that is
  -- comfortable in one direction and outside the bore in the other, which is
  -- what makes the band worth computing. If both passed there would be nothing
  -- to fix; if both failed the bore would be too short and the band empty, and
  -- fields 5 and 6 would have no answer.
  if v_remup <= 0.4 then
    raise exception 'DR8 go-live refused: the elongation remaining of % does not clear the 0.4 m margin, and the Expert capstone needs that direction to PASS', v_remup;
  end if;
  if v_remdn >= 0 then
    raise exception 'DR8 go-live refused: the contraction remaining of % is not negative, and the Expert capstone needs that direction to FAIL so that the band has something to correct', v_remdn;
  end if;

  -- THE BAND. Its lower edge is the contraction case plus the margin, exactly,
  -- and it must sit DEEPER than the landing as given, because the landing as
  -- given fails one case. The shortest usable bore is the whole swing plus
  -- TWICE the margin, once at each end, and it must be shorter than the 5.35 m
  -- actually run, because this capstone's band is open and the learner is
  -- expected to find it.
  if abs(v_mininsert - (3.15 + 0.4)) > 0.0000005 then
    raise exception 'DR8 go-live refused: the smallest insertion at which both cases pass is % rather than the 3.15 m contraction case plus the 0.4 m margin, so it was taken from the wrong case', v_mininsert;
  end if;
  if v_mininsert <= 2.28 then
    raise exception 'DR8 go-live refused: the smallest acceptable insertion of % is at or above the 2.28 m as landed, which contradicts the contraction case failing', v_mininsert;
  end if;
  if abs(v_minpbr - (0.65 + 3.15 + 2 * 0.4)) > 0.0000005 then
    raise exception 'DR8 go-live refused: the shortest usable bore of % is not the 3.8 m swing plus twice the 0.4 m margin, so one margin has been dropped', v_minpbr;
  end if;
  if v_minpbr >= 5.35 then
    raise exception 'DR8 go-live refused: the shortest usable bore of % is at or above the 5.35 m being run, which would make the band empty and leave field 5 with no answer', v_minpbr;
  end if;

  -- THE UNITS ASSERTION. Depths, drifts, clearances, bores and travels in
  -- metres; volumes in cubic metres. Nothing in this course is graded in inches.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug='completion' and f->>'unit' in ('m', 'm3');
  if v_graded <> 18 then
    raise exception 'DR8 go-live refused: % of the 18 graded fields are in metres or cubic metres, and this course grades nothing in any other unit', v_graded;
  end if;
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug='completion'
     and f->>'key' in ('string_capacity_m3','string_displacement_m3','annulus_above_packer_m3','below_packer_m3')
     and f->>'unit' = 'm3';
  if v_graded <> 4 then
    raise exception 'DR8 go-live refused: % of the 4 volume fields are graded in cubic metres', v_graded;
  end if;

  -- TIER SEPARATION. Each tier grades its own three signature quantities.
  select count(*) into v_graded from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug='completion' and c.tier='beginner'
     and f->>'key' in ('bottom_md_m','drift_surface_casing_m','string_capacity_m3');
  if v_graded <> 3 then
    raise exception 'DR8 go-live refused: the Associate capstone grades % of its 3 tally-and-drift fields', v_graded;
  end if;
  select count(*) into v_graded from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug='completion' and c.tier='intermediate'
     and f->>'key' in ('worst_clearance_m','through_bore_min_id_m','annulus_above_packer_m3');
  if v_graded <> 3 then
    raise exception 'DR8 go-live refused: the Professional capstone grades % of its 3 fit-and-volume fields', v_graded;
  end if;
  select count(*) into v_graded from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug='completion' and c.tier='advanced'
     and f->>'key' in ('available_contraction_m','remaining_contraction_m','min_pbr_length_m');
  if v_graded <> 3 then
    raise exception 'DR8 go-live refused: the Expert capstone grades % of its 3 space-out fields', v_graded;
  end if;

  if not exists (select 1 from public.academy_apps where slug='completion' and module='drilling') then
    raise exception 'DR8 go-live refused: completion catalog row is missing or not mapped to the drilling module';
  end if;
  if not exists (select 1 from public.academy_apps where slug='completion' and path_order=25) then
    raise exception 'DR8 go-live refused: completion is not at path_order 25, which is its place in the Drilling and Completions ladder';
  end if;
end
$$;

update public.academy_apps set status = 'available' where slug = 'completion';
