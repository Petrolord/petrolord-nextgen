import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# QI Professional m03, Gathers and their QC.
# Sources: the pack's gathers and offset bins, the top picked on gather 5,
# NMO stretch and the stretch mute, residual moveout and its change of method,
# every gather's residual, fold by angle and the usable angle.

q(2, "Which of the pack's 12 CDP gathers carries the trace of Ekene-1?",
 "Gather 5, at inline 1027, crossline 2051.",
 ["Gather 0, inline 1026, crossline 2050.",
  "Gather 9, at inline 1028, crossline 2051, the gather with the same crossline on the last inline of the three.",
  "Gather 6, at inline 1027, crossline 2052, the gather beside it on the same inline as the well's trace."],
 "Gather 5 is at inline 1027, crossline 2051, the trace of Ekene-1, among 12 gathers over inlines 1026 to 1028. Gathers 6 and 9 are its neighbours, and gather 0 is the first corner of the set.")

q(0, "binOffsets puts the 13 offsets of a pack gather into bins of the stated width of 200 m. What does foldSummary report?",
 "13 traces, 13 live bins, far offset 2500.000000 m.",
 ["13 traces, 12 live bins, since the 100 m offset and the next one share the first bin.",
  "13 traces, 13 live bins, far offset 2400 m.",
  "13 traces, 7 live bins of fold 2."],
 "At 200 m bin k holds offsets from k w to (k + 1) w, and the 13 offsets from 100 to 2500 m fill 13 bins with fold 1 each. A bin is reported at its centre, (k + 0.5) w, so the far offset reads 2500.000000 m, the farthest recorded offset.")

q(3, "At what offset does foldSummary report a bin of width w?",
 "At its centre, (k + 0.5) w.",
 ["At its near edge, k w, the smallest offset the bin could hold.",
  "At the mean of the offsets that actually fall in it.",
  "At its far edge, (k + 1) w, so the far offset never understates the reach of the gather."],
 "foldSummary reports a bin at its centre, (k + 0.5) w, whatever offsets landed in it. With w at 200 m, the bin of the 2500 m trace is centred on that trace, which is why the summary's far offset matches the recording.")

q(1, "The top of the Ekene Sand is picked on the nearest offset of gather 5 about 1289 ms. Where does the pick land, and why there?",
 "1292.000000 ms, a sample on the gather's 4.000000 ms clock.",
 ["1288.796378 ms, the checkshot time, returned unchanged.",
  "1312.000000 ms, the time of the synthetic's largest reflection coefficient, since the pick follows the strongest event in the span.",
  "1289 ms exactly, interpolated between samples."],
 "An event's time on a trace is the sample of the largest amplitude within 8 ms of a stated time, so the pick lands on a sample of the 4.000000 ms clock, 1292.000000 ms. 1288.796378 ms is the checkshot time, which lies between samples, and 1312.000000 ms is outside the 8 ms reach.")

q(0, "How does nmoStretch measure the stretch of an event at offset x and zero-offset time t0?",
 "As t / t0 - 1, with t = sqrt(t0^2 + x^2 / v^2) and v the NMO velocity.",
 ["As t - t0 in milliseconds, the moveout itself.",
  "As x / (v t0), growing in a straight line with offset.",
  "As the fall of the centroid from near to far traces."],
 "The stretch is t / t0 - 1, with t = sqrt(t0^2 + x^2 / v^2) and v the NMO velocity, so it is a fraction. On gather 5 it is 0.000525 at 100 m and 0.286880 at 2500 m.")

q(3, "On gather 5 at the top, t0 1292.000000 ms, what NMO velocity does the course use for the stretch?",
 "The table's RMS velocity there, 2388.940541 m/s.",
 ["The interval velocity of the Ekene Sand, since the stretch happens inside the reservoir layer itself.",
  "The Ekene-1 oil-leg mean Vp, 2865.750738 m/s, read from the logs at the top.",
  "The best AB semblance velocity there."],
 "At the top on gather 5 the NMO velocity is the RMS velocity of the pack's table at 1292.000000 ms, 2388.940541 m/s. The log Vp of 2865.750738 m/s is a property of the sand, and semblance is how residual moveout measures, a separate step.")

q(2, "NMO correction draws the top event out at the far traces. What stretch does nmoStretch give at 2500 m on Ekene-1's gather?",
 "0.286880.",
 ["0.209511, the figure at 2100 m, the next offset in, read as the far trace of the gather.",
  "0.000525, the stretch at 100 m, since the stretch is read at the nearest offset for the gather.",
  "0.300000, the limit."],
 "The stretch at 2500 m is 0.286880, against 0.000525 at 100 m and 0.209511 at 2100 m. 0.300000 is a stated limit and no measured stretch.")

q(1, "At the top of gather 5, what offset does stretchMuteOffset return for a stated limit of 0.300000?",
 "2563.848741 m, from v t0 sqrt((1 + limit)^2 - 1).",
 ["2047.359898 m, the mute offset the same formula gives for a limit of 0.200000 at that time.",
  "2500.000000 m, since the engine caps the mute offset at the farthest offset the gather records.",
  "2388.940541 m, the velocity read as an offset."],
 "The stretch mute is the offset at which the stretch reaches the stated limit, v t0 sqrt((1 + limit)^2 - 1): 2563.848741 m at 0.300000 and 2047.359898 m at 0.200000. The engine returns the offset the formula gives, beyond the 2500 m far offset here, and 2388.940541 m/s is the velocity.")

