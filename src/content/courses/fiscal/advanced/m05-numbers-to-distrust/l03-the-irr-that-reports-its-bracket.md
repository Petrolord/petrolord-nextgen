# The IRR that answers with a status

`calculateIRR` returns a rate only when it can name exactly one, and says why when it cannot. The lesson is reading that status before reading any number.

{{panel:ec-comparison-explorer}}

## The band, and the four refusals

`calculateIRR` follows the shared contract in `engines/economics/irrContract.js`, the same one the screening engine uses. It searches the band from -99 to 1000 percent and returns a number only when exactly one rate in that band zeroes the NPV. A negative root inside the band is reported as the negative rate it is. Otherwise it returns null and `calculateIRRResult` says why: `no-sign-change` when the flows never change sign, `no-root` when no rate in the band zeroes the NPV, `above-clamp` when the only root is above the band, and `multiple-roots` when several are, with `irrRoots` listing the ones inside and `irrRootAboveBand` flagging one beyond. Neither edge of the band is ever returned as a rate.

## A root far above the band

The golden pins flows of -1 in year 1 and 2000 in year 2. The true rate is 199900 percent, far above the band, so the engine returns null with the status above-clamp. `calculateNPV` on those flows shows how flat the curve is out there:

| rate percent | NPV |
| --- | --- |
| 0 | 1999.0000 |
| 100 | 499.5000 |
| 1600 | 6.8616 |
| 25600 | 0.0264 |
| 102400 | 0.0009 |
| 199900 | 0.0000 |
| 400000 | -0.0001 |

At 102400 percent the NPV is 0.0009, small, positive, and still above zero. A search that stops where the NPV merely looks small reports a rate that is no root; the band and the status keep that from reaching a reader.

## A root just above the band

`irr_above_clamp_inside_old_bracket` has flows of -100 then 1500 and a root of 1400.0000 percent. It is above the band, so it is null with the same status, above-clamp. The band defines what the engine calls an internal rate of return, whatever a wider search could reach.

## Two situations, two answers

A profitable flow that never changes sign and a losing flow whose only root is negative are unlike, and each has its own answer. `irr_all_positive_no_sign_change` returns null with the status no-sign-change on a project whose NPV at 10 percent is 25.6198. `irr_negative_root_reported` has flows of -100 then 90, loses money at every positive rate, and reports the negative root itself, -10.0000 percent, on an NPV at 10 percent of -16.5289.

## The same contract next door

The screening engine solves its IRR by Newton iteration and shares this contract, so both engines return null with a status when no single rate in the band exists. A suspiciously round number where a rate should be is the tell of a solver quoting the edge of its own search, and neither engine returns one.

## The mistake

The careful mistake is sanity-checking an IRR by its magnitude. Read the status word, and never quote a rate the engine did not give. Hold the shape of the published `capex_multiplier_0_7` case: its NPV is zero at 1095.4783 percent, above the band, and at -20.4852 percent, inside it, so the engine returns null with the status multiple-roots, lists -20.4852 and flags the root above the band.

## Exercise

State the NPV of the published above-clamp case at 102400 percent and at 199900 percent, and what the engine returns. Then name the status for a flow that never changes sign and the rate reported for flows of -100 then 90.
