import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC4 Professional m03, acid gas removed by moles. Every figure is from digest
# Section 10 at the rendering that section prints, with the standard base and
# the minutes in a day read back from Section 2 the way lessons l02 and l04
# read them. THE THREE LOADING WORDS ARE KEPT APART: lean loading, rich loading
# and loading swing are three different quantities, and the engine returns no
# swing under any name.

q(1, "Where in the sweetening chain does a mole count first become a mass?",
 "At the last step of the chain, where the solution is turned into gallons.",
 ["At the inlet, because a mole percent is a mass fraction.",
  "At the gas rate, because a rate in MMscfd is a mass flow once the gravity is known.",
  "At the loading, because a loading is pounds on pounds."],
 "The gas carries a mole percent, the spec says what may stay, the difference is picked up mole by mole, and the loading is moles of acid gas per mole of amine. Everything before the gallons is counted rather than weighed.")

q(2, "UBIE arrives at 5.200000 mol percent CO2 and 1.400000 mol percent H2S and has to leave at 2.000000 and 0.000400. Which two of those four describe the gas?",
 "The inlet pair, 5.200000 and 1.400000, and the other two are a contract.",
 ["The CO2 pair, 5.200000 and 2.000000, and the H2S pair is the contract.",
  "The larger figure on each gas, 5.200000 and 2.000000, since a spec is the smaller.",
  "None of the four, because the engine derives all of them from the stream."],
 "The engine treats all four as inputs and picks none of them. The two spec figures carry most of the cost of the unit, and neither is derived from anything physical in this module.")

q(0, "What acid gas removal do the UBIE inlet and spec figures imply?",
 "4.599600000 mol percent, the two differences added.",
 ["3.200000 mol percent, the CO2 difference alone.",
  "1.400000 mol percent, the H2S at the inlet.",
  "2.000000 mol percent, the CO2 spec."],
 "It is 5.200000 less 2.000000, plus 1.400000 less 0.000400. The two acid gases are added and carried as one figure from there on, and neither difference on its own is the duty.")

q(3, "The two acid gases are added and carried as one figure. What does that assume?",
 "That a mole of H2S and a mole of CO2 load onto the amine on equal terms.",
 ["That H2S is the gas the loading limit was measured on.",
  "That the spec pair may be averaged into one figure.",
  "That the two molecular weights are close enough to merge."],
 "Whether a particular solvent behaves that way is not a question this module asks. The decision sits at the first step and everything after it sees one number.")

q(0, "At 88.000000 MMscfd, what does a removal of 4.599600000 mol percent put into the solution?",
 "10666.2009 lbmol a day.",
 ["4.599600000 lbmol a day.",
  "525.893013 lbmol a day.",
  "10666.2009 lb a day."],
 "The route runs from the rate in standard cubic feet a day, through the fraction of those that are acid gas, into pound moles by way of the standard cubic feet in a pound mole. The gallons a minute are a separate answer further down the chain, and the pound mole is a count rather than a weight.")

q(1, "The plant is turned down and the gas rate falls. Which figure does NOT move?",
 "The mole percent removed.",
 ["The pound moles of acid gas a day.",
  "The circulation in gpm.",
  "The regenerator duty in MMBtu an hour."],
 "A mole percent is intensive and describes the gas. Change the inlet or the spec and it moves; change the rate and it does not. The pound moles a day move with both, and the gallons and the duty follow the pound moles.")

q(3, "At what base does this module define a standard cubic foot?",
 "14.696000 psia and 519.670000 degR.",
 ["459.670000 degR.",
  "The pressure and temperature of the contactor.",
  "It defines none at all."],
 "The standard cubic feet in a pound mole, 379.483571856287, are derived from the gas constant at that base rather than quoted from anywhere, so there is only one base in play and nothing to disagree with.")

q(2, "What is the LEAN LOADING?",
 "What a mole of amine still carries as it comes back from the regenerator.",
 ["The weight percent of amine in the solution.",
  "The difference between the two ends of the loop.",
  "The lowest loading before a corrosion warning."],
 "It is an input. On UBIE it is 0.050000 mol of acid gas per mol of amine, and the rich loading at the other end of the loop is 0.480000.")

