import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC8 Associate m01, One orifice run end to end. Digest sections 1, 2 and 3.

q(1, "The metering module reports 11 exported names. What tree was that count taken over, and what rule decided membership?",
 "Object.keys of the imported module, with every name it exports counting, functions and data alike, with no filter applied.",
 ["The functions a caller can usefully invoke, with the two data exports left out because a constant is not something anybody calls.",
  "The names the orifice flow path touches on one complete run, so a helper only the sizing search reaches falls outside the tree.",
  "The names the module documents in its own header comment, so anything exported and undocumented is outside the rule."],
 "The count is 11 and its rule takes every exported name with no filter, which is why the two data names sit in it alongside the nine functions."),

q(3, "Two of the metering module's exports are data rather than functions. Which two, and what does the second of them tell you before you have run anything?",
 "RG_REYNOLDS_BASIS and STRAIGHT_RUN_WITHHELD_FITTINGS, and the second announces that some straight-run fittings are withheld.",
 ["SIGMA_THRESHOLDS and VALVE_STYLE_PROVENANCE, and the second announces that the figures beside it are this engine's own stated table rather than a published one.",
  "FIRE_VENT_WITHHELD and RG_REYNOLDS_BASIS, and the first announces a capacity refused by name.",
  "STRAIGHT_RUN_WITHHELD_FITTINGS alone, since the module exports 9 functions and one data name."],
 "The module exports 11 names: 9 functions and 2 data, and the data pair is RG_REYNOLDS_BASIS and STRAIGHT_RUN_WITHHELD_FITTINGS."),

q(0, "Why does knowing the metering module well tell you nothing about the control valve module or the tank module?",
 "No module imports another, so a fact learned about one carries nothing over to the next by construction rather than by convention.",
 ["Because the three modules were written at different times and each settled on its own naming, its own units and its own way of reporting a refusal.",
  "Because the metering module is the only one of the three that returns a warning line.",
  "Because the counts differ: metering exports 11 names and the control valve module exports 16."],
 "The three modules stand side by side with no wires between them. That independence is structural, and it is why each tier of this course starts again."),

q(2, "On the ABOH result sheet the flowing density of 2.617800 lb/ft3 sits among the stated lines. What follows from that for every flow the run reports?",
 "Nothing in this module derives it, so it arrives as an input and every flow computed from it inherits whatever error it carries.",
 ["The engine recomputes it from the static pressure of 815.200000 psia and the specific heat ratio of 1.270000 before the equation sees it, so a typed density is only a starting guess.",
  "It is checked against the returned pipe Reynolds number of 2117151.4444, since a density and a viscosity that disagree would put that number outside the correlation.",
  "It is the one stated line the engine refuses on when it is implausible."],
 "Seven lines on this sheet are stated and nine are returned. The flowing density is stated, so it is the engineer's figure and the engine does arithmetic on whatever arrives."),

q(1, "The ABOH run returns a differential of 2.304922 psi alongside the stated differential of 63.800000 in H2O. What is the relationship between those two lines?",
 "They are the same differential, with the returned line carrying it in the units the flow equation works in.",
 ["The returned figure is the part of the stated differential that survives downstream of the plate, so the two differ by whatever the meter run gives back as the flow spreads out again.",
  "The stated figure is what the transmitter reads and the returned figure is what the equation computed it should have read, so a gap between them is the transmitter's error on the day.",
  "The returned figure is the differential after the expansibility of 0.999181 has been applied, which is why the two are not one figure in two units."],
 "One differential, two units. The engine converts the inches of water column it was given into psi and returns both, and the second is what the equation consumes."),

q(2, "The last two lines of the ABOH result carry no units: beta inside the published range comes back true and the warning comes back null. Why should an operator read those first?",
 "They say which kind of answer the sheet is carrying, and a flow figure that is still printed with either of them changed has stopped being trustworthy in the same way.",
 ["They are the only two lines that would be absent on a run the engine could not complete, so seeing them is the evidence the calculation converged.",
  "They decide whether the discharge coefficient of 0.602223 was computed or assumed, and an assumed one makes everything below it provisional.",
  "They record whether the plate is inside the small bore band, which decides which arithmetic produced the flow."],
 "A warning of null is a statement rather than an absence, and a published range flag of true says the coefficient is an evaluation of a published correlation. Both can come back differently while the flow is still printed."),

q(0, "The ABOH run returns a volume of 9398.0952 ft3/hr. What stops it being a sales quantity?",
 "There is no base pressure and no base temperature anywhere in this function, so nothing on that line is a standard volume.",
 ["The volume is returned to four decimals where a custody quantity would be carried to six, so the figure is a deliberately coarse screening number.",
  "It was computed from the mass flow of 24602.3337 lb/hr rather than measured, and a derived volume cannot be sold.",
  "The static pressure of 815.200000 psia was stated rather than returned, so the conditions the volume belongs to are an input."],
 "The engine names the line the volume at the flowing density on purpose. Custody work needs a stated base pressure and base temperature, and this function carries neither."),

