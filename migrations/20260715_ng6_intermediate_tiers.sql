-- NG6 — Intermediate tiers (Professional certification) across all six
-- geoscience courses (NextGen-Geoscience-Courses-PLAN §2).
--
-- Two spine integrity fixes land FIRST — the Intermediate tier exposes
-- gaps that were unreachable while only Beginner capstones existed:
--
-- 1. TIER-FEE INTEGRITY: academy_submit_capstone only required
--    app-level Learning scope, which any tier's enrollment grants — a
--    Beginner enrollee could have submitted the Intermediate capstone
--    and collected a Professional certificate without paying the
--    intermediate fee. The grader now also requires an ACTIVE
--    enrollment at the exact (app, tier) being graded.
--
-- 2. LADDER PROGRESSION (doctrine: the three tiers ARE the
--    Associate→Professional→Expert ladder): enrolling in intermediate
--    now requires a non-revoked Associate certification on that app;
--    advanced requires Professional. Expiry does not block (progression
--    was proven once; re-certification re-enters lower tiers freely),
--    revocation does. Enforced in the same BEFORE INSERT trigger as the
--    NG1 app prerequisite — one server-side point, all four doors.
--    NOTE the ordering: the tier check runs BEFORE the app-prereq
--    grandfather clause, so holding a Beginner enrollment on the app
--    does not bypass tier progression.
--
-- Then the six intermediate capstones (cert_tier = professional). Every
-- oracle was reproduced from @petrolord/engines in Node before this
-- migration was written (see the NG6 pentest doc). Highlights of the
-- oracle's internal consistency: the Pickett fit recovers a·Rw = 0.05
-- and m = 2.0 — the typewell's own synthesis parameters — and the two
-- ReservoirCalc fault-block STOIIPs sum exactly to the NG5 total
-- (9.8556 + 2.2836 = 12.1392 MMstb).

-- ------------------------------------------------- 1. tier-fee integrity

create or replace function public.academy_submit_capstone(
    p_app     text,
    p_tier    text,
    p_answers jsonb)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_uid     uuid := auth.uid();
  v_cap     public.academy_capstones;
  v_field   jsonb;
  v_key     text;
  v_exp     numeric;
  v_tol     numeric;
  v_got     numeric;
  v_total   integer := 0;
  v_pass    integer := 0;
  v_missed  text[] := '{}';
  v_passed  boolean;
  v_cert    public.academy_certifications;
  v_existing boolean;
begin
  if v_uid is null then raise exception 'authentication required'; end if;

  -- Learning Mode required (activated + enrolled → learning scope).
  if not public.academy_has_scope(p_app, 'learning') then
    raise exception 'enroll and activate Learning Mode before attempting the capstone';
  end if;

  -- NG6: the graded tier must be the tier the learner is enrolled in —
  -- an active enrollment at exactly (app, tier). Fee integrity: each
  -- tier is a separately priced course.
  if not exists (select 1 from public.academy_enrollments
                  where user_id = v_uid and app_slug = p_app
                    and course_tier = p_tier and status = 'active') then
    raise exception 'an active % enrollment in this course is required for this capstone', p_tier;
  end if;

  select * into v_cap from public.academy_capstones
   where app_slug = p_app and tier = p_tier and active;
  if v_cap.app_slug is null then
    raise exception 'no capstone for % (%)', p_app, p_tier;
  end if;

  for v_field in select * from jsonb_array_elements(v_cap.fields) loop
    v_total := v_total + 1;
    v_key := v_field->>'key';
    v_exp := (v_field->>'expected')::numeric;
    v_tol := (v_field->>'tol')::numeric;
    begin
      v_got := (p_answers->>v_key)::numeric;
    exception when others then
      v_got := null;
    end;
    if v_got is not null and abs(v_got - v_exp) <= v_tol then
      v_pass := v_pass + 1;
    else
      v_missed := array_append(v_missed, v_key);
    end if;
  end loop;

  v_passed := (v_pass = v_total);

  insert into public.academy_capstone_attempts
      (user_id, app_slug, tier, score, max_score, passed, answers)
  values (v_uid, p_app, p_tier, v_pass, v_total, v_passed, p_answers);

  if not v_passed then
    return jsonb_build_object('passed', false, 'score', v_pass,
      'max_score', v_total, 'missed', to_jsonb(v_missed));
  end if;

  select exists (select 1 from public.academy_certifications
                  where user_id = v_uid and app_slug = p_app
                    and tier = v_cap.cert_tier
                    and revoked_at is null and now() < valid_until)
    into v_existing;

  if v_existing then
    return jsonb_build_object('passed', true, 'score', v_pass,
      'max_score', v_total, 'already_certified', true);
  end if;

  insert into public.academy_certifications
      (user_id, course_id, app_slug, tier)
  values (v_uid, public.academy_course_for_app(p_app), p_app, v_cap.cert_tier)
  returning * into v_cert;

  return jsonb_build_object('passed', true, 'score', v_pass,
    'max_score', v_total,
    'certificate_number', v_cert.certificate_number,
    'verify_code', v_cert.verify_code,
    'tier', v_cert.tier,
    'valid_until', v_cert.valid_until);
