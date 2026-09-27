import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC11 Expert m02, Probabilistic Aggregation. Keys are the method, the seed, the
# draws, the direction a stated correlation moves the sampled low, a closed-form
# figure the digest prints (the sum of the means, the exact low of two
# independent normals, a standard deviation of the Guidelines' reading), or an
# engine refusal verbatim (agg-refuse-rho-one, agg-refuse-psd,
# agg-refuse-missing-pair, agg-refuse-no-seed). A sampled figure appears only in
# a stem or a distractor with its seed and draws, and is never a key.
# scratch/bank-advanced/witness.mjs recomputes every key. No capstone figure.

K = [1, 3, 0, 2, 0, 1, 3, 2, 1, 0, 3, 3, 2, 0, 1]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("Where does the sampler behind the engine's statistical aggregation come from?",
 "lib/stats: createCorrelatedSampler (a Gaussian copula with a Cholesky factor) on the mulberry32 generator",
 ["A sampler written inside prms.js for reserves work alone, seeded from the project count and the stated unit",
  "engines/economics/cashflow.ts, which the engine already imports for computeCashFlow and applyJV",
  "The panel's own browser random numbers, drawn afresh each time the aggregation calculator is opened"],
 "The engine's basis names lib/stats/stats.js: createCorrelatedSampler (Gaussian copula, Cholesky), mulberry32, fitTriangularToPercentiles and quantile. prms.js carries no sampler of its own; cashflow.ts supplies the cash flow and applyJV and no sampler; and a panel reproduces its figures because the draws are seeded.")

# 2
x("How does the engine read the low estimate of a total from its sampled draws?",
 "As the 0.1 quantile of the totals, labelled P90 per lib/conventions/percentile.js",
 ["As the 0.9 quantile of the totals, since P90 names the 90th percentile of the sampled draws",
  "As the sum of each project's own low estimate, each read off its stated distribution first",
  "As the mean of the totals less a multiple of their sampled standard deviation"],
 "The engine's label line reads that P90 is the 0.1 quantile of the totals, the low estimate, per lib/conventions/percentile.js; the 0.9 quantile is the alternative that would read P90 as high. A sum of lows is the arithmetic 1P, a different figure; and no normal approximation of the total is made.")

# 3
x("The Ekene Reserves are sampled on seed 20271112 with 20000 draws, then again on the same seed and draws, then on seed 20271113 with 20000 draws. What does that show?",
 "The same seed and draws give the same P90 again; a new seed moves it, so a sampled figure is quoted with both and is not graded",
 ["The sampler is broken, because a correct Monte Carlo returns one P90 on every seed",
  "The second seed is the better one, because its P90 lies closer to the arithmetic 1P",
  "The draws are too few, and at 200000 draws every seed returns the same P90 exactly"],
 "On seed 20271112 the P90 is 17.300834 on both runs; on seed 20271113 it is 17.414533 (engine, 20000 draws each). Every seeded Monte Carlo moves with its seed by the sampling error; no seed is better; and more draws narrow the sampling error without removing it: at 200000 draws on seed 2011 the independent P90 of the 2011 Guidelines' two blocks still sits 0.030852 from the exact low (engine).")

# 4
x("The Ekene Reserves are sampled on seed 20271112 and 20000 draws under uniform 0, the stated pairs and uniform 0.95. What does the sampled P90 do as the stated correlation rises?",
 "It falls toward the arithmetic 1P of 15.809794",
 ["It rises away from the arithmetic 1P",
  "It stays at 17.300834 on all three runs",
  "It falls below the arithmetic 1P at uniform 0.95, crossing it"],
 "On those draws the P90 runs 18.487436, 17.300834 and 15.891238 (engine): it moves toward 15.809794 as the correlation rises and stays above it at 0.95. It does not rise; it moves with every run; and it does not cross the arithmetic sum, which is the P90 only under total dependence.")

