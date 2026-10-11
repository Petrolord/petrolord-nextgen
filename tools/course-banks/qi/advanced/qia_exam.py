import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# QI Expert final exam, 42 questions across the six modules: the forward model,
# post-stack inversion, simultaneous inversion, properties from impedance,
# prospects, the report and the limits. Questions marked CROSS need two modules
# at once.

# ---- m01 the forward model ----

q(1, "Before any inversion is trusted, the operator d = C D m is checked step by step on two seeded vectors. Which figures show that both steps pass?",
 "D prints -0.753789 on both sides and C prints 38.991017 on both sides, each with a difference of 0.000000.",
 ["D prints -0.753789 forward and 38.991017 backward, the two steps sharing one test of the whole operator end to end.",
  "Only C is tested, at 38.991017, a centred first difference being its own transpose and needing no check.",
  "C prints 344.213395 and 341.516846, the synthetic and the trace at 1288.000000 ms agreeing closely."],
 "The course tests each step: the centred difference D gives -0.753789 for (A x) . y and for x . (A^T y), the convolution C gives 38.991017 for both, and each difference is 0.000000. 344.213395 and 341.516846 are the Ekene-1 synthetic and trace at 1288.000000 ms, no part of the adjoint test.")

q(3, "Why does the forward model take m = ln(AI), the natural log of acoustic impedance, as its unknown?",
 "Half the difference of ln(AI) is close to the reflection coefficient for small contrasts.",
 ["The log carries the trend below about 8 Hz, so the seismic band supplies the level and no low-frequency model is needed.",
  "Taking the log removes the wavelet, so the trace is d = D m with no convolution.",
  "The log makes each reflection the full change of ln(AI) across two samples, with no factor of one half anywhere."],
 "The course writes the model in ln(AI) because half the difference of ln(AI) is close to the reflection coefficient for small contrasts; the trace is d = C D m with D the centred difference, half the change across two samples. The seismic band holds no trend, so the LFM supplies what lies below about 8 Hz.")

q(0, "Ekene-1 is left out of its own low-frequency model. Which of the remaining wells takes the largest inverse-distance share at Ekene-1, and how is a share formed?",
 "Ekene-2, 0.477419 at 1209.338662 m; each weight is the inverse square of the distance, and a share is that weight over the sum of the three.",
 ["Ekene-4, 0.477419 at 2193.171220 m, the farthest well weighted most so the model reaches across the field.",
  "Ekene-3, 0.377419 at 1360.147051 m, each share being the plain inverse of the distance over the sum.",
  "Each of the three wells an equal share, the power of 2 acting only once the horizons are mapped."],
 "The course prints 0.477419 for Ekene-2, the well 1209.338662 m away, with weights falling as the square of distance grows. Ekene-3's share is 0.377419, and equal shares would ignore the power of 2 the course states.")

q(2, "Ekene-1's sand top at 1288.796378 ms maps to Ekene-2's top at 1305.746335 ms. Above that horizon, Ekene-1's 1280.796378 ms maps to 1297.746335 ms. Which rule of mapToWellTime places it?",
 "Above the first horizon the time offset from that horizon is kept.",
 ["The proportional position between top and base is kept, as it is for every sample inside the sand.",
  "The sample takes the nearest covered value, as an uncovered one does.",
  "The two-way time is carried across unchanged, the LFM holding one clock at every well."],
 "Above the first horizon and below the last, mapToWellTime keeps the time offset from that horizon, which is why 1280.796378 ms lands at 1297.746335 ms. The proportional position applies between two horizons, and the nearest covered value fills samples no well covers.")

q(1, "Model-based inversion needs the 25 Hz Ricker scaled at the wells before it runs. What makes that scale necessary?",
 "A wavelet chosen for its shape carries an arbitrary amplitude, and the inversion reads impedance contrast from the ratio of the trace to the synthetic.",
 ["The scale supplies the level of AI that the band-limited trace lacks below about 8 Hz.",
  "The scale reshapes the Ricker until its spectrum matches the full stack at every well.",
  "The scale converts the trace from one-way to two-way time before the convolution."],
 "The scale is one number, 769.984107 over 19 samples on the pack, that makes s times the forward model match the seismic; it is needed because the shape carries an arbitrary amplitude and the inversion reads contrast from the trace over the synthetic. The level below about 8 Hz comes from the LFM, and one number cannot change the wavelet's shape.")

