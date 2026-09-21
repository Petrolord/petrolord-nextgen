import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# supply Expert m01, One Cargo Every Way. Digest SECTION 17 and the templates
# of SECTION 1. 15 questions.

q(2, "cargoQuantities is called on the invented BADAGRY cargo with its quantity and unit given and the density left out. What does the engine return?",
 "REFUSED: Density is required to convert between mass and volume; it is not assumed.",
 ["REFUSED: Cargo quantity is required.",
  "The cargo converted at the petrol density of 745 kg/m3 that PRODUCT_REFERENCE lists for PMS.",
  "REFUSED: Unknown quantity unit \"kg\"."],
 "Every volume the function forms needs the density, so with none supplied it forms nothing and names the density as the missing input.")

# audit-advanced: stem leaned on Q1 ("the same cargo", density left out); invented rationale in the explanation
q(0, "The invented BADAGRY cargo is entered as 34000 with the unit typed as kg and its density of 742.8 kg/m3 given. Which answer does cargoQuantities give?",
 "REFUSED: Unknown quantity unit \"kg\".",
 ["A cargo of 34000 tonnes, because the engine maps a mass unit it does not list to the nearest mass unit it does.",
  "REFUSED: Density is required to convert between mass and volume; it is not assumed.",
  "REFUSED: Cargo quantity is required."],
 "The course prints this row as REFUSED: Unknown quantity unit \"kg\". The cargo table converts entries in tonne, m3, litre and bbl, and kg is none of them, so the row returns no figure.")

q(3, "A quantity of zero is put to cargoQuantities with a valid unit and the density of 742.8 kg/m3. What comes back?",
 "REFUSED: Cargo quantity is required.",
 ["An empty cargo in every unit, since a zero quantity is still a quantity the rules can convert.",
  "REFUSED: Density is required to convert between mass and volume; it is not assumed.",
  "REFUSED: Unknown quantity unit \"kg\"."],
 "The engine answers the zero quantity case with the refusal \"Cargo quantity is required.\" The engine forms no volume for a cargo it has not been given.")

q(1, "34000 tonnes of the invented BADAGRY petrol cargo are entered at its certificate density of 742.8 kg/m3. How many cubic metres does the engine return?",
 "45772.752 m3",
 ["45637.584 m3",
  "45772.700 m3",
  "45772.442 m3"],
 "m3 = tonnes x 1000 / density gives 45772.752 m3. 45637.584 m3 is the same tonnes at the reference density of 745 kg/m3, and the other two are the rows typed as 45772.7 m3 and as 287900 bbl.")

# audit-advanced: key called the typed volume "a rounding", a reading; now names the two printed figures
q(2, "BADAGRY is entered as 45772.7 m3 at 742.8 kg/m3 and comes back as 33999.9616 tonnes. Why does the tonne figure not read 34000.0000?",
 "The typed 45772.7 m3 is short of the cargo's 45772.752 m3, and the engine converts it as typed.",
 ["The barrel constant of 0.158987294928 is itself rounded, so every trip through a volume sheds a little mass.",
  "The engine stores litres to two decimals and rebuilds the tonnes from that stored litre figure.",
  "The density of 742.8 kg/m3 is applied at the observed temperature when the entry is a volume."],
 "m3 = tonnes x 1000 / density, so the engine forms tonnes from the volume it is handed. 34000 tonnes at 742.8 kg/m3 is 45772.752 m3, and the 45772.7 m3 typed converts to 33999.9616 tonnes.")

# audit-advanced: REPLACED: keyed on a lesson recommendation (which unit to enter), printed nowhere in the digest
q(0, "A BADAGRY entry of 287900 bbl, density 742.8 kg/m3, comes back from cargoQuantities in tonnes as what?",
 "33999.7701 tonnes",
 ["33999.9616 tonnes",
  "34000.0000 tonnes",
  "45772.442 tonnes"],
 "The 287900 bbl row reads 45772.442 m3 and 33999.7701 tonnes. 34000.0000 tonnes is the row entered in tonnes, 33999.9616 tonnes the rows entered as 45772.7 m3 and as 45772700 litres, and 45772.442 is the barrel row's volume in m3.")

# audit-advanced: REPLACED: the same PRODUCT_REFERENCE question as tdsb_m01 Q9 (dupaxes prompt 0.78)
q(3, "34000 tonnes are run through cargoQuantities at the kerosene density of 800 kg/m3 that PRODUCT_REFERENCE lists for DPK. What comes back?",
 "42500.000 m3 and 42500000.00 litres",
 ["40476.190 m3 and 40476190.48 litres",
  "45637.584 m3 and 45637583.89 litres",
  "45772.752 m3 and 45772751.75 litres"],
 "The density rows read 42500.000 m3 and 42500000.00 litres for DPK at 800 kg/m3. 40476.190 m3 is the AGO row at 840 kg/m3, 45637.584 m3 the PMS row at 745 kg/m3, and 45772.752 m3 the BADAGRY cargo at its own 742.8 kg/m3.")

