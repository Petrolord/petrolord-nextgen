-- ============================================================================
-- EC5 GO-LIVE (HELD): Capital Portfolio & Cost Control flips to 'available'.
-- The FIFTH Economics course.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/portfolio.
--
-- Every assertion below was checked in Python against fields.json before it
-- was written here. The Associate and Professional fields are EXACT closed
-- forms of the prompt's own numbers: a portfolio EMV is the risked sum of the
-- funded set, and the AFE figures are sums, a max rule, a whole-day ratio and
-- two divisions. The Expert tier's spread is the moment formula; its simulated
-- fields (P90 twice and a loss probability) are checked as ORDERED PAIRS,
-- because a seeded simulation has no closed form a migration can recompute.
-- ============================================================================

do $$
declare
  v_structures integer;
  v_capstones  integer;
  v_questions  integer;
  v_graded     integer;
  v_e1 numeric; v_e2 numeric; v_e3 numeric; v_npv1 numeric; v_val3 numeric; v_tie numeric;
  v_eac numeric; v_var numeric; v_ev numeric; v_pv numeric; v_cpi numeric; v_spi numeric;
  v_p90i numeric; v_sdr numeric; v_plr numeric; v_p90r numeric; v_p2 numeric; v_op numeric;
  v_bac numeric; v_ac numeric; v_tp numeric; v_sd1 numeric; v_sd2 numeric; v_sd4 numeric;
