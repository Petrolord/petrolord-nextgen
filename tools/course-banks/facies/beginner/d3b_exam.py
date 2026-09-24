import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D3 Associate final exam, 42 questions across all six modules.
# Sources: the course digest's function table and stated defaults, what the
# engine does not build, the Ekene generator and planted structure, the
# Associate refusals, the raw and scaled distances of the first four rows, the
# scaler tables, the correlation and covariance PCA, loadings and scores,
# pcaTransform, k-means++ seeding, the Lloyd trace, the ten starts, one start
# against ten, centres in log units, the seed 1 pairing, assignClusters on
# EKENE-7, Fisher's iris, the workflow and write-up tables, and the vocabulary
# table. Every figure is printed there. Questions marked X need two modules.

# m01 and the engine's frame
q(1, "A script calls `kmeans` and leaves out both `nInit` and `maxIter`. What does the engine run?",
 "Ten k-means++ starts, each capped at 300 assignment passes.",
 ["One start, capped at 50 passes, since each setting left out falls to its smallest value.",
  "A refusal naming `nInit`, since the number of starts has no default in this engine.",
  "As many starts as there are rows, each allowed to run until its labels stop changing."],
 "The exported DEFAULTS give KMEANS_N_INIT 10 and KMEANS_MAX_ITER 300, so leaving both out runs ten starts of at most 300 assignment passes each. 50 is the default number of Jacobi sweeps in pca. The seed has no default and is refused when missing, but nInit and maxIter both do."),

q(3, "A colleague asks the engine to fit a self-organising map to the Ekene logs. What does the course say?",
 "The engine builds none; its clustering here is k-means, named by what it is.",
 ["It fits one with seed 3 and ten starts, the same settings as the teaching clustering.",
  "A map is built from the first two principal components, which the engine calls its map.",
  "It returns the map with a warning, since a map needs more rows than the 180 cored ones."],
 "The engine's exports hold no self-organising map, no Gaussian mixture, no density clustering, no forest, no boosting and no neural network. A PCA is a set of components and no map. A method the engine does not build returns nothing at all, warning or otherwise."),

q(0, "The Ekene generator lets each sample keep the facies of the sample above with probability 0.8. What does that plant in the wells?",
 "Facies in blocky runs down each well, as beds come.",
 ["Exactly 80 percent of each well in one facies, the rest scattered.",
  "A facies that changes at every fifth sample, on a fixed rhythm.",
  "Four facies in equal shares, 45 rows of each, in every cored well."],
 "A sample keeps the facies above it with probability 0.8 and otherwise draws one at random, so facies come in blocky runs. The shares are not fixed: the cored rows count 54 limestone, 50 sandstone, 29 shale and 47 shaly-sand. A probability sets no rhythm and no exact percentage."),

q(2, "Which bound does the Ekene generator hold exactly between limestone and the other three facies?",
 "Limestone NPHI at or below 0.12 and the others at or above 0.13; limestone PEF at or above 4.2 and the others at or below 3.9.",
 ["GR below 28 gAPI for limestone and above it for every other facies, so gamma ray alone isolates limestone.",
  "A density above 2.64 g/cm3 on every limestone sample, which no other facies ever reaches.",
  "Caliper above 8.5 in on limestone, since those intervals were drilled in a wider hole than the rest."],
 "The generator states two held bounds, on NPHI and on PEF, and no other. GR is drawn from overlapping normals, limestone around 28 gAPI with an SD of 7 and sandstone around 45 with an SD of 9. Cored row 129, a limestone, reads a RHOB of 2.629000, below 2.64. CALI is drawn the same way whatever the facies."),

q(3, "In what order does every list the engine returns put the four facies?",
 "Limestone, sandstone, shale, shaly-sand.",
 ["By cored row count, largest first: limestone, sandstone, shaly-sand, shale.",
  "Sandstone, shaly-sand, shale, limestone, rising in gamma ray.",
  "The order each facies first appears down EKENE-1, sandstone first."],
 "Names sort by character, so every list the engine returns reads limestone, sandstone, shale, shaly-sand. The counts, the gamma ray and the order of appearance in a well play no part in the sort."),