# audit-advanced: 720-775 reached back into SECTION 1 for a figure the question does not need
q(1, "The same 34000 tonnes are run at 742.8 kg/m3 and at the petrol reference density of 745 kg/m3. What does the pair of results show?",
 "A density inside the petrol range can still describe a different cargo on paper: 45772.752 m3 against 45637.584 m3.",
 ["Both densities are petrol, so the engine returns 45772.752 m3 for each and the reference figure is harmless.",
  "The reference density is rejected because it falls outside the petrol range the module lists.",
  "The two volumes agree to the litre once each is expressed in barrels through the constant 0.158987294928."],
 "Both are petrol densities in PRODUCT_REFERENCE, yet the engine returns 45772.752 m3 at 742.8 kg/m3 and 45637.584 m3 at 745 kg/m3. The certificate of quality is the authority, which is why the cargo's own figure is the one typed.")

# audit-advanced: REPLACED: keyed on what "the first module says"; once repaired it re-asked m02 Q15 (dupaxes joined 0.48)
q(0, "The invented BADAGRY cargo is entered once as 45772.7 m3 and once as 45772700 litres, both at 742.8 kg/m3. What do the two entries return?",
 "The same figures: 45772.700 m3, 33999.9616 tonnes and 287901.6215 barrels.",
 ["The litre entry refused, since litres are not a unit the cargo table converts.",
  "The same m3, with 34000.0000 tonnes on the litre entry.",
  "Two m3 figures 1000 apart, since the litre entry is read as m3."],
 "The two rows print alike: 45772.700 m3, 45772700.00 litres, 33999.9616 tonnes and 287901.6215 barrels. litres = m3 x 1000, so the two entries are one quantity.")

# audit-advanced: REPLACED: keyed on what "the barrel lesson says"; now asks what the two printed rows differ in
q(2, "Two barrel figures for the invented BADAGRY cargo at 742.8 kg/m3 disagree: 287900.0000 and 287901.9470. What differs between the two rows?",
 "The quantity typed: 287900 bbl in one row and 34000 tonnes in the other.",
 ["The barrel constant, which each row carries to a different number of decimals.",
  "The litre count, which one row rounds to two decimals before it forms the barrels.",
  "The density, 742.8 kg/m3 in one row and 745 kg/m3 in the other."],
 "Both rows are the BADAGRY cargo at 742.8 kg/m3. The 287900 bbl row returns 287900.0000 barrels and the 34000 tonne row 287901.9470, and barrels = m3 / 0.158987294928 with one constant for every row.")

# audit-advanced: explanation claimed the barrel "carries none of its own" uncertainty, unprinted
q(3, "How does cargoQuantities reach the barrel figure of 287901.9470 for 34000 tonnes at 742.8 kg/m3?",
 "It forms 45772.752 m3 through the density, then divides by 0.158987294928.",
 ["It multiplies the tonnes by a barrels-per-tonne factor held for each product in PRODUCT_REFERENCE.",
  "It divides the 45772751.75 litres by 1000 and then by the typical petrol density of 745 kg/m3.",
  "It divides the tonnes by 0.158987294928 and then corrects the result with the density of 742.8 kg/m3."],
 "The engine never reaches a barrel from tonnes directly. The density gives the m3, 45772.752, and dividing by M3_PER_BBL, 0.158987294928, gives the barrels.")

q(1, "In IMPORT_TEMPLATE, which basis does the Marine insurance line ship with?",
 "percent_of_cf",
 ["percent_of_cif",
  "percent_of_fob",
  "per_tonne"],
 "The template ships insurance as percent_of_cf. Import duty and Financing and letter of credit are the lines shipped on percent_of_cif, and freight and port are per_tonne.")

q(2, "Which of these bases belongs to PRICE_ELEMENT_BASIS and appears nowhere in CHARGE_BASIS?",
 "percent_of_running",
 ["percent_of_cif",
  "per_litre",
  "per_cargo"],
 "CHARGE_BASIS carries per_tonne, per_m3, per_litre, per_bbl, per_cargo, percent_of_fob, percent_of_cf and percent_of_cif. PRICE_ELEMENT_BASIS carries per_litre, percent_of_landed and percent_of_running, so per_litre is in both lists.")

# audit-advanced: key 0.62 against tdsb_exam Q12 (the same RATE_DISCLAIMER phrase); now asks for its instruction
q(0, "Every line in IMPORT_TEMPLATE and PUMP_TEMPLATE ships its rate as none. What does RATE_DISCLAIMER tell the user to do with each rate?",
 "Confirm it against the regulation in force.",
 ["Use the template rate until a regulation is published.",
  "Read it from the oracles' golden files.",
  "Take a missing rate as zero and name it."],
 "RATE_DISCLAIMER ends \"Confirm each against the regulation in force.\" The templates ship every rate as none, and the fuelpricing golden file ships none either, since every rate in it is synthetic.")

# audit-advanced: "order 8" reached back to a SECTION 1 count row; names the lines instead
q(3, "Which pair of IMPORT_TEMPLATE lines ships with the basis percent_of_cif?",
 "Import duty, and Financing and letter of credit.",
 ["Marine insurance, and Import duty.",
  "Ocean freight, and Port and harbour charges.",
  "Jetty throughput and discharge, and Storage and handling."],
 "Two landed lines bite on CIF in the template: Import duty and Financing and letter of credit. The insurance line itself ships on C&F, which is why it cannot be one of them.")

emit(Q, '/root/wt-md-supply-nextgen/tools/course-banks/supply/advanced/tdsa_m01.json', expect_n=15)
finish()
