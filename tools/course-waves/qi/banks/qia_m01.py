import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# QI Expert m01, The forward model.
# Sources: the tier's stated settings and the wells in time, the convolutional
# model in ln(AI) and its adjoint test, the synthetic at Ekene-1, the
# low-frequency model from wells and horizons, and the wavelet scale.

q(0, "The tier scores every inversion against the well's log after a high cut. What high cut does the course state for that log?",
 "50 Hz.",
 ["8 Hz, the stated low-frequency cut that the low-frequency model is smoothed to before it is carried between wells.",
  "60 Hz, the upper edge of the stated coloured band that the coloured operator acts inside.",
  "25 Hz, the peak frequency of the stated zero-phase Ricker used by the forward model."],
 "The stated settings print a high cut of 50 Hz for the log a result is scored against. 8 Hz is the LFM cut, 60 Hz the top of the coloured band of 8 to 60 Hz, and 25 Hz the Ricker.")

q(1, "The inversion window on the well traces runs from 1100 to 1500 ms, 101 samples every 4.000000 ms. How many of those samples carry a log at Ekene-4?",
 "26, from 1284.000000 to 1384.000000 ms.",
 ["101, because each well's logs go to two-way time on its checkshots and fill the whole stated window.",
  "27, as at every pack well.",
  "21, the Ricker's samples."],
 "The pack's logs cover the Ekene Sand and the shale above it, so only part of the window carries a log: 26 samples at Ekene-4 and 27 at the other three wells. 21 is the wavelet's sample count.")

q(2, "In the engine's forwardPoststack, what is the unknown, and how does it reach the seismic trace?",
 "m = ln(AI) on the trace clock, through d = C D m: a centred difference, then a centred convolution.",
 ["AI itself, convolved with the wavelet as d = C m with no difference step.",
  "A sparse reflectivity r, integrated to ln(AI) after the trace is matched.",
  "Vp alone, with density held at the cap rock's mean."],
 "The unknown is m = ln(AI); D is the centred first difference and C the centred convolution, so d = C D m. Half the difference of ln(AI) is close to the reflection coefficient for small contrasts, which is why the model is written in ln(AI). A sparse reflectivity belongs to the sparse-spike solver.")

q(3, "How does the forward model define D, its difference step, at a sample i and at the two ends of the trace?",
 "(m_(i+1) - m_(i-1)) / 2, zero at the first and last sample.",
 ["(m_(i+1) - m_i) / (m_(i+1) + m_i), the exact normal-incidence reflection coefficient at each sample.",
  "(m_(i+1) - m_i), held at the ends.",
  "(m_(i+1) - m_(i-1)) / 2, ends from the LFM."],
 "D is the centred first difference, (D m)_i = (m_(i+1) - m_(i-1)) / 2, zero at the first and last sample. The one-sided step is the form the blocky term penalises, and nothing in D reads the LFM.")

q(1, "The inversion explorer runs the dot-product test on two seeded vectors of 101 samples, mulberry32 seed 42. What does it print for the centred convolution C with the scaled wavelet?",
 "38.991017 both ways, a difference of 0.000000: the adjoint passes.",
 ["-0.753789 both ways, with no difference.",
  "38.991017 one way and -0.753789 the other, so the transpose is wrong and the solver solves a different problem.",
  "A correlation of 0.966050 between the two products."],
 "For any x and y, (C x) . y equals x . (C^T y) when the adjoint is right; for C the test prints 38.991017 both ways and a difference of 0.000000. -0.753789 is the pair for the centred difference D, and 0.966050 is the tie at Ekene-1.")

q(0, "At Ekene-1 the ln(AI) log, through the scaled wavelet, is set against the full-stack trace at the well. How closely do they agree over the logged samples?",
 "They correlate at 0.966050 over 27 samples.",
 ["They correlate at 0.852881 over 27 samples, the agreement the forward model reaches once the solver has run its 60 iterations at the well.",
  "At 0.966050 over all 101 samples.",
  "At 0.931237 over 27 samples."],
 "Over the logged samples the synthetic and the trace correlate at 0.966050 on 27 samples. The log is held at its first and last values beyond them only so the convolution has an input; the score counts the logged samples alone.")

q(3, "In the Ekene-1 table round the top of the Ekene Sand, what do the synthetic and the full-stack trace print at 1296.000000 ms?",
 "Synthetic 137.874591, trace 258.968262.",
 ["Synthetic 344.213395, trace 341.516846, the closest pair in the table.",
  "Synthetic -267.168500, trace -268.438965, a trough that the trace reproduces.",
  "Synthetic 13.435099, trace -8.919362."],
 "At 1296.000000 ms the synthetic is 137.874591 and the trace 258.968262, so the trace is larger there. The close pair 344.213395 and 341.516846 is at 1288.000000 ms, where the trace peaks under SEG normal polarity, -267.168500 against -268.438965 is at 1304.000000 ms, and 13.435099 against -8.919362 is the row at 1280.000000 ms.")

q(2, "Why does every absolute inversion in this tier need a low-frequency model?",
 "The band-limited trace says how impedance changes and nothing of its level; the wells supply what lies below about 8 Hz.",
 ["The LFM supplies the frequencies above the 25 Hz Ricker that the trace cannot carry.",
  "The scale of 769.984107 is read off the LFM, so without one the wavelet keeps its unit peak.",
  "The adjoint test of 38.991017 is computed on the LFM before any trace is used."],
 "The seismic band holds no trend: a band-limited trace says how impedance changes and says nothing of its level, and the LFM supplies what the seismic lacks below about 8 Hz, from the wells. The scale is set at the wells by least squares, and the adjoint test runs on seeded vectors.")

