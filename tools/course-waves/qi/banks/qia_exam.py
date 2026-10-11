import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# QI Expert final exam, 42 questions across the six modules: the forward model,
# post-stack inversion, simultaneous inversion, properties from impedance,
# prospects, the report and the limits. Questions marked CROSS need two modules
# at once.

# ---- m01 the forward model ----

q(1, "The inversion explorer's forward view runs the dot-product test on two seeded vectors of 101 samples. What does it print for the centred convolution C with the scaled wavelet?",
 "38.991017 on both sides, a difference of 0.000000.",
 ["-0.753789 on both sides, the pair the convolution shares with the centred first difference D.",
  "38.991017 for (A x) . y and -0.753789 for x . (A^T y), a mismatch the solver absorbs at every step.",
  "344.213395 on both sides, the synthetic's peak at Ekene-1 at 1288.000000 ms carried into the test."],
 "The test prints 38.991017 for (C x) . y and for x . (C^T y), a difference of 0.000000. The pair -0.753789 belongs to the centred difference D, and 344.213395 is the synthetic at Ekene-1 at 1288.000000 ms, no part of the test.")

q(3, "Why does the forward model take m = ln(AI), the natural log of acoustic impedance, as its unknown?",
 "Half the difference of ln(AI) is close to the reflection coefficient for small contrasts.",
 ["The log carries the trend below about 8 Hz, so the seismic band supplies the level and no low-frequency model is needed.",
  "Taking the log removes the wavelet, so the trace is d = D m with no convolution.",
  "The log makes each reflection the full change of ln(AI) across two samples, with no factor of one half anywhere."],
 "The course writes the model in ln(AI) because half the difference of ln(AI) is close to the reflection coefficient for small contrasts; the trace is d = C D m with D the centred difference, half the change across two samples. The seismic band holds no trend, so the LFM supplies what lies below about 8 Hz.")

q(0, "lowFrequencyModel smooths each well's ln(AI) by a moving average whose half window is round(1000 / (cut x dt) / 2) samples. At the stated 8 Hz cut on the 4.000000 ms clock, how wide is that half window?",
 "16 samples.",
 ["21 samples, the length of the stated 25 Hz Ricker.",
  "27 samples, the logged count at Ekene-1.",
  "101 samples, the whole window from 1100 to 1500 ms."],
 "The course prints a half window of 16 samples for the 8 Hz cut on the 4.000000 ms clock. 21 samples is the Ricker's length at half length 40 ms, 27 the logged samples at Ekene-1 and 101 the inversion window.")

q(2, "Between the top and base of the Ekene Sand, mapToWellTime carries an Ekene-1 trace time to Ekene-2's horizons. Where does the mid-sand time 1299.913186 ms at Ekene-1 land?",
 "At 1318.075904 ms, keeping its proportional position between Ekene-2's top and base.",
 ["At 1299.913186 ms, one two-way time held at every well between the horizons.",
  "At 1305.746335 ms, Ekene-2's top, every sample inside a layer snapping to the horizon above it.",
  "At 1338.405474 ms, Ekene-2's base, the time offset from the lower horizon being kept inside the layer."],
 "Between two horizons a sample keeps its proportional position, and the course maps 1299.913186 ms at Ekene-1 to 1318.075904 ms at Ekene-2. 1305.746335 ms and 1338.405474 ms are Ekene-2's top and base, where Ekene-1's own horizons at 1288.796378 ms and 1319.029994 ms land; the time offset is kept only above the first horizon and below the last.")

q(1, "On the Ekene pack the wavelet scale pools 19 samples at the four wells. What does waveletScale do on a case where the wells overlap fewer than ten usable samples of seismic?",
 'It refuses, in the engine\'s own words: "The wells overlap too little seismic to scale the wavelet."',
 ["It returns a scale with NaN fields, as elasticPoint does with Vs above Vp, and the panel shows the gap.",
  "It returns 1.000000, the peak of the unit Ricker, and every inversion then runs on the unscaled wavelet.",
  "It pools the near, mid and far stacks as well until the count reaches the full stack's 19 samples."],
 "waveletScale refuses below ten usable samples with the message quoted in the key; the Ekene pack clears the rule with 19 samples and a scale of 769.984107. A NaN result is elasticPoint's behaviour, and the unit Ricker's peak of 1.000000 is what the scale multiplies.")

