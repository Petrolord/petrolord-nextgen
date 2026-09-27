import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# SC3 Professional m04, The Fill Rate.
# Every figure and every engine message is quoted from digest.txt, where the
# engine returned it on the Ekene fixture, a golden input or a stated probe,
# and every key was re-run through the vendored engine (materials_engine.mjs)
# by the bank writer's witness. The lecture 11 slide 24 slip is keyed as a
# slip, with the rule's figure beside the print. No capstone name, input or
# value appears.

q(3, "Of the two service measures, the item fill rate is one. What does it express?",
 "The fraction of demand met from stock",
 ["The probability of no stockout in a replenishment cycle",
  "The share of orders that arrive within the stated lead time",
  "The fraction of cycles in which some demand is short"],
 "In the engine's own list of measures, 'fill-rate' is the fraction of demand met from stock; a chance of no stockout per cycle belongs to the other measure, the cycle service level. A fill rate counts units short against the order quantity each cycle brings, so a cycle short by a fraction of a unit barely moves it.")

q(1, "CHK-BEAN is stated at a fill rate of 0.98 with an order quantity of 12, every other input as in the fixture case. What safety factor k does the engine return?",
 "1.026327",
 ["1.644854",
  "2.326348",
  "0.841621"],
 "The reason reads: a fill rate of 0.98 needs G(k) at or below 12 x (1 - 0.98) / 3.029476 = 0.079222, so k = 1.026327. 1.644854 is the factor for a cycle service level of 0.95 on the same item, 2.326348 for a cycle service level of 0.99 and 0.841621 for one of 0.8.")

q(0, "For CHK-BEAN at a fill rate of 0.98, what target on the unit normal loss G(k) does the engine print in its reason?",
 "0.079222, from 12 x (1 - 0.98) / 3.029476",
 ["0.173279, the loss target of the lecture 12 periodic review",
  "0.98, the stated fill rate taken as the target itself",
  "0.044171, the target of the lecture 11 case at 0.95"],
 "A fill rate p with order quantity Q allows at most Q times one less p units short a cycle; divided by sigma, that is the target on G: 12 x (1 - 0.98) / 3.029476 = 0.079222. 0.173279 is the lecture 12 target, and 0.044171 the target for the lecture 11 data at a fill rate of 0.95 with an order quantity of 228.")

q(2, "Once 12.000000 sets are held for the 0.98 fill-rate target on the choke beans, which two achieved service figures are printed?",
 "A fill rate of 0.986135 and a cycle service of 0.886929",
 ["A fill rate of 0.98 and a cycle service of 0.98, the one stated target read on both measures",
  "A fill rate of 0.886929 and a cycle service of 0.986135",
  "A fill rate of 0.986135 and a cycle service of 0.969295"],
 "At the held level the engine reports an achieved fill rate of 0.986135 and an achieved cycle service of 0.886929. The same level meets the fill rate with room to spare and leaves more than one cycle in ten with some shortage, because most short cycles are short by a fraction of a set. 0.969295 is the cycle service of the level held for a cycle service level of 0.95.")

q(1, "How many sets short a cycle does the engine expect on the choke bean set once its 0.98 fill-rate level is held?",
 "0.166382 sets a cycle, out of the 12 each order brings",
 ["11.400000 sets, as on the lecture 11 case",
  "3.109233 sets, the safety stock at that level",
  "0.022488 sets"],
 "At the held level of 12.000000 the expected units short a cycle are 0.166382, which is how the fill rate reaches 0.986135 against the 12 sets each order brings. 3.109233 is the safety stock, and 0.022488 is the expected units short of the PSV kits at level 5.")

q(3, "The fill-rate choke bean case is loaded with its order quantity cleared. What message appears?",
 "orderQuantity is required for a fill rate (units short are measured against the quantity each cycle brings)",
 ["A safety factor of 1.026327, since the order quantity of 12 sits in the Ekene fixture already",
  "orderQuantity must be a finite number above 0; got undefined",
  "A reorder point computed at the cycle service level, the measure that needs no order quantity"],
 "A fill rate measures units short against the quantity each cycle brings, so the order quantity sits in the sum and the engine refuses its absence with the message in the key. It never switches measure on its own. The message about a finite number above 0 answers an order quantity stated as 0, and it prints got 0.")

q(0, "Ten units a period with no spread and three periods of lead time with no spread: a fill rate of 0.95 on an order of 10 is asked of this certain demand. What is the outcome?",
 "A refusal: demand over the protection period is certain, so a fill rate sets no safety factor",
 ["A reorder point of 30.000000 with a safety factor of 1.644854, as the cycle service level gives",
  "A safety factor of 0.000000, the smallest k that meets any fill-rate target on certain demand",
  "A safety stock of 0.000000 and a fill rate of 1"],
 "The engine's words: demandSd and leadTimeSd are both 0, so demand over the protection period is certain and a fill rate sets no safety factor. A fill rate protects against uncertainty, and with none there is nothing for k to solve. A cycle service target on the same certain demand is accepted and gives the reorder point 30.000000.")

