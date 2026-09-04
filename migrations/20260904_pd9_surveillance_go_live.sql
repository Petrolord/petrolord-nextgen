-- ============================================================================
-- PD9 GO-LIVE (HELD): Production Surveillance flips to 'available'. This is
-- the NINTH AND LAST Production & Artificial Lift course, behind 'nodal' at
-- path_order 38.
--
-- THIS MIGRATION IS HELD. Do NOT run it until a NextGen production upload
-- carries the route /dashboard/apps/surveillance. That upload is the gate, and
-- nothing else releases this file.
--
-- Every assertion below is written from the ENGINE's behaviour rather than
-- from the seed, and every number in it was RECOMPUTED from the stated
-- conditions before it was written down. THE RECOMPUTATION IS IN THIS FILE.
-- The AKASO ledger, the facility meter and the well tests are rebuilt here
-- from the capstone's own closed forms and cycle tables, in PostgreSQL, and
-- every window mean, every ratio, every allocation factor and every allocated
-- volume is re-derived from that rebuild with the engine's own window
-- inequalities restated rather than copied. Wherever a field is a closed form
-- it is asserted AS A FORMULA out of the stated constants and never as a magic
-- number: the annual effective decline is written as one less e to the minus
-- Di times 365, the last day's theoretical oil is written as the three test
-- rates times their own uptimes, and the liquid rate is written as an
-- allocated volume over one less a water cut.
--
-- A separate pass outside this file re-derived all eighteen from the same
-- conditions in a THIRD language, with calendar dates rather than day numbers
-- and with the allocation written as an explicit per-day loop, before a line
-- of this was written. All eighteen agreed, fourteen of them to the last bit
-- and the worst by 3.97e-10 of a grading tolerance, on the mean-of-daily-ratios
-- watercut. NOTHING DISAGREED. On PD4 two of thirty-five assertions were wrong
-- on the first pass and only a numeric re-verification found them, which is why
-- that pass is now the rule rather than a courtesy.
--
-- ONE FINDING CAME OUT OF THAT PASS AND IS RECORDED HERE RATHER THAN QUIETLY
-- DROPPED, AND IT IS THIS COURSE'S OWN THESIS TURNED ON THE COURSE. The wave's
-- summary of `maxTestAgeDays` said that setting it to zero turns the age check
-- off AND GIVES THE FACTOR NEAREST ONE. The first half is right and is asserted
-- below. The second half DEPENDS ENTIRELY ON WHICH FACTOR IS MEANT, which is
-- the one thing this module keeps failing to say.
--
--   THE LAST DAY factor is the column the digest actually prints in its
--   maxTestAgeDays sweep, and on the TEACHING field the original claim is TRUE
--   on it: 0.909283141463 at zero days against 1.190463125091 at the 180 day
--   default and 1.348582874057 at sixty, so zero IS nearest one, and it also
--   carries the thinnest diagnostic list at 42 against 57. That is the reading
--   the lessons and the banks teach and it is correct as they state it.
--
--   THE WHOLE WINDOW factor is a different quantity, the digest's published
--   allocated oil of 58426.784897363 stb over its own published theoreticals,
--   and on it the claim is FALSE: 0.898404773212 at zero against
--   1.067859586874 at the default and 1.491544595562 at sixty.
--
--   ON AKASO's last allocated day the claim is FALSE as well: 0.486041561858
--   at zero against 0.576116163728 at the 180 day default and 0.912455691958
--   at 45 or 60 days, so zero is the FURTHEST of the three from one.
--
-- An earlier draft of this header said flatly that the claim was untrue on
-- either field, having compared a whole-window factor against a statement made
-- about a last-day one. Two numbers, both correct, about different columns,
-- asserted against each other: this file is seeding a course whose Expert tier
-- is built on exactly that mistake, so it is written out in full here rather
-- than resolved silently in one direction.
--
-- What is true on BOTH fields and under EITHER reading, and is sharper than
-- the original claim either way, is asserted instead: ZERO DAYS RETURNS EXACTLY THE
-- ANSWER 365 DAYS RETURNS, on both fields, while ONE DAY, which is the next
-- setting up, allocates NOTHING AT ALL because no well has a test in force.
-- The strictest-looking setting on the dial is not merely loose, it is
-- IDENTICAL TO THE LOOSEST, and the setting beside it is the only one on the
-- whole dial that refuses everything.
--
-- Most assertions are PAIRS, because a one-sided check passes on a capstone
-- quietly recut into the mistake the course exists to correct.
--
-- THE PAIR THAT MATTERS MOST IS THE ONE RATIO READ TWO WAYS. The recent window
-- gas-oil ratio formed as the mean of the daily ratios must clear the
-- doubling and report HIGH against the well's own baseline, AND the same ratio
-- over the same seven rows formed volumetrically must fail to clear even the
-- trigger, so the identical rows give a high exception on one reading and NO
-- EXCEPTION AT ALL on the other. Both, or the Expert tier has nothing. The
-- watercut carries the same pair one notch down the ladder, high against
-- medium. And a third assertion closes it from the other side: over the
-- BASELINE window, which is thirty uniform days, the two readings must agree to
-- 1e-12 on BOTH ratios. That is what makes the seam a property of the window
-- rather than of the arithmetic, and it is why a test fixture of tidy days
-- could never have caught it.
--
-- THE SECOND PAIR IS THE COLUMN THE EXCEPTION ENGINE DOES NOT READ. On the
-- well that lost its hours, the CALENDAR volume must fall past the doubling, so
-- a rate exception is raised at the top of the ladder, AND the PRODUCING-DAY
-- rate over the identical two windows must move by less than the trigger, so
-- nothing at all would have been raised had the other column been read. Either
-- alone is a number. The two together are the finding, and a third assertion
-- prices it: the graded window means are means of the OIL column, which is a
-- volume in stb, and the engine prints stb/d after them.
--
-- THE THIRD PAIR IS THE WELL THAT FILED NOTHING. The oil factor with the
-- invalid test excluded and the same factor with it included must differ, and
-- the ratio between them must be EXACTLY the ratio of the two theoretical sums,
-- because the metered oil for that day is the same number in both runs. And the
-- well that enters the sum must have filed NO ledger row on that date at all
-- and still be credited with a full day on stream. One without the other is
-- half the defect: the first alone says a dial moved a number, the second alone
-- says a default fired.
--
-- THE FOURTH PAIR IS THE METER AND THE LEDGER. The imbalance on the last day
-- must be POSITIVE and must be many times the 1.2 per cent the meter bias alone
-- would explain, AND the mean imbalance over the days the quiet well was still
-- filing must be exactly that bias, to 1e-9. The pair says the jump is the well
-- and not the instrument. A third assertion ties it to a setting rather than to
-- a number: the same day's factor on the LEDGER basis, where the wells' own
-- meters are the split and no test is read at all, must equal one plus the
-- imbalance over a hundred, exactly.
--
-- AND THE FIFTH IS THE WELL THAT RAISES NOTHING, which is a group of four
-- because "nothing" is only interesting if every check really was evaluated.
-- The clean well's rate change must sit under the trigger, its watercut rise
-- must be exactly zero, its gas-oil ratio rise must be exactly zero and its
-- mean recent hours must be a full day. A capstone whose quiet well was quiet
-- because it was too small to be checked would teach the opposite of the point.
--
-- A GATE THIS COURSE ADDS TO THE PERMANENT SET, AND IT IS THE WARNING THAT
-- SHAPED THE WHOLE WAVE. NO GRADED FIELD MAY BE A QUANTITY THAT DEPENDS ON
-- WHEN THIS MIGRATION RUNS. `summarizeDeferments` defaults its `asOf` to the
-- wall clock, so any quantity derived from it changes daily and cannot be
-- graded, gated, or published in a digest. The gate refuses any graded field
-- whose key or label names a deferment or an open event, and beside it sit
-- three ANCHORED recomputations which show the anchor deciding the answer
-- without ever reading today's date: an event open from 2026-04-19 accrues 7
-- days to an anchor of 2026-04-25 and 37 days to an anchor of 2026-05-25, and
-- an event whose end date falls a month BEFORE its start counts exactly 1 day,
-- the same as one that started and ended on the same day. The wave's own first
-- probe of this got the arithmetic wrong by comparing a ROUNDED current instant
-- against a FLOORED UTC date string, which made the answer depend on the time
-- of day, which is precisely why nothing here reads a clock.
--
-- A SECOND GATE, CARRIED FORWARD FROM PD7 AND PD8. NO GRADED FIELD MAY LAND
-- NEAR A VALUE THE LEARNER IS HANDED IN THE PROMPT. This domain hands over a
-- great many conditions: two rate cycles, three seven-row tables, four decline
-- constants, four phase fractions, six test rates with their durations and
-- pressures, a meter bias and eight surveillance settings. Every one of those
-- sits in front of the learner while they are graded, and a graded field that
-- landed on one of them would be a transcription rather than a calculation. It
-- matters here because several stated conditions sit in the same band as the
-- graded values: the test gas rate of 816 Mscf/d is 0.43 away from the
-- volumetric gas-oil ratio, and the first recent hours figure of 11.4 h is
-- 0.043 away from the mean of the seven, so both are checked explicitly and
-- both clear their band by more than seventy windows.
--
-- WHAT THE WINDOWS ARE SIZED ON, AND WHY THERE ARE FOUR RATHER THAN PD8's
-- THREE. This wave grades one value four orders of magnitude above the
-- smallest, so a single large-band window would have to be loose enough for an
-- allocated volume of eighteen thousand barrels and tight enough for a
-- producing-day rate of six hundred, and the nearest published neighbour to
-- that rate sits 0.050 away. A fourth band is what keeps both ends honest.
--
--   BAND ONE, the four graded values below 2: two watercuts and two allocation
--   factors. Largest grader tolerance 2.9e-7. Nearest guarded published
--   neighbour 5.664e-4, the field watercut of 0.29355876 against the published
--   thirty-day KPI watercut of 0.29412514. A window of 1e-5 sits 34.5 TIMES
--   ABOVE the largest tolerance it covers and 56.6 TIMES BELOW the nearest
--   neighbour it must not catch.
--
--   BAND TWO, the four graded values between 2 and 100: an uptime, an hours
--   mean, an imbalance percentage and an effective decline. Largest tolerance
--   4.4e-5. Nearest neighbour 0.1070, the hours mean of 11.35714 against the
--   teaching well's volumetric gas-oil ratio rise of 11.25013. A window of
--   0.002 sits 45.5 times above the largest tolerance and 53.5 times below that
--   neighbour.
--
--   BAND THREE, the nine graded values between 100 and 10000: four volume
--   means, three gas-oil ratios and a liquid rate. Largest tolerance 8.5e-4.
--   Nearest neighbour 0.05006, the producing-day oil rate of 626.31579 against
--   an allocated gas volume of 626.36585 in the published allocation case. A
--   window of 0.006 sits 7.06 times above the largest tolerance and 8.34 times
--   below that neighbour. That is the tightest group in the course and it is
--   tight for a structural reason worth naming: a ledger module returns volumes
--   and rates in the hundreds and thousands, and the published fixtures are
--   full of them.
--
--   BAND FOUR, the one graded value at 10000 or above: the oil allocated to one
--   well over twenty-one days. Tolerance 0.0092. Nearest neighbour 166.2. A
--   window of 0.1 sits 10.9 times above the tolerance and 1662 times below that
--   neighbour.
--
-- The eighteen graded values were swept against 14845 published numbers, all
-- four goldens and the teaching digest together, with ZERO collisions, ZERO
-- integer notes, and no approach closer than 156.5 times a field's own grading
-- tolerance.
--
-- AND THE STANDING CROSS-TIER PROMPT GATE, which re-reads the STORED prompts.
-- Three couplings were drafted into the Expert prompt and taken out: the
-- Associate tier's field watercut, because a liquid rate is one division from
-- a stated water cut; the Professional tier's last-day oil factor, because the
-- two factors differ by one ratio of theoretical sums; and the Professional
-- tier's allocated volume for that well, for the same reason. All three are
-- stated as IDENTITIES IN WORDS in the free checks instead, and all three are
-- asserted here as arithmetic, which is the device PD5 used on its cycle gas,
-- PD6 on its heat-loss-only arrival, PD7 on its manifold pressure and PD8 on
-- its geometry group.
-- ============================================================================

