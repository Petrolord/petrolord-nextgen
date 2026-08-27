# The productivity index

The pot aquifer of module 2 has no clock. Drop the pressure and the water arrives, all of it, in the same instant. Every real aquifer takes time, because water has to flow through rock to get to you, and rock resists. Fetkovich's method is the cheapest honest way to put that resistance into the balance, and the whole of it rests on one idea you already know from well testing: an aquifer is a tank that flows into your reservoir through its own productivity index.

## The aquifer as a well

Write the aquifer's inflow the way you would write a well's:

$$\frac{dW_e}{dt} = J \left( \bar{p}_a - p_{wf} \right)$$

The rate of water influx is a productivity index multiplied by a pressure difference. $\bar{p}_a$ is the average pressure in the aquifer, $p_{wf}$ is the pressure at the face where the aquifer meets the reservoir, and $J$ is the constant of proportionality, in reservoir barrels per day per psi. That is the entire flow model. Everything else in Fetkovich's scheme is bookkeeping: how the aquifer's own pressure falls as it gives water up, and how you step the equation through time. Those are the next two lessons. This one is about $J$, because $J$ is the number that decides how fast the water can move, and it is the number most often computed wrong.

## The formula, and the group that matters

For a radial aquifer with a no-flow outer boundary, the productivity index is

$$J = \frac{0.00708 \, k \, h \, f}{\mu_w \left[ \ln(r_{eD}) - 0.75 \right]}$$

with $k$ in md, $h$ in ft, $\mu_w$ in cp, and $0.00708$ the field-unit constant that leaves $J$ in bbl per day per psi. The factor $f$ is the encroachment-angle fraction, $\theta/360$, which lesson 2 takes apart. The term $r_{eD}$ is the dimensionless radius, the aquifer radius divided by the reservoir radius.

Look hard at the denominator. It is not $\ln(r_{eD})$. It is $\ln(r_{eD})$ minus three quarters, and that subtraction is not decoration. It is the signature of pseudo-steady-state flow, the same group that appears whenever a bounded circular system has stopped behaving transiently and every point in it is falling at the same rate. A bounded aquifer reaches that state. An aquifer draining to a reservoir through a fixed contact area is exactly the geometry that produces it. So the minus 0.75 belongs there, and leaving it out silently swaps in a steady-state model the aquifer is not obeying.

Ahmed's own worked example prints $J$ as 116.5 bbl per day per psi, and the arithmetic reproduces that number only with the 0.75 included. The equation as it is typeset in some printings of the book drops the term. The printed answer keeps it.

## Worked example: Ahmed Example 10-10

The published aquifer has $k$ 200 md, $h$ 100 ft, $\mu_w$ 0.55 cp, $\theta$ 140 degrees and $r_{eD}$ 5. Take the pieces in order.

The angle fraction is $140/360 = 0.388888888888889$.

The denominator is $\ln(5) - 0.75$. Now $\ln(5) = 1.60943791243410$, so the denominator is $0.859437912434100$.

Assemble:

$$J = \frac{0.00708 \times 200 \times 100 \times 0.388888888888889}{0.55 \times 0.859437912434100} = 116.496154838747 \ \text{bbl/d/psi}$$

Against the printed 116.5 that is an agreement of $-0.00330056759944386$ percent, which is the book's rounding and nothing else. This is the first of the four values the Professional capstone asks you for, so keep the full figure: **J = 116.496154838747 bbl/d/psi**.

## What the trap costs

Now do it the wrong way. Use $\ln(r_{eD})$ on its own, $1.60943791243410$, and the same numerator gives

$$J = 62.2088067813624 \ \text{bbl/d/psi}$$

That is $-46.6001200919709$ percent off. The two denominators stand in the ratio $1.87266338748758$, and $J$ falls by exactly that factor because nothing else in the expression changed.

An error of nearly half in a flow coefficient would be bad enough if it stopped there. It does not stop there. $J$ enters the decay term that governs how much of the available water actually moves in a timestep, so the wrong denominator drags that down too: the decay over one 365 day step falls from $0.422897624804177$ to $0.254394136144465$, which is $-39.8449834608880$ percent. March the influx forward over the four steps of the published history and the cumulative water influx comes out at $26.6727996152478$ MMbbl instead of $37.9731544101719$ MMbbl, an error of $-29.7587992634529$ percent.

Note what happened to the size of the error along that chain: 46.6 percent in $J$, 39.8 percent in the decay, 29.8 percent in the cumulative influx. It shrank. That is the dangerous part. A large mistake in a constant can arrive at the answer looking like a plausible discrepancy, small enough to be blamed on data quality, and a reviewer who only sees the final influx has no way to tell that the flow coefficient was half of what it should have been.

## At the panel

{{panel:mb-aquifer-explorer}}

The panel opens on the published geometry. Read the tile marked **Denominator**: it shows $0.859437912434100$, and the **J** tile beside it shows $116.496154838747$. Now press the button labelled **ln(reD) (the trap)**. The denominator tile jumps to $1.60943791243410$, $J$ collapses to $62.2088067813624$, the decay tile falls with it, and the engine's marching column in the table below drops away from the printed column it was matching a moment ago. Press the pseudo-steady-state button to put it back.

One detail about the inputs. The panel exposes $r_{eD}$ as its own field alongside the reservoir radius 9200 ft and the aquifer radius 46000 ft. Those two radii are in the ratio 5, which is where the published $r_{eD}$ comes from, but the panel will let you set them inconsistently. If you edit a radius, edit $r_{eD}$ to match.

## Exercise

Keep the pseudo-steady-state denominator and change the permeability from 200 md to 50 md, leaving everything else alone. Write down the new $J$ and the new decay term from the tiles, then answer three questions.

First, by what factor did $J$ change, and why is that factor exactly what it is? Second, did the decay term change by the same factor, and if not, why not? Third, the cumulative influx in the table has fallen. Is the water that did not arrive gone for good, or has it merely been delayed? Say which, and say what in the equations tells you.
