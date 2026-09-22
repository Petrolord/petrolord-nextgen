-- ============================================================================
-- B5 FOLLOW-ON W2 (publish inputs in prompts and lessons): wellcost.
--
-- Plan of record: docs/graded-field-audit/FOLLOW-ON-PROGRAMME.md section 1,
-- route (a), and the spec docs/graded-field-audit/w2/wellcost.json (the
-- inputs, where each came from, and the key each reproduces through the
-- vendored engines). Owner approved D1 to D7 as recommended, 2026-09-21.
--
-- BEGINNER
--   Prompt only, no field moves. The prompt said the MERLIN A-12 programme was
--   supplied with the capstone, but it existed only in
--   /root/dr-wip-wellcost/dr12_fields.mjs (B5 finding 1). The prompt now lists
--   the seventeen activities in order with their kinds and inputs, so every
--   field is the taught closed form of m03 to m05 worked in a spreadsheet. Keys,
--   expected values and tolerances are unchanged.
--   PROMPT was: The non-productive allowance is 28.5 percent.
--   PROMPT now: The non-productive allowance is 28.5 percent. THE PROGRAMME, in
--   order, each activity given as its label, then its kind and its inputs: (a)
--   Rig move and spud: flat, 31 h; (b) Drill 26in surface hole: drill from 0 to
--   640 m at 34.5 m/h; (c) Run and cement 20in casing: run to 640 m at 445 m/h
--   plus 13.5 h flat; (d) Drill 17-1/2in intermediate hole: drill from 640 to
--   2180 m at 9.4 m/h; (e) Stuck pipe, jarring and fishing: flat, 62 h; (f) Wait
--   on weather: flat, 18.5 h; (g) Round trip at 2180 m: round trip from 2180 m
--   at 620 m/h; (h) Run and cement 13-3/8in casing: run to 2180 m at 385 m/h
--   plus 26.5 h flat; (i) Remedial cement squeeze on the 13-3/8in shoe: flat, 27
--   h; (j) Drill 12-1/4in production hole: drill from 2180 to 3320 m at 7.4 m/h;
--   (k) Round trip at 3320 m: round trip from 3320 m at 620 m/h; (l) Run and
--   cement 9-5/8in casing: run to 3320 m at 268 m/h plus 31 h flat; (m) Drill
--   8-1/2in reservoir hole: drill from 3320 to 3945 m at 4.85 m/h; (n) Wireline
--   evaluation at TD: flat, 34.5 h; (o) Round trip at TD: round trip from 3945 m
--   at 620 m/h; (p) Run and cement 7in liner: run to 3945 m at 210 m/h plus 22.5
--   h flat; (q) Completion and handover: flat, 96 h.
--
-- INTERMEDIATE
--   Prompt only, no field moves. The line items, their rates, bases and
--   categories, and the cost per metre inputs existed only in the generator; the
--   prompt now lists the programme, the ten line items and the two sections, so
--   every field is the taught AFE and cost per metre arithmetic. Keys, expected
--   values and tolerances are unchanged.
--   PROMPT was: The line items, their rates, their bases and their categories
--   are supplied.
--   PROMPT now: The non-productive allowance is 28.5 percent. THE PROGRAMME, in
--   order, each activity given as its label, then its kind and its inputs: (a)
--   Rig move and spud: flat, 31 h; (b) Drill 26in surface hole: drill from 0 to
--   640 m at 34.5 m/h; (c) Run and cement 20in casing: run to 640 m at 445 m/h
--   plus 13.5 h flat; (d) Drill 17-1/2in intermediate hole: drill from 640 to
--   2180 m at 9.4 m/h; (e) Stuck pipe, jarring and fishing: flat, 62 h; (f) Wait
--   on weather: flat, 18.5 h; (g) Round trip at 2180 m: round trip from 2180 m
--   at 620 m/h; (h) Run and cement 13-3/8in casing: run to 2180 m at 385 m/h
--   plus 26.5 h flat; (i) Remedial cement squeeze on the 13-3/8in shoe: flat, 27
--   h; (j) Drill 12-1/4in production hole: drill from 2180 to 3320 m at 7.4 m/h;
--   (k) Round trip at 3320 m: round trip from 3320 m at 620 m/h; (l) Run and
--   cement 9-5/8in casing: run to 3320 m at 268 m/h plus 31 h flat; (m) Drill
--   8-1/2in reservoir hole: drill from 3320 to 3945 m at 4.85 m/h; (n) Wireline
--   evaluation at TD: flat, 34.5 h; (o) Round trip at TD: round trip from 3945 m
--   at 620 m/h; (p) Run and cement 7in liner: run to 3945 m at 210 m/h plus 22.5
--   h flat; (q) Completion and handover: flat, 96 h. THE LINE ITEMS, each given
--   as its label, then its category and its basis with its rate or value: Rig
--   dayrate: intangible, per day at 138500 USD a day; Integrated services
--   spread: intangible, per day at 74200 USD a day; Mud and consumables:
--   intangible, per metre at 218 USD a metre drilled; Bits and downhole tools:
--   intangible, per metre at 96.5 USD a metre drilled; Wellhead and tree:
--   tangible, a lump of 615000 USD; Fishing tools and services: intangible, a
--   lump of 158000 USD; Cementing services: intangible, a lump of 372000 USD;
--   Wireline and LWD evaluation: intangible, a lump of 265000 USD; Casing, liner
--   and accessories: tangible, a lump of 1145000 USD; Completion equipment:
--   tangible, a lump of 1380000 USD.
--   PROMPT was: The contingency is 23.5 percent.
--   PROMPT now: The contingency is 23.5 percent. THE COST PER METRE of a section
--   takes the bit cost plus the rig rate per hour times the sum of that
--   section's productive drilling hours, its connection hours and the productive
--   hours of its round trip, all over the section length, with the rig rate per
--   hour taken as the rig dayrate plus the integrated services spread, over 24.
--   The intermediate section is activity (d) with a bit cost of 74500 USD, 11.5
--   connection hours and the round trip (g); the reservoir section is activity
--   (m) with a bit cost of 236000 USD, 9.5 connection hours and the round trip
--   (o).
--
-- ADVANCED
--   Prompt only, no field moves. The programme, the line items with the activity
--   each lump is booked at, and the declared risk ranges existed only in the
--   generator; the prompt now publishes all three, so the curve fields are
--   spreadsheet work. The three risked fields also need the seeded run to be
--   readable at full precision in the Suite Well Cost and Time studio (W3,
--   Suite); until then they stay class display.
--   PROMPT was: Six values for MERLIN A-12.
--   PROMPT now: Six values for MERLIN A-12. The non-productive allowance is 28.5
--   percent. THE PROGRAMME, in order, each activity given as its label, then its
--   kind and its inputs: (a) Rig move and spud: flat, 31 h; (b) Drill 26in
--   surface hole: drill from 0 to 640 m at 34.5 m/h; (c) Run and cement 20in
--   casing: run to 640 m at 445 m/h plus 13.5 h flat; (d) Drill 17-1/2in
--   intermediate hole: drill from 640 to 2180 m at 9.4 m/h; (e) Stuck pipe,
--   jarring and fishing: flat, 62 h; (f) Wait on weather: flat, 18.5 h; (g)
--   Round trip at 2180 m: round trip from 2180 m at 620 m/h; (h) Run and cement
--   13-3/8in casing: run to 2180 m at 385 m/h plus 26.5 h flat; (i) Remedial
--   cement squeeze on the 13-3/8in shoe: flat, 27 h; (j) Drill 12-1/4in
--   production hole: drill from 2180 to 3320 m at 7.4 m/h; (k) Round trip at
--   3320 m: round trip from 3320 m at 620 m/h; (l) Run and cement 9-5/8in
--   casing: run to 3320 m at 268 m/h plus 31 h flat; (m) Drill 8-1/2in reservoir
--   hole: drill from 3320 to 3945 m at 4.85 m/h; (n) Wireline evaluation at TD:
--   flat, 34.5 h; (o) Round trip at TD: round trip from 3945 m at 620 m/h; (p)
--   Run and cement 7in liner: run to 3945 m at 210 m/h plus 22.5 h flat; (q)
--   Completion and handover: flat, 96 h. THE LINE ITEMS, each given as its
--   label, then its category and its basis with its rate or value: Rig dayrate:
--   intangible, per day at 138500 USD a day; Integrated services spread:
--   intangible, per day at 74200 USD a day; Mud and consumables: intangible, per
--   metre at 218 USD a metre drilled; Bits and downhole tools: intangible, per
--   metre at 96.5 USD a metre drilled; Wellhead and tree: tangible, a lump of
--   615000 USD booked at the end of activity (c); Fishing tools and services:
--   intangible, a lump of 158000 USD booked at the end of activity (e);
--   Cementing services: intangible, a lump of 372000 USD booked at the end of
--   activity (l); Wireline and LWD evaluation: intangible, a lump of 265000 USD
--   booked at the end of activity (n); Casing, liner and accessories: tangible,
--   a lump of 1145000 USD booked at the end of activity (p); Completion
--   equipment: tangible, a lump of 1380000 USD booked at the end of activity
--   (q). THE DECLARED RANGES, each triangular as minimum, most likely and
--   maximum, sampled in this order: the rate of penetration of activity (d), in
--   m/h: 6.4, 9.4, 15.5; the rate of penetration of activity (m), in m/h: 2.9,
--   4.85, 8.2; the duration of activity (e), in h: 24, 62, 240; the rate of the
--   Rig dayrate line, in USD a day: 121000, 138500, 187500; the value of the
--   Completion equipment line, in USD: 1050000, 1380000, 2150000. The risked run
--   prices the base with no contingency line, because the risk model takes the
--   place of the provision.
--   PROMPT was: with the declared ranges supplied:
--   PROMPT now: with the declared ranges stated above:
--
-- WHAT DOES NOT MOVE. `fields` (every key, label, unit, expected value and
-- tolerance), title, dataset, status and the row. The guard requires `fields`
-- to equal its live value exactly, before and after, so no answer grades
-- differently, nobody is re-scored and no attempts guard is needed.
--
-- GUARDS. Each row must hold EITHER its published prompt (by md5) with its
-- live fields (exact jsonb), as production holds it after W1 (it is
-- rewritten), OR its W2 prompt with the same fields (left alone). Anything
-- else raises and the whole file rolls back. A file that will write first
-- checks the W1 post-state and refuses without it. Generated by
-- docs/graded-field-audit/w2_capstones.py. SAFE TO RE-RUN: a second run
-- writes nothing.
-- ============================================================================

