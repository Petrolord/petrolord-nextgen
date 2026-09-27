import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# SC3 Expert final exam, forty-two questions over the whole tier and the
# distinctions the lower tiers set up. Every numeric or refusal key is a return
# of the vendored engine on a golden input or a stated probe, recomputed by
# scratch/bank-advanced/witness.mjs. The Ekene register is synthetic. Sampled
# figures appear only as estimates with their seed and draw count, and no key is
# a Monte Carlo figure presented as exact. No capstone name, input or value
# appears.

K = [1, 1, 3, 2, 2, 2, 0, 3, 2, 2, 1, 0, 1, 1, 3, 3, 2, 0, 0, 3, 0, 2, 3, 3, 0, 0, 3, 2, 2, 0, 2, 0, 0, 3, 2, 1, 0, 3, 1, 1, 1, 1]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("A planner doubles the ESP motor's lead time while keeping every other input. By what factor does the engine's mean number of orders outstanding move?",
 "It doubles, since the mean is proportional to the lead time in days",
 ["It stays put, since the lead time enters the costs and leaves the mean alone",
  "It rises by the square root of two, as an economic order quantity would",
  "It halves, since a longer lead time spreads the same failures more thinly"],
 "The mean is failuresPerYear x leadTimeDays / daysPerYear, so it moves in proportion to the lead time, as it does to the failures a year. The square root belongs to the EOQ, where the lot grows with the square root of demand; a longer lead time keeps more orders on their way and cannot keep fewer.")

# 2
x("Which two stated inputs together make up the holding step that each extra ESP motor spare adds to the yearly total?",
 "The unit cost of 185000 and the holding rate of 0.2",
 ["The downtime cost of 18000 a day and the 365 days a year",
  "The unit cost of 185000 and the 2 failures a year",
  "The holding rate of 0.2 and the lead time of 150 days"],
 "Each spare bought carries unitCost x holdingRate a year, 37000.000000 on the motor. The downtime cost a day and the days a year price the units down; the failures a year and the lead time set the Poisson mean, and neither enters the holding charge.")

# 3
x("In the ESP motor table, which two figures add up to the three-spare total of 188347.405085 a year?",
 "111000.000000 of holding and 77347.405085 of downtime",
 ["148000.000000 of holding and 12003.732064 of downtime",
  "111000.000000 of holding and 409957.821135 of downtime",
  "74000.000000 of holding and 77347.405085 of downtime"],
 "Three spares carry 3 times 37000.000000 of holding, 111000.000000, and 77347.405085 of downtime, which add to 188347.405085 (engine). The pair 148000.000000 and 12003.732064 totals the cheapest stock of four; 409957.821135 is what two spares leave in downtime; 74000.000000 is what two spares cost to hold.")

# 4
x("Reading down the ESP motor table, by how much does the yearly downtime fall when a fifth spare is added to four?",
 "By 10425.849112, well short of the 37000.000000 the fifth spare adds in holding",
 ["By 37000.000000, exactly the holding it adds, so four and five tie on cost, as the table shows",
  "By 12003.732064, the whole downtime cost left over at four spares",
  "By 1577.882952, the downtime cost that is still left once five spares are held on the shelf"],
 "From four spares to five the downtime falls from 12003.732064 to 1577.882952, a saving of 10425.849112 a year, while holding rises by 37000.000000, so four stays cheapest. No tie arises; 12003.732064 is the downtime at four spares, and only part of it is saved.")

# 5
x("The motor's four-spare no-shortage figure and its five-spare fill rate print identically, 0.998413. Why?",
 "The rule makes the second the first: a failure finds a spare when fewer than five orders are outstanding",
 ["Coincidence of the stated inputs: another failure rate or lead time would pull the two figures apart",
  "Rounding at six decimals hides a gap further out, so the course keeps the two figures apart as different",
  "The search stopped at 6, and figures near the search limit are copied from the row above them"],
 "A failure finds one of five spares when four or fewer orders are outstanding, which is exactly the chance of no shortage with four. The engine returns them equal by construction, so here printed alike is equal because the rule says so; no input, rounding or search limit enters.")

