-- ============================================================================
-- EC2: Fiscal Regime Design joins the catalog, the SECOND Economics course.
--
-- Catalog row (module 'economics'; path_order 54; prereq_slug NULL, the
-- carried-over answer "no hard prerequisite inside a module", the same
-- answer EC1 took) plus the three capstones and their eighteen graded
-- fields. Deep seeds are three separate migrations; the go-live is a fifth
-- and is HELD until a NextGen production upload carries the route
-- /dashboard/apps/fiscal.
--
-- THE ONE SENTENCE THE COURSE IS. A fiscal regime is four instruments
-- acting on one ledger, and the whole art of reading a regime comparison is
-- knowing which instrument moved a number and which of the numbers on the
-- screen are not measurements at all.
--
-- THE ENGINE. engines/economics/fiscalRegime.js with fiscalTemplates.js, the
-- Suite's Fiscal Regime Designer, extracted verbatim in the EC0 wave with 61
-- golden cases and an independent stdlib oracle. It is a regime SANDBOX and
-- it says so in its own header: it exists to compare the SHAPE of regimes
-- against each other, and the module's single source of fiscal truth stays
-- the Petroleum Economics Studio engine that EC1 grades. The course
-- certifies no reservoir property, no forecast, no probabilistic result
-- (EC3) and no decision rule (EC4).
--
-- THE TIERS SPLIT ON HOW MANY INSTRUMENTS ARE MOVING. The Associate tier
-- reads ONE concession ledger end to end with every instrument flat: a flat
-- royalty, cost recovery at the full limit, a flat 100 percent profit split
-- and one tax rate. The Professional tier turns each instrument on in turn
-- on a production sharing contract: a royalty that steps with price, a cost
-- recovery limit that binds and carries forward, an R factor that selects a
-- tranche, and a tax stack, then values the result. The Expert tier runs
-- both regimes through runFiscalComparison and grades the comparison's own
-- outputs, including two of the numbers the course teaches a reader to
-- distrust.
--
-- FIVE RESULTS THE COURSE IS BUILT ON, EVERY ONE RUN AGAINST THE ENGINE.
--
--   (1) THE EFFECTIVE TAX RATE HAS TWO VALUES IN ONE RESULT OBJECT AND BOTH
--   ARE ON THE SCREEN. The summary table divides government take by take
--   plus contractor take WITH total capex added back; the price sensitivity
--   divides the same quantities on the same cash flows WITHOUT it. Across
--   the six templates on the Designer's default project the gap runs from
--   9.6793 to 17.0850 percentage points and widens with the regime's
--   harshness. The Expert capstone grades BOTH numbers for one regime, so
--   the tier cannot be passed by reading one screen.
--
--   (2) THE GOVERNMENT SHARE CURVE CARRIES THREE MEANINGS AND FLAGS NONE.
--   Between 0 and 100 it is a share. Above 100 the contractor is losing
--   money while the government still collects. And EXACTLY 0 is the
--   `totalProfit > 0` guard firing, which on the published cmp_never_recovers
--   comparison plots a flat zero at all nine prices for six regimes that
--   collected between 700.1194 and 1662.7835 million USD for the government.
--   THIS IS NOT IN THE ORACLE FINDINGS FILE. The EC2 wave found it and it is
--   written up in the wave's FINDINGS.md as EC2-1, with the owner's options.
--
--   (3) THE CAPEX SWEEP NEVER REACHES THE MULTIPLIER ITS AXIS PROMISES. The
--   loop runs 0.8 to 1.5 in steps of 0.1, floating point puts the eighth
--   step at 1.5000000000000004, the `<= 1.5` test fails, and the sweep has
--   SEVEN points whose last label reads 1.4. The "resilience to cost
--   overrun" verdict therefore prices a 40 percent overrun. The Expert
--   capstone grades the seven-point loss AND the eight-point loss, which is
--   the only way to prove the reader saw it.
--
--   (4) A VERDICT THAT NAMES A WINNER CAN BE RANKING FLOATING POINT NOISE.
--   The capex and price insights pick with a strict less-than in a reduce,
--   so an exact tie goes to list order and a tie in the fifteenth figure
--   goes to the smaller rounding error. On cmp_never_recovers the engine
--   names one regime the most resilient and the oracle's arithmetic names
--   another, and neither is a result.
--
--   (5) TWO SOLVERS IN ONE PACKAGE REPORT THE EDGE OF THEIR OWN SEARCH AS
--   AN ANSWER. calculateIRR brackets by doubling from 100 percent ten times
--   and returns 102400 percent when the NPV is still positive there; the
--   screening engine next door returns its 1000 percent Newton clamp. The
--   bisection also returns 0 both when there is no sign change and when the
--   only root is negative: two situations, one value.
--
-- ENGINE PROPERTIES TAUGHT AS PROPERTIES, NOT DEFECTS: the R factor is a
-- ratio of cumulatives and is not monotone, so a contractor's split can step
-- back UP after falling; the RRT capital uplift is deducted in every one of
-- the 25 years, so at the default 20 percent the relief over the life is
-- five times the capex; tier lists are selected by LIST ORDER, which equals
-- "highest threshold reached" only while the list is sorted, and every
-- shipped template is sorted.
--
-- Owner decisions, none of them blocking: /root/ec-wip-fiscal/OWNER_DECISIONS.md.
-- ============================================================================

insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)
values ('fiscal', 'Fiscal Regime Design', 'economics', 54, 'coming_soon', null)
on conflict (slug) do nothing;

insert into public.academy_capstones
    (app_slug, tier, cert_tier, dataset, title, prompt, fields)
values
(
  'fiscal', 'beginner', 'associate',
  'URUAN, an oil field with associated gas and NGL under a single flat concession, a field the lessons never use',
  'Read one regime end to end',
  'Six values from the URUAN concession ledger. The project: oil 5,200 bbl/d declining 11 percent a year, gas 65 Mscf/d declining 7 percent, NGL 480 bbl/d declining 13 percent, all generated over the sandbox''s fixed 25 year horizon. Price deck: from year 1, oil 58 USD/bbl, gas 3.2 USD/Mscf, NGL 27 USD/bbl; from year 8, oil 72, gas 4.1, NGL 34. Costs: capex 185 million USD drilling plus 95 million USD facilities plus 35 million USD subsea; opex 9 million USD a year fixed plus 6.5 USD per boe variable. Discount rate 11 percent. The regime: royalty flat 14 percent, cost recovery limit 100 percent, profit split flat 100 percent to the contractor, corporate income tax 28 percent, no resource rent tax and no minimum tax. Report, all in millions of USD except where stated: (1) the GROSS REVENUE in year 1; (2) the ROYALTY in year 4; (3) the OPEX in year 4; (4) the CONTRACTOR NET CASH FLOW in year 5; (5) the CUMULATIVE net cash flow in the PAYBACK year, meaning the first year cumulative contractor net cash flow is above zero; and (6) the TOTAL government take over the life. Traps. The decline is applied AFTER the year is booked, so year 1 produces the initial rate times 365 days with no decline taken. Barrels of oil equivalent convert gas at 6000 scf per barrel, and the variable opex is charged on boe, not on barrels of oil. The whole of the capex lands in year 1 and nowhere else. The deck is a STEP function that holds a price until the next point and never interpolates, so years 1 to 7 are all at 58 USD/bbl. Field 5 asks for a cash flow and not for a year: find the year first, then read the cumulative column in it. Government take is royalty plus the government profit share plus tax, and at a flat 100 percent contractor split the middle term is nought in every year.',
  jsonb_build_array(
    jsonb_build_object('key','con_y1_gross_revenue_musd', 'label','Gross revenue in year 1', 'unit','million USD', 'expected',114.89032, 'tol',0.001),
    jsonb_build_object('key','con_y4_royalty_musd', 'label','Royalty in year 4', 'unit','million USD', 'expected',11.309459947889602, 'tol',0.001),
    jsonb_build_object('key','con_y4_opex_musd', 'label','Opex in year 4', 'unit','million USD', 'expected',18.467779420043748, 'tol',0.001),
    jsonb_build_object('key','con_y5_contractor_ncf_musd', 'label','Contractor net cash flow in year 5', 'unit','million USD', 'expected',44.366803603492855, 'tol',0.001),
    jsonb_build_object('key','con_payback_year_cum_ncf_musd', 'label','Cumulative net cash flow in the payback year', 'unit','million USD', 'expected',14.740261270763284, 'tol',0.001),
    jsonb_build_object('key','con_total_government_take_musd', 'label','Total government take', 'unit','million USD', 'expected',229.13292242776342, 'tol',0.001)
  )
),
(
  'fiscal', 'intermediate', 'professional',
  'the same URUAN project under a production sharing contract: a royalty that steps with price, a cost recovery limit that binds, and an R factor that selects a tranche',
  'Turn the instruments on',
  'Six values for the SAME URUAN project as the Associate capstone (identical production, deck, costs and discount rate), now under a production sharing contract. The regime: royalty sliding on the oil price, 6 percent from a threshold of 0 USD/bbl and 9.5 percent from a threshold of 60 USD/bbl; cost recovery limit 65 percent; profit split tiered on the R factor, 65 percent to the contractor from R 1.0, 45 percent from R 1.4 and 32 percent from R 1.65; corporate income tax 32 percent, no resource rent tax and no minimum tax. Report: (1) the COST RECOVERED in year 1, in millions of USD; (2) the UNRECOVERED COST POOL carried out of year 3, in millions of USD; (3) the R FACTOR in year 5, as a ratio; (4) the ROYALTY in year 8, in millions of USD; (5) the TOTAL tax over the life, in millions of USD; and (6) the NPV at the project''s own discount rate, in millions of USD. Traps. The recoverable pool is the balance brought forward PLUS this year''s capex PLUS this year''s opex, and the allowance is the limit as a percent of revenue AFTER royalty, not of gross revenue. The royalty rate is read from the applied oil price for the year, and the deck steps at year 8, so field 4 is the FIRST year on the far side of that step: a reader who puts the step a year later reads year 8 at the old price and at the lower tier, and is wrong twice over. The R factor is cumulative revenue over cumulative cost, a ratio of CUMULATIVES including the current year, and it is computed before the split is chosen; a reader who takes the year''s own revenue over the year''s own cost gets a different number in every year. The tax base is the contractor''s PROFIT SHARE alone: cost is compensated through cost recovery and is not deducted again here. The R factor crosses all three tranches on this field and then FALLS BACK through the top one in the final year, stepping the contractor''s split back UP, so a reader who assumes the split ratchets once given up is wrong in year 25 and therefore wrong on fields 5 and 6. Discounting is YEAR END, so year 1 is already discounted once, and the NPV may be negative.',
  jsonb_build_array(
    jsonb_build_object('key','psc_y1_cost_recovered_musd', 'label','Cost recovered in year 1', 'unit','million USD', 'expected',70.19798552, 'tol',0.001),
    jsonb_build_object('key','psc_y3_unrecovered_pool_musd', 'label','Unrecovered cost pool out of year 3', 'unit','million USD', 'expected',190.0287098892603, 'tol',0.001),
    jsonb_build_object('key','psc_y5_r_factor', 'label','R factor in year 5', 'unit','ratio', 'expected',1.1122624290891505, 'tol',1e-06),
    jsonb_build_object('key','psc_y8_royalty_musd', 'label','Royalty in year 8', 'unit','million USD', 'expected',5.961300665865362, 'tol',0.0003),
    jsonb_build_object('key','psc_total_tax_musd', 'label','Total tax over the life', 'unit','million USD', 'expected',62.454042497773344, 'tol',0.001),
    jsonb_build_object('key','psc_npv_musd', 'label','NPV at the project rate', 'unit','million USD', 'expected',-19.724017651298347, 'tol',0.001)
  )
),
(
  'fiscal', 'advanced', 'expert',
  'the URUAN concession and the URUAN production sharing contract put side by side in one comparison, with the sweeps and the two rates the comparison reports',
  'Read the comparison, and the numbers in it that are not measurements',
  'Six values from ONE call of runFiscalComparison on the SAME URUAN project as the other two tiers, with BOTH regimes in it: the concession (royalty flat 14 percent, cost recovery limit 100 percent, profit split flat 100 percent, corporate income tax 28 percent, no resource rent tax, no minimum tax) and the production sharing contract (royalty sliding, 6 percent from 0 USD/bbl and 9.5 percent from 60 USD/bbl; cost recovery limit 65 percent; profit split 65 percent from R 1.0, 45 percent from R 1.4, 32 percent from R 1.65; corporate income tax 32 percent, no resource rent tax, no minimum tax). Report: (1) the NPV of the regime the summary puts FIRST, in millions of USD; (2) the PRODUCTION SHARING CONTRACT''s effectiveTaxRate as the SUMMARY TABLE reports it, in percent; (3) the PRODUCTION SHARING CONTRACT''s point on the PRICE SWEEP at 60 USD/bbl, in percent; (4) the contractor NPV the production sharing contract gives up across the capex sweep AS THE ENGINE SWEEPS IT, first swept point minus last swept point, in millions of USD; (5) the same loss measured to a capex multiplier of 1.5 by calling the engine directly at 1.5, in millions of USD; and (6) the CONCESSION''s climb across the price sweep, last point minus first point, in percentage points. Traps. Fields 2 and 3 are the same ratio on the same cash flows and they are NOT the same number: the summary adds TOTAL CAPEX back into contractor take and the sweep does not. Fields 4 and 5 differ because the sweep loop never reaches the multiplier its axis is labelled with; count the points the engine actually returns before subtracting. Field 6 is negative on this project and that is the answer, not an error: the concession''s share falls as the price rises. The summary is sorted by contractor NPV descending, so field 1 is a lookup only after the sort. The price sweep reaches each price by a multiplier on the FIRST deck point''s oil price, and that multiplier scales OIL ONLY.',
  jsonb_build_array(
    jsonb_build_object('key','cmp_top_npv_musd', 'label','NPV of the first regime in the summary', 'unit','million USD', 'expected',20.956012449531823, 'tol',0.001),
    jsonb_build_object('key','cmp_psc_effective_tax_rate_pct', 'label','Production sharing contract effective tax rate, summary table', 'unit','percent', 'expected',42.14742246720144, 'tol',0.0001),
    jsonb_build_object('key','cmp_psc_price_sweep_at_60_pct', 'label','Production sharing contract government share at 60 USD/bbl', 'unit','percent', 'expected',75.697560213795, 'tol',0.0001),
    jsonb_build_object('key','cmp_psc_capex_loss_seven_point_musd', 'label','Capex loss over the swept points', 'unit','million USD', 'expected',140.9798310836312, 'tol',0.001),
    jsonb_build_object('key','cmp_psc_capex_loss_eight_point_musd', 'label','Capex loss to a multiplier of 1.5', 'unit','million USD', 'expected',169.10768926905132, 'tol',0.001),
    jsonb_build_object('key','cmp_con_price_climb_pct_points', 'label','Concession climb across the price sweep', 'unit','percentage points', 'expected',-65.47814380281869, 'tol',0.0001)
  )
)
on conflict (app_slug, tier) do nothing;
