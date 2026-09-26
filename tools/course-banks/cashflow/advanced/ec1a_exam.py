import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC1 cashflow, advanced tier, final exam. Reconstructed from the served rows (the applied
# migrations replayed on a local scratch database) with the EC7 PIA re-cut applied;
# written by tools/course-waves/cashflow/pia-recut/build.py. Edit here, then re-run it.

q(2,
 "psc_carryforward's 2030 row carries 80000000.00 of capex and reports taxable income 27000000.00 and tax 13500000.00. Why is the year not a tax loss?",
 "Under a PSC the base is the contractor's profit oil, and capex is not a deduction but a debt the cost oil repays.",
 ["Because the 80000000.00 was depreciated over the ten-year default and only 8000000.00 of it reached the 2030 row as a deduction.",
  "Because the cost oil cap of 40 percent recovered the whole capex in 2030, leaving a profit to tax.",
  "Because the royalty of 10000000.00 is credited against the loss under production sharing, which nets the year to a profit."],
 "Cost oil of 36000000.00 came out of a pool that took in 80000000.00 of capex and 10000000.00 of opex; the rest is carried into 2031, which repeats every fiscal line.")

q(0,
 "deriveOilRoyaltyRate reads 0.050000 for deep offshore at 50000 bopd and 0.075000 at 50001 bopd. On a deep offshore field lifting 60000 bopd, what rate do the barrels below the 50000 bopd threshold carry?",
 "0.075000, like every other barrel of the year: the daily rate picks one rate for the whole year and nothing below the step is priced separately.",
 ["0.050000, with 0.075000 charged on the 10000 bopd above the threshold, which is the blend the marginal field table shows across its tiers.",
  "0.050000 for the months before the field passed 50000 bopd and 0.075000 for the months after, read row by row from the production file.",
  "0.062500, the average of the two tiers, because the engine blends across a step in every terrain that has one."],
 "pia_deep_offshore_full at 60000 bopd pays 131400000.00 on 1752000000.00 of gross revenue, 0.075000 of every barrel; the blend belongs to the marginal field alone, which reads 0.062500 at 10000 bopd.")

q(3,
 "AKATA under the PIA prints hcdt 0.00 in 2029, 720000.00 in 2030 and 741600.00 in 2031, while nddc reads 720000.00 in 2029 and 741600.00 in 2030. Why do the two columns carry the same numbers one year apart?",
 "HCDT is 3 percent of the prior year's opex and NDDC 3 percent of the current year's, and AKATA set pia_prior_year_opex_usd to 0, so the first year pays no HCDT.",
 ["NDDC is charged one year in arrears and HCDT in the current year, and the 2029 HCDT of 0.00 is a rounding of the first year's fixed sum.",
  "The engine charges each levy on half the opex in alternate years, so the two columns take turns carrying the full 3 percent.",
  "Both read the current year's opex, and the 2029 HCDT is 0.00 because the levy is suspended in the year of first oil under the 2025 framework."],
 "With a prior year opex of 20000000 the 2029 HCDT is 600000.00 and NPV moves from 43223505.88 to 43002056.49; neither levy is in the tax column.")

q(1,
 "Under the 2021 Act the worked example pays TET of 25999871.36 and under the 2025 framework a development levy of 41599794.17, with royalty, HCT and CIT unchanged. Why does the course call the levy 1.6 x TET?",
 "Same base, the CIT assessable profit of 1039994854.24; only the rates differ, 4 against 2.5.",
 ["The levy is charged on the HCT base, which is 15000000.00 larger because NDDC is not deducted from it.",
  "The levy is charged on the chargeable profit of 979994854.24 after the restriction, and then on the restricted amount again.",
  "The levy includes the TET it replaced plus the HCDT of 5100000.00 rolled into one line."],
 "Total tax moves from 604809283.90 to 620409206.71 and NPV from 135185570.34 to 119585647.53; the rate is the smaller part of the difference, the base is where the money is.")

q(1,
 "AKATA with a long tail to 2041 reports NPV 87727489.23 with the limit off and 93890737.45 with it on, limit year 2038, years trimmed 3. Why does the default hand a reader the lower figure?",
 "The economic limit is off unless asked for, so the three years whose revenue less royalty falls short of opex stay in the ledger.",
 ["The trimmed ledger is the optimistic one, and the engine defaults to the conservative reading that keeps every year the upload contains.",
  "The default trims on net cash flow rather than operating margin, and the three tail years still had positive net cash flow after tax.",
  "The limit is on by default but the KPI line only reports it when a year is trimmed, and 2039 to 2041 passed the test on their gross revenue."],
 "2038 passes, 37795328.32 against 31314556.41, and 2039 fails, 31541919.46 against 32253993.10; with the limit off the KPI line reads economic_limit_year not reported.")

q(2,
 "A fiscal ledger is worked from the outside in. What is the order?",
 "Regime, framework, terrain, then the bases, then the end of the ledger, and only then the headline.",
 ["Headline first, then the rates that produce it, then the bases, so that every line reconciles to the NPV.",
  "Bases first, since the base decides more than the rate, then the rates, then the regime that names them.",
  "The end of the ledger first, because a terminal negative decides whether the IRR can be used, then the cascade."],
 "Most wrong answers come from starting at the headline; get the framework wrong and every row's last line is wrong.")

q(0,
 "With the economic limit off, elt_off_tail_kept's 2032 row sells 10000.00 bbl for 1000000.00 against 10000000.00 of opex, reports taxable income -14200000.00 and net cash flow -9200000.00. What two things does the kept row do to the ledger?",
 "It banks a 14200000.00 loss with no year after it to spend it, and it hands the IRR a terminal negative, which since engines 3.10.0 comes back as null with a status.",
 ["It relieves the 14200000.00 against the 2031 tax of 32500000.00 by carrying the loss backward into that year, and that relief is why NPV reads 13987603.31 rather than 21590909.09.",
  "It forfeits the 14200000.00 as a CPR deferral rather than as a tax loss, and the joint venture cascade reports it in cpr_deferred_to_next.",
  "It banks the loss for a year the engine appends automatically, and it raises the NPV from 13987603.31 by the relief in that year."],
 "NPV is 13987603.31 with the row against 21590909.09 without it; the loss goes the way of jv_loss_unused_at_cessation's 5000000.00, a memo line in no NPV.")

q(3,
 "applyPSC on 100000000.00 of revenue with a 10 percent royalty and a 0.400000 cap recovers 36000000.00. Why not 40000000.00?",
 "The cap is a share of revenue after royalty, not of the gross.",
 ["The cap is a share of the pool of 80000000.00 rather than of revenue, and 40 percent of the pool is what came out.",
  "The recovery is reduced by the contractor's profit share of 50 percent applied to the cost oil as well as to the profit oil.",
  "The 4000000.00 shortfall is the tax on the cost oil, which the engine deducts before reporting the recovery."],
 "At 0.200000 the recovery is 18000000.00 and at 1.000000 it is the whole pool of 80000000.00, with profit oil moving down by the same steps as recovery moves up.")

q(0,
 "The marginal field royalty reads 0.062500 at 10000 bopd, exactly halfway between 0.050000 and 0.075000, but 0.106250 at 20000 bopd, which is not halfway to 0.150000. Why the difference?",
 "The rate is an average across the year's barrels: at 10000 bopd the two lower tiers split the barrels evenly, and at 20000 the first 10000 bopd are still priced at those tiers while only the rest pays 15 percent.",
 ["The 20000 bopd row has crossed the deep offshore step at 50000 bopd, which lifts the top tier to 0.075000 for the barrels above it.",
  "The blend uses a geometric mean above 10000 bopd and an arithmetic one below it.",
  "The 15 percent tier only opens at 50000 bopd, so at 20000 bopd the rate is still a blend of the two lower tiers weighted by revenue."],
 "The marginal rate never reaches 0.150000; it approaches from below, reading 0.132500 at 50000 bopd and 0.142708 at 120000.")

q(1,
 "cpr_forfeiture carries 40000000.00 of opex and 100000000.00 of capex over five recovery years against 80000000.00 of gross revenue, and prints cpr_cap 52000000.00. What is the 52000000.00 measured on?",
 "The gross revenue, at pia_cpr_limit_pct 65: a cap that is a share of revenue binds where costs approach revenue, and here it defers 8000000.00.",
 ["The costs claimed: 65 percent of the opex plus the year's fifth of the capex, so 52000000.00 is the most any year may recover and the rest becomes a tax loss.",
  "The capex alone: the cap paces the 100000000.00 through the five recovery years, and opex is claimed outside it.",
  "The HCT assessable profit of 22987389.27, since the cap is a limit on deductions against profit rather than against revenue."],
 "The worked example swept from 30 to 100 percent keeps 242500000.00 claimed at every setting because even 438000000.00 sits above the claim; the cap only exists where costs approach revenue, and the 8000000.00 deferred here is forfeited at cessation.")

q(2,
 "pia_loss_relief has a 2025 base year and rows in 2025 and 2026. Its 2026 row prints pia_only and pays TET 5755415.35. What does that reveal about the date trigger?",
 "It reads the base year, not the row year, and the framework chosen once is inherited by every row.",
 ["It reads each row's year, and 2026 is still inside the grace year the framework allows before the levy applies.",
  "It is disabled whenever a loss pool is being relieved, so the row stays under the framework the loss was banked in.",
  "It switched the framework but the TET column is where the engine prints the levy on a ledger that began under the Act."],
 "A base year of 2026 on auto selects nta_2025 by the date alone, and a ledger based in 2026 would have paid the levy; the same holds on pia_cpr_carry_two_years, 2025 to 2027 all pia_only.")

q(3,
 "AKATA with a 60000000 lump sum in 2035 reports NPV 38666394.86, total tax 148425219.46 and IRR null, and its 2035 net cash flow is -29598201.95. Why is there no rate?",
 "The final flow changed sign, and since engines 3.10.0 a rate is named only where exactly one rate in the band from -99 to 1000 percent zeroes the NPV.",
 ["The IRR excludes the abandonment row, and a vector of six producing years with no outflow has no sign change to bracket a root.",
  "The rate was computed on the pre-tax flows because the lump sum is undeductible, and a pre-tax vector never turns negative.",
  "The NPV of 38666394.86 is positive at every sampled rate, so no rate zeroes it."],
 "Until that repair the same run printed a rate, one root of a curve that had another; at 200000000 the final flow is -169598201.95 and the IRR is null for the opposite reason, the NPV being negative at every sampled rate, -40359955.35 at the applied rate. The tax total never moves because the lump sum is post-tax.")

q(3,
 "AKATA under the PIA reports NPV 43223505.88 in shallow water, 128984232.18 at an oil price of 120, and 141623594.88 in deep offshore under the conservative reading. What does that comparison tell a negotiator?",
 "That a word in the document outweighs the market: the terrain string moves NPV further than the price sweep to 120.",
 ["That the price is the bigger lever, since a market move is worth more than any word in the fiscal terms.",
  "That the two moves are the same size, because deep offshore lowers only the royalty and a price rise lifts revenue by as much.",
  "That the terrain string is a price effect in disguise, since a lower royalty rate acts exactly like a higher realised price on every barrel."],
 "Deep offshore under the conservative reading lowers the production royalty rate and zeroes the HCT, which lifts NPV to 141623594.88, further than the 128984232.18 an oil price of 120 buys. A cap, a lease status or a reading moves NPV further than the market, and those are words in a document.")

q(0,
 "On cpr_forfeiture the two-thirds CIT restriction refuses part of the allowance, cpr_deferred_to_next reads 8000000.00, and the ledger ends: CPR forfeited at cessation 8000000.00. Which of the unclaimed value on that row would a further year have rescued?",
 "Both of them, since the CPR deferral would have met the next year's cap and the refused allowance is carried too, so only a ledger that stops here loses either.",
 ["The CPR deferral only, since this engine has never carried what the two-thirds restriction refuses and the Act carries it alone.",
  "The refused allowance only, which is deferred exactly one year and then claimed opex-first, while a CPR deferral is extinguished at each year end and never reaches the next cap.",
  "Neither, because a single-year field forfeits everything and a second year would start a fresh cascade with its own cap."],
 "pia_cpr_carry_two_years carries 22000000.00, 44000000.00 and 66000000.00 across three binding years and forfeits the 66000000.00 at cessation; the allowance carry is priced by pia_cit_allowance_restricted_carry at NPV -113389070.73 against pia_cit_allowance_no_carry at -115209545.41.")

q(1,
 "AKATA under production sharing at a 45 percent cap recovers 75342960.00 in 2029 against 100457280.00 at 60 percent, and ends 2035 with 91570072.23 still in the pool where the 60 percent run ends with 0.00. Both runs put the same costs into the pool. What did the lower cap change?",
 "Only how much may come out each year: the pool is the same money, the cap is a ceiling per year, and the years ran out before the 45 percent pool did.",
 ["How much went in: at 45 percent the engine adds the unrecovered profit oil to the pool, so the balance grows with every year the cap binds and never clears.",
  "The share of the pool the contractor is entitled to, since the cap is a ceiling on the pool itself and 45 percent of it is all that may ever be recovered.",
  "The escalation of the balance, which the engine compounds at the 3 percent inflation rate while a pool waits and stops compounding once it clears."],
 "The one-year applyPSC case says the same thing in miniature: 30000000 brought forward at the 0.4 cap still recovers 36000000.00 and only lifts the carried amount from 44000000.00 to 74000000.00; a bigger pool does not recover faster, it waits.")

q(2,
 "The worked example sells at 80.000000 in 2025 and pays a price royalty of 34905145.759897 on 1460000000.00 of gross revenue. A reader prices it at the 2021 rate for 80 USD. What does the reader get?",
 "0.030000 rather than the 0.023908 the engine applies, an overstated royalty and both tax bases downstream understated, with the error growing every year the field runs.",
 ["The same figure, because the anchors are fixed by the 2021 Act and the escalator applies only to the price, not to the schedule.",
  "0.023908, because the 2021 table already carries the 2025 escalation for a field whose base year is 2025.",
  "0.050000, the rate at the 100 anchor, because the engine rounds the price up to the next anchor before reading the rate."],
 "The anchor prices escalate at 2 percent a year from 2021, so the same nominal price earns a smaller rate every year: 80 USD reads 0.030000 in 2021, 0.023908 in 2025 and 0.010630 in 2035.")

q(1,
 "A new shallow water lease with 1000000 bbl at 30 USD per barrel and no prior production earns an allowance of 6000000.00 rather than 8000000.00, and prod_alw_cap_applied reads false. Which rule cut the allowance, and what did the flag say about it?",
 "The 20 percent of price limit, which at 30 USD sits below the 8 USD new lease rate; the flag reports the volume cap only and stayed false.",
 ["The volume cap, read on lifetime barrels, which trimmed the eligible barrels; the flag reads false because a lease with no prior production has not yet reached 100000000 bbl.",
  "The converted lease rate of 2.5 USD per barrel, which the engine falls back to when the price is below the 50 anchor; the flag confirms that no cap of either kind acted.",
  "The two thirds restriction, which limits the allowance to two thirds of the assessable profit; the flag is false because that restriction is reported on the CIT line instead."],
 "computeProductionAllowance prints cap applied false on every price-limited row, 2000000.00 on a converted lease at 10 USD as well; the flag is only ever true for a new lease that reaches its volume cap, 500000.00 eligible bbl from a prior 99500000.")

q(3,
 "jv_loss_carryforward's 2031 row reports taxable income 65000000.00, loss_offset_used 5000000.00 and tax 30000000.00. What is the tax charged on?",
 "Taxable income less the offset; the offset has its own column and the taxable_income column does not show it being spent.",
 ["The taxable income column at a rate reduced by the loss, from 50 to a lower effective rate that the engine derives from the pool.",
  "Taxable income less depreciation of 5000000.00, deducted twice because 2030 had no revenue to absorb it.",
  "The cumulative cash flow, which is -10000000.00 at the end of 2031 and turns the tax into a partial refund."],
 "A reader checking the rate against the taxable income column concludes it is wrong; with relief off the row pays 32500000.00 and NPV falls from -13636363.64 to -15909090.91.")

q(2,
 "AKATA is abandoned three ways for the same 60000000.00: a lump sum in the final year, a fund from the first year and a fund from 2032. The two funds report 21.9086 and 23.9820 percent. The lump sum reports no rate at all. What separates the lump sum from both funds?",
 "It is paid post-tax, so its total tax stays at 148425219.46 where the funds relieve it to 124585925.52 and 127157354.09, and its final row turns negative, which leaves the engine no single rate in the band to name.",
 ["It is charged in one year rather than spread over seven, and the engine declines to name a rate on any ledger whose costs are not spread across several rows, returning null wherever one row carries the whole of a cost.",
  "It is scaled by the working interest while a fund is not, so the lump sum ledger is reported at the share and the two fund ledgers at field level, and a rate computed on one of those bases cannot be set beside a rate computed on the other.",
  "It is deducted from the pre-take value rather than from the tax base, so government take has no denominator on that run at all, and the engine suppresses the internal rate of return on any ledger whose take it cannot compute."],
 "The lump sum lands post-tax in the final year: total tax 148425219.46 against 124585925.52 for the fund from the first year and 127157354.09 for the fund from 2032, and NPV 38666394.86 against 44902775.54 and 47415100.31. Its final nominal flow is -29598201.95, and a terminal negative leaves no single rate in the band, so the IRR is null with a status rather than a number.")

q(2,
 "The worked example forced to nta_2025 at a 2025 base year pays a levy of 41599794.17, and on auto at a 2026 base year 41684425.66. A reader attributes the whole difference to the framework. What actually moved the levy?",
 "Not the framework, which is nta_2025 both times, but the price royalty anchors, which escalated a year further and lowered the royalty to 215289358.59, raising the assessable profit the levy follows.",
 ["The framework: the levy rate is read from the base year, and a 2026 base year carries a slightly higher levy rate than a forced 2025 one.",
  "The discounting: a 2026 base year discounts the levy one year less, which the KPI line reports as the higher figure.",
  "The HCDT: a second year of opex history raises the prior-year levy and the assessable profit with it."],
 "The price royalty falls from 34905145.759897 to 32789358.588134, HCT rises to 285445692.42 and CIT to 294633192.42, and NPV moves from 119585647.53 to 120347330.91.")

q(0,
 "psc_tranches gives the contractor 60 percent from a cumulative of 0 and 40 percent from 1 million bbl. The 2030 row produces 1000000.00 bbl. Which share does 2030 carry?",
 "60.000000, because the table is read at the cumulative liquids at the start of the year, and 2030 opens at 0.",
 ["40.000000, because 2030's own 1000000.00 bbl carries the field to the boundary and the share is read at the year's end.",
  "50.000000, the average of the two tranches, because the field crosses the boundary on the last barrel of the year and the engine interpolates.",
  "60.000000 for the profit oil and 40.000000 for the cost oil, since the tranche table applies to both slices separately."],
 "999999 bbl gives 0.600000 and 1000000 gives 0.400000; 2030's taxable income is 32400000.00 against 27000000.00 at a flat 50, and 2031 opens at 1000000 bbl and drops to 40.000000.")

q(2,
 "AKATA's 2029 row sells oil and gas for 186032000.00 of gross revenue at an oil price of 82.000000 and prints a price royalty of 3605512.362941. A reader who applies the year's rate to the whole 186032000.00 lands above it. Which revenue does the price royalty charge?",
 "The oil revenue alone: the price royalty reads the oil price and charges the oil, and the gas inside the gross revenue carries none of it.",
 ["The gross revenue less the production royalty of 22944240.00, which is the revenue after the first royalty and therefore the base of the second one.",
  "The oil and gas together, with the gas converted at 6 Mscf per barrel of oil equivalent and priced at the year's oil price of 82.000000.",
  "The revenue after HCDT and NDDC, since the levies come off before any royalty and the smaller base explains the smaller figure."],
 "pia_gas_only_hct_zero has no oil and prints price_royalty 0.000000 beside a production royalty of 6300000.00 on 90000000.00 of gas revenue; on AKATA at 92.345318 in 2035 the price royalty is 1421137.383868 on 73325786.51, falling with the barrels because the anchors escalate at the same 2 percent as the price.")

q(1,
 "pia_gas_only_hct_zero reports hct_assessable_profit 0.00 and NPV 17380000.00; with pia_hct_include_gas_revenue true the base becomes 68600000.00, HCT 19380000.00 and NPV -2000000.00. Which run reads the Act as the engine understands it?",
 "The first: the hydrocarbon tax base is liquids, oil and condensate, with gas left out, and the hatch is a legacy escape that rebuilds the base on the whole revenue.",
 ["The second: gas is a hydrocarbon and the default of excluding it is an omission the hatch corrects.",
  "Neither: gas carries its own HCT rate in the table, and both runs apply the liquids rate to it by mistake.",
  "Both, because the engine charges HCT on gas at 0.000000 in the first and at 0.300000 in the second, and the terrain decides which."],
 "CIT is still 14880000.00 on a cit_chargeable_profit of 49600000.00 in both runs; on AKATA the gas revenue and its royalty are out of the HCT base of 130971072.31 and in the CIT base of 134762247.64.")

q(3,
 "jv_loss_unused_at_cessation is one row, 2030, with 50000000.00 of capex, no production and a banked loss of 5000000.00, and its KPI line reads take null beside DPI -1.000000. Why is the take null rather than a percentage?",
 "Take is the government share of a pre-take value, and with no revenue there is nothing to share, so the engine returns null rather than a percentage of nothing.",
 ["Because the unused loss of 5000000.00 is subtracted from the government's share and leaves the ratio undefined until a later year spends it.",
  "Because take is only reported once payback has been reached, and a payback beyond project life leaves the ratio unreported on every single-row ledger the engine sees.",
  "Because a take is computed on the discounted flows, and a single row discounted at exponent zero has no discounting for the ratio to read, so the engine prints null."],
 "DPI -1.000000 is the honest reading: every unit of capital was lost. NPV is -50000000.00, the whole capex, and the 5000000.00 memo line appears nowhere in it; give the capex one more year of production and the pool is spent, tax 30000000.00 against 32500000.00.")

q(2,
 "jv_abandonment_wi_60 charges the entered 10000000.00 in full against 60 percent flows, and pia_sinking_fund_wi_50 collects 30000000.00 against a total_abandonment_cost of 30000000.00. What is abandonment_cost_usd under each funding mode?",
 "A field-level number under both, scaled by the working interest on the way into the ledger.",
 ["A share-level number under a lump sum and a field-level one under a fund, so the fund at a 50 percent interest collects only half of what was entered.",
  "The share under both, since engines 3.10.0 grossed the fund by one over the working interest so that it collects exactly what was entered.",
  "A field-level number under a lump sum and a share-level one under a fund, so a partner must halve the entry before switching modes."],
 "Until that repair the fund collected half and pia_sinking_fund_wi_50 read a higher NPV than the 55592785.17 it reports now; the unit technical cost of jv_abandonment_wi_60 is 43.333333 against 40.000000 at a full interest.")

q(1,
 "AKATA under the PIA is NPV 43223505.88. Write the sentence that names it.",
 "43223505.88 on the real basis, end-year, base year 2029, framework nta_2025, shallow water, converted PML, conservative reading.",
 ["43223505.88 at 10 percent nominal, mid-year, base year 2029, framework pia_only, shallow water, new lease.",
  "43223505.88 on the real basis, end-year, base year 2029, framework nta_2025, deep offshore, converted PML, aggressive reading.",
  "43223505.88 on the real basis, end-year, base year 2025, framework pia_only, shallow water, converted PML."],
 "Every one of those words is a lever the ledger has shown moving: forced to pia_only the same rows report 49802016.74, and deep offshore conservative 141623594.88.")

q(0,
 "pia_sinking_fund's 30000000.00 contribution lowers HCT from 284810956.27 to 275810956.27 and CIT from 293998456.27 to 284998456.27 while TET stays 25999871.36. Which bases received the contribution?",
 "The HCT chargeable profit and the CIT chargeable profit, each at its own rate; the levy base, the assessable profit, is untouched.",
 ["The HCT base only, with the CIT change following because CIT is charged on the profit after HCT.",
  "All three bases, with the TET unchanged only because it is rounded to the nearest cent.",
  "The HCDT and NDDC lines, which are opex-based and so absorb an opex-lane contribution first."],
 "The contribution rides the opex lane and relieves the two profit taxes at their rates and nothing else; NPV falls from 135185570.34 to 123185570.34.")

q(0,
 "psc_itc sets a 50 percent credit on 80000000.00 of capex, and both years show tax 0.00 with taxable income 27000000.00 unchanged. What does the credit do that a deduction would not?",
 "It is applied after the tax is computed and never touches the base; it absorbs the 13500000.00 of tax each year and the remainder carries unused past the end of the field with no refund.",
 ["It reduces the taxable income to zero in both years, which is why the tax column reads 0.00 and the profit oil is unchanged.",
  "It is paid to the contractor as cash in 2030, which is why net cash flow rises from -40500000.00 to -27000000.00.",
  "It raises the cost oil cap by 50 percent so that the capex is recovered inside the two years."],
 "The applyPSC sample shows the rule: an ITC of 40000000 against a tax before credit of 4500000.00 uses 4500000.00 and carries 35500000.00; the credit is not cash.")

q(3,
 "pia_deep_offshore_wi_50 halves every monetary line and reports NPV 445282165.97, exactly half of 890564331.93, while pia_deep_offshore_naive_30k halves the upload instead and reports 372530915.97. Where does the naive run lose the difference?",
 "At half the daily rate it falls into the 0.050000 tier, so its royalty is 43800000.00 rather than half of 131400000.00, and it still bears the full 100000000.00 of capex and opex and the full levies.",
 ["It loses the production allowance, which the engine grants only above the 50000 bopd threshold.",
  "It is discounted for one more year because the smaller field is assumed to start later.",
  "It pays HCT at 0.300000, since the conservative reading only applies above the deep offshore threshold."],
 "Two errors in opposite directions, and neither cancels the other: the royalty is understated and the costs overstated, and take reads 44.8919 percent against 42.6183.")

q(2,
 "cpr_forfeiture has cit_assessable_profit 7987389.27, cit_chargeable_profit 2662463.09 and cit_tax 798738.93, and its ledger is one year long. Where does the allowance the two-thirds restriction refused reappear?",
 "Nowhere on this ledger: the engine carries it since 3.10.0, but a single year has no later year for the carryforward to be claimed in.",
 ["In cpr_deferred_to_next, which reads 8000000.00 and is the restricted allowance waiting for the next year.",
  "In hct_loss_carryforward, since the HCT on the same row is charged on 8487389.27 without the restriction and the difference is banked there.",
  "Nowhere on any ledger, because this engine has never carried what the restriction refuses."],
 "The 8000000.00 in cpr_deferred_to_next is the CPR cap's deferral, a different mechanism; pia_cit_allowance_restricted_carry claims its carried allowance the following year and reports NPV -113389070.73 against -115209545.41 with the carry switched off.")

q(1,
 "With pia_apply_minimum_etr true at 85 percent the worked example's total tax becomes 883995626.10, which is 85 percent of 1039994854.24, through a top-up of 279186342.20. Which taxes did the floor treat as already paid?",
 "HCT, CIT and TET, because royalty is charged on revenue and cannot count toward an effective rate on profit.",
 ["Only HCT and CIT, 284810956.27 plus 293998456.27, which is why the top-up is so large.",
  "All 604809283.90 of them, royalty and the levies included.",
  "Only the taxes on the chargeable profit of 979994854.24, the profit that the floor is measured against."],
 "The 604809283.90 in the tax column is HCT 284810956.27 plus CIT 293998456.27 plus TET 25999871.36, with royalty 217405145.76, HCDT and NDDC outside it; test the floor against HCT plus CIT alone and the shortfall comes out larger than 279186342.20, and the top-up is charged on a profit measured before capex, so net cash flow becomes -144000771.86 and take 114.7315 percent.")

q(3,
 "AKATA at a three-year shift has no 2031 row. NPV falls from 40880824.32 to 17894126.42 and IRR falls from 14.6753 to 11.6363 percent, both as they should, yet payback shortens from 4.96 to 4.90 years. What does the shortening payback tell a reader?",
 "That payback is counted on rows rather than on calendar years, so the missing row made the delay look shorter to it; the NPV is discounted on calendar years and can be trusted.",
 ["That the delay improved the field, because the later rows sell at escalated prices of 87.019056 and beyond and the capex was shifted with them, so the 255000000.00 is a year cheaper on present value and the crossing arrives sooner.",
  "That the engine emitted an empty 2031 row with zero flow and the extra row diluted the cumulative sum, so the crossing was interpolated over ten rows instead of nine and moved in the field's favour.",
  "That the loss pool of 21000000.00 was spent in the delayed first year and brought the crossing forward."],
 "A longer wait for the same money cannot shorten a payback; capex is not shifted, the engine refuses to emit a row for an empty year, and until engines 3.10.0 the IRR of this run read 15.1070 percent and rose with the delay for the same reason.")

q(1,
 "psc_abandonment_wi_50 charges a 10000000.00 lump sum against 50 percent flows and reports a 2031 net cash flow of 9750000.00 where psc_wi_50 had 19750000.00; psc_sinking_fund instead shows a decom_fund_contribution of 10000000.00 in 2031. How do the two modes sit against the production sharing contract?",
 "The lump sum is paid outside the contract, unscaled after the working interest share, while the contribution enters the recoverable cost lane and rides the pool.",
 ["Both are paid outside the contract, and the fund is simply the lump sum spread over the years the contract has left, so the contribution of 10000000.00 in 2031 is charged after tax exactly as the lump sum on psc_abandonment_wi_50 is.",
  "Both enter the recoverable cost lane, and the lump sum is recovered as cost oil in the final year at the cap.",
  "The lump sum is scaled by the working interest at the door like every other PSC input, and the contribution is not, which is why the 50 percent case shows a net of 9750000.00 rather than a half-scaled outflow."],
 "psc_sinking_fund's 2031 net cash flow is 29500000.00 against 39500000.00 without it; under JV terms the same lump sum is unscaled too, 10000000.00 against 60 percent flows on jv_abandonment_wi_60.")

q(0,
 "AKATA in deep offshore reports 61725382.46 under the aggressive reading and 141623594.88 under the conservative one, with royalties of 59501441.00 in both, against 43223505.88 in shallow water. How much of the conservative gain is royalty and how much is the hydrocarbon tax?",
 "The royalty alone takes 43223505.88 to 61725382.46, since the aggressive reading keeps the HCT rate at 0.300000; the reading of the HCT rule takes it the rest of the way to 141623594.88.",
 ["It is all royalty: the HCT rate is 0.000000 in deep offshore under either reading, and the two figures differ by the CIT the readings charge, since the aggressive reading moves the CIT rate rather than the HCT rate.",
  "It is all hydrocarbon tax: the production royalty is 0.125000 in every offshore terrain and only the price royalty moved, so the 59501441.00 of royalties in deep offshore is the shallow water figure less the price component alone.",
  "The two cannot be separated, because the terrain string sets one blended fiscal rate that the engine does not decompose."],
 "The 2029 production royalty is 9301600.00 in deep offshore against 22944240.00 in shallow water, and HCT is 29481778.65 aggressive against 0.00 conservative; the terrain string moves NPV further than the price sweep from 82 to 120.")

q(2,
 "AKATA under production sharing reports a take of 82.1085 percent at a 60 percent cost oil cap, at 80 and at 100, but 99.0577 at 45 and 120.4874 at 30. Why does the take stop moving above 60?",
 "Once the pool clears inside the field's life the cap only moves timing, and timing is what NPV and IRR price, not take.",
 ["Above 60 percent the cap no longer binds in any year, so cost oil equals the year's costs and the take is the royalty plus tax on a fixed profit oil.",
  "The engine caps the take at 82.1085 percent for production sharing, which is the royalty rate plus the tax rate blended at the contractor share.",
  "Above 60 percent the contractor share of profit oil steps down to hold the take constant, as the tranche mode requires once the pool has cleared."],
 "At 60 percent the pool clears in 2034, at 80 in 2031 and at 100 in 2030; NPV still rises from 29960298.75 to 48148675.31 across the three because the money arrives sooner.")

q(3,
 "AKATA run as a marginal field cuts the 2029 production royalty from 22944240.00 to 10182990.00 but reports HCT of 29251153.65 against 25422778.65, and NPV 61154067.34 rather than a larger gain. Why did the tax take most of the royalty back?",
 "The pre-2021 flag was not set, so the field pays HCT at 30 percent on a base the smaller royalty has left larger.",
 ["The marginal blend charges the shortfall in royalty as HCT, since the two are reconciled at the end of the cascade.",
  "The marginal field pays the price royalty at the top tier, and the price royalty is charged inside the HCT column.",
  "The marginal terrain carries the highest gas royalty, and AKATA's associated gas makes up the difference."],
 "pia_marginal_field_blend sets the flag and pays 0.150000, 26361776.50 on 175745176.68; the blend does not switch the tax rate, the flag does.")

q(0,
 "AKATA under the PIA claims 66000000.00 against a cpr_cap of 120920800.00 in 2029, its 24000000.00 of opex plus a fifth of the 210000000.00 capex, and 75720000.00 against 103717068.00 in 2030 beside opex of 24720000.00. Why did the claim grow by more than the opex did?",
 "The 45000000.00 of capex spent in 2030 started its own five-year recovery, so 2030 claims a fifth of both tranches beside its opex.",
 ["The 2029 allowance was restricted to two thirds of the assessable profit and the disallowed third was carried into the 2030 claim, as the Act requires it to be.",
  "The cap fell from 120920800.00 to 103717068.00, and the engine claims the whole gap between cap and opex in any year the cap falls, so a lower cap raises the claim.",
  "The production allowance of 4625000.00 is claimed inside the CPR claim from the second year onward, and its arrival is the extra in 2030."],
 "On the worked example the recovery years are the whole answer, 482500000.00 claimed at 1 and 212500000.00 at 10 against 242500000.00 at 5; on AKATA each tranche runs its own clock, and a field that stops before the years run out never claims the rest.")

q(1,
 "On the real basis AKATA's applied rate is 6.796117 percent and the profile point that carries it is labelled 6.8. What does that point read?",
 "72534830.66, the headline itself: since engines 3.10.0 the point is labelled at the rounded rate and evaluated at the exact one, so the gap is 0.00.",
 ["The NPV at exactly 6.8 percent, which sits a little way under the headline, because the label is past the applied rate and NPV always falls as the rate rises.",
  "Whichever of the two the reader asks for, since the profile carries the labelled point and the exact one as a pair.",
  "A value interpolated between the 5 percent point of 83023565.60 and the 8 percent point of 65968275.69 rather than computed."],
 "Until the repair of 2026-09-15 the point was evaluated at its label too, and eight published cases carried a gap, -40996.42 on multiyear_pia_real and -18628.18 on multiyear_jv_real among them; the golden now records 0 profile disagreements.")

q(2,
 "AKATA on auto reports 43223505.88 with a levy of 5390489.91 in 2029; forced to pia_only it reports 49802016.74 with TET of 3369056.19. A reader writes 43223505.88 beside the word pia_only. What does the checklist say?",
 "The headline fails: basis, convention and framework are written beside it, and 43223505.88 belongs to nta_2025.",
 ["The headline passes, because the framework only changes the last line of the cascade and the NPV is reported before the levy is charged.",
  "The headline passes if the override was left on auto, since auto is neither framework and the label is a matter of convention.",
  "The headline fails only by the levy: subtract 21007007.79 and add 3369056.19 to move it to the pia_only figure, since the two frameworks share every other line."],
 "Get the framework wrong and every row's last line is wrong; one of tet_tax and dev_levy_tax is 0.00 on every row and the fiscal_framework column says which.")

q(3,
 "AKATA with a 200000000 lump sum reports IRR null while its NPV is -40359955.35 at the applied rate and -58362170.82 at 0 percent. The checklist asks for the sign of the final flow. What does the reader conclude?",
 "The final flow of -169598201.95 is negative, so no IRR on this ledger could be trusted on its own; the profile, negative at every sampled rate, is the reading, and null is not a data error.",
 ["The null is a root finder fault, since a project with a defined NPV at every rate must have a rate that zeroes it.",
  "The final flow is negative, so the IRR is the lower of two roots and the engine printed null in place of the smaller one, which the bisection fallback cannot reach from 10 percent because the NPV never changes sign in the region it searches.",
  "The null means the field is worth exactly its capex at every rate, which the negative profile then contradicts, so the ledger is refused and the NPV figures printed beside it are the ones from the run without the abandonment."],
 "With 60000000 the final flow is -29598201.95 and the engine reports null there as well, for the other reason in the contract: more than one rate in the band zeroes that NPV, so no single rate is named.")

q(0,
 "The 2029 row of AKATA as a new lease is identical whether the prior cumulative is 0 or 96000000: allowance 17600000.00, cap applied false, HCT 21792778.65. Which reading in the working order catches the difference before the headline does?",
 "The lease and reading step, followed by the totals: allowance 77440000.00 against 32000000.00 over the life, since the cap bites in later years.",
 ["The framework step, since a lease with prior production is read under pia_only and one without under nta_2025.",
  "The 2029 row alone, whose cap applied flag reads true once the prior barrels are entered.",
  "The royalty step, because prior production lifts the field into the 0.075000 tier and the royalty totals differ, so the difference is in the royalty line rather than in the allowance."],
 "NPV is 56241834.89 against 46513356.33 and HCT 61048493.72 against 74680493.72; the strings must be read from the case, not guessed from a rule of thumb.")

q(1,
 "psc_wi_50 halves oil_bbl to 500000.00 a year and reports total oil 1000000.00 bbl, while pia_deep_offshore_wi_50 halves oil_bbl to 10950000.00 but keeps cumulative_oil_bbl_lifetime at 21900000.00. Which ledger still remembers the field?",
 "The PIA one: the working interest is applied to the money afterward, and cumulative_oil_bbl_lifetime and prod_alw_eligible_bbl keep the field's barrels so the tier is read at 60000 bopd.",
 ["The PSC one: entitlement volumes are the field's volumes scaled, and the tranche table is read on the field's cumulative rather than the entitlement, so a 50 percent share still opens each year at the field's tranche boundary.",
  "Both, since each reports working_interest_pct and the engine can recover the field from a share when that column is set.",
  "Neither, because a scaled run has no field-level readout in either regime and the naive upload cannot be told from a small field."],
 "Under a PSC the working interest is applied at the door and the rows are the share; under the PIA the royalty is still 0.075000 and half of 131400000.00 is 65700000.00, with take invariant at 42.6183 percent.")

emit(Q, '/root/wt-ec7-recut/tools/course-banks/cashflow/advanced/ec1a_exam.json', expect_n=42)
finish()
