import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC8 Expert final exam, 42 questions across the tier's six modules and the
# lower tiers' material it reads back: prices and their timing terms, the two
# Ekene ledgers and their money, the Nigerian domestic rules, the sources and
# their editions, the caps and the conventions. Every key is an engine return
# or a digest line. No reading is keyed as the law, no key is a reported
# domestic base price, and no question near-duplicates a module question.

K = [2, 0, 3, 1, 0, 2, 1, 3, 3, 0, 2, 1, 0, 3, 2, 2, 1, 0, 3, 1, 0,
     2, 3, 1, 1, 0, 2, 3, 0, 3, 2, 1, 0, 2, 3, 0, 1, 2, 3, 1, 0, 2]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("OIES Paper NG 175 (2022) describes a hub-indexed price, CSP = 1.15 x HH + Xy. The course's golden hub case prices 1.15 x hh + 2.25. What does the engine return for a month with hh at 3?",
 "5.700000",
 ["5.125000, the golden price for hh at 2.5",
  "6.275000, the price one half-dollar of hh higher",
  "6.850000, the golden price for hh at 4"],
 "On the golden hub case the engine prices hh 2.5 at 5.125000, hh 3 at 5.700000, hh 3.5 at 6.275000 and hh 4 at 6.850000: 1.15 x 3 + 2.25 = 5.700000. The adder is added once to the multiplied index.")

# 2
x("From which text does this course read the S-curve and the price reopener as concepts?",
 "CLDP and US DOE, Understanding Natural Gas and LNG Options, in its edition current as of October 2017",
 ["The AIPN model gas sales agreement, quoted clause by clause under its licence",
  "HMRC Oil Taxation Manual OT05435",
  "The Petroleum Industry Act 2021, whose s.167 sets the S-curve for gas sold to the power sector"],
 "The course's sources table lists CLDP and US DOE (edition current as of October 2017, read 2026-09-26) for the glossary and for the S-curve and the price reopener as concept; the Energy Charter Secretariat's Figure 51 supplies a published curve to run. The AIPN text is licensed and never quoted; OT05435 describes make-up orders; and s.167 sets domestic prices, with no S-curve.")

# 3
x("The export feed's take-or-pay price is the annual average of the monthly contract prices, Article 15.2.6 Alternative 1 of the Commonwealth model agreement (2025). For 2029, what is it, and what would Alternative 2 give?",
 "9.808450; Alternative 2, the last month's price, would give 10.674000",
 ["10.674000; Alternative 2 would give the annual average of 9.808450",
  "9.808450 under either alternative, the two being printed alike",
  "10.645100, the 2030 average, since a take-or-pay price is set on the following year's prices"],
 "priceSeries returns both annual figures for every year: in 2029 the arithmetic average of the monthly prices is 9.808450 (Alternative 1, which the fixture states) and the last month's price is 10.674000 (Alternative 2). The two alternatives differ in 2029, and the take-or-pay price is that contract year's own.")

# 4
x("The export feed (synthetic) takes make-up gas at 10 percent of the contract price. What make-up price does its 2029 row carry?",
 "0.980845",
 ["9.808450, make-up being priced like any other gas of the year",
  "0.000000, since the make-up was paid for in its deficiency year",
  "1.064510, the make-up price of the year in which the make-up is taken"],
 "The fixture's make-up price is 10 percent of each year's contract price, and 2029's contract price is 9.808450, so the row carries 0.980845. 9.808450 is the full contract price; 0.000000 is the power plant's make-up price, a different agreement; and 1.064510 is the 2030 make-up price, a different row.")

# 5
x("In 2033 the export buyer takes 576600.000000 of make-up at that year's make-up price of 1.021130. What make-up line does gsaCashFlows print for 2033?",
 "588783.558000",
 ["559064.334000, the make-up line of 2036",
  "0.000000, the gas having been paid for in 2032",
  "576600.000000, the quantity booked at one dollar"],
 "The make-up line is make-up taken at the make-up price: 576600.000000 x 1.021130 = 588783.558000. 559064.334000 is the 2036 line; the export feed prices make-up at 10 percent of the contract price, so it earns revenue although paid for in 2032; and the quantity is no money figure.")

