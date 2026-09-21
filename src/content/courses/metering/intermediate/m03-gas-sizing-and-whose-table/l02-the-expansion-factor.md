# The expansion factor and the two thirds floor

{{panel:fc-choking-explorer}}

A gas expands as it passes through a valve, so the density in the throat is lower than the density at the inlet and less mass passes than an incompressible calculation would predict. The expansion factor Y is the correction for that, and it is where the gas choking boundary shows itself in the arithmetic.

## What Y does down the march

The expansion factor falls with the pressure drop ratio. It reads 0.966464 at an outlet pressure of 230.000000 psia, 0.906933 at 200.000000 psia, 0.849982 at 171.300000 psia, 0.787872 at 140.000000 psia, 0.728341 at 110.000000 psia and 0.688654 at 90.000000 psia.

Then it stops falling. On the rows at outlet pressures of 70.000000, 50.000000 and 30.000000 psia it reads 0.666667. The lab records what that figure is: the expansion factor on every choked row is 0.666667, which is two thirds to within one unit in the last place of a double. The engine forms it as one less a quotient, and on this gas that lands one unit in the last place above the double nearest two thirds, which the panel measures.

## Why the floor is exactly two thirds

Y falls linearly with the pressure drop ratio, and the terminal ratio is where it is floored. Put the terminal ratio into the linear form and the factor comes out at two thirds of unity, every time, for every valve style and every gas. The floor is therefore not a convention that somebody chose. It is the value the linear form takes at its own terminal point, which is why it is the same number on every choked gas service anybody ever sizes.

## What the coefficient does

The coefficient does what the expansion factor does. It reads 330.485071, 211.406903, 177.668417, 161.189447, 154.079391 and 152.218918 down the unchoked rows, and then 151.964887 on each of the last three. The engine reports choked flow on 3 rows of this march, counted over the 9 outlet pressures asked of the gas valve, with a row counting when the engine returns choked true.

Past the floor, further pressure drop buys nothing at all. The engine says so with the answer:

> `choked flow: x of 0.878 is at or past the terminal 0.680, so the flow is sonic in the vena contracta and further pressure drop buys nothing. The terminal ratio has been used for sizing, and the noise and trim wear at this condition need a multistage trim`

## The part of that message people skip

The sizing half of the message is benign: the terminal ratio has been used and the coefficient is correct. The second half is the engineering. A gas valve running sonic in the throat is a noise and wear problem whatever its coefficient says, and the remedy is staged letdown rather than a larger body.

## Exercise

Using the panel, take the rows at outlet pressures of 90.000000 psia and 70.000000 psia. Write down the pressure drop ratio, the ratio used, the expansion factor and the coefficient on each. Then say what the expansion factor reads on every choked row and why that same figure appears on choked gas services generally.
