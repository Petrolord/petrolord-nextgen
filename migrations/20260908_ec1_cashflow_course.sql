-- ============================================================================
-- EC1: Cash Flow & NPV joins the catalog, the FIRST Economics course and the
-- root of that module's path.
--
-- Catalog row (module 'economics'; path_order 53; prereq_slug NULL, the
-- carried-over answer "no hard prerequisite inside a module") plus the three
-- capstones and their eighteen graded fields. Deep seeds are three separate
-- migrations; the go-live is a fifth and is HELD until a NextGen production
-- upload carries the route /dashboard/apps/cashflow.
--
-- path_order 53 leaves 39 to 52 open for the Facilities and Midstream &
-- Downstream modules the plan of record (Suite
-- docs/scope/NextGen-Remaining-Courses-PLAN.md) places before Economics;
-- the sidebar sorts by path_order and nothing indexes it.
--
-- THE ONE SENTENCE THE COURSE IS. A field's economics is a ledger with one
-- row per year, and every number a decision is made on (NPV, IRR, payback,
-- take) is a reading of that ledger under a stated convention, so a number
-- without its convention is not a number.
--
-- THE ENGINE. engines/economics/cashflow.ts, v3.9.0, extracted verbatim in
-- the EC0 wave from the Suite's Petroleum Economics Studio edge function,
-- with 74 golden cases and an independent stdlib oracle. The course grades
-- what THAT engine returns: ledger rows, KPIs and fiscal lines. It certifies
-- no reservoir property, no forecast, no fiscal-regime comparison across
-- designs (EC2) and no probabilistic result (EC3).
--
-- THE TIERS SPLIT ON WHAT IS HELD CONSTANT. The Associate tier reads the
-- ledger with no discount rate anywhere: gross revenue, tax, net cash flow,
-- payback in calendar years, barrels of oil equivalent and undiscounted
-- take, all from ONE joint-venture run at an 80 percent working interest.
-- The Professional tier adds time: the same run's NPV under two discounting
-- conventions, its IRR, its discounted payback, its DPI and the breakeven
-- oil price that drives NPV to zero. The Expert tier runs the SAME rows
-- under the Petroleum Industry Act as a new shallow-water lease whose prior
-- production sits just short of the 100 MMbbl allowance cap, with a CPR
-- limit that defers cost and a post-tax abandonment lump sum, and grades
-- five fiscal lines plus the NPV.
--
-- FOUR RESULTS THE COURSE IS BUILT ON, EVERY ONE RUN AGAINST THE ENGINE.
--
--   (1) ON THE REAL BASIS WITH THE ESCALATORS SET, NPV DOES NOT MOVE WITH
--   INFLATION. The teaching field reports the same NPV at every inflation
--   rate from 0 to 8 percent while its real total cash flow falls by a
--   third; the Fisher relation deflates the flows and the rate together.
--   The convention that DOES move NPV is mid-year against end-year, which
--   is why the Professional capstone grades both.
--
--   (2) SUNK IS A DECISION, NOT A DATE. Valuing the teaching field from its
--   second year with prior years kept raises NPV by one year of
--   compounding; valuing it with prior years SUNK nearly triples the NPV,
--   reports the first year as sunk_net_cash_flow, and returns a null IRR
--   because nothing negative is left to bracket a root.
--
--   (3) A CASH FLOW WITH A TERMINAL NEGATIVE HAS TWO RATES THAT ZERO ITS
--   NPV, AND THE ENGINE REPORTS ONE WITHOUT SAYING SO. The extraction's
--   oracle pins the vectors; the Expert capstone's own PIA run ends in a
--   40 MUSD abandonment, so its nominal flows carry exactly this shape and
--   the tier grades NPV, never IRR.
--
--   (4) THE PIA CASCADE IS FIVE TAXES ON THREE BASES, AND THE BASE DECIDES
--   MORE THAN THE RATE. The terrain string moves the teaching field's NPV
--   by more than a sweep of the oil price from 82 to 120 USD/bbl does.
--
-- THREE ENGINE DEFECTS THE COURSE TEACHES AND THE ORACLE RECORDS (owner
-- decisions, engine unchanged): the NPV profile's applied-rate point is
-- evaluated at the rate rounded to two decimals; the IRR of a multi-root
-- profile is whichever root Newton reaches from 10 percent, unflagged; the
-- sinking-fund abandonment is working-interest scaled while the lump sum
-- is not.
-- ============================================================================

insert into public.academy_apps (slug, name, module, path_order, status, prereq_slug)
values ('cashflow', 'Cash Flow & NPV', 'economics', 53, 'coming_soon', null)
on conflict (slug) do nothing;