# CROSS m01 (the stated Ricker) + m03 (angle-dependent wavelets)
q(2, "The pack's stated wavelet is a zero-phase 25 Hz Ricker of half length 40 ms. At a half length of 3, extractAngleWavelets returns a 7-sample wavelet for each stack. What does the course do with that result?",
 "It states the Ricker shape and scales it per stack, since a 7-sample wavelet spans 24.000000 ms, shorter than the stated Ricker.",
 ["It runs the simultaneous inversion on the three 7-sample wavelets, whose synthetic at Ekene-1 reaches 0.941755 against the near stack.",
  "It lengthens the half length to 15, where extractAngleWavelets returns a 31-sample wavelet for all 3 stacks.",
  "It drops the far stack, whose 7-sample wavelet fits worst, and inverts from near and mid only."],
 "A 7-sample wavelet spans 24.000000 ms, shorter than the 21-sample Ricker, so the course states the Ricker shape and scales it per stack for the inversions. At a half length of 15 the engine returns no wavelet for any stack (0 of 3), and the inversions use near, mid and far at 10, 20 and 30 degrees.")

# CROSS m01 (the settings the tier states) + m04 (left-out wells and the widened band)
q(3, "Which stated frequency is both the high cut of the log an inversion is scored against and the low-pass calibrateProperty applies to each well's ln(AI) and porosity at seismic scale?",
 "50 Hz.",
 ["8 Hz, the low-frequency cut of the LFM and the crossover sparse-spike takes its low frequencies through.",
  "60 Hz, the upper edge of the coloured band from 8 to 60 Hz.",
  "25 Hz, the frequency of the stated zero-phase Ricker wavelet."],
 "The tier scores every inversion against the log after a 50 Hz high cut, and the seismic-scale calibration low-passes ln(AI) and porosity at 50 Hz. 8 Hz is the LFM cut and the sparse-spike crossover, 8 to 60 Hz the coloured band, 25 Hz the Ricker.")

# CROSS m01 (the seeded adjoint test) + m02 (sensitivity across realisations)
q(0, "A report states the seeds behind every figure. Which seeds and noise level produce the mean relative spread in AI of 0.645787 at Ekene-1?",
 "The 20 seeds 101 to 120, with noise at a signal-to-noise ratio of 4.",
 ["Seed 42 of mulberry32, the dot-product test's seed.",
  "The same 20 seeds, 101 to 120, with the added noise at a signal-to-noise ratio of 8.",
  "None: the engine draws its noise from the clock."],
 "The realisations add seeded Gaussian noise at a signal-to-noise ratio of 4 on the 20 seeds 101 to 120, giving a mean relative spread of 0.645787 over the 27 logged samples. Seed 42 drives the adjoint test, and no engine reads a clock or a random number of its own.")

# CROSS m01 (the wavelet scale) + m03 (angle-dependent wavelets)
q(3, "The full-stack wavelet scale is 769.984107. Which statement about the three per-stack scales the course measures by the same pooled least-squares rule is printed?",
 "Each rests on 19 samples, the count behind the full-stack scale.",
 ["The near-stack scale equals the full-stack scale, 769.984107, the near angle of 10 degrees standing in for zero offset.",
  "The far-stack scale, 1305.654435, is the largest, a far stack carrying more high frequency than a near one.",
  "Each comes from extractAngleWavelets at a half length of 15 samples, one 31-sample wavelet per stack."],
 "Near 1860.598608, mid 1679.662569 and far 1305.654435 each rest on 19 samples, as the full-stack scale of 769.984107 does. The near scale is the largest, a far stack carries less high frequency, and at a half length of 15 the engine returns no wavelet for any stack.")

# ---- m02 post-stack inversion ----

