import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# SC2 Expert m01, Contract Types on One Job. Every figure is quoted from
# digest.txt: the Ekene coiled tubing job under a lump sum, a day rate and a
# reimbursable contract on seed 20270211 with 20000 iterations, the plan, the
# overrun split, the margins, the fixed fee run, the certain job and the
# contractTypes refusals. Keys rest on engine output printed in the digest.

K = [2, 0, 3, 1, 1, 3, 0, 2, 3, 0, 1, 2, 0, 3, 1]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("The engine's payments basis for the Ekene job reads \"lump sum 900000; day rate 160000 + 50000 x days; reimbursable cost x 1.12\". At the plan of 13.865486 days, what planned payment does the day rate give?",
 "853274.305556: the mobilisation fee plus the rate on the planned days",
 ["923862.832721, the mean company cost over 20000 iterations on seed 20270211",
  "809032.466667, the contractor's planned cost with the 12 percent fee added on top",
  "722350.416667, the fixed cost plus the planned days at 42000.000000 a day"],
 "A planned payment applies the payment rule to the plan, so the day rate pays 160000 plus 50000 for each of the 13.865486 planned days, which the engine returns as 853274.305556. The figure 923862.832721 is the mean over the sampled outcomes, a different quantity from the plan. 809032.466667 is the reimbursable contract's planned payment. 722350.416667 is what the plan costs the contractor, before any contract pays for it.")

# 2
x("wellCost evaluateProgram gives 12.056944 productive days for the eleven activities at an NPT fraction of 0. How does the engine reach the planned 13.865486 days?",
 "It stretches the productive days by one plus the NPT fraction's mode of 0.15",
 ["Taking the mean of the NPT triangle's three points, 0.05, 0.15 and 0.6, as the stretch",
  "Reading the P50 of the sampled days, 15.053348",
  "Adding the rig-up and demobilisation, 48 hr each, as flat non-productive time"],
 "The plan is the modes, and wellCost's own stretch rule makes the days of an outcome the productive days x (1 + the NPT fraction). At the mode of 0.15 that gives 13.865486. The plan uses the mode of the triangle, so the average of its three points plays no part. 15.053348 is the P50 of the sampled days, which sits above the plan because of the long upper tail. The rig-up and demobilisation are already among the eleven activities, so adding them again would count them twice.")

# 3
x("Each iteration of the Ekene contract comparison draws random numbers. What does it draw, and in what order?",
 "Two uniforms from one mulberry32 stream: the NPT fraction first, then the daily cost",
 ["One uniform, shared by the NPT fraction and the daily cost",
  "The daily cost first, then the NPT fraction, each on its own stream",
  "A Math.random value per triangle, the seed fixing only the count"],
 "The engine's sampling basis says: one mulberry32(20270211) stream; per iteration a uniform for the NPT fraction, then one for the daily cost, each turned into a value by the triangular inverse CDF of lib/stats. A single shared uniform would tie long jobs to dear days, which the fixture never states. The order is fixed with the NPT fraction first, and there is one stream. No Math.random is used anywhere in the engine; the seed makes the whole stream reproducible.")

# 4
x("At 200 iterations on seed 20270211 the day rate's mean company cost is 931498.363877. What do a second run with the same inputs and a run on seed 20270212 return?",
 "931498.363877 again, identical in every field, then 915967.840404 on the next seed",
 ["A figure near 931498.363877, as each rerun draws afresh; 915967.840404 next",
  "Both give 931498.363877, since a seed only labels a run",
  "The rerun gives 923862.832721, where more runs settle, and 915967.840404 on the next seed"],
 "The one random draw in the course is seeded, so the same seed and iteration count return the same object in every field, 931498.363877 for this mean. A different seed starts a different stream and gives 915967.840404. A rerun never drifts, because nothing is drawn outside the seeded stream. 923862.832721 is the mean at 20000 iterations, a different run, and a rerun at 200 does not become it.")

# 5
x("A learner deletes the seed from the contract comparison and runs it. What does the engine return?",
 "A refusal naming seed, whose message says there is no default so every run can be reproduced",
 ["The run on seed 20270211, the fixture's seed, with a note beside the sampling basis",
  "Samples seeded from the clock, with the seed used printed so the run can be repeated",
  "Only the plan, since no percentile can be sampled once the seed has been left out"],
 "The seed is one of the inputs with no default. The engine refuses with the field seed, in its own words: \"seed must be a whole number from 0 to 4294967295; there is no default, so every run can be reproduced\". It never falls back to the fixture's seed or to the clock, and it returns no partial result: a refusal is an object with error and field only.")

