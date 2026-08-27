# b above one

The Weaver document's third example is a shale gas well, and it is the case in the whole fixture file that earns its place twice over. Case `ced-p03-004-shale-gas-hyperbolic`, p. 14: $q_i = 2500$ Mscf/d, $b = 1.2$, effective annual decline 0.65. Published at $t = 2$ years: $q = 876$ Mscf/d, and two cumulatives, 1014165 Mscf from the rate form and 1014083 Mscf from the time form.

It is armed for one reason the fixture states outright, and it teaches a second reason the fixture leaves to you.

## The branch that used to be inverted

The Arps rate-cumulative relation is

$$N_p = \frac{q_i^{\,b}}{D_i(1-b)}\left(q_i^{\,1-b} - q^{\,1-b}\right)$$

For $b < 1$ both factors are positive and nothing interesting happens. For $b > 1$ both factors flip. Work the numbers for this case and watch it happen. The nominal decline is $-\ln(1 - 0.65) = 1.04982212449868$ per year, which is 0.00287622499862651 per day. Then $q_i^{\,b} = 2500^{1.2}$, positive; $D_i(1-b)$ is negative because $1 - 1.2 = -0.2$; and $q_i^{\,1-b} - q^{\,1-b}$ is also negative, because raising to a negative power reverses the ordering and the larger rate gives the smaller value. Two negatives, one positive product.

A sign error in that denominator survives every self-consistency test in a DCA suite, because the fitter never evaluates the cumulative. It shows up the instant you point the code at a published $b > 1$ example, and this is that example. The fixture's `given.note` says so: "b > 1 exercises the (1-b) < 0 branch of the cumulative formula (the branch the pre-SC1 sign bug inverted)".

Engine numbers for the case. $q(2\text{ yr}) = 876.055628057918$ Mscf/d against the printed 876, inside the `rate_abs` of 0.5. The cumulative from that unrounded rate is 1014075.43193034 Mscf, a relative error of $7.46296867034133 \times 10^{-6}$ against the time form and an allowance of $5 \times 10^{-4}$.

## Two printed cumulatives, and what the gap is made of

The document prints 1014165 and 1014083 for the same volume and attributes the 82 Mscf spread to round-off of the 876 rate. The fixture takes the author at their word and compares against the time form, "whose inputs are unrounded". You can check the claim yourself, and you should, because it is a small model of every reconciliation you will ever do.

Push the **rounded** 876 through the cumulative and the engine returns 1014143.50535155 Mscf. That is 68.07342120993417 Mscf above the unrounded answer, and it lands between the two printed values, much nearer the rate form. So the author's explanation holds: the rate-form number carries the rounding of 876 and the time-form number does not. The 82 Mscf spread is arithmetic, not disagreement, and knowing which of two printed numbers to trust is a validation decision you make from the document's structure, not from which one is closer to your output.

## The thing the case teaches by implication: b > 1 has no ultimate

Here is the property that makes $b > 1$ a governance problem rather than a modelling preference. Ask the engine for the EUR of this well at successively lower economic limits.

| limit (Mscf/d) | $b = 0.9$ | $b = 1$ (harmonic) | $b = 1.2$ |
|---|---|---|---|
| 100 | 2392201.03133213 | 2797830.33872986 | 3927256.81730133 |
| 10 | 3687881.24529068 | 4799225.47827353 | 8766213.39271007 |
| 1 | 4717076.62241156 | 6800620.61781720 | 16435442.7276903 |
| 0.1 | 5534595.56950637 | 8802015.75736088 | 28590352.0921236 |

Read the columns, not the rows. At $b = 0.9$ the volumes converge: each factor-of-ten drop in the limit buys less than the last, and the column is walking toward a finite ceiling. At $b = 1$ each decade adds the same 2001395.1395436698 Mscf forever, which is the logarithm doing what logarithms do. At $b = 1.2$ each decade adds **more** than the last. There is no ultimate recovery in that column. There is only the volume implied by whatever limit you chose.

Put a time on it. This well reaches 100 Mscf/d after 36.9835258918630 years, which is a defensible field life. It reaches 10 Mscf/d after 597.936247555473 years. A $b = 1.2$ curve run to a low limit is not a forecast of a well, it is a statement about arithmetic.

## The misconception to retire: b above one is invalid

The easy conclusion is that $b > 1$ is an error, and the Professional tier's ceiling alarm reinforces the habit of treating a high $b$ as a symptom. That conclusion is too strong, and holding it will make you wrong about unconventional wells.

$b > 1$ is a legitimate description of transient flow. A hydraulically fractured shale well producing under linear transient flow into the fracture system genuinely traces a rate history steeper than harmonic early and flatter than harmonic later, and fitting it over that window genuinely returns $b$ above 1. Weaver's example is not a mistake. It is a shale gas well described honestly over two years.

The error is not the exponent. **The error is extrapolating a transient-flow exponent past the end of transient flow.** Every well eventually reaches boundary-dominated flow, where the drainage volume is fixed and the decline settles; the $b > 1$ curve never learns this, because nothing in the Arps form knows about boundaries. So a $b > 1$ fit is a valid description of a period and an invalid description of an ultimate, and the industry's answer is not to ban the exponent but to bound the forecast. Module 2 lesson 4 is that answer.

Two working rules follow. First, a $b > 1$ booking must always be quoted with its economic limit, because the limit is doing more work than the fit. Second, a $b > 1$ fit whose window extends well past the transient period is claiming something the physics does not support, and the window, not the number, is what you defend.

## Worked example: how much of the answer is the limit?

Ask what fraction of a stated EUR depends on the limit rather than on the data. At a 100 Mscf/d limit the booking is 3927256.81730133 Mscf. Drop the limit to 10 Mscf/d, a change of policy and not of physics, and it becomes 8766213.39271007 Mscf. The well more than doubles on a decision nobody logged as a reserves decision.

Do the same at $b = 0.9$: 2392201.03133213 rises to 3687881.24529068, a factor of 1.54. Stop and compute both ratios yourself, then say in one sentence which parameter your reserves number is most sensitive to. It is not $q_i$ and it is not $D_i$.

## Exercise

Using the Weaver shale gas parameters ($q_i = 2500$ Mscf/d, $b = 1.2$, $D_i = 0.00287622499862651$ per day), compute the EUR at a 500 Mscf/d limit and at a 250 Mscf/d limit, and report the incremental volume between them. Then compute the time in years at which the rate reaches each of those limits. Write two sentences: one stating how much of the incremental volume you would be willing to book, and one stating what additional information about the well you would need before booking any of it. There is no numerically correct answer to the second sentence, and there is exactly one honest one.
