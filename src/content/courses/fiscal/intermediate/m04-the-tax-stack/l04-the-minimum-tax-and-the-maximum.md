# The minimum tax and the maximum

The third instrument is charged on gross revenue, not the profit share, and it does not add to the other two. It replaces them when it is larger.

{{panel:ec-instrument-explorer}}

## A floor with no base test

The minimum tax is a percent of gross revenue. Nothing about the profit split, the recovery limit or the unrecovered pool enters it, so it is charged in a year with no profit share at all.

The published case that pins it sets a 10 percent minimum with a corporate income tax of 0, a flat 12.5 percent royalty, full recovery and a 100 percent split, so the minimum binds every year.

| year | grossRevenue | profitOil | tax |
| --- | --- | --- | --- |
| 1 | 876.0000 | 0.0000 | 87.6000 |
| 2 | 770.8800 | 238.6760 | 77.0880 |
| 3 | 678.3744 | 499.6589 | 67.8374 |
| 8 | 357.9998 | 235.3499 | 35.8000 |

Year 1 pays 87.6000 million USD of tax on a profit share of 0.0000, and the tax follows revenue down because revenue is all it looks at. Over the life it collects 700.1194 million USD and leaves contractor net cash flow at 2575.8655.

## The maximum, not the sum

The tax charged is the larger of the corporate income tax plus the resource rent tax, and the minimum tax. On the four run decomposition of "Brazil - Concession" over the Designer's default project, corporate income tax alone at 34 percent collects 502.1091 million USD, resource rent tax alone at 40 percent 350.7165, a 5 percent minimum tax alone 134.3464, and the published stack with the minimum at zero 852.8256.

Switching that 5 percent minimum on would change only the years where it is the larger figure. In year 1 the minimum reads 13.5994 million USD and the published stack reads 0.0000; in year 2, 12.2231 against 0.0000. From year 3 the stack reads 25.7707 against a minimum of 10.9864 and the minimum never binds again. A floor is only ever visible where the profits taxes are low.

## The mistake

The mistake is adding the three totals together, or adding a minimum tax to a corporate income tax on the same year's row. That gives a burden the engine never charges, and the error is largest in the early years, when profit oil is 0.0000 and the minimum is the only tax there is.

The reverse mistake is assuming a minimum tax is a small refinement. A 10 percent minimum on gross revenue collects 700.1194 million USD on that published case. The flat regime on the same project, with a 30 percent corporate income tax and no minimum, collects 1006.6134 and leaves 2269.3714 of contractor net cash flow. The instrument that looked like a backstop arrives in years a profits tax cannot reach.

## What it refuses

There is no minimum tax credit: a year in which the minimum exceeds the profits taxes does not bank the difference against a later year. There is no exemption for a loss-making year, because the base is sales, not profit. And it is blind to the royalty already taken off that same revenue and to the capex not yet recovered.

## Exercise

Write the tax for years 1, 2, 3 and 8 of the case where the minimum binds, with the gross revenue and profit oil of each. Then say which years a 5 percent minimum would change on the decomposition, and give the two numbers it would replace.
