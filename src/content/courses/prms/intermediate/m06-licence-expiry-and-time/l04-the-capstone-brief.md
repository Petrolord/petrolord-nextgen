# The capstone brief

{{panel:prms-reserves-calculator}}

The Professional capstone asks this tier's question: maturity, commerciality and the economic limit. It gives you a synthetic field of its own, with its own three technical forecasts, prices, costs, royalty, tax, working interest and licence, and asks for six values the engine returns. This lesson says what the capstone asks, where each value sits in the reserves calculator, and how to rehearse on the Ekene Main waterflood first.

## What the capstone gives you

The capstone card carries one case file with one block, `economicLimit`. It holds the three technical forecasts (oil in barrels and gas in Mscf, one row a year from the effective year), the prices, and the opex and capex rows. The card states every other input in words: the effective year, the royalty rate and its form, the tax rate, the allowance life and the loss relief choice, the working interest, the licence expiry and whether a renewal is expected, the reporting basis, the discount rate, the Mscf per BOE and the abandonment cost. The undiscounted net cash flow is after tax and abandonment, as it is on EKN-1.

## The six values

| value | module | where to find it |
| --- | --- | --- |
| the best case's undiscounted net cash flow at the working interest | entitlement and the reporting basis | the first result table, best row |
| the best case's NPV at the working interest | entitlement and the reporting basis | the first result table, best row |
| the 2P oil on the net-entitlement basis | the economic limit | the category table, 2P row, oil column |
| the Probable (P2) increment in BOE | incremental and cumulative categories | the category table, P2 row, BOE column |
| the Possible (P3) increment in BOE | incremental and cumulative categories | the category table, P3 row, BOE column |
| the high case's oil beyond the licence, gross | licence expiry and time | the second result table, high row |

All six are reported to six decimals, as the panel prints them. Each is a return value of the engine on the card's inputs, so there is exactly one right answer, and each is the same number under every reading the engine states. None is a Monte Carlo draw.

## How to load the case

Paste the whole case file into the box of the view "The economic limit and the entitlement". The view finds the `economicLimit` block and runs it. Nothing is copied between views: all six values come from one run.

## Things to check before you copy a figure

Check each control above the box against the card: the royalty rate and, above all, its form, since the form moves every figure on the net-entitlement basis; the reporting basis; the working interest; the licence expiry and the renewal expectation, which set the oil beyond the licence; the discount rate, which sets the NPV and nothing else; and the Mscf per BOE, which sets both increments. Read the reasons: each case's line names its licence cut, its economic limit and its verdict, and the net entitlement line names the working interest and the royalty form. Read the tile "1P set to 0 (the low case fails)" too, because a zero 1P changes what the P2 contains. If the view refuses the case, an input has been changed or mistyped: read the field the refusal names and restore the card's figure.

## Exercise

Rehearse in the course's own reserves calculator, in the view "The economic limit and the entitlement", on figures this tier prints.

1. Start from "EKN-1 Ekene Main waterflood, net entitlement". Read the best case's undiscounted net cash flow at the working interest, 267664086.856250, and its NPV at the working interest, 223054374.878798.
2. In the category table, read the 2P oil, 9908615.920000, the P2 in BOE, 5234466.685000, and the P3 in BOE, 5621506.350833.
3. In the second result table, read the high case's oil beyond the licence, 601257.000000.
4. For each of the six values, write down the control or input on the card you will check first.
