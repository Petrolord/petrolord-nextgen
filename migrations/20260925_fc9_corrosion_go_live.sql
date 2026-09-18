-- ============================================================================
-- FC9 GO-LIVE (HELD): Corrosion & Integrity flips to 'available'. The NINTH
-- Facilities course, at path_order 47 above FC8 at 46, FC7 at 45, FC6
-- heattransfer at 44, FC5 at 43, FC4 gasprocessing at 42, FC3 rotating at 41,
-- FC2 linesizing at 40 and FC1 separation at 39.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/corrosion. The 78 lessons, the teaching lab
-- (corrosionLab.js) and its three explorer panels (the chemistry, the rate and
-- the corrosion inhibitor and integrity explorers) ship in the ZIP and NOT in
-- this database, so a flip before the upload puts a live catalogue tile in
-- front of a route that does not exist. This file is written, dry-run and left
-- unapplied on purpose.
--
-- EVERY DENOMINATOR BELOW IS A FLOAT, ON PURPOSE. Postgres divides integer by
-- integer as an integer. The generator that wrote this file refuses to emit a
-- division with a bare integer denominator, and refuses a malformed literal.
--
-- ALL EIGHTEEN GRADED VALUES ARE REPRODUCED BY EXACT CLOSED FORM, because not
-- one of them is a corrosion rate the correlation produced: they are partial
-- pressures, a mole ratio, a Reynolds number by definition, and arithmetic
-- over typed percentages, stated allowances and a SURVEYED rate. The four
-- Expert fields the engine finds by BISECTION are asserted by the relation they
-- are a root of, never by restating the engine's own algebra.
--
-- AND ELEVEN ARE ASSERTED TWICE, BY ROUTES WITH NOTHING IN COMMON: the psia
-- field again from the DEFINITIONS of the pound-force and the bar, which found
-- that the engine's factor, which its own comment calls exact, sits 1.9e-9
-- above them (digest section 24 now prints it); the mole ratio again from the two graded partial
-- pressures; the metal-loss ratio again from the graded inhibition; the
-- shortfall again from the graded retained fraction; the inhibited rate, the
-- required allowance and the lost life again through each other; and the
-- Expert design-life identity, target identity, stripped life and reinstating
-- allowance again through the graded tolerable rate and the graded credit
-- ratio.
--
-- EVERY REFUSAL NAMES THE GRADED FIELD IT READ, condition included and not only
-- message, so a reader is never left looking at the trusting half of a
-- disagreeing pair.
-- ============================================================================

do $$
declare
  v_structures int; v_questions int; v_capstones int; v_lessons int;
  v_modules int; v_graded int; v_available int; v_soon int;
  v_names text;
  v_psia double precision; v_psia_def double precision; v_left double precision; v_ret double precision;
  v_g_obigbo_co2_partial_pressure_bar double precision;
  v_g_obigbo_h2s_partial_pressure_psia double precision;
  v_g_obigbo_h2s_to_co2_mole_ratio double precision;
  v_g_obigbo_reynolds_number double precision;
  v_g_obigbo_effective_inhibition_pct double precision;
  v_g_obigbo_metal_loss_ratio_vs_datasheet double precision;
  v_g_nembe_retained_metal_loss_fraction double precision;
  v_g_nembe_inhibitor_shortfall_pp double precision;
  v_g_nembe_inhibited_rate_mmyr double precision;
  v_g_nembe_remaining_life_yr double precision;
  v_g_nembe_required_allowance_mm double precision;
  v_g_nembe_life_lost_to_availability_yr double precision;
  v_g_soku_tolerable_rate_mmyr double precision;
  v_g_soku_required_availability_pct double precision;
  v_g_soku_availability_for_design_life_pct double precision;
  v_g_soku_allowance_to_reinstate_mm double precision;
  v_g_soku_stripped_film_life_yr double precision;
  v_g_soku_film_credit_life_ratio double precision;