q(1, "Which of the five Ekene channels is drawn the same way whatever the facies of the sample?",
 "CALI, 8.5 in plus the size of a normal draw with SD 0.35 in.",
 ["PEF, which the generator draws around one mean for every facies.",
  "GR, since a gamma ray reading reflects the tool more than the rock.",
  "RHOB, since all four facies share one density of 2.39 g/cm3 here."],
 "The generator draws GR, RHOB, NPHI and PEF from each facies' own normal distribution, and CALI independently of the facies and of every other log. So CALI carries no facies signal. PEF ranges from a mean of 1.9 in sandstone to 4.9 in limestone, and 2.39 g/cm3 is shaly-sand's density mean alone."),

# X m01 + m02
q(2, "Row 0 (sandstone) lies 10.905782 from row 6 (shaly-sand) on the raw logs and 1.048512 on the standardised logs. What happens to GR's share of the squared distance?",
 "It falls from 0.998940 raw to 0.105267 scaled, so the other three logs now carry most of it.",
 ["Near 0.998940 still, because scaling divides every log by the same number and keeps the shares.",
  "Up to 1.000000 once scaled, since standardising removes the other logs' contribution.",
  "Not computable on the scaled logs, where a distance no longer splits log by log."],
 "The course prints GR's share of the squared distance from row 0 to row 6 as 0.998940 raw and 0.105267 scaled. Standardising divides each log by its own population SD, so shares change, and a scaled distance still adds one squared term per log."),

# X m01 + m02
q(0, "After standard scaling, row 13 (limestone) reads -0.907306, 1.417239, -1.358543 and 1.423243 on GR, RHOB, NPHI and PEF; row 0 (sandstone) reads -0.248777, -1.335619, 0.328781 and -1.140162. Which logs put row 13 far from row 0 on the scaled logs?",
 "RHOB, NPHI and PEF; GR supplies only 0.024880 of that squared distance.",
 ["GR alone, which supplies 0.976184 of the squared distance between the two rows.",
  "Every log in equal measure, since scaled logs all have a population SD of 1.",
  "NPHI alone, as its scaled readings differ in sign between the two rows."],
 "The scaled distance from row 0 to row 13 is 4.174924, and GR's share of its square is 0.024880; RHOB, NPHI and PEF differ by well over one standard unit each. 0.976184 is GR's share of the RAW distance. Equal spread on the fitted rows says nothing about how far two particular rows differ on each log."),

q(1, "Of the first shaly-sand (row 6), limestone (row 13) and shale (row 28) of the cored rows, which lies nearest to row 0, the first sandstone?",
 "Row 6, on both scalings: 10.905782 raw and 1.048512 on the standardised logs.",
 ["On the raw logs row 13, and row 28 once scaled, as scaling reverses the whole order of the three.",
  "The shale, row 28, whose NPHI is nearest row 0's.",
  "Limestone row 13, since limestone and sandstone share the lowest gamma ray readings."],
 "From row 0 the raw distances are 10.905782 to row 6, 21.355833 to row 13 and 58.419443 to row 28; the scaled ones 1.048512, 4.174924 and 3.333330. Row 6 is nearest either way. Scaling swaps the limestone and the shale, and row 6's NPHI, 0.221000, is the closest to row 0's 0.225000, with row 28's at 0.328000. Row 13's GR of 27.800000 is far below row 0's 48.900000."),

