import sys, os; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D1 Professional m06, outliers in a report.
# Figures from digest Section 24 (every method on the three teaching series),
# Section 31 (the NIST printed figures, the reason string against the field,
# what is not built, the singular pivot care point), Section 22 (the uranium
# example), Section 1 (what the engine does not do) and Section 32 (the
# vocabulary). No capstone well, input or answer appears.

q(1, "On the EKENE-3 gauge, which method flags entry 1 as well as entry 7 at its defaults?",
 "The Hampel window, at halfWindow 3.",
 ["The modified z-score, which reads entry 1 against the median.",
  "Tukey's fences on R7 quartiles at k 1.5.",
  "Grubbs' test, two-sided at alpha 0.05."],
 "Section 24's gauge row reads 7 for the modified z-score, 7 for the fences, 1 and 7 for Hampel and 7 for Grubbs. Only the moving window adds entry 1.")

q(3, "On the core plugs with two high plugs, which methods flag nothing at all?",
 "The z-score and Grubbs' test.",
 ["The modified z-score and Tukey's fences.",
  "Hampel and the z-score.",
  "All five, since the two plugs mask each other."],
 "Section 24: on the two-plug copy the z-score and Grubbs return none, while the modified z-score, the fences and Hampel each flag entries 2 and 8. The methods that measure from a mean and SD the plugs help set are the ones masked.")

q(0, "On the single fractured plug set, which of the five methods in the comparison table misses entry 8?",
 "The z-score beyond 3.",
 ["Grubbs' test, since G stops short of 3 on fourteen plugs.",
  "The Hampel window, since plugs have no neighbours in depth.",
  "Tukey's fences, since the IQR widens around a high plug."],
 "Section 24's core row reads none for z beyond 3, and 8 for the modified z-score, the fences, Hampel and Grubbs. Grubbs compares G 2.985356 with 2.507321 and rejects.")

q(2, "According to the course's comparison, what does the Hampel window measure a value against?",
 "A local window of its neighbours.",
 ["A mean and SD that the value helps set.",
  "A two-channel correlation.",
  "A median and quartiles over the whole series."],
 "Section 24: z and Grubbs measure against a mean and SD the outlier helps set, the modified z and the fences against a median and quartiles it barely moves, Hampel against a local window and Mahalanobis against a correlation.")

q(1, "NIST prints the uranium example's Grubbs G as 2.4687; the engine returns 2.468765. What does the difference show?",
 "The printed figure was truncated rather than rounded: rounded to four decimals the engine reads 2.4688.",
 ["The engine's G is wrong in the fourth decimal, since the golden anchor is the NIST page itself.",
  "NIST used the population SD, which moves G down in the fourth decimal on eight values.",
  "The engine rounds G down to protect the one-sided test from a false rejection at the edge."],
 "Section 31 tables the Grubbs G erratum: printed 2.4687, engine 2.468765, truncated rather than rounded, with 2.4688 as the four-decimal rounding. It is a note about a published page, and the engine reproduces the printed figure within the stated allowance.")

q(3, "The population case of nine zeros and a one at threshold 2.9 returns a flag whose `statistic` field reads 3.000000 at six decimals. What does this course quote in a report?",
 "The numeric field at six decimals, with the reason quoted only verbatim as the engine's words.",
 ["The reason string, because it carries every digit and is the more exact of the two figures.",
  "Whichever of the two is shorter, since both describe the same computed statistic.",
  "Neither: a flag from the population SD is never quoted in a report."],
 "Section 31: a reason prints every figure as the shortest decimal that reads back to the field it quotes, so a computed statistic prints every digit. A lesson quotes the field at six decimals, 3.000000 here, and quotes a reason only as the engine's own words.")

q(0, "What is the uranium example's Grubbs result in the engine, one-sided max at alpha 0.05?",
 "G 2.468765 against a critical 2.031652, so the test rejects.",
 ["G 2.468765 against a critical 2.126645, so the test rejects.",
  "G 2.468765 against a critical 2.474874, so it does not reject.",
  "G 2.4687 against a critical 2.032, so it does not reject."],
 "Section 22 prints G 2.468765 against the printed 2.4687 and the critical 2.031652 against the printed 2.032, reject true. 2.126645 is the two-sided critical at n = 8 and 2.474874 the largest possible G at eight values.")

