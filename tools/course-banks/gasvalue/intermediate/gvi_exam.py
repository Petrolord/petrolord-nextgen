import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# gasvalue Professional exam: the whole tier, digest SECTIONS 16 to 24, read as
# one parcel. Written after the six module banks and asked from angles they do
# not take. Every figure, basis word and engine sentence is a string the digest
# prints. No question keys an NPV or an IRR, a credit price, a GWP edition or a
# requirement limit as the right one: each is the study's input, invented and
# illustrative.

# ---- routes and envelopes (SECTIONS 16, 17)
q(1, "In ROUTE_TEMPLATES, which yield units do CNG, mini LNG and gas to power carry, in that order?",
 "kg, t and MWh",
 ["t, t and MWh",
  "kg, kg and Btu/scf",
  "kg, t and Btu/scf"],
 "The template table prints yield unit kg for cng, t for mini_lng and lpg_extraction, and MWh for gas_to_power. Btu/scf is the unit of the Minimum heating value requirement.")

q(3, "Mini LNG fails the EGBEMA screen. What does its Maximum inerts row read?",
 "status pass, margin 0.0140",
 ["status fail, margin -0.0080",
  "status unchecked, margin none",
  "status pass, margin 2.5000"],
 "Mini LNG's Maximum inerts reads actual 0.0460 against 0.06, status pass, margin 0.0140. Its two failures are the volume and the CO2 before treatment; -0.0080 is the CO2 margin.")

q(0, "How does the LPG and condensate extraction route screen on EGBEMA against the study's limits?",
 "passes, with margins of 2.5000 on volume and 1.2205 on liquids",
 ["fails, short by 1.2205 gal/Mscf of C3+ on its liquids",
  "not fully screened, with Minimum liquids content unchecked",
  "passes, with margins of 4.5000 on the volume and 1.2205 on the liquids"],
 "The LPG rows print Minimum volume 7.5000 against 5, margin 2.5000, and Minimum liquids content 3.2205 against 2, margin 1.2205, both pass, and the verdict passes. 4.5000 is the gas to power volume margin, against its limit of 3.")

q(2, "EGBEMA's liquids content of 3.2205 gal/Mscf of C3+ is checked against the LPG route's minGpmC3Plus of 2. Which margin prints, by which rule?",
 "1.2205: the actual minus the limit, on a minimum",
 ["0.0140: the limit minus the actual, on a maximum",
  "2.5000: the actual minus the limit, on a minimum",
  "1.2205: the limit minus the actual, on a minimum"],
 "The margin is the actual minus the limit on a minimum requirement and the limit minus the actual on a maximum. The liquids row prints 1.2205. 0.0140 is the inerts margin, a maximum, and 2.5000 the LPG volume margin.")

q(1, "Which limits did the EGBEMA study type on the Compressed natural gas route?",
 "minVolumeMMscfd 5, maxInertFraction 0.06, minGhvBtuScf 1000",
 ["minVolumeMMscfd 3, minGhvBtuScf 950, with the inerts left unset",
  "minVolumeMMscfd 10, maxCo2Fraction 0.02, maxInertFraction 0.06",
  "minVolumeMMscfd 5, minGpmC3Plus 2, with no heating value limit"],
 "The digest's limits table: Compressed natural gas, minVolumeMMscfd 5, maxInertFraction 0.06, minGhvBtuScf 1000. The others are the gas to power, mini LNG and LPG rows.")

q(3, "Which three words does screenRoute give a ROUTE as its verdict?",
 "passes, fails and not fully screened",
 ["pass, fail and unchecked",
  "passes, fails and unchecked, as each check reads",
  "passes, fails and screened out of the comparison"],
 "The digest: \"Three verdicts appear: passes, fails, and not fully screened.\" pass, fail and unchecked are the statuses of a single requirement's check, and screenedOut is a compareRoutes field.")

# ---- the yield and its ceiling (SECTION 18)
q(0, "The associated gas holds propane and heavier. Which LPG ceiling does the table give it?",
 "0.0067 t",
 ["0.0052 t",
  "0.0010 t",
  "6.6647 t"],
 "The LPG row prints 0.0067 on EGBEMA. 0.0052 t is the LPG yield the study typed, 0.0010 t OGUTA's ceiling, and 6.6647 is EGBEMA's c3PlusKgPerMscf, in kg.")