# 6
x("Why does the course quote MIL-HDBK-338B word for word, while it cites the MIT lectures only by lecture and slide?",
 "The handbook is public domain; the lectures are CC BY-NC-SA 4.0 and this course is sold",
 ["The handbook is newer than the lectures, and the course quotes only the newest of its sources",
  "The lectures print no figures of their own, so there is nothing in them to quote",
  "The handbook's authors asked to be quoted, and the lectures' author did not"],
 "Only public-domain texts are quoted, with their citation: Harris 1913 and MIL-HDBK-338B. The lectures are licensed for non-commercial use, and this course is sold, so their figures are cited by lecture and slide and their ideas taught in the course's own words. The lectures do print figures, which the course cites.")

# 7
x("A downtime cost of 100 a day on the ESP motor moves the cheapest stock from four spares to none. What made the difference?",
 "Only the price of waiting moved: the first spare now saves 20455.05 of downtime against 37000 of holding",
 ["The mean orders outstanding fell below one half, so no spare is likely to be needed",
  "A higher holding rate came with the lower downtime cost, which the engine links to it",
  "The search limit fell to 0, since cheap downtime shortens the search for spares"],
 "At 100 a day the failure rate, lead time and mean are unchanged, and only the downtime price moved; the engine's reason shows the first spare adding 37000 of holding and saving 20455.05 of downtime, so none is cheapest. The engine links no input to another, and the stated search limit of 6 is unchanged.")

# 8
x("With a holding rate of 0 and a search limit of 3 on the ESP motor, why does the engine flag its answer?",
 "Every spare is then free to hold and saves some downtime, so the largest number searched wins and sits on the limit",
 ["A holding rate of 0 is refused, and the flag marks the refusal on the search limit",
  "Three spares is the first row where the fill rate passes 0.99, and the flag marks that target",
  "The downtime saved by the third spare ties the holding it adds, and ties are flagged"],
 "With free holding each extra spare lowers the total, so the cheapest found is always the last row, and the engine says: 3 spares: holding 0 a year against expected downtime 77347.41, total 77347.41, the lowest for 0 to 3; the search stopped at maxSpares 3, so a larger stock may cost less. A rate of 0 is accepted; the engine aims at no fill rate; no tie arises.")

# 9
x("A planner asks the ESP motor case to search up to 1001 spares. What comes back?",
 "A refusal naming maxSpares, whose largest accepted value is the cap of 1000",
 ["A result at 1000 spares, the limit clipped to the cap and flagged at that edge",
  "A refusal naming the mean orders outstanding, whose cap is 500",
  "A result at 4 spares, since any search wide enough finds that stock"],
 "The search limit may not pass MAX_SPARES, and the engine says so in its own words: maxSpares must be a whole number from 0 to 1000; got 1001. It clips no stated input and returns no result on a refused call; 500 caps the mean orders outstanding, a different refusal on the lead time.")

# 10
x("Reading down the ESP motor's fill-rate column, which is the first stock whose fill rate is at or above 0.99, and how does it compare with the cheapest stock?",
 "4 spares, with a fill rate of 0.990054; it is also the cheapest stock at the stated costs",
 ["3 spares, with a fill rate of 0.990054; one spare fewer than the cheapest stock of 4",
  "5 spares, with a fill rate of 0.998413; one spare more than the cheapest stock of 4",
  "3 spares, with a no-shortage probability of 0.990054, which the column prints as its fill rate"],
 "The fill rate with four spares is 0.990054, the first at or above 0.99; three spares give 0.949374. Four is also the cheapest stock, at 160003.732064 a year, although the engine aimed at no fill rate. 0.990054 is the no-shortage probability with three, a different column; five spares first reach 0.998413.")

