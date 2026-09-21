import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H4 consequence, Expert tier, module "What the Engine Does Not Do".
# Digest sections drawn on: 30 (the inverse probit is approximate), 31 (what
# the engine does not do), 32 (the single route quantities) and 22 (the seams,
# named as belonging to other courses and never computed here).

q(2,
 "How does the engine turn a probability back into a probit?",
 "It bisects on the same approximate normal CDF it uses forward, the Abramowitz and Stegun 7.1.26 form from lib/stats",
 ["It evaluates an exact inverse of the normal distribution, the same exact form the oracle uses to write the golden records",
  "It looks the probit up in the Purple Book's Table 5.1 and interpolates between the two printed cells either side",
  "It uses Newton's method on the probit equation"],
 "Section 30: the forward CDF is the repository's `normalCDF`, Abramowitz and Stegun 7.1.26 with an error of at most 1.5e-7, and the inverse bisects on that same approximate CDF. The oracle's exact normal distribution is what the golden compares against, Table 5.1 is evidence and no lookup, and there is no Newton step."),

q(1,
 "At a probability of 0.01 the engine's probit is 2.673653 and the exact probit in the golden is 2.673652. How large is the difference?",
 "8.59e-7, a departure in the seventh decimal",
 ["-1.78e-14, which is the difference the inverse table prints at a probability of 0.5",
  "3.91e-7, which is the difference printed at 0.9",
  "0.139897, the difference in the toxic load"],
 "The inverse table prints 8.59e-7 at 0.01, so the engine departs from the exact probit in the seventh decimal. -1.78e-14 is the 0.5 row, 3.91e-7 the 0.9 row, and 0.139897 is what that departure becomes once it is carried through the lees-chlorine toxic load."),

q(3,
 "For the lees-chlorine preset the engine's one percent toxic load is 149793.673220. What does the exact probit give, derived in the digest?",
 "149793.533322",
 ["149793.673220, identical, since the toxic load does not depend on the probit",
  "0.139897, the size of the difference itself",
  "100000.000000, the Lees chlorine load at 100 ppm for 10 minutes"],
 "Section 30 derives 149793.533322 from the exact probit, a difference of 0.139897: a seventh decimal departure in the probit is magnified through the toxic load. The engine's own figure is the thing being checked, 0.139897 is the gap between the two, and 100000.000000 is a forward load at a stated exposure."),

q(0,
 "Given that small magnification, what does the course do with a thermal dose or toxic load read back from a probability?",
 "Quotes it to the figures the approximation supports, and never grades one",
 ["Grades it at six decimals like every other figure the digest prints, since the forward CDF is good to about 1.5e-7",
  "Grades it to the tolerance the golden allows for the Table 5.1 cells on a rounding edge",
  "Rounds it to the printed digits of OSD/30"],
 "Section 30 ends: a thermal dose or toxic load read back from a probability is quoted to the figures the approximation supports, and this course never grades one. The forward accuracy does not carry through the inverse, the rounding edge cells are kept apart rather than graded, and OSD/30 prints values without any rule for rounding."),

q(1,
 "Why does this course print its probabilities to six decimals?",
 "The forward CDF is good to about 1.5e-7 in probability, so six decimals are figures it supports",
 ["Table 5.1 of the Purple Book prints its probabilities to six decimals, which the course copies directly",
  "Six decimals is where the lees-chlorine toxic load and its exact value agree to the last digit",
  "The OSD/30 lethal doses print six decimals"],
 "Section 30: the forward direction is good to about 1.5e-7 in probability, which is why the course prints probabilities to six decimals. Table 5.1 prints probits to two decimals, the lees-chlorine loads differ by 0.139897, and OSD/30 prints lethal doses such as 960 and 2380."),

q(2,
 "Why is two phase discharge not in the engine, and what does the analyst do instead?",
 "No public closed form was read with a worked example, and the Yellow Book models are numerical; a two phase model outside this engine is used",
 ["The Yellow Book forbids a closed form for flashing liquids, so the analyst runs the liquid outflow through the hole and then adds a flash factor to the result",
  "The engine treats a flashing liquid as an ideal gas, tests the critical pressure ratio at the hole and returns the choked mass rate with a warning",
  "It was dropped as too rare offshore"],
 "Section 31 gives the reason quoted and the remedy: a two phase model outside this engine for a flashing liquid. The engine has no flash factor, never relabels a liquid as a gas, and the digest names no offshore frequency argument. None of the section 31 items is taught as computed."),

q(0,
 "An instantaneous release needs a puff. What does section 31 record about it?",
 "The puff sigmas were not in a source read, so the analyst models a short release with a puff model elsewhere",
 ["The engine models it as a Gaussian plume with a very short duration and warns the caller that the result is an extrapolation",
  "The puff is in the engine but ungraded, because it is a single route quantity",
  "It is modelled by the multi-energy method"],
 "Section 31 lists the instantaneous puff as not in the engine because its sigmas were not in a source read. The plume is continuous and has no duration input, a single route quantity is one the engine does compute, and the multi-energy method is itself absent."),

q(3,
 "A release sits in a built-up area. What does the engine offer for urban dispersion?",
 "Nothing: a sourced urban sigma_y was not available, so the analyst uses the rural set with care, or another tool",
 ["The Briggs urban coefficients, selected by passing an urban flag to `briggsRuralSigmas` with the class",
  "The rural Briggs set with sz2 changed to 0.00015, the value printed since Briggs 1973",
  "The class F coefficients, the engine's stand in for a built-up area"],
 "Section 31: only the rural Briggs set is here, because a sourced urban sigma_y was not available. There is no urban flag, 0.00015 is the misprint ALOHA corrects in class D, and class F is the most stable rural class, a weather state that has nothing to do with buildings."),

