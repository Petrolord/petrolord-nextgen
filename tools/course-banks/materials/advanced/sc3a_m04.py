import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# SC3 Expert m04, Stockouts and the Reorder Point. Constant-input keys
# (ltr-constant-demand-equal-to-stock, ltr-constant-demand-above-stock,
# ltr-one-iteration) are certain: every draw is the same, so no seed moves
# them. The seal's sampled figures are keyed only as estimates with their seed
# and draw count and are never graded. Every keyed figure and message is
# recomputed through the vendored engine by scratch/bank-advanced/witness.mjs
# (also ltr-ekene-mech-seal, ltr-no-service-level, ltr-lead-time-only,
# ltr-refuse-service-level, ltr-refuse-reorder-negative). No capstone figure
# appears.

K = [1, 3, 0, 2, 2, 0, 3, 1, 0, 2, 3, 1, 0, 3, 2]
_i = iter(K)
def x(p, c, ds, e): q(next(_i), p, c, ds, e)

# 1
x("A constant demand of 2 a day over a constant 10 days meets a reorder point of 20, on 50 draws and seed 1. What does the engine's reason say?",
 "0 of 50 draws have a lead-time demand above the reorder point 20: a stockout probability of 0 a cycle",
 ["50 of 50 draws have a lead-time demand at the reorder point 20: a stockout probability of 1 a cycle",
  "25 of 50 draws have a lead-time demand above the reorder point 20, half the cycles on a tie",
  "leadTimeDays must be a triangular distribution { min, mode, max }; got 10 as a constant"],
 "A stockout is a lead-time demand above the reorder point, and a demand equal to it is met: every draw is exactly 20, so the engine counts none, in the keyed words. Counting equality as a stockout is the alternative it names, which the engine does not apply; no tie is split; a constant is accepted as a plain number.")

# 2
x("The same constant case is run with a reorder point of 19.5. What does the engine return?",
 "Every draw a stockout, 50 of 50, each 0.500000 short, a stockout probability of 1 a cycle",
 ["No stockout at all, since 19.5 rounds to the 20 the draws need over the lead time",
  "A stockout in half the draws, since 19.5 sits halfway between two whole units of stock",
  "A refusal, since a reorder point must be a whole number of units whenever demand is constant"],
 "Each draw has a lead-time demand of 20, which is 0.500000 above 19.5, so all 50 draws run short and the reason reads 50 of 50 draws above the reorder point 19.5: a stockout probability of 1 a cycle. The engine rounds no reorder point, splits no draws, and accepts any stated point at or above 0.")

# 3
x("Which reading does the engine state for a lead-time demand exactly equal to the reorder point, and what alternative does it name?",
 "It is met; the alternative counts equality as a stockout",
 ["It is a stockout; the alternative counts equality as met",
  "It counts half a stockout; the alternative counts a whole one",
  "It is met for whole units; a fraction counts as a stockout"],
 "The engine's reading is that a lead-time demand equal to the reorder point is met, and the alternative it names counts equality as a stockout. On constant inputs the choice is the whole answer, 0 against 1; with sampled inputs a draw almost never lands exactly on the point. No half counting or special rule for fractions exists.")

# 4
x("When a cycle service level is stated, how does the engine find the reorder point for it among the sampled lead-time demands?",
 "It sorts the draws and reads the one at index ceil(level x draws) - 1, the smallest that at least that share of draws does not exceed",
 ["It adds k times the sampled standard deviation to the sampled mean of the lead-time demand, with k from the inverse normal",
  "It reads the P90 of the lead-time demand, the figure that is met or exceeded in 90 percent of all the draws it made",
  "It raises the stated reorder point one unit at a time until the counted stockouts fall below the share the target allows"],
 "The engine reads the sorted lead-time demand at index ceil(0.95 x n) - 1 for a level of 0.95: the smallest draw that at least 95 percent of draws do not exceed. A mean plus k sigma is the normal safety stock of the Professional tier; the P90 is the low figure; the engine searches no stated point unit by unit.")

