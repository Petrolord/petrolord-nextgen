import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# SC3 Expert m05, Readings, Ties and Boundaries. Each reading is keyed as the
# engine's stated choice with the alternative it names, and never as the law.
# Every keyed figure and message is recomputed through the vendored engine by
# scratch/bank-advanced/witness.mjs on its golden input (crit-12-digit-key,
# qd-tie-exact, ins-tie-takes-fewer, abc-ties-by-id, ps-level-exactly-met,
# ps-level-just-above, eoq-q-exactly-half-of-multiple, sm-boundaries,
# ps-mean-at-cap, ps-refuse-mean-above-cap, ps-printed-bound-accepted,
# caplice-l11-ifr-95, caplice-l13-poisson-table, mil-hdbk-338b-lamps,
# harris-1913-example). No capstone figure appears.

K = [2, 0, 1, 3, 3, 1, 0, 2, 1, 3, 0, 2, 3, 0, 1]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("Three criticality weights of 33.3, 33.3 and 33.4 with a score of 7 out of 10 on each give a sum the computer holds a hair below 70. Against a V minimum of 70, what class does the engine return, and by which stated reading?",
 "Class V: two figures that agree to 12 significant digits tie, so the sum meets the minimum",
 ["The class below V: the stored sum sits under 70, and the engine compares the doubles exactly",
  "Class V: the engine rounds every weighted score to a whole number before any comparison",
  "No class: the weights add to 100 only approximately, so the criteria are refused by name"],
 "Compared at 12 significant digits, the stored sum reads as 70 and meets the V minimum; the engine's reason is T: weighted score 70 is at or above 70, the minimum for class V. Exact comparison of the doubles is the alternative it names; it rounds no score to a whole number; the weights pass within the stated tolerance of 1e-9.")

# 2
x("Under an all-units schedule two candidates, 100 and 200, both cost 200.000000 a year. What does the engine order, in its own words?",
 "order 100 at a total cost of 200 a year (band 0), the lowest of 2 candidates; tied on cost, the smaller quantity is taken",
 ["order 200 at a total cost of 200 a year (band 1), the lowest of 2 candidates; tied on cost, the larger quantity is taken",
  "order 150 at a total cost of 200 a year, the mean of 2 tied candidates, rounded by the stated rule",
  "breaks must offer a single cheapest candidate; 2 candidates tie at a total cost of 200 a year"],
 "The engine's stated reading takes the smaller quantity when two totals agree to 12 significant digits; the keyed reason is verbatim. The larger quantity is the alternative it names, which it does not take; it never averages candidates, and a tie is a result with a reason; it is no refusal.")

# 3
x("In a stated case built to tie on cost, 0 spares and 1 spare both total 365000.000000 a year. Which stock does the engine keep?",
 "0 spares: the stated reading takes fewer spares on a tie, and the reason shows the first spare adds and saves 230724",
 ["1 spare: the stated reading takes more spares on any tie, so that a failure never has to wait for its first spare",
  "2 spares: the engine breaks the tie by taking the largest number of spares searched",
  "Neither: the engine refuses a search whose two cheapest totals agree to 12 digits"],
 "A spares tie takes fewer spares, the engine's stated reading; its reason reads 0 spares: holding 0 a year against expected downtime 365000, total 365000, the lowest for 0 to 2; one more spare adds 230724 of holding and saves 230724 of downtime. More spares is the alternative it names; two spares cost more; a tie is no refusal.")

# 4
x("Items a and b each carry an annual usage value of 10.000000. How does the engine rank them, and what alternative does it name?",
 "a at rank 1 and b at rank 2, ties by id ascending; the alternative is id descending",
 ["b at rank 1 and a at rank 2, ties by id descending; the alternative is id ascending",
  "both at rank 1, sharing the rank; the alternative gives them the ranks 1 and 2",
  "whichever was listed first, at rank 1; the alternative ranks them by unit cost"],
 "The engine's words are ranked highest first (ties by id), ascending: a rank 1, b rank 2. Descending by id is the alternative it names. It gives no shared ranks, and it ranks by neither the order of listing nor unit cost; where tied items straddle a cut-off, the rank decides the class.")

