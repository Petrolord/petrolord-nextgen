import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC7 Expert final exam, 42 questions across the tier's six modules. Keys rest
# on the course's licence and conversion rows, the production sharing rows, the
# NTA repeal and rate quotations, the framework and capital allowance rows, the
# deep offshore, escrow and minimum ETR rows, the engine's notes, the
# one-change rows on Ekene Alpha, the concept-only quotations, the refusal
# table and the new-lease rows under both stated rates. Open readings are
# quoted with their stated reading and never keyed as the law. Questions 4, 9,
# 23, 31, 33, 34, 35, 41 and 42 each need two modules at once.

K = [1, 0, 2, 3, 3, 1, 0, 1, 1, 3, 3, 2, 0, 0, 1, 3, 1, 1, 3, 3, 1,
     2, 2, 1, 2, 0, 2, 2, 2, 0, 0, 1, 3, 3, 2, 0, 3, 0, 0, 2, 0, 1]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("What right does PIA s.70(1)(c) give the holder of a petroleum mining lease?",
 "To win, work, carry away and dispose of crude oil, condensates and natural gas on an exclusive basis",
 ["Exploration on a non-exclusive basis for three years, renewable once under the Act's exploration licence",
  "Drilling exploration and appraisal wells, with production left to a later mining lease",
  "Production under its old oil mining lease terms until the conversion date passes"],
 "S.70(1)(c): a petroleum mining lease \"may be granted to qualified applicants to: (i) win, work, carry away and dispose of crude oil, condensates and natural gas on an exclusive basis,\". Non-exclusive exploration is the petroleum exploration licence of s.70(1)(a), and drilling exploration and appraisal wells is the petroleum prospecting licence of s.70(1)(b).")

# 2
x("For how long may a petroleum mining lease run under PIA s.86(1)?",
 "A maximum of 20 years, a term that includes the development period",
 ["Three years, renewable for a further three if the prescribed conditions are met",
  "Up to 10 years, made of a five-year initial period and a five-year optional extension",
  "Until 18 months after the effective date, when the lease must be converted again"],
 "S.86(1): a petroleum mining lease \"shall be for a maximum period of 20 years, which term shall include the\" development period. Three plus three years is the petroleum exploration licence (s.71(3)), and five plus five years is a deep offshore or frontier petroleum prospecting licence (s.77(2)).")

# 3
x("The single-year worked example (2025, a year under the Act alone) is run with pia_tet_rate_pct stated as 2.5. What does the engine do?",
 "It uses 2.5 for 2025 and names that choice in a note beside the statutory rate",
 ["Refused, since the statutory rate for 2025 is 3 percent and a stated rate may not differ from it",
  "3 percent applied, the stated rate ignored with no note",
  "2.5 used in every year, NTA years included, in place of the levy"],
 "The engine builds one note from the run: \"pia_tet_rate_pct 2.5 was used for 2025. The statutory tertiary education tax is 3% from 2023 (Tertiary Education Trust Fund Act s.1(2) as amended by Finance Act 2023 s.26) and 2.5% before; leave pia_tet_rate_pct unset to apply it.\" A stated rate that differs from the statute is used and named; a year under the Nigeria Tax Act 2025 charges no education tax at all.")

# 4
x("An oil mining lease that never converted and a converted lease each produce gas onshore. Which gas royalty rates do the texts the course quotes give them?",
 "7% onshore under NTA Seventh Schedule Part IV para 7(3)(c) for the unconverted lease; 5%, or 2.5% for gas used in-country, for the converted one",
 ["5%, or 2.5% for gas used in-country, for both, since the Nigeria Tax Act restates para 10(6) for every lease",
  "7% onshore for both, since the Nigeria Tax Act replaced the Act's gas royalty with its own Part IV rates",
  "2.5% for both, the in-country rate of para 10(6) being applied to all gas that stays in Nigeria"],
 "The Nigeria Tax Act prints, for leases under its Chapter Three Parts II and III, a gas royalty of \"(i) onshore areas: 7 %, and (ii) offshore areas: 5%;\", and the course reads it beside the Act's own gas royalty, 5 percent and 2.5 percent in-country (PIA Seventh Schedule para 10(6); NTA Seventh Schedule para 6(2)(f)). The two kinds of lease can pay different royalty on the same gas. The unconverted lease is concept-only; the engine computes the converted one.")

