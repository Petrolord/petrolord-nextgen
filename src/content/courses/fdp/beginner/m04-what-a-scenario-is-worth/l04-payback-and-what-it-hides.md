# Payback, and what it hides

Payback is the moment the cumulative cash position crosses zero, and on the Base case that is 3.8273 years into a life of 20.0000 years.

{{panel:ec-plan-explorer}}

## Where the number comes from

| year | net cash flow | cumulative |
| --- | --- | --- |
| 0 | -2250.0000 | -2250.0000 |
| 1 | 795.8125 | -1454.1875 |
| 2 | 795.8125 | -658.3750 |
| 3 | 795.8125 | 137.4375 |
| 4 | 709.5812 | 847.0187 |

The cumulative stands at -658.3750 after year 2 and at 137.4375 after year 3, so the crossing happens inside year 3, and the engine places it at 3.8273 years by counting how far into the year the remaining hole is closed.

## What it stops counting

The instant the cumulative crosses zero, payback has said everything it has to say. Year 4 earns 709.5812, year 5 earns 631.9731, year 6 earns 562.1258, year 7 earns 499.2632, and the rest of the 21 rows follow them down the decline. None of that reaches the payback figure. Two cases with the same payback can hold completely different amounts of money after the crossing, and payback cannot tell them apart. The NPV can: it is 2015.4123 on this case, and it counts every one of the 21 rows.

## Faster is not richer

The tie-back concept at the same price of 70.0000 USD a barrel pays back in 3.2035 years against the FPSO's 3.8273, so it is the quicker of the two. It is also worth less: 1013.7182 against 2015.4123. A reader ranking by payback alone puts the smaller value first. Price moves the figure as well: the same FPSO concept pays back in 3.0625 years at 92.0000 USD a barrel and 5.7734 years at 48.0000, and at 18.0000 it never pays back at all.

## The mistake

Reading a payback of never as the project life. It is null, and it means the cumulative never crosses zero, which is a different statement from a plan that recovers its money in its last year. The second mistake is calling payback a measure of risk. It is a measure of timing on one price deck and one shape, and nothing in it accounts for how likely that deck is.

## What it refuses

Payback carries no discount rate of its own and no judgement about what comes after the crossing. It is also the one figure on the scenario card computed without the plan's end-of-life cost of 260.0000 million USD, because the payback reader takes no abandonment argument at all. On these cases that changes nothing, since the cost falls in the last year and the money has been recovered long before it. It will not rank concepts, and it will not be reported when there is nothing to report: a case that never recovers its capex returns never, in place of a number that would look like an answer. The 5.7734 years at 48.0000 USD a barrel and the never at 18.0000 are answers of the same kind, one measured and one refused.

## Exercise

Give the payback of the Base case and the two cumulative values it sits between. Then give the payback and the NPV of the tie-back case at the same price and say which concept a payback ranking would choose and which a value ranking would choose.
