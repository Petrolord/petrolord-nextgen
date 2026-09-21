import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# gasvalue Associate tier exam. Draws on all six Associate modules (digest
# sections 1 to 15). Every analysis, efficiency and GWP named is the course's
# invented and illustrative figure.

q(1, "Which function do the studios use to answer \"what does the flare emit, and what does recovering it abate\"?",
 "abatement",
 ["characteriseGas",
  "compareRoutes",
  "creditSensitivity"],
 "abatement is the function paired with the flare's emissions and what recovering the flare abates.")

q(0, "Which exported constant holds 7.480519?",
 "GAL_PER_FT3",
 ["SCF_PER_LBMOL",
  "LB_PER_KG",
  "M3_PER_SCF"],
 "The constants table: GAL_PER_FT3, 7.480519, US gallons in one cubic foot.")

q(2, "In the digest's arithmetic for kgPerMscf, which constant turns pounds into kilograms?",
 "LB_PER_KG, 2.20462262",
 ["SCF_PER_LBMOL, 379.49",
  "GAL_PER_FT3, 7.480519",
  "PSI_PER_BAR, 14.503773773"],
 "The kilograms are the pounds over LB_PER_KG, pounds in one kilogram. SCF_PER_LBMOL gives the lb-mol in one Mscf (1000 over it), GAL_PER_FT3 is gallons in a cubic foot and PSI_PER_BAR is lpgCng's psi in one bar.")

q(3, "The digest recomputes kgPerMscf for pure methane and pure carbon dioxide from the constants, beside the engine. What does its difference column read?",
 "0.0000 on both rows",
 ["0.0000 on methane, with the CO2 row left to the engine",
  "19.1757 on methane and 52.6038 on carbon dioxide",
  "0.0000 on methane, the CO2 row weighed at 44.009"],
 "The check table prints 19.1757 against 19.1757 for methane and 52.6038 against 52.6038 for carbon dioxide, with 0.0000 in the difference column on both.")

q(3, "Iso-butane and n-butane share a molar mass of 58.122 lb/lbmol. Where do their reference rows differ?",
 "In the typical heating value and the liquid density",
 ["In the carbon per molecule, 4 against 5",
  "In the recoverable as NGL flag",
  "In the inert flag and the heating value"],
 "IC4 reads 3252 Btu/scf and 4.695 lb/gal; NC4 reads 3263 and 4.872. Both carry 4 carbon per molecule, both are recoverable as NGL and neither is inert.")

q(1, "What liquid density does GAS_COMPONENT_REFERENCE give propane?",
 "4.233 lb/gal",
 ["2.971 lb/gal",
  "4.695 lb/gal",
  "5.253 lb/gal"],
 "Propane's row reads 4.233 lb/gal. 2.971 is ethane, 4.695 iso-butane and 5.253 pentanes plus. The engine's note labels these densities typical.")

q(0, "EGBEMA's sheet typed short gets a normalisation note. What does the note end by asking?",
 "Check the analysis if that was not intended.",
 ["Retype the sheet so that it sums to one.",
  "Add the shortfall to the methane row, then rerun.",
  "Confirm the scaled sheet against the laboratory."],
 "The note's second sentence is the request: \"Check the analysis if that was not intended.\" The first reports the raw sum.")

q(1, "OGUTA is the lean non-associated gas. Which ghvBtuScf does the digest print for it?",
 "1035.6050",
 ["1248.4110",
  "1210.7800",
  "1010"],
 "OGUTA's ghvBtuScf is 1035.6050. 1248.4110 is EGBEMA, 1210.7800 the studio's opening gas and 1010 is methane's typical heating value in the reference table.")

q(1, "What does the digest print as OGUTA's inertMoleFraction, and from which fractions?",
 "0.0270, from N2 0.0120 plus CO2 0.0150",
 ["0.0150, from CO2 0.0150 alone",
  "0.0460, from N2 0.0180 plus CO2 0.0280",
  "0.0400, from N2 0.0200 plus CO2 0.0200"],
 "The inert table's OGUTA row sums its two inert codes to 0.0270, and the engine agrees.")

