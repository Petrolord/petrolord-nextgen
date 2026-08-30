# The gas kick

The design case that decides most production casing, built out of one shoe pressure and one gradient.

{{panel:ct-loadcase-explorer}}

## The story

The well has flowed. Gas has entered the hole, the well is shut in, and the gas is sitting against the casing shoe at whatever pressure the formation there can hold.

Above the gas, up the inside of the casing, is more gas. Outside the casing, in the annulus behind the cement, is water at roughly hydrostatic.

## The shoe pressure

Three ways to set it, in the order the engine tries them.

1. A reservoir pressure, if one is given.
2. The fracture equivalent mud weight at the shoe times gravity times the shoe depth, if one is given.
3. Failing both, 1.2 times the mud hydrostatic at the shoe.

The published run gives a fracture equivalent mud weight of 1800 kg/m3 at a shoe of 2507.919699301 m, so the shoe pressure is 44269723.294470266 Pa.

That is a deliberate choice of philosophy: the casing is designed for the worst pressure the shoe can hold, on the argument that anything worse would break the formation down instead of the pipe.

## The column above it

    inside(z) = shoe pressure - gas gradient x (shoe depth - z)

with the gas gradient at 2300 Pa per metre, and the whole thing floored at zero.

At surface that gives 38501507.98608063 Pa. The gas column has given up less than 6 MPa over two and a half kilometres.

## The backup outside

Seawater at 1030 kg/m3, which is 10100.8495 Pa per metre. At the shoe that is 25332119.440726407 Pa.

Calling it seawater is a convention for a conservative low-density backup. A real design argues about whether cement, a fluid column or nothing at all is behind the pipe, and the answer changes the burst load substantially.

## The differential

At surface: 38501507.98608063 Pa inside against nothing outside.

At the shoe: 44269723.29447333 inside against 25332119.440726407 outside, a difference of 18937603.85374561.

The load is worst at the top by a factor of about two, and the next lesson is entirely about that.

## Exercise

Compute the burst differential at the midpoint of the string, 1253.959849651 m, from the published checkpoint values of 41385615.640276976 inside and 12666059.720363203 outside.

Then check that your three differentials, at surface, midpoint and shoe, fall on a straight line, and say what its slope is made of.
