import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# QI Expert m03, Simultaneous inversion.
# Sources: Fatti's coefficients at the Ekene background Vs/Vp, the solver,
# the angle-dependent wavelet scales and the angle-wavelet engine on short
# logs, what each set of stacks resolves at Ekene-1, and the blind wells per
# parameter.

q(1, "In Fatti's linearisation at the Ekene background Vs/Vp, what do the three coefficients print at normal incidence?",
 "G1 0.500000, with G2 and G3 both 0.000000: only AI contributes.",
 ["G1 0.515546, G2 -0.018761 and G3 -0.006165.",
  "G1 0.000000, with shear and density carrying it.",
  "G1 and G3 both 0.500000, with G2 zero."],
 "With G1 = (1 + tan^2 theta) / 2 and both G2 and G3 carrying sin^2 theta or tan^2 theta, the 0 degree row prints G1 0.500000 and G2 and G3 0.000000. 0.515546, -0.018761 and -0.006165 are the 10 degree row.")

q(3, "What background Vs/Vp, K, does the course use for the Fatti coefficients on the Ekene pack, and how is it found?",
 "0.394396, the mean of Vs / Vp over every logged sample of the four pack wells in the window.",
 ["0.394396, the Vs / Vp of the Ekene-1 oil leg alone, the zone the inversion is meant to resolve.",
  "0.500000, the value at which G1 sits at normal incidence, taken as K so the coefficients balance.",
  "0.666667, the G1 coefficient at the far stack of 30 degrees, read as the background ratio."],
 "K is the mean of Vs / Vp over every logged sample of the four pack wells in the window, 0.394396, and it enters G2 and G3 through K^2. 0.500000 and 0.666667 are G1 at 0 and 30 degrees.")

q(0, "At the pack's near angle of 10 degrees, what is G3, the density coefficient?",
 "-0.006165.",
 ["-0.018761, the coefficient on dln(SI) at 10 degrees, the second voice of the three.",
  "-0.029846, the density coefficient at the mid stack of 20 degrees, read one row down.",
  "0.515546, the coefficient on dln(AI) at 10 degrees, which every stack sees most."],
 "At 10 degrees G1 is 0.515546, G2 -0.018761 and G3 -0.006165; G3 at 20 degrees is -0.029846. Density's coefficient is negative and the smallest of the three in size at every non-zero angle in the table.")

q(2, "Between which pair of tabled angles does the size of G3 grow the most, and how far do the pack's stacks reach?",
 "Between 30 and 40 degrees, from -0.088893 to -0.223507; the far stack reaches 30 degrees.",
 ["Between 0 and 10 degrees, where density enters; the far stack reaches 40.",
  "Between 20 and 30 degrees, -0.029846 to -0.088893; the far stack reaches 40.",
  "Evenly at each step, G3 being linear in angle; the far stack reaches 30."],
 "G3 runs 0.000000, -0.006165, -0.029846, -0.088893 and -0.223507 at 0 to 40 degrees, and its size grows more between 30 and 40 degrees than between any earlier pair. The far stack here reaches 30 degrees, so G3 grows most beyond the pack's angles.")

q(1, "What does simultaneousInversion solve for, and how is each unknown held?",
 "ln(AI), ln(SI) and ln(rho) together by CGLS, each pulled to its own LFM by its own weight.",
 ["ln(AI) first by CGLS, then ln(SI) and ln(rho) from it by Fatti's coefficients with no LFM.",
  "AI, Vp/Vs and density in turn, one stack each, with one shared weight on all three.",
  "Intercept and gradient by a Shuey fit to the stacks, then AI from the intercept."],
 "simultaneousInversion runs pylops' PrestackLinearModelling with the Fatti linearisation and solves for ln(AI), ln(SI) and ln(rho) together by CGLS, each pulled to its own LFM by its own weight; the course states 0.050000 for each and 60 iterations.")

q(3, "Each angle stack takes the same 25 Hz Ricker shape with its own least squares scale (fattiScale). How do the three scales run from near to far?",
 "They fall: near 1860.598608, mid 1679.662569, far 1305.654435.",
 ["They rise with angle, the far stack's larger scale making up for the high frequency it has lost.",
  "They are one figure, 769.984107, since one Ricker shape carries one scale across every stack.",
  "They match the angle's G1, rising from 0.515546 at 10 degrees to 0.666667 at 30 degrees."],
 "fattiScale gives near 1860.598608, mid 1679.662569 and far 1305.654435, each over 19 samples: the scale falls from near to far. 769.984107 is the post-stack scale of the full stack, and the shape is the same Ricker for every stack.")

q(0, "The well-wavelet extraction under extractAngleWavelets is run at Ekene-1, on the half differences of the ln(AI) log, with a half length of 15 samples, a 31-sample wavelet against 27 logged samples. What does it say?",
 "\"The well reflectivity is flat over the seismic at the well, so there is nothing to extract a wavelet from.\"",
 ["\"The log covers 16 usable samples at the well; a 11-sample wavelet needs at least 22. Shorten the wavelet or use the statistical one.\"",
  "\"The wells overlap too little seismic to scale the wavelet.\"",
  "Nothing: it returns a 31-sample wavelet for each of the 3 stacks."],
 "With a half length of 15 the wavelet is longer than the 27 logged samples, so no row of the fit is complete, and the engine's own words are the flat-reflectivity message; over the four wells it returns no wavelet for 0 of 3 stacks. The 16-sample message comes at a half length of 5.")

