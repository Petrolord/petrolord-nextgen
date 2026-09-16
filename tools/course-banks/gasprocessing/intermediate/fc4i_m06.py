import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC4 Professional m06, the Professional reading. Figures from digest Section
# 19, which is this module's own section, with the stage figures as Section 9
# prints them. The cold end is named as a scope boundary and carries no figure,
# because those figures belong to the tier above this one.

q(2, "One sour column is read three ways in this tier. Which three?",
 "A mole balance, a stage relation and a vessel.",
 ["A mole balance, a mass balance and a vessel.",
  "A stage relation, a tray hydraulic check and a vessel.",
  "A mole balance, a stage relation and a regenerator heat balance."],
 "Not one of the three can be derived from the other two. The regenerator duty is part of the mole balance answer rather than a fourth reading, since it is the circulation priced per gallon.")

q(0, "Read as a mole balance, what does UBIE need?",
 "525.893013 gpm of solution, on a regenerator of 25.242865 MMBtu an hour.",
 ["10666.2009 gpm of solution, on a regenerator of 25.242865 MMBtu an hour.",
  "525.893013 gpm of solution, on a regenerator of 0.976783371 MMBtu an hour.",
  "502.519990 gpm of solution, on a regenerator of 24.120960 MMBtu an hour."],
 "The 10666.2009 is the lbmol a day the balance starts from and 0.976783371 is the removal the same column reaches as a staged device. The last pair belongs to a rich loading of 0.500000 rather than to UBIE.")

q(3, "Read as a staged device at an absorption factor of 1.600000, what does the same column give?",
 "0.976783371 removed at 6.000000 stages, and 7.746472598 stages for a removal of 0.990000.",
 ["0.976783371 removed at 6.000000 stages, and 5.658211483 stages for a removal of 0.990000.",
  "0.990000 removed at 6.000000 stages, and 7.746472598 stages for a removal of 0.976783371.",
  "0.922576074 removed at 6.000000 stages, and 3.140202390 stages for a removal of 0.990000."],
 "The 5.658211483 belongs to an absorption factor of 2.000000 at the same spec, 0.922576074 to a factor of 1.2 at six stages, and 3.140202390 to a removal of 0.900000 at 1.600000.")

q(1, "Read as a vessel, what does the same column come to?",
 "4.208602 ft across, on a gas weighing 3.831017 lb per ft3 that may not rise faster than 1.035597 ft per s.",
 ["4.208602 ft across, on a gas weighing 3.424553 lb per ft3 that may not rise faster than 1.318455 ft per s.",
  "3.192661 ft across, on a gas weighing 3.831017 lb per ft3 that may not rise faster than 1.035597 ft per s.",
  "4.208602 ft across, on a solution weighing 64.883034 lb per ft3 that may not rise faster than 1.035597 ft per s."],
 "The gas is at 985.000000 psia and 112.000000 degF. The 3.424553 and 1.318455 belong to OBIAFU, and 64.883034 lb per ft3 is an MDEA solution density rather than a gas density.")

q(0, "Which of the three readings makes no use of the gas rate at all?",
 "The stage relation, because a removal is a fraction of whatever arrives.",
 ["The vessel, because a diameter is set by the velocity and the density.",
  "The mole balance, because a mole percent is an intensive property.",
  "None of them, because all three are extensive answers about one column."],
 "The mole balance turns on the rate at the step that makes lbmol a day, and the vessel is sized on the gas that has to pass through it. Only the stage relation does not know a rate exists.")

q(2, "A spec no real column could meet is handed to the mole balance. What happens?",
 "It returns a circulation for it without hesitating.",
 ["It refuses, naming the removal the spec implies.",
  "It returns a circulation and attaches the ceiling as a warning.",
  "It returns a circulation and the stage count the spec would need."],
 "Reaching the spec is not the question the mole balance was asked. Whether the spec is reachable is the stage relation's answer, and the two calls do not consult each other.")

