-- ============================================================================
-- LABEL LEAK RECUT: Seismolord, Associate tier.
--
-- WHAT LEAKED. The graded field twt_at_log_top_ms is labelled
--   "TWT at the top of the log (1500 m)"
-- and its graded answer is 1500 ms, tolerance 0.5. The teaching time-depth
-- function runs at 2000 m/s, so two-way time in milliseconds is numerically
-- the depth in metres, and the parenthetical that was meant to identify WHICH
-- depth prints the answer instead. academy_get_capstone serves every label to
-- the learner and the page draws it directly above the box the number is typed
-- into, so this field was answerable by reading its own caption.
--
-- WHY THE GATE NEVER SAW IT. Two reasons, both now fixed in the gate. It swept
-- prompts only, and 1500 is an integer below the small-integer band's limit, so
-- even once labels were swept it would have been excused as a coincidence. A
-- label matching its OWN field is never a coincidence.
--
-- THE RECUT. The parenthetical goes; the label becomes "TWT at the top of the
-- log". Nothing needed is lost: the prompt already says "the two-way time at
-- the top of the log under the teaching time-depth function", the panel prints
-- the log top, and the unit field still says ms. The learner must now read the
-- log top and apply the function rather than copy a caption.
--
-- The answer still equals the depth numerically, because the teaching velocity
-- makes it so. That degeneracy lives in the lessons, which state 1500 ms
-- outright, and is reported to the lesson-leak remediation rather than papered
-- over here.
-- ============================================================================

do $$
declare
  v_state   text;
  v_count   integer;
  v_updated integer := 0;
  v_keys    text;
  v_other   text;
