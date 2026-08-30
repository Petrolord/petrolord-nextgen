# Production data as a test

Most wells are never tested. All of them are produced.

## The change of dataset

A pressure transient test is days of high-resolution data during a controlled rate change, and it costs deferred production and rig time.

Production data are months or years of daily rate and flowing pressure, at whatever rates the field operated, and they cost nothing because they were recorded anyway.

Rate transient analysis is the set of methods that get reservoir answers out of the second dataset. It is now the commonest form of well analysis in the industry, and in unconventional plays it is essentially the only one.

## What changes

**The time unit.** Production data are daily. The engine's RTA functions work in DAYS while the pressure transient side works in hours, and that difference is stated in the module header because mixing them is a factor-of-24 error that produces plausible-looking nonsense.

**The rate is not constant.** It never is. Every method here handles that with a time transform rather than by requiring constancy.

**The quantity measured changes.** A pressure transient measures flow capacity and skin: how easily fluid moves. Production data over a long enough period measure the VOLUME connected to the well, because the well has depleted enough of it for the depletion to show.

That last point is the one to hold onto. A buildup tells you about the rock. A year of production tells you about the tank.

## Material-balance time

The central transform. Define

    te = Q(t) / q(t)

cumulative production divided by current rate, in days.

It is the exact superposition time for boundary-dominated flow: a variable-rate history plotted against te collapses onto the constant-rate solution, exactly, during depletion.

The engine's `materialBalanceTime` computes the cumulative by trapezoid from the rate history and returns te alongside each row.

Its behaviour is surprising the first time. On the 80-day oil fixture, te at the last row is over 2354 days. Material-balance time can be far longer than the elapsed time, because the rate has fallen a long way and the cumulative divided by a small current rate is large.

That is the transform working, not an error. The well HAS depleted as much as a constant-rate well would have by then.

## Rate-normalised drawdown

The other half of the machinery. Plot

    (pa(pi) - pa(pwf)) / q     against     te

where pa is the identity for oil and m(p) for gas.

Dividing by rate removes the rate variation. Plotting against te removes the superposition. What is left is a straight line during boundary-dominated flow whose slope and intercept give the answers.

## What the fixtures are

**Oil decline.** 80 days at constant flowing pressure of 2800 psia, initial pressure 4800, 2 million stock tank barrels in place, productivity index 1.5 stb/d/psi. The rate declines exponentially, which is what a liquid tank at constant flowing pressure does.

**Gas decline.** 300 days at 1500 psia flowing, initial 4800, 20 million Mscf in place, 180 F, 0.65 gravity.

**Linear flow.** 40 rows in transient linear flow, with a half-length times root permeability of 500.

Three different questions: a tank volume in oil, a tank volume in gas, and a fracture geometry.

## The misconception to avoid

"Production data are a poor substitute for a proper test." They answer a different question, and it is often the more valuable one. A buildup gives permeability and skin over the volume the transient reached in three days. A year of production gives the connected volume, which is what reserves depend on. Neither substitutes for the other, and a field with both is much better characterised than one with either.

## Exercise

The oil fixture runs 80 days and its material-balance time at the last row is over 2354 days.

Compute the ratio of the last rate to the first from the fixture's own values, and use it to explain how an 80-day record produces a material-balance time of that size.
