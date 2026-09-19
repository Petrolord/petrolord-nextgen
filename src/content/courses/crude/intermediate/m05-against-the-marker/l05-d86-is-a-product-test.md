# D86 is a product test

Every curve in this tier has been a TBP curve. There is another distillation in the laboratory, and the engine is careful about it.

## Two distillations

A true boiling point distillation, TBP, separates a crude sharply, with many theoretical stages and reflux, so each temperature on the curve is close to the true boiling point of what comes over at that volume. It is slow and it needs a large sample. A crude assay is reported as a TBP distillation.

D86 is a simple batch distillation with no fractionation to speak of. It is fast, cheap and repeatable, and it is the test written into product specifications for gasoline, kerosene and diesel. The digest puts it in one line: D86 is a product test; a crude assay is reported as a TBP distillation.

Because D86 does not fractionate, its curve is flatter than the TBP curve of the same material: its initial point reads high and its end point reads low. The two curves are of the same sample, measured differently, and they are not interchangeable. Every function in this tier, volumePercentAt, blendDistillationCurves, temperatureAtVolumePercent, cutYields, assumes a TBP curve.

## A conversion exists

There is a published way to turn a D86 curve into an estimated TBP curve. The digest describes d86ToTbp: it has the structure of the cut-point-difference conversion (API Technical Data Book Procedure 3A1.1). The method anchors on the 50 percent point and converts the temperature differences between successive points, each through its own coefficients.

## And the engine does not ship it

d86ToTbp ships no coefficient table, because reproducing a published table from memory is what the engines refuse. A coefficient table typed from memory could be wrong in a way nothing would catch: the conversion would run, return a plausible curve, and every yield and netback built on it would carry the error. So the structure is there, and the numbers must come from the published source, supplied by whoever calls it.

Called without the table, the engine refuses in its own words:

| asked | what the engine returned |
| --- | --- |
| a D86 curve and no coefficients | REFUSED: D86 to TBP conversion needs the API Technical Data Book Procedure 3A1.1 coefficient table, which is not shipped with this package. Supply it, or enter the assay as a TBP distillation, which is how crude assays are reported. |
| a D86 curve with no 50 percent point, and a table | REFUSED: The D86 curve needs a 50 percent point to anchor the conversion. |

The first refusal gives two ways forward: supply the table, or supply the assay the way crude assays are reported. The second shows why the 50 percent point matters to this method. The conversion is anchored there, and without it the differences have nothing to hang from.

## What this means for a valuation

If a crude arrives with only a D86 curve, this studio will not quietly treat it as a TBP curve, and it will not convert it with coefficients nobody can trace. The right move is to ask for the assay's TBP distillation. A netback built on a D86 curve read as TBP would put barrels in the wrong cuts, and the error would reach the differential without a trace.

This lesson has no panel. The valuation explorer works on TBP curves only, which is the point.

## Exercise

Read the two refusals. Say what each asks the caller to supply, and why the engine asks for the coefficient table from the published source when it could have carried one of its own. Then say why the second refusal names the 50 percent point in particular.