# 5
x("Para 14(4) of the PIA Seventh Schedule sets a minimum government share of profit oil by cumulative production per field. What does it print for the first and last bands?",
 "5% up to and including 50 million barrels, and 45% over 1500 million barrels",
 ["10% up to and including 50 million barrels, and 35% over 1500 million barrels",
  "5% up to and including 100 million barrels, and 25% over 750 million barrels as printed",
  "70% up to and including 50 million barrels, and 60% after conversion"],
 "Para 14(4)(a) prints \"(a) up to and including 50 million barrels - 5% ;\" and para 14(4)(f) \"(f ) over 1500 million barrels: 45%.\" 10, 15, 25 and 35 percent are the middle bands, and 70 and 60 percent are the cost limits of para 14(4) and 14(9). Production sharing under the Act is concept-only.")

# 6
x("When an oil prospecting licence converts, what does PIA s.93(7)(b) make of the areas selected under s.93(1)(d) and (e)?",
 "Petroleum mining leases, with fiscal terms under s.267(a) and the other terms of Chapter 4",
 ["Petroleum prospecting licences, with fiscal terms under s.267(b) for appraisal and discovery work on the retained areas",
  "Relinquished areas, handed back because an oil prospecting licence cannot hold production",
  "Marginal fields under s.94(1), on the original royalty rates and farm-out agreements"],
 "S.93(7)(b): areas \"selected under section 93 (1) (d) and (e) of this Act shall be converted into petroleum mining leases with fiscal terms as applicable under section 267 (a) and other terms of Chapter 4 of this Act,\". The areas designated under s.93(1)(a), (b) and (c) continue as a prospecting licence under s.93(7)(a), and s.94(9) allows no new marginal fields.")

# 7
x("Which enactments does NTA s.196(c) and (d) list among those it repeals?",
 "The Companies Income Tax Act and the Deep Offshore and Inland Basin Act",
 ["Petroleum Industry Act 2021 in full, with its royalty Schedule and its conversion rules",
  "Tertiary Education Trust Fund Act 2011 in full, since the levy takes over its funding",
  "Finance Act 2023 and the Petroleum Royalty Regulations 2022 made under the PIA"],
 "S.196(c) and (d) read \"(c) Companies Income Tax Act, Cap. C21, Laws of the Federation of Nigeria, 2004; (d) Deep offshore and Inland Basin Act, Cap. D3, Laws of the Federation\". The Petroleum Industry Act loses listed Parts and Schedules under s.197(1), and s.197(5) deletes only sections 1, 2 and 3(3) of the Tertiary Education Trust Fund Act.")

# 8
x("At what rates does NTA s.56 charge company income tax?",
 "0% for a small company and 30 per cent for any other company from the Act's commencement",
 ["30 per cent for every company, small or not, from the commencement of the Act",
  "15 per cent for a small company and 30 per cent for any other company",
  "4% for a small company, the same rate as the development levy, and 30 per cent for the rest"],
 "S.56: \"(a) a small company, at 0%; and (b) any other company, at the rate of 30 per cent from the commence- ment of this Act.\" 15 percent is the minimum effective tax rate of s.57, and the development levy of 4 percent excludes small companies altogether under s.59(1).")

# 9
x("The case ekene_force_pia_2027 covers 2027 to 2032 under the override force_pia. Which tertiary education tax rate and which development levy does its ledger print?",
 "A tertiary education tax rate of 3.000000 percent and a levy of 0.000000, since force_pia makes every year a year under the Act alone",
 ["An education tax of 0.000000 and a levy at 4 percent, since 2027 onward are years under the Nigeria Tax Act 2025",
  "An education tax rate of 2.500000 percent, since a forced year falls back to the rate before 2023",
  "Both lines charged at once, since a forced ledger keeps the new Act's levy beside the education tax"],
 "The course prints this case: every year reports \"pia_only\", the tertiary education tax rate is 3.000000 percent and the development levy is 0.000000. \"force_pia\" puts every year on one framework, and a year under the Act alone charges the education tax (3 percent from 2023) and no levy.")

