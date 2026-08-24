# The steady state column

Fourier's law describes one point in a rock. To get a temperature at a depth you have to apply it through a whole column. This lesson does that in the simplest case that is still physically honest, and the result is arithmetic you can do on paper and check against the engine.

## Two assumptions that make it exact

The first assumption is steady state. Nothing about the column is changing with time, so the heat entering the base of any slice equals the heat leaving its top. Rock stores heat, and while a basin is being buried or is cooling after a rift that storage matters, which is why the full engine steps forward in time. In steady state the storage term drops out and the same heat flow passes through every level of the column.

The second assumption is no internal heat production. Nothing in the sediment column is generating heat of its own, so nothing is added on the way up. Real sediments do produce a little from radioactive decay, and organic-rich shales produce slightly more than most, but the amount is small compared with what arrives from below.

Take those two together and one sentence follows: the heat flow $Q$ is the same number at every depth in the column. That is the fact the whole calculation rests on.

## Building the temperature layer by layer

Inside a layer of constant conductivity $k$, the gradient is constant too, because both $Q$ and $k$ are constant. A constant gradient means temperature rises in a straight line with depth. Starting from a known temperature at the top of the layer and travelling a distance $z$ down into it,

$$T = T_{top} + \frac{Q z}{k}$$

For a column that starts at the surface, $T_{top}$ is the surface temperature $T_s$ and the formula reads $T = T_s + Qz/k$ for any depth inside the first layer. When you reach the base of that layer you compute the temperature there, then start again with the second layer using its own $k$ and using the base temperature of the first layer as the new starting point. Layer by layer, the profile is a chain of straight segments.

## The golden fixture

The fixture used throughout this module, and graded in the capstone, is this:

| property | value |
|---|---|
| surface temperature | 10 degC |
| basal heat flow | 0.06 W/m2, which is 60 mW/m2 |
| upper layer | 1000 m thick, k = 1.8 W/m/K |
| lower layer | 1000 m thick, k = 3.5 W/m/K |

The engine discretises each layer into ten cells of 100 m, so the cell centres sit at 50, 150, 250 and so on down to 1950 m. It then solves the conduction equation on that grid with a fixed temperature at the surface node and a fixed heat flow at the base, using harmonic means for the conductivity at the interfaces between cells.

None of that machinery changes the answer here. Because the column is in steady state with no internal production, the numerical solution reproduces the exact formula, and you can check any cell you like by hand.

## Two cells worked by hand

Take the first cell, whose centre is at 50 m. It sits inside the upper layer, so $k = 1.8$ W/m/K, and the starting point is the surface at 10 degC.

$$T = 10 + \frac{0.06 \times 50}{1.8} = 11.666666666666671 \text{ degC}$$

Do the arithmetic in the order the formula is written. The heat flow times the depth is 3 W/m, dividing that by the conductivity of 1.8 W/m/K gives the rise in degrees Celsius over those 50 m, and adding it to the 10 degC at the surface gives 11.666666666666671 degC. That is the value the engine returns at 50 m, and the graded tolerance on it is 0.05 degC, so any correct hand calculation passes comfortably.

Now take the deepest cell of the upper layer, whose centre is at 950 m. Same layer, same conductivity, same starting point, larger depth.

$$T = 10 + \frac{0.06 \times 950}{1.8} = 41.66666666666673 \text{ degC}$$

The rise from the surface to 950 m is a little under 32 degC, all of it accumulated in one layer at one constant gradient. That is the second graded value.

Two things are worth noticing about that pair. The first is that nothing in either calculation used the lower layer. Heat flow is set at the base of the column and passes upward unchanged, so the temperature inside the upper layer does not depend on what lies below it. The second is that both cells lie on the same straight line through the surface point, which is the signature of constant conductivity.

## Where this stops being exact

Two limits are worth naming so that you do not carry the formula further than it goes.

It is a steady state result. A basin that is being buried rapidly has not caught up with its own heat flow, and its shallow section is cooler than steady state would predict. Time dependence is what the backward Euler solver in the engine exists for, and it is used in the higher tiers.

It assumes conductivity is constant within a layer. In reality conductivity rises as porosity falls, so a thick layer has a slightly curved profile rather than a perfectly straight one. The fixture sets constant conductivities on purpose, so that the arithmetic is exact and you can tell an engine error from a modelling approximation.

## Exercise

Using the fixture, compute the temperature at the cell centred at 450 m by hand, then state without further arithmetic whether a cell at 450 m would be hotter, cooler or unchanged if the lower layer's conductivity were 2 W/m/K instead of 3.5 W/m/K.

Self check: the cell is in the upper layer, so $T = 10 + 0.06 \times 450 / 1.8$, which is 10 plus a rise of 15, giving 25 degC. The engine reports 25.000000000000032 degC for that cell, and the difference from a clean 25 is floating point noise. The lower layer's conductivity makes no difference at all to that cell. The heat flow arriving at the base of the column is fixed at 0.06 W/m2 and it passes through the lower layer unchanged, so changing that layer's conductivity changes the temperatures inside and below it while leaving every temperature above it exactly where it was.