# 11
x("On the mechanical seal, what are the two stated triangles the lead-time Monte Carlo draws from?",
 "Lead time 70, 90 and 160 days; demand a day 0.01, 0.016 and 0.03 seals",
 ["Lead time 70, 106.453303 and 160 days; demand a day 0.01, 0.016 and 0.03",
  "Lead time 83.198487, 103.503359 and 134.894691 days, the sampled percentiles",
  "Lead time 90 days held constant; demand a day 0.01, 0.016 and 0.03 seals"],
 "The register states the seal's lead time as a triangle of 70, 90 and 160 days and its demand a day as 0.01, 0.016 and 0.03. 106.453303 is the sampled mean, which is no stated mode; 83.198487, 103.503359 and 134.894691 are sampled P90, P50 and P10 figures; the lead time is a triangle, and a constant would be a different case.")

# 12
x("A planner types the seal's lead time as the text 90 in place of a number or a triangle. What does the engine do?",
 "It refuses leadTimeDays, which must be a number or a triangle of finite numbers",
 ["It reads the text as the number 90 and runs the call on a constant lead time",
  "It ignores the lead time and samples the demand over a lead time of 0 days",
  "It refuses the whole call as options, which must be an object of named inputs"],
 "The engine's words for this probe are leadTimeDays must be a number or a triangular distribution { min, mode, max } of finite numbers. It converts no text into a number and drops no input; the options message is for a call handed something other than an object.")

# 13
x("Why is the seed a required input of every lead-time risk call?",
 "So that every run can be reproduced: the same seed and draws give the same draws",
 ["So that the engine can grade the sampled figures against one fixed right answer",
  "So that the seed can scale the triangles, which the engine stretches by its value",
  "So that the draw count can be read from it, since the seed fixes the number of draws"],
 "The engine's own refusal says why: seed must be a whole number from 0 to 4294967295; it is required so that every run can be reproduced. Reproducible draws still give an estimate, and no sampled figure is graded. The seed starts the mulberry32 stream only; the draw count is a separate stated input.")

# 14
x("On seed 20270301 and 20000 draws, the seal's lead-time demand has a P90 of 1.306495 and a P10 of 2.780743 seals. Which is the low figure?",
 "1.306495, the P90: met or exceeded in 90 percent of the draws",
 ["2.780743, the P10: met or exceeded in 10 percent of draws only",
  "Neither: P90 and P10 name the same sorted draw read two ways",
  "1.907671, the P50: the low figure is always the median"],
 "Sorted from small to large, the demand P90 is read at floor(0.1 n), so 1.306495 seals is the smaller of the two, exceeded by nine draws in ten; it is an estimate on that run and is not graded. 2.780743 is read at floor(0.9 n), the upper end where stock runs out; each label names its own sorted draw, and the median is the P50.")

# 15
x("A learner sees the seal's reason \"1172 of 20000 draws have a lead-time demand above the reorder point 3\". How should the stockout probability be quoted?",
 "As an estimate of 0.058600 on seed 20270301 and 20000 draws, which is not graded",
 ["As 0.058600 with no seed, since the reason already gives the draws it was made from",
  "As 0.0586 exactly, the seal's true stockout probability a cycle at a reorder point of 3",
  "As 0.05, the figure the target of 0.95 implies for the seal on any seed at all"],
 "A sampled figure is quoted with its seed and its draws and called an estimate; the course writes the seal's stockout probability as estimated at 0.058600 on seed 20270301 and 20000 draws. Without the seed it cannot be reproduced; no sampled figure is exact or true; the target implies nothing about what the draws return.")

