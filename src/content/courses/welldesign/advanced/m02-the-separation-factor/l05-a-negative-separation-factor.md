# A negative separation factor

Where the scale breaks, and what happens if you keep reading it.

{{panel:wd-clearance-explorer}}

## The observation

One of the eleven standard cases has a minimum separation factor BELOW ZERO.

That is not an error. The numerator of the factor is the geometric clearance, the centre-to-centre distance less the two hole radii and the tool allowance. When the two uncertainty envelopes overlap far enough, that numerator goes negative, and so does the factor.

## What it means physically

The two wells, at the chosen confidence, might be in the same place. Not close: overlapping.

That is an absolute no-go, and no amount of monitoring makes it acceptable. The plan has to change.

## Where the scale breaks

Here is the part worth the lesson.

For a POSITIVE factor, a larger number is better, and the number is a ratio of clearance to uncertainty. Doubling the clearance doubles the factor.

For a NEGATIVE factor, the numerator is fixed and negative, and the denominator is the uncertainty. So increasing the uncertainty moves the factor TOWARDS ZERO, which reads as an improvement.

Open the panel's sensitivity view on the kicked-off case and read it directly. The published assumptions give about minus 0.61. Lowering the confidence factor from 3.5 to 2.0 gives about minus 1.06, which is worse. Raising it to 5.0 gives a number closer to zero, which is better.

The ratio between the k = 5 case and the k = 2 case is exactly two fifths, which is 2 over 5: the factor is inversely proportional to k, because the numerator does not depend on k at all.

## The other two rows

**Doubling the surface position uncertainty**, from 0.5 to 1.0 m, moves the factor from about minus 0.61 to about minus 0.30. Admitting that you know the wellhead position less well makes the pair look safer.

**Removing the tool projection allowance**, setting it to zero, moves it from about minus 0.61 to about minus 0.44. That one at least is physically sensible: removing a subtraction from the numerator makes the numerator less negative.

But the first is not. A worse survey should never improve a clearance statistic, and on a negative factor it does.

## Why this is not a bug

The separation factor is defined as a ratio and it is designed to be read positive. Below zero it is outside the range it was designed for, and a ratio whose numerator has changed sign does not behave like the same statistic any more.

The correct response is not to fix the formula. It is to stop reading the factor and read the NUMERATOR instead: the geometric clearance, in metres, which is negative and which no assumption about uncertainty changes.

## What to report

For an overlapping pair, report the centre-to-centre distance and the geometric clearance in metres, and say that the factor is negative and therefore not meaningful as a ranking.

A table of negative separation factors sorted by magnitude is actively misleading, because it ranks the pairs in the order of their uncertainties rather than their danger.

## The general lesson

Any statistic that is a ratio has a range over which it is meaningful. Outside that range it continues to produce numbers, and the numbers continue to look comparable.

This course has met the same shape before at the reservoir level. A dimensionless index is a convenience for the ordinary case and a trap at the edges, and knowing where its edges are is part of knowing what it means.

## The misconception to avoid

"A separation factor of minus 0.2 is better than one of minus 0.8." It means the uncertainties are larger, or the wells are further into overlap with a bigger denominator. Ranking overlapping pairs by their factor sorts them by how badly they are surveyed. Rank them by clearance in metres.

## Exercise

Open the panel's sensitivity view and record all five rows for the kicked-off case.

Confirm the two-fifths ratio between the k = 5 and k = 2 rows. Then explain, in one sentence each, why the surface-position row moves the number the way it does and why that direction is the wrong signal.
