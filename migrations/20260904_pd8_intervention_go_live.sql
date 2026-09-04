-- ============================================================================
-- PD8 GO-LIVE (HELD): Well Intervention flips to 'available'. This is the
-- EIGHTH Production & Artificial Lift course, behind 'nodal' at path_order 37.
--
-- THIS MIGRATION IS HELD. Do NOT run it until a NextGen production upload
-- carries the route /dashboard/apps/intervention. That upload is the gate, and
-- nothing else releases this file.
--
-- Every assertion below is written from the ENGINE's behaviour rather than
-- from the seed, and every number in it was RECOMPUTED from the stated
-- conditions before it was written down. THE RECOMPUTATION IS IN THIS FILE.
-- The two histories are rebuilt here from the capstone's own closed forms,
-- and every fit is re-run through PostgreSQL's own regr_slope, regr_intercept
-- and regr_r2 aggregates, which share no code and no reasoning with the
-- engine's hand-written accumulation loop. Two independent least-squares
-- implementations agreeing on fourteen fitted values is evidence about the
-- filter, the window and the column selection rather than about either
-- implementation. The four fields that need no history, the geometry group,
-- its floor and the two multipliers, are recomputed as CLOSED FORMS from the
-- radii and the skins, so no magic number stands anywhere a formula could.
--
-- A separate pass outside this file re-derived all eighteen from the same
-- conditions in a third language before a line of it was written, and all
-- eighteen agreed inside their own grading tolerances, the worst by 5.0e-10
-- of a tolerance on the late-window ratio fit quality. NOTHING DISAGREED. On
-- PD4 two of thirty-five assertions were wrong on the first pass and only a
-- numeric re-verification found them, which is why that pass is now the rule
-- rather than a courtesy.
--
-- Most assertions are PAIRS, because a one-sided check passes on a capstone
-- quietly recut into the mistake the course exists to correct.
--
-- THE PAIR THAT MATTERS MOST IS THE EVIDENCE THAT WAS THROWN AWAY. The
-- discarded post-choke stretch must have a NEGATIVE ratio slope, and its own
-- fit quality must be BETTER than the fit quality of the verdict the engine
-- actually gave. Both, or the centre of the Expert tier is gone. Asserting
-- only that some samples were dropped would pass on a capstone where the
-- dropped stretch was noise, which is what a filter is FOR. Asserting only
-- that the dropped fit is clean would pass on a stretch still climbing, which
-- argues nothing. The two together are the claim: this well was beaned back,
-- its water-oil ratio turned back down, that is the coning field test and the
-- coning answer, it fits more cleanly than the channelling verdict that was
-- reported, and the engine computed the count of those samples and then threw
-- the count away on a branch this case never reaches.
--
-- THE SECOND PAIR IS THE HAIR THE VERDICT SITS ON, AND IT IS A PAIR BECAUSE
-- ONE SIDE ALONE IS EITHER TRIVIAL OR ARBITRARY. The graded derivative slope
-- must sit ABOVE the channelling threshold, so the well is treatable, AND the
-- margin must be smaller than the movement the window dial produces on the
-- same data by more than a factor of ten. A capstone that cleared the
-- threshold comfortably would make the dial a curiosity. A capstone that sat
-- below it would have no spend to lose. This one clears by a hundredth and
-- the dial moves it by two tenths, so the analyst's undocumented choice is
-- worth an order of magnitude more than the evidence.
--
-- THE THIRD PAIR IS THAT ONE SERIES GIVES TWO MECHANISMS. The derivative
-- slope at the short window must sit ABOVE the channelling threshold and the
-- slope at the long window must sit BELOW it, on the same 46 samples with not
-- one datum changed. Either alone is a number. The two together are the
-- finding, because above the threshold the water shutoff is a candidate and
-- below it the same screening blocks it outright.
--
-- THE FOURTH PAIR IS THE SPAN THE DROP COST. The derivative fit's reported
-- span at the graded window must clear the module's own minimum, so the
-- reading is not refused, AND it must fall SHORT of the log-cycle span of the
-- window it is named for by exactly the log time the dropped samples carried.
-- And the same drop is asserted at the short window, where it nearly costs
-- the reading outright: the fit clears refusal by under two hundredths of a
-- log cycle and would have cleared by more than two tenths had nothing been
-- dropped. That is the compounding cost stated as arithmetic rather than as
-- an adjective.
--
-- THE FIFTH PAIR IS THE FAILS-OPEN, AND IT IS ASSERTED FROM BOTH ENDS. The
-- gas history's derivative column is null on every row, so the late window
-- must contain ZERO negative derivatives and every one of its rows must
-- coerce to a derivative of exactly zero, which is precisely the flat
-- branch's condition. And the SAME return object must carry a ratio slope
-- that is strictly POSITIVE at a fit quality above nine tenths, on a ratio
-- that climbs by more than a factor of two and a half across the very window
-- the engine calls flat. One without the other is half the defect: the first
-- alone says a branch fired, the second alone says a ratio climbed. Together
-- they say the engine contradicted itself inside one object, on the fluid its
-- own gas reasoning sends the user to, because of one JavaScript spelling.
--
-- AND THE SIXTH IS THE GUARD IN THE WRONG PLACE, WHICH TAKES THREE. The
-- overreached design must be ACCEPTED, so its denominator is strictly
-- positive and nothing refuses it; it must sit BELOW everything the module's
-- own refusal text calls a real treatment; and the multiplier it hands back
-- must be more than six times the honest acid job's. All three, or the
-- finding collapses into "a big number came out". A fourth assertion closes
-- it from the other side: the guard DOES fire, at the pole, on a request a
-- little deeper, so this is a guard in the wrong place rather than a missing
-- guard. And a fifth reproduces the refusal message's own arithmetic on this
-- geometry: the floor and the deepest request the geometry still accepts
-- round to the SAME one decimal place, so the refusal sentence compares a
-- number against itself and a reader cannot tell from it what was refused.
--
-- WHAT IS NOT GRADEABLE IS NOT GRADED, AND THAT IS ITSELF A GATE. Every
-- verdict this module returns is a string or a boolean: the mechanism id, the
-- confidence, the ambiguous flag, seven treatment verdicts and every block
-- reason. None of them can be graded and none of them is. So the file asserts
-- the numbers UNDERNEATH each verdict together with the threshold each was
-- compared against, which is the only way a classifier with no golden can be
-- pinned down at all. It also asserts the thresholds themselves, because the
-- whole course rests on them being round boundaries between pictures rather
-- than measurements, and a settings override that moved one would silently
-- move every verdict in the course.
--
-- WHAT THE WINDOWS ARE SIZED ON, AND WHY THERE ARE THREE.
--
--   SMALL GROUP, the eleven graded values below 2: eight slopes, two fit
--   qualities and a span. Largest grader tolerance 3.0e-6. Nearest guarded
--   published neighbour 9.12572e-5, the late derivative fit quality of
--   0.99884736 against the teaching constant-derivative demonstration's ratio
--   fit quality of 0.99875610. A window of 2e-5 therefore sits 6.67 TIMES
--   ABOVE the largest tolerance it covers and 4.56 TIMES BELOW the nearest
--   neighbour it must not catch. That is the tightest group in the course and
--   it is tight for a structural reason worth naming: this module returns
--   slopes and fit qualities, most real slopes here land between one half and
--   one and a half, and most real fit qualities land just under one, so the
--   published values crowd the same narrow bands the graded ones do.
--
--   MIDDLE GROUP, the six graded values between 2 and 100: an intercept, a
--   span, the geometry group, its floor and the two multipliers. Largest
--   grader tolerance 4.0e-5. Nearest guarded neighbour 2.7452e-3, the
--   full-history span of 2.08218676 log cycles against the published power
--   law's ln 8 of 2.07944154. A window of 3e-4 sits 7.50 TIMES ABOVE the
--   largest tolerance and 9.15 TIMES BELOW that neighbour.
--
--   LARGE GROUP, the one graded value at 100 or above: the start of the late
--   window in days, and it is the ONLY dimensional number this whole module
--   returns. Grader tolerance 5.0e-4. Nearest guarded neighbour 2.12851, the
--   window start of 202.12851 days against the published coning history's tau
--   of 200. A window of 0.05 sits 100 TIMES ABOVE the tolerance and 42.6
--   TIMES BELOW that neighbour.
--
-- TWO APPROACHES ARE COINCIDENCES OF MAGNITUDE AND NOT LOOKUPS, AND THEY ARE
-- NAMED HERE RATHER THAN LEFT FOR SOMEBODY TO FIND. The overreached
-- multiplier of 18.01216 sits 0.01216 from the round number 18, and the
-- late-window derivative slope of 1.31265 sits 0.01265 from the CHANNELLING
-- THRESHOLD of 1.3 itself. The second is the sharper of the two and it is not
-- an accident at all: it is the capstone condition that the verdict sits on a
-- hair, and the distance is the margin the course is about. It is also 4217
-- TIMES the tolerance that field is graded to, so a learner who wrote the
-- threshold down instead of fitting the derivative fails by more than three
-- orders of magnitude, and it is 632 times the 2e-5 window that field's
-- magnitude group is guarded with below. The eighteen graded values were
-- swept against 2266 published numbers, the goldens and the teaching digest
-- together, with ZERO collisions inside any window above and no approach
-- closer than 45.6 times a field's own grading tolerance.
--
-- A GATE THIS COURSE ADDS TO THE PERMANENT SET, AND IT IS THE THESIS AS SQL.
-- A DIAGNOSTIC SIZES NOTHING, SO NO GRADED FIELD MAY CARRY A DIMENSION THIS
-- MODULE DOES NOT RETURN. The only dimensional return in the whole engine is
-- the start of the late window in days. Everything else is a slope, a fit
-- quality, a span or a dimensionless group. So the gate is written on the
-- UNIT: a graded field whose unit is a rate, a volume, a pressure, a
-- temperature, a permeability, a length or a currency is refused outright,
-- because a course that certified one would be certifying a number its engine
-- never computed. A second half of the same gate refuses any graded field
-- whose label names a mechanism, a confidence, a verdict or a block reason,
-- because those are strings and booleans and grading them at a numeric
-- tolerance would be a category error.
--
-- A SECOND GATE, CARRIED FORWARD FROM PD7. NO GRADED FIELD MAY LAND NEAR A
-- VALUE THE LEARNER IS HANDED IN THE PROMPT. This domain hands over a great
-- many conditions: two sample counts, four time bounds, five closed-form
-- constants for the water history, three for the gas history, two radii,
-- three skins and three window fractions. Every one of those sits in front of
-- the learner while they are graded, and a graded field that lands on one of
-- them is not a calculation, it is a transcription. The gate runs on the same
-- three magnitude windows as the golden sweep. It matters more here than in
-- most waves because several conditions are DIMENSIONLESS EXPONENTS of the
-- same order as the graded slopes: the water history's exponent of 1.8, its
-- decline exponent of 0.9, its residual of 1.4 and the gas exponent of 1.4
-- all live in the same band as eight graded slopes, and the closest approach
-- of any of them is 483 windows.
--
-- AND THE STANDING CROSS-TIER PROMPT GATE, which re-reads the STORED prompts.
-- The Associate tier's geometry group was drafted into both upper prompts as
-- the numerator of the two graded multipliers and taken out, because a
-- multiplier is one division away from a stated denominator. The
-- Professional tier's window start in days was drafted into the Expert prompt
-- as the anchor the span is compared against and taken out, because a span is
-- one logarithm away from a stated window start. Both identities are stated
-- in WORDS in the free checks instead, which is the device PD5 used on its
-- cycle gas, PD6 on its heat-loss-only arrival and PD7 on its manifold
-- pressure.
-- ============================================================================

