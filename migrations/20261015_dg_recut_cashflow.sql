-- ==========================================================================
-- DIGEST-COPY RECUT: cashflow, question text only.
--
-- WHY. The live bank tells learners what "the digest" prints, points at numbered
-- SECTIONs of it, or names the authors' generator. The digest is the course
-- authors' internal reference file and no learner can see it. Each row below is
-- rewritten to name what the learner has: the course, the lesson, the lab or the
-- engine. Nothing else moves: no answer index, no option order, no ord, no
-- module key, no scope, no row count. Option lengths keep their rank.
--
-- SOURCE of the new text: hand edits in the recut generator (this course has no committed bank source).
-- Rows: 4 (advanced 4).
--
-- GUARDS. Each row is addressed by (app_slug, tier, scope, module_key, ord) and must
-- carry EITHER its published text exactly (then it is updated) OR the recut text
-- exactly (already applied, left alone). Anything else raises and the whole
-- transaction rolls back. Every update must touch exactly 1 row, and the course
-- must still hold its question count at the end. SAFE TO RE-RUN.
-- Published text was read from a replay of every question migration at origin/main,
-- FC9's recut (#181) and the B3 engine-strings recut (#184) included, so a row either
-- of those rewrote is expected to carry THEIR text: apply them first.
-- (docs/digest-recut/RECUT-cashflow.json carries OLD and NEW for every row).
-- ==========================================================================

do $$
declare
  v_state   text;
  v_count   integer;
  v_updated integer := 0;
  v_total   integer;
