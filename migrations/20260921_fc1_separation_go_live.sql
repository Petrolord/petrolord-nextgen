-- ============================================================================
-- FC1 GO-LIVE (HELD): Separation & Slug Catching flips to 'available'. The
-- FIRST Facilities course, and the first row the `facilities` module has ever
-- carried.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/separation. The 78 lessons, the teaching lab
-- (separationLab.js) and its three explorer panels (fc-separator-explorer,
-- fc-slug-explorer, fc-layout-explorer) ship in the zip and NOT in this
-- database, so a flip before the upload puts a live catalogue tile in front
-- of a route that does not exist. Every Facilities and Drilling wave on this
-- programme has held its go-live behind one verified upload.
--
-- Every assertion below is written from the ENGINES' output, never from the
-- intuition the capstone was designed with, and every one was checked in
-- Python against fields.json before it was written here. Eight of them are
-- EXACT CLOSED-FORM IDENTITIES reproducing the engine to 1e-9 or better (four
-- of the eight to 0.0), because separation sizing is a chain of closed forms:
-- a capstone quietly recut to another rate, retention, level, fill fraction,
-- droplet size or duty fails them outright.
--
-- The Expert checks are PAIRS, because this tier grades one judgement read
-- two ways on purpose: the two droplet crossings against their own residence
-- times, and worstAbsolute against worstRelative, which name DIFFERENT pairs
-- on the same plot. A pair that collapsed would grade one thing twice and
-- lose the finding.
--
-- NOTHING GRADED DEPENDS ON A HELD-FOR-LITERATURE QUANTITY, and that is
-- asserted rather than asserted-by-comment: every tier states its own vendor
-- K, so the K derating and the 0.12 floor are nowhere in the graded set.
-- ============================================================================

do $$
declare
  v_structures integer;
  v_capstones  integer;
  v_questions  integer;
  v_graded     integer;
  v_lessons    integer;
  v_modules    integer;
  -- Associate
  v_rhog numeric; v_qact numeric; v_vt numeric; v_dgas numeric; v_height numeric; v_margin numeric;
  -- Professional
  v_liqlen numeric; v_gasvel numeric; v_slugd numeric; v_finger numeric; v_flare numeric; v_pool numeric;
  -- Expert
  v_iface numeric; v_wdrop numeric; v_odrop numeric; v_pref numeric; v_abs numeric; v_rel numeric;
  -- closed-form working
  v_rhol numeric;
