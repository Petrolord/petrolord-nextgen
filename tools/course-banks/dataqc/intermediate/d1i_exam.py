import sys, os; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D1 Professional final exam, 42 questions across m01 to m06.
# Figures from digest Sections 17 to 24, 31 and 32, with Section 1, 2 and 4
# recaps. TWO-MODULE questions are marked; there are ten. ROUNDING TRAP: no
# key is a figure made by re-rounding or combining printed six-decimal figures.
# SD TRAP: every ceiling statement names the sample SD. QUARTILE TRAP: every
# fence or quartile a distractor quotes belongs to a rule, k or series other
# than the one the prompt states. No capstone well, input or answer appears.

# 1 TWO-MODULE m01 + m02
q(2, "Gauge entry 7 reads 2.845783 by the z-score and 186.162000 by the modified z-score. What accounts for the gap?",
 "The z divides by a sample SD the glitch inflated to 8.732220; the MAD of 0.100000 is untouched by it.",
 ["The modified z-score squares each deviation from the median before it divides by the MAD.",
  "The z-score defaults to the population SD, which damps the distance of every reading.",
  "The modified z-score counts the glitch twice, once in the median and once in the MAD."],
 "Section 18: the median is 212.500000 and the MAD 0.100000 with or without entry 7, while the sample SD is 8.732220 with it and 0.126930 without. The z default is the sample SD, and the modified z-score is linear in the deviation.")

# 2 TWO-MODULE m01 + m05
q(0, "On the fourteen core plugs the z-score flags nothing and Grubbs' test rejects, yet both measure the same 2.985356. What differs?",
 "The line it is compared with: a fixed 3 for the z-score, a critical 2.507321 for Grubbs.",
 ["The spread: Grubbs recomputes the SD with the suspect plug left out before it divides.",
  "The centre: Grubbs measures from the median of the plugs, which the fractured plug cannot move.",
  "The sample: Grubbs tests the thirteen ordinary plugs and compares entry 8 with them."],
 "Section 22: G is the largest |Y - mean| / s with the sample SD, 2.985356 on these plugs, the same as the largest |z| of Section 17. The z-score compares it with 3; Grubbs with 2.507321 for n = 14 at alpha 0.05, two-sided.")

# 3 TWO-MODULE m02 + m05
q(3, "On the two-plug copy, the modified z-score flags entries 2 and 8 while Grubbs' test rejects nothing. Why do the two families part?",
 "Two plugs barely move a median, while the second plug lifts the sample SD to 0.024800.",
 ["The modified z-score uses a lower threshold than Grubbs' critical value of 2.507321.",
  "Grubbs' test refuses a set with two outliers in it, so it returns a null result there instead.",
  "The modified z-score runs on the population SD, which the second plug cannot move."],
 "Section 24: the modified z and the fences measure against a median and quartiles the outliers barely move, and z and Grubbs against a mean and SD they help set. Section 22 prints the sample SD rising from 0.019859 to 0.024800 with the second plug, and G falling below the critical value.")

# 4
q(1, "At R7 and k 1.5, which gauge entries do Tukey's fences flag?",
 "Entry 7 alone",
 ["Entries 1 and 7",
  "No entry",
  "Entry 1 alone"],
 "Section 24's gauge row reads 7 under Tukey fences, R7 k 1.5. Entries 1 and 7 is the Hampel cell, and the z-score is the method that flags none.")

# 5 TWO-MODULE m03 + m04
q(2, "Which two runs catch the gamma ray spike at entry 170?",
 "Tukey's fences on the water sand alone, and the Hampel window on the whole channel.",
 ["Tukey's fences on the whole log, and the z-score on the whole channel.",
  "The z-score on the whole channel, and the Hampel window on the same channel.",
  "Only the Hampel window, since no global rule can see a spike inside a sand."],
 "Section 20: on the water sand the default fences flag entry 170, and on the whole log they flag 0. Section 21: Hampel flags entry 170 at halfWindow 3 and nSigma 3, while the z-score on the whole channel reads 0.900269 and flags nothing.")

