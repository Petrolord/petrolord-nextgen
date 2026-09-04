-- ============================================================================
-- PD8: Well Intervention joins the catalog, the EIGHTH Production &
-- Artificial Lift course.
--
-- Catalog row (module 'production'; path_order 37; prereq_slug 'nodal') plus
-- the three capstones and their eighteen graded fields. Deep seeds are three
-- separate migrations; the go-live is a fifth and is HELD.
--
-- THE ONE SENTENCE THE COURSE IS. A Chan diagnosis is a straight line fitted
-- to PART of a plot, so the window the line was taken over is part of the
-- answer, the fit quality is a statement about the line rather than about the
-- well, and the samples the fit declined to draw are the ones arguing for the
-- other mechanism.
--
-- WHAT THE COURSE COVERS AND WHAT IT DELIBERATELY DOES NOT. PD1 owns the node
-- and the inflow curve, PD7 owns the gathering system, and none of that is
-- repeated. PD8's engine is interventionDiagnostics.js and it is a DIAGNOSTIC:
-- it sizes nothing. The only dimensional number it returns anywhere is the
-- start of the late window in days; every verdict it returns is a string or a
-- boolean and cannot be graded; and what is left to grade is slopes,
-- intercepts, fit qualities, spans and two dimensionless groups. So the course
-- certifies no rate, no volume, no pressure, no cost and no schedule, and the
-- go-live refuses any graded field that claims one.
--
-- THE TIERS SPLIT ON A SEAM IN THE CODE RATHER THAN ON A SYLLABUS, AND THE
-- SEAM IS THE WINDOW. Four of the Associate tier's six fields are the four
-- continuous members of ONE `logLogSlope` return on a whole raw history, and
-- the other two, `pssDenominator` and `minimumSkin`, take no series and no
-- window at all: that is ASSOCIATE, THE FIT AND THE GEOMETRY, and it is
-- exactly the part of the module with no window, no classifier and no verdict
-- anywhere near it. Five of the Professional tier's six come back from ONE
-- `chanDiagnosis` call and ONE OF THOSE FIVE IS THE WINDOW ITSELF, with the
-- sixth being what the alternative to a water job is worth: that is
-- PROFESSIONAL, THE WINDOWED READING AND WHAT IT DECIDES. And every one of the
-- Expert tier's six is a return of the SAME functions re-run on the samples
-- the classifier discarded, at the dial settings where its verdict flips, on a
-- column that was never filled in, or past the plausibility limit the module's
-- own refusal text names: that is EXPERT, WHAT THE FIT LEFT OUT. Nothing new
-- is introduced in the Expert tier at all, which is the shape of the argument.
--
-- FIVE RESULTS THE COURSE IS BUILT ON, EVERY ONE RUN AGAINST THE ENGINE.
--
--   (1) FOR ANY POWER-LAW HISTORY THE RATIO AND ITS DERIVATIVE HAVE THE SAME
--   LOG-LOG SLOPE, SO NOTHING SEPARATES DISPLACEMENT FROM CHANNELLING EXCEPT
--   HOW STEEP THE CLIMB IS. The engine's own comment concedes it:
--   d(a t^m)/d(ln t) = m a t^m. That is why `channellingSlope` sits at 1.3 and
--   `ambiguousBand` at 0.25, and why a THRESHOLD rather than a physics decides
--   whether a squeeze is recommended. The Associate tier says it plainly and
--   the Expert tier prices it.
--
--   (2) THE ANALYST'S WINDOW MOVES THE SLOPE BY FAR MORE THAN THE MARGIN THAT
--   DECIDES THE MONEY. On the teaching well the derivative slope moves by
--   0.370920348 across the range of `lateFraction`, on 38 samples with not one
--   datum changed, and the water shutoff comes back a candidate on one window
--   and blocked on another. `lateFraction` has a default of 0.5, no guidance
--   anywhere, no sweep helper, and nothing in the return object that names its
--   effect. It is also silently clamped to 0.1 through 1.0, which is
--   documented nowhere. AND THE TOP END OF THAT RANGE IS TAKEN FROM A READING
--   THE ENGINE REFUSED: at `lateFraction` 0.20 the span gate returns
--   `mechanism: indeterminate` with no `spanDecades` key at all and with
--   `derivativeSlope` and `derivativeR2` FULLY POPULATED at 1.600276347, the
--   steepest slope in the sweep, off a window it declined to read, while the
--   `!derFit.ok` branch immediately above it nulls both. Two refusals in one
--   function with two different return shapes.
--
--   (3) THE CONTRARY EVIDENCE IS FILTERED OUT BEFORE THE FIT, AND THE COUNT OF
--   IT IS COMPUTED AND THEN DISCARDED. `chanDiagnosis` builds its derivative
--   fit from the late samples whose derivative is POSITIVE, so a ratio that
--   has turned back down after a rate cut is read entirely on the samples from
--   before the turn. The engine counts `negativeDerivatives` two lines later
--   and reads that count only on branches this case never reaches, so the note
--   it carries, that a ratio which has turned back down is itself the coning
--   signature, is unreachable whenever three positive samples survive. On the
--   teaching well the discarded stretch fitted on its own has a fit quality of
--   0.999955540, CLEANER than the 0.998513658 the engine reported for the
--   verdict it actually gave. The module's own header says channelling and
--   coning need OPPOSITE treatments and that recommending the wrong one is
--   money down a hole.
--
--   (4) A MISSING DERIVATIVE COLUMN IS READ AS A DERIVATIVE OF ZERO AND
--   RETURNS A REASSURING VERDICT. THIS IS THE FAILS-OPEN. `Number(null)` is 0,
--   and so is `Number('')` and `Number([])`; only `Number(undefined)` is NaN.
--   The filter requires a finite time and a finite ratio and does NOT require
--   a finite derivative, so a history exported without the Bourdet derivative
--   takes the FLAT BRANCH and comes back as ordinary displacement, "nothing on
--   this well for an intervention to fix". The same history spelled
--   `undefined` comes back as not determined. Same missing data, opposite
--   answers, and the reassuring one is the spelling every JSON export and
--   every SQL null produces. On the teaching gas history the ratio the engine
--   calls flat climbs by a factor of 2.248088575 across that window, and it is
--   the fluid the module's own gas reasoning sends the user to.
--
--   (5) TWO FITS IN ONE RETURN OBJECT, MEASURED ON TWO DIFFERENT WINDOWS, AND
--   A SPAN NAMED AS THOUGH IT DESCRIBED THE READING. The ratio slope is fitted
--   over every late sample and the derivative slope over only the positive
--   ones. On the teaching well at the default window that is 19 samples
--   against 15, the two come back side by side as 1.040602176 and
--   1.442132492, and the derivative fit's span is 0.257320134 of a log cycle
--   shorter than the window it claims to describe. Nothing in the object says
--   so, and the compounding cost is real, because the span has its own gate at
--   `minSpanDecades`: on a short enough window the drop is the difference
--   between a reading and a refusal.
--
-- FOUR MORE, SMALLER, AND ALL EXPERT.
--   `screenTreatments` CALLS A CLIMBING DERIVATIVE FLAT. It branches on
--   `mechanism.id` alone and pushes a fixed reason per branch: coning says
--   "falling" and channelling says "climbing", both right, and displacement
--   says "flat" when displacement IS the roughly proportional climb.
--   `chanDiagnosis` in the same file writes "climbing at a slope of 1.00,
--   which is about proportional" for that same mechanism. The string is
--   emitted on every displacement well and it is one of the two sentences a
--   planner pastes into a recommendation.
--   THE ZERO-VARIANCE GUARD FIRES BY ACCIDENT. Whether the sum of squares
--   reaches exactly zero over identical y depends on the sample count AND the
--   value together: it fires at n = 3 and n = 4 on every value tried, splits
--   at n = 5, and mostly stops from n = 8. It fires on small tidy cases and
--   not on real ones, which is worse than never firing, because that is the
--   pattern that survives a test suite. A ratio rising exactly
--   logarithmically has an exactly constant derivative and is refused with
--   "the fit explains only 0.0 percent of it", on data with no scatter at all.
--   THE SKIN GUARD SITS AT THE SINGULARITY, NOT AT PLAUSIBILITY.
--   `skinPiMultiplier` refuses only when the denominator reaches zero, and its
--   refusal text then advertises a completely different limit, that real
--   treatments reach about -3 to -5 on acid and -5 to -6 on a fracture.
--   Everything between is accepted in silence, and `minimumSkin` is computed
--   on every call and returned INSIDE the successful result and is never
--   compared against anything but zero. When the refusal finally comes it can
--   compare a number against itself, because both are printed to one decimal.
--   AND THE SCREENING DOES NOT KNOW WHICH FLUID IT READ. It reads only
--   `mechanism.id`, and nothing in the diagnosis says whether it read a
--   water-oil ratio or a gas-oil ratio, while the module's own gas reasoning
--   sends the user to run it on the gas. Hand the screening the gas diagnosis
--   and the WATER shutoff comes back blocked, with its reasons quoting the
--   water cut.
--
-- WHAT THE ORACLE RECORDS, AND WHERE IT STOPS. oracle_intervention.py is a
-- good oracle as far as it goes and the course says so before it says anything
-- else. It checks the log-log slope by THEIL-SEN, the median of every pairwise
-- slope, which shares no mean, no square and no covariance with the engine's
-- ordinary least squares. It checks the skin uplift by building a full radial
-- Darcy rate in SI, permeability in square metres and pressures in pascals,
-- and dividing two real flow rates against the engine's ratio of two
-- dimensionless groups. Two genuinely independent routes onto two pure
-- arithmetic functions, and both hold to machine precision. Then it stops. The
-- golden publishes four labelled histories with a late derivative slope for
-- each, five skin pairs, one geometry floor and one power law, and it
-- publishes NO expected mechanism, NO expected confidence, NO expected
-- verdict, NO expected refusal and NO expected block reason. `chanDiagnosis`,
-- `screenTreatments`, `rankTreatments` and `skinFromPiRatio` are not asserted
-- against anything at all. THE ONLY PART OF THIS MODULE THAT RETURNS A VERDICT
-- IS THE PART WITH NO GOLDEN, and one of the silences is silence by
-- construction: the oracle's own late-slope helper applies the SAME
-- positive-derivative filter the engine does, and none of its four histories
-- changes sign in the late window, so result (3) could not be caught by that
-- referee even in principle. Same shape the ESP, rod pump, flow assurance and
-- network waves found. The oracle's silence was the finding.
--
-- THE CAPSTONE IS A WELL THE LESSONS NEVER TOUCH: BOMU-17, a damaged oil
-- producer with a long history, one event in the middle of it, and a gas-oil
-- ratio series exported from a production database with the Bourdet derivative
-- column never computed. It is NOT the teaching well in the digest and it
-- shares no condition with any published golden case, which is the DR2 rule.
-- Four things are tuned into it and every one is verified from the engine's
-- own printed return rather than assumed: THE HISTORY SUPPORTS TWO VERDICTS AT
-- ONCE, because the ratio climbs faster than proportionally for most of the
-- well's life and then falls after the well is beaned back, which is the
-- coning field test and the coning answer, and the engine reports only the
-- first; IT SUPPORTS THE CHANNELLING VERDICT ON A HAIR, with the derivative
-- slope landing a little above `channellingSlope` so a shade less turns the
-- water shutoff from a candidate into a block; THE ANALYST'S WINDOW DECIDES
-- THE SPEND, since the same series read at three window fractions gives three
-- derivative slopes and two mechanisms; and THE GAS SIDE FAILS OPEN, on the
-- fluid the engine's own text sends the user to, in the JavaScript spelling
-- every exporter emits.
--
-- WHAT IS NOT GRADEABLE IS NOT GRADED. Every verdict this module returns is a
-- string or a boolean: the mechanism id, the confidence, the ambiguous flag,
-- the seven treatment verdicts and every block reason. None of them is a
-- graded field, and the go-live asserts the numbers UNDERNEATH them instead,
-- together with the thresholds those numbers are compared against, so that
-- what a verdict turned on is checkable even though the verdict itself is not.
--
-- THE PROMPTS WERE WRITTEN AGAINST THE CROSS-TIER LEAK RULE. Every tier's
-- prompt restates the histories, the geometry and the window from the raw
-- conditions, and NO tier's prompt states a number another tier is graded on,
-- nor any quantity another tier's answer can be recovered from by one
-- multiplication or one division. The Associate tier's pseudo-steady-state
-- denominator was drafted into both upper prompts as the numerator of the two
-- graded multipliers and REMOVED, because a multiplier is one division from a
-- stated denominator; the Professional tier's window start in days was drafted
-- into the Expert prompt as the anchor for the span comparison and removed,
-- because a span is one logarithm from a stated window start. The three tiers
-- are tied together by IDENTITIES the free checks state in WORDS instead,
-- which is the device PD5 used on its cycle gas, PD6 on its heat-loss-only
-- arrival and PD7 on its manifold pressure. PD3 shipped a capstone prompt
-- stating another tier's graded value at a tolerance of 0.00, and the fix is
-- always to DECOUPLE the fields rather than to disclose. The check runs HERE,
-- in this file, immediately after the capstones are inserted, and the go-live
-- re-reads the STORED prompts and refuses on regression.
--
-- THE GOLDENSWEEP RAN BEFORE THIS FILE WAS WRITTEN, against the goldens AND
-- the teaching digest: eighteen graded values against 2266 published numbers,
-- ZERO collisions and no approach closer than 45.6 times a field's own grading
-- tolerance, which is the derivative fit quality against the teaching
-- constant-derivative demonstration's ratio fit quality.
--
-- STATUS deliberately left 'coming_soon'. The flip to 'available' is held in
-- 20260904_pd8_intervention_go_live.sql and must not run until a NextGen
-- production upload carries /dashboard/apps/intervention.
-- ============================================================================

insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)
values ('intervention', 'Well Intervention', 'production', 37, 'coming_soon', 'nodal')
on conflict (slug) do nothing;

insert into public.academy_capstones
    (app_slug, tier, cert_tier, dataset, title, prompt, fields)
values
(
  'intervention', 'beginner', 'associate',
  'the whole of BOMU-17''s water-oil ratio history, fitted as one, and the geometry it sits in',
  'The fit and the geometry',
  'Six values for the oil producer BOMU-17, and every one of them is available before any window is chosen and before anything is diagnosed. THE WATER-OIL RATIO HISTORY is 46 samples spaced GEOMETRICALLY in time from 24 to 2900 PRODUCING DAYS, so sample i sits at 24 times 2900 over 24 raised to the power i over 45, counting i from zero. The ratio is a bare stb/stb RATIO and it is built from two closed forms. For every sample at or before day 1900 it is WOR of t equals c1 times t plus c2 times t to the power p, with c1 equal to 0.0015 PER DAY, p equal to 1.8, and c2 fixed by making the two terms equal at a crossover of 2300 DAYS, so c2 equals c1 times 2300 raised to the power one less p. On DAY 1900 the well was BEANED BACK. For every sample after that day the ratio relaxes towards a residual of 1.4: WOR of t equals 1.4 plus the quantity WOR at the break less 1.4, all times t over t at the break raised to the power minus 0.9, where the break is the LAST SAMPLE AT OR BEFORE day 1900 and WOR at the break is the ratio there. THE DERIVATIVE COLUMN alongside it is d WOR by d ln t, taken analytically from those same two forms and never differenced. THE GEOMETRY: a drainage radius of 1480 FT, a wellbore radius of 0.29 FT, and a measured SKIN of 6.4. Report: (1) the LOG-LOG SLOPE of the ratio history fitted AS ONE, every sample, no window; (2) that same fit''s INTERCEPT; (3) that same fit''s FIT QUALITY, as a FRACTION and not a percentage; (4) that same fit''s SPAN, in LOG CYCLES; (5) the PSEUDO-STEADY-STATE DENOMINATOR at the measured skin; and (6) the MOST NEGATIVE SKIN this geometry allows. What the history says once a late window is chosen belongs to the tiers above and is not asked for here. Traps. Fields 1 through 4 are ORDINARY LEAST SQUARES of the natural log of the ratio against the natural log of the time, which is not the median of pairwise slopes and does not have to agree with one; on a history that is not a single power law the two estimators weight a curved log-log trend differently and both are right about their own question. The fit is on the RATIO column and not on the derivative column, and the two do not have the same slope here because this history is a SUM of two power laws and not one. Field 2 is the intercept in LOG SPACE, the natural log of the ratio the fitted line passes through at t equal to ONE DAY, which is far outside the data and is not the first sample. Field 4 is the base-ten logarithm of the ratio of the largest surviving time to the smallest surviving time, which is a span in TIME and never a span in ratio, and it is measured on the points that SURVIVED the fit''s own filter rather than on the points handed in. A log-log slope carries NO UNIT at all: it is d ln y over d ln x. Field 5 is the natural logarithm of the drainage radius over the wellbore radius, LESS THREE QUARTERS, PLUS the skin undivided; three quarters is the pseudo-steady-state constant for a circular drainage area, it is not a fudge, it is not adjustable, and one half would be a different flow regime. Field 6 is where that same group reaches ZERO and the productivity index goes infinite, which is a mathematical floor and not an achievable target, and it is not the shallower limit that real acid jobs and fractures reach. Free checks: field 5 PLUS field 6 must equal EXACTLY 6.4, the measured skin, because the two differ only by that skin, and getting that identity to close is the whole of what the geometry group is. Field 6 must be negative and field 5 positive, and field 5 must be larger than the natural logarithm of 1480 over 0.29 less three quarters, by exactly the skin. Field 3 must land strictly between zero and one and must NOT be read as a percentage anywhere. Field 4 must equal the base-ten logarithm of 2900 over 24 to the last bits a double carries, because every ratio in this history is strictly positive and so the fit''s filter drops NOTHING, which is the one case where a returned point count and an input point count are the same number. Field 1 must land above one and below one and a quarter, so the ratio is climbing FASTER than proportionally over the well''s life as a whole. And the natural exponential of field 2 must come out far below the first sample''s ratio, which is what an intercept extrapolated back to one day looks like on a history that starts at 24 days.',
  jsonb_build_array(
    jsonb_build_object('key','wor_loglog_slope_full',       'label','Full-history log-log slope of the water-oil ratio','unit','dimensionless','expected',1.0917339879792818,  'tol',0.000002),
    jsonb_build_object('key','wor_loglog_intercept_full',   'label','Full-history log-log intercept',                  'unit','ln(stb/stb)',  'expected',-6.813547426032721,  'tol',0.000015),
    jsonb_build_object('key','wor_loglog_r2_full',          'label','Full-history fit quality, as a fraction',         'unit','fraction',     'expected',0.9945801076744271,  'tol',0.000002),
    jsonb_build_object('key','wor_loglog_span_decades_full','label','Full-history span',                               'unit','log cycles',   'expected',2.0821867561873497,  'tol',0.000005),
    jsonb_build_object('key','pss_denominator_at_skin_6p4', 'label','Pseudo-steady-state denominator at the measured skin','unit','dimensionless','expected',14.187671722759779,'tol',0.00003),
    jsonb_build_object('key','minimum_skin_for_geometry',   'label','Most negative skin this geometry allows',         'unit','dimensionless','expected',-7.787671722759779,  'tol',0.00002)
  )
),
(
  'intervention', 'intermediate', 'professional',
  'BOMU-17 read through a stated late window, and what the alternative to a water job is worth',
  'The windowed reading',
  'Six values that only exist once a LATE WINDOW has been chosen. THE SAME WELL, restated in full so nothing has to be carried across from another tier. THE WATER-OIL RATIO HISTORY is 46 samples spaced GEOMETRICALLY in time from 24 to 2900 PRODUCING DAYS, so sample i sits at 24 times 2900 over 24 raised to the power i over 45, counting i from zero. For every sample at or before day 1900 the ratio is WOR of t equals c1 times t plus c2 times t to the power p, with c1 equal to 0.0015 PER DAY, p equal to 1.8 and c2 equal to c1 times 2300 raised to the power one less p. On DAY 1900 the well was BEANED BACK, and for every sample after that day the ratio relaxes towards a residual of 1.4 as WOR of t equals 1.4 plus the quantity WOR at the break less 1.4, all times t over t at the break raised to the power minus 0.9, with the break being the LAST SAMPLE AT OR BEFORE day 1900. The derivative column is d WOR by d ln t, analytic, never differenced, and it is NEGATIVE on every sample after the choke. THE GEOMETRY: a drainage radius of 1480 FT, a wellbore radius of 0.29 FT, a measured SKIN of 6.4. THE READING IS TAKEN AT A LATE FRACTION OF 0.55, which is NOT the module default. The window starts at the sample whose index is the FLOOR of the sample count times one less that fraction, counting from zero, and the reading is everything from that sample onward. AND A DESIGNED ACID JOB is on the table alongside any water work: the same well taken from its measured skin down to an AFTER-SKIN OF -2.5. Report: (1) the LOG-LOG SLOPE of the RATIO over the late window; (2) that ratio fit''s FIT QUALITY, as a FRACTION; (3) the LOG-LOG SLOPE of the DERIVATIVE over the late window; (4) that derivative fit''s FIT QUALITY, as a FRACTION; (5) the TIME THE LATE WINDOW STARTS AT, in DAYS; and (6) the PRODUCTIVITY INDEX MULTIPLIER the designed acid job is worth. Traps. THE TWO SLOPES ARE NOT MEASURED ON THE SAME DATA and the return object does not say so. Field 1 is fitted over EVERY sample in the late window. Field 3 is fitted over only those late samples whose DERIVATIVE IS STRICTLY POSITIVE, so the four post-choke samples are inside field 1''s fit and outside field 3''s, and field 4 is the fit quality of the SHORTER set. Field 5 is a SAMPLE TIME and not a fraction of anything: it is not 45 percent of the record, it is not a time interpolated between samples, and it is not 0.55 times anything. The floor is taken on the SAMPLE COUNT and not on the elapsed days. Fit quality is a FRACTION in this engine and a PERCENTAGE in its own error messages, so fields 2 and 4 are fractions. A log-log slope carries no unit. Field 6 is a RATIO OF TWO PSEUDO-STEADY-STATE DENOMINATORS and nothing else, the one before the job over the one after it, and it is exactly one when the skin does not change; it is not a rate, not a percentage and not an uplift expressed as a difference. Free checks: field 5 must be one of the 46 sample times exactly, and it must be the TWENTY-FIRST of them in time order, so it can be checked by regenerating the history and reading a row rather than by trusting a formula. Field 3 must come out ABOVE field 1 and field 4 must come out ABOVE field 2, which is the signature of a derivative fit taken on a shorter and cleaner stretch than the ratio fit beside it. Field 3 must land ABOVE 1.3, the channelling threshold, but by LESS THAN 0.02, which is what puts this well''s verdict on a hair: a shade less and the mechanism is ordinary displacement and the water shutoff turns from a candidate into a block, with no datum on the well having changed. Field 1 must land between one and one and a quarter, and BELOW the slope of the same history fitted with no window at all, which the Associate tier computes and which is not stated here. Fields 2 and 4 must both sit strictly between zero and one and field 4 must exceed 0.99. And field 6 must equal the natural logarithm of 1480 over 0.29, less three quarters, plus 6.4, all divided by the same expression with -2.5 in place of 6.4; its numerator is the Associate tier''s geometry answer and is not stated here, and field 6 must land between two and three, which is what taking a heavily damaged well most of the way to clean is actually worth.',
  jsonb_build_array(
    jsonb_build_object('key','chan_wor_slope_late',        'label','Late-window log-log slope of the ratio',  'unit','dimensionless','expected',1.082879368115042,  'tol',0.000002),
    jsonb_build_object('key','chan_wor_r2_late',           'label','Late-window ratio fit quality',           'unit','fraction',     'expected',0.9712098240285529, 'tol',0.000002),
    jsonb_build_object('key','chan_derivative_slope_late', 'label','Late-window log-log slope of the derivative','unit','dimensionless','expected',1.3126500458396317,'tol',0.000003),
    jsonb_build_object('key','chan_derivative_r2_late',    'label','Late-window derivative fit quality',      'unit','fraction',     'expected',0.9988473571869138, 'tol',0.000002),
    jsonb_build_object('key','chan_late_window_start_days','label','Start of the late window',                'unit','days',         'expected',202.12851149338593, 'tol',0.0005),
    jsonb_build_object('key','acid_job_pi_multiplier',     'label','Productivity index multiplier of the designed acid job','unit','dimensionless','expected',2.683160465823103,'tol',0.000006)
  )
),
(
  'intervention', 'advanced', 'expert',
  'the samples BOMU-17''s diagnosis discarded, the windows where its verdict flips, and the column nobody filled in',
  'What the fit left out',
  'Six values for BOMU-17 that are invisible from a diagnosis read at face value. THE SAME WELL AGAIN, restated in full. THE WATER-OIL RATIO HISTORY is 46 samples spaced GEOMETRICALLY in time from 24 to 2900 PRODUCING DAYS, sample i at 24 times 2900 over 24 raised to the power i over 45, counting i from zero. At or before day 1900 the ratio is c1 times t plus c2 times t to the power p, with c1 equal to 0.0015 PER DAY, p equal to 1.8 and c2 equal to c1 times 2300 raised to the power one less p. On DAY 1900 the well was BEANED BACK, and after that day the ratio is 1.4 plus the quantity WOR at the break less 1.4, all times t over t at the break raised to the power minus 0.9, the break being the LAST SAMPLE AT OR BEFORE day 1900. The derivative column is d WOR by d ln t, analytic, and it is NEGATIVE on every post-choke sample. THE GEOMETRY: a drainage radius of 1480 FT, a wellbore radius of 0.29 FT, a measured SKIN of 6.4. A LATE FRACTION OF 0.55 is the reading this well is normally taken at, and 0.30 and 0.90 are two other settings of the same dial; in every case the window starts at the sample whose index is the FLOOR of the sample count times one less that fraction, counting from zero. NEW HERE, AND IT IS THE POINT OF THE TIER. A GAS-OIL RATIO HISTORY for the same well, exported from a production database: 30 samples spaced GEOMETRICALLY from 90 to 2900 PRODUCING DAYS, sample i at 90 times 2900 over 90 raised to the power i over 29, with the ratio in SCF/STB equal to 780 plus 0.02687 times t raised to the power 1.4, and with the BOURDET DERIVATIVE COLUMN NEVER COMPUTED, exported on every row as the JSON value null. ALSO NEW: A DESIGN REQUEST at an AFTER-SKIN OF -7.0, past everything the module''s own refusal text calls a real treatment. Report: (1) the SPAN the derivative fit reports at a late fraction of 0.55, in LOG CYCLES; (2) the LOG-LOG SLOPE of the RATIO fitted over ONLY the samples after the choke, strictly later than day 1900; (3) the LOG-LOG SLOPE of the DERIVATIVE at a late fraction of 0.30; (4) the same at a late fraction of 0.90; (5) the LOG-LOG SLOPE OF THE RATIO the gas history''s diagnosis returns at a late fraction of 0.55; and (6) the PRODUCTIVITY INDEX MULTIPLIER the design request at -7.0 comes back with. Traps. Field 1 describes the DERIVATIVE fit''s own window and NOT the reading''s window, and the two are different because the post-choke samples were dropped before the derivative was fitted; a span reported by a fit is a span over the points that survived it, and this one is named as though it described the reading. Field 2 is fitted on the samples the diagnosis DISCARDED, on the RATIO column and not the derivative column, over times STRICTLY GREATER than 1900 days, which is the four samples after the choke and nothing else; a rate cut followed by a falling water-oil ratio is the coning field test and the coning answer, and it is the evidence the reported verdict never saw. Fields 3 and 4 are the SAME 46 samples read through two different windows with not one datum changed. Field 5 is the trap the tier is named for: the exported null is coerced to a derivative of exactly ZERO on every row, zero is finite, the filter never asks for a finite derivative, so the flat branch fires and the engine returns ordinary displacement with a note saying the ratio is sitting flat, WHILE THE SAME RETURN OBJECT CARRIES FIELD 5, computed on the ratio. Field 5 is the GAS history and its ratio is in SCF/STB, and the slope of it is still dimensionless. Field 6 is accepted in SILENCE: the engine refuses a design only when the denominator reaches zero, and -7.0 does not reach it, so ok comes back true with no warning, no note and no flag. Free checks: field 2 must be NEGATIVE while every other slope in this capstone is positive, and that sign is the whole finding. Field 3 must come out ABOVE field 4, because a shorter window on this well is a steeper one, and field 3 must land ABOVE 1.3 while field 4 lands BELOW it, so the same series read at two settings of one undocumented dial gives two different mechanisms and turns the water shutoff from a candidate into a block. Field 1 must come out ABOVE 0.4, the minimum span the reading is gated on, so this reading is not refused; and it must come out BELOW the log-cycle span of the late window it is named for, which the Professional tier''s window start fixes and which is not stated here, with the shortfall being exactly the log time the four dropped samples carried. Field 5 must be POSITIVE and must land between one half and three quarters, on a gas-oil ratio history the engine has just called flat, and the ratio itself climbs by nearly a factor of three across the window that verdict was read on. Field 6 must equal the natural logarithm of 1480 over 0.29, less three quarters, plus 6.4, all divided by the same expression with -7.0 in place of 6.4, and it must come out MORE THAN SIX TIMES the multiplier the honest acid job is worth, which the Professional tier computes and which is not stated here. And the last check is the course itself: field 6 is returned with the same confidence as that honest number, by a function that computes the geometry''s own floor on every call and returns it inside the very same result, and never once compares the request against it.',
  jsonb_build_array(
    jsonb_build_object('key','chan_derivative_span_decades', 'label','Span the derivative fit reports at the stated window','unit','log cycles','expected',0.97168715288743,   'tol',0.000002),
    jsonb_build_object('key','post_choke_wor_slope',         'label','Log-log slope of the ratio over the discarded post-choke samples','unit','dimensionless','expected',-0.6164206816838835,'tol',0.000002),
    jsonb_build_object('key','chan_late030_derivative_slope','label','Derivative slope at a late fraction of 0.30','unit','dimensionless','expected',1.4096605496345478,'tol',0.000003),
    jsonb_build_object('key','chan_late090_derivative_slope','label','Derivative slope at a late fraction of 0.90','unit','dimensionless','expected',1.2109917718605152,'tol',0.000003),
    jsonb_build_object('key','gor_null_derivative_wor_slope','label','Ratio slope returned beside the flat gas verdict','unit','dimensionless','expected',0.5564504142933543,'tol',0.000002),
    jsonb_build_object('key','skin_pi_multiplier_at_minus7', 'label','Productivity index multiplier at the overreached design skin','unit','dimensionless','expected',18.012163332524107,'tol',0.00004)
  )
)
on conflict (app_slug, tier) do nothing;

