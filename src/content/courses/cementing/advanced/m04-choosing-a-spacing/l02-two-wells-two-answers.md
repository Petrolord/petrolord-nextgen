# Two wells, two answers

The same centralizer programme passes on one well and fails on the other.

{{panel:cm-standoff-explorer}}

## The comparison

| | slant | horizontal |
|---|---|---|
| spacing run | 12 m | 12 m |
| minimum standoff | 0.742357202445576 | 0.599178961025609 |
| against the API 0.67 | pass | FAIL |
| required spacing | 13.05523892558449 m | 11.187558579905271 m |
| verdict | 12 is inside 13.06 | 12 is outside 11.19 |

Same casing. Same hole sizes. Same centralizer, same restoring force, same mud. Same 200 m of cased annulus and 1600 m of open hole.

## The only difference

The trajectory. The slant well reaches 40 degrees and holds it. The horizontal well reaches 90.

Everything else in the calculation is identical, and the sine of the inclination is 0.6427876096865393 against 1.

## Which is a 1.556 times larger lateral load and sag

    1 / sin(40) = 1.5557238268604126

So the horizontal well's pipe carries 1.556 times the perpendicular load per metre, at every spacing, in both terms.

## And the required spacing differs by less than that

    13.05523892558449 / 11.187558579905271 = 1.1669426204421298

Not 1.556. Because the sag goes as the fourth power, the spacing that produces a given sag goes as the fourth root of the inverse load:

    1.5557238268604126 to the power of a quarter = 1.11685

which is close to the 1.167 observed, and the small difference is the centralizer deflection term, which is linear and therefore scales differently.

So a well that is 56 percent harder needs its centralizers only 17 percent closer. The fourth power that made the problem steep also makes the remedy cheap.

## The design point

**A single centralizer programme for a whole field is wrong.** The spacing has to be computed per well, and the number that decides it is the inclination profile.

And it has to be computed per INTERVAL. Both wells report standoff of exactly 1 through their vertical sections, where a centralizer is doing nothing at all, and the tight spacing is only needed below the build.

## What the engine does not do

Return a spacing PROFILE. `requiredSpacing` returns one number for the whole string, computed against the worst interval.

A real programme is staged: wide in the vertical, tighter through the build, tightest in the open hole across the reservoir. That would need the bisection run per interval, and this engine does not do it.

## Exercise

Compute the ratio of the two required spacings and compare it against the fourth root of the ratio of the two sines.

Then say how much of the discrepancy the linear centralizer term can account for.
