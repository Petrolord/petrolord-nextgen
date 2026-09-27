import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# SC4 Expert final exam, forty-two questions, seven for each of the six
# modules, each asked from an angle the module banks do not take. Every numeric,
# reason or refusal key is a return of the vendored engine on the Ekene supply
# base, a stated probe, a golden case or a published check;
# scratch/bank-advanced/witness.mjs recomputes each. Sampled figures are keyed
# only as estimates with their seed and draws in the stem; figures that print
# alike are never keyed as equal. No capstone figure appears.

K = [2, 0, 3, 1, 1, 3, 0, 2, 0, 2, 3, 1, 3, 1, 2, 0,
     1, 0, 2, 3, 2, 3, 1, 0, 0, 3, 1, 2, 3, 0, 1, 2,
     1, 2, 0, 3, 0, 3, 2, 1, 3, 0]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# ---- The shore base as a queue
# 1
x("Lifts take 5.000000 hours and bulk 6.000000 hours on an Ekene call, run side by side. Which term decides how long the call runs beyond its fixed part?",
 "The bulk, at 6.000000 hours against 5.000000 for the lifts",
 ["The lifts, at 5.000000 hours, since the crane always leads",
  "Both together, 11 hours, since the two terms are always summed",
  "Neither, since alongside means the fixed hours set the call"],
 "Side by side, only the longer of the two working terms counts toward the berth time, so the pumping governs here and the whole call comes to 8.000000 hours with its 2 fixed hours. Summing the pair belongs to calls stated as one after the other; the crane leads nothing by rule, and the fixed part is added in both cases.")

# 2
x("With the lifts and the bulk at the Ekene base stated one after the other, what service time does a call take in the engine's return?",
 "13.000000 hours: 2 fixed plus 5 for the lifts plus 6 for the bulk",
 ["8.000000 hours: 2 fixed plus the larger of the two terms, 6 for the bulk",
  "11.180124 hours: the M/M/c mean time at the base on 2 berths",
  "6.000000 hours: the bulk alone, since it follows the lifts"],
 "Concurrent false adds both terms: 2 plus 5 plus 6 is 13.000000 hours, and the berths then run at 0.866667. 8.000000 is the concurrent service; 11.180124 is a time at the base (wait plus service) on the concurrent base; 6.000000 leaves out the fixed hours and the lifts.")

# 3
x("The shore base calculator prints the mean wait in hours and again in working days. How is the second figure made from the first?",
 "Hours divided by the stated length of one working day",
 ["Wait hours over 24, whatever the working day",
  "The wait in hours times the arrivals a day at the base",
  "The wait in hours over the service time of one call"],
 "Every time the queue returns is on the working-hour clock, so a working day holds the stated working hours: the wait in working days is the wait in hours over the working hours a day. Dividing by 24 would count hours the base is closed; the other two are no conversion of a time at all.")

# 4
x("What condition must a shore base call meet before the engine returns any queue figure, and what happens when it fails?",
 "A berth utilisation strictly below 1; at or above it the engine refuses and prints the most arrivals a day it accepts",
 ["A berth utilisation of at most 1; above it the engine returns the figures with a reason saying the base is overloaded",
  "A mean wait under one working day; above it the engine refuses and prints the berths that would bring the wait down",
  "A probability of waiting below 0.5; above it the engine returns the figures and flags the base as one to be expanded"],
 "At a berth utilisation of 1 or more the queue grows without limit and no steady state exists, so the engine refuses on arrivalsPerDay and prints the largest arrivals a day that stay below saturation. The berth target is a separate, optional search, and no wait or probability threshold stops a call.")

