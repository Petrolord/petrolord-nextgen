-- ============================================================================
-- LABEL LEAK RECUT: Well Data Import, Professional tier. A FIELD REDESIGN.
--
-- WHAT LEAKED. The graded field irregular_uniform is labelled
--   "irregular_20 has a uniform step (1 yes / 0 no)"
-- and its graded answer is 0. The label has to state its own encoding to be
-- answerable at all, so it necessarily prints both possible answers, and the
-- field is a coin flip: a learner who never opens the file scores it half the
-- time and the label tells them which half to pick is 0 or 1.
--
-- THIS ONE CANNOT BE FIXED BY REWORDING. Removing "(1 yes / 0 no)" would make
-- the label opaque while leaving the field a fifty-fifty guess, which is the
-- leak dressed up rather than closed. So the FIELD moves.
--
-- THE REDESIGN. irregular_uniform is replaced by irregular_samples, the number
-- of depth samples in irregular_20, which is 121 and graded exactly. It is
-- measured rather than guessed, it still requires loading the file the tier is
-- about, and both panels that touch the file print it: the Import explorer as
-- its "Samples" tile and the LAS inspector as "Samples / NULL flag". It also
-- matches the house pattern already used at the other two tiers, which grade
-- basic_20 and wrapped_12 sample counts the same way.
--
-- THE UNIFORMITY TEST IS NOT LOST. The prompt still names irregular_20 as the
-- one teaching file whose step is not uniform, the panel still prints the
-- yes/no tile and the reported step as "none", and the EXPERT tier already
-- grades uniform_files, the count of files that pass the same test, which is
-- the detection task done properly and without a two-way guess.
--
-- 121 collides with nothing: no other welldata graded value at any tier equals
-- it, at any unit shifting.
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
   where c.app_slug = 'welldata' and c.tier <> 'intermediate';
  if v_other is null then
    raise exception 'labelleak recut welldata/intermediate refused: welldata has no other tiers';
  end if;

  select case
           when prompt = 'Run the full import pipeline on feet_20.las and read the import panel: the depth range and step converted to metres, how many curves needed unit conversion, how many curve kinds the importer recognised, and whether irregular_20 has a uniform depth step.' and coalesce(dataset,'') = 'wells/las (SI import)' and fields = '[{"key": "start_md_m", "tol": 0.01, "unit": "m", "label": "feet_20: start depth (converted)", "expected": 1493.52001953125}, {"key": "stop_md_m", "tol": 0.01, "unit": "m", "label": "feet_20: stop depth (converted)", "expected": 1584.9599609375}, {"key": "step_m", "tol": 0.001, "unit": "m", "label": "feet_20: depth step (converted)", "expected": 0.609619140625}, {"key": "converted_curves", "tol": 0, "unit": "count", "label": "feet_20: curves unit-converted", "expected": 2}, {"key": "recognized_kinds", "tol": 0, "unit": "count", "label": "feet_20: curve kinds recognised", "expected": 4}, {"key": "irregular_uniform", "tol": 0, "unit": "-", "label": "irregular_20 has a uniform step (1 yes / 0 no)", "expected": 0}]'::jsonb then 'old'
           when prompt = 'Run the full import pipeline on feet_20.las and read the import panel: the depth range and step converted to metres, how many curves needed unit conversion, how many curve kinds the importer recognised, and the number of depth samples in irregular_20, the one teaching file whose depth step is NOT uniform.' and coalesce(dataset,'') = 'wells/las (SI import)' and fields = '[{"key": "start_md_m", "tol": 0.01, "unit": "m", "label": "feet_20: start depth (converted)", "expected": 1493.52001953125}, {"key": "stop_md_m", "tol": 0.01, "unit": "m", "label": "feet_20: stop depth (converted)", "expected": 1584.9599609375}, {"key": "step_m", "tol": 0.001, "unit": "m", "label": "feet_20: depth step (converted)", "expected": 0.609619140625}, {"key": "converted_curves", "tol": 0, "unit": "count", "label": "feet_20: curves unit-converted", "expected": 2}, {"key": "recognized_kinds", "tol": 0, "unit": "count", "label": "feet_20: curve kinds recognised", "expected": 4}, {"key": "irregular_samples", "label": "irregular_20: depth samples", "unit": "count", "expected": 121, "tol": 0}]'::jsonb then 'new'
           else 'other' end
    into v_state from public.academy_capstones
   where app_slug = 'welldata' and tier = 'intermediate' and active;

  if v_state is null then
    raise exception 'labelleak recut welldata/intermediate refused: no active welldata intermediate capstone row';
  end if;
  if v_state = 'other' then
    raise exception 'labelleak recut welldata/intermediate refused: the welldata intermediate prompt, dataset and fields match neither the published set nor the recut set';
  end if;

  if v_state = 'old' then
    update public.academy_capstones
       set prompt = 'Run the full import pipeline on feet_20.las and read the import panel: the depth range and step converted to metres, how many curves needed unit conversion, how many curve kinds the importer recognised, and the number of depth samples in irregular_20, the one teaching file whose depth step is NOT uniform.', dataset = 'wells/las (SI import)', fields = '[{"key": "start_md_m", "tol": 0.01, "unit": "m", "label": "feet_20: start depth (converted)", "expected": 1493.52001953125}, {"key": "stop_md_m", "tol": 0.01, "unit": "m", "label": "feet_20: stop depth (converted)", "expected": 1584.9599609375}, {"key": "step_m", "tol": 0.001, "unit": "m", "label": "feet_20: depth step (converted)", "expected": 0.609619140625}, {"key": "converted_curves", "tol": 0, "unit": "count", "label": "feet_20: curves unit-converted", "expected": 2}, {"key": "recognized_kinds", "tol": 0, "unit": "count", "label": "feet_20: curve kinds recognised", "expected": 4}, {"key": "irregular_samples", "label": "irregular_20: depth samples", "unit": "count", "expected": 121, "tol": 0}]'::jsonb
     where app_slug = 'welldata' and tier = 'intermediate' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then
      raise exception 'labelleak recut welldata/intermediate refused: the update touched % rows', v_count;
    end if;
    v_updated := v_updated + 1;
  end if;

  select string_agg((f->>'key') || '=' || (f->>'label'), ',' order by e.n)
    into v_keys from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) with ordinality as e(f, n)
   where c.app_slug = 'welldata' and c.tier = 'intermediate';
  if v_keys is distinct from 'start_md_m=feet_20: start depth (converted),stop_md_m=feet_20: stop depth (converted),step_m=feet_20: depth step (converted),converted_curves=feet_20: curves unit-converted,recognized_kinds=feet_20: curve kinds recognised,irregular_samples=irregular_20: depth samples' then
    raise exception 'labelleak recut welldata/intermediate refused: the graded keys and labels are now %', v_keys;
  end if;

  select count(*) into v_count from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'welldata' and c.tier = 'intermediate';
  if v_count <> 6 then
    raise exception 'labelleak recut welldata/intermediate refused: % graded fields, expected 6', v_count;
  end if;

  select count(*) into v_count from public.academy_capstones where app_slug = 'welldata';
  if v_count <> 3 then
    raise exception 'labelleak recut welldata/intermediate refused: welldata has % capstones, expected 3', v_count;
  end if;

  select string_agg(c.tier || ':' || md5(c.prompt) || ':' || md5(coalesce(c.dataset,'')) || ':' || md5(c.fields::text), ',' order by c.tier)
    into v_keys from public.academy_capstones c
   where c.app_slug = 'welldata' and c.tier <> 'intermediate';
  if v_keys is distinct from v_other then
    raise exception 'labelleak recut welldata/intermediate refused: another tier of welldata moved';
  end if;

  raise notice 'labelleak recut welldata/intermediate: % of 1 row rewritten', v_updated;
end $$;

select 'label leak recut' as migration, c.app_slug, c.tier,
       md5(c.prompt) as prompt_md5, md5(coalesce(c.dataset,'')) as dataset_md5,
       e.n as ord, e.f->>'key' as key, e.f->>'label' as label, e.f->>'unit' as unit,
       (e.f->>'expected')::numeric as expected, (e.f->>'tol')::numeric as tol
  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) with ordinality as e(f, n)
 where c.app_slug = 'welldata' and c.tier = 'intermediate' order by e.n;
