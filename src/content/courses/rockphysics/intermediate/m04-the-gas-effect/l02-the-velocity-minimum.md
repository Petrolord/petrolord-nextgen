# The velocity minimum

The compressional velocity of this rock does not fall all the way to pure gas. It reaches its lowest value at a water saturation of 0.73 and then climbs again. This lesson is about that turn, which surprises people and has a simple cause.

## The shape

$$v_p(S_w = 0.73) = 2830.2791905880454 \ \mathrm{m/s}, \qquad v_p(S_w = 0.00) = 2905.6972280296195 \ \mathrm{m/s}$$

Pure gas is 75.42 m/s faster than a rock holding 27 percent gas.

## Two effects, running at different speeds

The velocity is

$$v_p = \sqrt{\frac{K_{sat} + \tfrac{4}{3}\mu}{\rho}}$$

Adding gas does two things. It lowers the numerator, by softening the fluid and therefore the saturated modulus. It lowers the denominator, by lightening the pore contents.

Those pull in opposite directions, and they do not run at the same rate.

The numerator effect is governed by Wood's mixing, so it is violently non-linear and is essentially complete within the first few percent of gas.

The denominator effect is governed by mass bookkeeping, so it is exactly linear in gas fraction and continues at the same rate all the way to pure gas.

So at the left of the axis the numerator is collapsing and wins. Once it has finished collapsing, the denominator keeps falling on its own, and the velocity turns back up.

## Where the turn is

The minimum sits at a water saturation of 0.73 for this rock, which is to say at 27 percent gas.

That position is not universal. It depends on the frame stiffness, the porosity and the contrast between the two fluids. A stiffer frame or a lower porosity moves the minimum toward pure gas; a very soft frame moves it toward pure brine.

What is universal is that the minimum exists whenever the fluid modulus saturates faster than the density does, which is whenever a light compliant fluid is displacing a heavy stiff one, which is always for gas and brine.

## Why nobody notices it

Because the whole right hand two thirds of the curve is nearly flat. From Sw 0.73 to Sw 0.00 the velocity moves 75 m/s, which is 2.6 percent, and real data carries more scatter than that.

So the practical shape is a cliff followed by a flat floor with a very gentle upward tilt. In interpretation the tilt is usually invisible and the cliff is everything.

The reason to know about the minimum anyway is that it removes any temptation to invert velocity for saturation on the right of the curve. A velocity of 2870 m/s in this rock is consistent with a water saturation of about 0.85 and with about 0.15, on opposite sides of the minimum, and no amount of processing separates them.

## Reading it off the panel

The turn is drawn on the chart.

{{panel:rp-substitution-explorer}}

Set the saturation to 0.73 and note the velocity, then to 0.50, 0.20 and 0.00 and note that it rises at every step. Then look at the shear velocity tile over the same range: it rises steadily and never turns, because it is a pure density reading and the density has no minimum.

Two velocities from the same substitution, one with a turning point and one without, and the difference is entirely that only one of them contains the fluid modulus.

## Worked example

Confirm the mechanism by holding one effect fixed.

Take the Sw 0.73 case and the Sw 0.00 case. Their saturated bulk moduli are close, because the fluid modulus has long since collapsed: the mixture modulus at Sw 0.73 is 195.45 MPa against 55.72 MPa for pure gas, and both are small against the frame's 7350 MPa.

Their densities are not close: 2192.95 against 2038.71 kg/m3, a difference of 154 kg/m3 or 7 percent.

So between those two points the numerator is nearly constant while the denominator falls 7 percent, and the velocity must rise by about half that in proportion, which is 3.5 percent, or roughly 75 m/s on 2830. That is the observed 75.42 m/s.

The turn is a density effect with the modulus effect switched off.

## Exercise

State what would happen to the position of the velocity minimum if the same rock were at 0.10 porosity instead of 0.25, and give the reason.

Self check: the minimum would move toward pure gas, that is toward a lower water saturation, and would become shallower. Lower porosity means less fluid in the rock, so both the modulus collapse and the density fall are smaller, but the modulus effect is reduced more because the fluid term enters the stiffness through $\phi/K_{fl}$ while the density effect stays proportional to porosity in a simple linear way. With less fluid to remove, the rock is closer to its dry frame throughout, and the curve flattens.