# m01/m03 refusals
q(3, "`pca` is passed four logs named GR, RHOB, GR and PEF. What does the engine reply, in its own words?",
 "\"names[2] repeats the name GR\"",
 ["A result in which the second GR column is dropped before the correlation matrix is built",
  "\"nComponents must be a whole number from 1 to 4 (the number of features)\"",
  "\"X.GR has zero variance on the 180 rows passed\", treating both columns as one log"],
 "The engine refuses a repeated name by naming the entry, names[2], and saying which name it repeats. It drops no column on its own, and the nComponents and zero-variance refusals are for a component count out of range and for a constant log."),

q(2, "`kmeans` is called with `scale: 'robust'`. What does the engine reply?",
 "\"scale must be 'standard', 'minmax' or 'none'\"",
 ["A result scaled by the median and quartiles, with a note in the basis block",
  "Standard scaling, the default it falls back on for an unknown setting",
  "\"matrix must be 'correlation' or 'covariance'\""],
 "k-means offers three scalings, standard (the default), min-max and none, and refuses anything else by naming `scale`. It never falls back silently, and the matrix refusal belongs to pca, whose setting chooses between two matrices."),

q(1, "`kmeans` is given starting centres through `init` and asked for five starts. What does the engine reply?",
 "\"nInit must be 1 (or left out) when init gives the starting centres\"",
 ["Five starts, each beginning from the given centres and ending at the same inertia",
  "It keeps the given centres for the first start and draws four more from the seed",
  "\"nInit must be a whole number, 1 or more\""],
 "Given centres fix the start, so further starts would repeat it, and the engine refuses the call by naming `nInit`. It does not mix given and drawn centres. The \"1 or more\" message is the refusal for no starts."),

# X m01 + m04
q(0, "Why does the engine refuse a `kmeans` call without a seed, or with a negative one?",
 "Its starting rows are drawn from one seeded stream, so the seed makes the run repeatable anywhere.",
 ["A seed is a security check, and a negative one marks a call from outside the platform.",
  "Without a seed the starts would all begin at row 0 and every run would stop at one clustering.",
  "The seed sets k when k is left out, so a missing seed leaves the number of clusters unknown."],
 "k-means++ draws its starting rows from one mulberry32(seed) stream, so the same rows and the same seed draw the same starting rows on any machine: 129, 5, 79 and 11 for seed 3 on the cored rows. The message, \"seed must be a whole number from 0 to 4294967295\", is the same for a missing and a negative seed. The seed never sets k."),

# X m03 + m05
q(3, "What do `pcaTransform` on EKENE-7 and `assignClusters` on EKENE-7 have in common?",
 "Both apply parameters fitted on the cored rows to the new rows and refit nothing.",
 ["Both refit their scaler on EKENE-7, so its rows are measured against their own mean.",
  "Each one returns a facies for every EKENE-7 row, read from the cored wells' core.",
  "EKENE-7's core is needed by each of them."],
 "pcaTransform scores new rows with the fitted centre, scale and components; assignClusters scales them with the fitted scaler and places each at the nearest fitted centre. Neither refits, and neither returns a facies: EKENE-7 has no core, and a cluster carries no facies name until it is matched against core."),

q(2, "A correlation near zero means two logs move almost independently. Among the four Ekene logs on the cored rows, which pair comes nearest to that?",
 "GR and RHOB, at -0.192943",
 ["NPHI and PEF, at -0.622647, the most negative entry",
  "GR and PEF, at -0.340082, gamma ray against photoelectric factor",
  "RHOB and NPHI, at -0.502728, the density against the neutron"],
 "A correlation near zero means two logs move almost independently, and GR against RHOB, at -0.192943, is the entry nearest zero. The other three are larger in size: -0.340082, -0.502728 and -0.622647. A negative sign measures direction and says nothing about weakness."),

