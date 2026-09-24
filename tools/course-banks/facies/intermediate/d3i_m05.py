import sys, os; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D3 Professional m05, the adjusted Rand index.
# Figures are the course's six stated rows, its two stated edge goldens, and
# the k 4 labellings of the 180 cored rows (k-means seed 3 and seed 1, Ward,
# complete and average cuts, the well names) against the core facies. No
# capstone field, well, stated input or graded answer appears.

q(1, "When does a pair of rows AGREE between two labellings, in the adjusted Rand index?",
 "When both labellings put the two rows together, or both put them apart",
 ["When the two rows carry the same name in both labellings",
  "Only when both labellings put the two rows together in one group",
  "When the two rows sit nearer each other than the mean distance"],
 "The index counts pairs: a pair agrees when both labellings put it together or both put it apart, whatever the groups are called. Comparing names needs a mapping, and the index uses none; pairs put apart in both count as agreement too.")

q(3, "For a = 0, 0, 0, 1, 1, 1 and b = p, p, q, q, r, r, how many pairs does each labelling put together, and how many do both?",
 "6 in a, 3 in b, 2 in both, of 15 pairs in all",
 ["3 in a and 6 in b, 2 in both, of 15 pairs in all",
  "6 in a and 3 in b, so 9 together in both",
  "2 in a, 2 in b, 2 in both, of the 6 rows"],
 "Each group of a holds 3 rows, C(3, 2) = 3 pairs each, 6 in all; each group of b holds 2 rows, one pair each, 3 in all; the cells of 2 in the contingency table give sum C(n_ij, 2) = 2; and C(6, 2) = 15. Pairs together in both are counted from the cells, never by adding the two labellings' counts.")

q(0, "For the same six rows, what is the expected count of pairs both labellings join by chance?",
 "1.200000, from 6 x 3 / 15",
 ["2, the pairs together in both that the table counts",
  "0.242424, the index once the expectation is taken off",
  "15, since every pair has a chance of falling together"],
 "The basis gives E = sum C(a_i, 2) sum C(b_j, 2) / C(n, 2) = 6 x 3 / 15 = 1.200000. 2 is the actual count of pairs together in both, 0.242424 is the index itself, and 15 is the count of all pairs.")

q(2, "What adjusted Rand index does the engine return for those six rows?",
 "0.242424",
 ["2, the raw count of pairs both labellings join",
  "0.800000, the share of the 15 pairs that agree",
  "Minus the expectation, 1.200000"],
 "(2 - 1.200000) / ((6 + 3) / 2 - 1.200000) = 0.242424, and the engine returns 0.242424: the two labellings agree a little more than chance. The raw count and the expectation are pieces of the formula.")

q(2, "The stated golden a = 0, 0, 1, 1 against b = 0, 1, 0, 1 is scored. What comes back?",
 "-0.500000: every pair a joins, b splits, and the reverse",
 ["0.000000, since the engine clips any negative index up to 0",
  "1.000000, as the two labellings use the same two names",
  "A refusal naming b, since no pair is together in both"],
 "Labellings that disagree more than chance go below 0, and golden `ari-negative` scores -0.500000. The engine reports a negative index as it is; the names are irrelevant to a pair count; and no pair together in both is a legitimate count of 0.")

q(0, "Two labellings each put every row in one cluster. What does the engine return, and why is a rule needed?",
 "1.000000; the formula divides zero by zero, and the engine follows scikit-learn",
 ["0.000000, since two single clusters agree no better than chance would",
  "A refusal naming a, because one cluster has no pair to disagree on",
  "An undefined value, printed as none, since the formula cannot be taken"],
 "The basis reads \"when the denominator is zero (both labelings one cluster, or both all singletons) the index is 1 (scikit-learn)\", golden `ari-both-one-cluster`. The engine neither refuses the call nor returns an empty value.")

q(0, "The teaching partition comes back numbered differently at seed 1. What does the index read between seed 1 and seed 3, and against core?",
 "1.000000 between them, and 0.872413 each against the core",
 ["0.000000 between them, since no row keeps its number",
  "0.863179 between them, and 0.873388 for each against the core",
  "1.000000 between them, with seed 1 at 0.897678 against the core"],
 "Seed 1 is the teaching partition with other numbers, so the index between them is 1.000000 and both score 0.872413 against the core. 0.863179 is k-means against Ward; 0.873388 is Ward against core and 0.897678 complete against core.")

