# The imbalance an engineer chases

`imbalanceSeries` compares the facility meter against what the wells booked in their own ledger rows. It never looks at an allocation, so it is the one number in the module that a split cannot flatter.

{{panel:pd-exception-explorer}}

## Metered against booked, and the denominator is the wells

For each date and each phase it takes the metered volume, subtracts the sum of the wells' own ledger volumes for that date, and expresses the difference as a percentage of what the wells booked. Positive means the facility meter saw more than the wells did. All of these are calendar volumes over one date and none is a producing-day rate.

| Published date | Oil measured, stb | Oil booked, stb | Imbalance, stb | Imbalance, per cent |
| --- | --- | --- | --- | --- |
| 2025-01-25 | 1700.000000000 | 1695.000000000 | 5.000000000 | 0.294985250737 |
| 2025-01-26 | 1696.000000000 | 1795.000000000 | -99.000000000 | -5.515320334262 |
| 2025-01-27 | 1692.000000000 | 1795.000000000 | -103.000000000 | -5.738161559889 |
| 2025-01-28 | 1688.000000000 | 1695.000000000 | -7.000000000 | -0.412979351032 |
| 2025-01-29 | 1684.000000000 | 1795.000000000 | -111.000000000 | -6.183844011142 |
| 2025-01-30 | 1680.000000000 | 1795.000000000 | -115.000000000 | -6.406685236769 |

The phases disagree with each other on the same dates. On 2025-01-25 the oil imbalance is 5.000000000 stb at 0.294985250737 per cent while the water is -188.333333000 stb at -33.137829872808 per cent and the gas is 83.333333000 Mscf at 10.460250999807 per cent.

## A percentage that moves when the meter does not

On the teaching field OGUTA, invented for this course and neither real nor published, OGUTA-17 keeps producing after it stops filing ledger rows, so the meter carries volume the wells never book.

| Date | Oil imbalance, stb | Imbalance, per cent |
| --- | --- | --- |
| 2024-11-15 | 453.524481378 | 21.215061683639 |
| 2024-11-16 | 430.514734056 | 29.799064223643 |
| 2024-11-17 | 423.638308060 | 31.931380703618 |
| 2024-11-18 | 443.885833337 | 20.396841769205 |
| 2024-11-19 | 420.809009274 | 28.484519890072 |
| 2024-11-20 | 437.869938006 | 19.806426169154 |

The unaccounted barrels barely move across those six dates. The percentage runs from 19.806426169154 per cent to 31.931380703618 per cent over the same span, because the denominator is the booked volume and the wells that were booking it collapsed.

## The mistake

Reading a rising imbalance percentage as a worsening meter. It rises just as readily when the wells book less, and on those dates the numerator fell while the percentage rose.

## What it refuses

The percentage is null when the wells booked nothing at all, so a date on which the meter saw volume and no well filed a row has a real imbalance in stb and no percentage beside it. Nothing in the row says which well went quiet.

## Exercise

Write the OGUTA oil imbalance in stb and in per cent for 2024-11-17 and 2024-11-18.

Then say which of the two columns moved more, and which side of the ratio moved it.
