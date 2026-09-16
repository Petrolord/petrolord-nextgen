import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC3 Professional m06, the Professional reading. This bank assembles the
# tier rather than re-asking it: every question crosses two of m01 to m05 or
# turns on what the course holds and what it grades. Section 17 is read again
# here in words; no figure outside digest Sections 6 to 10 is quoted.

q(2, "Four quantities, all of them printed by this tier's engines. Only one may be written down as a result. Which?",
 "NPSH available, because every term in it is arithmetic the engine defines and performs.",
 ["The required margin, because both halves of the rule behind it were measured out of the engine.",
  "A trimmed head, because the engine returns the ideal figure beside the real one so a reader can see the de-rating.",
  "A corrected flow, because the correlation behind it is checked at sixty digits by this wave's oracle."],
 "Measurable is not the same as sourced. The margin rule, the trim shortfall and the viscosity correction each have no publication in this repository.")

q(0, "The floor of 3.000000000 ft and the fraction of 0.350000000 are quoted to nine decimal places in a course that grades nothing on them. Why bother?",
 "They are the best rule available here and the one the engine applies, so a reader should know them exactly and know equally well that neither has a source.",
 ["They will become gradeable once a publication is found, and quoting them now saves re-cutting the tier later.",
  "They are measurable, and a measurable figure is sourced by the measurement, which is what the nine decimals record.",
  "They are quoted at that precision because the required NPSH at which they change places is a recurring decimal, and a shorter quote of either half would not reproduce it."],
 "Both halves are measurable out of the engine and the rule itself is customary. Knowing a rule exactly and knowing it is unsourced are two separate pieces of knowledge.")

q(1, "Two ways of moving a pump curve sit side by side in this tier. Which of them can a graded figure come from, and why?",
 "The speed change, because the affinity laws are exact and the engine prints the subtraction that says so.",
 ["The trim, because its shortfall model is stated in full and its boundaries were bisected out of the engine.",
  "Both, because the engine returns ideal and real columns for the trim and the ideal column is the exact law.",
  "Neither, because both rest on the band of speed ratios the engine reports without comment."],
 "The speed law is not held. The shortfall model is, because the engine's own comment calls it \"the published shortfall\" and names no publication.")

q(3, "A change of 0.800000 is proposed and three flows appear in the working: 987.562375 gpm, 943.122068 gpm and 695.297235 gpm. Which is the flow the pump will run at?",
 "695.297235 gpm, the crossing of the trimmed curve with a system that did not move.",
 ["987.562375 gpm, which is the flow the affinity laws give for a ratio of 0.800000.",
  "943.122068 gpm, which is the trimmed machine's own flow once the shortfall has been applied to it.",
  "None of them, because a duty needs a required NPSH stated beside it before it can be quoted."],
 "987.562375 gpm is the ideal flow of that trim and also the flow of a speed change to 0.800000. 943.122068 gpm is the real flow, and it is a point on the new curve.")

q(0, "A candidate writes a margin in gpm and a viscosity in rpm. Which reading habit would have caught both?",
 "Confirming the unit of every figure before writing it, since heads and margins are in feet and a viscosity is in centistokes.",
 ["Quoting every figure to six decimals, since the engine prints pump work at that precision and a wrong unit changes the decimal count.",
  "Checking the figure against the published cases, since a quantity in the wrong unit will not match any of them.",
  "Reading the warning field first, since the engine flags a figure whose unit does not match the field it was written into."],
 "Suction and vapour pressures are in psia, flows in gpm, power in brake horsepower, and ratios, factors and quotients are dimensionless.")

q(2, "The margin check refuses an available head it cannot read, and the machine combinations refuse a count that is not a whole number. What do those two refusals have in common?",
 "Each is a returned object whose message names the input that defeated it, rather than a value invented over it.",
 ["Each is raised after the arithmetic has run, so the figures are still on the return beside the message.",
  "Each is a pass flag set to false, which is how this package reports an input it cannot use.",
  "Each names the same input, since a count and an available head are both read through the finiteness test."],
 "One needs a finite available NPSH and the other a whole number of machines. Where the engine declines, the decline is the answer.")

q(3, "The tier is built on the idea that a duty point which works on paper fails in three ways. What are they?",
 "On suction, on change and on the fluid.",
 ["On suction, on power and on the fluid.",
  "On change, on the fluid and on the count of machines.",
  "On suction, on change and on the region the duty lands in."],
 "The suction side, the affinity laws and the trim, and the fact that a catalogue curve is a water curve.")

q(1, "What is true of every one of the items this course holds for the literature?",
 "Each is used by the engine, each is printed in the course, and none of them decides a graded answer.",
 ["Each is kept out of the engine, so a reader meets it only as a named seam of the course.",
  "Each is graded at a wider tolerance, chosen from the size of the disagreement behind it.",
  "Each is replaced by a default that the engine applies whenever a caller states nothing."],
 "Holding an item means teaching it as a limit. Both halves of the margin rule are measurable and the rule is customary all the same.")

