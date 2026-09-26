import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC7 Professional m05, Companies Income Tax Alongside.
# Every figure is quoted from digest.txt. The Finance Act 2023 is a scan and is
# paraphrased, never quoted. No change of law across 1 January 2026 is worked.

q(0, "The Ekene new onshore lease is run with its stated new-lease rate changed from 15 to 30. What is companies income tax in 2026 under each run?",
 "50223464.673913 under both stated readings",
 ["Lower under the stated 30, since the larger hydrocarbon tax is deducted",
  "Higher under the stated 30",
  "Refused under the stated 30 until companies income tax states its own rate"],
 "PIA s.302(5) reads: \"(5) In determining the companies income tax, the hydrocarbon tax under this Act shall not be deductible.\" So a stated rate that doubles the hydrocarbon tax (22711732.336957 to 45423464.673913) leaves companies income tax at 50223464.673913 in both runs. If the tax were deductible the higher reading would lower it; nothing adds the hydrocarbon tax to it either. Companies income tax runs at 30 percent unless stated and needs no reading.")

q(2, "Which stream of revenue does companies income tax charge that the hydrocarbon tax leaves out?",
 "Gas",
 ["Condensate, which the hydrocarbon tax treats as a natural gas liquid and leaves outside its scope",
  "Crude oil sold below the Commission's fiscal price, which the hydrocarbon tax excludes from its base",
  "Production covered by the production allowance, which companies income tax charges in full"],
 "Companies income tax is charged on oil and gas together; the hydrocarbon tax charges crude oil and condensate only, so gas revenue is in one base and out of the other. Condensate is inside the hydrocarbon tax by s.260(1)(a). The fiscal price is concept-only and removes no crude oil from the tax. The production allowance is a deduction per barrel and takes no revenue out of the base.")

q(1, "The Ekene gas field's 2026 companies income tax is 10713000.000000 on an assessable profit of 47710000.000000. Why is the tax below 30 percent of that assessable profit?",
 "Its own capital allowance comes off the assessable profit before the 30 percent applies",
 ["The hydrocarbon tax is deducted first",
  "Gas used in-country is taxed at a lower companies income tax rate than gas sold for export",
  "The cost price ratio holds back part of the opex"],
 "The engine's companies income tax base is gross revenue from oil and gas less every royalty, opex in full, HCDT and the NDDC levy, and then less its own capital allowance; the assessable profit it prints is the figure before that allowance, and the 30 percent applies after it. The hydrocarbon tax is never deducted (s.302(5)), and on this field it is 0.000000 anyway. The in-country share lowers the gas royalty rate and leaves the tax rate at 30 percent. The cost price ratio does not apply to companies income tax, which deducts opex in full.")

q(3, "On the Ekene CPR case in 2026 the hydrocarbon tax chargeable profit is 8792934.782609 while the companies income tax assessable profit is -457065.217391. Why do the two bases point in opposite directions?",
 "Companies income tax deducts the full opex, while the 65 percent cap holds back the hydrocarbon tax claim",
 ["Its deduction of the hydrocarbon tax pushes the income tax base below zero",
  "The hydrocarbon tax adds back the NDDC levy that companies income tax deducts",
  "A later year's revenue is what companies income tax reads"],
 "The cap limits the hydrocarbon tax claim to 29250000.000000 in 2026 and carries the rest, so its base stays positive; companies income tax deducts the 40000000 USD of opex in full and has no cap, so its base goes below zero. Companies income tax does not deduct the hydrocarbon tax. The NDDC levy is deducted in both bases. Both taxes read the same year's revenue.")

