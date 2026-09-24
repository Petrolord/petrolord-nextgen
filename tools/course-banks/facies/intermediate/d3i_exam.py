import sys, os; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D3 Professional final exam, 42 questions across m01 to m06.
# Figures are the course's elbow, silhouettes, agglomerative trees, matching
# tables and adjusted Rand indices on the 180 cored rows of the Ekene field,
# the stated small cases and the stated refusals. Questions marked CROSS need
# two modules at once. No capstone field, well, stated input or graded answer
# appears.

# m01, the elbow
q(2, "On the seed 3 elbow of the cored rows, what are the drop and the drop fraction at k 5?",
 "A drop of 6.546018, a fraction 0.112303",
 ["A drop of 6.546018, a fraction 0.079256 of the k 5 inertia itself",
  "4.100956 as the drop, with 0.112303 as the fraction",
  "22.942083 fallen, a fraction 0.282430 of what remained"],
 "At k 5 the inertia falls from 58.289042 to 51.743024, a drop of 6.546018, and the fraction divides by the k 4 inertia to give 0.112303. 0.079256 is the k 6 fraction and 4.100956 the k 6 drop; 22.942083 and 0.282430 belong to k 4.")

q(0, "The seed 3 elbow prints a drop of 3.092553 at k 8 after 2.686056 at k 7. Is that an inertia rise?",
 "No: the inertia still falls, to 41.863457; only the drop grew",
 ["Yes, and the engine warns that the k 8 runs stopped in a local minimum",
  "Yes: a larger drop at a larger k marks a poor stop",
  "It is, and the k 8 fraction prints as none"],
 "A rise means a larger k prints a HIGHER inertia; here k 8 reads 41.863457, below the 44.956011 of k 7, so nothing is flagged. The larger drop lifts the k 8 fraction to 0.068791 above the k 7 0.056380, which is why the column does not fall smoothly.")

q(3, "Nine seeds of the ten-start table reach the best partition's inertia. Which seed is the exception, and what does it print?",
 "Seed 5, at 58.297079",
 ["Seed 7, at 78.775612, like seed 5 with one start",
  "Seed 10, stopping at 75.911640",
  "Seed 3 once more, at 58.330411"],
 "With ten starts 9 of the 10 seeds reach 58.289042 and seed 5 stops at 58.297079. 78.775612, 75.911640 and 58.330411 are one-start figures, for seeds 7, 10 and 3.")

q(1, "In the ten starts at k 4, seed 3, three starts print 58.289042. Which start keeps the win?",
 "Start 3, the earliest; their largest difference from the winner is printed as 0",
 ["Start 8, the last of the three, since a later equal run replaces the best so far",
  "Start 5, which needed the fewest passes of the three to reach the figure",
  "None of them, since three equal starts make the result ambiguous and it is refused"],
 "The course prints the largest difference between the three and the winner as 0, and a run that only matches the best so far does not replace it, so the earliest, start 3, keeps the win with 6 passes. Nothing is refused; start 5 took 5 passes and start 8 took 6.")

q(1, "At seed 5, k-means with one start stops at 78.775612. What cluster sizes does it return?",
 "32, 96, 30 and 22 rows",
 ["The teaching clustering's 29, 59, 54 and 38 rows",
  "54, 50, 29 and 47 rows, the facies counts",
  "67, 24, 65 and 24 rows, as on the raw logs"],
 "The course prints clusters of 32, 96, 30, 22 rows at seed 5 with one start. 29, 59, 54, 38 is the ten-start teaching clustering, 54, 50, 29, 47 the core facies counts and 67, 24, 65, 24 the raw-log clustering.")

q(3, "How many distinct inertias do the ten starts at k 4, seed 3, print at six decimals?",
 "6",
 ["10, one per start",
  "3, the starts that tie",
  "4, one for each cluster"],
 "The 10 starts print 6 distinct inertias: 58.330411, 75.958349, 58.289042, 78.982664, 78.768801 and 77.624096. Three starts print 58.289042 and three print 58.330411.")

# m02, the silhouette
q(0, "With the core facies used as labels in the standardised space, which facies scores the highest mean silhouette?",
 "Limestone, 0.842345",
 ["Shale, at 0.621976",
  "Sandstone, which reads 0.489765",
  "Shaly-sand, at 0.152252"],
 "The core-facies means read limestone 0.842345, sandstone 0.489765, shale 0.621976 and shaly-sand 0.152252, with 0.528711 over all 180 rows.")