q(1, "What is the most Jacobi sweeps `pca` takes when `maxSweeps` is left out, and what does it do with `maxSweeps` 0?",
 "50 sweeps by default; 0 is refused: \"maxSweeps must be a whole number, 1 or more\".",
 ["300 sweeps by default, the k-means pass limit, and 0 means sweep until converged.",
  "Six sweeps always, the number the Ekene matrix needed, and 0 is read as that default.",
  "No limit at all, and 0 returns the unrotated matrix with a warning beside it."],
 "The exported DEFAULTS give JACOBI_MAX_SWEEPS 50, and maxSweeps must be a whole number 1 or more. The Ekene correlation matrix converged in 6 sweeps, which is its own count. 300 is KMEANS_MAX_ITER, a different limit."),

q(0, "On the correlation form, all four logs load positive on PC2 (0.687603, 0.559145, 0.379277 and 0.415002). Which row scores high on PC2?",
 "A row reading higher on every log at once.",
 ["One reading high GR and NPHI with low RHOB and PEF.",
  "A row whose PC1 score is also high, as the two agree.",
  "The row with the largest GR alone, since GR loads most."],
 "With every loading positive, a row high on all four logs scores high on PC2. High GR and NPHI with low RHOB and PEF describes a high PC1 score. PC1 and PC2 are separate directions, so a high PC1 score fixes nothing about PC2, and PC2 draws on all four logs."),

# X m03 + m05
q(3, "Two analysts report that PC1 of the Ekene cored logs carries 0.682351 and 0.998581 of the variance. Both ran the engine correctly. What separates their results?",
 "The matrix: 0.682351 is the correlation form, 0.998581 the covariance form.",
 ["How many components were kept, since keeping one component gives it all the variance.",
  "Which divisor the clustering scaler used, population for one and sample for the other.",
  "Seeds: principal components depend on the seed, as the k-means starts do."],
 "The correlation form, the engine's default, standardises each log and PC1 carries 0.682351; the covariance form keeps each log's unit, and GR's spread lets PC1 carry 0.998581. The ratio is taken over all four components whatever is kept, the clustering scaler plays no part in pca, and pca draws nothing at random."),

q(2, "On the covariance matrix of the Ekene cored logs, PC2 has a PEF weight of 0.994192 and carries 0.001415 of the variance. How does the course read it?",
 "Almost PEF alone, since PEF has the next largest variance in its own units after GR.",
 ["A blend of all four logs, each with a positive loading, like PC2 on the correlation form.",
  "The shale direction, because PEF separates the shale from the other three facies best.",
  "Strongest of all the components, since its weight of 0.994192 is close to one."],
 "The covariance diagonal gives PEF 1.636367 after GR's 1032.370110, far above RHOB's 0.018860 and NPHI's 0.009384, so the second covariance component is almost PEF alone. A weight near one says the direction lies along one log, and a share of 0.001415 is tiny. No component names a facies."),

q(1, "PC1's weights on the correlation form are 0.423323, -0.489083, 0.541336 and -0.537169. What holds for their squares?",
 "They add to 1, because a component is a unit vector.",
 ["They add to 2.729404, PC1's eigenvalue, the variance along it.",
  "Their sum is 0.682351, the share of variance PC1 carries.",
  "The squares add to 4, one for each standardised log."],
 "A component is a unit vector, one weight per log with squares summing to 1. The eigenvalue 2.729404 enters only when a weight is turned into a loading, weight x sqrt(eigenvalue). 0.682351 is the eigenvalue over 4.000000, and 4 is the sum of the eigenvalues."),

q(0, "On PC2 of the correlation form the weights are GR 0.655151, RHOB 0.532756, NPHI 0.361377 and PEF 0.395416. Which weight does the engine's sign rule make positive?",
 "GR's 0.655151, the largest in absolute value.",
 ["NPHI's 0.361377, the log PC1 is led by.",
  "PEF's 0.395416, as the last log passed.",
  "RHOB's 0.532756, whose PC1 weight is negative."],
 "The engine fixes each component's sign so that its largest absolute weight is positive, and on PC2 that is GR's 0.655151. The rule reads PC2's own weights, where GR's is the largest by a clear margin, and PC1's signs play no part. Here every PC2 weight happens to be positive as well."),

