import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC1 cashflow, advanced tier, final exam. Reconstructed from the served rows (the applied
# migrations replayed on a local scratch database) with the EC7 PIA re-cut applied;
# written by tools/course-waves/cashflow/pia-recut/build.py. Edit the rows there, then re-run it.

q(2,
 "psc_carryforward's 2030 row carries 80000000.00 of capex and reports taxable income 27000000.00 and tax 13500000.00. Why is the year not a tax loss?",
 "Under a PSC the base is the contractor's profit oil, and capex is not a deduction but a debt the cost oil repays.",
 ["Because the 80000000.00 was depreciated over the ten-year default and only 8000000.00 of it reached the 2030 row as a deduction.",
  "Because the cost oil cap of 40 percent recovered the whole capex in 2030, leaving a profit to tax.",
  "Because the royalty of 10000000.00 is credited against the loss under production sharing, which nets the year to a profit."],
 "Cost oil of 36000000.00 came out of a pool that took in 80000000.00 of capex and 10000000.00 of opex; the rest is carried into 2031, which repeats every fiscal line.")

q(0,
 "deriveOilRoyaltyRate reads 0.050000 for deep offshore at 50000 bopd and at 50001 bopd, and 0.054167 at 60000 bopd. On a deep offshore field lifting 60000 bopd, what rate do the barrels up to 50000 bopd carry?",
 "0.050000, with 0.075000 on the 10000 bopd above, so the one weighted rate the year charges on every barrel is 0.054167.",
 ["0.075000, like every other barrel of the year: once the daily rate passes 50000 bopd the whole year's volume steps up to the higher rate.",
  "0.050000 for the months before the field passed 50000 bopd and 0.075000 for the months after, read row by row from the production file.",
  "0.062500, the plain average of the two rates, because the engine splits a crossing year evenly between them whatever the daily rate is."],
 "pia_deep_offshore_full at 60000 bopd pays 94900000.00 of production royalty on 1752000000.00 of gross revenue: 50000 bopd at 5 percent and the 10000 above at 7.5 percent, a weighted 0.054167 on the whole volume. Onshore and shallow water weight their tranches the same way; only frontier is flat.")

q(3,
 "AKATA under the PIA prints hcdt 0.00 in 2029, 720000.00 in 2030 and 741600.00 in 2031, while nddc reads 7020000.00, 2091600.00 and 763848.00. Why are the two levies far apart in the capex years and close together in 2031?",
 "HCDT is 3 percent of the prior year's opex and NDDC 3 percent of the year's opex plus capex, and AKATA set no prior-year opex, so 2029 pays no HCDT.",
 ["NDDC is charged one year in arrears and HCDT in the current year, and the 2029 HCDT of 0.00 is a rounding of the first year's fixed sum.",
  "The engine charges each levy on half the opex in alternate years, so the two columns take turns carrying the full 3 percent of the budget.",
  "Both read the current year's opex plus capex, and the 2029 HCDT is 0.00 because that levy is suspended in the year of first oil."],
 "NDDC reads the whole annual budget, so the 210000000.00 of capex in 2029 lifts it to 7020000.00, while HCDT reads only the previous year's opex; in 2031 there is no capex and the two differ by one year of opex escalation. With a prior-year opex of 20000000 the 2029 HCDT is 600000.00 and NPV moves from 59766796.57 to 59545347.19; neither levy is in the tax column.")

q(1,
 "In its 2025 year under the Act the worked example pays TET of 31747249.45, and forced to the 2025 framework it pays a development levy of 42329665.93 instead, with royalty, HCT and CIT unchanged. Why is the levy four thirds of the TET?",
 "Same base, the CIT assessable profit of 1058241648.19; only the rates differ, 4 against 3.",
 ["The levy is charged on the HCT base, which is 15000000.00 larger because the NDDC is kept out of that base and taken off the CIT base only.",
  "The levy is charged on the chargeable profit of 998241648.19 after the allowance, and then a second time on the part of the allowance that was restricted.",
  "The levy includes the TET it replaced plus the HCDT of 5100000.00 rolled into one line."],
 "Both are charged on the CIT assessable profit of 1058241648.19, TET at 3 percent in 2025 and the levy at 4 percent, so the difference is one percent of that base, 10582416.48. Total tax moves from 617004738.36 to 627587154.84 and NPV from 141236909.83 to 130654493.35.")

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
 "It banks a 14200000.00 loss with no year after it to spend it, and it hands the IRR a terminal negative, so the rate comes back as null with a status.",
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
 "The onshore royalty reads 0.062500 at 10000 bopd, exactly halfway between 0.050000 and 0.075000, but 0.106250 at 20000 bopd, which is not halfway to 0.150000. Why the difference?",
 "The rate is an average across the year's barrels: at 10000 bopd the two lower tiers split the barrels evenly, and at 20000 the first 10000 bopd are still priced at those tiers while only the rest pays 15 percent.",
 ["The 20000 bopd row has crossed the deep offshore step at 50000 bopd, which lifts the top tier to 0.075000 for the barrels above it.",
  "The blend uses a geometric mean above 10000 bopd and an arithmetic one below it.",
  "The 15 percent tier only opens at 50000 bopd, so at 20000 bopd the rate is still a blend of the two lower tiers weighted by revenue."],
 "The onshore rate never reaches 0.150000; it approaches from below, reading 0.132500 at 50000 bopd and 0.142708 at 120000. A marginal field is onshore or in shallow water and reads the same tranche table as any other field there.")

