import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC7 Professional m06, The Professional Reading.
# Every figure is quoted from digest.txt. The method of the tier's capstone is
# taught on the Ekene cases only: no capstone name, term, row or value.
# The royalty by price is quoted on the Regulations base, the engine default.

q(1, "Reading one year of hydrocarbon tax, the course puts four questions before the rate: the scope, the royalty rate, the cap, and the allowances. Why does the rate come last?",
 "The rate acts on a chargeable profit the other four steps have already settled",
 ["Only the rate can move under a stated reading, so the course keys it from the reading it prefers",
  "Its value is read from the cap, which must be known first",
  "It is the first line the engine computes"],
 "The base (scope, royalty, cap, allowances) sets the chargeable profit and the s.267 rate is applied to it, so once the base is traced the tax is the rate on it. A stated reading can move the rate on a new-acreage lease, and the course keys neither reading. The cost price ratio reads revenue and costs; it has nothing to do with the rate. The engine applies the rate at the end of the base and at no earlier point.")

q(3, "On the worked example inputs the hydrocarbon tax assessable profit is 1,058,241,648.189209 and the chargeable profit 952616648.189209. What comes off between the two?",
 "The capital allowance and the production allowance",
 ["The royalties and HCDT, which the Act deducts only at the chargeable step",
  "Companies income tax",
  "The NDDC levy and the carried cost, deducted once the cap is known"],
 "The step from assessable to chargeable profit deducts the capital allowance the cap let through (60000000.000000) and the production allowance (45625000.000000). Royalties, HCDT and the NDDC levy come off before the assessable profit. Section 264(l) bars companies income tax from the hydrocarbon tax base at every step. There is no carried cost on this year, since the cap does not bind.")

q(2, "The worked example's hydrocarbon tax is 285784994.456763 at a rate of 0.300000. Which provision puts that rate on the line?",
 "PIA s.267(a), for a converted lease in shallow water",
 ["PIA s.267(b), which names onshore and shallow water in its opening words",
  "A stated reading, since every shallow water lease rate is open",
  "Seventh Schedule para 10(2)(b)"],
 "Section 267(a) gives 30 percent to petroleum mining leases selected under s.93(6)(b) and (7)(b), the converted producing areas, onshore and in shallow water; the worked example is a converted lease. Section 267(b) is the 15 percent class. The open reading covers leases granted out of new acreage, and this lease is converted, so nothing on the rate line is a stated reading. Para 10(2)(b) sets the 12.5 percent shallow water royalty.")

q(0, "On the worked example the cost price ratio cap is 949000000.000000 and the claim 242500000.000000. What does that mean for the carry and the forfeiture?",
 "Nothing is carried to a later year and nothing can be forfeited when the ledger ends",
 ["Unused room under the cap, carried forward",
  "Forfeiture of the difference at cessation",
  "A quarter of the cap is carried"],
 "The claim is far below the cap, so the whole pool is claimed; a carry exists only when the pool exceeds the cap, and forfeiture can only take cost that is still carried. Unused room under the cap is not a cost and is never carried or forfeited. No rule carries a share of the cap.")

q(0, "The worked example charges a royalty by price in 2025 at 80 USD/bbl. On which base does the engine charge it, and at what rate?",
 "0.023910, on the Petroleum Royalty Regulations 2022 base, the engine default",
 ["0.022464, on the Act's own base year of 2020, which the engine applies as the law",
  "0.050000, the middle rate, charged at any price that falls between the two outer benchmarks",
  "0.000000, since royalty by price starts above 100 USD/bbl"],
 "The base year is an open reading: the Petroleum Royalty Regulations 2022 (S.I. No. 73, Official Gazette No. 205, Vol. 109, 22 November 2022) start the benchmarks in 2021 and the Act in 2020. The engine follows the Regulations unless told otherwise and says so in its note; at 80 USD/bbl in 2025 that returns 0.023910. The Act base gives 0.022464 at the same price, and the course grades neither reading against the other. 5 percent is the rate at the middle benchmark only, and the rate is 0 only at or below the low benchmark (54.120000 in 2025 on the Regulations base).")

q(2, "The worked example states the NDDC levy as a fixed sum of 15000000 USD. What does the engine do with the 3 percent of the total annual budget?",
 "The fixed sum replaces the percentage",
 ["Adds the percentage on top of the fixed sum",
  "Whichever of the two is larger is charged",
  "It refuses the case, since the NDDC Act 2000 sets 3 percent and a fixed sum overrides a statutory rate"],
 "When pia_nddc_levy_fixed_usd is given, the fixed sum replaces the percentage, so the 2025 NDDC line is 15000000.000000. The engine never adds the two or takes the larger. The 3 percent of total budget rests on a secondary source, and the fixed sum is a stated alternative the engine accepts.")

q(3, "Companies income tax on the worked example year is 299472494.456763. Which statement about it is right?",
 "It is computed on its own base, with the hydrocarbon tax kept out of it by s.302(5)",
 ["Thirty percent of the hydrocarbon tax chargeable profit, 952616648.189209, the same base the hydrocarbon tax uses",
  "A deduction of the hydrocarbon tax of 285784994.456763 comes first, before its 30 percent rate applies to what is left",
  "It is charged only on the revenue the cost price ratio let through"],
 "Companies income tax reads its own base: every royalty, opex in full, HCDT, the NDDC levy and its own capital allowance, and s.302(5) keeps the hydrocarbon tax out of it. It is not a share of the hydrocarbon tax chargeable profit, which carries the production allowance companies income tax does not have. The cost price ratio does not apply to companies income tax.")

