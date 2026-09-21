-- ==========================================================================
-- DIGEST-COPY RECUT: carbon, question text only.
--
-- WHY. The live bank tells learners what "the digest" prints, points at numbered
-- SECTIONs of it, or names the authors' generator. The digest is the course
-- authors' internal reference file and no learner can see it. Each row below is
-- rewritten to name what the learner has: the course, the lesson, the lab or the
-- engine. Nothing else moves: no answer index, no option order, no ord, no
-- module key, no scope, no row count. Option lengths keep their rank.
--
-- SOURCE of the new text: the regenerated bank JSON under tools/course-banks/carbon, built from its committed .py sources.
-- Rows: 334 (beginner 130, intermediate 96, advanced 108).
--
-- GUARDS. Each row is addressed by (app_slug, tier, scope, module_key, ord) and must
-- carry EITHER its published text exactly (then it is updated) OR the recut text
-- exactly (already applied, left alone). Anything else raises and the whole
-- transaction rolls back. Every update must touch exactly 1 row, and the course
-- must still hold its question count at the end. SAFE TO RE-RUN.
-- Published text was read from a replay of every question migration at origin/main
-- (docs/digest-recut/RECUT-carbon.json carries OLD and NEW for every row).
-- ==========================================================================

do $$
declare
  v_state   text;
  v_count   integer;
  v_updated integer := 0;
  v_total   integer;
begin

  -- beginner final ord 1
  select case
           when prompt = 'The digest separates a blank box from an argument left out of the call. How does each reach the engine?' and options = '["Both arrive as 0, and the interval check on the destruction efficiency refuses each of them.", "A blank takes the stated default; an argument left out of the call is refused as required.", "A blank arrives as an empty string or null; a left-out argument takes its stated default.", "Both take the stated default wherever one exists, and are refused only where none exists."]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 2 opens with this distinction. It prints a blank or a null flare efficiency refused as required, and the same argument left out of the call answering destructionEfficiencyFraction 1, its stated default of complete combustion.' then 'old'
           when prompt = 'The course separates a blank box from an argument left out of the call. How does each reach the engine?' and options = '["Both arrive as 0, and the interval check on the destruction efficiency refuses each of them.", "A blank takes the stated default; an argument left out of the call is refused as required.", "A blank arrives as an empty string or null; a left-out argument takes its stated default.", "Both take the stated default wherever one exists, and are refused only where none exists."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course opens with this distinction. It prints a blank or a null flare efficiency refused as required, and the same argument left out of the call answering destructionEfficiencyFraction 1, its stated default of complete combustion.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner final ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner final ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course separates a blank box from an argument left out of the call. How does each reach the engine?', options = '["Both arrive as 0, and the interval check on the destruction efficiency refuses each of them.", "A blank takes the stated default; an argument left out of the call is refused as required.", "A blank arrives as an empty string or null; a left-out argument takes its stated default.", "Both take the stated default wherever one exists, and are refused only where none exists."]'::jsonb, explanation = 'The course opens with this distinction. It prints a blank or a null flare efficiency refused as required, and the same argument left out of the call answering destructionEfficiencyFraction 1, its stated default of complete combustion.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner final ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 2
  select case
           when prompt = 'Which module does the Carbon Footprint & Abatement Studio call?' and options = '["carbonAbatement", "energyEfficiency", "energyEfficiency, through priceSaving", "energyEfficiency for its fuel table"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 1 pairs each studio with one module: the Carbon Footprint & Abatement Studio with carbonAbatement, the Efficiency Studio with energyEfficiency.' then 'old'
           when prompt = 'Which module does the Carbon Footprint & Abatement Studio call?' and options = '["carbonAbatement", "energyEfficiency", "energyEfficiency, through priceSaving", "energyEfficiency for its fuel table"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course pairs each studio with one module: the Carbon Footprint & Abatement Studio with carbonAbatement, the Efficiency Studio with energyEfficiency.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner final ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner final ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which module does the Carbon Footprint & Abatement Studio call?', options = '["carbonAbatement", "energyEfficiency", "energyEfficiency, through priceSaving", "energyEfficiency for its fuel table"]'::jsonb, explanation = 'The course pairs each studio with one module: the Carbon Footprint & Abatement Studio with carbonAbatement, the Efficiency Studio with energyEfficiency.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner final ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 3
  select case
           when prompt = 'Which label does the Scope 2 total carry in buildInventory''s output?' and options = '["Scope 2 (direct)", "Scope 2 (energy and travel)", "Scope 2 (indirect, all other)", "Scope 2 (purchased energy)"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The SECTION 7 totals table reads Scope 1 (direct), Scope 2 (purchased energy) and Total, Scope 1 and Scope 2.' then 'old'
           when prompt = 'Which label does the Scope 2 total carry in buildInventory''s output?' and options = '["Scope 2 (direct)", "Scope 2 (energy and travel)", "Scope 2 (indirect, all other)", "Scope 2 (purchased energy)"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The lab''s totals table reads Scope 1 (direct), Scope 2 (purchased energy) and Total, Scope 1 and Scope 2.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner final ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner final ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which label does the Scope 2 total carry in buildInventory''s output?', options = '["Scope 2 (direct)", "Scope 2 (energy and travel)", "Scope 2 (indirect, all other)", "Scope 2 (purchased energy)"]'::jsonb, explanation = 'The lab''s totals table reads Scope 1 (direct), Scope 2 (purchased energy) and Total, Scope 1 and Scope 2.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner final ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 4
  select case
           when prompt = 'Refusing an intensity with no boundary, the engine names two figures that differ for one plant. Which two?' and options = '["Tonnes per barrel produced and tonnes per barrel exported", "Tonnes per tonne charged and tonnes per tonne of saleable product", "The Scope 1 intensity and the Scope 2 intensity of one plant", "tCO2e on the AR6 sets and tCO2e on the AR5 sets of one year"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The carbonIntensity refusal in SECTION 2 names tonnes per tonne charged and tonnes per tonne of saleable product. The Igbogene boundaries are per barrel, and they are inputs to the call.' then 'old'
           when prompt = 'Refusing an intensity with no boundary, the engine names two figures that differ for one plant. Which two?' and options = '["Tonnes per barrel produced and tonnes per barrel exported", "Tonnes per tonne charged and tonnes per tonne of saleable product", "The Scope 1 intensity and the Scope 2 intensity of one plant", "tCO2e on the AR6 sets and tCO2e on the AR5 sets of one year"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The carbonIntensity refusal the engine returns names tonnes per tonne charged and tonnes per tonne of saleable product. The Igbogene boundaries are per barrel, and they are inputs to the call.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner final ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner final ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Refusing an intensity with no boundary, the engine names two figures that differ for one plant. Which two?', options = '["Tonnes per barrel produced and tonnes per barrel exported", "Tonnes per tonne charged and tonnes per tonne of saleable product", "The Scope 1 intensity and the Scope 2 intensity of one plant", "tCO2e on the AR6 sets and tCO2e on the AR5 sets of one year"]'::jsonb, explanation = 'The carbonIntensity refusal the engine returns names tonnes per tonne charged and tonnes per tonne of saleable product. The Igbogene boundaries are per barrel, and they are inputs to the call.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner final ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 5
  select case
           when prompt = 'Which factor unit does the Purchased electricity line carry?' and options = '["tCO2/tCO2", "tCO2/MWh", "tCH4/t", "tCH4/tCH4"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 7 prints the factor unit tCO2/MWh on Purchased electricity, beside Igbogene''s invented factor of 0.41. tCO2/tCO2 and tCH4/tCH4 belong to the atom-balance lines and tCH4/t to the vented line.' then 'old'
           when prompt = 'Which factor unit does the Purchased electricity line carry?' and options = '["tCO2/tCO2", "tCO2/MWh", "tCH4/t", "tCH4/tCH4"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The lab prints the factor unit tCO2/MWh on Purchased electricity, beside Igbogene''s invented factor of 0.41. tCO2/tCO2 and tCH4/tCH4 belong to the atom-balance lines and tCH4/t to the vented line.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner final ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner final ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which factor unit does the Purchased electricity line carry?', options = '["tCO2/tCO2", "tCO2/MWh", "tCH4/t", "tCH4/tCH4"]'::jsonb, explanation = 'The lab prints the factor unit tCO2/MWh on Purchased electricity, beside Igbogene''s invented factor of 0.41. tCO2/tCO2 and tCH4/tCH4 belong to the atom-balance lines and tCH4/t to the vented line.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner final ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 6
  select case
           when prompt = 'Typing 98 as the flare''s efficiency, meant as a percentage, produces what?' and options = '["It computes at 0.98, reading the 98 as a percentage", "It computes at the stated default of complete combustion", "REFUSED: A fuel quantity and a carbon content cannot be negative.", "REFUSED: The destruction efficiency must lie in (0, 1]."]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 2 prints this refusal for 98 typed as a percentage, the same sentence it prints for 0. The flare''s stated efficiency is typed as the fraction 0.98.' then 'old'
           when prompt = 'Typing 98 as the flare''s efficiency, meant as a percentage, produces what?' and options = '["It computes at 0.98, reading the 98 as a percentage", "It computes at the stated default of complete combustion", "REFUSED: A fuel quantity and a carbon content cannot be negative.", "REFUSED: The destruction efficiency must lie in (0, 1]."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The engine returns this refusal for 98 typed as a percentage, the same sentence it returns for 0. The flare''s stated efficiency is typed as the fraction 0.98.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner final ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner final ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Typing 98 as the flare''s efficiency, meant as a percentage, produces what?', options = '["It computes at 0.98, reading the 98 as a percentage", "It computes at the stated default of complete combustion", "REFUSED: A fuel quantity and a carbon content cannot be negative.", "REFUSED: The destruction efficiency must lie in (0, 1]."]'::jsonb, explanation = 'The engine returns this refusal for 98 typed as a percentage, the same sentence it returns for 0. The flare''s stated efficiency is typed as the fraction 0.98.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner final ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 7
  select case
           when prompt = 'Which pair does the 1000 kmol table print at 0.99?' and options = '["43.569 t of CO2 and 0.160 t of methane", "44.009 t of CO2 and 0.160 t of methane", "43.129 t of CO2 and 0.321 t of methane", "43.569 t of CO2 and 0.802 t of methane"]'::jsonb and answer_index = 0 and explanation is not distinct from 'Row 0.99 of the SECTION 3 table: co2Tonnes 43.569, ch4Tonnes 0.160. 44.009 belongs to complete combustion, and 0.321 and 0.802 are the methane at 0.98 and 0.95.' then 'old'
           when prompt = 'Which pair does the 1000 kmol table print at 0.99?' and options = '["43.569 t of CO2 and 0.160 t of methane", "44.009 t of CO2 and 0.160 t of methane", "43.129 t of CO2 and 0.321 t of methane", "43.569 t of CO2 and 0.802 t of methane"]'::jsonb and answer_index = 0 and explanation is not distinct from 'Row 0.99 of the lesson''s table: co2Tonnes 43.569, ch4Tonnes 0.160. 44.009 belongs to complete combustion, and 0.321 and 0.802 are the methane at 0.98 and 0.95.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner final ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner final ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which pair does the 1000 kmol table print at 0.99?', options = '["43.569 t of CO2 and 0.160 t of methane", "44.009 t of CO2 and 0.160 t of methane", "43.129 t of CO2 and 0.321 t of methane", "43.569 t of CO2 and 0.802 t of methane"]'::jsonb, explanation = 'Row 0.99 of the lesson''s table: co2Tonnes 43.569, ch4Tonnes 0.160. 44.009 belongs to complete combustion, and 0.321 and 0.802 are the methane at 0.98 and 0.95.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner final ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 8
  select case
           when prompt = 'Typed at 1.15 kmol of carbon per kmol, with the fuel unchanged, what do the Igbogene heaters emit?' and options = '["23121.448 t", "21212.338 t", "24394.189 t", "25799.177 t"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The carbon per kmol table in SECTION 4 gives 24394.189 at 1.15. 25799.177 is not a heater figure; it is an inventory total with two blocked lines.' then 'old'
           when prompt = 'Typed at 1.15 kmol of carbon per kmol, with the fuel unchanged, what do the Igbogene heaters emit?' and options = '["23121.448 t", "21212.338 t", "24394.189 t", "25799.177 t"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The carbon per kmol table in the course gives 24394.189 at 1.15. 25799.177 is not a heater figure; it is an inventory total with two blocked lines.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner final ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner final ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Typed at 1.15 kmol of carbon per kmol, with the fuel unchanged, what do the Igbogene heaters emit?', options = '["23121.448 t", "21212.338 t", "24394.189 t", "25799.177 t"]'::jsonb, explanation = 'The carbon per kmol table in the course gives 24394.189 at 1.15. 25799.177 is not a heater figure; it is an inventory total with two blocked lines.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner final ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 9
  select case
           when prompt = 'Which pair is the Igbogene heaters'' 0.999 row?' and options = '["co2Tonnes 23121.448, ch4Tonnes 8.429", "co2Tonnes 23005.841, ch4Tonnes 42.143", "co2Tonnes 23098.327, ch4Tonnes 42.143", "co2Tonnes 23098.327, ch4Tonnes 8.429"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 4''s lower-efficiency table: 0.999 gives 23098.327 and 8.429; 0.995 gives 23005.841 and 42.143.' then 'old'
           when prompt = 'Which pair is the Igbogene heaters'' 0.999 row?' and options = '["co2Tonnes 23121.448, ch4Tonnes 8.429", "co2Tonnes 23005.841, ch4Tonnes 42.143", "co2Tonnes 23098.327, ch4Tonnes 42.143", "co2Tonnes 23098.327, ch4Tonnes 8.429"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course''s lower-efficiency table: 0.999 gives 23098.327 and 8.429; 0.995 gives 23005.841 and 42.143.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 9;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner final ord 9'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner final ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which pair is the Igbogene heaters'' 0.999 row?', options = '["co2Tonnes 23121.448, ch4Tonnes 8.429", "co2Tonnes 23005.841, ch4Tonnes 42.143", "co2Tonnes 23098.327, ch4Tonnes 42.143", "co2Tonnes 23098.327, ch4Tonnes 8.429"]'::jsonb, explanation = 'The course''s lower-efficiency table: 0.999 gives 23098.327 and 8.429; 0.995 gives 23005.841 and 42.143.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner final ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 10
  select case
           when prompt = 'Which carbonAbatement constant reads 12.011?' and options = '["MW_CH4, the molar mass of methane", "MW_C, the molar mass of carbon", "MW_CO2, the molar mass of CO2", "SCOPE, beside ONE 1 and TWO 2"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The constants block of SECTION 1 lists MW_C as 12.011, beside MW_CO2 44.009 and MW_CH4 16.043.' then 'old'
           when prompt = 'Which carbonAbatement constant reads 12.011?' and options = '["MW_CH4, the molar mass of methane", "MW_C, the molar mass of carbon", "MW_CO2, the molar mass of CO2", "SCOPE, beside ONE 1 and TWO 2"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course''s constants block lists MW_C as 12.011, beside MW_CO2 44.009 and MW_CH4 16.043.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner final ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner final ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which carbonAbatement constant reads 12.011?', options = '["MW_CH4, the molar mass of methane", "MW_C, the molar mass of carbon", "MW_CO2, the molar mass of CO2", "SCOPE, beside ONE 1 and TWO 2"]'::jsonb, explanation = 'The course''s constants block lists MW_C as 12.011, beside MW_CO2 44.009 and MW_CH4 16.043.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner final ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 12
  select case
           when prompt = 'Which figure is the Igbogene flare''s CO2 when it burns at 0.9?' and options = '["2124.711", "2236.537", "2012.884", "2191.807"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The flare row at 0.9 in SECTION 5 reads co2Tonnes 2012.884, beside 81.531 t of methane.' then 'old'
           when prompt = 'Which figure is the Igbogene flare''s CO2 when it burns at 0.9?' and options = '["2124.711", "2236.537", "2012.884", "2191.807"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The flare row at 0.9 in the lab reads co2Tonnes 2012.884, beside 81.531 t of methane.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner final ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner final ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which figure is the Igbogene flare''s CO2 when it burns at 0.9?', options = '["2124.711", "2236.537", "2012.884", "2191.807"]'::jsonb, explanation = 'The flare row at 0.9 in the lab reads co2Tonnes 2012.884, beside 81.531 t of methane.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner final ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 13
  select case
           when prompt = 'Which row of the flare table totals 2457.133 tCO2e?' and options = '["0.98, with 16.306 t of methane", "0.95, with 40.765 t of methane", "0.9, with 81.531 t of methane", "0.99, with 8.153 t of methane"]'::jsonb and answer_index = 3 and explanation is not distinct from 'In SECTION 5 the 0.99 row prints a flare total of 2457.133 and ch4Tonnes 8.153. Rows 0.98, 0.95 and 0.9 total 2677.729, 3339.515 and 4442.493.' then 'old'
           when prompt = 'Which row of the flare table totals 2457.133 tCO2e?' and options = '["0.98, with 16.306 t of methane", "0.95, with 40.765 t of methane", "0.9, with 81.531 t of methane", "0.99, with 8.153 t of methane"]'::jsonb and answer_index = 3 and explanation is not distinct from 'In the lab the 0.99 row prints a flare total of 2457.133 and ch4Tonnes 8.153. Rows 0.98, 0.95 and 0.9 total 2677.729, 3339.515 and 4442.493.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner final ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner final ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which row of the flare table totals 2457.133 tCO2e?', options = '["0.98, with 16.306 t of methane", "0.95, with 40.765 t of methane", "0.9, with 81.531 t of methane", "0.99, with 8.153 t of methane"]'::jsonb, explanation = 'In the lab the 0.99 row prints a flare total of 2457.133 and ch4Tonnes 8.153. Rows 0.98, 0.95 and 0.9 total 2677.729, 3339.515 and 4442.493.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner final ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 14
  select case
           when prompt = 'Read the 0.95 row of the Igbogene flare table. What is ch4Tonnes?' and options = '["81.531 t of methane", "40.765 t of methane", "16.306 t of methane", "1214.805 t of methane"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 5, row 0.95: ch4Tonnes 40.765. Its methane line, 1214.805, is in tCO2e and is a different quantity.' then 'old'
           when prompt = 'Read the 0.95 row of the Igbogene flare table. What is ch4Tonnes?' and options = '["81.531 t of methane", "40.765 t of methane", "16.306 t of methane", "1214.805 t of methane"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The lab''s flare table, row 0.95: ch4Tonnes 40.765. Its methane line, 1214.805, is in tCO2e and is a different quantity.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 14;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner final ord 14'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner final ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Read the 0.95 row of the Igbogene flare table. What is ch4Tonnes?', options = '["81.531 t of methane", "40.765 t of methane", "16.306 t of methane", "1214.805 t of methane"]'::jsonb, explanation = 'The lab''s flare table, row 0.95: ch4Tonnes 40.765. Its methane line, 1214.805, is in tCO2e and is a different quantity.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner final ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 15
  select case
           when prompt = 'The escaped-carbon note ends with an instruction for a user holding a measurement. What is it?' and options = '["File the measurement in the compliance register", "Switch the set to the non-fossil methane value", "Override it", "Leave the flare efficiency blank until refused"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The last sentence of the escaped-carbon note in SECTION 5 is "Override it if you have measured otherwise."' then 'old'
           when prompt = 'The escaped-carbon note ends with an instruction for a user holding a measurement. What is it?' and options = '["File the measurement in the compliance register", "Switch the set to the non-fossil methane value", "Override it", "Leave the flare efficiency blank until refused"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The last sentence of the escaped-carbon note the course quotes is "Override it if you have measured otherwise."' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 15;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner final ord 15'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner final ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The escaped-carbon note ends with an instruction for a user holding a measurement. What is it?', options = '["File the measurement in the compliance register", "Switch the set to the non-fossil methane value", "Override it", "Leave the flare efficiency blank until refused"]'::jsonb, explanation = 'The last sentence of the escaped-carbon note the course quotes is "Override it if you have measured otherwise."'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner final ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 16
  select case
           when prompt = 'A source is kept outside the boundary on purpose, excluded true. How many lines does atomBalanceLines hand the inventory?' and options = '["0 lines", "1 blocked line", "2 lines at 0.000 t", "1 unsourced line"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 9 prints 0 lines for excluded true. A refused flare, by contrast, arrives as one blocked line labelled Flaring.' then 'old'
           when prompt = 'A source is kept outside the boundary on purpose, excluded true. How many lines does atomBalanceLines hand the inventory?' and options = '["0 lines", "1 blocked line", "2 lines at 0.000 t", "1 unsourced line"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course prints 0 lines for excluded true. A refused flare, by contrast, arrives as one blocked line labelled Flaring.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 16;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner final ord 16'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner final ord 16 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A source is kept outside the boundary on purpose, excluded true. How many lines does atomBalanceLines hand the inventory?', options = '["0 lines", "1 blocked line", "2 lines at 0.000 t", "1 unsourced line"]'::jsonb, explanation = 'The course prints 0 lines for excluded true. A refused flare, by contrast, arrives as one blocked line labelled Flaring.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 16;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner final ord 16 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 17
  select case
           when prompt = 'On the AR5 non-fossil set, the flare''s escaped carbon becomes a line of how many tCO2e?' and options = '["440.265 tCO2e", "489.183 tCO2e", "485.922 tCO2e", "456.571 tCO2e"]'::jsonb and answer_index = 3 and explanation is not distinct from '456.571 is the AR5 non-fossil entry in the SECTION 8 methane table; 440.265 and 489.183 are AR6 non-fossil and AR5 fossil.' then 'old'
           when prompt = 'On the AR5 non-fossil set, the flare''s escaped carbon becomes a line of how many tCO2e?' and options = '["440.265 tCO2e", "489.183 tCO2e", "485.922 tCO2e", "456.571 tCO2e"]'::jsonb and answer_index = 3 and explanation is not distinct from '456.571 is the AR5 non-fossil entry in the lab''s methane table; 440.265 and 489.183 are AR6 non-fossil and AR5 fossil.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 17;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner final ord 17'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner final ord 17 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'On the AR5 non-fossil set, the flare''s escaped carbon becomes a line of how many tCO2e?', options = '["440.265 tCO2e", "489.183 tCO2e", "485.922 tCO2e", "456.571 tCO2e"]'::jsonb, explanation = '456.571 is the AR5 non-fossil entry in the lab''s methane table; 440.265 and 489.183 are AR6 non-fossil and AR5 fossil.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 17;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner final ord 17 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 18
  select case
           when prompt = 'How far above or below the course set does the digest place the Igbogene total on AR5 fossil methane?' and options = '["-443.257 tCO2e", "31.661 tCO2e", "-284.951 tCO2e", "0.000 tCO2e"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 8 reads 42977.438 for AR5 fossil, and its computed-here column puts that 31.661 above the course set''s 42945.777.' then 'old'
           when prompt = 'How far above or below the course set does the course place the Igbogene total on AR5 fossil methane?' and options = '["-443.257 tCO2e", "31.661 tCO2e", "-284.951 tCO2e", "0.000 tCO2e"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The lab reads 42977.438 for AR5 fossil, and its computed-here column puts that 31.661 above the course set''s 42945.777.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 18;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner final ord 18'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner final ord 18 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'How far above or below the course set does the course place the Igbogene total on AR5 fossil methane?', options = '["-443.257 tCO2e", "31.661 tCO2e", "-284.951 tCO2e", "0.000 tCO2e"]'::jsonb, explanation = 'The lab reads 42977.438 for AR5 fossil, and its computed-here column puts that 31.661 above the course set''s 42945.777.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 18;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner final ord 18 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 20
  select case
           when prompt = 'What N2O value sits in the course''s own set?' and options = '["273", "265", "29.8", "27"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course''s set is CH4 29.8 and N2O 273 (SECTION 6). The AR5 sets carry 265.' then 'old'
           when prompt = 'What N2O value sits in the course''s own set?' and options = '["273", "265", "29.8", "27"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course''s set is CH4 29.8 and N2O 273. The AR5 sets carry 265.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 20;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner final ord 20'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner final ord 20 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What N2O value sits in the course''s own set?', options = '["273", "265", "29.8", "27"]'::jsonb, explanation = 'The course''s set is CH4 29.8 and N2O 273. The AR5 sets carry 265.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 20;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner final ord 20 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 21
  select case
           when prompt = 'makeGwpSet is given a label and no values. What does the set read?' and options = '["declared true", "declared true, with 0 gases", "refused, with no set at all", "declared false"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The SECTION 6 declared table reads false for a label with no values and false for values with no label.' then 'old'
           when prompt = 'makeGwpSet is given a label and no values. What does the set read?' and options = '["declared true", "declared true, with 0 gases", "refused, with no set at all", "declared false"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course''s declared table reads false for a label with no values and false for values with no label.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 21;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner final ord 21'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner final ord 21 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'makeGwpSet is given a label and no values. What does the set read?', options = '["declared true", "declared true, with 0 gases", "refused, with no set at all", "declared false"]'::jsonb, explanation = 'The course''s declared table reads false for a label with no values and false for values with no label.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 21;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner final ord 21 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 22
  select case
           when prompt = 'The flare efficiency is entered with the GWP set already declared. What reasons for not being reportable does buildInventory then give?' and options = '["the global warming potential set is not declared; 3 line(s) could not be computed", "1 factor(s) have no source or version; 1 line(s) could not be computed", "1 factor(s) have no source or version; 2 line(s) could not be computed", "none, and reportable reads true"]'::jsonb and answer_index = 1 and explanation is not distinct from 'That is the "flare efficiency entered" row of SECTION 9: 5 lines, Scope 1 30030.777, and the electricity factor still blank.' then 'old'
           when prompt = 'The flare efficiency is entered with the GWP set already declared. What reasons for not being reportable does buildInventory then give?' and options = '["the global warming potential set is not declared; 3 line(s) could not be computed", "1 factor(s) have no source or version; 1 line(s) could not be computed", "1 factor(s) have no source or version; 2 line(s) could not be computed", "none, and reportable reads true"]'::jsonb and answer_index = 1 and explanation is not distinct from 'That is the "flare efficiency entered" row of the lab''s steps: 5 lines, Scope 1 30030.777, and the electricity factor still blank.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 22;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner final ord 22'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner final ord 22 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The flare efficiency is entered with the GWP set already declared. What reasons for not being reportable does buildInventory then give?', options = '["the global warming potential set is not declared; 3 line(s) could not be computed", "1 factor(s) have no source or version; 1 line(s) could not be computed", "1 factor(s) have no source or version; 2 line(s) could not be computed", "none, and reportable reads true"]'::jsonb, explanation = 'That is the "flare efficiency entered" row of the lab''s steps: 5 lines, Scope 1 30030.777, and the electricity factor still blank.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 22;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner final ord 22 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 23
  select case
           when prompt = 'At which step does the Igbogene Scope 2 total first read 12915.000 tCO2e?' and options = '["The electricity factor entered with its source", "The GWP set declared", "The flare efficiency entered", "The first pass"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 9 gives Scope 2 as 0.000 on the first three rows; the electricity factor entered with its source brings in the 12915.000.' then 'old'
           when prompt = 'At which step does the Igbogene Scope 2 total first read 12915.000 tCO2e?' and options = '["The electricity factor entered with its source", "The GWP set declared", "The flare efficiency entered", "The first pass"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The lab gives Scope 2 as 0.000 on the first three rows; the electricity factor entered with its source brings in the 12915.000.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 23;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner final ord 23'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner final ord 23 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'At which step does the Igbogene Scope 2 total first read 12915.000 tCO2e?', options = '["The electricity factor entered with its source", "The GWP set declared", "The flare efficiency entered", "The first pass"]'::jsonb, explanation = 'The lab gives Scope 2 as 0.000 on the first three rows; the electricity factor entered with its source brings in the 12915.000.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 23;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner final ord 23 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 24
  select case
           when prompt = 'Across the five Igbogene steps, what does the computed flag read?' and options = '["false until the survey is referenced", "false in the first pass only", "true at every step", "true once the set is declared"]'::jsonb and answer_index = 2 and explanation is not distinct from 'Every row of the SECTION 9 step table reads computed true. The reportable flag is the one that turns, on the last row.' then 'old'
           when prompt = 'Across the five Igbogene steps, what does the computed flag read?' and options = '["false until the survey is referenced", "false in the first pass only", "true at every step", "true once the set is declared"]'::jsonb and answer_index = 2 and explanation is not distinct from 'Every row of the lab''s step table reads computed true. The reportable flag is the one that turns, on the last row.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 24;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner final ord 24'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner final ord 24 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Across the five Igbogene steps, what does the computed flag read?', options = '["false until the survey is referenced", "false in the first pass only", "true at every step", "true once the set is declared"]'::jsonb, explanation = 'Every row of the lab''s step table reads computed true. The reportable flag is the one that turns, on the last row.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 24;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner final ord 24 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 25
  select case
           when prompt = 'The vented activity is typed as -142 t and the electricity factor as -0.41. What does that inventory return?' and options = '["a total of 42945.777 tCO2e with reportable true", "a total of 25799.177 tCO2e with reportable true", "a refusal of the whole inventory, with no total", "a total of 25799.177 tCO2e with reportable false"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 9 blocks both negative lines and prints the inventory at 25799.177, reportable false, with 2 line(s) that could not be computed.' then 'old'
           when prompt = 'The vented activity is typed as -142 t and the electricity factor as -0.41. What does that inventory return?' and options = '["a total of 42945.777 tCO2e with reportable true", "a total of 25799.177 tCO2e with reportable true", "a refusal of the whole inventory, with no total", "a total of 25799.177 tCO2e with reportable false"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The engine blocks both negative lines and prints the inventory at 25799.177, reportable false, with 2 line(s) that could not be computed.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 25;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner final ord 25'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner final ord 25 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The vented activity is typed as -142 t and the electricity factor as -0.41. What does that inventory return?', options = '["a total of 42945.777 tCO2e with reportable true", "a total of 25799.177 tCO2e with reportable true", "a refusal of the whole inventory, with no total", "a total of 25799.177 tCO2e with reportable false"]'::jsonb, explanation = 'The engine blocks both negative lines and prints the inventory at 25799.177, reportable false, with 2 line(s) that could not be computed.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 25;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner final ord 25 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 26
  select case
           when prompt = 'Which Scope 2 intensity does the inlet to export boundary carry?' and options = '["0.00822761", "0.00353836", "0.00535892", "0.01176597"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 10''s inlet to export row: Scope 1 0.00822761, Scope 2 0.00353836, total 0.01176597. 0.00535892 is the crude export only Scope 2.' then 'old'
           when prompt = 'Which Scope 2 intensity does the inlet to export boundary carry?' and options = '["0.00822761", "0.00353836", "0.00535892", "0.01176597"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The lab''s inlet to export row: Scope 1 0.00822761, Scope 2 0.00353836, total 0.01176597. 0.00535892 is the crude export only Scope 2.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 26;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner final ord 26'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner final ord 26 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which Scope 2 intensity does the inlet to export boundary carry?', options = '["0.00822761", "0.00353836", "0.00535892", "0.01176597"]'::jsonb, explanation = 'The lab''s inlet to export row: Scope 1 0.00822761, Scope 2 0.00353836, total 0.01176597. 0.00535892 is the crude export only Scope 2.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 26;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner final ord 26 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 27
  select case
           when prompt = 'Which denominator and unit sit under the boundary "Igbogene crude export only"?' and options = '["2410000 barrels of oil exported", "3650000 barrels of oil exported", "2410000 barrels of oil equivalent produced", "3650000 barrels of oil equivalent produced"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The two boundary rows of SECTION 10 carry 3650000 in barrels of oil equivalent produced and 2410000 in barrels of oil exported, both invented.' then 'old'
           when prompt = 'Which denominator and unit sit under the boundary "Igbogene crude export only"?' and options = '["2410000 barrels of oil exported", "3650000 barrels of oil exported", "2410000 barrels of oil equivalent produced", "3650000 barrels of oil equivalent produced"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The two boundary rows of the lab carry 3650000 in barrels of oil equivalent produced and 2410000 in barrels of oil exported, both invented.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 27;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner final ord 27'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner final ord 27 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which denominator and unit sit under the boundary "Igbogene crude export only"?', options = '["2410000 barrels of oil exported", "3650000 barrels of oil exported", "2410000 barrels of oil equivalent produced", "3650000 barrels of oil equivalent produced"]'::jsonb, explanation = 'The two boundary rows of the lab carry 3650000 in barrels of oil equivalent produced and 2410000 in barrels of oil exported, both invented.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 27;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner final ord 27 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 28
  select case
           when prompt = 'The inventory disclaimer warns against keeping a second copy of obligations in the inventory. What would the copy create?' and options = '["A blocked line for each obligation", "A total that counts each tonne twice", "An unsourced factor in the register", "Two records that could disagree"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The disclaimer in SECTION 7 ends: keeping a second copy of them here would create two records that could disagree.' then 'old'
           when prompt = 'The inventory disclaimer warns against keeping a second copy of obligations in the inventory. What would the copy create?' and options = '["A blocked line for each obligation", "A total that counts each tonne twice", "An unsourced factor in the register", "Two records that could disagree"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The disclaimer in the inventory ends: keeping a second copy of them here would create two records that could disagree.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 28;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner final ord 28'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner final ord 28 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The inventory disclaimer warns against keeping a second copy of obligations in the inventory. What would the copy create?', options = '["A blocked line for each obligation", "A total that counts each tonne twice", "An unsourced factor in the register", "Two records that could disagree"]'::jsonb, explanation = 'The disclaimer in the inventory ends: keeping a second copy of them here would create two records that could disagree.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 28;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner final ord 28 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 29
  select case
           when prompt = 'Which share of the complete total belongs to the vented and fugitive methane?' and options = '["0.300728", "0.538387", "0.098534", "0.011315"]'::jsonb and answer_index = 2 and explanation is not distinct from 'From the SECTION 7 share table (computed here): 0.098534 for vented methane, 0.300728 for electricity, 0.538387 for the heaters.' then 'old'
           when prompt = 'Which share of the complete total belongs to the vented and fugitive methane?' and options = '["0.300728", "0.538387", "0.098534", "0.011315"]'::jsonb and answer_index = 2 and explanation is not distinct from 'From the lab''s share table (computed here): 0.098534 for vented methane, 0.300728 for electricity, 0.538387 for the heaters.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 29;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner final ord 29'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner final ord 29 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which share of the complete total belongs to the vented and fugitive methane?', options = '["0.300728", "0.538387", "0.098534", "0.011315"]'::jsonb, explanation = 'From the lab''s share table (computed here): 0.098534 for vented methane, 0.300728 for electricity, 0.538387 for the heaters.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 29;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner final ord 29 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 30
  select case
           when prompt = 'Which activity and factor does the Vented and fugitive methane line carry?' and options = '["16.306 t CH4 at a factor of 1 tCH4/tCH4", "142.000 t CH4 at a factor of 1 tCH4/t", "142.000 t CH4 at a factor of 29.8 tCH4/t", "4231.600 t CH4 at a factor of 1 tCH4/t"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 7 gives the vented line an activity of 142.000 t CH4 and a factor of 1 tCH4/t. 29.8 is the CH4 value of IPCC AR6 GWP100, fossil methane, the line''s GWP; 4231.600 is its tCO2e.' then 'old'
           when prompt = 'Which activity and factor does the Vented and fugitive methane line carry?' and options = '["16.306 t CH4 at a factor of 1 tCH4/tCH4", "142.000 t CH4 at a factor of 1 tCH4/t", "142.000 t CH4 at a factor of 29.8 tCH4/t", "4231.600 t CH4 at a factor of 1 tCH4/t"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The lab gives the vented line an activity of 142.000 t CH4 and a factor of 1 tCH4/t. 29.8 is the CH4 value of IPCC AR6 GWP100, fossil methane, the line''s GWP; 4231.600 is its tCO2e.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 30;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner final ord 30'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner final ord 30 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which activity and factor does the Vented and fugitive methane line carry?', options = '["16.306 t CH4 at a factor of 1 tCH4/tCH4", "142.000 t CH4 at a factor of 1 tCH4/t", "142.000 t CH4 at a factor of 29.8 tCH4/t", "4231.600 t CH4 at a factor of 1 tCH4/t"]'::jsonb, explanation = 'The lab gives the vented line an activity of 142.000 t CH4 and a factor of 1 tCH4/t. 29.8 is the CH4 value of IPCC AR6 GWP100, fossil methane, the line''s GWP; 4231.600 is its tCO2e.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 30;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner final ord 30 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 31
  select case
           when prompt = 'A blocked electricity line leaves the inlet to export total intensity equal to which figure of the complete inventory?' and options = '["Its Scope 1 intensity, 0.00822761", "Its Scope 2 intensity, 0.00353836", "Its total intensity, 0.01176597", "Its crude export Scope 1, 0.01246090"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 10 compares the two and prints them as the same figure: with the Scope 2 line blocked, the total is Scope 1 alone.' then 'old'
           when prompt = 'A blocked electricity line leaves the inlet to export total intensity equal to which figure of the complete inventory?' and options = '["Its Scope 1 intensity, 0.00822761", "Its Scope 2 intensity, 0.00353836", "Its total intensity, 0.01176597", "Its crude export Scope 1, 0.01246090"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course compares the two and prints them as the same figure: with the Scope 2 line blocked, the total is Scope 1 alone.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 31;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner final ord 31'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner final ord 31 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A blocked electricity line leaves the inlet to export total intensity equal to which figure of the complete inventory?', options = '["Its Scope 1 intensity, 0.00822761", "Its Scope 2 intensity, 0.00353836", "Its total intensity, 0.01176597", "Its crude export Scope 1, 0.01246090"]'::jsonb, explanation = 'The course compares the two and prints them as the same figure: with the Scope 2 line blocked, the total is Scope 1 alone.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 31;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner final ord 31 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 32
  select case
           when prompt = 'Held item H2 names the engine''s typical heating values for methane. Which pair does it give?' and options = '["890.8 LHV and 802.6 HHV MJ per kmol", "1428.6 LHV and 1560.7 HHV MJ per kmol", "241.8 LHV and 285.8 HHV MJ per kmol", "802.6 LHV and 890.8 HHV MJ per kmol"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 25, H2: the engine''s typical methane heating values are 802.6 LHV and 890.8 HHV MJ per kmol; the pair is labelled typical and the fuel analysis governs. FUEL_REFERENCE prints 1428.6 and 1560.7 for ethane and 241.8 and 285.8 for hydrogen.' then 'old'
           when prompt = 'Held item H2 names the engine''s typical heating values for methane. Which pair does it give?' and options = '["890.8 LHV and 802.6 HHV MJ per kmol", "1428.6 LHV and 1560.7 HHV MJ per kmol", "241.8 LHV and 285.8 HHV MJ per kmol", "802.6 LHV and 890.8 HHV MJ per kmol"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course, H2: the engine''s typical methane heating values are 802.6 LHV and 890.8 HHV MJ per kmol; the pair is labelled typical and the fuel analysis governs. FUEL_REFERENCE prints 1428.6 and 1560.7 for ethane and 241.8 and 285.8 for hydrogen.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 32;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner final ord 32'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner final ord 32 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Held item H2 names the engine''s typical heating values for methane. Which pair does it give?', options = '["890.8 LHV and 802.6 HHV MJ per kmol", "1428.6 LHV and 1560.7 HHV MJ per kmol", "241.8 LHV and 285.8 HHV MJ per kmol", "802.6 LHV and 890.8 HHV MJ per kmol"]'::jsonb, explanation = 'The course, H2: the engine''s typical methane heating values are 802.6 LHV and 890.8 HHV MJ per kmol; the pair is labelled typical and the fuel analysis governs. FUEL_REFERENCE prints 1428.6 and 1560.7 for ethane and 241.8 and 285.8 for hydrogen.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 32;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner final ord 32 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 33
  select case
           when prompt = 'How many lines does the Igbogene first pass build, and how many of them are blocked?' and options = '["5 lines, 3 of them blocked", "4 lines, 1 of them blocked", "4 lines, 3 of them blocked", "5 lines, none of them blocked"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 9 counts the first pass at 4 lines, with 3 blocked and 0 unsourced.' then 'old'
           when prompt = 'How many lines does the Igbogene first pass build, and how many of them are blocked?' and options = '["5 lines, 3 of them blocked", "4 lines, 1 of them blocked", "4 lines, 3 of them blocked", "5 lines, none of them blocked"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The lab counts the first pass at 4 lines, with 3 blocked and 0 unsourced.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 33;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner final ord 33'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner final ord 33 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'How many lines does the Igbogene first pass build, and how many of them are blocked?', options = '["5 lines, 3 of them blocked", "4 lines, 1 of them blocked", "4 lines, 3 of them blocked", "5 lines, none of them blocked"]'::jsonb, explanation = 'The lab counts the first pass at 4 lines, with 3 blocked and 0 unsourced.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 33;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner final ord 33 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 34
  select case
           when prompt = '21212.338 t of CO2 is the heaters'' figure at which carbon per kilomole of fuel?' and options = '["1.05", "1.00", "1.09", "1.15"]'::jsonb and answer_index = 1 and explanation is not distinct from 'In SECTION 4, 1.00 is the row at 21212.338; 1.09 is the Igbogene input.' then 'old'
           when prompt = '21212.338 t of CO2 is the heaters'' figure at which carbon per kilomole of fuel?' and options = '["1.05", "1.00", "1.09", "1.15"]'::jsonb and answer_index = 1 and explanation is not distinct from 'In the course''s table, 1.00 is the row at 21212.338; 1.09 is the Igbogene input.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 34;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner final ord 34'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner final ord 34 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = '21212.338 t of CO2 is the heaters'' figure at which carbon per kilomole of fuel?', options = '["1.05", "1.00", "1.09", "1.15"]'::jsonb, explanation = 'In the course''s table, 1.00 is the row at 21212.338; 1.09 is the Igbogene input.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 34;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner final ord 34 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 35
  select case
           when prompt = 'Which co2Tonnes figure belongs to the flare''s 0.99 row?' and options = '["2214.172", "2191.807", "2236.537", "2457.133"]'::jsonb and answer_index = 0 and explanation is not distinct from 'Flare row 0.99 in SECTION 5 reads co2Tonnes 2214.172; 2457.133 on that row is the total in tCO2e.' then 'old'
           when prompt = 'Which co2Tonnes figure belongs to the flare''s 0.99 row?' and options = '["2214.172", "2191.807", "2236.537", "2457.133"]'::jsonb and answer_index = 0 and explanation is not distinct from 'Flare row 0.99 in the lab reads co2Tonnes 2214.172; 2457.133 on that row is the total in tCO2e.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 35;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner final ord 35'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner final ord 35 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which co2Tonnes figure belongs to the flare''s 0.99 row?', options = '["2214.172", "2191.807", "2236.537", "2457.133"]'::jsonb, explanation = 'Flare row 0.99 in the lab reads co2Tonnes 2214.172; 2457.133 on that row is the total in tCO2e.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 35;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner final ord 35 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 36
  select case
           when prompt = 'How does the engine''s note describe counting escaped carbon as methane?' and options = '["As a measured result for each flare", "As the AR6 non-fossil convention", "As a default set by the owner", "As the usual and conservative assumption"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The SECTION 5 note calls it "the usual and conservative assumption" and says to override it if you have measured otherwise. H3 holds it as the engine''s stated assumption.' then 'old'
           when prompt = 'How does the engine''s note describe counting escaped carbon as methane?' and options = '["As a measured result for each flare", "As the AR6 non-fossil convention", "As a default set by the owner", "As the usual and conservative assumption"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course''s note calls it "the usual and conservative assumption" and says to override it if you have measured otherwise. H3 holds it as the engine''s stated assumption.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 36;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner final ord 36'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner final ord 36 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'How does the engine''s note describe counting escaped carbon as methane?', options = '["As a measured result for each flare", "As the AR6 non-fossil convention", "As a default set by the owner", "As the usual and conservative assumption"]'::jsonb, explanation = 'The course''s note calls it "the usual and conservative assumption" and says to override it if you have measured otherwise. H3 holds it as the engine''s stated assumption.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 36;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner final ord 36 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 37
  select case
           when prompt = 'Typed at 0.95 in place of the stated 0.98, where does the flare''s unburned methane line go?' and options = '["From 485.922 to 2429.610 tCO2e", "From 16.306 to 40.765 tCO2e", "From 485.922 to 1214.805 tCO2e", "Nowhere; only the CO2 line moves"]'::jsonb and answer_index = 2 and explanation is not distinct from 'From the 0.98 row to the 0.95 row of SECTION 5 the methane line goes from 485.922 to 1214.805 tCO2e. 16.306 and 40.765 are tonnes of methane.' then 'old'
           when prompt = 'Typed at 0.95 in place of the stated 0.98, where does the flare''s unburned methane line go?' and options = '["From 485.922 to 2429.610 tCO2e", "From 16.306 to 40.765 tCO2e", "From 485.922 to 1214.805 tCO2e", "Nowhere; only the CO2 line moves"]'::jsonb and answer_index = 2 and explanation is not distinct from 'From the 0.98 row to the 0.95 row of the lab''s flare table the methane line goes from 485.922 to 1214.805 tCO2e. 16.306 and 40.765 are tonnes of methane.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 37;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner final ord 37'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner final ord 37 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Typed at 0.95 in place of the stated 0.98, where does the flare''s unburned methane line go?', options = '["From 485.922 to 2429.610 tCO2e", "From 16.306 to 40.765 tCO2e", "From 485.922 to 1214.805 tCO2e", "Nowhere; only the CO2 line moves"]'::jsonb, explanation = 'From the 0.98 row to the 0.95 row of the lab''s flare table the methane line goes from 485.922 to 1214.805 tCO2e. 16.306 and 40.765 are tonnes of methane.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 37;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner final ord 37 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 38
  select case
           when prompt = 'Switched from the AR6 fossil set to the AR6 non-fossil set, where does the flare''s unburned methane line go?' and options = '["To 489.183 tCO2e", "To 440.265 tCO2e", "To 456.571 tCO2e", "Nowhere; it stays 485.922"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 8 lists the flare''s methane line as 485.922 on AR6 fossil and 440.265 on AR6 non-fossil; the AR5 figures are 489.183 and 456.571.' then 'old'
           when prompt = 'Switched from the AR6 fossil set to the AR6 non-fossil set, where does the flare''s unburned methane line go?' and options = '["To 489.183 tCO2e", "To 440.265 tCO2e", "To 456.571 tCO2e", "Nowhere; it stays 485.922"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The lab lists the flare''s methane line as 485.922 on AR6 fossil and 440.265 on AR6 non-fossil; the AR5 figures are 489.183 and 456.571.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 38;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner final ord 38'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner final ord 38 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Switched from the AR6 fossil set to the AR6 non-fossil set, where does the flare''s unburned methane line go?', options = '["To 489.183 tCO2e", "To 440.265 tCO2e", "To 456.571 tCO2e", "Nowhere; it stays 485.922"]'::jsonb, explanation = 'The lab lists the flare''s methane line as 485.922 on AR6 fossil and 440.265 on AR6 non-fossil; the AR5 figures are 489.183 and 456.571.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 38;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner final ord 38 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 39
  select case
           when prompt = 'Which Igbogene figure holds still across all four GWP sets?' and options = '["Scope 1, 30030.777 tCO2e", "The total, 42945.777 tCO2e", "The vented line, 4231.600 tCO2e", "Scope 2, 12915.000 tCO2e"]'::jsonb and answer_index = 3 and explanation is not distinct from 'Scope 2 is a CO2 line with a GWP of 1 whatever the set, so SECTION 8 prints 12915.000 four times.' then 'old'
           when prompt = 'Which Igbogene figure holds still across all four GWP sets?' and options = '["Scope 1, 30030.777 tCO2e", "The total, 42945.777 tCO2e", "The vented line, 4231.600 tCO2e", "Scope 2, 12915.000 tCO2e"]'::jsonb and answer_index = 3 and explanation is not distinct from 'Scope 2 is a CO2 line with a GWP of 1 whatever the set, so the lab prints 12915.000 four times.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 39;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner final ord 39'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner final ord 39 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which Igbogene figure holds still across all four GWP sets?', options = '["Scope 1, 30030.777 tCO2e", "The total, 42945.777 tCO2e", "The vented line, 4231.600 tCO2e", "Scope 2, 12915.000 tCO2e"]'::jsonb, explanation = 'Scope 2 is a CO2 line with a GWP of 1 whatever the set, so the lab prints 12915.000 four times.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 39;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner final ord 39 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 40
  select case
           when prompt = 'Which flare tCO2e sits on the stated 0.98 row?' and options = '["2677.729 tCO2e", "2236.537 tCO2e", "2191.807 tCO2e", "3339.515 tCO2e"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The SECTION 5 row at 0.98 prints a flare total of 2677.729, of which 2191.807 is CO2.' then 'old'
           when prompt = 'Which flare tCO2e sits on the stated 0.98 row?' and options = '["2677.729 tCO2e", "2236.537 tCO2e", "2191.807 tCO2e", "3339.515 tCO2e"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The lab''s flare row at 0.98 prints a flare total of 2677.729, of which 2191.807 is CO2.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 40;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner final ord 40'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner final ord 40 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which flare tCO2e sits on the stated 0.98 row?', options = '["2677.729 tCO2e", "2236.537 tCO2e", "2191.807 tCO2e", "3339.515 tCO2e"]'::jsonb, explanation = 'The lab''s flare row at 0.98 prints a flare total of 2677.729, of which 2191.807 is CO2.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 40;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner final ord 40 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 41
  select case
           when prompt = 'Which sentence explains a scope 3 line''s block?' and options = '["A registered emission factor is required.", "no global warming potential for CH4 in the declared set", "scope 3 is not Scope 1 or Scope 2, which is all this inventory totals", "a negative activity: an emission line cannot remove tonnes"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 9 prints this reason for the scope 3 Business travel line. The factor refusal belongs to Diesel generators, the missing GWP blocks the vented methane in the first pass, and the negative activity blocks the vented methane typed as -142 t.' then 'old'
           when prompt = 'Which sentence explains a scope 3 line''s block?' and options = '["A registered emission factor is required.", "no global warming potential for CH4 in the declared set", "scope 3 is not Scope 1 or Scope 2, which is all this inventory totals", "a negative activity: an emission line cannot remove tonnes"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The lab prints this reason for the scope 3 Business travel line. The factor refusal belongs to Diesel generators, the missing GWP blocks the vented methane in the first pass, and the negative activity blocks the vented methane typed as -142 t.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 41;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner final ord 41'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner final ord 41 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which sentence explains a scope 3 line''s block?', options = '["A registered emission factor is required.", "no global warming potential for CH4 in the declared set", "scope 3 is not Scope 1 or Scope 2, which is all this inventory totals", "a negative activity: an emission line cannot remove tonnes"]'::jsonb, explanation = 'The lab prints this reason for the scope 3 Business travel line. The factor refusal belongs to Diesel generators, the missing GWP blocks the vented methane in the first pass, and the negative activity blocks the vented methane typed as -142 t.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 41;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner final ord 41 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner final ord 42
  select case
           when prompt = 'Which boundary''s intensity is stated in tCO2e per barrel of oil equivalent produced?' and options = '["Igbogene crude export only", "Igbogene flow station and gas plant, inlet to export", "Igbogene fired heaters and flare only", "Igbogene Scope 1 lines only"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 10 gives the inlet to export boundary in barrels of oil equivalent produced and crude export only in barrels of oil exported.' then 'old'
           when prompt = 'Which boundary''s intensity is stated in tCO2e per barrel of oil equivalent produced?' and options = '["Igbogene crude export only", "Igbogene flow station and gas plant, inlet to export", "Igbogene fired heaters and flare only", "Igbogene Scope 1 lines only"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The lab gives the inlet to export boundary in barrels of oil equivalent produced and crude export only in barrels of oil exported.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 42;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner final ord 42'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner final ord 42 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which boundary''s intensity is stated in tCO2e per barrel of oil equivalent produced?', options = '["Igbogene crude export only", "Igbogene flow station and gas plant, inlet to export", "Igbogene fired heaters and flare only", "Igbogene Scope 1 lines only"]'::jsonb, explanation = 'The lab gives the inlet to export boundary in barrels of oil equivalent produced and crude export only in barrels of oil exported.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'final' and module_key is not distinct from null and ord = 42;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner final ord 42 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m01-what-an-inventory-counts ord 1
  select case
           when prompt = 'Which function does energyEfficiency.priceSaving call to cost a tonne of carbon saved?' and options = '["carbonAbatement.carbonIntensity", "carbonAbatement.abatementCurve", "carbonAbatement.abatementCost", "energyEfficiency.excessAirSaving"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 1: the Energy & Utilities Efficiency Studio''s cost per tonne is carbonAbatement.abatementCost called from inside energyEfficiency.priceSaving. SECTION 1 lists carbonIntensity and abatementCurve as other carbonAbatement functions, and excessAirSaving as an energyEfficiency function.' then 'old'
           when prompt = 'Which function does energyEfficiency.priceSaving call to cost a tonne of carbon saved?' and options = '["carbonAbatement.carbonIntensity", "carbonAbatement.abatementCurve", "carbonAbatement.abatementCost", "energyEfficiency.excessAirSaving"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course: the Energy & Utilities Efficiency Studio''s cost per tonne is carbonAbatement.abatementCost called from inside energyEfficiency.priceSaving. The course lists carbonIntensity and abatementCurve as other carbonAbatement functions, and excessAirSaving as an energyEfficiency function.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-an-inventory-counts' and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m01-what-an-inventory-counts ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m01-what-an-inventory-counts ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which function does energyEfficiency.priceSaving call to cost a tonne of carbon saved?', options = '["carbonAbatement.carbonIntensity", "carbonAbatement.abatementCurve", "carbonAbatement.abatementCost", "energyEfficiency.excessAirSaving"]'::jsonb, explanation = 'The course: the Energy & Utilities Efficiency Studio''s cost per tonne is carbonAbatement.abatementCost called from inside energyEfficiency.priceSaving. The course lists carbonIntensity and abatementCurve as other carbonAbatement functions, and excessAirSaving as an energyEfficiency function.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-an-inventory-counts' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m01-what-an-inventory-counts ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m01-what-an-inventory-counts ord 2
  select case
           when prompt = 'What does the constant carbonAbatement.SCOPE hold?' and options = '["ONE 1 and TWO 2", "ONE 1, TWO 2 and THREE 3", "ONE 1 only, with purchased energy as a flag", "DIRECT and PURCHASED, with no numbers"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 1 prints carbonAbatement.SCOPE: ONE 1, TWO 2. The inventory labels its totals Scope 1 (direct) and Scope 2 (purchased energy), and a line on scope 3 is blocked because it is not Scope 1 or Scope 2.' then 'old'
           when prompt = 'What does the constant carbonAbatement.SCOPE hold?' and options = '["ONE 1 and TWO 2", "ONE 1, TWO 2 and THREE 3", "ONE 1 only, with purchased energy as a flag", "DIRECT and PURCHASED, with no numbers"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The engine returns carbonAbatement.SCOPE: ONE 1, TWO 2. The inventory labels its totals Scope 1 (direct) and Scope 2 (purchased energy), and a line on scope 3 is blocked because it is not Scope 1 or Scope 2.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-an-inventory-counts' and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m01-what-an-inventory-counts ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m01-what-an-inventory-counts ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does the constant carbonAbatement.SCOPE hold?', options = '["ONE 1 and TWO 2", "ONE 1, TWO 2 and THREE 3", "ONE 1 only, with purchased energy as a flag", "DIRECT and PURCHASED, with no numbers"]'::jsonb, explanation = 'The engine returns carbonAbatement.SCOPE: ONE 1, TWO 2. The inventory labels its totals Scope 1 (direct) and Scope 2 (purchased energy), and a line on scope 3 is blocked because it is not Scope 1 or Scope 2.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-an-inventory-counts' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m01-what-an-inventory-counts ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m01-what-an-inventory-counts ord 3
  select case
           when prompt = 'A Business travel line on scope 3 is added to the complete Igbogene inventory. What does buildInventory do with it?' and options = '["Adds it to the total, which then moves above 42945.777 tCO2e, and stays reportable.", "Drops it with no line and no reason, and the inventory stays reportable.", "Refuses the whole inventory, which then returns no total and names no line at all.", "Blocks it with its reason; the total stays 42945.777 tCO2e and reportable reads false."]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 9: the scope 3 line is blocked with the reason "scope 3 is not Scope 1 or Scope 2, which is all this inventory totals". The totals stay the Scope 1 and Scope 2 figures of SECTION 7, total tCO2e 42945.777, and the inventory stops being reportable.' then 'old'
           when prompt = 'A Business travel line on scope 3 is added to the complete Igbogene inventory. What does buildInventory do with it?' and options = '["Adds it to the total, which then moves above 42945.777 tCO2e, and stays reportable.", "Drops it with no line and no reason, and the inventory stays reportable.", "Refuses the whole inventory, which then returns no total and names no line at all.", "Blocks it with its reason; the total stays 42945.777 tCO2e and reportable reads false."]'::jsonb and answer_index = 3 and explanation is not distinct from 'In the lab, the scope 3 line is blocked with the reason "scope 3 is not Scope 1 or Scope 2, which is all this inventory totals". The totals stay the Scope 1 and Scope 2 figures of the complete inventory, total tCO2e 42945.777, and the inventory stops being reportable.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-an-inventory-counts' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m01-what-an-inventory-counts ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m01-what-an-inventory-counts ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A Business travel line on scope 3 is added to the complete Igbogene inventory. What does buildInventory do with it?', options = '["Adds it to the total, which then moves above 42945.777 tCO2e, and stays reportable.", "Drops it with no line and no reason, and the inventory stays reportable.", "Refuses the whole inventory, which then returns no total and names no line at all.", "Blocks it with its reason; the total stays 42945.777 tCO2e and reportable reads false."]'::jsonb, explanation = 'In the lab, the scope 3 line is blocked with the reason "scope 3 is not Scope 1 or Scope 2, which is all this inventory totals". The totals stay the Scope 1 and Scope 2 figures of the complete inventory, total tCO2e 42945.777, and the inventory stops being reportable.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-an-inventory-counts' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m01-what-an-inventory-counts ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m01-what-an-inventory-counts ord 4
  select case
           when prompt = 'A flare call reaches combustionCo2FromCarbon with the destruction efficiency null. What does the engine say?' and options = '["REFUSED: The destruction efficiency must lie in (0, 1].", "REFUSED: A destruction efficiency is required. It is not read as 100 percent: for a flare it is the answer, and it is contested.", "REFUSED: A fuel quantity and the carbon per kilomole of fuel are required.", "REFUSED: A fuel quantity and a carbon content cannot be negative."]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 2 prints the same refusal for a blank and for a null destruction efficiency. The interval refusal is for 0 or for 98 typed as a percentage, and the other two are the fuel refusals, one for a missing input and one for a negative fuel.' then 'old'
           when prompt = 'A flare call reaches combustionCo2FromCarbon with the destruction efficiency null. What does the engine say?' and options = '["REFUSED: The destruction efficiency must lie in (0, 1].", "REFUSED: A destruction efficiency is required. It is not read as 100 percent: for a flare it is the answer, and it is contested.", "REFUSED: A fuel quantity and the carbon per kilomole of fuel are required.", "REFUSED: A fuel quantity and a carbon content cannot be negative."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The engine returns the same refusal for a blank and for a null destruction efficiency. The interval refusal is for 0 or for 98 typed as a percentage, and the other two are the fuel refusals, one for a missing input and one for a negative fuel.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-an-inventory-counts' and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m01-what-an-inventory-counts ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m01-what-an-inventory-counts ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A flare call reaches combustionCo2FromCarbon with the destruction efficiency null. What does the engine say?', options = '["REFUSED: The destruction efficiency must lie in (0, 1].", "REFUSED: A destruction efficiency is required. It is not read as 100 percent: for a flare it is the answer, and it is contested.", "REFUSED: A fuel quantity and the carbon per kilomole of fuel are required.", "REFUSED: A fuel quantity and a carbon content cannot be negative."]'::jsonb, explanation = 'The engine returns the same refusal for a blank and for a null destruction efficiency. The interval refusal is for 0 or for 98 typed as a percentage, and the other two are the fuel refusals, one for a missing input and one for a negative fuel.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-an-inventory-counts' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m01-what-an-inventory-counts ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m01-what-an-inventory-counts ord 5
  select case
           when prompt = 'combustionCo2FromCarbon({ fuelKmolPerYear: 1000, carbonPerKmolFuel: 1 }) leaves the destruction efficiency out of the call. What does it answer?' and options = '["destructionEfficiencyFraction 0.98, co2Tonnes 43.129, ch4Tonnes 0.321", "destructionEfficiencyFraction 0.99, co2Tonnes 43.569, ch4Tonnes 0.160", "destructionEfficiencyFraction 1, co2Tonnes 44.009, ch4Tonnes 0.000", "A refusal naming the destruction efficiency as required"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 2: left out of the call, the destruction efficiency takes its stated default of complete combustion, and this call answers destructionEfficiencyFraction 1, co2Tonnes 44.009, ch4Tonnes 0.000. The refusal is for a blank or null box. The 0.98 and 0.99 rows are SECTION 3 calls with the efficiency typed.' then 'old'
           when prompt = 'combustionCo2FromCarbon({ fuelKmolPerYear: 1000, carbonPerKmolFuel: 1 }) leaves the destruction efficiency out of the call. What does it answer?' and options = '["destructionEfficiencyFraction 0.98, co2Tonnes 43.129, ch4Tonnes 0.321", "destructionEfficiencyFraction 0.99, co2Tonnes 43.569, ch4Tonnes 0.160", "destructionEfficiencyFraction 1, co2Tonnes 44.009, ch4Tonnes 0.000", "A refusal naming the destruction efficiency as required"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course: left out of the call, the destruction efficiency takes its stated default of complete combustion, and this call answers destructionEfficiencyFraction 1, co2Tonnes 44.009, ch4Tonnes 0.000. The refusal is for a blank or null box. The 0.98 and 0.99 rows are the lesson''s calls with the efficiency typed.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-an-inventory-counts' and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m01-what-an-inventory-counts ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m01-what-an-inventory-counts ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'combustionCo2FromCarbon({ fuelKmolPerYear: 1000, carbonPerKmolFuel: 1 }) leaves the destruction efficiency out of the call. What does it answer?', options = '["destructionEfficiencyFraction 0.98, co2Tonnes 43.129, ch4Tonnes 0.321", "destructionEfficiencyFraction 0.99, co2Tonnes 43.569, ch4Tonnes 0.160", "destructionEfficiencyFraction 1, co2Tonnes 44.009, ch4Tonnes 0.000", "A refusal naming the destruction efficiency as required"]'::jsonb, explanation = 'The course: left out of the call, the destruction efficiency takes its stated default of complete combustion, and this call answers destructionEfficiencyFraction 1, co2Tonnes 44.009, ch4Tonnes 0.000. The refusal is for a blank or null box. The 0.98 and 0.99 rows are the lesson''s calls with the efficiency typed.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-an-inventory-counts' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m01-what-an-inventory-counts ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m01-what-an-inventory-counts ord 6
  select case
           when prompt = 'The digest says who the default of complete combustion is for. What does it say?' and options = '["A burner is the case it is for; a flare is asked for its efficiency every time.", "A flare is the case it is for; a burner is asked for its efficiency every time.", "Every source, burner or flare, whenever the destruction efficiency box is blank.", "No source at all: the argument has no default and must always be typed."]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 2 prints: "A burner is the case that default is for. A flare is asked for its efficiency every time." A blank box is refused, and an argument left out takes the stated default, so the argument does have one.' then 'old'
           when prompt = 'The course says who the default of complete combustion is for. What does it say?' and options = '["A burner is the case it is for; a flare is asked for its efficiency every time.", "A flare is the case it is for; a burner is asked for its efficiency every time.", "Every source, burner or flare, whenever the destruction efficiency box is blank.", "No source at all: the argument has no default and must always be typed."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The engine states: "A burner is the case that default is for. A flare is asked for its efficiency every time." A blank box is refused, and an argument left out takes the stated default, so the argument does have one.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-an-inventory-counts' and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m01-what-an-inventory-counts ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m01-what-an-inventory-counts ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course says who the default of complete combustion is for. What does it say?', options = '["A burner is the case it is for; a flare is asked for its efficiency every time.", "A flare is the case it is for; a burner is asked for its efficiency every time.", "Every source, burner or flare, whenever the destruction efficiency box is blank.", "No source at all: the argument has no default and must always be typed."]'::jsonb, explanation = 'The engine states: "A burner is the case that default is for. A flare is asked for its efficiency every time." A blank box is refused, and an argument left out takes the stated default, so the argument does have one.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-an-inventory-counts' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m01-what-an-inventory-counts ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m01-what-an-inventory-counts ord 7
  select case
           when prompt = 'carbonIntensity is called with no boundary named. What does the engine say?' and options = '["REFUSED: A positive denominator is required.", "REFUSED: A registered emission factor is required.", "REFUSED: A global warming potential must be positive. Refused for CH4, so the set is not declared.", "REFUSED: A boundary must be named. Tonnes per tonne charged and tonnes per tonne of saleable product are different numbers for the same plant, and an intensity without its boundary cannot be compared with anything."]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 2 prints the boundary refusal for this call. carbonIntensity gives the denominator refusal for a denominator of 0 or a blank one; the factor refusal belongs to emissionLine and the GWP refusal to makeGwpSet.' then 'old'
           when prompt = 'carbonIntensity is called with no boundary named. What does the engine say?' and options = '["REFUSED: A positive denominator is required.", "REFUSED: A registered emission factor is required.", "REFUSED: A global warming potential must be positive. Refused for CH4, so the set is not declared.", "REFUSED: A boundary must be named. Tonnes per tonne charged and tonnes per tonne of saleable product are different numbers for the same plant, and an intensity without its boundary cannot be compared with anything."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The engine returns the boundary refusal for this call. carbonIntensity gives the denominator refusal for a denominator of 0 or a blank one; the factor refusal belongs to emissionLine and the GWP refusal to makeGwpSet.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-an-inventory-counts' and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m01-what-an-inventory-counts ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m01-what-an-inventory-counts ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'carbonIntensity is called with no boundary named. What does the engine say?', options = '["REFUSED: A positive denominator is required.", "REFUSED: A registered emission factor is required.", "REFUSED: A global warming potential must be positive. Refused for CH4, so the set is not declared.", "REFUSED: A boundary must be named. Tonnes per tonne charged and tonnes per tonne of saleable product are different numbers for the same plant, and an intensity without its boundary cannot be compared with anything."]'::jsonb, explanation = 'The engine returns the boundary refusal for this call. carbonIntensity gives the denominator refusal for a denominator of 0 or a blank one; the factor refusal belongs to emissionLine and the GWP refusal to makeGwpSet.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-an-inventory-counts' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m01-what-an-inventory-counts ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m01-what-an-inventory-counts ord 8
  select case
           when prompt = 'A named boundary and a denominator of 0 reach carbonIntensity. What comes back?' and options = '["An intensity with reportable set to false", "REFUSED: A positive denominator is required.", "REFUSED: A boundary must be named.", "The total tCO2e, with the denominator read as 1"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 2 prints "REFUSED: A positive denominator is required." for a denominator of 0 and for a blank denominator. The boundary refusal is for a call with no boundary named, and no row reads a 0 or a blank as some other figure.' then 'old'
           when prompt = 'A named boundary and a denominator of 0 reach carbonIntensity. What comes back?' and options = '["An intensity with reportable set to false", "REFUSED: A positive denominator is required.", "REFUSED: A boundary must be named.", "The total tCO2e, with the denominator read as 1"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The engine returns "REFUSED: A positive denominator is required." for a denominator of 0 and for a blank denominator. The boundary refusal is for a call with no boundary named, and no row reads a 0 or a blank as some other figure.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-an-inventory-counts' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m01-what-an-inventory-counts ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m01-what-an-inventory-counts ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A named boundary and a denominator of 0 reach carbonIntensity. What comes back?', options = '["An intensity with reportable set to false", "REFUSED: A positive denominator is required.", "REFUSED: A boundary must be named.", "The total tCO2e, with the denominator read as 1"]'::jsonb, explanation = 'The engine returns "REFUSED: A positive denominator is required." for a denominator of 0 and for a blank denominator. The boundary refusal is for a call with no boundary named, and no row reads a 0 or a blank as some other figure.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-an-inventory-counts' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m01-what-an-inventory-counts ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m01-what-an-inventory-counts ord 9
  select case
           when prompt = 'makeGwpSet is given a methane GWP of 0. What comes back?' and options = '["A set declared true that converts methane at 0", "A refusal for CH4, with the set still declared true", "A refusal for CH4, and the set reads declared false", "A set declared true, with CH4 read as the CO2 value of 1"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 2: a methane GWP of 0, and one of -5, return "REFUSED: A global warming potential must be positive. Refused for CH4, so the set is not declared." The set then reads declared false.' then 'old'
           when prompt = 'makeGwpSet is given a methane GWP of 0. What comes back?' and options = '["A set declared true that converts methane at 0", "A refusal for CH4, with the set still declared true", "A refusal for CH4, and the set reads declared false", "A set declared true, with CH4 read as the CO2 value of 1"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The engine: a methane GWP of 0, and one of -5, return "REFUSED: A global warming potential must be positive. Refused for CH4, so the set is not declared." The set then reads declared false.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-an-inventory-counts' and ord = 9;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m01-what-an-inventory-counts ord 9'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m01-what-an-inventory-counts ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'makeGwpSet is given a methane GWP of 0. What comes back?', options = '["A set declared true that converts methane at 0", "A refusal for CH4, with the set still declared true", "A refusal for CH4, and the set reads declared false", "A set declared true, with CH4 read as the CO2 value of 1"]'::jsonb, explanation = 'The engine: a methane GWP of 0, and one of -5, return "REFUSED: A global warming potential must be positive. Refused for CH4, so the set is not declared." The set then reads declared false.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-an-inventory-counts' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m01-what-an-inventory-counts ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m01-what-an-inventory-counts ord 10
  select case
           when prompt = 'What does makeGwpSet({}) return?' and options = '["label none, gases 0, declared false", "label none, gases 4, declared true", "REFUSED, with no set returned at all", "the course''s set, declared true"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 1 prints the row for makeGwpSet({}): label none, gases 0, declared false. Neither module exports a global warming potential, and SECTION 6 declares a set only with a label and at least one value.' then 'old'
           when prompt = 'What does makeGwpSet({}) return?' and options = '["label none, gases 0, declared false", "label none, gases 4, declared true", "REFUSED, with no set returned at all", "the course''s set, declared true"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course prints the row for makeGwpSet({}): label none, gases 0, declared false. Neither module exports a global warming potential, and the engine declares a set only with a label and at least one value.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-an-inventory-counts' and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m01-what-an-inventory-counts ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m01-what-an-inventory-counts ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does makeGwpSet({}) return?', options = '["label none, gases 0, declared false", "label none, gases 4, declared true", "REFUSED, with no set returned at all", "the course''s set, declared true"]'::jsonb, explanation = 'The course prints the row for makeGwpSet({}): label none, gases 0, declared false. Neither module exports a global warming potential, and the engine declares a set only with a label and at least one value.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-an-inventory-counts' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m01-what-an-inventory-counts ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m01-what-an-inventory-counts ord 11
  select case
           when prompt = 'A factor is typed with a value of 2.5 tCO2/t and nothing else. What does its record read?' and options = '["hasValue false, provenanceComplete false, and missingProvenance value, source", "hasValue true, provenanceComplete false, missingProvenance source, version", "hasValue true, provenanceComplete true, and missingProvenance none at all", "A refusal from emissionLine, with no record returned at all"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 1 prints the row for "A factor typed with no source": value 2.5, unit tCO2/t, gas CO2, hasValue true, provenanceComplete false, missingProvenance source, version. A value with nothing else is still a record, and the record says what it lacks.' then 'old'
           when prompt = 'A factor is typed with a value of 2.5 tCO2/t and nothing else. What does its record read?' and options = '["hasValue false, provenanceComplete false, and missingProvenance value, source", "hasValue true, provenanceComplete false, missingProvenance source, version", "hasValue true, provenanceComplete true, and missingProvenance none at all", "A refusal from emissionLine, with no record returned at all"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course prints the row for "A factor typed with no source": value 2.5, unit tCO2/t, gas CO2, hasValue true, provenanceComplete false, missingProvenance source, version. A value with nothing else is still a record, and the record says what it lacks.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-an-inventory-counts' and ord = 11;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m01-what-an-inventory-counts ord 11'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m01-what-an-inventory-counts ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A factor is typed with a value of 2.5 tCO2/t and nothing else. What does its record read?', options = '["hasValue false, provenanceComplete false, and missingProvenance value, source", "hasValue true, provenanceComplete false, missingProvenance source, version", "hasValue true, provenanceComplete true, and missingProvenance none at all", "A refusal from emissionLine, with no record returned at all"]'::jsonb, explanation = 'The course prints the row for "A factor typed with no source": value 2.5, unit tCO2/t, gas CO2, hasValue true, provenanceComplete false, missingProvenance source, version. A value with nothing else is still a record, and the record says what it lacks.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-an-inventory-counts' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m01-what-an-inventory-counts ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m01-what-an-inventory-counts ord 12
  select case
           when prompt = 'Which of these does neither engine module export?' and options = '["A molar mass each for carbon, CO2 and methane, in kg/kmol", "A table of fuels with typical LHV and HHV heating values", "A list of heating value bases, reading LHV and HHV", "An emission factor or a global warming potential"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 1: "Neither module exports an emission factor or a global warming potential." carbonAbatement exports MW_C, MW_CO2 and MW_CH4, and energyEfficiency exports FUEL_REFERENCE with typical heating values and HEATING_VALUE_BASIS: LHV, HHV.' then 'old'
           when prompt = 'Which of these does neither engine module export?' and options = '["A molar mass each for carbon, CO2 and methane, in kg/kmol", "A table of fuels with typical LHV and HHV heating values", "A list of heating value bases, reading LHV and HHV", "An emission factor or a global warming potential"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course: "Neither module exports an emission factor or a global warming potential." carbonAbatement exports MW_C, MW_CO2 and MW_CH4, and energyEfficiency exports FUEL_REFERENCE with typical heating values and HEATING_VALUE_BASIS: LHV, HHV.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-an-inventory-counts' and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m01-what-an-inventory-counts ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m01-what-an-inventory-counts ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which of these does neither engine module export?', options = '["A molar mass each for carbon, CO2 and methane, in kg/kmol", "A table of fuels with typical LHV and HHV heating values", "A list of heating value bases, reading LHV and HHV", "An emission factor or a global warming potential"]'::jsonb, explanation = 'The course: "Neither module exports an emission factor or a global warming potential." carbonAbatement exports MW_C, MW_CO2 and MW_CH4, and energyEfficiency exports FUEL_REFERENCE with typical heating values and HEATING_VALUE_BASIS: LHV, HHV.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-an-inventory-counts' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m01-what-an-inventory-counts ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m01-what-an-inventory-counts ord 13
  select case
           when prompt = 'What does FUEL_REFERENCE_NOTE say about the heating values in energyEfficiency''s fuel table?' and options = '["They are definitional, like the atom counts, and drive the stoichiometry.", "They are the IUPAC values, and no fuel analysis may change them in a call.", "They are typical: the fuel analysis governs, and a measured value should replace these.", "They are defaults the engine reads whenever a heating value box is blank."]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 1''s note on the fuel table labels the heating values typical, says the fuel analysis governs, and asks for a measured value in their place. The definitional label belongs to the atom counts.' then 'old'
           when prompt = 'What does FUEL_REFERENCE_NOTE say about the heating values in energyEfficiency''s fuel table?' and options = '["They are definitional, like the atom counts, and drive the stoichiometry.", "They are the IUPAC values, and no fuel analysis may change them in a call.", "They are typical: the fuel analysis governs, and a measured value should replace these.", "They are defaults the engine reads whenever a heating value box is blank."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course''s note on the fuel table labels the heating values typical, says the fuel analysis governs, and asks for a measured value in their place. The definitional label belongs to the atom counts.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-an-inventory-counts' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m01-what-an-inventory-counts ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m01-what-an-inventory-counts ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does FUEL_REFERENCE_NOTE say about the heating values in energyEfficiency''s fuel table?', options = '["They are definitional, like the atom counts, and drive the stoichiometry.", "They are the IUPAC values, and no fuel analysis may change them in a call.", "They are typical: the fuel analysis governs, and a measured value should replace these.", "They are defaults the engine reads whenever a heating value box is blank."]'::jsonb, explanation = 'The course''s note on the fuel table labels the heating values typical, says the fuel analysis governs, and asks for a measured value in their place. The definitional label belongs to the atom counts.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-an-inventory-counts' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m01-what-an-inventory-counts ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m01-what-an-inventory-counts ord 14
  select case
           when prompt = 'Which Igbogene line is the one line on Scope 2?' and options = '["Vented and fugitive methane, 4231.600 tCO2e", "Purchased electricity, 12915.000 tCO2e", "Flaring (CO2), 2191.807 tCO2e", "Fired heaters (CO2), 23121.448 tCO2e"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 7 prints Purchased electricity on scope 2 at 12915.000 tCO2e, and Scope 2 is the sum of its 1 line. The heaters, the flare''s two lines and the vented methane are the 4 lines of Scope 1.' then 'old'
           when prompt = 'Which Igbogene line is the one line on Scope 2?' and options = '["Vented and fugitive methane, 4231.600 tCO2e", "Purchased electricity, 12915.000 tCO2e", "Flaring (CO2), 2191.807 tCO2e", "Fired heaters (CO2), 23121.448 tCO2e"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The lab prints Purchased electricity on scope 2 at 12915.000 tCO2e, and Scope 2 is the sum of its 1 line. The heaters, the flare''s two lines and the vented methane are the 4 lines of Scope 1.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-an-inventory-counts' and ord = 14;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m01-what-an-inventory-counts ord 14'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m01-what-an-inventory-counts ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which Igbogene line is the one line on Scope 2?', options = '["Vented and fugitive methane, 4231.600 tCO2e", "Purchased electricity, 12915.000 tCO2e", "Flaring (CO2), 2191.807 tCO2e", "Fired heaters (CO2), 23121.448 tCO2e"]'::jsonb, explanation = 'The lab prints Purchased electricity on scope 2 at 12915.000 tCO2e, and Scope 2 is the sum of its 1 line. The heaters, the flare''s two lines and the vented methane are the 4 lines of Scope 1.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-an-inventory-counts' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m01-what-an-inventory-counts ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m01-what-an-inventory-counts ord 15
  select case
           when prompt = 'PROPERTY_REFERENCE lists a latent heat of vaporisation of water of 2442 kJ/kg. How does the table label it?' and options = '["Measured on the Igbogene fuel gas", "Definitional, like the atom counts", "A default the stack loss applies unlabelled", "Typical, at a 25 C reference"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 1 heads the table "typical values a stack loss needs, each labelled as typical", and the waterLatentHeatKJkg row reads 2442, at 25 C reference.' then 'old'
           when prompt = 'PROPERTY_REFERENCE lists a latent heat of vaporisation of water of 2442 kJ/kg. How does the table label it?' and options = '["Measured on the Igbogene fuel gas", "Definitional, like the atom counts", "A default the stack loss applies unlabelled", "Typical, at a 25 C reference"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course heads the table "typical values a stack loss needs, each labelled as typical", and the waterLatentHeatKJkg row reads 2442, at 25 C reference.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-an-inventory-counts' and ord = 15;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m01-what-an-inventory-counts ord 15'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m01-what-an-inventory-counts ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'PROPERTY_REFERENCE lists a latent heat of vaporisation of water of 2442 kJ/kg. How does the table label it?', options = '["Measured on the Igbogene fuel gas", "Definitional, like the atom counts", "A default the stack loss applies unlabelled", "Typical, at a 25 C reference"]'::jsonb, explanation = 'The course heads the table "typical values a stack loss needs, each labelled as typical", and the waterLatentHeatKJkg row reads 2442, at 25 C reference.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm01-what-an-inventory-counts' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m01-what-an-inventory-counts ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m02-carbon-in-co2-out ord 1
  select case
           when prompt = 'What does the engine''s own statement of its combustion method say the atom balance needs as a source?' and options = '["A registered emission factor with its source and its version", "No source document, because it is conservation of mass", "The declared GWP set, which converts the carbon it counts", "The fuel supplier''s statement for the year it is run on"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 3 quotes the method verbatim: "Atom balance: carbon in equals CO2 out. This is conservation of mass, so it needs no source document." In SECTION 7 each atom-balance line carries the source "Atom balance (conservation of mass)" and the version "not applicable"; the registered factors carry a source and a version.' then 'old'
           when prompt = 'What does the engine''s own statement of its combustion method say the atom balance needs as a source?' and options = '["A registered emission factor with its source and its version", "No source document, because it is conservation of mass", "The declared GWP set, which converts the carbon it counts", "The fuel supplier''s statement for the year it is run on"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course quotes the method verbatim: "Atom balance: carbon in equals CO2 out. This is conservation of mass, so it needs no source document." In the lab''s inventory each atom-balance line carries the source "Atom balance (conservation of mass)" and the version "not applicable"; the registered factors carry a source and a version.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-carbon-in-co2-out' and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m02-carbon-in-co2-out ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m02-carbon-in-co2-out ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does the engine''s own statement of its combustion method say the atom balance needs as a source?', options = '["A registered emission factor with its source and its version", "No source document, because it is conservation of mass", "The declared GWP set, which converts the carbon it counts", "The fuel supplier''s statement for the year it is run on"]'::jsonb, explanation = 'The course quotes the method verbatim: "Atom balance: carbon in equals CO2 out. This is conservation of mass, so it needs no source document." In the lab''s inventory each atom-balance line carries the source "Atom balance (conservation of mass)" and the version "not applicable"; the registered factors carry a source and a version.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-carbon-in-co2-out' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m02-carbon-in-co2-out ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m02-carbon-in-co2-out ord 2
  select case
           when prompt = 'One thousand kilomoles of a fuel with one carbon atom a molecule are burned at a destruction efficiency of 0.98. What does the engine return?' and options = '["co2Tonnes 43.569 and ch4Tonnes 0.160", "co2Tonnes 41.809 and ch4Tonnes 0.802", "co2Tonnes 44.009 and ch4Tonnes 0.000", "co2Tonnes 43.129 and ch4Tonnes 0.321"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 3 prints the 0.98 row as carbon kmol 1000.000, co2Tonnes 43.129, ch4Tonnes 0.321. The other pairs are the rows for 0.99, 0.95 and complete combustion at 1.' then 'old'
           when prompt = 'One thousand kilomoles of a fuel with one carbon atom a molecule are burned at a destruction efficiency of 0.98. What does the engine return?' and options = '["co2Tonnes 43.569 and ch4Tonnes 0.160", "co2Tonnes 41.809 and ch4Tonnes 0.802", "co2Tonnes 44.009 and ch4Tonnes 0.000", "co2Tonnes 43.129 and ch4Tonnes 0.321"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The lesson''s table gives the 0.98 row as carbon kmol 1000.000, co2Tonnes 43.129, ch4Tonnes 0.321. The other pairs are the rows for 0.99, 0.95 and complete combustion at 1.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-carbon-in-co2-out' and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m02-carbon-in-co2-out ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m02-carbon-in-co2-out ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'One thousand kilomoles of a fuel with one carbon atom a molecule are burned at a destruction efficiency of 0.98. What does the engine return?', options = '["co2Tonnes 43.569 and ch4Tonnes 0.160", "co2Tonnes 41.809 and ch4Tonnes 0.802", "co2Tonnes 44.009 and ch4Tonnes 0.000", "co2Tonnes 43.129 and ch4Tonnes 0.321"]'::jsonb, explanation = 'The lesson''s table gives the 0.98 row as carbon kmol 1000.000, co2Tonnes 43.129, ch4Tonnes 0.321. The other pairs are the rows for 0.99, 0.95 and complete combustion at 1.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-carbon-in-co2-out' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m02-carbon-in-co2-out ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m02-carbon-in-co2-out ord 3
  select case
           when prompt = 'In the 1000 kmol table, what does the carbon kmol column do as the destruction efficiency falls from 1 to 0.95?' and options = '["It reads 1000.000 in every row.", "It falls with the efficiency, as co2Tonnes does.", "It rises with the efficiency, as ch4Tonnes does.", "It is blank below 1, as escaped carbon is not counted."]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 3 prints carbon kmol 1000.000 on all four rows. The destruction efficiency divides that carbon between CO2 and methane: co2Tonnes falls from 44.009 to 41.809 and ch4Tonnes rises from 0.000 to 0.802.' then 'old'
           when prompt = 'In the 1000 kmol table, what does the carbon kmol column do as the destruction efficiency falls from 1 to 0.95?' and options = '["It reads 1000.000 in every row.", "It falls with the efficiency, as co2Tonnes does.", "It rises with the efficiency, as ch4Tonnes does.", "It is blank below 1, as escaped carbon is not counted."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The lesson''s table prints carbon kmol 1000.000 on all four rows. The destruction efficiency divides that carbon between CO2 and methane: co2Tonnes falls from 44.009 to 41.809 and ch4Tonnes rises from 0.000 to 0.802.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-carbon-in-co2-out' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m02-carbon-in-co2-out ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m02-carbon-in-co2-out ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'In the 1000 kmol table, what does the carbon kmol column do as the destruction efficiency falls from 1 to 0.95?', options = '["It reads 1000.000 in every row.", "It falls with the efficiency, as co2Tonnes does.", "It rises with the efficiency, as ch4Tonnes does.", "It is blank below 1, as escaped carbon is not counted."]'::jsonb, explanation = 'The lesson''s table prints carbon kmol 1000.000 on all four rows. The destruction efficiency divides that carbon between CO2 and methane: co2Tonnes falls from 44.009 to 41.809 and ch4Tonnes rises from 0.000 to 0.802.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-carbon-in-co2-out' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m02-carbon-in-co2-out ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m02-carbon-in-co2-out ord 4
  select case
           when prompt = 'Each kilomole of carbon that escapes combustion leaves as how many kilograms of methane?' and options = '["MW_CO2, which is 44.009", "MW_C, which is 12.011 alone", "MW_CH4, which is 16.043", "The C2H6 molar mass, 30.070"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 3: "Each kilomole that escapes leaves as MW_CH4 kilograms of methane." SECTION 1 prints carbonAbatement.MW_CH4: 16.043. MW_CO2 weighs the carbon that burns, and 30.070 is ethane''s row in FUEL_REFERENCE.' then 'old'
           when prompt = 'Each kilomole of carbon that escapes combustion leaves as how many kilograms of methane?' and options = '["MW_CO2, which is 44.009", "MW_C, which is 12.011 alone", "MW_CH4, which is 16.043", "The C2H6 molar mass, 30.070"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course: "Each kilomole that escapes leaves as MW_CH4 kilograms of methane." The engine returns carbonAbatement.MW_CH4: 16.043. MW_CO2 weighs the carbon that burns, and 30.070 is ethane''s row in FUEL_REFERENCE.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-carbon-in-co2-out' and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m02-carbon-in-co2-out ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m02-carbon-in-co2-out ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Each kilomole of carbon that escapes combustion leaves as how many kilograms of methane?', options = '["MW_CO2, which is 44.009", "MW_C, which is 12.011 alone", "MW_CH4, which is 16.043", "The C2H6 molar mass, 30.070"]'::jsonb, explanation = 'The course: "Each kilomole that escapes leaves as MW_CH4 kilograms of methane." The engine returns carbonAbatement.MW_CH4: 16.043. MW_CO2 weighs the carbon that burns, and 30.070 is ethane''s row in FUEL_REFERENCE.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-carbon-in-co2-out' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m02-carbon-in-co2-out ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m02-carbon-in-co2-out ord 5
  select case
           when prompt = 'The Igbogene fired heaters burn 482000 kmol of fuel a year at 1.09 kmol of carbon per kmol, all invented. What carbonKmolPerYear does the engine return?' and options = '["482000 kmol", "525380.000 kmol", "50820.000 kmol", "23121.448 kmol"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 4 prints carbonKmolPerYear 525380.000 for the heaters. 482000 is the fuel quantity typed in, 50820.000 is the flare''s carbon in SECTION 5, and 23121.448 is the heaters'' co2Tonnes, a mass of CO2 in tonnes.' then 'old'
           when prompt = 'The Igbogene fired heaters burn 482000 kmol of fuel a year at 1.09 kmol of carbon per kmol, all invented. What carbonKmolPerYear does the engine return?' and options = '["482000 kmol", "525380.000 kmol", "50820.000 kmol", "23121.448 kmol"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The engine returns carbonKmolPerYear 525380.000 for the heaters. 482000 is the fuel quantity typed in, 50820.000 is the flare''s carbon in the flare lesson, and 23121.448 is the heaters'' co2Tonnes, a mass of CO2 in tonnes.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-carbon-in-co2-out' and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m02-carbon-in-co2-out ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m02-carbon-in-co2-out ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The Igbogene fired heaters burn 482000 kmol of fuel a year at 1.09 kmol of carbon per kmol, all invented. What carbonKmolPerYear does the engine return?', options = '["482000 kmol", "525380.000 kmol", "50820.000 kmol", "23121.448 kmol"]'::jsonb, explanation = 'The engine returns carbonKmolPerYear 525380.000 for the heaters. 482000 is the fuel quantity typed in, 50820.000 is the flare''s carbon in the flare lesson, and 23121.448 is the heaters'' co2Tonnes, a mass of CO2 in tonnes.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-carbon-in-co2-out' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m02-carbon-in-co2-out ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m02-carbon-in-co2-out ord 6
  select case
           when prompt = 'The same Igbogene heaters are run with a lower destruction efficiency typed, 0.995. What does the engine return?' and options = '["co2Tonnes 23098.327 and ch4Tonnes 8.429", "co2Tonnes 23121.448 and ch4Tonnes 0.000", "co2Tonnes 22272.955 and ch4Tonnes 8.429", "co2Tonnes 23005.841 and ch4Tonnes 42.143"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 4 prints the 0.995 row as 23005.841 t of CO2 and 42.143 t of methane. The 0.999 row is 23098.327 and 8.429, and at the typed 1 the heaters return 23121.448 and 0.000. 22272.955 is the heaters'' co2Tonnes in the row for a carbon per kmol of 1.05.' then 'old'
           when prompt = 'The same Igbogene heaters are run with a lower destruction efficiency typed, 0.995. What does the engine return?' and options = '["co2Tonnes 23098.327 and ch4Tonnes 8.429", "co2Tonnes 23121.448 and ch4Tonnes 0.000", "co2Tonnes 22272.955 and ch4Tonnes 8.429", "co2Tonnes 23005.841 and ch4Tonnes 42.143"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course prints the 0.995 row as 23005.841 t of CO2 and 42.143 t of methane. The 0.999 row is 23098.327 and 8.429, and at the typed 1 the heaters return 23121.448 and 0.000. 22272.955 is the heaters'' co2Tonnes in the row for a carbon per kmol of 1.05.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-carbon-in-co2-out' and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m02-carbon-in-co2-out ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m02-carbon-in-co2-out ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The same Igbogene heaters are run with a lower destruction efficiency typed, 0.995. What does the engine return?', options = '["co2Tonnes 23098.327 and ch4Tonnes 8.429", "co2Tonnes 23121.448 and ch4Tonnes 0.000", "co2Tonnes 22272.955 and ch4Tonnes 8.429", "co2Tonnes 23005.841 and ch4Tonnes 42.143"]'::jsonb, explanation = 'The course prints the 0.995 row as 23005.841 t of CO2 and 42.143 t of methane. The 0.999 row is 23098.327 and 8.429, and at the typed 1 the heaters return 23121.448 and 0.000. 22272.955 is the heaters'' co2Tonnes in the row for a carbon per kmol of 1.05.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-carbon-in-co2-out' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m02-carbon-in-co2-out ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m02-carbon-in-co2-out ord 7
  select case
           when prompt = 'The heaters'' fuel stays at 482000 kmol a year and the carbon per kilomole of fuel is typed as 1.05. What is co2Tonnes?' and options = '["21212.338", "23121.448", "22272.955", "24394.189"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 4 prints the carbon per kmol table: 1.00 gives 21212.338, 1.05 gives 22272.955, the Igbogene 1.09 gives 23121.448 and 1.15 gives 24394.189 t of CO2.' then 'old'
           when prompt = 'The heaters'' fuel stays at 482000 kmol a year and the carbon per kilomole of fuel is typed as 1.05. What is co2Tonnes?' and options = '["21212.338", "23121.448", "22272.955", "24394.189"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course prints the carbon per kmol table: 1.00 gives 21212.338, 1.05 gives 22272.955, the Igbogene 1.09 gives 23121.448 and 1.15 gives 24394.189 t of CO2.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-carbon-in-co2-out' and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m02-carbon-in-co2-out ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m02-carbon-in-co2-out ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The heaters'' fuel stays at 482000 kmol a year and the carbon per kilomole of fuel is typed as 1.05. What is co2Tonnes?', options = '["21212.338", "23121.448", "22272.955", "24394.189"]'::jsonb, explanation = 'The course prints the carbon per kmol table: 1.00 gives 21212.338, 1.05 gives 22272.955, the Igbogene 1.09 gives 23121.448 and 1.15 gives 24394.189 t of CO2.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-carbon-in-co2-out' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m02-carbon-in-co2-out ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m02-carbon-in-co2-out ord 8
  select case
           when prompt = 'How does the digest describe the Igbogene heaters'' carbon per kilomole of fuel, 1.09?' and options = '["The fuel analysis read as carbon atoms, typed in as an input", "A default the engine applies when that box is left out", "A value read from the FUEL_REFERENCE methane row", "The supplier statement (invented), version 2025"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 4: "The carbon per kilomole of fuel is the fuel analysis read as carbon atoms: the Igbogene figure is an input." SECTION 2 refuses a call with the carbon per kmol left out, so there is no default, and the supplier statement is the source of the electricity factor in SECTION 7.' then 'old'
           when prompt = 'How does the course describe the Igbogene heaters'' carbon per kilomole of fuel, 1.09?' and options = '["The fuel analysis read as carbon atoms, typed in as an input", "A default the engine applies when that box is left out", "A value read from the FUEL_REFERENCE methane row", "The supplier statement (invented), version 2025"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course: "The carbon per kilomole of fuel is the fuel analysis read as carbon atoms: the Igbogene figure is an input." The engine refuses a call with the carbon per kmol left out, so there is no default, and the supplier statement is the source of the electricity factor in the inventory.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-carbon-in-co2-out' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m02-carbon-in-co2-out ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m02-carbon-in-co2-out ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'How does the course describe the Igbogene heaters'' carbon per kilomole of fuel, 1.09?', options = '["The fuel analysis read as carbon atoms, typed in as an input", "A default the engine applies when that box is left out", "A value read from the FUEL_REFERENCE methane row", "The supplier statement (invented), version 2025"]'::jsonb, explanation = 'The course: "The carbon per kilomole of fuel is the fuel analysis read as carbon atoms: the Igbogene figure is an input." The engine refuses a call with the carbon per kmol left out, so there is no default, and the supplier statement is the source of the electricity factor in the inventory.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-carbon-in-co2-out' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m02-carbon-in-co2-out ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m02-carbon-in-co2-out ord 9
  select case
           when prompt = 'Which two flare calls get the same refusal, "The destruction efficiency must lie in (0, 1]."?' and options = '["A blank destruction efficiency and one of 0", "A destruction efficiency of 0 and one of 98", "A destruction efficiency of 98 and a fuel of -1 kmol", "A destruction efficiency of 1 and one of 98"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 2 prints the interval refusal for 0 and for 98 typed as a percentage. A blank is refused as required, a fuel of -1 kmol is refused as negative, and 1 lies inside (0, 1], so it computes: SECTION 3 prints a row at 1.' then 'old'
           when prompt = 'Which two flare calls get the same refusal, "The destruction efficiency must lie in (0, 1]."?' and options = '["A blank destruction efficiency and one of 0", "A destruction efficiency of 0 and one of 98", "A destruction efficiency of 98 and a fuel of -1 kmol", "A destruction efficiency of 1 and one of 98"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The engine returns the interval refusal for 0 and for 98 typed as a percentage. A blank is refused as required, a fuel of -1 kmol is refused as negative, and 1 lies inside (0, 1], so it computes: the lesson''s table has a row at 1.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-carbon-in-co2-out' and ord = 9;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m02-carbon-in-co2-out ord 9'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m02-carbon-in-co2-out ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which two flare calls get the same refusal, "The destruction efficiency must lie in (0, 1]."?', options = '["A blank destruction efficiency and one of 0", "A destruction efficiency of 0 and one of 98", "A destruction efficiency of 98 and a fuel of -1 kmol", "A destruction efficiency of 1 and one of 98"]'::jsonb, explanation = 'The engine returns the interval refusal for 0 and for 98 typed as a percentage. A blank is refused as required, a fuel of -1 kmol is refused as negative, and 1 lies inside (0, 1], so it computes: the lesson''s table has a row at 1.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-carbon-in-co2-out' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m02-carbon-in-co2-out ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m02-carbon-in-co2-out ord 10
  select case
           when prompt = 'A flare call leaves the carbon per kilomole of fuel out. What does the engine say?' and options = '["REFUSED: A fuel quantity and a carbon content cannot be negative.", "REFUSED: The destruction efficiency must lie in (0, 1].", "It computes at a stated default of 1 kmol of carbon a kmol of fuel.", "REFUSED: A fuel quantity and the carbon per kilomole of fuel are required."]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 2 prints "REFUSED: A fuel quantity and the carbon per kilomole of fuel are required." for the carbon per kmol left out and for a blank fuel. The destruction efficiency left out of the call takes its stated default of complete combustion; the carbon per kmol left out is refused.' then 'old'
           when prompt = 'A flare call leaves the carbon per kilomole of fuel out. What does the engine say?' and options = '["REFUSED: A fuel quantity and a carbon content cannot be negative.", "REFUSED: The destruction efficiency must lie in (0, 1].", "It computes at a stated default of 1 kmol of carbon a kmol of fuel.", "REFUSED: A fuel quantity and the carbon per kilomole of fuel are required."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The engine returns "REFUSED: A fuel quantity and the carbon per kilomole of fuel are required." for the carbon per kmol left out and for a blank fuel. The destruction efficiency left out of the call takes its stated default of complete combustion; the carbon per kmol left out is refused.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-carbon-in-co2-out' and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m02-carbon-in-co2-out ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m02-carbon-in-co2-out ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A flare call leaves the carbon per kilomole of fuel out. What does the engine say?', options = '["REFUSED: A fuel quantity and a carbon content cannot be negative.", "REFUSED: The destruction efficiency must lie in (0, 1].", "It computes at a stated default of 1 kmol of carbon a kmol of fuel.", "REFUSED: A fuel quantity and the carbon per kilomole of fuel are required."]'::jsonb, explanation = 'The engine returns "REFUSED: A fuel quantity and the carbon per kilomole of fuel are required." for the carbon per kmol left out and for a blank fuel. The destruction efficiency left out of the call takes its stated default of complete combustion; the carbon per kmol left out is refused.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-carbon-in-co2-out' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m02-carbon-in-co2-out ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m02-carbon-in-co2-out ord 11
  select case
           when prompt = 'Fuel typed as -1 kmol on the flare: which refusal follows?' and options = '["REFUSED: A fuel quantity and a carbon content cannot be negative.", "REFUSED: A fuel quantity and the carbon per kilomole of fuel are required.", "REFUSED: The destruction efficiency must lie in (0, 1].", "REFUSED: A registered emission factor is required."]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 2 prints the negative refusal for a fuel of -1 kmol. The "are required" refusal is for a blank fuel or a carbon per kmol left out, the interval refusal is for the efficiency, and the factor refusal belongs to emissionLine.' then 'old'
           when prompt = 'Fuel typed as -1 kmol on the flare: which refusal follows?' and options = '["REFUSED: A fuel quantity and a carbon content cannot be negative.", "REFUSED: A fuel quantity and the carbon per kilomole of fuel are required.", "REFUSED: The destruction efficiency must lie in (0, 1].", "REFUSED: A registered emission factor is required."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The engine returns the negative refusal for a fuel of -1 kmol. The "are required" refusal is for a blank fuel or a carbon per kmol left out, the interval refusal is for the efficiency, and the factor refusal belongs to emissionLine.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-carbon-in-co2-out' and ord = 11;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m02-carbon-in-co2-out ord 11'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m02-carbon-in-co2-out ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Fuel typed as -1 kmol on the flare: which refusal follows?', options = '["REFUSED: A fuel quantity and a carbon content cannot be negative.", "REFUSED: A fuel quantity and the carbon per kilomole of fuel are required.", "REFUSED: The destruction efficiency must lie in (0, 1].", "REFUSED: A registered emission factor is required."]'::jsonb, explanation = 'The engine returns the negative refusal for a fuel of -1 kmol. The "are required" refusal is for a blank fuel or a carbon per kmol left out, the interval refusal is for the efficiency, and the factor refusal belongs to emissionLine.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-carbon-in-co2-out' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m02-carbon-in-co2-out ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m02-carbon-in-co2-out ord 12
  select case
           when prompt = 'Which keys does combustionCo2FromCarbon''s result carry for the gases it computes?' and options = '["co2Tonnes, ch4Tonnes and n2oTonnes", "co2Tonnes only, with methane left to a factor line", "co2Tonnes and ch4Tonnes, and no other gas", "one key in tCO2e, converted on the declared set"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 3: "The engine''s result carries these keys and no other gas: co2Tonnes, ch4Tonnes." Nitrous oxide from combustion is not computed by the atom balance (H4) and needs an emission factor line. In SECTION 7 the flare''s 16.306 t CH4 is converted at a GWP of 29.8 on IPCC AR6 GWP100, fossil methane.' then 'old'
           when prompt = 'Which keys does combustionCo2FromCarbon''s result carry for the gases it computes?' and options = '["co2Tonnes, ch4Tonnes and n2oTonnes", "co2Tonnes only, with methane left to a factor line", "co2Tonnes and ch4Tonnes, and no other gas", "one key in tCO2e, converted on the declared set"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course: "The engine''s result carries these keys and no other gas: co2Tonnes, ch4Tonnes." Nitrous oxide from combustion is not computed by the atom balance (H4) and needs an emission factor line. In the lab''s inventory the flare''s 16.306 t CH4 is converted at a GWP of 29.8 on IPCC AR6 GWP100, fossil methane.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-carbon-in-co2-out' and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m02-carbon-in-co2-out ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m02-carbon-in-co2-out ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which keys does combustionCo2FromCarbon''s result carry for the gases it computes?', options = '["co2Tonnes, ch4Tonnes and n2oTonnes", "co2Tonnes only, with methane left to a factor line", "co2Tonnes and ch4Tonnes, and no other gas", "one key in tCO2e, converted on the declared set"]'::jsonb, explanation = 'The course: "The engine''s result carries these keys and no other gas: co2Tonnes, ch4Tonnes." Nitrous oxide from combustion is not computed by the atom balance (H4) and needs an emission factor line. In the lab''s inventory the flare''s 16.306 t CH4 is converted at a GWP of 29.8 on IPCC AR6 GWP100, fossil methane.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-carbon-in-co2-out' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m02-carbon-in-co2-out ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m02-carbon-in-co2-out ord 13
  select case
           when prompt = 'carbonAbatement.MW_CO2 reads 44.009. How does the digest say it is built?' and options = '["12.011 plus four hydrogens at 1.008", "12.011 plus two oxygens at 15.999", "12.011 plus two oxygens at 16.043", "The carbon atom alone, at 12.011"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 3: MW_CO2 44.009 is 12.011 plus two oxygens at 15.999, and MW_CH4 16.043 is 12.011 plus four hydrogens at 1.008. MW_C, 12.011, is the carbon atom alone.' then 'old'
           when prompt = 'carbonAbatement.MW_CO2 reads 44.009. How does the course say it is built?' and options = '["12.011 plus four hydrogens at 1.008", "12.011 plus two oxygens at 15.999", "12.011 plus two oxygens at 16.043", "The carbon atom alone, at 12.011"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course: MW_CO2 44.009 is 12.011 plus two oxygens at 15.999, and MW_CH4 16.043 is 12.011 plus four hydrogens at 1.008. MW_C, 12.011, is the carbon atom alone.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-carbon-in-co2-out' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m02-carbon-in-co2-out ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m02-carbon-in-co2-out ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'carbonAbatement.MW_CO2 reads 44.009. How does the course say it is built?', options = '["12.011 plus four hydrogens at 1.008", "12.011 plus two oxygens at 15.999", "12.011 plus two oxygens at 16.043", "The carbon atom alone, at 12.011"]'::jsonb, explanation = 'The course: MW_CO2 44.009 is 12.011 plus two oxygens at 15.999, and MW_CH4 16.043 is 12.011 plus four hydrogens at 1.008. MW_C, 12.011, is the carbon atom alone.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-carbon-in-co2-out' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m02-carbon-in-co2-out ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m02-carbon-in-co2-out ord 14
  select case
           when prompt = 'The Igbogene heaters'' destruction efficiency is 1. How does SECTION 4 record it?' and options = '["Left out of the call, so the stated default applied", "Taken from the operator''s flare study", "Typed in the call, for complete combustion", "Set by the engine for every burner call"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 4 lists the inputs as "destruction efficiency 1 (complete combustion, typed)". The stated default applies only to an argument left out of the call (SECTION 2), and the flare study states the flare''s 0.98.' then 'old'
           when prompt = 'The Igbogene heaters'' destruction efficiency is 1. How does the course record it?' and options = '["Left out of the call, so the stated default applied", "Taken from the operator''s flare study", "Typed in the call, for complete combustion", "Set by the engine for every burner call"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course lists the inputs as "destruction efficiency 1 (complete combustion, typed)". The stated default applies only to an argument left out of the call, and the flare study states the flare''s 0.98.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-carbon-in-co2-out' and ord = 14;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m02-carbon-in-co2-out ord 14'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m02-carbon-in-co2-out ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The Igbogene heaters'' destruction efficiency is 1. How does the course record it?', options = '["Left out of the call, so the stated default applied", "Taken from the operator''s flare study", "Typed in the call, for complete combustion", "Set by the engine for every burner call"]'::jsonb, explanation = 'The course lists the inputs as "destruction efficiency 1 (complete combustion, typed)". The stated default applies only to an argument left out of the call, and the flare study states the flare''s 0.98.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-carbon-in-co2-out' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m02-carbon-in-co2-out ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m02-carbon-in-co2-out ord 15
  select case
           when prompt = 'The digest explains why 1000 kmol of carbon burned completely is 44.009 t of CO2. What is the explanation?' and options = '["Each kilomole of carbon that burns leaves as MW_CO2 kilograms of CO2.", "A registered factor of 44.009 is applied to each tonne of the fuel burned.", "Each kilomole of carbon that burns leaves as MW_CH4 kilograms of CO2.", "The CO2 is weighed at MW_C and then converted at the set''s GWP."]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 3 gives this as the reason 1000 kmol burned completely is 44.009 t. The method uses no registered factor, and MW_CH4 is for escaped carbon.' then 'old'
           when prompt = 'The course explains why 1000 kmol of carbon burned completely is 44.009 t of CO2. What is the explanation?' and options = '["Each kilomole of carbon that burns leaves as MW_CO2 kilograms of CO2.", "A registered factor of 44.009 is applied to each tonne of the fuel burned.", "Each kilomole of carbon that burns leaves as MW_CH4 kilograms of CO2.", "The CO2 is weighed at MW_C and then converted at the set''s GWP."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course gives this as the reason 1000 kmol burned completely is 44.009 t. The method uses no registered factor, and MW_CH4 is for escaped carbon.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-carbon-in-co2-out' and ord = 15;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m02-carbon-in-co2-out ord 15'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m02-carbon-in-co2-out ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course explains why 1000 kmol of carbon burned completely is 44.009 t of CO2. What is the explanation?', options = '["Each kilomole of carbon that burns leaves as MW_CO2 kilograms of CO2.", "A registered factor of 44.009 is applied to each tonne of the fuel burned.", "Each kilomole of carbon that burns leaves as MW_CH4 kilograms of CO2.", "The CO2 is weighed at MW_C and then converted at the set''s GWP."]'::jsonb, explanation = 'The course gives this as the reason 1000 kmol burned completely is 44.009 t. The method uses no registered factor, and MW_CH4 is for escaped carbon.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm02-carbon-in-co2-out' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m02-carbon-in-co2-out ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m03-the-flare-as-an-inventory-line ord 1
  select case
           when prompt = 'Where does the Igbogene flare''s destruction efficiency of 0.98 come from?' and options = '["It is the engine''s default for a flare, applied to a blank box.", "It is read from FUEL_REFERENCE beside the typical heating values.", "The operator''s flare study states it, and the figure is invented.", "It is the complete combustion default, 1, less the methane share."]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 5: "The operator''s flare study states a destruction efficiency of 0.98 (invented)." SECTION 2 refuses a blank flare efficiency, and a flare is asked for its efficiency every time.' then 'old'
           when prompt = 'Where does the Igbogene flare''s destruction efficiency of 0.98 come from?' and options = '["It is the engine''s default for a flare, applied to a blank box.", "It is read from FUEL_REFERENCE beside the typical heating values.", "The operator''s flare study states it, and the figure is invented.", "It is the complete combustion default, 1, less the methane share."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course: "The operator''s flare study states a destruction efficiency of 0.98 (invented)." The engine refuses a blank flare efficiency, and a flare is asked for its efficiency every time.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-the-flare-as-an-inventory-line' and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m03-the-flare-as-an-inventory-line ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m03-the-flare-as-an-inventory-line ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Where does the Igbogene flare''s destruction efficiency of 0.98 come from?', options = '["It is the engine''s default for a flare, applied to a blank box.", "It is read from FUEL_REFERENCE beside the typical heating values.", "The operator''s flare study states it, and the figure is invented.", "It is the complete combustion default, 1, less the methane share."]'::jsonb, explanation = 'The course: "The operator''s flare study states a destruction efficiency of 0.98 (invented)." The engine refuses a blank flare efficiency, and a flare is asked for its efficiency every time.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-the-flare-as-an-inventory-line' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m03-the-flare-as-an-inventory-line ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m03-the-flare-as-an-inventory-line ord 2
  select case
           when prompt = 'What is the Igbogene flare''s carbonKmolPerYear at a destruction efficiency of 0.9?' and options = '["50820.000, the same as at every other efficiency", "38500, the gas sent to the flare in a year", "525380.000, the same carbon as the heaters count", "Lower than at 1, since less of the carbon burns in the flame"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 5 prints carbonKmolPerYear 50820.000 at every efficiency: "The efficiency splits that carbon between CO2 and methane; it does not change it." 38500 kmol is the gas sent to the flare and 525380.000 is the heaters'' carbon in SECTION 4.' then 'old'
           when prompt = 'What is the Igbogene flare''s carbonKmolPerYear at a destruction efficiency of 0.9?' and options = '["50820.000, the same as at every other efficiency", "38500, the gas sent to the flare in a year", "525380.000, the same carbon as the heaters count", "Lower than at 1, since less of the carbon burns in the flame"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The lab prints carbonKmolPerYear 50820.000 at every efficiency: "The efficiency splits that carbon between CO2 and methane; it does not change it." 38500 kmol is the gas sent to the flare and 525380.000 is the heaters'' carbon in the lab.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-the-flare-as-an-inventory-line' and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m03-the-flare-as-an-inventory-line ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m03-the-flare-as-an-inventory-line ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What is the Igbogene flare''s carbonKmolPerYear at a destruction efficiency of 0.9?', options = '["50820.000, the same as at every other efficiency", "38500, the gas sent to the flare in a year", "525380.000, the same carbon as the heaters count", "Lower than at 1, since less of the carbon burns in the flame"]'::jsonb, explanation = 'The lab prints carbonKmolPerYear 50820.000 at every efficiency: "The efficiency splits that carbon between CO2 and methane; it does not change it." 38500 kmol is the gas sent to the flare and 525380.000 is the heaters'' carbon in the lab.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-the-flare-as-an-inventory-line' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m03-the-flare-as-an-inventory-line ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m03-the-flare-as-an-inventory-line ord 3
  select case
           when prompt = 'On the course''s set, IPCC AR6 GWP100 fossil methane, what does the flare total at a destruction efficiency of 0.95?' and options = '["2124.711 tCO2e", "1214.805 tCO2e", "4442.493 tCO2e", "3339.515 tCO2e"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The 0.95 row of SECTION 5 reads co2Tonnes 2124.711 and a methane line of 1214.805, in a column headed CO2 plus methane line that prints 3339.515. The 0.9 row prints 4442.493.' then 'old'
           when prompt = 'On the course''s set, IPCC AR6 GWP100 fossil methane, what does the flare total at a destruction efficiency of 0.95?' and options = '["2124.711 tCO2e", "1214.805 tCO2e", "4442.493 tCO2e", "3339.515 tCO2e"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The 0.95 row of the lab''s flare table reads co2Tonnes 2124.711 and a methane line of 1214.805, in a column headed CO2 plus methane line that prints 3339.515. The 0.9 row prints 4442.493.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-the-flare-as-an-inventory-line' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m03-the-flare-as-an-inventory-line ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m03-the-flare-as-an-inventory-line ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'On the course''s set, IPCC AR6 GWP100 fossil methane, what does the flare total at a destruction efficiency of 0.95?', options = '["2124.711 tCO2e", "1214.805 tCO2e", "4442.493 tCO2e", "3339.515 tCO2e"]'::jsonb, explanation = 'The 0.95 row of the lab''s flare table reads co2Tonnes 2124.711 and a methane line of 1214.805, in a column headed CO2 plus methane line that prints 3339.515. The 0.9 row prints 4442.493.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-the-flare-as-an-inventory-line' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m03-the-flare-as-an-inventory-line ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m03-the-flare-as-an-inventory-line ord 4
  select case
           when prompt = 'The Igbogene flare is run at a destruction efficiency of 1. How does its methane appear in the table?' and options = '["A methane line of 242.961 tCO2e beside 2236.537 t of CO2.", "No methane line at all; the flare is 2236.537 tCO2e.", "A methane line of 0.000 tCO2e, printed as a line of its own.", "It is refused, since a flare must lie below complete combustion."]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 5 prints the row at 1 as co2Tonnes 2236.537, ch4Tonnes 0.000, methane line "no line (no methane)" and flare tCO2e 2236.537. The interval (0, 1] includes 1, so the call computes; 242.961 is the methane line at 0.99.' then 'old'
           when prompt = 'The Igbogene flare is run at a destruction efficiency of 1. How does its methane appear in the table?' and options = '["A methane line of 242.961 tCO2e beside 2236.537 t of CO2.", "No methane line at all; the flare is 2236.537 tCO2e.", "A methane line of 0.000 tCO2e, printed as a line of its own.", "It is refused, since a flare must lie below complete combustion."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The lab prints the row at 1 as co2Tonnes 2236.537, ch4Tonnes 0.000, methane line "no line (no methane)" and flare tCO2e 2236.537. The interval (0, 1] includes 1, so the call computes; 242.961 is the methane line at 0.99.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-the-flare-as-an-inventory-line' and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m03-the-flare-as-an-inventory-line ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m03-the-flare-as-an-inventory-line ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The Igbogene flare is run at a destruction efficiency of 1. How does its methane appear in the table?', options = '["A methane line of 242.961 tCO2e beside 2236.537 t of CO2.", "No methane line at all; the flare is 2236.537 tCO2e.", "A methane line of 0.000 tCO2e, printed as a line of its own.", "It is refused, since a flare must lie below complete combustion."]'::jsonb, explanation = 'The lab prints the row at 1 as co2Tonnes 2236.537, ch4Tonnes 0.000, methane line "no line (no methane)" and flare tCO2e 2236.537. The interval (0, 1] includes 1, so the call computes; 242.961 is the methane line at 0.99.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-the-flare-as-an-inventory-line' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m03-the-flare-as-an-inventory-line ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m03-the-flare-as-an-inventory-line ord 5
  select case
           when prompt = 'Handed to atomBalanceLines, what does the flare refused for a blank destruction efficiency become?' and options = '["0 lines, as for a source excluded on purpose", "Two lines computed at complete combustion", "1 line labelled Flaring that carries the refusal", "Two lines of 0.000 t each, counted unsourced"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 5: handed to atomBalanceLines, the refused flare becomes 1 line labelled Flaring that carries the refusal, so an inventory built with it is blocked on the flare. SECTION 9 prints 0 lines only for a source with excluded true, left out of the boundary on purpose.' then 'old'
           when prompt = 'Handed to atomBalanceLines, what does the flare refused for a blank destruction efficiency become?' and options = '["0 lines, as for a source excluded on purpose", "Two lines computed at complete combustion", "1 line labelled Flaring that carries the refusal", "Two lines of 0.000 t each, counted unsourced"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course: handed to atomBalanceLines, the refused flare becomes 1 line labelled Flaring that carries the refusal, so an inventory built with it is blocked on the flare. The course prints 0 lines only for a source with excluded true, left out of the boundary on purpose.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-the-flare-as-an-inventory-line' and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m03-the-flare-as-an-inventory-line ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m03-the-flare-as-an-inventory-line ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Handed to atomBalanceLines, what does the flare refused for a blank destruction efficiency become?', options = '["0 lines, as for a source excluded on purpose", "Two lines computed at complete combustion", "1 line labelled Flaring that carries the refusal", "Two lines of 0.000 t each, counted unsourced"]'::jsonb, explanation = 'The course: handed to atomBalanceLines, the refused flare becomes 1 line labelled Flaring that carries the refusal, so an inventory built with it is blocked on the flare. The course prints 0 lines only for a source with excluded true, left out of the boundary on purpose.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-the-flare-as-an-inventory-line' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m03-the-flare-as-an-inventory-line ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m03-the-flare-as-an-inventory-line ord 6
  select case
           when prompt = 'Read as 100 percent, the same flare is 2236.537 tCO2e with no methane line. How far below the flare at 0.98 is that?' and options = '["485.922 tCO2e", "441.191 tCO2e", "242.961 tCO2e", "440.265 tCO2e"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 5 prints: "Read as 100 percent, the same flare is 2236.537 tCO2e with no methane line: 441.191 tCO2e below the flare at 0.98 (computed here from the engine''s figures)." 485.922 is the methane line at 0.98, 242.961 the methane line at 0.99, and 440.265 the flare''s methane line on IPCC AR6 GWP100, non-fossil methane (SECTION 8).' then 'old'
           when prompt = 'Read as 100 percent, the same flare is 2236.537 tCO2e with no methane line. How far below the flare at 0.98 is that?' and options = '["485.922 tCO2e", "441.191 tCO2e", "242.961 tCO2e", "440.265 tCO2e"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course states: "Read as 100 percent, the same flare is 2236.537 tCO2e with no methane line: 441.191 tCO2e below the flare at 0.98 (computed here from the engine''s figures)." 485.922 is the methane line at 0.98, 242.961 the methane line at 0.99, and 440.265 the flare''s methane line on IPCC AR6 GWP100, non-fossil methane.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-the-flare-as-an-inventory-line' and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m03-the-flare-as-an-inventory-line ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m03-the-flare-as-an-inventory-line ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Read as 100 percent, the same flare is 2236.537 tCO2e with no methane line. How far below the flare at 0.98 is that?', options = '["485.922 tCO2e", "441.191 tCO2e", "242.961 tCO2e", "440.265 tCO2e"]'::jsonb, explanation = 'The course states: "Read as 100 percent, the same flare is 2236.537 tCO2e with no methane line: 441.191 tCO2e below the flare at 0.98 (computed here from the engine''s figures)." 485.922 is the methane line at 0.98, 242.961 the methane line at 0.99, and 440.265 the flare''s methane line on IPCC AR6 GWP100, non-fossil methane.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-the-flare-as-an-inventory-line' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m03-the-flare-as-an-inventory-line ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m03-the-flare-as-an-inventory-line ord 7
  select case
           when prompt = 'At 0.98, what share of the flare''s 2677.729 tCO2e does the digest print for the methane line?' and options = '["0.011315", "0.051037", "0.098534", "0.181468"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 5: "At 0.98 the methane line is 485.922 tCO2e of the flare''s 2677.729 tCO2e, a share of 0.181468 (computed here from the engine''s figures)." The other three are SECTION 7 shares of the whole inventory''s total: the flare''s methane, the flare''s CO2 and the vented methane.' then 'old'
           when prompt = 'At 0.98, what share of the flare''s 2677.729 tCO2e does the course print for the methane line?' and options = '["0.011315", "0.051037", "0.098534", "0.181468"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course: "At 0.98 the methane line is 485.922 tCO2e of the flare''s 2677.729 tCO2e, a share of 0.181468 (computed here from the engine''s figures)." The other three are the lab''s shares of the whole inventory''s total: the flare''s methane, the flare''s CO2 and the vented methane.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-the-flare-as-an-inventory-line' and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m03-the-flare-as-an-inventory-line ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m03-the-flare-as-an-inventory-line ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'At 0.98, what share of the flare''s 2677.729 tCO2e does the course print for the methane line?', options = '["0.011315", "0.051037", "0.098534", "0.181468"]'::jsonb, explanation = 'The course: "At 0.98 the methane line is 485.922 tCO2e of the flare''s 2677.729 tCO2e, a share of 0.181468 (computed here from the engine''s figures)." The other three are the lab''s shares of the whole inventory''s total: the flare''s methane, the flare''s CO2 and the vented methane.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-the-flare-as-an-inventory-line' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m03-the-flare-as-an-inventory-line ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m03-the-flare-as-an-inventory-line ord 8
  select case
           when prompt = 'Which methane potential does the engine''s note on escaped carbon tell a user to apply?' and options = '["The non-fossil methane potential", "The fossil methane potential", "The CO2 value of 1, as for burned carbon", "The set''s N2O value"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 5 quotes the engine''s note on escaped carbon, and its middle sentence reads: "Use the fossil methane potential for it." The course converts every methane line on IPCC AR6 GWP100, fossil methane.' then 'old'
           when prompt = 'Which methane potential does the engine''s note on escaped carbon tell a user to apply?' and options = '["The non-fossil methane potential", "The fossil methane potential", "The CO2 value of 1, as for burned carbon", "The set''s N2O value"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course quotes the engine''s note on escaped carbon, and its middle sentence reads: "Use the fossil methane potential for it." The course converts every methane line on IPCC AR6 GWP100, fossil methane.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-the-flare-as-an-inventory-line' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m03-the-flare-as-an-inventory-line ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m03-the-flare-as-an-inventory-line ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which methane potential does the engine''s note on escaped carbon tell a user to apply?', options = '["The non-fossil methane potential", "The fossil methane potential", "The CO2 value of 1, as for burned carbon", "The set''s N2O value"]'::jsonb, explanation = 'The course quotes the engine''s note on escaped carbon, and its middle sentence reads: "Use the fossil methane potential for it." The course converts every methane line on IPCC AR6 GWP100, fossil methane.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-the-flare-as-an-inventory-line' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m03-the-flare-as-an-inventory-line ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m03-the-flare-as-an-inventory-line ord 9
  select case
           when prompt = 'What does the course hold, as H3, about carbon that escapes a flare?' and options = '["Escaped carbon is counted at the gas''s own methane content, which each flare study measures and types in.", "Escaped carbon is counted as CO2 at a GWP of 1, the same way the carbon that burns is counted in the line.", "Every escaped atom is counted as methane; a method on the gas''s own methane content is the owner''s decision.", "Escaped carbon is left out of the inventory until the operator''s flare study has been filed and referenced."]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 5 and SECTION 25: every carbon atom that escapes is counted as methane, the engine''s stated and conservative assumption. A method that uses the gas''s own methane content is a different method and is the owner''s decision; the course grades nothing that depends on changing it.' then 'old'
           when prompt = 'What does the course hold, as H3, about carbon that escapes a flare?' and options = '["Escaped carbon is counted at the gas''s own methane content, which each flare study measures and types in.", "Escaped carbon is counted as CO2 at a GWP of 1, the same way the carbon that burns is counted in the line.", "Every escaped atom is counted as methane; a method on the gas''s own methane content is the owner''s decision.", "Escaped carbon is left out of the inventory until the operator''s flare study has been filed and referenced."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course: every carbon atom that escapes is counted as methane, the engine''s stated and conservative assumption. A method that uses the gas''s own methane content is a different method and is the owner''s decision; the course grades nothing that depends on changing it.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-the-flare-as-an-inventory-line' and ord = 9;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m03-the-flare-as-an-inventory-line ord 9'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m03-the-flare-as-an-inventory-line ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does the course hold, as H3, about carbon that escapes a flare?', options = '["Escaped carbon is counted at the gas''s own methane content, which each flare study measures and types in.", "Escaped carbon is counted as CO2 at a GWP of 1, the same way the carbon that burns is counted in the line.", "Every escaped atom is counted as methane; a method on the gas''s own methane content is the owner''s decision.", "Escaped carbon is left out of the inventory until the operator''s flare study has been filed and referenced."]'::jsonb, explanation = 'The course: every carbon atom that escapes is counted as methane, the engine''s stated and conservative assumption. A method that uses the gas''s own methane content is a different method and is the owner''s decision; the course grades nothing that depends on changing it.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-the-flare-as-an-inventory-line' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m03-the-flare-as-an-inventory-line ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m03-the-flare-as-an-inventory-line ord 10
  select case
           when prompt = 'Down the flare table from 1 to 0.9, what do co2Tonnes and the flare tCO2e do?' and options = '["co2Tonnes falls to 2012.884 while the flare total rises to 4442.493 tCO2e", "Both fall, co2Tonnes to 2012.884 and the flare total to 2124.711 tCO2e", "co2Tonnes holds at 2236.537 while the methane line rises to 2429.610 tCO2e", "Both rise, co2Tonnes to 2457.133 and the flare total to 4442.493 tCO2e"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 5 prints co2Tonnes 2236.537 at 1 and 2012.884 at 0.9, and flare tCO2e 2236.537 at 1 and 4442.493 at 0.9. 2429.610 is the methane line at 0.9, 2124.711 the CO2 at 0.95 and 2457.133 the flare total at 0.99.' then 'old'
           when prompt = 'Down the flare table from 1 to 0.9, what do co2Tonnes and the flare tCO2e do?' and options = '["co2Tonnes falls to 2012.884 while the flare total rises to 4442.493 tCO2e", "Both fall, co2Tonnes to 2012.884 and the flare total to 2124.711 tCO2e", "co2Tonnes holds at 2236.537 while the methane line rises to 2429.610 tCO2e", "Both rise, co2Tonnes to 2457.133 and the flare total to 4442.493 tCO2e"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The lab prints co2Tonnes 2236.537 at 1 and 2012.884 at 0.9, and flare tCO2e 2236.537 at 1 and 4442.493 at 0.9. 2429.610 is the methane line at 0.9, 2124.711 the CO2 at 0.95 and 2457.133 the flare total at 0.99.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-the-flare-as-an-inventory-line' and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m03-the-flare-as-an-inventory-line ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m03-the-flare-as-an-inventory-line ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Down the flare table from 1 to 0.9, what do co2Tonnes and the flare tCO2e do?', options = '["co2Tonnes falls to 2012.884 while the flare total rises to 4442.493 tCO2e", "Both fall, co2Tonnes to 2012.884 and the flare total to 2124.711 tCO2e", "co2Tonnes holds at 2236.537 while the methane line rises to 2429.610 tCO2e", "Both rise, co2Tonnes to 2457.133 and the flare total to 4442.493 tCO2e"]'::jsonb, explanation = 'The lab prints co2Tonnes 2236.537 at 1 and 2012.884 at 0.9, and flare tCO2e 2236.537 at 1 and 4442.493 at 0.9. 2429.610 is the methane line at 0.9, 2124.711 the CO2 at 0.95 and 2457.133 the flare total at 0.99.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-the-flare-as-an-inventory-line' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m03-the-flare-as-an-inventory-line ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m03-the-flare-as-an-inventory-line ord 11
  select case
           when prompt = 'The flare''s 0.99 row returns 8.153 t CH4. Which methane line in tCO2e sits beside it?' and options = '["485.922 tCO2e", "2457.133 tCO2e", "8.153 tCO2e", "242.961 tCO2e"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 5 prints the 0.99 row: ch4Tonnes 8.153, methane line 242.961 tCO2e on IPCC AR6 GWP100, fossil methane (CH4 29.8), and flare tCO2e 2457.133. 485.922 is the methane line at 0.98. 8.153 is tonnes of methane, a different quantity from tCO2e.' then 'old'
           when prompt = 'The flare''s 0.99 row returns 8.153 t CH4. Which methane line in tCO2e sits beside it?' and options = '["485.922 tCO2e", "2457.133 tCO2e", "8.153 tCO2e", "242.961 tCO2e"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The lab prints the 0.99 row: ch4Tonnes 8.153, methane line 242.961 tCO2e on IPCC AR6 GWP100, fossil methane (CH4 29.8), and flare tCO2e 2457.133. 485.922 is the methane line at 0.98. 8.153 is tonnes of methane, a different quantity from tCO2e.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-the-flare-as-an-inventory-line' and ord = 11;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m03-the-flare-as-an-inventory-line ord 11'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m03-the-flare-as-an-inventory-line ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The flare''s 0.99 row returns 8.153 t CH4. Which methane line in tCO2e sits beside it?', options = '["485.922 tCO2e", "2457.133 tCO2e", "8.153 tCO2e", "242.961 tCO2e"]'::jsonb, explanation = 'The lab prints the 0.99 row: ch4Tonnes 8.153, methane line 242.961 tCO2e on IPCC AR6 GWP100, fossil methane (CH4 29.8), and flare tCO2e 2457.133. 485.922 is the methane line at 0.98. 8.153 is tonnes of methane, a different quantity from tCO2e.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-the-flare-as-an-inventory-line' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m03-the-flare-as-an-inventory-line ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m03-the-flare-as-an-inventory-line ord 12
  select case
           when prompt = 'At 0.98 the flare''s inventory line "Flaring (unburned CH4)" shows 16.306 and 485.922. What are they?' and options = '["16.306 tCO2e, and 485.922 t of methane on the course''s set", "16.306 t of methane, and 485.922 tCO2e on the course''s set", "16.306 t of CO2 burned, and 485.922 tCO2e for the whole flare", "16.306 t of methane, and 485.922 t of CO2 from the flare"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 7 prints the line with activity 16.306 t CH4, GWP 29.8, tonnes of gas 16.306 and tCO2e 485.922, on IPCC AR6 GWP100, fossil methane. The whole flare at 0.98 is 2677.729 tCO2e and its CO2 is 2191.807 t.' then 'old'
           when prompt = 'At 0.98 the flare''s inventory line "Flaring (unburned CH4)" shows 16.306 and 485.922. What are they?' and options = '["16.306 tCO2e, and 485.922 t of methane on the course''s set", "16.306 t of methane, and 485.922 tCO2e on the course''s set", "16.306 t of CO2 burned, and 485.922 tCO2e for the whole flare", "16.306 t of methane, and 485.922 t of CO2 from the flare"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The lab prints the line with activity 16.306 t CH4, GWP 29.8, tonnes of gas 16.306 and tCO2e 485.922, on IPCC AR6 GWP100, fossil methane. The whole flare at 0.98 is 2677.729 tCO2e and its CO2 is 2191.807 t.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-the-flare-as-an-inventory-line' and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m03-the-flare-as-an-inventory-line ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m03-the-flare-as-an-inventory-line ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'At 0.98 the flare''s inventory line "Flaring (unburned CH4)" shows 16.306 and 485.922. What are they?', options = '["16.306 tCO2e, and 485.922 t of methane on the course''s set", "16.306 t of methane, and 485.922 tCO2e on the course''s set", "16.306 t of CO2 burned, and 485.922 tCO2e for the whole flare", "16.306 t of methane, and 485.922 t of CO2 from the flare"]'::jsonb, explanation = 'The lab prints the line with activity 16.306 t CH4, GWP 29.8, tonnes of gas 16.306 and tCO2e 485.922, on IPCC AR6 GWP100, fossil methane. The whole flare at 0.98 is 2677.729 tCO2e and its CO2 is 2191.807 t.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-the-flare-as-an-inventory-line' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m03-the-flare-as-an-inventory-line ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m03-the-flare-as-an-inventory-line ord 13
  select case
           when prompt = 'Which destruction efficiency returns 81.531 t of methane from the Igbogene flare?' and options = '["0.95, where the methane line is 1214.805 tCO2e", "0.9, where the methane line is 2429.610 tCO2e", "0.98, where the methane line is 485.922 tCO2e", "0.99, where the methane line is 242.961 tCO2e"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 5 prints ch4Tonnes 81.531 and a methane line of 2429.610 tCO2e on the 0.9 row. The 0.95, 0.98 and 0.99 rows return 40.765, 16.306 and 8.153 t of methane.' then 'old'
           when prompt = 'Which destruction efficiency returns 81.531 t of methane from the Igbogene flare?' and options = '["0.95, where the methane line is 1214.805 tCO2e", "0.9, where the methane line is 2429.610 tCO2e", "0.98, where the methane line is 485.922 tCO2e", "0.99, where the methane line is 242.961 tCO2e"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The lab prints ch4Tonnes 81.531 and a methane line of 2429.610 tCO2e on the 0.9 row. The 0.95, 0.98 and 0.99 rows return 40.765, 16.306 and 8.153 t of methane.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-the-flare-as-an-inventory-line' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m03-the-flare-as-an-inventory-line ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m03-the-flare-as-an-inventory-line ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which destruction efficiency returns 81.531 t of methane from the Igbogene flare?', options = '["0.95, where the methane line is 1214.805 tCO2e", "0.9, where the methane line is 2429.610 tCO2e", "0.98, where the methane line is 485.922 tCO2e", "0.99, where the methane line is 242.961 tCO2e"]'::jsonb, explanation = 'The lab prints ch4Tonnes 81.531 and a methane line of 2429.610 tCO2e on the 0.9 row. The 0.95, 0.98 and 0.99 rows return 40.765, 16.306 and 8.153 t of methane.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-the-flare-as-an-inventory-line' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m03-the-flare-as-an-inventory-line ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m03-the-flare-as-an-inventory-line ord 14
  select case
           when prompt = 'Besides its destruction efficiency, which two inputs does the Igbogene flare call carry?' and options = '["38500 kmol of gas a year, at 1.32 kmol of carbon per kmol", "482000 kmol of fuel a year, at 1.09 kmol of carbon per kmol", "38500 kmol of gas a year, at 1.09 kmol of carbon per kmol", "50820.000 kmol of gas a year, at 1.32 kmol of carbon per kmol"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 5 prints the flare''s inputs (invented): gas to the flare 38500 kmol a year, 1.32 kmol of carbon per kmol. 482000 kmol at 1.09 are the heaters'' inputs in SECTION 4, and 50820.000 is the flare''s carbonKmolPerYear.' then 'old'
           when prompt = 'Besides its destruction efficiency, which two inputs does the Igbogene flare call carry?' and options = '["38500 kmol of gas a year, at 1.32 kmol of carbon per kmol", "482000 kmol of fuel a year, at 1.09 kmol of carbon per kmol", "38500 kmol of gas a year, at 1.09 kmol of carbon per kmol", "50820.000 kmol of gas a year, at 1.32 kmol of carbon per kmol"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course gives the flare''s inputs (invented): gas to the flare 38500 kmol a year, 1.32 kmol of carbon per kmol. 482000 kmol at 1.09 are the heaters'' inputs in the lab, and 50820.000 is the flare''s carbonKmolPerYear.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-the-flare-as-an-inventory-line' and ord = 14;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m03-the-flare-as-an-inventory-line ord 14'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m03-the-flare-as-an-inventory-line ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Besides its destruction efficiency, which two inputs does the Igbogene flare call carry?', options = '["38500 kmol of gas a year, at 1.32 kmol of carbon per kmol", "482000 kmol of fuel a year, at 1.09 kmol of carbon per kmol", "38500 kmol of gas a year, at 1.09 kmol of carbon per kmol", "50820.000 kmol of gas a year, at 1.32 kmol of carbon per kmol"]'::jsonb, explanation = 'The course gives the flare''s inputs (invented): gas to the flare 38500 kmol a year, 1.32 kmol of carbon per kmol. 482000 kmol at 1.09 are the heaters'' inputs in the lab, and 50820.000 is the flare''s carbonKmolPerYear.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-the-flare-as-an-inventory-line' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m03-the-flare-as-an-inventory-line ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m03-the-flare-as-an-inventory-line ord 15
  select case
           when prompt = 'At the stated 0.98, how many tonnes of CO2 does the flare''s CO2 line carry?' and options = '["2236.537", "2677.729", "2191.807", "2214.172"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 5 prints co2Tonnes 2191.807 at 0.98, and SECTION 7 carries it as Flaring (CO2) at 2191.807 tCO2e. 2236.537 is the CO2 at 1, 2214.172 the CO2 at 0.99, and 2677.729 the flare''s CO2 plus its methane line at 0.98.' then 'old'
           when prompt = 'At the stated 0.98, how many tonnes of CO2 does the flare''s CO2 line carry?' and options = '["2236.537", "2677.729", "2191.807", "2214.172"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The lab prints co2Tonnes 2191.807 at 0.98, and the inventory carries it as Flaring (CO2) at 2191.807 tCO2e. 2236.537 is the CO2 at 1, 2214.172 the CO2 at 0.99, and 2677.729 the flare''s CO2 plus its methane line at 0.98.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-the-flare-as-an-inventory-line' and ord = 15;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m03-the-flare-as-an-inventory-line ord 15'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m03-the-flare-as-an-inventory-line ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'At the stated 0.98, how many tonnes of CO2 does the flare''s CO2 line carry?', options = '["2236.537", "2677.729", "2191.807", "2214.172"]'::jsonb, explanation = 'The lab prints co2Tonnes 2191.807 at 0.98, and the inventory carries it as Flaring (CO2) at 2191.807 tCO2e. 2236.537 is the CO2 at 1, 2214.172 the CO2 at 0.99, and 2677.729 the flare''s CO2 plus its methane line at 0.98.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm03-the-flare-as-an-inventory-line' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m03-the-flare-as-an-inventory-line ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m04-global-warming-potentials ord 1
  select case
           when prompt = 'Rebuilt on IPCC AR6 GWP100, non-fossil methane, what does the vented and fugitive methane line read?' and options = '["4231.600 tCO2e", "4260.000 tCO2e", "3976.000 tCO2e", "3834.000 tCO2e"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 8 prints the vented line at 4231.600 on IPCC AR6 GWP100, fossil methane, 3834.000 on AR6 non-fossil, 4260.000 on AR5 fossil and 3976.000 on AR5 non-fossil. Only the methane lines move from set to set.' then 'old'
           when prompt = 'Rebuilt on IPCC AR6 GWP100, non-fossil methane, what does the vented and fugitive methane line read?' and options = '["4231.600 tCO2e", "4260.000 tCO2e", "3976.000 tCO2e", "3834.000 tCO2e"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The lab prints the vented line at 4231.600 on IPCC AR6 GWP100, fossil methane, 3834.000 on AR6 non-fossil, 4260.000 on AR5 fossil and 3976.000 on AR5 non-fossil. Only the methane lines move from set to set.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-global-warming-potentials' and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m04-global-warming-potentials ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m04-global-warming-potentials ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Rebuilt on IPCC AR6 GWP100, non-fossil methane, what does the vented and fugitive methane line read?', options = '["4231.600 tCO2e", "4260.000 tCO2e", "3976.000 tCO2e", "3834.000 tCO2e"]'::jsonb, explanation = 'The lab prints the vented line at 4231.600 on IPCC AR6 GWP100, fossil methane, 3834.000 on AR6 non-fossil, 4260.000 on AR5 fossil and 3976.000 on AR5 non-fossil. Only the methane lines move from set to set.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-global-warming-potentials' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m04-global-warming-potentials ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m04-global-warming-potentials ord 2
  select case
           when prompt = 'The flare''s unburned methane line reads 489.183 tCO2e. On which set was it converted?' and options = '["IPCC AR6 GWP100, fossil methane", "IPCC AR5 GWP100, fossil methane", "IPCC AR6 GWP100, non-fossil methane", "IPCC AR5 GWP100, non-fossil methane"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 8 prints Flaring (unburned CH4) at 485.922 on AR6 fossil, 440.265 on AR6 non-fossil, 489.183 on AR5 fossil and 456.571 on AR5 non-fossil.' then 'old'
           when prompt = 'The flare''s unburned methane line reads 489.183 tCO2e. On which set was it converted?' and options = '["IPCC AR6 GWP100, fossil methane", "IPCC AR5 GWP100, fossil methane", "IPCC AR6 GWP100, non-fossil methane", "IPCC AR5 GWP100, non-fossil methane"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The lab prints Flaring (unburned CH4) at 485.922 on AR6 fossil, 440.265 on AR6 non-fossil, 489.183 on AR5 fossil and 456.571 on AR5 non-fossil.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-global-warming-potentials' and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m04-global-warming-potentials ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m04-global-warming-potentials ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The flare''s unburned methane line reads 489.183 tCO2e. On which set was it converted?', options = '["IPCC AR6 GWP100, fossil methane", "IPCC AR5 GWP100, fossil methane", "IPCC AR6 GWP100, non-fossil methane", "IPCC AR5 GWP100, non-fossil methane"]'::jsonb, explanation = 'The lab prints Flaring (unburned CH4) at 485.922 on AR6 fossil, 440.265 on AR6 non-fossil, 489.183 on AR5 fossil and 456.571 on AR5 non-fossil.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-global-warming-potentials' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m04-global-warming-potentials ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m04-global-warming-potentials ord 3
  select case
           when prompt = 'Which total does SECTION 8 print for the inventory on IPCC AR5 GWP100, non-fossil methane?' and options = '["42660.826 tCO2e", "42945.777 tCO2e", "42502.520 tCO2e", "42977.438 tCO2e"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 8 prints the totals: 42945.777 on AR6 fossil, 42502.520 on AR6 non-fossil, 42977.438 on AR5 fossil and 42660.826 on AR5 non-fossil. Scope 2 is 12915.000 under all four.' then 'old'
           when prompt = 'Which total does the lab print for the inventory on IPCC AR5 GWP100, non-fossil methane?' and options = '["42660.826 tCO2e", "42945.777 tCO2e", "42502.520 tCO2e", "42977.438 tCO2e"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The lab prints the totals: 42945.777 on AR6 fossil, 42502.520 on AR6 non-fossil, 42977.438 on AR5 fossil and 42660.826 on AR5 non-fossil. Scope 2 is 12915.000 under all four.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-global-warming-potentials' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m04-global-warming-potentials ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m04-global-warming-potentials ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which total does the lab print for the inventory on IPCC AR5 GWP100, non-fossil methane?', options = '["42660.826 tCO2e", "42945.777 tCO2e", "42502.520 tCO2e", "42977.438 tCO2e"]'::jsonb, explanation = 'The lab prints the totals: 42945.777 on AR6 fossil, 42502.520 on AR6 non-fossil, 42977.438 on AR5 fossil and 42660.826 on AR5 non-fossil. Scope 2 is 12915.000 under all four.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-global-warming-potentials' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m04-global-warming-potentials ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m04-global-warming-potentials ord 4
  select case
           when prompt = 'When the Igbogene inventory is rebuilt on another GWP set, which lines move?' and options = '["Every line, since each set also rescales the CO2 lines it is given as well", "Only Scope 2, the purchased electricity line, on each of the sets", "Only the methane lines, since every CO2 line has a GWP of 1 on every set", "Only the flare''s two lines, since vented methane carries a factor of 1 in its line"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 8: "Only the methane lines move; every CO2 line has a GWP of 1 on every set." Scope 2 reads 12915.000 on all four sets, and the vented line moves with the set as the flare''s methane line does.' then 'old'
           when prompt = 'When the Igbogene inventory is rebuilt on another GWP set, which lines move?' and options = '["Every line, since each set also rescales the CO2 lines it is given as well", "Only Scope 2, the purchased electricity line, on each of the sets", "Only the methane lines, since every CO2 line has a GWP of 1 on every set", "Only the flare''s two lines, since vented methane carries a factor of 1 in its line"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The lab: "Only the methane lines move; every CO2 line has a GWP of 1 on every set." Scope 2 reads 12915.000 on all four sets, and the vented line moves with the set as the flare''s methane line does.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-global-warming-potentials' and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m04-global-warming-potentials ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m04-global-warming-potentials ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'When the Igbogene inventory is rebuilt on another GWP set, which lines move?', options = '["Every line, since each set also rescales the CO2 lines it is given as well", "Only Scope 2, the purchased electricity line, on each of the sets", "Only the methane lines, since every CO2 line has a GWP of 1 on every set", "Only the flare''s two lines, since vented methane carries a factor of 1 in its line"]'::jsonb, explanation = 'The lab: "Only the methane lines move; every CO2 line has a GWP of 1 on every set." Scope 2 reads 12915.000 on all four sets, and the vented line moves with the set as the flare''s methane line does.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-global-warming-potentials' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m04-global-warming-potentials ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m04-global-warming-potentials ord 5
  select case
           when prompt = 'Which two methane values does AR6 give in the sets the course prints?' and options = '["30 for fossil methane and 28 for non-fossil", "29.8 for fossil methane and 27 for non-fossil", "27 for fossil methane and 29.8 for non-fossil", "29.8 for fossil methane and 273 for non-fossil"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 6 prints AR6 fossil CH4 29.8 and AR6 non-fossil CH4 27; AR5 gives 30 and 28. 273 is the AR6 value for N2O.' then 'old'
           when prompt = 'Which two methane values does AR6 give in the sets the course prints?' and options = '["30 for fossil methane and 28 for non-fossil", "29.8 for fossil methane and 27 for non-fossil", "27 for fossil methane and 29.8 for non-fossil", "29.8 for fossil methane and 273 for non-fossil"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course prints AR6 fossil CH4 29.8 and AR6 non-fossil CH4 27; AR5 gives 30 and 28. 273 is the AR6 value for N2O.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-global-warming-potentials' and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m04-global-warming-potentials ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m04-global-warming-potentials ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which two methane values does AR6 give in the sets the course prints?', options = '["30 for fossil methane and 28 for non-fossil", "29.8 for fossil methane and 27 for non-fossil", "27 for fossil methane and 29.8 for non-fossil", "29.8 for fossil methane and 273 for non-fossil"]'::jsonb, explanation = 'The course prints AR6 fossil CH4 29.8 and AR6 non-fossil CH4 27; AR5 gives 30 and 28. 273 is the AR6 value for N2O.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-global-warming-potentials' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m04-global-warming-potentials ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m04-global-warming-potentials ord 6
  select case
           when prompt = 'What N2O value do both AR5 sets carry?' and options = '["273", "28", "30", "265"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 6 prints N2O 265 on both AR5 sets and 273 on both AR6 sets. 28 and 30 are the AR5 methane values, non-fossil and fossil.' then 'old'
           when prompt = 'What N2O value do both AR5 sets carry?' and options = '["273", "28", "30", "265"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course prints N2O 265 on both AR5 sets and 273 on both AR6 sets. 28 and 30 are the AR5 methane values, non-fossil and fossil.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-global-warming-potentials' and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m04-global-warming-potentials ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m04-global-warming-potentials ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What N2O value do both AR5 sets carry?', options = '["273", "28", "30", "265"]'::jsonb, explanation = 'The course prints N2O 265 on both AR5 sets and 273 on both AR6 sets. 28 and 30 are the AR5 methane values, non-fossil and fossil.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-global-warming-potentials' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m04-global-warming-potentials ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m04-global-warming-potentials ord 7
  select case
           when prompt = 'Which makeGwpSet call returns a set the engine reads as declared?' and options = '["A label with values, such as IPCC AR6 GWP100, fossil methane", "Values given with no label, however complete the values given are", "A label given with no values, such as a set name typed on its own", "A label with values that give methane a GWP of 0"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 6: a set is declared only with a label and at least one value. Values with no label, and a label with no values, both read declared false. SECTION 2 refuses a methane GWP of 0, and the set then reads declared false.' then 'old'
           when prompt = 'Which makeGwpSet call returns a set the engine reads as declared?' and options = '["A label with values, such as IPCC AR6 GWP100, fossil methane", "Values given with no label, however complete the values given are", "A label given with no values, such as a set name typed on its own", "A label with values that give methane a GWP of 0"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The engine: a set is declared only with a label and at least one value. Values with no label, and a label with no values, both read declared false. The engine refuses a methane GWP of 0, and the set then reads declared false.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-global-warming-potentials' and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m04-global-warming-potentials ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m04-global-warming-potentials ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which makeGwpSet call returns a set the engine reads as declared?', options = '["A label with values, such as IPCC AR6 GWP100, fossil methane", "Values given with no label, however complete the values given are", "A label given with no values, such as a set name typed on its own", "A label with values that give methane a GWP of 0"]'::jsonb, explanation = 'The engine: a set is declared only with a label and at least one value. Values with no label, and a label with no values, both read declared false. The engine refuses a methane GWP of 0, and the set then reads declared false.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-global-warming-potentials' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m04-global-warming-potentials ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m04-global-warming-potentials ord 8
  select case
           when prompt = 'The engine''s note on every GWP set says the set is stated on every result. What reason does the note give?' and options = '["The operator must file on the report that the set names, in each year.", "The set also changes the CO2 lines, which then need a label.", "An inventory on one report is not comparable with one on another.", "The difference from the course set is computed on each result."]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 6 quotes the note: "Global warming potentials differ between IPCC assessment reports. An inventory on one report is not comparable with one on another, so the set is stated on every result." Every CO2 line has a GWP of 1 on every set, and which report to file on is held (H1).' then 'old'
           when prompt = 'The engine''s note on every GWP set says the set is stated on every result. What reason does the note give?' and options = '["The operator must file on the report that the set names, in each year.", "The set also changes the CO2 lines, which then need a label.", "An inventory on one report is not comparable with one on another.", "The difference from the course set is computed on each result."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course quotes the note: "Global warming potentials differ between IPCC assessment reports. An inventory on one report is not comparable with one on another, so the set is stated on every result." Every CO2 line has a GWP of 1 on every set, and which report to file on is held (H1).' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-global-warming-potentials' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m04-global-warming-potentials ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m04-global-warming-potentials ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The engine''s note on every GWP set says the set is stated on every result. What reason does the note give?', options = '["The operator must file on the report that the set names, in each year.", "The set also changes the CO2 lines, which then need a label.", "An inventory on one report is not comparable with one on another.", "The difference from the course set is computed on each result."]'::jsonb, explanation = 'The course quotes the note: "Global warming potentials differ between IPCC assessment reports. An inventory on one report is not comparable with one on another, so the set is stated on every result." Every CO2 line has a GWP of 1 on every set, and which report to file on is held (H1).'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-global-warming-potentials' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m04-global-warming-potentials ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m04-global-warming-potentials ord 9
  select case
           when prompt = 'For which methane does the engine''s methane note call the fossil value the consistent one?' and options = '["Unburned methane only; vented methane takes non-fossil", "Vented, fugitive and unburned fossil methane alike", "None: the note leaves either value open for every line", "Vented methane only; flare methane is counted as CO2"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 6 quotes the methane note on every set. It closes: "the fossil value is the consistent one for vented, fugitive and unburned fossil methane alike."' then 'old'
           when prompt = 'For which methane does the engine''s methane note call the fossil value the consistent one?' and options = '["Unburned methane only; vented methane takes non-fossil", "Vented, fugitive and unburned fossil methane alike", "None: the note leaves either value open for every line", "Vented methane only; flare methane is counted as CO2"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course quotes the methane note on every set. It closes: "the fossil value is the consistent one for vented, fugitive and unburned fossil methane alike."' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-global-warming-potentials' and ord = 9;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m04-global-warming-potentials ord 9'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m04-global-warming-potentials ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'For which methane does the engine''s methane note call the fossil value the consistent one?', options = '["Unburned methane only; vented methane takes non-fossil", "Vented, fugitive and unburned fossil methane alike", "None: the note leaves either value open for every line", "Vented methane only; flare methane is counted as CO2"]'::jsonb, explanation = 'The course quotes the methane note on every set. It closes: "the fossil value is the consistent one for vented, fugitive and unburned fossil methane alike."'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-global-warming-potentials' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m04-global-warming-potentials ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m04-global-warming-potentials ord 10
  select case
           when prompt = 'Measured from the course set, what does SECTION 8 print for the AR6 non-fossil total?' and options = '["-284.951 tCO2e", "31.661 tCO2e", "0.000 tCO2e", "-443.257 tCO2e"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 8 prints the total less the course set as 0.000 on AR6 fossil, -443.257 on AR6 non-fossil, 31.661 on AR5 fossil and -284.951 on AR5 non-fossil (computed here).' then 'old'
           when prompt = 'Measured from the course set, what does the lab print for the AR6 non-fossil total?' and options = '["-284.951 tCO2e", "31.661 tCO2e", "0.000 tCO2e", "-443.257 tCO2e"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The lab prints the total less the course set as 0.000 on AR6 fossil, -443.257 on AR6 non-fossil, 31.661 on AR5 fossil and -284.951 on AR5 non-fossil (computed here).' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-global-warming-potentials' and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m04-global-warming-potentials ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m04-global-warming-potentials ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Measured from the course set, what does the lab print for the AR6 non-fossil total?', options = '["-284.951 tCO2e", "31.661 tCO2e", "0.000 tCO2e", "-443.257 tCO2e"]'::jsonb, explanation = 'The lab prints the total less the course set as 0.000 on AR6 fossil, -443.257 on AR6 non-fossil, 31.661 on AR5 fossil and -284.951 on AR5 non-fossil (computed here).'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-global-warming-potentials' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m04-global-warming-potentials ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m04-global-warming-potentials ord 11
  select case
           when prompt = 'What does the course state about which IPCC report a Nigerian operator should file on?' and options = '["It is a regulatory reading and the owner''s decision; the course grades no choice between them.", "AR6, since every inventory in the course is computed on IPCC AR6 GWP100, fossil methane, as a rule.", "AR5, since the digest states that UNFCCC reporting has required it of operators until now.", "Whichever report gives the lower Igbogene total, which the digest prints for all four of the sets."]'::jsonb and answer_index = 0 and explanation is not distinct from 'H1 holds the filing choice as a regulatory reading, with any recommended default left to the owner. Both reports are taught, and neither is graded as the answer.' then 'old'
           when prompt = 'What does the course state about which IPCC report a Nigerian operator should file on?' and options = '["It is a regulatory reading and the owner''s decision; the course grades no choice between them.", "AR6, since every inventory in the course is computed on IPCC AR6 GWP100, fossil methane, as a rule.", "AR5, since the course states that UNFCCC reporting has required it of operators until now.", "Whichever report gives the lower Igbogene total, which the course prints for all four of the sets."]'::jsonb and answer_index = 0 and explanation is not distinct from 'H1 holds the filing choice as a regulatory reading, with any recommended default left to the owner. Both reports are taught, and neither is graded as the answer.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-global-warming-potentials' and ord = 11;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m04-global-warming-potentials ord 11'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m04-global-warming-potentials ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does the course state about which IPCC report a Nigerian operator should file on?', options = '["It is a regulatory reading and the owner''s decision; the course grades no choice between them.", "AR6, since every inventory in the course is computed on IPCC AR6 GWP100, fossil methane, as a rule.", "AR5, since the course states that UNFCCC reporting has required it of operators until now.", "Whichever report gives the lower Igbogene total, which the course prints for all four of the sets."]'::jsonb, explanation = 'H1 holds the filing choice as a regulatory reading, with any recommended default left to the owner. Both reports are taught, and neither is graded as the answer.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-global-warming-potentials' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m04-global-warming-potentials ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m04-global-warming-potentials ord 12
  select case
           when prompt = 'The four sets the course types in are tabulated in which document?' and options = '["carbonAbatement''s own GWP table, shipped with the engine", "IPCC AR6 WG1 chapter 7 alone, for all four of the sets", "GHG Protocol, IPCC Global Warming Potential Values, version 2.0", "The supplier statement (invented), 2025, as for the factors"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 6: the four sets are IPCC 100-year values as tabulated in GHG Protocol, "IPCC Global Warming Potential Values", version 2.0, 7 August 2024, adapted from IPCC AR6 WG1 chapter 7 and IPCC AR5 WG1 chapter 8. The engine ships no GWP.' then 'old'
           when prompt = 'The four sets the course types in are tabulated in which document?' and options = '["carbonAbatement''s own GWP table, shipped with the engine", "IPCC AR6 WG1 chapter 7 alone, for all four of the sets", "GHG Protocol, IPCC Global Warming Potential Values, version 2.0", "The supplier statement (invented), 2025, as for the factors"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course: the four sets are IPCC 100-year values as tabulated in GHG Protocol, "IPCC Global Warming Potential Values", version 2.0, 7 August 2024, adapted from IPCC AR6 WG1 chapter 7 and IPCC AR5 WG1 chapter 8. The engine ships no GWP.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-global-warming-potentials' and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m04-global-warming-potentials ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m04-global-warming-potentials ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The four sets the course types in are tabulated in which document?', options = '["carbonAbatement''s own GWP table, shipped with the engine", "IPCC AR6 WG1 chapter 7 alone, for all four of the sets", "GHG Protocol, IPCC Global Warming Potential Values, version 2.0", "The supplier statement (invented), 2025, as for the factors"]'::jsonb, explanation = 'The course: the four sets are IPCC 100-year values as tabulated in GHG Protocol, "IPCC Global Warming Potential Values", version 2.0, 7 August 2024, adapted from IPCC AR6 WG1 chapter 7 and IPCC AR5 WG1 chapter 8. The engine ships no GWP.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-global-warming-potentials' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m04-global-warming-potentials ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m04-global-warming-potentials ord 13
  select case
           when prompt = 'Why does the course compute every inventory on IPCC AR6 GWP100, fossil methane?' and options = '["AR6 is the report an operator must file on, as the course recommends.", "The engine counts escaped carbon as methane, as its methane note states.", "It is the set the engine applies when no set has been declared at all.", "It gives the lowest Igbogene total of the four sets the digest prints."]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 6: "Every inventory in this course is computed on ''IPCC AR6 GWP100, fossil methane'', because the engine counts escaped carbon as methane" (the methane note). With no set declared, SECTION 9 blocks the vented line, and SECTION 8 prints a lower total, 42502.520, on AR6 non-fossil.' then 'old'
           when prompt = 'Why does the course compute every inventory on IPCC AR6 GWP100, fossil methane?' and options = '["AR6 is the report an operator must file on, as the course recommends.", "The engine counts escaped carbon as methane, as its methane note states.", "It is the set the engine applies when no set has been declared at all.", "It gives the lowest Igbogene total of the four sets the course prints."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course: "Every inventory in this course is computed on ''IPCC AR6 GWP100, fossil methane'', because the engine counts escaped carbon as methane" (the methane note). With no set declared, the engine blocks the vented line, and the lab prints a lower total, 42502.520, on AR6 non-fossil.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-global-warming-potentials' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m04-global-warming-potentials ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m04-global-warming-potentials ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Why does the course compute every inventory on IPCC AR6 GWP100, fossil methane?', options = '["AR6 is the report an operator must file on, as the course recommends.", "The engine counts escaped carbon as methane, as its methane note states.", "It is the set the engine applies when no set has been declared at all.", "It gives the lowest Igbogene total of the four sets the course prints."]'::jsonb, explanation = 'The course: "Every inventory in this course is computed on ''IPCC AR6 GWP100, fossil methane'', because the engine counts escaped carbon as methane" (the methane note). With no set declared, the engine blocks the vented line, and the lab prints a lower total, 42502.520, on AR6 non-fossil.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-global-warming-potentials' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m04-global-warming-potentials ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m04-global-warming-potentials ord 14
  select case
           when prompt = 'Where does the engine record which GWP set an inventory was converted on?' and options = '["In each line''s factor record, as the source of that factor", "In the atom balance method sentence, beside conservation of mass", "In the comparability note alone, and nowhere on the inventory", "In gwpSetLabel on every result, and an intensity carries it too"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 8: "The engine states its set on every result (gwpSetLabel), and an intensity carries it too (SECTION 10)." SECTION 7 prints gwpSetLabel: IPCC AR6 GWP100, fossil methane on the complete inventory, and the factor records name sources such as the supplier statement (invented).' then 'old'
           when prompt = 'Where does the engine record which GWP set an inventory was converted on?' and options = '["In each line''s factor record, as the source of that factor", "In the atom balance method sentence, beside conservation of mass", "In the comparability note alone, and nowhere on the inventory", "In gwpSetLabel on every result, and an intensity carries it too"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course: "The engine states its set on every result (gwpSetLabel), and an intensity carries it too." The lab prints gwpSetLabel: IPCC AR6 GWP100, fossil methane on the complete inventory, and the factor records name sources such as the supplier statement (invented).' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-global-warming-potentials' and ord = 14;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m04-global-warming-potentials ord 14'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m04-global-warming-potentials ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Where does the engine record which GWP set an inventory was converted on?', options = '["In each line''s factor record, as the source of that factor", "In the atom balance method sentence, beside conservation of mass", "In the comparability note alone, and nowhere on the inventory", "In gwpSetLabel on every result, and an intensity carries it too"]'::jsonb, explanation = 'The course: "The engine states its set on every result (gwpSetLabel), and an intensity carries it too." The lab prints gwpSetLabel: IPCC AR6 GWP100, fossil methane on the complete inventory, and the factor records name sources such as the supplier statement (invented).'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-global-warming-potentials' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m04-global-warming-potentials ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m04-global-warming-potentials ord 15
  select case
           when prompt = 'What horizon do all four of the course''s GWP sets share?' and options = '["The horizon differs by report", "It differs between fossil and non-fossil", "100-year (GWP100)", "None is stated beside the values"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 6 prints the horizon column as 100-year (GWP100) on all four sets, AR6 and AR5, fossil and non-fossil.' then 'old'
           when prompt = 'What horizon do all four of the course''s GWP sets share?' and options = '["The horizon differs by report", "It differs between fossil and non-fossil", "100-year (GWP100)", "None is stated beside the values"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The lab prints the horizon column as 100-year (GWP100) on all four sets, AR6 and AR5, fossil and non-fossil.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-global-warming-potentials' and ord = 15;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m04-global-warming-potentials ord 15'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m04-global-warming-potentials ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What horizon do all four of the course''s GWP sets share?', options = '["The horizon differs by report", "It differs between fossil and non-fossil", "100-year (GWP100)", "None is stated beside the values"]'::jsonb, explanation = 'The lab prints the horizon column as 100-year (GWP100) on all four sets, AR6 and AR5, fossil and non-fossil.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm04-global-warming-potentials' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m04-global-warming-potentials ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m05-lines-factors-and-provenance ord 1
  select case
           when prompt = 'What source and version does the Igbogene purchased electricity factor carry in the complete inventory?' and options = '["Supplier statement (invented), version 2025", "Epie Creek leak detection survey (invented), 2026 Q2", "Atom balance (conservation of mass), not applicable", "None, so the line is counted as unsourced"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 7 prints the Purchased electricity line with factor 0.41 tCO2/MWh (invented and SYNTHETIC), source "Supplier statement (invented)", version 2025 and provenance complete true. The survey is the vented methane''s source, the atom balance the combustion lines'', and the complete inventory has 0 unsourced lines.' then 'old'
           when prompt = 'What source and version does the Igbogene purchased electricity factor carry in the complete inventory?' and options = '["Supplier statement (invented), version 2025", "Epie Creek leak detection survey (invented), 2026 Q2", "Atom balance (conservation of mass), not applicable", "None, so the line is counted as unsourced"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The lab prints the Purchased electricity line with factor 0.41 tCO2/MWh (invented and SYNTHETIC), source "Supplier statement (invented)", version 2025 and provenance complete true. The survey is the vented methane''s source, the atom balance the combustion lines'', and the complete inventory has 0 unsourced lines.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-lines-factors-and-provenance' and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m05-lines-factors-and-provenance ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m05-lines-factors-and-provenance ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What source and version does the Igbogene purchased electricity factor carry in the complete inventory?', options = '["Supplier statement (invented), version 2025", "Epie Creek leak detection survey (invented), 2026 Q2", "Atom balance (conservation of mass), not applicable", "None, so the line is counted as unsourced"]'::jsonb, explanation = 'The lab prints the Purchased electricity line with factor 0.41 tCO2/MWh (invented and SYNTHETIC), source "Supplier statement (invented)", version 2025 and provenance complete true. The survey is the vented methane''s source, the atom balance the combustion lines'', and the complete inventory has 0 unsourced lines.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-lines-factors-and-provenance' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m05-lines-factors-and-provenance ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m05-lines-factors-and-provenance ord 2
  select case
           when prompt = 'Why is the Igbogene first pass not reportable, as buildInventory states it?' and options = '["1 factor(s) have no source or version; 2 line(s) could not be computed", "1 factor(s) have no source or version; 1 line(s) could not be computed", "the global warming potential set is not declared; 3 line(s) could not be computed", "1 factor(s) have no source or version"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 9 prints the first pass reason as "the global warming potential set is not declared; 3 line(s) could not be computed". The other three are the reasons at the next three steps: the GWP set declared, the flare efficiency entered, and the electricity factor entered with its source.' then 'old'
           when prompt = 'Why is the Igbogene first pass not reportable, as buildInventory states it?' and options = '["1 factor(s) have no source or version; 2 line(s) could not be computed", "1 factor(s) have no source or version; 1 line(s) could not be computed", "the global warming potential set is not declared; 3 line(s) could not be computed", "1 factor(s) have no source or version"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The lab prints the first pass reason as "the global warming potential set is not declared; 3 line(s) could not be computed". The other three are the reasons at the next three steps: the GWP set declared, the flare efficiency entered, and the electricity factor entered with its source.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-lines-factors-and-provenance' and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m05-lines-factors-and-provenance ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m05-lines-factors-and-provenance ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Why is the Igbogene first pass not reportable, as buildInventory states it?', options = '["1 factor(s) have no source or version; 2 line(s) could not be computed", "1 factor(s) have no source or version; 1 line(s) could not be computed", "the global warming potential set is not declared; 3 line(s) could not be computed", "1 factor(s) have no source or version"]'::jsonb, explanation = 'The lab prints the first pass reason as "the global warming potential set is not declared; 3 line(s) could not be computed". The other three are the reasons at the next three steps: the GWP set declared, the flare efficiency entered, and the electricity factor entered with its source.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-lines-factors-and-provenance' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m05-lines-factors-and-provenance ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m05-lines-factors-and-provenance ord 3
  select case
           when prompt = 'Which step of the Igbogene inventory is the first that buildInventory reads as reportable?' and options = '["The electricity factor entered with its source", "The flare efficiency entered", "The GWP set declared", "The survey referenced"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 9 prints reportable false on the first four steps and true only on "the survey referenced", whose reason reads none. The step before it totals the same 42945.777 tCO2e and is not reportable because 1 factor(s) have no source or version.' then 'old'
           when prompt = 'Which step of the Igbogene inventory is the first that buildInventory reads as reportable?' and options = '["The electricity factor entered with its source", "The flare efficiency entered", "The GWP set declared", "The survey referenced"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The lab prints reportable false on the first four steps and true only on "the survey referenced", whose reason reads none. The step before it totals the same 42945.777 tCO2e and is not reportable because 1 factor(s) have no source or version.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-lines-factors-and-provenance' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m05-lines-factors-and-provenance ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m05-lines-factors-and-provenance ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which step of the Igbogene inventory is the first that buildInventory reads as reportable?', options = '["The electricity factor entered with its source", "The flare efficiency entered", "The GWP set declared", "The survey referenced"]'::jsonb, explanation = 'The lab prints reportable false on the first four steps and true only on "the survey referenced", whose reason reads none. The step before it totals the same 42945.777 tCO2e and is not reportable because 1 factor(s) have no source or version.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-lines-factors-and-provenance' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m05-lines-factors-and-provenance ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m05-lines-factors-and-provenance ord 4
  select case
           when prompt = 'In the first pass the vented methane survey is not referenced, yet the unsourced line count reads 0. What does the digest say?' and options = '["An unsourced line is counted only once reportable is true.", "A blocked line is not also counted as unsourced.", "A factor of 1 needs no source, so the survey is not counted.", "The vented line was excluded on purpose, and adds no line."]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 9: "The first pass has 3 blocked line(s) and 0 unsourced line(s); a blocked line is not also counted as unsourced." The vented line is blocked there for want of a GWP for CH4. At the next step the reason "1 factor(s) have no source or version" appears while reportable is still false.' then 'old'
           when prompt = 'In the first pass the vented methane survey is not referenced, yet the unsourced line count reads 0. What does the course say?' and options = '["An unsourced line is counted only once reportable is true.", "A blocked line is not also counted as unsourced.", "A factor of 1 needs no source, so the survey is not counted.", "The vented line was excluded on purpose, and adds no line."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course: "The first pass has 3 blocked line(s) and 0 unsourced line(s); a blocked line is not also counted as unsourced." The vented line is blocked there for want of a GWP for CH4. At the next step the reason "1 factor(s) have no source or version" appears while reportable is still false.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-lines-factors-and-provenance' and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m05-lines-factors-and-provenance ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m05-lines-factors-and-provenance ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'In the first pass the vented methane survey is not referenced, yet the unsourced line count reads 0. What does the course say?', options = '["An unsourced line is counted only once reportable is true.", "A blocked line is not also counted as unsourced.", "A factor of 1 needs no source, so the survey is not counted.", "The vented line was excluded on purpose, and adds no line."]'::jsonb, explanation = 'The course: "The first pass has 3 blocked line(s) and 0 unsourced line(s); a blocked line is not also counted as unsourced." The vented line is blocked there for want of a GWP for CH4. At the next step the reason "1 factor(s) have no source or version" appears while reportable is still false.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-lines-factors-and-provenance' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m05-lines-factors-and-provenance ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m05-lines-factors-and-provenance ord 5
  select case
           when prompt = 'In the first pass, what does the engine name as blocking the Vented and fugitive methane line?' and options = '["no global warming potential for CH4 in the declared set", "no factor value", "A registered emission factor is required.", "a negative activity: an emission line cannot remove tonnes"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 9 lists the first pass blocked lines: Flaring blocked by the destruction efficiency refusal, Vented and fugitive methane by "no global warming potential for CH4 in the declared set" and Purchased electricity by "no factor value". The other two reasons belong to the Diesel generators line and to the vented activity typed as -142 t.' then 'old'
           when prompt = 'In the first pass, what does the engine name as blocking the Vented and fugitive methane line?' and options = '["no global warming potential for CH4 in the declared set", "no factor value", "A registered emission factor is required.", "a negative activity: an emission line cannot remove tonnes"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The lab lists the first pass blocked lines: Flaring blocked by the destruction efficiency refusal, Vented and fugitive methane by "no global warming potential for CH4 in the declared set" and Purchased electricity by "no factor value". The other two reasons belong to the Diesel generators line and to the vented activity typed as -142 t.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-lines-factors-and-provenance' and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m05-lines-factors-and-provenance ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m05-lines-factors-and-provenance ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'In the first pass, what does the engine name as blocking the Vented and fugitive methane line?', options = '["no global warming potential for CH4 in the declared set", "no factor value", "A registered emission factor is required.", "a negative activity: an emission line cannot remove tonnes"]'::jsonb, explanation = 'The lab lists the first pass blocked lines: Flaring blocked by the destruction efficiency refusal, Vented and fugitive methane by "no global warming potential for CH4 in the declared set" and Purchased electricity by "no factor value". The other two reasons belong to the Diesel generators line and to the vented activity typed as -142 t.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-lines-factors-and-provenance' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m05-lines-factors-and-provenance ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m05-lines-factors-and-provenance ord 6
  select case
           when prompt = 'At the step "the GWP set declared", what does the Igbogene Scope 1 total read?' and options = '["23121.448 tCO2e", "30030.777 tCO2e", "27353.048 tCO2e", "25799.177 tCO2e"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 9 prints Scope 1 at 23121.448 in the first pass, 27353.048 once the GWP set is declared and 30030.777 once the flare efficiency is entered. 25799.177 is the total of the inventory with a negative activity and a negative factor.' then 'old'
           when prompt = 'At the step "the GWP set declared", what does the Igbogene Scope 1 total read?' and options = '["23121.448 tCO2e", "30030.777 tCO2e", "27353.048 tCO2e", "25799.177 tCO2e"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The lab prints Scope 1 at 23121.448 in the first pass, 27353.048 once the GWP set is declared and 30030.777 once the flare efficiency is entered. 25799.177 is the total of the inventory with a negative activity and a negative factor.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-lines-factors-and-provenance' and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m05-lines-factors-and-provenance ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m05-lines-factors-and-provenance ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'At the step "the GWP set declared", what does the Igbogene Scope 1 total read?', options = '["23121.448 tCO2e", "30030.777 tCO2e", "27353.048 tCO2e", "25799.177 tCO2e"]'::jsonb, explanation = 'The lab prints Scope 1 at 23121.448 in the first pass, 27353.048 once the GWP set is declared and 30030.777 once the flare efficiency is entered. 25799.177 is the total of the inventory with a negative activity and a negative factor.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-lines-factors-and-provenance' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m05-lines-factors-and-provenance ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m05-lines-factors-and-provenance ord 7
  select case
           when prompt = 'The vented methane activity is typed as -142 t. What does buildInventory do with that line?' and options = '["Subtracts 4231.600 tCO2e from the Scope 1 total.", "Reads it as 142.000 t and computes it as normal.", "Refuses the GWP set, so the set is not declared.", "Blocks it: an emission line cannot remove tonnes."]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 9 prints the line "Vented methane typed as -142 t" with tCO2e none, blocked by "a negative activity: an emission line cannot remove tonnes". That inventory totals 25799.177 tCO2e and is not reportable.' then 'old'
           when prompt = 'The vented methane activity is typed as -142 t. What does buildInventory do with that line?' and options = '["Subtracts 4231.600 tCO2e from the Scope 1 total.", "Reads it as 142.000 t and computes it as normal.", "Refuses the GWP set, so the set is not declared.", "Blocks it: an emission line cannot remove tonnes."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course prints the line "Vented methane typed as -142 t" with tCO2e none, blocked by "a negative activity: an emission line cannot remove tonnes". That inventory totals 25799.177 tCO2e and is not reportable.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-lines-factors-and-provenance' and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m05-lines-factors-and-provenance ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m05-lines-factors-and-provenance ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The vented methane activity is typed as -142 t. What does buildInventory do with that line?', options = '["Subtracts 4231.600 tCO2e from the Scope 1 total.", "Reads it as 142.000 t and computes it as normal.", "Refuses the GWP set, so the set is not declared.", "Blocks it: an emission line cannot remove tonnes."]'::jsonb, explanation = 'The course prints the line "Vented methane typed as -142 t" with tCO2e none, blocked by "a negative activity: an emission line cannot remove tonnes". That inventory totals 25799.177 tCO2e and is not reportable.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-lines-factors-and-provenance' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m05-lines-factors-and-provenance ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m05-lines-factors-and-provenance ord 8
  select case
           when prompt = 'A Diesel generators line with no registered factor is added to the complete inventory. What reason does its blocked line carry?' and options = '["no factor value, so it is read as zero", "A registered emission factor is required.", "scope 3 is not Scope 1 or Scope 2", "1 factor(s) have no source or version"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 9 prints the Diesel generators line with the reason "A registered emission factor is required." The scope 3 reason belongs to Business travel. With both lines added the total stays 42945.777 tCO2e and the inventory is not reportable because 2 line(s) could not be computed.' then 'old'
           when prompt = 'A Diesel generators line with no registered factor is added to the complete inventory. What reason does its blocked line carry?' and options = '["no factor value, so it is read as zero", "A registered emission factor is required.", "scope 3 is not Scope 1 or Scope 2", "1 factor(s) have no source or version"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The lab prints the Diesel generators line with the reason "A registered emission factor is required." The scope 3 reason belongs to Business travel. With both lines added the total stays 42945.777 tCO2e and the inventory is not reportable because 2 line(s) could not be computed.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-lines-factors-and-provenance' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m05-lines-factors-and-provenance ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m05-lines-factors-and-provenance ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A Diesel generators line with no registered factor is added to the complete inventory. What reason does its blocked line carry?', options = '["no factor value, so it is read as zero", "A registered emission factor is required.", "scope 3 is not Scope 1 or Scope 2", "1 factor(s) have no source or version"]'::jsonb, explanation = 'The lab prints the Diesel generators line with the reason "A registered emission factor is required." The scope 3 reason belongs to Business travel. With both lines added the total stays 42945.777 tCO2e and the inventory is not reportable because 2 line(s) could not be computed.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-lines-factors-and-provenance' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m05-lines-factors-and-provenance ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m05-lines-factors-and-provenance ord 9
  select case
           when prompt = 'The digest''s line shares of the Igbogene total, as printed, sum to 1.000001. What does its rounding note say?' and options = '["Each share is rounded to six decimals; the unrounded shares sum to 1.", "A line is counted twice, once as CO2 and once as methane, in the total.", "The flare''s methane share is added to the flare''s CO2 share a second time.", "The total includes a blocked line that the shares leave out of the sum."]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 7: "ROUNDING NOTE: the shares as printed sum to 1.000001; each is rounded to six decimals from the unrounded quotient, and the unrounded shares sum to 1." The complete inventory has 0 blocked lines.' then 'old'
           when prompt = 'The course''s line shares of the Igbogene total, as printed, sum to 1.000001. What does its rounding note say?' and options = '["Each share is rounded to six decimals; the unrounded shares sum to 1.", "A line is counted twice, once as CO2 and once as methane, in the total.", "The flare''s methane share is added to the flare''s CO2 share a second time.", "The total includes a blocked line that the shares leave out of the sum."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course: "ROUNDING NOTE: the shares as printed sum to 1.000001; each is rounded to six decimals from the unrounded quotient, and the unrounded shares sum to 1." The complete inventory has 0 blocked lines.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-lines-factors-and-provenance' and ord = 9;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m05-lines-factors-and-provenance ord 9'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m05-lines-factors-and-provenance ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course''s line shares of the Igbogene total, as printed, sum to 1.000001. What does its rounding note say?', options = '["Each share is rounded to six decimals; the unrounded shares sum to 1.", "A line is counted twice, once as CO2 and once as methane, in the total.", "The flare''s methane share is added to the flare''s CO2 share a second time.", "The total includes a blocked line that the shares leave out of the sum."]'::jsonb, explanation = 'The course: "ROUNDING NOTE: the shares as printed sum to 1.000001; each is rounded to six decimals from the unrounded quotient, and the unrounded shares sum to 1." The complete inventory has 0 blocked lines.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-lines-factors-and-provenance' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m05-lines-factors-and-provenance ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m05-lines-factors-and-provenance ord 10
  select case
           when prompt = 'Over the boundary "Igbogene crude export only", what total intensity does carbonIntensity return?' and options = '["0.01176597 tCO2e per barrel of oil exported", "0.01246090 tCO2e per barrel of oil exported", "0.00535892 tCO2e per barrel of oil exported", "0.01781982 tCO2e per barrel of oil exported"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 10 prints crude export only, denominator 2410000, Scope 1 intensity 0.01246090, Scope 2 intensity 0.00535892 and total intensity 0.01781982. 0.01176597 is the total over the inlet to export boundary, per barrel of oil equivalent produced.' then 'old'
           when prompt = 'Over the boundary "Igbogene crude export only", what total intensity does carbonIntensity return?' and options = '["0.01176597 tCO2e per barrel of oil exported", "0.01246090 tCO2e per barrel of oil exported", "0.00535892 tCO2e per barrel of oil exported", "0.01781982 tCO2e per barrel of oil exported"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The lab prints crude export only, denominator 2410000, Scope 1 intensity 0.01246090, Scope 2 intensity 0.00535892 and total intensity 0.01781982. 0.01176597 is the total over the inlet to export boundary, per barrel of oil equivalent produced.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-lines-factors-and-provenance' and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m05-lines-factors-and-provenance ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m05-lines-factors-and-provenance ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Over the boundary "Igbogene crude export only", what total intensity does carbonIntensity return?', options = '["0.01176597 tCO2e per barrel of oil exported", "0.01246090 tCO2e per barrel of oil exported", "0.00535892 tCO2e per barrel of oil exported", "0.01781982 tCO2e per barrel of oil exported"]'::jsonb, explanation = 'The lab prints crude export only, denominator 2410000, Scope 1 intensity 0.01246090, Scope 2 intensity 0.00535892 and total intensity 0.01781982. 0.01176597 is the total over the inlet to export boundary, per barrel of oil equivalent produced.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-lines-factors-and-provenance' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m05-lines-factors-and-provenance ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m05-lines-factors-and-provenance ord 11
  select case
           when prompt = 'What two conditions does the engine''s comparability note on an intensity set?' and options = '["The same denominator and the same reporting year for both", "The same boundary and the same Scope 2 electricity factor", "The same boundary and the same global warming potential set", "The same GWP set and a Scope 1 total of the same size"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 10 quotes the note: "Comparable only with an intensity on the same boundary (Igbogene flow station and gas plant, inlet to export) and the same global warming potential set (IPCC AR6 GWP100, fossil methane)."' then 'old'
           when prompt = 'What two conditions does the engine''s comparability note on an intensity set?' and options = '["The same denominator and the same reporting year for both", "The same boundary and the same Scope 2 electricity factor", "The same boundary and the same global warming potential set", "The same GWP set and a Scope 1 total of the same size"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course quotes the note: "Comparable only with an intensity on the same boundary (Igbogene flow station and gas plant, inlet to export) and the same global warming potential set (IPCC AR6 GWP100, fossil methane)."' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-lines-factors-and-provenance' and ord = 11;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m05-lines-factors-and-provenance ord 11'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m05-lines-factors-and-provenance ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What two conditions does the engine''s comparability note on an intensity set?', options = '["The same denominator and the same reporting year for both", "The same boundary and the same Scope 2 electricity factor", "The same boundary and the same global warming potential set", "The same GWP set and a Scope 1 total of the same size"]'::jsonb, explanation = 'The course quotes the note: "Comparable only with an intensity on the same boundary (Igbogene flow station and gas plant, inlet to export) and the same global warming potential set (IPCC AR6 GWP100, fossil methane)."'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-lines-factors-and-provenance' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m05-lines-factors-and-provenance ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m05-lines-factors-and-provenance ord 12
  select case
           when prompt = 'With the electricity factor blank, what does the total intensity over the inlet to export boundary read?' and options = '["0.01176597, reportable true", "0.00822761, reportable false", "0.00822761, reportable true", "REFUSED: A positive denominator is required."]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 10: with the electricity factor blank the total intensity is 0.00822761 tCO2e per barrel of oil equivalent produced, reportable false, because 1 line(s) could not be computed. An intensity inherits its inventory''s status. 0.01176597 is the complete inventory''s total intensity.' then 'old'
           when prompt = 'With the electricity factor blank, what does the total intensity over the inlet to export boundary read?' and options = '["0.01176597, reportable true", "0.00822761, reportable false", "0.00822761, reportable true", "REFUSED: A positive denominator is required."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course: with the electricity factor blank the total intensity is 0.00822761 tCO2e per barrel of oil equivalent produced, reportable false, because 1 line(s) could not be computed. An intensity inherits its inventory''s status. 0.01176597 is the complete inventory''s total intensity.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-lines-factors-and-provenance' and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m05-lines-factors-and-provenance ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m05-lines-factors-and-provenance ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'With the electricity factor blank, what does the total intensity over the inlet to export boundary read?', options = '["0.01176597, reportable true", "0.00822761, reportable false", "0.00822761, reportable true", "REFUSED: A positive denominator is required."]'::jsonb, explanation = 'The course: with the electricity factor blank the total intensity is 0.00822761 tCO2e per barrel of oil equivalent produced, reportable false, because 1 line(s) could not be computed. An intensity inherits its inventory''s status. 0.01176597 is the complete inventory''s total intensity.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-lines-factors-and-provenance' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m05-lines-factors-and-provenance ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m05-lines-factors-and-provenance ord 13
  select case
           when prompt = 'The engine''s disclaimer on the inventory names three things that belong in the compliance register. Which three?' and options = '["Factors, sources and versions of each line", "Scope 1, Scope 2 and the total, in tCO2e", "Blocked lines, their reasons and the set", "Obligations, evidence and deadlines"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 7 quotes it: "This is a quantitative inventory. It is not a regulatory compliance register: obligations, evidence and deadlines belong in the compliance register, and keeping a second copy of them here would create two records that could disagree." The inventory itself carries each line''s factor, source and version, its totals and its blocked lines.' then 'old'
           when prompt = 'The engine''s disclaimer on the inventory names three things that belong in the compliance register. Which three?' and options = '["Factors, sources and versions of each line", "Scope 1, Scope 2 and the total, in tCO2e", "Blocked lines, their reasons and the set", "Obligations, evidence and deadlines"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course quotes it: "This is a quantitative inventory. It is not a regulatory compliance register: obligations, evidence and deadlines belong in the compliance register, and keeping a second copy of them here would create two records that could disagree." The inventory itself carries each line''s factor, source and version, its totals and its blocked lines.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-lines-factors-and-provenance' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m05-lines-factors-and-provenance ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m05-lines-factors-and-provenance ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The engine''s disclaimer on the inventory names three things that belong in the compliance register. Which three?', options = '["Factors, sources and versions of each line", "Scope 1, Scope 2 and the total, in tCO2e", "Blocked lines, their reasons and the set", "Obligations, evidence and deadlines"]'::jsonb, explanation = 'The course quotes it: "This is a quantitative inventory. It is not a regulatory compliance register: obligations, evidence and deadlines belong in the compliance register, and keeping a second copy of them here would create two records that could disagree." The inventory itself carries each line''s factor, source and version, its totals and its blocked lines.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-lines-factors-and-provenance' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m05-lines-factors-and-provenance ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m05-lines-factors-and-provenance ord 14
  select case
           when prompt = 'In the first pass, Scope 2 reads 0.000 tCO2e. What does the digest show behind that figure?' and options = '["Its one line, Purchased electricity, is blocked: no factor value.", "Igbogene bought no electricity in the year the first pass covers.", "The electricity line is on scope 3, which the inventory never totals.", "The factor 0.41 is present with no source, so it is counted as zero."]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 9 lists Purchased electricity among the first pass blocked lines, "blocked: no factor value". Once the factor is entered with its source, Scope 2 reads 12915.000. SECTION 7 prints the line on scope 2 with an activity of 31500.000 MWh.' then 'old'
           when prompt = 'In the first pass, Scope 2 reads 0.000 tCO2e. What does the lab show behind that figure?' and options = '["Its one line, Purchased electricity, is blocked: no factor value.", "Igbogene bought no electricity in the year the first pass covers.", "The electricity line is on scope 3, which the inventory never totals.", "The factor 0.41 is present with no source, so it is counted as zero."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The lab lists Purchased electricity among the first pass blocked lines, "blocked: no factor value". Once the factor is entered with its source, Scope 2 reads 12915.000. The lab prints the line on scope 2 with an activity of 31500.000 MWh.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-lines-factors-and-provenance' and ord = 14;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m05-lines-factors-and-provenance ord 14'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m05-lines-factors-and-provenance ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'In the first pass, Scope 2 reads 0.000 tCO2e. What does the lab show behind that figure?', options = '["Its one line, Purchased electricity, is blocked: no factor value.", "Igbogene bought no electricity in the year the first pass covers.", "The electricity line is on scope 3, which the inventory never totals.", "The factor 0.41 is present with no source, so it is counted as zero."]'::jsonb, explanation = 'The lab lists Purchased electricity among the first pass blocked lines, "blocked: no factor value". Once the factor is entered with its source, Scope 2 reads 12915.000. The lab prints the line on scope 2 with an activity of 31500.000 MWh.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-lines-factors-and-provenance' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m05-lines-factors-and-provenance ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m05-lines-factors-and-provenance ord 15
  select case
           when prompt = 'Read as activity x factor x GWP, which row matches Purchased electricity?' and options = '["31500.000 MWh at 0.41 tCO2/MWh and a GWP of 29.8: 4231.600 tCO2e", "12915.000 MWh at 0.41 tCO2/MWh and a GWP of 1: 31500.000 tCO2e", "31500.000 MWh at 0.41 tCO2/MWh and a GWP of 1: 12915.000 tCO2e", "31500.000 MWh at 1 tCO2/MWh and a GWP of 0.41: 12915.000 tCO2e"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 7 prints Purchased electricity: activity 31500.000 MWh, factor 0.41 tCO2/MWh (invented and SYNTHETIC), GWP 1, tonnes of gas 12915.000, tCO2e 12915.000. Every line is activity x factor x GWP (checked here). 4231.600 is the vented methane line, at a GWP of 29.8 on IPCC AR6 GWP100, fossil methane.' then 'old'
           when prompt = 'Read as activity x factor x GWP, which row matches Purchased electricity?' and options = '["31500.000 MWh at 0.41 tCO2/MWh and a GWP of 29.8: 4231.600 tCO2e", "12915.000 MWh at 0.41 tCO2/MWh and a GWP of 1: 31500.000 tCO2e", "31500.000 MWh at 0.41 tCO2/MWh and a GWP of 1: 12915.000 tCO2e", "31500.000 MWh at 1 tCO2/MWh and a GWP of 0.41: 12915.000 tCO2e"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The lab prints Purchased electricity: activity 31500.000 MWh, factor 0.41 tCO2/MWh (invented and SYNTHETIC), GWP 1, tonnes of gas 12915.000, tCO2e 12915.000. Every line is activity x factor x GWP (checked here). 4231.600 is the vented methane line, at a GWP of 29.8 on IPCC AR6 GWP100, fossil methane.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-lines-factors-and-provenance' and ord = 15;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m05-lines-factors-and-provenance ord 15'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m05-lines-factors-and-provenance ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Read as activity x factor x GWP, which row matches Purchased electricity?', options = '["31500.000 MWh at 0.41 tCO2/MWh and a GWP of 29.8: 4231.600 tCO2e", "12915.000 MWh at 0.41 tCO2/MWh and a GWP of 1: 31500.000 tCO2e", "31500.000 MWh at 0.41 tCO2/MWh and a GWP of 1: 12915.000 tCO2e", "31500.000 MWh at 1 tCO2/MWh and a GWP of 0.41: 12915.000 tCO2e"]'::jsonb, explanation = 'The lab prints Purchased electricity: activity 31500.000 MWh, factor 0.41 tCO2/MWh (invented and SYNTHETIC), GWP 1, tonnes of gas 12915.000, tCO2e 12915.000. Every line is activity x factor x GWP (checked here). 4231.600 is the vented methane line, at a GWP of 29.8 on IPCC AR6 GWP100, fossil methane.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm05-lines-factors-and-provenance' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m05-lines-factors-and-provenance ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m06-the-associate-reading ord 1
  select case
           when prompt = 'Under the rules in force, what becomes of a line that errors, or one off Scope 1 and Scope 2?' and options = '["It is dropped from the inventory unseen", "It is a blocked line with its reason", "It is computed at 0.000 tCO2e instead", "It stops every total being computed"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 25 lists the rule "A line that errors, and a line off Scope 1 and Scope 2, is a blocked line with its reason" (SECTION 9). SECTION 9 names each blocked line with its reason, and the totals are still computed from the lines that did compute.' then 'old'
           when prompt = 'Under the rules in force, what becomes of a line that errors, or one off Scope 1 and Scope 2?' and options = '["It is dropped from the inventory unseen", "It is a blocked line with its reason", "It is computed at 0.000 tCO2e instead", "It stops every total being computed"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course lists the rule "A line that errors, and a line off Scope 1 and Scope 2, is a blocked line with its reason". The lab names each blocked line with its reason, and the totals are still computed from the lines that did compute.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m06-the-associate-reading ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m06-the-associate-reading ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Under the rules in force, what becomes of a line that errors, or one off Scope 1 and Scope 2?', options = '["It is dropped from the inventory unseen", "It is a blocked line with its reason", "It is computed at 0.000 tCO2e instead", "It stops every total being computed"]'::jsonb, explanation = 'The course lists the rule "A line that errors, and a line off Scope 1 and Scope 2, is a blocked line with its reason". The lab names each blocked line with its reason, and the totals are still computed from the lines that did compute.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m06-the-associate-reading ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m06-the-associate-reading ord 2
  select case
           when prompt = 'Held item H3 counts every escaped carbon atom as methane. Which Igbogene inventory line rests on that assumption?' and options = '["Vented and fugitive methane, 142.000 t CH4", "Fired heaters (CO2), 23121.448 t CO2", "Flaring (CO2), 2191.807 t CO2", "Flaring (unburned CH4), 16.306 t CH4"]'::jsonb and answer_index = 3 and explanation is not distinct from 'H3 (SECTION 25) points at SECTION 5, where the flare''s escaped carbon becomes ch4Tonnes 16.306 at 0.98; SECTION 7 carries it as Flaring (unburned CH4). The vented line''s 142.000 t comes from the survey, and the two CO2 lines are the carbon that burned.' then 'old'
           when prompt = 'Held item H3 counts every escaped carbon atom as methane. Which Igbogene inventory line rests on that assumption?' and options = '["Vented and fugitive methane, 142.000 t CH4", "Fired heaters (CO2), 23121.448 t CO2", "Flaring (CO2), 2191.807 t CO2", "Flaring (unburned CH4), 16.306 t CH4"]'::jsonb and answer_index = 3 and explanation is not distinct from 'H3 points at the flare lesson, where the flare''s escaped carbon becomes ch4Tonnes 16.306 at 0.98; the inventory carries it as Flaring (unburned CH4). The vented line''s 142.000 t comes from the survey, and the two CO2 lines are the carbon that burned.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m06-the-associate-reading ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m06-the-associate-reading ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Held item H3 counts every escaped carbon atom as methane. Which Igbogene inventory line rests on that assumption?', options = '["Vented and fugitive methane, 142.000 t CH4", "Fired heaters (CO2), 23121.448 t CO2", "Flaring (CO2), 2191.807 t CO2", "Flaring (unburned CH4), 16.306 t CH4"]'::jsonb, explanation = 'H3 points at the flare lesson, where the flare''s escaped carbon becomes ch4Tonnes 16.306 at 0.98; the inventory carries it as Flaring (unburned CH4). The vented line''s 142.000 t comes from the survey, and the two CO2 lines are the carbon that burned.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m06-the-associate-reading ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m06-the-associate-reading ord 3
  select case
           when prompt = 'Every other gap is closed and only the flare''s destruction efficiency is blank. What does the total leave out?' and options = '["The flare''s CO2 line and its methane line", "The flare''s methane line alone, 485.922 tCO2e", "The vented and fugitive methane line", "Nothing, since the flare is read at 1"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 9 prints that inventory: 4 lines, Scope 1 27353.048, total 40268.048 tCO2e, reportable false. "The total leaves out the flare''s CO2 and methane lines, and the inventory is not reportable while the flare stands refused."' then 'old'
           when prompt = 'Every other gap is closed and only the flare''s destruction efficiency is blank. What does the total leave out?' and options = '["The flare''s CO2 line and its methane line", "The flare''s methane line alone, 485.922 tCO2e", "The vented and fugitive methane line", "Nothing, since the flare is read at 1"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course prints that inventory: 4 lines, Scope 1 27353.048, total 40268.048 tCO2e, reportable false. "The total leaves out the flare''s CO2 and methane lines, and the inventory is not reportable while the flare stands refused."' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m06-the-associate-reading ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m06-the-associate-reading ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Every other gap is closed and only the flare''s destruction efficiency is blank. What does the total leave out?', options = '["The flare''s CO2 line and its methane line", "The flare''s methane line alone, 485.922 tCO2e", "The vented and fugitive methane line", "Nothing, since the flare is read at 1"]'::jsonb, explanation = 'The course prints that inventory: 4 lines, Scope 1 27353.048, total 40268.048 tCO2e, reportable false. "The total leaves out the flare''s CO2 and methane lines, and the inventory is not reportable while the flare stands refused."'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m06-the-associate-reading ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m06-the-associate-reading ord 4
  select case
           when prompt = 'Which flags does the complete Igbogene inventory return?' and options = '["computed true, reportable false, blocked lines 0, unsourced lines 1", "computed true, reportable true, blocked lines 0, unsourced lines 1", "computed true, reportable true, blocked lines 0, unsourced lines 0", "computed false, reportable true, blocked lines 0, unsourced lines 0"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 7 prints: "gwpSetLabel: IPCC AR6 GWP100, fossil methane. computed: true. reportable: true. blocked lines: 0. unsourced lines: 0." SECTION 9 shows an unsourced factor keeps an inventory from being reportable.' then 'old'
           when prompt = 'Which flags does the complete Igbogene inventory return?' and options = '["computed true, reportable false, blocked lines 0, unsourced lines 1", "computed true, reportable true, blocked lines 0, unsourced lines 1", "computed true, reportable true, blocked lines 0, unsourced lines 0", "computed false, reportable true, blocked lines 0, unsourced lines 0"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The lab prints: "gwpSetLabel: IPCC AR6 GWP100, fossil methane. computed: true. reportable: true. blocked lines: 0. unsourced lines: 0." The lab shows an unsourced factor keeps an inventory from being reportable.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m06-the-associate-reading ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m06-the-associate-reading ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which flags does the complete Igbogene inventory return?', options = '["computed true, reportable false, blocked lines 0, unsourced lines 1", "computed true, reportable true, blocked lines 0, unsourced lines 1", "computed true, reportable true, blocked lines 0, unsourced lines 0", "computed false, reportable true, blocked lines 0, unsourced lines 0"]'::jsonb, explanation = 'The lab prints: "gwpSetLabel: IPCC AR6 GWP100, fossil methane. computed: true. reportable: true. blocked lines: 0. unsourced lines: 0." The lab shows an unsourced factor keeps an inventory from being reportable.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m06-the-associate-reading ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m06-the-associate-reading ord 5
  select case
           when prompt = 'Which Igbogene line rests on the Epie Creek leak detection survey (invented), version 2026 Q2?' and options = '["Flaring (unburned CH4), 16.306 t CH4", "Vented and fugitive methane, 142.000 t CH4", "Purchased electricity, 31500.000 MWh", "Fired heaters (CO2), 23121.448 t CO2"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 7 prints the survey as the source of the Vented and fugitive methane line, activity 142.000 t CH4, factor 1 tCH4/t. The flare''s methane and the heaters are atom-balance lines, and the electricity line rests on the supplier statement (invented), 2025.' then 'old'
           when prompt = 'Which Igbogene line rests on the Epie Creek leak detection survey (invented), version 2026 Q2?' and options = '["Flaring (unburned CH4), 16.306 t CH4", "Vented and fugitive methane, 142.000 t CH4", "Purchased electricity, 31500.000 MWh", "Fired heaters (CO2), 23121.448 t CO2"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The lab prints the survey as the source of the Vented and fugitive methane line, activity 142.000 t CH4, factor 1 tCH4/t. The flare''s methane and the heaters are atom-balance lines, and the electricity line rests on the supplier statement (invented), 2025.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m06-the-associate-reading ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m06-the-associate-reading ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which Igbogene line rests on the Epie Creek leak detection survey (invented), version 2026 Q2?', options = '["Flaring (unburned CH4), 16.306 t CH4", "Vented and fugitive methane, 142.000 t CH4", "Purchased electricity, 31500.000 MWh", "Fired heaters (CO2), 23121.448 t CO2"]'::jsonb, explanation = 'The lab prints the survey as the source of the Vented and fugitive methane line, activity 142.000 t CH4, factor 1 tCH4/t. The flare''s methane and the heaters are atom-balance lines, and the electricity line rests on the supplier statement (invented), 2025.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m06-the-associate-reading ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m06-the-associate-reading ord 6
  select case
           when prompt = 'What shares of the complete Igbogene total does the digest print for the flare''s two lines?' and options = '["0.011315 for its CO2 and 0.051037 for its methane", "0.051037 for its CO2 and 0.181468 for its methane", "0.098534 for its CO2 and 0.011315 for its methane", "0.051037 for its CO2 and 0.011315 for its methane"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 7''s share table (computed here) prints Flaring (CO2) 0.051037 and Flaring (unburned CH4) 0.011315. 0.181468 is a share of the flare alone (SECTION 5), and 0.098534 belongs to the vented line.' then 'old'
           when prompt = 'What shares of the complete Igbogene total does the course print for the flare''s two lines?' and options = '["0.011315 for its CO2 and 0.051037 for its methane", "0.051037 for its CO2 and 0.181468 for its methane", "0.098534 for its CO2 and 0.011315 for its methane", "0.051037 for its CO2 and 0.011315 for its methane"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The lab''s share table (computed here) prints Flaring (CO2) 0.051037 and Flaring (unburned CH4) 0.011315. 0.181468 is a share of the flare alone, and 0.098534 belongs to the vented line.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m06-the-associate-reading ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m06-the-associate-reading ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What shares of the complete Igbogene total does the course print for the flare''s two lines?', options = '["0.011315 for its CO2 and 0.051037 for its methane", "0.051037 for its CO2 and 0.181468 for its methane", "0.098534 for its CO2 and 0.011315 for its methane", "0.051037 for its CO2 and 0.011315 for its methane"]'::jsonb, explanation = 'The lab''s share table (computed here) prints Flaring (CO2) 0.051037 and Flaring (unburned CH4) 0.011315. 0.181468 is a share of the flare alone, and 0.098534 belongs to the vented line.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m06-the-associate-reading ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m06-the-associate-reading ord 7
  select case
           when prompt = 'What factor does SECTION 7 give the atom-balance lines, as the Carbon Studio builds them?' and options = '["A factor of 1 whose source is conservation of mass", "The heaters'' 1.09 kmol of carbon per kmol of fuel", "MW_CO2, 44.009, whose source is the IUPAC weights", "The set''s CH4 value, 29.8, applied as the factor"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 7: "The atom-balance lines carry a factor of 1 whose source is conservation of mass, as the Carbon Studio builds them." The factor column reads 1 on all three atom-balance lines; 29.8 sits in the GWP column of the methane lines, on IPCC AR6 GWP100, fossil methane.' then 'old'
           when prompt = 'What factor does the course give the atom-balance lines, as the Carbon Studio builds them?' and options = '["A factor of 1 whose source is conservation of mass", "The heaters'' 1.09 kmol of carbon per kmol of fuel", "MW_CO2, 44.009, whose source is the IUPAC weights", "The set''s CH4 value, 29.8, applied as the factor"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course: "The atom-balance lines carry a factor of 1 whose source is conservation of mass, as the Carbon Studio builds them." The factor column reads 1 on all three atom-balance lines; 29.8 sits in the GWP column of the methane lines, on IPCC AR6 GWP100, fossil methane.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m06-the-associate-reading ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m06-the-associate-reading ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What factor does the course give the atom-balance lines, as the Carbon Studio builds them?', options = '["A factor of 1 whose source is conservation of mass", "The heaters'' 1.09 kmol of carbon per kmol of fuel", "MW_CO2, 44.009, whose source is the IUPAC weights", "The set''s CH4 value, 29.8, applied as the factor"]'::jsonb, explanation = 'The course: "The atom-balance lines carry a factor of 1 whose source is conservation of mass, as the Carbon Studio builds them." The factor column reads 1 on all three atom-balance lines; 29.8 sits in the GWP column of the methane lines, on IPCC AR6 GWP100, fossil methane.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m06-the-associate-reading ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m06-the-associate-reading ord 8
  select case
           when prompt = 'How many lines make up Scope 1 in the complete Igbogene inventory, and what do they total?' and options = '["5 lines, 42945.777 tCO2e", "4 lines, 27353.048 tCO2e", "4 lines, 30030.777 tCO2e", "3 lines, 30030.777 tCO2e"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 7: "Scope 1 is the sum of its 4 lines" and prints Scope 1 (direct) at 30030.777 tCO2e. 42945.777 is the total of both scopes, and 27353.048 is Scope 1 with the flare''s efficiency still blank.' then 'old'
           when prompt = 'How many lines make up Scope 1 in the complete Igbogene inventory, and what do they total?' and options = '["5 lines, 42945.777 tCO2e", "4 lines, 27353.048 tCO2e", "4 lines, 30030.777 tCO2e", "3 lines, 30030.777 tCO2e"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course: "Scope 1 is the sum of its 4 lines" and prints Scope 1 (direct) at 30030.777 tCO2e. 42945.777 is the total of both scopes, and 27353.048 is Scope 1 with the flare''s efficiency still blank.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m06-the-associate-reading ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m06-the-associate-reading ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'How many lines make up Scope 1 in the complete Igbogene inventory, and what do they total?', options = '["5 lines, 42945.777 tCO2e", "4 lines, 27353.048 tCO2e", "4 lines, 30030.777 tCO2e", "3 lines, 30030.777 tCO2e"]'::jsonb, explanation = 'The course: "Scope 1 is the sum of its 4 lines" and prints Scope 1 (direct) at 30030.777 tCO2e. 42945.777 is the total of both scopes, and 27353.048 is Scope 1 with the flare''s efficiency still blank.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m06-the-associate-reading ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m06-the-associate-reading ord 9
  select case
           when prompt = 'What activity and unit does the Fired heaters (CO2) line carry into the inventory?' and options = '["482000 kmol of fuel", "525380.000 kmol of carbon", "31500.000 MWh", "23121.448 t CO2"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 7 gives the heaters'' line an activity of 23121.448 in t CO2, the co2Tonnes SECTION 4 returns. 482000 kmol is the fuel typed in, 525380.000 kmol the carbon counted from it, and 31500.000 MWh the electricity line''s activity.' then 'old'
           when prompt = 'What activity and unit does the Fired heaters (CO2) line carry into the inventory?' and options = '["482000 kmol of fuel", "525380.000 kmol of carbon", "31500.000 MWh", "23121.448 t CO2"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The lab gives the heaters'' line an activity of 23121.448 in t CO2, the co2Tonnes the engine returns. 482000 kmol is the fuel typed in, 525380.000 kmol the carbon counted from it, and 31500.000 MWh the electricity line''s activity.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 9;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m06-the-associate-reading ord 9'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m06-the-associate-reading ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What activity and unit does the Fired heaters (CO2) line carry into the inventory?', options = '["482000 kmol of fuel", "525380.000 kmol of carbon", "31500.000 MWh", "23121.448 t CO2"]'::jsonb, explanation = 'The lab gives the heaters'' line an activity of 23121.448 in t CO2, the co2Tonnes the engine returns. 482000 kmol is the fuel typed in, 525380.000 kmol the carbon counted from it, and 31500.000 MWh the electricity line''s activity.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m06-the-associate-reading ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m06-the-associate-reading ord 10
  select case
           when prompt = 'At the heaters'' typed destruction efficiency of 1, what do ch4Tonnes and unburnedNote read?' and options = '["ch4Tonnes 0.000 and unburnedNote none", "ch4Tonnes 8.429 and unburnedNote none", "ch4Tonnes 0.000 and the escaped carbon note", "ch4Tonnes 42.143 and the escaped carbon note"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 4 prints the heaters at 1: carbonKmolPerYear 525380.000, co2Tonnes 23121.448, ch4Tonnes 0.000, unburnedNote none. 8.429 and 42.143 are the methane at 0.999 and at 0.995.' then 'old'
           when prompt = 'At the heaters'' typed destruction efficiency of 1, what do ch4Tonnes and unburnedNote read?' and options = '["ch4Tonnes 0.000 and unburnedNote none", "ch4Tonnes 8.429 and unburnedNote none", "ch4Tonnes 0.000 and the escaped carbon note", "ch4Tonnes 42.143 and the escaped carbon note"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course prints the heaters at 1: carbonKmolPerYear 525380.000, co2Tonnes 23121.448, ch4Tonnes 0.000, unburnedNote none. 8.429 and 42.143 are the methane at 0.999 and at 0.995.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m06-the-associate-reading ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m06-the-associate-reading ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'At the heaters'' typed destruction efficiency of 1, what do ch4Tonnes and unburnedNote read?', options = '["ch4Tonnes 0.000 and unburnedNote none", "ch4Tonnes 8.429 and unburnedNote none", "ch4Tonnes 0.000 and the escaped carbon note", "ch4Tonnes 42.143 and the escaped carbon note"]'::jsonb, explanation = 'The course prints the heaters at 1: carbonKmolPerYear 525380.000, co2Tonnes 23121.448, ch4Tonnes 0.000, unburnedNote none. 8.429 and 42.143 are the methane at 0.999 and at 0.995.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m06-the-associate-reading ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m06-the-associate-reading ord 11
  select case
           when prompt = 'The complete inventory''s total intensity over inlet to export is 0.01176597. Which tonnes over which denominator does the digest give for it?' and options = '["30030.777 tCO2e over 3650000", "42945.777 tCO2e over 3650000", "42945.777 tCO2e over 2410000", "12915.000 tCO2e over 3650000"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 10: "42945.777 tCO2e over 3650000 is 0.01176597 (computed here), the engine''s total intensity on the first boundary." 2410000 is the crude export only denominator. The Scope 1 and Scope 2 intensities on the first boundary are 0.00822761 and 0.00353836.' then 'old'
           when prompt = 'The complete inventory''s total intensity over inlet to export is 0.01176597. Which tonnes over which denominator does the course give for it?' and options = '["30030.777 tCO2e over 3650000", "42945.777 tCO2e over 3650000", "42945.777 tCO2e over 2410000", "12915.000 tCO2e over 3650000"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course: "42945.777 tCO2e over 3650000 is 0.01176597 (computed here), the engine''s total intensity on the first boundary." 2410000 is the crude export only denominator. The Scope 1 and Scope 2 intensities on the first boundary are 0.00822761 and 0.00353836.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 11;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m06-the-associate-reading ord 11'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m06-the-associate-reading ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The complete inventory''s total intensity over inlet to export is 0.01176597. Which tonnes over which denominator does the course give for it?', options = '["30030.777 tCO2e over 3650000", "42945.777 tCO2e over 3650000", "42945.777 tCO2e over 2410000", "12915.000 tCO2e over 3650000"]'::jsonb, explanation = 'The course: "42945.777 tCO2e over 3650000 is 0.01176597 (computed here), the engine''s total intensity on the first boundary." 2410000 is the crude export only denominator. The Scope 1 and Scope 2 intensities on the first boundary are 0.00822761 and 0.00353836.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m06-the-associate-reading ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m06-the-associate-reading ord 12
  select case
           when prompt = 'On the course''s set, what scope and GWP does each methane line carry?' and options = '["Scope 1 for the flare and Scope 2 for the vented line", "Scope 1, the flare at 29.8 and the vented line at 27", "Scope 1, both at 29.8 on the course''s set", "Scope 2, both at a GWP of 1 on the course''s set"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 7 prints Flaring (unburned CH4) and Vented and fugitive methane on scope 1, gas CH4, GWP 29.8, on IPCC AR6 GWP100, fossil methane. 27 is the AR6 non-fossil value, and Scope 2 holds only the purchased electricity line.' then 'old'
           when prompt = 'On the course''s set, what scope and GWP does each methane line carry?' and options = '["Scope 1 for the flare and Scope 2 for the vented line", "Scope 1, the flare at 29.8 and the vented line at 27", "Scope 1, both at 29.8 on the course''s set", "Scope 2, both at a GWP of 1 on the course''s set"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The lab prints Flaring (unburned CH4) and Vented and fugitive methane on scope 1, gas CH4, GWP 29.8, on IPCC AR6 GWP100, fossil methane. 27 is the AR6 non-fossil value, and Scope 2 holds only the purchased electricity line.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m06-the-associate-reading ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m06-the-associate-reading ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'On the course''s set, what scope and GWP does each methane line carry?', options = '["Scope 1 for the flare and Scope 2 for the vented line", "Scope 1, the flare at 29.8 and the vented line at 27", "Scope 1, both at 29.8 on the course''s set", "Scope 2, both at a GWP of 1 on the course''s set"]'::jsonb, explanation = 'The lab prints Flaring (unburned CH4) and Vented and fugitive methane on scope 1, gas CH4, GWP 29.8, on IPCC AR6 GWP100, fossil methane. 27 is the AR6 non-fossil value, and Scope 2 holds only the purchased electricity line.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m06-the-associate-reading ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m06-the-associate-reading ord 13
  select case
           when prompt = 'Which lines of the complete inventory carry the source Atom balance (conservation of mass)?' and options = '["Fired heaters (CO2), Flaring (CO2) and Flaring (unburned CH4)", "Fired heaters (CO2) and Flaring (CO2), with no methane line", "All five lines, the electricity line through its 0.41 factor", "Fired heaters (CO2) alone, the one burner line of the five"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 7 prints three lines with the source "Atom balance (conservation of mass)" and version "not applicable": the fired heaters, the flare''s CO2 and the flare''s unburned CH4. The vented line rests on the survey and the electricity line on the supplier statement.' then 'old'
           when prompt = 'Which lines of the complete inventory carry the source Atom balance (conservation of mass)?' and options = '["Fired heaters (CO2), Flaring (CO2) and Flaring (unburned CH4)", "Fired heaters (CO2) and Flaring (CO2), with no methane line", "All five lines, the electricity line through its 0.41 factor", "Fired heaters (CO2) alone, the one burner line of the five"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The lab prints three lines with the source "Atom balance (conservation of mass)" and version "not applicable": the fired heaters, the flare''s CO2 and the flare''s unburned CH4. The vented line rests on the survey and the electricity line on the supplier statement.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m06-the-associate-reading ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m06-the-associate-reading ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which lines of the complete inventory carry the source Atom balance (conservation of mass)?', options = '["Fired heaters (CO2), Flaring (CO2) and Flaring (unburned CH4)", "Fired heaters (CO2) and Flaring (CO2), with no methane line", "All five lines, the electricity line through its 0.41 factor", "Fired heaters (CO2) alone, the one burner line of the five"]'::jsonb, explanation = 'The lab prints three lines with the source "Atom balance (conservation of mass)" and version "not applicable": the fired heaters, the flare''s CO2 and the flare''s unburned CH4. The vented line rests on the survey and the electricity line on the supplier statement.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m06-the-associate-reading ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m06-the-associate-reading ord 14
  select case
           when prompt = 'At which step of the Igbogene build does the line count go from 4 to 5?' and options = '["The GWP set declared", "The electricity factor entered with its source", "The survey referenced", "The flare efficiency entered"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 9''s lines column reads 4, 4, 5, 5, 5, and the flare efficiency entered is the step where it moves. SECTION 5 turns a refused flare into 1 blocked line, and SECTION 7 carries the computed flare as two lines, Flaring (CO2) and Flaring (unburned CH4).' then 'old'
           when prompt = 'At which step of the Igbogene build does the line count go from 4 to 5?' and options = '["The GWP set declared", "The electricity factor entered with its source", "The survey referenced", "The flare efficiency entered"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The lab''s lines column reads 4, 4, 5, 5, 5, and the flare efficiency entered is the step where it moves. The engine turns a refused flare into 1 blocked line, and the inventory carries the computed flare as two lines, Flaring (CO2) and Flaring (unburned CH4).' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 14;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m06-the-associate-reading ord 14'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m06-the-associate-reading ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'At which step of the Igbogene build does the line count go from 4 to 5?', options = '["The GWP set declared", "The electricity factor entered with its source", "The survey referenced", "The flare efficiency entered"]'::jsonb, explanation = 'The lab''s lines column reads 4, 4, 5, 5, 5, and the flare efficiency entered is the step where it moves. The engine turns a refused flare into 1 blocked line, and the inventory carries the computed flare as two lines, Flaring (CO2) and Flaring (unburned CH4).'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m06-the-associate-reading ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- beginner m06-the-associate-reading ord 15
  select case
           when prompt = 'The Igbogene first pass totals 23121.448 tCO2e. What do its computed and reportable flags read?' and options = '["computed false and reportable false", "computed true and reportable false", "computed true and reportable true", "computed false and reportable true"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 9 prints the first pass with 4 lines, Scope 1 23121.448, Scope 2 0.000, computed true, reportable false, because the global warming potential set is not declared and 3 line(s) could not be computed.' then 'old'
           when prompt = 'The Igbogene first pass totals 23121.448 tCO2e. What do its computed and reportable flags read?' and options = '["computed false and reportable false", "computed true and reportable false", "computed true and reportable true", "computed false and reportable true"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The lab prints the first pass with 4 lines, Scope 1 23121.448, Scope 2 0.000, computed true, reportable false, because the global warming potential set is not declared and 3 line(s) could not be computed.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 15;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for beginner m06-the-associate-reading ord 15'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: beginner m06-the-associate-reading ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The Igbogene first pass totals 23121.448 tCO2e. What do its computed and reportable flags read?', options = '["computed false and reportable false", "computed true and reportable false", "computed true and reportable true", "computed false and reportable true"]'::jsonb, explanation = 'The lab prints the first pass with 4 lines, Scope 1 23121.448, Scope 2 0.000, computed true, reportable false, because the global warming potential set is not declared and 3 line(s) could not be computed.'
     where app_slug = 'carbon' and tier = 'beginner' and scope = 'module' and module_key is not distinct from 'm06-the-associate-reading' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: beginner m06-the-associate-reading ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 1
  select case
           when prompt = 'In the SECTION 11 demand table, what unweighted c + h/4 + s - o/2 term does the C3H8 row of the invented Isiokpo fuel carry?' and options = '["3.5", "2", "5", "0"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The C3H8 row reads 5 in the c + h/4 + s - o/2 column. CH4 reads 2, C2H6 3.5, and both inerts 0.' then 'old'
           when prompt = 'In the course''s demand table, what unweighted c + h/4 + s - o/2 term does the C3H8 row of the invented Isiokpo fuel carry?' and options = '["3.5", "2", "5", "0"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The C3H8 row reads 5 in the c + h/4 + s - o/2 column. CH4 reads 2, C2H6 3.5, and both inerts 0.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate final ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate final ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'In the course''s demand table, what unweighted c + h/4 + s - o/2 term does the C3H8 row of the invented Isiokpo fuel carry?', options = '["3.5", "2", "5", "0"]'::jsonb, explanation = 'The C3H8 row reads 5 in the c + h/4 + s - o/2 column. CH4 reads 2, C2H6 3.5, and both inerts 0.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate final ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 2
  select case
           when prompt = 'SECTION 11 says the air''s nitrogen is the rest of the stoichiometric air. Which figure does it print for it, in kmol per kmol fuel?' and options = '["9.975652", "8.999152", "7.886152", "0.015000"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 11: the air''s nitrogen is the rest of that air, 7.886152 (computed here; products.airN2PerKmolFuel 7.886152). 9.975652 is the stoichiometric air itself, 8.999152 the dry flue gas at 0 percent oxygen in SECTION 12, and 0.015000 the fuel''s own nitrogen.' then 'old'
           when prompt = 'The course says the air''s nitrogen is the rest of the stoichiometric air. Which figure does it print for it, in kmol per kmol fuel?' and options = '["9.975652", "8.999152", "7.886152", "0.015000"]'::jsonb and answer_index = 2 and explanation is not distinct from 'In the course, the air''s nitrogen is the rest of that air, 7.886152 (computed here; products.airN2PerKmolFuel 7.886152). 9.975652 is the stoichiometric air itself, 8.999152 the dry flue gas at 0 percent oxygen in the oxygen table, and 0.015000 the fuel''s own nitrogen.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate final ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate final ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course says the air''s nitrogen is the rest of the stoichiometric air. Which figure does it print for it, in kmol per kmol fuel?', options = '["9.975652", "8.999152", "7.886152", "0.015000"]'::jsonb, explanation = 'In the course, the air''s nitrogen is the rest of that air, 7.886152 (computed here; products.airN2PerKmolFuel 7.886152). 9.975652 is the stoichiometric air itself, 8.999152 the dry flue gas at 0 percent oxygen in the oxygen table, and 0.015000 the fuel''s own nitrogen.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate final ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 3
  select case
           when prompt = 'Which heating values does SECTION 11 print for the invented Isiokpo fuel gas as analysed, inerts included?' and options = '["862.5564 LHV and 930.6273 HHV MJ per kmol", "802.6 LHV and 890.8 HHV MJ per kmol", "840.9925 LHV and 862.5564 HHV MJ per kmol", "840.9925 LHV and 930.6273 HHV MJ per kmol"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 11 prints lhvMJPerKmolFuel 840.9925 and hhvMJPerKmolFuel 930.6273. 862.5564 is the LHV with the CO2 taken out and the rest renormalised; 802.6 and 890.8 are FUEL_REFERENCE''s typical methane pair, held as H2.' then 'old'
           when prompt = 'Which heating values does the course print for the invented Isiokpo fuel gas as analysed, inerts included?' and options = '["862.5564 LHV and 930.6273 HHV MJ per kmol", "802.6 LHV and 890.8 HHV MJ per kmol", "840.9925 LHV and 862.5564 HHV MJ per kmol", "840.9925 LHV and 930.6273 HHV MJ per kmol"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course prints lhvMJPerKmolFuel 840.9925 and hhvMJPerKmolFuel 930.6273. 862.5564 is the LHV with the CO2 taken out and the rest renormalised; 802.6 and 890.8 are FUEL_REFERENCE''s typical methane pair, held as H2.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate final ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate final ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which heating values does the course print for the invented Isiokpo fuel gas as analysed, inerts included?', options = '["862.5564 LHV and 930.6273 HHV MJ per kmol", "802.6 LHV and 890.8 HHV MJ per kmol", "840.9925 LHV and 862.5564 HHV MJ per kmol", "840.9925 LHV and 930.6273 HHV MJ per kmol"]'::jsonb, explanation = 'The course prints lhvMJPerKmolFuel 840.9925 and hhvMJPerKmolFuel 930.6273. 862.5564 is the LHV with the CO2 taken out and the rest renormalised; 802.6 and 890.8 are FUEL_REFERENCE''s typical methane pair, held as H2.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate final ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 4
  select case
           when prompt = 'At which stack oxygen does SECTION 11 strike its flue gas mass balance, and what does each side weigh?' and options = '["5.5 percent; 351.0222 kg per kmol of fuel on each side", "3 percent; 351.0222 kg per kmol of fuel on each side", "0 percent; 351.0222 kg in and 351.0222 kg out per kg of fuel", "3 percent; 351.0222 kg in, and less out once argon is dropped"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 11 strikes THE MASS BALANCE at 3 percent stack oxygen, per kmol of fuel: 351.0222 in, 351.0222 out, out less in 0.000001 (computed here). Air''s argon leaves inside the atmospheric nitrogen.' then 'old'
           when prompt = 'At which stack oxygen does the course strike its flue gas mass balance, and what does each side weigh?' and options = '["5.5 percent; 351.0222 kg per kmol of fuel on each side", "3 percent; 351.0222 kg per kmol of fuel on each side", "0 percent; 351.0222 kg in and 351.0222 kg out per kg of fuel", "3 percent; 351.0222 kg in, and less out once argon is dropped"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course strikes THE MASS BALANCE at 3 percent stack oxygen, per kmol of fuel: 351.0222 in, 351.0222 out, out less in 0.000001 (computed here). Air''s argon leaves inside the atmospheric nitrogen.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate final ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate final ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'At which stack oxygen does the course strike its flue gas mass balance, and what does each side weigh?', options = '["5.5 percent; 351.0222 kg per kmol of fuel on each side", "3 percent; 351.0222 kg per kmol of fuel on each side", "0 percent; 351.0222 kg in and 351.0222 kg out per kg of fuel", "3 percent; 351.0222 kg in, and less out once argon is dropped"]'::jsonb, explanation = 'The course strikes THE MASS BALANCE at 3 percent stack oxygen, per kmol of fuel: 351.0222 in, 351.0222 out, out less in 0.000001 (computed here). Air''s argon leaves inside the atmospheric nitrogen.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate final ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 5
  select case
           when prompt = 'Which rows of energyEfficiency.FUEL_REFERENCE carry the flag inert yes?' and options = '["N2 and H2", "CO2 alone", "CO2 and N2", "CH4 and H2"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 1 prints inert yes on the Carbon dioxide (inert) and Nitrogen (inert) rows, each with 0 typical LHV and HHV. H2, Hydrogen, prints no with 241.8 LHV and 285.8 HHV MJ/kmol.' then 'old'
           when prompt = 'Which rows of energyEfficiency.FUEL_REFERENCE carry the flag inert yes?' and options = '["N2 and H2", "CO2 alone", "CO2 and N2", "CH4 and H2"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course prints inert yes on the Carbon dioxide (inert) and Nitrogen (inert) rows, each with 0 typical LHV and HHV. H2, Hydrogen, prints no with 241.8 LHV and 285.8 HHV MJ/kmol.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate final ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate final ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which rows of energyEfficiency.FUEL_REFERENCE carry the flag inert yes?', options = '["N2 and H2", "CO2 alone", "CO2 and N2", "CH4 and H2"]'::jsonb, explanation = 'The course prints inert yes on the Carbon dioxide (inert) and Nitrogen (inert) rows, each with 0 typical LHV and HHV. H2, Hydrogen, prints no with 241.8 LHV and 285.8 HHV MJ/kmol.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate final ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 17
  select case
           when prompt = 'Held item H2 sets two computed-here figures beside the engine''s typical methane pair. Which?' and options = '["A difference of 87.985, and 88.2 MJ for two moles of water condensed at the engine''s latent heat", "A corrected methane HHV that replaces 890.8 in FUEL_REFERENCE from this digest onward, graded", "A difference of 88.2, and 87.985 MJ for two moles of water condensed at the engine''s latent heat", "A difference of 88.2 that the course grades, and an ISO 6976 value of 87.985 to be filed instead"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 25 prints both as computed here: 88.2 between the typical LHV and HHV, and 87.985 MJ from 2 x 18.015 kg at 2442 kJ/kg. H2 is a stated limit; nothing in it is graded or corrected.' then 'old'
           when prompt = 'Held item H2 sets two computed-here figures beside the engine''s typical methane pair. Which?' and options = '["A difference of 87.985, and 88.2 MJ for two moles of water condensed at the engine''s latent heat", "A corrected methane HHV that replaces 890.8 in FUEL_REFERENCE from this course onward, graded", "A difference of 88.2, and 87.985 MJ for two moles of water condensed at the engine''s latent heat", "A difference of 88.2 that the course grades, and an ISO 6976 value of 87.985 to be filed instead"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course prints both as computed here: 88.2 between the typical LHV and HHV, and 87.985 MJ from 2 x 18.015 kg at 2442 kJ/kg. H2 is a stated limit; nothing in it is graded or corrected.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 17;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate final ord 17'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate final ord 17 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Held item H2 sets two computed-here figures beside the engine''s typical methane pair. Which?', options = '["A difference of 87.985, and 88.2 MJ for two moles of water condensed at the engine''s latent heat", "A corrected methane HHV that replaces 890.8 in FUEL_REFERENCE from this course onward, graded", "A difference of 88.2, and 87.985 MJ for two moles of water condensed at the engine''s latent heat", "A difference of 88.2 that the course grades, and an ISO 6976 value of 87.985 to be filed instead"]'::jsonb, explanation = 'The course prints both as computed here: 88.2 between the typical LHV and HHV, and 87.985 MJ from 2 x 18.015 kg at 2442 kJ/kg. H2 is a stated limit; nothing in it is graded or corrected.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 17;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate final ord 17 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 18
  select case
           when prompt = 'In the SECTION 14 sweep for the invented Isiokpo heater, how much fuel a year does a 4.5 percent target save on LHV?' and options = '["5214.422 GJ", "2782.362 GJ", "6742.370 GJ", "8337.934 GJ"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The 4.5 row prints target efficiency 86.9933, fuelSavingPercent 0.6786 and annualEnergySavedGJ 2782.362. 5214.422 is the 3.5 row, 6742.370 the 2.8 row and 8337.934 the 2.0 row, all against 410000 GJ a year (invented).' then 'old'
           when prompt = 'In the course''s sweep for the invented Isiokpo heater, how much fuel a year does a 4.5 percent target save on LHV?' and options = '["5214.422 GJ", "2782.362 GJ", "6742.370 GJ", "8337.934 GJ"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The 4.5 row prints target efficiency 86.9933, fuelSavingPercent 0.6786 and annualEnergySavedGJ 2782.362. 5214.422 is the 3.5 row, 6742.370 the 2.8 row and 8337.934 the 2.0 row, all against 410000 GJ a year (invented).' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 18;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate final ord 18'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate final ord 18 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'In the course''s sweep for the invented Isiokpo heater, how much fuel a year does a 4.5 percent target save on LHV?', options = '["5214.422 GJ", "2782.362 GJ", "6742.370 GJ", "8337.934 GJ"]'::jsonb, explanation = 'The 4.5 row prints target efficiency 86.9933, fuelSavingPercent 0.6786 and annualEnergySavedGJ 2782.362. 5214.422 is the 3.5 row, 6742.370 the 2.8 row and 8337.934 the 2.0 row, all against 410000 GJ a year (invented).'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 18;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate final ord 18 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 20
  select case
           when prompt = 'What does the second sentence of the engine''s tuning method say subtracting the efficiency percentages does to the saving?' and options = '["It overstates the saving.", "It leaves the saving on LHV unchanged.", "It doubles the saving on HHV alone.", "It understates the saving."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The second sentence ends on the word understates, and names the cause: a divisor of a hundred where the target efficiency belongs. On the Isiokpo figures the digest''s shortcut lands 819.363 GJ a year short.' then 'old'
           when prompt = 'What does the second sentence of the engine''s tuning method say subtracting the efficiency percentages does to the saving?' and options = '["It overstates the saving.", "It leaves the saving on LHV unchanged.", "It doubles the saving on HHV alone.", "It understates the saving."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The second sentence ends on the word understates, and names the cause: a divisor of a hundred where the target efficiency belongs. On the Isiokpo figures the course''s shortcut lands 819.363 GJ a year short.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 20;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate final ord 20'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate final ord 20 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does the second sentence of the engine''s tuning method say subtracting the efficiency percentages does to the saving?', options = '["It overstates the saving.", "It leaves the saving on LHV unchanged.", "It doubles the saving on HHV alone.", "It understates the saving."]'::jsonb, explanation = 'The second sentence ends on the word understates, and names the cause: a divisor of a hundred where the target efficiency belongs. On the Isiokpo figures the course''s shortcut lands 819.363 GJ a year short.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 20;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate final ord 20 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 22
  select case
           when prompt = 'The invented Isiokpo trap is called with no downstream pressure at all. Where does SECTION 15 say it is taken to discharge?' and options = '["At 5 bar a downstream, still choked.", "At its critical ratio, 0.5774 of 9 bar a.", "To atmosphere, ATMOSPHERE_BAR_A, 1.01325 bar a.", "Nowhere: the call is refused as blank."]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 15: with no downstream pressure given the trap vents to ATMOSPHERE_BAR_A, 1.01325 bar a. A downstream box present but blank is refused; a box left out takes the atmosphere default.' then 'old'
           when prompt = 'The invented Isiokpo trap is called with no downstream pressure at all. Where does the course say it is taken to discharge?' and options = '["At 5 bar a downstream, still choked.", "At its critical ratio, 0.5774 of 9 bar a.", "To atmosphere, ATMOSPHERE_BAR_A, 1.01325 bar a.", "Nowhere: the call is refused as blank."]'::jsonb and answer_index = 2 and explanation is not distinct from 'In the course, with no downstream pressure given the trap vents to ATMOSPHERE_BAR_A, 1.01325 bar a. A downstream box present but blank is refused; a box left out takes the atmosphere default.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 22;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate final ord 22'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate final ord 22 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The invented Isiokpo trap is called with no downstream pressure at all. Where does the course say it is taken to discharge?', options = '["At 5 bar a downstream, still choked.", "At its critical ratio, 0.5774 of 9 bar a.", "To atmosphere, ATMOSPHERE_BAR_A, 1.01325 bar a.", "Nowhere: the call is refused as blank."]'::jsonb, explanation = 'In the course, with no downstream pressure given the trap vents to ATMOSPHERE_BAR_A, 1.01325 bar a. A downstream box present but blank is refused; a box left out takes the atmosphere default.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 22;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate final ord 22 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 24
  select case
           when prompt = 'SECTION 15 states the critical pressure ratio at or below which a trap''s flow is choked. Which expression is it?' and options = '["(2/(k+1))^((k-1)/k)", "(2/(k-1))^(k/(k+1))", "(1/(k+1))^(k/(k-1))", "(2/(k+1))^(k/(k-1))"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 15: the flow is choked while the downstream pressure over the upstream is at or below the critical ratio (2/(k+1))^(k/(k-1)). The digest prints it as 0.577430 at k = 1.135 and 0.5457 at 1.3.' then 'old'
           when prompt = 'The course states the critical pressure ratio at or below which a trap''s flow is choked. Which expression is it?' and options = '["(2/(k+1))^((k-1)/k)", "(2/(k-1))^(k/(k+1))", "(1/(k+1))^(k/(k-1))", "(2/(k+1))^(k/(k-1))"]'::jsonb and answer_index = 3 and explanation is not distinct from 'In the course, the flow is choked while the downstream pressure over the upstream is at or below the critical ratio (2/(k+1))^(k/(k-1)). The course prints it as 0.577430 at k = 1.135 and 0.5457 at 1.3.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 24;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate final ord 24'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate final ord 24 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course states the critical pressure ratio at or below which a trap''s flow is choked. Which expression is it?', options = '["(2/(k+1))^((k-1)/k)", "(2/(k-1))^(k/(k+1))", "(1/(k+1))^(k/(k-1))", "(2/(k+1))^(k/(k-1))"]'::jsonb, explanation = 'In the course, the flow is choked while the downstream pressure over the upstream is at or below the critical ratio (2/(k+1))^(k/(k-1)). The course prints it as 0.577430 at k = 1.135 and 0.5457 at 1.3.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 24;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate final ord 24 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 25
  select case
           when prompt = 'The trap''s discharge coefficient is not given. Which answer does the engine give?' and options = '["REFUSED: A discharge coefficient in (0, 1] is required and is not defaulted: it depends on the orifice and on how the trap failed.", "No refusal: the coefficient is taken at the record''s 0.72, the Isiokpo trap''s typed figure, and the loss prints at 42.3520 kg an hour as before.", "REFUSED: An orifice diameter, an upstream pressure and a steam density are required.", "No refusal: the coefficient is read as 1, and the fuel and carbon are marked as absent."]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 15 prints the blank discharge coefficient refused with that sentence. 0.72 is the Isiokpo trap''s typed coefficient (invented). The orifice refusal answers a blank orifice.' then 'old'
           when prompt = 'The trap''s discharge coefficient is not given. Which answer does the engine give?' and options = '["REFUSED: A discharge coefficient in (0, 1] is required and is not defaulted: it depends on the orifice and on how the trap failed.", "No refusal: the coefficient is taken at the record''s 0.72, the Isiokpo trap''s typed figure, and the loss prints at 42.3520 kg an hour as before.", "REFUSED: An orifice diameter, an upstream pressure and a steam density are required.", "No refusal: the coefficient is read as 1, and the fuel and carbon are marked as absent."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course prints the blank discharge coefficient refused with that sentence. 0.72 is the Isiokpo trap''s typed coefficient (invented). The orifice refusal answers a blank orifice.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 25;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate final ord 25'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate final ord 25 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The trap''s discharge coefficient is not given. Which answer does the engine give?', options = '["REFUSED: A discharge coefficient in (0, 1] is required and is not defaulted: it depends on the orifice and on how the trap failed.", "No refusal: the coefficient is taken at the record''s 0.72, the Isiokpo trap''s typed figure, and the loss prints at 42.3520 kg an hour as before.", "REFUSED: An orifice diameter, an upstream pressure and a steam density are required.", "No refusal: the coefficient is read as 1, and the fuel and carbon are marked as absent."]'::jsonb, explanation = 'The course prints the blank discharge coefficient refused with that sentence. 0.72 is the Isiokpo trap''s typed coefficient (invented). The orifice refusal answers a blank orifice.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 25;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate final ord 25 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 26
  select case
           when prompt = 'At the stated exponent of 1.135 and an invented 22 USD a tonne, what annual cost does SECTION 15 print for the trap''s lost steam?' and options = '["8216.58 USD", "22176.00 USD", "7826.65 USD", "54432.00 USD"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The 1.135 row prints 355.757 tonnes a year and 7826.65 USD. 8216.58 is the 1.3 row, and 22176.00 and 54432.00 are SECTION 16''s raw water and treatment lines.' then 'old'
           when prompt = 'At the stated exponent of 1.135 and an invented 22 USD a tonne, what annual cost does the course print for the trap''s lost steam?' and options = '["8216.58 USD", "22176.00 USD", "7826.65 USD", "54432.00 USD"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The 1.135 row prints 355.757 tonnes a year and 7826.65 USD. 8216.58 is the 1.3 row, and 22176.00 and 54432.00 are the condensate case''s raw water and treatment lines.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 26;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate final ord 26'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate final ord 26 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'At the stated exponent of 1.135 and an invented 22 USD a tonne, what annual cost does the course print for the trap''s lost steam?', options = '["8216.58 USD", "22176.00 USD", "7826.65 USD", "54432.00 USD"]'::jsonb, explanation = 'The 1.135 row prints 355.757 tonnes a year and 7826.65 USD. 8216.58 is the 1.3 row, and 22176.00 and 54432.00 are the condensate case''s raw water and treatment lines.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 26;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate final ord 26 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 27
  select case
           when prompt = 'SECTION 15 prints the trap''s carbon chain as relations. How is its 63.721 tCO2e a year formed?' and options = '["355.757 t x 56.1 kg CO2e per GJ / 1000", "1135.851 GJ x 56.1 kg CO2e per GJ / 1000", "1135.851 GJ x 56.1 x 0.83 / 1000", "1192.439 GJ x 56.1 kg CO2e per GJ / 1000"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 15: annual tCO2e = GJ x kg per GJ / 1000 = 63.721, on the annual fuel 1135.851 GJ and the SYNTHETIC 56.1 kg CO2e per GJ. The boiler efficiency 0.83 enters one step earlier, in the fuel. 1192.439 GJ is the fuel of the 1.3 row.' then 'old'
           when prompt = 'The course prints the trap''s carbon chain as relations. How is its 63.721 tCO2e a year formed?' and options = '["355.757 t x 56.1 kg CO2e per GJ / 1000", "1135.851 GJ x 56.1 kg CO2e per GJ / 1000", "1135.851 GJ x 56.1 x 0.83 / 1000", "1192.439 GJ x 56.1 kg CO2e per GJ / 1000"]'::jsonb and answer_index = 1 and explanation is not distinct from 'In the course, annual tCO2e = GJ x kg per GJ / 1000 = 63.721, on the annual fuel 1135.851 GJ and the SYNTHETIC 56.1 kg CO2e per GJ. The boiler efficiency 0.83 enters one step earlier, in the fuel. 1192.439 GJ is the fuel of the 1.3 row.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 27;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate final ord 27'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate final ord 27 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course prints the trap''s carbon chain as relations. How is its 63.721 tCO2e a year formed?', options = '["355.757 t x 56.1 kg CO2e per GJ / 1000", "1135.851 GJ x 56.1 kg CO2e per GJ / 1000", "1135.851 GJ x 56.1 x 0.83 / 1000", "1192.439 GJ x 56.1 kg CO2e per GJ / 1000"]'::jsonb, explanation = 'In the course, annual tCO2e = GJ x kg per GJ / 1000 = 63.721, on the annual fuel 1135.851 GJ and the SYNTHETIC 56.1 kg CO2e per GJ. The boiler efficiency 0.83 enters one step earlier, in the fuel. 1192.439 GJ is the fuel of the 1.3 row.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 27;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate final ord 27 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 28
  select case
           when prompt = 'Switch the trap''s steam to superheated, exponent 1.3. What carbon a year does SECTION 15 then print, in tCO2e?' and options = '["63.721", "56.1", "742.220", "66.896"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The 1.3 row prints 44.4620 kg an hour, 373.481 tonnes a year, 8216.58 USD, 1192.439 GJ and 66.896 tCO2e. 63.721 is the 1.135 row, 56.1 the SYNTHETIC kg CO2e per GJ, and 742.220 the condensate case.' then 'old'
           when prompt = 'Switch the trap''s steam to superheated, exponent 1.3. What carbon a year does the course then print, in tCO2e?' and options = '["63.721", "56.1", "742.220", "66.896"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The 1.3 row prints 44.4620 kg an hour, 373.481 tonnes a year, 8216.58 USD, 1192.439 GJ and 66.896 tCO2e. 63.721 is the 1.135 row, 56.1 the SYNTHETIC kg CO2e per GJ, and 742.220 the condensate case.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 28;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate final ord 28'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate final ord 28 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Switch the trap''s steam to superheated, exponent 1.3. What carbon a year does the course then print, in tCO2e?', options = '["63.721", "56.1", "742.220", "66.896"]'::jsonb, explanation = 'The 1.3 row prints 44.4620 kg an hour, 373.481 tonnes a year, 8216.58 USD, 1192.439 GJ and 66.896 tCO2e. 63.721 is the 1.135 row, 56.1 the SYNTHETIC kg CO2e per GJ, and 742.220 the condensate case.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 28;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate final ord 28 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 29
  select case
           when prompt = 'What does SECTION 15 compute from the engine''s figures for the gap between the 1.3 and 1.135 exponent rows of the trap?' and options = '["17.724 tonnes a year less at 1.3, a ratio of 1.049821", "1.049821 tonnes a year more at 1.3, a ratio of 17.724", "17.724 tonnes a year more at 1.3, a ratio of 1.049821", "355.757 tonnes a year more at 1.3, a ratio of 0.5457"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 15: at the superheated exponent the same trap loses 17.724 tonnes a year more, a ratio of 1.049821 to the saturated figure (computed here). 373.481 against 355.757 tonnes a year.' then 'old'
           when prompt = 'What does the course compute from the engine''s figures for the gap between the 1.3 and 1.135 exponent rows of the trap?' and options = '["17.724 tonnes a year less at 1.3, a ratio of 1.049821", "1.049821 tonnes a year more at 1.3, a ratio of 17.724", "17.724 tonnes a year more at 1.3, a ratio of 1.049821", "355.757 tonnes a year more at 1.3, a ratio of 0.5457"]'::jsonb and answer_index = 2 and explanation is not distinct from 'In the course, at the superheated exponent the same trap loses 17.724 tonnes a year more, a ratio of 1.049821 to the saturated figure (computed here). 373.481 against 355.757 tonnes a year.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 29;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate final ord 29'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate final ord 29 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does the course compute from the engine''s figures for the gap between the 1.3 and 1.135 exponent rows of the trap?', options = '["17.724 tonnes a year less at 1.3, a ratio of 1.049821", "1.049821 tonnes a year more at 1.3, a ratio of 17.724", "17.724 tonnes a year more at 1.3, a ratio of 1.049821", "355.757 tonnes a year more at 1.3, a ratio of 0.5457"]'::jsonb, explanation = 'In the course, at the superheated exponent the same trap loses 17.724 tonnes a year more, a ratio of 1.049821 to the saturated figure (computed here). 373.481 against 355.757 tonnes a year.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 29;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate final ord 29 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 30
  select case
           when prompt = 'The choked-flow note for the invented Isiokpo trap names a pressure ratio of 0.1126. Which call is that ratio from?' and options = '["The call at 3 bar a downstream", "The critical ratio at the saturated exponent", "The call with no downstream pressure given", "The call at 8 bar a downstream"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The trap''s record gives no downstream pressure, and with none given SECTION 15 takes it to vent to atmosphere, 1.01325 bar a; the choked-flow note printed for it names 0.1126. The downstream table prints 3 bar a at 0.333333 and 8 bar a at 0.888889, and the same note names the critical 0.5774 at 1.135.' then 'old'
           when prompt = 'The choked-flow note for the invented Isiokpo trap names a pressure ratio of 0.1126. Which call is that ratio from?' and options = '["The call at 3 bar a downstream", "The critical ratio at the saturated exponent", "The call with no downstream pressure given", "The call at 8 bar a downstream"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The trap''s record gives no downstream pressure, and with none given the course takes it to vent to atmosphere, 1.01325 bar a; the choked-flow note printed for it names 0.1126. The downstream table prints 3 bar a at 0.333333 and 8 bar a at 0.888889, and the same note names the critical 0.5774 at 1.135.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 30;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate final ord 30'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate final ord 30 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The choked-flow note for the invented Isiokpo trap names a pressure ratio of 0.1126. Which call is that ratio from?', options = '["The call at 3 bar a downstream", "The critical ratio at the saturated exponent", "The call with no downstream pressure given", "The call at 8 bar a downstream"]'::jsonb, explanation = 'The trap''s record gives no downstream pressure, and with none given the course takes it to vent to atmosphere, 1.01325 bar a; the choked-flow note printed for it names 0.1126. The downstream table prints 3 bar a at 0.333333 and 8 bar a at 0.888889, and the same note names the critical 0.5774 at 1.135.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 30;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate final ord 30 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 31
  select case
           when prompt = 'Someone types 9000 into the trap''s hours box. Which answer comes back?' and options = '["No refusal: the hours are cut to 8784 and the loss is printed for a full year of service.", "REFUSED: Hours in service a year are required, between 0 and 8784. A blank is not read as a full year.", "No refusal: the stated default of 8760 hours is used, and the loss is 371.004 tonnes a year.", "REFUSED: An isentropic exponent above 1 is required: about 1.3 for superheated steam and about 1.135 for dry saturated steam."]'::jsonb and answer_index = 1 and explanation is not distinct from '9000 is above the 8784 bound the refusal states, and the digest prints it refused in the blank''s words. Only hours left out of the call entirely reach the 8760 default.' then 'old'
           when prompt = 'Someone types 9000 into the trap''s hours box. Which answer comes back?' and options = '["No refusal: the hours are cut to 8784 and the loss is printed for a full year of service.", "REFUSED: Hours in service a year are required, between 0 and 8784. A blank is not read as a full year.", "No refusal: the stated default of 8760 hours is used, and the loss is 371.004 tonnes a year.", "REFUSED: An isentropic exponent above 1 is required: about 1.3 for superheated steam and about 1.135 for dry saturated steam."]'::jsonb and answer_index = 1 and explanation is not distinct from '9000 is above the 8784 bound the refusal states, and the course prints it refused in the blank''s words. Only hours left out of the call entirely reach the 8760 default.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 31;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate final ord 31'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate final ord 31 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Someone types 9000 into the trap''s hours box. Which answer comes back?', options = '["No refusal: the hours are cut to 8784 and the loss is printed for a full year of service.", "REFUSED: Hours in service a year are required, between 0 and 8784. A blank is not read as a full year.", "No refusal: the stated default of 8760 hours is used, and the loss is 371.004 tonnes a year.", "REFUSED: An isentropic exponent above 1 is required: about 1.3 for superheated steam and about 1.135 for dry saturated steam."]'::jsonb, explanation = '9000 is above the 8784 bound the refusal states, and the course prints it refused in the blank''s words. Only hours left out of the call entirely reach the 8760 default.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 31;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate final ord 31 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 32
  select case
           when prompt = 'With the treatment cost priced on the invented Isiokpo condensate case, which line does SECTION 16 print as 54432.00 USD?' and options = '["Raw water not bought", "Fuel not burned reheating makeup", "The trap''s annual steam cost", "Treatment not repeated"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 16 prints Fuel not burned reheating makeup 99227.28, Raw water not bought 22176.00 and Treatment not repeated 54432.00 USD. The trap''s cost, 7826.65 USD, is SECTION 15.' then 'old'
           when prompt = 'With the treatment cost priced on the invented Isiokpo condensate case, which line does the course print as 54432.00 USD?' and options = '["Raw water not bought", "Fuel not burned reheating makeup", "The trap''s annual steam cost", "Treatment not repeated"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course prints Fuel not burned reheating makeup 99227.28, Raw water not bought 22176.00 and Treatment not repeated 54432.00 USD. The trap''s cost, 7826.65 USD, is the steam trap lesson''s.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 32;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate final ord 32'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate final ord 32 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'With the treatment cost priced on the invented Isiokpo condensate case, which line does the course print as 54432.00 USD?', options = '["Raw water not bought", "Fuel not burned reheating makeup", "The trap''s annual steam cost", "Treatment not repeated"]'::jsonb, explanation = 'The course prints Fuel not burned reheating makeup 99227.28, Raw water not bought 22176.00 and Treatment not repeated 54432.00 USD. The trap''s cost, 7826.65 USD, is the steam trap lesson''s.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 32;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate final ord 32 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 33
  select case
           when prompt = 'A return fraction of 1.2 is typed as the target of the invented condensate case. Which answer comes back?' and options = '["REFUSED: Return fractions must lie between 0 and 1.", "REFUSED: The target return (0.25) is below the current return (0.35). Returning less condensate is a cost, so there is nothing to value.", "No refusal: the return is capped at 1 and complete prints true.", "REFUSED: A boiler efficiency in (0, 1] is required: the fuel saved depends on it and it is not assumed."]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 16 prints the target of 1.2 refused with "Return fractions must lie between 0 and 1." The target-below-current refusal answers a target of 0.25 against 0.35, and the boiler efficiency refusal a blank boiler efficiency.' then 'old'
           when prompt = 'A return fraction of 1.2 is typed as the target of the invented condensate case. Which answer comes back?' and options = '["REFUSED: Return fractions must lie between 0 and 1.", "REFUSED: The target return (0.25) is below the current return (0.35). Returning less condensate is a cost, so there is nothing to value.", "No refusal: the return is capped at 1 and complete prints true.", "REFUSED: A boiler efficiency in (0, 1] is required: the fuel saved depends on it and it is not assumed."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course prints the target of 1.2 refused with "Return fractions must lie between 0 and 1." The target-below-current refusal answers a target of 0.25 against 0.35, and the boiler efficiency refusal a blank boiler efficiency.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 33;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate final ord 33'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate final ord 33 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A return fraction of 1.2 is typed as the target of the invented condensate case. Which answer comes back?', options = '["REFUSED: Return fractions must lie between 0 and 1.", "REFUSED: The target return (0.25) is below the current return (0.35). Returning less condensate is a cost, so there is nothing to value.", "No refusal: the return is capped at 1 and complete prints true.", "REFUSED: A boiler efficiency in (0, 1] is required: the fuel saved depends on it and it is not assumed."]'::jsonb, explanation = 'The course prints the target of 1.2 refused with "Return fractions must lie between 0 and 1." The target-below-current refusal answers a target of 0.25 against 0.35, and the boiler efficiency refusal a blank boiler efficiency.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 33;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate final ord 33 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 34
  select case
           when prompt = 'pinchTargets is handed streams whose supply and target temperatures are all equal. What does SECTION 17 print?' and options = '["No refusal: both utilities print 0.000 kW and threshold problem prints true.", "REFUSED: A minimum approach temperature is required and must not be negative.", "REFUSED: No stream changes temperature, so there is nothing to target.", "No refusal: every stream is read as cold, and the cold utility is 0.000 kW."]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 17 prints that refusal for a set of streams where nothing changes temperature. The minimum approach refusal answers a blank approach.' then 'old'
           when prompt = 'pinchTargets is handed streams whose supply and target temperatures are all equal. What does the course print?' and options = '["No refusal: both utilities print 0.000 kW and threshold problem prints true.", "REFUSED: A minimum approach temperature is required and must not be negative.", "REFUSED: No stream changes temperature, so there is nothing to target.", "No refusal: every stream is read as cold, and the cold utility is 0.000 kW."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course prints that refusal for a set of streams where nothing changes temperature. The minimum approach refusal answers a blank approach.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 34;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate final ord 34'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate final ord 34 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'pinchTargets is handed streams whose supply and target temperatures are all equal. What does the course print?', options = '["No refusal: both utilities print 0.000 kW and threshold problem prints true.", "REFUSED: A minimum approach temperature is required and must not be negative.", "REFUSED: No stream changes temperature, so there is nothing to target.", "No refusal: every stream is read as cold, and the cold utility is 0.000 kW."]'::jsonb, explanation = 'The course prints that refusal for a set of streams where nothing changes temperature. The minimum approach refusal answers a blank approach.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 34;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate final ord 34 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 35
  select case
           when prompt = 'Which pair of condensate figures does SECTION 16 print the same with the treatment cost priced and with it left blank?' and options = '["40320.000 t of extra condensate and 13230.304 GJ saved a year", "175835.28 USD annualValue and complete true in both columns", "54432.00 USD of treatment and 742.220 tCO2e in both columns", "121403.28 USD annualValue and 13230.304 GJ saved a year"]'::jsonb and answer_index = 0 and explanation is not distinct from 'Both columns print extraCondensateTonnesPerYear 40320.000 and energySavedGJPerYear 13230.304, and annualTonnesCo2e 742.220. Treatment not repeated is 54432.00 priced and none blank, and annualValue is 175835.28 against 121403.28, complete true against false.' then 'old'
           when prompt = 'Which pair of condensate figures does the course print the same with the treatment cost priced and with it left blank?' and options = '["40320.000 t of extra condensate and 13230.304 GJ saved a year", "175835.28 USD annualValue and complete true in both columns", "54432.00 USD of treatment and 742.220 tCO2e in both columns", "121403.28 USD annualValue and 13230.304 GJ saved a year"]'::jsonb and answer_index = 0 and explanation is not distinct from 'Both columns print extraCondensateTonnesPerYear 40320.000 and energySavedGJPerYear 13230.304, and annualTonnesCo2e 742.220. Treatment not repeated is 54432.00 priced and none blank, and annualValue is 175835.28 against 121403.28, complete true against false.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 35;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate final ord 35'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate final ord 35 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which pair of condensate figures does the course print the same with the treatment cost priced and with it left blank?', options = '["40320.000 t of extra condensate and 13230.304 GJ saved a year", "175835.28 USD annualValue and complete true in both columns", "54432.00 USD of treatment and 742.220 tCO2e in both columns", "121403.28 USD annualValue and 13230.304 GJ saved a year"]'::jsonb, explanation = 'Both columns print extraCondensateTonnesPerYear 40320.000 and energySavedGJPerYear 13230.304, and annualTonnesCo2e 742.220. Treatment not repeated is 54432.00 priced and none blank, and annualValue is 175835.28 against 121403.28, complete true against false.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 35;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate final ord 35 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 36
  select case
           when prompt = 'Four invented Isiokpo streams are printed in SECTION 17. Which one is cold, by the digest''s rule?' and options = '["H2 lean oil cooler, 118 C to 41 C: its supply is above its target.", "C2 stabiliser feed, 57 C to 104 C: its supply is below its target.", "H1 compressor aftercooler, 163 C to 48 C: its CP is 3.15 kW/K.", "H2 lean oil cooler, 118 C to 41 C: its CP is 5.7 kW/K."]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 17: a stream is hot when its supply is above its target. C2 goes from 57 to 104 C, so it is cold, as C1 is. H1 and H2 have supplies above their targets and are hot, whatever their CP.' then 'old'
           when prompt = 'Four invented Isiokpo streams are printed in the pinch lesson. Which one is cold, by the course''s rule?' and options = '["H2 lean oil cooler, 118 C to 41 C: its supply is above its target.", "C2 stabiliser feed, 57 C to 104 C: its supply is below its target.", "H1 compressor aftercooler, 163 C to 48 C: its CP is 3.15 kW/K.", "H2 lean oil cooler, 118 C to 41 C: its CP is 5.7 kW/K."]'::jsonb and answer_index = 1 and explanation is not distinct from 'In the course, a stream is hot when its supply is above its target. C2 goes from 57 to 104 C, so it is cold, as C1 is. H1 and H2 have supplies above their targets and are hot, whatever their CP.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 36;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate final ord 36'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate final ord 36 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Four invented Isiokpo streams are printed in the pinch lesson. Which one is cold, by the course''s rule?', options = '["H2 lean oil cooler, 118 C to 41 C: its supply is above its target.", "C2 stabiliser feed, 57 C to 104 C: its supply is below its target.", "H1 compressor aftercooler, 163 C to 48 C: its CP is 3.15 kW/K.", "H2 lean oil cooler, 118 C to 41 C: its CP is 5.7 kW/K."]'::jsonb, explanation = 'In the course, a stream is hot when its supply is above its target. C2 goes from 57 to 104 C, so it is cold, as C1 is. H1 and H2 have supplies above their targets and are hot, whatever their CP.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 36;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate final ord 36 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 37
  select case
           when prompt = 'In the SECTION 17 problem table at 15 C for the invented Isiokpo streams, what surplus does the interval from shifted 148.500 C to 111.500 C carry?' and options = '["22.050 kW", "-3.600 kW", "96.600 kW", "-44.400 kW"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The row prints CP hot 3.150000, CP cold 4.350000, surplus -44.400 and heat flow below 3.600. 22.050 is the interval above it, -3.600 the interval below, and 96.600 the interval from 110.500 to 64.500.' then 'old'
           when prompt = 'In the course''s problem table at 15 C for the invented Isiokpo streams, what surplus does the interval from shifted 148.500 C to 111.500 C carry?' and options = '["22.050 kW", "-3.600 kW", "96.600 kW", "-44.400 kW"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The row prints CP hot 3.150000, CP cold 4.350000, surplus -44.400 and heat flow below 3.600. 22.050 is the interval above it, -3.600 the interval below, and 96.600 the interval from 110.500 to 64.500.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 37;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate final ord 37'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate final ord 37 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'In the course''s problem table at 15 C for the invented Isiokpo streams, what surplus does the interval from shifted 148.500 C to 111.500 C carry?', options = '["22.050 kW", "-3.600 kW", "96.600 kW", "-44.400 kW"]'::jsonb, explanation = 'The row prints CP hot 3.150000, CP cold 4.350000, surplus -44.400 and heat flow below 3.600. 22.050 is the interval above it, -3.600 the interval below, and 96.600 the interval from 110.500 to 64.500.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 37;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate final ord 37 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 39
  select case
           when prompt = 'A stream with a heat capacity flowrate of -2 is passed to pinchTargets. What does SECTION 17 print?' and options = '["No refusal: a CP of -2 marks the stream as cold, and it is cascaded at 2 kW/K on the cold side of the table.", "REFUSED: A minimum approach temperature is required and must not be negative.", "REFUSED: A heat capacity flowrate cannot be negative. Whether a stream is hot or cold is set by its supply and target temperatures.", "REFUSED: No stream changes temperature, so there is nothing to target."]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 17 prints the CP of -2 refused with that sentence, and SECTION 25 lists it among the rules in force. The approach refusal answers a blank minimum approach, and the last refusal a set of streams that never change temperature.' then 'old'
           when prompt = 'A stream with a heat capacity flowrate of -2 is passed to pinchTargets. What does the course print?' and options = '["No refusal: a CP of -2 marks the stream as cold, and it is cascaded at 2 kW/K on the cold side of the table.", "REFUSED: A minimum approach temperature is required and must not be negative.", "REFUSED: A heat capacity flowrate cannot be negative. Whether a stream is hot or cold is set by its supply and target temperatures.", "REFUSED: No stream changes temperature, so there is nothing to target."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course prints the CP of -2 refused with that sentence, and lists it among the rules in force. The approach refusal answers a blank minimum approach, and the last refusal a set of streams that never change temperature.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 39;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate final ord 39'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate final ord 39 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A stream with a heat capacity flowrate of -2 is passed to pinchTargets. What does the course print?', options = '["No refusal: a CP of -2 marks the stream as cold, and it is cascaded at 2 kW/K on the cold side of the table.", "REFUSED: A minimum approach temperature is required and must not be negative.", "REFUSED: A heat capacity flowrate cannot be negative. Whether a stream is hot or cold is set by its supply and target temperatures.", "REFUSED: No stream changes temperature, so there is nothing to target."]'::jsonb, explanation = 'The course prints the CP of -2 refused with that sentence, and lists it among the rules in force. The approach refusal answers a blank minimum approach, and the last refusal a set of streams that never change temperature.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 39;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate final ord 39 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 40
  select case
           when prompt = 'SECTION 17''s threshold problem runs one hot and one cold stream at a 10 C minimum approach. What cold utility does it print?' and options = '["1480.000 kW", "1470.000 kW", "1300.000 kW", "240.150 kW"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The threshold row prints hot utility 0.000, cold utility 1470.000, pinch hot none and threshold problem true. 1480.000 and 1300.000 are points on its heat flow table, and 240.150 kW is the Isiokpo cold utility at 15 C.' then 'old'
           when prompt = 'The course''s threshold problem runs one hot and one cold stream at a 10 C minimum approach. What cold utility does it print?' and options = '["1480.000 kW", "1470.000 kW", "1300.000 kW", "240.150 kW"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The threshold row prints hot utility 0.000, cold utility 1470.000, pinch hot none and threshold problem true. 1480.000 and 1300.000 are points on its heat flow table, and 240.150 kW is the Isiokpo cold utility at 15 C.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 40;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate final ord 40'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate final ord 40 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course''s threshold problem runs one hot and one cold stream at a 10 C minimum approach. What cold utility does it print?', options = '["1480.000 kW", "1470.000 kW", "1300.000 kW", "240.150 kW"]'::jsonb, explanation = 'The threshold row prints hot utility 0.000, cold utility 1470.000, pinch hot none and threshold problem true. 1480.000 and 1300.000 are points on its heat flow table, and 240.150 kW is the Isiokpo cold utility at 15 C.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 40;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate final ord 40 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate final ord 41
  select case
           when prompt = 'How does SECTION 17 say the streams are shifted before the problem table is cascaded?' and options = '["Hot streams up and cold streams down, by half the minimum approach.", "Hot streams down and cold streams up, by the whole minimum approach.", "Cold streams down by the whole minimum approach, hot streams unmoved.", "Hot streams down and cold streams up, by half the minimum approach."]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 17: hot streams are shifted down and cold streams up by half the minimum approach; the cascade below already carries the hot utility at the top. At 15 C the heat flow is zero at shifted 110.500 C, reported as 118.000 C hot and 103.000 C cold.' then 'old'
           when prompt = 'How does the course say the streams are shifted before the problem table is cascaded?' and options = '["Hot streams up and cold streams down, by half the minimum approach.", "Hot streams down and cold streams up, by the whole minimum approach.", "Cold streams down by the whole minimum approach, hot streams unmoved.", "Hot streams down and cold streams up, by half the minimum approach."]'::jsonb and answer_index = 3 and explanation is not distinct from 'In the course, hot streams are shifted down and cold streams up by half the minimum approach; the cascade below already carries the hot utility at the top. At 15 C the heat flow is zero at shifted 110.500 C, reported as 118.000 C hot and 103.000 C cold.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 41;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate final ord 41'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate final ord 41 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'How does the course say the streams are shifted before the problem table is cascaded?', options = '["Hot streams up and cold streams down, by half the minimum approach.", "Hot streams down and cold streams up, by the whole minimum approach.", "Cold streams down by the whole minimum approach, hot streams unmoved.", "Hot streams down and cold streams up, by half the minimum approach."]'::jsonb, explanation = 'In the course, hot streams are shifted down and cold streams up by half the minimum approach; the cascade below already carries the hot utility at the top. At 15 C the heat flow is zero at shifted 110.500 C, reported as 118.000 C hot and 103.000 C cold.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'final' and module_key is not distinct from null and ord = 41;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate final ord 41 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m01-combustion-from-the-fuel-analysis ord 1
  select case
           when prompt = 'SECTION 11 states the oxygen demand of each component of the invented Isiokpo fuel gas. Which rule does it print?' and options = '["c + h/2 + s - o/2, weighted by the component''s mole fraction.", "c + h/4 + s - o/2, weighted by the component''s mole fraction.", "c + h/4 + s + o/2, weighted by the component''s molar mass.", "2c + h/4 + s - o, weighted by the component''s typical LHV."]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 11: the oxygen demand is c + h/4 + s - o/2 for each component, weighted by its mole fraction, with the letters read off the FUEL_REFERENCE atom counts. The weighted sum is o2PerKmolFuel, 2.089500 kmol O2 per kmol fuel.' then 'old'
           when prompt = 'The course states the oxygen demand of each component of the invented Isiokpo fuel gas. Which rule does it print?' and options = '["c + h/2 + s - o/2, weighted by the component''s mole fraction.", "c + h/4 + s - o/2, weighted by the component''s mole fraction.", "c + h/4 + s + o/2, weighted by the component''s molar mass.", "2c + h/4 + s - o, weighted by the component''s typical LHV."]'::jsonb and answer_index = 1 and explanation is not distinct from 'In the course, the oxygen demand is c + h/4 + s - o/2 for each component, weighted by its mole fraction, with the letters read off the FUEL_REFERENCE atom counts. The weighted sum is o2PerKmolFuel, 2.089500 kmol O2 per kmol fuel.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-combustion-from-the-fuel-analysis' and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m01-combustion-from-the-fuel-analysis ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m01-combustion-from-the-fuel-analysis ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course states the oxygen demand of each component of the invented Isiokpo fuel gas. Which rule does it print?', options = '["c + h/2 + s - o/2, weighted by the component''s mole fraction.", "c + h/4 + s - o/2, weighted by the component''s mole fraction.", "c + h/4 + s + o/2, weighted by the component''s molar mass.", "2c + h/4 + s - o, weighted by the component''s typical LHV."]'::jsonb, explanation = 'In the course, the oxygen demand is c + h/4 + s - o/2 for each component, weighted by its mole fraction, with the letters read off the FUEL_REFERENCE atom counts. The weighted sum is o2PerKmolFuel, 2.089500 kmol O2 per kmol fuel.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-combustion-from-the-fuel-analysis' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m01-combustion-from-the-fuel-analysis ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m01-combustion-from-the-fuel-analysis ord 2
  select case
           when prompt = 'In the SECTION 11 oxygen demand table for the invented Isiokpo fuel gas, which weighted figure belongs to C2H6 at a mole fraction of 0.071?' and options = '["1.736000", "0.105000", "2.089500", "0.248500"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The C2H6 row prints c + h/4 + s - o/2 as 3.5 and a weighted 0.248500. 1.736000 is the CH4 row, 0.105000 the C3H8 row and 2.089500 the sum, which is the engine''s o2PerKmolFuel.' then 'old'
           when prompt = 'In the course''s oxygen demand table for the invented Isiokpo fuel gas, which weighted figure belongs to C2H6 at a mole fraction of 0.071?' and options = '["1.736000", "0.105000", "2.089500", "0.248500"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The C2H6 row prints c + h/4 + s - o/2 as 3.5 and a weighted 0.248500. 1.736000 is the CH4 row, 0.105000 the C3H8 row and 2.089500 the sum, which is the engine''s o2PerKmolFuel.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-combustion-from-the-fuel-analysis' and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m01-combustion-from-the-fuel-analysis ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m01-combustion-from-the-fuel-analysis ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'In the course''s oxygen demand table for the invented Isiokpo fuel gas, which weighted figure belongs to C2H6 at a mole fraction of 0.071?', options = '["1.736000", "0.105000", "2.089500", "0.248500"]'::jsonb, explanation = 'The C2H6 row prints c + h/4 + s - o/2 as 3.5 and a weighted 0.248500. 1.736000 is the CH4 row, 0.105000 the C3H8 row and 2.089500 the sum, which is the engine''s o2PerKmolFuel.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-combustion-from-the-fuel-analysis' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m01-combustion-from-the-fuel-analysis ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m01-combustion-from-the-fuel-analysis ord 3
  select case
           when prompt = 'SECTION 11 prints a row by row oxygen demand for the invented Isiokpo fuel gas. Where do those per component rows come from?' and options = '["The digest computes them from the FUEL_REFERENCE atom counts; the engine returns only the weighted total.", "combustionStoichiometry returns one weighted row per component; the digest sums them.", "The oracle''s bisection returns them, and the engine checks its 2.089500 against their sum.", "They are typed into the record with the fuel gas analysis, beside each mole fraction."]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 11 labels the table "computed here from the FUEL_REFERENCE atom counts; the engine returns only the weighted total". The weighted total is o2PerKmolFuel, 2.089500. The bisection SECTION 12 names is how the oracle finds the excess air.' then 'old'
           when prompt = 'The lesson prints a row by row oxygen demand for the invented Isiokpo fuel gas. Where do those per component rows come from?' and options = '["The course computes them from the FUEL_REFERENCE atom counts; the engine returns only the weighted total.", "combustionStoichiometry returns one weighted row per component; the course sums them.", "The oracle''s bisection returns them, and the engine checks its 2.089500 against their sum.", "They are typed into the record with the fuel gas analysis, beside each mole fraction."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course labels the table "computed here from the FUEL_REFERENCE atom counts; the engine returns only the weighted total". The weighted total is o2PerKmolFuel, 2.089500. The bisection the next lesson names is how the oracle finds the excess air.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-combustion-from-the-fuel-analysis' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m01-combustion-from-the-fuel-analysis ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m01-combustion-from-the-fuel-analysis ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The lesson prints a row by row oxygen demand for the invented Isiokpo fuel gas. Where do those per component rows come from?', options = '["The course computes them from the FUEL_REFERENCE atom counts; the engine returns only the weighted total.", "combustionStoichiometry returns one weighted row per component; the course sums them.", "The oracle''s bisection returns them, and the engine checks its 2.089500 against their sum.", "They are typed into the record with the fuel gas analysis, beside each mole fraction."]'::jsonb, explanation = 'The course labels the table "computed here from the FUEL_REFERENCE atom counts; the engine returns only the weighted total". The weighted total is o2PerKmolFuel, 2.089500. The bisection the next lesson names is how the oracle finds the excess air.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-combustion-from-the-fuel-analysis' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m01-combustion-from-the-fuel-analysis ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m01-combustion-from-the-fuel-analysis ord 4
  select case
           when prompt = 'The invented Isiokpo fuel gas prints o2PerKmolFuel 2.089500 and stoichAirPerKmolFuel 9.975652. How does SECTION 11 relate the second to the first?' and options = '["2.089500 x 28.9647, the oxygen times AIR_MOLAR_MASS, in kg of air.", "2.089500 / 31.998, the oxygen over O2_MOLAR_MASS.", "2.089500 / 0.20946, the oxygen over O2_MOLE_FRACTION_DRY_AIR.", "2.089500 x 18.5068, the oxygen times fuelMolarMassKgKmol, per kmol."]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 11: the stoichiometric air is that oxygen over O2_MOLE_FRACTION_DRY_AIR, 2.089500 / 0.20946 = 9.975652. AIR_MOLAR_MASS 28.9647 and O2_MOLAR_MASS 31.998 weigh air and oxygen; 18.5068 is fuelMolarMassKgKmol.' then 'old'
           when prompt = 'The invented Isiokpo fuel gas prints o2PerKmolFuel 2.089500 and stoichAirPerKmolFuel 9.975652. How does the course relate the second to the first?' and options = '["2.089500 x 28.9647, the oxygen times AIR_MOLAR_MASS, in kg of air.", "2.089500 / 31.998, the oxygen over O2_MOLAR_MASS.", "2.089500 / 0.20946, the oxygen over O2_MOLE_FRACTION_DRY_AIR.", "2.089500 x 18.5068, the oxygen times fuelMolarMassKgKmol, per kmol."]'::jsonb and answer_index = 2 and explanation is not distinct from 'In the course, the stoichiometric air is that oxygen over O2_MOLE_FRACTION_DRY_AIR, 2.089500 / 0.20946 = 9.975652. AIR_MOLAR_MASS 28.9647 and O2_MOLAR_MASS 31.998 weigh air and oxygen; 18.5068 is fuelMolarMassKgKmol.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-combustion-from-the-fuel-analysis' and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m01-combustion-from-the-fuel-analysis ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m01-combustion-from-the-fuel-analysis ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The invented Isiokpo fuel gas prints o2PerKmolFuel 2.089500 and stoichAirPerKmolFuel 9.975652. How does the course relate the second to the first?', options = '["2.089500 x 28.9647, the oxygen times AIR_MOLAR_MASS, in kg of air.", "2.089500 / 31.998, the oxygen over O2_MOLAR_MASS.", "2.089500 / 0.20946, the oxygen over O2_MOLE_FRACTION_DRY_AIR.", "2.089500 x 18.5068, the oxygen times fuelMolarMassKgKmol, per kmol."]'::jsonb, explanation = 'In the course, the stoichiometric air is that oxygen over O2_MOLE_FRACTION_DRY_AIR, 2.089500 / 0.20946 = 9.975652. AIR_MOLAR_MASS 28.9647 and O2_MOLAR_MASS 31.998 weigh air and oxygen; 18.5068 is fuelMolarMassKgKmol.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-combustion-from-the-fuel-analysis' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m01-combustion-from-the-fuel-analysis ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m01-combustion-from-the-fuel-analysis ord 5
  select case
           when prompt = 'Which SECTION 11 figure is the stoichiometric air for the invented Isiokpo fuel gas stated on a mass basis?' and options = '["9.975652 kmol air per kmol fuel", "15.612763 kg air per kg fuel", "18.5068 kg fuel per kmol of fuel", "7.886152 kmol N2 per kmol fuel"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 11 prints stoichAirKgPerKgFuel 15.612763 kg air per kg fuel beside stoichAirPerKmolFuel 9.975652 kmol air per kmol fuel. 18.5068 is fuelMolarMassKgKmol, and 7.886152 is products.airN2PerKmolFuel.' then 'old'
           when prompt = 'Which course figure is the stoichiometric air for the invented Isiokpo fuel gas stated on a mass basis?' and options = '["9.975652 kmol air per kmol fuel", "15.612763 kg air per kg fuel", "18.5068 kg fuel per kmol of fuel", "7.886152 kmol N2 per kmol fuel"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course prints stoichAirKgPerKgFuel 15.612763 kg air per kg fuel beside stoichAirPerKmolFuel 9.975652 kmol air per kmol fuel. 18.5068 is fuelMolarMassKgKmol, and 7.886152 is products.airN2PerKmolFuel.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-combustion-from-the-fuel-analysis' and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m01-combustion-from-the-fuel-analysis ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m01-combustion-from-the-fuel-analysis ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which course figure is the stoichiometric air for the invented Isiokpo fuel gas stated on a mass basis?', options = '["9.975652 kmol air per kmol fuel", "15.612763 kg air per kg fuel", "18.5068 kg fuel per kmol of fuel", "7.886152 kmol N2 per kmol fuel"]'::jsonb, explanation = 'The course prints stoichAirKgPerKgFuel 15.612763 kg air per kg fuel beside stoichAirPerKmolFuel 9.975652 kmol air per kmol fuel. 18.5068 is fuelMolarMassKgKmol, and 7.886152 is products.airN2PerKmolFuel.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-combustion-from-the-fuel-analysis' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m01-combustion-from-the-fuel-analysis ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m01-combustion-from-the-fuel-analysis ord 6
  select case
           when prompt = 'The invented Isiokpo fuel gas carries CO2 at a mole fraction of 0.025. Where does SECTION 11 put that 0.025 kmol in the combustion products?' and options = '["Inside products.fuelN2PerKmolFuel, beside the fuel''s nitrogen.", "Inside products.airN2PerKmolFuel, 7.886152.", "Inside products.co2PerKmolFuel, 1.098000 kmol per kmol fuel.", "Nowhere in the products: the analysis drops inerts before burning."]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 11: the CO2 in the fuel has c = 1 and o = 2, so it demands no oxygen and passes into the flue gas; the 0.025 kmol of fuel CO2 is inside products.co2PerKmolFuel above. The fuel''s nitrogen leaves as products.fuelN2PerKmolFuel 0.015000.' then 'old'
           when prompt = 'The invented Isiokpo fuel gas carries CO2 at a mole fraction of 0.025. Where does the course put that 0.025 kmol in the combustion products?' and options = '["Inside products.fuelN2PerKmolFuel, beside the fuel''s nitrogen.", "Inside products.airN2PerKmolFuel, 7.886152.", "Inside products.co2PerKmolFuel, 1.098000 kmol per kmol fuel.", "Nowhere in the products: the analysis drops inerts before burning."]'::jsonb and answer_index = 2 and explanation is not distinct from 'In the course, the CO2 in the fuel has c = 1 and o = 2, so it demands no oxygen and passes into the flue gas; the 0.025 kmol of fuel CO2 is inside products.co2PerKmolFuel above. The fuel''s nitrogen leaves as products.fuelN2PerKmolFuel 0.015000.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-combustion-from-the-fuel-analysis' and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m01-combustion-from-the-fuel-analysis ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m01-combustion-from-the-fuel-analysis ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The invented Isiokpo fuel gas carries CO2 at a mole fraction of 0.025. Where does the course put that 0.025 kmol in the combustion products?', options = '["Inside products.fuelN2PerKmolFuel, beside the fuel''s nitrogen.", "Inside products.airN2PerKmolFuel, 7.886152.", "Inside products.co2PerKmolFuel, 1.098000 kmol per kmol fuel.", "Nowhere in the products: the analysis drops inerts before burning."]'::jsonb, explanation = 'In the course, the CO2 in the fuel has c = 1 and o = 2, so it demands no oxygen and passes into the flue gas; the 0.025 kmol of fuel CO2 is inside products.co2PerKmolFuel above. The fuel''s nitrogen leaves as products.fuelN2PerKmolFuel 0.015000.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-combustion-from-the-fuel-analysis' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m01-combustion-from-the-fuel-analysis ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m01-combustion-from-the-fuel-analysis ord 7
  select case
           when prompt = 'SECTION 11 takes the CO2 out of the invented Isiokpo analysis and renormalises the rest. What does it print?' and options = '["o2PerKmolFuel 2.089500 and lhvMJPerKmolFuel 862.5564", "o2PerKmolFuel 2.143077 and lhvMJPerKmolFuel 840.9925", "o2PerKmolFuel 2.089500 and lhvMJPerKmolFuel 930.6273", "o2PerKmolFuel 2.143077 and lhvMJPerKmolFuel 862.5564"]'::jsonb and answer_index = 3 and explanation is not distinct from 'With the CO2 taken out and the rest renormalised, SECTION 11 prints o2PerKmolFuel 2.143077 and lhvMJPerKmolFuel 862.5564, and reads the pair as: the inerts dilute the fuel. The analysis as given prints 2.089500 and 840.9925; 930.6273 is its hhvMJPerKmolFuel.' then 'old'
           when prompt = 'The course takes the CO2 out of the invented Isiokpo analysis and renormalises the rest. What does it print?' and options = '["o2PerKmolFuel 2.089500 and lhvMJPerKmolFuel 862.5564", "o2PerKmolFuel 2.143077 and lhvMJPerKmolFuel 840.9925", "o2PerKmolFuel 2.089500 and lhvMJPerKmolFuel 930.6273", "o2PerKmolFuel 2.143077 and lhvMJPerKmolFuel 862.5564"]'::jsonb and answer_index = 3 and explanation is not distinct from 'With the CO2 taken out and the rest renormalised, the course prints o2PerKmolFuel 2.143077 and lhvMJPerKmolFuel 862.5564, and reads the pair as: the inerts dilute the fuel. The analysis as given prints 2.089500 and 840.9925; 930.6273 is its hhvMJPerKmolFuel.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-combustion-from-the-fuel-analysis' and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m01-combustion-from-the-fuel-analysis ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m01-combustion-from-the-fuel-analysis ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course takes the CO2 out of the invented Isiokpo analysis and renormalises the rest. What does it print?', options = '["o2PerKmolFuel 2.089500 and lhvMJPerKmolFuel 862.5564", "o2PerKmolFuel 2.143077 and lhvMJPerKmolFuel 840.9925", "o2PerKmolFuel 2.089500 and lhvMJPerKmolFuel 930.6273", "o2PerKmolFuel 2.143077 and lhvMJPerKmolFuel 862.5564"]'::jsonb, explanation = 'With the CO2 taken out and the rest renormalised, the course prints o2PerKmolFuel 2.143077 and lhvMJPerKmolFuel 862.5564, and reads the pair as: the inerts dilute the fuel. The analysis as given prints 2.089500 and 840.9925; 930.6273 is its hhvMJPerKmolFuel.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-combustion-from-the-fuel-analysis' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m01-combustion-from-the-fuel-analysis ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m01-combustion-from-the-fuel-analysis ord 8
  select case
           when prompt = 'The invented Isiokpo analysis carries N2 at 0.015. How does SECTION 11 report that nitrogen in the flue gas?' and options = '["As products.fuelN2PerKmolFuel 0.015000, carried separately from the air''s nitrogen.", "Inside products.airN2PerKmolFuel 7.886152, weighed with the air''s own nitrogen.", "As a share of products.h2oPerKmolFuel 2.033000, since it carries no carbon or sulphur.", "Not at all: the engine drops every inert row of FUEL_REFERENCE before it burns."]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 11 prints products.fuelN2PerKmolFuel 0.015000 and states that the fuel''s nitrogen is carried separately from the air''s. products.airN2PerKmolFuel 7.886152 is the air''s nitrogen and 2.033000 is the water. The inert CO2 row is kept too: it passes into products.co2PerKmolFuel.' then 'old'
           when prompt = 'The invented Isiokpo analysis carries N2 at 0.015. How does the course report that nitrogen in the flue gas?' and options = '["As products.fuelN2PerKmolFuel 0.015000, carried separately from the air''s nitrogen.", "Inside products.airN2PerKmolFuel 7.886152, weighed with the air''s own nitrogen.", "As a share of products.h2oPerKmolFuel 2.033000, since it carries no carbon or sulphur.", "Not at all: the engine drops every inert row of FUEL_REFERENCE before it burns."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course prints products.fuelN2PerKmolFuel 0.015000 and states that the fuel''s nitrogen is carried separately from the air''s. products.airN2PerKmolFuel 7.886152 is the air''s nitrogen and 2.033000 is the water. The inert CO2 row is kept too: it passes into products.co2PerKmolFuel.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-combustion-from-the-fuel-analysis' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m01-combustion-from-the-fuel-analysis ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m01-combustion-from-the-fuel-analysis ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The invented Isiokpo analysis carries N2 at 0.015. How does the course report that nitrogen in the flue gas?', options = '["As products.fuelN2PerKmolFuel 0.015000, carried separately from the air''s nitrogen.", "Inside products.airN2PerKmolFuel 7.886152, weighed with the air''s own nitrogen.", "As a share of products.h2oPerKmolFuel 2.033000, since it carries no carbon or sulphur.", "Not at all: the engine drops every inert row of FUEL_REFERENCE before it burns."]'::jsonb, explanation = 'The course prints products.fuelN2PerKmolFuel 0.015000 and states that the fuel''s nitrogen is carried separately from the air''s. products.airN2PerKmolFuel 7.886152 is the air''s nitrogen and 2.033000 is the water. The inert CO2 row is kept too: it passes into products.co2PerKmolFuel.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-combustion-from-the-fuel-analysis' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m01-combustion-from-the-fuel-analysis ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m01-combustion-from-the-fuel-analysis ord 9
  select case
           when prompt = 'energyEfficiency.ATMOSPHERIC_N2_MOLAR_MASS prints 28.1610. What do SECTION 1 and SECTION 11 say it is?' and options = '["The N2 row of FUEL_REFERENCE, 28.014 kg/kmol, printed to four decimals after rounding.", "The air''s non-oxygen part, argon included, derived by the engine from three air constants.", "The IUPAC nitrogen of ATOMIC_WEIGHT, N 14.007, doubled and corrected for the fuel''s N2.", "A typed constant for air''s nitrogen alone, with argon carried in AIR_MOLAR_MASS 28.9647."]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 1 prints it as derived by the engine from the three air constants above it. SECTION 11: the air''s non-oxygen part leaves as atmospheric nitrogen at ATMOSPHERIC_N2_MOLAR_MASS, which carries air''s argon. FUEL_REFERENCE''s N2 row is 28.014.' then 'old'
           when prompt = 'energyEfficiency.ATMOSPHERIC_N2_MOLAR_MASS prints 28.1610. What does the course say it is?' and options = '["The N2 row of FUEL_REFERENCE, 28.014 kg/kmol, printed to four decimals after rounding.", "The air''s non-oxygen part, argon included, derived by the engine from three air constants.", "The IUPAC nitrogen of ATOMIC_WEIGHT, N 14.007, doubled and corrected for the fuel''s N2.", "A typed constant for air''s nitrogen alone, with argon carried in AIR_MOLAR_MASS 28.9647."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course''s constants table prints it as derived by the engine from the three air constants above it. The stoichiometry lesson: the air''s non-oxygen part leaves as atmospheric nitrogen at ATMOSPHERIC_N2_MOLAR_MASS, which carries air''s argon. FUEL_REFERENCE''s N2 row is 28.014.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-combustion-from-the-fuel-analysis' and ord = 9;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m01-combustion-from-the-fuel-analysis ord 9'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m01-combustion-from-the-fuel-analysis ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'energyEfficiency.ATMOSPHERIC_N2_MOLAR_MASS prints 28.1610. What does the course say it is?', options = '["The N2 row of FUEL_REFERENCE, 28.014 kg/kmol, printed to four decimals after rounding.", "The air''s non-oxygen part, argon included, derived by the engine from three air constants.", "The IUPAC nitrogen of ATOMIC_WEIGHT, N 14.007, doubled and corrected for the fuel''s N2.", "A typed constant for air''s nitrogen alone, with argon carried in AIR_MOLAR_MASS 28.9647."]'::jsonb, explanation = 'The course''s constants table prints it as derived by the engine from the three air constants above it. The stoichiometry lesson: the air''s non-oxygen part leaves as atmospheric nitrogen at ATMOSPHERIC_N2_MOLAR_MASS, which carries air''s argon. FUEL_REFERENCE''s N2 row is 28.014.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-combustion-from-the-fuel-analysis' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m01-combustion-from-the-fuel-analysis ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m01-combustion-from-the-fuel-analysis ord 10
  select case
           when prompt = 'Which formula does SECTION 1 print for how the engine derives ATMOSPHERIC_N2_MOLAR_MASS?' and options = '["(AIR_MOLAR_MASS - O2_MOLE_FRACTION_DRY_AIR x O2_MOLAR_MASS) / O2_MOLE_FRACTION_DRY_AIR", "(AIR_MOLAR_MASS - O2_MOLAR_MASS) / (1 - O2_MOLE_FRACTION_DRY_AIR)", "(AIR_MOLAR_MASS - O2_MOLE_FRACTION_DRY_AIR x O2_MOLAR_MASS) / (1 - O2_MOLE_FRACTION_DRY_AIR)", "AIR_MOLAR_MASS - O2_MOLE_FRACTION_DRY_AIR x O2_MOLAR_MASS"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 1 prints that formula beside 28.1610. Each wrong option moves one term: the divisor cut to the oxygen fraction alone, the O2 molar mass dropped from the product, or the whole product taken off with no divisor.' then 'old'
           when prompt = 'Which formula does the course print for how the engine derives ATMOSPHERIC_N2_MOLAR_MASS?' and options = '["(AIR_MOLAR_MASS - O2_MOLE_FRACTION_DRY_AIR x O2_MOLAR_MASS) / O2_MOLE_FRACTION_DRY_AIR", "(AIR_MOLAR_MASS - O2_MOLAR_MASS) / (1 - O2_MOLE_FRACTION_DRY_AIR)", "(AIR_MOLAR_MASS - O2_MOLE_FRACTION_DRY_AIR x O2_MOLAR_MASS) / (1 - O2_MOLE_FRACTION_DRY_AIR)", "AIR_MOLAR_MASS - O2_MOLE_FRACTION_DRY_AIR x O2_MOLAR_MASS"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course prints that formula beside 28.1610. Each wrong option moves one term: the divisor cut to the oxygen fraction alone, the O2 molar mass dropped from the product, or the whole product taken off with no divisor.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-combustion-from-the-fuel-analysis' and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m01-combustion-from-the-fuel-analysis ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m01-combustion-from-the-fuel-analysis ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which formula does the course print for how the engine derives ATMOSPHERIC_N2_MOLAR_MASS?', options = '["(AIR_MOLAR_MASS - O2_MOLE_FRACTION_DRY_AIR x O2_MOLAR_MASS) / O2_MOLE_FRACTION_DRY_AIR", "(AIR_MOLAR_MASS - O2_MOLAR_MASS) / (1 - O2_MOLE_FRACTION_DRY_AIR)", "(AIR_MOLAR_MASS - O2_MOLE_FRACTION_DRY_AIR x O2_MOLAR_MASS) / (1 - O2_MOLE_FRACTION_DRY_AIR)", "AIR_MOLAR_MASS - O2_MOLE_FRACTION_DRY_AIR x O2_MOLAR_MASS"]'::jsonb, explanation = 'The course prints that formula beside 28.1610. Each wrong option moves one term: the divisor cut to the oxygen fraction alone, the O2 molar mass dropped from the product, or the whole product taken off with no divisor.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-combustion-from-the-fuel-analysis' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m01-combustion-from-the-fuel-analysis ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m01-combustion-from-the-fuel-analysis ord 11
  select case
           when prompt = 'SECTION 11 prints a mass balance at 3 percent stack oxygen for the invented Isiokpo fuel. What makes up its in side?' and options = '["The fuel molar mass plus the actual air times AIR_MOLAR_MASS.", "The engine dry flue gas plus the engine moisture, both per kmol of fuel.", "The fuel molar mass plus the actual air times O2_MOLAR_MASS.", "The stoichiometric air times ATMOSPHERIC_N2_MOLAR_MASS, argon and all."]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 11: fuel plus air in (fuel molar mass plus actual air times AIR_MOLAR_MASS) 351.0222 kg per kmol of fuel. The engine dry flue gas plus engine moisture is the out side, also 351.0222.' then 'old'
           when prompt = 'The course prints a mass balance at 3 percent stack oxygen for the invented Isiokpo fuel. What makes up its in side?' and options = '["The fuel molar mass plus the actual air times AIR_MOLAR_MASS.", "The engine dry flue gas plus the engine moisture, both per kmol of fuel.", "The fuel molar mass plus the actual air times O2_MOLAR_MASS.", "The stoichiometric air times ATMOSPHERIC_N2_MOLAR_MASS, argon and all."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course''s balance: fuel plus air in (fuel molar mass plus actual air times AIR_MOLAR_MASS) 351.0222 kg per kmol of fuel. The engine dry flue gas plus engine moisture is the out side, also 351.0222.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-combustion-from-the-fuel-analysis' and ord = 11;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m01-combustion-from-the-fuel-analysis ord 11'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m01-combustion-from-the-fuel-analysis ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course prints a mass balance at 3 percent stack oxygen for the invented Isiokpo fuel. What makes up its in side?', options = '["The fuel molar mass plus the actual air times AIR_MOLAR_MASS.", "The engine dry flue gas plus the engine moisture, both per kmol of fuel.", "The fuel molar mass plus the actual air times O2_MOLAR_MASS.", "The stoichiometric air times ATMOSPHERIC_N2_MOLAR_MASS, argon and all."]'::jsonb, explanation = 'The course''s balance: fuel plus air in (fuel molar mass plus actual air times AIR_MOLAR_MASS) 351.0222 kg per kmol of fuel. The engine dry flue gas plus engine moisture is the out side, also 351.0222.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-combustion-from-the-fuel-analysis' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m01-combustion-from-the-fuel-analysis ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m01-combustion-from-the-fuel-analysis ord 12
  select case
           when prompt = 'The SECTION 11 mass balance at 3 percent stack oxygen prints out less in as 0.000001 kg per kmol of fuel. What is that figure?' and options = '["An output combustionStoichiometry returns.", "The weight of argon the engine drops from the flue gas.", "The fuel CO2 counted on both sides of the balance.", "The digest''s own arithmetic on the engine''s two sides."]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 11 marks the out less in row computed here: the generator''s arithmetic on the engine''s in side and out side, 351.0222 each. The same section says air''s argon is carried at ATMOSPHERIC_N2_MOLAR_MASS, and SECTION 25 lists the balance as closing.' then 'old'
           when prompt = 'The course''s mass balance at 3 percent stack oxygen prints out less in as 0.000001 kg per kmol of fuel. What is that figure?' and options = '["An output combustionStoichiometry returns.", "The weight of argon the engine drops from the flue gas.", "The fuel CO2 counted on both sides of the balance.", "The course''s own arithmetic on the engine''s two sides."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course marks the out less in row computed here: the course''s own arithmetic on the engine''s in side and out side, 351.0222 each. The same lesson says air''s argon is carried at ATMOSPHERIC_N2_MOLAR_MASS, and the course''s rules in force list the balance as closing.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-combustion-from-the-fuel-analysis' and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m01-combustion-from-the-fuel-analysis ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m01-combustion-from-the-fuel-analysis ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course''s mass balance at 3 percent stack oxygen prints out less in as 0.000001 kg per kmol of fuel. What is that figure?', options = '["An output combustionStoichiometry returns.", "The weight of argon the engine drops from the flue gas.", "The fuel CO2 counted on both sides of the balance.", "The course''s own arithmetic on the engine''s two sides."]'::jsonb, explanation = 'The course marks the out less in row computed here: the course''s own arithmetic on the engine''s in side and out side, 351.0222 each. The same lesson says air''s argon is carried at ATMOSPHERIC_N2_MOLAR_MASS, and the course''s rules in force list the balance as closing.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-combustion-from-the-fuel-analysis' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m01-combustion-from-the-fuel-analysis ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m01-combustion-from-the-fuel-analysis ord 13
  select case
           when prompt = 'energyEfficiency.FUEL_REFERENCE carries atom counts and typical heating values. Which does FUEL_REFERENCE_NOTE say drives the stoichiometry?' and options = '["The typical LHV column, which the note calls governing.", "The atom counts, which the note calls definitional.", "The inert flag, which drops CO2 and N2 from the demand.", "The typical HHV column, which a measured value replaces."]'::jsonb and answer_index = 1 and explanation is not distinct from 'FUEL_REFERENCE_NOTE, verbatim: "Atom counts are definitional and drive the stoichiometry. Heating values are typical: the fuel analysis governs, and a measured value should replace these." The inert rows are kept: SECTION 11 passes the fuel CO2 into products.co2PerKmolFuel.' then 'old'
           when prompt = 'energyEfficiency.FUEL_REFERENCE carries atom counts and typical heating values. Which does FUEL_REFERENCE_NOTE say drives the stoichiometry?' and options = '["The typical LHV column, which the note calls governing.", "The atom counts, which the note calls definitional.", "The inert flag, which drops CO2 and N2 from the demand.", "The typical HHV column, which a measured value replaces."]'::jsonb and answer_index = 1 and explanation is not distinct from 'FUEL_REFERENCE_NOTE, verbatim: "Atom counts are definitional and drive the stoichiometry. Heating values are typical: the fuel analysis governs, and a measured value should replace these." The inert rows are kept: the course passes the fuel CO2 into products.co2PerKmolFuel.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-combustion-from-the-fuel-analysis' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m01-combustion-from-the-fuel-analysis ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m01-combustion-from-the-fuel-analysis ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'energyEfficiency.FUEL_REFERENCE carries atom counts and typical heating values. Which does FUEL_REFERENCE_NOTE say drives the stoichiometry?', options = '["The typical LHV column, which the note calls governing.", "The atom counts, which the note calls definitional.", "The inert flag, which drops CO2 and N2 from the demand.", "The typical HHV column, which a measured value replaces."]'::jsonb, explanation = 'FUEL_REFERENCE_NOTE, verbatim: "Atom counts are definitional and drive the stoichiometry. Heating values are typical: the fuel analysis governs, and a measured value should replace these." The inert rows are kept: the course passes the fuel CO2 into products.co2PerKmolFuel.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-combustion-from-the-fuel-analysis' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m01-combustion-from-the-fuel-analysis ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m01-combustion-from-the-fuel-analysis ord 14
  select case
           when prompt = 'SECTION 1 prints the CO2 row of FUEL_REFERENCE, PRODUCT_MOLAR_MASS.CO2 and carbonAbatement.MW_CO2. What does it say about their molar masses?' and options = '["They are one number, 44.009, going into the fuel and out in the flue gas.", "The fuel row prints 44.097 and the flue gas products print 44.009.", "The fuel row prints 44.009 and the flue gas products print 28.014.", "Each module rounds its own, so 44.009 and 44.097 both appear."]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 1: the CO2 row, PRODUCT_MOLAR_MASS.CO2 and carbonAbatement.MW_CO2 are one number, 44.009, and an inert CO2 in the fuel weighs the same going in as it does in the flue gas. 44.097 is propane''s molar mass and 28.014 is N2.' then 'old'
           when prompt = 'The course prints the CO2 row of FUEL_REFERENCE, PRODUCT_MOLAR_MASS.CO2 and carbonAbatement.MW_CO2. What does it say about their molar masses?' and options = '["They are one number, 44.009, going into the fuel and out in the flue gas.", "The fuel row prints 44.097 and the flue gas products print 44.009.", "The fuel row prints 44.009 and the flue gas products print 28.014.", "Each module rounds its own, so 44.009 and 44.097 both appear."]'::jsonb and answer_index = 0 and explanation is not distinct from 'In the course, the CO2 row, PRODUCT_MOLAR_MASS.CO2 and carbonAbatement.MW_CO2 are one number, 44.009, and an inert CO2 in the fuel weighs the same going in as it does in the flue gas. 44.097 is propane''s molar mass and 28.014 is N2.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-combustion-from-the-fuel-analysis' and ord = 14;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m01-combustion-from-the-fuel-analysis ord 14'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m01-combustion-from-the-fuel-analysis ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course prints the CO2 row of FUEL_REFERENCE, PRODUCT_MOLAR_MASS.CO2 and carbonAbatement.MW_CO2. What does it say about their molar masses?', options = '["They are one number, 44.009, going into the fuel and out in the flue gas.", "The fuel row prints 44.097 and the flue gas products print 44.009.", "The fuel row prints 44.009 and the flue gas products print 28.014.", "Each module rounds its own, so 44.009 and 44.097 both appear."]'::jsonb, explanation = 'In the course, the CO2 row, PRODUCT_MOLAR_MASS.CO2 and carbonAbatement.MW_CO2 are one number, 44.009, and an inert CO2 in the fuel weighs the same going in as it does in the flue gas. 44.097 is propane''s molar mass and 28.014 is N2.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-combustion-from-the-fuel-analysis' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m01-combustion-from-the-fuel-analysis ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m01-combustion-from-the-fuel-analysis ord 15
  select case
           when prompt = 'How much water does each kmol of the invented Isiokpo fuel gas make when burned, as products.h2oPerKmolFuel?' and options = '["1.098000", "0.015000", "2.033000", "2.089500"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 11 prints products.h2oPerKmolFuel 2.033000. 1.098000 is products.co2PerKmolFuel, 0.015000 products.fuelN2PerKmolFuel, and 2.089500 the oxygen demand o2PerKmolFuel.' then 'old'
           when prompt = 'How much water does each kmol of the invented Isiokpo fuel gas make when burned, as products.h2oPerKmolFuel?' and options = '["1.098000", "0.015000", "2.033000", "2.089500"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course prints products.h2oPerKmolFuel 2.033000. 1.098000 is products.co2PerKmolFuel, 0.015000 products.fuelN2PerKmolFuel, and 2.089500 the oxygen demand o2PerKmolFuel.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-combustion-from-the-fuel-analysis' and ord = 15;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m01-combustion-from-the-fuel-analysis ord 15'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m01-combustion-from-the-fuel-analysis ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'How much water does each kmol of the invented Isiokpo fuel gas make when burned, as products.h2oPerKmolFuel?', options = '["1.098000", "0.015000", "2.033000", "2.089500"]'::jsonb, explanation = 'The course prints products.h2oPerKmolFuel 2.033000. 1.098000 is products.co2PerKmolFuel, 0.015000 products.fuelN2PerKmolFuel, and 2.089500 the oxygen demand o2PerKmolFuel.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm01-combustion-from-the-fuel-analysis' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m01-combustion-from-the-fuel-analysis ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m02-excess-air-and-stack-oxygen ord 1
  select case
           when prompt = 'SECTION 12 prints the assumption behind excessAirFromFlueOxygen. According to it, how does a stack making carbon monoxide read?' and options = '["As if it had less excess air than it has.", "As the same excess air, at a lower efficiency.", "As if it had more excess air than it has.", "As a refusal: the engine will not read a CO stack."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The engine''s assumption, verbatim: "Complete combustion. An oxygen reading alone cannot see carbon monoxide, so a stack making CO will read as if it had more excess air than it has." The sentence names a direction and prints no size.' then 'old'
           when prompt = 'The course prints the assumption behind excessAirFromFlueOxygen. According to it, how does a stack making carbon monoxide read?' and options = '["As if it had less excess air than it has.", "As the same excess air, at a lower efficiency.", "As if it had more excess air than it has.", "As a refusal: the engine will not read a CO stack."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The engine''s assumption, verbatim: "Complete combustion. An oxygen reading alone cannot see carbon monoxide, so a stack making CO will read as if it had more excess air than it has." The sentence names a direction and prints no size.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-excess-air-and-stack-oxygen' and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m02-excess-air-and-stack-oxygen ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m02-excess-air-and-stack-oxygen ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course prints the assumption behind excessAirFromFlueOxygen. According to it, how does a stack making carbon monoxide read?', options = '["As if it had less excess air than it has.", "As the same excess air, at a lower efficiency.", "As if it had more excess air than it has.", "As a refusal: the engine will not read a CO stack."]'::jsonb, explanation = 'The engine''s assumption, verbatim: "Complete combustion. An oxygen reading alone cannot see carbon monoxide, so a stack making CO will read as if it had more excess air than it has." The sentence names a direction and prints no size.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-excess-air-and-stack-oxygen' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m02-excess-air-and-stack-oxygen ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m02-excess-air-and-stack-oxygen ord 2
  select case
           when prompt = 'The invented Isiokpo heater reads 5.5 percent dry stack oxygen. What excess air does SECTION 12 print for that reading?' and options = '["32.1223 percent", "13.9199 percent", "21.2938 percent", "55.7461 percent"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The 5.5 row prints excess air 32.1223 percent. 13.9199 percent is the 2.8 row, 21.2938 percent the 4 row and 55.7461 percent the 8 row.' then 'old'
           when prompt = 'The invented Isiokpo heater reads 5.5 percent dry stack oxygen. What excess air does the course print for that reading?' and options = '["32.1223 percent", "13.9199 percent", "21.2938 percent", "55.7461 percent"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The 5.5 row prints excess air 32.1223 percent. 13.9199 percent is the 2.8 row, 21.2938 percent the 4 row and 55.7461 percent the 8 row.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-excess-air-and-stack-oxygen' and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m02-excess-air-and-stack-oxygen ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m02-excess-air-and-stack-oxygen ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The invented Isiokpo heater reads 5.5 percent dry stack oxygen. What excess air does the course print for that reading?', options = '["32.1223 percent", "13.9199 percent", "21.2938 percent", "55.7461 percent"]'::jsonb, explanation = 'The 5.5 row prints excess air 32.1223 percent. 13.9199 percent is the 2.8 row, 21.2938 percent the 4 row and 55.7461 percent the 8 row.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-excess-air-and-stack-oxygen' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m02-excess-air-and-stack-oxygen ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m02-excess-air-and-stack-oxygen ord 3
  select case
           when prompt = 'At a dry stack oxygen of 2.8 percent, which SECTION 12 figure is the actual air for the invented Isiokpo fuel gas?' and options = '["11.364257", "10.387757", "12.420757", "10.925631"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The 2.8 row prints actual air 11.364257, dry flue gas 10.387757 and wet flue gas 12.420757 kmol per kmol fuel. 10.925631 is the actual air in the 2 row.' then 'old'
           when prompt = 'At a dry stack oxygen of 2.8 percent, which course figure is the actual air for the invented Isiokpo fuel gas?' and options = '["11.364257", "10.387757", "12.420757", "10.925631"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The 2.8 row prints actual air 11.364257, dry flue gas 10.387757 and wet flue gas 12.420757 kmol per kmol fuel. 10.925631 is the actual air in the 2 row.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-excess-air-and-stack-oxygen' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m02-excess-air-and-stack-oxygen ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m02-excess-air-and-stack-oxygen ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'At a dry stack oxygen of 2.8 percent, which course figure is the actual air for the invented Isiokpo fuel gas?', options = '["11.364257", "10.387757", "12.420757", "10.925631"]'::jsonb, explanation = 'The 2.8 row prints actual air 11.364257, dry flue gas 10.387757 and wet flue gas 12.420757 kmol per kmol fuel. 10.925631 is the actual air in the 2 row.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-excess-air-and-stack-oxygen' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m02-excess-air-and-stack-oxygen ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m02-excess-air-and-stack-oxygen ord 4
  select case
           when prompt = 'In every SECTION 12 row the wet flue gas less the dry flue gas is 2.033000 kmol per kmol fuel. What does the digest say that difference is?' and options = '["The oxygen the excess air carries through the stack.", "The water the hydrogen makes, products.h2oPerKmolFuel.", "The fuel''s CO2 and nitrogen, which pass through unburned.", "The argon that ATMOSPHERIC_N2_MOLAR_MASS carries."]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 12: the wet flue gas less the dry is the water the hydrogen makes, 2.033000 in every row, and products.h2oPerKmolFuel is 2.033000 (SECTION 11).' then 'old'
           when prompt = 'In every row of the oxygen table the wet flue gas less the dry flue gas is 2.033000 kmol per kmol fuel. What does the course say that difference is?' and options = '["The oxygen the excess air carries through the stack.", "The water the hydrogen makes, products.h2oPerKmolFuel.", "The fuel''s CO2 and nitrogen, which pass through unburned.", "The argon that ATMOSPHERIC_N2_MOLAR_MASS carries."]'::jsonb and answer_index = 1 and explanation is not distinct from 'In the course, the wet flue gas less the dry is the water the hydrogen makes, 2.033000 in every row, and products.h2oPerKmolFuel is 2.033000 in the stoichiometry lesson.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-excess-air-and-stack-oxygen' and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m02-excess-air-and-stack-oxygen ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m02-excess-air-and-stack-oxygen ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'In every row of the oxygen table the wet flue gas less the dry flue gas is 2.033000 kmol per kmol fuel. What does the course say that difference is?', options = '["The oxygen the excess air carries through the stack.", "The water the hydrogen makes, products.h2oPerKmolFuel.", "The fuel''s CO2 and nitrogen, which pass through unburned.", "The argon that ATMOSPHERIC_N2_MOLAR_MASS carries."]'::jsonb, explanation = 'In the course, the wet flue gas less the dry is the water the hydrogen makes, 2.033000 in every row, and products.h2oPerKmolFuel is 2.033000 in the stoichiometry lesson.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-excess-air-and-stack-oxygen' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m02-excess-air-and-stack-oxygen ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m02-excess-air-and-stack-oxygen ord 5
  select case
           when prompt = 'Down the whole oxygen table, subtracting actual air from dry flue gas always gives -0.976500. Which reading of that constant does the digest print?' and options = '["Each extra kilomole of air adds 2.033000 kmol of water to the stack.", "Above 5.5 percent the dry flue gas grows faster than the actual air.", "The oxygen demand falls by 2.089500 kmol for every kilomole of air.", "Each extra kilomole of air leaves as a kilomole of dry flue gas."]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 12: the dry flue gas less the actual air is fixed, because each extra kilomole of air leaves as a kilomole of dry flue gas. The figure prints as -0.976500 from 0 to 12 percent. The 2.033000 is the wet less dry, the water, and the oxygen demand stays at 2.089500.' then 'old'
           when prompt = 'Down the whole oxygen table, subtracting actual air from dry flue gas always gives -0.976500. Which reading of that constant does the course print?' and options = '["Each extra kilomole of air adds 2.033000 kmol of water to the stack.", "Above 5.5 percent the dry flue gas grows faster than the actual air.", "The oxygen demand falls by 2.089500 kmol for every kilomole of air.", "Each extra kilomole of air leaves as a kilomole of dry flue gas."]'::jsonb and answer_index = 3 and explanation is not distinct from 'In the course, the dry flue gas less the actual air is fixed, because each extra kilomole of air leaves as a kilomole of dry flue gas. The figure prints as -0.976500 from 0 to 12 percent. The 2.033000 is the wet less dry, the water, and the oxygen demand stays at 2.089500.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-excess-air-and-stack-oxygen' and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m02-excess-air-and-stack-oxygen ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m02-excess-air-and-stack-oxygen ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Down the whole oxygen table, subtracting actual air from dry flue gas always gives -0.976500. Which reading of that constant does the course print?', options = '["Each extra kilomole of air adds 2.033000 kmol of water to the stack.", "Above 5.5 percent the dry flue gas grows faster than the actual air.", "The oxygen demand falls by 2.089500 kmol for every kilomole of air.", "Each extra kilomole of air leaves as a kilomole of dry flue gas."]'::jsonb, explanation = 'In the course, the dry flue gas less the actual air is fixed, because each extra kilomole of air leaves as a kilomole of dry flue gas. The figure prints as -0.976500 from 0 to 12 percent. The 2.033000 is the wet less dry, the water, and the oxygen demand stays at 2.089500.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-excess-air-and-stack-oxygen' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m02-excess-air-and-stack-oxygen ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m02-excess-air-and-stack-oxygen ord 6
  select case
           when prompt = 'SECTION 12 prints two calls to excessAirFromFlueOxygen, one at 21 percent and one at -1 percent dry stack oxygen. What does the engine answer?' and options = '["21 percent is refused as above the oxygen in dry air, and -1 percent is read as 0 percent, excess air 0.0000 percent.", "Both are refused with the message that a measured dry stack oxygen is required, since neither is a real reading.", "Both are refused with the same message, the one that states the bound of 0 percent or more and below 20.946 percent.", "Neither is refused: 21 percent prints above the 121.0076 percent of the 12 row and -1 percent prints below zero."]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 12 prints both calls answered by one refusal: "Stack oxygen must be 0 percent or more and below 20.946 percent, the oxygen in dry air. A reading of 20.946 percent is air with no fuel burned." The required-reading message answers a blank.' then 'old'
           when prompt = 'The course prints two calls to excessAirFromFlueOxygen, one at 21 percent and one at -1 percent dry stack oxygen. What does the engine answer?' and options = '["21 percent is refused as above the oxygen in dry air, and -1 percent is read as 0 percent, excess air 0.0000 percent.", "Both are refused with the message that a measured dry stack oxygen is required, since neither is a real reading.", "Both are refused with the same message, the one that states the bound of 0 percent or more and below 20.946 percent.", "Neither is refused: 21 percent prints above the 121.0076 percent of the 12 row and -1 percent prints below zero."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course prints both calls answered by one refusal: "Stack oxygen must be 0 percent or more and below 20.946 percent, the oxygen in dry air. A reading of 20.946 percent is air with no fuel burned." The required-reading message answers a blank.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-excess-air-and-stack-oxygen' and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m02-excess-air-and-stack-oxygen ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m02-excess-air-and-stack-oxygen ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course prints two calls to excessAirFromFlueOxygen, one at 21 percent and one at -1 percent dry stack oxygen. What does the engine answer?', options = '["21 percent is refused as above the oxygen in dry air, and -1 percent is read as 0 percent, excess air 0.0000 percent.", "Both are refused with the message that a measured dry stack oxygen is required, since neither is a real reading.", "Both are refused with the same message, the one that states the bound of 0 percent or more and below 20.946 percent.", "Neither is refused: 21 percent prints above the 121.0076 percent of the 12 row and -1 percent prints below zero."]'::jsonb, explanation = 'The course prints both calls answered by one refusal: "Stack oxygen must be 0 percent or more and below 20.946 percent, the oxygen in dry air. A reading of 20.946 percent is air with no fuel burned." The required-reading message answers a blank.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-excess-air-and-stack-oxygen' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m02-excess-air-and-stack-oxygen ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m02-excess-air-and-stack-oxygen ord 7
  select case
           when prompt = 'The dry stack oxygen box is left blank on a call for the invented Isiokpo fuel gas. What does excessAirFromFlueOxygen return?' and options = '["REFUSED: A measured dry stack oxygen is required.", "REFUSED: Valid stoichiometry is required.", "Excess air 0.0000 percent: a blank is read as a reading of 0.", "REFUSED: Stack oxygen must be 0 percent or more and below 20.946 percent, the oxygen in dry air. A reading of 20.946 percent is air with no fuel burned."]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 12 prints the blank reading refused with its own message, "A measured dry stack oxygen is required." The 0 row, excess air 0.0000 percent, is what a typed 0 returns. The stoichiometry message answers a call with no stoichiometry.' then 'old'
           when prompt = 'The dry stack oxygen box is left blank on a call for the invented Isiokpo fuel gas. What does excessAirFromFlueOxygen return?' and options = '["REFUSED: A measured dry stack oxygen is required.", "REFUSED: Valid stoichiometry is required.", "Excess air 0.0000 percent: a blank is read as a reading of 0.", "REFUSED: Stack oxygen must be 0 percent or more and below 20.946 percent, the oxygen in dry air. A reading of 20.946 percent is air with no fuel burned."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course prints the blank reading refused with its own message, "A measured dry stack oxygen is required." The 0 row, excess air 0.0000 percent, is what a typed 0 returns. The stoichiometry message answers a call with no stoichiometry.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-excess-air-and-stack-oxygen' and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m02-excess-air-and-stack-oxygen ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m02-excess-air-and-stack-oxygen ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The dry stack oxygen box is left blank on a call for the invented Isiokpo fuel gas. What does excessAirFromFlueOxygen return?', options = '["REFUSED: A measured dry stack oxygen is required.", "REFUSED: Valid stoichiometry is required.", "Excess air 0.0000 percent: a blank is read as a reading of 0.", "REFUSED: Stack oxygen must be 0 percent or more and below 20.946 percent, the oxygen in dry air. A reading of 20.946 percent is air with no fuel burned."]'::jsonb, explanation = 'The course prints the blank reading refused with its own message, "A measured dry stack oxygen is required." The 0 row, excess air 0.0000 percent, is what a typed 0 returns. The stoichiometry message answers a call with no stoichiometry.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-excess-air-and-stack-oxygen' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m02-excess-air-and-stack-oxygen ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m02-excess-air-and-stack-oxygen ord 8
  select case
           when prompt = 'SECTION 12 says the excess air is solved one way in the engine and found another way by the oracle. Which pairing does it print?' and options = '["The engine finds E by bisection; the oracle solves the closed form on the stoichiometric terms.", "The engine solves a closed form; the oracle finds the same E by bisection on the full dry flue gas.", "Both solve the closed form, the engine on the dry flue gas and the oracle on the wet flue gas.", "The engine reads E between the printed rows, and the oracle finds it by bisection on wet gas."]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 12 prints that the relation is solved in closed form, and that the oracle finds the same E by bisection on the full dry flue gas (SECTION 26). The table prints the engine''s answers.' then 'old'
           when prompt = 'The course says the excess air is solved one way in the engine and found another way by the oracle. Which pairing does it print?' and options = '["The engine finds E by bisection; the oracle solves the closed form on the stoichiometric terms.", "The engine solves a closed form; the oracle finds the same E by bisection on the full dry flue gas.", "Both solve the closed form, the engine on the dry flue gas and the oracle on the wet flue gas.", "The engine reads E between the printed rows, and the oracle finds it by bisection on wet gas."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course prints that the relation is solved in closed form, and that the oracle finds the same E by bisection on the full dry flue gas. The table prints the engine''s answers.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-excess-air-and-stack-oxygen' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m02-excess-air-and-stack-oxygen ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m02-excess-air-and-stack-oxygen ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course says the excess air is solved one way in the engine and found another way by the oracle. Which pairing does it print?', options = '["The engine finds E by bisection; the oracle solves the closed form on the stoichiometric terms.", "The engine solves a closed form; the oracle finds the same E by bisection on the full dry flue gas.", "Both solve the closed form, the engine on the dry flue gas and the oracle on the wet flue gas.", "The engine reads E between the printed rows, and the oracle finds it by bisection on wet gas."]'::jsonb, explanation = 'The course prints that the relation is solved in closed form, and that the oracle finds the same E by bisection on the full dry flue gas. The table prints the engine''s answers.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-excess-air-and-stack-oxygen' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m02-excess-air-and-stack-oxygen ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m02-excess-air-and-stack-oxygen ord 9
  select case
           when prompt = 'SECTION 12 states the relation the engine solves, with E the excess-air fraction. Which is it?' and options = '["E x oxygen demand / (stoichiometric wet products + E x stoichiometric air) = measured fraction", "E x stoichiometric air / (stoichiometric dry products + E x oxygen demand) = measured fraction", "oxygen demand / (stoichiometric dry products + E x stoichiometric air) = measured fraction", "E x oxygen demand / (stoichiometric dry products + E x stoichiometric air) = measured fraction"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 12: E times the oxygen demand over (the stoichiometric dry products plus E times the stoichiometric air) equals the measured fraction.' then 'old'
           when prompt = 'The course states the relation the engine solves, with E the excess-air fraction. Which is it?' and options = '["E x oxygen demand / (stoichiometric wet products + E x stoichiometric air) = measured fraction", "E x stoichiometric air / (stoichiometric dry products + E x oxygen demand) = measured fraction", "oxygen demand / (stoichiometric dry products + E x stoichiometric air) = measured fraction", "E x oxygen demand / (stoichiometric dry products + E x stoichiometric air) = measured fraction"]'::jsonb and answer_index = 3 and explanation is not distinct from 'In the course, E times the oxygen demand over (the stoichiometric dry products plus E times the stoichiometric air) equals the measured fraction.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-excess-air-and-stack-oxygen' and ord = 9;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m02-excess-air-and-stack-oxygen ord 9'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m02-excess-air-and-stack-oxygen ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course states the relation the engine solves, with E the excess-air fraction. Which is it?', options = '["E x oxygen demand / (stoichiometric wet products + E x stoichiometric air) = measured fraction", "E x stoichiometric air / (stoichiometric dry products + E x oxygen demand) = measured fraction", "oxygen demand / (stoichiometric dry products + E x stoichiometric air) = measured fraction", "E x oxygen demand / (stoichiometric dry products + E x stoichiometric air) = measured fraction"]'::jsonb, explanation = 'In the course, E times the oxygen demand over (the stoichiometric dry products plus E times the stoichiometric air) equals the measured fraction.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-excess-air-and-stack-oxygen' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m02-excess-air-and-stack-oxygen ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m02-excess-air-and-stack-oxygen ord 10
  select case
           when prompt = 'The first SECTION 12 refusal is labelled "all air", a dry stack oxygen of 20.946 percent. What does the refusal''s second sentence say that reading is?' and options = '["Air with no fuel burned.", "A stack at the 12 percent row''s 121.0076 percent excess air.", "The stoichiometric case, with excess air of 0.0000 percent.", "A stack making CO that reads as though it had more air."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The second sentence names 20.946 percent as air with no fuel burned, and SECTION 1 prints O2_MOLE_FRACTION_DRY_AIR 0.20946. 121.0076 percent is the excess air of the 12 row, the highest row SECTION 12 prints, and 0.0000 percent that of its 0 row. The CO sentence is the engine''s assumption, printed above the table.' then 'old'
           when prompt = 'The first refusal in the lesson is labelled "all air", a dry stack oxygen of 20.946 percent. What does the refusal''s second sentence say that reading is?' and options = '["Air with no fuel burned.", "A stack at the 12 percent row''s 121.0076 percent excess air.", "The stoichiometric case, with excess air of 0.0000 percent.", "A stack making CO that reads as though it had more air."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The second sentence names 20.946 percent as air with no fuel burned, and the course prints O2_MOLE_FRACTION_DRY_AIR 0.20946. 121.0076 percent is the excess air of the 12 row, the highest row the table prints, and 0.0000 percent that of its 0 row. The CO sentence is the engine''s assumption, printed above the table.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-excess-air-and-stack-oxygen' and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m02-excess-air-and-stack-oxygen ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m02-excess-air-and-stack-oxygen ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The first refusal in the lesson is labelled "all air", a dry stack oxygen of 20.946 percent. What does the refusal''s second sentence say that reading is?', options = '["Air with no fuel burned.", "A stack at the 12 percent row''s 121.0076 percent excess air.", "The stoichiometric case, with excess air of 0.0000 percent.", "A stack making CO that reads as though it had more air."]'::jsonb, explanation = 'The second sentence names 20.946 percent as air with no fuel burned, and the course prints O2_MOLE_FRACTION_DRY_AIR 0.20946. 121.0076 percent is the excess air of the 12 row, the highest row the table prints, and 0.0000 percent that of its 0 row. The CO sentence is the engine''s assumption, printed above the table.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-excess-air-and-stack-oxygen' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m02-excess-air-and-stack-oxygen ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m02-excess-air-and-stack-oxygen ord 11
  select case
           when prompt = 'Which row of the SECTION 12 table carries 4.5228 percent in its excess air column?' and options = '["2 percent", "2.8 percent", "1 percent", "4 percent"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The 1 row prints excess air 4.5228 percent and actual air 10.426827 kmol per kmol fuel. The 2 row prints 9.5230, the 2.8 row 13.9199 and the 4 row 21.2938 percent.' then 'old'
           when prompt = 'Which row of the course''s oxygen table carries 4.5228 percent in its excess air column?' and options = '["2 percent", "2.8 percent", "1 percent", "4 percent"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The 1 row prints excess air 4.5228 percent and actual air 10.426827 kmol per kmol fuel. The 2 row prints 9.5230, the 2.8 row 13.9199 and the 4 row 21.2938 percent.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-excess-air-and-stack-oxygen' and ord = 11;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m02-excess-air-and-stack-oxygen ord 11'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m02-excess-air-and-stack-oxygen ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which row of the course''s oxygen table carries 4.5228 percent in its excess air column?', options = '["2 percent", "2.8 percent", "1 percent", "4 percent"]'::jsonb, explanation = 'The 1 row prints excess air 4.5228 percent and actual air 10.426827 kmol per kmol fuel. The 2 row prints 9.5230, the 2.8 row 13.9199 and the 4 row 21.2938 percent.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-excess-air-and-stack-oxygen' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m02-excess-air-and-stack-oxygen ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m02-excess-air-and-stack-oxygen ord 12
  select case
           when prompt = 'excessAirFromFlueOxygen is called with a reading of 5.5 percent and no stoichiometry. What does SECTION 12 print?' and options = '["32.1223 percent excess air, read from the table row.", "REFUSED: Valid stoichiometry is required.", "REFUSED: A measured dry stack oxygen is required.", "13.180063 kmol of air per kmol, with no excess air."]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 12 prints the call with no stoichiometry refused: "Valid stoichiometry is required." 32.1223 percent and 13.180063 are the 5.5 row with the Isiokpo stoichiometry supplied.' then 'old'
           when prompt = 'excessAirFromFlueOxygen is called with a reading of 5.5 percent and no stoichiometry. What does the course print?' and options = '["32.1223 percent excess air, read from the table row.", "REFUSED: Valid stoichiometry is required.", "REFUSED: A measured dry stack oxygen is required.", "13.180063 kmol of air per kmol, with no excess air."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course prints the call with no stoichiometry refused: "Valid stoichiometry is required." 32.1223 percent and 13.180063 are the 5.5 row with the Isiokpo stoichiometry supplied.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-excess-air-and-stack-oxygen' and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m02-excess-air-and-stack-oxygen ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m02-excess-air-and-stack-oxygen ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'excessAirFromFlueOxygen is called with a reading of 5.5 percent and no stoichiometry. What does the course print?', options = '["32.1223 percent excess air, read from the table row.", "REFUSED: Valid stoichiometry is required.", "REFUSED: A measured dry stack oxygen is required.", "13.180063 kmol of air per kmol, with no excess air."]'::jsonb, explanation = 'The course prints the call with no stoichiometry refused: "Valid stoichiometry is required." 32.1223 percent and 13.180063 are the 5.5 row with the Isiokpo stoichiometry supplied.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-excess-air-and-stack-oxygen' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m02-excess-air-and-stack-oxygen ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m02-excess-air-and-stack-oxygen ord 13
  select case
           when prompt = 'Which unit goes with the 13.180063 printed in the actual air column?' and options = '["kmol of air per kmol of fuel", "kg of air per kg of fuel", "kmol O2 per kmol of fuel", "percent of the stoichiometric air"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The SECTION 12 column is headed actual air kmol per kmol fuel. kg air per kg fuel is the unit of stoichAirKgPerKgFuel 15.612763, kmol O2 per kmol fuel the unit of o2PerKmolFuel 2.089500, and the excess air column is the one in percent.' then 'old'
           when prompt = 'Which unit goes with the 13.180063 printed in the actual air column?' and options = '["kmol of air per kmol of fuel", "kg of air per kg of fuel", "kmol O2 per kmol of fuel", "percent of the stoichiometric air"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course''s column is headed actual air kmol per kmol fuel. kg air per kg fuel is the unit of stoichAirKgPerKgFuel 15.612763, kmol O2 per kmol fuel the unit of o2PerKmolFuel 2.089500, and the excess air column is the one in percent.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-excess-air-and-stack-oxygen' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m02-excess-air-and-stack-oxygen ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m02-excess-air-and-stack-oxygen ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which unit goes with the 13.180063 printed in the actual air column?', options = '["kmol of air per kmol of fuel", "kg of air per kg of fuel", "kmol O2 per kmol of fuel", "percent of the stoichiometric air"]'::jsonb, explanation = 'The course''s column is headed actual air kmol per kmol fuel. kg air per kg fuel is the unit of stoichAirKgPerKgFuel 15.612763, kmol O2 per kmol fuel the unit of o2PerKmolFuel 2.089500, and the excess air column is the one in percent.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-excess-air-and-stack-oxygen' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m02-excess-air-and-stack-oxygen ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m02-excess-air-and-stack-oxygen ord 14
  select case
           when prompt = 'SECTION 14 prints the refusal for a blank minimum safe stack oxygen. On what does it say the carbon monoxide point depends?' and options = '["The stack oxygen, the fuel and the excess air.", "The stack temperature and radiation loss.", "The fuel analysis and its typical heating value.", "The burner, the fuel and the draught control."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The refusal, verbatim: "A minimum safe stack oxygen is required and is not defaulted. Below some excess air a burner makes carbon monoxide, and where that point sits depends on the burner, the fuel and the draught control." At Isiokpo the floor is 2 percent, declared after a combustion test (invented).' then 'old'
           when prompt = 'The course prints the refusal for a blank minimum safe stack oxygen. On what does it say the carbon monoxide point depends?' and options = '["The stack oxygen, the fuel and the excess air.", "The stack temperature and radiation loss.", "The fuel analysis and its typical heating value.", "The burner, the fuel and the draught control."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The refusal, verbatim: "A minimum safe stack oxygen is required and is not defaulted. Below some excess air a burner makes carbon monoxide, and where that point sits depends on the burner, the fuel and the draught control." At Isiokpo the floor is 2 percent, declared after a combustion test (invented).' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-excess-air-and-stack-oxygen' and ord = 14;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m02-excess-air-and-stack-oxygen ord 14'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m02-excess-air-and-stack-oxygen ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course prints the refusal for a blank minimum safe stack oxygen. On what does it say the carbon monoxide point depends?', options = '["The stack oxygen, the fuel and the excess air.", "The stack temperature and radiation loss.", "The fuel analysis and its typical heating value.", "The burner, the fuel and the draught control."]'::jsonb, explanation = 'The refusal, verbatim: "A minimum safe stack oxygen is required and is not defaulted. Below some excess air a burner makes carbon monoxide, and where that point sits depends on the burner, the fuel and the draught control." At Isiokpo the floor is 2 percent, declared after a combustion test (invented).'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-excess-air-and-stack-oxygen' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m02-excess-air-and-stack-oxygen ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m02-excess-air-and-stack-oxygen ord 15
  select case
           when prompt = 'A stack reading no oxygen at all: how does that first row of the table compare with SECTION 11?' and options = '["Excess air 0.0000 percent and actual air 8.999152, the dry flue gas of that row.", "Excess air 4.5228 percent and actual air 10.426827, the first reading it answers.", "Excess air 0.0000 percent and actual air 9.975652, equal to stoichAirPerKmolFuel.", "A refusal, since a reading of 0 percent is read the same as a blank reading."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The 0 row prints excess air 0.0000, actual air 9.975652, dry flue gas 8.999152 and wet flue gas 11.032152 kmol per kmol fuel; SECTION 11 prints stoichAirPerKmolFuel 9.975652. 4.5228 and 10.426827 are the 1 row. A blank is refused with its own message.' then 'old'
           when prompt = 'A stack reading no oxygen at all: how does that first row of the table compare with the course''s stoichiometry?' and options = '["Excess air 0.0000 percent and actual air 8.999152, the dry flue gas of that row.", "Excess air 4.5228 percent and actual air 10.426827, the first reading it answers.", "Excess air 0.0000 percent and actual air 9.975652, equal to stoichAirPerKmolFuel.", "A refusal, since a reading of 0 percent is read the same as a blank reading."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The 0 row prints excess air 0.0000, actual air 9.975652, dry flue gas 8.999152 and wet flue gas 11.032152 kmol per kmol fuel; the stoichiometry lesson prints stoichAirPerKmolFuel 9.975652. 4.5228 and 10.426827 are the 1 row. A blank is refused with its own message.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-excess-air-and-stack-oxygen' and ord = 15;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m02-excess-air-and-stack-oxygen ord 15'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m02-excess-air-and-stack-oxygen ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A stack reading no oxygen at all: how does that first row of the table compare with the course''s stoichiometry?', options = '["Excess air 0.0000 percent and actual air 8.999152, the dry flue gas of that row.", "Excess air 4.5228 percent and actual air 10.426827, the first reading it answers.", "Excess air 0.0000 percent and actual air 9.975652, equal to stoichAirPerKmolFuel.", "A refusal, since a reading of 0 percent is read the same as a blank reading."]'::jsonb, explanation = 'The 0 row prints excess air 0.0000, actual air 9.975652, dry flue gas 8.999152 and wet flue gas 11.032152 kmol per kmol fuel; the stoichiometry lesson prints stoichAirPerKmolFuel 9.975652. 4.5228 and 10.426827 are the 1 row. A blank is refused with its own message.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm02-excess-air-and-stack-oxygen' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m02-excess-air-and-stack-oxygen ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m03-stack-loss-efficiency ord 7
  select case
           when prompt = 'The invented Isiokpo radiation and convection loss is raised from 1.8 to 2.5 percent. What current LHV efficiency does the stack loss section print?' and options = '["87.2029 percent", "86.4029 percent", "87.8476 percent", "85.7029 percent"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The radiation table prints 87.2029 at 1.0, 86.4029 at 1.8 and 85.7029 at 2.5 percent; 87.8476 is the target LHV row at 2.8 percent oxygen. The digest''s sentence over the table is that the radiation loss moves the efficiency one for one.' then 'old'
           when prompt = 'The invented Isiokpo radiation and convection loss is raised from 1.8 to 2.5 percent. What current LHV efficiency does the stack loss section print?' and options = '["87.2029 percent", "86.4029 percent", "87.8476 percent", "85.7029 percent"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The radiation table prints 87.2029 at 1.0, 86.4029 at 1.8 and 85.7029 at 2.5 percent; 87.8476 is the target LHV row at 2.8 percent oxygen. The course''s sentence over the table is that the radiation loss moves the efficiency one for one.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-stack-loss-efficiency' and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m03-stack-loss-efficiency ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m03-stack-loss-efficiency ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The invented Isiokpo radiation and convection loss is raised from 1.8 to 2.5 percent. What current LHV efficiency does the stack loss section print?', options = '["87.2029 percent", "86.4029 percent", "87.8476 percent", "85.7029 percent"]'::jsonb, explanation = 'The radiation table prints 87.2029 at 1.0, 86.4029 at 1.8 and 85.7029 at 2.5 percent; 87.8476 is the target LHV row at 2.8 percent oxygen. The course''s sentence over the table is that the radiation loss moves the efficiency one for one.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-stack-loss-efficiency' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m03-stack-loss-efficiency ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m03-stack-loss-efficiency ord 8
  select case
           when prompt = 'A radiation and convection loss of -3 is typed for the invented Isiokpo heater. What comes back?' and options = '["No refusal: the loss enters the ledger as typed, and the current LHV efficiency prints above the 87.2029 percent of the 1.0 row.", "REFUSED: The radiation and convection loss cannot be negative: a loss below zero would add to the efficiency.", "REFUSED: A radiation and convection loss is required and is not defaulted. It comes off a published chart against surface area and firing rate, which this module does not reproduce.", "No refusal: a negative loss is read as 0 and the unburned loss of 0.0000 is carried instead."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The stack loss section prints the call with -3 refused: "The radiation and convection loss cannot be negative: a loss below zero would add to the efficiency." SECTION 25 lists it among the rules in force: a negative radiation or unburned loss is refused.' then 'old'
           when prompt = 'A radiation and convection loss of -3 is typed for the invented Isiokpo heater. What comes back?' and options = '["No refusal: the loss enters the ledger as typed, and the current LHV efficiency prints above the 87.2029 percent of the 1.0 row.", "REFUSED: The radiation and convection loss cannot be negative: a loss below zero would add to the efficiency.", "REFUSED: A radiation and convection loss is required and is not defaulted. It comes off a published chart against surface area and firing rate, which this module does not reproduce.", "No refusal: a negative loss is read as 0 and the unburned loss of 0.0000 is carried instead."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The stack loss section prints the call with -3 refused: "The radiation and convection loss cannot be negative: a loss below zero would add to the efficiency." The course lists it among the rules in force: a negative radiation or unburned loss is refused.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-stack-loss-efficiency' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m03-stack-loss-efficiency ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m03-stack-loss-efficiency ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A radiation and convection loss of -3 is typed for the invented Isiokpo heater. What comes back?', options = '["No refusal: the loss enters the ledger as typed, and the current LHV efficiency prints above the 87.2029 percent of the 1.0 row.", "REFUSED: The radiation and convection loss cannot be negative: a loss below zero would add to the efficiency.", "REFUSED: A radiation and convection loss is required and is not defaulted. It comes off a published chart against surface area and firing rate, which this module does not reproduce.", "No refusal: a negative loss is read as 0 and the unburned loss of 0.0000 is carried instead."]'::jsonb, explanation = 'The stack loss section prints the call with -3 refused: "The radiation and convection loss cannot be negative: a loss below zero would add to the efficiency." The course lists it among the rules in force: a negative radiation or unburned loss is refused.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-stack-loss-efficiency' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m03-stack-loss-efficiency ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m03-stack-loss-efficiency ord 12
  select case
           when prompt = 'Which stack and combustion air temperatures does the stack loss section give the invented Isiokpo heater?' and options = '["Stack 238 C, combustion air 25 C", "Stack 238 C, combustion air 28 C", "Stack 400 C, combustion air 28 C", "Stack 28 C, combustion air 238 C"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The stack loss section: stack 238 C, combustion air 28 C, both invented. 25 C is the reference temperature of the typical latent heat and 400 C the top of the typical flue gas cp range (SECTION 1). The last pairing, 28 C for the stack and 238 C for the air, swaps the two.' then 'old'
           when prompt = 'Which stack and combustion air temperatures does the stack loss section give the invented Isiokpo heater?' and options = '["Stack 238 C, combustion air 25 C", "Stack 238 C, combustion air 28 C", "Stack 400 C, combustion air 28 C", "Stack 28 C, combustion air 238 C"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The stack loss section: stack 238 C, combustion air 28 C, both invented. 25 C is the reference temperature of the typical latent heat and 400 C the top of the typical flue gas cp range in the course''s constants. The last pairing, 28 C for the stack and 238 C for the air, swaps the two.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-stack-loss-efficiency' and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m03-stack-loss-efficiency ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m03-stack-loss-efficiency ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which stack and combustion air temperatures does the stack loss section give the invented Isiokpo heater?', options = '["Stack 238 C, combustion air 25 C", "Stack 238 C, combustion air 28 C", "Stack 400 C, combustion air 28 C", "Stack 28 C, combustion air 238 C"]'::jsonb, explanation = 'The stack loss section: stack 238 C, combustion air 28 C, both invented. 25 C is the reference temperature of the typical latent heat and 400 C the top of the typical flue gas cp range in the course''s constants. The last pairing, 28 C for the stack and 238 C for the air, swaps the two.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm03-stack-loss-efficiency' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m03-stack-loss-efficiency ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m04-what-tuning-is-worth ord 1
  select case
           when prompt = 'SECTION 14 prints the engine''s method for the saving from tuning the invented Isiokpo heater. Which ratio does it give?' and options = '["(target - current) / current", "(target - current) / target", "(target - current) / a hundred", "(target - current) / (target + current)"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The method, verbatim: "Fuel scales inversely with efficiency at the same duty, so the saving is (target - current) / target. Subtracting the efficiency percentages divides by a hundred instead of by the target efficiency, and understates the saving."' then 'old'
           when prompt = 'The course prints the engine''s method for the saving from tuning the invented Isiokpo heater. Which ratio does it give?' and options = '["(target - current) / current", "(target - current) / target", "(target - current) / a hundred", "(target - current) / (target + current)"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The method, verbatim: "Fuel scales inversely with efficiency at the same duty, so the saving is (target - current) / target. Subtracting the efficiency percentages divides by a hundred instead of by the target efficiency, and understates the saving."' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-what-tuning-is-worth' and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m04-what-tuning-is-worth ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m04-what-tuning-is-worth ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course prints the engine''s method for the saving from tuning the invented Isiokpo heater. Which ratio does it give?', options = '["(target - current) / current", "(target - current) / target", "(target - current) / a hundred", "(target - current) / (target + current)"]'::jsonb, explanation = 'The method, verbatim: "Fuel scales inversely with efficiency at the same duty, so the saving is (target - current) / target. Subtracting the efficiency percentages divides by a hundred instead of by the target efficiency, and understates the saving."'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-what-tuning-is-worth' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m04-what-tuning-is-worth ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m04-what-tuning-is-worth ord 2
  select case
           when prompt = 'The digest works the percentage-point shortcut on the invented Isiokpo figures, 410000 GJ a year on LHV. What does it print for it?' and options = '["5923.008 GJ a year, 819.363 GJ above the engine''s saving.", "6742.370 GJ a year, the same figure the engine returns.", "8337.934 GJ a year, the figure the 2.0 percent row prints.", "5923.008 GJ a year, 819.363 GJ below the engine''s saving."]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 14, computed here from the engine''s efficiencies: a saving fraction of 0.0144463600, which is 5923.008 GJ a year, 819.363 GJ below the engine''s saving. The engine''s own sentence says subtracting the percentages understates the saving. 6742.370 is annualEnergySavedGJ and 8337.934 the 2.0 row of the sweep.' then 'old'
           when prompt = 'The course works the percentage-point shortcut on the invented Isiokpo figures, 410000 GJ a year on LHV. What does it print for it?' and options = '["5923.008 GJ a year, 819.363 GJ above the engine''s saving.", "6742.370 GJ a year, the same figure the engine returns.", "8337.934 GJ a year, the figure the 2.0 percent row prints.", "5923.008 GJ a year, 819.363 GJ below the engine''s saving."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course, computed here from the engine''s efficiencies: a saving fraction of 0.0144463600, which is 5923.008 GJ a year, 819.363 GJ below the engine''s saving. The engine''s own sentence says subtracting the percentages understates the saving. 6742.370 is annualEnergySavedGJ and 8337.934 the 2.0 row of the sweep.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-what-tuning-is-worth' and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m04-what-tuning-is-worth ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m04-what-tuning-is-worth ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course works the percentage-point shortcut on the invented Isiokpo figures, 410000 GJ a year on LHV. What does it print for it?', options = '["5923.008 GJ a year, 819.363 GJ above the engine''s saving.", "6742.370 GJ a year, the same figure the engine returns.", "8337.934 GJ a year, the figure the 2.0 percent row prints.", "5923.008 GJ a year, 819.363 GJ below the engine''s saving."]'::jsonb, explanation = 'The course, computed here from the engine''s efficiencies: a saving fraction of 0.0144463600, which is 5923.008 GJ a year, 819.363 GJ below the engine''s saving. The engine''s own sentence says subtracting the percentages understates the saving. 6742.370 is annualEnergySavedGJ and 8337.934 the 2.0 row of the sweep.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-what-tuning-is-worth' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m04-what-tuning-is-worth ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m04-what-tuning-is-worth ord 3
  select case
           when prompt = 'Which figure in SECTION 14 is the saving fraction of the percentage-point shortcut, the digest''s own arithmetic on the invented Isiokpo efficiencies?' and options = '["0.0144463600", "0.0164448058", "0.0164763814", "6742.370"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 14 prints the shortcut''s fraction as 0.0144463600 and marks it computed here; the engine does not return it. 0.0164448058 is the engine''s fuelSavingFraction on LHV, 0.0164763814 the HHV fraction from the two HHV efficiencies of the stack loss section, and 6742.370 is annualEnergySavedGJ.' then 'old'
           when prompt = 'Which figure in the lesson is the saving fraction of the percentage-point shortcut, the course''s own arithmetic on the invented Isiokpo efficiencies?' and options = '["0.0144463600", "0.0164448058", "0.0164763814", "6742.370"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The lesson prints the shortcut''s fraction as 0.0144463600 and marks it computed here; the engine does not return it. 0.0164448058 is the engine''s fuelSavingFraction on LHV, 0.0164763814 the HHV fraction from the two HHV efficiencies of the stack loss section, and 6742.370 is annualEnergySavedGJ.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-what-tuning-is-worth' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m04-what-tuning-is-worth ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m04-what-tuning-is-worth ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which figure in the lesson is the saving fraction of the percentage-point shortcut, the course''s own arithmetic on the invented Isiokpo efficiencies?', options = '["0.0144463600", "0.0164448058", "0.0164763814", "6742.370"]'::jsonb, explanation = 'The lesson prints the shortcut''s fraction as 0.0144463600 and marks it computed here; the engine does not return it. 0.0164448058 is the engine''s fuelSavingFraction on LHV, 0.0164763814 the HHV fraction from the two HHV efficiencies of the stack loss section, and 6742.370 is annualEnergySavedGJ.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-what-tuning-is-worth' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m04-what-tuning-is-worth ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m04-what-tuning-is-worth ord 4
  select case
           when prompt = 'The invented Isiokpo tuning is asked for a target of 1.5 percent oxygen against the 2 percent floor declared after a combustion test. What does SECTION 14 print?' and options = '["REFUSED: The target stack oxygen is required, so that it can be checked against the declared safe floor.", "No refusal: the saving is printed above the 8337.934 GJ a year of the 2.0 row, with a note that the target sits below the floor.", "REFUSED: A target of 1.5 percent oxygen is below the 2 percent declared safe for this burner. Raise the target or re-declare the floor after a combustion test.", "REFUSED: A minimum safe stack oxygen is required and is not defaulted. Below some excess air a burner makes carbon monoxide, and where that point sits depends on the burner, the fuel and the draught control."]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 14 prints the 1.5 percent target refused with that sentence, naming both figures. The target-required refusal answers a blank target and the floor refusal a blank floor. The sweep prints no row below the floor.' then 'old'
           when prompt = 'The invented Isiokpo tuning is asked for a target of 1.5 percent oxygen against the 2 percent floor declared after a combustion test. What does the course print?' and options = '["REFUSED: The target stack oxygen is required, so that it can be checked against the declared safe floor.", "No refusal: the saving is printed above the 8337.934 GJ a year of the 2.0 row, with a note that the target sits below the floor.", "REFUSED: A target of 1.5 percent oxygen is below the 2 percent declared safe for this burner. Raise the target or re-declare the floor after a combustion test.", "REFUSED: A minimum safe stack oxygen is required and is not defaulted. Below some excess air a burner makes carbon monoxide, and where that point sits depends on the burner, the fuel and the draught control."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course prints the 1.5 percent target refused with that sentence, naming both figures. The target-required refusal answers a blank target and the floor refusal a blank floor. The sweep prints no row below the floor.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-what-tuning-is-worth' and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m04-what-tuning-is-worth ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m04-what-tuning-is-worth ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The invented Isiokpo tuning is asked for a target of 1.5 percent oxygen against the 2 percent floor declared after a combustion test. What does the course print?', options = '["REFUSED: The target stack oxygen is required, so that it can be checked against the declared safe floor.", "No refusal: the saving is printed above the 8337.934 GJ a year of the 2.0 row, with a note that the target sits below the floor.", "REFUSED: A target of 1.5 percent oxygen is below the 2 percent declared safe for this burner. Raise the target or re-declare the floor after a combustion test.", "REFUSED: A minimum safe stack oxygen is required and is not defaulted. Below some excess air a burner makes carbon monoxide, and where that point sits depends on the burner, the fuel and the draught control."]'::jsonb, explanation = 'The course prints the 1.5 percent target refused with that sentence, naming both figures. The target-required refusal answers a blank target and the floor refusal a blank floor. The sweep prints no row below the floor.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-what-tuning-is-worth' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m04-what-tuning-is-worth ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m04-what-tuning-is-worth ord 5
  select case
           when prompt = 'A tuning call for the invented Isiokpo heater gives a current reading and a safe floor but leaves the target empty. Which answer comes back from excessAirSaving?' and options = '["No refusal: the target is taken at the 2 percent floor and the saving prints as 8337.934 GJ a year.", "REFUSED: The target stack oxygen is required, so that it can be checked against the declared safe floor.", "No refusal: the target is taken at 2.8 percent, the Isiokpo case, and the saving prints as 6742.370 GJ.", "REFUSED: The two efficiencies are on different bases (LHV and HHV) and cannot be compared."]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 14 prints the blank target refused with that sentence. 8337.934 GJ is the 2.0 row and 6742.370 GJ the 2.8 row, each a typed target. The different-bases refusal answers a current efficiency on LHV with a target on HHV.' then 'old'
           when prompt = 'A tuning call for the invented Isiokpo heater gives a current reading and a safe floor but leaves the target empty. Which answer comes back from excessAirSaving?' and options = '["No refusal: the target is taken at the 2 percent floor and the saving prints as 8337.934 GJ a year.", "REFUSED: The target stack oxygen is required, so that it can be checked against the declared safe floor.", "No refusal: the target is taken at 2.8 percent, the Isiokpo case, and the saving prints as 6742.370 GJ.", "REFUSED: The two efficiencies are on different bases (LHV and HHV) and cannot be compared."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course prints the blank target refused with that sentence. 8337.934 GJ is the 2.0 row and 6742.370 GJ the 2.8 row, each a typed target. The different-bases refusal answers a current efficiency on LHV with a target on HHV.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-what-tuning-is-worth' and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m04-what-tuning-is-worth ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m04-what-tuning-is-worth ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A tuning call for the invented Isiokpo heater gives a current reading and a safe floor but leaves the target empty. Which answer comes back from excessAirSaving?', options = '["No refusal: the target is taken at the 2 percent floor and the saving prints as 8337.934 GJ a year.", "REFUSED: The target stack oxygen is required, so that it can be checked against the declared safe floor.", "No refusal: the target is taken at 2.8 percent, the Isiokpo case, and the saving prints as 6742.370 GJ.", "REFUSED: The two efficiencies are on different bases (LHV and HHV) and cannot be compared."]'::jsonb, explanation = 'The course prints the blank target refused with that sentence. 8337.934 GJ is the 2.0 row and 6742.370 GJ the 2.8 row, each a typed target. The different-bases refusal answers a current efficiency on LHV with a target on HHV.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-what-tuning-is-worth' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m04-what-tuning-is-worth ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m04-what-tuning-is-worth ord 6
  select case
           when prompt = 'excessAirSaving is given a current efficiency on LHV and a target efficiency on HHV for the invented Isiokpo heater. What does SECTION 14 print?' and options = '["No refusal: the engine converts the HHV target to LHV and prints fuelSavingPercent 1.6445.", "No refusal: basis HHV and a fuelSavingPercent of 1.6476, the HHV fraction as a percent.", "REFUSED: The target stack oxygen is required, so that it can be checked against the declared safe floor.", "REFUSED: The two efficiencies are on different bases (LHV and HHV) and cannot be compared."]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 14 prints the mixed pair refused with that sentence. 1.6445 is the LHV fuelSavingPercent from two LHV efficiencies and 1.6476 the HHV figure from two HHV efficiencies. The target-required refusal answers a blank target.' then 'old'
           when prompt = 'excessAirSaving is given a current efficiency on LHV and a target efficiency on HHV for the invented Isiokpo heater. What does the course print?' and options = '["No refusal: the engine converts the HHV target to LHV and prints fuelSavingPercent 1.6445.", "No refusal: basis HHV and a fuelSavingPercent of 1.6476, the HHV fraction as a percent.", "REFUSED: The target stack oxygen is required, so that it can be checked against the declared safe floor.", "REFUSED: The two efficiencies are on different bases (LHV and HHV) and cannot be compared."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course prints the mixed pair refused with that sentence. 1.6445 is the LHV fuelSavingPercent from two LHV efficiencies and 1.6476 the HHV figure from two HHV efficiencies. The target-required refusal answers a blank target.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-what-tuning-is-worth' and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m04-what-tuning-is-worth ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m04-what-tuning-is-worth ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'excessAirSaving is given a current efficiency on LHV and a target efficiency on HHV for the invented Isiokpo heater. What does the course print?', options = '["No refusal: the engine converts the HHV target to LHV and prints fuelSavingPercent 1.6445.", "No refusal: basis HHV and a fuelSavingPercent of 1.6476, the HHV fraction as a percent.", "REFUSED: The target stack oxygen is required, so that it can be checked against the declared safe floor.", "REFUSED: The two efficiencies are on different bases (LHV and HHV) and cannot be compared."]'::jsonb, explanation = 'The course prints the mixed pair refused with that sentence. 1.6445 is the LHV fuelSavingPercent from two LHV efficiencies and 1.6476 the HHV figure from two HHV efficiencies. The target-required refusal answers a blank target.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-what-tuning-is-worth' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m04-what-tuning-is-worth ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m04-what-tuning-is-worth ord 8
  select case
           when prompt = 'Which target row of the SECTION 14 sweep sits on the declared 2 percent floor of the invented Isiokpo burner, and what does it save a year?' and options = '["The 2.0 row, 8337.934 GJ a year", "The 2.8 row, 6742.370 GJ a year", "The 3.5 row, 5214.422 GJ a year", "The 1.5 row, a saving above 8337.934 GJ"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The sweep prints targets of 2.0, 2.8, 3.5 and 4.5 percent, every one at or above the declared floor, and the 2.0 row saves 8337.934 GJ a year at 88.1965 percent on LHV. A target of 1.5 percent against the 2 percent floor is refused.' then 'old'
           when prompt = 'Which target row of the course''s sweep sits on the declared 2 percent floor of the invented Isiokpo burner, and what does it save a year?' and options = '["The 2.0 row, 8337.934 GJ a year", "The 2.8 row, 6742.370 GJ a year", "The 3.5 row, 5214.422 GJ a year", "The 1.5 row, a saving above 8337.934 GJ"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The sweep prints targets of 2.0, 2.8, 3.5 and 4.5 percent, every one at or above the declared floor, and the 2.0 row saves 8337.934 GJ a year at 88.1965 percent on LHV. A target of 1.5 percent against the 2 percent floor is refused.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-what-tuning-is-worth' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m04-what-tuning-is-worth ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m04-what-tuning-is-worth ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which target row of the course''s sweep sits on the declared 2 percent floor of the invented Isiokpo burner, and what does it save a year?', options = '["The 2.0 row, 8337.934 GJ a year", "The 2.8 row, 6742.370 GJ a year", "The 3.5 row, 5214.422 GJ a year", "The 1.5 row, a saving above 8337.934 GJ"]'::jsonb, explanation = 'The sweep prints targets of 2.0, 2.8, 3.5 and 4.5 percent, every one at or above the declared floor, and the 2.0 row saves 8337.934 GJ a year at 88.1965 percent on LHV. A target of 1.5 percent against the 2 percent floor is refused.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-what-tuning-is-worth' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m04-what-tuning-is-worth ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m04-what-tuning-is-worth ord 9
  select case
           when prompt = 'How does excessAirSaving arrive at annualEnergySavedGJ 6742.370 for the invented Isiokpo heater?' and options = '["It multiplies the shortcut fraction 0.0144463600 by the 410000 GJ of fuel a year it is given.", "It multiplies fuelSavingFraction 0.0164448058 by the 410000 GJ of fuel a year it is given.", "It multiplies fuelSavingPercent 1.6445 by the heater''s duty, taken from the fuel analysis.", "It divides the 410000 GJ a year by the target efficiency of 87.8476 and subtracts the fuel."]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 14 prints the fraction, 0.0164448058, and the fuel it is applied to, 410000 GJ a year on LHV (invented); annualEnergySavedGJ is 6742.370. The digest''s shortcut applies 0.0144463600 to the same fuel and gets 5923.008 GJ.' then 'old'
           when prompt = 'How does excessAirSaving arrive at annualEnergySavedGJ 6742.370 for the invented Isiokpo heater?' and options = '["It multiplies the shortcut fraction 0.0144463600 by the 410000 GJ of fuel a year it is given.", "It multiplies fuelSavingFraction 0.0164448058 by the 410000 GJ of fuel a year it is given.", "It multiplies fuelSavingPercent 1.6445 by the heater''s duty, taken from the fuel analysis.", "It divides the 410000 GJ a year by the target efficiency of 87.8476 and subtracts the fuel."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course prints the fraction, 0.0164448058, and the fuel it is applied to, 410000 GJ a year on LHV (invented); annualEnergySavedGJ is 6742.370. The course''s shortcut applies 0.0144463600 to the same fuel and gets 5923.008 GJ.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-what-tuning-is-worth' and ord = 9;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m04-what-tuning-is-worth ord 9'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m04-what-tuning-is-worth ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'How does excessAirSaving arrive at annualEnergySavedGJ 6742.370 for the invented Isiokpo heater?', options = '["It multiplies the shortcut fraction 0.0144463600 by the 410000 GJ of fuel a year it is given.", "It multiplies fuelSavingFraction 0.0164448058 by the 410000 GJ of fuel a year it is given.", "It multiplies fuelSavingPercent 1.6445 by the heater''s duty, taken from the fuel analysis.", "It divides the 410000 GJ a year by the target efficiency of 87.8476 and subtracts the fuel."]'::jsonb, explanation = 'The course prints the fraction, 0.0164448058, and the fuel it is applied to, 410000 GJ a year on LHV (invented); annualEnergySavedGJ is 6742.370. The course''s shortcut applies 0.0144463600 to the same fuel and gets 5923.008 GJ.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-what-tuning-is-worth' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m04-what-tuning-is-worth ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m04-what-tuning-is-worth ord 10
  select case
           when prompt = 'SECTION 14 prints a saving fraction of 0.0164763814 for the same invented tuning on HHV. What does it say about the fuel figure that fraction multiplies?' and options = '["The engine converts the 410000 GJ to HHV before it multiplies, so the basis always matches.", "The engine refuses any annual fuel figure that is not labelled with its heating value basis.", "The engine takes the fuel on HHV from the typical 890.8 and prints an annual HHV saving.", "The engine multiplies the fraction by the fuel it is given, and matching its basis is the caller''s job."]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 14: "The engine multiplies a saving fraction by the annual fuel it is given, and the basis of that fuel figure is the caller''s to match." It prints no annual HHV saving in gigajoules, and the 410000 GJ it prints is stated on LHV.' then 'old'
           when prompt = 'The course prints a saving fraction of 0.0164763814 for the same invented tuning on HHV. What does it say about the fuel figure that fraction multiplies?' and options = '["The engine converts the 410000 GJ to HHV before it multiplies, so the basis always matches.", "The engine refuses any annual fuel figure that is not labelled with its heating value basis.", "The engine takes the fuel on HHV from the typical 890.8 and prints an annual HHV saving.", "The engine multiplies the fraction by the fuel it is given, and matching its basis is the caller''s job."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course states: "The engine multiplies a saving fraction by the annual fuel it is given, and the basis of that fuel figure is the caller''s to match." It prints no annual HHV saving in gigajoules, and the 410000 GJ it prints is stated on LHV.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-what-tuning-is-worth' and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m04-what-tuning-is-worth ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m04-what-tuning-is-worth ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course prints a saving fraction of 0.0164763814 for the same invented tuning on HHV. What does it say about the fuel figure that fraction multiplies?', options = '["The engine converts the 410000 GJ to HHV before it multiplies, so the basis always matches.", "The engine refuses any annual fuel figure that is not labelled with its heating value basis.", "The engine takes the fuel on HHV from the typical 890.8 and prints an annual HHV saving.", "The engine multiplies the fraction by the fuel it is given, and matching its basis is the caller''s job."]'::jsonb, explanation = 'The course states: "The engine multiplies a saving fraction by the annual fuel it is given, and the basis of that fuel figure is the caller''s to match." It prints no annual HHV saving in gigajoules, and the 410000 GJ it prints is stated on LHV.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-what-tuning-is-worth' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m04-what-tuning-is-worth ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m04-what-tuning-is-worth ord 12
  select case
           when prompt = 'What fuelSavingPercent does SECTION 14 print for the same invented tuning, 5.5 to 2.8 percent oxygen, on HHV?' and options = '["1.6445", "2.0336", "1.6476", "1.2718"]'::jsonb and answer_index = 2 and explanation is not distinct from 'On HHV the same tuning is a saving fraction of 0.0164763814, fuelSavingPercent 1.6476, computed from the two HHV efficiencies of the stack loss section. 1.6445 is the LHV figure, 2.0336 and 1.2718 the 2.0 and 3.5 rows of the LHV sweep.' then 'old'
           when prompt = 'What fuelSavingPercent does the course print for the same invented tuning, 5.5 to 2.8 percent oxygen, on HHV?' and options = '["1.6445", "2.0336", "1.6476", "1.2718"]'::jsonb and answer_index = 2 and explanation is not distinct from 'On HHV the same tuning is a saving fraction of 0.0164763814, fuelSavingPercent 1.6476, computed from the two HHV efficiencies of the stack loss section. 1.6445 is the LHV figure, 2.0336 and 1.2718 the 2.0 and 3.5 rows of the LHV sweep.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-what-tuning-is-worth' and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m04-what-tuning-is-worth ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m04-what-tuning-is-worth ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What fuelSavingPercent does the course print for the same invented tuning, 5.5 to 2.8 percent oxygen, on HHV?', options = '["1.6445", "2.0336", "1.6476", "1.2718"]'::jsonb, explanation = 'On HHV the same tuning is a saving fraction of 0.0164763814, fuelSavingPercent 1.6476, computed from the two HHV efficiencies of the stack loss section. 1.6445 is the LHV figure, 2.0336 and 1.2718 the 2.0 and 3.5 rows of the LHV sweep.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-what-tuning-is-worth' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m04-what-tuning-is-worth ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m04-what-tuning-is-worth ord 15
  select case
           when prompt = 'What basis does the SECTION 14 output carry for the invented Isiokpo tuning, and on what basis is its 410000 GJ of fuel a year stated?' and options = '["Basis LHV, with the fuel stated on LHV.", "Basis HHV, with the fuel stated on LHV.", "Basis LHV, with the fuel stated on HHV.", "No basis output; fuel stated on HHV."]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 14''s output table prints basis LHV, and its inputs are 410000 GJ of fuel a year on LHV (invented). The two efficiencies it takes, 86.4029 and 87.8476, are the LHV rows of the stack loss section.' then 'old'
           when prompt = 'What basis does the course''s output carry for the invented Isiokpo tuning, and on what basis is its 410000 GJ of fuel a year stated?' and options = '["Basis LHV, with the fuel stated on LHV.", "Basis HHV, with the fuel stated on LHV.", "Basis LHV, with the fuel stated on HHV.", "No basis output; fuel stated on HHV."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course''s output table prints basis LHV, and its inputs are 410000 GJ of fuel a year on LHV (invented). The two efficiencies it takes, 86.4029 and 87.8476, are the LHV rows of the stack loss section.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-what-tuning-is-worth' and ord = 15;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m04-what-tuning-is-worth ord 15'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m04-what-tuning-is-worth ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What basis does the course''s output carry for the invented Isiokpo tuning, and on what basis is its 410000 GJ of fuel a year stated?', options = '["Basis LHV, with the fuel stated on LHV.", "Basis HHV, with the fuel stated on LHV.", "Basis LHV, with the fuel stated on HHV.", "No basis output; fuel stated on HHV."]'::jsonb, explanation = 'The course''s output table prints basis LHV, and its inputs are 410000 GJ of fuel a year on LHV (invented). The two efficiencies it takes, 86.4029 and 87.8476, are the LHV rows of the stack loss section.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm04-what-tuning-is-worth' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m04-what-tuning-is-worth ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m05-steam-condensate-and-the-pinch ord 1
  select case
           when prompt = 'SECTION 15 prints the engine''s choked-flow note for the invented Isiokpo trap at an isentropic exponent of 1.3. Which critical ratio does it name?' and options = '["0.5774", "0.1126", "0.5457", "0.555556"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The note at 1.3, verbatim: "Choked flow: the pressure ratio 0.1126 is at or below the critical 0.5457, so the loss depends on the upstream pressure alone." At 1.135 the note names the critical 0.5774. 0.555556 is the pressure ratio of a trap discharging at 5 bar a.' then 'old'
           when prompt = 'The course prints the engine''s choked-flow note for the invented Isiokpo trap at an isentropic exponent of 1.3. Which critical ratio does it name?' and options = '["0.5774", "0.1126", "0.5457", "0.555556"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The note at 1.3, verbatim: "Choked flow: the pressure ratio 0.1126 is at or below the critical 0.5457, so the loss depends on the upstream pressure alone." At 1.135 the note names the critical 0.5774. 0.555556 is the pressure ratio of a trap discharging at 5 bar a.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-steam-condensate-and-the-pinch' and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m05-steam-condensate-and-the-pinch ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m05-steam-condensate-and-the-pinch ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course prints the engine''s choked-flow note for the invented Isiokpo trap at an isentropic exponent of 1.3. Which critical ratio does it name?', options = '["0.5774", "0.1126", "0.5457", "0.555556"]'::jsonb, explanation = 'The note at 1.3, verbatim: "Choked flow: the pressure ratio 0.1126 is at or below the critical 0.5457, so the loss depends on the upstream pressure alone." At 1.135 the note names the critical 0.5774. 0.555556 is the pressure ratio of a trap discharging at 5 bar a.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-steam-condensate-and-the-pinch' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m05-steam-condensate-and-the-pinch ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m05-steam-condensate-and-the-pinch ord 2
  select case
           when prompt = '5 bar a sits downstream of the invented 9 bar a trap at an exponent of 1.135. Which choked flag and hourly loss does SECTION 15 pair with it?' and options = '["Choked true, 42.3520 kg an hour", "Choked false, 41.4785 kg an hour", "Choked false, 37.5765 kg an hour", "Choked true, 44.4620 kg an hour"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The 5 bar a row prints a pressure ratio of 0.555556 against a critical 0.577430, choked true and 42.3520 kg an hour, the same as the trap venting to atmosphere. 41.4785 and 37.5765 are the 6 and 7 bar a rows; 44.4620 is the trap at the superheated exponent of 1.3.' then 'old'
           when prompt = '5 bar a sits downstream of the invented 9 bar a trap at an exponent of 1.135. Which choked flag and hourly loss does the course pair with it?' and options = '["Choked true, 42.3520 kg an hour", "Choked false, 41.4785 kg an hour", "Choked false, 37.5765 kg an hour", "Choked true, 44.4620 kg an hour"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The 5 bar a row prints a pressure ratio of 0.555556 against a critical 0.577430, choked true and 42.3520 kg an hour, the same as the trap venting to atmosphere. 41.4785 and 37.5765 are the 6 and 7 bar a rows; 44.4620 is the trap at the superheated exponent of 1.3.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-steam-condensate-and-the-pinch' and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m05-steam-condensate-and-the-pinch ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m05-steam-condensate-and-the-pinch ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = '5 bar a sits downstream of the invented 9 bar a trap at an exponent of 1.135. Which choked flag and hourly loss does the course pair with it?', options = '["Choked true, 42.3520 kg an hour", "Choked false, 41.4785 kg an hour", "Choked false, 37.5765 kg an hour", "Choked true, 44.4620 kg an hour"]'::jsonb, explanation = 'The 5 bar a row prints a pressure ratio of 0.555556 against a critical 0.577430, choked true and 42.3520 kg an hour, the same as the trap venting to atmosphere. 41.4785 and 37.5765 are the 6 and 7 bar a rows; 44.4620 is the trap at the superheated exponent of 1.3.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-steam-condensate-and-the-pinch' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m05-steam-condensate-and-the-pinch ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m05-steam-condensate-and-the-pinch ord 3
  select case
           when prompt = 'At a downstream pressure of 8 bar a, how many tonnes of steam a year does SECTION 15 print the invented Isiokpo trap losing?' and options = '["315.643", "348.419", "355.757", "244.029"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The 8 bar a row prints a pressure ratio of 0.888889, choked false, 29.0510 kg an hour and 244.029 tonnes a year. 315.643 is the 7 bar a row, 348.419 the 6 bar a row and 355.757 every choked row.' then 'old'
           when prompt = 'At a downstream pressure of 8 bar a, how many tonnes of steam a year does the course print the invented Isiokpo trap losing?' and options = '["315.643", "348.419", "355.757", "244.029"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The 8 bar a row prints a pressure ratio of 0.888889, choked false, 29.0510 kg an hour and 244.029 tonnes a year. 315.643 is the 7 bar a row, 348.419 the 6 bar a row and 355.757 every choked row.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-steam-condensate-and-the-pinch' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m05-steam-condensate-and-the-pinch ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m05-steam-condensate-and-the-pinch ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'At a downstream pressure of 8 bar a, how many tonnes of steam a year does the course print the invented Isiokpo trap losing?', options = '["315.643", "348.419", "355.757", "244.029"]'::jsonb, explanation = 'The 8 bar a row prints a pressure ratio of 0.888889, choked false, 29.0510 kg an hour and 244.029 tonnes a year. 315.643 is the 7 bar a row, 348.419 the 6 bar a row and 355.757 every choked row.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-steam-condensate-and-the-pinch' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m05-steam-condensate-and-the-pinch ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m05-steam-condensate-and-the-pinch ord 4
  select case
           when prompt = 'The invented Isiokpo trap is given a downstream pressure of 9 bar a, the same as its upstream. What does steamTrapLoss answer?' and options = '["REFUSED: A downstream pressure is required when the box is there. Left out, a trap venting to atmosphere (1.01325 bar a) is the stated default.", "REFUSED: The downstream pressure (9 bar a) is not below the upstream pressure (9 bar a), so no steam flows through the trap.", "No refusal: the pressure ratio is 1, above the critical 0.577430, so choked is false and the loss is 29.0510 kg an hour.", "REFUSED: The downstream pressure must be an absolute pressure of zero or more, in bar a."]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 15 prints the 9 bar a call refused with that sentence. The required-box refusal answers a blank downstream box, the absolute-pressure refusal a downstream pressure of -1, and 29.0510 kg an hour is the 8 bar a row.' then 'old'
           when prompt = 'The invented Isiokpo trap is given a downstream pressure of 9 bar a, the same as its upstream. What does steamTrapLoss answer?' and options = '["REFUSED: A downstream pressure is required when the box is there. Left out, a trap venting to atmosphere (1.01325 bar a) is the stated default.", "REFUSED: The downstream pressure (9 bar a) is not below the upstream pressure (9 bar a), so no steam flows through the trap.", "No refusal: the pressure ratio is 1, above the critical 0.577430, so choked is false and the loss is 29.0510 kg an hour.", "REFUSED: The downstream pressure must be an absolute pressure of zero or more, in bar a."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course prints the 9 bar a call refused with that sentence. The required-box refusal answers a blank downstream box, the absolute-pressure refusal a downstream pressure of -1, and 29.0510 kg an hour is the 8 bar a row.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-steam-condensate-and-the-pinch' and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m05-steam-condensate-and-the-pinch ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m05-steam-condensate-and-the-pinch ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The invented Isiokpo trap is given a downstream pressure of 9 bar a, the same as its upstream. What does steamTrapLoss answer?', options = '["REFUSED: A downstream pressure is required when the box is there. Left out, a trap venting to atmosphere (1.01325 bar a) is the stated default.", "REFUSED: The downstream pressure (9 bar a) is not below the upstream pressure (9 bar a), so no steam flows through the trap.", "No refusal: the pressure ratio is 1, above the critical 0.577430, so choked is false and the loss is 29.0510 kg an hour.", "REFUSED: The downstream pressure must be an absolute pressure of zero or more, in bar a."]'::jsonb, explanation = 'The course prints the 9 bar a call refused with that sentence. The required-box refusal answers a blank downstream box, the absolute-pressure refusal a downstream pressure of -1, and 29.0510 kg an hour is the 8 bar a row.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-steam-condensate-and-the-pinch' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m05-steam-condensate-and-the-pinch ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m05-steam-condensate-and-the-pinch ord 5
  select case
           when prompt = 'steamTrapLoss is called for the invented Isiokpo trap with an isentropic exponent of 1. What does SECTION 15 print?' and options = '["No refusal: an exponent of 1 is read as dry saturated steam and the loss prints at 42.3520 kg an hour.", "REFUSED: A discharge coefficient in (0, 1] is required and is not defaulted: it depends on the orifice and on how the trap failed.", "REFUSED: An isentropic exponent above 1 is required: about 1.3 for superheated steam and about 1.135 for dry saturated steam.", "REFUSED: An orifice diameter, an upstream pressure and a steam density are required."]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 15 prints the same refusal for a blank exponent and for an exponent of 1. The discharge coefficient and orifice refusals answer those boxes left blank. 42.3520 kg an hour is the loss at the stated 1.135.' then 'old'
           when prompt = 'steamTrapLoss is called for the invented Isiokpo trap with an isentropic exponent of 1. What does the course print?' and options = '["No refusal: an exponent of 1 is read as dry saturated steam and the loss prints at 42.3520 kg an hour.", "REFUSED: A discharge coefficient in (0, 1] is required and is not defaulted: it depends on the orifice and on how the trap failed.", "REFUSED: An isentropic exponent above 1 is required: about 1.3 for superheated steam and about 1.135 for dry saturated steam.", "REFUSED: An orifice diameter, an upstream pressure and a steam density are required."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course prints the same refusal for a blank exponent and for an exponent of 1. The discharge coefficient and orifice refusals answer those boxes left blank. 42.3520 kg an hour is the loss at the stated 1.135.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-steam-condensate-and-the-pinch' and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m05-steam-condensate-and-the-pinch ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m05-steam-condensate-and-the-pinch ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'steamTrapLoss is called for the invented Isiokpo trap with an isentropic exponent of 1. What does the course print?', options = '["No refusal: an exponent of 1 is read as dry saturated steam and the loss prints at 42.3520 kg an hour.", "REFUSED: A discharge coefficient in (0, 1] is required and is not defaulted: it depends on the orifice and on how the trap failed.", "REFUSED: An isentropic exponent above 1 is required: about 1.3 for superheated steam and about 1.135 for dry saturated steam.", "REFUSED: An orifice diameter, an upstream pressure and a steam density are required."]'::jsonb, explanation = 'The course prints the same refusal for a blank exponent and for an exponent of 1. The discharge coefficient and orifice refusals answer those boxes left blank. 42.3520 kg an hour is the loss at the stated 1.135.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-steam-condensate-and-the-pinch' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m05-steam-condensate-and-the-pinch ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m05-steam-condensate-and-the-pinch ord 6
  select case
           when prompt = 'No boiler efficiency is typed for the invented Isiokpo trap. Which result comes back?' and options = '["355.757 tonnes of steam a year, with the fuel and the carbon 0.", "355.757 tonnes of steam a year, with fuel at a boiler efficiency of 1.", "REFUSED: A boiler efficiency in (0, 1] is required: the fuel saved depends on it and it is not assumed.", "355.757 tonnes of steam a year, with the fuel and the carbon none."]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 15: with the boiler efficiency blank the trap still loses 355.757 tonnes a year, and the fuel and carbon are none. fuelNote: "Fuel needs a boiler efficiency in (0, 1]. It is not assumed to be 1." carbonNote names what carbon needs and calls it absent without them. The refusal quoted is condensateReturnValue''s, in SECTION 16.' then 'old'
           when prompt = 'No boiler efficiency is typed for the invented Isiokpo trap. Which result comes back?' and options = '["355.757 tonnes of steam a year, with the fuel and the carbon 0.", "355.757 tonnes of steam a year, with fuel at a boiler efficiency of 1.", "REFUSED: A boiler efficiency in (0, 1] is required: the fuel saved depends on it and it is not assumed.", "355.757 tonnes of steam a year, with the fuel and the carbon none."]'::jsonb and answer_index = 3 and explanation is not distinct from 'In the course, with the boiler efficiency blank the trap still loses 355.757 tonnes a year, and the fuel and carbon are none. fuelNote: "Fuel needs a boiler efficiency in (0, 1]. It is not assumed to be 1." carbonNote names what carbon needs and calls it absent without them. The refusal quoted is condensateReturnValue''s, in the condensate lesson.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-steam-condensate-and-the-pinch' and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m05-steam-condensate-and-the-pinch ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m05-steam-condensate-and-the-pinch ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'No boiler efficiency is typed for the invented Isiokpo trap. Which result comes back?', options = '["355.757 tonnes of steam a year, with the fuel and the carbon 0.", "355.757 tonnes of steam a year, with fuel at a boiler efficiency of 1.", "REFUSED: A boiler efficiency in (0, 1] is required: the fuel saved depends on it and it is not assumed.", "355.757 tonnes of steam a year, with the fuel and the carbon none."]'::jsonb, explanation = 'In the course, with the boiler efficiency blank the trap still loses 355.757 tonnes a year, and the fuel and carbon are none. fuelNote: "Fuel needs a boiler efficiency in (0, 1]. It is not assumed to be 1." carbonNote names what carbon needs and calls it absent without them. The refusal quoted is condensateReturnValue''s, in the condensate lesson.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-steam-condensate-and-the-pinch' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m05-steam-condensate-and-the-pinch ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m05-steam-condensate-and-the-pinch ord 7
  select case
           when prompt = 'The hours argument is left out of the call entirely for the invented Isiokpo trap. What does SECTION 15 print?' and options = '["The stated default of 8760 hours, 371.004 tonnes a year.", "REFUSED: Hours in service a year are required, between 0 and 8784. A blank is not read as a full year.", "The record''s 8400 hours in service, 355.757 tonnes a year.", "The superheated row''s figure, 373.481 tonnes of steam a year."]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 15: hours left out of the call take the stated default of 8760, 371.004 tonnes a year. A blank hours box and a call with 9000 hours are refused: "Hours in service a year are required, between 0 and 8784. A blank is not read as a full year." 373.481 is the 1.3 exponent row at 8400 hours.' then 'old'
           when prompt = 'The hours argument is left out of the call entirely for the invented Isiokpo trap. What does the course print?' and options = '["The stated default of 8760 hours, 371.004 tonnes a year.", "REFUSED: Hours in service a year are required, between 0 and 8784. A blank is not read as a full year.", "The record''s 8400 hours in service, 355.757 tonnes a year.", "The superheated row''s figure, 373.481 tonnes of steam a year."]'::jsonb and answer_index = 0 and explanation is not distinct from 'In the course, hours left out of the call take the stated default of 8760, 371.004 tonnes a year. A blank hours box and a call with 9000 hours are refused: "Hours in service a year are required, between 0 and 8784. A blank is not read as a full year." 373.481 is the 1.3 exponent row at 8400 hours.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-steam-condensate-and-the-pinch' and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m05-steam-condensate-and-the-pinch ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m05-steam-condensate-and-the-pinch ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The hours argument is left out of the call entirely for the invented Isiokpo trap. What does the course print?', options = '["The stated default of 8760 hours, 371.004 tonnes a year.", "REFUSED: Hours in service a year are required, between 0 and 8784. A blank is not read as a full year.", "The record''s 8400 hours in service, 355.757 tonnes a year.", "The superheated row''s figure, 373.481 tonnes of steam a year."]'::jsonb, explanation = 'In the course, hours left out of the call take the stated default of 8760, 371.004 tonnes a year. A blank hours box and a call with 9000 hours are refused: "Hours in service a year are required, between 0 and 8784. A blank is not read as a full year." 373.481 is the 1.3 exponent row at 8400 hours.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-steam-condensate-and-the-pinch' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m05-steam-condensate-and-the-pinch ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m05-steam-condensate-and-the-pinch ord 8
  select case
           when prompt = 'SECTION 16 prices raising the invented Isiokpo condensate return from 0.35 to 0.65 with the treatment cost left blank. What does it print?' and options = '["annualValue 175835.28 USD, complete true, and no note.", "annualValue 121403.28 USD, complete false, and a floor note.", "annualValue 121403.28 USD, complete true, and no note.", "annualValue 175835.28 USD, complete false, and a floor note."]'::jsonb and answer_index = 1 and explanation is not distinct from 'With the treatment blank SECTION 16 prints annualValue 121403.28, complete false and the valueNote "A floor on the value: Treatment not repeated not priced. The treatment cost is the one usually left out." With treatment priced it prints 175835.28 and complete true.' then 'old'
           when prompt = 'The course prices raising the invented Isiokpo condensate return from 0.35 to 0.65 with the treatment cost left blank. What does it print?' and options = '["annualValue 175835.28 USD, complete true, and no note.", "annualValue 121403.28 USD, complete false, and a floor note.", "annualValue 121403.28 USD, complete true, and no note.", "annualValue 175835.28 USD, complete false, and a floor note."]'::jsonb and answer_index = 1 and explanation is not distinct from 'With the treatment blank the course prints annualValue 121403.28, complete false and the valueNote "A floor on the value: Treatment not repeated not priced. The treatment cost is the one usually left out." With treatment priced it prints 175835.28 and complete true.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-steam-condensate-and-the-pinch' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m05-steam-condensate-and-the-pinch ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m05-steam-condensate-and-the-pinch ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course prices raising the invented Isiokpo condensate return from 0.35 to 0.65 with the treatment cost left blank. What does it print?', options = '["annualValue 175835.28 USD, complete true, and no note.", "annualValue 121403.28 USD, complete false, and a floor note.", "annualValue 121403.28 USD, complete true, and no note.", "annualValue 175835.28 USD, complete false, and a floor note."]'::jsonb, explanation = 'With the treatment blank the course prints annualValue 121403.28, complete false and the valueNote "A floor on the value: Treatment not repeated not priced. The treatment cost is the one usually left out." With treatment priced it prints 175835.28 and complete true.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-steam-condensate-and-the-pinch' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m05-steam-condensate-and-the-pinch ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m05-steam-condensate-and-the-pinch ord 9
  select case
           when prompt = 'What carbon does the invented Isiokpo condensate case report once the treatment price is left blank?' and options = '["none, since the value is not complete", "63.721, the trap''s figure for its boiler", "742.220 priced and 0.000 left blank", "742.220, the same as with the treatment priced"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 16 prints annualTonnesCo2e 742.220 in both columns, on the SYNTHETIC factor of 56.1 kg CO2e per GJ. The treatment line, annualValue and complete differ between the columns. 63.721 tCO2e is the trap of SECTION 15.' then 'old'
           when prompt = 'What carbon does the invented Isiokpo condensate case report once the treatment price is left blank?' and options = '["none, since the value is not complete", "63.721, the trap''s figure for its boiler", "742.220 priced and 0.000 left blank", "742.220, the same as with the treatment priced"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course prints annualTonnesCo2e 742.220 in both columns, on the SYNTHETIC factor of 56.1 kg CO2e per GJ. The treatment line, annualValue and complete differ between the columns. 63.721 tCO2e is the trap in the steam trap lesson.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-steam-condensate-and-the-pinch' and ord = 9;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m05-steam-condensate-and-the-pinch ord 9'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m05-steam-condensate-and-the-pinch ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What carbon does the invented Isiokpo condensate case report once the treatment price is left blank?', options = '["none, since the value is not complete", "63.721, the trap''s figure for its boiler", "742.220 priced and 0.000 left blank", "742.220, the same as with the treatment priced"]'::jsonb, explanation = 'The course prints annualTonnesCo2e 742.220 in both columns, on the SYNTHETIC factor of 56.1 kg CO2e per GJ. The treatment line, annualValue and complete differ between the columns. 63.721 tCO2e is the trap in the steam trap lesson.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-steam-condensate-and-the-pinch' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m05-steam-condensate-and-the-pinch ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m05-steam-condensate-and-the-pinch ord 10
  select case
           when prompt = 'The invented Isiokpo condensate case is called with a target return of 0.25 against the current 0.35. What does condensateReturnValue answer?' and options = '["REFUSED: Return fractions must lie between 0 and 1.", "No refusal: a negative annualValue, with complete true and the fuel line printed below zero for the year.", "REFUSED: The target return (0.25) is below the current return (0.35). Returning less condensate is a cost, so there is nothing to value.", "REFUSED: A boiler efficiency in (0, 1] is required: the fuel saved depends on it and it is not assumed."]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 16 prints the 0.25 target refused with that sentence, and SECTION 25 lists a target condensate return below the current one as refused. No negative annualValue is printed. A target of 1.2 draws the return-fraction refusal, and a blank boiler efficiency the boiler refusal.' then 'old'
           when prompt = 'The invented Isiokpo condensate case is called with a target return of 0.25 against the current 0.35. What does condensateReturnValue answer?' and options = '["REFUSED: Return fractions must lie between 0 and 1.", "No refusal: a negative annualValue, with complete true and the fuel line printed below zero for the year.", "REFUSED: The target return (0.25) is below the current return (0.35). Returning less condensate is a cost, so there is nothing to value.", "REFUSED: A boiler efficiency in (0, 1] is required: the fuel saved depends on it and it is not assumed."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course prints the 0.25 target refused with that sentence, and its rules in force list a target condensate return below the current one as refused. No negative annualValue is printed. A target of 1.2 draws the return-fraction refusal, and a blank boiler efficiency the boiler refusal.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-steam-condensate-and-the-pinch' and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m05-steam-condensate-and-the-pinch ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m05-steam-condensate-and-the-pinch ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The invented Isiokpo condensate case is called with a target return of 0.25 against the current 0.35. What does condensateReturnValue answer?', options = '["REFUSED: Return fractions must lie between 0 and 1.", "No refusal: a negative annualValue, with complete true and the fuel line printed below zero for the year.", "REFUSED: The target return (0.25) is below the current return (0.35). Returning less condensate is a cost, so there is nothing to value.", "REFUSED: A boiler efficiency in (0, 1] is required: the fuel saved depends on it and it is not assumed."]'::jsonb, explanation = 'The course prints the 0.25 target refused with that sentence, and its rules in force list a target condensate return below the current one as refused. No negative annualValue is printed. A target of 1.2 draws the return-fraction refusal, and a blank boiler efficiency the boiler refusal.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-steam-condensate-and-the-pinch' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m05-steam-condensate-and-the-pinch ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m05-steam-condensate-and-the-pinch ord 11
  select case
           when prompt = 'At a minimum approach of 20 C, which utility targets does SECTION 17 print for the four invented Isiokpo streams?' and options = '["25.950 kW hot and 240.150 kW cold", "59.700 kW hot and 273.900 kW cold", "1.800 kW hot and 216.000 kW cold", "59.700 kW hot and 240.150 kW cold"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The 20 C row prints hot utility 59.700 kW and cold utility 273.900 kW. The 15 C row prints 25.950 and 240.150, and the 10 C row 1.800 and 216.000.' then 'old'
           when prompt = 'At a minimum approach of 20 C, which utility targets does the course print for the four invented Isiokpo streams?' and options = '["25.950 kW hot and 240.150 kW cold", "59.700 kW hot and 273.900 kW cold", "1.800 kW hot and 216.000 kW cold", "59.700 kW hot and 240.150 kW cold"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The 20 C row prints hot utility 59.700 kW and cold utility 273.900 kW. The 15 C row prints 25.950 and 240.150, and the 10 C row 1.800 and 216.000.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-steam-condensate-and-the-pinch' and ord = 11;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m05-steam-condensate-and-the-pinch ord 11'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m05-steam-condensate-and-the-pinch ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'At a minimum approach of 20 C, which utility targets does the course print for the four invented Isiokpo streams?', options = '["25.950 kW hot and 240.150 kW cold", "59.700 kW hot and 273.900 kW cold", "1.800 kW hot and 216.000 kW cold", "59.700 kW hot and 240.150 kW cold"]'::jsonb, explanation = 'The 20 C row prints hot utility 59.700 kW and cold utility 273.900 kW. The 15 C row prints 25.950 and 240.150, and the 10 C row 1.800 and 216.000.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-steam-condensate-and-the-pinch' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m05-steam-condensate-and-the-pinch ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m05-steam-condensate-and-the-pinch ord 12
  select case
           when prompt = 'SECTION 17 prints a threshold problem: one hot stream at 10 kW/K and one cold at 1 kW/K, at 10 C. Its heat flow is zero only at the top of the cascade. What does the engine report?' and options = '["No pinch, with threshold problem true.", "A pinch at shifted 195.000 C, threshold false.", "A pinch at shifted 35.000 C, threshold true.", "No pinch, with threshold problem false."]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 17 prints hot utility 0.000, cold utility 1470.000, pinch hot none and threshold problem true. The engine reports no pinch there: a zero at either end of the cascade is a threshold, and naming it a pinch would invent a constraint. SECTION 25: only an interior zero of the cascade is a pinch.' then 'old'
           when prompt = 'The course prints a threshold problem: one hot stream at 10 kW/K and one cold at 1 kW/K, at 10 C. Its heat flow is zero only at the top of the cascade. What does the engine report?' and options = '["No pinch, with threshold problem true.", "A pinch at shifted 195.000 C, threshold false.", "A pinch at shifted 35.000 C, threshold true.", "No pinch, with threshold problem false."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course prints hot utility 0.000, cold utility 1470.000, pinch hot none and threshold problem true. The engine reports no pinch there: a zero at either end of the cascade is a threshold, and naming it a pinch would invent a constraint. The course''s rules: only an interior zero of the cascade is a pinch.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-steam-condensate-and-the-pinch' and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m05-steam-condensate-and-the-pinch ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m05-steam-condensate-and-the-pinch ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course prints a threshold problem: one hot stream at 10 kW/K and one cold at 1 kW/K, at 10 C. Its heat flow is zero only at the top of the cascade. What does the engine report?', options = '["No pinch, with threshold problem true.", "A pinch at shifted 195.000 C, threshold false.", "A pinch at shifted 35.000 C, threshold true.", "No pinch, with threshold problem false."]'::jsonb, explanation = 'The course prints hot utility 0.000, cold utility 1470.000, pinch hot none and threshold problem true. The engine reports no pinch there: a zero at either end of the cascade is a threshold, and naming it a pinch would invent a constraint. The course''s rules: only an interior zero of the cascade is a pinch.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-steam-condensate-and-the-pinch' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m05-steam-condensate-and-the-pinch ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m05-steam-condensate-and-the-pinch ord 13
  select case
           when prompt = 'SECTION 17 prints the engine''s note on the pinch. What does it say heat carried across the pinch costs?' and options = '["One unit more hot utility, the cold utility unchanged.", "One unit more cold utility, the hot utility unchanged.", "Two units more hot utility and none of cold utility.", "One unit more hot utility and one unit more cold utility."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The note, verbatim: "Heat carried across the pinch costs twice: one unit more hot utility and one unit more cold utility." The note goes on to call the pinch the constraint.' then 'old'
           when prompt = 'The course prints the engine''s note on the pinch. What does it say heat carried across the pinch costs?' and options = '["One unit more hot utility, the cold utility unchanged.", "One unit more cold utility, the hot utility unchanged.", "Two units more hot utility and none of cold utility.", "One unit more hot utility and one unit more cold utility."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The note, verbatim: "Heat carried across the pinch costs twice: one unit more hot utility and one unit more cold utility." The note goes on to call the pinch the constraint.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-steam-condensate-and-the-pinch' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m05-steam-condensate-and-the-pinch ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m05-steam-condensate-and-the-pinch ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course prints the engine''s note on the pinch. What does it say heat carried across the pinch costs?', options = '["One unit more hot utility, the cold utility unchanged.", "One unit more cold utility, the hot utility unchanged.", "Two units more hot utility and none of cold utility.", "One unit more hot utility and one unit more cold utility."]'::jsonb, explanation = 'The note, verbatim: "Heat carried across the pinch costs twice: one unit more hot utility and one unit more cold utility." The note goes on to call the pinch the constraint.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-steam-condensate-and-the-pinch' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m05-steam-condensate-and-the-pinch ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m05-steam-condensate-and-the-pinch ord 15
  select case
           when prompt = 'In the SECTION 17 problem table at 15 C for the invented Isiokpo streams, where does the heat flow reach zero, and how is the pinch reported?' and options = '["At shifted 155.500 C, the top of the cascade: 163.000 C hot side, 148.500 C cold side.", "At shifted 110.500 C, inside the range: 118.000 C hot side, 103.000 C cold side.", "At shifted 33.500 C, the bottom of the cascade: 41.000 C hot side, 32.000 C cold side.", "At shifted 111.500 C, inside the range: 118.000 C hot side, 108.000 C cold side."]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 17: the heat flow is zero at shifted 110.500 C, inside the range: the pinch, 118.000 C on the hot side and 103.000 C on the cold side. The cascade starts at 155.500 with the hot utility 25.950 and ends at 33.500 with the cold utility 240.150. 108.000 C is the cold side pinch at 10 C.' then 'old'
           when prompt = 'In the course''s problem table at 15 C for the invented Isiokpo streams, where does the heat flow reach zero, and how is the pinch reported?' and options = '["At shifted 155.500 C, the top of the cascade: 163.000 C hot side, 148.500 C cold side.", "At shifted 110.500 C, inside the range: 118.000 C hot side, 103.000 C cold side.", "At shifted 33.500 C, the bottom of the cascade: 41.000 C hot side, 32.000 C cold side.", "At shifted 111.500 C, inside the range: 118.000 C hot side, 108.000 C cold side."]'::jsonb and answer_index = 1 and explanation is not distinct from 'In the course, the heat flow is zero at shifted 110.500 C, inside the range: the pinch, 118.000 C on the hot side and 103.000 C on the cold side. The cascade starts at 155.500 with the hot utility 25.950 and ends at 33.500 with the cold utility 240.150. 108.000 C is the cold side pinch at 10 C.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-steam-condensate-and-the-pinch' and ord = 15;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m05-steam-condensate-and-the-pinch ord 15'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m05-steam-condensate-and-the-pinch ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'In the course''s problem table at 15 C for the invented Isiokpo streams, where does the heat flow reach zero, and how is the pinch reported?', options = '["At shifted 155.500 C, the top of the cascade: 163.000 C hot side, 148.500 C cold side.", "At shifted 110.500 C, inside the range: 118.000 C hot side, 103.000 C cold side.", "At shifted 33.500 C, the bottom of the cascade: 41.000 C hot side, 32.000 C cold side.", "At shifted 111.500 C, inside the range: 118.000 C hot side, 108.000 C cold side."]'::jsonb, explanation = 'In the course, the heat flow is zero at shifted 110.500 C, inside the range: the pinch, 118.000 C on the hot side and 103.000 C on the cold side. The cascade starts at 155.500 with the hot utility 25.950 and ends at 33.500 with the cold utility 240.150. 108.000 C is the cold side pinch at 10 C.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm05-steam-condensate-and-the-pinch' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m05-steam-condensate-and-the-pinch ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m06-the-professional-reading ord 2
  select case
           when prompt = 'Across the invented Isiokpo steam and stream calls, which one does the engine answer in part while naming the gap?' and options = '["The condensate case with its boiler efficiency blank", "The condensate case with its treatment cost blank", "The trap with its isentropic exponent blank", "The pinch targets with the minimum approach blank"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The treatment-blank condensate case still prints a total and flags it as a floor (SECTION 16). The other three calls get no answer at all: SECTION 16 refuses a blank boiler efficiency, SECTION 15 a blank exponent, and SECTION 17 a blank minimum approach.' then 'old'
           when prompt = 'Across the invented Isiokpo steam and stream calls, which one does the engine answer in part while naming the gap?' and options = '["The condensate case with its boiler efficiency blank", "The condensate case with its treatment cost blank", "The trap with its isentropic exponent blank", "The pinch targets with the minimum approach blank"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The treatment-blank condensate case still prints a total and flags it as a floor. The other three calls get no answer at all: condensateReturnValue refuses a blank boiler efficiency, steamTrapLoss a blank exponent, and the pinch targets a blank minimum approach.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m06-the-professional-reading ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m06-the-professional-reading ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Across the invented Isiokpo steam and stream calls, which one does the engine answer in part while naming the gap?', options = '["The condensate case with its boiler efficiency blank", "The condensate case with its treatment cost blank", "The trap with its isentropic exponent blank", "The pinch targets with the minimum approach blank"]'::jsonb, explanation = 'The treatment-blank condensate case still prints a total and flags it as a floor. The other three calls get no answer at all: condensateReturnValue refuses a blank boiler efficiency, steamTrapLoss a blank exponent, and the pinch targets a blank minimum approach.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m06-the-professional-reading ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m06-the-professional-reading ord 3
  select case
           when prompt = 'A blank boiler efficiency reaches both the invented Isiokpo trap and the Isiokpo condensate case. What do SECTIONS 15 and 16 print?' and options = '["The trap keeps its steam figure and leaves fuel and carbon none; the condensate call is refused.", "Both are refused, each with the message that a boiler efficiency in (0, 1] is required.", "The condensate case reports its water lines with fuel none; the trap call is refused outright.", "Both take a boiler efficiency of 1 and name it in a note beside the fuel and the carbon."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The trap row with no boiler efficiency keeps its 355.757 tonnes a year and prints fuel and carbon as none (SECTION 15). For condensateReturnValue the same blank is one of SECTION 16''s four refusals, so no value prints.' then 'old'
           when prompt = 'A blank boiler efficiency reaches both the invented Isiokpo trap and the Isiokpo condensate case. What do the two lessons print?' and options = '["The trap keeps its steam figure and leaves fuel and carbon none; the condensate call is refused.", "Both are refused, each with the message that a boiler efficiency in (0, 1] is required.", "The condensate case reports its water lines with fuel none; the trap call is refused outright.", "Both take a boiler efficiency of 1 and name it in a note beside the fuel and the carbon."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The trap row with no boiler efficiency keeps its 355.757 tonnes a year and prints fuel and carbon as none. For condensateReturnValue the same blank is one of its four refusals, so no value prints.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m06-the-professional-reading ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m06-the-professional-reading ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A blank boiler efficiency reaches both the invented Isiokpo trap and the Isiokpo condensate case. What do the two lessons print?', options = '["The trap keeps its steam figure and leaves fuel and carbon none; the condensate call is refused.", "Both are refused, each with the message that a boiler efficiency in (0, 1] is required.", "The condensate case reports its water lines with fuel none; the trap call is refused outright.", "Both take a boiler efficiency of 1 and name it in a note beside the fuel and the carbon."]'::jsonb, explanation = 'The trap row with no boiler efficiency keeps its 355.757 tonnes a year and prints fuel and carbon as none. For condensateReturnValue the same blank is one of its four refusals, so no value prints.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m06-the-professional-reading ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m06-the-professional-reading ord 4
  select case
           when prompt = 'Across the invented Isiokpo steam calls, which of these gaps does SECTION 15 or 16 answer with a stated default?' and options = '["The trap''s hours box left blank, taken at 8760", "The condensate case''s hours box left blank, taken at 8400", "The trap''s hours left out of the call, taken at 8760", "The trap''s discharge coefficient left blank, taken at 1"]'::jsonb and answer_index = 2 and explanation is not distinct from 'Of these gaps only one draws a default: the trap''s hours absent from the call, which SECTION 15 answers with 8760 and 371.004 tonnes a year. Both hours boxes, the trap''s and the condensate case''s, are refused when present but blank (SECTIONS 15 and 16), and the discharge coefficient refusal says it is not defaulted.' then 'old'
           when prompt = 'Across the invented Isiokpo steam calls, which of these gaps does the course answer with a stated default?' and options = '["The trap''s hours box left blank, taken at 8760", "The condensate case''s hours box left blank, taken at 8400", "The trap''s hours left out of the call, taken at 8760", "The trap''s discharge coefficient left blank, taken at 1"]'::jsonb and answer_index = 2 and explanation is not distinct from 'Of these gaps only one draws a default: the trap''s hours absent from the call, which the course answers with 8760 and 371.004 tonnes a year. Both hours boxes, the trap''s and the condensate case''s, are refused when present but blank, and the discharge coefficient refusal says it is not defaulted.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m06-the-professional-reading ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m06-the-professional-reading ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Across the invented Isiokpo steam calls, which of these gaps does the course answer with a stated default?', options = '["The trap''s hours box left blank, taken at 8760", "The condensate case''s hours box left blank, taken at 8400", "The trap''s hours left out of the call, taken at 8760", "The trap''s discharge coefficient left blank, taken at 1"]'::jsonb, explanation = 'Of these gaps only one draws a default: the trap''s hours absent from the call, which the course answers with 8760 and 371.004 tonnes a year. Both hours boxes, the trap''s and the condensate case''s, are refused when present but blank, and the discharge coefficient refusal says it is not defaulted.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m06-the-professional-reading ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m06-the-professional-reading ord 5
  select case
           when prompt = 'Which of these Isiokpo figures is an engine output, where the digest marks the other three computed here?' and options = '["The 8.4741 point LHV and HHV gap", "The trap''s extra 17.724 tonnes a year", "The shortcut''s 5923.008 GJ a year", "annualEnergySavedGJ 6742.370"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 14''s output table prints annualEnergySavedGJ 6742.370. The stack loss section marks the 8.4741 point gap computed here, SECTION 15 the 17.724 tonnes a year between exponents, and SECTION 14 the shortcut''s 5923.008 GJ, which the engine does not return.' then 'old'
           when prompt = 'Which of these Isiokpo figures is an engine output, where the course marks the other three computed here?' and options = '["The 8.4741 point LHV and HHV gap", "The trap''s extra 17.724 tonnes a year", "The shortcut''s 5923.008 GJ a year", "annualEnergySavedGJ 6742.370"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The tuning lesson''s output table prints annualEnergySavedGJ 6742.370. The stack loss section marks the 8.4741 point gap computed here, the steam trap lesson the 17.724 tonnes a year between exponents, and the tuning lesson the shortcut''s 5923.008 GJ, which the engine does not return.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m06-the-professional-reading ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m06-the-professional-reading ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which of these Isiokpo figures is an engine output, where the course marks the other three computed here?', options = '["The 8.4741 point LHV and HHV gap", "The trap''s extra 17.724 tonnes a year", "The shortcut''s 5923.008 GJ a year", "annualEnergySavedGJ 6742.370"]'::jsonb, explanation = 'The tuning lesson''s output table prints annualEnergySavedGJ 6742.370. The stack loss section marks the 8.4741 point gap computed here, the steam trap lesson the 17.724 tonnes a year between exponents, and the tuning lesson the shortcut''s 5923.008 GJ, which the engine does not return.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m06-the-professional-reading ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m06-the-professional-reading ord 6
  select case
           when prompt = 'The invented Isiokpo trap''s downstream table in SECTION 15 ends with one sentence. Which?' and options = '["At or below the critical ratio the downstream pressure lowers the loss; above it the loss does not move with the downstream pressure.", "At or below the critical ratio the loss does not move with the downstream pressure; above it the downstream pressure lowers the loss.", "Above the critical ratio the downstream pressure raises the loss, and at or below it the loss depends on the downstream pressure alone.", "At every ratio the loss moves with the downstream pressure, and the critical ratio only marks where the flow note changes its words."]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 15 prints that sentence under the table: 42.3520 kg an hour at 1.01325, 3 and 5 bar a, all choked, then 41.4785, 37.5765 and 29.0510 at 6, 7 and 8 bar a, choked false.' then 'old'
           when prompt = 'The invented Isiokpo trap''s downstream table in the course ends with one sentence. Which?' and options = '["At or below the critical ratio the downstream pressure lowers the loss; above it the loss does not move with the downstream pressure.", "At or below the critical ratio the loss does not move with the downstream pressure; above it the downstream pressure lowers the loss.", "Above the critical ratio the downstream pressure raises the loss, and at or below it the loss depends on the downstream pressure alone.", "At every ratio the loss moves with the downstream pressure, and the critical ratio only marks where the flow note changes its words."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course prints that sentence under the table: 42.3520 kg an hour at 1.01325, 3 and 5 bar a, all choked, then 41.4785, 37.5765 and 29.0510 at 6, 7 and 8 bar a, choked false.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m06-the-professional-reading ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m06-the-professional-reading ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The invented Isiokpo trap''s downstream table in the course ends with one sentence. Which?', options = '["At or below the critical ratio the downstream pressure lowers the loss; above it the loss does not move with the downstream pressure.", "At or below the critical ratio the loss does not move with the downstream pressure; above it the downstream pressure lowers the loss.", "Above the critical ratio the downstream pressure raises the loss, and at or below it the loss depends on the downstream pressure alone.", "At every ratio the loss moves with the downstream pressure, and the critical ratio only marks where the flow note changes its words."]'::jsonb, explanation = 'The course prints that sentence under the table: 42.3520 kg an hour at 1.01325, 3 and 5 bar a, all choked, then 41.4785, 37.5765 and 29.0510 at 6, 7 and 8 bar a, choked false.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m06-the-professional-reading ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m06-the-professional-reading ord 7
  select case
           when prompt = 'SECTION 14 prints a saving fraction for the invented Isiokpo tuning on HHV. Which two efficiencies is it computed from?' and options = '["86.4029 and 87.8476, both on LHV", "77.9288 on HHV and 87.8476 percent on LHV", "77.9288 and 79.2343 percent, both on HHV", "86.4029 on LHV and 79.2343 on HHV"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 14: on HHV the same tuning is a saving fraction of 0.0164763814, computed from the two HHV efficiencies of the stack loss section, the current 77.9288 and the target 79.2343. A pair on mixed bases is refused: "The two efficiencies are on different bases (LHV and HHV) and cannot be compared."' then 'old'
           when prompt = 'The course prints a saving fraction for the invented Isiokpo tuning on HHV. Which two efficiencies is it computed from?' and options = '["86.4029 and 87.8476, both on LHV", "77.9288 on HHV and 87.8476 percent on LHV", "77.9288 and 79.2343 percent, both on HHV", "86.4029 on LHV and 79.2343 on HHV"]'::jsonb and answer_index = 2 and explanation is not distinct from 'In the course, on HHV the same tuning is a saving fraction of 0.0164763814, computed from the two HHV efficiencies of the stack loss section, the current 77.9288 and the target 79.2343. A pair on mixed bases is refused: "The two efficiencies are on different bases (LHV and HHV) and cannot be compared."' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m06-the-professional-reading ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m06-the-professional-reading ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course prints a saving fraction for the invented Isiokpo tuning on HHV. Which two efficiencies is it computed from?', options = '["86.4029 and 87.8476, both on LHV", "77.9288 on HHV and 87.8476 percent on LHV", "77.9288 and 79.2343 percent, both on HHV", "86.4029 on LHV and 79.2343 on HHV"]'::jsonb, explanation = 'In the course, on HHV the same tuning is a saving fraction of 0.0164763814, computed from the two HHV efficiencies of the stack loss section, the current 77.9288 and the target 79.2343. A pair on mixed bases is refused: "The two efficiencies are on different bases (LHV and HHV) and cannot be compared."'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m06-the-professional-reading ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m06-the-professional-reading ord 8
  select case
           when prompt = 'Four Isiokpo figures from SECTIONS 14 to 16 are set side by side. Which of them is an amount of carbon?' and options = '["742.220 tCO2e a year from the condensate", "6742.370 GJ a year saved by tuning", "355.757 tonnes a year of trap steam", "13230.304 GJ a year from condensate"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 16 prints annualTonnesCo2e 742.220 on the SYNTHETIC factor. 6742.370 GJ is SECTION 14''s LHV energy saved, 355.757 tonnes a year is steam lost by the trap in SECTION 15, and 13230.304 GJ is SECTION 16''s energySavedGJPerYear.' then 'old'
           when prompt = 'Four Isiokpo figures from the tuning, trap and condensate lessons are set side by side. Which of them is an amount of carbon?' and options = '["742.220 tCO2e a year from the condensate", "6742.370 GJ a year saved by tuning", "355.757 tonnes a year of trap steam", "13230.304 GJ a year from condensate"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The condensate lesson prints annualTonnesCo2e 742.220 on the SYNTHETIC factor. 6742.370 GJ is the tuning''s LHV energy saved, 355.757 tonnes a year is steam lost by the trap, and 13230.304 GJ is the condensate case''s energySavedGJPerYear.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m06-the-professional-reading ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m06-the-professional-reading ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Four Isiokpo figures from the tuning, trap and condensate lessons are set side by side. Which of them is an amount of carbon?', options = '["742.220 tCO2e a year from the condensate", "6742.370 GJ a year saved by tuning", "355.757 tonnes a year of trap steam", "13230.304 GJ a year from condensate"]'::jsonb, explanation = 'The condensate lesson prints annualTonnesCo2e 742.220 on the SYNTHETIC factor. 6742.370 GJ is the tuning''s LHV energy saved, 355.757 tonnes a year is steam lost by the trap, and 13230.304 GJ is the condensate case''s energySavedGJPerYear.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m06-the-professional-reading ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m06-the-professional-reading ord 11
  select case
           when prompt = 'Pricing a saving per tonne is governed by one of the rules in force. Which wording is it?' and options = '["The cost per tonne of a saving sets its capital against one year''s saving, and needs no rate.", "The cost per tonne of a saving is the simple payback, and needs a life but no discount rate.", "The cost per tonne of a saving is the levelised abatementCost, and needs a life and a rate.", "A saving, its price and its factor may sit on different heating value bases if each is named."]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 25 lists "The cost per tonne of a saving is the levelised abatementCost, and needs a life and a rate" and "A saving, its price and its factor declared on different heating value bases are refused".' then 'old'
           when prompt = 'Pricing a saving per tonne is governed by one of the rules in force. Which wording is it?' and options = '["The cost per tonne of a saving sets its capital against one year''s saving, and needs no rate.", "The cost per tonne of a saving is the simple payback, and needs a life but no discount rate.", "The cost per tonne of a saving is the levelised abatementCost, and needs a life and a rate.", "A saving, its price and its factor may sit on different heating value bases if each is named."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course''s rules in force list "The cost per tonne of a saving is the levelised abatementCost, and needs a life and a rate" and "A saving, its price and its factor declared on different heating value bases are refused".' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 11;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m06-the-professional-reading ord 11'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m06-the-professional-reading ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Pricing a saving per tonne is governed by one of the rules in force. Which wording is it?', options = '["The cost per tonne of a saving sets its capital against one year''s saving, and needs no rate.", "The cost per tonne of a saving is the simple payback, and needs a life but no discount rate.", "The cost per tonne of a saving is the levelised abatementCost, and needs a life and a rate.", "A saving, its price and its factor may sit on different heating value bases if each is named."]'::jsonb, explanation = 'The course''s rules in force list "The cost per tonne of a saving is the levelised abatementCost, and needs a life and a rate" and "A saving, its price and its factor declared on different heating value bases are refused".'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m06-the-professional-reading ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m06-the-professional-reading ord 12
  select case
           when prompt = 'SECTION 17 prints the invented Isiokpo pinch at approaches of 10, 15 and 20 C. What does the pinch do across those rows?' and options = '["The hot side stays at 118.000 C while the cold side reads 108.000, 103.000 and 98.000 C.", "Both sides stay put, 118.000 C on the hot side and 103.000 C on the cold side, at each row.", "The cold side stays at 103.000 C while the hot side reads 118.000, 110.500 and 98.000 C.", "The pinch appears only at 15 C; the 10 and 20 C rows print threshold problem true instead."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The three target rows print pinch hot 118.000 C each time and pinch cold 108.000, 103.000 and 98.000 C, with threshold problem false in every row. 110.500 is the shifted temperature of the 15 C zero.' then 'old'
           when prompt = 'The course prints the invented Isiokpo pinch at approaches of 10, 15 and 20 C. What does the pinch do across those rows?' and options = '["The hot side stays at 118.000 C while the cold side reads 108.000, 103.000 and 98.000 C.", "Both sides stay put, 118.000 C on the hot side and 103.000 C on the cold side, at each row.", "The cold side stays at 103.000 C while the hot side reads 118.000, 110.500 and 98.000 C.", "The pinch appears only at 15 C; the 10 and 20 C rows print threshold problem true instead."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The three target rows print pinch hot 118.000 C each time and pinch cold 108.000, 103.000 and 98.000 C, with threshold problem false in every row. 110.500 is the shifted temperature of the 15 C zero.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m06-the-professional-reading ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m06-the-professional-reading ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course prints the invented Isiokpo pinch at approaches of 10, 15 and 20 C. What does the pinch do across those rows?', options = '["The hot side stays at 118.000 C while the cold side reads 108.000, 103.000 and 98.000 C.", "Both sides stay put, 118.000 C on the hot side and 103.000 C on the cold side, at each row.", "The cold side stays at 103.000 C while the hot side reads 118.000, 110.500 and 98.000 C.", "The pinch appears only at 15 C; the 10 and 20 C rows print threshold problem true instead."]'::jsonb, explanation = 'The three target rows print pinch hot 118.000 C each time and pinch cold 108.000, 103.000 and 98.000 C, with threshold problem false in every row. 110.500 is the shifted temperature of the 15 C zero.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m06-the-professional-reading ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m06-the-professional-reading ord 13
  select case
           when prompt = 'In the heater chain from stack oxygen to tuning, which input does SECTION 14 say is declared after a combustion test?' and options = '["The current dry stack oxygen, 5.5 percent at Isiokpo.", "The target stack oxygen, 2.8 percent at Isiokpo.", "The stack temperature, 238 C at the invented heater.", "The minimum safe stack oxygen, 2 percent at Isiokpo."]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 14 prints a minimum safe stack oxygen of 2 percent declared after a combustion test (invented), and refuses it blank: "A minimum safe stack oxygen is required and is not defaulted." SECTION 12 asks for a measured dry stack oxygen, the 2.8 percent target is checked against the declared floor, and the 238 C stack is an invented input of the stack loss section.' then 'old'
           when prompt = 'In the heater chain from stack oxygen to tuning, which input does the course say is declared after a combustion test?' and options = '["The current dry stack oxygen, 5.5 percent at Isiokpo.", "The target stack oxygen, 2.8 percent at Isiokpo.", "The stack temperature, 238 C at the invented heater.", "The minimum safe stack oxygen, 2 percent at Isiokpo."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The tuning lesson prints a minimum safe stack oxygen of 2 percent declared after a combustion test (invented), and refuses it blank: "A minimum safe stack oxygen is required and is not defaulted." The excess air lesson asks for a measured dry stack oxygen, the 2.8 percent target is checked against the declared floor, and the 238 C stack is an invented input of the stack loss section.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m06-the-professional-reading ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m06-the-professional-reading ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'In the heater chain from stack oxygen to tuning, which input does the course say is declared after a combustion test?', options = '["The current dry stack oxygen, 5.5 percent at Isiokpo.", "The target stack oxygen, 2.8 percent at Isiokpo.", "The stack temperature, 238 C at the invented heater.", "The minimum safe stack oxygen, 2 percent at Isiokpo."]'::jsonb, explanation = 'The tuning lesson prints a minimum safe stack oxygen of 2 percent declared after a combustion test (invented), and refuses it blank: "A minimum safe stack oxygen is required and is not defaulted." The excess air lesson asks for a measured dry stack oxygen, the 2.8 percent target is checked against the declared floor, and the 238 C stack is an invented input of the stack loss section.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m06-the-professional-reading ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m06-the-professional-reading ord 14
  select case
           when prompt = 'A failed steam trap has its own rule in force. According to that row, what must a trap be given?' and options = '["A downstream pressure, a discharge coefficient and a steam price for every tonne.", "A boiler efficiency for fuel and carbon, an isentropic exponent, and hours a year.", "A boiler efficiency, a declared safe floor and a radiation and convection loss.", "An emission factor, an orifice diameter and a year of 8760 hours in service."]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 25: "A trap needs a boiler efficiency for fuel and carbon, an isentropic exponent, and hours a year", pointing at SECTION 15. The safe floor belongs to the tuning of SECTION 14 and the radiation loss to the stack loss section; 8760 hours is the stated default when hours are left out of the call.' then 'old'
           when prompt = 'A failed steam trap has its own rule in force. According to that row, what must a trap be given?' and options = '["A downstream pressure, a discharge coefficient and a steam price for every tonne.", "A boiler efficiency for fuel and carbon, an isentropic exponent, and hours a year.", "A boiler efficiency, a declared safe floor and a radiation and convection loss.", "An emission factor, an orifice diameter and a year of 8760 hours in service."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course''s rules in force: "A trap needs a boiler efficiency for fuel and carbon, an isentropic exponent, and hours a year", pointing at the steam trap lesson. The safe floor belongs to the tuning lesson and the radiation loss to the stack loss section; 8760 hours is the stated default when hours are left out of the call.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 14;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m06-the-professional-reading ord 14'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m06-the-professional-reading ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A failed steam trap has its own rule in force. According to that row, what must a trap be given?', options = '["A downstream pressure, a discharge coefficient and a steam price for every tonne.", "A boiler efficiency for fuel and carbon, an isentropic exponent, and hours a year.", "A boiler efficiency, a declared safe floor and a radiation and convection loss.", "An emission factor, an orifice diameter and a year of 8760 hours in service."]'::jsonb, explanation = 'The course''s rules in force: "A trap needs a boiler efficiency for fuel and carbon, an isentropic exponent, and hours a year", pointing at the steam trap lesson. The safe floor belongs to the tuning lesson and the radiation loss to the stack loss section; 8760 hours is the stated default when hours are left out of the call.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m06-the-professional-reading ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- intermediate m06-the-professional-reading ord 15
  select case
           when prompt = 'Every SECTION 17 target row for the four invented Isiokpo streams prints a balance check of 0.000. How does the digest define it?' and options = '["(hot utility plus cold utility) less (hot stream duty plus cold stream duty)", "(hot utility plus cold stream duty) less (cold utility plus hot stream duty)", "(hot utility plus hot stream duty) less (cold utility plus cold stream duty)", "(hot stream duty plus cold utility) less (hot utility plus cold stream duty)"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 17: the balance check is (hot utility plus hot stream duty) less (cold utility plus cold stream duty): heat in less heat out, 0.000 when the targets close. Heat recovered is the hot streams'' duty less the cold utility, 801.150 less 240.150 is 561.000 kW at 15 C.' then 'old'
           when prompt = 'Every pinch target row for the four invented Isiokpo streams prints a balance check of 0.000. How does the course define it?' and options = '["(hot utility plus cold utility) less (hot stream duty plus cold stream duty)", "(hot utility plus cold stream duty) less (cold utility plus hot stream duty)", "(hot utility plus hot stream duty) less (cold utility plus cold stream duty)", "(hot stream duty plus cold utility) less (hot utility plus cold stream duty)"]'::jsonb and answer_index = 2 and explanation is not distinct from 'In the course, the balance check is (hot utility plus hot stream duty) less (cold utility plus cold stream duty): heat in less heat out, 0.000 when the targets close. Heat recovered is the hot streams'' duty less the cold utility, 801.150 less 240.150 is 561.000 kW at 15 C.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 15;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for intermediate m06-the-professional-reading ord 15'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: intermediate m06-the-professional-reading ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Every pinch target row for the four invented Isiokpo streams prints a balance check of 0.000. How does the course define it?', options = '["(hot utility plus cold utility) less (hot stream duty plus cold stream duty)", "(hot utility plus cold stream duty) less (cold utility plus hot stream duty)", "(hot utility plus hot stream duty) less (cold utility plus cold stream duty)", "(hot stream duty plus cold utility) less (hot utility plus cold stream duty)"]'::jsonb, explanation = 'In the course, the balance check is (hot utility plus hot stream duty) less (cold utility plus cold stream duty): heat in less heat out, 0.000 when the targets close. Heat recovered is the hot streams'' duty less the cold utility, 801.150 less 240.150 is 561.000 kW at 15 C.'
     where app_slug = 'carbon' and tier = 'intermediate' and scope = 'module' and module_key is not distinct from 'm06-the-professional-reading' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: intermediate m06-the-professional-reading ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 1
  select case
           when prompt = 'Which invented AGBOR measure carries the capital recovery factor 0.40211480 at the rate of 0.1?' and options = '["Tune the fired heaters, over 5 years", "Vapour recovery on the storage tanks, over 12 years", "Repair failed steam traps, over 3 years", "Solar for purchased power, 20 years"]'::jsonb and answer_index = 2 and explanation is not distinct from 'Keyed from the factor column of SECTION 18: 0.40211480 sits on the 3 year row. Five years gives 0.26379748, twelve 0.14676332 and twenty 0.11745962.' then 'old'
           when prompt = 'Which invented AGBOR measure carries the capital recovery factor 0.40211480 at the rate of 0.1?' and options = '["Tune the fired heaters, over 5 years", "Vapour recovery on the storage tanks, over 12 years", "Repair failed steam traps, over 3 years", "Solar for purchased power, 20 years"]'::jsonb and answer_index = 2 and explanation is not distinct from 'Keyed from the factor column of the cost table: 0.40211480 sits on the 3 year row. Five years gives 0.26379748, twelve 0.14676332 and twenty 0.11745962.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced final ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced final ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which invented AGBOR measure carries the capital recovery factor 0.40211480 at the rate of 0.1?', options = '["Tune the fired heaters, over 5 years", "Vapour recovery on the storage tanks, over 12 years", "Repair failed steam traps, over 3 years", "Solar for purchased power, 20 years"]'::jsonb, explanation = 'Keyed from the factor column of the cost table: 0.40211480 sits on the 3 year row. Five years gives 0.26379748, twelve 0.14676332 and twenty 0.11745962.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced final ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 2
  select case
           when prompt = 'Which net annual cost and cost per tonne does SECTION 18 print for Solar for purchased power at 0.1?' and options = '["96300.31 net, 45.8573 per tonne", "217300.31 net, 45.8573 per tonne", "96300.31 net, -13.5714 per tonne", "65525.62 net, 35.4193 per tonne"]'::jsonb and answer_index = 0 and explanation is not distinct from 'Solar''s row: net 96300.31, per tonne 45.8573, both in USD. Its annualised capital is 217300.31; -13.5714 is its straight-line figure; 65525.62 with 35.4193 is the vapour recovery row.' then 'old'
           when prompt = 'Which net annual cost and cost per tonne does the cost table print for Solar for purchased power at 0.1?' and options = '["96300.31 net, 45.8573 per tonne", "217300.31 net, 45.8573 per tonne", "96300.31 net, -13.5714 per tonne", "65525.62 net, 35.4193 per tonne"]'::jsonb and answer_index = 0 and explanation is not distinct from 'Solar''s row: net 96300.31, per tonne 45.8573, both in USD. Its annualised capital is 217300.31; -13.5714 is its straight-line figure; 65525.62 with 35.4193 is the vapour recovery row.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced final ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced final ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which net annual cost and cost per tonne does the cost table print for Solar for purchased power at 0.1?', options = '["96300.31 net, 45.8573 per tonne", "217300.31 net, 45.8573 per tonne", "96300.31 net, -13.5714 per tonne", "65525.62 net, 35.4193 per tonne"]'::jsonb, explanation = 'Solar''s row: net 96300.31, per tonne 45.8573, both in USD. Its annualised capital is 217300.31; -13.5714 is its straight-line figure; 65525.62 with 35.4193 is the vapour recovery row.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced final ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 3
  select case
           when prompt = 'Vapour recovery on the storage tanks appears in SECTION 18 at 35.4193, 14.5045 and 316.7568 USD a tonne. Which figure does the curve rank it by?' and options = '["14.5045, straight line at a rate of 0", "316.7568, its capital against one year", "-29.7913, the plain mean of the curve", "35.4193, levelised at the rate of 0.1"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 20 ranks the measures cheapest first and prints order 4 at 35.4193, the cost per tonne at 0.1 in SECTION 18. 14.5045 is the rate-0 column, 316.7568 the capital-against-one-year column marked computed here, and -29.7913 the plain mean (computed here).' then 'old'
           when prompt = 'Vapour recovery on the storage tanks appears in the cost table at 35.4193, 14.5045 and 316.7568 USD a tonne. Which figure does the curve rank it by?' and options = '["14.5045, straight line at a rate of 0", "316.7568, its capital against one year", "-29.7913, the plain mean of the curve", "35.4193, levelised at the rate of 0.1"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The curve ranks the measures cheapest first and prints order 4 at 35.4193, the cost per tonne at 0.1 in the cost table. 14.5045 is the rate-0 column, 316.7568 the capital-against-one-year column marked computed here, and -29.7913 the plain mean (computed here).' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced final ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced final ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Vapour recovery on the storage tanks appears in the cost table at 35.4193, 14.5045 and 316.7568 USD a tonne. Which figure does the curve rank it by?', options = '["14.5045, straight line at a rate of 0", "316.7568, its capital against one year", "-29.7913, the plain mean of the curve", "35.4193, levelised at the rate of 0.1"]'::jsonb, explanation = 'The curve ranks the measures cheapest first and prints order 4 at 35.4193, the cost per tonne at 0.1 in the cost table. 14.5045 is the rate-0 column, 316.7568 the capital-against-one-year column marked computed here, and -29.7913 the plain mean (computed here).'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced final ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 4
  select case
           when prompt = 'What does the curve''s refusedNote say of a measure abatementCost refused?' and options = '["It is placed last on the curve at a cost per tonne of 0 USD.", "It is off the curve and out of every total until it is costed.", "It stays in totalAbatementTonnes and leaves the weighted average.", "It is costed at a capital of 0 and named in the assumedZero field."]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 19, the refusedNote verbatim: "A refused measure is off the curve and out of every total until it is costed." assumedZero names blank running figures only, and a refused measure is not placed on the curve at any cost.' then 'old'
           when prompt = 'What does the curve''s refusedNote say of a measure abatementCost refused?' and options = '["It is placed last on the curve at a cost per tonne of 0 USD.", "It is off the curve and out of every total until it is costed.", "It stays in totalAbatementTonnes and leaves the weighted average.", "It is costed at a capital of 0 and named in the assumedZero field."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The engine''s refusedNote verbatim: "A refused measure is off the curve and out of every total until it is costed." assumedZero names blank running figures only, and a refused measure is not placed on the curve at any cost.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced final ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced final ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does the curve''s refusedNote say of a measure abatementCost refused?', options = '["It is placed last on the curve at a cost per tonne of 0 USD.", "It is off the curve and out of every total until it is costed.", "It stays in totalAbatementTonnes and leaves the weighted average.", "It is costed at a capital of 0 and named in the assumedZero field."]'::jsonb, explanation = 'The engine''s refusedNote verbatim: "A refused measure is off the curve and out of every total until it is costed." assumedZero names blank running figures only, and a refused measure is not placed on the curve at any cost.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced final ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 5
  select case
           when prompt = 'An invented abatement of -500 t a year is sent for the Heat integration project. Which reasons does the refusal give?' and options = '["A measure that adds emissions is no abatement, and its cost per tonne would change sign.", "A blank abatement is not read as 0, which would move the measure down the curve.", "An abatement of -500 t exceeds what the heaters emit, so the claim is an over-claim.", "A negative abatement is read as 0, and the field is named in the assumedZero list."]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 19 gives two grounds: adding emissions is no abatement, and the sign of the per-tonne figure would flip. Over-claims are a curve check in SECTION 21, and assumedZero covers only running figures.' then 'old'
           when prompt = 'An invented abatement of -500 t a year is sent for the Heat integration project. Which reasons does the refusal give?' and options = '["A measure that adds emissions is no abatement, and its cost per tonne would change sign.", "A blank abatement is not read as 0, which would move the measure down the curve.", "An abatement of -500 t exceeds what the heaters emit, so the claim is an over-claim.", "A negative abatement is read as 0, and the field is named in the assumedZero list."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course gives two grounds: adding emissions is no abatement, and the sign of the per-tonne figure would flip. Over-claims are a check made on the curve, and assumedZero covers only running figures.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced final ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced final ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'An invented abatement of -500 t a year is sent for the Heat integration project. Which reasons does the refusal give?', options = '["A measure that adds emissions is no abatement, and its cost per tonne would change sign.", "A blank abatement is not read as 0, which would move the measure down the curve.", "An abatement of -500 t exceeds what the heaters emit, so the claim is an over-claim.", "A negative abatement is read as 0, and the field is named in the assumedZero list."]'::jsonb, explanation = 'The course gives two grounds: adding emissions is no abatement, and the sign of the per-tonne figure would flip. Over-claims are a check made on the curve, and assumedZero covers only running figures.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced final ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 7
  select case
           when prompt = 'The Agbor curve''s summary cost per tonne and the digest''s plain mean carry opposite signs. Which one does the engine return?' and options = '["The plain mean, -29.7913 USD", "weightedAverageCostPerTonne, 18.7868 USD", "netAnnualCostOfAll, 18.7868 USD", "The plain mean, 18.7868 USD a tonne"]'::jsonb and answer_index = 1 and explanation is not distinct from 'Only the weighted figure is an engine output. The unweighted -29.7913 is marked computed here, and netAnnualCostOfAll is a money total of 290443.84 USD.' then 'old'
           when prompt = 'The Agbor curve''s summary cost per tonne and the course''s plain mean carry opposite signs. Which one does the engine return?' and options = '["The plain mean, -29.7913 USD", "weightedAverageCostPerTonne, 18.7868 USD", "netAnnualCostOfAll, 18.7868 USD", "The plain mean, 18.7868 USD a tonne"]'::jsonb and answer_index = 1 and explanation is not distinct from 'Only the weighted figure is an engine output. The unweighted -29.7913 is marked computed here, and netAnnualCostOfAll is a money total of 290443.84 USD.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced final ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced final ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The Agbor curve''s summary cost per tonne and the course''s plain mean carry opposite signs. Which one does the engine return?', options = '["The plain mean, -29.7913 USD", "weightedAverageCostPerTonne, 18.7868 USD", "netAnnualCostOfAll, 18.7868 USD", "The plain mean, 18.7868 USD a tonne"]'::jsonb, explanation = 'Only the weighted figure is an engine output. The unweighted -29.7913 is marked computed here, and netAnnualCostOfAll is a money total of 290443.84 USD.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced final ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 8
  select case
           when prompt = 'Suppose every claim on a curve were checked and the only issue were two measures on one source. What does SECTION 21 say of the verdict?' and options = '["It is none, as the claims are not additive.", "It is none, and the basis names the source.", "It is refused until the overlap is sequenced.", "It stands, and is labelled an upper bound."]'::jsonb and answer_index = 3 and explanation is not distinct from 'Interaction alone, with every claim checked, leaves a standing verdict carrying the upper-bound label. A none belongs to over-claims and to claims on sources with no emission passed.' then 'old'
           when prompt = 'Suppose every claim on a curve were checked and the only issue were two measures on one source. What does the course say of the verdict?' and options = '["It is none, as the claims are not additive.", "It is none, and the basis names the source.", "It is refused until the overlap is sequenced.", "It stands, and is labelled an upper bound."]'::jsonb and answer_index = 3 and explanation is not distinct from 'Interaction alone, with every claim checked, leaves a standing verdict carrying the upper-bound label. A none belongs to over-claims and to claims on sources with no emission passed.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced final ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced final ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Suppose every claim on a curve were checked and the only issue were two measures on one source. What does the course say of the verdict?', options = '["It is none, as the claims are not additive.", "It is none, and the basis names the source.", "It is refused until the overlap is sequenced.", "It stands, and is labelled an upper bound."]'::jsonb, explanation = 'Interaction alone, with every claim checked, leaves a standing verdict carrying the upper-bound label. A none belongs to over-claims and to claims on sources with no emission passed.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced final ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 10
  select case
           when prompt = 'In the digest''s own words, what does raising a claim beyond its source''s emission do to how a measure looks?' and options = '["It makes the measure look cheaper as well as larger.", "It leaves the cost per tonne at 78.1002 USD a tonne.", "It raises the net annual cost to match the new tonnes.", "It refuses the measure until the claim is brought down."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The reading attached to the 9400 t costing: the per-tonne figure falls as tonnes rise, a cheaper as well as larger look, with 484221.51 USD of net annual cost unchanged.' then 'old'
           when prompt = 'In the course''s own words, what does raising a claim beyond its source''s emission do to how a measure looks?' and options = '["It makes the measure look cheaper as well as larger.", "It leaves the cost per tonne at 78.1002 USD a tonne.", "It raises the net annual cost to match the new tonnes.", "It refuses the measure until the claim is brought down."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The reading attached to the 9400 t costing: the per-tonne figure falls as tonnes rise, a cheaper as well as larger look, with 484221.51 USD of net annual cost unchanged.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced final ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced final ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'In the course''s own words, what does raising a claim beyond its source''s emission do to how a measure looks?', options = '["It makes the measure look cheaper as well as larger.", "It leaves the cost per tonne at 78.1002 USD a tonne.", "It raises the net annual cost to match the new tonnes.", "It refuses the measure until the claim is brought down."]'::jsonb, explanation = 'The reading attached to the 9400 t costing: the per-tonne figure falls as tonnes rise, a cheaper as well as larger look, with 484221.51 USD of net annual cost unchanged.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced final ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 17
  select case
           when prompt = 'When priceSaving calls abatementCost for the invented Agbor saving, which figure goes in as the abatement?' and options = '["The energy saving, 11800 GJ", "annualTonnesCo2e, 661.980", "annualValue, 88500.00 USD a year", "The SYNTHETIC factor, 56.1 kg CO2e per GJ"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The hand-over maps tonnes to the abatement slot. Money, 88500.00, fills the savings slot; the gigajoules and the factor are not among the three arguments the digest names.' then 'old'
           when prompt = 'When priceSaving calls abatementCost for the invented Agbor saving, which figure goes in as the abatement?' and options = '["The energy saving, 11800 GJ", "annualTonnesCo2e, 661.980", "annualValue, 88500.00 USD a year", "The SYNTHETIC factor, 56.1 kg CO2e per GJ"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The hand-over maps tonnes to the abatement slot. Money, 88500.00, fills the savings slot; the gigajoules and the factor are not among the three arguments the course names.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 17;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced final ord 17'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced final ord 17 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'When priceSaving calls abatementCost for the invented Agbor saving, which figure goes in as the abatement?', options = '["The energy saving, 11800 GJ", "annualTonnesCo2e, 661.980", "annualValue, 88500.00 USD a year", "The SYNTHETIC factor, 56.1 kg CO2e per GJ"]'::jsonb, explanation = 'The hand-over maps tonnes to the abatement slot. Money, 88500.00, fills the savings slot; the gigajoules and the factor are not among the three arguments the course names.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 17;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced final ord 17 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 22
  select case
           when prompt = 'Which heating value basis does priceSaving return for the invented Agbor saving?' and options = '["LHV, the basis all three quantities declare", "HHV, the basis the factor would need", "None, with the basisNote attached", "LHV for money and HHV for carbon"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 23: the saving, the fuel price and the factor are all declared on LHV, and the output table reads basis LHV. The basisNote is the no-basis-declared row, and a saving on LHV with a factor on HHV is refused.' then 'old'
           when prompt = 'Which heating value basis does priceSaving return for the invented Agbor saving?' and options = '["LHV, the basis all three quantities declare", "HHV, the basis the factor would need", "None, with the basisNote attached", "LHV for money and HHV for carbon"]'::jsonb and answer_index = 0 and explanation is not distinct from 'In the course, the saving, the fuel price and the factor are all declared on LHV, and the output table reads basis LHV. The basisNote is the no-basis-declared row, and a saving on LHV with a factor on HHV is refused.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 22;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced final ord 22'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced final ord 22 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which heating value basis does priceSaving return for the invented Agbor saving?', options = '["LHV, the basis all three quantities declare", "HHV, the basis the factor would need", "None, with the basisNote attached", "LHV for money and HHV for carbon"]'::jsonb, explanation = 'In the course, the saving, the fuel price and the factor are all declared on LHV, and the output table reads basis LHV. The basisNote is the no-basis-declared row, and a saving on LHV with a factor on HHV is refused.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 22;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced final ord 22 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 23
  select case
           when prompt = 'The flare''s emission is left out and the over-claims column on the 9400 t curve comes back empty. How is that empty column read?' and options = '["The flare''s 9400 t claim fits within what the flare emits.", "The curve found no over-claim, so it gives a verdict on the target.", "The flare''s claim was not checked, and the basis names the flare.", "The flare''s claim was refused and taken off the curve and totals."]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 21: "Where a claim acts on a source whose emission is not passed, it cannot be checked, the verdict is none and the basis names the source." That row prints the basis naming steam, flare, power, vents and a total abatement of 18660.000 t, so the claim stays on the curve.' then 'old'
           when prompt = 'The flare''s emission is left out and the over-claims column on the 9400 t curve comes back empty. How is that empty column read?' and options = '["The flare''s 9400 t claim fits within what the flare emits.", "The curve found no over-claim, so it gives a verdict on the target.", "The flare''s claim was not checked, and the basis names the flare.", "The flare''s claim was refused and taken off the curve and totals."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course states: "Where a claim acts on a source whose emission is not passed, it cannot be checked, the verdict is none and the basis names the source." That row prints the basis naming steam, flare, power, vents and a total abatement of 18660.000 t, so the claim stays on the curve.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 23;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced final ord 23'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced final ord 23 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The flare''s emission is left out and the over-claims column on the 9400 t curve comes back empty. How is that empty column read?', options = '["The flare''s 9400 t claim fits within what the flare emits.", "The curve found no over-claim, so it gives a verdict on the target.", "The flare''s claim was not checked, and the basis names the flare.", "The flare''s claim was refused and taken off the curve and totals."]'::jsonb, explanation = 'The course states: "Where a claim acts on a source whose emission is not passed, it cannot be checked, the verdict is none and the basis names the source." That row prints the basis naming steam, flare, power, vents and a total abatement of 18660.000 t, so the claim stays on the curve.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 23;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced final ord 23 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 24
  select case
           when prompt = 'What does SECTION 18 print for Solar for purchased power with the whole capital set against one year?' and options = '["764.5161 USD a tonne, in the one-year column", "823.3333 USD a tonne, in the one-year column", "-13.5714 USD a tonne, at a rate of 0", "45.8573 USD a tonne, at a rate of 0.1"]'::jsonb and answer_index = 1 and explanation is not distinct from 'Of SECTION 18''s two columns, the capital-against-one-year column is the one marked computed here: 823.3333 for Solar and 764.5161 for flare recovery. -13.5714 is Solar''s cost per tonne at a rate of 0 and 45.8573 its cost per tonne at 0.1.' then 'old'
           when prompt = 'What does the cost table print for Solar for purchased power with the whole capital set against one year?' and options = '["764.5161 USD a tonne, in the one-year column", "823.3333 USD a tonne, in the one-year column", "-13.5714 USD a tonne, at a rate of 0", "45.8573 USD a tonne, at a rate of 0.1"]'::jsonb and answer_index = 1 and explanation is not distinct from 'Of the cost table''s two columns, the capital-against-one-year column is the one marked computed here: 823.3333 for Solar and 764.5161 for flare recovery. -13.5714 is Solar''s cost per tonne at a rate of 0 and 45.8573 its cost per tonne at 0.1.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 24;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced final ord 24'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced final ord 24 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does the cost table print for Solar for purchased power with the whole capital set against one year?', options = '["764.5161 USD a tonne, in the one-year column", "823.3333 USD a tonne, in the one-year column", "-13.5714 USD a tonne, at a rate of 0", "45.8573 USD a tonne, at a rate of 0.1"]'::jsonb, explanation = 'Of the cost table''s two columns, the capital-against-one-year column is the one marked computed here: 823.3333 for Solar and 764.5161 for flare recovery. -13.5714 is Solar''s cost per tonne at a rate of 0 and 45.8573 its cost per tonne at 0.1.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 24;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced final ord 24 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 31
  select case
           when prompt = 'Which set of inputs does SECTION 18 print for Tune the fired heaters?' and options = '["Capital 18000 USD over 3 years, factor 0.40211480", "Capital 45000 USD over 5 years, factor 0.26379748", "Capital 18000 USD over 5 years, factor 0.26379748", "Capital 18000 USD over 5 years, factor 0.13147378"]'::jsonb and answer_index = 2 and explanation is not distinct from 'Heater tuning: 18000 of capital, a 5 year life, 0.26379748. The 3 year life and 45000 of capital belong to trap repair, and 0.13147378 to the two 15 year measures.' then 'old'
           when prompt = 'Which set of inputs does the cost table print for Tune the fired heaters?' and options = '["Capital 18000 USD over 3 years, factor 0.40211480", "Capital 45000 USD over 5 years, factor 0.26379748", "Capital 18000 USD over 5 years, factor 0.26379748", "Capital 18000 USD over 5 years, factor 0.13147378"]'::jsonb and answer_index = 2 and explanation is not distinct from 'Heater tuning: 18000 of capital, a 5 year life, 0.26379748. The 3 year life and 45000 of capital belong to trap repair, and 0.13147378 to the two 15 year measures.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 31;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced final ord 31'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced final ord 31 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which set of inputs does the cost table print for Tune the fired heaters?', options = '["Capital 18000 USD over 3 years, factor 0.40211480", "Capital 45000 USD over 5 years, factor 0.26379748", "Capital 18000 USD over 5 years, factor 0.26379748", "Capital 18000 USD over 5 years, factor 0.13147378"]'::jsonb, explanation = 'Heater tuning: 18000 of capital, a 5 year life, 0.26379748. The 3 year life and 45000 of capital belong to trap repair, and 0.13147378 to the two 15 year measures.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 31;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced final ord 31 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 32
  select case
           when prompt = 'What annual cost does SECTION 18 print for Vapour recovery on the storage tanks?' and options = '["14000 USD a year", "21000 USD a year", "105000 USD a year", "0 USD a year"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The running cost column: 14000 on the vapour row, 21000 on solar, 105000 on flare recovery and 0 on the three that pay for themselves.' then 'old'
           when prompt = 'What annual cost does the cost table print for Vapour recovery on the storage tanks?' and options = '["14000 USD a year", "21000 USD a year", "105000 USD a year", "0 USD a year"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The running cost column: 14000 on the vapour row, 21000 on solar, 105000 on flare recovery and 0 on the three that pay for themselves.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 32;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced final ord 32'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced final ord 32 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What annual cost does the cost table print for Vapour recovery on the storage tanks?', options = '["14000 USD a year", "21000 USD a year", "105000 USD a year", "0 USD a year"]'::jsonb, explanation = 'The running cost column: 14000 on the vapour row, 21000 on solar, 105000 on flare recovery and 0 on the three that pay for themselves.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 32;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced final ord 32 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 33
  select case
           when prompt = 'Which of these abatementCost calls returns costPerTonne none without refusing?' and options = '["The abatement left blank", "An abatement of -500 t a year", "The capital cost left blank", "An abatement of 0 typed"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The typed zero is the one call of the four that SECTION 19 prints as accepted, and it answers costPerTonne none with paysForItself false. The blank abatement, the -500 t and the blank capital are each refused.' then 'old'
           when prompt = 'Which of these abatementCost calls returns costPerTonne none without refusing?' and options = '["The abatement left blank", "An abatement of -500 t a year", "The capital cost left blank", "An abatement of 0 typed"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The typed zero is the one call of the four that the course prints as accepted, and it answers costPerTonne none with paysForItself false. The blank abatement, the -500 t and the blank capital are each refused.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 33;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced final ord 33'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced final ord 33 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which of these abatementCost calls returns costPerTonne none without refusing?', options = '["The abatement left blank", "An abatement of -500 t a year", "The capital cost left blank", "An abatement of 0 typed"]'::jsonb, explanation = 'The typed zero is the one call of the four that the course prints as accepted, and it answers costPerTonne none with paysForItself false. The blank abatement, the -500 t and the blank capital are each refused.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 33;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced final ord 33 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 34
  select case
           when prompt = 'The 9400 t curve prints a residual to target of 0.000 t. Which meetsTarget does the same row print?' and options = '["true, as the residual to target is 0.000 t", "true, and labelled an upper bound", "none, beside that residual of 0.000 t", "false, with a residual of 1370.083 t"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 21 prints meetsTarget none on that row, and says where a claim exceeds what its source emits the curve adds up tonnes that do not exist. The residual of 1370.083 t is the six measures as costed, whose basis names sources with no computed emission.' then 'old'
           when prompt = 'The 9400 t curve prints a residual to target of 0.000 t. Which meetsTarget does the same row print?' and options = '["true, as the residual to target is 0.000 t", "true, and labelled an upper bound", "none, beside that residual of 0.000 t", "false, with a residual of 1370.083 t"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course prints meetsTarget none on that row, and says where a claim exceeds what its source emits the curve adds up tonnes that do not exist. The residual of 1370.083 t is the six measures as costed, whose basis names sources with no computed emission.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 34;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced final ord 34'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced final ord 34 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The 9400 t curve prints a residual to target of 0.000 t. Which meetsTarget does the same row print?', options = '["true, as the residual to target is 0.000 t", "true, and labelled an upper bound", "none, beside that residual of 0.000 t", "false, with a residual of 1370.083 t"]'::jsonb, explanation = 'The course prints meetsTarget none on that row, and says where a claim exceeds what its source emits the curve adds up tonnes that do not exist. The residual of 1370.083 t is the six measures as costed, whose basis names sources with no computed emission.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 34;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced final ord 34 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 35
  select case
           when prompt = 'What does SECTION 18 print as the Heat integration project''s cost per tonne at a rate of 0 (straight line)?' and options = '["-14.2492, at 0.1", "-66.6667 USD a tonne", "-120.5882, capital 0 typed", "688.2353 USD, one year"]'::jsonb and answer_index = 1 and explanation is not distinct from 'Straight line, the rate-0 column: -66.6667. The 0.1 column gives -14.2492, capital 0 typed gives -120.5882 (SECTION 19), and 688.2353 sits in the one-year column marked computed here.' then 'old'
           when prompt = 'What does the cost table print as the Heat integration project''s cost per tonne at a rate of 0 (straight line)?' and options = '["-14.2492, at 0.1", "-66.6667 USD a tonne", "-120.5882, capital 0 typed", "688.2353 USD, one year"]'::jsonb and answer_index = 1 and explanation is not distinct from 'Straight line, the rate-0 column: -66.6667. The 0.1 column gives -14.2492, capital 0 typed gives -120.5882, and 688.2353 sits in the one-year column marked computed here.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 35;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced final ord 35'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced final ord 35 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does the cost table print as the Heat integration project''s cost per tonne at a rate of 0 (straight line)?', options = '["-14.2492, at 0.1", "-66.6667 USD a tonne", "-120.5882, capital 0 typed", "688.2353 USD, one year"]'::jsonb, explanation = 'Straight line, the rate-0 column: -66.6667. The 0.1 column gives -14.2492, capital 0 typed gives -120.5882, and 688.2353 sits in the one-year column marked computed here.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 35;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced final ord 35 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 36
  select case
           when prompt = 'Which of these does SECTION 25 list as a rule in force for the path?' and options = '["A measure with no start year is named.", "A measure with no start year starts in the baseline year.", "A baseline of zero is accepted from an inventory that computed nothing.", "A year whose measures abate more than the baseline is drawn at zero."]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 25 places three path rules in SECTION 22: a baseline that is not positive is refused, a measure with no start year is named, and a year whose scheduled measures abate more than the baseline is refused. SECTION 22 prints the unscheduled measure left off the path.' then 'old'
           when prompt = 'Which of these does the course list as a rule in force for the path?' and options = '["A measure with no start year is named.", "A measure with no start year starts in the baseline year.", "A baseline of zero is accepted from an inventory that computed nothing.", "A year whose measures abate more than the baseline is drawn at zero."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course lists three path rules: a baseline that is not positive is refused, a measure with no start year is named, and a year whose scheduled measures abate more than the baseline is refused. The path prints the unscheduled measure left off it.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 36;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced final ord 36'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced final ord 36 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which of these does the course list as a rule in force for the path?', options = '["A measure with no start year is named.", "A measure with no start year starts in the baseline year.", "A baseline of zero is accepted from an inventory that computed nothing.", "A year whose measures abate more than the baseline is drawn at zero."]'::jsonb, explanation = 'The course lists three path rules: a baseline that is not positive is refused, a measure with no start year is named, and a year whose scheduled measures abate more than the baseline is refused. The path prints the unscheduled measure left off it.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 36;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced final ord 36 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 41
  select case
           when prompt = '707.2581 MJ a tonne: which arithmetic does SECTION 24 show for it?' and options = '["Total GJ over the peer intensity of 680", "Fuel gas GJ x 1000 over the throughput", "Total GJ x 1000 over 781000.000 GJ", "Total GJ x 1000 over the throughput in tonnes"]'::jsonb and answer_index = 3 and explanation is not distinct from '877000.000 x 1000 / 1240000 = 707.2581, marked computed here and equal to the engine. Dividing by the peer gives the ratio 1.040085, a different output.' then 'old'
           when prompt = '707.2581 MJ a tonne: which arithmetic does the course show for it?' and options = '["Total GJ over the peer intensity of 680", "Fuel gas GJ x 1000 over the throughput", "Total GJ x 1000 over 781000.000 GJ", "Total GJ x 1000 over the throughput in tonnes"]'::jsonb and answer_index = 3 and explanation is not distinct from '877000.000 x 1000 / 1240000 = 707.2581, marked computed here and equal to the engine. Dividing by the peer gives the ratio 1.040085, a different output.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 41;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced final ord 41'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced final ord 41 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = '707.2581 MJ a tonne: which arithmetic does the course show for it?', options = '["Total GJ over the peer intensity of 680", "Fuel gas GJ x 1000 over the throughput", "Total GJ x 1000 over 781000.000 GJ", "Total GJ x 1000 over the throughput in tonnes"]'::jsonb, explanation = '877000.000 x 1000 / 1240000 = 707.2581, marked computed here and equal to the engine. Dividing by the peer gives the ratio 1.040085, a different output.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 41;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced final ord 41 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced final ord 42
  select case
           when prompt = 'The Heat integration project: which figure is its net annual cost in SECTION 18?' and options = '["361552.89 USD", "-127251.65 USD", "-48447.11 USD", "484221.51 USD"]'::jsonb and answer_index = 2 and explanation is not distinct from 'Heat integration: annualised capital 361552.89, savings 410000, net -48447.11. -127251.65 is heater tuning and 484221.51 is flare recovery.' then 'old'
           when prompt = 'The Heat integration project: which figure is its net annual cost in the cost table?' and options = '["361552.89 USD", "-127251.65 USD", "-48447.11 USD", "484221.51 USD"]'::jsonb and answer_index = 2 and explanation is not distinct from 'Heat integration: annualised capital 361552.89, savings 410000, net -48447.11. -127251.65 is heater tuning and 484221.51 is flare recovery.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 42;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced final ord 42'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced final ord 42 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The Heat integration project: which figure is its net annual cost in the cost table?', options = '["361552.89 USD", "-127251.65 USD", "-48447.11 USD", "484221.51 USD"]'::jsonb, explanation = 'Heat integration: annualised capital 361552.89, savings 410000, net -48447.11. -127251.65 is heater tuning and 484221.51 is flare recovery.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'final' and module_key is not distinct from null and ord = 42;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced final ord 42 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m01-the-cost-of-a-tonne-abated ord 1
  select case
           when prompt = 'On the invented AGBOR records, the capital box of one measure is left empty (the Heat integration project). What is the engine''s answer?' and options = '["A refusal asking for a life to annualise the capital cost over.", "A refusal asking for a discount rate, since a blank is not read as 0.", "A refusal telling the user to enter 0 if the measure needs no capital.", "A cost per tonne of -120.5882 USD, with capital cost named in assumedZero."]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 19 prints, for the capital cost blank: REFUSED: Measure "Heat integration project" has no capital cost. Enter 0 if it needs none: a blank is not read as free. The life and rate refusals belong to other blanks, and assumedZero names only the running figures.' then 'old'
           when prompt = 'On the invented AGBOR records, the capital box of one measure is left empty (the Heat integration project). What is the engine''s answer?' and options = '["A refusal asking for a life to annualise the capital cost over.", "A refusal asking for a discount rate, since a blank is not read as 0.", "A refusal telling the user to enter 0 if the measure needs no capital.", "A cost per tonne of -120.5882 USD, with capital cost named in assumedZero."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The engine returns, for the capital cost blank: REFUSED: Measure "Heat integration project" has no capital cost. Enter 0 if it needs none: a blank is not read as free. The life and rate refusals belong to other blanks, and assumedZero names only the running figures.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-cost-of-a-tonne-abated' and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m01-the-cost-of-a-tonne-abated ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m01-the-cost-of-a-tonne-abated ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'On the invented AGBOR records, the capital box of one measure is left empty (the Heat integration project). What is the engine''s answer?', options = '["A refusal asking for a life to annualise the capital cost over.", "A refusal asking for a discount rate, since a blank is not read as 0.", "A refusal telling the user to enter 0 if the measure needs no capital.", "A cost per tonne of -120.5882 USD, with capital cost named in assumedZero."]'::jsonb, explanation = 'The engine returns, for the capital cost blank: REFUSED: Measure "Heat integration project" has no capital cost. Enter 0 if it needs none: a blank is not read as free. The life and rate refusals belong to other blanks, and assumedZero names only the running figures.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-cost-of-a-tonne-abated' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m01-the-cost-of-a-tonne-abated ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m01-the-cost-of-a-tonne-abated ord 2
  select case
           when prompt = 'The invented Heat integration project is sent with its annual savings and its annual cost both left blank. What does abatementCost return?' and options = '["costPerTonne 106.3391 USD, with assumedZero naming annual savings and annual cost", "costPerTonne -14.2492 USD, the same figure as with the savings entered", "costPerTonne -120.5882 USD, with assumedZero naming annual savings only", "A refusal asking for the annual savings before any cost is computed"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 19: blank running figures are taken as 0 and NAMED; with the savings and the running cost blank the measure answers costPerTonne 106.3391 USD, assumedZero: annual savings, annual cost. -14.2492 USD is the measure as costed in SECTION 18, and -120.5882 USD is the call with capital 0 typed.' then 'old'
           when prompt = 'The invented Heat integration project is sent with its annual savings and its annual cost both left blank. What does abatementCost return?' and options = '["costPerTonne 106.3391 USD, with assumedZero naming annual savings and annual cost", "costPerTonne -14.2492 USD, the same figure as with the savings entered", "costPerTonne -120.5882 USD, with assumedZero naming annual savings only", "A refusal asking for the annual savings before any cost is computed"]'::jsonb and answer_index = 0 and explanation is not distinct from 'In the course, blank running figures are taken as 0 and NAMED; with the savings and the running cost blank the measure answers costPerTonne 106.3391 USD, assumedZero: annual savings, annual cost. -14.2492 USD is the measure as costed in the cost table, and -120.5882 USD is the call with capital 0 typed.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-cost-of-a-tonne-abated' and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m01-the-cost-of-a-tonne-abated ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m01-the-cost-of-a-tonne-abated ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The invented Heat integration project is sent with its annual savings and its annual cost both left blank. What does abatementCost return?', options = '["costPerTonne 106.3391 USD, with assumedZero naming annual savings and annual cost", "costPerTonne -14.2492 USD, the same figure as with the savings entered", "costPerTonne -120.5882 USD, with assumedZero naming annual savings only", "A refusal asking for the annual savings before any cost is computed"]'::jsonb, explanation = 'In the course, blank running figures are taken as 0 and NAMED; with the savings and the running cost blank the measure answers costPerTonne 106.3391 USD, assumedZero: annual savings, annual cost. -14.2492 USD is the measure as costed in the cost table, and -120.5882 USD is the call with capital 0 typed.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-cost-of-a-tonne-abated' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m01-the-cost-of-a-tonne-abated ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m01-the-cost-of-a-tonne-abated ord 3
  select case
           when prompt = 'A user types the discount rate as 10, meaning ten percent, on a measure with capital. What does abatementCost do?' and options = '["It accepts it and annualises the capital exactly as a rate of 0.1 would, at ten percent.", "It refuses: a measure with capital needs a rate, and a blank is not read as 0.", "It accepts it and prints the Heat integration project at -14.2492 USD a tonne.", "It refuses: the rate is a fraction above -1 and below 1, typed 0.1 for ten percent."]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 19, discount rate 10 (a percentage typed): REFUSED: The discount rate is a fraction greater than -1 and below 1 (0.1 for ten percent). The blank-rate refusal is a different call, and -14.2492 USD a tonne is the measure costed at a rate of 0.1.' then 'old'
           when prompt = 'A user types the discount rate as 10, meaning ten percent, on a measure with capital. What does abatementCost do?' and options = '["It accepts it and annualises the capital exactly as a rate of 0.1 would, at ten percent.", "It refuses: a measure with capital needs a rate, and a blank is not read as 0.", "It accepts it and prints the Heat integration project at -14.2492 USD a tonne.", "It refuses: the rate is a fraction above -1 and below 1, typed 0.1 for ten percent."]'::jsonb and answer_index = 3 and explanation is not distinct from 'Discount rate 10 (a percentage typed), and the engine returns REFUSED: The discount rate is a fraction greater than -1 and below 1 (0.1 for ten percent). The blank-rate refusal is a different call, and -14.2492 USD a tonne is the measure costed at a rate of 0.1.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-cost-of-a-tonne-abated' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m01-the-cost-of-a-tonne-abated ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m01-the-cost-of-a-tonne-abated ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A user types the discount rate as 10, meaning ten percent, on a measure with capital. What does abatementCost do?', options = '["It accepts it and annualises the capital exactly as a rate of 0.1 would, at ten percent.", "It refuses: a measure with capital needs a rate, and a blank is not read as 0.", "It accepts it and prints the Heat integration project at -14.2492 USD a tonne.", "It refuses: the rate is a fraction above -1 and below 1, typed 0.1 for ten percent."]'::jsonb, explanation = 'Discount rate 10 (a percentage typed), and the engine returns REFUSED: The discount rate is a fraction greater than -1 and below 1 (0.1 for ten percent). The blank-rate refusal is a different call, and -14.2492 USD a tonne is the measure costed at a rate of 0.1.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-cost-of-a-tonne-abated' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m01-the-cost-of-a-tonne-abated ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m01-the-cost-of-a-tonne-abated ord 4
  select case
           when prompt = 'The invented Heat integration project is sent with a capital of 0 typed, and no life and no rate. What comes back?' and options = '["A refusal asking for a life to annualise the capital over", "costPerTonne -120.5882 USD and capitalRecoveryFactor 0.00000000", "A refusal asking for a discount rate to annualise the capital", "costPerTonne 106.3391 USD, with capital cost named in assumedZero"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 19: a capital of 0 typed needs no life and no rate: Heat integration project with capital 0 answers costPerTonne -120.5882 USD and capitalRecoveryFactor 0.00000000. 106.3391 USD is the call with the savings and the running cost blank.' then 'old'
           when prompt = 'The invented Heat integration project is sent with a capital of 0 typed, and no life and no rate. What comes back?' and options = '["A refusal asking for a life to annualise the capital over", "costPerTonne -120.5882 USD and capitalRecoveryFactor 0.00000000", "A refusal asking for a discount rate to annualise the capital", "costPerTonne 106.3391 USD, with capital cost named in assumedZero"]'::jsonb and answer_index = 1 and explanation is not distinct from 'In the course, a capital of 0 typed needs no life and no rate: Heat integration project with capital 0 answers costPerTonne -120.5882 USD and capitalRecoveryFactor 0.00000000. 106.3391 USD is the call with the savings and the running cost blank.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-cost-of-a-tonne-abated' and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m01-the-cost-of-a-tonne-abated ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m01-the-cost-of-a-tonne-abated ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The invented Heat integration project is sent with a capital of 0 typed, and no life and no rate. What comes back?', options = '["A refusal asking for a life to annualise the capital over", "costPerTonne -120.5882 USD and capitalRecoveryFactor 0.00000000", "A refusal asking for a discount rate to annualise the capital", "costPerTonne 106.3391 USD, with capital cost named in assumedZero"]'::jsonb, explanation = 'In the course, a capital of 0 typed needs no life and no rate: Heat integration project with capital 0 answers costPerTonne -120.5882 USD and capitalRecoveryFactor 0.00000000. 106.3391 USD is the call with the savings and the running cost blank.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-cost-of-a-tonne-abated' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m01-the-cost-of-a-tonne-abated ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m01-the-cost-of-a-tonne-abated ord 5
  select case
           when prompt = 'A measure is sent with an abatement of 0 tonnes a year. What does abatementCost return?' and options = '["A refusal saying the measure needs an annual abatement.", "costPerTonne none, and paysForItself false.", "A refusal saying the measure has a negative abatement.", "costPerTonne none, and paysForItself true."]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 19: an abatement of 0 is accepted and has no cost per tonne: costPerTonne none, paysForItself false. The annual abatement refusal is the call with the abatement blank, and the negative abatement refusal is the call with -500 t a year.' then 'old'
           when prompt = 'A measure is sent with an abatement of 0 tonnes a year. What does abatementCost return?' and options = '["A refusal saying the measure needs an annual abatement.", "costPerTonne none, and paysForItself false.", "A refusal saying the measure has a negative abatement.", "costPerTonne none, and paysForItself true."]'::jsonb and answer_index = 1 and explanation is not distinct from 'In the course, an abatement of 0 is accepted and has no cost per tonne: costPerTonne none, paysForItself false. The annual abatement refusal is the call with the abatement blank, and the negative abatement refusal is the call with -500 t a year.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-cost-of-a-tonne-abated' and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m01-the-cost-of-a-tonne-abated ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m01-the-cost-of-a-tonne-abated ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A measure is sent with an abatement of 0 tonnes a year. What does abatementCost return?', options = '["A refusal saying the measure needs an annual abatement.", "costPerTonne none, and paysForItself false.", "A refusal saying the measure has a negative abatement.", "costPerTonne none, and paysForItself true."]'::jsonb, explanation = 'In the course, an abatement of 0 is accepted and has no cost per tonne: costPerTonne none, paysForItself false. The annual abatement refusal is the call with the abatement blank, and the negative abatement refusal is the call with -500 t a year.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-cost-of-a-tonne-abated' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m01-the-cost-of-a-tonne-abated ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m01-the-cost-of-a-tonne-abated ord 6
  select case
           when prompt = 'The invented Agbor measures are costed at a rate of 0 (straight line) as well as at 0.1. Which measure''s cost per tonne carries a minus sign at one rate and none at the other?' and options = '["Flare gas recovery, 78.1002 at 0.1 and 26.8817 at 0", "Vapour recovery on the storage tanks, 35.4193 at 0.1 and 14.5045 at 0", "Heat integration project, -14.2492 at 0.1 and -66.6667 at 0", "Solar for purchased power, 45.8573 at 0.1 and -13.5714 at 0"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 18 prints Solar for purchased power at 45.8573 USD a tonne at 0.1 and -13.5714 USD a tonne at a rate of 0. The other three rows keep one sign at both rates: Flare gas recovery and Vapour recovery stay positive, and the Heat integration project stays negative.' then 'old'
           when prompt = 'The invented Agbor measures are costed at a rate of 0 (straight line) as well as at 0.1. Which measure''s cost per tonne carries a minus sign at one rate and none at the other?' and options = '["Flare gas recovery, 78.1002 at 0.1 and 26.8817 at 0", "Vapour recovery on the storage tanks, 35.4193 at 0.1 and 14.5045 at 0", "Heat integration project, -14.2492 at 0.1 and -66.6667 at 0", "Solar for purchased power, 45.8573 at 0.1 and -13.5714 at 0"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The cost table prints Solar for purchased power at 45.8573 USD a tonne at 0.1 and -13.5714 USD a tonne at a rate of 0. The other three rows keep one sign at both rates: Flare gas recovery and Vapour recovery stay positive, and the Heat integration project stays negative.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-cost-of-a-tonne-abated' and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m01-the-cost-of-a-tonne-abated ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m01-the-cost-of-a-tonne-abated ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The invented Agbor measures are costed at a rate of 0 (straight line) as well as at 0.1. Which measure''s cost per tonne carries a minus sign at one rate and none at the other?', options = '["Flare gas recovery, 78.1002 at 0.1 and 26.8817 at 0", "Vapour recovery on the storage tanks, 35.4193 at 0.1 and 14.5045 at 0", "Heat integration project, -14.2492 at 0.1 and -66.6667 at 0", "Solar for purchased power, 45.8573 at 0.1 and -13.5714 at 0"]'::jsonb, explanation = 'The cost table prints Solar for purchased power at 45.8573 USD a tonne at 0.1 and -13.5714 USD a tonne at a rate of 0. The other three rows keep one sign at both rates: Flare gas recovery and Vapour recovery stay positive, and the Heat integration project stays negative.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-cost-of-a-tonne-abated' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m01-the-cost-of-a-tonne-abated ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m01-the-cost-of-a-tonne-abated ord 7
  select case
           when prompt = 'The invented Heat integration project and Flare gas recovery both print a capital recovery factor of 0.13147378. What do the two rows share that the factor is built from?' and options = '["A life of 15 years, at the same discount rate of 0.1.", "A capital cost of 2750000 USD, annualised the same way.", "The heaters as their source, so one factor serves both.", "An annual cost of 0 USD, so nothing is added to capital."]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 18 prints the factor as r(1 + r)^n / ((1 + r)^n - 1): the rate and the life. Both rows carry a life of 15 years at 0.1. Their capital costs are 2750000 and 4900000 USD, they act on heaters and flare, and Flare gas recovery carries an annual cost of 105000 USD.' then 'old'
           when prompt = 'The invented Heat integration project and Flare gas recovery both print a capital recovery factor of 0.13147378. What do the two rows share that the factor is built from?' and options = '["A life of 15 years, at the same discount rate of 0.1.", "A capital cost of 2750000 USD, annualised the same way.", "The heaters as their source, so one factor serves both.", "An annual cost of 0 USD, so nothing is added to capital."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course prints the factor as r(1 + r)^n / ((1 + r)^n - 1): the rate and the life. Both rows carry a life of 15 years at 0.1. Their capital costs are 2750000 and 4900000 USD, they act on heaters and flare, and Flare gas recovery carries an annual cost of 105000 USD.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-cost-of-a-tonne-abated' and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m01-the-cost-of-a-tonne-abated ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m01-the-cost-of-a-tonne-abated ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The invented Heat integration project and Flare gas recovery both print a capital recovery factor of 0.13147378. What do the two rows share that the factor is built from?', options = '["A life of 15 years, at the same discount rate of 0.1.", "A capital cost of 2750000 USD, annualised the same way.", "The heaters as their source, so one factor serves both.", "An annual cost of 0 USD, so nothing is added to capital."]'::jsonb, explanation = 'The course prints the factor as r(1 + r)^n / ((1 + r)^n - 1): the rate and the life. Both rows carry a life of 15 years at 0.1. Their capital costs are 2750000 and 4900000 USD, they act on heaters and flare, and Flare gas recovery carries an annual cost of 105000 USD.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-cost-of-a-tonne-abated' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m01-the-cost-of-a-tonne-abated ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m01-the-cost-of-a-tonne-abated ord 8
  select case
           when prompt = 'For the invented Heat integration project, which figure sits in the SECTION 18 column whose header is marked computed here?' and options = '["-14.2492 USD a tonne, the cost per tonne at the rate of 0.1", "-66.6667 USD a tonne, the cost per tonne at a rate of 0", "688.2353 USD a tonne, the whole capital set against one year", "-120.5882 USD a tonne, the cost with a capital of 0 typed"]'::jsonb and answer_index = 2 and explanation is not distinct from 'Of the two columns in SECTION 18''s second table, only the header of the capital-against-one-year column carries (computed here), and the sentence above it says the engine refuses to compare a one-off cost with a recurring saving. -14.2492 USD is the cost per tonne at 0.1, -66.6667 USD the cost per tonne at a rate of 0, and -120.5882 USD the answer with capital 0 typed (SECTION 19).' then 'old'
           when prompt = 'For the invented Heat integration project, which figure sits in the cost table column whose header is marked computed here?' and options = '["-14.2492 USD a tonne, the cost per tonne at the rate of 0.1", "-66.6667 USD a tonne, the cost per tonne at a rate of 0", "688.2353 USD a tonne, the whole capital set against one year", "-120.5882 USD a tonne, the cost with a capital of 0 typed"]'::jsonb and answer_index = 2 and explanation is not distinct from 'Of the two columns in the course''s second cost table, only the header of the capital-against-one-year column carries (computed here), and the sentence above it says the engine refuses to compare a one-off cost with a recurring saving. -14.2492 USD is the cost per tonne at 0.1, -66.6667 USD the cost per tonne at a rate of 0, and -120.5882 USD the answer with capital 0 typed.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-cost-of-a-tonne-abated' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m01-the-cost-of-a-tonne-abated ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m01-the-cost-of-a-tonne-abated ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'For the invented Heat integration project, which figure sits in the cost table column whose header is marked computed here?', options = '["-14.2492 USD a tonne, the cost per tonne at the rate of 0.1", "-66.6667 USD a tonne, the cost per tonne at a rate of 0", "688.2353 USD a tonne, the whole capital set against one year", "-120.5882 USD a tonne, the cost with a capital of 0 typed"]'::jsonb, explanation = 'Of the two columns in the course''s second cost table, only the header of the capital-against-one-year column carries (computed here), and the sentence above it says the engine refuses to compare a one-off cost with a recurring saving. -14.2492 USD is the cost per tonne at 0.1, -66.6667 USD the cost per tonne at a rate of 0, and -120.5882 USD the answer with capital 0 typed.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-cost-of-a-tonne-abated' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m01-the-cost-of-a-tonne-abated ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m01-the-cost-of-a-tonne-abated ord 9
  select case
           when prompt = 'A capital measure arrives with its life box empty. Apart from asking for the life, which sentence does the refusal carry?' and options = '["A blank life is read as one year, so the whole capital lands in a single year''s saving.", "A blank life would annualise straight-line and move the measure down the curve.", "A blank life is not read as free, so 0 must be entered if the measure has none.", "Set against one year''s saving, a one-off capital cost overstates the cost per tonne."]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 19, life blank, second sentence: "Set against one year''s saving, a one-off capital cost overstates the cost per tonne of a capital measure." The engine refuses the call; it never reads a blank life as one year.' then 'old'
           when prompt = 'A capital measure arrives with its life box empty. Apart from asking for the life, which sentence does the refusal carry?' and options = '["A blank life is read as one year, so the whole capital lands in a single year''s saving.", "A blank life would annualise straight-line and move the measure down the curve.", "A blank life is not read as free, so 0 must be entered if the measure has none.", "Set against one year''s saving, a one-off capital cost overstates the cost per tonne."]'::jsonb and answer_index = 3 and explanation is not distinct from 'The life-blank refusal, second sentence: "Set against one year''s saving, a one-off capital cost overstates the cost per tonne of a capital measure." The engine refuses the call; it never reads a blank life as one year.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-cost-of-a-tonne-abated' and ord = 9;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m01-the-cost-of-a-tonne-abated ord 9'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m01-the-cost-of-a-tonne-abated ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A capital measure arrives with its life box empty. Apart from asking for the life, which sentence does the refusal carry?', options = '["A blank life is read as one year, so the whole capital lands in a single year''s saving.", "A blank life would annualise straight-line and move the measure down the curve.", "A blank life is not read as free, so 0 must be entered if the measure has none.", "Set against one year''s saving, a one-off capital cost overstates the cost per tonne."]'::jsonb, explanation = 'The life-blank refusal, second sentence: "Set against one year''s saving, a one-off capital cost overstates the cost per tonne of a capital measure." The engine refuses the call; it never reads a blank life as one year.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-cost-of-a-tonne-abated' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m01-the-cost-of-a-tonne-abated ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m01-the-cost-of-a-tonne-abated ord 10
  select case
           when prompt = 'The six invented Agbor measures are handed to the curve with the Heat integration project''s capital cost blank. What does the curve return?' and options = '["6 steps and totalAbatementTonnes 15460.000, the measure placed at a capital of 0", "5 steps and totalAbatementTonnes 12060.000, with the measure named in refusedMeasures", "No curve at all: the whole call is refused until the capital cost is entered", "5 steps and totalAbatementTonnes 15460.000, the refused measure''s tonnes still in it"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 19: 5 steps, totalAbatementTonnes 12060.000, and refusedMeasures lists Heat integration project with its capital refusal. The refusedNote: "A refused measure is off the curve and out of every total until it is costed." 15460.000 is the curve with all six costed (SECTION 20).' then 'old'
           when prompt = 'The six invented Agbor measures are handed to the curve with the Heat integration project''s capital cost blank. What does the curve return?' and options = '["6 steps and totalAbatementTonnes 15460.000, the measure placed at a capital of 0", "5 steps and totalAbatementTonnes 12060.000, with the measure named in refusedMeasures", "No curve at all: the whole call is refused until the capital cost is entered", "5 steps and totalAbatementTonnes 15460.000, the refused measure''s tonnes still in it"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The engine returns 5 steps, totalAbatementTonnes 12060.000, and refusedMeasures lists Heat integration project with its capital refusal. The refusedNote: "A refused measure is off the curve and out of every total until it is costed." 15460.000 is the curve with all six costed.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-cost-of-a-tonne-abated' and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m01-the-cost-of-a-tonne-abated ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m01-the-cost-of-a-tonne-abated ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The six invented Agbor measures are handed to the curve with the Heat integration project''s capital cost blank. What does the curve return?', options = '["6 steps and totalAbatementTonnes 15460.000, the measure placed at a capital of 0", "5 steps and totalAbatementTonnes 12060.000, with the measure named in refusedMeasures", "No curve at all: the whole call is refused until the capital cost is entered", "5 steps and totalAbatementTonnes 15460.000, the refused measure''s tonnes still in it"]'::jsonb, explanation = 'The engine returns 5 steps, totalAbatementTonnes 12060.000, and refusedMeasures lists Heat integration project with its capital refusal. The refusedNote: "A refused measure is off the curve and out of every total until it is costed." 15460.000 is the curve with all six costed.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-cost-of-a-tonne-abated' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m01-the-cost-of-a-tonne-abated ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m01-the-cost-of-a-tonne-abated ord 11
  select case
           when prompt = 'The invented Tune the fired heaters prints a net annual cost of -127251.65 USD. How does SECTION 18 define the net annual cost?' and options = '["The annualised capital plus the annual cost less the annual savings.", "The whole capital, undivided, plus the annual cost less the annual savings.", "The annual savings less the annualised capital and the annual cost together.", "The cost per tonne multiplied by the capital recovery factor and the tonnes."]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 18: the net annual cost is the annualised capital plus the annual cost less the annual savings; the cost per tonne is that over the tonnes abated a year. For Tune the fired heaters that is 4748.35 USD of annualised capital, an annual cost of 0 and savings of 132000 USD.' then 'old'
           when prompt = 'The invented Tune the fired heaters prints a net annual cost of -127251.65 USD. How does the course define the net annual cost?' and options = '["The annualised capital plus the annual cost less the annual savings.", "The whole capital, undivided, plus the annual cost less the annual savings.", "The annual savings less the annualised capital and the annual cost together.", "The cost per tonne multiplied by the capital recovery factor and the tonnes."]'::jsonb and answer_index = 0 and explanation is not distinct from 'In the course, the net annual cost is the annualised capital plus the annual cost less the annual savings; the cost per tonne is that over the tonnes abated a year. For Tune the fired heaters that is 4748.35 USD of annualised capital, an annual cost of 0 and savings of 132000 USD.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-cost-of-a-tonne-abated' and ord = 11;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m01-the-cost-of-a-tonne-abated ord 11'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m01-the-cost-of-a-tonne-abated ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The invented Tune the fired heaters prints a net annual cost of -127251.65 USD. How does the course define the net annual cost?', options = '["The annualised capital plus the annual cost less the annual savings.", "The whole capital, undivided, plus the annual cost less the annual savings.", "The annual savings less the annualised capital and the annual cost together.", "The cost per tonne multiplied by the capital recovery factor and the tonnes."]'::jsonb, explanation = 'In the course, the net annual cost is the annualised capital plus the annual cost less the annual savings; the cost per tonne is that over the tonnes abated a year. For Tune the fired heaters that is 4748.35 USD of annualised capital, an annual cost of 0 and savings of 132000 USD.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-cost-of-a-tonne-abated' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m01-the-cost-of-a-tonne-abated ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m01-the-cost-of-a-tonne-abated ord 12
  select case
           when prompt = 'Costed at the invented discount rate of 0.1, which of these Agbor measures reads pays for itself true?' and options = '["Vapour recovery on the storage tanks", "Solar for purchased power", "Heat integration project", "Flare gas recovery"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 18 prints the Heat integration project at -14.2492 USD a tonne, pays for itself true: a negative cost per tonne means the measure pays for itself and abates carbon as a side effect. Vapour recovery (35.4193), Solar (45.8573) and Flare gas recovery (78.1002) read false.' then 'old'
           when prompt = 'Costed at the invented discount rate of 0.1, which of these Agbor measures reads pays for itself true?' and options = '["Vapour recovery on the storage tanks", "Solar for purchased power", "Heat integration project", "Flare gas recovery"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The cost table prints the Heat integration project at -14.2492 USD a tonne, pays for itself true: a negative cost per tonne means the measure pays for itself and abates carbon as a side effect. Vapour recovery (35.4193), Solar (45.8573) and Flare gas recovery (78.1002) read false.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-cost-of-a-tonne-abated' and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m01-the-cost-of-a-tonne-abated ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m01-the-cost-of-a-tonne-abated ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Costed at the invented discount rate of 0.1, which of these Agbor measures reads pays for itself true?', options = '["Vapour recovery on the storage tanks", "Solar for purchased power", "Heat integration project", "Flare gas recovery"]'::jsonb, explanation = 'The cost table prints the Heat integration project at -14.2492 USD a tonne, pays for itself true: a negative cost per tonne means the measure pays for itself and abates carbon as a side effect. Vapour recovery (35.4193), Solar (45.8573) and Flare gas recovery (78.1002) read false.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-cost-of-a-tonne-abated' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m01-the-cost-of-a-tonne-abated ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m01-the-cost-of-a-tonne-abated ord 13
  select case
           when prompt = 'A measure with capital is sent with its discount rate blank. What does the refusal say reading that blank as 0 would do?' and options = '["Overstate the cost per tonne of a capital measure set against one year.", "Set the whole capital against one year of the measure''s savings.", "Annualise straight-line and move the measure down the curve.", "Read the capital cost as free, as a blank capital cost would be."]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 19, discount rate blank: "A blank is not read as 0, which would annualise straight-line and move the measure down the curve." Overstating is the wording of the life blank, and free is the wording of the capital blank.' then 'old'
           when prompt = 'A measure with capital is sent with its discount rate blank. What does the refusal say reading that blank as 0 would do?' and options = '["Overstate the cost per tonne of a capital measure set against one year.", "Set the whole capital against one year of the measure''s savings.", "Annualise straight-line and move the measure down the curve.", "Read the capital cost as free, as a blank capital cost would be."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The rate-blank refusal: "A blank is not read as 0, which would annualise straight-line and move the measure down the curve." Overstating is the wording of the life blank, and free is the wording of the capital blank.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-cost-of-a-tonne-abated' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m01-the-cost-of-a-tonne-abated ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m01-the-cost-of-a-tonne-abated ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'A measure with capital is sent with its discount rate blank. What does the refusal say reading that blank as 0 would do?', options = '["Overstate the cost per tonne of a capital measure set against one year.", "Set the whole capital against one year of the measure''s savings.", "Annualise straight-line and move the measure down the curve.", "Read the capital cost as free, as a blank capital cost would be."]'::jsonb, explanation = 'The rate-blank refusal: "A blank is not read as 0, which would annualise straight-line and move the measure down the curve." Overstating is the wording of the life blank, and free is the wording of the capital blank.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-cost-of-a-tonne-abated' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m01-the-cost-of-a-tonne-abated ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m01-the-cost-of-a-tonne-abated ord 14
  select case
           when prompt = 'Which pair of invented Agbor measures prints a minus sign both at the rate of 0.1 and in the capital-against-one-year column?' and options = '["Tune the fired heaters and the Heat integration project", "Repair failed steam traps and Solar for purchased power", "Heat integration project and Vapour recovery on the storage tanks", "Tune the fired heaters and Repair failed steam traps"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 18: Tune the fired heaters prints -167.4364 and -150.0000 USD a tonne, and Repair failed steam traps -156.4390 and -133.0435. The Heat integration project prints 688.2353 against one year, Solar 45.8573 at 0.1 and Vapour recovery 35.4193 at 0.1.' then 'old'
           when prompt = 'Which pair of invented Agbor measures prints a minus sign both at the rate of 0.1 and in the capital-against-one-year column?' and options = '["Tune the fired heaters and the Heat integration project", "Repair failed steam traps and Solar for purchased power", "Heat integration project and Vapour recovery on the storage tanks", "Tune the fired heaters and Repair failed steam traps"]'::jsonb and answer_index = 3 and explanation is not distinct from 'In the cost table, Tune the fired heaters prints -167.4364 and -150.0000 USD a tonne, and Repair failed steam traps -156.4390 and -133.0435. The Heat integration project prints 688.2353 against one year, Solar 45.8573 at 0.1 and Vapour recovery 35.4193 at 0.1.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-cost-of-a-tonne-abated' and ord = 14;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m01-the-cost-of-a-tonne-abated ord 14'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m01-the-cost-of-a-tonne-abated ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which pair of invented Agbor measures prints a minus sign both at the rate of 0.1 and in the capital-against-one-year column?', options = '["Tune the fired heaters and the Heat integration project", "Repair failed steam traps and Solar for purchased power", "Heat integration project and Vapour recovery on the storage tanks", "Tune the fired heaters and Repair failed steam traps"]'::jsonb, explanation = 'In the cost table, Tune the fired heaters prints -167.4364 and -150.0000 USD a tonne, and Repair failed steam traps -156.4390 and -133.0435. The Heat integration project prints 688.2353 against one year, Solar 45.8573 at 0.1 and Vapour recovery 35.4193 at 0.1.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-cost-of-a-tonne-abated' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m01-the-cost-of-a-tonne-abated ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m01-the-cost-of-a-tonne-abated ord 15
  select case
           when prompt = 'The invented Flare gas recovery prints a net annual cost of 484221.51 USD. Which three printed figures does SECTION 18''s definition build it from?' and options = '["Annualised capital 644221.51, annual cost 105000 and savings 265000 USD", "Capital 4900000, annual cost 105000 and annual savings 265000 USD", "Annualised capital 644221.51, annual cost 105000 and 6200 tonnes", "Annualised capital 361552.89, annual cost 105000 and savings 265000 USD"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 18 defines the net annual cost as the annualised capital plus the annual cost less the annual savings. Flare gas recovery''s row prints annualised capital 644221.51 USD, annual cost 105000 USD and annual savings 265000 USD. 361552.89 USD is the Heat integration project''s annualised capital, and the tonnes are the divisor of the cost per tonne.' then 'old'
           when prompt = 'The invented Flare gas recovery prints a net annual cost of 484221.51 USD. Which three printed figures does the course''s definition build it from?' and options = '["Annualised capital 644221.51, annual cost 105000 and savings 265000 USD", "Capital 4900000, annual cost 105000 and annual savings 265000 USD", "Annualised capital 644221.51, annual cost 105000 and 6200 tonnes", "Annualised capital 361552.89, annual cost 105000 and savings 265000 USD"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course defines the net annual cost as the annualised capital plus the annual cost less the annual savings. Flare gas recovery''s row prints annualised capital 644221.51 USD, annual cost 105000 USD and annual savings 265000 USD. 361552.89 USD is the Heat integration project''s annualised capital, and the tonnes are the divisor of the cost per tonne.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-cost-of-a-tonne-abated' and ord = 15;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m01-the-cost-of-a-tonne-abated ord 15'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m01-the-cost-of-a-tonne-abated ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The invented Flare gas recovery prints a net annual cost of 484221.51 USD. Which three printed figures does the course''s definition build it from?', options = '["Annualised capital 644221.51, annual cost 105000 and savings 265000 USD", "Capital 4900000, annual cost 105000 and annual savings 265000 USD", "Annualised capital 644221.51, annual cost 105000 and 6200 tonnes", "Annualised capital 361552.89, annual cost 105000 and savings 265000 USD"]'::jsonb, explanation = 'The course defines the net annual cost as the annualised capital plus the annual cost less the annual savings. Flare gas recovery''s row prints annualised capital 644221.51 USD, annual cost 105000 USD and annual savings 265000 USD. 361552.89 USD is the Heat integration project''s annualised capital, and the tonnes are the divisor of the cost per tonne.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm01-the-cost-of-a-tonne-abated' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m01-the-cost-of-a-tonne-abated ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m02-the-marginal-abatement-cost-curve ord 1
  select case
           when prompt = 'On the curve built from the six invented AGBOR measures, which measure is order 2?' and options = '["Tune the fired heaters, at -167.4364 USD a tonne", "Repair failed steam traps, at -156.4390 USD a tonne", "Solar for purchased power, at 45.8573 USD a tonne", "Heat integration project, at -14.2492 USD a tonne, with its 3400.000 t"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 20''s second row is Repair failed steam traps, costed at -156.4390 USD a tonne; the first row is Tune the fired heaters, and Solar sits fifth.' then 'old'
           when prompt = 'On the curve built from the six invented AGBOR measures, which measure is order 2?' and options = '["Tune the fired heaters, at -167.4364 USD a tonne", "Repair failed steam traps, at -156.4390 USD a tonne", "Solar for purchased power, at 45.8573 USD a tonne", "Heat integration project, at -14.2492 USD a tonne, with its 3400.000 t"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The curve''s second row is Repair failed steam traps, costed at -156.4390 USD a tonne; the first row is Tune the fired heaters, and Solar sits fifth.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-marginal-abatement-cost-curve' and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m02-the-marginal-abatement-cost-curve ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m02-the-marginal-abatement-cost-curve ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'On the curve built from the six invented AGBOR measures, which measure is order 2?', options = '["Tune the fired heaters, at -167.4364 USD a tonne", "Repair failed steam traps, at -156.4390 USD a tonne", "Solar for purchased power, at 45.8573 USD a tonne", "Heat integration project, at -14.2492 USD a tonne, with its 3400.000 t"]'::jsonb, explanation = 'The curve''s second row is Repair failed steam traps, costed at -156.4390 USD a tonne; the first row is Tune the fired heaters, and Solar sits fifth.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-marginal-abatement-cost-curve' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m02-the-marginal-abatement-cost-curve ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m02-the-marginal-abatement-cost-curve ord 2
  select case
           when prompt = 'What sets a measure''s order on the Agbor curve?' and options = '["Its tonnes a year, largest first", "The order it was entered in SECTION 18''s table", "Its capital cost, the smallest capital first", "Its cost per tonne, cheapest first"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 20: the six measures ranked cheapest first. Flare gas recovery has the largest tonnes, 6200.000, and is order 6. Vapour recovery on the storage tanks is entered sixth and is order 4. The Heat integration project, with 2750000 USD of capital, is order 3 ahead of Vapour recovery at 610000 USD.' then 'old'
           when prompt = 'What sets a measure''s order on the Agbor curve?' and options = '["Its tonnes a year, largest first", "The order it was entered in the course''s table", "Its capital cost, the smallest capital first", "Its cost per tonne, cheapest first"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The curve holds the six measures ranked cheapest first. Flare gas recovery has the largest tonnes, 6200.000, and is order 6. Vapour recovery on the storage tanks is entered sixth and is order 4. The Heat integration project, with 2750000 USD of capital, is order 3 ahead of Vapour recovery at 610000 USD.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-marginal-abatement-cost-curve' and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m02-the-marginal-abatement-cost-curve ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m02-the-marginal-abatement-cost-curve ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What sets a measure''s order on the Agbor curve?', options = '["Its tonnes a year, largest first", "The order it was entered in the course''s table", "Its capital cost, the smallest capital first", "Its cost per tonne, cheapest first"]'::jsonb, explanation = 'The curve holds the six measures ranked cheapest first. Flare gas recovery has the largest tonnes, 6200.000, and is order 6. Vapour recovery on the storage tanks is entered sixth and is order 4. The Heat integration project, with 2750000 USD of capital, is order 3 ahead of Vapour recovery at 610000 USD.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-marginal-abatement-cost-curve' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m02-the-marginal-abatement-cost-curve ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m02-the-marginal-abatement-cost-curve ord 3
  select case
           when prompt = 'Where does the invented Heat integration project''s step start and end on the Agbor curve''s axis?' and options = '["From 1910.000 t to 5310.000 t", "From 760.000 t to 1910.000 t, after the heaters", "From 5310.000 t to 7160.000 t, as order 4", "From 0.000 t to 3400.000 t, as the first step"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 20 prints the Heat integration project, order 3, with cumulative start 1910.000 t and cumulative end 5310.000 t; its width is its 3400.000 t a year. 760.000 to 1910.000 is Repair failed steam traps and 5310.000 to 7160.000 is Vapour recovery on the storage tanks.' then 'old'
           when prompt = 'Where does the invented Heat integration project''s step start and end on the Agbor curve''s axis?' and options = '["From 1910.000 t to 5310.000 t", "From 760.000 t to 1910.000 t, after the heaters", "From 5310.000 t to 7160.000 t, as order 4", "From 0.000 t to 3400.000 t, as the first step"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The curve prints the Heat integration project, order 3, with cumulative start 1910.000 t and cumulative end 5310.000 t; its width is its 3400.000 t a year. 760.000 to 1910.000 is Repair failed steam traps and 5310.000 to 7160.000 is Vapour recovery on the storage tanks.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-marginal-abatement-cost-curve' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m02-the-marginal-abatement-cost-curve ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m02-the-marginal-abatement-cost-curve ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Where does the invented Heat integration project''s step start and end on the Agbor curve''s axis?', options = '["From 1910.000 t to 5310.000 t", "From 760.000 t to 1910.000 t, after the heaters", "From 5310.000 t to 7160.000 t, as order 4", "From 0.000 t to 3400.000 t, as the first step"]'::jsonb, explanation = 'The curve prints the Heat integration project, order 3, with cumulative start 1910.000 t and cumulative end 5310.000 t; its width is its 3400.000 t a year. 760.000 to 1910.000 is Repair failed steam traps and 5310.000 to 7160.000 is Vapour recovery on the storage tanks.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-marginal-abatement-cost-curve' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m02-the-marginal-abatement-cost-curve ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m02-the-marginal-abatement-cost-curve ord 4
  select case
           when prompt = 'The Agbor curve prints weightedAverageCostPerTonne 18.7868 USD. How does SECTION 20 define that figure?' and options = '["The mean of the six costs per tonne, each counted once", "netAnnualCostOfAll over paysForItselfTonnes, 5310.000 t", "netAnnualCostOfAll over totalAbatementTonnes", "The middle step''s cost per tonne"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 20: the weighted average is the net annual cost of all the measures over the total tonnes, 290443.84 USD over 15460.000 t. The mean of the six costs per tonne, each counted once, is -29.7913 USD (computed here).' then 'old'
           when prompt = 'The Agbor curve prints weightedAverageCostPerTonne 18.7868 USD. How does the course define that figure?' and options = '["The mean of the six costs per tonne, each counted once", "netAnnualCostOfAll over paysForItselfTonnes, 5310.000 t", "netAnnualCostOfAll over totalAbatementTonnes", "The middle step''s cost per tonne"]'::jsonb and answer_index = 2 and explanation is not distinct from 'In the course, the weighted average is the net annual cost of all the measures over the total tonnes, 290443.84 USD over 15460.000 t. The mean of the six costs per tonne, each counted once, is -29.7913 USD (computed here).' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-marginal-abatement-cost-curve' and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m02-the-marginal-abatement-cost-curve ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m02-the-marginal-abatement-cost-curve ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The Agbor curve prints weightedAverageCostPerTonne 18.7868 USD. How does the course define that figure?', options = '["The mean of the six costs per tonne, each counted once", "netAnnualCostOfAll over paysForItselfTonnes, 5310.000 t", "netAnnualCostOfAll over totalAbatementTonnes", "The middle step''s cost per tonne"]'::jsonb, explanation = 'In the course, the weighted average is the net annual cost of all the measures over the total tonnes, 290443.84 USD over 15460.000 t. The mean of the six costs per tonne, each counted once, is -29.7913 USD (computed here).'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-marginal-abatement-cost-curve' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m02-the-marginal-abatement-cost-curve ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m02-the-marginal-abatement-cost-curve ord 5
  select case
           when prompt = 'SECTION 20 computes a plain mean of the six Agbor costs per tonne, -29.7913 USD. What does the digest say that plain mean does?' and options = '["It counts the heater measures twice, as they share a source.", "It leaves the three measures that pay for themselves out of it.", "It weights a small measure the same as a large one.", "It sums the net annual costs to four decimals before dividing."]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 20: the plain mean of the six costs per tonne (computed here) is -29.7913 USD, which weights a small measure the same as a large one. The four-decimal sum belongs to the rounding note on netAnnualCostOfAll, and the plain mean takes in all six costs.' then 'old'
           when prompt = 'The course computes a plain mean of the six Agbor costs per tonne, -29.7913 USD. What does the course say that plain mean does?' and options = '["It counts the heater measures twice, as they share a source.", "It leaves the three measures that pay for themselves out of it.", "It weights a small measure the same as a large one.", "It sums the net annual costs to four decimals before dividing."]'::jsonb and answer_index = 2 and explanation is not distinct from 'In the course, the plain mean of the six costs per tonne (computed here) is -29.7913 USD, which weights a small measure the same as a large one. The four-decimal sum belongs to the rounding note on netAnnualCostOfAll, and the plain mean takes in all six costs.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-marginal-abatement-cost-curve' and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m02-the-marginal-abatement-cost-curve ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m02-the-marginal-abatement-cost-curve ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course computes a plain mean of the six Agbor costs per tonne, -29.7913 USD. What does the course say that plain mean does?', options = '["It counts the heater measures twice, as they share a source.", "It leaves the three measures that pay for themselves out of it.", "It weights a small measure the same as a large one.", "It sums the net annual costs to four decimals before dividing."]'::jsonb, explanation = 'In the course, the plain mean of the six costs per tonne (computed here) is -29.7913 USD, which weights a small measure the same as a large one. The four-decimal sum belongs to the rounding note on netAnnualCostOfAll, and the plain mean takes in all six costs.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-marginal-abatement-cost-curve' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m02-the-marginal-abatement-cost-curve ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m02-the-marginal-abatement-cost-curve ord 6
  select case
           when prompt = 'The six net annual costs as SECTION 18 prints them sum to 290443.85 USD, while the curve prints netAnnualCostOfAll 290443.84 USD. What does the rounding note say the engine does?' and options = '["It sums the net annual costs it holds to four decimals.", "It drops one cent for the measure that is refused.", "It removes the heater overlap before it sums the costs.", "It rounds each cost per tonne before weighting the six."]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 20''s ROUNDING NOTE: the six net annual costs as printed in SECTION 18 sum to 290443.85 USD; the engine sums the net annual costs it holds to four decimals, which gives 290443.84 USD. No measure is refused on this curve, and the overlap is surfaced as additive false.' then 'old'
           when prompt = 'The six net annual costs as the cost table prints them sum to 290443.85 USD, while the curve prints netAnnualCostOfAll 290443.84 USD. What does the rounding note say the engine does?' and options = '["It sums the net annual costs it holds to four decimals.", "It drops one cent for the measure that is refused.", "It removes the heater overlap before it sums the costs.", "It rounds each cost per tonne before weighting the six."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The curve''s ROUNDING NOTE: the six net annual costs as printed in the cost table sum to 290443.85 USD; the engine sums the net annual costs it holds to four decimals, which gives 290443.84 USD. No measure is refused on this curve, and the overlap is surfaced as additive false.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-marginal-abatement-cost-curve' and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m02-the-marginal-abatement-cost-curve ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m02-the-marginal-abatement-cost-curve ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The six net annual costs as the cost table prints them sum to 290443.85 USD, while the curve prints netAnnualCostOfAll 290443.84 USD. What does the rounding note say the engine does?', options = '["It sums the net annual costs it holds to four decimals.", "It drops one cent for the measure that is refused.", "It removes the heater overlap before it sums the costs.", "It rounds each cost per tonne before weighting the six."]'::jsonb, explanation = 'The curve''s ROUNDING NOTE: the six net annual costs as printed in the cost table sum to 290443.85 USD; the engine sums the net annual costs it holds to four decimals, which gives 290443.84 USD. No measure is refused on this curve, and the overlap is surfaced as additive false.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-marginal-abatement-cost-curve' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m02-the-marginal-abatement-cost-curve ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m02-the-marginal-abatement-cost-curve ord 7
  select case
           when prompt = 'The Agbor curve prints paysForItselfTonnes 5310.000. Which figure on the step table carries the same value?' and options = '["The cumulative end of order 2, Repair failed steam traps, 1910.000 t", "The tonnes a year of the Heat integration project, 3400.000 t", "The cumulative start of order 6, Flare gas recovery, 9260.000 t", "The cumulative end of order 3, the Heat integration project"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 20 prints order 3, the Heat integration project, with cumulative end 5310.000 t, and paysForItselfTonnes 5310.000 with paysForItselfMeasures naming orders 1 to 3. The other options carry 1910.000, 3400.000 and 9260.000 t.' then 'old'
           when prompt = 'The Agbor curve prints paysForItselfTonnes 5310.000. Which figure on the step table carries the same value?' and options = '["The cumulative end of order 2, Repair failed steam traps, 1910.000 t", "The tonnes a year of the Heat integration project, 3400.000 t", "The cumulative start of order 6, Flare gas recovery, 9260.000 t", "The cumulative end of order 3, the Heat integration project"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The curve prints order 3, the Heat integration project, with cumulative end 5310.000 t, and paysForItselfTonnes 5310.000 with paysForItselfMeasures naming orders 1 to 3. The other options carry 1910.000, 3400.000 and 9260.000 t.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-marginal-abatement-cost-curve' and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m02-the-marginal-abatement-cost-curve ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m02-the-marginal-abatement-cost-curve ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The Agbor curve prints paysForItselfTonnes 5310.000. Which figure on the step table carries the same value?', options = '["The cumulative end of order 2, Repair failed steam traps, 1910.000 t", "The tonnes a year of the Heat integration project, 3400.000 t", "The cumulative start of order 6, Flare gas recovery, 9260.000 t", "The cumulative end of order 3, the Heat integration project"]'::jsonb, explanation = 'The curve prints order 3, the Heat integration project, with cumulative end 5310.000 t, and paysForItselfTonnes 5310.000 with paysForItselfMeasures naming orders 1 to 3. The other options carry 1910.000, 3400.000 and 9260.000 t.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-marginal-abatement-cost-curve' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m02-the-marginal-abatement-cost-curve ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m02-the-marginal-abatement-cost-curve ord 8
  select case
           when prompt = 'The Agbor curve prints additive false. Which entry in SECTION 20 goes with that flag?' and options = '["An over-claims entry naming the flare: Flare gas recovery claiming more than it emits", "An interaction table naming heaters: Tune the fired heaters and the Heat integration project", "A refusedMeasures entry naming the Heat integration project, whose capital was blank", "A paysForItselfMeasures entry naming Tune the fired heaters and Repair failed steam traps"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 20 prints the interaction table, heaters: Tune the fired heaters; Heat integration project, with the note that measures acting on the same source are NOT additive. The costed curve carries no refused measure, over-claims belong to the 9400 t claim of SECTION 21, and paysForItselfMeasures names three measures.' then 'old'
           when prompt = 'The Agbor curve prints additive false. Which entry in the curve table goes with that flag?' and options = '["An over-claims entry naming the flare: Flare gas recovery claiming more than it emits", "An interaction table naming heaters: Tune the fired heaters and the Heat integration project", "A refusedMeasures entry naming the Heat integration project, whose capital was blank", "A paysForItselfMeasures entry naming Tune the fired heaters and Repair failed steam traps"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The curve prints the interaction table, heaters: Tune the fired heaters; Heat integration project, with the note that measures acting on the same source are NOT additive. The costed curve carries no refused measure, over-claims belong to the 9400 t claim of the target checks, and paysForItselfMeasures names three measures.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-marginal-abatement-cost-curve' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m02-the-marginal-abatement-cost-curve ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m02-the-marginal-abatement-cost-curve ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The Agbor curve prints additive false. Which entry in the curve table goes with that flag?', options = '["An over-claims entry naming the flare: Flare gas recovery claiming more than it emits", "An interaction table naming heaters: Tune the fired heaters and the Heat integration project", "A refusedMeasures entry naming the Heat integration project, whose capital was blank", "A paysForItselfMeasures entry naming Tune the fired heaters and Repair failed steam traps"]'::jsonb, explanation = 'The curve prints the interaction table, heaters: Tune the fired heaters; Heat integration project, with the note that measures acting on the same source are NOT additive. The costed curve carries no refused measure, over-claims belong to the 9400 t claim of the target checks, and paysForItselfMeasures names three measures.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-marginal-abatement-cost-curve' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m02-the-marginal-abatement-cost-curve ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m02-the-marginal-abatement-cost-curve ord 9
  select case
           when prompt = 'Which of these does SECTION 26 list as recomputed by neither oracle?' and options = '["paysForItselfTonnes on the curve", "the curve''s rank order", "each measure''s levelised cost per tonne", "the path''s year-by-year abated tonnes"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 26 lists paysForItselfTonnes as recomputed by neither oracle. oracle_carbonabatement.py takes the curve by explicit rank, each cost per tonne from a present value ledger and the path as a year ledger.' then 'old'
           when prompt = 'Which of these does the course list as recomputed by neither oracle?' and options = '["paysForItselfTonnes on the curve", "the curve''s rank order", "each measure''s levelised cost per tonne", "the path''s year-by-year abated tonnes"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course lists paysForItselfTonnes as recomputed by neither oracle. oracle_carbonabatement.py takes the curve by explicit rank, each cost per tonne from a present value ledger and the path as a year ledger.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-marginal-abatement-cost-curve' and ord = 9;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m02-the-marginal-abatement-cost-curve ord 9'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m02-the-marginal-abatement-cost-curve ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which of these does the course list as recomputed by neither oracle?', options = '["paysForItselfTonnes on the curve", "the curve''s rank order", "each measure''s levelised cost per tonne", "the path''s year-by-year abated tonnes"]'::jsonb, explanation = 'The course lists paysForItselfTonnes as recomputed by neither oracle. oracle_carbonabatement.py takes the curve by explicit rank, each cost per tonne from a present value ledger and the path as a year ledger.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-marginal-abatement-cost-curve' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m02-the-marginal-abatement-cost-curve ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m02-the-marginal-abatement-cost-curve ord 10
  select case
           when prompt = 'SECTION 20 prints 0.343467 beside the Agbor curve''s outputs. What is it?' and options = '["Flare gas recovery''s share of the axis, returned by the engine with the curve", "The weighted average cost per tonne over the plain mean, computed by the digest", "The capital recovery factor of the Heat integration project at a rate of 0.1", "paysForItselfTonnes as a share of totalAbatementTonnes, computed by the digest"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 20: paysForItselfTonnes as a share of totalAbatementTonnes (computed here), 0.343467. The Heat integration project''s capital recovery factor is 0.13147378 (SECTION 18), and the digest prints no share for Flare gas recovery and no ratio of the two averages.' then 'old'
           when prompt = 'The course prints 0.343467 beside the Agbor curve''s outputs. What is it?' and options = '["Flare gas recovery''s share of the axis, returned by the engine with the curve", "The weighted average cost per tonne over the plain mean, computed by the course", "The capital recovery factor of the Heat integration project at a rate of 0.1", "paysForItselfTonnes as a share of totalAbatementTonnes, computed by the course"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course gives paysForItselfTonnes as a share of totalAbatementTonnes (computed here), 0.343467. The Heat integration project''s capital recovery factor is 0.13147378, and the course prints no share for Flare gas recovery and no ratio of the two averages.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-marginal-abatement-cost-curve' and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m02-the-marginal-abatement-cost-curve ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m02-the-marginal-abatement-cost-curve ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course prints 0.343467 beside the Agbor curve''s outputs. What is it?', options = '["Flare gas recovery''s share of the axis, returned by the engine with the curve", "The weighted average cost per tonne over the plain mean, computed by the course", "The capital recovery factor of the Heat integration project at a rate of 0.1", "paysForItselfTonnes as a share of totalAbatementTonnes, computed by the course"]'::jsonb, explanation = 'The course gives paysForItselfTonnes as a share of totalAbatementTonnes (computed here), 0.343467. The Heat integration project''s capital recovery factor is 0.13147378, and the course prints no share for Flare gas recovery and no ratio of the two averages.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-marginal-abatement-cost-curve' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m02-the-marginal-abatement-cost-curve ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m02-the-marginal-abatement-cost-curve ord 11
  select case
           when prompt = 'The invented Flare gas recovery abates 6200.000 t a year. Which order does the Agbor curve give it, and where does its step start?' and options = '["Order 1, starting at 0.000 t", "Order 4, starting at 5310.000 t", "Order 6, starting at 9260.000 t", "Order 6, starting at 7160.000 t"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 20 prints Flare gas recovery as order 6 at 78.1002 USD a tonne, cumulative start 9260.000 t and end 15460.000 t. 7160.000 t is where order 5, Solar for purchased power, starts, and 5310.000 t is the start of order 4.' then 'old'
           when prompt = 'The invented Flare gas recovery abates 6200.000 t a year. Which order does the Agbor curve give it, and where does its step start?' and options = '["Order 1, starting at 0.000 t", "Order 4, starting at 5310.000 t", "Order 6, starting at 9260.000 t", "Order 6, starting at 7160.000 t"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The curve prints Flare gas recovery as order 6 at 78.1002 USD a tonne, cumulative start 9260.000 t and end 15460.000 t. 7160.000 t is where order 5, Solar for purchased power, starts, and 5310.000 t is the start of order 4.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-marginal-abatement-cost-curve' and ord = 11;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m02-the-marginal-abatement-cost-curve ord 11'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m02-the-marginal-abatement-cost-curve ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The invented Flare gas recovery abates 6200.000 t a year. Which order does the Agbor curve give it, and where does its step start?', options = '["Order 1, starting at 0.000 t", "Order 4, starting at 5310.000 t", "Order 6, starting at 9260.000 t", "Order 6, starting at 7160.000 t"]'::jsonb, explanation = 'The curve prints Flare gas recovery as order 6 at 78.1002 USD a tonne, cumulative start 9260.000 t and end 15460.000 t. 7160.000 t is where order 5, Solar for purchased power, starts, and 5310.000 t is the start of order 4.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-marginal-abatement-cost-curve' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m02-the-marginal-abatement-cost-curve ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m02-the-marginal-abatement-cost-curve ord 12
  select case
           when prompt = 'On the Agbor step chart, what does the height of a step show?' and options = '["The measure''s tonnes abated a year", "The measure''s cost per tonne in US dollars", "The measure''s capital cost in US dollars", "The measure''s cumulative end on the axis"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 20: each step''s width is its tonnes a year and its height its cost per tonne; the steps tile the axis from 0. The cumulative end is where a step stops along the width axis.' then 'old'
           when prompt = 'On the Agbor step chart, what does the height of a step show?' and options = '["The measure''s tonnes abated a year", "The measure''s cost per tonne in US dollars", "The measure''s capital cost in US dollars", "The measure''s cumulative end on the axis"]'::jsonb and answer_index = 1 and explanation is not distinct from 'On the curve, each step''s width is its tonnes a year and its height its cost per tonne; the steps tile the axis from 0. The cumulative end is where a step stops along the width axis.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-marginal-abatement-cost-curve' and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m02-the-marginal-abatement-cost-curve ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m02-the-marginal-abatement-cost-curve ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'On the Agbor step chart, what does the height of a step show?', options = '["The measure''s tonnes abated a year", "The measure''s cost per tonne in US dollars", "The measure''s capital cost in US dollars", "The measure''s cumulative end on the axis"]'::jsonb, explanation = 'On the curve, each step''s width is its tonnes a year and its height its cost per tonne; the steps tile the axis from 0. The cumulative end is where a step stops along the width axis.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-marginal-abatement-cost-curve' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m02-the-marginal-abatement-cost-curve ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m02-the-marginal-abatement-cost-curve ord 13
  select case
           when prompt = 'Which pair gives the Agbor curve''s weighted average and the digest''s plain mean, in that order?' and options = '["-29.7913 and 18.7868 USD a tonne", "18.7868 USD a tonne and 0.343467", "290443.84 USD and -29.7913 USD a tonne", "18.7868 and -29.7913 USD a tonne"]'::jsonb and answer_index = 3 and explanation is not distinct from '18.7868 USD is the engine''s weightedAverageCostPerTonne; -29.7913 USD is the digest''s own plain mean, computed here. 290443.84 USD is a money total and 0.343467 a share of tonnes.' then 'old'
           when prompt = 'Which pair gives the Agbor curve''s weighted average and the course''s plain mean, in that order?' and options = '["-29.7913 and 18.7868 USD a tonne", "18.7868 USD a tonne and 0.343467", "290443.84 USD and -29.7913 USD a tonne", "18.7868 and -29.7913 USD a tonne"]'::jsonb and answer_index = 3 and explanation is not distinct from '18.7868 USD is the engine''s weightedAverageCostPerTonne; -29.7913 USD is the course''s own plain mean, computed here. 290443.84 USD is a money total and 0.343467 a share of tonnes.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-marginal-abatement-cost-curve' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m02-the-marginal-abatement-cost-curve ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m02-the-marginal-abatement-cost-curve ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which pair gives the Agbor curve''s weighted average and the course''s plain mean, in that order?', options = '["-29.7913 and 18.7868 USD a tonne", "18.7868 USD a tonne and 0.343467", "290443.84 USD and -29.7913 USD a tonne", "18.7868 and -29.7913 USD a tonne"]'::jsonb, explanation = '18.7868 USD is the engine''s weightedAverageCostPerTonne; -29.7913 USD is the course''s own plain mean, computed here. 290443.84 USD is a money total and 0.343467 a share of tonnes.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-marginal-abatement-cost-curve' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m02-the-marginal-abatement-cost-curve ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m02-the-marginal-abatement-cost-curve ord 14
  select case
           when prompt = 'Where does the first step of the Agbor curve start, and which measure is it?' and options = '["At 0.000 t, Tune the fired heaters", "At 0.000 t, Repair failed steam traps", "At 760.000 t, Tune the fired heaters", "At 0.000 t, Flare gas recovery"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 20: the steps tile the axis from 0, and order 1 is Tune the fired heaters, cumulative start 0.000 and end 760.000 t, at -167.4364 USD a tonne. Repair failed steam traps is order 2 from 760.000 t, and Flare gas recovery is order 6.' then 'old'
           when prompt = 'Where does the first step of the Agbor curve start, and which measure is it?' and options = '["At 0.000 t, Tune the fired heaters", "At 0.000 t, Repair failed steam traps", "At 760.000 t, Tune the fired heaters", "At 0.000 t, Flare gas recovery"]'::jsonb and answer_index = 0 and explanation is not distinct from 'On the curve, the steps tile the axis from 0, and order 1 is Tune the fired heaters, cumulative start 0.000 and end 760.000 t, at -167.4364 USD a tonne. Repair failed steam traps is order 2 from 760.000 t, and Flare gas recovery is order 6.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-marginal-abatement-cost-curve' and ord = 14;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m02-the-marginal-abatement-cost-curve ord 14'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m02-the-marginal-abatement-cost-curve ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Where does the first step of the Agbor curve start, and which measure is it?', options = '["At 0.000 t, Tune the fired heaters", "At 0.000 t, Repair failed steam traps", "At 760.000 t, Tune the fired heaters", "At 0.000 t, Flare gas recovery"]'::jsonb, explanation = 'On the curve, the steps tile the axis from 0, and order 1 is Tune the fired heaters, cumulative start 0.000 and end 760.000 t, at -167.4364 USD a tonne. Repair failed steam traps is order 2 from 760.000 t, and Flare gas recovery is order 6.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-marginal-abatement-cost-curve' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m02-the-marginal-abatement-cost-curve ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m02-the-marginal-abatement-cost-curve ord 15
  select case
           when prompt = 'Which two measures sit either side of zero on the Agbor curve, as orders 3 and 4?' and options = '["Repair failed steam traps at -156.4390 and Heat integration project at -14.2492", "Heat integration project at -14.2492 and Vapour recovery on the storage tanks at 35.4193", "Heat integration project at -14.2492 and Solar for purchased power at 45.8573", "Vapour recovery on the storage tanks at 35.4193 and Solar for purchased power at 45.8573"]'::jsonb and answer_index = 1 and explanation is not distinct from 'Read SECTION 20''s order column: 3 is the Heat integration project, the last negative step, and 4 is Vapour recovery on the storage tanks, the first positive one.' then 'old'
           when prompt = 'Which two measures sit either side of zero on the Agbor curve, as orders 3 and 4?' and options = '["Repair failed steam traps at -156.4390 and Heat integration project at -14.2492", "Heat integration project at -14.2492 and Vapour recovery on the storage tanks at 35.4193", "Heat integration project at -14.2492 and Solar for purchased power at 45.8573", "Vapour recovery on the storage tanks at 35.4193 and Solar for purchased power at 45.8573"]'::jsonb and answer_index = 1 and explanation is not distinct from 'Read the curve''s order column: 3 is the Heat integration project, the last negative step, and 4 is Vapour recovery on the storage tanks, the first positive one.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-marginal-abatement-cost-curve' and ord = 15;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m02-the-marginal-abatement-cost-curve ord 15'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m02-the-marginal-abatement-cost-curve ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which two measures sit either side of zero on the Agbor curve, as orders 3 and 4?', options = '["Repair failed steam traps at -156.4390 and Heat integration project at -14.2492", "Heat integration project at -14.2492 and Vapour recovery on the storage tanks at 35.4193", "Heat integration project at -14.2492 and Solar for purchased power at 45.8573", "Vapour recovery on the storage tanks at 35.4193 and Solar for purchased power at 45.8573"]'::jsonb, explanation = 'Read the curve''s order column: 3 is the Heat integration project, the last negative step, and 4 is Vapour recovery on the storage tanks, the first positive one.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm02-the-marginal-abatement-cost-curve' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m02-the-marginal-abatement-cost-curve ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m03-interactions-and-over-claims ord 1
  select case
           when prompt = 'On the invented AGBOR inventory (IPCC AR6 GWP100, fossil methane), which emission does the Carbon Studio pass to the curve for the flare?' and options = '["6189.848 tCO2e, the Flaring (CO2) line alone", "1372.285 tCO2e, the unburned CH4 line alone", "7562.133 tCO2e, its CO2 plus its methane in CO2e", "9400.000 t, the claim of Flare gas recovery on it"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 21: each source''s emission is its CO2 plus its methane in CO2e, as the Carbon Studio passes it to the curve; the flare source is passed as 7562.133 tCO2e. 6189.848 and 1372.285 tCO2e are its two inventory lines, and 9400 t is the enlarged claim of the second curve.' then 'old'
           when prompt = 'On the invented AGBOR inventory (IPCC AR6 GWP100, fossil methane), which emission does the Carbon Studio pass to the curve for the flare?' and options = '["6189.848 tCO2e, the Flaring (CO2) line alone", "1372.285 tCO2e, the unburned CH4 line alone", "7562.133 tCO2e, its CO2 plus its methane in CO2e", "9400.000 t, the claim of Flare gas recovery on it"]'::jsonb and answer_index = 2 and explanation is not distinct from 'In the target checks, each source''s emission is its CO2 plus its methane in CO2e, as the Carbon Studio passes it to the curve; the flare source is passed as 7562.133 tCO2e. 6189.848 and 1372.285 tCO2e are its two inventory lines, and 9400 t is the enlarged claim of the second curve.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-interactions-and-over-claims' and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m03-interactions-and-over-claims ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m03-interactions-and-over-claims ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'On the invented AGBOR inventory (IPCC AR6 GWP100, fossil methane), which emission does the Carbon Studio pass to the curve for the flare?', options = '["6189.848 tCO2e, the Flaring (CO2) line alone", "1372.285 tCO2e, the unburned CH4 line alone", "7562.133 tCO2e, its CO2 plus its methane in CO2e", "9400.000 t, the claim of Flare gas recovery on it"]'::jsonb, explanation = 'In the target checks, each source''s emission is its CO2 plus its methane in CO2e, as the Carbon Studio passes it to the curve; the flare source is passed as 7562.133 tCO2e. 6189.848 and 1372.285 tCO2e are its two inventory lines, and 9400 t is the enlarged claim of the second curve.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-interactions-and-over-claims' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m03-interactions-and-over-claims ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m03-interactions-and-over-claims ord 2
  select case
           when prompt = 'Flare gas recovery''s invented claim is raised to 9400 t a year with the flare''s emission passed. What does the over-claims column print?' and options = '["flare: claimed 9400.000 against 7562.133 emitted", "flare: claimed 9400.000 against 6189.848 emitted", "flare: claimed 6200.000 against 7562.133 emitted", "none, since the flare''s emission was passed to the curve"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 21, the curve with flare gas recovery claiming 9400 t: over-claims flare: claimed 9400.000 against 7562.133 emitted. 6189.848 tCO2e is the flare''s CO2 line alone, and at its costed 6200 t the first curve prints over-claims none.' then 'old'
           when prompt = 'Flare gas recovery''s invented claim is raised to 9400 t a year with the flare''s emission passed. What does the over-claims column print?' and options = '["flare: claimed 9400.000 against 7562.133 emitted", "flare: claimed 9400.000 against 6189.848 emitted", "flare: claimed 6200.000 against 7562.133 emitted", "none, since the flare''s emission was passed to the curve"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The curve with flare gas recovery claiming 9400 t prints over-claims flare: claimed 9400.000 against 7562.133 emitted. 6189.848 tCO2e is the flare''s CO2 line alone, and at its costed 6200 t the first curve prints over-claims none.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-interactions-and-over-claims' and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m03-interactions-and-over-claims ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m03-interactions-and-over-claims ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Flare gas recovery''s invented claim is raised to 9400 t a year with the flare''s emission passed. What does the over-claims column print?', options = '["flare: claimed 9400.000 against 7562.133 emitted", "flare: claimed 9400.000 against 6189.848 emitted", "flare: claimed 6200.000 against 7562.133 emitted", "none, since the flare''s emission was passed to the curve"]'::jsonb, explanation = 'The curve with flare gas recovery claiming 9400 t prints over-claims flare: claimed 9400.000 against 7562.133 emitted. 6189.848 tCO2e is the flare''s CO2 line alone, and at its costed 6200 t the first curve prints over-claims none.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-interactions-and-over-claims' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m03-interactions-and-over-claims ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m03-interactions-and-over-claims ord 3
  select case
           when prompt = 'Which targetBasis does SECTION 21 print on the curve where Flare gas recovery claims 9400 t with the flare''s emission passed?' and options = '["not assessed: no computed emission to check the claims on steam, power, vents", "not assessed: no computed emission to check the claims on steam, flare, power, vents", "not assessed: no computed emission to check the claims on steam", "not assessed: claims exceed what a source emits"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 21 prints "not assessed: claims exceed what a source emits" on that row. The steam, power, vents basis is the six measures as costed, the basis naming the flare is the same claim with the flare''s emission not passed, and the steam-only basis is the curve with every computed source passed.' then 'old'
           when prompt = 'Which targetBasis does the course print on the curve where Flare gas recovery claims 9400 t with the flare''s emission passed?' and options = '["not assessed: no computed emission to check the claims on steam, power, vents", "not assessed: no computed emission to check the claims on steam, flare, power, vents", "not assessed: no computed emission to check the claims on steam", "not assessed: claims exceed what a source emits"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course prints "not assessed: claims exceed what a source emits" on that row. The steam, power, vents basis is the six measures as costed, the basis naming the flare is the same claim with the flare''s emission not passed, and the steam-only basis is the curve with every computed source passed.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-interactions-and-over-claims' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m03-interactions-and-over-claims ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m03-interactions-and-over-claims ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which targetBasis does the course print on the curve where Flare gas recovery claims 9400 t with the flare''s emission passed?', options = '["not assessed: no computed emission to check the claims on steam, power, vents", "not assessed: no computed emission to check the claims on steam, flare, power, vents", "not assessed: no computed emission to check the claims on steam", "not assessed: claims exceed what a source emits"]'::jsonb, explanation = 'The course prints "not assessed: claims exceed what a source emits" on that row. The steam, power, vents basis is the six measures as costed, the basis naming the flare is the same claim with the flare''s emission not passed, and the steam-only basis is the curve with every computed source passed.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-interactions-and-over-claims' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m03-interactions-and-over-claims ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m03-interactions-and-over-claims ord 4
  select case
           when prompt = 'Rerun that 9400 t curve, this time giving it no flare emission. What do the over-claims column and the targetBasis print?' and options = '["flare: claimed 9400.000 against 7562.133 emitted, found as on the row before", "none, and the targetBasis names the flare among the sources it could not check", "flare: claimed 9400.000 against 0.000 emitted, since no emission was passed", "none, and the targetBasis reads claims exceed what a source emits"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 21, the same claim with the flare''s emission not passed: over-claims none, meetsTarget none, targetBasis "not assessed: no computed emission to check the claims on steam, flare, power, vents". With nothing passed for the flare there is nothing to check the claim against.' then 'old'
           when prompt = 'Rerun that 9400 t curve, this time giving it no flare emission. What do the over-claims column and the targetBasis print?' and options = '["flare: claimed 9400.000 against 7562.133 emitted, found as on the row before", "none, and the targetBasis names the flare among the sources it could not check", "flare: claimed 9400.000 against 0.000 emitted, since no emission was passed", "none, and the targetBasis reads claims exceed what a source emits"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The same claim with the flare''s emission not passed prints over-claims none, meetsTarget none, targetBasis "not assessed: no computed emission to check the claims on steam, flare, power, vents". With nothing passed for the flare there is nothing to check the claim against.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-interactions-and-over-claims' and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m03-interactions-and-over-claims ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m03-interactions-and-over-claims ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Rerun that 9400 t curve, this time giving it no flare emission. What do the over-claims column and the targetBasis print?', options = '["flare: claimed 9400.000 against 7562.133 emitted, found as on the row before", "none, and the targetBasis names the flare among the sources it could not check", "flare: claimed 9400.000 against 0.000 emitted, since no emission was passed", "none, and the targetBasis reads claims exceed what a source emits"]'::jsonb, explanation = 'The same claim with the flare''s emission not passed prints over-claims none, meetsTarget none, targetBasis "not assessed: no computed emission to check the claims on steam, flare, power, vents". With nothing passed for the flare there is nothing to check the claim against.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-interactions-and-over-claims' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m03-interactions-and-over-claims ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m03-interactions-and-over-claims ord 5
  select case
           when prompt = 'On the six invented Agbor measures as costed, which measures does the engine list among the unchecked claims?' and options = '["Repair failed steam traps, Solar for purchased power and Vapour recovery on the storage tanks", "Tune the fired heaters, Solar for purchased power and Vapour recovery on the storage tanks", "Repair failed steam traps, Flare gas recovery and Vapour recovery on the storage tanks", "Repair failed steam traps, Solar for purchased power and the Heat integration project"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 21 lists the unchecked claims of the first row: Repair failed steam traps (steam), Solar for purchased power (power) and Vapour recovery on the storage tanks (vents), each with the reason no emission was given for the source. Heaters and flare are the two sources passed.' then 'old'
           when prompt = 'On the six invented Agbor measures as costed, which measures does the engine list among the unchecked claims?' and options = '["Repair failed steam traps, Solar for purchased power and Vapour recovery on the storage tanks", "Tune the fired heaters, Solar for purchased power and Vapour recovery on the storage tanks", "Repair failed steam traps, Flare gas recovery and Vapour recovery on the storage tanks", "Repair failed steam traps, Solar for purchased power and the Heat integration project"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course lists the unchecked claims of the first row: Repair failed steam traps (steam), Solar for purchased power (power) and Vapour recovery on the storage tanks (vents), each with the reason no emission was given for the source. Heaters and flare are the two sources passed.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-interactions-and-over-claims' and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m03-interactions-and-over-claims ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m03-interactions-and-over-claims ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'On the six invented Agbor measures as costed, which measures does the engine list among the unchecked claims?', options = '["Repair failed steam traps, Solar for purchased power and Vapour recovery on the storage tanks", "Tune the fired heaters, Solar for purchased power and Vapour recovery on the storage tanks", "Repair failed steam traps, Flare gas recovery and Vapour recovery on the storage tanks", "Repair failed steam traps, Solar for purchased power and the Heat integration project"]'::jsonb, explanation = 'The course lists the unchecked claims of the first row: Repair failed steam traps (steam), Solar for purchased power (power) and Vapour recovery on the storage tanks (vents), each with the reason no emission was given for the source. Heaters and flare are the two sources passed.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-interactions-and-over-claims' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m03-interactions-and-over-claims ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m03-interactions-and-over-claims ord 6
  select case
           when prompt = 'Every source the Agbor inventory computes is passed to the curve. Which source does uncheckedSources still name?' and options = '["power, the Purchased electricity line on Scope 2", "vents, the vented and fugitive methane line", "steam, which has no line of its own in the Agbor inventory", "flare, as its emission is passed as its CO2 line alone"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 21: with every source the inventory computes passed, uncheckedSources is steam: the Agbor inventory has no line of its own for steam. Power (10988.000 tCO2e) and vents (2622.400 tCO2e) join heaters and flare, and the flare is passed as its CO2 plus its methane.' then 'old'
           when prompt = 'Every source the Agbor inventory computes is passed to the curve. Which source does uncheckedSources still name?' and options = '["power, the Purchased electricity line on Scope 2", "vents, the vented and fugitive methane line", "steam, which has no line of its own in the Agbor inventory", "flare, as its emission is passed as its CO2 line alone"]'::jsonb and answer_index = 2 and explanation is not distinct from 'In the target checks, with every source the inventory computes passed, uncheckedSources is steam: the Agbor inventory has no line of its own for steam. Power (10988.000 tCO2e) and vents (2622.400 tCO2e) join heaters and flare, and the flare is passed as its CO2 plus its methane.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-interactions-and-over-claims' and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m03-interactions-and-over-claims ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m03-interactions-and-over-claims ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Every source the Agbor inventory computes is passed to the curve. Which source does uncheckedSources still name?', options = '["power, the Purchased electricity line on Scope 2", "vents, the vented and fugitive methane line", "steam, which has no line of its own in the Agbor inventory", "flare, as its emission is passed as its CO2 line alone"]'::jsonb, explanation = 'In the target checks, with every source the inventory computes passed, uncheckedSources is steam: the Agbor inventory has no line of its own for steam. Power (10988.000 tCO2e) and vents (2622.400 tCO2e) join heaters and flare, and the flare is passed as its CO2 plus its methane.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-interactions-and-over-claims' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m03-interactions-and-over-claims ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m03-interactions-and-over-claims ord 7
  select case
           when prompt = 'SECTION 21 costs Flare gas recovery at its 9400 t claim. Against the costed 6200 t, what moves?' and options = '["The net annual cost falls to 290443.84 USD and the cost per tonne holds", "The net annual cost stays at 484221.51 USD and the cost per tonne rises", "Both hold, at 484221.51 USD and 78.1002 USD a tonne, since no cost moves", "The net annual cost stays at 484221.51 USD and the cost per tonne falls"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 21 costs the 9400 t claim at a net annual cost of 484221.51 USD, the figure SECTION 18 prints for the measure at 6200 t and 78.1002 USD a tonne, and reads it: "The cost per tonne falls as the claimed tonnes rise; the over-claim makes the measure look cheaper as well as larger." 290443.84 USD is the curve''s netAnnualCostOfAll.' then 'old'
           when prompt = 'The course costs Flare gas recovery at its 9400 t claim. Against the costed 6200 t, what moves?' and options = '["The net annual cost falls to 290443.84 USD and the cost per tonne holds", "The net annual cost stays at 484221.51 USD and the cost per tonne rises", "Both hold, at 484221.51 USD and 78.1002 USD a tonne, since no cost moves", "The net annual cost stays at 484221.51 USD and the cost per tonne falls"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course costs the 9400 t claim at a net annual cost of 484221.51 USD, the figure the cost table prints for the measure at 6200 t and 78.1002 USD a tonne, and reads it: "The cost per tonne falls as the claimed tonnes rise; the over-claim makes the measure look cheaper as well as larger." 290443.84 USD is the curve''s netAnnualCostOfAll.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-interactions-and-over-claims' and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m03-interactions-and-over-claims ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m03-interactions-and-over-claims ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course costs Flare gas recovery at its 9400 t claim. Against the costed 6200 t, what moves?', options = '["The net annual cost falls to 290443.84 USD and the cost per tonne holds", "The net annual cost stays at 484221.51 USD and the cost per tonne rises", "Both hold, at 484221.51 USD and 78.1002 USD a tonne, since no cost moves", "The net annual cost stays at 484221.51 USD and the cost per tonne falls"]'::jsonb, explanation = 'The course costs the 9400 t claim at a net annual cost of 484221.51 USD, the figure the cost table prints for the measure at 6200 t and 78.1002 USD a tonne, and reads it: "The cost per tonne falls as the claimed tonnes rise; the over-claim makes the measure look cheaper as well as larger." 290443.84 USD is the curve''s netAnnualCostOfAll.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-interactions-and-over-claims' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m03-interactions-and-over-claims ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m03-interactions-and-over-claims ord 8
  select case
           when prompt = 'SECTION 21 closes with its rules for a target verdict. In which case does the verdict stand, labelled an upper bound?' and options = '["Where a claim exceeds what its source emits.", "Where measures only interact and every claim is checked.", "Where a claim acts on a source whose emission is not passed.", "Where every source the inventory computes is passed to it."]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 21: "Where measures only interact and every claim is checked, the verdict stands and is labelled an upper bound." A claim above its source''s emission gives none, a claim on a source not passed gives none, and the curve with every computed source passed still prints none, on steam.' then 'old'
           when prompt = 'The course closes the target checks with its rules for a verdict. In which case does the verdict stand, labelled an upper bound?' and options = '["Where a claim exceeds what its source emits.", "Where measures only interact and every claim is checked.", "Where a claim acts on a source whose emission is not passed.", "Where every source the inventory computes is passed to it."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The course states: "Where measures only interact and every claim is checked, the verdict stands and is labelled an upper bound." A claim above its source''s emission gives none, a claim on a source not passed gives none, and the curve with every computed source passed still prints none, on steam.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-interactions-and-over-claims' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m03-interactions-and-over-claims ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m03-interactions-and-over-claims ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course closes the target checks with its rules for a verdict. In which case does the verdict stand, labelled an upper bound?', options = '["Where a claim exceeds what its source emits.", "Where measures only interact and every claim is checked.", "Where a claim acts on a source whose emission is not passed.", "Where every source the inventory computes is passed to it."]'::jsonb, explanation = 'The course states: "Where measures only interact and every claim is checked, the verdict stands and is labelled an upper bound." A claim above its source''s emission gives none, a claim on a source not passed gives none, and the curve with every computed source passed still prints none, on steam.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-interactions-and-over-claims' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m03-interactions-and-over-claims ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m03-interactions-and-over-claims ord 9
  select case
           when prompt = 'Tune the fired heaters and the Heat integration project both act on heaters. What does the engine do with their tonnes on the curve?' and options = '["It keeps the larger claim, 3400.000 t, and drops Tune the fired heaters from the total.", "It refuses the curve until the user sequences the two measures on the one source.", "It counts both in full, 760.000 and 3400.000 t, and calls the cumulative curve an upper bound.", "It counts both in full and names heaters in the over-claims column of the curve."]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 20 prints both measures at 760.000 and 3400.000 t, additive false, and the note: "Measures listed here act on the same source, so their abatements are NOT additive and the cumulative curve is an upper bound. Resolving the overlap needs an engineering judgement about sequencing, which is why it is surfaced rather than solved." The costed curve prints over-claims none.' then 'old'
           when prompt = 'Tune the fired heaters and the Heat integration project both act on heaters. What does the engine do with their tonnes on the curve?' and options = '["It keeps the larger claim, 3400.000 t, and drops Tune the fired heaters from the total.", "It refuses the curve until the user sequences the two measures on the one source.", "It counts both in full, 760.000 and 3400.000 t, and calls the cumulative curve an upper bound.", "It counts both in full and names heaters in the over-claims column of the curve."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The curve prints both measures at 760.000 and 3400.000 t, additive false, and the note: "Measures listed here act on the same source, so their abatements are NOT additive and the cumulative curve is an upper bound. Resolving the overlap needs an engineering judgement about sequencing, which is why it is surfaced rather than solved." The costed curve prints over-claims none.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-interactions-and-over-claims' and ord = 9;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m03-interactions-and-over-claims ord 9'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m03-interactions-and-over-claims ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Tune the fired heaters and the Heat integration project both act on heaters. What does the engine do with their tonnes on the curve?', options = '["It keeps the larger claim, 3400.000 t, and drops Tune the fired heaters from the total.", "It refuses the curve until the user sequences the two measures on the one source.", "It counts both in full, 760.000 and 3400.000 t, and calls the cumulative curve an upper bound.", "It counts both in full and names heaters in the over-claims column of the curve."]'::jsonb, explanation = 'The curve prints both measures at 760.000 and 3400.000 t, additive false, and the note: "Measures listed here act on the same source, so their abatements are NOT additive and the cumulative curve is an upper bound. Resolving the overlap needs an engineering judgement about sequencing, which is why it is surfaced rather than solved." The costed curve prints over-claims none.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-interactions-and-over-claims' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m03-interactions-and-over-claims ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m03-interactions-and-over-claims ord 10
  select case
           when prompt = 'Every SECTION 21 curve is checked against a target of 16830.083 tCO2e. What is that target?' and options = '["30 percent of the inventory total of 56100.276 tCO2e", "30 percent of the curve''s total abatement of 15460.000 t", "The purchased electricity line of 10988.000 tCO2e", "The path''s target in its end year, 39270.193 t"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 21: the target is 30 percent of the inventory total: 16830.083 tCO2e (computed here, as the Carbon Studio computes it). The inventory total is 56100.276 tCO2e. 39270.193 t is the path''s target in 2033 (SECTION 22).' then 'old'
           when prompt = 'Every target-check curve is checked against a target of 16830.083 tCO2e. What is that target?' and options = '["30 percent of the inventory total of 56100.276 tCO2e", "30 percent of the curve''s total abatement of 15460.000 t", "The purchased electricity line of 10988.000 tCO2e", "The path''s target in its end year, 39270.193 t"]'::jsonb and answer_index = 0 and explanation is not distinct from 'In the course, the target is 30 percent of the inventory total: 16830.083 tCO2e (computed here, as the Carbon Studio computes it). The inventory total is 56100.276 tCO2e. 39270.193 t is the path''s target in 2033.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-interactions-and-over-claims' and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m03-interactions-and-over-claims ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m03-interactions-and-over-claims ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Every target-check curve is checked against a target of 16830.083 tCO2e. What is that target?', options = '["30 percent of the inventory total of 56100.276 tCO2e", "30 percent of the curve''s total abatement of 15460.000 t", "The purchased electricity line of 10988.000 tCO2e", "The path''s target in its end year, 39270.193 t"]'::jsonb, explanation = 'In the course, the target is 30 percent of the inventory total: 16830.083 tCO2e (computed here, as the Carbon Studio computes it). The inventory total is 56100.276 tCO2e. 39270.193 t is the path''s target in 2033.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-interactions-and-over-claims' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m03-interactions-and-over-claims ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m03-interactions-and-over-claims ord 11
  select case
           when prompt = 'The six measures as costed print a residual to target of 1370.083 t beside meetsTarget none. How does SECTION 26 treat the curve''s residual?' and options = '["Recomputed by oracle_carbonabatement.py as part of its year ledger", "Recomputed by oracle_energyefficiency.py as a levelised cost per tonne", "Recomputed by both oracles, and its goldens asserted by the test suites", "Recomputed by neither oracle; taught from the engine and never graded"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The residual is on SECTION 26''s list of outputs no oracle recomputes, so it is taught from the engine and never graded. A year ledger is the oracle''s route for the path, a different output.' then 'old'
           when prompt = 'The six measures as costed print a residual to target of 1370.083 t beside meetsTarget none. How does the course treat the curve''s residual?' and options = '["Recomputed by oracle_carbonabatement.py as part of its year ledger", "Recomputed by oracle_energyefficiency.py as a levelised cost per tonne", "Recomputed by both oracles, and its goldens asserted by the test suites", "Recomputed by neither oracle; taught from the engine and never graded"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The residual is on the course''s list of outputs no oracle recomputes, so it is taught from the engine and never graded. A year ledger is the oracle''s route for the path, a different output.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-interactions-and-over-claims' and ord = 11;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m03-interactions-and-over-claims ord 11'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m03-interactions-and-over-claims ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The six measures as costed print a residual to target of 1370.083 t beside meetsTarget none. How does the course treat the curve''s residual?', options = '["Recomputed by oracle_carbonabatement.py as part of its year ledger", "Recomputed by oracle_energyefficiency.py as a levelised cost per tonne", "Recomputed by both oracles, and its goldens asserted by the test suites", "Recomputed by neither oracle; taught from the engine and never graded"]'::jsonb, explanation = 'The residual is on the course''s list of outputs no oracle recomputes, so it is taught from the engine and never graded. A year ledger is the oracle''s route for the path, a different output.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-interactions-and-over-claims' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m03-interactions-and-over-claims ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m03-interactions-and-over-claims ord 12
  select case
           when prompt = 'With every source the inventory computes passed, which two sources join heaters and flare, and at what emissions?' and options = '["steam 10988.000 and vents 2622.400 tCO2e", "power 10988.000 and vents 2622.400 tCO2e", "power 10988.000 and steam 2622.400 tCO2e", "power 1372.285 and vents 2622.400 tCO2e"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 21, the sources added with every computed source passed: power 10988.000 tCO2e and vents 2622.400 tCO2e, from the Purchased electricity and the Vented and fugitive methane lines. Steam has no inventory line, and 1372.285 tCO2e is the flare''s unburned CH4 line.' then 'old'
           when prompt = 'With every source the inventory computes passed, which two sources join heaters and flare, and at what emissions?' and options = '["steam 10988.000 and vents 2622.400 tCO2e", "power 10988.000 and vents 2622.400 tCO2e", "power 10988.000 and steam 2622.400 tCO2e", "power 1372.285 and vents 2622.400 tCO2e"]'::jsonb and answer_index = 1 and explanation is not distinct from 'In the target checks, the sources added with every computed source passed: power 10988.000 tCO2e and vents 2622.400 tCO2e, from the Purchased electricity and the Vented and fugitive methane lines. Steam has no inventory line, and 1372.285 tCO2e is the flare''s unburned CH4 line.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-interactions-and-over-claims' and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m03-interactions-and-over-claims ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m03-interactions-and-over-claims ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'With every source the inventory computes passed, which two sources join heaters and flare, and at what emissions?', options = '["steam 10988.000 and vents 2622.400 tCO2e", "power 10988.000 and vents 2622.400 tCO2e", "power 10988.000 and steam 2622.400 tCO2e", "power 1372.285 and vents 2622.400 tCO2e"]'::jsonb, explanation = 'In the target checks, the sources added with every computed source passed: power 10988.000 tCO2e and vents 2622.400 tCO2e, from the Purchased electricity and the Vented and fugitive methane lines. Steam has no inventory line, and 1372.285 tCO2e is the flare''s unburned CH4 line.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-interactions-and-over-claims' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m03-interactions-and-over-claims ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m03-interactions-and-over-claims ord 13
  select case
           when prompt = 'Flare gas recovery''s invented claim is raised from 6200 t to 9400 t. Which curve figure moves, and to what?' and options = '["Total abatement, from 15460.000 to 18660.000 t", "The target, from 16830.083 to 18660.000 t", "The residual to target, from 0.000 to 1370.083 t", "The flare''s emission passed, from 7562.133 to 9400.000"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 21 prints total abatement 15460.000 t on the six as costed and 18660.000 t with the 9400 t claim. The target is 16830.083 t on both rows, the residual moves from 1370.083 to 0.000 t, and the flare''s emission passed stays 7562.133 tCO2e.' then 'old'
           when prompt = 'Flare gas recovery''s invented claim is raised from 6200 t to 9400 t. Which curve figure moves, and to what?' and options = '["Total abatement, from 15460.000 to 18660.000 t", "The target, from 16830.083 to 18660.000 t", "The residual to target, from 0.000 to 1370.083 t", "The flare''s emission passed, from 7562.133 to 9400.000"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course prints total abatement 15460.000 t on the six as costed and 18660.000 t with the 9400 t claim. The target is 16830.083 t on both rows, the residual moves from 1370.083 to 0.000 t, and the flare''s emission passed stays 7562.133 tCO2e.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-interactions-and-over-claims' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m03-interactions-and-over-claims ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m03-interactions-and-over-claims ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Flare gas recovery''s invented claim is raised from 6200 t to 9400 t. Which curve figure moves, and to what?', options = '["Total abatement, from 15460.000 to 18660.000 t", "The target, from 16830.083 to 18660.000 t", "The residual to target, from 0.000 to 1370.083 t", "The flare''s emission passed, from 7562.133 to 9400.000"]'::jsonb, explanation = 'The course prints total abatement 15460.000 t on the six as costed and 18660.000 t with the 9400 t claim. The target is 16830.083 t on both rows, the residual moves from 1370.083 to 0.000 t, and the flare''s emission passed stays 7562.133 tCO2e.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-interactions-and-over-claims' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m03-interactions-and-over-claims ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m03-interactions-and-over-claims ord 14
  select case
           when prompt = 'Of the curves SECTION 21 prints, which returns a verdict on the target?' and options = '["The six measures as costed, labelled an upper bound.", "The curve with every source the inventory computes.", "None of them: every row prints meetsTarget none.", "The 9400 t claim, whose total passes the target."]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 21 prints meetsTarget none on all four rows, each with a targetBasis beginning "not assessed": three on sources with no computed emission, one on claims that exceed what a source emits.' then 'old'
           when prompt = 'Of the curves the course checks, which returns a verdict on the target?' and options = '["The six measures as costed, labelled an upper bound.", "The curve with every source the inventory computes.", "None of them: every row prints meetsTarget none.", "The 9400 t claim, whose total passes the target."]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course prints meetsTarget none on all four rows, each with a targetBasis beginning "not assessed": three on sources with no computed emission, one on claims that exceed what a source emits.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-interactions-and-over-claims' and ord = 14;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m03-interactions-and-over-claims ord 14'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m03-interactions-and-over-claims ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Of the curves the course checks, which returns a verdict on the target?', options = '["The six measures as costed, labelled an upper bound.", "The curve with every source the inventory computes.", "None of them: every row prints meetsTarget none.", "The 9400 t claim, whose total passes the target."]'::jsonb, explanation = 'The course prints meetsTarget none on all four rows, each with a targetBasis beginning "not assessed": three on sources with no computed emission, one on claims that exceed what a source emits.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-interactions-and-over-claims' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m03-interactions-and-over-claims ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m03-interactions-and-over-claims ord 15
  select case
           when prompt = 'On the six measures as costed, what reason does the engine give for Solar for purchased power''s unchecked claim?' and options = '["claims exceed what a source emits on power", "measures act on the same source as solar", "the power line could not be computed", "no emission was given for the source"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 21''s unchecked claims of the first row: Solar for purchased power, power, no emission was given for the source. The over-claim wording belongs to the 9400 t row, and the shared-source wording to SECTION 20''s interaction note on heaters.' then 'old'
           when prompt = 'On the six measures as costed, what reason does the engine give for Solar for purchased power''s unchecked claim?' and options = '["claims exceed what a source emits on power", "measures act on the same source as solar", "the power line could not be computed", "no emission was given for the source"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The target check''s unchecked claims of the first row: Solar for purchased power, power, no emission was given for the source. The over-claim wording belongs to the 9400 t row, and the shared-source wording to the curve''s interaction note on heaters.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-interactions-and-over-claims' and ord = 15;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m03-interactions-and-over-claims ord 15'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m03-interactions-and-over-claims ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'On the six measures as costed, what reason does the engine give for Solar for purchased power''s unchecked claim?', options = '["claims exceed what a source emits on power", "measures act on the same source as solar", "the power line could not be computed", "no emission was given for the source"]'::jsonb, explanation = 'The target check''s unchecked claims of the first row: Solar for purchased power, power, no emission was given for the source. The over-claim wording belongs to the 9400 t row, and the shared-source wording to the curve''s interaction note on heaters.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm03-interactions-and-over-claims' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m03-interactions-and-over-claims ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m04-targets-and-the-path ord 1
  select case
           when prompt = 'On the invented AGBOR path, which year is firstShortfallYear, and what gap does the path print in it?' and options = '["2028, with a gap of 798.595 t", "2027, with a gap of 494.298 t", "2033, the end year, with a gap of 1370.083 t", "2029, when the Heat integration project starts"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 22: firstShortfallYear: 2027, and the 2027 row prints an unabated gap of 494.298 t. 2028 prints 798.595 t, 2033 prints 1370.083 t, and 2029 prints 0.000.' then 'old'
           when prompt = 'On the invented AGBOR path, which year is firstShortfallYear, and what gap does the path print in it?' and options = '["2028, with a gap of 798.595 t", "2027, with a gap of 494.298 t", "2033, the end year, with a gap of 1370.083 t", "2029, when the Heat integration project starts"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The path returns firstShortfallYear: 2027, and the 2027 row prints an unabated gap of 494.298 t. 2028 prints 798.595 t, 2033 prints 1370.083 t, and 2029 prints 0.000.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-targets-and-the-path' and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m04-targets-and-the-path ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m04-targets-and-the-path ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'On the invented AGBOR path, which year is firstShortfallYear, and what gap does the path print in it?', options = '["2028, with a gap of 798.595 t", "2027, with a gap of 494.298 t", "2033, the end year, with a gap of 1370.083 t", "2029, when the Heat integration project starts"]'::jsonb, explanation = 'The path returns firstShortfallYear: 2027, and the 2027 row prints an unabated gap of 494.298 t. 2028 prints 798.595 t, 2033 prints 1370.083 t, and 2029 prints 0.000.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-targets-and-the-path' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m04-targets-and-the-path ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m04-targets-and-the-path ord 2
  select case
           when prompt = 'The Agbor electricity factor is left blank and the path is built on that inventory. What does it print for finalGapTonnes?' and options = '["1370.083 t, the same final gap the path prints on the full inventory", "3220.083 t, with purchased electricity named as unscheduled", "0.000 t, on a baseline of 45112.276 tCO2e that is reportable false", "A refusal: the baseline must be a positive tonnage"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 22, ON A PARTIAL INVENTORY: with the electricity factor blank the inventory totals 45112.276 tCO2e and is reportable false; the path on it prints finalGapTonnes 0.000. 1370.083 t is the full inventory''s final gap and 3220.083 t the path with a measure unscheduled.' then 'old'
           when prompt = 'The Agbor electricity factor is left blank and the path is built on that inventory. What does it print for finalGapTonnes?' and options = '["1370.083 t, the same final gap the path prints on the full inventory", "3220.083 t, with purchased electricity named as unscheduled", "0.000 t, on a baseline of 45112.276 tCO2e that is reportable false", "A refusal: the baseline must be a positive tonnage"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The path ON A PARTIAL INVENTORY: with the electricity factor blank the inventory totals 45112.276 tCO2e and is reportable false; the path on it prints finalGapTonnes 0.000. 1370.083 t is the full inventory''s final gap and 3220.083 t the path with a measure unscheduled.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-targets-and-the-path' and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m04-targets-and-the-path ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m04-targets-and-the-path ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The Agbor electricity factor is left blank and the path is built on that inventory. What does it print for finalGapTonnes?', options = '["1370.083 t, the same final gap the path prints on the full inventory", "3220.083 t, with purchased electricity named as unscheduled", "0.000 t, on a baseline of 45112.276 tCO2e that is reportable false", "A refusal: the baseline must be a positive tonnage"]'::jsonb, explanation = 'The path ON A PARTIAL INVENTORY: with the electricity factor blank the inventory totals 45112.276 tCO2e and is reportable false; the path on it prints finalGapTonnes 0.000. 1370.083 t is the full inventory''s final gap and 3220.083 t the path with a measure unscheduled.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-targets-and-the-path' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m04-targets-and-the-path ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m04-targets-and-the-path ord 3
  select case
           when prompt = 'Built on the partial Agbor inventory instead of the full one, which path figure moves from 39270.193 t to 31578.593 t?' and options = '["The target in the end year", "finalGapTonnes, the gap in 2033", "The emissions the path prints in 2033", "The tonnes abated in the end year"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 22 prints the target in the end year as 39270.193 t on the full inventory and 31578.593 t on the partial one. finalGapTonnes moves from 1370.083 to 0.000, and the measures are the same six.' then 'old'
           when prompt = 'Built on the partial Agbor inventory instead of the full one, which path figure moves from 39270.193 t to 31578.593 t?' and options = '["The target in the end year", "finalGapTonnes, the gap in 2033", "The emissions the path prints in 2033", "The tonnes abated in the end year"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The path prints the target in the end year as 39270.193 t on the full inventory and 31578.593 t on the partial one. finalGapTonnes moves from 1370.083 to 0.000, and the measures are the same six.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-targets-and-the-path' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m04-targets-and-the-path ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m04-targets-and-the-path ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Built on the partial Agbor inventory instead of the full one, which path figure moves from 39270.193 t to 31578.593 t?', options = '["The target in the end year", "finalGapTonnes, the gap in 2033", "The emissions the path prints in 2033", "The tonnes abated in the end year"]'::jsonb, explanation = 'The path prints the target in the end year as 39270.193 t on the full inventory and 31578.593 t on the partial one. finalGapTonnes moves from 1370.083 to 0.000, and the measures are the same six.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-targets-and-the-path' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m04-targets-and-the-path ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m04-targets-and-the-path ord 4
  select case
           when prompt = 'How does decarbonisationPath report the Agbor gap of 1370.083 t in the end year?' and options = '["As a wedge of future measures that closes it by 2033", "As a cost, at the curve''s weighted average of 18.7868 USD a tonne", "As a refusal until a measure is named to close it", "As unabated, with no measure identified"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 22, the gap note: "The gap is reported as unabated with no measure identified. It is deliberately not drawn as a wedge of future measures, because a wedge with nothing behind it is not a plan." The path prints finalGapTonnes 1370.083 and no refusal.' then 'old'
           when prompt = 'How does decarbonisationPath report the Agbor gap of 1370.083 t in the end year?' and options = '["As a wedge of future measures that closes it by 2033", "As a cost, at the curve''s weighted average of 18.7868 USD a tonne", "As a refusal until a measure is named to close it", "As unabated, with no measure identified"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The path''s gap note: "The gap is reported as unabated with no measure identified. It is deliberately not drawn as a wedge of future measures, because a wedge with nothing behind it is not a plan." The path prints finalGapTonnes 1370.083 and no refusal.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-targets-and-the-path' and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m04-targets-and-the-path ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m04-targets-and-the-path ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'How does decarbonisationPath report the Agbor gap of 1370.083 t in the end year?', options = '["As a wedge of future measures that closes it by 2033", "As a cost, at the curve''s weighted average of 18.7868 USD a tonne", "As a refusal until a measure is named to close it", "As unabated, with no measure identified"]'::jsonb, explanation = 'The path''s gap note: "The gap is reported as unabated with no measure identified. It is deliberately not drawn as a wedge of future measures, because a wedge with nothing behind it is not a plan." The path prints finalGapTonnes 1370.083 and no refusal.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-targets-and-the-path' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m04-targets-and-the-path ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m04-targets-and-the-path ord 5
  select case
           when prompt = 'In 2029 the Agbor path prints emissions of 48690.276 t against a target of 48887.383 t. What does the unabated gap column print?' and options = '["494.298 t, carried on from 2027", "798.595 t, carried on from 2028", "815.785 t, the gap before 2033", "0.000 t, by the rule in every row"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 22: in every row the unabated gap is emissions less the target where that is positive, else 0.000. The 2029 row prints 0.000. Each row is read on its own emissions and target: 494.298 t is the 2027 row and 798.595 t the 2028 row, and 815.785 t is the 2032 row of the unscheduled path.' then 'old'
           when prompt = 'In 2029 the Agbor path prints emissions of 48690.276 t against a target of 48887.383 t. What does the unabated gap column print?' and options = '["494.298 t, carried on from 2027", "798.595 t, carried on from 2028", "815.785 t, the gap before 2033", "0.000 t, by the rule in every row"]'::jsonb and answer_index = 3 and explanation is not distinct from 'On the path, in every row the unabated gap is emissions less the target where that is positive, else 0.000. The 2029 row prints 0.000. Each row is read on its own emissions and target: 494.298 t is the 2027 row and 798.595 t the 2028 row, and 815.785 t is the 2032 row of the unscheduled path.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-targets-and-the-path' and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m04-targets-and-the-path ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m04-targets-and-the-path ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'In 2029 the Agbor path prints emissions of 48690.276 t against a target of 48887.383 t. What does the unabated gap column print?', options = '["494.298 t, carried on from 2027", "798.595 t, carried on from 2028", "815.785 t, the gap before 2033", "0.000 t, by the rule in every row"]'::jsonb, explanation = 'On the path, in every row the unabated gap is emissions less the target where that is positive, else 0.000. The 2029 row prints 0.000. Each row is read on its own emissions and target: 494.298 t is the 2027 row and 798.595 t the 2028 row, and 815.785 t is the 2032 row of the unscheduled path.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-targets-and-the-path' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m04-targets-and-the-path ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m04-targets-and-the-path ord 6
  select case
           when prompt = 'Vapour recovery on the storage tanks is given no start year. What does the path do with it?' and options = '["Starts it in 2026, the baseline year, so finalGapTonnes stays 1370.083", "Names it in unscheduledMeasures and leaves it off; finalGapTonnes 3220.083", "Refuses the whole path until a start year is entered for the measure", "Starts it in 2033, the end year, and prints finalGapTonnes 1850.000"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 22: a measure with no start year is named and left off the path: unscheduledMeasures Vapour recovery on the storage tanks (no start year); finalGapTonnes 3220.083. SECTION 25 lists the rule: a measure with no start year is named.' then 'old'
           when prompt = 'Vapour recovery on the storage tanks is given no start year. What does the path do with it?' and options = '["Starts it in 2026, the baseline year, so finalGapTonnes stays 1370.083", "Names it in unscheduledMeasures and leaves it off; finalGapTonnes 3220.083", "Refuses the whole path until a start year is entered for the measure", "Starts it in 2033, the end year, and prints finalGapTonnes 1850.000"]'::jsonb and answer_index = 1 and explanation is not distinct from 'On the path, a measure with no start year is named and left off the path: unscheduledMeasures Vapour recovery on the storage tanks (no start year); finalGapTonnes 3220.083. The course lists the rule: a measure with no start year is named.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-targets-and-the-path' and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m04-targets-and-the-path ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m04-targets-and-the-path ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Vapour recovery on the storage tanks is given no start year. What does the path do with it?', options = '["Starts it in 2026, the baseline year, so finalGapTonnes stays 1370.083", "Names it in unscheduledMeasures and leaves it off; finalGapTonnes 3220.083", "Refuses the whole path until a start year is entered for the measure", "Starts it in 2033, the end year, and prints finalGapTonnes 1850.000"]'::jsonb, explanation = 'On the path, a measure with no start year is named and left off the path: unscheduledMeasures Vapour recovery on the storage tanks (no start year); finalGapTonnes 3220.083. The course lists the rule: a measure with no start year is named.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-targets-and-the-path' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m04-targets-and-the-path ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m04-targets-and-the-path ord 7
  select case
           when prompt = 'The digest prints the unscheduled path''s final gap less the scheduled one as 1850.000 t. Which figure does SECTION 22 say that matches?' and options = '["The tonnes a year of the measure left unscheduled", "The gap the unscheduled path prints in 2032", "The full baseline less the partial baseline", "Repair failed steam traps'' tonnes a year"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 22: that gap less the scheduled plan''s 1370.083 is 1850.000 t (computed here), the vapour recovery measure''s tonnes a year. The unscheduled 2032 gap is 815.785 t, the full baseline less the partial is 10988.000 tCO2e, and Repair failed steam traps abates 1150.000 t.' then 'old'
           when prompt = 'The course prints the unscheduled path''s final gap less the scheduled one as 1850.000 t. Which figure does it say that matches?' and options = '["The tonnes a year of the measure left unscheduled", "The gap the unscheduled path prints in 2032", "The full baseline less the partial baseline", "Repair failed steam traps'' tonnes a year"]'::jsonb and answer_index = 0 and explanation is not distinct from 'On the path, that gap less the scheduled plan''s 1370.083 is 1850.000 t (computed here), the vapour recovery measure''s tonnes a year. The unscheduled 2032 gap is 815.785 t, the full baseline less the partial is 10988.000 tCO2e, and Repair failed steam traps abates 1150.000 t.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-targets-and-the-path' and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m04-targets-and-the-path ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m04-targets-and-the-path ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course prints the unscheduled path''s final gap less the scheduled one as 1850.000 t. Which figure does it say that matches?', options = '["The tonnes a year of the measure left unscheduled", "The gap the unscheduled path prints in 2032", "The full baseline less the partial baseline", "Repair failed steam traps'' tonnes a year"]'::jsonb, explanation = 'On the path, that gap less the scheduled plan''s 1370.083 is 1850.000 t (computed here), the vapour recovery measure''s tonnes a year. The unscheduled 2032 gap is 815.785 t, the full baseline less the partial is 10988.000 tCO2e, and Repair failed steam traps abates 1150.000 t.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-targets-and-the-path' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m04-targets-and-the-path ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m04-targets-and-the-path ord 8
  select case
           when prompt = 'The same six Agbor measures are run against an invented baseline of 12000 t. What comes back?' and options = '["A path whose emissions reach 0.000 t in 2030 and stay", "A path with finalGapTonnes 0.000 and no shortfall year", "A refusal naming 2030, when the measures abate 13610 t", "A refusal naming 2031, when the measures abate 15460.000 t"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 22: REFUSED: In 2030 the scheduled measures abate 13610 t against a baseline of 12000 t. Emissions cannot fall below zero, so check the measures for double counting or a source outside the baseline. overAbatedYear 2030.' then 'old'
           when prompt = 'The same six Agbor measures are run against an invented baseline of 12000 t. What comes back?' and options = '["A path whose emissions reach 0.000 t in 2030 and stay", "A path with finalGapTonnes 0.000 and no shortfall year", "A refusal naming 2030, when the measures abate 13610 t", "A refusal naming 2031, when the measures abate 15460.000 t"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The engine returns REFUSED: In 2030 the scheduled measures abate 13610 t against a baseline of 12000 t. Emissions cannot fall below zero, so check the measures for double counting or a source outside the baseline. overAbatedYear 2030.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-targets-and-the-path' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m04-targets-and-the-path ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m04-targets-and-the-path ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The same six Agbor measures are run against an invented baseline of 12000 t. What comes back?', options = '["A path whose emissions reach 0.000 t in 2030 and stay", "A path with finalGapTonnes 0.000 and no shortfall year", "A refusal naming 2030, when the measures abate 13610 t", "A refusal naming 2031, when the measures abate 15460.000 t"]'::jsonb, explanation = 'The engine returns REFUSED: In 2030 the scheduled measures abate 13610 t against a baseline of 12000 t. Emissions cannot fall below zero, so check the measures for double counting or a source outside the baseline. overAbatedYear 2030.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-targets-and-the-path' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m04-targets-and-the-path ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m04-targets-and-the-path ord 9
  select case
           when prompt = 'An inventory that computed nothing is handed to decarbonisationPath as a baseline of 0. What does the engine say?' and options = '["It refuses: the baseline must be a positive tonnage.", "It draws the path from 0 and prints every gap as 0.000.", "It builds the path on the partial total of 45112.276 tCO2e.", "It names the inventory in unscheduledMeasures and goes on."]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 22: REFUSED: The baseline must be a positive tonnage. An inventory that computed nothing is not a baseline of zero. SECTION 25 lists it: a baseline that is not positive is refused. 45112.276 tCO2e is the partial inventory with the electricity factor blank.' then 'old'
           when prompt = 'An inventory that computed nothing is handed to decarbonisationPath as a baseline of 0. What does the engine say?' and options = '["It refuses: the baseline must be a positive tonnage.", "It draws the path from 0 and prints every gap as 0.000.", "It builds the path on the partial total of 45112.276 tCO2e.", "It names the inventory in unscheduledMeasures and goes on."]'::jsonb and answer_index = 0 and explanation is not distinct from 'The engine returns REFUSED: The baseline must be a positive tonnage. An inventory that computed nothing is not a baseline of zero. The course lists it: a baseline that is not positive is refused. 45112.276 tCO2e is the partial inventory with the electricity factor blank.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-targets-and-the-path' and ord = 9;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m04-targets-and-the-path ord 9'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m04-targets-and-the-path ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'An inventory that computed nothing is handed to decarbonisationPath as a baseline of 0. What does the engine say?', options = '["It refuses: the baseline must be a positive tonnage.", "It draws the path from 0 and prints every gap as 0.000.", "It builds the path on the partial total of 45112.276 tCO2e.", "It names the inventory in unscheduledMeasures and goes on."]'::jsonb, explanation = 'The engine returns REFUSED: The baseline must be a positive tonnage. An inventory that computed nothing is not a baseline of zero. The course lists it: a baseline that is not positive is refused. 45112.276 tCO2e is the partial inventory with the electricity factor blank.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-targets-and-the-path' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m04-targets-and-the-path ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m04-targets-and-the-path ord 11
  select case
           when prompt = 'Which invented Agbor measure is the last to go live on the path?' and options = '["Flare gas recovery, in 2030, as order 6", "Vapour recovery on the storage tanks, in 2031", "Solar for purchased power, in 2028", "Heat integration project, in 2029, as order 3"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 22''s start years run from 2027 to 2031, and Vapour recovery on the storage tanks carries 2031; its row joins the measures live from 2031. Flare gas recovery starts in 2030, Solar for purchased power in 2028 and the Heat integration project in 2029.' then 'old'
           when prompt = 'Which invented Agbor measure is the last to go live on the path?' and options = '["Flare gas recovery, in 2030, as order 6", "Vapour recovery on the storage tanks, in 2031", "Solar for purchased power, in 2028", "Heat integration project, in 2029, as order 3"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The path''s start years run from 2027 to 2031, and Vapour recovery on the storage tanks carries 2031; its row joins the measures live from 2031. Flare gas recovery starts in 2030, Solar for purchased power in 2028 and the Heat integration project in 2029.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-targets-and-the-path' and ord = 11;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m04-targets-and-the-path ord 11'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m04-targets-and-the-path ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which invented Agbor measure is the last to go live on the path?', options = '["Flare gas recovery, in 2030, as order 6", "Vapour recovery on the storage tanks, in 2031", "Solar for purchased power, in 2028", "Heat integration project, in 2029, as order 3"]'::jsonb, explanation = 'The path''s start years run from 2027 to 2031, and Vapour recovery on the storage tanks carries 2031; its row joins the measures live from 2031. Flare gas recovery starts in 2030, Solar for purchased power in 2028 and the Heat integration project in 2029.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-targets-and-the-path' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m04-targets-and-the-path ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m04-targets-and-the-path ord 12
  select case
           when prompt = 'How does the Carbon Studio draw the target on the Agbor path?' and options = '["In steps, falling each time one of the measures goes live", "Flat at 16830.083 t, which is 30 percent of the Agbor inventory total", "In a straight line from 56100.276 t in 2026 to 39270.193 t in 2033", "In a straight line from 56100.276 t in 2026 to 16830.083 t in 2033"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 22: the target falls in a straight line from the baseline in 2026 to 30 percent below it in 2033, as the Carbon Studio draws it: 56100.276 t in 2026 and 39270.193 t in 2033. 16830.083 tCO2e is the curve''s target of SECTION 21, and each measure counts in full from its start year.' then 'old'
           when prompt = 'How does the Carbon Studio draw the target on the Agbor path?' and options = '["In steps, falling each time one of the measures goes live", "Flat at 16830.083 t, which is 30 percent of the Agbor inventory total", "In a straight line from 56100.276 t in 2026 to 39270.193 t in 2033", "In a straight line from 56100.276 t in 2026 to 16830.083 t in 2033"]'::jsonb and answer_index = 2 and explanation is not distinct from 'On the path, the target falls in a straight line from the baseline in 2026 to 30 percent below it in 2033, as the Carbon Studio draws it: 56100.276 t in 2026 and 39270.193 t in 2033. 16830.083 tCO2e is the curve''s target, and each measure counts in full from its start year.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-targets-and-the-path' and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m04-targets-and-the-path ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m04-targets-and-the-path ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'How does the Carbon Studio draw the target on the Agbor path?', options = '["In steps, falling each time one of the measures goes live", "Flat at 16830.083 t, which is 30 percent of the Agbor inventory total", "In a straight line from 56100.276 t in 2026 to 39270.193 t in 2033", "In a straight line from 56100.276 t in 2026 to 16830.083 t in 2033"]'::jsonb, explanation = 'On the path, the target falls in a straight line from the baseline in 2026 to 30 percent below it in 2033, as the Carbon Studio draws it: 56100.276 t in 2026 and 39270.193 t in 2033. 16830.083 tCO2e is the curve''s target, and each measure counts in full from its start year.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-targets-and-the-path' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m04-targets-and-the-path ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m04-targets-and-the-path ord 13
  select case
           when prompt = 'From 2031 to 2033 the Agbor target falls from 44078.788 to 39270.193 t. Which column holds one value across those years?' and options = '["Unabated gap, at 0.000 t", "Abated tonnes, at 13610.000 t", "Unabated gap, at 1370.083 t in each", "Emissions, at 40640.276 t"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 22 prints emissions of 40640.276 t and abated tonnes of 15460.000 t in 2031, 2032 and 2033. The gap prints 0.000 in 2031 and 2032 and 1370.083 t in 2033, and 13610.000 t is the abated column of the unscheduled path.' then 'old'
           when prompt = 'From 2031 to 2033 the Agbor target falls from 44078.788 to 39270.193 t. Which column holds one value across those years?' and options = '["Unabated gap, at 0.000 t", "Abated tonnes, at 13610.000 t", "Unabated gap, at 1370.083 t in each", "Emissions, at 40640.276 t"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The path prints emissions of 40640.276 t and abated tonnes of 15460.000 t in 2031, 2032 and 2033. The gap prints 0.000 in 2031 and 2032 and 1370.083 t in 2033, and 13610.000 t is the abated column of the unscheduled path.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-targets-and-the-path' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m04-targets-and-the-path ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m04-targets-and-the-path ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'From 2031 to 2033 the Agbor target falls from 44078.788 to 39270.193 t. Which column holds one value across those years?', options = '["Unabated gap, at 0.000 t", "Abated tonnes, at 13610.000 t", "Unabated gap, at 1370.083 t in each", "Emissions, at 40640.276 t"]'::jsonb, explanation = 'The path prints emissions of 40640.276 t and abated tonnes of 15460.000 t in 2031, 2032 and 2033. The gap prints 0.000 in 2031 and 2032 and 1370.083 t in 2033, and 13610.000 t is the abated column of the unscheduled path.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-targets-and-the-path' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m04-targets-and-the-path ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m04-targets-and-the-path ord 14
  select case
           when prompt = 'One path summary figure agrees between the partial inventory and the full one. Which?' and options = '["firstShortfallYear, 2027", "finalGapTonnes, 1370.083", "The end-year target, 39270.193", "The baseline, 56100.276 tCO2e"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 22 prints firstShortfallYear 2027 on both baselines. On the partial inventory the end-year target is 31578.593 t, finalGapTonnes 0.000 and the baseline 45112.276 tCO2e.' then 'old'
           when prompt = 'One path summary figure agrees between the partial inventory and the full one. Which?' and options = '["firstShortfallYear, 2027", "finalGapTonnes, 1370.083", "The end-year target, 39270.193", "The baseline, 56100.276 tCO2e"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The path prints firstShortfallYear 2027 on both baselines. On the partial inventory the end-year target is 31578.593 t, finalGapTonnes 0.000 and the baseline 45112.276 tCO2e.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-targets-and-the-path' and ord = 14;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m04-targets-and-the-path ord 14'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m04-targets-and-the-path ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'One path summary figure agrees between the partial inventory and the full one. Which?', options = '["firstShortfallYear, 2027", "finalGapTonnes, 1370.083", "The end-year target, 39270.193", "The baseline, 56100.276 tCO2e"]'::jsonb, explanation = 'The path prints firstShortfallYear 2027 on both baselines. On the partial inventory the end-year target is 31578.593 t, finalGapTonnes 0.000 and the baseline 45112.276 tCO2e.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-targets-and-the-path' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m04-targets-and-the-path ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m04-targets-and-the-path ord 15
  select case
           when prompt = 'Take the unscheduled variant of the path. Which 2032 row does SECTION 22 print for it?' and options = '["0.000 t of gap on 15460.000 t abated", "3220.083 t of gap on 13610.000 t abated", "815.785 t of gap on 13610.000 t abated", "815.785 t of gap on 15460.000 t abated"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 22, the path with the measure unscheduled: 2032, abated 13610.000 t, emissions 42490.276 t, target 41674.491 t, gap 815.785 t. 3220.083 t is its 2033 gap, and 15460.000 t is the scheduled path''s abated column.' then 'old'
           when prompt = 'Take the unscheduled variant of the path. Which 2032 row does the course print for it?' and options = '["0.000 t of gap on 15460.000 t abated", "3220.083 t of gap on 13610.000 t abated", "815.785 t of gap on 13610.000 t abated", "815.785 t of gap on 15460.000 t abated"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The path with the measure unscheduled: 2032, abated 13610.000 t, emissions 42490.276 t, target 41674.491 t, gap 815.785 t. 3220.083 t is its 2033 gap, and 15460.000 t is the scheduled path''s abated column.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-targets-and-the-path' and ord = 15;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m04-targets-and-the-path ord 15'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m04-targets-and-the-path ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Take the unscheduled variant of the path. Which 2032 row does the course print for it?', options = '["0.000 t of gap on 15460.000 t abated", "3220.083 t of gap on 13610.000 t abated", "815.785 t of gap on 13610.000 t abated", "815.785 t of gap on 15460.000 t abated"]'::jsonb, explanation = 'The path with the measure unscheduled: 2032, abated 13610.000 t, emissions 42490.276 t, target 41674.491 t, gap 815.785 t. 3220.083 t is its 2033 gap, and 15460.000 t is the scheduled path''s abated column.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm04-targets-and-the-path' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m04-targets-and-the-path ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-savings-into-the-ledger ord 1
  select case
           when prompt = 'The invented AGBOR saving is priced with no emission factor supplied. What does priceSaving return for the carbon?' and options = '["annualTonnesCo2e 0.000, with the money value returned beside it as usual", "A refusal saying an emission factor is required before any pricing", "annualTonnesCo2e 661.980, read from a factor the engine ships", "annualTonnesCo2e none, with a note that the carbon figure is absent"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 23, no emission factor: annualTonnesCo2e none; carbonNote "No emission factor supplied, so the carbon figure is absent rather than zero." SECTION 25: emission factors are inputs and neither engine ships one. 661.980 is the carbon with the SYNTHETIC factor of 56.1 kg CO2e per GJ.' then 'old'
           when prompt = 'The invented AGBOR saving is priced with no emission factor supplied. What does priceSaving return for the carbon?' and options = '["annualTonnesCo2e 0.000, with the money value returned beside it as usual", "A refusal saying an emission factor is required before any pricing", "annualTonnesCo2e 661.980, read from a factor the engine ships", "annualTonnesCo2e none, with a note that the carbon figure is absent"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The saving with no emission factor: annualTonnesCo2e none; carbonNote "No emission factor supplied, so the carbon figure is absent rather than zero." The course states that emission factors are inputs and neither engine ships one. 661.980 is the carbon with the SYNTHETIC factor of 56.1 kg CO2e per GJ.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-savings-into-the-ledger' and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m05-savings-into-the-ledger ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m05-savings-into-the-ledger ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The invented AGBOR saving is priced with no emission factor supplied. What does priceSaving return for the carbon?', options = '["annualTonnesCo2e 0.000, with the money value returned beside it as usual", "A refusal saying an emission factor is required before any pricing", "annualTonnesCo2e 661.980, read from a factor the engine ships", "annualTonnesCo2e none, with a note that the carbon figure is absent"]'::jsonb, explanation = 'The saving with no emission factor: annualTonnesCo2e none; carbonNote "No emission factor supplied, so the carbon figure is absent rather than zero." The course states that emission factors are inputs and neither engine ships one. 661.980 is the carbon with the SYNTHETIC factor of 56.1 kg CO2e per GJ.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-savings-into-the-ledger' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m05-savings-into-the-ledger ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-savings-into-the-ledger ord 2
  select case
           when prompt = 'The invented saving is declared on LHV and its emission factor on HHV. What does priceSaving do?' and options = '["It computes and attaches the basisNote asking for all three on the same basis.", "It refuses: a gigajoule on one basis is a different amount of fuel on the other.", "It converts the factor to LHV and returns 661.980 tCO2e with basis LHV.", "It computes and returns basis HHV beside the money and the carbon."]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 23: REFUSED: The energy saving is on LHV, the emission factor is on HHV. A gigajoule on one heating value basis is a different amount of fuel on the other, so they cannot be multiplied together. The basisNote is the answer when no basis is declared at all.' then 'old'
           when prompt = 'The invented saving is declared on LHV and its emission factor on HHV. What does priceSaving do?' and options = '["It computes and attaches the basisNote asking for all three on the same basis.", "It refuses: a gigajoule on one basis is a different amount of fuel on the other.", "It converts the factor to LHV and returns 661.980 tCO2e with basis LHV.", "It computes and returns basis HHV beside the money and the carbon."]'::jsonb and answer_index = 1 and explanation is not distinct from 'The engine returns REFUSED: The energy saving is on LHV, the emission factor is on HHV. A gigajoule on one heating value basis is a different amount of fuel on the other, so they cannot be multiplied together. The basisNote is the answer when no basis is declared at all.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-savings-into-the-ledger' and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m05-savings-into-the-ledger ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m05-savings-into-the-ledger ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The invented saving is declared on LHV and its emission factor on HHV. What does priceSaving do?', options = '["It computes and attaches the basisNote asking for all three on the same basis.", "It refuses: a gigajoule on one basis is a different amount of fuel on the other.", "It converts the factor to LHV and returns 661.980 tCO2e with basis LHV.", "It computes and returns basis HHV beside the money and the carbon."]'::jsonb, explanation = 'The engine returns REFUSED: The energy saving is on LHV, the emission factor is on HHV. A gigajoule on one heating value basis is a different amount of fuel on the other, so they cannot be multiplied together. The basisNote is the answer when no basis is declared at all.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-savings-into-the-ledger' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m05-savings-into-the-ledger ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-savings-into-the-ledger ord 3
  select case
           when prompt = 'The invented saving is sent with no heating value basis declared. What does priceSaving do?' and options = '["It returns a basisNote: the saving, price and factor must share one basis", "It refuses: the energy saving is on LHV and the emission factor on HHV", "It reads every quantity as LHV by default and returns basis LHV with no note", "It refuses: an energy saving and a basis are both required to price"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 23, no basis declared: basisNote "No heating value basis declared. The saving, the fuel price and the emission factor must all be on the same one (IPCC default factors are on net calorific value, which is LHV)." That row prints no refusal. The LHV and HHV refusal is the call with the saving on LHV and the factor on HHV, and the only saving refusal printed is for a blank saving.' then 'old'
           when prompt = 'The invented saving is sent with no heating value basis declared. What does priceSaving do?' and options = '["It returns a basisNote: the saving, price and factor must share one basis", "It refuses: the energy saving is on LHV and the emission factor on HHV", "It reads every quantity as LHV by default and returns basis LHV with no note", "It refuses: an energy saving and a basis are both required to price"]'::jsonb and answer_index = 0 and explanation is not distinct from 'With no basis declared: basisNote "No heating value basis declared. The saving, the fuel price and the emission factor must all be on the same one (IPCC default factors are on net calorific value, which is LHV)." That row prints no refusal. The LHV and HHV refusal is the call with the saving on LHV and the factor on HHV, and the only saving refusal printed is for a blank saving.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-savings-into-the-ledger' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m05-savings-into-the-ledger ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m05-savings-into-the-ledger ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The invented saving is sent with no heating value basis declared. What does priceSaving do?', options = '["It returns a basisNote: the saving, price and factor must share one basis", "It refuses: the energy saving is on LHV and the emission factor on HHV", "It reads every quantity as LHV by default and returns basis LHV with no note", "It refuses: an energy saving and a basis are both required to price"]'::jsonb, explanation = 'With no basis declared: basisNote "No heating value basis declared. The saving, the fuel price and the emission factor must all be on the same one (IPCC default factors are on net calorific value, which is LHV)." That row prints no refusal. The LHV and HHV refusal is the call with the saving on LHV and the factor on HHV, and the only saving refusal printed is for a blank saving.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-savings-into-the-ledger' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m05-savings-into-the-ledger ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-savings-into-the-ledger ord 4
  select case
           when prompt = 'The invented saving is priced with no life and no rate. What comes back for the cost per tonne?' and options = '["A refusal, the one abatementCost gives a measure with capital and no life", "costPerTonneCo2e 183.5403 USD, the whole cost set against one year", "costPerTonneCo2e none, with a note asking for the life and a discount rate", "costPerTonneCo2e -74.2270 USD, annualised straight line at a rate of 0"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 23, no life and no rate: costPerTonneCo2e none; costPerTonneNote "A cost per tonne needs the measure life and a discount rate, to annualise the implementation cost against a yearly saving." -74.2270 USD is the cost at 8 years and 0.1, and 183.5403 USD is the digest''s one-year figure.' then 'old'
           when prompt = 'The invented saving is priced with no life and no rate. What comes back for the cost per tonne?' and options = '["A refusal, the one abatementCost gives a measure with capital and no life", "costPerTonneCo2e 183.5403 USD, the whole cost set against one year", "costPerTonneCo2e none, with a note asking for the life and a discount rate", "costPerTonneCo2e -74.2270 USD, annualised straight line at a rate of 0"]'::jsonb and answer_index = 2 and explanation is not distinct from 'With no life and no rate: costPerTonneCo2e none; costPerTonneNote "A cost per tonne needs the measure life and a discount rate, to annualise the implementation cost against a yearly saving." -74.2270 USD is the cost at 8 years and 0.1, and 183.5403 USD is the course''s one-year figure.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-savings-into-the-ledger' and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m05-savings-into-the-ledger ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m05-savings-into-the-ledger ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The invented saving is priced with no life and no rate. What comes back for the cost per tonne?', options = '["A refusal, the one abatementCost gives a measure with capital and no life", "costPerTonneCo2e 183.5403 USD, the whole cost set against one year", "costPerTonneCo2e none, with a note asking for the life and a discount rate", "costPerTonneCo2e -74.2270 USD, annualised straight line at a rate of 0"]'::jsonb, explanation = 'With no life and no rate: costPerTonneCo2e none; costPerTonneNote "A cost per tonne needs the measure life and a discount rate, to annualise the implementation cost against a yearly saving." -74.2270 USD is the cost at 8 years and 0.1, and 183.5403 USD is the course''s one-year figure.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-savings-into-the-ledger' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m05-savings-into-the-ledger ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-savings-into-the-ledger ord 5
  select case
           when prompt = 'The invented saving prints simplePaybackYears 2.372881. What does SECTION 23 say that figure is?' and options = '["210000 over 88500.00, discounted at 0.1 over the 8 year life", "210000 over 88500.00: undiscounted, with no life and no rate in it", "39363.24 over 88500.00, the annualised cost over one year''s value", "210000 over 661.980, the implementation cost over a year''s tonnes"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 23: the simple payback is the implementation cost over one year''s value, 210000 / 88500.00 = 2.372881 years (computed here): undiscounted, with no life and no rate in it. 39363.24 USD is the annualised capital of the direct abatementCost call.' then 'old'
           when prompt = 'The invented saving prints simplePaybackYears 2.372881. What does the course say that figure is?' and options = '["210000 over 88500.00, discounted at 0.1 over the 8 year life", "210000 over 88500.00: undiscounted, with no life and no rate in it", "39363.24 over 88500.00, the annualised cost over one year''s value", "210000 over 661.980, the implementation cost over a year''s tonnes"]'::jsonb and answer_index = 1 and explanation is not distinct from 'In the course, the simple payback is the implementation cost over one year''s value, 210000 / 88500.00 = 2.372881 years (computed here): undiscounted, with no life and no rate in it. 39363.24 USD is the annualised capital of the direct abatementCost call.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-savings-into-the-ledger' and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m05-savings-into-the-ledger ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m05-savings-into-the-ledger ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The invented saving prints simplePaybackYears 2.372881. What does the course say that figure is?', options = '["210000 over 88500.00, discounted at 0.1 over the 8 year life", "210000 over 88500.00: undiscounted, with no life and no rate in it", "39363.24 over 88500.00, the annualised cost over one year''s value", "210000 over 661.980, the implementation cost over a year''s tonnes"]'::jsonb, explanation = 'In the course, the simple payback is the implementation cost over one year''s value, 210000 / 88500.00 = 2.372881 years (computed here): undiscounted, with no life and no rate in it. 39363.24 USD is the annualised capital of the direct abatementCost call.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-savings-into-the-ledger' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m05-savings-into-the-ledger ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-savings-into-the-ledger ord 6
  select case
           when prompt = 'priceSaving hands the invented saving to abatementCost. Which argument does the implementation cost of 210000 USD fill?' and options = '["The annual cost", "The annual savings", "The tonnes abated a year", "The capital"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 23: the cost per tonne is carbonAbatement.abatementCost called with the implementation cost as capital, the annual value as the saving and the annual tonnes as the abatement. The annual cost is not one of the three arguments SECTION 23 names.' then 'old'
           when prompt = 'priceSaving hands the invented saving to abatementCost. Which argument does the implementation cost of 210000 USD fill?' and options = '["The annual cost", "The annual savings", "The tonnes abated a year", "The capital"]'::jsonb and answer_index = 3 and explanation is not distinct from 'In the course, the cost per tonne is carbonAbatement.abatementCost called with the implementation cost as capital, the annual value as the saving and the annual tonnes as the abatement. The annual cost is not one of the three arguments the course names.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-savings-into-the-ledger' and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m05-savings-into-the-ledger ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m05-savings-into-the-ledger ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'priceSaving hands the invented saving to abatementCost. Which argument does the implementation cost of 210000 USD fill?', options = '["The annual cost", "The annual savings", "The tonnes abated a year", "The capital"]'::jsonb, explanation = 'In the course, the cost per tonne is carbonAbatement.abatementCost called with the implementation cost as capital, the annual value as the saving and the annual tonnes as the abatement. The annual cost is not one of the three arguments the course names.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-savings-into-the-ledger' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m05-savings-into-the-ledger ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-savings-into-the-ledger ord 7
  select case
           when prompt = 'The same invented saving is sent to abatementCost directly, over 8 years at a rate of 0.1. Which net annual cost does it print?' and options = '["netAnnualCost -49136.76 USD", "netAnnualCost 39363.24 USD", "netAnnualCost 88500.00 USD", "netAnnualCost -127251.65 USD, on the curve''s first step"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 23, the same call made directly: capitalRecoveryFactor 0.18744402, annualisedCapital 39363.24 USD, netAnnualCost -49136.76 USD, costPerTonne -74.2270 USD, paysForItself true. -127251.65 USD is Tune the fired heaters'' net annual cost in SECTION 18.' then 'old'
           when prompt = 'The same invented saving is sent to abatementCost directly, over 8 years at a rate of 0.1. Which net annual cost does it print?' and options = '["netAnnualCost -49136.76 USD", "netAnnualCost 39363.24 USD", "netAnnualCost 88500.00 USD", "netAnnualCost -127251.65 USD, on the curve''s first step"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The same call made directly: capitalRecoveryFactor 0.18744402, annualisedCapital 39363.24 USD, netAnnualCost -49136.76 USD, costPerTonne -74.2270 USD, paysForItself true. -127251.65 USD is Tune the fired heaters'' net annual cost in the cost table.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-savings-into-the-ledger' and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m05-savings-into-the-ledger ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m05-savings-into-the-ledger ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The same invented saving is sent to abatementCost directly, over 8 years at a rate of 0.1. Which net annual cost does it print?', options = '["netAnnualCost -49136.76 USD", "netAnnualCost 39363.24 USD", "netAnnualCost 88500.00 USD", "netAnnualCost -127251.65 USD, on the curve''s first step"]'::jsonb, explanation = 'The same call made directly: capitalRecoveryFactor 0.18744402, annualisedCapital 39363.24 USD, netAnnualCost -49136.76 USD, costPerTonne -74.2270 USD, paysForItself true. -127251.65 USD is Tune the fired heaters'' net annual cost in the cost table.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-savings-into-the-ledger' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m05-savings-into-the-ledger ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-savings-into-the-ledger ord 8
  select case
           when prompt = 'Setting the whole implementation cost against one year''s value and one year''s tonnes gives which figure, and what is its status?' and options = '["183.5403 USD a tonne, the engine''s costPerTonneCo2e output", "-74.2270 USD a tonne, which SECTION 23 labels (computed here)", "183.5403 USD a tonne, which SECTION 23 labels (computed here)", "2.372881 years, the engine''s simplePaybackYears for the saving"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 23: "Setting the whole implementation cost against one year''s value and one year''s tonnes (computed here) gives 183.5403 USD a tonne." The engine''s costPerTonneCo2e is -74.2270 USD, from abatementCost over 8 years at 0.1, and 2.372881 years is simplePaybackYears.' then 'old'
           when prompt = 'Setting the whole implementation cost against one year''s value and one year''s tonnes gives which figure, and what is its status?' and options = '["183.5403 USD a tonne, the engine''s costPerTonneCo2e output", "-74.2270 USD a tonne, which the course labels (computed here)", "183.5403 USD a tonne, which the course labels (computed here)", "2.372881 years, the engine''s simplePaybackYears for the saving"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course states: "Setting the whole implementation cost against one year''s value and one year''s tonnes (computed here) gives 183.5403 USD a tonne." The engine''s costPerTonneCo2e is -74.2270 USD, from abatementCost over 8 years at 0.1, and 2.372881 years is simplePaybackYears.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-savings-into-the-ledger' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m05-savings-into-the-ledger ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m05-savings-into-the-ledger ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Setting the whole implementation cost against one year''s value and one year''s tonnes gives which figure, and what is its status?', options = '["183.5403 USD a tonne, the engine''s costPerTonneCo2e output", "-74.2270 USD a tonne, which the course labels (computed here)", "183.5403 USD a tonne, which the course labels (computed here)", "2.372881 years, the engine''s simplePaybackYears for the saving"]'::jsonb, explanation = 'The course states: "Setting the whole implementation cost against one year''s value and one year''s tonnes (computed here) gives 183.5403 USD a tonne." The engine''s costPerTonneCo2e is -74.2270 USD, from abatementCost over 8 years at 0.1, and 2.372881 years is simplePaybackYears.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-savings-into-the-ledger' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m05-savings-into-the-ledger ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-savings-into-the-ledger ord 9
  select case
           when prompt = 'SECTION 26 names what no oracle recomputes. Which of these is on that list?' and options = '["The levelised cost per tonne of the saving, -74.2270 USD", "The excess air, which the oracle solves by bisection", "The steam trap flow, taken as an isentropic nozzle", "The simple payback, 2.372881 years"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 26 puts the simple payback on its not-recomputed list. The energyEfficiency oracle does compute a levelised cost per tonne, excess air by bisection and the trap as an isentropic nozzle.' then 'old'
           when prompt = 'The course names what no oracle recomputes. Which of these is on that list?' and options = '["The levelised cost per tonne of the saving, -74.2270 USD", "The excess air, which the oracle solves by bisection", "The steam trap flow, taken as an isentropic nozzle", "The simple payback, 2.372881 years"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course puts the simple payback on its not-recomputed list. The energyEfficiency oracle does compute a levelised cost per tonne, excess air by bisection and the trap as an isentropic nozzle.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-savings-into-the-ledger' and ord = 9;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m05-savings-into-the-ledger ord 9'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m05-savings-into-the-ledger ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course names what no oracle recomputes. Which of these is on that list?', options = '["The levelised cost per tonne of the saving, -74.2270 USD", "The excess air, which the oracle solves by bisection", "The steam trap flow, taken as an isentropic nozzle", "The simple payback, 2.372881 years"]'::jsonb, explanation = 'The course puts the simple payback on its not-recomputed list. The energyEfficiency oracle does compute a levelised cost per tonne, excess air by bisection and the trap as an isentropic nozzle.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-savings-into-the-ledger' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m05-savings-into-the-ledger ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-savings-into-the-ledger ord 10
  select case
           when prompt = 'With Purchased power blank, what does energyIntensity return beside an intensity of 629.8387 MJ a tonne?' and options = '["complete false, with versus peer none and gap none", "complete false, versus peer 1.040085 and gap 27.2581", "A refusal: every stream is needed", "complete true, with 781000.000 GJ read as the whole plant"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 24, purchased power blank: complete false, total 781000.000 GJ, intensity 629.8387 MJ per tonne, versus peer none, gap none. 1.040085 and 27.2581 belong to the row with all three streams, and the only energyIntensity refusal printed is a throughput required.' then 'old'
           when prompt = 'With Purchased power blank, what does energyIntensity return beside an intensity of 629.8387 MJ a tonne?' and options = '["complete false, with versus peer none and gap none", "complete false, versus peer 1.040085 and gap 27.2581", "A refusal: every stream is needed", "complete true, with 781000.000 GJ read as the whole plant"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The intensity with purchased power blank: complete false, total 781000.000 GJ, intensity 629.8387 MJ per tonne, versus peer none, gap none. 1.040085 and 27.2581 belong to the row with all three streams, and the only energyIntensity refusal printed is a throughput required.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-savings-into-the-ledger' and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m05-savings-into-the-ledger ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m05-savings-into-the-ledger ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'With Purchased power blank, what does energyIntensity return beside an intensity of 629.8387 MJ a tonne?', options = '["complete false, with versus peer none and gap none", "complete false, versus peer 1.040085 and gap 27.2581", "A refusal: every stream is needed", "complete true, with 781000.000 GJ read as the whole plant"]'::jsonb, explanation = 'The intensity with purchased power blank: complete false, total 781000.000 GJ, intensity 629.8387 MJ per tonne, versus peer none, gap none. 1.040085 and 27.2581 belong to the row with all three streams, and the only energyIntensity refusal printed is a throughput required.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-savings-into-the-ledger' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m05-savings-into-the-ledger ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-savings-into-the-ledger ord 11
  select case
           when prompt = 'What does the peerNote say an intensity with a stream missing is?' and options = '["A ceiling, which would penalise the plant", "A floor, which would flatter the plant", "An upper bound on the streams", "Not reportable, as a line could not be computed"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 24, peerNote with a stream missing, verbatim: "Not compared with the peer: a stream is missing, so the intensity is a floor and would flatter the plant." SECTION 25 lists the rule: an intensity with a stream missing is not compared with the peer.' then 'old'
           when prompt = 'What does the peerNote say an intensity with a stream missing is?' and options = '["A ceiling, which would penalise the plant", "A floor, which would flatter the plant", "An upper bound on the streams", "Not reportable, as a line could not be computed"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The peerNote with a stream missing, verbatim: "Not compared with the peer: a stream is missing, so the intensity is a floor and would flatter the plant." The course lists the rule: an intensity with a stream missing is not compared with the peer.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-savings-into-the-ledger' and ord = 11;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m05-savings-into-the-ledger ord 11'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m05-savings-into-the-ledger ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does the peerNote say an intensity with a stream missing is?', options = '["A ceiling, which would penalise the plant", "A floor, which would flatter the plant", "An upper bound on the streams", "Not reportable, as a line could not be computed"]'::jsonb, explanation = 'The peerNote with a stream missing, verbatim: "Not compared with the peer: a stream is missing, so the intensity is a floor and would flatter the plant." The course lists the rule: an intensity with a stream missing is not compared with the peer.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-savings-into-the-ledger' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m05-savings-into-the-ledger ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-savings-into-the-ledger ord 12
  select case
           when prompt = 'Agbor''s invented intensity is 707.2581 MJ a tonne against an invented peer of 680 MJ a tonne. What are versus peer and the gap?' and options = '["0.843786, and a gap of 27.2581 MJ a tonne", "1.040085, and a gap of 629.8387 MJ a tonne", "1.040085, and a gap of 27.2581 MJ a tonne", "27.2581, and a gap of 1.040085 MJ a tonne"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 24: versus peer is the intensity over the peer, 1.040085; the gap is the intensity less the peer, 27.2581 MJ a tonne (each computed here and equal to the engine''s figure). 0.843786 is the Fuel gas share and 629.8387 MJ a tonne the intensity with Purchased power blank.' then 'old'
           when prompt = 'Agbor''s invented intensity is 707.2581 MJ a tonne against an invented peer of 680 MJ a tonne. What are versus peer and the gap?' and options = '["0.843786, and a gap of 27.2581 MJ a tonne", "1.040085, and a gap of 629.8387 MJ a tonne", "1.040085, and a gap of 27.2581 MJ a tonne", "27.2581, and a gap of 1.040085 MJ a tonne"]'::jsonb and answer_index = 2 and explanation is not distinct from 'In the course, versus peer is the intensity over the peer, 1.040085; the gap is the intensity less the peer, 27.2581 MJ a tonne (each computed here and equal to the engine''s figure). 0.843786 is the Fuel gas share and 629.8387 MJ a tonne the intensity with Purchased power blank.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-savings-into-the-ledger' and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m05-savings-into-the-ledger ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m05-savings-into-the-ledger ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Agbor''s invented intensity is 707.2581 MJ a tonne against an invented peer of 680 MJ a tonne. What are versus peer and the gap?', options = '["0.843786, and a gap of 27.2581 MJ a tonne", "1.040085, and a gap of 629.8387 MJ a tonne", "1.040085, and a gap of 27.2581 MJ a tonne", "27.2581, and a gap of 1.040085 MJ a tonne"]'::jsonb, explanation = 'In the course, versus peer is the intensity over the peer, 1.040085; the gap is the intensity less the peer, 27.2581 MJ a tonne (each computed here and equal to the engine''s figure). 0.843786 is the Fuel gas share and 629.8387 MJ a tonne the intensity with Purchased power blank.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-savings-into-the-ledger' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m05-savings-into-the-ledger ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-savings-into-the-ledger ord 13
  select case
           when prompt = 'What does the energyIntensity disclaimer say the Agbor figure is?' and options = '["The plant''s own energy per tonne of throughput", "The Solomon Energy Intensity Index for the plant", "The plant''s energy on a standard-energy basis", "A published peer benchmark supplied by the engine"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 24, the disclaimer: "This is the plant''s own energy per tonne of throughput. It is NOT the Solomon Energy Intensity Index, which is a proprietary benchmark with its own standard-energy methodology. Any peer figure compared here is one you supplied and have the right to use."' then 'old'
           when prompt = 'What does the energyIntensity disclaimer say the Agbor figure is?' and options = '["The plant''s own energy per tonne of throughput", "The Solomon Energy Intensity Index for the plant", "The plant''s energy on a standard-energy basis", "A published peer benchmark supplied by the engine"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The course''s disclaimer: "This is the plant''s own energy per tonne of throughput. It is NOT the Solomon Energy Intensity Index, which is a proprietary benchmark with its own standard-energy methodology. Any peer figure compared here is one you supplied and have the right to use."' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-savings-into-the-ledger' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m05-savings-into-the-ledger ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m05-savings-into-the-ledger ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does the energyIntensity disclaimer say the Agbor figure is?', options = '["The plant''s own energy per tonne of throughput", "The Solomon Energy Intensity Index for the plant", "The plant''s energy on a standard-energy basis", "A published peer benchmark supplied by the engine"]'::jsonb, explanation = 'The course''s disclaimer: "This is the plant''s own energy per tonne of throughput. It is NOT the Solomon Energy Intensity Index, which is a proprietary benchmark with its own standard-energy methodology. Any peer figure compared here is one you supplied and have the right to use."'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-savings-into-the-ledger' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m05-savings-into-the-ledger ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-savings-into-the-ledger ord 14
  select case
           when prompt = 'Which priceSaving call on the invented saving is refused outright?' and options = '["No emission factor supplied", "No heating value basis declared", "No life and no rate given", "The saving left blank"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 23: REFUSED: An energy saving is required. No factor returns annualTonnesCo2e none with a carbonNote, no basis returns a basisNote, and no life and no rate returns costPerTonneCo2e none with a costPerTonneNote.' then 'old'
           when prompt = 'Which priceSaving call on the invented saving is refused outright?' and options = '["No emission factor supplied", "No heating value basis declared", "No life and no rate given", "The saving left blank"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The engine returns REFUSED: An energy saving is required. No factor returns annualTonnesCo2e none with a carbonNote, no basis returns a basisNote, and no life and no rate returns costPerTonneCo2e none with a costPerTonneNote.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-savings-into-the-ledger' and ord = 14;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m05-savings-into-the-ledger ord 14'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m05-savings-into-the-ledger ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which priceSaving call on the invented saving is refused outright?', options = '["No emission factor supplied", "No heating value basis declared", "No life and no rate given", "The saving left blank"]'::jsonb, explanation = 'The engine returns REFUSED: An energy saving is required. No factor returns annualTonnesCo2e none with a carbonNote, no basis returns a basisNote, and no life and no rate returns costPerTonneCo2e none with a costPerTonneNote.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-savings-into-the-ledger' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m05-savings-into-the-ledger ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m05-savings-into-the-ledger ord 15
  select case
           when prompt = 'Of Agbor''s three invented energy streams, which one carries the share 0.109464?' and options = '["Imported steam, 41000.000 GJ", "Fuel gas, 740000.000 GJ", "Purchased power, 96000.000 GJ", "Purchased power, 41000.000 GJ"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 24 prints Purchased power at 96000.000 GJ and a share of 0.109464, Fuel gas at 740000.000 GJ and 0.843786, and Imported steam at 41000.000 GJ and 0.046750, of 877000.000 GJ.' then 'old'
           when prompt = 'Of Agbor''s three invented energy streams, which one carries the share 0.109464?' and options = '["Imported steam, 41000.000 GJ", "Fuel gas, 740000.000 GJ", "Purchased power, 96000.000 GJ", "Purchased power, 41000.000 GJ"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course prints Purchased power at 96000.000 GJ and a share of 0.109464, Fuel gas at 740000.000 GJ and 0.843786, and Imported steam at 41000.000 GJ and 0.046750, of 877000.000 GJ.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-savings-into-the-ledger' and ord = 15;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m05-savings-into-the-ledger ord 15'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m05-savings-into-the-ledger ord 15 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Of Agbor''s three invented energy streams, which one carries the share 0.109464?', options = '["Imported steam, 41000.000 GJ", "Fuel gas, 740000.000 GJ", "Purchased power, 96000.000 GJ", "Purchased power, 41000.000 GJ"]'::jsonb, explanation = 'The course prints Purchased power at 96000.000 GJ and a share of 0.109464, Fuel gas at 740000.000 GJ and 0.843786, and Imported steam at 41000.000 GJ and 0.046750, of 877000.000 GJ.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm05-savings-into-the-ledger' and ord = 15;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m05-savings-into-the-ledger ord 15 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-expert-reading ord 1
  select case
           when prompt = 'Which of these does SECTION 25 hold as a stated limit under H1?' and options = '["Which IPCC report a Nigerian operator files on is the owner''s decision.", "The engine ships the AR6 set as its default when no GWP is supplied.", "The course''s set is the one a Nigerian operator is to file its inventory on.", "The AR5 values are retired from the digest and no longer printed beside it."]'::jsonb and answer_index = 0 and explanation is not distinct from 'H1 is held: the report is a regulatory reading left to the owner. No GWP ships with the engine, and both reports are printed side by side for the course.' then 'old'
           when prompt = 'Which of these does the course hold as a stated limit under H1?' and options = '["Which IPCC report a Nigerian operator files on is the owner''s decision.", "The engine ships the AR6 set as its default when no GWP is supplied.", "The course''s set is the one a Nigerian operator is to file its inventory on.", "The AR5 values are retired from the course and no longer printed beside it."]'::jsonb and answer_index = 0 and explanation is not distinct from 'H1 is held: the report is a regulatory reading left to the owner. No GWP ships with the engine, and both reports are printed side by side for the course.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 1;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m06-the-expert-reading ord 1'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m06-the-expert-reading ord 1 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which of these does the course hold as a stated limit under H1?', options = '["Which IPCC report a Nigerian operator files on is the owner''s decision.", "The engine ships the AR6 set as its default when no GWP is supplied.", "The course''s set is the one a Nigerian operator is to file its inventory on.", "The AR5 values are retired from the course and no longer printed beside it."]'::jsonb, explanation = 'H1 is held: the report is a regulatory reading left to the owner. No GWP ships with the engine, and both reports are printed side by side for the course.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 1;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m06-the-expert-reading ord 1 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-expert-reading ord 2
  select case
           when prompt = 'SECTION 26 names two oracles in the engines repository. Where are their goldens asserted?' and options = '["By the course''s capstone grader", "By the digest''s computed-here lines", "By the engine test suites", "By the Carbon Studio each time it runs"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 26: two independent oracles in tools/validation/downstream recompute these modules by other routes, and their goldens are asserted by the engine test suites.' then 'old'
           when prompt = 'The course names two oracles in the engines repository. Where are their goldens asserted?' and options = '["By the course''s capstone grader", "By the course''s computed-here lines", "By the engine test suites", "By the Carbon Studio each time it runs"]'::jsonb and answer_index = 2 and explanation is not distinct from 'In the course, two independent oracles in tools/validation/downstream recompute these modules by other routes, and their goldens are asserted by the engine test suites.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 2;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m06-the-expert-reading ord 2'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m06-the-expert-reading ord 2 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course names two oracles in the engines repository. Where are their goldens asserted?', options = '["By the course''s capstone grader", "By the course''s computed-here lines", "By the engine test suites", "By the Carbon Studio each time it runs"]'::jsonb, explanation = 'In the course, two independent oracles in tools/validation/downstream recompute these modules by other routes, and their goldens are asserted by the engine test suites.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 2;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m06-the-expert-reading ord 2 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-expert-reading ord 3
  select case
           when prompt = 'What does held item H3 state?' and options = '["Every escaped carbon atom is counted as CO2 at combustion.", "Every escaped carbon atom is counted as methane.", "Escaped carbon is left out of the inventory.", "Escaped carbon is split by the fuel analysis."]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 25, H3: every escaped carbon atom is counted as methane (SECTION 5). It is a held item, taught as a stated limit and never graded.' then 'old'
           when prompt = 'What does held item H3 state?' and options = '["Every escaped carbon atom is counted as CO2 at combustion.", "Every escaped carbon atom is counted as methane.", "Escaped carbon is left out of the inventory.", "Escaped carbon is split by the fuel analysis."]'::jsonb and answer_index = 1 and explanation is not distinct from 'Held item H3: every escaped carbon atom is counted as methane (the inventory lesson). It is a held item, taught as a stated limit and never graded.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 3;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m06-the-expert-reading ord 3'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m06-the-expert-reading ord 3 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What does held item H3 state?', options = '["Every escaped carbon atom is counted as CO2 at combustion.", "Every escaped carbon atom is counted as methane.", "Escaped carbon is left out of the inventory.", "Escaped carbon is split by the fuel analysis."]'::jsonb, explanation = 'Held item H3: every escaped carbon atom is counted as methane (the inventory lesson). It is a held item, taught as a stated limit and never graded.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 3;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m06-the-expert-reading ord 3 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-expert-reading ord 4
  select case
           when prompt = 'SECTION 25 lists each rule in force with the section that prints it. Which rule does it place in SECTION 21?' and options = '["A refused measure is named in refusedMeasures and kept off the curve and its totals", "A year whose scheduled measures abate more than the baseline is refused by the path", "A saving, its price and its factor declared on different bases are refused outright", "A curve with a claim above what its source emits returns meetsTarget none and says why"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 25 places the over-claim rule, and the rule that a verdict is none while a claim acts on a source with no computed emission passed, in SECTION 21. The refusedMeasures rule prints in SECTION 19, the over-abatement refusal in SECTION 22 and the basis refusal in SECTION 23.' then 'old'
           when prompt = 'The course lists each rule in force with the table that prints it. Which rule does it place in the target checks?' and options = '["A refused measure is named in refusedMeasures and kept off the curve and its totals", "A year whose scheduled measures abate more than the baseline is refused by the path", "A saving, its price and its factor declared on different bases are refused outright", "A curve with a claim above what its source emits returns meetsTarget none and says why"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The course places the over-claim rule, and the rule that a verdict is none while a claim acts on a source with no computed emission passed, in the target checks. The refusedMeasures rule prints in the refusal examples, the over-abatement refusal on the path and the basis refusal in the saving example.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 4;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m06-the-expert-reading ord 4'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m06-the-expert-reading ord 4 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The course lists each rule in force with the table that prints it. Which rule does it place in the target checks?', options = '["A refused measure is named in refusedMeasures and kept off the curve and its totals", "A year whose scheduled measures abate more than the baseline is refused by the path", "A saving, its price and its factor declared on different bases are refused outright", "A curve with a claim above what its source emits returns meetsTarget none and says why"]'::jsonb, explanation = 'The course places the over-claim rule, and the rule that a verdict is none while a claim acts on a source with no computed emission passed, in the target checks. The refusedMeasures rule prints in the refusal examples, the over-abatement refusal on the path and the basis refusal in the saving example.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 4;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m06-the-expert-reading ord 4 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-expert-reading ord 5
  select case
           when prompt = 'The curve prints additive false for the two heater measures. How does the path count them once they are live?' and options = '["Only the larger one", "Neither, until sequenced", "Each in full, from its own start year", "Each at its tonnes less the other''s claim"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 22: each measure counts in full from its start year. Tune the fired heaters counts from 2027 and the Heat integration project from 2029, and by 2031 the abated column reads 15460.000 t, the curve''s total.' then 'old'
           when prompt = 'The curve prints additive false for the two heater measures. How does the path count them once they are live?' and options = '["Only the larger one", "Neither, until sequenced", "Each in full, from its own start year", "Each at its tonnes less the other''s claim"]'::jsonb and answer_index = 2 and explanation is not distinct from 'On the path, each measure counts in full from its start year. Tune the fired heaters counts from 2027 and the Heat integration project from 2029, and by 2031 the abated column reads 15460.000 t, the curve''s total.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 5;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m06-the-expert-reading ord 5'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m06-the-expert-reading ord 5 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The curve prints additive false for the two heater measures. How does the path count them once they are live?', options = '["Only the larger one", "Neither, until sequenced", "Each in full, from its own start year", "Each at its tonnes less the other''s claim"]'::jsonb, explanation = 'On the path, each measure counts in full from its start year. Tune the fired heaters counts from 2027 and the Heat integration project from 2029, and by 2031 the abated column reads 15460.000 t, the curve''s total.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 5;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m06-the-expert-reading ord 5 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-expert-reading ord 6
  select case
           when prompt = 'By which route does oracle_carbonabatement.py recompute a measure''s cost per tonne?' and options = '["Levelised from a year-by-year present value ledger", "By the capital recovery factor the engine itself uses", "By explicit rank, the route it takes for the curve", "As a species ledger whose mass balance must close"]'::jsonb and answer_index = 0 and explanation is not distinct from 'SECTION 26: the cost per tonne LEVELISED from a year-by-year present value ledger where the engine uses a capital recovery factor; the curve by explicit rank. The species ledger is oracle_energyefficiency.py''s combustion route.' then 'old'
           when prompt = 'By which route does oracle_carbonabatement.py recompute a measure''s cost per tonne?' and options = '["Levelised from a year-by-year present value ledger", "By the capital recovery factor the engine itself uses", "By explicit rank, the route it takes for the curve", "As a species ledger whose mass balance must close"]'::jsonb and answer_index = 0 and explanation is not distinct from 'The oracle''s route: the cost per tonne LEVELISED from a year-by-year present value ledger where the engine uses a capital recovery factor; the curve by explicit rank. The species ledger is oracle_energyefficiency.py''s combustion route.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 6;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m06-the-expert-reading ord 6'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m06-the-expert-reading ord 6 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'By which route does oracle_carbonabatement.py recompute a measure''s cost per tonne?', options = '["Levelised from a year-by-year present value ledger", "By the capital recovery factor the engine itself uses", "By explicit rank, the route it takes for the curve", "As a species ledger whose mass balance must close"]'::jsonb, explanation = 'The oracle''s route: the cost per tonne LEVELISED from a year-by-year present value ledger where the engine uses a capital recovery factor; the curve by explicit rank. The species ledger is oracle_energyefficiency.py''s combustion route.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 6;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m06-the-expert-reading ord 6 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-expert-reading ord 7
  select case
           when prompt = 'Solar for purchased power is order 5 on the Agbor curve. In which year does it go live on the path?' and options = '["2030, a year after the Heat integration project", "2027, with Tune the fired heaters and the steam traps", "2031, the last start year among the six measures", "2028, a year before the Heat integration project"]'::jsonb and answer_index = 3 and explanation is not distinct from 'Start years are inputs. SECTION 22 gives Solar for purchased power 2028 and the Heat integration project, order 3 on the curve of SECTION 20, 2029; the path goes by those years.' then 'old'
           when prompt = 'Solar for purchased power is order 5 on the Agbor curve. In which year does it go live on the path?' and options = '["2030, a year after the Heat integration project", "2027, with Tune the fired heaters and the steam traps", "2031, the last start year among the six measures", "2028, a year before the Heat integration project"]'::jsonb and answer_index = 3 and explanation is not distinct from 'Start years are inputs. The path gives Solar for purchased power 2028 and the Heat integration project, order 3 on the curve, 2029; the path goes by those years.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 7;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m06-the-expert-reading ord 7'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m06-the-expert-reading ord 7 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Solar for purchased power is order 5 on the Agbor curve. In which year does it go live on the path?', options = '["2030, a year after the Heat integration project", "2027, with Tune the fired heaters and the steam traps", "2031, the last start year among the six measures", "2028, a year before the Heat integration project"]'::jsonb, explanation = 'Start years are inputs. The path gives Solar for purchased power 2028 and the Heat integration project, order 3 on the curve, 2029; the path goes by those years.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 7;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m06-the-expert-reading ord 7 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-expert-reading ord 8
  select case
           when prompt = 'How does oracle_energyefficiency.py model the steam trap?' and options = '["By the choked and subsonic flux formulas that the engine itself uses for the trap", "As an isentropic nozzle, its throat at the larger of the downstream and critical pressures", "As a duty ledger, the route the oracle takes for the tuning saving", "By bisection on the downstream pressure, the route it takes for excess air"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 26: the steam trap as an ISENTROPIC NOZZLE with its throat at the larger of the downstream and critical pressures, where the engine uses the choked and subsonic flux formulas. The duty ledger is the tuning saving''s route and bisection is the excess air route.' then 'old'
           when prompt = 'How does oracle_energyefficiency.py model the steam trap?' and options = '["By the choked and subsonic flux formulas that the engine itself uses for the trap", "As an isentropic nozzle, its throat at the larger of the downstream and critical pressures", "As a duty ledger, the route the oracle takes for the tuning saving", "By bisection on the downstream pressure, the route it takes for excess air"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The oracle''s route: the steam trap as an ISENTROPIC NOZZLE with its throat at the larger of the downstream and critical pressures, where the engine uses the choked and subsonic flux formulas. The duty ledger is the tuning saving''s route and bisection is the excess air route.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 8;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m06-the-expert-reading ord 8'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m06-the-expert-reading ord 8 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'How does oracle_energyefficiency.py model the steam trap?', options = '["By the choked and subsonic flux formulas that the engine itself uses for the trap", "As an isentropic nozzle, its throat at the larger of the downstream and critical pressures", "As a duty ledger, the route the oracle takes for the tuning saving", "By bisection on the downstream pressure, the route it takes for excess air"]'::jsonb, explanation = 'The oracle''s route: the steam trap as an ISENTROPIC NOZZLE with its throat at the larger of the downstream and critical pressures, where the engine uses the choked and subsonic flux formulas. The duty ledger is the tuning saving''s route and bisection is the excess air route.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 8;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m06-the-expert-reading ord 8 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-expert-reading ord 9
  select case
           when prompt = 'What are H1 to H4 in this course?' and options = '["Rules in force, each shown with a figure", "Figures to compute with at the owner''s rates", "Limits, taught as stated and never graded", "Rules in force, each with its section"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 25: HELD, taught as stated limits and never graded. The rules in force are printed in tables of their own, each as the engine answers now with the section that prints it, and H1 to H4 are not among them.' then 'old'
           when prompt = 'What are H1 to H4 in this course?' and options = '["Rules in force, each shown with a figure", "Figures to compute with at the owner''s rates", "Limits, taught as stated and never graded", "Rules in force, each with its section"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The course marks them HELD, taught as stated limits and never graded. The rules in force are printed in tables of their own, each as the engine answers now with the section that prints it, and H1 to H4 are not among them.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 9;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m06-the-expert-reading ord 9'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m06-the-expert-reading ord 9 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'What are H1 to H4 in this course?', options = '["Rules in force, each shown with a figure", "Figures to compute with at the owner''s rates", "Limits, taught as stated and never graded", "Rules in force, each with its section"]'::jsonb, explanation = 'The course marks them HELD, taught as stated limits and never graded. The rules in force are printed in tables of their own, each as the engine answers now with the section that prints it, and H1 to H4 are not among them.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 9;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m06-the-expert-reading ord 9 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-expert-reading ord 10
  select case
           when prompt = 'Which figure is both the Agbor curve''s totalAbatementTonnes and the path''s abated tonnes in 2031?' and options = '["13610.000 t", "15460.000 t", "12060.000 t", "7410.000 t"]'::jsonb and answer_index = 1 and explanation is not distinct from 'SECTION 20 prints totalAbatementTonnes 15460.000, and SECTION 22''s 2031 row prints 15460.000 t abated with all six measures live. 13610.000 t is the 2030 row, 12060.000 t the curve with one measure refused, and 7410.000 t the 2029 row.' then 'old'
           when prompt = 'Which figure is both the Agbor curve''s totalAbatementTonnes and the path''s abated tonnes in 2031?' and options = '["13610.000 t", "15460.000 t", "12060.000 t", "7410.000 t"]'::jsonb and answer_index = 1 and explanation is not distinct from 'The curve prints totalAbatementTonnes 15460.000, and the path''s 2031 row prints 15460.000 t abated with all six measures live. 13610.000 t is the 2030 row, 12060.000 t the curve with one measure refused, and 7410.000 t the 2029 row.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 10;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m06-the-expert-reading ord 10'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m06-the-expert-reading ord 10 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Which figure is both the Agbor curve''s totalAbatementTonnes and the path''s abated tonnes in 2031?', options = '["13610.000 t", "15460.000 t", "12060.000 t", "7410.000 t"]'::jsonb, explanation = 'The curve prints totalAbatementTonnes 15460.000, and the path''s 2031 row prints 15460.000 t abated with all six measures live. 13610.000 t is the 2030 row, 12060.000 t the curve with one measure refused, and 7410.000 t the 2029 row.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 10;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m06-the-expert-reading ord 10 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-expert-reading ord 11
  select case
           when prompt = 'Two outputs of the Agbor curve are on SECTION 26''s list of what neither oracle recomputes. Which two?' and options = '["The rank order and the costs per tonne it ranks", "The residual to target and paysForItselfTonnes", "The residual to target and the path''s year ledger", "The weighted average and the explicit rank order"]'::jsonb and answer_index = 1 and explanation is not distinct from 'Both curve outputs sit on SECTION 26''s closing list beside carbonIntensity, compositeCurve and the simple payback: taught from the engine and never graded. Rank order has an oracle route of its own.' then 'old'
           when prompt = 'Two outputs of the Agbor curve are on the course''s list of what neither oracle recomputes. Which two?' and options = '["The rank order and the costs per tonne it ranks", "The residual to target and paysForItselfTonnes", "The residual to target and the path''s year ledger", "The weighted average and the explicit rank order"]'::jsonb and answer_index = 1 and explanation is not distinct from 'Both curve outputs sit on the course''s closing list beside carbonIntensity, compositeCurve and the simple payback: taught from the engine and never graded. Rank order has an oracle route of its own.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 11;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m06-the-expert-reading ord 11'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m06-the-expert-reading ord 11 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'Two outputs of the Agbor curve are on the course''s list of what neither oracle recomputes. Which two?', options = '["The rank order and the costs per tonne it ranks", "The residual to target and paysForItselfTonnes", "The residual to target and the path''s year ledger", "The weighted average and the explicit rank order"]'::jsonb, explanation = 'Both curve outputs sit on the course''s closing list beside carbonIntensity, compositeCurve and the simple payback: taught from the engine and never graded. Rank order has an oracle route of its own.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 11;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m06-the-expert-reading ord 11 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-expert-reading ord 12
  select case
           when prompt = 'How does oracle_carbonabatement.py compute combustion?' and options = '["As a ledger, the route it takes for the inventory", "As a species ledger whose mass balance closes", "By bisection on the stack oxygen reading", "By mass, in exact rationals"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 26: combustion by MASS in exact rationals (kg of carbon times the CO2/C and CH4/C mass ratios, molar masses built from atomic weights). The ledger is its route for the inventory, the species ledger is oracle_energyefficiency.py''s combustion route, and bisection is that oracle''s route for excess air.' then 'old'
           when prompt = 'How does oracle_carbonabatement.py compute combustion?' and options = '["As a ledger, the route it takes for the inventory", "As a species ledger whose mass balance closes", "By bisection on the stack oxygen reading", "By mass, in exact rationals"]'::jsonb and answer_index = 3 and explanation is not distinct from 'The oracle''s route: combustion by MASS in exact rationals (kg of carbon times the CO2/C and CH4/C mass ratios, molar masses built from atomic weights). The ledger is its route for the inventory, the species ledger is oracle_energyefficiency.py''s combustion route, and bisection is that oracle''s route for excess air.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 12;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m06-the-expert-reading ord 12'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m06-the-expert-reading ord 12 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'How does oracle_carbonabatement.py compute combustion?', options = '["As a ledger, the route it takes for the inventory", "As a species ledger whose mass balance closes", "By bisection on the stack oxygen reading", "By mass, in exact rationals"]'::jsonb, explanation = 'The oracle''s route: combustion by MASS in exact rationals (kg of carbon times the CO2/C and CH4/C mass ratios, molar masses built from atomic weights). The ledger is its route for the inventory, the species ledger is oracle_energyefficiency.py''s combustion route, and bisection is that oracle''s route for excess air.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 12;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m06-the-expert-reading ord 12 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-expert-reading ord 13
  select case
           when prompt = 'The engine finds the pinch from a cascade. Which route does the efficiency oracle take to it?' and options = '["By the problem table cascade the engine uses", "As a loss ledger, the route for efficiency", "By the largest heat deficit, with no cascade", "By bisection, the route it takes for excess air"]'::jsonb and answer_index = 2 and explanation is not distinct from 'SECTION 26: the pinch by the LARGEST HEAT DEFICIT with no cascade. The loss ledger is the efficiency route and bisection the excess air route; SECTION 25 lists the engine''s rule that only an interior zero of the cascade is a pinch.' then 'old'
           when prompt = 'The engine finds the pinch from a cascade. Which route does the efficiency oracle take to it?' and options = '["By the problem table cascade the engine uses", "As a loss ledger, the route for efficiency", "By the largest heat deficit, with no cascade", "By bisection, the route it takes for excess air"]'::jsonb and answer_index = 2 and explanation is not distinct from 'The oracle''s route: the pinch by the LARGEST HEAT DEFICIT with no cascade. The loss ledger is the efficiency route and bisection the excess air route; the course lists the engine''s rule that only an interior zero of the cascade is a pinch.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 13;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m06-the-expert-reading ord 13'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m06-the-expert-reading ord 13 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The engine finds the pinch from a cascade. Which route does the efficiency oracle take to it?', options = '["By the problem table cascade the engine uses", "As a loss ledger, the route for efficiency", "By the largest heat deficit, with no cascade", "By bisection, the route it takes for excess air"]'::jsonb, explanation = 'The oracle''s route: the pinch by the LARGEST HEAT DEFICIT with no cascade. The loss ledger is the efficiency route and bisection the excess air route; the course lists the engine''s rule that only an interior zero of the cascade is a pinch.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 13;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m06-the-expert-reading ord 13 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  -- advanced m06-the-expert-reading ord 14
  select case
           when prompt = 'SECTION 22 prints the full Agbor baseline less the partial one as 10988.000 tCO2e. What does it say that figure is?' and options = '["The heaters'' emission passed to the curve", "The vented and fugitive methane line", "The gap between the two end-year targets", "The purchased electricity line of SECTION 21"]'::jsonb and answer_index = 3 and explanation is not distinct from 'SECTION 22: the full baseline less the partial is 10988.000 tCO2e (computed here), the purchased electricity line of SECTION 21: the partial inventory is the full one without it. The heaters are passed as 34927.743 tCO2e and the vented line is 2622.400 tCO2e.' then 'old'
           when prompt = 'The path prints the full Agbor baseline less the partial one as 10988.000 tCO2e. What does it say that figure is?' and options = '["The heaters'' emission passed to the curve", "The vented and fugitive methane line", "The gap between the two end-year targets", "The inventory''s purchased electricity line"]'::jsonb and answer_index = 3 and explanation is not distinct from 'On the path, the full baseline less the partial is 10988.000 tCO2e (computed here), the inventory''s purchased electricity line: the partial inventory is the full one without it. The heaters are passed as 34927.743 tCO2e and the vented line is 2622.400 tCO2e.' then 'new'
           else 'other' end
    into v_state
    from public.academy_quiz_questions where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 14;
  if v_state is null then raise exception 'digest-copy recut, carbon refused: no row for advanced m06-the-expert-reading ord 14'; end if;
  if v_state = 'other' then raise exception 'digest-copy recut, carbon refused: advanced m06-the-expert-reading ord 14 matches neither its published nor its recut text'; end if;
  if v_state = 'old' then
    update public.academy_quiz_questions set prompt = 'The path prints the full Agbor baseline less the partial one as 10988.000 tCO2e. What does it say that figure is?', options = '["The heaters'' emission passed to the curve", "The vented and fugitive methane line", "The gap between the two end-year targets", "The inventory''s purchased electricity line"]'::jsonb, explanation = 'On the path, the full baseline less the partial is 10988.000 tCO2e (computed here), the inventory''s purchased electricity line: the partial inventory is the full one without it. The heaters are passed as 34927.743 tCO2e and the vented line is 2622.400 tCO2e.'
     where app_slug = 'carbon' and tier = 'advanced' and scope = 'module' and module_key is not distinct from 'm06-the-expert-reading' and ord = 14;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception 'digest-copy recut, carbon refused: advanced m06-the-expert-reading ord 14 updated % rows', v_count; end if;
    v_updated := v_updated + 1;
  end if;

  select count(*) into v_total from public.academy_quiz_questions where app_slug = 'carbon';
  if v_total <> 396 then raise exception 'digest-copy recut, carbon refused: the course holds % questions, expected 396', v_total; end if;
  raise notice 'digest-copy recut, carbon: % of 334 rows updated, the rest already carried the recut text', v_updated;
end $$;
