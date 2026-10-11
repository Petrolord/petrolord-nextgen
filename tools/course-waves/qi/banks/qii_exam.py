import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# QI Professional final exam, 42 questions across the six modules: from
# feasibility to the tie, the tie and the field wavelet, gathers and their QC,
# angles from velocity, AVO volumes, AVO at the wells. Twelve questions need
# two modules at once (marked CROSS).

# ---- m01 from feasibility to the tie ----

q(2, "On Ekene-1's full-stack trace clock, the synthetic built from the pack's logs has how many live samples, and where is its largest reflection coefficient?",
 "26 live samples, with the largest coefficient -0.190340 at 1312.000000 ms.",
 ["800 live samples, one for every log sample of Ekene-1, with the largest coefficient at 1288.796378 ms, the top in time.",
  "31 live samples, the well wavelet's window of 2 x 15 + 1, with the largest coefficient a positive one at the top of the sand.",
  "26 live samples, with the largest coefficient at 1292.000000 ms, the top picked on gather 5, where the sand's impedance rises."],
 "The pack's logs span 4931.500000 to 5331.000000 ft and give 26 live samples on the 4.000000 ms clock; the largest coefficient is -0.190340 at 1312.000000 ms, a fall in impedance downwards. 800 is Ekene-1's log sample count, 31 the well wavelet's window and 1292.000000 ms the gather pick.")

q(0, "Asked for a well wavelet at Ekene-1 from the pack's logs, what does Seismolord answer, in its own words?",
 "\"The well reflectivity is flat over the seismic at the well, so there is nothing to extract a wavelet from.\"",
 ["\"A spectrum needs at least 8 samples.\", the spectrum check run on a log too short for the wavelet's window.",
  "\"Give at least one trace.\", because the extraction found no trace sample with live reflectivity beneath it.",
  "It returns the 31-sample least-squares wavelet with its phase measured, since Ekene-1 ties at a correlation of 0.983438."],
 "The extraction keeps only trace samples whose whole 2 x 15 + 1 = 31-sample window sits on live reflectivity, and the pack's logs give 26 live samples, so none qualifies and Seismolord refuses in those words. The other two messages are amplitudeSpectrum's and averageSpectrum's.")

q(3, "Which statement about the statistical wavelet that extractStatisticalWavelet builds is true?",
 "Its spectrum is the source wavelet's when the reflectivity is white, and its phase is assumed zero.",
 ["Its phase is measured, as the least-squares wavelet from the well's reflectivity.",
  "It needs a log long enough for the wavelet asked for.",
  "It is scaled to unit energy and aligned by up to 5 samples."],
 "The engine takes the amplitude spectrum of the traces' autocorrelation to zero phase, reads the stated window length (120 ms) and smoothing (5 Hz), Hann-tapers the lags and normalises the peak to 1. A measured phase and the need for a long log belong to the well wavelet; unit energy and the 5-sample lag belong to compareWavelets.")

q(1, "A 25 Hz Ricker on the same 4.000000 ms clock is set beside the four statistical wavelets. What centroid does it carry?",
 "26.596139 Hz, above every statistical wavelet's centroid, the highest of which is Ekene-4's 26.581599 Hz.",
 ["25.039790 Hz, the same as its peak, since a Ricker's power sits evenly about its peak.",
  "25.155328 Hz, the centroid of the field wavelet averaged from the four wells.",
  "26.530951 Hz, below Ekene-4's own centroid, since a Ricker chosen by its peak carries less power at high frequency."],
 "On the same clock the Ricker's peak is 25.039790 Hz and its centroid 26.596139 Hz, while the wells' centroids run from 23.431642 Hz at Ekene-2 to 26.581599 Hz at Ekene-4. 25.155328 Hz is the average wavelet's centroid and 26.530951 Hz is Ekene-4's peak.")

q(0, "In which units does the Professional tier read its depths, offsets, times and velocities?",
 "Depth in feet, offsets in metres as the kit's gathers record them, times in milliseconds two-way, velocities in m/s.",
 ["Depth and offsets both in feet, the offsets converted from the kit's metres, velocities in m/s.",
  "Depth in feet, offsets in metres, times one-way as checkshots record them, velocities in m/s.",
  "Depth in feet, offsets in metres, times two-way, and seismic amplitudes as reflection coefficients with a physical scale."],
 "The tier keeps depth in feet, offsets in metres, two-way times in milliseconds and velocities in m/s; seismic amplitudes stay in the kit's trace units, which carry no physical scale until the one scale of 1882.216944 ties them to reflectivity. A checkshot records one-way time, and the time-depth line takes two-way time as 2 x the one-way time.")

