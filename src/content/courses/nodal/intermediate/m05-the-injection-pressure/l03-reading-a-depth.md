# Reading a depth

The column returns two pressures, and the pressure you want is usually at neither of them.

{{panel:pd-vlp-explorer}}

## What comes back

A bottomhole pressure at the full measured depth and a midpoint at half of it. No profile, no station array, no pressure at an arbitrary depth.

| Column | Surface | Midpoint | Bottom |
| --- | --- | --- | --- |
| golden staticVertical | 800 | 877.111721 | 952.982971 |
| golden flowingVertical | 800 | 934.181862 | 1069.628989 |
| golden flowingHighRate | 800 | 1130.753380 | 1437.879989 |
| golden prescribedFriction | 900 | 1117.984986 | 1338.852041 |
| golden flowingDeviated | 1000 | 1199.429976 | 1399.082259 |
| BONNY-7 | 640 | 688.588305 | 735.995265 |
| FORCADOS-3 | 1080 | 1886.588368 | 2608.264008 |

All in psia. The teaching wells are quoted at the counts they run at, sixteen and twenty four.

## The midpoint is a measured depth midpoint

Half the pipe, not half the vertical drop. FORCADOS-3 runs 11200 ft measured against 9750 ft true vertical, so its 1886.588368 psia sits at half of 11200 ft of pipe. The golden flowingDeviated column is 12000 ft against 10400 ft.

The march runs over measured depth, which the defining relation integrates and friction acts along, with stations evenly spaced in it. The count rounds up to an even number for the Simpson closure, which always lands a station there.

## Why you cannot interpolate

FORCADOS-3 reads 1886.588368 psia against ends of 1080 and 2608.264008 psia, far above the straight line: more than half its rise happens in the upper half. The golden high rate case reads 1130.753380 psia against 800 and 1437.879989 psia, again clearly above. The static case and BONNY-7 sit barely above their chords, and the three middle goldens within a psi or two, because at a modest friction group the two bending mechanisms nearly cancel.

Weight acts hardest where the gas is densest, at the shoe, friction where it is thinnest and fastest, at the top. Departure from a straight line scales with the friction group, the same quantity that sets the truncation of a two station march.

## Reading an arbitrary depth

Run the column to that depth, with the same surface pressure, gas gravity, rate, diameter and roughness, the depth of the point in both measures, and the temperature there off the linear profile.

Fix the step count once per well and use it at every depth. Shortening a column does not shrink its friction group, which depends on rate, diameter and roughness, not length. BONNY-7 settles at sixteen for -0.00032641 psi, FORCADOS-3 at twenty four for -0.09629013 psi. Three depths at three counts are not comparable.

## The mistake

Treating the midpoint as half the true vertical depth on a deviated well gives a real pressure at the wrong place, the hardest error to see.

Interpolating linearly costs a fraction of a psi on a static column and a great deal on FORCADOS-3, under-reading the upper half where the shallow unloading valves live.

## Exercise

Record FORCADOS-3's surface, midpoint and bottomhole pressures with both its depths. State the depth the midpoint was taken at, and whether a straight line between the ends would read high or low there.
