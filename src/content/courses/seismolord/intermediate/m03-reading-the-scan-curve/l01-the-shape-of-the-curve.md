# The shape of the curve

Module 2 got you the answer. The scan runs, the best lag comes back as 8 ms, and the correlation there is 1. That is the number the capstone grades, and if all you ever needed was the number you could stop.

This module does something different. It ignores the winner for a while and looks at the whole curve the scan built on its way to finding it. The curve carries information the single best lag throws away, and reading it is what separates an interpreter who accepts a shift from one who understands it.

## The scan produces a curve, not a number

Recall what `suggestBulkShift` does. It walks every lag from minus 40 ms to plus 40 ms in one sample steps. The sample rate here is 2 ms, so that is 41 lags in all. At each lag it slides the synthetic against the observed trace, keeps only the samples that overlap and are live, and computes one normalised correlation over them. It needs at least 8 live overlapping samples before it will score a lag at all.

The function returns the best lag and its correlation. It also returns the full series, one correlation value per lag tested. That series is the curve. The best lag is one point on it.

## The curve around the answer

Here is what the engine reports for the nine lags centred on the answer.

| lag (ms) | correlation |
| --- | --- |
| 0 | 0.621742 |
| 2 | 0.771383 |
| 4 | 0.892968 |
| 6 | 0.972386 |
| **8** | **1.000000** |
| 10 | 0.972386 |
| 12 | 0.892968 |
| 14 | 0.771383 |
| 16 | 0.621742 |

Read down the column before you read anything into it. The correlation climbs steadily from 0.621742 at 0 ms, through 0.771383, 0.892968 and 0.972386, reaching 1.000000 at 8 ms. Then it falls back down through exactly the same four values in exactly the reverse order.

## It is symmetric, and that is not a coincidence

Cover the answer row and look at what is left. The value at 6 ms is the value at 10 ms. The value at 4 ms is the value at 12 ms. The value at 2 ms is the value at 14 ms. The value at 0 ms is the value at 16 ms. Every pair of lags equally far from 8 ms scores identically, to all six digits the engine prints.

The reason is what the observed trace is. In this exercise the observed seismic is the 25 Hz synthetic copied forward by four samples. So when you slide the synthetic against it, you are sliding a trace against a shifted copy of itself. That operation has a name. It is an autocorrelation, and an autocorrelation is an even function of lag: the value at lag $\tau$ equals the value at lag $-\tau$. Measured from the planted lag of 8 ms rather than from zero, that evenness is the symmetry in the table.

Put it in words you can carry. Being 2 ms early and being 2 ms late are the same amount of misalignment, so they cost the same amount of correlation. The curve does not know which side of the answer you are on. It only knows how far off you are.

## What the symmetry is worth to you

Three things follow, and the first two matter more than the arithmetic.

The peak is unambiguous. Because the curve rises to one point and falls away evenly, there is a single highest value and nothing near it competing. You do not have to choose between candidates.

The curve is a shape you can recognise again. A clean rise to a single peak with matching flanks is what a well behaved scan looks like. When you meet a scan whose flanks disagree, or which has two humps of similar height, you now have something to compare it against.

And the symmetry is a property of this exercise rather than a law of well ties. Real observed seismic is not a copied synthetic. It carries noise, a different wavelet, and geology the well never saw, so its scan curve is lumpier and its flanks rarely match. The clean case is here so that you learn the shape before you meet the messy version.

## One more thing to notice

The curve does not fall off a cliff. One sample away from the answer, at 6 ms and at 10 ms, the correlation is still 0.972386, which is a high number by any working standard. Two samples away it is 0.892968, which most people would call a good tie. The peak is real, but its shoulders are broad.

That broadness is the subject of lesson 3, and the fact that the curve is still at 0.621742 all the way out at zero lag is the subject of lesson 2. For now, register that both facts came from the same table, and that neither of them is visible if you only read the winning number.

Open the panel and look at the curve rather than the answer.

{{panel:sl-shift-explorer}}

## Exercise

From the table alone, without using the panel, write down the correlation you expect at a lag of minus 2 ms and at a lag of 18 ms, and say in one sentence what rule let you predict both. Then open the panel, find the scan curve, and describe its shape in one sentence to someone who cannot see it.

As a self-check: a lag of minus 2 ms is 10 ms away from the answer of 8 ms, and a lag of 18 ms is also 10 ms away on the other side, so both should score the same as each other. The rule is that the curve is symmetric about the true lag, because sliding a trace against a shifted copy of itself is an autocorrelation and an autocorrelation depends only on how far the lag is from alignment, not on which side of it you sit. A fair description of the shape is a single smooth peak reaching 1.000000 at 8 ms, with flanks that fall away at the same rate on both sides and are still above 0.97 one sample from the top.
