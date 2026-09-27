import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC10 Associate m04, Cash Bonus and Reimbursement.
# Sources: the equivalent working interest in the engine's basis; the table of
# bonus, reimbursement, consideration, outlay and equivalent working interest;
# the Ekene Deep consideration and its reason line; HMRC OT30021 and OT30081;
# the cash bonus and past-cost refusals; the consideration of an uncompleted
# event; the vocabulary's consideration and value of the transaction. Every key
# rests on a digest-printed line or an engine return re-run in
# /root/cat-wip-farmout/scratch/bank-beginner/witness.mjs.

q(2, "EKO's past costs on the Ekene licence are 12000000.000000, and the deal states that FIN reimburses 30 percent of them. What reimbursement does the engine return?",
 "3600000.000000, the stated share of the stated amount.",
 ["12000000.000000, the whole of EKO's past costs, since a farminee reimburses sunk costs in full.",
  "4400000.000000, the carry, which the engine counts as the reimbursement of EKO's share of the well.",
  "2700000.000000, the reimbursement of the earn-bonus-and-reimbursement case at the same 30 percent."],
 "The reimbursement is the stated share of the stated past costs: 30 percent of 12000000.000000, which the engine returns as 3600000.000000 and writes in its reason as \"past-cost reimbursement 3600000 (30% of 12000000)\". The share reimbursed is its own stated term, so a full reimbursement would be stated as 100. The carry is a separate part of the consideration, and 2700000.000000 is 30 percent of 9000000.000000.")

q(0, "On the Ekene Deep deal the carry is 4400000.000000, the cash bonus 2000000.000000 and the reimbursement 30 percent of past costs of 12000000.000000, with the one event completed. What consideration to EKO does the engine return?",
 "10000000.000000: carry, cash bonus and reimbursement added.",
 ["23800000.000000, FIN's outlay for the deal, which also counts its payment for the well.",
  "5600000.000000, the bonus and the reimbursement.",
  "4400000.000000, the carry on its own."],
 "The engine's reason reads \"consideration to EKO: carry 4400000 + cash bonus 2000000 + past-cost reimbursement 3600000 (30% of 12000000) = 10000000\". The consideration is what the farmor receives, so FIN's own share of the well stays out of it; 23800000.000000 is FIN's outlay. The cash alone and the carry alone each leave out a part.")

q(3, "The case earn-bonus-and-reimbursement states a bonus of 1500000.000000 and 30 percent of 9000000.000000 in past costs reimbursed; its well (40000000.000000, no cap; EKO 70, PA 30) is paid 40 percent by FIN for 30, and is completed. What is EKO's consideration?",
 "8200000.000000, the carry, the bonus and the reimbursement together.",
 ["20200000.000000, FIN's outlay: its well payment together with the cash.",
  "4000000.000000, the carry and nothing else.",
  "9000000.000000, the stated past costs, which the farmor recovers in full from FIN."],
 "The engine returns a carry of 4000000.000000, a reimbursement of 2700000.000000 (30 percent of 9000000.000000) and a consideration of 8200000.000000, written as \"carry 4000000 + cash bonus 1500000 + past-cost reimbursement 2700000 (30% of 9000000) = 8200000\". 20200000.000000 is FIN's outlay, which also counts its own share of the well. Only the stated 30 percent of the past costs is reimbursed.")

q(1, "FIN pays 18200000.000000 for the Ekene Deep-1 well, a cash bonus of 2000000.000000 and a reimbursement of 3600000.000000, the event completed. What does the engine return as the farminee outlay?",
 "23800000.000000: the well payment of 18200000.000000 plus the bonus and the reimbursement.",
 ["18200000.000000, the well payment alone, which is FIN's whole share of the deal.",
  "10000000.000000, the consideration EKO receives from the farm-out.",
  "46000000.000000, the gross cost of the well that FIN is paying toward."],
 "The outlay is the farminee's well payment plus the cash bonus and the reimbursement: 18200000.000000 + 2000000.000000 + 3600000.000000, which the engine returns as 23800000.000000. The well payment alone leaves out the cash, the consideration counts the carry in place of FIN's whole payment, and the gross cost is shared among three parties.")

