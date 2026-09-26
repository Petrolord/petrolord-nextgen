import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# SC2 Associate final exam, 42 questions across the tier's six modules, seven
# from each, asking what the module banks do not. Every figure is quoted from
# the digest; the keyed figures and outcomes were re-run through the engine
# (scratch/bank-beginner/witness.mjs, w2.mjs, w3.mjs). Two keys rest on an
# engine run the digest does not print as a table: the T3 receipt moved to
# 08:00 (w3.mjs) and the award after WS2 is rejected and WS1 runs 11 weeks
# (w3.mjs); neither prints a figure the digest lacks.

# m01: what a tender evaluation decides
q(2, "A bill line carries a key named unitPrice, which the engine does not read. What happens?",
 "The call is refused, naming the key, its path and the keys a bill line accepts.",
 ["The key is dropped and the line priced from its unitRate.",
  "Its value replaces the unit rate.",
  "The line is excluded from the bill."],
 "The engine refuses any input key a function does not read, at every level, with the message \"bids[0].lines[0].unitPrice is not an accepted key; the accepted keys of bids[0].lines[0] are id, quantity, unitRate, quotedAmount, decimalMisplaced\". A misspelt key never silently drops a term, so nothing is ignored, substituted or excluded.")

q(0, "A result comes back from the envelope calculator. What does it hold beside its figures?",
 "A basis block naming the rule applied and where it comes from, so the working can be printed.",
 ["A statistical band around each figure, drawn from the spread of the bids received.",
  "Signatures from the tender committee, recorded when the result is approved.",
  "Notes on the inputs it changed to make the call run without a refusal."],
 "Every result carries a basis block naming the rule it applied and its source, which the envelope calculator prints in the engine's words. The engine returns no statistical band here, records no signature, and changes no input: a bad input is refused by name.")

q(3, "Which of these does the engine leave uncomputed?",
 "A negotiation or best and final offer.",
 ["Arithmetic correction of each bill line against its quantity and unit rate.",
  "Completion-time adjustment for weeks beyond the stated minimum.",
  "The ranking of the bids, with its stated tie-break of three keys."],
 "The engine computes no negotiation or best and final offer, splits no tender into lots and compares no amount in words against figures. Correcting bills, adjusting for completion time and ranking with a stated tie-break are among the things it does compute.")

q(1, "How does the course name the Nigeria Public Procurement Act 2007 with its edition?",
 "Act No. 14, Official Gazette No. 65, Vol. 94, 19 June 2007, read on 2026-09-26.",
 ["The Seventh Edition, September 2025, read with the World Bank Regulations it adopts.",
  "Act No. 2, commenced 22 April 2010, as enacted and read on the same date.",
  "The February 2025 edition, published beside the Goods two-envelope SPD."],
 "The sources table gives the Act as Act No. 14 in Official Gazette No. 65, Vol. 94, 19 June 2007, read on 2026-09-26. The Seventh Edition is the World Bank Regulations, Act No. 2 of 2010 is a different statute the course reads at a later tier, and February 2025 is the Guidance and the Goods SPD.")

q(1, "In which edition does the course read the World Bank Standard Procurement Document, Request for Bids, Goods, two-envelope?",
 "February 2025, for ITB 34.1 and ITB 35.1 for goods.",
 ["September 2025, the same edition as the Works document the engine cites.",
  "Second Edition, July 2016, read for its worked examples in Annex I.",
  "The Nigerian gazette edition."],
 "The sources table lists the Goods two-envelope SPD at February 2025, read for ITB 34.1 and ITB 35.1, and the Works two-envelope SPD at September 2025. The gazette reference belongs to the Public Procurement Act 2007, and the 2016 edition belongs to a guidance the course reads at a later tier.")

q(3, "What work does tender EK-11/WS/2027-01 buy?",
 "A coiled tubing cleanout and matrix acid stimulation of Ekene-3 and Ekene-5.",
 ["Casing, wellhead valves, cement and baryte for two Ekene infill wells, delivered to the supply base.",
  "A land rig for a two-well drilling programme.",
  "Seismic acquisition over block EK-11."],
 "The well services tender is the synthetic coiled tubing cleanout and 15% HCl matrix acid job on Ekene-3 and Ekene-5, with six bill items from mob to demob. Casing, valves, cement and baryte are the materials tender EK-11/MS/2027-02, and neither Ekene tender buys a rig or seismic work.")

