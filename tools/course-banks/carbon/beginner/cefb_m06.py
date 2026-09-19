import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# carbon Associate m06, The Associate Reading. Digest sections 4, 5, 7 and 25, read as one inventory.

q(1, "Under the rules in force, what becomes of a line that errors, or one off Scope 1 and Scope 2?",
 "It is a blocked line with its reason",
 ["It is dropped from the inventory unseen",
  "It is computed at 0.000 tCO2e instead",
  "It stops every total being computed"],
 "SECTION 25 lists the rule \"A line that errors, and a line off Scope 1 and Scope 2, is a blocked line with its reason\" (SECTION 9). SECTION 9 names each blocked line with its reason, and the totals are still computed from the lines that did compute.")

q(3, "Held item H3 counts every escaped carbon atom as methane. Which Igbogene inventory line rests on that assumption?",
 "Flaring (unburned CH4), 16.306 t CH4",
 ["Vented and fugitive methane, 142.000 t CH4",
  "Fired heaters (CO2), 23121.448 t CO2",
  "Flaring (CO2), 2191.807 t CO2"],
 "H3 (SECTION 25) points at SECTION 5, where the flare's escaped carbon becomes ch4Tonnes 16.306 at 0.98; SECTION 7 carries it as Flaring (unburned CH4). The vented line's 142.000 t comes from the survey, and the two CO2 lines are the carbon that burned.")

q(0, "Every other gap is closed and only the flare's destruction efficiency is blank. What does the total leave out?",
 "The flare's CO2 line and its methane line",
 ["The flare's methane line alone, 485.922 tCO2e",
  "The vented and fugitive methane line",
  "Nothing, since the flare is read at 1"],
 "SECTION 9 prints that inventory: 4 lines, Scope 1 27353.048, total 40268.048 tCO2e, reportable false. \"The total leaves out the flare's CO2 and methane lines, and the inventory is not reportable while the flare stands refused.\"")

q(2, "Which flags does the complete Igbogene inventory return?",
 "computed true, reportable true, blocked lines 0, unsourced lines 0",
 ["computed true, reportable false, blocked lines 0, unsourced lines 1",
  "computed true, reportable true, blocked lines 0, unsourced lines 1",
  "computed false, reportable true, blocked lines 0, unsourced lines 0"],
 "SECTION 7 prints: \"gwpSetLabel: IPCC AR6 GWP100, fossil methane. computed: true. reportable: true. blocked lines: 0. unsourced lines: 0.\" SECTION 9 shows an unsourced factor keeps an inventory from being reportable.")

q(1, "Which Igbogene line rests on the Epie Creek leak detection survey (invented), version 2026 Q2?",
 "Vented and fugitive methane, 142.000 t CH4",
 ["Flaring (unburned CH4), 16.306 t CH4",
  "Purchased electricity, 31500.000 MWh",
  "Fired heaters (CO2), 23121.448 t CO2"],
 "SECTION 7 prints the survey as the source of the Vented and fugitive methane line, activity 142.000 t CH4, factor 1 tCH4/t. The flare's methane and the heaters are atom-balance lines, and the electricity line rests on the supplier statement (invented), 2025.")

q(3, "What shares of the complete Igbogene total does the digest print for the flare's two lines?",
 "0.051037 for its CO2 and 0.011315 for its methane",
 ["0.011315 for its CO2 and 0.051037 for its methane",
  "0.051037 for its CO2 and 0.181468 for its methane",
  "0.098534 for its CO2 and 0.011315 for its methane"],
 "SECTION 7's share table (computed here) prints Flaring (CO2) 0.051037 and Flaring (unburned CH4) 0.011315. 0.181468 is a share of the flare alone (SECTION 5), and 0.098534 belongs to the vented line.")

q(0, "What factor does SECTION 7 give the atom-balance lines, as the Carbon Studio builds them?",
 "A factor of 1 whose source is conservation of mass",
 ["The heaters' 1.09 kmol of carbon per kmol of fuel",
  "MW_CO2, 44.009, whose source is the IUPAC weights",
  "The set's CH4 value, 29.8, applied as the factor"],
 "SECTION 7: \"The atom-balance lines carry a factor of 1 whose source is conservation of mass, as the Carbon Studio builds them.\" The GWP column carries 29.8 on the methane line; the factor column reads 1 on all three atom-balance lines.")

