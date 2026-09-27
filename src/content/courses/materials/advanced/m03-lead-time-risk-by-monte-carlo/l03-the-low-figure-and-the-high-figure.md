# The low figure and the high figure

{{panel:materials-spares-calculator}}

The spares calculator prints six figures for each sampled quantity: the mean, P90, P50, P10, the minimum and the maximum. For a lead time or a lead-time demand, the P90 is the low figure. This lesson reads the table on the mechanical seal and the sentence the engine returns with every call.

## The seal's sampled figures

Seed 20270301, 20000 draws. Every figure below is an estimate on that seed and count, and none is graded:

| figure | lead time, days | lead-time demand, seals |
| --- | --- | --- |
| mean | 106.453303 | 1.986608 |
| P90 (the low figure) | 83.198487 | 1.306495 |
| P50 | 103.503359 | 1.907671 |
| P10 (the high figure) | 134.894691 | 2.780743 |
| minimum | 70.267174 | 0.789556 |
| maximum | 159.412975 | 4.409134 |

## How the percentiles are read

The engine sorts the draws and reads each percentile at a stated index. Its basis, verbatim:

> lib/stats basicStats on the sorted values: P90 = index floor(0.1 n), P50 = floor(0.5 n), P10 = floor(0.9 n). P-labels per lib/conventions/percentile.js: P90 means a 90% probability the actual quantity meets or exceeds the value, so for a lead time or a demand P90 is the LOW figure (10th percentile) and the stockout risk sits at the P10 end

## The sentence the engine returns

Every lead-time risk call returns one sentence from lib/conventions/percentile.js, verbatim:

> P90 means a 90% probability the actual quantity meets or exceeds this value, per SPE PRMS.

It is the platform's one convention for P-labels, written for hydrocarbon outcomes. It names SPE-PRMS 2018 as the source of that convention, and the reserves and resources course teaches that framework; this course uses nothing from it but the label. For a lead time or a lead-time demand the same words hold. The P90 is the figure the sampled value meets or exceeds in 90 percent of draws: 83.198487 days for the seal's lead time, the low figure.

## Where the risk sits

More lead time, or more demand over it, is worse for stock. The draws that run out are at the top of the lead-time demand, so the stockout risk sits at the P10 end, 2.780743 seals, and beyond it toward the maximum of 4.409134. The seal's stated reorder point of 3 lies above its P10 and below its maximum: the few draws that exceed it are the stockouts the next module counts.

## A label, read the platform's way

In conversation, the ninetieth percentile of anything is a high figure. In this course, the P90 of a sampled lead time or demand is the low figure, met or exceeded in 90 percent of draws. The vocabulary is binding, and the panel prints the label beside the figure for that reason.

## Exercise

Open the spares calculator on the view "Lead-time risk by Monte Carlo (ungraded)" and start from "The mechanical seal on the Ekene register". Reproduce the table above, quoting each figure with its seed and draws. Check that the minimum, P90, P50, P10 and maximum rise in that order in both columns. Find the sentence from lib/conventions/percentile.js among the lines the engine prints and compare it with the quotation above. Then write one sentence placing the reorder point 3 against the lead-time demand figures.
