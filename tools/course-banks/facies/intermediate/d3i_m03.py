import sys, os; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D3 Professional m03, agglomerative clustering.
# Figures are the course's Ward, complete and average trees of the 180 cored
# rows (GR, RHOB, NPHI, PEF, standard scaling) and the stated refusals. No
# capstone field, well, stated input or graded answer appears.

q(1, "Agglomerative clustering of the 180 cored rows keeps its whole merge history. How many rows does the linkage matrix hold?",
 "179, one per merge, n - 1",
 ["180, one for each row of the data, the first row merging with itself",
  "178, since the final merge into one cluster is left unrecorded",
  "Four, one per cluster of the cut the call was given"],
 "The linkage matrix has one row per merge, n - 1 = 179 rows for 180 rows, and the last of them, merge 178, joins the final two clusters into all 180 rows. The cut at k is read from the history; it does not shorten it.")

q(3, "Why does an agglomerative result carry no seed, when a k-means result is quoted with one?",
 "The call takes no seed at all: its inputs are X, linkage, k, scale and names",
 ["Its seed is fixed at 3 inside the engine, the teaching seed, so it need not be quoted",
  "It runs 10 starts of its own and keeps the lowest height, which settles any seed",
  "The seed is carried in the linkage matrix, in the size column of each merge"],
 "The engine's function table lists agglomerative's inputs as X, linkage, k, scale and names, with no seed and no starts; kmeans lists seed and nInit. Nothing in the merging is drawn at random, and the size column counts the data rows in each new cluster.")

q(0, "Which pair of clusters does Ward linkage merge at each step?",
 "The pair whose union raises the within-cluster sum of squares least",
 ["The pair whose two farthest rows are nearest each other",
  "The pair with the smallest mean distance over cross pairs",
  "Two clusters whose centres are nearest in raw log units"],
 "Ward merges the pair whose union raises the within-cluster sum of squares least, from Euclidean distances on the scaled logs. Judging by the two farthest rows is complete linkage, and by the mean over cross pairs is average linkage (UPGMA). The rows are standardised by default, so the distances are in standard units.")

q(2, "Cut at k 4, which linkage puts more rows into one cluster than any core facies holds?",
 "Average linkage: 96 rows in one cluster, against 54 in the largest facies",
 ["Ward, whose cut holds a cluster of 54 rows, as many as the limestone count",
  "Complete linkage, with a largest cluster of 51 rows and three smaller ones",
  "Every linkage alike, since each cut at k 4 has one cluster above 54 rows"],
 "The cuts at k 4 have sizes 52, 44, 54, 30 for Ward, 51, 46, 54, 29 for complete and 96, 54, 29, 1 for average. Only average linkage exceeds 54, the largest core facies (limestone), and it leaves one row alone. A Ward cluster of 54 rows equals the limestone count and does not exceed it.")

q(1, "At k 4 the Ward cut's next merge sits at 6.612020 and the complete-linkage cut's at 2.970753. What can be said from those two heights?",
 "Nothing across the two: Ward heights are on another scale and are never compared with complete",
 ["Ward's clusters sit about twice as far apart as the complete-linkage clusters do",
  "The complete-linkage cut is the better one, because its heights are smaller throughout",
  "That both trees split the rows alike, since both heights fall between 2 and 7"],
 "A Ward height is the square root of twice the rise in the within-cluster sum of squares, and a complete height is a largest distance. The course states Ward's heights are on a different scale from the other two and are never compared with them. A height is read against the other heights of its own tree.")

q(3, "Merge 175 of the Ward tree is the row [351, 354, 3.659186, 44]. Which id does the cluster it makes receive?",
 "355, since the cluster made at merge s gets id 180 + s",
 ["354, the larger of the two ids it merges",
  "44, the number of data rows the new cluster holds",
  "175, the number of the merge, which becomes the cluster's own id"],
 "The basis reads \"scipy linkage matrix: rows 0 to n - 1, the cluster made at step s is n + s; each row [smaller id, larger id, height, size]\", so merge 175 makes id 355. 354 is the cluster made at merge 174, which this merge absorbs, and 44 is the size column.")

q(0, "Which rows does the first merge of the Ward tree join, and why those?",
 "Rows 24 and 63, both limestone, at 0.069063: the closest pair",
 ["Rows 0 and 1, because merges run in file order",
  "Ids 348 and 357 at 30.809387, because the tree records its largest merge first",
  "Rows 13 and 102 at 0.111522, the pair that sorts first"],
 "Merge 0 joins rows 24 and 63 at height 0.069063, the closest pair of all, making id 180. Rows 13 and 102 are merge 1 at 0.111522; ids 348 and 357 at 30.809387 are the last merge, 178, which joins all 180 rows.")