q(0, "How many bids does the materials tender receive, and on what basis is it awarded?",
 "Five, MS1 to MS5, with the award to the lowest evaluated cost.",
 ["Six, MS1 to MS6, awarded on the combined score at technical weight 0.7.",
  "Four, as MS5 withdrew.",
  "Five, awarded to the highest technical percentage, which is MS3 at 90.000000."],
 "The materials tender has five bids and states the award as the lowest evaluated cost, with a pass mark of 60. The combined award at 0.7 is the well services tender's, MS5 is a bid that fails the pass mark and never withdrew, and a technical percentage alone awards nothing.")

# m02: the technical envelope
q(2, "MS3 scores 4, 3 and 3 on specification (weight 60), delivery (25) and after-sales (15), each out of 4. What technical percentage does the engine return?",
 "90.000000, the top figure of the materials tender",
 ["360.000000, which is the weighted points total that MS3 earns on these scores.",
  "100.000000, since a full score on specification carries the whole technical envelope.",
  "75.000000"],
 "The terms are 60 x 4 / 4 = 60.000000, 25 x 3 / 4 = 18.750000 and 15 x 3 / 4 = 11.250000, which sum to 90.000000. 360.000000 is MS3's weighted points, a full score on one criterion earns only that criterion's weight, and 75.000000 is MS1's percentage at 3, 3 and 3.")

q(3, "Which well services bid returns the same technical percentage and weighted points as MS1 on the materials tender?",
 "WS2, at 75.000000 and 300.000000.",
 ["WS1, at 82.500000 and 330.000000, the nearest of the scored bids.",
  "WS5, since both bids sit on or near the pass mark of their tenders.",
  "No bid can, as the two tenders use different weights and criteria."],
 "MS1 returns 75.000000 and 300.000000, and so does WS2, which scores 3 on all five well services criteria. Different weights give the same figures when every score is 3 of 4 on criteria whose weights sum to 100. WS1 returns 82.500000 and 330.000000, and WS5 70.000000 and 280.000000.")

q(0, "A pass mark of 101 is entered in the technical envelope. What comes back?",
 "The same refusal as a missing pass mark: a number from 0 to 100, with no default.",
 ["Every bid fails the pass mark, and each is returned with the status fail-pass-mark.",
  "The pass mark is capped at 100, so only a bid with full marks everywhere passes.",
  "The pass mark is read as 101 weighted points and compared with each bid's points."],
 "The engine's message for both a missing pass mark and one of 101 is \"passMark must be a number from 0 to 100 (a percentage of the maximum technical score); there is no default\". The pass mark is a percentage, so a value outside 0 to 100 is refused and is neither capped nor reinterpreted, and no bid is scored against it.")

q(2, "A criterion is entered with a maxScore of 0. What does the engine return?",
 "A refusal: \"criteria[0].maxScore must be a finite number above 0\".",
 ["A term of zero for that criterion on every bid, whatever each bid scores on it.",
  "The criterion dropped from the tender and its weight shared among the others.",
  "A maxScore of 1 put in its place."],
 "Each term divides by the criterion's maxScore, which has no meaning at zero, so the engine refuses the criterion by name in the words quoted. It computes no zero term, drops no criterion and supplies no substitute scale.")

q(1, "A bid's scores include a score for price, which is not a criterion of the tender. What does the engine do?",
 "It refuses: price is not a criterion id, and the message lists the ids it accepts.",
 ["Price is scored with the weight left over once the named criteria are counted.",
  "The price score is ignored and the bid scored on the five criteria it knows.",
  "Moved into the commercial envelope, the price score is used at the next stage."],
 "The engine's message is \"bids[0].scores.price is not a criterion id; the accepted keys of bids[0].scores are the criterion ids methodology, personnel, equipment, hse, schedule\". A key that is an id is checked against the ids the call carries, so nothing is scored, ignored or moved.")

q(0, "The technical envelope's basis carries a source string. Which texts does it cite?",
 "Para 6.29 of the World Bank Regulations (7th ed.) and s.51(2) of the Public Procurement Act 2007.",
 ["ITB 35.1(a) and (b) of the Works SPD, two-envelope, with s.31(4) of the Public Procurement Act 2007.",
  "Annex X para 3.6 of the Regulations with s.24(3) and s.33(1) of the Public Procurement Act 2007.",
  "Figure IX and Annex 2 of the Guidance on Evaluating Bids and Proposals (February 2025)."],
 "The engine's basis.source for the technical envelope reads \"World Bank Procurement Regulations (7th ed.) para 6.29; Nigeria Public Procurement Act 2007 s.51(2)\". ITB 35.1 is the arithmetic rule, Annex X para 3.6 with s.24(3) belongs to the evaluated cost, and the Guidance's examples are recomputed as checks.")