# CROSS m01 (the lab's bookkeeping) + m03 (the pick on gather 5)
q(2, "Gather 5's top is picked on the nearest offset about 1289 ms and lands on 1292.000000 ms. What rule turns the stated time into the pick?",
 "The lab's bookkeeping: the sample of the largest amplitude within 8 ms of the stated time.",
 ["A bulk shift found by cross-correlation of the synthetic with the trace, which moves the 1288.796378 ms checkshot time down to the event.",
  "The nearest checkshot level's two-way time, 1288.876000 ms, carried to the next sample on the gather's 4.000000 ms clock.",
  "The residual moveout pilot, the stated 3 nearest traces stacked, with its peak read inside the 40 ms half window."],
 "An event's time on a trace is the sample of the largest amplitude within 8 ms of a stated time, so 1289 ms becomes 1292.000000 ms on the 4.000000 ms clock. Ekene-1's bulk shift is 0.000000 ms, and the pilot and the checkshot levels play no part in the pick.")

# CROSS m01 (the refused well wavelet) + m02 (the field wavelet)
q(1, "The field wavelet compareWavelets builds at Ekene has 31 samples. What are its members, and why is the well wavelet absent?",
 "The four statistical wavelets, since the pack's 26 live synthetic samples cannot hold the well wavelet's 31-sample window.",
 ["Four well wavelets with measured phase, since every well ties at 0.962720 or better.",
  "The four statistical wavelets, after a well wavelet's 31 samples are resampled to 61.",
  "Three well wavelets and Ekene-2's statistical one, since Ekene-2 alone needs a bulk shift of -4.000000 ms to tie."],
 "The well wavelet keeps only samples whose whole 2 x 15 + 1 = 31-sample window sits on live reflectivity, and the pack gives 26, so Seismolord refuses and the course's ties use the statistical wavelet; the average keeps its members' 31 samples. 61 is the average resampled from 4 ms to 2 ms, and Ekene-4 also shifts by -4.000000 ms.")

# CROSS m01 (polarity) + m04 (the angle gather at the top)
q(3, "At the top on gather 5, the three angle bins read 483.072830, 410.433207 and 320.449005. What does the sign of all three agree with?",
 "SEG normal polarity: the Ekene Sand is harder than the Ogbia Shale above it at Ekene-1, so the top is a peak.",
 ["Reversed polarity, where an increase in impedance downwards is a trough on the kit's seismic and the top of the sand is softer.",
  "The base of the sand, whose coefficient of -0.190340 is the largest in the synthetic and dominates every bin at the top.",
  "The mute's exact zeros, which enter every bin's mean and lift it above zero."],
 "The kit's seismic is SEG normal polarity, an increase in impedance downwards is a peak, a positive number, and the sand is harder than the shale above it at Ekene-1, so its top reads positive in every bin. The -0.190340 coefficient sits at 1312.000000 ms, and zeros could only pull a mean towards zero.")

# CROSS m01 (the four spectra) + m02 (the comparison matrix)
q(0, "Of the four statistical wavelets, which pair does compareWavelets find least alike, and where do those two sit in frequency?",
 "Ekene-2 with Ekene-4 at 0.986771, the wells with the lowest and highest peaks, 23.394907 and 26.530951 Hz.",
 ["Ekene-1 with Ekene-3 at 0.999524, the two wells whose peaks lie closest together in frequency.",
  "Ekene-1 with Ekene-4 at 0.996130, since Ekene-1 is the reference every other wavelet is aligned to.",
  "Ekene-2 with Ekene-3 at 0.994059, the pair with the largest lag between them after the alignment."],
 "The similarity is the zero-lag correlation of aligned, unit-energy wavelets; the lowest off-diagonal figure is Ekene-2 with Ekene-4, 0.986771, and their peaks, 23.394907 and 26.530951 Hz, are the lowest and highest of the four. 0.999524 is the most alike pair, and every lag to the reference is 0.")

