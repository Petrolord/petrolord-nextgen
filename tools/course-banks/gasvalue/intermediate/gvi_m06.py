import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# gasvalue Professional m06, The Professional Reading.
# Draws on m06's three lessons only: digest SECTION 24 (EGBEMA's CNG route from
# the gas to the credit test, and what oracle_flaretovalue.py checks on a
# parcel), read with SECTIONS 16 to 23 as one parcel, and SECTION 1's account of
# what lpgCng calls, which the last lesson reads as the next tier's opening.

q(1, "What does the validation oracle oracle_flaretovalue.py rebuild from atomic weights?",
 "The molar masses",
 ["Molar volume",
  "Heating values",
  "The component liquid densities"],
 "In the oracle's list the atomic weights feed one check: \"molar masses rebuilt from atomic weights\". The molar volume has its own source.")

q(3, "From what does the oracle derive the standard molar volume?",
 "From the gas constant",
 ["From SCF_PER_LBMOL",
  "From the typical liquid densities in the table",
  "From the atomic weights of each component"],
 "The oracle's list derives the standard molar volume from the gas constant. SCF_PER_LBMOL, 379.49, is a constant the engine exports.")

q(2, "How does the oracle check the flare by the rule?",
 "By moles, cross-checked by the rule's own volumetric route.",
 ["By mass, cross-checked by the engine's own flare figure.",
  "By the rule's volumetric route alone, with no second route.",
  "By moles, cross-checked against a measured flare's figures."],
 "The digest: \"the flare by the rule by moles, cross-checked by the rule's own volumetric route\". The oracle checks independently of the engine, and the digest's preamble says no figure in it is a published analysis or a measured flare.")

q(0, "The oracle leaves the component heating values and liquid densities unvalidated. What is said of them?",
 "They are pinned, and the engine labels them typical.",
 ["They are rebuilt from atomic weights.",
  "They are derived from the gas constant.",
  "They are checked by the volumetric route."],
 "The oracle \"does not validate the typical heating values and liquid densities: those are pinned, and the engine labels them typical.\" Atomic weights feed the molar masses, the gas constant the standard molar volume, and the volumetric route cross-checks the flare.")

q(3, "In what form does the oracle carry the gas?",
 "In exact rationals, in kilograms and cubic metres",
 ["In floating point, in pounds and standard cubic feet",
  "In exact rationals, in pounds and standard cubic feet",
  "In the engine's own figures, to four decimals"],
 "The digest: \"the gas in exact rationals carried in kilograms and cubic metres\". Among the engine's own constants is SCF_PER_LBMOL, 379.49 standard cubic feet in one lb-mol.")

q(1, "Which ledgers does the oracle check on a parcel?",
 "The route, credit and comparison ledgers",
 ["The route and credit ledgers, leaving comparison",
  "The carbon inventory and the MAC curve ledgers",
  "The discounted cash flow and payback ledgers"],
 "The digest lists \"the route, credit and comparison ledgers\" among the oracle's checks. The engine assembles its cash flow and hands it on; it does not discount it.")

q(0, "In the end-to-end reading, the diesel counterfactual takes the avoided flare of 190032.865 t/yr to a net of 218032.865 t/yr. By which two typed figures, and how?",
 "Less a product combustion of 128000, plus a displaced fuel of 156000.",
 ["Less a displaced fuel of 156000, plus a product combustion of 128000.",
  "Less a product combustion of 128000, plus the net minus the gross flare, 2086.427.",
  "Times the recovery of 0.88, plus a displaced fuel of 156000."],
 "The net abatement is the avoided flare, less what burning the product emits, plus what the product displaces. On the diesel row the product combustion (input) reads 128000 and the displaced fuel (input) 156000. The recovery of 0.88 already sits in the avoided flare, the flare's CO2e times the recovery, and 2086.427 is the net minus the gross flare, a printed result.")

