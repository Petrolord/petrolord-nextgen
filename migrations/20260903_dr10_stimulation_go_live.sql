-- ============================================================================
-- DR10 GO-LIVE (HELD): Stimulation Design flips to 'available'.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/stimulation.
--
-- Every assertion below is written from the ENGINE's output rather than from
-- the intuition the capstone prompts were drafted with. This course paid for
-- that rule three separate times: a matrix ceiling drafted with the frac
-- fluid's viscosity, a pad-fraction error asserted as monotonic when it peaks
-- in the middle, and a radius sensitivity asserted as always weaker than the
-- contrast when close to the wellbore it is stronger. All three were caught by
-- running the engine and none by reading the draft.
-- ============================================================================

do $$
declare
  c_in       constant numeric := 0.0254;
  c_e_pa     constant numeric := 32000000000;  -- the capstone Young modulus
  c_nu       constant numeric := 0.22;
  c_kOverKs  constant numeric := 8;            -- the capstone damage contrast
  c_rs       constant numeric := 1.2;          -- and its damaged radius
  c_ra       constant numeric := 0.8;          -- the acid front the plan targets
  c_cfd_opt  constant numeric := 1.6;          -- the engine's published optimum
  v_structures integer;
  v_capstones  integer;
  v_questions  integer;
  v_graded     integer;
  v_rw         numeric;
  v_hawk   numeric; v_svol  numeric; v_safter numeric;
  v_rwh    numeric; v_cskin numeric; v_qmax   numeric;
  v_eprime numeric; v_pknw  numeric; v_pknp   numeric;
  v_kgdw   numeric; v_eta   numeric; v_ti     numeric;
  v_pad    numeric; v_mass  numeric; v_wp     numeric;
  v_cfd    numeric; v_sf    numeric; v_rwp    numeric;
