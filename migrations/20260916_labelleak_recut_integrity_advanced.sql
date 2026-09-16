-- ============================================================================
-- LABEL LEAK RECUT: Well Integrity, Expert tier (dataset string).
--
-- WHAT LEAKED. The dataset string reads
--   "...at 35 percent excess, which FAILS on a 7.5 metre shortfall"
-- and the graded field above_source_margin_m is -7.5 m, tolerance 5e-06. The
-- shortfall named in the metadata IS the graded margin, to the digit.
--
-- HOW REACHABLE IT IS, STATED HONESTLY. dataset is returned by
-- academy_get_capstone but no learning page draws it, so unlike a label this
-- one is not on screen: it reaches the browser in the payload and is read by
-- opening the network tab. That is lower consequence than a label and it is
-- still a graded answer shipped to the client for no reason, and the sign is
-- the only work left to do once you have the digits.
--
-- THE RECUT. The magnitude goes, the verdict stays: "which FAILS on a shortfall
-- above the source". The dataset line is metadata describing the case, not an
-- input the learner needs, and the prompt already states the conditions in
-- full and tells the reader that fields 4 and 5 are negative shortfalls whose
-- signs are the answer. Nothing a learner needs is removed.
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
   where c.app_slug = 'integrity' and c.tier <> 'advanced';
  if v_other is null then
    raise exception 'labelleak recut integrity/advanced refused: integrity has no other tiers';
  end if;

  select case
           when prompt = 'Six values for a permanent abandonment of the Associate capstone well. FIVE plugs are proposed across two flowing zones plus a surface phase, at 35 percent excess. Report: (1) the SLURRY VOLUME of the reservoir primary plug in cubic metres; (2) its SPACER BEHIND volume; (3) the SETTLE of that plug, meaning how much DEEPER its final top sits than its as-pumped top, in metres; (4) the ABOVE SOURCE MARGIN for the reservoir zone in metres, WITH ITS SIGN; (5) the ANNULAR CEMENT MARGIN in metres, WITH ITS SIGN; and (6) the TOTAL SLURRY TAKEOFF across the whole programme. Traps. Field 3 is not caused by the excess. The as-pumped column stands in the annulus PLUS the stinger bore, which together are narrower than the full hole, so when the stinger is pulled the same slurry redistributes across the wider bore and the top drops. It would drop even at ZERO excess; the excess only adds to it, and at zero excess the settled top lands exactly on the design top, which is the identity that anchors every other figure here. Fields 4 and 5 are NEGATIVE and their signs are the answer: each is a SHORTFALL in metres rather than a failure code, and a reader who reports a magnitude has thrown away the direction. Field 6 sums every plug including the two the programme does not design a placement for, so it is not the sum of the designed slurries alone. Free checks: field 2 must be far smaller than field 1, since the spacer behind balances a spacer ahead across a capacity ratio; field 3 must be positive, because a plug always settles DOWNWARD; and fields 4 and 5 must both be negative, because this programme fails and the Expert tier is built on reading why.' and coalesce(dataset,'') = 'a five plug abandonment of the Associate capstone well at 35 percent excess, which FAILS on a 7.5 metre shortfall' and fields = '[{"key": "plug_slurry_m3", "tol": 0.0000005, "unit": "m3", "label": "Reservoir plug slurry", "expected": 4.620238645056858}, {"key": "plug_spacer_behind_m3", "tol": 0.00000005, "unit": "m3", "label": "Spacer behind", "expected": 0.5279360645295814}, {"key": "plug_top_settle_m", "tol": 0.000005, "unit": "m", "label": "Plug top settle", "expected": 21.154551869215993}, {"key": "above_source_margin_m", "tol": 0.000005, "unit": "m", "label": "Above source margin", "expected": -7.5}, {"key": "annular_cement_margin_m", "tol": 0.000005, "unit": "m", "label": "Annular cement margin", "expected": -26.5}, {"key": "program_slurry_takeoff_m3", "tol": 0.0000005, "unit": "m3", "label": "Programme slurry takeoff", "expected": 18.197179289478704}]'::jsonb then 'old'
           when prompt = 'Six values for a permanent abandonment of the Associate capstone well. FIVE plugs are proposed across two flowing zones plus a surface phase, at 35 percent excess. Report: (1) the SLURRY VOLUME of the reservoir primary plug in cubic metres; (2) its SPACER BEHIND volume; (3) the SETTLE of that plug, meaning how much DEEPER its final top sits than its as-pumped top, in metres; (4) the ABOVE SOURCE MARGIN for the reservoir zone in metres, WITH ITS SIGN; (5) the ANNULAR CEMENT MARGIN in metres, WITH ITS SIGN; and (6) the TOTAL SLURRY TAKEOFF across the whole programme. Traps. Field 3 is not caused by the excess. The as-pumped column stands in the annulus PLUS the stinger bore, which together are narrower than the full hole, so when the stinger is pulled the same slurry redistributes across the wider bore and the top drops. It would drop even at ZERO excess; the excess only adds to it, and at zero excess the settled top lands exactly on the design top, which is the identity that anchors every other figure here. Fields 4 and 5 are NEGATIVE and their signs are the answer: each is a SHORTFALL in metres rather than a failure code, and a reader who reports a magnitude has thrown away the direction. Field 6 sums every plug including the two the programme does not design a placement for, so it is not the sum of the designed slurries alone. Free checks: field 2 must be far smaller than field 1, since the spacer behind balances a spacer ahead across a capacity ratio; field 3 must be positive, because a plug always settles DOWNWARD; and fields 4 and 5 must both be negative, because this programme fails and the Expert tier is built on reading why.' and coalesce(dataset,'') = 'a five plug abandonment of the Associate capstone well at 35 percent excess, which FAILS on a shortfall above the source' and fields = '[{"key": "plug_slurry_m3", "tol": 5e-07, "unit": "m3", "label": "Reservoir plug slurry", "expected": 4.620238645056858}, {"key": "plug_spacer_behind_m3", "tol": 5e-08, "unit": "m3", "label": "Spacer behind", "expected": 0.5279360645295814}, {"key": "plug_top_settle_m", "tol": 5e-06, "unit": "m", "label": "Plug top settle", "expected": 21.154551869215993}, {"key": "above_source_margin_m", "tol": 5e-06, "unit": "m", "label": "Above source margin", "expected": -7.5}, {"key": "annular_cement_margin_m", "tol": 5e-06, "unit": "m", "label": "Annular cement margin", "expected": -26.5}, {"key": "program_slurry_takeoff_m3", "tol": 5e-07, "unit": "m3", "label": "Programme slurry takeoff", "expected": 18.197179289478704}]'::jsonb then 'new'
           else 'other' end
    into v_state from public.academy_capstones
   where app_slug = 'integrity' and tier = 'advanced' and active;

  if v_state is null then
    raise exception 'labelleak recut integrity/advanced refused: no active integrity advanced capstone row';
  end if;
  if v_state = 'other' then
    raise exception 'labelleak recut integrity/advanced refused: the integrity advanced prompt, dataset and fields match neither the published set nor the recut set';
  end if;

  if v_state = 'old' then
    update public.academy_capstones
       set prompt = 'Six values for a permanent abandonment of the Associate capstone well. FIVE plugs are proposed across two flowing zones plus a surface phase, at 35 percent excess. Report: (1) the SLURRY VOLUME of the reservoir primary plug in cubic metres; (2) its SPACER BEHIND volume; (3) the SETTLE of that plug, meaning how much DEEPER its final top sits than its as-pumped top, in metres; (4) the ABOVE SOURCE MARGIN for the reservoir zone in metres, WITH ITS SIGN; (5) the ANNULAR CEMENT MARGIN in metres, WITH ITS SIGN; and (6) the TOTAL SLURRY TAKEOFF across the whole programme. Traps. Field 3 is not caused by the excess. The as-pumped column stands in the annulus PLUS the stinger bore, which together are narrower than the full hole, so when the stinger is pulled the same slurry redistributes across the wider bore and the top drops. It would drop even at ZERO excess; the excess only adds to it, and at zero excess the settled top lands exactly on the design top, which is the identity that anchors every other figure here. Fields 4 and 5 are NEGATIVE and their signs are the answer: each is a SHORTFALL in metres rather than a failure code, and a reader who reports a magnitude has thrown away the direction. Field 6 sums every plug including the two the programme does not design a placement for, so it is not the sum of the designed slurries alone. Free checks: field 2 must be far smaller than field 1, since the spacer behind balances a spacer ahead across a capacity ratio; field 3 must be positive, because a plug always settles DOWNWARD; and fields 4 and 5 must both be negative, because this programme fails and the Expert tier is built on reading why.', dataset = 'a five plug abandonment of the Associate capstone well at 35 percent excess, which FAILS on a shortfall above the source', fields = '[{"key": "plug_slurry_m3", "tol": 5e-07, "unit": "m3", "label": "Reservoir plug slurry", "expected": 4.620238645056858}, {"key": "plug_spacer_behind_m3", "tol": 5e-08, "unit": "m3", "label": "Spacer behind", "expected": 0.5279360645295814}, {"key": "plug_top_settle_m", "tol": 5e-06, "unit": "m", "label": "Plug top settle", "expected": 21.154551869215993}, {"key": "above_source_margin_m", "tol": 5e-06, "unit": "m", "label": "Above source margin", "expected": -7.5}, {"key": "annular_cement_margin_m", "tol": 5e-06, "unit": "m", "label": "Annular cement margin", "expected": -26.5}, {"key": "program_slurry_takeoff_m3", "tol": 5e-07, "unit": "m3", "label": "Programme slurry takeoff", "expected": 18.197179289478704}]'::jsonb
     where app_slug = 'integrity' and tier = 'advanced' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then
      raise exception 'labelleak recut integrity/advanced refused: the update touched % rows', v_count;
    end if;
    v_updated := v_updated + 1;
  end if;

  select string_agg((f->>'key') || '=' || (f->>'label'), ',' order by e.n)
    into v_keys from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) with ordinality as e(f, n)
   where c.app_slug = 'integrity' and c.tier = 'advanced';
  if v_keys is distinct from 'plug_slurry_m3=Reservoir plug slurry,plug_spacer_behind_m3=Spacer behind,plug_top_settle_m=Plug top settle,above_source_margin_m=Above source margin,annular_cement_margin_m=Annular cement margin,program_slurry_takeoff_m3=Programme slurry takeoff' then
    raise exception 'labelleak recut integrity/advanced refused: the graded keys and labels are now %', v_keys;
  end if;

  select count(*) into v_count from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'integrity' and c.tier = 'advanced';
  if v_count <> 6 then
    raise exception 'labelleak recut integrity/advanced refused: % graded fields, expected 6', v_count;
  end if;

  select count(*) into v_count from public.academy_capstones where app_slug = 'integrity';
  if v_count <> 3 then
    raise exception 'labelleak recut integrity/advanced refused: integrity has % capstones, expected 3', v_count;
  end if;

  select string_agg(c.tier || ':' || md5(c.prompt) || ':' || md5(coalesce(c.dataset,'')) || ':' || md5(c.fields::text), ',' order by c.tier)
    into v_keys from public.academy_capstones c
   where c.app_slug = 'integrity' and c.tier <> 'advanced';
  if v_keys is distinct from v_other then
    raise exception 'labelleak recut integrity/advanced refused: another tier of integrity moved';
  end if;

  raise notice 'labelleak recut integrity/advanced: % of 1 row rewritten', v_updated;
end $$;

select 'label leak recut' as migration, c.app_slug, c.tier,
       md5(c.prompt) as prompt_md5, md5(coalesce(c.dataset,'')) as dataset_md5,
       e.n as ord, e.f->>'key' as key, e.f->>'label' as label, e.f->>'unit' as unit,
       (e.f->>'expected')::numeric as expected, (e.f->>'tol')::numeric as tol
  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) with ordinality as e(f, n)
 where c.app_slug = 'integrity' and c.tier = 'advanced' order by e.n;