q(2, "The stated Ricker spans 21 samples. When the well-wavelet extraction under QI Studio's angle-wavelet engine is asked for an 11-sample wavelet on Ekene-1's short log, which message comes back?",
 '"The log covers 16 usable samples at the well; a 11-sample wavelet needs at least 22. Shorten the wavelet or use the statistical one."',
 ['"The well reflectivity is flat over the seismic at the well, so there is nothing to extract a wavelet from."',
  '"The wells overlap too little seismic to scale the wavelet."',
  "None: it returns an 11-sample wavelet for each stack, the 27 logged samples clearing the need."],
 "At a half length of 5 the engine gives the message in the key, in its own words. The flat-reflectivity message comes at a half length of 15, the overlap message is waveletScale's, and a wavelet per stack comes back at a half length of 3, 7 samples long.")

# CROSS m01 (the settings the tier states) + m04 (left-out wells and the widened band)
q(3, "Which stated frequency is both the high cut of the log an inversion is scored against and the low-pass calibrateProperty applies to each well's ln(AI) and porosity at seismic scale?",
 "50 Hz in both places.",
 ["8 Hz, the low-frequency cut of the LFM and the crossover sparse-spike takes its low frequencies through.",
  "60 Hz, the upper edge of the coloured band from 8 to 60 Hz.",
  "25 Hz, the frequency of the stated zero-phase Ricker wavelet."],
 "One figure does both jobs: inversions are scored on the log high-cut at 50 Hz, and calibrateProperty low-passes ln(AI) and porosity at 50 Hz before it fits. The LFM and the sparse-spike crossover sit at 8 Hz, the coloured band tops out at 60 Hz, and the Ricker is a 25 Hz wavelet.")

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

q(2, "With the iteration count held at 300, a heavier weight eps of 1.000000 is tried in the Ekene-1 blind run. What scores come back?",
 "0.219646 for the correlation, 33.801729 percent for the error, 1.320986 for the residual.",
 ["0.732457 for the correlation and 13.421322 percent for the error, the scores of eps 5.000000.",
  "0.091593 and 52.851805 percent, eps having no effect once 300 iterations run.",
  "0.583443 and 19.965981 percent, the 120-iteration row at eps 0.050000."],
 "Raising eps to 1.000000 lifts the correlation to 0.219646 and cuts the error to 33.801729 percent, the residual reading 1.320986. The pair 0.091593 and 52.851805 is the lighter weight, 0.732457 and 13.421322 the weight of 5.000000, and 0.583443 and 19.965981 come from 120 iterations.")

q(1, "On the 101-sample Ekene-1 trace, sparse-spike is run at lambda 1000.000000. How many reflectivity samples stay non-zero at 60 and at 400 iterations?",
 "67 at 60 iterations, falling to 44 at 400.",
 ["101 at both counts, as at QI Studio's starting lambda of 0.002000.",
  "36 at 60 and 27 at 400, the counts at lambda 5000.000000.",
  "96 and 61, the lambda 200.000000 counts."],
 "At lambda 1000.000000 the course prints 67 non-zero samples at 60 iterations and 44 at 400; more iterations sharpen the sparsity. 101 is the count at 0.002000, 96 and 61 belong to 200.000000, and 36 and 27 to 5000.000000.")

q(0, "Coloured inversion at Ekene-1 correlates 0.931237 with the log band-passed between 8 and 50 Hz. Why does the course score it by correlation alone?",
 "Its output is relative impedance, band-limited with no level, so there is no level to compare.",
 ["Its operator carries the LFM's level from the wells, and an RMS error would count that level twice over.",
  "Its wavelet scale of 769.984107 leaves every AI error in trace units.",
  "Its slope alpha of -1.012769 is fitted to the trace, fixing the error at zero."],
 "Coloured inversion uses no wavelet and no LFM: one operator with phase minus 90 degrees and slope alpha -1.012769 fitted to the wells' logs, so its output is relative impedance with no level, scored by correlation alone. The scale 769.984107 belongs to the wavelet the absolute inversions use.")

