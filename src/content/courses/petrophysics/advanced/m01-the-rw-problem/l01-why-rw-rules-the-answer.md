# Why Rw rules the answer

You have carried the formation water resistivity $R_w$ through two whole tiers of this course as a given: 0.05 ohm.m, printed in the parameter block, never questioned. The Associate tier used it to book pay. The Professional tier validated the product $a R_w$ against the water leg with a Pickett fit. The Expert tier finally asks the question a reviewer will ask you in every real study: where did that number come from, and how do you know it is right?

## The sensitivity that earns Rw its own tier

Look at the Archie equation solved for water saturation with the course parameters $a = 1$, $m = 2$, $n = 2$:

$$S_w = \sqrt{\frac{a\,R_w}{\phi^m\,R_t}}$$

$R_w$ sits inside the square root, in the numerator. Every water saturation you compute scales as $\sqrt{R_w}$. Get $R_w$ wrong by a factor of two and every $S_w$ in the well is wrong by a factor of $\sqrt{2}$, about 41 percent. No other single parameter is at once this influential and this easy to get wrong: porosity comes from measured logs, $m$ was confirmed by the Pickett slope, but $R_w$ arrives from outside the well, on a lab report or a quicklook chain, carrying whatever errors it picked up on the way.

This module's case makes the point concrete. The lab measured the typewell's water sample at 0.114 ohm.m at 75 degF. The corrected value at formation temperature, which you will derive in module 2, is 0.0499 ohm.m. Those two numbers differ by a factor of 2.28, so using the raw value multiplies every saturation by

$$\sqrt{\frac{0.114}{0.0499}} = 1.5113$$

Half again more water, everywhere, from one skipped correction.

## Worked example

Take the mid SAND_A sample at 2020 m: density porosity $\phi_D = 0.2100$, deep resistivity $R_t = 9.2554$ ohm.m.

With the corrected $R_w = 0.049910$:

1. Denominator: $\phi^2 R_t = 0.2100^2 \times 9.2554 = 0.0441 \times 9.2554 = 0.4082$.
2. Ratio: $0.049910 / 0.4082 = 0.1223$.
3. Square root: $S_w = 0.3497$.

With the raw sample value $R_w = 0.114$:

1. Ratio: $0.114 / 0.4082 = 0.2793$.
2. Square root: $S_w = 0.5285$.

Check the scaling rule: $0.3497 \times 1.5113 = 0.5285$. Same rock, same logs, and the sample went from 35 percent water to 53 percent water on the strength of one uncorrected lab number.

## From saturation error to lost pay

A 0.18 shift in $S_w$ would be serious enough in a zone average. The cutoff machinery makes it worse. The course books pay with $S_w \le 0.6$: every sample is either in or out. At 2020 m both saturations still pass, but SAND_A carries samples that sit closer to the fence, and multiplying them by 1.5113 pushes some past it.

Run the whole Associate booking (density porosity, Larionov tertiary $V_{sh}$, Archie, standard cutoffs) both ways over SAND_A (2010 to 2030 m):

* Corrected $R_w$ (0.0499): net pay 18.0 m, pay-average $S_w$ 0.3609.
* Raw sample (0.114): net pay 16.5 m, pay-average $S_w$ 0.5303.

One and a half metres of net pay, 8 percent of the booking, vanished without touching a single log curve. And the damage is quiet: the run with the wrong $R_w$ produces perfectly plausible-looking numbers. Nothing flags them as wrong. Only knowing the right $R_w$ does.

## The Expert tier's answer

The defence against a quiet, plausible, wrong number is independent confirmation. This course triangulates $R_w$ three ways: the lab sample corrected to formation temperature, the SP log's quicklook conversion, and the Pickett fit you already own from the Professional tier. Three routes, three different failure modes, one number they must agree on. The rest of the course builds each route, checks their agreement, validates the winner in the water leg, and then quantifies exactly what the wrong choice would have cost.

## Exercise

A sample reads $\phi_D = 0.15$ and $R_t = 12$ ohm.m. Compute Archie $S_w$ with the corrected $R_w = 0.049910$ and with the raw 0.114, and state what happens at the 0.6 cutoff. Self-check: $\phi^2 R_t = 0.0225 \times 12 = 0.27$; corrected gives $\sqrt{0.049910/0.27} = 0.4300$, raw gives $\sqrt{0.114/0.27} = 0.6498$. The corrected value books the sample comfortably; the raw value pushes it past the cutoff and out of pay. Confirm the ratio: $0.4300 \times 1.5113 = 0.6499$, the scaling rule within rounding.
