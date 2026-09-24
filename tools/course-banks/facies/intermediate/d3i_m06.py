import sys, os; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D3 Professional m06, electrofacies against core end to end.
# Figures are the course's five-step judging workflow on the 180 cored rows of
# EKENE-1 to EKENE-6, the mean logs of each core facies and the write-up
# table. No capstone field, well, stated input or graded answer appears.

q(2, "In the five-step judging workflow on the cored wells, which step is the first to take the core facies as an input?",
 "Step 4, matchClusters one-to-one",
 ["Step 1, since the elbow scores each k against the four facies",
  "Step 3, where each labelling's silhouette is set against the core",
  "Step 2, where k-means is seeded from one row of each facies"],
 "The engine's function table lists the elbow's inputs as X, kMin, kMax, seed, nInit, scale and withSilhouette, kmeans and agglomerative take no facies, and silhouette takes the labels under test; matchClusters is the first call given yTrue. Clusters are made from logs alone before the core enters.")

q(0, "What are the mean silhouettes of the Ward and complete-linkage cuts at k 4, beside k-means at 0.545063?",
 "Ward 0.531627, complete 0.530601",
 ["Ward 0.873388, complete 0.897678, the figures of each cut",
  "Both 0.514177, the figure shared by every agglomerative cut",
  "Ward 0.599453, complete 0.438615, read from the cluster table"],
 "The workflow prints the Ward and complete silhouettes at k 4 as 0.531627 and 0.530601. 0.873388 and 0.897678 are their adjusted Rand indices against core; 0.514177 is the average-linkage cut alone; and 0.599453 and 0.438615 are k-means clusters 0 and 1.")

q(3, "Step 1 of the workflow reads the elbow with its silhouette. What does it return on the cored rows?",
 "Drop fractions 0.668972, 0.282430, 0.112303 at k 3, 4, 5, and the best silhouette at k 3",
 ["An elbow picked at k 4 by the drop fractions, with the best silhouette also at k 4",
  "Drop fractions 0.659179, 0.668972, 0.282430 at k 3, 4, 5, and the best silhouette at k 2 instead",
  "The drops 164.159721, 22.942083, 6.546018 at k 3, 4, 5, and no silhouette until step 3"],
 "The workflow table prints drop fractions 0.668972, 0.282430 and 0.112303 at k 3, 4 and 5, and the best silhouette at k 3. No elbow is picked automatically; 0.659179 is the k 2 fraction; and the silhouette at each k comes from the elbow call when withSilhouette is set.")

q(1, "Across its four logs, where does shaly-sand's mean sit against the other core facies?",
 "Between sandstone's mean and shale's mean on every one of the four logs",
 ["Beside limestone's on RHOB and PEF, which is why it overlaps limestone in the clusters",
  "Above shale's on GR, at 117.406897, so gamma ray alone sets it apart",
  "On sandstone's on every log, since the two facies share one mean"],
 "The mean-log table reads shaly-sand GR 65.208511, RHOB 2.397043, NPHI 0.241766 and PEF 2.222553, each between sandstone's (46.314000, 2.317520, 0.198340, 1.956800) and shale's (117.406897, 2.510793, 0.337069, 3.213793). 117.406897 is shale's own GR mean.")

q(2, "Which three figures from the course point at shaly-sand as the facies the logs barely separate?",
 "Its core-facies silhouette 0.152252, its recall 0.808511, and 9 of 47 rows in the sandstone cluster",
 ["Its silhouette 0.245762, its recall 0.000000 at k 4, and 38 of 47 rows in the sandstone cluster of the teaching run",
  "Its F1 of 0.917431, its precision 0.847458, and the 9 sandstone rows that fell into cluster 3",
  "An index of 0.676404 against core, its 96-row cluster, and 29 of its rows alone in cluster 0"],
 "Shaly-sand has the lowest core-facies silhouette, 0.152252, and a recall of 0.808511 under the k-means mapping, with 9 of its 47 rows in the sandstone cluster. 0.245762 is cluster 3's silhouette; 0.917431 and 0.847458 are sandstone's F1 and precision; 0.676404 is average linkage's index.")

q(0, "The write-up states how k was chosen. What does it say?",
 "The core describes 4 facies, with the elbow's drop fractions and the silhouette at k 2 to 8 printed beside the choice",
 ["k 3 was chosen because both the drop fraction and the silhouette peak there, and the core count was set aside",
  "k 4 was picked by the engine's elbow, which the silhouette then confirmed with its best mean figure at k 4",
  "Nothing about k, since a stated k needs no evidence once the clusters are matched to the core facies"],
 "The write-up table reads \"the core describes 4 facies; the elbow's drop fractions and the silhouette at k 2 to 8 are printed beside the choice\". The engine picks no elbow, and the best silhouette is at k 3, so the evidence that pointed elsewhere is printed with the choice.")

q(3, "Which line belongs in the write-up's \"what is not claimed\"?",
 "No facies for an uncored well",
 ["No agreement with core, since the clusters never saw it",
  "No accuracy for k-means, since matching is a choice",
  "No methods other than k-means, since the trees need no seed"],
 "The write-up table's last line opens \"no facies for an uncored well\". The same write-up does state agreement with core (the indices) and the one-to-one accuracy 0.950000, and it compares Ward, complete and average linkage beside k-means.")

