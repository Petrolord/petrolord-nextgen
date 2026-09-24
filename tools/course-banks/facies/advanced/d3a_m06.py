import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D3 Expert m06, reading the engine honestly. Figures from the course's
# conventions table and what is not built, the engine's statement of what it
# declines to compute, the scaler and PCA sections, the seed table, the
# silhouette on raw logs, and the facies note assembled from the three tiers.

q(2, "The engine scales logs for clustering with one standard deviation and builds the correlation PCA with another. Which pairing is right?",
 "Clustering: the population SD, divisor n; the correlation PCA: the sample SD, divisor n - 1",
 ["Clustering: the sample SD, divisor n - 1; the correlation PCA: the population SD, divisor n",
  "Both use the population SD, divisor n, the machine learning engine's scaler throughout",
  "Both use the sample SD, divisor n - 1, so a PCA score and a scaled log compare directly"],
 "The conventions table: clustering scaler \"standard, population SD (n), fitted on the rows clustered\"; PCA matrix \"correlation, sample SD (n - 1)\", chosen so that each score's variance equals its eigenvalue and the eigenvalues sum to the number of logs, 4.000000 on the cored rows. On those 180 rows the sample SD is larger by the factor 1.002789 on every log, so a figure quoted without its divisor cannot be reproduced exactly.")

q(0, "On the cored rows the covariance PCA's first component carries 0.998581 of the variance with a GR weight of 0.999905, and the correlation PCA's first carries 0.682351. What does the pair show?",
 "The choice of matrix changes what the figure means: the covariance form is almost a gamma ray PCA",
 ["The correlation form has lost part of the variance to rounding, which the covariance form keeps in full",
  "GR carries the facies signal, as the covariance form confirms and the correlation form hides",
  "The two forms disagree about the data, so one of them must be discarded before a study goes any further"],
 "In the covariance form GR's variance in gAPI squared dwarfs the others', so the first component is almost GR alone; the correlation form lets every log count equally and draws on all four. Neither pair disagrees about the data; each answers a different question, and the choice says which. No variance is lost: a correlation PCA's eigenvalues sum to the number of logs. A unit's size is no evidence of facies signal.")

q(1, "The engine's k-means++ takes one candidate per step from one mulberry32(seed) stream. What is the common alternative, and the engine's stated reason for its choice?",
 "Greedy k-means++ trying several candidates (scikit-learn); one canonical generator lets a learner follow each draw",
 ["Random starting rows with no weighting at all; the engine's choice is faster on large fields of many wells",
  "Starting from the facies means of the core; the engine's choice needs no core to begin with",
  "Greedy k-means++ trying several candidates; the engine's choice always finds the lowest inertia"],
 "The conventions table: k-means seeding, this engine \"k-means++, one candidate per step, mulberry32(seed)\", alternative \"greedy k-means++ (scikit-learn tries several candidates)\", reason \"one canonical generator across the platform; a learner can follow each draw\". No seeding guarantees the lowest inertia: at seed 5 ten starts stop at 58.297079, above 58.289042. Speed is not the stated reason.")

q(3, "Why does the engine run 10 k-means starts by default, and what does the course say more starts can and cannot do?",
 "One start can stop in a poor arrangement; more starts make that less likely and do not rule it out",
 ["A stable silhouette needs at least ten starts, and any number fewer than ten is refused by name as `nInit`",
  "On these rows ten starts always reach the lowest inertia, so the seed stops mattering once it is used",
  "Averaging the centres of all ten starts into a single set removes the effect of any poor start entirely"],
 "Across the ten seeds in the course's table, one start leaves 8 of 10 above 58.289042, and ten starts bring 9 of 10 to it; seed 5 still stops at 58.297079. So a result is quoted with its seed and its number of starts. nInit 1 is accepted, and the lowest-inertia start wins outright; no centres are averaged.")

