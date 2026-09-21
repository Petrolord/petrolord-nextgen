import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# carbon Expert m02, The marginal abatement cost curve. Digest SECTION 20
# (carbonAbatement.abatementCurve on the six invented AGBOR measures: the rank,
# the steps, the weighted average, the measures that pay for themselves) and
# the SECTION 26 line the m02 lessons quote. Every figure is invented for this
# course; money is in US dollars. 15 questions.

q(1, "On the curve built from the six invented AGBOR measures, which measure is order 2?",
 "Repair failed steam traps, at -156.4390 USD a tonne",
 ["Tune the fired heaters, at -167.4364 USD a tonne",
  "Solar for purchased power, at 45.8573 USD a tonne",
  "Heat integration project, at -14.2492 USD a tonne, with its 3400.000 t"],
 "SECTION 20's second row is Repair failed steam traps, costed at -156.4390 USD a tonne; the first row is Tune the fired heaters, and Solar sits fifth.")

q(3, "What sets a measure's order on the Agbor curve?",
 "Its cost per tonne, cheapest first",
 ["Its tonnes a year, largest first",
  "The order it was entered in SECTION 18's table",
  "Its capital cost, the smallest capital first"],
 "SECTION 20: the six measures ranked cheapest first. Flare gas recovery has the largest tonnes, 6200.000, and is order 6. Vapour recovery on the storage tanks is entered sixth and is order 4. The Heat integration project, with 2750000 USD of capital, is order 3 ahead of Vapour recovery at 610000 USD.")

q(0, "Where does the invented Heat integration project's step start and end on the Agbor curve's axis?",
 "From 1910.000 t to 5310.000 t",
 ["From 760.000 t to 1910.000 t, after the heaters",
  "From 5310.000 t to 7160.000 t, as order 4",
  "From 0.000 t to 3400.000 t, as the first step"],
 "SECTION 20 prints the Heat integration project, order 3, with cumulative start 1910.000 t and cumulative end 5310.000 t; its width is its 3400.000 t a year. 760.000 to 1910.000 is Repair failed steam traps and 5310.000 to 7160.000 is Vapour recovery on the storage tanks.")

q(2, "The Agbor curve prints weightedAverageCostPerTonne 18.7868 USD. How does SECTION 20 define that figure?",
 "netAnnualCostOfAll over totalAbatementTonnes",
 ["The mean of the six costs per tonne, each counted once",
  "netAnnualCostOfAll over paysForItselfTonnes, 5310.000 t",
  "The middle step's cost per tonne"],
 "SECTION 20: the weighted average is the net annual cost of all the measures over the total tonnes, 290443.84 USD over 15460.000 t. The mean of the six costs per tonne, each counted once, is -29.7913 USD (computed here).")

q(2, "SECTION 20 computes a plain mean of the six Agbor costs per tonne, -29.7913 USD. What does the digest say that plain mean does?",
 "It weights a small measure the same as a large one.",
 ["It counts the heater measures twice, as they share a source.",
  "It leaves the three measures that pay for themselves out of it.",
  "It sums the net annual costs to four decimals before dividing."],
 "SECTION 20: the plain mean of the six costs per tonne (computed here) is -29.7913 USD, which weights a small measure the same as a large one. The four-decimal sum belongs to the rounding note on netAnnualCostOfAll, and the plain mean takes in all six costs.")

q(0, "The six net annual costs as SECTION 18 prints them sum to 290443.85 USD, while the curve prints netAnnualCostOfAll 290443.84 USD. What does the rounding note say the engine does?",
 "It sums the net annual costs it holds to four decimals.",
 ["It drops one cent for the measure that is refused.",
  "It removes the heater overlap before it sums the costs.",
  "It rounds each cost per tonne before weighting the six."],
 "SECTION 20's ROUNDING NOTE: the six net annual costs as printed in SECTION 18 sum to 290443.85 USD; the engine sums the net annual costs it holds to four decimals, which gives 290443.84 USD. No measure is refused on this curve, and the overlap is surfaced as additive false.")

q(3, "The Agbor curve prints paysForItselfTonnes 5310.000. Which figure on the step table carries the same value?",
 "The cumulative end of order 3, the Heat integration project",
 ["The cumulative end of order 2, Repair failed steam traps, 1910.000 t",
  "The tonnes a year of the Heat integration project, 3400.000 t",
  "The cumulative start of order 6, Flare gas recovery, 9260.000 t"],
 "SECTION 20 prints order 3, the Heat integration project, with cumulative end 5310.000 t, and paysForItselfTonnes 5310.000 with paysForItselfMeasures naming orders 1 to 3. The other options carry 1910.000, 3400.000 and 9260.000 t.")

