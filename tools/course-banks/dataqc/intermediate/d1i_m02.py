import sys, os; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D1 Professional m02, the median and the MAD.
# Figures from digest Section 18 (median, raw MAD, modified z-score, the
# printed constant, the MAD of zero), Section 1 (CONSTANTS), Section 4 (the
# refusal) and Section 32 (the engine's word "potential outlier"). Section 17
# figures appear as recaps of m01. No capstone well, input or answer appears.

q(0, "What does the engine return as the MAD of a series?",
 "The raw median of |x - median|, with no scale factor applied.",
 ["The median of |x - median| multiplied by 1.4826, so that it reads as a standard deviation.",
  "The mean of |x - mean|.",
  "The median of the squared deviations from the median, taken before any square root."],
 "Section 18 defines the MAD as the raw median of |x - median|. The 1.4826 scale belongs to the Hampel window, which multiplies the raw MAD by it; an average of distances from the mean is a different statistic that one glitch would drag.")

q(3, "Which two gauge statistics stay the same when the glitch at entry 7 is left out?",
 "The median, 212.500000, and the MAD, 0.100000.",
 ["The mean and the median.",
  "The sample SD and the MAD.",
  "The mean and the sample SD."],
 "Section 18 prints both rows: the median is 212.500000 and the MAD 0.100000 either way. The mean moves from 215.250000 to 212.488889 and the sample SD from 8.732220 to 0.126930 when entry 7 goes.")

q(1, "What modified z-score does the engine return for the gauge glitch at entry 7?",
 "186.162000",
 ["186.159450",
  "2.845783",
  "5.890633"],
 "M = 0.6745 (x - median) / MAD with the median 212.500000 and the MAD 0.100000 gives the engine's 186.162000. 186.159450 is the same reading with 1 / 1.4826 in place of 0.6745, 2.845783 is the ordinary z, and 5.890633 is the core plugs' largest M.")

q(2, "The engine multiplies by 0.6745 in the modified z-score. What is that constant?",
 "The figure as Iglewicz and Hoaglin print it and NIST/SEMATECH 1.3.5.17 reproduces it.",
 ["The exact reciprocal of the Hampel scale 1.4826, carried to four decimals.",
  "A Petrolord choice tuned on the Ekene field data so that the gauge glitch clears the 3.5 threshold.",
  "The ratio of the population SD to the sample SD at ten readings."],
 "Section 1 exports `MODIFIED_Z_SCALE` 0.674500 with Iglewicz and Hoaglin (1993), as NIST prints it, as its source, and Section 18 says the engine uses 0.6745 as printed. The reciprocal of 1.4826 is 0.674491, a different number, and the constant was not fitted to any dataset.")

q(0, "On the EKENE-7 core plugs the median is 0.215500 and the MAD 0.007500. What does the modified z-score report?",
 "A largest |M| of 5.890633 at entry 8, the only entry flagged.",
 ["A largest |M| of 2.985356 at entry 8, below 3.5, so nothing is flagged.",
  "Entries 2 and 8 flagged, since both sit far above the median of the fourteen plugs.",
  "A refusal: the plugs are too few."],
 "Section 18 prints the core row: largest |M| 5.890633, entry 8 flagged. 2.985356 is the ordinary z of the same plug. Entry 2 is flagged only in the copy with a second high plug, and fourteen plugs raise no refusal.")

q(3, "The series 5, 5, 5, 6, 7 is passed to `modifiedZScores`. What does the engine do?",
 "It refuses, naming the field `values`, because the MAD is zero.",
 ["It falls back to the sample SD and reports the result as a modified z-score.",
  "It returns an M of zero for every entry, since each sits within one MAD.",
  "It flags 6 and 7, the only values that are not equal to the median."],
 "Section 4 and Section 18: at least half the values equal the median, so the MAD is 0 and the engine refuses with \"values have MAD = 0: at least half the present values equal the median, so the modified z-score is undefined\". Section 31 lists a fallback for a MAD of zero as not built.")

q(0, "Under which condition does a median absolute deviation come out at zero?",
 "At least half the present values equal the median.",
 ["Every present value is the same, and nothing less than that will do it.",
  "The series has fewer than five present values in it.",
  "The mean and the median of the series coincide exactly."],
 "The middle of the absolute deviations is zero once half or more of them are zero, which happens as soon as at least half the present values sit on the median. The 5, 5, 5, 6, 7 case shows that a spread in the data does not prevent it, and neither the length of the series nor the mean has anything to do with it.")

q(2, "What is the engine's own label for a value whose modified z-score is beyond 3.5?",
 "A potential outlier",
 ["A confirmed outlier, since the modified z-score is the robust test",
  "An invalid reading",
  "A planted defect, to be removed before any statistic is computed"],
 "Section 32 records the engine's word for the modified z as \"potential outlier\", from Iglewicz and Hoaglin as NIST prints them. A flag is a question about the value; invalid is the range check's language, and planted defects are the generator's list.")

