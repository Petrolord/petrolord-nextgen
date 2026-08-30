# Standoff collapses at twenty metres

The fourth power runs out of clearance, and there is nothing to be done about it.

{{panel:cm-standoff-explorer}}

## The sweep

| spacing (m) | slant | horizontal |
|---|---|---|
| 6 | 0.940651796 | 0.907670585 |
| 8 | 0.902734964 | 0.848682467 |
| 9 | 0.8756208 | 0.806500315 |
| 10 | 0.841047763 | 0.752714218 |
| 12 | 0.742357202 | 0.599178961 |
| 14 | 0.590489629 | 0.362914958 |
| 15 | 0.488756107 | 0.2046456945935818 |
| 16 | 0.366330724 | 0.014185608531566366 |
| 18 | 0.04782550515901949 | 0 |
| 20 | 0 | 0 |

Both reach exactly zero, and the horizontal well gets there two metres sooner.

## Where zero comes from

Not from the centralizer. The centralizer never bottoms out at any of these spacings: on this casing it would take a load of 26969.69696969697 N, which at 90 degrees is a spacing of 78.03430781229383 m.

Zero comes from the SAG reaching the whole clearance:

    sag = clearance
    w_perp x L^4 / (384 E I) = 0.019049999999999997

Solve for L and you get

    17.021127200569346 m at 90 degrees
    19.009532790549464 m at 40 degrees

which is exactly where the two columns above hit zero.

## What zero means physically

The pipe is touching the wall at the middle of the span. There is no narrow gap at all, and the cement has no path down that side.

The model clamps at zero rather than going negative, which it would otherwise do: the formula would happily report a pipe deflected further than the hole allows.

## The two-metre difference between the wells

The sine of the inclination, again. It appears in the sag term linearly, and L is a fourth root of the inverse of it, so a factor of sin 40 over sin 90 in the load is a factor of its fourth root in the spacing:

    (1 / sin 40) to the power of a quarter = 1.1168

and 17.021127200569346 times 1.1168 is 19.009532790549464.

## The design point

Twenty metres is not a wide spacing. It is one centralizer every one and a half joints, and the number of centralizers on a real string is often argued down on cost.

The arithmetic says that argument has a hard floor, and the floor is much closer than it looks. Between 12 m and 16 m the horizontal well's standoff goes from a marginal 0.599178961025609 to a useless 0.014185608531566366.

Four metres of spacing, and the job goes from nearly acceptable to certainly channelled.

## Exercise

Using the fourth-root relationship, predict the spacing at which the sag would reach the clearance at 60 degrees of inclination.

Then say what that spacing would be in the CASED section, whose clearance is 0.021348699999999998 m.
