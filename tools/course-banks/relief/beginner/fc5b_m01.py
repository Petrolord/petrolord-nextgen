import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC5 Associate m01, What A Relief Valve Is Sized For. Written from digest.txt
# Sections 1, 2 and 3, which are the four lessons of this module: the four
# questions one studio answers, the three pressures behind every area, the one
# sense of back pressure this course uses, and the units and the measured
# leading constants this engine speaks.

q(1, "The Relief and Flare Studio answers four questions over one facility. Which four are they?",
 "What orifice a pressure safety valve needs, what load a pool fire puts on it, what drum keeps liquid out of the flare header, and how long a vessel takes to depressure.",
 ["What orifice a pressure safety valve needs, what load a pool fire puts on it, what pressure the flare tip can accept, and which contingency on a vessel governs the size.",
  "What set pressure a protected vessel is entitled to, what load a pool fire puts on it, what drum keeps liquid out of the flare header, and how long a vessel depressures.",
  "What orifice a pressure safety valve needs, what relief load each contingency puts on it, what drum keeps the flare header dry, and what setback the flare tip demands."],
 "A set pressure is stated by the caller rather than worked out, a setback belongs to the separation course, and nothing here ranks one contingency against another."),

q(3, "Every sizing route in this module takes a relief load as an input except one. Which route computes its own load, and from what?",
 "The API 521 fire case, from the geometry of the vessel, a drainage answer and an environment factor that the caller states.",
 ["The gas and vapour route, from the relieving pressure and the gas properties, since a choked throat fixes a mass flux.",
  "The steam route, because saturated steam at a stated pressure is a defined state the published equation folds up.",
  "The liquid route, from the differential across the valve and the specific gravity, which together fix a rate."],
 "A choked throat and a defined steam state both fix a flux rather than a load, and the liquid route sizes for a rate it was handed. Only the fire case builds a load, and even then the drainage answer and the environment factor are stated."),

q(0, "Reading the module counts 22 exports. How do they divide?",
 "Seven return a bare number and signal a refusal with NaN, twelve return an object, two are published tables and one is a derived constant.",
 ["Twelve return a bare number and signal a refusal with NaN, seven return an object, two are published tables and one is a measured constant.",
  "Seven return a bare number and throw on a refusal, twelve return an object, two are published tables and one is a derived constant.",
  "Seven return a bare number and signal a refusal with NaN, twelve return an object, and three are published tables with a constant inside each."],
 "The split is seven bare numbers against twelve objects, with two tables and one derived constant beside them. Nothing in this module throws, and the constant is derived rather than typed."),

q(2, "A caller guards every call with a test on the returned `error` field. What does that guard fail to catch?",
 "A non finite number arriving in a returned object with no `error` field beside it.",
 ["An object with an `error` string whose other fields are all finite.",
  "A bare number export returning NaN, which such a test is written to see.",
  "A published table returning fewer rows than the caller expected of it."],
 "The contract is a finite result or an object carrying an `error` string. The failure the guard cannot see is the pairing it does not cover, a non finite number with no error beside it, which is why every route is audited against both halves."),

q(1, "One refusal in this module carries more than an `error` string. Which, and what else does it carry?",
 "The orifice selection past the largest orifice, which also returns `multipleOfT`, a whole number of valves.",
 ["The steam route above the top of its published range, which also returns the last correction it was able to evaluate.",
  "The liquid route below the certified envelope, which also returns the device class the correction suggests instead.",
  "The gas route with an out of range coefficient, which also returns the bound that coefficient fell outside."],
 "Every other refusal in this module carries the `error` alone. A caller that stops at the `error` throws away the only figure that refusal worked out, which is how many of the largest orifice the area needs."),

q(0, "ORUBIRI states a set pressure of 420.000000 psig and an overpressure of 10.000000 percent. What is the relieving pressure?",
 "476.700000 psia, the set pressure raised by the overpressure fraction and converted with the measured atmospheric constant.",
 ["The set pressure raised by the overpressure fraction and left as it stands, since that figure is already an absolute pressure.",
  "The set pressure converted to absolute with 14.700000000000 psia first, and the overpressure fraction applied to the result.",
  "476.700000 psig, the same arithmetic reported in the gauge unit the set pressure was stated in."],
 "The overpressure is applied to the gauge set pressure and the atmospheric constant is added afterwards. The gas route needs that pressure absolute, so the answer is in psia."),

q(3, "The same load and valve are run at four overpressure allowances. What does the sweep show?",
 "A larger allowance raises the relieving pressure and lowers the required area, and all four rows stay on the same flow branch.",
 ["A larger allowance raises the relieving pressure and raises the required area, and all four rows stay on the same flow branch.",
  "A larger allowance raises the relieving pressure and lowers the required area, and the branch turns over between the third row and the fourth.",
  "A larger allowance leaves the relieving pressure alone and lowers the required area, because only the differential across the valve moves."],
 "The area falls from 2.223779 in2 to 1.964194 in2 as the allowance rises from 10.000000 to 25.000000 percent, and every row is reported critical, so no change of regime is confounding the reading."),