q(2, "At what half length does extractAngleWavelets return a wavelet for each stack on the pack, and why does the course still state the Ricker shape for the inversions?",
 "At 3, a 7-sample wavelet spanning 24.000000 ms, shorter than the stated Ricker.",
 ["At 5, an 11-sample wavelet from 16 usable samples per well.",
  "At 15, a 31-sample wavelet, the engine's own length.",
  "At no length: 0 of 3 stacks at every half length."],
 "At a half length of 3 the engine returns a 7-sample wavelet for each of the 3 stacks; it spans 24.000000 ms, shorter than the stated Ricker, so the course states the Ricker shape and scales it per stack. At 5 the engine says an 11-sample wavelet needs at least 22 usable samples.")

q(1, "With 7-sample angle wavelets at 30 degrees, Ekene-4 prints a fit correlation of 0.967385. How well does its synthetic match the far stack?",
 "At 0.603319, below its fit correlation.",
 ["At 0.967385, the same figure, since a well's synthetic against the stack is its fit correlation read a second way.",
  "At 0.927864, the figure Ekene-1's synthetic reaches against the far stack, which every well shares at that angle.",
  "At 0.940659, the fit correlation at Ekene-1, as the four wells' fits are aligned and averaged into one."],
 "At 30 degrees Ekene-4's fit correlation is 0.967385 and its synthetic against the stack 0.603319. Ekene-1 prints 0.940659 and 0.927864. A close fit to the well's own reflectivity is no guarantee of a close match to the stack.")

q(3, "Ekene-1 is inverted blind from the near stack only (eps 0.050000 for each parameter, 60 iterations). What happens to Vp/Vs?",
 "It correlates at -0.744719 with an error of 30.824755 percent.",
 ["At 0.470296 and 10.707173 percent, shear carried by G2.",
  "At the LFMs' 0.048283 and 11.122749 percent, unchanged.",
  "It correlates at 0.383124 with an error of 13.660754 percent, the best Vp/Vs the three sets of stacks give."],
 "With the near stack only, Vp/Vs scores -0.744719 and 30.824755 percent, worse than the LFMs alone at 0.048283 and 11.122749. 0.383124 is near and mid, and 0.470296 with 10.707173 percent is near, mid and far.")

q(0, "From the near stack only, density's RMS error at Ekene-1 is 0.627310 percent against 0.767482 with the LFMs alone. What does the near stack do to density?",
 "It moves density's shape, correlation -0.087754 to 0.614032, without moving its level far.",
 ["It sets density's level from the seismic, the error under one percent coming from the near stack.",
  "It moves density's level by 14.112317 percent while its correlation stays at the LFMs' -0.087754.",
  "Nothing: G3 is 0.000000 at 10 degrees, so density stays exactly at its LFM."],
 "With the near stack, where G3 is tiny at -0.006165, density's error stays under one percent while its correlation changes from -0.087754 to 0.614032: the near stack moves density's shape without moving its level far. G3 is 0.000000 only at 0 degrees, and 14.112317 percent is the error with all three stacks.")

q(2, "Add the mid and far stacks to the near at Ekene-1, blind. What happens to density?",
 "Its correlation turns negative, -0.767957, and its error rises to 14.112317 percent.",
 ["Its correlation rises to 0.863789 and its error falls to 8.956955 percent.",
  "It holds at 0.614032 and 0.627310 percent, unchanged by the stacks.",
  "Its error falls to the LFMs' 0.767482 percent."],
 "With near, mid and far, density scores -0.767957 and 14.112317 percent at Ekene-1, and with near and mid -0.707948 and 12.184029: density is the least reliable of the three parameters. 0.863789 and 8.956955 are the AI scores with all three stacks.")

q(1, "How does AI's correlation at Ekene-1 change across the three sets of stacks, near, near and mid, and near, mid and far?",
 "It hardly changes: 0.858677, 0.865225 and 0.863789.",
 ["It rises steadily as stacks join, from 0.858677 to 0.865225, with the far stack lifting it most of all.",
  "It falls with each stack added, from 0.863789 to 0.858677, since the far stacks carry less of G1 than the near stack.",
  "It goes negative with the far stack, to -0.190352."],
 "AI scores 0.858677, 0.865225 and 0.863789 from the three sets of stacks: AI is held by the near angles alone. -0.190352 is the LFMs alone, and 0.865225 is the near and mid figure.")

q(3, "Every pack well is inverted blind from the near, mid and far stacks. What sign does the density correlation take across the four wells?",
 "Negative at all four wells.",
 ["Positive at all four wells, from 0.613638 to 0.910855, following the far stack's synthetic correlations.",
  "Positive at Ekene-1 and Ekene-3 and negative at Ekene-2 and Ekene-4, the pattern Vp/Vs shows.",
  "Negative at Ekene-1 only, where the single-well experiment ran, and positive at the other three wells."],
 "The density correlations are -0.767957, -0.470987, -0.719301 and -0.413424 at Ekene-1 to Ekene-4. The split by well belongs to Vp/Vs, positive at Ekene-1 and Ekene-3 at 0.470296 and 0.360220. A study quotes the blind figure for each parameter it uses.")

q(2, "Which of the three parameters does the blind check from near, mid and far stacks support at every pack well?",
 "AI, with correlations from 0.780557 at Ekene-4 to 0.863789 at Ekene-1.",
 ["Vp/Vs, with errors from 10.707173 to 15.482932 percent, the smallest of the three at each pack well.",
  "Density, its error lowest at Ekene-4, 9.115991 percent.",
  "None, as each scores below the LFMs' -0.190352."],
 "AI correlates at 0.863789, 0.854299, 0.847660 and 0.780557 at Ekene-1 to Ekene-4; Vp/Vs and density do not correlate well, and each is reported for what it is. Density's 9.115991 percent at Ekene-4 sits beside a correlation of -0.413424.")

emit(Q, '/root/qi-wip-qi/banks/qia_m03.json', expect_n=15)
finish()
