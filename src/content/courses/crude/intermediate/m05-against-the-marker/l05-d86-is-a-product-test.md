# D86 is a product test

Every curve in this tier has been a TBP curve. There is another distillation the digest names, and the engine is careful about it.

## Two distillations

The digest puts the difference in one line: "D86 is a product test; a crude assay is reported as a TBP distillation." Every curve the Kwale valuation is built on is a TBP curve, and the functions that read those curves say so. The Associate tier's first reading function is described in the digest as the one that "reads a TBP curve: the volume percent distilled at a temperature". blendDistillationCurves, temperatureAtVolumePercent and cutYields all work on the curves it reads.

The digest prints nothing about how a D86 curve differs in shape from a TBP curve of the same material, so this course says nothing about that either. What it does print is how the engine treats a D86 curve that arrives in place of a TBP one.

## A conversion exists

The digest describes d86ToTbp: it "has the structure of the cut-point-difference conversion (API Technical Data Book Procedure 3A1.1)". That is a published procedure, named by the engine, and the engine carries its structure and nothing more.

## And the engine does not ship it

In the digest's words, d86ToTbp "ships no coefficient table, because reproducing a published table from memory is what the engines refuse." So the structure is there, and the coefficients must come from the published source, supplied by whoever calls it.

Called without the table, the engine refuses in its own words:

| asked | what the engine returned |
| --- | --- |
| a D86 curve and no coefficients | REFUSED: D86 to TBP conversion needs the API Technical Data Book Procedure 3A1.1 coefficient table, which is not shipped with this package. Supply it, or enter the assay as a TBP distillation, which is how crude assays are reported. |
| a D86 curve with no 50 percent point, and a table | REFUSED: The D86 curve needs a 50 percent point to anchor the conversion. |

The first refusal gives two ways forward: supply the table, or enter the assay as a TBP distillation, the way crude assays are reported. The second is asked with a table supplied, and it still refuses, because the curve has no 50 percent point. Its sentence names the reason: the conversion is anchored there.

## What this means for a valuation

If a crude arrives with only a D86 curve, the engine does not convert it with a table it does not carry. Its refusal tells the caller what to supply: the coefficient table from the published procedure, or the assay as a TBP distillation. Every yield and netback in this tier was built on a TBP curve, and a D86 curve does not enter that chain until one of those two is supplied.

This lesson has no panel. The valuation explorer works on TBP curves only, the curves every figure in this tier was read from.

## Exercise

Read the two refusals. Say what each asks the caller to supply, and quote the digest's reason that d86ToTbp ships no coefficient table. Then say why the second refusal is returned even though a table was supplied with it.
