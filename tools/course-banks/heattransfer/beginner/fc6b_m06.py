import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# FC6 Associate m06, The Associate Reading. Written from digest.txt Section 6:
# the studio default case end to end with its self-consistency check, the loop
# and the seed ladder, the two trails, the figures on the screen that belong to
# later tiers, and what a reading is worth checking on.

q(1, "What makes the studio default case the one case in this course a reader can check outside the course?",
 "It is the case the Heat Exchanger and Cooling Studio opens with, so every figure in it is on a live screen.",
 ["It is the only case carried through every one of the doors of this module, so nothing in it has to be taken on trust.",
  "It is the case the golden file was written from, so a reader can check every line of it against the published rows.",
  "It is the case the capstone is set on, so a reader meets the same figures twice and can compare them."],
 "ORON and the published cases are worked here on the page. The studio case is worked on a screen as well, which is a second place to check it."),

q(3, "Multiply the studio coefficient of 92.110348 by the area required of 229.543151 ft2, by the correction factor of 1.000000 and by the log mean of 130.064846 degF. What is the figure, and what has been shown?",
 "2750000.0000 Btu an hour, which is the duty, so the four figures on the screen satisfy the equation the area came out of.",
 ["2750000.0000 Btu an hour, which is the duty, so the coefficient has been confirmed by a route independent of the one that produced it.",
  "2750000.0000 Btu an hour, which is the duty, so the tube count has been shown to have converged.",
  "A figure above the duty by the area overshoot, so the margin the rounding left is visible in the check itself."],
 "It is the same equation run backwards, which is exactly why it is useful: if four figures on a screen do not reproduce the duty, one of them has been left behind by an input that moved."),

q(0, "Why does that check use the area required rather than the actual area of 232.477856 ft2?",
 "Because the actual area is larger, having been rounded up, so multiplying it through gives more than the duty.",
 ["Because the actual area is a whole number of tubes multiplied out, and the check is defined on continuous figures.",
  "Because the actual area belongs to the bundle rather than to the balance, and the two are reported by different doors.",
  "Because the actual area carries the fouling allowance already, so using it would count the fouling twice."],
 "That is the overshoot arriving where you may not expect it. On this case it is 1.278498 percent, and the check would miss the duty by exactly that."),

q(2, "Which four links form the loop in this chain?",
 "The film needs a tube count, the count needs an area, the area needs the coefficient, and the coefficient needs the film.",
 ["The duty needs a driving force, the driving force needs an arrangement, the arrangement needs a count, and the count needs a duty.",
  "The area needs a log mean, the log mean needs the outlets, the outlets need a duty, and the duty needs an area.",
  "The count needs a bundle diameter, the bundle needs a shell, the shell needs a clearance, and the clearance needs a count."],
 "There is no first link, which is what makes it a loop rather than a line. The film needs how fast the fluid is going, and that depends on how many tubes it is shared between."),

q(3, "A circle of dependencies usually needs a solver. Why does this one settle under plain iteration?",
 "Because the map is a contraction, so a count that goes round once comes out closer to the answer than the one that went in.",
 ["Because the count is a whole number, so there are finitely many states available and the loop has to revisit one of them in the end.",
  "Because each pass raises the count, so the loop is monotone and stops at the first count that is large enough.",
  "Because the studio picks a seed close to the answer, so the loop has little distance to travel before it settles."],
 "No solver, no bisection and no derivative. The trail is worth watching settle, and the studio shows it."),

q(1, "The studio walks a seed ladder of 2, 12, 60 and 300 tubes rather than starting from a single count. What is the ladder for?",
 "A single seed can land in the band the film refuses to answer in, and a loop that cannot take its first step has no answer at all.",
 ["A single seed can be too far from the answer for the iteration to converge, and a ladder brackets the answer instead.",
  "A ladder lets the studio report how sensitive the converged count is to where the loop was started from.",
  "A ladder is how the module checks that the count is unique, since every rung has to arrive at the same answer."],
 "The film door has a band in which no correlation this module carries applies, and it says so rather than guessing. The first seed that evaluates is the one that starts the loop."),

q(2, "Every rung of the studio ladder is a multiple of 2 and every rung of ORON's ladder of 4, 24, 120 and 600 is a multiple of 4. Why?",
 "Because those are the pass counts, and a seed the pass count does not divide is a count the bundle cannot have.",
 ["Because a seed has to be a multiple of the tubes a pass, which on those two cases are 37 and 16.",
  "Because the ladder rungs are spaced by a factor that has to divide the pass count for the loop to be stable.",
  "Because the bundle constants are carried for 1, 2, 4 and 6 passes, so every seed has to be a multiple of one of those."],
 "The studio case runs 2 passes and ORON runs 4. A multi-pass bundle puts the same number of tubes in every pass, so a seed that does not divide equally is not a bundle."),

