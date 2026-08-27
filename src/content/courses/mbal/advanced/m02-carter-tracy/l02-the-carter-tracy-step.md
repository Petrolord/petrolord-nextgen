# The Carter-Tracy step

Carter and Tracy's contribution was to replace the convolution of the previous lesson with a recursion. The whole pressure history stops being a sum you rebuild at every step and becomes two numbers you carry forward. This lesson takes the step apart, term by term, from the source rather than from memory, because every term in it is doing a specific job and an engineer who cannot say which job is not in a position to debug a bad influx history.

## The recursion, as implemented

From `engines/aquifer/aquiferInflux.js`, the marching form is

$$W_{e,n} = W_{e,n-1} + \left(t_{D,n} - t_{D,n-1}\right)\left[\frac{U \Delta p_n - W_{e,n-1}\, p'_{D,n}}{p_{D,n} - t_{D,n-1}\, p'_{D,n}}\right]$$

with the same aquifer constant $U = 1.119 f \phi c_t h r_R^2$ in reservoir barrels per psi and the same dimensionless time $t_D = 6.33 \times 10^{-3} k t / (\phi \mu_w c_t r_R^2)$ with $t$ in days. When a dimensionless outer radius greater than one is supplied, the code evaluates $p_D$ and $p'_D$ with the bounded circle functions of module 1; otherwise it uses the line source pair. Nothing else in the step changes between the finite and the infinite case, which is worth holding on to: the finite aquifer is not a different method, it is the same recursion fed a different solution family.

Read the pieces.

The bracket has the units of influx per unit dimensionless time, so the step is a rate multiplied by an interval. That is the whole architecture.

The numerator is a driving term minus a correction. $U \Delta p_n$ is what the current total drawdown would draw from an aquifer that had so far delivered nothing. Subtracted from it is $W_{e,n-1} p'_{D,n}$, which discounts the drive by the water that has already arrived: water that has left the aquifer is water whose own pressure support is no longer available to push more.

The denominator is the response function corrected for elapsed time. If you started the clock now, the resistance would be $p_{D,n}$. But the response has already been running for $t_{D,n-1}$, and $t_{D,n-1} p'_{D,n}$ removes the part of it that has already been consumed. This is where the memory of the history lives, and it lives in one scalar.

So the recursion carries exactly two pieces of state, $W_{e,n-1}$ and $t_{D,n-1}$, and does two evaluations of the solution family per step instead of $n$. The derivative $p'_D$ for the bounded case is obtained in the same way as $p_D$ itself, by Stehfest inversion of $u$ times the Laplace form, which is valid because $p_D(0) = 0$.

## The delta p that is not the one you expect

Here is the trap, and it is documented in the engine's own comments as a fixed bug rather than as a preference.

$$\Delta p_n = p_i - p_n$$

That is the cumulative drawdown from initial pressure to the current survey. It is not the pressure change over the step, and it is not the centred increment the van Everdingen and Hurst convolution uses. The comment in `mbalEngine.ts` records that this implementation previously applied the centred increment inside the recursive form, that the correction was made on 2026-05-17, and that the earlier convention produced a systematic under prediction of $W_e$ of roughly eighty percent on Dake Exercise 9.2.

The reason the two conventions cannot be swapped is structural. In the convolution, each term carries its own increment because each term is a separate event with its own start time. In the recursion, there is only one term, and the accumulated effect of all previous events is already represented by $W_{e,n-1}$ in the numerator. Feed it an increment as well and you have accounted for the history twice on one side of the fraction and not at all on the other.

The Professional tier met a different pressure convention trap in Fetkovich, where the question was which pressure within a step to use, and the answer was the midpoint. Do not carry that answer here. These are two distinct questions with two distinct answers, and an engineer who has learned one convention as a habit rather than as a consequence will apply it in the wrong place. When you meet a $\Delta p$ in an influx scheme, derive what it must be from the structure of the scheme.

## Worked example: the first step of Dake 9.2

Take the Dake aquifer, $U = 6445.68866666667$ rb per psi, dimensionless time coefficient 0.0155402253700930 per day, bounded at $r_{eD}$ 5, and march the first year of the pressure history from 2740 psia to 2620 psia on 365 day years.

At the end of step 1, $t_{D,1} = 5.67218226008396$ and $\Delta p_1 = 2740 - 2620 = 120$ psi. The bounded solution gives $p_{D,1} = 1.43968464638507$ and $p'_{D,1} = 0.0894739110881427$.

Now use the two initial conditions. $W_{e,0} = 0$, so the correction in the numerator vanishes and it reduces to $U \Delta p_1 = 773482.640000000$. And $t_{D,0} = 0$, so the correction in the denominator vanishes and it reduces to $p_{D,1}$ itself. The step collapses to

$$W_{e,1} = t_{D,1} \frac{U \Delta p_1}{p_{D,1}} = 5.67218226008396 \times \frac{773482.640000000}{1.43968464638507} = 3047427.44885635 \ \text{rb}$$

which is 3.04742744885635 MMrb, and matches the engine's own march to fifteen figures. The first step of a Carter-Tracy history is always this simple, which makes it the step to hand check when a march looks wrong.

Step 2 shows the machinery properly. At $t_{D,2} = 11.3443645201679$ with $\Delta p_2 = 345$ psi, the bounded solution gives $p_{D,2} = 1.92074699050930$ and $p'_{D,2} = 0.0833950208001445$. The numerator is $6445.68866666667 \times 345 - 3047427.44885635 \times 0.0833950208001445 = 1969622.31451569$, and the denominator is $1.92074699050930 - 5.67218226008396 \times 0.0833950208001445 = 1.44771523294739$. Multiplying the ratio by the interval 5.67218226008396 gives an increment of 7717026.45465459 rb and a running total of 10764453.9035109 rb.

Watch the denominator from here on. Once the aquifer is in pseudo steady state, $p_D$ is linear and $p'_D$ settles on the asymptote slope $2/(r_{eD}^2 - 1) = 0.0833333333333333$, which the engine's derivative confirms: 0.0833806219509 at $t_D$ 20 and 0.0833328617005 at $t_D$ 100. With uniform steps, the denominator then reduces to the slope times the step length plus the intercept, which for this history predicts 1.44823257124552. The engine's actual denominators from step 4 to step 10 sit between 1.44663810347029 and 1.45452920946366. A Carter-Tracy march on a bounded aquifer in pseudo steady state is, to a good approximation, a fixed divisor applied to a growing drawdown.

## Exercise

March step 3 of the same history by hand. You will need $t_{D,3} = 17.0165467802518$, $\Delta p_3 = 541$ psi, $p_{D,3} = 2.39342613447928$, $p'_{D,3} = 0.0833538110645280$, and the running total from step 2. Confirm you obtain an increment of 10146324.3965135 rb and a cumulative influx of 20910778.3000244 rb.

Then answer three questions. First, evaluate the numerator correction $W_{e,2} p'_{D,3}$ and express it as a percentage of $U \Delta p_3$, and say what that percentage will do over the remaining seven steps. Second, redo step 3 using the incremental drawdown, $p_2 - p_3 = 196$ psi, in place of the cumulative 541 psi, and state the cumulative influx you get. Third, given that the correct total influx after ten years is 88064588.3139400 rb, say in one sentence why an error of this kind is more dangerous than an obviously broken run.