q(3, "WS2 scores 3 of 4 on every well services criterion. What technical percentage results?",
 "75.000000, three quarters of each weight",
 ["300.000000, since the percentage is the sum of weight x score with no division.",
  "70.000000, which is WS5's percentage, as the two bids share the same quoted total.",
  "88.235294, its percentage once WS3's score of 85.000000 is set as the top of the scale."],
 "Each term is weight x 3 / 4, so the five terms are three quarters of 30, 25, 20, 15 and 10, summing to 75.000000. 300.000000 is WS2's weighted points, WS5's 70.000000 comes from its own scores whatever its price, and 88.235294 is WS2's relative technical score St in the combined score.")

# m03: arithmetic correction
q(1, "Across all six well services bills, how many lines does the engine correct, and by which rules?",
 "Two: WS2's ct-spread by unit-rate-prevails and WS5's acid by total-governs.",
 ["One, WS2's ct-spread, as WS5's flagged line is left alone.",
  "Six, one on each bill.",
  "Two, both by unit-rate-prevails."],
 "The correction table shows WS2 with 1 line corrected by unit-rate-prevails and WS5 with 1 line corrected by total-governs; every other line of every bid passes the test. WS5's line is corrected, its unit rate going to 1380, even though its amount and total stand.")

q(3, "correctArithmetic run on WS6's bill returns a correction of 0.000000 on 1004400.000000. Does that bill reach an evaluated cost?",
 "No; WS6 failed signed-bid-form, so its commercial envelope is never opened.",
 ["Yes, a clean bill goes straight on.",
  "Only as a reference for omissions.",
  "If the committee waives the requirement."],
 "The arithmetic view corrects any bill it is given, but in the tender the stages decide: WS6 fails a mandatory requirement at the technical stage, so its price is never opened, it prices no one's omission, and a clean bill is no ground to revisit a failed requirement.")

q(0, "A bill line gives decimalMisplaced as the text \"yes\". What does the engine return?",
 "A refusal: \"lines[0].decimalMisplaced must be true or false when given\".",
 ["Read as true, since any text that is not empty is taken to mean yes to the flag.",
  "False, with no message.",
  "The line left out of the total."],
 "The flag is a stated judgement and must be true or false, so the engine refuses text by name in the words quoted. It reads no text as true or false and excludes no line; a line with no flag given is simply checked by the ordinary rule.")

q(2, "A bill line carries a negative unit rate, minus 27000. What does the engine do?",
 "Refused: no unit rate may sit below 0.",
 ["It takes the size of the rate, 27000, and corrects the line from that figure.",
  "A credit, deducted from the total.",
  "A zero rate, with the amount governing."],
 "A negative unit rate is refused in the engine's words: \"lines[0].unitRate must be a finite number at or above 0\". The engine changes no sign, books no credit, and sets no rate on its own, since each would be a correction nobody stated.")

q(1, "A bill line is typed with no id. Why does the engine refuse it?",
 "Every correction names its line, so each line needs a non-empty id.",
 ["Because the engine prices each line by looking its id up in a stored list of rates for the tender.",
  "The id sets the order of the sum.",
  "An unnamed line is read as a total."],
 "The engine's message is \"lines[0].id must be a non-empty string\": each corrected line is reported by its id, so a line with none could not be named in the reasons. The engine holds no list of rates, adds the lines in any order to the same corrected total, and a stated total is its own input, quotedTotal.")

q(3, "The engine's reason for WS2's ct-spread line says the gap is more than 0.005. What is that 0.005?",
 "The default tolerance, used because the call stated none.",
 ["The ratePerWeek of the well services schedule, which also reads 0.005.",
  "A fraction of the line amount, so a gap under half a percent is ignored.",
  "A share of WS2's quoted total."],
 "The arithmetic basis reads \"a line is in discrepancy when |quantity x unit rate - quoted amount| > 0.005\" at the default tolerance, half a cent in money. The schedule's ratePerWeek happens to print as 0.005 too, but it is a different setting; the tolerance is an amount of money, and WS2's correction is 18000.000000.")

q(0, "A bid's bill is sent to the arithmetic correction with an empty list of lines. What comes back?",
 "A refusal: \"lines must be an array of at least 1 entry\".",
 ["A corrected total of 0.000000 and a correction equal to the quoted total.",
  "The quoted total accepted as it stands, since there are no lines to check.",
  "Every item treated as omitted."],
 "The engine checks that a bill is a bill before any arithmetic, so an empty list of lines is refused by name. It builds no zero total, accepts no unchecked total, and does not turn a missing bill into omissions.")