q(3, "Four things are absent from these engines altogether. Which absence explains why a suction margin cannot be judged without knowing the flow?",
 "There is no required-NPSH-against-flow curve anywhere in the package.",
 ["There is no seal calculation and no bearing calculation anywhere in the package.",
  "There is no compressor surge line, surge margin, recycle valve or anti-surge control.",
  "There is no machine curve, wheel selection, valve dynamics or rod loading."],
 "The vendor curve has to be read at the duty flow before the margin means anything. A required figure read at the wrong flow is a real number off a real curve at a duty the pump is not running at.")

q(1, "What does this course claim to answer?",
 "The duty a vendor should be quoting against, the power and the stage count to expect, the suction margin a selection has to survive, and the reasons behind all four.",
 ["The duty, the power, the region the duty lands in and the margin that makes a selection acceptable, with the reasons behind each.",
  "Everything a selection package answers, since the two studios run these chains live and the engines behind them are vendored whole.",
  "The duty and the power only, since the suction side and the stage count both rest on held rules."],
 "That is a smaller claim than a selection package usually makes, and every figure in the course stands behind it.")

q(0, "Padding the OKONO drum takes the available head from 31.040865 ft to 131.659135 ft while the vendor's required NPSH stays at 16.000000 ft. What moves in the margin check across that sweep, and what does not?",
 "The margin and the ratio move; the required margin holds at 5.600000 ft and the severity stays adequate.",
 ["The margin, the ratio and the required margin all move, since the required margin is a fraction of what is available.",
  "The margin moves and the ratio holds, since the ratio is the boundary figure the rule turns on.",
  "The margin moves and the severity walks through all three labels, since the sweep spans a wide range of available head."],
 "The required margin is a function of the required NPSH alone. Nothing on the sweep moved it, so every row stands against the same figure.")

q(2, "Two unsourced models sit in this tier, one on a change and one on a fluid. What does holding them cost?",
 "No trimmed flow, head or shortfall and no corrected flow, head or efficiency can be a graded answer.",
 ["Neither model can be taught, so both appear only as a named seam of the course.",
  "Neither model can be run, so the engine returns the catalogue values wherever one would apply.",
  "Both are graded at a wider tolerance than the rest of the course, chosen from the size of their disagreement."],
 "The trim's implied efficiency ratio is held with the model it falls out of, and the corrected figures with the correlation behind theirs.")

q(1, "16 published cases sit beside the 22 exported functions of these two modules, and on two of them the engine reads 43.590588 ft against a golden 43.573343 ft and 62.791667 ft against a golden 62.758690 ft. What do those cases establish about the engine?",
 "That its arithmetic is the arithmetic those cases describe, and no more, because every one of them was written by an oracle.",
 ["That its answers have been checked against measured pump tests and vendor performance runs, which is what those two quotients measure.",
  "That it is wrong on both of those cases, since a published figure is the answer and 1.000395783 and 1.000525448 are the size of the error.",
  "That the correlations behind them describe a real machine, which is the whole reason a package publishes its cases beside its own answers."],
 "The goldens were written through a different route at a water density their own oracle states, so a gate against one carries a tolerance chosen from the size of that disagreement, which is 0.0005254484459904507 at its largest. There is no measured pump test, no vendor performance run and no field compressor datasheet anywhere in this course.")

q(0, "A candidate cannot remember whether a required margin is graded and writes a plausible figure. What should they have done?",
 "Left it, because nothing in this course is graded on a held item and a guessed figure is worse than an absent one.",
 ["Written the figure the engine returns at the stated required NPSH, since the rule is applied whether or not it is sourced.",
  "Written the boundary ratio instead, since a dimensionless figure carries no unsourced units.",
  "Written the available head in its place, since the two are the same quantity judged against different references."],
 "No required margin, pass flag or severity, no trimmed flow, head or shortfall, and no corrected flow, head or efficiency is ever the answer.")

q(3, "One figure in this tier is assembled from parts and another is solved as a crossing. Which is which?",
 "52.808173 ft is assembled from a pressure head, a static column and a friction; 1131.756344 gpm is a crossing.",
 ["52.808173 ft is a crossing of the suction survey with the vendor curve; 1131.756344 gpm is assembled from scaling factors.",
  "Both are assembled, since the crossing is built from a fitted curve and a system curve stated through a friction head.",
  "Both are solved, since the suction side is solved for the head at which the liquid stops flashing."],
 "One is a sum the engine prints on the row. The other is where two curves meet, and it moves when either of them does.")

emit(Q, '/root/wt-fc3-nextgen/tools/course-banks/rotating/intermediate/fc3i_m06.json', expect_n=15)
finish()
