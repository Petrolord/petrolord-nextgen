import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# SC2 Associate m02, The Technical Envelope.
# Sources: the technical envelope's rule and its tables for both Ekene
# tenders, the engine's verbatim reasons for WS4, WS6, MS5 and the double
# mandatory failure, the Guidance's Figure IX and Annex 2 recomputed, and the
# technicalEvaluation refusals. The keyed figures were re-run through the
# engine (scratch/bank-beginner/witness.mjs).

q(2, "WS6 meets bid-security and does not meet signed-bid-form. What does the technical envelope return for it?",
 "The status fail-mandatory: it is never scored and its price stays sealed.",
 ["Its scores are computed, and its price envelope is opened only if it clears the mark of 70.",
  "A pass, since four of its five criterion scores are 4 and its proposal is the strongest on paper.",
  "A refusal naming bids[5].mandatory, as an invalid input."],
 "A bid that fails a mandatory requirement is excluded before it is scored, with the reason \"failed the mandatory requirement signed-bid-form; the bid is not scored and its commercial envelope is not opened\". Its scores are never read, however strong, and the exclusion is a result with a reason, so no field is refused.")

q(0, "The technical envelope returns two figures for WS1. Which pair does it return?",
 "82.500000 percent and 330.000000 weighted points.",
 ["330.000000 percent and 82.500000 weighted points, the two figures read the other way round.",
  "An identical 82.500000 for both, since the weighted points are the same sum as the percentage.",
  "A technical score of 97.058824 percent and 330.000000 weighted points for the bid."],
 "technicalPercent is the sum of weight x score / maxScore, 82.500000 for WS1; weightedPoints is the sum of weight x score, 330.000000, with no division by the maxScore of 4. The two differ by that factor. 97.058824 is WS1's relative technical score St in the combined score, a different figure built later from the percentage.")

q(1, "WS5 scores exactly 70.000000 on a tender whose pass mark is 70. What happens to it?",
 "It passes, and its price envelope is opened.",
 ["It fails, because a bid must score strictly above the pass mark for its price to be opened.",
  "A committee decides it.",
  "Its status becomes fail-pass-mark with the reason that 70 is not above the pass mark 70."],
 "The engine's basis reads \"a bid passes when technicalPercent >= 70\": the test is greater than or equal, so a bid at the pass mark passes. WS5 goes on to hold the lowest evaluated cost. The engine leaves no bid undecided, and no reason of the kind described exists.")

q(3, "WS3 scores 4 of 4 on personnel, a criterion weighted 25. What term does personnel add to WS3's technical percentage?",
 "25.000000, the whole weight of the criterion.",
 ["100.000000, the weight times the score before any division by the maxScore of 4 is made.",
  "18.750000, three quarters of the weight, which is the personnel term that WS1 earns.",
  "22.500000, the term that WS3 earns on methodology, where it scores 3 of a possible 4."],
 "Each term is weight x score / maxScore: 25 x 4 / 4 = 25.000000. 100.000000 is the weighted points term, with no division by maxScore. 18.750000 is 25 x 3 / 4, which WS1 earns on personnel, and 22.500000 is WS3's methodology term, 30 x 3 / 4.")

q(0, "WS4 is scored at 65.000000 against a pass mark of 70. How does the engine report it?",
 "Status fail-pass-mark, with the reason \"technical score 65 is below the pass mark 70; the commercial envelope is not opened\".",
 ["A refusal naming passMark, since a bid that scores below the mark counts as an invalid input to the call.",
  "Status pass with a flag, because 65.000000 lies within five points of the mark and is close enough to open.",
  "Status fail-mandatory, as a bid below the pass mark is treated like one that failed a requirement."],
 "WS4 is scored and falls short, so the engine returns fail-pass-mark with the reason quoted, in its own words. A score below the mark is a result with its reason and no invalid input, there is no margin of closeness in the rule, and fail-mandatory is kept for a failed requirement, which WS4 did not have.")

q(2, "Stated as a test, WS1 fails both bid-security and signed-bid-form. What reason does the engine give?",
 "It names both: \"failed the mandatory requirements bid-security, signed-bid-form; the bid is not scored and its commercial envelope is not opened\".",
 ["Only bid-security, the first requirement failed, since the check stops at the first failure it meets.",
  "A reason for each requirement on separate rows, with WS1 listed twice among the bids excluded.",
  "A technical percentage of 0.000000 and the status fail-pass-mark, since no requirement counted."],
 "When a bid fails more than one requirement the engine names every failed requirement in one reason, so the report to the bidder is complete. It does not stop at the first, it lists the bid once, and a mandatory failure is never scored, so there is no percentage and no fail-pass-mark status.")

q(1, "An evaluator leaves WS1's hse score blank. What does the technical envelope do?",
 "It refuses: \"bids[0].scores.hse must be a number from 0 to 4 (the criterion's maxScore)\".",
 ["Zero is taken for hse, which gives WS1 a technical percentage of 71.250000 in place of 82.500000.",
  "It rescales the four criteria that were scored so that their weights again sum to 100.",
  "WS1 is excluded as fail-mandatory, with the missing hse score named as the failed requirement."],
 "A missing score is refused with the same message as a score out of range, in the engine's own words. The engine never treats a blank as zero, which would sink a bid on a clerical slip (82.500000 less the hse term of 11.250000 would give 71.250000). It does not rescale the weights either, and a score is no mandatory requirement.")

