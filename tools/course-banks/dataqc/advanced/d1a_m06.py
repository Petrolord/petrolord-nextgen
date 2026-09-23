import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D1 Expert m06, Reading the engine honestly.
# Figures from digest Section 31 (the printed-figure errata, what is not built,
# where the output needs care), Section 22 (Grubbs and masking), Section 23
# (the Mahalanobis label), Section 7 and Section 8 (caller ranges, a unit
# mislabel), Section 11 (entries and days), Section 18 (the modified z flag),
# Section 1 (what the engine does not do) and Section 32 (the vocabulary).

q(0, "NIST/SEMATECH 1.3.5.17.1 prints Grubbs' G on its uranium example as 2.4687, and the engine reads 2.468765. What differs?",
 "The page truncates; rounded to four decimals the engine's figure reads 2.4688",
 ["The engine uses the population SD for G, which moves the fourth decimal of the result",
  "The page rounds correctly, and the engine's G carries a small error in its last digits",
  "The engine rounds G up to 2.4688 before it compares G with the critical 2.031652"],
 "The printed figure is truncated; rounded to four decimals the engine reads 2.4688. G uses the sample SD, as NIST defines it. The engine keeps full precision and compares 2.468765 with its critical value of 2.031652, and the test rejects either way, as NIST says. The note is about a published page.")

q(2, "NIST 6.3.2.4 prints the EWMA lower limit as 47.4115, and the engine reads 47.411568. Where does the difference come from?",
 "The page rounds sqrt(0.3 / 1.7) to 0.4201 before multiplying; the engine reads 47.4116 at four decimals",
 ["The page uses the exact limits for its first sample, and the engine returns the asymptotic pair by default",
  "The engine takes s 2.0539 as a population figure and rescales it, which moves the last digit",
  "The page uses L 3 and the engine uses a slightly larger multiplier for the lower limit only"],
 "The course's row for 6.3.2.4 names the early rounding of the factor. The engine keeps full precision, and its upper limit, 52.588432, agrees with the printed 52.5884. Both limits in the example are the asymptotic pair, the engine takes s as given, and L is 3 on both sides.")

q(1, "The NIST CUSUM page prints a \"325 - k - x\" column reading 0.54 and 0.47 at groups 9 and 12. How does the course read that column?",
 "It is not an engine output: with the printed k those entries derive to -0.542500 and -0.467500, and the engine's S_lo there is 0.172500 and 0.000000",
 ["It is the engine's S_lo column rounded to two decimals, and the course reproduces it to the printed digits",
  "It is the plain cumulative sum at those groups, which the engine returns beside the tabular sums",
  "It is the design line's h at those groups, derived again from alpha and beta at each step of the table"],
 "The course derives the entries with the printed k as -0.542500 and -0.467500, a minus sign the printed column lacks, and gives the engine's S_lo at groups 9 and 12 as 0.172500 and 0.000000. Nothing in the engine is compared with the column. The plain cumulative sum at group 12 is -2.500000, and the design line gives one h, which the engine does not compute.")

q(3, "EKENE-7's core plugs are given a second high plug at entry 2, and Grubbs no longer rejects. What does the engine offer for several outliers?",
 "Nothing built: Grubbs tests for one, and the generalised ESD test that NIST points to is not built",
 ["The generalised ESD test, which the engine runs by itself whenever Grubbs fails to reject a sample",
  "Grubbs run again with the first suspect removed, which the engine does by itself until no value rejects",
  "A Mahalanobis distance on the plugs, which the engine substitutes by itself when it detects masking"],
 "The test is for ONE outlier, and NIST points to the generalised ESD test for several, which the engine does not build. With the second plug, G falls to 2.275359 against a critical 2.507321, because the sample SD rises from 0.019859 to 0.024800. The engine never removes a value and never swaps one test for another; a policy that expects more than one outlier runs a median based test beside Grubbs.")

q(2, "What covariance does the engine's Mahalanobis distance use, and how does its basis block describe it?",
 "The classical sample covariance, labelled \"sample covariance (n - 1), classical (not robust)\"",
 ["A robust covariance that down-weights rows far from the centre, labelled as robust in the basis block",
  "The population covariance with n in the divisor, labelled as a maximum likelihood estimate",
  "The median covariance of the rows, labelled as the multivariate form of the MAD"],
 "Each complete row's d^2 uses the classical mean and the SAMPLE covariance S (n - 1), and a robust covariance is not built. The course quotes the label. The classical estimates are themselves pulled by outliers, which is why the label says so. The engine has no median covariance.")