q(2, "Three quantities elsewhere on this platform are called back pressure. Which one does this course mean?",
 "The pressure at the relief valve outlet, in the header the valve discharges into.",
 ["The choke setting that a managed pressure drilling system holds on the annulus return.",
  "The term the Rawlins and Schellhardt equation fits on a gas well test.",
  "The pressure a flare tip imposes on the whole collection system upstream of it."],
 "The choke setting and the deliverability term are the two senses this platform already carries elsewhere. Here it is the outlet pressure on the valve, and it is written that way at every mention."),

q(0, "The ORUBIRI outlet pressure reaches the engine in three renderings: 35.000000 psig, 49.700000 psia and 0.104258. Which one does the branch decision read?",
 "0.104258, the absolute outlet pressure as a fraction of the relieving pressure.",
 ["49.700000 psia, because the branch decision is a comparison between two absolute pressures.",
  "35.000000 psig, because the gauge figure is the one a plant document and an instrument both carry.",
  "All three in turn, since the decision is made once in each unit and the three answers are required to agree."],
 "The decision reads a ratio. The two pressures are what that ratio is built from, and a learner who moves an outlet pressure and watches nothing happen has usually moved a number the comparison does not read directly."),

q(1, "AKASO states a set pressure of 310.000000 psig, an overpressure of 10.000000 percent and an outlet pressure of 40.000000 psig. What does the liquid route work on?",
 "A differential of 301.000000 psi, between a relieving pressure of 341.000000 psig and the stated outlet pressure.",
 ["A relieving pressure of 341.000000 psia, converted with the atmospheric constant before the outlet pressure is subtracted from it.",
  "A differential between the relieving pressure and the atmospheric constant of 14.700000000000 psia, since the header is open to atmosphere.",
  "A differential between the stated set pressure and the stated outlet pressure, with the overpressure allowance applied afterwards."],
 "The liquid route takes both pressures in psig and works on their difference, so the atmospheric constant never enters it. The allowance is applied before the subtraction, which is what puts the relieving pressure at 341.000000 psig."),

q(2, "Which statement about the pressures the two routes take is correct?",
 "The gas route is the only one that takes an absolute outlet pressure, and the liquid route works on a difference of two gauge pressures.",
 ["Both routes take absolute pressures, and the liquid route converts its stated gauge figures on the way in.",
  "The gas route takes a gauge outlet pressure and the liquid route an absolute one, which is why only the liquid route needs the atmospheric constant.",
  "Both routes work on a difference, so neither of them needs a datum and neither carries the atmospheric constant."],
 "A mass flux through a throat depends on an absolute upstream pressure, and a pressure drop is indifferent to the datum. Mixing the two conventions goes wrong by about one atmosphere, which is small enough to read as a rounding difference."),

q(3, "The atmospheric constant of 14.700000000000 psia is not exported. How is it established?",
 "By asking the engine three questions whose answer is that constant and nothing else, one of them through the blowdown march, and all three return it.",
 ["By reading it off the module source, where it sits as a named constant beside the leading constants of the four routes.",
  "By subtracting a stated gauge set pressure from the absolute relieving pressure the engine returns for the same case.",
  "By taking the published value the standard states and confirming that the engine agrees with it to twelve decimals."],
 "This digest never types a number the engine keeps to itself. It arranges a call whose only possible answer is that constant and says which call, and here three separate arrangements agree, one of them in the blowdown march own choked flow floor."),

q(1, "Which of these figures does the engine take as a typed input rather than compute?",
 "The balanced bellows back pressure factor Kb, which is a published chart.",
 ["The subcritical factor F2, which is published as a two axis chart.",
  "The critical pressure ratio, which is a published table against k.",
  "The viscosity correction Kv, a published curve on Reynolds number."],
 "F2, the critical pressure ratio and Kv are all closed forms this engine evaluates on the inputs it was given. The typed set is Kb for gas, Kw for liquid, the superheat factor KSH and the API 526 orifice table."),

q(0, "Four leading constants were measured out of this engine. Which figure belongs to which route?",
 "520.000000000000 leads the gas coefficient, 735.000000000000 the subcritical form, 38.000000000000 the liquid equation and 51.500000000000 the steam one.",
 ["520.000000000000 leads the gas coefficient, 735.000000000000 the steam equation, 38.000000000000 the liquid one and 51.500000000000 the subcritical form.",
  "735.000000000000 leads the gas coefficient, 520.000000000000 the subcritical form, 51.500000000000 the liquid equation and 38.000000000000 the steam one.",
  "520.000000000000 leads the gas coefficient, 735.000000000000 the subcritical form, 2800.000000000000 the liquid equation and 51.500000000000 the steam one."],
 "Each was recovered by arranging a call in which every other factor is one. The 2800.000000000000 belongs to the liquid Reynolds relation rather than to the area equation in front of it."),

q(2, "At what precision does this course report a required area, a flow and a measured constant?",
 "An area to six decimals, a flow to four and a measured constant to twelve.",
 ["An area to four decimals, a flow to six and a measured constant to twelve.",
  "An area to six decimals, a flow to six and a measured constant to four.",
  "An area to twelve decimals, a flow to six and a measured constant to six."],
 "Areas, pressures and dimensionless ratios print to six decimals, flows and duties to four, and measured constants to twelve. Quoting a figure at a precision nobody declared is how two correct readings come to look like a disagreement."),

emit(Q, '/root/wt-fc5-nextgen/tools/course-banks/relief/beginner/fc5b_m01.json', label='fc5b_m01', expect_n=15)
finish()
