# Revenue after royalty

Revenue after royalty is not printed as a column. It is the difference of two that are, and it is the base the cost recovery limit is a percent of, which makes it the most important number the ledger does not show you.

{{panel:ec-regime-explorer}}

## The derived column

Subtract royalty from gross revenue and you have it. Under "USA - Gulf of Mexico" on the Designer's default project:

| year | grossRevenue | royalty | revenue after royalty |
| --- | --- | --- | --- |
| 1 | 271.9889 | 50.9979 | 220.9910 |
| 2 | 244.4628 | 45.8368 | 198.6260 |
| 3 | 219.7286 | 41.1991 | 178.5295 |
| 4 | 197.5024 | 37.0317 | 160.4707 |
| 8 | 138.8057 | 26.0261 | 112.7797 |
| 25 | 24.3216 | 4.5603 | 19.7613 |

The same template on ODIDI gives 113.4707 million USD in year 1, 61.9075 million USD in year 5, 76.3635 million USD in year 6 and 5.6128 million USD in year 25. The year 5 to year 6 rise carries straight through from the price step, because the royalty rate did not change.

## Why the base matters

`costRecoveryLimit` is a percent of revenue after royalty. Not of gross revenue, and not of revenue after opex. On the default project in year 1 the limit under "USA - Gulf of Mexico" is 100 percent, so the ceiling on cost recovery is 220.9910 million USD.

The costs available to recover in that year are opex of 31.0027 million USD and capex of 500.0000 million USD, and the ceiling of 220.9910 million USD is smaller than the capex charge on its own. The ceiling binds, `costRecovered` reads 220.9910 million USD, and `unrecoveredCostPool` closes the year at 310.0117 million USD. A 100 percent limit is not the same thing as recovering everything.

## The mistake

The careful reader takes the recovery limit off gross revenue. In year 1 of the default project that would compute the ceiling from 271.9889 million USD rather than 220.9910 million USD, a difference of exactly the royalty. Under a 100 percent limit the error is 50.9979 million USD of extra recovery in the first year alone, and it flows into the unrecovered pool, into the R factor, and into every profit split that keys on the R factor.

The tell is worth memorising. If your cost recovery ceiling ever equals gross revenue, you have used the wrong base, because royalty is always taken first and there is no ordering option anywhere in the model.

A quieter version of the slip is reading a 100 percent limit as "no limit". Year 1 of the default project proves otherwise: a ceiling of 220.9910 million USD against a capex charge of 500.0000 million USD and opex of 31.0027 million USD. The limit binds whenever costs exceed the year's revenue after royalty, and in a project where all the capex lands in year 1, that is guaranteed to happen.

## What the base refuses

It refuses to be reordered. Royalty comes off first, always, and there is no regime field that puts cost recovery before it or that charges royalty on anything narrower. It also refuses to appear in the output, so every reader has to build it from the two printed columns.

## Exercise

Compute revenue after royalty for years 2, 3 and 4 of the default project from the printed columns. Then state the cost recovery ceiling in year 1 under a 100 percent limit and say by how much it falls short of the year's costs.
