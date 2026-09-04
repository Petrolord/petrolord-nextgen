# Two loads from one object

One call to `predictCard` returns two answers for the peak polished rod load. They differ by 305.588002202 lb, and the design splits on the difference.

{{panel:pd-balance-explorer}}

## The two routes, named

`prlPeakLb` is the maximum of the decimated surface card, 186 of the 6110 marched steps on ODUMA-4. The envelope top is `tensionEnvelope[0].maxLb`, accumulated over every marched step, plus the buoyed weight of the rod above that node, because the shallowest envelope sample sits at 20.000000000 ft and not at the surface.

Both come out of the same object, from the same march, with no flag saying they disagree.

| Route | Value, lb |
| --- | --- |
| Envelope maximum at 20.000000000 ft | 19800.044639044 |
| Buoyed rod above that node | 51.421146497 |
| Peak implied by the envelope | 19851.465785541 |
| Peak as `prlPeakLb` reports it | 19545.877783339 |

The gap is 305.588002202 lb, 1.563440 percent.

## Which one is nearer the march

Marching every step and reading the fully sampled card gives 19923.650769100 lb. The envelope route sits -72.184983559 lb from that, and `prlPeakLb` sits -377.772985761 lb from it. Both read low, and the subsampled one reads low by far the larger margin.

Neither is the peak of a continuous cycle, because a march has no continuous cycle. The envelope is simply the sampling that threw nothing away, and the remaining -72.184983559 lb is the half node of rod the envelope grid cannot resolve rather than anything discarded.

## The design splits on the disagreement

`sectionStresses` and the modified Goodman line read the envelope. `rating.structuralPct` and the `structuralOverload` warning read `prlPeakLb`. So one design is checked against two different peak loads in one return, and the check that decides whether the unit is big enough is the one reading the smaller number. The trusting half, the one fed the smaller load, is the structural rating.

## The smaller effect that is not the same effect

The envelope sample nearest the top of the first section is the one at 20.000000000 ft, so that section is priced 51.421146497 lb of buoyed rod light, 0.259029 percent. That is a discretisation choice, not a defect, and confusing it with the subsample would flatten a 1.563440 percent problem into a 0.259029 percent one. The two effects are separate, they are of very different sizes, and only one of them is a sampling choice anybody would call wrong.

## What it refuses

The object refuses to reconcile itself. Nothing in the return says which of the two loads a consumer should prefer, no field names its sampling, and no warning fires on a 305.588002202 lb disagreement. A caller who reads only the documented field names has no way to know that two of them were built from different sets of steps.

## Exercise

Take the envelope maximum at 20.000000000 ft, add the buoyed rod above that node, and compare the result with `prlPeakLb` for ODUMA-4.

Then state which of the two the modified Goodman check used, and which the structural rating used.
