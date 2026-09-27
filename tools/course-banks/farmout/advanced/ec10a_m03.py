import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC10 Expert m03, Pricing an Interest. Every key rests on the engine's
# interestValue return on a golden input (interest-ekene-risked,
# interest-ekene-success-case, interest-psu-10pct, interest-production-metric,
# interest-negative-emv, the refusals) or on a line the digest prints (the
# derived price identity). A transaction ratio is keyed as a ratio of stated
# inputs, reported only. scratch/bank-advanced/witness.mjs recomputes each
# figure. The Ekene Deep prospect and every party are synthetic.

K = [3, 1, 0, 2, 0, 3, 1, 2, 1, 3, 0, 2, 3, 0, 1]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("At a 25.000000 percent chance of success, the Ekene Deep 100 percent position has a risked EMV of 26312584.260452. What risked value per percent of working interest does the engine return?",
 "263125.842605, the 100 percent EMV divided by 100",
 ["2252503.370418, the success-case value less the success well cost, over 100",
  "533333.333333, the stated price of 16000000.000000 divided by 30 percent",
  "7893775.278136, the risked value of the 30 percent working interest priced"],
 "The engine's rule: value per percent = the 100% figure / 100, the risked figure being the EMV of the 100% position. 26312584.260452 / 100 is 263125.842605 (engine). 2252503.370418 is the success-case figure per percent; 533333.333333 is the stated price per percent; 7893775.278136 is the value of 30.000000 percent on the risked basis.")

# 2
x("What does the engine give as the 100 percent success payoff of Ekene Deep in the price view?",
 "225250337.041807, the success-case value 271250337.041807 less the 46000000.000000 success well",
 ["271250337.041807, the canonical npv of the stated net cash flows to 2027 with no well cost taken off",
  "26312584.260452, the risked EMV of the whole prospect at 25.000000 percent",
  "157675235.929265, EKO's success payoff drilling alone with its 70.000000 percent"],
 "The 100 percent position on a success is the success-case value less the success well cost: 271250337.041807 - 46000000.000000 = 225250337.041807 (engine). The npv alone omits the well; 26312584.260452 is the risked EMV of that position, weighing in the dry hole; 157675235.929265 is EKO's 70.000000 percent position in the deal view.")

# 3
x("On interest-ekene-success-case the same 30.000000 percent is priced on the success-case basis. What is the working interest worth, and which per-percent tiles move against the risked call?",
 "67575101.112542; both per-percent figures stay, only the value of the working interest follows the basis",
 ["7893775.278136; the basis only relabels the value the engine already reported on the risked call",
  "67575101.112542; the risked per-percent tile falls to 0.000000 once the success case is chosen",
  "2252503.370418; the value of the working interest is the success-case figure for one percent"],
 "The engine computes both per-percent figures on every call (263125.842605 risked, 2252503.370418 success case), and the stated basis decides which values the working interest: 30.000000 x 2252503.370418 = 67575101.112542 (engine). 7893775.278136 is the risked value; no tile falls to 0; 2252503.370418 is one percent.")

# 4
x("The Ekene price is 16000000.000000 for 30.000000 percent. What ratio does the engine report against the risked value per percent?",
 "2.026914",
 ["0.236774",
  "1.125000",
  "1.333333"],
 "533333.333333 a percent over the risked 263125.842605 is 2.026914 (engine), a ratio of a stated price to a computed value, reported only. 0.236774 is the same price against the success-case value per percent; 1.125000 is the producing interest's ratio; 1.333333 is the promote ratio of the Ekene well, 40 over 30.")

# 5
x("Which statement describes the transaction ratio 2.026914 the way the engine's own metrics line does?",
 "A ratio of stated inputs to a computed value, reported only: no market value is asserted",
 ["The market premium buyers pay for Ekene-type prospects, as a multiple of the risked value",
  "The promote ratio of the Ekene farm-in, the share paid over the working interest earned",
  "A forecast of what a partner will pay, since it rests on the stated chance of success"],
 "The engine's line: transaction metrics are ratios of stated inputs (price, volumes, rates), reported only: no market value is asserted. The course adds that none of its computed figures is a forecast of what a partner will pay or a statement of market value. The promote ratio is a different figure (1.333333 on the Ekene well).")