q(3, "PIA s.302(11)(a) lets companies income tax deduct \"all rents and royalties the liability for which was incurred by the company during that period in respect of crude oil sold, condensate sold and natural gas sold or delivered or disposed of in any other commercial manner\". Which royalty does that add beyond the hydrocarbon tax base?",
 "The gas royalty",
 ["The royalty by price, which the hydrocarbon tax leaves in its base",
  "The liquids production royalty, which the hydrocarbon tax deducts only up to the cost price ratio",
  "Royalty on non-associated gas condensate, taxed under the hydrocarbon tax at 15 percent"],
 "The hydrocarbon tax base deducts the liquids production royalty and the royalty by price under s.263(1)(b), and leaves the gas royalty out because gas is outside the tax. Companies income tax deducts every royalty, the gas royalty included. Both liquids royalties are already deducted in the hydrocarbon tax base, outside the cap. Non-associated gas condensate is outside the hydrocarbon tax under s.260(1)(b)(ii) and has no rate.")

q(1, "On the Ekene CPR case, 2024 is a year under the Act alone with a companies income tax assessable profit of 23999396.909159, and the engine claims a capital allowance of 15999597.939440. What limits the claim?",
 "Two thirds of the assessable profit, the restriction of CITA para 24(7) as substituted by Finance Act 2023 s.9(b)",
 ["The 65 percent cost price ratio of the Sixth Schedule, applied to companies income tax in the same way as to the hydrocarbon tax",
  "The 19 percent fifth-year rate of the Fifth Schedule",
  "A 30 percent cap on the allowance under NTA s.56(b), the companies income tax rate itself"],
 "In a year under the Act alone the capital allowance claimed against companies income tax is limited to two thirds of the assessable profit, with the excess carried forward; two thirds of 23999396.909159 is the 15999597.939440 claimed. The cost price ratio limits the hydrocarbon tax only. The schedule rate sets the allowance itself, and 2024 is the spend's first year. The 30 percent in s.56(b) is the tax rate and caps no allowance.")

q(0, "On the Ekene onshore lease, cit_allowance_restricted reads true in 2024 and 2025, yet the whole 18000000.000000 allowance is claimed in both years. What does the flag mean?",
 "The rule is in force that year",
 ["The allowance was cut by a third",
  "The claim moved to 2026",
  "The company is in gas operations and is exempt, which the engine marks as a restricted year"],
 "The flag marks the two thirds rule as in force in a year under the Act alone, whether or not it bites. On this lease two thirds of each assessable profit (153422584.102902 and 138422805.570953) is far larger than 18000000.000000, so the whole allowance is claimed and nothing is carried. Nothing was cut or carried. A company in gas operations is exempt, and its flag would read false.")

q(2, "Who is exempt from the two thirds restriction on the companies income tax capital allowance, and how does a learner tell the engine?",
 "A company in upstream or midstream gas operations, set with pia_cit_company_gas_operations true",
 ["Any 15 percent hydrocarbon tax payer, set with the licence type PPL",
  "A lease in deep offshore, set with its terrain",
  "Any company with a loss carried forward"],
 "The engine's note says: \"Companies in upstream or midstream gas operations are exempt: set pia_cit_company_gas_operations to true.\" The licence type moves the hydrocarbon tax class and has no effect on companies income tax. Terrain is no exemption from this rule. A carried loss is a separate pool and grants no exemption.")

q(1, "The engine's note on the two thirds restriction says: \"The wording in force before 1 May 2023 was not read; the engine applies the same restriction to every year before 2026.\" How does the engine treat a 2022 ledger year?",
 "It applies the same two thirds restriction and states that choice in its note",
 ["No restriction at all, since the Finance Act 2023 took effect on 1 May 2023 and nothing earlier binds",
  "It refuses the year until the wording in force before 1 May 2023 is supplied",
  "A one-half restriction, the older rule"],
 "The restriction comes from CITA Second Schedule para 24(7) as substituted by Finance Act 2023 s.9(b), effective 1 May 2023. The engine did not read the earlier wording, so it applies the same restriction to every year before 2026 and says so in kpis.pia_notes, which is part of the result. It does not refuse such a year, and no one-half rule appears in any text the course read.")

