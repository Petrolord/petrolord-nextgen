# PVTO and the saturated branch

PVTO is the most structurally interesting table in a deck, because it is two-dimensional in a file format that is one-dimensional. Reading it takes one idea.

## The idea

Live oil has two independent variables: how much gas is dissolved in it, and what pressure it is at. Those are not the same thing, because oil can sit ABOVE its bubble point, holding all the gas it has and being squeezed by extra pressure without taking up any more.

So the table is organised as a set of RECORDS, one per solution gas ratio. Each record gives the properties at the pressure where that ratio is the SATURATED value, and then optionally continues with more pressures at the same ratio, which are the undersaturated states.

## The Ekene table

Three saturated nodes:

| Rs (Mscf/stb) | p (psia) | Bo (rb/stb) | muo (cp) |
|---|---|---|---|
| 0.2 | 1000 | 1.1086399999999998 | 2.7 |
| 0.3 | 1500 | 1.16296 | 2.25 |
| 0.4 | 2000 | 1.21728 | 1.8 |

Read down the saturated column and the story is the usual one: as pressure rises the oil holds more gas, swells, and thins. At 1000 psia it carries 200 scf/stb, occupies 1.109 reservoir barrels per stock tank barrel and flows at 2.7 cp; by 2000 psia it carries 400, occupies 1.217 and flows at 1.8.

The last of those pressures is the bubble point. Ekene's bubble point is 2000 psia, which is why the highest solution gas ratio sits there.

## The undersaturated branch

The 0.4 record continues:

| p (psia) | Bo (rb/stb) | muo (cp) |
|---|---|---|
| 2600 | 1.2086400000000002 | 1.8216 |
| 3200 | 1.2 | 1.8432000000000002 |
| 3800 | 1.19136 | 1.8648 |

Above the bubble point the oil cannot take more gas, so Rs stays at 0.4 and only pressure changes. Squeezing it makes it SMALLER, so Bo falls, and it makes it slightly more viscous, so muo rises. Both trends are the reverse of the saturated branch, and that reversal is the signature of crossing the bubble point.

Notice the row at 3200 psia: Bo is exactly 1.2. That is Ekene's initial pressure and its initial formation volume factor, the same 1.2 the volumetric booking used. The deck and the booking agree at the initial condition by construction.

## Why the branch is only on the top record

Because Ekene never goes below its bubble point. The reservoir was at 3200 psia initially and the flood held it near 2100 psia, which is above 2000. The saturated nodes below pb exist to make this a valid live-oil table, not because the reservoir will visit them.

A deck for a field that DOES fall below its bubble point needs undersaturated branches on more of the records, because oil at a lower Rs will also find itself above its own saturation pressure at various points in the run.

## The consistency rules

A simulator will refuse a PVTO table that is not physically ordered. Rs must increase down the records, the saturated pressure must increase with Rs, and along an undersaturated branch pressure must increase while Bo decreases. Those are not stylistic; they are what makes the table invertible.

The Ekene table meets them, and it meets one more thing worth checking by eye: the saturated branch and the undersaturated branch agree exactly at the bubble point. Both say 1.21728 at 2000 psia. A table with a step there describes an oil that changes volume discontinuously, which no oil does.

## The misconception to avoid

"Bo always increases with pressure." It increases with pressure BELOW the bubble point, because rising pressure means more dissolved gas. Above the bubble point it decreases, because there is no more gas to dissolve and pressure simply compresses the liquid. The maximum sits exactly at the bubble point, and a table that misses that turning point has a bubble point in the wrong place.

## Exercise

First, using the two branches, state Bo and muo at 2000 psia twice, once from the saturated row and once from where the undersaturated branch begins, and confirm they agree.

Second, explain in two sentences why an oil at 0.2 Mscf/stb sitting at 1800 psia is not described by any row in this table, and what a deck for such a reservoir would need.