q(2, "A silhouette call asks for a sample larger than the 180 cored rows. What does the engine say?",
 "A refusal naming sampleSize, whose range here runs from 2 to 180",
 ["Scores all 180 rows instead, cutting the sample down to the rows passed",
  "Draws the extra rows again from mulberry32, repeating some of them",
  "labels must be an array of 180 labels, one per row"],
 "The engine refuses by name in its own words, \"sampleSize must be a whole number from 2 to 180\": a sample runs from 2 rows to the rows passed. It neither clips the request nor draws repeats, and the labels message is a different check.")

q(3, "A silhouette call asks for a 60-row sample and passes no seed. What happens?",
 "Refused, naming seed: a sample needs one from 0 to 4294967295",
 ["Uses seed 3, the course's teaching seed, and scores 0.521590",
  "It scores the first 60 rows in file order, with no shuffle at all",
  "Ignores the sample, scoring all 180 rows at 0.545063"],
 "A sampled silhouette draws its rows from a mulberry32(seed) shuffle, so a sample with no seed is refused by name, in the engine's words \"seed must be a whole number from 0 to 4294967295\". No default seed is taken; 0.521590 is what seed 3 gives when it is passed.")

q(2, "Row 56 of the cored rows sits alone in cluster 3 of the average-linkage cut at k 4. Where does it come from, and what does it score?",
 "Shaly-sand of EKENE-2 at 6306 ft, scoring 0.000000",
 ["EKENE-1 at 6228 ft, scoring -0.045137",
  "EKENE-5 at 6462 ft, at -0.002304",
  "Limestone of EKENE-6 at 6526 ft, scoring 0.842778 like its cluster"],
 "Row 56 is shaly-sand of EKENE-2 at 6306 ft, and as a row alone in its cluster it scores 0. The other depths are rows 12, 135 and 169 of the k-means clustering, which score below 0; 0.842778 is k-means cluster 2's mean.")

q(0, "What range of values can one row's silhouette take?",
 "From -1 to 1",
 ["From 0 up to 1 only",
  "Anywhere from -1 to 0",
  "From 0 to the largest distance between rows"],
 "The silhouette is (b - a) / max(a, b), from -1 to 1. The teaching clustering has rows below 0, the lowest at -0.045137, and division by max(a, b) removes the units of distance.")

# m03, agglomerative clustering
q(1, "Which cut of the Ward tree splits the 180 cored rows into clusters of 126 and 54?",
 "k 2, undoing the last merge, at 30.809387",
 ["k 3, undoing merge 177 at 18.119587",
  "k 2, undoing merge 176 at 6.612020, the 96-row cluster",
  "k 4, where the cut undoes the 96 at 6.612020"],
 "At k 2 the Ward cut reads 126, 54 and the merge undone first is the last, 178, at 30.809387. At k 3 it reads 96, 54, 30, undoing merge 177 at 18.119587; merge 176 at 6.612020 is undone first at k 4.")

q(2, "Merge 177 of the Ward tree joins ids 353 and 356 at 18.119587. How many rows does the cluster it makes hold, and which cut undoes it first?",
 "126 rows; the cut at k 3",
 ["96 rows, undone first by the cut at k 4",
  "All 180 rows, which the cut at k 2 undoes first",
  "126 rows, undone first at k 2"],
 "Merge 177 makes id 357 of 126 rows, and the k 3 cut, whose merge undone first sits at 18.119587, splits it. The k 2 cut undoes merge 178 first at 30.809387, and the 96-row cluster is merge 176.")

q(0, "Complete linkage on the standardised logs: which sizes and heights describe its four-cluster cut?",
 "Sizes 51, 46, 54, 29; last merge made 2.205317, next merge 2.970753",
 ["Sizes 52, 44, 54, 30; last merge made 3.659186, next merge up 6.612020",
  "96, 54, 29, 1, with heights 1.273129 below and 1.346979 above the cut",
  "The same 51, 46, 54, 29, but 2.970753 below and 2.205317 above"],
 "The complete-linkage cut at k 4 reads 51, 46, 54, 29 with cut heights 2.205317 (the last merge made) and 2.970753 (the next merge). The Ward and average rows carry the other figures, and the last merge made always sits below the next one on these trees, whose heights never fall.")