# m04: the evaluated cost
q(1, "WS2 finishes in 8 weeks. Which base does its completion adjustment of 8674.000000 use?",
 "867400.000000, its corrected price, with no discount to deduct",
 ["849400.000000, its quoted total, since the rate is applied to the price as bid.",
  "885574.000000, its evaluated cost.",
  "862141.000000, one shared base."],
 "The adjustment is 0.005 x 2 weeks x (corrected price less discount), and the engine's reason prints 0.005 x 2 x 867400 = 8674. The quoted total would carry the arithmetic slip into the charge, the evaluated cost already contains the adjustment, and no common base is used.")

q(2, "How much does WS3's one late week add to its evaluated cost?",
 "4590.000000, one week at 0.005 of 918000",
 ["0.005 x 2 x 918000, counting the week the job starts in.",
  "0.000000, as the minimum is only exceeded by a single week.",
  "12741.000000, the adjustment WS5 carries for its later finish."],
 "One week beyond the minimum gives 0.005 x 1 x 918000 = 4590, as the engine's reason prints. Only weeks beyond minWeeks count, every such week is charged, and 12741.000000 is WS5's adjustment for 3 weeks.")

q(0, "Among the four passing well services bids, WS1 quotes the most. Where does it rank on evaluated cost?",
 "Third, at 928200.000000, ahead of WS3.",
 ["Fourth, since the ranking on evaluated cost keeps the order of the quoted totals.",
  "First, because its discount and a finish in 6 weeks leave it with no additions.",
  "Second, just behind WS5, as only WS5 has a smaller quoted total than WS1."],
 "The engine ranks WS5 862141.000000, WS2 885574.000000, WS1 928200.000000 and WS3 957990.000000. WS1's discount and its zero completion charge lift it above WS3, whose omission and week late add 35400.000000 and 4590.000000, but WS5 and WS2 stay below it.")

q(3, "What happens when the schedule's ratePerWeek is typed as 2?",
 "A refusal: the rate must be a fraction from 0 to 1 of the price for each week beyond minWeeks.",
 ["Adjustments at twice the price for each late week, which would decide every award at once.",
  "A rate of 2 percent, read as a percentage, applied to the corrected price less the discount.",
  "A rate capped at 1, so each late week adds the whole price to the evaluated cost."],
 "The engine's message is \"schedule.ratePerWeek must be a fraction from 0 to 1 of the price for each week beyond minWeeks\". It computes nothing on an out-of-range rate, reinterprets no figure as a percentage, and caps nothing.")

q(1, "A schedule is stated but one bid gives no completion weeks. What happens?",
 "The engine refuses, because every bid must give its completion weeks when a schedule is given.",
 ["Charged for the maximum of 10 weeks, the worst case the tender allows.",
  "Treated as finishing at the minimum of 6 weeks, so no charge is added.",
  "Excluded at the commercial stage for failing to state a completion time."],
 "The engine's message is \"bids[0].completionWeeks must be a finite number at or above 0 when a schedule is given\". It assumes neither the maximum nor the minimum, and a missing input is a refusal before the evaluation runs, so no exclusion is returned.")

q(2, "A learner types maxWeek for maxWeeks in the schedule. What comes back?",
 "The refusal \"schedule.maxWeek is not an accepted key; the accepted keys of schedule are minWeeks, maxWeeks, ratePerWeek\".",
 ["A schedule with no maximum, so that no bid is rejected however late it finishes.",
  "The value read as maxWeeks, since the engine corrects a near miss in a key name.",
  "The schedule dropped, with every completion adjustment returned as 0.000000."],
 "An input key the function does not read is refused at whatever level it sits, with its path and the accepted keys, in the engine's words. A misspelt optional key never silently drops a term, so the engine neither runs without a maximum, guesses the intended key, nor drops the schedule.")

q(0, "A best estimate is stated for mob, an item no bid omits. What does the engine return?",
 "A refusal: mob is no item any bid omits, and nitrogen is the only accepted key.",
 ["Stored for later use, in case a bid is found to omit mob afterwards.",
  "Added to every bid's mob line as an Employer's check on the price.",
  "Ignored, with nitrogen priced at the average of the three other bids."],
 "The engine's message is \"bestEstimates.mob is not an item any bid omits; the accepted keys of bestEstimates are the omitted item ids nitrogen\". A key that is an id is checked against the ids the call carries, so an estimate for an item nobody omits is neither stored, applied nor ignored.")

