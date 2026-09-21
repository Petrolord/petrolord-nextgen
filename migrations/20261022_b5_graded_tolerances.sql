-- ============================================================================
-- B5 GRADED-FIELD AUDIT: six graded tolerances a correct answer could fail.
--
-- WHY. The B5 audit (docs/graded-field-audit/) read every live capstone field
-- against the precision its own prompt asks for and the precision its source
-- prints. Six fields grade tighter than the course's own instruction, so a
-- learner who works the value correctly and reports it the way the prompt says
-- can still be marked wrong. Each new tolerance is the smallest one that
-- admits the instructed rounding (the rule FC6 settled: max(stated, half a
-- unit in the last place the course asks for)).
--
--   separation / beginner     / ejulebe1_terminal_velocity_fts  1e-05 -> 5e-05
--   separation / beginner     / ejulebe1_velocity_margin        1e-05 -> 5e-05
--   separation / intermediate / ejulebe2_gas_velocity_fts       1e-05 -> 5e-05
--   separation / advanced     / ejulebe3_interface_height_ft    1e-05 -> 5e-05
--     Each prompt says "to four decimals". Half a unit in the fourth decimal
--     is 5e-05. Measured: the intermediate gas velocity 0.5341820338 reported
--     as 0.5342 misses by 1.8e-05 and FAILED at 1e-05; the advanced interface
--     3.5272802173 reported as 3.5273 misses by 2.0e-05 and FAILED.
--
--   cashflow / intermediate / jv_breakeven_oil_price_usd_bbl    0.001 -> 0.005
--     The prompt asks for the breakeven "found by bisection to the cent". The
--     graded 66.1010088921 reported to the cent is 66.10, which misses by
--     0.00101 and FAILED at 0.001. Half a cent is 0.005.
--
--   completion / beginner / drift_surface_casing_m              5e-08 -> 1e-07
--     The true drift (12.415 - 5/32) x 0.0254 = 0.31137225 sits EXACTLY on the
--     seventh-decimal rounding boundary. The panel prints 0.3113722; a learner
--     who rounds half up types 0.3113723 and FAILED by 4e-17 at 5e-08. 1e-07
--     admits both roundings of the seventh decimal.
--
-- WHAT DOES NOT MOVE. No `expected`, key, label, unit, field count, prompt or
-- row. Only six `tol` numbers, and every one of them LOOSENS, so no answer
-- that graded correct before can grade wrong now. Nothing flips a status.
--
-- REGRADE IMPACT. `academy_capstone_attempts` stores each attempt's score at
-- the time it was taken and is never re-scored by this file. A loosening can
-- only turn a future fail into a pass. The file reports (NOTICE) the attempts
-- on the four touched tiers so the owner can see whether any past failure was
-- caused by one of these fields; it does not refuse on them, because nothing
-- here can take a pass away.
--
-- GUARDS. Each field is addressed by (app_slug, tier, key) and must carry
-- EITHER its published tolerance (it is updated) OR the new one (already
-- applied, left alone). Anything else raises and the transaction rolls back.
-- Each update must touch exactly 1 row, leave `expected` unchanged and keep 6
-- fields in the tier. Published values were read from a scratch replay of
-- NextGen main 76cd1f35e, which is the production baseline.
--
-- SAFE TO RE-RUN. A second run finds all six applied and writes nothing.
-- ============================================================================

do $$
declare
  r           record;
  v_state     text;
  v_tol       float8;
  v_expected  float8;
  v_count     integer;
  v_n         integer;
  v_updated   integer := 0;
  v_attempts  integer;
