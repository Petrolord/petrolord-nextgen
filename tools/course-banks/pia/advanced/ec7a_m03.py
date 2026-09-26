import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC7 Expert m03, What the Nigeria Tax Act Changed at the Edges. Keys rest on
# the course's deep offshore rows under the three stated readings, the deleted
# deep offshore allowance, the escrow condition rows, the minimum effective tax
# rate rows and note, what did not change, the refusal table and the NTA
# quotations. The deep offshore rate under the Nigeria Tax Act 2025 is an open
# reading: every figure carries its stated reading and no reading is keyed as
# the law. The minimum effective tax top-up is never keyed as tax owed.

K = [3, 1, 0, 2, 1, 3, 0, 2, 3, 1, 2, 0, 1, 3, 0]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("The Ekene deep offshore lease (synthetic; new acreage, 60,000 bopd) is run for 2026 under each stated reading. Which set of hydrocarbon tax figures does the engine return?",
 "conservative_zero 0.000000; aggressive_pml_30 303622010.869565; custom 20 202414673.913043",
 ["0.000000 under every reading, since PIA s.260(3) still keeps deep offshore out of the tax in 2026",
  "aggressive_pml_30 202414673.913043 and custom 20 303622010.869565",
  "303622010.869565 under every reading"],
 "The three-readings table prints 2026 as 0.000000 under conservative_zero, 303622010.869565 under aggressive_pml_30 and 202414673.913043 under a stated custom 20, on an HCT chargeable profit of 1,012,073,369.565217. 2026 is a year under the Nigeria Tax Act 2025, where the rate is a stated reading, so the figures differ by reading and each is quoted with its own.")

# 2
x("Why does the deep offshore hydrocarbon tax under the Nigeria Tax Act 2025 need a stated reading at all?",
 "NTA s.65(1) brings deep offshore into the tax, and s.72 prints rates only for onshore and shallow water",
 ["NTA s.72 prints a deep offshore rate of 30 percent that s.65(4) then withdraws until reclassification",
  "PIA s.260(3) survives the deletions and still excludes deep offshore in every year from 2026 onward, as it did in 2025",
  "The Regulations and the Act name different years for the deep offshore rate to begin being charged"],
 "The engine's refusal gives the reason in its own words: \"NTA s.65(1) applies hydrocarbon tax to deep offshore operations but s.72 states rates only for onshore and shallow water, so the rate is a stated user choice with no default.\" S.65(4) is the frontier exclusion, s.260(3) sits in the Chapter Four Part that s.197(1)(a) deletes, and the base year question belongs to the royalty by price.")

# 3
x("Which of the three deep offshore readings is the law for a year under the Nigeria Tax Act 2025?",
 "The Act does not settle it: the engine takes the reading as a stated input with no default and the course grades none",
 ["aggressive_pml_30, because s.65(1) names deep offshore and s.72(a) is the only 30 percent class in the Act",
  "conservative_zero, the reading the engine applies by default whenever a ledger states no reading",
  "custom at 20 percent, the midpoint between the two named readings that the engine prints in its table"],
 "The texts leave this open, and the course teaches all three readings side by side and grades none. The engine keeps no default: a deep offshore year under the new Act with no reading is refused. The custom 20 row is a stated example of the custom reading, and the course names no reading as correct.")

# 4
x("A deep offshore ledger running into 2026 is given no pia_deep_offshore_hct_interpretation. What does the engine do?",
 "It refuses the run, since the rate is a stated user choice with no default",
 ["Runs under conservative_zero and adds a note to kpis.pia_notes saying which reading it chose",
  "Only 2025 is run, the ledger stopping at the last year under the Act alone, with a note on why",
  "Charges the 7.5 percent deep offshore royalty rate as the hydrocarbon tax rate for 2026 onward"],
 "The refusal opens \"A deep offshore year under the Nigeria Tax Act 2025 needs pia_deep_offshore_hct_interpretation set to \"conservative_zero\", \"aggressive_pml_30\" or \"custom\"\" and ends \"so the rate is a stated user choice with no default.\" A refusal is a thrown error, so no partial ledger and no note is returned, and the royalty rate plays no part in the tax rate.")

