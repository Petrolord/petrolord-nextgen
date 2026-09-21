import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# carbon Professional m01, combustion from the fuel analysis.
# Draws on m01's four lessons only: digest SECTION 11 (the invented Isiokpo
# fuel gas through combustionStoichiometry) and the SECTION 1 constants those
# lessons quote (FUEL_REFERENCE, the air constants, ATMOSPHERIC_N2_MOLAR_MASS).
# Every figure is a string the digest prints; the analysis is invented.

q(1, "SECTION 11 states the oxygen demand of each component of the invented Isiokpo fuel gas. Which rule does it print?",
 "c + h/4 + s - o/2, weighted by the component's mole fraction.",
 ["c + h/2 + s - o/2, weighted by the component's mole fraction.",
  "c + h/4 + s + o/2, weighted by the component's molar mass.",
  "2c + h/4 + s - o, weighted by the component's typical LHV."],
 "SECTION 11: the oxygen demand is c + h/4 + s - o/2 for each component, weighted by its mole fraction, with the letters read off the FUEL_REFERENCE atom counts. The weighted sum is o2PerKmolFuel, 2.089500 kmol O2 per kmol fuel.")

q(3, "In the SECTION 11 oxygen demand table for the invented Isiokpo fuel gas, which weighted figure belongs to C2H6 at a mole fraction of 0.071?",
 "0.248500",
 ["1.736000",
  "0.105000",
  "2.089500"],
 "The C2H6 row prints c + h/4 + s - o/2 as 3.5 and a weighted 0.248500. 1.736000 is the CH4 row, 0.105000 the C3H8 row and 2.089500 the sum, which is the engine's o2PerKmolFuel.")

q(0, "SECTION 11 prints a row by row oxygen demand for the invented Isiokpo fuel gas. Where do those per component rows come from?",
 "The digest computes them from the FUEL_REFERENCE atom counts; the engine returns only the weighted total.",
 ["combustionStoichiometry returns one weighted row per component; the digest sums them.",
  "The oracle's bisection returns them, and the engine checks its 2.089500 against their sum.",
  "They are typed into the record with the fuel gas analysis, beside each mole fraction."],
 "SECTION 11 labels the table \"computed here from the FUEL_REFERENCE atom counts; the engine returns only the weighted total\". The weighted total is o2PerKmolFuel, 2.089500. The bisection SECTION 12 names is how the oracle finds the excess air.")

q(2, "The invented Isiokpo fuel gas prints o2PerKmolFuel 2.089500 and stoichAirPerKmolFuel 9.975652. How does SECTION 11 relate the second to the first?",
 "2.089500 / 0.20946, the oxygen over O2_MOLE_FRACTION_DRY_AIR.",
 ["2.089500 x 28.9647, the oxygen times AIR_MOLAR_MASS, in kg of air.",
  "2.089500 / 31.998, the oxygen over O2_MOLAR_MASS.",
  "2.089500 x 18.5068, the oxygen times fuelMolarMassKgKmol, per kmol."],
 "SECTION 11: the stoichiometric air is that oxygen over O2_MOLE_FRACTION_DRY_AIR, 2.089500 / 0.20946 = 9.975652. AIR_MOLAR_MASS 28.9647 and O2_MOLAR_MASS 31.998 weigh air and oxygen; 18.5068 is fuelMolarMassKgKmol.")

q(1, "Which SECTION 11 figure is the stoichiometric air for the invented Isiokpo fuel gas stated on a mass basis?",
 "15.612763 kg air per kg fuel",
 ["9.975652 kmol air per kmol fuel",
  "18.5068 kg fuel per kmol of fuel",
  "7.886152 kmol N2 per kmol fuel"],
 "SECTION 11 prints stoichAirKgPerKgFuel 15.612763 kg air per kg fuel beside stoichAirPerKmolFuel 9.975652 kmol air per kmol fuel. 18.5068 is fuelMolarMassKgKmol, and 7.886152 is products.airN2PerKmolFuel.")