# 6
x("What is the export feed's NPV of the net after royalty, and on which terms?",
 "1,099,781,259.486489, at 0.1 to 2026 with year-end flows",
 ["1,157,367,784.116539, at 0.1 to 2026, the royalty being charged before discounting starts",
  "1,883,223,633.172000, undiscounted",
  "1,099,781,259.486489, discounted to 2027, the first contract year"],
 "gsaCashFlows returns the NPV of the net after royalty, 1,099,781,259.486489, through the canonical npv at 0.1 to 2026, year-end flows. 1,157,367,784.116539 is the NPV of the seller revenue, before royalty; 1,883,223,633.172000 is the ledger's undiscounted total; and the base year stated is 2026.")

# 7
x("On the power plant ledger, why does 210000.000000 of the 2028 make-up expire at the end of 2031?",
 "2031 is 2028 plus the 3-year make-up period, the last year that entry can be taken",
 ["The end of term arrives in 2031",
  "The buyer took exactly the Adjusted ACQ in 2031, which cancels the entry",
  "Make-up expires once the aggregate has been drawn twice, as it was in 2029 and 2031"],
 "The make-up period of 3 contract years after 2028 runs to the end of 2031; 268800.000000 is taken in 2031 and the remaining 210000.000000 expires at its end, the last year of its period. The power plant's term runs to 2034, it took 7933800.000000 in 2031 (above the Adjusted ACQ), and no rule counts draws.")

# 8
x("A contract states a make-up period of 0 years. In 2027 it leaves a deficiency of 200.000000, paid at 3. What does the engine return?",
 "A payment of 600.000000, with no make-up right",
 ["A payment of 600.000000 and a make-up right to the end of 2027 itself",
  "No payment, since a deficiency with no make-up right cannot be charged",
  "A refusal of the period"],
 "The reason reads \"the make-up period is 0 years, so no make-up right arises\", and the deficiency payment is 200 x 3 = 600. The period may be 0 (the refusal names only a fraction, 1.5, which must be an integer at or above 0); a right cannot run inside its own deficiency year; and the payment stands with or without a right.")

# 9
x("On the export ledger, what happens in 2031 to the surplus the buyer took in 2028?",
 "694050.000000 of it expires unused at the end of 2031, its 3-year carry-forward period over",
 ["It is refunded to the buyer at the 2031 take-or-pay price",
  "All 1613800.000000 of it is credited against the 2031 deficiency",
  "It is turned into make-up and is taken under after-top-quantity"],
 "The 2028 surplus of 1613800.000000 was carried forward to the end of 2031; part of it was credited in 2029, and the reason reads \"carry-forward of 694050 from 2028 expired unused at the end of 2031\". 2031 has no deficiency (the buyer took 23915000.000000), a carry-forward surplus is never refunded, and it never becomes make-up.")

# 10
x("On the export ledger in 2032, a deficiency of 1153200.000000 meets 1823750.000000 of carry-forward available. What credit is applied, and what is paid?",
 "A credit of 576600.000000, leaving a deficiency payment of 4472628.540000 at 7.756900",
 ["A credit of 1153200.000000, the whole deficiency, leaving no deficiency payment for 2032",
  "A credit of 1823750.000000, all that is available, with the excess carried on to 2033",
  "No credit, 2032's surplus being older than its carry-forward period of 3 contract years"],
 "The cap is 50 percent of the year's deficiency, so the credit is 576600.000000 even though more is available; 576600.000000 is paid at 7.756900, 4472628.540000, and opens make-up of the same size. A full credit ignores the cap; a credit cannot exceed the deficiency; and the 2031 surplus drawn here is inside its period.")

