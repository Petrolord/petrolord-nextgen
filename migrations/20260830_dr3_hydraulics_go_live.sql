-- ============================================================================
-- DR3 GO LIVE (HELD): make Drilling Hydraulics enrollable.
--
-- DO NOT APPLY until a NextGen production upload carries the
-- HydraulicsLearningPage route (/dashboard/apps/hydraulics) and the deep-course
-- routes. RC1 through RC7, DR1 and DR2 are held on the SAME gate.
--
-- Precondition checklist:
--   1. nextgen.petrolord.com serves a build containing /dashboard/apps/hydraulics.
--   2. academy_course_structures has three active hydraulics rows.
--   3. academy_quiz_questions holds 396 hydraulics rows (132 per tier).
--   4. academy_capstones holds the three hydraulics rows.
-- ============================================================================

do $$
declare
  v_structures integer;
  v_capstones  integer;
  v_questions  integer;
  v_graded     integer;
  v_pipe       numeric;
  v_ann        numeric;
  v_bit        numeric;
  v_pump       numeric;
begin
  select count(*) into v_structures
    from public.academy_course_structures where app_slug = 'hydraulics' and active;
  if v_structures <> 3 then
    raise exception 'DR3 go-live refused: hydraulics has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions
    from public.academy_quiz_questions where app_slug = 'hydraulics';
  if v_questions <> 396 then
    raise exception 'DR3 go-live refused: hydraulics has % quiz questions, expected 396 (132 per tier)', v_questions;
  end if;

  select count(*) into v_capstones
    from public.academy_capstones where app_slug = 'hydraulics';
  if v_capstones <> 3 then
    raise exception 'DR3 go-live refused: hydraulics has % capstones, expected 3', v_capstones;
  end if;

  -- THE SCOPE ASSERTION. The engine is a STEADY-STATE hydraulics on a
  -- concentric non-rotating annulus. It has no transients or acceleration, no
  -- temperature or compressibility, no gel strength or break-circulation
  -- pressure, no eccentricity or rotation, and no cuttings-bed or inclination
  -- term. Expert m05 teaches all five and certifies none.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'hydraulics'
     and (f->>'key' ilike '%transient%'
       or f->>'key' ilike '%accel%'
       or f->>'key' ilike '%temperature%'
       or f->>'key' ilike '%thermal%'
       or f->>'key' ilike '%compressib%'
       or f->>'key' ilike '%gel%'
       or f->>'key' ilike '%break_circ%'
       or f->>'key' ilike '%eccentric%'
       or f->>'key' ilike '%rotation%'
       or f->>'key' ilike '%rpm%'
       or f->>'key' ilike '%bed%'
       or f->>'key' ilike '%inclination%');
  if v_graded <> 0 then
    raise exception 'DR3 go-live refused: % capstone field(s) grade a quantity this steady-state concentric engine cannot produce; the course teaches those and certifies none of them', v_graded;
  end if;

  -- THE SUM ASSERTION. The surface loss is zero, so the pump pressure MUST be
  -- the sum of the three named losses exactly. If a later edit recomputes one
  -- of the four at a different flow rate, mud or well and not the others, the
  -- sum breaks and this catches it. It is also the free check the capstone
  -- lesson tells the learner to run.
  select (f->>'expected')::numeric into v_pipe from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='hydraulics' and f->>'key'='pipe_dp_Pa';
  select (f->>'expected')::numeric into v_ann from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='hydraulics' and f->>'key'='annulus_dp_Pa';
  select (f->>'expected')::numeric into v_bit from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='hydraulics' and f->>'key'='bit_dp_Pa';
  select (f->>'expected')::numeric into v_pump from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='hydraulics' and f->>'key'='pump_pressure_Pa';
  if v_pipe is null or v_ann is null or v_bit is null or v_pump is null then
    raise exception 'DR3 go-live refused: one or more of the four Associate pressure fields is missing';
  end if;
  if abs((v_pipe + v_ann + v_bit) - v_pump) > 1 then
    raise exception 'DR3 go-live refused: the three losses sum to % and the pump field is %, a gap of %; the four are no longer the same run', v_pipe + v_ann + v_bit, v_pump, (v_pipe + v_ann + v_bit) - v_pump;
  end if;

  -- THE CAPSTONE-CONDITIONS ASSERTION. The capstone runs a mud, a flow rate
  -- and a trip speed the lessons never use. Two witnesses, one on each side of
  -- the course: the power-law n must be the NEW mud's value and not either
  -- lesson mud's, and the closed-to-open surge ratio must be the 0.75 m/s
  -- value rather than the 0.5 m/s one the lessons print.
  if not exists (
    select 1 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug='hydraulics' and f->>'key'='pl_n'
       and abs((f->>'expected')::numeric - 0.6560455987826389) < 0.0000001
  ) then
    raise exception 'DR3 go-live refused: the power-law n field is missing or is not the capstone mud''s value';
  end if;
  if exists (
    select 1 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug='hydraulics' and f->>'key'='closed_over_open_dp_ratio'
       and abs((f->>'expected')::numeric - 1.172219719213269) < 0.0001
  ) then
    raise exception 'DR3 go-live refused: the closed-over-open ratio has been moved onto the lessons own 0.5 m/s trip speed, which the lessons print';
  end if;

  -- THE UNITS ASSERTION. Two graded quantities have a plausible wrong unit a
  -- factor of a million or a hundred away, which a tolerance cannot catch: the
  -- four pressures are in PASCALS rather than megapascals, and the cuttings
  -- concentration is a PERCENTAGE rather than a fraction.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug='hydraulics' and f->>'key' in
     ('pipe_dp_Pa','annulus_dp_Pa','bit_dp_Pa','pump_pressure_Pa','slant_surge_dp_closed_Pa')
     and f->>'unit' = 'Pa';
  if v_graded <> 5 then
    raise exception 'DR3 go-live refused: % of the 5 pressure fields are graded in pascals', v_graded;
  end if;
  if not exists (
    select 1 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug='hydraulics' and f->>'key'='horizontal_worst_cuttings_conc_pct'
       and f->>'unit'='percent'
  ) then
    raise exception 'DR3 go-live refused: the cuttings concentration field is missing or is not graded as a percentage';
  end if;

  -- THE ECD ASSERTION. The horizontal well's equivalent circulating density
  -- must EXCEED the slant well's even though it is the shallower well in
  -- measured depth, because the equivalent circulating density divides by true
  -- vertical depth. If a later edit switched to measured depth, this inverts.
  if not exists (
    select 1
      from public.academy_capstones c,
           lateral jsonb_array_elements(c.fields) f1,
           lateral jsonb_array_elements(c.fields) f2
     where c.app_slug='hydraulics'
       and f1->>'key'='horizontal_ecd_at_td_kgm3'
       and f2->>'key'='slant_ecd_at_td_kgm3'
       and (f1->>'expected')::numeric > (f2->>'expected')::numeric
  ) then
    raise exception 'DR3 go-live refused: the horizontal ECD does not exceed the slant one, which means the divisor is no longer true vertical depth';
  end if;

  -- THE SWAB ASSERTION. The Expert capstone grades a SWAB equivalent mud
  -- weight, which must be BELOW the capstone mud weight of 1320, and a SURGE
  -- one, which must be above it. The swab is the only one of the four
  -- pressures below the mud weight and it is the one that lets a kick in.
  if not exists (
    select 1 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug='hydraulics' and f->>'key'='slant_swab_emw_open_kgm3'
       and (f->>'expected')::numeric < 1320
  ) then
    raise exception 'DR3 go-live refused: the swab equivalent mud weight is not below the capstone mud weight';
  end if;
  if not exists (
    select 1 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug='hydraulics' and f->>'key'='slant_surge_emw_closed_kgm3'
       and (f->>'expected')::numeric > 1320
  ) then
    raise exception 'DR3 go-live refused: the surge equivalent mud weight is not above the capstone mud weight';
  end if;

  -- TIER SEPARATION.
  select count(*) into v_graded from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug='hydraulics' and c.tier='beginner'
     and f->>'key' in ('pl_n','pump_pressure_Pa','bit_dp_Pa');
  if v_graded <> 3 then
    raise exception 'DR3 go-live refused: the Associate capstone grades % of its 3 rheology and pressure fields', v_graded;
  end if;
  select count(*) into v_graded from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug='hydraulics' and c.tier='intermediate'
     and f->>'key' in ('slant_ecd_at_td_kgm3','horizontal_min_transport_ratio','horizontal_min_flow_tr080_m3s');
  if v_graded <> 3 then
    raise exception 'DR3 go-live refused: the Professional capstone grades % of its 3 ECD and cleaning fields', v_graded;
  end if;
  select count(*) into v_graded from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug='hydraulics' and c.tier='advanced'
     and f->>'key' in ('slant_surge_dp_closed_Pa','closed_over_open_dp_ratio','slant_max_trip_speed_ms');
  if v_graded <> 3 then
    raise exception 'DR3 go-live refused: the Expert capstone grades % of its 3 surge and window fields', v_graded;
  end if;

  if not exists (select 1 from public.academy_apps where slug='hydraulics' and module='drilling') then
    raise exception 'DR3 go-live refused: hydraulics catalog row is missing or not mapped to the drilling module';
  end if;
end
$$;

update public.academy_apps set status = 'available' where slug = 'hydraulics';
