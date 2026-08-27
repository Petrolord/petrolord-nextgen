# Monte Carlo, honestly

Every graded uncertainty value in this course is a closed form. That is a deliberate choice, and this lesson explains it properly rather than leaving you to assume Monte Carlo was omitted for simplicity. Monte Carlo is a real tool with a real job. It is also, in this repository and in a great many others, not a source of auditable numbers.

## What sampling is actually for

Use Monte Carlo when the quantity you care about is a nonlinear function of several uncertain inputs, those inputs are correlated, and no closed form exists for the output distribution.

EUR qualifies on the first count. Look at the hyperbolic rate-cumulative relation and notice that $q_i$, $D_i$, $b$ and the economic limit enter through powers and reciprocals. Feeding a distribution of $b$ into it does not give you a recognisable distribution of EUR. It qualifies on the second count too: $q_i$ and $D_i$ come out of the same regression line, so an error that lifts the intercept tends to steepen the slope. They are strongly correlated by construction, and no formula in module 3 reports that correlation.

That is the honest use case. You have several dependent uncertainties, you can describe their joint behaviour, and you want the distribution of a nonlinear output. Sampling answers that when algebra will not.

The Ekene triangle is not that case. It has one uncertain quantity, a closed-form CDF, and a closed-form inverse. Sampling it would be a slower way of getting a worse version of an answer you can write down exactly.

## What the repository's implementation actually does

Read `engines/dca/monteCarlo.js` before you cite it, because the details matter.

`generateNormalRandom` builds a standard normal by the Box-Muller transform from two calls to `Math.random()`. `generateUniformRandom` calls `Math.random()` directly. Neither takes a seed, and nothing in the module accepts one. JavaScript's `Math.random()` has no seeding facility at all, so two runs of the same simulation on the same inputs return different numbers, and there is no argument you can pass to change that.

`sampleArpsParameters` then draws $q_i$, $D_i$ and $b$ **independently**, treating each confidence-interval half-width as two standard deviations, so the sampled standard deviation is the half-width divided by 2. It clamps $q_i$ and $D_i$ at zero and $b$ into the range 0 to 2. `runMonteCarloSimulation` also samples the economic limit uniformly across plus or minus 20 percent of its base value, generates a forecast per iteration on a 30-day step, and reports quantiles by sorting the EUR results and indexing at `floor(0.1n)`, `floor(0.5n)` and `floor(0.9n)`, with the low index labelled p90 in the petroleum convention.

Three consequences follow, and all three are worth saying aloud.

First, the independence assumption contradicts the geometry that produced the intervals. Drawing $q_i$ and $D_i$ independently when they are anticorrelated in the fit overstates some outcomes and understates others in a way no iteration count repairs.

Second, the $b$ draw inherits the placeholder. Module 3 established that the reported $b$ half-width is `b * 0.10`, a hard-coded constant. Sampling from it produces a distribution of the parameter with the most reserves leverage, built from a number with no data in it.

Third, and decisively for this course, the output is not reproducible. A graded field needs the same answer every time it is computed, and an unseeded sampler cannot provide one.

## Worked example: how much does a sampled quantile wobble?

You do not have to guess at the run-to-run scatter, because the sampling error of an empirical quantile has a closed form. For a target probability $p$, a sample of size $n$, and a density $f$ evaluated at the true quantile $x_p$,

$$\mathrm{SE}(\hat{x}_p) = \frac{1}{f(x_p)}\sqrt{\frac{p(1-p)}{n}}$$

Apply it to the Ekene triangle at the P90, where $p = 0.10$. The triangular density at 420425.025054486 stb is on the rising branch, $2(x-a)/[(b-a)(m-a)]$, which evaluates to 0.00000494743045255836 per stb. Then:

| Iterations | SE of the sampled P90 (stb) |
|---|---|
| 100 | 6063.75375817294 |
| 1000 | 1917.52730462323 |
| 10000 | 606.375375817294 |
| 100000 | 191.752730462323 |

The engine's default is 1000 iterations. At that setting one standard error on the sampled P90 is 1917.52730462323 stb, which is 0.958763652311616 of the 2000 stb tolerance the Expert capstone allows on that field. Treating the sampling error as approximately normal, that puts the tolerance at 1.04300991969080 standard errors, so 0.296943698531788 of runs would land outside it on sampling noise alone, with the model, the inputs and the code all perfectly correct. Getting the standard error down to 500 stb needs 14707.6438559026 iterations, and down to 100 stb needs 367691.096397564.

The inverse CDF returns 420425.025054486 stb. Every time. On every machine. That is the entire argument for grading closed forms.

## The misconceptions to retire

**"More iterations makes Monte Carlo more accurate than a closed form."** More iterations converges the estimate to the answer implied by the sampling model you coded, including its independence assumption and its placeholder $b$ interval. It never converges to anything the model does not contain. Where a closed form exists, sampling can at best reproduce it, at the cost of reproducibility.

**"The P90 from the simulation and the P90 from my triangle should agree."** They are quantiles of different distributions. The triangle's P90 is a field-level exceedance quantile on a bracketed total. The simulation's p90 is the tenth percentile of EURs generated from independently perturbed Arps parameters and a uniformly perturbed economic limit. Comparing them is a category error, and finding that they differ tells you nothing.

**"Unseeded is fine, I will just report the mean of several runs."** Averaging several unseeded runs gives you a number that is still not reproducible, now with an undocumented number of runs behind it. If reproducibility is the requirement, the fix is a seeded generator or a closed form, not more arithmetic on top of an unauditable base.

## What good practice looks like

Use closed forms wherever they exist, which for triangular quantiles is always. Reach for sampling when you genuinely have correlated inputs and a nonlinear output, and when you do, three things go in the deliverable alongside the numbers: the seed, the iteration count, and the correlation structure you assumed. If your tool cannot supply the first of those, treat its output as an illustration and not as a booking.

## Exercise

Take the sampling-error formula above and turn it around. Using the Ekene triangle's density at the P90, 0.00000494743045255836 per stb, compute the number of iterations required for the standard error of a sampled P90 to fall to 200 stb. Then compute the same requirement for the P10, where the density is 0.00000411187013133895 per stb and $p = 0.90$, and state which of the two headline quantiles is more expensive to estimate by sampling and why.

Finally, open `engines/dca/monteCarlo.js` and find the line in `sampleArpsParameters` that converts a confidence-interval half-width into a standard deviation. Write one sentence on what that line assumes about the shape of the parameter uncertainty, and one sentence on whether that assumption is consistent with what module 3 showed the half-width to be for the decline exponent.
