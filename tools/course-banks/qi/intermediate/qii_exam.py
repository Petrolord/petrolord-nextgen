import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# QI Professional final exam, 42 questions across the six modules: from
# feasibility to the tie, the tie and the field wavelet, gathers and their QC,
# angles from velocity, AVO volumes, AVO at the wells. Questions marked CROSS
# need two modules (or more) at once.

# ---- m01 from feasibility to the tie ----

# CROSS m01 (the synthetic and the phase match) + m02 (the bulk shift)
q(2, "Ekene-1's synthetic correlates 0.983438 with its full-stack trace at zero shift. Which later result at Ekene-1 prints that same figure?",
 "The bulk shift's correlation, found at a shift of 0.000000 ms.",
 ["The phase match's correlation after rotation, at its best phase of -6.135261 degrees.",
  "Ekene-1's correlation with the field wavelet in the misfit table of the four wells.",
  "The 60 degree row of the designed phase case."],
 "Ekene-1's bulk shift is 0.000000 ms at a correlation of 0.983438, the figure the zero-shift synthetic and the phase match's reading before rotation also print. After rotation the phase match reads 0.989111, the misfit table gives Ekene-1 0.999838, and the 60 degree row reads 0.988816 after matching.")

# CROSS m01 (the tier's engine files) + m02 (the bulk shift)
q(0, "suggestBulkShift returns -4.000000 ms at Ekene-2. Which engine file does that function come from?",
 "engines/seismolord/synthetics.js, the file that also builds the synthetic and the statistical wavelet.",
 ["engines/seismolord/tieWarp.js, beside makeTieWarp, since a single anchor is a bulk shift.",
  "engines/qi/wavelets.js, beside compareWavelets, which aligns by the lag of largest correlation.",
  "engines/qi/prestackQc.js, beside residualMoveout, which finds each offset's lag against a pilot."],
 "The tier's table lists suggestBulkShift in engines/seismolord/synthetics.js with computeImpedance, reflectivity, convolveSame and extractStatisticalWavelet; tieWarp.js holds the phase functions and makeTieWarp, wavelets.js holds compareWavelets, and prestackQc.js holds the gather QC. Ekene-4 also ties at -4.000000 ms.")

q(3, "Which statement about the statistical wavelet that extractStatisticalWavelet builds is true?",
 "Its spectrum is the source wavelet's when the reflectivity is white, and its phase is assumed zero.",
 ["Its phase is measured, as the least-squares wavelet from the well's reflectivity.",
  "It needs a log long enough for the wavelet asked for.",
  "It is scaled to unit energy and aligned by up to 5 samples."],
 "The statistical wavelet is the amplitude spectrum of the traces' autocorrelation taken to zero phase, so its phase is assumed, and every one of the four has 31 samples on the 4.000000 ms clock. A measured phase and the need for a long log belong to the well wavelet; unit energy and alignment by up to 5 samples are steps of compareWavelets.")

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

# CROSS m01 (the tier's engine files) + m03 (the stretch mute)
q(2, "A study reads a stretch mute offset of 2047.359898 m at the top of gather 5. Which function and engine file return it?",
 "stretchMuteOffset, in engines/qi/prestackQc.js.",
 ["binOffsets, in engines/qi/prestack.js, which places each offset in a bin of stated width.",
  "nmoStretch, in the synthetics.js file.",
  "usableAngle, in engines/qi/prestack.js."],
 "prestackQc.js holds nmoStretch, stretchMuteOffset, residualMoveout and foldSummary; stretchMuteOffset returns v t0 sqrt((1 + limit)^2 - 1), 2047.359898 m at a limit of 0.200000. binOffsets and usableAngle sit in prestack.js, and synthetics.js holds the synthetic, the statistical wavelet and the bulk shift.")