q(1, "What can a stage count not do?",
 "Size a pump.",
 ["Say whether a spec is reachable.",
  "Compare two designs against one spec.",
  "Say which dial is binding on a column."],
 "The stage relation says whether the spec is reachable and how much separation difficulty it represents. It says nothing about how many gallons a minute it takes to get there.")

q(3, "Which chosen inputs sit behind the vessel answer?",
 "The K value and the liquid density.",
 ["The absorption factor and the stage count.",
  "The swing, the strength and the duty per gallon.",
  "The gas gravity and the compressibility."],
 "The swing, the strength and the duty per gallon sit behind the mole balance, and the absorption factor sits behind the staged reading. The gravity is a property of the stream and the compressibility is computed from it.")

q(0, "In what unit does this tier write a loading?",
 "Moles of acid gas on each mole of amine.",
 ["Weight percent of the circulating solution.",
  "Pounds of acid gas a gallon.",
  "A fraction of the acid gas arriving."],
 "A weight percent is the strength of the solution, a fraction between zero and one is a removal, and the acid gas picked up is counted in lbmol a day. Four quantities, four units, and none of them substitutes for another.")

q(1, "Why can a removal and a mole percent never substitute for one another?",
 "A removal is a fraction between zero and one and a mole percent is a percentage.",
 ["A removal is measured on the solution and a mole percent on the gas.",
  "A removal is an engine answer and a mole percent is always a typed input.",
  "A removal carries the gas rate and a mole percent does not."],
 "Both are typed inputs somewhere in this tier and both describe the gas side. What separates them is the unit, and a figure written in the wrong one answers a different question.")

q(2, "Why does this tier ask for figures at the precision the engine prints?",
 "A rounded restatement of an engine answer cannot be told apart from an invented number.",
 ["A rounded figure falls outside the tolerance every graded field carries.",
  "The engine refuses any figure that carries fewer decimals than it printed.",
  "Rounding changes the unit, and the unit is what the marking reads."],
 "Rounding on the way to an answer also carries the error forward into every step after it. Quote what the engine returned and round at the end, if at all.")

q(3, "A removal of 0.976783371 is quoted with nothing beside it. What is missing?",
 "The absorption factor of 1.600000 and the stage count of 6.000000 it belongs to.",
 ["The gas rate and the pressure the column was run at, which every figure in this tier depends on.",
  "The swing and the strength the solution was carrying.",
  "The K value and the liquid density of the same vessel."],
 "The same relation at another factor gives a different figure that is equally correct and was not what was asked. Every circulation, duty and diameter in this tier is conditional in the same way, and on a different set of chosen numbers.")

q(1, "A question states an amine strength that differs from the property table's own. Which figure is used?",
 "The stated one, and the table figure is a distractor.",
 ["The table one, since it is the amine's typical value.",
  "Whichever of the two is nearer the customary band.",
  "Both, because the answer reports the strength it used."],
 "The property table's strengths, rich limits and duties are defaults, and a question is free to state its own. A figure produced from a different set of conditions is simply a different train.")

q(2, "The engine declines a spec set above the inlet. What is the right answer to write?",
 "That it declines, and why.",
 ["The circulation the inlet alone implies.",
  "A zero circulation, since nothing has to be removed.",
  "The nearest spec the engine would have accepted."],
 "When the engine declines, the decline is the answer. A lean loading at or above the rich is refused by name, and a removal a starved absorber cannot reach is refused with the ceiling and the remedy attached.")

q(0, "Which module in this package computes a Joule-Thomson coefficient?",
 "This one, and the Flow Assurance engine asks a caller to type one in.",
 ["Flow Assurance, and this module takes one as a typed input.",
  "Both, and the two are checked against each other at the seam.",
  "Neither, because the coefficient is a chart value in this package."],
 "That is why the tier above this one is where a learner finds out what number to type into the other app. Flow Assurance owns the coefficient as a subject and owns hydrates outright, and nothing in this engine computes a hydrate boundary.")

emit(Q, '/root/wt-fc4-nextgen/tools/course-banks/gasprocessing/intermediate/fc4i_m06.json', label='fc4i_m06', expect_n=15)
finish()
