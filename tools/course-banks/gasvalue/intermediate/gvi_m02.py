import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# gasvalue Professional m02, What the Gas Can Yield.
# Draws on m02's four lessons only: digest SECTION 18 (yieldCeiling on three
# gases, the typed yields and routeEconomics' yield refusals), with the unit
# constant BTU_PER_MWH (SECTION 2) and the heating values the lessons quote
# from SECTION 5 as the figure the gas to power ceiling is built on. Every
# figure, basis word and refusal is a string the digest prints.

q(1, "On which basis does yieldCeiling cap the LPG and condensate extraction route?",
 "propane and heavier, capped in t",
 ["the whole gas mass, as on CNG and LNG",
  "the heating value, in MWh per Mscf",
  "the ethane and heavier, capped in t"],
 "LPG and condensate extraction reads propane and heavier in the ceiling basis column, with a ceiling of 0.0067 t on EGBEMA. No route's basis is the ethane and heavier, and CNG's is gas mass.")

q(3, "Which two routes does yieldCeiling cap on the same basis, the whole gas mass?",
 "CNG and mini LNG",
 ["mini LNG and LPG, both in tonnes",
  "CNG and gas to power or gas to wire",
  "LPG and gas to power or gas to wire"],
 "The ceiling basis column reads gas mass for Compressed natural gas and for Mini LNG, propane and heavier for LPG and condensate extraction, and heating value for gas to power. Mini LNG and LPG share a yield unit, t, and differ in basis.")

q(0, "How does yieldCeiling turn a heating value into the gas to power ceiling?",
 "The heating value times a thousand over BTU_PER_MWH.",
 ["The heating value over BTU_PER_MWH, with no thousand.",
  "The heating value times BTU_PER_MWH over a thousand.",
  "The gas mass times the heating value over BTU_PER_MWH."],
 "The digest states the gas to power ceiling as the heating value in MWh: \"the heating value times a thousand over BTU_PER_MWH\". The heating value is per standard cubic foot and the yield is per Mscf, and BTU_PER_MWH is 3412141.6331.")

q(2, "What does yieldCeiling print as the CNG ceiling per Mscf on EGBEMA?",
 "26.7066 kg, on the gas mass basis",
 ["25.4954 kg, on the gas mass basis",
  "18.5 kg, on the gas mass basis",
  "21.0224 kg, on the gas mass basis"],
 "EGBEMA's CNG ceiling is 26.7066 kg/Mscf. 21.0224 is OGUTA's, 25.4954 the studio opening gas's, and 18.5 is the yield the EGBEMA study typed. Every EGBEMA yield typed sits at or below its ceiling.")

q(0, "Read the LPG row of the ceiling table for OGUTA, the lean gas. Which figure is there?",
 "0.0010 t",
 ["0.0067 t",
  "0.0056 t",
  "0.0210 t"],
 "The LPG row prints 0.0067 on EGBEMA, 0.0010 on OGUTA and 0.0056 on the studio's opening gas. 0.0210 is OGUTA's mini LNG ceiling, on the gas mass basis.")

q(2, "The studio's LPG route on its opening gas is typed at 0.0045 t/Mscf. What is printed for that yield?",
 "Within a ceiling of 0.0056 t/Mscf; typed over ceiling 0.8062.",
 ["Refused, above the ceiling of 0.0056 t/Mscf it would need.",
  "Within a ceiling of 0.0067 t/Mscf; typed over ceiling 0.8062.",
  "Within a ceiling of 0.0255 t/Mscf; typed over ceiling 0.8062."],
 "The digest: \"The studio's LPG route on its opening gas at 0.0045 t/Mscf is within its ceiling of 0.0056 t/Mscf, and the typed yield over the ceiling is 0.8062.\" 0.0067 is EGBEMA's LPG ceiling and 0.0255 the studio gas's mini LNG ceiling.")

q(3, "The studio's opening gas is typed with an LPG yield of 0.02 t/Mscf. Which ceiling and basis does the refusal print?",
 "0.005582 t on the propane and heavier basis",
 ["0.0056 t on the propane and heavier basis",
  "0.005582 t on the gas mass basis",
  "0.0255 t on the gas mass basis"],
 "The refusal reads: Route \"LPG and condensate extraction\" yields 0.02 t per Mscf, more than the 0.005582 t the gas holds (propane and heavier). The ceiling table prints the same ceiling to four decimals, 0.0056, and the refusal prints it to six.")

