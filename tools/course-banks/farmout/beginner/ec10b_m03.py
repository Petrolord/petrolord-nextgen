import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC10 Associate m03, The Promote and Its Ratio.
# Sources: the promote and the carry in the engine's basis; the same well under
# five promotes (heads up, below a cap, a third for a quarter, a full carry, all
# of the farmor's share); the Ekene Deep row; the negative-promote and
# share-above-the-farmor refusals. Every key rests on a digest-printed line or
# an engine return re-run in
# /root/cat-wip-farmout/scratch/bank-beginner/witness.mjs.

q(1, "In the engine's basis, what is the promote of an earning event?",
 "The share of the gross cost the farminee pays minus the interest it holds after the event, in points.",
 ["The interest earned divided by the share of the gross cost paid, which gives a ratio below one.",
  "The carry divided by the gross cost of the event, written as a percentage of the well.",
  "The share paid less the farmor's participating interest before the deal, counted in points."],
 "The basis reads: \"promote = the share of the gross cost the farminee pays minus the interest it holds after the event (points); promote ratio = share paid / interest held\". The ratio divides the share paid by the interest held, the other way up. The carry over the gross cost matches the points only when no cap bites, and the farmor's pre-deal share is the ceiling on the share paid.")

q(3, "FIN's Ekene Deep-1 terms are 40 percent paid for 30 percent earned from EKO, and it holds 30 percent after the event. What promote does the engine return?",
 "10.000000 points and a ratio of 1.333333.",
 ["8.333333 points and a ratio of 1.333333, the promote of a third paid for a quarter earned.",
  "10.000000 points and a ratio of 1.724638, the promote-adjusted ratio printed in the tiles.",
  "0.000000 points and a ratio of 1.000000, since the cap on the gross cost removes the promote."],
 "40 paid less 30 held is 10.000000 points, and 40 over 30 is a ratio of 1.333333, as the engine's row prints. 8.333333 points belongs to earn-third-for-a-quarter. 1.724638 is the promote-adjusted ratio, which counts the cash as well. The cap changes how the cost is split; the reason line still reports a promote of 10 points.")

q(0, "A third for a quarter: FIN pays 33.333333 percent of a 12000000.000000 well (no cap) for 25 percent from EKO, the sole holder. What promote in points results?",
 "8.333333 points, at the same 1.333333 ratio as forty for thirty.",
 ["10.000000 points, the Ekene promote, since the ratio of 1.333333 is the same on both deals.",
  "25.000000 points, the whole participating interest earned counted as the farminee's promote.",
  "33.333333 points, all of it promote."],
 "33.333333 paid less 25 held is 8.333333 points, and the ratio is 1.333333, the same as 40 for 30. Equal ratios on different interests give different points, which is why the course reads both measures. The interest earned is the farminee's own share, and the promote subtracts it from the share paid.")

q(2, "Heads up: on a 40000000.000000 well without a cap, FIN pays 30 percent and earns 30 from EKO (EKO 70, PA 30 beforehand). What is EKO's bill for the well?",
 "16000000.000000, its own post-deal 40 percent of the well.",
 ["12000000.000000, FIN's own share.",
  "28000000.000000, EKO's pre-deal 70 percent of the well, since a heads-up deal moves no participating interest.",
  "4000000.000000, the carry FIN would pay on the same well at a share paid of 40 percent for 30."],
 "Heads up, the farminee pays its own share and nothing of the farmor's: the engine returns FIN 12000000.000000, EKO 16000000.000000, a promote of 0.000000 points and a carry of 0.000000. EKO holds 40 percent after the deal and pays all of it. A heads-up deal still moves 30 percent of the licence to FIN, and 4000000.000000 is the carry of a different deal.")

