import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC7 Professional m02, What the Hydrocarbon Tax Charges.
# Every figure is quoted from digest.txt. The new-lease rate onshore or in
# shallow water is an open reading: every question on it states the reading it
# uses or sets both side by side, and no key rests on one of them as the law.
# Deep offshore appears only in a year under the Act alone.

q(1, "PIA s.260(1)(a) says what the hydrocarbon tax applies to. Which streams does it name?",
 "Crude oil, field condensates, and liquid natural gas liquids derived from associated gas",
 ["Every hydrocarbon the field sells, gas included, measured at the measurement points",
  "Only the crude oil, with condensate handled by the gas royalty",
  "Crude oil and condensates from non-associated gas plants"],
 "The text reads: \"(a) hydrocarbon tax shall apply to crude oil as well as field condensates and liquid natural gas liquids derived from associated gas and produced in the field upstream of the measurement points ;\". Gas itself is outside the tax, so a scope of every hydrocarbon sold is too wide. Condensate is named in the scope, so crude oil alone is too narrow. Condensates and natural gas liquids from non-associated gas are taken out by s.260(1)(b)(ii), a concept-only line in this course.")

q(3, "The Ekene gas field (shallow water, converted lease, no crude oil or condensate) returns a cost price ratio cap of 0.000000 and a hydrocarbon tax of 0.000000 in 2026. Why?",
 "It has no crude oil or condensate revenue, and gas sits outside the tax",
 ["Gas used in-country at 2.5 percent royalty is exempted from the hydrocarbon tax by the Seventh Schedule",
  "The gas royalty of 2250000.000000 is set off against the hydrocarbon tax until the tax reaches zero",
  "Any in-country gas share above zero exempts the lease"],
 "The engine charges the hydrocarbon tax on crude oil and condensate, and the cap is 65 percent of that revenue; with none, both are zero. The in-country share changes the gas royalty rate (0.037500 at half) and grants no exemption from any tax. A royalty is a deduction in a tax base and is never set off against the tax itself. The in-country share of 50 percent is accepted; a refusal would return no figures at all.")

q(0, "On the Ekene gas field, which tax charges the 2026 gas profit, and at what figure?",
 "Companies income tax, at 10713000.000000",
 ["The hydrocarbon tax at the 30 percent class, on a base of 47710000.000000 once the gas royalty is deducted",
  "No profit tax at all, since the gas royalty of 0.037500 is the whole fiscal charge on gas in 2026",
  "A 15 percent hydrocarbon tax, the rate s.267(b) gives to a gas field in shallow water"],
 "Gas revenue is outside the hydrocarbon tax, and companies income tax is charged on oil and gas together, so the gas profit carries companies income tax: an assessable profit of 47710000.000000 and a tax of 10713000.000000 in 2026. The 47710000.000000 figure is the companies income tax base and belongs to no hydrocarbon tax computation. The royalty is one instrument among several and leaves the profit taxable. Section 267 sets rates on profit from crude oil and gives no gas class.")

q(2, "Ekene Alpha sells associated gas, and its liquids share of gross revenue is 0.970075 in 2026. Which of these enters its hydrocarbon tax at that share?",
 "Each cost shared with the gas: opex, the capital allowance, HCDT and the NDDC levy",
 ["The cap, scaled down by 0.970075",
  "Both liquids royalties, the production royalty and the royalty by price, cut to the share by s.263(1)(b)",
  "The rate, charged on the liquids share only"],
 "The engine's note says: \"Opex, HCDT, NDDC, capital allowances and any decommissioning contribution enter the hydrocarbon tax at the crude-plus-condensate share of gross revenue.\" The cap is already 65 percent of crude oil and condensate revenue (147664400.000000 in 2026), so no share is applied to it. The liquids royalties are charged on liquids alone and deducted whole. The rate is 0.300000 on the chargeable profit; the share acts on shared costs.")

