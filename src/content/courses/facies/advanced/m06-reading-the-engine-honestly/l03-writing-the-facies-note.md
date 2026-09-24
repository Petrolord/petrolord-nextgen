# Writing the facies note

{{panel:ef-classify-explorer}}

{{panel:ef-judge-explorer}}

Each tier of this course ended with a write-up: a clustering, a comparison with core, a predicted facies written back. A facies study that goes to a team needs all three in one note, in the order the work was done, so that a reader can see what each step rests on. This lesson assembles that note for the Ekene field, every value taken from an engine call the course has shown.

| part | what is written |
| --- | --- |
| rows and logs | 180 cored rows of EKENE-1 to EKENE-6; GR, RHOB, NPHI, PEF; CALI left out of the clustering, and never split on by the tree |
| scaling | standard, population SD (n), fitted on the rows clustered or the training rows; the correlation PCA uses the sample SD (n - 1) |
| grouping | k-means, k 4, k-means++ seeding, seed 3, 10 starts; inertia 58.289042 in standard units; clusters of 29, 59, 54, 38 rows |
| how k was chosen | the core describes 4 facies; drop fractions 0.668972, 0.282430, 0.112303 at k 3, 4, 5, and the best silhouette at k 3, printed beside the choice |
| agreement with core | ARI k-means 0.872413, Ward 0.873388, complete 0.897678, average 0.676404; one-to-one accuracy of k-means 0.950000 on the 180 cored rows |
| where it fails | shaly-sand: 9 of 47 rows fall with sandstone |
| prediction | kNN, k 5, standard scaling fitted on the 180 training rows, written to FACIES_PRED; held-out score on EKENE-6 0.833333 |
| range flags | EKENE-8: 10 of 30 rows above the cored GR maximum 141.200000 gAPI, and the whole well flagged for a gamma ray to be normalised |
| what is not claimed | no cluster named as a facies before matching; no core facies and no accuracy for an uncored well |

## Why this order

The note follows the chain of evidence. The grouping comes first because every later figure uses it. How k was chosen comes next, and it is written as a reading of printed tables: the elbow picks nothing, and the silhouette's best k, 3, disagrees with the core's 4. The agreement with core is what turns clusters into electrofacies, and the failure line says where that agreement breaks. Only then comes the prediction, carrying its own evidence: a held-out score on one cored well and a range check on the new wells.

## What every figure carries with it

Each accuracy names its rows. 0.950000 is one-to-one matching on the 180 cored rows; 0.833333 is kNN on the 30 rows of EKENE-6, held out. Each seeded figure carries its seed and its starts. Each distance and each silhouette names its scaling. The conventions that differ from other tools are named where they bite: the population SD for clustering, the tie rule for a vote, the column order for a tree. And no figure is called equal to another because the two print alike.

## What stays out

The withheld facies of EKENE-7 and EKENE-8 stay out. They scored the predictions in this course only because the field is synthetic, and a real note has nothing like them. Agreement between kNN and the tree on the uncored wells stays out as evidence about rock; if it is written at all, it is written as agreement. Every method is named by what it is: k-means, agglomerative clustering, k nearest neighbours, a CART tree.

## A note someone can re-run

The test of the note is whether a colleague with the same wells and this engine can reproduce every figure in it without asking you a question. That is why the seed and the number of starts sit beside the inertia, why the held-out well is named beside the score, and why the scaling is named beside every distance. If a figure in the note cannot be regenerated from what the note says, a setting is missing from it. For a tree the column order is one of those settings, because it decides a tied root; for a sampled silhouette the sample size and seed are.

## Exercise

Open the judge explorer on "Matching clusters to core facies" and confirm the one-to-one accuracy and the adjusted Rand index of the teaching clusters. Then open the classify explorer on "k nearest neighbours on a held-out well" and confirm the held-out score. Write the note for your own choice of a different held-out well, changing only the prediction lines, and mark every figure with the rows it is measured on.