q(2, "Which of these does the engine build?",
 "Grubbs' test for one outlier",
 ["A generalised ESD test for several outliers",
  "A robust covariance for the Mahalanobis distance",
  "A fallback spread for when the MAD is zero"],
 "Section 31's list of what is not built holds the generalised ESD test, a robust covariance and a fallback for a MAD of zero, the last answered with a refusal. Grubbs for one outlier is built, with the masking it suffers.")

q(1, "A flag from any of this tier's rules comes back on an entry. Which statement about it matches the engine?",
 "The rule fired, with its reason; the engine does not decide whether the value is wrong.",
 ["The value is wrong, since each rule is calibrated so that flags fall only on bad data.",
  "The value has been removed from the series, and the result reports what is left.",
  "The value is a planted defect, since the Ekene series were built to carry them."],
 "Section 1: the engine does not decide whether a flagged value is wrong; a flag is a rule that fired, with its reason, and the engine does not fill, repair or delete a value. On the gamma ray, 9 of the 11 Hampel flags are not planted defects.")

q(3, "In the oil sand at alpha 0.05, entry 62 is flagged beside entry 60. What is entry 62?",
 "A sand row flagged by the stated cutoff, with no planted defect behind it.",
 ["A planted defect, set off the density-neutron trend as entry 60 was.",
  "A row skipped for a missing density, listed beside the flagged rows.",
  "A duplicate of entry 60, carried into the flags by the covariance."],
 "Section 2 lists entry 60 as the Mahalanobis defect and no other oil sand row. Entry 62's d^2 of 6.581737 is above the alpha 0.05 cutoff of 5.991465, so it is flagged by the rule at that setting; the skipped rows are entries 80 to 91.")

q(2, "Which of these is an examination that the rule actually made and passed?",
 "A point the Hampel rule judged, with no flag raised.",
 ["A z-score run with `thresholdReachable` false and zero flags.",
  "A Hampel point with `judged` false and no flag.",
  "A Mahalanobis row skipped for a missing value."],
 "Section 21: `judged` is true when a window holds three or more present samples, so a judged, unflagged point was examined and passed. A z run with `thresholdReachable` false could not flag anything, an unjudged point was never examined, and a skipped row never entered the distance.")

q(0, "In this course, what does the word outlier have to carry?",
 "The stated rule that flagged the value.",
 ["A P label saying which tail the value sits in.",
  "Proof that the value is a bad measurement.",
  "The deletion that followed it in the dataset."],
 "Section 32: an outlier is a value a stated rule flags, and the rule is named; a flag is a question about the value. No P label is used anywhere in the course, and the engine deletes nothing.")

q(1, "A report quotes a spread built from a Hampel window. How does the course require it to be named?",
 "As 1.4826 x MAD, with the window it came from.",
 ["As a bare sigma, since every window reads in SD units.",
  "As the raw MAD, which Hampel uses unscaled.",
  "As the sample SD of the whole channel."],
 "Section 32 lists the sources a sigma may carry: sample SD, MRbar / 1.128, 1.4826 x MAD, or historical in-control data. Section 21 builds the Hampel threshold on nSigma x 1.4826 x MAD of the window, so the raw MAD is the modified z-score's spread.")

q(2, "A caller's two variables have very small variances in their own units, and `mahalanobis` refuses them as singular. What does the course say about it?",
 "The singular check uses an absolute pivot test; rescaling the variables avoids the refusal.",
 ["The variables must be linear combinations of each other, since the refusal is never raised otherwise.",
  "The engine has converted the units, so the caller should pass the variables in SI units.",
  "The refusal means there are fewer than p + 2 complete rows, and more rows will clear it."],
 "Section 31: the refusal for a singular covariance uses an absolute pivot test inside lib/linalg, so variables with very small variance in the caller's units can be refused as singular, and rescaling avoids it. The engine converts no units, and too few rows raise a different refusal.")

q(3, "NIST prints the silicon wafer 0.9 quantile as 95.1981 by R6, 95.1957 by R7 and 95.1972 by R8. How do the engine's figures compare?",
 "Each equals its golden, and each rounds to the figure NIST printed.",
 ["They agree with NIST only for R6, the rule NIST uses in its handbook.",
  "They differ in the third decimal, since NIST truncates each quantile.",
  "They match NIST only after the engine is switched to R6."],
 "Section 19 prints 95.198070, 95.195680 and 95.197243, each with a relative difference of 0 against its golden, and each rounds to 95.1981, 95.1957 and 95.1972. The truncation erratum belongs to the Grubbs G.")

emit(Q, '/root/wt-dai-d1-nextgen/tools/course-banks/dataqc/intermediate/d1i_m06.json', expect_n=15)
finish()
