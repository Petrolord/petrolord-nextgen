# The elastic regime does not know the grade

Ten grades, one collapse rating, to the last bit of the double.

{{panel:ct-rating-explorer}}

## The finding

The 20 inch 94 lb/ft joint sits at a ratio of 45.662100456621005, which is above the transition-to-elastic boundary at every one of the ten grades in this catalog.

So all ten collapse in the elastic regime, and the elastic formula is

    P = 46950000 / (dt x (dt - 1) squared)

There is no yield strength in it.

## The table

| grade | burst (Pa) | body yield (N) | collapse (Pa) |
|---|---|---|---|
| H-40 | 10569662.480999999 | 4789427.756514285 | 3554024.408995863 |
| K-55 | 14533285.911375001 | 6585463.165207142 | 3554024.408995863 |
| M-65 | 17175701.531625 | 7782820.104335713 | 3554024.408995863 |
| L-80 | 21139324.961999997 | 9578855.51302857 | 3554024.408995863 |
| C-90 | 23781740.58225 | 10776212.452157142 | 3554024.408995863 |
| T-95 | 25102948.392375 | 11374890.921721427 | 3554024.408995863 |
| P-110 | 29066571.822750002 | 13170926.330414284 | 3554024.408995863 |
| Q-125 | 33030195.253125004 | 14966961.739107141 | 3554024.408995863 |

Burst spans a factor of exactly 3.125. Body yield spans the same factor. Collapse spans nothing at all: the last column is one number written eight times, and it is the same number in the other two grades as well.

## This is the only row in the catalog that does it

Of the 28 rows, exactly one has the same collapse at all ten grades, and it is this one. The 20 inch 106.5 lb/ft row very nearly manages it: nine of its ten grades give 5320658.364796804, and only H-40 breaks the pattern, because H-40 is weak enough to already be in the transition regime at a ratio of exactly 40.

## Why it is not a bug

Because it is what the physics says. A pipe that goes unstable and buckles inward has not yielded anywhere, so how strong the steel is has not yet come into it. The buckling pressure of a ring is set by its stiffness and its geometry, and stiffness is Young's modulus, which is essentially the same for every grade of steel there is.

That last point is the real content. Strength varies by a factor of three across this table. Stiffness does not vary at all.

## What a buyer should take from it

If a 20 inch surface string is collapse-critical, ordering it in P-110 instead of K-55 doubles the price of the steel and buys exactly zero collapse resistance.

The only thing that buys collapse in the elastic regime is wall thickness, and the 106.5 lb/ft row is the answer to the question the P-110 order was trying to ask.

## Exercise

Open the panel on the grades view with the 20 inch 94 lb/ft row selected and confirm the flat collapse line.

Then switch to the 9-5/8 inch 47 lb/ft row and watch the same line become steep. Say what changed, in terms of one number.