end $$;

-- ------------------------------------------------ 2. ladder progression

create or replace function public.academy_enforce_prereq()
returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v_prereq text;
  v_name   text;
  v_need   text;
begin
  -- Tier progression FIRST (never bypassed by same-app grandfathering):
  -- intermediate needs Associate, advanced needs Professional — a
  -- non-revoked certification on the same app (expiry does not block,
  -- revocation does).
  v_need := case new.course_tier
              when 'intermediate' then 'associate'
              when 'advanced' then 'professional'
              else null end;
  if v_need is not null and not exists (
       select 1 from public.academy_certifications
        where user_id = new.user_id and app_slug = new.app_slug
          and tier = v_need and revoked_at is null) then
    raise exception 'ladder progression: a % certification on this course is required before enrolling in the % tier',
      v_need, new.course_tier;
  end if;

  -- App prerequisite (NG1: the well-registry root).
  select prereq_slug into v_prereq from public.academy_apps
   where slug = new.app_slug;
  if v_prereq is null then
    return new;
  end if;

  if exists (select 1 from public.academy_enrollments
              where user_id = new.user_id and app_slug = new.app_slug) then
    return new;
  end if;
  if exists (select 1 from public.academy_certifications
              where user_id = new.user_id and app_slug = new.app_slug
                and revoked_at is null and now() < valid_until) then
    return new;
  end if;

  if not exists (select 1 from public.academy_certifications
                  where user_id = new.user_id and app_slug = v_prereq
                    and revoked_at is null and now() < valid_until) then
    select name into v_name from public.academy_apps where slug = v_prereq;
    raise exception 'prerequisite not met: certify % (Associate) before enrolling in this course',
      coalesce(v_name, v_prereq);
  end if;
  return new;
end $$;

-- ------------------------------------------- 3. the six capstones

insert into public.academy_capstones
    (app_slug, tier, cert_tier, dataset, title, prompt, fields)