q(1, "The engine returns no loading swing under any name. How does a reader get one?",
 "By subtracting the lean loading from the rich, since the swing is a difference.",
 ["By reading it off the amine property table, which carries a customary swing on every row.",
  "By dividing the circulation by the acid gas rate, which is the step the swing sits in.",
  "By asking for it, since the engine forms one when a caller names the field."],
 "The swing is what each mole of amine carries round the loop and it is what sets the circulation. It is still not a figure the engine hands back, so a reader forms it from the two loadings and carries it themselves.")

q(0, "On UBIE the rich loading is 0.480000 and the lean loading is 0.050000. What is the LOADING SWING, and what does it do?",
 "0.430000000 mol per mol, and it sets the circulation.",
 ["0.050000 mol per mol, and it sets the circulation.",
  "0.430000000 mol per mol, and it is the ceiling corrosion sets.",
  "0.480000 mol per mol, and it is what the contactor delivers."],
 "The rich loading is a ceiling that corrosion sets and the swing is a throughput the regenerator buys. The swing is a difference the reader forms from the two loadings, and the engine returns it under no name at all.")

q(2, "The rich end is taken to 0.550000 on MDEA. What comes back?",
 "452.267991 gpm and 21.708864 MMBtu an hour, with a warning.",
 ["452.267991 gpm and 21.708864 MMBtu an hour, and nothing else.",
  "A refusal naming the customary limit of 0.500000.",
  "904.535983 gpm and 43.417727 MMBtu an hour, with a warning."],
 "A loading above a customary limit is a decision somebody may have taken deliberately, so the engine answers and says so on that answer. The swing on that row is 0.500000000.")

q(3, "A rich loading of 0.500000 in one table and a lean loading of 0.030000 in the other both report 502.519990 gpm and 24.120960 MMBtu an hour. Why?",
 "Both rows carry a swing of 0.450000000, and the circulation follows the swing.",
 ["Both rows sit on MDEA's customary rich limit, which is what the circulation uses.",
  "The two tables are one sweep printed twice, read from each end of the loop.",
  "The engine holds the circulation steady on any row that carries no warning."],
 "The engine is not tracking where the swing came from. Two different pieces of plant work, one in the contactor and one in the still, arrive in the balance as the same subtraction.")

q(2, "Taking the lean loading from 0.120000 to 0.010000 moves the circulation from 628.149988 to 481.136161 gpm and the regenerator from 30.151199 to 23.094536 MMBtu an hour. What is that table honestly for?",
 "It says how much solution a given lean loading has to move.",
 ["It says what it costs to strip the solution to each of those lean loadings.",
  "It says how far the lean end goes before the rich end is flagged for corrosion.",
  "It says what a leaner lean saves, which is why both columns fall together."],
 "The duty per gallon is a stated input, 800.000000 Btu on every gallon circulated, so the duty column is the circulation in other units. What it costs to reach a lean loading is a question for a rate-based still model, and the last column of that table, 0.048000000 MMBtu an hour per gpm, does not move down it.")

q(0, "Which figure turns pound moles of acid gas a day into pound moles of amine a day?",
 "The loading swing, 0.430000000 mol per mol.",
 ["The molecular weight, 119.160000 for MDEA.",
  "The strength, 45.000000 weight percent.",
  "The solution density, 64.883034 lb per ft3."],
 "It is the only step in that chain about the process rather than about the fluid. The molecular weight, the strength and the density come after it, and the minutes in a day, 1440.000000000, close the chain at 525.893013 gpm.")

q(1, "On UBIE the regenerator is 25.242865 MMBtu an hour. What can that figure not tell you?",
 "What it costs to reach one lean loading rather than another.",
 ["How large a reboiler the loop implies at the duty per gallon it was given.",
  "How much solution the loop moves, which is the gallons a minute beside it.",
  "Which amine the loop is running, which the duty per gallon carries with it."],
 "It is 800.000000 Btu on every gallon of 525.893013 gpm. It does not know the reboiler temperature, the reflux or the stripping steam, so it is a size rather than a cost.")

emit(Q, '/root/wt-fc4-nextgen/tools/course-banks/gasprocessing/intermediate/fc4i_m03.json', label='fc4i_m03', expect_n=15)
finish()
