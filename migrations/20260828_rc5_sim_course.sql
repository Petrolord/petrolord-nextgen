-- ============================================================================
-- RC5: Reservoir Simulation Essentials joins the catalog, the FIFTH Reservoir
-- Engineering course (plan of record: petrolord-suite docs/scope/
-- NextGen-Reservoir-Courses-PLAN.md, owner-approved 2026-08-27).
--
-- Catalog row (module 'reservoir' mapped from day one so the Expert bridge
-- trigger can issue Suite discount codes) plus the three capstones. NO
-- prerequisite: owner Q2 set no hard gate inside the reservoir module, so
-- RC1 Decline Curve Analysis, RC2 Material Balance, RC3 SCAL and RC4
-- Waterflood Management are RECOMMENDED before this course, not required.
--
-- THE SCOPE DECISION THAT SHAPES THIS COURSE (owner-approved before the build):
-- @petrolord/engines emits Eclipse-format decks and does grid geometry. It has
-- NO flow solver, so this course can compute deck CONSTRUCTION quantities and
-- cannot compute simulated results. Every one of the eighteen graded fields is
-- therefore a construction quantity. Results literacy IS taught, at the Expert
-- tier, module m05 'Reading Results', and it grades nothing at all: the module
-- says so in its own first lesson. Grading a simulated result would mean
-- grading against numbers nobody has checked, which is the failure the whole
-- reservoir module has been built to avoid.
--
-- The Suite's Reservoir Simulation Studio is NAMED in the course as the place
-- a Petrolord deck goes to be run (Expert m04 l05 deck security, m05 l05 where
-- this course stops). It promises nothing about that Studio's own scope.
--
-- Oracle values reproduced from @petrolord/engines in Node BEFORE this
-- migration was written (RC5-TRUTH.md section J, verified field by field
-- against the fixture by verify_section_j.py); simLab.test.js pins all
-- eighteen through the course's own teaching lab, so a panel and the live
-- grader cannot drift apart. Fixture: test-data/ekene-dynamic/sim.json, with
-- field.json, mbal.json, scal.json and waterflood.json supplying the statics,
-- the tank constants, the displacement design and the monthly ledger.
--
-- TWO CAPSTONE FIELDS WERE REPLACED BEFORE SEEDING, both for the same reason
-- RC4's replacement was made, and both caught by the same design review:
--   * Professional `bo_at_pb` was a ROW OF THE PVT TABLE the Associate tier
--     reads and grades its way around. Replaced by `correlated_bo_at_pi`
--     = 1.2292846175634324, which is the CORRELATED value at initial pressure
--     and exists nowhere in the deck, so it can only be obtained by running
--     the correlation the Professional tier is taught.
--   * Expert originally graded the column-tapered volumetric convention, which
--     Professional m02 owns outright and teaches at full precision. Replaced by
--     `calibration_regional_mean_m` = 1570.026311, the tuned kriging parameter,
--     which no lower tier prints.
-- Pairwise tolerance-collision check across all eighteen: 0 fatal, 0 notes.
--
-- STATUS deliberately left 'coming_soon'. The flip to 'available' is what
-- makes the course enrollable and it is held in
-- 20260828_rc5_sim_go_live.sql until a production upload carries the
-- /dashboard/apps/sim route.
-- ============================================================================

-- ------------------------------------------------ 1. the catalog row
insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)
values ('sim', 'Reservoir Simulation Essentials', 'reservoir', 15, 'coming_soon', null)
on conflict (slug) do nothing;

-- ------------------------------------------------ 2. the capstones
insert into public.academy_capstones
    (app_slug, tier, cert_tier, dataset, title, prompt, fields)
