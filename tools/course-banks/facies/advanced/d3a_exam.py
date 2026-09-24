import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D3 Expert final exam, 42 questions over the whole tier: kNN, CART, ties,
# the uncored wells, boundaries and caps, conventions and what is not built.
# Each question takes a different angle or figure from the module banks.
# Three keys rest on engine calls recorded in BANKNOTES-advanced.md: the leaf
# reached by cored rows 0, 6 and 28 through the printed five-channel tree
# (cartPredict agrees with the trace), the pca warning at maxSweeps 3 on the
# cored rows, and EKENE-7's highest PEF above the cored maximum.

K = [1, 0, 2, 3, 3, 1, 0, 1, 1, 3, 3, 2, 0, 0, 1, 3, 1, 2, 3, 3, 1, 2, 2, 1, 2, 0, 2, 2, 2, 0, 0, 1, 3, 3, 2, 0, 3, 0, 0, 2, 0, 1]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("With EKENE-6 held out, the first row of EKENE-6 has its nearest training row, row 58 of EKENE-2, at 0.309960 standard units, and its fifth at 0.600367. What would k 1 predict for it?",
 "shaly-sand, the core facies of training row 58, the single nearest row",
 ["sandstone, since with one neighbour the engine falls back to the facies that sorts first",
  "a refusal, because a vote of one neighbour cannot reach the majority the basis asks for",
  "limestone, the most common facies among the 150 training rows the model was fitted on"],
 "k 1 copies the facies of the single nearest training row, and row 58 is shaly-sand, as all five of this row's nearest neighbours are. One vote is a majority of one. The sort-first rule is scikit-learn's tie rule, and no tie arises with one neighbour. The most common training facies would be the prediction of a vote over every training row.")

# 2
x("Every k tried on EKENE-6 held out, from 1 to 15, shows a tied-vote count of 0. What does that let a reader conclude?",
 "The engine's vote tie rule changed no prediction on that well at those k",
 ["The four facies are well enough separated that a tied vote cannot happen on any Ekene well",
  "The engine and scikit-learn would print different predictions on some rows of EKENE-6",
  "The engine drops tied rows from the accuracy, so a tie would show as a row missing from the 30"],
 "With no tied vote, the rule that gives a tie to the nearer neighbour's facies never applied, so a tool using the sort-first rule would print the same predictions there. Ties do happen on these wells: row 27 of EKENE-8 ties at k 2. A tied row is predicted by the stated rule and scored like any other, so no row goes missing from the 30.")

# 3
x("The engine chose the nearer-neighbour rule for a tied kNN vote. What reason does the course give?",
 "It falls back toward the single nearest row, which a learner can check by hand",
 ["It matches scikit-learn exactly, so predictions agree between the two tools on every row",
  "Every tied vote is removed, so `tiedVotes` always reads 0 on any well",
  "Speed: it is faster than the sort-first rule on large sets of training rows"],
 "The conventions table: kNN tied vote, this engine \"the tied facies whose nearest member comes first\", alternative \"the facies that sorts first (scikit-learn)\", reason \"it falls back toward the single nearest row, which a learner can check by hand\". The rule settles ties and still counts them; on EKENE-8 at k 2 `tiedVotes` reads 1. Its predictions can differ from scikit-learn's on tied rows.")

# 4
x("In the equidistant-neighbour golden, what would be predicted had the engine taken row 2 (label c) as the second neighbour in place of row 0 (label a)?",
 "Still b: votes b 1 and c 1 tie, and the tie goes to row 1, the nearer neighbour",
 ["c, as row 2 would outvote row 1 by lying nearer to the new row than row 0",
  "a refusal, as two tied rules in one call cannot both be applied",
  "c, the facies that sorts last, since b and c are tied at one vote each"],
 "Swap in row 2 and the neighbour list reads row 1, label b, then row 2, label c: one vote each. The vote rule hands a tie to the facies whose nearest member comes first, and row 1 sits on the new row, so the prediction stays b while the printed list changes. Both tie rules apply in turn, and neither refuses.")