q(1,
 "cpr_forfeiture carries 40000000.00 of opex and 100000000.00 of capex over five recovery years against 80000000.00 of gross revenue, and prints cpr_cap 52000000.00. What is the 52000000.00 measured on?",
 "The crude oil and condensate revenue, at pia_cpr_limit_pct 65: the cap binds where costs approach that revenue, and here it defers 8000000.00.",
 ["The costs claimed: 65 percent of the opex plus the year's fifth of the capex, so 52000000.00 is the most any year may recover and the rest becomes a tax loss.",
  "The capex alone: the cap paces the 100000000.00 through the five recovery years, and opex is claimed outside it.",
  "The HCT assessable profit of 13987213.60, since the cap is a limit on deductions measured against profit rather than against any revenue line."],
 "The case sells no gas, so its crude revenue is its gross revenue of 80000000.00 and 65 percent of it is 52000000.00. The cap limits only the costs claimed against the hydrocarbon tax, and the 8000000.00 it defers here is forfeited at cessation because the ledger has no later year.")

q(2,
 "pia_loss_relief has a 2025 base year and rows in 2025 and 2026. Its 2025 row prints pia_only, and its 2026 row prints nta_2025 with TET 0.00 and a development levy of 12098579.71. What does that reveal about the date trigger?",
 "It reads each row's year of assessment, so one ledger based in 2025 carries a PIA year and then an NTA year where the levy replaces TET.",
 ["It reads the base year, so a 2025 base year on auto should have kept both rows under the Act; the 2026 row is the override misfiring.",
  "It is disabled whenever a loss pool is being relieved, so the relief year stays under the framework in which the loss was first banked.",
  "It switched the framework only because the loss pool ran out in 2025; a ledger still relieving a loss would stay where it began."],
 "The framework is chosen for each year of assessment: 2025 is a year under the Act and 2026 a year under the Nigeria Tax Act 2025, whatever the base year. pia_cpr_carry_two_years shows the same split, pia_only in 2025 and nta_2025 in 2026 and 2027.")

q(3,
 "AKATA with a 60000000 lump sum in 2035 reports NPV 38666394.86, total tax 148425219.46 and IRR null, and its 2035 net cash flow is -29598201.95. Why is there no rate?",
 "The final flow changed sign, and a rate is named only where exactly one rate between -99 and 1000 percent zeroes the NPV.",
 ["The IRR excludes the abandonment row, and a vector of six producing years with no outflow has no sign change to bracket a root.",
  "The rate was computed on the pre-tax flows because the lump sum is undeductible, and a pre-tax vector never turns negative.",
  "The NPV of 38666394.86 is positive at every sampled rate, so no rate zeroes it."],
 "A terminal negative gives the flows a second sign change and the NPV curve more than one root in the band, so the engine returns null with a status. At 200000000 the final flow is -169598201.95 and the IRR is null for the opposite reason, the NPV being negative at every sampled rate, -40359955.35 at the applied rate. The tax total never moves because the lump sum is post-tax.")

q(3,
 "AKATA under the PIA reports NPV 59766796.57 in shallow water, 153901708.13 at an oil price of 120, and 136554243.51 in deep offshore under the conservative reading of the deep offshore hydrocarbon tax, a reading the texts leave open. What does the comparison tell a negotiator?",
 "That a word in the document comes close to the market: the terrain string adds about 76.8 million against about 94.1 million for the price.",
 ["That the terrain string moves NPV further than the price sweep to 120, so the words in the fiscal terms outweigh the market on this field.",
  "That the two moves are the same size, because deep offshore lowers only the royalty and a price rise lifts the revenue by exactly as much.",
  "That the terrain string is a price effect in disguise, since a lower royalty rate acts like a higher realised price on every barrel."],
 "Deep offshore under the conservative reading lowers the liquids royalty rate to 0.050000 and sets the hydrocarbon tax to 0.00, which lifts NPV to 136554243.51; an oil price of 120 lifts it to 153901708.13. The reading itself is open, so a negotiator states it beside the number, and the words of the terms still move value almost as far as the market does.")