# 11
x("The export buyer's 2035 take of 18396000.000000 leaves a deficiency of 2299500.000000. What deficiency payment does the engine compute?",
 "9081070.425000, on the 1149750.000000 left after a capped credit, at 7.898300",
 ["A payment on the whole deficiency at 7.898300, with no credit applied at all",
  "9081070.425000 on the whole deficiency at the 2035 make-up price",
  "Nothing, the surpluses of 2033 and 2034 being credited against the whole deficiency in full"],
 "The reason reads that a carry-forward credit of 1149750 (at most 50% of the deficiency, first in first out: 1149750 from 2033) leaves 1149750, paid at 7.8983 = 9081070.425. The cap stops the credit covering the whole deficiency, and the take-or-pay price is the contract year's price, which is ten times the make-up price.")

# 12
x("In 2027 the export buyer takes 22995000.000000 against a take-or-pay quantity of 20695500.000000. What does the engine record?",
 "A surplus of 2299500.000000, carried forward to the end of 2030",
 ["A make-up entry of 2299500.000000",
  "A surplus of 2299500.000000 carried to the end of 2032",
  "No surplus, carry-forward being measured above the Adjusted ACQ of 22995000.000000"],
 "The export feed's carry-forward base is the take-or-pay quantity, with a period of 3 contract years, and the reason reads \"22995000 counted exceeds the take-or-pay quantity 20695500 by 2299500, carried forward to the end of 2030\". Make-up comes only from a deficiency paid; the period is 3 years and not 5; and the base stated is the take-or-pay quantity.")

# 13
x("Two golden cases differ only in their carry-forward base. In 2027 each counts 1100.000000 against an Adjusted ACQ of 1000.000000 and a take-or-pay quantity of 800.000000. What surplus does each record?",
 "100.000000 on the Adjusted ACQ base and 300.000000 on the take-or-pay quantity base",
 ["300.000000 under both bases, since a surplus is always measured above the take-or-pay quantity",
  "100.000000 above the Adjusted ACQ, 200.000000 above the take-or-pay quantity, the cap halving it",
  "Nothing under either base"],
 "The carry-forward base is a stated term: counted less the base, strictly above it. 1100.000000 - 1000.000000 = 100.000000 and 1100.000000 - 800.000000 = 300.000000. Both golden cases state a cap of 100 percent, and a cap limits the credit against a deficiency and leaves the surplus alone; surpluses arise in any year.")

# 14
x("A golden ledger states no carry-forward right. In 2029 it counts 700.000000 against a take-or-pay quantity of 800.000000, after surplus takes in 2027 and 2028. What does the engine do?",
 "It pays the whole deficiency of 100.000000 at 3, crediting nothing",
 ["It credits the earlier surpluses first, carry-forward being on by default in the engine",
  "It refuses the call until a carry-forward block is stated",
  "It credits half the earlier surplus, the model agreement's default cap on carry-forward"],
 "With no carry-forward stated the engine's basis reads \"off (no carry-forward right stated)\" and the reason reads that the deficiency payment is 100 x 3 = 300. Carry-forward is an explicit option, off unless stated; its absence is no refusal, since it is optional; and a cap applies only where a contract states one.")

# 15
x("The Ekene power plant's 2028 obligation (synthetic allocation) is 6825000.000000 MMBtu and it delivers 5460000.000000, with 688800.000000 excused because the purchaser could not accept. What does domesticGasObligation return?",
 "676200.000000 penalised at 3.500000, a penalty of 2366700.000000",
 ["1365000.000000 penalised at 3.500000, excuses reported beside the penalty",
  "2366700.000000 excused and nothing penalised, a plant outage being force majeure",
  "676200.000000 at 1.250000"],
 "The undelivered quantity is 1365000.000000; the s.110(10)(b) excuse applies up to it, 688800.000000, and 676200.000000 is penalised at the US$3.50 of s.110(8) and r.6(1): 2366700.000000, with the export restriction reported and given no price. Excuses reduce the penalised quantity; the stated cause is (b), a purchaser that cannot accept; and the seller shortfall price belongs to the gas sales agreement.")

