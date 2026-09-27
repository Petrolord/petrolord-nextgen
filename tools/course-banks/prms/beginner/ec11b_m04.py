import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC11 Associate m04, Categories and the Range of Uncertainty.
# Sources: the labels by class; the Ekene Main Reserves stated cumulatively
# with their increments; Ekene North both ways; the Prospective case; one value
# for the range; the refusals of categorize. Every key rests on a digest line
# or an engine return re-run in
# /root/cat-wip-prms/scratch/bank-beginner/witness.mjs.

q(1, "Which labels does the engine give the low, best and high estimates of Contingent Resources?",
 "1C, 2C and 3C.",
 ["1P, 2P and 3P.",
  "1U, 2U and 3U.",
  "C1, C2 and C3."],
 "Each class has its own letter (PRMS 2.2.2.2 to 2.2.2.4): P for Reserves, C for Contingent Resources and U for Prospective Resources, with the number counting up from the low estimate. C1, C2 and C3 are the incremental slices of Contingent Resources, which the engine returns beside the cumulative 1C, 2C and 3C.")

q(3, "The Ekene Main Reserves are stated cumulatively as 8.890000, 16.650000 and 24.990000 MMbbl. What is the 2P, and which probability label does the engine print beside it?",
 "16.650000 MMbbl, labelled P50.",
 ["8.890000 MMbbl, P90.",
  "7.760000 MMbbl, labelled P50, the part of the best estimate that lies above the 1P.",
  "24.990000 MMbbl, P10."],
 "The 2P is the best estimate, 16.650000 MMbbl, and the engine labels the best case P50. 8.890000 is the 1P, the low case labelled P90. 7.760000 is the Probable (P2) slice, which is an increment and carries no probability label of its own. 24.990000 is the 3P.")

q(0, "What Probable (P2) does the engine return for the Ekene Main Reserves (1P 8.890000, 2P 16.650000, 3P 24.990000 MMbbl)?",
 "7.760000 MMbbl, what the 2P adds to the 1P.",
 ["16.650000 MMbbl, the 2P itself, since the word probable names the best estimate.",
  "8.340000 MMbbl, the gap between the 3P and the 2P.",
  "8.890000 MMbbl."],
 "The engine's increments are Proved (P1) 8.890000, Probable (P2) 7.760000 and Possible (P3) 8.340000 MMbbl: 16.650000 less 8.890000 is 7.760000. The 2P is the cumulative best estimate, which includes the Proved slice. 8.340000 is the Possible (P3), and 8.890000 is the Proved (P1).")

q(2, "In the same Ekene Main set, which figure is the Possible (P3)?",
 "8.340000 MMbbl.",
 ["24.990000 MMbbl.",
  "7.760000 MMbbl.",
  "16.650000 MMbbl."],
 "Possible (P3) is the top slice: take the 2P of 16.650000 from the 3P of 24.990000 and 8.340000 is left, the figure the increments table prints. The 3P itself is cumulative and holds all three slices. 7.760000 is the middle slice, and 16.650000 is the best estimate.")

q(0, "The Ekene North estimates are stated incrementally as C1 3.000000, C2 1.500000 and C3 2.000000. What 3C does the engine return?",
 "6.500000.",
 ["2.000000.",
  "4.500000.",
  "1.500000."],
 "The 3C is cumulative: C1 plus C2 plus C3, 3.000000 plus 1.500000 plus 2.000000, which is 6.500000, and the engine returns the same figure when the set is stated cumulatively. 2.000000 is the C3 slice and 4.500000 is the 2C.")

q(2, "The Ekene North set is entered twice: once as slices and once as totals of 3.000000, 4.500000 and 6.500000. What does the engine return for the two calls?",
 "The same 1C, 2C and 3C and the same C1, C2 and C3 from each.",
 ["Different categories, since the incremental call treats each slice as its own estimate.",
  "The same cumulative figures, but increments only for the call stated incrementally.",
  "A refusal on the second call."],
 "Whichever form is stated, the engine returns both: the golden inputs cat-contingent-incremental and cat-contingent-cumulative give 1C 3.000000, 2C 4.500000, 3C 6.500000 and C1 3.000000, C2 1.500000, C3 2.000000. Each call is independent, and nothing is refused.")

q(3, "The case \"Prospective Resources\" states 12.000000, 30.000000 and 70.000000 MMbbl. What does the engine return for the increments?",
 "None, with the reason: incremental: no terms are defined for Prospective Resources (PRMS 2.2.2.4)",
 ["U1, U2 and U3 slices, named after the undiscovered class, printed beside the 1U, 2U and 3U.",
  "A refusal, because Prospective Resources are not categorized until a well has been drilled.",
  "Probable (P2) and Possible (P3) slices, since the engine uses Reserves names for every class."],
 "The framework defines no incremental names for Prospective Resources, so the engine returns the 1U, 2U and 3U with no slices and prints that reason in its own words. It invents no U1, U2 or U3. Prospective Resources are categorized; only unrecoverable quantities are not.")

q(1, "A learner sets the method of the Prospective case to incremental. What does the engine answer, in its own words?",
 "method must be \"cumulative\" for Prospective Resources (PRMS 2.2.2.4 defines no incremental terms for them); got \"incremental\"",
 ["method must be one of \"cumulative\", \"incremental\"; got nothing",
  "A result with the incremental slices of the prospect under the labels U1, U2 and U3.",
  "estimates.low must be left out for the incremental method (state first, second and third); got 12"],
 "Those are the engine's own words for the golden case cat-refuse-prospective-incremental. The \"got nothing\" message answers a method left out, and the estimates.low message answers a low stated with the incremental method on a class that has slices. The engine invents no slices for a prospect.")