q(1, "EGBEMA's CNG yield is typed at 30 kg/Mscf. What does the engine answer?",
 "REFUSED: more than the 26.706618 kg the gas holds (gas mass).",
 ["A year on 30 kg, flagged as above the ceiling of 26.7066 kg.",
  "A year on 26.7066 kg, the yield cut back to the ceiling.",
  "REFUSED: more than the 6.6647 kg the gas holds (propane and heavier)."],
 "The digest prints: REFUSED: Route \"Compressed natural gas\" yields 30 kg per Mscf, more than the 26.706618 kg the gas holds (gas mass). A yield above what the gas contains is refused. No year is printed at 30 kg or at the ceiling.")

q(3, "EGBEMA's gas to power yield is typed at 0 MWh/Mscf, below its ceiling of 0.3659. What does the engine answer?",
 "REFUSED: the route needs a positive product yield per Mscf.",
 ["A year with productPerYear of zero and a margin below zero.",
  "It takes the ceiling of 0.3659 MWh as the yield.",
  "It takes a zero yield and names it in assumedZero."],
 "The digest: EGBEMA, gas to power at 0 MWh/Mscf gives REFUSED: Route \"Gas to power or gas to wire\" needs a positive product yield per Mscf. A yield above the ceiling is refused, and a yield of zero is refused.")

q(0, "Which function issues the refusal of a yield above what the gas holds?",
 "routeEconomics",
 ["yieldCeiling",
  "screenRoute",
  "compareRoutes"],
 "The ceiling is yieldCeiling's, and the refusals are routeEconomics'. yieldCeiling gives the most one Mscf of the gas can make, and routeEconomics refuses a yield above it. screenRoute gives a route passes, fails or not fully screened, and compareRoutes lays the routes side by side.")

q(1, "EGBEMA's gas to power ceiling is 0.3659 MWh per Mscf. Which EGBEMA heating value is that ceiling built on?",
 "1248.4110 Btu/scf, the engine's heating value on moles",
 ["1537.2878 Btu/scf, the heating values weighted by mass",
  "1308.6069 Btu/scf, the hydrocarbons alone scaled to one",
  "1035.6050 Btu/scf, the ghvBtuScf of the lean OGUTA gas"],
 "The ceiling is the heating value times a thousand over BTU_PER_MWH, and EGBEMA's heating value is ghvBtuScf 1248.4110, blended on moles. The digest prints 1537.2878 and 1308.6069 as two shortcuts beside the engine's figure, and 1035.6050 is OGUTA's.")

q(2, "Mini LNG's yield unit is the tonne. Which ceiling does its row carry for the associated gas?",
 "0.0267 t",
 ["0.0175 t",
  "26.7066 t",
  "0.0210 t"],
 "Mini LNG's yield unit is t, and its EGBEMA ceiling prints 0.0267. 26.7066 is the CNG ceiling in kg, 0.0175 is the mini LNG yield the study typed and 0.0210 is OGUTA's mini LNG ceiling.")

q(0, "Where do the EGBEMA yields the study typed sit against their ceilings?",
 "Every one sits at or below its ceiling.",
 ["The LPG yield of 0.0052 t sits above the 0.0010 t ceiling.",
  "The CNG yield of 18.5 kg sits above the 0.3659 ceiling.",
  "The mini LNG yield of 0.0175 t sits above its 0.0056 t."],
 "The digest: \"Every EGBEMA yield typed sits at or below its ceiling.\" 0.0010 is OGUTA's LPG ceiling, 0.3659 is EGBEMA's gas to power ceiling in MWh, and 0.0056 is the studio gas's LPG ceiling. EGBEMA's own ceilings are 26.7066, 0.0267, 0.0067 and 0.3659.")

q(3, "Which exported constant does the gas to power ceiling divide by?",
 "BTU_PER_MWH",
 ["SCF_PER_LBMOL",
  "GAL_PER_FT3",
  "KJ_PER_KWH"],
 "The gas to power ceiling is the heating value times a thousand over BTU_PER_MWH, 3412141.6331 International Table Btu in one megawatt hour. SCF_PER_LBMOL and GAL_PER_FT3 are flareToValue's mole and gallon constants, and KJ_PER_KWH is lpgCng's.")

q(2, "Which gas prints a gas to power ceiling of 0.3548 MWh per Mscf?",
 "The studio's opening gas, at 1210.7800 Btu/scf",
 ["EGBEMA, at 1248.4110 Btu/scf",
  "OGUTA, the lean gas, at 1035.6050 Btu/scf",
  "The studio's opening gas, at 1248.4110 Btu/scf"],
 "The gas to power row prints 0.3659 on EGBEMA, 0.3035 on OGUTA and 0.3548 on the studio's opening gas. Each ceiling is built from its own gas's heating value: ghvBtuScf 1248.4110, 1035.6050 and 1210.7800.")

emit(Q, '/root/wt-et-gasvalue-nextgen/tools/course-banks/gasvalue/intermediate/gvi_m02.json', label='gvi_m02', expect_n=15)
finish()
