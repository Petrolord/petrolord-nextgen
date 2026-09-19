import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# gasvalue Associate m01, What Is Being Flared. Digest sections 1, 2, 3 and 4.

q(2, "Which flareToValue function answers the studio question \"what is in this gas, and how much liquid could it give\"?",
 "characteriseGas",
 ["creditSensitivity",
  "screenRoute",
  "routeEconomics"],
 "The digest's table of questions pairs that question with characteriseGas. creditSensitivity answers whether the project needs carbon credits to clear its hurdle, screenRoute answers which way of selling the gas it allows, and routeEconomics answers what a route makes, earns and costs in a year.")

q(0, "What does the digest's export table count for flareToValue?",
 "7 exported functions and 10 exported constants and tables",
 ["10 exported functions and 9 exported constants and tables",
  "10 exported functions and 7 exported constants and tables",
  "10 exported functions and 10 exported constants and tables"],
 "The flareToValue row reads 7 functions (abatement, characteriseGas, compareRoutes, creditSensitivity, routeEconomics, screenRoute, yieldCeiling) and 10 constants and tables. 10 functions and 9 constants and tables is the lpgCng row.")

q(3, "lpgCng calls three modules and writes none of the three itself. What does it call terminalDepot for?",
 "The loading-rack queue, for its carousel and forecourt",
 ["The gas Z factor, for the gas in a bank",
  "The compressor train, for the station compressor",
  "The power law, for scaling a plant's capital"],
 "The digest says lpgCng calls the loading-rack queue in terminalDepot for its carousel and forecourt, the gas Z factor in production/gasProperties and the compressor train in facilities/compression. The capital power law is in modularRefinery, which flareToValue uses.")

q(1, "SCF_PER_LBMOL reads 379.49. What does the constant count?",
 "Standard cubic feet in one lb-mol",
 ["Pounds in one kilogram",
  "US gallons in one cubic foot",
  "Cubic metres in one standard cubic foot"],
 "The constants table gives SCF_PER_LBMOL 379.49, standard cubic feet in one lb-mol. Pounds in one kilogram is LB_PER_KG (2.20462262), US gallons in one cubic foot is GAL_PER_FT3 (7.480519) and cubic metres in one standard cubic foot is lpgCng's M3_PER_SCF (0.02831684659).")

q(1, "One Mscf of methane carries 19.1757 kg and one Mscf of carbon dioxide carries 52.6038 kg. What does the digest say the two rows hold the same?",
 "The count of moles",
 ["The mass in the Mscf",
  "The molar mass behind the row",
  "The typical heating value of the gas"],
 "A standard cubic foot counts gas at 60 F and 14.696 psia, so every row is the same count of moles and the mass follows the molar mass: 16.043 lb/lbmol for methane and 44.01 for carbon dioxide. The heating values differ too, 1010 Btu/scf for methane against 0 for carbon dioxide.")

q(3, "How does the digest say kgPerMscf is built from the engine's constants?",
 "1000 over SCF_PER_LBMOL gives the lb-mol, times the molar mass gives pounds, over LB_PER_KG gives kilograms",
 ["1000 times SCF_PER_LBMOL gives the lb-mol, times the molar mass gives pounds, times LB_PER_KG gives kilograms",
  "1000 over SCF_PER_LBMOL gives the lb-mol, times GAL_PER_FT3 gives cubic feet, over LB_PER_KG gives kilograms",
  "SCF_PER_LBMOL over 1000 gives the lb-mol, times the molar mass gives pounds, over LB_PER_KG gives kilograms"],
 "The lb-mol in one Mscf is 1000 over SCF_PER_LBMOL, the pounds are that times the mole-weighted molar mass, and the kilograms are the pounds over LB_PER_KG. Done on the constants it gives 19.1757 for methane and 52.6038 for carbon dioxide, a difference of 0.0000 from the engine on both rows.")

q(1, "Propane's molar mass in the reference is 44.096 lb/lbmol. What kgPerMscf does characteriseGas give for one Mscf of pure propane?",
 "52.7066",
 ["52.6038",
  "35.9417",
  "33.4842"],
 "Pure propane gives 52.7066 kg in one Mscf. 52.6038 is pure carbon dioxide at 44.01 lb/lbmol, 35.9417 is pure ethane at 30.07 and 33.4842 is pure nitrogen at 28.014.")

