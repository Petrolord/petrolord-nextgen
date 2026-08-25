# The mudrock line

The simplest shear estimator is a straight line fitted to brine saturated clastics by Castagna and colleagues in 1985. It is still in daily use, and knowing its limits is more useful than knowing its coefficients.

## The relation

$$v_s = 0.8621 \, v_p - 1172.4$$

with both velocities in metres per second.

At the Ekene target velocity of 3000 m/s:

$$v_s = 0.8621 \times 3000 - 1172.4 = 2586.3 - 1172.4 = 1413.8999999999996 \ \mathrm{m/s}$$

One multiplication and one subtraction.

## What it is a fit to

A large set of brine saturated clastic rocks, shales and sands together, over a compressional velocity range roughly from 1500 to 4500 m/s.

Two words in that sentence carry all the limitations. Brine saturated means it does not describe a hydrocarbon bearing rock. Clastic means it does not describe a carbonate, and applying it to one gives an answer with no warning attached.

## The intercept is the tell

A line with a negative intercept cannot be right at low velocity. Set $v_p = 1360$ m/s and the mudrock line predicts a shear velocity of zero; below that it predicts a negative one.

A rock with zero shear velocity is a fluid. So the relation is describing a trend within a range and has no physical content at its ends, which is a good general warning about empirical fits: they are summaries of a dataset rather than statements about rock.

Within its range that is not a problem. It becomes a problem when somebody applies it to a slow, unconsolidated shallow sand at 1700 m/s, where it predicts 293 m/s and a velocity ratio of 5.8, which is not a rock anybody has logged.

## What it does not distinguish

Lithology. One line covers sands and shales together.

That is its main weakness and the reason the next lesson exists. A clean sand and a shale at the same compressional velocity have genuinely different shear velocities, because clay minerals have low shear stiffness relative to quartz. Collapsing them into one line puts a systematic error into any mixture.

At Ekene the difference matters: the lithology aware estimate at 3000 m/s is 1521.20 m/s and the mudrock line gives 1413.90, a gap of 107.30 m/s or 7.1 percent.

## When to use it anyway

Three cases, all legitimate.

When the lithology is genuinely unknown and no better information exists, a single line with a known bias beats a lithology specific relation applied to a guessed lithology.

When a quick check is wanted. It is one line of arithmetic and it will catch a shear log that is out by a factor of two.

And as a reference. Plotting a measured shear log against the mudrock line shows where the rock departs from the clastic trend, and those departures are informative: carbonates plot well above it, gas sands plot above it, and very clay rich rocks plot below.

That last use is the best one. The mudrock line is more valuable as a baseline to measure departures from than as a predictor.

## Worked example

Use the mudrock line as a diagnostic on the Ekene sand itself, which does have a measured shear log.

The measured point is 3200 m/s and 1800 m/s. The mudrock line at 3200 predicts $0.8621 \times 3200 - 1172.4 = 1586.32$ m/s.

The rock is 213.68 m/s faster in shear than the clastic brine trend, which is 13.5 percent.

That departure is worth interpreting rather than dismissing. A rock plotting above the mudrock line is stiffer in shear than a typical brine clastic, which points to a cleaner, better cemented sand than the average of the fitted dataset, and possibly to the 70/30 quartz rich composition the frame model assumes.

## Exercise

A shallow unconsolidated sand logs 1800 m/s compressional. Compute the mudrock line prediction for its shear velocity, and state whether you would use it.

Self check: $0.8621 \times 1800 - 1172.4 = 1551.78 - 1172.4 = 379.4$ m/s, which gives a velocity ratio of 4.7. That is at the extreme edge of what unconsolidated sediments show and the relation is being used far below the range it was fitted over, so the number should not be used for a substitution without other evidence.
