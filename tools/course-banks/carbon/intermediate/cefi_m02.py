import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# carbon Professional m02, excess air and stack oxygen.
# Draws on m02's four lessons only: digest SECTION 12 (excessAirFromFlueOxygen
# on the invented Isiokpo fuel gas), the SECTION 11 stoichiometry it rests on,
# O2_MOLE_FRACTION_DRY_AIR from SECTION 1, and the SECTION 14 refusal for a
# blank safe oxygen floor that lesson three reads beside the assumption.

q(2, "The course prints the assumption behind excessAirFromFlueOxygen. According to it, how does a stack making carbon monoxide read?",
 "As if it had more excess air than it has.",
 ["As if it had less excess air than it has.",
  "As the same excess air, at a lower efficiency.",
  "As a refusal: the engine will not read a CO stack."],
 "The engine's assumption, verbatim: \"Complete combustion. An oxygen reading alone cannot see carbon monoxide, so a stack making CO will read as if it had more excess air than it has.\" The sentence names a direction and prints no size.")

q(0, "The invented Isiokpo heater reads 5.5 percent dry stack oxygen. What excess air does the course print for that reading?",
 "32.1223 percent",
 ["13.9199 percent",
  "21.2938 percent",
  "55.7461 percent"],
 "The 5.5 row prints excess air 32.1223 percent. 13.9199 percent is the 2.8 row, 21.2938 percent the 4 row and 55.7461 percent the 8 row.")

q(0, "At a dry stack oxygen of 2.8 percent, which course figure is the actual air for the invented Isiokpo fuel gas?",
 "11.364257",
 ["10.387757",
  "12.420757",
  "10.925631"],
 "The 2.8 row prints actual air 11.364257, dry flue gas 10.387757 and wet flue gas 12.420757 kmol per kmol fuel. 10.925631 is the actual air in the 2 row.")

q(1, "In every row of the oxygen table the wet flue gas less the dry flue gas is 2.033000 kmol per kmol fuel. What does the course say that difference is?",
 "The water the hydrogen makes, products.h2oPerKmolFuel.",
 ["The oxygen the excess air carries through the stack.",
  "The fuel's CO2 and nitrogen, which pass through unburned.",
  "The argon that ATMOSPHERIC_N2_MOLAR_MASS carries."],
 "In the course, the wet flue gas less the dry is the water the hydrogen makes, 2.033000 in every row, and products.h2oPerKmolFuel is 2.033000 in the stoichiometry lesson.")

q(3, "Down the whole oxygen table, subtracting actual air from dry flue gas always gives -0.976500. Which reading of that constant does the course print?",
 "Each extra kilomole of air leaves as a kilomole of dry flue gas.",
 ["Each extra kilomole of air adds 2.033000 kmol of water to the stack.",
  "Above 5.5 percent the dry flue gas grows faster than the actual air.",
  "The oxygen demand falls by 2.089500 kmol for every kilomole of air."],
 "In the course, the dry flue gas less the actual air is fixed, because each extra kilomole of air leaves as a kilomole of dry flue gas. The figure prints as -0.976500 from 0 to 12 percent. The 2.033000 is the wet less dry, the water, and the oxygen demand stays at 2.089500.")

q(2, "The course prints two calls to excessAirFromFlueOxygen, one at 21 percent and one at -1 percent dry stack oxygen. What does the engine answer?",
 "Both are refused with the same message, the one that states the bound of 0 percent or more and below 20.946 percent.",
 ["21 percent is refused as above the oxygen in dry air, and -1 percent is read as 0 percent, excess air 0.0000 percent.",
  "Both are refused with the message that a measured dry stack oxygen is required, since neither is a real reading.",
  "Neither is refused: 21 percent prints above the 121.0076 percent of the 12 row and -1 percent prints below zero."],
 "The course prints both calls answered by one refusal: \"Stack oxygen must be 0 percent or more and below 20.946 percent, the oxygen in dry air. A reading of 20.946 percent is air with no fuel burned.\" The required-reading message answers a blank.")

q(0, "The dry stack oxygen box is left blank on a call for the invented Isiokpo fuel gas. What does excessAirFromFlueOxygen return?",
 "REFUSED: A measured dry stack oxygen is required.",
 ["REFUSED: Valid stoichiometry is required.",
  "Excess air 0.0000 percent: a blank is read as a reading of 0.",
  "REFUSED: Stack oxygen must be 0 percent or more and below 20.946 percent, the oxygen in dry air. A reading of 20.946 percent is air with no fuel burned."],
 "The course prints the blank reading refused with its own message, \"A measured dry stack oxygen is required.\" The 0 row, excess air 0.0000 percent, is what a typed 0 returns. The stoichiometry message answers a call with no stoichiometry.")

