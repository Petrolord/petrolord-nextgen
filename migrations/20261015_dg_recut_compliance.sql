-- ==========================================================================
-- DIGEST-COPY RECUT: compliance, question text only.
--
-- WHY. The live bank tells learners what "the digest" prints, points at numbered
-- SECTIONs of it, or names the authors' generator. The digest is the course
-- authors' internal reference file and no learner can see it. Each row below is
-- rewritten to name what the learner has: the course, the lesson, the lab or the
-- engine. Nothing else moves: no answer index, no option order, no ord, no
-- module key, no scope, no row count. Option lengths keep their rank.
--
-- SOURCE of the new text: the regenerated bank JSON under tools/course-banks/compliance, built from its committed .py sources.
-- Rows: 64 (beginner 27, intermediate 18, advanced 19).
--
-- GUARDS. Each row is addressed by (app_slug, tier, scope, module_key, ord) and must
-- carry EITHER its published text exactly (then it is updated) OR the recut text
-- exactly (already applied, left alone). Anything else raises and the whole
-- transaction rolls back. Every update must touch exactly 1 row, and the course
-- must still hold its question count at the end. SAFE TO RE-RUN.
-- Published text was read from a replay of every question migration at origin/main,
-- FC9's recut (#181) and the B3 engine-strings recut (#184) included, so a row either
-- of those rewrote is expected to carry THEIR text: apply them first.
-- (docs/digest-recut/RECUT-compliance.json carries OLD and NEW for every row).
-- ==========================================================================

do $$
declare
  v_state   text;
  v_count   integer;
  v_updated integer := 0;
  v_total   integer;