# 6
x("Under the day rate, on seed 20270211 with 20000 iterations, how does the engine split the expected overrun of 107001.253374?",
 "The company pays 71671.875955 and the contractor absorbs 35329.377418",
 ["Company 35329.377418 and contractor 71671.875955, since a day rate is built to shield the company",
  "119841.403778 by the company and -12840.150405 by the contractor, with the fee on each extra day",
  "All 107001.253374 falls on the company at the agreed rate"],
 "The engine's overrun row for the day rate is companyPays 71671.875955 and contractorAbsorbs 35329.377418, a company share of 0.669823, and the two add to the expected overrun. Swapping the two figures reverses who pays. 119841.403778 and -12840.150405 are the cost plus 12 percent row. The company pays for extra days at the rate, but the contractor still carries a daily cost above plan and the gap between its daily cost and the rate, so the company does not pay it all.")

# 7
x("Under cost plus 12 percent, the engine returns the contractor's part of the expected overrun as -12840.150405. What does the minus sign say?",
 "When the job overruns the contractor earns more, since its fee grows with the cost",
 ["A loss on the average overrun, as its 0.199500 loss probability shows",
  "The subtraction ran in the wrong order, and the figure should be read as a positive 12840.150405",
  "A rounding trace from summing 20000 differences, with no share"],
 "The company pays the whole overrun plus 12 percent of it, 119841.403778 with a share of 1.120000, so the contractor's part is below zero: an overrun raises its fee. Its probability of a loss is 0.000000; 0.199500 belongs to the lump sum. The sign is the engine's split as defined, companyPays + contractorAbsorbs = expectedOverrun. A rounding trace near zero is the fixed fee case.")

# 8
x("The same job is rerun with the reimbursable contract paying cost plus a fixed fee equal to the percentage fee's planned margin (printed 86682.050000), same seed and iterations. What overrun split does the engine return?",
 "The company pays 107001.253374, the whole of it; the contractor's part is a floating-point trace",
 ["The company pays 119841.403778, the overrun plus 12 percent, and the contractor -12840.150405",
  "71671.875955 for the company and 35329.377418 for the contractor, as under the day rate",
  "Nothing for the company and 107001.253374 for the contractor, since a fixed fee caps the payment"],
 "Under a fixed fee the company reimburses the contractor's whole cost, so it pays the whole expected overrun, 107001.253374, with a share of 1.000000, and the contractor's margin is the fee in every iteration. The contractor's part is a floating-point trace near zero, the rounding left by summing 20000 floating-point differences; its size depends on the exact double of the fee, so a fee typed from the six-decimal print leaves a trace of another size, and no trace carries any share of the overrun. The 12 percent row belongs to the percentage fee, the 71671.875955 row to the day rate, and a fixed fee caps the fee only, so the lump sum's split does not apply.")

# 9
x("Which contract type gives the contractor the largest planned margin and also a probability of a loss of 0.199500?",
 "Lump sum, planned margin 177649.583333, since the contractor absorbs every overrun",
 ["Day rate, with 130923.888889 planned, because the contractor carries the daily cost above plan",
  "Cost plus 12 percent, with 86682.050000 planned, because a percentage fee is fixed as a share",
  "Under the lump sum at 72829.417364, the margin the price was set to earn on the plan"],
 "The lump sum carries the largest planned margin, 177649.583333, and the smallest mean margin, 72829.417364, and its margin goes below zero in 0.199500 of the iterations. 72829.417364 is its MEAN margin, which the plan does not produce. The day rate's probability of a loss is 0.059900 and the reimbursable contract's 0.000000, so neither matches the figure asked about.")

# 10
x("A stated job has nothing uncertain: 10 days, 40000 a day, a fixed cost of 100000, and a reimbursable contract at cost plus a fixed fee of 0, run for 10 iterations on seed 1. What does the engine report for that contract?",
 "A margin of exactly 0.000000 and a probability of a loss of 0.000000",
 ["Zero margin and a loss probability of 1, as it earns nothing",
  "The refusal naming reimbursable.fixedFee, since a fee has to be above 0 to be accepted at all",
  "No probability, since 10 iterations sit under the minimum"],
 "The engine's rule for a loss is a margin below zero, and a margin of exactly 0.000000 is not below it, so the probability of a loss is 0.000000. A fixed fee of 0 is accepted: the refusal is for a negative fixed fee, since it must be at or above 0. Any whole number of iterations from 1 is accepted, and the sampling basis says both draws are constant, so nothing is drawn.")

