# Working the capstone

Six steps, in one order. A graded answer that is wrong is wrong at a step you can name, and most of what goes wrong comes from doing the steps out of order.

{{panel:pd-thermal-explorer}}

## Step one: write the boundary down before any pipe

Neither engine computes a hydrate temperature. Take the boundary you are given, record where it came from, and treat everything after it as conditional on it. Doing this first stops a stack of resistances from being mistaken for a verdict.

## Step two: list the layers outward from the bore, each with its own k

Inside diameter, outside diameter, conductivity, in order. Every layer takes its own conductivity as an input and the catalog is a convenience, not an authority. An unrecognised id returns a NaN rather than falling back to carbon steel, and that is deliberate: on one layer the difference between steel and aerogel is 2166.666667.

## Step three: build the stack and count the terms

`overallU` returns a `resistances` array. Count its entries against what you handed in: two films, one entry per layer, and one burial entry if a trench was asked for. A trench shallower than half the coated diameter has no real acosh, and what comes back is the exposed line with `ok: true` and no note, so the count is the only check the API offers. On the published 8.625 in coated diameter that floor is 0.35937500 ft. Then confirm the shares sum to 100.00000000 percent.

## Step four: read the shares before you read the U

The share column says which term the answer belongs to. On the published buried build the foam is 52.83080440 percent and the trench 46.57193819 percent, and the two films and the steel together carry the rest. Argue about the dominant term and leave the small ones alone.

## Step five: carry the reference diameter with the coefficient

Read `referenceIdIn` and never separate it from the U. The consumers of a U take a bare diameter and cannot see that field, so the pairing is yours to keep. The arithmetic check is one multiplication: U times its own reference diameter is the same number whichever reference was chosen, and on the published buried build both readings give 0.360463185702 Btu/(hr ft degF) per foot. Pi times that is one over the total resistance.

## Step six: compute both masses, and say what had no slot

An annulus and a bore, each with its own density. Then name the layers that went into neither slot and write that down beside the answer.

| Step | What passing looks like |
| --- | --- |
| Boundary | Written down first, with its source |
| Layers | Every k stated, none inherited |
| Stack | Term count matches what was asked for |
| Shares | Sum to 100.00000000 percent |
| Reference | Diameter travels with the coefficient |
| Mass | What was left out, recorded |

Units throughout: degF, psia never psig, lbm/ft3, lbm/ft, ft, in, hr, and Btu/(hr ft2 degF) for a coefficient.

## Exercise

Work a screen of this kind through all six steps and write one line for each.

Then name the step that, taken out of order, leaves every later number correct on its own and the conclusion wrong.