q(3, "molarMassLbLbmol reads 22.3436 for one gas. Which, and what does one Mscf of it weigh?",
 "EGBEMA, carrying 26.7066 kg in one Mscf",
 ["OGUTA, carrying 21.0224 kg in one Mscf",
  "The studio's gas, carrying 25.4954 kg in one Mscf",
  "Pure propane, carrying 52.7066 kg in one Mscf"],
 "EGBEMA's row pairs 22.3436 lb/lbmol with 26.7066 kg/Mscf; each of the other three pairs is another gas's row.")

q(3, "What carbonPerMol does characteriseGas give OGUTA?",
 "1.0580",
 ["1.0430",
  "1.3600",
  "1.3000"],
 "SECTION 5 prints OGUTA at carbonPerMol 1.0580; 1.0430 is its hydrocarbon count, and the other two are EGBEMA and the studio gas.")

q(2, "A sheet is typed with every mole fraction zero. What does characteriseGas answer?",
 "REFUSED: The gas composition sums to nothing.",
 ["REFUSED: Every component needs a mole fraction.",
  "REFUSED: A mole fraction cannot be negative.",
  "A note that the fractions were scaled to one."],
 "The refusal table prints \"REFUSED: The gas composition sums to nothing.\" for every mole fraction zero. The blank mole fraction and the negative mole fraction each get their own sentence.")

q(0, "EGBEMA's short sheet types CO2 as 0.028. At which fraction does the scaled sheet carry it?",
 "0.0284",
 ["0.0280",
  "0.0183",
  "0.0213"],
 "The normalised short-sheet column reads CO2 0.0284. 0.0280 is the full sheet's normalised CO2, and 0.0183 and 0.0213 are the short sheet's N2 and NC4.")

q(0, "Two EGBEMA calls: one with the destruction efficiency blank, one with the GWP blank. How does abatement answer them?",
 "The blank efficiency is refused; the blank GWP leaves the CO2e null",
 ["The blank efficiency leaves the methane null; the blank GWP is refused",
  "Each is refused, with its own REFUSED sentence",
  "Each is answered, with one figure left null"],
 "A blank destruction efficiency gets \"REFUSED: A flare destruction efficiency in (0, 1] is required.\" and more. With the GWP blank the CO2 and methane print and the CO2e reads null.")

q(1, "characteriseGas meets a blank liquid density in one sheet and a blank mole fraction in another. What happens to each?",
 "The liquids go null for the density; the blank fraction is refused",
 ["The density is refused; the blank fraction is scaled away with a note",
  "Both are refused, each in a sentence of its own",
  "Both are answered, the sheet scaled to one first"],
 "Propane's density blank returns gpmC2Plus, gpmC3Plus and richness null with missingLiquidDensity C3. A blank mole fraction gets \"REFUSED: Every component needs a mole fraction.\"")

q(3, "The combustion efficiency is left out of one call; the destruction efficiency is typed blank in another. What does abatement do?",
 "Destruction stands in for the missing combustion; blank destruction is refused",
 ["Missing combustion is refused; combustion stands in for blank destruction",
  "Both calls are refused, since neither efficiency has a default",
  "Each efficiency stands in for the other, with a note on both calls"],
 "Left out, the destruction efficiency stands in for the combustion efficiency and the engine says so in a note. A blank destruction efficiency is refused: \"For a flare it is most of the answer and it is contested, so it is not assumed.\"")

q(1, "On-stream days are omitted in one call and typed blank in another. How does abatement treat the two?",
 "Omitted days take the default, scfPerYear 2625000000; blank days are refused",
 ["Omitted days are refused; blank days take the default, scfPerYear 2625000000",
  "Either way the default applies, and scfPerYear reads 2625000000",
  "Either way the call is refused with the on-stream days sentence"],
 "SECTION 13: omitted from the call, the days take the stated default (onstreamDays 350). Typed blank (''), they are refused with the range more than 0 and no more than 366.")