q(3, "sparseSpike solves for a sparse reflectivity r by FISTA. How does it reach an absolute ln(AI) from r?",
 "It integrates r to a relative ln(AI), m_(i+1) = m_(i-1) + 2 r_i, and takes the low frequencies from the LFM through a moving-average crossover at 8 Hz.",
 ["It integrates r once from the top sample, taking its level from the first logged AI at the well.",
  "It runs CGLS on r with eps 0.050000 towards the LFM, as modelBased does with m.",
  "It multiplies r by the wavelet scale of 769.984107, which carries the level of AI."],
 "sparseSpike integrates r into a relative ln(AI) by m_(i+1) = m_(i-1) + 2 r_i, levels each of the two interleaved chains to its mean, and takes the low frequencies from the LFM through an 8 Hz moving-average crossover. CGLS towards m0 is modelBased's solver, and the scale 769.984107 only joins wavelet and trace.")

# CROSS m02 (post-stack blind wells) + m03 (blind wells per parameter)
q(1, "At Ekene-4, blind, which three AI correlations do model-based post-stack, sparse-spike and simultaneous inversion from near, mid and far return, in that order?",
 "0.759365, 0.778867 and 0.780557.",
 ["0.852881, 0.873414 and 0.863789, the Ekene-1 figures.",
  "0.889320, 0.881157 and 0.854299, the Ekene-2 figures.",
  "0.847503, 0.821455 and 0.847660, the Ekene-3 figures."],
 "At Ekene-4 the blind AI correlations are 0.759365 for model-based, 0.778867 for sparse-spike and 0.780557 for the simultaneous inversion from all three stacks. The other options are the same three figures at Ekene-1, Ekene-2 and Ekene-3.")

q(2, "Over 20 realisations at Ekene-1, the 1304.000000 ms row reads Q10 5069751.189881, Q50 6629158.255936 and Q90 9889658.945117. What does relativeSpread return there, and which of the three is the low figure?",
 "0.727077, from (Q90 - Q10) / Q50, Q10 being the low end.",
 ["0.727077, with Q90 the low figure as for a volume.",
  "0.645787, the mean spread over the 27 logged samples, with Q10 as the low figure.",
  "0.498207, the spread one row up at 1288.000000 ms, again with Q10 as the low figure."],
 "relativeSpread divides Q90 - Q10 by Q50, giving 0.727077 at 1304.000000 ms. For a parameter Q10 is the 10th percentile and the low end; the convention with P90 low belongs to outcomes such as volumes. 0.645787 is the mean over 27 samples and 0.498207 the 1288.000000 ms row.")

# ---- m03 simultaneous inversion ----

q(0, "Fatti's linearisation writes R(theta) = G1 dln(AI) + G2 dln(SI) + G3 dln(rho), with K the background Vs/Vp. Which coefficient does K not enter?",
 "G1, written (1 + tan^2 theta) / 2.",
 ["G2, written -4 K^2 sin^2 theta, the shear term K scales.",
  "G3, written (4 K^2 sin^2 theta - tan^2 theta) / 2.",
  "None of the three: K enters each one through tan^2 theta."],
 "G1 = (1 + tan^2 theta) / 2 holds no K, while G2 = -4 K^2 sin^2 theta and G3 = (4 K^2 sin^2 theta - tan^2 theta) / 2 both carry K^2. On the pack K is 0.394396, the mean Vs / Vp over the logged samples in the window.")

q(3, "At Ekene-3, blind from the near, mid and far stacks, what does the simultaneous inversion score for density?",
 "A correlation of -0.719301 and an error of 16.816175 percent.",
 ["A correlation of 0.360220 and an error of 12.979404 percent, density following Vp/Vs at this well.",
  "A correlation of 0.847660 and an error of 10.653026 percent, density riding on the shape of AI.",
  "-0.413424 and 9.115991 percent, Ekene-4's figures."],
 "Ekene-3's density row reads -0.719301 and 16.816175 percent. 0.360220 and 12.979404 are its Vp/Vs figures, 0.847660 and 10.653026 its AI figures, and -0.413424 with 9.115991 is Ekene-4's density.")

