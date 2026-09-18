import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC6 Expert m05, What the Method Does Not Know. Digest sections 20 and 14,
# with section 21 as the one framed history item. 15 questions.

q(2, "The engine's test suite pins dittusBoelterA at 0.023000 by literal. What does that pin establish about the value?",
 "Nothing about the value, because it makes a change to it a reviewed act rather than a silent one.",
 ["That the value has been checked against the oracle, which reaches the same figure by its own route.",
  "That the value sits inside the validity band this module records for the correlation it belongs to.",
  "That the value has been measured out of an engine answer in the way the viscosity conversion is."],
 "A pinned constant and a validated one both appear as a green line in a test report, and a reader who has not looked at the file will assume the stronger of the two. There is no band recorded here to sit inside.")

q(0, "Which answer in this module do the pinned correlation coefficients act on?",
 "The tube-side film coefficient.",
 ["The bundle diameter and the shell diameter.",
  "The hot-day duty fraction and the process outlet.",
  "The fan brake horsepower and the motor horsepower."],
 "They sit on the film and nowhere else. A number nothing can validate should decide as little as possible, and no graded field in this course reads one.")

q(3, "The held register carries 7 entries and the module's own header sentence says six. Which governs, and what is the lesson?",
 "The register, because it is what the returns point at, and a count is worth measuring rather than quoting.",
 ["The header, because a module's own statement of its contents is its contract with a caller.",
  "Neither, because the disagreement is itself recorded as an eighth held item in the register.",
  "The header, because the seventh entry is the fan constant, which is measured rather than held."],
 "This is the cheapest possible demonstration of measuring a count rather than quoting one, even from the module that owns it.")

q(1, "Which of these is in the held register?",
 "The Sieder-Tate exponent and the band it was fitted over.",
 ["The declared maximum of 6 shell passes, which is a bound rather than a published limit.",
  "The declared margin of 10 percent below which a controlling verdict carries a note.",
  "The transition band edges of 2300 and 10000, between which the film is refused."],
 "The register names bundleConstants, dittusBoelterBand, dittusBoelterCoolingExponent, siederTateExponent, crossFlowF, defaultsProvenance and fanConstantWaterDensity. A declared bound is this module's own choice and it says so.")

q(0, "The engine carries 2.419100 for the centipoise conversion and the published file carries 2.419088. What is the second figure?",
 "The exact derivation, against which the engine's figure is a rounding.",
 ["The same conversion measured out of an engine answer at a unit viscosity.",
  "The conversion used on the air density path.",
  "A second engine constant, used wherever a Prandtl number rather than a Reynolds number is formed."],
 "The ratio between them is 1.000004832191, formed from those two figures, and it is carried in the published file.")

q(2, "The engine's gas constant is 10.731600 and the figure derived from the SI gas constant is 10.731577. What ratio does that pair give?",
 "1.000002134913.",
 ["1.000004832191.",
  "A ratio of exactly one, because the two agree at the precision the engine works to.",
  "0.500000, which is what the Reynolds check on the same path returns."],
 "The figure 1.000004832191 is the viscosity conversion ratio. The Reynolds ratio of 0.500000 is a separate check, on a quantity inversely proportional to viscosity.")

q(1, "Neither rounding is moved. What is done instead?",
 "The residual each one causes downstream is asserted to equal the rounding.",
 ["Each one is pinned by literal, in the same way the correlation coefficients are.",
  "Each one is recorded in the held register.",
  "Each one is applied at the exact value in the oracle and at the rounded value in the engine."],
 "Moving either would move every shipped number that reads it. The named cause is then itself a check: if the downstream difference stops matching the rounding, something other than the rounding has changed.")

q(3, "At a unit viscosity the Prandtl number comes back as 30.238750. What can be recovered from it?",
 "The viscosity conversion the engine used, taking the Prandtl number times the conductivity over the heat capacity.",
 ["The Reynolds number at the same conditions, taking the Prandtl number times the mass flow over the bore.",
  "The laminar Nusselt number of 3.660000, which the correlation falls back on below a Reynolds number of 2300.",
  "The gas constant of 10.731600, since a Prandtl number and a gas constant share the same conversion."],
 "The heat capacity and the conductivity are conditions of the case, so the conversion is the only unknown left, and it comes back as 2.419100.")

