import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC6 Associate m05, The Surface and the Tubes. Written from digest.txt
# Sections 4 and 5: the surface out of three numbers, the clean and the dirty
# coefficient, the two refusals on the area door, the surface of one tube, the
# two roundings and the overshoot that is always positive.

q(1, "What goes into the surface an exchanger needs, and what does not?",
 "The duty divided by the coefficient, the correction factor and the log mean. No geometry, no fluid and no allowance beyond those.",
 ["The duty divided by the coefficient and the log mean, with the correction factor applied afterwards to the tube count.",
  "The duty divided by the coefficient, the correction factor, the log mean and the capacity ratio of the smaller stream to the larger one.",
  "The duty divided by the clean coefficient and the log mean, with the fouling allowances added to the surface as a margin."],
 "On the studio case that is 2750000.0000 Btu an hour over a coefficient of 92.110348, a correction factor of 1.000000 and a log mean of 130.064846 degF, which is 229.543151 ft2."),

q(0, "An area comes off the screen at half what you expected. What does the form of the expression tell you about where to look?",
 "There are exactly four places, because the area is proportional to the duty and inversely proportional to each of the other three, so an error in any one arrives in the area unchanged.",
 ["There is one place, the coefficient, because it is the only figure in the expression a person did not compute.",
  "There are four places, but an error in the log mean is damped by the logarithm inside it and so arrives smaller than it started.",
  "There is no way to tell from the expression, because the four figures were produced by four doors and any of them may carry a compounded error."],
 "No averaging, no damping and nothing in the expression to absorb an error. Three of the four can be checked independently by reopening the doors that produced them."),

q(2, "The studio case is sized on its clean coefficient of 134.459410 and on its dirty coefficient of 92.110348 Btu an hour per ft2 per degF. What two areas come out, and which one is bought?",
 "157.246707 ft2 clean and 229.543151 ft2 dirty, and the dirty one is bought.",
 ["157.246707 ft2 clean and 229.543151 ft2 dirty, and the clean one is bought, with the dirty figure kept as a check.",
  "229.543151 ft2 clean and 157.246707 ft2 dirty, and the dirty one is bought because it is the smaller.",
  "157.246707 ft2 clean and 232.477856 ft2 dirty, and the dirty one is bought."],
 "The larger coefficient asks for the smaller surface. The exchanger has to do its duty when it is dirty, so a unit sized on 157.246707 ft2 would fall short as soon as anything settled on a tube."),

q(3, "What is the clean coefficient good for, if the surface is bought on the dirty one?",
 "It says what the machine can do at its best, which is what a performance check on a freshly cleaned unit is compared against.",
 ["It is the figure a fabricator works to, because a new exchanger is clean on the day it is built.",
  "It sets the two fouling allowances, since a pair of allowances is chosen to hold a fixed ratio between the clean figure and the dirty one.",
  "It bounds the error in the dirty figure, because the true coefficient of a running unit lies between the two."],
 "The difference between the two is two allowances a person chose, which makes the dirty coefficient and every area out of it a number with a judgement inside it. Write the allowances down beside the area."),

q(0, "The area door is given a coefficient of 0. What comes back?",
 "A refusal naming the coefficient: the area needs a positive overall coefficient, and it was 0 Btu/hr.ft2.F.",
 ["An area of zero, since nothing passes through a surface that carries no coefficient at all.",
  "A refusal naming the duty, because a zero coefficient is only reachable when the duty behind it was zero too.",
  "The clean area instead, since a coefficient of zero is read as an instruction to size the unit before fouling."],
 "That is a division by zero waiting to happen, and an infinite surface is not an answer anybody can act on."),

q(1, "The area door is given a correction factor of 1.000001. What happens, and why is the band closed at one?",
 "It refuses and quotes the value back, because a factor above one would say an arrangement beats counter-current flow at the same terminals.",
 ["It refuses and quotes the value back, because a correction factor is only ever read off a published chart and no such chart runs above one.",
  "It rounds the figure to 1.000000 and answers, because the difference is below the precision this course prints at.",
  "It answers and attaches a note, because a factor slightly above one is within the tolerance the module declares."],
 "Refusing at a millionth over the boundary looks fussy until you remember what a factor slightly above one would do to a surface, which is to make it slightly too small for a reason nobody would ever find."),

q(2, "How is the surface of one tube formed?",
 "Pi times the outside diameter times the length, with the diameter divided by twelve because it is given in inches and the length in feet.",
 ["Pi times the mean of the inside and the outside diameter times the length, which is the surface that the wall term of the coefficient is referred to.",
  "Pi times the outside diameter squared times the length over four, which is the volume the tube encloses divided by the bore that carries the flow.",
  "Pi times the inside diameter times the length, because the tube-side fluid is what the surface is there to carry."],
 "There is no judgement anywhere in this step. There is no correlation, no exponent and no fitted constant, so if the diameter and the length are right then the figure is right."),