q(3, "An agglomerative call on six rows asks for seven clusters. What does the engine say?",
 "It refuses and names k: on six rows a cut runs from 1 to 6 clusters",
 ["It returns six clusters, one per row, and a warning about k",
  "k must be a whole number from 1 to 5 (the number of merges)",
  "It merges nothing and returns every row as cluster 0"],
 "A cut runs from k 1, with nothing undone, to one cluster per row, with every merge undone; seven clusters of six rows is refused in the engine's own words, \"k must be a whole number from 1 to 6 (the number of rows)\".")

q(1, "A hand-built linkage matrix names, in its second row, a cluster id that no merge has yet made. What does cutTree do?",
 "Refuses, naming linkageMatrix[1] and the whole ids that row may hold",
 ["It builds the missing cluster from the rows its id would hold and cuts",
  "linkageMatrix must be the non-empty linkageMatrix of agglomerative",
  "A refusal naming linkageMatrix[0], since the ids begin there"],
 "cutTree checks a matrix it is given and names the row at fault, counted from 0; on the course's small stated case its words are \"linkageMatrix[1] must be [id1, id2, height, size] with whole ids 0 <= id1 < id2 < 4\". The non-empty message is the refusal of an empty matrix, and nothing is built for the caller.")

q(3, "cutTree is handed the Ward tree of the cored rows with k 0. What comes back?",
 "k must be a whole number from 1 to 180 (the number of rows)",
 ["One cluster of all 180 rows, the root",
  "180 clusters, one per row",
  "k must be a whole number from 1 to 179 (the merges in the tree)"],
 "The engine refuses k 0 by name in its own words: a cut runs from 1 to the number of rows. It substitutes neither the root nor the singletons, and the range counts rows, 180, where the matrix holds 179 merges.")

q(2, "On the 180 cored rows, what do the merge heights of Ward, complete and average linkage do from one merge to the next?",
 "They never fall, so each tree can be drawn with every merge above its parts",
 ["They fall once, at the last merge, where the two largest clusters join",
  "Ward's rise throughout; complete and average heights can fall between merges",
  "They hold level at 0.069063 through the first five merges of each tree"],
 "The course states that on these rows the merge heights of all three linkages never fall from one merge to the next. The first five Ward merges run from 0.069063 to 0.117328, and the last Ward merge, at 30.809387, is the highest.")

q(0, "Rows 54 and 96 are joined early in the Ward history. At which step, at what height, and under what new id?",
 "Merge 3, at 0.117222, making id 183",
 ["Step 4, at 0.117328, which makes id 184",
  "Merge 3 at 0.117222, making id 3 after the merge number",
  "Merge 183, at 0.117222, made from ids 54 and 96"],
 "The Ward matrix row for merge 3 reads 54, 96, 0.117222, 2, and the cluster made at merge s is id 180 + s, so id 183. Merge 4 joins rows 20 and 127; merge numbers run 0 to 178, so there is no merge 183.")

q(3, "In the Ward cut at k 4, which cluster number does row 0 of the cored rows carry?",
 "Cluster 0",
 ["Cluster 3, the cluster of 30 rows",
  "Cluster 2, whichever holds limestone",
  "Cluster 1, set by the height order"],
 "A cut numbers its clusters 0 to k - 1 in the order of their first row, so the cluster holding row 0 is cluster 0, whatever its facies or height. The number is a name and says nothing of rock.")

# m04, matching
q(1, "Read down the shaly-sand column of the contingency table for the teaching clustering. Where did its 47 rows go?",
 "38 to cluster 3 and 9 to cluster 1",
 ["All 47 in cluster 3",
  "38 to cluster 1, with the other 9 in cluster 3",
  "24 in cluster 3 and 21 in 4"],
 "The shaly-sand column reads 0, 9, 0, 38 for clusters 0 to 3, so 38 rows in cluster 3 and 9 in cluster 1. 24 and 21 are shaly-sand's two clusters in the k 5 run, a different clustering.")