q(1, "The write-up's \"where it fails\" line is stated in rows. What does it say?",
 "shaly-sand: 9 of 47 rows fall with sandstone",
 ["average linkage: 96 rows in one cluster and one row alone at k 4",
  "sandstone: 9 of its 50 rows fall with shaly-sand",
  "limestone: its 54 rows split into two clusters at k 5"],
 "The table reads \"shaly-sand: 9 of 47 rows fall with sandstone\". Sandstone's 50 rows all sit in cluster 1 (recall 1.000000), and limestone keeps one cluster of 54 at k 5 under majority matching. Average linkage's sizes are a finding about one method, recorded with its index of 0.676404.")

q(2, "Of the four k 4 labellings, which ranks first by mean silhouette, and which by the index against core?",
 "k-means first by silhouette, 0.545063; complete first by index, 0.897678",
 ["Complete linkage first on both measures, at 0.530601 and at 0.897678 against core",
  "k-means first by both, at 0.545063 and 0.872413",
  "Ward first by silhouette, 0.531627; average linkage first by index, 0.676404"],
 "The silhouettes read k-means 0.545063, Ward 0.531627, complete 0.530601, average 0.514177; the indices read complete 0.897678, Ward 0.873388, k-means 0.872413, average 0.676404. The two measures rank the methods differently because one scores compactness and the other agreement with rock.")

q(0, "The write-up gives both the index against core and the one-to-one accuracy for k-means. Which of the two depends on a choice of mapping?",
 "The accuracy, 0.950000; the index, 0.872413, uses no mapping",
 ["The index, 0.872413, since it pairs each cluster with one facies",
  "Neither, since both are computed on the same 180 cored rows alone",
  "Both, since each needs the clusters named as facies first"],
 "The one-to-one accuracy scores mapped predictions, so its mode is named; the index's basis reads \"adjusted Rand index of the clusters against the facies (independent of the mapping)\". Counting the same rows does not make two figures depend on the same choices.")

q(1, "Why does the agglomerative half of step 2 carry no seed in the write-up while k-means carries seed 3 and 10 starts?",
 "The agglomerative call has no seed input, and each tree is named by its linkage",
 ["Its seed is shared with the k-means call, so stating seed 3 once covers both methods",
  "Its seed is chosen by the linkage, Ward drawing one and the others none",
  "A seed would be quoted, but the trees used the default of 3 as well"],
 "The function table lists agglomerative's inputs as X, linkage, k, scale and names, and the write-up names each tree only by its linkage. k-means carries its seed and starts because another seed could stop elsewhere, as seed 5 does at 58.297079 with ten starts.")

q(3, "At k 5 under majority matching, shaly-sand takes two clusters of its own and accuracy rises to 0.983333. What does that show?",
 "Two nearly pure shaly-sand clusters, 24 of 24 and 21 of 22 rows, and no case for k 5",
 ["That k 5 is the right k, since the accuracy beats the k 4 figure of 0.950000",
  "The core description is wrong, and shaly-sand is two separate facies",
  "The sandstone cluster was the cause, since sandstone takes two clusters at k 5"],
 "At k 5 majority matching gives shaly-sand clusters 3 and 4 (24 of 24 and 21 of 22 rows) and 0.983333. Splitting a facies costs majority matching nothing, so the higher score is no evidence for k 5, and sandstone takes one cluster, cluster 2.")

q(2, "On which logs is shale's mean the highest of the four core facies?",
 "GR and NPHI, at 117.406897 gAPI and 0.337069 v/v",
 ["RHOB and PEF, at 2.510793 and 3.213793",
  "GR alone, at 117.406897; limestone leads on the other three logs",
  "GR and PEF, at 117.406897 gAPI and 3.213793 b/e respectively"],
 "The facies means read GR 26.879630, 46.314000, 117.406897, 65.208511 and NPHI 0.069037, 0.198340, 0.337069, 0.241766 for limestone, sandstone, shale and shaly-sand, so shale is highest on both. Limestone leads on RHOB, 2.642481, and PEF, 4.909259, and leads on neither GR nor NPHI.")

q(0, "Why should the average-linkage mean silhouette at k 4 always travel with its cluster sizes?",
 "0.514177 on its own hides a cluster of 96 rows and a row alone",
 ["Because 0.514177 is refused by the engine unless the sizes are attached",
  "Its sizes decide the scaling the silhouette uses",
  "Sizes turn 0.514177 into an index against core"],
 "The average-linkage cut scores 0.514177 with clusters of 96, 54, 29 and 1; the mean alone gives no hint of the large cluster or the lone row, which the sizes show at once. The silhouette is scored on the standardised logs whatever the sizes, and no size makes it an agreement with rock.")

q(1, "Which rows and logs does the write-up name for the comparison with core?",
 "The 180 cored rows of EKENE-1 to EKENE-6; GR, RHOB, NPHI and PEF, standard scaling",
 ["All 240 rows of the eight wells, with CALI kept as a fifth log for the hole size",
  "The 180 cored rows on the raw logs, so that gamma ray keeps its own units",
  "The 30 rows of EKENE-1 alone, each log standardised on those rows"],
 "The write-up table reads \"180 cored rows of EKENE-1, EKENE-2, EKENE-3, EKENE-4, EKENE-5, EKENE-6; GR, RHOB, NPHI, PEF, standard scaling\". Only cored rows can be compared with core, CALI carries no rock signal, and every figure in the comparison is on the standardised logs.")

emit(Q, '/root/dai-wip-facies/banks/d3i_m06.json', expect_n=15)
finish()
