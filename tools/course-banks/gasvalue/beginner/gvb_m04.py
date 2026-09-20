import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# gasvalue Associate m04, The Flare by the Rule. Digest sections 10 and 11.
# EGBEMA's efficiencies and GWP are the invented flare study's inputs.

q(2, "In the engine's 40 CFR 98.233(n) basis sentence, what does the combustion efficiency multiply?",
 "The hydrocarbon carbon",
 ["The carbon per mole, the CO2's included",
  "The methane in the gas",
  "The CO2 in the gas"],
 "\"CO2 = the CO2 in the gas plus the combustion efficiency times the hydrocarbon carbon; CH4 = the methane in the gas times one less the destruction efficiency.\"")

q(0, "Which methane does the engine count as escaping the flare?",
 "The methane in the gas times one less the destruction efficiency",
 ["Every unburned carbon atom, counted as methane",
  "The methane in the gas times one less the combustion efficiency",
  "The hydrocarbon carbon times one less the destruction efficiency"],
 "The methane that escapes is the methane in the gas times one less the destruction efficiency. Every unburned carbon counted as methane is the shortcut the digest prints beside the engine at 2083.055 t/yr against the engine's 1136.490.")

q(1, "What does the digest print for EGBEMA's methane if every unburned carbon atom is counted as methane, and over the engine's figure?",
 "2083.055 t/yr, 1.8329 over the engine's 1136.490",
 ["3788.301 t/yr, 1.8329 over the engine's 1136.490",
  "2083.055 t/yr, 1.8329 over the engine's 1531.658",
  "1531.658 t/yr, 1.0000 over the engine's 1136.490"],
 "The shortcut row reads 2083.055 t/yr and 1.8329 in the \"over the engine's\" column; the engine's row reads 1136.490 and 1.0000. 3788.301 is the engine's methane at a destruction efficiency of 0.9, and 1531.658 is the all-methane probe.")

q(1, "What does the engine's basis sentence say of unburned ethane and heavier?",
 "They are not methane and carry no GWP here.",
 ["They are counted as methane, one molecule a carbon atom.",
  "They carry the methane GWP.",
  "They pass through the flare as the CO2 in the gas does."],
 "The basis sentence closes: \"Unburned ethane and heavier are not methane and carry no GWP here.\" Only the methane in the gas enters the CH4 half of the rule.")

q(3, "A gas that is all CO2 is flared at EGBEMA's volume and days, with both efficiencies set to 0.5. What tonnes a year does the engine report?",
 "CO2 140054.324, methane 0.000",
 ["CO2 133751.879, methane 1531.658",
  "CO2 140054.324, methane 1531.658",
  "CO2 182079.024, methane 1136.490"],
 "Both all-CO2 rows, at EGBEMA's efficiencies and at 0.5, read 140054.324 and 0.000. 133751.879 and 1531.658 are the all-methane probe; 182079.024 and 1136.490 are EGBEMA's flare.")

q(0, "Which of the two efficiencies changes how much of the CO2 already in the gas leaves the flare as CO2?",
 "Neither: it leaves as CO2 at every efficiency.",
 ["The combustion efficiency, which sets the CO2.",
  "The destruction efficiency, which sets the share destroyed.",
  "Both, through the product of the two efficiencies."],
 "The digest: \"The CO2 already in the gas leaves the flare as CO2 at every efficiency, and none of it is methane.\" The all-CO2 probe reads 140054.324 t/yr at EGBEMA's efficiencies and at both efficiencies 0.5.")

q(2, "At what molar mass does the flare weigh its CO2 tonnes?",
 "44.009 kg/kmol, from FLARE_MOLAR_MASS",
 ["44.01, the reference table's figure",
  "44.096, propane's reference figure",
  "16.043 kg/kmol, from FLARE_MOLAR_MASS"],
 "FLARE_MOLAR_MASS gives CO2 44.009 kg/kmol and methane 16.043 kg/kmol for the flare's tonnes. The reference table carries CO2 at 44.01 for the gas's mass and liquids; 44.096 is propane's molar mass.")

q(1, "EGBEMA's call is run again with the combustion efficiency left out. Against the call with both given, what moves?",
 "The CO2 moves by 2798.286 t/yr and the methane holds at 1136.490.",
 ["The methane moves by 2798.286 t/yr and the CO2 holds at 182079.024.",
  "Both move: the CO2 by 2798.286 t/yr and the methane by 2798.285.",
  "Nothing moves: a missing combustion efficiency is refused."],
 "The \"left out minus given\" row reads 0.0150, 2798.286, 0.000 and 2798.285. The stand-in moves the CO2 and leaves the methane where it was, because the methane is set by the destruction efficiency alone. 2798.285 is the CO2e difference.")

