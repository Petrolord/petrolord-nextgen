-- ============================================================================
-- PD1 GO-LIVE (HELD): Nodal Analysis & Well Performance flips to 'available'.
-- This is the FIRST Production & Artificial Lift course and the root of that
-- module's path.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/nodal.
--
-- Every assertion below is written from the ENGINE's output. Two of them are
-- deliberately written as PAIRS, because a one-sided check would pass on a
-- capstone that had quietly been recut into exactly the mistake the course
-- exists to correct.
--
-- ONE COINCIDENCE WORTH RECORDING, so a later reader does not mistake it for a
-- lookup. The golden publishes an oil IPR whose absolute open flow is
-- 1098.8090 stb/d, and this capstone grades a flowing pressure of 1098.6212
-- psia. They are 0.188 apart on a field whose tolerance is 5.5e-4. They are
-- different quantities in different units and the closeness is an accident of
-- two decimal digits, but it is the nearest approach anywhere in the sweep, so
-- the guard below is written with a tolerance tight enough to tell them apart
-- rather than one round enough to look tidy.
-- ============================================================================

do $$
declare
  v_structures integer;
  v_capstones  integer;
  v_questions  integer;
  v_graded     integer;
  v_pi     numeric; v_qb    numeric; v_q1650 numeric; v_aof   numeric;
  v_p2400  numeric; v_p3300 numeric;
  v_minq   numeric; v_minp  numeric; v_lowend numeric; v_highend numeric;
  v_valve  numeric; v_mid   numeric;
  v_opq    numeric; v_opp   numeric; v_unq   numeric; v_unp   numeric;
  v_swq    numeric; v_swp   numeric;