q(0, "FIN's outlay on the Ekene Deep deal is 23800000.000000 for a completed well of 46000000.000000, and it vests 30 percent. What equivalent working interest does the engine return?",
 "51.739130, the heads-up share FIN's outlay would buy.",
 ["39.565217, the share of the gross cost FIN pays for the well, which leaves the cash out of the figure.",
  "30.000000, the participating interest FIN vests, which the engine reports as what the outlay buys.",
  "40.000000, the stated share paid, which the engine reports as the equivalent interest of the deal."],
 "The basis reads \"equivalent working interest = (farminee pays + cash bonus + past-cost reimbursement) / gross cost of the completed events x 100: the heads-up interest that would cost the farminee the same\", and the engine returns 51.739130. 39.565217 is the well payment alone over the gross cost. 30.000000 is what FIN actually vests, and 40.000000 is the stated share paid.")

q(2, "What promote-adjusted ratio goes with an equivalent working interest of 51.739130 when 30 percent vests?",
 "1.724638, the equivalent working interest over the 30 percent vested.",
 ["1.333333, the promote ratio of forty for thirty, which reads the well terms alone and leaves out the cash.",
  "1.000000, since cash leaves the ratio alone.",
  "2.333333, a full carry's ratio of seventy for thirty."],
 "The basis defines the promote-adjusted ratio as the equivalent working interest over the vested interest, and the engine returns 1.724638. The plain promote ratio of 1.333333 looks at the well terms alone; the adjusted ratio adds the cash, so it rises above it. 2.333333 is the ratio of paying 70 for 30.")

q(3, "Add a bonus of 1500000.000000 and a reimbursement of 2700000.000000 to FIN's 16000000.000000 payment for an uncapped, drilled 40000000.000000 well that vests 30 percent. Which two figures does the engine print for the heads-up equivalent and its ratio?",
 "50.500000, with a promote-adjusted ratio of 1.683333.",
 ["40.000000 and 1.333333, the share paid and the promote ratio before any cash is counted.",
  "51.739130 and 1.724638, the equivalent figures that belong to the Ekene Deep deal.",
  "50.500000 with the plain ratio, 1.333333."],
 "The outlay is 20200000.000000, which over the 40000000.000000 well is 50.500000 percent, and over the 30 percent vested a ratio of 1.683333 (engine). 40.000000 and 1.333333 are the figures with no cash. The Ekene figures come from a different well and different cash. The ratio moves with the cash, so 1.333333 cannot sit beside 50.500000.")

q(1, "A learner sets the cash bonus control to \"not stated\" and runs the call, then sets it to 0 and runs again. What does the engine return each time?",
 "First a refusal on cashBonus, a term with no default; then a result whose reason reads \"cash bonus: none (stated as 0)\".",
 ["A result both times, since the engine reads a missing bonus as a bonus of 0 and says so in a reason.",
  "A refusal both times, since a bonus stated as 0 is treated as no bonus stated at all.",
  "First a result with no bonus line, then a refusal on cashBonus for a bonus of 0."],
 "A missing bonus is a gap in the terms, and the engine refuses it in its own words: \"cashBonus must be a finite number at or above 0; got nothing\". A bonus of 0 is a stated term, which the engine accepts and reports in a reason line of its own. The two are different things, which is why the panel's control offers both.")

q(2, "A farm-out carries no reimbursement of past costs. How must the box state its past costs?",
 "As an object with amount and reimbursedPct both 0.",
 ["By leaving pastCosts out of the box, which the engine reads as a deal with no reimbursement.",
  "As amount 0 alone, with no share stated.",
  "As reimbursedPct 0, the amount left out."],
 "The engine's words: \"pastCosts must be an object { amount, reimbursedPct } (both 0 when the deal has no reimbursement; no default); got nothing\". Both terms are required, and a deal with no reimbursement states both as 0. Leaving the object out is refused, and an object with one of the two terms is incomplete.")

q(0, "HMRC's Oil Taxation Manual, page OT30081 (updated 1 May 2019), says how a reimbursement of earlier costs should be treated. How?",
 "As cash consideration for the licence interest acquired.",
 ["As a loan the farmor repays out of production.",
  "As part of the farminee's work obligation, the phrase the manual explains on OT30048.",
  "As a fee for assigning rights, which the Act makes non-deductible for tax."],
 "OT30081 says the reimbursement should be treated as cash consideration for the licence interest acquired, and OT30021 describes the payment itself as a cash reimbursement for sunk costs relating to the proportionate interest acquired. A loan repaid from production is closer to a development carry, the work obligation is the undertaking to bear costs, and the non-deductible fees are the consent fees.")

