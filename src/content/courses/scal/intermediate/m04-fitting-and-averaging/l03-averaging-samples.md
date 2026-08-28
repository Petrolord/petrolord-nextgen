# Averaging samples

A real study rarely has one plug. It has a handful, cut from different wells, measured in different campaigns, sometimes in different labs. Module 2 collapsed each plug to its own J table. This lesson is about the step that turns several collapsed tables into one reservoir curve, and about the specific choices the engine makes on the way, because each choice is a place where two analysts can silently diverge.

## The four moves

The engine's `averageJCurves` makes four moves, in order.

**First, each sample is put on the normalized axis.** Every plug's J rows are re-keyed from $S_w$ to $S_w^* = (S_w - S_{wirr})/(1 - S_{wirr})$, using either a shared $S_{wirr}$ you supply or a per-sample default. The axis has to be normalized before any averaging, because two plugs with different irreducible saturations disagree about what a given $S_w$ means: 0.35 might be deep in one plug's transition zone and at the edge of another's.

**Second, each sample becomes an evaluator.** The rows are wrapped in the tabulated J spec, which interpolates between points linearly in $\ln J$ and clamps at the ends. This matters because the plugs were not measured at the same saturations; to average them they must all be readable at the SAME points, and interpolation is what makes that possible.

**Third, the average runs on a common grid, over the overlap only.** The grid spans from the largest of the samples' minimum $S_w^*$ values to the smallest of their maxima. Outside that overlap at least one sample would be contributing a clamped endpoint rather than data, so the engine refuses to average there. If the samples share no overlap at all, the function returns an error rather than an invented curve.

**Fourth, the mean is geometric, with a band.** At each grid point the sample values are combined through the mean of their logarithms, and the minimum and maximum are kept alongside as a spread band. J is a positive, ratio-like quantity spanning a wide range; averaging it arithmetically would let the highest-J sample dominate every grid point, exactly the imbalance log-space fitting was built to avoid. The geometric mean treats a sample reading 2x high and a sample reading 2x low as cancelling, which is the symmetry you want for a multiplicative quantity.

On the three Ekene plugs the band is degenerate by construction: the plugs collapse to the same curve, so at every grid point the minimum, mean and maximum coincide to within arithmetic noise, with all three samples contributing at every point. On real data the band is the diagnostic: a wide band at some saturation says the plugs disagree there, and the mean is papering over a real difference worth investigating.

## The refit is a candidate

After the mean curve is built, the engine fits a power law to it, on the $S_w^*$ axis where the irreducible saturation is zero by construction, and returns the fit alongside the grid. That fitted pair is offered as the reservoir jSpec candidate: the two-parameter summary you would carry forward to capillary pressure reconstruction and saturation-height work.

Treat it as exactly that, a candidate. It is a fit OF an average OF interpolations, three layers from the lab data, and each layer is a modelling choice. The direct fit of a single plug's raw points, the one lesson 1 showed recovering the plant exactly, answers a different question: what does THIS plug say? The averaged refit answers: what one curve best serves ALL plugs? When the plugs genuinely share a curve the two answers should agree closely, and comparing them is a check worth making every time. The Expert tier takes that comparison apart quantitatively; here it is enough to know that the two are not the same object and should not be quoted interchangeably.

## See it in the panel

{{panel:sc-jfunction-explorer}}

Select all three plugs together. The J cloud on the right collapses to a single curve and the fitted parameters sit beside it. Now read the fitted a and fitted b tiles and compare them against what a single plug gave you in lesson 1. Then change the Swirr override slightly, to 0.27, and watch both fitted parameters move: nothing about the rock changed, only the axis the average was computed on. That sensitivity is the subject of the next lesson.

## The misconception to avoid

The error this lesson exists to prevent is averaging the capillary pressure curves themselves, one arithmetic mean of $P_c$ at each saturation across the plugs. That mixes rock scaling into the average: a high-permeability plug's low $P_c$ and a tight plug's high $P_c$ are both correct for their own rock, and averaging them produces a curve that is correct for no rock at all. The whole point of the J transform is to remove the rock scaling FIRST, average what remains, and only then rescale to whichever rock you need. Average in J, never in $P_c$.

## Exercise

First, three plugs carry J data over normalized ranges of 0.07 to 1.0, 0.10 to 1.0, and 0.05 to 0.95. State the overlap the engine will average over, and say what happens to the grid if a fourth plug spanning 0.40 to 0.60 is added.

Second, at one grid point the three samples read J of 0.5, 0.5 and 2.0. Compute the arithmetic mean, then reason out (without a calculator) roughly where the geometric mean sits, using the fact that it is the cube root of the product. Which mean moved further toward the outlier, and why is that the wrong direction for a quantity like J?
