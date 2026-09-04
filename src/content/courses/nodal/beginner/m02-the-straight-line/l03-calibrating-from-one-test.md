# Calibrating from one test

One rate and one flowing pressure pin any of these curves. Whether the number that comes out is the well depends on where the test was taken.

{{panel:pd-ipr-explorer}}

## The controlled case

BONNY-7 is the controlled comparison: reservoir pressure 2740 psia, bubble point 1300 psia, tested at 720 stb/d and 2380 psia, ABOVE the bubble point.

The straight line divides 720 stb/d by 360 psi of drawdown and gets 2.00000000 stb/d/psi. So does the composite. The index error is 0.00000000 stb/d/psi, because above the bubble point that division is not an approximation to the correct operation, it is the correct operation.

The families disagree only about extrapolation, reporting open flows of 5480.000000, 4324.444444 and 3233.247201 stb/d for the straight line, the composite and Vogel, while all three read 720.000000 stb/d at 2380 psia. Straight line high, composite in the middle, Vogel low, everywhere below the test, and the ordering never crosses.

## The corrupted case

FORCADOS-3 is the corrupted comparison: reservoir pressure 3720 psia, bubble point 2450 psia, tested at 2400 stb/d and 2180 psia, BELOW the bubble point.

Divide 2400 stb/d by the 1540 psi of test drawdown and the index is 1.55844156 stb/d/psi. The composite backs out 1.57194033 stb/d/psi, an error of minus 0.01349877 stb/d/psi: the index the straight line backs out is LOW.

Of that 1540 psi the first 1270 psi took the pressure down to the bubble point, where the well really did obey its index. Past it the curve had bent, so the well delivered less over the whole drawdown than a true straight line at 1.57194033 stb/d/psi would have, and dividing the smaller rate by the full drawdown returns the smaller index.

## Which way it points, and where it pivots

| Flowing pressure, psia | Straight line, stb/d | Composite, stb/d | Difference, stb/d |
| --- | --- | --- | --- |
| 3720 | 0.000000 | 0.000000 | 0.000000 |
| 2657 | 1656.623377 | 1670.972571 | -14.349195 |
| 2450 | 1979.220779 | 1996.364220 | -17.143440 |
| 2180 | 2400.000000 | 2400.000000 | 0.000000 |
| 2126 | 2484.155844 | 2475.738010 | 8.417834 |
| 1594 | 3313.246753 | 3132.998699 | 180.248054 |
| 1063 | 4140.779221 | 3628.064945 | 512.714276 |
| 531 | 4969.870130 | 3962.801404 | 1007.068725 |
| 0 | 5797.402597 | 4135.949669 | 1661.452928 |

The sign changes at 2180 psia, the TEST pressure. It is not the bubble point: at 2450 psia the difference is minus 17.143440 stb/d, near the largest negative in the column. Calibration forces every family through the test point, so a line with the wrong slope swings about it, reading LOW above the test and HIGH below. Vogel mirrors it: plus 101.347636 stb/d at 2657 psia, zero at 2180 psia, minus 104.021726 at 1594 psia and minus 188.962542 at 0 psia.

## The fix, and the refusal

Told the bubble point, the composite divides by the correct factor instead of the drawdown. Against 3000 psia with a bubble point of 2000 psia, a test of 600 stb/d at 2500 psia returns 1.20000000 stb/d/psi and a test of 1500 stb/d at 1400 psia returns 0.98684211 stb/d/psi, reproducing 600.000000 and 1500.000000 stb/d.

One test cannot choose the family, since every family reproduces it exactly, and it has no curvature to reveal turbulence. The straight line has no bubble point in it, so it cannot know its own answer is corrupt.

## Exercise

Write FORCADOS-3's two indices and say which is larger and why.

Then name the pressure where the two curves agree, say whether it is the test or the bubble point, and explain in one sentence why it must be that one.
