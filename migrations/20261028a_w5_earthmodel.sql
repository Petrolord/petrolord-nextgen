-- ============================================================================
-- B5 FOLLOW-ON W5A (leak re-case and strip): earthmodel.
--
-- Plan of record: docs/graded-field-audit/FOLLOW-ON-PROGRAMME.md section 3
-- (D4 A and B, D5). Spec: docs/graded-field-audit/w5/earthmodel.json. The new
-- keys come from tools/course-waves/w5/earthmodel/fields.json,
-- written by the course's engine generator and re-checked in CI.
--
-- BEGINNER: pick A (re-case)
--   Every field leaked: the walkthrough and the framework lessons printed them
--   and the framework explorer opened on the capstone frame. The capstone keeps
--   the golden source surfaces and moves them onto the ORUMA frame, which the
--   learner types into the framework explorer.
--   s2_mean (1575.5, tol 0.1)
--       -> oruma_s2_mean 'Mean TopB depth on the ORUMA frame' m, expected 1577.9, tol 0.005
--   clamp_s3 (180, tol 0)
--       -> oruma_clamp_s3 'BaseB nodes fixed by the clamp' count, expected 242, tol 0.0
--   tka_mean (36, tol 0.05)
--       -> oruma_tka_mean 'Zone A mean thickness' m, expected 36.27500000000001, tol 0.005
--   tka_max (42, tol 0.05)
--       -> oruma_tka_max 'Zone A maximum thickness' m, expected 42.350000000000364, tol 0.001
--   tkb_mean (10.24, tol 0.05)
--       -> oruma_tkb_mean 'Zone B mean thickness over the frame' m, expected 9.592857142857138, tol 0.005
--   bulk_a_mm3 (45, tol 0.01)
--       -> oruma_bulk_a_mm3 'Zone A bulk rock volume' 10^6 m3, expected 45.249435, tol 0.001
--   TITLE was: Build the golden framework
--   TITLE now: Build the framework on the ORUMA frame
--   DATASET was: earthmodel/goldens (three-surface framework)
--   DATASET now: earthmodel/golden source surfaces on the ORUMA frame (W5
--   re-case; the frame is stated in the brief)
--   PROMPT now: Resample the golden three source surfaces (TopA, TopB and BaseB,
--   each on its own grid) onto the ORUMA model frame: origin (1020, 2040),
--   square 45 m cells, 28 by 22 nodes. Apply the depth-down monotonic clamp and
--   derive the two zone thickness grids. Type the frame into the framework
--   explorer (it opens on the golden 25 by 20 frame, which is the teaching case)
--   and report the mean TopB depth, how many BaseB nodes the clamp fixed, zone
--   A's mean and maximum thickness, zone B's mean thickness over the whole
--   frame, and zone A's bulk rock volume in millions of cubic metres.
--
-- INTERMEDIATE: pick A (re-case)
--   Every field leaked: the walkthrough and the tie-table lessons printed them
--   and the tie explorer opened on W2. The capstone ties a well of its own,
--   ORUMA-1, typed into the tie explorer's "Type a well" mode against the golden
--   framework; the golden-set worst residual gives way to the control point y.
--   w2_topa_tvdss (1496.6634373420557, tol 0.01)
--       -> oruma1_topa_tvdss 'ORUMA-1 TVDSS at the TopA pick' m, expected 1536.5980910319518, tol 0.01
--   w1_baseb_res (5, tol 0.01)
--       -> oruma1_topa_res 'ORUMA-1 TopA tie residual' m, expected -6.908937738948225, tol 0.005
--   w2_topb_res (8.318351595797822, tol 0.01)
--       -> oruma1_topb_res 'ORUMA-1 TopB tie residual' m, expected -3.232415080054807, tol 0.005
--   w3_topa_res (1, tol 0.01)
--       -> oruma1_baseb_res 'ORUMA-1 BaseB tie residual' m, expected 9.336894439044727, tol 0.005
--   worst_res (45.02816332199586, tol 0.01)
--       -> oruma1_cpa_x 'ORUMA-1 zone-A control point x' m, expected 1659.1326948589228, tol 0.01
--   w2_cpa_x (1610.8719179395334, tol 0.01)
--       -> oruma1_cpa_y 'ORUMA-1 zone-A control point y' m, expected 2497.5377369162634, tol 0.01
--   TITLE was: Tie the four wells
--   TITLE now: Tie the ORUMA-1 well
--   DATASET was: earthmodel/goldens (well ties)
--   DATASET now: earthmodel/ORUMA-1 against the golden framework (W5 re-case;
--   the well is stated in the brief)
--   PROMPT now: Tie the ORUMA-1 well against the golden framework. Its head is
--   at (1750, 2550) with KB 28 m. It is vertical to 1300 m MD, builds to 30
--   degrees at azimuth 240 by 1500 m MD, and holds that to TD at 1900 m MD. Its
--   picks are TopA at 1585, TopB at 1630 and BaseB at 1650 m MD. Type the well
--   into the tie explorer (Type a well; the panel opens on W2, which is the
--   teaching case), build the minimum-curvature trajectory, land every pick in
--   3D and tie it against its surface (residual = pick TVDSS minus the surface
--   there). Report ORUMA-1's TVDSS at its TopA pick, its three tie residuals
--   (TopA, TopB, BaseB, sign kept), and the x and y of its zone-A control point
--   (the zone's MD midpoint along the path).
--
-- ADVANCED: pick A (re-case)
--   Every field leaked: the walkthrough and the population lessons printed them
--   and the population explorer opened on the capstone fault and variogram. The
--   capstone moves to the ORUMA fault polygon, a variogram of its own, a probe
--   at (1700, 2400) and the y = 2300 row, all typed into the population
--   explorer. W1's fault_jump_y2200 (which replaced krige_at_w1) is carried as
--   oruma_fault_jump_y2300 on the new case.
--   block1_cells (174, tol 0)
--       -> oruma_block1_cells 'Block 1 node count' count, expected 212, tol 0.0
--   trend_probe (0.3075, tol 0.001)
--       -> oruma_trend_probe 'Trend porosity at (1700, 2400)' v/v, expected 0.28799999999999987, tol 0.0001
--   krige_probe (0.2914277719922997, tol 0.0002)
--       -> oruma_krige_probe 'Kriged porosity at (1700, 2400)' v/v, expected 0.28692776619579075, tol 5e-05
--   fault_jump_y2200 (-0.023016035393453593, tol 0.00005)
--       -> oruma_fault_jump_y2300 'Porosity jump across the fault on the y = 2300 row' v/v, expected -0.014077279549535582, tol 5e-05
--   phi_block0 (0.28631191845445614, tol 0.001)
--       -> oruma_phi_block0 'Zone A weighted porosity, block 0' v/v, expected 0.28904736238721357, tol 2e-05
--   bulk_a_block1 (13.998749999999998, tol 0.01)
--       -> oruma_bulk_a_block1 'Zone A bulk volume in block 1' 10^6 m3, expected 17.82, tol 0.001
--   TITLE was: Blocks, properties, and per-block volume
--   TITLE now: Blocks, properties and per-block volume: the ORUMA fault
--   DATASET was: earthmodel/goldens (fault blocks + population)
--   DATASET now: earthmodel/golden model with the ORUMA fault and variogram (W5
--   re-case; stated in the brief)
--   PROMPT now: Label the golden model with the ORUMA fault polygon, block 1
--   inside: 975,1975; 2225,1975; 2225,2180; 1325,2180; 1325,2975; 975,2975.
--   Populate zone A porosity per block by simple kriging on a spherical
--   variogram with sill 0.0025, nugget 0.0005 and range 700 m. Type the case
--   into the population explorer (it opens on the golden fault and variogram,
--   which are the teaching case) and report the block-1 node count, the
--   plane-trend porosity and the kriged porosity at (1700, 2400), the porosity
--   jump across the fault on the y = 2300 row of the per-block kriged map (the
--   block 0 node beside the fault minus the block 1 node beside it, sign kept),
--   zone A's interval-weighted porosity in block 0, and zone A's bulk rock
--   volume in block 1 in millions of cubic metres.
--
-- ATTEMPTS. Tiers whose graded keys move: earthmodel/beginner,
-- earthmodel/intermediate, earthmodel/advanced. Before it writes, the file
-- counts academy_capstone_attempts on each and REFUSES if any exist, unless D5
-- allowlists that tier with the exact attempt ids (allowlist: empty). Stored
-- scores are never touched.
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
  -- earthmodel / beginner
  select count(*) into v_n from public.academy_capstones where app_slug = 'earthmodel' and tier = 'beginner' and active;
  if v_n <> 1 then raise exception 'w5a earthmodel refused: earthmodel/beginner has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = 'a133e1069165a6708d13b840d1016399' and md5(coalesce(title, '')) = '6e9e9039d9ed6040a7a41701e3becf26' and md5(coalesce(dataset, '')) = 'eac2efc608a057daf2af57ca9c8df4cd' and fields = '[{"key": "s2_mean", "tol": 0.1, "unit": "m", "label": "Mean TopB depth on the model frame", "expected": 1575.5}, {"key": "clamp_s3", "tol": 0, "unit": "count", "label": "BaseB nodes fixed by the clamp", "expected": 180}, {"key": "tka_mean", "tol": 0.05, "unit": "m", "label": "Zone A mean thickness", "expected": 36}, {"key": "tka_max", "tol": 0.05, "unit": "m", "label": "Zone A maximum thickness", "expected": 42}, {"key": "tkb_mean", "tol": 0.05, "unit": "m", "label": "Zone B mean thickness", "expected": 10.24}, {"key": "bulk_a_mm3", "tol": 0.01, "unit": "10^6 m3", "label": "Zone A bulk rock volume", "expected": 45}]'::jsonb then 'old'
              when md5(prompt) = 'ef5faac6bce4273d411a514c21b8fb07' and md5(coalesce(title, '')) = '0e3e84c512d98bbae7f9d63715737144' and md5(coalesce(dataset, '')) = '0fd2423e8958663793a6c15496c73eda' and fields = '[{"key": "oruma_s2_mean", "tol": 0.005, "unit": "m", "label": "Mean TopB depth on the ORUMA frame", "expected": 1577.9}, {"key": "oruma_clamp_s3", "tol": 0.0, "unit": "count", "label": "BaseB nodes fixed by the clamp", "expected": 242}, {"key": "oruma_tka_mean", "tol": 0.005, "unit": "m", "label": "Zone A mean thickness", "expected": 36.27500000000001}, {"key": "oruma_tka_max", "tol": 0.001, "unit": "m", "label": "Zone A maximum thickness", "expected": 42.350000000000364}, {"key": "oruma_tkb_mean", "tol": 0.005, "unit": "m", "label": "Zone B mean thickness over the frame", "expected": 9.592857142857138}, {"key": "oruma_bulk_a_mm3", "tol": 0.001, "unit": "10^6 m3", "label": "Zone A bulk rock volume", "expected": 45.249435}]'::jsonb then 'new'
              else 'other' end
    into v_s0 from public.academy_capstones where app_slug = 'earthmodel' and tier = 'beginner' and active;
  if v_s0 = 'other' then
    raise exception 'w5a earthmodel refused: earthmodel/beginner matches neither its post-W1 form (prompt md5 a133e1069165a6708d13b840d1016399) nor its W5 form (prompt md5 ef5faac6bce4273d411a514c21b8fb07), with the fields this file was generated against';
  end if;

  -- earthmodel / intermediate
  select count(*) into v_n from public.academy_capstones where app_slug = 'earthmodel' and tier = 'intermediate' and active;
  if v_n <> 1 then raise exception 'w5a earthmodel refused: earthmodel/intermediate has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = 'a1006c387fcd39a42c94d89a7ce96744' and md5(coalesce(title, '')) = '63af2dd163e83e377ccf4acaf3a29b8e' and md5(coalesce(dataset, '')) = 'b59199f321717dab32fcb080d9226998' and fields = '[{"key": "w2_topa_tvdss", "tol": 0.01, "unit": "m", "label": "W2 TVDSS at the TopA pick", "expected": 1496.6634373420557}, {"key": "w1_baseb_res", "tol": 0.01, "unit": "m", "label": "W1 BaseB tie residual", "expected": 5}, {"key": "w2_topb_res", "tol": 0.01, "unit": "m", "label": "W2 TopB tie residual", "expected": 8.318351595797822}, {"key": "w3_topa_res", "tol": 0.01, "unit": "m", "label": "W3 TopA tie residual", "expected": 1}, {"key": "worst_res", "tol": 0.01, "unit": "m", "label": "Largest absolute tie residual", "expected": 45.02816332199586}, {"key": "w2_cpa_x", "tol": 0.01, "unit": "m", "label": "W2 zone-A control point x", "expected": 1610.8719179395334}]'::jsonb then 'old'
              when md5(prompt) = 'd589168c9989de0bdba1012f03e82028' and md5(coalesce(title, '')) = 'bfa8724d043c666fc2fd2cf7b289ca30' and md5(coalesce(dataset, '')) = '5c824c38ac97cc0e5be999aeedb878d6' and fields = '[{"key": "oruma1_topa_tvdss", "tol": 0.01, "unit": "m", "label": "ORUMA-1 TVDSS at the TopA pick", "expected": 1536.5980910319518}, {"key": "oruma1_topa_res", "tol": 0.005, "unit": "m", "label": "ORUMA-1 TopA tie residual", "expected": -6.908937738948225}, {"key": "oruma1_topb_res", "tol": 0.005, "unit": "m", "label": "ORUMA-1 TopB tie residual", "expected": -3.232415080054807}, {"key": "oruma1_baseb_res", "tol": 0.005, "unit": "m", "label": "ORUMA-1 BaseB tie residual", "expected": 9.336894439044727}, {"key": "oruma1_cpa_x", "tol": 0.01, "unit": "m", "label": "ORUMA-1 zone-A control point x", "expected": 1659.1326948589228}, {"key": "oruma1_cpa_y", "tol": 0.01, "unit": "m", "label": "ORUMA-1 zone-A control point y", "expected": 2497.5377369162634}]'::jsonb then 'new'
              else 'other' end
    into v_s1 from public.academy_capstones where app_slug = 'earthmodel' and tier = 'intermediate' and active;
  if v_s1 = 'other' then
    raise exception 'w5a earthmodel refused: earthmodel/intermediate matches neither its post-W1 form (prompt md5 a1006c387fcd39a42c94d89a7ce96744) nor its W5 form (prompt md5 d589168c9989de0bdba1012f03e82028), with the fields this file was generated against';
  end if;

  -- earthmodel / advanced
  select count(*) into v_n from public.academy_capstones where app_slug = 'earthmodel' and tier = 'advanced' and active;
  if v_n <> 1 then raise exception 'w5a earthmodel refused: earthmodel/advanced has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = '58aebea2da84ab88697ccc64d18be8a7' and md5(coalesce(title, '')) = 'f0aeebf3ca0668eee61f842f58dc6923' and md5(coalesce(dataset, '')) = '7c5f6fd359192448c7f3ec401f1a8105' and fields = '[{"key": "block1_cells", "tol": 0, "unit": "count", "label": "Block 1 node count", "expected": 174}, {"key": "trend_probe", "tol": 0.001, "unit": "v/v", "label": "Trend porosity at (1250, 2250)", "expected": 0.3075}, {"key": "krige_probe", "tol": 0.0002, "unit": "v/v", "label": "Kriged porosity at (1500, 2500)", "expected": 0.2914277719922997}, {"key": "fault_jump_y2200", "tol": 0.00005, "unit": "v/v", "label": "Porosity jump across the fault on the y = 2200 row", "expected": -0.023016035393453593}, {"key": "phi_block0", "tol": 0.001, "unit": "v/v", "label": "Zone A weighted porosity, block 0", "expected": 0.28631191845445614}, {"key": "bulk_a_block1", "tol": 0.01, "unit": "10^6 m3", "label": "Zone A bulk volume in block 1", "expected": 13.998749999999998}]'::jsonb then 'old'
              when md5(prompt) = 'f1b1a4b1bc0fc5b7c0d29998afd9a715' and md5(coalesce(title, '')) = '07a1e50fda39f4ae1003dcb335d609b6' and md5(coalesce(dataset, '')) = '569c2b31decbecf88d009fe9a464c5d6' and fields = '[{"key": "oruma_block1_cells", "tol": 0.0, "unit": "count", "label": "Block 1 node count", "expected": 212}, {"key": "oruma_trend_probe", "tol": 0.0001, "unit": "v/v", "label": "Trend porosity at (1700, 2400)", "expected": 0.28799999999999987}, {"key": "oruma_krige_probe", "tol": 5e-05, "unit": "v/v", "label": "Kriged porosity at (1700, 2400)", "expected": 0.28692776619579075}, {"key": "oruma_fault_jump_y2300", "tol": 5e-05, "unit": "v/v", "label": "Porosity jump across the fault on the y = 2300 row", "expected": -0.014077279549535582}, {"key": "oruma_phi_block0", "tol": 2e-05, "unit": "v/v", "label": "Zone A weighted porosity, block 0", "expected": 0.28904736238721357}, {"key": "oruma_bulk_a_block1", "tol": 0.001, "unit": "10^6 m3", "label": "Zone A bulk volume in block 1", "expected": 17.82}]'::jsonb then 'new'
              else 'other' end
    into v_s2 from public.academy_capstones where app_slug = 'earthmodel' and tier = 'advanced' and active;
  if v_s2 = 'other' then
    raise exception 'w5a earthmodel refused: earthmodel/advanced matches neither its post-W1 form (prompt md5 58aebea2da84ab88697ccc64d18be8a7) nor its W5 form (prompt md5 f1b1a4b1bc0fc5b7c0d29998afd9a715), with the fields this file was generated against';
  end if;

  -- nothing to write: every row is already in its W5 form
  if v_s0 = 'new' and v_s1 = 'new' and v_s2 = 'new' then
    raise notice 'w5a earthmodel: 0 of 3 row(s) written, all already applied';
    return;
  end if;

  -- ATTEMPTS. A tier whose graded keys this file moves must hold no capstone
  -- attempt (a stored score is never re-scored, but a learner could be graded
  -- differently on a retry), unless D5 allowlists it with the exact attempt
  -- ids signed off. Any other attempt refuses.
  if v_s0 = 'old' then
    select coalesce(jsonb_agg(a.id::text order by a.created_at, a.id), '[]'::jsonb) into v_ids
      from public.academy_capstone_attempts a where a.app_slug = 'earthmodel' and a.tier = 'beginner';
    if jsonb_array_length(v_ids) > 0 then
      if v_allow ? 'earthmodel/beginner' then
        select coalesce(jsonb_agg(x), '[]'::jsonb) into v_extra
          from jsonb_array_elements(v_ids) x where not (v_allow->'earthmodel/beginner') @> jsonb_build_array(x);
        if jsonb_array_length(v_extra) > 0 then
          select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_extra) x;
          raise exception 'w5a earthmodel refused: earthmodel/beginner holds % attempt(s) outside its D5 allowlist: %', jsonb_array_length(v_extra), v_idtxt;
        end if;
        raise notice 'w5a earthmodel: earthmodel/beginner holds % allowlisted attempt(s) (D5 sign-off); their stored scores are not touched', jsonb_array_length(v_ids);
      else
        select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_ids) x;
        raise exception 'w5a earthmodel refused: earthmodel/beginner holds % capstone attempt(s) (%) and this file moves its graded keys; sign the tier off under D5 (allowlist with these ids) or hold it', jsonb_array_length(v_ids), v_idtxt;
      end if;
    end if;
  end if;
  if v_s1 = 'old' then
    select coalesce(jsonb_agg(a.id::text order by a.created_at, a.id), '[]'::jsonb) into v_ids
      from public.academy_capstone_attempts a where a.app_slug = 'earthmodel' and a.tier = 'intermediate';
    if jsonb_array_length(v_ids) > 0 then
      if v_allow ? 'earthmodel/intermediate' then
        select coalesce(jsonb_agg(x), '[]'::jsonb) into v_extra
          from jsonb_array_elements(v_ids) x where not (v_allow->'earthmodel/intermediate') @> jsonb_build_array(x);
        if jsonb_array_length(v_extra) > 0 then
          select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_extra) x;
          raise exception 'w5a earthmodel refused: earthmodel/intermediate holds % attempt(s) outside its D5 allowlist: %', jsonb_array_length(v_extra), v_idtxt;
        end if;
        raise notice 'w5a earthmodel: earthmodel/intermediate holds % allowlisted attempt(s) (D5 sign-off); their stored scores are not touched', jsonb_array_length(v_ids);
      else
        select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_ids) x;
        raise exception 'w5a earthmodel refused: earthmodel/intermediate holds % capstone attempt(s) (%) and this file moves its graded keys; sign the tier off under D5 (allowlist with these ids) or hold it', jsonb_array_length(v_ids), v_idtxt;
      end if;
    end if;
  end if;
  if v_s2 = 'old' then
    select coalesce(jsonb_agg(a.id::text order by a.created_at, a.id), '[]'::jsonb) into v_ids
      from public.academy_capstone_attempts a where a.app_slug = 'earthmodel' and a.tier = 'advanced';
    if jsonb_array_length(v_ids) > 0 then
      if v_allow ? 'earthmodel/advanced' then
        select coalesce(jsonb_agg(x), '[]'::jsonb) into v_extra
          from jsonb_array_elements(v_ids) x where not (v_allow->'earthmodel/advanced') @> jsonb_build_array(x);
        if jsonb_array_length(v_extra) > 0 then
          select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_extra) x;
          raise exception 'w5a earthmodel refused: earthmodel/advanced holds % attempt(s) outside its D5 allowlist: %', jsonb_array_length(v_extra), v_idtxt;
        end if;
        raise notice 'w5a earthmodel: earthmodel/advanced holds % allowlisted attempt(s) (D5 sign-off); their stored scores are not touched', jsonb_array_length(v_ids);
      else
        select string_agg(x #>> '{}', ', ') into v_idtxt from jsonb_array_elements(v_ids) x;
        raise exception 'w5a earthmodel refused: earthmodel/advanced holds % capstone attempt(s) (%) and this file moves its graded keys; sign the tier off under D5 (allowlist with these ids) or hold it', jsonb_array_length(v_ids), v_idtxt;
      end if;
    end if;
  end if;

  if v_s0 = 'old' then
    update public.academy_capstones
       set prompt = 'Resample the golden three source surfaces (TopA, TopB and BaseB, each on its own grid) onto the ORUMA model frame: origin (1020, 2040), square 45 m cells, 28 by 22 nodes. Apply the depth-down monotonic clamp and derive the two zone thickness grids. Type the frame into the framework explorer (it opens on the golden 25 by 20 frame, which is the teaching case) and report the mean TopB depth, how many BaseB nodes the clamp fixed, zone A''s mean and maximum thickness, zone B''s mean thickness over the whole frame, and zone A''s bulk rock volume in millions of cubic metres.',
           title = 'Build the framework on the ORUMA frame',
           dataset = 'earthmodel/golden source surfaces on the ORUMA frame (W5 re-case; the frame is stated in the brief)',
           fields = '[{"key": "oruma_s2_mean", "tol": 0.005, "unit": "m", "label": "Mean TopB depth on the ORUMA frame", "expected": 1577.9}, {"key": "oruma_clamp_s3", "tol": 0.0, "unit": "count", "label": "BaseB nodes fixed by the clamp", "expected": 242}, {"key": "oruma_tka_mean", "tol": 0.005, "unit": "m", "label": "Zone A mean thickness", "expected": 36.27500000000001}, {"key": "oruma_tka_max", "tol": 0.001, "unit": "m", "label": "Zone A maximum thickness", "expected": 42.350000000000364}, {"key": "oruma_tkb_mean", "tol": 0.005, "unit": "m", "label": "Zone B mean thickness over the frame", "expected": 9.592857142857138}, {"key": "oruma_bulk_a_mm3", "tol": 0.001, "unit": "10^6 m3", "label": "Zone A bulk rock volume", "expected": 45.249435}]'::jsonb
     where app_slug = 'earthmodel' and tier = 'beginner' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w5a earthmodel refused: earthmodel/beginner updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = 'ef5faac6bce4273d411a514c21b8fb07' and md5(coalesce(title, '')) = '0e3e84c512d98bbae7f9d63715737144' and md5(coalesce(dataset, '')) = '0fd2423e8958663793a6c15496c73eda' and fields = '[{"key": "oruma_s2_mean", "tol": 0.005, "unit": "m", "label": "Mean TopB depth on the ORUMA frame", "expected": 1577.9}, {"key": "oruma_clamp_s3", "tol": 0.0, "unit": "count", "label": "BaseB nodes fixed by the clamp", "expected": 242}, {"key": "oruma_tka_mean", "tol": 0.005, "unit": "m", "label": "Zone A mean thickness", "expected": 36.27500000000001}, {"key": "oruma_tka_max", "tol": 0.001, "unit": "m", "label": "Zone A maximum thickness", "expected": 42.350000000000364}, {"key": "oruma_tkb_mean", "tol": 0.005, "unit": "m", "label": "Zone B mean thickness over the frame", "expected": 9.592857142857138}, {"key": "oruma_bulk_a_mm3", "tol": 0.001, "unit": "10^6 m3", "label": "Zone A bulk rock volume", "expected": 45.249435}]'::jsonb) from public.academy_capstones where app_slug = 'earthmodel' and tier = 'beginner' and active) is not true then
    raise exception 'w5a earthmodel refused: earthmodel/beginner does not read back as its W5 form';
  end if;

  if v_s1 = 'old' then
    update public.academy_capstones
       set prompt = 'Tie the ORUMA-1 well against the golden framework. Its head is at (1750, 2550) with KB 28 m. It is vertical to 1300 m MD, builds to 30 degrees at azimuth 240 by 1500 m MD, and holds that to TD at 1900 m MD. Its picks are TopA at 1585, TopB at 1630 and BaseB at 1650 m MD. Type the well into the tie explorer (Type a well; the panel opens on W2, which is the teaching case), build the minimum-curvature trajectory, land every pick in 3D and tie it against its surface (residual = pick TVDSS minus the surface there). Report ORUMA-1''s TVDSS at its TopA pick, its three tie residuals (TopA, TopB, BaseB, sign kept), and the x and y of its zone-A control point (the zone''s MD midpoint along the path).',
           title = 'Tie the ORUMA-1 well',
           dataset = 'earthmodel/ORUMA-1 against the golden framework (W5 re-case; the well is stated in the brief)',
           fields = '[{"key": "oruma1_topa_tvdss", "tol": 0.01, "unit": "m", "label": "ORUMA-1 TVDSS at the TopA pick", "expected": 1536.5980910319518}, {"key": "oruma1_topa_res", "tol": 0.005, "unit": "m", "label": "ORUMA-1 TopA tie residual", "expected": -6.908937738948225}, {"key": "oruma1_topb_res", "tol": 0.005, "unit": "m", "label": "ORUMA-1 TopB tie residual", "expected": -3.232415080054807}, {"key": "oruma1_baseb_res", "tol": 0.005, "unit": "m", "label": "ORUMA-1 BaseB tie residual", "expected": 9.336894439044727}, {"key": "oruma1_cpa_x", "tol": 0.01, "unit": "m", "label": "ORUMA-1 zone-A control point x", "expected": 1659.1326948589228}, {"key": "oruma1_cpa_y", "tol": 0.01, "unit": "m", "label": "ORUMA-1 zone-A control point y", "expected": 2497.5377369162634}]'::jsonb
     where app_slug = 'earthmodel' and tier = 'intermediate' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w5a earthmodel refused: earthmodel/intermediate updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = 'd589168c9989de0bdba1012f03e82028' and md5(coalesce(title, '')) = 'bfa8724d043c666fc2fd2cf7b289ca30' and md5(coalesce(dataset, '')) = '5c824c38ac97cc0e5be999aeedb878d6' and fields = '[{"key": "oruma1_topa_tvdss", "tol": 0.01, "unit": "m", "label": "ORUMA-1 TVDSS at the TopA pick", "expected": 1536.5980910319518}, {"key": "oruma1_topa_res", "tol": 0.005, "unit": "m", "label": "ORUMA-1 TopA tie residual", "expected": -6.908937738948225}, {"key": "oruma1_topb_res", "tol": 0.005, "unit": "m", "label": "ORUMA-1 TopB tie residual", "expected": -3.232415080054807}, {"key": "oruma1_baseb_res", "tol": 0.005, "unit": "m", "label": "ORUMA-1 BaseB tie residual", "expected": 9.336894439044727}, {"key": "oruma1_cpa_x", "tol": 0.01, "unit": "m", "label": "ORUMA-1 zone-A control point x", "expected": 1659.1326948589228}, {"key": "oruma1_cpa_y", "tol": 0.01, "unit": "m", "label": "ORUMA-1 zone-A control point y", "expected": 2497.5377369162634}]'::jsonb) from public.academy_capstones where app_slug = 'earthmodel' and tier = 'intermediate' and active) is not true then
    raise exception 'w5a earthmodel refused: earthmodel/intermediate does not read back as its W5 form';
  end if;

  if v_s2 = 'old' then
    update public.academy_capstones
       set prompt = 'Label the golden model with the ORUMA fault polygon, block 1 inside: 975,1975; 2225,1975; 2225,2180; 1325,2180; 1325,2975; 975,2975. Populate zone A porosity per block by simple kriging on a spherical variogram with sill 0.0025, nugget 0.0005 and range 700 m. Type the case into the population explorer (it opens on the golden fault and variogram, which are the teaching case) and report the block-1 node count, the plane-trend porosity and the kriged porosity at (1700, 2400), the porosity jump across the fault on the y = 2300 row of the per-block kriged map (the block 0 node beside the fault minus the block 1 node beside it, sign kept), zone A''s interval-weighted porosity in block 0, and zone A''s bulk rock volume in block 1 in millions of cubic metres.',
           title = 'Blocks, properties and per-block volume: the ORUMA fault',
           dataset = 'earthmodel/golden model with the ORUMA fault and variogram (W5 re-case; stated in the brief)',
           fields = '[{"key": "oruma_block1_cells", "tol": 0.0, "unit": "count", "label": "Block 1 node count", "expected": 212}, {"key": "oruma_trend_probe", "tol": 0.0001, "unit": "v/v", "label": "Trend porosity at (1700, 2400)", "expected": 0.28799999999999987}, {"key": "oruma_krige_probe", "tol": 5e-05, "unit": "v/v", "label": "Kriged porosity at (1700, 2400)", "expected": 0.28692776619579075}, {"key": "oruma_fault_jump_y2300", "tol": 5e-05, "unit": "v/v", "label": "Porosity jump across the fault on the y = 2300 row", "expected": -0.014077279549535582}, {"key": "oruma_phi_block0", "tol": 2e-05, "unit": "v/v", "label": "Zone A weighted porosity, block 0", "expected": 0.28904736238721357}, {"key": "oruma_bulk_a_block1", "tol": 0.001, "unit": "10^6 m3", "label": "Zone A bulk volume in block 1", "expected": 17.82}]'::jsonb
     where app_slug = 'earthmodel' and tier = 'advanced' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w5a earthmodel refused: earthmodel/advanced updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = 'f1b1a4b1bc0fc5b7c0d29998afd9a715' and md5(coalesce(title, '')) = '07a1e50fda39f4ae1003dcb335d609b6' and md5(coalesce(dataset, '')) = '569c2b31decbecf88d009fe9a464c5d6' and fields = '[{"key": "oruma_block1_cells", "tol": 0.0, "unit": "count", "label": "Block 1 node count", "expected": 212}, {"key": "oruma_trend_probe", "tol": 0.0001, "unit": "v/v", "label": "Trend porosity at (1700, 2400)", "expected": 0.28799999999999987}, {"key": "oruma_krige_probe", "tol": 5e-05, "unit": "v/v", "label": "Kriged porosity at (1700, 2400)", "expected": 0.28692776619579075}, {"key": "oruma_fault_jump_y2300", "tol": 5e-05, "unit": "v/v", "label": "Porosity jump across the fault on the y = 2300 row", "expected": -0.014077279549535582}, {"key": "oruma_phi_block0", "tol": 2e-05, "unit": "v/v", "label": "Zone A weighted porosity, block 0", "expected": 0.28904736238721357}, {"key": "oruma_bulk_a_block1", "tol": 0.001, "unit": "10^6 m3", "label": "Zone A bulk volume in block 1", "expected": 17.82}]'::jsonb) from public.academy_capstones where app_slug = 'earthmodel' and tier = 'advanced' and active) is not true then
    raise exception 'w5a earthmodel refused: earthmodel/advanced does not read back as its W5 form';
  end if;

  raise notice 'w5a earthmodel: % of 3 row(s) written, % already applied', v_written, 3 - v_written;
end $$;
