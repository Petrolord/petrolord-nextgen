# The low estimate carries the highest probability

{{panel:prms-classification-calculator}}

It surprises most newcomers: the smallest of the three estimates carries the biggest probability number. The reason is the exceedance definition of the last lesson. A small figure is easy to reach, so the chance of meeting or exceeding it is high. A large figure is hard to reach, so its chance is low. In this course the P90 is always the low estimate.

## The pattern in one table

| label | case | probability label | at least this chance of being met or exceeded | Ekene Main value (engine) |
| --- | --- | --- | --- | --- |
| 1P | low | P90 | 90 percent | 8.890000 |
| 2P | best | P50 | 50 percent | 16.650000 |
| 3P | high | P10 | 10 percent | 24.990000 |

Read down the table and the figures rise while the probabilities fall. That is the whole pattern.

## The engine prints it line by line

For the case "Ekene Main Reserves, stated cumulatively" the engine gives each category a reason line naming its case, its probability label and the probability, with the section it applies:

> 1P (low estimate, P90: at least 90% probability of being met or exceeded when probabilistic, PRMS 2.2.1.2): 8.89 MMbbl

> 2P (best estimate, P50: at least 50% probability of being met or exceeded when probabilistic, PRMS 2.2.1.2): 16.65 MMbbl

> 3P (high estimate, P10: at least 10% probability of being met or exceeded when probabilistic, PRMS 2.2.1.2): 24.99 MMbbl

Each reason prints its figure without trailing zeros. The value to reason with is the table figure at six decimals.

## The trap of the ordinary percentile

In everyday statistics the 90th percentile of a set of numbers is a large figure: ninety percent of the set lies below it. A newcomer who reads P90 that way will put it at the top of the range, which is exactly backwards here. The course's convention, set once in lib/conventions/percentile.js, fixes the reading: P90 is the low case, P10 the high case. When you see P90 in a reserves table, think "the low estimate", every time.

## Why the low estimate is the careful one

A lender sizing a loan, a regulator counting a national total and a company reporting to shareholders all want a figure they can rely on. The low estimate, met or exceeded with at least 90 percent probability when estimated probabilistically, is that figure. For Reserves that figure is the 1P, the proved quantity, and it is the one many readers look for first. The best estimate sits in the middle of the range, and the high shows what could happen if things go well.

## When the engine enforces it

The engine will not accept a set in which the low exceeds the best. Its refusal restates the convention in its message, naming the low as the P90, so a box with the figures in the wrong places cannot slip through.

## Exercise

Open the classification calculator, the course's own calculator panel, in the view "The categories of a set of estimates", and start from "Ekene Main Reserves, stated cumulatively". Read the three reason lines and match each to a row of the cumulative table. Then swap the "low estimate (stated)" and "high estimate (stated)" controls, so the larger figure sits in the low place, run it, and find where the refusal names the P90.