begin
  -- ---------------------------------------------------------------- shape --
  select count(*) into v_structures
    from public.academy_course_structures where app_slug = 'separation' and active;
  if v_structures <> 3 then
    raise exception 'FC1 go-live refused: separation has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions
    from public.academy_quiz_questions where app_slug = 'separation';
  if v_questions <> 396 then
    raise exception 'FC1 go-live refused: separation has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_capstones
    from public.academy_capstones where app_slug = 'separation';
  if v_capstones <> 3 then
    raise exception 'FC1 go-live refused: separation has % capstones, expected 3', v_capstones;
  end if;

  -- 78 lessons across three tiers, 26 each, in six modules each. The lab and
  -- the panels ship in the zip; the lesson KEYS are what this database holds,
  -- so this is the count that has to match the upload.
  select count(*) into v_lessons
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m,
         lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = 'separation' and s.active;
  if v_lessons <> 78 then
    raise exception 'FC1 go-live refused: separation carries % lesson keys, expected 78', v_lessons;
  end if;

  select count(*) into v_modules
    from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = 'separation' and s.active;
  if v_modules <> 18 then
    raise exception 'FC1 go-live refused: separation carries % modules, expected 18 (six per tier)', v_modules;
  end if;

  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'separation';
  if v_graded <> 18 then
    raise exception 'FC1 go-live refused: separation has % graded capstone fields, expected 18', v_graded;
  end if;

  select count(*) into v_graded
    from (select c.tier, count(*) n
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
           where c.app_slug = 'separation' group by c.tier) t
   where t.n <> 6;
  if v_graded <> 0 then
    raise exception 'FC1 go-live refused: % tier(s) do not grade exactly six fields', v_graded;
  end if;

  -- ------------------------------------------------- the scope assertion --
  -- This course sizes a vessel and judges a plot. It does not book a reserve,
  -- estimate an ultimate recovery, value a barrel, model a reservoir pressure
  -- or rank a portfolio. Areas, lengths, velocities, densities, residence
  -- times and setback distances are this course's subject.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'separation'
     and (f->>'label' ilike '%reserve%'    or f->>'label' ilike '%eur%'
       or f->>'label' ilike '%npv%'        or f->>'label' ilike '%irr%'
       or f->>'label' ilike '%permeab%'    or f->>'label' ilike '%porosit%'
       or f->>'label' ilike '%decline%'    or f->>'label' ilike '%skin%'
       or f->>'unit'  ilike '%usd%'        or f->>'unit'  ilike '%psi%'
       or f->>'unit'  ilike '%bbl%'        or f->>'unit'  ilike '%md%');
  if v_graded <> 0 then
    raise exception 'FC1 go-live refused: % capstone field(s) grade a quantity these sizing engines cannot produce', v_graded;
  end if;

  -- ------------------------------- the HELD-FOR-LITERATURE assertion --
  -- The K pressure derating and the 0.12 floor are a rule of thumb this
  -- module records without having checked it against the source. They are
  -- taught as a limit and must never be graded: every tier states its own
  -- vendor K, and the Expert layout is graded on radiation shortfalls only,
  -- never on a figure the spacing TABLE supplies.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'separation'
     and (f->>'label' ilike '%derat%'      or f->>'label' ilike '%floor%'
       or f->>'label' ilike '%nearfloor%'  or f->>'label' ilike '%near floor%'
       or f->>'label' ilike '%table%'      or f->>'label' ilike '%spacing requirement%');
  if v_graded <> 0 then
    raise exception 'FC1 go-live refused: % graded field(s) reach into a quantity held for the literature', v_graded;
  end if;

  -- --------------------------------------- the published-golden assertion --
  -- Headline values the goldens and the teaching digest publish. A graded
  -- field within its OWN tolerance of one of these is a lookup, not a
  -- calculation. ABANA, AGBAMI and the ERHA flow station are the LESSONS'
  -- streams; the capstone runs EJULEBE, ODEAMA and ADANGA and shares no
  -- stream, pressure, rate, droplet size, coordinate or duty with them.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         (values
            (2.239712),      -- ABANA gas density
            (4.825708),      -- ABANA-1 actual gas rate
            (2.052551),      -- ABANA-1 gas-required diameter
            (1.458422),      -- ABANA-1 terminal settling velocity
            (0.908065),      -- ABANA z at 600 psig, 95 degF
            (29.490437),     -- ABANA-2 actual gas rate
            (1273.148148),   -- ABANA-2 standard ft3/s
            (59.632353),     -- AGBAMI rate-weighted liquid density
            (60.613628),     -- the straight average that is NOT it
            (10.964382),     -- ABANA-1 height at 3 ft
            (2.136263),      -- ABANA-1 margin at 3 ft
            (23.270539),     -- ABANA-2 length at level 0.5
            (46.113917),     -- ABANA-2 length at level 0.3
            (391.666667),    -- ABANA slug working volume
            (10.527155),     -- ABANA slug vessel diameter
            (42.108619),     -- ABANA slug vessel length
            (225.184350),    -- ABANA finger length
            (64.6458),       -- ERHA flare setback
            (59.5294),       -- ERHA pool setback from centre
            (50.5294),       -- ERHA pool setback from edge
            (3.049149),      -- AGBAMI exact interface
            (2.026834),      -- the retired chord rule's interface
            (111.4796),      -- AGBAMI 500 micron water drop
            (1238.6620),     -- AGBAMI 150 micron water drop
            (43.8223),       -- ERHA worstAbsolute
            (0.597753),      -- ERHA worstRelative
            (0.125000),      -- verticalNoneAt650psig K
            (0.120000),      -- the K floor
            (0.005000),      -- the near-floor gap
            (1.004184),      -- the Stokes field-constant ratio
            (0.350000),      -- vertical mesh base K
            (0.300000),      -- the same K derated at 600 psig
            (0.008750),      -- the half-speed foil
            (0.004375),      -- the engine's 250 micron velocity
            (0.516129)       -- AGBAMI water share of the liquid area
         ) as g(v)
   where c.app_slug = 'separation'
     and abs(abs((f->>'expected')::numeric) - g.v) <= (f->>'tol')::numeric;
  if v_graded <> 0 then
    raise exception 'FC1 go-live refused: % graded field(s) sit within their own tolerance of a value the goldens or the digest publish, which makes them a lookup rather than a calculation', v_graded;
  end if;

  -- ------------------------------------ the handed-in-the-prompt assertion --
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         (values (31),(740),(105),(0.71),(7350),(2480),(29),(1.06),(4),(6.5),(0.33),(6.4),
                 (46),(415),(118),(0.66),(15500),(4300),(31),(1.03),(6),(0.4),(9),(0.45),
                 (620),(19800),(8),(0.65),(5),(26),(7),(0.75),(27),(47500),(6.31),(0.28),
                 (0.95),(24),(0.048),(41500),(4.73),(0.32),(1),(21),(290),(124),(0.73),
                 (9600),(7200),(0.8762),(1.07),(350),(150),(0.37),(11),(0.55),(70),(96),
                 (0.69),(1900),(30),(1.05),(3),(3.5),(4.5),(2),(100),(47),(0)) as h(v)
   where c.app_slug = 'separation'
     and abs(abs((f->>'expected')::numeric) - h.v) <= (f->>'tol')::numeric;
  if v_graded <> 0 then
    raise exception 'FC1 go-live refused: % graded field(s) land on a number the learner is handed in a prompt, which makes the field a transcription rather than a calculation', v_graded;
  end if;

  -- ------------------------------------- the cross-tier prompt-leak gate --
  -- FC1's tiers do not chain, so this should be zero by construction: the
  -- Associate sizes EJULEBE-1, the Professional EJULEBE-2 with ODEAMA, the
  -- Expert EJULEBE-3, EJULEBE-4 and ADANGA. Asserted anyway, because a later
  -- recut that reuses a stream across tiers would silently hand an answer over.
  select count(*) into v_graded
    from public.academy_capstones c,
         public.academy_capstones c2,
         lateral jsonb_array_elements(c2.fields) f
   where c.app_slug = 'separation' and c2.app_slug = 'separation' and c.tier <> c2.tier
     and replace(c.prompt, ',', '') like '%' || (f->>'expected') || '%';
  if v_graded <> 0 then
    raise exception 'FC1 go-live refused: % capstone prompt(s) state a graded value belonging to another tier', v_graded;
  end if;

  -- ------------------------------------------------------- load the values --
  select (f->>'expected')::numeric into v_rhog   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='separation' and f->>'key'='ejulebe1_gas_density_lbft3';
  select (f->>'expected')::numeric into v_qact   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='separation' and f->>'key'='ejulebe1_gas_actual_ft3s';
  select (f->>'expected')::numeric into v_vt     from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='separation' and f->>'key'='ejulebe1_terminal_velocity_fts';
  select (f->>'expected')::numeric into v_dgas   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='separation' and f->>'key'='ejulebe1_gas_diameter_ft';
  select (f->>'expected')::numeric into v_height from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='separation' and f->>'key'='ejulebe1_height_ft';
  select (f->>'expected')::numeric into v_margin from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='separation' and f->>'key'='ejulebe1_velocity_margin';
  select (f->>'expected')::numeric into v_liqlen from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='separation' and f->>'key'='ejulebe2_liquid_length_ft';
  select (f->>'expected')::numeric into v_gasvel from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='separation' and f->>'key'='ejulebe2_gas_velocity_fts';
  select (f->>'expected')::numeric into v_slugd  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='separation' and f->>'key'='ejulebe_slug_vessel_diameter_ft';
  select (f->>'expected')::numeric into v_finger from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='separation' and f->>'key'='ejulebe_finger_length_ft';
  select (f->>'expected')::numeric into v_flare  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='separation' and f->>'key'='odeama_flare_setback_m';
  select (f->>'expected')::numeric into v_pool   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='separation' and f->>'key'='odeama_pool_setback_edge_m';
  select (f->>'expected')::numeric into v_iface  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='separation' and f->>'key'='ejulebe3_interface_height_ft';
  select (f->>'expected')::numeric into v_wdrop  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='separation' and f->>'key'='ejulebe3_water_drop_fall_s';
  select (f->>'expected')::numeric into v_odrop  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='separation' and f->>'key'='ejulebe3_oil_drop_rise_s';
  select (f->>'expected')::numeric into v_pref   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='separation' and f->>'key'='ejulebe4_preferred_height_ft';
  select (f->>'expected')::numeric into v_abs    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='separation' and f->>'key'='adanga_worst_absolute_shortfall_m';
  select (f->>'expected')::numeric into v_rel    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='separation' and f->>'key'='adanga_worst_relative_fraction';

  if v_rhog is null or v_qact is null or v_vt is null or v_dgas is null or v_height is null or v_margin is null
     or v_liqlen is null or v_gasvel is null or v_slugd is null or v_finger is null or v_flare is null or v_pool is null
     or v_iface is null or v_wdrop is null or v_odrop is null or v_pref is null or v_abs is null or v_rel is null then
    raise exception 'FC1 go-live refused: one or more of the eighteen graded fields is missing';
  end if;

  -- ------------------------- Associate: EXACT CLOSED-FORM IDENTITIES --
  -- The chain is closed form from the prompt inputs onward. The liquid the
  -- gas load sees is weighted BY RATE, not averaged: 29 degrees API oil at
  -- 7350 bopd with water of specific gravity 1.06 at 2480 bpd.
  v_rhol := (141.5 / (131.5 + 29) * 62.4 * 7350 + 1.06 * 62.4 * 2480) / (7350 + 2480);

  -- Souders-Brown at the VENDOR K of 0.33. If this fails, either the stated
  -- gravities moved or somebody graded a derated K.
  if abs(v_vt - 0.33 * sqrt((v_rhol - v_rhog) / v_rhog)) > 1e-9 then
    raise exception 'FC1 go-live refused: the terminal velocity % is not Souders-Brown at the vendor K of 0.33 on a rate-weighted liquid of %', v_vt, v_rhol;
  end if;

  -- The diameter comes from the GAS: the area the rate needs at that velocity.
  if abs(v_dgas - sqrt(4 * (v_qact / v_vt) / pi())) > 1e-9 then
    raise exception 'FC1 go-live refused: the gas-required diameter % is not the area the rate % needs at the settling velocity %', v_dgas, v_qact, v_vt;
  end if;

  -- The margin is the area ratio at the vendor's 6.4 ft, so it is the square
  -- of the diameter ratio and nothing else.
  if abs(v_margin - power(6.4 / v_dgas, 2)) > 1e-9 then
    raise exception 'FC1 go-live refused: the velocity margin % is not the square of 6.4 ft over the gas-required diameter %', v_margin, v_dgas;
  end if;

  -- The height comes from the LIQUID: the retention volume over the vendor
  -- cross-section, plus the 6.5 ft allowance. 9830 bpd for 4 minutes.
  -- 1440.0, not 1440: integer division truncates 39320 / 1440 to 27 and the
  -- identity fails by a third of a minute of retention. The Python check that
  -- proved this identity to 0.0 could not see it, because only SQL does this.
  if abs(v_height - (((7350 + 2480) * 4 / 1440.0 * 5.614583333333333) / (pi() * power(6.4, 2) / 4) + 6.5)) > 1e-9 then
    raise exception 'FC1 go-live refused: the height % is not the 4 minute retention volume over the 6.4 ft cross-section plus the 6.5 ft allowance', v_height;
  end if;

  -- The vendor vessel is bigger than the gas demands, which is why it passes.
  if not (v_dgas < 6.4 and v_margin > 1) then
    raise exception 'FC1 go-live refused: the gas-required diameter % against the vendor 6.4 ft gives a margin of %, which is not the passing vessel the tier grades', v_dgas, v_margin;
  end if;

  -- ------------------------- Professional: THE FOUR CLOSED FORMS --
  -- A slug catcher holds more than the slug: 620 bbl plus 8 minutes of
  -- 19800 bpd still arriving, filled to 0.65, shaped to an L/D of 5.
  if abs((pi() / 4 * 5) * power(v_slugd, 3) - (620 + 19800 * 8 / 1440.0) / 0.65 * 5.614583333333333) > 1e-6 then
    raise exception 'FC1 go-live refused: a vessel of diameter % at an L/D of 5 does not hold the working volume the slug and its arrival imply', v_slugd;
  end if;

  -- The same slug as a harp: seven fingers of 26 inch bore filled to 0.75.
  if abs(v_finger - (620 / 0.75 / 7 * 5.614583333333333) / (pi() / 4 * power(26.0 / 12, 2))) > 1e-9 then
    raise exception 'FC1 go-live refused: the finger length % is not the working volume per finger over a 26 inch bore', v_finger;
  end if;

  -- A setback is COMPUTED from its own duty: a point source radiating
  -- 0.28 of 27 kg/s at 47500 kJ/kg, transmissivity 0.95, allowable 6.31.
  if abs(v_flare - sqrt(0.95 * 0.28 * 27 * 47500 / (4 * pi() * 6.31))) > 1e-9 then
    raise exception 'FC1 go-live refused: the flare setback % is not the point-source distance its own duty implies', v_flare;
  end if;

  -- The pool fire's duty is its burning AREA, and the answer is measured from
  -- the pool EDGE, which is the radius from centre less the 12 m half width.
  -- That 9 m class of difference is the defect that failed open on ERHA.
  if abs(v_pool - (sqrt(1 * 0.32 * (0.048 * (pi() / 4 * power(24, 2)) * 41500) / (4 * pi() * 4.73)) - 12)) > 1e-9 then
    raise exception 'FC1 go-live refused: the pool setback % is not the centre distance of its own burning area less the 12 m half width', v_pool;
  end if;

  -- The liquid controls this vessel, and the length it demands is the
  -- retention volume over the liquid area a level of 0.45 cuts at 9 ft.
  if abs(v_liqlen * 27.76538578 - (15500 + 4300) * 6 / 1440.0 * 5.614583333333333) > 1e-6 then
    raise exception 'FC1 go-live refused: the liquid length % over the published liquid area of 27.76538578 ft2 is not the 6 minute retention volume', v_liqlen;
  end if;
  if abs(v_gasvel * 35.85186546 - 19.15142241) > 1e-6 then
    raise exception 'FC1 go-live refused: the gas velocity % through the published gas area of 35.85186546 ft2 is not the actual gas rate', v_gasvel;
  end if;

  -- ------------------------- Expert: THE PAIRS, AS SEPARATIONS --
  -- The exact interface and the oil layer above it add back to the liquid
  -- depth, 11 ft at a level of 0.55. That is the property the retired chord
  -- rule never had, and it is why both retired layers could be thin at once.
  if abs((11 * 0.55 - v_iface) - 2.5227197826755834) > 1e-9 then
    raise exception 'FC1 go-live refused: the interface at % and the oil layer above it do not add back to the 6.05 ft liquid depth', v_iface;
  end if;
  if not (v_iface > 0 and v_iface < 11 * 0.55) then
    raise exception 'FC1 go-live refused: the interface % is not inside the liquid', v_iface;
  end if;

  -- Both droplet crossings are survived, and they are survived by very
  -- different margins. The water drop clears its 420 s of oil residence by
  -- about 32 s; the oil drop clears its 540 s of water residence by nearly
  -- 200. A recut that flipped either verdict would change what the tier
  -- teaches, and a recut that made them alike would grade one thing twice.
  if not (v_wdrop < 420 and 420 - v_wdrop < 40) then
    raise exception 'FC1 go-live refused: the water drop fall of % s is not the narrow clearance of the 420 s oil residence the tier grades', v_wdrop;
  end if;
  if not (v_odrop < 540 and 540 - v_odrop > 100) then
    raise exception 'FC1 go-live refused: the oil drop rise of % s is not the comfortable clearance of the 540 s water residence the tier grades', v_odrop;
  end if;
  if not (v_wdrop > v_odrop) then
    raise exception 'FC1 go-live refused: the water crossing % and the oil crossing % are not the ordered pair the two-verdict lesson grades', v_wdrop, v_odrop;
  end if;

  -- The preferred vessel is the smallest FEASIBLE one in band, which is NOT
  -- the shortest vessel in the family. The 4.5 ft row is shorter at 8.654794
  -- and the 6 ft row shorter still at 7.930822, and both are out of band; the
  -- 3 and 3.5 ft rows are shorter in diameter and infeasible on gas capacity.
  -- A rule that took the shortest, or the first row in band, would land
  -- elsewhere and fail here.
  if not (v_pref > 8.654794 and v_pref < 9.735476) then
    raise exception 'FC1 go-live refused: the preferred height % is not the 4 ft row, the smallest feasible vessel in band, which is taller than the shorter out-of-band rows', v_pref;
  end if;

  -- worstAbsolute and worstRelative name DIFFERENT pairs on the same plot.
  -- The absolute winner is short by 53.82 m of a 100 m requirement, which is
  -- 0.538 of it; the relative winner is short by a larger FRACTION of a
  -- smaller requirement. If the relative winner's fraction ever fell to the
  -- absolute winner's own fraction, one pair would be winning both and the
  -- finding the module is built on would be gone.
  if not (v_rel > v_abs / 100 + 0.05) then
    raise exception 'FC1 go-live refused: the worst relative fraction % is not clear of the worst absolute pair''s own fraction %, so the two rankings no longer name different pairs', v_rel, v_abs / 100;
  end if;
  if not (v_abs > 43.8223 and v_rel < 1) then
    raise exception 'FC1 go-live refused: the worst absolute shortfall % is not the radiation breach that outruns the spacing breach on the same pair', v_abs;
  end if;

  -- ------------------------------------------------------------ the flip --
  update public.academy_apps
     set status = 'available'
   where slug = 'separation' and status = 'coming_soon';

  if not exists (select 1 from public.academy_apps where slug = 'separation' and status = 'available') then
    raise exception 'FC1 go-live refused: separation did not reach status available';
  end if;

  raise notice 'FC1 go-live: separation is available. Facilities has its first course.';
end $$;
