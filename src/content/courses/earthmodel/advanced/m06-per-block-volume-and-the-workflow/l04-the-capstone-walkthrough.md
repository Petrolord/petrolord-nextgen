# The capstone walkthrough

> **Open book.** The figures this capstone grades can be read in this tier's lessons or on a panel as it opens, so for now it checks that you can find, read and report each one correctly. A later update moves it to a case of its own.

Six graded fields, all derived in this course; this lesson runs each from first principles with the panel open, and names the wrong answer each field is built to catch.

{{panel:em-population-explorer}}

## Field one: block 1 node count, tolerance zero

Hand count from the L's two rectangles: 12 columns times 9 rows plus 6 columns times 11 rows, 108 plus 66, 174. The census tile confirms. Tolerance zero because counting is exact or broken. The classic wrong answer: 175 or 173, an inequality solved with the wrong strictness at a boundary the golden polygon deliberately keeps 25 m away from every node; or 326, the other block's count, a reading-comprehension slip the grader cannot distinguish from ignorance.

## Field two: trend porosity at (1250, 2250), tolerance 0.001

Three multiplications: $0.38 - 0.00004 \times 1250 - 0.00001 \times 2250 = 0.3075$. The trend tile carries it. Wrong answers with diagnoses: 0.29-something means the kriged value was read instead of the trend; anything requiring a computer means the coefficients were refitted numerically, which works but misses that the fixture's plane is hand-exact; a value off in the second decimal usually means gradients applied per kilometre.

## Field three: kriged porosity at (1500, 2500), tolerance 0.0002

The four-well simple krige with golden parameters: 0.2914277719922997, the probe lesson's anatomy. The panel's probe readout opens on a point of its own, so type 1500 and 2500 into its x and y boxes with simple kriging and the golden variogram selected, and read it at six decimals. Wrong answers: 0.2862746100855956 is the per-block three-well map's value, the distinction lesson five flagged; 0.295 is the trend's value here; 0.2905 means the range was effectively too short or the weights never solved, collapsing to the mean. The tolerance is tight enough to refuse the mean, which sits 0.0009 away.

## Field four: the porosity jump across the fault on the y = 2200 row, tolerance 0.00005

The per-block kriged map, golden variogram, read along the profile row: the block 0 node just east of the fault at x 1600 minus the block 1 node just west of it at x 1550. The jump tile prints it to six decimals, signed. Block 1 is the constant 0.315 of lesson six in module five, so the jump is block 0's kriged value at x 1600 less 0.315. The wrong answers it hunts: the magnitude without its sign, which describes the cliff and loses its direction; the trend seam or the constant seam, which are the same tile read with the method switched; and the jump at a neighbouring nugget or range, which moves it by as little as a ten-thousandth and is why the tolerance is so tight. Field four checks that you read the kriged map at the stated assumptions and keep its sign.

## Field five: zone A weighted porosity, block 0, tolerance 0.001

The weighted mean over W2, W3, W4 with MD weights: $60.411814793890244 / 211 = 0.28631191845445614$. Wrong answers: 0.28235504109413956 is the unweighted mean; 0.2903935560727246 is the four-well weighted mean, meaning W1 crossed the fault in the candidate's bookkeeping, the exact error module three exists to prevent; 0.2848622416729035 is thickness-reweighting of W2, a defensible convention that is not this engine's.

## Field six: zone A bulk in block 1, tolerance 0.01 (in millions)

13.99875 million m3, entered in millions. From the census route: 174 nodes' thickness times cell area, or from closure: 45 minus 31.00125. The volume tile and closure tile carry both. Wrong answers: 31.00125 is the other block; 15.66 million is 174 nodes times the FIELD mean thickness of 36, the mean-without-its-denominator error, since block 1's own mean is 32.181; a value in raw m3 fails the units instruction rather than the geology.

## The shape of the exam

Notice the coverage: one counting field, one regression field, two kriging fields separated by exactly the concepts that distinguish them, one weighted-statistics field, one volume field with closure available as a check. Every field has at least one wrong answer that is a CORRECT computation of a DIFFERENT question, and the differences are this course's modules. The capstone is a map of the tier's distinctions, which is what makes practising it equivalent to understanding.

## Exercise

For each of the six fields, write the one-line provenance note you would attach in a report: what was computed, from which data, under which convention. Six lines, each under twenty words, no number without its recipe.