q(1, "lfm.js low-passes each well's ln(AI) by a moving average whose half window is round(1000 / (cut x dt) / 2) samples. With the stated cut and the 4.000000 ms clock, what half window does it use?",
 "16 samples.",
 ["8 samples, one for each hertz of the stated cut, so the half window follows the cut directly.",
  "27 samples, the whole logged length at Ekene-1, so that each well is smoothed to one value.",
  "21 samples, the length of the stated Ricker, so the smoothing matches the wavelet's span."],
 "At a cut of 8 Hz on the 4.000000 ms clock the half window is 16 samples (lowFrequencyModel). 27 is the logged count at Ekene-1 and 21 the Ricker's samples.")

q(3, "With Ekene-1 left out, the LFM at Ekene-1 is carried from the other three wells by inverse distance weighting with power 2. What share does Ekene-4 take?",
 "0.145161, at 2193.171220 m.",
 ["0.477419, the largest share, because Ekene-4 is the farthest well and inverse distance weighting favours the most distant control point.",
  "0.377419, as Ekene-3.",
  "0.145161 to Ekene-2 at 1209.338662 m, since the nearest well is the one an inverse square discounts most."],
 "Each weight is the inverse square of the distance, and a share is a weight over the sum of the three: Ekene-2 at 1209.338662 m takes 0.477419, Ekene-3 at 1360.147051 m takes 0.377419, and Ekene-4 at 2193.171220 m takes 0.145161, the smallest.")

q(0, "lfm.js maps the Ekene-1 trace's times onto Ekene-2's horizons, the top and base of the Ekene Sand. Where does the Ekene-1 time 1299.913186 ms land?",
 "At 1318.075904 ms, the same proportional position in Ekene-2's sand.",
 ["At 1305.746335 ms, Ekene-2's top Ekene Sand horizon.",
  "At 1330.405474 ms, Ekene-2's base Ekene Sand horizon.",
  "At 1338.405474 ms, keeping its offset from the base horizon."],
 "Between two horizons a sample keeps its proportional position (mapToWellTime), so 1299.913186 ms at Ekene-1 lands at 1318.075904 ms at Ekene-2. 1305.746335 and 1330.405474 are Ekene-2's horizons, and the offset rule applies only above the first horizon and below the last.")

q(2, "The RMS AI error of the LFM alone is printed with each well left out of its own LFM and kept in. What happens at Ekene-2 when the well is kept in?",
 "Its error rises, from 10.450743 to 11.272271 percent.",
 ["Its error falls, from 11.272271 to 10.450743 percent, as it does at every pack well when the well's own log joins its LFM.",
  "It is unchanged at 10.450743 percent.",
  "It falls to 7.817522 percent."],
 "Left out, Ekene-2's LFM-only error is 10.450743 percent; kept in it is 11.272271. At Ekene-1, Ekene-3 and Ekene-4 keeping the well lowers its error, and 7.817522 percent is Ekene-3 kept in, so a well inside its own LFM is no guarantee of a closer match.")

q(3, "The 25 Hz Ricker, peak amplitude 1.000000, is scaled against the full stack at the four pack wells. What scale does the engine return, and on how many samples?",
 "769.984107, over 19 samples.",
 ["769.984107 per well, fitted separately at each of the four wells and then averaged into the one field figure.",
  "1.000000, the unit peak.",
  "769.984107, over 101 samples, the whole inversion window at every one of the four wells pooled."],
 "waveletScale finds the one number s that makes s times the forward model of the logs match the seismic best, pooled over every well sample whose wavelet span the log covers: 769.984107 over 19 samples. The unit Ricker's peak of 1.000000 becomes a scaled peak of 769.984107.")

q(0, "A case's wells overlap fewer than ten usable samples of seismic. What does the wavelet scale engine do?",
 "It refuses, in the engine's own words: \"The wells overlap too little seismic to scale the wavelet.\"",
 ["It returns a scale of 1.000000, the stated wavelet's unit peak.",
  "It returns a NaN scale, a result with no refusal.",
  "It refuses with \"A spectrum needs at least 8 samples.\""],
 "The engine refuses to scale when the wells overlap fewer than ten usable samples of seismic: \"The wells overlap too little seismic to scale the wavelet.\" The Ekene pack clears that rule with 19 samples. The spectrum message belongs to amplitudeSpectrum.")

q(1, "The LFM is built from wells whose logs cover only part of the window. What value does lfm.js give a sample that no well covers?",
 "The nearest covered value.",
 ["A refusal naming the sample, since the engine declines to build a model where no well carries a log in the window.",
  "Zero in ln(AI).",
  "A value extrapolated along the trend of the last logged samples, continued to the edge of the window."],
 "Samples no well covers hold the nearest covered value, so across most of the 101-sample window the level is a held value from 27 or 26 logged samples. That rule silently decides the LFM away from the logs, so a study states the wells and the horizons it used.")

emit(Q, '/root/qi-wip-qi/banks/qia_m01.json', expect_n=15)
finish()
