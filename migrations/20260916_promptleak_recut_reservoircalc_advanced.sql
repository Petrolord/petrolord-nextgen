-- ============================================================================
-- PROMPT LEAK RECUT: ReservoirCalc Pro (reservoircalc), Expert tier.
--
-- WHY. The repaired promptleak gate (docs/gate-audit/promptleak.md, PR #137)
-- swept all 132 live capstone prompts for the first time and found that this
-- prompt hands a learner a graded answer.
--
-- WHAT LEAKED, AND WHY THIS ONE IS A TOLERANCE AND NOT A PROMPT. The prompt
-- states the six well porosities (0.22, 0.19, 0.23, 0.17, 0.21, 0.22), which
-- are the data the trend surface is fitted to and cannot be removed without
-- making the task impossible. The mean of the fitted trend over the oil-bearing
-- nodes, 0.20936760570720417, happens to land 0.00063 from the fifth well's
-- 0.21, inside the field's own 0.001 tolerance. Nothing was given away on
-- purpose: the tolerance was simply wide enough to accept a number the learner
-- could copy. So the prompt does not change and the tolerance does.
--
-- THE NEW TOLERANCE. 0.001 -> 0.0002 on phi_mean_oil, and nothing else moves.
-- The panel prints this mean to SIX decimals on the "Node mean over the oil"
-- tile, so an honest reading carries at most 5e-07 of rounding and 0.0002 is
-- four hundred times that. What 0.0002 now rejects:
--   the copied well value 0.21              0.000632 away = 3.2 tolerances
--   the volume weighted mean 0.210822       0.001455 away = 7.3 tolerances
--   the mean over all 201 live nodes 0.206686  0.002682 away = 13 tolerances
-- The two wrong-method neighbours the lessons name were already rejected at
-- 0.001 and are rejected by a wider margin now, so the field discriminates
-- everything it used to and the copied input as well.
--
-- GUARDS. The row must match EITHER the published prompt and fields exactly,
-- in which case it is rewritten, OR the recut prompt and fields exactly, in
-- which case it is already applied and left alone. Anything else raises and
-- the transaction rolls back. The update asserts it touched exactly 1 row and
-- the tier is re-read afterwards. title, dataset, cert_tier and active never
-- move, and neither does any other tier of this course.
--
-- The published strings below were read from the LIVE production row (see
-- docs/prompt-leak-recut/RECUT-reservoircalc-advanced.json) and the recut strings were
-- produced from them by substring replacement, not retyped.
--
-- SAFE TO RE-RUN. A second run finds the row already recut and writes nothing.
-- ============================================================================

do $$
declare
  v_state   text;
  v_count   integer;
  v_updated integer := 0;
  v_keys    text;
  v_other   text;
begin
  -- Every OTHER tier of this course, captured before and compared after: this
  -- migration may touch one row and one row only.
  select string_agg(c.tier || ':' || md5(c.prompt) || ':' || md5(c.fields::text), ',' order by c.tier)
    into v_other
    from public.academy_capstones c
   where c.app_slug = 'reservoircalc' and c.tier <> 'advanced';
  if v_other is null then
    raise exception 'promptleak recut reservoircalc/advanced refused: reservoircalc has no other tiers, so the row set is not what this migration was written against';
  end if;

  select case
           when prompt = 'Replace the constant porosity with a per-node property grid: fit a porosity trend surface to the six well values (0.22, 0.19, 0.23, 0.17, 0.21, 0.22 for Ekene-1 to Ekene-6) with the population engine and rerun the volumetrics at the 1560 m contact. Read the panel: the trend porosity at prospect P-1 and its mean over the oil-bearing nodes, the pore volume and HCPV, the STOIIP, and how much the trend model adds over the constant-porosity booking.'
            and fields = '[{"key": "phi_at_p1", "tol": 0.001, "unit": "v/v", "label": "Trend porosity at P-1", "expected": 0.20714187889686578}, {"key": "phi_mean_oil", "tol": 0.001, "unit": "v/v", "label": "Mean trend porosity over oil nodes", "expected": 0.20936760570720417}, {"key": "pore_trend_mm3", "tol": 0.02, "unit": "10^6 m3", "label": "Pore volume, trend model", "expected": 3.7558468705687864}, {"key": "hcpv_trend_mm3", "tol": 0.02, "unit": "10^6 m3", "label": "HCPV, trend model", "expected": 2.4413004882563025}, {"key": "stoiip_trend_mmstb", "tol": 0.05, "unit": "MMstb", "label": "STOIIP, trend model", "expected": 12.79607650919541}, {"key": "stoiip_delta_mmstb", "tol": 0.02, "unit": "MMstb", "label": "STOIIP added over the constant model", "expected": 0.656868401698647}]'::jsonb then 'old'
           when prompt = 'Replace the constant porosity with a per-node property grid: fit a porosity trend surface to the six well values (0.22, 0.19, 0.23, 0.17, 0.21, 0.22 for Ekene-1 to Ekene-6) with the population engine and rerun the volumetrics at the 1560 m contact. Read the panel: the trend porosity at prospect P-1 and its mean over the oil-bearing nodes, the pore volume and HCPV, the STOIIP, and how much the trend model adds over the constant-porosity booking.'
            and fields = '[{"key": "phi_at_p1", "tol": 0.001, "unit": "v/v", "label": "Trend porosity at P-1", "expected": 0.20714187889686578}, {"key": "phi_mean_oil", "tol": 0.0002, "unit": "v/v", "label": "Mean trend porosity over oil nodes", "expected": 0.20936760570720417}, {"key": "pore_trend_mm3", "tol": 0.02, "unit": "10^6 m3", "label": "Pore volume, trend model", "expected": 3.7558468705687864}, {"key": "hcpv_trend_mm3", "tol": 0.02, "unit": "10^6 m3", "label": "HCPV, trend model", "expected": 2.4413004882563025}, {"key": "stoiip_trend_mmstb", "tol": 0.05, "unit": "MMstb", "label": "STOIIP, trend model", "expected": 12.79607650919541}, {"key": "stoiip_delta_mmstb", "tol": 0.02, "unit": "MMstb", "label": "STOIIP added over the constant model", "expected": 0.656868401698647}]'::jsonb then 'new'
           else 'other' end
    into v_state
    from public.academy_capstones
   where app_slug = 'reservoircalc' and tier = 'advanced' and active;

  if v_state is null then
    raise exception 'promptleak recut reservoircalc/advanced refused: no active reservoircalc advanced capstone row';
  end if;
  if v_state = 'other' then
    raise exception 'promptleak recut reservoircalc/advanced refused: the reservoircalc advanced prompt and fields match neither the published pair nor the recut pair';
  end if;

  if v_state = 'old' then
    update public.academy_capstones
       set prompt = 'Replace the constant porosity with a per-node property grid: fit a porosity trend surface to the six well values (0.22, 0.19, 0.23, 0.17, 0.21, 0.22 for Ekene-1 to Ekene-6) with the population engine and rerun the volumetrics at the 1560 m contact. Read the panel: the trend porosity at prospect P-1 and its mean over the oil-bearing nodes, the pore volume and HCPV, the STOIIP, and how much the trend model adds over the constant-porosity booking.',
           fields = '[{"key": "phi_at_p1", "tol": 0.001, "unit": "v/v", "label": "Trend porosity at P-1", "expected": 0.20714187889686578}, {"key": "phi_mean_oil", "tol": 0.0002, "unit": "v/v", "label": "Mean trend porosity over oil nodes", "expected": 0.20936760570720417}, {"key": "pore_trend_mm3", "tol": 0.02, "unit": "10^6 m3", "label": "Pore volume, trend model", "expected": 3.7558468705687864}, {"key": "hcpv_trend_mm3", "tol": 0.02, "unit": "10^6 m3", "label": "HCPV, trend model", "expected": 2.4413004882563025}, {"key": "stoiip_trend_mmstb", "tol": 0.05, "unit": "MMstb", "label": "STOIIP, trend model", "expected": 12.79607650919541}, {"key": "stoiip_delta_mmstb", "tol": 0.02, "unit": "MMstb", "label": "STOIIP added over the constant model", "expected": 0.656868401698647}]'::jsonb
     where app_slug = 'reservoircalc' and tier = 'advanced' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then
      raise exception 'promptleak recut reservoircalc/advanced refused: the update touched % rows', v_count;
    end if;
    v_updated := v_updated + 1;
  end if;

  -- ------------------------------------------------ the unchanged assertions --
  select string_agg(f->>'key', ',' order by e.n)
    into v_keys
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) with ordinality as e(f, n)
   where c.app_slug = 'reservoircalc' and c.tier = 'advanced';
  if v_keys is distinct from 'phi_at_p1,phi_mean_oil,pore_trend_mm3,hcpv_trend_mm3,stoiip_trend_mmstb,stoiip_delta_mmstb' then
    raise exception 'promptleak recut reservoircalc/advanced refused: the graded keys are now %, not the recut set', v_keys;
  end if;

  select count(*) into v_count
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'reservoircalc' and c.tier = 'advanced';
  if v_count <> 6 then
    raise exception 'promptleak recut reservoircalc/advanced refused: the advanced capstone carries % graded fields, expected 6', v_count;
  end if;

  select count(*) into v_count from public.academy_capstones where app_slug = 'reservoircalc';
  if v_count <> 3 then
    raise exception 'promptleak recut reservoircalc/advanced refused: reservoircalc has % capstones, expected 3', v_count;
  end if;

  select string_agg(c.tier || ':' || md5(c.prompt) || ':' || md5(c.fields::text), ',' order by c.tier)
    into v_keys
    from public.academy_capstones c
   where c.app_slug = 'reservoircalc' and c.tier <> 'advanced';
  if v_keys is distinct from v_other then
    raise exception 'promptleak recut reservoircalc/advanced refused: another tier of reservoircalc moved';
  end if;

  select case when prompt = 'Replace the constant porosity with a per-node property grid: fit a porosity trend surface to the six well values (0.22, 0.19, 0.23, 0.17, 0.21, 0.22 for Ekene-1 to Ekene-6) with the population engine and rerun the volumetrics at the 1560 m contact. Read the panel: the trend porosity at prospect P-1 and its mean over the oil-bearing nodes, the pore volume and HCPV, the STOIIP, and how much the trend model adds over the constant-porosity booking.' and fields = '[{"key": "phi_at_p1", "tol": 0.001, "unit": "v/v", "label": "Trend porosity at P-1", "expected": 0.20714187889686578}, {"key": "phi_mean_oil", "tol": 0.0002, "unit": "v/v", "label": "Mean trend porosity over oil nodes", "expected": 0.20936760570720417}, {"key": "pore_trend_mm3", "tol": 0.02, "unit": "10^6 m3", "label": "Pore volume, trend model", "expected": 3.7558468705687864}, {"key": "hcpv_trend_mm3", "tol": 0.02, "unit": "10^6 m3", "label": "HCPV, trend model", "expected": 2.4413004882563025}, {"key": "stoiip_trend_mmstb", "tol": 0.05, "unit": "MMstb", "label": "STOIIP, trend model", "expected": 12.79607650919541}, {"key": "stoiip_delta_mmstb", "tol": 0.02, "unit": "MMstb", "label": "STOIIP added over the constant model", "expected": 0.656868401698647}]'::jsonb then 'ok' else 'bad' end
    into v_state
    from public.academy_capstones where app_slug = 'reservoircalc' and tier = 'advanced' and active;
  if v_state <> 'ok' then
    raise exception 'promptleak recut reservoircalc/advanced refused: the row does not hold the recut prompt and fields after the update';
  end if;

  raise notice 'promptleak recut reservoircalc/advanced: % of 1 row rewritten', v_updated;
end $$;

-- ---------------------------------------------------------------- read-back --
select 'prompt leak recut' as migration, c.app_slug, c.tier,
       md5(c.prompt) as prompt_md5, length(c.prompt) as prompt_len,
       e.n as ord, e.f->>'key' as key, e.f->>'label' as label,
       (e.f->>'expected')::numeric as expected, (e.f->>'tol')::numeric as tol
  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) with ordinality as e(f, n)
 where c.app_slug = 'reservoircalc' and c.tier = 'advanced'
 order by e.n;
