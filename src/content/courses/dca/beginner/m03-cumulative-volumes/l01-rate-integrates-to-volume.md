# Rate integrates to volume

A decline curve is drawn in rate, but almost everything that matters about a well is settled in volume. Sales are volumes. Reserves are volumes. The material balance that the next course in this path runs on the Ekene field takes cumulative production as its input, not rate. So the second skill of decline analysis, right after recognising the shape of a decline, is turning a rate history into the volume it delivered.

## Area under the curve

Rate is volume per time. Ekene-1 produces in stock tank barrels per day, so one day at 120 stb/d delivers 120 stb, and any stretch of production delivers the area under its rate curve. If the rate were constant the area would be a rectangle and the arithmetic would be multiplication:

$$N_p = q \times t$$

A well flowing at exactly 100 stb/d for 30 days delivers 3000 stb. No decline, no subtlety.

But decline curves are not rectangles. The rate on the last day of a month is lower than on the first, so the true volume is the area under a falling curve, and multiplying any single rate by the elapsed time gets it wrong by construction. Which rate would you even choose? The first day's rate overstates the month. The last day's rate understates it. Some average is closer, but which average depends on the shape of the decline, and guessing it is not a method.

The honest answer is integration: add up the production of every instant. For the three Arps models this integral has been done once, symbolically, and the results are three closed forms. You will meet them in the next two lessons and use them for the rest of the course:

| Model | Rate | Cumulative |
|---|---|---|
| Exponential | $q = q_i e^{-D_i t}$ | $N_p = \dfrac{q_i}{D_i}\left(1 - e^{-D_i t}\right)$ |
| Harmonic | $q = \dfrac{q_i}{1 + D_i t}$ | $N_p = \dfrac{q_i}{D_i}\ln(1 + D_i t)$ |
| Hyperbolic | $q = \dfrac{q_i}{(1 + b D_i t)^{1/b}}$ | $N_p = \dfrac{q_i}{D_i(1-b)}\left(1 - (1 + b D_i t)^{1 - 1/b}\right)$ |

A closed form is exact. Feed it the same $q_i$, $D_i$ and $b$ that generated the rates, and the volume it returns is the true area under the curve, to the last decimal. That exactness is the standard everything else in this module is judged against.

## Units make or break this

Every formula above assumes $D_i$ and $t$ share a time unit. In this course $D_i$ is per day and $t$ is in days, because the fixture's rates are daily rates sampled monthly. Ekene-1 carries $D_i = 0.0012$ per day. If you ever mix a per-year decline with a time in days, the product $D_i t$ is wrong by a factor of 365 and the volume that comes out is not subtly wrong, it is absurd. Checking that $D_i t$ is dimensionless, a pure number, is a two second habit that catches the single most common cumulative error.

Notice also what the leading factor $q_i / D_i$ is: a rate divided by a per-day decline, which has units of volume. For Ekene-1 that is $120 / 0.0012 = 100000$ stb. Keep that number in mind; the next lesson shows it is not just a unit-keeping device but a physical ceiling.

## Worked example

Suppose a test separator holds a well at a constant 100 stb/d for 30 days before decline analysis even starts. The volume is the rectangle:

$$N_p = 100 \times 30 = 3000 \text{ stb}$$

Now let the well decline. Over the same 30 days a declining well that STARTS at 100 stb/d must deliver less than 3000 stb, because every day after the first flows below 100. That inequality, curve below rectangle, is the entire content of the closed forms: they tell you exactly how much less.

## Exercise

A well is held at a constant 80 stb/d for 92 days. Compute the delivered volume. Then answer without any formula: if the same well instead declined from 80 stb/d over those 92 days, would the delivered volume be larger or smaller than your rectangle, and why? State the unit check you would perform before trusting any $D_i t$ product you compute later in this module.
