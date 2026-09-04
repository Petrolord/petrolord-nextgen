-- ============================================================================
-- PD9: Production Surveillance joins the catalog, the NINTH AND LAST
-- Production & Artificial Lift course.
--
-- Catalog row (module 'production'; path_order 38; prereq_slug 'nodal') plus
-- the three capstones and their eighteen graded fields. Deep seeds are three
-- separate migrations; the go-live is a fifth and is HELD.
--
-- THE ONE SENTENCE THE COURSE IS. Surveillance never measures a well, it
-- compares a well against a reading of ITSELF over a window, so every number
-- these four modules return is conditional on three choices a returned number
-- cannot tell you about: WHICH COLUMN was read, over WHICH WINDOW, and by
-- WHICH of the several functions that form the same quantity differently.
--
-- WHAT THE COURSE COVERS AND WHAT IT DELIBERATELY DOES NOT. PD1 owns the node
-- and the inflow curve, PD2 through PD5 own the four lift methods, PD7 owns
-- the gathering system and PD8 owns the intervention diagnosis, and none of
-- that is repeated. PD9's engines are surveillance.js, allocation.js,
-- liftScreening.js and liftAdvisor.js. It certifies no reservoir property, no
-- pressure, no temperature, no completion geometry and no cost: what it grades
-- is what a LEDGER MODULE returns, which is volumes over rows, rates, ratios,
-- window means, allocation factors and one decline read off a fit.
--
-- THE TIERS SPLIT ON A SEAM IN THE CODE RATHER THAN ON A SYLLABUS, AND THE
-- SEAM IS THE SECOND WINDOW. Two of the Associate tier's six fields come out
-- of `derivePoint` called on ONE ledger row and the other four are the four
-- continuous members of ONE `computeKpis` return, and neither of those two
-- functions holds a baseline, a comparison or a verdict anywhere near it: that
-- is ASSOCIATE, THE LEDGER, THE PRODUCING-DAY RATE, THE RATIOS A ROW CARRIES
-- AND THE ROLL-UP TO A FIELD. Three of the Professional tier's six are
-- `windowMean` results read out of `detectExceptions`, and the other three are
-- an allocation factor, an allocated volume and an imbalance percentage, so
-- every one of the six puts two numbers side by side: that is PROFESSIONAL,
-- THE WINDOWED READING AND WHAT IT FIRES, plus the well test that carries a
-- well and the allocation that shares one meter over many wells. And every one
-- of the Expert tier's six is the SAME DATA READ A SECOND WAY, with not one
-- new function called anywhere: that is EXPERT, WHAT A NUMBER IS WORTH ONCE
-- YOU KNOW WHICH COLUMN IT CAME FROM.
--
-- FIVE RESULTS THE COURSE IS BUILT ON, EVERY ONE RUN AGAINST THE ENGINE.
--
--   (1) THE EXCEPTION ENGINE NEVER READS THE PRODUCING-DAY RATE.
--   `detectExceptions` picks its column with `const rateKey = isInjector ?
--   'winj' : 'oil'`, and `oil` is the CALENDAR VOLUME booked against the row.
--   The four producing-day columns are computed on every point of every well
--   and are read by exactly ONE function in the file, `rateSeriesForFit`,
--   which is the decline overlay. On the teaching well the two columns move in
--   OPPOSITE directions: the producing-day oil rate is 512.000000000 stb/d on
--   all seven recent days while the calendar volume falls from 502.666666666667
--   stb to 307.504761904762 stb, so the engine reports a drop of
--   38.825312618416 per cent on a well whose deliverability rose by
--   1.856763925729 per cent. The exception that would have named the cause does
--   not fire either: the mean recent hours are 14.414285714286 against a
--   threshold of 12. And the message hard-codes the unit it is wrong about,
--   printing `stb/d` after a mean of calendar VOLUMES on every ledger.
--
--   (2) TWO FUNCTIONS IN ONE FILE FORM THE SAME TWO RATIOS TWO DIFFERENT WAYS,
--   AND THE DISAGREEMENT MOVES A PRINTED SEVERITY. `computeKpis` forms a
--   period watercut and gas-oil ratio VOLUMETRICALLY and `detectExceptions`
--   forms them as the MEAN OF THE DAILY RATIOS. The module header states it
--   and the golden PUBLISHES the size of it rather than resolving it, which is
--   the right thing to have done: on P-1 the gas-oil ratio rise is
--   70.033482142857 per cent one way and 42.737789203085 the other, an
--   overstatement of 19.122961825433 PER CENT, and that is the difference
--   between a printed high and a printed medium. On the teaching well the seam
--   is bigger still, 83.907484614181 per cent against 11.250129499613, which
--   is a HIGH exception against no exception at all. NEITHER READING IS WRONG.
--   And the sweep shows why nobody caught it: over a window of UNIFORM days
--   the two readings are IDENTICAL and they diverge only where the window
--   mixes rates.
--
--   (3) A MISSING VALUE HAS FOUR SPELLINGS AND FOUR CONVENTIONS, AND TWO OF
--   THEM CONTRADICT EACH OTHER ON THE SAME COLUMN. `row.oil_stb || 0` returns
--   the STRING when the column arrived as text, so every derived quantity
--   formed by multiplication is exactly right and the one formed by ADDITION
--   is not: one row of 800 stb of oil and 200 stb of water gives a correct
--   gas-oil ratio and a correct producing-day oil rate beside a watercut and a
--   liquid producing-day rate out by a factor of 800.2, and four such rows on
--   one date give a field oil total of 800800800800. The same absent hours
--   column is UPTIME UNKNOWN in surveillance and TWENTY-FOUR HOURS ON in
--   allocation, so a well that filed no row at all takes a FULL SHARE of the
--   metered total. `!b` is true for NaN, so a hyperbolic fit with an unusable
--   exponent returns 42.160601062199 per cent, which is case 1 of the
--   published golden. And an absent API is ZERO in `screenLift`, heavier than
--   any real crude, while the same absent API is 32 degrees in
--   `liftAdvisor.liquidGravity`.
--
--   (4) THE GUARDS SIT ON THE WRONG QUANTITY. `minOilRate` gates the rate
--   check and the gas-oil ratio check and does NOT gate the watercut check, so
--   a well too small to have a sixty per cent rate collapse reported still
--   raises a HIGH watercut exception on the same rows. The downtime branch
--   requires `hrs.mean > 0`, so a well averaging 0.10 hours raises a medium
--   and a well averaging EXACTLY zero, which is the worst uptime there is,
--   raises nothing. `maxTestAgeDays` is guarded with
--   `Number.isFinite(x) && x > 0`, so setting it to ZERO turns the age check
--   OFF and a test 2088 days old carries its well: on the teaching field the
--   sweep runs monotonically down to one day and 2072.000000000 stb of
--   theoretical oil and then JUMPS BACK at zero days to four wells and
--   65033.920833333 stb, which is what the loosest setting on the dial gives.
--   And the gas-oil ratio gate carries a clause that can never be true.
--
--   (5) TWO FUNCTIONS IN ONE FILE COUNT THE SAME FIELD AND NEITHER SEVEN IS
--   THE OTHER SEVEN. `detectExceptions` drops the observation well and KEEPS
--   the injector; `computeKpis` drops the injector and KEEPS the observation
--   well. On the teaching field both return 7 and nothing in either return
--   says which seven, so a reader reconciling an exception list against a KPI
--   header sees two sevens and concludes they agree. The observation well also
--   lands in the UPTIME, which reads 92.011904762 per cent with it and
--   90.014880952 without, on a well that produces nothing and records a
--   perfect twenty-four hours a day. And only the exact string `injector` is
--   an injector: `water_injector`, `gas_injector`, an empty string and an
--   absent type all take the producer path.
--
-- ONE FUNCTION READS THE WALL CLOCK, AND IT SHAPED HOW THIS WHOLE WAVE WAS
-- WRITTEN. `summarizeDeferments` defaults its `asOf` to today, in a module
-- whose header says every window anchors on the field's latest ledger date
-- precisely so an old dataset surveils honestly. Nothing in the return says
-- which anchor was used, and the same call on the same data answers
-- differently tomorrow. So no lesson, no digest line, no capstone field and no
-- go-live assertion in PD9 quotes an unanchored deferment: the finding is
-- stated as a BOOLEAN and as ANCHORED recomputations, and the first version of
-- the wave's own probe got its arithmetic wrong by comparing a ROUNDED current
-- instant against a FLOORED UTC date string, which made the answer depend on
-- the time of day. A number nobody can reproduce is not a number anybody
-- should act on.
--
-- WHAT THE ORACLES RECORD, AND WHERE THEY STOP. All four are genuinely
-- independent and the course says so before it says anything critical. The
-- surveillance oracle does every date arithmetic on the CALENDAR where the
-- module counts epoch-millisecond day numbers, forms every window mean by
-- explicit calendar membership from the STATED window definition rather than
-- the implemented inequality, measures effective decline through the Arps rate
-- law where the module evaluates a closed form, and gates the decline fit
-- against a series SYNTHESISED from known parameters. The allocation oracle
-- splits the metered total as a SHARE where the module multiplies by a
-- precomputed factor, bisects into explicit validity intervals where the
-- module scans and breaks, and forms each monthly factor as the
-- theoretical-weighted MEAN of the daily factors where the module divides one
-- month total by another. The screening oracle re-expresses every rule as a
-- declarative penalty ledger walked by one generic scorer with no branch on a
-- method anywhere. The advisor oracle takes the reference stage as a covering
-- SET and the reconciliation as a full four-way truth table. They gate what
-- each function RETURNS on the inputs the goldens publish. They do NOT gate
-- which of two functions a caller should have used, what a missing column
-- means, or what a refusal sentence says, and sixteen of this wave's twenty
-- findings live in exactly that gap. Same shape the ESP, rod pump, flow
-- assurance, network and intervention waves found. THE ORACLES' SILENCE WAS
-- THE FINDING.
--
-- THE CAPSTONE IS A FIELD THE LESSONS NEVER TOUCH: AKASO, six wells over
-- eighty daily rows, with a facility meter over the last twenty-one of them.
-- It is NOT the teaching field in the digest, which is OGUTA and has eight
-- wells, and it shares no condition with any published golden case, which is
-- the DR2 rule. Six things are tuned into it and every one is verified from
-- the engine's own printed return rather than assumed. ONE WELL COLLAPSES ITS
-- OIL AND KEEPS ITS GAS, so the two readings of its period gas-oil ratio
-- disagree by more than half again and give a HIGH exception against no
-- exception at all on the identical rows. A SECOND WELL LOSES ITS HOURS AND
-- NOT ITS DELIVERABILITY, so its calendar volume reads as a collapse past the
-- doubling while its producing-day rate barely moves. A THIRD WELL SIMPLY
-- STOPS FILING while the meter keeps seeing it, which moves the imbalance and
-- not the factor. AN OBSERVATION WELL RECORDS A PERFECT DAY AND PRODUCES
-- NOTHING, and is averaged into the uptime. ONE TEST IS FLAGGED INVALID AND
-- ONE VALID TEST IS OLD ENOUGH TO HAVE AGED OUT, so the same day allocates two
-- different ways. And a FOURTH WELL DECLINES CLEANLY AND RAISES NOTHING AT
-- ALL, which is what makes the well that raises everything worth looking at.
--
-- WHAT IS NOT GRADEABLE IS NOT GRADED. A severity is a string, a mechanism is
-- a string, a diagnostic code is a string, a well type is a string and a
-- verdict is a string, and none of them is a graded field. The go-live asserts
-- the numbers UNDERNEATH each verdict together with the threshold each was
-- compared against, which is the only way a threshold ladder can be pinned
-- down at all, and it asserts the thresholds themselves so that a settings
-- override which moved one would fail here rather than silently move every
-- printed severity in the course.
--
-- THE PROMPTS WERE WRITTEN AGAINST THE CROSS-TIER LEAK RULE. Every tier's
-- prompt restates the ledger, the wells, the settings and, where the tier
-- needs them, the tests and the meter, from the RAW CONDITIONS. No tier's
-- prompt states a number another tier is graded on, at any rounding or in any
-- of three unit shiftings. Three couplings were drafted and REMOVED rather
-- than disclosed. The Associate tier's field watercut was drafted into the
-- Expert prompt as the divisor of the liquid rate and taken out, because a
-- liquid rate is one division from a stated water cut. The Professional tier's
-- last-day oil factor was drafted into the Expert prompt as the anchor the
-- with-invalid-tests factor is compared against and taken out, because the two
-- factors differ by one ratio of theoretical sums. And the Professional
-- tier's allocated AKASO-4 volume was drafted into the Expert prompt as the
-- target rate and taken out for the same reason. All three are stated as
-- IDENTITIES IN WORDS in the free checks instead, which is the device PD5 used
-- on its cycle gas, PD6 on its heat-loss-only arrival, PD7 on its manifold
-- pressure and PD8 on its geometry group. PD3 shipped a capstone prompt
-- stating another tier's graded value at a tolerance of 0.00, and the fix is
-- always to DECOUPLE the fields rather than to disclose. The check runs HERE,
-- in this file, immediately after the capstones are inserted, and the go-live
-- re-reads the STORED prompts and refuses on regression.
--
-- THE GOLDENSWEEP RAN BEFORE THIS FILE WAS WRITTEN, against all four goldens
-- AND the teaching digest: eighteen graded values against 14845 published
-- numbers, ZERO collisions, zero integer notes, and no approach closer than
-- 156.5 times a field's own grading tolerance, which is the AKASO-6
-- producing-day oil rate against an allocated gas volume in the published
-- allocation case.
--
-- STATUS deliberately left 'coming_soon'. The flip to 'available' is held in
-- 20260904_pd9_surveillance_go_live.sql and must not run until a NextGen
-- production upload carries /dashboard/apps/surveillance.
-- ============================================================================

insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)
values ('surveillance', 'Production Surveillance', 'production', 38, 'coming_soon', 'nodal')
on conflict (slug) do nothing;

insert into public.academy_capstones
    (app_slug, tier, cert_tier, dataset, title, prompt, fields)
values
(
  'surveillance', 'beginner', 'associate',
  'the AKASO daily ledger on its own: one row, one window, and no comparison anywhere',
  'The ledger, the row and the roll-up',
  'Six values for the AKASO field, and every one of them is available from the daily ledger alone, before any window is compared against any other window, before any test is read, before any meter is read and before anything at all is flagged.

THE FIELD AND ITS LEDGER, STATED IN FULL so nothing has to be carried across from another tier. AKASO files a DAILY ledger of 80 consecutive calendar days, 2026-02-05 through 2026-04-25. Number the days i, with i equal to 0 on 2026-02-05 and 79 on 2026-04-25. Six wells file into it and every volume below is the volume booked against that calendar day.

AKASO-4, a PRODUCER. On every day i from 0 through 72 its oil is the entry at i modulo 6 of the cycle 1184, 1163, 1201, 1172, 1195, 1158 stb, its water is 0.27 times that oil in stb, its gas is 0.7 times that oil in Mscf, and it records 24 hours on stream. On the last seven days, i from 73 through 79, it files these rows instead, oldest first, as oil stb then water stb then gas Mscf: 1146, 381, 861 then 1132, 377, 848 then 1151, 384, 869 then 63, 214, 107 then 58, 206, 101 then 66, 219, 112 then 61, 211, 104. It records 24 hours on every one of those seven days as well, so nothing about this well can be blamed on its uptime.

AKASO-6, a PRODUCER. On every day i from 0 through 72 its oil is the entry at i modulo 4 of the cycle 648, 634, 655, 641 stb, its water is 0.18 times that oil in stb, its gas is 0.55 times that oil in Mscf, and it records 24 hours on stream. On the last seven days it files, oldest first, as hours on stream then oil stb then water stb then gas Mscf: 11.4, 297.5, 53.6, 164.0 then 9.6, 251.0, 45.2, 138.5 then 13.2, 344.8, 62.1, 190.1 then 8.1, 211.5, 38.1, 116.6 then 12.7, 331.8, 59.7, 182.9 then 10.3, 269.1, 48.4, 148.4 then 14.2, 370.9, 66.8, 204.5.

AKASO-8, a PRODUCER, files all 80 days: oil equal to 940 times e raised to the power minus 0.0021 i, in stb, water 0.42 times that oil in stb, gas 0.61 times that oil in Mscf, and 24 hours on stream.

AKASO-12, a PRODUCER, files only the first 69 days, i from 0 through 68, the last of them dated 2026-04-14, and then STOPS FILING ROWS ALTOGETHER. On the days it files, its oil is 455 times e raised to the power minus 0.0125 i, in stb, its water is 0.30 times that oil in stb, its gas is 0.53 times that oil in Mscf, and THE HOURS COLUMN IS ABSENT FROM EVERY ONE OF ITS ROWS. It has not stopped producing.

AKASO-2W, an INJECTOR, files all 80 days with no oil, no water and no gas at all. Its water injection is the entry at i modulo 3 of the cycle 3240, 3180, 3260 stb on days 0 through 72, and 2140, 2080, 2160, 2100, 2050, 2190 and 2120 stb over the last seven days, oldest first. It records 24 hours.

AKASO-15, an OBSERVATION well, files all 80 days with nothing produced and nothing injected, and records a full 24 hours on stream every single day.

THE KPI WINDOW IS SEVEN DAYS AND IT ENDS ON THE FIELD OWN LAST LEDGER DATE. It starts at that date less seven days plus one and it is INCLUSIVE at both ends, so it runs 2026-04-19 through 2026-04-25 and holds seven daily field rows.

Report: (1) the GAS-OIL RATIO the AKASO-4 row dated 2026-04-22 carries; (2) the PRODUCING-DAY OIL RATE the AKASO-6 row dated 2026-04-19 carries; (3) the field KPI OIL over the seven day window; (4) the field KPI WATERCUT over that window, as a FRACTION and not a percentage; (5) the field KPI GAS-OIL RATIO over that window; and (6) the field KPI UPTIME over that window, as a PER CENT.

What any of this means against a baseline, what the tests say, what the meter says and what any of it fires belong to the tiers above and are not asked for here.

Traps. Field 1 is a thousand times the gas over the oil ON THAT ONE ROW, because gas is booked in Mscf and oil in stb and the ratio is wanted in scf/stb. It is a ratio off a SINGLE ROW and not a mean of anything, and it is not set at all on a row with no oil, however much gas that row booked. Field 2 is the row OIL VOLUME SCALED TO TWENTY-FOUR HOURS, the volume times 24 over the hours on stream, and it is a RATE in stb/d while the volume beside it is a volume in stb. It is not the volume, it is not the volume times the hours, and on a row whose hours column is absent it would have come back as the volume unchanged, which is a statement that the uptime is unknown rather than a claim that the well ran all day. Field 3 is the MEAN over the seven days of the FIELD daily oil total, and a field daily oil total is the sum of every well oil on that date, the injector and the observation well included at zero each. It is a mean of VOLUMES over calendar days and it is not a producing-day rate, and one of the four producers files no row anywhere inside this window. Fields 4 and 5 are RATIOS OF MEANS and not means of ratios: field 4 is the window mean water over the window mean oil plus the window mean water, and field 5 is a thousand times the window mean gas over the window mean oil. Forming either of them a day at a time and averaging gives a different number on this field, and the tier above is built on exactly that difference. Field 6 is the SUM of the hours recorded over the window, divided by twenty-four times the NUMBER OF ROWS that carried an hours figure, times a hundred. The denominator counts ROWS, not wells and not days. Injectors are skipped. Everything else is read, including the observation well, which produced nothing and recorded a perfect day. A row whose hours column is absent contributes nothing to the sum and nothing to the count.

Free checks. Field 1 must come out at more than twice the gas-oil ratio every one of that well baseline rows carries, and those all carry exactly 700 scf/stb by construction, because 0.7 Mscf per stb of oil is 700 scf per stb; a row that has kept its gas and lost most of its oil is the shape being looked at. Field 2 must be LARGER than the oil volume on that same row, by exactly the ratio of 24 to 11.4, because the well was on for fewer than twenty-four hours. Field 3 must land strictly between the smallest and the largest of the seven daily field oil totals, which are not equal, and it must come out below 2000 stb and above 1000 stb. Fields 3, 4 and 5 must close on each other: field 3 times field 4 divided by one less field 4 must equal the mean of the seven daily field water totals computed directly, and field 5 times field 3 divided by a thousand must equal the mean of the seven daily field gas totals computed directly. Getting both identities to close is the whole of what a volumetric period ratio is. Field 4 must land strictly between zero and one and must NOT be read as a percentage anywhere. Field 6 must be below a hundred, and it must come out ABOVE the same quantity computed with the observation well rows removed, by more than four points; that gap is a well which produces nothing and records a perfect day being averaged in with the ones that work. And the denominator of field 6 must be twenty-four times twenty-eight, four wells over seven days: the injector is skipped by name and the well with no hours column filed no row inside this window at all.',
  jsonb_build_array(
    jsonb_build_object('key','a4_low_day_gor_scfstb', 'label','Gas-oil ratio on the AKASO-4 row dated 2026-04-22', 'unit','scf/stb', 'expected',1698.4126984126983, 'tol',0.00085),
    jsonb_build_object('key','a6_producing_day_oil_stbd', 'label','Producing-day oil rate on the AKASO-6 row dated 2026-04-19', 'unit','stb/d', 'expected',626.3157894736842, 'tol',0.00032),
    jsonb_build_object('key','field_kpi_oil_stbd', 'label','Field KPI oil over the seven day window', 'unit','stb', 'expected',1623.285556723959, 'tol',0.00082),
    jsonb_build_object('key','field_kpi_watercut_frac', 'label','Field KPI watercut over that window, as a fraction', 'unit','fraction', 'expected',0.2935587576910614, 'tol',1.5e-07),
    jsonb_build_object('key','field_kpi_gor_scfstb', 'label','Field KPI gas-oil ratio over that window', 'unit','scf/stb', 'expected',666.0858982538897, 'tol',0.00034),
    jsonb_build_object('key','field_kpi_uptime_pct', 'label','Field KPI uptime over that window', 'unit','per cent', 'expected',86.83035714285714, 'tol',4.4e-05)
  )
),
(
  'surveillance', 'intermediate', 'professional',
  'AKASO read through two windows, and one facility meter shared over the wells that could carry it',
  'The windowed reading and the shared meter',
  'Six values that only exist once one window is put beside another, or once a metered total is put beside what the wells were capable of. THE SAME FIELD, RESTATED IN FULL.

THE FIELD AND ITS LEDGER, STATED IN FULL so nothing has to be carried across from another tier. AKASO files a DAILY ledger of 80 consecutive calendar days, 2026-02-05 through 2026-04-25. Number the days i, with i equal to 0 on 2026-02-05 and 79 on 2026-04-25. Six wells file into it and every volume below is the volume booked against that calendar day.

AKASO-4, a PRODUCER. On every day i from 0 through 72 its oil is the entry at i modulo 6 of the cycle 1184, 1163, 1201, 1172, 1195, 1158 stb, its water is 0.27 times that oil in stb, its gas is 0.7 times that oil in Mscf, and it records 24 hours on stream. On the last seven days, i from 73 through 79, it files these rows instead, oldest first, as oil stb then water stb then gas Mscf: 1146, 381, 861 then 1132, 377, 848 then 1151, 384, 869 then 63, 214, 107 then 58, 206, 101 then 66, 219, 112 then 61, 211, 104. It records 24 hours on every one of those seven days as well, so nothing about this well can be blamed on its uptime.

AKASO-6, a PRODUCER. On every day i from 0 through 72 its oil is the entry at i modulo 4 of the cycle 648, 634, 655, 641 stb, its water is 0.18 times that oil in stb, its gas is 0.55 times that oil in Mscf, and it records 24 hours on stream. On the last seven days it files, oldest first, as hours on stream then oil stb then water stb then gas Mscf: 11.4, 297.5, 53.6, 164.0 then 9.6, 251.0, 45.2, 138.5 then 13.2, 344.8, 62.1, 190.1 then 8.1, 211.5, 38.1, 116.6 then 12.7, 331.8, 59.7, 182.9 then 10.3, 269.1, 48.4, 148.4 then 14.2, 370.9, 66.8, 204.5.

AKASO-8, a PRODUCER, files all 80 days: oil equal to 940 times e raised to the power minus 0.0021 i, in stb, water 0.42 times that oil in stb, gas 0.61 times that oil in Mscf, and 24 hours on stream.

AKASO-12, a PRODUCER, files only the first 69 days, i from 0 through 68, the last of them dated 2026-04-14, and then STOPS FILING ROWS ALTOGETHER. On the days it files, its oil is 455 times e raised to the power minus 0.0125 i, in stb, its water is 0.30 times that oil in stb, its gas is 0.53 times that oil in Mscf, and THE HOURS COLUMN IS ABSENT FROM EVERY ONE OF ITS ROWS. It has not stopped producing.

AKASO-2W, an INJECTOR, files all 80 days with no oil, no water and no gas at all. Its water injection is the entry at i modulo 3 of the cycle 3240, 3180, 3260 stb on days 0 through 72, and 2140, 2080, 2160, 2100, 2050, 2190 and 2120 stb over the last seven days, oldest first. It records 24 hours.

AKASO-15, an OBSERVATION well, files all 80 days with nothing produced and nothing injected, and records a full 24 hours on stream every single day.

THE SURVEILLANCE SETTINGS ARE THE ENGINE DEFAULTS: a RECENT window of 7 days and a BASELINE window of 30 days, rateDropPct 20 with a doubling to high at 40, watercutRisePts 10 points with a doubling to high at 20 points, gorRisePct 30 per cent with a doubling to high at 60 per cent, downtimeHours 12, staleDays 7 and minOilRate 5 stb/d. Every window anchors on the FIELD latest ledger date, 2026-04-25, and never on today. A window mean takes the days STRICTLY AFTER its from-day and up to and including its to-day, so the recent window is 2026-04-19 through 2026-04-25 and the baseline window is the 30 days immediately before it, 2026-03-20 through 2026-04-18, with no overlap and no gap. The ledger is daily, so no window is widened.

THE WELL TESTS. Six of them, each stated as well, test date, oil stb/d, water stb/d, gas Mscf/d, duration in hours, tubing head pressure in psia, and the QC flag the studio saved with it. AKASO-4, 2025-11-20, 1210, 328, 848, 24 h, 340 psia, flagged VALID. AKASO-4, 2026-04-02, 1165, 316, 816, 12 h, 335 psia, flagged VALID. AKASO-6, 2026-03-11, 651, 117, 358, 18 h, 295 psia, flagged VALID. AKASO-8, 2026-02-18, 905, 620, 552, 24 h, 310 psia, flagged VALID. AKASO-12, 2025-09-14, 455, 195, 241, 20 h, 260 psia, flagged VALID. AKASO-12, 2026-03-30, 402, 172, 213, 3.0 h, 248 psia, flagged INVALID.

THE FACILITY METER. One commingled stream, metered daily for the 21 days 2026-04-05 through 2026-04-25, which is i from 59 through 79. On each of those days the metered oil is 1.012 times the sum of the four producers TRUE oil, the metered water 1.012 times the sum of their true water and the metered gas 1.012 times the sum of their true gas, where AKASO-12 TRUE oil is 455 times e raised to the power minus 0.0125 i on every one of those days WHETHER OR NOT IT FILED A ROW, with its own water and gas fractions applied to it. The meter sees the well; the ledger stops hearing from it.

THE ALLOCATION SETTINGS ARE THE ENGINE DEFAULTS: the TEST basis, so a well theoretical volume for a day is its test rate times its uptime fraction; maxTestAgeDays 180, so a test older than that no longer carries its well; useUptime on; defaultHours 24 for a ledger row that carries no hours figure AND for a day on which the well filed no ledger row at all; invalid tests excluded; and the factor warning band 0.7 to 1.3, which raises a diagnostic and never clamps anything. A well with no test in force takes NO share. The factor for a phase on a day is the metered total for that phase over the sum of the theoreticals for that phase, and each well share is its own theoretical times that one factor.

Report: (1) the RECENT WINDOW MEAN of AKASO-4 oil, which is the value the rate exception on that well carries; (2) the BASELINE WINDOW MEAN of AKASO-4 oil, which is the baseline that same exception carries; (3) the RECENT WINDOW MEAN of AKASO-6 hours on stream, which is the value the downtime exception on that well carries; (4) the OIL ALLOCATION FACTOR on 2026-04-25; (5) the TOTAL OIL ALLOCATED TO AKASO-8 over the whole 21 day allocated window; and (6) the OIL IMBALANCE on 2026-04-25, as a PER CENT.

Traps. Fields 1 and 2 are means of the OIL COLUMN, which is the calendar-day VOLUME booked against the row, and they are NOT means of the producing-day rate. The engine reads that column for its change test and prints stb/d after it; the quantity is a volume in stb and the unit in the message is wrong every time. Field 3 is a mean of the HOURS column over the same recent window, so it is a mean of seven different numbers and cannot be read off any single row. Field 4 is the metered oil for that day over the SUM OF THE THEORETICALS for that day, where a well theoretical is its test oil rate times its uptime fraction, the uptime fraction is its hours on stream over twenty-four, and a well with no test in force is simply NOT IN THE SUM. Work out which tests are in force on that date and how old each one is before summing anything. Field 5 is a sum over 21 days of that well own theoretical times THAT DAY factor, and the factor changes every day, so it is not the well theoretical total times any single factor and it is not the metered total times any share fixed once. Field 6 compares the meter against what the wells BOOKED IN THE LEDGER, which is a different comparison from field 4: field 4 asks what the wells were CAPABLE of and field 6 asks what they WROTE DOWN. It is the metered oil less the booked oil, over the BOOKED oil, times a hundred, and the booked oil on that date is the sum of the ledger rows that exist, not of the wells that were producing.

Free checks. Field 2 must come out at exactly one sixth of the sum of that well six baseline cycle values, because the 30 day baseline window is exactly five whole turns of a six day cycle, so it can be checked by adding six numbers rather than thirty. Field 1 must be less than half of field 2, so the drop is past the doubling and the exception is reported at the top of the ladder rather than in the middle of it. Field 3 must land strictly between zero and twelve, so the downtime check reports it; note that a mean of exactly zero, which is the worst uptime a well can have, is the one value that check refuses to report, and field 3 is not that value. Field 4 must land BELOW the bottom of the 0.7 to 1.3 warning band, so that day raises a factor diagnostic, and it must land above one half. Field 5 divided by 905 must come out as the sum of the twenty-one daily oil factors, because that well test rate is 905 stb/d and it recorded a full day on every allocated date, so its theoretical is the same number on all twenty-one days; that identity is the cheapest way to check field 5 without re-running the whole allocation. Field 6 must be POSITIVE, so the meter saw more oil than the wells booked, and it must be far larger than the 1.2 per cent the meter bias alone would explain, because one producer is still being metered and is no longer filing. And one final identity ties field 6 to a setting rather than to a number: run the same allocation on the LEDGER basis, where the wells own meters are the split and no test is read at all, and that day oil factor must come out as exactly one plus field 6 divided by a hundred.',
  jsonb_build_array(
    jsonb_build_object('key','a4_recent_oil_mean_stbd', 'label','Recent window mean of the AKASO-4 oil column', 'unit','stb', 'expected',525.2857142857143, 'tol',0.00027),
    jsonb_build_object('key','a4_baseline_oil_mean_stbd', 'label','Baseline window mean of the AKASO-4 oil column', 'unit','stb', 'expected',1178.8333333333333, 'tol',0.00059),
    jsonb_build_object('key','a6_recent_hours_mean_h', 'label','Recent window mean of the AKASO-6 hours column', 'unit','h', 'expected',11.357142857142858, 'tol',5.7e-06),
    jsonb_build_object('key','alloc_oil_factor_last_day', 'label','Oil allocation factor on 2026-04-25', 'unit','dimensionless', 'expected',0.5761161637277346, 'tol',2.9e-07),
    jsonb_build_object('key','alloc_a8_oil_stb', 'label','Oil allocated to AKASO-8 over the whole allocated window', 'unit','stb', 'expected',18243.07556609792, 'tol',0.0092),
    jsonb_build_object('key','imbalance_oil_pct_last_day', 'label','Oil imbalance on 2026-04-25', 'unit','per cent', 'expected',15.165481821983997, 'tol',7.6e-06)
  )
),
(
  'surveillance', 'advanced', 'expert',
  'the same AKASO rows read a second way, by the other function that forms the same quantity',
  'What a number is worth once you know which column it came from',
  'Six values for the same field, and every one of them is the SAME DATA READ A SECOND WAY. Nothing new is introduced. THE SAME FIELD, RESTATED IN FULL.

THE FIELD AND ITS LEDGER, STATED IN FULL so nothing has to be carried across from another tier. AKASO files a DAILY ledger of 80 consecutive calendar days, 2026-02-05 through 2026-04-25. Number the days i, with i equal to 0 on 2026-02-05 and 79 on 2026-04-25. Six wells file into it and every volume below is the volume booked against that calendar day.

AKASO-4, a PRODUCER. On every day i from 0 through 72 its oil is the entry at i modulo 6 of the cycle 1184, 1163, 1201, 1172, 1195, 1158 stb, its water is 0.27 times that oil in stb, its gas is 0.7 times that oil in Mscf, and it records 24 hours on stream. On the last seven days, i from 73 through 79, it files these rows instead, oldest first, as oil stb then water stb then gas Mscf: 1146, 381, 861 then 1132, 377, 848 then 1151, 384, 869 then 63, 214, 107 then 58, 206, 101 then 66, 219, 112 then 61, 211, 104. It records 24 hours on every one of those seven days as well, so nothing about this well can be blamed on its uptime.

AKASO-6, a PRODUCER. On every day i from 0 through 72 its oil is the entry at i modulo 4 of the cycle 648, 634, 655, 641 stb, its water is 0.18 times that oil in stb, its gas is 0.55 times that oil in Mscf, and it records 24 hours on stream. On the last seven days it files, oldest first, as hours on stream then oil stb then water stb then gas Mscf: 11.4, 297.5, 53.6, 164.0 then 9.6, 251.0, 45.2, 138.5 then 13.2, 344.8, 62.1, 190.1 then 8.1, 211.5, 38.1, 116.6 then 12.7, 331.8, 59.7, 182.9 then 10.3, 269.1, 48.4, 148.4 then 14.2, 370.9, 66.8, 204.5.

AKASO-8, a PRODUCER, files all 80 days: oil equal to 940 times e raised to the power minus 0.0021 i, in stb, water 0.42 times that oil in stb, gas 0.61 times that oil in Mscf, and 24 hours on stream.

AKASO-12, a PRODUCER, files only the first 69 days, i from 0 through 68, the last of them dated 2026-04-14, and then STOPS FILING ROWS ALTOGETHER. On the days it files, its oil is 455 times e raised to the power minus 0.0125 i, in stb, its water is 0.30 times that oil in stb, its gas is 0.53 times that oil in Mscf, and THE HOURS COLUMN IS ABSENT FROM EVERY ONE OF ITS ROWS. It has not stopped producing.

AKASO-2W, an INJECTOR, files all 80 days with no oil, no water and no gas at all. Its water injection is the entry at i modulo 3 of the cycle 3240, 3180, 3260 stb on days 0 through 72, and 2140, 2080, 2160, 2100, 2050, 2190 and 2120 stb over the last seven days, oldest first. It records 24 hours.

AKASO-15, an OBSERVATION well, files all 80 days with nothing produced and nothing injected, and records a full 24 hours on stream every single day.

THE SURVEILLANCE SETTINGS ARE THE ENGINE DEFAULTS: a RECENT window of 7 days and a BASELINE window of 30 days, rateDropPct 20 with a doubling to high at 40, watercutRisePts 10 points with a doubling to high at 20 points, gorRisePct 30 per cent with a doubling to high at 60 per cent, downtimeHours 12, staleDays 7 and minOilRate 5 stb/d. Every window anchors on the FIELD latest ledger date, 2026-04-25, and never on today. A window mean takes the days STRICTLY AFTER its from-day and up to and including its to-day, so the recent window is 2026-04-19 through 2026-04-25 and the baseline window is the 30 days immediately before it, 2026-03-20 through 2026-04-18, with no overlap and no gap. The ledger is daily, so no window is widened.

THE WELL TESTS. Six of them, each stated as well, test date, oil stb/d, water stb/d, gas Mscf/d, duration in hours, tubing head pressure in psia, and the QC flag the studio saved with it. AKASO-4, 2025-11-20, 1210, 328, 848, 24 h, 340 psia, flagged VALID. AKASO-4, 2026-04-02, 1165, 316, 816, 12 h, 335 psia, flagged VALID. AKASO-6, 2026-03-11, 651, 117, 358, 18 h, 295 psia, flagged VALID. AKASO-8, 2026-02-18, 905, 620, 552, 24 h, 310 psia, flagged VALID. AKASO-12, 2025-09-14, 455, 195, 241, 20 h, 260 psia, flagged VALID. AKASO-12, 2026-03-30, 402, 172, 213, 3.0 h, 248 psia, flagged INVALID.

THE FACILITY METER. One commingled stream, metered daily for the 21 days 2026-04-05 through 2026-04-25, which is i from 59 through 79. On each of those days the metered oil is 1.012 times the sum of the four producers TRUE oil, the metered water 1.012 times the sum of their true water and the metered gas 1.012 times the sum of their true gas, where AKASO-12 TRUE oil is 455 times e raised to the power minus 0.0125 i on every one of those days WHETHER OR NOT IT FILED A ROW, with its own water and gas fractions applied to it. The meter sees the well; the ledger stops hearing from it.

THE ALLOCATION SETTINGS ARE THE ENGINE DEFAULTS: the TEST basis, so a well theoretical volume for a day is its test rate times its uptime fraction; maxTestAgeDays 180, so a test older than that no longer carries its well; useUptime on; defaultHours 24 for a ledger row that carries no hours figure AND for a day on which the well filed no ledger row at all; invalid tests excluded; and the factor warning band 0.7 to 1.3, which raises a diagnostic and never clamps anything. A well with no test in force takes NO share. The factor for a phase on a day is the metered total for that phase over the sum of the theoreticals for that phase, and each well share is its own theoretical times that one factor.

AND THE ONE HANDOFF. The lift half of this domain is handed three numbers off the two layers above: a TARGET RATE, which is the oil ALLOCATED to AKASO-4 on 2026-04-25, a WATER CUT, which is the field KPI watercut over the trailing seven day window converted to a PER CENT at the door, and a gas-oil ratio, which is that same KPI gas-oil ratio. The gas-liquid ratio helper then clamps the water cut it was handed to the range 0 through 0.999, silently, and forms a LIQUID rate as the target rate over one less the clamped water cut fraction.

Report: (1) the RECENT WINDOW gas-oil ratio of AKASO-4 formed as the MEAN OF THE DAILY RATIOS, which is the value the gas-oil ratio exception carries; (2) the recent window gas-oil ratio of that SAME WELL over that SAME WINDOW formed VOLUMETRICALLY, sum of gas over sum of oil; (3) the recent window WATERCUT of that same well formed as the MEAN OF THE DAILY RATIOS, as a FRACTION; (4) the OIL ALLOCATION FACTOR on 2026-04-25 with the INVALID TEST INCLUDED; (5) the ANNUAL EFFECTIVE DECLINE of AKASO-8, as a PER CENT; and (6) the LIQUID RATE the lift handoff implies, in bbl/d.

Traps. Fields 1 and 2 are the SAME COLUMN over the SAME SEVEN DAYS and they are not the same number, and that is the point of the tier: one function in the file forms a period ratio as the mean of the daily ratios and another forms it as the ratio of the sums, and nothing in either return says which it did. Field 1 is the average of seven daily ratios, each of them a thousand times that day gas over that day oil. Field 2 is a thousand times the sum of the seven gas figures over the sum of the seven oil figures. On a window of uniform days those two are IDENTICAL, and this window is not uniform. Field 3 is again the mean of seven daily ratios and not the ratio of the sums, and it is a FRACTION and never a percentage in this half of the domain. Field 4 differs from the same factor with the invalid test excluded by ONE WELL entering the sum of theoreticals, and that well filed no ledger row on the date at all, so it takes the default of twenty-four hours on stream and a full uptime fraction: a well that filed nothing takes a full share. Field 5 is read off the decline overlay, whose fit recovers the well own construction, and the fitted model comes back EXPONENTIAL with an exponent of zero, so the effective decline is one less e raised to the power minus the nominal daily decline times 365, as a per cent. Note what that means: the branch that computes it fires when the model is exponential OR when the exponent is falsy, and a NaN is falsy, so a hyperbolic fit whose exponent failed to parse returns this same closed form and nothing in the return says so. Field 6 is a LIQUID rate in bbl/d, not an oil rate, and the number handed to it is an ALLOCATED volume for one day, so field 6 is larger than that by exactly one over one less the water cut fraction. The water cut crosses that door as a PER CENT and is divided by a hundred on the other side, so a fraction handed in unconverted would be wrong by a factor of a hundred.

Free checks. Field 1 must come out ABOVE field 2 and by more than half again, because the window mixes three ordinary days with four on which the oil collapsed and the gas did not follow it down, and a mean of daily ratios is biased by exactly those low-rate days. Field 1 against that well baseline, which is 700 scf/stb exactly on every baseline row by construction, must clear the 60 per cent doubling and report HIGH; field 2 against the same baseline, formed the same volumetric way, must fail to clear even the 30 per cent trigger, so the SAME ROWS give a high exception on one reading and NO exception at all on the other. Field 3 against the same well baseline watercut, which is 0.27 over 1.27 exactly on every baseline row, must clear the 20 point doubling and report HIGH; the same watercut formed volumetrically must clear the 10 point trigger and NOT the doubling, so that one reads medium. Field 4 must be BELOW the same factor with the invalid test excluded, which the tier below computes and which is not stated here, and the ratio of the two must equal the ratio of the two theoretical sums exactly, since the metered oil for the day is the same number in both runs. Field 5 must land between 50 and 60 per cent, and it must equal what the harmonic and hyperbolic forms do NOT give at the same nominal decline, so a learner who used the wrong form will miss it by more than a whole point. Field 6 must be larger than the oil figure it came from and smaller than half as much again, and it must land between 900 and 1000 bbl/d. And the last check is the course itself: field 6 is a LIQUID rate handed to a screening module that documents its target rate as liquid, and the same number is handed to an advisor module that reads it as OIL, and the shipped studio passes ONE number to both.',
  jsonb_build_array(
    jsonb_build_object('key','seam_a4_gor_mean_of_ratios_scfstb', 'label','Recent window gas-oil ratio of AKASO-4 as a mean of daily ratios', 'unit','scf/stb', 'expected',1299.5858432518382, 'tol',0.00065),
    jsonb_build_object('key','seam_a4_gor_volumetric_scfstb', 'label','The same window gas-oil ratio formed volumetrically', 'unit','scf/stb', 'expected',816.4264345934184, 'tol',0.00041),
    jsonb_build_object('key','seam_a4_watercut_mean_of_ratios_frac', 'label','Recent window watercut of AKASO-4 as a mean of daily ratios', 'unit','fraction', 'expected',0.5495040840900905, 'tol',2.8e-07),
    jsonb_build_object('key','alloc_oil_factor_last_day_with_invalid_tests', 'label','Oil allocation factor on 2026-04-25 with the invalid test included', 'unit','dimensionless', 'expected',0.49505753140085595, 'tol',2.5e-07),
    jsonb_build_object('key','decline_a8_effective_pct', 'label','Annual effective decline of AKASO-8', 'unit','per cent', 'expected',53.53635466831279, 'tol',2.7e-05),
    jsonb_build_object('key','lift_a4_liquid_rate_bpd', 'label','Liquid rate the lift handoff implies', 'unit','bbl/d', 'expected',950.0794836795422, 'tol',0.00048)
  )
)
on conflict (app_slug, tier) do nothing;

