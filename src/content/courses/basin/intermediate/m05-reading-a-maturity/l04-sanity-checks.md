# Sanity checks

Every tier of this course ends its penultimate module with the same discipline: a short list of checks that catch wrong answers before anyone else sees them. The kinetics tier's list is unusually strong, because the scheme carries two exact anchors and several structural properties that bad implementations and bad inputs violate loudly.

## The two anchors

Check one: zero reaction must give $e^{-1.6} = 0.20189651799465538$, and full reaction $e^{-1.6+3.7 \times 0.85} = 4.687971627022019$ as the engine computes it. These are closed forms; a calculator verifies them in seconds. They catch the catastrophic failures: the units-in-the-exponent bug of module 2 fails both by enormous margins, as does any corruption of the weights, the frequency factor or the read-out constants. When the fifteenth digit differs from your hand value, module 2 told you why; when the third digit differs, stop everything.

## Monotonicity and range

Check two: along any heating history, Ro must rise monotonically from 0.2019 and never exceed 4.688; TR must rise from 0 and never exceed 1. A dip in either is an integrator bug; an excursion outside range is a state corruption. The engine enforces the Ro ratchet explicitly, so a dip in its output is impossible by construction, which converts this check into one you run on other software and on hand calculations.

## Order-of-magnitude physics

Check three: rates should reproduce module 1's landmarks within arithmetic error. The 46 kcal bin at 100 degC: $1.1411620329306917 \times 10^{-14}$ per second, half-life 1.9 Ma. Adjacent bins at 100 degC: factor 14.84. Ten degrees at the front: factor 5. Fifty degrees: factor 1526. If a computation implies twenty degrees bought only a factor of 1.5 in the window, or that adjacent bins differ by a factor of 2, something upstream is broken.

## Fixture crossings

Check four: run the ramp machinery and confirm the graded rows. 0.9871413464062039 at 150 degC and rate 3; 1.1129254516555198 at rate 1; TR 0.022481215976523083 and 0.05477927380797565 at 100 degC, 10 and 50 Ma. Beyond the graded rows, confirm the slow ramp sits above the fast one at every temperature and the crossings shift 6 to 9 degrees per factor of 3 in rate. The independent Python oracle agrees with the engine to about 1e-9 here; the tolerance the capstone gives you is orders of magnitude wider, so a disagreement at the third digit is yours.

## Consistency between the clocks

Check five: the separation test. Switch kerogen type and confirm TR moves while Ro does not, to the last digit. It costs a minute in the panel, and on any unfamiliar software it is the highest-value test in this list, because the conflation it hunts has a documented precedent and quietly corrupts every calibration downstream.

## Worked example

You port the scheme to a new tool and get Ro at 150 degC, rate 3, of 0.912 instead of 0.9871413464062039. Both anchors check out exactly. Diagnose in order. Anchors passing clears the constants, weights and read-out. Monotonicity and range give nothing. The 7 percent deficit at a graded row with correct endpoints suggests the integration itself: step size or the temperature rule. A start-of-step temperature convention systematically under-reacts, module 3 said, and 7 percent low at rate 3 is its signature; switching to midpoint evaluation, or shrinking steps and watching the value climb toward 0.987, confirms it. The check list did not just catch the error, it localised it.

## Exercise

Name the five checks in one line each. Then answer in one sentence: why are the two closed-form anchors the first check and not the last?

As a self check: anchors (two exact endpoint reflectances), monotone range (Ro and TR rise within bounds), rate landmarks (half-lives and ladder ratios at 100 degC), fixture crossings (graded rows plus curve ordering), and clock separation (type moves TR, never Ro). The anchors come first because they are free, exact and catastrophic-failure-sensitive: thirty seconds of arithmetic that must pass before any longer computation deserves attention.
