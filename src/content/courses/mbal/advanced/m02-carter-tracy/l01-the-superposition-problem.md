# The superposition problem

An aquifer has a memory. When the reservoir pressure drops today, water starts moving, but it does not all arrive today, and the water still arriving now was set in motion by drawdowns imposed months or years ago. That is the whole difficulty of unsteady state influx in one sentence, and every rigorous method for computing $W_e$ is a way of accounting for it.

## Why a single drawdown is not enough

The pot aquifer of the Professional tier had no memory at all: influx was a function of the current pressure and nothing else. Fetkovich gave the aquifer a clock, but only one, through a single decay constant applied step by step. The rigorous unsteady state treatment does something more expensive. It treats each pressure change as an event with its own start time, computes the influx response that event alone would produce, and adds up all the responses that are still running.

The van Everdingen and Hurst constant terminal pressure solution states it as a convolution. In the form the engine implements it, in `engines/aquifer/aquiferInflux.js`,

$$W_e(t_N) = U \sum_{j=0}^{N-1} \Delta P_j \, W_D\!\left(t_{D,N} - t_{D,j}\right)$$

with the aquifer influx constant $U = 1.119 f \phi c_t h r_R^2$ in reservoir barrels per psi and $W_D$ the dimensionless cumulative influx function. The engine's $W_D$ is the Edwardson and others rational fit as tabulated in Dake and in Ahmed, in two pieces that join at $t_D$ 200, with a small time form $2\sqrt{t_D/\pi}$ below $t_D$ 0.01.

Notice what $W_D$ takes as its argument. It is not the elapsed time. It is $t_{D,N} - t_{D,j}$, the time since the $j$ th pressure change. Every term in the sum is a different point on the influx function, because every event has been running for a different length of time. That is the memory made explicit.

The pressure changes themselves need care too. A survey table gives you pressures at instants, not steps, so the history has to be resolved into increments before it can be superposed. The engine uses the standard centred form: $\Delta P_0 = (p_i - p_1)/2$, then $\Delta P_j = (p_{j-1} - p_{j+1})/2$ for interior points, with the final point contributing nothing because it has no forward half. On the Dake Exercise 9.2 pressure history those increments come out as 60.0000, 172.500, 210.500, 183.000, 158.000, 134.500, 114.000, 94.5000, 74.0000, 55.5000 and 0 psi. The first is a half increment by construction, which is a detail worth remembering when a hand check of the first step disagrees with a code by a factor of two.

## What it costs

Count the work. Step 1 needs one evaluation of $W_D$, step 2 needs two, step $N$ needs $N$. Over $n$ steps that is $n(n+1)/2$ evaluations, and there is no state to carry forward, because every step recomputes its whole sum from the beginning of history.

For the ten annual steps of Dake 9.2 that is 55 evaluations, which is nothing. Resample the same ten years monthly, to 120 steps, and it becomes 7260, a factor of 60.5 more work for the same ten years of field life, while a marching scheme over the same table would go from 10 steps to 120, a factor of 12. Take a forty year field on monthly surveys, 480 steps, and the superposition needs 115440 terms against 480 marching steps, a factor of 240.5.

Be honest about what that does and does not mean. On a laptop, 115440 evaluations of a rational polynomial is not slow. The cost bites somewhere else. History matching wraps the entire influx calculation inside an optimiser that will call it hundreds or thousands of times with different aquifer parameters, and every one of those calls redoes the whole quadratic sum. The same is true when you add one new survey to a live field model: with a convolution there is nothing to update, only a sum to redo.

There is a second and less discussed cost. The superposition is written on a staircase, and you built the staircase from a smooth pressure history using a convention. The centred increments above are a choice. Change the sampling of the survey table and the increments change, so the answer moves for reasons that have nothing to do with the aquifer.

## The constraint that decides it on Dake 9.2

There is one more reason the rigorous route is not available for the case module 2 works, and it is worth stating plainly because it is a property of this codebase rather than of the physics. The engine's $W_D$ takes a single argument, $t_D$. There is no $r_{eD}$ in it. The van Everdingen and Hurst path implemented here is the infinite aquifer influx function, so the rigorous superposition in this repository cannot represent a bounded aquifer at all. The finite aquifer is reachable only through Fetkovich, which assumes pseudo steady state from the outset, or through Carter-Tracy with the bounded $p_D$ that module 1 introduced.

Given what module 1 established about Dake 9.2, that settles it. The correct answer for that field needs a boundary at $r_{eD}$ 5, and the superposition route cannot supply one.

## Worked example: two years of Dake 9.2 by superposition

Take the Dake aquifer, $U = 6445.68866666667$ rb per psi and a dimensionless time step of 5.67218226008394 per year, and compute the influx at the end of year 2 the rigorous way.

Two events have occurred. The first increment, 60.0000 psi, has been running for two years, so it is evaluated at $t_D$ 11.3443645201679, where $W_D = 8.10925021359074$. The second increment, 172.500 psi, has been running for one year, so it is evaluated at $t_D$ 5.67218226008394, where $W_D = 4.94927167643784$.

$$W_e = 6445.68866666667 \times \left(60 \times 8.10925021359074 + 172.5 \times 4.94927167643784\right)$$

The bracket is 1340.30437700097 and the influx is 8639184.73271890 rb, or 8.63918473271890 MMrb. The engine's own van Everdingen and Hurst series returns 8639184.73271891 rb at the same step, so the hand calculation and the code agree to fifteen figures.

Now look at the structure of what you just did. The older and smaller increment contributed 486.555012815444 of the bracket through a large $W_D$, and the younger and larger increment contributed 853.749364185527 through a small one. Both terms matter, and neither can be recovered from the current drawdown alone. That is the superposition problem, and the next lesson is about how Carter-Tracy sidesteps it.

## Exercise

Continue the calculation to the end of year 3, using $\Delta P_2 = 210.500$ psi, $W_D(17.0165467802518) = 10.9224779492523$ and the two $W_D$ values already quoted, and confirm you obtain 19955955.4150522 rb. Then answer three questions.

First, which of the three terms is largest, and is the largest term the one from the largest pressure increment? Second, suppose a new survey arrives for year 4. Write down how many $W_D$ evaluations the convolution needs in order to report year 4, and how many of them are being computed for the second time. Third, the rigorous influx after ten years of this history is 149.344654829452 MMrb, while module 1 showed the correct bounded answer for this aquifer is far smaller. In two sentences, explain why the most rigorous method available in this codebase gives the least useful answer on this particular field, and say what would have to change for the ranking to reverse.
