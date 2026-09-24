# Writing up a comparison with core

{{panel:ef-judge-explorer}}

A comparison of electrofacies with core ends in a note that someone else will read, trust and build on. It has to let a reader rerun every figure, see how each choice was made, find where the method fails, and know what was not claimed.

## The write-up for the Ekene cored wells

| item | what is written |
| --- | --- |
| rows and logs | 180 cored rows of EKENE-1, EKENE-2, EKENE-3, EKENE-4, EKENE-5, EKENE-6; GR, RHOB, NPHI, PEF, standard scaling |
| how k was chosen | the core describes 4 facies; the elbow's drop fractions and the silhouette at k 2 to 8 are printed beside the choice |
| methods compared | k-means (seed 3, 10 starts) and Ward, complete and average linkage, each at k 4 |
| agreement with core | ARI k-means 0.872413, Ward 0.873388, complete 0.897678, average 0.676404; one-to-one accuracy of k-means 0.950000 |
| where it fails | shaly-sand: 9 of 47 rows fall with sandstone |
| what is not claimed | no facies for an uncored well; that is the Expert tier's prediction, checked against held-out core |

## Why each item is there

ROWS AND LOGS. The scaling is part of every figure: distances, silhouettes and the clusters themselves change with it. The standard scaling here uses the population standard deviation fitted on these 180 rows. A reader with other rows or other logs has a different comparison.

HOW K WAS CHOSEN. The choice of k 4 came from the core, and the write-up says so plainly. The elbow and silhouette pointed to k 3; printing their figures beside the choice lets a reader see the disagreement and judge the choice.

METHODS COMPARED. k-means carries its seed and its starts, because another seed could stop elsewhere. The agglomerative methods carry their linkage. All four were run at the same k on the same rows, so their figures compare.

AGREEMENT WITH CORE. The index needs no mapping; the accuracy needs one, so the mapping mode is named: one-to-one. The accuracy names its rows, the 180 cored rows the clusters were made from. Both figures are given, because they answer different questions.

WHERE IT FAILS. The failure is stated in rows: 9 of 47 shaly-sand rows fall with sandstone. A reader using these electrofacies on another well knows to check shaly-sand against sandstone first.

WHAT IS NOT CLAIMED. No cluster was named as a facies before matching. No uncored well received a facies. Predicting a facies for a well without core is a separate question, answered with different methods and checked against a cored well held out from training; the write-up does not stretch this comparison to cover it.

## Who reads it, and when

The first reader is usually a colleague deciding whether to use these electrofacies on a new well. The next may be someone months later who finds a FACIES-like channel and wonders where it came from. Both need the same things: the settings to rerun it, the evidence behind k, the agreement with core, and the known failure. A note that carries only a final accuracy serves neither.

## Figures that must travel together

Some figures mislead when quoted alone. A mean silhouette without its cluster sizes hides average linkage's lone row. A majority-matching accuracy without its k and mode rewards splitting facies. A k-means figure without its seed cannot be reproduced. An index without its scaling cannot be compared. The write-up keeps each figure beside what it depends on.

## Exercise

Write your own comparison note for the Ekene cored wells using the six items above, but choose a different setting for one item: complete linkage as the main method, or k 5 with majority matching. Run every figure you quote in the judge explorer. In the what-is-not-claimed line, state at least one thing your figures could be mistaken for and do not show.