q(3, "Case earn-full-carry. Terms: a licence split 70 and 30 between EKO and PA; FIN funds 70 percent of an uncapped 40000000.000000 well in return for 30 percent. How much carry results?",
 "16000000.000000, EKO's whole post-deal share of the well.",
 ["28000000.000000, the whole payment FIN makes for the well on these terms.",
  "12000000.000000, FIN's own held 30 percent of the gross cost of the well.",
  "4000000.000000, ten points of the well, the promote of forty for thirty."],
 "The engine returns FIN paying 28000000.000000, EKO 0.000000 and a carry of 16000000.000000, with a promote of 40.000000 points and a ratio of 2.333333. The carry is FIN's payment less its own held 30 percent of the well (12000000.000000), which is EKO's whole 40 percent post-deal share. 4000000.000000 is the carry at 40 paid for 30.")

q(1, "Every point of EKO's participating interest (70 percent; PA holds the other 30) passes to FIN, which pays 70 percent of a 40000000.000000 well that has no cap. What promote does the engine report?",
 "0.000000 points: the whole share paid for the whole interest earned is heads up.",
 ["40.000000 points and a ratio of 2.333333, as in a full carry.",
  "70.000000 points, since FIN pays EKO's whole pre-deal share of the well for the participating interest.",
  "None: the call is refused for a whole interest farmed out."],
 "On earn-all-of-farmor the engine returns a promote of 0.000000 points, a ratio of 1.000000 and a carry of 0.000000, with FIN paying 28000000.000000 and EKO 0.000000. The promote is measured against the interest held after the event, here 70, so paying 70 is heads up. 40 points belongs to the full carry, which earns only 30, and earning the farmor's whole interest is accepted.")

q(0, "Which quantity does the engine's basis call the carry?",
 "What the farminee pays minus its own held interest of the gross cost.",
 ["The farmor's pre-deal share of the gross cost less what the farmor pays after the deal is struck.",
  "The promote's points times the farmor's pre-deal share.",
  "Cash: the bonus plus the reimbursement."],
 "The basis reads: \"carry = what the farminee pays minus its own held interest of the gross cost: the part of the farmor's post-deal share the farminee pays\". The farmor's pre-deal share less its payment also counts the participating interest it gave up, the points are a share of the gross cost, and the bonus and the reimbursement are cash beside the carry in the consideration.")

q(2, "A farminee's payment is 16000000.000000 and its interest after the event is 30 percent; the well cost 40000000.000000 with no cap (EKO 70, PA 30 before the deal). By the basis rule, what carry does the engine report?",
 "4000000.000000: the payment less FIN's own 12000000.000000.",
 ["16000000.000000, the whole of FIN's payment for the well.",
  "12000000.000000, which is what EKO pays for the same well after the deal.",
  "28000000.000000, EKO's pre-deal share of the well, which the farm-out carries."],
 "FIN's own share of the well is 30 percent of 40000000.000000, 12000000.000000; the carry is what it pays above that, 4000000.000000, as the engine returns on earn-bonus-and-reimbursement. With no cap this is 10.000000 points of the gross cost. 12000000.000000 is also EKO's payment, and a farminee pays only part of the farmor's share.")

q(1, "The engine's Ekene carry is 4400000.000000 although the promote is 10 points of a 46000000.000000 well. Given the deal's gross-cost cap of 44000000.000000 (overrun rule \"post-deal-interests\"), what cost does the reason line apply the promote to?",
 "44000000.000000, the capped cost.",
 ["46000000.000000, the whole gross cost of the success well in the fixture.",
  "40000000.000000, the dry-hole cost of the exploration well in the fixture.",
  "2000000.000000, the part of the gross cost above the cap on this well."],
 "The reason line reads that the gross cost exceeds the cap 44000000 by 2000000 and \"the promote applies to 44000000\", so the carry is 10 points of 44000000.000000, which the engine returns as 4400000.000000. The promote in points is a term of the deal; the carry is money that also depends on the cap, which a later tier works in full.")

