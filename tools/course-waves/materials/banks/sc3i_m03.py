import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# SC3 Professional m03, The Cycle Service Level.
# Every figure and every engine message is quoted from digest.txt, where the
# engine returned it on the Ekene fixture, a golden input or a stated probe,
# and every key was re-run through the vendored engine (materials_engine.mjs)
# by the bank writer's witness. No capstone name, input or value appears.

q(2, "A stores policy targets a cycle service level. Which event is that target a probability of?",
 "The probability of no stockout in a replenishment cycle",
 ["The fraction of demand met from stock over a year",
  "The share of items in the register that are never short",
  "The expected units short a cycle, divided by the order quantity"],
 "The cycle service level is the probability of no stockout in a replenishment cycle, and the engine's own words for the measure are 'cycle-service' (probability of no stockout in a replenishment cycle). The fraction of demand met from stock is the fill rate, the second measure, which is one less the units short a cycle over the order quantity.")

q(0, "Which safety factor k turns the choke bean target of 0.95, read as a cycle service level, into stock?",
 "1.644854, the inverse standard normal at 0.95",
 ["1.026327, the factor the same item needs at a fill rate of 0.98",
  "1.64, the factor as a printed table reads it",
  "1.959964"],
 "The engine's reason reads: a cycle service level of 0.95 gives k = Phi^-1(0.95) = 1.644854. The case states the safety factor reading as none, so no table reading applies; 1.64 would need the reading to two decimals. 1.026327 answers a fill rate of 0.98, a different target, and 1.959964 is the factor at 0.975.")

q(3, "A stated probe lifts the choke bean target to 0.99, changing nothing else. How much safety stock is that?",
 "7.047614 sets",
 ["2.326348 sets",
  "15.380864 sets",
  "16.000000 sets"],
 "At 0.99, k is 2.326348, and the safety stock is k times sigma 3.029476: 7.047614. The reorder point adds the demand over the protection period, 15.380864, and the stated rounding up to a whole set holds it as 16.000000. The factor k itself is no quantity of stock.")

q(1, "Rounding the choke bean reorder point 13.316294 up to 14.000000 changes the protection it gives. What achieved figure is reported?",
 "0.969295, above the target, since rounding up raises the service",
 ["0.95 exactly, the stated target, whatever level the rounding rule holds",
  "0.983436, the achieved service of the Poisson PSV kits",
  "0.886929, the cycle service of the held fill-rate level"],
 "The engine reports the service a held level achieves beside the target: at 0.95 the held level 14.000000 achieves 0.969295. 0.983436 belongs to the PSV kits at level 5, and 0.886929 is the cycle service at the level CHK-BEAN holds for a fill rate of 0.98.")

q(2, "A stated probe sets CHK-BEAN's cycle service level to 0.8. What reorder point is held, and what cycle service does it achieve?",
 "Held as 11.000000, achieving 0.810643",
 ["Held as 10.882921, achieving 0.8 exactly with no rounding",
  "Held as 13.000000, achieving 0.938274 over the stated target",
  "Held as 11.000000, achieving 0.8 exactly"],
 "At 0.8 the reorder point is 10.882921, held as 11.000000 under the stated rule of rounding up to a whole set, and the service at 11 is 0.810643. The target 0.8 is met with room to spare, and 13.000000 at 0.938274 is the row for a level of 0.9.")

q(0, "A planner asks for a cycle service level of 1 on the choke beans, meaning no stockout ever. What happens?",
 "A refusal on serviceLevel, a probability strictly inside 0 to 1",
 ["A reorder point at the largest level a normal table prints",
  "A reorder point of 16.000000, the held level at 0.99",
  "A refusal naming serviceMeasure, which cannot promise no stockout"],
 "A cycle service level is a probability strictly between 0 and 1. Normal demand has no ceiling, so no finite reorder point meets a level of 1, and the engine refuses it by name, in its own words: serviceLevel must be a number strictly between 0 and 1; got 1. It picks no level of its own.")

q(3, "For a cycle service target, what algorithm supplies the inverse normal behind k?",
 "An exact inverse normal, Phi^-1 by Wichura AS241",
 ["The normal curve read from a two-decimal table built into the engine",
  "A Monte Carlo draw of the normal curve on a stated seed",
  "A bisection on the unit normal loss G(k), the method for a fill rate"],
 "The basis reads: Phi^-1 by Wichura AS241; Phi through the regularised incomplete gamma (engines/hse/safetyStats.js); the fill-rate k by bisection to the last binary digit. The engine keeps no table of its own, draws no sample here, and keeps the bisection for the fill rate.")

q(1, "The start \"Lead-time spread alone\" in the stock calculator reads its safety factor from a table to whole numbers at a cycle service level of 0.9. How much safety stock results?",
 "30.000000, with k read as 1",
 ["130, the level held at k read as 1",
  "30.000000, with the exact k of 1.281552",
  "0.000000, with k read as 0"],
 "The reason reads: a cycle service level of 0.9 gives k = Phi^-1(0.9) = 1.281552, read as 1; safety stock 30 over a demand of 100 with sigma 30. Read to whole numbers, 1.281552 becomes 1, so the safety stock equals sigma, 30.000000. 130 is the level held, and a factor of 0 would need a reading that rounds down.")