# 6 TWO-MODULE m01 + m03
q(3, "Entry 170 reads z 0.900269 on the whole gamma ray channel. Where does its reading of 90.590000 sit against the water sand's default fences?",
 "Beyond the upper fence of 48.685000, so it is flagged.",
 ["Inside the upper fence, since a z below 3 cannot cross a fence.",
  "Beyond the R6 upper fence of 49.117500 alone, and inside the R7 fence.",
  "Inside, because the fences are built on the whole log's spread."],
 "Section 20 prints the default R7, k 1.5 fences on the water sand as 21.905000 and 48.685000, flagging entry 170. 90.590000 lies beyond both the R7 and the R6 upper fence; the whole-log fences, -57.070000 and 186.810000, belong to a different run.")

# 7 TWO-MODULE m02 + m04
q(1, "Which statement about the constants 0.6745 and 1.4826 is correct?",
 "The modified z uses 0.6745 as printed and Hampel uses 1.4826, so the two are close without being reciprocals.",
 ["The engine computes 0.6745 as 1 / 1.4826 at run time, so the two are exact reciprocals.",
  "Both come from the petrophysics conditioning engine, which is why they pair so neatly.",
  "The modified z-score divides by 1.4826 x MAD, and Hampel multiplies the raw MAD by 0.6745."],
 "Section 18: 1 / 1.4826 is 0.674491, and the engine uses 0.6745 as printed, from Iglewicz and Hoaglin. Section 1 gives 1.4826 as the conditioning engine's `HAMPEL_MAD_SCALE`, and Section 21 multiplies the raw MAD by it.")

# 8 TWO-MODULE m03 + m04
q(0, "Two golden cases place a value exactly on its line: -4 and 12 on Tukey fences, and entry 2 at 1.482600 on its Hampel threshold. Which does the engine flag?",
 "None of them.",
 ["All three, since reaching a line counts as crossing it.",
  "The fence values -4 and 12, and not the Hampel entry.",
  "The Hampel entry, and neither fence value."],
 "Section 20: iqr-exactly-on-both-fences returns 0 flags; Section 21: entry 2 sits on its threshold and is not flagged, the case flagging entry 4. A value strictly outside a fence, or strictly beyond a threshold, is what fires.")

# 9 TWO-MODULE m01 + m05
q(1, "Eight values cannot pass a z of 3 with the sample SD. What two-sided Grubbs critical value do they face at alpha 0.05?",
 "2.126645",
 ["2.031652",
  "2.474874",
  "2.468765"],
 "For eight values the table's two-tailed bar is 2.126645; the one-tailed bar, 2.031652, is the one NIST's uranium example uses. The ceiling of 2.474874 is how far any G in eight values can reach, and 2.468765 is the uranium G itself.")

# 10
q(2, "Which comparison decides the Hampel flag at gamma ray entry 70?",
 "Its deviation of 58.420000 from the window median against a threshold of 34.248060.",
 ["Its z of 1.058062 on the whole channel against the z threshold of 3.",
  "Its reading of 95.420000 against the water sand's upper fence of 48.685000.",
  "Its deviation of 52.180000 against a threshold of 14.766696 in its window."],
 "Section 21's row for entry 70: window median 37.000000, MAD 7.700000, threshold 34.248060 and a derived deviation of 58.420000. 52.180000 and 14.766696 belong to entry 170, and entry 70 sits in the oil sand, outside the water sand run.")

# 11
q(3, "Keeping the seven-sample window, a caller asks for a sample to sit four scaled MADs out before it is flagged. How many gamma ray flags remain?",
 "8 samples",
 ["11 samples",
  "6 samples",
  "3 samples"],
 "Moving nSigma from 3 to 4 at halfWindow 3 takes the count from 11 down to 8. A count of 6 needs nSigma 5 at that window, and 3 needs nSigma 5 with an eleven-sample window.")

