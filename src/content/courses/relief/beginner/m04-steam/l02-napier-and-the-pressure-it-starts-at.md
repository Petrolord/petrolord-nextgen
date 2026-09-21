# Napier, and the pressure it starts at

{{panel:fc-sizing-explorer}}

The Napier correction is the most interesting object in this tier, because it does something no smooth curve does. It steps, it goes the wrong way for a while, and then it comes back.

## Four pressures that define it

Every one of these was found by bisecting the engine's own behaviour rather than read off a constant.

| edge | psia |
| --- | --- |
| the threshold where the correction leaves one | 1500.000000000007 |
| the crossing back through one, bisected | 1580.310880829016 |
| the same crossing, derived and exported by the engine | 1580.310880829016 |
| the top of the published range, where the route refuses | 3200.000000000003 |

The second and third rows are the same number reached two ways. The engine derives that crossing itself and exports it as a constant, and bisecting the returned correction finds the same pressure, which is a real agreement rather than a restatement.

## It steps

A millionth of a psi below the threshold the correction is 1.000000000000. A millionth of a psi above it the correction is 0.995677635301. That is a step of -0.004322364699 across two millionths of a psi, and the required area moves by the reciprocal of it.

A step matters more than its size suggests. Two relief cases a psi apart in relieving pressure, on either side of that threshold, get different valves, and nothing in the inputs looks like a discontinuity.

## And it goes the wrong way first

| relieving psia (stated) | KN | required area in2 | warning |
| --- | --- | --- | --- |
| 1500.000000 | 1.000000 | 1.248029 | no |
| 1520.000000 | 0.996733 | 1.235644 | yes |
| 1550.000000 | 0.998342 | 1.209776 | yes |
| 1580.000000 | 0.999983 | 1.184858 | yes |
| 1600.000000 | 1.001095 | 1.168748 | no |
| 1800.000000 | 1.013078 | 1.026599 | no |
| 2000.000000 | 1.026884 | 0.911517 | no |
| 3000.000000 | 1.146760 | 0.544155 | no |
| 3200.000000 | 1.190866 | 0.491251 | no |

Between the threshold and the crossing the correction sits below one, and a correction below one makes the required area larger than the uncorrected equation would give. The engine flags every row in that band. Above the crossing the correction rises past one for the rest of the published range, and from there it behaves the way a correction is normally expected to: it shrinks the required area, and it shrinks it more as the pressure climbs.

The course prints no width for that band, only its two ends, so this lesson prints none either.

## The two boundaries are held for literature

The threshold and the top of the published range are published boundaries. This package can derive neither of them, and the test suite pins both as behaviour rather than as arithmetic. The fit between them is checked against the standard's own SI statement of the same correction, so the curve is checked and its two endpoints are taken on authority.

## What the engine says in the band

The rows marked with a warning carry a notice from the engine itself, and the notice states the three facts a reader needs: that the correction is below one across that interval, that it therefore makes the required area larger there, and that it steps at the lower boundary and returns through one at the upper one. The engine says all of that rather than leaving a user to discover a valve that grew when a pressure rose.

## Reading a stepped correction in practice

Two habits follow. The first is to check where a relieving pressure sits relative to a published boundary before comparing two cases, because a comparison that straddles a step is comparing two different regimes. The second is to read the correction that came back rather than assuming it from the pressure.

## Exercise

Write down the four pressures in the first table and say which two of them are the same number found two ways. Then say what happens to the required area between the threshold and the crossing, and why a step matters more than its size.