# 5
x("Of the four stated correlations run on the Ekene Reserves (seed 20271112, 20000 draws), which puts the sampled P90 furthest above the arithmetic 1P?",
 "uniform -0.4, where the projects offset one another most",
 ["uniform 0.95, since a strong correlation widens the total",
  "uniform 0, since independent projects sit furthest apart",
  "the stated pairs, which are the only unequal correlations"],
 "The sampled P90 is 20.009881 under uniform -0.4, 18.487436 under 0, 17.300834 under the stated pairs and 15.891238 under 0.95 (engine, on that seed and those draws). A negative correlation lets a low project be offset by a high one, lifting the low of the total furthest; strong positive correlation pulls it toward the sum of the lows.")

# 6
x("On every one of those four Ekene Reserves runs, what exact mean of the total does the engine print beside the sampled mean?",
 "26.821102, the sum of the three means",
 ["26.699904, the sampled mean of the stated-pairs run on seed 20271112",
  "26.396958, the arithmetic 2P",
  "26.430497, the sampled P50 of the stated-pairs run, being the best of the total"],
 "The mean of a total is the sum of the means whatever the correlation (PRMS 4.2.5.2), so the exact 26.821102 is printed on every run (engine). 26.699904 is a sampled mean on seed 20271112 and 20000 draws; 26.396958 sums best estimates, which are medians of each project; 26.430497 is a sampled P50.")

# 7
x("The 2011 Guidelines' blocks A and B, read as normals with means 53.400000 and 35.600000, have 90 percent half-widths of 10.100000 and 7.100000. What is the exact low of their sum when they are independent?",
 "76.654150",
 ["71.800000",
  "76.623299",
  "76.434906"],
 "For two independent normals the low of the sum is 89.000000 less the square root of the sum of the squared half-widths: 76.654150 (derived, in closed form). 71.800000 is the arithmetic sum of the lows; 76.623299 is the sampled P90 on seed 2011 and 200000 draws; 76.434906 is the sampled P90 of the same blocks read as lognormals.")

# 8
x("Under the Guidelines' own symmetric reading taken by the golden input, what standard deviation does block A carry (expectation 53.400000, Proved 43.300000)?",
 "7.881072: the half-width of 10.100000 over the standard normal 90th percentile",
 ["10.100000: the half-width itself, the gap between the expectation and the Proved",
  "8.289303: the standard deviation of a lognormal through the same expectation and Proved",
  "5.540159"],
 "The golden input reads each block as a normal with the expectation as its mean and the expectation less the Proved as its 90 percent half-width, so its standard deviation is 10.100000 over the standard normal 90th percentile: 7.881072. 10.100000 is the half-width; 8.289303 belongs to the lognormal reading; 5.540159 is block B's standard deviation.")

# 9
x("The same two blocks are sampled at a stated correlation of 0.999 on seed 2011 and 200000 draws. What happens to the sampled P90?",
 "It returns almost to the arithmetic sum of the lows, 71.800000",
 ["It stays near the independent figure of 77 that the Guidelines print",
  "The call is refused, because 0.999 is treated as total dependence",
  "It rises above the exact independent low of 76.654150"],
 "Near total dependence the sampled P90 is 71.774133 (engine, on that seed and those draws), almost the arithmetic 71.800000: a sum of lows is the low of the total when the parts move together. 0.999 is accepted (a correlation of 1 is refused); the independent figure belongs to correlation 0.")

# 10
x("Read as lognormals through the same expectations and Proved figures, the Guidelines' blocks give a sampled P90 of 76.434906 on seed 2011 and 200000 draws, against 76.623299 for the normal reading on the same seed and draws. What does the pair teach?",
 "The stated marginal distribution moves the probabilistic total, so the reading is named beside the figure",
 ["The lognormal reading is wrong, since the Guidelines print 77 and only the normal reading comes close to it",
  "The two readings agree once rounded to whole numbers, so the choice of distribution does not matter to a total",
  "The seed differs between the two runs, which accounts for the whole of the gap between the two sampled figures"],
 "Both runs use seed 2011 and 200000 draws; the gap comes from the marginals. The Guidelines add their blocks for symmetric distributions and the golden input takes that reading, stated as such; the course names both and grades neither. Rounding to 77 hides the difference without removing it.")

