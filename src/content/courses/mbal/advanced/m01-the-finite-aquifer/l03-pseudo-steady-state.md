# Pseudo steady state

A bounded aquifer has a last act. Once the pressure disturbance has reached the outer wall and reflected off it, there is nowhere else for the signal to go, and every point in the aquifer begins to fall at the same rate. That regime is pseudo steady state, and it has a closed form. Knowing it turns the finite aquifer from a black box you have to invert numerically into something you can check by hand, which is what this lesson is for.

## The asymptote

For a bounded circle of dimensionless outer radius $r_{eD}$, the late time dimensionless pressure is

$$p_D(t_D) \;\longrightarrow\; \frac{2 t_D}{r_{eD}^2 - 1} + \ln r_{eD} - \frac{3}{4}$$

and the teaching lab exposes exactly that expression as `pssAsymptote(tD, reD)`, which is what the panel draws as the yellow dashed line.

Read it as a straight line in $t_D$, because that is what it is. The slope is $2/(r_{eD}^2 - 1)$, which for $r_{eD}$ 5 is 0.0833333333333333 per unit of dimensionless time. The intercept is $\ln r_{eD} - 0.75$. Two facts follow immediately and both matter.

The first is that a bounded aquifer's dimensionless pressure eventually grows without limit, linearly, while the unbounded solution keeps flattening into a logarithm. That is the divergence you saw at the right hand end of the table in lesson 1, and now you can see why it is linear rather than merely larger. The aquifer is depleting. A tank being drained at constant rate loses pressure at constant rate.

The second is that the slope is a strong function of aquifer size. Going from $r_{eD}$ 5 to $r_{eD}$ 10 divides $r_{eD}^2 - 1$ by roughly four, so the depletion slope falls by roughly the same factor. Aquifer volume is what buys you a shallow slope, and volume goes as radius squared.

## Where you have met that group before

The intercept $\ln r_{eD} - 0.75$ is the same group that sits in the denominator of the Fetkovich productivity index you worked in the Professional tier. That is not a coincidence and it is not a shared typo. The group is the dimensionless resistance between the average pressure of a bounded circular body and the pressure at its inner boundary, evaluated once the body is in pseudo steady state. Fetkovich needs it because his whole method assumes the aquifer is already in that regime and writes the influx as a productivity index times a pressure difference. The bounded circle solution needs it because it is the constant term of the same late time pressure profile. One piece of geometry, two places it shows up.

The panel makes this concrete. The tile marked **ln(reD) - 0.75** reads 0.859437912 at $r_{eD}$ 5, which to the precision the tile shows is the number the Professional lesson used to build $J$, 0.859437912434100. Step the selector down to $r_{eD}$ 2 and it reads $-0.0568528194$. A negative resistance is not physical, and it is the clearest possible signal that the pseudo steady state form has been pushed outside the geometry it was derived for. The values at 3, 10 and 20 are 0.348612289, 1.55258509 and 2.24573227.

## Worked example: the asymptote against the exact value

The Expert capstone asks for the bounded circle dimensionless pressure at $t_D$ 100 and $r_{eD}$ 5. Work the method here at $t_D$ 100 and $r_{eD}$ 3, and run the capstone's own case on the panel. Build the asymptote first, by hand, because it is the check on everything else.

The slope term is $2 \times 100 / (9 - 1) = 200/8 = 25$. The intercept term is $\ln 3 - 0.75 = 1.0986122886681098 - 0.75 = 0.3486122886681098$. Adding them gives

$$p_{D,\text{pss}}(100, 3) = 25.34861228866811$$

The engine's Stehfest inversion of the bounded circle Laplace form returns 25.577955313403997. The two differ by 0.2293430247358863 in dimensionless pressure, which is 0.8966433083714876 percent.

Now be precise about the sense in which the one converges on the other, because it is easy to state this loosely. Track the difference as time runs on at $r_{eD}$ 3: it is 0.22646341905930223 at $t_D$ 10, 0.2293258731955854 at $t_D$ 25, 0.2293308650557897 at $t_D$ 50, 0.2293430247358863 at $t_D$ 100, 0.22936713451390034 at $t_D$ 200 and 0.22955957989321973 at $t_D$ 1000. The absolute gap does not close at all. It sits at about 0.229 and stays there. What closes is the relative gap, from 7.3644827179447425 percent at $t_D$ 10 to 3.3586401598720776 percent at $t_D$ 25, 0.8966433083714876 percent at $t_D$ 100 and 0.09161196212000193 percent at $t_D$ 1000, and it closes only because the quantity itself is growing linearly while the offset stays put.

So the exact solution runs parallel to the asymptote, displaced upward by a constant. The displacement is a property of the approximation rather than a leftover transient: the $\ln r_{eD} - 0.75$ form drops terms that shrink as the aquifer grows relative to the reservoir. Measured deep inside pseudo steady state, that constant offset is 0.372488978901778 at $r_{eD}$ 2, 0.229353650056950 at $r_{eD}$ 3, 0.0417324084764346 at $r_{eD}$ 10 and 0.0138127208957854 at $r_{eD}$ 20, and it falls monotonically with $r_{eD}$ in between. Small aquifers are where the shorthand costs you most, which is unfortunate, because small aquifers are where you needed the finite solution in the first place.

## At the panel

{{panel:mb-pd-explorer}}

Set the selector to $r_{eD}$ 3: the yellow dashed asymptote is below the orange bounded curve on the right hand side of the plot, and the two run parallel. Read the pair of tiles **pD finite at tD 100** and **PSS asymptote at tD 100**, which are shown to nine figures: 25.5779553 and 25.3486123. At $r_{eD}$ 5, the capstone's case, the same two tiles give you its value and its check.

Now set the selector to $r_{eD}$ 20 and read the same two tiles again: 2.74197107 and 2.74698541. The order has reversed, and the dashed line now sits above the curve at the right hand edge of the plot. Nothing is broken. The onset of pseudo steady state moves out in time as $r_{eD}^2$, so at $r_{eD}$ 20 the aquifer has not finished its transient by $t_D$ 100 and the asymptote is describing a regime the aquifer has not entered yet. An asymptote is a statement about late time, and late is measured relative to the size of the thing.

## Exercise

Set the panel to $r_{eD}$ 10 and record the two late time tiles, 3.61406650 for the bounded solution and 3.57278711 for the asymptote. Then work three things out on paper.

First, rebuild the asymptote yourself from $2 t_D / (r_{eD}^2 - 1) + \ln r_{eD} - 0.75$ at $t_D$ 100 and $r_{eD}$ 10, and confirm you land on the tile. Second, compute the absolute and relative gaps between the two tiles and compare them with the corresponding gaps at $r_{eD}$ 3, which are 0.2293430247358863 and 0.8966433083714876 percent. Say which of the two aquifers is better served by the shorthand and why. Third, write down the depletion slope $2/(r_{eD}^2 - 1)$ for $r_{eD}$ 3 and for $r_{eD}$ 10, and use them to state, in one sentence, how much extra dimensionless time the larger aquifer buys you before its dimensionless pressure reaches the value the smaller one reaches at $t_D$ 100.
