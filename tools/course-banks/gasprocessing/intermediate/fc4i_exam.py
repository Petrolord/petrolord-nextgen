import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC4 Professional tier exam, 42 questions across the six modules of the tier.
# Sections 9 to 12 and 19 of the digest, at the rendering those sections print.
# Nothing here touches the cold end, the marched let-down or the still
# overhead, which are the tier above this one, and no question carries a figure
# that only appears on a page this reader has not been given.

# --- m01, a contactor read as a staged device -------------------------------

q(2, "What does a theoretical stage claim about the hardware it stands for?",
 "Nothing at all, since only the equilibrium leaving it is specified.",
 ["That the gas and the liquid were in contact for a stated time on it.",
  "That one tray does the work of one stage at the service's efficiency.",
  "That the tray spacing is whatever the allowed velocity implies."],
 "Equilibrium leaving the stage is the only thing asserted. Everything mechanical about the vessel is left to whoever turns a count into steel.")

q(0, "Hand the Kremser relation an absorption factor and a stage count. What comes back?",
 "The fraction of the solute the column removes.",
 ["The circulation the column needs, in gpm.",
  "The diameter the column needs, in ft.",
  "The lbmol a day the solvent picks up."],
 "The relation is closed in all three of its variables, so the same expression rates a column that exists and sizes one that does not. A circulation and a diameter are separate calls.")

q(3, "In A = L / (V K), what is K?",
 "The equilibrium ratio of the solute between the two phases at the column's conditions.",
 ["The Souders-Brown K value of the vessel, in ft per s.",
  "The ratio of the rich loading to the lean loading on the solvent.",
  "The fraction of the solute the column is asked to remove."],
 "L is the solvent molar rate down the column and V is the gas molar rate up it. The factor is dimensionless and K is where the equilibrium sits.")

q(1, "Why does this module take the absorption factor as a typed input?",
 "None of L, V or K is an argument of any export in it.",
 ["The factor changes between the top and the bottom of a real column.",
  "The factor is a chart reading.",
  "The factor is returned by the sweetening call for the same stream."],
 "Equilibrium data comes from outside this engine. What it answers is what a stated factor buys, and where that factor came from belongs to whoever typed it.")

q(2, "A column runs at an absorption factor of 1.600000 with 6.000000 stages, and the relation returns 0.976783371. What is that a fraction of?",
 "The solute arriving in the gas.",
 ["The gas arriving at the column, in MMscfd.",
  "The solvent circulating round the loop.",
  "The acid gas the spec allows to stay."],
 "A fraction carries no unit and no rate. Two columns removing the same fraction of very different gas rates return the very same figure.")

q(0, "At an absorption factor of 1.000000 a spec of 0.900000 comes back as 9.000000000 stages. Which form produced it?",
 "N = f / (1 - f), the branch the inverse takes at unity.",
 ["N = log( (A - f) / (1 - f) ) / log(A) - 1, evaluated at A = 1.000000.",
  "N = A / (A - f).",
  "N = (1 - f) / f, the reciprocal of the branch."],
 "The general form is indeterminate at unity in both directions, so the inverse has to match the forward branch rather than the general form, and the golden carries a case there for that reason.")

q(1, "One stage at an absorption factor of 0.6 removes how much?",
 "0.375000000.",
 ["0.444444444.",
  "0.500000000.",
  "0.600000000."],
 "0.444444444 is one stage at 0.8 and 0.500000000 is one stage at 1. The factor itself, 0.600000000, is the ceiling that column approaches over 200 stages rather than what one stage reaches.")

# --- m02, what the absorption factor can buy ---------------------------------

q(3, "A spec of 0.990000 is asked of a column at an absorption factor of 2.000000. What stage count comes back?",
 "5.658211483.",
 ["7.746472598.",
  "3.140202390.",
  "5.025685103."],
 "7.746472598 is the same spec at 1.600000, and the other two are a removal of 0.900000 at 1.600000 and at 1.200000. A better supplied column needs fewer stages for one spec.")

