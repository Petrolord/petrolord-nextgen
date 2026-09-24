import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D3 Expert m05, boundaries, bands and caps. Figures from the course's
# boundary table (rule by rule), the tie band, the sign rule and the repeated
# eigenvalue, the pca warnings and the refusal table, the tied starts, the
# elbow's rising inertia and the k-means maxIter warning.

q(1, "Six rows are passed to `kmeans`. Where does the boundary on k sit, by the course's table?",
 "Both 1 and 6 pass; k 0 and k 7 are refused",
 ["k 2 to 5 are accepted; 1 and 6 are refused as trivial",
  "Any k from 0 to 6 is accepted; 0 returns one cluster",
  "k 1 to 5 are accepted; k equal to the rows is refused"],
 "The boundary table: kmeans k, \"1 and n accepted (6 rows, k 6)\", \"0 and n + 1 refused\". A single cluster and one cluster per row are both valid calls; the refusal for k 0 reads \"k must be a whole number from 1 to 180 (the number of rows)\" on the cored rows. The silhouette is the function whose boundary excludes 1 and n, and that rule belongs to it alone.")

q(3, "Two cored rows are each passed twice to `kmeans` with k 3. What does the engine say, and what does it count?",
 "It refuses: 2 distinct rows after scaling, fewer than k = 3, so k-means++ cannot place 3 distinct centres",
 ["Three clusters come back, one of them empty, with a warning that a centre could not move from its row",
  "It refuses naming `k`, since each of the 3 clusters would need at least two of the rows passed to it",
  "Two clusters come back in place of the 3 asked for, and the basis block records the change of k"],
 "The engine's words: \"X has 2 distinct rows after scaling, fewer than k = 3: k-means++ cannot place 3 distinct centres\". The boundary counts distinct rows, after scaling: distinct rows equal to k are accepted, fewer are refused. Four rows are more than 3, so the rows limit is met; the distinct count is what fails. The engine never changes k or returns an empty cluster.")

q(2, "For the silhouette, which numbers of distinct clusters does the boundary accept on n rows?",
 "From 2 to n - 1; both 1 and n are refused",
 ["From 1 to n; one cluster scores 0 on every row",
  "From 2 to n; n clusters score 0 on every row",
  "From 2 to 10000, the most rows it scores in full"],
 "The boundary table: silhouette distinct clusters, \"2 and n - 1 accepted\", \"1 and n refused\". The silhouette compares each row with the next nearest cluster, so one cluster leaves nothing to compare, and n clusters leave every row alone; the refusal on four rows in four clusters reads \"labels must hold from 2 to 3 distinct clusters (found 4)\". 10000 is the row cap for scoring in full, a different rule.")

q(0, "`pca` is passed maxSweeps 0. What comes back, and what happens at maxSweeps 1?",
 "0 is refused; 1 is accepted, and a sweep that still rotates brings a warning",
 ["0 is accepted and read as no limit at all; 1 is refused as too few sweeps to converge",
  "0 returns the unrotated matrix; 1 returns eigenvalues sorted once",
  "Both are refused; the smallest accepted setting is the default 50"],
 "The boundary table: pca maxSweeps, \"1 accepted\", \"0 refused\", with the engine's words \"maxSweeps must be a whole number, 1 or more\". A run whose last allowed sweep still needed a rotation returns its result with a warning, as the golden `pca-warning-both` does at maxSweeps 1. 50 is the default when maxSweeps is left out, never the floor.")

q(3, "The golden `kmeans-assignment-tie-lower-centre` runs one pass on rows (0, 0), (0, 1), (10, 0), (10, 1) and (5, 0) from centres (0, 0) and (10, 0), with no scaling. Which labels come back?",
 "0, 0, 1, 1, 0",
 ["0, 0, 1, 1, 1",
  "0, 1, 0, 1, 0",
  "0, 0, 1, 1, and a refusal for row 4"],
 "Row 4, (5, 0), is equally far from both centres. Squared distances within 1.00e-12 of the smallest, relative, are tied and go to the lower centre, centre 0. The other four rows are each nearest one centre. A tie is settled by the stated rule and never refused.")