q(3, "A score of 5 is typed for WS1's methodology, a criterion with a maxScore of 4. What comes back?",
 "The call is refused, and the message names methodology and its scale of 0 to 4.",
 ["WS1 scores above 100 percent, and the panel prints the excess as a bonus beside the pass mark.",
  "The score is capped at 4 without a word.",
  "Each bid's methodology scale is raised to 5."],
 "A score above its criterion's maxScore is refused, naming the criterion: bids[0].scores.methodology must be a number from 0 to 4. The engine caps nothing silently, changes no scale on its own, and a technical percentage cannot exceed 100.")

q(3, "The Guidance's Figure IX scores Company A 2, 2, 2 and 1 on criteria weighted 50, 25, 15 and 10, each out of 4. Which engine figure matches the printed 190?",
 "The weighted points, 190.000000.",
 ["The technical percentage, which the engine returns as 190.000000 for Company A.",
  "Neither of the two, since the Guidance prints weighted points to two decimals only.",
  "Both of them, because on a scale of 4 the percentage and the points always agree."],
 "Weighted points are the sum of weight x score, the total the Guidance prints in Figure IX, and the engine returns 190.000000 against the printed 190. The technical percentage divides each term by its maxScore and is 47.500000. On a scale of 4 the points are four times the percentage, so the two share an order and differ in value.")

q(0, "On the materials tender, with a pass mark of 60, which bid fails?",
 "MS5, at 50.000000, whose price is never opened.",
 ["MS4, at 68.750000, the lowest of the five scores and so the one below the mark.",
  "No bid fails, since every materials bid meets both of its mandatory requirements.",
  "MS2, at 71.250000, which misses the mark once its after-sales score of 2 is counted."],
 "The engine returns MS5 at 50.000000 with the reason \"technical score 50 is below the pass mark 60; the commercial envelope is not opened\". MS4's 68.750000 is above 60 and is not the lowest score, meeting every mandatory requirement does not pass the pass mark, and MS2's 71.250000 clears 60.")

q(2, "The Guidance's Annex 2 scores companies in points out of 15, 15 and 70 against a threshold of 80. On its printed criterion scores, which company passes?",
 "C alone, at 91.000000, with A at 59.000000 and B at 77.000000 below the threshold.",
 ["B and C, since B's 77.000000 rounds up to the threshold once the scores are weighted.",
  "All three, since the threshold applies criterion by criterion.",
  "A and C, as A's 48 points outweigh its first two scores."],
 "With weights equal to the maximum points, the technical percentage equals the points total: A 59.000000, B 77.000000, C 91.000000. Only C reaches 80, so the engine returns fail-pass-mark for A and B. Nothing rounds 77.000000 up, the threshold applies to the total, and A's total is lowest of the three.")

q(1, "Why does the engine require the criterion weights to sum to 100?",
 "It reads the weights as percentages of the technical judgement, checked to within 1e-9.",
 ["Because the pass mark is fixed at 100 points and the weights must add up to meet it.",
  "So that weighted points and the technical percentage return the same figure for each bid.",
  "Because the World Bank Guidance requires every tender to use exactly five criteria."],
 "WEIGHT_SUM is 100 and WEIGHT_SUM_TOLERANCE is 1e-9: the weights are percentages, and the tolerance absorbs binary rounding. The pass mark is a stated input with no default, weighted points differ from the percentage by the maxScore, and the materials tender has three criteria.")

q(0, "On the well services tender, how do each bid's weighted points relate to its technical percentage?",
 "They are four times the percentage, because every criterion there is scored out of 4, so both give one order.",
 ["Each term is divided by the weight, so a heavy criterion counts for less in the points total.",
  "The two can order bids differently, which is why the pass mark is set on the points total.",
  "Exactly equal, as WS5's 280.000000 points against 70.000000 percent show."],
 "Weighted points skip the division by maxScore, and on the well services scale every maxScore is 4, so the points are four times the percentage (WS5: 280.000000 and 70.000000) and the maximum is 400. Nothing divides by the weight, the two figures give the same order there, and the pass mark applies to the technical percentage.")

q(3, "A bid's mandatory entry carries an id and no met flag. What does the engine do?",
 "It refuses the entry, because it will not assume a requirement was met.",
 ["It reads the missing flag as met and scores the bid, since nobody recorded a failure against it.",
  "It reads the missing flag as not met and returns the bid as fail-mandatory with that id named.",
  "Ignoring the entry, it scores the bid."],
 "The engine's message is \"bids[0].mandatory[0] must be { id: a non-empty string, met: true or false }\". It assumes neither met nor not met, and it does not drop the entry. Only a bid with no mandatory list at all is simply scored, since the list is optional when not given.")

q(1, "What technical percentage does the engine return for WS6?",
 "None: WS6 is never scored, so its row carries null.",
 ["0.000000, as for a bid meeting no criterion.",
  "65.000000, the figure a failed bid is given so that WS4 and WS6 rank level.",
  "A hidden figure from its scores."],
 "WS6 fails a mandatory requirement and is excluded before scoring, so its technicalPercent and weightedPoints are null. A null is different from a percentage of zero, which a scored bid could earn. 65.000000 is WS4's own score, and the engine computes nothing for WS6 to hide.")

emit(Q, '/root/cat-wip-procurement/banks/sc2b_m02.json', expect_n=15)
finish()
