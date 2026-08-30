# What to calibrate first

Ranking the uncertainties by what they cost.

{{panel:gm-window-explorer}}

## The ranking, from these sweeps

| parameter | slant window range | horizontal window range |
|---|---|---|
| Poisson ratio, 0.20 to 0.35 | 956.2616032453875 kg/m3 | 1153.222084676116 kg/m3 |
| SHmax azimuth, 0 to 150 deg | 366.7313503391106 kg/m3 | 74.7330752964765 kg/m3 |
| tensile strength, 0 to 5 MPa | 205.520996892757 kg/m3 | 496.6885864429339 kg/m3 |
| friction angle, 20 to 40 deg | 0 kg/m3 | 216.4400735919205 kg/m3 |
| Biot coefficient, 0.8 to 1.0 | 125.6421326394352 kg/m3 | 60.853374548395095 kg/m3 |

## First place, by a wide margin

The Poisson ratio. It moves the window two and a half to five times further than anything else on either well.

And it is usually seeded from a lithology table, which makes it the largest uncertainty attached to the weakest evidence.

## Second place, and it depends on the well

The SHmax azimuth on the slant well, at 366.7313503391106 kg/m3. The tensile strength on the horizontal well, at 496.6885864429339.

That difference is not arbitrary. The slant well's tightest point is deviated, so the stress azimuth matters there. The horizontal well's tightest point is nearly vertical, so it does not, and the tensile strength moves the fracture bound on both.

## The one that does nothing

The friction angle on the slant well: exactly zero, for the reason the previous lesson gave. Not small. Zero, at every digit, across the whole 20 kg/m3 sweep.

## What to buy, in order

**A dipole shear sonic.** It gives the Poisson ratio at log resolution over the whole well, and it is the single measurement that would reduce this uncertainty most.

**An image log or a four-arm caliper.** It gives the stress azimuth from breakout orientations, and it also calibrates the collapse gradient by showing where breakouts formed and how wide.

**An extended leak-off test at each shoe.** It measures the minimum horizontal stress directly, which anchors the fracture end and constrains the stress model.

**Core, for a triaxial suite.** It gives UCS and friction angle properly, and it is the most expensive item on the list.

## The order is not the conventional one

The conventional geomechanics wish list starts with core and an extended leak-off test.

On this fixture the shear sonic beats both, because the Poisson ratio dominates and a shear log is cheap by comparison. That is a fixture-specific conclusion, and the general lesson is that the ranking should be COMPUTED for the well in hand rather than assumed.

## What a sensitivity study costs

A few dozen runs of a calculation that takes seconds. It is the cheapest thing in a geomechanics study and it is skipped more often than anything else.

## Exercise

Add a column to the table above giving each range as a percentage of the base window width.

Then say whether the ranking changes when expressed that way, and which form you would put in a report.