begin
  select string_agg(c.tier || ':' || md5(c.prompt) || ':' || md5(coalesce(c.dataset,'')) || ':' || md5(c.fields::text), ',' order by c.tier)
    into v_other from public.academy_capstones c
   where c.app_slug = 'seismolord' and c.tier <> 'beginner';
  if v_other is null then
    raise exception 'labelleak recut seismolord/beginner refused: seismolord has no other tiers';
  end if;

  select case
           when prompt = 'Set the wavelet to 25 Hz and read the synthetic summary panel: report the mean sonic velocity, the two-way time at the top of the log under the teaching time-depth function, the maximum impedance, and the strongest reflection coefficient and synthetic amplitude with their two-way times.' and coalesce(dataset,'') = 'wells/las/basic_20 + ricker25' and fields = '[{"key": "mean_velocity_ms", "tol": 1, "unit": "m/s", "label": "Mean sonic velocity", "expected": 3145.2869374221345}, {"key": "twt_at_log_top_ms", "tol": 0.5, "unit": "ms", "label": "TWT at the top of the log (1500 m)", "expected": 1500}, {"key": "imp_max", "tol": 10, "unit": "(m/s)·(g/cc)", "label": "Maximum impedance", "expected": 10624.9560546875}, {"key": "rc_peak_abs", "tol": 0.0005, "unit": "-", "label": "Strongest reflection coefficient (abs)", "expected": 0.017688043415546417}, {"key": "rc_peak_twt_ms", "tol": 2, "unit": "ms", "label": "TWT of the strongest reflection", "expected": 1582}, {"key": "syn_peak_twt_ms", "tol": 2, "unit": "ms", "label": "TWT of the strongest synthetic amplitude (25 Hz)", "expected": 1642}]'::jsonb then 'old'
           when prompt = 'Set the wavelet to 25 Hz and read the synthetic summary panel: report the mean sonic velocity, the two-way time at the top of the log under the teaching time-depth function, the maximum impedance, and the strongest reflection coefficient and synthetic amplitude with their two-way times.' and coalesce(dataset,'') = 'wells/las/basic_20 + ricker25' and fields = '[{"key": "mean_velocity_ms", "tol": 1, "unit": "m/s", "label": "Mean sonic velocity", "expected": 3145.2869374221345}, {"key": "twt_at_log_top_ms", "tol": 0.5, "unit": "ms", "label": "TWT at the top of the log", "expected": 1500}, {"key": "imp_max", "tol": 10, "unit": "(m/s)\u00b7(g/cc)", "label": "Maximum impedance", "expected": 10624.9560546875}, {"key": "rc_peak_abs", "tol": 0.0005, "unit": "-", "label": "Strongest reflection coefficient (abs)", "expected": 0.017688043415546417}, {"key": "rc_peak_twt_ms", "tol": 2, "unit": "ms", "label": "TWT of the strongest reflection", "expected": 1582}, {"key": "syn_peak_twt_ms", "tol": 2, "unit": "ms", "label": "TWT of the strongest synthetic amplitude (25 Hz)", "expected": 1642}]'::jsonb then 'new'
           else 'other' end
    into v_state from public.academy_capstones
   where app_slug = 'seismolord' and tier = 'beginner' and active;

  if v_state is null then
    raise exception 'labelleak recut seismolord/beginner refused: no active seismolord beginner capstone row';
  end if;
  if v_state = 'other' then
    raise exception 'labelleak recut seismolord/beginner refused: the seismolord beginner prompt, dataset and fields match neither the published set nor the recut set';
  end if;

  if v_state = 'old' then
    update public.academy_capstones
       set prompt = 'Set the wavelet to 25 Hz and read the synthetic summary panel: report the mean sonic velocity, the two-way time at the top of the log under the teaching time-depth function, the maximum impedance, and the strongest reflection coefficient and synthetic amplitude with their two-way times.', dataset = 'wells/las/basic_20 + ricker25', fields = '[{"key": "mean_velocity_ms", "tol": 1, "unit": "m/s", "label": "Mean sonic velocity", "expected": 3145.2869374221345}, {"key": "twt_at_log_top_ms", "tol": 0.5, "unit": "ms", "label": "TWT at the top of the log", "expected": 1500}, {"key": "imp_max", "tol": 10, "unit": "(m/s)\u00b7(g/cc)", "label": "Maximum impedance", "expected": 10624.9560546875}, {"key": "rc_peak_abs", "tol": 0.0005, "unit": "-", "label": "Strongest reflection coefficient (abs)", "expected": 0.017688043415546417}, {"key": "rc_peak_twt_ms", "tol": 2, "unit": "ms", "label": "TWT of the strongest reflection", "expected": 1582}, {"key": "syn_peak_twt_ms", "tol": 2, "unit": "ms", "label": "TWT of the strongest synthetic amplitude (25 Hz)", "expected": 1642}]'::jsonb
     where app_slug = 'seismolord' and tier = 'beginner' and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then
      raise exception 'labelleak recut seismolord/beginner refused: the update touched % rows', v_count;
    end if;
    v_updated := v_updated + 1;
  end if;

  select string_agg((f->>'key') || '=' || (f->>'label'), ',' order by e.n)
    into v_keys from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) with ordinality as e(f, n)
   where c.app_slug = 'seismolord' and c.tier = 'beginner';
  if v_keys is distinct from 'mean_velocity_ms=Mean sonic velocity,twt_at_log_top_ms=TWT at the top of the log,imp_max=Maximum impedance,rc_peak_abs=Strongest reflection coefficient (abs),rc_peak_twt_ms=TWT of the strongest reflection,syn_peak_twt_ms=TWT of the strongest synthetic amplitude (25 Hz)' then
    raise exception 'labelleak recut seismolord/beginner refused: the graded keys and labels are now %', v_keys;
  end if;

  select count(*) into v_count from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'seismolord' and c.tier = 'beginner';
  if v_count <> 6 then
    raise exception 'labelleak recut seismolord/beginner refused: % graded fields, expected 6', v_count;
  end if;

  select count(*) into v_count from public.academy_capstones where app_slug = 'seismolord';
  if v_count <> 3 then
    raise exception 'labelleak recut seismolord/beginner refused: seismolord has % capstones, expected 3', v_count;
  end if;

  select string_agg(c.tier || ':' || md5(c.prompt) || ':' || md5(coalesce(c.dataset,'')) || ':' || md5(c.fields::text), ',' order by c.tier)
    into v_keys from public.academy_capstones c
   where c.app_slug = 'seismolord' and c.tier <> 'beginner';
  if v_keys is distinct from v_other then
    raise exception 'labelleak recut seismolord/beginner refused: another tier of seismolord moved';
  end if;

  raise notice 'labelleak recut seismolord/beginner: % of 1 row rewritten', v_updated;
end $$;

select 'label leak recut' as migration, c.app_slug, c.tier,
       md5(c.prompt) as prompt_md5, md5(coalesce(c.dataset,'')) as dataset_md5,
       e.n as ord, e.f->>'key' as key, e.f->>'label' as label, e.f->>'unit' as unit,
       (e.f->>'expected')::numeric as expected, (e.f->>'tol')::numeric as tol
  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) with ordinality as e(f, n)
 where c.app_slug = 'seismolord' and c.tier = 'beginner' order by e.n;