do $$
declare
  v_n          integer;
  v_n2         integer;
  v_structures integer;
  v_capstones  integer;
  v_questions  integer;
  v_graded     integer;
  -- the eighteen graded values
  v_b1 double precision; v_b2 double precision; v_b3 double precision;
  v_b4 double precision; v_b5 double precision; v_b6 double precision;
  v_i1 double precision; v_i2 double precision; v_i3 double precision;
  v_i4 double precision; v_i5 double precision; v_i6 double precision;
  v_a1 double precision; v_a2 double precision; v_a3 double precision;
  v_a4 double precision; v_a5 double precision; v_a6 double precision;
  -- recomputed quantities
  v_recfrom integer; v_recto integer; v_basefrom integer; v_baseto integer;
  v_kpifrom integer;
  v_o double precision; v_w double precision; v_g double precision;
  v_x double precision; v_y double precision; v_z double precision;
  v_th double precision; v_thi double precision; v_meter double precision;
  v_booked double precision; v_a4alloc double precision;
  v_uptimenoobs double precision; v_slots integer;
  v_calrec double precision; v_calbase double precision;
  v_pdrec double precision; v_pdbase double precision;
  v_volgor double precision; v_volwc double precision;
  v_basegor_mor double precision; v_basegor_vol double precision;
  v_basewc_mor double precision; v_basewc_vol double precision;
  v_factorsum double precision; v_grandm double precision; v_granda double precision;
  v_ledgerfactor double precision; v_meanpre double precision; v_meanpost double precision;
  v_f0 double precision; v_f1 double precision; v_f365 double precision;
  v_th0 double precision; v_th365 double precision;
  -- STATED CONDITIONS, all hand retyped from the capstone's own prompts and
  -- none of them read out of the wave's derivation. Not one is a graded value.
  c_d0       constant date             := date '2026-02-05'; -- first ledger day
  c_dn       constant date             := date '2026-04-25'; -- last ledger day
  c_days     constant integer          := 80;
  c_a12last  constant date             := date '2026-04-14'; -- last row it files
  c_allocfrom constant date            := date '2026-04-05'; -- first metered day
  c_a4wf     constant double precision := 0.27;    -- AKASO-4 water as a fraction of oil
  c_a4gf     constant double precision := 0.7;     -- AKASO-4 gas Mscf per stb of oil
  c_a6wf     constant double precision := 0.18;
  c_a6gf     constant double precision := 0.55;
  c_a8qi     constant double precision := 940;     -- stb on the first ledger day
  c_a8di     constant double precision := 0.0021;  -- nominal, per DAY
  c_a8wf     constant double precision := 0.42;
  c_a8gf     constant double precision := 0.61;
  c_a12qi    constant double precision := 455;
  c_a12di    constant double precision := 0.0125;
  c_a12wf    constant double precision := 0.30;
  c_a12gf    constant double precision := 0.53;
  c_bias     constant double precision := 1.012;   -- the facility meter bias
  -- the engine's own surveillance settings, restated so a settings override
  -- that moved one would fail here rather than silently move every printed
  -- severity in the course
  c_recent   constant integer          := 7;
  c_base     constant integer          := 30;
  c_ratedrop constant double precision := 20;      -- per cent, high at twice
  c_wcrise   constant double precision := 10;      -- POINTS, high at twice
  c_gorrise  constant double precision := 30;      -- per cent, high at twice
  c_downhrs  constant double precision := 12;
  c_staledays constant integer         := 7;
  c_minoil   constant double precision := 5;
  -- the engine's own allocation settings
  c_maxage   constant integer          := 180;
  c_defhours constant double precision := 24;
  c_warnlo   constant double precision := 0.7;
  c_warnhi   constant double precision := 1.3;
  -- domain constants
  c_mindur   constant double precision := 4;       -- the test QC minimum duration, h
  c_hday     constant double precision := 24;      -- hours in a producing day
  c_mscf     constant double precision := 1000;    -- scf per Mscf
  c_year     constant double precision := 365;     -- the day count Di is annualised over
  -- the two anchors the deferment recomputation uses, and neither is today
  c_anchor1  constant date             := date '2026-04-25';
  c_anchor2  constant date             := date '2026-05-25';
  c_openfrom constant date             := date '2026-04-19';