# 12
q(1, "Gamma ray entries 49 and 50 both carry a Hampel threshold of 6.582744. What do the two rows share?",
 "The same window median, 36.540000, and the same window MAD, 1.480000.",
 ["The same reading, which puts the two of them the same distance from any median.",
  "A window truncated at the top of the log, which fixes the threshold.",
  "A MAD of zero, which the engine replaces with a default spread."],
 "Section 21 prints both rows with window median 36.540000 and MAD 1.480000; the threshold is nSigma x 1.4826 x MAD, so it matches. The readings differ, 24.810000 and 24.830000, and entries 49 and 50 sit far from the top of the log.")

# 13
q(0, "Entry 30 reads 90.540000 gAPI against a window median of 96.290000. How can the Hampel rule flag a reading below its neighbours?",
 "The test is on |x - window median|, and 5.750000 clears the threshold of 4.848102.",
 ["It cannot; entry 30 is flagged by the z-score and reported through the Hampel output.",
  "Low readings are compared with a halved threshold, which 5.750000 clears.",
  "The engine flags any reading below its window median in a shale."],
 "Section 21: a sample is flagged when |x - window median| > nSigma x 1.4826 x MAD, strictly, in either direction. Entry 30's derived deviation is 5.750000 and its threshold 4.848102; the z-score on the channel flags nothing.")

# 14
q(2, "At halfWindow 3, which is the first gamma ray entry whose window holds all 7 samples?",
 "Entry 3",
 ["Entry 0",
  "Entry 6",
  "Entry 1"],
 "Section 21's edge table prints `windowCount` 4, 5, 6 and 7 for entries 0 to 3. Entry 3 is the first with three samples on each side.")

# 15
q(2, "Tightening alpha to 0.001000 moves the density and neutron cutoff up to 13.815511. What happens to the planted row?",
 "Still flagged: 22.397696 lies beyond 13.815511, and no other row is.",
 ["It drops out, since the cutoff now sits above every squared distance.",
  "It is joined by entries 62 and 56, since a stricter alpha lets more rows in.",
  "It is joined by entry 62."],
 "The alpha table reads 1 row flagged at 0.001000. Entry 60's d^2 of 22.397696 clears 13.815511 with room to spare, while entry 62, at 6.581737, needs a cutoff as loose as the one at 0.05.")

# 16
q(0, "What centre does `mahalanobis` use for the oil sand density?",
 "The classical mean, 2.280625 g/cm3.",
 ["The median density, so entry 60 cannot pull it.",
  "A robust centre reweighted away from entry 60.",
  "Entry 60's own density."],
 "Section 23 prints the centre RHOB as 2.280625 g/cm3 from the classical mean, and states the classical estimates are pulled by outliers; a robust covariance is not built.")

# 17
q(1, "The oil sand's density and neutron have a derived correlation of -0.836264. What does that say about entry 60?",
 "Density falls as neutron rises, and entry 60 reads low on both.",
 ["Density and neutron rise together, and entry 60 follows that trend.",
  "The two channels are unrelated, so entry 60 is judged one channel at a time.",
  "Entry 60 is the row that makes the correlation negative in the first place."],
 "Section 2: inside a sand density and neutron move against each other. Entry 60 reads RHOB 2.221000 against a centre of 2.280625 and NPHI 0.188000 against 0.243313, low on both, with z -1.074527 and -1.645167.")

# 18
q(2, "A caller passes three complete rows of density and neutron to `mahalanobis`. What comes back?",
 "A refusal naming `rows`: at least p + 2 = 4 complete rows are needed.",
 ["Three squared distances with a warning that the covariance is uncertain.",
  "A refusal naming `alpha`, since the cutoff needs more degrees of freedom.",
  "A refusal for a singular covariance, since three points always lie in a plane."],
 "Section 4 tables the refusal for too few rows, field `rows`: \"rows need at least p + 2 = 4 complete rows for a sample covariance of 2 variables\". The engine returns no partial result.")

# 19
q(3, "Meaning five percent, an analyst types alpha 5 into `grubbsTest`. How does the engine respond?",
 "It refuses, naming `alpha`: a significance level must lie strictly between 0 and 1.",
 ["It divides by 100 and runs the test at 0.05.",
  "It runs the test at alpha 5 and rejects every sample.",
  "It clamps alpha to 1 and reports that nothing is rejected."],
 "Section 4 tables the refusal for alpha as a percentage, field `alpha`: \"alpha must be a significance level strictly between 0 and 1\". The engine refuses by name and never rescales an input.")

