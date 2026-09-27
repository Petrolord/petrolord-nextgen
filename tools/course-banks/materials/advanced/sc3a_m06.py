import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# SC3 Expert m06, What the Engine Does Not Compute. Seams, caps, conventions
# and the written stock policy. Every keyed message is recomputed through the
# vendored engine by scratch/bank-advanced/witness.mjs (ins-refuse-unknown-key,
# ins-refuse-mean-cap, the stated probe of 5001 ABC items, the stated probe of
# rounding removed with roundTo added on eoq-ekene-baryte, ins-ekene-esp-motor).
# No capstone name, input or value appears.

K = [0, 2, 3, 1, 2, 0, 1, 3, 0, 3, 2, 1, 3, 0, 2]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("The ESP motor's 2 failures a year enter the insurance call as a stated number. Where does estimating a failure rate from field data belong?",
 "To the rotating course and the reliability parts of the academy; this engine takes the rate as stated",
 ["To this engine, which fits the rate from the months since the last issue in the register",
  "To the uncertainty course, which samples the rate on the seed that the spares calculator states for each run",
  "To the procurement course, which reads the rate from the supplier's tender for the motor"],
 "The engine estimates no failure rate from field data; it takes a stated failure rate a year, and the rotating course and the reliability parts of the academy own the estimate. The register's months since the last issue feed the slow-moving bands only; the uncertainty course owns Monte Carlo as a subject; procurement owns tendering.")

# 2
x("How does the engine handle the time value of money in the ESP motor's cheapest stock of 4 spares at 160003.732064 a year?",
 "It discounts nothing: the cost is in money of one year, and discounting and NPV belong to the cash flow course",
 ["It discounts each year a spare sits on the shelf at the holding rate of 0.2 and reports the NPV of the whole stock",
  "It discounts the downtime cost at a rate it holds itself, so the total is a present value",
  "It computes the NPV through the canonical cash flow engine and prints it beside the total"],
 "No figure in the engine is discounted and no NPV is computed; the insurance total is a cost a year, and the cash flow course owns discounting. The holding rate is a charge a year on the unit cost; the engine holds no rate of its own; it imports only lib/stats, the percentile convention and the incomplete gamma.")

# 3
x("The CSG-958 casing is costed on a stated price schedule. Which course owns how that schedule was tendered and evaluated?",
 "The procurement course; this engine takes the price schedule and discount type as stated",
 ["This engine, which scores each bid received and keeps the price band with the lowest total cost",
  "The supply course, which sets terminal and depot stock and the prices that go with it at each depot",
  "The cash flow course, which discounts each band's price to a present value first"],
 "Tendering, bid evaluation and contract types belong to Procurement, Tendering & Contracting; the engine takes a stated schedule and discount type. It evaluates no bids. The supply course owns terminal and depot stock; the cash flow course owns discounting, and nothing here is discounted.")

# 4
x("Where does a demand forecast come from in the engine's calculations?",
 "Nowhere in this course: the demand and its standard deviation are stated inputs",
 ["The register's monthly usage, which the engine projects forward with a trend",
  "From the uncertainty course's Monte Carlo, run inside every safety stock call",
  "The months since the last issue, which the engine turns into a demand rate"],
 "The engine forecasts no demand and fits no demand distribution: a stated demand and its standard deviation go in, and no course of this one owns a forecast. It projects no trend, runs no sampler inside a safety stock call, and uses the months since the last issue for the slow-moving bands alone.")

# 5
x("An insurance spares call on the ESP motor carries an extra key, holdingCost. What does the engine return?",
 "holdingCost is not an accepted key; the accepted keys at the top level are failuresPerYear, leadTimeDays, daysPerYear, unitCost, holdingRate, downtimeCostPerDay, maxSpares",
 ["a result that ignores holdingCost and uses the holding rate of 0.2 with the unit cost of 185000, as stated, and names the unread key in its reason",
  "holdingCost and holdingRate: state exactly one (holdingRate goes with unitCost), and the call stops there before any spares are priced",
  "a result that uses holdingCost in place of the holding rate, since a holding figure stated directly takes priority over a rate on the unit cost"],
 "The engine reads no key it does not know: every function refuses an input key it does not read, naming the key, its path and the accepted keys, and the keyed message is verbatim. A misspelt or extra key is never dropped silently or used; the exactly-one message belongs to the eoq call, whose keys differ.")

