import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC11 Expert m01, Arithmetic Aggregation. Every numeric or refusal key is a
# return of the vendored engine on a golden input (agg-ekene-reserves,
# agg-ekene-reserves-above-field, agg-ekene-reserves-independent,
# agg-ekene-reserves-strong, agg-negative-correlation, agg-constant-project);
# scratch/bank-advanced/witness.mjs recomputes each keyed figure. No key is a
# Monte Carlo figure. The Ekene field is synthetic. No capstone figure appears.

K = [2, 0, 3, 1, 1, 3, 0, 2, 3, 1, 0, 2, 2, 3, 0]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("The Ekene Reserves aggregation (synthetic) holds EKN-1, EKN-2 and EKN-U at the field level in MMbbl. What arithmetic 1P does the engine return?",
 "15.809794, the three low estimates added",
 ["26.396958, the best estimates added",
  "8.890000, EKN-1's low estimate alone",
  "26.821102, the sum of the three project means read off each distribution"],
 "The arithmetic 1P adds the low estimates: 8.890000, 3.945035 and 2.974759 give 15.809794 (engine). 26.396958 is the arithmetic 2P, the sum of the best estimates; 8.890000 is EKN-1 on its own; 26.821102 is the exact sum of the means, which belongs beside the best estimates and is no category.")

# 2
x("Adding the high estimates of the three Ekene Reserves projects gives which arithmetic 3P?",
 "38.387162, the three high estimates added category by category",
 ["24.990000, the high estimate of EKN-1 on its own",
  "36.465253, the sampled high of the total",
  "26.396958, taken from the best estimates"],
 "The arithmetic 3P adds the high estimates of EKN-1, EKN-2 and EKN-U: 24.990000, 8.371921 and 5.025241 give 38.387162 (engine). 24.990000 leaves out two projects; 36.465253 is a Monte Carlo figure on seed 20271112 and 20000 draws and no arithmetic sum; 26.396958 is the arithmetic 2P.")

# 3
x("How does the engine's arithmetic aggregation build the total of several projects of one class?",
 "It adds the lows for the total low, the bests for the total best and the highs for the total high (PRMS 4.2.5.2)",
 ["It adds each project's mean and prints that one sum in the 1P, the 2P and the 3P rows alike",
  "It samples the stated distributions on the stated seed and reads the 0.1 quantile of the totals as 1P",
  "It weights each project's estimates by its share of the field total before adding the categories"],
 "Arithmetic aggregation is summation category by category (PRMS 4.2.5.2): low with low, best with best, high with high. A sum of means is printed separately and fills no category; sampling on a seed is the statistical aggregation beside it; no weighting by share enters the sum.")

# 4
x("The same three Ekene Reserves projects are aggregated once at the \"field\" level and once at the \"above-field\" level. What does the engine report as reportable at each?",
 "\"arithmetic-or-statistical\" at the field level; \"arithmetic\" above it",
 ["\"statistical\" at the field level; \"arithmetic-or-statistical\" above it",
  "\"arithmetic\" at both levels, since these are Reserves in both calls",
  "\"arithmetic-or-statistical\" at both levels, since correlation is stated"],
 "At the field, property or project level statistical aggregation may be reported (PRMS 4.2.5.4), so the engine returns \"arithmetic-or-statistical\"; above the field level it returns \"arithmetic\". The class does not set the answer, and a stated correlation does not lift the above-field restriction. No call returns \"statistical\" alone.")

# 5
x("Between the field-level and above-field-level calls on the Ekene Reserves, which of the engine's figures change?",
 "None: the sums and the sampled figures are the same, and only what may be reported differs",
 ["The arithmetic 1P falls above the field level, because the engine applies the conservative caution",
  "The sampled P90 moves onto the arithmetic 1P above the field level",
  "The arithmetic 3P rises above the field level, since the high estimates are then treated as dependent"],
 "Both calls return an arithmetic 1P of 15.809794 and a sampled P90 of 17.300834 on seed 20271112 and 20000 draws (engine); the level changes only the reportable field. The caution about a conservative 1P and an optimistic 3P is a sentence the engine prints, and it moves no figure; sampling runs at both levels.")

# 6
x("Above the field level the engine prints a caution beside the arithmetic sums (PRMS 4.2.5.4). What does it say about them?",
 "the aggregate 1P may be very conservative and the aggregate 3P very optimistic, with the statistical figures kept for portfolio analysis",
 ["the aggregate 1P may be very optimistic and the aggregate 3P very conservative, so the statistical figures replace them",
  "the aggregate 2P is biased low whenever the projects are correlated, so the sum of means is reported beside it",
  "the arithmetic sums may be reported only when every stated correlation is 0, so the call is refused otherwise"],
 "The engine's own words are that the aggregate 1P may be very conservative and the aggregate 3P very optimistic, and that the statistical figures serve portfolio analysis (PRMS 4.2.5.5). The reversed caution has the direction wrong; nothing is said about a biased 2P; and a stated correlation never causes a refusal of the arithmetic sums.")

# 7
x("17 CFR 229.1202(a)(3) (the eCFR current at 2026-09-01) is quoted in this course. What does it require of reported total reserves?",
 "simple arithmetic sums of the property or field estimates within each reserves category",
 ["a probabilistic company-level total, its 0.1 quantile reported as proved",
  "a sum of the project means, reported as the 2P",
  "a risked total, with each field multiplied by its chance of commerciality before the categories are added"],
 "Item 1202(a)(3) of Regulation S-K requires reported totals to be simple arithmetic sums of the estimates for individual properties or fields within each category. It does not call for a company-level probabilistic total, a sum of means as 2P, or a risked total: Reserves carry no chance figure.")

