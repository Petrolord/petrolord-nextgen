# The inverse probit is approximate

{{panel:cq-harm}}

Every probability the engine prints passes through one function, the standard normal CDF, and that function is an approximation. Forward, the approximation is far finer than anything this course grades. Run backwards, from a probability to a probit and then to a thermal dose or toxic load, the small error can grow. This lesson measures it and states the rule that follows.

## The forward direction

The engine's probability basis names its method, verbatim: "P = Phi(Y - 5), standard normal CDF (lib/stats normalCDF, Abramowitz and Stegun 7.1.26, |error| <= 1.5e-7)". The engine imports the repository's `normalCDF` and restates nothing. Forward, from a probit to a probability, the result is good to about 1.5e-7 in probability, which is why this course prints probabilities to six decimals and no further.

## The inverse, against the exact curve

The inverse bisects on that same approximate CDF. It finds the probit at which the approximation returns your probability, which is close to the exact probit and slightly off it. The golden records the exact probit for every Table 5.1 cell, computed by the oracle with an exact normal distribution. Against the engine:

| probability, stated | engine probit | exact probit, golden | difference, derived |
| --- | --- | --- | --- |
| 0.01 | 2.673653 | 2.673652 | 8.59e-7 |
| 0.1 | 3.718448 | 3.718448 | -3.91e-7 |
| 0.5 | 5.000000 | 5.000000 | -1.78e-14 |
| 0.9 | 6.281552 | 6.281552 | 3.91e-7 |
| 0.99 | 7.326347 | 7.326348 | -8.59e-7 |

At one half the two agree to the limit of the arithmetic. At one percent the engine's probit departs from the exact one in the seventh decimal, and the departure is symmetric: the same size at 0.99 with the opposite sign.

## How a small error grows

A departure in the seventh decimal of a probit is invisible on its own. It becomes visible when the probit is turned into an exposure measure, because the measure sits inside a logarithm with a coefficient b in front of it. Undoing that means dividing the probit error by b and exponentiating, and a toxic load can be a large number.

The engine's own example: for the lees-chlorine preset, the one percent toxic load is 149793.673220 by the engine, and the exact probit gives, derived, 149793.533322. The difference is 0.139897, on a number printed to six decimals. The last several of those printed digits carry no information. A figure printed that precisely looks exact, and here it is not.

## The rule

A thermal dose or toxic load read back from a probability is quoted to the figures the approximation supports, and this course never grades one. That includes a lethal dose for one percent or fifty percent computed through the inverse. Forward probabilities, and the graded quantities that run forward, are unaffected.

In a consequence note, write a read-back toxic load or thermal dose to a sensible number of figures and say it came from the approximate inverse. The six decimals the engine prints are its arithmetic; they overstate what the inverse knows.

## Exercise

On the harm panel's probit view, enter a probability of 0.01 and confirm the engine probit of 2.673653. Compare it with the exact 2.673652 in the table above and record the difference. Then write the sentence a consequence note would carry beside the lees-chlorine one percent toxic load of 149793.673220, stating how many of its figures you would quote and why.
