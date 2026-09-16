-- ============================================================================
-- PROMPT LEAK RECUT: Completion Design (completion), Expert tier.
--
-- WHY. The repaired promptleak gate (docs/gate-audit/promptleak.md, PR #137)
-- swept all 132 live capstone prompts for the first time and found that this
-- prompt hands a learner a graded answer.
--
-- WHAT LEAKED. "landed 2.28 m into it" is verbatim the graded value of
-- available_contraction_m (2.28 m, tol 5e-07). The available travel against
-- contraction IS the insertion depth, as the prompt's own trap paragraph
-- explains, so that field restated an input and graded nothing. It had to be
-- typed exactly, and it could be, exactly.
--
-- THE FIELD MOVES, NOT THE PROSE. The landing depth is the defining input of
-- the exercise and cannot leave the prompt, so the graded quantity is the thing
-- that changes: available_contraction_m is replaced by max_insertion_both_pass_m,
-- the DEEPEST landing at which both cases still pass, 4.299999999999999 m
-- (= 5.35 - 0.65 - 0.4, and the value spaceOutBand bisects to; the Landing sweep
-- view prints it as the "Deepest landing" tile). With the existing SHALLOWEST
-- landing at field 4 it closes the band the tier is about, and it makes the
-- prompt's own sizing check real: field 5 less field 4 is the band width, which
-- must equal 5.35 less the shortest usable bore.
--
-- NOTHING IS LOST BY DROPPING THE OLD FIELD. The go-live migration graded it to
-- catch a learner swapping the two directions; that swap still fails field 1,
-- because available elongation would come back as 2.28 rather than 3.07. The new
-- field additionally catches taking both band edges from the same design case,
-- which is the other named trap and was previously graded at one end only.
--
-- THE TIER-CUT COPY-PASTE IS FIXED TOO. This EXPERT prompt opened "Six space-out
-- values for the Associate capstone completion". The Associate capstone is a
-- fourteen-component string tally with no polished bore in it, so the phrase was
-- a tier-cut artefact rather than a reference. The tier cut itself is right:
-- tally, then clearances, then space-out. Only the sentence was wrong.
--
-- FIELD ORDER. The six are re-ordered to one available, two remainings, the two
-- band edges and the sizing result, and the prompt is renumbered to match.
--
-- SUPERSEDED ASSERTION. 20260830_dr8_completion_go_live.sql, already applied,
-- asserts available_contraction_m = 2.28 and the two-availables budget identity.
-- It is history and is not edited; re-running it after this recut would raise,
-- which is recorded here so that a clean-room replay is not a surprise.
--
-- GUARDS. The row must match EITHER the published prompt and fields exactly,
-- in which case it is rewritten, OR the recut prompt and fields exactly, in
-- which case it is already applied and left alone. Anything else raises and
-- the transaction rolls back. The update asserts it touched exactly 1 row and
-- the tier is re-read afterwards. title, dataset, cert_tier and active never
-- move, and neither does any other tier of this course.
--
-- The published strings below were read from the LIVE production row (see
-- docs/prompt-leak-recut/RECUT-completion-advanced.json) and the recut strings were
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
   where c.app_slug = 'completion' and c.tier <> 'advanced';
  if v_other is null then
    raise exception 'promptleak recut completion/advanced refused: completion has no other tiers, so the row set is not what this migration was written against';
  end if;

  select case
           when prompt = 'Six space-out values for the Associate capstone completion. The seal assembly runs in a POLISHED BORE RECEPTACLE of 5.35 m and is landed 2.28 m into it. The two design cases are an ELONGATION of 0.65 m and a CONTRACTION of 3.15 m. The margin is 0.4 m, which is NOT the 0.5 m the lessons use. Report: (1) the AVAILABLE travel for the elongation case in metres; (2) the AVAILABLE travel for the contraction case; (3) the REMAINING travel after the elongation case; (4) the REMAINING travel after the contraction case, WITH ITS SIGN; (5) the SMALLEST insertion depth at which BOTH cases pass with the margin, in metres; and (6) the SHORTEST polished bore that leaves any acceptable landing at all, in metres. Traps. Elongation pushes the seals DEEPER, so its available travel is the bore length LESS the insertion depth, and contraction pulls them OUT, so its available travel IS the insertion depth. Getting those two the wrong way round swaps fields 1 and 2 and both remainings with them. Field 4 is NEGATIVE and the sign is part of the answer: this landing fails the contraction case. Field 5 comes from the CONTRACTION case, because that is the lower bound on the landing, and not from the elongation case. Field 6 is the whole SWING plus TWICE the margin, once at each end, and using one margin gives an answer 0.4 m short. Free checks: fields 1 and 2 must sum to 5.35 exactly, because the insertion depth splits a fixed budget and never creates any; field 4 must equal field 2 less 3.15; field 5 must EXCEED the 2.28 m as landed, since the landing as given fails one case; and field 6 must be smaller than 5.35, since the band on this bore is open.'
            and fields = '[{"key": "available_elongation_m", "tol": 0.0000005, "unit": "m", "label": "Available, elongation", "expected": 3.07}, {"key": "available_contraction_m", "tol": 0.0000005, "unit": "m", "label": "Available, contraction", "expected": 2.28}, {"key": "remaining_elongation_m", "tol": 0.0000005, "unit": "m", "label": "Remaining after elongation", "expected": 2.42}, {"key": "remaining_contraction_m", "tol": 0.0000005, "unit": "m", "label": "Remaining after contraction", "expected": -0.8700000000000001}, {"key": "min_insertion_both_pass_m", "tol": 0.0000005, "unit": "m", "label": "Smallest insertion, both pass", "expected": 3.5500000000000003}, {"key": "min_pbr_length_m", "tol": 0.0000005, "unit": "m", "label": "Shortest usable PBR", "expected": 4.6000000000000005}]'::jsonb then 'old'
           when prompt = 'Six space-out values for a NEW seal assembly landing. The seal assembly runs in a POLISHED BORE RECEPTACLE of 5.35 m and is landed 2.28 m into it. The two design cases are an ELONGATION of 0.65 m and a CONTRACTION of 3.15 m. The margin is 0.4 m, which is NOT the 0.5 m the lessons use. Report: (1) the AVAILABLE travel for the elongation case in metres; (2) the REMAINING travel after the elongation case; (3) the REMAINING travel after the contraction case, WITH ITS SIGN; (4) the SMALLEST insertion depth at which BOTH cases pass with the margin, in metres; (5) the LARGEST insertion depth at which BOTH cases still pass, in metres; and (6) the SHORTEST polished bore that leaves any acceptable landing at all, in metres. Traps. Elongation pushes the seals DEEPER, so its available travel is the bore length LESS the insertion depth, and contraction pulls them OUT, so its available travel IS the insertion depth. Getting those two the wrong way round is the error this tier exists to catch, and field 1 is where it shows. Field 3 is NEGATIVE and the sign is part of the answer: this landing fails the contraction case. Field 4 comes from the CONTRACTION case, which is the lower bound on the landing, and field 5 from the ELONGATION case, which is the upper one; taking both from the same case is the other way this tier is failed. Field 6 is the whole SWING plus TWICE the margin, once at each end, and using one margin gives an answer 0.4 m short. Free checks: field 3 must equal the landing depth less 3.15, because the available travel against contraction IS the insertion depth; field 4 must EXCEED the 2.28 m as landed, since the landing as given fails one case; field 5 less field 4 is the width of the band, and it must equal 5.35 less field 6; and field 6 must be smaller than 5.35, since the band on this bore is open.'
            and fields = '[{"key": "available_elongation_m", "tol": 5e-07, "unit": "m", "label": "Available, elongation", "expected": 3.07}, {"key": "remaining_elongation_m", "tol": 5e-07, "unit": "m", "label": "Remaining after elongation", "expected": 2.42}, {"key": "remaining_contraction_m", "tol": 5e-07, "unit": "m", "label": "Remaining after contraction", "expected": -0.8700000000000001}, {"key": "min_insertion_both_pass_m", "tol": 5e-07, "unit": "m", "label": "Smallest insertion, both pass", "expected": 3.5500000000000003}, {"key": "max_insertion_both_pass_m", "label": "Largest insertion, both pass", "unit": "m", "expected": 4.299999999999999, "tol": 5e-07}, {"key": "min_pbr_length_m", "tol": 5e-07, "unit": "m", "label": "Shortest usable PBR", "expected": 4.6000000000000005}]'::jsonb then 'new'
           else 'other' end
    into v_state
    from public.academy_capstones
   where app_slug = 'completion' and tier = 'advanced' and active;

  if v_state is null then
    raise exception 'promptleak recut completion/advanced refused: no active completion advanced capstone row';
  end if;
  if v_state = 'other' then
    raise exception 'promptleak recut completion/advanced refused: the completion advanced prompt and fields match neither the published pair nor the recut pair';
  end if;

  if v_state = 'old' then
    update public.academy_capstones
       set prompt = 'Six space-out values for a NEW seal assembly landing. The seal assembly runs in a POLISHED BORE RECEPTACLE of 5.35 m and is landed 2.28 m into it. The two design cases are an ELONGATION of 0.65 m and a CONTRACTION of 3.15 m. The margin is 0.4 m, which is NOT the 0.5 m the lessons use. Report: (1) the AVAILABLE travel for the elongation case in metres; (2) the REMAINING travel after the elongation case; (3) the REMAINING travel after the contraction case, WITH ITS SIGN; (4) the SMALLEST insertion depth at which BOTH cases pass with the margin, in metres; (5) the LARGEST insertion depth at which BOTH cases still pass, in metres; and (6) the SHORTEST polished bore that leaves any acceptable landing at all, in metres. Traps. Elongation pushes the seals DEEPER, so its available travel is the bore length LESS the insertion depth, and contraction pulls them OUT, so its available travel IS the insertion depth. Getting those two the wrong way round is the error this tier exists to catch, and field 1 is where it shows. Field 3 is NEGATIVE and the sign is part of the answer: this landing fails the contraction case. Field 4 comes from the CONTRACTION case, which is the lower bound on the landing, and field 5 from the ELONGATION case, which is the upper one; taking both from the same case is the other way this tier is failed. Field 6 is the whole SWING plus TWICE the margin, once at each end, and using one margin gives an answer 0.4 m short. Free checks: field 3 must equal the landing depth less 3.15, because the available travel against contraction IS the insertion depth; field 4 must EXCEED the 2.28 m as landed, since the landing as given fails one case; field 5 less field 4 is the width of the band, and it must equal 5.35 less field 6; and field 6 must be smaller than 5.35, since the band on this bore is open.',
           fields = '[{"key": "available_elongation_m", "tol": 5e-07, "unit": "m", "label": "Available, elongation", "expected": 3.07}, {"key": "remaining_elongation_m", "tol": 5e-07, "unit": "m", "label": "Remaining after elongation", "expected": 2.42}, {"key": "remaining_contraction_m", "tol": 5e-07, "unit": "m", "label": "Remaining after contraction", "expected": -0.8700000000000001}, {"key": "min_insertion_both_pass_m", "tol": 5e-07, "unit": "m", "label": "Smallest insertion, both pass", "expected": 3.5500000000000003}, {"key": "max_insertion_both_pass_m", "label": "Largest insertion, both pass", "unit": "m", "expected": 4.299999999999999, "tol": 5e-07}, {"key": "min_pbr_length_m", "tol": 5e-07, "unit": "m", "label": "Shortest usable PBR", "expected": 4.6000000000000005}]'::jsonb
     where app_slug = 'completion' and tier = 'advanced' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then
      raise exception 'promptleak recut completion/advanced refused: the update touched % rows', v_count;
    end if;
    v_updated := v_updated + 1;
  end if;

  -- ------------------------------------------------ the unchanged assertions --
  select string_agg(f->>'key', ',' order by e.n)
    into v_keys
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) with ordinality as e(f, n)
   where c.app_slug = 'completion' and c.tier = 'advanced';
  if v_keys is distinct from 'available_elongation_m,remaining_elongation_m,remaining_contraction_m,min_insertion_both_pass_m,max_insertion_both_pass_m,min_pbr_length_m' then
    raise exception 'promptleak recut completion/advanced refused: the graded keys are now %, not the recut set', v_keys;
  end if;

  select count(*) into v_count
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'completion' and c.tier = 'advanced';
  if v_count <> 6 then
    raise exception 'promptleak recut completion/advanced refused: the advanced capstone carries % graded fields, expected 6', v_count;
  end if;

  select count(*) into v_count from public.academy_capstones where app_slug = 'completion';
  if v_count <> 3 then
    raise exception 'promptleak recut completion/advanced refused: completion has % capstones, expected 3', v_count;
  end if;

  select string_agg(c.tier || ':' || md5(c.prompt) || ':' || md5(c.fields::text), ',' order by c.tier)
    into v_keys
    from public.academy_capstones c
   where c.app_slug = 'completion' and c.tier <> 'advanced';
  if v_keys is distinct from v_other then
    raise exception 'promptleak recut completion/advanced refused: another tier of completion moved';
  end if;

  select case when prompt = 'Six space-out values for a NEW seal assembly landing. The seal assembly runs in a POLISHED BORE RECEPTACLE of 5.35 m and is landed 2.28 m into it. The two design cases are an ELONGATION of 0.65 m and a CONTRACTION of 3.15 m. The margin is 0.4 m, which is NOT the 0.5 m the lessons use. Report: (1) the AVAILABLE travel for the elongation case in metres; (2) the REMAINING travel after the elongation case; (3) the REMAINING travel after the contraction case, WITH ITS SIGN; (4) the SMALLEST insertion depth at which BOTH cases pass with the margin, in metres; (5) the LARGEST insertion depth at which BOTH cases still pass, in metres; and (6) the SHORTEST polished bore that leaves any acceptable landing at all, in metres. Traps. Elongation pushes the seals DEEPER, so its available travel is the bore length LESS the insertion depth, and contraction pulls them OUT, so its available travel IS the insertion depth. Getting those two the wrong way round is the error this tier exists to catch, and field 1 is where it shows. Field 3 is NEGATIVE and the sign is part of the answer: this landing fails the contraction case. Field 4 comes from the CONTRACTION case, which is the lower bound on the landing, and field 5 from the ELONGATION case, which is the upper one; taking both from the same case is the other way this tier is failed. Field 6 is the whole SWING plus TWICE the margin, once at each end, and using one margin gives an answer 0.4 m short. Free checks: field 3 must equal the landing depth less 3.15, because the available travel against contraction IS the insertion depth; field 4 must EXCEED the 2.28 m as landed, since the landing as given fails one case; field 5 less field 4 is the width of the band, and it must equal 5.35 less field 6; and field 6 must be smaller than 5.35, since the band on this bore is open.' and fields = '[{"key": "available_elongation_m", "tol": 5e-07, "unit": "m", "label": "Available, elongation", "expected": 3.07}, {"key": "remaining_elongation_m", "tol": 5e-07, "unit": "m", "label": "Remaining after elongation", "expected": 2.42}, {"key": "remaining_contraction_m", "tol": 5e-07, "unit": "m", "label": "Remaining after contraction", "expected": -0.8700000000000001}, {"key": "min_insertion_both_pass_m", "tol": 5e-07, "unit": "m", "label": "Smallest insertion, both pass", "expected": 3.5500000000000003}, {"key": "max_insertion_both_pass_m", "label": "Largest insertion, both pass", "unit": "m", "expected": 4.299999999999999, "tol": 5e-07}, {"key": "min_pbr_length_m", "tol": 5e-07, "unit": "m", "label": "Shortest usable PBR", "expected": 4.6000000000000005}]'::jsonb then 'ok' else 'bad' end
    into v_state
    from public.academy_capstones where app_slug = 'completion' and tier = 'advanced' and active;
  if v_state <> 'ok' then
    raise exception 'promptleak recut completion/advanced refused: the row does not hold the recut prompt and fields after the update';
  end if;

  raise notice 'promptleak recut completion/advanced: % of 1 row rewritten', v_updated;
end $$;

-- ---------------------------------------------------------------- read-back --
select 'prompt leak recut' as migration, c.app_slug, c.tier,
       md5(c.prompt) as prompt_md5, length(c.prompt) as prompt_len,
       e.n as ord, e.f->>'key' as key, e.f->>'label' as label,
       (e.f->>'expected')::numeric as expected, (e.f->>'tol')::numeric as tol
  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) with ordinality as e(f, n)
 where c.app_slug = 'completion' and c.tier = 'advanced'
 order by e.n;
