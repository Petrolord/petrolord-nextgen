# One well, then two, then three

Solve the same header three times, adding one well each time, and every well already on it makes strictly less than it did. The published ladder `wells_fight` exists to put a number on that.

{{panel:pd-network-explorer}}

## The ladder

Three solves, one separator at 180 psia, the same trunk every time.

| Wells on the header | Header, psia | W-0, lb/d | W-1, lb/d | W-2, lb/d |
| --- | --- | --- | --- | --- |
| 1 | 253.813945361 | 3522.516744485 | | |
| 2 | 370.837866311 | 3421.411637345 | 2242.495611803 | |
| 3 | 670.128002137 | 3137.891322295 | 2007.745062176 | 3931.285844958 |

W-0 was never touched. Its reservoir, its inflow curve and its flowline are identical in all three rows. It makes 3522.516744485 lb/d alone and 3137.891322295 lb/d with two companions, a loss of 384.625422 lb/d, which is 10.919052 percent of itself.

W-1 tells the same story on a shorter run: 2242.495611803 lb/d with one companion and 2007.745062176 lb/d with two, a loss of 10.468272 percent.

## Where the loss goes

Nowhere. It is not transferred to the new wells, it is simply not produced. Total delivered rose from 3522.516744 lb/d to 9076.922229 lb/d, so the two extra wells bought 5554.405485 lb/d between them. Neither of those two is ever solved alone in this wave, so there is no solo sum for this ladder to set that against, and inventing one by adding rates measured on other rungs is the error this module exists to prevent.

Adding wells to a gathering system is always worth something and never worth what the well test says.

## Why no single-well study can find this

Every single-well analysis is run against a wellhead pressure somebody typed in. W-0's wellhead is 886.881507360 psia in the one well case, 968.085702646 psia in the two well case and 1172.493407776 psia in the three well case. Nothing about W-0 changed. The number that moved was supplied by the other wells, and a study that treats it as an input cannot produce it as an output.

## What was checked on these answers

The engine reports converged = true on all three rows, in 7, 7 and 6 iterations. `solveNetwork` does not call `checkConservation`, so a converged flag is a statement about the iteration and about nothing else in the return.

What stands behind these rows is the independent bisection referee, which solves the same ladder with no Jacobian and no linear algebra and publishes the golden values. The engine lands -2.7001e-12 psia from it on the one well header, -2.8024e-11 psia on the two well header and -4.5986e-10 psia on the three well header.

## The mistake

Building a development case by adding well test rates. The three solo rates are the promise and 9076.922229 lb/d is the delivery. A well that has been on a manifold for a year is already paying this and its test, taken with the manifold live, already includes it. A brand new well's test does not.

## Exercise

Run all three rows of the ladder in the panel and record W-0 in each. Then say what W-0 would have to be given to hold its one well rate with two companions on the header.