q(0,
 "On cpr_forfeiture the two-thirds CIT restriction refuses part of the allowance, cpr_deferred_to_next reads 8000000.00, and the ledger ends: CPR forfeited at cessation 8000000.00. Which of the unclaimed value on that row would a further year have rescued?",
 "Both of them, since the CPR deferral would have met the next year's cap and the refused allowance is carried too, so only a ledger that stops here loses either.",
 ["The CPR deferral only, since this engine has never carried what the two-thirds restriction refuses and the Act carries it alone.",
  "The refused allowance only, which is deferred exactly one year and then claimed opex-first, while a CPR deferral is extinguished at each year end and never reaches the next cap.",
  "Neither, because a single-year field forfeits everything and a second year would start a fresh cascade with its own cap."],
 "pia_cpr_carry_two_years carries 22000000.00, 44000000.00 and 66000000.00 across three binding years and forfeits the 66000000.00 at cessation; the allowance carry is priced by pia_cit_allowance_restricted_carry at NPV -102455984.11 against pia_cit_allowance_no_carry at -116276490.72.")

q(1,
 "AKATA under production sharing at a 45 percent cap recovers 75342960.00 in 2029 against 100457280.00 at 60 percent, and ends 2035 with 91570072.23 still in the pool where the 60 percent run ends with 0.00. Both runs put the same costs into the pool. What did the lower cap change?",
 "Only how much may come out each year: the pool is the same money, the cap is a ceiling per year, and the years ran out before the 45 percent pool did.",
 ["How much went in: at 45 percent the engine adds the unrecovered profit oil to the pool, so the balance grows with every year the cap binds and never clears.",
  "The share of the pool the contractor is entitled to, since the cap is a ceiling on the pool itself and 45 percent of it is all that may ever be recovered.",
  "The escalation of the balance, which the engine compounds at the 3 percent inflation rate while a pool waits and stops compounding once it clears."],
 "The one-year applyPSC case says the same thing in miniature: 30000000 brought forward at the 0.4 cap still recovers 36000000.00 and only lifts the carried amount from 44000000.00 to 74000000.00; a bigger pool does not recover faster, it waits.")

q(2,
 "The worked example sells at 80.000000 in 2025 and pays a price royalty of 34908351.810791 on 1460000000.00 of gross revenue, on the Regulations (2021) benchmark base, the engine default. A reader prices it at the 2021 rate for 80 USD. What does the reader get?",
 "0.030000 rather than the 0.023910 the engine applies, an overstated royalty and both tax bases understated, the error growing every year the field runs.",
 ["The same figure, because the benchmarks are fixed by the 2021 Act and the 2 percent escalator applies only to the price and never to the schedule itself.",
  "0.023910, because the 2021 table already carries the 2025 escalation for any field whose base year is 2025, so the reader and the engine agree to the cent.",
  "0.050000, the rate at the 100 benchmark, because the engine rounds the price up to the next benchmark before it reads any rate off the whole schedule."],
 "On the Regulations base the benchmarks escalate at 2 percent a year from 2021 levels, so the same nominal price earns a smaller rate every year: 80 USD reads 0.030000 in 2021, 0.023910 in 2025 and 0.010632 in 2035. The Act reads the same benchmarks as 2020 levels, an open question the course prints beside this one and never grades.")

q(1,
 "A new shallow water lease with 1000000 bbl at 30 USD per barrel and no prior production earns an allowance of 6000000.00 rather than 8000000.00, and prod_alw_cap_applied reads false. Which rule cut the allowance, and what did the flag say about it?",
 "The 20 percent of price limit, which at 30 USD sits below the 8 USD new lease rate; the flag reports the volume cap only and stayed false.",
 ["The volume cap, read on lifetime barrels, which trimmed the eligible barrels; the flag reads false because a lease with no prior production has not yet reached 100000000 bbl.",
  "The converted lease rate of 2.5 USD per barrel, which the engine falls back to when the price is below the 50 anchor; the flag confirms that no cap of either kind acted.",
  "The two thirds restriction, which limits the allowance to two thirds of the assessable profit; the flag is false because that restriction is reported on the CIT line instead."],
 "computeProductionAllowance prints cap applied false on every price-limited row, 2000000.00 on a converted lease at 10 USD as well; the flag is true only in a year that reaches the new-lease volume cap, where from a prior 99500000 the 1000000 bbl split 500000.00 below the cap and 500000.00 after it, for 6000000.00.")

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
 "The worked example forced to nta_2025 at a 2025 base year pays a levy of 42329665.93, and on auto at a 2026 base year 42414115.94, with the price royalty on the Regulations (2021) benchmark base, the engine default. A reader attributes the whole difference to the framework. What actually moved the levy?",
 "The price-royalty benchmarks, which escalated a year further and lowered the royalty to 197047101.45; the framework is nta_2025 both times.",
 ["The framework: the levy rate is read from the base year, and a 2026 base year carries a slightly higher levy rate than a 2025 base year forced to the same framework.",
  "The discounting: a 2026 base year discounts the levy one year less than a 2025 one, and the KPI line reports that smaller discount as the higher levy figure.",
  "The HCDT: a second year of opex history raises the prior-year levy, and the assessable profit and the development levy that follows it rise along with it."],
 "The price royalty falls from 34908351.810791 to 32797101.449275, HCT rises to 286418369.57 and CIT to 300105869.57 on the larger assessable profit the levy follows, and NPV moves from 130654493.35 to 131414543.48.")