q(2, "OGUTA's CNG ceiling prints 21.0224 kg per Mscf. Which figure characteriseGas prints for OGUTA reads the same?",
 "kgPerMscf",
 ["molarMassLbLbmol",
  "c3PlusKgPerMscf",
  "ghvBtuScf"],
 "CNG is capped on the whole gas mass, and characteriseGas prints OGUTA's kgPerMscf as 21.0224. OGUTA's molarMassLbLbmol is 17.5880, its ghvBtuScf 1035.6050, and its LPG ceiling rests on the propane and heavier.")

q(3, "Which typed yield and ceiling does the digest print for EGBEMA's gas to power route?",
 "0.085 MWh against a ceiling of 0.3659",
 ["0.085 MWh against a ceiling of 0.3548",
  "0.94 MWh against a ceiling of 0.3659",
  "0.3659 MWh against a ceiling of 0.3035"],
 "EGBEMA's gas to power yield typed is 0.085 and its ceiling 0.3659 MWh per Mscf. 0.3548 and 0.3035 are the studio gas's and OGUTA's gas to power ceilings, and 0.94 is the route's recovery.")

q(1, "The refusal of a CNG yield of 30 kg/Mscf on EGBEMA names a basis in brackets. Which?",
 "(gas mass)",
 ["(propane and heavier)",
  "(heating value)",
  "(kg per Mscf of CNG)"],
 "The refusal reads \"... more than the 26.706618 kg the gas holds (gas mass).\" The LPG refusal on the studio gas names (propane and heavier).")

q(2, "Both ceiling refusals in the digest close on the same sentence. Which?",
 "\"A yield above what the gas contains is refused.\"",
 ["\"A yield of zero is refused on every route.\"",
  "\"The ceiling is the licensor's, and it is yours to set.\"",
  "\"A recovery assumed at 100 percent is the quiet optimism that sinks these cases.\""],
 "The LPG refusal at 0.02 t/Mscf and the CNG refusal at 30 kg/Mscf each close on \"A yield above what the gas contains is refused.\" The recovery sentence closes the recovery refusal.")

q(0, "Which CNG ceiling does yieldCeiling print on the studio's opening gas?",
 "25.4954 kg per Mscf",
 ["26.7066 kg per Mscf",
  "21.0224 kg per Mscf",
  "0.0255 kg per Mscf"],
 "The studio's opening gas carries a CNG ceiling of 25.4954 kg on the gas mass basis. The 0.0255 printed for the same gas belongs to mini LNG, in t.")

# ---- a route's year and its capital (SECTIONS 19, 20)
q(3, "Which operating cost a year does routeEconomics print for mini LNG?",
 "6930625.00",
 ["2831875.00",
  "3345500.00",
  "4798125.00"],
 "The year table prints operatingCostPerYear 6930625.00 on mini LNG, from a fixed 5200000 and 0.65 dollars per Mscf. 2831875.00 is CNG's, 3345500.00 LPG's and 4798125.00 gas to power's.")

q(2, "How does grossMarginPerYear relate to the two figures printed before it in the year table?",
 "revenuePerYear minus operatingCostPerYear, on every row",
 ["revenuePerYear minus operatingCostPerYear minus the capital",
  "revenuePerYear minus the variable cost of the recovered gas",
  "revenuePerYear minus operatingCostPerYear, over mscfPerYear"],
 "The digest: \"grossMarginPerYear is revenuePerYear minus operatingCostPerYear, on every row.\" The margin over mscfPerYear is valuePerMscf, and the capital sits in the cash flow's year 0.")

q(0, "What productPerYear does routeEconomics print for gas to power?",
 "212733.7500 MWh",
 ["11352.9000 MWh",
  "40070.6250 MWh",
  "43345500.0000 MWh"],
 "Gas to power prints 212733.7500 MWh from 0.085 MWh per Mscf at a recovery of 0.94. 11352.9000 is the LPG route's product in t, 40070.6250 mini LNG's in t and 43345500.0000 CNG's in kg.")

q(1, "The recovery refusal carries a second sentence. Which?",
 "\"A recovery assumed at 100 percent is the quiet optimism that sinks these cases.\"",
 ["\"A recovery left blank is taken as zero and named in assumedZero beside the costs.\"",
  "\"Recovery limits are yours to set, and ship unset.\"",
  "\"Gas the plant does not recover is sold at the price.\""],
 "Every recovery probe, whether typed 0, typed 1.2 or left blank, closes on this sentence after naming the interval (0, 1]. assumedZero is where a blank COST is named.")