q(1, "Propane's carbon number is left blank in one analysis and an unknown code, XX, carries none in another. What does characteriseGas do with each?",
 "Propane's is filled from the reference by its code; XX is refused",
 ["Propane's is refused; XX is filled from the reference by its code",
  "Both are refused, since a carbon number is never assumed",
  "Both are filled, at one carbon per molecule each"],
 "The propane probe reads carbonPerMol 1.2000 with the carbon number typed and with it blank. XX has no reference row: \"REFUSED: No carbon number for XX.\"")

q(3, "From which carbon count does the digest's every-unburned-carbon methane shortcut start?",
 "carbonPerMol, every carbon atom, the CO2's included",
 ["hydrocarbonCarbonPerMol, only the carbon that can burn",
  "methaneMoleFraction, the methane in the gas",
  "The ethane and heavier carbon alone"],
 "The shortcut multiplies the lb-mol a year by carbonPerMol, every carbon atom with the CO2's included.")

q(3, "What typical heating value does GAS_COMPONENT_REFERENCE give methane, in Btu/scf?",
 "1010",
 ["1770",
  "2516",
  "0"],
 "The C1 row reads 1010. 1770 is ethane, 2516 propane, and 0 is the figure on the two inert rows, N2 and CO2.")

q(1, "In the destruction efficiency range (combustion left out), which methaneShareOfFlareCo2e sits at 0.99?",
 "0.0565",
 ["0.2376",
  "0.1548",
  "0.1110"],
 "The range reads methaneShareOfFlareCo2e 0.2376 at 0.95, 0.1548 at 0.97, 0.0565 at 0.99 and 0.0000 at 1. 0.1110 is the share at the comparison GWP of 20, with both efficiencies given.")

q(2, "In the digest's words, what is the destruction efficiency?",
 "The share of hydrocarbon destroyed",
 ["The share oxidised to CO2",
  "The share of the gas sent to an unlit flare",
  "The share of the CO2 that passes through"],
 "SECTION 11 defines it as the share of hydrocarbon destroyed; its partner is the share oxidised to CO2.")

q(2, "The destruction efficiency stands in at 0.97 on EGBEMA. Which CO2e comes back?",
 "218744.723",
 ["215946.438",
  "237591.952",
  "199897.495"],
 "With the destruction efficiency standing in at 0.97, flareCo2eTonnes reads 218744.723. 215946.438 is with both efficiencies given; 237591.952 and 199897.495 are the 0.95 and 0.99 rows of the range.")

q(1, "Whose choice does the digest say the assessment report behind a methane GWP is?",
 "The study's",
 ["The engine's, which ships a default",
  "The course's, which picks one edition",
  "40 CFR 98.233(n)'s, which the engine follows"],
 "The methane GWP is an input with no default: the assessment report it comes from is the study's to choose, and this course does not choose it. The engine ships no GWP.")

q(2, "EGBEMA flares 7.5 MMscfd. What scfPerYear does the engine report for its flare as typed?",
 "2662500000, on 355 days",
 ["2625000000, on 355 days",
  "2625000000, on the 350-day default",
  "2662500000, on the 350-day default"],
 "EGBEMA flares on 355 days and its scfPerYear is 2662500000. 2625000000 is the call with the on-stream days omitted, which takes the stated default of 350.")

q(0, "Which ethane figure, gpmC2Plus minus gpmC3Plus, belongs to the studio's gas?",
 "2.4003",
 ["2.7737",
  "0.8268",
  "2.6894"],
 "2.4003 is the studio row of SECTION 7's ethane column. 2.6894 is that gas's gpmC3Plus.")

