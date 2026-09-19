import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# carbon Associate m01, What an Inventory Counts. Digest sections 1 and 2.

q(2, "Which function does energyEfficiency.priceSaving call to cost a tonne of carbon saved?",
 "carbonAbatement.abatementCost",
 ["carbonAbatement.carbonIntensity",
  "carbonAbatement.abatementCurve",
  "energyEfficiency.excessAirSaving"],
 "SECTION 1: the Efficiency Studio's cost per tonne is carbonAbatement.abatementCost called from inside energyEfficiency.priceSaving, so a tonne saved in either app is costed by one carbonAbatement function.")

q(0, "What does the constant carbonAbatement.SCOPE hold?",
 "ONE 1 and TWO 2",
 ["ONE 1, TWO 2 and THREE 3",
  "ONE 1 only, with purchased energy as a flag",
  "DIRECT and PURCHASED, with no numbers"],
 "SECTION 1 prints carbonAbatement.SCOPE: ONE 1, TWO 2. The inventory labels its totals Scope 1 (direct) and Scope 2 (purchased energy), and a line on scope 3 is blocked because it is not Scope 1 or Scope 2.")

q(3, "A Business travel line on scope 3 is added to the complete Igbogene inventory. What does buildInventory do with it?",
 "Blocks it with its reason; the total stays 42945.777 tCO2e and reportable reads false.",
 ["Adds it to the total, which then moves above 42945.777 tCO2e, and stays reportable.",
  "Drops it with no line and no reason, and the inventory stays reportable.",
  "Refuses the whole inventory, which then returns no total and names no line at all."],
 "SECTION 9: the scope 3 line is blocked with the reason \"scope 3 is not Scope 1 or Scope 2, which is all this inventory totals\". The totals stay the Scope 1 and Scope 2 figures of SECTION 7, total tCO2e 42945.777, and the inventory stops being reportable.")

q(1, "A flare call reaches combustionCo2FromCarbon with the destruction efficiency null. What does the engine say?",
 "REFUSED: A destruction efficiency is required. It is not read as 100 percent: for a flare it is the answer, and it is contested.",
 ["REFUSED: The destruction efficiency must lie in (0, 1].",
  "REFUSED: A fuel quantity and the carbon per kilomole of fuel are required.",
  "REFUSED: A fuel quantity and a carbon content cannot be negative."],
 "SECTION 2 prints the same refusal for a blank and for a null destruction efficiency. The interval refusal is for 0 or for 98 typed as a percentage, and the other two are for a missing or a negative fuel quantity.")

q(2, "combustionCo2FromCarbon({ fuelKmolPerYear: 1000, carbonPerKmolFuel: 1 }) leaves the destruction efficiency out of the call. What does it answer?",
 "destructionEfficiencyFraction 1, co2Tonnes 44.009, ch4Tonnes 0.000",
 ["destructionEfficiencyFraction 0.98, co2Tonnes 43.129, ch4Tonnes 0.321",
  "destructionEfficiencyFraction 0.99, co2Tonnes 43.569, ch4Tonnes 0.160",
  "A refusal naming the destruction efficiency as required"],
 "SECTION 2: left out of the call, the destruction efficiency takes its stated default of complete combustion, and this call answers destructionEfficiencyFraction 1, co2Tonnes 44.009, ch4Tonnes 0.000. The refusal is for a blank or null box. The 0.98 and 0.99 rows are SECTION 3 calls with the efficiency typed.")

q(0, "The digest says who the default of complete combustion is for. What does it say?",
 "A burner is the case it is for; a flare is asked for its efficiency every time.",
 ["A flare is the case it is for; a burner is asked for its efficiency every time.",
  "Every source, burner or flare, whenever the destruction efficiency box is blank.",
  "No source at all: the argument has no default and must always be typed."],
 "SECTION 2 prints: \"A burner is the case that default is for. A flare is asked for its efficiency every time.\" A blank box is refused, and an argument left out takes the stated default, so the argument does have one.")

q(3, "carbonIntensity is called with no boundary named. What does the engine say?",
 "REFUSED: A boundary must be named. Tonnes per tonne charged and tonnes per tonne of saleable product are different numbers for the same plant, and an intensity without its boundary cannot be compared with anything.",
 ["REFUSED: A positive denominator is required.",
  "REFUSED: A registered emission factor is required.",
  "REFUSED: A global warming potential must be positive. Refused for CH4, so the set is not declared."],
 "SECTION 2 prints the boundary refusal for this call. carbonIntensity gives the denominator refusal for a denominator of 0 or a blank one; the factor refusal belongs to emissionLine and the GWP refusal to makeGwpSet.")