q(0, "Why does the engine split Ekene Alpha's shared costs by revenue share, and what does it say about that choice?",
 "It cannot tell associated from non-associated gas, and it states the split in kpis.pia_notes as an approximation",
 ["The Act orders costs split by revenue share in s.260(2), so the engine follows the text exactly and prints no note",
  "Costs are split by barrels of oil equivalent, which the Regulations prescribe for every gas field",
  "The split is a refusal the learner clears by stating which gas is associated"],
 "Section 260(2) allocates associated gas costs to crude oil, and s.260(1)(b)(ii) takes non-associated gas condensate out of the tax. The engine carries one gas stream, so it uses the crude-plus-condensate share of gross revenue and says so in the sharedCosts note: \"the engine cannot tell the two gases apart.\" The Act prescribes no revenue split, the engine uses revenue and never oil equivalent, and the run completes with a note, which is a result.")

q(3, "The Ekene deep offshore lease has a 2025 hydrocarbon tax chargeable profit of 795646660.199557, in a year under the Act alone. What hydrocarbon tax does the engine charge that year?",
 "0.000000, since s.260(3) keeps deep offshore outside the Part",
 ["30 percent of it, the s.267(a) rate for any petroleum mining lease",
  "15 percent of it, the s.267(b) rate for a lease out of new acreage",
  "0.000000, and no companies income tax on that profit either"],
 "PIA s.260(3) reads: \"(3) This Part shall not apply to a frontier acreage until it is reclassified under section 68 (3) of this Act and to deep offshore.\" The engine returns a rate of 0.000000 and a tax of 0.000000, while still computing the base. Section 267 applies only where the Part applies. Companies income tax is charged on the same lease, 291253998.059867 in 2025.")

q(1, "How does s.260(3) treat frontier acreage and deep offshore differently?",
 "Frontier is outside the Part until reclassified under s.68(3); deep offshore is outside with no condition",
 ["Both are outside the Part until their water depth is reclassified under s.68(3) by the Commission",
  "Only frontier paying royalty by price is outside; deep offshore only below 50,000 bopd",
  "Deep offshore is outside until reclassified; frontier is outside with no condition"],
 "The text ties the reclassification condition to frontier acreage (\"until it is reclassified under section 68 (3)\") and names deep offshore at the end with no condition. The Nigeria Tax Act 2025 keeps the frontier carve-out in s.65(4). Water depth plays no part in the reclassification, frontier pays no royalty by price at all under para 11(2), and the 50,000 bopd tier is a royalty rule. The swapped reading reverses the two terrains.")

q(3, "An onshore petroleum mining lease selected under s.93(6)(b) on conversion produces crude oil. What hydrocarbon tax rate does the engine return?",
 "0.300000, under s.267(a)",
 ["0.150000, because s.267(b) names onshore and shallow water in its opening words and so covers every onshore lease",
  "0.000000, since onshore fields below 10,000 bopd sit in the small-field tranches and pay royalty alone",
  "A refusal until a rate of 15 or 30 is stated, because the Act leaves every onshore lease rate open"],
 "Section 267(a) charges \"30% of the profit from crude oil for petroleum mining leases selected under section 93 (6) (b) and (7) (b) of this Act with respect to onshore and shallow water areas\", and the engine returns 0.300000 for a converted PML. Reading s.267(b) over every onshore lease skips the specific class (a) gives converted leases. The tranches are royalty and grant no tax holiday. The refusal applies to a lease granted out of new acreage, which this lease is not.")

q(1, "Which of these returns a hydrocarbon tax rate of 0.150000 from the engine?",
 "An onshore petroleum prospecting licence",
 ["Any onshore petroleum mining lease converted from an oil mining lease",
  "A frontier lease of any size",
  "A shallow water converted lease producing above 10,000 bopd"],
 "Section 267(b) gives 15 percent to \"petroleum prospecting licences selected under section 93 (6) (a) and (7) (a)\", and the engine returns 0.150000 for a PPL; a producing marginal field converted under s.94(1) gets the same. A converted PML pays 0.300000. Frontier acreage pays 0.000000 under s.260(3). The daily rate moves royalty and leaves the tax rate alone, so a large converted shallow water lease still pays 0.300000.")

