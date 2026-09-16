-- ============================================================================
-- PROMPT LEAK RECUT: Seismolord (seismolord), Expert tier.
--
-- WHY. The repaired promptleak gate (docs/gate-audit/promptleak.md, PR #137)
-- swept all 132 live capstone prompts for the first time and found that this
-- prompt hands a learner a graded answer.
--
-- WHAT LEAKED. The prompt states the reflection pair as RC +0.08 / -0.08, and
-- iso25_amp (0.07999999821186066, tol 0.002) is that coefficient by
-- construction: at the thick end of the wedge the amplitude IS the top
-- coefficient. The field was satisfied by copying the stated input, and 0.08
-- passes comfortably inside the tolerance.
--
-- THE FIELD MOVES, NOT THE PROSE, because the audit's own recommendation was to
-- grade something the wedge decides. The reflection pair is the model
-- definition and cannot leave the prompt, and restating it as an impedance
-- contrast would only hide the same number from the gate while every lesson in
-- the tier still prints it. So iso25_amp is replaced by tune25_iso_ratio, the
-- ratio of the 25 Hz tuning amplitude to the isolated level, 1.4449345270902185
-- (tol 0.001). That number is scale invariant: it is the same for a pair of
-- 0.05 or 0.10, so no statement of the coefficients can give it away. It is
-- decided by the wavelet and the interference alone, the panel prints it on the
-- "Amplitude relative to isolated" tile at the tuning thickness, and
-- wedgeLab.test.js already pins it independently of this capstone.
--
-- Both routes to it are accepted: against the float32 isolated level it is
-- 1.4449345270902185 and against the exact 0.08 it is 1.444934494793415, and
-- the two differ by 3.2e-08, far inside the 0.001 tolerance.
--
-- GUARDS. The row must match EITHER the published prompt and fields exactly,
-- in which case it is rewritten, OR the recut prompt and fields exactly, in
-- which case it is already applied and left alone. Anything else raises and
-- the transaction rolls back. The update asserts it touched exactly 1 row and
-- the tier is re-read afterwards. title, dataset, cert_tier and active never
-- move, and neither does any other tier of this course.
--
-- The published strings below were read from the LIVE production row (see
-- docs/prompt-leak-recut/RECUT-seismolord-advanced.json) and the recut strings were
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
   where c.app_slug = 'seismolord' and c.tier <> 'advanced';
  if v_other is null then
    raise exception 'promptleak recut seismolord/advanced refused: seismolord has no other tiers, so the row set is not what this migration was written against';
  end if;

  select case
           when prompt = 'Model the SAND top and base as an equal and opposite reflection pair (RC +0.08 / -0.08) in a wedge from 0 to 60 ms at a 2 ms sample rate. Read the tuning panel at 25 Hz and 40 Hz: the tuning thickness and its peak amplitude at each frequency, the isolated-reflector amplitude on the thick end at 25 Hz, and the Kallweit-Wood theoretical tuning thickness sqrt(6)/(2*pi*f) at 25 Hz.'
            and fields = '[{"key": "tune25_ms", "tol": 0, "unit": "ms", "label": "Tuning thickness at 25 Hz", "expected": 16}, {"key": "tune25_amp", "tol": 0.002, "unit": "-", "label": "Peak amplitude at 25 Hz tuning", "expected": 0.1155947595834732}, {"key": "tune40_ms", "tol": 0, "unit": "ms", "label": "Tuning thickness at 40 Hz", "expected": 10}, {"key": "tune40_amp", "tol": 0.002, "unit": "-", "label": "Peak amplitude at 40 Hz tuning", "expected": 0.1155947595834732}, {"key": "iso25_amp", "tol": 0.002, "unit": "-", "label": "Isolated-reflector amplitude at 25 Hz", "expected": 0.07999999821186066}, {"key": "theory25_ms", "tol": 0.05, "unit": "ms", "label": "Theoretical tuning thickness at 25 Hz", "expected": 15.593936024673521}]'::jsonb then 'old'
           when prompt = 'Model the SAND top and base as an equal and opposite reflection pair (RC +0.08 / -0.08) in a wedge from 0 to 60 ms at a 2 ms sample rate. Read the tuning panel at 25 Hz and 40 Hz: the tuning thickness and its peak amplitude at each frequency, the ratio of the 25 Hz tuning amplitude to the isolated-reflector level on the thick end of the same run, and the Kallweit-Wood theoretical tuning thickness sqrt(6)/(2*pi*f) at 25 Hz.'
            and fields = '[{"key": "tune25_ms", "tol": 0, "unit": "ms", "label": "Tuning thickness at 25 Hz", "expected": 16}, {"key": "tune25_amp", "tol": 0.002, "unit": "-", "label": "Peak amplitude at 25 Hz tuning", "expected": 0.1155947595834732}, {"key": "tune40_ms", "tol": 0, "unit": "ms", "label": "Tuning thickness at 40 Hz", "expected": 10}, {"key": "tune40_amp", "tol": 0.002, "unit": "-", "label": "Peak amplitude at 40 Hz tuning", "expected": 0.1155947595834732}, {"key": "tune25_iso_ratio", "label": "Tuning amplitude over the isolated level at 25 Hz", "unit": "-", "expected": 1.4449345270902185, "tol": 0.001}, {"key": "theory25_ms", "tol": 0.05, "unit": "ms", "label": "Theoretical tuning thickness at 25 Hz", "expected": 15.593936024673521}]'::jsonb then 'new'
           else 'other' end
    into v_state
    from public.academy_capstones
   where app_slug = 'seismolord' and tier = 'advanced' and active;

  if v_state is null then
    raise exception 'promptleak recut seismolord/advanced refused: no active seismolord advanced capstone row';
  end if;
  if v_state = 'other' then
    raise exception 'promptleak recut seismolord/advanced refused: the seismolord advanced prompt and fields match neither the published pair nor the recut pair';
  end if;

  if v_state = 'old' then
    update public.academy_capstones
       set prompt = 'Model the SAND top and base as an equal and opposite reflection pair (RC +0.08 / -0.08) in a wedge from 0 to 60 ms at a 2 ms sample rate. Read the tuning panel at 25 Hz and 40 Hz: the tuning thickness and its peak amplitude at each frequency, the ratio of the 25 Hz tuning amplitude to the isolated-reflector level on the thick end of the same run, and the Kallweit-Wood theoretical tuning thickness sqrt(6)/(2*pi*f) at 25 Hz.',
           fields = '[{"key": "tune25_ms", "tol": 0, "unit": "ms", "label": "Tuning thickness at 25 Hz", "expected": 16}, {"key": "tune25_amp", "tol": 0.002, "unit": "-", "label": "Peak amplitude at 25 Hz tuning", "expected": 0.1155947595834732}, {"key": "tune40_ms", "tol": 0, "unit": "ms", "label": "Tuning thickness at 40 Hz", "expected": 10}, {"key": "tune40_amp", "tol": 0.002, "unit": "-", "label": "Peak amplitude at 40 Hz tuning", "expected": 0.1155947595834732}, {"key": "tune25_iso_ratio", "label": "Tuning amplitude over the isolated level at 25 Hz", "unit": "-", "expected": 1.4449345270902185, "tol": 0.001}, {"key": "theory25_ms", "tol": 0.05, "unit": "ms", "label": "Theoretical tuning thickness at 25 Hz", "expected": 15.593936024673521}]'::jsonb
     where app_slug = 'seismolord' and tier = 'advanced' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then
      raise exception 'promptleak recut seismolord/advanced refused: the update touched % rows', v_count;
    end if;
    v_updated := v_updated + 1;
  end if;

  -- ------------------------------------------------ the unchanged assertions --
  select string_agg(f->>'key', ',' order by e.n)
    into v_keys
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) with ordinality as e(f, n)
   where c.app_slug = 'seismolord' and c.tier = 'advanced';
  if v_keys is distinct from 'tune25_ms,tune25_amp,tune40_ms,tune40_amp,tune25_iso_ratio,theory25_ms' then
    raise exception 'promptleak recut seismolord/advanced refused: the graded keys are now %, not the recut set', v_keys;
  end if;

  select count(*) into v_count
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'seismolord' and c.tier = 'advanced';
  if v_count <> 6 then
    raise exception 'promptleak recut seismolord/advanced refused: the advanced capstone carries % graded fields, expected 6', v_count;
  end if;

  select count(*) into v_count from public.academy_capstones where app_slug = 'seismolord';
  if v_count <> 3 then
    raise exception 'promptleak recut seismolord/advanced refused: seismolord has % capstones, expected 3', v_count;
  end if;

  select string_agg(c.tier || ':' || md5(c.prompt) || ':' || md5(c.fields::text), ',' order by c.tier)
    into v_keys
    from public.academy_capstones c
   where c.app_slug = 'seismolord' and c.tier <> 'advanced';
  if v_keys is distinct from v_other then
    raise exception 'promptleak recut seismolord/advanced refused: another tier of seismolord moved';
  end if;

  select case when prompt = 'Model the SAND top and base as an equal and opposite reflection pair (RC +0.08 / -0.08) in a wedge from 0 to 60 ms at a 2 ms sample rate. Read the tuning panel at 25 Hz and 40 Hz: the tuning thickness and its peak amplitude at each frequency, the ratio of the 25 Hz tuning amplitude to the isolated-reflector level on the thick end of the same run, and the Kallweit-Wood theoretical tuning thickness sqrt(6)/(2*pi*f) at 25 Hz.' and fields = '[{"key": "tune25_ms", "tol": 0, "unit": "ms", "label": "Tuning thickness at 25 Hz", "expected": 16}, {"key": "tune25_amp", "tol": 0.002, "unit": "-", "label": "Peak amplitude at 25 Hz tuning", "expected": 0.1155947595834732}, {"key": "tune40_ms", "tol": 0, "unit": "ms", "label": "Tuning thickness at 40 Hz", "expected": 10}, {"key": "tune40_amp", "tol": 0.002, "unit": "-", "label": "Peak amplitude at 40 Hz tuning", "expected": 0.1155947595834732}, {"key": "tune25_iso_ratio", "label": "Tuning amplitude over the isolated level at 25 Hz", "unit": "-", "expected": 1.4449345270902185, "tol": 0.001}, {"key": "theory25_ms", "tol": 0.05, "unit": "ms", "label": "Theoretical tuning thickness at 25 Hz", "expected": 15.593936024673521}]'::jsonb then 'ok' else 'bad' end
    into v_state
    from public.academy_capstones where app_slug = 'seismolord' and tier = 'advanced' and active;
  if v_state <> 'ok' then
    raise exception 'promptleak recut seismolord/advanced refused: the row does not hold the recut prompt and fields after the update';
  end if;

  raise notice 'promptleak recut seismolord/advanced: % of 1 row rewritten', v_updated;
end $$;

-- ---------------------------------------------------------------- read-back --
select 'prompt leak recut' as migration, c.app_slug, c.tier,
       md5(c.prompt) as prompt_md5, length(c.prompt) as prompt_len,
       e.n as ord, e.f->>'key' as key, e.f->>'label' as label,
       (e.f->>'expected')::numeric as expected, (e.f->>'tol')::numeric as tol
  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) with ordinality as e(f, n)
 where c.app_slug = 'seismolord' and c.tier = 'advanced'
 order by e.n;
