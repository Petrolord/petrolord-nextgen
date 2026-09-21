-- ==========================================================================
-- DIGEST-COPY RECUT: portfolio, question text only.
--
-- WHY. The live bank tells learners what "the digest" prints, points at numbered
-- SECTIONs of it, or names the authors' generator. The digest is the course
-- authors' internal reference file and no learner can see it. Each row below is
-- rewritten to name what the learner has: the course, the lesson, the lab or the
-- engine. Nothing else moves: no answer index, no option order, no ord, no
-- module key, no scope, no row count. Option lengths keep their rank.
--
-- SOURCE of the new text: hand edits in the recut generator (this course has no committed bank source).
-- Rows: 1 (intermediate 1).
--
-- GUARDS. Each row is addressed by (app_slug, tier, scope, module_key, ord) and must
-- carry EITHER its published text exactly (then it is updated) OR the recut text
-- exactly (already applied, left alone). Anything else raises and the whole
-- transaction rolls back. Every update must touch exactly 1 row, and the course
-- must still hold its question count at the end. SAFE TO RE-RUN.
-- Published text was read from a replay of every question migration at origin/main
-- (docs/digest-recut/RECUT-portfolio.json carries OLD and NEW for every row).
-- ==========================================================================

do $$
declare
  v_state   text;
  v_count   integer;
  v_updated integer := 0;
  v_total   integer;
begin

  -- intermediate m05-the-s-curve ord 14
  select case
           when prompt = 'The digest draws OFON-1''s first point as "Feb 27" with the timezone pinned to UTC. Drawn in America/Los_Angeles, the same AFE labels its first point "Jan 27" and every Planned value shifts. Why (finding EC5-5)?' and options = '["The Suite converts AFE money into the viewer''s local currency, which rescales the Planned line and relabels the buckets.", "The Planned line is recomputed from today''s date in the viewer''s timezone, so a Pacific viewer sees a later as-of date.", "The engine parses the window as UTC midnight but steps months and prints labels in local time, so west of UTC the start lands on the previous evening.", "Invoices are stored in local time, and in Los Angeles the first invoice moves into January and carries the label with it, along with every Planned value that follows."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The metrics are unaffected, and Lagos, Tokyo and UTC agree with the digest''s table; a curve compared across offices can disagree on every Planned point.' then 'old'
           when prompt = 'The course draws OFON-1''s first point as "Feb 27" with the timezone pinned to UTC. Drawn in America/Los_Angeles, the same AFE labels its first point "Jan 27" and every Planned value shifts. Why (finding EC5-5)?' and options = '["The Suite converts AFE money into the viewer''s local currency, which rescales the Planned line and relabels the buckets.", "The Planned line is recomputed from today''s date in the viewer''s timezone, so a Pacific viewer sees a later as-of date.", "The engine parses the window as UTC midnight but steps months and prints labels in local time, so west of UTC the start lands on the previous evening.", "Invoices are stored in local time, and in Los Angeles the first invoice moves into January and carries the label with it, along with every Planned value that follows."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The metrics are unaffected, and Lagos, Tokyo and UTC agree with the course''s table; a curve compared across offices can disagree on every Planned point.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'portfolio' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-the-s-curve' and ord = 14;
  if v_state is null then raise exception 'digest-copy recut, portfolio refused: no row for intermediate m05-the-s-curve ord 14'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, portfolio refused: intermediate m05-the-s-curve ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course draws OFON-1''s first point as "Feb 27" with the timezone pinned to UTC. Drawn in America/Los_Angeles, the same AFE labels its first point "Jan 27" and every Planned value shifts. Why (finding EC5-5)?', options = '["The Suite converts AFE money into the viewer''s local currency, which rescales the Planned line and relabels the buckets.", "The Planned line is recomputed from today''s date in the viewer''s timezone, so a Pacific viewer sees a later as-of date.", "The engine parses the window as UTC midnight but steps months and prints labels in local time, so west of UTC the start lands on the previous evening.", "Invoices are stored in local time, and in Los Angeles the first invoice moves into January and carries the label with it, along with every Planned value that follows."]'::jsonb, explanation = 'The metrics are unaffected, and Lagos, Tokyo and UTC agree with the course''s table; a curve compared across offices can disagree on every Planned point.'
     where app_slug = 'portfolio' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-the-s-curve' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, portfolio refused: intermediate m05-the-s-curve ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  select count(*) into v_total from public.academy_quiz_questions where app_slug = 'portfolio';
  if v_total <> 396 then raise exception 'digest-copy recut, portfolio refused: the course holds % questions, expected 396', v_total; end if;
  raise notice 'digest-copy recut, portfolio: % of 1 rows updated, the rest already carried the recut text', v_updated;
end $$;
