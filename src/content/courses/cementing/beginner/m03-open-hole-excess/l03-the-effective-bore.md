# The effective bore

Back-solved from the inflated capacity, not assumed.

{{panel:cm-volume-explorer}}

## The problem

The excess inflates a capacity. But the placement simulation needs a DIAMETER, because the friction kernel takes a characteristic dimension and the annular one is the bore less the casing outside diameter.

Inflating the capacity and leaving the diameter alone would be inconsistent: the same annulus would have one area for volume and a different one for friction.

## What the engine does

    boreIdEff = sqrt(capacity x 4 / pi + casing OD squared)

Which is the capacity relation solved for the bore. So the effective bore is the diameter a hole would have to be for its annular area to equal the inflated one.

## On this course's wells

| excess | effective bore (m) |
|---|---|
| 0 | 0.2159 |
| 10 | 0.21934631749815178 |
| 15 | 0.22104932820526735 |
| 25 | 0.22441658249781812 |
| 40 | 0.2293747980925542 |
| 50 | 0.2326215703669804 |

At 15 percent the 8-1/2 inch hole reads as 0.22104932820526735 m, which is about 8.7 inches.

## The reversal worth noticing

The cased annulus above the previous shoe has a bore of 0.2204974 m. The washed-out open hole at 15 percent has an effective bore of 0.22104932820526735.

So the open hole annulus is WIDER than the cased annulus it hangs from, once the excess is applied. At the bit size it was narrower.

That reversal is visible in the capacities: 0.013356688045922537 cased against 0.013548091222369345 open. It matters for the annular velocity, which is lowest where the annulus is widest, and the Expert tier's mud removal check reads exactly that.

## Why not just inflate the diameter

Because a ten percent bigger diameter is a twenty one percent bigger area, and the excess is quoted as a volume excess. Inflating the diameter directly would give the wrong volume, which is the number the excess was invented to correct.

Getting that backwards is a real and common error, and the engine documents its convention in the function that applies it.

## Exercise

Compute the effective bore at 30 percent excess from the bit size of 0.2159 m and the casing outside diameter of 0.1778 m.

Then say what percentage the DIAMETER grew by, and compare it with the 30 percent the area grew by.
