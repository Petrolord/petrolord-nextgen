import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# carbon Expert final exam, the whole tier. Digest SECTIONS 18 to 26: the cost
# of a tonne and its refusals, the AGBOR curve, sources and over-claims, the
# target and the path, one saving in money and carbon, energy intensity, the
# rules in force and what the oracles check. Written LAST, after the six module
# banks, and asked from other angles than theirs. Every figure is invented for
# this course; money is in US dollars; the inventory is on IPCC AR6 GWP100,
# fossil methane. 42 questions.

# --- the cost of a tonne (SECTIONS 18, 19)
q(2, "Which invented AGBOR measure carries the capital recovery factor 0.40211480 at the rate of 0.1?",
 "Repair failed steam traps, over 3 years",
 ["Tune the fired heaters, over 5 years",
  "Vapour recovery on the storage tanks, over 12 years",
  "Solar for purchased power, 20 years"],
 "Keyed from the factor column of SECTION 18: 0.40211480 sits on the 3 year row. Five years gives 0.26379748, twelve 0.14676332 and twenty 0.11745962.")

q(0, "Which net annual cost and cost per tonne does SECTION 18 print for Solar for purchased power at 0.1?",
 "96300.31 net, 45.8573 per tonne",
 ["217300.31 net, 45.8573 per tonne",
  "96300.31 net, -13.5714 per tonne",
  "65525.62 net, 35.4193 per tonne"],
 "Solar's row: net 96300.31, per tonne 45.8573, both in USD. Its annualised capital is 217300.31; -13.5714 is its straight-line figure; 65525.62 with 35.4193 is the vapour recovery row.")

q(3, "Vapour recovery on the storage tanks appears in SECTION 18 at 35.4193, 14.5045 and 316.7568 USD a tonne. Which figure does the curve rank it by?",
 "35.4193, levelised at the rate of 0.1",
 ["14.5045, straight line at a rate of 0",
  "316.7568, its capital against one year",
  "-29.7913, the plain mean of the curve"],
 "Order 4 on the curve carries 35.4193, the levelised figure. 14.5045 belongs to the rate-0 column, 316.7568 to the one-year column the digest computes for contrast, and -29.7913 is the digest's unweighted mean.")

q(1, "What does the curve's refusedNote say of a measure abatementCost refused?",
 "It is off the curve and out of every total until it is costed.",
 ["It is placed last on the curve at a cost per tonne of 0 USD.",
  "It stays in totalAbatementTonnes and leaves the weighted average.",
  "It is costed at a capital of 0 and named in the assumedZero field."],
 "The note in SECTION 19 keeps an uncosted measure away from the steps and from every sum until a cost exists for it.")

q(0, "An invented abatement of -500 t a year is sent for the Heat integration project. Which reasons does the refusal give?",
 "A measure that adds emissions is no abatement, and its cost per tonne would change sign.",
 ["A blank abatement is not read as 0, which would move the measure down the curve.",
  "An abatement of -500 t exceeds what the heaters emit, so the claim is an over-claim.",
  "A negative abatement is read as 0, and the field is named in the assumedZero list."],
 "SECTION 19 gives two grounds: adding emissions is no abatement, and the sign of the per-tonne figure would flip. Over-claims are a curve check in SECTION 21, and assumedZero covers only running figures.")

# --- the curve (SECTION 20)
q(2, "Which step on the Agbor curve runs from 7160.000 t to 9260.000 t?",
 "The fifth step, 2100.000 t a year wide",
 ["The fourth step, 1850.000 t a year wide",
  "The sixth step, 6200.000 t a year wide",
  "The third step, 3400.000 t a year wide"],
 "Order 5 starts where order 4 stops, at 7160.000, and stops at 9260.000; its width is Solar's 2100.000 t a year.")

