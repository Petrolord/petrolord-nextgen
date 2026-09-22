-- ============================================================================
-- B5 FOLLOW-ON W5A (leak re-case and strip): basin.
--
-- Plan of record: docs/graded-field-audit/FOLLOW-ON-PROGRAMME.md section 3
-- (D4 A and B, D5). Spec: docs/graded-field-audit/w5/basin.json. The new
-- keys come from tools/course-waves/w5/basin/fields.json,
-- written by the course's engine generator and re-checked in CI.
--
-- BEGINNER: pick A (re-case)
--   Every field leaked: the walkthrough and the burial and heat lessons printed
--   them and the burial and heat explorer opened on the capstone shale and heat
--   column. The capstone moves to a sandstone at its own depths and a heat
--   column of its own, typed into the explorer (the heat column is now a typed
--   input).
--   solid_100 (38.57953418711555, tol 0.05)
--       -> nkpor_solid_sst_1700 'Solid thickness in 100 m of sandstone at 1700 m' m, expected 69.45042808472611, tol 0.005
--   restored (159.79553483785466, tol 0.05)
--       -> nkpor_restored_sst_1700 '100 m sandstone from 1700 m, restored to surface' m, expected 133.88023365817557, tol 0.005
--   phi_2000 (0.22717481230903933, tol 0.001)
--       -> nkpor_phi_sst_2600 'Sandstone porosity at 2600 m' v/v, expected 0.2428406315893992, tol 0.0001
--   t_first (11.666666666666671, tol 0.05)
--       -> nkpor_t_first 'Temperature at the first cell (50 m)' degC, expected 13.625, tol 0.005
--   t_lowk_base (41.66666666666673, tol 0.05)
--       -> nkpor_t_lowk_base 'Temperature at the low-k base (950 m)' degC, expected 42.87500000000002, tol 0.005
--   t_deepest (59.619047619047684, tol 0.05)
--       -> nkpor_t_deepest 'Temperature at the deepest cell (1950 m)' degC, expected 63.796875000000036, tol 0.005
--   TITLE was: Burial and heat on the golden fixtures
--   TITLE now: Burial and heat: the NKPOR case
--   DATASET was: basin/goldens (decompaction + steady heat column)
--   DATASET now: basin/NKPOR sandstone and heat column (W5 re-case; every input
--   is stated in the brief)
--   PROMPT now: Work the NKPOR compaction and heat case. For sandstone on the
--   Sclater-Christie curve (the course's sandstone parameters): the solid
--   (grain) thickness inside 100 m of sandstone buried at 1700 m; that same 100
--   m restored from 1700 m to the surface; and sandstone porosity at 2600 m.
--   Then the NKPOR steady two-layer heat column (12 C surface, 65 mW/m2 basal, k
--   2.0 over k 3.2, two 1000 m layers of ten 100 m cells each): the temperature
--   at the first cell (50 m), at the base of the low-conductivity layer (950 m),
--   and at the deepest cell (1950 m). Type the case into the burial and heat
--   explorer (it opens on the golden shale and heat column, which are the
--   teaching case).
--
-- INTERMEDIATE: pick A (re-case)
--   Every field leaked: the walkthrough and the kinetics lessons printed them
--   and the kinetics explorer opened on the capstone ramps and clock; Ro at zero
--   and at full reaction are model constants no case can move, so they give way
--   to a third ramp reading. The capstone moves to ramps, read temperatures and
--   a clock temperature of its own, typed into the kinetics explorer (a typed
--   ramp is new).
--   ro_f0 (0.20189651799465538, tol 0.001)
--       -> nkpor_ro_145_r2 'Ro at 145 C on the 2 C/Ma ramp' %Ro, expected 0.9484725312807094, tol 0.0005
--   ro_full (4.687971627022019, tol 0.005)
--       -> nkpor_ro_165_r2 'Ro at 165 C on the 2 C/Ma ramp' %Ro, expected 1.2861150761240832, tol 0.0005
--   ro_150_r3 (0.9871413464062039, tol 0.002)
--       -> nkpor_ro_165_r5 'Ro at 165 C on the 5 C/Ma ramp' %Ro, expected 1.1764945675571294, tol 0.0005
--   ro_150_r1 (1.1129254516555198, tol 0.002)
--       -> nkpor_tr1_135_100 'Type I TR after 100 Ma at 135 C' frac, expected 0.6414954483503965, tol 0.0001
--   tr_10 (0.022481215976523083, tol 0.0005)
--       -> nkpor_tr2_135_100 'Type II TR after 100 Ma at 135 C' frac, expected 0.41450323436925496, tol 0.0001
--   tr_50 (0.05477927380797565, tol 0.0005)
--       -> nkpor_tr3_135_100 'Type III TR after 100 Ma at 135 C' frac, expected 0.062367273402499146, tol 0.0001
--   TITLE was: Maturity kinetics: the clock and the thermometer
--   TITLE now: Maturity kinetics: the NKPOR ramps and clock
--   DATASET was: basin/goldens (Easy%Ro ramps + isothermal kerogen TR)
--   DATASET now: basin/NKPOR heating ramps and isothermal clock (W5 re-case;
--   every input is stated in the brief)
--   PROMPT now: Run the Sweeney-Burnham Easy%Ro integrator on the NKPOR heating
--   ramps: Ro at 145 C and at 165 C on a 2 C/Ma ramp, and Ro at 165 C on a 5
--   C/Ma ramp (each ramp from 20 C, reported at whole degrees). Then run the
--   isothermal kerogen clock at 135 C and report the transformation ratio after
--   100 Ma for Type I, Type II and Type III kerogen. Type the rates, the read
--   temperatures and the clock temperature into the kinetics explorer (it opens
--   on the golden 3 C/Ma ramp and the Type II clock at 100 C, which are the
--   teaching case).
--
-- ADVANCED: pick A (re-case)
--   Every field leaked: the walkthrough and the charge lessons printed them and
--   the charge explorer opened on the capstone event. The capstone moves to an
--   erosion event of its own, 760 m at 20 Ma, typed into the charge explorer
--   (the event age is now a typed input). The present-day source temperature is
--   set by present burial and heat flow and barely moves with the event (it
--   matches the teaching value within its old tolerance), so it gives way to the
--   peak temperature over the source history.
--   final_ro (1.6718288798752388, tol 0.002)
--       -> nkpor_final_ro 'Source rock final Ro' %Ro, expected 2.158320921604062, tol 0.0005
--   final_temp (149.76037539670858, tol 0.1)
--       -> nkpor_peak_temp 'Source rock peak temperature' degC, expected 187.13248934890527, tol 0.01
--   final_tr (0.7423743797385286, tol 0.002)
--       -> nkpor_final_tr 'Final transformation ratio' frac, expected 0.889910987289655, tol 0.0005
--   generated (13946.54641524398, tol 5)
--       -> nkpor_generated 'Generated mass at present day' kg/m2, expected 16718.22900736702, tol 0.5
--   expelled (10048.985378825158, tol 5)
--       -> nkpor_expelled 'Expelled mass at present day' kg/m2, expected 13077.581219764983, tol 0.5
--   ro_delta (0.05665081052235643, tol 0.001)
--       -> nkpor_ro_delta 'Erosion signature (delta Ro vs no-erosion run)' %Ro, expected 0.5431428522511799, tol 0.0005
--   TITLE was: The kitchen and the erosion signature
--   TITLE now: The kitchen and the erosion signature: the NKPOR event
--   DATASET was: basin/goldens (the reference basin, run twice)
--   DATASET now: basin/reference basin with the NKPOR erosion event, run twice
--   (W5 re-case; the event is stated in the brief)
--   PROMPT now: Run the full forward model on the golden reference basin (four
--   layers over 150 Ma, cooling 80 to 60 mW/m2 heat flow) with the NKPOR erosion
--   event in place of the reference one: 760 m of erosion at 20 Ma. Read the
--   source shale: its final reflectance, its peak temperature over the whole
--   history, its final transformation ratio, and the generated and expelled mass
--   at present day. Then rerun WITHOUT the erosion event and report the erosion
--   signature, the difference in final Ro between the two runs. Type the event
--   into the charge explorer (it opens on the reference event, 600 m at 10 Ma,
--   which is the teaching case).
--
-- ATTEMPTS. Tiers whose graded keys move: basin/beginner, basin/intermediate,
-- basin/advanced. Before it writes, the file counts academy_capstone_attempts
-- on each and REFUSES if any exist, unless D5 allowlists that tier with the
-- exact attempt ids (allowlist: empty). Stored scores are never touched.
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
  -- basin / beginner
  select count(*) into v_n from public.academy_capstones where app_slug = 'basin' and tier = 'beginner' and active;
  if v_n <> 1 then raise exception 'w5a basin refused: basin/beginner has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = '844a4224438738a8982ca478e1264f63' and md5(coalesce(title, '')) = 'fee5622a8c1b62ab4ea31333500f5111' and md5(coalesce(dataset, '')) = '4e5649efe70f150a9394c592025943be' and fields = '[{"key": "solid_100", "tol": 0.05, "unit": "m", "label": "Solid thickness in 100 m of surface shale", "expected": 38.57953418711555}, {"key": "restored", "tol": 0.05, "unit": "m", "label": "100 m shale from 1000 m, restored to surface", "expected": 159.79553483785466}, {"key": "phi_2000", "tol": 0.001, "unit": "v/v", "label": "Shale porosity at 2000 m", "expected": 0.22717481230903933}, {"key": "t_first", "tol": 0.05, "unit": "degC", "label": "Temperature at the first cell (50 m)", "expected": 11.666666666666671}, {"key": "t_lowk_base", "tol": 0.05, "unit": "degC", "label": "Temperature at the low-k base (950 m)", "expected": 41.66666666666673}, {"key": "t_deepest", "tol": 0.05, "unit": "degC", "label": "Temperature at the deepest cell (1950 m)", "expected": 59.619047619047684}]'::jsonb then 'old'
              when md5(prompt) = 'ce090d7c10a7eddbcb0a5491e5834a16' and md5(coalesce(title, '')) = 'dd4c0f09fe08dfcc2c1a975b9625c1e5' and md5(coalesce(dataset, '')) = 'df49e2b30cb7c9fc1e01abf6d06d16ba' and fields = '[{"key": "nkpor_solid_sst_1700", "tol": 0.005, "unit": "m", "label": "Solid thickness in 100 m of sandstone at 1700 m", "expected": 69.45042808472611}, {"key": "nkpor_restored_sst_1700", "tol": 0.005, "unit": "m", "label": "100 m sandstone from 1700 m, restored to surface", "expected": 133.88023365817557}, {"key": "nkpor_phi_sst_2600", "tol": 0.0001, "unit": "v/v", "label": "Sandstone porosity at 2600 m", "expected": 0.2428406315893992}, {"key": "nkpor_t_first", "tol": 0.005, "unit": "degC", "label": "Temperature at the first cell (50 m)", "expected": 13.625}, {"key": "nkpor_t_lowk_base", "tol": 0.005, "unit": "degC", "label": "Temperature at the low-k base (950 m)", "expected": 42.87500000000002}, {"key": "nkpor_t_deepest", "tol": 0.005, "unit": "degC", "label": "Temperature at the deepest cell (1950 m)", "expected": 63.796875000000036}]'::jsonb then 'new'
              else 'other' end
    into v_s0 from public.academy_capstones where app_slug = 'basin' and tier = 'beginner' and active;
  if v_s0 = 'other' then
    raise exception 'w5a basin refused: basin/beginner matches neither its post-W1 form (prompt md5 844a4224438738a8982ca478e1264f63) nor its W5 form (prompt md5 ce090d7c10a7eddbcb0a5491e5834a16), with the fields this file was generated against';
  end if;

  -- basin / intermediate
  select count(*) into v_n from public.academy_capstones where app_slug = 'basin' and tier = 'intermediate' and active;
  if v_n <> 1 then raise exception 'w5a basin refused: basin/intermediate has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = '070f9311e9275c498804b1ec915a5433' and md5(coalesce(title, '')) = '2f353a3a9541e589405e9dd6cb534ec7' and md5(coalesce(dataset, '')) = '9e320d26c76054dadf7ebeac7c3559a7' and fields = '[{"key": "ro_f0", "tol": 0.001, "unit": "%Ro", "label": "Ro at zero reaction", "expected": 0.20189651799465538}, {"key": "ro_full", "tol": 0.005, "unit": "%Ro", "label": "Ro at full reaction", "expected": 4.687971627022019}, {"key": "ro_150_r3", "tol": 0.002, "unit": "%Ro", "label": "Ro at 150 C on the 3 C/Ma ramp", "expected": 0.9871413464062039}, {"key": "ro_150_r1", "tol": 0.002, "unit": "%Ro", "label": "Ro at 150 C on the 1 C/Ma ramp", "expected": 1.1129254516555198}, {"key": "tr_10", "tol": 0.0005, "unit": "frac", "label": "Type II TR after 10 Ma at 100 C", "expected": 0.022481215976523083}, {"key": "tr_50", "tol": 0.0005, "unit": "frac", "label": "Type II TR after 50 Ma at 100 C", "expected": 0.05477927380797565}]'::jsonb then 'old'
              when md5(prompt) = '0385728b4cc6872a735a02915ae6a30e' and md5(coalesce(title, '')) = '667bcbf3c344fdae1307c59cde5c2a55' and md5(coalesce(dataset, '')) = '82dd62971159535d3736ead6e75bbd98' and fields = '[{"key": "nkpor_ro_145_r2", "tol": 0.0005, "unit": "%Ro", "label": "Ro at 145 C on the 2 C/Ma ramp", "expected": 0.9484725312807094}, {"key": "nkpor_ro_165_r2", "tol": 0.0005, "unit": "%Ro", "label": "Ro at 165 C on the 2 C/Ma ramp", "expected": 1.2861150761240832}, {"key": "nkpor_ro_165_r5", "tol": 0.0005, "unit": "%Ro", "label": "Ro at 165 C on the 5 C/Ma ramp", "expected": 1.1764945675571294}, {"key": "nkpor_tr1_135_100", "tol": 0.0001, "unit": "frac", "label": "Type I TR after 100 Ma at 135 C", "expected": 0.6414954483503965}, {"key": "nkpor_tr2_135_100", "tol": 0.0001, "unit": "frac", "label": "Type II TR after 100 Ma at 135 C", "expected": 0.41450323436925496}, {"key": "nkpor_tr3_135_100", "tol": 0.0001, "unit": "frac", "label": "Type III TR after 100 Ma at 135 C", "expected": 0.062367273402499146}]'::jsonb then 'new'
              else 'other' end
    into v_s1 from public.academy_capstones where app_slug = 'basin' and tier = 'intermediate' and active;
  if v_s1 = 'other' then
    raise exception 'w5a basin refused: basin/intermediate matches neither its post-W1 form (prompt md5 070f9311e9275c498804b1ec915a5433) nor its W5 form (prompt md5 0385728b4cc6872a735a02915ae6a30e), with the fields this file was generated against';
  end if;

  -- basin / advanced
  select count(*) into v_n from public.academy_capstones where app_slug = 'basin' and tier = 'advanced' and active;
  if v_n <> 1 then raise exception 'w5a basin refused: basin/advanced has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = 'c26faeed02700a10fd5c4a6f89c5a865' and md5(coalesce(title, '')) = '6d4497ae1a7c3c52381bb8b887d43528' and md5(coalesce(dataset, '')) = '524e45ec92bfcf73768869838019b412' and fields = '[{"key": "final_ro", "tol": 0.002, "unit": "%Ro", "label": "Source rock final Ro", "expected": 1.6718288798752388}, {"key": "final_temp", "tol": 0.1, "unit": "degC", "label": "Source rock final temperature", "expected": 149.76037539670858}, {"key": "final_tr", "tol": 0.002, "unit": "frac", "label": "Final transformation ratio", "expected": 0.7423743797385286}, {"key": "generated", "tol": 5, "unit": "kg/m2", "label": "Generated mass at present day", "expected": 13946.54641524398}, {"key": "expelled", "tol": 5, "unit": "kg/m2", "label": "Expelled mass at present day", "expected": 10048.985378825158}, {"key": "ro_delta", "tol": 0.001, "unit": "%Ro", "label": "Erosion signature (delta Ro vs no-erosion run)", "expected": 0.05665081052235643}]'::jsonb then 'old'
              when md5(prompt) = 'cba97b96818e029bd4d24403705bc294' and md5(coalesce(title, '')) = 'f98f7255daec4bc9a2eb7f6c8bcd7447' and md5(coalesce(dataset, '')) = '510e7b50fc95498ddef08527e3ecc0f6' and fields = '[{"key": "nkpor_final_ro", "tol": 0.0005, "unit": "%Ro", "label": "Source rock final Ro", "expected": 2.158320921604062}, {"key": "nkpor_peak_temp", "tol": 0.01, "unit": "degC", "label": "Source rock peak temperature", "expected": 187.13248934890527}, {"key": "nkpor_final_tr", "tol": 0.0005, "unit": "frac", "label": "Final transformation ratio", "expected": 0.889910987289655}, {"key": "nkpor_generated", "tol": 0.5, "unit": "kg/m2", "label": "Generated mass at present day", "expected": 16718.22900736702}, {"key": "nkpor_expelled", "tol": 0.5, "unit": "kg/m2", "label": "Expelled mass at present day", "expected": 13077.581219764983}, {"key": "nkpor_ro_delta", "tol": 0.0005, "unit": "%Ro", "label": "Erosion signature (delta Ro vs no-erosion run)", "expected": 0.5431428522511799}]'::jsonb then 'new'
              else 'other' end
    into v_s2 from public.academy_capstones where app_slug = 'basin' and tier = 'advanced' and active;
  if v_s2 = 'other' then
    raise exception 'w5a basin refused: basin/advanced matches neither its post-W1 form (prompt md5 c26faeed02700a10fd5c4a6f89c5a865) nor its W5 form (prompt md5 cba97b96818e029bd4d24403705bc294), with the fields this file was generated against';
  end if;

  -- nothing to write: every row is already in its W5 form
  if v_s0 = 'new' and v_s1 = 'new' and v_s2 = 'new' then
    raise notice 'w5a basin: 0 of 3 row(s) written, all already applied';
    return;
  end if;

  -- ATTEMPTS. A tier whose graded keys this file moves must hold no capstone
  -- attempt (a stored score is never re-scored, but a learner could be graded
  -- differently on a retry), unless D5 allowlists it with the exact attempt
  -- ids signed off. Any other attempt refuses.
  if v_s0 = 'old' then
    select coalesce(jsonb_agg(a.id::text order by a.created_at, a.id), '[]'::jsonb) into v_ids
      from public.academy_capstone_attempts a where a.app_slug = 'basin' and a.tier = 'beginner';
    if jsonb_array_length(v_ids) > 0 then
      if v_allow ? 'basin/beginner' then
        select coalesce(jsonb_agg(x), '[]'::jsonb) into v_extra
          from jsonb_array_elements(v_ids) x where not (v_allow->'basin/beginner') @> jsonb_build_array(x);
        if jsonb_array_length(v_extra) > 0 then
          select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_extra) x;
          raise exception 'w5a basin refused: basin/beginner holds % attempt(s) outside its D5 allowlist: %', jsonb_array_length(v_extra), v_idtxt;
        end if;
        raise notice 'w5a basin: basin/beginner holds % allowlisted attempt(s) (D5 sign-off); their stored scores are not touched', jsonb_array_length(v_ids);
      else
        select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_ids) x;
        raise exception 'w5a basin refused: basin/beginner holds % capstone attempt(s) (%) and this file moves its graded keys; sign the tier off under D5 (allowlist with these ids) or hold it', jsonb_array_length(v_ids), v_idtxt;
      end if;
    end if;
  end if;
  if v_s1 = 'old' then
    select coalesce(jsonb_agg(a.id::text order by a.created_at, a.id), '[]'::jsonb) into v_ids
      from public.academy_capstone_attempts a where a.app_slug = 'basin' and a.tier = 'intermediate';
    if jsonb_array_length(v_ids) > 0 then
      if v_allow ? 'basin/intermediate' then
        select coalesce(jsonb_agg(x), '[]'::jsonb) into v_extra
          from jsonb_array_elements(v_ids) x where not (v_allow->'basin/intermediate') @> jsonb_build_array(x);
        if jsonb_array_length(v_extra) > 0 then
          select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_extra) x;
          raise exception 'w5a basin refused: basin/intermediate holds % attempt(s) outside its D5 allowlist: %', jsonb_array_length(v_extra), v_idtxt;
        end if;
        raise notice 'w5a basin: basin/intermediate holds % allowlisted attempt(s) (D5 sign-off); their stored scores are not touched', jsonb_array_length(v_ids);
      else
        select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_ids) x;
        raise exception 'w5a basin refused: basin/intermediate holds % capstone attempt(s) (%) and this file moves its graded keys; sign the tier off under D5 (allowlist with these ids) or hold it', jsonb_array_length(v_ids), v_idtxt;
      end if;
    end if;
  end if;
  if v_s2 = 'old' then
    select coalesce(jsonb_agg(a.id::text order by a.created_at, a.id), '[]'::jsonb) into v_ids
      from public.academy_capstone_attempts a where a.app_slug = 'basin' and a.tier = 'advanced';
    if jsonb_array_length(v_ids) > 0 then
      if v_allow ? 'basin/advanced' then
        select coalesce(jsonb_agg(x), '[]'::jsonb) into v_extra
          from jsonb_array_elements(v_ids) x where not (v_allow->'basin/advanced') @> jsonb_build_array(x);
        if jsonb_array_length(v_extra) > 0 then
          select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_extra) x;
          raise exception 'w5a basin refused: basin/advanced holds % attempt(s) outside its D5 allowlist: %', jsonb_array_length(v_extra), v_idtxt;
        end if;
        raise notice 'w5a basin: basin/advanced holds % allowlisted attempt(s) (D5 sign-off); their stored scores are not touched', jsonb_array_length(v_ids);
      else
        select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_ids) x;
        raise exception 'w5a basin refused: basin/advanced holds % capstone attempt(s) (%) and this file moves its graded keys; sign the tier off under D5 (allowlist with these ids) or hold it', jsonb_array_length(v_ids), v_idtxt;
      end if;
    end if;
  end if;

  if v_s0 = 'old' then
    update public.academy_capstones
       set prompt = 'Work the NKPOR compaction and heat case. For sandstone on the Sclater-Christie curve (the course''s sandstone parameters): the solid (grain) thickness inside 100 m of sandstone buried at 1700 m; that same 100 m restored from 1700 m to the surface; and sandstone porosity at 2600 m. Then the NKPOR steady two-layer heat column (12 C surface, 65 mW/m2 basal, k 2.0 over k 3.2, two 1000 m layers of ten 100 m cells each): the temperature at the first cell (50 m), at the base of the low-conductivity layer (950 m), and at the deepest cell (1950 m). Type the case into the burial and heat explorer (it opens on the golden shale and heat column, which are the teaching case).',
           title = 'Burial and heat: the NKPOR case',
           dataset = 'basin/NKPOR sandstone and heat column (W5 re-case; every input is stated in the brief)',
           fields = '[{"key": "nkpor_solid_sst_1700", "tol": 0.005, "unit": "m", "label": "Solid thickness in 100 m of sandstone at 1700 m", "expected": 69.45042808472611}, {"key": "nkpor_restored_sst_1700", "tol": 0.005, "unit": "m", "label": "100 m sandstone from 1700 m, restored to surface", "expected": 133.88023365817557}, {"key": "nkpor_phi_sst_2600", "tol": 0.0001, "unit": "v/v", "label": "Sandstone porosity at 2600 m", "expected": 0.2428406315893992}, {"key": "nkpor_t_first", "tol": 0.005, "unit": "degC", "label": "Temperature at the first cell (50 m)", "expected": 13.625}, {"key": "nkpor_t_lowk_base", "tol": 0.005, "unit": "degC", "label": "Temperature at the low-k base (950 m)", "expected": 42.87500000000002}, {"key": "nkpor_t_deepest", "tol": 0.005, "unit": "degC", "label": "Temperature at the deepest cell (1950 m)", "expected": 63.796875000000036}]'::jsonb
     where app_slug = 'basin' and tier = 'beginner' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w5a basin refused: basin/beginner updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = 'ce090d7c10a7eddbcb0a5491e5834a16' and md5(coalesce(title, '')) = 'dd4c0f09fe08dfcc2c1a975b9625c1e5' and md5(coalesce(dataset, '')) = 'df49e2b30cb7c9fc1e01abf6d06d16ba' and fields = '[{"key": "nkpor_solid_sst_1700", "tol": 0.005, "unit": "m", "label": "Solid thickness in 100 m of sandstone at 1700 m", "expected": 69.45042808472611}, {"key": "nkpor_restored_sst_1700", "tol": 0.005, "unit": "m", "label": "100 m sandstone from 1700 m, restored to surface", "expected": 133.88023365817557}, {"key": "nkpor_phi_sst_2600", "tol": 0.0001, "unit": "v/v", "label": "Sandstone porosity at 2600 m", "expected": 0.2428406315893992}, {"key": "nkpor_t_first", "tol": 0.005, "unit": "degC", "label": "Temperature at the first cell (50 m)", "expected": 13.625}, {"key": "nkpor_t_lowk_base", "tol": 0.005, "unit": "degC", "label": "Temperature at the low-k base (950 m)", "expected": 42.87500000000002}, {"key": "nkpor_t_deepest", "tol": 0.005, "unit": "degC", "label": "Temperature at the deepest cell (1950 m)", "expected": 63.796875000000036}]'::jsonb) from public.academy_capstones where app_slug = 'basin' and tier = 'beginner' and active) is not true then
    raise exception 'w5a basin refused: basin/beginner does not read back as its W5 form';
  end if;

  if v_s1 = 'old' then
    update public.academy_capstones
       set prompt = 'Run the Sweeney-Burnham Easy%Ro integrator on the NKPOR heating ramps: Ro at 145 C and at 165 C on a 2 C/Ma ramp, and Ro at 165 C on a 5 C/Ma ramp (each ramp from 20 C, reported at whole degrees). Then run the isothermal kerogen clock at 135 C and report the transformation ratio after 100 Ma for Type I, Type II and Type III kerogen. Type the rates, the read temperatures and the clock temperature into the kinetics explorer (it opens on the golden 3 C/Ma ramp and the Type II clock at 100 C, which are the teaching case).',
           title = 'Maturity kinetics: the NKPOR ramps and clock',
           dataset = 'basin/NKPOR heating ramps and isothermal clock (W5 re-case; every input is stated in the brief)',
           fields = '[{"key": "nkpor_ro_145_r2", "tol": 0.0005, "unit": "%Ro", "label": "Ro at 145 C on the 2 C/Ma ramp", "expected": 0.9484725312807094}, {"key": "nkpor_ro_165_r2", "tol": 0.0005, "unit": "%Ro", "label": "Ro at 165 C on the 2 C/Ma ramp", "expected": 1.2861150761240832}, {"key": "nkpor_ro_165_r5", "tol": 0.0005, "unit": "%Ro", "label": "Ro at 165 C on the 5 C/Ma ramp", "expected": 1.1764945675571294}, {"key": "nkpor_tr1_135_100", "tol": 0.0001, "unit": "frac", "label": "Type I TR after 100 Ma at 135 C", "expected": 0.6414954483503965}, {"key": "nkpor_tr2_135_100", "tol": 0.0001, "unit": "frac", "label": "Type II TR after 100 Ma at 135 C", "expected": 0.41450323436925496}, {"key": "nkpor_tr3_135_100", "tol": 0.0001, "unit": "frac", "label": "Type III TR after 100 Ma at 135 C", "expected": 0.062367273402499146}]'::jsonb
     where app_slug = 'basin' and tier = 'intermediate' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w5a basin refused: basin/intermediate updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = '0385728b4cc6872a735a02915ae6a30e' and md5(coalesce(title, '')) = '667bcbf3c344fdae1307c59cde5c2a55' and md5(coalesce(dataset, '')) = '82dd62971159535d3736ead6e75bbd98' and fields = '[{"key": "nkpor_ro_145_r2", "tol": 0.0005, "unit": "%Ro", "label": "Ro at 145 C on the 2 C/Ma ramp", "expected": 0.9484725312807094}, {"key": "nkpor_ro_165_r2", "tol": 0.0005, "unit": "%Ro", "label": "Ro at 165 C on the 2 C/Ma ramp", "expected": 1.2861150761240832}, {"key": "nkpor_ro_165_r5", "tol": 0.0005, "unit": "%Ro", "label": "Ro at 165 C on the 5 C/Ma ramp", "expected": 1.1764945675571294}, {"key": "nkpor_tr1_135_100", "tol": 0.0001, "unit": "frac", "label": "Type I TR after 100 Ma at 135 C", "expected": 0.6414954483503965}, {"key": "nkpor_tr2_135_100", "tol": 0.0001, "unit": "frac", "label": "Type II TR after 100 Ma at 135 C", "expected": 0.41450323436925496}, {"key": "nkpor_tr3_135_100", "tol": 0.0001, "unit": "frac", "label": "Type III TR after 100 Ma at 135 C", "expected": 0.062367273402499146}]'::jsonb) from public.academy_capstones where app_slug = 'basin' and tier = 'intermediate' and active) is not true then
    raise exception 'w5a basin refused: basin/intermediate does not read back as its W5 form';
  end if;

  if v_s2 = 'old' then
    update public.academy_capstones
       set prompt = 'Run the full forward model on the golden reference basin (four layers over 150 Ma, cooling 80 to 60 mW/m2 heat flow) with the NKPOR erosion event in place of the reference one: 760 m of erosion at 20 Ma. Read the source shale: its final reflectance, its peak temperature over the whole history, its final transformation ratio, and the generated and expelled mass at present day. Then rerun WITHOUT the erosion event and report the erosion signature, the difference in final Ro between the two runs. Type the event into the charge explorer (it opens on the reference event, 600 m at 10 Ma, which is the teaching case).',
           title = 'The kitchen and the erosion signature: the NKPOR event',
           dataset = 'basin/reference basin with the NKPOR erosion event, run twice (W5 re-case; the event is stated in the brief)',
           fields = '[{"key": "nkpor_final_ro", "tol": 0.0005, "unit": "%Ro", "label": "Source rock final Ro", "expected": 2.158320921604062}, {"key": "nkpor_peak_temp", "tol": 0.01, "unit": "degC", "label": "Source rock peak temperature", "expected": 187.13248934890527}, {"key": "nkpor_final_tr", "tol": 0.0005, "unit": "frac", "label": "Final transformation ratio", "expected": 0.889910987289655}, {"key": "nkpor_generated", "tol": 0.5, "unit": "kg/m2", "label": "Generated mass at present day", "expected": 16718.22900736702}, {"key": "nkpor_expelled", "tol": 0.5, "unit": "kg/m2", "label": "Expelled mass at present day", "expected": 13077.581219764983}, {"key": "nkpor_ro_delta", "tol": 0.0005, "unit": "%Ro", "label": "Erosion signature (delta Ro vs no-erosion run)", "expected": 0.5431428522511799}]'::jsonb
     where app_slug = 'basin' and tier = 'advanced' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w5a basin refused: basin/advanced updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = 'cba97b96818e029bd4d24403705bc294' and md5(coalesce(title, '')) = 'f98f7255daec4bc9a2eb7f6c8bcd7447' and md5(coalesce(dataset, '')) = '510e7b50fc95498ddef08527e3ecc0f6' and fields = '[{"key": "nkpor_final_ro", "tol": 0.0005, "unit": "%Ro", "label": "Source rock final Ro", "expected": 2.158320921604062}, {"key": "nkpor_peak_temp", "tol": 0.01, "unit": "degC", "label": "Source rock peak temperature", "expected": 187.13248934890527}, {"key": "nkpor_final_tr", "tol": 0.0005, "unit": "frac", "label": "Final transformation ratio", "expected": 0.889910987289655}, {"key": "nkpor_generated", "tol": 0.5, "unit": "kg/m2", "label": "Generated mass at present day", "expected": 16718.22900736702}, {"key": "nkpor_expelled", "tol": 0.5, "unit": "kg/m2", "label": "Expelled mass at present day", "expected": 13077.581219764983}, {"key": "nkpor_ro_delta", "tol": 0.0005, "unit": "%Ro", "label": "Erosion signature (delta Ro vs no-erosion run)", "expected": 0.5431428522511799}]'::jsonb) from public.academy_capstones where app_slug = 'basin' and tier = 'advanced' and active) is not true then
    raise exception 'w5a basin refused: basin/advanced does not read back as its W5 form';
  end if;

  raise notice 'w5a basin: % of 3 row(s) written, % already applied', v_written, 3 - v_written;
end $$;
