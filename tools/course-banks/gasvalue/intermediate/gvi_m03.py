import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# gasvalue Professional m03, A Route's Year.
# Draws on m03's five lessons only: digest SECTION 19 (routeEconomics on
# EGBEMA's four routes, the on-stream days, the recovery refusals and the blank
# cost named in assumedZero) and SECTION 20 (capital by the modular power law,
# the six-tenths reading beside it and the cash flow handed on undiscounted).
# Every figure is a string the digest prints, at its printed precision.

q(3, "EGBEMA's routes run on 7.5 MMscfd and 355 days. What mscfPerYear does routeEconomics print for each route?",
 "2662500.0000, on every route",
 ["2625000.0000 on all four",
  "2662500.0000 on CNG, and less on the other routes",
  "2662500000 on all four"],
 "mscfPerYear is the volume in Mscf a day times the on-stream days, and all four rows print 2662500.0000. 2625000.0000 is the CNG route's figure with the days omitted and the default of 350 taken, and 2662500000 is the flare's scfPerYear in standard cubic feet.")

q(1, "A routeEconomics call on the CNG route carries no on-stream days field at all. Which days and Mscf a year does it use?",
 "It takes onstreamDays 350: mscfPerYear 2625000.0000.",
 ["REFUSED: On-stream days are required, more than 0 and no more than 366.",
  "It takes onstreamDays 355: mscfPerYear 2662500.0000.",
  "It takes the days as zero and names them in assumedZero."],
 "The digest: \"On-stream days OMITTED from routeEconomics take the stated default: onstreamDays 350, mscfPerYear 2625000.0000 on the CNG route.\" The refusal is what a days box typed blank gets, and 355 is the figure the EGBEMA study typed.")

q(0, "EGBEMA's CNG route is called with its on-stream days typed blank (''). What does routeEconomics answer?",
 "REFUSED: On-stream days are required, more than 0 and no more than 366.",
 ["It takes the stated default, onstreamDays 350, and prints mscfPerYear 2625000.0000.",
  "It takes the days as zero, names them in assumedZero, and prints a year of none.",
  "It takes the flare's 355 days and prints mscfPerYear 2662500.0000 on the route."],
 "SECTION 19 prints this refusal for the CNG days box typed blank. The stated default of 350 applies only to days left out of the call, and 355 is EGBEMA's own typed figure.")

q(2, "How does routeEconomics form productPerYear?",
 "mscfPerYear times the yield times the recovery",
 ["mscfPerYear times the yield ceiling times the recovery",
  "mscfPerYear times the yield, with no recovery in it",
  "mscfPerYear times the yield times the price"],
 "The digest: \"productPerYear is that times the yield times the recovery\", where that is mscfPerYear. On CNG, 2662500.0000 Mscf, 18.5 kg and 0.88 give 43345500.0000 kg of CNG. Revenue is product times price, and the yield ceiling is no term of the rule.")

q(2, "A study clears the recovery box on the CNG route and runs the year. What happens?",
 "It refuses: the route needs a recovery fraction in (0, 1].",
 ["It takes the recovery as 1 and names it in assumedZero.",
  "It takes the recovery as zero and prints a product of none.",
  "It takes the stated default recovery and prints a full year."],
 "The digest prints \"CNG recovery left blank ('')\" with REFUSED: Route \"Compressed natural gas\" needs a recovery fraction in (0, 1]. A recovery assumed at 100 percent is the quiet optimism that sinks these cases. The recoveries 0 and 1.2 draw the same refusal.")

q(0, "How does routeEconomics form a route's operating cost a year?",
 "The fixed cost plus the variable cost per Mscf of the whole parcel.",
 ["The fixed cost plus the variable cost per Mscf recovered.",
  "The fixed cost plus the variable cost per unit of product.",
  "The variable cost per Mscf, with the fixed in capital."],
 "The digest: \"operating cost is the fixed cost plus the variable cost per Mscf of the whole parcel\". On CNG the fixed 1900000 and 0.35 dollars per Mscf print an operating cost of 2831875.00.")

q(3, "Which rule gives valuePerMscf, the last figure of a route's year?",
 "The margin over mscfPerYear",
 ["The margin over the Mscf the route recovers",
  "Revenue over mscfPerYear",
  "Margin over productPerYear"],
 "The digest: \"valuePerMscf is the margin over mscfPerYear.\" On CNG, a gross margin of 21008150.00 over 2662500.0000 Mscf prints 7.8904.")