q(2, "The companies income tax chargeable profit of the CPR case is -65495752.569896 in 2026. Where does that loss go?",
 "It is carried to the next year as 65495752.569896 and reduces nothing in the hydrocarbon tax",
 ["Set against the hydrocarbon tax chargeable profit of the same year",
  "It joins the cost price ratio pool of the hydrocarbon tax and is forfeited with that pool at cessation",
  "Written off at the year end"],
 "The engine keeps a hydrocarbon tax loss and a companies income tax loss apart, and a loss in one never reduces the other, so the 2026 loss is carried as 65495752.569896 for a later companies income tax profit. The cost price ratio carry is a different thing, inside the hydrocarbon tax, and the loss never joins it. A loss is carried to the next year and used there; it is not written off.")

q(3, "PIA s.265(3) says a loss deduction \"shall be made so far as possible from the amount, if any, of the adjusted profit of the first accounting period after that in which the loss was incurred,\". Where does the engine use a loss first?",
 "In the next year",
 ["Same year first, against the other tax class, before any carry",
  "Spread evenly over the following five years",
  "At the end of the ledger, in its last year"],
 "The engine carries a loss to the next year and uses it there, as far as that year's profit allows, which is what s.265(3) says; the Nigeria Tax Act 2025 restates it at s.70(3). The two classes of rate are kept separate under s.265(2), and the hydrocarbon tax and companies income tax pools are kept apart. No text spreads a loss over five years, and the last year of the ledger is where a cost price ratio carry is forfeited, a different rule.")

q(0, "PIA s.265(4) lets a company \"elect in writing that a deduction or any part to be made under this section shall be deferred to and be made in the succeeding accounting period\". How does the engine handle that election?",
 "It takes no such election, so the provision is concept-only and never graded on a number",
 ["A stated deferral input defers the loss",
  "Every loss is deferred by one year",
  "It refuses a ledger with a loss"],
 "The engine uses a loss in the next year as far as possible and has no input for an election to defer; the election is taught from its text as a concept-only provision. There is no deferral switch, the engine does not defer any loss on its own, and a loss is a normal result that the engine returns.")

q(3, "Section 260(3) keeps deep offshore outside the hydrocarbon tax. On the 60,000 bopd deep offshore case in 2025, a year under the Act alone, what companies income tax is due?",
 "291253998.059867",
 ["0.000000",
  "795646660.199557, the whole chargeable profit",
  "30 percent of the production allowance"],
 "Section 260(3) takes deep offshore out of the hydrocarbon tax Part only, so the tax is not zero; companies income tax is charged on the whole profit, 291253998.059867 in 2025. 795646660.199557 is the hydrocarbon tax chargeable profit, a base and never a tax. The production allowance is a deduction in the hydrocarbon tax base and is not taxed.")

q(1, "Which deduction in the hydrocarbon tax base has no counterpart in the companies income tax base?",
 "The Sixth Schedule's per-barrel allowance",
 ["The capital allowance",
  "The HCDT contribution, which s.257(1) allows for the hydrocarbon tax alone",
  "The royalty by price, which companies income tax adds back as a charge on price"],
 "The Sixth Schedule production allowance belongs to the hydrocarbon tax alone, and companies income tax has none. Companies income tax has its own capital allowance claim. Section 257(1) makes the HCDT contribution deductible \"for the purposes of hydrocarbon tax and companies\" income tax, so both bases take it. Every royalty, the royalty by price included, is deducted for companies income tax under s.302(11)(a).")

q(2, "At what rate does the engine charge companies income tax on an oil and gas company, unless a rate is stated?",
 "30 percent",
 ["The hydrocarbon tax rate of the lease, 30 or 15 percent, so the two taxes share one class",
  "20 percent, the yearly capital allowance rate",
  "0 percent, the small company rate of NTA s.56(a)"],
 "Companies income tax runs at 30 percent unless stated; NTA s.56(b) charges \"any other company, at the rate of 30 per cent from the commence- ment of this Act.\" The hydrocarbon tax class does not reach companies income tax: the Ekene new onshore lease pays the same companies income tax under both stated readings. The 0 percent rate is for a small company, which an oil and gas producer on these cases is not.")

emit(Q, '/root/cat-wip-pia/banks/ec7i_m05.json', expect_n=15)
finish()