begin
  -- ---------------------------------------------------------------- shape --
  select count(*) into v_structures
    from public.academy_course_structures where app_slug = 'nodal' and active;
  if v_structures <> 3 then
    raise exception 'PD1 go-live refused: nodal has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions
    from public.academy_quiz_questions where app_slug = 'nodal';
  if v_questions <> 396 then
    raise exception 'PD1 go-live refused: nodal has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_capstones
    from public.academy_capstones where app_slug = 'nodal';
  if v_capstones <> 3 then
    raise exception 'PD1 go-live refused: nodal has % capstones, expected 3', v_capstones;
  end if;

  -- ------------------------------------------------- the scope assertion --
  -- This engine solves a node. It does not forecast decline, book a reserve,
  -- price a barrel, size a compressor or judge whether a well should be
  -- worked over. Its own header says the outflow is INJECTED, which means it
  -- does not even claim to own the black-oil traverse. Nothing here may
  -- certify past that.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'nodal'
     and (f->>'label' ilike '%reserve%'  or f->>'label' ilike '%npv%'
       or f->>'label' ilike '%decline%'  or f->>'label' ilike '%eur%'
       or f->>'label' ilike '%price%'    or f->>'label' ilike '%revenue%'
       or f->>'label' ilike '%probabilit%'
       or f->>'unit'  ilike '%usd%'      or f->>'unit'  ilike '%boe%'
       or f->>'unit'  ilike '%psig%');
  if v_graded <> 0 then
    raise exception 'PD1 go-live refused: % capstone field(s) grade a quantity this nodal engine cannot produce', v_graded;
  end if;

  -- --------------------------------------- the published-golden assertion --
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'nodal'
     and (abs((f->>'expected')::numeric - 1.8) < 0.0000005              -- published pi
       or abs((f->>'expected')::numeric - 1.2) < 0.0000005              -- published pi
       or abs((f->>'expected')::numeric - 0.9868421052631579) < 0.0000005
       or abs((f->>'expected')::numeric - 5760.0) < 0.001               -- published qmax
       or abs((f->>'expected')::numeric - 2533.333333333333) < 0.001
       or abs((f->>'expected')::numeric - 1244.4444444444443) < 0.001
       or abs((f->>'expected')::numeric - 3017.886602889778) < 0.001
       or abs((f->>'expected')::numeric - 1098.8090172238192) < 0.001   -- the near miss, see the header
       or abs((f->>'expected')::numeric - 124.7663077003361) < 0.001
       or abs((f->>'expected')::numeric - 828.401600769788) < 0.001     -- published operating rates
       or abs((f->>'expected')::numeric - 1787.2466746822697) < 0.001
       or abs((f->>'expected')::numeric - 886.7784263823106) < 0.001    -- published operating pressures
       or abs((f->>'expected')::numeric - 1441.249529177019) < 0.001
       or abs((f->>'expected')::numeric - 1779.210992451761) < 0.001
       or abs((f->>'expected')::numeric - 2014.4298483110988) < 0.001);
  if v_graded <> 0 then
    raise exception 'PD1 go-live refused: % graded field(s) sit within tolerance of a value the goldens publish, which makes them a lookup rather than a calculation', v_graded;
  end if;

  -- ------------------------------------------------------- load the values --
  select (f->>'expected')::numeric into v_pi      from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='nodal' and f->>'key'='ipr_pi_stbd_per_psi';
  select (f->>'expected')::numeric into v_qb      from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='nodal' and f->>'key'='ipr_q_at_bubble_stbd';
  select (f->>'expected')::numeric into v_q1650   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='nodal' and f->>'key'='ipr_q_at_1650psia_stbd';
  select (f->>'expected')::numeric into v_aof     from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='nodal' and f->>'key'='ipr_aof_stbd';
  select (f->>'expected')::numeric into v_p2400   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='nodal' and f->>'key'='ipr_pwf_at_2400stbd_psia';
  select (f->>'expected')::numeric into v_p3300   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='nodal' and f->>'key'='ipr_pwf_at_3300stbd_psia';
  select (f->>'expected')::numeric into v_minq    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='nodal' and f->>'key'='vlp_min_q_stbd';
  select (f->>'expected')::numeric into v_minp    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='nodal' and f->>'key'='vlp_min_bhp_psia';
  select (f->>'expected')::numeric into v_lowend  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='nodal' and f->>'key'='vlp_loaded_end_bhp_psia';
  select (f->>'expected')::numeric into v_highend from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='nodal' and f->>'key'='vlp_friction_end_bhp_psia';
  select (f->>'expected')::numeric into v_valve   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='nodal' and f->>'key'='liftgas_valve_pwf_psia';
  select (f->>'expected')::numeric into v_mid     from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='nodal' and f->>'key'='liftgas_mid_pmf_psia';
  select (f->>'expected')::numeric into v_opq     from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='nodal' and f->>'key'='node_op_q_stbd';
  select (f->>'expected')::numeric into v_opp     from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='nodal' and f->>'key'='node_op_pwf_psia';
  select (f->>'expected')::numeric into v_unq     from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='nodal' and f->>'key'='node_unstable_q_stbd';
  select (f->>'expected')::numeric into v_unp     from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='nodal' and f->>'key'='node_unstable_pwf_psia';
  select (f->>'expected')::numeric into v_swq     from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='nodal' and f->>'key'='sweep_pwh1176_q_stbd';
  select (f->>'expected')::numeric into v_swp     from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='nodal' and f->>'key'='sweep_pwh1176_pwf_psia';

  if v_pi is null or v_qb is null or v_q1650 is null or v_aof is null
     or v_p2400 is null or v_p3300 is null or v_minq is null or v_minp is null
     or v_lowend is null or v_highend is null or v_valve is null or v_mid is null
     or v_opq is null or v_opp is null or v_unq is null or v_unp is null
     or v_swq is null or v_swp is null then
    raise exception 'PD1 go-live refused: one or more of the eighteen graded fields is missing';
  end if;

  -- ------------------------- Associate: THE STRAIGHT LINE ABOVE THE BUBBLE --
  -- Above the bubble point the composite relation IS a straight line and
  -- nothing else, so the rate at the bubble point must be the index times the
  -- drawdown to it, exactly. This is the check that catches the single
  -- commonest error on this tier, which is calibrating the index off the test
  -- point as though the test had been taken above the bubble point. A capstone
  -- recut that way would still look plausible: every field would move together
  -- and stay in the right order. This identity is what would not survive it.
  if abs(v_qb - v_pi * 350) > 0.0000005 then
    raise exception 'PD1 go-live refused: the rate at the bubble point of % is not the productivity index of % times the 350 psi drawdown to it', v_qb, v_pi;
  end if;
  -- and the curve must fall, in both readings, with the open flow above all of it
  if not (v_q1650 > v_qb and v_p2400 > v_p3300 and v_aof > v_q1650) then
    raise exception 'PD1 go-live refused: the inflow readings are not monotone, rate at 1650 psia %, rate at the bubble point %, pressure at 2400 stb/d %, pressure at 3300 stb/d %, open flow %', v_q1650, v_qb, v_p2400, v_p3300, v_aof;
  end if;

  -- ------------------------- Professional: THE J SHAPE, AS A PAIR ----------
  -- The minimum must be a minimum, which means BOTH ends of the curve sit
  -- above it. Checking only the friction end would pass on a monotonically
  -- rising curve with no gravity limb at all, which is a well that has lost
  -- the entire reason the Expert tier can have two crossings.
  if not (v_lowend > v_minp and v_highend > v_minp) then
    raise exception 'PD1 go-live refused: the tubing curve minimum of % is not below both ends, low rate end % and open flow end %', v_minp, v_lowend, v_highend;
  end if;
  -- and the minimum must sit strictly inside the rate range it was found in
  if not (v_minq > 0 and v_minq < v_aof) then
    raise exception 'PD1 go-live refused: the curve minimum at % stb/d does not sit strictly inside the rate range up to the open flow of %', v_minq, v_aof;
  end if;
  -- The column outweighs the reservoir at BOTH ends. That is what makes this
  -- well unable to start itself and is the precondition for two crossings.
  if not (v_lowend > 3450 and v_highend > 3450) then
    raise exception 'PD1 go-live refused: the tubing curve ends at % and % psia do not both exceed the reservoir pressure, so the capstone well can now start itself and the Expert tier loses its double crossing', v_lowend, v_highend;
  end if;
  -- A static gas column only gains pressure with depth.
  if not (v_valve > v_mid and v_mid > 1225) then
    raise exception 'PD1 go-live refused: the injection column is not monotone with depth, tubing head 1225, midpoint %, valve depth %', v_mid, v_valve;
  end if;

  -- ------------------------- Expert: TWO CROSSINGS, AS A PAIR --------------
  -- The operating crossing must be at the HIGHER rate AND the LOWER pressure.
  -- Checking only the rate would pass on a capstone whose two crossings had
  -- both been recomputed on the same branch, which is the error the tier
  -- exists to prevent and which would leave both pairs of node fields wrong
  -- while still looking ordered.
  if v_opq <= v_unq then
    raise exception 'PD1 go-live refused: the operating rate of % does not exceed the unstable crossing rate of %', v_opq, v_unq;
  end if;
  if v_opp >= v_unp then
    raise exception 'PD1 go-live refused: the operating pressure of % is not below the unstable crossing pressure of %, so the two crossings are not on opposite sides of a falling outflow', v_opp, v_unp;
  end if;
  -- The window must be NARROW and NON-ZERO. Zero is tangency and no well at
  -- all; wide is a comfortable well, and a comfortable well cannot teach why
  -- the default scan misses anything.
  if not (v_opq - v_unq > 0 and v_opq - v_unq < 30) then
    raise exception 'PD1 go-live refused: the stable window is % stb/d, which is not the narrow non-zero window the scan-resolution argument needs', v_opq - v_unq;
  end if;
  if (v_opq - v_unq) / v_aof >= 0.01 then
    raise exception 'PD1 go-live refused: the stable window is % percent of the open flow, too wide for a 40-point scan to plausibly miss it', 100 * (v_opq - v_unq) / v_aof;
  end if;

  -- ------------------------- Expert: HOLDING ON A FALLING LIMB, AS A PAIR --
  -- The operating point must sit ABOVE the tubing minimum in pressure AND to
  -- the LEFT of it in rate. Only the first would pass on a well operating on
  -- the RISING friction limb, which is the ordinary textbook case and the one
  -- where none of this tier's argument applies.
  if v_opp <= v_minp then
    raise exception 'PD1 go-live refused: the operating pressure of % is not above the tubing curve minimum of %', v_opp, v_minp;
  end if;
  if v_opq >= v_minq then
    raise exception 'PD1 go-live refused: the operating rate of % is not to the left of the tubing curve minimum at %, so the capstone well no longer holds on a falling limb and module 3 loses its argument', v_opq, v_minq;
  end if;

  -- ------------------------- Expert: THE PAYOFF NEAR TANGENCY --------------
  -- Dropping the wellhead pressure must raise the rate AND lower the flowing
  -- pressure, and the rate gain must be large out of all proportion to the 60
  -- psi that bought it. If an edit made this a small correction, module 5
  -- would be teaching a payoff that is no longer in its own capstone.
  if not (v_swq > v_opq and v_swp < v_opp) then
    raise exception 'PD1 go-live refused: the swept point at % stb/d and % psia does not sit above and to the left of the operating point at % stb/d and % psia', v_swq, v_swp, v_opq, v_opp;
  end if;
  if (v_swq - v_opq) / v_opq < 0.20 then
    raise exception 'PD1 go-live refused: a 60 psi wellhead reduction buys only % percent more rate, so the capstone is no longer near tangency', 100 * (v_swq - v_opq) / v_opq;
  end if;

  -- ------------------------------------------------------------ the flip --
  update public.academy_apps
     set status = 'available'
   where slug = 'nodal' and status = 'coming_soon';

  if not exists (select 1 from public.academy_apps where slug = 'nodal' and status = 'available') then
    raise exception 'PD1 go-live refused: nodal did not reach status available';
  end if;

  raise notice 'PD1 go-live: nodal is available. This OPENS the Production & Artificial Lift module.';
end $$;