q(1, "A named boundary and a denominator of 0 reach carbonIntensity. What comes back?",
 "REFUSED: A positive denominator is required.",
 ["An intensity with reportable set to false",
  "REFUSED: A boundary must be named.",
  "The total tCO2e, with the denominator read as 1"],
 "SECTION 2 prints \"REFUSED: A positive denominator is required.\" for a denominator of 0 and for a blank denominator. The boundary refusal is for a call with no boundary named, and no row reads a 0 or a blank as some other figure.")

q(2, "makeGwpSet is given a methane GWP of 0. What comes back?",
 "A refusal for CH4, and the set reads declared false",
 ["A set declared true that converts methane at 0",
  "A refusal for CH4, with the set still declared true",
  "A set declared true, with CH4 read as the CO2 value of 1"],
 "SECTION 2: a methane GWP of 0, and one of -5, return \"REFUSED: A global warming potential must be positive. Refused for CH4, so the set is not declared.\" The set then reads declared false.")

q(0, "What does makeGwpSet({}) return?",
 "label none, gases 0, declared false",
 ["label none, gases 4, declared true",
  "REFUSED, with no set returned at all",
  "the course's set, declared true"],
 "SECTION 1 prints the row for makeGwpSet({}): label none, gases 0, declared false. The engine ships no GWP, so an empty call returns an empty set and fills in nothing.")

q(1, "A factor is typed with a value of 2.5 tCO2/t and nothing else. What does its record read?",
 "hasValue true, provenanceComplete false, missingProvenance source, version",
 ["hasValue false, provenanceComplete false, and missingProvenance value, source",
  "hasValue true, provenanceComplete true, and missingProvenance none at all",
  "A refusal from emissionLine, with no record returned at all"],
 "SECTION 1 prints the row for \"A factor typed with no source\": value 2.5, unit tCO2/t, gas CO2, hasValue true, provenanceComplete false, missingProvenance source, version. A value with nothing else is still a record, and the record says what it lacks.")

q(3, "Which of these does neither engine module export?",
 "An emission factor or a global warming potential",
 ["A molar mass each for carbon, CO2 and methane, in kg/kmol",
  "A table of fuels with typical LHV and HHV heating values",
  "A list of heating value bases, reading LHV and HHV"],
 "SECTION 1: \"Neither module exports an emission factor or a global warming potential.\" carbonAbatement exports MW_C, MW_CO2 and MW_CH4, and energyEfficiency exports FUEL_REFERENCE with typical heating values and HEATING_VALUE_BASIS: LHV, HHV.")

q(2, "What does FUEL_REFERENCE_NOTE say about the heating values in energyEfficiency's fuel table?",
 "They are typical: the fuel analysis governs, and a measured value should replace these.",
 ["They are definitional, like the atom counts, and drive the stoichiometry.",
  "They are the IUPAC values, and no fuel analysis may change them in a call.",
  "They are defaults the engine reads whenever a heating value box is blank."],
 "SECTION 1's note on the fuel table labels the heating values typical, says the fuel analysis governs, and asks for a measured value in their place. The definitional label belongs to the atom counts.")

q(1, "Which Igbogene line is the one line on Scope 2?",
 "Purchased electricity, 12915.000 tCO2e",
 ["Vented and fugitive methane, 4231.600 tCO2e",
  "Flaring (CO2), 2191.807 tCO2e",
  "Fired heaters (CO2), 23121.448 tCO2e"],
 "SECTION 7 prints Purchased electricity on scope 2 at 12915.000 tCO2e, and Scope 2 is the sum of its 1 line. The heaters, the flare's two lines and the vented methane are the 4 lines of Scope 1.")

q(3, "PROPERTY_REFERENCE lists a latent heat of vaporisation of water of 2442 kJ/kg. How does the table label it?",
 "Typical, at a 25 C reference",
 ["Measured on the Igbogene fuel gas",
  "Definitional, like the atom counts",
  "A default the stack loss applies unlabelled"],
 "SECTION 1 heads the table \"typical values a stack loss needs, each labelled as typical\", and the waterLatentHeatKJkg row reads 2442, at 25 C reference.")

emit(Q, '/root/wt-et-carbon-nextgen/tools/course-banks/carbon/beginner/cefb_m01.json', expect_n=15)
finish()