q(0, "What is the trail on the studio case, and how many passes of the loop did it take?",
 "2, 60, 72 and 74 tubes, converged in 4 passes.",
 ["2, 12, 60 and 300 tubes, converged in 4 passes.",
  "2, 60, 72, 74 and 74 tubes, converged in 5 passes, the last one repeating the answer.",
  "60, 72 and 74 tubes, converged in 3 passes, since the first rung is a seed rather than a step."],
 "The seed ladder is 2, 12, 60 and 300 tubes and the first rung evaluated, so the trail starts there. The converged count is 74 at 37 tubes a pass."),

q(1, "Read the studio trail as steps rather than as four numbers. What do the steps show, and why is no tolerance needed?",
 "The steps shrink, which is the contraction made visible, and the count is a whole number, so the loop lands on an answer and repeats it.",
 ["The steps shrink by a fixed ratio, which is the contraction factor, and the loop stops once that ratio is below the tolerance.",
  "The steps alternate in direction and shrink, so the answer is bracketed and the loop stops when the bracket closes.",
  "The steps shrink until the change is below one tube, at which point the count is rounded and the loop stops."],
 "From 2 to 60 is a long way, 60 to 72 much shorter and 72 to 74 shorter again. Then it stops, because the count it produced is the count it was given."),

q(0, "ORON runs the same chain on a four-pass bundle. What is its trail, and what does it end on?",
 "4, 56 and 64 tubes, converged in 3 passes, at 16 tubes a pass.",
 ["4, 24 and 64 tubes, converged in 3 passes, at 16 tubes a pass.",
  "4, 56, 64 and 64 tubes, converged in 4 passes, at 16 tubes a pass.",
  "4, 56 and 64 tubes, converged in 3 passes, at 37 tubes a pass."],
 "ORON needs 330.327560 ft2, one of its tubes carries 5.235988 ft2, and its 64 tubes carry 335.103216 ft2, which is 1.445734 percent above the surface asked for."),

q(3, "The studio screen also shows a Reynolds number of 44051.846000, a Prandtl number of 15.119375, a regime of turbulent and an inside film coefficient of 547.762384. What is a reader of this tier to do with them?",
 "Read them as real answers that the chain of this tier does not need, and meet them properly in the tier that assembles the coefficient.",
 ["Use the film coefficient in place of the overall coefficient, since the tube side is the term the surface is referred to.",
  "Treat them as diagnostics of the loop, since they are what the iteration is actually converging on rather than the count.",
  "Check them against the count, since a Reynolds number and a tube count are two statings of the same quantity."],
 "They are listed so the screen is not a surprise and so a reader can see where the next two tiers pick the story up. The chain of this tier runs without them."),

q(2, "The studio screen reports a controlling resistance of outsideFilm with insideFouling as its runner up and a margin of 51.612903 percent between them. What is that margin there for?",
 "It says how far the leading term leads the next one, so a one-word verdict is not read as though it were decided by a coin toss.",
 ["It says how much of the total resistance the leading term carries on its own, which is the thing that makes it the controlling one.",
  "It says how much the overall coefficient would improve if the leading term were taken out of the resistance stack entirely.",
  "It says how far the dirty coefficient sits below the clean one, which is what the fouling allowances cost."],
 "Naming the largest resistance is the point of assembling a coefficient from parts, because that is the term worth spending money on. The parts themselves belong to the next tier."),

q(0, "On the studio table of the reading, which figures were chosen by a person?",
 "The two mass flows, the two heat capacities, the hot outlet, the tube geometry and the passes.",
 ["The two capacity rates, the duty, the hot outlet and the passes, with everything below them computed.",
  "The two mass flows, the two heat capacities, the hot outlet and the correction factor of 1.000000.",
  "The two mass flows, the two heat capacities and the coefficient, with the hot outlet computed from the duty."],
 "Everything else was computed. The correction factor is one because the arrangement is counter, and that is the engine deciding rather than anybody typing."),

q(1, "Six figures in a reading are worth checking against another person's work. What do they have in common, and which figure is deliberately left off that list?",
 "All six are continuous, so a comparison has a middle and can be close. The tube count is left off, because a comparison on a whole number is exact or out by a whole tube.",
 ["All six come from a single door, so one call reproduces them. The bundle diameter is left off, because it is built from constants the module cannot source.",
  "All six are printed to six decimals, so a comparison is unambiguous. The duty is left off, because it is printed to four.",
  "All six are computed rather than chosen, so a disagreement is a real one. The coefficient is left off, because at this tier it is taken as given."],
 "The duty, the cold outlet, the log mean, the surface required, the surface of one tube and the margin are the six. The count is the thing to understand and the margin is the thing to compare."),

q(2, "A loop on some other case oscillates between two counts instead of settling. What does this tier say that tells you?",
 "Something about the case rather than about the arithmetic.",
 ["That the seed ladder was started on the wrong rung, and the next rung up will settle.",
  "That the film has landed in the band the module refuses, which is what an oscillation always means.",
  "That the tolerance on the loop is too tight for a count that rounds twice."],
 "A trail is a diagnostic as well as a demonstration. The loop is the one thing in this chain that cannot be understood a link at a time, which is why the tier ends on it."),
emit(Q, '/root/fc-wip-heattransfer/banks/fc6b_m06.json', expect_n=15)
finish()