q(1, "The Agbor curve's summary cost per tonne and the digest's plain mean carry opposite signs. Which one does the engine return?",
 "weightedAverageCostPerTonne, 18.7868 USD",
 ["The plain mean, -29.7913 USD",
  "netAnnualCostOfAll, 18.7868 USD",
  "The plain mean, 18.7868 USD a tonne"],
 "Only the weighted figure is an engine output. The unweighted -29.7913 is marked computed here, and netAnnualCostOfAll is a money total of 290443.84 USD.")

# --- sources and over-claims (SECTION 21)
q(3, "Suppose every claim on a curve were checked and the only issue were two measures on one source. What does SECTION 21 say of the verdict?",
 "It stands, and is labelled an upper bound.",
 ["It is none, as the claims are not additive.",
  "It is none, and the basis names the source.",
  "It is refused until the overlap is sequenced."],
 "Interaction alone, with every claim checked, leaves a standing verdict carrying the upper-bound label. A none belongs to over-claims and to claims on sources with no emission passed.")

q(3, "The 9400 t claim is run with the flare's emission not passed. Which sources does its targetBasis name?",
 "steam, flare, power, vents",
 ["steam, power, vents",
  "flare",
  "steam"],
 "Leaving the flare out adds it to the unchecked list, so the basis names four sources. Three are named on the six as costed, and one, steam, once every computed source is passed.")

q(0, "In the digest's own words, what does raising a claim beyond its source's emission do to how a measure looks?",
 "It makes the measure look cheaper as well as larger.",
 ["It leaves the cost per tonne at 78.1002 USD a tonne.",
  "It raises the net annual cost to match the new tonnes.",
  "It refuses the measure until the claim is brought down."],
 "The reading attached to the 9400 t costing: the per-tonne figure falls as tonnes rise, a cheaper as well as larger look, with 484221.51 USD of net annual cost unchanged.")

q(2, "What emission does the Carbon Studio pass to the curve for the heaters source?",
 "34927.743 tCO2e, the fired heaters' CO2 line",
 ["56100.276 tCO2e, the whole inventory total",
  "7562.133 tCO2e, the flare source",
  "10988.000 tCO2e, the purchased electricity line"],
 "Heaters go to the curve as 34927.743, one inventory line. The flare goes as 7562.133, and 10988.000 joins only when every computed source is passed, as power.")

# --- the target and the path (SECTION 22)
q(1, "What target does the Agbor path print for 2033, its end year?",
 "39270.193 t, 30 percent below the baseline",
 ["16830.083 t, the target the curves are checked on",
  "31578.593 t, as on the full inventory",
  "40640.276 t, the 2031 emissions"],
 "The straight line ends at 39270.193 in 2033. 16830.083 is the curves' target, 30 percent of the total, 31578.593 the end point on the partial inventory, and 40640.276 an emissions figure.")

q(0, "On the full Agbor inventory, in which years does the unabated gap column print a positive gap?",
 "2027, 2028 and 2033",
 ["2027 and 2033 only",
  "2028, 2032 and 2033",
  "2033, the end year alone"],
 "Positive entries: 494.298, 798.595 and 1370.083, in those three years. Every other year of the scheduled path reads 0.000; 2032 shows a gap only once vapour recovery is unscheduled.")

q(3, "With Vapour recovery on the storage tanks left unscheduled, what does the path's abated column read in 2031?",
 "13610.000 t",
 ["15460.000 t, all six live",
  "7410.000 t, as in 2029",
  "12060.000 t, one refused"],
 "Without its start year the vapour measure never joins, so the column stays where 2030 left it. 15460.000 is the scheduled figure, and 12060.000 the curve total with a refused measure.")

q(2, "An over-abatement refusal comes back from the path. What does it tell the user to look for?",
 "The measures, for double counting or a source outside the baseline",
 ["The start years, for a measure scheduled with no start year",
  "The baseline, for an inventory line that could not be computed",
  "The rate, for a percentage typed where a fraction belongs"],
 "Abating more than the baseline would drive emissions below zero, so the engine points the user at the measures themselves: counted twice, or acting on a source the baseline does not hold.")

