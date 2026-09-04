# Choosing a model

Four questions settle it, and one case where getting it wrong changes the calibrated index rather than only the shape.

{{panel:pd-ipr-explorer}}

## The four questions

| Situation | Family | What settles it |
| --- | --- | --- |
| Gas | back pressure or LIT | The fluid |
| Reservoir pressure at or below the bubble point | Vogel | No linear block exists |
| Undersaturated, flow stays above the bubble point | straight line | It is exact there |
| Undersaturated, flow goes below the bubble point | composite | It is the join of the other two |
| Multi-rate evidence of turbulence | Fetkovich or Jones | The curve bends with no phase change |

Gas first, because no oil family applies: at the same reservoir pressure of 4000 psia the back pressure case reads an open flow of 13289.296319 Mscf/d and the Houpeurt case 5596.679697 Mscf/d.

## Above the bubble point the choice is cosmetic

BONNY-7's test at 2380 psia is above its bubble point, and the straight line and composite both back out 2.00000000 stb/d/psi, an index error of 0.00000000 stb/d/psi. The families disagree only about extrapolation, reporting open flows of 5480.000000, 4324.444444 and 3233.247201 stb/d.

## Below it, the choice moves the index

FORCADOS-3's test at 2180 psia is below its bubble point of 2450 psia. Dividing 2400 stb/d by 1540 psi gives 1.55844156 stb/d/psi against the composite's 1.57194033, an error of minus 0.01349877 stb/d/psi: the index comes out LOW, because the well had begun to bend before it was measured.

| Flowing pressure, psia | Straight line minus composite, stb/d | Vogel minus composite, stb/d |
| --- | --- | --- |
| 2657 | -14.349195 | 101.347636 |
| 2450 | -17.143440 | 61.098084 |
| 2180 | 0.000000 | 0.000000 |
| 2126 | 8.417834 | -11.222637 |
| 1594 | 180.248054 | -104.021726 |
| 0 | 1661.452928 | -188.962542 |

Both columns change sign at 2180 psia, the TEST pressure, not at the bubble point of 2450 psia where the straight line is minus 17.143440 stb/d. Calibration forces every family through the test point, so a curve with the wrong slope swings about it: the straight line reads LOW above the test and HIGH below. Anyone carrying the controlled ordering reads minus 14.349195 stb/d at 2657 psia as rounding and has their own error backwards.

## What model choice cannot fix

Every family reproduces one test exactly: 900.000000, 700.000000, 600.000000, 1500.000000 and 1100.000000 stb/d across the five published calibrations. Matching the test is what calibration means, so it is evidence for nothing.

Only a multi-rate test has curvature to choose on. The engine will accept any family for any well, returning an open flow to six decimal places with no warning.

## Exercise

Write the four questions with the family each selects.

Then write FORCADOS-3's two indices and the pressure where the curves agree, and say why that pressure is the test and not the bubble point.
