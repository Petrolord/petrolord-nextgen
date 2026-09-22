-- ============================================================================
-- B5 FOLLOW-ON W4 PART B (typed "your case" panel modes): consequence.
--
-- Plan of record: docs/graded-field-audit/FOLLOW-ON-PROGRAMME.md section 1,
-- route (b), and decision D2 (a panel may reach the capstone case when the
-- learner types it; no panel DEFAULT state lands on a graded answer). Owner
-- approved D1 to D7 as recommended, 2026-09-21. The panels ship with the
-- NextGen zip; this file adds one sentence to each brief saying where the case
-- can be typed.
--
-- INTERMEDIATE (6 graded field(s) now read in a typed panel mode:
-- yokri_flame_length_with_wind_m, yokri_flame_tilt_deg,
-- yokri_solid_flame_heat_flux_w_m2, yokri_surface_emissive_power_actual_w_m2,
-- yokri_surface_emissive_power_mudan_w_m2, yokri_view_factor_max)
--   POINTER appended: On the course panel, type this pool, the 72 m target and
--   the 0.765 transmissivity into the Fire explorer's heat flux view: it runs
--   the whole chain unrounded and prints every value to at least the precision
--   graded here.
--
-- WHAT DOES NOT MOVE. `fields` (every key, label, unit, expected and
-- tolerance), title, dataset, status and the row. The guard requires `fields`
-- to equal its live value exactly, before and after, so no answer grades
-- differently and no attempts guard is needed.
--
-- GUARDS. Each prompt must hold its post-W1 text (md5, rewritten) or its W4
-- text (left alone). Anything else raises and the file rolls back. A file that
-- will write first checks the W1 post-state and refuses without it. Generated
-- by docs/graded-field-audit/w4b_capstones.py from w4b/consequence.json. SAFE TO
-- RE-RUN: a second run writes nothing.
-- ============================================================================

do $$
declare
  v_n        integer;
  v_count    integer;
  v_written  integer := 0;
  v_s0       text;
