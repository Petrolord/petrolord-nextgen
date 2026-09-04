# The join at the bubble point

The one place in this course where you can check your own arithmetic against an identity instead of against a tolerance.

{{panel:pd-ipr-explorer}}

## The identity

Above the bubble point the composite is a straight line and nothing else, so the rate at the bubble point is exactly the index times the drawdown to it.

BONNY-7's index is 2.00000000 stb/d/psi and its drawdown at 1300 psia is 1440.0000 psi. Multiply them: 2880.000000 stb/d, which is both the inflow rate the engine reports at 1300 psia and the undersaturated block it prints. No correlation, no fitted constant, no numerical method.

FORCADOS-3 does it with numbers nobody chose: index 1.57194033 stb/d/psi, drawdown at 2450 psia of 1270.0000 psi, rate at the bubble point 1996.364220 stb/d, undersaturated block 1996.364220 stb/d. The product reproduces that to the precision the index is printed at, since it cannot be sharper than its factors.

## Why an identity beats a tolerance

A tolerance says two things are close. It cannot say which is right, and two implementations of one wrong formula agree perfectly.

An identity says three printed numbers stand in an exact arithmetic relationship, and if they do not, one is wrong: no band, no judgement. The multiplication closes only if the index is the well's, the bubble point is the fluid's at reservoir temperature, and the reservoir pressure is the one used to calibrate, at the same datum.

## Why the join is exact

The Vogel term below the join has the flowing pressure divided by the bubble point as its argument. At the bubble point that argument is one, and Vogel's expression at one is zero, so the term contributes nothing and the rate is precisely the line's. The halves are not forced to meet; the shape was chosen to vanish there.

The slope is continuous too, because differentiating that term at the bubble point returns minus one over the index. BONNY-7 reads minus 0.50000000 psi per stb/d at 216, 649, 1297, 1946 and 2595 stb/d, at 2632.000000, 2415.500000, 2091.500000, 1767.000000 and 1442.500000 psia, all above 1300 psia, then minus 0.57666066 at 3243 stb/d and 1105.576792 psia. FORCADOS-3 holds minus 0.63615646 psi per stb/d, minus one over 1.57194033, at 207, 620, 1241 and 1861 stb/d, then minus 0.72224059 at 2482 stb/d.

## What a wrong bubble point does

Too low, and the linear stretch runs too far: the rate at the join comes out high and the saturated block, which scales with the bubble point, comes out small. Set to 0 psia that block vanishes and BONNY-7's open flow becomes 5480.000000 stb/d instead of 4324.444444, on a curve with a perfectly constant slope of minus 0.50000000 psi per stb/d. Set at or above the reservoir pressure it clamps and the curve is Vogel from the first psi. None of the three warns, because none is an arithmetic error.

## What the join refuses

It is exact about the model, not the well. Standing's shape was built to vanish at the join and return the index in slope, so of course the halves meet cleanly; no measurement here confirms a real well is smooth there.

And it does not validate the index, only that the three inputs are consistent with the printed rate at the join. Derive all three from a below-bubble test read as a straight line and the identity still closes, on a curve that is not the well.

## Exercise

Multiply 2.00000000 stb/d/psi by 1440.0000 psi by hand and write the answer beside BONNY-7's rate at 1300 psia and its undersaturated block.

Then put its slope at 2595 stb/d beside minus one over its index and say what their equality means at the join.
