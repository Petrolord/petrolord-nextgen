import sys, os; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D3 Professional m04, matching clusters to core facies.
# Figures are the course's matching of the teaching clustering (k-means, k 4,
# seed 3, 10 starts, standard scaling) and of the k 3 and k 5 k-means runs
# (seed 3, 10 starts) against the core facies of the 180 cored rows, and the
# stated refusals. No capstone field, well, stated input or graded answer
# appears.

q(2, "In the contingency table of the teaching clustering against core, which cluster holds two facies?",
 "Cluster 1: all 50 sandstone rows and 9 shaly-sand rows",
 ["Cluster 3, with 38 shaly-sand rows and 9 sandstone rows",
  "Cluster 0, holding all 29 shale rows and 9 shaly-sand rows beside them",
  "None: each cluster holds one facies"],
 "The table reads cluster 0: 29 shale; cluster 1: 50 sandstone and 9 shaly-sand; cluster 2: 54 limestone; cluster 3: 38 shaly-sand. Only cluster 1 mixes two facies, and shaly-sand is the facies split across two clusters.")

q(0, "One-to-one matching maps the teaching clusters to shale, sandstone, limestone and shaly-sand. How many cored rows land on their own facies, and what accuracy is that?",
 "171 of the 180, an accuracy of 0.950000",
 ["All 180, since every cluster takes a facies of its own, so accuracy 1.000000",
  "The 171 in clusters 0, 2 and 3 alone, as cluster 1 is left out of the score",
  "171 once the 9 shaly-sand rows are dropped, so 0.983333 over the rows kept"],
 "171 of the 180 cored rows land on their own facies, accuracy 0.950000 (171 / 180). The 9 shaly-sand rows of cluster 1, named sandstone, are scored wrong and never dropped. The 50 sandstone rows of cluster 1 are among the 171, and 0.983333 is the majority accuracy at k 5.")

q(3, "How does one-to-one matching choose which facies each cluster takes?",
 "The assignment, a different facies per cluster, that matches the most rows (Hungarian)",
 ["Greedily, each cluster in turn taking its best facies still free, in cluster order",
  "Each cluster takes its most common facies, and two clusters may share one name",
  "The facies whose mean logs sit nearest the cluster's centre in log units takes it"],
 "The basis reads \"one-to-one: each cluster to a different facies, maximising the rows matched (Hungarian); among equal totals the first mapping in cluster order that takes the first facies\". Taking clusters one at a time is greedy matching, and letting clusters share a facies is majority matching.")

q(1, "Facies a, b, a, b are matched one-to-one against clusters 0, 0, 1, 1. Both mappings match 2 rows. Which does the engine return?",
 "Cluster 0 to a and cluster 1 to b",
 ["Cluster 0 to b and cluster 1 to a, the mapping that sorts last",
  "A refusal naming clusters, since two mappings match the same count",
  "Both clusters to a, since a sorts first and one-to-one may repeat it"],
 "Among equal totals the engine takes the first mapping in cluster order that takes the first facies, golden `match-tie-first-mapping`: cluster 0 to a, cluster 1 to b. A tie in the total is resolved by that rule and never refused, and one-to-one never gives two clusters one facies.")

q(0, "The k 5 k-means clustering is passed to matchClusters in one-to-one mode. What comes back?",
 "A refusal naming clusters: 5 clusters, more than the 4 core facies",
 ["A mapping in which the smallest cluster, of 22 rows, is scored as wrong throughout",
  "The majority mapping, switched in by the engine",
  "Five matched clusters, shaly-sand taking two, with an accuracy of 0.983333"],
 "The engine's words are \"clusters has 5 clusters, more than the 4 core facies: one-to-one matching would leave clusters unmatched; use mode 'majority' or fewer clusters\". It never switches mode for the caller; 0.983333 is the accuracy when the caller asks for majority.")

q(2, "Under majority matching of the k 5 clustering, which facies takes two clusters, and what is the accuracy?",
 "Shaly-sand, clusters 3 and 4; accuracy 0.983333",
 ["Sandstone, clusters 2 and 4; accuracy 0.950000",
  "None of them, since majority matching keeps one facies to a cluster",
  "Limestone, clusters 1 and 2; accuracy 0.984510"],
 "At k 5 the majority facies are shale, limestone, sandstone, shaly-sand and shaly-sand for clusters 0 to 4, so shaly-sand takes clusters 3 and 4, and the accuracy is 0.983333 with a macro F1 of 0.984510. 0.950000 is the one-to-one accuracy at k 4.")

q(1, "Majority matching at k 5 scores 0.983333 against one-to-one at k 4, 0.950000. What does the higher figure show about k 5?",
 "Nothing in its favour: splitting a facies into two clusters costs majority matching nothing",
 ["That k 5 is the better choice, since more cored rows land on their own facies there than at k 4",
  "Shaly-sand is truly two facies, which the core description would have to confirm",
  "One-to-one matching is biased at k 4, and majority should replace it everywhere"],
 "The course states that splitting a facies into two clusters costs majority matching nothing, so a higher majority score at a larger k is no evidence for that k. Scores compare only at the same k and in the same mode.")

