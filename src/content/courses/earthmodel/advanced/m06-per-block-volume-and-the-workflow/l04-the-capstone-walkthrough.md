# The capstone walkthrough

Six graded fields, all derived in this course; this lesson runs each from first principles with the panel open, and names the wrong answer each field is built to catch.

{{panel:em-population-explorer}}

## Field one: block 1 node count, tolerance zero

Hand count from the L's two rectangles: 12 columns times 9 rows plus 6 columns times 11 rows, 108 plus 66, 174. The census tile confirms. Tolerance zero because counting is exact or broken. The classic wrong answer: 175 or 173, an inequality solved with the wrong strictness at a boundary the golden polygon deliberately keeps 25 m away from every node; or 326, the other block's count, a reading-comprehension slip the grader cannot distinguish from ignorance.

## Field two: trend porosity at (1250, 2250), tolerance 0.001

Three multiplications: $0.38 - 0.00004 \times 1250 - 0.00001 \times 2250 = 0.3075$. The trend tile carries it. Wrong answers with diagnoses: 0.29-something means the kriged value was read instead of the trend; anything requiring a computer means the coefficients were refitted numerically, which works but misses that the fixture's plane is hand-exact; a value off in the second decimal usually means gradients applied per kilometre.

## Field three: kriged porosity at (1500, 2500), tolerance 0.001

The four-well simple krige with golden parameters: 0.2914277719922997, the probe lesson's anatomy. The panel's default probe tile is not this one; read it from the profile machinery or compute it, which is deliberate: the field checks the METHOD is runnable, not a tile is readable. Wrong answers: 0.2862746100855956 is the per-block three-well map's value, the distinction lesson five flagged; 0.295 is the trend's value here; 0.2905 means the range was effectively too short or the weights never solved, collapsing to the mean.

## Field four: kriged porosity AT W1, tolerance 0.0005

0.315, exactly, at any valid nugget: the honor-the-data construction. The tightest tolerance in the ladder because the exactness argument permits no slack. The wrong answer it hunts: anything slightly OFF 0.315, which convicts an implementation of the continuous-covariance convention, the one that treats the nugget as measurement error to smooth through. Field four is a convention detector disguised as an easy lookup.

## Field five: zone A weighted porosity, block 0, tolerance 0.001

The weighted mean over W2, W3, W4 with MD weights: $60.411814793890244 / 211 = 0.28631191845445614$. Wrong answers: 0.28235504109413956 is the unweighted mean; 0.2903935560727246 is the four-well weighted mean, meaning W1 crossed the fault in the candidate's bookkeeping, the exact error module three exists to prevent; 0.2848622416729035 is thickness-reweighting of W2, a defensible convention that is not this engine's.

## Field six: zone A bulk in block 1, tolerance 0.01 (in millions)

13.99875 million m3, entered in millions. From the census route: 174 nodes' thickness times cell area, or from closure: 45 minus 31.00125. The volume tile and closure tile carry both. Wrong answers: 31.00125 is the other block; 15.66 million is 174 nodes times the FIELD mean thickness of 36, the mean-without-its-denominator error, since block 1's own mean is 32.181; a value in raw m3 fails the units instruction rather than the geology.

## The shape of the exam

Notice the coverage: one counting field, one regression field, two kriging fields separated by exactly the concepts that distinguish them, one weighted-statistics field, one volume field with closure available as a check. Every field has at least one wrong answer that is a CORRECT computation of a DIFFERENT question, and the differences are this course's modules. The capstone is a map of the tier's distinctions, which is what makes practising it equivalent to understanding.

## Exercise

For each of the six fields, write the one-line provenance note you would attach in a report: what was computed, from which data, under which convention. Six lines, each under twenty words, no number without its recipe.