# 20
q(2, "Twenty values are screened with Grubbs' test at alpha 0.05, looking in both directions. Which bar must G clear?",
 "2.708246",
 ["2.556581",
  "4.248529",
  "2.908473"],
 "The critical table's n = 20 row reads 2.708246 for both tails and 2.556581 for one. G itself can reach 4.248529 on twenty values, and 2.908473 belongs to thirty.")

# 21
q(1, "In the two-plug copy, which entry does Grubbs' test name as its suspect?",
 "Entry 8",
 ["Entry 2",
  "Both 2 and 8",
  "No suspect"],
 "Section 22's masking row names suspect entry 8 with reject false. The test names one suspect, the value farthest from the mean, whether or not it rejects.")

# 22 TWO-MODULE m01 + m05
q(2, "On the gauge, Grubbs' test rejects entry 7 while `zScores` flags nothing, and G is the largest |z|. How can both be right?",
 "Grubbs sets 2.845783 against a critical 2.289954 for ten values; the z-score sets it against 3.",
 ["Grubbs uses the population SD on the gauge, which lifts entry 7 above the z ceiling of 2.846050.",
  "The z-score was run with entry 7 left out, so its largest z belongs to an ordinary reading.",
  "Grubbs rejects on the median, so it sees the glitch in the way the modified z-score does."],
 "Section 22: G is the largest |z| with the sample SD, and the two-sided critical at n = 10 is 2.289954. Section 17 gives entry 7's z as 2.845783, below 3; Section 24 has Grubbs rejecting entry 7 on the gauge.")

# 23
q(3, "Hampel flags gauge entry 1 as well as the glitch. Which description of entry 1 does the course support?",
 "A reading the rule flags that is not the planted glitch, which is entry 7.",
 ["A second planted glitch, placed to test whether a method can find two.",
  "A reading the engine has marked wrong and replaced in the input.",
  "A sentinel value that completeness counts as present."],
 "Section 2 plants one gauge defect, at entry 7, and Section 24 shows Hampel flagging 1 and 7. Section 1: the engine does not decide a flagged value is wrong and does not repair it.")

# 24
q(0, "At alpha 0.100000 three oil sand rows are flagged. Which row joins entries 60 and 62?",
 "Entry 56, at 5.442663 against a cutoff of 4.605170.",
 ["Entry 80, the first density gap row, now counted.",
  "Entry 70, the gamma ray spike in the oil sand.",
  "Entry 61, the row beside the planted row at entry 60 in depth."],
 "Section 23 prints entry 56's d^2 as 5.442663, the third largest, and the cutoff at 0.100000 as 4.605170. Entries 80 to 91 are skipped rows, and the gamma ray is not an input to this distance.")

# 25
q(1, "Two analysts quote 48.685000 and 186.810000 as the R7, k 1.5 upper gamma ray fence, and both ran the engine correctly. What differs?",
 "The series: the water sand alone against the whole log, shale included.",
 ["The quartile rule: one used R7 and the other R6 on the same series.",
  "The multiplier: one used k 1.5 and the other the outer fence multiplier of 3.",
  "The spread: one used the population SD in place of the sample SD."],
 "Same rule, same k: 48.685000 comes from the seventy water sand samples and 186.810000 from the full 240-sample log with the shale in it. A switch to R6 would give 49.117500 on the sand, k 3 gives 58.727500, and a Tukey fence uses no standard deviation.")

# 26
q(2, "What is the water sand gamma ray's third quartile by R6?",
 "38.737500",
 ["38.642500",
  "38.725833",
  "31.817500"],
 "Reading the third quartile column of the water sand table: R6 gives 38.737500, while R7's 38.642500 and R8's 38.725833 sit below it. The figure 31.817500 comes from the first quartile column.")

