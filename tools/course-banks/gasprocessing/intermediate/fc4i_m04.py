import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC4 Professional m04, three amines and what separates them. Every figure is
# from digest Section 11, which carries the property set, the three amines put
# through one duty, the two ratio columns and the catalogue refusal. The
# corrosion warning is read from Section 10, where this tier already met it.

q(0, "What does the molecular weight column of the amine property set do in the circulation chain?",
 "It turns moles of amine into pounds of amine.",
 ["It turns pounds of amine into pounds of solution.",
  "It turns moles of acid gas into moles of amine.",
  "It turns pounds of solution into gallons of solution."],
 "It is the one column that is chemistry and nothing else. The strength turns amine into solution, the swing turns acid gas into amine, and the solution density turns pounds into gallons.")

q(2, "Which column of the property set is the only one derivable from something outside this package?",
 "The molecular weight.",
 ["The typical strength.",
  "The customary rich limit.",
  "The customary duty per gallon."],
 "The strengths, the rich limits, the duties and the gravities are customary practice with no publication behind them in this repository. They are declared constants, and pinning them is all a check can do.")

q(1, "What does the property set carry for MDEA?",
 "119.160000, 45.000000 weight percent, a rich limit of 0.500000, 800.000000 Btu a gallon and a gravity of 1.040000.",
 ["105.140000, 28.000000 weight percent, a rich limit of 0.400000, 950.000000 Btu a gallon and a gravity of 1.020000.",
  "61.080000, 18.000000 weight percent, a rich limit of 0.350000, 1100.000000 Btu a gallon and a gravity of 1.010000.",
  "119.160000, 45.000000 weight percent, a rich limit of 0.400000, 950.000000 Btu a gallon and a gravity of 1.040000."],
 "Each row is a coherent set: an amine at its own strength, loaded to its own limit, regenerated at its own duty, in a solution of its own density. The DEA and MEA rows carry their own five figures, and a set that borrows a rich limit and a duty from a neighbouring row describes nothing real.")

q(3, "A caller names MDEA and says nothing about strength. What does the engine use?",
 "45.000000 weight percent, the row's own typical figure, and it reports which it used.",
 ["45.000000 weight percent, and it reports nothing back about the choice.",
  "The strength of the previous call, since the property set holds no default.",
  "It refuses, because the strength is an input with no default on any row."],
 "Each figure in the table is a default rather than a fixed property. Type a strength and the engine uses that instead, and the answer says which strength was applied either way.")

q(2, "Why can the three printed circulations not be used to isolate the effect of strength?",
 "Each row is computed at its own strength and its own rich limit, so two properties move together.",
 ["The circulations are printed at one strength, so the column carries no variation at all.",
  "Strength enters after the gallons are formed, so it cannot move a circulation.",
  "The strengths are declared rather than measured, so no comparison between them is meaningful."],
 "A difference between two rows is the combined effect of a different strength and a different loading limit, and nothing in the printed answer separates them. Holding everything and moving one input is what the panel is for.")

q(0, "Strength appears in both answers the sweetening package returns. How?",
 "It sets the gallons, and the regenerator is priced per gallon, so one typed number lands in both.",
 ["It sets the gallons, and it is then applied a second time to the duty per gallon before the hours are formed.",
  "It sets the duty directly, and the gallons follow from the duty once the duty per gallon is divided out.",
  "It sets the loading swing, which the gallons and the duty both read."],
 "Strength is a dilution: it carries an amount of active chemical into a much larger amount of liquid. The duty follows the gallons through the same step rather than through a second application.")

q(3, "What follows from the rich limit being offered as the default rich loading?",
 "The out of the box answer for any amine sits exactly on the customary limit.",
 ["The out of the box answer carries the corrosion warning on every one of the three amines.",
  "The out of the box answer sits below the limit by the lean loading.",
  "The default rich loading is the same on all three rows of the table."],
 "A design taken straight from the defaults is already at the edge of customary practice, and moving in the only direction that adds margin costs circulation. No warning is raised at the limit itself.")