q(2, "What does the sum row of EGBEMA's per-component gallons print?",
 "5.9942 for gpmC2Plus and 3.2205 for gpmC3Plus",
 ["5.0897 for gpmC2Plus and 2.6894 for gpmC3Plus",
  "5.9942 for gpmC3Plus and 3.2205 for gpmC2Plus",
  "2.7737 for gpmC2Plus and 3.2205 for gpmC3Plus"],
 "The sum row reads 5.9942 (gpmC2Plus), 3.2205 (gpmC3Plus). 5.0897 and 2.6894 are the studio's opening gas, and 2.7737 is the C2 row.")

q(2, "EGBEMA's ethane row gives 2.7737 gal/Mscf. Which liquid cut holds it?",
 "gpmC2Plus only",
 ["gpmC3Plus only",
  "Both gpmC2Plus and gpmC3Plus",
  "Neither, as ethane reads recoverable false"],
 "The C2 row reads recoverable true, in gpmC2Plus true and in gpmC3Plus false, at 2.7737. The digest prints the same figure as gpmC2Plus minus gpmC3Plus, the ethane.")

q(2, "Which figure is OGUTA's c3PlusKgPerMscf, the propane and heavier part of its mass?",
 "0.9798",
 ["0.4890",
  "1.3157",
  "0.8268"],
 "OGUTA's c3PlusKgPerMscf is 0.9798 kg. 0.4890 is its gpmC3Plus in gallons, 1.3157 its gpmC2Plus and 0.8268 its ethane in gallons.")

q(0, "What does the ghvNote read when a component's heating value is missing?",
 "A heating value missing on any component leaves the mixture value missing too. No partial average is reported.",
 ["A heating value missing on any component is taken at 0 Btu/scf, as an inert's is, and the mixture is averaged over the rest.",
  "A heating value missing on any component is taken from the reference by its code, and the mixture is reported as typed.",
  "A heating value missing on any component is refused. Every component needs a heating value."],
 "The n-butane heating value probe prints ghvBtuScf null with that note. Its liquids still read 5.9942 and 3.2205 gal/Mscf.")

q(0, "Which reference row carries one carbon per molecule and is marked inert?",
 "CO2",
 ["C1",
  "N2",
  "C2"],
 "CO2 carries 1 carbon per molecule and inert true. C1 carries 1 and is not inert; N2 is inert with 0 carbon; C2 carries 2 and is not inert.")

q(1, "Which export gives the molar masses the flare's tonnes are weighed at?",
 "FLARE_MOLAR_MASS",
 ["GAS_COMPONENT_REFERENCE",
  "RICHNESS_GPM",
  "SCF_PER_LBMOL"],
 "FLARE_MOLAR_MASS is one of flareToValue's 10 exported constants and tables. GAS_COMPONENT_REFERENCE holds the component rows, RICHNESS_GPM the richness edges and SCF_PER_LBMOL the cubic feet in one lb-mol.")

q(3, "What does BTU_PER_MWH count?",
 "International Table Btu in one megawatt hour",
 ["Kilojoules in one kilowatt hour",
  "Btu in one standard cubic foot of the gas",
  "Psi in one bar"],
 "BTU_PER_MWH is 3412141.6331 International Table Btu in one megawatt hour. Kilojoules in one kilowatt hour is lpgCng's KJ_PER_KWH, 3600, and psi in one bar is PSI_PER_BAR.")

q(3, "Which functions answer \"how much LPG can the vessel hold, and when to reorder\"?",
 "lpgBlendProperties, lpgStorageSizing",
 ["vaporizerDuty, bottlingPlant, assetFloat",
  "gasMassInVessel, cascadeFills",
  "cngCompression, cngDispensing"],
 "The table of questions pairs the vessel and its reorder with lpgBlendProperties and lpgStorageSizing. vaporizerDuty, bottlingPlant and assetFloat answer the vaporizer, carousel and cylinders; gasMassInVessel and cascadeFills the bank and cascade; cngCompression and cngDispensing the compressor and forecourt.")