q(0,
 "psc_tranches gives the contractor 60 percent from a cumulative of 0 and 40 percent from 1 million bbl. The 2030 row produces 1000000.00 bbl. Which share does 2030 carry?",
 "60.000000, because the table is read at the cumulative liquids at the start of the year, and 2030 opens at 0.",
 ["40.000000, because 2030's own 1000000.00 bbl carries the field to the boundary and the share is read at the year's end.",
  "50.000000, the average of the two tranches, because the field crosses the boundary on the last barrel of the year and the engine interpolates.",
  "60.000000 for the profit oil and 40.000000 for the cost oil, since the tranche table applies to both slices separately."],
 "999999 bbl gives 0.600000 and 1000000 gives 0.400000; 2030's taxable income is 32400000.00 against 27000000.00 at a flat 50, and 2031 opens at 1000000 bbl and drops to 40.000000.")

q(2,
 "AKATA's 2029 row sells oil and gas for 186032000.00 of gross revenue at an oil price of 82.000000 and prints a price royalty of 3606152.270399 on the Regulations (2021) benchmark base, the engine default. A reader who applies the year's rate to the whole 186032000.00 lands above it. Which revenue does the price royalty charge?",
 "The oil revenue alone: the price royalty reads the oil price and charges the oil, and the gas inside the gross revenue carries none of it.",
 ["The gross revenue less the production royalty of 10070350.00, which is the revenue left after the first royalty and therefore the base of the second one.",
  "The oil and gas together, with the gas converted at 6 Mscf per barrel of oil equivalent and priced at the year's oil price of 82.000000.",
  "The revenue after HCDT and NDDC, since the levies come off before any royalty and the smaller base explains the smaller figure."],
 "pia_gas_only_hct_zero has no oil and prints price_royalty 0.000000 beside a production royalty of 4500000.00 on 90000000.00 of gas revenue; on AKATA at 92.345318 in 2035 the price royalty is 1421219.023426 on a smaller oil revenue, falling with the barrels because the benchmarks escalate at the same 2 percent as the price.")

q(1,
 "pia_gas_only_hct_zero, a gas-only field, reports hct_assessable_profit 0.00, HCT 0.00 and NPV 18318000.00. pia_gas_only_legacy_hct, the same field with pia_hct_include_gas_revenue true, reports the same three figures. What does the pair show about the hydrocarbon tax?",
 "That its base is crude oil and condensate, so a field selling only gas has no base, and the flag leaves the default path as it is.",
 ["That the flag failed to load from the case, since gas is a hydrocarbon and a working flag would have put the gas revenue into the base.",
  "That gas carries its own hydrocarbon tax rate of 0.000000 in the rate table, which is why moving the gas into the base changes nothing.",
  "That both runs tax the gas at the terrain's rate and report it inside the CIT line, which is why CIT reads 15420000.00 in both of them."],
 "The hydrocarbon tax is charged on crude oil and condensate, so the gas-only field's HCT base is 0.00 in both runs, while CIT is 15420000.00 on a cit_chargeable_profit of 51400000.00 in both. On AKATA in 2029 the gas revenue and its royalty are out of the HCT assessable profit of 136924208.42 and in the CIT assessable profit of 141335497.73.")

q(3,
 "jv_loss_unused_at_cessation is one row, 2030, with 50000000.00 of capex, no production and a banked loss of 5000000.00, and its KPI line reads take null beside DPI -1.000000. Why is the take null rather than a percentage?",
 "Take is the government share of a pre-take value, and with no revenue there is nothing to share, so the engine returns null rather than a percentage of nothing.",
 ["Because the unused loss of 5000000.00 is subtracted from the government's share and leaves the ratio undefined until a later year spends it.",
  "Because take is only reported once payback has been reached, and a payback beyond project life leaves the ratio unreported on every single-row ledger the engine sees.",
  "Because a take is computed on the discounted flows, and a single row discounted at exponent zero has no discounting for the ratio to read, so the engine prints null."],
 "DPI -1.000000 is the honest reading: every unit of capital was lost. NPV is -50000000.00, the whole capex, and the 5000000.00 memo line appears nowhere in it; give the capex one more year of production and the pool is spent, tax 30000000.00 against 32500000.00.")