begin

  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures
   where app_slug = 'corrosion' and active;
  if v_structures <> 3 then
    raise exception 'FC9 go-live refused: corrosion has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions from public.academy_quiz_questions where app_slug = 'corrosion';
  if v_questions <> 396 then
    raise exception 'FC9 go-live refused: corrosion has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_graded from (
    select tier from public.academy_quiz_questions where app_slug = 'corrosion'
     group by tier having count(*) <> 132) t;
  if v_graded <> 0 then
    raise exception 'FC9 go-live refused: % tier(s) do not carry exactly 132 questions', v_graded;
  end if;

  select count(*) into v_graded from (
    select tier, module_key from public.academy_quiz_questions
     where app_slug = 'corrosion' and scope = 'module'
     group by tier, module_key having count(*) <> 15) t;
  if v_graded <> 0 then
    raise exception 'FC9 go-live refused: % module bank(s) do not carry exactly 15 questions', v_graded;
  end if;

  select count(*) into v_graded from (
    select tier from public.academy_quiz_questions
     where app_slug = 'corrosion' and scope = 'final'
     group by tier having count(*) <> 42) t;
  if v_graded <> 0 then
    raise exception 'FC9 go-live refused: % final exam(s) do not carry exactly 42 questions', v_graded;
  end if;

  -- A question whose key is outside its own options is unanswerable, and it is
  -- the one shape a count of rows can never see.
  select count(*) into v_graded from public.academy_quiz_questions
   where app_slug = 'corrosion'
     and (jsonb_array_length(options) <> 4
          or answer_index < 0 or answer_index > 3);
  if v_graded <> 0 then
    raise exception 'FC9 go-live refused: % question(s) do not offer four options with a key inside them', v_graded;
  end if;

  select count(*) into v_capstones from public.academy_capstones where app_slug = 'corrosion';
  if v_capstones <> 3 then
    raise exception 'FC9 go-live refused: corrosion has % capstones, expected 3', v_capstones;
  end if;

  select count(*) into v_lessons
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m,
         lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = 'corrosion' and s.active;
  if v_lessons <> 78 then
    raise exception 'FC9 go-live refused: corrosion carries % lesson keys, expected 78', v_lessons;
  end if;

  select count(*) into v_modules
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = 'corrosion' and s.active;
  if v_modules <> 18 then
    raise exception 'FC9 go-live refused: corrosion carries % modules, expected 18 (six per tier)', v_modules;
  end if;

  -- THE ONE HISTORY MODULE. The Expert tier's m06 is the only module whose
  -- subject is what this engine used to do, and its frame lives in its KEY.
  if not exists (select 1 from public.academy_course_structures s,
                        lateral jsonb_array_elements(s.structure->'modules') m
                  where s.app_slug = 'corrosion' and s.tier = 'advanced' and s.active
                    and m->>'key' = 'm06-what-this-engine-used-to-do') then
    raise exception 'FC9 go-live refused: the Expert history module is not keyed m06-what-this-engine-used-to-do, so its frame is lost';
  end if;

  -- A module bank keyed to a module the structure does not declare is a bank
  -- no learner will ever be served.
  select count(*) into v_graded from (
    select distinct qq.tier, qq.module_key from public.academy_quiz_questions qq
     where qq.app_slug = 'corrosion' and qq.scope = 'module'
       and not exists (
         select 1 from public.academy_course_structures s,
              lateral jsonb_array_elements(s.structure->'modules') m
          where s.app_slug = qq.app_slug and s.tier = qq.tier and s.active
            and m->>'key' = qq.module_key)) t;
  if v_graded <> 0 then
    raise exception 'FC9 go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_graded;
  end if;

  select count(*) into v_graded from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f where c.app_slug = 'corrosion';
  if v_graded <> 18 then
    raise exception 'FC9 go-live refused: corrosion has % graded capstone fields, expected 18', v_graded;
  end if;

  select count(*) into v_graded from (
    select c.tier from public.academy_capstones c,
           lateral jsonb_array_elements(c.fields) f
     where c.app_slug = 'corrosion' group by c.tier having count(*) <> 6) t;
  if v_graded <> 0 then
    raise exception 'FC9 go-live refused: % tier(s) do not grade exactly six fields', v_graded;
  end if;

  if not exists (select 1 from public.academy_apps
                  where slug = 'corrosion' and module = 'facilities'
                    and path_order = 47 and prereq_slug is null) then
    raise exception 'FC9 go-live refused: the corrosion catalogue row is not facilities at path_order 47 with no prerequisite';
  end if;

  if exists (select 1 from public.academy_apps
              where path_order = 47 and slug <> 'corrosion') then
    raise exception 'FC9 go-live refused: another course already holds path_order 47';
  end if;

  -- THE VOCABULARY RULE, ON WHAT A LEARNER IS SERVED. A bare "inhibitor" reads
  -- as the hydrate inhibitor of the Flow Assurance course. Every shipped prompt
  -- and every graded label is swept.
  select count(*) into v_graded from public.academy_capstones c
   where c.app_slug = 'corrosion'
     and regexp_replace(c.prompt, 'corrosion inhibitor', '', 'g') ~ 'inhibitor';
  if v_graded <> 0 then
    raise exception 'FC9 go-live refused: % capstone prompt(s) carry a bare inhibitor', v_graded;
  end if;


  -- ------------------------------------------- the held-for-literature gates
  -- A FRAGMENT IS MATCHED AS A LITERAL SUBSTRING WITH strpos, NEVER WITH LIKE.
  -- In LIKE an underscore is a one-character wildcard, so the fragment mass_transfer
  -- would also match a key with any other character in that place. The
  -- generator's own Python guard tests a literal substring, and strpos is
  -- the same test. FC5's dry run caught the LIKE form refusing a field that
  -- names no held quantity (its kw_ against a kwm).
  -- ON THE NAME. A graded field that NAMES a quantity this module holds for the
  -- literature is refused before anything is computed from it.
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         unnest(array['category', 'regime', 'region', 'material', 'fugacity', 'scale', 'onset', 'friction', 'shear', 'dwm', 'reaction', 'mass_transfer', 'threshold', 'decades', 'interval', 'retirement', 'correlation_rate']) frag
   where c.app_slug = 'corrosion' and strpos(f->>'key', frag) > 0;
  if v_graded <> 0 then
    raise exception 'FC9 go-live refused: % graded field(s) name a quantity held for the literature: %', v_graded, v_names;
  end if;

  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         unnest(array['category', 'band', 'regime', 'severity', 'region', 'material', 'fugacity', 'friction factor', 'wall shear', 'onset', 'de waard', 'threshold', 'scale factor']) frag
   where c.app_slug = 'corrosion' and strpos(lower(f->>'label'), frag) > 0;
  if v_graded <> 0 then
    raise exception 'FC9 go-live refused: % graded field label(s) name a quantity held for the literature: %', v_graded, v_names;
  end if;

  -- ON THE VALUE. A graded answer landing on a held number, within its own
  -- shipped tolerance, is a lookup of a quantity this module refuses to source.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key') || ' on ' || h.lab, ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         unnest(array[0.002, 0.0031, 0.0035, 0.046, 0.05, 0.1, 0.2, 0.5, 0.58, 0.6, 0.8, 1.0, 1.4, 2.45, 4.0, 4.93, 6.7, 16.0, 50.0, 100.0, 250.0, 1119.0, 2400.0, 4000.0], array['the carbonate boundary ratio', 'the fugacity coefficient constant A', 'the H2S screening threshold in bar', 'the Blasius coefficient', 'the mixed boundary ratio', 'the low category band, the controlling margin and the shortfall trigger', 'the mass-transfer diameter exponent and the Blasius exponent', 'the pH slope and the moderate category band', 'the reaction fugacity exponent', 'the scale fugacity exponent', 'the mass-transfer velocity exponent', 'the high category band', 'the fugacity coefficient constant B', 'the mass-transfer coefficient', 'the pH reference', 'the de Waard-Milliams reaction constant A', 'the scale constant C', 'the laminar friction constant', 'the moderate film-risk band in Pa', 'the film-stripping threshold in Pa', 'the fugacity pressure cap in bar', 'the de Waard-Milliams reaction constant B', 'the scale constant A', 'the friction branch switch Reynolds number']) as h(val, lab)
   where c.app_slug = 'corrosion'
     and abs(abs((f->>'expected')::double precision) - h.val) <= (f->>'tol')::double precision;
  if v_graded <> 0 then
    raise exception 'FC9 go-live refused: % graded field(s) land on a quantity held for the literature: %', v_graded, v_names;
  end if;

  -- ---------------------------------------------------- the collision sweeps
  -- EVERY NUMBER THE TEACHING DIGEST PRINTS, at each field's SHIPPED tolerance.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key'), ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         unnest(array[0.0, 1e-09, 1e-05, 3e-05, 0.0001, 0.000145037738, 0.0002, 0.000434, 0.000435, 0.0005, 0.0008, 0.001, 0.0012, 0.00145037738, 0.0015, 0.0016, 0.002, 0.002867, 0.00288, 0.0031, 0.003162, 0.003168, 0.0032, 0.00344737864, 0.0034965, 0.0035, 0.0035035, 0.003552, 0.003553, 0.00366, 0.004, 0.004032, 0.00404, 0.004444, 0.006, 0.007132, 0.007623, 0.008, 0.008317, 0.008591, 0.008739, 0.01, 0.014444, 0.014941, 0.02, 0.024394, 0.0254, 0.029924, 0.03, 0.031623, 0.033333333333, 0.04, 0.046, 0.047248, 0.05, 0.050712445094, 0.050763, 0.050763208303, 0.0508, 0.050813971511, 0.051, 0.06, 0.072757985058, 0.076842, 0.083821, 0.09, 0.091134, 0.091971, 0.095857, 0.097072, 0.0999, 0.1, 0.1001, 0.1016, 0.107554, 0.115674, 0.125, 0.135116, 0.140495867769, 0.14110588205, 0.145037738007, 0.149412, 0.1524, 0.161915, 0.163452, 0.177828, 0.185264, 0.2, 0.2032, 0.206012, 0.242520118987, 0.242737, 0.243082, 0.25, 0.252905, 0.273572, 0.288877, 0.292481, 0.3, 0.3048, 0.316228, 0.333333333333, 0.337174, 0.361, 0.361255, 0.363944, 0.37, 0.399278, 0.4, 0.402343, 0.4064, 0.421113, 0.423517, 0.435371430361, 0.442281, 0.45359237, 0.455932, 0.472482, 0.487114, 0.4999, 0.5, 0.5001, 0.513135, 0.526907, 0.528864, 0.530179, 0.531526, 0.561603, 0.562341, 0.58, 0.6, 0.601919, 0.602425, 0.615743, 0.620278, 0.653305, 0.654841, 0.661251, 0.728051, 0.739699, 0.753085, 0.754523654262, 0.754524, 0.754524736514, 0.755, 0.760876, 0.773876, 0.773945, 0.775834, 0.8, 0.820838044032, 0.836713, 0.840204, 0.844077, 0.878581, 0.880125, 0.880814, 0.921975, 0.947776, 0.974938, 0.979796, 0.990899, 0.997465, 0.9999, 1.0, 1.0001, 1.1, 1.119, 1.163506, 1.179, 1.2, 1.223, 1.27, 1.270135, 1.278276, 1.311185, 1.321222, 1.341754, 1.34424, 1.38, 1.388, 1.4, 1.401, 1.401052, 1.421, 1.43, 1.434, 1.45, 1.450377380072, 1.455932, 1.46768, 1.47, 1.494118, 1.498, 1.5, 1.503467, 1.508421, 1.526417, 1.530013, 1.536848, 1.544068, 1.655305, 1.676, 1.676428, 1.679205, 1.679557, 1.7, 1.702939, 1.741101126592, 1.8, 1.802, 1.806, 1.896603, 1.9, 1.905, 1.91, 1.912746, 1.914, 1.95, 2.0, 2.032, 2.114437, 2.158418, 2.189815, 2.2, 2.22, 2.274, 2.302609, 2.327502, 2.34, 2.341081, 2.366306, 2.45, 2.455932, 2.456, 2.5, 2.512487, 2.524772, 2.544068, 2.547999, 2.608, 2.644, 2.65696, 2.734, 2.775, 2.776, 2.7793, 2.8, 2.842, 2.896, 2.9, 3.0, 3.017, 3.048, 3.122, 3.175, 3.331, 3.3754, 3.391, 3.399, 3.412, 3.436459, 3.455932, 3.486, 3.5, 3.535, 3.611511, 3.64711, 3.717, 3.871, 3.9, 3.967, 3.970499, 3.976339, 3.992245, 3.9999, 4.0, 4.066, 4.099106, 4.124187, 4.2, 4.201, 4.207953, 4.354, 4.400141, 4.41344, 4.45, 4.450094, 4.473797, 4.499, 4.5, 4.643, 4.699248, 4.7, 4.724817, 4.740191, 4.75, 4.8, 4.82, 4.93, 5.0, 5.054435, 5.083726, 5.203611, 5.407938, 5.438833, 5.458, 5.468, 5.5, 5.551, 5.59761, 5.806021, 6.0, 6.2, 6.204, 6.325799, 6.344, 6.362143, 6.573, 6.669367, 6.7, 6.896552, 7.0, 7.225094, 7.252, 7.47, 7.5, 7.53, 7.560298, 7.661091, 7.681561, 7.7, 7.832881, 7.954, 8.0, 8.018151, 8.031496, 8.049, 8.107604, 8.126015, 8.264482, 8.497, 8.685779, 8.800282, 8.901, 9.0, 9.040286, 9.253475, 9.474, 9.5, 9.714, 9.80665, 10.0, 10.01, 10.013808, 10.10887, 10.5, 10.816423, 10.850643, 10.91477, 11.0, 11.055613, 11.452295, 11.612042, 11.701938, 11.915473, 11.92, 12.0, 12.3, 13.0, 13.080024, 13.185473, 13.19, 13.333333, 13.338734, 14.0, 14.408065, 14.5, 14.503773773021, 14.503773800722, 14.5038, 14.7, 15.0, 15.090473, 15.25, 15.322181, 15.364833, 15.616468, 16.0, 16.0185, 16.299002, 16.919257, 17.0, 17.138674, 17.148398, 17.600564, 18.0, 19.0, 20.0, 20.217739, 21.0, 22.0, 22.821316, 23.0, 23.75, 24.0, 24.479852, 25.0, 25.4, 27.162967, 27.66, 27.663205, 27.920824, 28.0, 28.5, 29.705656, 30.0, 30.302325, 30.75, 30.753563, 32.0, 33.528563, 35.85396, 36.112878, 38.740377, 39.052007, 40.0, 44.114126, 44.225132, 47.5, 47.679108, 50.0, 51.000427, 51.000427474179, 51.00051960016, 55.0, 56.0, 58.2, 60.0, 63.957912, 66.5, 70.0, 70.689594, 71.25, 75.655878, 76.0, 79.792274, 80.0, 80.984504, 82.0, 85.0, 85.058955, 85.5, 89.053653, 90.0, 90.25, 93.1, 95.0, 96.443771, 97.225957, 98.0, 100.0, 107.879479, 108.978001, 110.0, 115.0, 119.4, 120.0, 130.0, 132.297731, 137.4, 140.0, 145.037738007218, 149.987114, 150.0, 157.0, 175.0, 180.0, 192.123424, 200.0, 201.718855, 204.866591, 249.0, 250.0, 251.0, 265.610382, 273.15, 300.0, 316.227766, 339.998473, 342.773473, 362.0, 362.474888, 369.638295, 370.0, 399.99999999999994, 400.0, 418.514742, 460.706213, 500.0, 725.0, 755.983414, 783.0, 897.036, 1000.0, 1119.0, 1500.0, 1741.146915, 2000.0, 2399.999999999998, 2400.0, 3600.0, 3960.0, 4000.0, 4040.0, 4080.0, 4400.0, 8000.0, 8760.0, 15156.0, 31643.7818, 63287.5636, 100000.0, 126575.1273, 193290.825, 200000.0, 253150.2545, 313781.44, 363816.0533, 364215.68, 416686.8569, 506300.5091, 759450.7636, 800000.0, 1063231.0691, 1139176.1455, 1582189.0909, 6759621.0]) pub
   where c.app_slug = 'corrosion'
     and abs(abs((f->>'expected')::double precision) - pub) <= (f->>'tol')::double precision;
  if v_graded <> 0 then
    raise exception 'FC9 go-live refused: % graded field(s) sit within their own tolerance of a value the digest publishes, which makes them a lookup rather than a calculation: %', v_graded, v_names;
  end if;

  -- EVERY NUMBER A LEARNER IS HANDED, read by POSTGRES out of the shipped
  -- prompt rather than out of a generator's copy of it.
  select count(*), string_agg(distinct c.tier || '/' || (f->>'key'), ', ')
    into v_graded, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         public.academy_capstones p,
         lateral regexp_matches(p.prompt, '[0-9]+\.?[0-9]*', 'g') as m
   where c.app_slug = 'corrosion' and p.app_slug = 'corrosion'
     and abs(abs((f->>'expected')::double precision) - (m[1])::double precision)
         <= (f->>'tol')::double precision;
  if v_graded <> 0 then
    raise exception 'FC9 go-live refused: % graded field(s) land on a number the learner is handed in a prompt, which makes the field a transcription rather than a calculation: %', v_graded, v_names;
  end if;

  -- AND PAIRWISE. Two graded answers within the looser of their two tolerances
  -- cannot be told apart by a grader, so one of them grades nothing.
  select count(*), string_agg(a.tier || '/' || a.k || ' and ' || b.tier || '/' || b.k, ', ')
    into v_graded, v_names
    from (select c.tier, f->>'key' k, (f->>'expected')::double precision e,
                 (f->>'tol')::double precision t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = 'corrosion') a,
         (select c.tier, f->>'key' k, (f->>'expected')::double precision e,
                 (f->>'tol')::double precision t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = 'corrosion') b
   where (a.tier, a.k) < (b.tier, b.k)
     and abs(abs(a.e) - abs(b.e)) <= greatest(a.t, b.t);
  if v_graded <> 0 then
    raise exception 'FC9 go-live refused: % pair(s) of graded fields are within the looser of their two tolerances: %', v_graded, v_names;
  end if;

  -- A capstone prompt stating another tier's graded answer hands that tier away.
  select count(*), string_agg(distinct c.tier || ' states ' || gg.owner || '/' || gg.k, ', ')
    into v_graded, v_names from public.academy_capstones c,
         (select f->>'expected' as e, f->>'key' as k, c2.tier as owner
            from public.academy_capstones c2, lateral jsonb_array_elements(c2.fields) f
           where c2.app_slug = 'corrosion') gg
   where c.app_slug = 'corrosion' and c.tier <> gg.owner and c.prompt like '%' || gg.e || '%';
  if v_graded <> 0 then
    raise exception 'FC9 go-live refused: % capstone prompt(s) state a graded value belonging to another tier: %', v_graded, v_names;
  end if;


  -- --------------------------------------- the eighteen graded values
  select (f->>'expected')::double precision into v_g_obigbo_co2_partial_pressure_bar
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'corrosion' and c.tier = 'beginner' and f->>'key' = 'obigbo_co2_partial_pressure_bar';
  select (f->>'expected')::double precision into v_g_obigbo_h2s_partial_pressure_psia
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'corrosion' and c.tier = 'beginner' and f->>'key' = 'obigbo_h2s_partial_pressure_psia';
  select (f->>'expected')::double precision into v_g_obigbo_h2s_to_co2_mole_ratio
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'corrosion' and c.tier = 'beginner' and f->>'key' = 'obigbo_h2s_to_co2_mole_ratio';
  select (f->>'expected')::double precision into v_g_obigbo_reynolds_number
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'corrosion' and c.tier = 'beginner' and f->>'key' = 'obigbo_reynolds_number';
  select (f->>'expected')::double precision into v_g_obigbo_effective_inhibition_pct
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'corrosion' and c.tier = 'beginner' and f->>'key' = 'obigbo_effective_inhibition_pct';
  select (f->>'expected')::double precision into v_g_obigbo_metal_loss_ratio_vs_datasheet
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'corrosion' and c.tier = 'beginner' and f->>'key' = 'obigbo_metal_loss_ratio_vs_datasheet';
  select (f->>'expected')::double precision into v_g_nembe_retained_metal_loss_fraction
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'corrosion' and c.tier = 'intermediate' and f->>'key' = 'nembe_retained_metal_loss_fraction';
  select (f->>'expected')::double precision into v_g_nembe_inhibitor_shortfall_pp
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'corrosion' and c.tier = 'intermediate' and f->>'key' = 'nembe_inhibitor_shortfall_pp';
  select (f->>'expected')::double precision into v_g_nembe_inhibited_rate_mmyr
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'corrosion' and c.tier = 'intermediate' and f->>'key' = 'nembe_inhibited_rate_mmyr';
  select (f->>'expected')::double precision into v_g_nembe_remaining_life_yr
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'corrosion' and c.tier = 'intermediate' and f->>'key' = 'nembe_remaining_life_yr';
  select (f->>'expected')::double precision into v_g_nembe_required_allowance_mm
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'corrosion' and c.tier = 'intermediate' and f->>'key' = 'nembe_required_allowance_mm';
  select (f->>'expected')::double precision into v_g_nembe_life_lost_to_availability_yr
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'corrosion' and c.tier = 'intermediate' and f->>'key' = 'nembe_life_lost_to_availability_yr';
  select (f->>'expected')::double precision into v_g_soku_tolerable_rate_mmyr
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'corrosion' and c.tier = 'advanced' and f->>'key' = 'soku_tolerable_rate_mmyr';
  select (f->>'expected')::double precision into v_g_soku_required_availability_pct
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'corrosion' and c.tier = 'advanced' and f->>'key' = 'soku_required_availability_pct';
  select (f->>'expected')::double precision into v_g_soku_availability_for_design_life_pct
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'corrosion' and c.tier = 'advanced' and f->>'key' = 'soku_availability_for_design_life_pct';
  select (f->>'expected')::double precision into v_g_soku_allowance_to_reinstate_mm
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'corrosion' and c.tier = 'advanced' and f->>'key' = 'soku_allowance_to_reinstate_mm';
  select (f->>'expected')::double precision into v_g_soku_stripped_film_life_yr
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'corrosion' and c.tier = 'advanced' and f->>'key' = 'soku_stripped_film_life_yr';
  select (f->>'expected')::double precision into v_g_soku_film_credit_life_ratio
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'corrosion' and c.tier = 'advanced' and f->>'key' = 'soku_film_credit_life_ratio';
  if v_g_obigbo_co2_partial_pressure_bar is null
     or v_g_obigbo_h2s_partial_pressure_psia is null
     or v_g_obigbo_h2s_to_co2_mole_ratio is null
     or v_g_obigbo_reynolds_number is null
     or v_g_obigbo_effective_inhibition_pct is null
     or v_g_obigbo_metal_loss_ratio_vs_datasheet is null
     or v_g_nembe_retained_metal_loss_fraction is null
     or v_g_nembe_inhibitor_shortfall_pp is null
     or v_g_nembe_inhibited_rate_mmyr is null
     or v_g_nembe_remaining_life_yr is null
     or v_g_nembe_required_allowance_mm is null
     or v_g_nembe_life_lost_to_availability_yr is null
     or v_g_soku_tolerable_rate_mmyr is null
     or v_g_soku_required_availability_pct is null
     or v_g_soku_availability_for_design_life_pct is null
     or v_g_soku_allowance_to_reinstate_mm is null
     or v_g_soku_stripped_film_life_yr is null
     or v_g_soku_film_credit_life_ratio is null then
    raise exception 'FC9 go-live refused: one or more of the eighteen graded fields is missing [graded field: beginner.obigbo_co2_partial_pressure_bar, beginner.obigbo_h2s_partial_pressure_psia, beginner.obigbo_h2s_to_co2_mole_ratio, beginner.obigbo_reynolds_number, beginner.obigbo_effective_inhibition_pct, beginner.obigbo_metal_loss_ratio_vs_datasheet, intermediate.nembe_retained_metal_loss_fraction, intermediate.nembe_inhibitor_shortfall_pp, intermediate.nembe_inhibited_rate_mmyr, intermediate.nembe_remaining_life_yr, intermediate.nembe_required_allowance_mm, intermediate.nembe_life_lost_to_availability_yr, advanced.soku_tolerable_rate_mmyr, advanced.soku_required_availability_pct, advanced.soku_availability_for_design_life_pct, advanced.soku_allowance_to_reinstate_mm, advanced.soku_stripped_film_life_yr, advanced.soku_film_credit_life_ratio]';
  end if;

  -- ------------------------------------------------- the Associate, OBIGBO
  -- The CO2 partial pressure is the total pressure times the mole fraction.
  -- No fugacity coefficient, which is the whole distinction the tier teaches.
  if abs(v_g_obigbo_co2_partial_pressure_bar - 137.42 * 0.0237) > 1e-12 then
    raise exception 'FC9 go-live refused: the CO2 partial pressure of % bar is not the total pressure of % bar times the mole fraction % [graded field: beginner.obigbo_co2_partial_pressure_bar]', v_g_obigbo_co2_partial_pressure_bar, 137.42, 0.0237;
  end if;

  -- THE PSIA FIELD, ON THE FACTOR THE ENGINE EXPORTS (pinned by measurement in
  -- digest section 3). Tight, so a move far smaller than the grade is refused.
  v_psia := 14.503773800721815;
  if abs(v_g_obigbo_h2s_partial_pressure_psia - 137.42 * 0.00093 * v_psia) > 1e-12 then
    raise exception 'FC9 go-live refused: the H2S partial pressure of % psia is not % bar times the mole fraction % converted by the engine factor % [graded field: beginner.obigbo_h2s_partial_pressure_psia]', v_g_obigbo_h2s_partial_pressure_psia, 137.42, 0.00093, v_psia;
  end if;

  -- AND AGAIN FROM THE DEFINITIONS, which share no constant with the engine: the
  -- pound is 0.45359237 kg, standard gravity 9.80665 m/s2, the inch 0.0254 m and
  -- the bar 100000 Pa. The engine's factor sits 1.9e-9 above this one (its own
  -- comment calls it exact, and it is not), so this route admits 1e-8, which is
  -- still fifty times inside the field's shipped grade. The studio's truncated
  -- 14.5038 would miss by more than the grade itself.
  v_psia_def := 100000.0 / (0.45359237 * 9.80665 / (0.0254 * 0.0254));
  if abs(v_g_obigbo_h2s_partial_pressure_psia - 137.42 * 0.00093 * v_psia_def) > 1e-08 then
    raise exception 'FC9 go-live refused: the H2S partial pressure of % psia is not what the definitions of the bar and the pound-force give, % psia [graded field: beginner.obigbo_h2s_partial_pressure_psia]', v_g_obigbo_h2s_partial_pressure_psia, 137.42 * 0.00093 * v_psia_def;
  end if;

  -- The mole ratio, PRESSURE FREE: the ratio of the two mole fractions.
  if abs(v_g_obigbo_h2s_to_co2_mole_ratio - 0.00093 / 0.0237) > 1e-14 then
    raise exception 'FC9 go-live refused: the H2S to CO2 mole ratio of % is not the ratio of the mole fractions % and % [graded field: beginner.obigbo_h2s_to_co2_mole_ratio]', v_g_obigbo_h2s_to_co2_mole_ratio, 0.00093, 0.0237;
  end if;

  -- AND AGAIN FROM TWO OTHER GRADED FIELDS. The graded psia back in bar over
  -- the graded CO2 partial pressure is the same ratio by a route through the
  -- pressure rather than around it.
  if abs(v_g_obigbo_h2s_to_co2_mole_ratio - (v_g_obigbo_h2s_partial_pressure_psia / v_psia) / v_g_obigbo_co2_partial_pressure_bar) > 1e-14 then
    raise exception 'FC9 go-live refused: the graded mole ratio of % disagrees with the graded H2S partial pressure of % psia over the graded CO2 partial pressure of % bar [graded field: beginner.obigbo_h2s_to_co2_mole_ratio, beginner.obigbo_h2s_partial_pressure_psia, beginner.obigbo_co2_partial_pressure_bar]', v_g_obigbo_h2s_to_co2_mole_ratio, v_g_obigbo_h2s_partial_pressure_psia, v_g_obigbo_co2_partial_pressure_bar;
  end if;

  -- This module's Reynolds number is a DEFINITION. The held Blasius pair and
  -- the branch switch act downstream of it and no graded field reads them.
  if abs(v_g_obigbo_reynolds_number - 860.19 * 3.4442 * 0.20272 / 0.00114) > 1e-8 then
    raise exception 'FC9 go-live refused: the Reynolds number of % is not density % times velocity % times diameter % over viscosity % [graded field: beginner.obigbo_reynolds_number]', v_g_obigbo_reynolds_number, 860.19, 3.4442, 0.20272, 0.00114;
  end if;

  -- The effective corrosion inhibition is the efficiency times the
  -- availability, and nothing else.
  if abs(v_g_obigbo_effective_inhibition_pct - 87.0 * 91.4 / 100.0) > 1e-11 then
    raise exception 'FC9 go-live refused: the effective inhibition of % percent is not % percent efficiency times % percent availability [graded field: beginner.obigbo_effective_inhibition_pct]', v_g_obigbo_effective_inhibition_pct, 87.0, 91.4;
  end if;

  -- The metal-loss ratio against the datasheet number, off the two typed
  -- percentages. The correlation divides out of it entirely.
  if abs(v_g_obigbo_metal_loss_ratio_vs_datasheet - (100.0 - 87.0 * 91.4 / 100.0) / (100.0 - 87.0)) > 1e-12 then
    raise exception 'FC9 go-live refused: the metal-loss ratio of % is not what % percent efficiency at % percent availability leaves against the datasheet [graded field: beginner.obigbo_metal_loss_ratio_vs_datasheet]', v_g_obigbo_metal_loss_ratio_vs_datasheet, 87.0, 91.4;
  end if;

  -- AND FROM THE GRADED INHIBITION, which reaches the same ratio through the
  -- field a learner reports rather than through the two inputs.
  if abs(v_g_obigbo_metal_loss_ratio_vs_datasheet - (100.0 - v_g_obigbo_effective_inhibition_pct) / (100.0 - 87.0)) > 1e-12 then
    raise exception 'FC9 go-live refused: the graded metal-loss ratio of % disagrees with the graded effective inhibition of % percent [graded field: beginner.obigbo_metal_loss_ratio_vs_datasheet, beginner.obigbo_effective_inhibition_pct]', v_g_obigbo_metal_loss_ratio_vs_datasheet, v_g_obigbo_effective_inhibition_pct;
  end if;


  -- ------------------------------------------ the Professional, NEMBE CREEK
  -- The retained fraction is what the programme leaves of the metal loss.
  if abs(v_g_nembe_retained_metal_loss_fraction - (1.0 - 93.0 * 88.5 / 10000.0)) > 1e-13 then
    raise exception 'FC9 go-live refused: the retained fraction of % is not one less % percent times % percent [graded field: intermediate.nembe_retained_metal_loss_fraction]', v_g_nembe_retained_metal_loss_fraction, 93.0, 88.5;
  end if;

  if abs(v_g_nembe_inhibitor_shortfall_pp - (93.0 - 93.0 * 88.5 / 100.0)) > 1e-11 then
    raise exception 'FC9 go-live refused: the shortfall of % percentage points is not the datasheet % less the effective protection [graded field: intermediate.nembe_inhibitor_shortfall_pp]', v_g_nembe_inhibitor_shortfall_pp, 93.0;
  end if;

  -- THE SHORTFALL AGAIN, FROM THE GRADED RETAINED FRACTION.
  if abs(v_g_nembe_inhibitor_shortfall_pp - (100.0 * v_g_nembe_retained_metal_loss_fraction - (100.0 - 93.0))) > 1e-10 then
    raise exception 'FC9 go-live refused: the graded shortfall of % disagrees with the graded retained fraction of % [graded field: intermediate.nembe_inhibitor_shortfall_pp, intermediate.nembe_retained_metal_loss_fraction]', v_g_nembe_inhibitor_shortfall_pp, v_g_nembe_retained_metal_loss_fraction;
  end if;

  -- The inhibited rate is the SURVEYED rate times the retained fraction. No
  -- correlation rate is in it.
  if abs(v_g_nembe_inhibited_rate_mmyr - 1.9826 * v_g_nembe_retained_metal_loss_fraction) > 1e-13 then
    raise exception 'FC9 go-live refused: the inhibited rate of % mm/yr is not the surveyed % mm/yr times the graded retained fraction % [graded field: intermediate.nembe_inhibited_rate_mmyr, intermediate.nembe_retained_metal_loss_fraction]', v_g_nembe_inhibited_rate_mmyr, 1.9826, v_g_nembe_retained_metal_loss_fraction;
  end if;

  v_left := 3.048 - 0.6731;
  if abs(v_g_nembe_remaining_life_yr - v_left / v_g_nembe_inhibited_rate_mmyr) > 1e-11 then
    raise exception 'FC9 go-live refused: the remaining life of % yr is not the remaining allowance % mm over the graded inhibited rate % mm/yr [graded field: intermediate.nembe_remaining_life_yr, intermediate.nembe_inhibited_rate_mmyr]', v_g_nembe_remaining_life_yr, v_left, v_g_nembe_inhibited_rate_mmyr;
  end if;

  -- The required allowance IGNORES what has gone. It is the rate times the
  -- design life, and nothing else.
  if abs(v_g_nembe_required_allowance_mm - v_g_nembe_inhibited_rate_mmyr * 18.0) > 1e-12 then
    raise exception 'FC9 go-live refused: the required allowance of % mm is not the graded rate % mm/yr times the % year design life [graded field: intermediate.nembe_required_allowance_mm, intermediate.nembe_inhibited_rate_mmyr]', v_g_nembe_required_allowance_mm, v_g_nembe_inhibited_rate_mmyr, 18.0;
  end if;

  -- AND BY THE OTHER DOOR: the remaining allowance times the design life over
  -- the graded life is the same allowance, reached through the years.
  if abs(v_g_nembe_required_allowance_mm - v_left * 18.0 / v_g_nembe_remaining_life_yr) > 1e-10 then
    raise exception 'FC9 go-live refused: the graded required allowance of % mm disagrees with the graded life of % yr [graded field: intermediate.nembe_required_allowance_mm, intermediate.nembe_remaining_life_yr]', v_g_nembe_required_allowance_mm, v_g_nembe_remaining_life_yr;
  end if;

  if not (v_g_nembe_remaining_life_yr < 18.0) then
    raise exception 'FC9 go-live refused: the programme life of % yr meets the design life, so the tier has no shortfall to teach [graded field: intermediate.nembe_remaining_life_yr]', v_g_nembe_remaining_life_yr;
  end if;

  -- The life the availability costs, against the same corrosion inhibitor at
  -- full availability.
  if abs(v_g_nembe_life_lost_to_availability_yr - (v_left / (1.9826 * (1.0 - 93.0 / 100.0)) - v_g_nembe_remaining_life_yr)) > 1e-10 then
    raise exception 'FC9 go-live refused: the life lost to availability of % yr is not the full-availability life less the graded life of % yr [graded field: intermediate.nembe_life_lost_to_availability_yr, intermediate.nembe_remaining_life_yr]', v_g_nembe_life_lost_to_availability_yr, v_g_nembe_remaining_life_yr;
  end if;


  -- ------------------------------------------------------- the Expert, SOKU
  -- Four of these six were found by BISECTING the engine's own verdict, so
  -- each is asserted by the relation it is a root of.
  v_left := 4.7625 - 1.3607;
  v_ret := 1.0 - 96.0 * 82.3 / 10000.0;

  if abs(v_g_soku_tolerable_rate_mmyr - v_left / 24.0) > 1e-12 then
    raise exception 'FC9 go-live refused: the tolerable rate of % mm/yr is not the remaining allowance % mm over the % year design life [graded field: advanced.soku_tolerable_rate_mmyr]', v_g_soku_tolerable_rate_mmyr, v_left, 24.0;
  end if;
  if abs(v_g_soku_tolerable_rate_mmyr * 24.0 - v_left) > 1e-11 then
    raise exception 'FC9 go-live refused: the graded tolerable rate of % mm/yr does not spend exactly the remaining allowance % mm over the design life [graded field: advanced.soku_tolerable_rate_mmyr]', v_g_soku_tolerable_rate_mmyr, v_left;
  end if;

  if abs(v_g_soku_required_availability_pct - 100.0 * 88.0 / 96.0) > 1e-10 then
    raise exception 'FC9 go-live refused: the required availability of % percent is not the target % over the efficiency % [graded field: advanced.soku_required_availability_pct]', v_g_soku_required_availability_pct, 88.0, 96.0;
  end if;
  if abs(v_g_soku_required_availability_pct * 96.0 / 100.0 - 88.0) > 1e-10 then
    raise exception 'FC9 go-live refused: the graded availability of % percent does not deliver the target effective protection [graded field: advanced.soku_required_availability_pct]', v_g_soku_required_availability_pct;
  end if;

  -- AS A ROOT: at the graded availability the surveyed rate, with the credit
  -- kept, spends exactly the remaining allowance over the design life.
  if abs(2.1082 * (1.0 - 96.0 * v_g_soku_availability_for_design_life_pct / 10000.0) * 24.0 - v_left) > 1e-10 then
    raise exception 'FC9 go-live refused: the availability of % percent is not a root of the design-life relation on the surveyed rate [graded field: advanced.soku_availability_for_design_life_pct]', v_g_soku_availability_for_design_life_pct;
  end if;
  if not (82.3 < v_g_soku_availability_for_design_life_pct and v_g_soku_availability_for_design_life_pct < 100.0) then
    raise exception 'FC9 go-live refused: the design-life availability of % percent is not between the programme availability and 100 [graded field: advanced.soku_availability_for_design_life_pct]', v_g_soku_availability_for_design_life_pct;
  end if;

  -- THE REINSTATING ALLOWANCE is the consumed depth plus the allowance a new
  -- line would need, which is the gap the tier is built on.
  if abs(v_g_soku_allowance_to_reinstate_mm - (1.3607 + 2.1082 * v_ret * 24.0)) > 1e-10 then
    raise exception 'FC9 go-live refused: the reinstating allowance of % mm is not the consumed % mm plus the credited rate times the design life [graded field: advanced.soku_allowance_to_reinstate_mm]', v_g_soku_allowance_to_reinstate_mm, 1.3607;
  end if;
  if not (v_g_soku_allowance_to_reinstate_mm > 4.7625) then
    raise exception 'FC9 go-live refused: the reinstating allowance of % mm does not exceed the allowance the line has, so nothing needs reinstating [graded field: advanced.soku_allowance_to_reinstate_mm]', v_g_soku_allowance_to_reinstate_mm;
  end if;

  if abs(v_g_soku_stripped_film_life_yr - v_left / 2.1082) > 1e-12 then
    raise exception 'FC9 go-live refused: the stripped life of % yr is not the remaining allowance % mm over the surveyed rate [graded field: advanced.soku_stripped_film_life_yr]', v_g_soku_stripped_film_life_yr, v_left;
  end if;
  -- AND THROUGH THE GRADED TOLERABLE RATE, which spends the same allowance.
  if abs(v_g_soku_stripped_film_life_yr - v_g_soku_tolerable_rate_mmyr * 24.0 / 2.1082) > 1e-11 then
    raise exception 'FC9 go-live refused: the graded stripped life of % yr disagrees with the graded tolerable rate of % mm/yr [graded field: advanced.soku_stripped_film_life_yr, advanced.soku_tolerable_rate_mmyr]', v_g_soku_stripped_film_life_yr, v_g_soku_tolerable_rate_mmyr;
  end if;

  if abs(v_g_soku_film_credit_life_ratio - 1.0 / v_ret) > 1e-11 then
    raise exception 'FC9 go-live refused: the credit ratio of % is not the reciprocal of the retained fraction % [graded field: advanced.soku_film_credit_life_ratio]', v_g_soku_film_credit_life_ratio, v_ret;
  end if;
  -- AND THE REINSTATING ALLOWANCE THROUGH THE GRADED CREDIT RATIO: the credited
  -- rate times the ratio is the surveyed rate, so the allowance a new line
  -- would need, times the ratio, is the surveyed rate over the design life.
  if abs((v_g_soku_allowance_to_reinstate_mm - 1.3607) * v_g_soku_film_credit_life_ratio - 2.1082 * 24.0) > 1e-9 then
    raise exception 'FC9 go-live refused: the graded reinstating allowance of % mm and the graded credit ratio of % disagree about the surveyed rate [graded field: advanced.soku_allowance_to_reinstate_mm, advanced.soku_film_credit_life_ratio]', v_g_soku_allowance_to_reinstate_mm, v_g_soku_film_credit_life_ratio;
  end if;


  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = 'corrosion';
  if not exists (select 1 from public.academy_apps
                  where slug = 'corrosion' and status = 'available') then
    raise exception 'FC9 go-live refused: corrosion did not reach status available';
  end if;

  select count(*) filter (where status = 'available'),
         count(*) filter (where status = 'coming_soon')
    into v_available, v_soon
    from public.academy_apps;

  raise notice 'FC9 go-live: corrosion available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
    v_lessons, v_questions, v_capstones, 18, v_available, v_soon;
end $$;
