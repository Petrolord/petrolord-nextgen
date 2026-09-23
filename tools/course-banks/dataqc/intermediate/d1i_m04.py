import sys, os; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# D1 Professional m04, a moving window.
# Figures from digest Section 21 (the Hampel rule, the eleven flagged rows,
# global against local, the settings table, edges, gaps, the thin window, the
# golden on the threshold), Section 1 (what the engine does not do), Section 4
# (the halfWindow refusal) and Section 31 (the despikeHampel import). Every
# gamma ray figure is EKENE-7 with the sentinel converted. No capstone well,
# input or answer appears.

q(1, "How many samples does a Hampel window hold at halfWindow 3, away from the ends of the series?",
 "7",
 ["3",
  "6",
  "4"],
 "Section 21: the window is 2 x halfWindow + 1 samples centred on the sample, so halfWindow 3 gives 7. Four is what the window at entry 0 holds once it is truncated at the top of the log.")

q(3, "At entry 70 of the gamma ray the window MAD is 7.700000 and the engine returns a threshold of 34.248060. How is that threshold built?",
 "nSigma x 1.4826 x MAD: 3 x 1.4826 x 7.700000.",
 ["nSigma x raw MAD: 3 x 7.700000.",
  "3.5 x MAD / 0.6745.",
  "nSigma x the window's sample SD."],
 "Section 21 flags a sample when |x - window median| > nSigma x 1.4826 x MAD of the window, and the threshold column prints 34.248060 for entry 70's MAD of 7.700000 at nSigma 3. The 1.4826 is `HAMPEL_MAD_SCALE`, the petrophysics conditioning engine's value.")

q(0, "Entry 145 is flagged at a deviation of only 7.240000 gAPI, while entry 70 needs far more. Why?",
 "Each window has its own MAD: entry 145's is 0.830000, giving a threshold of 3.691674.",
 ["Entry 145 sits in the upper shale, with a tighter nSigma.",
  "Entry 145 lies close to the log's end, where the window is truncated and the threshold halves.",
  "The engine lowers the threshold for any sample below its window median, and entry 145 reads low."],
 "Section 21 prints entry 145 with window MAD 0.830000 and threshold 3.691674, against entry 70's 7.700000 and 34.248060. nSigma is 3 on every row, entry 145 sits in the water sand far from either end, and the rule is the same on both sides of the median.")

q(2, "On the whole gamma ray channel the z-score flags nothing: entry 70 reads z 1.058062 and entry 170 reads 0.900269. Why does the global rule miss both spikes?",
 "The global mean and SD mix shale and sand, so a sand spike to 95.420000 gAPI looks like shale.",
 ["Two hundred and forty samples put the z ceiling below 3, so no value on the channel can be flagged.",
  "The spikes are sixty gAPI below the sand, and the z-score looks only at values above the mean.",
  "The z-score skips any sample that a Hampel window has already flagged on the same channel."],
 "Section 21: a sand spike to 95.420000 gAPI looks like shale to a global mean and SD. The ceiling rises with n, 4.248529 already at 20 values, the spikes were added to the sand, the z test is on |z|, and no rule skips another's flags.")

q(3, "How many of the eleven Hampel flags on the gamma ray at halfWindow 3 and nSigma 3 are planted defects?",
 "2, entries 70 and 170.",
 ["11, one per flag.",
  "9 of them.",
  "0, all rule artefacts."],
 "Section 21: entries 70 and 170 are the planted spikes, and the other 9 are not planted defects. Each of those 9 is a sample farther from its window median than three scaled MADs of a seven-sample window, which is what the rule flags.")

q(1, "Which setting in the Hampel table flags the fewest samples on the gamma ray?",
 "halfWindow 5 with nSigma 5: 3 flags.",
 ["halfWindow 10 with nSigma 3: 4 flags.",
  "halfWindow 3, nSigma 5: 6 flags.",
  "halfWindow 5 with nSigma 3, whose 11-sample window returns the fewest flags of all."],
 "Section 21 prints 11, 8, 6, 11, 3 and 4 flags down the table; halfWindow 5 at nSigma 5 gives the smallest count, 3. halfWindow 10 at nSigma 3 gives 4, halfWindow 3 at nSigma 5 gives 6, and halfWindow 5 at nSigma 3 gives 11.")

q(0, "Does any setting in the Hampel table flag the two planted spikes and nothing else?",
 "No. The smallest count is 3, and both spikes are flagged at every setting.",
 ["Yes: halfWindow 10 with nSigma 3 flags exactly entries 70 and 170.",
  "Yes: halfWindow 5 with nSigma 5 flags only the two planted spikes.",
  "No, because at nSigma 5 the spikes themselves drop out of the flags."],
 "Section 21's settings table reads true in the both-spikes column on every row, and its smallest flag count is 3, at halfWindow 5 and nSigma 5. halfWindow 10 at nSigma 3 flags 4, so every setting flags at least one sample beyond the two spikes.")

