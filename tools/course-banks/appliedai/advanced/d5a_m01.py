import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D5 Expert m01, Annotator Agreement. Figures from the course's agreement
# section (the Ekene annotators' confusion counts, observed and expected
# agreement, unweighted, linear and quadratic kappa, words as ratings, the
# relevant/not reduction, the null kappa), the fixture record of the second
# annotator and the refusal table.

K = [2, 0, 3, 1, 1, 3, 0, 2, 0, 3, 1, 2, 3, 0, 1]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("The Ekene annotators graded the same 183 judged pairs. What is their observed agreement, and how does the engine get it?",
 "0.721311: the pairs on the diagonal of the confusion table, divided by the 183 pairs",
 ["0.336708: every row total times its column total, summed and divided by 183 squared",
  "0.579841: the share of the 183 pairs that remain in agreement once chance is taken away",
  "0.814208: the pairs both annotators placed on the same side of the grade 1 line, over 183"],
 "The engine's basis says observedAgreement = diagonal / n, a count over a count: 0.721311. The row-times-column sum over n squared is the expected agreement, 0.336708. The unweighted kappa, 0.579841, rescales the observed figure against the expected one. 0.814208 is the observed agreement after each grade is reduced to relevant or not at grade 1 or more, a different set of ratings.")

# 2
x("Rater a gave grade 0 to 101 of the pairs and rater b to 77. What does the expected agreement of 0.336708 describe?",
 "What two raters with these row and column totals would agree on if each labelled at random",
 ["The share of pairs the second annotator's draw left unchanged from the primary grade",
  "How often the pair would agree once both have read the passage with care, by the fixture",
  "The agreement of rater a with itself when the same pairs are graded a second time over"],
 "Expected agreement is the sum of row total times column total over n squared: the agreement two independent raters would reach while keeping their own mix of grades. Both annotators lean on grade 0, so a large part of their agreement was always going to happen. It is computed from the margins alone, so it says nothing about the draw, about care in reading, or about a rater graded twice.")

# 3
x("Which calculation gives the unweighted kappa of 0.579841 on the Ekene annotators, in the form the engine writes it?",
 "1 - sum w O / sum w E, with w 0 on the diagonal and 1 off it: 1 - 0.278689 / 0.663292",
 ["The observed agreement divided by the expected agreement, 0.721311 over 0.336708 in full",
  "1 - sum w O / sum w E, with w equal to |i - j|, since the grades form an ordered scale",
  "The mean of the three kappas the engine returns under the none, linear and quadratic weights"],
 "The basis writes kappa as 1 - sum w O / sum w E, and the unweighted weights are 0 on the diagonal and 1 off it, so the ratio is the observed disagreement 0.278689 over the expected disagreement 0.663292. A plain ratio of the two agreements is no kappa and could exceed 1. Weights of |i - j| give the linear kappa, 0.675940. No kappa is a mean of the others: each weighting is its own statistic.")

# 4
x("With labels 0, 1, 2 and 3, how does the quadratic weighting charge a disagreement of three grades, and what kappa does it give on the Ekene pairs?",
 "It charges 9, the square of the gap, and the quadratic kappa is 0.771549",
 ["It charges 3, the gap itself, and the quadratic kappa is then 0.675940",
  "Its charge is 1, the same as any other disagreement, so kappa stays at 0.579841",
  "A charge of 6, twice the gap, which brings the quadratic kappa up to 0.771549"],
 "The basis states w = (i - j)^2 on the label positions, and with these labels the positions are the grades, so a three-grade gap costs 9. That weighting gives 0.771549. A charge equal to the gap is the linear weighting, whose kappa is 0.675940. A charge of 1 for every disagreement is the unweighted kappa, 0.579841. No weighting doubles the gap.")

# 5
x("Why is the Ekene annotators' kappa higher under linear and quadratic weights than unweighted?",
 "Most of their disagreements are one grade apart, 40 of the 51, and chance spreads its disagreements over far pairs too",
 ["The weights raise the observed agreement from 0.721311, since near misses count as partial agreement in it",
  "Weighted kappa leaves the rows with grade 0 out of the expected agreement, which lowers that denominator",
  "The weights are fitted to the confusion counts, so they always return a higher kappa than the unweighted one"],
 "Weighting charges a far disagreement more than a near one. These annotators mostly slip by one grade (40 of their 51 disagreements), while chance, working from the margins, produces far disagreements as well, so the weighted ratio of observed to expected disagreement falls and kappa rises. The engine reports the observed and expected agreement unweighted whatever the weighting; no rows are left out; and the weights are stated formulas on the label positions, never fitted.")