# CROSS m01 (the selections) + m06 (the modelled side)
q(2, "The comparison at the wells models Ekene-2 and Ekene-4 from net sand. On what does that rest?",
 "Their top of the Ekene Sand lies below the oil-water contact at 5118.110236 ft, so neither has an oil leg.",
 ["Their oil legs, of 114 and 65 samples, are too thin to sit under the cap rock's 130.",
  "Their bulk shifts of -4.000000 ms move the oil leg outside the 8 ms pick window.",
  "Their wavelets fall below QI Studio's 0.8 rule, so their oil legs are left out of the field wavelet and the model."],
 "A well whose top of the Ekene Sand lies below the contact has no oil leg by the course's rule: Ekene-2's top is 5134.514436 ft and Ekene-4's 5216.535433 ft, and both oil legs hold 0 samples, so the comparison models the cap rock over their net sand. 114 and 65 are Ekene-3's and Ekene-1's oil legs.")

# CROSS m01 (what is graded) + m06 (the classes at the wells)
q(1, "4 of 4 Ekene wells agree in class at the stated band of 0.02. What status does a class have in the course's grading?",
 "It is never graded, like any verdict, class name or category.",
 ["It is graded as the sixth capstone figure, since the comparison at the wells returns it beside the one scale.",
  "It is graded only where the modelled and seismic classes differ, because QI Studio raises an issue there.",
  "It is graded on the Ekene wells alone, where 4 of 4 agree, since a class needs the real survey behind it."],
 "The capstone grades six numeric return values on a held-out synthetic case, never the Ekene field; any verdict, class name or category is never graded. The sixth figure is the one scale over the four wells, which at Ekene is 1882.216944.")

# ---- m02 the tie and the field wavelet ----

q(3, "Ekene-1's checkshot times are moved by -8.000000 ms before the synthetic is built. What does suggestBulkShift find?",
 "8.000000 ms, the move back, at a correlation of 0.983438.",
 ["-8.000000 ms, the same as the move, since a positive shift would mean the synthetic moves up the trace.",
  "0.000000 ms, since Ekene-1's own tie needs no shift.",
  "20 ms, the edge of the stated search."],
 "The bulk shift is the lag of the largest normalised cross-correlation within the stated 20 ms search, positive when the seismic event is later and the synthetic moves down; it returns 8.000000 ms for a move of -8.000000 ms and -8.000000 ms for a move of 8.000000 ms, both at 0.983438.")

q(1, "A tie carries the anchors (1250, 1252) and (1350, 1356) ms. What seismic time does makeTieWarp give the synthetic time 1400 ms?",
 "1406.000000 ms, continuing below the last anchor with slope one.",
 ["1356.000000 ms, held at the last anchor's seismic time, since nothing is mapped beyond the anchors.",
  "1400.000000 ms, unshifted, since outside its anchors the warp leaves a synthetic time as it is.",
  "No time at all: it refuses a time outside its anchors."],
 "Between anchors the mapping is linear, so 1300 ms maps to 1304.000000 ms; beyond the first and the last it continues with slope one, a constant shift, so 1200 ms maps to 1202.000000 ms and 1400 ms to 1406.000000 ms. makeTieWarp refuses only a pair that would fold time.")

q(0, "A learner enters a second anchor whose seismic time is earlier than the first anchor's. What does makeTieWarp do?",
 "It refuses a pair that would fold time, and the course names that refusal by what it refuses.",
 ["It sorts the two anchors by seismic time and maps between them.",
  "It accepts the pair as a single-anchor bulk shift.",
  "It returns NaN seismic times, as elasticPoint returns NaN fields."],
 "Both times must increase from one anchor to the next, as they do in the designed pair (1250, 1252) and (1350, 1356) ms; makeTieWarp refuses a pair that would fold time, and its message carries a punctuation mark the course does not print. A NaN result is elasticPoint's behaviour with Vs above Vp.")

q(2, "Once a tie is accepted, what happens to the imported checkshots in the time-depth record?",
 "They stay as imported, and the derived rows from the tie's anchors are kept as a new set beside them.",
 ["They are overwritten by the derived rows, so the record holds one set of times that every app then reads.",
  "The imported checkshots themselves are rewritten by the bulk shift, so Ekene-2's become one sample earlier.",
  "They are averaged with the derived rows into one time-depth line."],
 "Derived rows come from the anchors through the same time-depth line (warpToCheckshots) and sit beside the imported checkshots, which stay as they were imported; at Ekene-1 the level at 5079.002625 ft keeps its imported one-way time of 644.438000 ms. QI Studio reads the tie each well has in Seismolord.")

