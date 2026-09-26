import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC8 Associate m05, Take-or-Pay Basics.
# Sources: the takeOrPay rule in the engine's basis; the single-year golden
# cases (Adjusted ACQ, take-or-pay quantity, deficiency and payment); the power
# plant's 2027 and 2032 each run alone; the model agreement's definitions of
# Adjusted ACQ, Take or Pay Quantity and BADQ; the takeOrPay refusals of this
# tier. Every key rests on a digest-printed line or an engine return re-run in
# /root/cat-wip-gsa/scratch/bank-beginner/witness.mjs.

q(2, "Which quantities does the engine take off the ACQ to reach the Adjusted ACQ?",
 "Maintenance, force majeure, seller shortfall and any permitted reduction.",
 ["The buyer shortfall summed over the year's days, less the over-take of the same days.",
  "Force majeure alone.",
  "Maintenance and force majeure, with seller shortfall paid as damages and left in."],
 "The rule, in the engine's basis: Adjusted ACQ = ACQ - maintenance - force majeure - seller shortfall - permitted reduction. The model agreement's definition subtracts \"the Scheduled Maintenance Quantities, Force Majeure Quantities, Shortfall Quantities, and if applicable less the Operational Flexibility Credit\". A seller shortfall both reduces the Adjusted ACQ and, where a rate is stated, earns damages. The buyer's own gaps are what the take-or-pay quantity is measured against, so they never reduce it.")

q(0, "The power plant's 2027, run alone, carries force majeure of 42000 and a seller shortfall of 6300 against an ACQ of 7665000. What Adjusted ACQ does the engine return?",
 "7616700.000000, the ACQ less reductions of 48300.000000.",
 ["7665000.000000, since reductions only lower the take-or-pay quantity.",
  "7245000.000000, the gas the buyer actually took that year.",
  "6093360.000000."],
 "Force majeure of 42000 and a seller shortfall of 6300 make reductions of 48300.000000, and 7665000 less that is 7616700.000000. These are the planted 2027 situation the take-or-pay year finds. 7245000.000000 is the year's take, and 6093360.000000 is the take-or-pay quantity, 80 percent of the Adjusted ACQ.")

q(1, "What take-or-pay quantity does the engine return for the power plant's 2027 run alone, at 80 percent?",
 "6093360.000000, 80 percent of the Adjusted ACQ.",
 ["6132000.000000, on the full ACQ.",
  "6148800.000000, the leap-year figure.",
  "7616700.000000, the Adjusted ACQ itself, which the buyer must take in full to avoid a deficiency."],
 "TOPQ = topPct % of Adjusted ACQ, and 80 percent of 7616700.000000 is 6093360.000000. The model agreement defines the Take or Pay Quantity as a percentage \"of the Adjusted Annual Contract Quantity for that Contract Year\". 6132000.000000 applies the percentage before the year's reductions, a planning figure; 6148800.000000 belongs to the leap years 2028 and 2032.")

q(3, "Run alone, 2027 saw the power plant's buyer take 7245000, comfortably past the 6093360.000000 it owed. Which deficiency results?",
 "0.000000.",
 ["The gas taken above the take-or-pay quantity, carried to the buyer's credit for later years.",
  "The ACQ less the gas taken, which the buyer pays for at the take-or-pay price.",
  "48300.000000, the reductions, which the buyer owes as the year's deficiency in their place."],
 "The engine's rule: deficiency = TOPQ - (taken - make-up taken) when positive. The take is above the take-or-pay quantity, so the deficiency is 0.000000 and the deficiency payment 0.000000. Nothing in a single year credits the excess to the buyer, the yardstick is the take-or-pay quantity, and reductions protect the buyer.")