q(1, "The engine counts k-means passes as assignment passes, the confirming pass included. What does that choice match?",
 "scikit-learn's n_iter_ when the stop is by labels",
 ["Centre updates, one fewer than the passes",
  "The number of starts, 10 by default, times the passes",
  "Its maxIter setting of 300, which every run reaches"],
 "The conventions table: k-means passes, this engine \"counted as assignment passes, the confirming pass included\", alternative \"centre updates\", reason \"matches scikit-learn n_iter_ when the stop is by labels\". Starts are counted separately in `runs`, and maxIter 300 is a ceiling; the teaching clustering's winning start took 6 passes.")

q(2, "The teaching clusters score a mean silhouette of 0.545063 on the scaled logs and 0.443238 on the raw logs. Why does the engine default to the scaled logs?",
 "It scores the space the clusters were made in, so the silhouette is quoted with its scaling",
 ["Raw figures are refused outright whenever GR is present, since gAPI dominates the distance",
  "Higher is better, and the engine reports the more favourable of the two figures",
  "Once k-means has scaled them, raw logs cannot be scored at all, so no choice is left to make"],
 "The conventions table: silhouette distance, this engine \"Euclidean on the scaled logs\", alternative \"raw logs\", reason \"scores the space the clusters were made in\". `scale: 'none'` is accepted and returned 0.443238, so raw scoring is possible and unrefused. A silhouette is measured in a space, and the choice of space is stated, whichever figure is higher.")

q(0, "Which description of the engine's agglomerative output is its stated convention?",
 "A scipy linkage matrix, with Ward heights as sqrt(2 x the rise in the sum of squares), so the tree can be re-cut and drawn",
 ["scikit-learn's children_ array with no heights, the lighter form, since a cut at k needs only the merge order",
  "A list of cluster labels at every k from 1 to n, one per cut, with no record of the merges that made them",
  "A dendrogram image of the Ward tree with heights read off its axis, as the one form a reader can follow"],
 "The conventions table: agglomerative ids and heights, this engine \"scipy linkage matrix; Ward height sqrt(2 x rise in sum of squares)\", alternative \"scikit-learn children_ with no heights\", reason \"the whole tree can be re-cut and drawn\". Each row is [smaller id, larger id, height, size], and `cutTree` re-cuts it at any k. The engine returns data, never an image.")

q(3, "One-to-one matching of clusters to core facies takes the assignment that matches the most rows, first mapping on ties. What is the alternative, and why did the engine decline it?",
 "Greedy matching, cluster by cluster; the engine's optimum is unique in count and stated in order",
 ["Majority matching; it lets two clusters share one facies, which one-to-one matching forbids by design",
  "Random matching with a stated seed; it would change with the seed while the optimum never does",
  "Matching by centre distance; it needs log units, which the contingency table of counts does not hold"],
 "The conventions table: one-to-one matching, this engine \"maximum rows matched, first mapping on ties\", alternative \"greedy, cluster by cluster\", reason \"the optimum is unique in count and stated in order\". Majority matching is a second mode the engine also offers, for more clusters than facies; for one-to-one the table names greedy matching as the alternative.")

q(2, "Two labellings each put every row in one cluster. What does `adjustedRandIndex` return, and why?",
 "1: the formula divides zero by zero, and the engine returns 1 to match scikit-learn",
 ["0: two groupings of one cluster each carry no information, so no agreement is scored",
  "A refusal naming `a`, since a single cluster cannot be compared with anything at all",
  "One half, which is the value the engine assigns whenever the index is undefined"],
 "The conventions table: ARI of two labellings that each put every row in one cluster, this engine \"1\", alternative \"no value (the formula divides zero by zero)\", reason \"matches scikit-learn\"; the golden `ari-both-one-cluster` returns 1.000000. The index is 1 when two labellings are the same grouping, and these are. The refusals on `a` concern fewer than 2 labels.")

