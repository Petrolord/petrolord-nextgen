import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# carbon Expert m06, The Expert reading. Digest SECTIONS 20 and 22 read as one
# AGBOR programme, SECTION 25 (the held items H1 to H4 and the inputs row, as
# limits only) and SECTION 26 (what the two oracles recompute and by which
# route). Every figure is invented for this course; money is in US dollars.
# 15 questions.

q(0, "Which of these does SECTION 25 hold as a stated limit under H1?",
 "Which IPCC report a Nigerian operator files on is the owner's decision.",
 ["The engine ships the AR6 set as its default when no GWP is supplied.",
  "The course's set is the one a Nigerian operator is to file its inventory on.",
  "The AR5 values are retired from the digest and no longer printed beside it."],
 "H1 is held: the report is a regulatory reading left to the owner. No GWP ships with the engine, and both reports are printed side by side for the course.")

q(2, "SECTION 26 names two oracles in the engines repository. Where are their goldens asserted?",
 "By the engine test suites",
 ["By the course's capstone grader",
  "By the digest's computed-here lines",
  "By the Carbon Studio each time it runs"],
 "SECTION 26: two independent oracles in tools/validation/downstream recompute these modules by other routes, and their goldens are asserted by the engine test suites.")

q(1, "What does held item H3 state?",
 "Every escaped carbon atom is counted as methane.",
 ["Every escaped carbon atom is counted as CO2 at combustion.",
  "Escaped carbon is left out of the inventory.",
  "Escaped carbon is split by the fuel analysis."],
 "SECTION 25, H3: every escaped carbon atom is counted as methane (SECTION 5). It is a held item, taught as a stated limit and never graded.")

q(3, "SECTION 25 lists each rule in force with the section that prints it. Which rule does it place in SECTION 21?",
 "A curve with a claim above what its source emits returns meetsTarget none and says why",
 ["A refused measure is named in refusedMeasures and kept off the curve and its totals",
  "A year whose scheduled measures abate more than the baseline is refused by the path",
  "A saving, its price and its factor declared on different bases are refused outright"],
 "SECTION 25 places the over-claim rule, and the rule that a verdict is none while a claim acts on a source with no computed emission passed, in SECTION 21. The refusedMeasures rule prints in SECTION 19, the over-abatement refusal in SECTION 22 and the basis refusal in SECTION 23.")

q(2, "The curve prints additive false for the two heater measures. How does the path count them once they are live?",
 "Each in full, from its own start year",
 ["Only the larger one",
  "Neither, until sequenced",
  "Each at its tonnes less the other's claim"],
 "SECTION 22: each measure counts in full from its start year. Tune the fired heaters counts from 2027 and the Heat integration project from 2029, and by 2031 the abated column reads 15460.000 t, the curve's total.")

q(0, "By which route does oracle_carbonabatement.py recompute a measure's cost per tonne?",
 "Levelised from a year-by-year present value ledger",
 ["By the capital recovery factor the engine itself uses",
  "By explicit rank, the route it takes for the curve",
  "As a species ledger whose mass balance must close"],
 "SECTION 26: the cost per tonne LEVELISED from a year-by-year present value ledger where the engine uses a capital recovery factor; the curve by explicit rank. The species ledger is oracle_energyefficiency.py's combustion route.")

q(3, "Solar for purchased power is order 5 on the Agbor curve. In which year does it go live on the path?",
 "2028, a year before the Heat integration project",
 ["2030, a year after the Heat integration project",
  "2027, with Tune the fired heaters and the steam traps",
  "2031, the last start year among the six measures"],
 "Start years are inputs. SECTION 22 gives Solar for purchased power 2028 and the Heat integration project, order 3 on the curve of SECTION 20, 2029; the path goes by those years.")

q(1, "How does oracle_energyefficiency.py model the steam trap?",
 "As an isentropic nozzle, its throat at the larger of the downstream and critical pressures",
 ["By the choked and subsonic flux formulas that the engine itself uses for the trap",
  "As a duty ledger, the route the oracle takes for the tuning saving",
  "By bisection on the downstream pressure, the route it takes for excess air"],
 "SECTION 26: the steam trap as an ISENTROPIC NOZZLE with its throat at the larger of the downstream and critical pressures, where the engine uses the choked and subsonic flux formulas. The duty ledger is the tuning saving's route and bisection is the excess air route.")

