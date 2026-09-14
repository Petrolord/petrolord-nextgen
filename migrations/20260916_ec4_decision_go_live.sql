-- ============================================================================
-- EC4 GO-LIVE (HELD): Decision Analysis & Value of Information flips to
-- 'available'. The FOURTH Economics course.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/decision.
--
-- Every assertion below is written from the ENGINES' output, never from the
-- intuition the capstone was designed with, and every one was checked in
-- Python against fields.json before it was written here. The trees and the
-- lotteries have no hidden state: every graded value is an exact closed form
-- of the prompt's own numbers (a probability-weighted sum, a maximum, a Bayes
-- ratio), so a capstone quietly recut to another probability, payoff or cost
-- fails them to 1e-9.
--
-- The PAIRS guard what the course exists to teach: the two-action value the
-- VOI Analyzer reports against the three-action EVII, the tree with and
-- without its later Sell choice, the tree with its Large payoff typed and
-- linked to a Monte Carlo mean. A pair that collapses would grade one thing
-- twice and lose the lesson.
-- ============================================================================

do $$
declare
  v_structures integer;
  v_capstones  integer;
  v_questions  integer;
  v_graded     integer;
  v_dev numeric; v_drillc numeric; v_root numeric; v_farm numeric; v_nosell numeric; v_moved numeric;
  v_prior numeric; v_evpi numeric; v_weak numeric; v_evii numeric; v_net numeric; v_two numeric;
  v_evii3 numeric; v_mixed numeric; v_mcroot numeric; v_adv numeric; v_evpi2 numeric; v_pct numeric;
  v_after numeric; v_aftermc numeric; v_pw numeric; v_p numeric;
