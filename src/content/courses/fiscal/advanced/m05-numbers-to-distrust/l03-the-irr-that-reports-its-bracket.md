# The IRR that reports its bracket

`calculateIRR` was documented as robust with no artificial cap, and it had a bracket. When the root lay outside it the function returned the bracket. It now returns nothing, and says why.

{{panel:ec-comparison-explorer}}

## The band, and the four refusals

`calculateIRR` follows the shared contract in `engines/economics/irrContract.js`, the same one the screening engine uses. It searches the band from -99 to 1000 percent and returns a number only when exactly one rate in that band zeroes the NPV. A negative root inside the band is reported as the negative rate it is. Otherwise it returns null and `calculateIRRResult` says why: `no-sign-change` when the flows never change sign, `no-root` when no rate in the band zeroes the NPV, `above-clamp` when the only root is above the band, and `multiple-roots` when several are, with `irrRoots` listing the ones inside and `irrRootAboveBand` flagging one beyond.

## The published case

The golden pins flows of -1 in year 1 and 2000 in year 2. The true rate is 199900 percent, far above the band, so the engine returns null with the status above-clamp. The retired bisection doubled from 100 percent ten times, reached 102400 percent, found the NPV still positive and returned 102400 as a rate. `calculateNPV` on those flows makes the distance visible:

| rate percent | NPV |
| --- | --- |
| 0 | 1999.0000 |
| 100 | 499.5000 |
| 1600 | 6.8616 |
| 25600 | 0.0264 |
| 102400 | 0.0009 |
| 199900 | 0.0000 |
| 400000 | -0.0001 |

At 102400 percent the NPV is 0.0009, small, positive, and not zero. The curve is that flat out there, and the old solver could not say it had stopped early.

## A root inside the old bracket

`irr_above_clamp_inside_old_bracket` has flows of -100 then 1500 and a root of 1400.0000 percent. The doubling would have reported that one, because 1400 sits well inside 102400. It is above the band, so it is null with the same status. The band defines what the engine calls an internal rate of return, whatever its search can reach.

## The two zeros, retired

The old solver returned 0 for two unlike situations, no sign change and a project whose only root is negative. Each now carries its own answer. `irr_all_positive_no_sign_change` returns null with the status no-sign-change on a profitable project whose NPV at 10 percent is 25.6198. `irr_negative_root_reported` has flows of -100 then 90, loses money at every rate, and reports the negative root itself, -10.0000 percent, on an NPV at 10 percent of -16.5289.

## The clamp next door

The screening engine solves its IRR by Newton iteration and returned a 1000 percent clamp when the iteration ran away. Two solvers, two methods, one failure: each reported the edge of its own search as an answer. The tell was identical, a suspiciously round number where a rate should be.

## The mistake

The careful mistake is sanity-checking an IRR by its magnitude. Read the status word, and never quote a rate the engine did not give. Hold the shape of the published `capex_multiplier_0_7` case: its NPV is zero at 1095.4783 percent, above the band, and at -20.4852 percent, inside it, so the engine returns null with the status multiple-roots, lists -20.4852 and flags the other. The retired bisection read 1095.4783 as the IRR.

## Exercise

State the NPV of the published bracket case at 102400 percent and at 199900 percent, and what the engine returns. Then name the two situations in which the retired bisection returned 0, and say what each returns now.
