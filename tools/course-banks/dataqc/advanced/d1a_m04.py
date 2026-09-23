import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D1 Expert m04, The scorecard.
# Figures from digest Section 29 (the EKENE-3 scorecard, the tie, the mixed
# direct and counted rows, the basis block), Section 4 (the weights refusal),
# Section 1 (DIMENSIONS, what the engine does not do), Section 9 (87 days
# checked) and Section 31 (grade bands are not built).

q(2, "EKENE-3's completeness row is counted from the oil column: 90 checked and 3 failed. What score does the scorecard give it?",
 "0.966667, which is 1 - failed / checked",
 ["0.977011, since the three missing days are left out and the score is taken over the 87 days that were present",
  "0.950000, the completeness score the scorecard uses for every completeness row in the course",
  "3, the count itself, since the scorecard reports counts and leaves the arithmetic to the caller"],
 "The basis block reads, verbatim: score \"score, or 1 - failed / checked\". 1 - 3 / 90 is the printed 0.966667. 0.977011 is the validity and plausibility score, 2 failed in 87. 0.950000 is RHOB's completeness passed as a direct score in the mixed example. A count becomes a score between 0 and 1 by that rule.")

q(0, "EKENE-3's uniqueness row reads 13 checked, 6 failed and a score of 0.538462. What counts as a failed name?",
 "A name that duplicates an earlier one in the list",
 ["Every name that appears in any reported pair, exact, normalised or near, including the first name of each pair",
  "Each reported pair, so the 10 pairs from the name check are the failures, capped at the 13 names checked",
  "Only the exact repeat, EKENE-3 at entry 3"],
 "Section 29: uniqueness comes from the well names, and a name is failed when it duplicates an earlier one, which gives 6 of 13 and the printed 0.538462. The first name of a pair is the original and is not counted. Section 15's 1 exact, 8 normalised and 1 near pairs are pairs; the scorecard counts names. The normalised and near duplicates count as well as the one exact repeat.")

q(3, "With no weights passed, what does EKENE-3's scorecard return as its total?",
 "0.889531, the plain mean of the five scores",
 ["0.927390, since with no weights passed the engine applies the Petrolord weights 3, 2, 2, 1 and 1 as its default set",
  "0.538462, since with no weights the total falls back to the score of the weakest dimension, uniqueness",
  "A refusal naming `weights`"],
 "Section 29: with no weights every listed dimension weighs the same, 0.200000 each for five, and the total is 0.889531. 0.927390 is the total at the stated weights 3, 2, 2, 1 and 1, which a caller states; the engine has no default set of unequal weights. The weakest dimension is reported beside the total. A refusal comes when some weights are given and one is missing.")

q(1, "EKENE-3's weights are stated as 3, 2, 2, 1 and 1. What does the engine do with them before it forms the total of 0.927390?",
 "It divides each by their sum, so completeness weighs 0.333333 and uniqueness 0.111111",
 ["It divides each by the largest weight, 3, so completeness weighs 1",
  "It uses them as written, so the total can pass 1",
  "It resets them to equal weights of 0.200000"],
 "The basis block reads, verbatim: weights \"caller weights, normalised by their sum\". The sum is 9, so the normalised weights are 0.333333, 0.222222, 0.222222, 0.111111 and 0.111111, and the weighted mean is 0.927390. The largest weight is not the divisor, the raw weights are never used as written, and 0.200000 is the equal weight used only when no weights are passed.")

q(3, "Which dimension does EKENE-3's scorecard name as weakest, with equal weights and with the stated weights 3, 2, 2, 1 and 1?",
 "Uniqueness in both, at 0.538462",
 ["Uniqueness with equal weights, and plausibility with the stated weights, since plausibility then carries the smallest normalised weight",
  "Completeness in both, since it carries the largest share of the total at the stated weights and so of the risk",
  "Uniqueness with equal weights, and no dimension with the stated weights, since a weight of 1 marks a dimension as minor"],
 "The weakest is the lowest SCORE, and a tie goes to the dimension listed first. Uniqueness scores 0.538462 whatever the weights, and the digest prints it weakest in both rows. Plausibility and uniqueness share the smallest normalised weight, 0.111111, and weights do not enter the choice. Completeness scores 0.966667, and every listed dimension takes part.")