begin

  for r in
    select app_slug, tier, count(*) as n
      from public.academy_capstone_attempts
     where (app_slug, tier) in (('separation','beginner'), ('separation','intermediate'),
                                ('separation','advanced'), ('cashflow','intermediate'),
                                ('completion','beginner'))
     group by 1, 2
  loop
    raise notice 'b5 tolerances: % attempt(s) on %/% (scores are stored, not re-scored)', r.n, r.app_slug, r.tier;
  end loop;

  for r in
    select * from (values
      ('separation', 'beginner',     'ejulebe1_terminal_velocity_fts', 0.00001::float8,    0.00005::float8, 1.4391934722920448::float8),
      ('separation', 'beginner',     'ejulebe1_velocity_margin',       0.00001::float8,    0.00005::float8, 6.880197223424059::float8),
      ('separation', 'intermediate', 'ejulebe2_gas_velocity_fts',      0.00001::float8,    0.00005::float8, 0.5341820338116766::float8),
      ('separation', 'advanced',     'ejulebe3_interface_height_ft',   0.00001::float8,    0.00005::float8, 3.5272802173244173::float8),
      ('cashflow',   'intermediate', 'jv_breakeven_oil_price_usd_bbl', 0.001::float8,      0.005::float8,   66.10100889205933::float8),
      ('completion', 'beginner',     'drift_surface_casing_m',         0.00000005::float8, 0.0000001::float8, 0.31137224999999996::float8)
    ) as t(app_slug, tier, k, old_tol, new_tol, expected)
  loop

    select count(*) into v_n
      from public.academy_capstones c,
           lateral jsonb_array_elements(c.fields) as f
     where c.app_slug = r.app_slug and c.tier = r.tier and c.active
       and f->>'key' = r.k;
    if v_n <> 1 then
      raise exception 'b5 tolerances refused: %/% has % field(s) keyed %, expected exactly 1', r.app_slug, r.tier, v_n, r.k;
    end if;

    select (f->>'tol')::float8, (f->>'expected')::float8
      into v_tol, v_expected
      from public.academy_capstones c,
           lateral jsonb_array_elements(c.fields) as f
     where c.app_slug = r.app_slug and c.tier = r.tier and c.active
       and f->>'key' = r.k;

    if v_expected is distinct from r.expected then
      raise exception 'b5 tolerances refused: %/%.% expected is %, not the % this file was generated against',
        r.app_slug, r.tier, r.k, v_expected, r.expected;
    end if;

    v_state := case
                 when v_tol = r.old_tol then 'old'
                 when v_tol = r.new_tol then 'new'
                 else 'other' end;
    if v_state = 'other' then
      raise exception 'b5 tolerances refused: %/%.% carries tolerance %, neither the published % nor the recut %',
        r.app_slug, r.tier, r.k, v_tol, r.old_tol, r.new_tol;
    end if;

    if v_state = 'old' then
      update public.academy_capstones c
         set fields = (select jsonb_agg(case when e.f->>'key' = r.k
                                             then jsonb_set(e.f, '{tol}', to_jsonb(r.new_tol))
                                             else e.f end order by e.n)
                         from jsonb_array_elements(c.fields) with ordinality as e(f, n))
       where c.app_slug = r.app_slug and c.tier = r.tier and c.active;
      get diagnostics v_count = row_count;
      if v_count <> 1 then
        raise exception 'b5 tolerances refused: %/%.% updated % rows', r.app_slug, r.tier, r.k, v_count;
      end if;
      v_updated := v_updated + 1;
    end if;

    select (f->>'tol')::float8, (f->>'expected')::float8
      into v_tol, v_expected
      from public.academy_capstones c,
           lateral jsonb_array_elements(c.fields) as f
     where c.app_slug = r.app_slug and c.tier = r.tier and c.active
       and f->>'key' = r.k;
    if v_tol <> r.new_tol or v_expected is distinct from r.expected then
      raise exception 'b5 tolerances refused: %/%.% reads back tol % expected %', r.app_slug, r.tier, r.k, v_tol, v_expected;
    end if;
    select jsonb_array_length(fields) into v_n
      from public.academy_capstones where app_slug = r.app_slug and tier = r.tier and active;
    if v_n <> 6 then
      raise exception 'b5 tolerances refused: %/% now holds % fields, expected 6', r.app_slug, r.tier, v_n;
    end if;
  end loop;

  raise notice 'b5 tolerances: % of 6 field(s) updated, % already applied', v_updated, 6 - v_updated;
end $$;
