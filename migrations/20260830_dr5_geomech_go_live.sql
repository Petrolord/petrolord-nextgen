-- ============================================================================
-- DR5 GO LIVE (HELD): make Geomechanics and Wellbore Stability enrollable.
--
-- DO NOT APPLY until a NextGen production upload carries the
-- GeomechLearningPage route (/dashboard/apps/geomech) and the deep course
-- routes. RC1 through RC7 and DR1 through DR4 are held on the SAME gate.
--
-- Precondition checklist:
--   1. nextgen.petrolord.com serves a build containing /dashboard/apps/geomech.
--   2. academy_course_structures has three active geomech rows.
--   3. academy_quiz_questions holds 396 geomech rows (132 per tier).
--   4. academy_capstones holds the three geomech rows.
-- ============================================================================

do $$
declare
  v_structures integer;
  v_capstones  integer;
  v_questions  integer;
  v_graded     integer;
  v_c          numeric;
  v_f          numeric;
  v_w          numeric;
  v_sc         numeric;
  v_sf         numeric;
  v_sw         numeric;
begin
  select count(*) into v_structures
    from public.academy_course_structures where app_slug = 'geomech' and active;
  if v_structures <> 3 then
    raise exception 'DR5 go-live refused: geomech has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions
    from public.academy_quiz_questions where app_slug = 'geomech';
  if v_questions <> 396 then
    raise exception 'DR5 go-live refused: geomech has % quiz questions, expected 396 (132 per tier)', v_questions;
  end if;

  select count(*) into v_capstones
    from public.academy_capstones where app_slug = 'geomech';
  if v_capstones <> 3 then
    raise exception 'DR5 go-live refused: geomech has % capstones, expected 3', v_capstones;
  end if;

  -- THE SCOPE ASSERTION. Five things are taught in Expert m05 and certified
  -- nowhere: inelastic and anisotropic rock behaviour, time-dependent effects,
  -- chemical effects, thermal stress, and natural fractures and bedding. A
  -- course that teaches a topic implies it is worth learning; one that GRADES
  -- it implies the learner can produce the answer and that the answer is worth
  -- producing. This migration keeps those two claims apart.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'geomech'
     and (f->>'key' ilike '%anisotrop%'
       or f->>'key' ilike '%plastic%'
       or f->>'key' ilike '%inelastic%'
       or f->>'key' ilike '%creep%'
       or f->>'key' ilike '%time%'
       or f->>'key' ilike '%hours%'
       or f->>'key' ilike '%diffus%'
       or f->>'key' ilike '%chemi%'
       or f->>'key' ilike '%activity%'
       or f->>'key' ilike '%swell%'
       or f->>'key' ilike '%thermal%'
       or f->>'key' ilike '%temperature%'
       or f->>'key' ilike '%cooling%'
       or f->>'key' ilike '%fracture_network%'
       or f->>'key' ilike '%natural_frac%'
       or f->>'key' ilike '%bedding%');
  if v_graded <> 0 then
    raise exception 'DR5 go-live refused: % capstone field(s) grade a quantity this linear-elastic isothermal continuum engine cannot produce; Expert m05 teaches those five and certifies none of them', v_graded;
  end if;

  -- THE PUBLISHED-GOLDEN ASSERTION. This is the check DR4 earned. The pairwise
  -- collision test catches two graded fields colliding with EACH OTHER; it
  -- does NOT catch a graded field colliding with a value the GOLDENS PUBLISH,
  -- which would make it a lookup rather than a calculation. Three of this
  -- course's most quotable published values are checked by name here, and the
  -- full 1165-value sweep is asserted in geomechLab.test.js.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'geomech'
     and (abs((f->>'expected')::numeric - 1041.4600436889584) < 0.005   -- published slant tightest width
       or abs((f->>'expected')::numeric - 1364.1863204876872) < 0.005   -- published horizontal tightest width
       or abs((f->>'expected')::numeric - 0.38888888888888895) < 0.0000005 -- published k0
       or abs((f->>'expected')::numeric - 3.254588303299863) < 0.0000005); -- published q
  if v_graded <> 0 then
    raise exception 'DR5 go-live refused: % graded field(s) sit within tolerance of a value the goldens publish, which makes them a lookup rather than a calculation', v_graded;
  end if;

  -- THE WINDOW SUM ASSERTION, TWICE, AND ONE OF THEM MUST FAIL. On the
  -- COLLAPSE-bound well the collapse gradient IS the lower bound, so the
  -- collapse field plus the width must equal the fracture field exactly. On
  -- the PORE-PRESSURE-bound well it must NOT, because the width is measured
  -- from the pore pressure instead. If both closed, the lower bound would have
  -- become the collapse gradient on both wells and the whole of Expert m02
  -- would be wrong.
  select (f->>'expected')::numeric into v_c from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='geomech' and f->>'key'='horizontal_collapse_emw_at_tightest_kgm3';
  select (f->>'expected')::numeric into v_f from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='geomech' and f->>'key'='horizontal_frac_init_emw_at_tightest_kgm3';
  select (f->>'expected')::numeric into v_w from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='geomech' and f->>'key'='horizontal_tightest_width_kgm3';
  select (f->>'expected')::numeric into v_sc from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='geomech' and f->>'key'='slant_collapse_emw_at_tightest_kgm3';
  select (f->>'expected')::numeric into v_sf from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='geomech' and f->>'key'='slant_frac_init_emw_at_tightest_kgm3';
  select (f->>'expected')::numeric into v_sw from public.academy_capstones c,
    lateral jsonb_array_elements(c.fields) f where c.app_slug='geomech' and f->>'key'='slant_tightest_width_kgm3';
  if v_c is null or v_f is null or v_w is null or v_sc is null or v_sf is null or v_sw is null then
    raise exception 'DR5 go-live refused: one or more of the six Expert window fields is missing';
  end if;
  if abs((v_c + v_w) - v_f) > 0.01 then
    raise exception 'DR5 go-live refused: on the collapse-bound well the collapse gradient plus the width is % against a fracture gradient of %, so the lower bound there is no longer the collapse gradient', v_c + v_w, v_f;
  end if;
  if abs((v_sc + v_sw) - v_sf) < 900 then
    raise exception 'DR5 go-live refused: on the slant well the collapse gradient plus the width comes within 900 of the fracture gradient, which means the lower bound there has become the collapse gradient rather than the pore pressure';
  end if;

  -- THE CAPSTONE-CONDITIONS ASSERTION. Two witnesses, one at each end of the
  -- course. k0 must be the capstone Poisson ratio's value and not the
  -- published one, and the frictional limit ratio must be BELOW the published
  -- 3.254588303299863 because the capstone friction angle is lower.
  if not exists (
    select 1 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug='geomech' and f->>'key'='k0_used'
       and abs((f->>'expected')::numeric - 0.3157894736842105) < 0.0000001
  ) then
    raise exception 'DR5 go-live refused: the k0 field is missing or is not the capstone Poisson ratio''s value';
  end if;
  if not exists (
    select 1 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug='geomech' and f->>'key'='frictional_limit_ratio'
       and (f->>'expected')::numeric < 3.254588303299863
  ) then
    raise exception 'DR5 go-live refused: the frictional limit ratio is not below the published value, so the capstone friction angle has drifted back onto the lessons'' own';
  end if;

  -- THE STRESS ORDERING ASSERTION. SHmax must exceed Shmin at the graded
  -- depth, and the difference is entirely tectonic. If a later edit swapped the
  -- two strain terms, the two fields swap and this catches it.
  if not exists (
    select 1
      from public.academy_capstones c,
           lateral jsonb_array_elements(c.fields) f1,
           lateral jsonb_array_elements(c.fields) f2
     where c.app_slug='geomech'
       and f1->>'key'='shmax_at_2000m_Pa' and f2->>'key'='shmin_at_2000m_Pa'
       and (f1->>'expected')::numeric > (f2->>'expected')::numeric
  ) then
    raise exception 'DR5 go-live refused: SHmax does not exceed Shmin at the graded depth, so the two tectonic strain terms have been swapped';
  end if;

  -- THE UCS CROSSING ASSERTION. At 233 microseconds per metre the profile sits
  -- BETWEEN the two correlation crossings, where McNally reads HIGHER than
  -- Horsrud. That is the whole point of Associate m04, and it inverts if the
  -- microseconds-per-foot conversion in McNally is lost.
  if not exists (
    select 1
      from public.academy_capstones c,
           lateral jsonb_array_elements(c.fields) f1,
           lateral jsonb_array_elements(c.fields) f2
     where c.app_slug='geomech'
       and f1->>'key'='ucs_mcnally_Pa' and f2->>'key'='ucs_horsrud_Pa'
       and (f1->>'expected')::numeric > (f2->>'expected')::numeric
  ) then
    raise exception 'DR5 go-live refused: the McNally UCS does not exceed the Horsrud one at 233 microseconds per metre, which is between the two crossings; the unit conversion has probably been lost';
  end if;

  -- THE UNITS ASSERTION. Four graded quantities have a plausible wrong unit a
  -- factor of a million away: the pressures are in PASCALS, not megapascals.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug='geomech' and f->>'key' in
     ('shmin_at_2000m_Pa','shmax_at_2000m_Pa','ucs_horsrud_Pa','ucs_mcnally_Pa','collapse_Pa','frac_init_Pa')
     and f->>'unit' = 'Pa';
  if v_graded <> 6 then
    raise exception 'DR5 go-live refused: % of the 6 pressure fields are graded in pascals', v_graded;
  end if;

  -- TIER SEPARATION.
  select count(*) into v_graded from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug='geomech' and c.tier='beginner'
     and f->>'key' in ('k0_used','shmin_at_2000m_Pa','ucs_mcnally_Pa');
  if v_graded <> 3 then
    raise exception 'DR5 go-live refused: the Associate capstone grades % of its 3 earth-model fields', v_graded;
  end if;
  select count(*) into v_graded from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug='geomech' and c.tier='intermediate'
     and f->>'key' in ('collapse_Pa','breakout_theta_deg','window_width_emw_kgm3');
  if v_graded <> 3 then
    raise exception 'DR5 go-live refused: the Professional capstone grades % of its 3 point-stability fields', v_graded;
  end if;
  select count(*) into v_graded from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug='geomech' and c.tier='advanced'
     and f->>'key' in ('slant_tightest_width_kgm3','horizontal_tightest_width_kgm3','horizontal_collapse_emw_at_tightest_kgm3');
  if v_graded <> 3 then
    raise exception 'DR5 go-live refused: the Expert capstone grades % of its 3 trajectory-walk fields', v_graded;
  end if;

  if not exists (select 1 from public.academy_apps where slug='geomech' and module='drilling') then
    raise exception 'DR5 go-live refused: geomech catalog row is missing or not mapped to the drilling module';
  end if;
end
$$;

update public.academy_apps set status = 'available' where slug = 'geomech';