do $$
declare
  v_n        integer;
  v_count    integer;
  v_written  integer := 0;
  v_s0       text;
  v_s1       text;
  v_s2       text;
begin
  -- wellcost / beginner
  select count(*) into v_n from public.academy_capstones where app_slug = 'wellcost' and tier = 'beginner' and active;
  if v_n <> 1 then raise exception 'w2 wellcost refused: wellcost/beginner has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = '9b03497a3088e7fdbde2502b662b7982' and fields = '[{"key": "drill_reservoir_hr", "tol": 0.00005, "unit": "h", "label": "Reservoir drilling hours", "expected": 128.8659793814433}, {"key": "trip_td_hr", "tol": 0.000005, "unit": "h", "label": "Round trip to TD", "expected": 12.725806451612904}, {"key": "casing_liner_run_hr", "tol": 0.00002, "unit": "h", "label": "Liner running hours", "expected": 41.285714285714285}, {"key": "productive_hr", "tol": 0.0005, "unit": "h", "label": "Productive hours", "expected": 896.5426011394405}, {"key": "npt_hr", "tol": 0.0002, "unit": "h", "label": "Non-productive hours", "expected": 255.51464132474018}, {"key": "total_days", "tol": 0.00002, "unit": "d", "label": "Total days", "expected": 48.0023851026742}]'::jsonb then 'old'
              when md5(prompt) = '06b8325c2dc40e9e0fcdb5af1ad5b108' and fields = '[{"key": "drill_reservoir_hr", "tol": 0.00005, "unit": "h", "label": "Reservoir drilling hours", "expected": 128.8659793814433}, {"key": "trip_td_hr", "tol": 0.000005, "unit": "h", "label": "Round trip to TD", "expected": 12.725806451612904}, {"key": "casing_liner_run_hr", "tol": 0.00002, "unit": "h", "label": "Liner running hours", "expected": 41.285714285714285}, {"key": "productive_hr", "tol": 0.0005, "unit": "h", "label": "Productive hours", "expected": 896.5426011394405}, {"key": "npt_hr", "tol": 0.0002, "unit": "h", "label": "Non-productive hours", "expected": 255.51464132474018}, {"key": "total_days", "tol": 0.00002, "unit": "d", "label": "Total days", "expected": 48.0023851026742}]'::jsonb then 'new'
              else 'other' end
    into v_s0 from public.academy_capstones where app_slug = 'wellcost' and tier = 'beginner' and active;
  if v_s0 = 'other' then
    raise exception 'w2 wellcost refused: wellcost/beginner matches neither its published form (prompt md5 9b03497a3088e7fdbde2502b662b7982) nor its W2 form (prompt md5 06b8325c2dc40e9e0fcdb5af1ad5b108), with the fields this file was generated against';
  end if;

  -- wellcost / intermediate
  select count(*) into v_n from public.academy_capstones where app_slug = 'wellcost' and tier = 'intermediate' and active;
  if v_n <> 1 then raise exception 'w2 wellcost refused: wellcost/intermediate has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = '8e9415944b73268fc0c8af087775aafe' and fields = '[{"key": "tangible_usd", "tol": 2, "unit": "USD", "label": "Tangible subtotal", "expected": 3140000}, {"key": "intangible_usd", "tol": 6, "unit": "USD", "label": "Intangible subtotal", "expected": 12245809.811338801}, {"key": "contingency_usd", "tol": 2, "unit": "USD", "label": "Contingency", "expected": 3615665.305664618}, {"key": "total_usd", "tol": 10, "unit": "USD", "label": "Estimate total", "expected": 19001475.11700342}, {"key": "cpm_intermediate_usd_m", "tol": 0.0005, "unit": "USD/m", "label": "Intermediate cost/m", "expected": 1097.8465106873223}, {"key": "cpm_reservoir_usd_m", "tol": 0.002, "unit": "USD/m", "label": "Reservoir cost/m", "expected": 2520.081523112737}]'::jsonb then 'old'
              when md5(prompt) = 'f0c4488f554531241dfaa95a2aa68d59' and fields = '[{"key": "tangible_usd", "tol": 2, "unit": "USD", "label": "Tangible subtotal", "expected": 3140000}, {"key": "intangible_usd", "tol": 6, "unit": "USD", "label": "Intangible subtotal", "expected": 12245809.811338801}, {"key": "contingency_usd", "tol": 2, "unit": "USD", "label": "Contingency", "expected": 3615665.305664618}, {"key": "total_usd", "tol": 10, "unit": "USD", "label": "Estimate total", "expected": 19001475.11700342}, {"key": "cpm_intermediate_usd_m", "tol": 0.0005, "unit": "USD/m", "label": "Intermediate cost/m", "expected": 1097.8465106873223}, {"key": "cpm_reservoir_usd_m", "tol": 0.002, "unit": "USD/m", "label": "Reservoir cost/m", "expected": 2520.081523112737}]'::jsonb then 'new'
              else 'other' end
    into v_s1 from public.academy_capstones where app_slug = 'wellcost' and tier = 'intermediate' and active;
  if v_s1 = 'other' then
    raise exception 'w2 wellcost refused: wellcost/intermediate matches neither its published form (prompt md5 8e9415944b73268fc0c8af087775aafe) nor its W2 form (prompt md5 f0c4488f554531241dfaa95a2aa68d59), with the fields this file was generated against';
  end if;

  -- wellcost / advanced
  select count(*) into v_n from public.academy_capstones where app_slug = 'wellcost' and tier = 'advanced' and active;
  if v_n <> 1 then raise exception 'w2 wellcost refused: wellcost/advanced has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = 'b69a50af2b724b0e81f8aad16ea66197' and fields = '[{"key": "curve_at_int_casing_usd", "tol": 2, "unit": "USD", "label": "Curve at intermediate casing", "expected": 5421894.326682938}, {"key": "curve_at_evaluation_usd", "tol": 5, "unit": "USD", "label": "Curve at evaluation", "expected": 11152431.73458189}, {"key": "curve_final_usd", "tol": 8, "unit": "USD", "label": "Curve final point", "expected": 15385809.811338803}, {"key": "mc_cost_p10_usd", "tol": 8, "unit": "USD", "label": "Risked cost, P10", "expected": 15111064.647716}, {"key": "mc_cost_p90_usd", "tol": 10, "unit": "USD", "label": "Risked cost, P90", "expected": 17776363.724421192}, {"key": "mc_days_p50", "tol": 0.00003, "unit": "d", "label": "Risked days, P50", "expected": 49.37724886122158}]'::jsonb then 'old'
              when md5(prompt) = '2c88b8dd1220439373e143d1eefe33d2' and fields = '[{"key": "curve_at_int_casing_usd", "tol": 2, "unit": "USD", "label": "Curve at intermediate casing", "expected": 5421894.326682938}, {"key": "curve_at_evaluation_usd", "tol": 5, "unit": "USD", "label": "Curve at evaluation", "expected": 11152431.73458189}, {"key": "curve_final_usd", "tol": 8, "unit": "USD", "label": "Curve final point", "expected": 15385809.811338803}, {"key": "mc_cost_p10_usd", "tol": 8, "unit": "USD", "label": "Risked cost, P10", "expected": 15111064.647716}, {"key": "mc_cost_p90_usd", "tol": 10, "unit": "USD", "label": "Risked cost, P90", "expected": 17776363.724421192}, {"key": "mc_days_p50", "tol": 0.00003, "unit": "d", "label": "Risked days, P50", "expected": 49.37724886122158}]'::jsonb then 'new'
              else 'other' end
    into v_s2 from public.academy_capstones where app_slug = 'wellcost' and tier = 'advanced' and active;
  if v_s2 = 'other' then
    raise exception 'w2 wellcost refused: wellcost/advanced matches neither its published form (prompt md5 b69a50af2b724b0e81f8aad16ea66197) nor its W2 form (prompt md5 2c88b8dd1220439373e143d1eefe33d2), with the fields this file was generated against';
  end if;

  -- nothing to write: every row is already in its W2 form
  if v_s0 = 'new' and v_s1 = 'new' and v_s2 = 'new' then
    raise notice 'w2 wellcost: 0 of 3 row(s) written, all already applied';
    return;
  end if;

  -- W1 (20261024a/b) must be applied first: production holds it, and the W2
  -- apply script checks all 34 files; this reads two of its rows
  if exists (select 1 from public.academy_capstones where app_slug = 'integrity' and tier = 'beginner' and active and md5(prompt) <> '0e0ac66d6b97e9f7f66b5055e1fddf7d')
     or exists (select 1 from public.academy_capstones where app_slug = 'welldata' and tier = 'beginner' and active and md5(prompt) <> 'f362ed27e7d8766e7e51dcf1ca0e5e6e') then
    raise exception 'w2 wellcost refused: W1 (20261024*) is not applied on this database; apply it first (/root/w1-apply/apply.sh apply --prod)';
  end if;

  if v_s0 = 'old' then
    update public.academy_capstones
       set prompt = 'Six values from the MERLIN A-12 drilling programme supplied with this capstone. It is seventeen activities across four hole sections to 3,945 m, and it did not go well: a stuck pipe cost 62 hours of fishing, 18.5 hours went waiting on weather, and a shoe squeeze took 27 hours. The non-productive allowance is 28.5 percent. THE PROGRAMME, in order, each activity given as its label, then its kind and its inputs: (a) Rig move and spud: flat, 31 h; (b) Drill 26in surface hole: drill from 0 to 640 m at 34.5 m/h; (c) Run and cement 20in casing: run to 640 m at 445 m/h plus 13.5 h flat; (d) Drill 17-1/2in intermediate hole: drill from 640 to 2180 m at 9.4 m/h; (e) Stuck pipe, jarring and fishing: flat, 62 h; (f) Wait on weather: flat, 18.5 h; (g) Round trip at 2180 m: round trip from 2180 m at 620 m/h; (h) Run and cement 13-3/8in casing: run to 2180 m at 385 m/h plus 26.5 h flat; (i) Remedial cement squeeze on the 13-3/8in shoe: flat, 27 h; (j) Drill 12-1/4in production hole: drill from 2180 to 3320 m at 7.4 m/h; (k) Round trip at 3320 m: round trip from 3320 m at 620 m/h; (l) Run and cement 9-5/8in casing: run to 3320 m at 268 m/h plus 31 h flat; (m) Drill 8-1/2in reservoir hole: drill from 3320 to 3945 m at 4.85 m/h; (n) Wireline evaluation at TD: flat, 34.5 h; (o) Round trip at TD: round trip from 3945 m at 620 m/h; (p) Run and cement 7in liner: run to 3945 m at 210 m/h plus 22.5 h flat; (q) Completion and handover: flat, 96 h. Report: (1) the DRILLING hours for the RESERVOIR section; (2) the hours for the ROUND TRIP to total depth; (3) the hours to RUN the LINER; (4) the total PRODUCTIVE hours for the programme; (5) the total NON-PRODUCTIVE hours; and (6) the total DAYS. Traps. Fields 1 to 3 are three DIFFERENT closed forms and using one where another belongs is the commonest error on this tier: drilling is the interval over the rate, a round trip is TWICE the depth over the speed, and running casing is the depth over the speed PLUS a flat term that no running speed can remove. Field 5 is the allowance applied as a STRETCH on productive time, so it is 28.5 percent OF FIELD 4, and it is NOT 28.5 percent of the elapsed total. Reading the allowance as a share of elapsed time would overstate the schedule badly. Field 6 counts BOTH productive and non-productive hours, because the rig is paid for all of them. Free checks: field 5 divided by field 4 must come out at exactly the stated allowance; field 5 divided by the sum of fields 4 and 5 must come out SMALLER than the allowance, which is the whole point; and field 6 times 24 must equal fields 4 and 5 added together.'
     where app_slug = 'wellcost' and tier = 'beginner' and active and md5(prompt) = '9b03497a3088e7fdbde2502b662b7982';
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w2 wellcost refused: wellcost/beginner updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = '06b8325c2dc40e9e0fcdb5af1ad5b108' and fields = '[{"key": "drill_reservoir_hr", "tol": 0.00005, "unit": "h", "label": "Reservoir drilling hours", "expected": 128.8659793814433}, {"key": "trip_td_hr", "tol": 0.000005, "unit": "h", "label": "Round trip to TD", "expected": 12.725806451612904}, {"key": "casing_liner_run_hr", "tol": 0.00002, "unit": "h", "label": "Liner running hours", "expected": 41.285714285714285}, {"key": "productive_hr", "tol": 0.0005, "unit": "h", "label": "Productive hours", "expected": 896.5426011394405}, {"key": "npt_hr", "tol": 0.0002, "unit": "h", "label": "Non-productive hours", "expected": 255.51464132474018}, {"key": "total_days", "tol": 0.00002, "unit": "d", "label": "Total days", "expected": 48.0023851026742}]'::jsonb) from public.academy_capstones where app_slug = 'wellcost' and tier = 'beginner' and active) is not true then
    raise exception 'w2 wellcost refused: wellcost/beginner does not read back as its W2 form';
  end if;

  if v_s1 = 'old' then
    update public.academy_capstones
       set prompt = 'Six values for the MERLIN A-12 estimate, built on the days and metres from the Associate tier. The non-productive allowance is 28.5 percent. THE PROGRAMME, in order, each activity given as its label, then its kind and its inputs: (a) Rig move and spud: flat, 31 h; (b) Drill 26in surface hole: drill from 0 to 640 m at 34.5 m/h; (c) Run and cement 20in casing: run to 640 m at 445 m/h plus 13.5 h flat; (d) Drill 17-1/2in intermediate hole: drill from 640 to 2180 m at 9.4 m/h; (e) Stuck pipe, jarring and fishing: flat, 62 h; (f) Wait on weather: flat, 18.5 h; (g) Round trip at 2180 m: round trip from 2180 m at 620 m/h; (h) Run and cement 13-3/8in casing: run to 2180 m at 385 m/h plus 26.5 h flat; (i) Remedial cement squeeze on the 13-3/8in shoe: flat, 27 h; (j) Drill 12-1/4in production hole: drill from 2180 to 3320 m at 7.4 m/h; (k) Round trip at 3320 m: round trip from 3320 m at 620 m/h; (l) Run and cement 9-5/8in casing: run to 3320 m at 268 m/h plus 31 h flat; (m) Drill 8-1/2in reservoir hole: drill from 3320 to 3945 m at 4.85 m/h; (n) Wireline evaluation at TD: flat, 34.5 h; (o) Round trip at TD: round trip from 3945 m at 620 m/h; (p) Run and cement 7in liner: run to 3945 m at 210 m/h plus 22.5 h flat; (q) Completion and handover: flat, 96 h. THE LINE ITEMS, each given as its label, then its category and its basis with its rate or value: Rig dayrate: intangible, per day at 138500 USD a day; Integrated services spread: intangible, per day at 74200 USD a day; Mud and consumables: intangible, per metre at 218 USD a metre drilled; Bits and downhole tools: intangible, per metre at 96.5 USD a metre drilled; Wellhead and tree: tangible, a lump of 615000 USD; Fishing tools and services: intangible, a lump of 158000 USD; Cementing services: intangible, a lump of 372000 USD; Wireline and LWD evaluation: intangible, a lump of 265000 USD; Casing, liner and accessories: tangible, a lump of 1145000 USD; Completion equipment: tangible, a lump of 1380000 USD. The contingency is 23.5 percent. THE COST PER METRE of a section takes the bit cost plus the rig rate per hour times the sum of that section''s productive drilling hours, its connection hours and the productive hours of its round trip, all over the section length, with the rig rate per hour taken as the rig dayrate plus the integrated services spread, over 24. The intermediate section is activity (d) with a bit cost of 74500 USD, 11.5 connection hours and the round trip (g); the reservoir section is activity (m) with a bit cost of 236000 USD, 9.5 connection hours and the round trip (o). Report: (1) the TANGIBLE subtotal in dollars; (2) the INTANGIBLE subtotal; (3) the CONTINGENCY amount; (4) the estimate TOTAL; (5) the cost per metre for the INTERMEDIATE section; and (6) the cost per metre for the RESERVOIR section. Traps. Every line carries a BASIS and a CATEGORY and they are independent questions: the basis says how it bills, per day or per metre or as a lump, and the category says whether it is tangible or intangible. Getting the basis right and the category wrong moves fields 1 and 2 without touching field 4, so the total will look correct while the split is wrong. Field 3 is a percentage of the BASE and not of the total, and the base is fields 1 and 2 added together. Fields 5 and 6 must each be computed from the hours of the section they belong to, taken from the schedule the Associate tier evaluated, and NEVER lifted from a worked example elsewhere. Free checks: fields 1 and 2 must sum to the base; field 4 less that base must equal field 3 exactly; field 3 divided by the base must equal the stated 23.5 percent; and field 5 must come out SMALLER than field 6 even though the intermediate section is the larger cheque, which is the inversion this tier exists to teach.'
     where app_slug = 'wellcost' and tier = 'intermediate' and active and md5(prompt) = '8e9415944b73268fc0c8af087775aafe';
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w2 wellcost refused: wellcost/intermediate updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = 'f0c4488f554531241dfaa95a2aa68d59' and fields = '[{"key": "tangible_usd", "tol": 2, "unit": "USD", "label": "Tangible subtotal", "expected": 3140000}, {"key": "intangible_usd", "tol": 6, "unit": "USD", "label": "Intangible subtotal", "expected": 12245809.811338801}, {"key": "contingency_usd", "tol": 2, "unit": "USD", "label": "Contingency", "expected": 3615665.305664618}, {"key": "total_usd", "tol": 10, "unit": "USD", "label": "Estimate total", "expected": 19001475.11700342}, {"key": "cpm_intermediate_usd_m", "tol": 0.0005, "unit": "USD/m", "label": "Intermediate cost/m", "expected": 1097.8465106873223}, {"key": "cpm_reservoir_usd_m", "tol": 0.002, "unit": "USD/m", "label": "Reservoir cost/m", "expected": 2520.081523112737}]'::jsonb) from public.academy_capstones where app_slug = 'wellcost' and tier = 'intermediate' and active) is not true then
    raise exception 'w2 wellcost refused: wellcost/intermediate does not read back as its W2 form';
  end if;

  if v_s2 = 'old' then
    update public.academy_capstones
       set prompt = 'Six values for MERLIN A-12. The non-productive allowance is 28.5 percent. THE PROGRAMME, in order, each activity given as its label, then its kind and its inputs: (a) Rig move and spud: flat, 31 h; (b) Drill 26in surface hole: drill from 0 to 640 m at 34.5 m/h; (c) Run and cement 20in casing: run to 640 m at 445 m/h plus 13.5 h flat; (d) Drill 17-1/2in intermediate hole: drill from 640 to 2180 m at 9.4 m/h; (e) Stuck pipe, jarring and fishing: flat, 62 h; (f) Wait on weather: flat, 18.5 h; (g) Round trip at 2180 m: round trip from 2180 m at 620 m/h; (h) Run and cement 13-3/8in casing: run to 2180 m at 385 m/h plus 26.5 h flat; (i) Remedial cement squeeze on the 13-3/8in shoe: flat, 27 h; (j) Drill 12-1/4in production hole: drill from 2180 to 3320 m at 7.4 m/h; (k) Round trip at 3320 m: round trip from 3320 m at 620 m/h; (l) Run and cement 9-5/8in casing: run to 3320 m at 268 m/h plus 31 h flat; (m) Drill 8-1/2in reservoir hole: drill from 3320 to 3945 m at 4.85 m/h; (n) Wireline evaluation at TD: flat, 34.5 h; (o) Round trip at TD: round trip from 3945 m at 620 m/h; (p) Run and cement 7in liner: run to 3945 m at 210 m/h plus 22.5 h flat; (q) Completion and handover: flat, 96 h. THE LINE ITEMS, each given as its label, then its category and its basis with its rate or value: Rig dayrate: intangible, per day at 138500 USD a day; Integrated services spread: intangible, per day at 74200 USD a day; Mud and consumables: intangible, per metre at 218 USD a metre drilled; Bits and downhole tools: intangible, per metre at 96.5 USD a metre drilled; Wellhead and tree: tangible, a lump of 615000 USD booked at the end of activity (c); Fishing tools and services: intangible, a lump of 158000 USD booked at the end of activity (e); Cementing services: intangible, a lump of 372000 USD booked at the end of activity (l); Wireline and LWD evaluation: intangible, a lump of 265000 USD booked at the end of activity (n); Casing, liner and accessories: tangible, a lump of 1145000 USD booked at the end of activity (p); Completion equipment: tangible, a lump of 1380000 USD booked at the end of activity (q). THE DECLARED RANGES, each triangular as minimum, most likely and maximum, sampled in this order: the rate of penetration of activity (d), in m/h: 6.4, 9.4, 15.5; the rate of penetration of activity (m), in m/h: 2.9, 4.85, 8.2; the duration of activity (e), in h: 24, 62, 240; the rate of the Rig dayrate line, in USD a day: 121000, 138500, 187500; the value of the Completion equipment line, in USD: 1050000, 1380000, 2150000. The risked run prices the base with no contingency line, because the risk model takes the place of the provision. Report first from the COST-TIME CURVE: (1) the cumulative cost at the point the INTERMEDIATE CASING is set; (2) the cumulative cost at the point EVALUATION begins; and (3) the FINAL point of the curve. Then from a RISKED run of 20,000 iterations at seed 20260904, with the declared ranges stated above: (4) the P10 cost; (5) the P90 cost; and (6) the P50 total days. Traps. Field 3 is the curve''s endpoint and it lands on the estimate BASE, not the estimate TOTAL, because contingency is a provision for what has not happened and does not accrue as the well is drilled. The difference between them is exactly the contingency, so a learner who reports the total here is out by that whole amount. Fields 4 and 5 are labelled in the AFE convention, where P10 is the LOW cost and P90 the HIGH one. That is the OPPOSITE of the petroleum reserves convention the sampler itself returns, so read the field names and not the library. The run must use the stated seed, because a sampled number without a recorded seed is not a number anybody can check. Free checks: field 3 must equal the Professional tier''s tangible and intangible added together; fields 1 and 2 must both fall below field 3 and field 1 below field 2, since the curve only rises; field 4 must be below field 5; and field 3 must fall BETWEEN fields 4 and 5, low in that range, because a deterministic estimate built on most likely rates is not a most likely cost.'
     where app_slug = 'wellcost' and tier = 'advanced' and active and md5(prompt) = 'b69a50af2b724b0e81f8aad16ea66197';
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w2 wellcost refused: wellcost/advanced updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = '2c88b8dd1220439373e143d1eefe33d2' and fields = '[{"key": "curve_at_int_casing_usd", "tol": 2, "unit": "USD", "label": "Curve at intermediate casing", "expected": 5421894.326682938}, {"key": "curve_at_evaluation_usd", "tol": 5, "unit": "USD", "label": "Curve at evaluation", "expected": 11152431.73458189}, {"key": "curve_final_usd", "tol": 8, "unit": "USD", "label": "Curve final point", "expected": 15385809.811338803}, {"key": "mc_cost_p10_usd", "tol": 8, "unit": "USD", "label": "Risked cost, P10", "expected": 15111064.647716}, {"key": "mc_cost_p90_usd", "tol": 10, "unit": "USD", "label": "Risked cost, P90", "expected": 17776363.724421192}, {"key": "mc_days_p50", "tol": 0.00003, "unit": "d", "label": "Risked days, P50", "expected": 49.37724886122158}]'::jsonb) from public.academy_capstones where app_slug = 'wellcost' and tier = 'advanced' and active) is not true then
    raise exception 'w2 wellcost refused: wellcost/advanced does not read back as its W2 form';
  end if;

  raise notice 'w2 wellcost: % of 3 row(s) written, % already applied', v_written, 3 - v_written;
end $$;
