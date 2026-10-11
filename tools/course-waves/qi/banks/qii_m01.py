import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# QI Professional m01, From feasibility to the tie.
# Sources: what the Professional tier adds and its bookkeeping, the synthetic
# recap and its gaps, the statistical and well wavelets and the well wavelet's
# refusal on the pack, and the phase match with its designed case.

q(1, "Around the engines the course keeps three pieces of bookkeeping of its own. How does it time an event on a trace?",
 "As the sample of the largest amplitude within 8 ms of a stated time.",
 ["As the zero crossing nearest the stated time, searched over the 20 ms the bulk shift uses for its lags.",
  "As a time between samples, from a parabola fitted through the three largest samples near the stated time.",
  "As the first sample within 8 ms whose amplitude passes half of the trace's own largest amplitude."],
 "The lab times an event as the sample of the largest amplitude within 8 ms of a stated time, so a pick always lands on the trace clock. It interpolates nothing between samples, and the 20 ms search belongs to the bulk shift.")

q(3, "In this tier, what scale do the seismic amplitudes of the pack's traces carry?",
 "None: they are the kit's own trace units, tied to a reflection coefficient only by a scale.",
 ["Reflection coefficients directly, because the kit's seismic is SEG normal polarity and its top is a positive peak.",
  "Acoustic impedance in kg/(m2 s), the SI unit the engines work in for every velocity and density they are given.",
  "Decibels relative to the largest amplitude on each trace, so every trace peaks at exactly 0 and reads below it."],
 "Seismic amplitudes stay in the kit's trace units, which carry no physical scale, so a reflection coefficient and an amplitude meet only through a scale the last module measures. SEG normal polarity fixes the sign of a peak and says nothing about its size.")

q(0, "In what unit does synthetics.js compute the impedance it turns into reflection coefficients?",
 "In (m/s)(g/cc), the AI / 1000 form, so the Ekene-1 oil-leg mean reads 6639.018603.",
 ["In kg/(m2 s), where the Ekene-1 oil-leg mean reads 6639018.603084.",
  "In units of 10^6 kg/(m2 s), where the same mean reads 6.639019.",
  "In m/s alone, since the density log enters only the cap rock."],
 "The engine's convention is impedance in (m/s)(g/cc), which is AI in kg/(m2 s) divided by 1000: 6639.018603 for the Ekene-1 oil-leg mean. The kg/(m2 s) and 10^6 forms print the same quantity in units the synthetic engine does not use.")

q(2, "A log sample is a LAS null. What does the synthetic engine do with it?",
 "It treats the sample as a gap: the convolution zero-fills it, and a convolved value whose own coefficient is a gap is not used.",
 ["It interpolates the impedance linearly across the null from the live samples above and below, so the synthetic runs unbroken.",
  "It refuses the whole log, since a convolution needs a finite reflection coefficient at every sample it is given and a LAS null has none.",
  "It keeps the convolved value at that sample, since the zero fill has made the coefficient there a finite number."],
 "A sample that is not finite or is a seismic or LAS null is a gap; the convolution zero-fills it and discards the convolved value at the gap itself. So the Ekene-1 synthetic is live on 26 samples only, where the logs are, and nothing is interpolated or refused.")

q(2, "On Ekene-1's full-stack trace clock of 4.000000 ms, how many live synthetic samples do the pack's logs give?",
 "26, because the logs span only 4931.500000 to 5331.000000 ft.",
 ["31, one for every sample of the statistical wavelet the synthetic is convolved with on the same clock.",
  "800, one for every log sample, since the log step of 0.500000 ft is finer than the seismic clock.",
  "12, the number of CDP gathers next to Ekene-1, since each gather supplies one live synthetic sample."],
 "The pack's logs cover the Ekene Sand and the shale above it, 4931.500000 to 5331.000000 ft, which resamples to 26 live samples on the 4.000000 ms clock. The 800 log samples collapse onto that clock, and the 31 samples belong to the wavelet.")

q(0, "What is the largest reflection coefficient in the live span of the Ekene-1 synthetic, and where is it?",
 "-0.190340, at 1312.000000 ms.",
 ["-0.190340 at 1311.086000 ms",
  "-0.190340 at 1288.796378 ms",
  "-0.105222 at 1312.000000 ms"],
 "The largest coefficient is -0.190340 at 1312.000000 ms. Under SEG normal polarity an increase in impedance is positive, so this negative one is a fall in impedance, below the top of the sand at 1288.796378 ms; 1311.086000 ms is a checkshot time and -0.105222 a correlation from the designed phase case.")

q(3, "estimatePhaseRotation is run on the Ekene-1 synthetic against its full-stack trace. What does it report?",
 "A best phase of -6.135261 degrees, the correlation rising from 0.983438 to 0.989111.",
 ["A best phase of -36.092689 degrees, the correlation rising from 0.799189 to 0.989219.",
  "A best phase of -96.113046 degrees, the correlation rising to 0.988309.",
  "A best phase of -6.135261 degrees, the correlation held at 0.983438 unchanged."],
 "At Ekene-1 the best phase is -6.135261 degrees and the correlation goes from 0.983438 before rotation to 0.989111 after, a small gain. The -36.092689 and -96.113046 rows are the designed case with 30 and 90 degrees added first.")

q(1, "Of the two wavelets the seismic can give at a well, which one has a MEASURED phase?",
 "The least-squares (Wiener) wavelet that best convolves the well's reflectivity into the trace at the well.",
 ["The statistical wavelet, because the autocorrelation of the traces keeps the phase of the source wavelet intact.",
  "The 25 Hz Ricker on the same clock, because its phase is set by its formula and so needs no assumption.",
  "Neither: both are taken to zero phase, and a phase is only ever measured later by the bulk shift search."],
 "The wavelet from the well is the Wiener wavelet fitted to carry the well's reflectivity into the trace, so its phase is measured. The statistical wavelet comes from the autocorrelation's amplitude spectrum taken to zero phase, so its phase is assumed zero.")

