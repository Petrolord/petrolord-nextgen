import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC7 Associate m05, The Instruments Stacked.
# Sources: the instruments stacked on one year and the base each reads; the
# worked example's line items; the texts behind the stack; host communities
# and the NDDC levy with both NDDC bases; the crude-plus-condensate share (the
# part of the deductions section this module owns, as a named rule, never
# worked); government cash flow, take and the working interest. No question
# works a deduction, the cost price ratio or an allowance. Every keyed figure
# is re-run through computeCashFlow in
# /root/cat-wip-pia/scratch/bank-beginner/witness.mjs.

q(1, "In what order does the engine apply the instruments within one year?",
 "Royalties off revenue first, then HCDT and the NDDC levy on their own bases, then the two taxes, then the education charge.",
 ["The two taxes first, then royalty on what is left, then the contributions.",
  "HCDT and the NDDC levy first, then royalty on the revenue left after them.",
  "Companies income tax first, then the hydrocarbon tax on the profit left after it has been paid."],
 "Royalty comes off revenue first; HCDT and the NDDC levy are computed on their own bases; the hydrocarbon tax and companies income tax are charged on their own profits; and the tertiary education tax or development levy reads the companies income tax assessable profit. Royalty reads value and comes before any tax, the contributions read cost bases and never shrink the royalty base, and companies income tax does not deduct the hydrocarbon tax, nor the reverse.")

q(3, "What does PIA s.302(5) say about the two taxes on profit?",
 "The hydrocarbon tax is not deductible in determining companies income tax.",
 ["Companies income tax is deductible in computing the hydrocarbon tax for the same year of assessment.",
  "Each tax is deductible against the other in alternate years, to smooth the burden over the life.",
  "The hydrocarbon tax is deductible only in years under the Act alone."],
 "The text reads: \"(5) In determining the companies income tax, the hydrocarbon tax under this Act shall not be deductible.\" The reverse deduction is barred too: s.264(l) keeps companies income tax and the tertiary education tax out of the hydrocarbon tax base. The Act has no alternating rule and draws no line by framework here.")

q(0, "Which amounts does PIA s.264(l) keep out of the hydrocarbon tax base?",
 "The tertiary education tax, companies income tax and similar income or profits taxes.",
 ["Royalties paid on crude oil and associated gas in the period.",
  "Contributions to a host communities development trust.",
  "The NDDC levy on the company's total annual budget."],
 "Section 264(l) lists \"amounts incurred in respect of tertiary education tax, companies income tax, any income tax, profits tax or other similar taxes, whether charged within Nigeria or elsewhere\". Royalties are deductible under s.263(1)(b), and s.263(1)(h) makes contributions to host communities development trusts and to the Niger Delta Development Commission deductible.")

q(2, "The worked example states a prior-year opex of 170000000 USD. What HCDT does the engine return for 2025?",
 "5100000.000000 USD, 3 percent of the preceding year's opex.",
 ["15000000.000000 USD, the fixed sum the case states for its NDDC levy in the same year of assessment.",
  "Nothing, since HCDT reads only the capex of the year it is charged in and 2025 carries none.",
  "3 percent of the year's gross revenue under s.240(2)."],
 "PIA s.240(2) sets the contribution at \"an amount equal to 3% of its actual annual operating expenditure of the preceding financial year\", and the first ledger year reads the stated pia_prior_year_opex_usd: 3 percent of 170000000 USD is 5100000.000000 USD. The 15000000.000000 USD is the fixed NDDC sum, and HCDT reads neither capex nor revenue.")

q(0, "Why is Ekene Alpha's 2026 HCDT 0.000000 USD?",
 "Alpha states no prior-year opex, and the first ledger year reads that stated figure.",
 ["HCDT is charged only in years under the Act alone.",
  "Heavy capex in 2026 cancels the contribution.",
  "HCDT starts after the first year of production under s.257(1) of the Act."],
 "The first ledger year reads the stated pia_prior_year_opex_usd, 0 if none is stated, and Alpha states none; from 2027 HCDT reads the previous year's opex, 720000.000000 USD a year. HCDT is charged in every framework, capex does not enter it, and s.257(1) makes the payment deductible, which says nothing about when it starts.")