begin
  -- ---------------------------------------------------------------- shape --
  select count(*) into v_structures
    from public.academy_course_structures where app_slug = 'decision' and active;
  if v_structures <> 3 then
    raise exception 'EC4 go-live refused: decision has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions
    from public.academy_quiz_questions where app_slug = 'decision';
  if v_questions <> 396 then
    raise exception 'EC4 go-live refused: decision has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_capstones
    from public.academy_capstones where app_slug = 'decision';
  if v_capstones <> 3 then
    raise exception 'EC4 go-live refused: decision has % capstones, expected 3', v_capstones;
  end if;

  -- ------------------------------------------------- the scope assertion --
  -- This course rolls back trees and values information on money that other
  -- engines already discounted. It does not sample a breakeven price (EC3),
  -- rank a portfolio (EC5), book a reserve, run a fiscal cost pool, compute
  -- an IRR or model a pressure. EMV, EVPI, EVII and value of information are
  -- this course's subject and are NOT refused here.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'decision'
     and (f->>'label' ilike '%reserve%'    or f->>'label' ilike '%eur%'
       or f->>'label' ilike '%breakeven%'  or f->>'label' ilike '%tornado%'
       or f->>'label' ilike '%portfolio%'  or f->>'label' ilike '%cost pool%'
       or f->>'label' ~* '\mirr\M'         or f->>'label' ilike '%royalty%'
       or f->>'unit'  ilike '%psi%'        or f->>'unit'  ilike '%bbl%');
  if v_graded <> 0 then
    raise exception 'EC4 go-live refused: % capstone field(s) grade a quantity these decision engines cannot produce', v_graded;
  end if;

  -- ---------------------------------------------- the P-label assertion --
  -- A probability, likelihood, posterior or indicator chance never takes a
  -- P-label, and no graded field in this course is a Monte Carlo percentile.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'decision'
     and f->>'label' ~ '\mP(10|50|90)\M';
  if v_graded <> 0 then
    raise exception 'EC4 go-live refused: % capstone field label(s) carry a P-label', v_graded;
  end if;

  -- --------------------------------------- the published-golden assertion --
  -- Headline values the goldens and the teaching digest publish. A graded
  -- field within its OWN tolerance of one of these is a lookup.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         (values
            (105), (160), (37.75),           -- EKPAN tree root, drill node, farm-out
            (75.75), (52), (127.75),         -- EKPAN lottery prior, EVPI, EV with perfect
            (24.825), (16.825), (100.575), (92.575), -- EKPAN survey EVII, net, EV with info, acquire
            (87), (48), (33.6), (15.6), (39), -- OKRIKA root, sell now, develop now, no later sale, advantage
            (43), (35), (18), (12.5), (55.5), (7.5), (50.5), -- drillFarmOut prospect and seismic survey
            (63), (15), (38), (33), (23),     -- VOI Analyzer defaults
            (19.84), (11.84), (19.8375),      -- EKPAN in the Analyzer, two-action EVII
            (109), (24), (1.2), (-10.8),      -- threeOutcomesFourActions and threeByThree
            (21.7143), (61.7143),             -- EKPAN at the switch probability
            (-15), (245), (75), (69)          -- pre-repair cards, history
         ) as g(v)
   where c.app_slug = 'decision'
     and abs(abs((f->>'expected')::numeric) - abs(g.v)) <= (f->>'tol')::numeric;
  if v_graded <> 0 then
    raise exception 'EC4 go-live refused: % graded field(s) sit within their own tolerance of a value the goldens or the digest publish, which makes them a lookup rather than a calculation', v_graded;
  end if;

  -- ------------------------------------ the handed-in-the-prompt assertion --
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         (values (47.3),(0.37),(0.21),(0.42),(96.4),(31.8),(212.6),(0.62),(684.2),(0.38),(118.9),
                 (268.4),(118.5),(22.7),(0),(0.3),(0.18),(0.34),(0.48),(62.5),(735),(88),(52),
                 (142),(34.6),(11.4),(0.78),(0.46),(0.17),(0.22),(0.54),(0.83),(0.66),(0.31),
                 (0.09),(0.23),(0.44),(0.27),(0.11),(0.25),(0.64),(760.5),(455),(721.3),(1098.4),
                 (37.1),(41.3),(21.6),(6.4),(29.5),(64.1),(100),(4),(6)) as h(v)
   where c.app_slug = 'decision'
     and abs(abs((f->>'expected')::numeric) - h.v) <= (f->>'tol')::numeric;
  if v_graded <> 0 then
    raise exception 'EC4 go-live refused: % graded field(s) land on a number the learner is handed in a prompt, which makes the field a transcription rather than a calculation', v_graded;
  end if;

  -- ------------------------------------- the cross-tier prompt-leak gate --
  select count(*) into v_graded
    from public.academy_capstones c,
         public.academy_capstones c2,
         lateral jsonb_array_elements(c2.fields) f
   where c.app_slug = 'decision' and c2.app_slug = 'decision' and c.tier <> c2.tier
     and replace(c.prompt, ',', '') like '%' || (f->>'expected') || '%';
  if v_graded <> 0 then
    raise exception 'EC4 go-live refused: % capstone prompt(s) state a graded value belonging to another tier', v_graded;
  end if;

  -- ------------------------------------------------------- load the values --
  select (f->>'expected')::numeric into v_dev    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='decision' and f->>'key'='ab_develop_chance_emv_musd';
  select (f->>'expected')::numeric into v_drillc from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='decision' and f->>'key'='ab_drill_chance_emv_musd';
  select (f->>'expected')::numeric into v_root   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='decision' and f->>'key'='ab_root_emv_musd';
  select (f->>'expected')::numeric into v_farm   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='decision' and f->>'key'='ab_farm_out_value_musd';
  select (f->>'expected')::numeric into v_nosell from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='decision' and f->>'key'='ab_drill_value_no_sell_option_musd';
  select (f->>'expected')::numeric into v_moved  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='decision' and f->>'key'='ab_drill_value_success_moved_musd';
  select (f->>'expected')::numeric into v_prior  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='decision' and f->>'key'='ab_emv_prior_musd';
  select (f->>'expected')::numeric into v_evpi   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='decision' and f->>'key'='ab_evpi_musd';
  select (f->>'expected')::numeric into v_weak   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='decision' and f->>'key'='ab_emv_after_weak_musd';
  select (f->>'expected')::numeric into v_evii   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='decision' and f->>'key'='ab_evii_musd';
  select (f->>'expected')::numeric into v_net    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='decision' and f->>'key'='ab_net_evii_musd';
  select (f->>'expected')::numeric into v_two    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='decision' and f->>'key'='ab_two_action_voi_musd';
  select (f->>'expected')::numeric into v_evii3  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='decision' and f->>'key'='ab_three_reading_evii_musd';
  select (f->>'expected')::numeric into v_mixed  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='decision' and f->>'key'='ab_three_reading_mixed_emv_musd';
  select (f->>'expected')::numeric into v_mcroot from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='decision' and f->>'key'='ab_mc_linked_root_emv_musd';
  select (f->>'expected')::numeric into v_adv    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='decision' and f->>'key'='ab_mc_linked_decision_advantage_musd';
  select (f->>'expected')::numeric into v_evpi2  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='decision' and f->>'key'='ab_analyzer_evpi_two_action_musd';
  select (f->>'expected')::numeric into v_pct    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='decision' and f->>'key'='ab_max_strong_chance_consistent_pct';

  if v_dev is null or v_drillc is null or v_root is null or v_farm is null or v_nosell is null or v_moved is null
     or v_prior is null or v_evpi is null or v_weak is null or v_evii is null or v_net is null or v_two is null
     or v_evii3 is null or v_mixed is null or v_mcroot is null or v_adv is null or v_evpi2 is null or v_pct is null then
    raise exception 'EC4 go-live refused: one or more of the eighteen graded fields is missing';
  end if;

  -- ------------------------------- Associate: EXACT CLOSED-FORM ROLLBACK --
  -- Develop: 0.62 x 684.2 + 0.38 x 118.9. After a success: the larger of
  -- Develop less 212.6 and Sell at 268.4. Drill node: 0.37 x that + 0.21 x 96.4
  -- + 0.42 x -31.8. Farm out: 0.37 x 118.5 + 0.21 x 22.7.
  if abs(v_dev - (0.62 * 684.2 + 0.38 * 118.9)) > 1e-9 then
    raise exception 'EC4 go-live refused: the development node EMV % is not the probability-weighted sum of its outcomes', v_dev;
  end if;
  v_after := greatest(v_dev - 212.6, 268.4);
  if abs(v_drillc - (0.37 * v_after + 0.21 * 96.4 + 0.42 * -31.8)) > 1e-9 then
    raise exception 'EC4 go-live refused: the drill node EMV % does not roll back the later Develop or Sell choice first', v_drillc;
  end if;
  if abs(v_farm - (0.37 * 118.5 + 0.21 * 22.7)) > 1e-9 then
    raise exception 'EC4 go-live refused: the farm-out value % is not its probability-weighted payoff', v_farm;
  end if;
  if abs(v_root - greatest(v_drillc - 47.3, v_farm, 0)) > 1e-9 then
    raise exception 'EC4 go-live refused: the root EMV % is not the best branch after the drill cost', v_root;
  end if;
  if abs(v_nosell - (0.37 * (v_dev - 212.6) + 0.21 * 96.4 + 0.42 * -31.8 - 47.3)) > 1e-9 then
    raise exception 'EC4 go-live refused: the no-sell drill value % is not the tree with Develop forced', v_nosell;
  end if;
  if abs(v_moved - (0.30 * v_after + 0.21 * 96.4 + 0.49 * -31.8 - 47.3)) > 1e-9 then
    raise exception 'EC4 go-live refused: the moved-probability drill value % does not move the dry hole by the difference', v_moved;
  end if;
  -- The later choice must matter, or the no-sell field grades nothing.
  if not (v_nosell < v_root - 1 and v_dev - 212.6 < 268.4) then
    raise exception 'EC4 go-live refused: Sell is not the better choice after a success, so the value of the later choice is not graded';
  end if;

  -- ------------------------------- Professional: EXACT CLOSED-FORM VALUE --
  if abs(v_prior - greatest(0.18 * 672.5 + 0.34 * 25.5 + 0.48 * -114.5, 0.18 * 142 + 0.34 * 34.6, 0)) > 1e-9 then
    raise exception 'EC4 go-live refused: the prior EMV % is not the best action at the priors', v_prior;
  end if;
  if abs(v_evpi - (0.18 * 672.5 + 0.34 * greatest(25.5, 34.6, 0) + 0.48 * 0 - v_prior)) > 1e-9 then
    raise exception 'EC4 go-live refused: EVPI % is not the best action per outcome less the prior EMV', v_evpi;
  end if;
  -- A Weak reading: joint over its chance; the farm-out wins there.
  v_pw := 0.18 * 0.22 + 0.34 * 0.54 + 0.48 * 0.83;
  if abs(v_weak - greatest((0.18 * 0.22 * 672.5 + 0.34 * 0.54 * 25.5 + 0.48 * 0.83 * -114.5) / v_pw,
                           (0.18 * 0.22 * 142 + 0.34 * 0.54 * 34.6) / v_pw, 0)) > 1e-9 then
    raise exception 'EC4 go-live refused: the EMV after a Weak reading % is not the best action at the Bayes posterior', v_weak;
  end if;
  if abs(v_net - (v_evii - 11.4)) > 1e-9 then
    raise exception 'EC4 go-live refused: net EVII % is not gross EVII % less the survey cost', v_net, v_evii;
  end if;
  if not (v_evii > 0 and v_evii < v_evpi) then
    raise exception 'EC4 go-live refused: EVII % is not inside 0 to EVPI %', v_evii, v_evpi;
  end if;
  -- THE PAIR: the Analyzer's two actions are worth less than the full EVII.
  if not (v_two > 1 and v_two < v_evii - 1) then
    raise exception 'EC4 go-live refused: the two-action value % is not the separated lower value the missing-action lesson grades against EVII %', v_two, v_evii;
  end if;

  -- ------------------------------- Expert: closed forms and THE PAIRS --
  v_aftermc := greatest(0.62 * 760.5 + 0.38 * 118.9 - 212.6, 268.4);
  if abs(v_mcroot - greatest(0.37 * v_aftermc + 0.21 * 96.4 + 0.42 * -31.8 - 47.3, v_farm, 0)) > 1e-9 then
    raise exception 'EC4 go-live refused: the linked root EMV % does not use the Monte Carlo mean', v_mcroot;
  end if;
  if not (v_mcroot > v_root + 1 and 0.62 * 760.5 + 0.38 * 118.9 - 212.6 > 268.4) then
    raise exception 'EC4 go-live refused: linking the mean does not change the later choice, so the linked field repeats the Associate root';
  end if;
  if abs(v_adv - (v_mcroot - greatest(v_farm, 0))) > 1e-9 then
    raise exception 'EC4 go-live refused: the decision advantage % is not the linked root less the next best branch', v_adv;
  end if;
  if abs(v_evpi2 - (0.18 * 672.5 + 0.34 * 25.5 - greatest(0.18 * 672.5 + 0.34 * 25.5 + 0.48 * -114.5, 0))) > 1e-9 then
    raise exception 'EC4 go-live refused: the Analyzer EVPI % is not the two-action closed form', v_evpi2;
  end if;
  if not (v_evpi2 < v_evpi - 1) then
    raise exception 'EC4 go-live refused: the Analyzer EVPI % is not separated from the three-action EVPI %', v_evpi2, v_evpi;
  end if;
  if not (v_evii3 > 0 and v_evii3 < v_evpi and abs(v_evii3 - v_evii) > 0.1) then
    raise exception 'EC4 go-live refused: the three-reading EVII % is not inside 0 to EVPI, or repeats the two-reading EVII', v_evii3;
  end if;
  if not (v_mixed > 0) then
    raise exception 'EC4 go-live refused: the EMV after a Mixed reading % is not positive', v_mixed;
  end if;
  -- The consistency window's upper edge: at it every implied prior sits
  -- within half a percent of the stated one; one ten-thousandth of a percent
  -- above it, one does not.
  v_p := v_pct / 100;
  if not (abs(v_p * 0.371 + (1 - v_p) * 0.064 - 0.18) <= 0.005 + 1e-9
      and abs(v_p * 0.413 + (1 - v_p) * 0.295 - 0.34) <= 0.005 + 1e-9
      and abs(v_p * 0.216 + (1 - v_p) * 0.641 - 0.48) <= 0.005 + 1e-9) then
    raise exception 'EC4 go-live refused: the Strong chance % percent does not pass the consistency check', v_pct;
  end if;
  v_p := (v_pct + 0.0001) / 100;
  if (abs(v_p * 0.371 + (1 - v_p) * 0.064 - 0.18) <= 0.005
      and abs(v_p * 0.413 + (1 - v_p) * 0.295 - 0.34) <= 0.005
      and abs(v_p * 0.216 + (1 - v_p) * 0.641 - 0.48) <= 0.005) then
    raise exception 'EC4 go-live refused: the Strong chance % percent is not the upper edge of the consistency window', v_pct;
  end if;

  -- ------------------------------------------------------------ the flip --
  update public.academy_apps
     set status = 'available'
   where slug = 'decision' and status = 'coming_soon';

  if not exists (select 1 from public.academy_apps where slug = 'decision' and status = 'available') then
    raise exception 'EC4 go-live refused: decision did not reach status available';
  end if;

  raise notice 'EC4 go-live: decision is available. Economics now has four courses.';
end $$;