# 16
x("A golden obligation of 1000.000000 is met with 500.000000 delivered and four excuses stated: non-payment 100, force majeure 150, cannot accept 50 and transport 25. What is penalised?",
 "175.000000, a penalty of 612.500000",
 ["500.000000, excuses being reported only",
  "400.000000, with only the first excuse applied",
  "Nothing, since four stated excuses clear the whole undelivered quantity"],
 "The excuses apply in the order of s.110(10), (a) force majeure 150, (b) cannot accept 50, (c) transport 25, (d) non-payment 100, each up to what is left: 325.000000 excused, 175.000000 penalised at 3.5 per MMBtu, 612.500000. Together they cover 325 of the 500 undelivered, and all four apply.")

# 17
x("A signed agreement with a wholesale supplier of the strategic sectors states a penalty rate of 2 per MMBtu. What rate does the engine apply?",
 "3.500000, the minimum of r.6(2) lifting the agreement's rate",
 ["2 per MMBtu, s.110(8) making the agreement's rate govern",
  "5.000000, the rate of a different golden agreement",
  "4.250000, as adjusted by the Commission by regulation under s.110(9)"],
 "S.110(8) lets the agreement state the penalty, and r.6(2) of the DGDO Regulations 2022 sets it at not less than the US$3.50 of r.6(1); the basis reads \"the agreement's rate 2 per MMBtu is below the US$3.50 minimum of r.6(2), so 3.5 applies\". 5.000000 applies only where the agreement states 5, and 4.250000 is an illustrative synthetic adjusted rate.")

# 18
x("A lessee's voluntary contracts with the strategic sectors equal its obligation of 1000.000000 exactly, though it delivers 200.000000. What does the engine return?",
 "Deemed fulfilled, with no penalty",
 ["800.000000 undelivered and penalised at 3.500000, deemed fulfilment needing contracts strictly above the obligation",
  "Deemed fulfilled only for the 200.000000 delivered, the other 800.000000 being penalised",
  "A refusal, since voluntary contracts may not be stated beside a delivered quantity"],
 "S.110(2) deems a lessee whose voluntary contracts are \"equal to or higher than\" its obligation to have fulfilled it, and the engine's boundary is inclusive: deemed fulfilled, penalty 0.000000. One short (999.000000) is not, and gives 800.000000 penalised, 2800.000000. Deemed fulfilment is all or nothing, and the call states both quantities as inputs.")

# 19
x("For urea at a stated CMPP of 600.000000, the Fourth Schedule formula gives 2.4. With the reported 2026 domestic base price stated at 2.180000, what price does domesticPrice return?",
 "The domestic base price stated in the call, the s.168(3) ceiling",
 ["2.400000, the formula price, since the Fourth Schedule sets no ceiling",
  "2.680000 on the reported base, the commercial sector price as a ceiling",
  "0.900000, the floor, the formula price being outside the band"],
 "EPF = (600 - 250) / 250 = 1.400000, so CP = 1 x (1 + 1.400000) = 2.4, above the ceiling of the domestic base price (s.168(3)), so the reason reads that the price is held at 2.18, the reported base price stated in the call. The commercial price caps gas distributors (s.167(7)); the floor holds prices below 0.9; and the ceiling applies before the floor.")

# 20
x("For urea at a stated CMPP of 200.000000, what does the engine's reason say about the gas based industries price?",
 "The formula gives 0.8, below the floor, so the price is held at 0.9 (s.168(2))",
 ["The formula gives 0.8 and is returned as it stands, the floor applying only to ammonia",
  "The call is refused, a CMPP below the product reference price of 250 being invalid",
  "The price falls to zero"],
 "EPF = (200 - 250) / 250, which is -0.200000, and CP = 0.8; the floor of US$0.90 per MMBtu of s.168(2) holds it at 0.9. The floor applies to every gas based industry; a CMPP below the PRP is a stated input and a result (even a CMPP of 0 is held at the floor); and nothing goes to zero.")

