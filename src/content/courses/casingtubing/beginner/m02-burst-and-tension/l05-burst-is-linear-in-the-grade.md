# Burst is linear in the grade

Two of the four ratings scale exactly with the steel. Keep track of which.

{{panel:ct-rating-explorer}}

## The claim

Burst and pipe body yield are both the yield strength times a number that depends only on geometry. So both of them are exactly proportional to the grade.

    burst = (0.875 x 2 x t / D) x Yp
    body yield = A x Yp

Double the yield strength and both double. There is no approximation in that statement.

## Checked

On the 9-5/8 inch 47 lb/ft row, K-55 gives a burst of 32543253.04 Pa and P-110 gives 65086506.08 Pa. The ratio is exactly 2, because 110 over 55 is exactly 2.

The pipe body yields are 3320507.158569297 N and 6641014.317138594 N. Also exactly 2.

## The two that do not scale

Joint strength scales too, because it is the body yield times a constant.

Collapse does not. On the same row K-55 gives 26792694.634494346 Pa and P-110 gives 36517506.40324334 Pa, a ratio of about 1.36 rather than 2. Doubling the steel bought thirty six percent more collapse resistance.

And on some rows it buys none at all, which is where the next three modules are going.

## Why this matters commercially

Grade costs money. If the string is burst-critical, buying a higher grade converts money into rating at a fixed exchange rate and you can compute exactly what you are getting.

If the string is collapse-critical, the exchange rate is worse and sometimes zero, and the money should have gone into wall thickness instead.

## The design rule that follows

Find out which of the four checks is closest to failing BEFORE choosing what to change. The cheapest fix is different for each of them.

- Burst too low: raise the grade, or thicken the wall.
- Tension too low: raise the grade, thicken the wall, or fit a better connection.
- Collapse too low: thicken the wall, and check whether the grade would help at all.

## Exercise

On the 9-5/8 inch 53.5 lb/ft row, the K-55 burst is 37576425.650000006 Pa and the collapse is 35393754.405729726 Pa.

Predict the P-110 burst without running the panel. Then run it, and also read the P-110 collapse, and state the two ratios.