q(2,
 "jv_abandonment_wi_60 charges the entered 10000000.00 in full against 60 percent flows, and pia_sinking_fund_wi_50 collects 30000000.00 against a total_abandonment_cost of 30000000.00. What is abandonment_cost_usd under each funding mode?",
 "The share under both: the engine charges the amount as entered, so a partner enters its own share of the cost whichever mode it picks.",
 ["A share-level number under a lump sum and a field-level one under a fund, so the fund at a 50 percent interest collects only half of what was entered.",
  "A field-level number under both, scaled by the working interest on the way into the ledger, so a 50 percent partner's fund collects half the entry.",
  "A field-level number under a lump sum and a share-level one under a fund, so a partner must halve the entry before switching modes."],
 "Both published cases carry the entered figure unscaled: jv_abandonment_wi_60 charges 10000000.00 against 60 percent flows, which is why its unit technical cost reads 43.333333, and pia_sinking_fund_wi_50 collects 30000000.00 and reports NPV 59518454.92. A partner enters its own share under either mode.")

q(1,
 "AKATA under the PIA is NPV 59766796.57. Write the sentence that names it.",
 "59766796.57 on the real basis, end-year, base year 2029, framework nta_2025, shallow water, converted PML.",
 ["59766796.57 at 10 percent nominal, mid-year, base year 2029, framework pia_only, shallow water, new lease.",
  "59766796.57 on the real basis, end-year, base year 2029, framework nta_2025, deep offshore, converted PML, aggressive reading.",
  "59766796.57 on the real basis, end-year, base year 2025, framework pia_only, shallow water, converted PML, no escalation."],
 "Every one of those words is a lever the ledger has shown moving: forced to pia_only the same rows report 63590226.39, and deep offshore under the conservative reading 136554243.51.")

q(0,
 "pia_sinking_fund's 30000000.00 contribution lowers HCT from 285784994.46 to 276784994.46, CIT from 299472494.46 to 290472494.46 and TET from 31747249.45 to 30847249.45. Which bases received the contribution?",
 "The HCT and CIT assessable profits, each 30000000.00 lower, so HCT, CIT and TET all fall at their own rates.",
 ["The HCT base only, with the CIT change following because CIT is charged on the profit left after the hydrocarbon tax.",
  "The cash flow alone, as a post-tax transfer into the fund, with the tax lines moving because the fund's own earnings are taxed in the year.",
  "The HCDT and NDDC lines, which are opex-based and so absorb an opex-lane contribution before either profit tax sees any of it."],
 "The contribution rides the opex lane: both assessable profits fall from 1058241648.19 to 1028241648.19, so HCT and CIT each fall by 9000000.00 at 30 percent and TET by 900000.00 at 3 percent. NPV falls from 141236909.83 to 130136909.83.")

q(0,
 "psc_itc sets a 50 percent credit on 80000000.00 of capex, and both years show tax 0.00 with taxable income 27000000.00 unchanged. What does the credit do that a deduction would not?",
 "It is applied after the tax is computed and never touches the base; it absorbs the 13500000.00 of tax each year and the remainder carries unused past the end of the field with no refund.",
 ["It reduces the taxable income to zero in both years, which is why the tax column reads 0.00 and the profit oil is unchanged.",
  "It is paid to the contractor as cash in 2030, which is why net cash flow rises from -40500000.00 to -27000000.00.",
  "It raises the cost oil cap by 50 percent so that the capex is recovered inside the two years."],
 "The applyPSC sample shows the rule: an ITC of 40000000 against a tax before credit of 4500000.00 uses 4500000.00 and carries 35500000.00; the credit is not cash.")

q(3,
 "pia_deep_offshore_wi_50 halves every monetary line and reports NPV 453861842.57, exactly half of 907723685.14, while pia_deep_offshore_naive_30k halves the upload instead and reports 369073842.57. Where does the naive run lose the difference?",
 "At half the daily rate every barrel carries 0.050000, so its royalty is 43800000.00 against 47450000.00, and it still bears the full capex, opex and levies.",
 ["It loses the production allowance, which the engine grants to a deep offshore lease only in a year whose daily rate stays above the 50000 bopd threshold.",
  "It is discounted for one more year, because the engine assumes a field half the size starts a year later and pushes every row back by one.",
  "It pays HCT at 0.300000, since the conservative reading of the deep offshore tax only applies to a field producing above the 50000 bopd threshold."],
 "Two errors in opposite directions, and neither cancels the other: the royalty is understated because 30000 bopd never reaches the 7.5 percent share, and the costs are overstated because 100000000.00 of capex and of opex are borne in full; take reads 45.4033 percent against 41.5126.")

