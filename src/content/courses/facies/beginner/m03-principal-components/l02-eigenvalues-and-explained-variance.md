# Eigenvalues and explained variance

{{panel:ef-cluster-explorer}}

Principal components are new directions through the rows, each a blend of the logs, chosen in order: the first along which the rows spread most, the second along which they spread most of what is left, at right angles to the first, and so on. There are as many components as logs. Each comes with an eigenvalue, which is the variance of the rows along that direction.

| component | eigenvalue | explained variance ratio | cumulative ratio |
| --- | --- | --- | --- |
| PC1 | 2.729404 | 0.682351 | 0.682351 |
| PC2 | 1.101519 | 0.275380 | 0.957731 |
| PC3 | 0.097784 | 0.024446 | 0.982177 |
| PC4 | 0.071294 | 0.017823 | 1.000000 |

## Reading the eigenvalues

The table is `pca` on the correlation matrix of GR, RHOB, NPHI and PEF over the 180 cored rows. The eigenvalues come largest first. They add to 4.000000, the number of logs, because each standardised log has variance 1 and the components share out that total without losing any.

The explained variance ratio is each eigenvalue over the total. PC1 carries 0.682351 of the variance of the four logs. PC2 adds 0.275380, so the first two together carry 0.957731. The last two carry 0.042269 between them. Four logs, on these rows, spread almost entirely within a plane, and that plane is what the strong correlations of the last lesson predicted.

## The ratio uses every component

Ask for fewer components with `nComponents` 2 and the engine returns the same first two ratios, 0.682351 and 0.275380. The ratio is always taken over all four components, so keeping fewer does not inflate the share of the ones you keep.

Ask for more components than logs and the engine refuses:

> nComponents must be a whole number from 1 to 4 (the number of features)

A table of four logs has four directions and no more.

## How the engine found them

It finds the eigenvalues by cyclic Jacobi rotations, sweeping through the matrix until a sweep needs no rotation. On these rows it took 6 sweeps and converged, and the result reports `converged` true. Its basis reads:

> cyclic Jacobi rotations; an off-diagonal entry at or below 2^-52 x sqrt(|a_pp a_qq|) is set to zero; stops after the first sweep needing no rotation (at most 50 sweeps); eigenvalues sorted descending, equal values keep column order, a rounding value below zero reported as 0

You do not need the rotation arithmetic to use the result. You do need to read `converged`, because a result that did not converge is still returned, with a warning beside it.

## How many to keep

There is no rule in the engine for that. Two components carrying 0.957731 is a reason to plot the rows on PC1 against PC2 and read the picture closely. It is no promise that the dropped 0.042269 is noise: a small direction can still separate two facies that sit close on everything else. The engine reports the ratios and leaves the choice to you, written down with the result.

## Exercise

Open the cluster explorer on the view "Principal components". Keep the cored rows and the four logs, and read the eigenvalues and ratios. Add them up and check the total against the number of logs. Set "Components kept" to 2 and read the ratios again. Then set it to 5 and read what the engine returns. Finally remove NPHI from the logs and write down how the first ratio and the total of the eigenvalues change.
