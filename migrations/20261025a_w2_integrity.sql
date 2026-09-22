-- ============================================================================
-- B5 FOLLOW-ON W2 (publish inputs in prompts and lessons): integrity.
--
-- Plan of record: docs/graded-field-audit/FOLLOW-ON-PROGRAMME.md section 1,
-- route (a), and the spec docs/graded-field-audit/w2/integrity.json (the
-- inputs, where each came from, and the key each reproduces through the
-- vendored engines). Owner approved D1 to D7 as recommended, 2026-09-21.
--
-- INTERMEDIATE
--   Prompt only, no field moves. The prompt said each bounding element carries a
--   limit, a true vertical depth, a far side density and a role, but gave none
--   of them: the KESTREL A-7 rows, the annulus fluids and the D1 survey existed
--   only in the generator /root/dr-wip-integrity/dr11_fields.mjs (B5 finding 1).
--   The prompt now publishes the survey, both annuli and the displacement case
--   row by row, with g and the psi conversion, so every field is the taught row
--   arithmetic of m02 to m05 worked at full precision. Keys, expected values and
--   tolerances are unchanged, so nobody is re-scored.
--   PROMPT was: Each bounding element carries its own pressure limit, its true
--   vertical depth, the density of whatever stands on the FAR side of it, and a
--   role from which the RP 90 design factor is looked up.
--   PROMPT now: Each bounding element carries its own pressure limit, its depth,
--   the density of whatever stands on the FAR side of it, and a role from which
--   the RP 90 design factor is looked up, or a factor stated with it. THE WELL.
--   The survey is vertical to 500 m MD, builds at 2 degrees per 30 m on an
--   azimuth of 45 degrees to 40 degrees at 1100 m MD, and holds 40 degrees below
--   that; take each true vertical depth from it by minimum curvature. Take g as
--   9.80665 m/s2 and 1 psi as 6894.757293168 Pa. THE A ANNULUS holds 1250 kg/m3
--   packer fluid and is bounded by four rows, each given as name, role, limit,
--   depth and far side density: 9-5/8 production casing burst, role
--   outer-casing-burst, 5220 psi, at the production shoe at 2265 m MD, far side
--   1015 kg/m3; 5-1/2 completion tubing collapse, role inner-tubing-collapse,
--   4040 psi, at the packer at 2210 m MD, far side 1000 kg/m3; 9-5/8 shoe
--   formation strength, role shoe-formation, a leak off equivalent of 1100 kg/m3
--   times g times the shoe TVD, at the production shoe at 2265 m MD, far side
--   1015 kg/m3; Subsea wellhead annulus access rating, role rating, 5000 psi, at
--   the wellhead on the seabed at 320 m MD, far side 1025 kg/m3. THE B ANNULUS
--   holds 1150 kg/m3 and its three rows carry stated design and wear factors in
--   place of the RP 90 roles: 13-3/8 surface casing burst, factor 0.72, 3450
--   psi, at the surface shoe at 1450 m MD, far side 1015 kg/m3; 9-5/8 production
--   casing burst wear derated, factor 0.62, 5220 psi, at the production shoe at
--   2265 m MD, far side 1250 kg/m3; 13-3/8 shoe formation strength, factor 1, a
--   leak off equivalent of 1550 kg/m3 times g times the shoe TVD, at the surface
--   shoe at 1450 m MD, far side 1015 kg/m3. THE DISPLACEMENT CASE puts 1650
--   kg/m3 brine in the A annulus while the tubing unloads to gas of 150 kg/m3,
--   and has one row: 5-1/2 completion tubing collapse with the tubing gas
--   filled, role inner-tubing-collapse, 4040 psi, at the packer at 2210 m MD,
--   far side 150 kg/m3.
--
-- ADVANCED
--   Prompt only, no field moves. The P&A inputs (the five plug intervals, the
--   three designed geometries, the zones and the annular cement interval)
--   existed only in /root/dr-wip-integrity/dr11_fields.mjs; the prompt now
--   publishes them, so each field is the taught closed form (capacities, spacer
--   ratio, settle, margins, takeoff). The prompt also said field 6 sums every
--   plug including the two without a designed placement, which was false: the
--   engine sums designed placements only (plugAbandonment.js takeoff) and lists
--   the other two by name. That sentence and the single "35 percent excess" (it
--   is P1's; P3 and S1 carry their own) are corrected. Keys, expected values and
--   tolerances are unchanged.
--   PROMPT was: FIVE plugs are proposed across two flowing zones plus a surface
--   phase, at 35 percent excess.
--   PROMPT now: FIVE plugs are proposed across two flowing zones plus a surface
--   phase, each designed plug at its own stated excess. THE PLUGS are balanced
--   through a stinger of 0.0889 m outside diameter (3-1/2 in) and 0.076 m
--   inside: P1 reservoir primary, 2568.5 to 2740 m MD, in the 7 in liner of
--   inside diameter 0.1594 m, at 35 percent excess with 1.6 m3 of spacer ahead,
--   set on a tagged foundation; P2 reservoir secondary, 2020 to 2115.5 m MD,
--   with no placement designed; P3 gas stringer primary, 1148 to 1292.5 m MD, in
--   the 9-5/8 casing of inside diameter 0.2244 m, at 25 percent excess with 1.2
--   m3 of spacer ahead; P4 gas stringer secondary, 946 to 1062.5 m MD, with no
--   placement designed; S1 environmental plug, 0 to 55 m MD, in the 13-3/8
--   casing of inside diameter 0.3151 m, at 50 percent excess with 0.8 m3 of
--   spacer ahead, the surface plug. THE ZONES, both able to flow: Kestrel
--   reservoir sand, 2611 to 2742 m MD; Shallow gas stringer, 1240 to 1272 m MD.
--   THE ANNULAR CEMENT behind the 7 in liner opposite P1 runs from 2455 to
--   2528.5 m MD, and no cement evaluation log has been run on it.
--   PROMPT was: Field 6 sums every plug including the two the programme does not
--   design a placement for, so it is not the sum of the designed slurries alone.
--   PROMPT now: Field 6 is the programme takeoff: it sums the slurry of every
--   plug with a designed placement, and the two plugs without one add no volume
--   and are listed by name instead.
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
begin
  -- integrity / intermediate
  select count(*) into v_n from public.academy_capstones where app_slug = 'integrity' and tier = 'intermediate' and active;
  if v_n <> 1 then raise exception 'w2 integrity refused: integrity/intermediate has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = '95b1f9c64524857ca623799ec1fa1853' and fields = '[{"key": "mawop_a_tubing_row_pa", "tol": 10, "unit": "Pa", "label": "A annulus, tubing collapse row", "expected": 16226227.041788332}, {"key": "mawop_a_shoe_row_pa", "tol": 10, "unit": "Pa", "label": "A annulus, shoe strength row", "expected": 16497910.032817762}, {"key": "mawop_a_pa", "tol": 10, "unit": "Pa", "label": "A annulus MAWOP", "expected": 13513225.370183308}, {"key": "mawop_a_governing_tvd_m", "tol": 0.0005, "unit": "m", "label": "Governing element TVD", "expected": 1944.8770336087282}, {"key": "maasp_b_pa", "tol": 10, "unit": "Pa", "label": "B annulus MAASP", "expected": 15378302.866843894}, {"key": "maasp_gasfilled_tubing_row_pa", "tol": 10, "unit": "Pa", "label": "Displacement case, tubing row", "expected": -7098210.7407652065}]'::jsonb then 'old'
              when md5(prompt) = '06b571326674a61a218ec270ff922132' and fields = '[{"key": "mawop_a_tubing_row_pa", "tol": 10, "unit": "Pa", "label": "A annulus, tubing collapse row", "expected": 16226227.041788332}, {"key": "mawop_a_shoe_row_pa", "tol": 10, "unit": "Pa", "label": "A annulus, shoe strength row", "expected": 16497910.032817762}, {"key": "mawop_a_pa", "tol": 10, "unit": "Pa", "label": "A annulus MAWOP", "expected": 13513225.370183308}, {"key": "mawop_a_governing_tvd_m", "tol": 0.0005, "unit": "m", "label": "Governing element TVD", "expected": 1944.8770336087282}, {"key": "maasp_b_pa", "tol": 10, "unit": "Pa", "label": "B annulus MAASP", "expected": 15378302.866843894}, {"key": "maasp_gasfilled_tubing_row_pa", "tol": 10, "unit": "Pa", "label": "Displacement case, tubing row", "expected": -7098210.7407652065}]'::jsonb then 'new'
              else 'other' end
    into v_s0 from public.academy_capstones where app_slug = 'integrity' and tier = 'intermediate' and active;
  if v_s0 = 'other' then
    raise exception 'w2 integrity refused: integrity/intermediate matches neither its published form (prompt md5 95b1f9c64524857ca623799ec1fa1853) nor its W2 form (prompt md5 06b571326674a61a218ec270ff922132), with the fields this file was generated against';
  end if;

  -- integrity / advanced
  select count(*) into v_n from public.academy_capstones where app_slug = 'integrity' and tier = 'advanced' and active;
  if v_n <> 1 then raise exception 'w2 integrity refused: integrity/advanced has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = '6694359b36efda25cd2f10438580e048' and fields = '[{"key": "plug_slurry_m3", "tol": 5E-7, "unit": "m3", "label": "Reservoir plug slurry", "expected": 4.620238645056858}, {"key": "plug_spacer_behind_m3", "tol": 5E-8, "unit": "m3", "label": "Spacer behind", "expected": 0.5279360645295814}, {"key": "plug_top_settle_m", "tol": 0.000005, "unit": "m", "label": "Plug top settle", "expected": 21.154551869215993}, {"key": "above_source_margin_m", "tol": 0.000005, "unit": "m", "label": "Above source margin", "expected": -7.5}, {"key": "annular_cement_margin_m", "tol": 0.000005, "unit": "m", "label": "Annular cement margin", "expected": -26.5}, {"key": "program_slurry_takeoff_m3", "tol": 5E-7, "unit": "m3", "label": "Programme slurry takeoff", "expected": 18.197179289478704}]'::jsonb then 'old'
              when md5(prompt) = 'aa879c16fc696e2119b0086f1fd9d9d4' and fields = '[{"key": "plug_slurry_m3", "tol": 5E-7, "unit": "m3", "label": "Reservoir plug slurry", "expected": 4.620238645056858}, {"key": "plug_spacer_behind_m3", "tol": 5E-8, "unit": "m3", "label": "Spacer behind", "expected": 0.5279360645295814}, {"key": "plug_top_settle_m", "tol": 0.000005, "unit": "m", "label": "Plug top settle", "expected": 21.154551869215993}, {"key": "above_source_margin_m", "tol": 0.000005, "unit": "m", "label": "Above source margin", "expected": -7.5}, {"key": "annular_cement_margin_m", "tol": 0.000005, "unit": "m", "label": "Annular cement margin", "expected": -26.5}, {"key": "program_slurry_takeoff_m3", "tol": 5E-7, "unit": "m3", "label": "Programme slurry takeoff", "expected": 18.197179289478704}]'::jsonb then 'new'
              else 'other' end
    into v_s1 from public.academy_capstones where app_slug = 'integrity' and tier = 'advanced' and active;
  if v_s1 = 'other' then
    raise exception 'w2 integrity refused: integrity/advanced matches neither its published form (prompt md5 6694359b36efda25cd2f10438580e048) nor its W2 form (prompt md5 aa879c16fc696e2119b0086f1fd9d9d4), with the fields this file was generated against';
  end if;

  -- nothing to write: every row is already in its W2 form
  if v_s0 = 'new' and v_s1 = 'new' then
    raise notice 'w2 integrity: 0 of 2 row(s) written, all already applied';
    return;
  end if;

  -- W1 (20261024a/b) must be applied first: production holds it, and the W2
  -- apply script checks all 34 files; this reads two of its rows
  if exists (select 1 from public.academy_capstones where app_slug = 'integrity' and tier = 'beginner' and active and md5(prompt) <> '0e0ac66d6b97e9f7f66b5055e1fddf7d')
     or exists (select 1 from public.academy_capstones where app_slug = 'welldata' and tier = 'beginner' and active and md5(prompt) <> 'f362ed27e7d8766e7e51dcf1ca0e5e6e') then
    raise exception 'w2 integrity refused: W1 (20261024*) is not applied on this database; apply it first (/root/w1-apply/apply.sh apply --prod)';
  end if;

  if v_s0 = 'old' then
    update public.academy_capstones
       set prompt = 'Six values for the annuli of the Associate capstone well. Each bounding element carries its own pressure limit, its depth, the density of whatever stands on the FAR side of it, and a role from which the RP 90 design factor is looked up, or a factor stated with it. THE WELL. The survey is vertical to 500 m MD, builds at 2 degrees per 30 m on an azimuth of 45 degrees to 40 degrees at 1100 m MD, and holds 40 degrees below that; take each true vertical depth from it by minimum curvature. Take g as 9.80665 m/s2 and 1 psi as 6894.757293168 Pa. THE A ANNULUS holds 1250 kg/m3 packer fluid and is bounded by four rows, each given as name, role, limit, depth and far side density: 9-5/8 production casing burst, role outer-casing-burst, 5220 psi, at the production shoe at 2265 m MD, far side 1015 kg/m3; 5-1/2 completion tubing collapse, role inner-tubing-collapse, 4040 psi, at the packer at 2210 m MD, far side 1000 kg/m3; 9-5/8 shoe formation strength, role shoe-formation, a leak off equivalent of 1100 kg/m3 times g times the shoe TVD, at the production shoe at 2265 m MD, far side 1015 kg/m3; Subsea wellhead annulus access rating, role rating, 5000 psi, at the wellhead on the seabed at 320 m MD, far side 1025 kg/m3. THE B ANNULUS holds 1150 kg/m3 and its three rows carry stated design and wear factors in place of the RP 90 roles: 13-3/8 surface casing burst, factor 0.72, 3450 psi, at the surface shoe at 1450 m MD, far side 1015 kg/m3; 9-5/8 production casing burst wear derated, factor 0.62, 5220 psi, at the production shoe at 2265 m MD, far side 1250 kg/m3; 13-3/8 shoe formation strength, factor 1, a leak off equivalent of 1550 kg/m3 times g times the shoe TVD, at the surface shoe at 1450 m MD, far side 1015 kg/m3. THE DISPLACEMENT CASE puts 1650 kg/m3 brine in the A annulus while the tubing unloads to gas of 150 kg/m3, and has one row: 5-1/2 completion tubing collapse with the tubing gas filled, role inner-tubing-collapse, 4040 psi, at the packer at 2210 m MD, far side 150 kg/m3. Report, for the A ANNULUS: (1) the allowable at the COMPLETION TUBING COLLAPSE row in pascals; (2) the allowable at the SHOE FORMATION STRENGTH row; (3) the MAWOP of the A annulus; and (4) the TRUE VERTICAL DEPTH of the GOVERNING element, in metres. Then (5) the MAASP of the B ANNULUS in pascals; and (6) the allowable at the tubing collapse row in the DISPLACEMENT case, where the annulus carries heavy brine and the tubing has been unloaded to GAS. Traps. The engine takes TRUE VERTICAL depth and not measured depth, because a head is a vertical quantity, so convert through the survey first. Field 3 is the MINIMUM over the rows and NOT the first row and NOT the smallest raw rating: the ROLE factor can invert the ranking, and on this well an outer casing with the highest rating governs because it carries the lowest factor. Field 6 is NEGATIVE and the sign is part of the answer: hydrostatic alone exceeds the rating, so the engine clamps the reported MAASP to zero and raises its negative flag, and reporting the clamped zero as if it were the row would lose the finding. Free checks: field 3 must be no larger than field 1 or field 2, since it is the minimum over a set that includes them; field 4 must be the depth of whichever row produced field 3; and field 6 must be below zero, because that is the whole point of the displacement case.'
     where app_slug = 'integrity' and tier = 'intermediate' and active and md5(prompt) = '95b1f9c64524857ca623799ec1fa1853';
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w2 integrity refused: integrity/intermediate updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = '06b571326674a61a218ec270ff922132' and fields = '[{"key": "mawop_a_tubing_row_pa", "tol": 10, "unit": "Pa", "label": "A annulus, tubing collapse row", "expected": 16226227.041788332}, {"key": "mawop_a_shoe_row_pa", "tol": 10, "unit": "Pa", "label": "A annulus, shoe strength row", "expected": 16497910.032817762}, {"key": "mawop_a_pa", "tol": 10, "unit": "Pa", "label": "A annulus MAWOP", "expected": 13513225.370183308}, {"key": "mawop_a_governing_tvd_m", "tol": 0.0005, "unit": "m", "label": "Governing element TVD", "expected": 1944.8770336087282}, {"key": "maasp_b_pa", "tol": 10, "unit": "Pa", "label": "B annulus MAASP", "expected": 15378302.866843894}, {"key": "maasp_gasfilled_tubing_row_pa", "tol": 10, "unit": "Pa", "label": "Displacement case, tubing row", "expected": -7098210.7407652065}]'::jsonb) from public.academy_capstones where app_slug = 'integrity' and tier = 'intermediate' and active) is not true then
    raise exception 'w2 integrity refused: integrity/intermediate does not read back as its W2 form';
  end if;

  if v_s1 = 'old' then
    update public.academy_capstones
       set prompt = 'Six values for a permanent abandonment of the Associate capstone well. FIVE plugs are proposed across two flowing zones plus a surface phase, each designed plug at its own stated excess. THE PLUGS are balanced through a stinger of 0.0889 m outside diameter (3-1/2 in) and 0.076 m inside: P1 reservoir primary, 2568.5 to 2740 m MD, in the 7 in liner of inside diameter 0.1594 m, at 35 percent excess with 1.6 m3 of spacer ahead, set on a tagged foundation; P2 reservoir secondary, 2020 to 2115.5 m MD, with no placement designed; P3 gas stringer primary, 1148 to 1292.5 m MD, in the 9-5/8 casing of inside diameter 0.2244 m, at 25 percent excess with 1.2 m3 of spacer ahead; P4 gas stringer secondary, 946 to 1062.5 m MD, with no placement designed; S1 environmental plug, 0 to 55 m MD, in the 13-3/8 casing of inside diameter 0.3151 m, at 50 percent excess with 0.8 m3 of spacer ahead, the surface plug. THE ZONES, both able to flow: Kestrel reservoir sand, 2611 to 2742 m MD; Shallow gas stringer, 1240 to 1272 m MD. THE ANNULAR CEMENT behind the 7 in liner opposite P1 runs from 2455 to 2528.5 m MD, and no cement evaluation log has been run on it. Report: (1) the SLURRY VOLUME of the reservoir primary plug in cubic metres; (2) its SPACER BEHIND volume; (3) the SETTLE of that plug, meaning how much DEEPER its final top sits than its as-pumped top, in metres; (4) the ABOVE SOURCE MARGIN for the reservoir zone in metres, WITH ITS SIGN; (5) the ANNULAR CEMENT MARGIN in metres, WITH ITS SIGN; and (6) the TOTAL SLURRY TAKEOFF across the whole programme. Traps. Field 3 is not caused by the excess. The as-pumped column stands in the annulus PLUS the stinger bore, which together are narrower than the full hole, so when the stinger is pulled the same slurry redistributes across the wider bore and the top drops. It would drop even at ZERO excess; the excess only adds to it, and at zero excess the settled top lands exactly on the design top, which is the identity that anchors every other figure here. Fields 4 and 5 are NEGATIVE and their signs are the answer: each is a SHORTFALL in metres rather than a failure code, and a reader who reports a magnitude has thrown away the direction. Field 6 is the programme takeoff: it sums the slurry of every plug with a designed placement, and the two plugs without one add no volume and are listed by name instead. Free checks: field 2 must be far smaller than field 1, since the spacer behind balances a spacer ahead across a capacity ratio; field 3 must be positive, because a plug always settles DOWNWARD; and fields 4 and 5 must both be negative, because this programme fails and the Expert tier is built on reading why.'
     where app_slug = 'integrity' and tier = 'advanced' and active and md5(prompt) = '6694359b36efda25cd2f10438580e048';
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'w2 integrity refused: integrity/advanced updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = 'aa879c16fc696e2119b0086f1fd9d9d4' and fields = '[{"key": "plug_slurry_m3", "tol": 5E-7, "unit": "m3", "label": "Reservoir plug slurry", "expected": 4.620238645056858}, {"key": "plug_spacer_behind_m3", "tol": 5E-8, "unit": "m3", "label": "Spacer behind", "expected": 0.5279360645295814}, {"key": "plug_top_settle_m", "tol": 0.000005, "unit": "m", "label": "Plug top settle", "expected": 21.154551869215993}, {"key": "above_source_margin_m", "tol": 0.000005, "unit": "m", "label": "Above source margin", "expected": -7.5}, {"key": "annular_cement_margin_m", "tol": 0.000005, "unit": "m", "label": "Annular cement margin", "expected": -26.5}, {"key": "program_slurry_takeoff_m3", "tol": 5E-7, "unit": "m3", "label": "Programme slurry takeoff", "expected": 18.197179289478704}]'::jsonb) from public.academy_capstones where app_slug = 'integrity' and tier = 'advanced' and active) is not true then
    raise exception 'w2 integrity refused: integrity/advanced does not read back as its W2 form';
  end if;

  raise notice 'w2 integrity: % of 2 row(s) written, % already applied', v_written, 2 - v_written;
end $$;