q(2, "What does the engine return for gamma ray entry 0 at halfWindow 3?",
 "A window of 4 samples, judged true, and no flag.",
 ["No result for an edge sample.",
  "A window padded to 7 samples with copies of entry 0, then judged in the usual way.",
  "A window of 4, judged false."],
 "Section 21: at entry 0 the window is truncated to 4 samples, `windowCount` 4, which is at least three, so it is judged and not flagged. The engine truncates at the ends and pads nothing.")

q(1, "On the EKENE-7 density, entry 80 is the first sample of the twelve-sample gap. What does `hampel` return for it?",
 "`judged` false: a missing sample is not judged.",
 ["A flag, since its window holds no present value and the MAD is zero.",
  "The window median of its neighbours, written in as a replacement.",
  "`judged` true against the 4 present samples beside it."],
 "Section 21: entry 80 is missing and is not judged (`judged` false). Missing values never enter a window, and Section 1 says the engine does not fill a value. Entry 79, beside the gap, is the one whose window holds 4 present samples.")

q(3, "On 2.3, null, null, 2.9, null, null, 2.31 with halfWindow 1, what does the engine report for entry 3?",
 "1 present sample in its window, and `judged` false.",
 ["3 samples, judged true.",
  "A refusal naming `values`.",
  "A flag: 2.9 stands apart."],
 "Section 21: entry 3 has 1 present sample in its window and `judged` false, because a window with fewer than three present samples is not judged. Missing values never enter a window, and the engine raises no refusal here.")

q(0, "The golden case hampel-on-the-threshold runs -1, 0, 1.482600, 1, 0 at halfWindow 2 and nSigma 1. Which entry does it flag?",
 "Entry 4",
 ["Entry 2",
  "Entries 2 and 4",
  "None"],
 "Section 21: entry 2 sits exactly on its threshold (window median 0, MAD 1, threshold 1.482600) and is not flagged, since the comparison is strict; the case flags entry 4.")

q(2, "Hampel flags gamma ray entry 170 and returns a `cleaned` series. What happens to the original reading of 90.590000?",
 "It stays in the input; the cleaned series carries 38.410000, and using it is the caller's decision.",
 ["The engine overwrites it in the input with the window median, since a flagged value is a known error.",
  "It is deleted from the series, and the window medians around it are recomputed without it.",
  "It is replaced by the mean of the whole channel, which the global z-score had already computed."],
 "Section 21 gives the replacement as the window median, 38.410000 for entry 170. Section 1: the engine does not fill, repair or delete a value, and `hampel` returns a cleaned series beside its flags; choosing to use it is the caller's decision.")

q(1, "Asked for a Hampel screen with halfWindow set to 0, how does the engine respond?",
 "A refusal naming `halfWindow`: it must be a whole number, 1 or more.",
 ["A window of one sample, which flags nothing because its MAD is zero.",
  "The default halfWindow of 3, recorded in the basis block as a substitution.",
  "A result in which every sample is judged false and none is flagged."],
 "Section 4 tables the refusal: \"halfWindow must be a whole number, 1 or more (the window is 2 x halfWindow + 1 samples)\". The engine refuses by name and never substitutes a setting.")

q(3, "The decision inside `hampel` is imported from the petrophysics engine's `despikeHampel`, whose own entry point turns a null into 0. What does that do to this engine's results?",
 "Nothing: `hampel` converts missing values to NaN before the call.",
 ["Every missing sample enters its window as a zero and drags the window median down with it.",
  "Missing samples are flagged, since a zero sits far from the window median of a gamma ray log.",
  "The engine refuses any series with a missing value, so the conversion never happens at all."],
 "Section 31: `hampel` converts missing values to NaN before the call, so this engine is unaffected, and Section 21 confirms missing values never enter a window. The density gap is handled without a refusal, entry 80 simply not judged.")

q(0, "At nSigma 3, the window is widened from halfWindow 3 to halfWindow 5. What happens to the flag count on the gamma ray?",
 "It stays at 11.",
 ["It falls to 3, since a wider window holds a steadier median.",
  "It rises, since more neighbours bring more chances to stand apart.",
  "It falls to 4, the count at the widest window in the table."],
 "Widening the window alone leaves the count unchanged at 11 while nSigma stays at 3. The drop to 3 flags needs nSigma 5 as well, and the count of 4 comes from the twenty-one sample window.")

emit(Q, '/root/wt-dai-d1-nextgen/tools/course-banks/dataqc/intermediate/d1i_m04.json', expect_n=15)
finish()