# 5
x("Iversen's handbook counts offered traffic in erlangs. How many erlangs reach the two-berth Ekene quay in the engine's return?",
 "1.066667 erlang: a little more than one berth kept busy on average",
 ["0.533333 erlang: the share of each berth's hours that is spent busy",
  "3.2 erlang: one for each vessel that arrives in a working day",
  "2.000000 erlang: one for each berth, whatever the arrivals are"],
 "An erlang is a berth-hour of work arriving each hour, so the offered load of 0.133333 arrivals an hour times 8.000000 service hours is 1.066667 erlang. 0.533333 is that load spread over the 2 berths; 3.2 is the arrivals a day; the berths bound the load from above and do not set it.")

# 6
x("Of the inputs a shoreBase call reads, which one may be left out without a refusal?",
 "The target mean wait, its one optional input; everything else is required",
 ["The working hours a day, which the engine takes as 24 when none is typed",
  "The concurrent choice, which the engine reads as one after the other if unstated",
  "The queue model, which the engine runs as M/M/c when the call does not name one"],
 "The berths, the arrivals a day, the working day, every service term, the concurrent choice and the queue model are required, each refused by name when missing; the target mean wait is optional, and with it the engine adds the berth search. Nothing missing is filled in for the planner.")

# 7
x("Which sentence about the Ekene base follows the course's vocabulary?",
 "The berth utilisation is 0.533333 and the wait, time in the queue, is 3.180124 hours as M/M/c",
 ["The utilisation is 0.533333, so vessels wait for a berth about half of the time they are at the base",
  "The wait of a vessel is 11.180124 hours as M/M/c, counting its time alongside the berth as well",
  "The capacity of the base is 3 arrivals a day, which is its berth utilisation read in arrivals"],
 "Utilisation is always of a named thing, here the berths, and the wait is the mean wait in the queue on the working-hour clock; the time at the base (11.180124 hours) adds the service. A capacity is always of a named constraint, and a berth utilisation says nothing about the share of time spent waiting.")

# ---- Erlang C and M/M/c
# 8
x("Ten servers at an occupation of 0.9 with a mean service of 1: Adan and Resing (Queueing Systems, 26 March 2015) print 0.67 as the wait. What does the engine give?",
 "0.668732, which rounds to the printed 0.67",
 ["0.67 exactly, a figure taken from the printed row",
  "1.524986, the engine's wait at five servers",
  "0.275385, the engine's wait at twenty servers"],
 "The golden call behind that row states 90 arrivals over a 10-hour day and 1 fixed hour, so ten berths sit at 0.900000; eq. 5.3 then gives 0.668732, and two-decimal rounding reproduces the table's 0.67. Other rows give 1.524986 (five servers, where the table's 1.53 is a slip) and 0.275385 (twenty).")

# 9
x("At one server in Adan and Resing's Table 5.1, with an occupation rate of 0.9 and a mean service of 1, which two figures does the engine return?",
 "A delay probability of 0.900000 and a mean wait of 9.000000",
 ["The two-server pair, 0.852632 and a mean wait of 4.263158",
  "A delay probability of 0.900000, but a mean wait of just 4.500000",
  "A delay probability of 1.000000 and a wait again of 9.000000"],
 "At one server the delay probability of M/M/1 is the occupation rate, 0.900000, and the mean wait is 9.000000, both matching the printed 0.90 and 9.00. 0.852632 and 4.263158 are the two-server row; 4.500000 is the M/D/1 wait at the same load; a delay probability of 1 would mean saturation.")

# 10
x("Iversen's first delay system (Teletraffic Engineering Handbook, draft of 20 June 2001) has 32 channels, a mean service of 100 and 20 erlang. What does the engine return for it?",
 "20.000000 erlang offered, 0.008964 of arrivals delayed, 0.074697 as the average wait",
 ["Offered load 2.000000, a delay probability of 0.059701 and a mean wait of 0.199005",
  "An offered load of 20.000000, a delay probability of 0.008964 and a mean wait of 0.075 exactly",
  "An offered load of 20.000000, a delay probability of 0.059701 and a mean wait of 0.273702"],
 "On the golden inputs (a fixed service of 100, 32 berths, 2 arrivals a day over a 10-hour day) the engine returns 20.000000, 0.008964 and 0.074697, and the wait rounds to the printed 0.075. The second system's figures are 2.000000, 0.059701 and 0.199005; 0.273702 is the two waits added.")