q(3, "Ekene Alpha's 2026 NDDC levy is 4320000.000000 USD. Which base produced it?",
 "3 percent of the total annual budget, opex plus capex, a base read from a secondary source.",
 ["3 percent of the year's opex alone, the base that the Petroleum Industry Act 2021 sets for the levy.",
  "3 percent of the preceding year's opex, the same base HCDT reads under s.240(2).",
  "A fixed sum stated in the case, as in the worked example."],
 "The engine takes the NDDC levy as 3 percent of the year's opex plus capex, the total annual budget of the NDDC Act 2000 s.14(2)(b) as amended, read from a secondary source: 24000000 plus 120000000 USD gives 4320000.000000 USD. The opex base is a stated alternative that Alpha does not state, the PIA does not set this levy, HCDT is the line on preceding opex, and Alpha states no fixed sum.")

q(1, "On ekene_nddc_opex_base in 2026, which pair of NDDC figures does the engine return on the two bases?",
 "450000.000000 USD on the opex base and 2250000.000000 USD on the total budget.",
 ["2250000.000000 USD on the opex base and 450000.000000 USD on the total budget.",
  "2250000.000000 USD on both bases, as the levy reads the whole budget whichever base is stated.",
  "450000.000000 USD on both bases, since capex never enters the NDDC levy."],
 "The engine returns 450000.000000 USD on the stated opex base and 2250000.000000 USD on the default total budget in 2026, a year with capex. Swapping them reverses the bases, and the two figures differ in 2026 because the total budget counts that year's capex while the opex base does not.")

q(2, "A learner states pia_nddc_levy_base \"budget\". What does the panel print?",
 "The engine's refusal: pia_nddc_levy_base must be \"total_budget\" or \"opex\"; got \"budget\".",
 ["A ledger on the total budget base, since \"budget\" is close enough to the default string to be read as it.",
  "A ledger with the NDDC levy set to zero and a note naming the unknown base.",
  "The opex base, chosen without a message."],
 "Two NDDC bases exist in the engine, the total annual budget (the default, from a secondary source) and opex, plus a fixed sum that replaces the percentage. A string outside that pair stops the run, and the panel shows the message verbatim as the engine's own words. Guessing the nearest base, zeroing the levy or picking the opex base would each hide a bad input behind a figure.")

q(2, "Which education charge does a year under the Nigeria Tax Act 2025 carry, and on what base?",
 "The development levy, 4% of the companies income tax assessable profit.",
 ["The tertiary education tax at 3 percent, charged on the hydrocarbon tax chargeable profit of the year.",
  "Both the tertiary education tax and the development levy, charged side by side on the same base.",
  "The development levy, on the hydrocarbon tax assessable profit."],
 "NTA s.59(1) charges \"A development levy of 4%\" on assessable profits, and the engine charges it on the companies income tax assessable profit. NTA s.59(4) keeps it off assessable profits computed for hydrocarbon tax, and NTA s.197(5) deletes the charging sections of the Tertiary Education Trust Fund Act, so the two charges never sit on the same year.")

q(3, "The worked example is 2025, a year under the Act alone, on the default Regulations base. What tertiary education tax does the engine return?",
 "31747249.445676 USD, at 3.000000 percent.",
 ["Nothing, because the development levy of 4 percent is charged in that year of assessment.",
  "31747249.445676 USD at 2.5 percent, the rate that rests on a secondary source.",
  "3 percent of the hydrocarbon tax chargeable profit of 2025."],
 "In a year under the Act alone the education charge is the tertiary education tax, 3.000000 percent from 2023 under the Finance Act 2023 s.26, on the companies income tax assessable profit: 31747249.445676 USD. The development levy belongs to years under the Nigeria Tax Act 2025, 2.5 percent is the rate before 2023, and the base is the income tax profit.")