q(1, "The box of the categories view states resourceClass \"resources\". What does the engine print?",
 "resourceClass must be one of \"reserves\", \"contingent\", \"prospective\"; got \"resources\"",
 ["A result with the labels 1R, 2R and 3R, one set for all quantities together in the field.",
  "resourceClass must be one of \"reserves\", \"contingent\"; got \"resources\"",
  "A result under the Reserves labels 1P, 2P and 3P."],
 "Those are the engine's own words: resources alone names all quantities together and is no class of its own, and the categories view accepts three classes. Unrecoverable quantities are not in the list because they have no categories. The two-class list leaves out Prospective Resources, which do carry categories.")

q(3, "A set states a low of 10, a best of 8 and a high of 12. What does the engine return?",
 "A refusal: the estimates must be ordered low <= best <= high, and the message restates that the low is the P90.",
 ["The same three figures, sorted into the order 8, 10 and 12 before the labels are applied.",
  "A result with a note that the best estimate lies below the low, and all three labels printed.",
  "A result with the Probable (P2) printed as a negative slice of the best less the low."],
 "The engine refuses in its own words: estimates must be ordered low <= best <= high (the P90 low estimate, the P50 best, the P10 high: P90 means a 90% probability the actual quantity meets or exceeds this value, per SPE PRMS.); got {\"low\":10,\"best\":8,\"high\":12}. It sorts nothing and returns no figures on a refused box.")

q(0, "Three equal estimates of 2.000000 go into the categories view. Which output comes back?",
 "The three categories at 2.000000, singleValue true, and a reason citing PRMS 2.2.1.3.",
 ["A refusal, because the ordering rule needs the low below the best and the best below the high.",
  "One category, the 2P, since a single value describes the best estimate alone.",
  "The three categories with singleValue false."],
 "Each sign of the ordering rule reads at or below, so equal estimates are accepted. The engine returns 1P, 2P and 3P at 2.000000 and adds, in its own words: the low, best and high estimates are equal: a single value may describe the expected result (PRMS 2.2.1.3). The flag reads true only when all three figures are exactly equal.")

q(2, "What slices does the engine return for the case \"One value for the range\", with 2.000000 stated for each estimate?",
 "Proved (P1) 2.000000, Probable (P2) 0.000000 and Possible (P3) 0.000000.",
 ["Proved (P1), Probable (P2) and Possible (P3) of 2.000000 each, one for every estimate stated.",
  "No slices at all.",
  "Proved (P1) 0.000000, Probable (P2) 2.000000 and Possible (P3) 0.000000."],
 "The Proved slice is the whole 1P, 2.000000, and each later slice is the gap to the next estimate, which is zero. The 2P and 3P still equal the 1P. Three slices of 2.000000 each would add to a 3P of 6. Slices are returned for Reserves whatever their size. A Probable slice of the whole figure would need a 1P of zero.")

q(3, "A learner raises the high estimate of \"One value for the range\" by a small amount. What happens to the tile \"One value for the range\"?",
 "It reads false: the engine treats three figures that differ at all as an ordinary range.",
 ["It stays true, since the three figures still round to the same value in the reason lines.",
  "It stays true until the gap between the estimates reaches one percent of the best estimate.",
  "The engine refuses the box, since a single-value case may not be edited."],
 "The flag is true only when the three stated figures are exactly equal. Any difference makes an ordinary range, the reason citing PRMS 2.2.1.3 disappears, and the Possible (P3) slice becomes the small amount added. The engine uses no percentage threshold, and the box is an ordinary input the learner may change.")

q(0, "A unit of a single space is stated in the categories view. What does the engine print?",
 "unit must be a non-empty string; got \" \"",
 ["A result with no unit printed in the Unit tile.",
  "A result in MMbbl, the unit of the start.",
  "unit must be one of \"MMbbl\", \"MMboe\", \"tcf\"; got \" \""],
 "Those are the engine's own words for the golden case cat-refuse-unit. The unit is a stated input with no default, and a blank string is refused. The engine does not fill in a unit, and it holds no list of accepted units: any non-empty string is accepted.")

q(2, "On the Prospective case (12.000000, 30.000000 and 70.000000 MMbbl) the Class control is switched to Contingent Resources. What changes in the result?",
 "The labels become 1C, 2C and 3C, and an increments table of C1, C2 and C3 appears.",
 ["Nothing changes: the labels follow the method alone.",
  "The engine refuses, since a Prospective case cannot be restated as another class.",
  "The labels become 1P, 2P and 3P, since Contingent figures borrow the Reserves names."],
 "The labels follow the stated class (PRMS 2.2.2.2 to 2.2.2.4): the same three figures come back as 1C, 2C and 3C, and because Contingent Resources have slices the engine adds C1, C2 and C3. The categories view reads only the stated class, so it has nothing to refuse. The P labels belong to Reserves, and the P90, P50 and P10 beside each row stay as they were.")

emit(Q, '/root/cat-wip-prms/banks/ec11b_m04.json', expect_n=15)
finish()