-- ---------------------------------------------------------------------------
-- THE CROSS-TIER PROMPT-LEAK GATE, RUN HERE RATHER THAN ONLY AT GO-LIVE.
--
-- A capstone's conditions have to state everything that changes an answer, and
-- in a chained domain the thing that changes one tier's answer is often
-- another tier's quantity. State it and the value has been handed over; leave
-- it out and the field is not gradeable. PD3 shipped a capstone prompt that
-- stated another tier's graded value at a tolerance of 0.00, and the fix is
-- always to DECOUPLE the fields rather than to disclose. Neither the lesson
-- leakage sweep nor the digest guard can see this, because a migration is not
-- a lesson, so the check lives in the migration that writes the prompts.
-- ---------------------------------------------------------------------------
do $$
declare
  v_leaks integer;
begin
  select count(*) into v_leaks
    from public.academy_capstones c,
         public.academy_capstones c2,
         lateral jsonb_array_elements(c2.fields) f
   where c.app_slug = 'intervention' and c2.app_slug = 'intervention' and c.tier <> c2.tier
     and replace(c.prompt, ',', '') like '%' || (f->>'expected') || '%';
  if v_leaks <> 0 then
    raise exception 'PD8 refused: % capstone prompt(s) state a graded value belonging to another tier', v_leaks;
  end if;
end $$;

-- No go-live here. See 20260904_pd8_intervention_go_live.sql.