# 5
x("A new row passed to `knnClassify` carries only one log, while the training rows carry four. What comes back?",
 "\"Xnew must have 4 columns, like X\"",
 ["A prediction from GR alone, padding the three missing logs with 0",
  "\"X must have 4 columns, as the model was fitted on\"",
  "A prediction with a warning that three logs were dropped"],
 "knnClassify refuses by name, field `Xnew`, in the words of the key. \"as the model was fitted on\" is how `assignClusters` words its column refusal, and pcaTransform and cartPredict use the same form with \"the PCA\" or \"the tree\"; kNN keeps no fitted model and compares against X. The engine neither pads nor drops a log.")

# 6
x("Held-out EKENE-6 at k 7 and k 9 both score 0.800000. What may a report say about the two?",
 "They score the same accuracy on the 30 rows of EKENE-6, which says nothing about other wells",
 ["They are the same model, since two values of k that score alike on one well give the same predictions",
  "The larger k is to be preferred, since a larger k averages more rows at no cost in accuracy",
  "Both beat k 15 by a margin that proves the accuracy falls steadily with every rise in k"],
 "The table gives 0.800000 at both k, each on the 30 rows of EKENE-6; equal accuracies do not mean the same rows were right, and one held-out well is one draw. The accuracy does not fall steadily: k 3 at 0.866667 is above k 1 at 0.833333. A larger k reaches further from the new row, and whether that helps is what the held-out score measures.")

# 7
x("Cored row 6 reads GR 59.800000, RHOB 2.415000, NPHI 0.221000 and PEF 1.990000. Traced down the printed five-channel tree, which leaf does it reach?",
 "The shaly-sand leaf of 30 rows, past NPHI above 0.123000, GR at or below 95.600000, RHOB above 2.357000 and GR above 55.950000",
 ["The sandstone leaf of 45 rows, past NPHI above 0.123000, GR at or below 95.600000 and RHOB at or below 2.357000",
  "The shaly-sand leaf of 11 rows, past GR at or below 55.950000 and then RHOB above 2.381000",
  "The shale leaf of 29 rows, since its GR of 59.800000 sits above the node 9 threshold of 55.950000"],
 "NPHI 0.221000 is above 0.123000, so the row goes right; GR 59.800000 is at or below 95.600000; RHOB 2.415000 is above 2.357000; GR 59.800000 is above 55.950000, which ends at the leaf \"class: shaly-sand (n = 30, counts 0/0/0/30)\". The engine's cartPredict gives shaly-sand for this row, its core facies. The shale leaf sits past GR above 95.600000.")

# 8
x("EKENE-1's first cored row, a sandstone at 6216 ft, has NPHI 0.225000 and PEF 1.660000, with GR 48.900000 and RHOB 2.284000. Which leaf holds it once `cartPredict` runs it through the tree grown on all 180 cored rows with five channels?",
 "The leaf of 45 rows, counts 0/44/0/1, so sandstone, its core facies",
 ["A leaf of 4 rows, reached past NPHI above 0.259000, so shaly-sand is predicted",
  "The leaf of 2 rows past PEF above 2.490000, so shaly-sand",
  "Past RHOB at or below 2.381000, the leaf of 5 rows, so sandstone again"],
 "NPHI 0.225000 is above 0.123000; GR 48.900000 is at or below 95.600000; RHOB 2.284000 is at or below 2.357000; NPHI 0.225000 is at or below 0.259000; PEF 1.660000 is at or below 2.490000: the sandstone leaf of 45 rows. The engine's cartPredict gives sandstone. The RHOB split at 2.381000 sits on the other side of the RHOB 2.357000 split, which this row never reaches.")

# 9
x("Which rows of the 180 cored rows reach node 3 of the five-channel tree, the RHOB split at 2.357000 with 97 rows and Gini 0.499522?",
 "Those sent right at the root and then left at node 2",
 ["Rows with NPHI at or below 0.123000 and RHOB above 2.357000",
  "Rows with GR above 95.600000, the shale rows, and no others",
  "All 180 rows, as every node sees each row"],
 "Node 3 is the left child of node 2: past the root's right side, NPHI above 0.123000, and node 2's left side, GR at or below 95.600000. Of node 2's 126 rows, 29 go right to the shale leaf and 97 reach node 3. The limestone rows stop at the root's left leaf. A node sees only the rows its path lets through.")

