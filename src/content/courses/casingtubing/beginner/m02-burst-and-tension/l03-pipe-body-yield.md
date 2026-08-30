# Pipe body yield

The one rating in this course that is exact.

{{panel:ct-rating-explorer}}

## The formula

    F = Yp x A

with A the cross-sectional area of steel:

    A = pi / 4 x (D squared minus d squared)

That is not a fit, not an approximation and not a tolerance-adjusted number. It is the definition of yielding a bar in tension, applied to a bar that happens to be hollow.

## The 9-5/8 inch family at L-80

| weight | area (m2) | body yield (N) |
|---|---|---|
| 36 lb/ft | 0.006615767422768914 | 3649128.699880634 |
| 40 lb/ft | 0.007389517850670436 | 4075914.394202795 |
| 43.5 lb/ft | 0.008102556615256442 | 4469212.715274853 |
| 47 lb/ft | 0.008756343034066708 | 4829828.594282614 |
| 53.5 lb/ft | 0.010029970524247514 | 5532336.7585479375 |

Straight proportion. The body yield is the area times a constant, and the area is the only thing changing down the column.

## What it is compared against

The axial force at that depth, which is the buoyed weight of everything hanging below plus anything being pulled at surface. The next tier computes that profile; this tier only needs to know that the number it is compared against is a force in newtons.

## Where the tension is worst

At the TOP of the string, because that is where the most steel is hanging below. Every casing string is therefore heaviest and strongest at the top and lighter deeper down, which is the exact opposite of the collapse argument, and reconciling the two is what makes a tapered string a design rather than a lookup.

## No tolerance factor here

The area uses nominal dimensions with no 0.875. API does apply the wall tolerance to burst, where a thin spot is a local failure initiator, and not to the body yield, where the load is carried by the whole section and a local thin spot is averaged out along the joint.

## Exercise

Compute the steel area of the 20 inch 94 lb/ft joint from its diameter of 0.508 m and inside diameter of 0.48574959999999995 m.

Multiply by the K-55 yield of 379211635 Pa and check your answer against the panel. Then say how many metres of that pipe, buoyancy ignored, it would take to reach its own body yield at a weight of 139.8874066 kg/m.
