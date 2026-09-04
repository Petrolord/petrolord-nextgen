-- ============================================================================
-- DR12: Well Cost & Time joins the catalog, the TWELFTH and FINAL Drilling &
-- Completions course. This row CLOSES THE MODULE.
--
-- Catalog row (module 'drilling'; path_order 29; prereq_slug NULL) plus the
-- three capstones and their eighteen graded fields. Deep seeds are three
-- separate migrations; the go-live is a fourth and is HELD.
--
-- WHAT THE COURSE IS ABOUT. A rig is rented by the day, so a schedule is a
-- cost estimate wearing different units. The Associate tier reads the time:
-- three closed forms, a productive and non-productive split, and a rollup. The
-- Professional tier turns days and metres into money. The Expert tier draws
-- the cost-time curve and then asks where a single number sits in its own
-- distribution.
--
-- FOUR RESULTS THE COURSE IS BUILT ON, EVERY ONE VERIFIED AGAINST THE ENGINE.
--
--   (1) THE NPT ALLOWANCE IS A STRETCH ON PRODUCTIVE TIME. A fraction f gives
--   nptHr = f * productiveHr exactly, so as a share of ELAPSED time it is
--   f/(1+f), always smaller. A planner wanting a fifth of the schedule
--   non-productive enters 0.20 and gets 16.7 percent. At f = 0.5 someone
--   reading f as the elapsed share plans 32 days against a real 24.
--
--   (2) A PER-DAY LINE IS EXPOSED TO A SCHEDULE SLIP AND A PER-METRE OR LUMP
--   LINE IS NOT. The same money calibrated three ways bills identically at the
--   base case and diverges the moment anything moves; elasticity to elapsed
--   days is 1, 0 and 0. Deepening the hole is the MIRROR case, because the day
--   count carries flat time that does not grow with depth.
--
--   (3) THE COST-TIME CURVE ENDS EXACTLY ON THE AFE BASE COST. Absolute error
--   zero on the published case, across every combination of non-productive and
--   contingency fraction tested, so contingency does NOT accrue along the
--   curve and every total-minus-curve gap IS the contingency. An exact
--   identity is a gift: it is a one-line audit of a spreadsheet somebody else
--   built.
--
--   (4) CONTINGENCY IS A PROVISION THAT CAN OUTRANK A CONTRACT. It passes a
--   line at a fraction equal to that line's share of the base, so the general
--   condition is f > L / base.
--
-- THE ENGINE FINDING THIS COURSE PRODUCED WAS IN THE DOCUMENTATION, AND IT
-- WOULD HAVE MISLED A PLANNER. wellCost.js's header called nptFrac "the honest
-- planning convention (NPT fraction of total time)". The arithmetic says
-- productive time, and the arithmetic is the definition. Behaviour was never
-- wrong; the prose was, and the prose is what somebody acts on. Corrected with
-- four tests pinning the definition in petrolord-engines PR #107, found
-- because the teaching lab asserted the header's wording and the engine
-- refused it.
--
-- THE CAPSTONE IS A WELL THE LESSONS NEVER TOUCH: MERLIN A-12, 3,945 m in four
-- sections, seventeen activities, a 28.5 percent allowance, a stuck pipe with
-- 62 hours of fishing, 18.5 hours waiting on weather and a 27 hour shoe
-- squeeze. It is deliberately a bad well, because a programme where nothing
-- goes wrong teaches nothing. The bit turns for 40.4 percent of elapsed time.
-- Its 23.5 percent contingency OVERTAKES the entire integrated services line,
-- so the second largest number on the sorted estimate is a provision for what
-- has not happened. Its cost per metre INVERTS the total spend ranking. And
-- its deterministic base sits at only the 16.7th percentile, which is an 83
-- percent chance of overrun before any contingency is added.
--
-- THE RISKED FIELDS ARE GRADED ON A FIXED SEED, NOT ANALYTIC MOMENTS, and the
-- reason is worth stating: the golden's own Monte Carlo fixture is LINEAR in
-- every uncertainty so it can publish closed-form moments, while this capstone
-- varies RATES, and time goes as one over rate, so the cost is convex and no
-- closed form exists. Seed 20260904, 20,000 iterations, through the canonical
-- Monte Carlo module the engine already imports rather than any new one.
--
-- THE DR4 CHECK RAN BEFORE A LESSON WAS WRITTEN: eighteen graded values swept
-- against everything the goldens and the teaching digest publish, ZERO
-- collisions and ZERO integer notes, and zero pairwise.
--
-- STATUS deliberately left 'coming_soon'. The flip to 'available' is held in
-- 20260904_dr12_wellcost_go_live.sql and must not run until a NextGen
-- production upload carries /dashboard/apps/wellcost.
-- ============================================================================

insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)
values ('wellcost', 'Well Cost & Time', 'drilling', 29, 'coming_soon', null)
on conflict (slug) do nothing;

insert into public.academy_capstones
    (app_slug, tier, cert_tier, dataset, title, prompt, fields)
values
(
  'wellcost', 'beginner', 'associate',
  'MERLIN A-12, seventeen activities over four sections to 3945 m, at a 28.5 percent allowance the lessons never use',
  'Read a schedule that went wrong',
  'Six values from the MERLIN A-12 drilling programme supplied with this capstone. It is seventeen activities across four hole sections to 3,945 m, and it did not go well: a stuck pipe cost 62 hours of fishing, 18.5 hours went waiting on weather, and a shoe squeeze took 27 hours. The non-productive allowance is 28.5 percent. Report: (1) the DRILLING hours for the RESERVOIR section; (2) the hours for the ROUND TRIP to total depth; (3) the hours to RUN the LINER; (4) the total PRODUCTIVE hours for the programme; (5) the total NON-PRODUCTIVE hours; and (6) the total DAYS. Traps. Fields 1 to 3 are three DIFFERENT closed forms and using one where another belongs is the commonest error on this tier: drilling is the interval over the rate, a round trip is TWICE the depth over the speed, and running casing is the depth over the speed PLUS a flat term that no running speed can remove. Field 5 is the allowance applied as a STRETCH on productive time, so it is 28.5 percent OF FIELD 4, and it is NOT 28.5 percent of the elapsed total. Reading the allowance as a share of elapsed time would overstate the schedule badly. Field 6 counts BOTH productive and non-productive hours, because the rig is paid for all of them. Free checks: field 5 divided by field 4 must come out at exactly the stated allowance; field 5 divided by the sum of fields 4 and 5 must come out SMALLER than the allowance, which is the whole point; and field 6 times 24 must equal fields 4 and 5 added together.',
  jsonb_build_array(
    jsonb_build_object('key','drill_reservoir_hr',   'label','Reservoir drilling hours','unit','h','expected',128.8659793814433,  'tol',0.00005),
    jsonb_build_object('key','trip_td_hr',           'label','Round trip to TD',        'unit','h','expected',12.725806451612904, 'tol',0.000005),
    jsonb_build_object('key','casing_liner_run_hr',  'label','Liner running hours',     'unit','h','expected',41.285714285714285, 'tol',0.00002),
    jsonb_build_object('key','productive_hr',        'label','Productive hours',        'unit','h','expected',896.5426011394405,  'tol',0.0005),
    jsonb_build_object('key','npt_hr',               'label','Non-productive hours',    'unit','h','expected',255.51464132474018, 'tol',0.0002),
    jsonb_build_object('key','total_days',           'label','Total days',              'unit','d','expected',48.0023851026742,   'tol',0.00002)
  )
),
(
  'wellcost', 'intermediate', 'professional',
  'the MERLIN A-12 estimate at a 23.5 percent contingency, where the provision outranks a contracted line',
  'Price a well that took longer than it should have',
  'Six values for the MERLIN A-12 estimate, built on the days and metres from the Associate tier. The line items, their rates, their bases and their categories are supplied. The contingency is 23.5 percent. Report: (1) the TANGIBLE subtotal in dollars; (2) the INTANGIBLE subtotal; (3) the CONTINGENCY amount; (4) the estimate TOTAL; (5) the cost per metre for the INTERMEDIATE section; and (6) the cost per metre for the RESERVOIR section. Traps. Every line carries a BASIS and a CATEGORY and they are independent questions: the basis says how it bills, per day or per metre or as a lump, and the category says whether it is tangible or intangible. Getting the basis right and the category wrong moves fields 1 and 2 without touching field 4, so the total will look correct while the split is wrong. Field 3 is a percentage of the BASE and not of the total, and the base is fields 1 and 2 added together. Fields 5 and 6 must each be computed from the hours of the section they belong to, taken from the schedule the Associate tier evaluated, and NEVER lifted from a worked example elsewhere. Free checks: fields 1 and 2 must sum to the base; field 4 less that base must equal field 3 exactly; field 3 divided by the base must equal the stated 23.5 percent; and field 5 must come out SMALLER than field 6 even though the intermediate section is the larger cheque, which is the inversion this tier exists to teach.',
  jsonb_build_array(
    jsonb_build_object('key','tangible_usd',          'label','Tangible subtotal',     'unit','USD',  'expected',3140000,            'tol',2),
    jsonb_build_object('key','intangible_usd',        'label','Intangible subtotal',   'unit','USD',  'expected',12245809.811338801, 'tol',6),
    jsonb_build_object('key','contingency_usd',       'label','Contingency',           'unit','USD',  'expected',3615665.305664618,  'tol',2),
    jsonb_build_object('key','total_usd',             'label','Estimate total',        'unit','USD',  'expected',19001475.11700342,  'tol',10),
    jsonb_build_object('key','cpm_intermediate_usd_m','label','Intermediate cost/m',   'unit','USD/m','expected',1097.8465106873223, 'tol',0.0005),
    jsonb_build_object('key','cpm_reservoir_usd_m',   'label','Reservoir cost/m',      'unit','USD/m','expected',2520.081523112737,  'tol',0.002)
  )
),
(
  'wellcost', 'advanced', 'expert',
  'the MERLIN A-12 curve and a fixed-seed risked run whose base case sits at the seventeenth percentile',
  'Draw the curve, then find out where the estimate really sits',
  'Six values for MERLIN A-12. Report first from the COST-TIME CURVE: (1) the cumulative cost at the point the INTERMEDIATE CASING is set; (2) the cumulative cost at the point EVALUATION begins; and (3) the FINAL point of the curve. Then from a RISKED run of 20,000 iterations at seed 20260904, with the declared ranges supplied: (4) the P10 cost; (5) the P90 cost; and (6) the P50 total days. Traps. Field 3 is the curve''s endpoint and it lands on the estimate BASE, not the estimate TOTAL, because contingency is a provision for what has not happened and does not accrue as the well is drilled. The difference between them is exactly the contingency, so a learner who reports the total here is out by that whole amount. Fields 4 and 5 are labelled in the AFE convention, where P10 is the LOW cost and P90 the HIGH one. That is the OPPOSITE of the petroleum reserves convention the sampler itself returns, so read the field names and not the library. The run must use the stated seed, because a sampled number without a recorded seed is not a number anybody can check. Free checks: field 3 must equal the Professional tier''s tangible and intangible added together; fields 1 and 2 must both fall below field 3 and field 1 below field 2, since the curve only rises; field 4 must be below field 5; and field 3 must fall BETWEEN fields 4 and 5, low in that range, because a deterministic estimate built on most likely rates is not a most likely cost.',
  jsonb_build_array(
    jsonb_build_object('key','curve_at_int_casing_usd', 'label','Curve at intermediate casing','unit','USD','expected',5421894.326682938,  'tol',2),
    jsonb_build_object('key','curve_at_evaluation_usd', 'label','Curve at evaluation',        'unit','USD','expected',11152431.73458189,  'tol',5),
    jsonb_build_object('key','curve_final_usd',         'label','Curve final point',          'unit','USD','expected',15385809.811338803, 'tol',8),
    jsonb_build_object('key','mc_cost_p10_usd',         'label','Risked cost, P10',           'unit','USD','expected',15111064.647716,    'tol',8),
    jsonb_build_object('key','mc_cost_p90_usd',         'label','Risked cost, P90',           'unit','USD','expected',17776363.724421192, 'tol',10),
    jsonb_build_object('key','mc_days_p50',             'label','Risked days, P50',           'unit','d',  'expected',49.37724886122158,  'tol',0.00003)
  )
)
on conflict (app_slug, tier) do nothing;

-- No go-live here. See 20260904_dr12_wellcost_go_live.sql.