# 27
q(3, "Excel, R and numpy share a default quantile rule. Which one is it, and what position does it use?",
 "R7, with h = 1 + p(N - 1).",
 ["R6, with h = p(N + 1).",
  "R8, with h = p(N + 1/3) + 1/3.",
  "R7, with h = p(N + 1)."],
 "Section 19: R7 is the default of Excel, R and numpy, with h = 1 + p(N - 1). p(N + 1) is R6's position, NIST's rule, and p(N + 1/3) + 1/3 is R8's.")

# 28
q(0, "On the fourteen core plugs, which pair is the centre and spread of the modified z-score?",
 "Median 0.215500 and raw MAD 0.007500.",
 ["Mean 0.221714 and sample SD 0.019859.",
  "Median 0.215500 and sample SD 0.019859.",
  "Mean 0.217154 and raw MAD 0.007500."],
 "Section 18 prints the core median 0.215500 and MAD 0.007500. 0.221714 and 0.019859 are the mean and sample SD of Section 17, and 0.217154 the mean with entry 8 left out.")

# 29 TWO-MODULE m01 + m06
q(1, "NIST's uranium example has eight values, and the engine's largest |z| is 2.468765. How close is that to what eight values allow?",
 "Just under the ceiling of 2.474874, so no z in the set could pass 3.",
 ["Well past the ceiling, which the population SD lifts to 3 at eight values.",
  "Level with the Grubbs critical value of 2.031652, which is the ceiling.",
  "Far below any ceiling, since the uranium values are close together."],
 "Section 17 prints the uranium largest |z| as 2.468765 and the sample SD ceiling at n = 8 as 2.474874. 2.031652 is the one-sided Grubbs critical, a separate quantity, and the test rejects because G is above it.")

# 30
q(3, "The engine's reason for the gauge flag prints the modified z with every digit. Which figure does a report quote?",
 "186.162000, the statistic field at six decimals.",
 ["The reason's full string of digits, since it is the more exact figure.",
  "186.159450, the figure the exact reciprocal of 1.4826 would give.",
  "2.845783, the z of the same reading, which needs no rounding."],
 "Section 18 quotes the reason verbatim as the engine's words and gives the field as 186.162000. Section 31: a lesson quotes the field at six decimals and a reason only as the engine's own words. 186.159450 is derived with 0.674491.")

# 31
q(2, "Density and neutron should move against each other in a sand. Which method measures a row against that relationship?",
 "The Mahalanobis distance",
 ["The Hampel window, run on each channel",
  "Tukey's fences on each channel",
  "Grubbs' test on each channel"],
 "Section 24: Mahalanobis measures against a correlation. Section 23: entry 60 is ordinary on each channel alone, with 0 flags from each single-channel z-score, and only the distance sees the pair.")

# 32
q(0, "How should a report treat the nine gamma ray Hampel flags that are not planted spikes?",
 "As flags from the stated rule, each a question about its sample.",
 ["As engine errors, to be discarded before the report is written.",
  "As defects the generator planted without recording them.",
  "As proof that halfWindow 3 is the wrong window."],
 "The digest counts 9 Hampel flags on the gamma ray that no generator planted. The course's vocabulary treats every one of them as a question for someone who knows the log, and nothing about them says the engine erred or that the window is badly set.")

# 33
q(1, "The gauge's two standard deviations are 8.732220 and 8.284111. Which one divides by n?",
 "8.284111, the population SD.",
 ["8.732220, the larger of the two.",
  "Neither; both divide by n - 1.",
  "8.732220, the sample SD."],
 "Section 17: the sample SD, which divides by n - 1, is 8.732220, and the population SD, which divides by n, is 8.284111. Dividing by the larger number gives the smaller spread.")

# 34
q(1, "At R7 and k 3, where is the lower fence on the water sand gamma ray?",
 "11.862500",
 ["21.905000",
  "21.437500",
  "-57.070000"],
 "Section 20 prints the R7, k 3 lower fence as 11.862500. 21.905000 is the R7, k 1.5 fence, 21.437500 the R6, k 1.5 fence, and -57.070000 the whole-log fence at the defaults.")