# 16
x("A planner asks for 200001 draws on the seal. What happens?",
 "The call is refused by name, since the draw count may not pass the cap of 200000",
 ["The call runs on 200000 draws, the count clipped down to the cap, with a note in the basis",
  "The call runs all 200001 draws, since the cap is only a warning printed beside it",
  "The call is refused, since no more than 20000 draws are ever taken in one run"],
 "MAX_ITERATIONS is 200000, and the engine refuses one more in its own words: iterations must be a whole number from 1 to 200000; got 200001. It clips no count and treats no cap as advice; 20000 is the draw count of the Ekene case, well inside the cap.")

# 17
x("A lead-time risk call misspells the mode of the seal's lead time as mod. What comes back?",
 "leadTimeDays.mod is not an accepted key; the accepted keys of leadTimeDays are min, mode, max",
 ["leadTimeDays must have min <= mode <= max; got min 70, mode undefined, max 160",
  "a result on the triangle 70, 90, 160, with the misspelt key read as the mode that it most closely resembles",
  "a result with the lead time held at a constant 70 days, since no mode was stated"],
 "An input key a function does not read is refused at whatever level it sits, with its path and the accepted keys, and the check comes before any other; the keyed message is verbatim. The engine guesses no key from its spelling, and it fills no missing mode.")

# 18
x("The constant case of 2 a day over 10 days is run twice, at reorder points of 20 and of 19.5. How do the two stockout probabilities compare?",
 "0 at 20 and 1 at 19.5: equality is met, and half a unit short fails every draw",
 ["1 at 20 and 1 at 19.5: equality counts as a stockout, so both points fail",
  "0 at 20 and 0.5 at 19.5: half a unit short fails half of the draws on the stated seed",
  "0 at both points: the engine rounds 19.5 up to 20 before it counts the draws"],
 "Every draw is exactly 20: at a reorder point of 20 none is above it (0 of 50), and at 19.5 every draw is 0.500000 above it (50 of 50). Counting equality as a stockout is the alternative reading the engine names; the draws do not vary, so no half share arises; the engine rounds no stated point.")

# 19
x("The seal's reorder point for a cycle service level of 0.95 is 3.062282 on seed 20270301 with 20000 draws, and 3.113782 on seed 20270302 with 2000 draws. How should a planner read the pair?",
 "As two estimates of one quantity, each quoted with its seed and draws, the larger run the steadier",
 ["As a contradiction, since a seeded sampler must return one reorder point on every run",
  "As proof that the second seed is faulty, since its figure sits further from the stated 3",
  "As two exact reorder points, of which the policy should keep the higher for safety"],
 "Each figure is the sorted draw at ceil(0.95 x n) - 1 of its own run, and each run is an estimate that moves with the seed and the draw count; more draws average out more chance. A seed reproduces its own run, and no seed is faulty; neither figure is exact or graded.")

# 20
x("The inventory engine computes the standard normal cumulative probability without a normal table of its own. Through what?",
 "The regularised incomplete gamma, imported from engines/hse/safetyStats.js",
 ["A normal sampler in lib/stats, run on a fixed seed every time it is called",
  "A table read to two decimals, the way the lecture slides read their factors",
  "The percentile convention of lib/conventions/percentile.js, read backwards"],
 "The engine imports regularizedGammaQ from engines/hse/safetyStats.js and computes Phi through it; its inverse is Wichura AS241. It samples nothing for Phi; a two-decimal table reading is a stated safety-factor rounding; the percentile convention supplies only the exceedance sentence.")

# 21
x("On the Ekene register, why is the PSV repair kit class V under the stated criticality policy?",
 "It scores the maximum 5 on safety, which places it in class V whatever its weighted score of 68.000000",
 ["Its weighted score of 68.000000 is at or above the V minimum of 70, compared at 12 digits",
  "It ranks in class A by annual usage value, and the policy lifts every class A item to V",
  "Its lead time is the longest on the register, and the policy puts the slowest items in V"],
 "The stated override places an item scoring the maximum on safety in the first class: PSV-KIT: scores the maximum 5 on safety, which places an item in class V whatever its weighted score (68, class E by score alone). 68 is below 70 by any comparison; the kit is ABC class C; no lead-time rule exists.")

