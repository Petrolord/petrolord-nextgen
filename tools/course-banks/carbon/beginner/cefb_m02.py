import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# carbon Associate m02, Carbon In, CO2 Out. Digest sections 2, 3 and 4.

q(1, "What does the engine's own statement of its combustion method say the atom balance needs as a source?",
 "No source document, because it is conservation of mass",
 ["A registered emission factor with its source and its version",
  "The declared GWP set, which converts the carbon it counts",
  "The fuel supplier's statement for the year it is run on"],
 "The course quotes the method verbatim: \"Atom balance: carbon in equals CO2 out. This is conservation of mass, so it needs no source document.\" In the lab's inventory each atom-balance line carries the source \"Atom balance (conservation of mass)\" and the version \"not applicable\"; the registered factors carry a source and a version.")

q(3, "One thousand kilomoles of a fuel with one carbon atom a molecule are burned at a destruction efficiency of 0.98. What does the engine return?",
 "co2Tonnes 43.129 and ch4Tonnes 0.321",
 ["co2Tonnes 43.569 and ch4Tonnes 0.160",
  "co2Tonnes 41.809 and ch4Tonnes 0.802",
  "co2Tonnes 44.009 and ch4Tonnes 0.000"],
 "The lesson's table gives the 0.98 row as carbon kmol 1000.000, co2Tonnes 43.129, ch4Tonnes 0.321. The other pairs are the rows for 0.99, 0.95 and complete combustion at 1.")

q(0, "In the 1000 kmol table, what does the carbon kmol column do as the destruction efficiency falls from 1 to 0.95?",
 "It reads 1000.000 in every row.",
 ["It falls with the efficiency, as co2Tonnes does.",
  "It rises with the efficiency, as ch4Tonnes does.",
  "It is blank below 1, as escaped carbon is not counted."],
 "The lesson's table prints carbon kmol 1000.000 on all four rows. The destruction efficiency divides that carbon between CO2 and methane: co2Tonnes falls from 44.009 to 41.809 and ch4Tonnes rises from 0.000 to 0.802.")

q(2, "Each kilomole of carbon that escapes combustion leaves as how many kilograms of methane?",
 "MW_CH4, which is 16.043",
 ["MW_CO2, which is 44.009",
  "MW_C, which is 12.011 alone",
  "The C2H6 molar mass, 30.070"],
 "The course: \"Each kilomole that escapes leaves as MW_CH4 kilograms of methane.\" The engine returns carbonAbatement.MW_CH4: 16.043. MW_CO2 weighs the carbon that burns, and 30.070 is ethane's row in FUEL_REFERENCE.")

q(1, "The Igbogene fired heaters burn 482000 kmol of fuel a year at 1.09 kmol of carbon per kmol, all invented. What carbonKmolPerYear does the engine return?",
 "525380.000 kmol",
 ["482000 kmol",
  "50820.000 kmol",
  "23121.448 kmol"],
 "The engine returns carbonKmolPerYear 525380.000 for the heaters. 482000 is the fuel quantity typed in, 50820.000 is the flare's carbon in the flare lesson, and 23121.448 is the heaters' co2Tonnes, a mass of CO2 in tonnes.")

q(3, "The same Igbogene heaters are run with a lower destruction efficiency typed, 0.995. What does the engine return?",
 "co2Tonnes 23005.841 and ch4Tonnes 42.143",
 ["co2Tonnes 23098.327 and ch4Tonnes 8.429",
  "co2Tonnes 23121.448 and ch4Tonnes 0.000",
  "co2Tonnes 22272.955 and ch4Tonnes 8.429"],
 "The course prints the 0.995 row as 23005.841 t of CO2 and 42.143 t of methane. The 0.999 row is 23098.327 and 8.429, and at the typed 1 the heaters return 23121.448 and 0.000. 22272.955 is the heaters' co2Tonnes in the row for a carbon per kmol of 1.05.")

q(2, "The heaters' fuel stays at 482000 kmol a year and the carbon per kilomole of fuel is typed as 1.05. What is co2Tonnes?",
 "22272.955",
 ["21212.338",
  "23121.448",
  "24394.189"],
 "The course prints the carbon per kmol table: 1.00 gives 21212.338, 1.05 gives 22272.955, the Igbogene 1.09 gives 23121.448 and 1.15 gives 24394.189 t of CO2.")