q(2,
 "cpr_forfeiture has cit_assessable_profit 13987213.60, cit_chargeable_profit 4662404.53 and cit_tax 1398721.36, and its ledger is one year long. Where does the allowance the two-thirds restriction refused reappear?",
 "In cit_allowance_carryforward, 10675190.93, which a one-year ledger never claims because it has no later year to claim it in.",
 ["In cpr_deferred_to_next, which reads 8000000.00 and is the restricted allowance waiting for the next year.",
  "In hct_loss_carryforward, since the HCT on the same row is charged without the restriction and the difference between the two bases is banked there.",
  "Nowhere on any ledger, because this engine has never carried what the restriction refuses."],
 "The 8000000.00 in cpr_deferred_to_next is the CPR cap's deferral, a different mechanism. The restriction limits the allowance to two thirds of the assessable profit before 2026 and carries the excess forward; pia_cit_allowance_restricted_carry claims its carried allowance the following year and reports NPV -102455984.11 against -116276490.72 with the carry switched off.")

q(1,
 "With pia_apply_minimum_etr true at 85 percent, min_etr_85 still reports total tax 617004738.36, NPV 141236909.83 and take 85.5512 percent, the worked example's own figures. Why did an 85 percent floor add nothing?",
 "Because the engine applies the floor only to years under the NTA, and 2025 is a year under the Act, which charges TET and has no floor.",
 ["Because 85 percent sits below the effective rate the year already pays, the HCT, CIT and TET together clearing 85 percent of the profit.",
  "Because the floor counts the royalty as tax, and with the royalty of 199158351.81 added the year's taxes clear the 85 percent on their own.",
  "Because the top-up is computed but written only into the engine statements, and the tax column is never allowed to carry it."],
 "The engine states that its top-up is a project-level approximation of NTA s.57 applied only to years under the NTA and reported on its own line. min_etr_85 and min_etr_not_binding both read framework pia_only with TET 31747249.45 and no top-up, and their totals match the worked example to the cent.")

q(3,
 "AKATA at a three-year shift has no 2031 row. NPV falls from 40880824.32 to 17894126.42 and IRR falls from 14.6753 to 11.6363 percent, both as they should, yet payback shortens from 4.96 to 4.90 years. What does the shortening payback tell a reader?",
 "That payback is counted on rows rather than on calendar years, so the missing row made the delay look shorter to it; the NPV is discounted on calendar years and can be trusted.",
 ["That the delay improved the field, because the later rows sell at escalated prices of 87.019056 and beyond and the capex was shifted with them, so the 255000000.00 is a year cheaper on present value and the crossing arrives sooner.",
  "That the engine emitted an empty 2031 row with zero flow and the extra row diluted the cumulative sum, so the crossing was interpolated over ten rows instead of nine and moved in the field's favour.",
  "That the loss pool of 21000000.00 was spent in the delayed first year and brought the crossing forward."],
 "A longer wait for the same money cannot shorten a payback; capex is not shifted, the engine refuses to emit a row for an empty year, and a payback counted on rows reads the missing year as no time at all.")

q(1,
 "psc_abandonment_wi_50 charges a 10000000.00 lump sum against 50 percent flows and reports a 2031 net cash flow of 9750000.00 where psc_wi_50 had 19750000.00; psc_sinking_fund instead shows a decom_fund_contribution of 10000000.00 in 2031. How do the two modes sit against the production sharing contract?",
 "The lump sum is paid outside the contract, unscaled after the working interest share, while the contribution enters the recoverable cost lane and rides the pool.",
 ["Both are paid outside the contract, and the fund is simply the lump sum spread over the years the contract has left, so the contribution of 10000000.00 in 2031 is charged after tax exactly as the lump sum on psc_abandonment_wi_50 is.",
  "Both enter the recoverable cost lane, and the lump sum is recovered as cost oil in the final year at the cap.",
  "The lump sum is scaled by the working interest at the door like every other PSC input, and the contribution is not, which is why the 50 percent case shows a net of 9750000.00 rather than a half-scaled outflow."],
 "psc_sinking_fund's 2031 net cash flow is 29500000.00 against 39500000.00 without it; under JV terms the same lump sum is unscaled too, 10000000.00 against 60 percent flows on jv_abandonment_wi_60.")