q(2, "What are H1 to H4 in this course?",
 "Limits, taught as stated and never graded",
 ["Rules in force, each shown with a figure",
  "Figures to compute with at the owner's rates",
  "Rules in force, each with its section"],
 "SECTION 25: HELD, taught as stated limits and never graded. The rules in force are printed in tables of their own, each as the engine answers now with the section that prints it, and H1 to H4 are not among them.")

q(1, "Which figure is both the Agbor curve's totalAbatementTonnes and the path's abated tonnes in 2031?",
 "15460.000 t",
 ["13610.000 t",
  "12060.000 t",
  "7410.000 t"],
 "SECTION 20 prints totalAbatementTonnes 15460.000, and SECTION 22's 2031 row prints 15460.000 t abated with all six measures live. 13610.000 t is the 2030 row, 12060.000 t the curve with one measure refused, and 7410.000 t the 2029 row.")

q(1, "Two outputs of the Agbor curve are on SECTION 26's list of what neither oracle recomputes. Which two?",
 "The residual to target and paysForItselfTonnes",
 ["The rank order and the costs per tonne it ranks",
  "The residual to target and the path's year ledger",
  "The weighted average and the explicit rank order"],
 "Both curve outputs sit on SECTION 26's closing list beside carbonIntensity, compositeCurve and the simple payback: taught from the engine and never graded. Rank order has an oracle route of its own.")

q(3, "How does oracle_carbonabatement.py compute combustion?",
 "By mass, in exact rationals",
 ["As a ledger, the route it takes for the inventory",
  "As a species ledger whose mass balance closes",
  "By bisection on the stack oxygen reading"],
 "SECTION 26: combustion by MASS in exact rationals (kg of carbon times the CO2/C and CH4/C mass ratios, molar masses built from atomic weights). The ledger is its route for the inventory, the species ledger is oracle_energyefficiency.py's combustion route, and bisection is that oracle's route for excess air.")

q(2, "The engine finds the pinch from a cascade. Which route does the efficiency oracle take to it?",
 "By the largest heat deficit, with no cascade",
 ["By the problem table cascade the engine uses",
  "As a loss ledger, the route for efficiency",
  "By bisection, the route it takes for excess air"],
 "SECTION 26: the pinch by the LARGEST HEAT DEFICIT with no cascade. The loss ledger is the efficiency route and bisection the excess air route; SECTION 25 lists the engine's rule that only an interior zero of the cascade is a pinch.")

q(3, "SECTION 22 prints the full Agbor baseline less the partial one as 10988.000 tCO2e. What does it say that figure is?",
 "The purchased electricity line of SECTION 21",
 ["The heaters' emission passed to the curve",
  "The vented and fugitive methane line",
  "The gap between the two end-year targets"],
 "SECTION 22: the full baseline less the partial is 10988.000 tCO2e (computed here), the purchased electricity line of SECTION 21: the partial inventory is the full one without it. The heaters are passed as 34927.743 tCO2e and the vented line is 2622.400 tCO2e.")

q(0, "Flare gas recovery goes live on the Agbor path in 2030. What emissions and target does the path print that year?",
 "42490.276 t emitted, against a target of 46483.086 t",
 ["48690.276 t emitted, against a target of 48887.383 t",
  "42490.276 t emitted, against a target of 41674.491 t",
  "40640.276 t emitted, against a target of 44078.788 t"],
 "In the 2030 row, emissions are the baseline less 13610.000 t abated, 42490.276 t, and the straight-line target stands at 46483.086 t. 48690.276 and 48887.383 t are the 2029 row, 41674.491 t the 2032 target and 40640.276 t the emissions from 2031.")

emit(Q, '/root/wt-et-carbon-nextgen/tools/course-banks/carbon/advanced/cefa_m06.json', expect_n=15)
finish()
