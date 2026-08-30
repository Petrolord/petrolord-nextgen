# The four formulas

The published 5C3 system, written out, with the one unit boundary the engine allows.

{{panel:ct-rating-explorer}}

## The coefficients

API Bulletin 5C3 gives three polynomials in the yield strength, in thousands of pounds per square inch, and this engine evaluates them in psi directly:

    A = 2.8762 + 0.10679e-5 x Yp + 0.21301e-10 x Yp squared - 0.53132e-16 x Yp cubed
    B = 0.026233 + 0.50609e-6 x Yp
    C = -465.93 + 0.030867 x Yp - 0.10483e-7 x Yp squared + 0.36989e-13 x Yp cubed

and two more derived from those:

    F and G, from A and B by way of x = 3 x (B/A) / (2 + B/A)

## The four

    yield:      P = 2 x Yp x (dt - 1) / dt squared
    plastic:    P = Yp x (A / dt - B) - C
    transition: P = Yp x (F / dt - G)
    elastic:    P = 46950000 / (dt x (dt - 1) squared)

Only the last one is free of the yield strength, and that is the whole of the elastic story.

## The unit boundary

Those polynomials are fitted to psi. There is no SI form of them, because the constants ARE the fit.

So this engine, which is strict SI everywhere else, converts the yield strength to psi inside the collapse function and converts the answer back, using an exact divisor of 6894.757293168 pascals per psi. That is the single sanctioned unit boundary in the module, and the header says so.

Pretending an empirical fit can be rewritten in SI without refitting is how a rounded constant becomes a silent bias.

## The boundaries

Three values of the ratio separate the four:

    dtYp separates yield from plastic
    dtPt separates plastic from transition
    dtTe separates transition from elastic

Each is a closed-form expression in A, B, C, F and G, so each is a function of the yield strength and of nothing else.

## Continuity

The four formulas are constructed so that adjacent ones agree at their shared boundary. The engine's own test probes a hair either side of all three boundaries at every grade and requires the two answers to match, which is the strongest single check that the coefficient set has been transcribed correctly.

## Exercise

At K-55 the boundaries are 14.810370514346236, 25.008273533928673 and 37.20706040101535.

Place the 20 inch 94 lb/ft pipe, the 13-3/8 inch 68 lb/ft pipe and the 9-5/8 inch 53.5 lb/ft pipe into their regimes at that grade, using the ratios from the previous lesson.