q(2, "A cut of the 180 cored rows at k 4 keeps how many merges of the tree?",
 "176, the first n - k",
 ["4, one merge for each cluster the cut returns",
  "179, all of them, before relabelling the rows into 4 groups",
  "175, the merges numbered up to the one the cut height sits above"],
 "The basis reads \"k clusters after the first n - k merges; clusters numbered 0 to k - 1 in the order of their first row\", so 180 - 4 = 176 merges are kept: merges 0 to 175. The last kept is merge 175 at 3.659186 and the first undone is merge 176 at 6.612020.")

q(3, "How are the clusters of a cut numbered?",
 "0 to k - 1 in the order of their first row",
 ["Largest first: the biggest cluster is 0 and the smallest k - 1",
  "By the height at which each cluster was last merged, lowest first",
  "Following their ids in the linkage matrix, the lowest id as 0"],
 "The cut's basis numbers clusters 0 to k - 1 in the order of their first row, so cluster 0 is whichever holds row 0. The Ward cut at k 4 reads 52, 44, 54, 30 in cluster order, which is not sorted by size.")

q(1, "The Ward cut at k 4 keeps a last merge at 3.659186 and undoes a next merge at 6.612020. Which cutting heights give the same 4 clusters?",
 "Any height between 3.659186 and 6.612020",
 ["Only 3.659186 itself, the height of the last merge kept",
  "Any height above 6.612020, up to the root at 30.809387",
  "Any height between 2.814872 and 3.659186, below the merge that made the cluster of 44"],
 "The course reads the Ward cut: the last kept has height 3.659186 and the first undone 6.612020, so any cutting height between the two gives the same 4 clusters. Above 6.612020 merge 176 is kept and the count falls to 3; between 2.814872 and 3.659186 merge 175 is undone and the count is 5.")

q(0, "Going from the Ward cut at k 3 (96, 54, 30) to the cut at k 4 (52, 44, 54, 30), what happens?",
 "The cluster of 96 splits into 52 and 44, and the other two are untouched",
 ["The cluster of 54 splits in two and the 96 is shared out",
  "Every cluster is refitted from new centres, so all four differ from the three",
  "The cluster of 30 takes 22 rows from the 96, becoming the 44"],
 "Each step down the tree undoes one merge: at k 4 merge 176, which joined the 52 and the 44 into 96, is undone. A cluster of the k cut is always the union of clusters of the k + 1 cut, which the course checked on every pair of cuts from k 2 to 6.")

q(3, "At seed 3, how does the k-means clustering at k 4 relate to the k-means clustering at k 3?",
 "One of the 4 clusters at k 4 has rows in more than one cluster at k 3",
 ["Each cluster at k 4 lies wholly inside one cluster at k 3, as the tree's do",
  "The k 4 run starts from the k 3 centres and adds one, so the clusters nest",
  "One shared mulberry32 stream makes the k 3 labels fix the k 4 ones"],
 "The course derives from the two label lists that one of the 4 k-means clusters at k 4 has rows in more than one cluster at k 3: k-means has no nesting rule. Each k is its own run from its own mulberry32(seed) stream and its own k-means++ starts.")

q(2, "cutTree is given the returned Ward matrix of the cored rows and k 5. What does it return?",
 "The labels agglomerative gives at k 5, clusters of 52, 22, 22, 54 and 30 rows",
 ["Labels refitted from fresh centres, close to agglomerative's at k 5 without matching them",
  "Clusters of 52, 22, 8, 14, 54 and 30 rows, the cut one merge further down",
  "A refusal, since the matrix came from a call made with k 4"],
 "cutTree gives exactly the labels agglomerative gives with that k, checked at k 2 to 6, and at k 5 the Ward sizes are 52, 22, 22, 54, 30. 52, 22, 8, 14, 54, 30 is the k 6 cut. The matrix holds the whole history whatever k the first call was given.")

q(1, "An agglomerative call asks for single linkage. What comes back?",
 "The refusal \"linkage must be 'ward', 'complete' or 'average'\"",
 ["A single-linkage tree, since the nearest pair of rows defines closeness",
  "Average linkage in its place, with a warning",
  "The Ward tree, since Ward is the default and an unknown name falls back"],
 "The engine builds Ward, complete and average linkage and refuses any other by name, in its own words quoted in the key. It substitutes nothing and warns of nothing.")

q(0, "A hand-built matrix for four rows merges row 0 in both of its first two rows. What does cutTree do?",
 "Refuses, naming linkageMatrix[1]: each id may be merged once only",
 ["Accepts it, since cutTree reads only the heights and the sizes",
  "Refuses, naming linkageMatrix[0], the first row to use id 0",
  "Accepts it and ignores the second merge of id 0 when it cuts"],
 "The engine's words are \"linkageMatrix[1] merges id 0, which linkageMatrix[0] already merged: each row id (0 to 3) and each cluster id (4 to 5) may be merged once only\". It names the second row, where the reuse happens, and it neither ignores the merge nor reads the heights alone.")

emit(Q, '/root/dai-wip-facies/banks/d3i_m03.json', expect_n=15)
finish()