# 10
x("How do the two Acts treat the last 1 percent of a qualifying capital spend?",
 "The PIA retains it in the books until disposal; the NTA records it as a notional amount that changes no claim",
 ["Both Acts claim it in the fifth year, so that the full 100 percent is written off within the ledger",
  "The PIA claims it in a sixth year of life; the NTA adds it to the fifth year, so the fifth year claims more than 20 percent",
  "Both Acts retain it until disposal, which is why the fifth year claims 19 percent under either law"],
 "PIA Fifth Schedule para 5(2) retains \"1% of the initial cost of the asset which may only be written off in accordance with subparagraph (3)\", and NTA First Schedule Part II para 4(2) records 1% \"for statistical purposes until the asset is disposed\" as \"a notional amount\" that \"shall not increase or reduce the amount of capital allowance claimable under this Part.\" The NTA fifth year is 20 percent (0.200000) and the PIA fifth year 19 percent (0.190000).")

# 11
x("In 2025 the Ekene deep offshore lease has an HCT chargeable profit of 795646660.199557. What do its hydrocarbon tax and companies income tax lines show?",
 "Hydrocarbon tax 0.000000 and companies income tax 291253998.059867 on the whole profit",
 ["Hydrocarbon tax at 30 percent of 795646660.199557, since s.260(3) names frontier acreage alone",
  "Both 0.000000, since deep offshore sits outside the Act's fiscal Part altogether in 2025",
  "Hydrocarbon tax under the stated reading, since every year of this ledger needs one"],
 "The 2025 row, a year under the Act alone: HCT 0.000000 and CIT 291253998.059867. The lease has a chargeable profit and pays no hydrocarbon tax, because PIA s.260(3) keeps deep offshore outside the tax, and companies income tax is charged on the whole profit. The stated reading matters only in years under the Nigeria Tax Act 2025.")

# 12
x("Take the deep offshore case into 2027 with pia_deep_offshore_hct_custom_rate_pct stated as 20. Which 2027 figure does the engine print on the tax line?",
 "202851668.220565, quoted with the custom 20 reading beside the other two",
 ["304277502.330847, the figure that the course calls the law for deep offshore from 2026",
  "0.000000, since any custom reading below 30 is read by the engine as conservative_zero",
  "202414673.913043, the same figure in every year from 2026, the rate and profit both fixed"],
 "For 2027 the custom 20 column reads 202851668.220565, beside 304277502.330847 for aggressive_pml_30 and 0.000000 for conservative_zero, on a chargeable profit of 1,014,258,341.102824. 202414673.913043 belongs to 2026, whose profit differs. Each is quoted with its reading, and none is the law.")

# 13
x("What do the texts and the engine give frontier acreage (ekene_frontier, 120 USD/bbl, 2026)?",
 "A royalty rate of 0.075000, no royalty by price and no hydrocarbon tax under either framework",
 ["The shallow water tranches at 0.050000 and 0.062500, with royalty by price at the high benchmark",
  "A royalty rate of 0.075000 with a royalty by price of 10 percent above the high benchmark",
  "No royalty until the acreage is reclassified, and hydrocarbon tax at 30 percent from 2026"],
 "The frontier case returns a liquids royalty rate of 0.075000 and a royalty by price of 0.000000 (PIA Seventh Schedule para 11(2)). The rate table gives frontier 0.000000 hydrocarbon tax under either framework: PIA s.260(3) and NTA s.65(4) keep frontier acreage out of the tax \"until it is reclassified\".")

# 14
x("Which two values in this course rest on secondary sources, and how does the course treat them?",
 "The tertiary education tax of 2.5 percent before 2023 and the NDDC levy base of the total annual budget, each said to be so where used",
 ["Effective date of the Petroleum Industry Act and the escrow condition of NTA s.86, both left as stated inputs",
  "Royalty by price base year and the deep offshore rate, both of which are taught as open readings",
  "Two thirds restriction and the 3 percent education tax, both kept as hidden defaults"],
 "The editions table lists the Finance Act 2021 (2.5 percent) and the NDDC Act 2000 s.14(2)(b) (3 percent of the total annual budget) as secondary, and the course states that a secondary source is never a hidden default. The 3 percent rate rests on the Finance Act 2023 (s.26), read as a scan, and the open readings are a separate matter.")