q(1, "Three carries appear in this tier. Which pairing of carry and rule is right?",
 "The cost price ratio carry is capped each year by para 2(2)(b) and forfeited by para 2(2)(c); a loss sits in its own pool under s.265",
 ["A loss is capped each year by para 2(2)(b) and forfeited at cessation; the cost price ratio carry follows s.265",
  "The two thirds carry is forfeited at cessation by para 2(2)(c)",
  "All three share one pool"],
 "The cost price ratio carry holds cost the cap turned away, shares each later year's 65 percent limit under para 2(2)(b), and is forfeited when crude oil operations end under para 2(2)(c): 93000000.000000 on the Ekene CPR case. A loss is a chargeable profit below zero, carried in its own pool for its own tax under s.265. The two thirds carry in companies income tax waits on its own limit, and forfeiture belongs to the cost price ratio alone. The engine keeps every pool apart.")

q(3, "On the Ekene new onshore lease the 2026 chargeable profit is 151411548.913043 under the stated 15 and under the stated 30. What does that show about the system?",
 "The rate and the base are separate",
 ["The two stated readings give the same hydrocarbon tax, so the open question makes no difference to what the lease pays",
  "The chargeable profit is computed after the tax, so both runs share a tax line",
  "The stated reading reaches the base only through the production allowance on the barrels past the cap"],
 "A licence type or a stated reading moves the rate; the royalty, the cap and the allowances move the base. So the chargeable profit is the same under both readings while the tax is 22711732.336957 at the stated 15 and 45423464.673913 at the stated 30. The readings do change the tax. The tax is computed after the chargeable profit. The production allowance depends on lease status and cumulative barrels, which the rate does not touch.")

q(1, "On Ekene Alpha in 2026 the total royalty is 18012822.226867. What is its production royalty on crude oil and condensate alone?",
 "13625099.038462",
 ["18012822.226867, the total royalty the engine prints",
  "4037323.188406, the royalty charged on price",
  "350400.000000, the gas royalty"],
 "The total royalty is the liquids production royalty plus the gas royalty plus the royalty by price (on the Regulations base, the engine default). The part charged at the tranche rate on crude oil and condensate is the liquids production royalty, 13625099.038462. 4037323.188406 is the royalty by price and 350400.000000 the gas royalty; each has its own column. Name the part before reading a royalty.")

q(0, "Ekene Alpha is run at a 50 percent working interest. How does the engine treat the daily rate the royalty tranches read?",
 "It reads the tranches at field level, then scales every money line to the share",
 ["The barrels are halved first, so the daily rate, and with it the tranche rate, both fall below Alpha's full-field figures",
  "Every tranche edge is halved to match the share",
  "It refuses a share below 100 percent"],
 "Under the PIA regime every year runs at 100 percent field level, and then every money line is scaled to the working interest share, so the tranches, the caps and every rate are read at field level. Alpha's total royalties are 79273732.707567 at 100 percent and 39636866.353784 at 50 percent. Halving barrels first would lower the rate, which the engine does not do. Nothing moves the edges, and a share below 100 percent is ordinary.")

q(2, "A hydrocarbon tax figure cannot be traced through the four questions of the Professional reading. Which inputs does the course say are the most likely cause?",
 "The barrels produced before the ledger, or the preceding year's opex",
 ["The discount rate and the escalators",
  "The terrain and the licence type, which the engine reads from the water depth and the lease history",
  "The working interest, which changes the tranche rate"],
 "The course names these two because each carries history the ledger cannot see: pia_prior_cumulative_oil_bbl places a new lease against its allowance cap, and pia_prior_year_opex_usd sets the first year's HCDT. Discounting belongs to the cash flow course and never touches the hydrocarbon tax lines. The engine reads the terrain and licence as stated strings and never reads a water depth. The working interest scales money after the tranches are read at field level.")

q(0, "The worked example has crude oil only. Why does its run carry no note about shared costs?",
 "The note appears only on a ledger with gas production in some year",
 ["It was switched off by the stated NDDC sum",
  "A converted lease allocates costs by the Act",
  "It appears only in a year under the Act alone"],
 "The sharedCosts note appears on a ledger with gas production in some year, because only then does the engine split opex, HCDT, NDDC and the capital allowance by the crude-plus-condensate share. With crude oil only, every shared cost belongs to the tax in full. The NDDC sum, the lease status and the framework of the year do not decide whether the note appears.")

q(3, "On a lease granted out of new acreage onshore, which of these can the course grade?",
 "Its chargeable profit, which the rate leaves alone",
 ["Hydrocarbon tax at the stated 15, the lower of the two readings and the one the text favours",
  "The tax line under the stated 30, the higher of the two readings and the safer choice",
  "An average of the two stated readings' hydrocarbon tax, halfway between them"],
 "The course never grades a figure the stated rate moves. On such a lease a graded figure is one the rate leaves alone: the chargeable profit, the allowances, the cost price ratio lines, companies income tax. Every option naming the hydrocarbon tax depends on the stated reading, whether 15, 30 or a blend, and the text does not favour either reading.")

q(1, "When reading a figure forfeited at cessation, which fact should be read beside it?",
 "The last year of the ledger",
 ["The first year's HCDT",
  "The working interest, which decides whether the carry is forfeited at all or only scaled",
  "The stated new-lease rate"],
 "The engine treats the last year of the ledger as the end of crude oil operations and forfeits the cost still carried then, so a ledger cut short forfeits the carry at the year it stops. HCDT sits outside the cap and plays no part. The working interest scales money after the arithmetic and never decides a forfeiture. The stated rate does not reach the cost price ratio.")

emit(Q, '/root/cat-wip-pia/banks/ec7i_m06.json', expect_n=15)
finish()
