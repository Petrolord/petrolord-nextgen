-- ============================================================================
-- B5 FOLLOW-ON W5 (part c), section 3: 20261028c_w5_petrophysics.
--
-- Plan of record: docs/graded-field-audit/FOLLOW-ON-PROGRAMME.md section 3
-- (D4 picks A and B) and the spec docs/graded-field-audit/w5c/petrophysics.json.
-- Owner approved D1 to D7 as recommended, 2026-09-21.
--
-- BEGINNER (pick A: re-case)
--   Section 3 pick A: the beginner walkthrough and the net-pay summary printed
--   all six typewell answers. The capstone moves to IKPO-3, a well no panel
--   loads, opened from its LAS file with the zones the brief states.
--   RE-KEY sand_a_net_m (expected 18.0, tol 0.75)
--       -> ikpo3_sand_a_net_m 'IKPO-3 SAND_A net pay' m, expected 21, tol 0.75
--   RE-KEY sand_a_phi_avg (expected 0.20805198865869562, tol 0.01)
--       -> ikpo3_sand_a_phi_avg 'IKPO-3 SAND_A average porosity' v/v, expected 0.2760532518141886, tol 0.01
--   RE-KEY sand_a_sw_avg (expected 0.361262643786335, tol 0.02)
--       -> ikpo3_sand_a_sw_avg 'IKPO-3 SAND_A average Sw' v/v, expected 0.3357171074414596, tol 0.02
--   RE-KEY sand_b_net_m (expected 5.5, tol 0.75)
--       -> ikpo3_sand_b_net_m 'IKPO-3 SAND_B net pay' m, expected 2, tol 0.75
--   RE-KEY sand_b_phi_avg (expected 0.1417010751338701, tol 0.01)
--       -> ikpo3_sand_b_phi_avg 'IKPO-3 SAND_B average porosity' v/v, expected 0.18175000132936417, tol 0.01
--   RE-KEY sand_b_sw_avg (expected 0.5423153983883204, tol 0.02)
--       -> ikpo3_sand_b_sw_avg 'IKPO-3 SAND_B average Sw' v/v, expected 0.5828123287408515, tol 0.02
--   PROMPT and DATASET replaced (the new case, stated in full; the W1 open-book label goes).
--
-- INTERMEDIATE (pick A: re-case)
--   Section 3 pick A: the intermediate lessons printed the typewell porosity and
--   saturation means and the panels opened on the typewell. The capstone moves
--   to IKPO-3; W1's Pickett window rule (three metres above the water leg) and
--   tightened tolerances carry over, re-computed on the new well.
--   RE-KEY phind_avg_sand_a (expected 0.17615030026601647, tol 0.002)
--       -> ikpo3_phind_avg_sand_a 'IKPO-3 SAND_A mean neutron-density porosity' v/v, expected 0.220804395724828, tol 0.002
--   RE-KEY phiw_avg_sand_a (expected 0.2069057569286416, tol 0.002)
--       -> ikpo3_phiw_avg_sand_a 'IKPO-3 SAND_A mean Wyllie sonic porosity' v/v, expected 0.24152554540191523, tol 0.002
--   RE-KEY pickett_a_rw_2072_2078 (expected 0.6886854786769905, tol 0.002)
--       -> ikpo3_pickett_a_rw 'IKPO-3 Pickett fit over 1773 to 1779 m: a·Rw' Ω·m, expected 0.5256574094251089, tol 0.002
--   RE-KEY pickett_m_2072_2078 (expected 0.8784525453945112, tol 0.0002)
--       -> ikpo3_pickett_m 'IKPO-3 Pickett fit over 1773 to 1779 m: cementation exponent m' -, expected 0.8502948473840143, tol 0.0002
--   RE-KEY sw_sim_sand_a (expected 0.43350268917150697, tol 0.01)
--       -> ikpo3_sw_sim_sand_a 'IKPO-3 SAND_A mean Sw (Simandoux)' v/v, expected 0.41662897913099867, tol 0.01
--   RE-KEY sw_ind_sand_a (expected 0.4280109754526606, tol 0.01)
--       -> ikpo3_sw_ind_sand_a 'IKPO-3 SAND_A mean Sw (Indonesia)' v/v, expected 0.41326832744212, tol 0.01
--   PROMPT and DATASET replaced (the new case, stated in full; the W1 open-book label goes).
--
-- ADVANCED (pick A: re-case)
--   Section 3 pick A: the advanced lessons printed every typewell
--   Rw-triangulation answer and the triangulator opened on the typewell sample.
--   The capstone moves to IKPO-3 with its own sample and SP reading; W1's
--   tightened tolerances carry over.
--   RE-KEY rw_arps (expected 0.049910478128179045, tol 0.00005)
--       -> ikpo3_rw_arps 'IKPO-3 sample Rw at formation temperature (Arps)' ohm.m, expected 0.049702164792750456, tol 5e-05
--   RE-KEY rwe_ssp (expected 0.049831180824251246, tol 0.00005)
--       -> ikpo3_rwe_ssp 'IKPO-3 Rwe from the SP quicklook' ohm.m, expected 0.05071526604329182, tol 5e-05
--   RE-KEY sw_waterleg_mean (expected 0.9991043802143901, tol 0.0005)
--       -> ikpo3_sw_waterleg_mean 'IKPO-3 water-leg mean Sw with the Arps Rw' v/v, expected 0.9970190768360505, tol 0.0005
--   RE-KEY sand_a_net_arps (expected 18, tol 0.01)
--       -> ikpo3_sand_a_net_arps 'IKPO-3 SAND_A net pay with the Arps Rw' m, expected 21, tol 0.01
--   RE-KEY sand_a_sw_avg_arps (expected 0.3609390898147585, tol 0.005)
--       -> ikpo3_sand_a_sw_avg_arps 'IKPO-3 SAND_A pay-average Sw with the Arps Rw' v/v, expected 0.33471573024447604, tol 0.005
--   RE-KEY sand_a_net_uncorrected (expected 16.5, tol 0.01)
--       -> ikpo3_sand_a_net_uncorrected 'IKPO-3 SAND_A net pay with the raw sample Rw' m, expected 20, tol 0.01
--   PROMPT and DATASET replaced (the new case, stated in full; the W1 open-book label goes).
--
-- WHAT DOES NOT MOVE. The title, status and the row itself; on a pick B tier
-- also every field (key, label, unit, expected, tol and position) and the
-- dataset.
--
-- ATTEMPTS. Tiers this file re-keys: petrophysics/beginner,
-- petrophysics/intermediate, petrophysics/advanced. Before it writes, the file
-- counts academy_capstone_attempts on each and REFUSES if any exist, unless D5
-- allowlists that tier with the exact attempt ids (allowlist: empty). Stored
-- scores are never touched.
--
-- GUARDS. Each row must hold EITHER its post-W1 prompt and dataset (by md5)
-- and fields (exact jsonb), as production holds them after the W1 34 files
-- (it is rewritten), OR its W5 form (left alone). Anything else raises and the
-- whole file rolls back. Lessons and panels ship with the NextGen zip, near-
-- simultaneous with this apply. Generated by
-- docs/graded-field-audit/w5c_capstones.py. SAFE TO RE-RUN: a second run
-- writes nothing.
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
  -- petrophysics / beginner
  select count(*) into v_n from public.academy_capstones where app_slug = 'petrophysics' and tier = 'beginner' and active;
  if v_n <> 1 then raise exception 'w5c petrophysics refused: petrophysics/beginner has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = '8b87ccc9c4917dec18964452eac31cc2' and md5(dataset) = 'f83ae39b9f48f4cf4b88cb0c42d5c493' and fields = '[{"key": "sand_a_net_m", "tol": 0.75, "unit": "m", "label": "SAND_A net pay", "expected": 18.0}, {"key": "sand_a_phi_avg", "tol": 0.01, "unit": "v/v", "label": "SAND_A average porosity", "expected": 0.20805198865869562}, {"key": "sand_a_sw_avg", "tol": 0.02, "unit": "v/v", "label": "SAND_A average Sw", "expected": 0.361262643786335}, {"key": "sand_b_net_m", "tol": 0.75, "unit": "m", "label": "SAND_B net pay", "expected": 5.5}, {"key": "sand_b_phi_avg", "tol": 0.01, "unit": "v/v", "label": "SAND_B average porosity", "expected": 0.1417010751338701}, {"key": "sand_b_sw_avg", "tol": 0.02, "unit": "v/v", "label": "SAND_B average Sw", "expected": 0.5423153983883204}]'::jsonb then 'old'
              when md5(prompt) = 'e41f96a10a3fb40ad14a2b55c1bcad30' and md5(dataset) = 'e8c60f0c7eac646afb90df536bda8ac3' and fields = '[{"key": "ikpo3_sand_a_net_m", "tol": 0.75, "unit": "m", "label": "IKPO-3 SAND_A net pay", "expected": 21}, {"key": "ikpo3_sand_a_phi_avg", "tol": 0.01, "unit": "v/v", "label": "IKPO-3 SAND_A average porosity", "expected": 0.2760532518141886}, {"key": "ikpo3_sand_a_sw_avg", "tol": 0.02, "unit": "v/v", "label": "IKPO-3 SAND_A average Sw", "expected": 0.3357171074414596}, {"key": "ikpo3_sand_b_net_m", "tol": 0.75, "unit": "m", "label": "IKPO-3 SAND_B net pay", "expected": 2}, {"key": "ikpo3_sand_b_phi_avg", "tol": 0.01, "unit": "v/v", "label": "IKPO-3 SAND_B average porosity", "expected": 0.18175000132936417}, {"key": "ikpo3_sand_b_sw_avg", "tol": 0.02, "unit": "v/v", "label": "IKPO-3 SAND_B average Sw", "expected": 0.5828123287408515}]'::jsonb then 'new'
              else 'other' end
    into v_s0 from public.academy_capstones where app_slug = 'petrophysics' and tier = 'beginner' and active;
  if v_s0 = 'other' then
    raise exception 'w5c petrophysics refused: petrophysics/beginner matches neither its post-W1 form (prompt md5 8b87ccc9c4917dec18964452eac31cc2) nor its W5 form (prompt md5 e41f96a10a3fb40ad14a2b55c1bcad30), with the dataset and fields this file was generated against';
  end if;

  -- petrophysics / intermediate
  select count(*) into v_n from public.academy_capstones where app_slug = 'petrophysics' and tier = 'intermediate' and active;
  if v_n <> 1 then raise exception 'w5c petrophysics refused: petrophysics/intermediate has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = '4fc93836432a158c77906d14bf752067' and md5(dataset) = 'f83ae39b9f48f4cf4b88cb0c42d5c493' and fields = '[{"key": "phind_avg_sand_a", "tol": 0.002, "unit": "v/v", "label": "SAND_A mean neutron-density porosity", "expected": 0.17615030026601647}, {"key": "phiw_avg_sand_a", "tol": 0.002, "unit": "v/v", "label": "SAND_A mean Wyllie sonic porosity", "expected": 0.2069057569286416}, {"key": "pickett_a_rw_2072_2078", "tol": 0.002, "unit": "Ω·m", "label": "Pickett fit over 2072 to 2078 m: a·Rw", "expected": 0.6886854786769905}, {"key": "pickett_m_2072_2078", "tol": 0.0002, "unit": "-", "label": "Pickett fit over 2072 to 2078 m: cementation exponent m", "expected": 0.8784525453945112}, {"key": "sw_sim_sand_a", "tol": 0.01, "unit": "v/v", "label": "SAND_A mean Sw (Simandoux)", "expected": 0.43350268917150697}, {"key": "sw_ind_sand_a", "tol": 0.01, "unit": "v/v", "label": "SAND_A mean Sw (Indonesia)", "expected": 0.4280109754526606}]'::jsonb then 'old'
              when md5(prompt) = '5768a6a23d23826c94ef328fa87f2748' and md5(dataset) = 'e8c60f0c7eac646afb90df536bda8ac3' and fields = '[{"key": "ikpo3_phind_avg_sand_a", "tol": 0.002, "unit": "v/v", "label": "IKPO-3 SAND_A mean neutron-density porosity", "expected": 0.220804395724828}, {"key": "ikpo3_phiw_avg_sand_a", "tol": 0.002, "unit": "v/v", "label": "IKPO-3 SAND_A mean Wyllie sonic porosity", "expected": 0.24152554540191523}, {"key": "ikpo3_pickett_a_rw", "tol": 0.002, "unit": "Ω·m", "label": "IKPO-3 Pickett fit over 1773 to 1779 m: a·Rw", "expected": 0.5256574094251089}, {"key": "ikpo3_pickett_m", "tol": 0.0002, "unit": "-", "label": "IKPO-3 Pickett fit over 1773 to 1779 m: cementation exponent m", "expected": 0.8502948473840143}, {"key": "ikpo3_sw_sim_sand_a", "tol": 0.01, "unit": "v/v", "label": "IKPO-3 SAND_A mean Sw (Simandoux)", "expected": 0.41662897913099867}, {"key": "ikpo3_sw_ind_sand_a", "tol": 0.01, "unit": "v/v", "label": "IKPO-3 SAND_A mean Sw (Indonesia)", "expected": 0.41326832744212}]'::jsonb then 'new'
              else 'other' end
    into v_s1 from public.academy_capstones where app_slug = 'petrophysics' and tier = 'intermediate' and active;
  if v_s1 = 'other' then
    raise exception 'w5c petrophysics refused: petrophysics/intermediate matches neither its post-W1 form (prompt md5 4fc93836432a158c77906d14bf752067) nor its W5 form (prompt md5 5768a6a23d23826c94ef328fa87f2748), with the dataset and fields this file was generated against';
  end if;

  -- petrophysics / advanced
  select count(*) into v_n from public.academy_capstones where app_slug = 'petrophysics' and tier = 'advanced' and active;
  if v_n <> 1 then raise exception 'w5c petrophysics refused: petrophysics/advanced has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = '83efe3c343b9a73cbb8c6d9519c4ced2' and md5(dataset) = '217d28c17c0f1755f1851031fc02d772' and fields = '[{"key": "rw_arps", "tol": 0.00005, "unit": "ohm.m", "label": "Sample Rw at formation temperature (Arps)", "expected": 0.049910478128179045}, {"key": "rwe_ssp", "tol": 0.00005, "unit": "ohm.m", "label": "Rwe from the SP quicklook", "expected": 0.049831180824251246}, {"key": "sw_waterleg_mean", "tol": 0.0005, "unit": "v/v", "label": "Water-leg mean Sw with the Arps Rw", "expected": 0.9991043802143901}, {"key": "sand_a_net_arps", "tol": 0.01, "unit": "m", "label": "SAND_A net pay with the Arps Rw", "expected": 18}, {"key": "sand_a_sw_avg_arps", "tol": 0.005, "unit": "v/v", "label": "SAND_A pay-average Sw with the Arps Rw", "expected": 0.3609390898147585}, {"key": "sand_a_net_uncorrected", "tol": 0.01, "unit": "m", "label": "SAND_A net pay with the raw sample Rw", "expected": 16.5}]'::jsonb then 'old'
              when md5(prompt) = '58c32f37ee9d8312154c2dfb8b21f8e2' and md5(dataset) = '5978885aeea124fec24e65aab45b43cd' and fields = '[{"key": "ikpo3_rw_arps", "tol": 5e-05, "unit": "ohm.m", "label": "IKPO-3 sample Rw at formation temperature (Arps)", "expected": 0.049702164792750456}, {"key": "ikpo3_rwe_ssp", "tol": 5e-05, "unit": "ohm.m", "label": "IKPO-3 Rwe from the SP quicklook", "expected": 0.05071526604329182}, {"key": "ikpo3_sw_waterleg_mean", "tol": 0.0005, "unit": "v/v", "label": "IKPO-3 water-leg mean Sw with the Arps Rw", "expected": 0.9970190768360505}, {"key": "ikpo3_sand_a_net_arps", "tol": 0.01, "unit": "m", "label": "IKPO-3 SAND_A net pay with the Arps Rw", "expected": 21}, {"key": "ikpo3_sand_a_sw_avg_arps", "tol": 0.005, "unit": "v/v", "label": "IKPO-3 SAND_A pay-average Sw with the Arps Rw", "expected": 0.33471573024447604}, {"key": "ikpo3_sand_a_net_uncorrected", "tol": 0.01, "unit": "m", "label": "IKPO-3 SAND_A net pay with the raw sample Rw", "expected": 20}]'::jsonb then 'new'
              else 'other' end
    into v_s2 from public.academy_capstones where app_slug = 'petrophysics' and tier = 'advanced' and active;
  if v_s2 = 'other' then
    raise exception 'w5c petrophysics refused: petrophysics/advanced matches neither its post-W1 form (prompt md5 83efe3c343b9a73cbb8c6d9519c4ced2) nor its W5 form (prompt md5 58c32f37ee9d8312154c2dfb8b21f8e2), with the dataset and fields this file was generated against';
  end if;

  -- nothing to write: every row is already in its W5 form
  if v_s0 = 'new' and v_s1 = 'new' and v_s2 = 'new' then
    raise notice 'w5c petrophysics: 0 of 3 row(s) written, all already applied';
    return;
  end if;

  -- ATTEMPTS. A tier whose graded keys this file moves must hold no capstone
  -- attempt (a stored score is never re-scored, but a learner could be graded
  -- differently on a retry), unless D5 allowlists it with the exact attempt
  -- ids signed off. Any other attempt refuses.
  if v_s0 = 'old' then
    select coalesce(jsonb_agg(a.id::text order by a.created_at, a.id), '[]'::jsonb) into v_ids
      from public.academy_capstone_attempts a where a.app_slug = 'petrophysics' and a.tier = 'beginner';
    if jsonb_array_length(v_ids) > 0 then
      if v_allow ? 'petrophysics/beginner' then
        select coalesce(jsonb_agg(x), '[]'::jsonb) into v_extra
          from jsonb_array_elements(v_ids) x where not (v_allow->'petrophysics/beginner') @> jsonb_build_array(x);
        if jsonb_array_length(v_extra) > 0 then
          select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_extra) x;
          raise exception 'w5c petrophysics refused: petrophysics/beginner holds % attempt(s) outside its D5 allowlist: %', jsonb_array_length(v_extra), v_idtxt;
        end if;
        raise notice 'w5c petrophysics: petrophysics/beginner holds % allowlisted attempt(s) (D5 sign-off); their stored scores are not touched', jsonb_array_length(v_ids);
      else
        select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_ids) x;
        raise exception 'w5c petrophysics refused: petrophysics/beginner holds % capstone attempt(s) (%) and this file re-keys it; sign the tier off under D5 (allowlist with these ids) or hold it', jsonb_array_length(v_ids), v_idtxt;
      end if;
    end if;
  end if;
  if v_s1 = 'old' then
    select coalesce(jsonb_agg(a.id::text order by a.created_at, a.id), '[]'::jsonb) into v_ids
      from public.academy_capstone_attempts a where a.app_slug = 'petrophysics' and a.tier = 'intermediate';
    if jsonb_array_length(v_ids) > 0 then
      if v_allow ? 'petrophysics/intermediate' then
        select coalesce(jsonb_agg(x), '[]'::jsonb) into v_extra
          from jsonb_array_elements(v_ids) x where not (v_allow->'petrophysics/intermediate') @> jsonb_build_array(x);
        if jsonb_array_length(v_extra) > 0 then
          select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_extra) x;
          raise exception 'w5c petrophysics refused: petrophysics/intermediate holds % attempt(s) outside its D5 allowlist: %', jsonb_array_length(v_extra), v_idtxt;
        end if;
        raise notice 'w5c petrophysics: petrophysics/intermediate holds % allowlisted attempt(s) (D5 sign-off); their stored scores are not touched', jsonb_array_length(v_ids);
      else
        select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_ids) x;
        raise exception 'w5c petrophysics refused: petrophysics/intermediate holds % capstone attempt(s) (%) and this file re-keys it; sign the tier off under D5 (allowlist with these ids) or hold it', jsonb_array_length(v_ids), v_idtxt;
      end if;
    end if;
  end if;
  if v_s2 = 'old' then
    select coalesce(jsonb_agg(a.id::text order by a.created_at, a.id), '[]'::jsonb) into v_ids
      from public.academy_capstone_attempts a where a.app_slug = 'petrophysics' and a.tier = 'advanced';
    if jsonb_array_length(v_ids) > 0 then
      if v_allow ? 'petrophysics/advanced' then
        select coalesce(jsonb_agg(x), '[]'::jsonb) into v_extra
          from jsonb_array_elements(v_ids) x where not (v_allow->'petrophysics/advanced') @> jsonb_build_array(x);
        if jsonb_array_length(v_extra) > 0 then
          select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_extra) x;
          raise exception 'w5c petrophysics refused: petrophysics/advanced holds % attempt(s) outside its D5 allowlist: %', jsonb_array_length(v_extra), v_idtxt;
        end if;
        raise notice 'w5c petrophysics: petrophysics/advanced holds % allowlisted attempt(s) (D5 sign-off); their stored scores are not touched', jsonb_array_length(v_ids);
      else
        select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_ids) x;
        raise exception 'w5c petrophysics refused: petrophysics/advanced holds % capstone attempt(s) (%) and this file re-keys it; sign the tier off under D5 (allowlist with these ids) or hold it', jsonb_array_length(v_ids), v_idtxt;
      end if;
    end if;
  end if;

  if v_s0 = 'old' then
    update public.academy_capstones
       set prompt = 'The IKPO-3 well: download its LAS file from the capstone card and open it in the app with Open a LAS file, with SAND_A from 1712 to 1734 m, SAND_B from 1752 to 1781 m and the water leg from 1776 to 1779 m. Using the course''s given parameters (matrix density 2.65 and fluid density 1.0 g/cc, GR clean 20 and clay 120 API, Rw 0.05 ohm.m, a 1, m 2, n 2, and the cutoffs porosity 0.08, Vsh 0.5 and Sw 0.6), compute Vsh (Larionov tertiary), density porosity and Archie water saturation, apply the cutoffs, and report the net pay, average porosity and average Sw for SAND_A and for SAND_B.',
           dataset = 'IKPO-3 capstone well (ikpo3.las, downloaded from the capstone card) with the course given parameters',
           fields = '[{"key": "ikpo3_sand_a_net_m", "tol": 0.75, "unit": "m", "label": "IKPO-3 SAND_A net pay", "expected": 21}, {"key": "ikpo3_sand_a_phi_avg", "tol": 0.01, "unit": "v/v", "label": "IKPO-3 SAND_A average porosity", "expected": 0.2760532518141886}, {"key": "ikpo3_sand_a_sw_avg", "tol": 0.02, "unit": "v/v", "label": "IKPO-3 SAND_A average Sw", "expected": 0.3357171074414596}, {"key": "ikpo3_sand_b_net_m", "tol": 0.75, "unit": "m", "label": "IKPO-3 SAND_B net pay", "expected": 2}, {"key": "ikpo3_sand_b_phi_avg", "tol": 0.01, "unit": "v/v", "label": "IKPO-3 SAND_B average porosity", "expected": 0.18175000132936417}, {"key": "ikpo3_sand_b_sw_avg", "tol": 0.02, "unit": "v/v", "label": "IKPO-3 SAND_B average Sw", "expected": 0.5828123287408515}]'::jsonb
     where app_slug = 'petrophysics' and tier = 'beginner' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w5c petrophysics refused: petrophysics/beginner updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = 'e41f96a10a3fb40ad14a2b55c1bcad30' and md5(dataset) = 'e8c60f0c7eac646afb90df536bda8ac3' and fields = '[{"key": "ikpo3_sand_a_net_m", "tol": 0.75, "unit": "m", "label": "IKPO-3 SAND_A net pay", "expected": 21}, {"key": "ikpo3_sand_a_phi_avg", "tol": 0.01, "unit": "v/v", "label": "IKPO-3 SAND_A average porosity", "expected": 0.2760532518141886}, {"key": "ikpo3_sand_a_sw_avg", "tol": 0.02, "unit": "v/v", "label": "IKPO-3 SAND_A average Sw", "expected": 0.3357171074414596}, {"key": "ikpo3_sand_b_net_m", "tol": 0.75, "unit": "m", "label": "IKPO-3 SAND_B net pay", "expected": 2}, {"key": "ikpo3_sand_b_phi_avg", "tol": 0.01, "unit": "v/v", "label": "IKPO-3 SAND_B average porosity", "expected": 0.18175000132936417}, {"key": "ikpo3_sand_b_sw_avg", "tol": 0.02, "unit": "v/v", "label": "IKPO-3 SAND_B average Sw", "expected": 0.5828123287408515}]'::jsonb) from public.academy_capstones where app_slug = 'petrophysics' and tier = 'beginner' and active) is not true then
    raise exception 'w5c petrophysics refused: petrophysics/beginner does not read back as its W5 form';
  end if;

  if v_s1 = 'old' then
    update public.academy_capstones
       set prompt = 'The IKPO-3 well: download its LAS file from the capstone card and open it in the app with Open a LAS file, with SAND_A from 1712 to 1734 m, SAND_B from 1752 to 1781 m and the water leg from 1776 to 1779 m. Using the course''s given parameters (matrix density 2.65 and fluid density 1.0 g/cc, sonic matrix 182 and fluid 656 us/m, GR clean 20 and clay 120 API, Rw 0.05 and Rsh 2 ohm.m, a 1, m 2, n 2): compute neutron-density (average) and Wyllie sonic porosity, fit a Pickett line over 1773 to 1779 m, a window that starts three metres above the water leg, and evaluate Simandoux and Indonesia water saturation with linear Vsh. Report the SAND_A zone means and the Pickett fit over 1773 to 1779 m.',
           dataset = 'IKPO-3 capstone well (ikpo3.las, downloaded from the capstone card) with the course given parameters',
           fields = '[{"key": "ikpo3_phind_avg_sand_a", "tol": 0.002, "unit": "v/v", "label": "IKPO-3 SAND_A mean neutron-density porosity", "expected": 0.220804395724828}, {"key": "ikpo3_phiw_avg_sand_a", "tol": 0.002, "unit": "v/v", "label": "IKPO-3 SAND_A mean Wyllie sonic porosity", "expected": 0.24152554540191523}, {"key": "ikpo3_pickett_a_rw", "tol": 0.002, "unit": "Ω·m", "label": "IKPO-3 Pickett fit over 1773 to 1779 m: a·Rw", "expected": 0.5256574094251089}, {"key": "ikpo3_pickett_m", "tol": 0.0002, "unit": "-", "label": "IKPO-3 Pickett fit over 1773 to 1779 m: cementation exponent m", "expected": 0.8502948473840143}, {"key": "ikpo3_sw_sim_sand_a", "tol": 0.01, "unit": "v/v", "label": "IKPO-3 SAND_A mean Sw (Simandoux)", "expected": 0.41662897913099867}, {"key": "ikpo3_sw_ind_sand_a", "tol": 0.01, "unit": "v/v", "label": "IKPO-3 SAND_A mean Sw (Indonesia)", "expected": 0.41326832744212}]'::jsonb
     where app_slug = 'petrophysics' and tier = 'intermediate' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w5c petrophysics refused: petrophysics/intermediate updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = '5768a6a23d23826c94ef328fa87f2748' and md5(dataset) = 'e8c60f0c7eac646afb90df536bda8ac3' and fields = '[{"key": "ikpo3_phind_avg_sand_a", "tol": 0.002, "unit": "v/v", "label": "IKPO-3 SAND_A mean neutron-density porosity", "expected": 0.220804395724828}, {"key": "ikpo3_phiw_avg_sand_a", "tol": 0.002, "unit": "v/v", "label": "IKPO-3 SAND_A mean Wyllie sonic porosity", "expected": 0.24152554540191523}, {"key": "ikpo3_pickett_a_rw", "tol": 0.002, "unit": "Ω·m", "label": "IKPO-3 Pickett fit over 1773 to 1779 m: a·Rw", "expected": 0.5256574094251089}, {"key": "ikpo3_pickett_m", "tol": 0.0002, "unit": "-", "label": "IKPO-3 Pickett fit over 1773 to 1779 m: cementation exponent m", "expected": 0.8502948473840143}, {"key": "ikpo3_sw_sim_sand_a", "tol": 0.01, "unit": "v/v", "label": "IKPO-3 SAND_A mean Sw (Simandoux)", "expected": 0.41662897913099867}, {"key": "ikpo3_sw_ind_sand_a", "tol": 0.01, "unit": "v/v", "label": "IKPO-3 SAND_A mean Sw (Indonesia)", "expected": 0.41326832744212}]'::jsonb) from public.academy_capstones where app_slug = 'petrophysics' and tier = 'intermediate' and active) is not true then
    raise exception 'w5c petrophysics refused: petrophysics/intermediate does not read back as its W5 form';
  end if;

  if v_s2 = 'old' then
    update public.academy_capstones
       set prompt = 'The IKPO-3 well: download its LAS file from the capstone card and open it in the app with Open a LAS file, with SAND_A from 1712 to 1734 m, SAND_B from 1752 to 1781 m and the water leg from 1776 to 1779 m. A lab measured its formation water sample at 0.1128 ohm.m at 72 degF; formation temperature is 172 degF. The SP quicklook reads SSP = -90 mV with Rmfe = 0.6 ohm.m at formation temperature. Correct the sample with Arps, convert the SSP, confirm both against a Pickett fit on the well''s water leg, and validate in the water leg. Then book SAND_A twice with the course''s Associate recipe and given parameters: with the corrected Rw and with the raw sample value, and watch what the wrong Rw does to pay.',
           dataset = 'IKPO-3 capstone well (ikpo3.las) + its lab water sample and SP reading, stated in the brief',
           fields = '[{"key": "ikpo3_rw_arps", "tol": 5e-05, "unit": "ohm.m", "label": "IKPO-3 sample Rw at formation temperature (Arps)", "expected": 0.049702164792750456}, {"key": "ikpo3_rwe_ssp", "tol": 5e-05, "unit": "ohm.m", "label": "IKPO-3 Rwe from the SP quicklook", "expected": 0.05071526604329182}, {"key": "ikpo3_sw_waterleg_mean", "tol": 0.0005, "unit": "v/v", "label": "IKPO-3 water-leg mean Sw with the Arps Rw", "expected": 0.9970190768360505}, {"key": "ikpo3_sand_a_net_arps", "tol": 0.01, "unit": "m", "label": "IKPO-3 SAND_A net pay with the Arps Rw", "expected": 21}, {"key": "ikpo3_sand_a_sw_avg_arps", "tol": 0.005, "unit": "v/v", "label": "IKPO-3 SAND_A pay-average Sw with the Arps Rw", "expected": 0.33471573024447604}, {"key": "ikpo3_sand_a_net_uncorrected", "tol": 0.01, "unit": "m", "label": "IKPO-3 SAND_A net pay with the raw sample Rw", "expected": 20}]'::jsonb
     where app_slug = 'petrophysics' and tier = 'advanced' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w5c petrophysics refused: petrophysics/advanced updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = '58c32f37ee9d8312154c2dfb8b21f8e2' and md5(dataset) = '5978885aeea124fec24e65aab45b43cd' and fields = '[{"key": "ikpo3_rw_arps", "tol": 5e-05, "unit": "ohm.m", "label": "IKPO-3 sample Rw at formation temperature (Arps)", "expected": 0.049702164792750456}, {"key": "ikpo3_rwe_ssp", "tol": 5e-05, "unit": "ohm.m", "label": "IKPO-3 Rwe from the SP quicklook", "expected": 0.05071526604329182}, {"key": "ikpo3_sw_waterleg_mean", "tol": 0.0005, "unit": "v/v", "label": "IKPO-3 water-leg mean Sw with the Arps Rw", "expected": 0.9970190768360505}, {"key": "ikpo3_sand_a_net_arps", "tol": 0.01, "unit": "m", "label": "IKPO-3 SAND_A net pay with the Arps Rw", "expected": 21}, {"key": "ikpo3_sand_a_sw_avg_arps", "tol": 0.005, "unit": "v/v", "label": "IKPO-3 SAND_A pay-average Sw with the Arps Rw", "expected": 0.33471573024447604}, {"key": "ikpo3_sand_a_net_uncorrected", "tol": 0.01, "unit": "m", "label": "IKPO-3 SAND_A net pay with the raw sample Rw", "expected": 20}]'::jsonb) from public.academy_capstones where app_slug = 'petrophysics' and tier = 'advanced' and active) is not true then
    raise exception 'w5c petrophysics refused: petrophysics/advanced does not read back as its W5 form';
  end if;

  raise notice 'w5c petrophysics: % of 3 row(s) written, % already applied', v_written, 3 - v_written;
end $$;