# 6
x("Under linear weights the Ekene figures read observed disagreement 0.338798 and expected disagreement 1.045478. A reviewer calls the second figure impossible. What is the right reply?",
 "A weight can exceed 1, so a weighted disagreement can too; only the ratio of the two enters kappa",
 ["The reviewer is right: a disagreement is a share of pairs, so the engine should have capped it at 1",
  "It exceeds 1 because the engine divides by the 51 disagreements where the 183 pairs belong",
  "The figure is 1 minus a negative expected agreement, which the weights produce on this set"],
 "Under linear weights a three-grade disagreement is charged 3, so sum w E over n can pass 1; the same holds for the quadratic 2.009257. Kappa uses only the ratio, 1 - 0.338798 / 1.045478 = 0.675940. The engine caps nothing here, divides by n, and reports the expected agreement 0.336708 unweighted in every row, so there is no negative agreement anywhere.")

# 7
x("Six pairs are rated with the words none, related, relevant and answers, and linear weights are asked for with no labels passed. What does the engine return?",
 "A refusal naming `labels`: \"labels must be given in order for linear weights on string ratings (the weights use the label positions)\"",
 ["A kappa computed on the words sorted alphabetically, which puts answers first and none second in the scale",
  "The unweighted kappa, with a note that the weights were dropped because word ratings carry no order",
  "A refusal naming `weights`: \"weights must be 'none', 'linear' or 'quadratic'\", as words take no weights"],
 "Weights use the label positions, and words have no order of their own: sorting them alphabetically would put \"answers\" before \"none\". So the engine refuses, names the field `labels` and says why, in the words quoted. It never guesses an order and never falls back to the unweighted kappa. The `weights` message is for a weighting the engine does not offer, and linear is one it offers.")

# 8
x("The course's six stated word-rated pairs are sent with labels none, related, relevant, answers in that order and linear weights. What comes back?",
 "The call runs, and the kappa on the six stated pairs is 0.608696",
 ["A refusal again, because weighted kappa is only offered on number ratings",
  "The kappa of the Ekene annotators, 0.675940, since the labels match the four grades",
  "0.608696 as the observed agreement, with kappa returned as null and a reason"],
 "Given in order, the labels fix the positions the linear weights use, and the engine returns kappa 0.608696 on the six stated pairs. Word ratings are accepted once their order is stated. 0.675940 is the linear kappa of the 183 Ekene pairs, a different set of ratings. Kappa is null only when both raters give every item the same label, which is not this case, and 0.608696 is the kappa itself.")

# 9
x("Both raters give every item the grade 2. How does the engine answer a kappa call on those ratings?",
 "It returns kappa as null with the reason \"kappa is undefined: both raters gave every item the same label (2), so the expected disagreement is 0\"",
 ["It refuses the call with the field `a` named, since a rater list that holds one single label throughout is not accepted as a set of ratings",
  "It returns kappa 1, since the two raters agree on every one of the items and so their observed agreement is complete, with no disagreement left to count",
  "Kappa comes back as 0: the observed and expected agreement are equal, so nothing is gained on chance"],
 "Kappa divides by the expected disagreement, which is 0 when both raters use one and the same label, so the value is undefined. The engine runs the call and returns the result with kappa null and the reason quoted, which is a result with a note and no refusal. It does not substitute 1 or 0 for a ratio it cannot form; a single disagreement anywhere lifts the expected disagreement above 0 and kappa returns.")

# 10
x("A kappa call passes rater a with three ratings and rater b with two. Which field does the refusal name, and in what words?",
 "`b`, with \"b must be an array of 3 ratings, one per item of a\"",
 ["`a`, with \"a must be a non-empty array of ratings\"",
  "`labels`, with \"labels[2] repeats 1\", as one label is lost in the check",
  "The call runs on the first two items and warns of the third"],
 "The engine reads rater a first and measures rater b against it, so the refusal names `b` and states the length it needed, 3 ratings, one per item of a. The `a` message is for an empty first list. The labels message is for a label listed twice. The engine never trims a list to fit the other: kappa needs one rating from each rater per item.")

