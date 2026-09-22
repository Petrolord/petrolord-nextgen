-- ============================================================================
-- B5 FOLLOW-ON W5B (leak re-case and strip): dca.
--
-- Plan of record: docs/graded-field-audit/FOLLOW-ON-PROGRAMME.md section 3
-- (D4 A and B, D5). Spec: docs/graded-field-audit/w5/dca.json. The new
-- keys come from docs/graded-field-audit/w5b/dca.fields.json,
-- written by the course's engine generator and re-checked in CI.
--
-- BEGINNER: pick A (re-case)
--   The walkthrough printed all six answers and the fit explorer opened on
--   Ekene-1 primary at 10 stb/d. Re-cased on custom fit windows, an 8 stb/d
--   limit and new wells, pools, b and triangle inputs, which the learner sets.
--   The Di, qi and R2 tolerances tighten to 2e-6, 0.05 and 0.001 on these new
--   fields (the tiles print 7, 4 and 6 decimals), because at 2e-5 a Di band
--   covers most harmonic Di values the course prints.
--   qi_bpd (120, tol 0.5)
--       -> qi_bpd 'Fitted initial rate qi at the window start' stb/d, expected 68.68131868131867, tol 0.05
--   di_per_day (0.0012, tol 0.00002)
--       -> di_per_day 'Fitted nominal decline Di at the window start' 1/d, expected 0.00103021978021978, tol 2e-06
--   eur_10_stb (91666.6666666667, tol 500)
--       -> eur_limit_stb 'EUR at the 8 stb/d limit' stb, expected 143335.71296891742, tol 500.0
--   t_limit_days (2070.75554149, tol 10)
--       -> t_limit_days 'Time to the 8 stb/d limit' days, expected 7362.666666666667, tol 10.0
--   np_flood_stb (73157.9366256283, tol 400)
--       -> np_to_date_stb 'Cumulative from the window start to 2022-10-01' stb, expected 29840.327683366406, tol 400.0
--   eff_decline_pct (35.4674217142705, tol 0.1)
--       -> eff_decline_pct 'Tangent effective annual decline' %/yr, expected 31.34184156157903, tol 0.1
--   DATASET was: ekene-dynamic/rates.json (Ekene-1, primary window)
--   DATASET now: ekene-dynamic/rates.json (Ekene-5, window from 2021-04-01,
--   limit 8)
--   PROMPT now: A late booking of Ekene-5: fit its monthly rates from 2021-04-01
--   through 2022-12-15 only (a custom window in the fit explorer, Auto-Select
--   model), then book the well at an 8 stb/d economic limit. Report the fitted
--   initial rate and nominal decline at the window start, the EUR and the time
--   to the 8 stb/d limit, the cumulative production from the window start to
--   2022-10-01, and the tangent effective annual decline. The fit explorer opens
--   on the teaching case (Ekene-1, the primary window, 10 stb/d), so set every
--   input.
--
-- INTERMEDIATE: pick A (re-case)
--   The walkthrough printed all six answers and the panels opened on the primary
--   windows, the E3 + E6 type curve and the 10 stb/d limit. Re-cased on custom
--   fit windows, an 8 stb/d limit and new wells, pools, b and triangle inputs,
--   which the learner sets. The Di, qi and R2 tolerances tighten to 2e-6, 0.05
--   and 0.001 on these new fields (the tiles print 7, 4 and 6 decimals), because
--   at 2e-5 a Di band covers most harmonic Di values the course prints.
--   e3_b (0.5, tol 0.02)
--       -> late_di 'Ekene-3 fitted Di, 2021-11-01 window' -, expected 0.001242236024844721, tol 2e-06
--   e3_eur_stb (111270.166537926, tol 600)
--       -> well_eur_stb 'Ekene-5 EUR at 8 stb/d (primary fit)' stb, expected 168381.90962055034, tol 600.0
--   e6_win_di (0.001, tol 0.00002)
--       -> sub_di 'Ekene-6 fitted Di, 2021-05-01 window' 1/d, expected 0.0009219138932423719, tol 2e-06
--   e1_naive_r2 (0.818388421218434, tol 0.01)
--       -> naive_r2 'Ekene-6 R2 across the flood (2020-01 to 2023-12)' -, expected 0.7822456367465322, tol 0.001
--   tc_eur_stb (91524.2759502962, tol 50)
--       -> tc_eur_stb 'Ekene-3 EUR from the E3 + E5 type curve at 8 stb/d' stb, expected 107761.48159232213, tol 50.0
--   field_eur_stb (461709.132532792, tol 2000)
--       -> field_eur_stb 'Sum of the four closed-form EURs at 8 stb/d' stb, expected 486822.66991036595, tol 2000.0
--   DATASET was: ekene-dynamic/rates.json (all four producers)
--   DATASET now: ekene-dynamic/rates.json (custom windows, limit 8)
--   PROMPT now: Work the Ekene field like a portfolio at an 8 stb/d economic
--   limit: fit Ekene-3 on 2021-11-01 through 2022-12-15 and report its fitted
--   Di; book Ekene-5's EUR from its primary-window fit; fit Ekene-6 on
--   2021-05-01 through 2022-12-15 and report its fitted Di; read the R2 of an
--   invalid fit of Ekene-6 over 2020-01-01 through 2023-12-15, across the flood;
--   book Ekene-3 from the pooled Ekene-3 + Ekene-5 type curve applied fixed-b;
--   and total the four wells' closed-form EURs. Use Auto-Select throughout. The
--   panels open on the teaching case (10 stb/d, the primary windows, the E3 + E6
--   pool), so set every input.
--
-- ADVANCED: pick A (re-case)
--   The walkthrough printed all six answers and the uncertainty explorer opened
--   on b 1.2 and the teaching triangle. Re-cased on custom fit windows, an 8
--   stb/d limit and new wells, pools, b and triangle inputs, which the learner
--   sets. The Di, qi and R2 tolerances tighten to 2e-6, 0.05 and 0.001 on these
--   new fields (the tiles print 7, 4 and 6 decimals), because at 2e-5 a Di band
--   covers most harmonic Di values the course prints.
--   e5_late_di (0.00035, tol 0.000005)
--       -> late_di_a 'Ekene-1 fitted Di from 2024-10-01' 1/d, expected 0.0004935544789384426, tol 5e-06
--   e6_oil_di (0.0013275893489185155, tol 0.000002)
--       -> late_di_b 'Ekene-6 oil decline on the same window' 1/d, expected 0.0015982971065338885, tol 2e-06
--   b12_eur_stb (321875.914758613, tol 2000)
--       -> b_eur_stb 'EUR at b 1.1 (Ekene-1 primary fit, limit 8)' stb, expected 311019.42303974996, tol 2000.0
--   b_ratio (3.5113736155485, tol 0.02)
--       -> b_ratio 'b 1.1 EUR over the exponential EUR' -, expected 3.332350961140178, tol 0.02
--   p90_stb (420425.025054486, tol 2000)
--       -> p90_stb 'Field triangle P90 (low)' stb, expected 443704.67638626386, tol 2000.0
--   p10_stb (531360.331525141, tol 2000)
--       -> p10_stb 'Field triangle P10 (high)' stb, expected 565871.4376509781, tol 2000.0
--   DATASET was: ekene-dynamic/rates.json + test-data/dca literature fixtures
--   DATASET now: ekene-dynamic/rates.json (post-ramp from 2024-10-01, b 1.1,
--   limit 8)
--   PROMPT now: Refit Ekene-1 on the window from 2024-10-01 onward (through
--   2025-12-15) and report its fitted nominal decline. On that SAME window,
--   refit Ekene-6, whose water cut is climbing, and report its fitted decline:
--   the two wells share a reservoir and a gross decline, so the difference is
--   the water cut. Then book the b = 1.1 EUR on Ekene-1's pre-flood primary
--   window, fitting its qi and Di yourself before you book, at an 8 stb/d limit,
--   with its ratio to the exponential booking of the same data. Finally compute
--   the field triangle's P90 and P10, petroleum convention with P90 low, from a
--   minimum of 400000 stb, a maximum of 620000 stb, and a mode that is the
--   field's deterministic booking: the sum of the four producers' closed-form
--   EURs at the same 8 stb/d limit, which you must total yourself.
--
-- ATTEMPTS. Tiers whose graded keys move: dca/beginner, dca/intermediate,
-- dca/advanced. Before it writes, the file counts academy_capstone_attempts on
-- each and REFUSES if any exist, unless D5 allowlists that tier with the exact
-- attempt ids (allowlist: empty). Stored scores are never touched.
--
-- GUARDS. Each row must hold EITHER its post-W1 form (prompt, title and
-- dataset by md5, fields as exact jsonb), which is rewritten, OR its W5 form,
-- which is left alone. Anything else raises and the whole file rolls back.
-- Generated by docs/graded-field-audit/w5_capstones.py. SAFE TO RE-RUN: a
-- second run writes nothing.
--
-- NOT A DB STEP. The lessons and panels that go with this file ship in the
-- NextGen zip, which must go live at nearly the same time as this apply.
-- ============================================================================

