import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC5 Expert m01, A Vessel Emptying Itself. Digest section 21.

q(2, "AFIESERE marches to 268.419002 s at an orifice of 1.250000 in and an end pressure of 145.000000 psia. Which part of that answer did the engine decide?",
 "None of it. The volume, both pressures, the gas properties, the orifice and the discharge coefficient are all stated, and the march returns what they demand.",
 ["The end pressure, which the march carries down to its own choked floor of 26.758009 psia before it stops.",
  "The time step of 0.100000 s, which the march recomputes at every station from the mass it has left.",
  "The discharge coefficient of 0.820000, which the march sets from the isentropic exponent the way it sets the gas coefficient C."],
 "Every sizing route in this module takes its case as an input and the march is the same. It has no opinion about which end pressure matters, which vessel governs, or whether the orifice typed is the one on the drawing.")

q(0, "Every blowdown call returns the pressure below which its choked assumption stops holding, and on AFIESERE that is 26.758009 psia. What can be measured out of that figure alone?",
 "The engine's default outlet pressure: the floor times the engine's own critical pressure ratio is 14.700000000000.",
 ["The final temperature of 340.807983 degR, because the floor and the end state are both fixed by the pressure ratio and the exponent.",
  "The universal gas constant of 1545.349000000000, which this floor is the only route to since the march exports it nowhere.",
  "The end pressure of 145.000000 psia the march was asked for, because a march always stops a fixed ratio above its own floor."],
 "Section 2 measures the same 14.700000000000 three separate ways and this is the third of them. Asking a routine a question whose answer is one constant and nothing else is how a figure it never exports gets measured.")

q(3, "Taken to an end pressure of 25.000000 psia the same call still succeeds, still returns a time, and attaches the engine's choked-flow warning. Which way is that time wrong?",
 "Optimistic. The march keeps assuming choked flow after the flow has stopped being choked, which overstates the rate and understates the time.",
 ["Conservative. Holding the choked assumption past the floor understates the rate, so the time returned is longer than the vessel would really take.",
  "Neither. The warning is about the final temperature of 232.011700 degR on that row, and the time is untouched by the assumption.",
  "Unreadable from the return. The warning names a condition without a direction, so the sign of the error has to be settled elsewhere."],
 "The engine's own last word on that row is `optimistic`. A vessel that appears to empty faster than it does is the direction that makes a design look safer than it is, which is why the sign is worth reading off the message rather than guessing.")

q(1, "The march reports a starting inventory of 3469.2925 lb. Rearranged against the stated volume, pressure, temperature, molecular weight and compressibility, what is left over?",
 "1545.349000000000 ft.lbf per lbmol degR, the universal gas constant this march stands on and never exports.",
 ["648.7449 lb, the inventory left at the end, because the mass balance closes on those same five stated inputs.",
  "The gas coefficient C, which the mass flow uses and which the module computes from the isentropic exponent alone.",
  "The time step of 0.100000 s, because the march sizes its step from the inventory it starts the run with."],
 "Nothing in the module exports that constant, so the start mass is the instrument that recovers it. A number you recovered is a number you can check, and a number you assumed will be wrong quietly.")

q(0, "A discharge coefficient of 0.600000 gives 366.839286 s and 1.000000 gives 220.103588 s. Those times are in a ratio of 1.666666542759 against a coefficient ratio of 1.666666666667. What does the gap measure?",
 "The march's own step error. The time runs inversely with the typed coefficient and nothing multiplies it.",
 ["A second coefficient inside the mass flow, applied on top of the typed one, which this ratio is the only way to see.",
  "The compressibility drifting along the path, which these two runs are placed either side of on purpose.",
  "Rounding in the printed figures, since a blowdown time prints to six decimals and a ratio of two of them to twelve."],
 "Two readings of one quantity. A caller's figure used once and unmultiplied gives exactly this: agreement to about a part in a million, with the residue belonging to the integration rather than to the handling of the input.")

q(2, "The digest builds a closed-form time from the engine's own gas coefficient, the recovered gas constant and the stated geometry, then prints the ratio of the marched time to it. What can that column catch?",
 "A discharge coefficient applied twice, a coefficient hidden inside the mass flow, or an isentropic exponent off by one.",
 ["A wrongly stated end pressure, because the closed form integrates between the two masses the caller asked for.",
  "An error in the thinning of the trajectory, since the closed form is assembled from the 270 stations the march returns.",
  "A compressibility drifting along the path, which the closed form allows to vary while the march holds it fixed."],
 "All three faults move the answer smoothly across every case at once, which is the one pattern a sanity check cannot see. A constant factor is invisible on a number and visible only against a second derivation of the same quantity.")

q(1, "AFIESERE took 2685 steps at a step of 0.100000 s and returned 270 stations. What do those three counts say together?",
 "The trajectory is thinned before it is handed back, to about one station a second here, and the step size and step count are returned so the thinning cannot mislead.",
 ["The march subdivided its way from 270 planned steps up to 2685 taken ones, which is what the returned counts exist to record.",
  "The 270 stations are the steps that advanced the clock and the rest were rejected by the inventory budget and retaken.",
  "The step was chosen to place one station a second, so the station count follows from it and a finer step returns more stations."],
 "2685 steps thinned to 270 stations is coarser than the march that produced it and fine enough to draw a curve with. Read what a route says about how it ran before you read what it returned.")