q(0, "With `sd: 'population'`, the stated series of nine zeros and a one is run through zScores at threshold 2.9. What does the engine return?",
 "maxPossibleAbsZ 3.000000, thresholdReachable true, and 1 flag at z 3.000000, with the ceiling named sqrt(n - 1), population SD",
 ["maxPossibleAbsZ 2.846050 and no flag, since the ceiling at ten values is the same whichever standard deviation the caller has chosen",
  "maxPossibleAbsZ 3.000000 and no flag, since a z-score that sits exactly on the ceiling is never counted as lying past the threshold",
  "A refusal, since a series that is nine parts zero has zero spread"],
 "The ceiling follows the chosen standard deviation. With the population SD it is sqrt(n - 1), 3.000000 at ten values, the threshold 2.9 is reachable, and the one reaches z 3.000000 and is flagged. With the sample SD the same ten values reach 2.846050 at most. The spread is not zero, since one value differs.")

q(3, "A flag's reason sentence prints its computed statistic as the shortest decimal that reads back to the field, which can run to every digit. How does a quality note quote the figure?",
 "It quotes the numeric field at six decimals, and a reason only verbatim, as the engine's own words",
 ["It quotes the reason's figure, since the reason carries more digits than the field and is the more exact",
  "It rounds the reason's figure to four decimals, the way NIST prints its worked examples",
  "It quotes neither and recomputes the statistic by hand, since both engine outputs carry rounding"],
 "A reason string prints every figure as the shortest decimal that reads back to its field, so the population z example's reason prints the statistic with all its digits while its `statistic` field at six decimals is 3.000000. A note quotes the field at the digest's precision and quotes a reason only as the engine's own words. The field and the reason hold the same number.")

q(1, "Two variables with very small variance in the caller's units are passed to `mahalanobis`, and it refuses them as singular. What should a reader of that refusal know?",
 "The singular test is an absolute pivot test inside lib/linalg, so tiny variances can trip it, and rescaling the variables avoids it",
 ["The refusal is always right: a small variance means one variable is a linear combination of the other",
  "The engine rescales the variables by itself and retries, so a refusal means the rescaled matrix was singular too",
  "The refusal comes from the chi-square cutoff, which cannot be formed when a variance is small"],
 "The Mahalanobis refusal for a singular covariance uses an absolute pivot test inside lib/linalg; variables with very small variance in the caller's units can be refused as singular, and rescaling avoids it. The engine does not rescale, and the chi-square cutoff depends only on alpha and the degrees of freedom.")

q(2, "The Hampel decision is imported from the petrophysics engine, whose own entry point turns a null into 0. What does that do to `hampel` in the quality engine?",
 "Nothing: hampel converts missing values to NaN before the call, so this engine is unaffected",
 ["Every missing sample enters its window as 0, which drags the window median down beside a gap in the log",
  "The quality engine refuses any series with a null in it before the call, and names the entry it refused",
  "Missing samples are judged as zeros and flagged, which is why the 11 flags include gap edges"],
 "Hampel converts missing values to NaN before the call, so this engine is unaffected. The course confirms it: missing values never enter a window, entry 80 of the density is missing and not judged, and entry 79 beside the gap is judged on 4 present samples. The engine refuses no null here; the chart refusal of a gap belongs to the control charts.")

q(0, "EKENE-7's sonic is range-checked with its unit declared as us/m in place of us/ft. What does `rangeCheck` return, and what does that say?",
 "240 checked and 0 failed: the definitional limit is positive in either unit, so a unit mislabel is invisible and the label is the caller's responsibility",
 ["A refusal, since the engine compares the sonic values with the typical range for us/m and finds them implausible",
  "240 checked and 240 failed, since every value is converted from us/ft and falls outside the us/m limit",
  "240 checked and 0 failed, which confirms that the sonic was in us/m all along"],
 "The same sonic declared in us/m passes 240 checked with 0 failed, because the definitional limit is positive in either unit. The engine carries no plausibility range and converts nothing. A pass says the values are positive; it says nothing about which unit they are in, so it confirms nothing about the label.")

