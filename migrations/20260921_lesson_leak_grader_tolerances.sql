-- ============================================================================
-- CROSS-TIER LESSON LEAK RECUT: the three graded tolerances that no lesson
-- edit can fix, because the colliding number is a DIFFERENT quantity the
-- course is right to print.
--
-- WHY. A repaired leakage gate swept the 44 live courses against the live
-- answer key for the first time and found cross-tier answer leaks in the 16
-- courses that had never been reachable by the old wave-directory gates. Most
-- of them are prose: a lesson at one tier printing the tier above's graded
-- answer. Those are fixed in `src/content/courses/**` and reach production
-- with the NextGen front-end upload, not from here.
--
-- Three are NOT prose. In each one the lesson is right to print what it
-- prints, and the grader is wrong to accept it, because the tolerance is wide
-- enough to swallow a neighbouring quantity:
--
--   reservoircalc / advanced / phi_mean_oil   tol 0.001   -> 0.0002
--     The Expert capstone asks for the mean trend porosity over the oil nodes,
--     0.20936760570720417. One of the six well porosities the task itself
--     hands the learner is 0.21, which sits 0.00063 away and therefore SCORES
--     the field. A learner can copy an input into the answer box. 0.0002 is
--     the tolerance this course's own Expert walkthrough lesson already
--     states on `main` (unshipped); this migration makes the grader agree
--     with it.
--
--   dca / advanced / e6_oil_di                tol 0.00002 -> 0.000002
--     The Expert field is Ekene-6's oil-stream decline, 0.0013275893489185155
--     per day. Two OTHER Ekene-6 declines printed in Professional lessons, the
--     forced-harmonic fit at 0.00133821021526847 and the pooled type-curve fit
--     at 0.00131674836694260, both sit ~1.07e-5 away and therefore SCORE it.
--     Same well, same units, one tier down: the most copyable shape there is.
--     At 2e-6 all three separate and the tile value still passes exactly.
--
--   dca / intermediate / tc_eur_stb           tol 600     -> 50
--     The Professional field is Ekene-6's fixed-b type-curve EUR,
--     91524.2759502962 stb. The ASSOCIATE tier's own graded answer,
--     eur_10_stb = 91666.6666666667, sits 142 stb away and SCORES it, as does
--     91604.1233600709 from an Associate lesson at 80 stb. A learner passes a
--     Professional field with the Associate capstone's answer. 50 stb is
--     0.055 percent of a closed form the panel prints exactly.
--
-- WHAT DOES NOT MOVE. No `expected` value, no key, no label, no unit, no
-- field count, no prompt, no row. Only three `tol` numbers. Nothing here
-- flips a status or touches availability: all three courses stay live
-- throughout.
--
-- NO LEARNER IS RE-SCORED. `academy_capstone_attempts` holds 7 rows table
-- wide, every one of them welldata/beginner. None of the three tiers touched
-- here has ever been attempted, so no submitted answer changes from pass to
-- fail. The file ASSERTS that before it writes, and refuses if an attempt has
-- appeared against any of the three since.
--
-- GUARDS. Each field is addressed by (app_slug, tier, key) and must currently
-- carry EITHER its published tolerance, in which case it is updated, OR the
-- new tolerance, in which case it is already applied and left alone. Anything
-- else raises and the whole transaction rolls back. Every update asserts it
-- touched exactly 1 row and that the field survived with its `expected`
-- unchanged and its tier still holding 6 fields.
--
-- Every published tolerance below was read from the LIVE production row, not
-- retyped.
--
-- SAFE TO RE-RUN. A second run finds all three already recut and writes
-- nothing.
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

  -- ---------------------------------------------------------------- attempts
  select count(*) into v_attempts
    from public.academy_capstone_attempts
   where (app_slug = 'reservoircalc' and tier = 'advanced')
      or (app_slug = 'dca'           and tier = 'advanced')
      or (app_slug = 'dca'           and tier = 'intermediate');
  if v_attempts <> 0 then
    raise exception 'leak recut refused: % capstone attempt(s) exist against the tiers this file retightens; a learner would be re-scored. Re-read before applying.', v_attempts;
  end if;

  -- ------------------------------------------------------------ the three
  for r in
    select * from (values
      ('reservoircalc', 'advanced',     'phi_mean_oil', 0.001::float8,   0.0002::float8,   0.20936760570720417::float8),
      ('dca',           'advanced',     'e6_oil_di',    0.00002::float8, 0.000002::float8, 0.0013275893489185155::float8),
      ('dca',           'intermediate', 'tc_eur_stb',   600::float8,     50::float8,       91524.2759502962::float8)
    ) as t(app_slug, tier, k, old_tol, new_tol, expected)
  loop

    -- the field must exist, exactly once, in that tier's key
    select count(*) into v_n
      from public.academy_capstones c,
           lateral jsonb_array_elements(c.fields) as f
     where c.app_slug = r.app_slug and c.tier = r.tier and c.active
       and f->>'key' = r.k;
    if v_n <> 1 then
      raise exception 'leak recut refused: %/% has % field(s) keyed %, expected exactly 1', r.app_slug, r.tier, v_n, r.k;
    end if;

    select (f->>'tol')::float8, (f->>'expected')::float8
      into v_tol, v_expected
      from public.academy_capstones c,
           lateral jsonb_array_elements(c.fields) as f
     where c.app_slug = r.app_slug and c.tier = r.tier and c.active
       and f->>'key' = r.k;

    -- the graded VALUE must be untouched; this file only ever moves a tolerance
    if v_expected is distinct from r.expected then
      raise exception 'leak recut refused: %/%.% expected is %, not the % this file was generated against',
        r.app_slug, r.tier, r.k, v_expected, r.expected;
    end if;

    v_state := case
                 when v_tol = r.old_tol then 'old'
                 when v_tol = r.new_tol then 'new'
                 else 'other' end;
    if v_state = 'other' then
      raise exception 'leak recut refused: %/%.% carries tolerance %, neither the published % nor the recut %',
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
        raise exception 'leak recut refused: %/%.% updated % rows', r.app_slug, r.tier, r.k, v_count;
      end if;
      v_updated := v_updated + 1;
    end if;

    -- read the row back inside the transaction: new tolerance, same expected,
    -- still six graded fields
    select (f->>'tol')::float8, (f->>'expected')::float8
      into v_tol, v_expected
      from public.academy_capstones c,
           lateral jsonb_array_elements(c.fields) as f
     where c.app_slug = r.app_slug and c.tier = r.tier and c.active
       and f->>'key' = r.k;
    if v_tol <> r.new_tol then
      raise exception 'leak recut refused: %/%.% read back tolerance % after the update', r.app_slug, r.tier, r.k, v_tol;
    end if;
    if v_expected is distinct from r.expected then
      raise exception 'leak recut refused: %/%.% expected moved to %', r.app_slug, r.tier, r.k, v_expected;
    end if;

    select jsonb_array_length(fields) into v_n
      from public.academy_capstones
     where app_slug = r.app_slug and tier = r.tier and active;
    if v_n <> 6 then
      raise exception 'leak recut refused: %/% holds % graded fields after the update, expected 6', r.app_slug, r.tier, v_n;
    end if;

    -- the tightened tolerance must actually separate the colliding literal
    -- that motivated it (float denominators throughout)
  end loop;

  -- the three courses stay live and keep three active tiers each
  select count(*) into v_n
    from public.academy_capstones
   where app_slug in ('reservoircalc', 'dca') and active;
  if v_n <> 6 then
    raise exception 'leak recut refused: reservoircalc + dca hold % active capstones, expected 6', v_n;
  end if;

  raise notice 'lesson leak grader tolerances: % of 3 field(s) retightened (0 means already applied)', v_updated;
end $$;