q(1, "The golden `agglomerative-grid-ties-ward` clusters (0, 0), (1, 0), (0, 1), (1, 1), (5, 0) and (6, 0) with Ward linkage and no scaling. The first three merges are all at height 1.000000. In what order are they made?",
 "[0, 1], then [2, 3], then [4, 5]: the tied pair with the lowest cluster ids first",
 ["[4, 5] first, as the pair lying farthest from the others, then [0, 1] and [2, 3] after it",
  "[0, 2], then [1, 3], then [4, 5]: the columns of the square before its rows",
  "All three at once, recorded as one row of the linkage matrix of height 1.000000"],
 "The basis: \"merges whose heights are within 1e-12 (relative) of the smallest are tied; the tied pair with the lowest cluster ids wins (the smaller id first, then the other)\". 2 of the 5 merges met a tie. A linkage matrix holds one merge per row, n - 1 rows in all, so no two merges share a row, and distance from other points does not order tied merges.")

q(0, "At k 4, seed 3, 10 starts on the 180 cored rows, starts 3, 5 and 8 all print the inertia 58.289042. Why does start 3 keep the win?",
 "Their largest difference from the winner is 0, inside the band, so they tie and the earliest start keeps it",
 ["Start 3 took the fewest passes of the three, 6, and fewer passes break a tie between starts",
  "Six decimals agree on all three, which the engine reads as equal, and the first printed wins",
  "Start 3's starting rows include row 128, which start 9 also draws, so it was drawn twice"],
 "The basis: \"lowest inertia over the runs; a run within 1e-12 (relative) of the best so far does not replace it\". The course prints the largest difference, 0, before calling them tied; printing alike at six decimals decides nothing. Passes do not break ties: start 5 took 5 passes, fewer than start 3's 6, and still lost. A row that opens two starts plays no part in the rule.")

q(2, "Two figures a report compares print alike at six decimals. When may the report say they tie?",
 "Only where the engine's own comparison says so, such as a tied-vote count or a win kept by an earlier start",
 ["Whenever they print alike at six decimals, since the course prints every figure at that precision",
  "When their difference is below 1.00e-6, the size of the last printed digit at six decimals",
  "Whenever both are distances, as distances within the band of 1.00e-12 always print alike"],
 "Six decimals hide differences far larger than a relative band of 1.00e-12, so a pair can agree at that precision and still fall outside the band. The evidence for a tie is the engine's own comparison: a tied-vote count, a count of tied steps in the merge history, or a win kept by the earlier start. A threshold at the last printed digit is a rule the engine does not use.")

q(1, "The correlation PCA's first component on the cored rows weighs GR 0.423323, RHOB -0.489083, NPHI 0.541336 and PEF -0.537169. Which weight does the sign rule make positive, and why?",
 "NPHI's, the largest in absolute value, with PEF close behind and far outside the 1.00e-9 band",
 ["PEF's, as the log listed last in the column order takes the positive sign in each component",
  "GR's, as the first log is always the one made positive, so a component reads the same in every study",
  "Both NPHI's and PEF's, which lie within the band of each other and so share the positive sign between them"],
 "The basis: \"in each component the first loading whose absolute value is within 1e-9 (relative) of the largest is made positive\". NPHI's 0.541336 is the largest in size, and PEF's weight, -0.537169, falls short of it in size by far more than a relative band of 1.00e-9, so only NPHI counts as largest. One sign is chosen per component, so two weights of opposite sign cannot both be positive, and nothing rests on column position.")

q(3, "The golden `pca-two-features-sign-tie` has five rows, (1, 2), (2, 3.5), (3, 3), (4, 6.5), (5, 5). Its first component is (0.707107, 0.707107). What makes the first weight positive?",
 "The two weights are equal in size, both count as largest inside the 1.00e-9 band, and the first is made positive",
 ["The first feature has the larger variance of the two, and the sign follows the feature with the larger spread",
  "A seeded draw from mulberry32 picks which weight to make positive whenever two weights tie in their size",
  "The engine refuses to sign such a component and returns it as the solver gave it, with a warning attached"],
 "With two standardised features the first component's two weights are equal in size, so which is largest would otherwise be decided by rounding. A weight within 1.00e-9 of the largest, relative, inclusive, counts as largest, and the first such weight is made positive. On a correlation matrix both features have variance 1, and the sign rule draws nothing and warns about nothing.")