# CROSS m02 (model-based blind) + m03 (what each set of stacks resolves)
q(1, "Post-stack model-based inversion at Ekene-1, blind, scores an AI error of 10.557858 percent. What AI error and correlation does the simultaneous inversion from near, mid and far return at the same well, blind?",
 "8.956955 percent, with an AI correlation of 0.863789.",
 ["10.557858 percent again, the simultaneous run reproducing the post-stack AI exactly.",
  "9.807415 percent with 0.858677, near stack only.",
  "8.638086 percent with -0.190352, the three LFMs' figures with no seismic."],
 "From near, mid and far the simultaneous inversion at Ekene-1 gives AI 0.863789 and 8.956955 percent. 9.807415 and 0.858677 come from the near stack alone, and -0.190352 with 8.638086 from the three LFMs with no seismic.")

q(2, "At the far stack's angle of 30 degrees and K 0.394396, what does Fatti's SI coefficient G2 print beside G1?",
 "G2 -0.155548 beside G1 0.666667.",
 ["G2 -0.072783 beside G1 0.566237, the 20 degree pair.",
  "G2 -0.257075 beside G1 0.852044, the 40 degree pair.",
  "G2 -0.088893 beside G1 0.666667, the density value read as shear."],
 "At 30 degrees the coefficients are G1 0.666667, G2 -0.155548 and G3 -0.088893. The pairs at 20 and 40 degrees are -0.072783 with 0.566237 and -0.257075 with 0.852044.")

q(0, "Ekene-1 is inverted with its own log left out of the LFMs, from two stacks only, near and mid. Which scores do Vp/Vs and density print?",
 "Vp/Vs 0.383124 with 13.660754 percent; density -0.707948 with 12.184029 percent.",
 ["Vp/Vs -0.744719 with 30.824755 percent; density 0.614032 with 0.627310 percent, the near-only row.",
  "Vp/Vs 0.470296 with 10.707173 percent; density -0.767957 with 14.112317 percent, all three stacks.",
  "Vp/Vs 0.048283 with 11.122749 percent; density -0.087754 with 0.767482 percent, the LFMs alone."],
 "With near and mid the course prints Vp/Vs 0.383124 and 13.660754 percent and density -0.707948 and 12.184029 percent. The other rows are the near stack alone, all three stacks and the LFMs with no seismic.")

# CROSS m03 (blind wells per parameter) + m04 (two attributes)
q(3, "The two-attribute facies model on AI and Vp/Vs scores a share correct of 0.973443 on its own samples at log scale. At which pack wells is the blind Vp/Vs correlation of the simultaneous inversion negative?",
 "Ekene-2 and Ekene-4, at -0.287516 and -0.132709.",
 ["Ekene-1 and Ekene-3, at 0.470296 and 0.360220, the wells nearest the oil leg.",
  "All four, from -0.767957 to -0.413424, the inversion running against the log.",
  "None: Vp/Vs follows the log at every well, as AI does from 0.780557 up."],
 "Blind, from near, mid and far, Vp/Vs correlates -0.287516 at Ekene-2 and -0.132709 at Ekene-4, and positively at Ekene-1 (0.470296) and Ekene-3 (0.360220). -0.767957 to -0.413424 is density's range, so a facies map on inverted Vp/Vs rests on a parameter the blind wells do not support.")

# ---- m04 properties from impedance ----

q(1, "At AI 6500000.000000, what porosity and 80 percent band does the log-scale transform return?",
 "0.215267, between 0.192157 and 0.238378.",
 ["0.203850, between 0.180764 and 0.226936, the figures at AI 7000000.000000.",
  "0.192433 between 0.169342 and 0.215525, read at AI 7500000.000000.",
  "0.215267 between 0.174207 and 0.233493, a band from the 90 percent level."],
 "At 6500000.000000 the transform predicts 0.215267 with Q10 0.192157 and Q90 0.238378 at the 80 percent level; the slope is negative, so softer rock reads more porous. 0.174207 to 0.233493 is the 90 percent interval at AI 7000000.")