# X m02 + m03
q(3, "Row 0's standard score on GR is -0.248777 and its PC1 score 1.334633. Which standard deviation does each use to standardise the logs?",
 "The clustering scaler uses the population SD (n); the correlation PCA the sample SD (n - 1).",
 ["Both use the population SD, since the engine standardises every log with one scaler.",
  "Both use the sample SD, the divisor n - 1 being the usual statistical convention for any sample of data.",
  "The PCA uses the range of each log, and the clustering scaler the sample SD (n - 1)."],
 "The clustering scaler's basis names the population SD per feature; the correlation PCA's basis names features standardised with the SAMPLE SD (n - 1), so each score variance equals its eigenvalue. On 180 rows the two differ by the factor 1.002789. The range belongs to min-max scaling."),

# X m03 + m05
q(2, "EKENE-7's first three rows score -2.713199, -2.491550 and -2.226124 on PC1 of the model fitted on the cored rows. What may be written about them?",
 "They sit at the end of PC1 where GR and NPHI are low and RHOB and PEF high, with no rock named.",
 ["Limestone, since a low PC1 score is the limestone response of the cored rows.",
  "No comparison with the cored rows' scores holds, since pcaTransform gives EKENE-7 its own axes.",
  "Their PC1 scores are unreliable, since EKENE-7 was not part of the fit."],
 "By the PC1 loadings, GR and NPHI positive and RHOB and PEF negative, a low PC1 score means low gamma ray and neutron with high density and photoelectric factor. That describes logs; which rock it is stays unsaid until something is checked against core. Scoring new rows with the fitted model is what pcaTransform is for, and it keeps one frame for every well, so the new scores sit on the cored rows' axes."),

q(1, "Cored row 0 is passed back through `pcaTransform` with the four-component model. How does its projected score compare with its fitted score?",
 "They are the same numbers, bit for bit: 1.334633, -1.203214, 0.049295, 0.066007.",
 ["They differ slightly, since projection rounds the centre and scale to six decimals.",
  "The projected score is refitted on row 0 alone, and so it comes out as zeros.",
  "Close but not equal, as projection uses the population SD and the fit the sample SD."],
 "Over all 180 cored rows and all four components the largest difference between a projected and a fitted score is 0. pcaTransform uses the fitted centre, scale and components exactly, so a fitted row gets its fitted score. Nothing is rounded or refitted, and both use the correlation form's parameters."),

q(0, "For seed 3, k-means++ draws starting rows 129, 5, 79 and 11: a limestone, a sandstone, a shale and a shaly-sand. What does that say?",
 "The draw happened to land on one row of each facies; core played no part and another seed need not do the same.",
 ["k-means++ reads the core facies and draws one starting row from each, so every seed does the same.",
  "Seed 3 was chosen by the course because it is the only seed whose starting rows cover all four facies.",
  "The four starting rows fix the final clusters, so the teaching clustering is one facies per cluster."],
 "The draw uses D squared on the scaled logs and no core, so landing on one row of each facies is how these draws fell. The starting rows begin the Lloyd passes and do not fix where they end: with ten starts the winning start of seed 3 began at 128, 90, 126 and 167. No cluster takes a facies name until it is matched against core."),

q(3, "The one-start run from seed 3 prints an inertia after each assignment pass: 105.839909, 61.215752, 58.432713, 58.384442 and 58.330411. What does the trace show?",
 "The inertia fell at every pass here, quickly at first, then by small steps.",
 ["It rose between passes 3 and 4, so the run should have been stopped at pass 3, before the rise.",
  "The run needed 300 passes, and only the first five are shown.",
  "Each pass moved the same number of rows, as the inertia fell by a steady step from one pass to the next."],
 "The inertia never rose from one pass to the next in this run; it dropped from 105.839909 to 61.215752 and then by small steps to 58.330411. The run stopped after 5 passes, when a pass returned the labels of the pass before. The rows changing cluster were 180, 15, 1, 1 and 0."),

