-- ==========================================================================
-- DIGEST-COPY RECUT: producedwater, question text only.
--
-- WHY. The live bank tells learners what "the digest" prints, points at numbered
-- SECTIONs of it, or names the authors' generator. The digest is the course
-- authors' internal reference file and no learner can see it. Each row below is
-- rewritten to name what the learner has: the course, the lesson, the lab or the
-- engine. Nothing else moves: no answer index, no option order, no ord, no
-- module key, no scope, no row count. Option lengths keep their rank.
--
-- SOURCE of the new text: the regenerated bank JSON under tools/course-banks/producedwater, built from its committed .py sources.
-- Rows: 11 (beginner 2, intermediate 1, advanced 8).
--
-- GUARDS. Each row is addressed by (app_slug, tier, scope, module_key, ord) and must
-- carry EITHER its published text exactly (then it is updated) OR the recut text
-- exactly (already applied, left alone). Anything else raises and the whole
-- transaction rolls back. Every update must touch exactly 1 row, and the course
-- must still hold its question count at the end. SAFE TO RE-RUN.
-- Published text was read from a replay of every question migration at origin/main,
-- FC9's recut (#181) and the B3 engine-strings recut (#184) included, so a row either
-- of those rewrote is expected to carry THEIR text: apply them first.
-- (docs/digest-recut/RECUT-producedwater.json carries OLD and NEW for every row).
-- ==========================================================================

do $$
declare
  v_state   text;
  v_count   integer;
  v_updated integer := 0;
  v_total   integer;
