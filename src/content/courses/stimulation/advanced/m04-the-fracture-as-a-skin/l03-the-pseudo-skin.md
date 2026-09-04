# The pseudo-skin

Two terms, one subtracted from the other. One of them is a penalty for a finite pack and the other is the entire prize.

{{panel:st-pack-explorer}}

## The definition

The fracture pseudo-skin is the f function less the natural logarithm of the half-length divided by the wellbore radius.

That is the whole expression. The engine forms the length ratio from the half-length and the drilled wellbore radius, takes its logarithm, and subtracts it from f. It refuses to proceed unless the half-length is strictly greater than the wellbore radius and the wellbore radius is strictly positive, because the logarithm of a ratio at or below one would make a fracture shorter than the hole look beneficial.

For the published job f is 1.9246212796864688 and the pseudo-skin is -5.3116380662677045. Subtract the second from the first and the logarithm of the length ratio is 7.236259345954173, from a half-length of 150 m and a wellbore radius of 0.108 m.

## Why the second term is the prize

The length term enters as a logarithm of a ratio, so it grows with the number of decades between the fracture half-length and the hole. Going from a 0.108 m radius to a 150 m half-length is more than three decades of e, and every one of them is subtracted straight off the skin.

That is the reason a long fracture is worth so much in a tight rock. You are not making the hole slightly bigger. You are changing the scale at which the reservoir sees the well, and the inflow equation prices scale logarithmically.

Notice also that the two terms fight each other. Lengthening the fracture increases the logarithm, which helps, but at fixed proppant it lowers the dimensionless conductivity, which raises f and hurts. The pseudo-skin is the balance of those two, and that balance is precisely what the optimum in the previous module is finding.

## Reading the sign

A pseudo-skin of -5.3116380662677045 is a large negative number by any standard. A perfectly cleaned up damaged sandstone can only reach zero. The published carbonate acid job in this course reaches -1.287406553. The fracture is in a different class because only the fracture changes the geometry of the flow.

## Exercise

Take the published f and the published pseudo-skin, subtract, and confirm the logarithm of the length ratio.

Double the half-length in the panel and describe which of the two terms moved further, and in which direction the pseudo-skin went.

Say what the engine does if you enter a half-length smaller than the wellbore radius, and why that guard exists.