q(2, "The blind model-based inversion at Ekene-1 runs at 20, 60, 120 and 300 iterations with eps 0.050000. What do the residual and the AI error do as the count rises?",
 "The residual falls to 1.233454 while the AI error at the well rises to 52.851805 percent.",
 ["Both fall, the AI error reaching 8.300748 percent at 300 iterations.",
  "The residual rises to 3.419041 while the correlation with the log climbs to 0.852881, the solver settling on the trend.",
  "Neither moves after 60, the solver stopping early so that 120 and 300 iterations both repeat the residual 2.121830."],
 "From 20 to 300 iterations the residual falls from 3.419041 to 1.233454 while the AI error rises from 8.300748 to 52.851805 percent: the solver fits the trace beyond what the wavelet and scale explain. Every count asked is run, 120 and 300 included.")

q(1, "Sparse-spike runs at QI Studio's starting lambda of 0.002000 on the Ekene-1 trace, whose largest absolute amplitude is 399.814697. How many of the 101 reflectivity samples are non-zero?",
 "101 of 101: on traces of this amplitude that lambda imposes no sparsity.",
 ["27 of 101, one spike for each logged sample at the well, the log setting where reflectivity may sit.",
  "61 of 101 at 400 iterations, the extra iterations sharpening even the smallest lambda into a sparse series.",
  "36 of 101, lambda being read against the unit wavelet's peak of 1.000000 and the trace's amplitude ignored."],
 "At lambda 0.002000 the count is 101 at both 60 and 400 iterations, so that lambda imposes no sparsity. 61 is the count at lambda 200.000000 and 400 iterations, and 36 and 27 belong to lambda 5000.000000; lambda is read on the trace's own amplitude scale.")

q(0, "Coloured inversion at Ekene-1 correlates 0.931237 with the log band-passed between 8 and 50 Hz. Why does the course score it by correlation alone?",
 "Its output is relative impedance, band-limited with no level, so there is no level to compare.",
 ["Its operator carries the LFM's level, and an RMS error would count that level twice.",
  "Its wavelet scale of 769.984107 leaves every AI error in trace units.",
  "Its slope alpha of -1.012769 is fitted to the trace, fixing the error at zero."],
 "Coloured inversion uses no wavelet and no LFM: one operator with phase minus 90 degrees and slope alpha -1.012769 fitted to the wells' logs, so its output is relative impedance with no level, scored by correlation alone. The scale 769.984107 belongs to the wavelet the absolute inversions use.")

q(3, "The blind-well table sets the LFM alone beside the model-based inversion at the four pack wells. Which reading does the course print?",
 "The LFM alone correlates negatively at every well, and its RMS error is lower than the model-based blind error at 4 of 4.",
 ["The LFM alone correlates positively at every well, from 0.759365 to 0.889320, carrying level and shape.",
  "The model-based blind error is lower than the LFM's at every well, the inversion supplying the level the LFM lacks.",
  "Keeping each well in its own LFM lowers the model-based error at all four wells, Ekene-1 dropping below 10.557858 percent."],
 "The LFM-only correlations run from -0.345505 to -0.190352 and its error is lower than the model-based blind error at 4 of 4 wells: the LFM carries the level, the inversion the shape. 0.759365 to 0.889320 is the inversions' blind correlation range, and kept in, Ekene-1's error is 10.805677 percent.")

q(1, "At which pack wells does the sparse-spike blind AI error fall below the LFM-only error?",
 "Ekene-1 and Ekene-4.",
 ["Ekene-2 and Ekene-3, where the LFM-only errors are 10.450743 and 8.512597 percent.",
  "All four wells, sparse-spike carrying the level of the log as well as its shape.",
  "None of the four, the LFM alone keeping the lower error everywhere for both methods."],
 "Sparse-spike's blind error is lower than the LFM alone at Ekene-1 (8.356661 against 8.638086 percent) and Ekene-4; the LFM keeps the lower error at Ekene-2 and Ekene-3. Against model-based, the LFM is lower at 4 of 4.")

