import sys, os; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D1 Professional m01, the z-score and its ceiling.
# Figures from digest Section 17 (the gauge, the ceiling table, the core plugs),
# Section 31 (the population ceiling care point) and Section 32 (sigma names its
# source). No capstone well, series, stated input or graded answer appears.

q(2, "Which standard deviation does `zScores` divide by when the caller leaves the choice unset?",
 "The sample standard deviation, dividing by n - 1, as NIST/SEMATECH 1.3.5.17 defines the z-score.",
 ["The population standard deviation, dividing by n, because the readings are all the data there is.",
  "The raw median absolute deviation, so that a single glitch cannot inflate the spread it is measured by.",
  "Whichever of the two gives the larger z, so the test is as sensitive as the data allow."],
 "Digest Section 17 states z = (x - mean) / s with the sample standard deviation (n - 1) by default, as NIST/SEMATECH 1.3.5.17 defines it. The population SD is available only when the caller asks for it, the MAD belongs to the modified z-score, and the engine never picks a spread by the result it gives.")

q(0, "EKENE-3's ten gauge readings have a mean of 215.250000 and a sample SD of 8.732220. What z does `zScores` return for entry 7, the glitch at 240.100000?",
 "2.845783",
 ["2.999718",
  "2.846050",
  "186.162000"],
 "Entry 7 sits 2.845783 sample standard deviations from the mean. The figure 2.999718 is its z against the population SD, 2.846050 is the ceiling for ten values, and 186.162000 is the modified z-score from the next module.")

q(3, "With the sample standard deviation, what is the largest absolute z that any value in a series of n values can reach?",
 "(n - 1) / sqrt(n)",
 ["sqrt(n - 1) for either SD",
  "No limit: a value can sit as far out as you like",
  "3, since the engine caps every z at its threshold"],
 "Section 17 gives the ceiling (n - 1) / sqrt(n) for the sample SD. The ceiling sqrt(n - 1) belongs to the population SD, which the engine names in its basis block when that choice is made. However far out a value sits, it drags the mean and widens the SD, and the engine caps nothing at the threshold.")

q(1, "On the ten gauge readings the engine returns `maxPossibleAbsZ` 2.846050 and `thresholdReachable` false, with 0 flags at 3. What does that zero say?",
 "Nothing about whether the series holds an outlier: no value in ten can pass 3 with the sample SD.",
 ["That the gauge readings are clean, because the engine examined each of them and flagged none.",
  "That entry 7 was dropped before the test ran, which is why the largest z falls short of 3.",
  "That the engine refused the call for a short series and returned a default result in its place."],
 "Section 17: at n = 10 no value can pass |z| > 3 with the sample SD, however wild. A zero from a test that could not fire is silence and carries no verdict. Entry 7 was in the call and reached 2.845783, and the engine returned a result with no refusal.")

q(1, "In the ceiling table, what is the smallest sample size at which a z beyond 3 becomes reachable with the sample SD?",
 "11 values, where the ceiling is 3.015113.",
 ["10 values, where the ceiling of 2.846050 lies close to 3.",
  "12 values, ceiling 3.175426.",
  "20 values, where the ceiling is 4.248529 and 3 is clear."],
 "The table reads false at 10 values, ceiling 2.846050, and true at 11, ceiling 3.015113. At 12 it is already true a second time, and 20 values is well past the point where 3 can be reached.")

q(3, "The caller switches the gauge call to the population standard deviation. What changes?",
 "The SD falls to 8.284111 and entry 7's z rises to 2.999718, and nothing is flagged at 3.",
 ["The mean moves away from 215.250000, because the population SD is taken about a different centre.",
  "The SD rises above 8.732220, so entry 7's z drops further inside the threshold.",
  "Entry 7 is flagged at last, because its z against the population SD now clears the threshold of 3."],
 "The mean is 215.250000 in both columns of Section 17; only the spread changes. Dividing by n gives the smaller SD, 8.284111, so every z grows, and entry 7 reaches 2.999718, still short of 3, with 0 flags.")

q(0, "Nine zeros and a one are run with `sd: 'population'` at a stated threshold of 2.9. What ceiling does the engine report?",
 "3.000000, which its basis names sqrt(n - 1), population SD.",
 ["2.846050, the ceiling for ten values under either choice of SD.",
  "3.015113, the sample SD ceiling that the table gives for eleven values.",
  "2.999718, the population z of the gauge glitch in its ten readings."],
 "Section 31: the ceiling follows the chosen standard deviation. With the population SD the ten values reach 3.000000, `thresholdReachable` is true and 1 flag fires at 2.9. The sample SD on the same values stops at 2.846050; the other two figures belong to other rows.")

