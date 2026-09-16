-- ============================================================================
-- PROMPT LEAK RECUT: SCAL & Displacement (scal), Associate tier.
--
-- WHY. The repaired promptleak gate (docs/gate-audit/promptleak.md, PR #137)
-- swept all 132 live capstone prompts for the first time and found that this
-- prompt hands a learner a graded answer.
--
-- WHAT LEAKED. The Associate prompt stated "nw 2.5", and advanced.fitted_nw
-- (2.4999999999999996, tol 0.001) is the Expert tier's answer to re-fitting that
-- exponent out of the 13-row lab grid. A DOWNWARD leak, the shape this gate
-- exists to catch: it is on the prompt every learner on the ladder reads first.
--
-- THE RECUT. The exponents are not needed in the prompt at all. The Associate
-- runs the displacement from the fixture
-- (packages/engines/test-data/ekene-dynamic/scal.json), which carries the Corey
-- set including nw and no, and the six Associate answers all come out of the
-- engine run rather than out of the printed exponents. The four ENDPOINTS stay
-- in the prompt because the first graded field, the endpoint mobility ratio, is
-- computed from them by hand: (0.3/0.5)/(0.9/1.8) = 1.2. So the prompt still
-- states everything the tier is graded on and no longer states the tier above's
-- answer.
--
-- NOT CLOSED BY THIS MIGRATION, and reported rather than hidden: the Associate
-- LESSONS teach nw = 2.5 (m03 l03), and the Associate panel's nw slider defaults
-- to it on screen. fitted_nw is a recover-the-plant field whose value the course
-- has to teach, so the prompt fix does not make it secret. Redesigning that
-- field is proposed in the PR and needs an engine run, not a migration.
--
-- GUARDS. The row must match EITHER the published prompt and fields exactly,
-- in which case it is rewritten, OR the recut prompt and fields exactly, in
-- which case it is already applied and left alone. Anything else raises and
-- the transaction rolls back. The update asserts it touched exactly 1 row and
-- the tier is re-read afterwards. title, dataset, cert_tier and active never
-- move, and neither does any other tier of this course.
--
-- The published strings below were read from the LIVE production row (see
-- docs/prompt-leak-recut/RECUT-scal-beginner.json) and the recut strings were
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
   where c.app_slug = 'scal' and c.tier <> 'beginner';
  if v_other is null then
    raise exception 'promptleak recut scal/beginner refused: scal has no other tiers, so the row set is not what this migration was written against';
  end if;

  select case
           when prompt = 'Run the Ekene displacement from its designed relative permeability set (Corey with Swc 0.35, Sor 0.25, krwMax 0.3, kroMax 0.9, nw 2.5, no 2.0; water 0.5 cp against oil 1.8 cp) and read the flood: the endpoint mobility ratio, the Welge front saturation and the fractional flow at the front, the pore volumes injected at breakthrough, the displacement efficiency at breakthrough, and the days to breakthrough at a steady 8000 bwpd on the fixture pore volume.'
            and fields = '[{"key": "m_ratio", "tol": 0.005, "unit": "-", "label": "Endpoint mobility ratio M", "expected": 1.2}, {"key": "swf", "tol": 0.0005, "unit": "fraction", "label": "Welge front saturation Swf", "expected": 0.6372}, {"key": "fwf", "tol": 0.001, "unit": "fraction", "label": "Fractional flow at the front", "expected": 0.8682763300877854}, {"key": "qi_bt_pv", "tol": 0.001, "unit": "PV", "label": "Pore volumes injected at breakthrough", "expected": 0.33077027444818546}, {"key": "ed_bt", "tol": 0.001, "unit": "fraction", "label": "Displacement efficiency at breakthrough", "expected": 0.5088773453049006}, {"key": "bt_days_8000", "tol": 2, "unit": "days", "label": "Days to breakthrough at 8000 bwpd", "expected": 926.6051908800841}]'::jsonb then 'old'
           when prompt = 'Run the Ekene displacement from its designed relative permeability set (Corey with Swc 0.35, Sor 0.25, krwMax 0.3, kroMax 0.9 and the Corey exponents the fixture itself carries; water 0.5 cp against oil 1.8 cp) and read the flood: the endpoint mobility ratio, the Welge front saturation and the fractional flow at the front, the pore volumes injected at breakthrough, the displacement efficiency at breakthrough, and the days to breakthrough at a steady 8000 bwpd on the fixture pore volume.'
            and fields = '[{"key": "m_ratio", "tol": 0.005, "unit": "-", "label": "Endpoint mobility ratio M", "expected": 1.2}, {"key": "swf", "tol": 0.0005, "unit": "fraction", "label": "Welge front saturation Swf", "expected": 0.6372}, {"key": "fwf", "tol": 0.001, "unit": "fraction", "label": "Fractional flow at the front", "expected": 0.8682763300877854}, {"key": "qi_bt_pv", "tol": 0.001, "unit": "PV", "label": "Pore volumes injected at breakthrough", "expected": 0.33077027444818546}, {"key": "ed_bt", "tol": 0.001, "unit": "fraction", "label": "Displacement efficiency at breakthrough", "expected": 0.5088773453049006}, {"key": "bt_days_8000", "tol": 2, "unit": "days", "label": "Days to breakthrough at 8000 bwpd", "expected": 926.6051908800841}]'::jsonb then 'new'
           else 'other' end
    into v_state
    from public.academy_capstones
   where app_slug = 'scal' and tier = 'beginner' and active;

  if v_state is null then
    raise exception 'promptleak recut scal/beginner refused: no active scal beginner capstone row';
  end if;
  if v_state = 'other' then
    raise exception 'promptleak recut scal/beginner refused: the scal beginner prompt and fields match neither the published pair nor the recut pair';
  end if;

  if v_state = 'old' then
    update public.academy_capstones
       set prompt = 'Run the Ekene displacement from its designed relative permeability set (Corey with Swc 0.35, Sor 0.25, krwMax 0.3, kroMax 0.9 and the Corey exponents the fixture itself carries; water 0.5 cp against oil 1.8 cp) and read the flood: the endpoint mobility ratio, the Welge front saturation and the fractional flow at the front, the pore volumes injected at breakthrough, the displacement efficiency at breakthrough, and the days to breakthrough at a steady 8000 bwpd on the fixture pore volume.',
           fields = '[{"key": "m_ratio", "tol": 0.005, "unit": "-", "label": "Endpoint mobility ratio M", "expected": 1.2}, {"key": "swf", "tol": 0.0005, "unit": "fraction", "label": "Welge front saturation Swf", "expected": 0.6372}, {"key": "fwf", "tol": 0.001, "unit": "fraction", "label": "Fractional flow at the front", "expected": 0.8682763300877854}, {"key": "qi_bt_pv", "tol": 0.001, "unit": "PV", "label": "Pore volumes injected at breakthrough", "expected": 0.33077027444818546}, {"key": "ed_bt", "tol": 0.001, "unit": "fraction", "label": "Displacement efficiency at breakthrough", "expected": 0.5088773453049006}, {"key": "bt_days_8000", "tol": 2, "unit": "days", "label": "Days to breakthrough at 8000 bwpd", "expected": 926.6051908800841}]'::jsonb
     where app_slug = 'scal' and tier = 'beginner' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then
      raise exception 'promptleak recut scal/beginner refused: the update touched % rows', v_count;
    end if;
    v_updated := v_updated + 1;
  end if;

  -- ------------------------------------------------ the unchanged assertions --
  select string_agg(f->>'key', ',' order by e.n)
    into v_keys
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) with ordinality as e(f, n)
   where c.app_slug = 'scal' and c.tier = 'beginner';
  if v_keys is distinct from 'm_ratio,swf,fwf,qi_bt_pv,ed_bt,bt_days_8000' then
    raise exception 'promptleak recut scal/beginner refused: the graded keys are now %, not the recut set', v_keys;
  end if;

  select count(*) into v_count
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'scal' and c.tier = 'beginner';
  if v_count <> 6 then
    raise exception 'promptleak recut scal/beginner refused: the beginner capstone carries % graded fields, expected 6', v_count;
  end if;

  select count(*) into v_count from public.academy_capstones where app_slug = 'scal';
  if v_count <> 3 then
    raise exception 'promptleak recut scal/beginner refused: scal has % capstones, expected 3', v_count;
  end if;

  select string_agg(c.tier || ':' || md5(c.prompt) || ':' || md5(c.fields::text), ',' order by c.tier)
    into v_keys
    from public.academy_capstones c
   where c.app_slug = 'scal' and c.tier <> 'beginner';
  if v_keys is distinct from v_other then
    raise exception 'promptleak recut scal/beginner refused: another tier of scal moved';
  end if;

  select case when prompt = 'Run the Ekene displacement from its designed relative permeability set (Corey with Swc 0.35, Sor 0.25, krwMax 0.3, kroMax 0.9 and the Corey exponents the fixture itself carries; water 0.5 cp against oil 1.8 cp) and read the flood: the endpoint mobility ratio, the Welge front saturation and the fractional flow at the front, the pore volumes injected at breakthrough, the displacement efficiency at breakthrough, and the days to breakthrough at a steady 8000 bwpd on the fixture pore volume.' and fields = '[{"key": "m_ratio", "tol": 0.005, "unit": "-", "label": "Endpoint mobility ratio M", "expected": 1.2}, {"key": "swf", "tol": 0.0005, "unit": "fraction", "label": "Welge front saturation Swf", "expected": 0.6372}, {"key": "fwf", "tol": 0.001, "unit": "fraction", "label": "Fractional flow at the front", "expected": 0.8682763300877854}, {"key": "qi_bt_pv", "tol": 0.001, "unit": "PV", "label": "Pore volumes injected at breakthrough", "expected": 0.33077027444818546}, {"key": "ed_bt", "tol": 0.001, "unit": "fraction", "label": "Displacement efficiency at breakthrough", "expected": 0.5088773453049006}, {"key": "bt_days_8000", "tol": 2, "unit": "days", "label": "Days to breakthrough at 8000 bwpd", "expected": 926.6051908800841}]'::jsonb then 'ok' else 'bad' end
    into v_state
    from public.academy_capstones where app_slug = 'scal' and tier = 'beginner' and active;
  if v_state <> 'ok' then
    raise exception 'promptleak recut scal/beginner refused: the row does not hold the recut prompt and fields after the update';
  end if;

  raise notice 'promptleak recut scal/beginner: % of 1 row rewritten', v_updated;
end $$;

-- ---------------------------------------------------------------- read-back --
select 'prompt leak recut' as migration, c.app_slug, c.tier,
       md5(c.prompt) as prompt_md5, length(c.prompt) as prompt_len,
       e.n as ord, e.f->>'key' as key, e.f->>'label' as label,
       (e.f->>'expected')::numeric as expected, (e.f->>'tol')::numeric as tol
  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) with ordinality as e(f, n)
 where c.app_slug = 'scal' and c.tier = 'beginner'
 order by e.n;