q(0, "With 1 / 1.4826 in place of 0.6745, the gauge glitch would read 186.159450 against the engine's 186.162000. What does that do to the flag?",
 "Nothing: both figures sit far beyond 3.5, so entry 7 is flagged either way.",
 ["It removes the flag at entry 7.",
  "It adds a flag at entry 1, the highest of the ordinary readings, which the reciprocal now reaches.",
  "It changes the engine's refusal."],
 "Section 18 derives 186.159450 with 0.674491 against the engine's 186.162000. Both are enormous next to 3.5, so the flag at entry 7 stands. Nothing about entry 1 or any refusal changes with the constant.")

q(3, "Why does the modified z-score catch the gauge glitch that the ordinary z-score missed?",
 "The median and the MAD are the same with or without entry 7, so the glitch is measured against statistics it did not move.",
 ["The modified z-score has a lower threshold than 3, so a smaller distance is enough to raise a flag on the gauge.",
  "The modified z-score divides by the population SD, which is smaller than the sample SD on the gauge readings.",
  "The modified z-score leaves the largest reading out before it computes anything, so entry 7 cannot mask itself."],
 "Section 18: median 212.500000 and MAD 0.100000 in both rows, while the sample SD falls from 8.732220 to 0.126930 without entry 7. The threshold is 3.5, higher than 3, the modified z uses no standard deviation, and every present value takes part.")

q(2, "The modified z-score and the Hampel window both build a spread from the raw MAD. How does each use it?",
 "The modified z multiplies the deviation by 0.6745 and divides by the raw MAD; Hampel multiplies the raw MAD by 1.4826.",
 ["Both multiply the raw MAD by 1.4826 first, and the modified z then scales its threshold of 3.5 by 0.6745.",
  "The modified z divides by 1.4826 x MAD and Hampel by 0.6745 x MAD, the two scales swapped between them.",
  "Neither uses the raw MAD: both take the sample SD of the values nearest the median and call it a MAD."],
 "Section 18 gives M = 0.6745 (x - median) / MAD with the raw MAD, and says Hampel's scale, 1.4826 x MAD, is the same idea from the other side. Section 1 exports the two constants separately, `MODIFIED_Z_SCALE` 0.674500 and `HAMPEL_MAD_SCALE` 1.482600.")

q(3, "The mean of the ten gauge readings is 215.250000. What is the mean of the nine readings left once entry 7 is removed?",
 "212.488889",
 ["212.500000",
  "215.250000",
  "212.400000"],
 "Section 18 prints the derived mean with entry 7 left out as 212.488889, computed by lib/stats `mean`. 212.500000 is the median of either set, and 215.250000 is the mean with the glitch still in.")

q(1, "Once the glitch is dropped, how widely do the nine ordinary gauge readings scatter by the sample SD?",
 "0.126930",
 ["0.100000",
  "8.732220",
  "8.284111"],
 "Section 18 prints 0.126930 for the nine readings. 0.100000 is the MAD, 8.732220 the sample SD with the glitch in, and 8.284111 the population SD of all ten. One reading takes the sample SD from 0.126930 to 8.732220.")

q(1, "Where does the Hampel scale 1.4826, the other constant that works with a raw MAD, come from?",
 "The petrophysics conditioning engine, despikeHampel.",
 ["Iglewicz and Hoaglin, as NIST/SEMATECH prints it.",
  "Tukey, as the multiplier of the inner fence.",
  "A Petrolord choice, fitted to the gauge readings."],
 "Section 1 exports `HAMPEL_MAD_SCALE` 1.482600 with the petrophysics conditioning engine's despikeHampel as its source. Iglewicz and Hoaglin supply 0.6745 and the threshold 3.5, Tukey's multiplier is 1.5, and no constant was fitted to Ekene data.")

q(2, "A value has a modified z-score of exactly 3.5. Is it labelled?",
 "No. The label needs |M| strictly beyond 3.5.",
 ["Yes. A value on the threshold counts as beyond it, so the label fires at 3.5 exactly.",
  "Only if the MAD is below 0.100000, which makes a figure on the threshold unstable.",
  "The engine refuses, because a statistic equal to its threshold is ambiguous."],
 "Section 18 labels a potential outlier when |M| > 3.5. The comparison is strict, as every flag in the engine is, so a value exactly on 3.5 carries no label and no refusal is raised.")

emit(Q, '/root/wt-dai-d1-nextgen/tools/course-banks/dataqc/intermediate/d1i_m02.json', expect_n=15)
finish()