q(3, "Refitted at seismic scale on each well's porosity inside its Ekene Sand times, what transform does calibrateProperty fit?",
 "Intercept 0.302982 and slope -0.017033 on 20 upscaled samples.",
 ["Intercept 0.363690 and slope -0.022834 on 644 samples, the log-scale fit carried up unchanged.",
  "Intercept 0.302982 and slope -0.017033 on 644 samples, the log samples kept at full count.",
  "s 0.007175 and RMS 0.024072, no line refitted."],
 "Fitted on the upscaled samples inside the sand times, the seismic-scale line has intercept 0.302982 and slope -0.017033 on n 20. The 644-sample line at log scale is a separate fit, and 0.007175 and 0.024072 are the two errors that travel beside the refitted line.")

q(2, "Left out of the seismic-scale porosity check, Ekene-2 is predicted from its blind inverted AI on 6 samples. What correlation and band coverage does it return?",
 "Correlation -0.794283, with 0.833333 of its samples inside the widened 80 percent band.",
 ["Correlation NaN, its predicted series showing no spread over the samples, with 1.000000 inside the band.",
  "Correlation -0.484704, with 0.600000 inside the band, as at Ekene-1.",
  "Correlation -0.734150 and 1.000000 inside, the Ekene-3 pair."],
 "Ekene-2 left out returns a correlation of -0.794283, an RMS error of 0.027716 and a share inside the widened band of 0.833333. The NaN belongs to Ekene-4, -0.484704 with 0.600000 to Ekene-1, and -0.734150 with 1.000000 to Ekene-3.")

q(0, "On AI alone at 6600000.000000, the sample-proportion priors make brine sand most likely at 0.557911. What do equal priors return at the same AI?",
 "Oil sand at 0.673039 and brine sand at 0.326961: the prior is a stated choice, and it moves the answer.",
 ["Brine sand still at 0.557911, a prior being unable to move a posterior where shale reads 0.000000.",
  "Shale at 0.796396, equal priors handing it the share its 2519 samples carry.",
  "Oil sand at 0.997373, the call the two-attribute model makes at Vp/Vs 1.750000."],
 "With equal priors at 6600000.000000 the posteriors are shale 0.000000, oil sand 0.673039 and brine sand 0.326961, so the call flips. 0.796396 is shale's sample-proportion prior, and 0.997373 needs Vp/Vs 1.750000 as a second attribute.")

q(1, "With Vp/Vs added to AI, how does the two-attribute confusion matrix call the 465 brine-sand samples?",
 "455 brine sand, 9 oil sand and 1 shale.",
 ["439 brine sand and 26 oil sand, the counts of the model on AI alone.",
  "455 brine sand and 10 oil sand, every miss going to the oil sand.",
  "160 brine sand and 19 oil sand, the oil-sand row read across."],
 "The two-attribute brine-sand row reads 1 shale, 9 oil sand and 455 brine sand, up from 439 on AI alone, where 26 went to oil sand. 160 and 19 are the two-attribute oil-sand row.")

q(3, "How does QI Studio label a facies class named for a fluid, such as oil sand or brine sand?",
 "fluid_hypothesis, and every other class calibrated_prediction.",
 ["calibrated_prediction, like every class.",
  "fluid_measurement, for a class scoring above 0.934872.",
  "oil_sand or brine_sand, the fluid read straight from the class name and carried through to every map."],
 "The pore fluid behind a fluid-named class is an interpretation, so its label is fluid_hypothesis; shale carries calibrated_prediction. No engine reads a fluid from a class name, whatever share correct, 0.934872 or 0.973443, the model scores.")

# CROSS m02 (blind wells) + m04 (left-out wells and the widened band)
q(2, "calibrateProperty leaves each well out, refits the porosity transform on the others, and predicts that well's porosity. From which AI does it predict?",
 "The blind inverted AI at that well, from the inversion with the well left out of its LFM.",
 ["The LFM alone at that well, whose AI error at Ekene-1 left out is 8.638086 percent.",
  "The well's own log AI after the 50 Hz high cut, so the residuals match s of 0.007175.",
  "Coloured inversion's relative impedance, the one product built with no LFM between wells, so no level leaks in."],
 "The check predicts each left-out well from the AI the blind inversion returns there, its LFM built from the other wells; that is why the pooled left-out RMS, 0.024072, exceeds the log-against-log s of 0.007175. Coloured inversion has no level to feed a transform.")

# ---- m05 prospects ----

