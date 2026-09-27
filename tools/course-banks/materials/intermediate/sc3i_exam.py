import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# SC3 Professional final exam: SERVICE LEVELS, SAFETY STOCK AND DISCOUNTS.
# 42 questions across the six Professional modules; at least six need two
# modules at once. Every figure and every engine message is quoted from
# digest.txt, where the engine returned it on the Ekene fixture, a golden
# input or a stated probe, and every key was re-run through the vendored
# engine (materials_engine.mjs) by the bank writer's witness. Both printed
# Caplice slips are keyed as slips. No capstone name, input or value appears.

# ---- quantity discounts (m01)
q(1, "Which three stated inputs make up the bound that every fill-rate reason sets on G(k)?",
 "The order quantity, one less the fill rate, and sigma: Q x (1 - p) / sigma",
 ["The safety factor and sigma alone, since G is read off k",
  "The cycle service level and the demand over the protection period",
  "The order quantity and the lead time only"],
 "Each fill-rate reason prints the target in the same form: 12 x (1 - 0.98) / 3.029476 = 0.079222 on the choke beans and 228 x (1 - 0.95) / 258.088834 = 0.044171 on the slide 24 data. The safety factor is what the target sets, found by bisection, and the cycle service level is the other measure.")
q(1, "At the incremental order of 1789.000000 on the lecture 8 schedule, what effective unit price does the engine report?",
 "44.192286, between the band prices of 45 and 40",
 ["40, the price of the band the order lands in, applied to every unit",
  "45, the price of band 1",
  "50, the band 0 price paid on the first units, applied to the whole lot"],
 "Under an incremental schedule each unit is priced by its own band, so the lot cost is F2 plus 40 times Q, with F2 7500.000000. Spread over 1789 units that is an effective unit price of 44.192286, which the slides print as 44.19. A single band price for the whole lot is the all-units reading.")

q(2, "With no discount at all, slide 9 of lecture 8 costs one location: 2000 a year, 500 an order, a holding rate of 0.25 on a price of 50. What yearly ordering and holding costs come back at the EOQ?",
 "2500.000000 each, a relevant cost of 5000.000000 at an EOQ of 400.000000",
 ["2500.000000 of ordering and 5000.000000 of holding, a total of 105000.000000",
  "5000.000000 each, at an EOQ of 400.000000",
  "1000.000000 each, at an EOQ of 1000.000000"],
 "The slide prints an order size of 400, an order cost of 2,500, a holding cost of 2,500 and a total of 5,000; the engine returns an EOQ of 400.000000, ordering cost 2500.000000, holding cost 2500.000000 and relevant cost 5000.000000. At the EOQ the two costs are equal. 105000.000000 adds the purchase cost at 50 a unit.")

q(3, "The lecture 13 table prints 99.1% as the cumulative probability at level 3 on a mean of 0.8. What does the engine print there?",
 "0.990920",
 ["0.998589",
  "0.952577",
  "0.038343"],
 "At level 3 the cumulative figure is 0.990920, shown as 99.1% by the slide. The other figures are the level 4 cumulative 0.998589, the level 2 cumulative 0.952577 and the level 3 probability 0.038343.")
q(0, "A golden input breaks a tie by dropping the second band's price to three quarters of band 0. What does the engine order now?",
 "The break of 200, costing 175 a year",
 ["100 in band 0, at a total cost of 200 a year, as the tie reading still takes the smaller lot",
  "200 in band 1 at 200 a year, the tie unchanged",
  "175 units, the cost read as a quantity"],
 "The reason reads: order 200 at a total cost of 175 a year (band 1), the lowest of 2 candidates. With the price cut the break costs less than band 0's EOQ of 100 at 200 a year, so there is no tie left for the smaller-quantity reading to settle.")

q(0, "A quantity discount call states a holding rate of 0. What does the engine return, in its own words?",
 "A refusal on holdingRate, which must be above 0",
 ["breaks must be an array of at least 1 price band { minQuantity, unitPrice }",
  "An order at the largest break, since holding costs nothing, with its total cost",
  "rounding gives an order quantity of 0 from the band 0 EOQ 1.414214; state a smaller multiple or another rule"],
 "A holding rate of 0 would make every lot free to hold, and the engine refuses it by name: holdingRate must be a finite number above 0; got 0. The breaks message answers an empty schedule, and the rounding message a rule that orders nothing.")

