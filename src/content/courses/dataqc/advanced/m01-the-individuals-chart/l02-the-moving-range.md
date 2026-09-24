# The moving range

{{panel:dq-monitor-explorer}}

A production gauge gives one reading a day, so there is no subgroup of readings taken together from which to estimate the day's spread. The individuals chart estimates it from neighbours instead: the moving range MR_i = |x_i - x_(i-1)|, the absolute change from one reading to the next. On the NIST/SEMATECH 6.3.2.2 flow rate example, ten batches give nine moving ranges, and their average, MRbar, is 1.877778 against NIST's printed 1.8778.

| NIST 6.3.2.2 | engine | NIST printed |
| --- | --- | --- |
| movingRanges.1 | 2.000000 | 2 |
| movingRanges.2 | 2.300000 | 2.3 |
| movingRanges.3 | 1.400000 | 1.4 |
| movingRanges.4 | 3.500000 | 3.5 |
| movingRanges.5 | 3.400000 | 3.4 |
| movingRanges.6 | 1.400000 | 1.4 |
| movingRanges.7 | 0.200000 | 0.2 |
| movingRanges.8 | 1.200000 | 1.2 |
| movingRanges.9 | 1.500000 | 1.5 |
| mrBar | 1.877778 | 1.8778 |

## Why a range between neighbours

The first reading has no neighbour before it, so a series of n readings gives n - 1 moving ranges. Each one is a change over a single step, and a single step is short enough that a slow drift in the level contributes little to it. That is the point of the estimate: the spread the chart uses should describe the day to day scatter of a stable process, and a moving range of two measures exactly that scatter.

## From MRbar to sigma

A moving range of two is related to the process standard deviation by a published constant, d2 for a moving range of two, which the engine exports as `D2_N2` 1.128000 and cites to NIST/SEMATECH 6.3.2.2. Sigma is MRbar / 1.128. On EKENE-3's 50 in-control days:

| EKENE-3 phase one | value |
| --- | --- |
| MRbar, psi | 4.257143 |
| sigma = MRbar / 1.128, psi | 3.774063 |
| sample SD of phase one, lib/stats, derived | 3.862060 |

Two estimates of spread from the same fifty days read 3.774063 and 3.862060 psi. The chart uses the first. The sample SD measures scatter around the phase one mean, and any slow wander of the level during those fifty days enters it; the moving range measures scatter between neighbours. Both are honest figures with different sources, and the vocabulary rule of this course is that a sigma always says which one it is. In this module, sigma means MRbar / 1.128 from phase one.

## What the moving range cannot hide

A single wild reading makes two large moving ranges: one on the way up and one on the way back. The day 8 glitch on EKENE-3 does exactly that, and the moving range chart in lesson four signals on day 8 and on day 9 for that reason. A moving range therefore carries information of its own, and the engine returns every one of them in `movingRanges` beside the chart.

## A gap breaks the chain

A moving range needs both neighbours present. A missing reading would leave two ranges undefined, and a range measured across the gap would span two steps. The engine refuses the series and names the entry, so the chain of neighbours is always one step long.

## Exercise

Add the nine NIST moving ranges in the first table and divide by nine; check your answer against the engine's mrBar of 1.877778. Then open the panel's individuals view on EKENE-3 and read MRbar and sigma for phase one. Change one phase one day by a few psi, run it again, and note which of the two figures moved and why both did.
