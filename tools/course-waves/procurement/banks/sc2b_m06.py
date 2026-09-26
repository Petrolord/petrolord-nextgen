import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# SC2 Associate m06, Reading an Award.
# Sources: the whole well services tender in one call (award, reason, source,
# exclusions), the same tender under a lowest-cost award, the tie-break with
# the T1 to T3 and U1/U2 stated tests, the tie digits constant, and the
# evaluateTender and receipt-time refusals. The keyed figures were re-run
# through the engine (scratch/bank-beginner/witness.mjs).

q(2, "The whole well services tender runs in one call with a combined award at the fixture's settings. Which award and reason does the engine return?",
 "WS3, with the reason \"WS3 has the highest combined score\"",
 ["WS5, with the reason that it holds the lowest evaluated cost of the four bids ranked.",
  "WS1, as it finishes early with a discount.",
  "No award, since two bids lead on two figures."],
 "Under award combined at technical weight 0.7, lowest-ratio and relative, the engine awards WS3 with the reason quoted, its own words. WS5 wins only under a lowest-cost award, WS1 ranks second on the combined score, and two bids leading on two different figures is an ordinary outcome that still yields one award.")

q(0, "The award basis of the same tender is changed from combined to lowest-cost. What does the engine award?",
 "WS5, because \"WS5 has the lowest evaluated cost\"",
 ["WS4, whose quoted total of 763200.000000 is the lowest of the six bids received by the company.",
  "WS3 still, since the award follows the technical envelope whatever basis the tender names.",
  "WS2, whose quoted total is level with WS5's and which was received on an earlier day."],
 "Under a lowest-cost award the engine names the bid with the lowest evaluated cost, WS5 at 862141.000000. WS4's price was never opened, the basis decides the award so WS3 does not stay, and WS2's corrected price and deviation leave it second on evaluated cost.")

q(3, "Why do the combined award and the lowest-cost award name different bids on the well services tender?",
 "The combined score weighs the technical percentage at 0.7, and WS3 has the best one.",
 ["The combined award adds a technical bonus to WS3's price, so its evaluated cost becomes the lowest.",
  "The lowest-cost award reads WS5's price as quoted.",
  "One award is wrong and the engine flags it."],
 "WS3 carries the highest technical percentage and the fourth-lowest evaluated cost; WS5 the lowest evaluated cost and the lowest technical percentage of the four. Weighing quality at 0.7 makes WS3 most advantageous; weighing cost alone picks WS5. Neither award is wrong: each answers the question its basis asks, and both use the corrected prices.")

q(1, "In what order does the engine break a tie on the combined score?",
 "Lower evaluated cost, then earlier receipt, then bidder id.",
 ["Higher technical percentage, then lower evaluated cost, then a fresh price from the bidders tied.",
  "Earlier receipt, then lower quoted total, then the committee's vote on the tied bids.",
  "Bidder id first, then receipt."],
 "The engine's ranking basis reads \"combined score descending; ties at 12 significant digits go to the lower evaluated cost, then the earlier receipt, then the bidder id\". No text read states a tie-break, so this order is the engine's stated convention; it asks for no fresh price, holds no vote and uses the quoted total nowhere.")

q(3, "Stated as a test, T1, T2 and T3 score 100.000000 each; T1 and T2 were received at 09:00:00 and T3 at 10:00:00. What does tieBrokenBy show for T2 and T3?",
 "T2 bidder id; T3 earlier receipt",
 ["T2 earlier receipt and T3 bidder id, since T2 arrived in the same second as T1.",
  "Lower evaluated cost for both, because it is the first key of the tie-break order.",
  "Null for both, as three identical combined scores leave the order undecided."],
 "The three share an evaluated cost of 500000, so the first key cannot separate them. T1 and T2 arrive in the same second, so the bidder id orders T2 after T1; T3 arrived later, so earlier receipt orders it third. tieBrokenBy is null only on the first row.")

q(2, "Stated as a test, U2 has T 100 and C 1000 and U1 has T 50 and C 500, at technical weight 0.5. Both score 75.000000. Which ranks first?",
 "U1, broken by \"lower evaluated cost\"",
 ["U2, because it holds the higher technical percentage of the two tied bids.",
  "Neither; the engine returns both at rank 1 and leaves the award open.",
  "U2, since the bid named second in the input is ranked ahead on a tie."],
 "When the combined scores tie, the first key of the tie-break is the lower evaluated cost, so U1 at 500 ranks ahead of U2 at 1000. The technical percentage is not a tie-break key, every ranking is strict, and input order plays no part.")

q(0, "At how many significant digits does the engine treat two figures as tied?",
 "Twelve, an engine convention (TIE_DIGITS 12).",
 ["Six, the number of decimals every figure in the course is printed to.",
  "Two, as the Guidance (February 2025) prints.",
  "Every digit of the double, so only bit-for-bit equal figures tie."],
 "TIE_DIGITS is 12: two routes to the same score can land a hair apart in the last binary digits, and twelve significant digits treat such hairs as equal while keeping every difference a person could print. Six decimals is only the printing precision, so figures printed alike at six decimals are not for that reason tied.")