q(3, "In the designed case, Ekene-3's wavelet is rotated by 90 degrees before the comparison. What does it score against the average, and what does QI Studio's 0.8 rule do with it?",
 "0.911984, above 0.8, so the similarity rule passes it.",
 ["0.693702, below 0.8, so the well is flagged as unlike the others and is left out of the field wavelet.",
  "0.999751, its unrotated figure.",
  "0.988309, the phase match's figure after rotation."],
 "Rotated by 90 degrees, Ekene-3 correlates 0.911984 with the average and stays above the 0.8 rule; reversed by 180 degrees it falls to 0.693702, below it. 0.999751 is its unrotated figure and 0.988309 belongs to the phase match on the synthetic, a different engine call.")

q(1, "With Ekene-3's wavelet reversed in polarity, what happens to Ekene-1's correlation with the average?",
 "It falls from 0.999838 to 0.971738, as the average Ekene-3 pulled lowers the other wells' figures too.",
 ["It stays at 0.999838, since only the reversed well's own figure moves when one wavelet in the comparison is rotated.",
  "It falls to 0.693702, the figure Ekene-3 itself scores.",
  "It falls to 0.990887, its figure with Ekene-3 at 90 degrees."],
 "With Ekene-3 reversed, Ekene-1 reads 0.971738 against its unrotated 0.999838, because the average Ekene-3 pulled lowers the other three wells' figures as well. 0.693702 is Ekene-3's own figure and 0.990887 is Ekene-1's with Ekene-3 rotated by 90 degrees.")

# CROSS m02 (the tie and its bulk shift) + m06 (the pick at the wells)
q(0, "Ekene-2 ties best at a bulk shift of -4.000000 ms, and its checkshot top is at 1305.746335 ms. At what time does the comparison at the wells read its near, mid and far stacks?",
 "1304.000000 ms, the largest near-stack sample within 8 ms of the checkshot time.",
 ["1305.746335 ms, the checkshot time itself, since the stacks are read at the committed time of the tie.",
  "1292.000000 ms, the top picked on gather 5, since one pick serves all four wells of the comparison.",
  "1328.000000 ms, the sample picked on Ekene-4."],
 "The seismic side picks the top on the near stack trace within 8 ms of its checkshot time and reads the near, mid and far traces at that sample: at Ekene-2 that is 1304.000000 ms against 1305.746335 ms. 1292.000000 ms is Ekene-1's pick and 1328.000000 ms Ekene-4's.")

# ---- m03 gathers and their QC ----

q(3, "At an offset bin width of 200 m, foldSummary reports a far offset of 2500.000000 m. Where does the engine place a bin when it reports it?",
 "At its centre: bin k holds offsets from k w to (k + 1) w and is centred at (k + 0.5) w.",
 ["At its far edge, (k + 1) w, the outer limit of the last bin.",
  "At its near edge, k w.",
  "At the farthest offset recorded in it, whatever the width, so the summary reads the gather's last trace."],
 "foldSummary reports a bin at its centre; at 200 m the 13 offsets from 100 to 2500 m fill 13 bins of fold 1, and the last bin, k = 12, is centred at 2500 m. The far edge or the near edge would put the far offset elsewhere.")

q(1, "At the top on gather 5, a study sets the stretch limit to 0.300000. Which offsets does the stretch mute cut?",
 "None: the mute offset of 2563.848741 m lies beyond the farthest offset, 2500 m, whose stretch is 0.286880.",
 ["Every offset beyond 2047.359898 m, the mute offset the engine returns at that time and velocity.",
  "The 2100 m and 2500 m offsets, whose stretches of 0.209511 and 0.286880 lie above the stated limit.",
  "Every offset beyond 1300 m, where the stretch of 0.085080 starts to climb faster than the offset itself."],
 "The stretch mute is the offset at which the stretch reaches the stated limit, v t0 sqrt((1 + limit)^2 - 1): 2563.848741 m at 0.300000 and 2047.359898 m at 0.200000. At 0.300000 the farthest offset's stretch, 0.286880, is under the limit, so nothing is cut; the cut beyond 2047.359898 m belongs to the 0.200000 limit.")

q(2, "residualMoveout reports the method ab-semblance on gather 5 about the top. On what condition does the engine change to it?",
 "With all 13 offsets in the fit, the lags scatter about the parabola dt = a x^2 by more than one sample.",
 ["The last three offsets' correlations, -0.776230, -0.728225 and -0.786646, fall below the 0.7 entry threshold.",
  "The far-offset residual of 2.795940 ms lies below the 4.000000 ms sample interval, too small for the lag measure.",
  "The far lags run past the 24 ms largest shift."],
 "Offsets whose correlation is at least 0.7 in size enter the fit, so the last three, -0.776230, -0.728225 and -0.786646, are among the 13 fitted; their lags of -24.000000 ms sit at the search limit, and with all 13 in the fit the lags scatter about the parabola by more than a sample, the engine's condition for AB semblance.")

