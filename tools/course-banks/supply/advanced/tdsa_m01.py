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

q(0, "The same cargo is entered as 34000 with the unit typed as kg. Which answer does cargoQuantities give?",
 "REFUSED: Unknown quantity unit \"kg\".",
 ["A cargo of 34000 tonnes, because the engine maps a mass unit it does not list to the nearest mass unit it does.",
  "REFUSED: Density is required to convert between mass and volume; it is not assumed.",
  "REFUSED: Cargo quantity is required."],
 "The module accepts tonnes, m3, litres and barrels. A label outside that list is refused, because 34000 kg and 34000 tonnes are two different cargoes and a guess between them would print a clean figure.")

q(3, "A quantity of zero is put to cargoQuantities with a valid unit and the density of 742.8 kg/m3. What comes back?",
 "REFUSED: Cargo quantity is required.",
 ["An empty cargo in every unit, since a zero quantity is still a quantity the rules can convert.",
  "REFUSED: Density is required to convert between mass and volume; it is not assumed.",
  "REFUSED: Unknown quantity unit \"kg\"."],
 "The digest prints the zero quantity case as the refusal \"Cargo quantity is required.\" The engine forms no volume for a cargo it has not been given.")

q(1, "34000 tonnes of the invented BADAGRY petrol cargo are entered at its certificate density of 742.8 kg/m3. How many cubic metres does the engine return?",
 "45772.752 m3",
 ["45637.584 m3",
  "45772.700 m3",
  "45772.442 m3"],
 "m3 = tonnes x 1000 / density gives 45772.752 m3. 45637.584 m3 is the same tonnes at the reference density of 745 kg/m3, and the other two are the rows typed as 45772.7 m3 and as 287900 bbl.")

q(2, "BADAGRY is entered as 45772.7 m3 at 742.8 kg/m3 and comes back as 33999.9616 tonnes. Why does the tonne figure not read 34000.0000?",
 "The typed volume is a rounding of the cargo, and the engine converts exactly the figure it is handed.",
 ["The barrel constant of 0.158987294928 is itself rounded, so every trip through a volume sheds a little mass.",
  "The engine stores litres to two decimals and rebuilds the tonnes from that stored litre figure.",
  "The density of 742.8 kg/m3 is applied at the observed temperature when the entry is a volume."],
 "45772.7 m3 is the cargo's 45772.752 m3 quoted short. Converted exactly it is 33999.9616 tonnes, so the loss sits in the typing and the engine adds none.")

q(0, "The bill of lading for a cargo states its quantity in tonnes. Which entry does the first module of this tier recommend?",
 "Enter the tonnes and let the engine form the litres, m3 and barrels from them.",
 ["Enter the litres, because every charge in the walk is levied per litre and a litre entry avoids a conversion.",
  "Enter the barrels, because the barrel is fixed by a constant and so carries no density uncertainty into the walk.",
  "Enter the m3, because the terminal strapped its tanks in m3 and a shore figure outranks a document figure."],
 "The unit entered should be the unit the governing document states. A litre figure somebody rounded from tonnes carries that rounding into every per-litre charge, as the 45772700 litre row shows at 33999.9616 tonnes.")

q(3, "PRODUCT_REFERENCE lists a typical petrol density of 745 kg/m3. When does anything in the fuelPricing module read that figure?",
 "Only when a caller passes it in as the density.",
 ["Whenever a PMS cargo is entered with its density left blank, as a starting point.",
  "Whenever the density typed falls outside the petrol range the module lists.",
  "Whenever the unit entered is a volume and the tonnes have to be formed."],
 "The module labels its typical densities a starting point and nothing reads them unless a caller passes one in. The certificate of quality is the authority, so a missing density is refused.")

q(1, "The same 34000 tonnes are run at 742.8 kg/m3 and at the petrol reference density of 745 kg/m3. What does the pair of results show?",
 "A density inside the petrol range can still describe a different cargo on paper: 45772.752 m3 against 45637.584 m3.",
 ["Both densities are petrol, so the engine returns 45772.752 m3 for each and the reference figure is harmless.",
  "The reference density is rejected because it is outside the petrol range of 720-775 kg/m3 the module lists.",
  "The two volumes agree to the litre once each is expressed in barrels through the constant 0.158987294928."],
 "Both 742.8 and 745 kg/m3 sit inside the listed petrol range of 720-775, yet the engine returns 45772.752 m3 and 45637.584 m3, which is why the certificate figure is the one typed.")

q(0, "A corrected density certificate arrives for a cargo already priced. Which BADAGRY lines does the first module say the density reaches before anyone looks at a price?",
 "The jetty, storage and regulatory lines, which are levied on a volume.",
 ["The port and freight lines, which read the tonnes.",
  "The demurrage line, charged once a cargo.",
  "None, since every line reads the invoiced tonnes."],
 "A per-m3 or per-litre line reads the volume and the volume is formed through the density. A per-tonne line reads the tonnes, which the density does not move.")

q(2, "Two barrel figures for one cargo disagree: 287900.0000 and 287901.9470. Where does the barrel lesson say to look first?",
 "At the density and the quantity typed, since the barrel constant is a fixed definition.",
 ["At M3_PER_BBL, since 0.158987294928 is carried to a precision that varies by product.",
  "At LITRES_PER_M3, since barrels are formed from litres and the litre count is rounded to two decimals.",
  "At the unit list, since a barrel entry is converted through tonnes before the m3 is formed."],
 "Barrels are m3 divided by the constant, and the m3 comes through the density. The two rows here are 287900 bbl typed and 34000 tonnes typed, so the typed quantity is what differs.")

q(3, "How does cargoQuantities reach the barrel figure of 287901.9470 for 34000 tonnes at 742.8 kg/m3?",
 "It forms 45772.752 m3 through the density, then divides by 0.158987294928.",
 ["It multiplies the tonnes by a barrels-per-tonne factor held for each product in PRODUCT_REFERENCE.",
  "It divides the 45772751.75 litres by 1000 and then by the typical petrol density of 745 kg/m3.",
  "It divides the tonnes by 0.158987294928 and then corrects the result with the density of 742.8 kg/m3."],
 "The engine never reaches a barrel from tonnes directly. The density gives the m3 and M3_PER_BBL gives the barrels, so the barrel carries the density's uncertainty and none of its own.")

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

q(0, "Every line in IMPORT_TEMPLATE and PUMP_TEMPLATE ships its rate as none. Which reason does RATE_DISCLAIMER give?",
 "Duties, levies and regulated margins are set by regulation, differ by market and change.",
 ["Every rate is derived by the engine from the cargo's density and quantity once they are entered.",
  "Rates are commercially confidential, so the engine keeps them in the terminal's own tables.",
  "Rates are carried by the oracles' golden files and read from there when a build-up runs."],
 "The disclaimer reads \"Line items only. Every rate is a required input: duties, levies and regulated margins are set by regulation, differ by market and change. Confirm each against the regulation in force.\" So every rate in this tier is invented for the course.")

q(3, "Which pair of IMPORT_TEMPLATE lines ships with the basis percent_of_cif?",
 "Import duty, and Financing and letter of credit.",
 ["Marine insurance, and Import duty.",
  "Ocean freight, and Port and harbour charges.",
  "Jetty throughput and discharge, and Storage and handling."],
 "Two landed lines bite on CIF in the template: order 3 and order 8. The insurance line itself ships on C&F, which is why it cannot be one of them.")

emit(Q, '/root/wt-md-supply-nextgen/tools/course-banks/supply/advanced/tdsa_m01.json', expect_n=15)
finish()
