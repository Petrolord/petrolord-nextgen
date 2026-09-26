# The reliability table

{{panel:ae-trust-explorer}}

A probability of 0.3 is a claim about many rows at once: of all the rows given about 0.3, about three in ten should turn out relevant. The reliability table tests that claim directly. It sorts the rows into bins by their probability and, in each bin, sets the mean probability beside the share of outcomes that were 1.

## The bins, in the engine's words

> bins: `10 equal-width bins: p is in bin i when i/10 <= p < (i+1)/10 (edges as computed in double precision), the last bin closed at 1; an empty bin has null means and is skipped`

Each bin covers a tenth of the range. The lower edge belongs to the bin and the upper edge to the next one, except at the top, where 1 closes the last bin so that a probability of 1 has somewhere to go. An empty bin is reported with null means and left out of every sum. The edge rule has its own lesson in the next module, because it is a choice with a common alternative.

## The Ekene calibration set, ten bins

| bin | lower | upper | rows | mean probability | observed frequency | gap |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | 0.000000 | 0.100000 | 19 | 0.065263 | 0.052632 | 0.012632 |
| 1 | 0.100000 | 0.200000 | 36 | 0.142222 | 0.027778 | 0.114444 |
| 2 | 0.200000 | 0.300000 | 39 | 0.245897 | 0.128205 | 0.117692 |
| 3 | 0.300000 | 0.400000 | 28 | 0.342500 | 0.178571 | 0.163929 |
| 4 | 0.400000 | 0.500000 | 15 | 0.422667 | 0.133333 | 0.289333 |
| 5 | 0.500000 | 0.600000 | 16 | 0.550625 | 0.187500 | 0.363125 |
| 6 | 0.600000 | 0.700000 | 15 | 0.648000 | 0.000000 | 0.648000 |
| 7 | 0.700000 | 0.800000 | 3 | 0.723333 | 0.000000 | 0.723333 |
| 8 | 0.800000 | 0.900000 | 8 | 0.852500 | 0.250000 | 0.602500 |
| 9 | 0.900000 | 1.000000 (closed) | 21 | 0.974286 | 0.904762 | 0.069524 |

## Reading it row by row

The gap is the distance between the mean probability and the observed frequency. In 10 of the 10 bins the mean probability is above the observed frequency: the classifier is over-confident there. Look at bin 6. Its 15 rows carry a mean probability of 0.648000, and not one of them is relevant. Bin 7 is the extreme: 3 rows at a mean of 0.723333, none relevant. At the top, bin 9 holds 21 rows at 0.974286 with an observed frequency of 0.904762, the closest the upper bins come to keeping their promise.

Read the rows column as carefully as the gaps. Bin 7 holds 3 rows and bin 2 holds 39. A gap measured on three outcomes can swing a long way when one outcome changes; a gap on thirty-nine is steadier. The table prints the counts so that nobody reads the two gaps as equally sure.

## What a perfect table would look like

A calibrated system has each bin's observed frequency close to its mean probability, so every gap is small. That says nothing about whether the system separates relevant rows from the others. A system that put every row in bin 1 at the base rate would have one small gap and one populated bin, and would be no use for ranking. Calibration and separation are different properties, and the decomposition module measures each.

## The refusals on bins

The bin count is a whole number from 1 to 100. No bins, or 101 bins, are refused with the field `bins` named:

> bins must be a whole number from 1 to 100

A single bin is accepted, and puts every row in one bin; the decomposition module shows what that does.

## Exercise

Open the trust explorer on "Calibration: Brier, reliability table, ECE and MCE" with the Ekene set loaded at 10 bins. Confirm the table above, then find the bin with the fewest rows and the bin with the most. Change the bin count to 5 and to 20, and for each count write down how many bins are over-confident and which bin holds the largest gap. Finally type 101 and read the refusal.
