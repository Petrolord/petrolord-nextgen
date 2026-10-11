import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# QI Expert m06, The report and the limits.
# Sources: what the QI report states and why, the figures that travel with
# each product, what QI never sets, what the engines do not compute, and the
# capstone brief in words (no case figure).

q(1, "What does a QI study never set?",
 "The geological chance of success, which the risk team weighs.",
 ["The seismic support word, which the risk team writes from the maps.",
  "The recommendation, which the risk team derives from the chance it sets.",
  "The porosity band, which the risk team widens from its own priors."],
 "QI reports what the seismic says, supports, neutral or against, for the risk team to weigh; the geological chance of success is never set by QI. The support word and the recommendation are QI's own outputs, and the band is widened by the left-out RMS of 0.024072.")

q(3, "What does prospectAssessment.js return for a prospect?",
 "A recommendation and a seismic support, and no probability of success.",
 ["A recommendation, a seismic support and a probability of success from 0 to 1.",
  "A probability of success alone, set from conformance and the source count.",
  "A seismic support alone, the recommendation being left to the risk team."],
 "prospectAssessment.js returns a recommendation (mature, investigate, retain or downgrade) and a seismic support (supports, neutral or against) and no probability of success. The chance stays with the risk team.")

q(0, "Why does the QI report state the settings of every product beside its figures?",
 "A result without its settings cannot be checked.",
 ["The engines read their settings from the report file when a reviewer runs them again on the same pack.",
  "The settings fix the geological chance of success, which the risk team reads straight from the report.",
  "The engines pick their own settings on each run, so the report records which values each run happened to pick."],
 "The handover files are the products and that record of method, settings, blind figures, calibration, prospect limits and issues; a result without its settings cannot be checked. Every setting is a stated input, and no engine reads a file or sets a chance.")

q(2, "Which list matches the settings the QI report states for every product?",
 "Window, wavelet and its scale, LFM cut, weights, iterations and seeds.",
 ["Window, wavelet, weights and the geological chance of success.",
  "Iterations and seeds only, as the engines hold the window and the wavelet within them.",
  "The recommendation and the support word, and nothing more."],
 "The report states the method, the stated settings (window, wavelet and its scale, LFM cut, weights, iterations, seeds), the blind-well figures per parameter, the calibration and its left-out check, the prospect figures with their limits and every issue raised. QI never sets the chance, and no wavelet is estimated inside an inversion.")

q(1, "A model-based inversion on the Ekene pack used a zero-phase Ricker of 25 Hz, half length 40 ms. Where did that wavelet come from?",
 "It is a stated input: no wavelet is estimated inside an inversion.",
 ["modelBased estimated it from the trace in its 60 iterations.",
  "The low-frequency model supplied it through its 8 Hz cut.",
  "simultaneousInversion estimated it inside its solve."],
 "No wavelet is estimated inside an inversion; it is an input, on Ekene a zero-phase Ricker of 25 Hz, half length 40 ms, scaled at the wells. The LFM is a separate input with its 8 Hz cut.")

q(3, "Where does the low-frequency model m0 of modelBased and simultaneousInversion come from?",
 "It is an input built beforehand; neither function builds an LFM.",
 ["modelBased builds it from the wells, low-passed at 8 Hz.",
  "simultaneousInversion builds one per parameter.",
  "Both read it from the seismic below 8 Hz."],
 "No LFM is built inside modelBased or simultaneousInversion: m0 is an input, on Ekene built beforehand with an 8 Hz cut. The seismic band holds no trend below about 8 Hz, which is why the LFM comes from the wells.")

q(0, "spillAnalysis runs on the Ekene Sand top grid of 25 by 20 nodes every 328.083990 ft. Where does that grid come from?",
 "A stated input, the kit's own grid of the six development wells' tops; closure grids nothing.",
 ["closure.js grids it from the four pack wells' tops by inverse distance with a power of 2, the LFM's rule.",
  "QI Studio picks the horizon on the full stack and closure.js grids the picks it is handed into nodes.",
  "The low-frequency model, whose horizons the closure engine reads back as the top grid."],
 "Closure reads a stated grid: the kit grids the Ekene Sand top from the six development wells' tops, 25 by 20 nodes, 201 mapped. The engines grid no surface and pick no horizon; inverse distance with power 2 belongs to the LFM between wells.")