begin

  -- beginner final ord 3
  select case
           when prompt = 'When the date passed as today cannot be read, the register refuses while the library answers Review scheduled for a published document whose review date is 2020-01-06. Why the two behaviours?' and options = '["The library reads its own clock instead.", "Review scheduled is the library''s refusal.", "Old review dates are exempt from the check.", "Only deriveStatus refuses an unreadable today, which is AS15 Q1."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The register''s refusal is the RangeError deriveStatus throws. The library''s Review scheduled is an answer given as though nothing were due, a held limit of the digest, and it says nothing about the document.' then 'old'
           when prompt = 'When the date passed as today cannot be read, the register refuses while the library answers Review scheduled for a published document whose review date is 2020-01-06. Why the two behaviours?' and options = '["The library reads its own clock instead.", "Review scheduled is the library''s refusal.", "Old review dates are exempt from the check.", "Only deriveStatus refuses an unreadable today, which is AS15 Q1."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The register''s refusal is the RangeError deriveStatus throws. The library''s Review scheduled is an answer given as though nothing were due, a held limit of the course, and it says nothing about the document.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for beginner final ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: beginner final ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'When the date passed as today cannot be read, the register refuses while the library answers Review scheduled for a published document whose review date is 2020-01-06. Why the two behaviours?', options = '["The library reads its own clock instead.", "Review scheduled is the library''s refusal.", "Old review dates are exempt from the check.", "Only deriveStatus refuses an unreadable today, which is AS15 Q1."]'::jsonb, explanation = 'The register''s refusal is the RangeError deriveStatus throws. The library''s Review scheduled is an answer given as though nothing were due, a held limit of the course, and it says nothing about the document.'
     where app_slug = 'compliance' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: beginner final ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 10
  select case
           when prompt = 'The flare return''s lead time field holds an empty string. What does the return read?' and options = '["Due soon, the same as with no lead time set at all.", "On track, an empty field opens no window.", "On track, as with its recorded 14.", "Overdue, an empty field reads as zero."]'::jsonb and answer_index = 0 and explanation is not distinct from 'An empty string is not a usable lead time, so the engine applies DEFAULT_LEAD_TIME_DAYS. The digest prints '''' (empty) as Due soon, beside null, -5, ''ten'' and a field left out.' then 'old'
           when prompt = 'The flare return''s lead time field holds an empty string. What does the return read?' and options = '["Due soon, the same as with no lead time set at all.", "On track, an empty field opens no window.", "On track, as with its recorded 14.", "Overdue, an empty field reads as zero."]'::jsonb and answer_index = 0 and explanation is not distinct from 'An empty string is not a usable lead time, so the engine applies DEFAULT_LEAD_TIME_DAYS. The course prints '''' (empty) as Due soon, beside null, -5, ''ten'' and a field left out.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for beginner final ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: beginner final ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The flare return''s lead time field holds an empty string. What does the return read?', options = '["Due soon, the same as with no lead time set at all.", "On track, an empty field opens no window.", "On track, as with its recorded 14.", "Overdue, an empty field reads as zero."]'::jsonb, explanation = 'An empty string is not a usable lead time, so the engine applies DEFAULT_LEAD_TIME_DAYS. The course prints '''' (empty) as Due soon, beside null, -5, ''ten'' and a field left out.'
     where app_slug = 'compliance' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: beginner final ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 17
  select case
           when prompt = 'Which next due date, and which day count, does the digest print for the Biennial roll from 2026-08-31?' and options = '["2028-08-31, 320 days ahead.", "2027-08-31, 686 days ahead.", "2028-08-31, 686 days ahead.", "2028-02-29, 686 days ahead."]'::jsonb and answer_index = 2 and explanation is not distinct from 'Biennial steps two years and August keeps its thirty-first. 2027-08-31 at 320 days is the Annual roll.' then 'old'
           when prompt = 'Which next due date, and which day count, does the course print for the Biennial roll from 2026-08-31?' and options = '["2028-08-31, 320 days ahead.", "2027-08-31, 686 days ahead.", "2028-08-31, 686 days ahead.", "2028-02-29, 686 days ahead."]'::jsonb and answer_index = 2 and explanation is not distinct from 'Biennial steps two years and August keeps its thirty-first. 2027-08-31 at 320 days is the Annual roll.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 17;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for beginner final ord 17'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: beginner final ord 17 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which next due date, and which day count, does the course print for the Biennial roll from 2026-08-31?', options = '["2028-08-31, 320 days ahead.", "2027-08-31, 686 days ahead.", "2028-08-31, 686 days ahead.", "2028-02-29, 686 days ahead."]'::jsonb, explanation = 'Biennial steps two years and August keeps its thirty-first. 2027-08-31 at 320 days is the Annual roll.'
     where app_slug = 'compliance' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 17;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: beginner final ord 17 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 19
  select case
           when prompt = 'A semi-annual schedule is rolled from 2026-08-31 to 2027-02-28. Where does the following semi-annual roll land?' and options = '["2027-08-31", "2027-02-28", "2028-08-31", "2027-08-28"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The digest prints 2026-08-31, 2027-02-28 and then 2027-08-28 for Semi-annual. The second step starts from the twenty-eighth it landed on in February. 2027-08-31 is the Annual roll from 2026-08-31, 2028-08-31 the Biennial one, and 2027-02-28 is the first step itself.' then 'old'
           when prompt = 'A semi-annual schedule is rolled from 2026-08-31 to 2027-02-28. Where does the following semi-annual roll land?' and options = '["2027-08-31", "2027-02-28", "2028-08-31", "2027-08-28"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course prints 2026-08-31, 2027-02-28 and then 2027-08-28 for Semi-annual. The second step starts from the twenty-eighth it landed on in February. 2027-08-31 is the Annual roll from 2026-08-31, 2028-08-31 the Biennial one, and 2027-02-28 is the first step itself.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 19;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for beginner final ord 19'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: beginner final ord 19 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A semi-annual schedule is rolled from 2026-08-31 to 2027-02-28. Where does the following semi-annual roll land?', options = '["2027-08-31", "2027-02-28", "2028-08-31", "2027-08-28"]'::jsonb, explanation = 'The course prints 2026-08-31, 2027-02-28 and then 2027-08-28 for Semi-annual. The second step starts from the twenty-eighth it landed on in February. 2027-08-31 is the Annual roll from 2026-08-31, 2028-08-31 the Biennial one, and 2027-02-28 is the first step itself.'
     where app_slug = 'compliance' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 19;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: beginner final ord 19 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 20
  select case
           when prompt = 'A department ''Operations'' files a ''Plan''. Which document number prefix comes back?' and options = '["OPS-PLA", "OPE-PLA", "OP-PL", "GEN-DOC"]'::jsonb and answer_index = 1 and explanation is not distinct from 'documentPrefix takes the first three letters of each. OPS-PLA-0002 is a number as it stands in the library, and the digest does not say how it was issued. GEN-DOC is what an empty department and category give.' then 'old'
           when prompt = 'A department ''Operations'' files a ''Plan''. Which document number prefix comes back?' and options = '["OPS-PLA", "OPE-PLA", "OP-PL", "GEN-DOC"]'::jsonb and answer_index = 1 and explanation is not distinct from 'documentPrefix takes the first three letters of each. OPS-PLA-0002 is a number as it stands in the library, and the course does not say how it was issued. GEN-DOC is what an empty department and category give.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 20;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for beginner final ord 20'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: beginner final ord 20 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A department ''Operations'' files a ''Plan''. Which document number prefix comes back?', options = '["OPS-PLA", "OPE-PLA", "OP-PL", "GEN-DOC"]'::jsonb, explanation = 'documentPrefix takes the first three letters of each. OPS-PLA-0002 is a number as it stands in the library, and the course does not say how it was issued. GEN-DOC is what an empty department and category give.'
     where app_slug = 'compliance' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 20;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: beginner final ord 20 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 21
  select case
           when prompt = 'atLeastConfidential is read against the default floor Confidential. What does it answer for Internal and for Restricted?' and options = '["true for both, because each is a restricted class.", "true for Internal only.", "false for Internal and true for Restricted.", "false for both, because only Confidential meets the floor."]'::jsonb and answer_index = 2 and explanation is not distinct from 'atLeastConfidential answers true at the floor or above it. The digest prints Public false, Internal false, Confidential true and Restricted true.' then 'old'
           when prompt = 'atLeastConfidential is read against the default floor Confidential. What does it answer for Internal and for Restricted?' and options = '["true for both, because each is a restricted class.", "true for Internal only.", "false for Internal and true for Restricted.", "false for both, because only Confidential meets the floor."]'::jsonb and answer_index = 2 and explanation is not distinct from 'atLeastConfidential answers true at the floor or above it. The course prints Public false, Internal false, Confidential true and Restricted true.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 21;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for beginner final ord 21'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: beginner final ord 21 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'atLeastConfidential is read against the default floor Confidential. What does it answer for Internal and for Restricted?', options = '["true for both, because each is a restricted class.", "true for Internal only.", "false for Internal and true for Restricted.", "false for both, because only Confidential meets the floor."]'::jsonb, explanation = 'atLeastConfidential answers true at the floor or above it. The course prints Public false, Internal false, Confidential true and Restricted true.'
     where app_slug = 'compliance' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 21;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: beginner final ord 21 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 29
  select case
           when prompt = 'HSE-PRO-0007 was issued 2024-09-30 on a 24 month period. Its recorded next review is 2026-09-30. What does the digest''s recomputation show?' and options = '["The recomputed date disagrees and the record has to be corrected.", "Nothing, an overdue document is left out.", "The recomputed date agrees with the one on record: true.", "The recomputed date agrees only once the default period is applied."]'::jsonb and answer_index = 2 and explanation is not distinct from 'nextReviewDate from 2024-09-30 on 24 months gives 2026-09-30, and the digest prints true for the two agreeing. OPS-PLA-0002 and ENG-STD-0011 agree as well.' then 'old'
           when prompt = 'HSE-PRO-0007 was issued 2024-09-30 on a 24 month period. Its recorded next review is 2026-09-30. What does the course''s recomputation show?' and options = '["The recomputed date disagrees and the record has to be corrected.", "Nothing, an overdue document is left out.", "The recomputed date agrees with the one on record: true.", "The recomputed date agrees only once the default period is applied."]'::jsonb and answer_index = 2 and explanation is not distinct from 'nextReviewDate from 2024-09-30 on 24 months gives 2026-09-30, and the course prints true for the two agreeing. OPS-PLA-0002 and ENG-STD-0011 agree as well.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 29;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for beginner final ord 29'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: beginner final ord 29 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'HSE-PRO-0007 was issued 2024-09-30 on a 24 month period. Its recorded next review is 2026-09-30. What does the course''s recomputation show?', options = '["The recomputed date disagrees and the record has to be corrected.", "Nothing, an overdue document is left out.", "The recomputed date agrees with the one on record: true.", "The recomputed date agrees only once the default period is applied."]'::jsonb, explanation = 'nextReviewDate from 2024-09-30 on 24 months gives 2026-09-30, and the course prints true for the two agreeing. OPS-PLA-0002 and ENG-STD-0011 agree as well.'
     where app_slug = 'compliance' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 29;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: beginner final ord 29 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 30
  select case
           when prompt = 'Why can nextReviewDate give OPS-PHI-0001, the flare management philosophy, no review date?' and options = '["Its review period is 0.", "It is not in force.", "Philosophies are exempt from review.", "It has no issue date on the record to count from."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The digest names four documents with no issue date recorded: OPS-PHI-0001, OPS-PRO-0004, HSE-PRO-0012 and ENG-PRO-0019. OPS-PHI-0001 is Published and in force, and reads No review scheduled.' then 'old'
           when prompt = 'Why can nextReviewDate give OPS-PHI-0001, the flare management philosophy, no review date?' and options = '["Its review period is 0.", "It is not in force.", "Philosophies are exempt from review.", "It has no issue date on the record to count from."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course names four documents with no issue date recorded: OPS-PHI-0001, OPS-PRO-0004, HSE-PRO-0012 and ENG-PRO-0019. OPS-PHI-0001 is Published and in force, and reads No review scheduled.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 30;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for beginner final ord 30'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: beginner final ord 30 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Why can nextReviewDate give OPS-PHI-0001, the flare management philosophy, no review date?', options = '["Its review period is 0.", "It is not in force.", "Philosophies are exempt from review.", "It has no issue date on the record to count from."]'::jsonb, explanation = 'The course names four documents with no issue date recorded: OPS-PHI-0001, OPS-PRO-0004, HSE-PRO-0012 and ENG-PRO-0019. OPS-PHI-0001 is Published and in force, and reads No review scheduled.'
     where app_slug = 'compliance' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 30;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: beginner final ord 30 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 37
  select case
           when prompt = 'Why does every status and day count in this tier carry the as-of date 2026-10-15 beside it?' and options = '["It is the date the IKORO records were last edited by hand.", "Each is derived against that date and is true at no other.", "It is the date the regulator fixed for every return in the register.", "It is the date the machine clock read when the digest was built, which the engine records."]'::jsonb and answer_index = 1 and explanation is not distinct from 'Move the as-of date and the same record reads differently with nobody having edited it. The digest never read the machine clock.' then 'old'
           when prompt = 'Why does every status and day count in this tier carry the as-of date 2026-10-15 beside it?' and options = '["It is the date the IKORO records were last edited by hand.", "Each is derived against that date and is true at no other.", "It is the date the regulator fixed for every return in the register.", "It is the date the machine clock read when the course was built, which the engine records."]'::jsonb and answer_index = 1 and explanation is not distinct from 'Move the as-of date and the same record reads differently with nobody having edited it. The course never read the machine clock.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 37;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for beginner final ord 37'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: beginner final ord 37 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Why does every status and day count in this tier carry the as-of date 2026-10-15 beside it?', options = '["It is the date the IKORO records were last edited by hand.", "Each is derived against that date and is true at no other.", "It is the date the regulator fixed for every return in the register.", "It is the date the machine clock read when the course was built, which the engine records."]'::jsonb, explanation = 'Move the as-of date and the same record reads differently with nobody having edited it. The course never read the machine clock.'
     where app_slug = 'compliance' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 37;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: beginner final ord 37 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 38
  select case
           when prompt = 'The monthly water quality return is filed late and rolled on. Of the summarise counts, which one loses it?' and options = '["Due soon", "Compliant", "Overdue", "Expired"]'::jsonb and answer_index = 2 and explanation is not distinct from 'As recorded it reads Overdue. After the filing and the roll the digest prints status Due soon, so it leaves Overdue and joins Due soon, which is still an attention status.' then 'old'
           when prompt = 'The monthly water quality return is filed late and rolled on. Of the summarise counts, which one loses it?' and options = '["Due soon", "Compliant", "Overdue", "Expired"]'::jsonb and answer_index = 2 and explanation is not distinct from 'As recorded it reads Overdue. After the filing and the roll the course prints status Due soon, so it leaves Overdue and joins Due soon, which is still an attention status.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 38;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for beginner final ord 38'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: beginner final ord 38 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The monthly water quality return is filed late and rolled on. Of the summarise counts, which one loses it?', options = '["Due soon", "Compliant", "Overdue", "Expired"]'::jsonb, explanation = 'As recorded it reads Overdue. After the filing and the roll the course prints status Due soon, so it leaves Overdue and joins Due soon, which is still an attention status.'
     where app_slug = 'compliance' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 38;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: beginner final ord 38 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m01-what-the-register-derives ord 1
  select case
           when prompt = 'The digest counts, for each module, the exports that read a date against today. Which module has the most of them?' and options = '["qualityAssurance, with 7.", "documentControl, which exports 14 functions.", "isoCompliance, with 10 of them.", "complianceStatus, with 4."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The export table prints 10 for isoCompliance, 7 for qualityAssurance and 4 each for complianceStatus, documentControl and auditManagement. The 14 is documentControl''s count of exported functions, which is a different column.' then 'old'
           when prompt = 'The course counts, for each module, the exports that read a date against today. Which module has the most of them?' and options = '["qualityAssurance, with 7.", "documentControl, which exports 14 functions.", "isoCompliance, with 10 of them.", "complianceStatus, with 4."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The export table prints 10 for isoCompliance, 7 for qualityAssurance and 4 each for complianceStatus, documentControl and auditManagement. The 14 is documentControl''s count of exported functions, which is a different column.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-the-register-derives' and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for beginner m01-what-the-register-derives ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: beginner m01-what-the-register-derives ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course counts, for each module, the exports that read a date against today. Which module has the most of them?', options = '["qualityAssurance, with 7.", "documentControl, which exports 14 functions.", "isoCompliance, with 10 of them.", "complianceStatus, with 4."]'::jsonb, explanation = 'The export table prints 10 for isoCompliance, 7 for qualityAssurance and 4 each for complianceStatus, documentControl and auditManagement. The 14 is documentControl''s count of exported functions, which is a different column.'
     where app_slug = 'compliance' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-the-register-derives' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: beginner m01-what-the-register-derives ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m01-what-the-register-derives ord 2
  select case
           when prompt = 'Every figure in the digest is stated as true at 2026-10-15. What makes that statement safe to make?' and options = '["Every call that reads a date against today is passed that one date, and no line comes from a call that read the machine clock.", "The digest was generated on 2026-10-15, so the machine clock and the as-of date agreed on the day it ran.", "Each module stores the date it was last run with, and reads it back on the next call.", "The records themselves carry 2026-10-15 as a field, which the engine copies into each status."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The as-of date is an argument. The generator refuses to print a line from a call that did not pass it, so the same inputs give the same answers on any machine on any day.' then 'old'
           when prompt = 'Every figure in the course is stated as true at 2026-10-15. What makes that statement safe to make?' and options = '["Every call that reads a date against today is passed that one date, and no line comes from a call that read the machine clock.", "The course was produced on 2026-10-15, so the machine clock and the as-of date agreed on the day it ran.", "Each module stores the date it was last run with, and reads it back on the next call.", "The records themselves carry 2026-10-15 as a field, which the engine copies into each status."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The as-of date is an argument. The course refuses to print a line from a call that did not pass it, so the same inputs give the same answers on any machine on any day.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-the-register-derives' and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for beginner m01-what-the-register-derives ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: beginner m01-what-the-register-derives ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Every figure in the course is stated as true at 2026-10-15. What makes that statement safe to make?', options = '["Every call that reads a date against today is passed that one date, and no line comes from a call that read the machine clock.", "The course was produced on 2026-10-15, so the machine clock and the as-of date agreed on the day it ran.", "Each module stores the date it was last run with, and reads it back on the next call.", "The records themselves carry 2026-10-15 as a field, which the engine copies into each status."]'::jsonb, explanation = 'The as-of date is an argument. The course refuses to print a line from a call that did not pass it, so the same inputs give the same answers on any machine on any day.'
     where app_slug = 'compliance' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-the-register-derives' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: beginner m01-what-the-register-derives ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m01-what-the-register-derives ord 10
  select case
           when prompt = 'documentControl.reviewState is asked about a published document whose review date is 2020-01-06, with an unreadable Date as today. It returns Review scheduled. What does that answer say about the document?' and options = '["Nothing that can be trusted, because an unreadable today is refused by complianceStatus alone.", "That the review has been booked for a date the engine chose in place of the unreadable one.", "That the document is in force and its review date of 2020-01-06 lies ahead.", "That the document has been reviewed, because a passed review date with no today is read as done."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The digest records this as a held limit. reviewState answers as though nothing were due, and the course teaches it as a limit and never as a figure.' then 'old'
           when prompt = 'documentControl.reviewState is asked about a published document whose review date is 2020-01-06, with an unreadable Date as today. It returns Review scheduled. What does that answer say about the document?' and options = '["Nothing that can be trusted, because an unreadable today is refused by complianceStatus alone.", "That the review has been booked for a date the engine chose in place of the unreadable one.", "That the document is in force and its review date of 2020-01-06 lies ahead.", "That the document has been reviewed, because a passed review date with no today is read as done."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course records this as a held limit. reviewState answers as though nothing were due, and the course teaches it as a limit and never as a figure.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-the-register-derives' and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for beginner m01-what-the-register-derives ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: beginner m01-what-the-register-derives ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'documentControl.reviewState is asked about a published document whose review date is 2020-01-06, with an unreadable Date as today. It returns Review scheduled. What does that answer say about the document?', options = '["Nothing that can be trusted, because an unreadable today is refused by complianceStatus alone.", "That the review has been booked for a date the engine chose in place of the unreadable one.", "That the document is in force and its review date of 2020-01-06 lies ahead.", "That the document has been reviewed, because a passed review date with no today is read as done."]'::jsonb, explanation = 'The course records this as a held limit. reviewState answers as though nothing were due, and the course teaches it as a limit and never as a figure.'
     where app_slug = 'compliance' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-the-register-derives' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: beginner m01-what-the-register-derives ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m01-what-the-register-derives ord 11
  select case
           when prompt = 'An open NCR was due 2020-01-06. qualityAssurance.isNcrOverdue is handed a today it cannot read. What is its answer?' and options = '["true, because 2020-01-06 is before any date the NCR could be read against.", "It throws a RangeError, as deriveStatus does.", "false", "null, the value the calendar gives for an unreadable date."]'::jsonb and answer_index = 2 and explanation is not distinct from 'false says the NCR is not overdue, which no reader can rely on here. deriveStatus is the one export that throws; this answer is recorded in SECTION 2 as a limit.' then 'old'
           when prompt = 'An open NCR was due 2020-01-06. qualityAssurance.isNcrOverdue is handed a today it cannot read. What is its answer?' and options = '["true, because 2020-01-06 is before any date the NCR could be read against.", "It throws a RangeError, as deriveStatus does.", "false", "null, the value the calendar gives for an unreadable date."]'::jsonb and answer_index = 2 and explanation is not distinct from 'false says the NCR is not overdue, which no reader can rely on here. deriveStatus is the one export that throws; this answer is recorded in the course as a limit.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-the-register-derives' and ord = 11;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for beginner m01-what-the-register-derives ord 11'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: beginner m01-what-the-register-derives ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'An open NCR was due 2020-01-06. qualityAssurance.isNcrOverdue is handed a today it cannot read. What is its answer?', options = '["true, because 2020-01-06 is before any date the NCR could be read against.", "It throws a RangeError, as deriveStatus does.", "false", "null, the value the calendar gives for an unreadable date."]'::jsonb, explanation = 'false says the NCR is not overdue, which no reader can rely on here. deriveStatus is the one export that throws; this answer is recorded in the course as a limit.'
     where app_slug = 'compliance' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-the-register-derives' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: beginner m01-what-the-register-derives ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m01-what-the-register-derives ord 13
  select case
           when prompt = 'What does owner decision AS15 Q1 state?' and options = '["An unreadable today makes every module answer as though nothing were due.", "An unreadable today makes deriveStatus throw.", "A today passed as a string is read at local midnight.", "An unreadable record date reads as today."]'::jsonb and answer_index = 1 and explanation is not distinct from 'Q1 is the refusal the digest prints for deriveStatus: RangeError: deriveStatus needs a valid date for today. The two other modules answering as though nothing were due is a held limit, and a string today makes reviewState throw a TypeError.' then 'old'
           when prompt = 'What does owner decision AS15 Q1 state?' and options = '["An unreadable today makes every module answer as though nothing were due.", "An unreadable today makes deriveStatus throw.", "A today passed as a string is read at local midnight.", "An unreadable record date reads as today."]'::jsonb and answer_index = 1 and explanation is not distinct from 'Q1 is the refusal the course prints for deriveStatus: RangeError: deriveStatus needs a valid date for today. The two other modules answering as though nothing were due is a held limit, and a string today makes reviewState throw a TypeError.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-the-register-derives' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for beginner m01-what-the-register-derives ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: beginner m01-what-the-register-derives ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does owner decision AS15 Q1 state?', options = '["An unreadable today makes every module answer as though nothing were due.", "An unreadable today makes deriveStatus throw.", "A today passed as a string is read at local midnight.", "An unreadable record date reads as today."]'::jsonb, explanation = 'Q1 is the refusal the course prints for deriveStatus: RangeError: deriveStatus needs a valid date for today. The two other modules answering as though nothing were due is a held limit, and a string today makes reviewState throw a TypeError.'
     where app_slug = 'compliance' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-the-register-derives' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: beginner m01-what-the-register-derives ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m01-what-the-register-derives ord 14
  select case
           when prompt = 'The panel lets you move the as-of date. When you move it, statuses change. What was edited on the records in between?' and options = '["Each record''s status field, rewritten by the panel.", "Each record''s due date, shifted by the panel.", "Nothing. The same records read against another date give other statuses.", "The lead time on each record, shortened by the panel."]'::jsonb and answer_index = 2 and explanation is not distinct from 'That is what derived means in this course. A status is never typed, so moving the date back to 2026-10-15 makes every row match the digest again.' then 'old'
           when prompt = 'The panel lets you move the as-of date. When you move it, statuses change. What was edited on the records in between?' and options = '["Each record''s status field, rewritten by the panel.", "Each record''s due date, shifted by the panel.", "Nothing. The same records read against another date give other statuses.", "The lead time on each record, shortened by the panel."]'::jsonb and answer_index = 2 and explanation is not distinct from 'That is what derived means in this course. A status is never typed, so moving the date back to 2026-10-15 makes every row match the course tables again.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-the-register-derives' and ord = 14;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for beginner m01-what-the-register-derives ord 14'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: beginner m01-what-the-register-derives ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The panel lets you move the as-of date. When you move it, statuses change. What was edited on the records in between?', options = '["Each record''s status field, rewritten by the panel.", "Each record''s due date, shifted by the panel.", "Nothing. The same records read against another date give other statuses.", "The lead time on each record, shortened by the panel."]'::jsonb, explanation = 'That is what derived means in this course. A status is never typed, so moving the date back to 2026-10-15 makes every row match the course tables again.'
     where app_slug = 'compliance' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-the-register-derives' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: beginner m01-what-the-register-derives ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m01-what-the-register-derives ord 15
  select case
           when prompt = 'The digest''s header says in what form it prints every figure. Which form is that?' and options = '["Whole numbers: day counts, counts, and percents the engine has already rounded.", "Days and fractions of a day, so a late evening time reads short of the plain date.", "Working days, so a weekend that falls between two dates is left out of a count.", "Whole weeks, with each day count rounded to the nearest week before it prints."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The header reads: every figure is a whole number, days from daysUntil and ages, counts, and percents the engine has already rounded. 2026-11-30 reads 46 and 2027-02-28 reads 136, and the lessons quote those figures as printed.' then 'old'
           when prompt = 'The course says in what form it prints every figure. Which form is that?' and options = '["Whole numbers: day counts, counts, and percents the engine has already rounded.", "Days and fractions of a day, so a late evening time reads short of the plain date.", "Working days, so a weekend that falls between two dates is left out of a count.", "Whole weeks, with each day count rounded to the nearest week before it prints."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course states it: every figure is a whole number, days from daysUntil and ages, counts, and percents the engine has already rounded. 2026-11-30 reads 46 and 2027-02-28 reads 136, and the lessons quote those figures as printed.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-the-register-derives' and ord = 15;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for beginner m01-what-the-register-derives ord 15'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: beginner m01-what-the-register-derives ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course says in what form it prints every figure. Which form is that?', options = '["Whole numbers: day counts, counts, and percents the engine has already rounded.", "Days and fractions of a day, so a late evening time reads short of the plain date.", "Working days, so a weekend that falls between two dates is left out of a count.", "Whole weeks, with each day count rounded to the nearest week before it prints."]'::jsonb, explanation = 'The course states it: every figure is a whole number, days from daysUntil and ages, counts, and percents the engine has already rounded. 2026-11-30 reads 46 and 2027-02-28 reads 136, and the lessons quote those figures as printed.'
     where app_slug = 'compliance' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-the-register-derives' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: beginner m01-what-the-register-derives ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m02-an-obligations-status ord 2
  select case
           when prompt = 'The digest varies REG-2026-005 one field at a time. Which single variant makes the licence read Overdue?' and options = '["The expiry removed.", "The expiry moved out to 2027-09-30.", "The lifecycle set to Archived, a word the lifecycle list does not have.", "The due date moved to 2026-10-01 with no expiry."]'::jsonb and answer_index = 3 and explanation is not distinct from 'That variant reads Overdue at -14. Removing the expiry or moving it out leaves the licence On track, and Archived leaves it Expired at -15. A passed due date gives Overdue; a passed expiry gives Expired.' then 'old'
           when prompt = 'The course varies REG-2026-005 one field at a time. Which single variant makes the licence read Overdue?' and options = '["The expiry removed.", "The expiry moved out to 2027-09-30.", "The lifecycle set to Archived, a word the lifecycle list does not have.", "The due date moved to 2026-10-01 with no expiry."]'::jsonb and answer_index = 3 and explanation is not distinct from 'That variant reads Overdue at -14. Removing the expiry or moving it out leaves the licence On track, and Archived leaves it Expired at -15. A passed due date gives Overdue; a passed expiry gives Expired.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-an-obligations-status' and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for beginner m02-an-obligations-status ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: beginner m02-an-obligations-status ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course varies REG-2026-005 one field at a time. Which single variant makes the licence read Overdue?', options = '["The expiry removed.", "The expiry moved out to 2027-09-30.", "The lifecycle set to Archived, a word the lifecycle list does not have.", "The due date moved to 2026-10-01 with no expiry."]'::jsonb, explanation = 'That variant reads Overdue at -14. Removing the expiry or moving it out leaves the licence On track, and Archived leaves it Expired at -15. A passed due date gives Overdue; a passed expiry gives Expired.'
     where app_slug = 'compliance' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-an-obligations-status' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: beginner m02-an-obligations-status ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m02-an-obligations-status ord 14
  select case
           when prompt = 'The digest''s variant sets REG-2026-005''s lifecycle to Superseded. Of these summarise counts, which one would lose the licence?' and options = '["Overdue", "Expired", "No date set", "Not applicable"]'::jsonb and answer_index = 1 and explanation is not distinct from 'As recorded the licence is the one Expired row. With the lifecycle Superseded it reads Superseded, so it leaves the Expired count and joins the Superseded one.' then 'old'
           when prompt = 'The course''s variant sets REG-2026-005''s lifecycle to Superseded. Of these summarise counts, which one would lose the licence?' and options = '["Overdue", "Expired", "No date set", "Not applicable"]'::jsonb and answer_index = 1 and explanation is not distinct from 'As recorded the licence is the one Expired row. With the lifecycle Superseded it reads Superseded, so it leaves the Expired count and joins the Superseded one.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-an-obligations-status' and ord = 14;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for beginner m02-an-obligations-status ord 14'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: beginner m02-an-obligations-status ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course''s variant sets REG-2026-005''s lifecycle to Superseded. Of these summarise counts, which one would lose the licence?', options = '["Overdue", "Expired", "No date set", "Not applicable"]'::jsonb, explanation = 'As recorded the licence is the one Expired row. With the lifecycle Superseded it reads Superseded, so it leaves the Expired count and joins the Superseded one.'
     where app_slug = 'compliance' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-an-obligations-status' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: beginner m02-an-obligations-status ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m03-lead-time-and-the-current-period ord 1
  select case
           when prompt = 'REG-2026-003, the quarterly flare and venting return, is due 2026-10-31, 16 days after the as-of date. Its recorded lead time is 14. Given a lead time of 17 and nothing else changed, what does it read?' and options = '["On track, because the due date and the as-of date have not moved.", "Overdue, because the window now reaches back past the as-of date.", "Due soon", "On track, because the recorded lead time of 14 wins over a new one."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The digest prints 17 as Due soon. Only the lead time changed, and that alone turned On track into Due soon: the window now reaches the 16 days that remain.' then 'old'
           when prompt = 'REG-2026-003, the quarterly flare and venting return, is due 2026-10-31, 16 days after the as-of date. Its recorded lead time is 14. Given a lead time of 17 and nothing else changed, what does it read?' and options = '["On track, because the due date and the as-of date have not moved.", "Overdue, because the window now reaches back past the as-of date.", "Due soon", "On track, because the recorded lead time of 14 wins over a new one."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course prints 17 as Due soon. Only the lead time changed, and that alone turned On track into Due soon: the window now reaches the 16 days that remain.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-lead-time-and-the-current-period' and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for beginner m03-lead-time-and-the-current-period ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: beginner m03-lead-time-and-the-current-period ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'REG-2026-003, the quarterly flare and venting return, is due 2026-10-31, 16 days after the as-of date. Its recorded lead time is 14. Given a lead time of 17 and nothing else changed, what does it read?', options = '["On track, because the due date and the as-of date have not moved.", "Overdue, because the window now reaches back past the as-of date.", "Due soon", "On track, because the recorded lead time of 14 wins over a new one."]'::jsonb, explanation = 'The course prints 17 as Due soon. Only the lead time changed, and that alone turned On track into Due soon: the window now reaches the 16 days that remain.'
     where app_slug = 'compliance' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-lead-time-and-the-current-period' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: beginner m03-lead-time-and-the-current-period ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m03-lead-time-and-the-current-period ord 2
  select case
           when prompt = 'In the digest''s lead time table for REG-2026-003, what is the largest lead time that still leaves the return On track?' and options = '["15", "14", "16", "0"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The rows print 14 On track, 15 On track and 16 Due soon. 14 is the lead time on the record, which is not the largest in the table that leaves it On track.' then 'old'
           when prompt = 'In the course''s lead time table for REG-2026-003, what is the largest lead time that still leaves the return On track?' and options = '["15", "14", "16", "0"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The rows print 14 On track, 15 On track and 16 Due soon. 14 is the lead time on the record, which is not the largest in the table that leaves it On track.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-lead-time-and-the-current-period' and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for beginner m03-lead-time-and-the-current-period ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: beginner m03-lead-time-and-the-current-period ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'In the course''s lead time table for REG-2026-003, what is the largest lead time that still leaves the return On track?', options = '["15", "14", "16", "0"]'::jsonb, explanation = 'The rows print 14 On track, 15 On track and 16 Due soon. 14 is the lead time on the record, which is not the largest in the table that leaves it On track.'
     where app_slug = 'compliance' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-lead-time-and-the-current-period' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: beginner m03-lead-time-and-the-current-period ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m03-lead-time-and-the-current-period ord 3
  select case
           when prompt = 'REG-2026-003 has 16 days to its due date. With a lead time of 16, the same number, what does it read, and what does that say about the edge of the window?' and options = '["On track, so the edge sits outside the window.", "On track, because the window opens on the day after the lead time is reached.", "Due soon only on the as-of date itself.", "Due soon, so the edge belongs inside the window."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The digest prints 15 On track and 16 Due soon. A lead time equal to the 16 days that remain puts the return inside its window, and the row reads Due soon.' then 'old'
           when prompt = 'REG-2026-003 has 16 days to its due date. With a lead time of 16, the same number, what does it read, and what does that say about the edge of the window?' and options = '["On track, so the edge sits outside the window.", "On track, because the window opens on the day after the lead time is reached.", "Due soon only on the as-of date itself.", "Due soon, so the edge belongs inside the window."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course prints 15 On track and 16 Due soon. A lead time equal to the 16 days that remain puts the return inside its window, and the row reads Due soon.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-lead-time-and-the-current-period' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for beginner m03-lead-time-and-the-current-period ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: beginner m03-lead-time-and-the-current-period ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'REG-2026-003 has 16 days to its due date. With a lead time of 16, the same number, what does it read, and what does that say about the edge of the window?', options = '["On track, so the edge sits outside the window.", "On track, because the window opens on the day after the lead time is reached.", "Due soon only on the as-of date itself.", "Due soon, so the edge belongs inside the window."]'::jsonb, explanation = 'The course prints 15 On track and 16 Due soon. A lead time equal to the 16 days that remain puts the return inside its window, and the row reads Due soon.'
     where app_slug = 'compliance' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-lead-time-and-the-current-period' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: beginner m03-lead-time-and-the-current-period ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m03-lead-time-and-the-current-period ord 6
  select case
           when prompt = 'A negative lead time, -5, is typed on the flare return''s record. Which status follows?' and options = '["Due soon, because a negative lead time is not a usable one and the default applies.", "On track, because a negative window opens after the due date and is not open yet.", "Overdue, because a negative lead time reads the due date as five days passed.", "On track, the status it carries with a lead time of 0."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The digest prints -5 as Due soon. With no usable lead time the engine uses DEFAULT_LEAD_TIME_DAYS, and a negative number is not usable.' then 'old'
           when prompt = 'A negative lead time, -5, is typed on the flare return''s record. Which status follows?' and options = '["Due soon, because a negative lead time is not a usable one and the default applies.", "On track, because a negative window opens after the due date and is not open yet.", "Overdue, because a negative lead time reads the due date as five days passed.", "On track, the status it carries with a lead time of 0."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course prints -5 as Due soon. With no usable lead time the engine uses DEFAULT_LEAD_TIME_DAYS, and a negative number is not usable.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-lead-time-and-the-current-period' and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for beginner m03-lead-time-and-the-current-period ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: beginner m03-lead-time-and-the-current-period ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A negative lead time, -5, is typed on the flare return''s record. Which status follows?', options = '["Due soon, because a negative lead time is not a usable one and the default applies.", "On track, because a negative window opens after the due date and is not open yet.", "Overdue, because a negative lead time reads the due date as five days passed.", "On track, the status it carries with a lead time of 0."]'::jsonb, explanation = 'The course prints -5 as Due soon. With no usable lead time the engine uses DEFAULT_LEAD_TIME_DAYS, and a negative number is not usable.'
     where app_slug = 'compliance' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-lead-time-and-the-current-period' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: beginner m03-lead-time-and-the-current-period ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m03-lead-time-and-the-current-period ord 11
  select case
           when prompt = 'REG-2026-004, the annual monitoring report, is due 2027-03-31 and its period starts 2026-03-31. Its last filing is dated 2026-03-30. What is its status, and what would one day later on the filing make it?' and options = '["On track as recorded, and Compliant with the filing dated 2026-03-31.", "Compliant as recorded, because a filing at the end of March covers a report due at the end of March.", "On track either way, because the filing date is not what decides the status here.", "Overdue as recorded, and On track with the filing dated 2026-03-31."]'::jsonb and answer_index = 0 and explanation is not distinct from 'Dated 2026-03-30 the filing belongs to the earlier period. Dated 2026-03-31, the first day of the period, it counts, and the digest prints status Compliant. The first day of the period is inside the period.' then 'old'
           when prompt = 'REG-2026-004, the annual monitoring report, is due 2027-03-31 and its period starts 2026-03-31. Its last filing is dated 2026-03-30. What is its status, and what would one day later on the filing make it?' and options = '["On track as recorded, and Compliant with the filing dated 2026-03-31.", "Compliant as recorded, because a filing at the end of March covers a report due at the end of March.", "On track either way, because the filing date is not what decides the status here.", "Overdue as recorded, and On track with the filing dated 2026-03-31."]'::jsonb and answer_index = 0 and explanation is not distinct from 'Dated 2026-03-30 the filing belongs to the earlier period. Dated 2026-03-31, the first day of the period, it counts, and the course prints status Compliant. The first day of the period is inside the period.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-lead-time-and-the-current-period' and ord = 11;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for beginner m03-lead-time-and-the-current-period ord 11'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: beginner m03-lead-time-and-the-current-period ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'REG-2026-004, the annual monitoring report, is due 2027-03-31 and its period starts 2026-03-31. Its last filing is dated 2026-03-30. What is its status, and what would one day later on the filing make it?', options = '["On track as recorded, and Compliant with the filing dated 2026-03-31.", "Compliant as recorded, because a filing at the end of March covers a report due at the end of March.", "On track either way, because the filing date is not what decides the status here.", "Overdue as recorded, and On track with the filing dated 2026-03-31."]'::jsonb, explanation = 'Dated 2026-03-30 the filing belongs to the earlier period. Dated 2026-03-31, the first day of the period, it counts, and the course prints status Compliant. The first day of the period is inside the period.'
     where app_slug = 'compliance' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-lead-time-and-the-current-period' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: beginner m03-lead-time-and-the-current-period ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m04-rolling-the-schedule-forward ord 2
  select case
           when prompt = 'Why does the app roll a monthly return forward from the date that was due and never from the filing date?' and options = '["A roll from the filing would land on a month end the calendar has to pull back, and the pull is avoided.", "The filing date is not stored on the record.", "Rolling from the filing warns too soon.", "The next due date then follows the old one, whatever day the filing came in."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The digest prints rollForward(2026-10-10, Monthly) = 2026-11-10. The same call on the filing date would give 2026-11-14, so a roll from the filing would move the schedule later with each late filing.' then 'old'
           when prompt = 'Why does the app roll a monthly return forward from the date that was due and never from the filing date?' and options = '["A roll from the filing would land on a month end the calendar has to pull back, and the pull is avoided.", "The filing date is not stored on the record.", "Rolling from the filing warns too soon.", "The next due date then follows the old one, whatever day the filing came in."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course prints rollForward(2026-10-10, Monthly) = 2026-11-10. The same call on the filing date would give 2026-11-14, so a roll from the filing would move the schedule later with each late filing.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-rolling-the-schedule-forward' and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for beginner m04-rolling-the-schedule-forward ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: beginner m04-rolling-the-schedule-forward ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Why does the app roll a monthly return forward from the date that was due and never from the filing date?', options = '["A roll from the filing would land on a month end the calendar has to pull back, and the pull is avoided.", "The filing date is not stored on the record.", "Rolling from the filing warns too soon.", "The next due date then follows the old one, whatever day the filing came in."]'::jsonb, explanation = 'The course prints rollForward(2026-10-10, Monthly) = 2026-11-10. The same call on the filing date would give 2026-11-14, so a roll from the filing would move the schedule later with each late filing.'
     where app_slug = 'compliance' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-rolling-the-schedule-forward' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: beginner m04-rolling-the-schedule-forward ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m04-rolling-the-schedule-forward ord 5
  select case
           when prompt = 'What do the two statuses of the rolled REG-2026-002 row, Due soon with its window open and Compliant with lead_time_days 0, show about deriveStatus?' and options = '["It asks about the filing first.", "It asks about the lead time window before it asks about the filing.", "It reads the lead time only for a row never filed.", "It treats a lead time of 0 as missing."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The digest states it: deriveStatus asks whether the next action date is inside the lead time before it asks about the filing. The open window is what keeps the row at Due soon.' then 'old'
           when prompt = 'What do the two statuses of the rolled REG-2026-002 row, Due soon with its window open and Compliant with lead_time_days 0, show about deriveStatus?' and options = '["It asks about the filing first.", "It asks about the lead time window before it asks about the filing.", "It reads the lead time only for a row never filed.", "It treats a lead time of 0 as missing."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course states it: deriveStatus asks whether the next action date is inside the lead time before it asks about the filing. The open window is what keeps the row at Due soon.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-rolling-the-schedule-forward' and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for beginner m04-rolling-the-schedule-forward ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: beginner m04-rolling-the-schedule-forward ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What do the two statuses of the rolled REG-2026-002 row, Due soon with its window open and Compliant with lead_time_days 0, show about deriveStatus?', options = '["It asks about the filing first.", "It asks about the lead time window before it asks about the filing.", "It reads the lead time only for a row never filed.", "It treats a lead time of 0 as missing."]'::jsonb, explanation = 'The course states it: deriveStatus asks whether the next action date is inside the lead time before it asks about the filing. The open window is what keeps the row at Due soon.'
     where app_slug = 'compliance' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-rolling-the-schedule-forward' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: beginner m04-rolling-the-schedule-forward ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m05-controlled-documents ord 6
  select case
           when prompt = 'nextReviewDate is called for an issue date of 2025-03-14 with the review period missing, as null. What does it return, and whose job is the default?' and options = '["No date. Applying DEFAULT_REVIEW_PERIOD_MONTHS is the caller''s job.", "2027-03-14, because the function applies DEFAULT_REVIEW_PERIOD_MONTHS itself.", "A refusal naming the missing review period as a required field.", "The issue date itself, so the document comes up for review at once."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The digest prints none for a period of null and for a period of 0. It prints 2027-03-14 only when the caller passes 24, DEFAULT_REVIEW_PERIOD_MONTHS. The owner''s recorded position is that the default is the caller''s to apply, and the course teaches it as a limit.' then 'old'
           when prompt = 'nextReviewDate is called for an issue date of 2025-03-14 with the review period missing, as null. What does it return, and whose job is the default?' and options = '["No date. Applying DEFAULT_REVIEW_PERIOD_MONTHS is the caller''s job.", "2027-03-14, because the function applies DEFAULT_REVIEW_PERIOD_MONTHS itself.", "A refusal naming the missing review period as a required field.", "The issue date itself, so the document comes up for review at once."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course prints none for a period of null and for a period of 0. It prints 2027-03-14 only when the caller passes 24, DEFAULT_REVIEW_PERIOD_MONTHS. The owner''s recorded position is that the default is the caller''s to apply, and the course teaches it as a limit.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-controlled-documents' and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for beginner m05-controlled-documents ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: beginner m05-controlled-documents ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'nextReviewDate is called for an issue date of 2025-03-14 with the review period missing, as null. What does it return, and whose job is the default?', options = '["No date. Applying DEFAULT_REVIEW_PERIOD_MONTHS is the caller''s job.", "2027-03-14, because the function applies DEFAULT_REVIEW_PERIOD_MONTHS itself.", "A refusal naming the missing review period as a required field.", "The issue date itself, so the document comes up for review at once."]'::jsonb, explanation = 'The course prints none for a period of null and for a period of 0. It prints 2027-03-14 only when the caller passes 24, DEFAULT_REVIEW_PERIOD_MONTHS. The owner''s recorded position is that the default is the caller''s to apply, and the course teaches it as a limit.'
     where app_slug = 'compliance' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-controlled-documents' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: beginner m05-controlled-documents ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 12
  select case
           when prompt = 'An open NCR reaches an age of 31 days. What does ageBand read?' and options = '["31 to 60 days.", "0 to 30 days, since 31 is its first day past the edge.", "61 to 90 days, the band the next month opens.", "null, since an edge day belongs to no band."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The digest''s edge rows print 30 days in 0 to 30 days and 31 days in 31 to 60 days.' then 'old'
           when prompt = 'An open NCR reaches an age of 31 days. What does ageBand read?' and options = '["31 to 60 days.", "0 to 30 days, since 31 is its first day past the edge.", "61 to 90 days, the band the next month opens.", "null, since an edge day belongs to no band."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course''s edge rows print 30 days in 0 to 30 days and 31 days in 31 to 60 days.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for intermediate final ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: intermediate final ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'An open NCR reaches an age of 31 days. What does ageBand read?', options = '["31 to 60 days.", "0 to 30 days, since 31 is its first day past the edge.", "61 to 90 days, the band the next month opens.", "null, since an edge day belongs to no band."]'::jsonb, explanation = 'The course''s edge rows print 30 days in 0 to 30 days and 31 days in 31 to 60 days.'
     where app_slug = 'compliance' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: intermediate final ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 30
  select case
           when prompt = 'canCloseNcr is asked to close NCR-2026-022, which already reads Closed. What does it answer?' and options = '["ALLOWED, since closing it again changes nothing on it.", "REFUSED: Agree the disposition first.", "ALLOWED, since its disposition is Use as is.", "REFUSED: This non-conformance is already closed."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The digest prints the same refusal for NCR-2026-006, also Closed, and "This non-conformance is already voided." for NCR-2026-011.' then 'old'
           when prompt = 'canCloseNcr is asked to close NCR-2026-022, which already reads Closed. What does it answer?' and options = '["ALLOWED, since closing it again changes nothing on it.", "REFUSED: Agree the disposition first.", "ALLOWED, since its disposition is Use as is.", "REFUSED: This non-conformance is already closed."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course prints the same refusal for NCR-2026-006, also Closed, and "This non-conformance is already voided." for NCR-2026-011.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 30;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for intermediate final ord 30'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: intermediate final ord 30 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'canCloseNcr is asked to close NCR-2026-022, which already reads Closed. What does it answer?', options = '["ALLOWED, since closing it again changes nothing on it.", "REFUSED: Agree the disposition first.", "ALLOWED, since its disposition is Use as is.", "REFUSED: This non-conformance is already closed."]'::jsonb, explanation = 'The course prints the same refusal for NCR-2026-006, also Closed, and "This non-conformance is already voided." for NCR-2026-011.'
     where app_slug = 'compliance' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 30;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: intermediate final ord 30 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 38
  select case
           when prompt = 'A plan has 23 of its 40 points resolved. What percent does planProgress print for it?' and options = '["38, the figure for 3 of 8.", "58.", "13, the figure for 1 of 8.", "63, the figure for 5 of 8."]'::jsonb and answer_index = 1 and explanation is not distinct from 'Half up on the exact fraction gives 58 here, and that is the line the digest carries.' then 'old'
           when prompt = 'A plan has 23 of its 40 points resolved. What percent does planProgress print for it?' and options = '["38, the figure for 3 of 8.", "58.", "13, the figure for 1 of 8.", "63, the figure for 5 of 8."]'::jsonb and answer_index = 1 and explanation is not distinct from 'Half up on the exact fraction gives 58 here, and that is the line the course carries.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 38;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for intermediate final ord 38'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: intermediate final ord 38 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A plan has 23 of its 40 points resolved. What percent does planProgress print for it?', options = '["38, the figure for 3 of 8.", "58.", "13, the figure for 1 of 8.", "63, the figure for 5 of 8."]'::jsonb, explanation = 'Half up on the exact fraction gives 58 here, and that is the line the course carries.'
     where app_slug = 'compliance' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 38;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: intermediate final ord 38 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m01-the-inspection-and-test-plan ord 4
  select case
           when prompt = 'W-09 is asked to be waived with a reason and no date or verifier, and the engine refuses. What does a waiver need on the record before it is allowed?' and options = '["A reason alone, since the reason is the part of a waiver that an auditor can test.", "A date and who decided it, with the reason optional on a point that does not stop work.", "A date, who decided it, and the reason for the waiver.", "A reason and a second verifier."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The refusal for this request is "Record the date this was decided and who decided it." and the refusal for a waiver with no reason is the waiver sentence. Only with all three does the digest print ALLOWED.' then 'old'
           when prompt = 'W-09 is asked to be waived with a reason and no date or verifier, and the engine refuses. What does a waiver need on the record before it is allowed?' and options = '["A reason alone, since the reason is the part of a waiver that an auditor can test.", "A date and who decided it, with the reason optional on a point that does not stop work.", "A date, who decided it, and the reason for the waiver.", "A reason and a second verifier."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The refusal for this request is "Record the date this was decided and who decided it." and the refusal for a waiver with no reason is the waiver sentence. Only with all three does the course print ALLOWED.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-the-inspection-and-test-plan' and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for intermediate m01-the-inspection-and-test-plan ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: intermediate m01-the-inspection-and-test-plan ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'W-09 is asked to be waived with a reason and no date or verifier, and the engine refuses. What does a waiver need on the record before it is allowed?', options = '["A reason alone, since the reason is the part of a waiver that an auditor can test.", "A date and who decided it, with the reason optional on a point that does not stop work.", "A date, who decided it, and the reason for the waiver.", "A reason and a second verifier."]'::jsonb, explanation = 'The refusal for this request is "Record the date this was decided and who decided it." and the refusal for a waiver with no reason is the waiver sentence. Only with all three does the course print ALLOWED.'
     where app_slug = 'compliance' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-the-inspection-and-test-plan' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: intermediate m01-the-inspection-and-test-plan ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m01-the-inspection-and-test-plan ord 5
  select case
           when prompt = 'Does canDecideCheckpoint allow a hold point to be waived?' and options = '["No. A hold point may be Passed or set Not applicable, and Waived is refused for it.", "Only while its plan is still a Draft, the same stage at which it may be removed.", "Yes, with a date, a verifier and a reason on the record.", "Only after it has first Failed."]'::jsonb and answer_index = 2 and explanation is not distinct from 'H-08 waived with a date, a verifier and a reason is ALLOWED. The digest states that canDecideCheckpoint has no rule that forbids waiving a hold point, and a waived hold point with its record and reason is resolved like any waived point.' then 'old'
           when prompt = 'Does canDecideCheckpoint allow a hold point to be waived?' and options = '["No. A hold point may be Passed or set Not applicable, and Waived is refused for it.", "Only while its plan is still a Draft, the same stage at which it may be removed.", "Yes, with a date, a verifier and a reason on the record.", "Only after it has first Failed."]'::jsonb and answer_index = 2 and explanation is not distinct from 'H-08 waived with a date, a verifier and a reason is ALLOWED. The course states that canDecideCheckpoint has no rule that forbids waiving a hold point, and a waived hold point with its record and reason is resolved like any waived point.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-the-inspection-and-test-plan' and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for intermediate m01-the-inspection-and-test-plan ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: intermediate m01-the-inspection-and-test-plan ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Does canDecideCheckpoint allow a hold point to be waived?', options = '["No. A hold point may be Passed or set Not applicable, and Waived is refused for it.", "Only while its plan is still a Draft, the same stage at which it may be removed.", "Yes, with a date, a verifier and a reason on the record.", "Only after it has first Failed."]'::jsonb, explanation = 'H-08 waived with a date, a verifier and a reason is ALLOWED. The course states that canDecideCheckpoint has no rule that forbids waiving a hold point, and a waived hold point with its record and reason is resolved like any waived point.'
     where app_slug = 'compliance' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-the-inspection-and-test-plan' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: intermediate m01-the-inspection-and-test-plan ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m01-the-inspection-and-test-plan ord 7
  select case
           when prompt = 'S-10, site surveillance, reads In progress and overdue true. It is set Not applicable with nothing recorded. What does the engine answer?' and options = '["REFUSED, because S-10 reads overdue true against its planned date of 2026-10-01.", "REFUSED, because setting any point aside needs the date and who decided it.", "ALLOWED once a reason is recorded, the same record H-11 needs.", "ALLOWED, with nothing asked of it."]'::jsonb and answer_index = 3 and explanation is not distinct from 'A surveillance point stops nothing, and the digest prints ALLOWED for S-10 with nothing recorded: no date, no name and no reason. Not applicable is one of the three statuses in CHECKPOINT_RESOLVED_STATUSES. The same request on H-11, a hold point, is refused until a date, a name and a reason are on the record.' then 'old'
           when prompt = 'S-10, site surveillance, reads In progress and overdue true. It is set Not applicable with nothing recorded. What does the engine answer?' and options = '["REFUSED, because S-10 reads overdue true against its planned date of 2026-10-01.", "REFUSED, because setting any point aside needs the date and who decided it.", "ALLOWED once a reason is recorded, the same record H-11 needs.", "ALLOWED, with nothing asked of it."]'::jsonb and answer_index = 3 and explanation is not distinct from 'A surveillance point stops nothing, and the course prints ALLOWED for S-10 with nothing recorded: no date, no name and no reason. Not applicable is one of the three statuses in CHECKPOINT_RESOLVED_STATUSES. The same request on H-11, a hold point, is refused until a date, a name and a reason are on the record.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-the-inspection-and-test-plan' and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for intermediate m01-the-inspection-and-test-plan ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: intermediate m01-the-inspection-and-test-plan ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'S-10, site surveillance, reads In progress and overdue true. It is set Not applicable with nothing recorded. What does the engine answer?', options = '["REFUSED, because S-10 reads overdue true against its planned date of 2026-10-01.", "REFUSED, because setting any point aside needs the date and who decided it.", "ALLOWED once a reason is recorded, the same record H-11 needs.", "ALLOWED, with nothing asked of it."]'::jsonb, explanation = 'A surveillance point stops nothing, and the course prints ALLOWED for S-10 with nothing recorded: no date, no name and no reason. Not applicable is one of the three statuses in CHECKPOINT_RESOLVED_STATUSES. The same request on H-11, a hold point, is refused until a date, a name and a reason are on the record.'
     where app_slug = 'compliance' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-the-inspection-and-test-plan' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: intermediate m01-the-inspection-and-test-plan ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m01-the-inspection-and-test-plan ord 10
  select case
           when prompt = 'SECTION 11 prints four cases of how a planProgress percent rounds. Which pairing is one of them?' and options = '["5 of 8 prints 58.", "1 of 8 prints 63.", "3 of 8 prints 38.", "23 of 40 prints 13."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The four cases are 1 of 8 prints 13, 23 of 40 prints 58, 3 of 8 prints 38 and 5 of 8 prints 63. planProgress rounds half up on the exact fraction of resolved points, and a percent is quoted as the engine prints it.' then 'old'
           when prompt = 'The course prints four cases of how a planProgress percent rounds. Which pairing is one of them?' and options = '["5 of 8 prints 58.", "1 of 8 prints 63.", "3 of 8 prints 38.", "23 of 40 prints 13."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The four cases are 1 of 8 prints 13, 23 of 40 prints 58, 3 of 8 prints 38 and 5 of 8 prints 63. planProgress rounds half up on the exact fraction of resolved points, and a percent is quoted as the engine prints it.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-the-inspection-and-test-plan' and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for intermediate m01-the-inspection-and-test-plan ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: intermediate m01-the-inspection-and-test-plan ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course prints four cases of how a planProgress percent rounds. Which pairing is one of them?', options = '["5 of 8 prints 58.", "1 of 8 prints 63.", "3 of 8 prints 38.", "23 of 40 prints 13."]'::jsonb, explanation = 'The four cases are 1 of 8 prints 13, 23 of 40 prints 58, 3 of 8 prints 38 and 5 of 8 prints 63. planProgress rounds half up on the exact fraction of resolved points, and a percent is quoted as the engine prints it.'
     where app_slug = 'compliance' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-the-inspection-and-test-plan' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: intermediate m01-the-inspection-and-test-plan ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m02-closing-a-plan ord 3
  select case
           when prompt = 'The same plan has every hold point Passed and every NCR closed, and W-09, a Witness point, reads Failed. What does canClosePlan answer?' and options = '["ALLOWED, since a witness point does not stop work.", "REFUSED, with the hold point sentence naming W-09.", "ALLOWED, and planProgress keeps W-09 in failed 1.", "REFUSED, with the failed checkpoint sentence H-05 met."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The digest fails W-09, R-04, M-07 and S-10 one at a time and each is refused with "1 checkpoint has failed and has not been resolved." A failed point blocks closure whatever its type, including the types whose stops work column reads false.' then 'old'
           when prompt = 'The same plan has every hold point Passed and every NCR closed, and W-09, a Witness point, reads Failed. What does canClosePlan answer?' and options = '["ALLOWED, since a witness point does not stop work.", "REFUSED, with the hold point sentence naming W-09.", "ALLOWED, and planProgress keeps W-09 in failed 1.", "REFUSED, with the failed checkpoint sentence H-05 met."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course fails W-09, R-04, M-07 and S-10 one at a time and each is refused with "1 checkpoint has failed and has not been resolved." A failed point blocks closure whatever its type, including the types whose stops work column reads false.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-closing-a-plan' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for intermediate m02-closing-a-plan ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: intermediate m02-closing-a-plan ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The same plan has every hold point Passed and every NCR closed, and W-09, a Witness point, reads Failed. What does canClosePlan answer?', options = '["ALLOWED, since a witness point does not stop work.", "REFUSED, with the hold point sentence naming W-09.", "ALLOWED, and planProgress keeps W-09 in failed 1.", "REFUSED, with the failed checkpoint sentence H-05 met."]'::jsonb, explanation = 'The course fails W-09, R-04, M-07 and S-10 one at a time and each is refused with "1 checkpoint has failed and has not been resolved." A failed point blocks closure whatever its type, including the types whose stops work column reads false.'
     where app_slug = 'compliance' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-closing-a-plan' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: intermediate m02-closing-a-plan ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m02-closing-a-plan ord 15
  select case
           when prompt = 'SECTION 12 prints overdue 3 and hold points outstanding 3 for the plan. Which point sits in both lists?' and options = '["H-08 and H-11.", "S-10 and R-12.", "H-05 alone.", "No point sits in both lists."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The overdue three are H-05, S-10 and R-12. The hold points outstanding are H-05, H-08 and H-11. Only H-05 is on both, and H-08 and H-11 block closure while reading overdue false.' then 'old'
           when prompt = 'The course prints overdue 3 and hold points outstanding 3 for the plan. Which point sits in both lists?' and options = '["H-08 and H-11.", "S-10 and R-12.", "H-05 alone.", "No point sits in both lists."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The overdue three are H-05, S-10 and R-12. The hold points outstanding are H-05, H-08 and H-11. Only H-05 is on both, and H-08 and H-11 block closure while reading overdue false.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-closing-a-plan' and ord = 15;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for intermediate m02-closing-a-plan ord 15'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: intermediate m02-closing-a-plan ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course prints overdue 3 and hold points outstanding 3 for the plan. Which point sits in both lists?', options = '["H-08 and H-11.", "S-10 and R-12.", "H-05 alone.", "No point sits in both lists."]'::jsonb, explanation = 'The overdue three are H-05, S-10 and R-12. The hold points outstanding are H-05, H-08 and H-11. Only H-05 is on both, and H-08 and H-11 block closure while reading overdue false.'
     where app_slug = 'compliance' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-closing-a-plan' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: intermediate m02-closing-a-plan ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m03-the-nonconformance ord 4
  select case
           when prompt = 'One corrective action is complete and has never been checked. At which severities does canCloseNcr refuse to close over it?' and options = '["Critical alone.", "Critical, Major and Minor.", "Critical and Major.", "Every severity, Observation included."]'::jsonb and answer_index = 2 and explanation is not distinct from 'NCR_EFFECTIVENESS_REQUIRED holds Critical and Major. On a Minor NCR the digest prints ALLOWED for one corrective action complete and never checked.' then 'old'
           when prompt = 'One corrective action is complete and has never been checked. At which severities does canCloseNcr refuse to close over it?' and options = '["Critical alone.", "Critical, Major and Minor.", "Critical and Major.", "Every severity, Observation included."]'::jsonb and answer_index = 2 and explanation is not distinct from 'NCR_EFFECTIVENESS_REQUIRED holds Critical and Major. On a Minor NCR the course prints ALLOWED for one corrective action complete and never checked.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-the-nonconformance' and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for intermediate m03-the-nonconformance ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: intermediate m03-the-nonconformance ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'One corrective action is complete and has never been checked. At which severities does canCloseNcr refuse to close over it?', options = '["Critical alone.", "Critical, Major and Minor.", "Critical and Major.", "Every severity, Observation included."]'::jsonb, explanation = 'NCR_EFFECTIVENESS_REQUIRED holds Critical and Major. On a Minor NCR the course prints ALLOWED for one corrective action complete and never checked.'
     where app_slug = 'compliance' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-the-nonconformance' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: intermediate m03-the-nonconformance ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m03-the-nonconformance ord 13
  select case
           when prompt = 'summarise prints mean open age 75 days. What is it taken over?' and options = '["The three open ages, 43, 64 and 117.", "All six ages, the closed and voided ones included.", "The two serious NCRs.", "The two overdue NCRs."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The digest prints the ages the mean is taken over: 43, 64 and 117, their sum 224 over 3. The closed ages 8, 2 and 48 are not in it.' then 'old'
           when prompt = 'summarise prints mean open age 75 days. What is it taken over?' and options = '["The three open ages, 43, 64 and 117.", "All six ages, the closed and voided ones included.", "The two serious NCRs.", "The two overdue NCRs."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course prints the ages the mean is taken over: 43, 64 and 117, their sum 224 over 3. The closed ages 8, 2 and 48 are not in it.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-the-nonconformance' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for intermediate m03-the-nonconformance ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: intermediate m03-the-nonconformance ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'summarise prints mean open age 75 days. What is it taken over?', options = '["The three open ages, 43, 64 and 117.", "All six ages, the closed and voided ones included.", "The two serious NCRs.", "The two overdue NCRs."]'::jsonb, explanation = 'The course prints the ages the mean is taken over: 43, 64 and 117, their sum 224 over 3. The closed ages 8, 2 and 48 are not in it.'
     where app_slug = 'compliance' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-the-nonconformance' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: intermediate m03-the-nonconformance ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m03-the-nonconformance ord 14
  select case
           when prompt = 'isCapaOpen reads true for k5, the corrective action on NCR-2026-011. Is k5 in the action summarise''s open 2?' and options = '["Yes. summarise counts every open action.", "Yes, and in overdue 1 as well.", "No. open 2 counts Preventive actions only.", "No. Its NCR is Voided, and summarise leaves it out."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The open two are k2 and k6, and the overdue one is k2. The digest prints that summarise leaves k5 out of the open and overdue counts because it sits on NCR-2026-011, which is Voided.' then 'old'
           when prompt = 'isCapaOpen reads true for k5, the corrective action on NCR-2026-011. Is k5 in the action summarise''s open 2?' and options = '["Yes. summarise counts every open action.", "Yes, and in overdue 1 as well.", "No. open 2 counts Preventive actions only.", "No. Its NCR is Voided, and summarise leaves it out."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The open two are k2 and k6, and the overdue one is k2. The course prints that summarise leaves k5 out of the open and overdue counts because it sits on NCR-2026-011, which is Voided.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-the-nonconformance' and ord = 14;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for intermediate m03-the-nonconformance ord 14'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: intermediate m03-the-nonconformance ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'isCapaOpen reads true for k5, the corrective action on NCR-2026-011. Is k5 in the action summarise''s open 2?', options = '["Yes. summarise counts every open action.", "Yes, and in overdue 1 as well.", "No. open 2 counts Preventive actions only.", "No. Its NCR is Voided, and summarise leaves it out."]'::jsonb, explanation = 'The open two are k2 and k6, and the overdue one is k2. The course prints that summarise leaves k5 out of the open and overdue counts because it sits on NCR-2026-011, which is Voided.'
     where app_slug = 'compliance' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-the-nonconformance' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: intermediate m03-the-nonconformance ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m03-the-nonconformance ord 15
  select case
           when prompt = 'The same actions summarised with no NCRs supplied print open 3 and overdue 2. What changed?' and options = '["k1 is counted, never having been checked.", "k5 is counted, since its Voided parent was not supplied.", "k6 turns overdue with no NCR to hold it.", "k3 counts as open again."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The digest''s line reads "A child whose parent is not supplied counts." Without the NCRs the engine cannot know that k5''s parent is Voided, so the counts move from open 2 and overdue 1.' then 'old'
           when prompt = 'The same actions summarised with no NCRs supplied print open 3 and overdue 2. What changed?' and options = '["k1 is counted, never having been checked.", "k5 is counted, since its Voided parent was not supplied.", "k6 turns overdue with no NCR to hold it.", "k3 counts as open again."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course''s line reads "A child whose parent is not supplied counts." Without the NCRs the engine cannot know that k5''s parent is Voided, so the counts move from open 2 and overdue 1.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-the-nonconformance' and ord = 15;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for intermediate m03-the-nonconformance ord 15'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: intermediate m03-the-nonconformance ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The same actions summarised with no NCRs supplied print open 3 and overdue 2. What changed?', options = '["k1 is counted, never having been checked.", "k5 is counted, since its Voided parent was not supplied.", "k6 turns overdue with no NCR to hold it.", "k3 counts as open again."]'::jsonb, explanation = 'The course''s line reads "A child whose parent is not supplied counts." Without the NCRs the engine cannot know that k5''s parent is Voided, so the counts move from open 2 and overdue 1.'
     where app_slug = 'compliance' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-the-nonconformance' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: intermediate m03-the-nonconformance ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m04-the-checklist ord 3
  select case
           when prompt = 'unansweredItems lists 10, 11, 13 and 14. What separates items 13 and 14 from items 10 and 11?' and options = '["Items 13 and 14 are Critical questions, and 10 and 11 are Minor ones.", "Items 13 and 14 carry a blank note, and 10 and 11 carry no note.", "Items 13 and 14 read Observation, and 10 and 11 read Not applicable.", "Items 13 and 14 have no row at all; 10 and 11 have a row that is not an answer."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The digest prints that items 10 (Not applicable, a blank note) and 11 (Not applicable, no note) have a recorded row that is not an answer, and that items 13 and 14 have no row at all. Item 13 is Minor and item 14 Major.' then 'old'
           when prompt = 'unansweredItems lists 10, 11, 13 and 14. What separates items 13 and 14 from items 10 and 11?' and options = '["Items 13 and 14 are Critical questions, and 10 and 11 are Minor ones.", "Items 13 and 14 carry a blank note, and 10 and 11 carry no note.", "Items 13 and 14 read Observation, and 10 and 11 read Not applicable.", "Items 13 and 14 have no row at all; 10 and 11 have a row that is not an answer."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course prints that items 10 (Not applicable, a blank note) and 11 (Not applicable, no note) have a recorded row that is not an answer, and that items 13 and 14 have no row at all. Item 13 is Minor and item 14 Major.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-the-checklist' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for intermediate m04-the-checklist ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: intermediate m04-the-checklist ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'unansweredItems lists 10, 11, 13 and 14. What separates items 13 and 14 from items 10 and 11?', options = '["Items 13 and 14 are Critical questions, and 10 and 11 are Minor ones.", "Items 13 and 14 carry a blank note, and 10 and 11 carry no note.", "Items 13 and 14 read Observation, and 10 and 11 read Not applicable.", "Items 13 and 14 have no row at all; 10 and 11 have a row that is not an answer."]'::jsonb, explanation = 'The course prints that items 10 (Not applicable, a blank note) and 11 (Not applicable, no note) have a recorded row that is not an answer, and that items 13 and 14 have no row at all. Item 13 is Minor and item 14 Major.'
     where app_slug = 'compliance' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-the-checklist' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: intermediate m04-the-checklist ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m04-the-checklist ord 8
  select case
           when prompt = 'The digest walks canRaiseFinding through three refusals before it reaches the stop-work rows. What do those three ask for?' and options = '["A finding type, an owner and a due date.", "A finding type, a one-line statement and objective evidence.", "A one-line statement, a correction and a root cause.", "Objective evidence, a lead auditor and the auditee''s signature."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The three refusals are "Pick the finding type.", "State the finding in one line." and the objective evidence sentence. A number, an owner and a due date are what the reporting refusal says a failed critical question needs.' then 'old'
           when prompt = 'The course walks canRaiseFinding through three refusals before it reaches the stop-work rows. What do those three ask for?' and options = '["A finding type, an owner and a due date.", "A finding type, a one-line statement and objective evidence.", "A one-line statement, a correction and a root cause.", "Objective evidence, a lead auditor and the auditee''s signature."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The three refusals are "Pick the finding type.", "State the finding in one line." and the objective evidence sentence. A number, an owner and a due date are what the reporting refusal says a failed critical question needs.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-the-checklist' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for intermediate m04-the-checklist ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: intermediate m04-the-checklist ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course walks canRaiseFinding through three refusals before it reaches the stop-work rows. What do those three ask for?', options = '["A finding type, an owner and a due date.", "A finding type, a one-line statement and objective evidence.", "A one-line statement, a correction and a root cause.", "Objective evidence, a lead auditor and the auditee''s signature."]'::jsonb, explanation = 'The three refusals are "Pick the finding type.", "State the finding in one line." and the objective evidence sentence. A number, an owner and a due date are what the reporting refusal says a failed critical question needs.'
     where app_slug = 'compliance' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-the-checklist' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: intermediate m04-the-checklist ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m04-the-checklist ord 13
  select case
           when prompt = 'The programme summarise prints open findings 1, open major 1 and stop-work open 1. How many findings stand behind the three counts?' and options = '["Three, one behind each of the three counts.", "Two: AF-2026-018 and a finding raised from item 6.", "One: AF-2026-018, a Minor nonconformity that stopped work.", "One: AF-2026-018, a Major nonconformity, Open, stop-work true."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The digest names the findings summarise counts: AF-2026-018 alone. One finding is behind open findings 1, open major 1 and stop-work open 1.' then 'old'
           when prompt = 'The programme summarise prints open findings 1, open major 1 and stop-work open 1. How many findings stand behind the three counts?' and options = '["Three, one behind each of the three counts.", "Two: AF-2026-018 and a finding raised from item 6.", "One: AF-2026-018, a Minor nonconformity that stopped work.", "One: AF-2026-018, a Major nonconformity, Open, stop-work true."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course names the findings summarise counts: AF-2026-018 alone. One finding is behind open findings 1, open major 1 and stop-work open 1.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-the-checklist' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for intermediate m04-the-checklist ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: intermediate m04-the-checklist ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The programme summarise prints open findings 1, open major 1 and stop-work open 1. How many findings stand behind the three counts?', options = '["Three, one behind each of the three counts.", "Two: AF-2026-018 and a finding raised from item 6.", "One: AF-2026-018, a Minor nonconformity that stopped work.", "One: AF-2026-018, a Major nonconformity, Open, stop-work true."]'::jsonb, explanation = 'The course names the findings summarise counts: AF-2026-018 alone. One finding is behind open findings 1, open major 1 and stop-work open 1.'
     where app_slug = 'compliance' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-the-checklist' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: intermediate m04-the-checklist ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m05-the-audit-and-the-programme ord 10
  select case
           when prompt = 'An external lead auditor is named in text, with no account. What does auditIndependence answer?' and options = '["ALLOWED for the external lead.", "REFUSED, since there is no account to test.", "REFUSED: Name the lead auditor.", "ALLOWED only once an account is made for them."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The digest prints ALLOWED for an external lead auditor named in text with no account. "Name the lead auditor." is the reporting refusal for an audit with no lead auditor named at all.' then 'old'
           when prompt = 'An external lead auditor is named in text, with no account. What does auditIndependence answer?' and options = '["ALLOWED for the external lead.", "REFUSED, since there is no account to test.", "REFUSED: Name the lead auditor.", "ALLOWED only once an account is made for them."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course prints ALLOWED for an external lead auditor named in text with no account. "Name the lead auditor." is the reporting refusal for an audit with no lead auditor named at all.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-the-audit-and-the-programme' and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for intermediate m05-the-audit-and-the-programme ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: intermediate m05-the-audit-and-the-programme ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'An external lead auditor is named in text, with no account. What does auditIndependence answer?', options = '["ALLOWED for the external lead.", "REFUSED, since there is no account to test.", "REFUSED: Name the lead auditor.", "ALLOWED only once an account is made for them."]'::jsonb, explanation = 'The course prints ALLOWED for an external lead auditor named in text with no account. "Name the lead auditor." is the reporting refusal for an audit with no lead auditor named at all.'
     where app_slug = 'compliance' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-the-audit-and-the-programme' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: intermediate m05-the-audit-and-the-programme ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m06-the-professional-reading ord 10
  select case
           when prompt = 'The programme reads reported 3, cancelled 1 and percent 38. What does AUD-2026-004, the cancelled audit, add to the percent?' and options = '["It counts as delivered, the same as a reported audit.", "Nothing. The percent counts reported audits, and it is not one.", "It counts as delivered once its cancellation reason is on the record.", "It counts as half an audit, between reported and outstanding."]'::jsonb and answer_index = 1 and explanation is not distinct from 'Reported 3 counts AUD-2026-001, AUD-2026-002 and AUD-2026-003, and AUD-2026-004 sits in cancelled 1, in neither reported nor outstanding. A programme is delivered when its audits are reported, and the digest records that the programme counts reported audits only, which is why a complete programme that contains a cancelled audit reads below one hundred percent by design.' then 'old'
           when prompt = 'The programme reads reported 3, cancelled 1 and percent 38. What does AUD-2026-004, the cancelled audit, add to the percent?' and options = '["It counts as delivered, the same as a reported audit.", "Nothing. The percent counts reported audits, and it is not one.", "It counts as delivered once its cancellation reason is on the record.", "It counts as half an audit, between reported and outstanding."]'::jsonb and answer_index = 1 and explanation is not distinct from 'Reported 3 counts AUD-2026-001, AUD-2026-002 and AUD-2026-003, and AUD-2026-004 sits in cancelled 1, in neither reported nor outstanding. A programme is delivered when its audits are reported, and the course records that the programme counts reported audits only, which is why a complete programme that contains a cancelled audit reads below one hundred percent by design.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for intermediate m06-the-professional-reading ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: intermediate m06-the-professional-reading ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The programme reads reported 3, cancelled 1 and percent 38. What does AUD-2026-004, the cancelled audit, add to the percent?', options = '["It counts as delivered, the same as a reported audit.", "Nothing. The percent counts reported audits, and it is not one.", "It counts as delivered once its cancellation reason is on the record.", "It counts as half an audit, between reported and outstanding."]'::jsonb, explanation = 'Reported 3 counts AUD-2026-001, AUD-2026-002 and AUD-2026-003, and AUD-2026-004 sits in cancelled 1, in neither reported nor outstanding. A programme is delivered when its audits are reported, and the course records that the programme counts reported audits only, which is why a complete programme that contains a cancelled audit reads below one hundred percent by design.'
     where app_slug = 'compliance' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: intermediate m06-the-professional-reading ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 2
  select case
           when prompt = 'An assessor finds clause 7.2 failing and has no document to point to. Can the verdict go on the register?' and options = '["Yes: Nonconformant with a date and an assessor is allowed with no evidence reference.", "No: every clause verdict needs evidence, a date and an assessor before it stands.", "Only as Partially conformant, which asks for less on the record than Nonconformant.", "Only once an audit finding has been raised and recorded against the clause."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The digest prints Nonconformant with a date and an assessor: ALLOWED. Partially conformant asks for all three, as Conformant does. A problem needs less on the record than a claim of conformity.' then 'old'
           when prompt = 'An assessor finds clause 7.2 failing and has no document to point to. Can the verdict go on the register?' and options = '["Yes: Nonconformant with a date and an assessor is allowed with no evidence reference.", "No: every clause verdict needs evidence, a date and an assessor before it stands.", "Only as Partially conformant, which asks for less on the record than Nonconformant.", "Only once an audit finding has been raised and recorded against the clause."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course prints Nonconformant with a date and an assessor: ALLOWED. Partially conformant asks for all three, as Conformant does. A problem needs less on the record than a claim of conformity.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for advanced final ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: advanced final ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'An assessor finds clause 7.2 failing and has no document to point to. Can the verdict go on the register?', options = '["Yes: Nonconformant with a date and an assessor is allowed with no evidence reference.", "No: every clause verdict needs evidence, a date and an assessor before it stands.", "Only as Partially conformant, which asks for less on the record than Nonconformant.", "Only once an audit finding has been raised and recorded against the clause."]'::jsonb, explanation = 'The course prints Nonconformant with a date and an assessor: ALLOWED. Partially conformant asks for all three, as Conformant does. A problem needs less on the record than a claim of conformity.'
     where app_slug = 'compliance' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: advanced final ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 39
  select case
           when prompt = 'ac4 is Preventive, Complete, with no effectiveness verdict. Where does it show in the ORASHI counts?' and options = '["In the summary''s awaiting an effectiveness check 1", "In the summary''s overdue actions 1, as its due date 2026-09-01 has passed", "In the summary''s open actions 2, counted beside ac1", "Nowhere, since a Complete action leaves every count"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The summary''s open actions 2 are ac1 and ac3, and overdue actions 1 is ac1. ac4 reads open false and overdue false, and the digest names it as the action awaiting an effectiveness check.' then 'old'
           when prompt = 'ac4 is Preventive, Complete, with no effectiveness verdict. Where does it show in the ORASHI counts?' and options = '["In the summary''s awaiting an effectiveness check 1", "In the summary''s overdue actions 1, as its due date 2026-09-01 has passed", "In the summary''s open actions 2, counted beside ac1", "Nowhere, since a Complete action leaves every count"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The summary''s open actions 2 are ac1 and ac3, and overdue actions 1 is ac1. ac4 reads open false and overdue false, and the course names it as the action awaiting an effectiveness check.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 39;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for advanced final ord 39'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: advanced final ord 39 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'ac4 is Preventive, Complete, with no effectiveness verdict. Where does it show in the ORASHI counts?', options = '["In the summary''s awaiting an effectiveness check 1", "In the summary''s overdue actions 1, as its due date 2026-09-01 has passed", "In the summary''s open actions 2, counted beside ac1", "Nowhere, since a Complete action leaves every count"]'::jsonb, explanation = 'The summary''s open actions 2 are ac1 and ac3, and overdue actions 1 is ac1. ac4 reads open false and overdue false, and the course names it as the action awaiting an effectiveness check.'
     where app_slug = 'compliance' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 39;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: advanced final ord 39 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m01-a-claim-is-evidence ord 1
  select case
           when prompt = 'Clause 7.2 of the ORASHI register has nothing recorded. A request sets it to Conformant and supplies an evidence reference, with no assessment date and no assessor. What does canSetClauseStatus answer?' and options = '["It allows the status, because the evidence reference is what a conformity claim stands on.", "It refuses, in the same sentence it gives a Conformant request that carries nothing at all.", "It refuses with the shorter sentence asking only for the date and the assessor.", "It allows the status and lists 7.2 under missingEvidenceParts for the rest."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The digest prints REFUSED for Conformant with an evidence reference only, in the words it uses for Conformant with nothing else: name the evidence, the date it was assessed and who assessed it. The shorter sentence belongs to a Nonconformant request with no date.' then 'old'
           when prompt = 'Clause 7.2 of the ORASHI register has nothing recorded. A request sets it to Conformant and supplies an evidence reference, with no assessment date and no assessor. What does canSetClauseStatus answer?' and options = '["It allows the status, because the evidence reference is what a conformity claim stands on.", "It refuses, in the same sentence it gives a Conformant request that carries nothing at all.", "It refuses with the shorter sentence asking only for the date and the assessor.", "It allows the status and lists 7.2 under missingEvidenceParts for the rest."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course prints REFUSED for Conformant with an evidence reference only, in the words it uses for Conformant with nothing else: name the evidence, the date it was assessed and who assessed it. The shorter sentence belongs to a Nonconformant request with no date.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-a-claim-is-evidence' and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for advanced m01-a-claim-is-evidence ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: advanced m01-a-claim-is-evidence ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Clause 7.2 of the ORASHI register has nothing recorded. A request sets it to Conformant and supplies an evidence reference, with no assessment date and no assessor. What does canSetClauseStatus answer?', options = '["It allows the status, because the evidence reference is what a conformity claim stands on.", "It refuses, in the same sentence it gives a Conformant request that carries nothing at all.", "It refuses with the shorter sentence asking only for the date and the assessor.", "It allows the status and lists 7.2 under missingEvidenceParts for the rest."]'::jsonb, explanation = 'The course prints REFUSED for Conformant with an evidence reference only, in the words it uses for Conformant with nothing else: name the evidence, the date it was assessed and who assessed it. The shorter sentence belongs to a Nonconformant request with no date.'
     where app_slug = 'compliance' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-a-claim-is-evidence' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: advanced m01-a-claim-is-evidence ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m01-a-claim-is-evidence ord 4
  select case
           when prompt = 'Both fields of a clause are set to Not applicable with no justification. Of the four refusals the digest prints for this request, which one cites a numbered clause of the standard?' and options = '["The ISO 14001:2015 refusal, which cites §9.2 of the standard the ORASHI register is kept against.", "The ISO 45001:2018 refusal, which cites §4.3 in the same words the ISO 9001:2015 sentence uses.", "The ISO 9001:2015 refusal, which cites §4.3 of that standard.", "The no-standard refusal, which falls back to §4.3."]'::jsonb and answer_index = 2 and explanation is not distinct from 'Only the ISO 9001:2015 sentence names §4.3. The ISO 14001:2015 and ISO 45001:2018 sentences name their standard in the engine''s own shape, and with no standard passed the sentence names none. All four are refusals.' then 'old'
           when prompt = 'Both fields of a clause are set to Not applicable with no justification. Of the four refusals the course prints for this request, which one cites a numbered clause of the standard?' and options = '["The ISO 14001:2015 refusal, which cites §9.2 of the standard the ORASHI register is kept against.", "The ISO 45001:2018 refusal, which cites §4.3 in the same words the ISO 9001:2015 sentence uses.", "The ISO 9001:2015 refusal, which cites §4.3 of that standard.", "The no-standard refusal, which falls back to §4.3."]'::jsonb and answer_index = 2 and explanation is not distinct from 'Only the ISO 9001:2015 sentence names §4.3. The ISO 14001:2015 and ISO 45001:2018 sentences name their standard in the engine''s own shape, and with no standard passed the sentence names none. All four are refusals.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-a-claim-is-evidence' and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for advanced m01-a-claim-is-evidence ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: advanced m01-a-claim-is-evidence ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Both fields of a clause are set to Not applicable with no justification. Of the four refusals the course prints for this request, which one cites a numbered clause of the standard?', options = '["The ISO 14001:2015 refusal, which cites §9.2 of the standard the ORASHI register is kept against.", "The ISO 45001:2018 refusal, which cites §4.3 in the same words the ISO 9001:2015 sentence uses.", "The ISO 9001:2015 refusal, which cites §4.3 of that standard.", "The no-standard refusal, which falls back to §4.3."]'::jsonb, explanation = 'Only the ISO 9001:2015 sentence names §4.3. The ISO 14001:2015 and ISO 45001:2018 sentences name their standard in the engine''s own shape, and with no standard passed the sentence names none. All four are refusals.'
     where app_slug = 'compliance' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-a-claim-is-evidence' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: advanced m01-a-claim-is-evidence ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m01-a-claim-is-evidence ord 5
  select case
           when prompt = 'The same Not applicable request, with no justification, is sent with no standard passed as the fourth argument. What comes back?' and options = '["An allowed verdict, because without a standard there is no requirement left to justify.", "A refusal naming ISO 14001:2015, the standard of the register the clause sits in.", "A refusal that asks why the requirement does not apply and names no standard.", "A refusal saying the call is missing its standard, returned before any justification is read."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The digest prints: "Say why this requirement does not apply. A requirement determined not applicable keeps its justification on record." The verdict is the same refusal for all three standards and for none; only the wording follows the standard passed.' then 'old'
           when prompt = 'The same Not applicable request, with no justification, is sent with no standard passed as the fourth argument. What comes back?' and options = '["An allowed verdict, because without a standard there is no requirement left to justify.", "A refusal naming ISO 14001:2015, the standard of the register the clause sits in.", "A refusal that asks why the requirement does not apply and names no standard.", "A refusal saying the call is missing its standard, returned before any justification is read."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course prints: "Say why this requirement does not apply. A requirement determined not applicable keeps its justification on record." The verdict is the same refusal for all three standards and for none; only the wording follows the standard passed.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-a-claim-is-evidence' and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for advanced m01-a-claim-is-evidence ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: advanced m01-a-claim-is-evidence ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The same Not applicable request, with no justification, is sent with no standard passed as the fourth argument. What comes back?', options = '["An allowed verdict, because without a standard there is no requirement left to justify.", "A refusal naming ISO 14001:2015, the standard of the register the clause sits in.", "A refusal that asks why the requirement does not apply and names no standard.", "A refusal saying the call is missing its standard, returned before any justification is read."]'::jsonb, explanation = 'The course prints: "Say why this requirement does not apply. A requirement determined not applicable keeps its justification on record." The verdict is the same refusal for all three standards and for none; only the wording follows the standard passed.'
     where app_slug = 'compliance' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-a-claim-is-evidence' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: advanced m01-a-claim-is-evidence ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m01-a-claim-is-evidence ord 14
  select case
           when prompt = 'Partially conformant sits between Conformant and Nonconformant. Which of the two does it match on what canSetClauseStatus asks for?' and options = '["Conformant: it is refused without evidence, a date and an assessor, in the same sentence.", "Nonconformant: a date and an assessor are enough, and no evidence reference is asked for.", "Neither: it needs an evidence reference alone, since a partial claim carries no assessment.", "Neither: it is refused unless the clause''s applicability is changed in the same request."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The digest prints Partially conformant, nothing else: REFUSED, with the sentence Conformant meets, and ALLOWED with evidence, a date and an assessor. Clause 6.1.2 reads Partially conformant with claims conformity, evidence record and assessed all true.' then 'old'
           when prompt = 'Partially conformant sits between Conformant and Nonconformant. Which of the two does it match on what canSetClauseStatus asks for?' and options = '["Conformant: it is refused without evidence, a date and an assessor, in the same sentence.", "Nonconformant: a date and an assessor are enough, and no evidence reference is asked for.", "Neither: it needs an evidence reference alone, since a partial claim carries no assessment.", "Neither: it is refused unless the clause''s applicability is changed in the same request."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course prints Partially conformant, nothing else: REFUSED, with the sentence Conformant meets, and ALLOWED with evidence, a date and an assessor. Clause 6.1.2 reads Partially conformant with claims conformity, evidence record and assessed all true.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-a-claim-is-evidence' and ord = 14;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for advanced m01-a-claim-is-evidence ord 14'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: advanced m01-a-claim-is-evidence ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Partially conformant sits between Conformant and Nonconformant. Which of the two does it match on what canSetClauseStatus asks for?', options = '["Conformant: it is refused without evidence, a date and an assessor, in the same sentence.", "Nonconformant: a date and an assessor are enough, and no evidence reference is asked for.", "Neither: it needs an evidence reference alone, since a partial claim carries no assessment.", "Neither: it is refused unless the clause''s applicability is changed in the same request."]'::jsonb, explanation = 'The course prints Partially conformant, nothing else: REFUSED, with the sentence Conformant meets, and ALLOWED with evidence, a date and an assessor. Clause 6.1.2 reads Partially conformant with claims conformity, evidence record and assessed all true.'
     where app_slug = 'compliance' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-a-claim-is-evidence' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: advanced m01-a-claim-is-evidence ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m02-independence ord 6
  select case
           when prompt = 'u-obinna owns clauses 5.2, 7.2 and 7.5.3, and none of the four in the planned audit''s scope. What does the digest print for u-obinna as its lead auditor?' and options = '["ALLOWED, in the row printed for u-chidi.", "REFUSED, naming 7.2 as the clause u-obinna has left unassessed.", "REFUSED, because u-obinna owns the unevidenced claim on clause 5.2.", "No row at all, so no verdict is stated for u-obinna."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The five printed rows are u-chidi, u-kalu, u-nneka, u-tari and an external lead named in text. A verdict the digest does not print is one this course does not state, however likely it looks from the ownership table.' then 'old'
           when prompt = 'u-obinna owns clauses 5.2, 7.2 and 7.5.3, and none of the four in the planned audit''s scope. What does the course print for u-obinna as its lead auditor?' and options = '["ALLOWED, in the row printed for u-chidi.", "REFUSED, naming 7.2 as the clause u-obinna has left unassessed.", "REFUSED, because u-obinna owns the unevidenced claim on clause 5.2.", "No row at all, so no verdict is stated for u-obinna."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The five printed rows are u-chidi, u-kalu, u-nneka, u-tari and an external lead named in text. A verdict the course does not print is one it does not state, however likely it looks from the ownership table.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-independence' and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for advanced m02-independence ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: advanced m02-independence ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'u-obinna owns clauses 5.2, 7.2 and 7.5.3, and none of the four in the planned audit''s scope. What does the course print for u-obinna as its lead auditor?', options = '["ALLOWED, in the row printed for u-chidi.", "REFUSED, naming 7.2 as the clause u-obinna has left unassessed.", "REFUSED, because u-obinna owns the unevidenced claim on clause 5.2.", "No row at all, so no verdict is stated for u-obinna."]'::jsonb, explanation = 'The five printed rows are u-chidi, u-kalu, u-nneka, u-tari and an external lead named in text. A verdict the course does not print is one it does not state, however likely it looks from the ownership table.'
     where app_slug = 'compliance' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-independence' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: advanced m02-independence ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m02-independence ord 15
  select case
           when prompt = 'Among the candidates for lead of the planned audit who hold an account, which one does the digest allow?' and options = '["u-tari, whose one clause inside the audit''s scope is 9.1.1", "u-nneka, whose clause 9.2 is Conformant with evidence", "u-chidi, who owns none of the four clauses in scope", "u-kalu, once clauses 8.1 and 8.2 are recorded as Conformant"]'::jsonb and answer_index = 2 and explanation is not distinct from 'u-chidi: ALLOWED. u-tari is refused naming 9.1.1, u-nneka naming 9.2 and u-kalu naming 8.1 and 8.2. A clause''s status plays no part in the check; ownership inside the scope is what it reads.' then 'old'
           when prompt = 'Among the candidates for lead of the planned audit who hold an account, which one does the course allow?' and options = '["u-tari, whose one clause inside the audit''s scope is 9.1.1", "u-nneka, whose clause 9.2 is Conformant with evidence", "u-chidi, who owns none of the four clauses in scope", "u-kalu, once clauses 8.1 and 8.2 are recorded as Conformant"]'::jsonb and answer_index = 2 and explanation is not distinct from 'u-chidi: ALLOWED. u-tari is refused naming 9.1.1, u-nneka naming 9.2 and u-kalu naming 8.1 and 8.2. A clause''s status plays no part in the check; ownership inside the scope is what it reads.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-independence' and ord = 15;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for advanced m02-independence ord 15'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: advanced m02-independence ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Among the candidates for lead of the planned audit who hold an account, which one does the course allow?', options = '["u-tari, whose one clause inside the audit''s scope is 9.1.1", "u-nneka, whose clause 9.2 is Conformant with evidence", "u-chidi, who owns none of the four clauses in scope", "u-kalu, once clauses 8.1 and 8.2 are recorded as Conformant"]'::jsonb, explanation = 'u-chidi: ALLOWED. u-tari is refused naming 9.1.1, u-nneka naming 9.2 and u-kalu naming 8.1 and 8.2. A clause''s status plays no part in the check; ownership inside the scope is what it reads.'
     where app_slug = 'compliance' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-independence' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: advanced m02-independence ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m03-coverage-over-the-cycle ord 6
  select case
           when prompt = 'Across the four cycle lengths the digest prints for the ORASHI register, which column never changes?' and options = '["stale, at 3 in every row", "covered, at 8 in every row", "never examined, at 3 in every row", "never examined, falling to 0 at 4 years"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The cycle decides how far back an examination may fall and still count. It cannot create an examination that does not exist, so clauses 6.1.2, 7.2 and 7.5.3 read never at 1, 2, 3 and 4 years alike.' then 'old'
           when prompt = 'Across the four cycle lengths the course prints for the ORASHI register, which column never changes?' and options = '["stale, at 3 in every row", "covered, at 8 in every row", "never examined, at 3 in every row", "never examined, falling to 0 at 4 years"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The cycle decides how far back an examination may fall and still count. It cannot create an examination that does not exist, so clauses 6.1.2, 7.2 and 7.5.3 read never at 1, 2, 3 and 4 years alike.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-coverage-over-the-cycle' and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for advanced m03-coverage-over-the-cycle ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: advanced m03-coverage-over-the-cycle ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Across the four cycle lengths the course prints for the ORASHI register, which column never changes?', options = '["stale, at 3 in every row", "covered, at 8 in every row", "never examined, at 3 in every row", "never examined, falling to 0 at 4 years"]'::jsonb, explanation = 'The cycle decides how far back an examination may fall and still count. It cannot create an examination that does not exist, so clauses 6.1.2, 7.2 and 7.5.3 read never at 1, 2, 3 and 4 years alike.'
     where app_slug = 'compliance' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-coverage-over-the-cycle' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: advanced m03-coverage-over-the-cycle ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m03-coverage-over-the-cycle ord 8
  select case
           when prompt = 'At cycle lengths of 1 and 2 years the table prints the same pair, covered 6 and stale 3. What may a reader conclude from the two rows?' and options = '["That the cycle has no effect below 3 years for any register at all.", "That the 3 stale clauses at those lengths are the 3 never examined.", "That 3 years is the shortest cycle the engine reads.", "Only that this register gives that pair at those two lengths."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The table shows this register at the four lengths printed and nothing more. Never examined also reads 3 at those lengths, a separate count from stale. Quote only the rows the digest prints.' then 'old'
           when prompt = 'At cycle lengths of 1 and 2 years the table prints the same pair, covered 6 and stale 3. What may a reader conclude from the two rows?' and options = '["That the cycle has no effect below 3 years for any register at all.", "That the 3 stale clauses at those lengths are the 3 never examined.", "That 3 years is the shortest cycle the engine reads.", "Only that this register gives that pair at those two lengths."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The table shows this register at the four lengths printed and nothing more. Never examined also reads 3 at those lengths, a separate count from stale. Quote only the rows the course prints.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-coverage-over-the-cycle' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for advanced m03-coverage-over-the-cycle ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: advanced m03-coverage-over-the-cycle ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'At cycle lengths of 1 and 2 years the table prints the same pair, covered 6 and stale 3. What may a reader conclude from the two rows?', options = '["That the cycle has no effect below 3 years for any register at all.", "That the 3 stale clauses at those lengths are the 3 never examined.", "That 3 years is the shortest cycle the engine reads.", "Only that this register gives that pair at those two lengths."]'::jsonb, explanation = 'The table shows this register at the four lengths printed and nothing more. Never examined also reads 3 at those lengths, a separate count from stale. Quote only the rows the course prints.'
     where app_slug = 'compliance' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-coverage-over-the-cycle' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: advanced m03-coverage-over-the-cycle ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m03-coverage-over-the-cycle ord 12
  select case
           when prompt = 'canReportAudit is called on ISA-2026-002, which has three clauses in scope and two not yet examined. What does it answer?' and options = '["A refusal naming 5.2, the one clause the audit has examined so far", "ALLOWED, because an audit in progress may report the results it already holds", "A refusal saying the audit has no clauses in its scope to report on", "A refusal naming 7.2 and 8.1 as the two clauses in scope with no result yet"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The digest prints: "2 clauses in scope have no result yet (7.2, 8.1)." The sentence about an audit with no clauses in its scope belongs to an empty scope, a separate row.' then 'old'
           when prompt = 'canReportAudit is called on ISA-2026-002, which has three clauses in scope and two not yet examined. What does it answer?' and options = '["A refusal naming 5.2, the one clause the audit has examined so far", "ALLOWED, because an audit in progress may report the results it already holds", "A refusal saying the audit has no clauses in its scope to report on", "A refusal naming 7.2 and 8.1 as the two clauses in scope with no result yet"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course prints: "2 clauses in scope have no result yet (7.2, 8.1)." The sentence about an audit with no clauses in its scope belongs to an empty scope, a separate row.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-coverage-over-the-cycle' and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for advanced m03-coverage-over-the-cycle ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: advanced m03-coverage-over-the-cycle ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'canReportAudit is called on ISA-2026-002, which has three clauses in scope and two not yet examined. What does it answer?', options = '["A refusal naming 5.2, the one clause the audit has examined so far", "ALLOWED, because an audit in progress may report the results it already holds", "A refusal saying the audit has no clauses in its scope to report on", "A refusal naming 7.2 and 8.1 as the two clauses in scope with no result yet"]'::jsonb, explanation = 'The course prints: "2 clauses in scope have no result yet (7.2, 8.1)." The sentence about an audit with no clauses in its scope belongs to an empty scope, a separate row.'
     where app_slug = 'compliance' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-coverage-over-the-cycle' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: advanced m03-coverage-over-the-cycle ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m04-findings-and-root-causes ord 1
  select case
           when prompt = 'canCloseFinding is asked to close ISF-2026-005, a Minor nonconformity with status Open. Its action ac3 is Corrective and Open. Which requirement refuses it?' and options = '["The open action: ac3 is still Open against the finding.", "The effectiveness check a Minor nonconformity needs before it closes.", "The correction: nothing records what was done about the thing that was found.", "The due date, 2026-12-11, which has not yet arrived."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The digest prints the correction refusal for ISF-2026-005: "Record the correction: what was done about the thing that was found. A corrective action deals with the cause, and this is the other half." The correction is the first thing the gate asks for.' then 'old'
           when prompt = 'canCloseFinding is asked to close ISF-2026-005, a Minor nonconformity with status Open. Its action ac3 is Corrective and Open. Which requirement refuses it?' and options = '["The open action: ac3 is still Open against the finding.", "The effectiveness check a Minor nonconformity needs before it closes.", "The correction: nothing records what was done about the thing that was found.", "The due date, 2026-12-11, which has not yet arrived."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course prints the correction refusal for ISF-2026-005: "Record the correction: what was done about the thing that was found. A corrective action deals with the cause, and this is the other half." The correction is the first thing the gate asks for.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-findings-and-root-causes' and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for advanced m04-findings-and-root-causes ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: advanced m04-findings-and-root-causes ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'canCloseFinding is asked to close ISF-2026-005, a Minor nonconformity with status Open. Its action ac3 is Corrective and Open. Which requirement refuses it?', options = '["The open action: ac3 is still Open against the finding.", "The effectiveness check a Minor nonconformity needs before it closes.", "The correction: nothing records what was done about the thing that was found.", "The due date, 2026-12-11, which has not yet arrived."]'::jsonb, explanation = 'The course prints the correction refusal for ISF-2026-005: "Record the correction: what was done about the thing that was found. A corrective action deals with the cause, and this is the other half." The correction is the first thing the gate asks for.'
     where app_slug = 'compliance' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-findings-and-root-causes' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: advanced m04-findings-and-root-causes ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m04-findings-and-root-causes ord 2
  select case
           when prompt = 'A Minor nonconformity has its correction recorded and no actions at all. What does canCloseFinding answer?' and options = '["ALLOWED, because a Minor nonconformity closes on its correction alone.", "REFUSED until a corrective action is raised against the cause.", "REFUSED until its root cause is recorded, as for any nonconformity.", "ALLOWED only once an effectiveness check is recorded on the correction."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The digest prints: a Minor nonconformity with its correction and no actions: ALLOWED. isoCompliance.EFFECTIVENESS_REQUIRED_TYPES holds Major nonconformity alone, and the root cause refusal is written for a major nonconformity.' then 'old'
           when prompt = 'A Minor nonconformity has its correction recorded and no actions at all. What does canCloseFinding answer?' and options = '["ALLOWED, because a Minor nonconformity closes on its correction alone.", "REFUSED until a corrective action is raised against the cause.", "REFUSED until its root cause is recorded, as for any nonconformity.", "ALLOWED only once an effectiveness check is recorded on the correction."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course prints: a Minor nonconformity with its correction and no actions: ALLOWED. isoCompliance.EFFECTIVENESS_REQUIRED_TYPES holds Major nonconformity alone, and the root cause refusal is written for a major nonconformity.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-findings-and-root-causes' and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for advanced m04-findings-and-root-causes ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: advanced m04-findings-and-root-causes ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A Minor nonconformity has its correction recorded and no actions at all. What does canCloseFinding answer?', options = '["ALLOWED, because a Minor nonconformity closes on its correction alone.", "REFUSED until a corrective action is raised against the cause.", "REFUSED until its root cause is recorded, as for any nonconformity.", "ALLOWED only once an effectiveness check is recorded on the correction."]'::jsonb, explanation = 'The course prints: a Minor nonconformity with its correction and no actions: ALLOWED. isoCompliance.EFFECTIVENESS_REQUIRED_TYPES holds Major nonconformity alone, and the root cause refusal is written for a major nonconformity.'
     where app_slug = 'compliance' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-findings-and-root-causes' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: advanced m04-findings-and-root-causes ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m04-findings-and-root-causes ord 5
  select case
           when prompt = 'ISF-2026-004 holds ac1, Corrective, In progress, and ac4, Preventive, Complete and unchecked. Which refusal does it meet at 2026-10-15?' and options = '["The root cause refusal, since ac4 was aimed at a cause nobody wrote down.", "The open action refusal, because ac1 is still open against it.", "The unchecked action refusal, since ac4 is Complete with no effectiveness verdict.", "The correction refusal, since a preventive action carries no correction."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The digest prints: "1 action still open against this finding." The refusal names the first thing missing on the walk, and ac1 is it.' then 'old'
           when prompt = 'ISF-2026-004 holds ac1, Corrective, In progress, and ac4, Preventive, Complete and unchecked. Which refusal does it meet at 2026-10-15?' and options = '["The root cause refusal, since ac4 was aimed at a cause nobody wrote down.", "The open action refusal, because ac1 is still open against it.", "The unchecked action refusal, since ac4 is Complete with no effectiveness verdict.", "The correction refusal, since a preventive action carries no correction."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course prints: "1 action still open against this finding." The refusal names the first thing missing on the walk, and ac1 is it.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-findings-and-root-causes' and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for advanced m04-findings-and-root-causes ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: advanced m04-findings-and-root-causes ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'ISF-2026-004 holds ac1, Corrective, In progress, and ac4, Preventive, Complete and unchecked. Which refusal does it meet at 2026-10-15?', options = '["The root cause refusal, since ac4 was aimed at a cause nobody wrote down.", "The open action refusal, because ac1 is still open against it.", "The unchecked action refusal, since ac4 is Complete with no effectiveness verdict.", "The correction refusal, since a preventive action carries no correction."]'::jsonb, explanation = 'The course prints: "1 action still open against this finding." The refusal names the first thing missing on the walk, and ac1 is it.'
     where app_slug = 'compliance' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-findings-and-root-causes' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: advanced m04-findings-and-root-causes ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m04-findings-and-root-causes ord 7
  select case
           when prompt = 'The register summary prints awaiting an effectiveness check 1. Which action is behind that count?' and options = '["ac4, Preventive, on ISF-2026-004, Complete with no effectiveness verdict", "ac1, Corrective, on ISF-2026-004, In progress and past its due date", "ac2, Corrective, on ISF-2026-001, Complete and verified effective", "ac3, Corrective, on ISF-2026-005, Open with no verdict"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The digest names ac4 as the one Complete action with no effectiveness verdict recorded. ac1 and ac3 are still open, and ac2 reads verified effective true.' then 'old'
           when prompt = 'The register summary prints awaiting an effectiveness check 1. Which action is behind that count?' and options = '["ac4, Preventive, on ISF-2026-004, Complete with no effectiveness verdict", "ac1, Corrective, on ISF-2026-004, In progress and past its due date", "ac2, Corrective, on ISF-2026-001, Complete and verified effective", "ac3, Corrective, on ISF-2026-005, Open with no verdict"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course names ac4 as the one Complete action with no effectiveness verdict recorded. ac1 and ac3 are still open, and ac2 reads verified effective true.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-findings-and-root-causes' and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for advanced m04-findings-and-root-causes ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: advanced m04-findings-and-root-causes ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The register summary prints awaiting an effectiveness check 1. Which action is behind that count?', options = '["ac4, Preventive, on ISF-2026-004, Complete with no effectiveness verdict", "ac1, Corrective, on ISF-2026-004, In progress and past its due date", "ac2, Corrective, on ISF-2026-001, Complete and verified effective", "ac3, Corrective, on ISF-2026-005, Open with no verdict"]'::jsonb, explanation = 'The course names ac4 as the one Complete action with no effectiveness verdict recorded. ac1 and ac3 are still open, and ac2 reads verified effective true.'
     where app_slug = 'compliance' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-findings-and-root-causes' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: advanced m04-findings-and-root-causes ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m04-findings-and-root-causes ord 9
  select case
           when prompt = 'A Major nonconformity is raised in the Audit & Findings Manager. Which root cause list is its cause recorded against?' and options = '["The quality list of 9, since the Audit & Findings Manager is a quality app.", "A list of its own, kept in step with the ISO list by a copy that is refreshed.", "The ISO list of 10, which auditManagement holds as the very same list object.", "The ISO list less Management system, a category kept for ISO registers."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The digest prints: auditManagement.ROOT_CAUSE_CATEGORIES is the same list object as isoCompliance''s: true. One list, so nothing can drift apart. auditManagement.canCloseFinding is the same function as isoCompliance''s as well.' then 'old'
           when prompt = 'A Major nonconformity is raised in the Audit & Findings Manager. Which root cause list is its cause recorded against?' and options = '["The quality list of 9, since the Audit & Findings Manager is a quality app.", "A list of its own, kept in step with the ISO list by a copy that is refreshed.", "The ISO list of 10, which auditManagement holds as the very same list object.", "The ISO list less Management system, a category kept for ISO registers."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course prints: auditManagement.ROOT_CAUSE_CATEGORIES is the same list object as isoCompliance''s: true. One list, so nothing can drift apart. auditManagement.canCloseFinding is the same function as isoCompliance''s as well.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-findings-and-root-causes' and ord = 9;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for advanced m04-findings-and-root-causes ord 9'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: advanced m04-findings-and-root-causes ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A Major nonconformity is raised in the Audit & Findings Manager. Which root cause list is its cause recorded against?', options = '["The quality list of 9, since the Audit & Findings Manager is a quality app.", "A list of its own, kept in step with the ISO list by a copy that is refreshed.", "The ISO list of 10, which auditManagement holds as the very same list object.", "The ISO list less Management system, a category kept for ISO registers."]'::jsonb, explanation = 'The course prints: auditManagement.ROOT_CAUSE_CATEGORIES is the same list object as isoCompliance''s: true. One list, so nothing can drift apart. auditManagement.canCloseFinding is the same function as isoCompliance''s as well.'
     where app_slug = 'compliance' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-findings-and-root-causes' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: advanced m04-findings-and-root-causes ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-certification-readiness ord 1
  select case
           when prompt = 'certificationReadiness for ISO 14001:2015 at ORASHI returns ready false. What else does it return?' and options = '["A readiness percentage weighted by severity, with the items that pulled it down.", "A single blocking reason, the first requirement that fails, as the earlier gates do.", "A score for each clause, with the certificate as a gate the rest of the list sits behind.", "A list of items, each with a severity, a count and a sentence, and a table of counts."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The list has eleven items across blocking, serious and watch, and a table of counts beside it. The digest prints no percentage and no score for it, and ready false stands beside four blocking items.' then 'old'
           when prompt = 'certificationReadiness for ISO 14001:2015 at ORASHI returns ready false. What else does it return?' and options = '["A readiness percentage weighted by severity, with the items that pulled it down.", "A single blocking reason, the first requirement that fails, as the earlier gates do.", "A score for each clause, with the certificate as a gate the rest of the list sits behind.", "A list of items, each with a severity, a count and a sentence, and a table of counts."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The list has eleven items across blocking, serious and watch, and a table of counts beside it. The course prints no percentage and no score for it, and ready false stands beside four blocking items.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-certification-readiness' and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for advanced m05-certification-readiness ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: advanced m05-certification-readiness ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'certificationReadiness for ISO 14001:2015 at ORASHI returns ready false. What else does it return?', options = '["A readiness percentage weighted by severity, with the items that pulled it down.", "A single blocking reason, the first requirement that fails, as the earlier gates do.", "A score for each clause, with the certificate as a gate the rest of the list sits behind.", "A list of items, each with a severity, a count and a sentence, and a table of counts."]'::jsonb, explanation = 'The list has eleven items across blocking, serious and watch, and a table of counts beside it. The course prints no percentage and no score for it, and ready false stands beside four blocking items.'
     where app_slug = 'compliance' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-certification-readiness' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: advanced m05-certification-readiness ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-certification-readiness ord 14
  select case
           when prompt = 'A report wants to state ORASHI''s readiness from covered 8 and applicable 12. What does this module ask of it?' and options = '["Quote both counts and the list items beside them, and form no fraction or percentage.", "Quote a percentage covered, rounded half up on the exact fraction as the engine does it.", "Quote covered on its own, since applicable follows from the certification cycle.", "Quote covered less the stale clause, as the effective coverage of the register."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The digest prints no percentage from these counts and neither does the engine. The list already says 3 uncovered clauses are never examined and blocking and 1 is stale and serious; a percentage would average that away.' then 'old'
           when prompt = 'A report wants to state ORASHI''s readiness from covered 8 and applicable 12. What does this module ask of it?' and options = '["Quote both counts and the list items beside them, and form no fraction or percentage.", "Quote a percentage covered, rounded half up on the exact fraction as the engine does it.", "Quote covered on its own, since applicable follows from the certification cycle.", "Quote covered less the stale clause, as the effective coverage of the register."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course prints no percentage from these counts and neither does the engine. The list already says 3 uncovered clauses are never examined and blocking and 1 is stale and serious; a percentage would average that away.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-certification-readiness' and ord = 14;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for advanced m05-certification-readiness ord 14'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: advanced m05-certification-readiness ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A report wants to state ORASHI''s readiness from covered 8 and applicable 12. What does this module ask of it?', options = '["Quote both counts and the list items beside them, and form no fraction or percentage.", "Quote a percentage covered, rounded half up on the exact fraction as the engine does it.", "Quote covered on its own, since applicable follows from the certification cycle.", "Quote covered less the stale clause, as the effective coverage of the register."]'::jsonb, explanation = 'The course prints no percentage from these counts and neither does the engine. The list already says 3 uncovered clauses are never examined and blocking and 1 is stale and serious; a percentage would average that away.'
     where app_slug = 'compliance' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-certification-readiness' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: advanced m05-certification-readiness ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-expert-reading ord 10
  select case
           when prompt = 'What do the oracles check about a gate, and what do they leave unchecked?' and options = '["They check the wording of each refusal, sentence by sentence, against a golden copy.", "They check the verdict and the wording both, for gates that name a standard.", "They check the verdict, allowed or refused, and never the wording of its reason.", "They check neither, leaving gates to the app screens that display them."]'::jsonb and answer_index = 2 and explanation is not distinct from 'Every refusal sentence in the digest is the engine''s own and is quoted rather than checked. That is why this course quotes a refusal verbatim or describes it, and never rewords one inside quotation marks.' then 'old'
           when prompt = 'What do the oracles check about a gate, and what do they leave unchecked?' and options = '["They check the wording of each refusal, sentence by sentence, against a golden copy.", "They check the verdict and the wording both, for gates that name a standard.", "They check the verdict, allowed or refused, and never the wording of its reason.", "They check neither, leaving gates to the app screens that display them."]'::jsonb and answer_index = 2 and explanation is not distinct from 'Every refusal sentence in the course is the engine''s own and is quoted rather than checked. That is why this course quotes a refusal verbatim or describes it, and never rewords one inside quotation marks.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'compliance' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, compliance refused: no row for advanced m06-the-expert-reading ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, compliance refused: advanced m06-the-expert-reading ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What do the oracles check about a gate, and what do they leave unchecked?', options = '["They check the wording of each refusal, sentence by sentence, against a golden copy.", "They check the verdict and the wording both, for gates that name a standard.", "They check the verdict, allowed or refused, and never the wording of its reason.", "They check neither, leaving gates to the app screens that display them."]'::jsonb, explanation = 'Every refusal sentence in the course is the engine''s own and is quoted rather than checked. That is why this course quotes a refusal verbatim or describes it, and never rewords one inside quotation marks.'
     where app_slug = 'compliance' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, compliance refused: advanced m06-the-expert-reading ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  select count(*) into v_total from public.academy_quiz_questions where app_slug = 'compliance';
  if v_total <> 396 then raise exception 'digest-copy recut, compliance refused: the course holds % questions, expected 396', v_total; end if;
  raise notice 'digest-copy recut, compliance: % of 64 rows updated, the rest already carried the recut text', v_updated;
end $$;