q(2, "The invented Isiokpo fuel gas carries CO2 at a mole fraction of 0.025. Where does SECTION 11 put that 0.025 kmol in the combustion products?",
 "Inside products.co2PerKmolFuel, 1.098000 kmol per kmol fuel.",
 ["Inside products.fuelN2PerKmolFuel, beside the fuel's nitrogen.",
  "Inside products.airN2PerKmolFuel, 7.886152.",
  "Nowhere in the products: the analysis drops inerts before burning."],
 "SECTION 11: the CO2 in the fuel has c = 1 and o = 2, so it demands no oxygen and passes into the flue gas; the 0.025 kmol of fuel CO2 is inside products.co2PerKmolFuel above. The fuel's nitrogen leaves as products.fuelN2PerKmolFuel 0.015000.")

q(3, "SECTION 11 takes the CO2 out of the invented Isiokpo analysis and renormalises the rest. What does it print?",
 "o2PerKmolFuel 2.143077 and lhvMJPerKmolFuel 862.5564",
 ["o2PerKmolFuel 2.089500 and lhvMJPerKmolFuel 862.5564",
  "o2PerKmolFuel 2.143077 and lhvMJPerKmolFuel 840.9925",
  "o2PerKmolFuel 2.089500 and lhvMJPerKmolFuel 930.6273"],
 "With the CO2 taken out and the rest renormalised, SECTION 11 prints o2PerKmolFuel 2.143077 and lhvMJPerKmolFuel 862.5564, and reads the pair as: the inerts dilute the fuel. The analysis as given prints 2.089500 and 840.9925; 930.6273 is its hhvMJPerKmolFuel.")

q(0, "The invented Isiokpo analysis carries N2 at 0.015. How does SECTION 11 report that nitrogen in the flue gas?",
 "As products.fuelN2PerKmolFuel 0.015000, carried separately from the air's nitrogen.",
 ["Inside products.airN2PerKmolFuel 7.886152, weighed with the air's own nitrogen.",
  "As a share of products.h2oPerKmolFuel 2.033000, since it carries no carbon or sulphur.",
  "Not at all: the engine drops every inert row of FUEL_REFERENCE before it burns."],
 "SECTION 11 prints products.fuelN2PerKmolFuel 0.015000 and states that the fuel's nitrogen is carried separately from the air's. products.airN2PerKmolFuel 7.886152 is the air's nitrogen and 2.033000 is the water. The inert CO2 row is kept too: it passes into products.co2PerKmolFuel.")

q(1, "energyEfficiency.ATMOSPHERIC_N2_MOLAR_MASS prints 28.1610. What do SECTION 1 and SECTION 11 say it is?",
 "The air's non-oxygen part, argon included, derived by the engine from three air constants.",
 ["The N2 row of FUEL_REFERENCE, 28.014 kg/kmol, printed to four decimals after rounding.",
  "The IUPAC nitrogen of ATOMIC_WEIGHT, N 14.007, doubled and corrected for the fuel's N2.",
  "A typed constant for air's nitrogen alone, with argon carried in AIR_MOLAR_MASS 28.9647."],
 "SECTION 1 prints it as derived by the engine from the three air constants above it. SECTION 11: the air's non-oxygen part leaves as atmospheric nitrogen at ATMOSPHERIC_N2_MOLAR_MASS, which carries air's argon. FUEL_REFERENCE's N2 row is 28.014.")

q(2, "Which formula does SECTION 1 print for how the engine derives ATMOSPHERIC_N2_MOLAR_MASS?",
 "(AIR_MOLAR_MASS - O2_MOLE_FRACTION_DRY_AIR x O2_MOLAR_MASS) / (1 - O2_MOLE_FRACTION_DRY_AIR)",
 ["(AIR_MOLAR_MASS - O2_MOLE_FRACTION_DRY_AIR x O2_MOLAR_MASS) / O2_MOLE_FRACTION_DRY_AIR",
  "(AIR_MOLAR_MASS - O2_MOLAR_MASS) / (1 - O2_MOLE_FRACTION_DRY_AIR)",
  "AIR_MOLAR_MASS - O2_MOLE_FRACTION_DRY_AIR x O2_MOLAR_MASS"],
 "SECTION 1 prints that formula beside 28.1610. Each wrong option moves one term: the divisor cut to the oxygen fraction alone, the O2 molar mass dropped from the product, or the whole product taken off with no divisor.")