begin

  -- beginner m03-the-droplets ord 8
  select case
           when prompt = 'On the bin count sweep the digest divides the reported tail by twice the module''s own cdf below the span edge, and the column reads 1.000000000000 on every row. What does that rule out?' and options = '["That the bin count moves the answer, since a column of ones across four resolutions is what an invariance looks like.", "That the module takes its cdf on the diameter rather than the volume, putting the tail on the wrong variable.", "That the truncated tail is a binning artefact, since it is exactly the analytic tail of the distribution instead.", "That the bins have been normalised, since a set of bins that did not sum to the whole would leave that column somewhere other than one."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The check compares the module against a mathematical fact about the distribution it says it is using. A grid artefact would show up in that column at once as a departure from one.' then 'old'
           when prompt = 'On the bin count sweep the course divides the reported tail by twice the module''s own cdf below the span edge, and the column reads 1.000000000000 on every row. What does that rule out?' and options = '["That the bin count moves the answer, since a column of ones across four resolutions is what an invariance looks like.", "That the module takes its cdf on the diameter rather than the volume, putting the tail on the wrong variable.", "That the truncated tail is a binning artefact, since it is exactly the analytic tail of the distribution instead.", "That the bins have been normalised, since a set of bins that did not sum to the whole would leave that column somewhere other than one."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The check compares the module against a mathematical fact about the distribution it says it is using. A grid artefact would show up in that column at once as a departure from one.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'producedwater' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-the-droplets' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, producedwater refused: no row for beginner m03-the-droplets ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, producedwater refused: beginner m03-the-droplets ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'On the bin count sweep the course divides the reported tail by twice the module''s own cdf below the span edge, and the column reads 1.000000000000 on every row. What does that rule out?', options = '["That the bin count moves the answer, since a column of ones across four resolutions is what an invariance looks like.", "That the module takes its cdf on the diameter rather than the volume, putting the tail on the wrong variable.", "That the truncated tail is a binning artefact, since it is exactly the analytic tail of the distribution instead.", "That the bins have been normalised, since a set of bins that did not sum to the whole would leave that column somewhere other than one."]'::jsonb, explanation = 'The check compares the module against a mathematical fact about the distribution it says it is using. A grid artefact would show up in that column at once as a departure from one.'
     where app_slug = 'producedwater' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-the-droplets' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, producedwater refused: beginner m03-the-droplets ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m03-the-droplets ord 11
  select case
           when prompt = 'Where does this module warn on the droplet spread, and where does it stop answering?' and options = '["It warns outside 0.5 to 1 and refuses above 1.5, which is the widest row the digest sweeps and the last one that answers.", "It warns outside 0.5 to 1 and refuses above 2, because a wider spread than that is not what produced water carries.", "It warns above 1 only, since a tight distribution is always within what the log-normal form can describe.", "It refuses outside 0.5 to 1, because a spread outside the customary band would carry volume beyond the span the grid reaches."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The sigma of 1.5 answers and carries the warning, which is the ordinary pattern here: doubt is reported and the number still arrives, while a value the method has nothing to say about is declined by name.' then 'old'
           when prompt = 'Where does this module warn on the droplet spread, and where does it stop answering?' and options = '["It warns outside 0.5 to 1 and refuses above 1.5, which is the widest row the course sweeps and the last one that answers.", "It warns outside 0.5 to 1 and refuses above 2, because a wider spread than that is not what produced water carries.", "It warns above 1 only, since a tight distribution is always within what the log-normal form can describe.", "It refuses outside 0.5 to 1, because a spread outside the customary band would carry volume beyond the span the grid reaches."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The sigma of 1.5 answers and carries the warning, which is the ordinary pattern here: doubt is reported and the number still arrives, while a value the method has nothing to say about is declined by name.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'producedwater' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-the-droplets' and ord = 11;
  if v_state is null then raise exception 'digest-copy recut, producedwater refused: no row for beginner m03-the-droplets ord 11'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, producedwater refused: beginner m03-the-droplets ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Where does this module warn on the droplet spread, and where does it stop answering?', options = '["It warns outside 0.5 to 1 and refuses above 1.5, which is the widest row the course sweeps and the last one that answers.", "It warns outside 0.5 to 1 and refuses above 2, because a wider spread than that is not what produced water carries.", "It warns above 1 only, since a tight distribution is always within what the log-normal form can describe.", "It refuses outside 0.5 to 1, because a spread outside the customary band would carry volume beyond the span the grid reaches."]'::jsonb, explanation = 'The sigma of 1.5 answers and carries the warning, which is the ordinary pattern here: doubt is reported and the number still arrives, while a value the method has nothing to say about is declined by name.'
     where app_slug = 'producedwater' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-the-droplets' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, producedwater refused: beginner m03-the-droplets ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m02-the-hydrocyclone ord 8
  select case
           when prompt = 'The digest prints a derived column beside the bore sweep, the cut size multiplied by the square root of the bore. What does it read?' and options = '["0.828906 on the declared bore alone, and it drifts away from that figure at the two extremes of the span.", "1.000000 on every row, because the column is normalised against the module''s own declared bore of 0.035 m.", "0.828906 on every one of the five rows, across a tenfold span of bore from 0.01 to 0.1 m.", "It rises steadily with the bore, so the exponent is the stronger one."]'::jsonb and answer_index = 2 and explanation is not distinct from 'A derived column that holds still is a claim about the FORM of a relationship and it can be read by eye. A constant there says the cut goes as one over the root of the bore exactly.' then 'old'
           when prompt = 'The course prints a derived column beside the bore sweep, the cut size multiplied by the square root of the bore. What does it read?' and options = '["0.828906 on the declared bore alone, and it drifts away from that figure at the two extremes of the span.", "1.000000 on every row, because the column is normalised against the module''s own declared bore of 0.035 m.", "0.828906 on every one of the five rows, across a tenfold span of bore from 0.01 to 0.1 m.", "It rises steadily with the bore, so the exponent is the stronger one."]'::jsonb and answer_index = 2 and explanation is not distinct from 'A derived column that holds still is a claim about the FORM of a relationship and it can be read by eye. A constant there says the cut goes as one over the root of the bore exactly.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'producedwater' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-the-hydrocyclone' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, producedwater refused: no row for intermediate m02-the-hydrocyclone ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, producedwater refused: intermediate m02-the-hydrocyclone ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course prints a derived column beside the bore sweep, the cut size multiplied by the square root of the bore. What does it read?', options = '["0.828906 on the declared bore alone, and it drifts away from that figure at the two extremes of the span.", "1.000000 on every row, because the column is normalised against the module''s own declared bore of 0.035 m.", "0.828906 on every one of the five rows, across a tenfold span of bore from 0.01 to 0.1 m.", "It rises steadily with the bore, so the exponent is the stronger one."]'::jsonb, explanation = 'A derived column that holds still is a claim about the FORM of a relationship and it can be read by eye. A constant there says the cut goes as one over the root of the bore exactly.'
     where app_slug = 'producedwater' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-the-hydrocyclone' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, producedwater refused: intermediate m02-the-hydrocyclone ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 10
  select case
           when prompt = 'Which of the module''s identities is the one a bin set has to satisfy before anything measured on it can be trusted?' and options = '["The volume median of a log-normal bin set equals its own d50.", "The grade efficiency at the cut size is exactly one, since a cut size removes everything above it.", "The flotation cell count moves the cut size in proportion to the total gas fed to the unit.", "A plate pack cut is proportional to the channel height the pack is sliced into."]'::jsonb and answer_index = 0 and explanation is not distinct from 'On the UZERE inlet it returns 26.000000 micron against a typed 26, on every grid in the digest.' then 'old'
           when prompt = 'Which of the module''s identities is the one a bin set has to satisfy before anything measured on it can be trusted?' and options = '["The volume median of a log-normal bin set equals its own d50.", "The grade efficiency at the cut size is exactly one, since a cut size removes everything above it.", "The flotation cell count moves the cut size in proportion to the total gas fed to the unit.", "A plate pack cut is proportional to the channel height the pack is sliced into."]'::jsonb and answer_index = 0 and explanation is not distinct from 'On the UZERE inlet it returns 26.000000 micron against a typed 26, on every grid in the course.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'producedwater' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, producedwater refused: no row for advanced final ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, producedwater refused: advanced final ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which of the module''s identities is the one a bin set has to satisfy before anything measured on it can be trusted?', options = '["The volume median of a log-normal bin set equals its own d50.", "The grade efficiency at the cut size is exactly one, since a cut size removes everything above it.", "The flotation cell count moves the cut size in proportion to the total gas fed to the unit.", "A plate pack cut is proportional to the channel height the pack is sliced into."]'::jsonb, explanation = 'On the UZERE inlet it returns 26.000000 micron against a typed 26, on every grid in the course.'
     where app_slug = 'producedwater' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, producedwater refused: advanced final ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 26
  select case
           when prompt = 'At least one row per device in that file states NONE of that device''s own defaults. Why is that a rule rather than an accident?' and options = '["Because a suite whose every case runs at the defaults cannot tell a default from a derivation.", "Because a row at the defaults would duplicate the row the digest already prints for that device.", "Because the defaults are pinned by literal in the jest suite, so a case running at them checks nothing new.", "Because a golden row has to straddle a threshold, and no default sits on a threshold."]'::jsonb and answer_index = 0 and explanation is not distinct from 'A golden file has to be built to that rule. A case that runs at the defaults lets the code recall rather than compute.' then 'old'
           when prompt = 'At least one row per device in that file states NONE of that device''s own defaults. Why is that a rule rather than an accident?' and options = '["Because a suite whose every case runs at the defaults cannot tell a default from a derivation.", "Because a row at the defaults would duplicate the row the course already prints for that device.", "Because the defaults are pinned by literal in the jest suite, so a case running at them checks nothing new.", "Because a golden row has to straddle a threshold, and no default sits on a threshold."]'::jsonb and answer_index = 0 and explanation is not distinct from 'A golden file has to be built to that rule. A case that runs at the defaults lets the code recall rather than compute.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'producedwater' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 26;
  if v_state is null then raise exception 'digest-copy recut, producedwater refused: no row for advanced final ord 26'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, producedwater refused: advanced final ord 26 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'At least one row per device in that file states NONE of that device''s own defaults. Why is that a rule rather than an accident?', options = '["Because a suite whose every case runs at the defaults cannot tell a default from a derivation.", "Because a row at the defaults would duplicate the row the course already prints for that device.", "Because the defaults are pinned by literal in the jest suite, so a case running at them checks nothing new.", "Because a golden row has to straddle a threshold, and no default sits on a threshold."]'::jsonb, explanation = 'A golden file has to be built to that rule. A case that runs at the defaults lets the code recall rather than compute.'
     where app_slug = 'producedwater' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 26;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, producedwater refused: advanced final ord 26 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m04-the-band-and-the-balance ord 7
  select case
           when prompt = 'apiSeparator, plateInterceptor and hydrocyclone come out at 3.75e-14, 4.24e-14 and 3.38e-13 against the golden. What is being tolerated on those three rows?' and options = '["A tolerance of 1e-12, which is the figure the jest suite asserts the cyclone group to.", "The oracle''s own bisection step, which stops once its bracket is narrower than the gap shown.", "The six decimal print of this digest, which is where two figures stop being comparable.", "Nothing. Both sides are exact arguments about one geometry, so the gap is floating point noise and anything materially larger would be a real disagreement to go and find."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The engine inverts a balance and the oracle marches a droplet through the vessel and bisects on the size that just clears. Two closed arguments for one number should land on the same float.' then 'old'
           when prompt = 'apiSeparator, plateInterceptor and hydrocyclone come out at 3.75e-14, 4.24e-14 and 3.38e-13 against the golden. What is being tolerated on those three rows?' and options = '["A tolerance of 1e-12, which is the figure the jest suite asserts the cyclone group to.", "The oracle''s own bisection step, which stops once its bracket is narrower than the gap shown.", "The six decimal print of this course, which is where two figures stop being comparable.", "Nothing. Both sides are exact arguments about one geometry, so the gap is floating point noise and anything materially larger would be a real disagreement to go and find."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The engine inverts a balance and the oracle marches a droplet through the vessel and bisects on the size that just clears. Two closed arguments for one number should land on the same float.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'producedwater' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-band-and-the-balance' and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, producedwater refused: no row for advanced m04-the-band-and-the-balance ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, producedwater refused: advanced m04-the-band-and-the-balance ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'apiSeparator, plateInterceptor and hydrocyclone come out at 3.75e-14, 4.24e-14 and 3.38e-13 against the golden. What is being tolerated on those three rows?', options = '["A tolerance of 1e-12, which is the figure the jest suite asserts the cyclone group to.", "The oracle''s own bisection step, which stops once its bracket is narrower than the gap shown.", "The six decimal print of this course, which is where two figures stop being comparable.", "Nothing. Both sides are exact arguments about one geometry, so the gap is floating point noise and anything materially larger would be a real disagreement to go and find."]'::jsonb, explanation = 'The engine inverts a balance and the oracle marches a droplet through the vessel and bisects on the size that just clears. Two closed arguments for one number should land on the same float.'
     where app_slug = 'producedwater' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-band-and-the-balance' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, producedwater refused: advanced m04-the-band-and-the-balance ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m04-the-band-and-the-balance ord 9
  select case
           when prompt = 'What would it mean if the train golden ever matched the engine to machine precision?' and options = '["That the oracle had stopped being independent, because that is what two copies of one calculation produce.", "That the particle count had been raised until the sampling noise in the golden fell well under the precision this digest prints at.", "That the quadrature over the bins had converged, which is the property the default grid of 60 bins is chosen to deliver.", "That the engine had been rewritten to track particles, which is the route the golden takes on those rows."]'::jsonb and answer_index = 0 and explanation is not distinct from 'IDENTICAL TO TWELVE DECIMALS WOULD BE THE WEAKER RESULT on those rows. A gap is evidence in two directions.' then 'old'
           when prompt = 'What would it mean if the train golden ever matched the engine to machine precision?' and options = '["That the oracle had stopped being independent, because that is what two copies of one calculation produce.", "That the particle count had been raised until the sampling noise in the golden fell well under the precision this course prints at.", "That the quadrature over the bins had converged, which is the property the default grid of 60 bins is chosen to deliver.", "That the engine had been rewritten to track particles, which is the route the golden takes on those rows."]'::jsonb and answer_index = 0 and explanation is not distinct from 'IDENTICAL TO TWELVE DECIMALS WOULD BE THE WEAKER RESULT on those rows. A gap is evidence in two directions.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'producedwater' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-band-and-the-balance' and ord = 9;
  if v_state is null then raise exception 'digest-copy recut, producedwater refused: no row for advanced m04-the-band-and-the-balance ord 9'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, producedwater refused: advanced m04-the-band-and-the-balance ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What would it mean if the train golden ever matched the engine to machine precision?', options = '["That the oracle had stopped being independent, because that is what two copies of one calculation produce.", "That the particle count had been raised until the sampling noise in the golden fell well under the precision this course prints at.", "That the quadrature over the bins had converged, which is the property the default grid of 60 bins is chosen to deliver.", "That the engine had been rewritten to track particles, which is the route the golden takes on those rows."]'::jsonb, explanation = 'IDENTICAL TO TWELVE DECIMALS WOULD BE THE WEAKER RESULT on those rows. A gap is evidence in two directions.'
     where app_slug = 'producedwater' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-band-and-the-balance' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, producedwater refused: advanced m04-the-band-and-the-balance ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m04-the-band-and-the-balance ord 10
  select case
           when prompt = 'A reviewer finds a gap far SMALLER than the two methods being compared could justify. What does that indicate?' and options = '["That the tolerance on that whole family of published cases is far too loose and ought to be tightened until it sits exactly at the gap the reviewer has just observed.", "That the case sits inside a band both methods are stated to, where agreement is expected and carries no information.", "That the comparison is being made at the print precision of the digest rather than at full float.", "That the two sides are sharing something they were meant to derive separately, which is the quiet failure that lets a bent engine and a bent oracle agree perfectly."]'::jsonb and answer_index = 3 and explanation is not distinct from 'Before quoting any agreement, ask what the two routes were and what noise each of them carries.' then 'old'
           when prompt = 'A reviewer finds a gap far SMALLER than the two methods being compared could justify. What does that indicate?' and options = '["That the tolerance on that whole family of published cases is far too loose and ought to be tightened until it sits exactly at the gap the reviewer has just observed.", "That the case sits inside a band both methods are stated to, where agreement is expected and carries no information.", "That the comparison is being made at the print precision of the course rather than at full float.", "That the two sides are sharing something they were meant to derive separately, which is the quiet failure that lets a bent engine and a bent oracle agree perfectly."]'::jsonb and answer_index = 3 and explanation is not distinct from 'Before quoting any agreement, ask what the two routes were and what noise each of them carries.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'producedwater' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-band-and-the-balance' and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, producedwater refused: no row for advanced m04-the-band-and-the-balance ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, producedwater refused: advanced m04-the-band-and-the-balance ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A reviewer finds a gap far SMALLER than the two methods being compared could justify. What does that indicate?', options = '["That the tolerance on that whole family of published cases is far too loose and ought to be tightened until it sits exactly at the gap the reviewer has just observed.", "That the case sits inside a band both methods are stated to, where agreement is expected and carries no information.", "That the comparison is being made at the print precision of the course rather than at full float.", "That the two sides are sharing something they were meant to derive separately, which is the quiet failure that lets a bent engine and a bent oracle agree perfectly."]'::jsonb, explanation = 'Before quoting any agreement, ask what the two routes were and what noise each of them carries.'
     where app_slug = 'producedwater' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-the-band-and-the-balance' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, producedwater refused: advanced m04-the-band-and-the-balance ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-what-a-gate-can-catch ord 7
  select case
           when prompt = 'This course found a defect of its own in the media filter while building the digest against the already repaired engine. What was it, and what did the second repair put in its place?' and options = '["It clamped its own loading rate up to a floor and said nothing, so beds of completely different area reported the same filter coefficient and the same cut size to every digit, and the repair is to REFUSE by name.", "It refused every bed below its reference loading of 10 m/hr, and the repair lowered that floor to 1 m/hr.", "It warned below the floor and answered anyway, and the repair turned that warning into a clamp reported on the return.", "It took its loading rate from the bed depth rather than the bed area, and the repair made the area an input."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The clamp was in the oracle too, so the independent check agreed with it. A guard that quietly moves an input is a guard that deletes the input.' then 'old'
           when prompt = 'This course found a defect of its own in the media filter while building its worked tables against the already repaired engine. What was it, and what did the second repair put in its place?' and options = '["It clamped its own loading rate up to a floor and said nothing, so beds of completely different area reported the same filter coefficient and the same cut size to every digit, and the repair is to REFUSE by name.", "It refused every bed below its reference loading of 10 m/hr, and the repair lowered that floor to 1 m/hr.", "It warned below the floor and answered anyway, and the repair turned that warning into a clamp reported on the return.", "It took its loading rate from the bed depth rather than the bed area, and the repair made the area an input."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The clamp was in the oracle too, so the independent check agreed with it. A guard that quietly moves an input is a guard that deletes the input.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'producedwater' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-what-a-gate-can-catch' and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, producedwater refused: no row for advanced m05-what-a-gate-can-catch ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, producedwater refused: advanced m05-what-a-gate-can-catch ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'This course found a defect of its own in the media filter while building its worked tables against the already repaired engine. What was it, and what did the second repair put in its place?', options = '["It clamped its own loading rate up to a floor and said nothing, so beds of completely different area reported the same filter coefficient and the same cut size to every digit, and the repair is to REFUSE by name.", "It refused every bed below its reference loading of 10 m/hr, and the repair lowered that floor to 1 m/hr.", "It warned below the floor and answered anyway, and the repair turned that warning into a clamp reported on the return.", "It took its loading rate from the bed depth rather than the bed area, and the repair made the area an input."]'::jsonb, explanation = 'The clamp was in the oracle too, so the independent check agreed with it. A guard that quietly moves an input is a guard that deletes the input.'
     where app_slug = 'producedwater' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-what-a-gate-can-catch' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, producedwater refused: advanced m05-what-a-gate-can-catch ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-what-a-gate-can-catch ord 12
  select case
           when prompt = 'A defect planted in the engine and the oracle at the same time is the hard case, because a golden regenerated from a bent oracle agrees with a bent engine perfectly. What catches those now?' and options = '["The measured gap table printed in this digest, since a bent pair of files will agree with itself very much more closely than two genuinely independent routes ever should.", "Three things: a route with no place to type the constant, the identities that need no source, and an explicit pin with the value typed by hand in the test file.", "The negative controls carried by every single family in the whole suite, each of which is asserted to stay green on every row of the family it belongs to.", "The straddled warning fields in the golden file, since a bent pair of files moves a threshold and a straddle on both sides of it will detect that move at once."]'::jsonb and answer_index = 1 and explanation is not distinct from 'None of those three is a comparison between the engine and its golden. They are the checks that step outside the pair.' then 'old'
           when prompt = 'A defect planted in the engine and the oracle at the same time is the hard case, because a golden regenerated from a bent oracle agrees with a bent engine perfectly. What catches those now?' and options = '["The measured gap table printed in this course, since a bent pair of files will agree with itself very much more closely than two genuinely independent routes ever should.", "Three things: a route with no place to type the constant, the identities that need no source, and an explicit pin with the value typed by hand in the test file.", "The negative controls carried by every single family in the whole suite, each of which is asserted to stay green on every row of the family it belongs to.", "The straddled warning fields in the golden file, since a bent pair of files moves a threshold and a straddle on both sides of it will detect that move at once."]'::jsonb and answer_index = 1 and explanation is not distinct from 'None of those three is a comparison between the engine and its golden. They are the checks that step outside the pair.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'producedwater' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-what-a-gate-can-catch' and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, producedwater refused: no row for advanced m05-what-a-gate-can-catch ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, producedwater refused: advanced m05-what-a-gate-can-catch ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A defect planted in the engine and the oracle at the same time is the hard case, because a golden regenerated from a bent oracle agrees with a bent engine perfectly. What catches those now?', options = '["The measured gap table printed in this course, since a bent pair of files will agree with itself very much more closely than two genuinely independent routes ever should.", "Three things: a route with no place to type the constant, the identities that need no source, and an explicit pin with the value typed by hand in the test file.", "The negative controls carried by every single family in the whole suite, each of which is asserted to stay green on every row of the family it belongs to.", "The straddled warning fields in the golden file, since a bent pair of files moves a threshold and a straddle on both sides of it will detect that move at once."]'::jsonb, explanation = 'None of those three is a comparison between the engine and its golden. They are the checks that step outside the pair.'
     where app_slug = 'producedwater' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-what-a-gate-can-catch' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, producedwater refused: advanced m05-what-a-gate-can-catch ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-where-the-method-stops ord 4
  select case
           when prompt = 'What does this module state about the dissolved and soluble oil floor?' and options = '["That it is the outlet concentration below which no device in this module removes anything at all, and that it is reported back on the return as the truncated tail.", "That it is declared in the frozen constants object and applied to every train return without being asked for.", "That there is one under any outlet a train can reach, and that no value for it is stated here, so the value is the caller''s own.", "That it exists, and that it customarily falls between the two figures the verdict block of the digest prints."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The existence is stated on every train return. The floor only matters where a train''s DISPERSED prediction falls below it.' then 'old'
           when prompt = 'What does this module state about the dissolved and soluble oil floor?' and options = '["That it is the outlet concentration below which no device in this module removes anything at all, and that it is reported back on the return as the truncated tail.", "That it is declared in the frozen constants object and applied to every train return without being asked for.", "That there is one under any outlet a train can reach, and that no value for it is stated here, so the value is the caller''s own.", "That it exists, and that it customarily falls between the two figures the verdict block of the course prints."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The existence is stated on every train return. The floor only matters where a train''s DISPERSED prediction falls below it.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'producedwater' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-where-the-method-stops' and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, producedwater refused: no row for advanced m06-where-the-method-stops ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, producedwater refused: advanced m06-where-the-method-stops ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does this module state about the dissolved and soluble oil floor?', options = '["That it is the outlet concentration below which no device in this module removes anything at all, and that it is reported back on the return as the truncated tail.", "That it is declared in the frozen constants object and applied to every train return without being asked for.", "That there is one under any outlet a train can reach, and that no value for it is stated here, so the value is the caller''s own.", "That it exists, and that it customarily falls between the two figures the verdict block of the course prints."]'::jsonb, explanation = 'The existence is stated on every train return. The floor only matters where a train''s DISPERSED prediction falls below it.'
     where app_slug = 'producedwater' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-where-the-method-stops' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, producedwater refused: advanced m06-where-the-method-stops ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  select count(*) into v_total from public.academy_quiz_questions where app_slug = 'producedwater';
  if v_total <> 396 then raise exception 'digest-copy recut, producedwater refused: the course holds % questions, expected 396', v_total; end if;
  raise notice 'digest-copy recut, producedwater: % of 11 rows updated, the rest already carried the recut text', v_updated;
end $$;