begin
  -- consequence / intermediate
  select count(*) into v_n from public.academy_capstones where app_slug = 'consequence' and tier = 'intermediate' and active;
  if v_n <> 1 then raise exception 'w4b consequence refused: consequence/intermediate has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = 'f02dc90e3fdfb596a62742b5930aa0c1' and fields = '[{"key": "yokri_flame_length_with_wind_m", "tol": 5E-7, "unit": "m", "label": "The flame length with wind", "expected": 20.618159361645755}, {"key": "yokri_flame_tilt_deg", "tol": 5E-7, "unit": "degrees", "label": "The flame tilt from the vertical", "expected": 53.02368839919855}, {"key": "yokri_surface_emissive_power_mudan_w_m2", "tol": 5E-7, "unit": "W/m2", "label": "The surface emissive power from the diameter", "expected": 22738.722971011157}, {"key": "yokri_surface_emissive_power_actual_w_m2", "tol": 5E-7, "unit": "W/m2", "label": "The surface emissive power from the radiative fraction with soot", "expected": 37784.162897552}, {"key": "yokri_view_factor_max", "tol": 5E-13, "unit": "dimensionless", "label": "The maximum view factor at the target", "expected": 0.04602429827467467}, {"key": "yokri_solid_flame_heat_flux_w_m2", "tol": 5E-7, "unit": "W/m2", "label": "The heat flux at the target", "expected": 1330.3270311907092}]'::jsonb then 'old'
              when md5(prompt) = '17ff9ad0d16870c67808da77141ebed2' and fields = '[{"key": "yokri_flame_length_with_wind_m", "tol": 5E-7, "unit": "m", "label": "The flame length with wind", "expected": 20.618159361645755}, {"key": "yokri_flame_tilt_deg", "tol": 5E-7, "unit": "degrees", "label": "The flame tilt from the vertical", "expected": 53.02368839919855}, {"key": "yokri_surface_emissive_power_mudan_w_m2", "tol": 5E-7, "unit": "W/m2", "label": "The surface emissive power from the diameter", "expected": 22738.722971011157}, {"key": "yokri_surface_emissive_power_actual_w_m2", "tol": 5E-7, "unit": "W/m2", "label": "The surface emissive power from the radiative fraction with soot", "expected": 37784.162897552}, {"key": "yokri_view_factor_max", "tol": 5E-13, "unit": "dimensionless", "label": "The maximum view factor at the target", "expected": 0.04602429827467467}, {"key": "yokri_solid_flame_heat_flux_w_m2", "tol": 5E-7, "unit": "W/m2", "label": "The heat flux at the target", "expected": 1330.3270311907092}]'::jsonb then 'new'
              else 'other' end
    into v_s0 from public.academy_capstones where app_slug = 'consequence' and tier = 'intermediate' and active;
  if v_s0 = 'other' then
    raise exception 'w4b consequence refused: consequence/intermediate matches neither its published form (prompt md5 f02dc90e3fdfb596a62742b5930aa0c1) nor its W4 form (prompt md5 17ff9ad0d16870c67808da77141ebed2), with the fields this file was generated against';
  end if;

  -- nothing to write: every row is already in its W4 form
  if v_s0 = 'new' then
    raise notice 'w4b consequence: 0 of 1 row(s) written, all already applied';
    return;
  end if;

  -- W1 (20261024*) must be applied first: its post-state is this file's base
  if not exists (select 1 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
                  where c.app_slug = 'mbal' and c.tier = 'advanced' and c.active and f->>'key' = 'a111_ddi')
     or not exists (select 1 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
                     where c.app_slug = 'petrophysics' and c.tier = 'advanced' and c.active and f->>'key' = 'rw_arps'
                       and (f->>'tol')::float8 = 0.00005) then
    raise exception 'w4b consequence refused: W1 (20261024*) is not applied on this database; apply it first (/root/w1-apply/apply.sh apply --prod)';
  end if;

  if v_s0 = 'old' then
    update public.academy_capstones
       set prompt = 'YOKRI, a bund fire in a tank farm on a windy afternoon, worked through the solid flame model. The properties below are illustrative, chosen for this exercise. THE POOL: 31.5 m diameter, kerosene, its burning flux from the Babrauskas table the engine carries; heat of combustion 43000000 J/kg. THE AIR: wind at 10 m 6 m/s, air density 1.2 kg/m3, air kinematic viscosity 1.48e-5 m2/s. Take the flame length by Thomas with wind and the tilt from the wind, the flame base radius half the pool diameter. THE FLAME SURFACE: compute the surface emissive power two ways, from the diameter (Mudan) and from a radiative fraction of 0.235 with a soot fraction of 0.8 and the engine''s default soot emissive power; the heat flux uses the second. THE TARGET: at ground level 72 m downwind of the pool centre, the flame leaning toward it, with a stated atmospheric transmissivity of 0.765. Report six values: the flame length with wind in m; the flame tilt from the vertical in degrees; the surface emissive power from the diameter and the surface emissive power from the radiative fraction with soot, each in W/m2; the maximum view factor at the target; and the heat flux at the target in W/m2. The view factor to twelve decimals, every other value to six decimals. On the course panel, type this pool, the 72 m target and the 0.765 transmissivity into the Fire explorer''s heat flux view: it runs the whole chain unrounded and prints every value to at least the precision graded here.'
     where app_slug = 'consequence' and tier = 'intermediate' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w4b consequence refused: consequence/intermediate updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = '17ff9ad0d16870c67808da77141ebed2' and fields = '[{"key": "yokri_flame_length_with_wind_m", "tol": 5E-7, "unit": "m", "label": "The flame length with wind", "expected": 20.618159361645755}, {"key": "yokri_flame_tilt_deg", "tol": 5E-7, "unit": "degrees", "label": "The flame tilt from the vertical", "expected": 53.02368839919855}, {"key": "yokri_surface_emissive_power_mudan_w_m2", "tol": 5E-7, "unit": "W/m2", "label": "The surface emissive power from the diameter", "expected": 22738.722971011157}, {"key": "yokri_surface_emissive_power_actual_w_m2", "tol": 5E-7, "unit": "W/m2", "label": "The surface emissive power from the radiative fraction with soot", "expected": 37784.162897552}, {"key": "yokri_view_factor_max", "tol": 5E-13, "unit": "dimensionless", "label": "The maximum view factor at the target", "expected": 0.04602429827467467}, {"key": "yokri_solid_flame_heat_flux_w_m2", "tol": 5E-7, "unit": "W/m2", "label": "The heat flux at the target", "expected": 1330.3270311907092}]'::jsonb) from public.academy_capstones where app_slug = 'consequence' and tier = 'intermediate' and active) is not true then
    raise exception 'w4b consequence refused: consequence/intermediate does not read back as its W4 form';
  end if;

  raise notice 'w4b consequence: % of 1 row(s) written, % already applied', v_written, 1 - v_written;
end $$;