q(2, "In the end-to-end table of EGBEMA's CNG route, what does the step \"CNG made, kg/yr\" print?",
 "43345500.0000",
 ["2662500.0000",
  "26.7066",
  "40070.6250"],
 "The step table prints CNG made, kg/yr 43345500.0000. 2662500.0000 is the parcel's mscfPerYear, 26.7066 the CNG yield ceiling in kg/Mscf and 40070.6250 the mini LNG route's product in t.")

q(0, "The end-to-end table prints the CNG route's capital and its gross margin a year. Which pair?",
 "29337983.06 and 21008150.00",
 ["29331801.26 and 21008150.00",
  "29337983.06 and 23840025.00",
  "27438303.12 and 21008150.00"],
 "The table prints capital, dollars 29337983.06 and gross margin, dollars a year 21008150.00. 29331801.26 is the LPG route's capital, 23840025.00 the CNG revenue and 27438303.12 the six-tenths reading on the CNG plant.")

q(3, "Which step of the end-to-end table sits between the flare CO2e and the net abatement against diesel?",
 "avoided flare CO2e at the recovery, 190032.865 t/yr",
 ["the gross claim with no counterfactual, 215946.438 t/yr",
  "the net against pipeline gas, 190032.865 t/yr",
  "the avoided flare at the recovery, 202989.652 t/yr"],
 "The table runs flare CO2e 215946.438, then avoided flare CO2e at the recovery 190032.865, then net abatement against diesel 218032.865. 202989.652 is gas to power's avoided flare, at 0.94, and the net against pipeline gas is no step of this table.")

q(1, "The end-to-end table closes on the credit. What does its last step print?",
 "breakeven credit price, 16.0152 dollars per tonne",
 ["breakeven credit price, 16.02 dollars per tonne",
  "lowest tested clearing price, 20 dollars per tonne",
  "the first price that clears, 40 dollars per tonne"],
 "The last step is breakeven credit price, dollars per tonne, 16.0152. The verdict sentence quotes the same price as 16.02, lowestTestedClearingPrice is 20 and the first price in the order typed that clears is 40.")

q(2, "Read the parcel's value per Mscf step. Which dollar figure is it?",
 "7.8904",
 ["8.2404",
  "4.2447",
  "8.6040"],
 "The step table prints value per Mscf, dollars 7.8904. 8.2404 and 8.6040 are the CNG route's values with its variable or its fixed cost left blank, and 4.2447 is mini LNG's.")

q(3, "Which figure opens the step-by-step parcel reading, before the product and the capital?",
 "CNG yield ceiling, 26.7066 kg/Mscf",
 ["CNG yield typed, 18.5 kg/Mscf on the route",
  "CNG ceiling in the refusal, 26.706618 kg/Mscf",
  "Minimum volume actual, 7.5000 MMscfd on CNG"],
 "The first step printed is CNG yield ceiling, kg/Mscf 26.7066. The refusal at 30 kg prints the same ceiling to six decimals, 26.706618, and the yield typed and the volume are inputs and screen figures outside the step table.")

q(0, "The end-to-end table's net abatement step names one counterfactual. Which, at what figure?",
 "diesel, at 218032.865 t/yr",
 ["pipeline gas already burned, at 190032.865 t/yr",
  "a market that burned nothing, at 62032.865 t/yr",
  "a new load that burned nothing, at -2010.348 t/yr"],
 "The step reads net abatement against diesel, t/yr, 218032.865, the figure the bid table also carries on CNG. The pipeline gas and burned nothing nets are the CNG route's other two counterfactuals, and -2010.348 is gas to power's.")

q(2, "How is the validation oracle said to check flareToValue's figures?",
 "Independently of the engine",
 ["By re-running the engine on a second machine",
  "Against measured flares",
  "Against the typical heating values"],
 "The digest: \"What the validation oracle (oracle_flaretovalue.py ...) checks, independently of the engine\". Every analysis is invented and illustrative, and the typical heating values are what it does not validate.")

emit(Q, '/root/wt-et-gasvalue-nextgen/tools/course-banks/gasvalue/intermediate/gvi_m06.json', label='gvi_m06', expect_n=15)
finish()