# 5
x("Which reorder point would meet a cycle service level of 0.95 for the mechanical seal, as the engine estimates it on seed 20270301 and 20000 draws?",
 "An estimate of 3.062282 seals, while the stated 3 achieves a sampled cycle service of 0.941400",
 ["Exactly 3 seals, since the stated point was set to meet 0.95 and achieves it on these same draws",
  "An estimate of 2.780743 seals, the P10, while the stated 3 achieves a cycle service of 0.95 exactly",
  "An estimate of 1.986608 seals, the mean, while the stated 3 achieves 0.058600 of service"],
 "On that seed and draw count the sorted draw for 0.95 is 3.062282 seals, and the stated point of 3 gives a sampled cycle service of 0.941400: just short of the target. Both are estimates and neither is graded. 2.780743 is the P10 and 1.986608 the mean of the lead-time demand; 0.058600 is the stockout probability.")

# 6
x("The reorder point for a cycle service level is the engine's stated reading at one sorted index. What alternative does the engine name for it?",
 "One sorted draw higher, a difference of one draw that lies well inside the noise of any seed",
 ["Taking the mean of the two sorted draws either side of the index, at the exact halfway point",
  "The same index read on the demand draws alone, with the lead time held fixed at its stated mode",
  "The largest draw of the run, so that no cycle at all in the sample runs out of stock"],
 "The engine's words are reorderPointForService is the sorted lead-time demand at index ceil(0.95 x n) - 1, and the alternative it names is one sorted draw higher. No averaging, no fixed lead time and no maximum enters either reading; the course states the reading so a learner can reproduce the figure exactly.")

# 7
x("A lead-time risk call on the seal states no cycle service level. What happens to the reorder point for a cycle service level?",
 "It comes back as none, and the service line of the basis says: no serviceLevel stated",
 ["The call is refused, since serviceLevel is a required input of every lead-time risk call",
  "It is read at a cycle service level of 0.95, the level the Ekene case happens to state",
  "It is set to the stated reorder point of 3, and the stockout count is left out of the result"],
 "The cycle service level is the one optional input of the call: left out, the reorder point for a cycle service level is none and the basis says no serviceLevel stated, while the stockout count on the stated reorder point of 3 is unchanged. Nothing is refused, no level is borrowed, and the count is still returned.")

# 8
x("What does the engine return when a lead-time risk call states a cycle service level of 1?",
 "serviceLevel must be a number strictly between 0 and 1; got 1",
 ["the largest sampled lead-time demand, the only point that no draw exceeds",
  "serviceLevel must be a number from 0 to 1; got 1",
  "a reorder point of none, as if no cycle service level had been stated"],
 "A cycle service level of 1 would need a point above every possible draw, and the engine refuses it by name; the keyed message is its own words. It returns no maximum and no none on a refused input, and the range it states is strict at both ends.")

# 9
x("Can a reorder point of -1 be stated for the seal, and what comes back?",
 "No: it is refused by name, since a reorder point is stock on hand and cannot fall below 0",
 ["reorderPoint must be a finite number above 0; got -1",
  "a result in which every draw with any demand at all counts as a stockout",
  "a result with the reorder point read as 0, the lowest stock there can be"],
 "A reorder point is stock on hand and cannot be negative, so the engine refuses -1 in its own words: reorderPoint must be a finite number at or above 0; got -1. A reorder point of 0 is accepted (at or above 0), and then any draw with demand is a stockout, but -1 returns no result and is never clipped to 0.")

