import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# carbon Associate m05, Lines, Factors and Provenance. Digest sections 7, 9 and 10.

q(0, "What source and version does the Igbogene purchased electricity factor carry in the complete inventory?",
 "Supplier statement (invented), version 2025",
 ["Epie Creek leak detection survey (invented), 2026 Q2",
  "Atom balance (conservation of mass), not applicable",
  "None, so the line is counted as unsourced"],
 "The lab prints the Purchased electricity line with factor 0.41 tCO2/MWh (invented and SYNTHETIC), source \"Supplier statement (invented)\", version 2025 and provenance complete true. The survey is the vented methane's source, the atom balance the combustion lines', and the complete inventory has 0 unsourced lines.")

q(2, "Why is the Igbogene first pass not reportable, as buildInventory states it?",
 "the global warming potential set is not declared; 3 line(s) could not be computed",
 ["1 factor(s) have no source or version; 2 line(s) could not be computed",
  "1 factor(s) have no source or version; 1 line(s) could not be computed",
  "1 factor(s) have no source or version"],
 "The lab prints the first pass reason as \"the global warming potential set is not declared; 3 line(s) could not be computed\". The other three are the reasons at the next three steps: the GWP set declared, the flare efficiency entered, and the electricity factor entered with its source.")

q(3, "Which step of the Igbogene inventory is the first that buildInventory reads as reportable?",
 "The survey referenced",
 ["The electricity factor entered with its source",
  "The flare efficiency entered",
  "The GWP set declared"],
 "The lab prints reportable false on the first four steps and true only on \"the survey referenced\", whose reason reads none. The step before it totals the same 42945.777 tCO2e and is not reportable because 1 factor(s) have no source or version.")

q(1, "In the first pass the vented methane survey is not referenced, yet the unsourced line count reads 0. What does the course say?",
 "A blocked line is not also counted as unsourced.",
 ["An unsourced line is counted only once reportable is true.",
  "A factor of 1 needs no source, so the survey is not counted.",
  "The vented line was excluded on purpose, and adds no line."],
 "The course: \"The first pass has 3 blocked line(s) and 0 unsourced line(s); a blocked line is not also counted as unsourced.\" The vented line is blocked there for want of a GWP for CH4. At the next step the reason \"1 factor(s) have no source or version\" appears while reportable is still false.")

q(0, "In the first pass, what does the engine name as blocking the Vented and fugitive methane line?",
 "no global warming potential for CH4 in the declared set",
 ["no factor value",
  "A registered emission factor is required.",
  "a negative activity: an emission line cannot remove tonnes"],
 "The lab lists the first pass blocked lines: Flaring blocked by the destruction efficiency refusal, Vented and fugitive methane by \"no global warming potential for CH4 in the declared set\" and Purchased electricity by \"no factor value\". The other two reasons belong to the Diesel generators line and to the vented activity typed as -142 t.")

q(2, "At the step \"the GWP set declared\", what does the Igbogene Scope 1 total read?",
 "27353.048 tCO2e",
 ["23121.448 tCO2e",
  "30030.777 tCO2e",
  "25799.177 tCO2e"],
 "The lab prints Scope 1 at 23121.448 in the first pass, 27353.048 once the GWP set is declared and 30030.777 once the flare efficiency is entered. 25799.177 is the total of the inventory with a negative activity and a negative factor.")

q(3, "The vented methane activity is typed as -142 t. What does buildInventory do with that line?",
 "Blocks it: an emission line cannot remove tonnes.",
 ["Subtracts 4231.600 tCO2e from the Scope 1 total.",
  "Reads it as 142.000 t and computes it as normal.",
  "Refuses the GWP set, so the set is not declared."],
 "The course prints the line \"Vented methane typed as -142 t\" with tCO2e none, blocked by \"a negative activity: an emission line cannot remove tonnes\". That inventory totals 25799.177 tCO2e and is not reportable.")

q(1, "A Diesel generators line with no registered factor is added to the complete inventory. What reason does its blocked line carry?",
 "A registered emission factor is required.",
 ["no factor value, so it is read as zero",
  "scope 3 is not Scope 1 or Scope 2",
  "1 factor(s) have no source or version"],
 "The lab prints the Diesel generators line with the reason \"A registered emission factor is required.\" The scope 3 reason belongs to Business travel. With both lines added the total stays 42945.777 tCO2e and the inventory is not reportable because 2 line(s) could not be computed.")