do $$
declare
  v_n        integer;
  v_count    integer;
  v_written  integer := 0;
  v_ids      jsonb;
  v_extra    jsonb;
  v_idtxt    text;
  v_allow    jsonb := '{}'::jsonb;  -- D5 allowlist: 'course/tier' -> attempt ids signed off
  v_s0       text;
  v_s1       text;
  v_s2       text;
begin
  -- dca / beginner
  select count(*) into v_n from public.academy_capstones where app_slug = 'dca' and tier = 'beginner' and active;
  if v_n <> 1 then raise exception 'w5b dca refused: dca/beginner has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = '7d87fccbd3f558980c6ce341fe276454' and md5(coalesce(title, '')) = '922ee576296a8ee9c976c868440a57a4' and md5(coalesce(dataset, '')) = 'd5423c047a02c5d271df0431c4c90738' and fields = '[{"key": "qi_bpd", "tol": 0.5, "unit": "stb/d", "label": "Fitted initial rate qi", "expected": 120}, {"key": "di_per_day", "tol": 0.00002, "unit": "1/d", "label": "Fitted nominal decline Di", "expected": 0.0012}, {"key": "eur_10_stb", "tol": 500, "unit": "stb", "label": "EUR at the 10 stb/d limit", "expected": 91666.6666666667}, {"key": "t_limit_days", "tol": 10, "unit": "days", "label": "Time to the 10 stb/d limit", "expected": 2070.75554149}, {"key": "np_flood_stb", "tol": 400, "unit": "stb", "label": "Cumulative production at 2023-01-01", "expected": 73157.9366256283}, {"key": "eff_decline_pct", "tol": 0.1, "unit": "%/yr", "label": "Tangent effective annual decline", "expected": 35.4674217142705}]'::jsonb then 'old'
              when md5(prompt) = '0cbe0d3e3da419df65a410bd03740534' and md5(coalesce(title, '')) = '922ee576296a8ee9c976c868440a57a4' and md5(coalesce(dataset, '')) = '09f1c749d45b25668e4a10cdc04d7e71' and fields = '[{"key": "qi_bpd", "tol": 0.05, "unit": "stb/d", "label": "Fitted initial rate qi at the window start", "expected": 68.68131868131867}, {"key": "di_per_day", "tol": 2e-06, "unit": "1/d", "label": "Fitted nominal decline Di at the window start", "expected": 0.00103021978021978}, {"key": "eur_limit_stb", "tol": 500.0, "unit": "stb", "label": "EUR at the 8 stb/d limit", "expected": 143335.71296891742}, {"key": "t_limit_days", "tol": 10.0, "unit": "days", "label": "Time to the 8 stb/d limit", "expected": 7362.666666666667}, {"key": "np_to_date_stb", "tol": 400.0, "unit": "stb", "label": "Cumulative from the window start to 2022-10-01", "expected": 29840.327683366406}, {"key": "eff_decline_pct", "tol": 0.1, "unit": "%/yr", "label": "Tangent effective annual decline", "expected": 31.34184156157903}]'::jsonb then 'new'
              else 'other' end
    into v_s0 from public.academy_capstones where app_slug = 'dca' and tier = 'beginner' and active;
  if v_s0 = 'other' then
    raise exception 'w5b dca refused: dca/beginner matches neither its post-W1 form (prompt md5 7d87fccbd3f558980c6ce341fe276454) nor its W5 form (prompt md5 0cbe0d3e3da419df65a410bd03740534), with the fields this file was generated against';
  end if;

  -- dca / intermediate
  select count(*) into v_n from public.academy_capstones where app_slug = 'dca' and tier = 'intermediate' and active;
  if v_n <> 1 then raise exception 'w5b dca refused: dca/intermediate has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = 'ee0b5228d4cbd5ed1dabc4e28c97712b' and md5(coalesce(title, '')) = '87ecb73b37ec1e89472089804a1cb715' and md5(coalesce(dataset, '')) = '84b49aad820181a399b798448621d627' and fields = '[{"key": "e3_b", "tol": 0.02, "unit": "-", "label": "Ekene-3 fitted decline exponent b", "expected": 0.5}, {"key": "e3_eur_stb", "tol": 600, "unit": "stb", "label": "Ekene-3 EUR at 10 stb/d", "expected": 111270.166537926}, {"key": "e6_win_di", "tol": 0.00002, "unit": "1/d", "label": "Ekene-6 windowed-to-primary Di", "expected": 0.001}, {"key": "e1_naive_r2", "tol": 0.01, "unit": "-", "label": "Ekene-1 full-history fit R2", "expected": 0.818388421218434}, {"key": "tc_eur_stb", "tol": 50, "unit": "stb", "label": "Ekene-6 EUR from the fixed-b type curve", "expected": 91524.2759502962}, {"key": "field_eur_stb", "tol": 2000, "unit": "stb", "label": "Sum of the four closed-form EURs at 10 stb/d", "expected": 461709.132532792}]'::jsonb then 'old'
              when md5(prompt) = '9b03909a0bcefcbf5f45ec8b53f4d11d' and md5(coalesce(title, '')) = '87ecb73b37ec1e89472089804a1cb715' and md5(coalesce(dataset, '')) = '9ba9ecc814b28ed46976135c0c5668a6' and fields = '[{"key": "late_di", "tol": 2e-06, "unit": "-", "label": "Ekene-3 fitted Di, 2021-11-01 window", "expected": 0.001242236024844721}, {"key": "well_eur_stb", "tol": 600.0, "unit": "stb", "label": "Ekene-5 EUR at 8 stb/d (primary fit)", "expected": 168381.90962055034}, {"key": "sub_di", "tol": 2e-06, "unit": "1/d", "label": "Ekene-6 fitted Di, 2021-05-01 window", "expected": 0.0009219138932423719}, {"key": "naive_r2", "tol": 0.001, "unit": "-", "label": "Ekene-6 R2 across the flood (2020-01 to 2023-12)", "expected": 0.7822456367465322}, {"key": "tc_eur_stb", "tol": 50.0, "unit": "stb", "label": "Ekene-3 EUR from the E3 + E5 type curve at 8 stb/d", "expected": 107761.48159232213}, {"key": "field_eur_stb", "tol": 2000.0, "unit": "stb", "label": "Sum of the four closed-form EURs at 8 stb/d", "expected": 486822.66991036595}]'::jsonb then 'new'
              else 'other' end
    into v_s1 from public.academy_capstones where app_slug = 'dca' and tier = 'intermediate' and active;
  if v_s1 = 'other' then
    raise exception 'w5b dca refused: dca/intermediate matches neither its post-W1 form (prompt md5 ee0b5228d4cbd5ed1dabc4e28c97712b) nor its W5 form (prompt md5 9b03909a0bcefcbf5f45ec8b53f4d11d), with the fields this file was generated against';
  end if;

  -- dca / advanced
  select count(*) into v_n from public.academy_capstones where app_slug = 'dca' and tier = 'advanced' and active;
  if v_n <> 1 then raise exception 'w5b dca refused: dca/advanced has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = '76875a05508b4eddb95a2c9507e4895d' and md5(coalesce(title, '')) = '1eadce4ad383c37b1f85257c40cf635e' and md5(coalesce(dataset, '')) = 'fb3511f1980bfe65a06c61032674f030' and fields = '[{"key": "e5_late_di", "tol": 0.000005, "unit": "1/d", "label": "Ekene-5 post-ramp fitted Di (2024-05-01 on)", "expected": 0.00035}, {"key": "e6_oil_di", "tol": 0.000002, "unit": "1/d", "label": "Ekene-6 oil decline on the same window", "expected": 0.0013275893489185155}, {"key": "b12_eur_stb", "tol": 2000, "unit": "stb", "label": "EUR at b 1.2 (Ekene-1 primary fit, limit 10)", "expected": 321875.914758613}, {"key": "b_ratio", "tol": 0.02, "unit": "-", "label": "b 1.2 EUR over the exponential EUR", "expected": 3.5113736155485}, {"key": "p90_stb", "tol": 2000, "unit": "stb", "label": "Field triangle P90 (low)", "expected": 420425.025054486}, {"key": "p10_stb", "tol": 2000, "unit": "stb", "label": "Field triangle P10 (high)", "expected": 531360.331525141}]'::jsonb then 'old'
              when md5(prompt) = 'b3f08c4d59fbfe134a7471a62aa4dd0b' and md5(coalesce(title, '')) = '1eadce4ad383c37b1f85257c40cf635e' and md5(coalesce(dataset, '')) = '4d26e1db242fac9cdce150b8ba435540' and fields = '[{"key": "late_di_a", "tol": 5e-06, "unit": "1/d", "label": "Ekene-1 fitted Di from 2024-10-01", "expected": 0.0004935544789384426}, {"key": "late_di_b", "tol": 2e-06, "unit": "1/d", "label": "Ekene-6 oil decline on the same window", "expected": 0.0015982971065338885}, {"key": "b_eur_stb", "tol": 2000.0, "unit": "stb", "label": "EUR at b 1.1 (Ekene-1 primary fit, limit 8)", "expected": 311019.42303974996}, {"key": "b_ratio", "tol": 0.02, "unit": "-", "label": "b 1.1 EUR over the exponential EUR", "expected": 3.332350961140178}, {"key": "p90_stb", "tol": 2000.0, "unit": "stb", "label": "Field triangle P90 (low)", "expected": 443704.67638626386}, {"key": "p10_stb", "tol": 2000.0, "unit": "stb", "label": "Field triangle P10 (high)", "expected": 565871.4376509781}]'::jsonb then 'new'
              else 'other' end
    into v_s2 from public.academy_capstones where app_slug = 'dca' and tier = 'advanced' and active;
  if v_s2 = 'other' then
    raise exception 'w5b dca refused: dca/advanced matches neither its post-W1 form (prompt md5 76875a05508b4eddb95a2c9507e4895d) nor its W5 form (prompt md5 b3f08c4d59fbfe134a7471a62aa4dd0b), with the fields this file was generated against';
  end if;

  -- nothing to write: every row is already in its W5 form
  if v_s0 = 'new' and v_s1 = 'new' and v_s2 = 'new' then
    raise notice 'w5b dca: 0 of 3 row(s) written, all already applied';
    return;
  end if;

  -- ATTEMPTS. A tier whose graded keys this file moves must hold no capstone
  -- attempt (a stored score is never re-scored, but a learner could be graded
  -- differently on a retry), unless D5 allowlists it with the exact attempt
  -- ids signed off. Any other attempt refuses.
  if v_s0 = 'old' then
    select coalesce(jsonb_agg(a.id::text order by a.created_at, a.id), '[]'::jsonb) into v_ids
      from public.academy_capstone_attempts a where a.app_slug = 'dca' and a.tier = 'beginner';
    if jsonb_array_length(v_ids) > 0 then
      if v_allow ? 'dca/beginner' then
        select coalesce(jsonb_agg(x), '[]'::jsonb) into v_extra
          from jsonb_array_elements(v_ids) x where not (v_allow->'dca/beginner') @> jsonb_build_array(x);
        if jsonb_array_length(v_extra) > 0 then
          select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_extra) x;
          raise exception 'w5b dca refused: dca/beginner holds % attempt(s) outside its D5 allowlist: %', jsonb_array_length(v_extra), v_idtxt;
        end if;
        raise notice 'w5b dca: dca/beginner holds % allowlisted attempt(s) (D5 sign-off); their stored scores are not touched', jsonb_array_length(v_ids);
      else
        select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_ids) x;
        raise exception 'w5b dca refused: dca/beginner holds % capstone attempt(s) (%) and this file moves its graded keys; sign the tier off under D5 (allowlist with these ids) or hold it', jsonb_array_length(v_ids), v_idtxt;
      end if;
    end if;
  end if;
  if v_s1 = 'old' then
    select coalesce(jsonb_agg(a.id::text order by a.created_at, a.id), '[]'::jsonb) into v_ids
      from public.academy_capstone_attempts a where a.app_slug = 'dca' and a.tier = 'intermediate';
    if jsonb_array_length(v_ids) > 0 then
      if v_allow ? 'dca/intermediate' then
        select coalesce(jsonb_agg(x), '[]'::jsonb) into v_extra
          from jsonb_array_elements(v_ids) x where not (v_allow->'dca/intermediate') @> jsonb_build_array(x);
        if jsonb_array_length(v_extra) > 0 then
          select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_extra) x;
          raise exception 'w5b dca refused: dca/intermediate holds % attempt(s) outside its D5 allowlist: %', jsonb_array_length(v_extra), v_idtxt;
        end if;
        raise notice 'w5b dca: dca/intermediate holds % allowlisted attempt(s) (D5 sign-off); their stored scores are not touched', jsonb_array_length(v_ids);
      else
        select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_ids) x;
        raise exception 'w5b dca refused: dca/intermediate holds % capstone attempt(s) (%) and this file moves its graded keys; sign the tier off under D5 (allowlist with these ids) or hold it', jsonb_array_length(v_ids), v_idtxt;
      end if;
    end if;
  end if;
  if v_s2 = 'old' then
    select coalesce(jsonb_agg(a.id::text order by a.created_at, a.id), '[]'::jsonb) into v_ids
      from public.academy_capstone_attempts a where a.app_slug = 'dca' and a.tier = 'advanced';
    if jsonb_array_length(v_ids) > 0 then
      if v_allow ? 'dca/advanced' then
        select coalesce(jsonb_agg(x), '[]'::jsonb) into v_extra
          from jsonb_array_elements(v_ids) x where not (v_allow->'dca/advanced') @> jsonb_build_array(x);
        if jsonb_array_length(v_extra) > 0 then
          select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_extra) x;
          raise exception 'w5b dca refused: dca/advanced holds % attempt(s) outside its D5 allowlist: %', jsonb_array_length(v_extra), v_idtxt;
        end if;
        raise notice 'w5b dca: dca/advanced holds % allowlisted attempt(s) (D5 sign-off); their stored scores are not touched', jsonb_array_length(v_ids);
      else
        select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_ids) x;
        raise exception 'w5b dca refused: dca/advanced holds % capstone attempt(s) (%) and this file moves its graded keys; sign the tier off under D5 (allowlist with these ids) or hold it', jsonb_array_length(v_ids), v_idtxt;
      end if;
    end if;
  end if;

  if v_s0 = 'old' then
    update public.academy_capstones
       set prompt = 'A late booking of Ekene-5: fit its monthly rates from 2021-04-01 through 2022-12-15 only (a custom window in the fit explorer, Auto-Select model), then book the well at an 8 stb/d economic limit. Report the fitted initial rate and nominal decline at the window start, the EUR and the time to the 8 stb/d limit, the cumulative production from the window start to 2022-10-01, and the tangent effective annual decline. The fit explorer opens on the teaching case (Ekene-1, the primary window, 10 stb/d), so set every input.',
           title = 'Fit and book Ekene-1',
           dataset = 'ekene-dynamic/rates.json (Ekene-5, window from 2021-04-01, limit 8)',
           fields = '[{"key": "qi_bpd", "tol": 0.05, "unit": "stb/d", "label": "Fitted initial rate qi at the window start", "expected": 68.68131868131867}, {"key": "di_per_day", "tol": 2e-06, "unit": "1/d", "label": "Fitted nominal decline Di at the window start", "expected": 0.00103021978021978}, {"key": "eur_limit_stb", "tol": 500.0, "unit": "stb", "label": "EUR at the 8 stb/d limit", "expected": 143335.71296891742}, {"key": "t_limit_days", "tol": 10.0, "unit": "days", "label": "Time to the 8 stb/d limit", "expected": 7362.666666666667}, {"key": "np_to_date_stb", "tol": 400.0, "unit": "stb", "label": "Cumulative from the window start to 2022-10-01", "expected": 29840.327683366406}, {"key": "eff_decline_pct", "tol": 0.1, "unit": "%/yr", "label": "Tangent effective annual decline", "expected": 31.34184156157903}]'::jsonb
     where app_slug = 'dca' and tier = 'beginner' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w5b dca refused: dca/beginner updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = '0cbe0d3e3da419df65a410bd03740534' and md5(coalesce(title, '')) = '922ee576296a8ee9c976c868440a57a4' and md5(coalesce(dataset, '')) = '09f1c749d45b25668e4a10cdc04d7e71' and fields = '[{"key": "qi_bpd", "tol": 0.05, "unit": "stb/d", "label": "Fitted initial rate qi at the window start", "expected": 68.68131868131867}, {"key": "di_per_day", "tol": 2e-06, "unit": "1/d", "label": "Fitted nominal decline Di at the window start", "expected": 0.00103021978021978}, {"key": "eur_limit_stb", "tol": 500.0, "unit": "stb", "label": "EUR at the 8 stb/d limit", "expected": 143335.71296891742}, {"key": "t_limit_days", "tol": 10.0, "unit": "days", "label": "Time to the 8 stb/d limit", "expected": 7362.666666666667}, {"key": "np_to_date_stb", "tol": 400.0, "unit": "stb", "label": "Cumulative from the window start to 2022-10-01", "expected": 29840.327683366406}, {"key": "eff_decline_pct", "tol": 0.1, "unit": "%/yr", "label": "Tangent effective annual decline", "expected": 31.34184156157903}]'::jsonb) from public.academy_capstones where app_slug = 'dca' and tier = 'beginner' and active) is not true then
    raise exception 'w5b dca refused: dca/beginner does not read back as its W5 form';
  end if;

  if v_s1 = 'old' then
    update public.academy_capstones
       set prompt = 'Work the Ekene field like a portfolio at an 8 stb/d economic limit: fit Ekene-3 on 2021-11-01 through 2022-12-15 and report its fitted Di; book Ekene-5''s EUR from its primary-window fit; fit Ekene-6 on 2021-05-01 through 2022-12-15 and report its fitted Di; read the R2 of an invalid fit of Ekene-6 over 2020-01-01 through 2023-12-15, across the flood; book Ekene-3 from the pooled Ekene-3 + Ekene-5 type curve applied fixed-b; and total the four wells'' closed-form EURs. Use Auto-Select throughout. The panels open on the teaching case (10 stb/d, the primary windows, the E3 + E6 pool), so set every input.',
           title = 'Windows, models and the portfolio',
           dataset = 'ekene-dynamic/rates.json (custom windows, limit 8)',
           fields = '[{"key": "late_di", "tol": 2e-06, "unit": "-", "label": "Ekene-3 fitted Di, 2021-11-01 window", "expected": 0.001242236024844721}, {"key": "well_eur_stb", "tol": 600.0, "unit": "stb", "label": "Ekene-5 EUR at 8 stb/d (primary fit)", "expected": 168381.90962055034}, {"key": "sub_di", "tol": 2e-06, "unit": "1/d", "label": "Ekene-6 fitted Di, 2021-05-01 window", "expected": 0.0009219138932423719}, {"key": "naive_r2", "tol": 0.001, "unit": "-", "label": "Ekene-6 R2 across the flood (2020-01 to 2023-12)", "expected": 0.7822456367465322}, {"key": "tc_eur_stb", "tol": 50.0, "unit": "stb", "label": "Ekene-3 EUR from the E3 + E5 type curve at 8 stb/d", "expected": 107761.48159232213}, {"key": "field_eur_stb", "tol": 2000.0, "unit": "stb", "label": "Sum of the four closed-form EURs at 8 stb/d", "expected": 486822.66991036595}]'::jsonb
     where app_slug = 'dca' and tier = 'intermediate' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w5b dca refused: dca/intermediate updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = '9b03909a0bcefcbf5f45ec8b53f4d11d' and md5(coalesce(title, '')) = '87ecb73b37ec1e89472089804a1cb715' and md5(coalesce(dataset, '')) = '9ba9ecc814b28ed46976135c0c5668a6' and fields = '[{"key": "late_di", "tol": 2e-06, "unit": "-", "label": "Ekene-3 fitted Di, 2021-11-01 window", "expected": 0.001242236024844721}, {"key": "well_eur_stb", "tol": 600.0, "unit": "stb", "label": "Ekene-5 EUR at 8 stb/d (primary fit)", "expected": 168381.90962055034}, {"key": "sub_di", "tol": 2e-06, "unit": "1/d", "label": "Ekene-6 fitted Di, 2021-05-01 window", "expected": 0.0009219138932423719}, {"key": "naive_r2", "tol": 0.001, "unit": "-", "label": "Ekene-6 R2 across the flood (2020-01 to 2023-12)", "expected": 0.7822456367465322}, {"key": "tc_eur_stb", "tol": 50.0, "unit": "stb", "label": "Ekene-3 EUR from the E3 + E5 type curve at 8 stb/d", "expected": 107761.48159232213}, {"key": "field_eur_stb", "tol": 2000.0, "unit": "stb", "label": "Sum of the four closed-form EURs at 8 stb/d", "expected": 486822.66991036595}]'::jsonb) from public.academy_capstones where app_slug = 'dca' and tier = 'intermediate' and active) is not true then
    raise exception 'w5b dca refused: dca/intermediate does not read back as its W5 form';
  end if;

  if v_s2 = 'old' then
    update public.academy_capstones
       set prompt = 'Refit Ekene-1 on the window from 2024-10-01 onward (through 2025-12-15) and report its fitted nominal decline. On that SAME window, refit Ekene-6, whose water cut is climbing, and report its fitted decline: the two wells share a reservoir and a gross decline, so the difference is the water cut. Then book the b = 1.1 EUR on Ekene-1''s pre-flood primary window, fitting its qi and Di yourself before you book, at an 8 stb/d limit, with its ratio to the exponential booking of the same data. Finally compute the field triangle''s P90 and P10, petroleum convention with P90 low, from a minimum of 400000 stb, a maximum of 620000 stb, and a mode that is the field''s deterministic booking: the sum of the four producers'' closed-form EURs at the same 8 stb/d limit, which you must total yourself.',
           title = 'Uncertainty, governance and honesty',
           dataset = 'ekene-dynamic/rates.json (post-ramp from 2024-10-01, b 1.1, limit 8)',
           fields = '[{"key": "late_di_a", "tol": 5e-06, "unit": "1/d", "label": "Ekene-1 fitted Di from 2024-10-01", "expected": 0.0004935544789384426}, {"key": "late_di_b", "tol": 2e-06, "unit": "1/d", "label": "Ekene-6 oil decline on the same window", "expected": 0.0015982971065338885}, {"key": "b_eur_stb", "tol": 2000.0, "unit": "stb", "label": "EUR at b 1.1 (Ekene-1 primary fit, limit 8)", "expected": 311019.42303974996}, {"key": "b_ratio", "tol": 0.02, "unit": "-", "label": "b 1.1 EUR over the exponential EUR", "expected": 3.332350961140178}, {"key": "p90_stb", "tol": 2000.0, "unit": "stb", "label": "Field triangle P90 (low)", "expected": 443704.67638626386}, {"key": "p10_stb", "tol": 2000.0, "unit": "stb", "label": "Field triangle P10 (high)", "expected": 565871.4376509781}]'::jsonb
     where app_slug = 'dca' and tier = 'advanced' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w5b dca refused: dca/advanced updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = 'b3f08c4d59fbfe134a7471a62aa4dd0b' and md5(coalesce(title, '')) = '1eadce4ad383c37b1f85257c40cf635e' and md5(coalesce(dataset, '')) = '4d26e1db242fac9cdce150b8ba435540' and fields = '[{"key": "late_di_a", "tol": 5e-06, "unit": "1/d", "label": "Ekene-1 fitted Di from 2024-10-01", "expected": 0.0004935544789384426}, {"key": "late_di_b", "tol": 2e-06, "unit": "1/d", "label": "Ekene-6 oil decline on the same window", "expected": 0.0015982971065338885}, {"key": "b_eur_stb", "tol": 2000.0, "unit": "stb", "label": "EUR at b 1.1 (Ekene-1 primary fit, limit 8)", "expected": 311019.42303974996}, {"key": "b_ratio", "tol": 0.02, "unit": "-", "label": "b 1.1 EUR over the exponential EUR", "expected": 3.332350961140178}, {"key": "p90_stb", "tol": 2000.0, "unit": "stb", "label": "Field triangle P90 (low)", "expected": 443704.67638626386}, {"key": "p10_stb", "tol": 2000.0, "unit": "stb", "label": "Field triangle P10 (high)", "expected": 565871.4376509781}]'::jsonb) from public.academy_capstones where app_slug = 'dca' and tier = 'advanced' and active) is not true then
    raise exception 'w5b dca refused: dca/advanced does not read back as its W5 form';
  end if;

  raise notice 'w5b dca: % of 3 row(s) written, % already applied', v_written, 3 - v_written;
end $$;