q(0,
 "AKATA in deep offshore reports 60060654.75 under the aggressive reading and 136554243.51 under the conservative one, two readings the texts leave open, with royalties of 59503845.87 in both, against 59766796.57 in shallow water. How much of the conservative gain is royalty and how much is the hydrocarbon tax?",
 "The royalty alone takes 59766796.57 to 60060654.75, since the aggressive reading keeps HCT at 0.300000; the HCT reading takes it the rest of the way.",
 ["It is all royalty: the HCT rate is 0.000000 in deep offshore under either reading, and the two figures differ by the CIT the readings charge, since the aggressive reading moves the CIT rate rather than the HCT rate.",
  "It is all hydrocarbon tax: the production royalty is 0.125000 in every offshore terrain and only the price royalty moved, so the royalties differ by the price component alone.",
  "The two cannot be separated, because the terrain string sets one blended fiscal rate that the engine does not decompose."],
 "The 2029 production royalty is 9301600.00 in deep offshore against 10070350.00 in shallow water, and HCT is 27439344.48 under the aggressive reading against 0.00 under the conservative one. Which reading applies to a deep offshore year under the NTA is left open by the texts, so the course prints both and grades neither.")

q(2,
 "AKATA under production sharing reports a take of 82.1085 percent at a 60 percent cost oil cap, at 80 and at 100, but 99.0577 at 45 and 120.4874 at 30. Why does the take stop moving above 60?",
 "Once the pool clears inside the field's life the cap only moves timing, and timing is what NPV and IRR price, not take.",
 ["Above 60 percent the cap no longer binds in any year, so cost oil equals the year's costs and the take is the royalty plus tax on a fixed profit oil.",
  "The engine caps the take at 82.1085 percent for production sharing, which is the royalty rate plus the tax rate blended at the contractor share.",
  "Above 60 percent the contractor share of profit oil steps down to hold the take constant, as the tranche mode requires once the pool has cleared."],
 "At 60 percent the pool clears in 2034, at 80 in 2031 and at 100 in 2030; NPV still rises from 29960298.75 to 48148675.31 across the three because the money arrives sooner.")

q(3,
 "AKATA in shallow water with pia_marginal_field_pre_2021 true keeps its 2029 production royalty at 10070350.00 and pays HCT at 0.150000, 13604359.74 in 2029, for NPV 97891150.04 against 59766796.57 as a converted PML. What did the marginal field status change?",
 "The hydrocarbon tax rate alone: a marginal field converted under s.94(1) pays 15 percent, and its royalty follows the shallow-water tranches.",
 ["The royalty tranches, which fall to a marginal blend of 5 and 7.5 percent, and the lower HCT is the tax following the smaller royalty through the base.",
  "Both royalty and HCT, since marginal_field is a terrain of its own with its own royalty table and its own hydrocarbon tax rate.",
  "The production allowance, which a marginal field claims at the new-lease 8 USD/bbl, and the lower HCT is that larger allowance."],
 "A marginal field is onshore or in shallow water, and the engine refuses marginal_field as a terrain; the pre-2021 flag moves the HCT rate and nothing else. pia_marginal_field_blend, run onshore with the flag, pays HCT 24111699.56 at 0.150000, and the same case in shallow water returns the same totals.")

q(0,
 "AKATA under the PIA claims 64001892.15 against a cpr_cap of 117260000.00 in 2029 and 73427625.35 against 100577100.00 in 2030, while its opex rose only from 24000000.00 to 24720000.00. Why did the claim grow by more than the opex did?",
 "The 45000000.00 of capex spent in 2030 started its own five-year allowance, so 2030 claims a fifth of both tranches beside its opex, at the crude share.",
 ["The 2029 allowance was restricted to two thirds of the assessable profit and the disallowed third was carried into the 2030 claim, as the Act requires it to be.",
  "The cap fell from 117260000.00 to 100577100.00, and the engine claims the whole gap between cap and opex in any year the cap falls, so a lower cap raises the claim.",
  "The production allowance of 4625000.00 is claimed inside the CPR claim from the second year onward, and its arrival is the extra in 2030."],
 "The capital allowance runs five years from each year's spend, a fifth a year in NTA years, and the texts fix five years, so the engine refuses any other recovery life. On AKATA each tranche runs its own clock, costs shared with gas enter at the crude-plus-condensate share of revenue, and a field that stops before the years run out never claims the rest.")

