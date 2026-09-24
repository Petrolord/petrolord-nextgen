import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D3 Associate m04, k-means.
# Sources: the course digest's k-means++ seeding for seed 3 (first draw, the
# four starting rows), the Lloyd pass trace, the run stopped at maxIter 2, the
# assignment tie rule, the one-start centres, the ten starts of seed 3, one
# start against ten seed by seed, and the kmeans refusals. Every figure is
# printed there.

q(2, "What rule places a row in a k-means cluster?",
 "The row joins the cluster whose centre is nearest on the scaled logs.",
 ["Each row joins the cluster of the row nearest to it, so clusters grow outward one neighbour at a time.",
  "The cluster whose centre has the closest gamma ray.",
  "Rows go to clusters in depth order, k at a time, and the centres are averaged afterwards."],
 "Every row belongs to the cluster whose centre is nearest, by Euclidean distance on the scaled features, where every log counts. Joining the nearest single row is another method, GR alone is one log of four, and depth is no feature in the call."),

q(0, "A row sits equally near two k-means centres. Where does the engine put it?",
 "In the cluster with the lower centre number, so the same rows always give the same labels.",
 ["In whichever cluster the seed's next mulberry32 draw picks, so the tie is broken at random each time.",
  "Both clusters at once, and the row counts twice in the inertia, once against each of the two centres.",
  "The engine refuses the call and names the tied row."],
 "The basis reads that squared distances within 1e-12 (relative) of the smallest are tied and go to the lower centre index. The rule is stated so the labels are repeatable: nothing is drawn, no row counts twice, and a tie is no refusal."),

q(3, "`kmeans` is asked for 0 clusters of the 180 cored rows, and in a second call for three clusters of two rows. What limit do the two refusals name?",
 "The number of rows passed: 1 to 180 in the first call, 1 to 2 in the second.",
 ["The number of logs, 1 to 4, in both calls, since each centre needs one log of its own.",
  "Distinct rows after scaling, which the engine counts before it checks anything else.",
  "A fixed ceiling on clusters stored in the engine, the same whatever table is passed."],
 "k counts clusters, so it must lie from 1 to the number of rows, and the engine names the limit it applied: \"k must be a whole number from 1 to 180 (the number of rows)\" and \"k must be a whole number from 1 to 2 (the number of rows)\". The count of distinct rows is a separate refusal, met when rows repeat, and no fixed ceiling or log count enters k's limit."),

q(1, "For seed 3 on the 180 cored rows the first draw of mulberry32 is u = 0.720227. Which row becomes the first k-means++ centre?",
 "Row 129, which is floor(0.720227 x 180).",
 ["130, rounding 0.720227 x 180 to the nearest row",
  "The last of the four starting rows drawn for seed 3, row 11",
  "Always the first row, row 0, whatever u is"],
 "The first centre is row floor(u x n): floor(0.720227 x 180) is 129, counting rows from 0. The rule floors the product and does not round it, and row 11 is the last of the four drawn, after 129, 5 and 79."),

q(2, "After the first k-means++ centre, how is each later centre drawn?",
 "With probability proportional to D squared, the squared distance to the nearest centre already chosen.",
 ["As the row farthest from every chosen centre, taken with certainty whatever the seed draws next.",
  "Uniformly from the rows not yet chosen, so every remaining row has the same chance at each step.",
  "Several candidates are drawn at each step and the one lowering the inertia most is kept."],
 "The basis reads: u x sum D^2 picks the first row whose running sum of D^2 is above it, one candidate per step, from one mulberry32(seed) stream. A far row is likely to be drawn, and the draw u still decides which row it is. Keeping the best of several candidates is what some other tools do, and the engine draws one."),

q(0, "A learner runs k-means with seed 3 in another tool and gets starting rows different from the engine's 129, 5, 79 and 11. What is the likeliest reason the course gives?",
 "The engine draws one candidate per step from mulberry32, and other tools can seed differently.",
 ["One of the two tools has a defect, since a seed fixes the starting rows in every tool alike, whatever generator it uses.",
  "The rows were scaled with the sample standard deviation in one tool, which moves row numbers.",
  "k-means++ starts at a row picked by the core facies, which the other tool did not read."],
 "The engine's k-means++ takes one candidate per step from one mulberry32(seed) stream, a stated choice, so its starting rows can differ from another tool's at the same nominal seed. A seed fixes the draw only within one generator and one rule. Scaling never renumbers rows, and core plays no part in the draw."),

q(3, "Two cored rows are passed twice each to `kmeans` with k 3. Which reply comes back?",
 "A refusal: \"X has 2 distinct rows after scaling, fewer than k = 3: k-means++ cannot place 3 distinct centres\".",
 ["A result with three clusters, one of them empty, and a warning that a centre could not be placed.",
  "Refused as \"k must be a whole number from 1 to 2 (the number of rows)\", counting the four rows passed.",
  "Two clusters and a note that k was lowered to the number of distinct rows the table holds."],
 "k-means++ needs k distinct rows to place k distinct centres, and the count is taken after scaling, on the rows as the engine will cluster them. Four rows were passed, so the row limit is not what is breached. A refusal returns no clusters, and the engine lowers nothing on its own."),