# 15
x("How does the engine's daily rate for the royalty tranches differ from the Regulations' own method?",
 "It divides the year's crude oil plus condensate by the calendar days; the Regulations divide each month's production by the days oil was produced",
 ["Crude oil alone over 365 days, leaving condensate out of the rate the tranches read",
  "Each month's production over the days in the month, as r.12(2) directs, then averaged",
  "The stated peak rate of the year, since the tranches in para 10 are set per day"],
 "The engine's note: \"Royalty tranches read the year's crude oil plus condensate divided by the calendar days of the year; the Regulations (r.12(2)) divide each month's production by the days oil was produced in that month.\" Condensate counts in the daily rate, and 2024 and 2028 have 366 calendar days.")

# 16
x("The Regulations' Schedule prints the middle royalty by price benchmark as 102.00, 104.00, 106.00, 108.00 and 110.00 for 2022 to 2026. What does the engine do?",
 "It applies the Schedule's own 2 percent rule and says so in a note, giving 104.04 in 2023",
 ["The printed column is used as the law, since a Schedule's table outranks its own written words",
  "An average of the printed figure and the escalated one each year, with no note",
  "Refusal of any ledger that reaches 2023 until a middle benchmark is stated"],
 "The engine's note: \"The Regulations' benchmark table prints the 100 USD level as 102.00, 104.00, 106.00, 108.00 and 110.00 for 2022 to 2026, which does not follow its own 2% rule; the engine applies the rule (104.04 in 2023).\" The benchmark table prints 104.040000 for 2023 on the Regulations base, and the course names the misprint as it quotes it.")

# 17
x("The Act's own example puts the royalty by price at 2.5 percent at 75 USD/bbl in 2020. What does the engine return, and on which base?",
 "0.025000 on the Act base and also 0.025000 on the Regulations base, which keeps the 2021 levels for 2020",
 ["0.025000 on the Act base and 0.019290 on the Regulations base, the base year alone moving the rate between the two",
  "0.017935 on both bases, since the benchmarks escalate from 2020 on either reading of the Act and the Regulations",
  "0.025000 on the Act base only, as the Regulations base refuses a year before 2021"],
 "The course prints the example: the engine on the Act base returns 0.025000 at 75 USD/bbl in 2020, and on the Regulations base, which keeps the 2021 levels for 2020, also 0.025000. 0.019290 is the Regulations-base rate at 75 USD/bbl in 2025, and 0.017935 the Act-base rate in that year.")

# 18
x("On the NTA decommissioning fund cases, what is the 2026 hydrocarbon tax with the escrow condition met and not met?",
 "28569497.282609 met and 31569497.282609 not met",
 ["28569497.282609 in both runs, the escrow condition reaching companies income tax alone",
  "31569497.282609 met and 28569497.282609 not met, the deduction adding to the tax",
  "30069497.282609 met and 33069497.282609 not met, the same pair as the income tax"],
 "The escrow table prints 2026 HCT 28569497.282609 (met) and 31569497.282609 (not met); companies income tax is 30069497.282609 and 33069497.282609. A deductible contribution sits inside the cost price ratio for the hydrocarbon tax and is deducted in full for companies income tax, so both taxes move when the condition is not met.")

# 19
x("With the escrow condition unmet, what leaves the company in 2027 as a fund payment, and what reaches the tax lines?",
 "A contribution of 10000000.000000 and a deduction of 0.000000",
 ["No contribution and no deduction, the fund being paused until the condition is met",
  "A contribution of 10000000.000000 and a deduction of 10000000.000000 carried to 2028",
  "A contribution of 0.000000, since only the tax treatment follows an unmet condition"],
 "Payment and relief part company here. In 2027 the fund still receives 10000000.000000 whether or not the bank test is passed; with the test failed, the deduction column reads 0.000000, and the course says the cash goes out either way. No carry into 2028 appears on the rows.")

# 20
x("How does NTA s.57(4) define the \"profits\" that the minimum effective tax rate test divides by?",
 "Net profits before tax in the audited financial statement, less 5% of depreciation and personnel cost",
 ["The companies income tax assessable profit of each project, as the engine's top-up line reads it in NTA years",
  "Gross revenue less royalties, the base the hydrocarbon tax charges before its capital and production allowances",
  "Taxable profits after capital allowances, as the Service assesses them each year"],
 "S.57(4): \"\"profits\" means the net profits before tax as reported in the audited financial statement less 5% of depreciation and personnel cost for the year.\" The engine's top-up is a labelled project-level approximation on the companies income tax assessable profit, which is why the test itself is concept-only.")