# 22
x("Under the Ekene ABC cut-offs of 80 and 95 percent, why is CEM-G class B under one boundary rule and class A under the other?",
 "It is the item that crosses 80 percent: at-or-below reads the share with it, 83.536840, and include-crossing reads the share before it, 78.753907",
 ["Its share is exactly 80 percent, which at-or-below places in A and include-crossing places in B",
  "The two rules rank the items in a different order, so CEM-G sits seventh under one and fifth under the other",
  "Include-crossing rounds each cumulative share to a whole percent first, and 83.536840 rounds down to 80 there"],
 "CEM-G's cumulative share with it is 83.536840 and before it 78.753907. At-or-below decides on the share including the item, so B; include-crossing decides on the share before it, so the item crossing a cut-off joins A. The ranking is the same under both rules, and nothing is rounded.")

# 23
x("BARYTE's EOQ is 137.408584 tonnes. Why does the register calculator order 140.000000?",
 "The stated rule rounds up to a multiple of 10, and the order costs 0.017454 percent more than the EOQ",
 ["The EOQ is always rounded to the nearest 10 tonnes, a fixed rule the engine holds",
  "140.000000 is the EOQ once the purchase cost of 78000.000000 a year enters the relevant cost of the order",
  "The holding cost is stated as 57.200000, which moves the optimum up to 140 tonnes"],
 "The EOQ is the unrounded figure; the quantity ordered is the one the stated rounding rule gives, here up to a multiple of 10, at a relevant cost of 7861.142857 against 7859.770989, a penalty of 0.017454 percent. The engine holds no rounding rule; the purchase cost moves no EOQ; 57.200000 is the holding cost that gives 137.408584 itself.")

# 24
x("On the CSG-958 casing schedule, what does the engine order under all-units and under incremental discounts?",
 "120.000000 at 349720.000000 a year under all-units; 141.000000 at 365590.042553 under incremental",
 ["141.000000 at 365590.042553 under all-units; 120.000000 at 349720.000000 under incremental",
  "120.000000 under both types, since the break quantity of the cheapest band wins under either discount type",
  "77.000000 at 357689.090909 under both, since band 1 holds its EOQ under either type"],
 "All-units prices the whole lot at the band's price, so band 2's break of 120 is the cheapest candidate at 349720.000000; incremental prices each unit by its own band, so band 2's own EOQ, rounded to 141, costs 365590.042553 (engine). Swapping them reverses the two types; 77.000000 is the all-units band 1 candidate, which costs more.")

# 25
x("On the choke bean set, what safety factor does a cycle service level of 0.95 give, and what does a fill rate of 0.98 give?",
 "1.644854 for the cycle service level of 0.95; 1.026327 for the fill rate of 0.98",
 ["1.026327 for the cycle service level of 0.95; 1.644854 for the fill rate of 0.98",
  "1.644854 for both, since a service level of any kind sets k by the inverse normal",
  "1.959964 for the fill rate, the factor a cycle service level of 0.975 gives"],
 "A cycle service level counts the cycles with any shortage and sets k = Phi^-1(0.95) = 1.644854; a fill rate counts units short against the order quantity of 12 and needs G(k) at or below 0.079222, so k = 1.026327 (engine). Swapping them confuses the measures; 1.959964 is the factor for a cycle service level of 0.975, no fill rate. A service level in this course always names its measure.")

# 26
x("Harris (1913) prints the lot for his stud as 48.5 and adds \"or, say, 49\". What does the engine order with the stated rule nearest multiple of 1?",
 "49.000000, from an EOQ of 48.554321",
 ["48.5, the lot that Harris prints",
  "48.554321, since the rule leaves it be",
  "50.000000, the next round lot up"],
 "The EOQ on the stud's figures is 48.554321, and the stated rule nearest multiple of 1 orders 49.000000 (engine), which matches Harris's own \"say, 49\". Harris prints the lot short of the formula at 48.5; a stated rule always rounds; a nearest multiple of 1 gives 49.")

