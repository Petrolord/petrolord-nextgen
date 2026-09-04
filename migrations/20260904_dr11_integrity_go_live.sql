-- ============================================================================
-- DR11 GO-LIVE (HELD): Well Integrity & P&A flips to 'available'.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/integrity.
--
-- Every assertion below is written from the ENGINE's output. This course paid
-- for that rule three times over: two fails-open branches that answered GREEN
-- for states nobody had checked, and a brief of mine that claimed flow
-- potential only bites when the secondary envelope is missing, which the
-- engine flatly contradicted.
-- ============================================================================

do $$
declare
  c_common   constant integer := 3;          -- common WBEs in the as-found table
  c_rho_g    constant numeric := 9.80665;
  v_structures integer;
  v_capstones  integer;
  v_questions  integer;
  v_graded     integer;
  v_p9  numeric; v_s13 numeric; v_d19 numeric;
  v_seat numeric; v_p11 numeric; v_d17 numeric;
  v_tub numeric; v_shoe numeric; v_mawop numeric;
  v_tvd numeric; v_maaspb numeric; v_gas numeric;
  v_slurry numeric; v_spacer numeric; v_settle numeric;
  v_above numeric; v_annular numeric; v_takeoff numeric;
begin
  -- ---------------------------------------------------------------- shape --
  select count(*) into v_structures
    from public.academy_course_structures where app_slug = 'integrity' and active;
  if v_structures <> 3 then
    raise exception 'DR11 go-live refused: integrity has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions
    from public.academy_quiz_questions where app_slug = 'integrity';
  if v_questions <> 396 then
    raise exception 'DR11 go-live refused: integrity has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_capstones
    from public.academy_capstones where app_slug = 'integrity';
  if v_capstones <> 3 then
    raise exception 'DR11 go-live refused: integrity has % capstones, expected 3', v_capstones;
  end if;

  -- ------------------------------------------------- the scope assertion --
  -- This engine reports statuses, categories, pressure limits, plug geometry
  -- and rule verdicts. It computes no leak RATE, no PROBABILITY of failure, no
  -- TIME to failure and no COST, because it has no input that could produce
  -- one. Its own header calls the programme a PLANNING checklist rather than
  -- an operational procedure, and nothing here may certify past that.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'integrity'
     and (f->>'label' ilike '%rate%'        or f->>'label' ilike '%probabilit%'
       or f->>'label' ilike '%likelihood%'  or f->>'label' ilike '%cost%'
       or f->>'label' ilike '%time to%'     or f->>'label' ilike '%remaining life%'
       or f->>'unit'  ilike '%/day%'        or f->>'unit'  ilike '%usd%'
       or f->>'unit'  ilike '%year%');
  if v_graded <> 0 then
    raise exception 'DR11 go-live refused: % capstone field(s) grade a rate, a probability, a time or a cost, none of which this engine can produce', v_graded;
  end if;

  -- --------------------------------------- the published-golden assertion --
  -- Only the CONTINUOUS values are checked here. A small integer graded field
  -- collides with something in any large fixture (a survey inclination, an
  -- array index) and that is a coincidence rather than a lookup, which is why
  -- the wave sweep separates integer notes from real collisions. The six
  -- Associate counts are integers and are checked by identity below instead.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'integrity'
     and (abs((f->>'expected')::numeric - 20585228.211031675) < 10        -- published MAASP fixture allowable
       or abs((f->>'expected')::numeric - 11905664.170969129) < 10        -- published MAWOP
       or abs((f->>'expected')::numeric - 17606905.05541501) < 10         -- published 9-5/8 row
       or abs((f->>'expected')::numeric - 26855228.63225454) < 10         -- published 7 in liner row
       or abs((f->>'expected')::numeric - 1435.457478935) < 0.0005        -- published 9-5/8 TVD
       or abs((f->>'expected')::numeric - 1167.341923843) < 0.0005        -- published liner TVD
       or abs((f->>'expected')::numeric - 997.040030276) < 0.0005);       -- published tubing TVD
  if v_graded <> 0 then
    raise exception 'DR11 go-live refused: % graded field(s) sit within tolerance of a value the goldens publish, which makes them a lookup rather than a calculation', v_graded;
  end if;

  -- ------------------------------------------------------- load the values --
  select (f->>'expected')::numeric into v_p9      from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='integrity' and f->>'key'='asfound_primary_count';
  select (f->>'expected')::numeric into v_s13     from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='integrity' and f->>'key'='asfound_secondary_count';
  select (f->>'expected')::numeric into v_d19     from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='integrity' and f->>'key'='asfound_distinct_element_count';
  select (f->>'expected')::numeric into v_seat    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='integrity' and f->>'key'='asfound_seat_total';
  select (f->>'expected')::numeric into v_p11     from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='integrity' and f->>'key'='secured_primary_count';
  select (f->>'expected')::numeric into v_d17     from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='integrity' and f->>'key'='secured_distinct_element_count';
  select (f->>'expected')::numeric into v_tub     from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='integrity' and f->>'key'='mawop_a_tubing_row_pa';
  select (f->>'expected')::numeric into v_shoe    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='integrity' and f->>'key'='mawop_a_shoe_row_pa';
  select (f->>'expected')::numeric into v_mawop   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='integrity' and f->>'key'='mawop_a_pa';
  select (f->>'expected')::numeric into v_tvd     from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='integrity' and f->>'key'='mawop_a_governing_tvd_m';
  select (f->>'expected')::numeric into v_maaspb  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='integrity' and f->>'key'='maasp_b_pa';
  select (f->>'expected')::numeric into v_gas     from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='integrity' and f->>'key'='maasp_gasfilled_tubing_row_pa';
  select (f->>'expected')::numeric into v_slurry  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='integrity' and f->>'key'='plug_slurry_m3';
  select (f->>'expected')::numeric into v_spacer  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='integrity' and f->>'key'='plug_spacer_behind_m3';
  select (f->>'expected')::numeric into v_settle  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='integrity' and f->>'key'='plug_top_settle_m';
  select (f->>'expected')::numeric into v_above   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='integrity' and f->>'key'='above_source_margin_m';
  select (f->>'expected')::numeric into v_annular from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='integrity' and f->>'key'='annular_cement_margin_m';
  select (f->>'expected')::numeric into v_takeoff from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='integrity' and f->>'key'='program_slurry_takeoff_m3';

  if v_p9 is null or v_s13 is null or v_d19 is null or v_seat is null
     or v_p11 is null or v_d17 is null or v_tub is null or v_shoe is null
     or v_mawop is null or v_tvd is null or v_maaspb is null or v_gas is null
     or v_slurry is null or v_spacer is null or v_settle is null
     or v_above is null or v_annular is null or v_takeoff is null then
    raise exception 'DR11 go-live refused: one or more of the eighteen graded fields is missing';
  end if;

  -- ------------------------------------------- Associate: the seat identity --
  -- THE IDENTITY THE WHOLE TIER RESTS ON. Seats are not elements. A common
  -- element is counted by both envelopes, so the seat total exceeds the
  -- physical count by exactly the number of common elements, and that gap IS
  -- the independence the two-barrier rule assumes and this well does not have.
  if v_seat <> v_p9 + v_s13 then
    raise exception 'DR11 go-live refused: the seat total of % is not the primary count of % plus the secondary count of %', v_seat, v_p9, v_s13;
  end if;
  if v_seat - v_d19 <> c_common then
    raise exception 'DR11 go-live refused: seats less distinct elements is %, not the % common WBEs the capstone describes', v_seat - v_d19, c_common;
  end if;
  -- and the gap must NOT be zero, or the capstone has lost its whole point
  if v_seat = v_d19 then
    raise exception 'DR11 go-live refused: the seat total equals the element count, so the capstone no longer has any common WBE and the independence lesson has nothing to bite on';
  end if;
  if v_d17 >= v_d19 then
    raise exception 'DR11 go-live refused: the secured table has % distinct elements, not fewer than the as-found %, so securing the well no longer simplifies it', v_d17, v_d19;
  end if;
  for v_graded in select 1 loop exit; end loop;
  if v_p9 <> floor(v_p9) or v_s13 <> floor(v_s13) or v_d19 <> floor(v_d19)
     or v_seat <> floor(v_seat) or v_p11 <> floor(v_p11) or v_d17 <> floor(v_d17) then
    raise exception 'DR11 go-live refused: an Associate count is not a whole number of elements';
  end if;

  -- ------------------------------ Professional: the inversion, as a PAIR ----
  -- THE GOVERNING ROW MUST BE STRICTLY BELOW BOTH NAMED ROWS. That is not a
  -- tautology: it says a THIRD element governs, which is the whole point of
  -- the tier. The outer casing carries the HIGHEST rating on this annulus and
  -- governs anyway, because its RP 90 role factor is the lowest. Asserting
  -- only that the MAWOP is a minimum would pass on a well where the tubing
  -- governed and the inversion never happened.
  if v_mawop >= v_tub then
    raise exception 'DR11 go-live refused: the A annulus MAWOP of % is not below the tubing row of %, so a third element no longer governs and the RP 90 inversion is gone', v_mawop, v_tub;
  end if;
  if v_mawop >= v_shoe then
    raise exception 'DR11 go-live refused: the A annulus MAWOP of % is not below the shoe row of %', v_mawop, v_shoe;
  end if;
  if v_tvd <= 0 then
    raise exception 'DR11 go-live refused: the governing true vertical depth of % is not positive', v_tvd;
  end if;
  if v_maaspb <= 0 then
    raise exception 'DR11 go-live refused: the B annulus MAASP of % is not positive', v_maaspb;
  end if;

  -- THE NEGATIVE ROW. The displacement case must come back BELOW zero, because
  -- the tier's closing module is built on a row that hydrostatic alone busts.
  -- If an edit made it positive, m05 would be teaching a case that no longer
  -- exists, and the clamp and the flag would never fire.
  if v_gas >= 0 then
    raise exception 'DR11 go-live refused: the gas-filled displacement row of % is not negative, so the capstone no longer exercises the clamp and the negative flag', v_gas;
  end if;

  -- ---------------------------------------------- Expert: plug and programme --
  if v_slurry <= 0 or v_spacer <= 0 then
    raise exception 'DR11 go-live refused: the slurry % or the spacer behind % is not positive', v_slurry, v_spacer;
  end if;
  if v_spacer >= v_slurry then
    raise exception 'DR11 go-live refused: the spacer behind of % is not smaller than the slurry of %', v_spacer, v_slurry;
  end if;
  -- A plug always settles DOWNWARD when the stinger comes out, because the
  -- slurry redistributes from annulus plus stinger bore into the wider hole.
  if v_settle <= 0 then
    raise exception 'DR11 go-live refused: the plug settle of % is not positive, so the plug no longer settles below its as-pumped top', v_settle;
  end if;

  -- A PAIR OF SHORTFALLS THAT MUST BOTH STAY NEGATIVE. The Expert tier is
  -- built on reading WHY this programme fails. Either margin turning positive
  -- would leave two modules teaching a failure that no longer happens, and the
  -- sign is part of each answer rather than a decoration on it.
  if v_above >= 0 then
    raise exception 'DR11 go-live refused: the above-source margin of % is not negative, so the capstone programme now passes that rule and the Expert tier loses its worked failure', v_above;
  end if;
  if v_annular >= 0 then
    raise exception 'DR11 go-live refused: the annular cement margin of % is not negative', v_annular;
  end if;

  if v_takeoff <= v_slurry then
    raise exception 'DR11 go-live refused: the programme takeoff of % does not exceed the single reservoir plug slurry of %', v_takeoff, v_slurry;
  end if;

  -- ------------------------------------------------------------ the flip --
  update public.academy_apps
     set status = 'available'
   where slug = 'integrity' and status = 'coming_soon';

  if not exists (select 1 from public.academy_apps where slug = 'integrity' and status = 'available') then
    raise exception 'DR11 go-live refused: integrity did not reach status available';
  end if;

  raise notice 'DR11 go-live: integrity is available. 3 structures, 396 questions, 3 capstones, 18 graded fields, all assertions passed.';
end $$;