q(1,
 "On the real basis AKATA's applied rate is 6.796117 percent and the profile point that carries it is labelled 6.8. What does that point read?",
 "72534830.66, the headline itself: the point is labelled at the rounded rate and evaluated at the exact one, so the gap between them is 0.00.",
 ["The NPV at exactly 6.8 percent, which sits a little way under the headline, because the label is past the applied rate and NPV always falls as the rate rises.",
  "Whichever of the two the reader asks for, since the profile carries the labelled point and the exact one as a pair.",
  "A value interpolated between the 5 percent point of 83023565.60 and the 8 percent point of 65968275.69 rather than computed."],
 "The profile point that carries the applied rate is evaluated at the exact 6.796117 percent and only labelled 6.8, so it reads the headline NPV; the published golden records no profile disagreements.")

q(2,
 "AKATA on auto reports 59766796.57 with a levy of 5653419.91 in 2029; forced to pia_only it reports 63590226.39 with TET of 4240064.93. A reader writes 59766796.57 beside the word pia_only. What does the checklist say?",
 "The headline fails: basis, convention and framework are written beside it, and 59766796.57 belongs to nta_2025.",
 ["The headline passes, because the framework only changes the last line of the cascade and the NPV is reported before the levy is charged.",
  "The headline passes if the override was left on auto, since auto is neither framework and the label is a matter of convention.",
  "The headline fails only by the levy: take off the 2029 levy of 5653419.91 and add the TET of 4240064.93 to reach the pia_only figure, the two frameworks sharing every other line."],
 "Get the framework wrong and every row's last line is wrong; one of tet_tax and dev_levy_tax is 0.00 on every row, the fiscal_framework column says which, and the hydrocarbon tax moves with the framework as well.")

q(3,
 "AKATA with a 200000000 lump sum reports IRR null while its NPV is -40359955.35 at the applied rate and -58362170.82 at 0 percent. The checklist asks for the sign of the final flow. What does the reader conclude?",
 "The final flow of -169598201.95 is negative, so no IRR on this ledger could be trusted on its own; the profile, negative at every sampled rate, is the reading, and null is not a data error.",
 ["The null is a root finder fault, since a project with a defined NPV at every rate must have a rate that zeroes it.",
  "The final flow is negative, so the IRR is the lower of two roots and the engine printed null in place of the smaller one, which the bisection fallback cannot reach from 10 percent because the NPV never changes sign in the region it searches.",
  "The null means the field is worth exactly its capex at every rate, which the negative profile then contradicts, so the ledger is refused and the NPV figures printed beside it are the ones from the run without the abandonment."],
 "With 60000000 the final flow is -29598201.95 and the engine reports null there as well, for the other reason in the contract: more than one rate in the band zeroes that NPV, so no single rate is named.")

q(0,
 "Run at a stated new-PML hydrocarbon tax rate of 30 percent, a reading the texts leave open, the 2029 row of AKATA as a new lease is identical whether the prior cumulative is 0 or 96000000: allowance 17600000.00, cap applied false, HCT 23578719.48. Which reading in the working order catches the difference before the headline does?",
 "The lease and reading step, followed by the totals: allowance 77440000.00 against 54720000.00 over the life, since the cap bites in later years.",
 ["The framework step, since a lease with prior production is read under pia_only and one without under nta_2025.",
  "The 2029 row alone, whose cap applied flag reads true once the prior barrels are entered.",
  "The royalty step, because prior production lifts the field into the 0.075000 tier and the royalty totals differ, so the difference is in the royalty line rather than in the allowance."],
 "At the stated rate NPV is 72785125.58 against 67920886.30 and HCT 75682840.32 against 82498840.32. The allowance totals are the same at a stated 15 percent, so they catch the cap whatever reading is stated; the strings must be read from the case.")

q(1,
 "psc_wi_50 halves oil_bbl to 500000.00 a year and reports total oil 1000000.00 bbl, while pia_deep_offshore_wi_50 halves oil_bbl to 10950000.00 but keeps cumulative_oil_bbl_lifetime at 21900000.00. Which ledger still remembers the field?",
 "The PIA one: the working interest is applied to the money afterward, and cumulative_oil_bbl_lifetime and prod_alw_eligible_bbl keep the field's barrels so the tier is read at 60000 bopd.",
 ["The PSC one: entitlement volumes are the field's volumes scaled, and the tranche table is read on the field's cumulative rather than the entitlement, so a 50 percent share still opens each year at the field's tranche boundary.",
  "Both, since each reports working_interest_pct and the engine can recover the field from a share when that column is set.",
  "Neither, because a scaled run has no field-level readout in either regime and the naive upload cannot be told from a small field."],
 "Under a PSC the working interest is applied at the door and the rows are the share; under the PIA the liquids rate is still 0.054167 at 60000 bopd, half of 94900000.00 is 47450000.00, and take is invariant at 41.5126 percent.")

emit(Q, '/root/wt-ec7-recut/tools/course-banks/cashflow/advanced/ec1a_exam.json', expect_n=42)
finish()