# 21
x("To which companies does the minimum effective tax rate of NTA s.57 apply?",
 "A constituent entity of an MNE group, and any other company with aggregate turnover of N20,000,000,000 or more",
 ["Every company in upstream petroleum operations, whatever its size or its ownership",
  "Small companies only, since larger companies pay the 30 per cent rate of s.56(b)",
  "Only companies paying hydrocarbon tax, whose effective rate is tested field by field"],
 "S.57(2): \"The provisions of this section shall apply to: (a) a company that is a constituent entity of an MNE group; and (b) any other company with an aggregate turnover of N20,000,000,000 and above in the relevant year of assessment.\" The test is on the company, which is why the engine's project top-up is an approximation.")

# 22
x("Ekene Alpha's oil price is raised to 95 USD/bbl on the Regulations base. Which provision totals move?",
 "Royalties, hydrocarbon tax, companies income tax and the levy all rise, with TET at 0.000000",
 ["Royalties alone, by 43566660.591831, the higher price reaching no line that comes after the royalty",
  "The taxes alone, the royalty by price staying fixed at its 2026 benchmark for every year",
  "Every line including TET, which rises by 9768447.976327 on the larger profit"],
 "The one-change row prints royalties 43566660.591831, hydrocarbon tax 72668690.783886, companies income tax 73263359.822451, TET 0.000000, levy 9768447.976327 and take 0.685923. The price moves the royalty by price and everything after it; Alpha has no year under the Act alone, so the education tax cannot move, and 9768447.976327 is the levy.")

# 23
x("Under r.16 of the Regulations, how is marketable gas used in Nigeria charged, set beside gas that is exported?",
 "2.5% for gas used in Nigeria under r.16(1)(a), and 5% for gas exported under r.16(5)",
 ["5% for both, the in-country rate of the Act being left out of the Regulations altogether",
  "2.5% for both, since export gas is also produced and utilised in-country before it is shipped",
  "7% onshore and 5% offshore for both, as for leases outside the Act"],
 "R.16(1)(a): \"(a) the applicable rate shall be 2.5% pursuant to paragraph 10(6) of the\" Seventh Schedule; r.16(5): \"(5) The royalty based on production of natural gas for export shall be at a rate of 5% of the chargeable volumes\". The engine blends the two by the stated in-country share.")

# 24
x("Under PIA s.272(2), across what may a company consolidate costs and taxes for the hydrocarbon tax?",
 "Only across assets in which it holds licences and leases",
 ["Every field it operates, whoever holds the licence, as for companies income tax",
  "Terrains, but only after the Commission has certified the consolidation each year",
  "Across fields within one terrain, with onshore and shallow water kept apart"],
 "S.272(2): a company \"shall be allowed to consolidate costs and taxes for the purposes of hydrocarbon tax only across assets in which it holds licences and leases\", and NTA s.76(2) restates it. The engine does not model consolidation: it is concept-only.")

# 25
x("What does PIA s.265(4) allow a company to do with a loss deduction?",
 "Elect in writing to defer all or part of it to the next accounting period, and elect again later",
 ["Carry it back to the previous accounting period and reclaim hydrocarbon tax already paid for that period",
  "Transfer it to companies income tax when the hydrocarbon tax loss pool cannot use it in the next year",
  "Nothing more than use it in the first period after the loss, since s.265(3) is exhaustive"],
 "S.265(4): \"the company may elect in writing that a deduction or any part to be made under this section shall be deferred to and be made in the succeeding accounting period, and may so elect in any succeeding accounting period.\" The election is concept-only; the engine keeps the two loss pools apart and uses a loss in the next year.")

# 26
x("What is the fiscal oil price of PIA Seventh Schedule para 8?",
 "A price the Commission sets for each field at the measurement points, an export parity price net of transport in Nigeria",
 ["The realised price the company sells at, which the engine reads directly from the stated terms",
  "The high royalty by price benchmark of the year, escalated by 2 percent every 1 January",
  "A price the Service assesses after the year ends from the company's audited statements"],
 "Para 8(1): the royalties \"shall be based on the fiscal oil price determined for the field at the measurement points under applicable regulations or guidelines, and this price shall be determined by the Commission\"; para 8(2): it \"shall be an export parity price taking into consideration the deduction of transportation costs within Nigeria\". The engine's note says the realised prices stand in for it.")

