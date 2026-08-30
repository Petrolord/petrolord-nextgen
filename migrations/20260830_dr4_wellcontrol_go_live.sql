-- ============================================================================
-- DR4 GO LIVE (HELD): make Well Control enrollable.
--
-- DO NOT APPLY until a NextGen production upload carries the
-- WellControlLearningPage route (/dashboard/apps/wellcontrol) and the deep
-- course routes. RC1 through RC7 and DR1 through DR3 are held on the SAME gate.
--
-- Precondition checklist:
--   1. nextgen.petrolord.com serves a build containing /dashboard/apps/wellcontrol.
--   2. academy_course_structures has three active wellcontrol rows.
--   3. academy_quiz_questions holds 396 wellcontrol rows (132 per tier).
--   4. academy_capstones holds the three wellcontrol rows.
-- ============================================================================

do $$
declare
  v_structures integer;
  v_capstones  integer;
  v_questions  integer;
  v_graded     integer;
  v_kt         numeric;
  v_shoe       numeric;
  v_slant      numeric;
  v_horiz      numeric;
begin
  select count(*) into v_structures
    from public.academy_course_structures where app_slug = 'wellcontrol' and active;
  if v_structures <> 3 then
    raise exception 'DR4 go-live refused: wellcontrol has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions
    from public.academy_quiz_questions where app_slug = 'wellcontrol';
  if v_questions <> 396 then
    raise exception 'DR4 go-live refused: wellcontrol has % quiz questions, expected 396 (132 per tier)', v_questions;
  end if;

  select count(*) into v_capstones
    from public.academy_capstones where app_slug = 'wellcontrol';
  if v_capstones <> 3 then
    raise exception 'DR4 go-live refused: wellcontrol has % capstones, expected 3', v_capstones;
  end if;

  -- THE SCOPE ASSERTION. Five things are taught in Expert m05 and certified
  -- nowhere: subsea and floating operations, gas migration and volumetric
  -- control, dissolved gas in oil-based mud, the casing pressure history, and
  -- multiphase or dispersed influx behaviour. A course that teaches a topic
  -- implies it is worth learning; a course that GRADES one implies the learner
  -- can produce the answer and that the answer is worth producing. This
  -- migration keeps those two claims apart.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'wellcontrol'
     and (f->>'key' ilike '%subsea%'
       or f->>'key' ilike '%riser%'
       or f->>'key' ilike '%choke_line%'
       or f->>'key' ilike '%chokeline%'
       or f->>'key' ilike '%floater%'
       or f->>'key' ilike '%migrat%'
       or f->>'key' ilike '%volumetric%'
       or f->>'key' ilike '%dissolv%'
       or f->>'key' ilike '%solubil%'
       or f->>'key' ilike '%casing_pressure_history%'
       or f->>'key' ilike '%sicp_at_%'
       or f->>'key' ilike '%multiphase%'
       or f->>'key' ilike '%dispers%'
       or f->>'key' ilike '%slip_velocity%'
       or f->>'key' ilike '%_time_%'
       or f->>'key' ilike '%hours%');
  if v_graded <> 0 then
    raise exception 'DR4 go-live refused: % capstone field(s) grade a quantity this static surface-BOP engine cannot produce; Expert m05 teaches those five and certifies none of them', v_graded;
  end if;

  -- THE TWO-CASES ASSERTION. The reported kick tolerance is the SMALLER of the
  -- shut-in and circulated cases. The Expert capstone grades both the reported
  -- value and the circulated case separately, and on the SLANT well the
  -- circulated case is the larger of the two. If a later edit swapped the two
  -- fields, or changed which case the engine reports, this inverts.
  select (f->>'expected')::numeric into v_kt from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='wellcontrol' and f->>'key'='slant_kick_tolerance_m3';
  select (f->>'expected')::numeric into v_shoe from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='wellcontrol' and f->>'key'='slant_kt_at_shoe_m3';
  if v_kt is null or v_shoe is null then
    raise exception 'DR4 go-live refused: one of the two Expert kick tolerance fields is missing';
  end if;
  if v_kt >= v_shoe then
    raise exception 'DR4 go-live refused: the reported slant kick tolerance (%) is not smaller than its circulated case (%); the reported value is meant to be the smaller of the two', v_kt, v_shoe;
  end if;

  -- THE MAASP ASSERTION. MAASP is the fracture pressure at the shoe less the
  -- mud column above it, so the well with the DEEPER shoe in true vertical
  -- depth carries the SMALLER MAASP at the same mud weight and fracture
  -- gradient. The slant shoe is at 1282.2 m and the horizontal one at 1172.3.
  -- If a later edit switched to measured depth, or dropped the mud column
  -- term, this inverts.
  select (f->>'expected')::numeric into v_slant from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='wellcontrol' and f->>'key'='slant_maasp_Pa';
  select (f->>'expected')::numeric into v_horiz from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='wellcontrol' and f->>'key'='horizontal_maasp_Pa';
  if v_slant is null or v_horiz is null then
    raise exception 'DR4 go-live refused: one of the two MAASP fields is missing';
  end if;
  if v_slant <= v_horiz then
    raise exception 'DR4 go-live refused: the slant MAASP (%) does not exceed the horizontal one (%); at 1820 kg/m3 fracture equivalent the deeper shoe has the larger headroom over the same mud, so the divisor or the column term has changed', v_slant, v_horiz;
  end if;

  -- THE CAPSTONE-CONDITIONS ASSERTION. The capstone runs a kick, a fracture
  -- gradient and a kick intensity the lessons never use. Two witnesses. First,
  -- the slant kick tolerance must NOT be the lessons' 1750 and 60 value of
  -- 2.783680489 that Expert m02 and m04 both print. Second, the Associate
  -- capstone must grade the SLANT well's string volume rather than the
  -- HORIZONTAL well's 24.23065790955871, which the lessons walk in detail.
  if exists (
    select 1 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug='wellcontrol' and f->>'key'='slant_kick_tolerance_m3'
       and abs((f->>'expected')::numeric - 2.783680489) < 0.001
  ) then
    raise exception 'DR4 go-live refused: the slant kick tolerance has been moved back onto the lessons own 1750 kg/m3 and 60 kg/m3 conditions, which the lessons print';
  end if;
  if exists (
    select 1 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug='wellcontrol' and f->>'key'='slant_string_volume_m3'
       and abs((f->>'expected')::numeric - 24.23065790955871) < 0.01
  ) then
    raise exception 'DR4 go-live refused: the Associate string volume field holds the HORIZONTAL well value, which the lessons walk step by step';
  end if;

  -- THE PUBLISHED-GOLDEN ASSERTION. The first Expert field list carried a
  -- horizontal kick tolerance that landed 6.1e-5 from the published golden
  -- 1.078825342 inside a 5e-4 tolerance, which a learner could have scored by
  -- reading the goldens. It was replaced by horizontal_maasp_Pa. If it ever
  -- comes back at a value the goldens publish, refuse.
  if exists (
    select 1 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug='wellcontrol'
       and abs((f->>'expected')::numeric - 1.078825342) < 0.0005
  ) then
    raise exception 'DR4 go-live refused: a graded field sits within its tolerance of the published golden horizontal kick tolerance, which makes it a lookup rather than a calculation';
  end if;

  -- THE UNITS ASSERTION. Six graded quantities have a plausible wrong unit a
  -- factor of a million away, which a tolerance cannot catch: the four
  -- pressures are in PASCALS rather than megapascals.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug='wellcontrol' and f->>'key' in
     ('formation_pressure_Pa','icp_Pa','fcp_Pa','slant_maasp_Pa','slant_headroom_Pa','horizontal_maasp_Pa')
     and f->>'unit' = 'Pa';
  if v_graded <> 6 then
    raise exception 'DR4 go-live refused: % of the 6 pressure fields are graded in pascals', v_graded;
  end if;

  -- THE KILL SHEET ASSERTION. The final circulating pressure is the slow
  -- circulating rate pressure SCALED BY THE DENSITY RATIO, so it must not be
  -- the raw 4500000 Pa, and the initial circulating pressure must exceed it
  -- because it carries the shut-in deficit on top of the same friction term.
  if exists (
    select 1 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug='wellcontrol' and f->>'key'='fcp_Pa'
       and abs((f->>'expected')::numeric - 4500000) < 1000
  ) then
    raise exception 'DR4 go-live refused: the final circulating pressure is the raw slow circulating rate pressure, so the density scaling has been lost';
  end if;
  if not exists (
    select 1
      from public.academy_capstones c,
           lateral jsonb_array_elements(c.fields) f1,
           lateral jsonb_array_elements(c.fields) f2
     where c.app_slug='wellcontrol'
       and f1->>'key'='icp_Pa' and f2->>'key'='fcp_Pa'
       and (f1->>'expected')::numeric > (f2->>'expected')::numeric
  ) then
    raise exception 'DR4 go-live refused: the initial circulating pressure does not exceed the final one, so the schedule would rise rather than fall';
  end if;

  -- TIER SEPARATION.
  select count(*) into v_graded from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug='wellcontrol' and c.tier='beginner'
     and f->>'key' in ('slant_string_volume_m3','slant_bottoms_up_strokes','slant_tvd_at_shoe_m');
  if v_graded <> 3 then
    raise exception 'DR4 go-live refused: the Associate capstone grades % of its 3 span-walk fields', v_graded;
  end if;
  select count(*) into v_graded from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug='wellcontrol' and c.tier='intermediate'
     and f->>'key' in ('kill_mud_density_kgm3','fcp_Pa','influx_height_m');
  if v_graded <> 3 then
    raise exception 'DR4 go-live refused: the Professional capstone grades % of its 3 kill sheet and influx fields', v_graded;
  end if;
  select count(*) into v_graded from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug='wellcontrol' and c.tier='advanced'
     and f->>'key' in ('slant_maasp_Pa','slant_kick_tolerance_m3','horizontal_maasp_Pa');
  if v_graded <> 3 then
    raise exception 'DR4 go-live refused: the Expert capstone grades % of its 3 shoe-limit fields', v_graded;
  end if;

  if not exists (select 1 from public.academy_apps where slug='wellcontrol' and module='drilling') then
    raise exception 'DR4 go-live refused: wellcontrol catalog row is missing or not mapped to the drilling module';
  end if;
end
$$;

update public.academy_apps set status = 'available' where slug = 'wellcontrol';