q(2, "Over 20 realisations at Ekene-1, the 1304.000000 ms row reads Q10 5069751.189881, Q50 6629158.255936 and Q90 9889658.945117. What does relativeSpread return there, and which of the three is the low figure?",
 "0.727077, with Q10 the low figure, the value 10 percent of realisations fall below.",
 ["The same 0.727077, with Q90 the low figure, as P90 is for a volume.",
  "0.645787, the mean spread over the 27 logged samples, with Q10 as the low figure.",
  "0.498207, the spread one row up at 1288.000000 ms, again with Q10 as the low figure."],
 "relativeSpread is (Q90 - Q10) / Q50, 0.727077 at 1304.000000 ms; Q10 is the 10th percentile, the low figure, and the P-label convention with P90 low applies to outcomes such as volumes. 0.645787 is the mean over the logged samples and 0.498207 the row at 1288.000000 ms.")

# ---- m03 simultaneous inversion ----

q(0, "At normal incidence, what do Fatti's coefficients give at the Ekene background Vs/Vp of 0.394396?",
 "G1 0.500000 for AI, with G2 and G3 both zero: only AI contributes.",
 ["G1 0.500000 and G3 -0.006165, density entering even at zero angle.",
  "G1 0.666667, G2 -0.155548 and G3 -0.088893, all three contributing at zero angle.",
  "G2 0.500000 for SI, the shear term leading at zero angle."],
 "At 0 degrees G1 is 0.500000 and G2 and G3 are 0.000000, so only AI contributes. G3 -0.006165 is the 10 degree value, and 0.666667, -0.155548 and -0.088893 are the coefficients at 30 degrees.")

q(3, "At Ekene-1, blind, simultaneous inversion runs from the near stack only. What does density do?",
 "Its RMS error stays under one percent at 0.627310 while its correlation changes to 0.614032.",
 ["Its correlation turns to -0.767957 with an error of 14.112317 percent, the near stack driving density hardest of all.",
  "It keeps the LFMs' correlation of -0.087754, G3 being zero at 10 degrees so the near stack leaves density alone.",
  "Its error rises to 12.184029 percent, the near stack moving density's level."],
 "With the near stack only, density's error is 0.627310 percent against the LFMs' 0.767482 and its correlation moves from -0.087754 to 0.614032: G3 is -0.006165 at 10 degrees, tiny but non-zero. -0.767957 and 14.112317 come from all three stacks, 12.184029 from near and mid.")

q(1, "At Ekene-1, blind, simultaneous inversion from the near stack alone returns which Vp/Vs scores?",
 "A correlation of -0.744719 and an error of 30.824755 percent.",
 ["A correlation of 0.470296 and an error of 10.707173 percent, the scores the near, mid and far stacks reach together.",
  "The LFMs' scores, 0.048283 and 11.122749 percent.",
  "0.383124 and 13.660754 percent, the mid stack adding nothing."],
 "The near stack alone gives Vp/Vs a correlation of -0.744719 and an error of 30.824755 percent, worse than the LFMs alone at 0.048283 and 11.122749. Adding the mid stack gives 0.383124 and 13.660754, and all three give 0.470296 and 10.707173.")

q(2, "Run blind at all four pack wells from the near, mid and far stacks, which parameter does the course find correlates well?",
 "AI: it correlates well at every well, and Vp/Vs and density do not.",
 ["AI and Vp/Vs, the shear term correlating positively at every well from 0.360220 upwards.",
  "All three, density included, its error falling to 9.115991 percent at Ekene-4.",
  "Density alone, from its Ekene-4 correlation of -0.413424."],
 "AI correlates from 0.780557 to 0.863789 at the four wells; Vp/Vs reads -0.287516 at Ekene-2 and -0.132709 at Ekene-4, and density is negative at all four, -0.413424 at Ekene-4 included. A small density error such as 9.115991 percent sits beside a negative correlation.")

q(0, "At Ekene-1, the well-wavelet fit under extractAngleWavelets runs with a half length of 15 samples, a 31-sample wavelet longer than the 27 logged samples. What does the engine say?",
 '"The well reflectivity is flat over the seismic at the well, so there is nothing to extract a wavelet from."',
 ['"The log covers 16 usable samples at the well; a 11-sample wavelet needs at least 22. Shorten the wavelet or use the statistical one."',
  '"The wells overlap too little seismic to scale the wavelet."',
  "Nothing: it returns a 7-sample wavelet for each of the 3 stacks, trimming the request to fit the log."],
 "With a half length of 15 no row of the fit is complete and the engine gives the message in the key, in its own words. The message about 16 usable samples comes at a half length of 5, the overlap message is waveletScale's, and the 7-sample wavelets come at a half length of 3.")

