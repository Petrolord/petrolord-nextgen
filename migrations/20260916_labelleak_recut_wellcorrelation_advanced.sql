-- ============================================================================
-- LABEL LEAK RECUT: Well Correlation, Expert tier.
--
-- WHAT LEAKED. The Expert field topb_relief is labelled
--   "TOP_B structural relief (3 wells)"
-- and "3" is exactly the graded answer of TWO lower-tier fields, both graded to
-- ZERO tolerance: beginner.wells_with_top_b = 3 ("Wells the TOP_B correlation
-- line reaches") and intermediate.wells_with_all_tops = 3. The parenthetical
-- counts the same wells those fields count, so it is a restatement and not a
-- coincidence of small numbers.
--
-- LOWEST CONSEQUENCE OF THIS WAVE, AND SAID PLAINLY. Three is a small integer
-- and the section holds four wells, so a guess was already likely to land. The
-- reason to fix it is that both targets are graded EXACTLY, so the label turns
-- a likely guess into a certainty, and the fix costs a parenthetical.
--
-- WHY THE GATE NEVER SAW IT. Both target fields carry tol 0, and the sweep
-- skipped every field whose tolerance was zero. 40 of the 793 live fields are
-- tol 0. They are now swept by exact equality, which is the only test that
-- makes sense for a field that demands the exact integer.
--
-- THE RECUT. The label becomes "TOP_B structural relief where it is drilled",
-- which is the prompt's own wording for the quantity and carries no count.
-- ============================================================================

do $$
declare
  v_state   text;
  v_count   integer;
  v_updated integer := 0;
  v_keys    text;
  v_other   text;
begin
  select string_agg(c.tier || ':' || md5(c.prompt) || ':' || md5(coalesce(c.dataset,'')) || ':' || md5(c.fields::text), ',' order by c.tier)
    into v_other from public.academy_capstones c
   where c.app_slug = 'wellcorrelation' and c.tier <> 'advanced';
  if v_other is null then
    raise exception 'labelleak recut wellcorrelation/advanced refused: wellcorrelation has no other tiers';
  end if;

  select case
           when prompt = 'Ekene-4 TDs above TOP_B. Predict the missing pick two ways from the three wells that carry it: project the mean TOP_A to TOP_B interval down from TOP_A (the layer-cake estimate), and the mean TOP_SAND to TOP_B interval down from TOP_SAND. Report both predictions, their spread (that is the growth uncertainty), the two mean intervals, and the structural relief of TOP_B where it is drilled.' and coalesce(dataset,'') = 'correlation/ekene-section' and fields = '[{"key": "a_to_b_mean", "tol": 0.01, "unit": "m", "label": "Mean TOP_A to TOP_B interval", "expected": 141}, {"key": "sand_to_b_mean", "tol": 0.01, "unit": "m", "label": "Mean TOP_SAND to TOP_B interval", "expected": 92}, {"key": "w4_topb_layercake", "tol": 0.01, "unit": "m", "label": "Ekene-4 TOP_B, layer-cake estimate", "expected": 1671}, {"key": "w4_topb_from_sand", "tol": 0.01, "unit": "m", "label": "Ekene-4 TOP_B, from TOP_SAND", "expected": 1682}, {"key": "prediction_spread", "tol": 0.01, "unit": "m", "label": "Spread between the two estimates", "expected": 11}, {"key": "topb_relief", "tol": 0.01, "unit": "m", "label": "TOP_B structural relief (3 wells)", "expected": 34}]'::jsonb then 'old'
           when prompt = 'Ekene-4 TDs above TOP_B. Predict the missing pick two ways from the three wells that carry it: project the mean TOP_A to TOP_B interval down from TOP_A (the layer-cake estimate), and the mean TOP_SAND to TOP_B interval down from TOP_SAND. Report both predictions, their spread (that is the growth uncertainty), the two mean intervals, and the structural relief of TOP_B where it is drilled.' and coalesce(dataset,'') = 'correlation/ekene-section' and fields = '[{"key": "a_to_b_mean", "tol": 0.01, "unit": "m", "label": "Mean TOP_A to TOP_B interval", "expected": 141}, {"key": "sand_to_b_mean", "tol": 0.01, "unit": "m", "label": "Mean TOP_SAND to TOP_B interval", "expected": 92}, {"key": "w4_topb_layercake", "tol": 0.01, "unit": "m", "label": "Ekene-4 TOP_B, layer-cake estimate", "expected": 1671}, {"key": "w4_topb_from_sand", "tol": 0.01, "unit": "m", "label": "Ekene-4 TOP_B, from TOP_SAND", "expected": 1682}, {"key": "prediction_spread", "tol": 0.01, "unit": "m", "label": "Spread between the two estimates", "expected": 11}, {"key": "topb_relief", "tol": 0.01, "unit": "m", "label": "TOP_B structural relief where it is drilled", "expected": 34}]'::jsonb then 'new'
           else 'other' end
    into v_state from public.academy_capstones
   where app_slug = 'wellcorrelation' and tier = 'advanced' and active;

  if v_state is null then
    raise exception 'labelleak recut wellcorrelation/advanced refused: no active wellcorrelation advanced capstone row';
  end if;
  if v_state = 'other' then
    raise exception 'labelleak recut wellcorrelation/advanced refused: the wellcorrelation advanced prompt, dataset and fields match neither the published set nor the recut set';
  end if;

  if v_state = 'old' then
    update public.academy_capstones
       set prompt = 'Ekene-4 TDs above TOP_B. Predict the missing pick two ways from the three wells that carry it: project the mean TOP_A to TOP_B interval down from TOP_A (the layer-cake estimate), and the mean TOP_SAND to TOP_B interval down from TOP_SAND. Report both predictions, their spread (that is the growth uncertainty), the two mean intervals, and the structural relief of TOP_B where it is drilled.', dataset = 'correlation/ekene-section', fields = '[{"key": "a_to_b_mean", "tol": 0.01, "unit": "m", "label": "Mean TOP_A to TOP_B interval", "expected": 141}, {"key": "sand_to_b_mean", "tol": 0.01, "unit": "m", "label": "Mean TOP_SAND to TOP_B interval", "expected": 92}, {"key": "w4_topb_layercake", "tol": 0.01, "unit": "m", "label": "Ekene-4 TOP_B, layer-cake estimate", "expected": 1671}, {"key": "w4_topb_from_sand", "tol": 0.01, "unit": "m", "label": "Ekene-4 TOP_B, from TOP_SAND", "expected": 1682}, {"key": "prediction_spread", "tol": 0.01, "unit": "m", "label": "Spread between the two estimates", "expected": 11}, {"key": "topb_relief", "tol": 0.01, "unit": "m", "label": "TOP_B structural relief where it is drilled", "expected": 34}]'::jsonb
     where app_slug = 'wellcorrelation' and tier = 'advanced' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then
      raise exception 'labelleak recut wellcorrelation/advanced refused: the update touched % rows', v_count;
    end if;
    v_updated := v_updated + 1;
  end if;

  select string_agg((f->>'key') || '=' || (f->>'label'), ',' order by e.n)
    into v_keys from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) with ordinality as e(f, n)
   where c.app_slug = 'wellcorrelation' and c.tier = 'advanced';
  if v_keys is distinct from 'a_to_b_mean=Mean TOP_A to TOP_B interval,sand_to_b_mean=Mean TOP_SAND to TOP_B interval,w4_topb_layercake=Ekene-4 TOP_B, layer-cake estimate,w4_topb_from_sand=Ekene-4 TOP_B, from TOP_SAND,prediction_spread=Spread between the two estimates,topb_relief=TOP_B structural relief where it is drilled' then
    raise exception 'labelleak recut wellcorrelation/advanced refused: the graded keys and labels are now %', v_keys;
  end if;

  select count(*) into v_count from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'wellcorrelation' and c.tier = 'advanced';
  if v_count <> 6 then
    raise exception 'labelleak recut wellcorrelation/advanced refused: % graded fields, expected 6', v_count;
  end if;

  select count(*) into v_count from public.academy_capstones where app_slug = 'wellcorrelation';
  if v_count <> 3 then
    raise exception 'labelleak recut wellcorrelation/advanced refused: wellcorrelation has % capstones, expected 3', v_count;
  end if;

  select string_agg(c.tier || ':' || md5(c.prompt) || ':' || md5(coalesce(c.dataset,'')) || ':' || md5(c.fields::text), ',' order by c.tier)
    into v_keys from public.academy_capstones c
   where c.app_slug = 'wellcorrelation' and c.tier <> 'advanced';
  if v_keys is distinct from v_other then
    raise exception 'labelleak recut wellcorrelation/advanced refused: another tier of wellcorrelation moved';
  end if;

  raise notice 'labelleak recut wellcorrelation/advanced: % of 1 row rewritten', v_updated;
end $$;

select 'label leak recut' as migration, c.app_slug, c.tier,
       md5(c.prompt) as prompt_md5, md5(coalesce(c.dataset,'')) as dataset_md5,
       e.n as ord, e.f->>'key' as key, e.f->>'label' as label, e.f->>'unit' as unit,
       (e.f->>'expected')::numeric as expected, (e.f->>'tol')::numeric as tol
  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) with ordinality as e(f, n)
 where c.app_slug = 'wellcorrelation' and c.tier = 'advanced' order by e.n;
