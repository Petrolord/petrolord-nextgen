# The f function

One rational function carries the whole of the fracture's finite conductivity, and it takes the logarithm of a ratio as its only argument.

{{panel:st-pack-explorer}}

## The exact form

Write u as the natural logarithm of the dimensionless conductivity. The engine then evaluates

f(u) = (1.65 - 0.328 u + 0.116 u^2) / (1 + 0.18 u + 0.064 u^2 + 0.005 u^3)

and nothing else. There is no iteration, no table lookup and no second branch. A quadratic over a cubic, both in u.

The argument is a logarithm for a good reason. Dimensionless conductivity ranges over four decades across the valid band, and the pseudo-skin responds to its order of magnitude rather than to its value. Doubling a conductivity of 0.2 matters. Doubling a conductivity of 200 does not.

## What it does at the two ends

At high conductivity the cubic term in the denominator eventually outruns the quadratic in the numerator, so f falls towards zero. Physically that is the infinite conductivity limit, where there is no pressure drop along the fracture left to charge for.

At low conductivity u is negative, the numerator terms in u and u squared both add, and f climbs steeply. That is the starved fracture, where a large part of the benefit of the length is being eaten by friction inside the pack.

The sweep in this course shows both directions on real rows. At a dimensionless conductivity of 16.62461952126903 the function returns 0.7747563182826578. At 0.07728387174143661 it returns 3.7154822332881525, and that row also trips the correlation range warning because it sits below 0.1.

## The published value

For the published job the dimensionless conductivity is 0.6649847808507611, its logarithm is negative, and f comes out at 1.9246212796864688.

Hold that number for the next lesson. On its own it is a penalty and nothing more. It is the amount of benefit the finite pack fails to deliver, and it is subtracted from nothing until the length term arrives.

## Exercise

Evaluate the rational function by hand at u equal to zero and confirm you get the numerator constant, then say what dimensionless conductivity that corresponds to.

In the panel, move the design so that the dimensionless conductivity rises and confirm f falls.

State which of a high f and a low f is the better fracture, and why.
