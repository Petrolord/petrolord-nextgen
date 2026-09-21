-- ==========================================================================
-- DIGEST-COPY RECUT: riskchange, question text only.
--
-- WHY. The live bank tells learners what "the digest" prints, points at numbered
-- SECTIONs of it, or names the authors' generator. The digest is the course
-- authors' internal reference file and no learner can see it. Each row below is
-- rewritten to name what the learner has: the course, the lesson, the lab or the
-- engine. Nothing else moves: no answer index, no option order, no ord, no
-- module key, no scope, no row count. Option lengths keep their rank.
--
-- SOURCE of the new text: the regenerated bank JSON under tools/course-banks/riskchange, built from its committed .py sources.
-- Rows: 27 (beginner 3, intermediate 2, advanced 22).
--
-- GUARDS. Each row is addressed by (app_slug, tier, scope, module_key, ord) and must
-- carry EITHER its published text exactly (then it is updated) OR the recut text
-- exactly (already applied, left alone). Anything else raises and the whole
-- transaction rolls back. Every update must touch exactly 1 row, and the course
-- must still hold its question count at the end. SAFE TO RE-RUN.
-- Published text was read from a replay of every question migration at origin/main,
-- FC9's recut (#181) and the B3 engine-strings recut (#184) included, so a row either
-- of those rewrote is expected to carry THEIR text: apply them first.
-- (docs/digest-recut/RECUT-riskchange.json carries OLD and NEW for every row).
-- ==========================================================================

do $$
declare
  v_state   text;
  v_count   integer;
  v_updated integer := 0;
  v_total   integer;
