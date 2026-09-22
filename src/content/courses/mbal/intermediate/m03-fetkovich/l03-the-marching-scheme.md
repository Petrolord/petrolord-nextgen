# The marching scheme

Lesson 1 gave the aquifer a productivity index. Lesson 2 gave it a finite capacity. Now the two have to be combined into something you can actually compute, because the inflow law is a differential equation and a pressure history is a list of discrete surveys.

Fetkovich's move is to integrate that differential equation analytically over one timestep, holding the reservoir face pressure constant across the step, and then to chain the steps together. What falls out is a difference equation with three parts: a storage constant, a driving pressure difference, and a decay term.

## The equation

$$\Delta W_e[n] = \frac{W_{ei}}{p_i} \left( \bar{p}_a[n-1] - p_{wf}[n] \right) \left( 1 - e^{-J p_i \Delta t / W_{ei}} \right)$$

$$W_e[n] = W_e[n-1] + \Delta W_e[n]$$

$$\bar{p}_a[n] = p_i \left( 1 - \frac{W_e[n]}{W_{ei}} \right)$$

Three lines, and the third is the one that makes this a real aquifer model rather than a rate law. Take them one at a time.

$W_{ei}/p_i$ is the aquifer's storage per psi: how many barrels come out for each psi its own average pressure falls. For the teaching aquifer it is $102766487.11056614 / 2740 = 37506.01719363728$ bbl per psi, identical to $c_t W_{i,\text{wedge}}$, which is what it had to be, since compressibility multiplied by pore volume is barrels per psi.

The bracket $\bar{p}_a[n-1] - p_{wf}[n]$ is the drawdown across the aquifer face during the step. The aquifer pressure is carried forward from the previous step, and $p_{wf}$ is the reservoir pressure over this step. Which reservoir pressure exactly is the next lesson, and it matters more than you would guess.

The decay term is the analytic integration. Over an infinitely long step the exponential goes to zero and the term goes to 1: the aquifer has fully equilibrated and given up everything the drawdown entitled it to. Over an infinitesimally short step the term goes to zero and nothing moves. Real timesteps sit in between, and the term is the fraction of the available water that had time to arrive.

## The aquifer runs down

The third line is where Fetkovich differs from a pot. As water leaves, $W_e$ grows, and the aquifer's own average pressure falls in direct proportion to how much of its capacity it has spent. An aquifer that has given up ten percent of $W_{ei}$ has lost ten percent of its initial pressure. So the driving drawdown on the next step is smaller than it would otherwise have been, and the aquifer weakens as it works.

This is why the method needs no external limit on total influx. The influx limits itself: as $W_e$ approaches $W_{ei}$, $\bar{p}_a$ approaches zero, the drawdown collapses, and nothing more comes.

## The constants for the teaching aquifer

For the teaching aquifer with $J$ 121.38464263682319 bbl/d/psi, $W_{ei}$ 102766487.11056614 bbl and $p_i$ 2740 psia:

$$\frac{J p_i}{W_{ei}} = 0.003236404495047678 \ \text{per day}$$

Over a 365 day step the exponent is $1.1812876406924024$, the exponential itself is $0.30688332862102163$, and the decay term is

$$1 - 0.30688332862102163 = 0.6931166713789784$$

The Professional capstone asks for the same decay term on the published geometry.

Two constants can now be folded together, because both are fixed for the whole march when the timestep is uniform. Fetkovich calls the product a reduced constant:

$$\frac{W_{ei}}{p_i} \times 0.6931166713789784 = 25996.045793936602 \ \text{bbl per psi}$$

A published table prints this constant rounded, built from its own rounded $W_{ei}$ and rounded decay term, and a reproduction from full precision will differ from it in the fourth or fifth figure. That gap is rounding, not disagreement.

With that constant in hand, each step is one multiplication: $\Delta W_e = 25996.045793936602 \times \Delta p$.

## Worked example: the first two steps

The published pressure history is 2740, 2500, 2290, 2109 and 1949 psia at one year intervals. The reservoir pressure driving step 1 is 2620 psia, and lesson 4 explains where that comes from.

**Step 1.** The aquifer starts at $\bar{p}_a = p_i = 2740$. The drawdown is $2740 - 2620 = 120$ psi.

$$\Delta W_e = 25996.045793936602 \times 120 = 3119525.4952723924 \ \text{bbl}$$

Cumulative influx is the same, 3119525.4952723924 bbl, because this is the first step.

Now update the aquifer. It has spent $3119525.4952723924 / 102766487.11056614$ of its capacity, so

$$\bar{p}_a = 2740 \times \left(1 - \frac{3119525.4952723924}{102766487.11056614}\right) = 2656.8259994345226 \ \text{psia}$$

The aquifer has lost about 83 psi.

**Step 2.** The driving reservoir pressure is 2395 psia, and the aquifer now starts from 2656.8259994345226, so the drawdown is $261.8259994345226$ psi.

$$\Delta W_e = 25996.045793936602 \times 261.8259994345226 = 6806440.671343069 \ \text{bbl}$$

Cumulative influx is $9925966.16661546$ bbl. The aquifer pressure falls again, to $2475.3500342259917$ psia.

The influx more than doubled between step 1 and step 2, because the drawdown more than doubled while the constant stayed fixed. When you work the published case, a book that rounds its aquifer pressures to whole psi before reusing them drifts from your column in the third and fourth figures, and that drift is the whole of the disagreement.

## How long the aquifer remembers

The group $W_{ei}/(J p_i)$ has units of days and is the aquifer's time constant: $308.98486314989134$ days for the teaching aquifer. The time to deliver half of an available drawdown's worth of water is $\ln(2)$ multiplied by that, or $214.1719867280477$ days.

That number tells you whether Fetkovich is even the right tool. If your surveys are years apart and the time constant is weeks, every step completes and the aquifer behaves like a pot. If the time constant is decades and your surveys are monthly, almost nothing arrives per step. Here the time constant and the timestep are of the same order, which is the regime where the decay term is genuinely doing work: about 0.69, neither 0 nor 1.

## At the panel

{{panel:mb-aquifer-explorer}}

Read across the tiles in the order the equation uses them, on the teaching aquifer: **Wei**, then **J**, then **J*pi/Wei** at $0.00323640$ per day, then **Decay over one step** at $0.693116671$. Then change **Time step (days)** from 365 to 3650 and watch the decay term climb toward 1 as the aquifer is given ten years to equilibrate in a single step. Set it to 30 and watch it fall toward zero. Put it back to 365 before you leave.

## Exercise

Using the teaching aquifer's reduced constant $25996.045793936602$ bbl per psi, compute step 3 by hand. The aquifer starts the step at $2475.3500342259917$ psia and the driving reservoir pressure is 2199.5 psia. Work out the drawdown, the influx for the step, the new cumulative influx, and the aquifer pressure at the end of the step. Compare all four against the panel's table.

Then answer in words: the drawdowns in steps 2, 3 and 4 are $261.8259994345226$, $275.85003422599175$ and $255.15377670349517$ psi, so they rise and then fall, while the aquifer pressure falls the whole time. What in the reservoir pressure history and in the aquifer's running down makes the drawdown turn over, and would the published case, with its slower aquifer, turn over as early?