# 27
x("What does the additional tax of PIA s.268 compare a company's chargeable tax with?",
 "The tax due if its exported crude were valued at barrels at the measurement point times the fiscal oil price",
 ["The tax that would be due if every barrel it sold that year were priced at the royalty by price high benchmark",
  "NTA s.57's 15% minimum effective tax rate on its audited profit before tax",
  "What a converted lease would pay on the same profit at the 30 percent class of s.267(a), whatever the lease's own class"],
 "S.268(2) makes the comparison amount the tax that would be due if the proceeds of sale were \"the amount obtained by multiplying the number of barrels of that crude oil determined at the measurement point by the fiscal oil price per barrel.\" NTA s.73 restates it. The engine does not compute it, as its fiscal price note says.")

# 28
x("How do the Petroleum Royalty Regulations 2022 work out the royalty rate of a field lying partly onshore and partly in shallow water?",
 "Compute the rate as if the whole field were onshore and as if it were all in shallow water, then weight the two by each terrain's share",
 ["Charge the whole field at the higher onshore rate, since para 10(7) favours the Federation",
  "Charge it at the shallow water rate, since the engine reads the water depth of each well",
  "Split the field into two ledgers and apply the tranches to each part's own daily rate"],
 "R.14(5) opens \"(5) The weighted average royalty rate calculation for a field partially in onshore and partially in shallow water shall be as follows: (a) determine the royalty rate as if the entire field is onshore ;\", and the course's paraphrase completes the method with the shallow water rate and each terrain's share of production. The engine takes one terrain string and never reads the water depth, so this is concept-only.")

# 29
x("How does PIA Fifth Schedule para 17(2) treat exploration spending and the first two appraisal wells in a field?",
 "As deductible costs, 100% in the year incurred; further pre-production exploration and appraisal is amortised",
 ["Qualifying capital expenditure, written off at 20% a year for four years and at 19% in the fifth year of life",
  "Costs that sit outside the cost price ratio limit, deducted in full in the year incurred like royalties and HCDT",
  "As an acquisition cost, claimed only when the field starts commercial production"],
 "Para 17(2): \"Exploration expenditure and the first two appraisal wells expenditure in the same field are to be treated as deductible costs 100% in the year incurred, while for additional exploration expenditures and appraisal expenditures in the same field relating to pre-production period are to be amortised\". The engine does not compute it: exploration expensing is concept-only.")

# 30
x("Who administers royalty under the Nigeria Tax Act 2025, set beside the Petroleum Industry Act 2021?",
 "The Service under the Nigeria Tax Act, where the Act gave the Commission the determination and collection of royalties",
 ["Commission under both Acts, since the Nigeria Tax Act does not touch the administration of royalty at all in its text",
  "Nigerian Sovereign Investment Authority under both Acts, since it is credited with royalty by price",
  "Authority for midstream royalty and the Service for upstream royalty, split between the two bodies by the Nigeria Tax Act"],
 "PIA s.259(b)(i) gives the Commission the determination and collection of royalties; under the Nigeria Tax Act the Service administers royalty (NTA s.89(2) and Seventh Schedule para 1(1)). Royalty by price is credited to the Nigerian Sovereign Investment Authority, which does not administer it.")

# 31
x("Where does the development levy of NTA s.59 go, and which profits does s.59(4) keep it off?",
 "Into a special account, shared by fixed percentages with half to the Tertiary Education Trust Fund; s.59(4) keeps it off profits computed for hydrocarbon tax",
 ["Into the Federation Account with every other petroleum revenue, charged on the hydrocarbon tax profit as well",
  "Wholly to the Tertiary Education Trust Fund, as the education tax went, on the hydrocarbon tax base",
  "Into the Nigerian Sovereign Investment Authority, charged on gross revenue less royalties"],
 "The Service collects the levy into a special account (s.59(2)) and shares it by fixed percentages, 50 percent to the Tertiary Education Trust Fund (s.59(3)), and s.59(4) keeps it off assessable profits computed for hydrocarbon tax. The engine charges it on the companies income tax assessable profit in years under the Nigeria Tax Act 2025.")