# 21
x("A gas distributor states a negotiated price of 2.900000 on the reported 2026 base. What does domesticPrice do?",
 "Returns 2.900000 with a reason that it exceeds the commercial price 2.68, the s.167(7) ceiling, on the reported base",
 ["Cuts the price to 2.680000 on the reported base, the commercial sector price",
  "Refuses the call",
  "Returns 2.180000 on the reported base, the power sector price, in place of any negotiated one"],
 "The engine returns the negotiated 2.900000 with the reason \"negotiated price 2.9 exceeds the commercial sector price 2.68, which s.167(7) sets as the ceiling for gas distributors\": a result with a reason. It changes no stated price, refuses nothing here, and substitutes no sector price; the reported base is a stated input.")

# 22
x("The Fourth Schedule's gazetted table heads its NRP column \"US $/mmbtu\" with \"Net of transport Tariff US $/Kcf\" beneath. How does the engine hold NRP?",
 "In US$ per MMBtu, as the formula above the table states",
 ["In US$ per Kcf, as the second header line states",
  "In both units, converting between them at 1050 Btu/scf",
  "As a stated input with no default, since the header is ambiguous"],
 "The course notes the header's quirk and reads the formula: NRP is US$1 per MMBtu, and the engine holds NRP in US$ per MMBtu (1.000000 for every product). It converts nothing through a heating value, and it holds the Schedule's values in PIA_GAS.gbiProducts while still letting a stated schedule override them.")

# 23
x("The golden net case (1.000000 MMSm3 at 35.100000 MJ/Sm3 net) is run again with its basis stated as gross. What does toEnergy return?",
 "33268.380923 MMBtu, labelled gross",
 ["36964.867692 MMBtu, the gross case's energy, the engine converting net to gross first",
  "33268.380923 MMBtu, still labelled net, the engine correcting the stated basis",
  "A refusal, as a net figure cannot be labelled gross"],
 "The engine does the same arithmetic on a gross and a net heating value and carries the stated basis as a label: the label changes and the arithmetic does not, 33268.380923 MMBtu labelled gross. 36964.867692 is the golden gross case at 39.000000 MJ/Sm3; the engine converts no basis and corrects no label; and both bases are accepted.")

# 24
x("How does the course name the Domestic Gas Delivery Obligation Regulations 2022?",
 "S.I. No. 74 of 2022, Official Gazette No. 206, Vol. 109, 23 November 2022, made and commenced 18 November 2022",
 ["S.I. No. 74 of 2022, in force from the Act's effective date of 27 August 2021",
  "Official Gazette No. 142, Vol. 108",
  "An unnumbered and undated copy on the regulator's gazetted page, read on 2026-09-26"],
 "Every text is named with its edition and the date it was read, here 2026-09-26. Gazette No. 142, Vol. 108, 27 August 2021 is the Petroleum Industry Act 2021 itself, and the unnumbered and undated copy is the 2023 flaring Regulations.")

# 25
x("Which edition of the HMRC Oil Taxation Manual pages does the course read, and under what licence?",
 "OT05435 and OT05402, both updated 19 December 2019, under the Open Government Licence",
 ["OT05435 and OT05402 in the 2007 edition, licensed under Creative Commons Attribution 4.0",
  "OT05402 only, in its January 1993 edition",
  "The pages current on 2026-09-26, with no licence stated"],
 "The sources table lists HMRC Oil Taxation Manual OT05435 and OT05402, both updated 19 December 2019, Open Government Licence, read 2026-09-26. 2007 is the Energy Charter Secretariat's report and CC BY 4.0 the Commonwealth model's licence; January 1993 is ESMAP Report 152/93.")

