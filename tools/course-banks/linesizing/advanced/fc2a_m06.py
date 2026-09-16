import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC2 Expert m06, The Expert Reading. Digest section 18.

q(1, "Three readings close this tier: what a line costs in pressure, what wall a code demands of it, and what it holds. What is the relation between those three answers?",
 "Not one of them can be derived from the other two, so a reader who knows the pressure drop knows nothing about the wall and a reader who knows the wall knows nothing about the slug.",
 ["The pressure drop sets the other two, since a design pressure follows from the loss along the line and the volume follows from the bore the loss was computed over.",
  "The wall sets the other two, since it fixes the internal bore that both the velocity and the line volume are then computed from, once an outside diameter has been stated.",
  "The volume sets the other two, since bore and length are the only geometry any of the three chains uses and both of the others read that geometry out of it."],
 "A loss of 25.660631 psi, a required wall of 0.419231 in at Class 3 and a line volume of 1633.5349 bbl are three separate results. Each needs inputs the other two never ask for.")

q(2, "The OGBIA hydraulic reading and the OGBIA volume reading are two separate answers about one line. What do the two chains actually share?",
 "The bore of 7.981000 in and the length of 26400.000000 ft, which is the whole of the overlap between them.",
 ["The velocity of 2.244621 ft/s, which the volume chain takes as the speed the sphere is driven along the same 26400.000000 ft at.",
  "The Reynolds number of 48431.2523, which the volume chain reads to decide whether the bore was running full before it reports 1633.5349 bbl.",
  "The density and the viscosity, which the volume chain needs in order to turn the cubic feet of the bore into the 1633.5349 bbl it reports."],
 "A line volume is geometry and nothing else. Everything the hydraulic chain adds, a rate, a density and a viscosity, is absent from the volume and from the run.")

q(0, "The wall reading quotes 0.419231 in at Class 3 and 0.329327 in at Class 1 on the SOKU pipe. What are those two figures, and what is the 0.375000 in beside them?",
 "They are required walls, the steel somebody orders, and 0.375000 in is the wall the mill actually rolled, which rates back to 1019.607843 psig.",
 ["They are pressure walls, the steel that holds the design pressure of 1200.000000 psig, and 0.375000 in is the corrosion allowance the code adds on top of whichever of the two applies.",
  "They are the walls at the two ends of the class table, and 0.375000 in is the mean of the four.",
  "They are the walls before and after the temperature derate, and 0.375000 in is the wall that would be required if the derate on this pipe were 1.000000 rather than the value it carries."],
 "0.294231 in and 0.204327 in are the pressure walls on the same two rows. A design wall is a requirement and the rolled wall is a fact.")

q(3, "The volume reading returns 1633.5349 bbl held, 2.444444 hours for a crossing and 98.0121 bbl every 3.7997 days. Which of those is pure geometry?",
 "Only the 1633.5349 bbl. The run rests on a stated pig speed and the sweep and the interval rest on a stated holdup.",
 ["The 1633.5349 bbl and the 2.444444 hours both are, since a length over a speed uses no fluid property at all, and only the sweep rests on a number somebody stated.",
  "All three are, since no density, viscosity or pressure enters any of them, and the holdup of 0.060000 is a property of the bore rather than of the flow inside it.",
  "Only the 2.444444 hours is, since a volume in barrels rests on the 5.6145833333333 cubic feet per barrel and a conversion factor is a stated number in the same way a holdup is."],
 "Bore and length give 1633.5349 bbl and nothing else enters. The speed of 3.000000 ft/s and the holdup of 0.060000 are both handed in from outside.")