# 10
x("A tree of maxDepth 1 on the 180 cored rows has 3 nodes and 2 leaves, with a training accuracy of 0.577778 on those rows. Grown without EKENE-6, the same depth scores 0.000000 on EKENE-6. How should the second figure be read?",
 "As an accuracy on EKENE-6's 30 rows for a one-split tree: none of those rows is predicted as its core facies",
 ["As a failed call, since an accuracy of 0 is what the engine returns when a held-out well is refused",
  "As proof that the root split on NPHI is wrong, since a correct split would place some rows right",
  "As the training accuracy of a tree grown on EKENE-6 itself, printed in the held-out column by error"],
 "The depth table prints both columns: 0.577778 on the rows the tree was grown on and 0.000000 on EKENE-6, held out, at maxDepth 1, and 0.000000 at maxDepth 0 too. A refusal returns no accuracy at all. The figure says the one-split tree grown on the other five wells predicts none of EKENE-6's rows right; deeper trees reach 0.900000 there.")

# 11
x("At maxDepth 0 the tree on the 180 cored rows is one leaf. What does it predict, and why does its training accuracy read 0.300000?",
 "limestone, the most common facies, and 54 of the 180 rows are limestone",
 ["limestone, the facies that sorts first, breaking a tie among the four",
  "shaly-sand, the facies with the lowest silhouette, the hardest to separate",
  "no facies at all: a single leaf is refused with the field `maxDepth`"],
 "A leaf predicts its most common facies, and limestone holds 54 of the 180 cored rows, the most; the sort-first rule settles only a tie, and the counts 54, 50, 29 and 47 do not tie. Every limestone row is right, 54 of 180, 0.300000. maxDepth 0 is accepted; the refusal is for a negative depth.")

# 12
x("A colleague reads NPHI's importance of 0.444883 in the five-channel tree as proof that facies depend on NPHI more than on any other log. What does the course say?",
 "An importance describes this tree; to ask whether a log matters, grow the tree without it and score a held-out well",
 ["The reading is right: an importance is a property of the rock, measured from the cored rows",
  "The reading is right for NPHI and wrong for PEF, whose low importance comes from a scaling error",
  "Importances describe the rock only after they are rescaled by the population SD of each log"],
 "An importance describes the logs this tree happened to use, given the rows, the column order, the tie-breaks and the depth. NPHI took the root only because it came before PEF in the column order; with PEF first, PEF takes it. A tree scales nothing. Whether a log matters to the prediction is a different question, answered by a held-out score without it.")

# 13
x("A tree is grown on the four logs in the order PEF, GR, RHOB, NPHI at depth 1. Which log takes the root?",
 "PEF, the lower column index of the two logs tied for the root",
 ["NPHI, which wins the root tie on the cored rows in any column order",
  "GR, the log with the largest unit, as gAPI outweighs the other logs",
  "Both, since equal decreases are kept together in one root node"],
 "NPHI and PEF each separate exactly the 54 limestone rows, so their decreases are exactly equal, and the tie goes to the lower feature index. With PEF first, PEF has index 0 and NPHI index 3. GR splits the limestone off no better, and a node splits on one log only.")

# 14
x("`cartFit` is passed four logs with a names list of only two. What does it return?",
 "\"names must be an array of 4 feature names, one per column\"",
 ["Nothing is refused: the two named logs are used and the two unnamed ones are dropped from the tree",
  "A tree in which the engine names the two missing logs itself, in column order, on the printed lines",
  "\"X must have 4 columns, as the tree was fitted on\""],
 "cartFit checks its names against the columns of X and refuses by name, field `names`, in the words of the key. The engine neither drops a log nor invents a name for one. The column refusal belongs to cartPredict, which compares new rows with the tree it was given.")