q(3, "Which route's capital on the exponent 0.9 comes out ABOVE its six-tenths reading on the same plant?",
 "Compressed natural gas: 29337983.06 against 27438303.12",
 ["Mini LNG: 42870938.50 against 52780316.43",
  "LPG and condensate extraction: 29331801.26 against 31975721.65",
  "Gas to power or gas to wire: 32753824.67 against 37713602.10"],
 "Only the CNG row prints a positive entry in the modular minus six-tenths column, 1899679.94. The other three rows print negative entries there.")

q(2, "What is cashFlow.year0 on every route routeEconomics hands on?",
 "The capitalCost as a negative",
 ["The first year's gross margin, as a positive",
  "The capitalCost less the recurring margin",
  "The capitalCost discounted to year 0"],
 "The digest: \"Year 0 is the capital as a negative, and the recurring figure is the margin\", so CNG's year0 is -29337983.06 beside a capitalCost of 29337983.06. The engine assembles the cash flow and hands it on; it does not discount it.")

q(0, "What does flareToValue's valuation note say a discounted cash flow in the module would be?",
 "\"a second answer\"",
 ["the sanctioned figure",
  "the ranking basis",
  "a bet on the price"],
 "The note: \"Capital, operating cost and revenue are assembled here and handed to the sanctioned economics engine. A second discounted cash flow in this module would be a second answer.\" \"This is a bet on the credit price\" is creditSensitivity's verdict, and the bid ranks on gross margin per Mscf.")

q(1, "From which reference plant is EGBEMA's CNG capital scaled?",
 "24000000 dollars at 6 MMscfd",
 ["80000000 dollars at 15 MMscfd",
  "38000000 dollars at 10 MMscfd",
  "50000000 dollars at 12 MMscfd"],
 "The inputs table prints CNG's reference capital 24000000 at a reference capacity of 6 MMscfd, scaled TO the parcel's 7.5 MMscfd. The others are the mini LNG, LPG and gas to power plants.")

q(3, "Which recovery did the EGBEMA study type on the LPG route, and what product a year does it print?",
 "0.82, and 11352.9000 t of LPG",
 ["0.86, and 11352.9000 t of LPG",
  "0.82, and 40070.6250 t of LPG",
  "0.88, and 43345500.0000 t of LPG"],
 "The LPG inputs print a yield of 0.0052 t and a recovery of 0.82, and productPerYear 11352.9000 t LPG. 0.86 is mini LNG's recovery and 40070.6250 its product in t LNG; 0.88 is CNG's.")

# ---- the counterfactual (SECTION 21)
q(2, "What reason does the digest print for crediting only the recovered share of the flare?",
 "What the plant leaves unrecovered is still flared.",
 ["The unrecovered gas is vented, all of it methane.",
  "The GWP applies only to the recovered share.",
  "The credit price is set on the recovered share."],
 "The digest: \"The gas it does not recover is still flared, so the avoided flare CO2e is the flare's CO2e times the recovery.\" blockedBy words the same rule: gas the plant does not recover is still flared.")

q(0, "On which CNG counterfactual does the net abatement print the same figure as the avoided flare?",
 "Pipeline gas already burned, where displaced fuel and product combustion both read 128000",
 ["Diesel in haulage trucks, where the displaced fuel reads 156000 and the net reads 218032.865",
  "A market that burned nothing, where the displaced fuel reads 0 and the net reads 62032.865",
  "None: the net always differs from the avoided flare of 190032.865 on every row"],
 "The pipeline gas row prints product combustion 128000, displaced fuel 128000 and a net of 190032.865, the avoided flare's figure. The diesel and burned nothing rows print nets of 218032.865 and 62032.865.")

q(3, "Which 'net minus the gross flare' figure belongs to the row whose displaced fuel is 0?",
 "-153913.573",
 ["-25913.573",
  "2086.427",
  "-2010.348"],
 "The displaced fuel 0 row prints -153913.573 in that column, the pipeline gas row -25913.573 and the diesel row 2086.427. -2010.348 is a net, on gas to power.")

q(1, "Which recovery gives gas to power its avoided flare of 202989.652 t/yr?",
 "0.94",
 ["0.88",
  "0.82",
  "0.86"],
 "The digest: \"Gas to power recovers 0.94.\" avoidedFlareCo2eTonnes 202989.652. 0.88 is CNG's recovery, 0.82 LPG's and 0.86 mini LNG's.")