# 11
x("A caller states a uniform correlation of 1 between the Ekene projects. What does the engine return?",
 "the refusal: correlation.rho must be a number above -1 and below 1 (the canonical sampler takes a correlation strictly between -1 and 1); got 1",
 ["the arithmetic sums returned as the sampled figures, since total dependence makes the two methods agree exactly and no draw is then needed at all",
  "a result with the correlation capped at 0.999 and a warning line in the reasons",
  "the refusal: correlation must be a positive semidefinite correlation matrix; got 1"],
 "The engine refuses a rho of 1 by name, in its own words: correlation.rho must be a number above -1 and below 1 (the canonical sampler takes a correlation strictly between -1 and 1); got 1. It substitutes no arithmetic answer and caps nothing; the positive semidefinite refusal is a different message for a matrix the Cholesky factor cannot reproduce.")

# 12
x("Three varying projects are given a uniform correlation of -0.6. What does the engine return, in its own words?",
 "correlation must be a positive semidefinite correlation matrix (the Cholesky factor misses the stated matrix by 0.8); got {\"type\":\"uniform\",\"rho\":-0.6}",
 ["correlation.rho must be a number above -1 and below 1 (the canonical sampler takes a correlation strictly between -1 and 1); got -0.6",
  "a sampled total with the correlation clipped to 0 and a line saying the matrix was adjusted",
  "correlation must be an object { type: \"uniform\", rho } or { type: \"pairs\", pairs } (stated; no default); got -0.6"],
 "Three variables cannot all be correlated at -0.6: the matrix is not positive semidefinite and the engine refuses it, naming how far the Cholesky factor misses (0.8). -0.6 is inside the range the rho check allows, so that message does not fire; nothing is clipped or adjusted; and the object-shape message is for a correlation left out.")

# 13
x("A pairs correlation on the three Ekene Reserves projects states only two pairs. What does the engine return?",
 "a refusal naming the first missing pair, EKN-2 and EKN-U, and asking for one pair each of the 3 pairs",
 ["a result that treats the missing pair as independent, filling it with a correlation of 0 and saying so in the reasons",
  "a result that copies the nearest stated correlation into the missing pair and prints the matrix it then used",
  "a refusal saying that correlation.pairs[2] must be a pair stated once, since a pair was entered twice by mistake"],
 "The engine refuses: correlation.pairs must be one pair for each of the 3 pairs of varying projects, a correlation of 0 being entered as a pair like any other, and it names EKN-2 and EKN-U as the first missing pair. It supplies no 0 and copies nothing; the \"stated once\" refusal is for a duplicate pair.")

# 14
x("The seed is removed from an aggregation call. What does the engine return, in its own words?",
 "seed must be an integer from 0 to 4294967295 (the mulberry32 seed; no default); got nothing",
 ["a result on the seed 20271112, which the Ekene fixture uses",
  "a result on a seed drawn from the clock, printed in the reasons",
  "iterations must be an integer from 100 to 200000; got nothing"],
 "The seed is a stated input with no default, and the engine refuses its absence by name. It borrows no fixture seed and reads no clock, which is what lets any figure be reproduced on its seed and draws; the iterations message belongs to a missing or out-of-range draw count.")

# 15
x("Which of these figures from an Expert aggregation can be a graded figure in this course?",
 "the arithmetic 1P, a return of the engine on fixed inputs",
 ["the sampled P90 on the stated seed and draws",
  "a Monte Carlo mean on the stated seed and draws",
  "the P50 of the total, since it is the best estimate"],
 "Every graded number is a return value of the engine on fixed inputs, and none comes from the Monte Carlo. The sampled P90, P50, P10 and mean are taught with their seed and draw count, and none is graded as an exact figure; the arithmetic sums are closed-form and can be graded.")

emit(Q, '/root/cat-wip-prms/banks/ec11a_m02.json', expect_n=15)
finish()
