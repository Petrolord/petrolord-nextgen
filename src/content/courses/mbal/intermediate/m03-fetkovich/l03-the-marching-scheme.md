# The marching scheme

Lesson 1 gave the aquifer a productivity index. Lesson 2 gave it a finite capacity. Now the two have to be combined into something you can actually compute, because the inflow law is a differential equation and a pressure history is a list of discrete surveys.

Fetkovich's move is to integrate that differential equation analytically over one timestep, holding the reservoir face pressure constant across the step, and then to chain the steps together. What falls out is a difference equation with three parts: a storage constant, a driving pressure difference, and a decay term.

## The equation

$$\Delta W_e[n] = \frac{W_{ei}}{p_i} \left( \bar{p}_a[n-1] - p_{wf}[n] \right) \left( 1 - e^{-J p_i \Delta t / W_{ei}} \right)$$

$$W_e[n] = W_e[n-1] + \Delta W_e[n]$$

$$\bar{p}_a[n] = p_i \left( 1 - \frac{W_e[n]}{W_{ei}} \right)$$

Three lines, and the third is the one that makes this a real aquifer model rather than a rate law. Take them one at a time.

$W_{ei}/p_i$ is the aquifer's storage per psi: how many barrels come out for each psi its own average pressure falls. For the published case it is $211934253.721285 / 2740 = 77348.2677814910$ bbl per psi, identical to $c_t W_{i,\text{wedge}}$, which is what it had to be, since compressibility multiplied by pore volume is barrels per psi.

The bracket $\bar{p}_a[n-1] - p_{wf}[n]$ is the drawdown across the aquifer face during the step. The aquifer pressure is carried forward from the previous step, and $p_{wf}$ is the reservoir pressure over this step. Which reservoir pressure exactly is the next lesson, and it matters more than you would guess.

The decay term is the analytic integration. Over an infinitely long step the exponential goes to zero and the term goes to 1: the aquifer has fully equilibrated and given up everything the drawdown entitled it to. Over an infinitesimally short step the term goes to zero and nothing moves. Real timesteps sit in between, and the term is the fraction of the available water that had time to arrive.

## The aquifer runs down

The third line is where Fetkovich differs from a pot. As water leaves, $W_e$ grows, and the aquifer's own average pressure falls in direct proportion to how much of its capacity it has spent. An aquifer that has given up ten percent of $W_{ei}$ has lost ten percent of its initial pressure. So the driving drawdown on the next step is smaller than it would otherwise have been, and the aquifer weakens as it works.

This is why the method needs no external limit on total influx. The influx limits itself: as $W_e$ approaches $W_{ei}$, $\bar{p}_a$ approaches zero, the drawdown collapses, and nothing more comes.

## The constants for the published case

For the Ahmed Example 10-10 geometry with $J$ 116.496154838747 bbl/d/psi, $W_{ei}$ 211934253.721285 bbl and $p_i$ 2740 psia:

$$\frac{J p_i}{W_{ei}} = 0.00150612493569796 \ \text{per day}$$

The book prints 0.001506, so that agrees. Over a 365 day step the exponent is $0.549735601529755$, the exponential itself is $0.577102375195823$, and the decay term is

$$1 - 0.577102375195823 = 0.422897624804177$$

against the book's printed 0.4229. This is the third capstone value: **the decay term over one 365 day step is 0.422897624804177**.

Two constants can now be folded together, because both are fixed for the whole march when the timestep is uniform. Fetkovich calls the product a reduced constant:

$$\frac{W_{ei}}{p_i} \times 0.422897624804177 = 32710.3987275100 \ \text{bbl per psi}$$

The book prints 32705. Reconstruct that from the printed inputs, $(211900000/2740) \times 0.4229$, and you get $32705.2956204380$: the book multiplied its own rounded $W_{ei}$ by its own rounded decay term. The gap of $0.0165073460022428$ percent is rounding, not disagreement.

With that constant in hand, each step is one multiplication: $\Delta W_e = 32710.3987275100 \times \Delta p$.

## Worked example: the first two steps

The published pressure history is 2740, 2500, 2290, 2109 and 1949 psia at one year intervals. The reservoir pressure driving step 1 is 2620 psia, and lesson 4 explains where that comes from.

**Step 1.** The aquifer starts at $\bar{p}_a = p_i = 2740$. The drawdown is $2740 - 2620 = 120$ psi.

$$\Delta W_e = 32710.3987275100 \times 120 = 3925247.84730120 \ \text{bbl}$$

That is 3.925 MMbbl, and the book prints 3.925. Cumulative influx is the same, 3925247.84730120 bbl, because this is the first step.

Now update the aquifer. It has spent $3925247.84730120 / 211934253.721285 = 0.0185210638600370$ of its capacity, so

$$\bar{p}_a = 2740 \times (1 - 0.0185210638600370) = 2689.25228502350 \ \text{psia}$$

The book prints 2689. The aquifer has lost about 51 psi.

**Step 2.** The driving reservoir pressure is 2395 psia, and the aquifer now starts from 2689.25228502350, so the drawdown is $294.252285023499$ psi. The book prints 294, from its rounded aquifer pressure.

$$\Delta W_e = 32710.3987275100 \times 294.252285023499 = 9625109.56959957 \ \text{bbl}$$

The book prints 9.615 MMbbl. Cumulative influx is $13550357.4169008$ bbl against a printed 13.54 MMbbl. The aquifer pressure falls again, to $2564.81369259386$ psia against a printed 2565.

The influx more than doubled between step 1 and step 2, because the drawdown more than doubled while the constant stayed fixed. The small divergences from the printed column are all in the third and fourth figures, and all trace back to the book rounding its aquifer pressures to whole psi before reusing them.

## How long the aquifer remembers

The group $W_{ei}/(J p_i)$ has units of days and is the aquifer's time constant: $663.955543327212$ days here. The time to deliver half of an available drawdown's worth of water is $\ln(2)$ multiplied by that, or $460.218912874403$ days.

That number tells you whether Fetkovich is even the right tool. If your surveys are years apart and the time constant is weeks, every step completes and the aquifer behaves like a pot. If the time constant is decades and your surveys are monthly, almost nothing arrives per step. Here the time constant and the timestep are within a factor of two of each other, which is the regime where the decay term is genuinely doing work: 0.4229, neither 0 nor 1.

## At the panel

{{panel:mb-aquifer-explorer}}

Read across the tiles in the order the equation uses them: **Wei**, then **J**, then **J*pi/Wei** at $0.00150612$ per day, then **Decay over one step** at $0.422897625$. Then change **Time step (days)** from 365 to 3650 and watch the decay term climb toward 1 as the aquifer is given ten years to equilibrate in a single step. Set it to 30 and watch it fall toward zero. Put it back to 365 before you leave.

## Exercise

Using the reduced constant $32710.3987275100$ bbl per psi, compute step 3 by hand. The aquifer starts the step at $2564.81369259386$ psia and the driving reservoir pressure is 2199.5 psia. Work out the drawdown, the influx for the step, the new cumulative influx, and the aquifer pressure at the end of the step. Compare all four against the panel's table and against the printed column.

Then answer in words: the drawdowns in steps 2, 3 and 4 are $294.252285023499$, $365.313692593859$ and $381.323399687473$ psi, so they are still growing, yet the aquifer pressure is falling the whole time. How can both be true at once, and what would have to happen to the reservoir pressure for the drawdown to start shrinking?
