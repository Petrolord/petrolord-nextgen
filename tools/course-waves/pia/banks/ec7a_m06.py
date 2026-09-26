import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC7 Expert m06, The Expert Reading. Keys rest on the course's onshore ledger
# across 1 January 2026 (framework, education tax, levy, capital allowance,
# restriction), the framework table, the notes and their conditions, the
# graded-number rules, the Ekene data statement, the refusal table and the
# vocabulary rows. No question names or reaches into a capstone case: the
# method is taught on the course's own Ekene cases.

K = [1, 3, 0, 2, 0, 1, 3, 2, 1, 0, 3, 2, 0, 3, 1]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("Across its five years, what does ekene_onshore_across_2026 report as the framework of the whole ledger?",
 "kpis.fiscal_framework \"pia_only_then_nta_2025\", with kpis.nta_first_year 2026",
 ["kpis.fiscal_framework \"nta_2025\" for the whole ledger, since its last years govern every earlier one",
  "kpis.fiscal_framework \"pia_only\" for the whole ledger, since it starts under the Act alone in 2024",
  "Two framework values, one per Act, and no first NTA year"],
 "A ledger that crosses reports kpis.fiscal_framework \"pia_only_then_nta_2025\" and kpis.nta_first_year, and the course prints this case with 2026 as its first NTA year. The framework is still read row by row: 2024 and 2025 are \"pia_only\" and 2026 to 2028 \"nta_2025\".")

# 2
x("The engine flags the two thirds restriction as applying in 2024 and 2025 on ekene_onshore_across_2026. Does it bind?",
 "No: two thirds of each assessable profit is larger than the allowance, so the whole 18000000.000000 is claimed each year",
 ["Yes: 2024 claims two thirds of 153422584.102902 and carries the rest of the allowance forward",
  "It binds in 2025 only, the year the assessable profit falls to 138422805.570953 on lower output",
  "It binds in 2026, when the carried excess of the two earlier years is claimed in one go"],
 "The course says it plainly: the restriction column is true in 2024 and 2025 and false from 2026, and on this lease it does not bind, because two thirds of each assessable profit is larger than the allowance. The CIT allowance claimed is 18000000.000000 and the amount carried 0.000000 in every year, so nothing is carried into 2026.")

# 3
x("Which lines of ekene_onshore_across_2026 read no framework at all?",
 "Production royalty on liquids and gas, and the royalty by price",
 ["The tertiary education tax and the development levy, charged on one base",
  "The capital allowance, whose fifth year is 19 percent under either law",
  "Companies income tax, charged at 30 percent before and after the switch"],
 "What did not change: the engine's royalty and royalty by price functions take no framework input. The education tax and the levy turn on the framework of the year, the fifth year of the capital allowance is 19 percent under the Act alone and 20 percent under the Nigeria Tax Act 2025, and companies income tax reads the restriction, which is a framework line.")

# 4
x("The 2025 tertiary education tax on ekene_onshore_across_2026 is 4152684.167129. Which text puts that line on the ledger?",
 "Finance Act 2023 s.26, at 3 percent of the companies income tax assessable profit",
 ["NTA s.59(1), at 4 percent of the companies income tax assessable profit",
  "Finance Act 2021, at 2.5 percent, a rate the course takes from a secondary source alone",
  "PIA s.302, which charges it together with companies income tax at 30 percent"],
 "2025 is a year under the Act alone with a TET rate of 3.000000 percent, and the stack cites Finance Act 2023 s.26 for the tertiary education tax on the companies income tax assessable profit. NTA s.59(1) is the development levy of the NTA years, and the 2.5 percent of the Finance Act 2021 applies before 2023.")

# 5
x("What is the development levy on ekene_onshore_across_2026 in 2027?",
 "4364793.688932, at 4 percent of a companies income tax assessable profit of 109119842.223295",
 ["4920525.461957, the levy of the first year under the new Act carried on flat through the ledger",
  "0.000000, the levy being charged only in the first year of assessment under the new Act",
  "3852629.452203, at 4 percent of an assessable profit of 109119842.223295 for the year"],
 "Each NTA year pays its own levy on its own profit. For 2027 the ledger row reads 109119842.223295 of assessable profit and 4364793.688932 of levy. The figure 4920525.461957 sits on the 2026 row and 3852629.452203 on the 2028 row, so neither carries over.")

# 6
x("A ledger crossing into 2026 carries a decommissioning fund contribution in its NTA years. What must its terms state for it to run?",
 "Whether the escrow condition of NTA s.86 is met, as true or false",
 ["The name of the escrow bank, which the engine checks against the Central Bank's accredited list",
  "Nothing further: the engine deducts a fund contribution in every year whatever its framework",
  "A deep offshore reading, since a fund contribution is deducted inside the hydrocarbon tax"],
 "The engine refuses an NTA-year fund contribution with no escrow statement: \"pia_decom_escrow_condition_met must be true or false: NTA s.86 allows the deduction only when at least 30% of the fund is deposited in an escrow account with a Nigerian bank accredited under the Central Bank of Nigeria's criteria.\" The engine takes the condition as a stated fact about the company's banking; a deep offshore reading is a separate stated input.")

# 7
x("What does the course prove about every graded field before it grades one?",
 "That it is the same under every reading of all three open readings",
 ["Matching the stdlib oracle's expected figure stored in the golden file beside the inputs",
  "Equality at 100 percent working interest and at the working interest the card states",
  "Rounding to whole US dollars before any comparison with the learner's figure"],
 "The course's rule for graded numbers: a graded figure is the same under every reading of all three open readings, and each is a return value of this engine on fixed terms and rows. The oracle's expected figures are provenance and never printed, a graded money figure is at the stated share, and figures are read at six decimals.")

