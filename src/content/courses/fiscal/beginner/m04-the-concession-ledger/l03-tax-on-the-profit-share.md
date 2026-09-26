# Tax on the profit share

The tax in this sandbox is charged on the contractor's share of profit oil, so a year with no profit oil pays nothing no matter what it spent.

{{panel:ec-regime-explorer}}

## The base is the share, never the cash

"USA - Gulf of Mexico" carries corporate income tax at 21 percent, resource rent tax at 0 and a minimum tax of 0, so its tax column is one rate on one base. On the Designer's default project it reads 0.0000 in years 1 and 2, 2.3899 in year 3, 28.4107 in year 4 and 1.7170 in year 25.

| year | profitOil | tax | capex |
| --- | --- | --- | --- |
| 1 | 0.0000 | 0.0000 | 500.0000 |
| 2 | 0.0000 | 0.0000 | 0.0000 |
| 3 | 11.3804 | 2.3899 | 0.0000 |
| 4 | 135.2891 | 28.4107 | 0.0000 |
| 25 | 8.1761 | 1.7170 | 0.0000 |

Year 1 pays 0.0000 while spending 500.0000 of capex, and the capex is not the reason. Profit oil is 0.0000: cost recovery had already assigned the whole 220.9910 of revenue after royalty to the contractor, leaving no residual for the rate to act on. The column totals 260.7539 over the life.

## The stack the templates carry

The `tax` instrument holds three rates. Corporate income tax runs from 21 percent under the Gulf of Mexico terms to 35 under Ghana. Resource rent tax is 0 in four templates, 40 under Brazil and 50 under Angola. Minimum tax is 0 in all six, and a published case pins what it does when armed: a 10 percent minimum on gross revenue with corporate income tax at 0 collects 700.1194 on a life revenue of 7001.1938.

## The rate does not rank the tax

Life tax on the default project reads 260.7539 under the Gulf of Mexico terms at 21 percent, 453.4354 under PIA at 30, 230.9340 under Ghana at 35, 422.8854 under Generic at 30 and 852.8256 under Brazil at 34 with its resource rent tax. Ghana carries the highest corporate rate of the six and pays less than Generic, because its tiers hand a smaller share of profit oil to the contractor and the rate has less to act on.

## A default rate inside the instrument

One setting inside the instrument carries a default, and two published cases pin it. On the same project, the same revenue of 7001.1938 and the same profit oil of 3523.7229, the run that leaves the uplift unstated collects 2127.5549 of tax and the run that sets it to zero collects 2207.5549. The uplift sizes a one-time pool, total capex times one plus the uplift, drawn against the profit share and never refilled. A setting nobody typed chose between those two figures.

## The mistake

The instinct from a company income statement is to expect a base of revenue less opex less capex, or less depreciation. That base does not exist here. A reader who builds it gets tax in year 1 where the engine prints 0.0000, and tax in year 4 well under 28.4107 because the year's opex of 25.1816 has been deducted twice, once through cost recovery and once again in the base.

## What it refuses

No depreciation, no loss carryforward, no ring fence, no deferral and no tax on cost oil. Tax is settled in the year it arises, undiscounted like every other line.

## Exercise

Write the tax for years 1, 3, 4 and 25 beside the profit oil for each, and state the rate they imply. Then say why year 1 pays nothing, in a sentence that does not use the word capex.
