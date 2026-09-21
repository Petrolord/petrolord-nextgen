# Year-end present values

{{panel:qr-alarp}}

A measure's cost and its benefit rarely arrive at the same time. The capital is spent before the measure works; the benefit and the running cost come year after year for the rest of its life. To weigh them fairly the engine puts both on one footing, a present value. The present value mechanics belong to the economics courses. This course uses the canonical year-end present value only inside the gross disproportion test and the ICAF, and this lesson sets out the timing convention the engine applies when it does.

## When each flow falls

Every present value in the engine goes through the canonical year-end present value of the economics engine. Capital is spent at year 0. Each annual cost and each year's benefit fall at the END of years 1 to n, where n is the life of the measure. The rates default to zero, which is undiscounted, as in the checklist example.

| flow | when it falls |
| --- | --- |
| capital cost | year 0 |
| annual cost | end of each of years 1 to n |
| benefit | end of each of years 1 to n |

Year-end timing is a declared convention. It means the first year's benefit is counted only once that year has run, and the capital is counted in full at the start. A reviewer who knows the convention can reproduce every present value the engine returns from the stated inputs and rates.

## The firewall undiscounted

With every rate at zero, a present value is a plain sum of the flows. The EDIKAN firewall has capital of 250000 at year 0 and 5000 a year over a life of 20 years, and a fatality benefit of 2000.00 a year.

| present value, undiscounted | EDIKAN firewall |
| --- | --- |
| benefit | 40000.00 |
| cost | 350000.00 |
| cost / benefit | 8.750000 |

The capital dominates the cost. That matters as soon as a discount rate is given, because capital at year 0 is never discounted. A cost rate touches only the running part of the cost, while a benefit rate touches all of the benefit. The next lesson shows what that does to the ratio.

## Whole years only

Year-end flows need a whole number of years. A life that is not a whole number of years is refused:

> lifetimeYears: must be a whole number of years, 1 or more (flows are year-end)

The refusal gives its own reason, "flows are year-end", which is the convention itself. A measure with a life of a year and a half has no year-end for its last half year, so the engine asks the caller to decide how to state it, and the caller records that decision in the note.

## Rates are inputs

The engine takes three rates: one for the benefit, one for the cost, and a growth rate that uprates the benefit each year. Each is typed as a fraction per year, above -1, so 3.5 percent is 0.035. Each defaults to zero. Nothing in the engine chooses a rate for the analyst, and the basis records every rate used, so the present value a note quotes always travels with the convention behind it.

## Exercise

Take the EDIKAN firewall undiscounted. Add the capital of 250000 to twenty year-end payments of 5000 and check the present value of the cost, 350000.00. Then divide it by the present value of the benefit, 40000.00, and check the ratio of 8.750000. Finally, say in one sentence which of the cost's two parts a cost rate would leave unchanged, and why.