q(0, "How does the course describe the Igbogene heaters' carbon per kilomole of fuel, 1.09?",
 "The fuel analysis read as carbon atoms, typed in as an input",
 ["A default the engine applies when that box is left out",
  "A value read from the FUEL_REFERENCE methane row",
  "The supplier statement (invented), version 2025"],
 "The course: \"The carbon per kilomole of fuel is the fuel analysis read as carbon atoms: the Igbogene figure is an input.\" The engine refuses a call with the carbon per kmol left out, so there is no default, and the supplier statement is the source of the electricity factor in the inventory.")

q(1, "Which two flare calls get the same refusal, \"The destruction efficiency must lie in (0, 1].\"?",
 "A destruction efficiency of 0 and one of 98",
 ["A blank destruction efficiency and one of 0",
  "A destruction efficiency of 98 and a fuel of -1 kmol",
  "A destruction efficiency of 1 and one of 98"],
 "The engine returns the interval refusal for 0 and for 98 typed as a percentage. A blank is refused as required, a fuel of -1 kmol is refused as negative, and 1 lies inside (0, 1], so it computes: the lesson's table has a row at 1.")

q(3, "A flare call leaves the carbon per kilomole of fuel out. What does the engine say?",
 "REFUSED: A fuel quantity and the carbon per kilomole of fuel are required.",
 ["REFUSED: A fuel quantity and a carbon content cannot be negative.",
  "REFUSED: The destruction efficiency must lie in (0, 1].",
  "It computes at a stated default of 1 kmol of carbon a kmol of fuel."],
 "The engine returns \"REFUSED: A fuel quantity and the carbon per kilomole of fuel are required.\" for the carbon per kmol left out and for a blank fuel. The destruction efficiency left out of the call takes its stated default of complete combustion; the carbon per kmol left out is refused.")

q(0, "Fuel typed as -1 kmol on the flare: which refusal follows?",
 "REFUSED: A fuel quantity and a carbon content cannot be negative.",
 ["REFUSED: A fuel quantity and the carbon per kilomole of fuel are required.",
  "REFUSED: The destruction efficiency must lie in (0, 1].",
  "REFUSED: A registered emission factor is required."],
 "The engine returns the negative refusal for a fuel of -1 kmol. The \"are required\" refusal is for a blank fuel or a carbon per kmol left out, the interval refusal is for the efficiency, and the factor refusal belongs to emissionLine.")

q(2, "Which keys does combustionCo2FromCarbon's result carry for the gases it computes?",
 "co2Tonnes and ch4Tonnes, and no other gas",
 ["co2Tonnes, ch4Tonnes and n2oTonnes",
  "co2Tonnes only, with methane left to a factor line",
  "one key in tCO2e, converted on the declared set"],
 "The course: \"The engine's result carries these keys and no other gas: co2Tonnes, ch4Tonnes.\" Nitrous oxide from combustion is not computed by the atom balance (H4) and needs an emission factor line. In the lab's inventory the flare's 16.306 t CH4 is converted at a GWP of 29.8 on IPCC AR6 GWP100, fossil methane.")

q(1, "carbonAbatement.MW_CO2 reads 44.009. How does the course say it is built?",
 "12.011 plus two oxygens at 15.999",
 ["12.011 plus four hydrogens at 1.008",
  "12.011 plus two oxygens at 16.043",
  "The carbon atom alone, at 12.011"],
 "The course: MW_CO2 44.009 is 12.011 plus two oxygens at 15.999, and MW_CH4 16.043 is 12.011 plus four hydrogens at 1.008. MW_C, 12.011, is the carbon atom alone.")

q(2, "The Igbogene heaters' destruction efficiency is 1. How does the course record it?",
 "Typed in the call, for complete combustion",
 ["Left out of the call, so the stated default applied",
  "Taken from the operator's flare study",
  "Set by the engine for every burner call"],
 "The course lists the inputs as \"destruction efficiency 1 (complete combustion, typed)\". The stated default applies only to an argument left out of the call, and the flare study states the flare's 0.98.")

q(0, "The course explains why 1000 kmol of carbon burned completely is 44.009 t of CO2. What is the explanation?",
 "Each kilomole of carbon that burns leaves as MW_CO2 kilograms of CO2.",
 ["A registered factor of 44.009 is applied to each tonne of the fuel burned.",
  "Each kilomole of carbon that burns leaves as MW_CH4 kilograms of CO2.",
  "The CO2 is weighed at MW_C and then converted at the set's GWP."],
 "The course gives this as the reason 1000 kmol burned completely is 44.009 t. The method uses no registered factor, and MW_CH4 is for escaped carbon.")

emit(Q, '/root/wt-et-carbon-nextgen/tools/course-banks/carbon/beginner/cefb_m02.json', expect_n=15)
finish()