q(0, "A golden year has an ACQ of 1000 with reductions of 200, take-or-pay at 80 percent, 600 taken and a take-or-pay price of 3. What deficiency payment does the engine return?",
 "120.000000, for a deficiency of 40 at 3.",
 ["600.000000, for a deficiency of 200 against 80 percent of the full ACQ.",
  "75.000000, the seller shortfall damages of that same year.",
  "1845.000000."],
 "The Adjusted ACQ is 800.000000 and the take-or-pay quantity 640.000000, so 600 taken leaves a deficiency of 40.000000; the engine's reason opens: \"2027: 600 counted against the take-or-pay quantity 640 leaves a deficiency of 40; the deficiency payment is 40 x 3 = 120\". Skipping the reductions gives the wrong 600. 75.000000 is that year's seller shortfall damages and 1845.000000 its net to the seller.")

q(2, "Ninety percent take-or-pay on an ACQ of 1000, and only 500 taken in the case's one year: find the deficiency.",
 "400.000000.",
 ["500.000000, the ACQ less the gas the buyer took.",
  "1200.000000, the year's full deficiency.",
  "800.000000, taking 80 percent as a default."],
 "The take-or-pay quantity is 90 percent of the Adjusted ACQ of 1000, 900.000000, and 900 less 500 counted is 400.000000. The yardstick is the take-or-pay quantity, which leaves out the ACQ above it. 1200.000000 is the deficiency PAYMENT at the take-or-pay price of 3, a sum of money. The engine holds no default percentage; topPct is stated.")

q(1, "A golden year has a take-or-pay quantity of 800 and the buyer takes exactly 800. What does the engine return?",
 "A deficiency of 0.000000 and no reason, as there is nothing to reconcile.",
 ["A deficiency of 1.000000, because the take must exceed the quantity.",
  "A deficiency of 0.000000 with a reason naming a make-up right of 0 opened for the year that follows it.",
  "A refusal, since a take equal to the take-or-pay quantity needs a tie-break rule stated in the contract."],
 "The deficiency is the take-or-pay quantity less the quantity counted when that is above 0, so taking exactly 800 leaves 0.000000, and the engine returns an empty list of reasons, since nothing is left to reconcile. The model agreement asks the buyer to take \"at least\" the take-or-pay quantity, and at least includes equal. A deficiency of 1.000000 belongs to the case one unit short.")

q(3, "One unit short: a take-or-pay quantity of 800, 799 taken, a take-or-pay price of 3. What deficiency payment does the engine return?",
 "3.000000.",
 ["0.000000, as one unit is within any rounding of the take-or-pay quantity.",
  "1.000000, the deficiency quantity, read as the payment.",
  "2400.000000, the whole take-or-pay quantity at 3, since the quantity was missed."],
 "The engine's reason opens, verbatim: \"2027: 799 counted against the take-or-pay quantity 800 leaves a deficiency of 1; the deficiency payment is 1 x 3 = 3\". The engine compares exact numbers, with no rounding band. 2400.000000 is the payment of a year in which nothing was taken.")

q(3, "A golden year has an ACQ of 1000, a take-or-pay quantity of 800 and a take-or-pay price of 3, and the buyer's plant stands idle all year, taking no gas. What comes back?",
 "A deficiency of 800.000000, paid at 2400.000000.",
 ["A deficiency of 1000.000000, paid at 3000.000000.",
  "No deficiency, as for force majeure.",
  "A refusal: nothing taken, nothing to reconcile."],
 "The engine's reason opens: \"2027: 0 counted against the take-or-pay quantity 800 leaves a deficiency of 800; the deficiency payment is 800 x 3 = 2400\". The whole take-or-pay quantity is the deficiency; the ACQ above it is never owed. A zero take is a result, and force majeure is only ever a stated input.")