# 32
x("Which paragraph of the PIA's production sharing Part does NTA s.197(1)(d) delete?",
 "Paragraph 14 (6) of Part IV of the Seventh Schedule",
 ["Paragraph 14 (4), taking the 70% cost limit for new acreage with it",
  "Paragraph 14 (9), taking the 60% cost limit for converted contracts with it",
  "The whole of Part IV, so that no production sharing terms survive the Act"],
 "S.197(1)(d) reads \"(d) paragraph 14 (6) of Part IV of the Seventh Schedule.\" The course does not print para 14(6), so it teaches only that the deletion exists; the cost limits of para 14(4) and 14(9) are quoted as the Act prints them.")

# 33
x("A holder never signs a conversion contract. What do PIA s.303(1) and NTA s.87(1) say, read together?",
 "The Act and the NTA hydrocarbon tax Part do not apply to it until its licence or lease ends or expires",
 ["The NTA hydrocarbon tax Part applies to it from 2026, whatever its conversion status or the terms of its old lease",
  "The Act applies to it from the conversion date, on the 15 percent class of s.267(b) for its producing areas",
  "It must relinquish its lease under s.93(4) once the 18-month window has closed"],
 "S.303(1) keeps the Act away from holders \"who do not enter into a conversion\" contract, and NTA s.87(1) says the NTA hydrocarbon tax Part and the PIA do \"not apply to holders of an oil prospecting licence or oil mining lease who do not\" convert, until the licence or lease ends or expires. The Nigeria Tax Act carries petroleum profits tax for such leases in its own Part. All of it is concept-only.")

# 34
x("A producing marginal field converted under s.94(1) runs across 1 January 2026. What hydrocarbon tax rate does the engine apply in its NTA years?",
 "0.150000, the same as in its years under the Act alone",
 ["0.300000 from 2026, the Nigeria Tax Act having no marginal field class of its own",
  "0.000000 from 2026, since NTA s.65(1) names only onshore, shallow water and deep offshore",
  "A stated rate of 15 or 30, since a marginal field in NTA years is an open reading"],
 "The rate table gives a flagged shallow water field 0.150000 under \"either\" framework (PIA s.94(1) with s.267(b)), and the hydrocarbon tax rates onshore and in shallow water carry across unchanged in NTA s.72. The new-lease rate is the open reading onshore and in shallow water, and a marginal field is a converted lease.")

# 35
x("What does NTA Sixth Schedule para 2(1) keep of the cost price ratio?",
 "The limit of 65% of gross revenues determined at the measurement points, rents, royalties and like contributions left outside",
 ["Only in years under the Act alone, a 65% limit lifted for years under the Nigeria Tax Act 2025",
  "65% that now also caps royalties, HCDT and the NDDC levy within the same cost pool",
  "A limit of 70% based on total oil production, as for a contract on new acreage"],
 "NTA Sixth Schedule para 2(1) prints \"a cost price ratio limit of 65% of gross revenues determined at the measurement points.\", excluding the costs related to s.263(1)(a), (b) and (h). The engine's cost price ratio reads no framework, and royalties, HCDT and the NDDC levy sit outside the cap. 70% is a production sharing cost limit.")

# 36
x("A ledger states pia_capex_recovery_years as 4. What does the engine say?",
 "\"pia_capex_recovery_years is 4, but the PIA Fifth Schedule para 17(1) and NTA First Schedule Part II para 14(1) fix the capital allowance at five years (20, 20, 20, 20, 19 percent under the PIA; 20 percent a year under the NTA).\"",
 ["Runs a four-year schedule at 25 percent a year and names the change in kpis.pia_notes",
  "Five years in NTA years, and four in years under the Act alone",
  "It refuses only in years under the Nigeria Tax Act 2025, where the life is fixed"],
 "That is the first sentence of the engine's refusal: the capital allowance life is fixed by the texts at five years, so any other life is refused. The five-year schedule is 0.200000 in years 0 to 3 under both laws and 0.190000 or 0.200000 in the fifth year by the law of the year.")

