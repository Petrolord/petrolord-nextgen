import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC1 cashflow, beginner tier, What a Cash Flow Is. Reconstructed from the served rows (the applied
# migrations replayed on a local scratch database) with the EC7 PIA re-cut applied;
# written by tools/course-waves/cashflow/pia-recut/build.py. Edit here, then re-run it.

q(2,
 "The 2030 row of the hand-derived joint venture case reads revenue 100000000.00, royalty 20000000.00, opex 10000000.00, capex 50000000.00, depreciation 5000000.00 and tax 32500000.00. What is the row's net cash flow?",
 "-12500000.00, because depreciation only reduces taxable income and is not cash leaving the account in that year.",
 ["-17500000.00, because depreciation is a cost like opex and comes off the cash view as well as the tax view.",
  "37500000.00, because capex is recovered through depreciation and so does not belong in the cash view of the row.",
  "-7500000.00, because the royalty is the government's share and is not an outflow from the operator's account."],
 "Revenue less royalty, opex, capex 50000000.00 and tax is -12500000.00; the 5000000.00 of depreciation appears nowhere in the net cash flow column.")

q(0,
 "The hand-derived case reports take 80.7692 percent and payback 1.33 years. What kind of numbers are these?",
 "Readings of the ledger under a convention: take is a ratio of columns and payback is where the cumulative column crosses zero.",
 ["Inputs the engine was configured with, alongside the royalty of 20 percent and the tax rate of 50 percent.",
  "Properties of the field that would survive a change of price or escalator.",
  "Outputs of a separate reservoir model that the ledger is built on."],
 "Neither is a new fact; each is the two-row ledger read a particular way, and the convention it was read under travels with it or it means nothing.")

q(3,
 "What does a row of the ledger refuse to carry?",
 "Months and an order of events: January capex and December revenue sit together as if they happened at once.",
 ["A negative net cash flow, which is moved into the loss carryforward column so that the row itself never reads below 0.00.",
  "More than one well, since the ledger keeps one row per well per year and a field with two wells has twice the rows.",
  "Depreciation, which belongs to the tax computation and is kept off the ledger entirely."],
 "The engine reads dates and month indexes on upload, but the ledger it returns has one row per year and there is no cash flow of March, which is what an end-year convention assumes.")

q(1,
 "The 2031 row of the hand-derived case is net cash flow 37500000.00 against -12500000.00 in 2030. Why do they differ by exactly the capex, 50000000.00?",
 "Capex is 0.00 in 2031 and everything else is identical, including depreciation 5000000.00, so tax is unchanged at 32500000.00.",
 ["Depreciation finished in 2030, so the 2031 row carries no deduction and the whole capex comes back as cash.",
  "The 2031 revenue was escalated over 2030 by exactly enough to cover the capex, so the two rows balance to it.",
  "The 2030 loss of 12500000.00 was carried forward and relieved in 2031, which is what lifts the second row."],
 "Depreciation is 5000000.00 in both rows and taxable income is 65000000.00 in both, so the cash difference is the one column that changed.")

q(0,
 "What does the Petroleum Economics Studio engine, version 3.10.0, read before it builds a ledger?",
 "Three uploaded files, production, capex and opex, and a configuration carrying prices, escalators, inflation and fiscal terms; nothing else.",
 ["A production file, a reservoir decline model and a facilities capacity file, from which it checks the volumes before believing them.",
  "A single combined spreadsheet of volumes and costs, with the price taken from the deck by default when the configuration is blank.",
  "The three files and a well log, which fixes the boe conversion for the field."],
 "If the volumes are wrong the ledger is wrong, and the engine has no way to know: no reservoir, no facilities capacity, no decline.")

q(2,
 "Which published case reports take as null, and what was zero in it?",
 "zero_rates_capex_only, where total revenue is 0.00, so take and unit technical cost come back null rather than as a ratio with nothing on top.",
 ["single_year_positive, where capex is 0.00, so there is no investment base for the ratio to divide by.",
  "psc_carryforward, where total tax 27000000.00 exceeds the total net cash flow of -1000000.00, so take is above 100 percent and reported null.",
  "per_well_beats_total_rollup, where opex is 0.00, so no unit cost can be formed."],
 "psc_carryforward reports take 101.0000 percent and single_year_positive 61.1111 percent; null is the engine declining to invent a ratio when revenue is 0.00.")

q(1,
 "multiyear_pia_nominal and multiyear_pia_real are one field with one set of rows, and they report total net cash flow 329879515.51 and 286158487.25. Which is wrong?",
 "Neither: one is money of the day and the other money of the base year, and a total without its basis is not a number.",
 ["The nominal one, because inflation has been added to flows that were already escalated, which counts it twice.",
  "The real one, because it has been discounted at the applied real rate of 6.796117 percent and is the NPV of 203250580.21 under another name.",
  "The nominal one, since only the real basis is a valid reading of a PIA ledger."],
 "The ledger carries a net_cash_flow and a real_net_cash_flow column, and their totals part once inflation is set.")

q(3,
 "AKATA reports total revenue 857602518.80. What is that number a property of?",
 "The run: a price of 82 escalating at 2 percent on those volumes, so changing the escalator moves the total while the field does not.",
 ["The field, since the volumes of 9680000.00 bbl and 7744000.00 Mscf are fixed by the upload and the total revenue follows them whatever the configuration says about price.",
  "The price alone, because volumes do not enter a revenue total until the boe conversion at 6 Mscf per barrel has been applied to fold the gas into the oil.",
  "The base year, because every total is restated in money of the base year 2029 through the inflation rate, so a total is a property of the year it is quoted in."],
 "Learn the settings that produced a number before you learn the number.")

q(0,
 "A capex row carries amount_usd=30000000 and cost_usd=30000000. What does the engine do with it?",
 "It accepts the row once and the year's capex is 30000000.00; only different values in two cost columns are refused.",
 ["It refuses the run as ambiguous_cost_aliases, since two populated cost columns in one row is exactly the ambiguity the message names.",
  "It sums both through the *_usd fallback, because two preferred aliases cancel each other and the parts rule takes over.",
  "It takes the first alias on its list, amount_usd, and warns that cost_usd was dropped."],
 "The refusal message says which: different values, refused; the same value, taken once, which is the duplicate_identical_aliases case at capex 30000000.00.")

q(3,
 "The case_insensitive_headers upload carries Water_BBL=20000 beside Oil_BBL=100000 for 2027. What happens?",
 "The run proceeds, 20000.00 bbl of water is read into the annual volumes, and revenue is 7500000.00 from the 100000.00 bbl of oil alone.",
 ["The run is refused as no_volume_columns, because water is not one of the oil, gas or condensate volumes the message lists.",
  "The water is priced at the oil price of 75, since any column ending in _bbl is a barrel of liquid to the engine, and revenue rises above 7500000.00.",
  "The water is netted off the oil to give the sales volume, since the engine reads water as a cut of the liquid."],
 "Unrecognised against unpriced: oil_production stops the run, but water_bbl is a volume column that earns nothing, silently.")

q(2,
 "The hand-derived case sets gas_price_usd_mscf=0 and every row has gas_mscf 0.00. Does gas_price_unset fire?",
 "No, because gas_price_unset fires only when the production data has gas volumes, and there are none.",
 ["Yes, because a gas price of 0 is the same as an unset price and the check reads the configuration, not the volumes.",
  "No, because the engine prices the gas at one sixth of the oil price of 100.000000 through the boe conversion.",
  "Yes, and the run continues with a warning while gas revenue is booked at 0.00."],
 "The refusal is about the pair: an unset gas_price_usd_mscf with gas volumes in the file, and the hand-derived case has neither.")

q(1,
 "A capex row reads drilling_usd=20000000, facilities_usd=5000000 and total_usd=99. What does the refusal machinery do with the 99?",
 "Nothing: the 99 is ignored because of its total_ prefix, capex is 25000000.00, and the only trace is in the annual capex the engine reports back.",
 ["It refuses the row as ambiguous_cost_aliases, because three cost columns in one row hold three different values, which is the ambiguity the message says it will not resolve by picking one.",
  "It prefers the total, since a column named total is the rollup the spreadsheet author checked, and the year's capex reads 99 while drilling_usd and facilities_usd are carried past as parts.",
  "It sums all three columns, the total included, since every column ending in _usd is a cost to the fallback and nothing preferred was present to stop the sum from running."],
 "The engine refuses what it cannot read; it does not refuse what it can read and should not believe.")

q(1,
 "AKATA's totals are oil 9680000.00 bbl and gas 7744000.00 Mscf, and the reported boe is 10970666.67. What converts between the two volumes?",
 "6 Mscf per barrel, fixed: gas counts at one sixth of a barrel per Mscf and condensate counts as a barrel.",
 ["The field's own gas to oil ratio of 800 scf per barrel, read from the upload, so a richer field converts at a richer ratio.",
  "The ratio of the two prices, 3.200000 against 82.000000, so that a barrel of oil equivalent is a barrel of equal value.",
  "A conversion set in the configuration, with 6 as the default."],
 "The convention is fixed, which is why the three-stream case reports boe 10300000.00 from oil 5000000.00, condensate 300000.00 and gas 30000000.00 Mscf.")

q(3,
 "jv_royalty_pct=15 means 15 percent. What does the engine do if a reader enters the fraction instead?",
 "It runs a royalty a hundred times smaller than intended, without objection.",
 ["It refuses the run, since a rate below 1 falls outside the range a percent field accepts.",
  "It recognises a value below 1 as a fraction and converts it, so the ledger reads the same 15 percent either way.",
  "It runs, but reports the royalty column at 0.00 because the fraction rounds away at two decimals."],
 "Percent is a unit that travels with every rate column, and the units refuse to convert: a file in the wrong unit is believed at full precision.")

q(0,
 "A file lists gas in scf under an _mscf header. What does the engine do?",
 "It believes the file: the gas is read a thousand times too large and every number downstream carries the error at full precision.",
 ["It refuses the file, because the gas volumes are inconsistent with the 800 scf per barrel that AKATA's oil and gas columns imply, and the check is made at the door.",
  "It converts the column, since the header names the unit and the engine reads the thousand out of _mscf on the way in.",
  "It flags the row with a warning and prices the gas at 0.00 until the header is corrected."],
 "AKATA's upload column is akata_gas_mscf with 1760000 against 2200000 bbl: the thousand is in the header, and nothing objects to a mismatch.")

emit(Q, '/root/wt-ec7-recut/tools/course-banks/cashflow/beginner/ec1b_m01.json', expect_n=15)
finish()