q(0, "A stated example scores validity 0.9, completeness 0.9 and consistency 0.95, listed in that order. What does the scorecard return?",
 "Weakest validity, total 0.916667",
 ["Weakest completeness, since completeness comes first in the engine's DIMENSIONS order and wins every tie",
  "Weakest validity and completeness together, reported as a tie so the caller can choose between them",
  "Weakest consistency, since a tie at the bottom is resolved by passing the flag to the next score up"],
 "The basis block's tie break, verbatim: \"the weakest is the lowest score; a tie goes to the dimension listed first\". Validity is listed first in this call, so it is named, and the equal-weight total is 0.916667. The listing order of the call decides the tie, and the display order of DIMENSIONS does not. The engine names one weakest dimension, and consistency at 0.95 is higher.")

q(2, "A scorecard call gives weights for completeness, consistency, uniqueness and plausibility and leaves validity's weight out. What does the engine return?",
 "A refusal naming `weights.validity`: weights.validity is missing: give every listed dimension a weight, or none for equal weights",
 ["A total with validity weighted 0, since a dimension given no weight drops out of the mean",
  "A total with validity given the mean of the other four weights, so the stated proportions are kept",
  "A total with all five dimensions at equal weights, since a partial set of weights is discarded"],
 "Section 4 prints the refusal in the engine's own words. A weight must be given for every listed dimension or for none. A zero would drop the dimension silently, the mean of the others would be a weight nobody chose, and falling back to equal weights would ignore the four the caller did state, so the engine refuses and names the field.")

q(1, "RHOB completeness is passed as a direct score of 0.950000, beside NPHI validity counted as 237 checked and 10 failed. What does the scorecard return?",
 "A total of 0.953903, from a direct score and a counted one side by side",
 ["A refusal, since every row must be scored by the same rule",
  "A refusal, since the two rows describe different channels of EKENE-7's log and a scorecard needs one channel",
  "A total of 0.950000, since a direct score replaces the counts"],
 "Section 29: each dimension scores either `score` directly or 1 - failed / checked, and a direct score and a counted one mix; the digest prints a total of 0.953903. Each row carries its own rule, so the engine accepts two kinds together and rows from two channels together. A direct score is one row's score and the counted row still enters the total.")

q(0, "Which dimension adds least to EKENE-3's total at the stated weights 3, 2, 2, 1 and 1, and by how much?",
 "Uniqueness, with a weighted contribution of 0.059829",
 ["Plausibility, with 0.108557, since plausibility and uniqueness share the smallest weight and plausibility is listed last",
  "Completeness, the dimension with the largest weight",
  "Consistency, with 0.219668, since it failed on only 1 day and so contributes least to what the total measures"],
 "The contribution is the score times its normalised weight: uniqueness is 0.538462 times 0.111111, the printed 0.059829, the smallest of the five. Plausibility has the same weight and a far higher score, 0.977011, so its 0.108557 is larger. Completeness contributes the most, 0.322222. Consistency's 0.219668 is the second largest; a low failure count raises a contribution.")

q(2, "Besides the total, what does EKENE-3's scorecard return?",
 "The weakest dimension, and nothing that grades the total",
 ["A confidence interval on the total, drawn from the counts checked in each of the five dimensions",
  "A ranking of all five dimensions, strongest first",
  "A count of distinct failed entries across dimensions"],
 "Section 29: the total is the weighted mean and the weakest dimension is the lowest score; there are no grade bands, since a band would be an invented number, and Section 31 lists grade bands as not built. The engine returns no interval and no full ranking. It counts flags from checks per dimension, and two checks can flag the same entry, so it does not produce a distinct-entry count.")