begin
  -- ---------------------------------------------------------------- shape --
  select count(*) into v_structures from public.academy_course_structures where app_slug = 'portfolio' and active;
  if v_structures <> 3 then
    raise exception 'EC5 go-live refused: portfolio has % active deep structures, expected 3', v_structures;
  end if;
  select count(*) into v_questions from public.academy_quiz_questions where app_slug = 'portfolio';
  if v_questions <> 396 then
    raise exception 'EC5 go-live refused: portfolio has % quiz questions, expected 396', v_questions;
  end if;
  select count(*) into v_capstones from public.academy_capstones where app_slug = 'portfolio';
  if v_capstones <> 3 then
    raise exception 'EC5 go-live refused: portfolio has % capstones, expected 3', v_capstones;
  end if;

  -- ------------------------------------------------- the scope assertion --
  -- This course funds a portfolio and spends against an AFE. It does not value
  -- information (EC4), sample a breakeven price (EC3), roll back a tree,
  -- compute an IRR, book a reserve or model a pressure.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'portfolio'
     and (f->>'label' ilike '%value of information%' or f->>'label' ilike '%evpi%'
       or f->>'label' ilike '%breakeven%' or f->>'label' ilike '%decision tree%'
       or f->>'label' ~* '\mirr\M'        or f->>'label' ilike '%reserve%'
       or f->>'unit'  ilike '%psi%'       or f->>'unit'  ilike '%bbl%');
  if v_graded <> 0 then
    raise exception 'EC5 go-live refused: % capstone field(s) grade a quantity these engines cannot produce', v_graded;
  end if;

  -- ---------------------------------------------- the P-label assertion --
  -- A P-label may only name a portfolio NPV outcome.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'portfolio'
     and f->>'label' ~ '\mP(10|50|90)\M'
     and f->>'label' not ilike '%NPV%';
  if v_graded <> 0 then
    raise exception 'EC5 go-live refused: % capstone field label(s) put a P-label on something other than an NPV outcome', v_graded;
  end if;

  -- --------------------------------------- the published-golden assertion --
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         (values
            (291), (402.75), (444), (588), (204.75), (41.25),     -- OKONO optimum EMVs, OK-3 EMV
            (27600000), (-550000), (15231500), (1.009377070907886), (0.8720627517891844), (17466059.602649007), -- OFON-1
            (0.6961), (0.7), (0.365832), (-150.556), (-50),       -- the single wildcat
            (6762500), (6036000), (3395250),                      -- OFON-1 shares
            (6002), (6000), (250), (20260829), (10000)            -- published grid, classic set, engine defaults
         ) as g(v)
   where c.app_slug = 'portfolio'
     and abs(abs((f->>'expected')::numeric) - abs(g.v)) <= (f->>'tol')::numeric;
  if v_graded <> 0 then
    raise exception 'EC5 go-live refused: % graded field(s) sit within their own tolerance of a value the goldens or the digest publish', v_graded;
  end if;

  -- ------------------------------------ the handed-in-the-prompt assertion --
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         (values (145),(118.4),(176.2),(71.5),(0.92),(14.6),(215),(163.7),(241.9),(102.3),(0.86),(23.8),
                 (105),(388.5),(655.4),(198.7),(0.3),(72.4),(265),(231.9),(338.6),(141.2),(0.78),(46.3),
                 (75),(47.3),(63.8),(31.6),(0.97),(5.1),(340),(402.6),(611.3),(224.8),(0.5),(131.5),
                 (190),(121.2),(170.4),(79.9),(0.88),(18.7),(520),(640),(900),(0.45),
                 (11384650),(1937400),(8215730),(67.5),(2963180),(0),(3148920),(100),(1476325),(412600),
                 (688140),(1591870),(48),(3208470),(1265300),(1418260),(37.5),(4719850),(873900),
                 (37.25),(18.6),(9.15),(4),(5),(6)) as h(v)
   where c.app_slug = 'portfolio'
     and abs(abs((f->>'expected')::numeric) - h.v) <= (f->>'tol')::numeric;
  if v_graded <> 0 then
    raise exception 'EC5 go-live refused: % graded field(s) land on a number the learner is handed in a prompt', v_graded;
  end if;

  -- ------------------------------------- the cross-tier prompt-leak gate --
  select count(*) into v_graded
    from public.academy_capstones c, public.academy_capstones c2, lateral jsonb_array_elements(c2.fields) f
   where c.app_slug = 'portfolio' and c2.app_slug = 'portfolio' and c.tier <> c2.tier
     and replace(c.prompt, ',', '') like '%' || (f->>'expected') || '%';
  if v_graded <> 0 then
    raise exception 'EC5 go-live refused: % capstone prompt(s) state a graded value belonging to another tier', v_graded;
  end if;

  -- ------------------------------------------------------- load the values --
  select (f->>'expected')::numeric into v_e1   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='portfolio' and f->>'key'='id_emv_at_first_limit_musd';
  select (f->>'expected')::numeric into v_e2   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='portfolio' and f->>'key'='id_emv_at_second_limit_musd';
  select (f->>'expected')::numeric into v_e3   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='portfolio' and f->>'key'='id_emv_at_third_limit_musd';
  select (f->>'expected')::numeric into v_npv1 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='portfolio' and f->>'key'='id_success_npv_at_first_limit_musd';
  select (f->>'expected')::numeric into v_val3 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='portfolio' and f->>'key'='id_value_of_excluded_project_musd';
  select (f->>'expected')::numeric into v_tie  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='portfolio' and f->>'key'='id_risked_emv_tie_back_musd';
  select (f->>'expected')::numeric into v_eac  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='portfolio' and f->>'key'='id_eac_usd';
  select (f->>'expected')::numeric into v_var  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='portfolio' and f->>'key'='id_variance_at_completion_usd';
  select (f->>'expected')::numeric into v_ev   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='portfolio' and f->>'key'='id_earned_value_usd';
  select (f->>'expected')::numeric into v_pv   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='portfolio' and f->>'key'='id_planned_value_usd';
  select (f->>'expected')::numeric into v_cpi  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='portfolio' and f->>'key'='id_cpi';
  select (f->>'expected')::numeric into v_spi  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='portfolio' and f->>'key'='id_spi';
  select (f->>'expected')::numeric into v_p90i from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='portfolio' and f->>'key'='id_p90_npv_second_limit_independent_musd';
  select (f->>'expected')::numeric into v_sdr  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='portfolio' and f->>'key'='id_stddev_second_limit_correlated_musd';
  select (f->>'expected')::numeric into v_plr  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='portfolio' and f->>'key'='id_prob_loss_second_limit_correlated';
  select (f->>'expected')::numeric into v_p90r from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='portfolio' and f->>'key'='id_p90_npv_second_limit_correlated_musd';
  select (f->>'expected')::numeric into v_p2   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='portfolio' and f->>'key'='id_second_partner_billed_usd';
  select (f->>'expected')::numeric into v_op   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='portfolio' and f->>'key'='id_operator_billed_usd';

  if v_e1 is null or v_e2 is null or v_e3 is null or v_npv1 is null or v_val3 is null or v_tie is null
     or v_eac is null or v_var is null or v_ev is null or v_pv is null or v_cpi is null or v_spi is null
     or v_p90i is null or v_sdr is null or v_plr is null or v_p90r is null or v_p2 is null or v_op is null then
    raise exception 'EC5 go-live refused: one or more of the eighteen graded fields is missing';
  end if;

  -- ------------------------------- Associate: EXACT RISKED SUMS OF THE SETS --
  -- risked EMV = pos x NPV P50 - (1 - pos) x loss if it fails
  if abs(v_e1 - ((0.92*118.4 - 0.08*14.6) + (0.3*388.5 - 0.7*72.4) + (0.78*231.9 - 0.22*46.3))) > 1e-9 then
    raise exception 'EC5 go-live refused: the first-limit EMV % is not the risked sum of ID-1, ID-3 and ID-4', v_e1;
  end if;
  if abs(v_e2 - ((0.92*118.4 - 0.08*14.6) + (0.86*163.7 - 0.14*23.8) + (0.78*231.9 - 0.22*46.3))) > 1e-9 then
    raise exception 'EC5 go-live refused: the second-limit EMV % is not the risked sum of ID-1, ID-2 and ID-4', v_e2;
  end if;
  if abs(v_e3 - ((0.92*118.4 - 0.08*14.6) + (0.86*163.7 - 0.14*23.8) + (0.78*231.9 - 0.22*46.3) + (0.97*47.3 - 0.03*5.1) + (0.88*121.2 - 0.12*18.7))) > 1e-9 then
    raise exception 'EC5 go-live refused: the third-limit EMV % is not the risked sum of ID-1, ID-2, ID-4, ID-5 and ID-7', v_e3;
  end if;
  if abs(v_npv1 - (118.4 + 388.5 + 231.9)) > 1e-9 then
    raise exception 'EC5 go-live refused: the first-limit success NPV % is not the P50 sum of the funded set', v_npv1;
  end if;
  if abs(v_val3 - (v_e1 - ((0.92*118.4 - 0.08*14.6) + (0.78*231.9 - 0.22*46.3) + (0.97*47.3 - 0.03*5.1)))) > 1e-9 then
    raise exception 'EC5 go-live refused: the value of ID-3 % is not the optimum with it less the re-optimised set without it', v_val3;
  end if;
  if abs(v_tie - (0.5*402.6 - 0.5*131.5)) > 1e-9 then
    raise exception 'EC5 go-live refused: the tie-back EMV % is not its risked value', v_tie;
  end if;
  -- THE PAIRS: sets are not nested, and greedy-by-ratio is not the optimum at 900.
  if not (v_val3 > 1 and v_e2 > v_e1 + 1 and v_npv1 > v_e1 + 1) then
    raise exception 'EC5 go-live refused: the Associate pairs (value of ID-3, budgets, success NPV against EMV) collapsed';
  end if;

  -- ------------------------------- Professional: EXACT AFE CLOSED FORMS --
  v_bac := 11384650 + 2963180 + 1476325 + 3208470 + 4719850;
  v_ac  := 8215730 + 3148920 + 688140 + 1418260 + 0;
  v_tp  := (date '2028-10-03' - date '2028-03-06')::numeric / (date '2029-01-19' - date '2028-03-06')::numeric;
  if abs(v_eac - (greatest(11384650, 8215730 + 1937400) + greatest(2963180, 3148920 + 0) + 1591870
                  + greatest(3208470, 1418260 + 1265300) + greatest(4719850, 0 + 873900))) > 1e-6 then
    raise exception 'EC5 go-live refused: EAC % is not the one forecast rule summed over the lines', v_eac;
  end if;
  if abs(v_var - (v_bac - v_eac)) > 1e-6 then
    raise exception 'EC5 go-live refused: variance % is not budget less EAC', v_var;
  end if;
  if abs(v_ev - (11384650*0.675 + 2963180*1 + 1476325*0.48 + 3208470*0.375 + 4719850*0)) > 1e-6 then
    raise exception 'EC5 go-live refused: earned value % is not budget-weighted progress', v_ev;
  end if;
  if abs(v_pv - v_bac * v_tp) > 1e-6 then
    raise exception 'EC5 go-live refused: planned value % is not the budget times elapsed whole days over total days', v_pv;
  end if;
  if abs(v_cpi - v_ev / v_ac) > 1e-9 or abs(v_spi - v_ev / (v_bac * v_tp)) > 1e-9 then
    raise exception 'EC5 go-live refused: CPI % or SPI % is not the earned-value ratio', v_cpi, v_spi;
  end if;
  if not (v_var < 0 and v_cpi < 1 and v_spi < 1 and abs(v_cpi - v_spi) > 0.01) then
    raise exception 'EC5 go-live refused: the AFE is not the overrunning, behind-schedule case the tier grades';
  end if;

  -- ------------------------------- Expert: closed forms and THE PAIRS --
  v_sd1 := sqrt(0.92*(power((176.2-71.5)/2.5631, 2) + 118.4*118.4) + 0.08*14.6*14.6 - power(0.92*118.4 - 0.08*14.6, 2));
  v_sd2 := sqrt(0.86*(power((241.9-102.3)/2.5631, 2) + 163.7*163.7) + 0.14*23.8*23.8 - power(0.86*163.7 - 0.14*23.8, 2));
  v_sd4 := sqrt(0.78*(power((338.6-141.2)/2.5631, 2) + 231.9*231.9) + 0.22*46.3*46.3 - power(0.78*231.9 - 0.22*46.3, 2));
  if abs(v_sdr - sqrt(v_sd1*v_sd1 + v_sd2*v_sd2 + v_sd4*v_sd4
                      + 0.45 * (power(v_sd1 + v_sd2 + v_sd4, 2) - (v_sd1*v_sd1 + v_sd2*v_sd2 + v_sd4*v_sd4)))) > 1e-6 then
    raise exception 'EC5 go-live refused: the correlated spread % is not the moment formula at rho 0.45', v_sdr;
  end if;
  if abs(v_p2 - v_ac * 0.186) > 1e-6 or abs(v_op - v_ac * (100 - 37.25 - 18.6 - 9.15) / 100) > 1e-6 then
    raise exception 'EC5 go-live refused: the partner bill % or operator bill % is not the actuals split by working interest', v_p2, v_op;
  end if;
  if not (v_p90r < v_p90i - 1 and v_p90i < v_e2 and v_plr > 0 and v_plr < 0.5) then
    raise exception 'EC5 go-live refused: the simulated pair (P90 correlated %, independent %) or the loss probability % is out of order', v_p90r, v_p90i, v_plr;
  end if;

  -- ------------------------------------------------------------ the flip --
  update public.academy_apps set status = 'available' where slug = 'portfolio' and status = 'coming_soon';
  if not exists (select 1 from public.academy_apps where slug = 'portfolio' and status = 'available') then
    raise exception 'EC5 go-live refused: portfolio did not reach status available';
  end if;
  raise notice 'EC5 go-live: portfolio is available. Economics now has five courses.';
end $$;