q(1, "The Agbor curve prints additive false. Which entry in SECTION 20 goes with that flag?",
 "An interaction table naming heaters: Tune the fired heaters and the Heat integration project",
 ["An over-claims entry naming the flare: Flare gas recovery claiming more than it emits",
  "A refusedMeasures entry naming the Heat integration project, whose capital was blank",
  "A paysForItselfMeasures entry naming Tune the fired heaters and Repair failed steam traps"],
 "SECTION 20 prints the interaction table, heaters: Tune the fired heaters; Heat integration project, with the note that the abatements of measures acting on the same source overlap. The costed curve carries no refused measure, over-claims belong to the 9400 t claim of SECTION 21, and paysForItselfMeasures names three measures.")

q(0, "Which of these does SECTION 26 list as recomputed by neither oracle?",
 "paysForItselfTonnes on the curve",
 ["the curve's rank order",
  "each measure's levelised cost per tonne",
  "the path's year-by-year abated tonnes"],
 "SECTION 26 lists paysForItselfTonnes as recomputed by neither oracle. oracle_carbonabatement.py takes the curve by explicit rank, each cost per tonne from a present value ledger and the path as a year ledger.")

q(3, "SECTION 20 prints 0.343467 beside the Agbor curve's outputs. What is it?",
 "paysForItselfTonnes as a share of totalAbatementTonnes, computed by the digest",
 ["Flare gas recovery's share of the axis, returned by the engine with the curve",
  "The weighted average cost per tonne over the plain mean, computed by the digest",
  "The capital recovery factor of the Heat integration project at a rate of 0.1"],
 "SECTION 20: paysForItselfTonnes as a share of totalAbatementTonnes (computed here), 0.343467. The Heat integration project's capital recovery factor is 0.13147378 (SECTION 18), and the digest prints no share for Flare gas recovery and no ratio of the two averages.")

q(2, "The invented Flare gas recovery abates 6200.000 t a year. Which order does the Agbor curve give it, and where does its step start?",
 "Order 6, starting at 9260.000 t",
 ["Order 1, starting at 0.000 t",
  "Order 4, starting at 5310.000 t",
  "Order 6, starting at 7160.000 t"],
 "SECTION 20 prints Flare gas recovery as order 6 at 78.1002 USD a tonne, cumulative start 9260.000 t and end 15460.000 t. 7160.000 t is where order 5, Solar for purchased power, starts, and 5310.000 t is the start of order 4.")

q(1, "On the Agbor step chart, what does the height of a step show?",
 "The measure's cost per tonne in US dollars",
 ["The measure's tonnes abated a year",
  "The measure's capital cost in US dollars",
  "The measure's cumulative end on the axis"],
 "SECTION 20: each step's width is its tonnes a year and its height its cost per tonne; the steps tile the axis from 0. The cumulative end is where a step stops along the width axis.")

q(3, "Which pair gives the Agbor curve's weighted average and the digest's plain mean, in that order?",
 "18.7868 and -29.7913 USD a tonne",
 ["-29.7913 and 18.7868 USD a tonne",
  "18.7868 USD a tonne and 0.343467",
  "290443.84 USD and -29.7913 USD a tonne"],
 "18.7868 USD is the engine's weightedAverageCostPerTonne; -29.7913 USD is the digest's own plain mean, computed here. 290443.84 USD is a money total and 0.343467 a share of tonnes.")

q(0, "Where does the first step of the Agbor curve start, and which measure is it?",
 "At 0.000 t, Tune the fired heaters",
 ["At 0.000 t, Repair failed steam traps",
  "At 760.000 t, Tune the fired heaters",
  "At 0.000 t, Flare gas recovery"],
 "SECTION 20: the steps tile the axis from 0, and order 1 is Tune the fired heaters, cumulative start 0.000 and end 760.000 t, at -167.4364 USD a tonne. Repair failed steam traps is order 2 from 760.000 t, and Flare gas recovery is order 6.")

q(1, "Which two measures sit either side of zero on the Agbor curve, as orders 3 and 4?",
 "Heat integration project at -14.2492 and Vapour recovery on the storage tanks at 35.4193",
 ["Repair failed steam traps at -156.4390 and Heat integration project at -14.2492",
  "Heat integration project at -14.2492 and Solar for purchased power at 45.8573",
  "Vapour recovery on the storage tanks at 35.4193 and Solar for purchased power at 45.8573"],
 "Read SECTION 20's order column: 3 is the Heat integration project, the last negative step, and 4 is Vapour recovery on the storage tanks, the first positive one.")

emit(Q, '/root/wt-et-carbon-nextgen/tools/course-banks/carbon/advanced/cefa_m02.json', expect_n=15)
finish()