# 11
x("At the same occupation of 0.9, Adan and Resing's Table 5.1 waits 9.000000 at one server and 0.275385 at twenty. What does that teach a base planner?",
 "Pooling: one queue shared across many berths waits far less at the same occupation",
 ["Twenty berths are always cheaper to run than one, whatever the arrivals are",
  "That the occupation rate is a poor measure, since it gives the same figure twice",
  "That the table's larger rows are slips, since a wait cannot fall that far that fast"],
 "Held at the same occupation, twenty servers on one queue wait a small fraction of what one server waits, because it takes many vessels at once to fill every berth. The engine prices no berth, the occupation still says whether a steady state exists and how busy the berths are, and every figure in the row checks against the engine.")

# 12
x("Three berths at the Ekene quay cut the M/M/c wait to 0.440347 hours. By Little's law, how many vessels queue on average?",
 "0.058713 vessels, the arrivals an hour times that wait, by Little's law",
 ["0.106417 vessels, the probability of waiting read across as a count",
  "0.355556 vessels, the berth utilisation of the three berths",
  "0.424017 vessels, since the length of the queue is set by the arrivals alone"],
 "0.133333 arrivals an hour times 0.440347 hours gives the engine's mean queue of 0.058713 to the precision printed; eq. 5.2 gives the same figure from the probability of waiting. 0.424017 is the two-berth mean queue; the queue shrinks with the third berth although the arrivals have not moved.")

# 13
x("Stated with 5 berths, the Ekene base as M/M/c returns a mean time at the base of 8.010236 hours. Why can more berths never take it below 8.000000?",
 "Every vessel is served, and the 8.000000-hour service is part of its time at the base",
 ["Because 8.000000 hours is the least wait the engine reports at any number of berths",
  "The engine caps the berths at five for the Ekene base, so the time stops there",
  "Because the mean in the system cannot fall below the 8.000000 berths of the Ekene base"],
 "The time at the base is the wait plus the service, so as the wait falls toward nothing (0.010236 hours at five berths) the time falls toward the service of 8.000000 hours and no lower. The berth cap is 100, the base has 2 berths as stated, and the mean in the system is a count of vessels.")

# 14
x("What does M/M/c assume about the vessels arriving at a base and the calls they make?",
 "Poisson arrivals, exponential service times, one queue served first come first served, in a steady state",
 ["Evenly spaced arrivals, a constant service time, one queue per berth, served in order of cargo size",
  "Poisson arrivals, a constant service time, one queue served first come first served, in a steady state",
  "Scheduled arrivals, exponential service times, priority to the rig vessels, over one working day"],
 "The two Ms are Poisson arrivals and exponential service, and c berths serve one queue first come first served in a steady state. Poisson arrivals with a constant service is M/D/c; the engine holds no schedule, no per-berth queue and no priority.")

# ---- Constant service and M/D/c
# 15
x("Why does the engine keep the word approximation on its M/D/c wait at two berths while the one-berth figure checks exactly?",
 "At one berth the formula becomes the exact Pollaczek-Khinchin result; at several berths no exact formula exists to check it",
 ["At two berths the engine simulates the queue, so its figure carries the noise of a seeded Monte Carlo of arrivals",
  "At two berths the formula drops its correction term, so only half of the M/M/c wait is used and some is lost",
  "At one berth the engine switches to M/M/c, and the word approximation is kept for the M/D/c branch alone"],
 "Liu et al. (arXiv 2102.05851v2) state that M/D/c has no closed form for its mean wait, and the engine uses the Cosmetatos approximation, which reduces to the Pollaczek-Khinchin formula at c = 1. The engine simulates no queue; the correction vanishes only at one berth; and the model stated is the model run.")