# X m04 + m05
q(2, "One start from seed 3 gives clusters of 54, 56, 30 and 40 rows; the teaching clustering (seed 3, ten starts) gives 29, 59, 54 and 38. What does the difference show?",
 "The one-start run settled in another partition, at inertia 58.330411 against 58.289042.",
 ["The same partition, numbered differently, as happens between seed 3 and seed 1.",
  "Rounding: sizes that close would agree if both runs printed their sizes and inertias to more decimals.",
  "One-start sizes are in standard units, the ten-start ones in rows."],
 "Sizes of 54, 56, 30 and 40 rows cannot be the clusters of 29, 59, 54 and 38 under other numbers, so the two runs grouped the rows differently, and their inertias differ, 58.330411 against 58.289042. Seed 1 with ten starts reproduces the teaching grouping exactly. Sizes are counts of rows in both runs."),

q(1, "With seed 5 and ten starts, k-means on the cored rows ends at 58.297079, above the 58.289042 that nine other seeds reach. How is that figure treated?",
 "As a valid result of that call, which is quoted with its seed and starts to be reproducible.",
 ["As a defect of the engine, since ten starts are guaranteed to reach the lowest inertia.",
  "58.289042 in fact, since two inertias this close describe the same partition.",
  "A failed run, which the engine should have refused and reported with a warning."],
 "With ten starts, 9 of the 10 seeds reach 58.289042 and seed 5 stops at 58.297079. More starts make a poor stop less likely and do not rule it out. The figure is a result of that call, and two figures that differ at the second decimal are different results."),

q(0, "With one start, seed 5 stops at inertia 78.775612 with clusters of 32, 96, 30 and 22 rows. What marks this as a poor stop?",
 "One cluster holds 96 of the 180 rows, and the inertia sits far above 58.289042.",
 ["Nothing: 78.775612 is the lowest inertia any one-start run reaches on these rows.",
  "Its four sizes add to more than 180, showing that some rows sit in two clusters.",
  "The run was refused for its seed, and the sizes are those of the default seed."],
 "The one-start figure 78.775612, shared by seeds 5 and 7, is the highest printed in the seed table, and the teaching clustering sits at 58.289042 with sizes 29, 59, 54 and 38. The sizes 32, 96, 30 and 22 add to 180. Seed 5 is a valid seed, and nothing was refused."),

q(3, "Of the ten starts from seed 3, how many print the inertia 58.330411?",
 "Three: starts 0, 2 and 9",
 ["One, start 0, the one-start run of seed 3",
  "Six, the number of distinct inertias the ten starts print",
  "Four, starts 1, 4, 6 and 7, each above 75"],
 "The starts table prints 58.330411 for starts 0, 2 and 9, and 58.289042 for starts 3, 5 and 8. The ten starts print 6 distinct inertias, and starts 1, 4, 6 and 7 stop far up, between 75.958349 and 78.982664."),

# X m04 + m06
q(2, "k-means on the raw iris measurements ends at 78.851441 and the teaching clustering of the Ekene logs at 58.289042. What can be said by setting the two side by side?",
 "Nothing about which fits better: one is in squared cm on flowers, the other in squared standard units on logs.",
 ["The Ekene clustering is tighter, since its inertia is lower by a clear margin.",
  "The iris clustering is better, having only 3 clusters to the Ekene field's 4.",
  "They agree, since both runs use seed 3 and ten starts and so share one scale."],
 "An inertia is measured in the space the clustering was made in: iris raw, in squared centimetres over 150 flowers; Ekene standard scaled, in squared standard units over 180 rows and four logs. Different rows, units and k make the two incomparable. A shared seed and number of starts fix the draws, never the units."),