q(2, "The OGBIA duty runs at 2.244621 ft/s against an erosional ceiling of 13.545709 ft/s and uses 0.165707 of it. What does that fraction settle, and what does it leave open?",
 "It settles that the line is nowhere near its erosional limit, and it leaves open how conservative that limit is, because the c factor behind the ceiling is held for the literature.",
 ["It settles that the bore could be reduced until the fraction approached 1.000000, and it leaves open only what the pressure drop would become at the higher velocity that followed.",
  "It settles that the erosional check is the constraint governing this line rather than the friction loss, and it leaves open whether the pressure drop of 25.660631 psi is acceptable over 26400.000000 ft of it.",
  "It settles the velocity the sphere will be driven at, since a pig travels at whatever fraction of the erosional ceiling the fluid ahead of it is using, and it leaves open only the holdup the sphere will find."],
 "The three c factors of 100.000000, 125.000000 and 175.000000 are held. An erosional velocity at a stated c factor is a complete answer to a stated question.")

q(0, "The tier's second three modules did not add a new answer about any line. What did they add?",
 "They changed what a number means: where the correlations stop, what a refusal is, and what the method does not know.",
 ["They added the audit figures themselves, such as the jump of 1.603040 and the implied friction factors, which are results about the line in the same sense as its pressure drop.",
  "They added the guards, since a boundary read on both sides is a new answer at each limit.",
  "They added provenance, which is a fourth reading beside the other three."],
 "A friction factor that jumps 1.603040 times, a Colebrook curve answering outside its fit, four forms that never check their own regime, and two iterations that never report convergence.")

q(3, "In the capstone the wall chain has to be run in a particular order. What comes first and what is asked of what?",
 "The wall is sized from the design pressure, the outside diameter and the yield under a code and a class, and then the rating is asked of the wall the mill actually rolled.",
 ["The rating is read first off the wall the mill rolled, and the design pressure that comes back is what the wall is then sized against under the code and the class.",
  "The pressure wall and the required wall are sized together and the rating is asked of the required wall, since that is the wall the design specified and the one the line is held to.",
  "The corrosion allowance is applied first to the outside diameter, and the wall is then sized from the reduced geometry so that the rating and the sizing use one pipe."],
 "Two numbers come out of the sizing and they are not interchangeable. The design wall is a requirement and the rolled wall is a fact, and the two separate the moment the mill rounds.")

q(1, "The volume chain runs bore and length to a volume, volume and holdup to a sweep, length and speed to a run, and sweep against a catcher to an interval. What follows from that shape?",
 "Each step needs only the step before it, so an error early travels the whole way down without ever being contradicted.",
 ["Each step needs every step before it, so an error is caught where two inputs fail to reconcile.",
  "The run time is the only step outside the chain, so an error in the bore reaches the volume, the sweep and the interval but is caught by the run, which reads the length alone.",
  "The interval closes the chain by returning the holdup it implies, so a bore or a length that was wrong shows up as an implied holdup that does not match the one supplied."],
 "Check the bore and the length before anything else, because both the volume and the run depend on them. Nothing downstream can disagree with a figure it inherited.")

q(2, "Four inputs in this tier are stated conditions rather than results and each has to travel beside the figure it produced. Which four?",
 "The location class with its code, whether the allowance was respected in the rating, the holdup, and the pig speed.",
 ["The design pressure, the outside diameter, the specified minimum yield and the corrosion allowance, which are the four arguments Barlow cannot proceed without.",
  "The c factor, the efficiency, the roughness and the resistance sum, the four held items.",
  "The bore, the length, the dropout rate and the slug limit, which are the four inputs the volume chain needs before it can return an interval."],
 "The wall is meaningless without its class and code, the swept volume is a straight multiplication by the holdup, and the run time is a length divided by the speed.")

q(3, "The capstone asks for figures at the precision the engine returned them. What are the conventions?",
 "Liquid work to six decimals, barrels and hours and days to four, and counts as whole numbers.",
 ["Liquid work to four decimals, barrels and hours and days to six, and counts as whole numbers, since a volume carries more significant figures than a pressure.",
  "Everything to six decimals, since that is the precision the wall and the pressure figures are printed at and a single convention avoids a rounding argument.",
  "Everything to the precision of the least precise input, which for the pigging chain is the holdup of 0.060000 and therefore six decimals throughout."],
 "Quote what the engine returned rather than a rounding of it. Gas rates, Reynolds numbers, barrels, hours and days print to four decimals.")

