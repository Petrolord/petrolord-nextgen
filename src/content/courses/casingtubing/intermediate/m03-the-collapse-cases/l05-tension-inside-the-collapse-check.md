# Tension inside the collapse check

The combined-loading derating is not a separate check. It happens inside this one.

{{panel:ct-loadcase-explorer}}

## Where it happens

At every depth inside every section, the collapse loop does this:

    axial stress = max(0, axial force at this depth) / steel area
    collapse rating = api5c3Collapse(od, wall, yield, axial stress)
    safety factor = rating / collapse differential

So the rating is recomputed at every depth. There is no single collapse rating for a section under this check, because the tension is different at every depth.

## Why max(0, ...)

Because API does not credit compression. A section in compression is given its undegraded collapse rating rather than an improved one, which is the conservative choice.

The engine writes it as a max rather than a branch, which makes the choice visible in one character.

## The two effects fight

Going DOWN a section, the collapse differential grows because the mud column grows. Also going down, the axial force falls because there is less string hanging below, so the collapse RATING rises.

Load up, capacity up. Which wins?

## On this string, the load wins

The reported governing depth for collapse is the bottom of the section, every time, on all four collapse cases. So the growing differential beats the rising rating.

That is the usual outcome and it is not guaranteed. On a very heavy, very deep string with a thin upper section, the top can govern.

## How much the derating is worth here

At the bottom of section 2 the axial force is zero, so the collapse rating there is the undegraded one and the derating contributes nothing at all to the governing number.

That is not a coincidence either. The governing depth for collapse is the deepest point, and the deepest point of the whole string is where the hanging weight is zero by construction.

So on a single-section string the collapse check and the combined-loading derating never meet at the governing depth. It is only on a tapered string, where a section's bottom still has string hanging below it, that the two interact.

## Which section shows it

Section 1 ends at 1454.59342559458 m, and there is a kilometre of section 2 hanging below that point. The axial force there is 626672.741090452 N on the evacuation case, giving a real axial stress in the 9-5/8 inch 47 lb/ft section.

So section 1's governing collapse number DOES carry a derating, and section 2's does not.

## Exercise

Section 1's steel area is 0.008756343034066708 m2 and its P-110 yield is 758423270 Pa.

Compute the axial stress at 1454.59342559458 m from the force above, express it as a fraction of that yield, and then use the Associate tier's adjusted-yield formula to say how much of the collapse rating is being given away there.