# --- one saving in money and carbon (SECTION 23)
q(1, "The basisNote for a saving with no basis declared says IPCC default factors are on which basis?",
 "Net calorific value, which is LHV",
 ["Gross calorific value, which is HHV",
  "Net calorific value, which is HHV",
  "Whichever basis the saving declares"],
 "The note's parenthesis ties IPCC defaults to net calorific value and names that LHV. The course's own factor is SYNTHETIC and makes no such claim.")

q(1, "When priceSaving calls abatementCost for the invented Agbor saving, which figure goes in as the abatement?",
 "annualTonnesCo2e, 661.980",
 ["The energy saving, 11800 GJ",
  "annualValue, 88500.00 USD a year",
  "The SYNTHETIC factor, 56.1 kg CO2e per GJ"],
 "The hand-over maps tonnes to the abatement slot. Money, 88500.00, fills the savings slot; the gigajoules and the factor are not among the three arguments the digest names.")

q(3, "In the direct abatementCost call for the invented saving, over 8 years at 0.1, which pair is the capital recovery factor and the annualised capital?",
 "0.18744402 and 39363.24 USD",
 ["0.26379748 and 4748.35 USD",
  "0.14676332 and 39363.24 USD",
  "0.18744402 and 88500.00 USD"],
 "An 8 year life at 0.1 gives 0.18744402, which turns 210000 into 39363.24 a year. The other pairs borrow the heater tuning row, the vapour factor or the annual value.")

q(0, "Which output of the invented Agbor saving is undiscounted, with no life and no rate in it?",
 "simplePaybackYears, 2.372881",
 ["costPerTonneCo2e, -74.2270 USD",
  "capitalRecoveryFactor, 0.18744402",
  "annualisedCapital, 39363.24 USD"],
 "The payback divides 210000 by one year's value and stops there. The other three all pass through the 8 year life and the 0.1 rate.")

# --- energy intensity (SECTION 24)
q(2, "With Purchased power left blank, which total and intensity does energyIntensity print?",
 "781000.000 GJ and 629.8387 MJ a tonne",
 ["877000.000 GJ and 707.2581 MJ a tonne",
  "781000.000 GJ and 707.2581 MJ a tonne",
  "877000.000 GJ and 629.8387 MJ a tonne"],
 "Dropping the 96000.000 GJ stream leaves 781000.000 and a lower 629.8387, flagged incomplete. The complete pair is 877000.000 with 707.2581.")

q(3, "How does the energyIntensity disclaimer frame the peer figure of 680 MJ a tonne?",
 "As one the user supplied and has the right to use",
 ["As the Solomon Energy Intensity Index for Agbor",
  "As a benchmark the engine ships with the module",
  "As the intensity with a stream missing, a floor"],
 "The engine brings no peer of its own: whatever is compared was supplied by the user, who must hold the right to it. The disclaimer rules out the Solomon index by name.")

# --- the saving's basis, returned
q(0, "Which heating value basis does priceSaving return for the invented Agbor saving?",
 "LHV, the basis all three quantities declare",
 ["HHV, the basis the factor would need",
  "None, with the basisNote attached",
  "LHV for money and HHV for carbon"],
 "The Agbor saving, price and factor are all declared on LHV and the output table reads basis LHV. A basisNote comes back only when nothing is declared, and mixed bases are refused.")

q(2, "The flare's emission is left out and the over-claims column on the 9400 t curve comes back empty. How is that empty column read?",
 "The flare's claim was not checked, and the basis names the flare.",
 ["The flare's 9400 t claim fits within what the flare emits.",
  "The curve found no over-claim, so it gives a verdict on the target.",
  "The flare's claim was refused and taken off the curve and totals."],
 "No emission, no check: the empty column speaks only for sources that were passed. The verdict on that row is still none.")

