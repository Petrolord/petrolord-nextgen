import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# QI Professional m05, AVO volumes.
# Sources: fitShuey on near, mid and far at gather 5's top, the volumes, the
# background trend and the off-trend distance, the fluid factor and the chi
# projection, and conditioning before AVO.

q(1, "fitShuey runs with two terms on gather 5's three angle bins at the top (1292.000000 ms), placed at 10, 20 and 30 degrees. What intercept and gradient come back?",
 "A 501.873676 and B -734.431814, in trace amplitude units.",
 ["A 510.227684 and B -915.097371, the three-term fit on the same three bins, its curvature carried in C.",
  "A 519.312395 and B -927.296460, from 9 bins of 5 degrees.",
  "A 486.838592 and B -1072.562182, from the kit's stacks."],
 "The two-term fit on the near, mid and far bins at 10, 20 and 30 degrees gives A 501.873676 and B -734.431814. The three-term fit gives 510.227684 and -915.097371, nine 5 degree bins give 519.312395 and -927.296460, and 486.838592 with -1072.562182 is the fit to the kit's stack traces at Ekene-1.")

q(3, "fitShuey is asked for three terms on the three bins at gather 5's top. What does the course say about that fit?",
 "It is exactly determined: three terms on three angles.",
 ["It is overdetermined, with one spare equation left to measure the misfit of the curvature term against the data.",
  "It is underdetermined, so the engine refuses a third term until a fourth angle carries a finite amplitude.",
  "It returns C as 0.000000, the same as the two-term fit, because three angles cannot resolve a curvature term."],
 "A three-term fit on three angles is exactly determined. The engine returns C 467.947963 here; 0.000000 is the two-term fit's C, which has no third term.")

q(0, "Adding the third term at gather 5's top changes the fit. What does the three-term fit return?",
 "A 510.227684, B -915.097371 and C 467.947963.",
 ["A 501.873676, B -734.431814 and C 467.947963.",
  "A 510.227684, B -734.431814 and C 0.000000.",
  "A 519.312395, B -927.296460 and C 0.000000."],
 "The three-term fit gives A 510.227684, B -915.097371 and C 467.947963, against the two-term A 501.873676 and B -734.431814 on the same bins. 519.312395 and -927.296460 are the two-term fit on 9 bins.")

q(2, "At one sample the far stack carries no finite amplitude. What does fitShuey do with that angle?",
 "It drops it, fitting only the angles that carry a finite amplitude.",
 ["It reads the gap as an amplitude of zero, pulling the gradient steeply negative at that sample of the volume.",
  "It refuses the sample in the engine's own words and leaves the volumes empty there.",
  "It fills the gap with the mean of the near and mid amplitudes."],
 "fitShuey fits per sample by least squares over the angles that carry a finite amplitude, so a gap drops out and the angles used can be fewer than the angles given. It neither zero-fills, refuses nor interpolates; a gap in a stack changes what the volumes rest on at that sample.")

q(1, "The two-term intercept at gather 5's top is 501.873676. In what units is that figure?",
 "Trace amplitude units, tied to reflectivity only by the one scale over the wells.",
 ["Reflection coefficient units, since the fit is Shuey's approximation, which is written for reflectivity itself.",
  "Acoustic impedance in kg/(m2 s), the contrast across the top of the Ekene Sand.",
  "Degrees, the angle at which the fitted line crosses zero."],
 "The kit's seismic amplitudes carry no physical scale, so A and B from the stacks are in trace amplitude units. The course divides them by the one scale over the wells, 1882.216944, before reading them as reflection coefficients.")

q(3, "What is an intercept volume, and where does QI Studio compute it?",
 "The Shuey fit at every sample of every trace of the angle stacks, run on QI Studio's seismic worker over the survey.",
 ["The near stack relabelled, since the near angle sits closest to normal incidence across the whole survey.",
  "The Shuey fit at the top of each well only, the four well points then gridded across the survey by the app.",
  "The full stack scaled by 1882.216944, so that every sample of it reads as a reflection coefficient."],
 "Intercept and gradient volumes are the same fit run at every sample of every trace of the angle stacks; QI Studio runs it on the seismic worker over the survey. The near stack is one input to the fit, and the one scale ties amplitudes to reflectivity after the fit.")

q(2, "How does backgroundTrend fit the line through gather 5's (A, B) pairs?",
 "B = m A through the origin, by orthogonal regression over the pairs.",
 ["By ordinary least squares of B on A with a free intercept, the line allowed to miss the origin.",
  "By ordinary least squares of B on A through the origin.",
  "By taking the published Castagna, Swan and Foster slope as it stands, with no fit to the seismic pairs at all."],
 "The background trend is the line B = m A through the origin by orthogonal regression over the (A, B) pairs, 176 of them on gather 5 with slope -4.020851. The course names which line a distance is read from.")

