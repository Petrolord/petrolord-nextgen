import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# SC3 Professional m02, Demand over the Lead Time.
# Every figure and every engine message is quoted from digest.txt, where the
# engine returned it on the Ekene fixture, a golden input or a stated probe,
# and every key was re-run through the vendored engine (materials_engine.mjs)
# by the bank writer's witness. No capstone name, input or value appears.

q(1, "The choke bean set CHK-BEAN on the Ekene register uses 3.3333 sets a month with a lead time of 2.5 months under continuous review. What demand over the protection period does the engine return?",
 "8.333250 sets, the demand a month times 2.5",
 ["3.3333 sets, one month of demand",
  "13.316294 sets, the demand the reorder point must cover at a cycle service level of 0.95",
  "11.666550 sets, the demand over 3.500000 months"],
 "Under continuous review the protection period is the lead time alone, 2.5 months, and the demand over it is the demand a period times that period: 8.333250. 13.316294 is the reorder point, which adds the safety stock to that mean. 11.666550 is the demand over 3.500000 months, which needs a review period of 1.")

q(0, "On CHK-BEAN the demand a month has a standard deviation of 1.6 and the lead time a standard deviation of 0.5 months. What sigma over the protection period does the engine return?",
 "3.029476",
 ["2.529822",
  "1.666650",
  "3.426036"],
 "The engine's rule is sigma = sqrt(P sd_d^2 + d^2 sd_L^2), and on the stated case it gives 3.029476. 2.529822 is what remains with the lead-time spread set to 0, and 1.666650 with the demand spread set to 0. 3.426036 is sigma when a review period of 1 month lengthens the protection period.")

q(0, "In a stated probe on CHK-BEAN, the lead-time standard deviation is set to 0 and nothing else moves. What reorder point does the engine return at the cycle service level of 0.95?",
 "12.494437, over a sigma of 2.529822",
 ["13.316294, with the lead-time spread adding nothing to sigma",
  "11.074645, over 1.666650",
  "8.333250, the mean alone"],
 "With the lead-time spread removed sigma falls to 2.529822, the safety stock to 4.161187 and the reorder point to 12.494437. 13.316294 is the stated case with both spreads, and 11.074645 over 1.666650 is the probe that removes the demand spread. The mean demand 8.333250 is the same in every row.")

q(2, "Another probe removes the demand spread on the choke bean set and keeps its lead-time spread of 0.5 months. What safety stock comes back?",
 "2.741395 sets",
 ["0.000000 sets",
  "4.161187 sets",
  "4.983044 sets"],
 "With the demand spread at 0, sigma is 1.666650, the demand a month times the lead-time spread, and the safety stock at k 1.644854 is 2.741395. Demand is certain only when both spreads are 0. 4.161187 is the other probe, and 4.983044 the stated case with both spreads.")

q(1, "How does the engine combine the two parts of sigma on CHK-BEAN, 2.529822 from the demand spread and 1.666650 from the lead-time spread?",
 "Their squares add: 2.529822 squared plus 1.666650 squared is 3.029476 squared",
 ["They add as they stand, so sigma is their plain sum",
  "It keeps the larger part, 2.529822, and drops the smaller one as a rounding difference",
  "It multiplies them, since both spreads act over the same lead time"],
 "The two sources are taken as independent, so their variances add and sigma is the square root of the sum: 2.529822 squared plus 1.666650 squared is 3.029476 squared. Standard deviations themselves do not add, and the engine keeps both parts in every call.")

q(3, "A golden input states a steady demand of 20 a period with no spread and a lead time of 5 periods with a standard deviation of 1.5. What sigma does the engine return?",
 "30.000000, the demand times the lead-time spread",
 ["0.000000, as demand carries no spread",
  "100, the demand over the lead time, taken whole as the spread of that demand",
  "130, the reorder point the engine reports for this case under its stated rounding"],
 "With the demand spread at 0 only the second term of the rule is left, d^2 sd_L^2, so sigma is the demand times the lead-time spread: 30.000000. A wandering lead time lets the mean demand run on for longer, so it sets a sigma of its own. 100 is the mean demand over the lead time and 130 the reorder point in the engine's reason.")

q(0, "A planner types the demand a week beside a lead time stated in days. What does the engine do with the two periods?",
 "It converts nothing: every input is read in the one period the user chose",
 ["It converts the lead time to weeks, taking a week as a stated number of days",
  "It refuses the call, naming the lead time as a period that does not match",
  "It converts the demand to days using the days a year of the case"],
 "The demand, its spread, the lead time, its spread and the review period are all in the one period the user chooses; the engine does not convert. It has no field that states a period, so it cannot see a mismatch and it refuses nothing on that account. The period belongs in the written policy.")