q(2, "A facies map calls a region oil sand. What may a report infer about its fluid from the class name?",
 "Nothing: no fluid is inferred from a class name, and oil sand is a fluid hypothesis.",
 ["Oil, since a class named for a fluid is a calibrated prediction measured at the wells.",
  "Oil at the share correct, 0.973443, read as the probability that each point holds oil.",
  "Oil, once the two-attribute posterior passes 0.997373 at the point being mapped."],
 "The engines infer no fluid from a class name. QI Studio labels a class named for a fluid fluid_hypothesis and every other class calibrated_prediction; 0.973443 is a share correct on the model's own samples, and 0.997373 a posterior under stated priors.")

q(1, "A porosity map from inverted AI (acoustic impedance) travels with which errors from the Ekene seismic-scale check?",
 "s 0.007175 log against log, and the pooled left-out RMS 0.024072 that widened the band.",
 ["s 0.017980 from the 644 log samples, the only scatter the band needs at seismic scale.",
  "The widening 0.022977 alone, since the log-against-log error is already carried inside it.",
  "s 0.007175 alone, since the left-out RMS describes the inversion and leaves the map."],
 "At seismic scale s is 0.007175 log against log and the pooled left-out RMS is 0.024072, giving s_extra 0.022977. The report states the calibration and its left-out check; 0.017980 belongs to the log-scale fit.")

q(3, "An AI volume from post-stack inversion travels with its blind-well figures. What blind correlations do the Ekene wells return?",
 "From 0.759365 to 0.889320 across model-based and sparse-spike.",
 ["From -0.345505 to -0.190352, the low-frequency model's own correlations.",
  "From 0.758561 to 0.889063, the wells kept in their own LFM.",
  "From 0.796895 to 0.931237, coloured inversion against the band-passed log."],
 "The inversions follow the shape, with blind correlations from 0.759365 to 0.889320 across both methods. The LFM alone correlates negatively at every well, and the kept-in and coloured figures are other checks.")

q(0, "The Ekene Sand top grid spills at the map edge, 2.380249 ft below the crest. How does that column enter the report?",
 "As the map's limit, with the edge flag beside it.",
 ["As the oil column of the trap.",
  "As the closure measured on the trap.",
  "Left out, as a refusal of the engine."],
 "The report states the prospect figures with their limits. The spill is limited by the map edge, so the 2.380249 ft column is the map's limit and no measurement of the trap; the engine still returns it with the flag.")

q(2, "Why is the Ekene field never used as the Expert capstone case?",
 "The members-only videos speak the Ekene answers aloud.",
 ["The pack's logs are too short to invert.",
  "The Ekene grid spills at its edge, so the column could not be returned on it.",
  "Its figures change with each engine run."],
 "The capstone cases are never the Ekene field: the members-only videos speak the Ekene answers aloud, so a graded figure on Ekene could be answered by watching a video. The engines read no random number of their own.")

q(1, "Which of these is one of the six figures the Expert capstone grades?",
 "The column from crest to spill on the case's depth grid, in feet.",
 ["The recommendation the assessment returns for the case's prospect.",
  "The facies class name most likely at a stated AI of the case.",
  "The geological chance of success the case's figures imply."],
 "The capstone grades six engine figures, the last the column from crest to spill on the case's depth grid, in feet. Any verdict, class name or category is never graded, and QI never sets the chance.")

q(0, "The capstone asks for the model-based AI at a stated sample, with the case's supplied low-frequency model, wavelet, weight and iteration count. What does the learner build for the inversion?",
 "Nothing: each of those is in the case file, as m0 and the wavelet are inputs to modelBased.",
 ["The wavelet, extracted inside modelBased from the case's target trace.",
  "The LFM, built inside modelBased from the case's wells by inverse distance.",
  "The iteration count, chosen to give the smallest residual on the trace."],
 "Every input the six figures depend on is stated in the case file, and modelBased builds no LFM and estimates no wavelet. A smaller residual is no better inversion, and the count is the case's.")

q(3, "The net sand cut-off on the Ekene pack is 0.350000. Where do the engines get it?",
 "From the caller: the engines hold no Ekene figure, and the cut-off is a stated input.",
 ["From the kit's VSH log, which the engines read from the pack's files.",
  "From a value the engines carry within them for every field that the caller does not name.",
  "From the facies model, which sets the cut-off at the boundary where its shale prior falls."],
 "The engines hold no Ekene figure: every cut-off, window, angle and contact is an input the caller states, and no engine reads a file. The 0.350000 cut-off is a selection the course states before any function is called.")

emit(Q, '/root/qi-wip-qi/banks/qia_m06.json', expect_n=15)
finish()
