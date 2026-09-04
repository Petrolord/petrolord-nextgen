# What a linkage refuses

The closure knows six lengths and a crank angle. It does not know there is a well underneath it.

{{panel:pd-string-explorer}}

## The inputs are the whole story

Front arm 106.6667 in, rear arm 64 in, pitman 80 in, crankshaft 92.8 in behind and 60.8 in below the saddle bearing, crank radius 28.8 in. No rod string, no fluid, no plunger, no pressure. Every number it returns, a stroke of 106.687716837 in, an upstroke fraction of 0.544444444444, a largest torque factor of 56.305306799 in, comes out of those six lengths.

## A torque factor is a length

The largest torque factor on the published unit is 56.305306799 in. Inches. It becomes a torque only when something supplies a load to multiply it by, and the closure supplies none. The designation the gearbox is checked against is in the other unit: C-320D-200-100 carries a rating of 320000 in-lb. The closure hands over one factor and never the product.

## The stroke it gives is not the stroke the pump gets

The 106.687716837 in is the travel of the polished rod. Hang a rod string under it and the load at the bottom stretches the string before the plunger moves. On the published taper a 1.7500 in plunger working against 1950.0 psi of differential carries a fluid load of 4690.299657039 lb, and that load alone stretches the string 17.560655738 in.

No linkage dimension appears anywhere in that 17.560655738 in. Change the pitman, the crankshaft position or the front arm and the stretch is untouched, because it belongs to the string and the load. The surface stroke and the pump's stroke are two different quantities that share a unit.

## The mistake

Sizing a unit on stroke alone. The stroke is the one thing the closure is confident about, so it is what a designer reaches for, and it is the number the string underneath is about to reduce. A unit chosen because 106.687716837 in looked ample was chosen on a quantity the pump never receives.

## What it refuses

It refuses a geometry that does not close, at any crank angle: shorten the pitman to 20 in and the reply is `ok = false` with the message "The linkage does not close at every crank angle: with these dimensions the pitman cannot reach the beam. Check the crank radius, the pitman length and the crankshaft position."

It refuses to guess a unit from a name: a string that is not a designation returns null. And it refuses, completely, to have an opinion about loads. Position and velocity are all it computes, and both are geometry.

## Exercise

List the six dimensions of the published unit, then list every quantity the closure returns.

Beside each returned quantity, write whether a rod string could change it. Say what that leaves the linkage responsible for.
