-- ==========================================================================
-- BANK COURSE-NAMES RECUT: question text names the renamed courses and the
-- relabelled academy module (owner decisions 2026-09-26). TEXT ONLY.
--
-- Courses named for the skill: Seismolord -> Seismic Interpretation,
-- ReservoirCalc -> Reservoir Volumetrics, Well Data Manager -> Well Data
-- Management, Mapping -> Subsurface Mapping. The academy module economics
-- is Economics & Commercial. Where a question means the Suite app (the Well
-- Data Manager QC panel, the ReservoirCalc chain or ladder) the app keeps
-- its name.
--
-- WHAT MOVES. 21 rows: earthmodel 8, hygiene 2, refinery 2, rockphysics 1, welldata 8.
-- No answer_index, option order, ord, module key, scope or row count moves,
-- so every question id and every learner attempt survives. Four rows change
-- a keyed option's text; one distractor (rockphysics advanced m05 ord 9,
-- option 2) is lengthened so that row keeps its length rank. Every bank
-- touched stays inside the 12 to 40 percent length-rank band.
-- Rows (fields):
--   earthmodel beginner final ord 10: explanation
--   earthmodel beginner final ord 34: prompt
--   earthmodel beginner module m01-what-an-earth-model-is ord 6: prompt
--   earthmodel beginner module m01-what-an-earth-model-is ord 7: prompt
--   earthmodel beginner module m05-bulk-rock-volume ord 2: explanation
--   earthmodel beginner module m05-bulk-rock-volume ord 11: option 2 (keyed)
--   earthmodel beginner module m06-the-earth-modeling-workflow ord 10: explanation
--   earthmodel beginner module m06-the-earth-modeling-workflow ord 15: explanation
--   hygiene beginner module m06-the-associate-capstone ord 5: explanation
--   hygiene intermediate final ord 42: option 2 (keyed)
--   refinery advanced final ord 37: option 0 (keyed), explanation
--   refinery advanced module m04-the-investment-case ord 12: explanation
--   rockphysics advanced module m05-resolution ord 9: option 1 (keyed), option 3, option 2
--   welldata beginner final ord 1: prompt
--   welldata beginner final ord 37: prompt
--   welldata beginner final ord 42: prompt
--   welldata beginner module m01-well-data-and-the-registry ord 1: prompt
--   welldata beginner module m06-the-qc-workflow ord 13: explanation
--   welldata intermediate final ord 1: prompt
--   welldata advanced module m06-the-campaign-workflow ord 1: prompt
--   welldata advanced module m06-the-campaign-workflow ord 14: explanation
--
-- GUARDS. Each row is addressed by (app_slug, tier, scope, module_key, ord)
-- among ACTIVE rows and must match EITHER its served text exactly (prompt,
-- options, answer_index, explanation), in which case it is updated, OR its
-- recut text exactly, in which case it is already applied and left alone.
-- Anything else raises and the transaction rolls back. Every update must
-- touch exactly 1 row, and each course must still hold 396 active questions.
--
-- The served text is what the applied migrations leave (deep seeds, B3, DG,
-- B4 length and fix files, round-off banks, W6), replayed on a scratch
-- database. Written by docs/bank-course-names-recut/gen_recut.py from
-- edits.json; every OLD and NEW row is in RECUT.json.
--
-- SAFE TO RE-RUN. A second run finds every row already recut and updates
-- nothing.
-- ==========================================================================

do $$
declare
  v_state   text;
  v_count   integer;
  v_updated integer := 0;