q(3, "Which bids does the whole well services call list as excluded, and at what stage?",
 "WS4 and WS6, both at the technical stage.",
 ["WS4 at the technical stage and WS6 at the commercial stage for a missing signature.",
  "WS4, WS6 and WS5, as WS5 sits on the pass mark and is excluded with the other two.",
  "WS6 alone, since WS4 was scored and stays on the ranking of the combined score."],
 "The engine lists WS4 (technical score 65 below the pass mark 70) and WS6 (failed signed-bid-form), each at the technical stage, with its reason verbatim. A mandatory failure is found in the technical envelope, WS5 at 70.000000 passes, and a bid below the pass mark is excluded even though it was scored.")

q(1, "How should an evaluation report describe what happened to WS4 and WS6?",
 "As exclusions: results the engine returned, each with its stage and its reason in quotation marks.",
 ["Refusals, because the engine would not evaluate either bid and returned an error.",
  "Input errors in the two bids, to be corrected before the tender is run again.",
  "As bids withdrawn by their own bidders before the envelopes were opened."],
 "An exclusion is a result: the engine evaluated both bids and returned them excluded with the reason beside each. A refusal returns no result for a bad input, nothing in either bid is an input error, and neither bidder withdrew.")

q(0, "A receipt time is typed as 2027-05-01T09:00:00 with no zone letter. What does the engine return?",
 "A refusal: \"bids[0].receivedAt must be a UTC time 'YYYY-MM-DDTHH:MM:SSZ'\".",
 ["UTC is assumed, since the tender box keeps UTC and the Z adds nothing to it.",
  "Local time, converted with a note on the offset it assumed.",
  "The bid ranked last on any tie."],
 "A tie can turn on the receipt time, so the engine takes a UTC time only in the stated form and refuses anything else by name, in the words quoted. It assumes no zone, converts nothing, and penalises no bid for a malformed time.")

q(2, "When bids are ranked by evaluated cost, what orders them and what breaks a tie?",
 "Ascending evaluated cost, and at a tie the bid received first, then its id.",
 ["Technical percentage descending, with the lower evaluated cost breaking any tie between two bids.",
  "Quoted total ascending, as priced.",
  "Evaluated cost descending, the dearest first, with any tie left for the committee to settle."],
 "The engine's ranking basis for evaluated cost reads: evaluated cost ascending; ties at 12 significant digits go to the earlier receipt, then the bidder id. A cost ranking cannot break a tie on the cost it is ranking by, quoted totals are never ranked, and no tie is left undecided. On the well services tender no two evaluated costs tie.")

q(3, "Which text does the engine cite as the source of the combined award?",
 "The Works SPD, two-envelope (Sep 2025), Section III: B = Clow / C x X x 100 + T / Thigh x (1 - X) x 100.",
 ["Public Procurement Act 2007 s.24(3), on the lowest evaluated responsive bid, as its source.",
  "Figure IX of the Guidance on Evaluating Bids and Proposals (February 2025), on weighted points.",
  "The Regulations (Seventh Edition, September 2025), para 6.29 on the two envelopes."],
 "The engine's award source for the combined basis is the World Bank SPD Request for Bids, Works, two-envelope (Sep 2025) Section III with the formula quoted. s.24(3) is the lowest evaluated responsive bid, Figure IX prints weighted points, and para 6.29 is the source of the technical stage.")

q(1, "At which stage can a bid be excluded for completion beyond the maximum weeks or a stated rejection reason?",
 "The commercial stage, with the reason printed in the exclusions.",
 ["The technical stage, together with bids that fail the pass mark or a requirement.",
  "The award stage, after ranking, when the most advantageous bid is checked.",
  "No stage; both are charged as adjustments in the evaluated cost."],
 "A stated rejection reason, such as a major deviation, and completion beyond maxWeeks each exclude a bid at the commercial stage, and the exclusion carries its stage. The technical stage covers mandatory requirements and the pass mark, the award stage excludes nobody, and neither case is priced as an adjustment.")

q(0, "The award line is deleted from the whole tender call. What does the engine return?",
 "A refusal: \"award must be 'lowest-cost' or 'combined'; there is no default\".",
 ["A combined award, the basis the well services tender states in its settings.",
  "A lowest-cost award, the basis that the Public Procurement Act 2007 prefers.",
  "Both awards side by side, leaving the committee to choose one of the two for the contract."],
 "The award basis has no default, and evaluateTender refuses the call by name in the words quoted. It borrows no basis from a fixture or a statute and prints no pair of awards, since choosing a basis is the tender's decision, stated before any bid is opened.")

q(2, "WS3 wins the combined award. Which statement about WS3 fits the course's meaning of most advantageous?",
 "WS3 is most advantageous at 96.998434 under technical weight 0.7, lowest-ratio and relative.",
 ["WS5 is most advantageous, because its evaluated cost of 862141.000000 is the lowest of the four.",
  "WS6 is most advantageous on paper, as its scores are the strongest of the six bids.",
  "WS3 is most advantageous in every sense, whatever technical weight is chosen."],
 "Most advantageous names the highest combined score under a stated technical weight and stated methods. WS5 holds the lowest evaluated cost, which is a different term; WS6 was never scored; and WS3's lead depends on the weight, since at a weight of 0 the most advantageous bid is WS5.")

emit(Q, '/root/cat-wip-procurement/banks/sc2b_m06.json', expect_n=15)
finish()
