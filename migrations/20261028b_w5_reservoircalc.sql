-- ============================================================================
-- B5 FOLLOW-ON W5B (leak re-case and strip): reservoircalc.
--
-- Plan of record: docs/graded-field-audit/FOLLOW-ON-PROGRAMME.md section 3
-- (D4 A and B, D5). Spec: docs/graded-field-audit/w5/reservoircalc.json. The new
-- keys come from docs/graded-field-audit/w5b/reservoircalc.fields.json,
-- written by the course's engine generator and re-checked in CI.
--
-- BEGINNER: pick A (re-case)
--   The walkthrough printed all six answers and the volume explorer opened on
--   the 1560 m contact with the capstone properties, so every field could be
--   read before any work. Re-cased on a 1563 m contact with NTG 0.72, porosity
--   0.22, Sw 0.25 and Bo 1.25, which the learner types; no panel opens there and
--   no lesson prints the results.
--   oil_cells (169, tol 0)
--       -> oil_cells 'Oil-bearing grid cells' count, expected 177, tol 0.0
--   max_oil_column_m (20.2818603515625, tol 0.1)
--       -> max_oil_column_m 'Maximum oil column' m, expected 23.2818603515625, tol 0.1
--   grv_mm3 (22.26903564453125, tol 0.05)
--       -> grv_mm3 'Gross rock volume' 10^6 m3, expected 27.46473388671875, tol 0.05
--   pore_mm3 (3.563045809312045, tol 0.01)
--       -> pore_mm3 'Pore volume' 10^6 m3, expected 4.350413996952986, tol 0.01
--   hcpv_mm3 (2.3159797972902343, tol 0.01)
--       -> hcpv_mm3 'Hydrocarbon pore volume' 10^6 m3, expected 3.262810497714745, tol 0.01
--   stoiip_mmstb (12.139208107496763, tol 0.05)
--       -> stoiip_mmstb 'STOIIP' MMstb, expected 16.41794037482096, tol 0.05
--   DATASET was: reservoircalc/ekene-sand-owc
--   DATASET now: reservoircalc/ekene-sand-owc-1563
--   PROMPT now: An appraisal pressure survey moves the Ekene SAND oil-water
--   contact to 1563 m, and new core puts the properties at NTG 0.72, porosity
--   0.22, Sw 0.25 and Bo 1.25 rb/stb. Type that case into the volume explorer
--   (the panel opens on the teaching case, so change every input) and report the
--   oil-bearing cell count, the maximum oil column, the gross rock volume, the
--   pore volume, the hydrocarbon pore volume and the STOIIP.
--
-- INTERMEDIATE: pick A (re-case)
--   The walkthrough printed all six answers and the block explorer opened on the
--   1800 m fault with both contacts at 1560 m. Re-cased on a fault at 2100 m
--   with block contacts of 1553 m west and 1572 m east, which the learner types.
--   west_cells (117, tol 0)
--       -> west_cells 'West block: oil-bearing cells' count, expected 146, tol 0.0
--   east_cells (52, tol 0)
--       -> east_cells 'East block: oil-bearing cells' count, expected 37, tol 0.0
--   west_grv_mm3 (18.079852294921874, tol 0.05)
--       -> west_grv_mm3 'West block: gross rock volume' 10^6 m3, expected 11.219761962890624, tol 0.05
--   east_grv_mm3 (4.189183349609375, tol 0.02)
--       -> east_grv_mm3 'East block: gross rock volume' 10^6 m3, expected 3.813426513671875, tol 0.02
--   west_stoiip_mmstb (9.85561714769438, tol 0.05)
--       -> west_stoiip_mmstb 'West block: STOIIP' MMstb, expected 6.116072000520286, tol 0.05
--   east_stoiip_mmstb (2.2835909598023787, tol 0.02)
--       -> east_stoiip_mmstb 'East block: STOIIP' MMstb, expected 2.078759888440742, tol 0.02
--   DATASET was: reservoircalc/ekene-fault-blocks
--   DATASET now: reservoircalc/ekene-fault-blocks-2100
--   PROMPT now: A sealing fault at x = 2100 m splits the Ekene SAND into a west
--   and an east block, and the two blocks carry different contacts: 1553 m in
--   the west and 1572 m in the east. Properties are the course's (NTG 0.8,
--   porosity 0.20, Sw 0.35, Bo 1.2). Type that case into the block explorer (it
--   opens on the teaching case) and report each block's oil-bearing cell count,
--   gross rock volume and STOIIP.
--
-- ADVANCED: pick A (re-case)
--   The walkthrough printed all six answers and the property explorer opened on
--   the capstone trend at 1560 m. Re-cased on six new well porosities and a 1562
--   m contact, which the learner types.
--   phi_at_p1 (0.20714187889686578, tol 0.001)
--       -> phi_at_p1 'Trend porosity at P-1' v/v, expected 0.2335680276477857, tol 0.001
--   phi_mean_oil (0.20936760570720417, tol 0.0002)
--       -> phi_mean_oil 'Mean trend porosity over oil nodes' v/v, expected 0.2363793013067084, tol 0.0002
--   pore_trend_mm3 (3.7558468705687864, tol 0.02)
--       -> pore_trend_mm3 'Pore volume, trend model' 10^6 m3, expected 4.9149173123359065, tol 0.02
--   hcpv_trend_mm3 (2.4413004882563025, tol 0.02)
--       -> hcpv_trend_mm3 'HCPV, trend model' 10^6 m3, expected 3.194696282313528, tol 0.02
--   stoiip_trend_mmstb (12.79607650919541, tol 0.05)
--       -> stoiip_trend_mmstb 'STOIIP, trend model' MMstb, expected 16.74500056374636, tol 0.05
--   stoiip_delta_mmstb (0.656868401698647, tol 0.02)
--       -> stoiip_delta_mmstb 'STOIIP added over the constant model' MMstb, expected 2.728495924102713, tol 0.02
--   DATASET was: reservoircalc/ekene-property-model
--   DATASET now: reservoircalc/ekene-property-model-1562
--   PROMPT now: Re-logging the six Ekene wells gives new porosities: 0.25, 0.20,
--   0.26, 0.18, 0.24 and 0.27 for Ekene-1 to Ekene-6, and the contact is 1562 m.
--   Fit the porosity trend plane to those values with the population engine and
--   rerun the volumetrics (NTG 0.8, Sw 0.35, Bo 1.2). Type the case into the
--   property explorer (it opens on the teaching case) and report the trend
--   porosity at prospect P-1 and its mean over the oil-bearing nodes, the pore
--   volume and HCPV, the STOIIP, and how much the trend model adds over a
--   constant porosity of 0.20 at the same contact.
--
-- ATTEMPTS. Tiers whose graded keys move: reservoircalc/beginner,
-- reservoircalc/intermediate, reservoircalc/advanced. Before it writes, the
-- file counts academy_capstone_attempts on each and REFUSES if any exist,
-- unless D5 allowlists that tier with the exact attempt ids (allowlist:
-- empty). Stored scores are never touched.
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
  -- reservoircalc / beginner
  select count(*) into v_n from public.academy_capstones where app_slug = 'reservoircalc' and tier = 'beginner' and active;
  if v_n <> 1 then raise exception 'w5b reservoircalc refused: reservoircalc/beginner has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = '4bc947fef7483edc3eef1d3fff8cc179' and md5(coalesce(title, '')) = 'f9530e837095101502c25cb50486aa70' and md5(coalesce(dataset, '')) = 'd3d4911425eddb9e38da49bbbd0e3a29' and fields = '[{"key": "oil_cells", "tol": 0, "unit": "count", "label": "Oil-bearing grid cells", "expected": 169}, {"key": "max_oil_column_m", "tol": 0.1, "unit": "m", "label": "Maximum oil column", "expected": 20.2818603515625}, {"key": "grv_mm3", "tol": 0.05, "unit": "10^6 m3", "label": "Gross rock volume", "expected": 22.26903564453125}, {"key": "pore_mm3", "tol": 0.01, "unit": "10^6 m3", "label": "Pore volume", "expected": 3.563045809312045}, {"key": "hcpv_mm3", "tol": 0.01, "unit": "10^6 m3", "label": "Hydrocarbon pore volume", "expected": 2.3159797972902343}, {"key": "stoiip_mmstb", "tol": 0.05, "unit": "MMstb", "label": "STOIIP", "expected": 12.139208107496763}]'::jsonb then 'old'
              when md5(prompt) = '98020f3fa42b94c240072ae4723aaf50' and md5(coalesce(title, '')) = 'f9530e837095101502c25cb50486aa70' and md5(coalesce(dataset, '')) = '1a4bbc3fb6f2a49bc8da499391226c97' and fields = '[{"key": "oil_cells", "tol": 0.0, "unit": "count", "label": "Oil-bearing grid cells", "expected": 177}, {"key": "max_oil_column_m", "tol": 0.1, "unit": "m", "label": "Maximum oil column", "expected": 23.2818603515625}, {"key": "grv_mm3", "tol": 0.05, "unit": "10^6 m3", "label": "Gross rock volume", "expected": 27.46473388671875}, {"key": "pore_mm3", "tol": 0.01, "unit": "10^6 m3", "label": "Pore volume", "expected": 4.350413996952986}, {"key": "hcpv_mm3", "tol": 0.01, "unit": "10^6 m3", "label": "Hydrocarbon pore volume", "expected": 3.262810497714745}, {"key": "stoiip_mmstb", "tol": 0.05, "unit": "MMstb", "label": "STOIIP", "expected": 16.41794037482096}]'::jsonb then 'new'
              else 'other' end
    into v_s0 from public.academy_capstones where app_slug = 'reservoircalc' and tier = 'beginner' and active;
  if v_s0 = 'other' then
    raise exception 'w5b reservoircalc refused: reservoircalc/beginner matches neither its post-W1 form (prompt md5 4bc947fef7483edc3eef1d3fff8cc179) nor its W5 form (prompt md5 98020f3fa42b94c240072ae4723aaf50), with the fields this file was generated against';
  end if;

  -- reservoircalc / intermediate
  select count(*) into v_n from public.academy_capstones where app_slug = 'reservoircalc' and tier = 'intermediate' and active;
  if v_n <> 1 then raise exception 'w5b reservoircalc refused: reservoircalc/intermediate has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = 'de9376047847924f40fa355df6d41e97' and md5(coalesce(title, '')) = '91802cb8b23268b2d5ddd896cf276913' and md5(coalesce(dataset, '')) = '1896f2eb59cce564cf6f1fb2b9708980' and fields = '[{"key": "west_cells", "tol": 0, "unit": "count", "label": "West block: oil-bearing cells", "expected": 117}, {"key": "east_cells", "tol": 0, "unit": "count", "label": "East block: oil-bearing cells", "expected": 52}, {"key": "west_grv_mm3", "tol": 0.05, "unit": "10^6 m3", "label": "West block: gross rock volume", "expected": 18.079852294921874}, {"key": "east_grv_mm3", "tol": 0.02, "unit": "10^6 m3", "label": "East block: gross rock volume", "expected": 4.189183349609375}, {"key": "west_stoiip_mmstb", "tol": 0.05, "unit": "MMstb", "label": "West block: STOIIP", "expected": 9.85561714769438}, {"key": "east_stoiip_mmstb", "tol": 0.02, "unit": "MMstb", "label": "East block: STOIIP", "expected": 2.2835909598023787}]'::jsonb then 'old'
              when md5(prompt) = '3f15caa1fd7ad242898ad0848c99f91d' and md5(coalesce(title, '')) = '91802cb8b23268b2d5ddd896cf276913' and md5(coalesce(dataset, '')) = 'b8b33edffaa3c531f64a357cded9b21d' and fields = '[{"key": "west_cells", "tol": 0.0, "unit": "count", "label": "West block: oil-bearing cells", "expected": 146}, {"key": "east_cells", "tol": 0.0, "unit": "count", "label": "East block: oil-bearing cells", "expected": 37}, {"key": "west_grv_mm3", "tol": 0.05, "unit": "10^6 m3", "label": "West block: gross rock volume", "expected": 11.219761962890624}, {"key": "east_grv_mm3", "tol": 0.02, "unit": "10^6 m3", "label": "East block: gross rock volume", "expected": 3.813426513671875}, {"key": "west_stoiip_mmstb", "tol": 0.05, "unit": "MMstb", "label": "West block: STOIIP", "expected": 6.116072000520286}, {"key": "east_stoiip_mmstb", "tol": 0.02, "unit": "MMstb", "label": "East block: STOIIP", "expected": 2.078759888440742}]'::jsonb then 'new'
              else 'other' end
    into v_s1 from public.academy_capstones where app_slug = 'reservoircalc' and tier = 'intermediate' and active;
  if v_s1 = 'other' then
    raise exception 'w5b reservoircalc refused: reservoircalc/intermediate matches neither its post-W1 form (prompt md5 de9376047847924f40fa355df6d41e97) nor its W5 form (prompt md5 3f15caa1fd7ad242898ad0848c99f91d), with the fields this file was generated against';
  end if;

  -- reservoircalc / advanced
  select count(*) into v_n from public.academy_capstones where app_slug = 'reservoircalc' and tier = 'advanced' and active;
  if v_n <> 1 then raise exception 'w5b reservoircalc refused: reservoircalc/advanced has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = 'd215a0b9b79c54fa53d8069ba84a160f' and md5(coalesce(title, '')) = '9ff3f01c64ce4a552e4606df4c396ba8' and md5(coalesce(dataset, '')) = 'f1c215e75d18caf3c2b2928d99afa859' and fields = '[{"key": "phi_at_p1", "tol": 0.001, "unit": "v/v", "label": "Trend porosity at P-1", "expected": 0.20714187889686578}, {"key": "phi_mean_oil", "tol": 0.0002, "unit": "v/v", "label": "Mean trend porosity over oil nodes", "expected": 0.20936760570720417}, {"key": "pore_trend_mm3", "tol": 0.02, "unit": "10^6 m3", "label": "Pore volume, trend model", "expected": 3.7558468705687864}, {"key": "hcpv_trend_mm3", "tol": 0.02, "unit": "10^6 m3", "label": "HCPV, trend model", "expected": 2.4413004882563025}, {"key": "stoiip_trend_mmstb", "tol": 0.05, "unit": "MMstb", "label": "STOIIP, trend model", "expected": 12.79607650919541}, {"key": "stoiip_delta_mmstb", "tol": 0.02, "unit": "MMstb", "label": "STOIIP added over the constant model", "expected": 0.656868401698647}]'::jsonb then 'old'
              when md5(prompt) = 'a141e43cb1ab87ef2c01bba58b2b2da1' and md5(coalesce(title, '')) = '9ff3f01c64ce4a552e4606df4c396ba8' and md5(coalesce(dataset, '')) = 'df9d4275569a70c131e3986001e59ddd' and fields = '[{"key": "phi_at_p1", "tol": 0.001, "unit": "v/v", "label": "Trend porosity at P-1", "expected": 0.2335680276477857}, {"key": "phi_mean_oil", "tol": 0.0002, "unit": "v/v", "label": "Mean trend porosity over oil nodes", "expected": 0.2363793013067084}, {"key": "pore_trend_mm3", "tol": 0.02, "unit": "10^6 m3", "label": "Pore volume, trend model", "expected": 4.9149173123359065}, {"key": "hcpv_trend_mm3", "tol": 0.02, "unit": "10^6 m3", "label": "HCPV, trend model", "expected": 3.194696282313528}, {"key": "stoiip_trend_mmstb", "tol": 0.05, "unit": "MMstb", "label": "STOIIP, trend model", "expected": 16.74500056374636}, {"key": "stoiip_delta_mmstb", "tol": 0.02, "unit": "MMstb", "label": "STOIIP added over the constant model", "expected": 2.728495924102713}]'::jsonb then 'new'
              else 'other' end
    into v_s2 from public.academy_capstones where app_slug = 'reservoircalc' and tier = 'advanced' and active;
  if v_s2 = 'other' then
    raise exception 'w5b reservoircalc refused: reservoircalc/advanced matches neither its post-W1 form (prompt md5 d215a0b9b79c54fa53d8069ba84a160f) nor its W5 form (prompt md5 a141e43cb1ab87ef2c01bba58b2b2da1), with the fields this file was generated against';
  end if;

  -- nothing to write: every row is already in its W5 form
  if v_s0 = 'new' and v_s1 = 'new' and v_s2 = 'new' then
    raise notice 'w5b reservoircalc: 0 of 3 row(s) written, all already applied';
    return;
  end if;

  -- ATTEMPTS. A tier whose graded keys this file moves must hold no capstone
  -- attempt (a stored score is never re-scored, but a learner could be graded
  -- differently on a retry), unless D5 allowlists it with the exact attempt
  -- ids signed off. Any other attempt refuses.
  if v_s0 = 'old' then
    select coalesce(jsonb_agg(a.id::text order by a.created_at, a.id), '[]'::jsonb) into v_ids
      from public.academy_capstone_attempts a where a.app_slug = 'reservoircalc' and a.tier = 'beginner';
    if jsonb_array_length(v_ids) > 0 then
      if v_allow ? 'reservoircalc/beginner' then
        select coalesce(jsonb_agg(x), '[]'::jsonb) into v_extra
          from jsonb_array_elements(v_ids) x where not (v_allow->'reservoircalc/beginner') @> jsonb_build_array(x);
        if jsonb_array_length(v_extra) > 0 then
          select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_extra) x;
          raise exception 'w5b reservoircalc refused: reservoircalc/beginner holds % attempt(s) outside its D5 allowlist: %', jsonb_array_length(v_extra), v_idtxt;
        end if;
        raise notice 'w5b reservoircalc: reservoircalc/beginner holds % allowlisted attempt(s) (D5 sign-off); their stored scores are not touched', jsonb_array_length(v_ids);
      else
        select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_ids) x;
        raise exception 'w5b reservoircalc refused: reservoircalc/beginner holds % capstone attempt(s) (%) and this file moves its graded keys; sign the tier off under D5 (allowlist with these ids) or hold it', jsonb_array_length(v_ids), v_idtxt;
      end if;
    end if;
  end if;
  if v_s1 = 'old' then
    select coalesce(jsonb_agg(a.id::text order by a.created_at, a.id), '[]'::jsonb) into v_ids
      from public.academy_capstone_attempts a where a.app_slug = 'reservoircalc' and a.tier = 'intermediate';
    if jsonb_array_length(v_ids) > 0 then
      if v_allow ? 'reservoircalc/intermediate' then
        select coalesce(jsonb_agg(x), '[]'::jsonb) into v_extra
          from jsonb_array_elements(v_ids) x where not (v_allow->'reservoircalc/intermediate') @> jsonb_build_array(x);
        if jsonb_array_length(v_extra) > 0 then
          select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_extra) x;
          raise exception 'w5b reservoircalc refused: reservoircalc/intermediate holds % attempt(s) outside its D5 allowlist: %', jsonb_array_length(v_extra), v_idtxt;
        end if;
        raise notice 'w5b reservoircalc: reservoircalc/intermediate holds % allowlisted attempt(s) (D5 sign-off); their stored scores are not touched', jsonb_array_length(v_ids);
      else
        select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_ids) x;
        raise exception 'w5b reservoircalc refused: reservoircalc/intermediate holds % capstone attempt(s) (%) and this file moves its graded keys; sign the tier off under D5 (allowlist with these ids) or hold it', jsonb_array_length(v_ids), v_idtxt;
      end if;
    end if;
  end if;
  if v_s2 = 'old' then
    select coalesce(jsonb_agg(a.id::text order by a.created_at, a.id), '[]'::jsonb) into v_ids
      from public.academy_capstone_attempts a where a.app_slug = 'reservoircalc' and a.tier = 'advanced';
    if jsonb_array_length(v_ids) > 0 then
      if v_allow ? 'reservoircalc/advanced' then
        select coalesce(jsonb_agg(x), '[]'::jsonb) into v_extra
          from jsonb_array_elements(v_ids) x where not (v_allow->'reservoircalc/advanced') @> jsonb_build_array(x);
        if jsonb_array_length(v_extra) > 0 then
          select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_extra) x;
          raise exception 'w5b reservoircalc refused: reservoircalc/advanced holds % attempt(s) outside its D5 allowlist: %', jsonb_array_length(v_extra), v_idtxt;
        end if;
        raise notice 'w5b reservoircalc: reservoircalc/advanced holds % allowlisted attempt(s) (D5 sign-off); their stored scores are not touched', jsonb_array_length(v_ids);
      else
        select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_ids) x;
        raise exception 'w5b reservoircalc refused: reservoircalc/advanced holds % capstone attempt(s) (%) and this file moves its graded keys; sign the tier off under D5 (allowlist with these ids) or hold it', jsonb_array_length(v_ids), v_idtxt;
      end if;
    end if;
  end if;

  if v_s0 = 'old' then
    update public.academy_capstones
       set prompt = 'An appraisal pressure survey moves the Ekene SAND oil-water contact to 1563 m, and new core puts the properties at NTG 0.72, porosity 0.22, Sw 0.25 and Bo 1.25 rb/stb. Type that case into the volume explorer (the panel opens on the teaching case, so change every input) and report the oil-bearing cell count, the maximum oil column, the gross rock volume, the pore volume, the hydrocarbon pore volume and the STOIIP.',
           title = 'Volumes of the Ekene SAND accumulation',
           dataset = 'reservoircalc/ekene-sand-owc-1563',
           fields = '[{"key": "oil_cells", "tol": 0.0, "unit": "count", "label": "Oil-bearing grid cells", "expected": 177}, {"key": "max_oil_column_m", "tol": 0.1, "unit": "m", "label": "Maximum oil column", "expected": 23.2818603515625}, {"key": "grv_mm3", "tol": 0.05, "unit": "10^6 m3", "label": "Gross rock volume", "expected": 27.46473388671875}, {"key": "pore_mm3", "tol": 0.01, "unit": "10^6 m3", "label": "Pore volume", "expected": 4.350413996952986}, {"key": "hcpv_mm3", "tol": 0.01, "unit": "10^6 m3", "label": "Hydrocarbon pore volume", "expected": 3.262810497714745}, {"key": "stoiip_mmstb", "tol": 0.05, "unit": "MMstb", "label": "STOIIP", "expected": 16.41794037482096}]'::jsonb
     where app_slug = 'reservoircalc' and tier = 'beginner' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w5b reservoircalc refused: reservoircalc/beginner updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = '98020f3fa42b94c240072ae4723aaf50' and md5(coalesce(title, '')) = 'f9530e837095101502c25cb50486aa70' and md5(coalesce(dataset, '')) = '1a4bbc3fb6f2a49bc8da499391226c97' and fields = '[{"key": "oil_cells", "tol": 0.0, "unit": "count", "label": "Oil-bearing grid cells", "expected": 177}, {"key": "max_oil_column_m", "tol": 0.1, "unit": "m", "label": "Maximum oil column", "expected": 23.2818603515625}, {"key": "grv_mm3", "tol": 0.05, "unit": "10^6 m3", "label": "Gross rock volume", "expected": 27.46473388671875}, {"key": "pore_mm3", "tol": 0.01, "unit": "10^6 m3", "label": "Pore volume", "expected": 4.350413996952986}, {"key": "hcpv_mm3", "tol": 0.01, "unit": "10^6 m3", "label": "Hydrocarbon pore volume", "expected": 3.262810497714745}, {"key": "stoiip_mmstb", "tol": 0.05, "unit": "MMstb", "label": "STOIIP", "expected": 16.41794037482096}]'::jsonb) from public.academy_capstones where app_slug = 'reservoircalc' and tier = 'beginner' and active) is not true then
    raise exception 'w5b reservoircalc refused: reservoircalc/beginner does not read back as its W5 form';
  end if;

  if v_s1 = 'old' then
    update public.academy_capstones
       set prompt = 'A sealing fault at x = 2100 m splits the Ekene SAND into a west and an east block, and the two blocks carry different contacts: 1553 m in the west and 1572 m in the east. Properties are the course''s (NTG 0.8, porosity 0.20, Sw 0.35, Bo 1.2). Type that case into the block explorer (it opens on the teaching case) and report each block''s oil-bearing cell count, gross rock volume and STOIIP.',
           title = 'Fault-block volumes of the Ekene SAND',
           dataset = 'reservoircalc/ekene-fault-blocks-2100',
           fields = '[{"key": "west_cells", "tol": 0.0, "unit": "count", "label": "West block: oil-bearing cells", "expected": 146}, {"key": "east_cells", "tol": 0.0, "unit": "count", "label": "East block: oil-bearing cells", "expected": 37}, {"key": "west_grv_mm3", "tol": 0.05, "unit": "10^6 m3", "label": "West block: gross rock volume", "expected": 11.219761962890624}, {"key": "east_grv_mm3", "tol": 0.02, "unit": "10^6 m3", "label": "East block: gross rock volume", "expected": 3.813426513671875}, {"key": "west_stoiip_mmstb", "tol": 0.05, "unit": "MMstb", "label": "West block: STOIIP", "expected": 6.116072000520286}, {"key": "east_stoiip_mmstb", "tol": 0.02, "unit": "MMstb", "label": "East block: STOIIP", "expected": 2.078759888440742}]'::jsonb
     where app_slug = 'reservoircalc' and tier = 'intermediate' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w5b reservoircalc refused: reservoircalc/intermediate updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = '3f15caa1fd7ad242898ad0848c99f91d' and md5(coalesce(title, '')) = '91802cb8b23268b2d5ddd896cf276913' and md5(coalesce(dataset, '')) = 'b8b33edffaa3c531f64a357cded9b21d' and fields = '[{"key": "west_cells", "tol": 0.0, "unit": "count", "label": "West block: oil-bearing cells", "expected": 146}, {"key": "east_cells", "tol": 0.0, "unit": "count", "label": "East block: oil-bearing cells", "expected": 37}, {"key": "west_grv_mm3", "tol": 0.05, "unit": "10^6 m3", "label": "West block: gross rock volume", "expected": 11.219761962890624}, {"key": "east_grv_mm3", "tol": 0.02, "unit": "10^6 m3", "label": "East block: gross rock volume", "expected": 3.813426513671875}, {"key": "west_stoiip_mmstb", "tol": 0.05, "unit": "MMstb", "label": "West block: STOIIP", "expected": 6.116072000520286}, {"key": "east_stoiip_mmstb", "tol": 0.02, "unit": "MMstb", "label": "East block: STOIIP", "expected": 2.078759888440742}]'::jsonb) from public.academy_capstones where app_slug = 'reservoircalc' and tier = 'intermediate' and active) is not true then
    raise exception 'w5b reservoircalc refused: reservoircalc/intermediate does not read back as its W5 form';
  end if;

  if v_s2 = 'old' then
    update public.academy_capstones
       set prompt = 'Re-logging the six Ekene wells gives new porosities: 0.25, 0.20, 0.26, 0.18, 0.24 and 0.27 for Ekene-1 to Ekene-6, and the contact is 1562 m. Fit the porosity trend plane to those values with the population engine and rerun the volumetrics (NTG 0.8, Sw 0.35, Bo 1.2). Type the case into the property explorer (it opens on the teaching case) and report the trend porosity at prospect P-1 and its mean over the oil-bearing nodes, the pore volume and HCPV, the STOIIP, and how much the trend model adds over a constant porosity of 0.20 at the same contact.',
           title = 'Property-model the Ekene SAND',
           dataset = 'reservoircalc/ekene-property-model-1562',
           fields = '[{"key": "phi_at_p1", "tol": 0.001, "unit": "v/v", "label": "Trend porosity at P-1", "expected": 0.2335680276477857}, {"key": "phi_mean_oil", "tol": 0.0002, "unit": "v/v", "label": "Mean trend porosity over oil nodes", "expected": 0.2363793013067084}, {"key": "pore_trend_mm3", "tol": 0.02, "unit": "10^6 m3", "label": "Pore volume, trend model", "expected": 4.9149173123359065}, {"key": "hcpv_trend_mm3", "tol": 0.02, "unit": "10^6 m3", "label": "HCPV, trend model", "expected": 3.194696282313528}, {"key": "stoiip_trend_mmstb", "tol": 0.05, "unit": "MMstb", "label": "STOIIP, trend model", "expected": 16.74500056374636}, {"key": "stoiip_delta_mmstb", "tol": 0.02, "unit": "MMstb", "label": "STOIIP added over the constant model", "expected": 2.728495924102713}]'::jsonb
     where app_slug = 'reservoircalc' and tier = 'advanced' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w5b reservoircalc refused: reservoircalc/advanced updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = 'a141e43cb1ab87ef2c01bba58b2b2da1' and md5(coalesce(title, '')) = '9ff3f01c64ce4a552e4606df4c396ba8' and md5(coalesce(dataset, '')) = 'df9d4275569a70c131e3986001e59ddd' and fields = '[{"key": "phi_at_p1", "tol": 0.001, "unit": "v/v", "label": "Trend porosity at P-1", "expected": 0.2335680276477857}, {"key": "phi_mean_oil", "tol": 0.0002, "unit": "v/v", "label": "Mean trend porosity over oil nodes", "expected": 0.2363793013067084}, {"key": "pore_trend_mm3", "tol": 0.02, "unit": "10^6 m3", "label": "Pore volume, trend model", "expected": 4.9149173123359065}, {"key": "hcpv_trend_mm3", "tol": 0.02, "unit": "10^6 m3", "label": "HCPV, trend model", "expected": 3.194696282313528}, {"key": "stoiip_trend_mmstb", "tol": 0.05, "unit": "MMstb", "label": "STOIIP, trend model", "expected": 16.74500056374636}, {"key": "stoiip_delta_mmstb", "tol": 0.02, "unit": "MMstb", "label": "STOIIP added over the constant model", "expected": 2.728495924102713}]'::jsonb) from public.academy_capstones where app_slug = 'reservoircalc' and tier = 'advanced' and active) is not true then
    raise exception 'w5b reservoircalc refused: reservoircalc/advanced does not read back as its W5 form';
  end if;

  raise notice 'w5b reservoircalc: % of 3 row(s) written, % already applied', v_written, 3 - v_written;
end $$;