q(2, "Under majority matching of the k 5 clustering, cluster 2 is named sandstone. How pure is it?",
 "49 of its 51 rows are sandstone",
 ["50 of 59, as in the k 4 run",
  "Every one of its 54 rows is sandstone",
  "21 of 22"],
 "The k 5 majority table reads cluster 2: 49 sandstone rows of 51. 50 of 59 is cluster 1 of the teaching clustering; 54 of 54 is the k 5 limestone cluster; 21 of 22 is cluster 4, named shaly-sand.")

q(3, "Under the one-to-one mapping at k 4, which two facies score 1.000000 on precision, recall and F1 alike?",
 "Limestone and shale",
 ["Sandstone together with shaly-sand",
  "Limestone together with sandstone",
  "Shale and shaly-sand, the pair"],
 "Limestone (cluster 2) and shale (cluster 0) each sit alone in a cluster of their own, and score 1.000000 throughout. Sandstone's precision is 0.847458 and shaly-sand's recall 0.808511.")

q(1, "Why does one-to-one matching of the k 3 clustering give shaly-sand a recall of 0.000000?",
 "No cluster is named shaly-sand, so none of its rows can be predicted as it",
 ["The engine drops shaly-sand from the scoring whenever k is below 4",
  "The zeroDivision setting of 0 forces the recall of shaly-sand to zero",
  "Its 47 rows are refused, since fewer clusters than facies are passed"],
 "Three clusters can carry only three facies names, and shaly-sand is the one without a cluster, so every one of its 47 rows is predicted as some other facies. Nothing is dropped or refused; the zeroDivision setting governs precision of a facies never predicted, and recall here has rows to divide by.")

q(2, "matchClusters is given 179 cluster labels for the 180 cored rows. What does the engine say?",
 "A refusal naming clusters, which must hold one label for each of the 180 rows",
 ["It scores the 179 rows that carry a cluster label and leaves the last row unscored",
  "a must be an array of at least 2 labels",
  "It pads the list with cluster 0 so that every row has a label, and warns that it did"],
 "The engine refuses a list one short in its own words, \"clusters must be an array of 180 labels, one per row\". It trims nothing and pads nothing, and the at-least-2 message belongs to adjustedRandIndex.")

q(0, "Under one-to-one matching, can two clusters take the same facies?",
 "No: each cluster takes a different facies",
 ["Yes, when both clusters are mostly that facies",
  "Yes, once k reaches 5 or more clusters",
  "Only when two mappings tie on rows matched"],
 "One-to-one gives each cluster a different facies, maximising rows matched; at k 5 it is refused. Sharing a facies is majority matching, and a tie between mappings is settled by the first mapping in cluster order.")

# m05, the adjusted Rand index
q(3, "What does an adjusted Rand index near 0 say about two labellings?",
 "They are no more alike than chance",
 ["They share no pair of rows at all",
  "One of the two labellings is a single cluster",
  "They disagree more than chance"],
 "The index is 1 for the same grouping, near 0 for labellings no more alike than chance, and below 0 when they disagree more than chance, as the golden with -0.500000 does. Two single clusters score 1.000000.")

q(1, "Which contingency table does the engine print for a = 0, 0, 0, 1, 1, 1 against b = p, p, q, q, r, r?",
 "Row 0: 2, 1, 0; row 1: 0, 1, 2",
 ["Rows of 3, 0, 0 and 0, 3, 0",
  "Row 0 reads 2, 2, 0 and row 1 reads 0, 0, 2",
  "Every cell 1"],
 "Rows 0 to 2 of a carry p, p, q, so row 0 reads p 2, q 1, r 0; rows 3 to 5 carry q, r, r, so row 1 reads 0, 1, 2. Each row sums to 3 and the columns to 2, 2, 2.")

q(0, "When does the engine's adjusted Rand index come out as 1 because the formula's denominator is zero?",
 "When both labellings are one cluster, or both are all singletons",
 ["When both are one cluster, or one of the two is all singletons",
  "Whenever the labellings hold fewer than 2 rows between them",
  "When the two labellings match row for row, whatever their shape"],
 "Two one-cluster labellings, or two all-singleton labellings, give a zero denominator, and the engine returns 1 there as scikit-learn does. A labelling of fewer than 2 rows is refused naming a, and identical labellings of any other shape reach 1 through the formula itself.")

