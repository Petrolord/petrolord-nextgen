# The probe value

The capstone's kriging probe asks for the estimate at (1500, 2500) with the golden parameters: 0.2914277719922997. This lesson walks the estimate's anatomy, then stress-tests it against every assumption in reach, because a graded number you can only produce, not perturb, is half-learned.

{{panel:em-population-explorer}}

## Anatomy of 0.29142777

The probe stands 319.83 m from W2's control point, 447.2 m from W3, 651.9 m from W4, 565.7 m from W1. All four wells enter the system; simple kriging has no search radius here, and W1 participates from across the fault line because THIS computation is the whole-data krigeAt the capstone frames, not the per-block population. The distinction is worth 0.005 of porosity: the per-block map's value at this same location, kriged from block 0's three wells with their own mean, is 0.2862746100855956. Knowing which of the two a question asks for is part of reading a capstone precisely.

The estimate decomposes as the mean 0.2905162808206047 plus weighted residuals. The residuals from the mean: W1 plus 0.02448, W2 plus 0.00305, W3 minus 0.01352, W4 minus 0.01402. The correlations to the target: W2 at about 0.49, W3 at 0.32, W1 at 0.18, W4 at 0.10. The positive pull of nearby W2 and distant W1 nearly cancels the negative pull of W3 and W4, landing the estimate 0.0009 above the mean. The probe is a genuinely mixed, four-well answer: no single well explains it, which is what makes it a good graded value.

## Stress tests, one assumption at a time

Range: 300 gives 0.2905162808206047, the mean EXACTLY, because every well is beyond 300 m and all covariances to the target vanish; 600 gives 0.29047270952788345, marginally BELOW the mean; 900 the graded 0.29142777199229974; 1800 gives 0.2924708301904079. The value is range-sensitive at the 0.001 level, and the direction is not monotone toward any well: at 600, W3 and W4's negative residuals reach the probe while W1's positive one still barely does; widening further lets W1 pull the estimate back up. Weight geometry, not folklore.

Nugget: 0 gives 0.2915971137588124, 0.002 gives 0.29060333792448684: a slide toward the mean as individual wells are discounted, spanning about one tolerance across the whole valid sweep, as the nugget lesson explained for far probes.

Model: exponential at the same parameters gives 0.291000548626652, 0.0004 below spherical, the tail trading nearby dominance for far-field reach.

The summary a reviewer wants: the graded value is robust to the nugget, mildly sensitive to the range with a non-monotone signature, and stable to the model family within half a tolerance. An answer that can produce THAT sentence understands the probe.

## The probe against the trend

The trend at the same location: $0.38 - 0.06 - 0.025 = 0.295$. Kriging says 0.2914. On planar data the trend IS the generator, so the 0.0036 gap is kriging's confession: with a 900 m range and a nugget, four wells cannot fully reconstruct even a perfect plane between them; the estimator sags toward the mean in the data gaps. Neither number is "wrong": one extrapolates a law the data cannot falsify locally, the other refuses to assert structure beyond correlation reach. The gap between them, mapped across the field, is where method choice matters, and it peaks exactly in data gaps like this probe.

## Worked example

Reproduce the range-300 collapse by inspection rather than computation. Correlation beyond the range is zero, so every entry of the target covariance vector $c_0$ is zero; the solved weights are all zero; the estimate is the mean plus nothing: 0.2905162808206047, and the panel's far tile and probe tile READ THE SAME at range 300. One glance at the panel confirms it. This degenerate case is worth carrying because it calibrates the range dial physically: the range is the distance beyond which your map stops being about the wells at all.

## Exercise

At range 900, the probe reads 0.29142777; at 600, 0.29047271, BELOW the mean. Using the four wells' residual signs and their distances (320, 447, 652, 566 m), explain in three sentences the mechanism of the dip below the mean at range 600 and the recovery above it at 900.