q(3, "EKENE-3's plausibility row counts the modified z-score's flags on oil, entries 46 and 59. What does that mean for how the scorecard counts day 47?",
 "Day 47 is counted under validity and again under plausibility",
 ["Day 47 is counted once, since the scorecard removes an entry from a later dimension when an earlier one has already failed it",
  "Day 47 is not counted, since entry 46 is day 46",
  "Day 47 is counted under completeness as missing"],
 "Entries 46 and 59 are days 47 and 60, because the engine counts entries from 0: the negative rate and the shut-in day. The negative rate, day 47, is flagged under validity too, and Section 29 says a scorecard counts flags from checks and two checks can flag the same entry. Nothing is removed between dimensions. A negative rate is a present value, so completeness does not count it.")

q(1, "Which check is EKENE-3's consistency score of 0.988506 counted from?",
 "phaseSumCheck, oil plus water against gross: 87 checked and 1 failed",
 ["waterCutCheck at the default tolerance of 1e-6, which fails 83 days of the 90 on the production sheet",
  "cumulativeCheck on the cumulative oil, which flags day 70",
  "frozenRuns on gas, the stuck meter from day 74 to day 81"],
 "Section 29 lists consistency from phaseSumCheck, and 1 - 1 / 87 is the printed 0.988506: day 40 is the one failure, and 3 days carry no sum. The water cut, cumulative and frozen-run checks are consistency checks too, and the EKENE-3 scorecard was counted from none of them. A scorecard collects counts from checks already run, one stated check per dimension.")

q(0, "Which dimension names does the engine export in `DIMENSIONS`, in display order?",
 "completeness, validity, consistency, uniqueness, plausibility",
 ["completeness, validity, consistency, uniqueness, timeliness",
  "validity, completeness, consistency, plausibility",
  "accuracy, validity, consistency, uniqueness, plausibility"],
 "Section 1 prints the five names in display order: completeness, validity, consistency, uniqueness and plausibility. The engine has no timeliness or accuracy dimension, and uniqueness is one of the five. The order matters only for display, and a tie for weakest is broken by the order of the call, which the caller controls.")

q(3, "EKENE-3's validity row is counted from rateCheck on oil, 87 checked and 2 failed. Why 87 and not 90?",
 "The three missing oil days are not checked, so 87 days are",
 ["Three days carry a zero rate while shut in, and the rate check leaves out every day on which the well was shut in",
  "The check drops the three days it flagged as outliers, and 2 of the remaining days failed",
  "The scorecard trims the first three days of a series"],
 "Section 9: 87 days checked, 2 failed; the three missing days are not checked. Day 60 is shut in with an oil rate of 0.000000 and is checked and not flagged, and day 61's positive rate while shut in is one of the 2 failures. Outlier tests are a different check. The scorecard takes the counts the check returned.")

q(2, "Four of EKENE-3's five scores lie between 0.966667 and 0.988506 and uniqueness is 0.538462. What does the equal-weights total of 0.889531 show on its own?",
 "A mean of the five scores, which does not name which dimension is weak; the weakest dimension is returned beside it for that",
 ["That the weights favour the strong dimensions, since only unequal weights lift a total above the weakest score",
  "That every dimension scored 0.889531 or better, since a mean cannot sit above any of the scores it is formed from",
  "That uniqueness is the weakest dimension, since the total is weighted towards the lowest score"],
 "The total is the weighted mean, here the plain mean at equal weights, and the strong dimensions carry it. It does not say which dimension was weak, so the engine reports the weakest, uniqueness at 0.538462, beside it. The engine grades nothing: it carries no grade band for a score. A mean does sit above its lowest member, and equal weights do not favour any score.")

emit(Q, '/root/dai-wip-dataqc/banks/d1a_m04.json', expect_n=15)
finish()
