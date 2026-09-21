import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# gasvalue Associate m06, The Associate Reading. Digest section 15, read with
# sections 4 to 13 as one flare. EGBEMA and every figure attached to it are
# invented and illustrative.

q(0, "Which two lines of EGBEMA's end-to-end table are the most any route can take out of a thousand standard cubic feet, by mass?",
 "mass, kg/Mscf and propane and heavier, kg/Mscf",
 ["liquids, gal/Mscf C3+ and richness",
  "heating value, Btu/scf and inerts, mole fraction",
  "flare CO2, t/yr and flare methane, t/yr"],
 "The mass ceiling lesson says of kgPerMscf and c3PlusKgPerMscf: they are the most any route can take out of a thousand standard cubic feet, by mass. On EGBEMA they read 26.7066 and 6.6647.")

q(2, "Which line of the EGBEMA end-to-end table needs the methane GWP of 29.8?",
 "flare CO2e, 215946.438 t/yr",
 ["flare CO2, 182079.024 t/yr",
  "flare methane, 1136.490 t/yr",
  "hydrocarbon carbon per mole, 1.3320"],
 "CO2e is the CO2 plus the methane times the GWP. With the GWP left blank the engine still reports flareCo2Tonnes 182079.024 and flareCh4Tonnes 1136.490, and flareCo2eTonnes reads null.")

q(3, "The course reads the studio's opening gas the same way as EGBEMA. At which line does its table end?",
 "richness, which reads rich",
 ["flare CO2, t/yr",
  "flare CO2e, t/yr",
  "flare methane, t/yr"],
 "The studio's table runs from the heating value, 1210.7800 Btu/scf, to richness, rich. Its flare is refused until the efficiencies are typed.")

q(1, "What do the studio opening gas's liquids line and richness line read?",
 "2.6894 gal/Mscf C3+, rich",
 ["5.0897 gal/Mscf C3+, rich",
  "2.6894 gal/Mscf C3+, moderate",
  "3.2205 gal/Mscf C3+, rich"],
 "The studio's table prints liquids 2.6894 and richness rich; 2.6894 is at or above the upper edge of 2.5000. 5.0897 is its gpmC2Plus and 3.2205 is EGBEMA's liquids line.")

q(3, "Beside its analysis, which flare inputs does the course give EGBEMA?",
 "7.5 MMscfd, 355 days, 0.97, 0.955 and a GWP of 29.8",
 ["10 MMscfd, 350 days, 0.97, 0.955 and a GWP of 29.8",
  "7.5 MMscfd, 355 days, 0.97, 0.955 and a GWP of 20",
  "7.5 MMscfd, 350 days, 0.97, 0.97 and a GWP of 29.8"],
 "EGBEMA flares 7.5 MMscfd on 355 days a year; the flare study gives a destruction efficiency of 0.97 and a combustion efficiency of 0.955 and uses a methane GWP of 29.8. 10 MMscfd on 350 days is the studio's opening parcel, and 20 is a comparison GWP.")

q(0, "Beside 215946.438, which methaneShareOfFlareCo2e does abatement print for EGBEMA at the study's GWP?",
 "0.1568",
 ["0.1548",
  "0.1110",
  "0.2496"],
 "methaneShareOfFlareCo2e reads 0.1568 on EGBEMA at 29.8 with both efficiencies given. 0.1548 is the share with the combustion efficiency left out, 0.1110 the share at a GWP of 20, and 0.2496 is EGBEMA's c3PlusKgPerMscf over kgPerMscf.")

q(1, "The studio gas's end-to-end table opens on its heating value. Which figure, in Btu/scf?",
 "1210.7800",
 ["1248.4110",
  "1035.6050",
  "1308.6069"],
 "The end-to-end lesson's studio table opens at 1210.7800; 1248.4110 opens EGBEMA's.")