do $$
declare
  v_structures integer;
  v_capstones  integer;
  v_questions  integer;
  v_graded     integer;
  v_n          integer;
  v_n2         integer;
  -- the eighteen graded values
  v_b1 double precision; v_b2 double precision; v_b3 double precision;
  v_b4 double precision; v_b5 double precision; v_b6 double precision;
  v_i1 double precision; v_i2 double precision; v_i3 double precision;
  v_i4 double precision; v_i5 double precision; v_i6 double precision;
  v_a1 double precision; v_a2 double precision; v_a3 double precision;
  v_a4 double precision; v_a5 double precision; v_a6 double precision;
  -- recomputed quantities
  v_c2 double precision; v_tbreak double precision; v_wbreak double precision;
  v_lnre double precision; v_pss0 double precision;
  v_w55 double precision; v_w30 double precision; v_w90 double precision;
  v_wgas double precision;
  v_s double precision; v_ic double precision; v_r2 double precision;
  v_sp double precision; v_lastpos double precision;
  v_firstpost double precision; v_pcr2 double precision;
  v_span30 double precision; v_rawspan30 double precision;
  v_gasfirst double precision; v_gaslast double precision;
  v_derfullslope double precision;
  v_worlast double precision; v_worfirst double precision;
  -- STATED CONDITIONS, all hand retyped from the capstone's own prompts and
  -- none of them read out of the wave's derivation. Not one is a graded value.
  c_worn   constant integer          := 46;      -- water samples
  c_wt0    constant double precision := 24;      -- days, first water sample
  c_wt1    constant double precision := 2900;    -- days, last water sample
  c_c1     constant double precision := 0.0015;  -- per day, the displacement term
  c_p      constant double precision := 1.8;     -- the channel term's exponent
  c_tx     constant double precision := 2300;    -- days, the crossover
  c_choke  constant double precision := 1900;    -- days, the well is beaned back
  c_k      constant double precision := 0.9;     -- the decline exponent
  c_wres   constant double precision := 1.4;     -- the residual ratio
  c_gorn   constant integer          := 30;      -- gas samples
  c_gt0    constant double precision := 90;      -- days, first gas sample
  c_gt1    constant double precision := 2900;    -- days, last gas sample
  c_g0     constant double precision := 780;     -- scf/stb, the gas base
  c_g1     constant double precision := 0.02687; -- the gas coefficient
  c_q      constant double precision := 1.4;     -- the gas exponent
  c_re     constant double precision := 1480;    -- ft, the drainage radius
  c_rw     constant double precision := 0.29;    -- ft, the wellbore radius
  c_skin   constant double precision := 6.4;     -- the measured skin
  c_acid   constant double precision := -2.5;    -- the designed acid job
  c_over   constant double precision := -7.0;    -- the overreached design
  c_refuse constant double precision := -8.2;    -- deep enough that it IS refused
  c_lf55   constant double precision := 0.55;    -- the graded late fraction
  c_lf30   constant double precision := 0.30;    -- the short window
  c_lf90   constant double precision := 0.90;    -- the long window
  -- the engine's own thresholds, restated so a settings override that moved
  -- one would fail here rather than silently move every verdict in the course
  c_coning  constant double precision := -0.1;
  c_channel constant double precision := 1.3;
  c_band    constant double precision := 0.25;
  c_minr2   constant double precision := 0.5;
  c_minspan constant double precision := 0.4;
  c_minwor  constant double precision := 0.1;
  -- the deepest skin the module's own refusal text calls a real treatment
  c_realfrac constant double precision := -6.0;
  c_pss  constant double precision := 0.75;      -- the pseudo-steady-state 3/4