# 15
x("How does the engine compare two candidate thresholds on the same log whose splits give the same decrease?",
 "The lower threshold wins, after the lower feature index has been applied",
 ["The threshold nearer the log's mean over the node wins, as it balances the two sides",
  "The higher threshold wins, as it sends more rows to the left child",
  "Both are kept and the tree prints the midpoint of the two thresholds"],
 "The basis: \"equal decreases (compared exactly on the integer counts) go to the lower feature index, then the lower threshold\". Within one log the feature index is the same, so the lower threshold settles it. A node keeps one threshold, and neither the mean nor the rows sent left enters the rule.")

# 16
x("The five-channel tree splits node 4 on NPHI at 0.259000 and node 5 on PEF at 2.490000. How did the engine form such a threshold?",
 "As a/2 + b/2 of two consecutive distinct values of that log among the node's rows",
 ["As the value of one training row, the last one sent left, copied out to six decimals",
  "The log's mean over the node's rows, rounded to the precision the log carries",
  "A grid point in fixed steps, chosen so the threshold prints in few digits"],
 "A candidate threshold sits halfway between two neighbouring distinct values of the log in the node, computed as a/2 + b/2; any value between the two would send the same rows each way. A training value is used only when the midpoint rounds to b. Thresholds such as 2.490000 print short because their midpoints happen to; RHOB at node 10 prints with a tail in the tree's own lines.")

# 17
x("`cartPredict` is passed the result of `kmeans` in place of a tree. What does it return?",
 "A refusal naming `model`: \"model must be the result of cartFit\"",
 ["The facies of each row's nearest k-means centre, read as a one-level tree",
  "A refusal naming `X`: \"X must have 4 columns, as the tree was fitted on\"",
  "The cluster numbers of the k-means result, returned under the name predictions"],
 "Each prediction function checks that it was given the right kind of model: cartPredict says \"model must be the result of cartFit\", as assignClusters says \"model must be the result of kmeans\" and pcaTransform \"model must be the result of pca\". The column refusal is real but belongs to new rows with the wrong number of logs for a tree. A k-means result is never read as a tree.")

# 18
x("On EKENE-7, which rows does kNN at k 5 get wrong against the withheld facies, and what does that make of the tree's 2 disagreements with it?",
 "None; so each disagreement is a tree miss, 28 of 30 right for the tree",
 ["Two; and those are the rows where the two methods disagree with each other",
  "Three sandstone rows read as shaly-sand, as on EKENE-8, with the tree right",
  "Unknown: the course never reads EKENE-7's withheld facies"],
 "Only because the field is synthetic, the withheld facies scores kNN 1.000000 on EKENE-7, all 30 rows; any row where the tree gives another facies is then a tree miss, and the tree scores 0.933333, 28 rows. The three sandstone misses belong to EKENE-8, whose GR reads 30 gAPI high. The course reads the withheld facies once, to check both uncored wells.")

# 19
x("Applied unchanged to EKENE-7, the cored-row min-max scaler returns 1.035264 as that well's largest PEF value. How is that read?",
 "At least one EKENE-7 row reads PEF above the cored maximum of 5.330000 b/e, and nothing was clipped",
 ["EKENE-7 carries a planted PEF fault, as EKENE-8 carries a gamma ray one, stated by the generator of the field",
  "The scaler clipped EKENE-7's PEF at 1, and the printed figure is only a rounding of that clipped value",
  "Nothing: a value above 1 on min-max only happens for GR, so the figure is read as inside the range"],
 "Min-max maps the cored maximum, 5.330000 b/e for PEF, to 1 and clips nothing, so a value above 1 is a reading above any cored row. Checked with the engine, EKENE-7's highest PEF is above the cored maximum. The generator states one planted tool fault, EKENE-8's gamma ray; a range check runs on every log, GR included, and on EKENE-7 it flags PEF.")

# 20
x("What gamma ray reading does a value of exactly 1 correspond to on the min-max scaler fitted on the cored rows?",
 "141.200000 gAPI, the highest GR among the 180 cored rows",
 ["56.871111 gAPI, the mean GR of the cored rows, plus one SD",
  "131.100000 gAPI, the GR range of the cored rows, as a level",
  "10.100000 gAPI, the lowest GR, as 1 marks the far end"],
 "Min-max maps each log's cored minimum, 10.100000 gAPI, to 0 and its maximum, 141.200000 gAPI, to 1; 131.100000 is the range it divides by, which is no reading at all. Standard scaling, with a mean and a population SD, is the other scaler. The write-back flags EKENE-8's rows above the cored GR maximum of 141.200000 gAPI.")