q(2, "Which rows of GAS_COMPONENT_REFERENCE are marked inert?",
 "N2 and CO2",
 ["N2 alone",
  "CO2 alone",
  "C1, N2 and CO2"],
 "The inert column reads true on N2 (Nitrogen) and CO2 (Carbon dioxide) and false on every other row, C1 included. Both inert rows carry a typical heating value of 0.")

q(3, "The CO2 row carries one carbon per molecule and is marked inert. What does the digest say about that carbon?",
 "It is counted when the carbon per mole is counted, and CO2 is no fuel.",
 ["It is left out of the carbon per mole, because the row is marked inert.",
  "It is counted as a fuel carbon, at the typical heating value of methane.",
  "It is counted at zero in the carbon per mole, as nitrogen's row is."],
 "The digest's sentence on the row: its carbon is counted when the carbon per mole is counted, and it is not a fuel. The CO2 row's typical heating value is 0, and nitrogen carries 0 carbon per molecule where CO2 carries 1.")

q(0, "The engine's note on GAS_COMPONENT_REFERENCE calls two of its columns definitional. Which two?",
 "Molar masses and carbon numbers",
 ["Heating values and liquid densities",
  "Molar masses and heating values",
  "Carbon numbers and liquid densities"],
 "The note: \"Molar masses and carbon numbers are definitional. Heating values and liquid densities are typical: the gas analysis and the certificate govern, and a measured value should replace these.\"")

q(1, "Which code does GAS_COMPONENT_REFERENCE label \"Pentanes plus\", and how many carbon per molecule does its row carry?",
 "C5, with 5",
 ["NC4, with 4",
  "C5, with 4",
  "IC4, with 5"],
 "The C5 row is labelled Pentanes plus and carries 5 carbon per molecule. IC4 (Iso-butane) and NC4 (n-Butane) each carry 4.")

q(1, "EGBEMA's sheet is typed short, summing to 0.9850. What does characteriseGas do with it?",
 "It scales the fractions to one and says so in a note.",
 ["It refuses the sheet: the gas composition sums to nothing.",
  "It uses the fractions as typed and reports their raw sum.",
  "It adds the shortfall to methane and leaves the rest as typed."],
 "The normalisationNote reads: \"The mole fractions summed to 0.985 and were scaled to one. Check the analysis if that was not intended.\" Every normalised figure on the short sheet differs from its typed figure, C1 0.73 becoming 0.7411.")

q(0, "On the short EGBEMA sheet, which fractions does the engine work with for methane and nitrogen?",
 "C1 0.7411 and N2 0.0183",
 ["C1 0.7420 and N2 0.0180",
  "C1 0.7411 and N2 0.018",
  "C1 0.73 and N2 0.018"],
 "The normalised short-sheet column reads C1 0.7411 and N2 0.0183: the nitrogen moves from its typed 0.018 as the methane moves from 0.73. C1 0.7420 and N2 0.0180 are the full sheet's normalised figures.")

q(3, "Which function do the studios use to answer \"does the project need carbon credits to clear its hurdle\"?",
 "creditSensitivity",
 ["compareRoutes",
  "routeEconomics",
  "screenRoute"],
 "creditSensitivity is the function paired with the credits question. The bid, a route's year and the selling routes go to the other three.")

q(2, "Which of these constants is one that lpgCng exports?",
 "PSI_PER_BAR",
 ["SCF_PER_LBMOL",
  "RICHNESS_GPM",
  "FLARE_MOLAR_MASS"],
 "PSI_PER_BAR is in lpgCng's list of 9, with M3_PER_SCF and KJ_PER_KWH. SCF_PER_LBMOL, RICHNESS_GPM and FLARE_MOLAR_MASS are three of flareToValue's 10.")

emit(Q, '/root/wt-et-gasvalue-nextgen/tools/course-banks/gasvalue/beginner/gvb_m01.json', expect_n=15)
finish()