q(3, "Two worked cases pay the same promote ratio of 1.333333: forty paid for thirty on a 40000000.000000 well, and a third paid for a quarter on a 12000000.000000 well. How do their promotes in points compare?",
 "They differ: 10.000000 points against 8.333333, since the participating interests differ.",
 ["Both are 10.000000 points, since equal ratios give equal points.",
  "Both are 8.333333 points, the ratio fixing the points.",
  "10.000000 against 25.000000 points."],
 "The engine returns 10.000000 points on earn-cap-gross-below and 8.333333 on earn-third-for-a-quarter, each with a ratio of 1.333333. The ratio compares deals of different sizes; the points turn straight into money on a stated gross cost. Neither measure fixes the other, since each depends on the interest held after the event.")

q(0, "The earn-third-for-a-quarter reason line prints FIN's share paid with every digit of the double that was stated, while the field prints 33.333333. Which does the course tell a learner to reason with?",
 "The field at six decimals; a message prints a stated input exactly as it was given.",
 ["The message, the engine's own words.",
  "Neither of them: round the share to 33 percent, the nearest whole point.",
  "The message's figure rounded to the cent."],
 "The digest's precision rule: inside a message the engine prints a stated input as it was given, and every numeric field keeps full precision, quoted at six decimals. The course reasons with the field, 33.333333, and quotes a message only verbatim. Rounding to a whole point changes the deal, and cent rounding applies to money in a reason.")

q(2, "The refusal for a share paid of 25 against an interest earned of 30 names 30 as the lower limit. What is that 30?",
 "What FIN holds once the event vests, the 30 percent it earns.",
 ["PA's participating interest, 30 percent.",
  "EKO's interest after the deal less ten points.",
  "A minimum promote ratio of 30 percent set by the Assignment of Interests Regulations, 2024."],
 "The message reads that the share \"must be at or above 30, the interest the farminee holds after the event (a promote of 0 or more)\". The limit is the figure the promote is measured against, the farminee's interest after the event. PA's 30 percent is the same number by coincidence, EKO holds 40 after the deal, and the Regulations set no promote.")

q(0, "Along the edge of the promote, how far can the share paid rise on a licence where EKO, the farmor, holds 70 and PA 30 percent, and what does EKO pay at that edge?",
 "70 percent, with EKO paying 0.000000.",
 ["100 percent, with EKO and PA both carried by the farminee for their shares.",
  "40 percent, the promote ceiling of a single event under the 2024 Regulations.",
  "75 percent, with PA carried for five points of its own share of the well."],
 "The farminee pays only the farmor's side of the well. At a share of 70 the engine returns EKO paying 0.000000 and a carry of 16000000.000000 (earn-full-carry); a share one point above is refused, with 70 named as the farmor's interest before the deal. PA pays its own share throughout, and no text sets a ceiling of 40 on a promote.")

q(3, "In dollars, how large is the carry when FIN, earning 25 percent from sole holder EKO, pays 33.333333 percent of an uncapped well costing 12000000.000000?",
 "1000000.000000, which is the promote's 8.333333 points applied to the well.",
 ["4000000.000000, which is the whole of what FIN pays for the 12000000.000000 well.",
  "3000000.000000, FIN's own 25 percent.",
  "8000000.000000, what EKO pays for the well after the farminee's payment is made."],
 "The engine returns a carry of 1000000.000000: FIN pays 4000000.000000, its own 25 percent is 3000000.000000, and the difference is the carry. With no cap that is the promote in points applied to the gross cost, 8.333333 points of 12000000.000000. 8000000.000000 is EKO's payment.")

q(1, "Deals are often quoted as a ratio, such as forty for thirty. What does the engine's promote ratio divide by what?",
 "The share paid by the participating interest held after the event.",
 ["The interest earned by the share of the gross cost that the farminee pays for it.",
  "The carry by the farminee's payment.",
  "The share paid by the farmor's pre-deal share."],
 "The basis reads \"promote ratio = share paid / interest held\", so forty for thirty is 1.333333 and heads up is 1.000000. The inverse would read below one for every promoted deal. The carry over the payment is no term the engine reports, and the farmor's pre-deal share is the limit on the share paid.")

emit(Q, '/root/cat-wip-farmout/banks/ec10b_m03.json', expect_n=15)
finish()
