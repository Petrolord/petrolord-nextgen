# Exact at the well

A zero nugget makes kriging an exact interpolator: the surface passes through every data point. That is a strong property and this deck was built to demonstrate it, which makes it a good check on the whole chain.

## What exact means

At a data point, the kriging weights collapse so that the estimate is the measured value itself. Not close to it, equal to it, up to floating-point arithmetic.

So a cell whose centre coincides with a well should carry that well's mapped top exactly.

## Testing it on Ekene

Five of the six wells sit at map coordinates that are multiples of 100 m. With the deck's origin offset by half a cell, those wells land exactly on cell centres, and the deck's depth there should equal the mapped top.

| well | cell | mapped (m) | deck (m) |
|---|---|---|---|
| Ekene-1 | (11, 11) | 1548 | 1548 |
| Ekene-3 | (15, 24) | 1541 | 1541 |
| Ekene-4 | (27, 26) | 1590 | 1590 |
| Ekene-5 | (7, 20) | 1552 | 1552 |
| Ekene-6 | (20, 19) | 1546 | 1546 |

Five for five. That is not a coincidence and it is not a fit; it is the exactness property doing what it is supposed to do.

## The residual that is not zero

Two of those five carry a discrepancy of about 2.3e-13 m rather than a hard zero. Two tenths of a picometre.

That is not structure. The deck stores depths in FEET, so reading a well's depth back in metres is a unit round trip through a conversion factor that is not exactly representable in binary. The residual is arithmetic.

Knowing which of those two things you are looking at is the skill. A discrepancy at the thirteenth decimal is floating point; a discrepancy at the second is a modelling decision. The next lesson is about one of the second kind.

## Why this is worth testing

Because it checks the whole chain at once.

If the deck's depth at Ekene-1 came back as 1547.3 m, something between the well database and the TOPS block is wrong, and it could be the interpolator, the cell indexing, the coordinate offset, the unit conversion, or the ordering of the 900 values. One test catches all of them.

That is the same trick the earlier courses used. The decline curve course planted Arps parameters and checked the fit recovered them; the SCAL course planted a J-function and checked the collapse recovered it. Here the plant is the well tops themselves and the recovery is exactness at the data.

## When you would NOT want exactness

When the measurements have error, which in real life they do. A well top is picked from a log by a person, and two people pick differently. A surface forced through every pick honours that noise as though it were signal, and the result is a bumpy map with a spurious feature at every well.

That is what a non-zero nugget is for: it tells the interpolator how much of the scatter to treat as noise, and the surface then passes NEAR the data rather than through it.

This deck uses zero because the six tops are exact by construction. A real study would rarely be so lucky.

## The misconception to avoid

"Honouring the wells exactly makes the map more accurate." It makes the map more accurate AT THE WELLS, where you already knew the answer, and it can make the map worse everywhere else by propagating pick error into the interpolation. Accuracy at the control points is not the objective; it is a property with costs.

## Exercise

First, the deck reproduces five well tops exactly and two of those carry a residual of about 2.3e-13 m. Explain the residual in one sentence and say what a residual of 2.3e-3 m would have meant instead.

Second, describe the test you would run on a new deck to check its structure against the well database, and list four distinct errors that a single failure would flag.