# CROSS m01 (the refused well wavelet) + m02 (the field wavelet)
q(1, "The field wavelet compareWavelets builds at Ekene has 31 samples. What are its members, and why is the well wavelet absent?",
 "The four statistical wavelets, since the pack's logs cover only the Ekene Sand and the shale above it.",
 ["Four well wavelets with measured phase, since every well ties at 0.962720 or better.",
  "The four statistical wavelets, after a well wavelet's 31 samples are resampled to 61.",
  "Three well wavelets and Ekene-2's statistical one, since Ekene-2 alone needs a bulk shift of -4.000000 ms to tie."],
 "At its default 31 samples the well wavelet on Ekene-1's 26 live samples returns the engine's message that the reflectivity is flat; the pack's logs cover the Ekene Sand and the shale above it only, so the course's ties use the statistical wavelet, and the average keeps its members' 31 samples. 61 is the average resampled from 4 ms to 2 ms, and Ekene-4 also shifts by -4.000000 ms.")

# CROSS m01 (polarity) + m04 (the angle gather at the top)
q(3, "At the top on gather 5, the three angle bins read 483.072830, 410.433207 and 320.449005. What does the sign of all three agree with?",
 "SEG normal polarity: the Ekene Sand is harder than the Ogbia Shale above it at Ekene-1, so the top is a peak.",
 ["Reversed polarity, where an increase in impedance downwards is a trough on the kit's seismic and the top of the sand is softer.",
  "The synthetic's coefficient of -0.190340 at 1312.000000 ms, the largest in its span, which dominates every bin at the top.",
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
q(2, "The comparison at the wells models Ekene-3 from its oil leg and Ekene-4 from net sand. What do the course's selections count in those two wells' oil legs?",
 "114 samples at Ekene-3 and 0 at Ekene-4.",
 ["65 at Ekene-3, 135 at Ekene-4.",
  "40 at Ekene-3 and 0 at Ekene-4.",
  "154 at Ekene-3 and 0 at Ekene-4."],
 "The selections count Ekene-3 at 154 net sand, 114 oil leg and 40 water leg, and Ekene-4 at 135 net sand, 0 oil leg and 135 water leg, so the comparison reads Ekene-3's cap rock over its oil leg and Ekene-4's over its net sand. 65 belongs to Ekene-1.")

# CROSS m01 (what is graded) + m06 (the classes at the wells)
q(1, "4 of 4 Ekene wells agree in class at the stated band of 0.02. What status does a class have in the course's grading?",
 "It is never graded, like any verdict, class name or category.",
 ["It is graded as the sixth capstone figure, since the comparison at the wells returns it beside the one scale.",
  "It is graded only where the modelled and seismic classes differ, because QI Studio raises an issue there.",
  "It is graded on the Ekene wells alone, where 4 of 4 agree, since a class needs the real survey behind it."],
 "The capstone grades six numeric return values on a held-out synthetic case that is not the Ekene field; no verdict, class name or category is graded. The sixth figure is the one scale over the four wells, which at Ekene is 1882.216944.")

# ---- m02 the tie and the field wavelet ----

q(3, "Rank the four ties by bulk-shift correlation. Which well comes last, and what shift does its tie carry?",
 "Ekene-4, 0.962720, at -4.000000 ms.",
 ["Ekene-2, 0.965477, at -4.000000 ms.",
  "Ekene-3, 0.977607, at 0.000000 ms.",
  "Ekene-1, 0.983438, at 0.000000 ms."],
 "Ranked by correlation, Ekene-1 reads 0.983438, Ekene-3 0.977607, Ekene-2 0.965477 and Ekene-4 0.962720; the two lowest are the two wells whose ties move by -4.000000 ms.")

# CROSS m02 (the time-depth record) + m06 (the pick at the wells)
q(1, "Ekene-4's top of the Ekene Sand lies at 5216.535433 ft. What two-way time does the time-depth line give it, and where does the comparison at the wells pick it on the near stack?",
 "1329.290304 ms by the checkshots, picked at 1328.000000 ms.",
 ["1305.746335 ms by the checkshots, picked at 1304.000000 ms.",
  "1282.159191 ms by the checkshots, picked at 1284.000000 ms.",
  "1288.796378 ms, picked at 1292.000000 ms, one time serving every well of the field."],
 "Linear between checkshot levels, Ekene-4's top is at 1329.290304 ms, the latest of the four, and the near-stack pick within 8 ms of it lands on 1328.000000 ms. The other pairs are Ekene-2's, Ekene-3's and Ekene-1's.")

# CROSS m01 (phase) + m02 (the issue register)
q(0, "Ekene-1's phase match finds a best phase of -6.135261 degrees. Under QI Studio's issue register, when are wavelet phases across wells flagged?",
 "When they span more than 30 degrees across the wells.",
 ["When any one well's best phase is other than zero, the phase a statistical wavelet assumes.",
  "When a well's wavelet falls below 0.8.",
  "When a tie's mean windowed correlation falls below 0.7, the register's fair line."],
 "QI Studio flags wavelet phases across wells that span more than 30 degrees; the 0.8 rule marks a well whose wavelet is unlike the others, and 0.7 and 0.5 grade a tie's correlation as fair and poor. A phase of -6.135261 degrees at one well is a figure its tie states.")

q(2, "Two wavelets on different sample intervals must be brought to one before averaging. What does resampleWavelet do, and how many samples does the Ekene average carry on a 2 ms clock?",
 "It interpolates linearly about the centre sample, and the average carries 61 samples.",
 ["It keeps the 31 samples and halves the interval, so the wavelet is squeezed into half the time.",
  "It refuses wavelets of unequal length, as averageSpectrum refuses traces of 16 and 20 samples.",
  "It rebuilds each wavelet from its spectrum at the new interval."],
 "resampleWavelet brings wavelets to one interval by linear interpolation about the centre sample, and the Ekene average resampled from 4 ms to 2 ms has 61 samples against its 31. The refusal of traces of 16 and 20 samples belongs to averageSpectrum.")

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

# CROSS m03 (the pick on gather 5) + m06 (the pick on the near stack)
q(0, "Two picks of the top are made near Ekene-1: on the nearest offset of gather 5, and on the kit's near stack trace for the comparison at the wells. Where do they land?",
 "Both on 1292.000000 ms.",
 ["1292.000000 ms on the gather, and 1288.796378 ms on the near stack, the checkshot time read with no pick.",
  "1288.800000 ms on both, the RMS table's row nearest the top, which the picks snap to.",
  "1292.000000 ms on the gather, and 1284.000000 ms on the near stack, two samples earlier."],
 "Gather 5's pick about 1289 ms lands on 1292.000000 ms, and the comparison's pick within 8 ms of the checkshot time 1288.796378 ms lands on 1292.000000 ms too; each takes the sample of largest amplitude near a stated time. 1284.000000 ms is Ekene-3's pick.")

# ---- m03 gathers and their QC ----

q(3, "Which stated settings does residualMoveout run with on gather 5 about the top?",
 "A pilot of the 3 nearest traces, a half window of 40 ms and a largest shift of 24 ms.",
 ["A pilot of all 13 traces, a half window of 8 ms as in the pick, and a largest shift of 20 ms as in the bulk shift search.",
  "A pilot of 5 traces, the comparison's lag, and a half window of 120 ms, the statistical wavelet's window length.",
  "A pilot of 3 traces, a half window of 24 ms and a largest shift of 40 ms."],
 "The pilot stacks the stated 3 nearest traces, and each offset's lag is the largest absolute correlation in a half window of 40 ms with a largest shift of 24 ms; offsets at least 0.7 in size enter the fit. 8 ms is the pick window, 20 ms the bulk shift search, 5 samples the wavelet comparison's lag and 120 ms the wavelet window.")

# CROSS m03 (the stretch) + m04 (Walden's angle on the Ekene table)
q(1, "The farthest offset of gather 5, 2500 m, carries the largest stretch at the top, 0.286880. What incidence angle does it reach there by Walden's equation?",
 "49.493998 degrees, beyond the far bin's 25 to 35 degrees.",
 ["45.265069 degrees, the teaching earth's figure.",
  "44.057814 degrees, the exact ray at 2500 m, which the Ekene table follows by Snell's law.",
  "35.000000 degrees, the usable angle."],
 "On the Ekene table at 1292.000000 ms Walden's angle at 2500 m is 49.493998 degrees, past the 25 to 35 degree far bin. 45.265069 and 44.057814 degrees are the teaching earth's Walden and ray-traced angles at 2500 m, and 35.000000 degrees is the usable angle at a minimum fold of 2.")

q(2, "On gather 5 the far-offset residual moveout is 2.795940 ms, read as a x_far^2. At what far offset, and with how many offsets in the fit?",
 "2500.000000 m, with all 13 offsets fitted.",
 ["2047.359898 m, the stretch mute at 0.200000, with only the offsets inside it fitted.",
  "2563.848741 m, with 13 offsets fitted.",
  "2500.000000 m, with the 3 pilot traces."],
 "residualMoveout on gather 5 uses 13 offsets, fits 13 and reports a far offset of 2500.000000 m with a residual of 2.795940 ms. The two stretch mute offsets, 2047.359898 and 2563.848741 m, come from stretchMuteOffset, and the 3 pilot traces build the pilot the lags are measured against.")

q(0, "Mapped over inlines 1026 to 1028, where does the far-offset residual moveout reach its smallest value?",
 "Gather 5, inline 1027, crossline 2051, the trace of Ekene-1, at 2.795940 ms.",
 ["Gather 3, inline 1026, crossline 2053, at 3.002917 ms, a corner of the map.",
  "Gather 1, inline 1026, crossline 2051, at 2.819016 ms, on Ekene-1's crossline.",
  "Gather 8, inline 1028, crossline 2050, at 2.824094 ms, measured by the lag fit."],
 "The residuals run from 2.795940 ms at gather 5, the gather on Ekene-1's trace, to 3.002917 ms at gather 3, and every gather is measured by ab-semblance with 13 offsets fitted; gathers 1 and 8 read 2.819016 and 2.824094 ms.")

# CROSS m04 (usableAngle) + m05 (the bins the fit reads)
q(3, "A study tightens usableAngle's minimum fold one step at a time from 1 at the top of gather 5, where the Shuey fit reads bins holding 2, 3 and 2 traces. At which minimum does the usable range first vanish?",
 "3, because counting starts at the 5 to 15 degree bin, whose fold is 2.",
 ["4, one above the mid bin's fold of 3, the largest of the three.",
  "2, the course's stated working minimum, which the 25 to 35 degree bin only just meets.",
  "None does, since the mid bin's fold of 3 qualifies at any minimum up to 3."],
 "The count runs outwards from the near bin and stops at the first that falls short, so the near bin's 2 traces decide: minimums of 1 and 2 reach 35.000000 degrees, and 3 leaves nothing, whatever the mid bin holds.")

# CROSS m03 (the stretch velocity) + m04 (velocity on the trace clock)
q(2, "The stretch at the top on gather 5 is read with an NMO velocity of 2388.940541 m/s. Where does that figure come from?",
 "The RMS velocity of the table on the trace clock at 1292.000000 ms, linear in time between the rows that bracket it.",
 ["The Dix interval velocity of the segment from 1288.800000 to 1311.000000 ms, the velocity of the sand itself.",
  "The RMS row at 1288.800000 ms, 2387.600000 m/s, the row nearest the top, read with no interpolation.",
  "Walden's ratio Vint / Vrms applied to the row at 1311.000000 ms, 2396.900000 m/s, to reach the zero-offset time."],
 "On a trace the RMS velocity is linear in time between rows and held flat outside the table; at 1292.000000 ms it is 2388.940541 m/s, and the stretch takes the table's RMS velocity there as its NMO velocity. The interval velocity at that time, 2885.878392 m/s, is what Walden's angle reads beside it.")

# CROSS m03 (the gathers' mute and the stretch mute) + m04 (angles)
q(1, "Two mutes come up for the gathers next to Ekene-1: the kit's stated mute and the stretch mute. Which statement holds?",
 "The kit's mute is an angle, 40 degrees, from the kit's own calculation; the stretch mute is an offset that follows from a stated limit.",
 ["Both are offsets a study states, 2047.359898 m for the kit and 2563.848741 m for the stretch.",
  "The course measures the kit's mute with Walden's angle, which passes 40 degrees at 2000 m.",
  "The stretch mute is fixed by the kit at 2563.848741 m, and the kit's mute follows it."],
 "stretchMuteOffset gives 2047.359898 m at a limit of 0.200000 and 2563.848741 m at 0.300000, so the stretch mute moves with the study's choice; the 40 degree mute arrives in the pack already applied, by an angle calculation the course does not measure.")

# ---- m04 angles from velocity ----

q(0, "Which interval of the pack's RMS velocity table carries the fastest Dix interval velocity?",
 "1288.800000 to 1311.000000 ms, at 2885.878392 m/s.",
 ["330.600000 to 925.500000 ms, at 2689.639308 m/s, the interval above the row at 925.500000 ms.",
  "1571.700000 to 1624.800000 ms, 2523.323799 m/s.",
  "The first row, 1500.000000 m/s."],
 "Dix gives Vint^2 = (Vrms2^2 t2 - Vrms1^2 t1) / (t2 - t1); the largest interval velocity on the table is 2885.878392 m/s, over 1288.800000 to 1311.000000 ms, above 2689.639308 and 2523.323799 m/s, and the first row's interval velocity is its RMS velocity, 1500.000000 m/s.")

q(3, "Which of the course's three angle bins does the 1000 m offset fall in at the top on gather 5, and at what straight-ray angle?",
 "21.859471 degrees, in the 15 to 25 degree mid bin.",
 ["19.716435 degrees, Walden's angle at 1000 m on the teaching earth, in the mid bin.",
  "11.138104 degrees, in the 5 to 15 degree near bin.",
  "31.872141 degrees, in the 25 to 35 degree far bin."],
 "At 1000 m Walden's equation gives 21.859471 degrees, inside 15 to 25 degrees; on the same table 500 m gives 11.138104 and 1500 m 31.872141 degrees, and the teaching earth gives 19.716435 at 1000 m.")

q(2, "At the base of the third layer of the designed teaching earth, which zero-offset time and velocities does Walden's angle read?",
 "t0 1596.736597 ms, Vrms 2152.777869 m/s and Vint 2600 m/s.",
 ["t0 1292.000000 ms, Vrms 2388.940541 m/s and Vint 2885.878392 m/s, the Ekene top.",
  "t0 1596.736597 ms, Vrms 2600 m/s and Vint 2152.777869 m/s.",
  "t0 1596.736597 ms, Vrms 2152.777869 m/s and Vint 3000 m/s, the fourth layer's velocity."],
 "layeredRms gives the third layer's base at t0 1596.736597 ms with Vrms 2152.777869 m/s, and the layer itself runs at 2600 m/s; 3000 m/s is the fourth layer, and 1292.000000 ms with 2388.940541 and 2885.878392 m/s belongs to the Ekene table.")

# CROSS m04 (the kit's stack traces) + m05 (the Shuey fit) + m06 (the seismic side)
q(1, "At Ekene-1 the comparison's seismic gradient is -1072.562182. What gradient did the two-term fit on gather 5's own angle bins give at the same time?",
 "-734.431814.",
 ["-915.097371, the B of the three-term fit on the same three bins.",
  "-927.296460, the nine-bin B.",
  "-0.563558, Ekene-1's modelled gradient."],
 "Gather 5's bins at 10, 20 and 30 degrees give a two-term B of -734.431814 at 1292.000000 ms; the comparison fits the kit's near, mid and far stack traces, whose far trace reads 220.203720 against the gather's 320.449005, and returns -1072.562182. -0.563558 is a reflection coefficient from the logs.")

# CROSS m04 (the angle ranges) + m06 (the seismic fit at the wells)
q(0, "The comparison at the wells fits its seismic A and B with two Shuey terms at 10, 20 and 30 degrees. What are those three angles?",
 "The mean angles of the 5 to 15, 15 to 25 and 25 to 35 degree bins, the ranges the kit's near, mid and far stacks span.",
 ["Walden's angles at 500, 1000 and 1500 m on the Ekene table at the top of gather 5.",
  "The usable angle of 35.000000 degrees split into three equal steps from the near offset.",
  "The ray-traced angles at the bases of the teaching earth's three upper layers."],
 "The fit places the three bins at their mean angles of 10, 20 and 30 degrees, and the kit built its near, mid and far stacks over 5 to 15, 15 to 25 and 25 to 35 degrees; Walden's angles at 500, 1000 and 1500 m on the Ekene table are 11.138104, 21.859471 and 31.872141 degrees.")

q(3, "The two-term fit at gather 5's top is rerun on 9 bins of 5 degrees at their centres in place of three. What comes back?",
 "A 519.312395 and B -927.296460, from 9 angles.",
 ["A 510.227684 and B -915.097371, the figures of the three-term fit on the three bins.",
  "A 501.873676 and B -734.431814 again, since narrower bins add no new traces to the fit.",
  "An exactly determined fit with C 467.947963, since 9 angles fix three terms."],
 "On 9 bins of 5 degrees the two-term fit returns A 519.312395 and B -927.296460 with 9 angles used, both larger in size than the three-bin A 501.873676 and B -734.431814. The three-term fit on three angles, exactly determined, gives A 510.227684, B -915.097371 and C 467.947963.")

# ---- m05 AVO volumes ----

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

q(2, "Which references does the course name for the fluid factor and for the chi projection?",
 "Smith and Gidlow (1987) for the fluid factor, Whitcombe and others (2002) for chi.",
 ["Castagna and Swan (1997) for the fluid factor, Shuey (1985) for chi.",
  "Whitcombe and others (2002) for the fluid factor, Smith and Gidlow (1987) for chi.",
  "Walden (1991) for the fluid factor, Yilmaz (2001) for chi."],
 "contrastsFromAB follows Smith and Gidlow (1987) and chiProjection Whitcombe and others (2002); Castagna and Swan (1997) is the background trend, Shuey (1985) the intercept and gradient, Walden (1991) the straight-ray angle and Yilmaz (2001) the NMO stretch.")

q(3, "A study maps A cos(chi) + B sin(chi) at a stated chi of 30 degrees. What does the top's point, A 501.873676 and B -734.431814, project to?",
 "67.419446.",
 ["833.848276, the projection at chi = atan(m), along the background trend.",
  "501.873676, the intercept itself, which any chi projection returns unchanged.",
  "309.781098, the off-trend distance, which a chi of 30 degrees reads across the trend."],
 "A chi of 30 degrees weights the intercept by its cosine and the gradient by its sine, giving 67.419446; at -76.033690 degrees, along the background trend, the same point gives 833.848276. offTrend measures 309.781098 across that line, and a chi of zero returns A itself.")

q(1, "Which of these is one of the three steps QI Studio runs to condition angle stacks before the AVO fit?",
 "Spectral balancing.",
 ["AB semblance, the measure residualMoveout changes to when its lags scatter.",
  "The stretch mute, applied at a stated limit such as 0.200000.",
  "The Dix conversion of the RMS velocity table, turning each stack's times into interval velocities."],
 "QI Studio's conditioning is trim statics between the stacks, matching in shift, phase and scale, and spectral balancing, in engines/qi/conditioning.js, which the course vendors none of. AB semblance and the stretch mute at 0.200000 belong to the gather QC, and the Dix conversion to angles from velocity.")

# CROSS m05 (the fluid factor) + m06 (the one scale)
q(0, "contrastsFromAB needs A and B as reflection coefficients. How does the course get them from gather 5's top, A 501.873676 and B -734.431814?",
 "It divides both by the one scale over the four wells, 1882.216944, fitted by the comparison at the wells.",
 ["It divides both by the trend slope of -4.020851, the ratio of B to A that the background trend fits over 176 pairs.",
  "It reads them as they stand from the Shuey fit.",
  "It takes Ekene-1's modelled A and B, 0.170742 and -0.563558."],
 "The fluid factor needs A and B as reflection coefficients, and the course divides the top's two-term A and B by the one scale of 1882.216944, then reads dVp/Vp 0.426623 and a fluid factor of 0.107520 at Vs/Vp 0.500000. The fit's A and B are in trace amplitude units.")

# CROSS m05 (the off-trend distance) + m06 (what ties trace units to reflectivity)
q(3, "The top's off-trend distance on gather 5 is 309.781098. In what units is it?",
 "In the kit's trace amplitude units, the units of the A and B the trend was fitted to.",
 ["Reflection coefficient units already, since the background trend is fitted to modelled interfaces taken to brine.",
  "Degrees, the angle off the trend line.",
  "Milliseconds, the point's residual off the trend in time, as residualMoveout reports at the far offset."],
 "The background trend is fitted to the seismic (A, B) pairs of gather 5, so the top's 309.781098 is in trace amplitude units; seismic amplitudes become reflection coefficients only through the one least-squares scale over the wells, 1882.216944.")

# ---- m06 AVO at the wells ----

q(2, "After division by the one scale, which well's seismic gradient is the least negative?",
 "Ekene-2, -0.410601, against a modelled -0.501240.",
 ["Ekene-4, -0.475262, against a modelled -0.520090.",
  "Ekene-1, -0.569840, against a modelled -0.563558.",
  "Ekene-3, -0.663631, against a modelled -0.641524."],
 "The scaled seismic gradients are -0.569840 at Ekene-1, -0.410601 at Ekene-2, -0.663631 at Ekene-3 and -0.475262 at Ekene-4, so Ekene-2 is the least negative, against its modelled -0.501240 from net sand.")

q(1, "Ekene-3's scaled seismic point is A 0.249870 and B -0.663631. Which modelled point does the comparison at the wells set it against?",
 "A 0.194681 and B -0.641524, from the cap rock over its oil leg.",
 ["A 0.216991 and B -0.520090, from the cap rock over its net sand, the layer Ekene-4 is modelled from.",
  "A 470.308887 and B -1249.098330, its own seismic point before the division by the one scale of 1882.216944.",
  "A 0.170742 and B -0.563558, from Ekene-1's oil leg, the well whose trace gather 5 carries."],
 "Ekene-3 holds 114 oil-leg samples, so its modelled side is the cap rock over its oil leg, A 0.194681 and B -0.641524, at a residual of 0.059452 from the scaled seismic point. 470.308887 and -1249.098330 are its seismic A and B before the division, and the other two points belong to Ekene-4 and Ekene-1.")

# CROSS m01 (polarity) + m06 (the issues the comparison raises)
q(0, "The kit's seismic is SEG normal polarity, and the one scale at Ekene is positive. Which result of the comparison would QI Studio rate as a high issue?",
 "A negative scale, the sign of a polarity or wavelet problem.",
 ["A class that differs at one well.",
  "A positive scale, read as reversed seismic.",
  "A wavelet correlation of 0.693702 with the average, read by the comparison at the wells."],
 "At Ekene the one scale is 1882.216944, positive, and 4 of 4 wells agree in class; QI Studio keeps its high rating for a negative scale, which points to polarity or the wavelet. 0.693702 is Ekene-3's reversed wavelet in the tie register.")

# CROSS m03 (the stretch) + m04 (Walden) + m06 (the capstone)
q(3, "In the Professional capstone, the NMO stretch is read at the same offset and time as which other graded figure?",
 "Walden's angle at a stated offset and time.",
 ["The Dix interval velocity.",
  "The two-term Shuey intercept.",
  "The one scale over the four wells."],
 "The case states the offset and time, and Walden's angle and the stretch both read them: at Ekene, at 2500 m and 1292.000000 ms, Walden gives 49.493998 degrees and the stretch is 0.286880. The Dix velocity reads two rows of the table, the intercept reads the target sample, and the scale reads the four wells.")

emit(Q, '/root/qi-wip-qi/banks/qii_exam.json', expect_n=42)
finish()