q(0, "On gather 5, the two-term fit at every sample of the window where all three bins carry data gives the (A, B) pairs. How many pairs, and what trend slope m do they give?",
 "176 pairs, slope m -4.020851.",
 ["13 pairs, one per offset, slope m -4.020851.",
  "176 pairs, slope m -76.033690, the slope given in degrees.",
  "176 pairs, slope m -1.16, the fluid factor's coefficient on dVs/Vs."],
 "176 pairs give a background slope of -4.020851. -76.033690 is atan(m) in degrees, the chi along the trend, and 1.16 is the coefficient in the fluid factor; the gather's 13 offsets are traces, and the pairs come from samples of the window.")

q(1, "How far does the top's point at gather 5 sit from that gather's background trend?",
 "309.781098, in trace amplitude units.",
 ["833.848276, the projection of the point at chi = atan(m), read along the background trend.",
  "67.419446, the chi projection of the point at the stated chi of 30 degrees.",
  "0.107520, the fluid factor."],
 "offTrend gives (B - m A) / sqrt(1 + m^2); the top's two-term point sits 309.781098 from the line in trace amplitude units. 833.848276 and 67.419446 are chi projections and 0.107520 is the fluid factor of the scaled point.")

q(3, "What does a negative off-trend distance mean?",
 "The point sits below the line, towards softer, gas-like responses.",
 ["The point sits above the line, towards harder responses than the background of the window.",
  "The point's intercept is negative, whatever its gradient.",
  "The point sits on the line, in reverse polarity."],
 "offTrend returns (B - m A) / sqrt(1 + m^2), negative towards softer, gas-like responses below the line; the course's vocabulary calls negative the hydrocarbon side. The sign of the distance is a position against the line, which the intercept alone does not set.")

q(2, "contrastsFromAB is run on the top of gather 5 after its two-term A and B are divided by 1882.216944, at a stated Vs/Vp of 0.500000. What fluid factor does it return?",
 "0.107520.",
 ["0.426623, the relative compressional contrast dVp/Vp of the same point.",
  "0.550179, the relative shear contrast dVs/Vs at the stated Vs/Vp.",
  "0.106656, the density contrast drho/rho from Gardner."],
 "The fluid factor dVp/Vp - 1.16 (Vs/Vp) dVs/Vs is 0.107520 here. 0.426623 is dVp/Vp, 0.550179 dVs/Vs and 0.106656 drho/rho, all from the A and B divided by the one scale at the stated Vs/Vp of 0.500000.")

q(0, "How does contrastsFromAB tie the density contrast to the velocity contrasts?",
 "By Gardner's density, drho/rho = dVp/Vp / 4, which gives 0.106656 against dVp/Vp 0.426623 at the top.",
 ["By the stated Vs/Vp of 0.500000, which sets the density contrast to half the shear contrast.",
  "By holding density fixed, so drho/rho reads zero and A carries only velocity.",
  "By 1.16 (Vs/Vp) dVs/Vs, the mudrock line term."],
 "The engine uses Gardner's density, drho/rho = dVp/Vp / 4, and the top gives drho/rho 0.106656 against dVp/Vp 0.426623. 1.16 (Vs/Vp) dVs/Vs is the term the fluid factor subtracts.")

q(1, "A study passes the seismic A and B of a sample to contrastsFromAB straight from the stacks, in trace units. What does the course state about that input?",
 "The engine needs A and B as reflection coefficients, so they are first divided by the one scale.",
 ["Trace units are fine, since the fluid factor is a ratio of contrasts and any common scale cancels out of it.",
  "The engine rescales its inputs itself by the stated Vs/Vp, which is why that ratio must be given.",
  "The engine refuses any intercept above one."],
 "The course states that the engine needs A and B as reflection coefficients. Seismic A and B sit in trace amplitude units, so a study divides them by the scale the comparison at the wells fits before the call.")

q(3, "What does chiProjection return for the top of gather 5 at chi = atan(m) = -76.033690 degrees, the angle along the background trend?",
 "833.848276.",
 ["67.419446, the projection of the same point at the stated chi of 30 degrees.",
  "309.781098, the off-trend distance of the point from the background line.",
  "-4.020851, the background trend slope m of gather 5."],
 "chiProjection is A cos(chi) + B sin(chi). At chi = atan(m), along the background trend, the top projects to 833.848276; at the stated 30 degrees it projects to 67.419446. 309.781098 is the off-trend distance and -4.020851 is m itself.")

q(0, "QI Studio conditions its angle stacks before the Shuey fit. Which statement about that conditioning holds in this course?",
 "QI Studio runs trim statics, matching in shift, phase and scale, and spectral balancing; the course vendors none of it, grades none of it, and a study records which steps it ran.",
 ["The course's prestack explorer runs all three steps on the pack's stacks before every fit, so its A and B are conditioned.",
  "Conditioning moves the stacks in time only, so the amplitudes the fit reads are unchanged by it.",
  "The capstone grades the conditioned far stack."],
 "Conditioning lives in the engines' conditioning file and QI Studio runs it: trim statics, matching in shift, phase and scale, and spectral balancing. The course vendors and grades none of it, and each step changes the amplitudes the fit reads, so a study records which it ran.")

emit(Q, '/root/qi-wip-qi/banks/qii_m05.json', expect_n=15)
finish()