q(0, "Which provision removes the tertiary education tax from every ledger row read as nta_2025?",
 "NTA s.197(5) deletes sections 1, 2 and 3(3) of the Tertiary Education Trust Fund Act 2011.",
 ["The Finance Act 2023 set the tax to zero with effect from 1 May 2023.",
  "NTA s.59(4) exempts all petroleum operations from education charges.",
  "The Service stopped assessing it under PIA s.259(a)(ii)."],
 "The text reads: \"(5) The Tertiary Education Trust Fund (Establishment, Etc.) Act, 2011 is amended by deleting sections 1, 2, and 3(3).\" The Finance Act 2023 raised the tax to 3 percent from 1 May 2023; s.59(4) only keeps the development levy off hydrocarbon tax profits; and s.259(a)(ii) still gives the Service the tax in a year under the Act alone.")

q(2, "How does the shared fiscal wording define government take?",
 "Government cash flow over the pre-take net cash flow, revenue less opex less capex, over the project life.",
 ["Total tax over revenue, taken year by year and then discounted at 10 percent nominal back to the ledger's base year.",
  "Government cash flow over revenue less opex, with capex added back to the contractor side.",
  "The highest marginal rate that any barrel meets in any year of the lease."],
 "fiscalConventions.js reads that government take is \"Government cash flow divided by the project's pre-take net cash flow, which is revenue less opex less capex, over the project life.\" Adding capex back is the definition of the second metric, the government share of net revenue. The engine's take is undiscounted, and it is a share of value; a marginal rate describes something else.")

q(1, "On the Regulations base, the engine default, Ekene Alpha's government cash flow is 556475163.954050 USD over a pre-take value of 835989167.000000 USD. What take does the engine report?",
 "66.564877 percent, undiscounted and nominal.",
 ["66.564877 percent, discounted at 10 percent nominal to the first year of the ledger.",
  "The take equals the royalties over revenue, since royalty is the first line of the stack.",
  "The ratio of total tax to net cash flow."],
 "The engine's take is government cash flow over revenue less capex less opex, undiscounted and nominal: 66.564877 percent on Alpha, which the government cash flow over the pre-take value reproduces. The discount rate of 10 percent is used for NPV and plays no part in the take, and the take counts every royalty, contribution and tax.")

q(3, "At a 50 percent working interest, what does the engine return for Ekene Alpha's money lines and take? The run keeps the default Regulations base.",
 "Every money line is half, and the take holds at 66.564877.",
 ["The royalty tranches are re-read at half the daily rate, so royalties fall by more than half.",
  "The money lines stay at field level, and the take alone is scaled to the share.",
  "Taxes halve while the royalties stay whole, so the take rises."],
 "The engine reads the tranches, caps and every rate at field level, then scales each money line to the share: at 50 percent every money line is half (checked) and the take does not move (checked), 66.564877 on both. The daily rate is never re-read at the share, the money lines are the ones scaled, and royalties halve with the taxes.")

q(1, "Ekene Alpha sells associated gas. Why does the engine deduct none of Alpha's gas royalty in the hydrocarbon tax base?",
 "Gas sits outside the hydrocarbon tax, so its royalty has nothing to reduce there.",
 ["Gas royalty is deducted only in companies income tax years under the Act alone.",
  "The gas royalty is paid by the buyer of the gas, so it never reaches the lease's ledger.",
  "NTA s.59(4) keeps every royalty out of hydrocarbon tax profits."],
 "The hydrocarbon tax charges crude oil and condensate only, so its base deducts the liquids production royalty and the royalty by price and leaves the gas royalty out. Costs shared with gas enter that base at the crude-plus-condensate share of gross revenue, 0.970075 on Alpha, a stated approximation. The gas royalty is on Alpha's ledger and in its total royalty, and s.59(4) speaks of the development levy.")

emit(Q, '/root/cat-wip-pia/banks/ec7b_m05.json', expect_n=15)
finish()