q(2, "Caplice, lecture 11 slide 24, prints a safety stock at a cycle service level of 0.95 on the weekly data. With k read from a table to two decimals and the level held to the nearest unit, what level does the engine hold?",
 "923.000000, the printed 423 above the demand of 500.000000",
 ["830.000000, the level the table reading holds at 0.90",
  "839.179604, the reorder point of the fill-rate rule at 0.95",
  "923.000000, the exact k giving a safety stock of 424.518354"],
 "Read to two decimals, k is 1.64, and the level held to the nearest unit is 923.000000. Less the demand over the two-week lead time, 500.000000, that is the printed 423. The exact k gives a safety stock of 424.518354, which misses the print. 839.179604 belongs to the fill-rate column of the same slide, and 830.000000 to the 0.90 row.")

q(0, "At 0.99 the cycle service column of Caplice, lecture 11 slide 24, prints 601. Worked with the exact factor and no rounding, how much safety stock comes out?",
 "A safety stock of 600.404410, which misses the print by less than a unit",
 ["A safety stock of 601.000000, which matches the print",
  "A safety stock of 512.349286, the fill-rate figure at 0.99",
  "A safety stock of 1101.000000, the level the table reading holds"],
 "With the exact k the engine's safety stock at 0.99 is 600.404410. The table reading, k read as 2.33 and the level held as 1101.000000, reproduces the printed 601. 512.349286 is the fill-rate figure at 0.99, and 1101.000000 is a held level, of which the safety stock is only the part above the mean.")

q(3, "Caplice, lecture 11 slides 18 to 24, state a forecast error of 1,316 units a year. What weekly standard deviation do the golden inputs read it as?",
 "182.496365, the error over the square root of 52",
 ["1,316 unchanged, since the engine converts the year to weeks itself",
  "258.088834, the sigma over the two-week lead time",
  "250.000000, the weekly demand"],
 "The golden inputs read the slides in weeks: a demand of 250.000000 a week with a standard deviation of 182.496365, the RMSE over the square root of 52. The engine converts no period, so the scaling happens before the figure is typed. 258.088834 is sigma over the two weeks, which the engine computes from it.")

q(1, "Seven decimals are requested for the safety-factor table reading on the choke beans. Which message comes back?",
 "safetyFactorRounding.decimals must be a whole number from 0 to 6; got 7",
 ["The safety factor 1.644854 read to 7 decimals and used as it stands",
  "safetyFactorRounding must be { rule: 'none' } or { rule: 'nearest', decimals } (a table read to that many decimals)",
  "A reorder point of 13.316294, with the reading capped silently at 6 decimals"],
 "The engine reads a factor to at most 6 decimals, its cap MAX_DECIMALS, and refuses 7 by name on safetyFactorRounding.decimals with the message in the key. It caps nothing silently. The message about { rule: 'none' } answers a reading that is missing or malformed.")

q(3, "CHK-BEAN is stated with the safety factor reading { rule: 'none' } and decimals 2 beside it. What does the engine return?",
 "safetyFactorRounding.decimals must be left out when the rule is 'none'",
 ["k read as 1.64, since the decimals override the rule",
  "The exact k of 1.644854, with the decimals ignored",
  "safetyFactorRounding.decimals must be a whole number from 0 to 6; got 2"],
 "A rule of none reads no table, so a decimals figure beside it is a contradiction, and the engine refuses it with the message in the key. It neither follows the decimals nor drops them. The range message answers decimals outside 0 to 6, and 2 lies inside it.")

q(0, "The service measure control is left blank on the choke bean case. Quote the engine's response.",
 "serviceMeasure must be 'cycle-service' (probability of no stockout in a replenishment cycle) or 'fill-rate' (fraction of demand met from stock)",
 ["A reorder point at the cycle service level of 0.95, the measure the engine takes when a case states a level alone",
  "serviceLevel must be a number strictly between 0 and 1; got 0.95",
  "orderQuantity is required for a fill rate (units short are measured against the quantity each cycle brings)"],
 "A service level in this course always names its measure, and the engine refuses a call that does not, naming the two measures it knows. It supplies no measure of its own. The serviceLevel message answers a level outside 0 to 1, and the orderQuantity message a fill rate stated with no order quantity.")

q(2, "On the lecture 11 data, why does the course state which safety-factor reading a published safety stock uses?",
 "The table reading reproduces all four printed figures and the exact k does not",
 ["The exact k is a slip that the table reading repairs in each of the four rows",
  "The table reading is the engine's fixed practice for every published case it checks",
  "The two readings agree at every level, so stating one is a matter of style"],
 "The table reading reproduces all four printed figures (601, 423, 330 and 217); the exact safety factor does not, which is why the course states the rule a figure was read with. Neither is a slip: each answers a differently stated question. The reading is a stated input, safetyFactorRounding.")

emit(Q, '/root/cat-wip-materials/banks/sc3i_m03.json', expect_n=15)
finish()
