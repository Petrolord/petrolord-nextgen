-- ============================================================================
-- B5 FOLLOW-ON W4 PART B (typed "your case" panel modes): producedwater.
--
-- Plan of record: docs/graded-field-audit/FOLLOW-ON-PROGRAMME.md section 1,
-- route (b), and decision D2 (a panel may reach the capstone case when the
-- learner types it; no panel DEFAULT state lands on a graded answer). Owner
-- approved D1 to D7 as recommended, 2026-09-21. The panels ship with the
-- NextGen zip; this file adds one sentence to each brief saying where the case
-- can be typed.
--
-- BEGINNER (5 graded field(s) now read in a typed panel mode:
-- ogulagha_basin_cut_micron, ogulagha_droplet_rise_ms,
-- ogulagha_plate_cut_micron, ogulagha_water_density_kgm3,
-- ogulagha_water_viscosity_pas)
--   POINTER appended: On the course panel, the Water explorer's "Your stream,
--   typed" view takes this stream as typed (the water, the crude, the droplets,
--   the basin and the plate pack) and prints every value to at least the
--   precision graded here.
-- INTERMEDIATE (3 graded field(s) now read in a typed panel mode:
-- izombe_bubble_rise_ms, izombe_cyclone_cut_micron, izombe_gas_holdup_ratio)
--   POINTER appended: On the course panel, the Device explorer's "Your stream,
--   typed" view takes this water, the liner bank, the flotation unit and the
--   media bed as typed and prints every value to at least the precision graded
--   here.
-- ADVANCED (6 graded field(s) now read in a typed panel mode:
-- tunu_coarse_droplet_reynolds, tunu_cyclone_stage_median_micron,
-- tunu_cyclone_stage_removal_pct, tunu_plate_stage_removal_pct,
-- tunu_train_outlet_median_micron, tunu_train_outlet_ppm)
--   POINTER appended: On the course panel, the Train explorer's "Your stream,
--   typed" view takes this water, the inlet distribution and the three stages in
--   order as typed, with the 240 micron droplet, and prints every value to at
--   least the precision graded here.
--
-- WHAT DOES NOT MOVE. `fields` (every key, label, unit, expected and
-- tolerance), title, dataset, status and the row. The guard requires `fields`
-- to equal its live value exactly, before and after, so no answer grades
-- differently and no attempts guard is needed.
--
-- GUARDS. Each prompt must hold its post-W1 text (md5, rewritten) or its W4
-- text (left alone). Anything else raises and the file rolls back. A file that
-- will write first checks the W1 post-state and refuses without it. Generated
-- by docs/graded-field-audit/w4b_capstones.py from w4b/producedwater.json. SAFE TO
-- RE-RUN: a second run writes nothing.
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
  -- producedwater / beginner
  select count(*) into v_n from public.academy_capstones where app_slug = 'producedwater' and tier = 'beginner' and active;
  if v_n <> 1 then raise exception 'w4b producedwater refused: producedwater/beginner has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = 'fd13e35a2c3be72561908ab04635a356' and fields = '[{"key": "ogulagha_water_viscosity_pas", "tol": 1E-12, "unit": "Pa.s", "label": "The water viscosity at the stream temperature and salinity", "expected": 0.0005101915934473397}, {"key": "ogulagha_water_density_kgm3", "tol": 0.0001, "unit": "kg/m3", "label": "The brine density at the stream temperature and salinity", "expected": 1013.7286105037547}, {"key": "ogulagha_oil_density_kgm3", "tol": 0.0001, "unit": "kg/m3", "label": "The crude density at the stream temperature", "expected": 862.3241899811321}, {"key": "ogulagha_droplet_rise_ms", "tol": 1E-10, "unit": "m/s", "label": "The Stokes rise velocity of the median droplet", "expected": 0.0000782526023252317}, {"key": "ogulagha_basin_cut_micron", "tol": 0.000001, "unit": "micron", "label": "The API 421 basin cut size", "expected": 113.37669131197052}, {"key": "ogulagha_plate_cut_micron", "tol": 0.000001, "unit": "micron", "label": "The plate pack cut size", "expected": 69.84080434958841}]'::jsonb then 'old'
              when md5(prompt) = '7ba01d2fc337f105c1a1a63eb2f3f3c8' and fields = '[{"key": "ogulagha_water_viscosity_pas", "tol": 1E-12, "unit": "Pa.s", "label": "The water viscosity at the stream temperature and salinity", "expected": 0.0005101915934473397}, {"key": "ogulagha_water_density_kgm3", "tol": 0.0001, "unit": "kg/m3", "label": "The brine density at the stream temperature and salinity", "expected": 1013.7286105037547}, {"key": "ogulagha_oil_density_kgm3", "tol": 0.0001, "unit": "kg/m3", "label": "The crude density at the stream temperature", "expected": 862.3241899811321}, {"key": "ogulagha_droplet_rise_ms", "tol": 1E-10, "unit": "m/s", "label": "The Stokes rise velocity of the median droplet", "expected": 0.0000782526023252317}, {"key": "ogulagha_basin_cut_micron", "tol": 0.000001, "unit": "micron", "label": "The API 421 basin cut size", "expected": 113.37669131197052}, {"key": "ogulagha_plate_cut_micron", "tol": 0.000001, "unit": "micron", "label": "The plate pack cut size", "expected": 69.84080434958841}]'::jsonb then 'new'
              else 'other' end
    into v_s0 from public.academy_capstones where app_slug = 'producedwater' and tier = 'beginner' and active;
  if v_s0 = 'other' then
    raise exception 'w4b producedwater refused: producedwater/beginner matches neither its published form (prompt md5 fd13e35a2c3be72561908ab04635a356) nor its W4 form (prompt md5 7ba01d2fc337f105c1a1a63eb2f3f3c8), with the fields this file was generated against';
  end if;

  -- producedwater / intermediate
  select count(*) into v_n from public.academy_capstones where app_slug = 'producedwater' and tier = 'intermediate' and active;
  if v_n <> 1 then raise exception 'w4b producedwater refused: producedwater/intermediate has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = 'e2640737e5b96b3c38f2549547e50963' and fields = '[{"key": "izombe_liner_turndown_ratio", "tol": 5E-7, "unit": "ratio", "label": "The turndown the liners run at", "expected": 1.7787930373888892}, {"key": "izombe_cyclone_shear_penalty", "tol": 5E-7, "unit": "ratio", "label": "The inlet shear penalty on the liner cut", "expected": 1.1697445603434073}, {"key": "izombe_cyclone_cut_micron", "tol": 0.000001, "unit": "micron", "label": "The liner bank cut size, with its penalty applied", "expected": 5.319865594518567}, {"key": "izombe_bubble_rise_ms", "tol": 1E-10, "unit": "m/s", "label": "The full drag balance rise velocity of one bubble", "expected": 0.02505191646373671}, {"key": "izombe_gas_holdup_ratio", "tol": 5E-7, "unit": "ratio", "label": "The gas holdup of the swarm", "expected": 0.06881952310620194}, {"key": "izombe_filter_cut_micron", "tol": 0.000001, "unit": "micron", "label": "The media bed cut size", "expected": 10.257441012720951}]'::jsonb then 'old'
              when md5(prompt) = '314bce7cb050a465b4316386822fe77a' and fields = '[{"key": "izombe_liner_turndown_ratio", "tol": 5E-7, "unit": "ratio", "label": "The turndown the liners run at", "expected": 1.7787930373888892}, {"key": "izombe_cyclone_shear_penalty", "tol": 5E-7, "unit": "ratio", "label": "The inlet shear penalty on the liner cut", "expected": 1.1697445603434073}, {"key": "izombe_cyclone_cut_micron", "tol": 0.000001, "unit": "micron", "label": "The liner bank cut size, with its penalty applied", "expected": 5.319865594518567}, {"key": "izombe_bubble_rise_ms", "tol": 1E-10, "unit": "m/s", "label": "The full drag balance rise velocity of one bubble", "expected": 0.02505191646373671}, {"key": "izombe_gas_holdup_ratio", "tol": 5E-7, "unit": "ratio", "label": "The gas holdup of the swarm", "expected": 0.06881952310620194}, {"key": "izombe_filter_cut_micron", "tol": 0.000001, "unit": "micron", "label": "The media bed cut size", "expected": 10.257441012720951}]'::jsonb then 'new'
              else 'other' end
    into v_s1 from public.academy_capstones where app_slug = 'producedwater' and tier = 'intermediate' and active;
  if v_s1 = 'other' then
    raise exception 'w4b producedwater refused: producedwater/intermediate matches neither its published form (prompt md5 e2640737e5b96b3c38f2549547e50963) nor its W4 form (prompt md5 314bce7cb050a465b4316386822fe77a), with the fields this file was generated against';
  end if;

  -- producedwater / advanced
  select count(*) into v_n from public.academy_capstones where app_slug = 'producedwater' and tier = 'advanced' and active;
  if v_n <> 1 then raise exception 'w4b producedwater refused: producedwater/advanced has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = '715c469f785ceea161f5c82b21f8ad1d' and fields = '[{"key": "tunu_cyclone_stage_median_micron", "tol": 0.000001, "unit": "micron", "label": "The droplet median leaving the liner bank stage", "expected": 4.693996003747812}, {"key": "tunu_plate_stage_removal_pct", "tol": 0.000001, "unit": "percent", "label": "The plate pack stage removal, of the oil reaching it", "expected": 11.801201005213063}, {"key": "tunu_cyclone_stage_removal_pct", "tol": 0.000001, "unit": "percent", "label": "The liner bank stage removal, of the oil reaching it", "expected": 93.8488534141062}, {"key": "tunu_train_outlet_ppm", "tol": 0.000001, "unit": "ppm", "label": "The train outlet concentration", "expected": 45.682546314511974}, {"key": "tunu_train_outlet_median_micron", "tol": 0.000001, "unit": "micron", "label": "The droplet median leaving the train", "expected": 4.08399589751163}, {"key": "tunu_coarse_droplet_reynolds", "tol": 5E-7, "unit": "ratio", "label": "The Reynolds number reported for the coarse droplet", "expected": 6.997495185436383}]'::jsonb then 'old'
              when md5(prompt) = '19fe7d271a3d3b4b2013a9c4bedf8a5f' and fields = '[{"key": "tunu_cyclone_stage_median_micron", "tol": 0.000001, "unit": "micron", "label": "The droplet median leaving the liner bank stage", "expected": 4.693996003747812}, {"key": "tunu_plate_stage_removal_pct", "tol": 0.000001, "unit": "percent", "label": "The plate pack stage removal, of the oil reaching it", "expected": 11.801201005213063}, {"key": "tunu_cyclone_stage_removal_pct", "tol": 0.000001, "unit": "percent", "label": "The liner bank stage removal, of the oil reaching it", "expected": 93.8488534141062}, {"key": "tunu_train_outlet_ppm", "tol": 0.000001, "unit": "ppm", "label": "The train outlet concentration", "expected": 45.682546314511974}, {"key": "tunu_train_outlet_median_micron", "tol": 0.000001, "unit": "micron", "label": "The droplet median leaving the train", "expected": 4.08399589751163}, {"key": "tunu_coarse_droplet_reynolds", "tol": 5E-7, "unit": "ratio", "label": "The Reynolds number reported for the coarse droplet", "expected": 6.997495185436383}]'::jsonb then 'new'
              else 'other' end
    into v_s2 from public.academy_capstones where app_slug = 'producedwater' and tier = 'advanced' and active;
  if v_s2 = 'other' then
    raise exception 'w4b producedwater refused: producedwater/advanced matches neither its published form (prompt md5 715c469f785ceea161f5c82b21f8ad1d) nor its W4 form (prompt md5 19fe7d271a3d3b4b2013a9c4bedf8a5f), with the fields this file was generated against';
  end if;

  -- nothing to write: every row is already in its W4 form
  if v_s0 = 'new' and v_s1 = 'new' and v_s2 = 'new' then
    raise notice 'w4b producedwater: 0 of 3 row(s) written, all already applied';
    return;
  end if;

  -- W1 (20261024*) must be applied first: its post-state is this file's base
  if not exists (select 1 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
                  where c.app_slug = 'mbal' and c.tier = 'advanced' and c.active and f->>'key' = 'a111_ddi')
     or not exists (select 1 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
                     where c.app_slug = 'petrophysics' and c.tier = 'advanced' and c.active and f->>'key' = 'rw_arps'
                       and (f->>'tol')::float8 = 0.00005) then
    raise exception 'w4b producedwater refused: W1 (20261024*) is not applied on this database; apply it first (/root/w1-apply/apply.sh apply --prod)';
  end if;

  if v_s0 = 'old' then
    update public.academy_capstones
       set prompt = 'OGULAGHA, a gravity front end on a warm, moderately saline field. The water is 36000 bwpd, taken to m3/s with the exact barrel of 0.158987294928 m3, at 58.5 C and 42500 ppm of total dissolved solids, and the crude is 27.5 degrees API at the same temperature. The droplets arrive at 420 ppm with a volume median of 22 micron and a log spread sigma of 0.75. The basin is 15 m long, 3.4 m wide and 1.5 m deep, read at a short-circuit allowance F of 1.6. The plate pack is 48 plates of 2.5 m2 projected area each, with 0.7 of that area credited as settling. The water viscosity fit, the brine density fit and the crude density chain from API gravity are the module''s own declared choices, and nothing else is looked up. The crude chain takes a specific gravity at 60 F of 141.5 / (131.5 + API) against the declared reference water of 999 kg/m3, thinned by 0.0007 per degree C above a reference temperature of 15.56 C. Report six values: the water viscosity, the brine density, the crude density, the Stokes rise velocity of a droplet at the volume median, the basin cut size and the plate pack cut size. The viscosity in Pa.s and the rise velocity in m/s, to twelve decimals. The two densities in kg/m3 and the two cut sizes in micron, to six decimals. On the course panel, the Water explorer''s "Your stream, typed" view takes this stream as typed (the water, the crude, the droplets, the basin and the plate pack) and prints every value to at least the precision graded here.'
     where app_slug = 'producedwater' and tier = 'beginner' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w4b producedwater refused: producedwater/beginner updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = '7ba01d2fc337f105c1a1a63eb2f3f3c8' and fields = '[{"key": "ogulagha_water_viscosity_pas", "tol": 1E-12, "unit": "Pa.s", "label": "The water viscosity at the stream temperature and salinity", "expected": 0.0005101915934473397}, {"key": "ogulagha_water_density_kgm3", "tol": 0.0001, "unit": "kg/m3", "label": "The brine density at the stream temperature and salinity", "expected": 1013.7286105037547}, {"key": "ogulagha_oil_density_kgm3", "tol": 0.0001, "unit": "kg/m3", "label": "The crude density at the stream temperature", "expected": 862.3241899811321}, {"key": "ogulagha_droplet_rise_ms", "tol": 1E-10, "unit": "m/s", "label": "The Stokes rise velocity of the median droplet", "expected": 0.0000782526023252317}, {"key": "ogulagha_basin_cut_micron", "tol": 0.000001, "unit": "micron", "label": "The API 421 basin cut size", "expected": 113.37669131197052}, {"key": "ogulagha_plate_cut_micron", "tol": 0.000001, "unit": "micron", "label": "The plate pack cut size", "expected": 69.84080434958841}]'::jsonb) from public.academy_capstones where app_slug = 'producedwater' and tier = 'beginner' and active) is not true then
    raise exception 'w4b producedwater refused: producedwater/beginner does not read back as its W4 form';
  end if;

  if v_s1 = 'old' then
    update public.academy_capstones
       set prompt = 'IZOMBE, three de-oiling devices on a cooler, much more saline field. The water is 58000 bwpd, taken to m3/s with the exact barrel of 0.158987294928 m3, at 47 C and 88000 ppm of total dissolved solids, and the crude is 31 degrees API at the same temperature. The liner bank is 100 liners, each of 0.035 m bore and 0.7 m length, rated at 0.0006 m3/s and 1000 g at that flow, with the oil core taken at 0.5 of the liner radius. The flotation unit is 3 cells of 26 m3, 3.5 m deep, fed gas at 0.12 times the water flow to each cell as bubbles of 220 micron with a gas density of 1.2 kg/m3. The media bed is 18 m2 and 1.1 m deep, packed at 800 micron, with a filter coefficient of 3.5 per m declared at a 20 micron droplet. The operating envelope of a liner, the drag coefficient a bubble rises against and the loading dependence of the bed are the module''s own declared choices. Report six values: the turndown the liners run at, the inlet shear penalty on their cut, the liner bank cut size, the rise velocity of one bubble, the gas holdup of the swarm and the bed cut size. The turndown, the shear penalty and the holdup as ratios and the two cut sizes in micron, to six decimals. The rise velocity in m/s, to twelve decimals. On the course panel, the Device explorer''s "Your stream, typed" view takes this water, the liner bank, the flotation unit and the media bed as typed and prints every value to at least the precision graded here.'
     where app_slug = 'producedwater' and tier = 'intermediate' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w4b producedwater refused: producedwater/intermediate updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = '314bce7cb050a465b4316386822fe77a' and fields = '[{"key": "izombe_liner_turndown_ratio", "tol": 5E-7, "unit": "ratio", "label": "The turndown the liners run at", "expected": 1.7787930373888892}, {"key": "izombe_cyclone_shear_penalty", "tol": 5E-7, "unit": "ratio", "label": "The inlet shear penalty on the liner cut", "expected": 1.1697445603434073}, {"key": "izombe_cyclone_cut_micron", "tol": 0.000001, "unit": "micron", "label": "The liner bank cut size, with its penalty applied", "expected": 5.319865594518567}, {"key": "izombe_bubble_rise_ms", "tol": 1E-10, "unit": "m/s", "label": "The full drag balance rise velocity of one bubble", "expected": 0.02505191646373671}, {"key": "izombe_gas_holdup_ratio", "tol": 5E-7, "unit": "ratio", "label": "The gas holdup of the swarm", "expected": 0.06881952310620194}, {"key": "izombe_filter_cut_micron", "tol": 0.000001, "unit": "micron", "label": "The media bed cut size", "expected": 10.257441012720951}]'::jsonb) from public.academy_capstones where app_slug = 'producedwater' and tier = 'intermediate' and active) is not true then
    raise exception 'w4b producedwater refused: producedwater/intermediate does not read back as its W4 form';
  end if;

  if v_s2 = 'old' then
    update public.academy_capstones
       set prompt = 'TUNU, a three stage train on a hot, fresher field. The water is 44000 bwpd, taken to m3/s with the exact barrel of 0.158987294928 m3, at 66 C and 21000 ppm of total dissolved solids, and the crude is 36 degrees API at the same temperature. The inlet carries 1150 ppm of oil at a volume median of 19 micron and a log spread sigma of 0.85, described on 60 bins spanning 4 sigma either side of the median. The train runs in this order: a plate pack of 56 plates of 2.2 m2 with 0.7 of the projected area credited as settling; then a liner bank of 120 liners, each of 0.035 m bore and 0.7 m length, rated at 0.0006 m3/s and 1000 g at that flow, with the oil core taken at 0.5 of the liner radius; then a media bed of 14 m2 and 1.4 m deep, packed at 800 micron, with a filter coefficient of 3.5 per m declared at a 20 micron droplet. Every cut size is the engine''s own for its device, and no dissolved oil floor and no discharge specification is given. Report six values: the removal of the plate pack stage and of the liner bank stage, each as a percentage of the oil reaching it, the droplet median leaving the liner bank stage, the train outlet concentration, the droplet median leaving the train, and the Reynolds number the module reports for a 240 micron droplet in this water. Removals in percent, the concentration in ppm, the medians in micron and the Reynolds number as a ratio, all to six decimals. On the course panel, the Train explorer''s "Your stream, typed" view takes this water, the inlet distribution and the three stages in order as typed, with the 240 micron droplet, and prints every value to at least the precision graded here.'
     where app_slug = 'producedwater' and tier = 'advanced' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w4b producedwater refused: producedwater/advanced updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = '19fe7d271a3d3b4b2013a9c4bedf8a5f' and fields = '[{"key": "tunu_cyclone_stage_median_micron", "tol": 0.000001, "unit": "micron", "label": "The droplet median leaving the liner bank stage", "expected": 4.693996003747812}, {"key": "tunu_plate_stage_removal_pct", "tol": 0.000001, "unit": "percent", "label": "The plate pack stage removal, of the oil reaching it", "expected": 11.801201005213063}, {"key": "tunu_cyclone_stage_removal_pct", "tol": 0.000001, "unit": "percent", "label": "The liner bank stage removal, of the oil reaching it", "expected": 93.8488534141062}, {"key": "tunu_train_outlet_ppm", "tol": 0.000001, "unit": "ppm", "label": "The train outlet concentration", "expected": 45.682546314511974}, {"key": "tunu_train_outlet_median_micron", "tol": 0.000001, "unit": "micron", "label": "The droplet median leaving the train", "expected": 4.08399589751163}, {"key": "tunu_coarse_droplet_reynolds", "tol": 5E-7, "unit": "ratio", "label": "The Reynolds number reported for the coarse droplet", "expected": 6.997495185436383}]'::jsonb) from public.academy_capstones where app_slug = 'producedwater' and tier = 'advanced' and active) is not true then
    raise exception 'w4b producedwater refused: producedwater/advanced does not read back as its W4 form';
  end if;

  raise notice 'w4b producedwater: % of 3 row(s) written, % already applied', v_written, 3 - v_written;
end $$;