q(0, "Across the 12 pack gathers, which carries the largest far-offset residual, and by what method?",
 "Gather 3, at inline 1026 and crossline 2053, 3.002917 ms, by AB semblance like every other gather.",
 ["Gather 5, the gather on Ekene-1's trace, 2.795940 ms, by the lag fit, since it alone fits all 13 offsets.",
  "Gather 10, at inline 1028 and crossline 2052, 2.953658 ms, alone measured by AB semblance.",
  "Gather 0, at inline 1026 and crossline 2050, 2.939718 ms, by the lag fit."],
 "Every pack gather picks its top at 1292.000000 ms, fits 13 offsets and is measured by ab-semblance; the residuals run from 2.795940 ms at gather 5 to 3.002917 ms at gather 3.")

q(3, "At the top of gather 5 the angle bins 5 to 15, 15 to 25 and 25 to 35 degrees hold fold 2, 3 and 2. What does usableAngle return at a minimum fold of 3?",
 "None, because counting starts at the nearest bin and the 5 to 15 degree bin holds only 2.",
 ["25 degrees, the far edge of the 15 to 25 degree bin, the one bin that meets the fold of 3 on its own.",
  "35.000000 degrees, as at a minimum fold of 2, since the mid bin meets the minimum and the range runs on to the far edge.",
  "15 degrees, the far edge of the near bin, since the range stops at the first bin that holds fewer than the minimum."],
 "usableAngle counts from the nearest bin and returns the far edge of the last bin with at least the stated minimum fold, and none where even the first bin has too few; at a minimum of 3 the near bin's fold of 2 ends the count, so the answer is none, while minimums of 1 and 2 give 35.000000 degrees.")

# CROSS m03 (NMO stretch) + m04 (velocity on the trace clock)
q(2, "The stretch at the top on gather 5 is read with an NMO velocity of 2388.940541 m/s. Where does that figure come from?",
 "The RMS velocity of the table on the trace clock at 1292.000000 ms, linear in time between the rows that bracket it.",
 ["The Dix interval velocity of the segment from 1288.800000 to 1311.000000 ms, the velocity of the sand itself.",
  "The RMS row at 1288.800000 ms, 2387.600000 m/s, the row nearest the top, read with no interpolation.",
  "Walden's ratio Vint / Vrms applied to the row at 1311.000000 ms, 2396.900000 m/s, to reach the zero-offset time."],
 "On a trace the RMS velocity is linear in time between rows and held flat outside the table; at 1292.000000 ms it is 2388.940541 m/s, and the stretch takes the table's RMS velocity there as its NMO velocity. The interval velocity at that time, 2885.878392 m/s, is what Walden's angle reads beside it.")

# CROSS m03 (the stretch mute) + m04 (Walden's angle on the Ekene table)
q(1, "At the top on gather 5, a stretch limit of 0.200000 sets the mute offset at 2047.359898 m. What is Walden's angle at the 2000 m offset, just inside it, on the Ekene table?",
 "41.065011 degrees, past the kit's stated mute beyond 40 degrees.",
 ["37.400033 degrees, the angle Walden gives at 2000 m on the designed four-layer teaching earth.",
  "36.790963 degrees, the exact ray-traced angle at 2000 m, which the Ekene table reaches by Snell's law.",
  "31.872141 degrees, inside the far bin, since the stretch mute keeps only offsets whose angle is inside 35 degrees."],
 "On the Ekene table at 1292.000000 ms Walden's angle is 31.872141 degrees at 1500 m and 41.065011 degrees at 2000 m, so an offset the 0.200000 stretch limit keeps already lies beyond the kit's mute at 40 degrees. 37.400033 and 36.790963 degrees belong to the teaching earth at the base of its third layer.")

# ---- m04 angles from velocity ----