# --- back to the cost of a tonne
q(1, "What does SECTION 18 print for Solar for purchased power with the whole capital set against one year?",
 "823.3333 USD a tonne, computed here",
 ["764.5161 USD a tonne, computed here",
  "-13.5714 USD a tonne, at a rate of 0",
  "45.8573 USD a tonne, at a rate of 0.1"],
 "The one-year column is the digest's own arithmetic, shown as the wrong route: 823.3333 for Solar and 764.5161 for flare recovery. -13.5714 and 45.8573 are engine costs at the two rates.")

q(3, "On a measure with capital, which box left blank draws a refusal whose words name the one-year trap?",
 "The life",
 ["The discount rate",
  "The capital cost",
  "The annual abatement"],
 "Only the life refusal speaks of setting a one-off capital cost against one year's saving. The others speak of straight-line annualisation, of free capital and of a missing abatement.")

q(1, "On a measure with capital, which of these boxes, left blank, does abatementCost take as 0 and name in assumedZero?",
 "The annual cost",
 ["The rate",
  "The capital",
  "The measure's life"],
 "Running figures are the named zeros; a blank running cost comes back listed in assumedZero. Capital, rate and life, on a measure with capital, are refused when blank.")

q(0, "Which discount rate does abatementCost accept on a measure with capital?",
 "0.1, typed as a fraction",
 ["10, typed as a percentage",
  "1, the top of the range",
  "Blank, to be read as 0"],
 "The accepted range is above -1 and below 1, so 1 itself falls outside it and 10 is refused with the hint 0.1. A blank rate with capital is refused outright.")

q(2, "In 2029, the year the Heat integration project joins the path, how many tonnes does the abated column show?",
 "7410.000 t",
 ["4010.000 t",
  "13610.000 t",
  "5310.000 t"],
 "The 2029 row: 7410.000 abated, 48690.276 emitted. 4010.000 is 2028 and 13610.000 is 2030; 5310.000 is the curve's pays-for-itself total, a different figure.")

q(3, "What does the Agbor path print for abated tonnes and emissions in 2027?",
 "1910.000 t abated, 54190.276 t emitted",
 ["760.000 t abated, 54190.276 t emitted",
  "1910.000 t abated, 53695.978 t emitted",
  "4010.000 t abated, 52090.276 t emitted"],
 "In 2027 heater tuning and trap repair are live and the abated column reads 1910.000; emissions are the baseline less that. 53695.978 is that year's target, and the last pair is 2028.")

q(1, "With the electricity factor blank, what does the Agbor inventory print?",
 "45112.276 tCO2e, reportable false",
 ["56100.276 tCO2e, reportable false",
  "45112.276 tCO2e, reportable true",
  "A refusal naming purchased electricity"],
 "The inventory still totals, one line short, and says so: 45112.276 with reportable false and one line that could not be computed.")

q(2, "Which set of inputs does SECTION 18 print for Tune the fired heaters?",
 "Capital 18000 USD over 5 years, factor 0.26379748",
 ["Capital 18000 USD over 3 years, factor 0.40211480",
  "Capital 45000 USD over 5 years, factor 0.26379748",
  "Capital 18000 USD over 5 years, factor 0.13147378"],
 "Heater tuning: 18000 of capital, a 5 year life, 0.26379748. The 3 year life and 45000 of capital belong to trap repair, and 0.13147378 to the two 15 year measures.")

q(0, "What annual cost does SECTION 18 print for Vapour recovery on the storage tanks?",
 "14000 USD a year",
 ["21000 USD a year",
  "105000 USD a year",
  "0 USD a year"],
 "The running cost column: 14000 on the vapour row, 21000 on solar, 105000 on flare recovery and 0 on the three that pay for themselves.")

q(3, "Which of these abatementCost calls returns costPerTonne none without refusing?",
 "An abatement of 0 typed",
 ["The abatement left blank",
  "An abatement of -500 t a year",
  "The capital cost left blank"],
 "A typed zero is accepted, with nothing to divide by and the flag false. A blank abatement, a negative one and a blank capital each draw a refusal.")