q(2, "Ekene Alpha is rerun with its licence type changed from \"PML\" to \"PPL\" and nothing else. What happens to its 2026 hydrocarbon tax lines?",
 "The rate and the tax change, and the assessable profit stays at 182041059.069891",
 ["Every line changes, since a prospecting licence has its own royalty tranches and its own cost price ratio",
  "It is refused: a PPL may not produce crude oil",
  "Nothing changes, since terrain alone sets the rate"],
 "The licence type moves the s.267 class, so the rate drops to 0.150000 and the tax falls; the base (royalties, the cap, the allowances) does not read the licence, so the 2026 assessable profit stays at 182041059.069891. Royalty tranches and the cost price ratio take no licence input. The engine accepts \"PML\" or \"PPL\" and runs both. The rate is set by licence and lease status, and terrain alone would leave Alpha at 0.300000.")

q(0, "What does PIA s.265(2) require of a company with profit in both classes of hydrocarbon tax rate?",
 "A separate assessable profit for each of the two s.267 classes",
 ["One profit, taxed at the average of 30 and 15 percent",
  "15 percent profits set against 30 percent losses",
  "Separate profits for each terrain the company works in"],
 "Section 265(2) reads: \"(2) The assessable profit shall be determined separately for each of the two classes of chargeable tax identified in section 267 (a) and (b).\" The Nigeria Tax Act 2025 repeats it at s.70(2). There is no averaged rate, and keeping the classes apart means a loss in one is relieved in that class. The text separates by class of rate; terrain is a different axis.")

q(3, "A new-acreage petroleum mining lease onshore is run with no pia_new_pml_hct_rate_pct. What does the engine return?",
 "A refusal asking for the rate to be set to 15 or 30",
 ["Tax at 30 percent, the engine's default, with a note naming s.267(a)",
  "A result at 15 percent, the rate s.267(b) gives to every onshore lease",
  "The ledger, with the tax left blank and a note in kpis.pia_notes"],
 "The engine's own words: \"A new-acreage petroleum mining lease onshore or in shallow water needs pia_new_pml_hct_rate_pct set to 15 or 30; got null.\" The text does not say which class such a lease falls in, so the rate is a stated input with no default, and a run without it is a thrown error. There is no default of 30 or of 15, and a refusal returns no ledger, blank or otherwise.")

q(2, "The engine is given pia_new_pml_hct_rate_pct 20 on a new-acreage onshore lease. How does it respond?",
 "It refuses with the same message, ending \"got 20.\"",
 ["Runs at 20 percent and names the stated rate in a note",
  "It rounds 20 to the nearest printed rate, 15, and carries on with that rate for every year of the ledger",
  "Accepted as an override, since any stated rate from 0 to 100 runs"],
 "Only the two rates the text prints are accepted for the open reading, so 20 is refused with the same message as a missing rate, reading \"got 20.\" where the other reads \"got null.\" The engine never rounds a stated rate. The 0 to 100 range belongs to a different input, pia_hct_rate_override_pct, and the new-lease reading is not that input.")

q(0, "The Ekene new onshore lease is run under both stated readings. Which 2026 figure differs between the two runs?",
 "The hydrocarbon tax: 22711732.336957 stated 15 and 45423464.673913 stated 30",
 ["The chargeable profit, which the stated rate reaches through the cost price ratio",
  "Companies income tax, lower under the stated 30 because it deducts the larger tax",
  "The production allowance, which is larger under the stated 15"],
 "The stated rate moves the hydrocarbon tax line and nothing else: the 2026 chargeable profit is 151411548.913043 and companies income tax 50223464.673913 under both readings. The cost price ratio reads no rate. Companies income tax does not deduct the hydrocarbon tax (s.302(5)), so it is the same under both. The production allowance depends on lease status, terrain, price and cumulative barrels, none of which the rate touches.")

q(1, "A learner types pia_gas_in_country_share_pct 120 into a ledger. What does the engine do?",
 "It refuses: \"pia_gas_in_country_share_pct must be a number from 0 to 100; got 120.\"",
 ["It caps the share at 100 and prices all the gas at the 2.5 percent in-country rate",
  "It reads the extra 20 as export gas and charges it the 5 percent royalty, with a note",
  "It runs and applies a gas rate below 0.025000"],
 "The in-country share is a stated input from 0 to 100, and 120 is refused in the engine's own words. The engine never caps or reinterprets a stated input; the fix is in the terms. At 100 the run is accepted and every unit of gas pays 0.025000, the floor of the blend, so no rate below it is possible.")

emit(Q, '/root/cat-wip-pia/banks/ec7i_m02.json', expect_n=15)
finish()
