# The flood breaks Arps

A waterflood does not degrade an Arps fit. It invalidates it. The distinction matters because a degraded fit can be improved and an invalid one cannot, and the fit report looks the same either way. This lesson shows exactly what the flood does to the rate history, why no member of the Arps family can represent it, and what the optimizer produces instead when you ask it to try.

{{panel:dca-fit-explorer}}

## What the flood does to the rate

The Ekene response model is simple enough to work by hand, which is the point of using it. At the flood start on 2023-01-01 each producer's primary decline is frozen at whatever rate it had reached. Call that the base rate. Nothing happens for the well's response lag while injected water travels through the rock. Then gross liquid ramps linearly over six months to the base rate multiplied by the well's lift factor. After the ramp, the gross declines again at the flood's own constant. Later, if the well has a breakthrough date, water cut climbs and the oil stream separates from the gross.

Take Ekene-1. Its base rate on 2023-01-01 is 32.210476049246076 stb/d and its lift is 1.28, so the ramp should end at

$$32.210476049246076 \times 1.28 = 41.2294093430350 \text{ stb/d}$$

Its lag is 5 months and the ramp is 6, so the ramp ends 11 months after the flood start, on 2023-12-01. Open the fixture and the 2023-12-01 row reads 41.22940934303498 stb/d.

Stop and do that multiplication now. One base rate, one lift factor, and you have predicted a rate a year into the flood to fourteen digits. The response is not mysterious and it is not noise. It is a different model.

The rows in between tell the same story:

| date | Ekene-1 oil (stb/d) |
|---|---|
| 2022-12-01 | 33.4312717799524 |
| 2023-01-01 | 32.210476049246076 |
| 2023-06-01 | 32.210476049246076 |
| 2023-07-01 | 33.71363159821089 |
| 2023-09-01 | 36.71994269614053 |
| 2023-12-01 | 41.22940934303498 |

Six consecutive rows at exactly the same rate, then six rows climbing.

## Why no Arps curve can do this

Every member of the Arps family is strictly decreasing for $t > 0$. Differentiate the general hyperbolic and you get

$$\frac{dq}{dt} = -\frac{q_i D_i}{\left(1 + b D_i t\right)^{1 + 1/b}}$$

which is negative for every admissible $q_i > 0$, $D_i > 0$ and $b \geq 0$. There is no choice of parameters that produces a flat interval, and there is certainly none that produces a rise. This is not a question of fit quality. It is a structural impossibility, and it is why the honest description of a full-history Arps fit on these wells is "invalid", not "poor".

The physical reason is worth saying plainly. Arps describes a system spending stored energy. The flood adds energy. The base decline did not get better; a second drive was added on top of a frozen base, and the well now belongs to a different system.

## What the optimizer produces instead

Set the panel to Full history and Auto-Select and run all four producers. Compare each fit against the well's planted truth.

| Well | fitted qi | true qi | qi error | fitted Di | true Di | Di error | fitted b | true b | R2 | tier |
|---|---|---|---|---|---|---|---|---|---|---|
| Ekene-1 | 97.2058663778433 | 120 | -18.9951113517972% | 0.00196150586036441 | 0.0012 | +63.4588216970340% | 1.950000000000001 | 0 | 0.818388421218434 | Fair |
| Ekene-3 | 134.237029542021 | 150 | -10.5086469719862% | 0.00374899598601156 | 0.002 | +87.4497993005778% | 1.950000000000001 | 0.5 | 0.899873903499416 | Fair |
| Ekene-5 | 71.9031304250764 | 100 | -28.0968695749236% | 0.000538961863807783 | 0.0015 | -64.0692090794812% | 1.5000000000000007 | 1 | 0.732769191334589 | Poor |
| Ekene-6 | 87.9980156583808 | 90 | -2.22442704624358% | 0.000960001821405101 | 0.001 | -3.99981785948995% | 1.3500000000000005 | 0.35 | 0.780507944377468 | Poor |

Three things in that table are worth more than the rest.

**Ekene-6's row is the dangerous one.** Its fitted $q_i$ is within 2.3 percent of the planted 90 stb/d and its fitted $D_i$ is within 4.0 percent of the planted 0.001 per day. Two of the three parameters look like a competent fit. The third is wrong by nearly a factor of four, and the third is the one that sets the tail. A fit can be mostly right and completely useless, and reviewing the parameters one at a time will not catch it.

**Ekene-3 has the best R2 and one of the worst fits.** Its 0.899873903499416 is the highest of the four. Its $D_i$ is 87 percent too high and its $b$ is pinned at the ceiling. If you screened this portfolio by R2 and reviewed only the low scorers, Ekene-3 would pass.

**The $D_i$ errors do not even share a sign.** Ekene-1 and Ekene-3 come out too steep, Ekene-5 and Ekene-6 too shallow. There is no bias correction available, no rule of thumb, nothing to salvage. The parameters are not distorted versions of the truth. They describe a curve threaded between two different physical eras, and that curve is the truth of neither.

## The one mercy

None of the four naive fits reaches the Excellent band. Ekene-1 and Ekene-3 come back Fair and Ekene-5 and Ekene-6 come back Poor. When a flood runs long enough and hard enough, the quality tier does eventually notice. That is worth knowing and worth not relying on, because the tier only notices once the contamination is large. Lesson 5 of module 1 showed the same well passing at R2 0.9998 with only two contaminated rows in the window, and lesson 4 of this module shows a window still full of ramp certified Excellent at 0.953962147180947.

## The misconception to retire

"The flood improved the well's decline, so the fit should show a lower decline rate."

Two of the four fits do show a lower decline rate, and they are no more correct than the two that show a higher one. The flood did not change the primary decline at all; the model freezes it and multiplies it. What the optimizer reports is not a blend of the two regimes in any meaningful proportion. It is the single Arps curve that minimises squared error over a series with a break of behaviour in the middle, which has no physical referent at all.

## Exercise

Predict Ekene-6's ramp-end rate and ramp-end date before you look. Its base rate on 2023-01-01 is 42.698178934617005 stb/d, its lift is 1.35, its lag is 3 months and the ramp is 6 months. Multiply, add the months to the flood start, then open the panel or the rate table and check both. Then count how many consecutive rows Ekene-6 spends at exactly its base rate before it starts climbing, and confirm that the count is its lag plus the flood-start row itself, which is why Ekene-1 holds six flat rows on a lag of five. Finally, do the same prediction for Ekene-3, whose base is 36.18559446659539 stb/d, lift 1.25 and lag 6 months, and note which of the two wells shows the larger absolute rise and which shows the larger multiple.