# 5
x("The reading is set to \"custom\" and no custom rate is stated. What comes back?",
 "The refusal \"pia_deep_offshore_hct_interpretation \"custom\" needs pia_deep_offshore_hct_custom_rate_pct as a number from 0 to 100; got null.\"",
 ["Runs at a custom rate of 20 percent, the figure the course's own three-readings table uses for it",
  "Zero percent: the custom reading falls back to conservative_zero when it has no rate",
  "A ledger at 30 percent, the custom reading taking the s.72(a) class when no figure is written in"],
 "That is the engine's own message for this input: a custom reading needs its rate stated as a number from 0 to 100. The 20 in the course's table is a stated example, and the engine fills in no rate from another reading, so a custom reading with no rate is refused.")

# 6
x("On the Ekene deep offshore lease, which lines does changing the stated reading move?",
 "The hydrocarbon tax line and nothing else",
 ["Hydrocarbon tax and companies income tax, since the hydrocarbon tax is deducted in the income tax base",
  "Royalty and hydrocarbon tax, since the liquids royalty rate of 0.054167 rises under the 30 percent reading",
  "Every line of the ledger from 2025 on, the stated reading reaching back into the year under the Act alone"],
 "The course checks that the reading moves the hydrocarbon tax line and nothing else: companies income tax is 303622010.869565 in 2026 under every reading, the royalty rate is 0.054167 in every year, and 2025 pays no hydrocarbon tax under any reading. Companies income tax does not deduct the hydrocarbon tax (PIA s.302(5); NTA s.78(3)(a)).")

# 7
x("What hydrocarbon tax does the Ekene deep offshore lease pay in 2025, and why?",
 "0.000000 under every reading: 2025 is a year under the Act alone, and PIA s.260(3) keeps deep offshore out",
 ["0.000000 under conservative_zero only, with the other two readings charging 2025 at their stated rates",
  "No figure at all, as the ledger crosses into the new Act and so 2025 needs a stated reading as well",
  "0.000000 because the 175200000.000000 production allowance leaves the year with no chargeable profit to charge"],
 "The 2025 row reads \"pia_only\" with an HCT chargeable profit of 795646660.199557 and a hydrocarbon tax of 0.000000 under all three readings. S.260(3): \"This Part shall not apply to a frontier acreage until it is reclassified under section 68 (3) of this Act and to deep offshore.\" The chargeable profit is positive after the allowance, so the allowance does not explain the zero.")

# 8
x("The deep offshore lease earns a production allowance of 175200000.000000 in 2025 and 0.000000 in 2026 on the same barrels and price. What removes it?",
 "The Nigeria Tax Act 2025 re-enacts the new-lease allowance for onshore and shallow water only",
 ["Its cap of 500 million barrels, reached during 2025, so that no barrel produced in 2026 sits below it",
  "A switch to the converted-lease allowance, the lower of 2.50 USD/bbl and 20 percent, from 2026 onward",
  "The conservative reading, which zeroes the allowance with the tax"],
 "The course reads the deletion from the two Sixth Schedules: the NTA list ends at (b) shallow water, \"the lower of US $8.00 per barrel and 20% of the fiscal oil price, up to a cumulative maximum production of 100\" million barrels, and prints no paragraph for deep offshore and frontier. The lease is a new lease, so the converted allowance does not apply, and the three-readings table prints 0.000000 in 2026 under every reading.")

# 9
x("One million barrels at 75 USD/bbl with no earlier production, in a year under the Nigeria Tax Act 2025. Which lease does the engine give an allowance?",
 "A converted shallow water lease: 2500000.000000",
 ["New deep offshore lease: 8000000.000000, the lower of 8.00 USD/bbl and 20 percent below the cap",
  "Frontier, as a new lease: 8000000.000000 on every barrel up to its cap of 500 million barrels",
  "A new deep offshore lease: 4000000.000000, the rate after the cap applied to every barrel"],
 "The allowance table prints, in an nta_2025 year at 75 USD/bbl, 2500000.000000 for a converted shallow water lease and 0.000000 for a new deep offshore lease and for a new frontier lease. 8000000.000000 is what the new deep offshore lease earns in a year under the Act alone, and 4000000.000000 is an onshore figure after the cap.")

# 10
x("On the two NTA decommissioning fund cases (synthetic, shallow water, 2026 to 2028), what is companies income tax in 2026?",
 "30069497.282609 with the escrow condition met and 33069497.282609 with it not met",
 ["33069497.282609 with the condition met and 30069497.282609 with it not met, the deduction adding to tax",
  "30069497.282609 in both runs, the cash leaving either way",
  "30069497.282609 met and 31569497.282609 not met, the unmet condition moving only the hydrocarbon tax"],
 "The escrow table prints 2026 companies income tax as 30069497.282609 (met) and 33069497.282609 (not met). The contribution of 10000000.000000 goes out in both runs; only the deduction moves, 10000000.000000 met and 0.000000 not met. 31569497.282609 is the hydrocarbon tax with the condition not met, which moves too.")