# CROSS m03 (blind wells per parameter) + m04 (two attributes)
q(3, "The two-attribute facies model on AI and Vp/Vs scores a share correct of 0.973443 on its own samples at log scale. At which pack wells is the blind Vp/Vs correlation of the simultaneous inversion negative?",
 "Ekene-2 and Ekene-4, at -0.287516 and -0.132709.",
 ["Ekene-1 and Ekene-3, at 0.470296 and 0.360220, the wells nearest the oil leg.",
  "All four, from -0.767957 to -0.413424, the inversion running against the log.",
  "None: Vp/Vs follows the log at every well, as AI does from 0.780557 up."],
 "Blind, from near, mid and far, Vp/Vs correlates -0.287516 at Ekene-2 and -0.132709 at Ekene-4, and positively at Ekene-1 (0.470296) and Ekene-3 (0.360220). -0.767957 to -0.413424 is density's range, so a facies map on inverted Vp/Vs rests on a parameter the blind wells do not support.")

# ---- m04 properties from impedance ----

q(1, "The log-scale porosity transform is calibrated on AI from 5693260.530000 to 8402495.750400. What does predictWithInterval do at AI 8500000.000000?",
 "It still answers, 0.169599 with an 80 percent band of 0.146406 to 0.192792, widened only by the distance term.",
 ["It refuses outside the calibration range, the way fitVsRegression refuses a form it does not know.",
  "It returns NaN for the prediction and both ends of the band, the panel showing a gap.",
  "It clamps the AI to 8402495.750400 and returns that point's porosity, so the band cannot widen."],
 "8500000.000000 lies outside the calibration range; the engine still answers 0.169599 between 0.146406 and 0.192792, its interval widening only by the distance term. No refusal, no NaN and no clamp: a study flags the prediction as made outside the range.")

q(3, "At seismic scale the porosity transform has s 0.007175 log against log and a pooled left-out RMS of 0.024072. What widening s_extra does calibrateProperty add?",
 "0.022977, from sqrt(RMS^2 - s^2), since the RMS exceeds s.",
 ["0.017980, the log-scale fit's residual error.",
  "0.007175, s itself, with nothing added.",
  "0.024072, the pooled RMS added to s whole, the two errors stacking in a straight line."],
 "s_extra = sqrt(RMS^2 - s^2) when the RMS exceeds s, and the course prints 0.022977. 0.017980 is the log-scale s on 644 samples; the left-out residuals carry the inversion's error, which a log-against-log fit cannot see.")

q(2, "Left out of the seismic-scale porosity calibration, Ekene-4's 4 samples return a correlation of NaN. What does that result mean?",
 "Either series has no spread over the well's samples, and the code returns NaN as its result.",
 ["The engine refused Ekene-4, as substituteVels refuses a porosity of 0, and the well leaves the pool.",
  "Ekene-4's predictions all fall outside the widened band, its share inside reading 0.600000.",
  "The prediction and the log agree exactly at all 4 samples, the RMS porosity error reading 0.000000."],
 "A NaN correlation is the result the code returns when either series has no spread over the well's samples. Ekene-4 still reports an RMS error of 0.012741, a bias of -0.009593 and a share inside the widened band of 1.000000; 0.600000 is Ekene-1's share.")

q(0, "On AI alone at 6600000.000000, the sample-proportion priors make brine sand most likely at 0.557911. What do equal priors return at the same AI?",
 "Oil sand at 0.673039 and brine sand at 0.326961: the prior is a stated choice, and it moves the answer.",
 ["Brine sand still at 0.557911, a prior being unable to move a posterior where shale reads 0.000000.",
  "Shale at 0.796396, equal priors handing it the share its 2519 samples carry.",
  "Oil sand at 0.997373, the call the two-attribute model makes at Vp/Vs 1.750000."],
 "With equal priors at 6600000.000000 the posteriors are shale 0.000000, oil sand 0.673039 and brine sand 0.326961, so the call flips. 0.796396 is shale's sample-proportion prior, and 0.997373 needs Vp/Vs 1.750000 as a second attribute.")