q(2, "abatement's warning, printed while the counterfactual is undeclared, says which way the abatement moves against the flare's gross emission. What does it print?",
 "Larger if the product displaces a dirtier fuel; smaller if it displaces nothing.",
 ["Smaller if the product displaces a dirtier fuel; larger if it displaces nothing.",
  "Larger if the product displaces a dirtier fuel; equal if it displaces nothing.",
  "Equal to the gross emission, whatever the product displaces."],
 "The warning: \"recover the gas and somebody burns it, and if that displaces a dirtier fuel the abatement is larger while if it displaces nothing it is smaller.\" It opens \"No abatement is reported.\"")

q(0, "Two abatement probes print blockedBy \"no recovery fraction in (0, 1]: gas the plant does not recover is still flared\". Which two?",
 "no recovery fraction, and recovery 1.5",
 ["no GWP, and recovery 1.5",
  "no recovery fraction, and no displaced fuel figure",
  "no counterfactual label, and recovery 1.5"],
 "The blocked probe table prints that text for no recovery fraction and for recovery 1.5. No GWP prints its own text, and the label and displaced fuel probes print the counterfactual text.")

q(3, "Which counterfactual label does the gas to power route carry on EGBEMA?",
 "\"Gas to power for a new load that burned nothing\"",
 ["\"CNG sold into a market that burned nothing\"",
  "\"Gas to power displacing diesel generators\"",
  "\"Gas to power displacing pipeline gas\""],
 "The digest: Gas to power's counterfactual, \"Gas to power for a new load that burned nothing\": product combustion 205000, displaced 0. The CNG label is the CNG route's third counterfactual.")

# ---- credits and the bid (SECTIONS 22, 23)
q(1, "The study's first typed price is 40 dollars per tonne. Which credit revenue, total margin and outcome follow?",
 "credit revenue 8721314.60, total margin 29729464.60, clears",
 ["credit revenue 4360657.30, total margin 25368807.30, clears",
  "credit revenue 8721314.60, total margin 29729464.60, fails",
  "credit revenue 1744262.92, total margin 22752412.92, fails"],
 "The 40 row prints creditRevenuePerYear 8721314.60, totalMarginPerYear 29729464.60 and clearsHurdle true. The 4360657.30 row is 20 and the 1744262.92 row is 8.")

q(2, "How does creditSensitivity decide whether a typed price clears?",
 "Its total margin, the gross margin plus the credit revenue, reaches the hurdle.",
 ["Its credit revenue alone reaches the hurdle margin the study typed.",
  "Its price reaches the lowest tested price in the order typed.",
  "Its total margin, less the capital, reaches the hurdle margin."],
 "The digest: \"totalMarginPerYear is the route's gross margin plus that; a point clears when its total margin reaches the hurdle.\" The capital is no term of the credit test.")

q(0, "Of the credit prices typed on EGBEMA's CNG route, which print clearsHurdle true?",
 "40 and 20",
 ["40 and 12",
  "20 and 12",
  "40, 20 and 12"],
 "The price table prints true at 40 and 20 and false at 8 and 12, with total margins of 22752412.92 and 23624544.38 below the hurdle of 24500000.")

q(3, "creditSensitivity is run on a route with its price missing, so it has no margin. What does it answer?",
 "No verdict and a null breakeven; it asks the study to supply its price and costs.",
 ["REFUSED: The hurdle margin is not a number.",
  "A breakeven worked on a margin of zero, with the price named in assumedZero.",
  "No verdict and a null breakeven; it reports that no hurdle margin was given."],
 "With the price missing there is no margin. The digest prints the answer as having no verdict, a null breakevenCreditPrice and a request to supply the price and costs. A hurdle typed as 'x' is the refused probe.")

q(1, "What does the bid table print in the net abatement column for its four EGBEMA routes?",
 "218032.865 on CNG, and none declared on the other three",
 ["218032.865 on CNG, and -2010.348 on gas to power",
  "215946.438 on each route, the flare's gross CO2e",
  "none declared on all four, as credits come later"],
 "The bid table prints netAbatementTonnesCo2ePerYear 218032.865 on Compressed natural gas and none declared on Mini LNG, LPG and gas to power. -2010.348 is a counterfactual probe, and the gross flare is reported as grossClaimIfNoCounterfactual beside a blocked net.")

q(2, "What happens to the failing mini LNG route when compareRoutes lays out the bid?",
 "It keeps its row, verdict fails, and names it in screenedOut.",
 ["It drops the row and names the route in screenedOut.",
  "It keeps its row and names it in notFullyScreened.",
  "It keeps its row and ranks it best on its capital."],
 "The digest: \"A route that fails screening stays in the table with its failure named.\" Mini LNG keeps capital 42870938.50 and value per Mscf 4.2447 beside its verdict, and screenedOut reads Mini LNG. notFullyScreened names gas to power.")