q(1, "The MDEA corrosion warning is read from both sides. What do the two rows show?",
 "0.500000000 answers with no note and 0.500001000 answers with the warning attached.",
 ["0.500000000 answers with the warning and 0.500001000 refuses.",
  "0.500000000 refuses and 0.500001000 answers with no note.",
  "Both rows answer with no note, because the limit belongs to MEA."],
 "The limit itself is accepted and a millionth past it is flagged, which is the right way round. A guard that refuses its own stated limit is as wrong as one that lets nonsense through.")

q(2, "A rich loading of 0.550000 is run on MDEA. Which description of the answer is right?",
 "A circulation and a duty come back with the note attached.",
 ["A refusal comes back, naming the customary limit.",
  "A circulation comes back and the duty is withheld.",
  "A circulation and a duty come back and the note is raised once a session."],
 "The row reports 452.267991 gpm and 21.708864 MMBtu an hour and carries the note on that answer. Running rich is a decision an operator may take deliberately, so the engine has no standing to refuse it.")

q(0, "The three amine rows carry a column of MMBtu an hour per gpm, at 0.066000000, 0.057000000 and 0.048000000. What is that column?",
 "The duty per gallon of the property set in other units.",
 ["A fourth property of each amine, measured out of the engine.",
  "The ratio of each amine's duty to MDEA's duty on the same case.",
  "The regenerator duty each amine needs on one gallon of acid gas."],
 "Divide each amine's customary duty by the minutes in a day and multiply by the minutes in an hour, and the same number comes back. When a ratio of two outputs turns out to be an input you already had, the ratio carries no information.")

q(3, "The sweetening package is asked for DIPA. What comes back?",
 "A refusal naming DIPA and listing MEA, DEA and MDEA.",
 ["A refusal naming DIPA and nothing else.",
  "The MDEA row, since it is the nearest tertiary amine.",
  "An answer with every amine property left null."],
 "This is the one catalogue lookup in the module and it says it does not know. A reader gets the correction and the catalogue in one line, without going to the source.")

q(1, "What would a lookup that fell back to a default amine have produced instead?",
 "A complete and plausible answer for a solvent nobody asked about.",
 ["A refusal raised one step further down the chain, where the missing property is first read.",
  "An answer with the amine name left null in it.",
  "The same answer as one of the three rows, since the properties of the three sit close together."],
 "Nothing in the module lets a caller add a fourth row, so a solvent outside these three has to be worked by hand. That is a scope boundary rather than a defect, and the refusal is what makes it visible.")

q(2, "The same duty is put through all three amines. Which pair of figures belongs to DEA?",
 "934.163599 gpm and 53.247325 MMBtu an hour.",
 ["994.638143 gpm and 65.646117 MMBtu an hour.",
  "502.519990 gpm and 24.120960 MMBtu an hour.",
  "934.163599 gpm and 65.646117 MMBtu an hour."],
 "MEA moves 994.638143 gpm and MDEA moves 502.519990 gpm on the same duty. Pairing the DEA circulation with the MEA regenerator describes a row that does not exist.")

q(0, "MEA over MDEA is 1.979300649 on circulation and 2.721538393 on duty. Why do the two ratios differ?",
 "Circulation is set by the rich limit and the strength, and duty adds the duty per gallon.",
 ["Circulation is a mole balance and duty is a mass balance, so the two carry different bases.",
  "The circulation ratio is taken on one case and the duty ratio across the whole property set.",
  "Duty is a ratio of two engine figures and circulation is a ratio of two declared ones."],
 "The same ordering is reached by two routes, so the gaps between the amines are different sizes on each. Quote 1.979300649 to somebody sizing a pump and 2.721538393 to somebody sizing a reboiler.")

q(1, "A learner leaves this module quoting the ranking of the three amines as the solvent decision. What have they read wrongly?",
 "The engine, because everything a selection usually turns on sits outside these three rows.",
 ["The table, because the three rankings it carries do not agree with each other.",
  "The ratios, because a ranking taken on circulation reverses when it is taken on duty.",
  "The duty column, because the ranking it gives is the reverse of the circulation ranking."],
 "The module does not separate CO2 from H2S, has no input for degradation, reclaiming or foaming, and carries no rate-based absorber model. The three orderings do agree, and that is exactly what makes the ranking look like a decision.")

emit(Q, '/root/wt-fc4-nextgen/tools/course-banks/gasprocessing/intermediate/fc4i_m04.json', label='fc4i_m04', expect_n=15)
finish()