# 26
x("What does the engine import from engines/economics/cashflow.ts, and what else does it import?",
 "npv, deriveGasRoyaltyRate and calendarDays, and nothing else",
 ["npv alone, the royalty rate and day counts being coded inside the engine",
  "npv and a Monte Carlo sampler for index scenarios",
  "Nothing; it restates the NPV in its own code"],
 "The engine imports npv, deriveGasRoyaltyRate and calendarDays from cashflow.ts and nothing else, and makes no network call. It carries no NPV, Monte Carlo or royalty code of its own, and nothing in it samples.")

# 27
x("How many refusals does the course table, across how many of the engine's functions?",
 "84 refusals across 9 functions",
 ["84 refusals across 13 exported names",
  "58 refusals, one for each provision",
  "18 refusals across 9 functions, the count held by priceSeries"],
 "The refusal table holds 84 refusals across the 9 functions, from toEnergy's 8 to priceSeries's 18. The engine exports 13 names, 4 of them constants; 58 is the count of quoted provisions; and 18 is the count for priceSeries alone.")

# 28
x("A contract grants the seller a delivery tolerance of 5.000000 on a DCQ of 100.000000. On one golden day the seller offers 94.000000 against a full nomination, and the buyer takes all of it. What comes back?",
 "Seller shortfall 1.000000, adjusted DCQ 99.000000, buyer shortfall 5.000000",
 ["Seller shortfall 6.000000, the tolerance applying only to the buyer's takes",
  "No seller shortfall, a gap within twice the tolerance being covered",
  "Seller shortfall 1.000000 and no buyer shortfall, the buyer having taken every unit offered"],
 "The rule is seller shortfall = (PNQ - tolerance) - available: (100 - 5) - 94 = 1.000000. The adjusted DCQ is 100.000000 - 1.000000 = 99.000000, and 94.000000 taken leaves a buyer shortfall of 5.000000. At 95.000000 made available the gap would be covered exactly; one unit less gives 1.000000. Taking all gas offered does not meet the adjusted DCQ.")

# 29
x("A basket formula weights 11 indices. What does the engine do?",
 "It refuses: formula.weights must have at most 10 indices",
 ["Ten weights priced, one dropped",
  "It prices all 11, the cap on indices applying only to hub-indexed formulas",
  "It refuses because the weights must sum to 1 within 1e-9, which 11 weights never can"],
 "DEFAULTS.MAX_INDICES is 10, and the engine's message reads \"formula.weights must have at most 10 indices; got 11\". It drops nothing, the cap binds basket formulas, and eleven weights can sum to 1 within the stated tolerance of 1e-9 as well as ten can.")

# 30
x("What does DEFAULTS.PRICE_DIGITS, 12, set?",
 "The significant digits a price is normalised to before the four-decimal rule reads its fifth decimal",
 ["The number of decimals every price prints to",
  "The months of index history the engine keeps",
  "The most indices a basket formula may weight"],
 "PRICE_DIGITS is the engine convention that normalises the double to 12 significant digits before the model agreement's four-decimal rule decides; that is why 11.234346 prices 11.234300. The course prints prices to six decimals, the month cap is MAX_MONTHS at 1200, and the index cap is MAX_INDICES at 10.")

# 31
x("On 2027-01-20 the power plant's buyer properly nominates 22050.000000 and the seller makes 15750.000000 available, all of it taken. What does the day's row show?",
 "Seller shortfall 6300.000000, adjusted DCQ 14700.000000, over-take 1050.000000",
 ["Seller shortfall 6300.000000 and a buyer shortfall of 6300.000000, the buyer having taken less than the DCQ",
  "Seller shortfall 1050.000000, with the over-take netted against it",
  "No seller shortfall, the gas made available having been taken in full"],
 "The seller shortfall is measured against the properly nominated quantity: 22050.000000 - 15750.000000 = 6300.000000. The adjusted DCQ is 21000.000000 - 6300.000000 = 14700.000000, and the 15750.000000 taken is 1050.000000 over it. The DCQ is not the benchmark for a seller shortfall, and the seller's gap is no buyer shortfall.")