# 10
x("A case holds the demand constant at 1.5 a day and samples the lead time, 5000 draws on seed 42. How does the engine's sampling line mark the constant?",
 "per iteration a uniform for the lead time then one for the demand rate (constant: no draw)",
 ["per iteration a uniform for the lead time only; the demand rate is fixed once in the header",
  "per iteration a uniform for the demand rate (constant: 1.5) then one for the lead time",
  "per iteration two uniforms, the second one discarded because the demand rate is fixed"],
 "The basis keeps the stated order and names the constant: per iteration a uniform for the lead time then one for the demand rate (constant: no draw). A constant spends no uniform, and nothing is drawn and thrown away; the lead time still comes first and the constant is marked in place.")

# 11
x("A lead-time risk call runs exactly one draw (seed 0). What does the engine print for the lead-time demand's P90 and P10?",
 "9.768001 for both, since that one draw is every percentile",
 ["9.768001 for the P90 and none for the P10, which needs ten draws",
  "a refusal, since one draw cannot be sorted into any percentiles",
  "the triangle's minimum for the P90 and its maximum for the P10"],
 "With a single draw the sorted list has one value, so the P90, P10 and every other figure are that draw: 9.768001 (engine), and one draw leaves no spread to read. The draw count runs from 1, so one draw is accepted; no percentile is left empty; the triangle's ends are no draws.")

# 12
x("At the stated reorder point of 3, what share of the seal's cycles runs without a stockout, estimated on seed 20270301 and 20000 draws?",
 "0.941400, an estimate: one less the sampled stockout probability of 0.058600",
 ["0.950000, the stated target, which the engine returns for any stated point",
  "0.058600, the share of the draws that the stated reorder point of 3 covers fully",
  "0.969295, the service a reorder point held up to a whole seal achieves"],
 "The cycle service level is the share of draws with no stockout, one less 0.058600: 0.941400 on that seed and those draws, an estimate that is not graded. 0.95 is the stated target for the reorder point for a cycle service level; 0.058600 is the stockout probability itself; 0.969295 is a Professional figure for the choke beans.")

# 13
x("The engine holds one demand rate for a whole lead time. What does that stated choice do to the sampled lead-time demand?",
 "A high rate is never offset by a quiet day within the same lead time, which widens the spread of the lead-time demand",
 ["A fresh rate for each day would widen the spread of the lead-time demand, so holding one rate for the whole lead time narrows it",
  "It makes the lead-time demand equal the mean demand over the lead time in every single draw of the whole run",
  "It lets the busy days and the quiet days offset each other within each lead time drawn, as a daily draw would do"],
 "One rate a lead time means a busy spell stays busy until the order lands, so extreme lead-time demands stay in; a fresh draw every day, the alternative, would let quiet days offset busy ones and narrow the spread. The demand still varies from draw to draw.")

# 14
x("The seal could also be stocked with the normal safety stock of the Professional tier. What does the lead-time Monte Carlo keep that a normal curve would lose?",
 "The skew of the stated triangles",
 ["The stated seed of the normal run",
  "A fill rate for the seal as its target",
  "Each graded reorder point of the case"],
 "The Monte Carlo reads the stated triangles directly, and both lean right, so it keeps their skew; a normal curve is symmetric. The normal safety stock is closed form and takes no seed; a fill rate is a target either tool may be given; nothing sampled is graded.")

# 15
x("The seal's reason prints \"a stockout probability of 0.0586 a cycle\" while the field reads 0.058600. Why the difference?",
 "Inside a message a computed probability prints to six decimals with its trailing zeros dropped",
 ["The reason is rounded to four decimals, while the field keeps all six decimals of the estimate",
  "Two samples differ: the field is computed on 20000 draws and the reason on the first 2000",
  "The reason prints a percentage in place of a probability, and the field a fraction"],
 "The print rule inside a message is money to the cent and a computed quantity, factor or probability to six decimal places with trailing zeros dropped, so 0.058600 prints as 0.0586. Both come from the same 20000 draws on seed 20270301; neither is a percentage; no four-decimal rounding is applied.")

emit(Q, '/root/cat-wip-materials/banks/sc3a_m04.json', expect_n=15)
finish()
