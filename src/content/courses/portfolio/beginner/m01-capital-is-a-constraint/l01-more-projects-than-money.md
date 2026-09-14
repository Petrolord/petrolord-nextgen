# More projects than money

A company nearly always holds more projects it could fund than capital to fund them. Choosing a portfolio starts from that limit and asks which whole projects fit under it for the most risked value.

## Six projects and one purse

OKONO's capital inventory holds six candidates, every amount in million USD:

| project | name | capex | risked EMV |
| --- | --- | --- | --- |
| OK-1 | Infill drilling | 120.0000 | 89.7500 |
| OK-2 | Gas compression | 180.0000 | 115.0000 |
| OK-3 | Exploration well | 90.0000 | 41.2500 |
| OK-4 | Waterflood | 240.0000 | 160.0000 |
| OK-5 | Workovers | 60.0000 | 38.0000 |
| OK-6 | Satellite tie-back | 310.0000 | 144.0000 |

Funding all six costs 1000.0000 and returns a summed risked EMV of 588.0000. Every smaller budget forces something out, and the question becomes which projects to leave behind.

## The limit decides the set

The Capital Portfolio engine answers that question separately at each limit:

| capex limit | funded set | total capex | total risked EMV |
| --- | --- | --- | --- |
| 300.0000 | OK-1 + OK-2 | 300.0000 | 204.7500 |
| 450.0000 | OK-1 + OK-3 + OK-4 | 450.0000 | 291.0000 |
| 600.0000 | OK-1 + OK-2 + OK-4 + OK-5 | 600.0000 | 402.7500 |
| 750.0000 | OK-1 + OK-2 + OK-3 + OK-4 + OK-5 | 690.0000 | 444.0000 |
| 1000.0000 | OK-1 + OK-2 + OK-3 + OK-4 + OK-5 + OK-6 | 1000.0000 | 588.0000 |

Read down the funded sets rather than the totals. OK-2 is in at 300.0000, out at 450.0000 and back in at 600.0000. OK-3 comes in at 450.0000, leaves at 600.0000 and returns at 750.0000. A project has no fixed place in the queue. Its place depends on what else the same money could buy.

A limit can also buy nothing. The published case `limitBelowEveryProject` sets a limit of 30.0000 under the cheapest project and the engine funds no set at all, capex 0.0000 and EMV 0.0000.

## What value means here

The engine scores each project by its risked EMV, the chance of success times the success-case NPV less the chance of failure times the cost of failing. That is why OK-3, whose success-case NPV is 420.0000, carries a risked EMV of only 41.2500: it succeeds with probability 0.250000 and loses 85.0000 when it fails. The funded set at a limit is the combination of whole projects whose risked EMVs add to the largest total without the capex passing the limit.

## The mistake

The natural mistake is to treat a budget as a cut-off on a ranked list: sort the projects, fund down the list and stop when the money runs out. Sorting OKONO by risked EMV per million USD of capex and filling a 450.0000 limit that way funds OK-1 + OK-4 + OK-5 for 287.7500. The engine's set, OK-1 + OK-3 + OK-4, returns 291.0000 for the same limit. The list looked sensible and still lost value, because a budget is filled by a combination and a list only ranks projects one at a time.

The engine does not tell you which projects came close, what the runner-up set was worth, or why a project dropped out. It returns the set, its capex and its risked EMV.

## Exercise

State OKONO's funded set, total capex and total risked EMV at limits of 300.0000 and 600.0000. Then name the project that is funded at 450.0000 and dropped at 600.0000, and explain in two sentences why a budget cannot be filled by working down a ranked list.
