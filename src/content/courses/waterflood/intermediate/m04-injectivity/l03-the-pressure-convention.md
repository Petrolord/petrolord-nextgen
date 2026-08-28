# The pressure convention

This is the most important lesson in the tier, and it is about a subtraction. The same injection history, the same engine, the same thresholds, run twice with two defensible readings of "pressure", give a diagnostic that finds a thirty percent injectivity loss and a diagnostic that raises no alarm at all.

## The two runs

**Run one: absolute wellhead pressure.** Integrate $p$ as measured, roughly 2050 to 2250 psia.

**Run two: pressure above the reference.** Integrate $p - 2050$, the driving pressure.

| | absolute | above reference |
|---|---|---|
| Ekene-2 baseline slope | 18.95998132427112 | 2.0000000000000004 |
| Ekene-2 recent slope | 19.613050810491938 | 2.0000000000000004 |
| Ekene-2 ratio | 1.0344446270832983 | 1 |
| Ekene-4 baseline slope | 27.439971986406658 | 2.0000000000000013 |
| Ekene-4 recent slope | 29.276719072880777 | 2.857142857142859 |
| **Ekene-4 ratio** | **1.0669369155108472** | **1.4285714285714286** |
| injectivity alerts raised | **0** | **1** |

The alert threshold is 1.2. The absolute run produces 1.067 and stays silent. The above-reference run produces 1.4285714285714286 and names the well.

## Why the absolute run is diluted

Write the slope out. With $p = 2050 + q/II$:

$$\frac{dI}{dW} = \frac{p}{q} = \frac{2050}{q} + \frac{1}{II}$$

The information about injectivity is entirely in the second term. The first term is a large constant divided by the rate, and it dominates. Ekene-4 injects at an average of 78.44325711868179 barrels per day over the first third of the record, so

$$\frac{2050}{78.44325711868179} = 26.133540030068165 \qquad \text{against} \qquad \frac{1}{II} = 2$$

The injectivity term is about seven percent of the slope and the reference term is the other ninety three.

Now degrade the well. $1/II$ goes from 2 to 2.857142857142859, an increase of 0.857142857142859, while the reference term stays near 26 because the rate barely changes. A change of 0.857 on a total of about 28 is a three percent move in the pointwise slope. The engine's least squares fit over thirds reports 1.0669369155108472, a little larger than that because a fit to the integral is not the mean of the pointwise slopes, and either way it is nowhere near the 1.2 threshold.

The physical change is 42.85714285714286 percent. The diagnostic sees under seven percent, because a constant that carries most of the slope does not move when the injectivity does.

## Which is right

The classical Hall analysis assumes the integrated pressure is the pressure DRIVING flow, that is, the difference between the injection pressure and the reservoir pressure the well is pushing against. Under that definition, run two is the correct one and run one is a misapplication.

In the field the situation is less tidy, because the reservoir pressure at the injector is not measured continuously and is itself changing. Common practice covers three variants: subtract a constant estimate of reservoir pressure, subtract a time-varying estimate from a material balance track, or integrate the absolute pressure and accept the dilution.

All three appear in real work. What is not acceptable is not knowing which one produced the number in front of you.

## How to tell which you are looking at

Two checks that take a minute.

**Check the magnitude.** A Hall slope should be of the order of $1/II$. If a well's injectivity index is around 0.5 and its Hall slope reads 27, the plot is on absolute pressure and roughly 25 of that 27 is the reference term.

**Check the intercept.** Fit the Hall curve and look at where it starts. An absolute-pressure Hall plot has a large positive intercept; an above-reference one starts near the origin.

## The general lesson

A diagnostic threshold is only meaningful together with the definition of the quantity it thresholds. The 1.2 threshold in this engine was calibrated for a slope ratio on driving pressure. Feeding it a slope ratio on absolute pressure does not make it a conservative threshold; it makes it the wrong threshold, and it fails in the direction of silence.

That is the worst direction. A diagnostic that shouts spuriously gets investigated and fixed. A diagnostic that stays quiet gets trusted.

## What Ekene-4 actually did

Between the two runs, the fact of the matter does not change. Ekene-4's injectivity index fell from 0.5 to 0.35 on 2025-01-01, a loss of thirty percent, and it maintained its injection volume by raising its wellhead pressure. The volume ledger shows nothing. One reading of the pressure data shows nothing. The other recovers the planted parameter exactly.

## The misconception to avoid

"Both conventions are defensible, so either answer is acceptable." Both conventions are defensible; the answers are not equally good. One recovers a thirty percent physical change and one hides it under a constant. Defensible means you can explain what you did, not that the result is fit for purpose. Explain what you did AND check whether the signal survived it.

## Exercise

First, using $p = 2050 + q/II$ with $II = 0.5$ and Ekene-2's average rate of 126.85174379772998 barrels per day, compute the absolute Hall slope and the above-reference Hall slope, and express the reference term as a fraction of the total. Compare that fraction with the 0.93 computed above for Ekene-4 and explain why the two wells differ.

Second, at what injection rate would the absolute-pressure Hall ratio for Ekene-4's degradation reach the 1.2 alert threshold? Interpret your answer physically: what kind of field would the absolute convention work on?