q(3, "A price band is typed with the key price where the engine expects unitPrice. What comes back?",
 "breaks[0].price is not an accepted key; the accepted keys of breaks[0] are minQuantity, unitPrice",
 ["breaks[0].unitPrice must be a finite number above 0; got undefined",
  "The order as usual, the misspelt key read as the price",
  "The order as usual, the band priced at 0"],
 "An input key a function does not read is refused at whatever level it sits, a price band included, with the path to the key and the full list of accepted keys. A misspelt key is refused; it is never dropped silently. The unknown key is refused before any missing input is read.")

q(3, "How many price bands will one quantity discount call accept, and what does a schedule of twenty-one bands return?",
 "At most 20; the engine replies: breaks has 21 entries; the cap is 20",
 ["Any number, since every band a supplier offers must be costed",
  "At most 10, the cap on slow-moving bands, applied to prices too",
  "At most 20, with the bands past the cap dropped from the call"],
 "MAX_BREAKS caps one quantity discount call at 20 price bands, and the stated probe with twenty-one bands is refused: breaks has 21 entries; the cap is 20. The cap of 10 belongs to the slow-moving bands. A cap refuses; it drops nothing silently.")

q(2, "Under all-units on the casing, band 1's EOQ is 77.459667. Under incremental, the same band's EOQ is 105.559733. Why do they differ?",
 "Incremental adds the band's fixed cost 3000.000000 to the order cost",
 ["Incremental prices band 1 at 1450, the band 0 price",
  "All-units rounds the EOQ to the nearest joint first",
  "Incremental uses a holding rate on the band 0 price, so holding costs more and the lot is larger"],
 "The incremental basis gives EOQi = sqrt(2 D (A + Fi) / (r vi)): band 1 carries F1 3000.000000 on top of the order cost of 3500, at its own price of 1400, which lifts its EOQ to 105.559733. All-units band 1 uses the order cost alone at 1400 and gets 77.459667. Rounding acts after the EOQ.")

# ---- demand over the lead time (m02)
q(2, "Which of the choke bean set's two sources of variation contributes more to its sigma, according to the stated probes?",
 "The demand spread: 2.529822 alone against 1.666650 from the lead-time spread",
 ["The lead-time spread: 2.529822 alone against 1.666650 from demand",
  "Neither: each source contributes the full sigma of 3.029476 when taken on its own",
  "The lead-time spread, since the lead time of 2.5 months is longer than a month"],
 "With the lead-time spread set to 0, sigma is 2.529822, all of it from demand; with the demand spread set to 0, sigma is 1.666650, all of it from the lead time. The two combine as squares into 3.029476. For this item demand variation is the larger part.")

q(0, "Steady use of 20 each period meets a 5-period lead time whose spread is the only uncertainty. Which demand over the lead time and held reorder point appear in the reason?",
 "A demand of 100 and a reorder point held as 130",
 ["A demand of 20 and a reorder point of 50",
  "A demand of 100 and a reorder point held as 100, with no safety stock",
  "A demand of 30 and a reorder point held as 130"],
 "The reason reads: safety stock 30 over a demand of 100 with sigma 30 gives the reorder point s 130, held as 130 (up to a multiple of 5). The lead-time spread sets a sigma of 30.000000 even with steady demand, so the safety stock is above 0. 30 is the safety stock, and 100 the demand over the five periods.")

q(2, "A copy of the choke bean call removes the rounding rule altogether. What message comes back?",
 "rounding must be a stated rounding rule { rule: 'none' } or { rule: 'up' | 'down' | 'nearest', multiple }",
 ["A reorder point held as 13.316294, the exact level, as a missing rule means no rounding",
  "A reorder point held as 14.000000, the rule up to a multiple of 1 taken from the fixture",
  "safetyFactorRounding must be { rule: 'none' } or { rule: 'nearest', decimals } (a table read to that many decimals)"],
 "The rounding rule is a stated input with no default, and a call without one is refused by name. The stated probe on ss-ekene-choke-beans with rounding removed returns the message in the key. No rounding is a rule that must be stated as { rule: 'none' }. The safetyFactorRounding message is about the table reading of k.")

q(0, "The choke bean target moves from 0.9 to 0.975 as a cycle service level. What happens to k and to the held reorder point?",
 "k rises from 1.281552 to 1.959964, and the held level from 13.000000 to 15.000000",
 ["k rises from 1.281552 to 1.959964 and the held level stays at 14.000000",
  "k stays at 1.644854, and only the held level moves",
  "k falls, since a higher level needs less safety stock"],
 "The stated probes give k 1.281552 and a reorder point of 12.215679, held as 13.000000, at 0.9; and k 1.959964 and 14.270913, held as 15.000000, at 0.975. The factor is the inverse normal of the level, so it rises with the level, and so does the held level.")