q(0, "Between the rows at 1288.800000 and 1311.000000 ms the RMS velocity rises from 2387.600000 to 2396.900000 m/s. What interval velocity does Dix give that thin interval?",
 "2885.878392 m/s.",
 ["2077.601943 m/s, the Dix velocity of the interval from 1040.500000 to 1288.800000 ms above it, the shale.",
  "2388.940541 m/s, the RMS velocity on the trace clock at 1292.000000 ms, inside the same interval.",
  "2044.152876 m/s, since a rise of so little RMS velocity over so short a time gives a slow interval."],
 "Dix gives Vint^2 = (Vrms2^2 t2 - Vrms1^2 t1) / (t2 - t1), and over 1288.800000 to 1311.000000 ms that is 2885.878392 m/s, the interval velocity velocityOnGrid then gives at 1292.000000 ms. 2077.601943 m/s is the interval above and 2044.152876 m/s the one from 1311.000000 to 1516.500000 ms.")

q(3, "A designed RMS velocity table falls too fast, so Dix's numerator is negative for one pair of rows. What does dixInterval do?",
 "It refuses, naming the time: \"The RMS velocities give no real interval velocity at 1.1 s.\"",
 ["It returns the RMS velocity there, as for a table's first row.",
  "It returns NaN for that interval and carries on.",
  "It takes the square root of the numerator's size and returns that speed with the sign flagged in the result."],
 "Vint^2 = (Vrms2^2 t2 - Vrms1^2 t1) / (t2 - t1), and no real velocity has a negative square, so a pair of rows that gives a negative numerator is refused with a message naming the time. The first row's interval velocity is its RMS velocity, as at 46.700000 ms with 1500.000000 m/s.")

q(2, "On the designed four-layer teaching earth, at the base of the third layer, how does Walden's angle at 3000 m compare with the exact ray trace?",
 "Walden reads 52.574313 degrees against 50.430992, high by 2.143321.",
 ["Walden reads low, 50.430992 degrees against 52.574313, since a straight ray bends less than the refracted ray.",
  "They agree within 0.009482 degrees at every offset.",
  "Walden reads 45.265069 degrees against 44.057814, high by 1.207256, the widest gap the table prints."],
 "At t0 1596.736597 ms, Vrms 2152.777869 m/s and Vint 2600 m/s, Walden reads high at every offset and the gap grows with offset, from 0.009482 degrees at 500 m through 1.207256 at 2500 m to 2.143321 at 3000 m.")

q(1, "For a large enough offset, Walden's sine, (Vint / Vrms) x / sqrt(x^2 + (Vrms t0)^2), passes one. What does waldenAngle return?",
 "90 degrees.",
 ["A refusal in the engine's own words, naming the offset at which no real angle of incidence exists.",
  "NaN, a result with an empty field the panel shows as a gap, as elasticPoint does with Vs above Vp.",
  "40 degrees, the kit's stated mute angle, beyond which the gathers carry exact zeros in any case."],
 "Past a sine of one the engine returns 90 degrees; it neither refuses nor returns NaN. On the Ekene table at 1292.000000 ms the angle at 2500 m is 49.493998 degrees, still short of that, and the mute beyond 40 degrees is the kit's, applied to the gathers.")

q(0, "How does angleGather treat a seismic null and the mute's exact zeros?",
 "It skips a null or non-finite sample, and counts the mute's exact zeros as live samples in the bin means.",
 ["It skips both, so a bin past the mute angle is empty and the 40 degree mute cannot touch any bin's mean.",
  "It counts both as zero amplitude, so a null and a mute zero each pull a bin's mean towards zero alike.",
  "It refuses a gather holding nulls, the way averageSpectrum refuses traces of unequal length."],
 "A sample that is not finite or is a seismic null is skipped; the mute's exact zeros are live samples, so the mute angle and the bin edges must be read together. On the pack's gathers the mute is beyond 40 degrees, and at 1292.000000 ms the three bins hold fold 2, 3 and 2.")

# CROSS m04 (partial stacks) + m05 (the Shuey fit) + m06 (the seismic side at the wells)
q(3, "At Ekene-1 the course prints two two-term intercepts at 1292.000000 ms, 501.873676 and 486.838592. What does each fit?",
 "501.873676 fits gather 5's three angle bins; 486.838592 fits the kit's near, mid and far stack traces at Ekene-1.",
 ["501.873676 is the three-term fit and 486.838592 the two-term fit, both on gather 5's three angle bins.",
  "501.873676 fits the kit's stack traces and 486.838592 fits gather 5's bins, each after the one scale of 1882.216944.",
  "Both fit gather 5's bins, with 486.838592 taken from 9 bins of 5 degrees at their centres in place of three."],
 "Gather 5's bins at 10, 20 and 30 degrees, reading 483.072830, 410.433207 and 320.449005, give a two-term A of 501.873676; the comparison at the wells fits the kit's near, mid and far stack traces at the picked 1292.000000 ms and gives 486.838592. The three-term A is 510.227684 and the nine-bin A 519.312395, and both intercepts are in trace units.")

