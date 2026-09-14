# Working the capstone

A graded ledger question hands you a field and a regime and asks for readings. The method is to build one row by hand, prove it against the engine, and only then read down the columns.

{{panel:ec-regime-explorer}}

## Step one: read the four instruments first

Before any arithmetic, write the regime down: the royalty and whether it is flat or keyed on price, the cost recovery limit, the profit split and whether it is flat or tiered, and the three tax rates. "USA - Gulf of Mexico" is flat 18.75 percent, limit 100 percent, flat 100 percent to the contractor, corporate income tax 21 percent with no resource rent tax and no minimum. Everything the ledger does follows from those four.

## Step two: build the first year by hand

Choose year 1, because it holds the capex and the mistakes are loudest there. On the Designer's default project:

| line | how | value |
| --- | --- | --- |
| grossRevenue | volumes times the deck's year 1 prices | 271.9889 |
| royalty | 18.75 percent of gross | 50.9979 |
| revenue after royalty | gross less royalty | 220.9910 |
| costRecovered | capped at 100 percent of that | 220.9910 |
| unrecoveredCostPool | what opex 31.0027 and capex 500.0000 left behind | 310.0117 |
| profitOil | revenue after royalty less cost recovered | 0.0000 |
| tax | 21 percent of the contractor's share | 0.0000 |
| contractorNCF | cost oil plus share, less tax, opex, capex | -310.0117 |
| governmentTake | royalty plus the state's share plus tax | 50.9979 |

If the row does not match the engine, the gap names the error. A contractor line 50.9979 too low means royalty was subtracted twice. A tax above 0.0000 means the base was built from revenue less costs instead of from profit oil. A pool of 500.0000 means the year's recovery was never credited.

## Step three: prove a row after the pool clears

Year 1 hides the cascade, so prove a later one. Year 4 recovers 25.1816, exactly its opex, leaves a residual of 135.2891, pays 28.4107 and closes at 106.8784, while the state takes 65.4424. If year 4 recovers more than its opex, the pool was not cleared in year 3.

## Step four: read down the columns

With two rows proven, read the columns. The cumulative troughs at -310.0117 and crosses between -140.2337 and 8.9905, so payback is year 3, and payout is year 3 as the R factor passes 1.0 at 1.254640. Totals close at revenue 2686.9277, contractor 980.9313 and state 764.5528.

## Step five: four checks

The closing cumulative equals the life contractor total, 980.9313 on both. The contractor line and the state line add to gross revenue less opex less capex on every row, -259.0138 in year 1. Tax is 0.0000 in any year whose profit oil is 0.0000. And a null payback is an answer: the published case at capex 20000 returns null with a life total of -15724.0151.

## Step six: run the method on a field that behaves differently

The default project clears its pool and pays back early, which hides two things a harder field shows. On the teaching field ODIDI the Gulf of Mexico terms return the contractor 148.3166 and the state 277.6679, payback is year 7, and the ledger closes with 24.2824 unrecovered at a limit of 100 percent, because late revenue after royalty of 5.6128 cannot absorb opex of 12.3405. The value at the project's rate is -37.3123 on a life that returned positive cash.

## What the method refuses

It proves two rows and trusts the other twenty three. A tier crossing, a deck step or a pool that refills late is not caught by it, and nothing in it discounts anything.

## Exercise

Build year 1 of the Gulf of Mexico ledger on the default project from the four instruments and confirm -310.0117. Then apply the four checks and say which one year 1 alone can already pass.