q(2, "Which pair of facts belongs to the average-linkage cut at k 4 on the cored rows?",
 "Clusters of 96, 54, 29 and 1 rows, and an index of 0.676404 against core",
 ["Clusters of 52, 44, 54 and 30 rows, and an index of 0.873388 against core",
  "The same 96, 54, 29 and 1, but an index of 0.897678 against core",
  "Clusters of 51, 46, 54 and 29, with an index of 0.676404 against core"],
 "The average-linkage cut reads 96, 54, 29, 1 and scores 0.676404 against core. 52, 44, 54, 30 with 0.873388 is Ward, and 51, 46, 54, 29 is complete, which scores 0.897678.")

q(3, "Cluster 3 of the teaching clustering has the lowest cluster silhouette, 0.245762. What does the contingency table say of it?",
 "All 38 of its rows are core shaly-sand",
 ["It holds the 9 sandstone rows that pull its silhouette down",
  "Its 38 rows are spread across all four facies",
  "It holds the 29 shale rows and 9 shaly-sand beside them"],
 "The table reads cluster 3: 38 shaly-sand and nothing else, so the weakest cluster by silhouette is pure against core. The mixed cluster is cluster 1, 50 sandstone and 9 shaly-sand; the 29 shale rows sit alone in cluster 0.")

q(1, "The largest drop fraction and bestSilhouetteK both point to k 3. What happens when the k 3 k-means clustering is matched one-to-one?",
 "It leaves one facies, shaly-sand, with no cluster, and 0.738889 of the rows match",
 ["Every facies finds a cluster, and 0.950000 of the rows land on their facies",
  "The engine refuses, since three clusters are fewer than the four facies",
  "Shale is left out, as the smallest facies, with 0.738889 matched"],
 "At k 3 one-to-one matching leaves shaly-sand with no cluster and an accuracy of 0.738889 over the 180 cored rows. Fewer clusters than facies are accepted; 0.950000 is the k 4 accuracy. The k both measures prefer loses a whole facies.")

q(0, "Which labelling at k 4 holds a row that scores 0.000000 because it sits alone in its cluster?",
 "The average-linkage cut: its cluster 3 is row 56 alone",
 ["The Ward cut, with a lone shale row",
  "The teaching k-means, whose cluster 3 of 38 rows scores 0 on average",
  "Complete linkage, isolating row 12"],
 "The average-linkage cut has sizes 96, 54, 29, 1, and its lone row 56 scores 0 by the stated rule. Ward's smallest cluster holds 30 rows and complete's 29; k-means cluster 3 averages 0.245762; row 12 is a k-means row scoring -0.045137.")

q(2, "Ward and complete linkage both cut the cored rows at k 4. Which agrees better with the core, and what can be said of their cut heights?",
 "Complete, 0.897678 against 0.873388; the two sets of heights are on different scales",
 ["Ward on both counts: 0.873388, and the wider gap from 3.659186 to 6.612020",
  "Complete on both: 0.897678, and its lower heights make the sharper cut of the two",
  "Ward agrees better, while complete leaves the wider gap between its two heights"],
 "Against core complete reads 0.897678 and Ward 0.873388. Ward's cut sits between 3.659186 and 6.612020 and complete's between 2.205317 and 2.970753, yet those ranges belong to different measures of height, so neither gap can rank the trees.")

q(3, "The seed 1 run returns the teaching partition with other cluster numbers. What changes in its contingency table and its index against core?",
 "Only the numbering of the table's rows; the index stays 0.872413",
 ["The index falls to 0.863179, since the names moved",
  "Every count moves, since no row keeps its number",
  "Its index against core reads 1.000000"],
 "Every cluster of one run is exactly one cluster of the other, so the counts are the same in another row order, and against the core both runs score 0.872413. 1.000000 is seed 1 against seed 3; 0.863179 is k-means against Ward.")

# m06, electrofacies against core
q(1, "What is shaly-sand's mean GR on the cored rows, and between which facies does it fall?",
 "65.208511 gAPI, between sandstone's 46.314000 and shale's 117.406897",
 ["46.314000 gAPI, between limestone's mean and shale's mean",
  "65.208511 gAPI, between limestone's 26.879630 and sandstone's 46.314000",
  "117.406897 gAPI, above every other facies on the log"],
 "The facies means for GR read limestone 26.879630, sandstone 46.314000, shale 117.406897 and shaly-sand 65.208511. 46.314000 is sandstone's own mean and 117.406897 shale's.")

