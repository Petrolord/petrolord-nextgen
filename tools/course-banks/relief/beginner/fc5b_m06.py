import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC5 Associate m06, The Associate Reading. Written from digest.txt Section 11
# and the computed against typed paragraph of Section 2, which are the four
# lessons of this module: one scenario end to end, computed factors and typed
# ones, the walk a capstone reading follows, and what the next tier changes.

q(2, "Three relief cases on one train are gathered on one page, one gas, one liquid and one steam. What is the first thing that table teaches?",
 "That three different fluids and three different published equations produce one identical shape of answer.",
 ["That the three cases can be ranked against each other by load, which is how the governing case on a train is chosen.",
  "That the three required areas stand in a relationship this engine works out for itself and then prints as a ratio.",
  "That the three cases protect one vessel, so exactly one of them is the size that vessel is built to."],
 "A load and a set of conditions arrive, a relieving pressure is worked out, one factor is computed and one is typed, a coefficient is stated, and out comes an area, a letter and a margin. The digest states only that these are three relief cases on one train, and it ranks nothing among them."),

q(1, "Which pairing of a computed factor with a typed one is correct?",
 "Gas has a critical ratio computed and Kb typed, liquid has Kv computed and Kw typed, steam has KN computed and KSH typed.",
 ["Gas has Kb computed and a critical ratio typed, liquid has Kw computed and Kv typed, steam has KSH computed and KN typed.",
  "Gas has a critical ratio computed and Kc typed, liquid has Kv computed and Kd typed, steam has KN computed and Kb typed.",
  "Gas has a critical ratio computed and Kb typed, liquid has Kw computed and Kv typed, steam has KN computed and KSH typed."],
 "Each route carries exactly one correction the engine derives and exactly one it takes on trust. Kc and Kd are stated coefficients on every route rather than the typed chart factor of any one of them."),

q(3, "On the three streams the computed factors come back as 0.551208, 0.984776 and 1.021727. Which is which?",
 "0.551208 is the gas critical ratio, 0.984776 the liquid Kv and 1.021727 the steam KN.",
 ["0.551208 is the gas back pressure ratio, 0.984776 the liquid Kw and 1.021727 the steam KSH.",
  "0.551208 is the liquid Kv, 0.984776 the steam KN and 1.021727 the gas critical ratio.",
  "0.551208 is the gas critical ratio, 0.984776 the steam KN and 1.021727 the liquid Kv."],
 "The gas back pressure ratio on that stream is 0.104258 rather than 0.551208, and Kw and KSH are the typed factors, both stated at 1.000000. A correction above one shrinks an area and a correction below one grows it."),

q(0, "Why is the relieving pressure on the liquid column printed in psig while the other two are printed in psia?",
 "Because the liquid equation works on a differential, which is indifferent to the datum.",
 ["Because the liquid route is the only one whose set pressure is stated in gauge.",
  "Because a liquid relieving pressure is always below one atmosphere absolute anyway.",
  "Because the liquid route applies the atmospheric constant after the correction rather than before it."],
 "Every set pressure in this tier is stated in gauge. The difference is what the route needs afterwards: a mass flux through a throat needs an absolute upstream pressure, and a pressure drop does not."),

q(2, "What can be said about the three loads of 68000.0000 lb/hr, 860.0000 gpm and 94000.0000 lb/hr?",
 "They are not comparable with each other, because a volumetric rate and a mass flow are different quantities.",
 ["They can be ranked, since the steam load is the largest of the three and is therefore the governing case on the train.",
  "They can be compared once the liquid rate has been converted, using the specific gravity that the case already states.",
  "They are three readings of one load, taken at the three points on the train where it is measured."],
 "The three columns cannot be ranked by load and nothing in the digest offers a conversion between them. The required areas are comparable, because they are the same quantity in the same unit."),

q(0, "Two of the three streams end at the L orifice from required areas of 2.223779 in2 and 1.867758 in2. What does that show?",
 "The ladder at work, since there is nothing between K and L to buy.",
 ["A coincidence about the plant, since two unrelated cases rarely need the same valve.",
  "That the two cases carry the same margin, since they select the same purchased area.",
  "That the liquid area was rounded up to the gas one before the selection was made."],
 "The purchased area is 2.853000 in2 on both, and the rung under it at 1.838000 in2 is too small for either. Nothing about the plant put them together and nothing about the two cases is alike."),

q(1, "Which list is entirely computed by this engine?",
 "The coefficient C from the exponent, the critical ratio from the exponent, F2 from the exponent and the ratio, Kv from the Reynolds number, and KN from the pressure.",
 ["The coefficient C from the exponent, the critical ratio from the exponent, F2 from the exponent and the ratio, Kv from the Reynolds number, and Kb from the ratio.",
  "The coefficient C from the exponent, the critical ratio from the exponent, Kw from the differential, Kv from the Reynolds number, and KN from the pressure.",
  "The coefficient C from the exponent, KSH from the temperature, F2 from the exponent and the ratio, Kv from the Reynolds number, and KN from the pressure."],
 "Take the three wrong lists one at a time. Kb is read against a back pressure ratio on a chart rather than worked out from one, Kw is read the same way for liquid, and KSH is a table entry against a superheat state rather than a function of a temperature. None of the three is evaluated anywhere in this package."),