# 8
x("Where does an Expert learner run the practicals of this course?",
 "In the course's ledger calculator panel, which calls the same vendored engine the lessons quote",
 ["A spreadsheet the learner builds from the lesson tables, since the course ships no calculator",
  "The royalty calculator, the one panel the course provides for all three of its tiers",
  "Inside the hydrocarbon tax calculator's ledger view, which is the only panel the Expert tier is given"],
 "This is an engine course: each tier has a calculator panel that calls the same vendored engine, the royalty calculator at Associate, the hydrocarbon tax calculator at Professional and the ledger calculator at Expert. A learner types or pastes terms and rows, and the panel prints what the engine returns, every refusal and every note.")

# 9
x("A case states a working interest of 50 percent. At what level is a money figure from its ledger reported?",
 "At the share: every money line is scaled to the working interest after the field-level arithmetic",
 ["100 percent, the field level at which the royalty tranches and the allowance cap are read",
  "Share for the taxes and field level for royalty, which the operator pays in full on behalf of all partners",
  "Half the daily rate for the tranches, so the share comes out exact"],
 "Every money figure is at the working interest share: the engine runs the tranches, the allowance cap and every rate at field level and then scales every money line to the share. \"at the share\" means at the stated working interest, and royalty is a money line like the rest.")

# 10
x("On ekene_onshore_across_2026, which set of lines turns on the framework of each year?",
 "The education tax, the development levy, the capital allowance fifth year and the two thirds restriction",
 ["Royalty by price, whose benchmarks move over to the Act base from 2026 onward",
  "Hydrocarbon tax rate: 30 percent before 2026 and 15 percent from the switch",
  "Liquids royalty rate, which the NTA restates with \"bop\" in the place of bopd"],
 "The framework table lists the lines that change with the framework of a year: the tertiary education tax, the development levy, the fifth year of the capital allowance and the restriction (with the deep offshore lines, the escrow condition and the minimum ETR top-up, none of which this onshore case carries). The base year of the royalty by price is a stated input, and a converted onshore lease pays 0.300000 under either framework.")

# 11
x("Which pair of notes does ekene_onshore_across_2026 carry because its years fall on both sides of the switch?",
 "The Nigeria Tax Act version note and the pre-2026 restriction note",
 ["Minimum ETR approximation note together with the Nigeria Tax Act version note",
  "Shared-costs note together with the pre-2026 restriction note on capital allowance",
  "Version note alone, the restriction not binding"],
 "The note conditions: ntaVersion appears for a year under the Nigeria Tax Act 2025, and citRestrictionPre2026 for a year under the Act alone unless the company is in gas operations. This ledger has both kinds of year. The minimum ETR note needs the top-up switched on, the shared-costs note needs gas production, and the restriction note does not ask whether the restriction binds.")

# 12
x("Why does a royalty figure on ekene_onshore_across_2026 name its base year?",
 "It includes the royalty by price, whose base year is an open reading; the engine default is the Regulations",
 ["Onshore tranches start in 2021 on the Regulations and in 2020 on the Act, so both royalties move",
  "Base year sets the framework of each year, and this ledger crosses from the Act into the new Act",
  "The Act's own example at 75 USD/bbl in 2020 gives different rates on the two bases, 0.025000 on one"],
 "Royalty in this course is the total royalty, the production royalty plus the royalty by price, and a royalty by price is always quoted with its base year: the Act starts the benchmarks in 2020, the Regulations in 2021, and the engine follows the Regulations unless told otherwise. The tranches read no base year, the framework reads the year, and the Act's example returns 0.025000 on both bases.")

# 13
x("Which of these figures could a keyed question in this course rest on?",
 "The 2026 development levy on ekene_onshore_across_2026, 4920525.461957",
 ["The minimum ETR top-up of 35346403.532609, as the tax a company owes under NTA s.57",
  "The aggressive_pml_30 hydrocarbon tax of 303622010.869565, as the law for deep offshore",
  "A petroleum profits tax figure for an oil mining lease that never converted"],
 "Every graded number is a return value of the engine on fixed terms, and the levy is one. The minimum ETR top-up is a labelled approximation and never graded; a deep offshore hydrocarbon tax under the Nigeria Tax Act 2025 is an open reading and never keyed as the law; and a lease that never converted is outside the engine altogether.")

# 14
x("What does the course say about the Ekene cases it teaches with?",
 "Every one is synthetic, read from the golden file's inputs, with the engine's own figures printed",
 ["Real Nigerian leases with their names changed, so the figures stay confidential",
  "Read from the golden file, with the oracle's expected figures shown beside each of the engine's own",
  "Synthetic inputs whose printed figures all come from the stdlib oracle, the course's independent witness"],
 "The course states: every Ekene case, field, volume, price and cost is synthetic, written for this platform, read from the vendored golden file's inputs; the golden also carries the stdlib oracle's expected figures, which are provenance and never printed, and every figure shown is the engine's own return on the case inputs.")

# 15
x("A reader forces ekene_onshore_across_2026 to \"force_pia\". How should any figure from that run be quoted?",
 "With its override named, since force_pia puts every year on the Act alone, 2026 to 2028 included",
 ["As the ledger's own figure, since forcing the Act alone changes only the framework labels",
  "As the law for 2026 to 2028, since the Act alone governed the lease before the switch",
  "With no qualification, since a forced run matches auto in every year before 2026"],
 "\"force_pia\" puts every year on one framework, so 2026 to 2028 read \"pia_only\" and pay the tertiary education tax in place of the levy; the course quotes a figure that depends on a setting with that setting. The forced run changes lines as well as labels, and on the course's Alpha it moves the education tax by 26785663.028773.")

emit(Q, '/root/cat-wip-pia/banks/ec7a_m06.json', expect_n=15)
finish()