# 16
x("In the Cosmetatos correction, (1 - rho)(c - 1)(sqrt(4 + 5c) - 2) / (16 rho c), what happens to the correction as the berths get busier at a fixed berth count?",
 "It shrinks, since (1 - rho) falls and rho sits in the denominator",
 ["It grows, since a busier base needs a larger correction to its wait",
  "It stays fixed, since the correction depends on the berths alone",
  "It turns negative once rho passes one half, pulling the wait down"],
 "As rho rises, the factor (1 - rho) falls and the denominator 16 rho c rises, so the correction shrinks and the M/D/c wait moves toward half the M/M/c wait. For rho below 1 and c at least 1 no term is negative, so the correction never pulls the wait below half.")

# 17
x("Across the cases the course runs, where does the engine's M/D/c wait sit against half the M/M/c wait on the same inputs?",
 "At or above half: exactly half at one berth, a little above it at two or three",
 ["Below half at every berth count, since constant service removes most of the wait",
  "Exactly half at every berth count, since the correction never changes the figure",
  "Above the whole M/M/c wait at three berths, since the correction grows with c"],
 "At one berth the correction is zero and the M/D/1 wait is half the M/M/1 wait (4.500000 against 9.000000). At two berths the Ekene ratio is 0.523812, and at three berths 0.552578 against 1.078652 is again a little over half. The correction is never negative, so the wait is never below half.")

# 18
x("Which formula gives the M/D/c wait at one berth, where the engine's approximation is exact?",
 "rho S / (2 (1 - rho)), the Pollaczek-Khinchin mean value formula for M/D/1",
 ["PiW S / (c (1 - rho)), eq. 5.3 of Adan and Resing, taken with c = 1 in it",
  "rho S / (1 - rho), the M/M/1 wait, since one berth leaves nothing to correct",
  "S / (2 (1 - rho)), the service over twice the idle share, with no rho on top"],
 "At one berth the correction vanishes and the wait is half the M/M/1 wait, rho S / (2 (1 - rho)): Adan and Resing, s. 7.6, eqs 7.14 to 7.16. On one berth at 0.900000 with a 1-hour service it gives 4.500000, as the engine returns. rho S / (1 - rho) is the M/M/1 wait, twice as long, and eq. 5.3 is the M/M/c formula.")

# 19
x("Asked for a general-service queue, a planner types M/G/c as the model. Which message comes back?",
 "model must be one of \"M/M/c\", \"M/D/c\"; got \"M/G/c\"",
 ["A result by the Pollaczek-Khinchin formula for a general service",
  "A result as M/M/c, the nearest model it offers, with a note",
  "model is not an accepted key; the accepted keys are the models"],
 "The engine offers two queue models and refuses any other by name, verbatim as the key shows; a call with no model is refused the same way, ending \"got nothing\". It maps no model to a neighbour and runs no general-service formula.")

# 20
x("A base's calls are much the same length every time. Which queue model sits closer to it, and which figure suits a plan that must not understate the wait?",
 "M/D/c sits closer; a plan that must not understate the wait can quote the M/M/c figure, model named",
 ["M/M/c sits closer, since any real call varies, and its figure is also the one that understates the wait",
  "M/D/c sits closer, and its figure is the safe one to quote, being the longer wait of the two models",
  "Neither model applies to calls of fixed length, so the engine refuses such a base as a matter of rule"],
 "Constant service is the D of M/D/c, so a base of like calls is closer to it; a real base sits between the two models. The M/D/c wait is the shorter (1.665786 hours against 3.180124 on the Ekene quay), so the M/M/c figure is the one that does not understate, quoted with its model named. The engine refuses no base for its service spread.")