q(3, "Which paragraph of the World Bank Regulations does the engine cite first as the source of the evaluated cost?",
 "Annex X para 3.6 of the Seventh Edition",
 ["Para 6.29, the paragraph that describes the two-envelope process itself.",
  "Para 5.69, the paragraph that sets out the Most Advantageous Bid award.",
  "ITB 34.1, the clause that prices an omitted item at the average of the others."],
 "The engine's basis.source for the evaluated cost begins \"World Bank Procurement Regulations (7th ed.) Annex X para 3.6\" and adds s.31(14), s.32(3), para 5.70, s.24(3) and s.33(1). Para 6.29 is cited for the technical stage, ITB 34.1 belongs to the Works SPD, and para 5.69 sets out the Most Advantageous Bid, which the evaluated cost basis does not cite.")

# m05: the combined score
q(2, "Take WS1's evaluated cost, 928200.000000, and the lowest, 862141.000000. What is WS1's Sc?",
 "92.883107, from 100 x 862141 / 928200",
 ["97.058824, the ratio of WS1's technical percentage to WS3's.",
  "100.000000, since its discount makes WS1 the lowest bid on cost.",
  "95.806109, the combined figure that places WS1 second of the four."],
 "Sc = 100 x Cmin / C with Cmin = 862141 gives WS1 92.883107. 97.058824 is WS1's St, 100.000000 belongs to WS5 alone, and 95.806109 is WS1's combined score B at technical weight 0.7.")

q(1, "WS3 has the largest evaluated cost of the four responsive bids, 957990.000000. What commercial score does it get?",
 "89.994781, still near 90",
 ["0.000000, as the dearest bid is placed at the bottom of the commercial scale.",
  "82.352941, which is the lowest commercial score that the ratio can give a bid.",
  "100.000000, since the combined score rescales each part to reach 100."],
 "The lowest ratio gives 100 x 862141 / 957990 = 89.994781. It compresses cost differences, so the dearest bid still scores near 90; it sets no bottom at zero. 82.352941 is WS5's St, and only the lowest evaluated cost scores 100 on price.")

q(3, "With Thigh 85.000000, what relative technical score does WS2 receive?",
 "88.235294, from 100 x 75 / 85",
 ["75.000000, the percentage as scored, since the relative method leaves it alone.",
  "97.353920, which is WS2's figure once its evaluated cost is set against Cmin.",
  "90.970882, the combined score that ranks WS2 third at a weight of 0.7."],
 "St = 100 x T / Thigh gives WS2 100 x 75 / 85 = 88.235294. 75.000000 unchanged would be the absolute method, 97.353920 is WS2's commercial score Sc, and 90.970882 is its combined score B.")

q(0, "Which commercial score does the engine return for Company B, where the Guidance prints 88?",
 "88.000018, the engine's exact figure",
 ["84.266670, B's combined score, printed as 84.26.",
  "66.666667, B's weighted technical part at 0.8.",
  "100.000000, as for C."],
 "At technical weight 0.8 the engine returns B's Sc as 88.000018, which the Guidance prints to its own precision as 88; a printed figure that agrees to its shown digits is still a rounding of the engine's. 84.266670 is B's combined score B, 66.666667 is 0.8 x St, and Sc 100.000000 belongs to C, the lowest cost of the four.")

q(2, "In the Guidance's Annex 3, A has 240.000000 weighted points and B 190.000000. What St does B receive under relative scoring?",
 "79.166667, from 100 x 190 / 240",
 ["190.000000, as B's points pass unchanged into the combined score.",
  "100.000000, since B has the lowest cost and scores 100 on price.",
  "91.666667, the combined score B reaches at technical weight 0.4."],
 "Relative scoring divides by the top bid: 100 x 190 / 240 = 79.166667, and A scores St 100.000000. Weighted points enter only as that ratio, B's 100.000000 is its Sc, and 91.666667 is B's combined score, below A's 94.375000.")

q(3, "The technical method is left out of a combined score. What does the engine return?",
 "A refusal naming technicalMethod, with no default.",
 ["The relative method, which the well services tender states, applied by default.",
  "The absolute method, the simpler of the two, applied until one is stated.",
  "Commercial score alone."],
 "The engine's message is \"technicalMethod must be 'relative' (100 x T / Thigh) or 'absolute' (T as scored); there is no default\". It borrows no method from a fixture, prefers neither method, and drops no part of the score.")