q(0, "Three rows of the teaching clustering score below 0 on the silhouette. How do they relate to the write-up's line on where the clustering fails?",
 "All three are core shaly-sand, the facies that line names",
 ["The 9 rows the line says fall with sandstone",
  "Limestone rows, which the line leaves out",
  "They sit in cluster 1, the mixed cluster the line names"],
 "Rows 12, 135 and 169 are shaly-sand in cluster 3, and the write-up's line reads \"shaly-sand: 9 of 47 rows fall with sandstone\". Those 9 rows sit in cluster 1; the three below 0 sit in cluster 3, so they are other rows of the same facies.")

q(2, "The write-up prints the elbow and silhouette figures beside its choice of k 4. Where do those figures point on the cored rows?",
 "The largest drop fraction and the best silhouette both sit at k 3",
 ["Both peak at k 4, confirming the choice the core made",
  "The engine picks k 4 from them and prints them as its reason",
  "To k 4, which bestSilhouetteK names as best"],
 "Step 1 of the workflow returns drop fractions 0.668972, 0.282430, 0.112303 at k 3, 4, 5 and the best silhouette at k 3. The core describes 4 facies and the write-up takes k 4, with that evidence printed beside it. No elbow is picked automatically, and bestSilhouetteK is 3.")

q(3, "Two labellings of the cored rows score an adjusted Rand index of 1.000000 against each other. What follows?",
 "They are the same grouping, whatever their cluster numbers",
 ["Each of them agrees perfectly with the core facies",
  "They share the same cluster number on every row",
  "They were produced by one seed and one start"],
 "An index of 1.000000 marks the same grouping: seed 1 against seed 3 scores 1.000000 while no row keeps its number and the seeds differ. Against the core each still scores 0.872413.")

q(1, "The Ward tree is cut at k 5 (52, 22, 22, 54, 30) and then at k 6 (52, 22, 8, 14, 54, 30). Which cluster splits?",
 "One of the two 22-row clusters, into 8 and 14",
 ["The 52-row cluster, which gives up 8 and 14 of its rows",
  "The 54-row cluster, into 8 and 46",
  "A split of the 30-row cluster into 8 and 22 at the next undoing"],
 "Going from k 5 to k 6 undoes merge 174, at 2.814872, which had joined clusters of 8 and 14 into 22. Every other cluster keeps its size, 52, 22, 54 and 30, because the tree nests and one step down undoes one merge.")

q(2, "Across the elbow table with its silhouette column, which k scores the lowest mean silhouette, and what drop fraction sits beside it?",
 "k 8: silhouette 0.266816, drop fraction 0.068791",
 ["k 7: silhouette 0.492984 and the lowest fraction, 0.056380",
  "k 5, silhouette 0.503776, with a drop fraction of 0.112303",
  "k 4, at 0.545063 and 0.282430"],
 "The elbow with its silhouette reads 0.266816 at k 8, the lowest of k 2 to 8, where the drop fraction is 0.068791. k 7 has the lowest drop fraction, 0.056380, and k 4 and k 5 score higher silhouettes.")

q(0, "Which reading of the teaching clustering's report ties each imperfect figure to one cell of the contingency table?",
 "Sandstone precision 0.847458 and shaly-sand recall 0.808511 both come from the 9 shaly-sand rows of cluster 1",
 ["Sandstone recall 0.847458 and shaly-sand precision 0.808511 both come from the 9 rows of cluster 3",
  "Shale precision 0.894118 comes from the 29 shale rows of cluster 0 alone",
  "Limestone F1 0.917431 comes from the 54 limestone rows of cluster 2"],
 "The 9 shaly-sand rows of cluster 1 are predicted sandstone, lowering sandstone's precision to 0.847458 and shaly-sand's recall to 0.808511. Sandstone's recall and shaly-sand's precision are 1.000000; 0.894118 and 0.917431 are the F1 of shaly-sand and sandstone; limestone and shale score 1.000000.")

emit(Q, '/root/dai-wip-facies/banks/d3i_exam.json', expect_n=42)
finish()
