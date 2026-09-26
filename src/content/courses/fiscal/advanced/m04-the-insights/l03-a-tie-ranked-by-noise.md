# A tie ranked by noise

A verdict that names a winner can be ranking nothing. Two of the three verdicts that could do that refuse. One still does it.

{{panel:ec-comparison-explorer}}

## Where every quantity is the same

`cmp_never_recovers` runs the six templates on a project with capex 20000, on the TEST project's production of 30000 bbl/d of oil declining 12 percent. Nothing pays back and every IRR is null with the status no-root. Read the capex sweep:

| regime | npv | capex sweep first point | capex sweep last point | loss (derived) |
| --- | --- | --- | --- | --- |
| Nigeria - PIA (2021) | -15537.7310 | -11901.367333 | -24628.640060 | 12727.272727 |
| Ghana - Deepwater | -15361.7226 | -11725.358969 | -24452.631697 | 12727.272727 |
| Brazil - Concession | -15354.6816 | -11718.317943 | -24445.590670 | 12727.272727 |
| USA - Gulf of Mexico | -15701.7744 | -12065.410782 | -24792.683509 | 12727.272727 |
| Angola - Deepwater PSC | -15900.1132 | -12263.749547 | -24991.022274 | 12727.272727 |
| Generic Royalty/Tax | -15453.8510 | -11817.487326 | -24544.760053 | 12727.272727 |

Six different NPVs, and one loss figure repeated to every printed digit.

## What the sentence says

The capex verdict declines: no regime can be ranked on resilience to cost overrun, and all six are named as giving up 12,727.3 million USD each, within 0.1 million USD of each other. `leadOrTie` names a leader only when it leads the next regime by at least one printed step, 0.1 million USD for the capex verdict and one percentage point for the price verdict. A strict less-than keeps the first of two equals, and noise in the last binary digits lets the engine name "USA - Gulf of Mexico" and the oracle "Brazil - Concession". Neither is a result.

The price verdict stays out too: every point is null and flagged undefined, so it says no regime is economic from 40 to 120 USD per bbl.

## The tie is exact, which is stronger than close

At both ends of the sweep every regime recovers cost at its own limit, so cost recovered, profit oil and tax do not move. The whole capex difference reaches the contractor's year 1 line and is discounted by one year. Between a multiplier of 0.8 and one of 1.5 that difference is 14000 million USD, and 14000 divided by 1.1 is 12727.272727 for all six. No tie break could be right here: first, last or alphabetical are picks among six answers that are one answer.

## The tie that is still broken by order

`insights_ties` shows where list order still decides. Its payback verdict names both, "Alpha" and "Beta" both pay back in year 4. Its government verdict does not: "Alpha" collects the most, 900.0 million USD against 900.0 million USD for "Beta". The strict comparison still keeps the first of the tied pair there.

## Rounding, a separate trap

`insights_rounding` pins the printing. Values render at one fixed decimal place, and 0.25 is exact in binary so JavaScript rounds the tie up to 0.3. A reader can lose the last digit to the renderer before any ranking happens.

## The reading rule

A verdict naming a winner is only a verdict when the quantities it ranks are separated by more than the precision they are printed to. Real separation looks different: the default project's capex losses run from 88.6123 for Angola - Deepwater PSC to 267.7301 for USA - Gulf of Mexico.

## The mistake

The careful mistake is trusting a verdict because it is specific; the second is reading a refusal as a failure. "No regime can be ranked" is a result, and here it is the only true one.

## Exercise

From the `cmp_never_recovers` capex sweep, state the loss for each of the six regimes and how many distinct values there are. Then name the verdict on `insights_ties` that still keeps the first of a tied pair.