# 21
x("On EKENE-8, kNN at k 5 misses 3 rows against the withheld facies and the two methods disagree on 1 row. What follows?",
 "At least 2 of kNN's misses are rows where the tree gives the same wrong facies",
 ["The tree must miss exactly 1 row of EKENE-8, the row where the methods disagree",
  "kNN's 3 misses are all flagged by the range check, as they sit above the GR range",
  "The disagreement row is kNN's only true miss"],
 "Of kNN's 3 misses, at most 1 can be a row where the methods disagree, so at least 2 are rows where they agree on a wrong facies; counted row by row, 2 of 30 rows are missed by both. The tree scores 28 rows right, missing 2. All 3 kNN misses sit inside the GR range, where the check passes them.")

# 22
x("A predicted facies channel is written back with its method, training wells and range flags, but without its held-out score. What does the course say will happen?",
 "It will be read later as core: the held-out score is one of the four things it needs",
 ["Nothing, since any reader can recompute the score",
  "The engine refuses to write a channel named FACIES_PRED until a score is attached to it",
  "It will be read as a cluster, since only a score turns a cluster into a predicted facies"],
 "The course's rule: \"a predicted facies written back without its method, its training wells, its held-out score and its range flags will be read later as core\". The engine writes no channel; the write-back is the caller's. A predicted facies comes from core through kNN or a tree and is no cluster whatever is written beside it.")

# 23
x("Why does the course read the withheld facies of EKENE-7 and EKENE-8 only once, and keep it out of every write-up?",
 "A real uncored well has no such record; it exists only because the generator drew the synthetic field",
 ["Because it holds the capstone's answers, the course hides it from any later step of the Expert tier",
  "Stored at a lower precision than the cored facies, its accuracy figures are unreliable",
  "It came from a different logging run of the two wells, so it cannot be scaled with the cored rows"],
 "The generator kept the facies it drew for the uncored wells apart from the rows as `withheld`; a real field gives no such check, so the honest statement about an uncored well stops at a held-out score and the range flags. A facies is a name, with no precision or scaling, and nothing in the withheld record belongs to any capstone.")

# 24
x("`agglomerative` is passed 3001 rows. What does the engine suggest in its refusal?",
 "Cluster a sample or use kmeans, since it holds every pairwise distance, n(n - 1)/2 of them",
 ["Pass a seed and a sampleSize, which lets it cluster a seeded sample of rows in place of the full set",
  "Switch to average linkage, which needs no pairwise distances and so has no cap on the rows",
  "Split the rows into batches of 3000 and cluster each batch with the same linkage in turn"],
 "The engine's words: \"X has 3001 rows, above the 3000 agglomerative clustering accepts (it holds every pairwise distance, n(n - 1)/2 of them): cluster a sample or use kmeans\". sampleSize and seed belong to the silhouette. Every linkage starts from pairwise distances, and batching is kNN's remedy for its pair cap.")

# 25
x("`silhouette` is passed a sampleSize of 181 on the 180 cored rows. What comes back?",
 "A refusal: \"sampleSize must be a whole number from 2 to 180\"",
 ["The full silhouette of all 180 rows, as a sample that large is read as none",
  "A seeded sample of 180, with a warning that the size was cut to the rows",
  "A refusal naming `seed`, as a sample above the rows needs a new seed"],
 "The boundary table: sampleSize from 2 to min(n, 10000), and n + 1 refused, naming `sampleSize`. The engine does not trim a setting or treat it as absent. The seed refusal is for a sample asked for with no seed.")

# 26
x("A silhouette of the teaching clusters is quoted from a 60-row sample. What must the quote carry, and why?",
 "Its size and its seed: 60 rows at seed 3 score 0.521590 and at seed 4 0.525011",
 ["Nothing extra: every sample of 60 rows gives the full figure, 0.545063, to six decimals",
  "Its scaling only, since the sample is drawn in sorted row order and the seed plays no part",
  "The number of starts, as the sample is re-drawn ten times and the highest figure is kept"],
 "The basis: \"the first 60 rows of a mulberry32(3) Fisher-Yates shuffle, scored among themselves (scikit-learn sample_size)\". Each seed draws its own rows and gives its own figure, and neither reproduces the full 0.545063, so a sampled silhouette is an estimate quoted with its size and seed. Starts belong to k-means.")