# 27
x("Which two printed figures does the course treat as slips in the texts it read?",
 "348 at a fill rate of 0.95 on lecture 11 slide 24, and 0.009 at level 4 on lecture 13 slide 12",
 ["0.986 in MIL-HDBK-338B's lamp example, and 2,190 for Harris's first lot",
  "601 at a cycle service level of 0.99 on lecture 11 slide 24, and 2835 on lecture 12 slide 6",
  "0.25 at level 1 on lecture 13 slide 12, and 400 on lecture 8 slide 9"],
 "The two slips are the fill-rate safety stock of 348, where the rule gives 339.179604, and the loss of 0.009 at level 4, where the recursion gives 0.001619. The handbook's 0.986 and Harris's 2,190 are rounded prints; 601, 2835, 0.25 and 400 all agree with the engine at the precision printed.")

# 28
x("The PSV kits demand 0.5 a month over a lead time of 4 months, read as Poisson. What level does a cycle service level of 0.95 need, and why not 4?",
 "Level 5, since P(X <= 4) is 0.947347 and falls short, while P(X <= 5) is 0.983436",
 ["Level 4, since P(X <= 4) of 0.947347 rounds to 0.95 at two decimals, which the engine counts as met",
  "Level 2, the Poisson mean, since the mean already covers the whole demand expected over the lead time",
  "Level 3, since the expected units short at 3, 0.218018, is below 0.3"],
 "The engine takes the smallest level whose cumulative probability meets the target: level 5: P(X <= 5) = 0.983436 is at or above 0.95; at 4 it is 0.947347 (Poisson mean 2). Nothing is rounded before the comparison; the mean alone carries no safety stock; level 3 is the answer to a fill rate of 0.95 with an order quantity of 6.")

# 29
x("At a fill rate of 0.95 with an order quantity of 6 kits, the PSV kits need level 3. What expected units short a cycle and achieved fill rate does the engine report there?",
 "0.218018 units short a cycle, an achieved fill rate of 0.963664",
 ["0.541341 units short a cycle, an achieved fill rate of 0.95",
  "0.218018 units short a cycle, an achieved fill rate of 0.857123",
  "0.075141 units short a cycle, an achieved fill rate of 0.983436"],
 "At level 3 the loss is 0.218018, at or below 6 x (1 - 0.95) = 0.3, and the achieved fill rate is 0.963664 (engine). 0.541341 is the loss at level 2, which misses the target; 0.857123 is the cumulative probability at level 3, a cycle service figure; 0.075141 is the loss at level 4.")

# 30
x("Why does the engine refuse a Poisson call whose mean over the protection period would pass 500?",
 "Above that mean the normal safety stock serves, and the cap is a stated figure the refusal names",
 ["A Poisson table longer than 500 rows cannot be printed in the stock calculator at all, so it is cut there",
  "A mean of 500 is where the Poisson probabilities stop adding up to one inside the engine's own arithmetic",
  "The cap is the largest demand the Ekene register holds, so no case can pass it"],
 "MAX_POISSON_MEAN is a stated cap, and the refusal says in its own words: above that the normal safetyStock serves. The cap is a design limit, and nothing about printing, probabilities failing or the Ekene register sets it; a mean of exactly 500 is accepted.")

# 31
x("Which subject does this course leave to the uncertainty course, and what does it take in its place?",
 "Distributions, correlation and Monte Carlo as a subject; this course applies the canonical sampler to lead-time risk",
 ["Safety stock under normal demand; this course takes a stated safety stock for each stocked item",
  "Failure rates from field data; this course samples each failure rate on a stated seed",
  "The Poisson table; this course reads Poisson probabilities from MIL-HDBK-338B alone"],
 "The uncertainty course owns distributions, correlation and Monte Carlo as a subject; the engine uses the canonical seeded sampler of lib/stats for lead-time risk only. Safety stock is computed here at the Professional tier; failure rates belong to the rotating course and are stated; the engine computes its own Poisson table.")

