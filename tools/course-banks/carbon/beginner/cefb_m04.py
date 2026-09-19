import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# carbon Associate m04, Global Warming Potentials. Digest sections 6 and 8.

q(3, "Rebuilt on IPCC AR6 GWP100, non-fossil methane, what does the vented and fugitive methane line read?",
 "3834.000 tCO2e",
 ["4231.600 tCO2e",
  "4260.000 tCO2e",
  "3976.000 tCO2e"],
 "SECTION 8 prints the vented line at 4231.600 on AR6 fossil, 3834.000 on AR6 non-fossil, 4260.000 on AR5 fossil and 3976.000 on AR5 non-fossil. The 142.000 t of methane is the same on every row.")

q(1, "The flare's unburned methane line reads 489.183 tCO2e. On which set was it converted?",
 "IPCC AR5 GWP100, fossil methane",
 ["IPCC AR6 GWP100, fossil methane",
  "IPCC AR6 GWP100, non-fossil methane",
  "IPCC AR5 GWP100, non-fossil methane"],
 "SECTION 8 prints Flaring (unburned CH4) at 485.922 on AR6 fossil, 440.265 on AR6 non-fossil, 489.183 on AR5 fossil and 456.571 on AR5 non-fossil.")

q(0, "Which total does SECTION 8 print for the inventory on IPCC AR5 GWP100, non-fossil methane?",
 "42660.826 tCO2e",
 ["42945.777 tCO2e",
  "42502.520 tCO2e",
  "42977.438 tCO2e"],
 "SECTION 8 prints the totals: 42945.777 on AR6 fossil, 42502.520 on AR6 non-fossil, 42977.438 on AR5 fossil and 42660.826 on AR5 non-fossil. Scope 2 is 12915.000 under all four.")

q(2, "When the Igbogene inventory is rebuilt on another GWP set, which lines move?",
 "Only the methane lines, since every CO2 line has a GWP of 1 on every set",
 ["Every line, since each set also rescales the CO2 lines it is given as well",
  "Only Scope 2, the purchased electricity line, on each of the sets",
  "Only the flare's two lines, since vented methane carries a factor of 1 in its line"],
 "SECTION 8: \"Only the methane lines move; every CO2 line has a GWP of 1 on every set.\" Scope 2 reads 12915.000 on all four sets, and the vented line moves with the set as the flare's methane line does.")

q(1, "Which two methane values does AR6 give in the sets the course prints?",
 "29.8 for fossil methane and 27 for non-fossil",
 ["30 for fossil methane and 28 for non-fossil",
  "27 for fossil methane and 29.8 for non-fossil",
  "29.8 for fossil methane and 273 for non-fossil"],
 "SECTION 6 prints AR6 fossil CH4 29.8 and AR6 non-fossil CH4 27; AR5 gives 30 and 28. 273 is the AR6 value for N2O.")

q(3, "What N2O value do both AR5 sets carry?",
 "265",
 ["273",
  "28",
  "30"],
 "SECTION 6 prints N2O 265 on both AR5 sets and 273 on both AR6 sets. 28 and 30 are the AR5 methane values, non-fossil and fossil.")

q(0, "Which makeGwpSet call returns a set the engine reads as declared?",
 "A label with values, such as IPCC AR6 GWP100, fossil methane",
 ["Values given with no label, however complete the values given are",
  "A label given with no values, such as a set name typed on its own",
  "A label with a methane GWP of 0 and an N2O value of 273"],
 "SECTION 6: a set is declared only with a label and at least one value. Values with no label, and a label with no values, both read declared false. SECTION 2 refuses a methane GWP of 0, and the set then reads declared false.")

q(2, "The engine's note on every GWP set says the set is stated on every result. What reason does the note give?",
 "An inventory on one report is not comparable with one on another.",
 ["The operator must file on the report that the set names, in each year.",
  "The set also changes the CO2 lines, which then need a label.",
  "The difference from the course set is computed on each result."],
 "SECTION 6 quotes the note: \"Global warming potentials differ between IPCC assessment reports. An inventory on one report is not comparable with one on another, so the set is stated on every result.\" Every CO2 line has a GWP of 1 on every set, and which report to file on is held (H1).")