q(2, "The 9400 t curve prints a residual to target of 0.000 t. Why does the course read no target met from it?",
 "Its meetsTarget is none: the claim exceeds what the flare emits.",
 ["Its residual is recomputed by an oracle and graded as a miss.",
  "Its target is 30 percent of the curve's total, 18660.000 t.",
  "Its residual is computed here by the digest for contrast."],
 "That row adds up tonnes that do not exist, and the engine withholds the verdict. The residual is an engine output that no oracle recomputes and nothing grades.")

q(1, "What does SECTION 18 print as the Heat integration project's cost per tonne at a rate of 0 (straight line)?",
 "-66.6667 USD a tonne",
 ["-14.2492, at 0.1",
  "-120.5882, capital 0 typed",
  "688.2353 USD, one year"],
 "Straight line: -66.6667. At 0.1 it is -14.2492; with no capital -120.5882; and 688.2353 is the one-year route, shown for contrast.")

q(0, "Which of these does SECTION 25 list as a rule in force for the path?",
 "A measure with no start year is named.",
 ["A measure with no start year starts in the baseline year.",
  "A baseline of zero is accepted from an inventory that computed nothing.",
  "A year whose measures abate more than the baseline is drawn at zero."],
 "The rules table pairs the non-positive baseline refusal with naming the unscheduled measure, and adds the over-abatement refusal from MD45-1. SECTION 22 prints the unscheduled measure left off the path.")

q(3, "Name the curve's costliest step and the year it joins the path.",
 "Flare gas recovery, 2030",
 ["Flare gas recovery, 2031",
  "Vapour recovery on the storage tanks, 2031",
  "Solar for purchased power, 2028"],
 "Ranked cheapest first, the sixth step is flare recovery at 78.1002 USD a tonne, and its start-year input is 2030. Vapour recovery starts 2031 and Solar 2028.")

q(2, "Which year's target does the Agbor path print as 51291.681 t?",
 "2028",
 ["2027",
  "2029",
  "2030"],
 "The falling line reads 53695.978 in 2027, 51291.681 in 2028, 48887.383 in 2029 and 46483.086 in 2030.")

q(1, "What does energyIntensity return when the throughput is left blank?",
 "A refusal: a throughput is required.",
 ["complete false, at 629.8387 MJ a tonne.",
  "An intensity of 0.000 with versus peer none.",
  "The total GJ, with the intensity none."],
 "Without the divisor the engine refuses. The 629.8387 figure comes from a blank stream with the throughput present.")

q(0, "What share of Agbor's 877000.000 GJ does Imported steam carry?",
 "0.046750",
 ["0.109464",
  "0.843786",
  "1.040085"],
 "Imported steam's 41000.000 GJ is 0.046750 of the total. The other shares are purchased power and fuel gas, and 1.040085 is a ratio to the peer.")

q(3, "707.2581 MJ a tonne: which arithmetic does SECTION 24 show for it?",
 "Total GJ x 1000 over the throughput in tonnes",
 ["Total GJ over the peer intensity of 680",
  "Fuel gas GJ x 1000 over the throughput",
  "Total GJ x 1000 over 781000.000 GJ"],
 "877000.000 x 1000 / 1240000 = 707.2581, marked computed here and equal to the engine. Dividing by the peer gives the ratio 1.040085, a different output.")

q(2, "The Heat integration project: which figure is its net annual cost in SECTION 18?",
 "-48447.11 USD",
 ["361552.89 USD",
  "-127251.65 USD",
  "484221.51 USD"],
 "Heat integration: annualised capital 361552.89, savings 410000, net -48447.11. -127251.65 is heater tuning and 484221.51 is flare recovery.")

emit(Q, '/root/wt-et-carbon-nextgen/tools/course-banks/carbon/advanced/cefa_exam.json', expect_n=42)
finish()