q(1, "What is wrong with entering 120 as a bid's technicalPercent in the combined score view?",
 "It exceeds the whole available score; the engine refuses any value above 100.",
 ["Nothing, as an St above 100 simply sets Thigh.",
  "Only that it is capped at 100 in silence.",
  "The bid is then excluded with a reason."],
 "No proposal can earn more than the whole available score, so the engine refuses the value with \"bids[0].technicalPercent must be a number from 0 to 100\". It computes no St above 100, caps nothing silently and returns no exclusion, since a bad input is refused before any ranking.")

# m06: reading an award
q(0, "In the stated tie of T1, T2 and T3, T3's receipt is moved to 08:00:00 on the same day. How are the three ranked?",
 "T3 leads; T1 follows on receipt time, and T2 comes last on its code.",
 ["T1, T2, T3 as before, since receipt time is used only between T1 and T2.",
  "T3, then T2, then T1.",
  "All three at rank 1."],
 "With equal scores and costs the earlier receipt decides, so T3 at 08:00 ranks first; T1 and T2 share 09:00 and the bidder id puts T1 before T2 (engine run, tieBrokenBy null, earlier receipt, bidder id). Receipt time applies to every tied pair, the id orders ascending, and every ranking is strict.")

q(2, "WS3 is most advantageous at technical weight 0.7. Where does it rank on evaluated cost among the four responsive bids?",
 "Fourth, at 957990.000000",
 ["First, since the most advantageous bid is the bid that costs the company least.",
  "Second, behind WS5, as its omission is priced at an average of the others.",
  "Third, ahead of WS1, whose discount is offset by the early finish it offers."],
 "Evaluated cost ascending, WS3 is last of the four at 957990.000000, with its nitrogen omission and one late week added to 918000.000000. The combined score weighs its best technical proposal at 0.7, which is how the fourth-lowest evaluated cost becomes most advantageous.")

q(1, "Every well services row of the evaluated cost ranking shows tieBrokenBy as null. What does that tell you?",
 "No two evaluated costs tie, so no tie-break rule was used.",
 ["The tie-break rules were switched off for this tender by its stated settings.",
  "Every bid tied, and the engine left the order as the bids were typed in.",
  "Receipt times were missing."],
 "tieBrokenBy names the rule that ordered a row against the row above it, and it is null when no rule was needed. The four evaluated costs all differ, the tie-break is always on, and every bid carries a receipt time in the stated UTC form.")

q(3, "In the whole tender, WS2 is given a stated rejection reason and WS1 a completion of 11 weeks. Which bid is awarded under the combined basis?",
 "WS3, since neither change touches it or its lead over WS5.",
 ["WS5, as the rejection of two bids moves the award to the lowest evaluated cost.",
  "No bid at all.",
  "WS1, charged for lateness."],
 "WS2 and WS1 are both excluded at the commercial stage with their reasons, and the engine still awards WS3 (engine run): WS3 and WS5 remain, and Cmin and Thigh are unchanged. A bid beyond maxWeeks is excluded without a charge, and the award basis stays combined whatever is excluded.")

q(0, "Which function returns the refusal \"bids has no bid left to score: every bid is rejected\"?",
 "rankTender, the combined score view of the envelope calculator.",
 ["technicalEvaluation, when every bid fails a mandatory requirement or the pass mark.",
  "correctArithmetic, on a bad bill.",
  "evaluatedCosts, on late bids."],
 "The refusal table lists this message under rankTender alone, with the field bids. A bid failing the technical envelope is returned with its reason, a line in discrepancy is corrected, and a bid beyond maxWeeks is excluded with its reason: each of those is a result.")

q(1, "The well services tender under a combined award excludes WS4 and WS6. Which bids does the ranking of the combined score hold?",
 "WS3, WS1, WS2 and WS5, in that order.",
 ["All six, with WS4 and WS6 placed last on a combined score of 0.000000.",
  "WS3, WS1, WS2, WS5 and WS4, as WS4 was scored and so can be ranked.",
  "WS3 and WS5 alone."],
 "Only the responsive bids are ranked, and the engine orders them WS3 96.998434, WS1 95.806109, WS2 90.970882, WS5 87.647059. Excluded bids appear in the exclusions with their reasons and carry no combined score, WS4's price was never opened, and every responsive bid is ranked.")

emit(Q, '/root/cat-wip-procurement/banks/sc2b_exam.json', expect_n=42)
finish()