q(2, "Line one of EGBEMA's table reads sheet sum 1.0000. What does the same sheet typed short report?",
 "0.9850, with a note that the fractions were scaled to one",
 ["0.9850, with the analysis refused as incomplete",
  "1.0000, since the engine scales every sheet before the sum",
  "0.9850, with the fractions carried on as typed"],
 "rawMoleFractionSum reads 0.9850 on the sheet typed short and 1.0000 in full. Only the short sheet carries a normalisationNote, and its normalised C1 is 0.7411.")

q(0, "The flare methane line reads 1136.490 t/yr. From which figure of EGBEMA's gas does the rule start it?",
 "methaneMoleFraction, 0.7420",
 ["carbonPerMol, 1.3600, every carbon atom",
  "hydrocarbonCarbonPerMol, 1.3320",
  "co2MoleFraction, 0.0280"],
 "CH4 = the methane in the gas times one less the destruction efficiency. Starting from carbonPerMol is the every-unburned-carbon shortcut, which gives 2083.055.")

q(3, "The studio opens on its own gas at 10 MMscfd and 350 days. What must be typed before abatement returns a flare CO2?",
 "A destruction efficiency, the input its refusal names",
 ["A methane GWP, as the CO2 is blocked without one",
  "A gas volume, as the opening parcel carries none",
  "On-stream days, as the opening parcel carries none"],
 "The studio opens with both efficiencies and the GWP blank, and its flare is refused until the efficiencies are typed: \"REFUSED: A flare destruction efficiency in (0, 1] is required.\" A combustion efficiency left out is stood in for by the destruction efficiency, and a blank GWP leaves only the CO2e and the share null.")

q(1, "Which EGBEMA figure is the end-to-end line \"liquids, gal/Mscf C3+\"?",
 "3.2205",
 ["5.9942",
  "2.6894",
  "6.6647"],
 "EGBEMA's liquids line reads 3.2205. 5.9942 is its gpmC2Plus, 2.6894 is the studio's liquids line and 6.6647 is EGBEMA's propane and heavier in kg/Mscf.")

q(2, "In the studio's gas, what are methaneMoleFraction and co2MoleFraction?",
 "0.7800 methane, 0.0200 CO2",
 ["0.7420 methane, 0.0280 CO2",
  "0.9250 methane, 0.0150 CO2",
  "0.7800 methane, 0.0400 CO2"],
 "The studio's opening gas reads methaneMoleFraction 0.7800 and co2MoleFraction 0.0200. 0.7420 and 0.0280 are EGBEMA, 0.9250 and 0.0150 are OGUTA, and 0.0400 is the studio gas's inertMoleFraction.")

q(0, "Which input of EGBEMA's flare enters the flare CO2e line and neither the flare CO2 nor the flare methane line?",
 "The methane GWP, 29.8",
 ["The destruction efficiency, 0.97",
  "The combustion efficiency, 0.955",
  "The methane mole fraction, 0.7420"],
 "CO2e is the CO2 plus the methane times the GWP; the destruction efficiency sets the methane and the combustion efficiency sets the CO2. With the GWP left blank the CO2 and the methane are still reported.")

q(3, "EGBEMA is analysed with propane's liquid density left blank. Which two end-to-end lines does the course print as null on that probe?",
 "The liquids line and the richness line",
 ["The liquids line and the propane and heavier kg/Mscf",
  "The heating value line and the liquids line",
  "The richness line and the mass, kg/Mscf line"],
 "The density lesson's probe row prints gpmC3Plus null and richness null beside ghvBtuScf 1248.4110. The mass ceiling lesson prints c3PlusKgPerMscf 6.6647 and kgPerMscf 26.7066 on the same probe.")

q(1, "On the studio's opening gas, which figure counts only the carbon that can burn, per mole?",
 "1.2800",
 ["1.3000",
  "1.3320",
  "1.0430"],
 "hydrocarbonCarbonPerMol reads 1.2800 on the studio's opening gas and carbonPerMol 1.3000. 1.3320 is EGBEMA's hydrocarbon carbon per mole and 1.0430 is OGUTA's.")

emit(Q, '/root/wt-et-gasvalue-nextgen/tools/course-banks/gasvalue/beginner/gvb_m06.json', expect_n=15)
finish()
