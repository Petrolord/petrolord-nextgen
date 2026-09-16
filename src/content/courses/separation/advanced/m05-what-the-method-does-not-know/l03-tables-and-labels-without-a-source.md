# Tables and labels without a source

Two of the figures a layout check uses are recorded values rather than computed ones: the spacing table and the radiation labels. Both are held, and both sit beside setbacks that really are calculated.

{{panel:fc-layout-explorer}}

## A table is a table

| pair | required m |
| --- | --- |
| wellhead to wellhead | 3.000000 |
| wellhead to separator | 15.000000 |
| separator to tank | 15.000000 |
| heaterTreater to tank | 30.000000 |
| flare to tank | 60.000000 |
| flare to control | 90.000000 |
| valve to psv | 0.000000 |
| tank to skid | null, the table has no figure |

These are the customary onshore production-facility values as this engine records them, with no source checked. They are meant to be replaced wholesale by a site standard, and the null is the table admitting it has no entry rather than declaring that no distance is needed.

## The labels are recorded the same way

The engine carries four API 521 radiation levels with words attached: 1.580000 kW/m2 for continuous exposure with no time limit, 4.730000 kW/m2 for emergency action of several minutes with clothing, 6.310000 kW/m2 for emergency action up to about a minute, and 9.460000 kW/m2 for seconds only on an escape route.

The levels and their wordings are recorded, not verified. So the choice of an allowable level is an input somebody has to stand behind, and the label beside it is a convenience rather than an authority.

## What is computed

A setback moves when the duty moves, and that is the test. The ERHA flare releases 828000.0000 kW and needs 64.6458 m at an allowable of 4.730000 kW/m2. The bund of 18.000000 m burns at 601819.1967 kW with a flame 23.7996 m tall, giving 59.5294 m from the pool centre and 50.5294 m from the pool edge.

Change the relief rate, the heating value, the pool diameter or the allowable and every one of those numbers moves. Change nothing and a table figure of 90.0000 m stays 90.0000 m, because it was never a function of anything.

## The model has its own limit

The pool fire calculation is a point source. It computes no view factor and no solid-flame surface emissive power, and inside the flame height it under-predicts. The engine flags that case rather than answering it flat, and it says what to do: treat the figure as a lower bound and use a solid-flame view factor for design.

So even the computed half of a setback comes with a stated range of validity, which is the difference between a held figure and a modelled one.

## The mistake

The mistake is presenting a table figure as a calculation. Quoting 90.0000 m between a flare and a control room as a computed safety distance gives a copied number the authority of a model, and a site standard that says 75 m or 120 m is not contradicting a calculation.

The second mistake is defaulting a null. A pair the table does not carry is a gap, and filling it with zero turns silence into a positive statement that nothing is required.

## Exercise

Name the two things in the layout check that are recorded rather than computed, and say what would replace each. Then give the ERHA flare setback with the heat release it came from, and explain what makes it a computed figure where 90.0000 m between a flare and a control room is not.