# 8
x("What does 17 CFR 229.1202(a)(3) say about probabilistic methods?",
 "Reserves are not aggregated probabilistically beyond the field or property level",
 ["Probabilistic aggregation is required at the company level whenever more than two fields are reported",
  "Probabilistic totals may be reported at any level when the correlation between fields is stated as 0",
  "Probabilistic methods may be used only for Contingent Resources"],
 "The rule stops probabilistic aggregation at the field or property level and adds arithmetically above it, which is why the engine reports \"arithmetic\" above the field. It requires no company-level probabilistic total, grants no exception for a correlation of 0, and says nothing about Contingent Resources.")

# 9
x("The engine prints the same sentence in every aggregate call about a sum of low estimates. When is the arithmetic 1P also the P90 of the total?",
 "Only when every project is totally dependent, so that when one comes in low they all do",
 ["Whenever the projects are independent, since independent errors cancel out in the sum",
  "Whenever every project states a normal distribution, because sums of normals are normal",
  "Whenever the level is above the field, since the SEC rule makes the two figures equal"],
 "The engine's reason says the arithmetic sum of the low estimates is the P90 of the total only when every project is totally dependent (PRMS 4.2.5.2). Independence moves the sampled low away from it; a sum of normals is normal but its low is still above the sum of the lows; and the level decides what is reported without changing either figure.")

# 10
x("With the pairs as stated for Ekene (seed 20271112, 20000 draws), is the sampled low of the total above, below or on the sum of the three low estimates, 15.809794?",
 "Above it, and the engine prints the gap in its reasons",
 ["Below it, since sampling spreads the total wider than the sum does",
  "Exactly on it, because the correlations were stated for all three pairs",
  "It cannot be said, because the engine prints the sampled figures only above the field"],
 "The sampled P90 on that seed and those draws is 17.300834, above 15.809794, and the engine's reason states that the statistical low exceeds the arithmetic one. A sum of lows sits below the low of a partly independent total; stating every pair does not make them totally dependent; and the sampled figures are printed at both levels.")

# 11
x("A fourth project, EKN-C, is added to the Ekene Reserves with low, best and high all equal to 1.200000. What arithmetic 1P does the engine return?",
 "17.009794: the constant adds its value to every category",
 ["15.809794: a constant carries no range and is left out of the sums",
  "17.300834: the sampled low of the total, since a constant adds nothing to it",
  "a refusal: a constant is no distribution the engine can sample or add"],
 "Equal low, best and high make EKN-C a constant, which adds 1.200000 to every draw and to every arithmetic category: 15.809794 becomes 17.009794 (engine). It is neither dropped nor refused; 17.300834 is the sampled low without the constant, on seed 20271112 and 20000 draws, and the constant moves the sampled figures too.")

# 12
x("EKN-2 states a lognormal distribution with a mean of 6.000000 and a standard deviation of 1.800000. What low estimate does the engine read off it for the arithmetic sum?",
 "3.945035",
 ["6.000000",
  "5.746958",
  "8.371921"],
 "The engine reads the low estimate of a stated lognormal with the closed-form readers of lib/stats: 3.945035 (engine). 6.000000 is its mean; 5.746958 is its best estimate, which sits below the mean for a lognormal; 8.371921 is its high estimate.")

# 13
x("EKN-1 states low, best and high of 8.890000, 16.650000 and 24.990000 as a \"triangular-fit\". What mode does the fitted triangular carry?",
 "16.097684, which differs from the stated best of 16.650000",
 ["16.650000, the fitted mode equals the stated best",
  "16.821102, which is the mean the engine reads off the fitted distribution",
  "31.737202, the fitted maximum, which a triangular fit places at its mode"],
 "The engine fits a triangular through the three stated estimates with lib/stats and returns min 2.628420, mode 16.097684 and max 31.737202; the best estimate is its median, 16.650000, and its mean is 16.821102. The mode of a skewed triangular is neither its median nor its mean, and the maximum is a separate parameter.")

# 14
x("The Ekene Reserves are run under four stated correlations: uniform 0, the stated pairs, uniform 0.95 and uniform -0.4. What happens to the arithmetic 1P?",
 "It is 15.809794 on every run",
 ["It falls toward the sampled low as the stated correlation rises from 0 to 0.95",
  "It rises under the negative correlation, because the projects offset one another",
  "It is recomputed from the sampled low of each run and so differs a little each time"],
 "The arithmetic sum does not read the correlation: every run returns 15.809794 as its arithmetic 1P and 38.387162 as its 3P (engine). It is the sampled low that moves with the correlation; the arithmetic figures are closed-form sums of the stated estimates and use no draw.")

# 15
x("A reserves report quotes the Ekene figure 15.809794. Which description fits the vocabulary this course legislates?",
 "the arithmetic 1P of the Ekene Reserves at the field level, in MMbbl, a sum of low estimates",
 ["the P90 of the Ekene field, in MMbbl, which has a 90 percent chance of being met or exceeded",
  "the proved reserves of the Ekene field, meaning the quantities shown true at the field level",
  "the risked Ekene Reserves in MMbbl, since each project's low estimate already carries a chance"],
 "A figure is quoted with its class, unit and method, and this one is an arithmetic sum of low estimates. It is no P90 of the total, because the projects are not totally dependent; \"proved\" means the cumulative 1P, and a proof of truth is no part of it; and Reserves carry no chance, so \"risked\" does not apply.")

emit(Q, '/root/cat-wip-prms/banks/ec11a_m01.json', expect_n=15)
finish()