# 27
x("Which of the engine's DEFAULTS sets how close a PCA weight must be to the largest to count as largest in the sign rule?",
 "`SIGN_TIE_REL`, 1.00e-9",
 ["`TIE_REL`, 1.00e-12",
  "`REPEATED_EIGEN_REL`, 1.00e-10",
  "`JACOBI_MAX_SWEEPS`, 50"],
 "The DEFAULTS table: `SIGN_TIE_REL` 1.00e-9, \"how close a loading must be to the largest to count as largest, in the sign rule\". `TIE_REL` is the distance and merge-height band, `REPEATED_EIGEN_REL` the repeated eigenvalue test relative to the largest eigenvalue, and `JACOBI_MAX_SWEEPS` the most sweeps pca takes by default. Three bands, three rules.")

# 28
x("Which DEFAULTS entry caps the distinct clusters or facies that `matchClusters` takes, and at what?",
 "`MATCH_MAX_LABELS`, 50",
 ["`SILHOUETTE_MAX_ROWS`, 10000",
  "`KMEANS_N_INIT`, 10",
  "`AGGLOMERATIVE_MAX_ROWS`, 3000"],
 "The DEFAULTS table: `MATCH_MAX_LABELS` 50, \"the most distinct clusters or facies matchClusters takes\". `SILHOUETTE_MAX_ROWS` 10000 is the most rows the silhouette scores in full, `AGGLOMERATIVE_MAX_ROWS` 3000 the most rows agglomerative clustering accepts, and `KMEANS_N_INIT` 10 the starts.")

# 29
x("The correlation PCA of the cored rows took 6 Jacobi sweeps and converged. Checked with the engine, what does the same call return with maxSweeps 3?",
 "The result, `converged` false, and the warning \"Jacobi did not converge in 3 sweeps (the last sweep still rotated): ...\"",
 ["A refusal naming `maxSweeps`, since 3 sweeps are fewer than the 6 the rows are known to need",
  "The converged result, as the engine runs on to 6 sweeps whenever a smaller limit falls short",
  "The result with no warning, since the warning is raised only for a repeated eigenvalue"],
 "maxSweeps 3 is accepted: the only refusal is below 1. Sweep 3 still needed a rotation, so the engine returns the eigenvalues and components after sweep 3, sets `converged` false and warns: \"Jacobi did not converge in 3 sweeps (the last sweep still rotated): the eigenvalues and components shown are those after sweep 3\". A limit is kept as given, and pca has two warnings.")

# 30
x("Does the correlation PCA of the 180 cored rows, eigenvalues 2.729404, 1.101519, 0.097784 and 0.071294, raise the repeated-eigenvalue warning?",
 "No: no adjacent pair comes within 1.00e-10 x 2.729404 of each other",
 ["Yes: the last two eigenvalues are both far below the first two and count as repeated",
  "Yes: any two eigenvalues below 1 are flagged, whatever the gap between them",
  "No: the warning is raised only on a covariance matrix, never a correlation"],
 "The test compares adjacent sorted eigenvalues and flags a pair when abs(lambda_k - lambda_(k+1)) <= 1.00e-10 x lambda_1, the largest, 2.729404 here. Every gap here is far wider than that, and the course states that no pair is repeated on these rows. Nothing depends on how small an eigenvalue is, and the test applies to either matrix: the four-row golden uses a covariance matrix.")

# 31
x("With 10 starts and maxIter 5 at k 4 and seed 3, 6 of the 10 starts converge and the winning start, start 3, does not. What does the result carry?",
 "`converged` false and a warning, both describing the winning start; each start's own flag is in `runs`",
 ["`converged` true, since a majority of the starts converged, and no warning",
  "A refusal naming `maxIter`, since the winning start did not converge within it",
  "The best converged start in place of start 3, with a note of the swap"],
 "Six starts converged, but the result reports the start that won on inertia, start 3, which stopped at the limit; the other starts' own flags sit in `runs`. Starts are never polled and a converged start is never swapped in for the winner. A stop at maxIter returns labels, one per row, and is never refused.")