q(0, "EGBEMA's combustion efficiency is typed blank (''). Which combustion efficiency does the engine use?",
 "0.97, the destruction efficiency standing in, with a note",
 ["0.955, the flare study's figure, kept from the case",
  "0.955, set 1.5 points below the destruction efficiency",
  "None: the call is refused until a figure is typed"],
 "The typed-blank row reads combustion efficiency used 0.97, the same as the row with it left out, and both rows carry the stand-in note. 0.955 is the figure the study gives when both are typed.")

q(2, "With the combustion efficiency left out, what does EGBEMA's flare give at a destruction efficiency of 1?",
 "flareCo2Tonnes 190473.881 with flareCh4Tonnes 0.000",
 ["flareCo2Tonnes 188608.357 with flareCh4Tonnes 378.830",
  "flareCo2Tonnes 140054.324 with flareCh4Tonnes 0.000",
  "flareCo2Tonnes 190473.881 with flareCh4Tonnes 378.830"],
 "The destruction efficiency 1 row reads flareCo2Tonnes 190473.881, flareCh4Tonnes 0.000, flareCo2eTonnes 190473.881 and a methane share of 0.0000. 188608.357 and 378.830 is the 0.99 row; 140054.324 is the all-CO2 probe.")

q(3, "In the destruction efficiency range (combustion left out), which input gives EGBEMA 3788.301 t of methane a year?",
 "0.9",
 ["0.95",
  "0.99",
  "0.97"],
 "The range reads methane 3788.301 at 0.9, 1894.151 at 0.95, 1136.490 at 0.97, 378.830 at 0.99 and 0.000 at 1.")

q(1, "Which efficiency does the digest define as the share oxidised to CO2?",
 "The combustion efficiency, which sets the CO2",
 ["The destruction efficiency, which sets the CO2",
  "The destruction efficiency, which sets the methane",
  "The combustion efficiency, which sets the methane"],
 "The DESTRUCTION efficiency is the share of hydrocarbon destroyed and sets the methane. The COMBUSTION efficiency is the share oxidised to CO2 and sets the CO2. A combustion efficiency cannot exceed the destruction efficiency.")

q(0, "In EGBEMA's \"left out minus given\" row the CO2 reads 2798.286 and the CO2e 2798.285, with the methane at 0.000. What reason does the digest give?",
 "Each tonnage is reported to three decimals before the difference is taken.",
 ["The CO2e carries the methane at the GWP, and the methane moved slightly.",
  "The CO2e is formed at 0.955 and the CO2 at 0.97.",
  "The CO2e weighs its CO2 at 44.01 and the CO2 row at 44.009."],
 "The rounding note: the engine reports each tonnage to three decimals before the difference is taken, so the CO2e difference and the CO2 difference can differ in the third decimal though the methane is the same.")

q(3, "The analysis is set to pure methane and EGBEMA's rate, days and flare study are kept. What comes back?",
 "133751.879 t/yr CO2 beside 1531.658 t/yr CH4",
 ["140054.324 t/yr CO2 beside 0.000 t/yr CH4",
  "133751.879 t/yr CO2 beside 1136.490 t/yr CH4",
  "182079.024 t/yr CO2 beside 1531.658 t/yr CH4"],
 "The all-methane row reads flareCo2Tonnes 133751.879 and flareCh4Tonnes 1531.658. 140054.324 and 0.000 are the all-CO2 probe; 182079.024 and 1136.490 are EGBEMA's gas.")

q(1, "With both efficiencies given, 0.97 and 0.955, which tonnes of CO2 and of methane a year does EGBEMA's flare report?",
 "182079.024 and 1136.490",
 ["184877.310 and 1136.490",
  "182079.024 and 2083.055",
  "215946.438 and 1136.490"],
 "EGBEMA's flare reads flareCo2Tonnes 182079.024 and flareCh4Tonnes 1136.490. 184877.310 is the CO2 with the combustion efficiency left out, 2083.055 is every unburned carbon counted as methane, and 215946.438 is the flare's CO2e.")

emit(Q, '/root/wt-et-gasvalue-nextgen/tools/course-banks/gasvalue/beginner/gvb_m04.json', expect_n=15)
finish()