# 32
x("For the power plant's January 2027, buyer shortfall less over-take and Adjusted ACQ less taken are both computed. What does the course say of them?",
 "Both are 24740.000000, and they are keyed as equal because the engine's identity was checked exactly",
 ["They print alike at six decimals but must never be called equal, as printed alike is not equal",
  "31270.000000 and 24740.000000, the identity failing by the over-take",
  "24740.000000 and 592200.000000"],
 "The identity sum of buyer shortfall - sum of over-take = Adjusted ACQ - taken holds on the month: 31270.000000 - 6530.000000 = 24740.000000 and 592200.000000 - 567460.000000 = 24740.000000, and the course checks the two are equal exactly. Printed alike is keyed as equal only where the engine returns them equal, which is this case.")

# 33
x("At the end of the power plant's term in 2034, what happens to the make-up opened in 2033?",
 "105000.000000 is taken in 2034 and 252000.000000 is forfeited",
 ["All 357000.000000 is refunded to the buyer at the 2034 take-or-pay price",
  "It stays open to the end of 2036",
  "252000.000000 is taken and 105000.000000 forfeited"],
 "The 2033 deficiency of 357000.000000 opened make-up; the buyer takes 105000.000000 in 2034, and the power plant's end-of-term rule is forfeit, so the reason reads \"the delivery period ends with make-up of 252000 unrecovered; the buyer forfeits it\". Refund is the export feed's rule; a period cannot outlast the delivery period; and the figures are the other way round.")

# 34
x("A golden price escalates from 2 at 2027-04 by 2.5 percent a year. In which month does it first move, and to what?",
 "2028-04, to 2.050000",
 ["2027-05, a month after the base month",
  "2028-01, to 2.050000 on the new calendar year",
  "2027-04 itself, to 2.050000"],
 "Escalation steps in whole years on each anniversary of the base month: 2.000000 through 2028-03 and 2.050000 from 2028-04, so 2028 averages 2.037500. No monthly step occurs, the calendar year does not set the step, and the base month carries the base price.")

# 35
x("On a golden basket priced 5 x the sum of weight x index / base, weights fo 0.6 and cpi 0.4 on bases of 400 and 100, the averaged indices for 2026-01 are fo 400.000000 and cpi 101.500000, with an fo index floor of 410. What does the engine hold and price?",
 "fo held at 410.000000, pricing 5.105000",
 ["fo left at 400.000000, pricing 5.030000, the floor applying to prices",
  "fo held at 410.000000, pricing 5.030000, the held index being reported only",
  "A price floor of 5.085000"],
 "Article 15.8 Alternative 1 floors and ceilings apply per index: the fo average of 400.000000 is below its floor of 410, so it is held at 410.000000 and the price is 5.105000; the same month without index floors prices 5.030000. The held index enters the price, and no price floor is stated.")

# 36
x("A golden formula 1 + 0.1 x oil averages 1 month with a lag of 3. Which window prices 2025-04, and at what price?",
 "2025-01 alone, pricing 7.000000",
 ["2025-04 alone, pricing 7.600000",
  "2025-01 to 2025-03, averaging 62.000000 and pricing 7.200000",
  "2025-03 alone, pricing 7.400000"],
 "One month of averaging ending 3 months before April is January: oil 60 gives 1 + 0.1 x 60 = 7.000000. A lag of zero would read April itself; averaging 3 months is a different term; and a lag of 1 would read March.")

# 37
x("By the course's rule that a figure is quoted with the terms it depends on, which terms go beside a make-up quantity?",
 "Its recovery order and make-up period",
 ["Its take-or-pay price and percentage, the terms of the year that opened it",
  "Its formula, averaging, lag and reset",
  "Its discount rate and base year, since make-up is money received later"],
 "The vocabulary rule reads: a deficiency payment with its take-or-pay percentage and price; a make-up quantity with its order and period; a price with its formula, averaging, lag and reset; an NPV with its rate and base year.")