q(2, "Under periodic review the protection period is the review period plus the lead time. Where does the engine apply the stated lead-time spread?",
 "To the lead time only; the review period is fixed",
 ["To the whole protection period, review period included, as one spread",
  "To the review period only, since the count is what varies from week to week",
  "Nowhere under periodic review"],
 "The lead-time spread enters on the lead time only; the review period is fixed. So a review period adds demand spread to sigma through P and leaves the lead-time term d^2 sd_L^2 as it was: on CHK-BEAN with a review period of 1, sigma rises from 3.029476 to 3.426036.")

q(3, "Someone types -1 into the demand spread of the choke bean case by mistake. How does the calculation respond?",
 "A refusal: demandSd must be a finite number at or above 0; got -1",
 ["A sigma of 1.666650, treating the negative spread as no demand spread at all",
  "A sigma computed on the magnitude 1, since the square of -1 is the same as that of 1",
  "A refusal naming leadTimeSd, which must be stated whenever demandSd is below 0"],
 "A standard deviation below zero means nothing, and the engine refuses it by name with the message in the key. It does not repair a stated input by dropping its sign or by setting it to 0, and the field it names is the one that was wrong.")

q(1, "Both the lead time and the review period of the choke bean case are typed as 0. Which message stops the call?",
 "leadTime and reviewPeriod add to 0; the protection period must be above 0",
 ["A reorder point of 0.000000, since no demand arrives over a protection period of 0",
  "leadTime must be a finite number above 0; got 0",
  "A safety stock of 4.983044 over a demand of 0.000000"],
 "With no lead time and no review period there is nothing to protect, and the engine refuses the policy by name with the message in the key. A reorder point of zero is never returned for this case. The message names leadTime as its field and states the condition on the sum of the two periods.")

q(0, "The reorder point 13.316294 sits well above the safety stock 4.983044 on the choke beans. What makes up the difference?",
 "It is the demand over the protection period, 8.333250, plus the safety stock",
 ["It is the safety stock alone, carried to the next whole set",
  "It is the safety stock times the protection period of 2.5 months",
  "It is the demand a month, 3.3333, plus three safety stocks"],
 "The engine's rule is level = d P + k sigma: the reorder point is the demand over the protection period plus the safety stock, 8.333250 plus 4.983044. The safety stock is k times sigma, and this course names the safety stock and the reorder point apart.")

q(2, "Tungsten carbide choke beans come in whole sets and the case rounds up to a multiple of 1. Which figure is held in place of 13.316294?",
 "14.000000 sets",
 ["13.000000 sets",
  "13.316294 sets",
  "15.000000 sets"],
 "The engine's reason ends: gives the reorder point s 13.316294, held as 14 (up to a multiple of 1). The stated rule rounds up, so the held level is 14.000000. Rounding to the nearest set is a different stated rule, and the engine applies the stated rule to the level it reports.")

q(3, "What rule does the engine's basis state for sigma, the standard deviation of demand over the protection period?",
 "sigma = sqrt(P sd_d^2 + d^2 sd_L^2) with P = leadTime + reviewPeriod",
 ["sigma = sd_d x P + d x sd_L, with the protection period taken as the lead time",
  "sigma = sqrt(sd_d^2 + sd_L^2), one variance from demand and one from the lead time",
  "sigma = sd_d x sqrt(P), with the lead-time spread left to the safety factor k"],
 "The basis reads sigma = sqrt(P sd_d^2 + d^2 sd_L^2) with P = leadTime + reviewPeriod. The demand variance grows with P, the lead-time variance is scaled by the demand squared, and the two are added before the square root. Adding the spreads plainly or dropping the lead-time term gives a different figure.")

q(1, "The fixture's note on the CHK-BEAN case is quoted below. In what period are its demand, lead time and spreads stated?\n\n> periods are months; lead time 2.5 months with a standard deviation of 0.5 months",
 "Months, for the demand, its spread, the lead time and its spread alike",
 ["Weeks, the period the lecture 11 checks use for the same rule",
  "Days for the lead time and months for the demand",
  "Years, since the register states usage a year"],
 "The fixture's note says the periods are months, and the engine reads every input in that one period. The lecture 11 checks are worked in weeks, and the register's annual usage column is a year, but neither sets the period of this case.")

q(2, "An extra key named zFactor is slipped into the choke bean call to force the safety factor. How is it handled?",
 "A refusal naming zFactor as a key it does not accept, before any input is read",
 ["The reorder point as usual, with zFactor read as the safety factor k in place of the one from the level",
  "The reorder point as usual, with the unknown key zFactor silently dropped from the call",
  "A refusal naming serviceLevel, which zFactor would replace"],
 "Every call refuses an input key the function does not read, naming the key and the full list of accepted keys: zFactor is not an accepted key; the accepted keys at the top level are demandMean, demandSd, leadTime, leadTimeSd, reviewPeriod, serviceMeasure, serviceLevel, orderQuantity, safetyFactorRounding, minimumSafetyFactor, rounding. A misspelt or extra key is never dropped silently.")

emit(Q, '/root/cat-wip-materials/banks/sc3i_m02.json', expect_n=15)
finish()