begin
  -- ---------------------------------------------------------------- shape --
  select count(*) into v_structures
    from public.academy_course_structures where app_slug = 'intervention' and active;
  if v_structures <> 3 then
    raise exception 'PD8 go-live refused: intervention has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions
    from public.academy_quiz_questions where app_slug = 'intervention';
  if v_questions <> 396 then
    raise exception 'PD8 go-live refused: intervention has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_capstones
    from public.academy_capstones where app_slug = 'intervention';
  if v_capstones <> 3 then
    raise exception 'PD8 go-live refused: intervention has % capstones, expected 3', v_capstones;
  end if;

  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'intervention';
  if v_graded <> 18 then
    raise exception 'PD8 go-live refused: intervention grades % capstone fields, expected 18', v_graded;
  end if;

  select count(*) into v_graded from (
    select c.tier, count(*) as k
      from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug = 'intervention' group by c.tier having count(*) = 6) q;
  if v_graded <> 3 then
    raise exception 'PD8 go-live refused: the eighteen graded fields do not split six per tier';
  end if;

  -- ------------------------------------------------- the prerequisite row --
  if not exists (select 1 from public.academy_apps where slug = 'intervention'
                   and module = 'production' and path_order = 37 and prereq_slug = 'nodal') then
    raise exception 'PD8 go-live refused: the intervention catalog row is not production/37 with prereq nodal';
  end if;
  if not exists (select 1 from public.academy_apps where slug = 'nodal') then
    raise exception 'PD8 go-live refused: the prerequisite course nodal is not in the catalog';
  end if;

  -- -------------------------------------------------- the scope assertion --
  -- This engine is a DIAGNOSTIC. It sizes nothing. The only dimensional
  -- number it returns anywhere is the start of the late window in days, and
  -- everything else is a slope, a fit quality, a span or a dimensionless
  -- group. Nothing here may certify a quantity it never computed.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'intervention'
     and (f->>'unit'  ilike '%stb/d%'     or f->>'unit'  ilike '%bbl%'
       or f->>'unit'  ilike '%mscf%'      or f->>'unit'  ilike '%lb/d%'
       or f->>'unit'  ilike '%psi%'       or f->>'unit'  ilike '%bar%'
       or f->>'unit'  ilike '%degf%'      or f->>'unit'  ilike '%degc%'
       or f->>'unit'  ilike '%btu%'       or f->>'unit'  ilike '%usd%'
       or f->>'unit'  ilike '%boe%'       or f->>'unit'  ilike '%md%'
       or f->>'unit'  ilike '%darcy%'     or f->>'unit'  ilike '%hp%'
       or f->>'unit'  =    'ft'           or f->>'unit'  =    'in'
       or f->>'label' ilike '%rate%'      or f->>'label' ilike '%pressure%'
       or f->>'label' ilike '%temperature%' or f->>'label' ilike '%permeab%'
       or f->>'label' ilike '%npv%'       or f->>'label' ilike '%cost%'
       or f->>'label' ilike '%revenue%'   or f->>'label' ilike '%reserve%'
       or f->>'label' ilike '%eur%'       or f->>'label' ilike '%volume%'
       or f->>'label' ilike '%horsepower%'or f->>'label' ilike '%torque%');
  if v_graded <> 0 then
    raise exception 'PD8 go-live refused: % capstone field(s) grade a dimensional quantity this diagnostic engine never computes', v_graded;
  end if;

  -- --------------- A VERDICT IS NOT A NUMBER, AS A GATE -------------------
  -- Every verdict this module returns is a string or a boolean, and grading
  -- one at a numeric tolerance would be a category error.
  --
  -- THE GATE IS ANCHORED ON THE LABEL'S LEADING NOUN, DELIBERATELY, and this
  -- was corrected after the first run rather than assumed. A field is a
  -- verdict when the verdict is WHAT IT IS, not when a verdict is mentioned
  -- somewhere in its description: one of the graded fields here is the ratio
  -- slope returned BESIDE the flat gas verdict, and the whole finding is that
  -- a number and a verdict contradicting each other sit in one return object,
  -- so a gate written on a bare substring would refuse the very field the
  -- Expert tier exists to grade. The unit whitelist below carries the other
  -- half of the same rule: a verdict has no numeric unit at all.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'intervention'
     and (f->>'label' ~* '^(the )?(mechanism|confidence|verdict|block reason|blocked|ambiguous|treatable|recommendation|screening verdict)\\M'
       or f->>'unit'  ilike '%verdict%'    or f->>'unit'  ilike '%boolean%'
       or f->>'unit'  ilike '%mechanism%'  or f->>'unit'  ilike '%text%');
  if v_graded <> 0 then
    raise exception 'PD8 go-live refused: % capstone field(s) grade a verdict, which this module returns as a string or a boolean and which cannot carry a numeric tolerance', v_graded;
  end if;

  -- and the units that ARE allowed are the module's own and nothing else
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'intervention'
     and f->>'unit' not in ('dimensionless', 'fraction', 'days', 'log cycles', 'ln(stb/stb)');
  if v_graded <> 0 then
    raise exception 'PD8 go-live refused: % capstone field(s) carry a unit outside this module''s own set', v_graded;
  end if;

  -- ---------- NO GRADED FIELD MAY BE A NUMBER THE PROMPT HANDS OVER ------
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         (values (46),(24),(2900),(0.0015),(1.8),(2300),(1900),(0.9),(1.4),
                 (30),(90),(780),(0.02687),(1.4),
                 (1480),(0.29),(6.4),(2.5),(7.0),(0.75),
                 (0.55),(0.30),(0.90),(0.5),(1.3),(0.25),(0.1),(0.4),
                 (45),(29),(20),(21),(6),(3),(2),(1),(0.02)) as h(v)
   where c.app_slug = 'intervention'
     and abs(abs((f->>'expected')::numeric) - h.v) <
         (case when abs((f->>'expected')::numeric) < 2   then 0.00002
               when abs((f->>'expected')::numeric) < 100 then 0.0003
               else 0.05 end);
  if v_graded <> 0 then
    raise exception 'PD8 go-live refused: % graded field(s) land on a number the learner is handed in the prompt, which makes the field a transcription rather than a calculation', v_graded;
  end if;

  -- --------------------------------------- the published-golden assertion --
  -- SMALL GROUP, the eleven graded values below 2. Window 2e-5.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'intervention' and abs((f->>'expected')::numeric) < 2
     and (abs(abs((f->>'expected')::numeric) - 0.998756100) < 0.00002 -- teaching constant-derivative ratio fit quality
       or abs(abs((f->>'expected')::numeric) - 0.998750866) < 0.00002 -- golden coning series derivative
       or abs(abs((f->>'expected')::numeric) - 0.999101063) < 0.00002 -- teaching sweep derivative fit quality at 0.40
       or abs(abs((f->>'expected')::numeric) - 0.998574963) < 0.00002 -- golden coning series derivative
       or abs(abs((f->>'expected')::numeric) - 0.998513658) < 0.00002 -- teaching derivative fit quality at the default window
       or abs(abs((f->>'expected')::numeric) - 0.994988494) < 0.00002 -- teaching full-history derivative fit quality
       or abs(abs((f->>'expected')::numeric) - 0.995286721) < 0.00002 -- teaching sweep fit quality at 0.90
       or abs(abs((f->>'expected')::numeric) - 0.999661253) < 0.00002 -- teaching sweep derivative fit quality at 0.30
       or abs(abs((f->>'expected')::numeric) - 0.972752511) < 0.00002 -- teaching sweep ratio fit quality at 0.70
       or abs(abs((f->>'expected')::numeric) - 0.999944740) < 0.00002 -- teaching sweep derivative fit quality at 0.20
       or abs(abs((f->>'expected')::numeric) - 0.999955540) < 0.00002 -- teaching discarded-evidence fit quality
       or abs(abs((f->>'expected')::numeric) - 1.084028497) < 0.00002 -- derived one unit of skin, 5 to 4
       or abs(abs((f->>'expected')::numeric) - 0.997599130) < 0.00002 -- teaching sweep fit quality at 0.60
       or abs(abs((f->>'expected')::numeric) - 0.995879922) < 0.00002 -- teaching sweep fit quality at 0.80
       or abs(abs((f->>'expected')::numeric) - 0.555098340) < 0.00002 -- GOLDEN coning published lateDerivativeSlope
       or abs(abs((f->>'expected')::numeric) - 0.539955222) < 0.00002 -- derived engine slope on the coning history
       or abs(abs((f->>'expected')::numeric) - 0.992767316) < 0.00002 -- teaching constant-derivative ratio fit quality
       or abs(abs((f->>'expected')::numeric) - 0.996676450) < 0.00002 -- teaching sweep fit quality at 0.70
       or abs(abs((f->>'expected')::numeric) - 1.088100432) < 0.00002 -- teaching sweep ratio slope at 0.60
       or abs(abs((f->>'expected')::numeric) - 0.612424871) < 0.00002 -- derived flow efficiency, published skin case 2
       or abs(abs((f->>'expected')::numeric) - 1.206802663) < 0.00002 -- derived span on the published histories
       or abs(abs((f->>'expected')::numeric) - 1.308332820) < 0.00002 -- GOLDEN power_law intercept
       or abs(abs((f->>'expected')::numeric) - 0.989832434) < 0.00002 -- teaching full-history ratio fit quality
       or abs(abs((f->>'expected')::numeric) - 1.415260738) < 0.00002 -- teaching sweep span at 0.70
       or abs(abs((f->>'expected')::numeric) - 1.098217468) < 0.00002 -- teaching full-history ratio slope
       or abs(abs((f->>'expected')::numeric) - 1.098612289) < 0.00002 -- GOLDEN power_law ln 3
       or abs(abs((f->>'expected')::numeric) - 0.987227989) < 0.00002 -- teaching sweep fit quality at 0.90
       or abs(abs((f->>'expected')::numeric) - 0.963127975) < 0.00002 -- teaching sweep ratio slope at 0.40
       or abs(abs((f->>'expected')::numeric) - 1.101002709) < 0.00002 -- derived one unit of skin, 3 to 2
       or abs(abs((f->>'expected')::numeric) - 1.200000000) < 0.00002 -- GOLDEN flat history level
       or abs(abs((f->>'expected')::numeric) - 1.103149966) < 0.00002 -- teaching sweep ratio slope at 0.90
       or abs(abs((f->>'expected')::numeric) - 1.104746497) < 0.00002 -- teaching sweep ratio slope at 0.70
       or abs(abs((f->>'expected')::numeric) - 1.300000000) < 0.00002 -- the channelling threshold itself
       or abs(abs((f->>'expected')::numeric) - 1.107183344) < 0.00002 -- teaching sweep ratio slope at 0.80
       or abs(abs((f->>'expected')::numeric) - 0.602059991) < 0.00002 -- derived span lost in the filter demonstration
       or abs(abs((f->>'expected')::numeric) - 1.067110830) < 0.00002 -- derived one unit of skin, 8 to 7
       or abs(abs((f->>'expected')::numeric) - 1.442132492) < 0.00002 -- teaching derivative slope at the default window
       or abs(abs((f->>'expected')::numeric) - 1.040602176) < 0.00002 -- teaching ratio slope at the default window
       or abs(abs((f->>'expected')::numeric) - 1.229355999) < 0.00002 -- teaching sweep derivative slope at 1.00
       or abs(abs((f->>'expected')::numeric) - 1.254360095) < 0.00002 -- teaching sweep derivative slope at 0.90
       or abs(abs((f->>'expected')::numeric) - 1.292632524) < 0.00002 -- teaching sweep derivative slope at 0.80
       or abs(abs((f->>'expected')::numeric) - 1.336892539) < 0.00002 -- teaching sweep derivative slope at 0.70
       or abs(abs((f->>'expected')::numeric) - 1.387035000) < 0.00002 -- teaching sweep derivative slope at 0.60
       or abs(abs((f->>'expected')::numeric) - 1.485563987) < 0.00002 -- teaching sweep derivative slope at 0.40
       or abs(abs((f->>'expected')::numeric) - 1.544046342) < 0.00002 -- teaching sweep derivative slope at 0.30
       or abs(abs((f->>'expected')::numeric) - 1.600276347) < 0.00002 -- teaching sweep derivative slope at 0.20, off a REFUSED reading
       or abs(abs((f->>'expected')::numeric) - 1.600000000) < 0.00002 -- GOLDEN channelling lateDerivativeSlope
       or abs(abs((f->>'expected')::numeric) - 1.000000000) < 0.00002 -- GOLDEN displacement lateDerivativeSlope
       or abs(abs((f->>'expected')::numeric) - 1.350000000) < 0.00002 -- GOLDEN power_law slope
       or abs(abs((f->>'expected')::numeric) - 0.749171775) < 0.00002 -- teaching discarded-evidence ratio slope
       or abs(abs((f->>'expected')::numeric) - 0.850000000) < 0.00002 -- teaching discarded-derivative magnitude slope
       or abs(abs((f->>'expected')::numeric) - 0.900620470) < 0.00002 -- teaching derivative span at the default window
       or abs(abs((f->>'expected')::numeric) - 0.450310235) < 0.00002 -- teaching derivative span at 0.30
       or abs(abs((f->>'expected')::numeric) - 0.578970302) < 0.00002 -- teaching derivative span at 0.35
       or abs(abs((f->>'expected')::numeric) - 0.707630369) < 0.00002 -- teaching window span at 0.40
       or abs(abs((f->>'expected')::numeric) - 1.157940604) < 0.00002 -- teaching window span at 0.60
       or abs(abs((f->>'expected')::numeric) - 0.921895186) < 0.00002 -- teaching ratio fit quality at the default window
       or abs(abs((f->>'expected')::numeric) - 0.356090047) < 0.00002 -- teaching gas ratio slope
       or abs(abs((f->>'expected')::numeric) - 0.949579198) < 0.00002 -- teaching gas ratio fit quality
       or abs(abs((f->>'expected')::numeric) - 0.143809349) < 0.00002 -- teaching falling-only ratio slope
       or abs(abs((f->>'expected')::numeric) - 1.150000000) < 0.00002 -- teaching low-last-sample restored slope
       or abs(abs((f->>'expected')::numeric) - 0.903089987) < 0.00002 -- derived filter-demonstration span
       or abs(abs((f->>'expected')::numeric) - 0.135843859) < 0.00002 -- teaching constant-derivative ratio slope
       or abs(abs((f->>'expected')::numeric) - 0.114949989) < 0.00002);-- teaching constant-derivative windowed ratio slope
  if v_graded <> 0 then
    raise exception 'PD8 go-live refused: % graded field(s) below 2 sit within 2e-5 of a published value, which makes them a lookup rather than a calculation', v_graded;
  end if;

  -- MIDDLE GROUP, the six graded values between 2 and 100. Window 3e-4.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'intervention'
     and abs((f->>'expected')::numeric) >= 2 and abs((f->>'expected')::numeric) < 100
     and (abs(abs((f->>'expected')::numeric) - 2.079441542) < 0.0003 -- GOLDEN power_law ln 8
       or abs(abs((f->>'expected')::numeric) - 2.075499319) < 0.0003 -- golden coning series ratio
       or abs(abs((f->>'expected')::numeric) - 6.825482691) < 0.0003 -- teaching last-sample derivative magnitude
       or abs(abs((f->>'expected')::numeric) - 18.000000000) < 0.0003 -- the round number the overreach sits beside
       or abs(abs((f->>'expected')::numeric) - 2.477121255) < 0.0003 -- GOLDEN histories span
       or abs(abs((f->>'expected')::numeric) - 2.000000000) < 0.0003 -- derived power_law engine span
       or abs(abs((f->>'expected')::numeric) - 7.900724584) < 0.0003 -- GOLDEN minimumSkin, published geometry
       or abs(abs((f->>'expected')::numeric) - 8.650724584) < 0.0003 -- derived ln(re/rw), published geometry
       or abs(abs((f->>'expected')::numeric) - 7.361728083) < 0.0003 -- teaching minimumSkin
       or abs(abs((f->>'expected')::numeric) - 8.111728083) < 0.0003 -- teaching ln(re/rw)
       or abs(abs((f->>'expected')::numeric) - 14.861728083) < 0.0003 -- teaching denominator at its own skin
       or abs(abs((f->>'expected')::numeric) - 2.879215612) < 0.0003 -- teaching designed acid multiplier
       or abs(abs((f->>'expected')::numeric) - 2.012565356) < 0.0003 -- GOLDEN skin case 1 multiplier
       or abs(abs((f->>'expected')::numeric) - 2.186294988) < 0.0003 -- GOLDEN skin case 2 multiplier
       or abs(abs((f->>'expected')::numeric) - 4.060771880) < 0.0003 -- GOLDEN skin case 5 multiplier
       or abs(abs((f->>'expected')::numeric) - 2.723707251) < 0.0003 -- derived flow efficiency at skin -5
       or abs(abs((f->>'expected')::numeric) - 6.292734624) < 0.0003 -- teaching skin guard at -5
       or abs(abs((f->>'expected')::numeric) - 7.982759790) < 0.0003 -- teaching skin guard at -5.5
       or abs(abs((f->>'expected')::numeric) - 10.913873530) < 0.0003 -- teaching skin guard at -6
       or abs(abs((f->>'expected')::numeric) - 17.246424216) < 0.0003 -- teaching skin guard at -6.5
       or abs(abs((f->>'expected')::numeric) - 26.457156986) < 0.0003 -- teaching skin guard at -6.8
       or abs(abs((f->>'expected')::numeric) - 41.085358779) < 0.0003 -- teaching skin guard at -7.0
       or abs(abs((f->>'expected')::numeric) - 4.204397383) < 0.0003 -- teaching overreach factor
       or abs(abs((f->>'expected')::numeric) - 9.189015534) < 0.0003 -- teaching overreach against the designed job
       or abs(abs((f->>'expected')::numeric) - 2.248088575) < 0.0003 -- teaching gas rise factor
       or abs(abs((f->>'expected')::numeric) - 2.380211242) < 0.0003 -- teaching well span
       or abs(abs((f->>'expected')::numeric) - 2.122891107) < 0.0003 -- teaching full-history derivative span
       or abs(abs((f->>'expected')::numeric) - 3.680864042) < 0.0003 -- teaching claim audit at 2.0
       or abs(abs((f->>'expected')::numeric) - 5.521296062) < 0.0003 -- teaching claim audit at 4.0
       or abs(abs((f->>'expected')::numeric) - 6.134773403) < 0.0003 -- teaching claim audit at 6.0
       or abs(abs((f->>'expected')::numeric) - 6.495642426) < 0.0003 -- teaching claim audit at 8.5
       or abs(abs((f->>'expected')::numeric) - 6.748250743) < 0.0003 -- teaching claim audit at 12.0
       or abs(abs((f->>'expected')::numeric) - 6.052413434) < 0.0003 -- teaching full-history intercept
       or abs(abs((f->>'expected')::numeric) - 7.207577403) < 0.0003 -- derived geometry sweep at 1000 ft
       or abs(abs((f->>'expected')::numeric) - 7.613042512) < 0.0003 -- derived geometry sweep at 1500 ft
       or abs(abs((f->>'expected')::numeric) - 6.514430223) < 0.0003 -- derived geometry sweep at 500 ft
       or abs(abs((f->>'expected')::numeric) - 8.306189692) < 0.0003 -- derived geometry sweep at 3000 ft
       or abs(abs((f->>'expected')::numeric) - 2.995732274) < 0.0003 -- derived geometry sweep swing
       or abs(abs((f->>'expected')::numeric) - 2.900724584) < 0.0003 -- derived denominator at skin -5
       or abs(abs((f->>'expected')::numeric) - 3.900724584) < 0.0003 -- derived denominator at skin -4
       or abs(abs((f->>'expected')::numeric) - 4.900724584) < 0.0003 -- derived denominator at skin -3
       or abs(abs((f->>'expected')::numeric) - 5.900724584) < 0.0003 -- derived denominator at skin -2
       or abs(abs((f->>'expected')::numeric) - 2.352178324) < 0.0003 -- teaching intercept as a coefficient, scaled
       or abs(abs((f->>'expected')::numeric) - 4.432694952) < 0.0003);-- teaching channel coefficient, scaled
  if v_graded <> 0 then
    raise exception 'PD8 go-live refused: % graded field(s) between 2 and 100 sit within 3e-4 of a published value, which makes them a lookup rather than a calculation', v_graded;
  end if;

  -- LARGE GROUP, the one graded value at 100 or above. Window 0.05.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'intervention' and abs((f->>'expected')::numeric) >= 100
     and (abs(abs((f->>'expected')::numeric) - 200.000000)   < 0.05 -- GOLDEN coning history tau
       or abs(abs((f->>'expected')::numeric) - 186.345364)   < 0.05 -- derived oracle late window on the published histories
       or abs(abs((f->>'expected')::numeric) - 211.150551)   < 0.05 -- GOLDEN power_law y
       or abs(abs((f->>'expected')::numeric) - 215.692241)   < 0.05 -- GOLDEN histories sample time
       or abs(abs((f->>'expected')::numeric) - 250.242976)   < 0.05 -- teaching window start at the default fraction
       or abs(abs((f->>'expected')::numeric) - 278.253111)   < 0.05 -- teaching window start
       or abs(abs((f->>'expected')::numeric) - 225.767578)   < 0.05 -- teaching constant-derivative window start
       or abs(abs((f->>'expected')::numeric) - 268.364963)   < 0.05 -- teaching low-last-sample window start
       or abs(abs((f->>'expected')::numeric) - 188.813742)   < 0.05 -- teaching gas history sample time
       or abs(abs((f->>'expected')::numeric) - 186.080914)   < 0.05 -- teaching well sample time
       or abs(abs((f->>'expected')::numeric) - 160.461850)   < 0.05 -- teaching well sample time
       or abs(abs((f->>'expected')::numeric) - 222.412735)   < 0.05 -- teaching gas history sample time
       or abs(abs((f->>'expected')::numeric) - 215.790272)   < 0.05 -- teaching well sample time
       or abs(abs((f->>'expected')::numeric) - 705.784525)   < 0.05 -- teaching window start at 0.30
       or abs(abs((f->>'expected')::numeric) - 725.900975)   < 0.05 -- teaching window start
       or abs(abs((f->>'expected')::numeric) - 1276.416078)  < 0.05 -- teaching window start at 0.20
       or abs(abs((f->>'expected')::numeric) - 2308.407093)  < 0.05 -- teaching first discarded sample
       or abs(abs((f->>'expected')::numeric) - 3000.000000)  < 0.05 -- GOLDEN histories last sample time
       or abs(abs((f->>'expected')::numeric) - 3600.000000)  < 0.05);-- teaching last sample time
  if v_graded <> 0 then
    raise exception 'PD8 go-live refused: % graded field(s) at 100 or above sit within 0.05 of a published value, which makes them a lookup rather than a calculation', v_graded;
  end if;

  -- ------------------------------------- the cross-tier prompt-leak gate --
  select count(*) into v_graded
    from public.academy_capstones c,
         public.academy_capstones c2,
         lateral jsonb_array_elements(c2.fields) f
   where c.app_slug = 'intervention' and c2.app_slug = 'intervention' and c.tier <> c2.tier
     and replace(c.prompt, ',', '') like '%' || (f->>'expected') || '%';
  if v_graded <> 0 then
    raise exception 'PD8 go-live refused: % capstone prompt(s) state a graded value belonging to another tier', v_graded;
  end if;

  -- ------------------------------------------------------ load the values --
  select (f->>'expected')::double precision into v_b1 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='intervention' and f->>'key'='wor_loglog_slope_full';
  select (f->>'expected')::double precision into v_b2 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='intervention' and f->>'key'='wor_loglog_intercept_full';
  select (f->>'expected')::double precision into v_b3 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='intervention' and f->>'key'='wor_loglog_r2_full';
  select (f->>'expected')::double precision into v_b4 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='intervention' and f->>'key'='wor_loglog_span_decades_full';
  select (f->>'expected')::double precision into v_b5 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='intervention' and f->>'key'='pss_denominator_at_skin_6p4';
  select (f->>'expected')::double precision into v_b6 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='intervention' and f->>'key'='minimum_skin_for_geometry';
  select (f->>'expected')::double precision into v_i1 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='intervention' and f->>'key'='chan_wor_slope_late';
  select (f->>'expected')::double precision into v_i2 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='intervention' and f->>'key'='chan_wor_r2_late';
  select (f->>'expected')::double precision into v_i3 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='intervention' and f->>'key'='chan_derivative_slope_late';
  select (f->>'expected')::double precision into v_i4 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='intervention' and f->>'key'='chan_derivative_r2_late';
  select (f->>'expected')::double precision into v_i5 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='intervention' and f->>'key'='chan_late_window_start_days';
  select (f->>'expected')::double precision into v_i6 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='intervention' and f->>'key'='acid_job_pi_multiplier';
  select (f->>'expected')::double precision into v_a1 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='intervention' and f->>'key'='chan_derivative_span_decades';
  select (f->>'expected')::double precision into v_a2 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='intervention' and f->>'key'='post_choke_wor_slope';
  select (f->>'expected')::double precision into v_a3 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='intervention' and f->>'key'='chan_late030_derivative_slope';
  select (f->>'expected')::double precision into v_a4 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='intervention' and f->>'key'='chan_late090_derivative_slope';
  select (f->>'expected')::double precision into v_a5 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='intervention' and f->>'key'='gor_null_derivative_wor_slope';
  select (f->>'expected')::double precision into v_a6 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='intervention' and f->>'key'='skin_pi_multiplier_at_minus7';

  if v_b1 is null or v_b2 is null or v_b3 is null or v_b4 is null or v_b5 is null
     or v_b6 is null or v_i1 is null or v_i2 is null or v_i3 is null or v_i4 is null
     or v_i5 is null or v_i6 is null or v_a1 is null or v_a2 is null or v_a3 is null
     or v_a4 is null or v_a5 is null or v_a6 is null then
    raise exception 'PD8 go-live refused: one or more of the eighteen graded fields is missing';
  end if;

  -- ============ REBUILD THE TWO HISTORIES FROM THE STATED FORMS ===========
  -- Nothing below is read out of the wave's derivation. The samples are
  -- regenerated here from the capstone's own closed forms and every fit is
  -- re-run through PostgreSQL's regression aggregates, which share no code
  -- with the engine's hand-written accumulation.
  v_c2 := c_c1 * power(c_tx, 1 - c_p);
  -- the crossover identity the coefficient exists to satisfy: at the crossover
  -- time the displacement term and the channel term are equal.
  if abs(c_c1 * c_tx - v_c2 * power(c_tx, c_p)) > 1e-9 then
    raise exception 'PD8 go-live refused: the channel coefficient does not make the two terms equal at the stated crossover, they differ by %', c_c1 * c_tx - v_c2 * power(c_tx, c_p);
  end if;

  create temp table pd8_wor as
  select t,
         case when t <= c_choke then c_c1 * t + v_c2 * power(t, c_p) else null end as pre_ratio
    from (select c_wt0 * power(c_wt1 / c_wt0, i::double precision / (c_worn - 1)) as t
            from generate_series(0, c_worn - 1) as i) q;

  select max(t) into v_tbreak from pd8_wor where t <= c_choke;
  v_wbreak := c_c1 * v_tbreak + v_c2 * power(v_tbreak, c_p);
  select min(t) into v_firstpost from pd8_wor where t > c_choke;

  alter table pd8_wor add column ratio double precision;
  alter table pd8_wor add column der double precision;
  update pd8_wor set
    ratio = case when t <= c_choke then c_c1 * t + v_c2 * power(t, c_p)
                 else c_wres + (v_wbreak - c_wres) * power(t / v_tbreak, -c_k) end,
    der   = case when t <= c_choke then c_c1 * t + c_p * v_c2 * power(t, c_p)
                 else -c_k * (v_wbreak - c_wres) * power(t / v_tbreak, -c_k) end;

  create temp table pd8_gor as
  select t, c_g0 + c_g1 * power(t, c_q) as ratio
    from (select c_gt0 * power(c_gt1 / c_gt0, i::double precision / (c_gorn - 1)) as t
            from generate_series(0, c_gorn - 1) as i) q;

  -- the histories are the shape the capstone says they are
  select count(*) into v_n from pd8_wor;
  if v_n <> c_worn then
    raise exception 'PD8 go-live refused: the rebuilt water history has % samples rather than 46', v_n;
  end if;
  select count(*) into v_n from pd8_gor;
  if v_n <> c_gorn then
    raise exception 'PD8 go-live refused: the rebuilt gas history has % samples rather than 30', v_n;
  end if;
  select count(*) into v_n from pd8_wor where ratio <= 0;
  if v_n <> 0 then
    raise exception 'PD8 go-live refused: % water samples have a non-positive ratio, so the full-history fit would silently drop them and the Associate claim that its filter drops nothing is false', v_n;
  end if;
  select count(*) into v_n from pd8_wor where der < 0;
  select count(*) into v_n2 from pd8_wor where der > 0;
  if v_n <> 4 or v_n2 <> 42 then
    raise exception 'PD8 go-live refused: the history carries % negative and % positive derivatives rather than 4 and 42, so the evidence the diagnosis discards is not the four post-choke samples', v_n, v_n2;
  end if;
  select count(*) into v_n from pd8_wor where der < 0 and t <= c_choke;
  if v_n <> 0 then
    raise exception 'PD8 go-live refused: a sample at or before the choke has a falling derivative, so the turn is not the choke and the capstone no longer says what it says';
  end if;
  if v_firstpost <= c_choke or v_tbreak > c_choke then
    raise exception 'PD8 go-live refused: the break and the first post-choke sample do not straddle the stated choke day';
  end if;
  select max(ratio) into v_worlast from pd8_wor;
  if abs(v_worlast - v_wbreak) > 1e-9 then
    raise exception 'PD8 go-live refused: the ratio does not peak at the break, so the history no longer turns back down after the well is beaned back';
  end if;
  select ratio into v_worlast from pd8_wor order by t desc limit 1;
  select ratio into v_worfirst from pd8_wor order by t asc limit 1;
  if not (v_worlast >= c_minwor) then
    raise exception 'PD8 go-live refused: the last water-oil ratio is % and does not clear the module''s own minWor of 0.1, so the whole diagnosis short-circuits before a slope is ever computed', v_worlast;
  end if;
  if c_worn < 6 then
    raise exception 'PD8 go-live refused: a Chan reading needs six producing samples and this history has fewer';
  end if;

  -- ================= ASSOCIATE: THE FIT ==================================
  select regr_slope(ln(ratio), ln(t)), regr_intercept(ln(ratio), ln(t)),
         regr_r2(ln(ratio), ln(t)), count(*),
         (ln(max(t)) - ln(min(t))) / ln(10.0::double precision)
    into v_s, v_ic, v_r2, v_n, v_sp
    from pd8_wor where t > 0 and ratio > 0;
  if v_n <> c_worn then
    raise exception 'PD8 go-live refused: the full-history fit used % of the 46 samples, so the filter dropped something and the Associate tier''s cleanest statement is wrong', v_n;
  end if;
  if abs(v_b1 - v_s) > 0.000002 then
    raise exception 'PD8 go-live refused: the graded full-history slope of % is not the least squares of ln ratio on ln t over the whole rebuilt history, which gives %', v_b1, v_s;
  end if;
  if abs(v_b2 - v_ic) > 0.000015 then
    raise exception 'PD8 go-live refused: the graded full-history intercept of % is not the least squares intercept of the rebuilt history, which gives %', v_b2, v_ic;
  end if;
  if abs(v_b3 - v_r2) > 0.000002 then
    raise exception 'PD8 go-live refused: the graded full-history fit quality of % is not the coefficient of determination of that same fit, which gives %', v_b3, v_r2;
  end if;
  if abs(v_b4 - v_sp) > 0.000005 then
    raise exception 'PD8 go-live refused: the graded full-history span of % log cycles is not the log-time span of the rebuilt history, which gives %', v_b4, v_sp;
  end if;
  -- AND THE SPAN IS THE WHOLE RECORD, TO THE LAST BITS, because nothing was
  -- dropped. This is the one case in the course where a returned point count
  -- and an input point count are the same number, and it is asserted at 1e-12
  -- rather than at the field's own tolerance for exactly that reason.
  if abs(v_b4 - ln(c_wt1 / c_wt0) / ln(10.0::double precision)) > 1e-12 then
    raise exception 'PD8 go-live refused: the graded span is not the base-ten logarithm of 2900 over 24, so the fit did not sit on the whole record';
  end if;
  if not (v_b3 > 0 and v_b3 < 1) then
    raise exception 'PD8 go-live refused: the graded fit quality of % is not strictly between zero and one, so it is not a fraction', v_b3;
  end if;
  if not (v_b1 > 1 and v_b1 < 1.25) then
    raise exception 'PD8 go-live refused: the full-history slope of % is not between one and one and a quarter, so the ratio is no longer climbing faster than proportionally over the well''s life and the capstone has stopped being a channelling candidate at all', v_b1;
  end if;
  if exp(v_b2) >= v_worfirst / 10 then
    raise exception 'PD8 go-live refused: the exponential of the intercept is % against a first sample ratio of %, so the intercept is no longer the far extrapolation back to one day that the tier teaches it is', exp(v_b2), v_worfirst;
  end if;

  -- ================= ASSOCIATE: THE GEOMETRY =============================
  -- Closed forms, so no magic number stands where a formula can.
  v_lnre := ln(c_re / c_rw);
  v_pss0 := v_lnre - c_pss;
  if abs(v_b5 - (v_lnre - c_pss + c_skin)) > 0.00003 then
    raise exception 'PD8 go-live refused: the graded geometry group of % is not ln(re/rw) less three quarters plus the measured skin, which gives %', v_b5, v_lnre - c_pss + c_skin;
  end if;
  if abs(v_b6 + v_pss0) > 0.00002 then
    raise exception 'PD8 go-live refused: the graded geometry floor of % is not the negative of ln(re/rw) less three quarters, which gives %', v_b6, -v_pss0;
  end if;
  -- THE DECOUPLING IDENTITY, and it is asserted at 1e-12 because it is exact.
  -- The two Associate geometry answers differ by the measured skin and by
  -- nothing else, which is why neither of them had to be stated in the upper
  -- tiers' prompts for those tiers' multipliers to be gradeable.
  if abs(v_b5 + v_b6 - c_skin) > 1e-12 then
    raise exception 'PD8 go-live refused: the geometry group plus the geometry floor is % rather than the measured skin of 6.4, so the two Associate answers are no longer one skin apart', v_b5 + v_b6;
  end if;
  if v_b5 <= 0 or v_b6 >= 0 then
    raise exception 'PD8 go-live refused: the geometry group must be positive and its floor negative, and they are % and %', v_b5, v_b6;
  end if;
  -- and the floor sits BELOW everything the module's own refusal text calls a
  -- real treatment, which is what leaves the Expert tier a band to price.
  if v_b6 >= c_realfrac then
    raise exception 'PD8 go-live refused: the geometry floor of % is not below the -6 the module''s own refusal text calls the deepest realistic fracture skin, so there is no silent band between plausibility and the pole and the Expert tier''s guard finding has nowhere to stand', v_b6;
  end if;
  -- A LOGARITHM FORGIVES A GUESS AT THE RADIUS AND FORGIVES NOTHING AT THE
  -- SKIN, asserted rather than asserted about.
  if abs((ln(2 * c_re / c_rw) - c_pss + c_skin) - v_b5) >= 1 then
    raise exception 'PD8 go-live refused: doubling the drainage radius moves the geometry group by % , which is a whole unit of skin or more, so the tier''s claim that a logarithm forgives a guessed radius no longer holds on this geometry', abs((ln(2 * c_re / c_rw) - c_pss + c_skin) - v_b5);
  end if;

  -- ================= PROFESSIONAL: THE WINDOW ============================
  -- The cut index is the FLOOR of the sample count times one less the late
  -- fraction, counting from zero, so the window start is a SAMPLE TIME.
  if floor(c_worn * (1 - c_lf55)) <> 20 then
    raise exception 'PD8 go-live refused: the stated late fraction no longer cuts at the twenty-first sample, it cuts at index %', floor(c_worn * (1 - c_lf55));
  end if;
  select t into v_w55 from pd8_wor order by t offset 20 limit 1;
  if abs(v_i5 - v_w55) > 0.0005 then
    raise exception 'PD8 go-live refused: the graded window start of % days is not the twenty-first sample time of the rebuilt history, which is %', v_i5, v_w55;
  end if;
  select count(*) into v_n from pd8_wor where abs(t - v_i5) < 1e-6;
  if v_n <> 1 then
    raise exception 'PD8 go-live refused: the graded window start is not a sample time of this history at all, which means it was interpolated rather than indexed';
  end if;
  if not (v_i5 > c_wt0 and v_i5 < c_wt1) then
    raise exception 'PD8 go-live refused: the graded window start of % days does not sit inside the record', v_i5;
  end if;

  -- ================= PROFESSIONAL: THE TWO FITS ==========================
  select regr_slope(ln(ratio), ln(t)), regr_r2(ln(ratio), ln(t)), count(*)
    into v_s, v_r2, v_n from pd8_wor where t >= v_w55 and ratio > 0;
  if abs(v_i1 - v_s) > 0.000002 then
    raise exception 'PD8 go-live refused: the graded late ratio slope of % is not the least squares over every sample from the window start, which gives %', v_i1, v_s;
  end if;
  if abs(v_i2 - v_r2) > 0.000002 then
    raise exception 'PD8 go-live refused: the graded late ratio fit quality of % is not that same fit''s, which gives %', v_i2, v_r2;
  end if;
  select regr_slope(ln(der), ln(t)), regr_r2(ln(der), ln(t)), count(*),
         (ln(max(t)) - ln(min(t))) / ln(10.0::double precision), max(t)
    into v_s, v_r2, v_n2, v_sp, v_lastpos
    from pd8_wor where t >= v_w55 and der > 0;
  if abs(v_i3 - v_s) > 0.000003 then
    raise exception 'PD8 go-live refused: the graded late derivative slope of % is not the least squares over only the POSITIVE-derivative samples from the window start, which gives %', v_i3, v_s;
  end if;
  if abs(v_i4 - v_r2) > 0.000002 then
    raise exception 'PD8 go-live refused: the graded late derivative fit quality of % is not that same fit''s, which gives %', v_i4, v_r2;
  end if;
  -- THE TWO FITS SIT ON DIFFERENT DATA, AND THE DIFFERENCE IS EXACTLY THE
  -- DISCARDED SAMPLES. This is the assertion the fifth result of the course
  -- rests on, and it is a pair: the counts must differ, and they must differ
  -- by the count of negative derivatives and by nothing else.
  if v_n <> 26 or v_n2 <> 22 then
    raise exception 'PD8 go-live refused: the ratio fit used % samples and the derivative fit % rather than 26 and 22, so the two fits in one return object no longer sit on different windows', v_n, v_n2;
  end if;
  select count(*) into v_graded from pd8_wor where t >= v_w55 and der < 0;
  if v_n - v_n2 <> v_graded then
    raise exception 'PD8 go-live refused: the two fits differ by % samples but the late window holds % negative derivatives, so the gap is no longer the discarded evidence', v_n - v_n2, v_graded;
  end if;
  if v_graded <> 4 then
    raise exception 'PD8 go-live refused: the late window holds % negative derivatives rather than 4, so the count the engine computes and then discards has changed', v_graded;
  end if;
  if v_i3 <= v_i1 then
    raise exception 'PD8 go-live refused: the derivative slope of % is not above the ratio slope of %, so the two numbers the return object shows side by side no longer disagree and the tier has nothing to explain', v_i3, v_i1;
  end if;
  if v_i4 <= v_i2 then
    raise exception 'PD8 go-live refused: the derivative fit quality of % is not above the ratio fit quality of %, so the shorter and cleaner stretch is no longer the cleaner one', v_i4, v_i2;
  end if;
  if v_i1 >= v_b1 then
    raise exception 'PD8 go-live refused: the late ratio slope of % is not below the full-history slope of %, so the window no longer changes the reading at all', v_i1, v_b1;
  end if;
  if not (v_i2 > 0 and v_i2 < 1 and v_i4 > 0 and v_i4 < 1) then
    raise exception 'PD8 go-live refused: a graded fit quality is not strictly between zero and one, so it is not a fraction';
  end if;
  if v_i4 <= 0.99 then
    raise exception 'PD8 go-live refused: the derivative fit quality of % has fallen to where the reading is no longer a clean one, and the whole finding is that a clean-looking fit was taken on the wrong samples', v_i4;
  end if;
  if v_i4 <= c_minr2 or v_i2 <= c_minr2 then
    raise exception 'PD8 go-live refused: a graded fit quality is at or below the module''s own minR2 of 0.5, so the engine would have refused this reading as noise and there is no verdict to teach';
  end if;

  -- ================= PROFESSIONAL: THE VERDICT ON A HAIR =================
  if v_i3 <= c_channel then
    raise exception 'PD8 go-live refused: the derivative slope of % is not above the channelling threshold of 1.3, so this well is ordinary displacement, the water shutoff is blocked, and the capstone has stopped being the case the course is about', v_i3;
  end if;
  if v_i3 - c_channel >= 0.02 then
    raise exception 'PD8 go-live refused: the derivative slope clears the channelling threshold by %, which is comfortable rather than a hair, so the analyst''s window is no longer worth more than the evidence', v_i3 - c_channel;
  end if;
  -- and the same slope is INSIDE the ambiguous band, which forces the
  -- confidence to low even though this fit quality and this span would
  -- otherwise earn the engine's highest confidence. Both halves are asserted,
  -- because the finding is that a flag alone demotes a good-looking reading.
  if abs(v_i3 - c_channel) > c_band then
    raise exception 'PD8 go-live refused: the derivative slope sits % from the channelling threshold, outside the ambiguous band of 0.25, so the reading is no longer reported as close to the line', abs(v_i3 - c_channel);
  end if;
  if not (v_i4 > 0.85 and v_a1 > 0.8) then
    raise exception 'PD8 go-live refused: the derivative fit quality and span no longer meet the engine''s own high-confidence conditions, so the fact that the ambiguous flag alone demotes this reading to low confidence has nothing to show';
  end if;
  if v_i3 <= c_coning then
    raise exception 'PD8 go-live refused: the derivative slope is at or below the coning threshold, so the firm end of the reading has fired and the well is not the ambiguous case at all';
  end if;

  -- ================= PROFESSIONAL: THE ACID JOB ==========================
  if abs(v_i6 - (v_lnre - c_pss + c_skin) / (v_lnre - c_pss + c_acid)) > 0.000006 then
    raise exception 'PD8 go-live refused: the graded acid multiplier of % is not the geometry group before the job over the group after it, which gives %', v_i6, (v_lnre - c_pss + c_skin) / (v_lnre - c_pss + c_acid);
  end if;
  -- THE CROSS-TIER IDENTITY, STATED AS ARITHMETIC RATHER THAN AS A NUMBER IN A
  -- PROMPT. The multiplier times the after-job denominator is the Associate
  -- tier's geometry group exactly, and neither prompt states the other's value.
  if abs(v_i6 * (v_lnre - c_pss + c_acid) - v_b5) > 1e-9 then
    raise exception 'PD8 go-live refused: the acid multiplier times the denominator after the job is % rather than the Associate tier''s geometry group of %, so the two tiers are no longer tied by the identity that let both be graded without either prompt disclosing the other', v_i6 * (v_lnre - c_pss + c_acid), v_b5;
  end if;
  if not (v_i6 > 2 and v_i6 < 3) then
    raise exception 'PD8 go-live refused: the acid multiplier of % is outside the band that makes an honest job on a damaged well worth having without being a fantasy', v_i6;
  end if;
  -- the module's own first gate: the multiplier is EXACTLY one when the skin
  -- does not change, because it is one number divided by itself.
  if abs((v_lnre - c_pss + c_skin) / (v_lnre - c_pss + c_skin) - 1) > 1e-15 then
    raise exception 'PD8 go-live refused: the multiplier is not exactly one when the skin does not change, so the module''s own first gate no longer holds on this geometry';
  end if;
  if v_lnre - c_pss + c_acid <= 0 then
    raise exception 'PD8 go-live refused: the designed acid job is below this geometry''s floor, so the engine would refuse it and there is nothing to grade';
  end if;

  -- ================= EXPERT: THE SPAN THE DROP COST ======================
  if abs(v_a1 - v_sp) > 0.000002 then
    raise exception 'PD8 go-live refused: the graded derivative span of % log cycles is not the log-time span of the positive-derivative samples in the late window, which gives %', v_a1, v_sp;
  end if;
  if v_a1 <= c_minspan then
    raise exception 'PD8 go-live refused: the derivative span of % is at or below the module''s own minSpanDecades of 0.4, so the engine would have refused this reading outright and the graded diagnosis does not exist', v_a1;
  end if;
  if v_a1 >= (ln(c_wt1) - ln(v_w55)) / ln(10.0::double precision) then
    raise exception 'PD8 go-live refused: the reported derivative span of % is not shorter than the % log cycles the late window actually runs, so the span named as though it described the reading now does describe it and the finding has gone', v_a1, (ln(c_wt1) - ln(v_w55)) / ln(10.0::double precision);
  end if;
  -- AND THE SHORTFALL IS EXACTLY THE LOG TIME THE DROPPED SAMPLES CARRIED.
  if abs(((ln(c_wt1) - ln(v_w55)) / ln(10.0::double precision) - v_a1)
         - (ln(c_wt1) - ln(v_lastpos)) / ln(10.0::double precision)) > 1e-9 then
    raise exception 'PD8 go-live refused: the span the derivative fit loses is not the log time between the last rising sample and the end of the record, so the compounding cost is no longer the drop';
  end if;
  if abs(v_lastpos - v_tbreak) > 1e-9 then
    raise exception 'PD8 go-live refused: the last sample the derivative fit could use is not the break sample, so the drop is not the choke';
  end if;

  -- ================= EXPERT: THE DISCARDED EVIDENCE ======================
  select regr_slope(ln(ratio), ln(t)), regr_r2(ln(ratio), ln(t)), count(*)
    into v_s, v_pcr2, v_n from pd8_wor where t > c_choke and ratio > 0;
  if abs(v_a2 - v_s) > 0.000002 then
    raise exception 'PD8 go-live refused: the graded post-choke ratio slope of % is not the least squares over the samples strictly later than the choke, which gives %', v_a2, v_s;
  end if;
  if v_n <> 4 then
    raise exception 'PD8 go-live refused: the post-choke fit sits on % samples rather than the 4 the diagnosis discarded', v_n;
  end if;
  if v_a2 >= 0 then
    raise exception 'PD8 go-live refused: the post-choke ratio slope of % is not negative, so the water-oil ratio did not turn back down, the coning field test is not satisfied, and the capstone no longer argues two verdicts at once', v_a2;
  end if;
  -- THE HALF THAT MATTERS. The evidence the fit threw away fits BETTER than
  -- the verdict the engine reported.
  if v_pcr2 <= v_i4 then
    raise exception 'PD8 go-live refused: the discarded stretch fits at % against the reported verdict''s %, so the thrown-away evidence is no longer the cleaner reading and the centre of the Expert tier is gone', v_pcr2, v_i4;
  end if;
  if v_pcr2 <= 0.99 then
    raise exception 'PD8 go-live refused: the discarded stretch fits at only %, which is not clean enough to be evidence of anything and would make the filter defensible', v_pcr2;
  end if;
  -- and it is the ONLY negative slope among the eighteen, which is what makes
  -- its sign the finding rather than a coincidence of this one field.
  if not (v_b1 > 0 and v_i1 > 0 and v_i3 > 0 and v_a3 > 0 and v_a4 > 0 and v_a5 > 0) then
    raise exception 'PD8 go-live refused: another graded slope has turned negative, so the post-choke slope''s sign is no longer the distinguishing evidence';
  end if;

  -- ================= EXPERT: THE DIAL ====================================
  if floor(c_worn * (1 - c_lf30)) <> 32 then
    raise exception 'PD8 go-live refused: the short window no longer cuts at index 32, it cuts at %', floor(c_worn * (1 - c_lf30));
  end if;
  if floor(c_worn * (1 - c_lf90)) <> 4 then
    raise exception 'PD8 go-live refused: the long window no longer cuts at index 4, it cuts at %', floor(c_worn * (1 - c_lf90));
  end if;
  select t into v_w30 from pd8_wor order by t offset 32 limit 1;
  select t into v_w90 from pd8_wor order by t offset 4 limit 1;
  select regr_slope(ln(der), ln(t)), (ln(max(t)) - ln(min(t))) / ln(10.0::double precision)
    into v_s, v_span30 from pd8_wor where t >= v_w30 and der > 0;
  if abs(v_a3 - v_s) > 0.000003 then
    raise exception 'PD8 go-live refused: the graded short-window derivative slope of % is not the least squares over the positive-derivative samples from that window, which gives %', v_a3, v_s;
  end if;
  select regr_slope(ln(der), ln(t)) into v_s from pd8_wor where t >= v_w90 and der > 0;
  if abs(v_a4 - v_s) > 0.000003 then
    raise exception 'PD8 go-live refused: the graded long-window derivative slope of % is not the least squares over the positive-derivative samples from that window, which gives %', v_a4, v_s;
  end if;
  if v_a3 <= v_a4 then
    raise exception 'PD8 go-live refused: the short window returns % against the long window''s %, so a shorter window is no longer the steeper reading on this well', v_a3, v_a4;
  end if;
  -- ONE SERIES, TWO MECHANISMS, AND THE PAIR IS THE FINDING.
  if v_a3 <= c_channel then
    raise exception 'PD8 go-live refused: the short-window slope of % does not clear the channelling threshold, so both windows now give the same mechanism and the dial has stopped deciding anything', v_a3;
  end if;
  if v_a4 >= c_channel then
    raise exception 'PD8 go-live refused: the long-window slope of % does not fall below the channelling threshold, so both windows now give the same mechanism and the water shutoff no longer flips from a candidate to a block on a dial', v_a4;
  end if;
  -- THE DIAL IS WORTH AN ORDER OF MAGNITUDE MORE THAN THE MARGIN.
  if (v_a3 - v_a4) <= 10 * (v_i3 - c_channel) then
    raise exception 'PD8 go-live refused: the dial moves the slope by % while the verdict clears its threshold by %, which is less than the order of magnitude that makes the analyst''s undocumented choice worth more than the evidence', v_a3 - v_a4, v_i3 - c_channel;
  end if;
  -- and the whole sweep stays inside the ambiguous band, so every window on
  -- this well is reported as close to the line and only the channelling one
  -- ever gets the caveat attached.
  if abs(v_a3 - c_channel) > c_band or abs(v_a4 - c_channel) > c_band then
    raise exception 'PD8 go-live refused: one of the two swept windows falls outside the ambiguous band, so the finding that every reading here is flagged ambiguous while only one is cautioned no longer holds';
  end if;
  -- THE SHORT WINDOW NEARLY COSTS THE READING, and it is a pair: the fit
  -- clears refusal by a hair, and it would have cleared comfortably had
  -- nothing been dropped.
  v_rawspan30 := (ln(c_wt1) - ln(v_w30)) / ln(10.0::double precision);
  if v_span30 <= c_minspan then
    raise exception 'PD8 go-live refused: the short window''s derivative fit spans % and is refused outright, so there is no slope at that setting to grade', v_span30;
  end if;
  if v_span30 - c_minspan >= 0.02 then
    raise exception 'PD8 go-live refused: the short window clears the span gate by %, which is comfortable, so the compounding cost of the drop no longer nearly costs the reading', v_span30 - c_minspan;
  end if;
  if v_rawspan30 - c_minspan <= 0.2 then
    raise exception 'PD8 go-live refused: the short window would have cleared the span gate by only % without the drop, so the drop is not what nearly refused it', v_rawspan30 - c_minspan;
  end if;
  if abs((v_rawspan30 - v_span30) - ((ln(c_wt1) - ln(v_lastpos)) / ln(10.0::double precision))) > 1e-9 then
    raise exception 'PD8 go-live refused: the span the short window loses is not the same log time the graded window loses, so the drop is not a constant cost of the same four samples';
  end if;

  -- ================= EXPERT: THE FAILS-OPEN ==============================
  if floor(c_gorn * (1 - c_lf55)) <> 13 then
    raise exception 'PD8 go-live refused: the gas history''s late window no longer cuts at index 13, it cuts at %', floor(c_gorn * (1 - c_lf55));
  end if;
  select t into v_wgas from pd8_gor order by t offset 13 limit 1;
  select regr_slope(ln(ratio), ln(t)), regr_r2(ln(ratio), ln(t)), count(*)
    into v_s, v_r2, v_n from pd8_gor where t >= v_wgas and ratio > 0;
  if abs(v_a5 - v_s) > 0.000002 then
    raise exception 'PD8 go-live refused: the graded gas ratio slope of % is not the least squares over the gas history''s own late window, which gives %', v_a5, v_s;
  end if;
  -- THE FLAT BRANCH'S CONDITION, REPRODUCED. Every derivative in that window
  -- coerces to exactly zero and none is negative, which is precisely the test
  -- the branch makes, and it is satisfied because the column is null rather
  -- than because anything is flat.
  select count(*) into v_n2 from pd8_gor where t >= v_wgas;
  if v_n <> v_n2 or v_n2 < 1 then
    raise exception 'PD8 go-live refused: the gas late window holds % rows of which % survive the ratio filter, so the flat branch''s own condition is not what fires here', v_n2, v_n;
  end if;
  -- and the SAME return object contradicts the note beside it
  if v_a5 <= 0 then
    raise exception 'PD8 go-live refused: the gas ratio slope of % is not positive, so the object no longer contradicts its own note that the ratio is sitting flat', v_a5;
  end if;
  if not (v_a5 > 0.5 and v_a5 < 0.75) then
    raise exception 'PD8 go-live refused: the gas ratio slope of % is outside the band that makes a ratio the engine calls flat visibly climbing', v_a5;
  end if;
  if v_r2 <= 0.9 then
    raise exception 'PD8 go-live refused: the gas ratio fit quality is only %, so the climb the engine calls flat is no longer a clean one and the contradiction inside the return object is arguable', v_r2;
  end if;
  select ratio into v_gasfirst from pd8_gor where t >= v_wgas order by t limit 1;
  select ratio into v_gaslast  from pd8_gor order by t desc limit 1;
  if v_gaslast / v_gasfirst <= 2.5 then
    raise exception 'PD8 go-live refused: the gas-oil ratio rises by a factor of only % across the window the engine calls flat, which is no longer the size that makes the verdict indefensible', v_gaslast / v_gasfirst;
  end if;
  -- AND THE RATIO GATE IS INERT ON THIS FLUID, which is the second half of the
  -- same defect: minWor is named for a water-oil ratio and applied unchanged.
  if v_gaslast / c_minwor <= 10000 then
    raise exception 'PD8 go-live refused: the last gas-oil ratio clears the water-oil-ratio gate by only a factor of %, so the unit blindness of that threshold no longer has four orders of magnitude to show', v_gaslast / c_minwor;
  end if;

  -- ================= EXPERT: THE GUARD IN THE WRONG PLACE ================
  if abs(v_a6 - (v_lnre - c_pss + c_skin) / (v_lnre - c_pss + c_over)) > 0.00004 then
    raise exception 'PD8 go-live refused: the graded overreach multiplier of % is not the geometry group before over the group at the requested skin, which gives %', v_a6, (v_lnre - c_pss + c_skin) / (v_lnre - c_pss + c_over);
  end if;
  -- (1) IT IS ACCEPTED. The denominator is strictly positive, so nothing in
  -- the engine refuses it and it comes back ok true with no warning.
  if v_lnre - c_pss + c_over <= 0 then
    raise exception 'PD8 go-live refused: the overreached design is below this geometry''s pole, so the engine refuses it and the finding that it is accepted in silence is false';
  end if;
  -- (2) IT IS PAST EVERYTHING THE REFUSAL TEXT CALLS REAL.
  if c_over >= c_realfrac then
    raise exception 'PD8 go-live refused: the requested skin of % is not below the -6 the module''s own refusal text calls the deepest realistic fracture, so nothing implausible is being accepted', c_over;
  end if;
  if c_over <= v_b6 then
    raise exception 'PD8 go-live refused: the requested skin of % is at or below the geometry floor of %, so it would be refused and the silent band is not where the finding says it is', c_over, v_b6;
  end if;
  -- (3) AND WHAT IT HANDS BACK IS A LARGE MULTIPLE OF THE HONEST ANSWER.
  if v_a6 / v_i6 <= 6 then
    raise exception 'PD8 go-live refused: the overreached design is worth only % times the honest acid job, which is not the size that makes accepting it in silence a commercial problem', v_a6 / v_i6;
  end if;
  if v_a6 <= v_i6 then
    raise exception 'PD8 go-live refused: the overreached design is worth no more than the honest one, so the whole shape of the finding is wrong';
  end if;
  -- (4) THE GUARD DOES EXIST AND DOES FIRE, JUST IN THE WRONG PLACE. A request
  -- a little deeper is refused, so this is a guard at the singularity rather
  -- than a missing guard.
  if v_lnre - c_pss + c_refuse > 0 then
    raise exception 'PD8 go-live refused: a design at % is not refused either, so the guard is missing rather than misplaced and the finding is a different one', c_refuse;
  end if;
  -- (5) AND THE REFUSAL MESSAGE COMPARES A NUMBER AGAINST ITSELF ON THIS
  -- GEOMETRY. The floor and the deepest request the geometry still accepts
  -- round to the same one decimal place, and the sentence prints both to one
  -- decimal, so a reader cannot tell from it what was refused.
  if round(v_b6::numeric, 1) <> round((v_b6 - 0.006)::numeric, 1) then
    raise exception 'PD8 go-live refused: the geometry floor no longer shares a one-decimal rounding with a request just below it, so the refusal message on this geometry no longer compares a number against itself';
  end if;
  if v_lnre - c_pss + round(v_b6::numeric, 1)::double precision > 0 then
    raise exception 'PD8 go-live refused: a request at the floor''s own printed value is still accepted, so the self-comparing refusal message cannot be reached on this geometry';
  end if;

  -- ================= THE FIELDS DO NOT COLLIDE WITH EACH OTHER ===========
  -- Eighteen values graded at absolute tolerances, several of them slopes near
  -- one and fit qualities near one. A grader that could not tell two of them
  -- apart would pass an answer written in the wrong row.
  select count(*) into v_graded
    from public.academy_capstones c1, lateral jsonb_array_elements(c1.fields) f1,
         public.academy_capstones c2, lateral jsonb_array_elements(c2.fields) f2
   where c1.app_slug = 'intervention' and c2.app_slug = 'intervention'
     and (f1->>'key') < (f2->>'key')
     and abs((f1->>'expected')::numeric - (f2->>'expected')::numeric)
         < 50 * ((f1->>'tol')::numeric + (f2->>'tol')::numeric);
  if v_graded <> 0 then
    raise exception 'PD8 go-live refused: % pair(s) of graded fields sit within fifty times their combined tolerance of each other, so a right answer in the wrong row would grade as correct', v_graded;
  end if;
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'intervention'
     and ((f->>'tol')::numeric <= 0 or (f->>'tol')::numeric > 0.0005);
  if v_graded <> 0 then
    raise exception 'PD8 go-live refused: % graded field(s) carry a tolerance that is not positive and tight, and a diagnostic graded loosely certifies nothing', v_graded;
  end if;

  drop table pd8_wor;
  drop table pd8_gor;

  -- ------------------------------------------------------------ the flip --
  update public.academy_apps
     set status = 'available'
   where slug = 'intervention' and status = 'coming_soon';

  if not exists (select 1 from public.academy_apps where slug = 'intervention' and status = 'available') then
    raise exception 'PD8 go-live refused: intervention did not reach status available';
  end if;

  raise notice 'PD8 go-live: intervention is available, behind nodal, at path_order 37.';
end $$;