q(1, "kNN at k 5 gives a row 4 votes for shaly-sand and 1 for sandstone. A report writes \"shaly-sand, confidence 0.8\". What has the report done?",
 "Added a claim the engine did not make: it returns votes as counts, and no probability for a predicted facies",
 ["Quoted the engine's own probability field, which kNN returns beside every prediction it makes",
  "Rounded the engine's own confidence figure, which is printed at six decimals in the basis block of each result",
  "Correctly converted a tie-free vote, as the engine states that votes divide by k into a probability"],
 "What is not built: \"no probability for a predicted facies\". kNN returns its votes as counts, and a tree the counts on each leaf; neither is turned into a probability. A report presenting 4 of 5 votes as a confidence figure adds a claim the engine did not make. No probability field or basis sentence of the kind exists.")

q(0, "A study asks for a self-organising map of the Ekene logs. What does the course say about it?",
 "The engine builds none; a SOM needs its own seeded engine before a course can teach it",
 ["The engine builds one from its k-means centres, seeded as k-means is, under the name kmeans",
  "The engine builds one, but only on the correlation PCA scores, which the SOM uses as its grid",
  "The engine offers it as agglomerative with a fourth linkage, 'som', beside the three it names"],
 "What is not built: \"No self-organising map (the Suite's older facies code had one that drew from an unseeded generator; it needs its own seeded engine before a course can teach it)\". The exported names, in full, hold no SOM, and agglomerative accepts 'ward', 'complete' or 'average' only; any other linkage is refused by name.")

q(3, "Which of these is not among the engine's exported names?",
 "crossValidate",
 ["cutTree",
  "pcaTransform",
  "assignClusters"],
 "The exported names, in full: DEFAULTS, adjustedRandIndex, agglomerative, assignClusters, cartFit, cartPredict, cutTree, elbow, kmeans, knnClassify, matchClusters, pca, pcaTransform, silhouette. The engine does not split wells or cross-validate; a split by whole wells and its scores are the machine learning course's.")

q(1, "The cored rows are passed to `pca` with row 40's RHOB null. What does the engine do?",
 "Refuses by name at the first row and column it meets: \"X[40][1] must be a finite number: fill or drop missing values first\"",
 ["Fills the null with RHOB's mean over the cored rows, 2.466911, and adds a warning naming the row",
  "Drops row 40 and fits the other 179 rows, recording the dropped row in the result's basis block",
  "Refuses naming `X.RHOB`, as a log with a null entry is treated as a log with zero variance"],
 "The engine does not fill a missing value: a null or non-finite entry in X is refused by name, counting rows and columns from 0, so row 40, column 1, RHOB. Filling or dropping it is the caller's decision, and conditioning logs belongs to the data quality course. The zero-variance refusal names a constant log, a different fault.")

q(2, "A facies note for the Ekene field is assembled from all three tiers. Which item stays out of it?",
 "The withheld facies of EKENE-7 and EKENE-8, which exist only because this field is synthetic",
 ["The seed and the number of starts beside the k-means inertia of 58.289042",
  "The held-out well named beside the kNN score of 0.833333 on EKENE-6",
  "The drop fractions and the best silhouette printed beside the choice of k"],
 "The withheld facies scored the predictions in this course only because the field is synthetic, and a real note has nothing like them. The seed and starts, the held-out well, and the elbow and silhouette readings beside the choice of k are exactly what the note carries, so that a colleague with the same wells and engine can reproduce every figure without asking a question.")

q(0, "For a note to be re-runnable, which setting must be written beside a tree's figures that a reader might not expect?",
 "The column order of the logs, because it decides a tied root and the node numbers below it",
 ["The random_state of the tree, because the engine draws its feature order from that seed",
  "The seed of the tree's scaler, since the engine standardises every log before splitting",
  "The number of starts, as the tree keeps the best of 10 trees grown on shuffled copies of the rows"],
 "The engine breaks a split tie by the lower column index, so the order the logs are passed in decides the printed tree where two logs tie, as NPHI and PEF do at the root. The engine takes no random_state and draws no feature order; a tree scales nothing; and cartFit grows one tree. For a sampled silhouette the note would carry the sample size and seed instead.")

emit(Q, '/root/dai-wip-facies/banks/d3a_m06.json', expect_n=15)
finish()