q(3, "Which offsets of a gather enter residualMoveout's fit dt = a x^2?",
 "Those whose correlation with the pilot is at least 0.7 in size, weighted by the squared correlation.",
 ["Those at least 0.7 and positive, since a negative match is a reversed event.",
  "Every offset equally, near and far traces weighing the same.",
  "Those at least 0.5, the register's floor for a poor tie."],
 "Offsets whose correlation is at least 0.7 in size enter the fit, weighted by the squared correlation. The size counts, so on gather 5 the last three offsets, at correlations -0.776230, -0.728225 and -0.786646, are among the 13 fitted.")

q(0, "On gather 5, the last three offsets give lags of -24.000000 ms against the pilot. What does that figure mean?",
 "They sit at the 24 ms largest shift, the search limit, with correlations of -0.776230, -0.728225 and -0.786646.",
 ["They are the far-offset residual moveout, read as 24 ms of uncorrected curvature.",
  "They are the bulk shift the tie found at Ekene-1, carried onto the gather as a static on the far traces.",
  "They are a refusal: a lag at the search limit drops the offset from the fit, leaving 10 offsets fitted."],
 "The lag search runs to a largest shift of 24 ms, and the last three offsets land on that limit with negative correlations. All 13 offsets are fitted, and the far-offset residual the engine returns is 2.795940 ms; Ekene-1's bulk shift is 0.000000 ms.")

q(2, "On what condition does residualMoveout measure by AB semblance, as it does on gather 5?",
 "When the fitted lags scatter about the parabola by more than one sample, so the waveform has changed with offset.",
 ["When any offset's lag reaches the 24 ms largest shift, since a lag at the limit is no measurement of the event.",
  "When the far-offset residual exceeds the 4.000000 ms sample interval, the size at which a lag fit stops resolving it.",
  "When fewer than 3 offsets correlate with the pilot at 0.7 or more, too few to fit the curvature a x^2 at all."],
 "When the fitted lags scatter about the parabola by more than one sample the waveform has changed with offset, and the engine measures by AB semblance. On gather 5 that is the case with all 13 offsets in the fit, and its residual of 2.795940 ms is under one sample.")

q(1, "Across the 12 pack gathers, which has the largest far-offset residual moveout?",
 "Gather 3, at 3.002917 ms.",
 ["Gather 5, at 2.795940 ms, the gather at Ekene-1, where the well's tie fixes the event most firmly.",
  "Gather 10, 2.953658 ms.",
  "Gather 0, at 2.939718 ms, the corner gather of the set at inline 1026, crossline 2050."],
 "The residuals run from 2.795940 ms at gather 5, the smallest, to 3.002917 ms at gather 3, the largest; every gather picks its top at 1292.000000 ms and measures by ab-semblance. Gathers 10 and 0 lie between.")

q(3, "Mapped from offset to angle at the picked top of Ekene-1's gather, how many traces fall in each of its three 10 degree angle bins, near to far?",
 "2, 3 and 2.",
 ["1, 1 and 1, the fold of every 200 m offset bin carried across unchanged.",
  "3, 3 and 2, since the near bin holds the 3 traces stacked for the pilot.",
  "4, 4 and 5, the 13 offsets spread over three bins with none lost to the mute."],
 "Mapped to angle at 1292.000000 ms, the bins 5 to 15, 15 to 25 and 25 to 35 degrees hold fold 2, 3 and 2. In offset at 200 m every bin held fold 1, and the 3 pilot traces belong to residual moveout.")

q(0, "A study states a stretch limit of 0.200000 at the picked top of Ekene-1's gather. Which tabled offsets carry a stretch above that limit?",
 "2100 m and 2500 m, at 0.209511 and 0.286880.",
 ["2500 m alone, at 0.286880.",
  "1700 m and beyond, from 0.141649.",
  "None: the mute lies past 2500 m."],
 "At 0.200000 the stretch mute offset is 2047.359898 m, and the tabled stretch passes the limit at 2100 m (0.209511) and 2500 m (0.286880); 1700 m sits under it at 0.141649. The stated limit decides which far offsets a study keeps, and the far offsets carry the largest angles.")

q(1, "What mute do the pack's gathers carry?",
 "The kit's stated mute beyond 40 degrees, by the kit's own angle calculation, which the course does not measure.",
 ["A stretch mute at the 0.200000 limit, applied by stretchMuteOffset at every gather.",
  "A mute beyond 35.000000 degrees, the usable angle at a minimum fold of 2 on gather 5, written into the gathers so that no trace beyond it carries a sample.",
  "No mute: the 13 offsets from 100 to 2500 m are all live at every time from 1000 to 1700 ms."],
 "The gathers carry the kit's stated mute beyond 40 degrees, by the kit's own angle calculation, which the course does not measure. The stretch mute and the usable angle are figures a study computes and states; neither is written into the pack's gathers.")

emit(Q, '/root/qi-wip-qi/banks/qii_m03.json', expect_n=15)
finish()