# 5
x("A Poisson cycle-service target is stated as exactly the cumulative probability at level 1 with a mean of 1, to every digit the computer holds. Then it is raised to 0.7358. What levels does the engine return?",
 "Level 1 for the exact target, and level 2 for 0.7358",
 ["Level 2 for the exact target, and level 2 for 0.7358",
  "Level 1 for the exact target, and level 1 for 0.7358",
  "Level 0 for the exact target, and level 1 for 0.7358"],
 "A Poisson cycle-service target is met at or above it, the engine's stated reading: F(1) = 0.735759 meets the exact target, so the level is 1; 0.7358 is just above F(1), so the next level, 2, where F(2) = 0.919699. Met only strictly above is the alternative, which would move the exact case to 2; level 0 has F(0) = 0.367879.")

# 6
x("An EOQ of exactly 50.000000 is rounded to the nearest multiple of 100. What does the engine order, and which stated reading acts?",
 "100.000000: the nearest multiple takes halves upward",
 ["0.000000: the nearest multiple takes halves downward",
  "50.000000: a figure halfway between multiples stays put",
  "a refusal: a halfway figure has no single nearest multiple"],
 "The engine's reason is EOQ = sqrt(2 x 25 x 50 / 1) = 50; ordered as 100 (the nearest multiple of 100 (halves upward)), a relevant cost of 62.5 a year against 50 at the EOQ. Halves downward is the alternative it names, and here it would order nothing, which the engine refuses as a rule that orders nothing. No figure stays unrounded under a stated rule.")

# 7
x("Which pair of slow-moving edges does the engine apply, reading at the stated bands and a cover limit of 24 months?",
 "An item at exactly 12 months is slow, and exactly 24 months of cover is inside the limit",
 ["An item at exactly 12 months is still active, and exactly 24 months of cover is excess",
  "An item at 11.99 months is slow, and 25 months of cover is still inside the limit",
  "An item at exactly 12 months is slow, and exactly 24 months of cover is excess"],
 "A band minimum is reached at or above it, and excess is stock strictly above the cover limit: AT12 is slow, BELOW12 at 11.99 is active, COVER24 is inside and COVER25 is one unit excess. Each edge is the engine's stated reading, with reached only strictly above and at or above the limit as the alternatives it names.")

# 8
x("At a demand rate of 5 a period, a Poisson call with a lead time of 100 gives a mean of exactly 500. What happens there, and at a lead time of 100.5?",
 "At 100 the call is accepted with a level of 500; at 100.5 it is refused, since the mean would pass the cap of 500",
 ["At 100 the call is refused, since the mean must be below 500; at 100.5 the normal safety stock is computed",
  "Both are accepted, since the cap limits the level the engine returns and leaves the mean free",
  "Both are refused, since any Poisson mean of 500 or more is handed to the normal safety stock"],
 "The mean may reach 500 and no more: a mean of exactly 500 returns level 500, and a lead time of 100.5 is refused in the engine's words, leadTime must be at most 100 so that the mean demand demandRate x leadTime is at most 500; above that the normal safetyStock serves; got 100.5. The engine never switches to the normal method on its own.")

# 9
x("At a demand of 3 a period a Poisson lead time of 170 is refused with a largest accepted value of 166.666666. What happens when that printed figure is typed back?",
 "It is accepted and returns a level of 500, since the printed limit was rounded toward the accepted side",
 ["It is refused again, since 166.666666 times 3 still falls short of the exact cap of 500 that the engine holds",
  "It is refused again, since the engine asks for the limit to more decimals than it printed",
  "It is accepted, and the engine answers with the normal safety stock above a mean of 500"],
 "Where the largest accepted value has more than six decimals the engine prints it rounded down at the sixth decimal so that it is accepted, and says so; typed back, 166.666666 gives level 500. A figure below the cap is within it; the engine asks for no more decimals; it computes no normal stock inside a Poisson call.")