# ---- m05 AVO volumes ----

q(2, "On gather 5's three bins at 10, 20 and 30 degrees, what does adding the third Shuey term do?",
 "It makes the fit exactly determined, with B -915.097371 and C 467.947963 against the two-term B of -734.431814.",
 ["It leaves A and B as the two-term fit gave them, 501.873676 and -734.431814, and adds C as a separate column.",
  "It cannot run on only 3 angles.",
  "It uses 9 bins of 5 degrees to fill the extra term, and returns B -927.296460 with C at 0.000000."],
 "A three-term fit on three angles is exactly determined: A 510.227684, B -915.097371, C 467.947963, with 3 angles used. The two-term fit gives A 501.873676 and B -734.431814 and reports C as 0.000000; B -927.296460 is the two-term fit on 9 bins.")

q(1, "Against gather 5's background trend, slope -4.020851 over 176 pairs, the top's point sits 309.781098 from the line. Which side, and what does that side mean?",
 "The positive side, above the line, away from the softer, gas-like responses that offTrend counts negative.",
 ["The negative side, below the line, on the softer, gas-like side where a hydrocarbon at Ekene-1 would put it.",
  "The positive side, which offTrend counts towards the softer, gas-like responses lying below the trend line.",
  "Neither: a fitted point sits on the line."],
 "offTrend is (B - m A) / sqrt(1 + m^2), negative towards softer, gas-like responses below the line; the top's point, A 501.873676 and B -734.431814, reads 309.781098, positive, above it. A point inside the fitted pairs can still sit off an orthogonal regression line.")

q(0, "At a stated Vs/Vp of 0.500000, contrastsFromAB turns the top's scaled A and B into dVp/Vp 0.426623, dVs/Vs 0.550179 and drho/rho 0.106656. What sets drho/rho?",
 "Gardner's density, drho/rho = dVp/Vp / 4, applied to the dVp/Vp of 0.426623.",
 ["The stated Vs/Vp of 0.500000 applied to dVs/Vs, so drho/rho follows the shear contrast of 0.550179.",
  "The fluid factor, dVp/Vp - 1.16 (Vs/Vp) dVs/Vs, which returns 0.107520 and fixes the density contrast with it.",
  "The cap rock's density log over the oil leg's."],
 "contrastsFromAB takes A and B, a stated Vs/Vp and Gardner's density, drho/rho = dVp/Vp / 4, so 0.426623 gives 0.106656. The fluid factor, 0.107520, is computed from the contrasts; it does not set them.")

q(3, "At chi = atan(m) = -76.033690 degrees, with m the background trend slope, what does chiProjection read at the top of gather 5?",
 "833.848276, the point's position along the background trend.",
 ["67.419446, the projection the top gives at the stated chi of 30 degrees on the same A and B.",
  "309.781098, the off-trend distance, since a chi set along the trend reads straight across it.",
  "0.107520, the fluid factor, since both attributes reduce A and B to one number on the one line."],
 "chiProjection is A cos(chi) + B sin(chi); at chi = atan(m) = -76.033690 degrees, the angle along the background trend, the top projects to 833.848276, and at the stated 30 degrees to 67.419446. The off-trend distance 309.781098 comes from offTrend and the fluid factor 0.107520 from contrastsFromAB.")

q(2, "What does the course state about conditioning angle stacks before the AVO fit?",
 "QI Studio runs trim statics, matching in shift, phase and scale, and spectral balancing; the course vendors and grades none of it, and a study records which it ran.",
 ["The prestack explorer runs all three steps on the Ekene pack, so the A of 486.838592 at Ekene-1 is a conditioned figure.",
  "Conditioning moves only the time of each stack, so the amplitudes the fit reads at a sample stay as they were.",
  "Spectral balancing is graded in the capstone, as the far partial stack amplitude at the target sample."],
 "QI Studio conditions angle stacks in engines/qi/conditioning.js, which the course vendors none of and grades none of; each step changes the amplitudes the fit reads, so a study records which it ran. The six capstone figures run from the Dix interval velocity to the one scale of the comparison at the wells, and no conditioning step is among them.")