# 32
x("An elbow run finds two values of k with exactly the same highest mean silhouette. Which does `bestSilhouetteK` report?",
 "The smaller k, by the engine's stated tie rule",
 ["The larger k, as more clusters fit the rows more closely",
  "Neither, as the engine picks no k and prints only the table",
  "The k whose inertia drop fraction is larger of the two"],
 "The basis: \"bestSilhouetteK has the highest mean silhouette; a tie goes to the smaller k. No elbow is picked automatically: read the drops\". The engine does report a best silhouette k; what it never picks is an elbow. The drop fractions are printed for the reader and take no part in the tie.")

# 33
x("`cutTree` is passed a linkage matrix whose row 1 names a cluster id that no earlier merge has made. What is refused?",
 "The row, by name: \"linkageMatrix[1] must be [id1, id2, height, size] with whole ids 0 <= id1 < id2 < 4\"",
 ["Nothing: cutTree creates the missing cluster at height 0 and cuts the matrix it has",
  "The whole matrix, as empty: \"linkageMatrix must be the non-empty linkageMatrix of agglomerative\"",
  "The row, as a repeat: \"linkageMatrix[1] merges id 0, which linkageMatrix[0] already merged\""],
 "cutTree checks that a passed matrix describes a real tree. An id not yet made fails the form check on that row, in the words of the key. The empty-matrix refusal and the merged-twice refusal are real messages for other faults: no rows at all, and an id used by two merges. Nothing is created to repair a matrix.")

# 34
x("`kmeans` is passed starting centres through init together with nInit 5. What happens?",
 "A refusal: \"nInit must be 1 (or left out) when init gives the starting centres\"",
 ["Five starts, each one beginning from the given centres, with the best of the five kept",
  "The given centres are used for one start and the other four starts use k-means++ seeding",
  "A warning that nInit was ignored, then a single start from the centres"],
 "Given centres fix the start completely, so more starts would repeat it; the engine refuses, naming `nInit`, in the words of the key. It neither mixes seeding methods nor ignores a setting with a warning.")

# 35
x("For the clustering scaler, the engine uses standard scaling on the population SD. What alternative does the course name, and why was it declined?",
 "No scaling or min-max; logs in different units would otherwise be ruled by GR",
 ["The sample SD, n - 1; it gives larger scales and so shorter distances between rows",
  "Scaling each well on its own statistics; it would hide the gamma ray fault in EKENE-8",
  "A robust scale from the median; the engine prefers it only when a log has outliers"],
 "The conventions table: clustering scaler, this engine \"standard, population SD (n), fitted on the rows clustered\", alternative \"no scaling, or min-max\", reason \"logs in different units would otherwise be ruled by GR\". Scaling each well on its own statistics is a wrong way the course measured on kNN, and the table names no such alternative; median scaling is not built, and outliers belong to the data quality course.")

# 36
x("Why does the engine fix the sign of every PCA component by a stated rule?",
 "So the same data give the same signs; the alternative is whatever the solver returns",
 ["To make the first component always load GR positive, as the gamma ray is the first log passed",
  "Signs let the loadings be read as rock types directly, without matching them against core",
  "Eigenvalues must come out positive, and a negative sign would flip a variance"],
 "The conventions table: PCA sign, this engine \"largest absolute weight positive, with a band\", alternative \"whatever the solver returns\", reason \"the same data give the same signs\". On the cored rows the first component's largest weight is NPHI's. A direction and its negative are the same direction, eigenvalues are variances whatever the sign, and rock types are read by matching against core.")

# 37
x("A study wants some rows left out of every cluster as noise. What does the course say the engine offers?",
 "Nothing of the kind: density clustering is not built, so every row is placed in a cluster",
 ["Agglomerative clustering labels as noise the rows it merges at the greatest heights",
  "k-means marks as noise the rows whose distance to their centre is the largest of all",
  "A noise option in silhouette that drops every row whose score falls below 0"],
 "What is not built lists no density clustering (DBSCAN) and no spectral clustering; clustering is k-means and agglomerative, and each places every row. The silhouette scores rows, and the 3 below 0 in the teaching clusters stay in their clusters. Neither k-means nor agglomerative labels a row as noise.")

