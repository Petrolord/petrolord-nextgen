-- ============================================================================
-- PROMPT LEAK RECUT: Decline Curve Analysis (dca), Expert tier.
--
-- WHY. The repaired promptleak gate (docs/gate-audit/promptleak.md, PR #137)
-- swept all 132 live capstone prompts for the first time and found that this
-- prompt hands a learner a graded answer.
--
-- WHAT LEAKED. Two of the three accepted cross-tier leaks in the whole
-- Academy were in this one sentence.
--   "mode 461709.132532792"        = intermediate.field_eur_stb, tol 2000,
--                                     to fifteen significant figures.
--   "qi 120 stb/d, Di 0.0012 per day" = beginner.qi_bpd (tol 0.5) and
--                                     beginner.di_per_day (tol 2e-05), the two
--                                     values the Associate tier is graded on FITTING.
--
-- THE RECUT. Both figures are genuine inputs to the Expert task, so neither is
-- deleted: each is replaced by the thing it was computed from. The b = 1.2
-- booking is now stated against Ekene-1's pre-flood primary window, which the
-- learner must fit to recover qi and Di; the triangle's mode is now stated as
-- the field's deterministic booking, which the learner must total from the four
-- closed-form EURs. Both are the work the lower tiers grade, so the Expert
-- prompt now requires that work instead of publishing its result. The triangle
-- is insensitive enough for this to be safe: dP90/dmode is 0.247 and dP10/dmode
-- is 0.206, so even a 2000 stb error in the derived mode moves P90 by 495 stb
-- and P10 by 412 stb, both inside their own 2000 stb tolerances.
--
-- ONE LABEL ALSO MOVES, and it is not cosmetic. academy_get_capstone serves
-- every field's LABEL to the learner, and b12_eur_stb was labelled
-- "EUR at b 1.2 (qi 120, Di 0.0012, limit 10)", which hands over the same two
-- Associate answers as the prompt did. The gate reads prompts only, so it could
-- not see this. The label now names the fit instead of its result.
--
-- GUARDS. The row must match EITHER the published prompt and fields exactly,
-- in which case it is rewritten, OR the recut prompt and fields exactly, in
-- which case it is already applied and left alone. Anything else raises and
-- the transaction rolls back. The update asserts it touched exactly 1 row and
-- the tier is re-read afterwards. title, dataset, cert_tier and active never
-- move, and neither does any other tier of this course.
--
-- The published strings below were read from the LIVE production row (see
-- docs/prompt-leak-recut/RECUT-dca-advanced.json) and the recut strings were
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
   where c.app_slug = 'dca' and c.tier <> 'advanced';
  if v_other is null then
    raise exception 'promptleak recut dca/advanced refused: dca has no other tiers, so the row set is not what this migration was written against';
  end if;

  select case
           when prompt = 'Refit Ekene-5 on the fully post-ramp window (2024-05-01 onward) and report its fitted nominal decline. On that SAME window, refit Ekene-6, whose water cut is climbing, and report its fitted decline: the two wells share a reservoir and a gross decline, so the difference is the water cut alone. Then book the b = 1.2 EUR at qi 120 stb/d, Di 0.0012 per day and a 10 stb/d limit, with its ratio to the exponential booking of the same data, and compute the field triangle''s P90 and P10 (minimum 380000, mode 461709.132532792, maximum 580000 stb, petroleum convention with P90 low).'
            and fields = '[{"key": "e5_late_di", "tol": 0.000005, "unit": "1/d", "label": "Ekene-5 post-ramp fitted Di (2024-05-01 on)", "expected": 0.00035}, {"key": "e6_oil_di", "tol": 0.00002, "unit": "1/d", "label": "Ekene-6 oil decline on the same window", "expected": 0.0013275893489185155}, {"key": "b12_eur_stb", "tol": 2000, "unit": "stb", "label": "EUR at b 1.2 (qi 120, Di 0.0012, limit 10)", "expected": 321875.914758613}, {"key": "b_ratio", "tol": 0.02, "unit": "-", "label": "b 1.2 EUR over the exponential EUR", "expected": 3.5113736155485}, {"key": "p90_stb", "tol": 2000, "unit": "stb", "label": "Field triangle P90 (low)", "expected": 420425.025054486}, {"key": "p10_stb", "tol": 2000, "unit": "stb", "label": "Field triangle P10 (high)", "expected": 531360.331525141}]'::jsonb then 'old'
           when prompt = 'Refit Ekene-5 on the fully post-ramp window (2024-05-01 onward) and report its fitted nominal decline. On that SAME window, refit Ekene-6, whose water cut is climbing, and report its fitted decline: the two wells share a reservoir and a gross decline, so the difference is the water cut alone. Then book the b = 1.2 EUR on Ekene-1''s pre-flood primary window, fitting its qi and Di yourself before you book, at a 10 stb/d limit, with its ratio to the exponential booking of the same data. Finally compute the field triangle''s P90 and P10, petroleum convention with P90 low, from a minimum of 380000 stb, a maximum of 580000 stb, and a mode that is the field''s deterministic booking: the sum of the four producers'' closed-form EURs at the same 10 stb/d limit, which you must total yourself.'
            and fields = '[{"key": "e5_late_di", "tol": 5e-06, "unit": "1/d", "label": "Ekene-5 post-ramp fitted Di (2024-05-01 on)", "expected": 0.00035}, {"key": "e6_oil_di", "tol": 2e-05, "unit": "1/d", "label": "Ekene-6 oil decline on the same window", "expected": 0.0013275893489185155}, {"key": "b12_eur_stb", "tol": 2000, "unit": "stb", "label": "EUR at b 1.2 (Ekene-1 primary fit, limit 10)", "expected": 321875.914758613}, {"key": "b_ratio", "tol": 0.02, "unit": "-", "label": "b 1.2 EUR over the exponential EUR", "expected": 3.5113736155485}, {"key": "p90_stb", "tol": 2000, "unit": "stb", "label": "Field triangle P90 (low)", "expected": 420425.025054486}, {"key": "p10_stb", "tol": 2000, "unit": "stb", "label": "Field triangle P10 (high)", "expected": 531360.331525141}]'::jsonb then 'new'
           else 'other' end
    into v_state
    from public.academy_capstones
   where app_slug = 'dca' and tier = 'advanced' and active;

  if v_state is null then
    raise exception 'promptleak recut dca/advanced refused: no active dca advanced capstone row';
  end if;
  if v_state = 'other' then
    raise exception 'promptleak recut dca/advanced refused: the dca advanced prompt and fields match neither the published pair nor the recut pair';
  end if;

  if v_state = 'old' then
    update public.academy_capstones
       set prompt = 'Refit Ekene-5 on the fully post-ramp window (2024-05-01 onward) and report its fitted nominal decline. On that SAME window, refit Ekene-6, whose water cut is climbing, and report its fitted decline: the two wells share a reservoir and a gross decline, so the difference is the water cut alone. Then book the b = 1.2 EUR on Ekene-1''s pre-flood primary window, fitting its qi and Di yourself before you book, at a 10 stb/d limit, with its ratio to the exponential booking of the same data. Finally compute the field triangle''s P90 and P10, petroleum convention with P90 low, from a minimum of 380000 stb, a maximum of 580000 stb, and a mode that is the field''s deterministic booking: the sum of the four producers'' closed-form EURs at the same 10 stb/d limit, which you must total yourself.',
           fields = '[{"key": "e5_late_di", "tol": 5e-06, "unit": "1/d", "label": "Ekene-5 post-ramp fitted Di (2024-05-01 on)", "expected": 0.00035}, {"key": "e6_oil_di", "tol": 2e-05, "unit": "1/d", "label": "Ekene-6 oil decline on the same window", "expected": 0.0013275893489185155}, {"key": "b12_eur_stb", "tol": 2000, "unit": "stb", "label": "EUR at b 1.2 (Ekene-1 primary fit, limit 10)", "expected": 321875.914758613}, {"key": "b_ratio", "tol": 0.02, "unit": "-", "label": "b 1.2 EUR over the exponential EUR", "expected": 3.5113736155485}, {"key": "p90_stb", "tol": 2000, "unit": "stb", "label": "Field triangle P90 (low)", "expected": 420425.025054486}, {"key": "p10_stb", "tol": 2000, "unit": "stb", "label": "Field triangle P10 (high)", "expected": 531360.331525141}]'::jsonb
     where app_slug = 'dca' and tier = 'advanced' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then
      raise exception 'promptleak recut dca/advanced refused: the update touched % rows', v_count;
    end if;
    v_updated := v_updated + 1;
  end if;

  -- ------------------------------------------------ the unchanged assertions --
  select string_agg(f->>'key', ',' order by e.n)
    into v_keys
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) with ordinality as e(f, n)
   where c.app_slug = 'dca' and c.tier = 'advanced';
  if v_keys is distinct from 'e5_late_di,e6_oil_di,b12_eur_stb,b_ratio,p90_stb,p10_stb' then
    raise exception 'promptleak recut dca/advanced refused: the graded keys are now %, not the recut set', v_keys;
  end if;

  select count(*) into v_count
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'dca' and c.tier = 'advanced';
  if v_count <> 6 then
    raise exception 'promptleak recut dca/advanced refused: the advanced capstone carries % graded fields, expected 6', v_count;
  end if;

  select count(*) into v_count from public.academy_capstones where app_slug = 'dca';
  if v_count <> 3 then
    raise exception 'promptleak recut dca/advanced refused: dca has % capstones, expected 3', v_count;
  end if;

  select string_agg(c.tier || ':' || md5(c.prompt) || ':' || md5(c.fields::text), ',' order by c.tier)
    into v_keys
    from public.academy_capstones c
   where c.app_slug = 'dca' and c.tier <> 'advanced';
  if v_keys is distinct from v_other then
    raise exception 'promptleak recut dca/advanced refused: another tier of dca moved';
  end if;

  select case when prompt = 'Refit Ekene-5 on the fully post-ramp window (2024-05-01 onward) and report its fitted nominal decline. On that SAME window, refit Ekene-6, whose water cut is climbing, and report its fitted decline: the two wells share a reservoir and a gross decline, so the difference is the water cut alone. Then book the b = 1.2 EUR on Ekene-1''s pre-flood primary window, fitting its qi and Di yourself before you book, at a 10 stb/d limit, with its ratio to the exponential booking of the same data. Finally compute the field triangle''s P90 and P10, petroleum convention with P90 low, from a minimum of 380000 stb, a maximum of 580000 stb, and a mode that is the field''s deterministic booking: the sum of the four producers'' closed-form EURs at the same 10 stb/d limit, which you must total yourself.' and fields = '[{"key": "e5_late_di", "tol": 5e-06, "unit": "1/d", "label": "Ekene-5 post-ramp fitted Di (2024-05-01 on)", "expected": 0.00035}, {"key": "e6_oil_di", "tol": 2e-05, "unit": "1/d", "label": "Ekene-6 oil decline on the same window", "expected": 0.0013275893489185155}, {"key": "b12_eur_stb", "tol": 2000, "unit": "stb", "label": "EUR at b 1.2 (Ekene-1 primary fit, limit 10)", "expected": 321875.914758613}, {"key": "b_ratio", "tol": 0.02, "unit": "-", "label": "b 1.2 EUR over the exponential EUR", "expected": 3.5113736155485}, {"key": "p90_stb", "tol": 2000, "unit": "stb", "label": "Field triangle P90 (low)", "expected": 420425.025054486}, {"key": "p10_stb", "tol": 2000, "unit": "stb", "label": "Field triangle P10 (high)", "expected": 531360.331525141}]'::jsonb then 'ok' else 'bad' end
    into v_state
    from public.academy_capstones where app_slug = 'dca' and tier = 'advanced' and active;
  if v_state <> 'ok' then
    raise exception 'promptleak recut dca/advanced refused: the row does not hold the recut prompt and fields after the update';
  end if;

  raise notice 'promptleak recut dca/advanced: % of 1 row rewritten', v_updated;
end $$;

-- ---------------------------------------------------------------- read-back --
select 'prompt leak recut' as migration, c.app_slug, c.tier,
       md5(c.prompt) as prompt_md5, length(c.prompt) as prompt_len,
       e.n as ord, e.f->>'key' as key, e.f->>'label' as label,
       (e.f->>'expected')::numeric as expected, (e.f->>'tol')::numeric as tol
  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) with ordinality as e(f, n)
 where c.app_slug = 'dca' and c.tier = 'advanced'
 order by e.n;