q(1,
 "Why does the engine carry no jet fire model?",
 "The only worked example read carries internal inconsistencies, so a golden could not tell a right engine from a wrong one",
 ["A jet fire is a pool fire with a tilt of zero, which `poolFireSolidFlame` already covers when it is given a zero wind at the hole",
  "The Facilities courses grade jet fires through their point source model",
  "Jet fires fall outside the Yellow Book"],
 "Section 31 gives the reason quoted, and the analyst uses a jet fire model elsewhere. A pool fire is not a jet, the point source model belongs to the Facilities courses on relief and flare systems and on layout for their own purpose, and the digest says nothing about the Yellow Book lacking the subject."),

q(3,
 "Why are the Kingery-Bulmash fits absent, and what does the analyst use?",
 "The coefficients were not obtained, since the sources read print curves; Kinney and Graham within its range is used",
 ["The fits were tested against the conference column and failed it by more than 1.70e-4, so Kinney and Graham replaced them",
  "They are present but hidden behind the ground burst option that the caller sets on the charge",
  "They cover only Z above 40"],
 "Section 31 records the reason quoted. The conference column is evidence for Kinney and Graham and was never run against Kingery-Bulmash, the engine has no ground burst option, and the only thing borrowed from the Kingery-Bulmash compilation is the judged span of Z from 0.05 to 40."),

q(2,
 "Lung, eardrum and structural probits do not appear in `OVERPRESSURE_PROBITS`. What does section 31 say?",
 "Their source was not read, so they are not included; the analyst uses the fatality probit here and states what it covers",
 ["They are folded into the hsc preset, which returns a combined injury probability for every blast target",
  "They are single route quantities, taught in this course with no graded answer",
  "They need an impulse, which the engine computes but does not export"],
 "Section 31 names lung, eardrum and structural probits as out of the engine because their source was not read. The hsc preset is a single fatality probit from OSD/30 Equation 4a, section 32 lists no such single route quantity, and the fit returns a peak side-on overpressure with no impulse."),

q(0,
 "A reviewer asks this engine for a point source heat radiation level and a setback distance. Where do those belong?",
 "In the facilities engines, taught and graded by the Facilities courses on relief and flare systems and on layout",
 ["In `poolFireSolidFlame`, which returns the setback as a distance to a heat flux alongside every step of its solid flame result",
  "In the later quantitative risk course, which grades individual risk and the F-N curve along with the frequencies behind them",
  "In `solidFlameHeatFlux`"],
 "Section 22 and section 31: the point source model and the setbacks it implies live in the facilities engines, this engine does not re-expose them, and its validation record carries a test that asserts it exports none. The solid flame functions are this course's own model and return no setback. Individual risk and the F-N curve are a different seam."),

q(3,
 "What does the engine say about frequencies and risk, and which course do individual risk, PLL and the F-N curve belong to?",
 "It computes effects and no frequency; those measures belong to the later quantitative risk course, with frequencies taken from a risk study",
 ["It returns a frequency beside each probability so that the potential loss of life can be summed by the caller as part of the work of this course",
  "It computes individual risk from the probit result at each receptor, and the F-N curve is left to the Facilities courses on relief and on layout",
  "It leaves frequencies to the risk and change course, which in that course also grades the F-N curve and the risk matrices that its bands are drawn from"],
 "A consequence model says what happens if the release occurs. Section 22 places individual risk, the potential loss of life and the F-N curve in the later quantitative risk course, and the risk matrices in the risk and change course. The engine returns no frequency, computes no risk measure, and this course grades none of them."),

q(2,
 "Section 32 asks what still catches a mistake copied into both the engine and its oracle. Which of these quantities IS graded in this course?",
 "The Lees toxic coefficients, backed by the OSD/30 columns",
 ["The Bagster transmissivity, backed by the Yellow Book pool fire's printed transmissivity of 0.71474 from Hottel charts",
  "The Burgess burning rate, backed by the Babrauskas asymptote for hexane",
  "Thomas in still air, backed by the facilities engine it is imported from"],
 "The section 32 row for the Lees toxic coefficients reads 'the OSD/30 columns (section 29)' and 'yes'. Bagster, Burgess and Thomas in still air each read 'nothing: the transcription alone' and 'no'. A single route quantity is taught and never carries a graded answer."),

q(0,
 "Why is no Purple Book toxic preset graded, apart from its use as a teaching comparison?",
 "Only carbon monoxide has a published worked case behind it; every other substance rests on the transcription, so graded toxic probits use Lees presets",
 ["The Purple Book presets take ppm, which the capstones cannot supply without a molar mass for each substance",
  "Every Purple Book preset fails the OSD/30 columns by more than one percent",
  "The Purple Book presets have no source string"],
 "Section 32 records one published worked case, carbon monoxide, and says every other substance rests on the transcription, so the row reads 'no'; every graded toxic probit uses a Lees preset. The Purple Book presets take mg/m3, the OSD/30 columns test the Lees presets, and each preset names its source."),

emit(Q, '/root/hse-wip-consequence/banks/h4a_m05.json', expect_n=15)
finish()