q(3, "One-to-one matching of the teaching clustering returns an adjusted Rand index beside its mapped scores. How does it relate to the mapping?",
 "It is 0.872413, the same figure, and uses no mapping at all",
 ["0.950000, the accuracy of the mapped facies, stated a second way",
  "It rises as the mapping improves",
  "0.952887, the macro F1 of the four mapped facies read as pairs"],
 "The basis reads \"adjusted Rand index of the clusters against the facies (independent of the mapping)\", and it returns 0.872413, the figure adjustedRandIndex gives. 0.950000 is the mapped accuracy and 0.952887 the macro F1, both of which depend on the mapping.")

q(1, "The teaching k-means and the Ward cut at k 4 are compared with each other, neither being the core. What does the index read?",
 "0.863179: close, and below 1, so they are two different groupings",
 ["1.000000, since both agree with the core almost equally",
  "0.873388, the Ward figure, since a comparison takes the higher of the two",
  "Nothing, since the index needs one labelling to be the core facies"],
 "k-means against Ward scores 0.863179. The index needs no core; either labelling can be any grouping. Two methods can each score close to the core (0.872413 and 0.873388) and still differ from each other, and only an index of 1.000000 marks the same grouping.")

q(1, "Of the four k 4 methods on the cored rows, which agrees best with the core by the adjusted Rand index?",
 "Complete linkage, 0.897678",
 ["Ward, at 0.873388, the tree that minimises sums of squares",
  "k-means at seed 3, 0.872413, the method with the highest silhouette",
  "Average linkage, 0.676404, whose cut holds the largest cluster"],
 "The table reads k-means 0.872413, Ward 0.873388, complete 0.897678 and average 0.676404; complete agrees best here. Average linkage is lowest of the four, and a high silhouette is no ranking against core.")

q(0, "Grouping each cored row by the well it came from scores 0.157021 against the core facies. What does the course read into that figure?",
 "It is a grouping that knows nothing about the rock",
 ["Wells differ in rock, so the well is a fair first guess at facies",
  "Six groups against four break the index",
  "It shows the four methods at k 4 each found about a sixth of the rock"],
 "The course states that the well names group the rows too and score 0.157021, a grouping that knows nothing about the rock. The index accepts groupings of any size on each side, and the four methods score from 0.676404 to 0.897678.")

q(2, "Ward scores 0.873388 against the core and k-means 0.872413. Which statement is supported by the figures?",
 "Ward prints the higher index, and against each other the two score 0.863179, so they differ",
 ["Both print the same index to three decimals, so they are the same grouping",
  "k-means prints the higher index, since its silhouette of 0.545063 is higher",
  "A tie, since the two indices print so close together"],
 "Ward reads 0.873388 and k-means 0.872413, so Ward prints the higher figure. Against each other they score 0.863179, below 1, so they are different groupings; printing alike would not make them one. The silhouette is a separate measure.")

q(1, "An adjustedRandIndex call passes a labelling of one row. What does the engine say?",
 "a must be an array of at least 2 labels",
 ["b must be an array of 180 labels, one per row",
  "It returns 1.000000, as a single row agrees with itself",
  "It returns 0.000000, as one row holds no pair"],
 "One row holds no pair to count, so the index cannot be taken: the engine names the field a and states its floor of 2 labels. The 180-label message is a separate check, raised for a list of the wrong length, and no value is returned for a single row.")

q(3, "On the 180 cored rows, the second labelling handed to the index is one label short. Which refusal comes back?",
 "b must be an array of 180 labels, one per row",
 ["It scores the 179 rows the two lists share",
  "a must be an array of at least 2 labels, since the lists differ",
  "It pads b with its last label and warns"],
 "Every row needs a label on both sides, so 179 labels against 180 rows is refused by name, in the engine's words quoted in the key. Nothing is trimmed or padded, and the other message offered concerns a list too short to hold a single pair.")

q(0, "At k 4, the mean silhouette ranks k-means first and complete third, while the index against core ranks complete first. What explains the difference?",
 "The silhouette scores compact, separated groups; the index scores agreement with the rock",
 ["The silhouette is computed on raw logs and the index on standardised logs",
  "The index uses a mapping of clusters to facies, and the silhouette does not",
  "Complete linkage has more clusters than k-means at k 4, which the index rewards"],
 "The silhouettes at k 4 read k-means 0.545063, Ward 0.531627, complete 0.530601 and average 0.514177; the indices against core read complete 0.897678 first. The silhouette measures compactness and separation and says nothing of rock types. Both run on the standardised logs, the index uses no mapping, and every method here has 4 clusters.")

emit(Q, '/root/dai-wip-facies/banks/d3i_m05.json', expect_n=15)
finish()