q(2, "At a cycle service level of 0.9, CHK-BEAN's reorder point 12.215679 is held as 13.000000. What achieved cycle service does the engine report?",
 "0.938274",
 ["0.9",
  "0.810643",
  "0.969295"],
 "Rounding up raises the service, and the engine reports the service a held level achieves beside the target: at 0.9 the held level 13.000000 achieves 0.938274. 0.810643 is the achieved figure at 0.8 and 0.969295 at 0.95.")

q(0, "Slide 24 prints 330 for the 0.90 row of its cycle service column. Reading k as a two-decimal table and holding to the whole unit, which level is held?",
 "830.000000 on a factor of 1.28",
 ["1101.000000, with k read as 2.33",
  "717.000000, with k read as 0.84",
  "923.000000, with k read as 1.64"],
 "Read to two decimals, k is 1.28 and the level is held as 830.000000; less the demand of 500.000000, that is the printed 330. The exact safety stock is 330.754149. 717.000000 is the held level at 0.80, 923.000000 the one at 0.95 and 1101.000000 the one at 0.99.")

q(1, "Over the two-week lead time of the lecture 11 check, what demand and sigma does the engine compute?",
 "A demand of 500.000000 and a sigma of 258.088834",
 ["A demand of 250.000000 and a sigma of 182.496365, the weekly figures",
  "A demand of 13,000 and a sigma of 1,316, the annual figures",
  "A demand of 500.000000 and a sigma of 182.496365, the weekly spread unchanged"],
 "Over the two weeks the demand is 500.000000 with a sigma of 258.088834 (engine): twice the weekly demand, and the weekly spread grown with the square root of the period. The annual figures are the slides' statement, which the golden inputs scale to a week first.")

q(1, "A choke bean call states the safety factor reading as nearest with no decimals given. What does the engine return?",
 "The call is refused: the decimals must be a whole number from 0 to 6, and none was given",
 ["A reorder point with k read to 0 decimals, the smallest reading",
  "A reorder point with the exact k, since no decimals means no table",
  "safetyFactorRounding.decimals must be left out when the rule is 'none'"],
 "A table reading needs its number of decimals, and the stated probe on ss-ekene-choke-beans returns, in its own words: safetyFactorRounding.decimals must be a whole number from 0 to 6; got undefined. The engine fills in no reading of its own. The message about leaving decimals out answers the rule none with decimals beside it.")

# ---- fill rate (m04)
q(2, "On the slide 24 fill-rate column, what does the engine give at 0.90 against the printed 252?",
 "250.102945, with k 0.969058",
 ["252, as printed, with k read from a table",
  "330.754149, with k 1.281552",
  "147.444755, with k 0.571295"],
 "Solving for k by bisection at a fill rate of 0.90 gives 0.969058 and a safety stock of 250.102945, 1.897055 below the print, within the 2 units three rows agree to. 330.754149 is the exact cycle service figure at 0.90, and 147.444755 the fill-rate figure at 0.80.")

q(0, "How far does each printed fill-rate safety stock on slide 24 sit from the engine's figure?",
 "0.650714, 8.820396, 1.897055 and 0.555245, from 0.99 down to 0.80",
 ["Within 2 units in every row, so the column holds no slip at all",
  "8.820396 in every row, a constant offset from a different k table",
  "Exactly 0 in every row once k is read from a table to two decimals"],
 "The printed less the engine is 0.650714 at 0.99, 8.820396 at 0.95, 1.897055 at 0.90 and 0.555245 at 0.80. Three rows agree to within 2 units; the 0.95 row is a slip. No reading of k closes it, since the rule at 0.95 meets its target exactly at 339.179604.")

q(1, "A golden input puts the band 0 EOQ beyond the only break, so the schedule offers one candidate. What reason does the engine print?",
 "order 4600 at a total cost of 483717.83 a year (band 1), the lowest of 1 candidate",
 ["order 400 at a total cost of 105000 a year (band 0), the lowest of 1 candidate",
  "order 4600 at a total cost of 483717.83 a year (band 0), the lowest of 2 candidates",
  "band 0 gives no candidate, so the whole schedule is refused as offering no order at all"],
 "On qd-eoq-in-top-band the reason reads: order 4600 at a total cost of 483717.83 a year (band 1), the lowest of 1 candidate. Band 0's EOQ lies at or above the break, so band 0 offers nothing and band 1 offers the only candidate. The reason ordering 400 at 105000 is qd-single-band, a schedule with one band.")
