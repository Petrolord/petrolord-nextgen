# Cost recovery at the full limit

Cost recovery is the slice of revenue after royalty that the contractor is allowed to keep against what the project has spent, and even a limit of 100 percent leaves money on the pool.

{{panel:ec-regime-explorer}}

## The pool and the limit

The costs standing for recovery in a year are that year's opex, that year's capex, and whatever earlier years failed to recover. For five of the six templates the limit is a percent of revenue AFTER royalty. "USA - Gulf of Mexico" sets it at 100 percent, so on the Designer's default project year 1 can recover the whole 220.9910 million USD of revenue after royalty, and `costRecovered` reads exactly that. Facing it are opex 31.0027 and capex 500.0000, the capex arriving whole in year 1, so a full limit still cannot clear them. `unrecoveredCostPool` closes the year at 310.0117.

## The pool drains, then it stops mattering

| year | costRecovered | unrecoveredCostPool | opex | capex |
| --- | --- | --- | --- | --- |
| 1 | 220.9910 | 310.0117 | 31.0027 | 500.0000 |
| 2 | 198.6260 | 140.2337 | 28.8480 | 0.0000 |
| 3 | 167.1490 | 0.0000 | 26.9153 | 0.0000 |
| 4 | 25.1816 | 0.0000 | 25.1816 | 0.0000 |
| 5 | 23.6264 | 0.0000 | 23.6264 | 0.0000 |
| 6 | 22.2311 | 0.0000 | 22.2311 | 0.0000 |

Year 2 recovers 198.6260 and carries 140.2337 forward. Year 3 recovers 167.1490 and closes the pool at 0.0000. From year 4 the recovered figure and the opex figure are one number, 25.1816, then 23.6264, then 22.2311: the carried balance is gone and the only cost left to assign is the year's own opex.

## The limit changes when, and only sometimes how much

Over the life of the default project the contractor recovers 941.4436, against life opex of 441.4436 and capex of 500.0000, and every one of the six templates recovers that same 941.4436 here, "Angola - Deepwater PSC" at a 50 percent limit included, because its pool also closes at 0.0000. The tighter limit shows in the waiting: Angola's pool stands at 395.0083 after year 1, then 301.6249, 218.6759, 145.1063, 73.1570 and 9.4844 in year 6. On the Suite test project it bites for good, and Angola strands 251.6537 against 97.2331 under the Gulf of Mexico terms.

## A full limit is not an empty pool

Three templates set the limit at 100 percent, Ghana sets 90, PIA sets 80 and Angola sets 50. On a field that declines hard, late revenue after royalty can fall below the year's opex, and the pool starts filling again. The teaching field ODIDI closes its life with an unrecovered balance under every one of the six templates, 19.3270 at the smallest, 192.1146 under Angola, and 24.2824 under the Gulf of Mexico terms at a full 100 percent.

## The mistake

The common error is to read `costRecovered` as a cost, and subtract it. It is revenue assigned to the contractor, and it is added. The second error is to apply the limit to gross revenue: on year 1 that would cap at 271.9889 rather than 220.9910, and every row downstream inherits the gap.

## What it refuses

The pool carries no interest, takes no uplift, and makes no distinction between a barrel of capex and a barrel of opex. There is no depreciation, no ring fence and no schedule for the spend: capex is charged whole in year 1.

## Exercise

Write the recovered figure and the closing pool for years 1, 2 and 3, then say in one sentence why year 4 recovers 25.1816 and not more. Then say what the 50 percent Angola limit costs the contractor on the default project, and why the answer is different on the test project.