q(3, "The seven tube-count cases in this course show only two per-tube surfaces, 3.141593 and 5.235988 ft2. What does that tell you?",
 "Something about the cases rather than about the engine, since each was set up on one of two tube sizes.",
 ["That the module carries two tube sizes and refuses any other, which is why every case lands on one of them.",
  "That a per-tube surface is quantised by the bundle constants, which carry two sizes across their four pass counts.",
  "That the duty decides the tube size, and these seven duties fall into two bands."],
 "A per-tube surface is fixed the moment a diameter and a length are chosen, and nothing about the duty, the streams or the coefficient reaches it."),

q(0, "Why must the diameter in the per-tube surface be the outside diameter?",
 "Because the area being divided is an outside tube surface, which follows from the coefficient it came from being referred to the outside tube surface.",
 ["Because the outside surface is the larger of the two, so using it is the conservative choice at this step.",
  "Because the tube-side film is computed on the bore, and the two would be counted twice if the bore were used here as well.",
  "Because the bundle constants are written against outside diameters, so a count formed on the bore would not fit the layout."],
 "Use an inside diameter by mistake and the per-tube surface comes out smaller, so the count comes out larger. The error is quiet, because a larger count looks conservative rather than wrong."),

q(1, "The first of the two roundings takes the count up to a whole tube rather than to the nearest one. Why up?",
 "Because a count rounded down gives a bundle whose surface is below the surface the duty asked for, so the unit would be short of duty by construction.",
 ["Because the second rounding can only ever lift the count further, so a count rounded down at the first step would be lifted back by the second one anyway.",
  "Because a fraction of a tube is always taken up to a whole tube in this module, in exactly the way that a fraction of a pass is taken up to a whole pass.",
  "Because rounding to the nearest whole tube would make the overshoot negative on about half of all cases, and a negative margin is not something this module reports."],
 "Rounding up can only give more surface than was needed. On the studio case the area over one tube rounds up to 74."),

q(2, "The second rounding takes the count up to a whole multiple of the pass count. What does it buy beyond a bundle that can be built?",
 "A count that can be fed back into the tube-side film, because a count the passes do not divide has no tubes a pass to compute a velocity from.",
 ["A count that divides into the bundle constants, which this module carries for 1, 2, 4 and 6 tube passes and for no other number of passes at all.",
  "A count whose overshoot comes out positive, which is something that the first of the two roundings cannot guarantee on its own on any given case at all.",
  "A count that matches the golden file, which is written at whole multiples of the pass count on every one of the published cases this course carries."],
 "On the studio case the passes are 2 and the count is 74, so 37 tubes go in each pass. On ORON the passes are 4 and the count is 64, so 16 go in each."),

q(3, "On the studio case the area over one tube rounds up to 74 and the engine returns 74 tubes in 2 passes. What does that row show about the second rounding?",
 "That it had nothing to do on this row, since 2 divides 74 already, so the row cannot show you the second rounding at all.",
 ["That it moved the count up from the unrounded figure to 74, which is why the tubes a pass come out at 37.",
  "That it ran first here, because a count that the passes divide is rounded to the passes before it is rounded to a whole tube.",
  "That it is applied only where the pass count is above two, which is why ORON shows it and the studio case does not."],
 "Published case 3 is a row where it does show. At 1200.000000 ft2 on tubes of 5.235988 ft2 in 4 passes the count comes out at 232, at 58 a pass, and only the second rounding moved it."),

q(0, "The studio case asks for 229.543151 ft2 and its 74 tubes carry 232.477856 ft2, an overshoot of 1.278498 percent. Why can that percentage never be negative?",
 "Because both roundings go up, so the count sits at or above the unrounded figure and the actual area sits at or above the area asked for.",
 ["Because the module reports the overshoot as an absolute value, so the sign carries no information.",
  "Because the area asked for is itself a rounded figure, and the rounding in it is always downward.",
  "Because a negative margin would be refused by the tube count door before the answer was assembled."],
 "An overshoot of zero needs the unrounded figure to be a whole number that the pass count divides, which is rare. Every figure in that column of the seven cases is positive."),

q(1, "Published case 2 has 638 tubes at an overshoot of 0.216806 percent and published case 4 has 274 tubes at 0.092603 percent. What does that pair rule out?",
 "That a larger bundle always overshoots less, since here the smaller bundle overshot less.",
 ["That the first of the two roundings is what sets the margin, since both of those rows are two-pass bundles.",
  "That the overshoot depends on the pass count, since both of those rows are two-pass bundles.",
  "That the two roundings are independent, since a single rounding would have put these two rows in order."],
 "Where the overshoot lands depends on where the fraction fell. Read the column as seven separate answers and do not divide one by another."),

q(2, "Why does this tier check the rounding through the margin rather than through the tube count?",
 "Because a count is a whole number, so a check on it is exact or out by a whole tube, while the margin moves the instant either rounding moves the count.",
 ["Because the count is the figure the engine computes last, so an error anywhere upstream reaches the margin first.",
  "Because two different counts can produce the same margin, which makes the margin the wider of the two checks.",
  "Because the margin is reported to six decimals and a count is reported as a whole number, so the margin carries more digits."],
 "A margin that comes out right cannot have been reached with a wrong count. The reverse does not hold, because two different unrounded figures can round to the same count, so a matching count leaves you none the wiser."),
emit(Q, '/root/fc-wip-heattransfer/banks/fc6b_m05.json', expect_n=15)
finish()
