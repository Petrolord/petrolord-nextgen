# The SHmax azimuth

The input nobody measures, and what rotating it does.

{{panel:gm-window-explorer}}

## The parameter

Which compass direction the larger horizontal stress points along. The published runs use 60 degrees.

It comes from breakout orientations on image logs, from drilling-induced tensile fractures, from regional stress maps, or from a guess.

## What rotating it does to the slant well

| SHmax azimuth | tightest MD | window width |
|---|---|---|
| 0 deg | 3000 m | 1166.8825302055545 kg/m3 |
| 30 deg | 3000 m | 1041.4600436889589 kg/m3 |
| 60 deg | 3000 m | 1041.4600436889584 kg/m3 |
| 90 deg | 3000 m | 1166.8825302055545 kg/m3 |
| 120 deg | 3000 m | 1408.191394028069 kg/m3 |
| 150 deg | 3000 m | 1408.191394028069 kg/m3 |

From 1041.4600436889589 to 1408.191394028069 kg/m3: the window varies by 35 percent of its smallest value, from a parameter that was never measured.

## Reading the pattern

The values repeat in pairs, because the well's azimuth is fixed and rotating the stress field by 30 degrees in some ranges does not change the ANGLE BETWEEN the hole and the stress direction enough to matter at the coarse spacing used here.

The worst case is when the hole runs closest to the SHmax direction and the best is when it runs closest to Shmin, which is the Professional tier's result showing up along a whole trajectory.

## What rotating it does to the horizontal well

Almost nothing, except in one place.

| SHmax azimuth | tightest MD | window width |
|---|---|---|
| 0 deg | 1020 m | 1367.0827206900121 kg/m3 |
| 60 deg | 1020 m | 1364.1863204876872 kg/m3 |
| 90 deg | 1350 m | 1292.3496453935356 kg/m3 |
| 120 deg | 1020 m | 1364.1863204876872 kg/m3 |

Five of the six azimuths give a window within 3 kg/m3 of each other at 1020 m. At 90 degrees the tightest point JUMPS to 1350 m and the window drops by 74.7330752964765 kg/m3 from its widest.

## Why the jump

Because at 1020 m the hole is barely off vertical, and a nearly vertical hole does not care about the azimuth. So the tightest point stays put and the value barely moves.

At 90 degrees of stress azimuth, the hole's own azimuth in the build happens to line up badly, and a deeper station where the hole IS deviated becomes tighter than the kick-off point.

## The lesson

The sensitivity to the stress azimuth depends on how deviated the well is where its window is tightest.

A well whose tightest point is nearly vertical is insensitive to the azimuth. A well whose tightest point is deviated is very sensitive to it, and on those wells the azimuth is worth measuring.

## What to do about it

If the tightest point is deviated and the azimuth is a guess, run the sweep and quote the range rather than a value.

A window of "between 1041 and 1408 kg/m3 depending on the stress azimuth" is a more honest deliverable than either endpoint, and it tells the reader what to buy.

## Exercise

Explain why the slant well's window is the same at 30 and 60 degrees of stress azimuth but different at 90.

Then say what well data would pin the azimuth down, and whether this well would have it.