# 32
x("What is the engine's stated convention for lead-time risk, and what alternative does the course set beside it?",
 "One demand rate held for the whole lead time; the alternative is a fresh demand draw every day",
 ["A fresh demand draw every day; the alternative is one demand rate held for the whole lead time drawn",
  "A normal lead-time demand; the alternative is a pair of stated triangles",
  "The lead time drawn after the demand rate; the alternative is the lead time drawn first in each iteration"],
 "The engine holds one rate a lead time, so a busy spell stays busy until the order lands; a fresh daily draw is the alternative, which would narrow the spread. The engine samples stated triangles, and it draws the lead time first, then the demand rate.")

# 33
x("A stock policy is written for the mechanical seal. Which entry does the course accept as complete?",
 "Its triangles, one rate a lead time, a reorder point of 3, and each sampled figure with seed 20270301 and 20000 draws",
 ["Its triangles and a reorder point of 3, with the stockout probability of 0.058600 as a certain figure",
  "A reorder point of 3.062282, the engine's answer, with the triangles left out as already known",
  "Its mean lead-time demand of 1.986608 seals and a reorder point of 3, with no seed needed"],
 "A policy names every stated input, the convention the figures rest on, and each sampled figure with its seed and draws. A sampled stockout probability is an estimate that is not certain; 3.062282 is itself a sampled figure that needs its inputs beside it; a mean alone without its seed cannot be reproduced.")

# 34
x("What does the engine's cap MAX_DECIMALS of 6 limit?",
 "The decimals to which a safety factor may be read from a table",
 ["The decimals the engine prints for money inside each of its messages",
  "The decimals of any stated input that the engine will accept at all",
  "The decimals a sampled figure keeps before it is compared with another"],
 "MAX_DECIMALS caps safetyFactorRounding.decimals; seven is refused in the engine's words: safetyFactorRounding.decimals must be a whole number from 0 to 6; got 7. Money prints to the cent inside a message; stated inputs are taken as given; sampled figures are compared at 12 significant digits like every other figure.")

# 35
x("Which pair of terms does this course's vocabulary legislate for a sampled lead time?",
 "Its P90 is the low figure and its P10 the high one, where the stockout risk sits",
 ["Its P90 is the high figure, the 90th percentile of the sorted draws, and the risk sits at its P90 end",
  "Its P90 is the mean of all the draws, and its P10 is the median of the sorted draws of the run",
  "Its P90 is the stated maximum of the triangle, and its P10 is the stated minimum of it"],
 "For a sampled lead time or demand the P90 is the low figure, met or exceeded in 90 percent of draws, and the stockout risk sits at the P10 end. In conversation the ninetieth percentile is a high figure; this course binds the platform's convention. No percentile is the mean, the median of another label, or a stated end of a triangle.")

# 36
x("What does the course mean by \"service level\" wherever it writes the phrase?",
 "It always names its measure: the cycle service level or the fill rate",
 ["The probability of no shortage with the stated spares, whatever call made it",
  "Any measure of how well stock serves, left for the context to make clear",
  "The share of demand met from stock, which is the only measure the engine uses"],
 "The vocabulary rule: a service level always names its measure, the cycle service level (the probability of no stockout in a cycle) or the fill rate (the fraction of demand met from stock). Leaving it to context is what the rule forbids, and the engine computes both measures.")

# 37
x("Every refusal the engine returns is an object with error and field. How does its message begin?",
 "With the name of the field it refuses, then the exact condition that failed",
 ["With a numbered error code, then the golden case that the input happened to match",
  "With the function's name, then a list of every single input that the call stated",
  "With the word error, then the value as it was typed and the default that it replaced"],
 "The message starts with the name of the field it refuses and states the condition, in the form <field> must <condition>; got <value>, or, for an unknown key, that it is not an accepted key with the accepted keys listed. There are no error codes, no input listings, and nothing is replaced.")

