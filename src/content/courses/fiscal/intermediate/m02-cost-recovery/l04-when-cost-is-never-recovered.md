# When cost is never recovered

A limit tight enough, or a capex large enough, and the pool never empties. The horizon closes with money in it, and that money is not paid to anyone.

{{panel:ec-instrument-explorer}}

## The tight limit

`capped_5pct_pool_never_clears` runs the Suite test project with cost recovery capped at 5 percent of revenue after royalty. Over the 25 years it recovers 306.3022 million USD and closes with 2543.7575 still in the pool. Set it beside the same project at a full limit:

| case | total cost recovered | total profit oil | total tax | total government cash flow | total contractor NCF | closing pool |
| --- | --- | --- | --- | --- | --- | --- |
| capped_5pct_pool_never_clears | 306.3022 | 5819.7423 | 1745.9227 | 2621.0719 | 1530.0622 | 2543.7575 |
| capped_40pct | 2450.4178 | 3675.6267 | 1102.6880 | 1977.8372 | 2173.2968 | 399.6419 |
| flat_test_project | 2770.6665 | 3355.3781 | 1006.6134 | 1881.7626 | 2269.3714 | 79.3932 |

`capped_40pct` sits between the two, recovering 2450.4178 and closing with 399.6419 still owed. Read the profit oil column across all three. A tighter limit does not reduce profit oil, it increases it, from 3355.3781 to 5819.7423. Cost that cannot be recovered is left inside the profit oil the split and the tax act on. Total tax rises from 1006.6134 to 1745.9227 and government cash flow from 1881.7626 to 2621.0719, while the contractor drops from 2269.3714 to 1530.0622. The contractor spent the money, was not paid it back, and was taxed as though it had been earnings.

## The large capex

`never_recovers_huge_capex` takes the same project to 20000 of capex. Cost recovered over the life is 6126.0445, profit oil is 0.0000 in every year, tax is 0.0000, and the closing pool is 15724.0151. Contractor net cash flow over the life is negative 15724.0151, NPV at 10 percent is negative 15453.8510, the internal rate of return is null with the status no-root, and there is no payback year and no payout year.

Government cash flow is still 875.1492, all of it royalty, because royalty is charged on gross revenue and has nothing to do with whether cost was recovered. That is the whole lesson of a royalty in one line, seen from the cost recovery side.

## The mistake

The intuition to give up is that an unrecovered pool is a receivable. It is not. Nothing in the engine ever pays it, and nothing carries it past year 25. A reader who mentally adds the closing pool back to the contractor's position will value `capped_5pct_pool_never_clears` too highly by the 2543.7575 it never received, and will do the same to `capped_40pct` by 399.6419 and to `flat_test_project` by 79.3932. The error is largest exactly where the limit is tightest, which is where a comparison is most likely to be run.

The second trap is reading a pool that never clears as a project that never pays. That case pays back in year 3, because the 100 percent split hands the contractor the profit oil the cap leaves. Its internal rate of return is null with the status multiple-roots: the present value is zero at 54.6792 percent and again at negative 14.2614 percent.

## What it refuses

There is no relief valve. The limit does not loosen when the pool is deep, the pool does not expire into a tax loss, and the horizon does not extend to let recovery finish. There is no abandonment cost and no economic limit, so the ledger keeps producing and keeps failing to recover for all 25 rows.

## Exercise

Name the closing pool and the total tax for each of the three cases and say why the tightest limit pays the most tax. Then state what government cash flow is on `never_recovers_huge_capex` and where it came from.