q(3, "Take the no-cap well of 40000000.000000 with FIN paying 40 percent for 30 and a cash bonus of 1500000.000000. The learner changes the bonus to 0 and runs the call again. What happens to FIN's payment for the well?",
 "It stays 16000000.000000.",
 ["It falls by 1500000.000000, since the bonus is netted off the payment for the well.",
  "It rises by 1500000.000000, since the bonus is paid through the farminee's share of the well.",
  "It falls to 12000000.000000, since the promote goes with the bonus and FIN pays heads up."],
 "The bonus moves money from the farminee to the farmor on top of the well terms and does not change the split: FIN pays 16000000.000000 of the well whether the bonus is 1500000.000000 or 0. The bonus changes the consideration and the outlay only. The promote is set by the share paid and the interest held, which the bonus leaves alone.")

q(1, "How does the course keep the consideration apart from the value of the transaction?",
 "The consideration adds up deal terms; the value of the transaction is a separately stated amount that reg. 19(3) charges the fee on.",
 ["They are one figure: the 2024 Regulations charge the fee on the consideration the engine adds up, carry and all.",
  "The value of the transaction is the carry alone, since the carry is the part of the price paid in work.",
  "The consideration is the value of the transaction plus the consent fee charged on it."],
 "The vocabulary rule makes the consideration what the farmor receives (the carry, the cash bonus and the reimbursement) and the value of the transaction the amount reg. 19(3) charges the fee on, which a deal states with its source. The engine does not decide which consideration of a farm-out counts, so neither figure is read off the other in this course.")

q(3, "Before the well is drilled (0 events completed, vesting \"per-event\"), what consideration does the engine total for EKO on a deal of 40 paid for 30 on an uncapped 40000000.000000 well with no bonus and no past costs?",
 "0.000000, since the totals count completed events only.",
 ["4000000.000000, the carry of the obligation shown on the event row for the well.",
  "16000000.000000, FIN's obligation for the uncompleted well, counted as consideration.",
  "4000000.000000, owed from signing day."],
 "The consideration is a total, and the totals count completed events only: the engine's line reads \"consideration to EKO: carry 0 + cash bonus 0 + past-cost reimbursement 0 (0% of 0) = 0\". The event row still shows the carry of 4000000.000000 the obligation would bring. FIN's payment is its outlay, and nothing counts on signing.")

q(0, "In the engine's equivalent working interest, what is the farminee's outlay divided by?",
 "The gross cost of the completed events, times 100 to give a percentage.",
 ["The farmor's participating interest before the deal, 70 on Ekene.",
  "The consideration to the farmor, carry and cash included.",
  "The participating interest vested, as in the ratio."],
 "The basis divides the farminee's payment, cash bonus and reimbursement by the gross cost of the completed events and multiplies by 100: the heads-up interest that would cost the farminee the same. Dividing that figure by the vested interest gives the promote-adjusted ratio. With nothing completed there is no gross cost to divide by.")

q(2, "Heads up and cash-free: 30 percent of a drilled 40000000.000000 well, no cap, buys FIN 30 percent, with bonus and past costs both stated as 0. What equivalent working interest results?",
 "30.000000, the share paid.",
 ["40.000000, the farmor's post-deal share, which the farminee's payment matches on a heads-up deal.",
  "0.000000, since a deal with no cash has no equivalent working interest for the engine to report.",
  "51.739130, the Ekene figure, since the equivalent interest is a property of the licence."],
 "With no cash the outlay is the well payment, 12000000.000000, which over the 40000000.000000 well is 30.000000 percent, and the promote-adjusted ratio is 1.000000 (engine, earn-heads-up). A deal with no cash still has an outlay, EKO's post-deal share is its own, and 51.739130 belongs to the Ekene deal's terms.")

emit(Q, '/root/cat-wip-farmout/banks/ec10b_m04.json', expect_n=15)
finish()