# 38
x("Which of these did the course NOT read, as its validation record states?",
 "Silver, Pyke and Thomas and Nahmias, which are not publicly readable",
 ["MIL-HDBK-338B, which is read only through its lamp example on p. 5-27",
  "Harris 1913, which is read only through its 1990 Operations Research reprint",
  "The five MIT lectures, which are cited by lecture and slide for their figures"],
 "The record says, verbatim: Not used: Silver, Pyke and Thomas (4th ed., CRC 2017) and Nahmias are not publicly readable, so not read or cited. MIL-HDBK-338B, Harris 1913 in its 1990 reprint and the MIT lectures were each read on 2026-09-27; the lectures are cited by lecture and slide.")

# 39
x("The ESP motor is class V under the Ekene criticality policy and ranks first by annual usage value, at 370000.000000 in class A. What do those two classes say about how many spares to hold?",
 "Nothing: both say the motor matters and costs, and the spares come from the insurance model",
 ["Four spares, since class V items hold one spare for each of the four criteria that the policy scores",
  "Two spares, one for class V and one for class A, whatever the failure rate is",
  "Six spares, since the policy stocks any item in both class V and class A out to the search limit"],
 "A criticality class is of the stated policy and an ABC class is a stated cut-off on stated usage; neither sizes a spare. The number of spares is the insurance model's cheapest stock at a stated failure rate, lead time and costs, four for the motor. No class rule sets a count.")

# 40
x("Why does the insurance call return the mean number of orders outstanding beside its table?",
 "Every probability, the expected units down and the downtime cost in the table rest on that one mean",
 ["The number of spares the engine recommends, rounded up to a whole spare for the policy to hold",
  "It is the expected downtime a year in days, read directly from the Poisson table of orders outstanding",
  "A fill rate with no spares, which the table then carries down each row of spares"],
 "The orders outstanding are Poisson with that mean, so each probability of no shortage, fill rate and expected units down, and so each downtime cost, follows from it; with no spares the expected units down equal it. It is no count of spares, no number of days and no fill rate: with no spares the fill rate is 0.000000.")

# 41
x("How does the probability of no shortage with 2 spares for the handbook lamps, 0.985612, tie the insurance model to MIL-HDBK-338B?",
 "It is the handbook's chance of two or fewer failures at the same mean of 0.500000, reproduced",
 ["It is the handbook's printed 0.986 carried into the engine as a stated input",
  "It is the fill rate with 3 spares, which the handbook then calls the reliability of the whole mission",
  "It is a Monte Carlo estimate on the handbook's own seed, which the engine then reproduces draw by draw"],
 "Restated as 0.365 failures a year over a lead time of 500 days and 365 days a year, the orders outstanding have the lamp mean of 0.500000, and P(X <= 2) = 0.985612 is the handbook's mission reliability, which it prints as 0.986. Nothing printed is an input; the handbook states no seed and nothing here is sampled.")

# 42
x("Which statement describes the engine's figures on the stated inputs of the course?",
 "Each is what the stated inputs give, and none is a forecast, an audit of the register or a supplier's promise",
 ["Each is a forecast of what will fail or be used on the Ekene field in the coming year",
  "Each is a supplier's promise of price and lead time, which the engine checks against the register",
  "Each is the policy itself, since the engine decides which items to stock and at which target"],
 "A class, an EOQ, a safety stock and a number of spares are each what the stated criteria, costs, demands and targets give; none is a forecast, an audit or a promise, and each is quoted with its inputs. The engine writes no stock policy: the policy is the user's, written down and reviewed.")

emit(Q, '/root/cat-wip-materials/banks/sc3a_exam.json', expect_n=42)
finish()