q(3, "What stated inputs does extractStatisticalWavelet read in the course's ties, and what does it do to the lags?",
 "A 120 ms window and 5 Hz smoothing; it Hann-tapers the lags and normalises the peak to 1.",
 ["A 20 ms window and 8 Hz smoothing, the bulk shift's search and the pick's reach; it tapers nothing.",
  "A 120 ms window and no smoothing, with the lags left untapered.",
  "A 1100 to 1500 ms window with 5 Hz smoothing; it scales the wavelet to unit energy in place of a peak."],
 "The engine reads a window length of 120 ms and a smoothing of 5 Hz, Hann-tapers the lags and normalises the peak to 1. The 1100 to 1500 ms span is the trace window, a separate choice, and unit energy is the wavelet comparison's scaling.")

q(1, "On the pack's logs, at what half length does the wavelet from the well at Ekene-1 come back as a wavelet, with damping 0.001?",
 "At 3 samples: a 7-sample wavelet from 20 samples, fit correlation 0.946989.",
 ["At 15 samples, its default: a 31-sample wavelet from the 26 live samples of the synthetic, with a measured phase.",
  "At 5 samples: an 11-sample wavelet from the 16 usable samples the log covers at the well, the engine's own count.",
  "At none of them: the well reflectivity is flat at every half length, so only the statistical wavelet ever comes back."],
 "At the default half length of 15 the engine says \"The well reflectivity is flat over the seismic at the well, so there is nothing to extract a wavelet from.\" At 5 it counts 16 usable samples against the 22 an 11-sample wavelet needs and refuses; at 3 it returns a 7-sample wavelet from 20 samples, fit correlation 0.946989.")

q(0, "Set the 25 Hz Ricker beside the Ekene-1 statistical wavelet on the same 31-sample clock. What does the course's table show?",
 "The Ricker peaks at 25.039790 Hz with its centroid at 26.596139 Hz; Ekene-1 peaks at 24.488746 Hz with its centroid at 25.084884 Hz.",
 ["The two wavelets match: the Ricker peaks at 25.039790 Hz and Ekene-1 centres at 25.084884 Hz, so either serves.",
  "The Ricker's centroid equals its 25 Hz peak, since a Ricker is symmetric and its power sits about one frequency.",
  "Ekene-1's centroid, 26.596139 Hz, sits above the Ricker's 25.084884 Hz, because a field wavelet carries more high frequency."],
 "The Ricker peaks at 25.039790 Hz and has its centroid at 26.596139 Hz, while Ekene-1 peaks at 24.488746 Hz with its centroid at 25.084884 Hz. The two wavelets do not match figure for figure, and the swapped figures belong to the other wavelet.")

q(2, "Which well's statistical wavelet has the highest -6 dB high edge, and what is it?",
 "Ekene-4, at 43.780487 Hz.",
 ["Ekene-3, 42.236734 Hz.",
  "Ekene-2, 39.582002 Hz.",
  "Ekene-1, 41.469972 Hz."],
 "Ekene-4 is highest in every column: peak 26.530951 Hz, centroid 26.581599 Hz and high edge 43.780487 Hz. Ekene-3's 42.236734 Hz is second, Ekene-1's 41.469972 Hz third, and Ekene-2's 39.582002 Hz is the lowest.")

q(1, "In the designed case the Ekene-1 synthetic is first turned by 90 degrees and then matched to the trace again. What does the match return?",
 "Best phase -96.113046 degrees; correlation -0.105222 before and 0.988309 after.",
 ["Best phase -66.081556 degrees; correlation 0.400777 before and 0.988816 after, the same rotation found back.",
  "A refusal, since the correlation before rotation is negative.",
  "Best phase -96.113046 degrees; correlation stuck at -0.105222, since one rotation cannot repair a reversed match."],
 "With 90 degrees added the correlation before matching is -0.105222, and the match finds -96.113046 degrees and restores it to 0.988309. The -66.081556 row belongs to 60 degrees added, and the engine returns a phase for any correlation.")

q(3, "Why does the lab run estimatePhaseRotation on the synthetic's live span only?",
 "Because the Hilbert transform cannot cross a gap.",
 ["Because the trace outside 1100 to 1500 ms went into the statistical wavelet and must stay apart from the match.",
  "Because the 20 ms bulk shift must fit inside it.",
  "Because the zero fill would fix the phase."],
 "The best phase is found over the samples both traces carry, and the lab restricts it to the synthetic's live span, the 26 samples at Ekene-1, because the Hilbert transform cannot cross a gap. The wavelet window and the bulk shift search do not set this span.")

q(2, "What does rotateConstantPhase return for a trace s turned through a phase phi?",
 "s cos(phi) + H(s) sin(phi), with H the Hilbert transform.",
 ["s moved later in time by a lag set by phi, the way the bulk shift moves a synthetic.",
  "H(s) cos(phi) + s sin(phi), so that a phase of zero returns the Hilbert transform.",
  "s cos(phi) alone, a pure scaling of amplitude."],
 "The rotation is s cos(phi) + H(s) sin(phi): a phase of zero leaves s as it is and 180 degrees gives the reversed polarity trace. A time shift is the bulk shift's job, and swapping s and H(s) would return the Hilbert transform at zero phase.")

emit(Q, '/root/qi-wip-qi/banks/qii_m01.json', expect_n=15)
finish()
