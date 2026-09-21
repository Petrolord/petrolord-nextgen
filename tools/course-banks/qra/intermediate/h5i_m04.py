import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# H5 Professional m04: Criterion Lines.
# Digest sections 20 (F = C / N^alpha, the Dutch line, the Bevi points on it,
# corners decide everything) and 21 (where a curve exceeds, the worst ratio,
# a line with an upper end). The criterion side is published; the curve side
# is checked by self-consistency only.

q(3,
 "What are the constants of the engine's one line preset, vrom-establishments?",
 "C = 1e-3 and alpha = 2, from N = 10, with no upper end",
 ["C = 1e-3 and alpha = 1, from N = 1, with no upper end",
  "C = 0.01 and alpha = 1, from N = 1, as the R2P2 slope",
  "C = 1e-3 and alpha = 2, from N = 10, capped at N = 100"],
 "The course gives the preset as C = 1e-3, alpha = 2, from N = 10 with no upper end, citing Purple Book Figure 6.8 and Bevi article 13(1)(b). An alpha of 1 is the slope the course calls risk neutral, which the Dutch line does not use. C = 0.01 with alpha 1 is a line an analyst may supply through the R2P2 point, and it is no preset. The cap at N = 100 is a variant the course builds on purpose, and the preset has none.")

q(1,
 "On the Dutch line, what criterion frequency stands at the JISIKE corner N = 12?",
 "0.000006944444",
 ["0.000009700000","0.000010000000","0.000000625000"],
 "The line is 1e-3 over 12 squared, which the course shows as 0.000006944444 per year at that corner. 0.000009700000 is the curve's own F(12), the other side of the comparison. 0.000010000000 is the line at N = 10, where it starts. 0.000000625000 is the line at the next corner, N = 40.")

q(0,
 "Dividing the curve by the line at the first checked JISIKE corner gives which ratio?",
 "1.396800",
 ["2.720000","0.014910","18.000000"],
 "The ratio is F(12) of 0.000009700000 over the line's 0.000006944444, which the engine returns as 1.396800, so that corner EXCEEDS. 2.720000 is the ratio at N = 40 and 18.000000 the ratio at N = 300. 0.014910 is the worst ratio against a different criterion, the line of slope minus one an analyst supplies.")

q(2,
 "What state and worst ratio does the engine return for the JISIKE off-site curve against the Dutch line?",
 "EXCEEDS, worst ratio 18.000000 at N = 300.000000",
 ["EXCEEDS, worst ratio 2.720000 at N = 40.000000",
  "BELOW, worst ratio 0.001000 at N = 50.000000",
  "TOUCHES, worst ratio 1.000000 at N = 10.000000"],
 "The course shows state EXCEEDS with a worst ratio of 18.000000 at N = 300.000000, the largest of the three checked corners. 2.720000 at N = 40 is the worst only when the line is capped at N = 100, which pulls the last check back to N = 100. BELOW at 0.001000 is the curve against the R2P2 point. TOUCHES at 1.000000 is a curve built to sit on the line at N = 10.")

q(3,
 "Why does the engine compare the curve with a criterion line only at the curve's corners?",
 "F is flat on each step while the line falls with N, so the ratio on a step is largest at its right corner, which the curve attains.",
 ["Between corners the curve is undefined, so no ratio can be taken there, and the engine skips those stretches.",
  "The corners are where the published Bevi points sit, so they are the only places the line is known exactly.",
  "Checking every N would take too long, so the engine samples the corners as a fast approximation of the result."],
 "The course says corners decide everything: F is flat on each step and the line falls with N, so on each step the ratio of F to the line is largest at the right corner, which the curve attains, and the comparison is exact. The curve is defined everywhere as a step. The Bevi points sit at N of 10, 100 and 1000, which are not the JISIKE corners. Nothing here is an approximation.")

q(1,
 "Why is the JISIKE corner at N = 3 left out of the comparison with the Dutch line?",
 "It lies below the line's smallest N of 10, so it is outside the range the line covers",
 ["Its ratio is below one, so the engine drops it as a corner that cannot exceed the line",
  "Two scenarios share that corner, and a shared corner is compared only against a point",
  "Its frequency is the largest on the curve, so it is set aside as an outlier to the line"],
 "The course says the corner at N = 3 lies below the line's smallest N of 10 and is not checked, since the preset runs from N = 10. The engine checks every corner inside the range whatever its ratio. A shared corner is an ordinary corner. No corner is ever discarded as an outlier.")

q(0,
 "On the JISIKE step ending at N = 40, from what N does F lie above the Dutch line?",
 "24.253563",
 ["12.000000","10.153462","70.710678"],
 "On that step F is 0.000001700000, and the line falls to it at N = (1e-3 / F)^(1/2) = 24.253563, derived; that is larger than the previous corner of 12 and the line's smallest N of 10, so F lies above the line from 24.253563 to 40. 12.000000 is the previous corner, which the line is still above at this F. 10.153462 is the start of the exceeding range on the step ending at 12, and 70.710678 is the start on the step ending at 300.")