q(3, "The rankingNote's second sentence tells the reader what to do. What?",
 "Compare against the capital column, and value the shortlist in the sanctioned economics engine.",
 ["Rank the routes again on net abatement, and price the credits in the sanctioned economics engine.",
  "Set the limits before relying on the ranking, and screen the routes again.",
  "Discount each route's cash flow here, and rank the routes on the result."],
 "After its ranking basis, the note sends the reader to the capital column before concluding and sends the shortlist to the sanctioned economics engine for its value. Setting the limits first is the advice printed while every limit is unset.")

q(0, "With every limit unset, as the studio opens, which rankingNote does compareRoutes print?",
 "\"No route passes screening yet, so none is ranked best.\" with CNG named as leading on value",
 ["\"Ranked on gross margin per Mscf, which ignores the capital.\" with cng named best",
  "\"No route passes screening yet, so none is ranked best.\" with mini LNG screened out",
  "\"Ranked on net abatement, which ignores the capital.\" with Compressed natural gas named as the leader"],
 "The opening note reads: \"No route passes screening yet, so none is ranked best. Compressed natural gas leads on value among routes not fully screened; set the limits before relying on it.\" Every route reads not fully screened, so none is screened out.")

q(1, "Where do the credit prices creditSensitivity tests come from?",
 "The case types them; the engine ships none.",
 ["The engine's table of market credit prices.",
  "The engine's default list, 40, 8, 20 and 12.",
  "The hurdle margin over the net abatement."],
 "The digest: \"Credit prices are case inputs; the engine ships none.\" 40, 8, 20 and 12 are the prices the EGBEMA case typed. The hurdle minus the margin over the net tonnes is the breakeven.")

# ---- the tier read as one parcel (SECTION 24 with 16 to 23)
q(2, "SECTION 24 reads EGBEMA's CNG route from the gas to the credit test. Which flareToValue functions does its function line name?",
 "routeEconomics, abatement and creditSensitivity",
 ["screenRoute, yieldCeiling and compareRoutes",
  "characteriseGas, abatement and compareRoutes",
  "routeEconomics, compareRoutes and creditSensitivity"],
 "SECTION 24's function line reads flareToValue.routeEconomics, abatement, creditSensitivity.")

q(3, "abatement multiplies the flare's CO2e by one figure the CNG route also types for its year. Which?",
 "The recovery, 0.88",
 ["The yield, 18.5 kg per Mscf",
  "The price, 0.55 dollars a kg",
  "The variable cost, 0.35 per Mscf"],
 "The avoided flare CO2e is the flare's CO2e times the recovery, 0.88 on CNG, and productPerYear is mscfPerYear times the yield times the same recovery.")

q(0, "Which row does the bid table print for gas to power or gas to wire?",
 "not fully screened, capital 32753824.67, value per Mscf 2.8321",
 ["passes, capital 32753824.67, value per Mscf 2.8321",
  "not fully screened, capital 37713602.10, value per Mscf 2.8321",
  "not fully screened, capital 32753824.67, value per Mscf 0.7476"],
 "The bid row prints not fully screened, capitalCost 32753824.67, grossMarginPerYear 7540432.50 and valuePerMscf 2.8321. 37713602.10 is the six-tenths reading on its plant and 0.7476 is the LPG route's value.")

q(1, "A study leaves several boxes blank. Which blank does the engine refuse outright?",
 "The recovery on a route",
 ["A variable cost box on a route",
  "The reference plant cost",
  "The hurdle margin in the credit test"],
 "A blank recovery draws REFUSED: needs a recovery fraction in (0, 1]. A blank cost is taken as zero and named in assumedZero, a blank reference cost gives a null capital with a note, and a blank hurdle is answered with no verdict.")

q(2, "Which blank box does routeEconomics fill from a stated value, and print the value it took?",
 "The scaling exponent, which takes MODULAR 0.9",
 ["The recovery, which takes 1 and prints it",
  "The on-stream days, which take the default 350",
  "The hurdle margin, which takes zero"],
 "With the scaling exponent typed blank, routeEconomics takes the MODULAR exponent: scalingExponent 0.9. A blank recovery and blank on-stream days are refused; 350 is the default for days OMITTED from the call. A blank hurdle is creditSensitivity's, answered with no verdict.")

emit(Q, '/root/wt-et-gasvalue-nextgen/tools/course-banks/gasvalue/intermediate/gvi_exam.json', label='gvi_exam', expect_n=42)
finish()