# X m02 + m05
q(1, "EKENE-7's highest PEF scales to 1.035264 under the cored rows' min-max scaler, while its largest distance to an assigned centre, 1.164413, sits below the cored rows' largest, 1.168721. What do the two checks say together?",
 "PEF leaves the cored range on at least one EKENE-7 row, yet each EKENE-7 row lies within the cored rows' largest centre distance.",
 ["They contradict each other, so one of the two scalers must have been refitted on EKENE-7.",
  "EKENE-7 is outside the clustering on every log, as both figures are above 1.",
  "Both say EKENE-7 matches the cored wells exactly, since each figure is close to 1."],
 "Min-max clips nothing, so 1.035264 shows a PEF above anything in the cored wells; the other logs stay between 0 and 1. The distance check runs on the standard-scaled logs, where 1.164413 is below 1.168721. The two checks measure different things and both use scalers fitted on the cored rows; neither says a well matches exactly."),

q(0, "Where does `assignClusters` place EKENE-7's first row, at 6565 ft, under the teaching clustering?",
 "In cluster 2, at a distance of 0.365418 standard units from its centre.",
 ["Cluster 3, the only cluster that no cored row of EKENE-6 reaches, by the nearest centre rule.",
  "Nowhere: an uncored row is refused until its facies is known.",
  "Cluster 1, which takes 19 of EKENE-7's 30 rows."],
 "The course prints EKENE-7's first row in cluster 2 at a distance of 0.365418. Cluster 1 does take 19 rows, and the first row is not among them. No EKENE-7 row goes to cluster 3, though cored row 150 of EKENE-6 sits in it, and placing an uncored row needs its logs alone."),

q(3, "Under the teaching clustering, the first rows of EKENE-3 and EKENE-5 (rows 60 and 120) sit in cluster 2 and the first row of EKENE-6 (row 150) in cluster 3. Where is the cluster of any cored row read?",
 "In `labels`, one cluster per clustered row, in row order counted from 0.",
 ["`centresOriginal`, which lists each row with the centre it was placed at.",
  "The basis block, which names every row's cluster in plain words.",
  "Its starts table, whose starting rows name the clusters."],
 "`labels` holds one cluster per clustered row, in row order, so row 150 reads cluster 3. centresOriginal holds the four centres in log units, the basis names the conventions, and the starts table lists each start's starting rows, passes and inertia."),

# X m03 + m06
q(2, "On the correlation matrix the iris flowers give eigenvalues 2.918498, 0.914030, 0.146757 and 0.020715. What do they add to?",
 "4.000000 at six decimals, the number of measurements, as each standardised one has variance 1.",
 ["150, one for each flower, as each flower adds one unit of variance to the correlation total.",
  "3, the number of species, since the eigenvalues of a correlation matrix count the groups in it.",
  "4.228242, the first eigenvalue of the covariance form."],
 "The correlation form's basis states that the eigenvalues sum to the number of features, and the four iris eigenvalues add to 4.000000 at six decimals, as the Ekene ones do. Eigenvalues count no flowers and no species, and 4.228242 belongs to the covariance form."),

q(1, "Which copy of Fisher's iris data does the engine check itself against?",
 "The file scikit-learn ships: 150 flowers, four measurements in cm, three species.",
 ["A copy the Ekene generator draws on seed 20260924, so it matches the field's scale.",
  "Fisher's 1936 printed table, typed in by hand.",
  "Only the first 50 flowers, a single species."],
 "The vendored copy is the file scikit-learn ships, from Fisher, 1936, Annals of Eugenics, volume seven: 150 flowers, sepal_length, sepal_width, petal_length and petal_width in cm, three species. The Ekene generator draws only the Ekene wells, and the check uses all 150 flowers."),

q(0, "Which sentence follows the course's rule for the words standard deviation?",
 "Clustering scale for GR: 32.041141 gAPI, with divisor n.",
 ["GR's standard deviation is 32.041141 gAPI, which every tool reports the same way.",
  "The standard deviation of GR is 32.130517 gAPI on the cored rows, the figure k-means scales by.",
  "Each log's standard deviation is 1 after scaling, whichever rows the scaler was fitted on."],
 "The course legislates that a standard deviation names its divisor: the clustering scaler uses the population SD (n) and the correlation PCA the sample SD (n - 1). 32.130517 is the sample figure, which k-means does not use. A scaled log has population SD 1 only on the rows it was fitted on."),