q(0, "Four rows, (1, 0), (-1, 0), (0, 1) and (0, -1), give covariance eigenvalues 0.666667 and 0.666667. What does `pca` return?",
 "The result, with a warning that the directions are not unique and the loadings are one valid choice",
 ["A refusal naming `X`, since two equal eigenvalues leave the components undefined for any eigen solver",
  "The result with no warning, since the sign rule already fixes both directions of the plane",
  "A refusal naming `matrix`, as a covariance matrix with a repeated eigenvalue cannot be built"],
 "In the engine's words: \"eigenvalues 1 and 2 differ by at most 1e-10 times the largest eigenvalue, so the directions of those components are not unique: the loadings shown are one valid choice\". A repeated eigenvalue is a warning; the result comes back. The sign rule fixes a sign, and in a plane of equal spread any direction is as good as another, so no sign rule can make the pair unique.")

q(2, "Which test does the engine apply before it warns of a repeated eigenvalue?",
 "abs(lambda_k - lambda_(k+1)) <= 1.00e-10 x lambda_1 for adjacent sorted eigenvalues, inclusive",
 ["abs(lambda_k - lambda_(k+1)) < 1.00e-10 x lambda_k, relative to the larger eigenvalue of the pair itself",
  "Any two eigenvalues, adjacent or not, whose ratio lies within 1.00e-10 of 1, exclusive of it",
  "The same form with 1.00e-12 in place of 1.00e-10, since that is the band the engine uses for every tie"],
 "The repeated test compares each eigenvalue with the next one in the sorted list and flags the pair when abs(lambda_k - lambda_(k+1)) <= 1.00e-10 x lambda_1, the largest eigenvalue: inclusive, relative to the largest, never to the pair. The boundary table shows a gap of 0.99 of that band flagged and 1.01 not. 1.00e-12 is the band for distances and merge heights, one rule among several, and no band is global.")

q(3, "With maxSweeps 1 and a repeated eigenvalue, the golden `pca-warning-both` raises both pca warnings. How does the engine report them?",
 "Both are kept, the non-convergence warning first, joined by \"; \"",
 ["Only the repeated-eigenvalue warning is kept, as it is the more serious",
  "The call is refused, since two warnings together amount to a failure",
  "Both are kept, the repeated-eigenvalue warning first, one per result field"],
 "When both apply the engine keeps both, the non-convergence warning first, joined by \"; \", and returns the result: \"Jacobi did not converge in 1 sweep (the last sweep still rotated): ...; eigenvalues 1 and 2, 3 and 4 differ by at most 1e-10 times the largest eigenvalue, ...\". Warnings never add up to a refusal, and neither one is dropped.")

q(1, "With one start per k and seed 265, the elbow over k 1 to 8 reads an inertia of 45.270437 at k 8 against 45.153181 at k 7. What does the engine return?",
 "Every row of the elbow, k 8 listed in `inertiaRises`, and a warning to raise nInit",
 ["A refusal on kMax, since a rising inertia means k 8 is above what the rows can hold",
  "The elbow up to k 7 only, with k 8 dropped and a note that its run failed to converge",
  "Every row, with k 8's inertia replaced by k 7's so the curve keeps falling"],
 "The engine returns the figures and warns, in its own words: \"inertia rises at k = 8: those runs stopped in a local minimum; raise nInit\". A rise is a result with a warning, never a refusal, and no figure is dropped or overwritten. With the default 10 starts the same seed shows no rise, k 8 at 41.697291.")

q(0, "A k-means call at seed 3, k 4 and maxIter 2 on the cored rows returns `converged` false, `iterations` 2 and inertia 58.432713. Is it a refusal?",
 "No: it is a result with a warning, the labels coming from one more pass against the last centres",
 ["Yes: maxIter below the number of passes needed is refused, naming `maxIter` as its field",
  "No: it is a result with no warning, since `converged` false already carries the whole message",
  "Yes: the engine refuses any start that has not converged and asks the caller to allow it more passes"],
 "The engine's warning: \"did not converge in 2 assignment passes: the labels printed come from one more pass against the last centres\". A run stopped at maxIter is a result, never a refusal; the only maxIter refusal is for a value below 1. The labels still come back, one per row.")

emit(Q, '/root/dai-wip-facies/banks/d3a_m05.json', expect_n=15)
finish()