q(2,
 "The engine reports where on each exceeding step F lies above the line. Which rule sets the start of that range?",
 "The largest of the previous corner, the line's smallest N, and (C / F)^(1 / alpha), the N where the line falls to F",
 ["The previous corner of the curve alone, since the step begins there and F is flat along the whole of it",
  "The line's smallest N alone, since every exceeding step is taken to begin where the criterion begins",
  "The midpoint of the step, since the line crosses a flat step halfway between its two corners"],
 "The course states the rule as the largest of the three candidates, running to the corner itself. The previous corner alone would claim the step ending at 40 exceeds from 12, where the line still lies above F. The line's smallest N alone would start every range at 10. Nothing makes the crossing fall at a midpoint, since the line is a power law.")

q(3,
 "Between the corners at 3 and 12 deaths, at what N does the JISIKE curve first rise above the Dutch line?",
 "10.153462",
 ["10.000000","3.000000","24.253563"],
 "Solving 1e-3 / N^2 = 0.000009700000 puts the crossing at 10.153462, just past the start of the line, and the curve stays above until the corner at 12. At exactly 10.000000 the criterion is 0.000010000000, a shade higher than the curve. 3.000000 lies outside the Dutch range entirely. 24.253563 belongs to the step that follows.")

q(1,
 "On the JISIKE step ending at N = 300, where does the exceeding range begin?",
 "70.710678",
 ["40.000000","24.253563","100.000000"],
 "The toxic cloud alone holds this last step at 0.000000200000, and the power law meets that height at 70.710678, so the curve sits over the criterion from there to 300. At 40.000000 the criterion is 0.000000625000, well over the curve. 24.253563 is where the middle step crosses. 100.000000 is where a capped variant stops, and the preset is uncapped.")

q(0,
 "The same Dutch constants are given with an upper end at N = 100. What does the engine report at the top of the range?",
 "It evaluates F at N = 100 itself, ratio 2.000000, EXCEEDS",
 ["It stops at N = 40, the last corner inside the range, ratio 2.720000",
  "It evaluates the corner at N = 300 anyway, ratio 18.000000",
  "It refuses the line, since the curve runs past its upper end"],
 "With the line capped at N = 100, the corner at N = 300 is out of range, and the engine evaluates F at N = 100 itself, where the curve still has a step: ratio 2.000000, EXCEEDS. The corner at 40 is still checked at 2.720000, but it does not close the range. The corner at 300 is out of range. A curve that runs past the line's end is allowed.")

q(2,
 "What do the three Bevi values printed at N of 10, 100 and 1000 show about the Dutch line?",
 "They lie on it: 1e-5, 1e-7 and 1e-9 equal C / N^alpha with the engine's constants",
 ["They lie above it by a factor of ten, the margin Bevi adds for new establishments",
  "They fix a different line with alpha 1, which the engine keeps as a second preset",
  "They are the points where the JISIKE off-site curve crosses the line at each N"],
 "The course tables the printed Bevi values 1e-5, 1e-7 and 1e-9 beside C / N^alpha with the engine's constants, and they match, which is the published side the course can cite. No factor of ten separates them. The engine has one line preset, with alpha 2. The Bevi points are criterion values, and the JISIKE curve crosses the line elsewhere, as the exceeding ranges show.")

q(1,
 "What standing does the Dutch line have in this course, given that Bevi was repealed on 1 January 2024?",
 "A published comparison the analyst chooses to make, the successor to Bevi unread",
 ["A legal limit still in force, since the Purple Book figure outlives the repeal",
  "A line the engine updated to the successor regulation after the repeal came in",
  "A line no longer offered, since the engine drops any preset with a repealed source"],
 "The course says Bevi was repealed on 1 January 2024 and the engine did not read its successor, so the line is a published comparison the analyst chooses to make, and the engine reports a state against it. Bevi itself called the points an orientation value. The engine carries no successor values. The preset remains, with its repeal named in the source string.")

q(3,
 "An analyst supplies their own line with a slope exponent of 0. How does the comparison refuse it?",
 "criterion.exponentAlpha: must be above 0 (1 is risk neutral, 2 risk averse)",
 ["criterion: unknown preset 'r2p2-line'; one of vrom-establishments, r2p2-para-136, or give { constantC, exponentAlpha } or { points }",
  "scenarios[0].fatalities: 'fire' must have 0 or more fatalities (an expected number need not be whole)",
  "scenarios[0].name: every scenario needs a name"],
 "The refusal table gives this exact string for a line with no slope, naming criterion.exponentAlpha. The unknown preset message is what the same function returns for a name it does not define. The fatalities message is potentialLossOfLife refusing a negative N. The name message is fnCurve's refusal of a nameless scenario.")

q(0,
 "Against the Dutch line, how many of the JISIKE off-site corners inside the line's range exceed it?",
 "All three, at N of 12, 40 and 300",
 ["Two, at N of 40 and 300, since the corner at 12 sits under the line",
  "One, at N = 300, the corner with the worst ratio of the whole curve",
  "All four, since the corner at N = 3 exceeds by the largest ratio"],
 "The course's corner table marks EXCEEDS at 12 with ratio 1.396800, at 40 with 2.720000 and at 300 with 18.000000. The corner at 12 is above the line, since its ratio exceeds one. The worst ratio names one corner, which is not the count. The corner at N = 3 lies below the line's smallest N and is never checked.")

emit(Q, '/root/hse-wip-qra/banks/h5i_m04.json', expect_n=15)
finish()