q(0, "A step in the capstone chain returns an object carrying an error string. What should be reported for that step?",
 "The error itself, because a refusal is a result and writing a number where the engine declined to produce one is the worst available answer.",
 ["The last value the chain produced before the refusal, since the error names the input that was missing and the previous step is the answer the engine did reach.",
  "A null, since that is what a refusal serialises to and it records that no figure was available without asserting anything about what the figure would have been.",
  "The figure computed by hand, since the refusal is about the guards rather than about the physics."],
 "If any step returns an object carrying an error, that error is the answer to give. A caller checks a property rather than catching.")

q(1, "No graded figure in this course rests on a held item. What makes that claim checkable rather than merely asserted?",
 "The c factor, the efficiency, the roughness, the resistance sum, the location class and the holdup are stated conditions wherever they appear, so an answer can be checked against the condition.",
 ["The held items are excluded from the engine entirely in the graded chains, so a graded figure cannot reach one even if a caller supplies it.",
  "The graded tolerances are set wider than the range a held item could move an answer over, so a held item cannot change whether a graded figure scores.",
  "Each graded figure is confirmed against the golden oracle, which works in SI and carries no held item at all, so agreement proves the held items played no part."],
 "That turns a held item from a hidden dependency into a stated condition. A reader who wants to check an answer can check it against the condition rather than against an unsourced table.")

q(3, "The tier ends with a three-way question to ask of any figure. What is it, and why are the three answers different?",
 "Whether it was computed, copied or assumed, because a computed figure moves when its duty moves, a copied figure never moves at all, and an assumed figure moves when somebody changes their mind.",
 ["Whether it was computed, measured or golden, because only the first of those moves with the duty and the other two are fixed records of a case that has already been run.",
  "Whether it was computed, held or refused, because the three are the classes of return this engine produces and every figure in the course belongs to exactly one of them.",
  "Whether it was computed, converged or printed, because an unconverged iterate and a rounded print both look identical to a computed figure once they are written down."],
 "A swept volume looks computed and is half assumed. A c factor looks like a standard and is copied. A friction factor from inside the band between 2100 and 4000 came from a correlation not written for it.")

q(0, "Four things in this domain live in other engines. Which, and what does each handle?",
 "A network solve for lines sharing a header, a live-oil flowline upstream of separation, the vessel that catches a slug, and the whole multiphase half that supplies a holdup.",
 ["A network solve for lines sharing a header, the wall a code demands, the vessel that catches a slug, and the whole multiphase half that supplies a holdup.",
  "A network solve for lines sharing a header, a live-oil flowline upstream of separation, the erosional ceiling of 13.545709 ft/s, and the friction factor the four gas forms assume.",
  "A live-oil flowline upstream of separation, the vessel that catches a slug, the transmission efficiency, and the outlet-pressure solve that marches a profile down a hill."],
 "Each of those is a seam rather than a gap. The work exists and is simply not in this chain, and a number crossing one of those seams should be named as having crossed it.")

q(2, "The tier closes on one habit. What is it?",
 "Read what sits beside the number: a regime word, an error string, a stated class, a stated holdup.",
 ["Recompute every figure at a second duty, since a computed figure moves with its duty and a copied one does not, and the pair distinguishes them.",
  "Quote every figure to the precision the engine printed it at, since the precision is what records which chain the figure came out of.",
  "Check every figure against its golden, since an independent implementation in another unit system is the only test available inside this package."],
 "Nearly every trap in this tier is sprung by taking the number and leaving the qualifier behind. The qualifier is the cheaper half to carry and the half that survives review.")

emit(Q, '/root/fc-wip-linesizing/banks/fc2a_m06.json', expect_n=15)
finish()