q(3, "The ABOH run returns a pipe Reynolds number of 2117151.4444. What is that line doing on the sheet?",
 "It places the run on the correlation, which is one of the two coordinates the discharge coefficient is evaluated at.",
 ["It is the check on the stated viscosity of 0.012100 cP, because a Reynolds number the engine considers implausible is how a mistyped viscosity announces itself before it reaches the coefficient.",
  "It is the quantity the expansibility of 0.999181 is computed against, since a gas expanding through the plate is a compressibility question a Reynolds number reaches.",
  "It is a diagnostic with no part in the answer, printed so a reviewer can confirm the flow was turbulent before reading the rest of the sheet."],
 "A discharge coefficient is a value on a surface in beta and Reynolds number. The returned Reynolds number of 2117151.4444 is where this run sits along one of those two axes."),

q(2, "The factor that turns inches of water column into psi is a module-private constant in the metering module. How was the figure of 0.0361273 established without reading the source?",
 "The engine was asked for a differential in psi at two runs sharing no other input, and each returned differential was divided by the differential it was given.",
 ["The two published conversion factors for water at the usual reference temperatures were compared, and the nearer one adopted.",
  "The differential of 2.304922 psi was divided by the static pressure of 815.200000 psia on the one run.",
  "It is exported alongside RG_REYNOLDS_BASIS, so a screen can print it and a reviewer can read it."],
 "Run one gave 63.800000 in H2O returning 2.304922 psi and run two gave 17.900000 in H2O returning 0.646679 psi. Both divisions land on 0.0361273."),

q(1, "One run would already have produced a ratio of psi to inches of water. Why were two runs needed before the figure could be called a constant?",
 "Two runs at different differentials agreeing to every printed digit is evidence of a fixed factor with nothing else happening on the way.",
 ["A single run leaves the factor entangled with the stated fluid properties, so a second run at a different density is what cancels them and leaves the conversion standing on its own.",
  "The first run is the one the engine caches, so its returned differential can be a stored figure rather than a fresh computation.",
  "Two runs are what a bisection needs, since a private constant is found by halving the gap between a value that works and one that does not."],
 "The two runs share no other input and both give 0.0361273. One ratio is a ratio; two agreeing exactly is a constant."),

q(3, "What is the practical consequence of the inches of water conversion being module-private rather than exported?",
 "No screen prints it and no caller can pass a different one, so the only honest way to state it is to make the engine tell you.",
 ["A caller can override it for a transmitter calibrated on a different water reference, which is the usual way a metering package is matched to an instrument before a ticket is issued.",
  "The engine refuses any differential given in inches of water and asks for psi instead, which is the safest resolution when a conversion cannot be shown to the person relying on it.",
  "It is recomputed on every call from the stated flowing density, so a run on a different fluid carries a different conversion and the returned psi figure moves with the gas."],
 "A figure you cannot read is a figure you cannot argue with. The engine returned 2.304922 psi for 63.800000 in H2O and gave no reason, so the factor was measured instead."),

q(0, "The expansibility of 0.999181 appears on the ABOH sheet among the returned lines rather than the stated ones. Why does that matter to a reviewer?",
 "A returned factor can be read, quoted and argued with, where one buried inside a flow figure cannot be.",
 ["A returned factor is computed to six decimals while a stated one carries whatever precision was typed.",
  "Only a returned line enters the uncertainty budget, so a factor supplied by hand would drop out of it.",
  "A stated factor would need the specific heat ratio of 1.270000 printed beside it, and there is nowhere to put it."],
 "The engine computes the expansibility from the differential, the static pressure, the beta and the specific heat ratio and puts it on the result line so it can be checked."),

q(1, "A report quotes the ABOH mass flow of 24602.3337 lb/hr on its own. What has the report removed?",
 "The lines that say what kind of answer it is, including the published range flag, the warning line and the coefficient the flow was computed with.",
 ["The conversion of the differential into psi, which is the one step between the transmitter reading and the equation and the only place a unit error can hide unseen.",
  "The distinction between the mass flow and the volume of 9398.0952 ft3/hr, which are only comparable once the density is printed.",
  "The seven stated inputs, which are the only lines a reader would need to reproduce the calculation."],
 "A mass flow is one line of sixteen. The flag, the warning and the returned coefficient of 0.602223 are what tell a reader whether the flow is a published evaluation or something weaker."),

q(2, "The specific heat ratio of 1.270000 sits on the ABOH sheet as a stated line. Where did the engine get it from?",
 "From the engineer, because nothing in this module derives it from a composition, a pressure or a temperature.",
 ["From the static pressure and the flowing density, which between them fix the gas closely enough.",
  "From a default the engine holds for a gas export service, so the line prints even with no fluid properties supplied at all.",
  "From the returned expansibility of 0.999181, inverted to recover the ratio for the sheet."],
 "Stated and returned are different kinds of line. A stated figure is one you are answerable for, and the specific heat ratio is stated on this sheet."),

q(0, "A colleague defends a meter run by pointing at the flowing density on the calculation sheet. What is wrong with that defence?",
 "The flowing density is an input rather than the engine's work, so quoting it back proves only what was typed in.",
 ["The flowing density is returned rather than stated on this sheet.",
  "It is used only for the volume line, so it says nothing about the mass flow.",
  "The density of 2.617800 lb/ft3 is outside the band the correlation is published over."],
 "A returned line is the only kind you may quote back as a result. A stated line is a responsibility, and on this sheet the density of 2.617800 lb/ft3 is stated."),

emit(Q, '/root/wt-fc8-nextgen/tools/course-banks/metering/beginner/fc8b_m01.json', expect_n=15)
finish()
