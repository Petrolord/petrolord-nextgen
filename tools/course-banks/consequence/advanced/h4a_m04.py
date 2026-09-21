import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H4 consequence, Expert tier, module "Toxic Probits".
# Digest sections drawn on: 29 (the toxic load, two sources and two units, a
# preset in the other unit, a concentration that changes, the Purple Book
# carbon monoxide case and the Lees columns), 12 (ppm and mg/m3 through the
# molar volume at the stated temperature) and 3 (the toxic refusals).

q(0,
 "`TOXIC_PROBITS` computes Y = a + b ln(C^n t). In what unit does every toxic preset take the exposure time t?",
 "Minutes",
 ["Seconds, the same unit as the thermal probits use",
  "Hours",
  "Seconds for the Lees presets and minutes for the Purple Book ones"],
 "Section 29 states t in MINUTES for every toxic preset, and the unit table in section 2 pairs exposureMinutes with a toxic exposure. Seconds belong to the thermal probits' exposureTimeS. No preset takes hours, and the two sources differ in their concentration unit, never in their time unit."),

q(2,
 "Chlorine carries both a Lees preset and a Purple Book preset. In which concentration unit does lees-chlorine expect C?",
 "ppm, as OSD/30 prints the Lees presets",
 ["mg/m3, the unit of every preset in the table",
  "mg/m3 at 298.15 K, converted inside the preset from the Purple Book coefficients",
  "g/m3, as the Purple Book's worked plume prints its concentration"],
 "Section 29: the Purple Book presets (pb-) are in mg/m3 and the Lees presets, as OSD/30 prints them, are in ppm. So lees-chlorine takes ppm with a = -8.29, b = 0.92 and n = 2. The g/m3 figure is the plume case of section 11, and no preset converts between the two sources."),

q(1,
 "Chlorine at 400 ppm is held for 10 minutes. What probability does the lees-chlorine preset give?",
 "0.441437",
 ["0.309443, which the Purple Book preset gives for the same exposure",
  "0.077409",
  "0.073459"],
 "The two source table prints 0.441437 under Lees at 400 ppm for 10 minutes, with a toxic load of 1600000.000000 (ppm)^2 min. 0.309443 is the Purple Book at the same exposure. 0.077409 and 0.073459 are the Lees and Purple Book figures at 200 ppm."),

q(3,
 "At 100 ppm of chlorine for 10 minutes, Lees gives a toxic load of 100000.000000 and the Purple Book 58987241.122310. In what units does the engine print those two toxic loads?",
 "(ppm)^2 min for Lees and (mg/m3)^2.75 min for the Purple Book",
 ["ppm min for both, since the toxic load is a concentration held for a time and carries that unit",
  "(mg/m3)^2 min for both, after the Lees concentration is converted with the molar mass of 70.9 g/mol",
  "(ppm)^2.75 min for Lees and (mg/m3)^2 min for the Purple Book"],
 "The toxic load is C^n t in the preset's own unit, and the engine prints the unit with every result: n is 2 for Lees in ppm and 2.75 for the Purple Book in mg/m3. The load is not linear in C, Lees stays in ppm, and swapping the exponents mismatches each preset's n."),

q(3,
 "For the Purple Book chlorine preset, 50 ppm is converted at 25 C with a stated molar mass of 70.9 g/mol. What concentration goes into the toxic load?",
 "144.898488 mg/m3",
 ["289.796976 mg/m3, the conversion of 100 ppm",
  "579.593951 mg/m3, the conversion of 200 ppm",
  "1159.187903 mg/m3, the conversion of 400 ppm"],
 "The two source table converts 50 ppm to 144.898488 mg/m3 for the pb-chlorine preset. 289.796976, 579.593951 and 1159.187903 mg/m3 are the 100, 200 and 400 ppm conversions, each proportional to the ppm at the same temperature and molar mass."),

q(1,
 "Hydrogen sulphide at 800 ppm for 15 minutes is run on the pb-hydrogen-sulfide preset with a molar mass of 34.08 g/mol and no temperature stated. What probability does the engine give?",
 "0.322245",
 ["0.333853, which is the figure the engine gives when 293.15 K is stated",
  "4.538569",
  "4.570702"],
 "With no temperature stated the engine converts at its default of 298.15 K: 1114.389950 mg/m3, a probit of 4.538569 and a probability of 0.322245. 0.333853 belongs to 293.15 K. 4.538569 and 4.570702 are the probits at the two temperatures, read as if they were probabilities."),

q(0,
 "In the same hydrogen sulphide case, why does stating 293.15 K give a higher probability than the default 298.15 K?",
 "A colder gas is denser, so the same 800 ppm is more mg/m3, 1133.397113 against 1114.389950",
 ["The preset's coefficients are fitted at 293.15 K and corrected for a warmer one",
  "The exposure time is scaled by the ratio of the two temperatures before the load is formed",
  "The molar mass is taken at 293.15 K, where it is larger"],
 "The engine converts ppm to mg/m3 through the ideal gas molar volume at the stated temperature (section 12), and a colder gas packs more mass into a cubic metre, so the mg/m3 figure and the toxic load rise. The coefficients, the time and the molar mass are not changed by the temperature."),