# 6
x("On interest-negative-emv the risked value per percent is -300000.000000 and a price of 1000000.000000 is stated for 25 percent. What does the engine do with the price-to-value ratio?",
 "Returns none, with a reason naming the value at or below 0",
 ["Refuses transaction.price, since a price above a negative value cannot be stated",
  "Returns 40000.000000 as the ratio, the stated price per percent taken alone",
  "Returns the ratio against the success-case figure of 1600000.000000 in its place"],
 "The engine's reason: stated price 1000000 for 25%: 40000 a percent, 4000000 for 100%; no price-to-value ratio, the risked value per percent being -300000, at or below 0. It still reports the price per percent; it neither refuses the price nor switches to the other basis, and 40000.000000 is the price per percent, which it prints as a price.")

# 7
x("The fixture states 120.000000 MMboe of 2C (contingent, best estimate) for the whole prospect. What price per MMboe does the engine print for the 30.000000 percent working interest?",
 "444444.444444, the price over 36.000000 MMboe net to the working interest",
 ["533333.333333, the stated price per percent of working interest priced",
  "263125.842605, the risked value per percent, read as a price per MMboe",
  "444444.444444, the price over the gross 2C volume after a reserve adjustment"],
 "The volume net to the working interest is 30.000000 percent of 120.000000, 36.000000 MMboe, and the engine divides the stated price by it: 444444.444444 (engine). 533333.333333 is the price per percent and 263125.842605 the risked value per percent, neither of them per MMboe, and the engine applies no reserve adjustment: the category is a stated label.")

# 8
x("interest-production-metric prices a 20.000000 percent working interest in a producing field with a chance of success of 100 and a success well cost of 0. Why do the two per-percent figures agree?",
 "With no dry hole and no well cost the risked EMV equals the success case, both 800000.000000 a percent",
 ["The engine sets both figures to the price per percent when a flowing rate is stated",
  "A producing field is valued on the success-case basis only, so the risked tile copies it",
  "The rate of 1000.000000 boe/d replaces the success-case value in both calculations"],
 "The engine's reason: 100% position: success 80000000 (success-case value 80000000 less the success well cost 0), dry hole 0; risked EMV at 100% 80000000. A chance of 100 leaves no dry hole to weigh, so risked and success case both print 800000.000000 a percent. The price per percent is 900000.000000, and the stated rate only feeds the price per flowing unit.")

# 9
x("An interestValue call states valueBasis \"unrisked\". Which message does the engine return?",
 "valueBasis must be one of \"risked\", \"success-case\"; got \"unrisked\"",
 ["valueBasis is not an accepted key; the accepted keys are project, interestPct, transaction",
  "valueBasis must be \"risked\" when a chance of success below 100 is stated; got \"unrisked\"",
  "interestPct must be a number above 0 and at most 100; got \"unrisked\""],
 "The engine holds no basis of its own and names the two it accepts, in its own words: valueBasis must be one of \"risked\", \"success-case\"; got \"unrisked\". valueBasis is an accepted key; the engine ties no basis to the chance of success; the interestPct message answers a working interest of 0.")

# 10
x("A price call states a transaction with a volume unit of boe and no reserves. What does the engine return?",
 "transaction.volumeUnit must be left out when no reserves are stated; got \"boe\"",
 ["transaction.volumeUnit must be a non-empty string; got nothing",
  "transaction.reserves must have at most 10 entries; got 11",
  "A price per boe of 0.000000, since no volume is stated under the unit"],
 "A unit needs a volume and a volume needs a unit; the engine refuses each half alone. Here the unit arrives without reserves, so the engine's words are: transaction.volumeUnit must be left out when no reserves are stated; got \"boe\". The non-empty-string message answers reserves stated with no unit; the cap of 10 answers eleven categories.")