q(1, "A caller wants to flag gamma ray readings above 150 gAPI on EKENE-7. Where does that limit come from, and what does the engine record?",
 "The caller passes it as min and max; the basis source reads limits supplied by the caller, and with the sentinel converted 236 are checked with 0 failed",
 ["The engine's definitional limits carry a gamma ray maximum of 150 gAPI, which the check applies by default",
  "The engine looks the range up for the basin and the tool, and records the source it used in the basis block",
  "The caller cannot supply one, since the engine refuses any limit that is not definitional"],
 "Plausibility ranges are the caller's, passed as min and max and checked the same way; the basis source reads limits supplied by the caller, and GR with its sentinel converted reads 236 checked and 0 failed at 0 to 150. The definitional gamma ray limit has a minimum of 0 and no maximum. The course lists plausibility ranges for any basin or tool as not built.")

q(3, "A draft quality note says entry 7 of EKENE-3's gauge readings \"is an outlier\". What does the course's vocabulary ask of that sentence?",
 "That it names the rule: the modified z-score flags entry 7 at 186.162000, beyond 3.5, as a potential outlier",
 ["Nothing more, since every method in the course agrees that entry 7 is wrong and that it should come out of the data",
  "That it names the rule: the z-score flags entry 7 at 2.845783, beyond the usual threshold of 3 for a z-score",
  "That it replaces the word with missing, since a value an outlier test flags is treated as absent"],
 "An outlier is a value a STATED RULE flags; say which rule, and the engine's word for the modified z is potential outlier. The course prints entry 7's modified z as 186.162000. The z-score does not flag it: 2.845783 is under 3, and at ten readings no z can pass 3. Missing is null, undefined or NaN, and a flag is a question about the value; the engine deletes nothing.")

q(0, "A quality note wants to report the gamma ray's upper quartile on EKENE-7's water sand. How does the course's vocabulary say it should be named?",
 "By its probability and its rule, for example the third quartile by R7, 38.642500, with no P label",
 ["By a P label, since that is how a quantile is named everywhere else in the academy",
  "As the percentile of the sand, which the engine computes by a single rule and needs no qualifier",
  "By its rank in the sample, since a quantile rule is a spreadsheet detail with no bearing on the value"],
 "A quantile at a stated probability by a stated rule (R6, R7 or R8); no P label is used anywhere in this course, since P labels differ between exceedance and non-exceedance conventions. The course prints the third quartile as 38.642500 by R7, 38.737500 by R6 and 38.725833 by R8, so the rule changes the value.")

q(3, "The cumulative oil flag's reason, in the engine's words, reads \"cumulative falls from 1338506.2 at entry 67 to 1331009.5\". Which day is entry 67, and which day is flagged?",
 "Entry 67 is day 68; the flag falls on day 70, compared with day 68",
 ["Entry 67 is day 67; the flag falls on day 69, the day after it",
  "Entry 67 is day 70, the flagged day itself, since a reason names the entry it flags",
  "Entry 67 is day 69, the missing day, since the engine skips a missing entry when it counts entries"],
 "The engine counts entries from 0, so entry 67 in the reason is day 68. Day 69 is missing, so day 70 is compared with the last present value, day 68, and the `drop` field is 7496.700000 bbl. Entries are positions, one per day, and a missing value keeps its position.")

q(2, "On EKENE-3, day 47's oil rate of -18.500000 bbl/d is flagged negative-rate. What does the flag tell the reader about the value?",
 "That a stated rule fired, with its reason; the engine does not decide whether the value is wrong",
 ["That the value is an error, which the engine has confirmed against the allocation record for the day",
  "That the value has been set to zero in the result, since a negative oil rate is physically impossible",
  "That the value is missing, since a negative rate cannot be a reading and the engine treats it as absent"],
 "The engine does not decide whether a flagged value is wrong; a flag is a rule that fired, with its reason. The course states day 47 is an allocation back-out booked as -18.5 bbl/d, a real entry. The engine does not fill, repair or delete a value, and a negative number is present: missing is null, undefined or NaN.")

emit(Q, '/root/dai-wip-dataqc/banks/d1a_m06.json', expect_n=15)
finish()