q(2, "EKENE-7's fourteen core plugs could reach a z of 3.474396. The fractured plug at entry 8 reaches 2.985356 and nothing is flagged. Why?",
 "The plug is part of its own spread: the sample SD is 0.019859 with it and 0.010574 without it.",
 ["Fourteen plugs sit below the ceiling, so no value in them could pass a z of 3 with the sample SD.",
  "The engine uses the population SD for core data, which shrinks every z in the set below 3.",
  "Entry 8 is not the plug farthest from the mean, so its z is not the largest one in the set."],
 "At fourteen values 3 is reachable, so the ceiling is not the cause. Section 17 prints the sample SD at 0.019859 with all fourteen and 0.010574 with entry 8 left out: the plug widens the yardstick that measures it. The default stays the sample SD, and entry 8 carries the largest z, 2.985356.")

q(3, "Measured against the mean and sample SD of the other thirteen plugs, where does the fractured plug at entry 8 sit?",
 "6.038080",
 ["2.985356",
  "2.066042",
  "5.890633"],
 "Section 17 derives 6.038080 against the other thirteen. Measured against a spread that includes itself the plug reads 2.985356, which is what `zScores` returns. 2.066042 is the largest z among the thirteen, and 5.890633 is the modified z-score.")

q(0, "With the fractured plug left out, what do the thirteen remaining plugs return?",
 "A mean of 0.217154, a sample SD of 0.010574 and a largest z of 2.066042, with 0 flags.",
 ["A mean of 0.221714 and a sample SD of 0.019859, the same as the full set.",
  "A largest z of 6.038080 at a second plug, which the fractured plug had been hiding.",
  "A refusal, since thirteen values sit under the ceiling and no z can be computed."],
 "Section 17 prints the second row: 0.217154, 0.010574 and 2.066042, and no flag. The full-set figures are 0.221714 and 0.019859. The 6.038080 belongs to entry 8 itself against the thirteen, and a series of thirteen raises no refusal.")

q(2, "A report states that the gauge glitch sits 'almost three sigma out'. What does this course require the report to add?",
 "The source of that sigma: the sample SD of the ten readings, 8.732220.",
 ["A P label for the reading, so readers know which tail it sits in.",
  "Nothing, since sigma always means the sample SD.",
  "The same distance converted to a percentage of the mean, so it reads without units."],
 "Section 32 makes sigma a standard deviation with its source named: sample SD, 1.4826 x MAD or another stated source. Here the z was measured against the sample SD, 8.732220. The course uses no P label at all, and a percentage of the mean is a different quantity.")

q(1, "Which reading of a flag from `zScores` does this course accept?",
 "The value sits beyond the threshold in sample SDs from the sample mean, and that is a question about it.",
 ["The value is wrong, since only a faulty reading or a failed sensor can sit that far from the mean of the rest.",
  "The value is removed from the series and the mean and SD are recomputed without it.",
  "The value is one of the defects the Ekene generator planted."],
 "The course's word for such a value names its rule, and the flag asks a question about the reading. `zScores` returns flags and leaves the series untouched, and a flag need not land on a planted defect: on the gauge the planted glitch is not even flagged by this rule.")

q(0, "Eight core plugs are screened with `zScores` at 3. What is the most that any z among them can reach with the sample SD?",
 "2.474874",
 ["2.846050",
  "1.788854",
  "3.015113"],
 "The ceiling table prints 2.474874 at n = 8, below 3, so no plug in eight can be flagged at that threshold. 2.846050 is the row for 10 values and 1.788854 the row for 5; the ceiling depends on n and the standard deviation chosen, and 3.015113 needs eleven values.")

q(3, "The gauge glitch reaches 2.999718 against the population SD. Why is it still not flagged at a threshold of 3?",
 "A flag needs |z| strictly beyond 3, and 2.999718 sits just below it.",
 ["The engine falls back to the sample SD at ten values.",
  "The engine rounds each z to two decimals first, so the glitch compares as 3.",
  "Values equal to the ceiling are exempt from flagging."],
 "Section 17 flags a value when |z| > 3. 2.999718 is below that, and the population column shows 0 flags. The engine accepts the population SD and compares the unrounded figure; the population ceiling at ten values is 3.000000.")

q(2, "Twenty daily rates are screened with `zScores` at 3 and the sample SD. Can any of them be flagged?",
 "Yes: the ceiling at 20 values is 4.248529, above 3.",
 ["No: twenty values put the ceiling at 2.846050, below 3.",
  "No: with the sample SD the ceiling stays below 3 at any n.",
  "Only with the population SD, whose ceiling at 20 is 3.000000."],
 "The ceiling table prints 4.248529 at 20 values, reachable at 3. 2.846050 is the ten-value row, the ceiling first passes 3 at eleven values, and 3.000000 is the population ceiling for the ten-value case in Section 31.")

emit(Q, '/root/wt-dai-d1-nextgen/tools/course-banks/dataqc/intermediate/d1i_m01.json', expect_n=15)
finish()
