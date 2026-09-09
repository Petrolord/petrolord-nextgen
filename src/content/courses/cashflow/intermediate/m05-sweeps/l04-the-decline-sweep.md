# The decline sweep

Price and rate change the size of every row. Decline changes the number of rows, because a faster decline reaches the economic limit sooner and the ledger is cut off there.

{{panel:ec-time-explorer}}

## decline_rate_multiyear_pia

A ten-year PIA oil field on the nominal basis with the economic limit on, swept from 5 to 40 percent annual decline.

| decline, percent | rows | limit year | years trimmed | NPV | IRR, percent | take, percent | unit technical cost, USD/boe |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 5 | 10 | 2034 | 0 | 281783674.60 | 35.7256 | 72.8069 | 36.925616 |
| 10 | 10 | 2034 | 0 | 153012318.45 | 26.9948 | 75.6417 | 45.497913 |
| 20 | 6 | 2030 | 4 | -76483227.81 | -4.3446 | 105.7792 | 57.021318 |
| 30 | 4 | 2028 | 6 | -192240981.82 | -42.2725 | 202.4061 | 67.976085 |
| 40 | 3 | 2027 | 7 | -261416751.74 | -76.4611 | 1199.4096 | 78.666122 |

At 5 and 10 percent the field runs its full ten rows. At 20 percent the limit year is 2030, four years are trimmed, and the ledger that is valued has six rows. At 40 percent three rows survive. Total revenue falls from 3485716284.18 to 794617600.00 across the sweep.

## Why the KPIs jump rather than slide

Between 10 and 20 percent the NPV moves from 153012318.45 to -76483227.81 and the payback from 3.67 years to Beyond project life. Part of that is volume. Part of it is the four years removed, which took their revenue with them while the capex in the early rows stayed. Unit technical cost rises from 45.497913 to 57.021318 USD/boe for the same reason: the cost is spread over fewer barrels.

## Take past 100 percent

Take is 105.7792 percent at 20 percent decline, 202.4061 at 30 and 1199.4096 at 40. The pre-take value shrinks toward zero as rows are trimmed while royalties are still charged on what remains, and a share of a value near zero is a large percentage. The 1199.4096 is not a rounding fault; it is a denominator that has almost vanished.

## The other levers

Capex and opex scale change every row's size and leave the row count alone. AKATA with capex at 0.6 of base reports NPV 151769003.37, IRR 120.1646 percent and payback 1.89 years; at 1.5, NPV -27542077.46, IRR 5.7351 percent and payback 5.68 years; at 2, -130907679.39 and Beyond project life. Opex at 0.6 gives 105923762.24 and at 2 gives -17584307.07.

## The mistake

The careful mistake is to read the decline sweep as a volume sensitivity and plot NPV against total barrels. Two runs with different row counts are two different fields, and the one with four years trimmed has lost its late-life tax as well as its late-life production. Compare the rows column before comparing anything else.

## What it refuses

The sweep refuses to keep the trimmed years: with the economic limit on, a year that fails the limit test is removed from the valued ledger, not carried at zero, and the KPIs are of the shortened field.

## Exercise

Read the rows and the limit year at 10 and at 20 percent decline, then say which of the NPV change and the unit technical cost change is caused by trimming rather than by decline itself, and why you cannot separate the two from this table.
