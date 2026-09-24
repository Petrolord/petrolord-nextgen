import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D3 Associate m05, Reading Clusters.
# Sources: the course digest's centresOriginal of the teaching clustering, the
# seed 3 against seed 1 cluster pairing, assignClusters on EKENE-7 with its
# distances, the fitted labels of each well's first row, the assignClusters
# refusals, and the covariance PCA against the correlation PCA with k-means
# under three scalings. Every figure is printed there.

q(3, "How does the engine put a k-means centre back into log units as `centresOriginal`?",
 "It reverses the scaling: centre x scale + mean, with the scaler fitted on the rows clustered.",
 ["A scaler is refitted on each cluster's own rows, and the centre is read off that cluster's mean.",
  "It takes the median of each log over the cluster's rows, which a spike cannot pull away.",
  "Each centre is replaced by the one cored row nearest to it, and that row's logs are printed."],
 "The engine derives centresOriginal as centre x scale + mean, reversing the standard scaler fitted on the clustered rows. Each centre in log units is then the mean of its member rows, checked to 1.00e-9. No scaler is refitted, no median is taken, and no single row stands in for a centre."),

q(0, "Under the teaching clustering, cluster 2's GR centre is 26.879630 gAPI. How can a learner check that figure from the rows?",
 "Average the GR of cluster 2's member rows, since a centre in log units is the mean of its rows.",
 ["Take the GR of cluster 2's first row, the starting row its centre grew from on the first pass.",
  "Average the lowest and highest GR in cluster 2, the midpoint of its range, which a centre sits on.",
  "Multiply cluster 2's GR centre in standard units by the sample SD of GR, 32.130517."],
 "Each centre in log units is the mean of its member rows' logs, so averaging the GR of cluster 2's 54 rows gives 26.879630 gAPI. A starting row is only where a centre began. A midpoint is not a mean, and reversing the scaling uses the population SD, 32.041141, and adds the mean."),

q(2, "The teaching clustering's cluster 0 has 29 rows with centre GR 117.406897 gAPI, RHOB 2.510793 g/cm3, NPHI 0.337069 and PEF 3.213793 b/e. Which description may a write-up at this tier give?",
 "Highest gamma ray and neutron porosity of the four centres, with a middling photoelectric factor.",
 ["The shale cluster, as its gamma ray and neutron porosity give the textbook shale response.",
  "Limestone, since cluster 0 takes the facies that sorts first in every list the engine returns.",
  "Cluster 0, the lowest-numbered and so the most important cluster the engine found."],
 "A cluster is described by its centre in log units until it has been matched against core, which is the Professional tier's work. A textbook response suggests a rock and proves none. The number 0 carries no meaning of its own, so it picks no facies from the sorted list, and the lowest gamma ray centre belongs to another cluster."),

q(1, "Among the four centres of the teaching clustering, which cluster has the highest density and photoelectric factor, and which the lowest?",
 "Highest is cluster 2 (2.642481 g/cm3, 4.909259 b/e); lowest is cluster 1 (2.325949, 1.983729).",
 ["Highest is cluster 0 (2.510793 g/cm3, 3.213793 b/e), the cluster with the highest gamma ray.",
  "Cluster 3 is highest on both (2.402789, 2.243684), and cluster 2 is lowest on both.",
  "No cluster leads on both: the highest density and the highest PEF sit in two different clusters."],
 "On density and photoelectric factor the highest centre is cluster 2's, 2.642481 g/cm3 and 4.909259 b/e, and the lowest cluster 1's, 2.325949 g/cm3 and 1.983729 b/e. Cluster 0 leads on gamma ray and neutron porosity. Cluster 3 sits a little above cluster 1 on both."),