# 11
x("A learner replaces the activity programme with a days triangle of min 16, mode 14 and max 20. What does the engine return?",
 "The refusal under duration: \"duration must have min <= mode <= max; got min 16, mode 14, max 20\"",
 ["A run with min and mode swapped silently, so the triangle becomes 14, 16 and 20",
  "The wellCost refusal passed through under duration.program, since days belong to wellCost",
  "A result whose reason says the triangle is out of order, with no percentiles in it"],
 "A days triangle is the tender engine's own input, and it refuses one out of order under the field duration, quoting the figures it was given. It never repairs an input. The wellCost pass-through applies to an activity in a programme, and this call has no programme. An input the engine cannot use is refused; a result with a reason is for a well-formed call.")

# 12
x("The rig-up activity e3-rigup is typed with a negative durationHr. Whose rule does the refusal state, and under which field?",
 "wellCost's own words after the colon, under the tender engine's field duration.program",
 ["The tender engine's own wording, \"duration.min must be at or above 0; got -1\", under duration.min",
  "Only the tender engine's, under the field e3-rigup",
  "No one's: the hours are clipped to 0"],
 "An error in an imported engine is passed through with that engine's name: the refusal names the field duration.program, says it is refused by engines/drilling/wellCost.js, and after the colon carries wellCost's own rule, durationHr must be >= 0. duration.min is the field for a negative minimum of a days triangle, a different input. The field is the path of the input, duration.program, and the engine never clips a bad input.")

# 13
x("A reimbursable block states a feeFraction of 0.12 and a fixedFee of 86682.050000 together. What happens?",
 "The engine refuses it: the contract must state exactly one of the two fees",
 ["Both fees are added, cost x 1.12 plus 86682.050000",
  "The percentage fee wins because it is read first, and the fixed fee is dropped with a note",
  "Whichever fee gives the lower planned payment is kept, here the 809032.466667 of the percentage"],
 "The engine's message, in its own words: \"reimbursable must state exactly one of feeFraction (cost plus a percentage) or fixedFee (cost plus a fixed fee)\". It does not combine the two, pick one by order or pick the cheaper one, because each would be a choice no input states.")

# 14
x("What counts as an overrun in the contract comparison, and in what share of the iterations does the Ekene job overrun on seed 20270211 with 20000 iterations?",
 "0.902400 of them: a contractor cost above the planned 722350.416667 counts",
 ["A company cost above the day rate's planned 853274.305556, in 0.059900 of the iterations",
  "Any iteration whose days pass the productive 12.056944, which happens in 0.199500 of them",
  "A contractor cost above the mean of 827170.582636, which about half the iterations exceed"],
 "The engine's convention: an iteration overruns when its contractor cost exceeds the planned cost, the modes plan of 722350.416667, and 0.902400 of the iterations do. The overrun is measured on the contractor's cost, the same for every contract type; 0.059900 is the day rate's probability of a loss. The productive days carry no NPT at all, and 0.199500 is the lump sum's probability of a loss. The mean is not the reference.")

# 15
x("Across the lump sum, the day rate and cost plus 12 percent on the Ekene job, which has the smallest planned contractor margin and the largest mean margin?",
 "Cost plus 12 percent: 86682.050000 planned, 99260.469916 mean, and no loss in any iteration",
 ["Lump sum: 177649.583333 planned and 72829.417364 mean, since the contractor takes every overrun",
  "Day rate: 130923.888889 planned and 96692.250085 mean, since the extra days are paid for",
  "A fixed-fee reimbursable, with 86682.050000 planned and 86682.050000 mean, the fee each time"],
 "The margins table gives cost plus 12 percent the smallest planned margin, 86682.050000, and the largest mean, 99260.469916, because a percentage fee grows with the cost. The lump sum has the largest planned margin and the smallest mean. The day rate sits between them on both. The fixed-fee run is a separate stated contract and is not one of the three types in the table.")

emit(Q, '/root/cat-wip-procurement/banks/sc2a_m01.json', expect_n=15)
finish()