values
(
  'sim', 'beginner', 'associate',
  'ekene-dynamic/sim.json (940-line Eclipse-format deck, 30x30x5 grid, six sections)',
  'Read the deck',
  'Read the Ekene simulation deck as it stands. It is 940 lines in the six standard sections, RUNSPEC, GRID, PROPS, SOLUTION, SUMMARY and SCHEDULE, in that order, in FIELD units. Report the total number of grid cells the RUNSPEC dimensions imply, the shallowest column top in the TOPS array in feet, the thickness of layer 1 in feet, the first water saturation in the SWOF table, the last gas saturation in the SGOF table, and the number of connections a single vertical Ekene producer carries. Every one of these is read or counted from the deck text itself; none of them requires a calculation the deck does not already contain.',
  jsonb_build_array(
    jsonb_build_object('key','deck_cell_count',           'label','Total grid cells',                        'unit','cells',    'expected',4500,                 'tol',0),
    jsonb_build_object('key','crest_top_ft',              'label','Shallowest column top',                   'unit','ft',       'expected',5055.774278215223,   'tol',0.05),
    jsonb_build_object('key','layer1_dz_ft',              'label','Layer 1 thickness',                       'unit','ft',       'expected',7.411104817049187,   'tol',0.001),
    jsonb_build_object('key','swof_first_sw',             'label','First SWOF water saturation',             'unit','fraction', 'expected',0.35,                 'tol',0.0005),
    jsonb_build_object('key','sgof_last_sg',              'label','Last SGOF gas saturation',                'unit','fraction', 'expected',0.65,                 'tol',0.0005),
    jsonb_build_object('key','vertical_connection_count', 'label','Connections on a vertical producer',      'unit','count',    'expected',5,                    'tol',0)
  )
),
(
  'sim', 'intermediate', 'professional',
  'ekene-dynamic/sim.json against field.json (NG5 booking), the six mapped well tops and Standing correlations',
  'Reconcile the model against the field',
  'Audit the Ekene deck against everything outside it. Report the deck''s stock tank oil initially in place under the ECLIPSE CELL-CENTRE rule, where a layer contributes oil only if its own centre depth lies above the contact at 1560 m; the gap between that and the NG5 volumetric booking of 12139208.107496763 stb, as a percentage OF THE BOOKING, signed so a smaller deck reads negative; the number of grid cells that rule assigns to oil; the top depth in metres the deck gives at Ekene-2, whose logged top is 1565 m at map position (600, 1150); the oil formation volume factor Standing''s correlation returns at the initial pressure of 2600 psia for a 32 API oil with 400 scf/stb of solution gas at 180 degrees Fahrenheit and a gas gravity of 0.75; and the percentage by which the solution gas that same correlation returns at the bubble point of 2000 psia exceeds the designed 400 scf/stb.',
  jsonb_build_array(
    jsonb_build_object('key','deck_stoiip_stb',           'label','Deck STOIIP, cell-centre rule',           'unit','stb',      'expected',12132366.897955146, 'tol',5000),
    jsonb_build_object('key','stoiip_vs_booking_pct',     'label','Gap against the NG5 booking',             'unit','percent',  'expected',-0.05635630826191784,'tol',0.005),
    jsonb_build_object('key','oil_cells_centre_rule',     'label','Oil cells under the cell-centre rule',    'unit','cells',    'expected',266,                  'tol',0),
    jsonb_build_object('key','ekene2_deck_top_m',         'label','Deck top depth at Ekene-2',               'unit','m',        'expected',1564.3183173003902,  'tol',0.005),
    jsonb_build_object('key','correlated_bo_at_pi',       'label','Correlated Bo at initial pressure',       'unit','rb/stb',   'expected',1.2292846175634324,  'tol',0.0005),
    jsonb_build_object('key','correlated_rs_gap_pct',     'label','Correlated Rs above the designed 400',    'unit','percent',  'expected',5.484806880676496,   'tol',0.02)
  )
),
(
  'sim', 'advanced', 'expert',
  'ekene-dynamic/sim.json (deviated side-track, 36-period history, seven broken specifications)',
  'Build one and prove it',
  'Build the parts of the Ekene deck that require a decision. First intersect the Ekene-6 side-track against the grid: it runs from a heel at map position (1900, 1800) to a toe at (1500, 2100), descending from the top of the sand to the base of the column, on a 100 m grid whose origin sits half a cell south-west of the field origin. Report the number of merged connections and the number of distinct (i, j) columns they fall in. Then calibrate: bisect on the kriging regional mean, in metres true vertical depth, until the deck''s CELL-CENTRE oil volume lands on the NG5 booking of 12139208.107496763 stb, and report the mean you converge on. Then build the history: convert the RC4 monthly ledger to rates by each period''s own calendar day count, and report the total oil the 36 periods carry when each rate is multiplied back by the days it spans. Then count how many of the fixture''s deliberately broken specifications the validator refuses, counting CASES rather than error messages. Finally report the equilibration datum depth in feet, which is computed as the mean of all 900 column top depths rather than chosen.',
  jsonb_build_array(
    jsonb_build_object('key','deviated_connection_count',   'label','Side-track merged connections',         'unit','count',    'expected',11,                   'tol',0),
    jsonb_build_object('key','deviated_distinct_columns',   'label','Side-track distinct columns',           'unit','count',    'expected',8,                    'tol',0),
    jsonb_build_object('key','calibration_regional_mean_m', 'label','Calibrated kriging regional mean',      'unit','m TVD',    'expected',1570.026311,          'tol',0.005),
    jsonb_build_object('key','history_total_oil_stb',       'label','History oil total, round trip',         'unit','stb',      'expected',176923.83644033302,  'tol',50),
    jsonb_build_object('key','validator_rules_refused',     'label','Broken specifications refused',         'unit','count',    'expected',7,                    'tol',0),
    jsonb_build_object('key','equil_datum_depth_ft',        'label','Equilibration datum depth',             'unit','ft',       'expected',5129.97013005754,    'tol',0.05)
  )
)
on conflict (app_slug, tier) do nothing;

-- ------------------------------------------------ 3. NO go-live here
-- See 20260828_rc5_sim_go_live.sql, applied only after the route ships.