# 11
x("What does NTA s.86 require before a decommissioning fund contribution is deductible?",
 "At least 30% of the fund in an escrow account with a Nigerian bank accredited under criteria of the Central Bank of Nigeria with the Service",
 ["The whole fund held in an escrow account the Commission controls, audited each year by the Service",
  "Payment of 30% of each year's contribution into the Federation Account before any deduction is made",
  "At least 30% of the fund invested in Nigerian government bonds that the Commission has approved"],
 "S.86(a) requires that \"the licensee or lessee deposit a minimum of 30% of the\" fund with a Nigerian bank in escrow, and s.86(b) that \"the Nigerian bank is accredited in accordance with the criteria for accreditation for participation in the management of the fund, determined by the Central Bank of Nigeria in collaboration with the Service.\" A minimum of 30 percent, a bank and an escrow account are the condition.")

# 12
x("Why does ekene_sinking_fund_pia_years (2024 and 2025) run with no escrow statement at all?",
 "Both years are under the Act alone, where a fund contribution is deductible with no escrow condition",
 ["The engine sets the escrow condition to true by default whenever the terms leave it unstated",
  "Its contribution of 15000000.000000 is below the size of fund that brings NTA s.86 into play",
  "The escrow condition reaches the hydrocarbon tax only, and those two years carry none of it"],
 "The engine asks for pia_decom_escrow_condition_met only for a year under the Nigeria Tax Act 2025 with a contribution, and its refusal names that year: \"2026 is a year under the Nigeria Tax Act 2025 and carries a decommissioning fund contribution\". In a year under the Act alone the contribution is deductible, and the case deducts 15000000.000000 in 2024 and 2025. The engine keeps no default and s.86 sets no fund size.")

# 13
x("On ekene_min_etr_nta_only (synthetic, shallow water, 2025 and 2026), what does the minimum effective tax top-up line show?",
 "At a stated 15, 0.000000 in both years; at a stated 85, 0.000000 in 2025 and 35346403.532609 in 2026",
 ["35346403.532609 in 2026 at 15, since 15 percent is the statutory rate of s.57(1) and so it binds",
  "Both years at 85 carry 35346403.532609, the top-up paying no attention to the framework of either year",
  "A refusal at 15, since s.57 tests a company and the engine will not run a project-level test"],
 "The top-up table prints 0.000000 at 15 in both years, and 0.000000 in 2025 and 35346403.532609 in 2026 at the golden input's stated 85, set high so the top-up shows. The approximation runs in years under the Nigeria Tax Act 2025 only, and 2025 is a year under the Act alone. It is a labelled approximation, reported and never refused.")

# 14
x("Why does the course never key the engine's minimum effective tax top-up as the tax a company owes?",
 "NTA s.57 tests the company on audited profit, which a project model cannot see",
 ["The 15 percent minimum rate is one of the open readings the texts leave for the user to state",
  "The top-up applies only to years under the Act alone, and those years are not graded anywhere",
  "S.57 was withdrawn by the re-gazetting of December 2025"],
 "The engine's note says so: \"the Act tests the company (a member of a multinational group, or turnover of 20 billion naira or more) on audited profit before tax less 5% of depreciation and personnel cost, which a project model cannot see.\" The course's open readings are three other questions, the top-up runs only in NTA years, and nothing says the re-gazetting changed s.57.")

# 15
x("Ekene Alpha is run with every year forced to the Act alone. By how much do its royalties move?",
 "0.000000: the royalty and royalty by price functions take no framework input",
 ["A small amount, since the NTA restates the tranches with \"bop\" where the Act writes bopd",
  "-863333.550000, as the Nigeria Tax Act's Seventh Schedule sets the gas royalty afresh",
  "By 436533.662718, from new benchmarks in 2026"],
 "The one-change row prints royalties 0.000000 for every year forced to the Act alone. The course states that the engine's royalty and royalty by price functions take no framework input. The \"bop\" slip is a misprint the course names, -863333.550000 is the all-gas-in-country row, and 436533.662718 is the hydrocarbon tax on the forced row.")

emit(Q, '/root/cat-wip-pia/banks/ec7a_m03.json', expect_n=15)
finish()