insert into public.academy_capstones
    (app_slug, tier, cert_tier, dataset, title, prompt, fields)
values
(
  'cashflow', 'beginner', 'associate',
  'IKPOTO, a six-year oil field with associated gas under joint venture terms at an 80 percent working interest, a field the lessons never use',
  'Read the ledger',
  'Six values from the IKPOTO joint venture ledger supplied with this capstone. First oil 2031, six years of production: 1,600,000 bbl of oil in 2031 declining twenty percent a year (1,280,000; 1,024,000; 819,200; 655,360; 524,288), with gas at 900 scf per barrel (1,440,000 Mscf in 2031, then 1,152,000; 921,600; 737,280; 589,824; 471,859.2). Capex 120,000,000 USD in 2031 and 30,000,000 USD in 2032; opex 19,000,000 USD a year in 2031 money escalating at 3.5 percent. Oil 76 USD/bbl and gas 3.0 USD/Mscf in 2031, both escalating at 1.5 percent; inflation 2.5 percent; base year 2031. Joint venture terms: working interest 80 percent, royalty 12.5 percent, tax 45 percent, depreciation on the engine''s default straight line. Report: (1) the GROSS REVENUE in 2033; (2) the TAX in 2032; (3) the NET CASH FLOW in 2034; (4) the PAYBACK in years; (5) the TOTAL barrels of oil equivalent; and (6) the GOVERNMENT TAKE in percent. Traps. The joint venture ledger keeps gross revenue, volumes, opex, capex and depreciation at FIELD level in every row and reports royalty, taxable income, tax and net cash flow as the 80 percent SHARE. So field 1 and field 5 are field-level numbers, and fields 2 and 3 are the share: a reader who scales revenue by 0.8 is wrong on field 1 by a factor of 1.25, and a reader who forgets the share is wrong on fields 2 and 3 by the same factor. Gas counts at 6 Mscf per barrel of oil equivalent. Depreciation is a deduction in the tax line and NOT a cash flow in field 3. Payback is read off the CUMULATIVE nominal cash flow and interpolated inside the year it turns positive. Take is the engine''s: the field pre-take value (revenue less capex less opex, undiscounted) minus the contractor''s SHARE net cash flow, over the pre-take value; report the engine''s number as the engine defines it.',
  jsonb_build_array(
    jsonb_build_object('key','jv_2033_gross_revenue_usd', 'label','Gross revenue in 2033', 'unit','USD', 'expected',83024596.47999997, 'tol',1),
    jsonb_build_object('key','jv_2032_tax_usd', 'label','Tax in 2032', 'unit','USD', 'expected',19728417.6, 'tol',1),
    jsonb_build_object('key','jv_2034_net_cash_flow_usd', 'label','Net cash flow in 2034', 'unit','USD', 'expected',22086267.91657759, 'tol',1),
    jsonb_build_object('key','jv_payback_years', 'label','Payback', 'unit','years', 'expected',3.4998246420308123, 'tol',1e-05),
    jsonb_build_object('key','jv_total_boe', 'label','Total barrels of oil equivalent', 'unit','boe', 'expected',6788275.2, 'tol',1),
    jsonb_build_object('key','jv_government_take_pct', 'label','Government take', 'unit','percent', 'expected',80.07659344822196, 'tol',0.0001)
  )
),
(
  'cashflow', 'intermediate', 'professional',
  'the IKPOTO joint venture ledger valued in time: two discounting conventions, a real basis, and the price at which the value is nought',
  'Put a time value on the ledger',
  'Six values for the same IKPOTO joint venture run as the Associate capstone (identical rows and terms), now valued at a 9 percent NOMINAL discount rate on the REAL basis with 2.5 percent inflation, valuation year equal to the 2031 base year, nothing sunk. Report: (1) the NPV under END-YEAR discounting; (2) the NPV under MID-YEAR discounting; (3) the INTERNAL RATE OF RETURN in percent; (4) the DISCOUNTED PAYBACK in years; (5) the DPI (NPV over the present value of capex); and (6) the BREAKEVEN flat oil price in USD/bbl at which the end-year NPV is nought. Traps. The applied rate is the Fisher REAL rate, (1.09 / 1.025) - 1, not 9 percent, and the flows it discounts are the DEFLATED flows; discounting the nominal flows at 9 percent gives the same NPV, which is the point, but discounting the deflated flows at 9 percent does not. Mid-year adds one half to every exponent including the first. IRR is solved on the NOMINAL flows and does not depend on the basis. DPI here is NPV over PV(capex), which is the profitability index MINUS ONE; report the engine''s definition. The breakeven is the FLAT price with the 1.5 percent escalator still applied from it, found by bisection to the cent.',
  jsonb_build_array(
    jsonb_build_object('key','jv_npv_real_usd', 'label','NPV, real basis, end year', 'unit','USD', 'expected',20656337.21686185, 'tol',1),
    jsonb_build_object('key','jv_npv_mid_year_usd', 'label','NPV, real basis, mid year', 'unit','USD', 'expected',20030970.834339857, 'tol',1),
    jsonb_build_object('key','jv_irr_pct', 'label','Internal rate of return', 'unit','percent', 'expected',23.719272956750835, 'tol',0.0001),
    jsonb_build_object('key','jv_discounted_payback_years', 'label','Discounted payback', 'unit','years', 'expected',3.9696530221864026, 'tol',0.0001),
    jsonb_build_object('key','jv_dpi', 'label','Discounted profitability index', 'unit','ratio', 'expected',0.14002119133320534, 'tol',1e-06),
    jsonb_build_object('key','jv_breakeven_oil_price_usd_bbl', 'label','Breakeven oil price', 'unit','USD/bbl', 'expected',66.10100889205933, 'tol',0.001)
  )
),
(
  'cashflow', 'advanced', 'expert',
  'the IKPOTO rows under the Petroleum Industry Act: a new shallow-water lease crossing the allowance cap in its second year, a CPR limit that defers cost, the 2025 framework, and a terminal abandonment',
  'Run the same rows through the cascade',
  'Six values for IKPOTO run under the PIA with the SAME production, capex and opex rows and the same prices, escalators, inflation, base year and 9 percent nominal rate as the Professional capstone. Fiscal terms: shallow water at 45 m, PML, NEW lease, not a pre-2021 marginal field, 80 percent working interest, no HCT override, CIT 30 percent, TET 2.5 percent, NDDC 3 percent of opex, no prior-year opex, capital allowance over FOUR years, CPR limit 35 percent, production allowance 8 USD/bbl for a new lease capped at 20 percent of the oil price, framework override auto, prior cumulative production 97,612,500 bbl, and a 40,000,000 USD post-tax abandonment lump sum in the final modeled year. Report: (1) the PRICE ROYALTY in 2032; (2) the allowance-ELIGIBLE barrels in 2032; (3) the cost DEFERRED by the CPR cap at the end of 2031; (4) the TOTAL hydrocarbon tax; (5) the DEVELOPMENT LEVY in 2033; and (6) the NPV on the real basis. Traps. The 2031 base year is at or past 2026, so the framework is NTA 2025: the development levy at 4 percent replaces TET and TET is nought in every year. The royalty tiers, the price-royalty anchors (escalating 2 percent a year from 2021) and the allowance volume cap are FIELD-LEVEL and are applied before the 80 percent share; the cap is 100 MMbbl for shallow water, the prior production counts against it, and 2031 crosses it, so field 2 is the room the cap leaves for 2032 once every earlier barrel is counted. The CPR cap is 35 percent of GROSS revenue and cost claims opex first, then the capital allowance; what does not fit is field 3 and carries. HCT is charged on liquids only at the shallow-water PML rate; field 4 sums it over every year. The abandonment is post-tax and moves field 6 but no tax line.',
  jsonb_build_array(
    jsonb_build_object('key','pia_2032_price_royalty_usd', 'label','Price royalty in 2032', 'unit','USD', 'expected',951123.1830656304, 'tol',1),
    jsonb_build_object('key','pia_2032_prod_alw_eligible_bbl', 'label','Allowance-eligible barrels in 2032', 'unit','bbl', 'expected',787500, 'tol',1),
    jsonb_build_object('key','pia_2031_cpr_deferred_usd', 'label','Cost deferred by the CPR cap in 2031', 'unit','USD', 'expected',3942400, 'tol',1),
    jsonb_build_object('key','pia_total_hct_usd', 'label','Total hydrocarbon tax', 'unit','USD', 'expected',51541932.563462615, 'tol',1),
    jsonb_build_object('key','pia_2033_dev_levy_usd', 'label','Development levy in 2033', 'unit','USD', 'expected',1331296.587088759, 'tol',1),
    jsonb_build_object('key','pia_npv_real_usd', 'label','NPV under the PIA, real basis', 'unit','USD', 'expected',-46086957.32549152, 'tol',1)
  )
)
on conflict (app_slug, tier) do nothing;