q(2, "Two hundred stages at an absorption factor of 0.800000 reach what removal?",
 "0.800000000.",
 ["0.768995039.",
  "0.788365257.",
  "0.888888889."],
 "0.768995039 is eight stages and 0.788365257 is twelve on that column. The ceiling is the factor, and 200 stages land on it to the last place printed.")

q(0, "A column at an absorption factor of 1.200000000000 carries 12 stages. What would 200 stages take the removal to?",
 "1.000000000, because above unity there is no ceiling short of total removal.",
 ["1.200000000, which is the factor and therefore the ceiling on that row.",
  "0.995024876, which is where 200 stages land on every row near unity.",
  "0.979379999, since the removal stops moving once the stages pass twelve."],
 "The removal at 12 stages on that row is 0.979379999. The 0.995024876 belongs to the rows at and either side of unity, and a factor above one is not a ceiling at all.")

q(1, "What does the refusal on an unreachable removal hand back besides its message?",
 "The absorption factor, the fraction removed and the ceiling.",
 ["The absorption factor, the stage count tried and the ceiling.",
  "The ceiling, the spec and the circulation that would reach it.",
  "The message alone, since a refusal carries no fields."],
 "Three fields beside the message, and between them they let a caller say what to change rather than only that something failed.")

q(2, "At an absorption factor of 0.950000000000, how far do 200 stages fall short of the ceiling?",
 "-0.000001665057.",
 ["0.000000000000.",
  "-0.004975123378.",
  "-0.000001665057 at 12 stages and nothing at 200."],
 "The factors well below unity print exactly 0.000000000000 there, because the factor raised to the stage count falls below anything double precision holds. Only close to unity is the shortfall measurable at all.")

q(3, "The Kremser golden runs an absorption factor of 1.400000 over 6 stages. What do the engine and the cascade both return?",
 "0.958077213054.",
 ["0.933333333333.",
  "0.833333333333.",
  "0.768995038974."],
 "Those three are the other published cases: a factor of 2.000000 over 3 stages, one of 1.000000 over 5, and one of 0.800000 over 8. All five ratios of engine over golden come back at 1.000000000000.")

q(0, "A vendor turns a theoretical count into real trays. What decides how much taller the real column comes out?",
 "The tray efficiency of the service.",
 ["The absorption factor the count was worked at.",
  "The removal the contract asked for.",
  "The allowed velocity the vessel was sized on."],
 "It is a property of the service rather than of the arithmetic, and this package does not carry it. The count is still the right number for comparing two designs and for asking whether a spec is reachable.")

# --- m03, acid gas is removed by moles ---------------------------------------

q(1, "What is 10666.2009 on the UBIE stream?",
 "The acid gas going into the solution, in lbmol a day.",
 ["The acid gas going into the solution, in lb a day.",
  "The amine going round the loop, in lbmol a day.",
  "The solution going round the loop, in gallons a day."],
 "It is the mole percent removed applied to 88.000000 MMscfd through the standard cubic feet in a pound mole. The amine a day follows from it only after the swing has been divided out.")

q(2, "Which figure divides the acid gas rate on the way to a circulation?",
 "The loading swing.",
 ["The rich loading.",
  "The lean loading.",
  "The solution gravity."],
 "Each mole of amine carries the swing round the loop, so the swing is what sets how many moles of amine there have to be. Either loading on its own sets nothing.")

q(3, "A sweetening answer echoes back the rich loading it applied. Why does it need to?",
 "Because the rich loading defaults to the customary limit of the amine that was named.",
 ["Because the rich loading is the one end of the loop a caller cannot type.",
  "Because the corrosion warning names the rich loading it was handed rather than the limit.",
  "Because the swing comes back on the same key once the lean loading is subtracted."],
 "Every figure below it in the chain stands on that value. What comes back under no name at all is the swing, and forming the difference between the two ends is the reader's own step.")