# 38
x("The power plant's 2027 carries a seller shortfall of 6300.000000, with damages at a stated 1.25 US$ per MMBtu (a synthetic contract term). What does the ledger do with it, and what if the rate were left out?",
 "Damages of 7875.000000 paid to the buyer; left out, the rate would be refused, the engine holding no default",
 ["Damages of 7875.000000 paid to the seller; left out, the rate would default to the take-or-pay price",
  "The quantity is excused as force majeure and no damages are due",
  "Damages of 7875.000000 paid to the buyer; left out, the engine would use US$3.50 per MMBtu"],
 "The reason reads \"seller shortfall 6300 reduces the Adjusted ACQ and is paid to the buyer at 1.25: 7875\". A seller shortfall above 0 with no shortfallPrice is refused by name (the engine holds no default rate). The damages flow to the buyer; a seller shortfall is no force majeure; and US$3.50 is the obligation penalty of the Act.")

# 39
x("What Adjusted ACQ and take-or-pay quantity does the power plant ledger return for 2027?",
 "7616700.000000 and 6093360.000000",
 ["7665000.000000 and 6132000.000000, the full ACQ and 80 percent of it",
  "7665000.000000 and 6093360.000000",
  "7616700.000000 and 6132000.000000"],
 "The Adjusted ACQ is the ACQ less force majeure of 42000.000000 and seller shortfall of 6300.000000: 7665000.000000 - 48300.000000 = 7616700.000000, and 80 percent of it is 6093360.000000. The take-or-pay percentage applies to the Adjusted ACQ, and both reductions come off before it.")

# 40
x("Buyer force majeure of 1260000.000000 falls in the export feed's 2030. What take-or-pay quantity and make-up does the ledger return?",
 "A take-or-pay quantity of 19561500.000000, and 1823500.000000 of make-up taken",
 ["A take-or-pay quantity of 20695500.000000, force majeure being reported only",
  "A take-or-pay quantity of 19561500.000000 and no make-up",
  "A deficiency of 1260000.000000, excused and unpaid"],
 "Force majeure comes off the ACQ before the percentage applies: (22995000.000000 - 1260000.000000) x 90 percent = 19561500.000000. Under after-top-quantity everything the buyer takes above it, 21385000.000000 - 19561500.000000 = 1823500.000000, is make-up. The year has no deficiency.")

# 41
x("The buyer's nomination for 2027-01-05 is zero, and no force majeure, maintenance or buyer-caused flag is stated. What does the daily balance book?",
 "A buyer shortfall of 21000.000000, the whole adjusted DCQ",
 ["Nothing for the day, since a zero nomination leaves nothing owed either way",
  "A seller shortfall of 21000.000000",
  "A buyer shortfall of 23100.000000, the MaxDCQ"],
 "The reason reads \"zero nomination; the whole adjusted DCQ 21000 is a buyer shortfall for the day\". Nothing is owed only when force majeure and maintenance cover the whole DCQ, as on 2027-01-12. The seller was asked for nothing, and the benchmark is the adjusted DCQ.")

# 42
x("A contract year stated as the period 2027-07-01 to 2028-01-01 at a DCQ of 63000.000000 is run through contractQuantities. What day count and ACQ come back?",
 "184 days, an ACQ of 11592000.000000",
 ["184 days, an ACQ of 22995000.000000, the full-year figure",
  "365 days, a calendar year being assumed",
  "366 days, 2028 being a leap year"],
 "A period excludes its end date, as a contract year that finishes on the following first of January: 2027-07-01 up to 2028-01-01 is 184 days, and 63000.000000 x 184 = 11592000.000000. 22995000.000000 is the ACQ of the period 2027-01-01 to 2028-01-01, and the period contains no day of 2028.")

emit(Q, '/root/cat-wip-gsa/banks/ec8a_exam.json', expect_n=42)
finish()
