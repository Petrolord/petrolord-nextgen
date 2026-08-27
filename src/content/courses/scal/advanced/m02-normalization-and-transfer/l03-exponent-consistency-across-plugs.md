# Exponent consistency across plugs

A SCAL program rarely stops at one plug. Three, five, a dozen samples come back from the lab, each with its own endpoints and its own tables, and before any of them earns the right to represent the reservoir you need to answer one question: are these plugs telling the same story about how permeability shares the pore space, or are they different rocks wearing the same formation name?

## The overlay test

Normalization is the instrument. Put every plug's table through `normalizeKrTable` and plot all of them on the $S_{wn}$ axis. The endpoint differences, which are the loudest differences between plugs, are divided out, and what remains on the page is each plug's curvature alone. If the plugs share exponents, the normalized curves collapse into a single band. If one plug's water curve bows visibly harder than the others, that plug either samples a different rock fabric or carries an experimental problem, and no amount of averaging should proceed until you know which.

This is the same intellectual move the Professional tier made with capillary pressure, where dividing out rock and fluid scaling collapsed three different laboratories onto one dimensionless curve. Relative permeability has no exact analogue of that theorem, but the practical test is identical in spirit: transform away what is allowed to differ, then stare at what is left.

## What agreement looks like in numbers

For Corey-shaped curves the normalized values are bare powers of $S_{wn}$, so agreement between plugs is agreement between exponents. Two plugs both reading near 0.1768 at the normalized midpoint are both telling you $n_w$ is close to 2.5, since $0.5^{2.5}$ is 0.17677669529663687. A third plug reading 0.25 at the same point is telling you $n_w$ is 2, a genuinely different shape, and the difference is invisible on the raw plot where endpoint scatter dominates.

The midpoint alone is a screening read, not a verdict. A single saturation can agree by accident while the curves cross elsewhere, so the working standard is to compare at least the quarter points. From the Ekene grid those normalized water values are 0.031250000000000014 at the lower quarter, 0.17677669529663698 at the midpoint, and 0.4871392896287463 at the upper quarter, and a plug matching all three is matching the whole exponent for any curve as smooth as a lab measurement.

When agreement holds, the payoff is large: the family of plugs justifies one shape for the rock region, and the per-plug endpoints become the only properties you carry forward, mapped from logs or trends. When it fails, the failure is a finding. A high-$n_w$ outlier plug may be the first evidence of a tighter facies, a wettability alteration during coring, or a rate effect in the experiment, and each of those explanations changes what curves the model deserves.

## Where the module 1 fit fits in

The rigorous version of the overlay test is to run module 1's `fitCoreyToKrTable` on each plug separately and compare the fitted exponents with their confidence intervals. Overlapping intervals across plugs is the quantitative form of the collapsed band. The plot and the fit answer at different speeds: the overlay finds gross disagreement in seconds, the fit prices the agreement in decimals. In practice you run the overlay first, discard or investigate the outliers, and fit the family that survives.

Averaging normalized curves across the agreeing plugs, then denormalizing onto field endpoints, is the standard recipe for a rock-type curve set. Every step of that recipe is machinery this module and the last one have already built.

## The misconception to avoid

Consistency of exponents does not license averaging the endpoints. The exponents describe pore-scale competition and may genuinely be a property of the rock family; the endpoints ride on local porosity, clay, and texture, and usually correlate with log-measurable properties instead of clustering around one value. The correct object to average is the normalized shape. The endpoints should be mapped, not averaged, or the transfer manufactures a rock that exists nowhere in the field.

## Exercise

First, two plugs report normalized water values at the midpoint of 0.1768 and 0.2500. Using the power-law reading of normalized Corey curves, state each plug's implied $n_w$ and say which plug bows harder away from the diagonal.

Second, a five-plug program shows four normalized water curves in a tight band and one clearly above it at every saturation. List two physically distinct explanations for the outlier and, for each, what you would check before deciding whether the plug belongs in the average.