-- ---------------------------------------------------------------------------
-- THE CROSS-TIER PROMPT-LEAK GATE, RUN HERE RATHER THAN ONLY AT GO-LIVE.
--
-- A capstone's conditions have to state everything that changes an answer, and
-- in a chained domain the thing that changes one tier's answer is often
-- another tier's quantity. This course chains twice: the Expert tier's liquid
-- rate is the Professional tier's allocated volume divided by one less the
-- Associate tier's field watercut. State either and the value has been handed
-- over; leave both out and the field is not gradeable. It is gradeable here
-- because the Expert prompt restates the LEDGER, the TESTS, the METER and the
-- SETTINGS from raw conditions and names the two identities in WORDS, so a
-- learner reconstructs both quantities rather than reading either. Neither the
-- lesson leakage sweep nor the digest guard can see this, because a migration
-- is not a lesson, so the check lives in the migration that writes the prompts.
-- ---------------------------------------------------------------------------
do $$
declare
  v_leaks integer;
begin
  select count(*) into v_leaks
    from public.academy_capstones c,
         public.academy_capstones c2,
         lateral jsonb_array_elements(c2.fields) f
   where c.app_slug = 'surveillance' and c2.app_slug = 'surveillance' and c.tier <> c2.tier
     and replace(c.prompt, ',', '') like '%' || (f->>'expected') || '%';
  if v_leaks <> 0 then
    raise exception 'PD9 refused: % capstone prompt(s) state a graded value belonging to another tier', v_leaks;
  end if;
end $$;

-- No go-live here. See 20260904_pd9_surveillance_go_live.sql.
