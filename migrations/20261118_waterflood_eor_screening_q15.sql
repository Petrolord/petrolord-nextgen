-- ==========================================================================
-- WATERFLOOD EXPERT, m05 question 15: EOR screening now exists in the Suite.
--
-- WHY. The question as seeded by 20260828_rc4_waterflood_expert_deep.sql
-- (line 166) keyed the answer "There is no validated central EOR screening
-- engine". That stopped being true on 2026-10-05, when the Suite's EOR
-- Screening app (petrolord-suite main 740fbc559, /dashboard/apps/reservoir/
-- eor-screening) went live: it screens against Taber, Martin and Seright
-- 1997, Parts 1 and 2, with every limit read from the page images and a gate
-- at, inside and beyond each published limit, plus a CO2 minimum miscibility
-- pressure check from Zhu et al. 2025 (ACS Omega 10(47)) that reproduces the
-- paper's own error figures. The lesson it tests
-- (src/content/courses/waterflood/advanced/m05-forecast-against-field/
-- l04-eor-is-a-different-question.md) is rewritten in the same PR. The
-- teaching point stays: EOR is a different question from waterflood design,
-- and screening is a shortlist, short of a design.
--
-- WHAT CHANGES. One row, addressed by (app_slug, tier, scope, module_key,
-- ord): prompt, options, answer_index (stays 2) and explanation. The old
-- answer becomes a distractor in its updated, false form ("the Suite has no
-- validated EOR screening engine yet"), replacing the Craig and
-- Dyes-Caudle-Erickson distractor. The correct option is third by length of
-- four (100, 113, 120, 133 characters), so it carries no length tell.
-- The course keeps its 132 advanced questions.
--
-- GUARDS. The row must match EITHER its published form (md5 of prompt,
-- explanation and options::text as read from production on 2026-10-05, and
-- answer_index 2), and is then updated, OR its new form, and is then left
-- alone. Anything else raises and the whole transaction rolls back. Exactly
-- one row is updated. SAFE TO RE-RUN.
--
-- No transaction lines of its own (the runner wraps it). Not applied: see
-- MIGRATIONS.md.
-- ==========================================================================

do $$
declare
  v_state text;
  v_count integer;
  v_total integer;
begin
  select case
           when md5(prompt) = '46b0070a83165994ec6ec0df8f3bbb0a'
            and md5(coalesce(explanation, '')) = 'f10688e3ace053e9881e58bb8b644172'
            and md5(options::text) = '92cf5ba9da984a9d08513f92b706a896'
            and answer_index = 2 then 'old'
           when md5(prompt) = 'afa3b610313f1748b6df78894894ea02'
            and md5(coalesce(explanation, '')) = '2aed75d0aca2722d90936baa94237fb5'
            and options = '["Because EOR decisions belong after the waterflood has finished, which for Ekene is decades away yet.", "Because the Suite has no validated EOR screening engine yet, so any EOR number here would rest on unchecked math.", "Because EOR is a separate study, and its first step, screening, belongs to the Suite''s EOR Screening app as a shortlist.", "Because the displacement construction imported from the SCAL course already prices polymer, so a second treatment would duplicate it."]'::jsonb
            and answer_index = 2 then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions
   where app_slug = 'waterflood' and tier = 'advanced' and scope = 'module' and module_key = 'm05-forecast-against-field' and ord = 15;
  if v_state is null then raise exception 'waterflood EOR q15 refused: no row for advanced module m05 ord 15'; end if;
  if v_state = 'other' then raise exception 'waterflood EOR q15 refused: advanced m05 ord 15 matches neither its published nor its new form'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Why does this course keep EOR qualitative, with no EOR number anywhere in its capstone?',
           options = '["Because EOR decisions belong after the waterflood has finished, which for Ekene is decades away yet.", "Because the Suite has no validated EOR screening engine yet, so any EOR number here would rest on unchecked math.", "Because EOR is a separate study, and its first step, screening, belongs to the Suite''s EOR Screening app as a shortlist.", "Because the displacement construction imported from the SCAL course already prices polymer, so a second treatment would duplicate it."]'::jsonb,
           answer_index = 2,
           explanation = 'This course owns the waterflood, and EOR is a different question. Its first step, screening a reservoir against the published Taber, Martin and Seright (1997) criteria with a CO2 minimum miscibility pressure check from Zhu and co-authors (2025), is done in the Suite''s EOR Screening app, which is validated against those papers, so the claim that no validated screening exists is out of date. A screen says which processes deserve a closer look. It cannot say where the remaining oil sits, how much a process would recover or whether it pays, which is why nothing about EOR is graded here. Most EOR decisions are in fact made while the flood is still running, since the flood''s own performance is the main evidence about where the remaining oil is.'
     where app_slug = 'waterflood' and tier = 'advanced' and scope = 'module' and module_key = 'm05-forecast-against-field' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'waterflood EOR q15 refused: updated % rows', v_count; end if;
    raise notice 'waterflood EOR q15: 1 row updated';
  else
    raise notice 'waterflood EOR q15: already applied, 0 rows updated';
  end if;
  select count(*) into v_total from public.academy_quiz_questions
   where app_slug = 'waterflood' and tier = 'advanced';
  if v_total <> 132 then raise exception 'waterflood EOR q15 refused: waterflood advanced has % questions, expected 132', v_total; end if;
end $$;