q(0, "The course's line shares of the Igbogene total, as printed, sum to 1.000001. What does its rounding note say?",
 "Each share is rounded to six decimals; the unrounded shares sum to 1.",
 ["A line is counted twice, once as CO2 and once as methane, in the total.",
  "The flare's methane share is added to the flare's CO2 share a second time.",
  "The total includes a blocked line that the shares leave out of the sum."],
 "The course: \"ROUNDING NOTE: the shares as printed sum to 1.000001; each is rounded to six decimals from the unrounded quotient, and the unrounded shares sum to 1.\" The complete inventory has 0 blocked lines.")

q(3, "Over the boundary \"Igbogene crude export only\", what total intensity does carbonIntensity return?",
 "0.01781982 tCO2e per barrel of oil exported",
 ["0.01176597 tCO2e per barrel of oil exported",
  "0.01246090 tCO2e per barrel of oil exported",
  "0.00535892 tCO2e per barrel of oil exported"],
 "The lab prints crude export only, denominator 2410000, Scope 1 intensity 0.01246090, Scope 2 intensity 0.00535892 and total intensity 0.01781982. 0.01176597 is the total over the inlet to export boundary, per barrel of oil equivalent produced.")

q(2, "What two conditions does the engine's comparability note on an intensity set?",
 "The same boundary and the same global warming potential set",
 ["The same denominator and the same reporting year for both",
  "The same boundary and the same Scope 2 electricity factor",
  "The same GWP set and a Scope 1 total of the same size"],
 "The course quotes the note: \"Comparable only with an intensity on the same boundary (Igbogene flow station and gas plant, inlet to export) and the same global warming potential set (IPCC AR6 GWP100, fossil methane).\"")

q(1, "With the electricity factor blank, what does the total intensity over the inlet to export boundary read?",
 "0.00822761, reportable false",
 ["0.01176597, reportable true",
  "0.00822761, reportable true",
  "REFUSED: A positive denominator is required."],
 "The course: with the electricity factor blank the total intensity is 0.00822761 tCO2e per barrel of oil equivalent produced, reportable false, because 1 line(s) could not be computed. An intensity inherits its inventory's status. 0.01176597 is the complete inventory's total intensity.")

q(3, "The engine's disclaimer on the inventory names three things that belong in the compliance register. Which three?",
 "Obligations, evidence and deadlines",
 ["Factors, sources and versions of each line",
  "Scope 1, Scope 2 and the total, in tCO2e",
  "Blocked lines, their reasons and the set"],
 "The course quotes it: \"This is a quantitative inventory. It is not a regulatory compliance register: obligations, evidence and deadlines belong in the compliance register, and keeping a second copy of them here would create two records that could disagree.\" The inventory itself carries each line's factor, source and version, its totals and its blocked lines.")

q(0, "In the first pass, Scope 2 reads 0.000 tCO2e. What does the lab show behind that figure?",
 "Its one line, Purchased electricity, is blocked: no factor value.",
 ["Igbogene bought no electricity in the year the first pass covers.",
  "The electricity line is on scope 3, which the inventory never totals.",
  "The factor 0.41 is present with no source, so it is counted as zero."],
 "The lab lists Purchased electricity among the first pass blocked lines, \"blocked: no factor value\". Once the factor is entered with its source, Scope 2 reads 12915.000. The lab prints the line on scope 2 with an activity of 31500.000 MWh.")

q(2, "Read as activity x factor x GWP, which row matches Purchased electricity?",
 "31500.000 MWh at 0.41 tCO2/MWh and a GWP of 1: 12915.000 tCO2e",
 ["31500.000 MWh at 0.41 tCO2/MWh and a GWP of 29.8: 4231.600 tCO2e",
  "12915.000 MWh at 0.41 tCO2/MWh and a GWP of 1: 31500.000 tCO2e",
  "31500.000 MWh at 1 tCO2/MWh and a GWP of 0.41: 12915.000 tCO2e"],
 "The lab prints Purchased electricity: activity 31500.000 MWh, factor 0.41 tCO2/MWh (invented and SYNTHETIC), GWP 1, tonnes of gas 12915.000, tCO2e 12915.000. Every line is activity x factor x GWP (checked here). 4231.600 is the vented methane line, at a GWP of 29.8 on IPCC AR6 GWP100, fossil methane.")

emit(Q, '/root/wt-et-carbon-nextgen/tools/course-banks/carbon/beginner/cefb_m05.json', expect_n=15)
finish()