begin
  -- ---------------------------------------------------------------- shape --
  select count(*) into v_structures
    from public.academy_course_structures where app_slug = 'surveillance' and active;
  if v_structures <> 3 then
    raise exception 'PD9 go-live refused: surveillance has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions
    from public.academy_quiz_questions where app_slug = 'surveillance';
  if v_questions <> 396 then
    raise exception 'PD9 go-live refused: surveillance has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_n from (
    select tier from public.academy_quiz_questions
     where app_slug = 'surveillance' group by tier having count(*) = 132) q;
  if v_n <> 3 then
    raise exception 'PD9 go-live refused: the 396 questions do not split 132 per tier';
  end if;

  select count(*) into v_n from (
    select tier, scope from public.academy_quiz_questions
     where app_slug = 'surveillance' and scope = 'final'
     group by tier, scope having count(*) = 42) q;
  if v_n <> 3 then
    raise exception 'PD9 go-live refused: a tier does not carry a 42 question final exam';
  end if;

  select count(*) into v_capstones
    from public.academy_capstones where app_slug = 'surveillance';
  if v_capstones <> 3 then
    raise exception 'PD9 go-live refused: surveillance has % capstones, expected 3', v_capstones;
  end if;

  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'surveillance';
  if v_graded <> 18 then
    raise exception 'PD9 go-live refused: surveillance grades % capstone fields, expected 18', v_graded;
  end if;

  select count(*) into v_graded from (
    select c.tier, count(*) as k
      from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug = 'surveillance' group by c.tier having count(*) = 6) q;
  if v_graded <> 3 then
    raise exception 'PD9 go-live refused: the eighteen graded fields do not split six per tier';
  end if;

  -- ------------------------------------------------- the prerequisite row --
  if not exists (select 1 from public.academy_apps where slug = 'surveillance'
                   and module = 'production' and path_order = 38 and prereq_slug = 'nodal') then
    raise exception 'PD9 go-live refused: the surveillance catalog row is not production/38 with prereq nodal';
  end if;
  if not exists (select 1 from public.academy_apps where slug = 'nodal') then
    raise exception 'PD9 go-live refused: the prerequisite course nodal is not in the catalog';
  end if;
  -- PD9 is the NINTH and last of the series, so the eighth must already be
  -- seated one place ahead of it and nothing else may hold this place.
  if not exists (select 1 from public.academy_apps where slug = 'intervention'
                   and module = 'production' and path_order = 37) then
    raise exception 'PD9 go-live refused: the eighth Production course is not seated at production/37, so this course is not the ninth of a contiguous series';
  end if;
  select count(*) into v_n from public.academy_apps
   where module = 'production' and path_order = 38;
  if v_n <> 1 then
    raise exception 'PD9 go-live refused: % production courses claim path_order 38', v_n;
  end if;

  -- -------------------------------------------------- the scope assertion --
  -- These are LEDGER modules. What they return is volumes over rows, rates,
  -- ratios, window means, allocation factors and one decline read off a fit.
  -- They return no pressure, no temperature, no permeability, no length, no
  -- power and no money, so nothing here may certify one.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'surveillance'
     and (f->>'unit'  ilike '%psi%'       or f->>'unit'  ilike '%bar%'
       or f->>'unit'  ilike '%degf%'      or f->>'unit'  ilike '%degc%'
       or f->>'unit'  ilike '%btu%'       or f->>'unit'  ilike '%usd%'
       or f->>'unit'  ilike '%md%'        or f->>'unit'  ilike '%darcy%'
       or f->>'unit'  ilike '%hp%'        or f->>'unit'  =    'ft'
       or f->>'unit'  =    'in'           or f->>'unit'  =    'lb'
       or f->>'label' ilike '%pressure%'  or f->>'label' ilike '%temperature%'
       or f->>'label' ilike '%permeab%'   or f->>'label' ilike '%npv%'
       or f->>'label' ilike '%cost%'      or f->>'label' ilike '%revenue%'
       or f->>'label' ilike '%reserve%'   or f->>'label' ilike '%eur%'
       or f->>'label' ilike '%horsepower%'or f->>'label' ilike '%torque%'
       or f->>'label' ilike '%skin%'      or f->>'label' ilike '%depth%');
  if v_graded <> 0 then
    raise exception 'PD9 go-live refused: % capstone field(s) grade a quantity these ledger modules never compute', v_graded;
  end if;

  -- --------------- A SEVERITY IS NOT A NUMBER, AS A GATE ------------------
  -- A severity, a diagnostic code, a well type, a mechanism and a verdict are
  -- all strings in these four modules, and grading one at a numeric tolerance
  -- would be a category error. The gate is anchored on the label's LEADING
  -- noun rather than on a bare substring, because several graded fields
  -- legitimately mention what they are compared against.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'surveillance'
     and (f->>'label' ~* '^(the )?(severity|verdict|mechanism|diagnostic|well type|exception type|recommendation|confidence|status)\M'
       or f->>'unit'  ilike '%severity%'  or f->>'unit'  ilike '%verdict%'
       or f->>'unit'  ilike '%boolean%'   or f->>'unit'  ilike '%text%'
       or f->>'unit'  ilike '%code%');
  if v_graded <> 0 then
    raise exception 'PD9 go-live refused: % capstone field(s) grade a string this module returns as a label rather than as a measurement', v_graded;
  end if;

  -- ---- NOTHING MAY BE GRADED THAT DEPENDS ON WHEN THIS FILE RUNS ---------
  -- `summarizeDeferments` defaults its anchor to the wall clock, so every
  -- quantity derived from it changes daily and none of them can be graded,
  -- gated or published. This is PD9's own addition to the permanent set.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'surveillance'
     and (f->>'key'   ilike '%defer%'      or f->>'label' ilike '%defer%'
       or f->>'key'   ilike '%open_event%' or f->>'label' ilike '%open event%'
       or f->>'label' ilike '%as of today%' or f->>'label' ilike '%to date%');
  if v_graded <> 0 then
    raise exception 'PD9 go-live refused: % capstone field(s) grade a deferment quantity, which reads the wall clock when its anchor is omitted and therefore answers differently tomorrow on the same data', v_graded;
  end if;
  -- and the anchored recomputations that show the anchor deciding the answer,
  -- neither of which reads a clock.
  if greatest(1, (c_anchor1 - c_openfrom) + 1) <> 7 then
    raise exception 'PD9 go-live refused: an event open from 2026-04-19 does not accrue 7 days to an anchor of 2026-04-25, it accrues %', greatest(1, (c_anchor1 - c_openfrom) + 1);
  end if;
  if greatest(1, (c_anchor2 - c_openfrom) + 1) <> 37 then
    raise exception 'PD9 go-live refused: the same open event does not accrue 37 days to an anchor of 2026-05-25, it accrues %', greatest(1, (c_anchor2 - c_openfrom) + 1);
  end if;
  if greatest(1, (c_anchor1 - c_openfrom) + 1) = greatest(1, (c_anchor2 - c_openfrom) + 1) then
    raise exception 'PD9 go-live refused: the two anchors give the same day count, so the anchor no longer decides the answer and the finding has nothing to show';
  end if;
  -- the clamp: an event that ended a month BEFORE it started is silently one
  -- day, exactly like one that started and ended on the same day.
  if greatest(1, (date '2026-03-19' - c_openfrom) + 1) <> 1
     or greatest(1, (c_openfrom - c_openfrom) + 1) <> 1 then
    raise exception 'PD9 go-live refused: the day-count clamp no longer reads a backwards event and a same-day event as the same one day';
  end if;

  -- and the units that ARE allowed are this domain's own and nothing else
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'surveillance'
     and f->>'unit' not in ('stb', 'stb/d', 'bbl/d', 'scf/stb', 'fraction', 'per cent', 'h', 'dimensionless');
  if v_graded <> 0 then
    raise exception 'PD9 go-live refused: % capstone field(s) carry a unit outside this domain''s own set', v_graded;
  end if;
  -- A WINDOW MEAN OF THE LEDGER'S OIL COLUMN IS A VOLUME, AND THIS COURSE SAYS
  -- SO IN THE UNIT. The engine's own exception message prints stb/d after
  -- exactly this quantity on every ledger, which is the one place in the
  -- module that states a unit and states the wrong one. The three fields that
  -- are means of a ledger volume column must carry a VOLUME unit here.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'surveillance'
     and f->>'key' in ('field_kpi_oil_stbd', 'a4_recent_oil_mean_stbd', 'a4_baseline_oil_mean_stbd')
     and f->>'unit' <> 'stb';
  if v_graded <> 0 then
    raise exception 'PD9 go-live refused: % graded window mean(s) of a ledger volume column carry a RATE unit, which is the engine''s own mistake and not this course''s', v_graded;
  end if;

  -- ---------- NO GRADED FIELD MAY BE A NUMBER THE PROMPT HANDS OVER ------
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         (values (1184),(1163),(1201),(1172),(1195),(1158),(0.27),(0.7),
                 (1146),(381),(861),(1132),(377),(848),(1151),(384),(869),
                 (63),(214),(107),(58),(206),(101),(66),(219),(112),(61),(211),(104),
                 (648),(634),(655),(641),(0.18),(0.55),
                 (11.4),(297.5),(53.6),(164.0),(9.6),(251.0),(45.2),(138.5),
                 (13.2),(344.8),(62.1),(190.1),(8.1),(211.5),(38.1),(116.6),
                 (12.7),(331.8),(59.7),(182.9),(10.3),(269.1),(48.4),(148.4),
                 (14.2),(370.9),(66.8),(204.5),
                 (940),(0.0021),(0.42),(0.61),(455),(0.0125),(0.30),(0.53),
                 (3240),(3180),(3260),(2140),(2080),(2160),(2100),(2050),(2190),(2120),
                 (1.012),(1210),(328),(1165),(316),(816),(651),(117),(358),
                 (905),(620),(552),(195),(241),(402),(172),(213),
                 (340),(335),(295),(310),(260),(248),(3.0),
                 (80),(69),(21),(24),(7),(30),(20),(10),(12),(5),(180),
                 (0.7),(1.3),(365),(1000),(100),(6),(4),(3),(2),(1)) as h(v)
   where c.app_slug = 'surveillance'
     and abs(abs((f->>'expected')::numeric) - h.v) <
         (case when abs((f->>'expected')::numeric) < 2     then 0.00001
               when abs((f->>'expected')::numeric) < 100   then 0.002
               when abs((f->>'expected')::numeric) < 10000 then 0.006
               else 0.1 end);
  if v_graded <> 0 then
    raise exception 'PD9 go-live refused: % graded field(s) land on a number the learner is handed in the prompt, which makes the field a transcription rather than a calculation', v_graded;
  end if;

  -- --------------------------------------- the published-golden assertion --
  -- BAND ONE, the four graded values below 2. Window 1e-5.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'surveillance' and abs((f->>'expected')::numeric) < 2
     and (abs(abs((f->>'expected')::numeric) - 0.294125143367) < 0.00001 -- GOLDEN surveillance kpis30 watercut
       or abs(abs((f->>'expected')::numeric) - 0.294985250737) < 0.00001 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 0.290000000000) < 0.00001 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 0.580000000000) < 0.00001 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 0.288888888889) < 0.00001 -- GOLDEN surveillance fieldSeries watercut
       or abs(abs((f->>'expected')::numeric) - 0.500000000000) < 0.00001 -- GOLDEN surveillance effectiveDecline b
       or abs(abs((f->>'expected')::numeric) - 0.500666667000) < 0.00001 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 0.300000000000) < 0.00001 -- GOLDEN lift_advisor liquidGravity wct
       or abs(abs((f->>'expected')::numeric) - 0.538552787663) < 0.00001 -- GOLDEN surveillance ratioSeam recentVolumetric
       or abs(abs((f->>'expected')::numeric) - 0.561904761905) < 0.00001 -- GOLDEN surveillance exception value
       or abs(abs((f->>'expected')::numeric) - 0.481927710843) < 0.00001 -- GOLDEN allocation imbalancePct
       or abs(abs((f->>'expected')::numeric) - 0.280000000000) < 0.00001 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 0.279822861888) < 0.00001 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 0.308028712502) < 0.00001 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 0.510000000000) < 0.00001 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 0.534000000000) < 0.00001 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 0.310000000000) < 0.00001 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 0.512500000000) < 0.00001 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 0.530956848030) < 0.00001 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 0.312108055958) < 0.00001 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 0.594689017053) < 0.00001 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 0.312192020347) < 0.00001 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 0.273405931101) < 0.00001 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 0.270954648876) < 0.00001 -- teaching digest, the teaching field watercut
       or abs(abs((f->>'expected')::numeric) - 0.316515026192) < 0.00001 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 0.270000000000) < 0.00001 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 0.471428571429) < 0.00001 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 0.600000000000) < 0.00001 -- teaching digest, the factor band sweep
       or abs(abs((f->>'expected')::numeric) - 0.470000000000) < 0.00001 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 0.268292682927) < 0.00001 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 0.523023940915) < 0.00001 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 0.265052197135) < 0.00001 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 0.465972222000) < 0.00001 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 0.457211373758) < 0.00001 -- GOLDEN surveillance movingAverageWatercut
       or abs(abs((f->>'expected')::numeric) - 0.337719298246) < 0.00001);-- GOLDEN surveillance kpis watercut
  if v_graded <> 0 then
    raise exception 'PD9 go-live refused: % graded field(s) below 2 sit within 1e-5 of a published value, which makes them a lookup rather than a calculation', v_graded;
  end if;

  -- BAND TWO, the four graded values between 2 and 100. Window 0.002.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'surveillance'
     and abs((f->>'expected')::numeric) >= 2 and abs((f->>'expected')::numeric) < 100
     and (abs(abs((f->>'expected')::numeric) - 11.250129500) < 0.002 -- teaching volumetric GOR rise
       or abs(abs((f->>'expected')::numeric) - 15.000000000) < 0.002 -- GOLDEN lift_screening delta
       or abs(abs((f->>'expected')::numeric) - 87.000000000) < 0.002 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 53.333333000) < 0.002 -- GOLDEN allocation imbalance
       or abs(abs((f->>'expected')::numeric) - 15.500000000) < 0.002 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 11.000000000) < 0.002 -- GOLDEN lift_advisor rod trial spm
       or abs(abs((f->>'expected')::numeric) - 54.000000000) < 0.002 -- GOLDEN lift_advisor stroke
       or abs(abs((f->>'expected')::numeric) - 14.700000000) < 0.002 -- ATM_PSIA
       or abs(abs((f->>'expected')::numeric) - 11.990000000) < 0.002 -- teaching downtime boundary sweep
       or abs(abs((f->>'expected')::numeric) - 12.000000000) < 0.002 -- the downtime threshold itself
       or abs(abs((f->>'expected')::numeric) - 14.500000000) < 0.002 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 54.206896552) < 0.002 -- GOLDEN allocation allocated water
       or abs(abs((f->>'expected')::numeric) - 54.236118203) < 0.002 -- teaching nodal deviation
       or abs(abs((f->>'expected')::numeric) - 54.285714286) < 0.002 -- GOLDEN allocation allocated water
       or abs(abs((f->>'expected')::numeric) - 14.414285714) < 0.002 -- teaching OGUTA-6 mean recent hours
       or abs(abs((f->>'expected')::numeric) - 86.000000000) < 0.002 -- GOLDEN lift_advisor stroke
       or abs(abs((f->>'expected')::numeric) - 16.000000000) < 0.002 -- GOLDEN allocation imbalance
       or abs(abs((f->>'expected')::numeric) - 10.460251000) < 0.002 -- GOLDEN allocation imbalancePct
       or abs(abs((f->>'expected')::numeric) - 54.453085951) < 0.002 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 12.292682927) < 0.002 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 10.417827298) < 0.002 -- GOLDEN allocation imbalancePct
       or abs(abs((f->>'expected')::numeric) - 12.300000000) < 0.002 -- teaching OGUTA-6 hours
       or abs(abs((f->>'expected')::numeric) - 14.100000000) < 0.002 -- teaching OGUTA-6 hours
       or abs(abs((f->>'expected')::numeric) - 85.714285714) < 0.002 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 10.194986072) < 0.002 -- GOLDEN allocation imbalancePct
       or abs(abs((f->>'expected')::numeric) - 14.000000000) < 0.002 -- GOLDEN surveillance window days
       or abs(abs((f->>'expected')::numeric) - 88.000000000) < 0.002 -- GOLDEN lift_advisor loadingPct
       or abs(abs((f->>'expected')::numeric) - 52.344827586) < 0.002 -- GOLDEN allocation allocated water
       or abs(abs((f->>'expected')::numeric) - 13.919443157) < 0.002 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 16.500000000) < 0.002 -- teaching OGUTA-6 hours
       or abs(abs((f->>'expected')::numeric) - 10.000000000) < 0.002 -- GOLDEN surveillance deferment days
       or abs(abs((f->>'expected')::numeric) - 9.997699133) < 0.002 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 55.000000000) < 0.002 -- GOLDEN allocation imbalance
       or abs(abs((f->>'expected')::numeric) - 88.333333333) < 0.002 -- GOLDEN surveillance kpis30 uptimePct
       or abs(abs((f->>'expected')::numeric) - 16.681535607) < 0.002 -- GOLDEN surveillance effectivePct
       or abs(abs((f->>'expected')::numeric) - 52.000000000) < 0.002 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 55.137931034) < 0.002 -- GOLDEN allocation allocated water
       or abs(abs((f->>'expected')::numeric) - 9.749303621) < 0.002 -- GOLDEN allocation imbalancePct
       or abs(abs((f->>'expected')::numeric) - 13.000000000) < 0.002 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 9.707112925) < 0.002 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 85.000000000) < 0.002);-- GOLDEN lift_screening raw score
  if v_graded <> 0 then
    raise exception 'PD9 go-live refused: % graded field(s) between 2 and 100 sit within 0.002 of a published value, which makes them a lookup rather than a calculation', v_graded;
  end if;

  -- BAND THREE, the nine graded values between 100 and 10000. Window 0.006.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'surveillance'
     and abs((f->>'expected')::numeric) >= 100 and abs((f->>'expected')::numeric) < 10000
     and (abs(abs((f->>'expected')::numeric) - 626.365854) < 0.006 -- GOLDEN allocation allocated gas
       or abs(abs((f->>'expected')::numeric) - 950.000000) < 0.006 -- GOLDEN allocation nodal instrument
       or abs(abs((f->>'expected')::numeric) - 1178.593239) < 0.006 -- GOLDEN surveillance syntheticDecline oil
       or abs(abs((f->>'expected')::numeric) - 525.016481) < 0.006 -- GOLDEN surveillance syntheticDecline gas
       or abs(abs((f->>'expected')::numeric) - 1300.000000) < 0.006 -- GOLDEN lift_advisor referenceStage sweep
       or abs(abs((f->>'expected')::numeric) - 666.519536) < 0.006 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 525.804597) < 0.006 -- GOLDEN surveillance syntheticDecline gas
       or abs(abs((f->>'expected')::numeric) - 1624.000000) < 0.006 -- GOLDEN allocation allocated oil
       or abs(abs((f->>'expected')::numeric) - 665.333333) < 0.006 -- GOLDEN allocation imbalance gas
       or abs(abs((f->>'expected')::numeric) - 665.171975) < 0.006 -- GOLDEN allocation allocated gas
       or abs(abs((f->>'expected')::numeric) - 526.275862) < 0.006 -- GOLDEN allocation allocated water
       or abs(abs((f->>'expected')::numeric) - 667.142857) < 0.006 -- GOLDEN surveillance movingAverage
       or abs(abs((f->>'expected')::numeric) - 1180.000000) < 0.006 -- GOLDEN allocation nodal measuredStbd
       or abs(abs((f->>'expected')::numeric) - 664.869446) < 0.006 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 524.000000) < 0.006 -- GOLDEN allocation allocated water
       or abs(abs((f->>'expected')::numeric) - 526.593896) < 0.006 -- GOLDEN surveillance syntheticDecline gas
       or abs(abs((f->>'expected')::numeric) - 815.000000) < 0.006 -- GOLDEN allocation theoretical gas
       or abs(abs((f->>'expected')::numeric) - 624.878049) < 0.006 -- GOLDEN allocation allocated gas
       or abs(abs((f->>'expected')::numeric) - 1180.362455) < 0.006 -- GOLDEN surveillance syntheticDecline oil
       or abs(abs((f->>'expected')::numeric) - 1700.000000) < 0.006 -- GOLDEN allocation allocated oil
       or abs(abs((f->>'expected')::numeric) - 1696.765208) < 0.006 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 628.000000) < 0.006 -- GOLDEN allocation theoretical water
       or abs(abs((f->>'expected')::numeric) - 667.981138) < 0.006 -- GOLDEN lift_advisor rod displacement
       or abs(abs((f->>'expected')::numeric) - 1176.923077) < 0.006 -- GOLDEN allocation allocated oil
       or abs(abs((f->>'expected')::numeric) - 668.000000) < 0.006 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 1176.826674) < 0.006 -- GOLDEN surveillance syntheticDecline oil
       or abs(abs((f->>'expected')::numeric) - 664.000000) < 0.006 -- GOLDEN allocation theoretical water
       or abs(abs((f->>'expected')::numeric) - 527.384379) < 0.006 -- GOLDEN surveillance syntheticDecline gas
       or abs(abs((f->>'expected')::numeric) - 523.076923) < 0.006 -- GOLDEN allocation allocated oil
       or abs(abs((f->>'expected')::numeric) - 1696.000000) < 0.006 -- GOLDEN allocation allocated oil
       or abs(abs((f->>'expected')::numeric) - 1700.854409) < 0.006 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 668.750000) < 0.006 -- GOLDEN surveillance fieldSeries gor
       or abs(abs((f->>'expected')::numeric) - 528.176050) < 0.006 -- GOLDEN surveillance syntheticDecline gas
       or abs(abs((f->>'expected')::numeric) - 629.341463) < 0.006 -- GOLDEN allocation allocated gas
       or abs(abs((f->>'expected')::numeric) - 522.187140) < 0.006 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 629.578532) < 0.006 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 1620.000000) < 0.006 -- GOLDEN allocation ledger basis allocated oil
       or abs(abs((f->>'expected')::numeric) - 1182.134328) < 0.006 -- GOLDEN surveillance syntheticDecline oil
       or abs(abs((f->>'expected')::numeric) - 623.000000) < 0.006 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 1182.198120) < 0.006 -- GOLDEN allocation ledger basis allocated oil
       or abs(abs((f->>'expected')::numeric) - 1695.000000) < 0.006 -- GOLDEN allocation ledger basis theoretical oil
       or abs(abs((f->>'expected')::numeric) - 662.591172) < 0.006);-- teaching digest
  if v_graded <> 0 then
    raise exception 'PD9 go-live refused: % graded field(s) between 100 and 10000 sit within 0.006 of a published value, which makes them a lookup rather than a calculation', v_graded;
  end if;

  -- BAND FOUR, the one graded value at 10000 or above. Window 0.1.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'surveillance' and abs((f->>'expected')::numeric) >= 10000
     and (abs(abs((f->>'expected')::numeric) - 18076.860) < 0.1 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 18450.000) < 0.1 -- GOLDEN allocation grand theoretical gas
       or abs(abs((f->>'expected')::numeric) - 18453.333) < 0.1 -- GOLDEN allocation ledger basis theoretical gas
       or abs(abs((f->>'expected')::numeric) - 18560.000) < 0.1 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 18740.000) < 0.1 -- GOLDEN allocation with invalid tests theoretical oil
       or abs(abs((f->>'expected')::numeric) - 18750.000) < 0.1 -- GOLDEN surveillance fieldSeries liquid
       or abs(abs((f->>'expected')::numeric) - 18766.422) < 0.1 -- GOLDEN allocation with invalid tests allocated oil
       or abs(abs((f->>'expected')::numeric) - 18824.610) < 0.1 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 18846.000) < 0.1 -- GOLDEN allocation aged 120 allocated gas
       or abs(abs((f->>'expected')::numeric) - 17400.000) < 0.1 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 17100.000) < 0.1 -- GOLDEN surveillance fieldSeries oil
       or abs(abs((f->>'expected')::numeric) - 19488.000) < 0.1 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 19600.000) < 0.1 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 16495.357) < 0.1 -- GOLDEN allocation allocated oil
       or abs(abs((f->>'expected')::numeric) - 20000.000) < 0.1 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 20010.000) < 0.1 -- GOLDEN allocation no uptime theoretical gas
       or abs(abs((f->>'expected')::numeric) - 20116.009) < 0.1 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 20269.000) < 0.1 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 20568.000) < 0.1 -- GOLDEN allocation grand allocated gas
       or abs(abs((f->>'expected')::numeric) - 15895.651) < 0.1 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 15890.000) < 0.1 -- GOLDEN allocation with invalid tests theoretical gas
       or abs(abs((f->>'expected')::numeric) - 20758.000) < 0.1 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 20900.000) < 0.1 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 20929.578) < 0.1 -- GOLDEN allocation with invalid tests allocated oil
       or abs(abs((f->>'expected')::numeric) - 15540.000) < 0.1 -- teaching maxTestAgeDays sweep theoretical
       or abs(abs((f->>'expected')::numeric) - 20995.477) < 0.1 -- teaching digest, the flagged test that allocates
       or abs(abs((f->>'expected')::numeric) - 15387.086) < 0.1 -- GOLDEN allocation no uptime allocated gas
       or abs(abs((f->>'expected')::numeric) - 15360.000) < 0.1 -- GOLDEN allocation no uptime theoretical oil
       or abs(abs((f->>'expected')::numeric) - 15291.319) < 0.1 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 15140.000) < 0.1 -- GOLDEN allocation monthlyFactors theoretical oil
       or abs(abs((f->>'expected')::numeric) - 15091.594) < 0.1 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 15048.062) < 0.1 -- teaching maxTestAgeDays sweep unallocated
       or abs(abs((f->>'expected')::numeric) - 15000.000) < 0.1 -- GOLDEN surveillance exception baseline
       or abs(abs((f->>'expected')::numeric) - 14970.000) < 0.1 -- GOLDEN allocation no uptime theoretical gas
       or abs(abs((f->>'expected')::numeric) - 21620.000) < 0.1 -- GOLDEN surveillance fieldSeries liquid
       or abs(abs((f->>'expected')::numeric) - 14809.456) < 0.1 -- GOLDEN allocation no uptime allocated oil
       or abs(abs((f->>'expected')::numeric) - 14772.955) < 0.1 -- GOLDEN allocation ledger basis allocated oil
       or abs(abs((f->>'expected')::numeric) - 14768.667) < 0.1 -- GOLDEN allocation ledger basis theoretical water
       or abs(abs((f->>'expected')::numeric) - 21832.000) < 0.1 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 14506.667) < 0.1 -- GOLDEN allocation theoretical oil
       or abs(abs((f->>'expected')::numeric) - 14400.000) < 0.1 -- teaching digest
       or abs(abs((f->>'expected')::numeric) - 14287.675) < 0.1);-- GOLDEN allocation allocated gas
  if v_graded <> 0 then
    raise exception 'PD9 go-live refused: % graded field(s) at 10000 or above sit within 0.1 of a published value, which makes them a lookup rather than a calculation', v_graded;
  end if;

  -- ------------------------------------- the cross-tier prompt-leak gate --
  select count(*) into v_graded
    from public.academy_capstones c,
         public.academy_capstones c2,
         lateral jsonb_array_elements(c2.fields) f
   where c.app_slug = 'surveillance' and c2.app_slug = 'surveillance' and c.tier <> c2.tier
     and replace(c.prompt, ',', '') like '%' || (f->>'expected') || '%';
  if v_graded <> 0 then
    raise exception 'PD9 go-live refused: % capstone prompt(s) state a graded value belonging to another tier', v_graded;
  end if;

  -- ------------------------------------------------------ load the values --
  select (f->>'expected')::double precision into v_b1 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='surveillance' and f->>'key'='a4_low_day_gor_scfstb';
  select (f->>'expected')::double precision into v_b2 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='surveillance' and f->>'key'='a6_producing_day_oil_stbd';
  select (f->>'expected')::double precision into v_b3 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='surveillance' and f->>'key'='field_kpi_oil_stbd';
  select (f->>'expected')::double precision into v_b4 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='surveillance' and f->>'key'='field_kpi_watercut_frac';
  select (f->>'expected')::double precision into v_b5 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='surveillance' and f->>'key'='field_kpi_gor_scfstb';
  select (f->>'expected')::double precision into v_b6 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='surveillance' and f->>'key'='field_kpi_uptime_pct';
  select (f->>'expected')::double precision into v_i1 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='surveillance' and f->>'key'='a4_recent_oil_mean_stbd';
  select (f->>'expected')::double precision into v_i2 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='surveillance' and f->>'key'='a4_baseline_oil_mean_stbd';
  select (f->>'expected')::double precision into v_i3 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='surveillance' and f->>'key'='a6_recent_hours_mean_h';
  select (f->>'expected')::double precision into v_i4 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='surveillance' and f->>'key'='alloc_oil_factor_last_day';
  select (f->>'expected')::double precision into v_i5 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='surveillance' and f->>'key'='alloc_a8_oil_stb';
  select (f->>'expected')::double precision into v_i6 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='surveillance' and f->>'key'='imbalance_oil_pct_last_day';
  select (f->>'expected')::double precision into v_a1 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='surveillance' and f->>'key'='seam_a4_gor_mean_of_ratios_scfstb';
  select (f->>'expected')::double precision into v_a2 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='surveillance' and f->>'key'='seam_a4_gor_volumetric_scfstb';
  select (f->>'expected')::double precision into v_a3 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='surveillance' and f->>'key'='seam_a4_watercut_mean_of_ratios_frac';
  select (f->>'expected')::double precision into v_a4 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='surveillance' and f->>'key'='alloc_oil_factor_last_day_with_invalid_tests';
  select (f->>'expected')::double precision into v_a5 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='surveillance' and f->>'key'='decline_a8_effective_pct';
  select (f->>'expected')::double precision into v_a6 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='surveillance' and f->>'key'='lift_a4_liquid_rate_bpd';

  if v_b1 is null or v_b2 is null or v_b3 is null or v_b4 is null or v_b5 is null
     or v_b6 is null or v_i1 is null or v_i2 is null or v_i3 is null or v_i4 is null
     or v_i5 is null or v_i6 is null or v_a1 is null or v_a2 is null or v_a3 is null
     or v_a4 is null or v_a5 is null or v_a6 is null then
    raise exception 'PD9 go-live refused: one or more of the eighteen graded fields is missing';
  end if;

  -- ============ REBUILD THE LEDGER FROM THE STATED CONDITIONS =============
  -- Nothing below is read out of the wave's derivation. The rows are
  -- regenerated here from the capstone's own cycle tables and closed forms,
  -- and every mean, ratio, factor and allocated volume is re-derived from that
  -- rebuild in SQL, with the engine's window inequalities restated rather than
  -- copied.
  create temp table pd9_ledger as
  with dd as (
    select g as i, (c_d0 + g) as dt from generate_series(0, c_days - 1) as g
  ),
  a4c(k, v) as (values (0, 1184::double precision), (1, 1163), (2, 1201), (3, 1172), (4, 1195), (5, 1158)),
  a6c(k, v) as (values (0, 648::double precision), (1, 634), (2, 655), (3, 641)),
  a2c(k, v) as (values (0, 3240::double precision), (1, 3180), (2, 3260)),
  a4r(r, o, w, g) as (values
    (0, 1146::double precision, 381::double precision, 861::double precision),
    (1, 1132, 377, 848), (2, 1151, 384, 869), (3, 63, 214, 107),
    (4, 58, 206, 101), (5, 66, 219, 112), (6, 61, 211, 104)),
  a6r(r, h, o, w, g) as (values
    (0, 11.4::double precision, 297.5::double precision, 53.6::double precision, 164.0::double precision),
    (1, 9.6, 251.0, 45.2, 138.5), (2, 13.2, 344.8, 62.1, 190.1),
    (3, 8.1, 211.5, 38.1, 116.6), (4, 12.7, 331.8, 59.7, 182.9),
    (5, 10.3, 269.1, 48.4, 148.4), (6, 14.2, 370.9, 66.8, 204.5)),
  a2r(r, v) as (values (0, 2140::double precision), (1, 2080), (2, 2160), (3, 2100), (4, 2050), (5, 2190), (6, 2120))
  select 'AKASO-4'::text as well, 'producer'::text as wtype, dd.i, dd.dt,
         coalesce(a4r.o, a4c.v)                  as oil,
         coalesce(a4r.w, c_a4wf * a4c.v)         as water,
         coalesce(a4r.g, c_a4gf * a4c.v)         as gas,
         0::double precision                     as winj,
         c_hday                                  as hours
    from dd left join a4c on a4c.k = dd.i % 6
            left join a4r on a4r.r = dd.i - (c_days - c_recent)
  union all
  select 'AKASO-6', 'producer', dd.i, dd.dt,
         coalesce(a6r.o, a6c.v),
         coalesce(a6r.w, c_a6wf * a6c.v),
         coalesce(a6r.g, c_a6gf * a6c.v),
         0::double precision,
         coalesce(a6r.h, c_hday)
    from dd left join a6c on a6c.k = dd.i % 4
            left join a6r on a6r.r = dd.i - (c_days - c_recent)
  union all
  select 'AKASO-8', 'producer', dd.i, dd.dt,
         c_a8qi * exp(-c_a8di * dd.i),
         c_a8wf * (c_a8qi * exp(-c_a8di * dd.i)),
         c_a8gf * (c_a8qi * exp(-c_a8di * dd.i)),
         0::double precision, c_hday
    from dd
  union all
  select 'AKASO-12', 'producer', dd.i, dd.dt,
         c_a12qi * exp(-c_a12di * dd.i),
         c_a12wf * (c_a12qi * exp(-c_a12di * dd.i)),
         c_a12gf * (c_a12qi * exp(-c_a12di * dd.i)),
         0::double precision, null::double precision
    from dd where dd.dt <= c_a12last
  union all
  select 'AKASO-2W', 'injector', dd.i, dd.dt,
         0::double precision, 0::double precision, 0::double precision,
         coalesce(a2r.v, a2c.v), c_hday
    from dd left join a2c on a2c.k = dd.i % 3
            left join a2r on a2r.r = dd.i - (c_days - c_recent)
  union all
  select 'AKASO-15', 'observation', dd.i, dd.dt,
         0::double precision, 0::double precision, 0::double precision,
         0::double precision, c_hday
    from dd;

  -- the per-row derived quantities, exactly as derivePoint forms them
  create temp table pd9_pt as
  select l.*,
         case when l.oil > 0 then (l.gas * c_mscf) / l.oil end          as gor,
         case when l.oil + l.water > 0 then l.water / (l.oil + l.water) end as watercut,
         case when l.hours is null then l.oil
              when l.hours <= 0 then null
              else (l.oil * c_hday) / l.hours end                        as oilpd
    from pd9_ledger l;

  -- the field series: daily totals over every well, the injector and the
  -- observation well included at zero
  create temp table pd9_field as
  select i, min(dt) as dt, sum(oil) as oil, sum(water) as water,
         sum(gas) as gas, sum(winj) as winj
    from pd9_ledger group by i;

  -- the window boundaries, derived from the settings rather than typed
  v_recto   := c_days - 1;                      -- the field's own last ledger day
  v_recfrom := v_recto - c_recent;              -- the recent window is (from, to]
  v_baseto  := v_recfrom;
  v_basefrom:= v_recto - c_recent - c_base;
  v_kpifrom := v_recto - c_recent + 1;          -- computeKpis cuts inclusively

  -- ------------------------------------------- the rebuild is what it says --
  select count(*) into v_n from pd9_ledger;
  if v_n <> 469 then
    raise exception 'PD9 go-live refused: the rebuilt ledger holds % rows rather than 469', v_n;
  end if;
  select count(distinct i) into v_n from pd9_ledger;
  if v_n <> c_days then
    raise exception 'PD9 go-live refused: the rebuilt ledger covers % days rather than 80', v_n;
  end if;
  select count(*) into v_n from pd9_ledger where well = 'AKASO-12';
  if v_n <> 69 then
    raise exception 'PD9 go-live refused: the well that goes quiet files % rows rather than 69', v_n;
  end if;
  select count(*) into v_n from pd9_ledger where well = 'AKASO-12' and dt > c_a12last;
  if v_n <> 0 then
    raise exception 'PD9 go-live refused: the quiet well files % rows after the date it is said to stop', v_n;
  end if;
  select count(*) into v_n from pd9_ledger where well = 'AKASO-12' and hours is not null;
  if v_n <> 0 then
    raise exception 'PD9 go-live refused: % of the quiet well''s rows carry an hours figure, so the absent-column finding has nothing to stand on', v_n;
  end if;
  -- the two windows are seven and thirty rows, contiguous and disjoint
  select count(*) into v_n from pd9_field where i > v_recfrom and i <= v_recto;
  select count(*) into v_n2 from pd9_field where i > v_basefrom and i <= v_baseto;
  if v_n <> c_recent or v_n2 <> c_base then
    raise exception 'PD9 go-live refused: the recent and baseline windows hold % and % days rather than 7 and 30', v_n, v_n2;
  end if;
  select count(*) into v_n from pd9_field
   where i > v_recfrom and i <= v_recto and i > v_basefrom and i <= v_baseto;
  if v_n <> 0 then
    raise exception 'PD9 go-live refused: the recent and baseline windows overlap on % days', v_n;
  end if;
  if v_basefrom + c_base <> v_recfrom then
    raise exception 'PD9 go-live refused: there is a gap between the baseline window and the recent window';
  end if;
  -- the baseline window covers each of the six cycle residues exactly five
  -- times, which is what lets a learner check the baseline mean by adding six
  -- numbers instead of thirty
  select count(*) into v_n from (
    select i % 6 as k, count(*) as c from pd9_ledger
     where well = 'AKASO-4' and i > v_basefrom and i <= v_baseto
     group by i % 6 having count(*) = 5) q;
  if v_n <> 6 then
    raise exception 'PD9 go-live refused: the baseline window no longer covers each of the six cycle values exactly five times';
  end if;
  -- and the well's baseline ratios are constant by construction, which is what
  -- makes the seam a property of the RECENT window and of nothing else
  select count(distinct round(gor::numeric, 9)) into v_n from pd9_pt
   where well = 'AKASO-4' and i > v_basefrom and i <= v_baseto;
  select count(distinct round(watercut::numeric, 9)) into v_n2 from pd9_pt
   where well = 'AKASO-4' and i > v_basefrom and i <= v_baseto;
  if v_n <> 1 or v_n2 <> 1 then
    raise exception 'PD9 go-live refused: the seam well''s baseline gas-oil ratio takes % values and its baseline watercut % rather than one each', v_n, v_n2;
  end if;
  select max(gor) into v_x from pd9_pt where well = 'AKASO-4' and i > v_basefrom and i <= v_baseto;
  if abs(v_x - c_a4gf * c_mscf) > 1e-9 then
    raise exception 'PD9 go-live refused: the seam well''s baseline gas-oil ratio is % rather than the 700 scf/stb that 0.7 Mscf per stb makes it', v_x;
  end if;
  select max(watercut) into v_y from pd9_pt where well = 'AKASO-4' and i > v_basefrom and i <= v_baseto;
  if abs(v_y - c_a4wf / (1 + c_a4wf)) > 1e-12 then
    raise exception 'PD9 go-live refused: the seam well''s baseline watercut is % rather than 0.27 over 1.27', v_y;
  end if;
  -- the uptime well's seven recent hours are seven different numbers, so no
  -- mean in its story can be read off a single row
  select count(distinct hours) into v_n from pd9_ledger
   where well = 'AKASO-6' and i > v_recfrom and i <= v_recto;
  if v_n <> c_recent then
    raise exception 'PD9 go-live refused: the uptime well records % distinct hours figures over the recent window rather than 7', v_n;
  end if;
  select count(*) into v_n from pd9_ledger
   where well = 'AKASO-6' and i > v_recfrom and i <= v_recto and hours >= c_hday;
  if v_n <> 0 then
    raise exception 'PD9 go-live refused: % of the uptime well''s recent rows record a full day, so it is not the well the capstone says it is', v_n;
  end if;
  -- the observation well produces nothing and records a perfect day
  select count(*) into v_n from pd9_ledger
   where well = 'AKASO-15' and (oil <> 0 or water <> 0 or gas <> 0 or winj <> 0 or hours <> c_hday);
  if v_n <> 0 then
    raise exception 'PD9 go-live refused: % observation-well rows carry a volume or a partial day', v_n;
  end if;
  -- the injector books nothing produced, and only the exact string 'injector'
  -- is an injector: any other spelling would take the producer path
  select count(*) into v_n from pd9_ledger
   where well = 'AKASO-2W' and (oil <> 0 or water <> 0 or gas <> 0 or winj <= 0);
  if v_n <> 0 then
    raise exception 'PD9 go-live refused: % injector rows book produced volumes', v_n;
  end if;
  select count(*) into v_n from pd9_ledger where well = 'AKASO-2W' and wtype <> 'injector';
  if v_n <> 0 then
    raise exception 'PD9 go-live refused: the injector''s type is not the exact string the engine matches on, and any other spelling takes the producer path';
  end if;

  -- TWO POPULATIONS, NEITHER OF WHICH IS THE OTHER. detectExceptions drops the
  -- observation well and KEEPS the injector; computeKpis drops the injector and
  -- KEEPS the observation well. Both return the same count and neither is the
  -- other, which is worse than a disagreement because a disagreement would show.
  select count(distinct well) into v_n from pd9_ledger where wtype <> 'observation';
  select count(distinct well) into v_n2 from pd9_ledger where wtype <> 'injector';
  if v_n <> v_n2 then
    raise exception 'PD9 go-live refused: the two populations count % and % wells, so the finding that both count the same and neither is the other has gone', v_n, v_n2;
  end if;
  if v_n <> 5 then
    raise exception 'PD9 go-live refused: each population holds % wells rather than 5', v_n;
  end if;
  if not exists (select 1 from pd9_ledger where wtype = 'injector')
     or not exists (select 1 from pd9_ledger where wtype = 'observation') then
    raise exception 'PD9 go-live refused: the field no longer holds one well of each excluded type, so the two populations are the same five wells and there is nothing to show';
  end if;
  select count(distinct well) into v_n2 from pd9_ledger;
  if v_n2 <> 6 or v_n2 <= v_n then
    raise exception 'PD9 go-live refused: wellCount is % against a population of %, and the headline count must be larger than either filtered one', v_n2, v_n;
  end if;

  -- ================= ASSOCIATE: ONE ROW ==================================
  select gor, oil, gas into v_x, v_o, v_g from pd9_pt
   where well = 'AKASO-4' and dt = date '2026-04-22';
  if abs(v_b1 - v_x) > 0.00085 then
    raise exception 'PD9 go-live refused: the graded low-day gas-oil ratio of % is not a thousand times that row''s gas over its oil, which gives %', v_b1, v_x;
  end if;
  if abs(v_b1 - (v_g * c_mscf) / v_o) > 1e-9 then
    raise exception 'PD9 go-live refused: the graded gas-oil ratio is not the closed form on the rebuilt row';
  end if;
  if v_b1 <= 2 * c_a4gf * c_mscf then
    raise exception 'PD9 go-live refused: the low-day gas-oil ratio of % is not more than twice the well''s constant 700 scf/stb baseline, so the row that kept its gas and lost its oil is no longer the row the tier is looking at', v_b1;
  end if;
  select oilpd, oil, hours into v_x, v_o, v_y from pd9_pt
   where well = 'AKASO-6' and dt = date '2026-04-19';
  if abs(v_b2 - v_x) > 0.00032 then
    raise exception 'PD9 go-live refused: the graded producing-day oil rate of % is not that row''s oil scaled to twenty-four hours, which gives %', v_b2, v_x;
  end if;
  if abs(v_b2 - (v_o * c_hday) / v_y) > 1e-9 then
    raise exception 'PD9 go-live refused: the graded producing-day rate is not the closed form on the rebuilt row';
  end if;
  -- AND IT IS A DIFFERENT QUANTITY FROM THE VOLUME BESIDE IT, which is the
  -- sentence the whole course rests on, asserted on the row where both exist.
  if abs(v_b2 - v_o) < 1 then
    raise exception 'PD9 go-live refused: the producing-day rate and the calendar volume on that row are % and %, which are too close for the tier to show that they are different quantities', v_b2, v_o;
  end if;
  if abs(v_b2 / v_o - c_hday / 11.4) > 1e-12 then
    raise exception 'PD9 go-live refused: the producing-day rate is not the volume times twenty-four over the eleven point four hours the row records';
  end if;

  -- ================= ASSOCIATE: ONE WINDOW ================================
  select avg(oil), avg(water), avg(gas) into v_o, v_w, v_g
    from pd9_field where i >= v_kpifrom;
  if abs(v_b3 - v_o) > 0.00082 then
    raise exception 'PD9 go-live refused: the graded field KPI oil of % is not the mean of the seven daily field oil totals, which gives %', v_b3, v_o;
  end if;
  if abs(v_b4 - v_w / (v_o + v_w)) > 0.00000015 then
    raise exception 'PD9 go-live refused: the graded field watercut of % is not the window mean water over the window mean liquid, which gives %', v_b4, v_w / (v_o + v_w);
  end if;
  if abs(v_b5 - (v_g * c_mscf) / v_o) > 0.00034 then
    raise exception 'PD9 go-live refused: the graded field gas-oil ratio of % is not a thousand times the window mean gas over the window mean oil, which gives %', v_b5, (v_g * c_mscf) / v_o;
  end if;
  -- the two identities that make a volumetric period ratio what it is
  if abs(v_b3 * v_b4 / (1 - v_b4) - v_w) > 1e-9 then
    raise exception 'PD9 go-live refused: the graded oil and watercut do not reproduce the window mean water, giving % against %', v_b3 * v_b4 / (1 - v_b4), v_w;
  end if;
  if abs(v_b5 * v_b3 / c_mscf - v_g) > 1e-9 then
    raise exception 'PD9 go-live refused: the graded gas-oil ratio and oil do not reproduce the window mean gas, giving % against %', v_b5 * v_b3 / c_mscf, v_g;
  end if;
  select min(oil), max(oil) into v_x, v_y from pd9_field where i >= v_kpifrom;
  if not (v_b3 > v_x and v_b3 < v_y) then
    raise exception 'PD9 go-live refused: the graded field oil of % does not sit strictly between the smallest and largest daily total, % and %', v_b3, v_x, v_y;
  end if;
  if not (v_b4 > 0 and v_b4 < 1) then
    raise exception 'PD9 go-live refused: the graded field watercut of % is not strictly between zero and one, so it is not a fraction', v_b4;
  end if;
  -- AND THE SEAM IS ALREADY VISIBLE AT FIELD LEVEL. The same window read as a
  -- mean of the daily ratios gives different numbers, which is why the tier
  -- above is a tier rather than a footnote.
  select avg(water / (oil + water)), avg(gas * c_mscf / oil) into v_x, v_y
    from pd9_field where i >= v_kpifrom;
  if abs(v_x - v_b4) < 0.001 or abs(v_y - v_b5) < 0.5 then
    raise exception 'PD9 go-live refused: the field ratios read as a mean of the daily ratios come out at % and %, too close to the graded volumetric % and % for the seam to be visible at all', v_x, v_y, v_b4, v_b5;
  end if;
  -- the uptime, its denominator, and what is in it
  select sum(hours), count(*) into v_x, v_slots from pd9_ledger
   where i >= v_kpifrom and wtype <> 'injector' and hours is not null;
  if abs(v_b6 - (v_x / (v_slots * c_hday)) * 100) > 0.000044 then
    raise exception 'PD9 go-live refused: the graded uptime of % is not the summed hours over twenty-four times the row count, which gives %', v_b6, (v_x / (v_slots * c_hday)) * 100;
  end if;
  if v_slots <> 28 then
    raise exception 'PD9 go-live refused: the uptime denominator counts % rows rather than 28, which is four wells over seven days', v_slots;
  end if;
  if v_b6 >= 100 then
    raise exception 'PD9 go-live refused: the graded uptime of % is not below a hundred per cent', v_b6;
  end if;
  select sum(hours) / (count(*) * c_hday) * 100 into v_uptimenoobs from pd9_ledger
   where i >= v_kpifrom and wtype = 'producer' and hours is not null;
  if v_b6 - v_uptimenoobs <= 4 then
    raise exception 'PD9 go-live refused: the observation well inflates the uptime by only % points, which is no longer the size that makes a well producing nothing and recording a perfect day worth naming', v_b6 - v_uptimenoobs;
  end if;
  if v_b6 <= v_uptimenoobs then
    raise exception 'PD9 go-live refused: the uptime with the observation well is not above the uptime without it, so the inflation runs the wrong way';
  end if;
  -- and the injector contributes nothing to it, by name rather than by value
  select count(*) into v_n from pd9_ledger
   where i >= v_kpifrom and wtype = 'injector' and hours is not null;
  if v_n <> c_recent then
    raise exception 'PD9 go-live refused: the injector files % rows carrying hours inside the window, and the point of the assertion is that they exist and are skipped', v_n;
  end if;
  -- the quiet well contributes nothing either, and for a different reason
  select count(*) into v_n from pd9_ledger where i >= v_kpifrom and well = 'AKASO-12';
  if v_n <> 0 then
    raise exception 'PD9 go-live refused: the quiet well files % rows inside the KPI window, so it is no longer absent from it', v_n;
  end if;

  -- ================= PROFESSIONAL: TWO WINDOWS ============================
  select avg(oil) into v_x from pd9_pt where well = 'AKASO-4' and i > v_recfrom and i <= v_recto;
  if abs(v_i1 - v_x) > 0.00027 then
    raise exception 'PD9 go-live refused: the graded recent oil mean of % is not the mean of that well''s oil column over the recent window, which gives %', v_i1, v_x;
  end if;
  select avg(oil) into v_y from pd9_pt where well = 'AKASO-4' and i > v_basefrom and i <= v_baseto;
  if abs(v_i2 - v_y) > 0.00059 then
    raise exception 'PD9 go-live refused: the graded baseline oil mean of % is not the mean of that well''s oil column over the baseline window, which gives %', v_i2, v_y;
  end if;
  -- and the baseline mean is the six cycle values over six, exactly
  if abs(v_i2 - (1184 + 1163 + 1201 + 1172 + 1195 + 1158)::double precision / 6) > 1e-12 then
    raise exception 'PD9 go-live refused: the graded baseline mean is not one sixth of the six stated cycle values, so the thirty day window is no longer five whole turns of the cycle';
  end if;
  if v_i1 >= v_i2 / 2 then
    raise exception 'PD9 go-live refused: the recent mean of % is not below half the baseline mean of %, so the drop no longer clears the doubling and the exception is not reported at the top of the ladder', v_i1, v_i2;
  end if;
  if ((v_i2 - v_i1) / v_i2) * 100 < c_ratedrop * 2 then
    raise exception 'PD9 go-live refused: the rate drop is % per cent, which does not reach the doubled trigger of 40', ((v_i2 - v_i1) / v_i2) * 100;
  end if;
  if v_i2 < c_minoil then
    raise exception 'PD9 go-live refused: the baseline mean of % is below minOilRate, so the rate check is gated out and there is no exception to grade', v_i2;
  end if;
  -- THE HOURS MEAN, AND THE GUARD THAT CANNOT REPORT THE WORST CASE
  select avg(hours) into v_x from pd9_ledger where well = 'AKASO-6' and i > v_recfrom and i <= v_recto;
  if abs(v_i3 - v_x) > 0.0000057 then
    raise exception 'PD9 go-live refused: the graded hours mean of % is not the mean of that well''s hours over the recent window, which gives %', v_i3, v_x;
  end if;
  if not (v_i3 > 0 and v_i3 < c_downhrs) then
    raise exception 'PD9 go-live refused: the graded hours mean of % is outside the range the downtime check reports, so no downtime exception exists to grade', v_i3;
  end if;
  -- THE SAME GUARD EVALUATED AT THE WORST UPTIME A WELL CAN HAVE. The branch is
  -- `hrs.count && hrs.mean < downtimeHours && hrs.mean > 0`, so a mean of a
  -- tenth of an hour is reported and a mean of exactly zero is not. Both arms
  -- are evaluated here on the same expression the graded mean goes through.
  v_z := 0.1;
  if not (v_z < c_downhrs and v_z > 0) then
    raise exception 'PD9 go-live refused: a mean of a tenth of an hour no longer satisfies the downtime guard, so the guard is not the one the finding is about';
  end if;
  v_z := 0;
  if (v_z < c_downhrs and v_z > 0) then
    raise exception 'PD9 go-live refused: a mean of exactly zero hours now satisfies the downtime guard, so the finding that the worst possible uptime is the one value the check refuses to report is no longer true';
  end if;
  if v_z >= v_i3 then
    raise exception 'PD9 go-live refused: the graded hours mean is not above the zero the guard refuses, so it is the unreportable value itself';
  end if;
  select count(*) into v_n from pd9_ledger
   where well = 'AKASO-6' and i > v_recfrom and i <= v_recto and abs(hours - v_i3) < 0.0000057;
  if v_n <> 0 then
    raise exception 'PD9 go-live refused: the graded hours mean coincides with one of the seven rows, so it can be transcribed rather than averaged';
  end if;

  -- THE HEADLINE PAIR. The CALENDAR column collapses past the doubling and the
  -- PRODUCING-DAY column, which the exception engine never reads, does not even
  -- clear the trigger, on the same well over the same two windows.
  select avg(oil) into v_calrec  from pd9_pt where well = 'AKASO-6' and i > v_recfrom and i <= v_recto;
  select avg(oil) into v_calbase from pd9_pt where well = 'AKASO-6' and i > v_basefrom and i <= v_baseto;
  select avg(oilpd) into v_pdrec  from pd9_pt where well = 'AKASO-6' and i > v_recfrom and i <= v_recto;
  select avg(oilpd) into v_pdbase from pd9_pt where well = 'AKASO-6' and i > v_basefrom and i <= v_baseto;
  if ((v_calbase - v_calrec) / v_calbase) * 100 < c_ratedrop * 2 then
    raise exception 'PD9 go-live refused: the calendar volume on the uptime well falls by only % per cent, which no longer reaches the doubled trigger, so the exception it raises is not the high one the finding needs', ((v_calbase - v_calrec) / v_calbase) * 100;
  end if;
  if abs((v_pdbase - v_pdrec) / v_pdbase) * 100 >= c_ratedrop then
    raise exception 'PD9 go-live refused: the producing-day rate on the same well moves by % per cent, which reaches the trigger, so reading the other column would also have raised an exception and the finding collapses', abs((v_pdbase - v_pdrec) / v_pdbase) * 100;
  end if;
  if v_pdrec <= v_calrec * 2 then
    raise exception 'PD9 go-live refused: the producing-day rate of % is not far above the calendar volume of % on the same window, so the two columns are no longer visibly different quantities', v_pdrec, v_calrec;
  end if;

  -- ================= PROFESSIONAL: THE METER =============================
  create temp table pd9_meter as
  select x.i, x.dt,
         c_bias * (x.o4 + x.o6 + (c_a8qi * exp(-c_a8di * x.i)) + (c_a12qi * exp(-c_a12di * x.i)))            as oil,
         c_bias * (x.w4 + x.w6 + c_a8wf * (c_a8qi * exp(-c_a8di * x.i)) + c_a12wf * (c_a12qi * exp(-c_a12di * x.i))) as water,
         c_bias * (x.g4 + x.g6 + c_a8gf * (c_a8qi * exp(-c_a8di * x.i)) + c_a12gf * (c_a12qi * exp(-c_a12di * x.i))) as gas
    from (
      select l.i, min(l.dt) as dt,
             max(case when l.well = 'AKASO-4' then l.oil end)   as o4,
             max(case when l.well = 'AKASO-4' then l.water end) as w4,
             max(case when l.well = 'AKASO-4' then l.gas end)   as g4,
             max(case when l.well = 'AKASO-6' then l.oil end)   as o6,
             max(case when l.well = 'AKASO-6' then l.water end) as w6,
             max(case when l.well = 'AKASO-6' then l.gas end)   as g6
        from pd9_ledger l
       where l.dt >= c_allocfrom
       group by l.i
    ) x;

  select count(*) into v_n from pd9_meter;
  if v_n <> 21 then
    raise exception 'PD9 go-live refused: the rebuilt meter covers % days rather than 21', v_n;
  end if;

  create temp table pd9_test (
    id text, well text, tdate date,
    orate double precision, wrate double precision, grate double precision,
    dur double precision, thp double precision, valid boolean);
  insert into pd9_test values
    ('t-a4-1',  'AKASO-4',  date '2025-11-20', 1210, 328, 848, 24,  340, true),
    ('t-a4-2',  'AKASO-4',  date '2026-04-02', 1165, 316, 816, 12,  335, true),
    ('t-a6-1',  'AKASO-6',  date '2026-03-11',  651, 117, 358, 18,  295, true),
    ('t-a8-1',  'AKASO-8',  date '2026-02-18',  905, 620, 552, 24,  310, true),
    ('t-a12-1', 'AKASO-12', date '2025-09-14',  455, 195, 241, 20,  260, true),
    ('t-a12-2', 'AKASO-12', date '2026-03-30',  402, 172, 213, 3.0, 248, false);

  -- the entries, for BOTH runs: the latest test on or before the day is chosen
  -- FIRST and the age limit is applied to that choice, with no fallback to an
  -- older test, which is what the engine does.
  create temp table pd9_ent as
  select r.runid, m.i, m.dt, w.well, ch.id as test_id, ch.tdate, up.uptime,
         ch.orate * up.uptime as th_oil,
         ch.wrate * up.uptime as th_water,
         ch.grate * up.uptime as th_gas
    from pd9_meter m
    cross join (values ('valid'), ('withinvalid')) as r(runid)
    cross join (values ('AKASO-4'), ('AKASO-6'), ('AKASO-8'), ('AKASO-12')) as w(well)
    cross join lateral (
      select least(c_hday, greatest(0::double precision,
               coalesce((select l.hours from pd9_ledger l where l.well = w.well and l.i = m.i),
                        c_defhours))) / c_hday as uptime) up
    left join lateral (
      select t.* from pd9_test t
       where t.well = w.well and (r.runid = 'withinvalid' or t.valid) and t.tdate <= m.dt
       order by t.tdate desc limit 1) ch on true
   where ch.id is not null and (m.dt - ch.tdate) <= c_maxage;

  create temp table pd9_day as
  select e.runid, e.i, e.dt, m.oil as m_oil, m.water as m_water, m.gas as m_gas,
         sum(e.th_oil) as th_oil, sum(e.th_water) as th_water, sum(e.th_gas) as th_gas
    from pd9_ent e join pd9_meter m on m.i = e.i
   group by e.runid, e.i, e.dt, m.oil, m.water, m.gas;

  -- the last day's theoretical, written out of the three test rates and the
  -- three uptimes rather than as a number
  select th_oil, m_oil into v_th, v_meter from pd9_day where runid = 'valid' and i = c_days - 1;
  if abs(v_th - (1165 * (c_hday / c_hday) + 651 * (14.2 / c_hday) + 905 * (c_hday / c_hday))) > 1e-9 then
    raise exception 'PD9 go-live refused: the last day''s theoretical oil of % is not the three tests in force times their own uptimes', v_th;
  end if;
  if abs(v_i4 - v_meter / v_th) > 0.00000029 then
    raise exception 'PD9 go-live refused: the graded oil factor of % is not the metered oil over the summed theoretical, which gives %', v_i4, v_meter / v_th;
  end if;
  select count(*) into v_n from pd9_ent where runid = 'valid' and i = c_days - 1;
  if v_n <> 3 then
    raise exception 'PD9 go-live refused: % wells take a share on the last day rather than 3', v_n;
  end if;
  select count(*) into v_n from pd9_ent where runid = 'valid' and i = c_days - 1 and well = 'AKASO-12';
  if v_n <> 0 then
    raise exception 'PD9 go-live refused: the quiet well takes a share on the last day under the valid-tests-only run, so its old test has not aged out';
  end if;
  -- and the reason is the age, stated as arithmetic on the dates
  if (c_dn - date '2025-09-14') <= c_maxage then
    raise exception 'PD9 go-live refused: the quiet well''s valid test is % days old on the last day, which is inside the 180 day limit, so it would carry the well after all', c_dn - date '2025-09-14';
  end if;
  if v_i4 >= c_warnlo then
    raise exception 'PD9 go-live refused: the graded oil factor of % is inside the warning band, so that day raises no factor diagnostic and the tier has nothing to read', v_i4;
  end if;
  if v_i4 <= 0.5 or v_i4 >= 1 then
    raise exception 'PD9 go-live refused: the graded oil factor of % is outside the band that makes it a plausible allocation rather than a broken one', v_i4;
  end if;

  -- the allocated volume for the clean well over the whole window
  select sum(e.th_oil * (d.m_oil / d.th_oil)) into v_x
    from pd9_ent e join pd9_day d on d.runid = e.runid and d.i = e.i
   where e.runid = 'valid' and e.well = 'AKASO-8';
  if abs(v_i5 - v_x) > 0.0092 then
    raise exception 'PD9 go-live refused: the graded allocated oil of % is not that well''s theoretical times each day''s own factor summed over the window, which gives %', v_i5, v_x;
  end if;
  select sum(d.m_oil / d.th_oil) into v_factorsum from pd9_day d where d.runid = 'valid';
  if abs(v_i5 / 905 - v_factorsum) > 1e-9 then
    raise exception 'PD9 go-live refused: the graded allocated oil over the well''s own 905 stb/d test rate is % rather than the sum of the twenty-one daily oil factors, %, so the identity the free check names does not hold', v_i5 / 905, v_factorsum;
  end if;
  if v_i5 >= 905 * 21 then
    raise exception 'PD9 go-live refused: the well is allocated % stb against a theoretical of 19005, so the daily factors no longer average below one and the meter is no longer seeing less than the tests promise', v_i5;
  end if;
  select count(*) into v_n from pd9_ent where runid = 'valid' and well = 'AKASO-8';
  if v_n <> 21 then
    raise exception 'PD9 go-live refused: the clean well takes a share on % of the twenty-one days', v_n;
  end if;
  select count(*) into v_n from pd9_ent where runid = 'valid' and well = 'AKASO-8' and uptime <> 1;
  if v_n <> 0 then
    raise exception 'PD9 go-live refused: the clean well''s uptime is not a full day on every allocated date, so its theoretical is not one number and the free check identity breaks';
  end if;

  -- CLOSURE, which holds per day and has no figure in the return
  select sum(m_oil), sum(th_oil * (m_oil / th_oil)) into v_grandm, v_granda
    from pd9_day where runid = 'valid';
  if abs(v_granda - v_grandm) > 0.000001 then
    raise exception 'PD9 go-live refused: the allocation does not close, allocating % against a metered %', v_granda, v_grandm;
  end if;
  select count(*) into v_n from pd9_day where runid = 'valid' and th_oil <= 0;
  if v_n <> 0 then
    raise exception 'PD9 go-live refused: % allocated days have no theoretical basis, so their metered volume leaves the allocation silently and the closure assertion above is measuring the wrong thing', v_n;
  end if;

  -- THE IMBALANCE, WHICH IS A THIRD NUMBER
  select sum(oil) into v_booked from pd9_ledger where i = c_days - 1;
  if abs(v_i6 - ((v_meter - v_booked) / v_booked) * 100) > 0.0000076 then
    raise exception 'PD9 go-live refused: the graded imbalance of % is not the metered oil less the booked oil over the booked oil, which gives %', v_i6, ((v_meter - v_booked) / v_booked) * 100;
  end if;
  if v_i6 <= 0 then
    raise exception 'PD9 go-live refused: the graded imbalance of % is not positive, so the meter no longer sees more than the wells book', v_i6;
  end if;
  if v_i6 <= 10 * (c_bias - 1) * 100 then
    raise exception 'PD9 go-live refused: the imbalance of % per cent is not far above the % per cent the meter bias alone explains, so the well that went quiet is no longer visible in it', v_i6, (c_bias - 1) * 100;
  end if;
  -- the ledger-basis identity, which ties the imbalance to a setting rather
  -- than to a number
  select sum(oil) into v_ledgerfactor from pd9_ledger
   where i = c_days - 1 and wtype = 'producer';
  v_ledgerfactor := v_meter / v_ledgerfactor;
  if abs(v_ledgerfactor - (1 + v_i6 / 100)) > 1e-12 then
    raise exception 'PD9 go-live refused: the ledger-basis oil factor of % is not one plus the graded imbalance over a hundred, %', v_ledgerfactor, 1 + v_i6 / 100;
  end if;
  -- and the pair that says the jump is the well and not the instrument
  select avg(((m.oil - b.booked) / b.booked) * 100) into v_meanpre
    from pd9_meter m join (select i, sum(oil) as booked from pd9_ledger group by i) b on b.i = m.i
   where m.dt <= c_a12last;
  select avg(((m.oil - b.booked) / b.booked) * 100) into v_meanpost
    from pd9_meter m join (select i, sum(oil) as booked from pd9_ledger group by i) b on b.i = m.i
   where m.dt > c_a12last;
  if abs(v_meanpre - (c_bias - 1) * 100) > 0.000001 then
    raise exception 'PD9 go-live refused: while the quiet well was still filing, the mean imbalance is % per cent rather than the meter bias of % per cent, so the field no longer reconciles cleanly before the well goes quiet', v_meanpre, (c_bias - 1) * 100;
  end if;
  if v_meanpost <= v_meanpre * 5 then
    raise exception 'PD9 go-live refused: the mean imbalance after the well goes quiet is % per cent against % before, which is not the jump the finding needs', v_meanpost, v_meanpre;
  end if;

  -- ================= EXPERT: ONE RATIO, TWO READINGS ======================
  select avg(gor), avg(watercut) into v_x, v_y from pd9_pt
   where well = 'AKASO-4' and i > v_recfrom and i <= v_recto;
  if abs(v_a1 - v_x) > 0.00065 then
    raise exception 'PD9 go-live refused: the graded mean-of-ratios gas-oil ratio of % is not the average of the seven daily ratios, which gives %', v_a1, v_x;
  end if;
  if abs(v_a3 - v_y) > 0.00000028 then
    raise exception 'PD9 go-live refused: the graded mean-of-ratios watercut of % is not the average of the seven daily watercuts, which gives %', v_a3, v_y;
  end if;
  select sum(gas) * c_mscf / sum(oil),
         sum(water) / (sum(oil) + sum(water)) into v_volgor, v_volwc
    from pd9_pt where well = 'AKASO-4' and i > v_recfrom and i <= v_recto;
  if abs(v_a2 - v_volgor) > 0.00041 then
    raise exception 'PD9 go-live refused: the graded volumetric gas-oil ratio of % is not a thousand times the summed gas over the summed oil, which gives %', v_a2, v_volgor;
  end if;
  if v_a1 <= v_a2 then
    raise exception 'PD9 go-live refused: the mean-of-ratios reading of % is not above the volumetric reading of %, so the seam has changed sign and the tier''s headline is wrong', v_a1, v_a2;
  end if;
  if v_a1 / v_a2 <= 1.5 then
    raise exception 'PD9 go-live refused: the two readings differ by a factor of only %, which is no longer more than half again and is smaller than the seam the golden publishes on its own well', v_a1 / v_a2;
  end if;
  -- THE PAIR THAT DECIDES A PRINTED SEVERITY. The mean of ratios clears the
  -- doubling and the volumetric does not clear even the trigger.
  if ((v_a1 - c_a4gf * c_mscf) / (c_a4gf * c_mscf)) * 100 < c_gorrise * 2 then
    raise exception 'PD9 go-live refused: the mean-of-ratios gas-oil ratio rise is % per cent, which does not reach the doubled trigger of 60, so this reading no longer reports high', ((v_a1 - c_a4gf * c_mscf) / (c_a4gf * c_mscf)) * 100;
  end if;
  if ((v_a2 - c_a4gf * c_mscf) / (c_a4gf * c_mscf)) * 100 >= c_gorrise then
    raise exception 'PD9 go-live refused: the volumetric gas-oil ratio rise is % per cent, which reaches the trigger of 30, so both readings now fire and the pair is not a pair', ((v_a2 - c_a4gf * c_mscf) / (c_a4gf * c_mscf)) * 100;
  end if;
  -- the watercut carries the same pair one notch down the ladder
  if (v_a3 - c_a4wf / (1 + c_a4wf)) * 100 < c_wcrise * 2 then
    raise exception 'PD9 go-live refused: the mean-of-ratios watercut rise is % points, which does not reach the doubled trigger of 20, so this reading no longer reports high', (v_a3 - c_a4wf / (1 + c_a4wf)) * 100;
  end if;
  if (v_volwc - c_a4wf / (1 + c_a4wf)) * 100 < c_wcrise
     or (v_volwc - c_a4wf / (1 + c_a4wf)) * 100 >= c_wcrise * 2 then
    raise exception 'PD9 go-live refused: the volumetric watercut rise is % points, which is not between the trigger and its doubling, so the two readings no longer give a high and a medium on the same rows', (v_volwc - c_a4wf / (1 + c_a4wf)) * 100;
  end if;
  if v_a3 <= v_volwc then
    raise exception 'PD9 go-live refused: the mean-of-ratios watercut of % is not above the volumetric %, so the bias towards low-rate days has changed sign', v_a3, v_volwc;
  end if;
  if not (v_a3 > 0 and v_a3 < 1) then
    raise exception 'PD9 go-live refused: the graded watercut of % is not strictly between zero and one', v_a3;
  end if;
  -- AND THE SEAM VANISHES ON A UNIFORM WINDOW, WHICH IS WHY NOBODY CAUGHT IT.
  -- Over the thirty baseline days, where every row carries the same two ratios,
  -- the two readings must agree.
  select avg(gor), sum(gas) * c_mscf / sum(oil),
         avg(watercut), sum(water) / (sum(oil) + sum(water))
    into v_basegor_mor, v_basegor_vol, v_basewc_mor, v_basewc_vol
    from pd9_pt where well = 'AKASO-4' and i > v_basefrom and i <= v_baseto;
  if abs(v_basegor_mor - v_basegor_vol) > 1e-12 then
    raise exception 'PD9 go-live refused: over the uniform baseline window the two gas-oil ratio readings give % and %, so the seam is not a property of the window mix after all', v_basegor_mor, v_basegor_vol;
  end if;
  if abs(v_basewc_mor - v_basewc_vol) > 1e-12 then
    raise exception 'PD9 go-live refused: over the uniform baseline window the two watercut readings give % and %, so the seam is not a property of the window mix after all', v_basewc_mor, v_basewc_vol;
  end if;
  -- and the window that DOES disagree mixes rates, which is the mechanism
  select count(distinct round(gor::numeric, 6)) into v_n from pd9_pt
   where well = 'AKASO-4' and i > v_recfrom and i <= v_recto;
  if v_n < 2 then
    raise exception 'PD9 go-live refused: the recent window carries one gas-oil ratio, so it is uniform and the two readings would agree';
  end if;
  select count(*) into v_n from pd9_pt
   where well = 'AKASO-4' and i > v_recfrom and i <= v_recto and oil < 100;
  if v_n <> 4 then
    raise exception 'PD9 go-live refused: the recent window holds % collapsed days rather than 4, so the mix that creates the seam has changed', v_n;
  end if;

  -- ================= EXPERT: THE WELL THAT FILED NOTHING ==================
  select th_oil into v_thi from pd9_day where runid = 'withinvalid' and i = c_days - 1;
  if abs(v_a4 - v_meter / v_thi) > 0.00000025 then
    raise exception 'PD9 go-live refused: the graded with-invalid oil factor of % is not the metered oil over the larger theoretical, which gives %', v_a4, v_meter / v_thi;
  end if;
  if abs(v_thi - (v_th + 402)) > 1e-9 then
    raise exception 'PD9 go-live refused: including the invalid test raises the theoretical by % rather than by the 402 stb/d that test recorded', v_thi - v_th;
  end if;
  if v_a4 >= v_i4 then
    raise exception 'PD9 go-live refused: the with-invalid factor of % is not below the valid-only factor of %, so letting a failed test back in no longer moves the split', v_a4, v_i4;
  end if;
  -- THE IDENTITY, which is why neither prompt had to state the other's value
  if abs(v_a4 / v_i4 - v_th / v_thi) > 1e-12 then
    raise exception 'PD9 go-live refused: the ratio of the two factors is % and the ratio of the two theoreticals is %, so the two tiers are no longer tied by the identity that let both be graded without either prompt disclosing the other', v_a4 / v_i4, v_th / v_thi;
  end if;
  -- and the well that enters filed NO row on that date and took a full day
  select count(*) into v_n from pd9_ledger where well = 'AKASO-12' and i = c_days - 1;
  if v_n <> 0 then
    raise exception 'PD9 go-live refused: the well that enters the with-invalid sum filed a ledger row on the last day after all, so the full-share-on-no-row finding has nothing to stand on';
  end if;
  select uptime into v_x from pd9_ent
   where runid = 'withinvalid' and i = c_days - 1 and well = 'AKASO-12';
  if abs(v_x - 1) > 1e-15 then
    raise exception 'PD9 go-live refused: the well that filed no row is credited with an uptime of % rather than a full day, so the default no longer fires', v_x;
  end if;
  -- the test that carries it is the one the QC would fail on duration
  select dur into v_x from pd9_test where id = 't-a12-2';
  if v_x >= c_mindur then
    raise exception 'PD9 go-live refused: the invalid test ran % hours, which clears the four hour QC minimum, so it is no longer the test the finding is about', v_x;
  end if;
  if exists (select 1 from pd9_test where id = 't-a12-2' and valid) then
    raise exception 'PD9 go-live refused: the test the with-invalid run lets back in is not flagged invalid';
  end if;

  -- ================= EXPERT: THE DECLINE ==================================
  -- Asserted as the CLOSED FORM out of the stated nominal decline, because it
  -- is one, and because the fit on this well recovers its own construction.
  if abs(v_a5 - (1 - exp(-c_a8di * c_year)) * 100) > 0.000027 then
    raise exception 'PD9 go-live refused: the graded effective decline of % is not one less e to the minus Di times 365, which gives %', v_a5, (1 - exp(-c_a8di * c_year)) * 100;
  end if;
  if abs(v_a5 - (1 - exp(-c_a8di * c_year)) * 100) > 1e-9 then
    raise exception 'PD9 go-live refused: the graded effective decline is not the closed form to nine decimals, so the fit did not recover the well''s own construction';
  end if;
  if not (v_a5 > 50 and v_a5 < 60) then
    raise exception 'PD9 go-live refused: the graded effective decline of % is outside the band the capstone says it lands in', v_a5;
  end if;
  -- and it is NOT what the other two Arps forms give at the same nominal
  -- decline, which is what a learner who used the wrong form would produce
  if abs(v_a5 - (1 - 1 / (1 + c_a8di * c_year)) * 100) <= 1 then
    raise exception 'PD9 go-live refused: the exponential and harmonic forms agree to within a point at this nominal decline, so choosing the wrong one costs nothing and the field grades nothing';
  end if;
  if abs(v_a5 - (1 - power(1 + 0.5 * c_a8di * c_year, -2)) * 100) <= 1 then
    raise exception 'PD9 go-live refused: the exponential and a hyperbolic form at b of one half agree to within a point at this nominal decline';
  end if;
  -- THE FALLS-OPEN, STATED AS ARITHMETIC. The branch fires when the model is
  -- exponential OR when the exponent is falsy, and a NaN is falsy, so a
  -- hyperbolic fit whose exponent failed to parse returns this same number and
  -- nothing in the return says so. It is asserted as an identity because there
  -- is nothing else to assert: the two paths are the same closed form.
  if abs((1 - exp(-c_a8di * c_year)) * 100 - v_a5) > 1e-9 then
    raise exception 'PD9 go-live refused: the graded decline is not the number a broken exponent would also return, so the falls-open the tier teaches is not on this well';
  end if;
  -- and it is not the published golden's own case 1, which is the number a
  -- broken exponent returns at the golden's nominal decline
  if abs(v_a5 - 42.160601062199) <= 1 then
    raise exception 'PD9 go-live refused: the graded decline of % sits within a point of the published golden case that a broken exponent reproduces, so the two would be confused', v_a5;
  end if;

  -- ================= EXPERT: THE HANDOFF ==================================
  select th_oil * (v_meter / v_th) into v_a4alloc from pd9_ent
   where runid = 'valid' and i = c_days - 1 and well = 'AKASO-4';
  if abs(v_a4alloc - 1165 * v_i4) > 1e-9 then
    raise exception 'PD9 go-live refused: the allocated oil for the seam well on the last day is % rather than its test rate times the graded factor, %', v_a4alloc, 1165 * v_i4;
  end if;
  if abs(v_a6 - v_a4alloc / (1 - v_b4)) > 0.00048 then
    raise exception 'PD9 go-live refused: the graded liquid rate of % is not the allocated oil over one less the field watercut, which gives %', v_a6, v_a4alloc / (1 - v_b4);
  end if;
  if v_a6 <= v_a4alloc then
    raise exception 'PD9 go-live refused: the liquid rate of % is not above the oil figure of % it was formed from', v_a6, v_a4alloc;
  end if;
  if v_a6 >= v_a4alloc * 1.5 then
    raise exception 'PD9 go-live refused: the liquid rate is % times the oil rate, which is outside the band the capstone says it lands in', v_a6 / v_a4alloc;
  end if;
  if not (v_a6 > 900 and v_a6 < 1000) then
    raise exception 'PD9 go-live refused: the graded liquid rate of % is outside the band the capstone states', v_a6;
  end if;
  -- the water cut crosses the door as a PER CENT and comes back as a fraction,
  -- and the silent clamp at 0.999 does not bind on this value
  if abs((v_b4 * 100) / 100 - v_b4) > 1e-15 then
    raise exception 'PD9 go-live refused: the water cut does not survive the round trip through a percentage, giving % against %', (v_b4 * 100) / 100, v_b4;
  end if;
  if v_b4 >= 0.999 then
    raise exception 'PD9 go-live refused: the field watercut of % reaches the helper''s silent clamp, so the liquid rate is formed from a number the caller never supplied', v_b4;
  end if;
  -- and the whole chain rests on three engine returns, which is asserted by
  -- rebuilding the target rate from the factor and the factor from the meter
  if abs(v_a6 * (1 - v_b4) * v_th - v_meter * 1165) > 0.000001 then
    raise exception 'PD9 go-live refused: the liquid rate, the field watercut, the theoretical and the metered oil do not close on each other, so the handoff is no longer three engine returns end to end';
  end if;

  -- ================= THE DIAL THAT MEANS THE OPPOSITE =====================
  -- `maxTestAgeDays` is guarded with Number.isFinite(x) && x > 0, so ZERO
  -- turns the age check OFF. On this field that makes zero days IDENTICAL to
  -- 365 days, while ONE day, the next setting up, allocates nothing at all.
  select sum(t.orate * (least(c_hday, greatest(0::double precision,
            coalesce((select l.hours from pd9_ledger l where l.well = t.well and l.i = c_days - 1), c_defhours))) / c_hday))
    into v_th0
    from pd9_test t
   where t.valid and t.tdate <= c_dn
     and t.tdate = (select max(t2.tdate) from pd9_test t2 where t2.well = t.well and t2.valid and t2.tdate <= c_dn);
  select sum(t.orate * (least(c_hday, greatest(0::double precision,
            coalesce((select l.hours from pd9_ledger l where l.well = t.well and l.i = c_days - 1), c_defhours))) / c_hday))
    into v_th365
    from pd9_test t
   where t.valid and t.tdate <= c_dn and (c_dn - t.tdate) <= 365
     and t.tdate = (select max(t2.tdate) from pd9_test t2 where t2.well = t.well and t2.valid and t2.tdate <= c_dn);
  select coalesce(sum(t.orate), 0) into v_x
    from pd9_test t
   where t.valid and t.tdate <= c_dn and (c_dn - t.tdate) <= 1
     and t.tdate = (select max(t2.tdate) from pd9_test t2 where t2.well = t.well and t2.valid and t2.tdate <= c_dn);
  if v_x <> 0 then
    raise exception 'PD9 go-live refused: a one day age limit still leaves % stb/d of test rate in force, so it is no longer the setting that refuses everything', v_x;
  end if;
  if abs(v_th0 - v_th365) > 1e-12 then
    raise exception 'PD9 go-live refused: a zero day age limit and a 365 day age limit no longer give the same theoretical, so the strictest-looking setting is no longer identical to the loosest';
  end if;
  if v_th0 <= v_th then
    raise exception 'PD9 go-live refused: turning the age check off gives a theoretical of % against the 180 day default''s %, and it must be LARGER for the dial to be reading the wrong way round', v_th0, v_th;
  end if;
  v_f0 := v_meter / v_th0;
  v_f1 := v_meter / v_th;
  if abs(v_f0 - 1) <= abs(v_f1 - 1) then
    raise exception 'PD9 go-live refused: the zero day factor of % is nearer one than the default''s %, which contradicts the recomputation this file records; if that has changed, the header note about the wave''s own claim has to change with it', v_f0, v_f1;
  end if;

  -- ================= THE WELL THAT RAISES NOTHING =========================
  -- "Nothing" is only interesting if every check really was evaluated, so all
  -- four are asserted rather than the absence of a row.
  select avg(oil) into v_x from pd9_pt where well = 'AKASO-8' and i > v_recfrom and i <= v_recto;
  select avg(oil) into v_y from pd9_pt where well = 'AKASO-8' and i > v_basefrom and i <= v_baseto;
  if v_y < c_minoil then
    raise exception 'PD9 go-live refused: the clean well''s baseline of % is below minOilRate, so its rate check is gated out and its silence proves nothing', v_y;
  end if;
  if ((v_y - v_x) / v_y) * 100 >= c_ratedrop then
    raise exception 'PD9 go-live refused: the clean well''s oil falls by % per cent, which reaches the trigger, so it is no longer the well that raises nothing', ((v_y - v_x) / v_y) * 100;
  end if;
  select avg(watercut) into v_x from pd9_pt where well = 'AKASO-8' and i > v_recfrom and i <= v_recto;
  select avg(watercut) into v_y from pd9_pt where well = 'AKASO-8' and i > v_basefrom and i <= v_baseto;
  if abs(v_x - v_y) * 100 >= c_wcrise then
    raise exception 'PD9 go-live refused: the clean well''s watercut moves by % points, so it raises an exception after all', abs(v_x - v_y) * 100;
  end if;
  select avg(gor) into v_x from pd9_pt where well = 'AKASO-8' and i > v_recfrom and i <= v_recto;
  select avg(gor) into v_y from pd9_pt where well = 'AKASO-8' and i > v_basefrom and i <= v_baseto;
  if abs((v_x - v_y) / v_y) * 100 >= c_gorrise then
    raise exception 'PD9 go-live refused: the clean well''s gas-oil ratio moves by % per cent, so it raises an exception after all', abs((v_x - v_y) / v_y) * 100;
  end if;
  select avg(hours) into v_x from pd9_ledger where well = 'AKASO-8' and i > v_recfrom and i <= v_recto;
  if v_x < c_downhrs then
    raise exception 'PD9 go-live refused: the clean well averages % hours, below the downtime threshold, so it raises a downtime exception', v_x;
  end if;

  -- ================= THE WELL THAT GOES QUIET =============================
  -- stale_data returns EARLY, so no other comparison on that well is made, and
  -- doubling takes it only from info to medium.
  select (c_days - 1) - max(i) into v_n from pd9_ledger where well = 'AKASO-12';
  if v_n <= c_staledays then
    raise exception 'PD9 go-live refused: the quiet well''s gap is % days, inside the seven day threshold, so no stale exception fires at all', v_n;
  end if;
  if v_n > c_staledays * 2 then
    raise exception 'PD9 go-live refused: the quiet well''s gap of % days is past the doubling, so it reports medium rather than the info the capstone is built on', v_n;
  end if;
  if v_n <> 11 then
    raise exception 'PD9 go-live refused: the quiet well''s gap is % days rather than 11', v_n;
  end if;
  -- and the meter is still seeing it, which is the whole point
  if (c_a12qi * exp(-c_a12di * (c_days - 1))) <= 0 then
    raise exception 'PD9 go-live refused: the quiet well is producing nothing on the last day, so its absence from the ledger costs the imbalance nothing';
  end if;

  -- ================= THE FIELDS DO NOT COLLIDE WITH EACH OTHER ===========
  -- Eighteen values graded at absolute tolerances, four of them fractions
  -- between zero and one and three of them gas-oil ratios in the hundreds. A
  -- grader that could not tell two of them apart would pass an answer written
  -- in the wrong row.
  select count(*) into v_graded
    from public.academy_capstones c1, lateral jsonb_array_elements(c1.fields) f1,
         public.academy_capstones c2, lateral jsonb_array_elements(c2.fields) f2
   where c1.app_slug = 'surveillance' and c2.app_slug = 'surveillance'
     and (f1->>'key') < (f2->>'key')
     and abs((f1->>'expected')::numeric - (f2->>'expected')::numeric)
         < 50 * ((f1->>'tol')::numeric + (f2->>'tol')::numeric);
  if v_graded <> 0 then
    raise exception 'PD9 go-live refused: % pair(s) of graded fields sit within fifty times their combined tolerance of each other, so a right answer in the wrong row would grade as correct', v_graded;
  end if;
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'surveillance'
     and ((f->>'tol')::numeric <= 0
       or (f->>'tol')::numeric > greatest(0.0000001, abs((f->>'expected')::numeric) * 0.000001));
  if v_graded <> 0 then
    raise exception 'PD9 go-live refused: % graded field(s) carry a tolerance that is not positive and tighter than one part in a million of their own magnitude', v_graded;
  end if;

  drop table pd9_ent;
  drop table pd9_day;
  drop table pd9_meter;
  drop table pd9_test;
  drop table pd9_field;
  drop table pd9_pt;
  drop table pd9_ledger;

  -- ------------------------------------------------------------ the flip --
  update public.academy_apps
     set status = 'available'
   where slug = 'surveillance' and status = 'coming_soon';

  if not exists (select 1 from public.academy_apps where slug = 'surveillance' and status = 'available') then
    raise exception 'PD9 go-live refused: surveillance did not reach status available';
  end if;

  raise notice 'PD9 go-live: surveillance is available, behind nodal, at path_order 38. The Production & Artificial Lift series is complete at nine courses.';
end $$;