# 21
x("A planner wants the Ekene quay's mean wait held to 0.3 hours or less. What does the berth search return under each queue model?",
 "4 berths under M/M/c at 0.068902 hours, and 3 under M/D/c at 0.259397",
 ["3 berths under both models, at 0.440347 and 0.259397 hours",
  "4 berths under both models, the M/D/c wait at four berths being lower still",
  "2 berths under M/D/c, its wait being about half the M/M/c one"],
 "Under M/M/c three berths wait 0.440347 hours, above the target, so the search goes on to four, which wait 0.068902. Under M/D/c three berths already wait 0.259397, inside it. Two berths wait 1.665786 hours as M/D/c, far above. The search runs the model the call states, and here the model changes the count.")

# ---- Weather and demand variability
# 22
x("How are the Ekene week's 20000 draws on seed 20260927 spread over whole vessels?",
 "2 vessels in 0.998600 of the draws and 3 in 0.001400, both estimates",
 ["2 vessels in every draw, since the plan at the modes needs 2 of them",
  "3 vessels in 0.085000 of the draws, the rest of the draws needing 2 vessels",
  "2 vessels in 0.500000 of the draws and 3 vessels in all the rest of them"],
 "Each draw rounds its vessel-days over 6.5 available days up to whole vessels: on seed 20260927 and 20000 draws, 0.998600 need 2 and 0.001400 need 3. 0.085000 is the AHTS dedicated run's probability short (seed 11, 5000 draws). The plan at the modes is one week, and the draws spread around it.")

# 23
x("Why do the Ekene week's sampled vessel-days come in steps, without spreading smoothly between them?",
 "Each draw rounds its voyages up to whole voyages, so the requirement moves a voyage at a time",
 ["The triangular inverse CDF returns only a few distinct values from the stream of uniform numbers",
  "Every vessel-day figure is rounded to a whole day before the draws are summarised",
  "The seed of 20260927 happens to fall on a pattern, and another seed would give a smooth spread"],
 "Every draw sizes the fleet as fleetSize does, with voyages rounded up, so the vessel-days jump by one voyage's days; in light weeks the minimum visits hold the count up. The triangular gives a continuous spread, no vessel-day figure is rounded to a day, and any seed shows the steps.")

# 24
x("A fleetVariability call runs the Ekene inputs for 1 draw on seed 0. What does the engine return, and what does it show?",
 "7.648544 vessel-days as the mean, the P90 and the P10 alike: one sized week that summarises nothing",
 ["10.345455 vessel-days, since one draw falls back on the plan at the modes of the week",
  "A refusal, since a Monte Carlo needs at least 2 draws to form a P90 and a P10 at all",
  "7.648544 vessel-days as the P90 and 10.345455 as the P10, the draw and the plan side by side"],
 "One draw is a single sized week: on seed 0 it returns 7.648544 vessel-days as its mean, P90 and P10. The draws run from 1 to 200000, so one draw is accepted; more draws steady an estimate and cost time. The plan at the modes is reported beside it and is no draw.")

# 25
x("With the weather alone varying (triangular 1, 1.2, 1.6; seed 3, 3000 draws), the engine's mean vessel-days come out above the plan at the modes. Why that direction?",
 "The triangular's long side runs up to 1.6, so its average lies above its mode of 1.2",
 ["The weather factor is drawn first, and the first draw of a stream always runs high on its seed",
  "A seed of 3 is a low seed, and low seeds give draws that sit above the mode of a triangular",
  "The demand factor, held at 1, is raised by the engine to match the weather"],
 "On seed 3 and 3000 draws the mean is 10.803806 against the plan's 10.345455. A triangular from 1 to 1.6 with its mode at 1.2 has its average above 1.2, so the sampled weeks run longer on average than the week at the mode. The draw order fixes which uniform number goes where and biases nothing; a fixed factor stays fixed.")

# 26
x("The Ekene inputs are run with 0 planned vessels (seed 9, 500 draws). What probability short does the engine return?",
 "1.000000, every draw short by its whole requirement, since there is no planned capacity",
 ["0.000000, since with no planned vessels no shortfall can be measured against a planned fleet",
  "A refusal, since the planned vessels must be at least 1 for the chance of being short to be measured",
  "0.001400, the Ekene week's figure, since the planned vessels do not enter the draws"],
 "The planned vessels run from 0 to 1000, so 0 is accepted; the planned capacity is then 0 vessel-days, and every draw needs more, so the engine returns a probability short of 1.000000 on seed 9 and 500 draws, each draw short by its whole requirement. 0.001400 is the two-vessel Ekene week on seed 20260927.")