# 35
q(2, "At n = 6 the two-sided Grubbs critical is 1.887145 and the largest possible G is 2.041241. What follows for a set of six values?",
 "A rejection is reachable, since the bar sits below what six values allow.",
 ["No rejection is possible, since G can never exceed the critical value.",
  "The test is refused below ten values, whatever G reads.",
  "Only a one-sided test can reject, at 1.822120."],
 "Section 22 prints 1.887145 two-sided, 1.822120 one-sided and a largest possible G of 2.041241 at n = 6. The critical value sits below the ceiling on every row of the table, so a large enough G rejects either way.")

# 36
q(2, "On the EKENE-7 density, entry 79 sits beside the twelve-sample gap. How many present samples does its window hold at halfWindow 3?",
 "4 present samples",
 ["7 present samples",
  "3 present samples",
  "1 present sample"],
 "The gap side of entry 79's window falls on missing densities, which never enter a window, leaving 4 present samples. Since that is at least three, the point is judged.")

# 37 TWO-MODULE m01 + m04
q(3, "The z-score misses both the gamma ray spike at entry 70 and the fractured core plug. Are the reasons the same?",
 "No: the log's spread is wide because shale and sand mix; the plug's because the plug is in it.",
 ["Yes: both series are too short for the z ceiling to pass 3 with the sample SD.",
  "Yes: both are measured with the population SD, which damps every distance.",
  "No: the spike is negative, and the z-score looks only above the mean."],
 "Section 21: a sand spike looks like shale to a global mean and SD. Section 17: the plug is measured against a spread that includes itself, 0.019859 against 0.010574 without it. Fourteen plugs could reach 3.474396, and the gamma ray holds 240 samples.")

# 38
q(1, "Count the methods in the comparison table that find the gauge glitch at entry 7.",
 "Four of the five: all but the z-score.",
 ["All five, since the glitch is the one planted defect in ten readings.",
  "Two: the modified z-score and Tukey's fences.",
  "Three: all but the z-score and Grubbs' test."],
 "Across the gauge row of the comparison only the z-score column is empty: the modified z-score, Tukey's fences, the Hampel window and Grubbs' test all list entry 7. Ten readings cap the sample SD z at 2.846050, under 3.")

# 39
q(2, "On how many degrees of freedom is the chi-square cutoff taken for the density and neutron pair?",
 "2, the number of variables.",
 ["48, the complete rows used.",
  "60, the rows in the oil sand.",
  "1, one distance per row."],
 "The chi-square quantile is taken on p degrees of freedom, p being the number of variables in each row. Density and neutron make p = 2; the count of rows, 48 used out of 60, sets the covariance estimate and leaves the degrees of freedom alone.")

# 40
q(0, "NIST prints the uranium critical value as 2.032. How does it relate to the engine's 2.031652?",
 "It is the engine's value rounded to three decimals.",
 ["It is a different formula, one-sided where the engine is two-sided.",
  "It is truncated, the same way NIST prints the uranium G.",
  "It comes from a larger sample than the eight values the engine used."],
 "Section 22 prints the engine's critical 2.031652 against the printed 2.032 for the one-sided test, and the test rejects either way. Section 31's truncation erratum concerns the printed G, 2.4687.")

# 41
q(3, "In the golden on-the-fence case, -4, 2, 2, 3, 4, 5, 6, 6, 12, what quartiles does R7 return?",
 "Q1 2 and Q3 6, an IQR of 4.",
 ["Q1 -4 and Q3 12, the extreme values.",
  "Q1 3 and Q3 5, the inner values.",
  "Q1 2 and Q3 12, an IQR of 10."],
 "Section 20: the engine returns Q1 2, Q3 6 and IQR 4, which with k 1.5 put the fences at -4 and 12. -4 and 12 are the fences and the extremes of the data.")

# 42
q(1, "Hampel flags gamma ray entry 145. What does the `cleaned` series carry at that entry?",
 "36.810000, its window median.",
 ["29.570000, the reading itself.",
  "3.691674, the threshold.",
  "Nothing, since it is deleted."],
 "Section 21 prints entry 145 with reading 29.570000, window median 36.810000 and replacement 36.810000. The cleaned series carries the replacement, and the engine deletes nothing.")

emit(Q, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'd1i_exam.json'), expect_n=42)
finish()