q(2, "Caplice, lecture 11 slide 24, prints a safety stock of 348 at an item fill rate of 0.95 on the weekly data with an order quantity of 228. How does the course treat that figure?",
 "As a slip: the fill-rate rule gives 339.179604",
 ["As the rule's own figure, which the engine reaches with k read from a table to two decimals",
  "As proof the engine is off by 8.820396 and needs a new rule",
  "As a correct figure for a different order quantity"],
 "The fill-rate rule on the same inputs needs G(k) at or below 228 x (1 - 0.95) / 258.088834 = 0.044171, so k = 1.314197 and the safety stock is 339.179604, 8.820396 below the print. The other three rows agree to within 2 units. The course keeps the print beside the rule's figure and keeps the rule as it is.")

q(1, "At its own safety stock of 339.179604 on the slide 24 case at 0.95, what fill rate and units short does the engine report?",
 "An achieved fill rate of 0.950000, with 11.400000 units short a cycle",
 ["An achieved fill rate of 0.95 only after the stock is raised to the printed 348",
  "An achieved fill rate of 0.986135, as on the choke bean set",
  "An achieved fill rate of 0.99"],
 "At the engine's safety stock the achieved fill rate is 0.950000 and the expected units short a cycle are 11.400000: the rule meets its target exactly. Raising the stock to the printed 348 would overshoot it. 0.986135 is the choke bean set's achieved fill rate at 0.98, and 0.99 is the target of a different row of the column.")

q(3, "Caplice, lecture 11 slide 24, prints 513 for a fill rate of 0.99. What figure does the bisection give?",
 "512.349286, with k 1.985166 from the bisection on G(k)",
 ["513, as printed, with k read from a table to two decimals",
  "600.404410, with the cycle service k 2.326348",
  "601.000000, as printed for 0.99 on the slide"],
 "Solving for k by bisection gives 1.985166 and a safety stock of 512.349286, which agrees with the printed 513 to within a unit, as three rows of the column do. 600.404410 and 601 are the cycle service column at 0.99, a different measure on the same slide.")

q(2, "Which numerical method finds k when the target is a fill rate, as the basis records it?",
 "The fill-rate k by bisection to the last binary digit",
 ["The fill-rate k by Phi^-1 at the stated rate, as for a cycle service level",
  "The fill-rate k from a two-decimal table of G(k)",
  "The fill-rate k by a seeded Monte Carlo over normal draws"],
 "For a fill rate the basis records bisection to the last binary digit. G falls as k rises, so the engine takes the smallest k that meets the target. The inverse normal serves the cycle service level only.")

q(0, "What does the engine's rule give for the expected units short per cycle and the fill rate P2?",
 "sigma G(k), G(k) = phi(k) - k (1 - Phi(k)); P2 = 1 - sigma G(k) / Q",
 ["sigma (1 - Phi(k)); P2 = Phi(k), the chance that a cycle has no stockout",
  "k sigma / Q; P2 = 1 - k sigma / Q",
  "G(k) / sigma; P2 = 1 - Q G(k) / sigma, the loss scaled up by the order"],
 "The basis reads: expected units short per cycle = sigma G(k), G(k) = phi(k) - k (1 - Phi(k)); P2 = 1 - sigma G(k) / Q. Phi(k) is P1, the cycle service level, a different measure. The safety stock k sigma is no count of units short.")

q(3, "On CHK-BEAN, a cycle service level of 0.95 gives k 1.644854 and a fill rate of 0.98 gives k 1.026327. Which target asks for more safety stock, and why?",
 "The cycle service level of 0.95, whose k of 1.644854 is the larger",
 ["The fill rate of 0.98, since 0.98 is the higher of the two stated levels",
  "Neither, since both are the same kind of service target",
  "The fill rate, since it counts units short against the order"],
 "The engine computes k 1.644854 for the cycle service level of 0.95 and k 1.026327 for the fill rate of 0.98 on the same sigma, 3.029476, so the cycle service target asks for the larger safety stock: a reorder point of 13.316294 against 11.442483. Comparing the two stated levels as one scale is the mistake the vocabulary rule prevents.")

q(1, "What safety stock and reorder point go with k 1.026327 on the choke beans?",
 "Safety stock 3.109233, reorder point 11.442483",
 ["Safety stock 4.983044, reorder point 13.316294, as at a cycle service level of 0.95",
  "Safety stock 3.109233, reorder point 3.109233",
  "Safety stock 11.442483, reorder point 12.000000"],
 "The reason reads: safety stock 3.109233 over a demand of 8.33325 with sigma 3.029476 gives the reorder point s 11.442483, held as 12. The reorder point adds the safety stock to the demand over the protection period, so it is never equal to the safety stock here. 12.000000 is the held level.")

q(2, "How close does the engine come to Caplice, lecture 11 slide 24, at the lowest printed fill rate, 0.80?",
 "A safety stock of 147.444755 against the printed 148",
 ["A safety stock of 217.213043, against the printed 217, from the cycle service column",
  "A safety stock of 250.102945 against the printed 252",
  "A safety stock of 339.179604 against the printed 348"],
 "At 0.80 the engine's k is 0.571295 and the safety stock 147.444755; the slide prints 148, within 2 units. 250.102945 against 252 is the 0.90 row, 339.179604 against 348 is the 0.95 row and its slip, and 217.213043 is the exact cycle service figure at 0.80.")

emit(Q, '/root/cat-wip-materials/banks/sc3i_m04.json', expect_n=15)
finish()