# 27
x("A fleetVariability call asks for 200001 draws on the Ekene milk run. What does the engine return?",
 "Refused on iterations, since the draws run from 1 to 200000 and this is one over",
 ["A result on 200000 draws, the cap applied with a note of the trim in the basis",
  "iterations must be at most 181818 with 1 voyage set; got 200001",
  "A result on 200001 draws, since a milk run has only one voyage set to size in each draw"],
 "MAX_ITERATIONS is 200000, and the engine refuses 200001 by name, verbatim: \"iterations must be a whole number from 1 to 200000; got 200001\". The 181818 figure is the draws cap for 11 voyage sets; a milk run is one set, so the iterations cap binds first. The engine trims nothing to a cap.")

# 28
x("On seed 11 and 5000 draws, the AHTS on dedicated voyages is short in 0.085000 of its draws with 2 planned vessels. What does that say against the PSV milk run's 0.001400 on seed 20260927 and 20000 draws?",
 "The same two vessels leave a much thinner margin on the AHTS dedicated week, as estimates",
 ["The AHTS figure is the exact probability and the PSV figure only an estimate",
  "The two are equal once the draws are matched, since both plan 2 vessels",
  "The AHTS needs a third vessel in every week, since any shortfall means that"],
 "Both are seeded estimates on their own seeds and draws, and neither is graded. With the same 2 planned vessels, the AHTS on dedicated voyages is short far more often than the PSV milk run, a thinner margin; neither figure says a third vessel is needed every week, and matching draws would not make them equal.")

# ---- Readings and boundaries
# 29
x("Why does no capstone field in this course depend on one of the readings the engine states?",
 "Each capstone field is the same number under every reading and under the alternative named beside it",
 ["Capstones are graded with a tolerance wide enough to cover any change of reading",
  "The readings apply only to the Monte Carlo, and no capstone field is a sampled figure",
  "The capstones run the engine's alternative readings, so that learners cannot rely on them"],
 "The capstones were built so that every graded figure is identical under each reading the engine takes and under the alternative it names; the readings are taught with their alternatives and graded nowhere. Most readings act on voyages, fleets, decks and berth targets, far beyond the Monte Carlo, and the tolerance is set once for the course.")

# 30
x("Deck area and deck load share a utilisation of 0.500000 on a voyage. Which constraint does the engine name as binding, and on what footing?",
 "Deck area, the first in the stated order, by the engine's stated tie reading",
 ["Deck load, the last of the tied pair, since the heavier limit governs any tie",
  "Both at once, since a tie at twelve digits names every tied constraint",
  "Neither, since a tie leaves the voyage with no binding constraint at all"],
 "A binding tie at twelve significant digits goes to the first constraint in the order deck area, deck load, deadweight, then the tanks, so the engine names deck area. That is its stated reading; the alternative it names gives the tie to the last of the tied constraints, deck load here.")

# 31
x("A deck plan holds a unit that fills the usable deck of a voyage exactly. What does the engine do with it?",
 "Carries it: an exact fill fits, on the engine's stated reading, and nothing overflows",
 ["Lists it as overflow, since a unit must leave some room to be stowed safely on the deck",
  "Refuses the call, since a unit may not be as large as the usable area of the deck it sails on",
  "Lists it in neverFit, since it cannot share the voyage with any other unit"],
 "On the engine's reading an exact fill fits: on its exact-fit case 2 units are carried and 0 overflow. The alternative reads an exact fill as overflow. neverFit holds units larger than the usable area or heavier than the deck load, and a unit that fits an empty voyage is carried.")