# 37
x("A ledger states pia_hct_rate_override_pct as 150. What comes back?",
 "It is refused, the engine accepting an override only within 0 to 100",
 ["Capped at 100 percent, with a note in kpis.pia_notes about the cap it applied",
  "150 percent, since an override replaces the rate with no check",
  "30 percent, the override ignored above 100"],
 "The engine's words: \"pia_hct_rate_override_pct must be a number from 0 to 100; got 150.\" A refusal is a thrown error and returns no ledger, so there is no silent cap, no silent pass-through and no silent fallback to the statutory rate.")

# 38
x("A ledger states pia_price_royalty_base as \"act_2021\". What happens?",
 "It is refused: the base must be \"regulations_2021\" or \"act_2020\"",
 ["Runs on the Act's reading, since the Act's benchmarks begin in 2021",
  "Falls back to the Regulations base, the engine's default for an unknown value",
  "Royalty by price is switched off for every year of the ledger it runs"],
 "The engine's message: \"pia_price_royalty_base must be \"regulations_2021\" or \"act_2020\"; got \"act_2021\".\" The Act starts the benchmarks in 2020 (\"act_2020\"), the Regulations in 2021 (\"regulations_2021\"), and the base year is an open reading the learner states.")

# 39
x("Which provisions does the course cite for doing the fiscal arithmetic at field level and scaling money to the working interest?",
 "PIA s.273(4) and NTA s.77(4)",
 ["PIA s.302(5) and NTA s.78(3)(a), which keep the two taxes apart",
  "PIA s.265(2) and NTA s.70(2), which split assessable profit by class",
  "PIA s.272 and NTA s.76, the consolidation provisions across terrains"],
 "The provision map lists \"Working interest: fiscal arithmetic at field level, money at the share\" under PIA s.273(4) and NTA s.77(4). S.302(5) and s.78(3)(a) make the hydrocarbon tax non-deductible for income tax, s.265(2) and s.70(2) separate the two tax classes, and s.272 and s.76 are consolidation.")

# 40
x("What does the engine's note on the pre-2026 restriction say about years before 1 May 2023?",
 "The wording then in force was not read, and the engine applies the same restriction to every year before 2026",
 ["The restriction did not exist before 1 May 2023, so those earlier years claim the whole capital allowance in full",
  "Those years are refused until a restriction is stated, since the missing wording is one of the open readings",
  "The restriction was one half before 1 May 2023, a figure taken from a secondary source"],
 "The note: \"The wording in force before 1 May 2023 was not read; the engine applies the same restriction to every year before 2026.\" The course's three open readings do not include it, nothing is refused on it, and the course prints no other fraction for those years.")

# 41
x("On ekene_cpr_binding_forfeiture, 93000000.000000 of cost is still carried when the ledger ends. Which tax loses that cost, and what does the other tax do with opex?",
 "The hydrocarbon tax forfeits it; companies income tax deducts opex in full, the cap never reaching it",
 ["Both taxes forfeit it, since the cost price ratio caps the companies income tax base in the same way",
  "Companies income tax forfeits it, and the hydrocarbon tax deducts it in a final year",
  "Neither tax loses it, since the carry is claimed against the next lease's revenue"],
 "The cost still carried at the end, 93000000.000000, is reported as cpr_forfeited_at_cessation. PIA Sixth Schedule para 2(2)(c) makes such costs not deductible for the hydrocarbon tax, and the cap limits the hydrocarbon tax only: companies income tax deducts opex in full (40000000.000000 in each year of the case).")

# 42
x("The new onshore lease ekene_onshore_new_cap_crossing is run at a stated 15 and at a stated 30. Which 2026 figures stay the same?",
 "The HCT chargeable profit, 151411548.913043, and companies income tax, 50223464.673913",
 ["The hydrocarbon tax, 22711732.336957, since the rate only reaches the chargeable profit",
  "Nothing at all, since the stated rate reaches every line through the tax base",
  "Companies income tax alone, the chargeable profit rising at the higher stated rate"],
 "The two-rate table prints 2026 HCT chargeable profit 151411548.913043 under both, hydrocarbon tax 22711732.336957 at 15 and 45423464.673913 at 30, and companies income tax 50223464.673913 under both. The stated rate moves the hydrocarbon tax line alone, because companies income tax does not deduct it; the rate of such a lease is an open reading.")

emit(Q, '/root/cat-wip-pia/banks/ec7a_exam.json', expect_n=42)
finish()