q(0, "An order quantity of 0 goes into the fill-rate choke bean case. How is it answered?",
 "Refused by name: the order quantity must be above 0",
 ["A fill rate of 0.98 met at any k, as no units are brought",
  "orderQuantity is required for a fill rate (units short are measured against the quantity each cycle brings)",
  "A safety factor of 1.026327, since 0 is read as the fixture's 12"],
 "An order quantity must be above 0, and the engine refuses 0 by name: orderQuantity must be a finite number above 0; got 0. The message saying an order quantity is required answers one that is missing altogether. The engine never swaps in a figure of its own.")

# ---- periodic review (m05)
q(3, "Moving the choke bean set to monthly review adds a month to its protection period. Which part of sigma grows, and which stays?",
 "The demand term grows with P; the lead-time term d^2 sd_L^2 stays",
 ["The lead-time term grows, since the review period carries a spread of its own",
  "Both terms grow in proportion to the protection period",
  "Neither grows, since sigma is set by the lead time alone"],
 "The rule multiplies the demand variance by P = leadTime + reviewPeriod, so a longer P widens that term; the lead-time variance d^2 sd_L^2 carries no review period. On the choke beans sigma goes from 3.029476 to 3.426036.")

q(3, "On the lecture 12 check, the reason prints a loss target the slide rounds to 0.1733. What does the engine print?",
 "0.173279, from 2000 x (1 - 0.95) / 577.104177",
 ["0.044171, from 228 x (1 - 0.95) / 258.088834",
  "0.173279, from 2500 x (1 - 0.95) / 577.104177",
  "0.58, the safety factor as the table reads it"],
 "The reason reads: a fill rate of 0.95 needs G(k) at or below 2000 x (1 - 0.95) / 577.104177 = 0.173279. The order quantity is 2000, the demand over one review period; 2500 is the demand over the whole protection period. 0.044171 is the lecture 11 target at 0.95.")

q(1, "What does the lecture 12 case state as its protection period and its demand over it?",
 "10 weeks and 2500.000000",
 ["8 weeks and 2000, the review period alone",
  "2 weeks and 500.000000, the lead time only",
  "10 weeks and 2000"],
 "Eight weeks of review and two of lead time make 10 weeks, and at 250 a week that is 2500.000000. The figure 2000 covers the review period only, and 500.000000 the lead time only.")

q(3, "On the Caplice lecture 8 incremental schedule, band 0 prices every unit at 50 below 500. What candidate does band 0 offer, and at what yearly total?",
 "400.000000 at 105000.000000, its own EOQ inside the band",
 ["500.000000 at 103062.500000, the break of band 1",
  "No candidate, since band 1 is cheaper",
  "1032.795559, carried down from band 1"],
 "Band 0's EOQ of 400.000000 lies inside the band from 0 to below 500, so it is the band's candidate, costed at 105000.000000 a year. It loses to band 2's 1789.000000 at 98826.043879. 500.000000 at 103062.500000 answers the two-band all-units schedule of slide 12, and 1032.795559 is band 1's EOQ, which offers nothing.")
q(1, "On the PSV kits at a mean of 2.000000, the probabilities of exactly one kit and exactly two kits are equal. What figure does the engine print for each?",
 "0.270671",
 ["0.135335",
  "0.406006",
  "0.180447"],
 "The recursion p(x) = p(x - 1) m / x multiplies by 2 over 2 from level 1 to level 2, so both are 0.270671. 0.135335 is the chance of no demand, 0.406006 the cumulative to level 1, and 0.180447 the probability at level 3.")

q(3, "What expected units short beyond level 4 does the engine print for the PSV kits?",
 "0.075141",
 ["0.090224",
  "0.022488",
  "0.218018"],
 "The loss column reads 2.000000, 1.135335, 0.541341, 0.218018, 0.075141 and 0.022488 for levels 0 to 5, so L(4) is 0.075141. 0.090224 is the probability of exactly four kits, 0.022488 the loss at level 5 and 0.218018 the loss at level 3.")