begin

  -- advanced final ord 4
  select case
           when prompt = 'Under the 2021 Act the worked example pays TET of 25999871.36 and under the 2025 framework a development levy of 41599794.17, with royalty, HCT and CIT unchanged. Why does the digest call the levy 1.6 x TET?' and options = '["The levy is charged on the HCT base, which is 15000000.00 larger because NDDC is not deducted from it.", "Same base, the CIT assessable profit of 1039994854.24; only the rates differ, 4 against 2.5.", "The levy is charged on the chargeable profit of 979994854.24 after the restriction, and then on the restricted amount again.", "The levy includes the TET it replaced plus the HCDT of 5100000.00 rolled into one line."]'::jsonb and answer_index = 1 and explanation is not distinct from 'Total tax moves from 604809283.90 to 620409206.71 and NPV from 135185570.34 to 119585647.53; the rate is the smaller part of the difference, the base is where the money is.' then 'old'
           when prompt = 'Under the 2021 Act the worked example pays TET of 25999871.36 and under the 2025 framework a development levy of 41599794.17, with royalty, HCT and CIT unchanged. Why does the course call the levy 1.6 x TET?' and options = '["The levy is charged on the HCT base, which is 15000000.00 larger because NDDC is not deducted from it.", "Same base, the CIT assessable profit of 1039994854.24; only the rates differ, 4 against 2.5.", "The levy is charged on the chargeable profit of 979994854.24 after the restriction, and then on the restricted amount again.", "The levy includes the TET it replaced plus the HCDT of 5100000.00 rolled into one line."]'::jsonb and answer_index = 1 and explanation is not distinct from 'Total tax moves from 604809283.90 to 620409206.71 and NPV from 135185570.34 to 119585647.53; the rate is the smaller part of the difference, the base is where the money is.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'cashflow' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, cashflow refused: no row for advanced final ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, cashflow refused: advanced final ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Under the 2021 Act the worked example pays TET of 25999871.36 and under the 2025 framework a development levy of 41599794.17, with royalty, HCT and CIT unchanged. Why does the course call the levy 1.6 x TET?', options = '["The levy is charged on the HCT base, which is 15000000.00 larger because NDDC is not deducted from it.", "Same base, the CIT assessable profit of 1039994854.24; only the rates differ, 4 against 2.5.", "The levy is charged on the chargeable profit of 979994854.24 after the restriction, and then on the restricted amount again.", "The levy includes the TET it replaced plus the HCDT of 5100000.00 rolled into one line."]'::jsonb, explanation = 'Total tax moves from 604809283.90 to 620409206.71 and NPV from 135185570.34 to 119585647.53; the rate is the smaller part of the difference, the base is where the money is.'
     where app_slug = 'cashflow' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, cashflow refused: advanced final ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 13
  select case
           when prompt = 'The engine models the conservative and aggressive readings of deep offshore HCT, 141623594.88 and 61725382.46 on AKATA, and will not choose. Who does?' and options = '["The engine''s default, conservative_zero, which the digest records as a finding of the extraction.", "The terrain string, which carries the reading with it and settles the rate once the terrain is entered.", "The owner of the discount rate, since the two readings differ only in the rate at which the HCT is discounted.", "Counsel; a ledger that reports one without the other has taken a legal position without saying so."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The engine models one reading of the law at a time; conservative_zero is a default, not a finding.' then 'old'
           when prompt = 'The engine models the conservative and aggressive readings of deep offshore HCT, 141623594.88 and 61725382.46 on AKATA, and will not choose. Who does?' and options = '["The engine''s default, conservative_zero, which the course records as a finding of the extraction.", "The terrain string, which carries the reading with it and settles the rate once the terrain is entered.", "The owner of the discount rate, since the two readings differ only in the rate at which the HCT is discounted.", "Counsel; a ledger that reports one without the other has taken a legal position without saying so."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The engine models one reading of the law at a time; conservative_zero is a default, not a finding.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'cashflow' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, cashflow refused: no row for advanced final ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, cashflow refused: advanced final ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The engine models the conservative and aggressive readings of deep offshore HCT, 141623594.88 and 61725382.46 on AKATA, and will not choose. Who does?', options = '["The engine''s default, conservative_zero, which the course records as a finding of the extraction.", "The terrain string, which carries the reading with it and settles the rate once the terrain is entered.", "The owner of the discount rate, since the two readings differ only in the rate at which the HCT is discounted.", "Counsel; a ledger that reports one without the other has taken a legal position without saying so."]'::jsonb, explanation = 'The engine models one reading of the law at a time; conservative_zero is a default, not a finding.'
     where app_slug = 'cashflow' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, cashflow refused: advanced final ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m04-levies-and-losses ord 1
  select case
           when prompt = 'On the published PIA worked example the tertiary education tax is 25999871.36 under pia_only and the development levy is 41599794.17 under nta_2025, and the digest calls the levy 1.6 x TET. What makes the ratio exactly the ratio of the rates?' and options = '["The levy is charged on the HCT assessable profit of 1054994854.24, which is larger than the CIT base by the fixed NDDC, and the extra base happens to match the rate change.", "Both are charged on the same line, the CIT assessable profit of 1039994854.24, so only the rates differ, 4 against 2.5.", "The levy is charged on the chargeable profit of 979994854.24 after the two-thirds restriction and then grossed up by the restriction, which returns the ratio of the rates.", "The levy includes the TET it replaces, so the 4 percent is the old TET with a surcharge stacked on the same base."]'::jsonb and answer_index = 1 and explanation is not distinct from 'Royalty 217405145.76, HCT 284810956.27 and CIT 293998456.27 are identical in both runs; only the last line changes, and total tax moves from 604809283.90 to 620409206.71.' then 'old'
           when prompt = 'On the published PIA worked example the tertiary education tax is 25999871.36 under pia_only and the development levy is 41599794.17 under nta_2025, and the course calls the levy 1.6 x TET. What makes the ratio exactly the ratio of the rates?' and options = '["The levy is charged on the HCT assessable profit of 1054994854.24, which is larger than the CIT base by the fixed NDDC, and the extra base happens to match the rate change.", "Both are charged on the same line, the CIT assessable profit of 1039994854.24, so only the rates differ, 4 against 2.5.", "The levy is charged on the chargeable profit of 979994854.24 after the two-thirds restriction and then grossed up by the restriction, which returns the ratio of the rates.", "The levy includes the TET it replaces, so the 4 percent is the old TET with a surcharge stacked on the same base."]'::jsonb and answer_index = 1 and explanation is not distinct from 'Royalty 217405145.76, HCT 284810956.27 and CIT 293998456.27 are identical in both runs; only the last line changes, and total tax moves from 604809283.90 to 620409206.71.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'cashflow' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-levies-and-losses' and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, cashflow refused: no row for advanced m04-levies-and-losses ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, cashflow refused: advanced m04-levies-and-losses ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'On the published PIA worked example the tertiary education tax is 25999871.36 under pia_only and the development levy is 41599794.17 under nta_2025, and the course calls the levy 1.6 x TET. What makes the ratio exactly the ratio of the rates?', options = '["The levy is charged on the HCT assessable profit of 1054994854.24, which is larger than the CIT base by the fixed NDDC, and the extra base happens to match the rate change.", "Both are charged on the same line, the CIT assessable profit of 1039994854.24, so only the rates differ, 4 against 2.5.", "The levy is charged on the chargeable profit of 979994854.24 after the two-thirds restriction and then grossed up by the restriction, which returns the ratio of the rates.", "The levy includes the TET it replaces, so the 4 percent is the old TET with a surcharge stacked on the same base."]'::jsonb, explanation = 'Royalty 217405145.76, HCT 284810956.27 and CIT 293998456.27 are identical in both runs; only the last line changes, and total tax moves from 604809283.90 to 620409206.71.'
     where app_slug = 'cashflow' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-levies-and-losses' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, cashflow refused: advanced m04-levies-and-losses ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-expert-reading ord 11
  select case
           when prompt = 'The engine holds both readings of deep offshore HCT, 141623594.88 and 61725382.46 on AKATA. Which does it choose?' and options = '["The conservative one, which the digest records as conservative_zero and which is a finding of the extraction rather than a default.", "Neither: the choice belongs to counsel, and a ledger that reports one without the other has taken a legal position without saying so.", "The aggressive one, because the engine prefers the reading that collects more tax when the law is unsettled.", "The one that agrees with the terrain string, since deep offshore under the 2025 framework carries a fixed rate of 0.300000 in the table."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The engine models one reading of the law at a time; conservative_zero is a default somebody chose, not a finding.' then 'old'
           when prompt = 'The engine holds both readings of deep offshore HCT, 141623594.88 and 61725382.46 on AKATA. Which does it choose?' and options = '["The conservative one, which the course records as conservative_zero and which is a finding of the extraction rather than a default.", "Neither: the choice belongs to counsel, and a ledger that reports one without the other has taken a legal position without saying so.", "The aggressive one, because the engine prefers the reading that collects more tax when the law is unsettled.", "The one that agrees with the terrain string, since deep offshore under the 2025 framework carries a fixed rate of 0.300000 in the table."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The engine models one reading of the law at a time; conservative_zero is a default somebody chose, not a finding.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'cashflow' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 11;
  if v_state is null then raise exception 'digest-copy recut, cashflow refused: no row for advanced m06-the-expert-reading ord 11'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, cashflow refused: advanced m06-the-expert-reading ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The engine holds both readings of deep offshore HCT, 141623594.88 and 61725382.46 on AKATA. Which does it choose?', options = '["The conservative one, which the course records as conservative_zero and which is a finding of the extraction rather than a default.", "Neither: the choice belongs to counsel, and a ledger that reports one without the other has taken a legal position without saying so.", "The aggressive one, because the engine prefers the reading that collects more tax when the law is unsettled.", "The one that agrees with the terrain string, since deep offshore under the 2025 framework carries a fixed rate of 0.300000 in the table."]'::jsonb, explanation = 'The engine models one reading of the law at a time; conservative_zero is a default somebody chose, not a finding.'
     where app_slug = 'cashflow' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, cashflow refused: advanced m06-the-expert-reading ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  select count(*) into v_total from public.academy_quiz_questions where app_slug = 'cashflow';
  if v_total <> 396 then raise exception 'digest-copy recut, cashflow refused: the course holds % questions, expected 396', v_total; end if;
  raise notice 'digest-copy recut, cashflow: % of 4 rows updated, the rest already carried the recut text', v_updated;
end $$;