begin

  -- beginner m01-what-these-engines-decide ord 4
  select case
           when prompt = 'Every date-dependent status this course quotes is true on one as-of date. Which date is it?' and options = '["2026-09-30, a Wednesday", "Whatever date the machine clock reads when the page is opened", "2026-10-01, a Thursday", "2026-10-01, a Friday"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The digest''s first line fixes the as-of date at 2026-10-01, a Thursday, and every engine call that takes a date was handed that one explicitly. None of them read a clock.' then 'old'
           when prompt = 'Every date-dependent status this course quotes is true on one as-of date. Which date is it?' and options = '["2026-09-30, a Wednesday", "Whatever date the machine clock reads when the page is opened", "2026-10-01, a Thursday", "2026-10-01, a Friday"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course fixes the as-of date at 2026-10-01, a Thursday, and every engine call that takes a date was handed that one explicitly. None of them read a clock.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'riskchange' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-these-engines-decide' and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, riskchange refused: no row for beginner m01-what-these-engines-decide ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, riskchange refused: beginner m01-what-these-engines-decide ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Every date-dependent status this course quotes is true on one as-of date. Which date is it?', options = '["2026-09-30, a Wednesday", "Whatever date the machine clock reads when the page is opened", "2026-10-01, a Thursday", "2026-10-01, a Friday"]'::jsonb, explanation = 'The course fixes the as-of date at 2026-10-01, a Thursday, and every engine call that takes a date was handed that one explicitly. None of them read a clock.'
     where app_slug = 'riskchange' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-these-engines-decide' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, riskchange refused: beginner m01-what-these-engines-decide ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m01-what-these-engines-decide ord 6
  select case
           when prompt = 'In which argument position does isReviewOverdue in riskScoring take its date?' and options = '["Argument 2", "Argument 1", "Argument 3", "It takes no date, and reads the status only"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The digest reads every signature: riskScoring''s isReviewOverdue takes its date as argument 2, and so does daysUntil in calendar. Both default that argument to the machine clock.' then 'old'
           when prompt = 'In which argument position does isReviewOverdue in riskScoring take its date?' and options = '["Argument 2", "Argument 1", "Argument 3", "It takes no date, and reads the status only"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course reads every signature: riskScoring''s isReviewOverdue takes its date as argument 2, and so does daysUntil in calendar. Both default that argument to the machine clock.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'riskchange' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-these-engines-decide' and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, riskchange refused: no row for beginner m01-what-these-engines-decide ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, riskchange refused: beginner m01-what-these-engines-decide ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'In which argument position does isReviewOverdue in riskScoring take its date?', options = '["Argument 2", "Argument 1", "Argument 3", "It takes no date, and reads the status only"]'::jsonb, explanation = 'The course reads every signature: riskScoring''s isReviewOverdue takes its date as argument 2, and so does daysUntil in calendar. Both default that argument to the machine clock.'
     where app_slug = 'riskchange' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-these-engines-decide' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, riskchange refused: beginner m01-what-these-engines-decide ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m01-what-these-engines-decide ord 8
  select case
           when prompt = 'How many of managementOfChange''s functions take a date, as the digest reads them from the engine''s signatures?' and options = '["4 functions", "7 functions", "6 functions", "1 function"]'::jsonb and answer_index = 1 and explanation is not distinct from 'managementOfChange has 7 date-taking functions, peerReview has 4, lessonsLearned has 6, and riskScoring and calendar have 1 each. The digest reads them from each signature, a parameter that defaults to the machine clock.' then 'old'
           when prompt = 'How many of managementOfChange''s functions take a date, as the course reads them from the engine''s signatures?' and options = '["4 functions", "7 functions", "6 functions", "1 function"]'::jsonb and answer_index = 1 and explanation is not distinct from 'managementOfChange has 7 date-taking functions, peerReview has 4, lessonsLearned has 6, and riskScoring and calendar have 1 each. The course reads them from each signature, a parameter that defaults to the machine clock.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'riskchange' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-these-engines-decide' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, riskchange refused: no row for beginner m01-what-these-engines-decide ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, riskchange refused: beginner m01-what-these-engines-decide ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'How many of managementOfChange''s functions take a date, as the course reads them from the engine''s signatures?', options = '["4 functions", "7 functions", "6 functions", "1 function"]'::jsonb, explanation = 'managementOfChange has 7 date-taking functions, peerReview has 4, lessonsLearned has 6, and riskScoring and calendar have 1 each. The course reads them from each signature, a parameter that defaults to the machine clock.'
     where app_slug = 'riskchange' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-these-engines-decide' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, riskchange refused: beginner m01-what-these-engines-decide ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 27
  select case
           when prompt = 'Besides the engine, what enforces decision D1?' and options = '["The database enforces the same rule.", "Nothing: it is advice to the app.", "The originator.", "The approval level."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The engine holds the rule in its assignment and deciding checks, and the digest records that the database enforces the same rule.' then 'old'
           when prompt = 'Besides the engine, what enforces decision D1?' and options = '["The database enforces the same rule.", "Nothing: it is advice to the app.", "The originator.", "The approval level."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The engine holds the rule in its assignment and deciding checks, and the course records that the database enforces the same rule.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'riskchange' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 27;
  if v_state is null then raise exception 'digest-copy recut, riskchange refused: no row for intermediate final ord 27'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, riskchange refused: intermediate final ord 27 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Besides the engine, what enforces decision D1?', options = '["The database enforces the same rule.", "Nothing: it is advice to the app.", "The originator.", "The approval level."]'::jsonb, explanation = 'The engine holds the rule in its assignment and deciding checks, and the course records that the database enforces the same rule.'
     where app_slug = 'riskchange' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 27;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, riskchange refused: intermediate final ord 27 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m03-segregation-of-duties ord 15
  select case
           when prompt = 'A report says: "The engine lets a decided approval be reopened by the assignee." What does the digest support?' and options = '["The report is right for Rejected rows, which the assignee can reopen once to answer the objection that was raised.", "The report is right, because only the assignee decides.", "None of it. The engine holds no rule for reopening, and a decided approval is refused as already decided.", "The report is right while the change is still in \"Approval\", since a reopened row goes back to Pending there."]'::jsonb and answer_index = 2 and explanation is not distinct from 'Searching for reopening, revisiting, undoing, revoking or withdrawing a decision finds 0 functions. A decided approval is refused as already approved or already rejected.' then 'old'
           when prompt = 'A report says: "The engine lets a decided approval be reopened by the assignee." What does the course support?' and options = '["The report is right for Rejected rows, which the assignee can reopen once to answer the objection that was raised.", "The report is right, because only the assignee decides.", "None of it. The engine holds no rule for reopening, and a decided approval is refused as already decided.", "The report is right while the change is still in \"Approval\", since a reopened row goes back to Pending there."]'::jsonb and answer_index = 2 and explanation is not distinct from 'Searching for reopening, revisiting, undoing, revoking or withdrawing a decision finds 0 functions. A decided approval is refused as already approved or already rejected.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'riskchange' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-segregation-of-duties' and ord = 15;
  if v_state is null then raise exception 'digest-copy recut, riskchange refused: no row for intermediate m03-segregation-of-duties ord 15'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, riskchange refused: intermediate m03-segregation-of-duties ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A report says: "The engine lets a decided approval be reopened by the assignee." What does the course support?', options = '["The report is right for Rejected rows, which the assignee can reopen once to answer the objection that was raised.", "The report is right, because only the assignee decides.", "None of it. The engine holds no rule for reopening, and a decided approval is refused as already decided.", "The report is right while the change is still in \"Approval\", since a reopened row goes back to Pending there."]'::jsonb, explanation = 'Searching for reopening, revisiting, undoing, revoking or withdrawing a decision finds 0 functions. A decided approval is refused as already approved or already rejected.'
     where app_slug = 'riskchange' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-segregation-of-duties' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, riskchange refused: intermediate m03-segregation-of-duties ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 11
  select case
           when prompt = 'Can the person whose work IK-01 examines sit in on it purely to watch?' and options = '["Yes, as an Observer, a role that judges nothing.", "No: \"The author of the work under review cannot review it.\" covers every role.", "No: \"Choose the reviewer.\"", "Yes, and while observing u-efe may also verify comments."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The author, u-efe, is refused as a Reviewer, as the Lead Reviewer and with no role given, and is refused every reviewer move on a comment. Watching judges nothing, so the digest records the author as an Observer as ALLOWED.' then 'old'
           when prompt = 'Can the person whose work IK-01 examines sit in on it purely to watch?' and options = '["Yes, as an Observer, a role that judges nothing.", "No: \"The author of the work under review cannot review it.\" covers every role.", "No: \"Choose the reviewer.\"", "Yes, and while observing u-efe may also verify comments."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The author, u-efe, is refused as a Reviewer, as the Lead Reviewer and with no role given, and is refused every reviewer move on a comment. Watching judges nothing, so the course records the author as an Observer as ALLOWED.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'riskchange' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 11;
  if v_state is null then raise exception 'digest-copy recut, riskchange refused: no row for advanced final ord 11'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, riskchange refused: advanced final ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Can the person whose work IK-01 examines sit in on it purely to watch?', options = '["Yes, as an Observer, a role that judges nothing.", "No: \"The author of the work under review cannot review it.\" covers every role.", "No: \"Choose the reviewer.\"", "Yes, and while observing u-efe may also verify comments."]'::jsonb, explanation = 'The author, u-efe, is refused as a Reviewer, as the Lead Reviewer and with no role given, and is refused every reviewer move on a comment. Watching judges nothing, so the course records the author as an Observer as ALLOWED.'
     where app_slug = 'riskchange' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, riskchange refused: advanced final ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 13
  select case
           when prompt = 'u-kemi, independent of the work, asks to verify C-03 on IK-01, a "Responded" comment with its response written. What does the engine do?' and options = '["The verification goes through for u-kemi.", "Refuses it, because only the coordinator may verify a comment on a review in \"Verification\".", "Refuses it, because u-kemi was not the reviewer who raised C-03 on the log.", "Refuses it with \"A comment cannot be verified before the author has responded to it.\""]'::jsonb and answer_index = 0 and explanation is not distinct from 'The move is legal from "Responded", a response exists, and the actor is independent of the work, so the digest records it as ALLOWED. The author verifying the same comment is refused.' then 'old'
           when prompt = 'u-kemi, independent of the work, asks to verify C-03 on IK-01, a "Responded" comment with its response written. What does the engine do?' and options = '["The verification goes through for u-kemi.", "Refuses it, because only the coordinator may verify a comment on a review in \"Verification\".", "Refuses it, because u-kemi was not the reviewer who raised C-03 on the log.", "Refuses it with \"A comment cannot be verified before the author has responded to it.\""]'::jsonb and answer_index = 0 and explanation is not distinct from 'The move is legal from "Responded", a response exists, and the actor is independent of the work, so the course records it as ALLOWED. The author verifying the same comment is refused.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'riskchange' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, riskchange refused: no row for advanced final ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, riskchange refused: advanced final ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'u-kemi, independent of the work, asks to verify C-03 on IK-01, a "Responded" comment with its response written. What does the engine do?', options = '["The verification goes through for u-kemi.", "Refuses it, because only the coordinator may verify a comment on a review in \"Verification\".", "Refuses it, because u-kemi was not the reviewer who raised C-03 on the log.", "Refuses it with \"A comment cannot be verified before the author has responded to it.\""]'::jsonb, explanation = 'The move is legal from "Responded", a response exists, and the actor is independent of the work, so the course records it as ALLOWED. The author verifying the same comment is refused.'
     where app_slug = 'riskchange' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, riskchange refused: advanced final ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 21
  select case
           when prompt = 'Who may validate ON-01, which u-musa wrote?' and options = '["u-musa, provided a colleague''s name is typed in the validator field.", "u-grace, who did not write it.", "Anybody signed in, since the lesson is already \"Published\".", "Only an external reviewer named by display name."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The digest records u-grace validating ON-01, read as if it were still "Submitted", as ALLOWED, and refuses u-musa with or without a typed colleague name.' then 'old'
           when prompt = 'Who may validate ON-01, which u-musa wrote?' and options = '["u-musa, provided a colleague''s name is typed in the validator field.", "u-grace, who did not write it.", "Anybody signed in, since the lesson is already \"Published\".", "Only an external reviewer named by display name."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course records u-grace validating ON-01, read as if it were still "Submitted", as ALLOWED, and refuses u-musa with or without a typed colleague name.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'riskchange' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 21;
  if v_state is null then raise exception 'digest-copy recut, riskchange refused: no row for advanced final ord 21'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, riskchange refused: advanced final ord 21 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Who may validate ON-01, which u-musa wrote?', options = '["u-musa, provided a colleague''s name is typed in the validator field.", "u-grace, who did not write it.", "Anybody signed in, since the lesson is already \"Published\".", "Only an external reviewer named by display name."]'::jsonb, explanation = 'The course records u-grace validating ON-01, read as if it were still "Submitted", as ALLOWED, and refuses u-musa with or without a typed colleague name.'
     where app_slug = 'riskchange' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 21;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, riskchange refused: advanced final ord 21 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 35
  select case
           when prompt = 'What does the digest hold happens when an invalid as-of date reaches daysUntil?' and options = '["It refuses with a reason the user can act on, in the usual refusal shape.", "It answers NaN, and every date rule then reads as not due.", "It falls back to the machine clock and answers for today.", "It answers 0, so every date reads as due on the as-of date."]'::jsonb and answer_index = 1 and explanation is not distinct from 'A comparison on NaN is false either way, so every date rule reads as not due. The digest lists this among the held items; nothing in this course passes an invalid date.' then 'old'
           when prompt = 'What does the course hold happens when an invalid as-of date reaches daysUntil?' and options = '["It refuses with a reason the user can act on, in the usual refusal shape.", "It answers NaN, and every date rule then reads as not due.", "It falls back to the machine clock and answers for today.", "It answers 0, so every date reads as due on the as-of date."]'::jsonb and answer_index = 1 and explanation is not distinct from 'A comparison on NaN is false either way, so every date rule reads as not due. The course lists this among the held items; nothing in this course passes an invalid date.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'riskchange' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 35;
  if v_state is null then raise exception 'digest-copy recut, riskchange refused: no row for advanced final ord 35'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, riskchange refused: advanced final ord 35 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does the course hold happens when an invalid as-of date reaches daysUntil?', options = '["It refuses with a reason the user can act on, in the usual refusal shape.", "It answers NaN, and every date rule then reads as not due.", "It falls back to the machine clock and answers for today.", "It answers 0, so every date reads as due on the as-of date."]'::jsonb, explanation = 'A comparison on NaN is false either way, so every date rule reads as not due. The course lists this among the held items; nothing in this course passes an invalid date.'
     where app_slug = 'riskchange' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 35;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, riskchange refused: advanced final ord 35 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 36
  select case
           when prompt = 'How many golden cases does the digest measure across the five files this course reads, and in how many time zones does the gate replay each?' and options = '["1037, in one time zone, the one the digest was built in.", "345, the lessonsLearned file, in five time zones.", "1037, in two time zones, Lagos and UTC.", "1037, and every case is replayed in five time zones."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The five files hold 77, 140, 291, 184 and 345 cases. The other five assurance golden files belong to Compliance, Audit & Quality.' then 'old'
           when prompt = 'How many golden cases does the course measure across the five files this course reads, and in how many time zones does the gate replay each?' and options = '["1037, in one time zone, the one the course was built in.", "345, the lessonsLearned file, in five time zones.", "1037, in two time zones, Lagos and UTC.", "1037, and every case is replayed in five time zones."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The five files hold 77, 140, 291, 184 and 345 cases. The other five assurance golden files belong to Compliance, Audit & Quality.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'riskchange' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 36;
  if v_state is null then raise exception 'digest-copy recut, riskchange refused: no row for advanced final ord 36'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, riskchange refused: advanced final ord 36 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'How many golden cases does the course measure across the five files this course reads, and in how many time zones does the gate replay each?', options = '["1037, in one time zone, the one the course was built in.", "345, the lessonsLearned file, in five time zones.", "1037, in two time zones, Lagos and UTC.", "1037, and every case is replayed in five time zones."]'::jsonb, explanation = 'The five files hold 77, 140, 291, 184 and 345 cases. The other five assurance golden files belong to Compliance, Audit & Quality.'
     where app_slug = 'riskchange' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 36;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, riskchange refused: advanced final ord 36 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 37
  select case
           when prompt = 'How many held items does the digest list, and how is each one taught?' and options = '["Four, each an owner decision taken on 2026-09-18 and held in the engine.", "Nine, each graded in a capstone field so that a learner proves the limit.", "Five, one for each golden file.", "Nine, each taught as a stated limit and graded nowhere."]'::jsonb and answer_index = 3 and explanation is not distinct from 'A held item is a rule the engines state that no owner has decided, or a behaviour that is a limit of the engine, and the digest lists nine. Each is taught as a stated limit and graded nowhere. The owner decisions are the other list: rules an owner has decided, which an engine must follow.' then 'old'
           when prompt = 'How many held items does the course list, and how is each one taught?' and options = '["Four, each an owner decision taken on 2026-09-18 and held in the engine.", "Nine, each graded in a capstone field so that a learner proves the limit.", "Five, one for each golden file.", "Nine, each taught as a stated limit and graded nowhere."]'::jsonb and answer_index = 3 and explanation is not distinct from 'A held item is a rule the engines state that no owner has decided, or a behaviour that is a limit of the engine, and the course lists nine. Each is taught as a stated limit and graded nowhere. The owner decisions are the other list: rules an owner has decided, which an engine must follow.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'riskchange' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 37;
  if v_state is null then raise exception 'digest-copy recut, riskchange refused: no row for advanced final ord 37'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, riskchange refused: advanced final ord 37 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'How many held items does the course list, and how is each one taught?', options = '["Four, each an owner decision taken on 2026-09-18 and held in the engine.", "Nine, each graded in a capstone field so that a learner proves the limit.", "Five, one for each golden file.", "Nine, each taught as a stated limit and graded nowhere."]'::jsonb, explanation = 'A held item is a rule the engines state that no owner has decided, or a behaviour that is a limit of the engine, and the course lists nine. Each is taught as a stated limit and graded nowhere. The owner decisions are the other list: rules an owner has decided, which an engine must follow.'
     where app_slug = 'riskchange' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 37;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, riskchange refused: advanced final ord 37 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 40
  select case
           when prompt = 'Agreement between an engine and its independent oracle proves what, and leaves what open?' and options = '["That the engine does what the stated rule says on those inputs; whether the rule is right stays open.", "That the rule is the right rule, since two methods reached it by different routes.", "That the held items are closed, since both methods agree on them.", "That the app displays what the engine computes."]'::jsonb and answer_index = 0 and explanation is not distinct from 'Agreement shows two methods reading the stated rule the same way on those inputs. Whether a rule is right is for the owner to decide, and the digest keeps the rules an owner has decided apart from the held items nobody has ruled on. A limit both methods share is still a limit, and what the app shows is the app''s part.' then 'old'
           when prompt = 'Agreement between an engine and its independent oracle proves what, and leaves what open?' and options = '["That the engine does what the stated rule says on those inputs; whether the rule is right stays open.", "That the rule is the right rule, since two methods reached it by different routes.", "That the held items are closed, since both methods agree on them.", "That the app displays what the engine computes."]'::jsonb and answer_index = 0 and explanation is not distinct from 'Agreement shows two methods reading the stated rule the same way on those inputs. Whether a rule is right is for the owner to decide, and the course keeps the rules an owner has decided apart from the held items nobody has ruled on. A limit both methods share is still a limit, and what the app shows is the app''s part.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'riskchange' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 40;
  if v_state is null then raise exception 'digest-copy recut, riskchange refused: no row for advanced final ord 40'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, riskchange refused: advanced final ord 40 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Agreement between an engine and its independent oracle proves what, and leaves what open?', options = '["That the engine does what the stated rule says on those inputs; whether the rule is right stays open.", "That the rule is the right rule, since two methods reached it by different routes.", "That the held items are closed, since both methods agree on them.", "That the app displays what the engine computes."]'::jsonb, explanation = 'Agreement shows two methods reading the stated rule the same way on those inputs. Whether a rule is right is for the owner to decide, and the course keeps the rules an owner has decided apart from the held items nobody has ruled on. A limit both methods share is still a limit, and what the app shows is the app''s part.'
     where app_slug = 'riskchange' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 40;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, riskchange refused: advanced final ord 40 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m01-the-comment-loop ord 2
  select case
           when prompt = 'With six comment statuses there are 36 ordered pairs of a status and a status to move to. How many of those pairs does the engine hold as legal moves?' and options = '["7, which are exactly the entries of the legal-move table in the engine.", "6, one legal move out of each of the six statuses.", "12, two legal moves out of each of the six statuses in turn.", "9, because \"Open\", \"Responded\" and \"Rejected\" have two exits each and \"Verified\" has three."]'::jsonb and answer_index = 0 and explanation is not distinct from '"Closed" and "Withdrawn" have no exit at all. "Open" and "Rejected" each have two, "Responded" has two and "Verified" has one: 2 + 2 + 2 + 1 gives the 7 legal moves the digest counts.' then 'old'
           when prompt = 'With six comment statuses there are 36 ordered pairs of a status and a status to move to. How many of those pairs does the engine hold as legal moves?' and options = '["7, which are exactly the entries of the legal-move table in the engine.", "6, one legal move out of each of the six statuses.", "12, two legal moves out of each of the six statuses in turn.", "9, because \"Open\", \"Responded\" and \"Rejected\" have two exits each and \"Verified\" has three."]'::jsonb and answer_index = 0 and explanation is not distinct from '"Closed" and "Withdrawn" have no exit at all. "Open" and "Rejected" each have two, "Responded" has two and "Verified" has one: 2 + 2 + 2 + 1 gives the 7 legal moves the course counts.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'riskchange' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-comment-loop' and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, riskchange refused: no row for advanced m01-the-comment-loop ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, riskchange refused: advanced m01-the-comment-loop ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'With six comment statuses there are 36 ordered pairs of a status and a status to move to. How many of those pairs does the engine hold as legal moves?', options = '["7, which are exactly the entries of the legal-move table in the engine.", "6, one legal move out of each of the six statuses.", "12, two legal moves out of each of the six statuses in turn.", "9, because \"Open\", \"Responded\" and \"Rejected\" have two exits each and \"Verified\" has three."]'::jsonb, explanation = '"Closed" and "Withdrawn" have no exit at all. "Open" and "Rejected" each have two, "Responded" has two and "Verified" has one: 2 + 2 + 2 + 1 gives the 7 legal moves the course counts.'
     where app_slug = 'riskchange' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-comment-loop' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, riskchange refused: advanced m01-the-comment-loop ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m02-closing-a-review ord 5
  select case
           when prompt = 'IK-01''s blocking comments are withdrawn. C-06 ("Minor"), C-07 ("Editorial") and C-09 (no severity) are still "Open". May the review close?' and options = '["Yes: the close is allowed with those three still open.", "No: 3 open comments remain, and a review waits for every open comment before it closes.", "No: C-09 carries no severity, so the engine reads it as \"Critical\" and it blocks the close.", "No: the close waits until the coordinator has closed out C-02 and C-08 first."]'::jsonb and answer_index = 0 and explanation is not distinct from 'Only "Critical" and "Major" block. The digest records the close as ALLOWED with a Minor, an Editorial and an unrated comment still Open. Verified comments waiting on the coordinator hold nothing open either, because they are resolved.' then 'old'
           when prompt = 'IK-01''s blocking comments are withdrawn. C-06 ("Minor"), C-07 ("Editorial") and C-09 (no severity) are still "Open". May the review close?' and options = '["Yes: the close is allowed with those three still open.", "No: 3 open comments remain, and a review waits for every open comment before it closes.", "No: C-09 carries no severity, so the engine reads it as \"Critical\" and it blocks the close.", "No: the close waits until the coordinator has closed out C-02 and C-08 first."]'::jsonb and answer_index = 0 and explanation is not distinct from 'Only "Critical" and "Major" block. The course records the close as ALLOWED with a Minor, an Editorial and an unrated comment still Open. Verified comments waiting on the coordinator hold nothing open either, because they are resolved.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'riskchange' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-closing-a-review' and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, riskchange refused: no row for advanced m02-closing-a-review ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, riskchange refused: advanced m02-closing-a-review ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'IK-01''s blocking comments are withdrawn. C-06 ("Minor"), C-07 ("Editorial") and C-09 (no severity) are still "Open". May the review close?', options = '["Yes: the close is allowed with those three still open.", "No: 3 open comments remain, and a review waits for every open comment before it closes.", "No: C-09 carries no severity, so the engine reads it as \"Critical\" and it blocks the close.", "No: the close waits until the coordinator has closed out C-02 and C-08 first."]'::jsonb, explanation = 'Only "Critical" and "Major" block. The course records the close as ALLOWED with a Minor, an Editorial and an unrated comment still Open. Verified comments waiting on the coordinator hold nothing open either, because they are resolved.'
     where app_slug = 'riskchange' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-closing-a-review' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, riskchange refused: advanced m02-closing-a-review ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m02-closing-a-review ord 15
  select case
           when prompt = 'An external reviewer is put on IK-01 named only by display name. What does the engine do, and what does that show about the independence rule?' and options = '["It refuses, because every reviewer has to be a signed-in user of the app.", "It allows the reviewer, since a display name alone cannot be matched to the author, and the digest holds that as a limit.", "It refuses with \"Choose the reviewer.\", because a display name alone names nobody.", "It allows the reviewer as an Observer only, so nothing on the review can be judged by them."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The digest records the external reviewer as ALLOWED and lists the limit among the held items: a reviewer named by display name only cannot be matched to the author, and a review with no author recorded cannot be checked either.' then 'old'
           when prompt = 'An external reviewer is put on IK-01 named only by display name. What does the engine do, and what does that show about the independence rule?' and options = '["It refuses, because every reviewer has to be a signed-in user of the app.", "It allows the reviewer, since a display name alone cannot be matched to the author, and the course holds that as a limit.", "It refuses with \"Choose the reviewer.\", because a display name alone names nobody.", "It allows the reviewer as an Observer only, so nothing on the review can be judged by them."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course records the external reviewer as ALLOWED and lists the limit among the held items: a reviewer named by display name only cannot be matched to the author, and a review with no author recorded cannot be checked either.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'riskchange' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-closing-a-review' and ord = 15;
  if v_state is null then raise exception 'digest-copy recut, riskchange refused: no row for advanced m02-closing-a-review ord 15'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, riskchange refused: advanced m02-closing-a-review ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'An external reviewer is put on IK-01 named only by display name. What does the engine do, and what does that show about the independence rule?', options = '["It refuses, because every reviewer has to be a signed-in user of the app.", "It allows the reviewer, since a display name alone cannot be matched to the author, and the course holds that as a limit.", "It refuses with \"Choose the reviewer.\", because a display name alone names nobody.", "It allows the reviewer as an Observer only, so nothing on the review can be judged by them."]'::jsonb, explanation = 'The course records the external reviewer as ALLOWED and lists the limit among the held items: a reviewer named by display name only cannot be matched to the author, and a review with no author recorded cannot be checked either.'
     where app_slug = 'riskchange' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-closing-a-review' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, riskchange refused: advanced m02-closing-a-review ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m03-a-lesson-and-its-validation ord 10
  select case
           when prompt = 'u-grace, signed in and not the author of ON-01, records an external reviewer by name while validating it. What does the engine do?' and options = '["It refuses, because a typed name is only accepted when the author records it.", "It allows it: u-grace is the actor, and the typed name records who else looked at the lesson.", "It refuses, because an external reviewer has to be signed in to the app to be recorded.", "It allows it and records the external reviewer as the actor, with u-grace as a witness beside the name."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The digest records u-grace recording an external reviewer by name as ALLOWED. The actor is independent of the lesson, and the typed name adds who else looked at it, which is the legitimate use of the field.' then 'old'
           when prompt = 'u-grace, signed in and not the author of ON-01, records an external reviewer by name while validating it. What does the engine do?' and options = '["It refuses, because a typed name is only accepted when the author records it.", "It allows it: u-grace is the actor, and the typed name records who else looked at the lesson.", "It refuses, because an external reviewer has to be signed in to the app to be recorded.", "It allows it and records the external reviewer as the actor, with u-grace as a witness beside the name."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course records u-grace recording an external reviewer by name as ALLOWED. The actor is independent of the lesson, and the typed name adds who else looked at it, which is the legitimate use of the field.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'riskchange' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-a-lesson-and-its-validation' and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, riskchange refused: no row for advanced m03-a-lesson-and-its-validation ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, riskchange refused: advanced m03-a-lesson-and-its-validation ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'u-grace, signed in and not the author of ON-01, records an external reviewer by name while validating it. What does the engine do?', options = '["It refuses, because a typed name is only accepted when the author records it.", "It allows it: u-grace is the actor, and the typed name records who else looked at the lesson.", "It refuses, because an external reviewer has to be signed in to the app to be recorded.", "It allows it and records the external reviewer as the actor, with u-grace as a witness beside the name."]'::jsonb, explanation = 'The course records u-grace recording an external reviewer by name as ALLOWED. The actor is independent of the lesson, and the typed name adds who else looked at it, which is the legitimate use of the field.'
     where app_slug = 'riskchange' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-a-lesson-and-its-validation' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, riskchange refused: advanced m03-a-lesson-and-its-validation ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m03-a-lesson-and-its-validation ord 13
  select case
           when prompt = 'Publishing a lesson checks for a validation record. Which limit does the digest list among the held items for that step?' and options = '["Publishing does not check that a validation record exists at all.", "Publishing does not check a second time who validated the lesson.", "Publishing does not check whether the lesson has substance.", "Publishing checks the validator again and refuses the author."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The independence check sits where the validation is recorded. Publishing relies on it having been enforced there, and the digest lists that as a stated limit of the engine.' then 'old'
           when prompt = 'Publishing a lesson checks for a validation record. Which limit does the course list among the held items for that step?' and options = '["Publishing does not check that a validation record exists at all.", "Publishing does not check a second time who validated the lesson.", "Publishing does not check whether the lesson has substance.", "Publishing checks the validator again and refuses the author."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The independence check sits where the validation is recorded. Publishing relies on it having been enforced there, and the course lists that as a stated limit of the engine.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'riskchange' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-a-lesson-and-its-validation' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, riskchange refused: no row for advanced m03-a-lesson-and-its-validation ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, riskchange refused: advanced m03-a-lesson-and-its-validation ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Publishing a lesson checks for a validation record. Which limit does the course list among the held items for that step?', options = '["Publishing does not check that a validation record exists at all.", "Publishing does not check a second time who validated the lesson.", "Publishing does not check whether the lesson has substance.", "Publishing checks the validator again and refuses the author."]'::jsonb, explanation = 'The independence check sits where the validation is recorded. Publishing relies on it having been enforced there, and the course lists that as a stated limit of the engine.'
     where app_slug = 'riskchange' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-a-lesson-and-its-validation' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, riskchange refused: advanced m03-a-lesson-and-its-validation ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m04-proof-of-use ord 13
  select case
           when prompt = 'Somebody logs that a lesson was turned down for a procedure, names the procedure, and writes nothing about why. What does the engine say?' and options = '["\"Say why it was not adopted. A rejection is a decision, and the next person to read this lesson needs the reasoning.\"", "\"Was the lesson adopted, adapted, or rejected?\", because a rejection with no reason is an outcome the register does not know.", "\"Pick what this lesson was applied to.\", since a rejection has no target in the engine''s reading of it.", "Nothing: a rejection changes nothing, so the engine records it as it stands with no reason attached to it."]'::jsonb and answer_index = 0 and explanation is not distinct from 'A rejection must carry its reason. With the reason, the digest records the rejection as ALLOWED. The question about adopted, adapted or rejected is the refusal for an outcome the register does not know.' then 'old'
           when prompt = 'Somebody logs that a lesson was turned down for a procedure, names the procedure, and writes nothing about why. What does the engine say?' and options = '["\"Say why it was not adopted. A rejection is a decision, and the next person to read this lesson needs the reasoning.\"", "\"Was the lesson adopted, adapted, or rejected?\", because a rejection with no reason is an outcome the register does not know.", "\"Pick what this lesson was applied to.\", since a rejection has no target in the engine''s reading of it.", "Nothing: a rejection changes nothing, so the engine records it as it stands with no reason attached to it."]'::jsonb and answer_index = 0 and explanation is not distinct from 'A rejection must carry its reason. With the reason, the course records the rejection as ALLOWED. The question about adopted, adapted or rejected is the refusal for an outcome the register does not know.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'riskchange' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-proof-of-use' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, riskchange refused: no row for advanced m04-proof-of-use ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, riskchange refused: advanced m04-proof-of-use ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Somebody logs that a lesson was turned down for a procedure, names the procedure, and writes nothing about why. What does the engine say?', options = '["\"Say why it was not adopted. A rejection is a decision, and the next person to read this lesson needs the reasoning.\"", "\"Was the lesson adopted, adapted, or rejected?\", because a rejection with no reason is an outcome the register does not know.", "\"Pick what this lesson was applied to.\", since a rejection has no target in the engine''s reading of it.", "Nothing: a rejection changes nothing, so the engine records it as it stands with no reason attached to it."]'::jsonb, explanation = 'A rejection must carry its reason. With the reason, the course records the rejection as ALLOWED. The question about adopted, adapted or rejected is the refusal for an outcome the register does not know.'
     where app_slug = 'riskchange' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-proof-of-use' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, riskchange refused: advanced m04-proof-of-use ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-what-the-engines-do-not-know ord 8
  select case
           when prompt = 'The application counts in the lessons summary carry a stated limit. Which one does the digest list among the held items?' and options = '["They leave out rejections.", "They count only the visible lessons'' applications, like lessonsApplied does.", "They include applications on lessons that are not visible.", "They count each lesson once, however many applications it has on its log."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The lesson counts beside them, lessonsApplied and lessonsUnapplied, cover visible lessons only. The application counts do not narrow the same way, and the digest lists that as a held item taught as a limit and graded nowhere.' then 'old'
           when prompt = 'The application counts in the lessons summary carry a stated limit. Which one does the course list among the held items?' and options = '["They leave out rejections.", "They count only the visible lessons'' applications, like lessonsApplied does.", "They include applications on lessons that are not visible.", "They count each lesson once, however many applications it has on its log."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The lesson counts beside them, lessonsApplied and lessonsUnapplied, cover visible lessons only. The application counts do not narrow the same way, and the course lists that as a held item taught as a limit and graded nowhere.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'riskchange' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-what-the-engines-do-not-know' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, riskchange refused: no row for advanced m05-what-the-engines-do-not-know ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, riskchange refused: advanced m05-what-the-engines-do-not-know ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The application counts in the lessons summary carry a stated limit. Which one does the course list among the held items?', options = '["They leave out rejections.", "They count only the visible lessons'' applications, like lessonsApplied does.", "They include applications on lessons that are not visible.", "They count each lesson once, however many applications it has on its log."]'::jsonb, explanation = 'The lesson counts beside them, lessonsApplied and lessonsUnapplied, cover visible lessons only. The application counts do not narrow the same way, and the course lists that as a held item taught as a limit and graded nowhere.'
     where app_slug = 'riskchange' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-what-the-engines-do-not-know' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, riskchange refused: advanced m05-what-the-engines-do-not-know ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-what-the-engines-do-not-know ord 9
  select case
           when prompt = 'A peer review summary is handed a comment whose review is missing from the list of reviews. What does the digest hold it does?' and options = '["It drops the comment from every count, because nothing can be read without its review.", "It refuses the whole summary until the missing review is added to the list it was handed.", "It counts the comment in the total only.", "It still counts the comment as open work, as an MOC action with an unknown change does."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The summary keeps a finished review''s comments out of the open and blocking counts only when it can see the review. A comment it cannot place is counted as open work, and the digest lists that as a held item.' then 'old'
           when prompt = 'A peer review summary is handed a comment whose review is missing from the list of reviews. What does the course hold it does?' and options = '["It drops the comment from every count, because nothing can be read without its review.", "It refuses the whole summary until the missing review is added to the list it was handed.", "It counts the comment in the total only.", "It still counts the comment as open work, as an MOC action with an unknown change does."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The summary keeps a finished review''s comments out of the open and blocking counts only when it can see the review. A comment it cannot place is counted as open work, and the course lists that as a held item.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'riskchange' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-what-the-engines-do-not-know' and ord = 9;
  if v_state is null then raise exception 'digest-copy recut, riskchange refused: no row for advanced m05-what-the-engines-do-not-know ord 9'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, riskchange refused: advanced m05-what-the-engines-do-not-know ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A peer review summary is handed a comment whose review is missing from the list of reviews. What does the course hold it does?', options = '["It drops the comment from every count, because nothing can be read without its review.", "It refuses the whole summary until the missing review is added to the list it was handed.", "It counts the comment in the total only.", "It still counts the comment as open work, as an MOC action with an unknown change does."]'::jsonb, explanation = 'The summary keeps a finished review''s comments out of the open and blocking counts only when it can see the review. A comment it cannot place is counted as open work, and the course lists that as a held item.'
     where app_slug = 'riskchange' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-what-the-engines-do-not-know' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, riskchange refused: advanced m05-what-the-engines-do-not-know ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-what-the-engines-do-not-know ord 12
  select case
           when prompt = 'The digest measures peerReview_cases.json by reading it. What does it record for cases, cases carrying a repaired marker, and functions exercised?' and options = '["345, 19 and 26.", "184, 17 and 38.", "184, 38 and 17.", "291, 69 and 15."]'::jsonb and answer_index = 2 and explanation is not distinct from '345, 19 and 26 are lessonsLearned_cases.json, and 291, 69 and 15 are managementOfChange_cases.json. Golden cases total 1037 across the five files, and the gate replays every case in five time zones.' then 'old'
           when prompt = 'The course measures peerReview_cases.json by reading it. What does it record for cases, cases carrying a repaired marker, and functions exercised?' and options = '["345, 19 and 26.", "184, 17 and 38.", "184, 38 and 17.", "291, 69 and 15."]'::jsonb and answer_index = 2 and explanation is not distinct from '345, 19 and 26 are lessonsLearned_cases.json, and 291, 69 and 15 are managementOfChange_cases.json. Golden cases total 1037 across the five files, and the gate replays every case in five time zones.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'riskchange' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-what-the-engines-do-not-know' and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, riskchange refused: no row for advanced m05-what-the-engines-do-not-know ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, riskchange refused: advanced m05-what-the-engines-do-not-know ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course measures peerReview_cases.json by reading it. What does it record for cases, cases carrying a repaired marker, and functions exercised?', options = '["345, 19 and 26.", "184, 17 and 38.", "184, 38 and 17.", "291, 69 and 15."]'::jsonb, explanation = '345, 19 and 26 are lessonsLearned_cases.json, and 291, 69 and 15 are managementOfChange_cases.json. Golden cases total 1037 across the five files, and the gate replays every case in five time zones.'
     where app_slug = 'riskchange' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-what-the-engines-do-not-know' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, riskchange refused: advanced m05-what-the-engines-do-not-know ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-what-the-engines-do-not-know ord 13
  select case
           when prompt = 'A golden case and the oracle bridge both check the engine. On which records does each check it?' and options = '["Both on this course''s records, the golden case in five zones and the bridge in one zone.", "A golden case on this course''s records; the bridge on the records the oracle author chose.", "A golden case on the records the oracle author chose; the bridge on this course''s records.", "Both on the oracle author''s records, replayed from the golden files."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The bridge, oracle_bridge.py, replays every engine answer in the digest, IKANG and ONNE included. A defect that shows on only one record slips past a check that never meets it, which is why both exist.' then 'old'
           when prompt = 'A golden case and the oracle bridge both check the engine. On which records does each check it?' and options = '["Both on this course''s records, the golden case in five zones and the bridge in one zone.", "A golden case on this course''s records; the bridge on the records the oracle author chose.", "A golden case on the records the oracle author chose; the bridge on this course''s records.", "Both on the oracle author''s records, replayed from the golden files."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The bridge, oracle_bridge.py, replays every engine answer in the course, IKANG and ONNE included. A defect that shows on only one record slips past a check that never meets it, which is why both exist.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'riskchange' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-what-the-engines-do-not-know' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, riskchange refused: no row for advanced m05-what-the-engines-do-not-know ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, riskchange refused: advanced m05-what-the-engines-do-not-know ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A golden case and the oracle bridge both check the engine. On which records does each check it?', options = '["Both on this course''s records, the golden case in five zones and the bridge in one zone.", "A golden case on this course''s records; the bridge on the records the oracle author chose.", "A golden case on the records the oracle author chose; the bridge on this course''s records.", "Both on the oracle author''s records, replayed from the golden files."]'::jsonb, explanation = 'The bridge, oracle_bridge.py, replays every engine answer in the course, IKANG and ONNE included. A defect that shows on only one record slips past a check that never meets it, which is why both exist.'
     where app_slug = 'riskchange' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-what-the-engines-do-not-know' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, riskchange refused: advanced m05-what-the-engines-do-not-know ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-what-the-engines-do-not-know ord 14
  select case
           when prompt = 'A change has finished, and one of its actions still reads "Open". What do openActions and overdueActions do with that action today?' and options = '["They count it as open work until the action itself reads \"Complete\" or \"Cancelled\".", "They skip it only on a change in the Closed stage, and count it on a Cancelled one.", "They skip it, as they skip an action whose change is not in the register.", "They skip it: a finished change is locked, so its actions are not open work."]'::jsonb and answer_index = 3 and explanation is not distinct from 'On 2026-10-01 the summary skips AC-06 and AC-07, whose changes, ES-06 in the Closed stage and ES-09 "Cancelled", are finished and locked, and a probe on the "Rejected" ES-11 counts its open action nowhere. AC-09, whose change is not in the register, still counts, and the digest holds that as a limit.' then 'old'
           when prompt = 'A change has finished, and one of its actions still reads "Open". What do openActions and overdueActions do with that action today?' and options = '["They count it as open work until the action itself reads \"Complete\" or \"Cancelled\".", "They skip it only on a change in the Closed stage, and count it on a Cancelled one.", "They skip it, as they skip an action whose change is not in the register.", "They skip it: a finished change is locked, so its actions are not open work."]'::jsonb and answer_index = 3 and explanation is not distinct from 'On 2026-10-01 the summary skips AC-06 and AC-07, whose changes, ES-06 in the Closed stage and ES-09 "Cancelled", are finished and locked, and a probe on the "Rejected" ES-11 counts its open action nowhere. AC-09, whose change is not in the register, still counts, and the course holds that as a limit.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'riskchange' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-what-the-engines-do-not-know' and ord = 14;
  if v_state is null then raise exception 'digest-copy recut, riskchange refused: no row for advanced m05-what-the-engines-do-not-know ord 14'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, riskchange refused: advanced m05-what-the-engines-do-not-know ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A change has finished, and one of its actions still reads "Open". What do openActions and overdueActions do with that action today?', options = '["They count it as open work until the action itself reads \"Complete\" or \"Cancelled\".", "They skip it only on a change in the Closed stage, and count it on a Cancelled one.", "They skip it, as they skip an action whose change is not in the register.", "They skip it: a finished change is locked, so its actions are not open work."]'::jsonb, explanation = 'On 2026-10-01 the summary skips AC-06 and AC-07, whose changes, ES-06 in the Closed stage and ES-09 "Cancelled", are finished and locked, and a probe on the "Rejected" ES-11 counts its open action nowhere. AC-09, whose change is not in the register, still counts, and the course holds that as a limit.'
     where app_slug = 'riskchange' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-what-the-engines-do-not-know' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, riskchange refused: advanced m05-what-the-engines-do-not-know ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-what-the-engines-do-not-know ord 15
  select case
           when prompt = 'Today, how does the peer review summary count an unresolved "Critical" comment that sits on a "Cancelled" review?' and options = '["In the comment total and its severity and status columns, and in neither the open nor the blocking count.", "In the open and blocking counts for as long as it stays unresolved, whatever its review''s stage.", "Nowhere at all, the comment total included, because its review is locked.", "In the open count and not the blocking count, because nobody can resolve it."]'::jsonb and answer_index = 0 and explanation is not distinct from 'A "Cancelled" review is locked, and nobody can move a comment on it, so a work count that included one could never fall. The summary lists such a comment in every column that describes the log and leaves it out of the counts of work still owed. The digest''s case is C-10 on IK-04.' then 'old'
           when prompt = 'Today, how does the peer review summary count an unresolved "Critical" comment that sits on a "Cancelled" review?' and options = '["In the comment total and its severity and status columns, and in neither the open nor the blocking count.", "In the open and blocking counts for as long as it stays unresolved, whatever its review''s stage.", "Nowhere at all, the comment total included, because its review is locked.", "In the open count and not the blocking count, because nobody can resolve it."]'::jsonb and answer_index = 0 and explanation is not distinct from 'A "Cancelled" review is locked, and nobody can move a comment on it, so a work count that included one could never fall. The summary lists such a comment in every column that describes the log and leaves it out of the counts of work still owed. The course''s case is C-10 on IK-04.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'riskchange' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-what-the-engines-do-not-know' and ord = 15;
  if v_state is null then raise exception 'digest-copy recut, riskchange refused: no row for advanced m05-what-the-engines-do-not-know ord 15'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, riskchange refused: advanced m05-what-the-engines-do-not-know ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Today, how does the peer review summary count an unresolved "Critical" comment that sits on a "Cancelled" review?', options = '["In the comment total and its severity and status columns, and in neither the open nor the blocking count.", "In the open and blocking counts for as long as it stays unresolved, whatever its review''s stage.", "Nowhere at all, the comment total included, because its review is locked.", "In the open count and not the blocking count, because nobody can resolve it."]'::jsonb, explanation = 'A "Cancelled" review is locked, and nobody can move a comment on it, so a work count that included one could never fall. The summary lists such a comment in every column that describes the log and leaves it out of the counts of work still owed. The course''s case is C-10 on IK-04.'
     where app_slug = 'riskchange' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-what-the-engines-do-not-know' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, riskchange refused: advanced m05-what-the-engines-do-not-know ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-expert-reading ord 3
  select case
           when prompt = 'AA-01 records ON-01 going into the risk register. What must that application carry for the engine to record it?' and options = '["The risk it points at, OB-07, so the trail can be walked from the lesson to the row and back.", "Only its outcome, since a risk register target is a Suite register the engine already knows.", "The residual score of the risk at the time the lesson was applied.", "A reference to a procedure, as every application outside the Suite needs."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The digest records an application into the risk register that names the risk as ALLOWED, and refuses one that names no risk. Both ends carry a key: the lesson names the row, and the row is a record with its own state.' then 'old'
           when prompt = 'AA-01 records ON-01 going into the risk register. What must that application carry for the engine to record it?' and options = '["The risk it points at, OB-07, so the trail can be walked from the lesson to the row and back.", "Only its outcome, since a risk register target is a Suite register the engine already knows.", "The residual score of the risk at the time the lesson was applied.", "A reference to a procedure, as every application outside the Suite needs."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course records an application into the risk register that names the risk as ALLOWED, and refuses one that names no risk. Both ends carry a key: the lesson names the row, and the row is a record with its own state.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'riskchange' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, riskchange refused: no row for advanced m06-the-expert-reading ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, riskchange refused: advanced m06-the-expert-reading ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'AA-01 records ON-01 going into the risk register. What must that application carry for the engine to record it?', options = '["The risk it points at, OB-07, so the trail can be walked from the lesson to the row and back.", "Only its outcome, since a risk register target is a Suite register the engine already knows.", "The residual score of the risk at the time the lesson was applied.", "A reference to a procedure, as every application outside the Suite needs."]'::jsonb, explanation = 'The course records an application into the risk register that names the risk as ALLOWED, and refuses one that names no risk. Both ends carry a key: the lesson names the row, and the row is a record with its own state.'
     where app_slug = 'riskchange' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, riskchange refused: advanced m06-the-expert-reading ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-expert-reading ord 12
  select case
           when prompt = 'Segregation of duties in peer review, the author never reviewing the work, is held where today?' and options = '["In the app and the database already, with the engine following later.", "In the engine; the app and the database follow with the Suite pull request that ships ASC-0.", "In the database only, as a constraint on who can be put on a review.", "Nowhere yet: it is listed among the held items as a limit."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The engine enforces the rule now, from ASC-0, as owner decision D1 applied to peer review. A lesson that told a learner the app already refuses the author would be teaching something the digest does not say.' then 'old'
           when prompt = 'Segregation of duties in peer review, the author never reviewing the work, is held where today?' and options = '["In the app and the database already, with the engine following later.", "In the engine; the app and the database follow with the Suite pull request that ships ASC-0.", "In the database only, as a constraint on who can be put on a review.", "Nowhere yet: it is listed among the held items as a limit."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The engine enforces the rule now, from ASC-0, as owner decision D1 applied to peer review. A lesson that told a learner the app already refuses the author would be teaching something the course does not say.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'riskchange' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, riskchange refused: no row for advanced m06-the-expert-reading ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, riskchange refused: advanced m06-the-expert-reading ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Segregation of duties in peer review, the author never reviewing the work, is held where today?', options = '["In the app and the database already, with the engine following later.", "In the engine; the app and the database follow with the Suite pull request that ships ASC-0.", "In the database only, as a constraint on who can be put on a review.", "Nowhere yet: it is listed among the held items as a limit."]'::jsonb, explanation = 'The engine enforces the rule now, from ASC-0, as owner decision D1 applied to peer review. A lesson that told a learner the app already refuses the author would be teaching something the course does not say.'
     where app_slug = 'riskchange' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, riskchange refused: advanced m06-the-expert-reading ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-expert-reading ord 14
  select case
           when prompt = 'The Lessons Learned dashboard and the ONNE register on 2026-10-01: what does the digest record about reviewsOverdue and reviewsDueSoon?' and options = '["The dashboard displays them, and the engine leaves both uncomputed on this register.", "They read 1 and 2; the dashboard computes both and shows neither.", "The engine computes them as 2 and 1, and the dashboard shows only the first of the two.", "Neither is computed, because the dashboard reads lessons one at a time."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The engine''s summary reads reviewsOverdue 1 and reviewsDueSoon 2 on the ONNE register. The digest records beside them that the dashboard computes both and displays neither: the engine answers, and whether a user sees the answer is the app''s part.' then 'old'
           when prompt = 'The Lessons Learned dashboard and the ONNE register on 2026-10-01: what does the course record about reviewsOverdue and reviewsDueSoon?' and options = '["The dashboard displays them, and the engine leaves both uncomputed on this register.", "They read 1 and 2; the dashboard computes both and shows neither.", "The engine computes them as 2 and 1, and the dashboard shows only the first of the two.", "Neither is computed, because the dashboard reads lessons one at a time."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The engine''s summary reads reviewsOverdue 1 and reviewsDueSoon 2 on the ONNE register. The course records beside them that the dashboard computes both and displays neither: the engine answers, and whether a user sees the answer is the app''s part.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'riskchange' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 14;
  if v_state is null then raise exception 'digest-copy recut, riskchange refused: no row for advanced m06-the-expert-reading ord 14'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, riskchange refused: advanced m06-the-expert-reading ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The Lessons Learned dashboard and the ONNE register on 2026-10-01: what does the course record about reviewsOverdue and reviewsDueSoon?', options = '["The dashboard displays them, and the engine leaves both uncomputed on this register.", "They read 1 and 2; the dashboard computes both and shows neither.", "The engine computes them as 2 and 1, and the dashboard shows only the first of the two.", "Neither is computed, because the dashboard reads lessons one at a time."]'::jsonb, explanation = 'The engine''s summary reads reviewsOverdue 1 and reviewsDueSoon 2 on the ONNE register. The course records beside them that the dashboard computes both and displays neither: the engine answers, and whether a user sees the answer is the app''s part.'
     where app_slug = 'riskchange' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, riskchange refused: advanced m06-the-expert-reading ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  select count(*) into v_total from public.academy_quiz_questions where app_slug = 'riskchange';
  if v_total <> 396 then raise exception 'digest-copy recut, riskchange refused: the course holds % questions, expected 396', v_total; end if;
  raise notice 'digest-copy recut, riskchange: % of 27 rows updated, the rest already carried the recut text', v_updated;
end $$;