q(0, "Two spec refusals look alike. What separates a spec already met at the inlet from a spec set above it?",
 "The first says the gas is on spec and the second says a figure larger than the inlet was typed beside it.",
 ["The first is a warning and the second is a refusal.",
  "The first names both gases and the second names only the one at fault.",
  "The first is raised on the loadings and the second on the mole percentages."],
 "Both messages quote both sides so the comparison can be made at a glance. The third refusal in that family is about the solvent loop rather than the gas, and it is the one that names the swing.")

q(1, "Down the lean loading table the MMBtu an hour per gpm column holds at 0.048000000. Why?",
 "The duty per gallon is a stated input the engine never changes.",
 ["The regenerator duty is independent of the circulation in this model.",
  "The lean loading enters the duty and the circulation in the same place.",
  "The swing cancels out of the ratio of the two engine figures."],
 "800.000000 Btu on every gallon circulated means the regenerator duty is the circulation in other units, so a leaner lean costs nothing here. On a real still it is bought with reboiler duty, stripping steam and a taller column.")

q(2, "Which step of the gallons chain is chemistry rather than practice or process?",
 "The molecular weight of the amine.",
 ["The strength of the solution as it circulates.",
  "The customary rich limit of the amine.",
  "The duty per gallon circulated."],
 "A molecular weight is fixed by the molecule and can be checked in any handbook. Everything else in that chain was chosen by somebody, either as a design value or as the way a plant is run.")

q(3, "The plant is turned down. Which pair moves together?",
 "The lbmol a day and the gpm.",
 ["The mole percent removed and the lbmol a day.",
  "The mole percent removed and the gpm.",
  "The swing and the lbmol a day."],
 "A mole percent and a swing are intensive and know nothing about how much gas there is. Everything extensive below them moves with the rate, the duty included.")

# --- m04, three amines and what separates them -------------------------------

q(0, "Which column of the property set makes an MEA gallon dearer to regenerate than an MDEA one?",
 "The duty, 1100.000000 against 800.000000 Btu a gallon.",
 ["The typical strength, 18.000000 against 45.000000 weight percent.",
  "The rich limit, 0.350000 against 0.500000.",
  "The molecular weight, 61.080000 against 119.160000."],
 "The other three decide how many gallons there are rather than what a gallon costs to strip. Both effects run the same way here, which is why the duty gap between the two amines is wider than the circulation gap.")

q(1, "One duty put through all three amines gives 994.638143 gpm on one of them. Which?",
 "MEA.",
 ["DEA.",
  "MDEA.",
  "All three, since the gallons follow the duty."],
 "DEA moves 934.163599 gpm and MDEA 502.519990 gpm on the same duty. The gallons follow the rich limit and the strength, which differ on every row.")

q(2, "A loading of 0.500001000 is asked of MDEA. What comes back?",
 "An answer carrying a corrosion warning.",
 ["An answer with no note on it.",
  "A refusal naming the customary limit.",
  "An answer with the rich loading reset to 0.500000."],
 "The limit itself is clean and a millionth past it is flagged. The message names the limit, names the amine it belongs to, and says what kind of trouble is being risked.")

q(3, "DEA over MDEA is 1.858958085 on one measure and 2.207512726 on another. Which is which?",
 "1.858958085 is the circulation ratio and 2.207512726 is the duty ratio.",
 ["1.858958085 is the duty ratio and 2.207512726 is the circulation ratio.",
  "1.858958085 is the strength ratio.",
  "1.858958085 is the gravity ratio."],
 "Circulation is set by the rich limit and the strength; duty adds the duty per gallon, which is where the extra gap comes from. The same ordering is reached by two routes and the gaps are different sizes on each.")

q(0, "The module is asked for an amine it does not carry. What happens?",
 "The lookup returns null and the package declines by name.",
 ["The lookup returns the nearest row and the package answers on it.",
  "The lookup returns null and the default row answers.",
  "The lookup refuses and returns an empty set."],
 "A lookup that falls back to a default produces a complete and plausible answer for a solvent nobody asked about. This one gives the correction and the catalogue in one line.")