values
(
  'petrophysics', 'intermediate', 'professional',
  'petrophysics/typewell',
  'Advanced interpretation of the typewell',
  'Using the typewell parameters as given: compute neutron-density (average) and Wyllie sonic porosity, fit a Pickett line in the water leg (2075–2078 m), and evaluate Simandoux and Indonesia water saturation with linear Vsh. Report the SAND_A (2010–2030 m) zone means and the Pickett fit.',
  jsonb_build_array(
    jsonb_build_object('key','phind_avg_sand_a','label','SAND_A mean neutron-density porosity','unit','v/v','expected',0.17615030026601647,'tol',0.005),
    jsonb_build_object('key','phiw_avg_sand_a', 'label','SAND_A mean Wyllie sonic porosity',  'unit','v/v','expected',0.2069057569286416, 'tol',0.005),
    jsonb_build_object('key','pickett_a_rw',    'label','Pickett fit: a·Rw',                  'unit','Ω·m','expected',0.05,               'tol',0.002),
    jsonb_build_object('key','pickett_m',       'label','Pickett fit: cementation exponent m','unit','-',  'expected',2.0,                'tol',0.02),
    jsonb_build_object('key','sw_sim_sand_a',   'label','SAND_A mean Sw (Simandoux)',         'unit','v/v','expected',0.43350268917150697,'tol',0.01),
    jsonb_build_object('key','sw_ind_sand_a',   'label','SAND_A mean Sw (Indonesia)',         'unit','v/v','expected',0.4280109754526606, 'tol',0.01)
  )
),
(
  'welldata', 'intermediate', 'professional',
  'wells/las (SI import)',
  'SI import of the feet-denominated well',
  'Run the full import pipeline on feet_20.las and read the import panel: the depth range and step converted to metres, how many curves needed unit conversion, how many curve kinds the importer recognised, and whether irregular_20 has a uniform depth step.',
  jsonb_build_array(
    jsonb_build_object('key','start_md_m',      'label','feet_20: start depth (converted)','unit','m',    'expected',1493.52001953125,'tol',0.01),
    jsonb_build_object('key','stop_md_m',       'label','feet_20: stop depth (converted)', 'unit','m',    'expected',1584.9599609375, 'tol',0.01),
    jsonb_build_object('key','step_m',          'label','feet_20: depth step (converted)', 'unit','m',    'expected',0.609619140625,  'tol',0.001),
    jsonb_build_object('key','converted_curves','label','feet_20: curves unit-converted',  'unit','count','expected',2,               'tol',0),
    jsonb_build_object('key','recognized_kinds','label','feet_20: curve kinds recognised', 'unit','count','expected',4,               'tol',0),
    jsonb_build_object('key','irregular_uniform','label','irregular_20 has a uniform step (1 yes / 0 no)','unit','-','expected',0,    'tol',0)
  )
),
(
  'wellcorrelation', 'intermediate', 'professional',
  'correlation/ekene-section',
  'Growth analysis of the Ekene section',
  'Flatten the section on TOP_A at a 1450 m datum and study the A-to-SAND interval: report the Ekene-4 shift, the displayed TOP_SAND in Ekene-2, the interval thickness in Ekene-4, the growth range across the section, the number of wells carrying all four tops, and the displayed depth span of the section.',
  jsonb_build_array(
    jsonb_build_object('key','w4_shift_m',            'label','Ekene-4: flattening shift',          'unit','m',    'expected',-80, 'tol',0.01),
    jsonb_build_object('key','w2_topsand_displayed_m','label','Ekene-2: TOP_SAND displayed depth',  'unit','m',    'expected',1503,'tol',0.01),
    jsonb_build_object('key','a_to_sand_w4_m',        'label','Ekene-4: TOP_A→TOP_SAND interval',   'unit','m',    'expected',60,  'tol',0.01),
    jsonb_build_object('key','growth_range_m',        'label','A-to-SAND growth range (max − min)', 'unit','m',    'expected',14,  'tol',0.01),
    jsonb_build_object('key','wells_with_all_tops',   'label','Wells carrying all four tops',       'unit','count','expected',3,   'tol',0),
    jsonb_build_object('key','displayed_span_m',      'label','Displayed depth span of the section','unit','m',    'expected',150, 'tol',0.01)
  )
),
(
  'seismolord', 'intermediate', 'professional',
  'wells/las/basic_20 + bulk shift',
  'Bulk shift and tuning on the basic_20 tie',
  'The observed seismic trace is the 25 Hz synthetic arriving 8 ms late. Run the bulk-shift scan and read the panel: the suggested shift and its correlation. Then flip the wavelet between 15 and 40 Hz and report the strongest synthetic amplitude and its time at each frequency — tuning moves both.',
  jsonb_build_array(
    jsonb_build_object('key','bulk_shift_ms','label','Suggested bulk shift',                    'unit','ms','expected',8,                  'tol',0.5),
    jsonb_build_object('key','corr',         'label','Correlation at the suggested shift',      'unit','-', 'expected',1,                  'tol',0.01),
    jsonb_build_object('key','peak15_abs',   'label','Strongest synthetic amplitude at 15 Hz',  'unit','-', 'expected',0.1573149710893631, 'tol',0.002),
    jsonb_build_object('key','peak40_abs',   'label','Strongest synthetic amplitude at 40 Hz',  'unit','-', 'expected',0.0362229160964489, 'tol',0.001),
    jsonb_build_object('key','peak15_twt',   'label','TWT of the 15 Hz peak',                   'unit','ms','expected',1580,               'tol',2),
    jsonb_build_object('key','peak40_twt',   'label','TWT of the 40 Hz peak',                   'unit','ms','expected',1646,               'tol',2)
  )
),
(
  'mapping', 'intermediate', 'professional',
  'mapping/ekene-isochore',
  'Isochore of the Ekene SAND',
  'Grid both SAND surfaces at the capstone settings and subtract them into an isochore. Read the panel: the thickness extremes and mean, the thickness at prospect P-1, the live node count, and the plain mean of the six well thicknesses for comparison.',
  jsonb_build_array(
    jsonb_build_object('key','iso_min_m',            'label','Isochore minimum thickness',      'unit','m',    'expected',25,                'tol',0.1),
    jsonb_build_object('key','iso_max_m',            'label','Isochore maximum thickness',      'unit','m',    'expected',35.897705078125,   'tol',0.1),
    jsonb_build_object('key','iso_mean_m',           'label','Isochore mean thickness',         'unit','m',    'expected',32.25429068038713, 'tol',0.1),
    jsonb_build_object('key','iso_at_p1_m',          'label','Thickness at prospect P-1',       'unit','m',    'expected',34.050048828125,   'tol',0.1),
    jsonb_build_object('key','iso_live',             'label','Live isochore nodes',             'unit','count','expected',201,               'tol',0),
    jsonb_build_object('key','mean_well_thickness_m','label','Mean of the six well thicknesses','unit','m',    'expected',31.166666666666668,'tol',0.05)
  )
),
(
  'reservoircalc', 'intermediate', 'professional',
  'reservoircalc/ekene-fault-blocks',
  'Fault-block volumes of the Ekene SAND',
  'A sealing fault at x = 1800 m splits the accumulation into a west and an east block. At the 1560 m contact, read the per-block panel: cell counts, gross rock volumes and STOIIP for each block. The two blocks must sum to the field total you booked at the Associate tier.',
  jsonb_build_array(
    jsonb_build_object('key','west_cells',       'label','West block: oil-bearing cells','unit','count',  'expected',117,               'tol',0),
    jsonb_build_object('key','east_cells',       'label','East block: oil-bearing cells','unit','count',  'expected',52,                'tol',0),
    jsonb_build_object('key','west_grv_mm3',     'label','West block: gross rock volume','unit','10^6 m3','expected',18.079852294921874,'tol',0.05),
    jsonb_build_object('key','east_grv_mm3',     'label','East block: gross rock volume','unit','10^6 m3','expected',4.189183349609375, 'tol',0.02),
    jsonb_build_object('key','west_stoiip_mmstb','label','West block: STOIIP',           'unit','MMstb',  'expected',9.85561714769438,  'tol',0.05),
    jsonb_build_object('key','east_stoiip_mmstb','label','East block: STOIIP',           'unit','MMstb',  'expected',2.2835909598023787,'tol',0.02)
  )
)
on conflict (app_slug, tier) do nothing;