q(1, "The course says the excess air is solved one way in the engine and found another way by the oracle. Which pairing does it print?",
 "The engine solves a closed form; the oracle finds the same E by bisection on the full dry flue gas.",
 ["The engine finds E by bisection; the oracle solves the closed form on the stoichiometric terms.",
  "Both solve the closed form, the engine on the dry flue gas and the oracle on the wet flue gas.",
  "The engine reads E between the printed rows, and the oracle finds it by bisection on wet gas."],
 "The course prints that the relation is solved in closed form, and that the oracle finds the same E by bisection on the full dry flue gas. The table prints the engine's answers.")

q(3, "The course states the relation the engine solves, with E the excess-air fraction. Which is it?",
 "E x oxygen demand / (stoichiometric dry products + E x stoichiometric air) = measured fraction",
 ["E x oxygen demand / (stoichiometric wet products + E x stoichiometric air) = measured fraction",
  "E x stoichiometric air / (stoichiometric dry products + E x oxygen demand) = measured fraction",
  "oxygen demand / (stoichiometric dry products + E x stoichiometric air) = measured fraction"],
 "In the course, E times the oxygen demand over (the stoichiometric dry products plus E times the stoichiometric air) equals the measured fraction.")

q(0, "The first refusal in the lesson is labelled \"all air\", a dry stack oxygen of 20.946 percent. What does the refusal's second sentence say that reading is?",
 "Air with no fuel burned.",
 ["A stack at the 12 percent row's 121.0076 percent excess air.",
  "The stoichiometric case, with excess air of 0.0000 percent.",
  "A stack making CO that reads as though it had more air."],
 "The second sentence names 20.946 percent as air with no fuel burned, and the course prints O2_MOLE_FRACTION_DRY_AIR 0.20946. 121.0076 percent is the excess air of the 12 row, the highest row the table prints, and 0.0000 percent that of its 0 row. The CO sentence is the engine's assumption, printed above the table.")

q(2, "Which row of the course's oxygen table carries 4.5228 percent in its excess air column?",
 "1 percent",
 ["2 percent",
  "2.8 percent",
  "4 percent"],
 "The 1 row prints excess air 4.5228 percent and actual air 10.426827 kmol per kmol fuel. The 2 row prints 9.5230, the 2.8 row 13.9199 and the 4 row 21.2938 percent.")

q(1, "excessAirFromFlueOxygen is called with a reading of 5.5 percent and no stoichiometry. What does the course print?",
 "REFUSED: Valid stoichiometry is required.",
 ["32.1223 percent excess air, read from the table row.",
  "REFUSED: A measured dry stack oxygen is required.",
  "13.180063 kmol of air per kmol, with no excess air."],
 "The course prints the call with no stoichiometry refused: \"Valid stoichiometry is required.\" 32.1223 percent and 13.180063 are the 5.5 row with the Isiokpo stoichiometry supplied.")

q(0, "Which unit goes with the 13.180063 printed in the actual air column?",
 "kmol of air per kmol of fuel",
 ["kg of air per kg of fuel",
  "kmol O2 per kmol of fuel",
  "percent of the stoichiometric air"],
 "The course's column is headed actual air kmol per kmol fuel. kg air per kg fuel is the unit of stoichAirKgPerKgFuel 15.612763, kmol O2 per kmol fuel the unit of o2PerKmolFuel 2.089500, and the excess air column is the one in percent.")

q(3, "The course prints the refusal for a blank minimum safe stack oxygen. On what does it say the carbon monoxide point depends?",
 "The burner, the fuel and the draught control.",
 ["The stack oxygen, the fuel and the excess air.",
  "The stack temperature and radiation loss.",
  "The fuel analysis and its typical heating value."],
 "The refusal, verbatim: \"A minimum safe stack oxygen is required and is not defaulted. Below some excess air a burner makes carbon monoxide, and where that point sits depends on the burner, the fuel and the draught control.\" At Isiokpo the floor is 2 percent, declared after a combustion test (invented).")

q(2, "A stack reading no oxygen at all: how does that first row of the table compare with the course's stoichiometry?",
 "Excess air 0.0000 percent and actual air 9.975652, equal to stoichAirPerKmolFuel.",
 ["Excess air 0.0000 percent and actual air 8.999152, the dry flue gas of that row.",
  "Excess air 4.5228 percent and actual air 10.426827, the first reading it answers.",
  "A refusal, since a reading of 0 percent is read the same as a blank reading."],
 "The 0 row prints excess air 0.0000, actual air 9.975652, dry flue gas 8.999152 and wet flue gas 11.032152 kmol per kmol fuel; the stoichiometry lesson prints stoichAirPerKmolFuel 9.975652. 4.5228 and 10.426827 are the 1 row. A blank is refused with its own message.")

emit(Q, '/root/wt-et-carbon-nextgen/tools/course-banks/carbon/intermediate/cefi_m02.json', label='cefi_m02', expect_n=15)
finish()