q(0, "The closure engine reads the Ekene Sand top grid of 25 by 20 nodes every 328.083990 ft. In what units does it read elevation and spacing?",
 "In one unit for both, which the course runs in feet, with z minus the depth below the kelly bushing.",
 ["Elevation in feet and spacing in metres, the kit's projection unit, converted inside the engine.",
  "Both in metres, the unit the kit writes, the course converting only the printed column.",
  "Elevation as two-way time in milliseconds, the spacing in feet."],
 "The engine reads elevation and spacing in one unit, and the course runs it in feet; z is minus the depth below the kelly bushing, so the crest reads -5051.568570 ft and the wells' contact -5118.110236 ft.")

q(1, "Designed teaching anomaly A, every mapped node shallower than the spill, has an edge scatter of 0.643935 ft. What conformance and implied contact does anomalyConformance return?",
 "Conformance 0.729467, implied contact -5053.959008 ft.",
 ["Conformance 1.000000, its share inside the closure, with the contact sitting exactly at the spill of -5053.948819 ft.",
  "Conformance 0.000000, at -5068.442175 ft.",
  "Conformance 0.643935, the scatter read directly."],
 "Conformance is 1 - scatter / relief, and for A it is 0.729467 with an implied contact of -5053.959008 ft, just below the spill at -5053.948819 ft. 1.000000 is A's share inside the closure, and 0.000000 with -5068.442175 ft is anomaly B.")

q(3, "Designed teaching anomaly B keeps every node shallower than a level 20 ft below the spill, west of the grid's middle column only. What node counts and share inside the closure does the engine return?",
 "72 nodes, 22 of them edge nodes, with 0.152778 inside the closure.",
 ["11 nodes, 9 of them edge nodes, wholly inside at 1.000000, the counts of anomaly A.",
  "201 nodes, every mapped node of the grid, with 0.152778 inside.",
  "72 nodes, every one on the edge, the straight cut adding edge all along, 1.000000 inside."],
 "B holds 72 nodes with 22 edge nodes, and 0.152778 of it lies inside the closure; its conformance clips to 0.000000. 11 nodes with 9 edge nodes is anomaly A, wholly inside, and 201 is the count of mapped nodes on the grid.")

q(2, "No anomaly is seen on a prospect. Which stated input decides between downgrade and retain?",
 "The feasibility verdict: downgrade with against where it is feasible, retain with neutral where it is not stated.",
 ["The count of independent sources: downgrade with one, retain with two.",
  "The conformance: downgrade under 0.3, retain at 0.7 and above.",
  "A competing explanation: downgrade where it is ruled out, retain where it is open."],
 "Feasibility decides what absence means. With the case visible, a missing anomaly downgrades the prospect and the support reads against; with feasibility unstated the prospect is retained and the support is neutral. Source counts and the 0.3 and 0.7 thresholds act on an anomaly that is present.")

q(0, "Which two cases in the assessment's decision table return a seismic support of neutral?",
 "No anomaly with feasibility not stated, and an anomaly present with a competing explanation judged likely.",
 ["No anomaly on feasible data, and an anomaly with one independent source.",
  "An anomaly with conformance 0.83, and one with 0.9 inside the closure.",
  "Every case recommending investigate, the word neutral following the recommendation."],
 "neutral comes from the retain row (no anomaly, feasibility not stated) and the competing-explanation row. No anomaly on feasible data reads against, and one independent source returns investigate with supports, so support and recommendation move apart.")

q(1, "spillAnalysis floods outward from the crest, and climbToCrest climbs from a picked point. How many neighbours does each consider at a node?",
 "Four for the flood, which uses four-neighbour connectivity, and eight for the climb.",
 ["Eight for both, so a diagonal saddle counts for the spill as it does for the crest.",
  "Four for both, the climb stepping only along rows and columns.",
  "Eight for the flood and four for the climb, the flood needing diagonals to reach the edge."],
 "The flood that finds the spill uses four-neighbour connectivity; the climb steps to the highest of its eight neighbours. On the Ekene grid the climb from column 12, row 9 reaches node 310 at -5051.568570 ft.")