q(1, "The CNG route's variable cost box is left blank (''). Which row does routeEconomics print?",
 "operating cost 1900000.00, valuePerMscf 8.2404, assumedZero variable operating cost",
 ["operating cost 931875.00, valuePerMscf 8.6040, assumedZero variable operating cost",
  "operating cost 2831875.00, valuePerMscf 7.8904, assumedZero none",
  "REFUSED: the variable operating cost is required"],
 "The digest's blank cost table: variable cost left blank ('') gives 1900000.00, 8.2404 and variable operating cost. A cost box left blank is taken as zero and named in assumedZero. 931875.00 and 8.6040 belong to the fixed cost left blank, and 2831875.00 and 7.8904 to both costs typed.")

q(0, "The CNG route's fixed cost is left blank (null). What does assumedZero read, and what operating cost prints?",
 "fixed operating cost; 931875.00",
 ["variable operating cost; 1900000.00",
  "none; 2831875.00, as both are typed",
  "fixed operating cost; 1900000.00"],
 "The digest's row for the fixed cost left blank (null) prints operatingCostPerYear 931875.00, valuePerMscf 8.6040 and assumedZero fixed operating cost. 1900000.00 is the operating cost with the variable cost blank.")

q(3, "Which row does routeEconomics print for EGBEMA's LPG and condensate extraction route?",
 "revenue 5335863.00, margin 1990363.00, value per Mscf 0.7476",
 ["revenue 12338557.50, margin 7540432.50, value per Mscf 2.8321",
  "revenue 5335863.00, margin 3345500.00, value per Mscf 0.7476",
  "revenue 18232134.38, margin 11301509.38, value per Mscf 4.2447"],
 "The LPG row prints revenuePerYear 5335863.00, operatingCostPerYear 3345500.00, grossMarginPerYear 1990363.00 and valuePerMscf 0.7476. 3345500.00 is its operating cost. The 12338557.50 row is gas to power and the 18232134.38 row is mini LNG.")

q(1, "EGBEMA's routes scale their capital with modularRefinery's power law. Which scalingExponent does each route print?",
 "0.9 on all four routes",
 ["0.6, STICK_BUILT",
  "0.9 on CNG and 0.6 on the other routes",
  "0.88, the CNG recovery"],
 "The capital table prints scalingExponent 0.9 on all four routes, and modularRefinery exports MODULAR 0.9 and STICK_BUILT 0.6. The six-tenths column is the same scaling at STICK_BUILT, printed beside the engine's figure.")

q(2, "What does the capital table print as mini LNG's modular minus six-tenths?",
 "-9909377.93",
 ["1899679.94",
  "-2643920.39",
  "-4959777.43"],
 "Mini LNG prints capitalCost 42870938.50 at 0.9 and 52780316.43 on the six-tenths rule, and the difference column prints -9909377.93. 1899679.94 is CNG's, -2643920.39 LPG's and -4959777.43 gas to power's.")

q(3, "A study clears the scaling exponent box on the CNG route. Which exponent and capital follow?",
 "The MODULAR exponent: 0.9, capitalCost 29337983.06.",
 ["STICK_BUILT: 0.6, capitalCost 27438303.12.",
  "No exponent: a null capital and a note.",
  "REFUSED: a scaling exponent is required."],
 "The digest: \"With the scaling exponent typed blank ('') routeEconomics takes the MODULAR exponent: scalingExponent 0.9, capitalCost 29337983.06 on the CNG route.\" 27438303.12 is the six-tenths reading on the same plant.")

q(0, "A route's reference plant cost is left blank. What does routeEconomics give for capital?",
 "Capital null, with the note \"No capital cost: a reference plant cost and capacity are required to scale from.\"",
 ["Capital zero, named in assumedZero beside the operating costs.",
  "REFUSED: a reference plant cost is required to scale from.",
  "Capital scaled from the MODULAR default plant for the route."],
 "The digest: \"With the reference cost left blank the capital is null and the note reads: No capital cost: a reference plant cost and capacity are required to scale from.\" A blank cost box is the one taken as zero in assumedZero, and no default plant is printed.")

q(2, "What cash flow does routeEconomics hand on for EGBEMA's gas to power route?",
 "year0 -32753824.67, recurring 7540432.50",
 ["year0 -32753824.67, recurring 12338557.50",
  "year0 -42870938.50, recurring 7540432.50",
  "year0 -29331801.26, recurring 1990363.00"],
 "Year 0 is the capital as a negative and the recurring figure is the margin: gas to power prints -32753824.67 and 7540432.50. 12338557.50 is its revenue. The engine does not discount the flow: \"A second discounted cash flow in this module would be a second answer.\"")

emit(Q, '/root/wt-et-gasvalue-nextgen/tools/course-banks/gasvalue/intermediate/gvi_m03.json', label='gvi_m03', expect_n=15)
finish()