q(2, "The digest names one module flareToValue draws on. Which, and for what?",
 "modularRefinery, for capital by the power law",
 ["terminalDepot, for its loading-rack queue",
  "production/gasProperties, for the Z factor",
  "facilities/compression, for its compressors"],
 "flareToValue scales capital with the power law in modularRefinery. terminalDepot, production/gasProperties and facilities/compression are the three modules the digest names lpgCng calling.")

q(0, "When the destruction efficiency stands in for the combustion efficiency, what does the engine's note say about the CO2?",
 "It is slightly high, as the rule puts combustion 1.5 points below destruction.",
 ["It is slightly low, as the rule puts combustion 1.5 points above destruction.",
  "It is exact, since the rule sets the two efficiencies equal for a flare.",
  "It is left null until a combustion efficiency is typed into the call."],
 "The note: \"No combustion efficiency was given, so the destruction efficiency stands in for it. 40 CFR 98.233(n) puts combustion 1.5 points below destruction, so the CO2 here is slightly high.\"")

q(3, "Which pair of efficiencies does abatement accept?",
 "Destruction 0.97 and combustion 0.955",
 ["Destruction 0.97 and combustion 0.98",
  "Destruction 1.2 and combustion 0.955",
  "Destruction blank and combustion 0.955"],
 "EGBEMA's flare study, 0.97 and 0.955, is answered. A combustion efficiency of 0.98 above 0.97 is refused, and a destruction efficiency of 1.2 or blank gets the destruction efficiency refusal.")

q(0, "Which on-stream days does abatement accept?",
 "355",
 ["367",
  "0",
  "blank ('')"],
 "EGBEMA's 355 days are answered, scfPerYear 2662500000. The refusal states the range, more than 0 and no more than 366, and 0, 367 and a blank are all refused in the digest's table.")

q(0, "Which of these does the digest state as a limit of the flare model?",
 "An unlit flare is not modelled.",
 ["A gas that carries CO2 is not modelled.",
  "A gas that carries nitrogen is not modelled.",
  "A combustion efficiency below the destruction efficiency is not modelled."],
 "The stated limits: the efficiencies have no default, an unlit flare is not modelled, the GWP and credit prices are case inputs, and the reference figures are typical. EGBEMA carries N2 0.018 and CO2 0.028 and a combustion efficiency of 0.955 below its 0.97, and is answered.")

q(2, "On the Flare Gas to Value Studio's opening flare, which parcel does the digest run?",
 "10 MMscfd on 350 days",
 ["7.5 MMscfd on 355 days",
  "10 MMscfd on 355 days",
  "7.5 MMscfd on 350 days"],
 "The studio's opening gas is run at 10 MMscfd and 350 days with the efficiencies blank, and abatement refuses. 7.5 MMscfd on 355 days is EGBEMA.")

q(0, "Which record does the digest describe as a flow station in Imo State flaring associated gas?",
 "EGBEMA",
 ["OGUTA",
  "KANO",
  "IBAFO"],
 "EGBEMA is the flow station flaring associated gas. OGUTA is a lean non-associated gas, KANO an LPG storage and bottling plant and IBAFO a CNG mother station. Every record is invented; the places are real.")

q(1, "What does the digest say of EGBEMA's efficiencies, 0.97 and 0.955?",
 "They are invented and illustrative, as every efficiency in the digest is.",
 ["They are the tiered default pair of 40 CFR 98.233(n)(1).",
  "They are the NUPRC flare regulations' basis for Imo State.",
  "They were measured on the Egbema flare by the flare study."],
 "The digest's preamble: every analysis, efficiency, GWP, price, cost, fill limit and vehicle figure is invented and illustrative, and no figure is a measured flare or a regulation.")

emit(Q, '/root/wt-et-gasvalue-nextgen/tools/course-banks/gasvalue/beginner/gvb_exam.json', expect_n=42)
finish()
