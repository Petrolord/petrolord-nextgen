import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# gasvalue Expert m06, The Expert Reading. Digest SECTIONS 35 and 36, read
# with 25 to 34. Held items H1 to H4 are asked only as limits. 15 questions.

q(1, "What does the limits lesson hold about the flare efficiencies?",
 "They have no default; the rule's tiered defaults are a United States rule.",
 ["They default to the rule's tiered values unless a study types its own.",
  "They default to the combustion efficiency typed for the case.",
  "They are pinned and not validated, beside the DAK and Sutton coefficients."],
 "Held in the limits lesson: the flare efficiencies have no default: the rule's tiered defaults are a United States rule, and the basis for a Nigerian study is a regulation reading. The pinned list names heating values, densities, latent heats, the DAK and Sutton coefficients, the rule's equation form and water at 15 C.")

q(3, "The limits lesson names water at 15 C for a filling density. In which of its lists does it place that item?",
 "Among the items pinned and not validated",
 ["Among the held limits, as a code value the site types",
  "Among the case inputs, typed with the GWP values",
  "Among the checks the oracles make against measured water"],
 "The limits lesson's pinned list ends with water at 15 C for a filling density. The held limits are the flare efficiencies, the unlit flare, fill limits by code, and GWP values and credit prices as case inputs.")
q(0, "Which fill limit does lpgCng ship for an LPG vessel?",
 "None; the site types the limit with its basis.",
 ["0.85 on liquid_volume, KANO's first limit",
  "0.42 on water_capacity_mass, the NFPA 58 value",
  "The NUPRC practice value, on liquid_volume"],
 "Held in the limits lesson: fill limits by code (NFPA 58, EN or NUPRC practice) are not shipped: the limit is a safety code value, typed by the site with its basis. The vessel lesson calls 0.85 and 0.42 two illustrative fill limits, neither a code value.")

q(2, "What does the limits lesson say of GWP values and credit prices?",
 "They are case inputs.",
 ["They ship in a table, one row per edition.",
  "They are pinned and not validated.",
  "They are checked by the validation oracles."],
 "Held in the limits lesson: GWP values and credit prices are case inputs. They appear in neither the pinned list nor the list of what the oracles check.")

q(1, "Which of these does the limits lesson list as pinned and not validated?",
 "The DAK and Sutton coefficients",
 ["The cascade's mass ledger",
  "Erlang C on the positions wholly working",
  "The ledgers for the blend, storage and vaporizer"],
 "The limits lesson's pinned list: the component heating values and liquid densities, the typical LPG densities and latent heats, the DAK and Sutton coefficients, the form of the rule's equations, and water at 15 C for a filling density. The cascade ledger, Erlang C and the blend, storage and vaporizer ledgers are what the oracles check.")

q(3, "What do the validation oracles check of cngCompression?",
 "Only the unit bridge; the train's thermodynamics are validated in Facilities.",
 ["The polytropic head of each stage, in exact rationals.",
  "The four stage ratios, by bisection on reduced density.",
  "Nothing; the compressor sits on the pinned and not validated list."],
 "The limits lesson: the compressor train's thermodynamics are the Facilities engine's and are validated there; only the unit bridge is checked here. The pinned list does not name the compressor, and bisection on reduced density is how the oracle finds Z.")

q(0, "How does the oracle find Z, independently of the engine?",
 "By bisection on reduced density, with a second correlation as a plausibility check",
 ["By the engine's own DAK iteration, rerun to four decimals and compared",
  "As a mass ledger, with conservation asserted on every bank",
  "In exact rationals, in kilograms and cubic metres"],
 "The limits lesson: Z by bisection on reduced density with a second correlation as a plausibility check. The mass ledger with conservation asserted is the cascade's check, and exact rationals in kilograms and cubic metres are how the oracle takes the gas.")

q(2, "The Kano and Ibafo rollout prints KANO cylinders required. Which figure is it?",
 "98496, the fleet with its 0.08 spares",
 ["91200.0000, the cylinders in circulation alone",
  "3200, the cylinders filled in a day",
  "7296.0000, the spares allowance alone"],
 "The rollout lesson prints KANO cylinders required 98496, the fleet lesson's fleetRequired. inCirculation prints 91200.0000 and sparesAllowance 7296.0000; 3200 is the cylinders filled a day.")

