# The three propagation modes

How an error at one station becomes an error at every station below it.

## The three

**Random.** The error takes an independent value at each station. Contributions add in variance, so the position error grows as the square root of the number of stations.

**Systematic.** The error takes ONE value for the whole survey run and applies at every station. Contributions add in amplitude before squaring, so the position error grows linearly with the number of stations.

**Global.** The error takes one value for the whole WELL, and for every well surveyed against the same reference. Declination is the archetype: if the field model is wrong at this location, it is wrong by the same amount for every well drilled there.

## Why the distinction dominates everything

Consider a hundred stations, each contributing an error of size e.

Random: total is e times the square root of a hundred, so ten e.

Systematic: total is e times a hundred, so a hundred e.

A factor of ten between two sources of the same size. That is why the biggest contributors in the panel are systematic and global sources rather than random ones, and it is why the total uncertainty does not improve by surveying more often.

## What makes a source systematic

Anything that is a property of the tool for the duration of the run, or of the environment for the duration of the well.

A magnetometer bias is fixed while the tool is downhole, so it is systematic. Sensor noise is different at each reading, so it is random. Declination is fixed for the location, so it is global.

The classification is part of the published model, not a choice the implementation makes.

## Why global matters for anti-collision

This is the one with a consequence beyond a single well.

If two wells are surveyed against the SAME declination model at the same location, and the model is wrong, both wells are rotated by the same amount. Their RELATIVE positions are then much better known than either absolute position.

That is a real and useful effect, and handling it correctly is why the clearance calculation in the Expert tier treats sources differently depending on whether the two wells share them. The naive calculation, which adds both wells' full covariances, is too pessimistic for wells surveyed the same way and too optimistic for wells surveyed differently.

## The kickoff case

Two wells from the same slot share their entire surface position uncertainty, and everything above the kickoff point.

The engine handles this by slicing the reference well's covariance below the kickoff depth when a kickoff is supplied, which removes the common part. The Expert tier's standard case with a kickoff at 900 m is exactly this situation, and it is the one case in the standard set whose far-field numbers differ slightly from the oracle.

## How the engine accumulates

For each source, the model produces the sensitivity of the position to that source at every station. Random sources are accumulated by summing the outer products; systematic and global ones by summing the sensitivities first and then taking the outer product of the sum.

That single difference in the order of squaring is the whole distinction, and it is why the code keeps a second accumulator alongside the first.

## The misconception to avoid

"Systematic errors can be calibrated out." Some can, which is what multi-station correction and in-field referencing are for, and doing so is what changes the parameter set to a better one. What cannot be calibrated out is the residual after correction, and that residual is still systematic, so it still grows linearly.

## Exercise

Two error sources contribute 0.02 degrees of azimuth error each at every station. One is random, one is systematic. The well has 200 stations.

Compute the ratio of their contributions to the final position uncertainty. Then say how many stations the random one would need before it caught up with the systematic one.
