# The loss pool year by year

The ODIOMA expansion enters its first operating year, 2029, holding a loss pool of 117.8320 million. From then on each year's taxable income is set against the pool before any tax is charged. This lesson reads the pool year by year until it is empty.

{{panel:refinery-variance-explorer}}

## The pool

| year | calendar year | taxable income before relief (MM) | tax, loss carried forward (MM) | loss carried forward at year end (MM) |
| --- | --- | --- | --- | --- |
| 0 | 2027 | -58.9160 | 0.0000 | 58.9160 |
| 1 | 2028 | -58.9160 | 0.0000 | 117.8320 |
| 2 | 2029 | 38.5879 | 0.0000 | 79.2440 |
| 3 | 2030 | 38.5879 | 0.0000 | 40.6561 |
| 4 | 2031 | 38.5879 | 0.0000 | 2.0682 |
| 5 | 2032 | 38.5879 | 10.9559 | 0.0000 |
| 6 | 2033 | 38.5879 | 11.5764 | 0.0000 |

From year 6 to year 21 the rows repeat: taxable income 38.5879 million, tax 11.5764 million, and an empty pool.

## Reading the years

In each operating year the taxable income before relief reads 38.5879 million, and there is no capital left to deduct.

In 2029 the pool is large enough to absorb the whole year's taxable income. The tax is 0.0000 and the pool falls to 79.2440 million.

In 2030 the same happens. The tax is 0.0000 and the pool falls to 40.6561 million.

In 2031 the pool again covers the whole year. The tax is 0.0000 and the pool falls to 2.0682 million.

In 2032 the pool at the start of the year, 2.0682 million, is less than the year's taxable income of 38.5879 million. The pool is used up, the part of the income it cannot shelter is taxed, and the tax is 10.9559 million. The pool ends the year at 0.0000. Year 5, calendar 2032, is the first year with tax to pay.

From 2033 there is nothing left to set against income, and each year pays 11.5764 million.

## Printed figures and the pool's arithmetic

Each four-decimal figure is rounded on its own, so subtracting two printed figures can differ from a printed result in the last place. For arithmetic, the course prints the same years to nine decimals, with the rule: the loss carried forward = the loss carried in - taxable income, never below zero. In 2029 the loss carried in is 117.831965348 million, the taxable income 38.587936000 million, and the loss carried forward 79.244029348 million. Rebuild the pool from those nine-decimal columns.

## What the oracle checks

The feasibility oracle keeps annual accounts and a dated tax-loss ledger used oldest first. In the ODIOMA case both losses come from the construction years and are used in the operating years that follow. The order matters in a project with a loss in a later year as well, such as a year of heavy maintenance spending or a price collapse. A ledger used oldest first uses the earliest loss before the latest, which is the order that matters wherever a loss may be carried for a limited number of years only.

## The pool and the cash flow

The pool changes the tax line and nothing else. Gross revenue, opex and capex are the same whether the loss is carried or not. The net cash flow moves only through tax: 38.5879 million in each of 2029, 2030 and 2031, 27.6320 million in 2032, and 27.0116 million from 2033.

The pool is also why the tax line rises in two steps. The first step, in 2032, is a partial year. The second, in 2033, reaches the full annual tax that every later year pays.

## Exercise

Read the loss carried forward at year end from 2028 to 2032. Say in which year the pool is used up, and read the tax in that year and in the year after. Then read the net cash flow in 2031, 2032 and 2033, and say which single line of the cash flow the pool moves.
