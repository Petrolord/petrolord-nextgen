# Risked EMV in one line

Everything the optimizer knows about a project's value comes from one line: risked EMV = pos x npv_p50 - (1 - pos) x fail_cost. Capex, the NPV percentiles and the correlation never enter it.

{{panel:ec-capital-explorer}}

## The line on every OKONO row

| project | pos | npv_p50 | fail_cost | risked EMV |
| --- | --- | --- | --- | --- |
| OK-1 | 0.950000 | 95.0000 | 10.0000 | 89.7500 |
| OK-2 | 0.900000 | 130.0000 | 20.0000 | 115.0000 |
| OK-3 | 0.250000 | 420.0000 | 85.0000 | 41.2500 |
| OK-4 | 0.800000 | 210.0000 | 40.0000 | 160.0000 |
| OK-5 | 1.000000 | 38.0000 | 0.0000 | 38.0000 |
| OK-6 | 0.550000 | 360.0000 | 120.0000 | 144.0000 |

By hand, with the weights written out:

- OK-1: 0.950000 x 95.0000 - (1 - 0.950000) x 10.0000 = 89.7500
- OK-2: 0.900000 x 130.0000 - (1 - 0.900000) x 20.0000 = 115.0000
- OK-3: 0.250000 x 420.0000 - 0.750000 x 85.0000 = 41.2500

Work OK-4, OK-5 and OK-6 the same way and each lands on its engine value. The engine itself prints only the result, to four decimals in million USD.

## A portfolio's EMV is a sum

Risked EMVs add. The set the optimizer funds at 450.0000 is OK-1 + OK-3 + OK-4, and 89.7500 + 41.2500 + 160.0000 = 291.0000. The set at 600.0000 is OK-1 + OK-2 + OK-4 + OK-5, and 89.7500 + 115.0000 + 160.0000 + 38.0000 = 402.7500. The risk summary's `emv` is the same sum: it reads 402.7500 for the 600.0000 set at a correlation of 0.000000 and still 402.7500 at 1.000000. Correlation changes the spread of outcomes and never the mean.

## What the line leaves out

Capex is not in the line. It matters only to the budget, when the optimizer checks which sets fit. `npv_p10` and `npv_p90` are not in the line either; they set the success spread, which feeds only the risk summary. Two projects with the same `pos`, `npv_p50` and `fail_cost` have the same risked EMV however wide their success ranges, and the optimizer cannot tell them apart.

## A mean that never happens

OK-3 never returns 41.2500. In any one outcome it either succeeds, around a success case of 420.0000, or fails and loses 85.0000. The risked EMV is the average over many such bets, and a portfolio of a few risked projects can sit far from its sum of EMVs. The 450.0000 set, with an `emv` of 291.0000, still shows a P(loss) of 0.123600 in the seeded simulation.

## The mistake

The mistake is dropping a weight. Writing pos x npv_p50 alone forgets that a failure costs money. Writing pos x npv_p50 - fail_cost charges the full loss as if failure were certain. Both give a number, both are wrong, and the engine, which only ever runs its own line, never sees the hand calculation that disagrees with it. The check is cheap: a hand line that does not land on 41.2500 for OK-3, from 0.250000, 420.0000 and 85.0000, has dropped or doubled a weight somewhere, and the same line run over all six rows must reproduce every value in the table.

## Exercise

Write the risked EMV of OK-4, OK-5 and OK-6 by hand from their rows. Then sum the risked EMVs of the 600.0000 set and check the total against 402.7500, and explain why OK-3's risked EMV of 41.2500 is not an outcome the well can deliver.