q(1, "In the one-attribute confusion matrix on AI, how are the 179 oil-sand samples called?",
 "49 oil sand, 127 brine sand and 3 shale.",
 ["160 oil sand and 19 brine sand, the oil-sand row behind the share correct of 0.934872.",
  "Most of them as oil sand, the diagonal entry that lifts the share correct to 0.934872.",
  "26 oil sand and 439 brine sand, the brine-sand row read as the oil-sand row."],
 "On AI alone the oil-sand row reads 3 shale, 49 oil sand and 127 brine sand: most oil-sand samples are called brine sand. 160 and 19 are the two-attribute row, and 439 and 26 belong to the brine-sand row of the AI matrix.")

q(3, "How does QI Studio label a facies class named for a fluid, such as oil sand or brine sand?",
 "fluid_hypothesis, and every other class calibrated_prediction.",
 ["calibrated_prediction, like every class.",
  "fluid_measurement, for a class scoring above 0.934872.",
  "oil_sand or brine_sand, the fluid read straight from the class name and carried through to every map."],
 "A facies named for a fluid is a hypothesis about the pore fluid, and QI Studio labels it fluid_hypothesis; every other class is calibrated_prediction. No engine infers a fluid from a class name.")

# CROSS m02 (blind wells) + m04 (left-out wells and the widened band)
q(2, "calibrateProperty leaves each well out, refits the porosity transform on the others, and predicts that well's porosity. From which AI does it predict?",
 "The blind inverted AI at that well, from the inversion with the well left out of its LFM.",
 ["The LFM alone at that well, whose AI error at Ekene-1 left out is 8.638086 percent.",
  "The well's own log AI after the 50 Hz high cut, so the residuals match s of 0.007175.",
  "Coloured inversion's relative impedance, the one product built with no LFM between wells."],
 "Porosity is predicted from the blind inverted AI at the left-out well, so the left-out residuals carry the inversion's error and their pooled RMS of 0.024072 widens the band. The log against log gives only s 0.007175, and coloured inversion carries no level.")

# ---- m05 prospects ----

q(0, "On the Ekene Sand top grid from the six development wells' tops, what column does spillAnalysis return from crest to spill, and what flag stands beside it?",
 "2.380249 ft, with the spill limited by the map edge.",
 ["From the crest at -5051.568570 ft down to the wells' contact at -5118.110236 ft, the closure closed at that contact.",
  "2.380249 ft, the spill at a saddle inside the map.",
  "11 ft, one foot for each node at the spill."],
 "The crest is -5051.568570 ft and the spill -5053.948819 ft, a column of 2.380249 ft with the spill limited by the map edge, so the figure is the map's limit. At the wells' contact, -5118.110236 ft, the closure is reported open; 11 is the node count at the spill.")

q(1, "Designed teaching anomaly A, every mapped node shallower than the spill, has an edge scatter of 0.643935 ft. What conformance and implied contact does anomalyConformance return?",
 "Conformance 0.729467, implied contact -5053.959008 ft.",
 ["Conformance 1.000000, its share inside the closure, with the contact sitting exactly at the spill of -5053.948819 ft.",
  "Conformance 0.000000, at -5068.442175 ft.",
  "Conformance 0.643935, the scatter read directly."],
 "Conformance is 1 - scatter / relief, and for A it is 0.729467 with an implied contact of -5053.959008 ft, just below the spill at -5053.948819 ft. 1.000000 is A's share inside the closure, and 0.000000 with -5068.442175 ft is anomaly B.")

q(3, "Designed teaching anomaly B is cut at the grid's middle column. Its edge scatter is 6.992237 ft against a closure relief of 2.380249 ft. What conformance does the engine return?",
 "0.000000, as 1 - scatter / relief is clipped to 0 to 1.",
 ["0.152778, the share of B's nodes lying inside the closure at the spill.",
  "0.729467, the conformance of A carried to every anomaly on the same closure.",
  "None: the engine refuses the anomaly."],
 "B's scatter exceeds the closure's relief, so conformance clips to 0.000000, under the 0.3 the assessment counts as cutting across. The engine still answers; 0.152778 is B's share inside the closure and 0.729467 is A's conformance.")