q(3, "Order the four clusters of the teaching clustering by their GR centre in log units, lowest first.",
 "2, 1, 3, 0: 26.879630, 46.479661, 69.426316 and 117.406897 gAPI.",
 ["0, 1, 2, 3, since the engine numbers its clusters by rising gamma ray.",
  "1, 2, 3, 0, as cluster 1 holds the most rows and so the lowest GR.",
  "Cluster 2, then 3, 1 and 0, as NPHI and GR rise in the same order."],
 "The centresOriginal table gives GR centres of 117.406897 (cluster 0), 46.479661 (cluster 1), 26.879630 (cluster 2) and 69.426316 gAPI (cluster 3). Clusters 0 and 2 sit at opposite ends of the gamma ray, with 1 and 3 between them. Numbers follow where the starting rows fell, a cluster's size says nothing about its GR, and cluster 3's GR sits above cluster 1's."),

q(0, "With ten starts, seed 1 groups the cored rows exactly as seed 3 does. Seed 3's cluster 1 holds 59 rows. Which seed 1 cluster holds those same rows?",
 "Cluster 0",
 ["Cluster 1, since the same grouping keeps its numbers",
  "Number 3, as the order of the sizes is reversed",
  "No single one: the 59 rows split across two"],
 "Counting each row's cluster under both seeds pairs seed 3's clusters 0, 1, 2, 3 with seed 1's 2, 0, 3, 1. The 59 rows of seed 3's cluster 1 are the 59 rows of seed 1's cluster 0. Every cluster of one run is exactly one cluster of the other, and only the numbers differ."),

q(2, "A report reads: \"cluster 0 has 29 rows under seed 3 and 59 under seed 1, so the clustering is unstable\". What is wrong with it?",
 "It compares two different groups under one number; cluster numbers are names.",
 ["Nothing: a change in size under one number shows that the clustering moved.",
  "It should compare inertias first, and 58.289042 twice proves the groups identical.",
  "Seed 1 should have been run with one start, so the sizes could be compared fairly."],
 "Numbers are assigned by where the starting rows fell, so seed 3's cluster 0 (29 rows) is seed 1's cluster 2, and seed 1's cluster 0 is seed 3's cluster 1 (59 rows). The grouping is the same. Two runs are compared by pairing their clusters row by row or by their centres in log units. A figure printed alike proves nothing by itself."),

q(1, "Seed 1 and seed 3, each with ten starts, both print an inertia of 58.289042. What shows that they found the same partition?",
 "Pairing each row's cluster under both seeds, which matches every cluster of one run to exactly one of the other.",
 ["The equal inertia on its own, since two different partitions can never print the same figure.",
  "The equal number of passes in the two winning starts, which fixes the partition they reached.",
  "Matching the cluster numbers, because the same partition always comes back under the same numbers."],
 "Equal inertias at six decimals are a strong hint and no proof; the row by row pairing is what shows every cluster of one run is exactly one cluster of the other. Passes describe how a start travelled, and the numbers differ between the two runs even though the grouping is the same."),

q(3, "`assignClusters` places the 30 rows of EKENE-7 against the teaching clustering. How are the new rows scaled?",
 "With the scaler fitted on the 180 cored rows; nothing is refitted.",
 ["With a scaler fitted on EKENE-7's own 30 rows, so its logs are measured against itself.",
  "Not at all: new rows are compared with the centres in log units, `centresOriginal`.",
  "On the cored and new rows together, so the scaler sees every well at once."],
 "The basis reads: scaled with the fitted scaler, then the nearest centre. The centre, the scale and the four cluster centres stay as fitted. A scaler fitted on EKENE-7 alone would pull a well reading high everywhere back to a mean of 0, and the centres the rows are compared with are the scaled ones."),

q(2, "Assigned to the nearest centre, how many EKENE-7 rows land in each cluster?",
 "1 in cluster 0, 19 in cluster 1, 10 in cluster 2 and none in cluster 3.",
 ["Close to evenly, 7 or 8 rows in each of the four, as the nearest centre spreads rows out.",
  "All 30 in cluster 2, since an uncored well sits nearest the cluster of its first row.",
  "29 in one cluster and 1 in another."],
 "assignClusters puts 1 EKENE-7 row in cluster 0, 19 in cluster 1 and 10 in cluster 2; no row goes to cluster 3. Its first row goes to cluster 2 at a distance of 0.365418 standard units, and each row is placed on its own logs. The counts depend on the rows' logs alone."),