# 38
x("Which course owns scoring every cored well in turn, and the precision and recall of each facies?",
 "The machine learning course: this engine does not split wells or cross-validate",
 ["This course, in the Expert tier, through the held-out EKENE-6 score of 0.833333",
  "The data quality course, which also owns gamma ray normalisation between wells",
  "The petrophysics course, which owns the facies definitions that the core records describe"],
 "The engine does not split wells or cross-validate; a split by whole wells and its scores belong to the machine learning course, whose report is read here and never re-derived. This course states one held-out well. The data quality course owns log conditioning and gamma ray normalisation, and petrophysics owns porosity, saturation and net pay.")

# 39
x("A facies note gives accuracies of 0.950000 and 0.833333. Which wording names their rows as the course requires?",
 "0.950000 is one-to-one matching on the 180 cored rows; 0.833333 is kNN at k 5 on the 30 rows of EKENE-6, held out",
 ["0.950000 is the k-means accuracy and 0.833333 the kNN accuracy, both on the Ekene field as a whole",
  "0.950000 is kNN on the 180 cored rows it trained on; 0.833333 is k-means on the uncored wells",
  "Both are training accuracies on the 180 cored rows, one for the clusters and one for the neighbours"],
 "Accuracy names its rows: the training rows of a tree, a held-out cored well, or, only in this synthetic field, the withheld facies of an uncored well. One-to-one matching of the teaching k-means scores 0.950000 on the 180 cored rows; kNN at k 5, trained on the other five cored wells, scores 0.833333 on EKENE-6. No accuracy is claimed for an uncored well.")

# 40
x("In the facies note, what is written on the line for how k was chosen?",
 "The core describes 4 facies; the drop fractions and the best silhouette, at k 3, are printed beside the choice",
 ["Picked by the elbow: k 4, which the engine locates automatically at the largest drop fraction",
  "Silhouette first: k 3 holds the best figure, 0.690362, the engine's recommended number",
  "Lowest inertia: k 4 at 58.289042, the best fit of any k the elbow tried"],
 "The note writes the choice as a reading of printed tables: the core describes 4 facies, and the drop fractions 0.668972, 0.282430 and 0.112303 at k 3, 4 and 5 and the best silhouette at k 3 sit beside it. No elbow is picked automatically, and the silhouette's best k disagrees with the core's 4. Inertia always falls as k grows, so the lowest inertia is never the answer.")

# 41
x("The facies note carries a line on where the clustering fails. What does it say?",
 "Shaly-sand: 9 of its 47 rows fall with sandstone",
 ["Limestone: its 54 rows split between two clusters",
  "Shale: its 29 rows fall with shaly-sand at k 4",
  "Sandstone: 9 of its 50 rows fall with shaly-sand"],
 "The contingency table of the teaching clustering puts 50 sandstone and 9 shaly-sand rows in cluster 1, so matched to sandstone its shaly-sand rows are scored wrong; shaly-sand's recall is 0.808511. Limestone and shale each fill one cluster alone, 54 and 29 rows, and every sandstone row lands in the sandstone cluster.")

# 42
x("Of the three rules that settle a distance or height tie, which is the agglomerative one?",
 "The tied pair of merges with the lowest cluster ids wins",
 ["The merge whose new cluster would hold the most rows wins",
  "The merge first reached by k-means++ seeding wins",
  "The merge with the higher Ward height wins the tie"],
 "Each function breaks a tie by its own stated rule inside the 1.00e-12 band: k-means gives a tied row to the lower centre, kNN takes the lower row, and agglomerative takes the tied pair with the lowest cluster ids, the smaller id first. Tied merges have the same height by definition, and neither size nor any seeding enters.")

assert next(_i, None) is None
emit(Q, '/root/dai-wip-facies/banks/d3a_exam.json', expect_n=42)
finish()