q(3, "What kind of number is Kd, and how is it treated?",
 "The valve manufacturer own certified discharge coefficient, always stated, with the engine defaults standing in as placeholders for it.",
 ["A published chart factor, always typed, read off its chart exactly as Kb and Kw are read.",
  "A closed form the engine evaluates from the fluid and the branch, reported on the return beside the area.",
  "A default of the engine, used as it stands, because a certified figure is a property of the standard rather than the device."],
 "It is measured on a real device on a test stand, which is why this course states it on every stream. The gas and steam streams state 0.975000 and the liquid stream states 0.650000."),

q(0, "What does the engine do with a coefficient handed to it that is above one?",
 "It refuses it, since a certified figure has to be above zero and no more than one to be usable.",
 ["It clamps it at one, the way the viscosity correction is clamped at one.",
  "It uses it and attaches a warning, because a coefficient above one is unusual rather than impossible.",
  "It uses it, because a coefficient above one is meaningful on the subcritical branch."],
 "A certified coefficient is a fraction of an ideal, above zero and no more than one, and a value outside that range is refused rather than quietly used. The clamp at one belongs to the viscosity correction rather than to a coefficient."),

q(2, "A reader is handed an answer they doubt. Why does sorting the numbers into computed ones and typed ones change what they go and look at?",
 "Because a computed factor is wrong only if its inputs or the implementation are, and both of those are checkable here, while a typed one can be read at the wrong condition or transcribed with two digits swapped.",
 ["Because a computed factor can be checked against the published chart it came from, while a typed one has no reference anywhere in the package.",
  "Because a typed factor is always the larger source of error, so the investigation starts there and usually ends there.",
  "Because a computed factor is validated by a published case, while a typed factor is validated by the suite pinning it as behaviour."],
 "Nothing in this engine can see a chart read at the wrong condition. The typed factors have their references named, and a published case on a route with a typed factor confirms the arithmetic around it rather than the table itself."),

q(1, "In the walk this tier teaches, when is the atmospheric constant added?",
 "Only where the route works in absolute pressures, which is the gas route and the steam route.",
 ["Only where the route works on a differential across the valve, which in this tier is the liquid route.",
  "On every route, because a relieving pressure is an absolute pressure by the definition this course uses.",
  "On no route, because the engine adds it internally wherever it is needed."],
 "The liquid route takes its two pressures in gauge and works on their difference, so the constant never enters it. Adding it there is how a liquid answer goes wrong by about one atmosphere."),

q(0, "On a steam case the walk says to read the correction the engine returned rather than assuming it from the pressure. Why?",
 "Because it steps at its published threshold and sits below one for an interval above that.",
 ["Because it depends on the superheat factor as well, which is typed rather than computed.",
  "Because it is recomputed on every pass of the loop, so only the returned value is final.",
  "Because it is held for literature, so the returned figure is the only statement of it the package makes."],
 "The correction is a closed form checked against the standard own SI statement, and nothing about it iterates. What makes it unassumable is the step and the interval below one."),

q(3, "What changes at the Professional tier?",
 "The load stops being an input, because the fire case computes its own from geometry.",
 ["The orifice table stops being typed, because the Professional tier derives the fourteen areas.",
  "The branch decision stops being read from a ratio, because the fire case is always choked.",
  "The certified coefficient stops being stated, because a fire case uses a published default."],
 "It starts with the wetted area of a vessel, takes that through a duty and a latent heat to a load, and runs the chain to an orifice letter with no load typed in anywhere. The table stays typed and the coefficient stays stated."),

q(1, "Which two things does this tier teach and never grade, and for what reason?",
 "The viscosity fit and the orifice letter, because one is an empirical fit the package cannot derive and the other a published table it can only check as behaviour.",
 ["The critical ratio and the orifice letter, because one is decided by an input the caller states and the other by a published table.",
  "The viscosity fit and the Napier correction, because both are published fits that the validation oracle shares with the engine.",
  "The superheat factor and the critical pressure ratio, because both are published table entries the package cannot derive."],
 "Grading a figure nobody in the package can derive would be grading a reader copy of a standard. The critical ratio and the Napier correction are both computed and both checked by an independent derivation."),

q(2, "A learner changes an outlet pressure on a gas case and the required area does not move. What should they check first?",
 "The branch, since a case below its critical ratio is choked and its area is fixed by the upstream condition.",
 ["The units, because a gauge outlet pressure fed to the gas route is wrong by about one whole atmosphere every time.",
  "The typed Kb, because the engine ignores it and attaches a warning whenever the outlet pressure moves.",
  "The convergence report, because an unfinished loop returns the area it started from."],
 "That flatness is correct behaviour rather than a broken tool. The ignored Kb belongs to the subcritical branch and the convergence report belongs to the liquid route."),

emit(Q, '/root/wt-fc5-nextgen/tools/course-banks/relief/beginner/fc5b_m06.json', label='fc5b_m06', expect_n=15)
finish()