q(2, "An anomaly is present with conformance 0.83, 0.9 inside the closure, a feasible verdict and nothing open, but only one independent supporting source. What does assessProspect return?",
 "investigate, with seismic support supports.",
 ["mature, with supports, three supporting items counting as three sources.",
  "investigate, with neutral, a single source dropping the support word.",
  "downgrade, with against, too few sources counting against the prospect."],
 "Maturing needs two independent supporting sources, so the same case with one source returns investigate while the seismic still supports. neutral comes from a competing explanation judged likely or an unstated feasibility with no anomaly, and against from no anomaly on feasible data.")

q(0, "No anomaly is seen, and the feasibility verdict is not stated. What does the assessment return?",
 "retain, neutral: absence counts against a prospect only where the feasibility study says the case would be visible.",
 ["downgrade, against, the absence of an anomaly counting against every prospect.",
  "investigate, neutral, the row for a competing explanation judged likely.",
  "mature, supports, nothing being open on the prospect."],
 "With no anomaly and feasibility not stated the table returns retain and neutral; downgrade and against need the feasibility study to say the case would be visible. investigate with neutral is the competing explanation row, and mature with supports needs an anomaly with two independent sources.")

q(1, "A prospect is picked at the mapped node nearest the grid's centre, column 12, row 9, at -5057.417979 ft. Where does climbToCrest end?",
 "At node 310, -5051.568570 ft, the same crest as the highest mapped node.",
 ["At the spill, -5053.948819 ft, the climb stopping where the flood first meets the mapped edge.",
  "Where it starts, -5057.417979 ft, the climb checking four neighbours and finding none higher.",
  "At -5053.959008 ft, anomaly A's implied contact."],
 "The climb steps to the highest of its eight neighbours until none is higher and ends at node 310, -5051.568570 ft, the highest mapped node. -5053.948819 ft is the spill and -5053.959008 ft anomaly A's implied contact.")

# CROSS m04 (the confusion matrix) + m05 (competing explanations and the assessment)
q(3, "An interpreter judges likely the competing explanation that a soft impedance anomaly is brine sand, citing the AI-only confusion matrix where 127 of the 179 oil-sand samples are called brine sand. The anomaly is present. What does the assessment return?",
 "investigate, with seismic support neutral.",
 ["mature, supports, the anomaly being present with two independent sources behind it.",
  "downgrade, against, the rival explanation counting as the absence of an anomaly.",
  "retain, neutral, the row for no anomaly where feasibility is not stated."],
 "A competing explanation judged likely holds the prospect at investigate with neutral support, the table's last row. On AI alone 127 of the 179 oil-sand samples are called brine sand, which is why brine sand is a real rival; downgrade and retain are the two rows with no anomaly.")

# CROSS m02 (post-stack impedance) + m05 (independent evidence)
q(2, "A study lists three supporting items: a full-stack RMS amplitude, an impedance inverted from the same full stack, and a far-stack brightening. How does evidenceIndependence count them?",
 "3 supporting items and 2 independent sources, the first two sharing the source full_stack.",
 ["3 items and 3 sources, the inversion adding the LFM's information to the full stack's.",
  "3 items and 1 source, every seismic attribute counting as one response.",
  "2 items and 2 sources, the impedance dropped as a copy of the RMS amplitude."],
 "Attributes computed from one seismic response are one piece of evidence, so the full-stack amplitude and the full-stack impedance share full_stack: 3 supporting items, 2 independent sources. The far-stack brightening is the second source.")

# ---- m06 the report and the limits ----