q(2, "The engine gives a Reynolds number of 22025.923000 at one viscosity and 11012.961500 at twice it. What kind of check is that?",
 "An analytic limit, since a Reynolds number inversely proportional to viscosity has to halve.",
 ["A comparison with the published file, since the golden carries both figures.",
  "A restatement, since the second call reuses the first number with the viscosity divided out.",
  "A pin, since the ratio of 0.500000 is asserted by literal in the engine gate."],
 "It costs one extra call and it needs no publication. The ratio comes back as 0.500000.")

q(0, "The Rankine offset lives as a literal inside the air density helper rather than as a row of the declared constants table. How is it recovered?",
 "From two density calls, at 0.076341600 and 0.068439697 lb per ft3 for 60.000000 and 120.000000 degF.",
 ["From the gas constant and the molecular weight of air, both of which the declared constants table does carry.",
  "From the standard barometric base of 14.700000 psia and one density call at that pressure.",
  "From the published file, which carries the offset beside the water density the fan constant implies."],
 "An ideal-gas density is inversely proportional to absolute temperature, so with two densities at two temperatures the offset is the only unknown left. It comes back as 459.670000 degR.")

q(1, "The fan constant is written against a water density this module never states. Why does moving that constant in the engine and in the oracle together still fail a gate?",
 "The oracle's fan route goes through pascals and reads no customary constant at all.",
 ["The published file pins the constant by literal.",
  "The engine reports the implied density on every fan answer.",
  "The two files carry the constant at different precisions, so moving both leaves them disagreeing."],
 "The implied density of 62.303335 lb per ft3 is a measurement rather than a citation, and the gate asserts it. One of the two files never read the constant, which is what makes the assertion bite.")

q(3, "This module carries 3 layout angles across 4 pass counts, and at one area of 980.000000 ft2 the second and third layouts return identical figures in all four pass counts. What does the engine do about it?",
 "It compares the two constant rows as data, reports them equal and attaches a note to any answer at either layout.",
 ["It refuses the second of the two layouts, so that a caller cannot enter an input that does nothing.",
  "It reports the bundle diameter once and leaves the shell diameter null for the second of the two.",
  "It records the pair in the held register and returns the layout it was given without a note."],
 "An input that does nothing is worse than an absent one when it looks live, because a reviewer reads a filled box as a decision. The engine gate asserts the equality so the two rows cannot drift apart and start looking meaningful.")

q(2, "At the same area and pass count the bundle runs 19.000124 inches at one layout and 20.698071 inches at another, a ratio of 1.089365. What does that pair show?",
 "That the layout input is not decorative in general, so the note names the pair it is inert between.",
 ["That the two layouts the note calls identical do move the bundle after all, by about 9 percent.",
  "That the bundle diameter depends on the pass count rather than on the layout angle.",
  "That the shell clearance of 2.500000 inches is added twice at one of the two layouts."],
 "The ratio is taken as the second figure over the first. The pair the note calls inert is a different pair, and every figure in it agrees exactly.")

q(0, "At the studio clearance of 2.500000 inches the shell is 21.500124 inches and at no clearance it is 19.000124. What does the difference show?",
 "That the clearance is added once.",
 ["That the clearance is added once to the bundle and once again to the shell.",
  "That the clearance is a fraction of the bundle rather than a fixed addition to it.",
  "That the bundle diameter already carries half the clearance before the shell is formed."],
 "The difference is the clearance itself, and the figure at no clearance is the bundle diameter. The clearance is an input because it depends on the head type.")

q(1, "Before this engine was repaired, the hot-day block held the process outlet temperature fixed and scaled the duty by the ratio of two log means. Why could those two former behaviours not both be true?",
 "If the duty falls the outlet has to rise, because the process capacity rate does not change with the weather.",
 ["Because a ratio of two log means is always one, so the duty could never have moved at all.",
  "Because the old block read a coefficient, and a rating cannot see the coefficient and the area separately.",
  "Because the outlet was held at a value the old block took from the design ambient rather than the check ambient."],
 "That is history and it is what the engine used to do. The current answer satisfies all three of the duty, the outlet and the rise, at 18064516.1290 Btu an hour, 159.677419 degF and 27.096774 degF on the same row.")

emit(Q, '/root/wt-fc6-nextgen/tools/course-banks/heattransfer/advanced/fc6a_m05.json', expect_n=15)
finish()
