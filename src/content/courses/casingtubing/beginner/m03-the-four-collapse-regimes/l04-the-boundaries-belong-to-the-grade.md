# The boundaries belong to the grade

Change the steel and all three regime boundaries move. Change the pipe and none of them do.

{{panel:ct-rating-explorer}}

## The claim

The three boundaries are functions of A, B, C, F and G, and those are functions of the yield strength alone. No diameter, no wall, no weight appears anywhere in them.

So the boundaries are a property of the GRADE. The pipe then contributes exactly one number, its ratio of diameter to wall, and the regime is decided by where that number falls.

## The table

| grade | yield / plastic | plastic / transition | transition / elastic |
|---|---|---|---|
| H-40 | 16.400699536079465 | 27.0054421842043 | 42.64275646019621 |
| K-55 | 14.810370514346236 | 25.008273533928673 | 37.20706040101535 |
| M-65 | 14.125951485129427 | 23.88184363633672 | 34.3947535731575 |
| L-80 | 13.38484007633007 | 22.471346692258702 | 31.016243791002484 |
| T-95 | 12.849698106472596 | 21.33445965354013 | 28.362516303318248 |
| P-110 | 12.440631229717088 | 20.406388232261058 | 26.223279289939384 |
| Q-125 | 12.112541043965704 | 19.632205518950393 | 24.459592946684314 |

## Every column falls as the grade rises

That is the shape to remember, and it is worth being clear about why it is not backwards.

A high-strength pipe can carry more compression before it yields. So the pressure at which it would yield is higher, and the pressure at which it would buckle elastically is unchanged, because buckling does not care about strength. The two curves therefore cross at a LOWER slenderness, and the elastic regime starts sooner.

Strong steel does not stop a thin pipe from buckling. It just means the pipe reaches buckling before it reaches yielding.

## What this does to a design

Raising the grade of a pipe near a boundary can move it into the next regime up, and the next regime up is always less sensitive to the grade.

There is therefore a point of diminishing return in collapse that has nothing to do with cost and everything to do with which formula the pipe has fallen into.

## The one pipe that shows it plainly

The 20 inch 94 lb/ft joint sits at 45.662100456621005. Every boundary in the table above is below that. So that pipe is in the elastic regime at every grade in the catalog, and module 5 is about what follows.

## Exercise

The 13-3/8 inch 54.5 lb/ft pipe sits at 35.19736842105264.

Walk down the grade column and find the grade at which it stops being in the transition regime and starts being in the elastic one. Then say what happens to its collapse rating at that point.