q(0, "The largest distance of any EKENE-7 row to its assigned centre is 1.164413; over the cored rows the largest distance to their own centre is 1.168721. What does that check say?",
 "No EKENE-7 row sits farther from its centre than the farthest cored row does from its own.",
 ["EKENE-7 is a cored well in disguise, since its distances match the cored ones to two decimals.",
  "Every EKENE-7 row belongs to the facies of its cluster, as each sits within the cored limit.",
  "EKENE-7 lies outside the clustering, because 1.164413 is larger than 1.000000, one unit."],
 "1.164413 is below 1.168721, so on that check the new well looks like the rows the clustering was built on. It says nothing about facies, since the clusters are unmatched to core, and nothing about coring. Distances are in standard units, and 1 is no limit on them."),

q(3, "The 180 cored rows themselves are passed to `assignClusters` with the teaching clustering. What comes back?",
 "Exactly the labels k-means fitted; row 0, the first of EKENE-1, returns cluster 1.",
 ["New labels, since assigning rows moves the centres one more Lloyd pass.",
  "The labels of a fresh ten-start run, drawn again from seed 3.",
  "Cluster 0 for row 0, as assignment renumbers clusters from the first row."],
 "assignClusters refits nothing, so the cored rows go back to the centres they were fitted to and the engine returns exactly the fitted labels: rows 0, 30 and 90 in cluster 1, rows 60 and 120 in cluster 2, row 150 in cluster 3. No pass is run and no start is drawn, and the numbering stays as fitted."),

q(1, "New rows carrying three logs are passed to `assignClusters` with a model fitted on four. What does the engine reply, in its own words?",
 "\"X must have 4 columns, as the model was fitted on\"",
 ["\"model must be the result of kmeans\", since the model and rows disagree",
  "A result on the three shared logs, with the missing log's centre ignored",
  "\"X[0][3] must be a finite number: fill or drop missing values first\""],
 "assignClusters checks the column count against the fitted model and names `X`. The model refusal is for passing something other than a k-means result, such as a PCA. The engine never drops a centre coordinate to fit the rows, and the missing-value refusal names a null entry, which a short row is not."),

q(2, "On the covariance matrix, the first component carries 0.998581 of the variance with a GR weight of 0.999905. Why?",
 "GR's variance in gAPI squared, 1032.370110, dwarfs RHOB's, NPHI's and PEF's.",
 ["GR carries the most facies signal, which the covariance form rewards.",
  "The covariance form scales every log by its sample SD first, and GR's is the largest.",
  "PC1 is fixed to the first log passed, which was GR."],
 "The covariance form centres each log and keeps its unit, so the direction of greatest spread lies almost exactly along GR: its diagonal entry is 1032.370110 against 0.018860, 0.009384 and 1.636367. A covariance PCA of these logs is a gamma ray PCA. Scaling by the SD is the correlation form, and no component is fixed to a column."),

q(0, "Which pairing of choices does the course set side by side as the same choice?",
 "A covariance PCA and k-means on the raw logs, both leaving each log in its own unit.",
 ["A correlation PCA and k-means on the raw logs, both keeping GR's full spread in gAPI.",
  "Covariance PCA with standard-scaled k-means, both dividing by a standard deviation.",
  "Min-max k-means and a correlation PCA, since both map each log into [0, 1] before use."],
 "The correlation PCA standardises each log so every one counts, as standard scaling does before k-means. The covariance PCA keeps each log's unit, and raw k-means clusters in those units; its four centres spread over 93.344030 gAPI of GR. A correlation matrix does not map logs into [0, 1], which is min-max scaling."),

emit(Q, '/root/dai-wip-facies/banks/d3b_m05.json', expect_n=15)
finish()