# 32
x("When does the engine add \"(rounded down at the sixth decimal so that it is accepted)\" to a printed bound in a refusal?",
 "Only when the printed six-decimal figure differs from the exact bound",
 ["Every time it prints a bound, whether or not it moved the figure at all",
  "Only when the exact bound is a whole number, such as 20 arrivals a day",
  "Only when the arrivals typed were more than twice the exact bound itself"],
 "The note marks a moved figure. Where the true limit is 20, that limit is itself refused, so 19.999999 appears with the note; where it repeats, the usual six-decimal rounding would land above it, so the message moves down a step and says so. A limit that is already accepted at six decimals would print as it is, with no note.")

# 33
x("How does the five-server row of Adan and Resing's Table 5.1 check against itself, confirming the printed 1.53 as a slip?",
 "Eq. 5.3 on the row's own delay probability, 0.762493, gives 1.524986, and the printed 0.76 gives 1.52",
 ["Eq. 5.2 on the row's mean queue gives 1.53 exactly, so the slip is in the delay probability printed",
  "The row's delay probability is misprinted too, and the misprinted value gives the printed wait of 1.53",
  "The rows of Table 5.2 at five servers print 1.53 as well, which confirms the Table 5.1 figure"],
 "At a mean service of 1, eq. 5.3 divides the delay probability by five servers times the idle share of 0.1: 0.762493 gives 1.524986, and even the printed 0.76 gives 1.52. The row's delay probability rounds to the printed 0.76, and Table 5.2's five-server wait is 9.503169, printed 9.50.")

# 34
x("How does the course use Aas, Halskau and Wallace (Maritime Economics & Logistics 11(3), 302-325, 2009)?",
 "By concept only, since it is publisher copyright: deck cargo in m2 with no stacking, bulk in segregated tanks",
 ["By quoting its fleet-sizing example, whose printed vessel count the engine reproduces as a published check",
  "By table and equation, since it is CC BY 4.0 like Skoko et al. and the arXiv paper on M/D/c queues",
  "As the source of the queue models, from which the engine takes Erlang's C formula for the shore base"],
 "The paper is publisher copyright and was read as the accepted manuscript, so the course teaches its ideas by concept and quotes none of its prose. No openly readable paper printed a fleet-sizing example with a vessel count; the CC BY 4.0 texts are Skoko et al. and the arXiv paper, and Erlang's C formula comes from Adan and Resing and Iversen.")

# 35
x("A fleet call states a period of 7 days and 7.5 available days a vessel. What does the engine return?",
 "vesselAvailableDays must be at most periodDays (7); got 7.5",
 ["A result with the available days cut to 7 and a note of the cut",
  "A result on 7.5 available days, the extra half day spare",
  "periodDays must be a finite number above 0; got 7"],
 "Available days equal to the period are accepted and anything above it is refused by name, verbatim as the key shows: a vessel cannot be available for more days than the period holds. The engine trims nothing, and the period itself is valid.")

# ---- What the engine does not compute
# 36
x("Which names does the marine logistics engine export, in full?",
 "ACCEPTED_KEYS, ACTIVITIES, DEFAULTS, deckPlan, fleetSize, fleetVariability, shoreBase, voyagePlan",
 ["deckPlan, fleetSize, fleetVariability, shoreBase and voyagePlan, and no constants at all",
  "ACTIVITIES, DEFAULTS, deckPlan, fleetSize, npv, shoreBase, voyagePlan and a sampler of its own",
  "ACCEPTED_KEYS, DEFAULTS, deckPlan, fleetSize, shoreBase, voyagePlan and a schedule builder"],
 "The engine exports its five functions, the accepted keys of each, the three activities and the DEFAULTS that hold its caps and the tie rule. It computes no NPV, carries no sampler of its own and builds no schedule by the clock.")