q(1, "The Caplice lecture 13 table on a mean of 0.8: what does the engine give for no demand in a week, and what does the slide print?",
 "0.449329 against the printed 44.9%",
 ["0.359463 against the printed 35.9%",
  "0.449329 against the printed 45%",
  "0.808792 against the printed 80.9%"],
 "The probability at level 0 is 0.449329, which the slide prints as 44.9%. 0.359463 is level 1's probability, and 0.808792 the cumulative to level 1. Every level below 4 agrees with the slide at the precision it prints.")

q(1, "A Poisson call states a demand rate of 3 a period and a lead time of 170. What does the engine return?",
 "A refusal naming the largest lead time accepted, 166.666666, rounded down at the sixth decimal",
 ["A level on a mean above 500, computed as usual",
  "A refusal naming demandRate, which must be at most 3",
  "A refusal naming the largest lead time accepted, rounded to the nearest whole period"],
 "The engine's words: leadTime must be at most 166.666666 (rounded down at the sixth decimal so that it is accepted) so that the mean demand demandRate x leadTime is at most 500; above that the normal safetyStock serves; got 170. A largest accepted value is rounded toward the accepted side, so typing it back is accepted.")

q(0, "Typing 1.2 as the target of a slow-mover call: what message comes back?",
 "serviceLevel must be a number strictly between 0 and 1; got 1.2",
 ["A level at the cycle service level of 1, the largest accepted",
  "serviceMeasure must be 'cycle-service' (probability of no stockout over the protection period) or 'fill-rate' (fraction of demand met from stock)",
  "The level at which the cumulative probability reaches 1"],
 "A service level is a probability strictly between 0 and 1, in the Poisson view as in the normal one, and 1.2 is refused by name. The engine caps nothing silently, and no Poisson level reaches a cumulative probability of 1. The serviceMeasure message answers a missing or unknown measure.")

# ---- across two modules
q(0, "The choke bean set is the item for both service measures. Which target gives it the lower reorder point, a cycle service level of 0.95 or a fill rate of 0.98?",
 "The fill rate of 0.98: 11.442483 against 13.316294",
 ["The cycle service level of 0.95: 13.316294 against 11.442483",
  "Neither: both give 13.316294, as the same sigma of 3.029476 serves each",
  "The fill rate, but only after both levels are held as 14.000000"],
 "The fill-rate reorder point is 11.442483 with k 1.026327, and the cycle service one 13.316294 with k 1.644854. A fill rate measures units short against the 12 each order brings, so its higher stated number still asks for less stock.")

q(2, "On the lecture 11 weekly data at 0.95, the cycle service measure with exact k and the fill-rate measure give different safety stocks. Which pair does the engine return?",
 "424.518354 for cycle service and 339.179604 for the fill rate",
 ["339.179604 for cycle service and 424.518354 for the fill rate",
  "423.000000 for both, since the level is the same",
  "424.518354 for cycle service and 348 for the fill rate"],
 "With the exact k the cycle service safety stock at 0.95 is 424.518354; the fill-rate rule at 0.95 with an order quantity of 228 gives 339.179604. 348 is the slip the slide prints for the fill rate, and 423 is the cycle service figure under the table reading.")

q(2, "On certain demand, a demand of 10 a period with no spread over a lead time of 3, how do the two service measures fare?",
 "A cycle service target is accepted; a fill rate is refused",
 ["Both are refused, since certain demand leaves nothing to protect",
  "Both are accepted, each with a safety stock of 0.000000",
  "A fill rate is accepted and a cycle service target is refused"],
 "Sigma is 0.000000 here, so a cycle service target is met by the reorder point 30.000000 with no safety stock. The fill-rate search has nothing to solve, and the engine says so by name, naming demandSd as its field.")

q(1, "The course meets two printed slips, one on lecture 11 slide 24 and one on lecture 13 slide 12. What does it do with both?",
 "Keeps each print beside the rule's own figure, and keeps the rule",
 ["Replaces each print with the engine's figure and drops the print",
  "Tunes the engine until it reproduces 348 and 0.009",
  "Treats both as rounding noise within 2 units"],
 "The course keeps each printed figure beside the rule's own figure and teaches the difference, and it does not change the rule to match a print: 339.179604 beside 348, and 0.001619 beside 0.009. The 0.95 row misses by 8.820396 and the level 4 loss is not the recursion's figure at any precision the slide uses.")