q(0, "SECTION 11 prints a mass balance at 3 percent stack oxygen for the invented Isiokpo fuel. What makes up its in side?",
 "The fuel molar mass plus the actual air times AIR_MOLAR_MASS.",
 ["The engine dry flue gas plus the engine moisture, both per kmol of fuel.",
  "The fuel molar mass plus the actual air times O2_MOLAR_MASS.",
  "The stoichiometric air times ATMOSPHERIC_N2_MOLAR_MASS, argon and all."],
 "SECTION 11: fuel plus air in (fuel molar mass plus actual air times AIR_MOLAR_MASS) 351.0222 kg per kmol of fuel. The engine dry flue gas plus engine moisture is the out side, also 351.0222.")

q(3, "The SECTION 11 mass balance at 3 percent stack oxygen prints out less in as 0.000001 kg per kmol of fuel. What is that figure?",
 "The digest's own arithmetic on the engine's two sides.",
 ["An output combustionStoichiometry returns.",
  "The weight of argon the engine drops from the flue gas.",
  "The fuel CO2 counted on both sides of the balance."],
 "SECTION 11 marks the out less in row computed here: the generator's arithmetic on the engine's in side and out side, 351.0222 each. The same section says air's argon is carried at ATMOSPHERIC_N2_MOLAR_MASS, and SECTION 25 lists the balance as closing.")

q(1, "energyEfficiency.FUEL_REFERENCE carries atom counts and typical heating values. Which does FUEL_REFERENCE_NOTE say drives the stoichiometry?",
 "The atom counts, which the note calls definitional.",
 ["The typical LHV column, which the note calls governing.",
  "The inert flag, which drops CO2 and N2 from the demand.",
  "The typical HHV column, which a measured value replaces."],
 "FUEL_REFERENCE_NOTE, verbatim: \"Atom counts are definitional and drive the stoichiometry. Heating values are typical: the fuel analysis governs, and a measured value should replace these.\" The inert rows are kept: SECTION 11 passes the fuel CO2 into products.co2PerKmolFuel.")

q(0, "SECTION 1 prints the CO2 row of FUEL_REFERENCE, PRODUCT_MOLAR_MASS.CO2 and carbonAbatement.MW_CO2. What does it say about their molar masses?",
 "They are one number, 44.009, going into the fuel and out in the flue gas.",
 ["The fuel row prints 44.097 and the flue gas products print 44.009.",
  "The fuel row prints 44.009 and the flue gas products print 28.014.",
  "Each module rounds its own, so 44.009 and 44.097 both appear."],
 "SECTION 1: the CO2 row, PRODUCT_MOLAR_MASS.CO2 and carbonAbatement.MW_CO2 are one number, 44.009, and an inert CO2 in the fuel weighs the same going in as it does in the flue gas. 44.097 is propane's molar mass and 28.014 is N2.")

q(2, "How much water does each kmol of the invented Isiokpo fuel gas make when burned, as products.h2oPerKmolFuel?",
 "2.033000",
 ["1.098000",
  "0.015000",
  "2.089500"],
 "SECTION 11 prints products.h2oPerKmolFuel 2.033000. 1.098000 is products.co2PerKmolFuel, 0.015000 products.fuelN2PerKmolFuel, and 2.089500 the oxygen demand o2PerKmolFuel.")

emit(Q, '/root/wt-et-carbon-nextgen/tools/course-banks/carbon/intermediate/cefi_m01.json', label='cefi_m01', expect_n=15)
finish()