# 11
x("Take the risked value of the 30.000000 percent working interest, 7893775.278136, less the bonus of 2000000.000000 and the reimbursement of 3600000.000000. Which figure does the course say that gives?",
 "2293775.278136, FIN's EMV in deal-ekene paying 30.000000 percent for 30.000000",
 ["-1806224.721864, FIN's EMV in deal-ekene paying 40.000000 percent for 30.000000",
  "2293775.278136, EKO's EMV gain from farming out on the stated Ekene terms",
  "4293775.278136, FIN's EMV paying its own share with no bonus stated at all"],
 "The digest derives the identity: 7893775.278136 less 2000000.000000 and 3600000.000000 is 2293775.278136, FIN's EMV at the first breakpoint, paying only its own share (engine). -1806224.721864 is FIN at the 40.000000 percent asked; EKO's EMV rises by 1414224.721864; 4293775.278136 is the first breakpoint of deal-ekene-bonus-zero, where the reimbursement is also removed.")

# 12
x("Priced as a 10.000000 percent working interest, the drill yourself or farm out figures of Penn State EME 801, Lesson 6 (numbers only) give a risked value per percent of what?",
 "125.000000, the 100 percent EMV of 12500.000000 over 100",
 ["5000.000000, the success-case figure per percent",
  "1250.000000, the risked value of the 10.000000 percent working interest",
  "12500.000000, the 100 percent EMV itself before any division by 100"],
 "interest-psu-10pct: 100 percent success 500000.000000, dry hole -250000.000000, EMV at 35.000000 percent 12500.000000; risked per percent 125.000000 and the working interest worth 1250.000000 (engine). 5000.000000 is the success-case figure per percent; 12500.000000 is the 100 percent EMV before it is divided by 100.")

# 13
x("A learner sets the working interest priced to 0 on the Ekene Deep price. What comes back?",
 "interestPct must be a number above 0 and at most 100; got 0",
 ["A value of the working interest of 0.000000, with both per-percent tiles unchanged",
  "valueBasis must be one of \"risked\", \"success-case\"; got nothing",
  "A price per percent of none, with a reason saying the working interest is 0"],
 "The working interest priced is a stated input above 0 and at most 100, and the engine refuses 0 by name: interestPct must be a number above 0 and at most 100; got 0. No result is returned, so no tile prints; the valueBasis message answers a missing basis.")

# 14
x("Which reading of a reserve category does the engine apply when it prices 2C (contingent, best estimate)?",
 "None: it divides the stated price by the stated volume whatever the label says",
 ["Risking the 2C volume by the stated chance of success before dividing the price",
  "A conversion of 2C to 2P at a stated factor, as its published classification requires",
  "It refuses any category that is not a proved reserve under the published rules"],
 "The source line: the reserve category and its volume are stated as the user classifies them. The engine classifies nothing: 2C is the fixture's label, and the price per MMboe is the stated price over the stated volume net to the working interest. It risks, converts and refuses no category.")

# 15
x("HMRC's manual says the value of a right will need to reflect the degree of probability that future benefits will accrue as well as their extent (HMRC Oil Taxation Manual OT30131). Which basis of the price view weighs that probability?",
 "The risked basis, which rolls both outcomes back at the stated chance",
 ["The success-case basis, the success-case value less the success well cost over 100",
  "Both bases alike, since each is computed on every call the engine answers",
  "Neither; the chance enters only the deal view's EMVs"],
 "The risked figure rolls the success and the dry hole back at the stated chance of success, so it reflects the probability; the success-case figure assumes the well succeeds and reflects the extent alone. The engine computes both every time, and the chance of success is an input of interestValue itself.")

emit(Q, '/root/cat-wip-farmout/banks/ec10a_m03.json', expect_n=15)
finish()