q(2, "What mean does each engine view take over the protection period when a review period is stated, in the normal view and the Poisson view?",
 "Both take the demand a period times leadTime + reviewPeriod",
 ["The normal view adds the review period; the Poisson view uses the lead time alone",
  "The Poisson view adds the review period; the normal view uses the lead time alone",
  "Neither adds the review period, which only sets how often stock is counted"],
 "The normal rule has P = leadTime + reviewPeriod and a level of d P + k sigma; the Poisson rule reads X ~ Poisson(demandRate x (leadTime + reviewPeriod)). So a review period lengthens the protection period in both: on the Poisson case with a review period of 1 the mean is 4.5, and on the choke beans the demand over P becomes 11.666550.")

q(3, "A golden Poisson call at 2 a period, with a review period stated, asks for a lead time of 240. Which ceiling does the refusal quote?",
 "229.5, as the review period counts toward the mean",
 ["250, the lead time that alone gives a mean of 500",
  "240, the stated lead time, since the review period is fixed",
  "229.5, with the review period left out of the mean"],
 "The refusal quotes 229.5 and gives its reason: so that the mean demand demandRate x (leadTime + reviewPeriod) is at most 500. The stated review period counts toward the mean, which is why the ceiling is lower than the lead time alone would allow.")

q(0, "Which calculator panel of this course carries the Professional practicals, and which engine functions does it call?",
 "The stock calculator: quantityDiscount, safetyStock, poissonStock",
 ["The register calculator: criticality, abcClassification, eoq, slowMoving",
  "The spares calculator: insuranceSpares, poissonStock, leadTimeRisk",
  "The Materials & Spares Planner alone, which needs a Suite seat"],
 "The stock calculator (materials-stock-calculator) is the Professional panel and calls quantityDiscount, safetyStock and poissonStock. It calls the same vendored engine as the Materials & Spares Planner, so every exercise can be done without a Suite seat. The register calculator is the Associate panel and the spares calculator the Expert one.")

q(3, "Where does every graded number in this course come from?",
 "A return value of the engine on inputs written down in advance",
 ["A figure printed in the Caplice lectures, checked against the engine",
  "The median of a seeded Monte Carlo run of the engine",
  "An average of the engine's figure and the printed one"],
 "Every graded number is a return value of the engine on fixed inputs, so the same inputs give the same number on any machine and there is exactly one right answer. No graded figure comes from the Monte Carlo, and a printed figure can carry a slip.")

q(1, "A call carries an unknown key and also leaves out a required input. Which does the engine refuse first?",
 "The unknown key, since keys are checked before any input is read",
 ["The missing input, since required inputs are checked first",
  "Both at once, in one message listing each problem",
  "Neither: the unknown key is dropped and the default input used"],
 "Every function checks its accepted keys before it reads an input, so a box with an unknown key and a missing required input is refused on the unknown key first. The engine holds no default input, and each refusal names one field.")

q(0, "In this course's vocabulary, what does the term safety stock name?",
 "k times sigma over the protection period",
 ["The whole reorder point, the level at which an order goes out",
  "The order-up-to level that periodic review tops up to",
  "Any stock held back just in case something fails"],
 "The vocabulary rule: safety stock is k times sigma over the protection period; the reorder point and the order-up-to level are named as such. On the choke beans the safety stock is 4.983044 and the reorder point 13.316294, two different figures.")

q(3, "A slow mover's Poisson level comes back as a whole number. What does the engine report as its safety stock?",
 "The level less the Poisson mean",
 ["The level itself, as every kit on the shelf is safety stock",
  "k times sigma, with sigma the square root of the mean",
  "The level less one, the kit in use"],
 "The PSV kits at level 5 on a mean of 2.000000 give a safety stock of 3.000000, the level less the mean. The Poisson view computes no k and no sigma; it reads the level off the table. On the mean of 0.05 at level 0 the safety stock is below zero.")

q(2, "A result comes back with a reason saying some demand goes short, or that a target was met only at a high level. Is that a refusal?",
 "No: a result returned with a reason is a result",
 ["Yes, since any shortage in a draw is refused by name",
  "Yes, whenever the reason it prints names a limit",
  "Only when the achieved service falls below the target"],
 "A refusal is an object with error and field, and the message starts with the field it refuses. A result returned with a reason (an item below a class minimum, a stock of spares at the search limit, a stockout in some draws) is a result. It is no refusal.")

emit(Q, '/root/cat-wip-materials/banks/sc3i_exam.json', expect_n=42)
finish()