# CROSS m05 (the fluid factor) + m06 (the one scale)
q(0, "contrastsFromAB needs A and B as reflection coefficients. How does the course get them from gather 5's top, A 501.873676 and B -734.431814?",
 "It divides both by the one scale over the four wells, 1882.216944, fitted by the comparison at the wells.",
 ["It divides both by the trend slope of -4.020851, the ratio of B to A that the background trend fits over 176 pairs.",
  "It reads them as they stand from the Shuey fit.",
  "It takes Ekene-1's modelled A and B, 0.170742 and -0.563558."],
 "The fluid factor needs A and B as reflection coefficients, and the course divides the top's two-term A and B by the one scale of 1882.216944, then reads dVp/Vp 0.426623 and a fluid factor of 0.107520 at Vs/Vp 0.500000. The fit's A and B are in trace amplitude units.")

# CROSS m05 (the off-trend distance) + m06 (the one scale)
q(3, "The top's off-trend distance on gather 5 is 309.781098. In what units, and what ties such a figure to reflectivity?",
 "Trace amplitude units; the one scale over every well, 1882.216944 trace units per unit reflection coefficient.",
 ["Reflection coefficient units already, since the background trend is fitted to modelled interfaces taken to brine.",
  "Degrees, since offTrend measures the angle between the point and the trend line of slope -4.020851.",
  "Milliseconds, the point's residual off the trend in time, as residualMoveout reports at the far offset."],
 "The top sits 309.781098 from the background trend in trace amplitude units, because the trend is fitted to seismic (A, B) pairs; seismic amplitudes become reflection coefficients only through the one least-squares scale over the wells, 1882.216944.")

# ---- m06 AVO at the wells ----

q(1, "How does the comparison at the wells fit its one scale?",
 "scale = sum(observed x modelled) / sum(modelled^2), over every well with A and B together.",
 ["One scale per well, its seismic A over its modelled A.",
  "The mean seismic A over the mean modelled A.",
  "The inverse, sum(modelled^2) / sum(observed x modelled)."],
 "One least-squares scale ties the seismic amplitudes to reflectivity over every well, A and B together; at Ekene it is 1882.216944 trace units per unit reflection coefficient, and each well's seismic A and B are divided by it, Ekene-1's A of 486.838592 becoming 0.258652.")

q(2, "After every well's seismic A and B are divided by the one scale, which well carries the largest residual against its modelled point?",
 "Ekene-2, 0.105803, a net sand well.",
 ["Ekene-3, 0.059452, an oil-leg well whose seismic gradient reads steepest.",
  "Ekene-1, 0.088133, the oil-leg well on gather 5's trace.",
  "Ekene-4, 0.077711, the deepest of the net sand wells."],
 "The residual is the distance between the scaled seismic point and the modelled one: 0.088133 at Ekene-1, 0.105803 at Ekene-2, 0.059452 at Ekene-3 and 0.077711 at Ekene-4, so Ekene-2 is largest and Ekene-3 smallest.")

q(0, "When does QI Studio's comparison at the wells raise a high issue?",
 "For a negative scale, a polarity or wavelet problem.",
 ["For a class that differs between the modelled and seismic points, at the same high level it gives a negative scale.",
  "For a positive scale over the four wells, such as 1882.216944, which says the seismic is reversed against the model.",
  "For a well whose wavelet correlates with the average below 0.8, read off from the comparison's own scale."],
 "QI Studio raises an issue for a class that differs and a high one for a negative scale; at Ekene the scale is 1882.216944, positive, and 4 of 4 wells agree in class. The 0.8 rule belongs to the issue register for ties and wavelets.")

q(3, "Which of these is one of the six figures the Professional capstone grades?",
 "The one scale over the four wells.",
 ["The fluid factor at the target sample, from contrastsFromAB at a stated Vs/Vp and Gardner's density.",
  "The far-offset residual moveout of the case's gather, measured by AB semblance about the target.",
  "The AVO class of each of the four wells, read by avoClass at the stated band of 0.02."],
 "The six figures are the Dix interval velocity of a stated layer, Walden's angle at a stated offset and time, the NMO stretch there, the far partial stack amplitude, the two-term Shuey intercept and the one scale over the four wells; a class is never graded. At Ekene the scale is 1882.216944, but the capstone case is never the Ekene field.")

emit(Q, '/root/qi-wip-qi/banks/qii_exam.json', expect_n=42)
finish()
