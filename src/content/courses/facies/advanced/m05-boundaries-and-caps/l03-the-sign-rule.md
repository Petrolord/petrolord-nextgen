# The sign rule of a component

{{panel:ef-classify-explorer}}

{{panel:ef-cluster-explorer}}

A principal component is a direction in the logs, and a direction has no sign of its own: multiplying every weight of a component by -1 describes the same direction. The engine fixes the sign by a stated rule, and states the case where no rule can make a component unique.

## The rule, and its band

The engine makes the largest absolute weight in each component positive. The basis states it, in the engine's words:

> in each component the first loading whose absolute value is within 1e-9 (relative) of the largest is made positive (scikit-learn: the largest absolute loading positive)

On the Ekene cored rows, the correlation PCA's first component weighs GR 0.423323, RHOB -0.489083, NPHI 0.541336 and PEF -0.537169. NPHI has the largest absolute weight, so it is positive; PEF is close behind, and far outside the band. A weight within 1.00e-9 of the largest, relative, inclusive, counts as largest too, and the first such weight is made positive.

With two standardised features, the first component's two weights are equal in size, and without the band rounding would pick the "largest". The golden `pca-two-features-sign-tie` builds that case: five rows, (1, 2), (2, 3.5), (3, 3), (4, 6.5) and (5, 5). The first component is (0.707107, 0.707107), its first weight positive, whichever weight came out a few bits larger.

## A repeated eigenvalue

Four stated rows, (1, 0), (-1, 0), (0, 1) and (0, -1), spread equally every way. Their covariance eigenvalues are 0.666667 and 0.666667. Any direction in their plane is as good as any other, so no sign rule can make the components unique. The engine returns the result and warns, in its own words:

> eigenvalues 1 and 2 differ by at most 1e-10 times the largest eigenvalue, so the directions of those components are not unique: the loadings shown are one valid choice

The engine compares each eigenvalue with the next one in the sorted list, and flags the pair when abs(lambda_k - lambda_(k+1)) <= 1.00e-10 x lambda_1, where lambda_1 is the largest eigenvalue. It is inclusive, and it is relative to the largest eigenvalue, never to the pair: a gap of 0.99 of that band is flagged, and a gap of 1.01 is not. On the Ekene cored rows no pair is repeated.

## When the sweeps run out as well

The other pca warning is Jacobi non-convergence: the sweep numbered `maxSweeps` still needed a rotation. When both apply, both are kept, non-convergence first, joined by a semicolon. The golden `pca-warning-both`, with maxSweeps 1:

> Jacobi did not converge in 1 sweep (the last sweep still rotated): the eigenvalues and components shown are those after sweep 1; eigenvalues 1 and 2, 3 and 4 differ by at most 1e-10 times the largest eigenvalue, so the directions of those components are not unique: the loadings shown are one valid choice

Neither is a refusal: each returns the result and says how far to trust it.

## Exercise

Open the cluster explorer on "Principal components" with the cored rows and read the weights of every component; confirm that the largest absolute weight in each is positive. Then replace the table with the four rows above, set the matrix to covariance, and read the eigenvalues and the warning.