q(2,
 "A ppm concentration is passed to a mg/m3 preset with no molar mass. What does the engine return?",
 "A refusal: \"molarMassGMol: must be a molar mass above 0 g/mol\"",
 ["A result converted with the carbon monoxide molar mass of 28.01 g/mol, the course's example gas",
  "A result using the ppm directly as if it were mg/m3",
  "A refusal naming `molarMassKgMol`: \"molarMassKgMol: must be a molar mass above 0 kg/mol (hydrogen is 0.002016)\""],
 "Without a molar mass the conversion cannot be made, and the engine refuses on `molarMassGMol` with the message quoted. It never assumes a gas or skips the conversion. `molarMassKgMol` is the source term field in kg/mol, and the concentration functions take g/mol."),

q(0,
 "A history of 150 for 5 minutes, 90 for 10 minutes and 30 for 20 minutes is passed to `toxicDose` at n = 2. What toxic load does it return?",
 "211500.000000",
 ["144642.857143, which is the toxic load of the time weighted mean held for the whole time",
  "64.285714",
  "25000.000000"],
 "`toxicDose` sums C^n dt over the history, \"D = sum(C^n dt)\", and the digest prints 211500.000000. 144642.857143 is the load of the time weighted mean, 64.285714, held for the whole time; 64.285714 is the mean concentration itself, and 25000.000000 is the Lees chlorine load at 50 ppm for 10 minutes."),

q(3,
 "Why is the toxic load of that history, 211500.000000, larger than the load of its time weighted mean held for the same time?",
 "With n above one a peak counts for more than its share of the average",
 ["The engine adds a peak factor of its own to any history containing more than one concentration step",
  "The history is summed in seconds while the mean is held in minutes, so the history reads larger",
  "The mean concentration of 64.285714 is rounded down before its load is formed"],
 "The load goes as C^n, and at n = 2 the 150 step contributes far more than a flat 64.285714 would, so the history gives 211500.000000 against 144642.857143. The engine applies no peak factor, both sums are in minutes, and nothing is rounded."),

q(2,
 "The Purple Book's worked carbon monoxide case, 21,300 mg/m3 for 30 minutes, prints Pr 5.97 and P 0.835. The engine gives 5.967660 and 0.833393. Why does the golden allow 0.002 absolute on the probability?",
 "The Purple Book reads its probability off Table 5.1, so the printed 0.835 carries the table's resolution",
 ["The engine's normal CDF is good only to 0.002, which is why every probability in the course prints to three decimals",
  "The carbon monoxide coefficients are single route, and every single route quantity gets a wider tolerance",
  "The plume that produced the concentration is accurate to 0.002"],
 "Section 29: the Purple Book reads its P from Table 5.1, which is why the golden allows 0.002 absolute. The CDF is good to about 1.5e-7, which is why probabilities print to six decimals. The Purple Book toxic coefficients are never graded, so no tolerance of theirs is widened, and the plume is not in this comparison."),

q(1,
 "What do the Lees columns of OSD/30 Table 2 contain, and how do they stand against the engine?",
 "The ppm giving one and fifty percent at 5 and 30 minutes for 13 substances; all 52 values reproduce within one percent or one ppm",
 ["The toxic loads giving one and fifty percent for every Purple Book preset; all reproduce to the printed two decimals",
  "The coefficients a, b and n for 13 substances, of which two do not reproduce and were left out",
  "The mg/m3 at 25 C that gives fifty percent at 10 minutes"],
 "Section 29 describes the Lees columns as quoted, 13 substances at two probabilities and two durations, 52 values, all reproduced through the engine's inverse within one percent or one ppm. That is the evidence that makes the Lees toxic coefficients gradable. The columns are in ppm, and all 52 values reproduce."),

q(3,
 "At 298.15 K and 101325 Pa the engine's molar volume is 24.465404 L/mol. What is the CCOHS and NIOSH figure of 24.45?",
 "Its rounding, which the golden gates at one part in a thousand",
 ["The molar volume at 293.15 K, 24.055117 L/mol",
  "A different gas constant used by occupational hygienists",
  "The molar volume at 273.15 K, 22.413970 L/mol"],
 "Section 12 says 24.45 is the rounding of 24.465404 L/mol and the golden gates it at one part in a thousand. 24.055117 and 22.413970 L/mol are the engine's molar volumes at 293.15 and 273.15 K, and the engine uses R_J_MOL_K, 8.314462618, throughout."),

q(0,
 "`toxicDose` is called with an empty history. What message does the engine return?",
 "\"history: must be a non-empty list of { concentration, minutes }\"",
 ["\"dose: must be above 0: ln(0) has no probit\", since an empty history sums to a toxic load of zero",
  "\"targetConcentrationMgM3: must be a concentration above 0 mg/m3\"",
  "\"probability: must lie strictly between 0 and 1\""],
 "Section 3 tables the empty history refusal on the field `history` with the message quoted. The zero load message belongs to `probit`, the target concentration message to `plumeDistanceToConcentration`, and the probability message to `probabilityToProbit`."),

q(2,
 "Chlorine at 200 ppm for 10 minutes reads 0.077409 under Lees. What does the Purple Book preset read for the same exposure?",
 "0.073459",
 ["0.309443, the Purple Book at 400 ppm",
  "0.008118, the Purple Book at 100 ppm",
  "0.003487"],
 "The two source table prints 0.073459 for the Purple Book at 200 ppm, close to Lees there, while at 400 ppm the two part to 0.441437 and 0.309443. 0.008118 is the Purple Book at 100 ppm and 0.003487 is Lees at 100 ppm. The two sources disagree for the same exposure, and the note that uses one shows the other."),

emit(Q, '/root/hse-wip-consequence/banks/h4a_m04.json', expect_n=15)
finish()