q(2, "A rich limit from one row of the amine property set is used with a strength from another. What is wrong with that?",
 "Each row is one amine at its own strength and its own limit, so the pair describes nothing real.",
 ["The engine refuses the pair, because it checks the strength and the limit against the amine named.",
  "The circulation comes back right and only the regenerator duty is wrong.",
  "Nothing, because the strength and the rich limit enter the chain at different steps."],
 "The engine will answer for any strength and any rich loading a caller types. What it cannot do is tell a reader that the pair describes no real plant, which is why the property set is read a row at a time.")

q(1, "All three ways of ranking the amines agree. What is the useful question left?",
 "How far apart the three are, which the two ratio columns answer differently.",
 ["Which of the three rankings is the correct one to quote.",
  "Whether the rankings would reverse at another duty.",
  "Which ranking the engine applies when it orders the property table."],
 "A ranking stable across two measures is a real ranking. The size of the advantage is not stable, and quoting one ratio when the decision turns on the other is a mistake a single ordering hides completely.")

# --- m05, the vessel the gas goes up -----------------------------------------

q(3, "At 950.000000 psia and 104.000000 degF on a gravity of 0.660000, what does the engine form?",
 "A compressibility of 0.876617747 and a gas density of 3.424553 lb per ft3.",
 ["A compressibility of 0.919606033 and a gas density of 2.045042 lb per ft3.",
  "A compressibility of 0.818461451 and a gas density of 5.672520 lb per ft3.",
  "A compressibility of 0.861800291 and a gas density of 3.831017 lb per ft3."],
 "The first two of the others are rows at 600.000000 and 1400.000000 psia on different gravities, and the last is the UBIE column at 985.000000 psia and 112.000000 degF.")

q(1, "A K of 0.300000 on that same column gives what?",
 "An allowed velocity of 1.318455 ft per s and a diameter of 3.192661 ft.",
 ["An allowed velocity of 1.098713 ft per s and a diameter of 3.497385 ft.",
  "An allowed velocity of 1.538198 ft per s and a diameter of 2.955830 ft.",
  "An allowed velocity of 1.035597 ft per s and a diameter of 4.208602 ft."],
 "The first two others are the K of 0.250000 and 0.350000 rows on the same stream. The last belongs to UBIE, which is a different stream sized at a different K.")

q(0, "What density does a DEA column rise against?",
 "63.635283 lb per ft3.",
 ["63.011408 lb per ft3.",
  "64.883034 lb per ft3.",
  "69.568831 lb per ft3."],
 "Every row of the amine table carries a solution gravity and the module turns it into a density. A column sized on the default instead is measured against a fluid it will never contain.")

q(2, "What do the three published contactor cases that pass a compressibility in actually check?",
 "The sizing arithmetic, and never the correlation.",
 ["The correlation, and never the sizing arithmetic.",
  "Both, since the compressibility is checked against the one supplied.",
  "Neither, since a supplied compressibility makes the case a restatement."],
 "A supplied compressibility takes the correlation out of the test entirely, so those cases speak only to the arithmetic that follows it. Two further cases exist for the other half.")

q(3, "A sizing answer comes back reporting zSource as supplied by the caller. What does that tell a reader?",
 "The compressibility is somebody's assertion rather than a correlation's answer.",
 ["The compressibility was formed by DAK at those conditions.",
  "The compressibility fell outside the correlation's validity band.",
  "The compressibility was read from the amine property table."],
 "A reader of the answer is never guessing which branch produced the number in front of them, and the two branches are genuinely different claims.")

q(1, "Two columns on one duty come out 3.828818705 ft and 3.900134220 ft. What is the 1.018625984 between them?",
 "The factor between a column sized against glycol and one sized against MDEA solution.",
 ["The factor between a column sized at two different K values.",
  "The factor between the engine and the golden on the amine case.",
  "The factor between a column at 950.000000 psia and one at 985.000000 psia."],
 "A glycol density and an amine solution density are different numbers, and a column sized against the wrong one is confidently the wrong width.")