# 37
x("What does every result the engine returns carry, so that its working can be printed?",
 "A basis block naming the rules it applied and the sources they come from",
 ["A confidence band around each figure, set by the stated usable deck fraction",
  "A timestamp and machine tag, so that two runs can be told apart later",
  "A list of the defaults it filled in for every input the call left out"],
 "Every result carries a basis naming its rules and where they come from, in the engine's own words; voyagePlan and fleetSize also return reasons, and a shoreBase target returns its own reason. It reads no clock, holds no figure for a missing input (a missing input is refused by name) and prints no confidence band.")

# 38
x("How many item lines may one deckPlan call carry, and what happens to a call with 501 of them?",
 "At most 500; the call is refused with \"items has 501 entries; the cap is 500\"",
 ["At most 2000, the units cap, so 501 lines are accepted and planned",
  "A plan of the first 500 lines, with the one line left over listed as overflow",
  "At most 500; the call is refused with \"voyages must be a whole number from 1 to 500; got 501\""],
 "MAX_ITEM_LINES is 500, and the engine refuses 501 lines in the words the key quotes. The 2000 cap counts units across all the lines, and the voyages cap, also 500, belongs to the voyages input. A refused call plans nothing, so no line is carried or listed as overflow.")

# 39
x("A deck foreman asks the engine whether a load can be stacked two high and lashed in lanes. What does the engine take in place of that?",
 "An area bound with the stated usable fraction and deck load, and no stacking or deck shape",
 ["Stacking factors for each item, stated on the line with its footprint and weight",
  "A lane plan built from the deck's length and width, packed by first-fit decreasing",
  "A stability check on the stated deadweight, with the centre of gravity of the load"],
 "The engine computes an area bound only: each unit's footprint against the deck area times the usable fraction, and its weight against the deck load. Stacking, deck shape, lanes and stability are the deck foreman's plan; an item carries only its id, name, length, width, weight and quantity.")

# 40
x("A planner adds a stowage factor to the deck terms of a deck plan call. What does the engine return?",
 "deck.stowageFactor is not an accepted key; the accepted keys of deck are name, areaM2, usableFraction, loadT",
 ["A plan with the usable area scaled by the stowage factor, the factor printed in the basis",
  "A plan that ignores the factor quietly, since the usable fraction already covers stowage",
  "deck.usableFraction must be a number above 0 and at most 1; got nothing, the factor read in its place"],
 "The engine holds no stowage factor: for the deck it takes an area bound with a stated usable fraction and deck load, and for bulk the user's net deadweight and stated densities. An unknown key is refused by name with the accepted keys, verbatim as the key shows; nothing is dropped quietly.")

# 41
x("The Ekene base waits 3.180124 hours as M/M/c. Which claim can a plan rest on that figure?",
 "That 2 berths give a steady-state mean wait of about three hours under M/M/c on the stated inputs",
 ["That a vessel arriving at dawn on Tuesday will be alongside a berth by the middle of the morning",
  "That no vessel at the base will ever wait longer than 3.180124 hours in the queue for a berth",
  "That the base will need no third berth in any week, whatever the arrivals turn out to be"],
 "A queue figure is a steady-state average of a stated model on stated inputs. It supports a berth count on those inputs; it is no timetable, no bound on any single wait and no forecast of a week's arrivals, since the engine plans no schedule by the clock.")

# 42
x("Which course of the academy owns supplier performance and contract management around the supply vessels?",
 "The contracts course, Contract & Supplier Management; this engine takes nothing on it",
 ["This course, whose fleet call scores each vessel operator on the voyages it delivered in the period",
  "The materials course, which rates suppliers by the spares they deliver on each voyage",
  "The uncertainty course, since supplier performance is a distribution to be sampled by Monte Carlo"],
 "Supplier performance and contract management are the subject of Contract & Supplier Management, and the engine takes no input for them. The materials course owns stock and spares; the uncertainty course owns Monte Carlo as a subject; the fleet call scores no operator.")

emit(Q, '/root/cat-wip-marine/banks/sc4a_exam.json', expect_n=42)
finish()