q(1, "Which figure does QI never set, and what does prospectAssessment.js return in its place?",
 "The geological chance of success; the engine returns a recommendation and a seismic support, and no probability of success.",
 ["The gross rock volume; the engine returns a probability of success for the risk team to adopt.",
  "The recommendation; the engine returns the probability that the anomaly is oil sand, 0.997373.",
  "The seismic support word; the risk team picks supports, neutral or against from the closure."],
 "QI never sets the geological chance of success: prospectAssessment.js returns a recommendation (mature, investigate, retain or downgrade) and a seismic support (supports, neutral or against) for the risk team to weigh. Closure returns the gross rock volume, 1519731.367693 ft3 at the spill.")

q(0, "Which statement about the inputs of modelBased and simultaneousInversion matches what the engines compute?",
 "m0 is an input: no LFM is built inside either, and no wavelet is estimated inside an inversion.",
 ["Each builds its own LFM from the wells, with the 8 Hz cut, before its first iteration starts.",
  "Each estimates its wavelet from the trace and then applies the scale of 769.984107 to it.",
  "modelBased picks the top and base horizons the LFM follows, from the trace."],
 "The engines build no LFM inside modelBased or simultaneousInversion (m0 is an input), estimate no wavelet inside an inversion and pick no horizon. The 8 Hz LFM and the scaled Ricker with its 769.984107 scale are stated inputs built beforehand.")

q(3, "The Expert capstone asks for six figures read from the inversion and prospect explorers. On what data does it run?",
 "A held-out synthetic case supplied as a case file; the Ekene field is never used.",
 ["The Ekene pack, read at Ekene-1 on the tier's settings.",
  "The Ekene pack with fresh noise seeds, so its figures differ from those of the 20 seeds 101 to 120.",
  "A case built from the members-only videos."],
 "The capstone runs on a held-out synthetic case the learner pastes into the panels. The Ekene field is never used because the members-only videos speak the Ekene answers aloud, and no Ekene figure is graded, the eps 0.050000 and 60 iterations of the pack included.")

q(2, "What does the course's QI report state for every product?",
 "The method, the stated settings, the blind-well figures per parameter, the calibration and its left-out check, the prospect figures with their limits, and every issue raised.",
 ["The products alone, each volume carrying its own settings, its 8 Hz LFM cut and its 50 Hz high cut in its header.",
  "The inverted volumes and the recommendation, the settings left at QI Studio's starting values such as eps 0.050000.",
  "The method and the geological chance of success, the two figures a risk team reads first."],
 "The report states the method, the settings (window, wavelet and its scale, LFM cut, weights, iterations, seeds), the blind-well figures per parameter, the calibration and its left-out check, the prospect figures with their limits and every issue; a result without its settings cannot be checked, and QI never sets the chance of success. The 8 Hz cut and eps 0.050000 are among the settings it states.")

q(1, "Which reference does the course name for the sparse reflectivity that sparse-spike inversion solves by FISTA?",
 "Beck and Teboulle (2009), SIAM Journal on Imaging Sciences 2.",
 ["Lancaster and Whitcombe (2000), SEG Expanded Abstracts.",
  "Hyndman and Fan (1996), type 7.",
  "Fatti and others (1994), Geophysics 59, the reference for the linearisation in three parameters."],
 "The course names Beck and Teboulle (2009) for sparse reflectivity by FISTA. Lancaster and Whitcombe (2000) is coloured inversion, Hyndman and Fan (1996) type 7 the quantiles, and Fatti and others (1994) the simultaneous inversion.")

# CROSS m05 (crest, spill and closure) + m06 (what the engines do not compute)
q(0, "The closure at the spill on the Ekene grid returns a gross rock volume of 1519731.367693 ft3. What does the closure engine return in barrels?",
 "Nothing: closure returns gross rock volume only, and no volume in barrels.",
 ["1519731.367693 barrels, the engine reading the grid's cubic feet as barrels of rock.",
  "The oil in place over the 11 nodes, from the transform's porosity of 0.215267 at AI 6500000.000000.",
  "A volume in barrels at the contact, -5118.110236 ft."],
 "The engines compute no volume in barrels: closure returns gross rock volume only, 1519731.367693 ft3 over 11 nodes at the spill. At the wells' contact of -5118.110236 ft the closure is reported open, and no engine joins the porosity transform to the closure.")

emit(Q, '/root/qi-wip-qi/banks/qia_exam.json', expect_n=42)
finish()
