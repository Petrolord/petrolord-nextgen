# The workflow

You have had two workflows already. The Associate reading was seven steps running left to right, never asking you to choose anything, because a closed tank offers nothing to choose. The Professional reading was three phases, diagnose then model then defend, and its discipline was keeping the diagnosis away from the fitting.

The Expert reading adds no new steps to either. Do them both. What it adds is this:

**Every decision that could reasonably have gone the other way is recorded with the number it would have produced.**

A reading at this tier is not an oil in place. It is an oil in place plus the map of what else it could honestly have been, and the map is the deliverable. A reviewer cannot check your judgment; judgment leaves no trace. What a reviewer can check is whether the alternative you rejected was worth 3 million barrels or 300, and whether you knew.

Six decisions carry that weight, each with the evidence that settles it and the counterfactual it owes.

## One: the fluid system and the live mechanisms

Oil or gas, and which mechanisms are running. This is usually settled by the fluid and the geology and rarely has a counterfactual worth recording, but it has a boundary you must place explicitly: where the bubble point sits relative to your pressure range. Above it the solution gas ratio is constant, the two phase formation volume factor equals the oil one, and the oil expansion term is pure oil expansion. Below it the gas comes out and the term changes character.

Record: the pressure range, the bubble point, and which side of it each survey falls.

## Two: the level and the drift of the F over Et column

Read the column, survey by survey, before fitting anything. It has two independent features and only one is a straightness problem.

**Drift** is the signature of a lagging influx. Water arriving on its own clock makes the ratio climb survey after survey, which is what the Professional tier taught you to catch.

**Level** is the feature that catches nobody. An instantaneous pressure proportional aquifer delivers influx in proportion to the drawdown while the total expansion is also very nearly proportional to it, so the ratio barely drifts and simply sits at the wrong height. On a constructed tank of 12000000 stb with a 5000000 rb pot aquifer the ratio moves by only -0.0375706439360688 percent across six surveys, at a fit statistic of 0.999999988185953, while sitting 12.24 percent above the truth. Every straightness test passes and the answer is a million and a half barrels wrong. Only the volumetric reconciliation catches a level error. Never write that a straight line means no aquifer.

Record: the column itself, its percentage drift end to end, and the independent booking you checked the level against.

## Three: the aquifer model, from geometry

Choose it from what you know about the aquifer: its size, its connection, its encroachment angle, how quickly the field responded. If you cannot say why it suits the reservoir before you run it, you are choosing by fit statistic.

The counterfactual here is compulsory and is the single most useful number in the whole reading: run the case again with no aquifer at all. On the Dake Exercise 9.2 history the Carter-Tracy run with a finite aquifer gives 307.221409553720 MMSTB, while ignoring the aquifer gives 532.588241588393 MMSTB, at a fit statistic of 0.999317934436751 and with no warnings whatsoever. The aquifer decision is worth 225.366832034673 MMSTB on that field, and a reader who is not told that has not been told the main thing.

Record: both numbers, the difference in barrels, and the geometric argument for the model you kept.

## Four: the solution family

The decision the lower tiers did not have. Within Carter-Tracy you still choose whether the aquifer is bounded, and at what dimensionless radius. These are not one expression with and without a boundary term; they are different derivations, and module 1 measured how far apart they run.

Its counterfactual on Dake: remove the radius ratio, so the infinite acting solution is used on a finite aquifer, and the influx comes back at 148.248060002236 MMrb instead of 88.0645883139400 MMrb, 68.3401499292189 percent higher, while the oil in place collapses to 156.177551848366 MMSTB. Imported water that is not there does work the oil would have had to do, so the regression needs less oil to close the books.

Record: finite or infinite, the radius ratio and where it came from, and the other family's answer.

## Five: the benchmark, where one exists

Where a published worked example covers the path you used, run it. Not the tier badge, the case. Take the published inputs through the same code path with the same settings, and quote the disagreement you measured today rather than the one in the provenance string, which module 5 showed still records 301.0 MMSTB and 3.53 percent where the case now gives 307.221409553720 MMSTB and 1.53159950201266 percent.

Record: the case, the printed value, your value, the disagreement, and the date you measured it.

## Six: the index convention, stated before the indices are read

Two conventions apportion the same drive and both are correct. Divide by gross withdrawal $F$, which is what the engine's fields do, or by net withdrawal $A = F - W_p B_w$, which is what Ahmed prints. They agree exactly whenever no water has been produced, which is why Ekene closes to 1 under both and why the question never came up before this tier.

On Ahmed Example 11-1 they diverge. Under the net convention the indices sum to 1.00000000000000 and all four agree with the book to within one unit in the last printed place. Under the gross convention they sum to 0.971594137029883, which looks like a closure failure and is not: it is exactly the ratio $A/F$. When indices miss one, check the denominator before the data.

The naming has a trap too. The engine field `sdi` holds the rock and connate water expansion term the literature calls EDI, and `gdi` holds the gas cap term the literature calls SDI. Say what the term is, then name the field.

Record: the convention, in the same sentence as the indices.

## Worked example: the Dake reading as a paired record

Fluid oil, eleven annual surveys, pressure from 2740 to 1460 psia, per row properties throughout. Column rises steadily, a lagging influx, and the level cannot be reconciled independently here, so the aquifer decision rests on the drift and the geometry. Model Carter-Tracy, chosen from a 140 degree wedge aquifer at a radius ratio of 5, not from fit. Result 307.221409553720 MMSTB, influx 88.0645883139400 MMrb, fit 0.999975248425736, indices 0.567843338103932 and 0.417877131928747 summing to 0.997165062762353 under the gross convention. Counterfactuals: no aquifer 532.588241588393 MMSTB, infinite family 156.177551848366 MMSTB. Benchmark: Dake's own 312 MMSTB, disagreement 1.53159950201266 percent, measured today. Exposure: the aquifer model, worth 225 MMSTB, and the solution family, worth 151 MMSTB.

Nine sentences, and a reviewer who now knows what your judgment was worth.

## Exercise

Take any case you have run in this tier and produce its paired record. For each of the six decisions, write the choice, the evidence, and the counterfactual number, and run every counterfactual you cite. An estimate written where a run belongs is worse than a blank, because it looks like evidence.

Then sort your counterfactuals by size in barrels. Whatever sits at the top is what your reading is really about, and it is almost never what you spent the most time on.
