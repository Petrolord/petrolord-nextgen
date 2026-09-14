# A low case you can reach

P90 on the risk summary is the low case of portfolio NPV, the 10th percentile of the simulated values. Because it is read from outcomes the simulation produced, it is always a value the portfolio can reach.

{{panel:ec-governance-explorer}}

## The exceedance convention

The engine sorts the simulated portfolio values and takes the 10th percentile as P90: nine outcomes in ten are at or above it. P10 is the 90th percentile, the high case. The labels belong to portfolio NPV and nothing else. A capex, a fail cost and a probability never take one.

## Lumpy portfolios

| case | exact P90 outcome | normal P90 | engine P90 |
| --- | --- | --- | --- |
| singleWildcat | -50.0000 | -150.5560 | -50.0000 |
| identical2 | -100.0000 | -180.7001 | -100.0000 |
| identical3 | -150.0000 | -191.0335 | -150.0000 |
| identical6 | -300.0000 | -173.5074 | -300.0000 |
| identical8 | -50.0000 | -141.4002 | -50.0000 |
| comonotoneIdentical3 | -150.0000 | -451.6680 | -150.0000 |

On every row the engine's P90 is the exact outcome. For one wildcat the low case is the failure, -50.0000. For eight identical wells it is -50.0000 again, one success at 300 and seven failures at 50 each, and it is not the worst case: all eight can fail. The normal P90 for those eight, -141.4002, is an outcome no combination of successes and failures produces.

## A continuous portfolio

When a success carries a spread, the low case is no longer one of a few spikes. mixtureWithSpread pairs a risked project with a sure one. The approximation put its P90 at -12.4175, a loss; the simulation reads 1.7148, a small gain. A reader of the old figure would have said the portfolio's low case loses money, when nine outcomes in ten are gains.

## OKONO's funded sets

| limit | emv | engine P90 | engine P10 | normal P90 |
| --- | --- | --- | --- | --- |
| 300.0000 | 204.7500 | 100.7698 | 295.7106 | 108.3959 |
| 450.0000 | 291.0000 | -18.3574 | 738.1043 | -57.1494 |
| 600.0000 | 402.7500 | 200.3575 | 580.5960 | 218.4079 |
| 750.0000 | 444.0000 | 138.2474 | 879.3797 | 86.8879 |
| 1000.0000 | 588.0000 | 120.7015 | 1099.4568 | 98.0856 |

The approximation was too pessimistic at 450.0000, putting P90 at -57.1494 against -18.3574, and too optimistic at 300.0000 and 600.0000, where its 108.3959 and 218.4079 sit above the simulated 100.7698 and 200.3575. The 450.0000 set is the only one whose low case is a loss, and its P10 of 738.1043 is the widest reach of the three smaller sets because OK-3's success is carried inside it.

## What P90 refuses to say

P90 is not the worst case. The engine reports no minimum, so the worst outcome of a risked set, every project failing, is yours to write by hand. P90 also sits wherever the sample puts it: the 450.0000 set reads -18.3574 at seed 20260829 and -21.8586 at seed 1. The skew of a risked portfolio means P90 and P10 need not sit an equal distance either side of emv.

## The mistake

The mistake is swapping the labels. Under the exceedance convention P90 is the low case, so calling -18.3574 the upside, or putting a P90 on the 450.0000 capex, misreads the report. The second mistake is reading P90 as a floor: identical8's P90 of -50.0000 sits well above what eight failures cost.

## Exercise

For the 450.0000 set, state emv, the engine P90 and P10, and the normal P90. Explain in one sentence what P90 means under the exceedance convention, and use identical8 to show why P90 is not the worst case.