begin
  v_rw := 4.875 * c_in;

  -- ---------------------------------------------------------------- shape --
  select count(*) into v_structures
    from public.academy_course_structures where app_slug = 'stimulation' and active;
  if v_structures <> 3 then
    raise exception 'DR10 go-live refused: stimulation has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions
    from public.academy_quiz_questions where app_slug = 'stimulation';
  if v_questions <> 396 then
    raise exception 'DR10 go-live refused: stimulation has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_capstones
    from public.academy_capstones where app_slug = 'stimulation';
  if v_capstones <> 3 then
    raise exception 'DR10 go-live refused: stimulation has % capstones, expected 3', v_capstones;
  end if;

  -- ------------------------------------------------- the scope assertion --
  -- This engine computes geometry, a material balance and two skins. It
  -- computes an INJECTION rate ceiling, which is a real output and is graded.
  -- It computes no PRODUCTION rate, no recovery and no forecast, because it
  -- has no reservoir model and no time. A course that TEACHES a topic says it
  -- is worth knowing about; one that GRADES it says the learner can produce
  -- the answer AND that the answer is worth certifying.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'stimulation'
     and (f->>'label' ilike '%production%' or f->>'label' ilike '%recovery%'
       or f->>'label' ilike '%forecast%'   or f->>'label' ilike '%cumulative%'
       or f->>'unit'  ilike '%bbl%'        or f->>'unit' ilike '%stb%');
  if v_graded <> 0 then
    raise exception 'DR10 go-live refused: % capstone field(s) grade a production quantity this engine cannot produce', v_graded;
  end if;

  -- --------------------------------------- the published-golden assertion --
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'stimulation'
     and (abs((f->>'expected')::numeric - 27126736111.11111) < 500          -- published plane strain modulus
       or abs((f->>'expected')::numeric - 0.004015982) < 0.0000000005       -- published PKN average width
       or abs((f->>'expected')::numeric - 0.010463769) < 0.0000000005       -- published KGD average width
       or abs((f->>'expected')::numeric - 2889735.994440003) < 500          -- published PKN net pressure
       or abs((f->>'expected')::numeric - 0.172856672) < 0.0000005          -- published efficiency
       or abs((f->>'expected')::numeric - 3945.229168066) < 0.00005         -- published pump time
       or abs((f->>'expected')::numeric - 0.7052381992848291) < 0.0000005   -- published pad fraction
       or abs((f->>'expected')::numeric - 0.001511543) < 0.0000000005       -- published propped width
       or abs((f->>'expected')::numeric - 0.664984781) < 0.0000005          -- published dimensionless conductivity
       or abs((f->>'expected')::numeric - 5.311638066) < 0.0000005          -- published pseudo-skin magnitude
       or abs((f->>'expected')::numeric - 21.889652015) < 0.00000005        -- published effective wellbore radius
       or abs((f->>'expected')::numeric - 8.481054145) < 0.0000005          -- published Hawkins skin
       or abs((f->>'expected')::numeric - 29.546905102) < 0.0000005         -- published sandstone volume
       or abs((f->>'expected')::numeric - 1.621860432) < 0.0000005          -- published residual skin
       or abs((f->>'expected')::numeric - 0.391324751) < 0.00000005         -- published wormhole radius
       or abs((f->>'expected')::numeric - 1.287406553) < 0.0000005          -- published carbonate skin magnitude
       or abs((f->>'expected')::numeric - 0.000544181) < 0.00000000005);    -- published matrix ceiling
  if v_graded <> 0 then
    raise exception 'DR10 go-live refused: % graded field(s) sit within tolerance of a value the goldens publish, which makes them a lookup rather than a calculation', v_graded;
  end if;

  -- ------------------------------------------------------- load the values --
  select (f->>'expected')::numeric into v_hawk   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='stimulation' and f->>'key'='hawkins_s_before';
  select (f->>'expected')::numeric into v_svol   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='stimulation' and f->>'key'='sandstone_volume_m3';
  select (f->>'expected')::numeric into v_safter from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='stimulation' and f->>'key'='sandstone_s_after';
  select (f->>'expected')::numeric into v_rwh    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='stimulation' and f->>'key'='carbonate_rwh_m';
  select (f->>'expected')::numeric into v_cskin  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='stimulation' and f->>'key'='carbonate_skin';
  select (f->>'expected')::numeric into v_qmax   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='stimulation' and f->>'key'='q_max_matrix_m3s';
  select (f->>'expected')::numeric into v_eprime from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='stimulation' and f->>'key'='e_prime_pa';
  select (f->>'expected')::numeric into v_pknw   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='stimulation' and f->>'key'='pkn_w_avg_m';
  select (f->>'expected')::numeric into v_pknp   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='stimulation' and f->>'key'='pkn_p_net_pa';
  select (f->>'expected')::numeric into v_kgdw   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='stimulation' and f->>'key'='kgd_w_avg_m';
  select (f->>'expected')::numeric into v_eta    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='stimulation' and f->>'key'='eta_frac';
  select (f->>'expected')::numeric into v_ti     from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='stimulation' and f->>'key'='ti_s';
  select (f->>'expected')::numeric into v_pad    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='stimulation' and f->>'key'='pad_frac';
  select (f->>'expected')::numeric into v_mass   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='stimulation' and f->>'key'='prop_mass_kg';
  select (f->>'expected')::numeric into v_wp     from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='stimulation' and f->>'key'='wp_m';
  select (f->>'expected')::numeric into v_cfd    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='stimulation' and f->>'key'='cfd';
  select (f->>'expected')::numeric into v_sf     from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='stimulation' and f->>'key'='s_f';
  select (f->>'expected')::numeric into v_rwp    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='stimulation' and f->>'key'='rw_prime_m';

  if v_hawk is null or v_svol is null or v_safter is null or v_rwh is null
     or v_cskin is null or v_qmax is null or v_eprime is null or v_pknw is null
     or v_pknp is null or v_kgdw is null or v_eta is null or v_ti is null
     or v_pad is null or v_mass is null or v_wp is null or v_cfd is null
     or v_sf is null or v_rwp is null then
    raise exception 'DR10 go-live refused: one or more of the eighteen graded fields is missing';
  end if;

  -- ------------------------------------------ Associate: damage and acid ---
  -- The Hawkins closed form, at the capstone's own contrast and radii.
  if abs(v_hawk - (c_kOverKs - 1) * ln(c_rs / v_rw)) > 0.0000005 then
    raise exception 'DR10 go-live refused: the Hawkins skin of % is not the contrast less one times the logarithm of the radius ratio', v_hawk;
  end if;

  -- A PAIR OF WHICH ONE MUST HOLD AND THE OTHER MUST NOT. The acid front stops
  -- at 0.8 m against damage reaching 1.2, so the job does NOT clear the
  -- damage and a residual survives. Asserting only that the residual is
  -- smaller than the original would pass on a job that removed everything,
  -- which is exactly the case the Associate tier's m03 l04 exists to teach
  -- against. Asserting that it is NOT zero is what catches that.
  if v_safter <= 0 then
    raise exception 'DR10 go-live refused: the residual skin of % is not positive, so the capstone acid job now clears the damage and the tier loses its worked near miss', v_safter;
  end if;
  if v_safter >= v_hawk then
    raise exception 'DR10 go-live refused: the residual skin of % is not below the original of %', v_safter, v_hawk;
  end if;
  if c_ra >= c_rs then
    raise exception 'DR10 go-live refused: the acid front at % m no longer stops short of the damage at % m', c_ra, c_rs;
  end if;

  if v_cskin >= 0 then
    raise exception 'DR10 go-live refused: the carbonate skin of % is not negative, so the wormhole no longer enlarges the wellbore', v_cskin;
  end if;
  if v_rwh <= v_rw then
    raise exception 'DR10 go-live refused: the wormhole radius of % does not exceed the wellbore radius of %', v_rwh, v_rw;
  end if;
  -- and the carbonate skin is exactly the negative logarithm of that ratio
  if abs(v_cskin + ln(v_rwh / v_rw)) > 0.0000005 then
    raise exception 'DR10 go-live refused: the carbonate skin of % is not the negative logarithm of the wormhole radius ratio', v_cskin;
  end if;

  -- THE VISCOSITY GUARD. The matrix ceiling takes the ACID's viscosity, near
  -- 1e-3 Pa.s. A first draft of this capstone passed the fracturing fluid's
  -- 0.15 Pa.s and produced 6.4e-7, which is a hundred and fifty times too
  -- small and would tell a learner that a routine job cannot be pumped. This
  -- floor is set well above that wrong answer and well below the right one.
  if v_qmax <= 0.00001 then
    raise exception 'DR10 go-live refused: the matrix ceiling of % is below the floor a correct ACID viscosity gives, which is the signature of the fracturing fluid having been used instead', v_qmax;
  end if;

  -- ------------------------------------ Professional: geometry and balance --
  if abs(v_eprime - c_e_pa / (1 - c_nu * c_nu)) > 500 then
    raise exception 'DR10 go-live refused: the plane strain modulus of % is not E over one minus nu squared', v_eprime;
  end if;
  -- and it must NOT be E itself, which is the error the module exists to stop
  if abs(v_eprime - c_e_pa) < 500 then
    raise exception 'DR10 go-live refused: the plane strain modulus equals the Young modulus, so the confinement correction has been dropped';
  end if;

  if v_kgdw <= v_pknw then
    raise exception 'DR10 go-live refused: the KGD width of % does not exceed the PKN width of %, so the capstone no longer demonstrates the model disagreement', v_kgdw, v_pknw;
  end if;
  if v_kgdw / v_pknw < 1.5 then
    raise exception 'DR10 go-live refused: the KGD to PKN width ratio of % is too small to make the point', v_kgdw / v_pknw;
  end if;

  if v_eta <= 0 or v_eta >= 1 then
    raise exception 'DR10 go-live refused: the fluid efficiency of % is not strictly between zero and one', v_eta;
  end if;
  if v_pknp <= 0 or v_ti <= 0 then
    raise exception 'DR10 go-live refused: the net pressure % or the pump time % is not positive', v_pknp, v_ti;
  end if;

  -- ------------------------------------------------ Expert: pad and pack ---
  -- THE PAD FRACTION PAIR, ONE OF WHICH MUST CLOSE AND THE OTHER MUST NOT.
  -- The correct form is (1-eta)/(1+eta). Asserting only that would pass on an
  -- engine that had quietly reverted to 1-eta at some efficiency where the two
  -- happen to be close. Asserting that it does NOT equal 1-eta is what catches
  -- the reversion, and it is the single most valuable guard in this course.
  if abs(v_pad - (1 - v_eta) / (1 + v_eta)) > 0.0000005 then
    raise exception 'DR10 go-live refused: the pad fraction of % is not one minus the efficiency over one plus it', v_pad;
  end if;
  if abs(v_pad - (1 - v_eta)) < 0.0000005 then
    raise exception 'DR10 go-live refused: the pad fraction equals one minus the efficiency, which is the naive form the Expert tier exists to correct';
  end if;
  if v_pad >= 1 - v_eta then
    raise exception 'DR10 go-live refused: the pad fraction of % is not below one minus the efficiency of %', v_pad, 1 - v_eta;
  end if;

  if v_wp >= v_pknw then
    raise exception 'DR10 go-live refused: the propped width of % is not below the created width of %', v_wp, v_pknw;
  end if;
  if v_mass <= 0 then
    raise exception 'DR10 go-live refused: the placed proppant mass of % is not positive', v_mass;
  end if;

  -- THE OPTIMUM PAIR. The published job in the lessons sits BELOW 1.6 and is
  -- conductivity-starved. The capstone deliberately sits ABOVE it and is
  -- length-starved, so a learner has to diagnose the OPPOSITE case from the
  -- one every lesson worked. If an edit moved the capstone below the optimum,
  -- the two would agree and the Expert tier would stop testing the diagnosis.
  if v_cfd <= c_cfd_opt then
    raise exception 'DR10 go-live refused: the capstone dimensionless conductivity of % does not exceed the unified optimum of %, so it no longer poses the opposite case from the published job', v_cfd, c_cfd_opt;
  end if;

  if v_sf >= 0 then
    raise exception 'DR10 go-live refused: the fracture pseudo-skin of % is not negative', v_sf;
  end if;
  -- the effective radius IS the pseudo-skin put back through its definition
  if abs(v_rwp - v_rw * exp(-v_sf)) > 0.00000005 then
    raise exception 'DR10 go-live refused: the effective wellbore radius of % is not the drilled radius times the exponential of the negated pseudo-skin', v_rwp;
  end if;
  if v_rwp / v_rw < 100 then
    raise exception 'DR10 go-live refused: the effective wellbore radius is only % times the drilled one, so the capstone fracture is no longer a serious stimulation', v_rwp / v_rw;
  end if;

  -- ------------------------------------------------------------ the flip --
  update public.academy_apps
     set status = 'available'
   where slug = 'stimulation' and status = 'coming_soon';

  if not exists (select 1 from public.academy_apps where slug = 'stimulation' and status = 'available') then
    raise exception 'DR10 go-live refused: stimulation did not reach status available';
  end if;

  raise notice 'DR10 go-live: stimulation is available. 3 structures, 396 questions, 3 capstones, 18 graded fields, all assertions passed.';
end $$;
