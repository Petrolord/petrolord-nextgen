# The D over t ratio

The single number that decides how a pipe collapses.

{{panel:ct-rating-explorer}}

## The definition

    D over t = outside diameter / wall thickness

Dimensionless. A drinks can is around 1000. Structural pipe is 20 to 60. Casing runs from about 17 to about 46 in this catalog.

## Why it and not the wall

Because collapse is a stability problem, and stability problems are governed by slenderness rather than by absolute size. A pipe twice as big in every dimension has the same ratio and buckles at the same pressure.

That is genuinely true only in the elastic regime, where the elastic formula contains the ratio and nothing else. In the other three regimes the yield strength enters as well, and scale invariance is lost.

## The catalog, ordered

| pipe | D over t |
|---|---|
| 20 inch 94 lb/ft | 45.662100456621005 |
| 20 inch 106.5 lb/ft | 40 |
| 13-3/8 inch 54.5 lb/ft | 35.19736842105264 |
| 20 inch 133 lb/ft | 31.49606299212598 |
| 13-3/8 inch 61 lb/ft | 31.1046511627907 |
| 13-3/8 inch 68 lb/ft | 27.864583333333332 |
| 9-5/8 inch 36 lb/ft | 27.343750000000004 |
| 9-5/8 inch 47 lb/ft | 20.391949152542374 |
| 9-5/8 inch 53.5 lb/ft | 17.660550458715594 |

Notice that the 20 inch 106.5 lb/ft row comes out at exactly 40, because its wall is exactly half an inch and its diameter is exactly 20 inches. That is an accident of the published table, and it makes a convenient landmark.

## The direction

Big ratio means thin and slender: elastic collapse, low rating, grade does not help.

Small ratio means thick and stubby: yield collapse, high rating, grade helps in direct proportion.

## Surface casing is the thin end

The 20 inch rows sit at the top of that list and the 9-5/8 inch rows at the bottom. Large-diameter shallow casing is nearly always the slender case, and it is nearly always in the elastic or transition regime.

That is not a coincidence. Big casing is cheap to make thin and it does not have deep pressure to survive, so the tables carry thin rows for it.

## Exercise

The elastic collapse formula, in the psi units the fit was published in, is

    P = 46950000 / (dt x (dt - 1) squared)

Evaluate it for a ratio of exactly 40 and for one of 45.662100456621005, and note how fast collapse falls off with slenderness. Both answers are in psi.