q(0, "A golden year states force majeure covering its whole ACQ of 1000. What does the engine return?",
 "An Adjusted ACQ of 0.000000, a take-or-pay quantity of 0.000000 and no deficiency.",
 ["A deficiency of 800.000000, since force majeure excuses the seller but leaves the buyer's obligation.",
  "A refusal, as reductions may not equal the ACQ.",
  "An Adjusted ACQ of 1000.000000, force majeure being counted only day by day."],
 "The golden case top-fm-whole-year returns an Adjusted ACQ of 0.000000, a take-or-pay quantity of 0.000000 and no deficiency, with no reason, since nothing is left to reconcile. Reductions may equal the ACQ; only reductions ABOVE it are refused. Force majeure stated for the year comes off the ACQ like any other reduction.")

q(1, "The power plant's leap year 2032 is run alone: ACQ 7686000, no reductions, 80 percent, and 6148800 taken. What does the engine find?",
 "A deficiency of 0.000000, the take-or-pay quantity exactly met.",
 ["A deficiency measured from the ACQ of 7686000.000000.",
  "A deficiency, since 2032 is scored on 365 days.",
  "A deficiency of 0.000000 and an over-take credited forward to the next year of the term."],
 "In 2032 the take-or-pay quantity is 80 percent of 7686000.000000, which is 6148800.000000, and the buyer took exactly that. It is the fixture's planted boundary: deficiency 0 at the boundary, and the one-year run returns no reason, since nothing is left to reconcile. The ACQ is not the yardstick, 2032 counts 366 days, and a single year carries nothing forward.")

q(2, "A learner sets topPct to 101 in the one take-or-pay year view. What does the engine return?",
 "A refusal: topPct must be a number from 0 to 100.",
 ["A take-or-pay quantity above the Adjusted ACQ, with a reason that flags the unusual percentage stated.",
  "A result clamped at 100 percent.",
  "A result at a default 90 percent."],
 "The engine's own words: \"topPct must be a number from 0 to 100; got 101\". The percentage has no default at all, so the engine neither clamps it nor substitutes one. A percentage of 0 is accepted and gives a take-or-pay quantity of zero.")

q(0, "A take-or-pay year is entered with no topPrice. What does the engine return?",
 "A refusal: the take-or-pay price has no default.",
 ["A result at the contract price, copied across.",
  "A deficiency payment of 0.000000.",
  "A result at the reported domestic base price."],
 "The engine's own words: \"years[0].topPrice must be a finite number at or above 0; got nothing\". The deficiency payment is (deficiency - carry-forward credit) x topPrice, and a contract may state the take-or-pay price apart from the contract price, so the engine copies nothing. The domestic base price is a required input of the domestic price function only, quoted only as reported.")

q(3, "A year states an ACQ of 100 with maintenance, force majeure, seller shortfall and a permitted reduction adding to 110. What does the engine return?",
 "A refusal naming years[0].acq.",
 ["An Adjusted ACQ of 0.000000, the reductions capped at the ACQ.",
  "An Adjusted ACQ below zero and a negative take-or-pay quantity, with a reason naming the excess.",
  "A result that ignores the permitted reduction, the last term in the sum, until the total fits."],
 "The engine's own words: \"years[0].acq must be at or above the reductions it carries (maintenance + force majeure + seller shortfall + permitted reduction = 110); got 100\". Reductions larger than the year's ACQ describe an impossible year, so the call stops before any figure is produced; nothing is capped and no term is dropped.")

q(1, "How does this course describe the money a buyer owes on a deficiency?",
 "A deficiency payment: payment for gas committed to and not taken.",
 ["A fine the Commission levies per MMBtu under the Act.",
  "Damages the buyer pays for a seller shortfall.",
  "An over-take charge on days above the adjusted DCQ."],
 "The vocabulary rule: a deficiency is the take-or-pay quantity less the quantity counted, when above zero, and the money is the deficiency payment. Article 12.6 obliges the buyer \"to take and pay for, or to pay for if not taken\" the take-or-pay quantity, so it pays for gas it committed to. The course keeps the word penalty for the Act's Domestic Gas Delivery Obligation, and damages for the seller's side.")

emit(Q, '/root/cat-wip-gsa/banks/ec8b_m05.json', expect_n=15)
finish()