# CROSS m04 (the confusion matrix) + m05 (competing explanations and the assessment)
q(3, "An interpreter judges likely the competing explanation that a soft impedance anomaly is brine sand, citing the AI-only confusion matrix where 127 of the 179 oil-sand samples are called brine sand. The anomaly is present, every other input as in the decision table's first row (conformance 0.83, two independent sources, feasible). What does the assessment return?",
 "investigate, the likely rival holding the seismic support at neutral.",
 ["mature, supports, the anomaly being present with two independent sources behind it.",
  "downgrade, against, the rival explanation counting as the absence of an anomaly.",
  "retain, neutral, the row for no anomaly with feasibility unstated."],
 "A competing explanation judged likely holds the prospect at investigate with neutral support, the table's last row. On AI alone 127 of the 179 oil-sand samples are called brine sand, which is why brine sand is a real rival; downgrade and retain are the two rows with no anomaly.")

# CROSS m02 (post-stack impedance) + m05 (independent evidence and the assessment)
q(2, "Only two attributes back a soft anomaly: the RMS amplitude of the full stack, and AI inverted from that same full stack. What does the evidence count make of them, and what would maturing need?",
 "One, the shared source full_stack; maturing needs two independent supporting sources.",
 ["Two, the inversion adding the LFM's information from the wells to the full stack, which is enough to mature.",
  "Two, one per attribute, though maturing needs three.",
  "None, an impedance being no supporting item, so the prospect is downgraded."],
 "Two attributes drawn from one seismic response count once, under the source full_stack. Maturing takes two independent supporting sources, which the course's worked case gets from a far-stack brightening, a second response.")

# ---- m06 the report and the limits ----

q(1, "QI never sets a prospect's geological chance of success. Who weighs what a QI study reports, and what does it report?",
 "The risk team weighs it; QI reports what the seismic says, supports, neutral or against, with a recommendation.",
 ["The interpreter alone, who turns the oil-sand posterior of 0.997373 at Vp/Vs 1.750000 into the chance.",
  "The closure engine, which weighs the gross rock volume of 1519731.367693 ft3 at the spill.",
  "The assessment engine, which reports a probability of success beside its recommendation."],
 "QI reports the seismic support for the risk team to weigh, and prospectAssessment.js returns a recommendation and a seismic support with no probability of success. A posterior such as 0.997373 is a probability under the facies model, and closure returns rock volume only.")

q(0, "Which of these does no engine in the Expert tier compute?",
 "A picked horizon.",
 ["The blind-well score, the correlation and RMS error at a left-out well.",
  "The quantiles across realisations, Q10, Q50 and Q90 per sample.",
  "The gross rock volume at the spill of a stated grid."],
 "The engines pick no horizon. lfm.js computes the blind-well score, inversionSpread.js the quantiles across realisations, and closure the gross rock volume, 1519731.367693 ft3 at the Ekene spill.")

q(3, "The Expert capstone asks for six figures read from the inversion and prospect explorers. On what data does it run?",
 "A held-out synthetic case supplied as a case file; the Ekene field is never used.",
 ["The Ekene pack, read at Ekene-1 on the tier's settings.",
  "The Ekene pack with fresh noise seeds, so its figures differ from those of the 20 seeds 101 to 120.",
  "A case built from the members-only videos."],
 "The capstone runs on a held-out synthetic case the learner pastes into the panels. The Ekene field is never used because the members-only videos speak the Ekene answers aloud, and no Ekene figure is graded, the 20 seeds 101 to 120 included.")

q(2, "Beyond the products themselves, what goes into the handover record of a QI study?",
 "The method, the stated settings, the blind-well figures per parameter, the calibration and its left-out check, the prospect figures with their limits, and every issue raised.",
 ["The products alone, each volume carrying its own settings, its 8 Hz LFM cut and its 50 Hz high cut in its header.",
  "The inverted volumes and the recommendation, the settings left at QI Studio's starting values such as eps 0.050000.",
  "The method and the geological chance of success, the two figures a risk team reads first."],
 "The handover files are the products together with the record of how each was made; a product without it cannot be checked. An 8 Hz cut or an eps of 0.050000 is a setting that record names, and the chance of success stays with the risk team.")

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
 "The engines compute no volume in barrels, so 1519731.367693 ft3 stays a rock volume. At the wells' contact of -5118.110236 ft the closure is reported open, and closure returns gross rock volume only.")

emit(Q, '/root/qi-wip-qi/banks/qia_exam.json', expect_n=42)
finish()