q(3, "Two rollout steps size KANO's stock: usable LPG and cover. Which pair does the end-to-end table show?",
 "71.0685 t and 8.8840 days",
 ["62.9433 t and 7.8680 days",
  "71.0685 t and 8.8836 days",
  "127.5000 t and 8.8840 days"],
 "The rollout lesson prints KANO usable LPG at a 0.85 liquid fill 71.0685 t and cover 8.8840 days. 62.9433 t and 7.8680 days are the 0.42 water_capacity_mass row; 8.8836 is usableTonnes over demand before the engine's three decimal cover; 127.5000 is usableM3 in m3.")

q(1, "The rollout's KANO vaporizer design duty of 98.6948 kW runs on which latent heat?",
 "397.7592 kJ/kg, the blend's on mass",
 ["399.0000 kJ/kg, the blend's on the volume fractions",
  "385 kJ/kg, n-butane's typical row",
  "425 kJ/kg, propane's typical row"],
 "In the vaporizer lesson the vaporizer is fed the latent heat the blend gives on mass, 397.7592 kJ/kg. 399.0000 kJ/kg is the volume-fraction average the blend lesson sets beside it, and 385 and 425 kJ/kg are the two component rows.")

q(0, "Which liquid density does KANO's vessel run on in the rollout?",
 "557.4000 kg/m3, the blend's on volume",
 ["999.1 kg/m3, the water capacity's",
  "584 kg/m3, n-butane's typical row",
  "553.6000 kg/m3, the studio opening blend's"],
 "The rollout's first step is KANO blend density, 557.4000 kg/m3, which is the liquid density the vessel rows are sized on. 999.1 kg/m3 is WATER_KG_M3; 584 kg/m3 is one component's typical density, and 553.6000 kg/m3 is a different blend.")

q(2, "IBAFO's forecourt prints kgPerHour 224.1860. Which mass per fill does it carry?",
 "16.0133 kg, the cascade's kgPerFill",
 ["425.6293 kg, the Mid bank's mass",
  "608.505 kg, the cascade's deliveredKg",
  "10.1449 kg, the bus's CNG per 100 km"],
 "The forecourt lesson: IBAFO's forecourt is 14 buses an hour, 6 minutes a fill, each fill the cascade's 16.0133 kg. 425.6293 kg is the Mid bank in the bank lesson, 608.505 kg the cascade's deliveredKg, and 10.1449 kg the bus's newFuelConsumptionPer100Km.")

q(3, "Which gas do IBAFO's cascade and its banks both run on?",
 "Specific gravity 0.62 at 30 C",
 ["Specific gravity 0.6 at 15 C",
  "Specific gravity 0.62 at 32 C",
  "Specific gravity 0.62 at -80 C"],
 "The bank and cascade lessons give IBAFO's gas as specific gravity 0.62 at 30 C. 0.6 at 15 C is the studio's opening cascade; 32 C is the compressor's suction temperature; -80 C is the out of range probe on the Low bank.")

q(0, "How do the oracles check the cascade?",
 "As a mass ledger, with conservation asserted",
 ["In exact rationals, on the positions wholly working",
  "By bisection on reduced density",
  "They do not; the cascade is pinned and not validated"],
 "The limits lesson: the cascade as a mass ledger with conservation asserted. Exact rationals on the positions wholly working is the oracle's Erlang C, and bisection on reduced density its Z. The cascade lesson prints storedKg minus deliveredKg minus leftInBanksKg as 0.000.")

q(1, "Which carousel figures does the rollout print for KANO?",
 "16 positions wholly working, an average wait of 0.0912 minutes",
 ["17 positions wholly working, an average wait of 0.0450 minutes",
  "18 positions wholly working, an average wait of 0.0222 minutes",
  "14 positions wholly working, an average wait of 0.9850 minutes"],
 "The rollout lesson prints KANO carousel positions wholly working 16 and average wait 0.0912 minutes. 17 and 18 positions are the carousel lesson's whole positions run at availability 1, and 14 positions with 0.9850 minutes is the studio's opening carousel.")

emit(Q, '/root/wt-et-gasvalue-nextgen/tools/course-banks/gasvalue/advanced/gva_m06.json', expect_n=15)
finish()