q(3, "Which sentence uses the word cluster as the course legislates it?",
 "Cluster 1 of k 4, seed 3, 10 starts holds 59 rows, GR centre 46.479661 gAPI.",
 ["Cluster 1 is the sandstone, as its 59 rows read a moderate gamma ray and the lowest density.",
  "The shale cluster holds the 29 rows with the highest gamma ray centre of the four.",
  "Every set of cored rows that share a core facies forms one cluster."],
 "A cluster is a group the engine made without core, numbered from 0, and the number is a name quoted with the run that made it. A rock name belongs to a cluster only after matching against core, and a group defined by core facies is a facies, which the engine never calls a cluster.")

# X m02 + m04
q(2, "At k 4, seed 3 and ten starts, the three scalings give inertias of 58.289042 (standard), 10331.820703 (none) and 4.258929 (min-max). How should they be ranked by fit?",
 "They cannot be: each is in the units of its own scaling, so no ranking holds.",
 ["Min-max first, standard second and raw last, from the lowest inertia to the highest.",
  "Raw first, since only the raw inertia is in the logs' own units and so is real.",
  "Standard first, as the engine's default scaling gives the reference figure."],
 "An inertia is a sum of squared distances on the scaled features, so the three figures are in squared standard units, a gAPI-dominated mixture, and squared fractions of each log's range. Compare inertias only between runs made on the same scaling. Being the default makes standard scaling no yardstick."),

# X m03 + m04
q(1, "Which pair is one refusal and one warning?",
 "`maxIter` 0 is refused; `maxIter` 2 on seed 3's start returns a result with a warning.",
 ["nComponents 5 returns four components with a warning beside them; nComponents 0 is refused outright.",
  "A missing seed returns a warning; a negative seed is refused.",
  "`maxSweeps` 0 returns a warning; `maxIter` 0 returns a warning too."],
 "A cap of 0 passes is refused, \"maxIter must be a whole number, 1 or more\", while a run stopped at maxIter 2 returns `converged` false and the warning \"did not converge in 2 assignment passes: the labels printed come from one more pass against the last centres\". nComponents 5, a missing or negative seed and maxSweeps 0 are all refused."),

# X m03 + m05
q(0, "A table of the cored rows has two gaps: row 40's RHOB and row 90's GR are null. What does `pca` report?",
 "One refusal, naming X[40][1], the first gap it meets; the other shows once that is fixed.",
 ["Two refusals in one message, X[40][1] and X[90][0], listing every gap in the table.",
  "A result on the complete rows only, with the two dropped rows named in a warning.",
  "Components computed after both gaps are filled with the mean of their own log."],
 "A missing value is refused by name at the first row and column the engine meets, counting from 0, so a table with several gaps shows one at a time: \"X[40][1] must be a finite number: fill or drop missing values first\". Nothing is filled or dropped; that decision belongs to the caller.")

# X m04 + m06
q(3, "Where does k 4 in the teaching clustering come from?",
 "The caller states it, one cluster per core facies; the engine does not choose k.",
 ["The engine picks it as the k with the lowest inertia among all the values of k it tried on the rows.",
  "It is the default of `kmeans`, used when the caller leaves k out.",
  "PCA chooses it, as the number of components with eigenvalue above 1."],
 "The engine does not choose k, the logs or the scaling. This tier states k 4, one per core facies, and the write-up records that k was stated and that judging it belongs to the Professional tier. kmeans refuses a k of 0 by name, and PCA returns components for the caller to read."),

emit(Q, '/root/dai-wip-facies/banks/d3b_exam.json', expect_n=42)
finish()