q(3, "Across all 270 AFIESERE stations the temperature falls from 545.000000 degR to 340.807983 degR and never turns. What is doing that?",
 "The gas left behind expands to fill the same volume at a lower pressure, and this march gives the vessel no heat in from the metal or the surroundings.",
 ["The gas leaving through the orifice carries enthalpy out with it, and the reported temperature is what the inventory has left after that loss.",
  "The gas throttles across the orifice, and the temperature each station carries is the throat temperature at that moment.",
  "The compressibility falls away as the pressure drops, and the temperature the march prints follows it down."],
 "The march takes the expansion as isentropic at the stated exponent and holds the compressibility constant at the stated value. Both are decisions rather than results, and the audit module names them as such.")

q(0, "AFIESERE returns 3469.2925 lb and 648.7449 lb, and the digest prints 0.813004 beside them. Which question does 0.813004 answer?",
 "How much of the starting inventory left, as a share of it.",
 ["How far the pressure fell, as 145.000000 psia over the 1240.000000 psia the vessel started at.",
  "How much of the march ran above the choked floor of 26.758009 psia before the warning would have fired.",
  "How much of the time limit of 7199.999985603571 s the run used up before it reached its end pressure."],
 "It is derived rather than returned: the two masses the march reports at the ends, differenced and divided. The stations themselves carry no mass at all, so an inventory profile is not a thing this call can be read for.")

q(2, "The march holds the compressibility constant along the path and assumes choked flow throughout. What does the validation oracle do about those two decisions?",
 "It makes both of them deliberately, so that what the published set checks is the march rather than the thermodynamics.",
 ["It relaxes both and integrates the real expansion, so the published difference between the two is the cost of the assumptions.",
  "It refuses the rows where either assumption is crossed, which is why the published block carries 5 rows rather than 7.",
  "It keeps the choked half and lets the compressibility vary, which is what the published relative difference of 1.062e-3 measures."],
 "A shared assumption narrows what a comparison can tell you, and saying so is the honest handling. The engine also names the pressure below which the choked half stops holding, so the assumption that can bite a particular run is readable off that run.")

q(3, "At a 2.0 in orifice the march returns 104.851242 s and the closed form of the same balance gives 104.851161 s, a ratio of 0.999999232099. What is that pair evidence for?",
 "That the march reproduces the exact integral of its own balance, with the residue being integration error.",
 ["That the closed form is the better of the two answers, and the march is quoted only because it returns a curve as well.",
  "That the exponent the march uses agrees with the one the published blowdown rows were generated at.",
  "That the orifice area enters the rate linearly, since the ratio holds across all four of the cases printed."],
 "The separable mass balance is what makes the closed form available: the rate of mass loss goes as the mass raised to (k+1)/2, so the time between two masses integrates exactly. This check and a convergence study answer different questions.")

q(1, "While the flow through the blowdown orifice is choked, the downstream pressure does not reach back through the throat to change the rate. What does that buy the march?",
 "One state variable, one rate and one step, because the rate is set by the upstream state and the throat alone.",
 ["Freedom from the back pressure entirely, since no field the call returns depends on what the header is at.",
  "An end pressure that stops mattering, so the march runs down to the choked floor of 26.758009 psia on every case.",
  "A discharge coefficient that absorbs the downstream condition, which is why a typed coefficient moves the time."],
 "It is the same result the Associate tier met on the valve, where the required area in critical flow did not move with the back pressure at the relief valve outlet at all. Here it also earns the march an assumption, which the engine states rather than hides.")

q(2, "You are handed a blowdown result and asked whether its flow assumption held over the run. Which returned field settles that, and against what?",
 "The pressure below which the choked assumption stops holding, read against the end pressure you asked for.",
 ["The count of steps that had to be subdivided, which goes above zero exactly when the march crosses that floor.",
  "The final temperature, because an end state below the floor no longer follows the isentropic relation.",
  "The step size the march used, because the step budget is written against the choked assumption."],
 "On AFIESERE the floor is 26.758009 psia against an end pressure of 145.000000 psia, and the warning field reads `null`. An answer taken well above the returned floor, with the warning read first, does not rest on that assumption at all.")

q(0, "Which of these AFIESERE figures is something the march worked out rather than something the caller stated?",
 "The starting inventory of 3469.2925 lb.",
 ["The vessel volume of 720.000000 ft3.",
  "The compressibility of 0.880000.",
  "The orifice of 1.250000 in."],
 "The stated case is the volume, both pressures, the temperature, the molecular weight, the isentropic exponent, the compressibility, the orifice and the discharge coefficient. The inventory is the first thing the march builds from them.")

q(3, "The digest prints 4.473650 min and -118.862017 degF on the AFIESERE row and marks both as derived. What does that label mean here?",
 "The engine returned a time in s and a temperature in degR, and the digest converted each into a second unit.",
 ["The engine returned both, and the label records only which of its fields carry a unit at all.",
  "Both came from the closed form rather than from the march, and are printed beside the marched figures for comparison.",
  "Both were read off the last station of the trajectory rather than off the top-level fields of the return."],
 "A derived figure is arithmetic on an engine return and the digest says so. What the engine handed back is 268.419002 s and 340.807983 degR, and those are the figures an answer should be recorded at.")

emit(Q, '/root/wt-fc5-nextgen/tools/course-banks/relief/advanced/fc5a_m01.json', label='fc5a_m01', expect_n=15)
finish()