# 10
x("Caplice lecture 11 slide 24 prints a safety stock of 348 at an item fill rate of 0.95. What does the engine's fill-rate rule give on the same inputs?",
 "339.179604, 8.820396 below the print, with a safety factor of 1.314197",
 ["348, the printed figure, since the slide is a published check",
  "424.518354, the cycle-service safety stock that sits at 0.95 on that slide",
  "423.000000, the figure the two-decimal table reading of the slide gives"],
 "The fill-rate rule gives a safety factor of 1.314197 and a safety stock of 339.179604 (engine), 8.820396 below the print; at that stock the achieved fill rate is 0.950000. The other three rows of that column agree to within 2 units, so 348 is a slip, and the engine keeps its rule. 424.518354 and 423.000000 belong to the cycle-service column.")

# 11
x("Caplice lecture 13 slide 12 prints the expected units short beyond level 4 as 0.009. What does the recursion the same slide states give?",
 "0.001619: the loss at level 3, 0.010699, less one less 0.990920",
 ["0.009: the recursion and the print agree at the precision printed",
  "0.010699: the loss at level 3, which the print carries one row down",
  "0.007669: the probability at level 4 that the print reads in its place"],
 "L(4) = L(3) - (1 - F(3)) = 0.010699 less one less 0.990920, which gives 0.001619 (engine), and the printed 0.009 is the recursion's figure at no precision the slide uses: a slip. 0.010699 is the loss at level 3 and 0.007669 is the probability at level 4; neither is the loss at level 4.")

# 12
x("MIL-HDBK-338B prints 0.986 for the lamps where the engine gives 0.985612. How does the course read that difference?",
 "The same figure at three decimals, a rounding and no slip",
 ["A slip in the handbook, which the course lists with the lecture slips",
  "An error in the engine, which should return 0.986 to match the print",
  "A different mean, since the handbook reads its failure rate per day"],
 "0.985612 rounds to 0.986 at three decimals, so the handbook's figure is the engine's printed at lower precision: a rounding, and no slip. The two slips the course names are both in the MIT lectures; the engine never changes a rule to match a print; the handbook's rate is 0.001 failures per hour, and the mean is 0.500000 either way.")

# 13
x("Harris (1913) prints his first lot as 2,190. What does the engine return on his figures, and how does the course read the print?",
 "2190.890230: Harris prints each lot short of the formula's figure, and the engine keeps the rule",
 ["2,190 exactly: the engine rounds down to the printed lot so that the published check passes as printed",
  "2190.890230: the print is a slip in Harris's arithmetic, which the course lists beside the two lecture slips",
  "6856.626965: the engine reads his first example with the connector figures of his Figure II"],
 "The engine's EOQ on his first example is 2190.890230, and Harris prints 2,190: he prints each of his lots short of the formula's figure. The course calls that a habit of printing and no slip, and the engine never bends its rule to match. 6856.626965 is the EOQ of his Figure II connector, a different lot.")

# 14
x("What does the course say about the capstone fields and the readings the engine states?",
 "Every capstone field is the same number under each reading and under the alternative the engine names",
 ["Each capstone field is graded under the engine's readings, which the course treats as the law of the subject",
  "The capstone fields change under the alternatives, and the tolerance is widened so that it covers both",
  "The capstones grade the readings directly, with one field for each tie and each boundary"],
 "No graded figure depends on a reading: the course proves, field by field, that each is the same under every reading and its alternative. The readings are stated choices and are never presented as the law, no tolerance is widened, and no field grades a tie or an edge.")

# 15
x("Why do some of the engine's edges include the boundary and others exclude it?",
 "Each rule states its own edge in its own words (at or above, at or below, above), and none is global",
 ["Every edge includes the boundary, and a strict edge appears only where a figure is rounded by a stated rule",
  "An edge is inclusive where the stated figure is a target to meet, and strict where it is a limit to pass",
  "The edge follows the tier: Associate rules include the boundary and Expert rules exclude it"],
 "No single principle sorts the edges; each rule states its own. A class minimum and a band's starting month are met at or above. Under at-or-below an ABC cut-off is a limit, yet a cumulative share exactly on 80 stays A, and a Poisson fill-rate level is met when its expected units short are at or below what the target allows, so a limit can be inclusive. Excess cover counts only above its limit, and a lead-time demand equal to the reorder point is met. The engine prints those words in its reasons; no edge depends on rounding or on the tier.")

emit(Q, '/root/cat-wip-materials/banks/sc3a_m05.json', expect_n=15)
finish()