q(3, "The k 3 k-means clustering is matched one-to-one. Which facies gets no cluster, and what happens to it?",
 "Shaly-sand: recall 0.000000, and accuracy falls to 0.738889",
 ["Shale, the smallest facies at 29 rows, with a recall of 0.000000 and accuracy 0.738889",
  "No facies: fewer clusters than facies are refused",
  "Sandstone, which the three clusters split between them, scoring 0.808511"],
 "At k 3 one-to-one matching leaves shaly-sand with no cluster: its recall is 0.000000 and the accuracy is 0.738889. Fewer clusters than facies are accepted; only more clusters than facies are refused. 0.808511 is shaly-sand's recall at k 4.")

q(2, "Under the one-to-one mapping at k 4, why is sandstone's precision below 1 while its recall is 1.000000?",
 "The 9 shaly-sand rows of cluster 1 are predicted sandstone, and every core sandstone row is in cluster 1",
 ["Some core sandstone rows fall in cluster 3, which is named shaly-sand, so those rows are missed",
  "Precision divides by all 180 cored rows, while sandstone holds only 50 of those cored rows",
  "The rows of the limestone cluster that read like sandstone lower its precision to 0.847458"],
 "Sandstone's precision is 0.847458: of the 59 rows predicted sandstone, 9 are core shaly-sand. Its recall is 1.000000 because all 50 core sandstone rows sit in cluster 1. Cluster 3 holds no sandstone and cluster 2 no sandstone; precision divides by the rows predicted, which are 59.")

q(0, "Under the same mapping, what are shaly-sand's precision and recall?",
 "Precision 1.000000 and recall 0.808511",
 ["Precision 0.808511 and recall 1.000000, the other way round",
  "Both 0.894118, since F1 sits between precision and recall and equals both here",
  "Precision 0.847458 and recall 0.808511, both lowered by the same 9 rows"],
 "Cluster 3, the only cluster named shaly-sand, holds nothing else, so precision is 1.000000; 9 of its 47 core rows fall in cluster 1, so recall is 0.808511. 0.894118 is its F1 and 0.847458 is sandstone's precision.")

q(1, "What is the macro F1 of the one-to-one mapping of the teaching clustering?",
 "0.952887",
 ["0.950000, the accuracy",
  "0.894118, shaly-sand's F1",
  "0.917431, the F1 of sandstone"],
 "The classification report gives F1 1.000000, 0.917431, 1.000000 and 0.894118 for the four facies, macro F1 0.952887 and accuracy 0.950000. The macro figure is a separate field from the accuracy and from any one facies's F1.")

q(3, "A matchClusters call passes mode 'best'. What does the engine say?",
 "mode must be 'one-to-one' or 'majority'",
 ["Nothing; it runs one-to-one, the mode it takes by default",
  "clusters must be an array of 180 labels, one per row",
  "It runs majority with a warning"],
 "The engine offers exactly two modes and refuses any other by name, in its own words quoted in the key. The one-per-row message is the refusal of a clusters list of the wrong length, and no mode is substituted.")

q(2, "A matchClusters call sets zeroDivision to one half. What happens?",
 "A refusal by name: \"zeroDivision must be 0 or 1\"",
 ["Accepted, and the half is then used wherever a ratio in the report would divide zero by zero",
  "Rounded to 1 with a warning",
  "Accepted in majority mode only, and refused under one-to-one"],
 "The machine learning engine's scorer takes 0 or 1 for a ratio that divides zero by zero, and the engine refuses a half in the words quoted. At k 3 shaly-sand is never predicted, so its precision is exactly the case the setting decides.")

q(0, "Under majority matching, a cluster holds equal counts of sandstone and shale. Which facies does it take?",
 "Sandstone, the facies that sorts first",
 ["Shale, since shale sorts ahead of sandstone by character",
  "Neither: the call is refused",
  "Shale, the rarer facies at 29 rows"],
 "The majority basis reads \"a tie goes to the facies that sorts first\". Names sort by character, so the order is limestone, sandstone, shale, shaly-sand, and sandstone comes first. A tie is settled by that rule and never refused, and rarity plays no part.")

q(1, "Cluster 1 of the k 5 run is its limestone cluster, while in the teaching clustering at k 4 limestone is cluster 2. Why?",
 "They are different runs, and a cluster number is only a name set by where the starting rows fell",
 ["The k 5 run numbers its clusters by facies name, and limestone is the facies that sorts first",
  "Adding a fifth centre renumbers the clusters, shifting each number along by one place",
  "Cluster numbers are sorted by size, and limestone is the second largest cluster of the k 5 run"],
 "The course reads cluster numbers as names: numbers are assigned by where the starting rows fell, and cluster 0 carries no meaning of its own. At k 5 cluster 0 is still the shale-only cluster, so nothing shifted by one; and the k 5 sizes, 29, 54, 51, 24, 22, are not in size order.")

emit(Q, '/root/dai-wip-facies/banks/d3i_m04.json', expect_n=15)
finish()