q(2, "This module gives a stage count and a diameter for one column. What ties them together?",
 "Nothing here, because the module carries no tray hydraulics.",
 ["The allowed velocity, which both readings share.",
  "The liquid density, which the stage relation also reads.",
  "The absorption factor, which sets the liquid load the vessel sees."],
 "Tray hydraulics really do tie the two on a plant. The module does not pretend to a link it cannot compute, so a column can be six theoretical stages tall and any width the gas rate demands.")

# --- m06, the Professional reading -------------------------------------------

q(0, "Three answers about one sour column. What is true of them?",
 "Not one of them can be derived from the other two.",
 ["Each is a check on the other two at the seam.",
  "Two are engine answers and the third is a chart reading.",
  "Each is computed from the same six inputs in a different order."],
 "The mole balance says how much solution has to move, the stage relation says whether the spec is reachable, and the vessel says how wide the steel has to be. They arrive on one screen about one vessel and they are independent.")

q(3, "Which reading answers how much solution has to move?",
 "The mole balance.",
 ["The stage relation.",
  "The vessel sizing.",
  "The regenerator duty."],
 "The regenerator duty is that same answer priced per gallon rather than a reading of its own. A stage count cannot size a pump and a diameter cannot either.")

q(1, "Every figure in the three Professional readings of one column stands on numbers somebody chose. Which of these is NOT one of those chosen numbers?",
 "The loading swing the circulation follows.",
 ["The lean loading the solution comes back from the regenerator on.",
  "The absorption factor the column is read at.",
  "The Souders-Brown K value the vessel is sized at."],
 "The swing is the difference between two loadings a caller chose, so it is formed rather than typed. Write the rest down before reading any answer: the two loadings, the strength and the duty per gallon behind the mole balance, the absorption factor and the stage count behind the staged reading, and the K value and the liquid behind the vessel.")

q(2, "A graded question asks for a figure the engine declines to produce. What is the answer?",
 "That it declines, with the reason it gives.",
 ["The nearest figure the engine would have returned.",
  "A zero, since the engine produced nothing.",
  "The figure worked by hand from the same inputs."],
 "Writing a plausible figure into that gap turns a correct reading into a wrong answer, and the gap was the point of the question. A refusal names what to change and by how much.")

q(0, "In what units are a circulation and a regenerator duty written in this tier?",
 "A circulation is in gpm and a regenerator duty is in MMBtu an hour.",
 ["A circulation is in gpm and a regenerator duty is in Btu a gallon.",
  "A circulation is in gallons a day and a duty is in MMBtu an hour.",
  "A circulation is in lbmol a day and a duty is in MMBtu an hour."],
 "Btu a gallon is the duty per gallon that prices the loop rather than the regenerator size, gallons a day is the same circulation before the minutes in a day, and lbmol a day is the acid gas the solution picks up.")

q(3, "Why can a diameter quoted on its own not be reproduced?",
 "It is conditional on a K value somebody chose, and that choice is not in the figure.",
 ["It is conditional on a compressibility the engine may or may not have formed.",
  "It is conditional on the liquid the caller named, which the answer does not report.",
  "It is conditional on the stage count, which the sizing call is never given."],
 "The answer does report both the liquid and where the compressibility came from. Every choice in this module is an input on the page with its customary value named, and a figure lifted away from those choices is a number without a question.")

q(1, "Which quantity does this engine compute that the Flow Assurance engine takes as a typed input?",
 "The Joule-Thomson coefficient.",
 ["The hydrate boundary.",
  "The compressibility of the gas.",
  "The Souders-Brown allowed velocity."],
 "A caller of that engine has to bring the figure from somewhere, and this module is where it is formed from a correlation. Working the chain it feeds is the tier above this one.")

emit(Q, '/root/wt-fc4-nextgen/tools/course-banks/gasprocessing/intermediate/fc4i_exam.json', label='fc4i_exam', expect_n=42)
finish()
