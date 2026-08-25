# One well is enough

Block 1 has one control point, and kriging RUNS there. This lesson works out what a one-point kriging system actually computes, why the fallback ladder treats krige and trend so differently at small n, and what the provenance record is really for.

## The one-point system

With one data point, the kriging system is one equation: $A$ is the 1 by 1 matrix $[\mathrm{sill}]$, and at a target the right-hand side is the single covariance $c_0(h)$. The weight is $w = c_0(h)/\mathrm{sill}$, and the estimate is $\mu + w(\phi_1 - \mu)$. But with one point, the default mean IS the point: $\mu = 0.315$. The residual is zero, so the weight multiplies nothing:

$$\hat\phi = 0.315 + w \times 0 = 0.315 \quad \text{everywhere}$$

Kriging from one well, with the data-mean default, is the constant map of that well's value, at every target, at every range, at every nugget. Block 1's kriged porosity is 0.315 across all 174 nodes, and the panel's flat blue profile segment is this equation drawn.

Two footnotes worth having. First, the collapse is a consequence of the DEFAULT mean; simple kriging with an explicit mean of, say, 0.29 would give a map that decays from 0.315 at W1 toward 0.29 with distance, actually using the variogram. The engine supports that; the teaching default does not exercise it. Second, the exactness of lesson two still holds trivially: at W1 the estimate is 0.315 because everything is.

## The ladder's asymmetry

The population engine's fallback ladder runs krige, then trend, then constant, using the first that succeeds. For block 1: krige SUCCEEDS with one point, as just derived, so the provenance reads method krige, wells 1, fell back FALSE. Ask for trend instead and the ladder tries planeFit, which THROWS at fewer than three points; the ladder catches it and falls to constant: method constant, wells 1, fell back TRUE.

Pause on the asymmetry, because it is a design lesson. Kriging degrades GRACEFULLY: its small-n behaviour is well defined and sensible, a constant, so the engine lets it run. Trend fails STRUCTURALLY: two points leave a plane underdetermined, and any "plane" returned would be an arbitrary choice dressed as a fit, so the engine throws and the ladder records an explicit fallback. The same output, a constant 0.315 map, thus carries two different provenance stories depending on the requested method, and the stories are the honest part: "krige, no fallback" says the method ran as asked; "constant, fell back" says the method you asked for was impossible here.

## Provenance is the product

For block 1, every method dial position produces the same 174-node map. What DIFFERS is the metadata, and in a real shop the metadata is what review reads: a model summary listing block 1 as "krige, 1 well" versus "constant, fallback from trend, 1 well" tells a reviewer instantly that this block's map is a single-well construct, whatever the map looks like. The engine records provenance per block per property on every population run, never silently; the panel's tile with its fallback star is that record surfaced. The discipline to carry: any population system that can fall back MUST say so in its output, because the map alone cannot be distinguished from a fitted one.

## Worked example

Predict the full provenance table for a hypothetical zone whose control points land 2 in block 0 and 2 in block 1, method trend requested. Block 0: planeFit throws at 2 points, fall back to constant: method constant, wells 2, fellBack true. Block 1: same: constant, wells 2, fellBack true. The model's every block is now a fallback, the map is two flat values, and the provenance table, four short fields per block, is the only place that story is visible. A reviewer who reads only maps would see a plausible two-tone model; one who reads provenance sees no trend was fitted anywhere.

## Exercise

Write the one-point kriging derivation for the OTHER mean convention: block 1 kriged with the explicit field-wide arithmetic mean 0.2905162808206047 instead of the default. Give the estimate at W1 itself and the estimate's limiting value far from W1, and state in one sentence which convention block 1's single well would prefer if it could argue.
