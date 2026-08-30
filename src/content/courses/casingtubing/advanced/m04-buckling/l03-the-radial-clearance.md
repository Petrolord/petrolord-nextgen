# The radial clearance

The input nobody checks, and it is inside a square root.

{{panel:ct-tubing-explorer}}

## The definition

    radial clearance = (casing inside diameter - tubing outside diameter) / 2

For this completion, 3-1/2 inch tubing inside 7 inch 29 lb/ft casing:

    (0.1570736 - 0.08889999999999999) / 2 = 0.03408680000000001 m

Thirty four millimetres of room on each side.

## Where it appears

Under a square root, in the denominator.

    base = sqrt( EI x wc x sin(inc) / clearance )

So the buckling limits go as one over the square root of the clearance. Halve the clearance and the limits rise by a factor of the square root of two.

## Which way round is that

Tighter hole, HIGHER buckling limit. A string that has nowhere to go cannot buckle.

That is the opposite of the instinct that a tight hole is a problem. For buckling specifically, tight is good.

## The default

    clearance = casingIdM ? (casingIdM - odM) / 2 : 0.02

If no casing inside diameter is given, the engine assumes 20 mm.

That is a defensible default and it is also a silent one. A completion run without a casing size gets a buckling answer, and the answer is computed on a clearance that may be nothing like the real one.

Twenty millimetres against this completion's thirty four is a factor of 1.7 in clearance and 1.3 in the limit, which is enough to change the reported state.

## The floor

    Math.max(clearance, 1e-3)

A millimetre. It stops a zero or negative clearance from producing an infinite limit or a division by zero, and a negative clearance is not nonsense: it is what you get from a typo in a casing size, and the guard turns a silent absurdity into a very large finite number that a reader will question.

## What is missing

The clearance is taken as a single number for the whole string. A real completion has a tapered casing, and the tubing passes through more than one size.

It also ignores tubing couplings, which are larger than the pipe body and reduce the effective clearance at every joint. On a small annulus that is the number that actually matters.

## Exercise

Compute the radial clearance for 3-1/2 inch tubing inside 9-5/8 inch 47 lb/ft casing, inside diameter 0.22049739999999998 m.

Then compute the ratio of the sinusoidal buckling limits in the two casings, and say which completion is more prone to buckling.