q(2, "How many lines make up Scope 1 in the complete Igbogene inventory, and what do they total?",
 "4 lines, 30030.777 tCO2e",
 ["5 lines, 42945.777 tCO2e",
  "4 lines, 27353.048 tCO2e",
  "3 lines, 30030.777 tCO2e"],
 "SECTION 7: \"Scope 1 is the sum of its 4 lines\" and prints Scope 1 (direct) at 30030.777 tCO2e. 42945.777 is the total of both scopes, and 27353.048 is Scope 1 with the flare's efficiency still blank.")

q(3, "What activity and unit does the Fired heaters (CO2) line carry into the inventory?",
 "23121.448 t CO2",
 ["482000 kmol of fuel",
  "525380.000 kmol of carbon",
  "31500.000 MWh"],
 "SECTION 7 gives the heaters' line an activity of 23121.448 in t CO2, the co2Tonnes SECTION 4 returns. 482000 kmol is the fuel typed in, 525380.000 kmol the carbon counted from it, and 31500.000 MWh the electricity line's activity.")

q(0, "At the heaters' typed destruction efficiency of 1, what do ch4Tonnes and unburnedNote read?",
 "ch4Tonnes 0.000 and unburnedNote none",
 ["ch4Tonnes 8.429 and unburnedNote none",
  "ch4Tonnes 0.000 and the escaped carbon note",
  "ch4Tonnes 42.143 and the escaped carbon note"],
 "SECTION 4 prints the heaters at 1: carbonKmolPerYear 525380.000, co2Tonnes 23121.448, ch4Tonnes 0.000, unburnedNote none. 8.429 and 42.143 are the methane at 0.999 and at 0.995.")

q(1, "The complete inventory's total intensity over inlet to export is 0.01176597. Which tonnes over which denominator does the digest give for it?",
 "42945.777 tCO2e over 3650000",
 ["30030.777 tCO2e over 3650000",
  "42945.777 tCO2e over 2410000",
  "12915.000 tCO2e over 3650000"],
 "SECTION 10: \"42945.777 tCO2e over 3650000 is 0.01176597 (computed here), the engine's total intensity on the first boundary.\" 2410000 is the crude export only denominator. The Scope 1 and Scope 2 intensities on the first boundary are 0.00822761 and 0.00353836.")

q(2, "On the course's set, what scope and GWP does each methane line carry?",
 "Scope 1, both at 29.8 on the course's set",
 ["Scope 1 for the flare and Scope 2 for the vented line",
  "Scope 1, the flare at 29.8 and the vented line at 27",
  "Scope 2, both at a GWP of 1 on the course's set"],
 "SECTION 7 prints Flaring (unburned CH4) and Vented and fugitive methane on scope 1, gas CH4, GWP 29.8, on IPCC AR6 GWP100, fossil methane. 27 is the AR6 non-fossil value, and Scope 2 holds only the purchased electricity line.")

q(0, "Which lines of the complete inventory carry the source Atom balance (conservation of mass)?",
 "Fired heaters (CO2), Flaring (CO2) and Flaring (unburned CH4)",
 ["Fired heaters (CO2) and Flaring (CO2), with no methane line",
  "All five lines, the electricity line through its 0.41 factor",
  "Fired heaters (CO2) alone, the one burner line of the five"],
 "SECTION 7 prints three lines with the source \"Atom balance (conservation of mass)\" and version \"not applicable\": the fired heaters, the flare's CO2 and the flare's unburned CH4. The vented line rests on the survey and the electricity line on the supplier statement.")

q(3, "At which step of the Igbogene build does the line count go from 4 to 5?",
 "The flare efficiency entered",
 ["The GWP set declared",
  "The electricity factor entered with its source",
  "The survey referenced"],
 "SECTION 9's lines column reads 4, 4, 5, 5, 5. The flare efficiency entered is the step where it moves, since a refused flare is one blocked line and a computed flare is two lines (SECTION 5 and SECTION 7).")

q(1, "The Igbogene first pass totals 23121.448 tCO2e. What do its computed and reportable flags read?",
 "computed true and reportable false",
 ["computed false and reportable false",
  "computed true and reportable true",
  "computed false and reportable true"],
 "SECTION 9 prints the first pass with 4 lines, Scope 1 23121.448, Scope 2 0.000, computed true, reportable false, because the global warming potential set is not declared and 3 line(s) could not be computed.")

emit(Q, '/root/wt-et-carbon-nextgen/tools/course-banks/carbon/beginner/cefb_m06.json', expect_n=15)
finish()