q(1, "For which methane does the engine's methane note call the fossil value the consistent one?",
 "Vented, fugitive and unburned fossil methane alike",
 ["Unburned methane only; vented methane takes non-fossil",
  "None: the note leaves either value open for every line",
  "Vented methane only; flare methane is counted as CO2"],
 "SECTION 6 quotes the methane note on every set. It closes: \"the fossil value is the consistent one for vented, fugitive and unburned fossil methane alike.\"")

q(3, "Measured from the course set, what does SECTION 8 print for the AR6 non-fossil total?",
 "-443.257 tCO2e",
 ["-284.951 tCO2e",
  "31.661 tCO2e",
  "0.000 tCO2e"],
 "SECTION 8 prints the total less the course set as 0.000 on AR6 fossil, -443.257 on AR6 non-fossil, 31.661 on AR5 fossil and -284.951 on AR5 non-fossil (computed here).")

q(0, "What does the course state about which IPCC report a Nigerian operator should file on?",
 "It is a regulatory reading and the owner's decision; the course grades no choice between them.",
 ["AR6, since every inventory in the course is computed on IPCC AR6 GWP100, fossil methane, as a rule.",
  "AR5, since the digest states that UNFCCC reporting has required it of operators until now.",
  "Whichever report gives the lower Igbogene total, which the digest prints for all four of the sets."],
 "H1 holds the filing choice as a regulatory reading, with any recommended default left to the owner. Both reports are taught, and neither is graded as the answer.")

q(2, "The four sets the course types in are tabulated in which document?",
 "GHG Protocol, IPCC Global Warming Potential Values, version 2.0",
 ["carbonAbatement's own GWP table, shipped with the engine",
  "IPCC AR6 WG1 chapter 7 alone, for all four of the sets",
  "The supplier statement (invented), 2025, as for the factors"],
 "SECTION 6: the four sets are IPCC 100-year values as tabulated in GHG Protocol, \"IPCC Global Warming Potential Values\", version 2.0, 7 August 2024, adapted from IPCC AR6 WG1 chapter 7 and IPCC AR5 WG1 chapter 8. The engine ships no GWP.")

q(1, "Why does the course compute every inventory on IPCC AR6 GWP100, fossil methane?",
 "The engine counts escaped carbon as methane, as its methane note states.",
 ["AR6 is the report an operator must file on, as the course recommends.",
  "It is the set the engine applies when no set has been declared at all.",
  "It gives the lowest Igbogene total of the four sets the digest prints."],
 "SECTION 6: \"Every inventory in this course is computed on 'IPCC AR6 GWP100, fossil methane', because the engine counts escaped carbon as methane\" (the methane note). With no set declared, SECTION 9 blocks the vented line, and SECTION 8 prints a lower total, 42502.520, on AR6 non-fossil.")

q(3, "Where does the engine record which GWP set an inventory was converted on?",
 "In gwpSetLabel on every result, and an intensity carries it too",
 ["In each line's factor record, as the source of that factor",
  "In the atom balance method sentence, beside conservation of mass",
  "In the comparability note alone, and nowhere on the inventory"],
 "SECTION 8: \"The engine states its set on every result (gwpSetLabel), and an intensity carries it too (SECTION 10).\" SECTION 7 prints gwpSetLabel: IPCC AR6 GWP100, fossil methane on the complete inventory, and the factor records name sources such as the supplier statement (invented).")

q(2, "What horizon do all four of the course's GWP sets share?",
 "100-year (GWP100)",
 ["The horizon differs by report",
  "It differs between fossil and non-fossil",
  "None is stated beside the values"],
 "SECTION 6 prints the horizon column as 100-year (GWP100) on all four sets, AR6 and AR5, fossil and non-fossil.")

emit(Q, '/root/wt-et-carbon-nextgen/tools/course-banks/carbon/beginner/cefb_m04.json', expect_n=15)
finish()