# 6
x("The baryte EOQ case is sent with its rounding rule removed and an unknown key, roundTo, added. Which refusal comes back first?",
 "the refusal of roundTo as an unknown key, since the accepted keys are checked before any input is read",
 ["the refusal of the missing rounding rule, since each function reads its stated rules before its other keys",
  "both refusals, joined in one message that names roundTo first and rounding second",
  "a result at the EOQ of 137.408584, with roundTo read as a rounding rule of none"],
 "Every function checks its accepted keys before it reads an input, so the unknown key is refused first, in the engine's words roundTo is not an accepted key; the accepted keys at the top level are annualDemand, orderCost, holdingCostPerUnitYear, unitCost, holdingRate, rounding. The missing rounding rule would be refused next, but a call stops at its first refusal; the engine joins no messages, and an unknown key is read as no rule.")

# 7
x("An ABC call carries 5001 items. What does the engine say, and what happens at exactly 5000?",
 "items has 5001 entries; the cap is 5000, and a call of 5000 items is accepted and ranked",
 ["items has 5001 entries; the cap is 5000, and a call of exactly 5000 items is refused as well",
  "a result on the first 5000 items, with the last one dropped and then named in the reason",
  "a result on all 5001 items, since the cap only applies to the criticality and slow-moving calls"],
 "MAX_ITEMS is 5000 for one criticality, ABC or slow-moving call; 5001 is refused by name with the cap in the message, and 5000 is accepted. The engine drops no item and truncates no list; the cap applies to all three of those functions.")

# 8
x("An insurance call puts seven hundred failures a year on the motor, with a replacement that takes a whole year (365 days, in a year of 365 days), pushing the mean orders outstanding past 500. What does the engine return?",
 "leadTimeDays must be at most 260.714285 (rounded down at the sixth decimal so that it is accepted) so that the mean number of orders outstanding is at most 500; got 365",
 ["leadTimeDays must be at most 365 so that the mean number of orders outstanding is at most 500; got 365, the whole year stated as the lead time",
  "maxSpares must be a whole number from 0 to 1000; got 6, since a mean above 500 orders outstanding needs a far larger search limit than 6",
  "a result with 6 spares at the search limit, flagged so that a larger stock may cost less, since a mean above 500 lies far beyond the limit of 6"],
 "The mean orders outstanding may not pass 500, and the engine refuses the lead time that pushes it over, printing the largest accepted value rounded toward the accepted side; the keyed message is its own words. It names the lead time and leaves the stated failure rate as it is, prints the limit to six decimals rounded down, refuses before any search, and accepts the stated maxSpares of 6.")

# 9
x("Which figures does the engine hold of its own, with no input stating them?",
 "Only the 12 in DEFAULTS: its tie convention, the weight sum and its tolerance, and its caps",
 ["The 12 in DEFAULTS and a standard holding rate that applies whenever no holding rate is typed",
  "Its caps and a cycle service level of 0.95, applied whenever a service level is left out",
  "Its caps and the Ekene policy's bands, which apply whenever no slow-moving band is stated"],
 "Every cost, rate, cycle service level or fill rate, band and seed is a stated input with no default; the only figures the engine holds are the 12 in DEFAULTS, from TIE_DIGITS 12 to MAX_SPARES 1000. A missing holding rate, service target or band is refused by name, and the Ekene policy is a stated case; it is no fallback.")

