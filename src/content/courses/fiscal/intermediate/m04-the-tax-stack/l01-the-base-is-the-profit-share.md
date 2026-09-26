# The base is the profit share

Three tax instruments act on one quantity in this model, and that quantity is the contractor's share of profit oil. Gross revenue, revenue after cost and net cash flow are all other quantities.

{{panel:ec-instrument-explorer}}

## One base

Cost is compensated through cost recovery, so nothing is deducted for cost a second time at the tax line. No fraction of opex is taken off the base.

Watch a regime that gives the contractor 100 percent of profit oil, so the profit share and the profit oil column are one number. "Brazil - Concession" on the Designer's default project does that: royalty flat 10 percent, cost recovery limit 100 percent, a flat 100 percent split, corporate income tax at 34 percent and a resource rent tax at 40 percent.

| year | grossRevenue | profitOil | tax as published |
| --- | --- | --- | --- |
| 1 | 271.9889 | 0.0000 | 0.0000 |
| 2 | 244.4628 | 0.0000 | 0.0000 |
| 3 | 219.7286 | 75.7962 | 25.7707 |
| 4 | 197.5024 | 152.5706 | 51.8740 |
| 5 | 191.1513 | 148.4098 | 50.4593 |

Years 1 and 2 sell 271.9889 and 244.4628 million USD and pay 0.0000 in tax, because a 100 percent recovery limit takes the whole of that early revenue back against the 500.0000 million USD of capex and leaves profit oil at 0.0000.

## The three instruments

Corporate income tax is the rate on the base in any year the base is positive. Resource rent tax is charged on what is left of the base after relief drawn from a one-time uplift pool, and only when that remainder is positive. The minimum tax is a percent of gross revenue, outside the base. The tax charged is the larger of the sum of the first two and the minimum; the three are never summed.

Because none of the three rates enters the base, the stack decomposes exactly: set two of the three to zero and the third comes back on its own. On this regime and project, corporate income tax alone totals 502.1091 million USD over the life, the resource rent tax alone 350.7165, a 5 percent minimum tax alone 134.3464, and the stack as published 852.8256.

## The mistake

A reader who has met a corporate tax return builds the base out of revenue minus opex minus capex, or out of revenue itself. Either would charge tax in year 1, where gross revenue is 271.9889 million USD and the engine charges 0.0000. The fingerprint is a positive tax in a year whose profit oil reads 0.0000, and it means the base was built somewhere other than the split.

## What it refuses

There is no loss carryforward. A year whose base is not positive pays nothing and passes nothing to the next year, so the 25.7707 million USD charged in year 3 carries no relief for the two years before it. There is no depreciation and no capital allowance, so the only route capex takes to the tax line is the size of the resource rent tax pool, and the base is never reduced by the royalty, taken off gross revenue before cost recovery began.

## Exercise

Write the profit oil and the published tax for years 1 to 5. Say which years pay nothing and why, then give the three decomposition totals and name the rule that stops them from being added together.