begin

  -- earthmodel beginner final ord 10: explanation
  select case
           when prompt = 'A framework build is finished. Which quantity leaves this course, and where does it go?' and options = '["The clamp counts, which go to the petrophysicist for calibration against the logs.", "The bulk rock volume of each zone, in m3 and with its denominator stated.", "The model frame specification, which goes back to the contractor who supplied the source surfaces.", "The three clamped surfaces, which go to the drilling team in place of a prognosis."]'::jsonb and answer_index = 2 and explanation is not distinct from 'Bulk rock volume is the last purely geometric quantity and the first input the property side needs, so it is the interface with the ReservoirCalc course. The clamp counts and the surfaces are diagnostics and products of this course rather than the hand over.' then 'old'
           when prompt = 'A framework build is finished. Which quantity leaves this course, and where does it go?' and options = '["The clamp counts, which go to the petrophysicist for calibration against the logs.", "The bulk rock volume of each zone, in m3 and with its denominator stated.", "The model frame specification, which goes back to the contractor who supplied the source surfaces.", "The three clamped surfaces, which go to the drilling team in place of a prognosis."]'::jsonb and answer_index = 2 and explanation is not distinct from 'Bulk rock volume is the last purely geometric quantity and the first input the property side needs, so it is the interface with the Reservoir Volumetrics course. The clamp counts and the surfaces are diagnostics and products of this course rather than the hand over.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'earthmodel' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null::text and ord = 10 and active;
  if v_state is null then raise exception 'bank course-names recut refused: no active row for earthmodel beginner final ord 10'; end if;
  if v_state = 'other' then raise exception 'bank course-names recut refused: earthmodel beginner final ord 10 matches neither its served nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A framework build is finished. Which quantity leaves this course, and where does it go?', options = '["The clamp counts, which go to the petrophysicist for calibration against the logs.", "The bulk rock volume of each zone, in m3 and with its denominator stated.", "The model frame specification, which goes back to the contractor who supplied the source surfaces.", "The three clamped surfaces, which go to the drilling team in place of a prognosis."]'::jsonb, explanation = 'Bulk rock volume is the last purely geometric quantity and the first input the property side needs, so it is the interface with the Reservoir Volumetrics course. The clamp counts and the surfaces are diagnostics and products of this course rather than the hand over.'
     where app_slug = 'earthmodel' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null::text and ord = 10 and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'bank course-names recut refused: earthmodel beginner final ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- earthmodel beginner final ord 34: prompt
  select case
           when prompt = 'Which statement correctly divides the work between this course and the ReservoirCalc course?' and options = '["This course produces the bulk volume and the porosity that goes with it, and ReservoirCalc supplies the contact, the saturation and the formation volume factor that follow.", "This course produces the hydrocarbon volume in place, and ReservoirCalc converts it to surface volumes with the formation volume factor.", "This course produces the container and stops at bulk rock volume, and the contact, net-to-gross, porosity, saturation and formation volume factor all belong to ReservoirCalc.", "Both courses compute the bulk volume independently from the same surfaces, and the two results are reconciled against each other at the end of the study."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The bulk rock volume is the hand-off object between the two courses. None of the five downstream quantities is a property of the geometry, so none of them can be derived from a surface stack.' then 'old'
           when prompt = 'Which statement correctly divides the work between this course and the Reservoir Volumetrics course?' and options = '["This course produces the bulk volume and the porosity that goes with it, and ReservoirCalc supplies the contact, the saturation and the formation volume factor that follow.", "This course produces the hydrocarbon volume in place, and ReservoirCalc converts it to surface volumes with the formation volume factor.", "This course produces the container and stops at bulk rock volume, and the contact, net-to-gross, porosity, saturation and formation volume factor all belong to ReservoirCalc.", "Both courses compute the bulk volume independently from the same surfaces, and the two results are reconciled against each other at the end of the study."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The bulk rock volume is the hand-off object between the two courses. None of the five downstream quantities is a property of the geometry, so none of them can be derived from a surface stack.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'earthmodel' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null::text and ord = 34 and active;
  if v_state is null then raise exception 'bank course-names recut refused: no active row for earthmodel beginner final ord 34'; end if;
  if v_state = 'other' then raise exception 'bank course-names recut refused: earthmodel beginner final ord 34 matches neither its served nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Which statement correctly divides the work between this course and the Reservoir Volumetrics course?', options = '["This course produces the bulk volume and the porosity that goes with it, and ReservoirCalc supplies the contact, the saturation and the formation volume factor that follow.", "This course produces the hydrocarbon volume in place, and ReservoirCalc converts it to surface volumes with the formation volume factor.", "This course produces the container and stops at bulk rock volume, and the contact, net-to-gross, porosity, saturation and formation volume factor all belong to ReservoirCalc.", "Both courses compute the bulk volume independently from the same surfaces, and the two results are reconciled against each other at the end of the study."]'::jsonb, explanation = 'The bulk rock volume is the hand-off object between the two courses. None of the five downstream quantities is a property of the geometry, so none of them can be derived from a surface stack.'
     where app_slug = 'earthmodel' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null::text and ord = 34 and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'bank course-names recut refused: earthmodel beginner final ord 34 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- earthmodel beginner module m01-what-an-earth-model-is ord 6: prompt
  select case
           when prompt = 'What is the object handed from this course to the ReservoirCalc course?' and options = '["The bulk rock volume of each zone, in m3, with the set of nodes it was computed over stated.", "The picked horizons on their original source grids.", "A contour map of each surface, as presented at the volumetrics meeting.", "The model frame specification on its own."]'::jsonb and answer_index = 0 and explanation is not distinct from 'Bulk rock volume is the last purely geometric quantity in the chain and the first input the property side needs, which is why the hand over sits there. It has to carry its units, its zone and the nodes it was computed over or the receiving side will use it wrongly.' then 'old'
           when prompt = 'What is the object handed from this course to the Reservoir Volumetrics course?' and options = '["The bulk rock volume of each zone, in m3, with the set of nodes it was computed over stated.", "The picked horizons on their original source grids.", "A contour map of each surface, as presented at the volumetrics meeting.", "The model frame specification on its own."]'::jsonb and answer_index = 0 and explanation is not distinct from 'Bulk rock volume is the last purely geometric quantity in the chain and the first input the property side needs, which is why the hand over sits there. It has to carry its units, its zone and the nodes it was computed over or the receiving side will use it wrongly.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'earthmodel' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-an-earth-model-is'::text and ord = 6 and active;
  if v_state is null then raise exception 'bank course-names recut refused: no active row for earthmodel beginner module m01-what-an-earth-model-is ord 6'; end if;
  if v_state = 'other' then raise exception 'bank course-names recut refused: earthmodel beginner module m01-what-an-earth-model-is ord 6 matches neither its served nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'What is the object handed from this course to the Reservoir Volumetrics course?', options = '["The bulk rock volume of each zone, in m3, with the set of nodes it was computed over stated.", "The picked horizons on their original source grids.", "A contour map of each surface, as presented at the volumetrics meeting.", "The model frame specification on its own."]'::jsonb, explanation = 'Bulk rock volume is the last purely geometric quantity in the chain and the first input the property side needs, which is why the hand over sits there. It has to carry its units, its zone and the nodes it was computed over or the receiving side will use it wrongly.'
     where app_slug = 'earthmodel' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-an-earth-model-is'::text and ord = 6 and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'bank course-names recut refused: earthmodel beginner module m01-what-an-earth-model-is ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- earthmodel beginner module m01-what-an-earth-model-is ord 7: prompt
  select case
           when prompt = 'Which of these belongs to the ReservoirCalc course rather than to this one?' and options = '["The thickness of zone A at a node.", "The cell area of the model frame.", "Hydrocarbon saturation at a node.", "The bulk rock volume of zone A."]'::jsonb and answer_index = 2 and explanation is not distinct from 'This course owns the container, which is the frame, the surfaces, the zones, the thicknesses and the bulk rock volume. Saturation sits on the property side of the hand over and is not taught here.' then 'old'
           when prompt = 'Which of these belongs to the Reservoir Volumetrics course rather than to this one?' and options = '["The thickness of zone A at a node.", "The cell area of the model frame.", "Hydrocarbon saturation at a node.", "The bulk rock volume of zone A."]'::jsonb and answer_index = 2 and explanation is not distinct from 'This course owns the container, which is the frame, the surfaces, the zones, the thicknesses and the bulk rock volume. Saturation sits on the property side of the hand over and is not taught here.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'earthmodel' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-an-earth-model-is'::text and ord = 7 and active;
  if v_state is null then raise exception 'bank course-names recut refused: no active row for earthmodel beginner module m01-what-an-earth-model-is ord 7'; end if;
  if v_state = 'other' then raise exception 'bank course-names recut refused: earthmodel beginner module m01-what-an-earth-model-is ord 7 matches neither its served nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Which of these belongs to the Reservoir Volumetrics course rather than to this one?', options = '["The thickness of zone A at a node.", "The cell area of the model frame.", "Hydrocarbon saturation at a node.", "The bulk rock volume of zone A."]'::jsonb, explanation = 'This course owns the container, which is the frame, the surfaces, the zones, the thicknesses and the bulk rock volume. Saturation sits on the property side of the hand over and is not taught here.'
     where app_slug = 'earthmodel' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-an-earth-model-is'::text and ord = 7 and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'bank course-names recut refused: earthmodel beginner module m01-what-an-earth-model-is ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- earthmodel beginner module m05-bulk-rock-volume ord 2: explanation
  select case
           when prompt = 'Which of these is already counted inside a zone''s bulk rock volume?' and options = '["Only the pore space, on the grounds that the grains cannot hold anything.", "Only the rock that sits above the fluid contact in that zone.", "All of the rock in the zone, including the shale beds that are not reservoir.", "Only the rock that passes the petrophysical cut-off for net reservoir."]'::jsonb and answer_index = 2 and explanation is not distinct from 'Bulk rock volume is gross rock, so interbedded shale and other non-reservoir intervals are inside it. Removing them is what a net-to-gross ratio does, and that belongs to the ReservoirCalc course.' then 'old'
           when prompt = 'Which of these is already counted inside a zone''s bulk rock volume?' and options = '["Only the pore space, on the grounds that the grains cannot hold anything.", "Only the rock that sits above the fluid contact in that zone.", "All of the rock in the zone, including the shale beds that are not reservoir.", "Only the rock that passes the petrophysical cut-off for net reservoir."]'::jsonb and answer_index = 2 and explanation is not distinct from 'Bulk rock volume is gross rock, so interbedded shale and other non-reservoir intervals are inside it. Removing them is what a net-to-gross ratio does, and that belongs to the Reservoir Volumetrics course.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'earthmodel' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-bulk-rock-volume'::text and ord = 2 and active;
  if v_state is null then raise exception 'bank course-names recut refused: no active row for earthmodel beginner module m05-bulk-rock-volume ord 2'; end if;
  if v_state = 'other' then raise exception 'bank course-names recut refused: earthmodel beginner module m05-bulk-rock-volume ord 2 matches neither its served nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Which of these is already counted inside a zone''s bulk rock volume?', options = '["Only the pore space, on the grounds that the grains cannot hold anything.", "Only the rock that sits above the fluid contact in that zone.", "All of the rock in the zone, including the shale beds that are not reservoir.", "Only the rock that passes the petrophysical cut-off for net reservoir."]'::jsonb, explanation = 'Bulk rock volume is gross rock, so interbedded shale and other non-reservoir intervals are inside it. Removing them is what a net-to-gross ratio does, and that belongs to the Reservoir Volumetrics course.'
     where app_slug = 'earthmodel' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-bulk-rock-volume'::text and ord = 2 and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'bank course-names recut refused: earthmodel beginner module m05-bulk-rock-volume ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- earthmodel beginner module m05-bulk-rock-volume ord 11: option 2 (keyed)
  select case
           when prompt = 'A colleague asks you to produce the hydrocarbon volume in place from this framework. What is the correct response?' and options = '["Apply a porosity and a saturation to the two thickness grids, then report the hydrocarbon volume in place beside the bulk volumes so the receiver has both figures to work from.", "Read the hydrocarbon volume from the framework panel, which reports it beside the bulk volumes.", "Hand over the bulk rock volumes with their frame and clamp counts, since the contact, net-to-gross, porosity, saturation and formation volume factor belong to the ReservoirCalc course.", "Clip both zones at a contact depth of your own choosing and report the volume above it."]'::jsonb and answer_index = 2 and explanation is not distinct from 'This course owns the container and stops at bulk rock volume. The framework panel shows the clamped surfaces, the two thickness grids and the framework statistics, and it computes no fluids at all.' then 'old'
           when prompt = 'A colleague asks you to produce the hydrocarbon volume in place from this framework. What is the correct response?' and options = '["Apply a porosity and a saturation to the two thickness grids, then report the hydrocarbon volume in place beside the bulk volumes so the receiver has both figures to work from.", "Read the hydrocarbon volume from the framework panel, which reports it beside the bulk volumes.", "Hand over the bulk rock volumes with their frame and clamp counts, since the contact, net-to-gross, porosity, saturation and formation volume factor belong to the Reservoir Volumetrics course.", "Clip both zones at a contact depth of your own choosing and report the volume above it."]'::jsonb and answer_index = 2 and explanation is not distinct from 'This course owns the container and stops at bulk rock volume. The framework panel shows the clamped surfaces, the two thickness grids and the framework statistics, and it computes no fluids at all.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'earthmodel' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-bulk-rock-volume'::text and ord = 11 and active;
  if v_state is null then raise exception 'bank course-names recut refused: no active row for earthmodel beginner module m05-bulk-rock-volume ord 11'; end if;
  if v_state = 'other' then raise exception 'bank course-names recut refused: earthmodel beginner module m05-bulk-rock-volume ord 11 matches neither its served nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'A colleague asks you to produce the hydrocarbon volume in place from this framework. What is the correct response?', options = '["Apply a porosity and a saturation to the two thickness grids, then report the hydrocarbon volume in place beside the bulk volumes so the receiver has both figures to work from.", "Read the hydrocarbon volume from the framework panel, which reports it beside the bulk volumes.", "Hand over the bulk rock volumes with their frame and clamp counts, since the contact, net-to-gross, porosity, saturation and formation volume factor belong to the Reservoir Volumetrics course.", "Clip both zones at a contact depth of your own choosing and report the volume above it."]'::jsonb, explanation = 'This course owns the container and stops at bulk rock volume. The framework panel shows the clamped surfaces, the two thickness grids and the framework statistics, and it computes no fluids at all.'
     where app_slug = 'earthmodel' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-bulk-rock-volume'::text and ord = 11 and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'bank course-names recut refused: earthmodel beginner module m05-bulk-rock-volume ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- earthmodel beginner module m06-the-earth-modeling-workflow ord 10: explanation
  select case
           when prompt = 'What does the framework panel show, and what does it not show?' and options = '["It shows the clamped surfaces and the hydrocarbon volume in place, but not the thickness grids.", "It shows the three source grids as they arrived on their own cell sizes and origins, but not the model frame they were resampled onto.", "It shows the three clamped surfaces, the two thickness grids on the model frame and the framework statistics, and it computes no fluids.", "It shows the two thickness grids and the water saturation on the model frame, but it does not report the clamp counts anywhere."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The panel is a view of the container. Fluids, contacts, saturation and hydrocarbon volumes are not in it, because they belong to the ReservoirCalc course.' then 'old'
           when prompt = 'What does the framework panel show, and what does it not show?' and options = '["It shows the clamped surfaces and the hydrocarbon volume in place, but not the thickness grids.", "It shows the three source grids as they arrived on their own cell sizes and origins, but not the model frame they were resampled onto.", "It shows the three clamped surfaces, the two thickness grids on the model frame and the framework statistics, and it computes no fluids.", "It shows the two thickness grids and the water saturation on the model frame, but it does not report the clamp counts anywhere."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The panel is a view of the container. Fluids, contacts, saturation and hydrocarbon volumes are not in it, because they belong to the Reservoir Volumetrics course.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'earthmodel' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-earth-modeling-workflow'::text and ord = 10 and active;
  if v_state is null then raise exception 'bank course-names recut refused: no active row for earthmodel beginner module m06-the-earth-modeling-workflow ord 10'; end if;
  if v_state = 'other' then raise exception 'bank course-names recut refused: earthmodel beginner module m06-the-earth-modeling-workflow ord 10 matches neither its served nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'What does the framework panel show, and what does it not show?', options = '["It shows the clamped surfaces and the hydrocarbon volume in place, but not the thickness grids.", "It shows the three source grids as they arrived on their own cell sizes and origins, but not the model frame they were resampled onto.", "It shows the three clamped surfaces, the two thickness grids on the model frame and the framework statistics, and it computes no fluids.", "It shows the two thickness grids and the water saturation on the model frame, but it does not report the clamp counts anywhere."]'::jsonb, explanation = 'The panel is a view of the container. Fluids, contacts, saturation and hydrocarbon volumes are not in it, because they belong to the Reservoir Volumetrics course.'
     where app_slug = 'earthmodel' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-earth-modeling-workflow'::text and ord = 10 and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'bank course-names recut refused: earthmodel beginner module m06-the-earth-modeling-workflow ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- earthmodel beginner module m06-the-earth-modeling-workflow ord 15: explanation
  select case
           when prompt = 'What does the Beginner tier hand on at the end of the workflow?' and options = '["A hydrocarbon volume in place for each of the two zones, computed from the bulk rock volumes it has just derived.", "The three source surfaces on their original grids, with a note saying which one is deepest at each node.", "A single mean thickness for the model, averaged across both zones together and ready for the volumetric chain.", "A frame, three clamped surfaces, a clamp count, two thickness grids and two bulk rock volumes."]'::jsonb and answer_index = 3 and explanation is not distinct from 'Those are the ingredients a volumetric estimate needs, and they are where this course stops. The contact, net-to-gross, porosity, saturation and formation volume factor are all applied in the ReservoirCalc course.' then 'old'
           when prompt = 'What does the Beginner tier hand on at the end of the workflow?' and options = '["A hydrocarbon volume in place for each of the two zones, computed from the bulk rock volumes it has just derived.", "The three source surfaces on their original grids, with a note saying which one is deepest at each node.", "A single mean thickness for the model, averaged across both zones together and ready for the volumetric chain.", "A frame, three clamped surfaces, a clamp count, two thickness grids and two bulk rock volumes."]'::jsonb and answer_index = 3 and explanation is not distinct from 'Those are the ingredients a volumetric estimate needs, and they are where this course stops. The contact, net-to-gross, porosity, saturation and formation volume factor are all applied in the Reservoir Volumetrics course.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'earthmodel' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-earth-modeling-workflow'::text and ord = 15 and active;
  if v_state is null then raise exception 'bank course-names recut refused: no active row for earthmodel beginner module m06-the-earth-modeling-workflow ord 15'; end if;
  if v_state = 'other' then raise exception 'bank course-names recut refused: earthmodel beginner module m06-the-earth-modeling-workflow ord 15 matches neither its served nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'What does the Beginner tier hand on at the end of the workflow?', options = '["A hydrocarbon volume in place for each of the two zones, computed from the bulk rock volumes it has just derived.", "The three source surfaces on their original grids, with a note saying which one is deepest at each node.", "A single mean thickness for the model, averaged across both zones together and ready for the volumetric chain.", "A frame, three clamped surfaces, a clamp count, two thickness grids and two bulk rock volumes."]'::jsonb, explanation = 'Those are the ingredients a volumetric estimate needs, and they are where this course stops. The contact, net-to-gross, porosity, saturation and formation volume factor are all applied in the Reservoir Volumetrics course.'
     where app_slug = 'earthmodel' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-earth-modeling-workflow'::text and ord = 15 and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'bank course-names recut refused: earthmodel beginner module m06-the-earth-modeling-workflow ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- hygiene beginner module m06-the-associate-capstone ord 5: explanation
  select case
           when prompt = 'Why does this course call a reading from a sound level meter a sound level?' and options = '["Other courses use noise for scatter in data, so the word is kept for noise exposure.", "OSHA''s Appendix A has no other word for a reading taken by an instrument.", "The engine refuses any input field whose name refers to noise directly.", "A sound level is a percentage of an allowance, while a reading is in dBA."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course''s naming rule 3: noise already means scatter in data in the Decline Curve Analysis, Well Test and Seismolord courses, so a reading is a sound level and noise exposure is kept for a noise dose. It is a rule about readers arriving from other courses. A sound level is in dBA; the percentage of an allowance is the noise dose.' then 'old'
           when prompt = 'Why does this course call a reading from a sound level meter a sound level?' and options = '["Other courses use noise for scatter in data, so the word is kept for noise exposure.", "OSHA''s Appendix A has no other word for a reading taken by an instrument.", "The engine refuses any input field whose name refers to noise directly.", "A sound level is a percentage of an allowance, while a reading is in dBA."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course''s naming rule 3: noise already means scatter in data in the Decline Curve Analysis, Well Test and Seismic Interpretation courses, so a reading is a sound level and noise exposure is kept for a noise dose. It is a rule about readers arriving from other courses. A sound level is in dBA; the percentage of an allowance is the noise dose.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'hygiene' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-capstone'::text and ord = 5 and active;
  if v_state is null then raise exception 'bank course-names recut refused: no active row for hygiene beginner module m06-the-associate-capstone ord 5'; end if;
  if v_state = 'other' then raise exception 'bank course-names recut refused: hygiene beginner module m06-the-associate-capstone ord 5 matches neither its served nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Why does this course call a reading from a sound level meter a sound level?', options = '["Other courses use noise for scatter in data, so the word is kept for noise exposure.", "OSHA''s Appendix A has no other word for a reading taken by an instrument.", "The engine refuses any input field whose name refers to noise directly.", "A sound level is a percentage of an allowance, while a reading is in dBA."]'::jsonb, explanation = 'The course''s naming rule 3: noise already means scatter in data in the Decline Curve Analysis, Well Test and Seismic Interpretation courses, so a reading is a sound level and noise exposure is kept for a noise dose. It is a rule about readers arriving from other courses. A sound level is in dBA; the percentage of an allowance is the noise dose.'
     where app_slug = 'hygiene' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-capstone'::text and ord = 5 and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'bank course-names recut refused: hygiene beginner module m06-the-associate-capstone ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- hygiene intermediate final ord 42: option 2 (keyed)
  select case
           when prompt = 'This course writes "sound level" for an instrument reading. Which courses make that rule necessary?' and options = '["The Economics courses, where the short word already means a currency rate", "Flow Assurance and Gas Processing, where the short word means an inhibitor or a methanol charge", "Decline Curve Analysis, Well Test and Seismolord, where the short word means scatter in data", "Field Development Planning and Well Cost, where the short word means money that is at risk"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course''s naming rule 3 names those three courses, where the short word already means scatter in data, so this course says sound level for a reading. The Economics collision is the one that forces "decibel exchange rate", the Flow Assurance and Gas Processing collision forces "noise dose", and the Field Development Planning and Well Cost collision forces a qualified "noise exposure" or "chemical exposure".' then 'old'
           when prompt = 'This course writes "sound level" for an instrument reading. Which courses make that rule necessary?' and options = '["The Economics courses, where the short word already means a currency rate", "Flow Assurance and Gas Processing, where the short word means an inhibitor or a methanol charge", "Decline Curve Analysis, Well Test and Seismic Interpretation, where the short word means scatter in data", "Field Development Planning and Well Cost, where the short word means money that is at risk"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course''s naming rule 3 names those three courses, where the short word already means scatter in data, so this course says sound level for a reading. The Economics collision is the one that forces "decibel exchange rate", the Flow Assurance and Gas Processing collision forces "noise dose", and the Field Development Planning and Well Cost collision forces a qualified "noise exposure" or "chemical exposure".' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'hygiene' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null::text and ord = 42 and active;
  if v_state is null then raise exception 'bank course-names recut refused: no active row for hygiene intermediate final ord 42'; end if;
  if v_state = 'other' then raise exception 'bank course-names recut refused: hygiene intermediate final ord 42 matches neither its served nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'This course writes "sound level" for an instrument reading. Which courses make that rule necessary?', options = '["The Economics courses, where the short word already means a currency rate", "Flow Assurance and Gas Processing, where the short word means an inhibitor or a methanol charge", "Decline Curve Analysis, Well Test and Seismic Interpretation, where the short word means scatter in data", "Field Development Planning and Well Cost, where the short word means money that is at risk"]'::jsonb, explanation = 'The course''s naming rule 3 names those three courses, where the short word already means scatter in data, so this course says sound level for a reading. The Economics collision is the one that forces "decibel exchange rate", the Flow Assurance and Gas Processing collision forces "noise dose", and the Field Development Planning and Well Cost collision forces a qualified "noise exposure" or "chemical exposure".'
     where app_slug = 'hygiene' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null::text and ord = 42 and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'bank course-names recut refused: hygiene intermediate final ord 42 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- refinery advanced final ord 37: option 0 (keyed), explanation
  select case
           when prompt = 'Held item H2 leaves a fuller capital allowance model open. Which part of the Academy owns it?' and options = '["The Economics module", "The supply course", "The crude course", "This course''s Expert tier"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The held item names the Economics module as the owner of a fuller allowance model, and says carrying the loss forward covers the refinery case.' then 'old'
           when prompt = 'Held item H2 leaves a fuller capital allowance model open. Which part of the Academy owns it?' and options = '["The Economics & Commercial module", "The supply course", "The crude course", "This course''s Expert tier"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The held item names the Economics & Commercial module as the owner of a fuller allowance model, and says carrying the loss forward covers the refinery case.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'refinery' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null::text and ord = 37 and active;
  if v_state is null then raise exception 'bank course-names recut refused: no active row for refinery advanced final ord 37'; end if;
  if v_state = 'other' then raise exception 'bank course-names recut refused: refinery advanced final ord 37 matches neither its served nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Held item H2 leaves a fuller capital allowance model open. Which part of the Academy owns it?', options = '["The Economics & Commercial module", "The supply course", "The crude course", "This course''s Expert tier"]'::jsonb, explanation = 'The held item names the Economics & Commercial module as the owner of a fuller allowance model, and says carrying the loss forward covers the refinery case.'
     where app_slug = 'refinery' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null::text and ord = 37 and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'bank course-names recut refused: refinery advanced final ord 37 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- refinery advanced module m04-the-investment-case ord 12: explanation
  select case
           when prompt = 'Held item H2 is taught as a limit of the screening engine. What does it say the engine lacks?' and options = '["A royalty setting for a plant that buys its crude.", "Any way to carry a tax loss into later years.", "A capital allowance schedule starting at commissioning.", "A mid-year discounting convention for the NPV."]'::jsonb and answer_index = 2 and explanation is not distinct from 'H2: the screening engine depreciates capital in the year it is spent and offers no capital allowance schedule starting at commissioning. Carrying the loss forward covers the refinery case, and a fuller allowance model belongs to the Economics module.' then 'old'
           when prompt = 'Held item H2 is taught as a limit of the screening engine. What does it say the engine lacks?' and options = '["A royalty setting for a plant that buys its crude.", "Any way to carry a tax loss into later years.", "A capital allowance schedule starting at commissioning.", "A mid-year discounting convention for the NPV."]'::jsonb and answer_index = 2 and explanation is not distinct from 'H2: the screening engine depreciates capital in the year it is spent and offers no capital allowance schedule starting at commissioning. Carrying the loss forward covers the refinery case, and a fuller allowance model belongs to the Economics & Commercial module.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'refinery' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-investment-case'::text and ord = 12 and active;
  if v_state is null then raise exception 'bank course-names recut refused: no active row for refinery advanced module m04-the-investment-case ord 12'; end if;
  if v_state = 'other' then raise exception 'bank course-names recut refused: refinery advanced module m04-the-investment-case ord 12 matches neither its served nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Held item H2 is taught as a limit of the screening engine. What does it say the engine lacks?', options = '["A royalty setting for a plant that buys its crude.", "Any way to carry a tax loss into later years.", "A capital allowance schedule starting at commissioning.", "A mid-year discounting convention for the NPV."]'::jsonb, explanation = 'H2: the screening engine depreciates capital in the year it is spent and offers no capital allowance schedule starting at commissioning. Carrying the loss forward covers the refinery case, and a fuller allowance model belongs to the Economics & Commercial module.'
     where app_slug = 'refinery' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-investment-case'::text and ord = 12 and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'bank course-names recut refused: refinery advanced module m04-the-investment-case ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- rockphysics advanced module m05-resolution ord 9: option 1 (keyed), option 3, option 2
  select case
           when prompt = 'Which course established that tuning depends only on the wavelet?' and options = '["This tier, on the plus and minus 0.1 pair.", "The Seismolord Expert tier, on a different pair.", "The Rock Physics Associate tier, from the Ricker wavelet.", "The Mapping Expert tier, from the resolution of a grid."]'::jsonb and answer_index = 1 and explanation is not distinct from 'It derived the law that a Ricker depends on frequency and thickness only through their product, using a plus and minus 0.08 pair. This tier confirms it on a different fixture rather than re-deriving it.' then 'old'
           when prompt = 'Which course established that tuning depends only on the wavelet?' and options = '["This tier, on the plus and minus 0.1 pair.", "The Seismic Interpretation Expert tier, on a different pair.", "The Rock Physics Associate tier, from the Ricker wavelet alone.", "The Subsurface Mapping Expert tier, from the resolution of a grid."]'::jsonb and answer_index = 1 and explanation is not distinct from 'It derived the law that a Ricker depends on frequency and thickness only through their product, using a plus and minus 0.08 pair. This tier confirms it on a different fixture rather than re-deriving it.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'rockphysics' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-resolution'::text and ord = 9 and active;
  if v_state is null then raise exception 'bank course-names recut refused: no active row for rockphysics advanced module m05-resolution ord 9'; end if;
  if v_state = 'other' then raise exception 'bank course-names recut refused: rockphysics advanced module m05-resolution ord 9 matches neither its served nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Which course established that tuning depends only on the wavelet?', options = '["This tier, on the plus and minus 0.1 pair.", "The Seismic Interpretation Expert tier, on a different pair.", "The Rock Physics Associate tier, from the Ricker wavelet alone.", "The Subsurface Mapping Expert tier, from the resolution of a grid."]'::jsonb, explanation = 'It derived the law that a Ricker depends on frequency and thickness only through their product, using a plus and minus 0.08 pair. This tier confirms it on a different fixture rather than re-deriving it.'
     where app_slug = 'rockphysics' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-resolution'::text and ord = 9 and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'bank course-names recut refused: rockphysics advanced module m05-resolution ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- welldata beginner final ord 1: prompt
  select case
           when prompt = 'Why does the Well Data Manager course sit at the root of the geoscience path, as the prerequisite for every other course?' and options = '["Because every downstream interpretation consumes well data, so the quality of imports bounds the quality of everything built on them", "Because it is the shortest course and serves as an orientation module", "Because regulators require data management certification before interpretation work", "Because the other apps cannot run until a LAS file is uploaded to them directly"]'::jsonb and answer_index = 0 and explanation is not distinct from 'Petrophysics, correlation, synthetics and mapping all read the well registry. If the imported data is wrong, every downstream product inherits the error, so the path starts here.' then 'old'
           when prompt = 'Why does the Well Data Management course sit at the root of the geoscience path, as the prerequisite for every other course?' and options = '["Because every downstream interpretation consumes well data, so the quality of imports bounds the quality of everything built on them", "Because it is the shortest course and serves as an orientation module", "Because regulators require data management certification before interpretation work", "Because the other apps cannot run until a LAS file is uploaded to them directly"]'::jsonb and answer_index = 0 and explanation is not distinct from 'Petrophysics, correlation, synthetics and mapping all read the well registry. If the imported data is wrong, every downstream product inherits the error, so the path starts here.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'welldata' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null::text and ord = 1 and active;
  if v_state is null then raise exception 'bank course-names recut refused: no active row for welldata beginner final ord 1'; end if;
  if v_state = 'other' then raise exception 'bank course-names recut refused: welldata beginner final ord 1 matches neither its served nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Why does the Well Data Management course sit at the root of the geoscience path, as the prerequisite for every other course?', options = '["Because every downstream interpretation consumes well data, so the quality of imports bounds the quality of everything built on them", "Because it is the shortest course and serves as an orientation module", "Because regulators require data management certification before interpretation work", "Because the other apps cannot run until a LAS file is uploaded to them directly"]'::jsonb, explanation = 'Petrophysics, correlation, synthetics and mapping all read the well registry. If the imported data is wrong, every downstream product inherits the error, so the path starts here.'
     where app_slug = 'welldata' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null::text and ord = 1 and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'bank course-names recut refused: welldata beginner final ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- welldata beginner final ord 37: prompt
  select case
           when prompt = 'Which six quantities does the Well Data Manager Associate capstone grade?' and options = '["basic_20 depth samples, basic_20 GR nulls, basic_20 mean GR, feet_20 converted step, nullheavy_20 NPHI nulls, wrapped_12 depth samples", "Six mean values, one per curve of basic_20 plus depth, each read from the finite-sample mean column of the curve table so only that column is tested", "The STRT, STOP and STEP of two files, read straight from each well header table so that the capstone checks the declared depth frame and nothing else", "The null counts of all curves in all six files of the teaching set, because counting nulls correctly is the single skill the Associate tier certifies"]'::jsonb and answer_index = 0 and explanation is not distinct from 'Six numbers, each requiring one file loaded and one QC fact read correctly: 301 samples, 8 GR nulls, mean GR 64.93, step 0.6096 m, 201 NPHI nulls, 161 samples.' then 'old'
           when prompt = 'Which six quantities does the Well Data Management Associate capstone grade?' and options = '["basic_20 depth samples, basic_20 GR nulls, basic_20 mean GR, feet_20 converted step, nullheavy_20 NPHI nulls, wrapped_12 depth samples", "Six mean values, one per curve of basic_20 plus depth, each read from the finite-sample mean column of the curve table so only that column is tested", "The STRT, STOP and STEP of two files, read straight from each well header table so that the capstone checks the declared depth frame and nothing else", "The null counts of all curves in all six files of the teaching set, because counting nulls correctly is the single skill the Associate tier certifies"]'::jsonb and answer_index = 0 and explanation is not distinct from 'Six numbers, each requiring one file loaded and one QC fact read correctly: 301 samples, 8 GR nulls, mean GR 64.93, step 0.6096 m, 201 NPHI nulls, 161 samples.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'welldata' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null::text and ord = 37 and active;
  if v_state is null then raise exception 'bank course-names recut refused: no active row for welldata beginner final ord 37'; end if;
  if v_state = 'other' then raise exception 'bank course-names recut refused: welldata beginner final ord 37 matches neither its served nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Which six quantities does the Well Data Management Associate capstone grade?', options = '["basic_20 depth samples, basic_20 GR nulls, basic_20 mean GR, feet_20 converted step, nullheavy_20 NPHI nulls, wrapped_12 depth samples", "Six mean values, one per curve of basic_20 plus depth, each read from the finite-sample mean column of the curve table so only that column is tested", "The STRT, STOP and STEP of two files, read straight from each well header table so that the capstone checks the declared depth frame and nothing else", "The null counts of all curves in all six files of the teaching set, because counting nulls correctly is the single skill the Associate tier certifies"]'::jsonb, explanation = 'Six numbers, each requiring one file loaded and one QC fact read correctly: 301 samples, 8 GR nulls, mean GR 64.93, step 0.6096 m, 201 NPHI nulls, 161 samples.'
     where app_slug = 'welldata' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null::text and ord = 37 and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'bank course-names recut refused: welldata beginner final ord 37 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- welldata beginner final ord 42: prompt
  select case
           when prompt = 'Besides the certificate itself, what does passing the Well Data Manager Associate capstone unlock?' and options = '["A discount on the Professional tier of this course, applied automatically at checkout once the capstone certificate is live", "Automatic enrollment in all other courses in the Academy catalogue, which the platform performs as soon as the certificate is issued", "Nothing beyond the certificate, since each geoscience course has its own entry requirements that are checked independently", "Enrollment eligibility for the other geoscience courses, since this course is their prerequisite root"]'::jsonb and answer_index = 3 and explanation is not distinct from 'welldata is the prereq root: a live Associate certification here is what the enrollment trigger checks before admitting you to the other five geoscience courses.' then 'old'
           when prompt = 'Besides the certificate itself, what does passing the Well Data Management Associate capstone unlock?' and options = '["A discount on the Professional tier of this course, applied automatically at checkout once the capstone certificate is live", "Automatic enrollment in all other courses in the Academy catalogue, which the platform performs as soon as the certificate is issued", "Nothing beyond the certificate, since each geoscience course has its own entry requirements that are checked independently", "Enrollment eligibility for the other geoscience courses, since this course is their prerequisite root"]'::jsonb and answer_index = 3 and explanation is not distinct from 'welldata is the prereq root: a live Associate certification here is what the enrollment trigger checks before admitting you to the other five geoscience courses.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'welldata' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null::text and ord = 42 and active;
  if v_state is null then raise exception 'bank course-names recut refused: no active row for welldata beginner final ord 42'; end if;
  if v_state = 'other' then raise exception 'bank course-names recut refused: welldata beginner final ord 42 matches neither its served nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Besides the certificate itself, what does passing the Well Data Management Associate capstone unlock?', options = '["A discount on the Professional tier of this course, applied automatically at checkout once the capstone certificate is live", "Automatic enrollment in all other courses in the Academy catalogue, which the platform performs as soon as the certificate is issued", "Nothing beyond the certificate, since each geoscience course has its own entry requirements that are checked independently", "Enrollment eligibility for the other geoscience courses, since this course is their prerequisite root"]'::jsonb, explanation = 'welldata is the prereq root: a live Associate certification here is what the enrollment trigger checks before admitting you to the other five geoscience courses.'
     where app_slug = 'welldata' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null::text and ord = 42 and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'bank course-names recut refused: welldata beginner final ord 42 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- welldata beginner module m01-well-data-and-the-registry ord 1: prompt
  select case
           when prompt = 'Why is Well Data Manager the root of the NextGen geoscience path, with its Associate certificate required before the other courses?' and options = '["Every downstream workflow consumes well curves, so learners must be able to receive and QC data before they interpret it", "It is the shortest course, so it serves as a quick orientation", "The other courses reuse its user interface components", "Regulations require a data management certificate before any interpretation work"]'::jsonb and answer_index = 0 and explanation is not distinct from 'Petrophysics, correlation, synthetics, mapping and volumetrics all build on well curves, so the path teaches receiving and checking data before interpreting it.' then 'old'
           when prompt = 'Why is Well Data Management the root of the NextGen geoscience path, with its Associate certificate required before the other courses?' and options = '["Every downstream workflow consumes well curves, so learners must be able to receive and QC data before they interpret it", "It is the shortest course, so it serves as a quick orientation", "The other courses reuse its user interface components", "Regulations require a data management certificate before any interpretation work"]'::jsonb and answer_index = 0 and explanation is not distinct from 'Petrophysics, correlation, synthetics, mapping and volumetrics all build on well curves, so the path teaches receiving and checking data before interpreting it.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'welldata' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-well-data-and-the-registry'::text and ord = 1 and active;
  if v_state is null then raise exception 'bank course-names recut refused: no active row for welldata beginner module m01-well-data-and-the-registry ord 1'; end if;
  if v_state = 'other' then raise exception 'bank course-names recut refused: welldata beginner module m01-well-data-and-the-registry ord 1 matches neither its served nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'Why is Well Data Management the root of the NextGen geoscience path, with its Associate certificate required before the other courses?', options = '["Every downstream workflow consumes well curves, so learners must be able to receive and QC data before they interpret it", "It is the shortest course, so it serves as a quick orientation", "The other courses reuse its user interface components", "Regulations require a data management certificate before any interpretation work"]'::jsonb, explanation = 'Petrophysics, correlation, synthetics, mapping and volumetrics all build on well curves, so the path teaches receiving and checking data before interpreting it.'
     where app_slug = 'welldata' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-well-data-and-the-registry'::text and ord = 1 and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'bank course-names recut refused: welldata beginner module m01-well-data-and-the-registry ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- welldata beginner module m06-the-qc-workflow ord 13: explanation
  select case
           when prompt = 'What does passing the capstone earn, and why does it matter beyond this course?' and options = '["Use of the Well Data Manager QC panel itself, which stays closed to a learner until the capstone has been passed", "A record of the six readings, which is filed with the well registry as the verified QC result for the teaching wells", "The Associate certification, which is the prerequisite root that opens the rest of the geoscience path", "Exemption from the final exam in the courses that follow"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The capstone earns the Associate certification in Well Data Manager. That certificate is the prerequisite root of the whole geoscience path, so petrophysics, correlation, seismic, mapping and volumetrics all sit behind it.' then 'old'
           when prompt = 'What does passing the capstone earn, and why does it matter beyond this course?' and options = '["Use of the Well Data Manager QC panel itself, which stays closed to a learner until the capstone has been passed", "A record of the six readings, which is filed with the well registry as the verified QC result for the teaching wells", "The Associate certification, which is the prerequisite root that opens the rest of the geoscience path", "Exemption from the final exam in the courses that follow"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The capstone earns the Associate certification in Well Data Management. That certificate is the prerequisite root of the whole geoscience path, so petrophysics, correlation, seismic, mapping and volumetrics all sit behind it.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'welldata' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-qc-workflow'::text and ord = 13 and active;
  if v_state is null then raise exception 'bank course-names recut refused: no active row for welldata beginner module m06-the-qc-workflow ord 13'; end if;
  if v_state = 'other' then raise exception 'bank course-names recut refused: welldata beginner module m06-the-qc-workflow ord 13 matches neither its served nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'What does passing the capstone earn, and why does it matter beyond this course?', options = '["Use of the Well Data Manager QC panel itself, which stays closed to a learner until the capstone has been passed", "A record of the six readings, which is filed with the well registry as the verified QC result for the teaching wells", "The Associate certification, which is the prerequisite root that opens the rest of the geoscience path", "Exemption from the final exam in the courses that follow"]'::jsonb, explanation = 'The capstone earns the Associate certification in Well Data Management. That certificate is the prerequisite root of the whole geoscience path, so petrophysics, correlation, seismic, mapping and volumetrics all sit behind it.'
     where app_slug = 'welldata' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-qc-workflow'::text and ord = 13 and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'bank course-names recut refused: welldata beginner module m06-the-qc-workflow ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- welldata intermediate final ord 1: prompt
  select case
           when prompt = 'How do the three Well Data Manager tiers divide the work?' and options = '["The Associate tier reads headers, this tier reads data, and the Expert tier writes to the registry.", "The Associate tier handles metric files, this tier handles foot files, and the Expert tier handles archives.", "All three tiers import single files, with each tier adding more curves to the import.", "The Associate tier judges one file, this tier imports one file, and the Expert tier audits a delivery."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The progression is about what is being decided rather than about which files are handled. Adding curves up across files belongs to the Expert tier and not to this one.' then 'old'
           when prompt = 'How do the three Well Data Management tiers divide the work?' and options = '["The Associate tier reads headers, this tier reads data, and the Expert tier writes to the registry.", "The Associate tier handles metric files, this tier handles foot files, and the Expert tier handles archives.", "All three tiers import single files, with each tier adding more curves to the import.", "The Associate tier judges one file, this tier imports one file, and the Expert tier audits a delivery."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The progression is about what is being decided rather than about which files are handled. Adding curves up across files belongs to the Expert tier and not to this one.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'welldata' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null::text and ord = 1 and active;
  if v_state is null then raise exception 'bank course-names recut refused: no active row for welldata intermediate final ord 1'; end if;
  if v_state = 'other' then raise exception 'bank course-names recut refused: welldata intermediate final ord 1 matches neither its served nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'How do the three Well Data Management tiers divide the work?', options = '["The Associate tier reads headers, this tier reads data, and the Expert tier writes to the registry.", "The Associate tier handles metric files, this tier handles foot files, and the Expert tier handles archives.", "All three tiers import single files, with each tier adding more curves to the import.", "The Associate tier judges one file, this tier imports one file, and the Expert tier audits a delivery."]'::jsonb, explanation = 'The progression is about what is being decided rather than about which files are handled. Adding curves up across files belongs to the Expert tier and not to this one.'
     where app_slug = 'welldata' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null::text and ord = 1 and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'bank course-names recut refused: welldata intermediate final ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- welldata advanced module m06-the-campaign-workflow ord 1: prompt
  select case
           when prompt = 'What was the unit of work at each of the three Well Data Manager tiers?' and options = '["Every tier works one file, and the tiers differ only in how many checks they run on it.", "The Associate tier ran a campaign, and the two tiers above it narrowed to one file.", "The Associate tier read and quality controlled one file, the Professional tier imported one file into the project''s units and vocabulary, and this tier runs the delivery as a campaign.", "All three tiers work a delivery, at increasing levels of detail."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The campaign runs the Professional pipeline unchanged over a set. Nothing new is tested at this tier, and everything new is in the reading.' then 'old'
           when prompt = 'What was the unit of work at each of the three Well Data Management tiers?' and options = '["Every tier works one file, and the tiers differ only in how many checks they run on it.", "The Associate tier ran a campaign, and the two tiers above it narrowed to one file.", "The Associate tier read and quality controlled one file, the Professional tier imported one file into the project''s units and vocabulary, and this tier runs the delivery as a campaign.", "All three tiers work a delivery, at increasing levels of detail."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The campaign runs the Professional pipeline unchanged over a set. Nothing new is tested at this tier, and everything new is in the reading.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'welldata' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-campaign-workflow'::text and ord = 1 and active;
  if v_state is null then raise exception 'bank course-names recut refused: no active row for welldata advanced module m06-the-campaign-workflow ord 1'; end if;
  if v_state = 'other' then raise exception 'bank course-names recut refused: welldata advanced module m06-the-campaign-workflow ord 1 matches neither its served nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'What was the unit of work at each of the three Well Data Management tiers?', options = '["Every tier works one file, and the tiers differ only in how many checks they run on it.", "The Associate tier ran a campaign, and the two tiers above it narrowed to one file.", "The Associate tier read and quality controlled one file, the Professional tier imported one file into the project''s units and vocabulary, and this tier runs the delivery as a campaign.", "All three tiers work a delivery, at increasing levels of detail."]'::jsonb, explanation = 'The campaign runs the Professional pipeline unchanged over a set. Nothing new is tested at this tier, and everything new is in the reading.'
     where app_slug = 'welldata' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-campaign-workflow'::text and ord = 1 and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'bank course-names recut refused: welldata advanced module m06-the-campaign-workflow ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- welldata advanced module m06-the-campaign-workflow ord 14: explanation
  select case
           when prompt = 'In what order must a learner clear the gates before the Expert capstone unlocks?' and options = '["Every lesson read, then each module quiz passed at 70 percent, then the final exam at 75 percent, with the capstone available at any point after that.", "The capstone unlocks on enrollment, and the module quizzes and the final exam confirm the result afterwards.", "Every lesson read, then each module quiz passed at 75 percent, then the final exam at 70 percent.", "Any three module quizzes, then the final exam."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The server enforces the sequence, and three consecutive failed quiz attempts trigger a 24 hour cooldown. Passing the capstone grants the Expert certification in Well Data Manager.' then 'old'
           when prompt = 'In what order must a learner clear the gates before the Expert capstone unlocks?' and options = '["Every lesson read, then each module quiz passed at 70 percent, then the final exam at 75 percent, with the capstone available at any point after that.", "The capstone unlocks on enrollment, and the module quizzes and the final exam confirm the result afterwards.", "Every lesson read, then each module quiz passed at 75 percent, then the final exam at 70 percent.", "Any three module quizzes, then the final exam."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The server enforces the sequence, and three consecutive failed quiz attempts trigger a 24 hour cooldown. Passing the capstone grants the Expert certification in Well Data Management.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'welldata' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-campaign-workflow'::text and ord = 14 and active;
  if v_state is null then raise exception 'bank course-names recut refused: no active row for welldata advanced module m06-the-campaign-workflow ord 14'; end if;
  if v_state = 'other' then raise exception 'bank course-names recut refused: welldata advanced module m06-the-campaign-workflow ord 14 matches neither its served nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions
       set prompt = 'In what order must a learner clear the gates before the Expert capstone unlocks?', options = '["Every lesson read, then each module quiz passed at 70 percent, then the final exam at 75 percent, with the capstone available at any point after that.", "The capstone unlocks on enrollment, and the module quizzes and the final exam confirm the result afterwards.", "Every lesson read, then each module quiz passed at 75 percent, then the final exam at 70 percent.", "Any three module quizzes, then the final exam."]'::jsonb, explanation = 'The server enforces the sequence, and three consecutive failed quiz attempts trigger a 24 hour cooldown. Passing the capstone grants the Expert certification in Well Data Management.'
     where app_slug = 'welldata' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-campaign-workflow'::text and ord = 14 and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'bank course-names recut refused: welldata advanced module m06-the-campaign-workflow ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  select count(*) into v_count from public.academy_quiz_questions where app_slug = 'earthmodel' and active;
  if v_count <> 396 then raise exception 'bank course-names recut refused: earthmodel holds % active questions, expected 396', v_count; end if;
  select count(*) into v_count from public.academy_quiz_questions where app_slug = 'hygiene' and active;
  if v_count <> 396 then raise exception 'bank course-names recut refused: hygiene holds % active questions, expected 396', v_count; end if;
  select count(*) into v_count from public.academy_quiz_questions where app_slug = 'refinery' and active;
  if v_count <> 396 then raise exception 'bank course-names recut refused: refinery holds % active questions, expected 396', v_count; end if;
  select count(*) into v_count from public.academy_quiz_questions where app_slug = 'rockphysics' and active;
  if v_count <> 396 then raise exception 'bank course-names recut refused: rockphysics holds % active questions, expected 396', v_count; end if;
  select count(*) into v_count from public.academy_quiz_questions where app_slug = 'welldata' and active;
  if v_count <> 396 then raise exception 'bank course-names recut refused: welldata holds % active questions, expected 396', v_count; end if;
  raise notice 'bank course-names recut: % of 21 rows updated, % already recut', v_updated, 21 - v_updated;
end
$$;