# 10
x("Which alternative does the course name beside the engine's one-for-one insurance convention?",
 "A repair loop, partial loss, or holding on spares in stock only",
 ["One demand rate held for the whole of each sampled lead time drawn",
  "A holding charge that carries interest on the set-up cost as well",
  "A spread on the review period as well as a spread on the lead time"],
 "The insurance convention is the one-for-one pipeline, one unit down a waiting failure, with holding on every spare bought; its alternative is a repair loop, partial loss, or holding on spares in stock only. One rate a lead time is the lead-time risk choice itself; interest on the set-up cost is the Harris alternative to the holding cost; a review-period spread is the lead-time spread alternative.")

# 11
x("The ESP motor's reason prints a total of 160003.73 while the tile reads 160003.732064. Which convention is at work?",
 "The print rule: money to the cent inside a message, and the field at six decimals",
 ["The rounding rule: the stated nearest multiple of 0.01 is applied to the total cost",
  "The tie rule: two totals that agree to 12 significant digits print only to the cent",
  "The holding rule: the holding charge is billed to the cent on each spare that is bought"],
 "Inside a message the engine prints money rounded to the cent and a computed figure to six decimals; the field keeps its full value, which the tile shows at six decimals. No rounding rule applies to an insurance total, and neither the tie rule nor the holding charge sets how a figure prints.")

# 12
x("Which convention of the engine does Harris (1913) write differently, as the course states it?",
 "The holding cost: Harris lets the carrying charge also carry interest on the set-up cost",
 ["The rounding rule: Harris rounds every lot to the nearest multiple of ten units in his tables",
  "The ties: Harris compares his lot costs exactly, and the engine at 12 digits",
  "The lead-time spread: Harris lets the review period vary as well as the lead time of each order"],
 "The engine charges holding on the units held, stated directly or as a rate on the unit cost; the alternative the course names is a holding charge that also carries interest on the set-up cost, as Harris 1913 writes it. Harris rounds his stud to 49 with a stated say, sets no ties rule, and treats no lead-time spread.")

# 13
x("A written stock policy names each insurance spare's inputs. Which list is complete?",
 "The failure rate, lead time, days a year, unit cost, holding rate, downtime cost and search limit",
 ["The failure rate, lead time, unit cost and downtime cost, the four figures that move the answer most",
  "The failure rate, lead time and days a year, since all of the costs follow from the register itself",
  "The unit cost, holding rate and downtime cost, since the failure rate is a reliability figure elsewhere"],
 "For each insurance spare the policy names the failure rate, lead time, days a year, unit cost, holding rate, downtime cost and search limit, every input of the call. Each shorter list leaves out a stated input the engine refuses without; the register states no holding rate or downtime cost, and a stated failure rate stays in the policy whoever estimated it.")

# 14
x("How does a written stock policy record a figure from the lead-time Monte Carlo?",
 "With its seed and its draws, as an estimate kept apart from every graded figure",
 ["As the P90 alone, since the platform's one convention makes the seed needless",
  "Rounded to a whole unit, since a sampled figure is exact only to the nearest unit",
  "As the mean of three runs on three seeds, which removes the need to state any seed"],
 "The policy names each sampled figure with its seed and draws, and the course calls it an estimate and grades none. The P-label convention sets how a percentile is labelled and says nothing of how a run is reproduced; the engine rounds no sampled figure; averaging seeds still needs each seed stated.")

# 15
x("Which description fits every graded number in this course?",
 "A return value of the engine on fixed inputs, so there is exactly one right answer on any machine",
 ["A figure the learner reads off the Monte Carlo view, quoted with its seed and draws",
  "Any figure printed in a published source, which the engine was set up to reproduce exactly as printed",
  "A figure under the engine's stated readings, which the capstone then treats as the law of the subject"],
 "Every graded number is a return value of the engine on inputs written down in advance; no graded figure is a Monte Carlo draw, and none depends on a reading. A published print can be a slip, as two of them are, and the engine keeps its rule.")

emit(Q, '/root/cat-wip-materials/banks/sc3a_m06.json', expect_n=15)
finish()
