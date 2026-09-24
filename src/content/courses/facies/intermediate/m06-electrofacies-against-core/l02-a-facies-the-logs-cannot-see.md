# A facies the logs barely separate

{{panel:ef-judge-explorer}}

Every figure in this tier that falls short of perfect points at the same facies. Shaly-sand has the lowest silhouette, the lowest recall and the only split in the contingency table. This lesson reads why, from the mean logs of each facies.

## The mean logs of each core facies

On the 180 cored rows, the mean of each log over each facies's rows:

| facies | rows | GR | RHOB | NPHI | PEF |
| --- | --- | --- | --- | --- | --- |
| limestone | 54 | 26.879630 | 2.642481 | 0.069037 | 4.909259 |
| sandstone | 50 | 46.314000 | 2.317520 | 0.198340 | 1.956800 |
| shale | 29 | 117.406897 | 2.510793 | 0.337069 | 3.213793 |
| shaly-sand | 47 | 65.208511 | 2.397043 | 0.241766 | 2.222553 |

Shaly-sand's mean sits between sandstone's and shale's on every log: GR 65.208511 between 46.314000 and 117.406897, RHOB between 2.317520 and 2.510793, NPHI between 0.198340 and 0.337069, PEF between 1.956800 and 3.213793. On every one of the four logs it is nearer sandstone than shale. It is, in the logs, a sandstone on its way to a shale.

## Three figures, one cause

Its silhouette as a group of core rows is the lowest of the four facies: 0.152252, against 0.842345 for limestone. Many shaly-sand rows sit nearly as close to the sandstone rows as to each other.

Under the k-means mapping (k 4, seed 3, 10 starts, one-to-one) its recall is 0.808511: 9 of its 47 rows fall in the sandstone cluster. That same cluster gives sandstone its precision of 0.847458.

The other facies separate cleanly. Limestone stands apart on density, neutron and photoelectric factor alike; shale stands apart on gamma ray. So on these four logs k-means puts part of shaly-sand with sandstone.

## What more clusters would and would not fix

At k 5 with majority matching, shaly-sand takes two clusters of its own, of 24 and 22 rows (24 and 21 of them shaly-sand), and the accuracy over the 180 cored rows rises to 0.983333. That shows the shaly-sand rows are not scattered at random: they fall in groups the logs can find once more centres are allowed. It does not show that k 5 is right, because majority matching lets any facies split at no cost.

## What a write-up says about it

A clustering is judged by where it fails as much as by its score. For this field the honest sentence is: on GR, RHOB, NPHI and PEF, k-means at k 4 separates limestone, sandstone and shale cleanly and puts 9 of the 47 shaly-sand rows with sandstone. That sentence tells a reader where to trust an electrofacies and where to check against core.

The remedy, if one is needed, lies outside the clustering: another log that responds to shale volume differently, or a finer core description. Neither is something a choice of k or linkage can supply. The overlap of a facies with its neighbours in these logs limits what any method working from those logs can separate.

## Exercise

In the matching view, run the Ekene cored rows with k-means at k 4 and one-to-one matching, and find the shaly-sand rows in the sandstone cluster in the contingency table. Then remove one log at a time from the logs list and rerun, working out the recall of shaly-sand each time by hand from the contingency table and the mapping. Name the log whose removal hurts shaly-sand most, and say what that suggests about which log carries the distinction.