q(1, "In one Lloyd pass, what happens, and in what order?",
 "Every row is assigned to its nearest centre, then each centre moves to the mean of its rows.",
 ["Each centre moves to its median row, then the rows farthest from every centre are dropped.",
  "The centres are redrawn by k-means++ from the next seed, and the rows are reassigned to them.",
  "One row at a time moves to the cluster that lowers the inertia most, until no row can move."],
 "A Lloyd pass assigns every row, then moves every centre to the mean of its rows, since the mean is the point with the smallest sum of squared distances to them. The starting centres are drawn once per start and never redrawn. No row is dropped, and rows are reassigned together, never one at a time."),

q(2, "The one-start run from seed 3 took 5 passes. Its trace shows 180, 15, 1, 1 and 0 rows changing cluster. Why is the fifth pass counted?",
 "`iterations` counts assignment passes, the confirming pass that changed nothing included.",
 ["It is no pass: the engine reports 5 because it counts centre moves, and there were five.",
  "The fifth pass is where the engine redraws the centres to confirm that the run has settled.",
  "Passes are counted from 0, so the fifth line in the trace is reported as pass 4."],
 "The run stops when an assignment pass returns the labels of the pass before, and the basis reads that iterations counts assignment passes (scikit-learn n_iter_). The confirming pass changed 0 rows and is counted. Counting centre moves would give a different number for the same run."),

q(0, "The same seed 3 start is stopped with `maxIter` 2. What comes back?",
 "A result with `converged` false, inertia 58.432713 and a warning about the unconverged passes.",
 ["A refusal naming `maxIter`, since 2 passes are too few for any k-means run to settle.",
  "The fully converged result, inertia 58.330411, because the engine runs on until the labels stop.",
  "Its result after pass 2, inertia 61.215752, with `converged` true because the labels were printed."],
 "A run stopped at maxIter is a result with a warning, never a refusal. The labels are assigned once more against the last centres, so the inertia is 58.432713, the full run's pass 3 figure. The engine's own words: \"did not converge in 2 assignment passes: the labels printed come from one more pass against the last centres\". A limit is a limit, so 58.330411 is not reached."),

q(3, "A learner sets the most passes of a k-means start, `maxIter`, to 0. How does the engine answer?",
 "\"maxIter must be a whole number, 1 or more\"",
 ["A result from the starting centres alone, with a warning that no pass ran",
  "It uses the default of 300 passes, since 0 means the setting was left out",
  "\"nInit must be a whole number, 1 or more\", because passes and starts share a limit"],
 "A cap of 0 is refused by naming `maxIter`. A cap of 1 is accepted and never converges, since the first pass cannot return the labels of a pass before. The default of 300 applies only when maxIter is left out, and the nInit refusal is for no starts."),

q(2, "What is the inertia of a k-means result?",
 "The sum of the squared distances from each row to its own centre, on the scaled logs.",
 ["Mean distance from each row to its own centre, in the log units of GR, RHOB, NPHI and PEF.",
  "Rows that changed cluster on the last pass, counted, zero once converged.",
  "The squared distance between the two nearest centres, which measures how well they separate."],
 "The basis reads: sum of squared distances of the rows to their centres, on the scaled features. It is a sum of squares, measured in the space the clustering was made in, so with standard scaling it is in standard units. It counts no rows and compares no centres."),

q(1, "From seed 3 on the 180 cored rows, one start ends at inertia 58.330411 and ten starts at 58.289042. What does the lower figure establish?",
 "A tighter fit of the same rows, logs, scaling and k; it says nothing yet about rock types.",
 ["The ten-start clusters match the core facies better, since a lower inertia means purer clusters.",
  "Their difference is rounding, so the two runs found one partition printed in two ways.",
  "The ten-start run used more rows, and the extra rows lowered the sum of squared distances."],
 "A lower inertia is a better fit of the same k and nothing in it comes from core. The two figures belong to two different partitions: one start settled into a slightly looser arrangement. Both runs cluster the same 180 cored rows."),

q(3, "With seed 3 and ten starts, starts 3, 5 and 8 all print the inertia 58.289042. Which start does the engine report as the winner?",
 "Start 3, the earliest of them.",
 ["The last to reach the lowest figure, start 8",
  "Start 5, whose 5 passes are the fewest of the three",
  "All three share the win, as their inertias print alike"],
 "The basis reads: lowest inertia over the runs; a run within 1e-12 (relative) of the best so far does not replace it. So a later start that only ties the best so far keeps the earlier one in place, and start 3 wins. Passes play no part in the choice, and one start is reported."),

q(1, "Across seeds 1 to 10 on the cored rows, one start stops above 58.289042 for 8 seeds; ten starts reach it for 9 seeds, and seed 5 stops at 58.297079. What does the course take from this?",
 "More starts make a poor stop less likely without ruling it out, so a result carries its seed and starts.",
 ["Ten starts always find the lowest inertia, and seed 5 must have been run with one start by mistake.",
  "The seed decides nothing once ten starts are used, so the seed can be dropped from a write-up.",
  "One start is enough, since 58.330411 and 58.289042 describe the same partition of the rows."],
 "Ten starts from seed 5 all missed 58.289042, so more starts do not guarantee the lowest arrangement, and the seed still decides the result. 58.330411 and 58.289042 are two different partitions. A k-means result is quoted with its seed and number of starts: k 4, seed 3, 10 starts, inertia 58.289042."),

emit(Q, '/root/dai-wip-facies/banks/d3b_m04.json', expect_n=15)
finish()
