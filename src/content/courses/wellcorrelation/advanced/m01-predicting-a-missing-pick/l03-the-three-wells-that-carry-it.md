# The three wells that carry it

Everything this tier produces comes out of three wells. Ekene-1, Ekene-2 and Ekene-3 each carry TOP_A, TOP_SAND and TOP_B, so each one gives you a measured distance from a marker Ekene-4 has down to the marker Ekene-4 lacks. Those distances are the entire raw material of the prediction. This lesson lays them out, and then spends the rest of its length on what a sample of three costs you, because that cost is quoted in the final answer.

## The data

| well | TOP_A | TOP_SAND | TOP_B | TOP_A to TOP_B | TOP_SAND to TOP_B |
| --- | --- | --- | --- | --- | --- |
| Ekene-1 | 1500 | 1548 | 1640 | 140 | 92 |
| Ekene-2 | 1512 | 1565 | 1662 | 150 | 97 |
| Ekene-3 | 1495 | 1541 | 1628 | 133 | 87 |
| Ekene-4 | 1530 | 1590 | missing | to predict | to predict |

All depths and intervals are in metres and every depth is a measured depth. The two right-hand columns are subtractions you can check on sight: 1640 minus 1500 is 140 in Ekene-1, 1662 minus 1512 is 150 in Ekene-2, and 1628 minus 1495 is 133 in Ekene-3. The TOP_SAND column works the same way, 1640 minus 1548 is 92, 1662 minus 1565 is 97, and 1628 minus 1541 is 87.

Ekene-4 sits in the table because its TOP_A of 1530 m and its TOP_SAND of 1590 m are the anchors the prediction will be added to. Its two interval cells are the answer, not an input.

## Read the columns before you average them

Take the two interval columns as objects in their own right for a moment.

The TOP_A to TOP_B column runs 140, 150 and 133 m. Its largest value is 17 m above its smallest, since 150 minus 133 is 17. That is a wide column against a typical value near 140 m.

The TOP_SAND to TOP_B column runs 92, 97 and 87 m. Its largest is 10 m above its smallest, since 97 minus 87 is 10.

Two facts follow, and both are worth carrying forward without pursuing them yet. Neither column is constant, so neither prediction will be exact. And the two columns are not equally spread, which is a hint that the choice of starting marker is a real choice rather than a matter of taste. Module 3 takes that hint seriously. Module 2 uses the first column.

Notice also that the well ordering is the same in both columns. Ekene-2 is the thickest in each, Ekene-3 the thinnest in each, and Ekene-1 in between. The three wells behave consistently, which is mild support for the idea that the section varies smoothly rather than erratically. Three wells cannot establish that, and the consistency is still better than its absence.

## Three is a small sample, and here is the bill

Everything above rests on three observations. That number is not a detail to note in passing and then forget. It changes what your result can claim.

**A mean of three is unstable.** Each well carries a third of the weight. If Ekene-2's TOP_B pick moved by 3 m, the mean of the TOP_A to TOP_B column would move by 1 m. There is no crowd of other wells to absorb a single revision, so the prediction is only as settled as its least settled input pick.

**You have a range, not a distribution.** Three numbers tell you roughly where the middle is and roughly how far apart the ends are. They do not tell you the shape of the variation, whether the spread you see is typical, or how likely a fourth well is to sit outside the observed ends. Any statistical machinery beyond a mean and a range would be decoration on this sample size, and it would make the answer look firmer than it is.

**The observed spread understates the real one.** A range can only widen as wells are added, because a new value either falls inside the existing ends or extends one of them. The 17 m spread in the TOP_A to TOP_B column is the spread of three wells, and the field's true spread is at least that and probably more. Treat it as a floor.

**You cannot test the method.** With three carriers, holding one back to see whether the other two predict it is possible arithmetic and weak evidence, because each test would then rest on two wells. There is no honest way to validate the approach on this dataset. You are relying on the reasonableness of the assumption rather than on a demonstrated track record.

**There is no spatial control worth the name.** Three points cannot show you a trend surface, a direction of thickening or a gradient you could interpolate along. They give you a middle value and nothing about where in the section that middle value applies best.

## What the small sample does not cost

The picks themselves are not weakened by there being three of them. Each of the six depths in the table is a measurement, made in a wellbore, on logs. The uncertainty this lesson is describing is uncertainty about how those measurements transfer to a fourth location, and that is a different thing from doubt about the measurements.

So the honest position is neither to distrust the data nor to over-read it. You have three good observations. Three good observations support a prediction with a stated range. They do not support a confident single depth, and no amount of arithmetic performed on them will change that.

## Exercise

Using only the table above, compute each well's TOP_A to TOP_SAND interval, then say whether Ekene-4 falls inside or outside the range set by the three wells that carry TOP_B. State in one sentence why that answer should make you cautious about borrowing an average from those three wells and applying it to Ekene-4.

Self-check: the intervals are 1548 minus 1500, which is 48 m in Ekene-1; 1565 minus 1512, which is 53 m in Ekene-2; and 1541 minus 1495, which is 46 m in Ekene-3. Ekene-4's is 1590 minus 1530, which is 60 m, and that falls outside the 46 to 53 range set by the three carriers. The caution is that Ekene-4 is not an average member of this group in the one interval where all four wells can be compared, so an average borrowed from the three of them is being applied to a well the section has already shown to be atypical.