# 11
x("Rater a's ratings are 0, 3, 1 and the labels are passed as 0, 1, 2. What does the engine return?",
 "A refusal naming `a[1]`: \"a[1] is 3, which is not one of labels\"",
 ["A kappa with the 3 moved to the nearest label, 2, before the table is built",
  "A refusal naming `labels`: the labels must run from 0 to the largest grade given",
  "The kappa with the 3 left out of the table and a note that one item was dropped"],
 "When labels are passed the engine checks every rating against them, and a 3 that is not among them is refused, the message naming the position `a[1]` and the value. No rating is moved to a neighbour and no item is dropped, because either would change the confusion table without saying so. The labels themselves were valid: nothing requires them to run up to a grade someone typed.")

# 12
x("A kappa call lists rater a as 0, \"related\", 2. Which refusal comes back?",
 "`a[1]`, with the words \"a[1] must be a finite number, like a[0]\"",
 ["`labels`: \"labels[2] repeats 1\", for a label that was listed twice",
  "`a[1]` in the words \"a[1] is 3, which is not one of labels\"",
  "`weights`: \"weights must be 'none', 'linear' or 'quadratic'\" in full"],
 "The first rating fixes the kind: a[0] is a number, so a[1] must be a finite number too, and a word there is refused with the message quoted. The repeated-label message needs a labels list with a duplicate in it, and the not-one-of-labels message needs a labels list the rating falls outside; neither was passed. No weighting was asked for, so the weights message cannot arise.")

# 13
x("The Ekene grades reduced to relevant or not give kappa 0.634430 at grade 1 or more and 0.794115 at grade 2 or more. What does that say about the retrieval metrics' default threshold?",
 "The default, grade 1, sits on the line the annotators agree on less well, so a report states the kappa at the threshold its metrics use",
 ["Grade 1 is where the annotators agree best of all, which is exactly why every retrieval metric takes it as the default relevance line",
  "The two figures are observed agreements and not kappas, so they say nothing about the threshold at all",
  "The threshold makes no difference to kappa, since both reductions come from one and the same set of 183 judged pairs"],
 "Kappa at grade 2 or more, 0.794115, is higher than at grade 1 or more, 0.634430, so the annotators separate grade 1 from grade 2 more reliably than grade 0 from grade 1, and the metrics' default of grade 1 inherits the weaker line. The observed agreements at the two thresholds are 0.814208 and 0.928962; the figures in the question are kappas. The threshold changes the ratings, so it changes kappa.")

# 14
x("Where did the second annotator's grades on the 183 Ekene pairs come from?",
 "A stated fixture draw: the primary grade moved one grade with probability 0.25 and two grades with probability 0.05, random.Random(20260925)",
 ["A language model asked to grade every judged pair again, with its answers saved once to a file so that each later run would match them exactly",
  "The engine's own bootstrap stream on seed 7, which redraws the second set of grades every time a kappa call is made on those pairs",
  "A second person at the platform who read all 60 passages against all 24 queries and graded each pair"],
 "The fixture record states how the synthetic second grades were drawn, with the probabilities and the seed quoted. No language model wrote or scores any fixture in this course, and a key resting on one would have no fixed answer. The bootstrap is the engine's only random draw and it never touches the grades. The Ekene data are synthetic, so no person graded anything, and only the 183 pooled pairs carry grades.")

# 15
x("Numeric grades are passed to the kappa function with the labels left out. How does the engine fix the label order the weights use?",
 "The distinct ratings, sorted ascending, as its basis states",
 ["The order in which each grade first appears in rater a",
  "The grades 0 to 10, the full grade scale the engine will accept",
  "Descending, so that the highest grade takes position 0"],
 "The basis says labels are the distinct ratings sorted ascending, so the Ekene grades give 0, 1, 2, 3 and the positions equal the grades. Order of appearance would make the weights depend on how the pairs happened to be listed. The accepted grade range belongs to the retrieval metrics and does not set kappa labels. A descending order would still give the same gaps between grades, but it is not the order the engine uses.")

emit(Q, '/root/dai-wip-appliedai/banks/d5a_m01.json', expect_n=15)
finish()
