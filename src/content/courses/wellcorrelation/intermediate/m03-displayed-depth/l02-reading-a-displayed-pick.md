# Reading a displayed pick

One of the six graded readings in this tier is a displayed depth: Ekene-2's TOP_SAND on the section flattened on TOP_A at 1450 m. The answer is 1503 m and it is graded to 0.01 m, so there is no room to be nearly right. This lesson works it, gives the whole displayed column, and names the three ways people get it wrong.

## The formula is one addition

Two steps, in this order.

$$shift = datum - md(TOP\_A)$$

$$displayed = md(pick) + shift$$

The shift is computed once per well from that well's own flattening top. Then every pick in that well, TOP_A included, uses the same shift. There is no second subtraction and no per-pick adjustment. A well has one number, and the number is applied everywhere in that column.

## The graded one, worked

Ekene-2's TOP_A is at a measured 1512 m, so its shift is

$$shift = 1450 - 1512 = -62$$

Its TOP_SAND is at a measured 1565 m, so

$$displayed = 1565 + (-62) = 1503$$

The displayed depth is 1503 m, which is the graded value. Say the addition out loud once: measured pick plus the well's shift, and the shift is negative here, so the pick moves up the display by 62 m.

## The displayed column

Here is the whole set, on this datum.

| well | TOP_A measured | shift | A-to-SAND | TOP_SAND displayed | all four tops |
|---|---|---|---|---|---|
| Ekene-1 | 1500 | -50 | 48 | 1498 | yes |
| Ekene-2 | 1512 | -62 | 53 | 1503 | yes |
| Ekene-3 | 1495 | -45 | 46 | 1496 | yes |
| Ekene-4 | 1530 | -80 | 60 | 1510 | no |

Read that table twice, because the next module lives in it. The A-to-SAND column is the measured interval between the two tops in each well, and it is untouched by the flattening. The displayed column is where the sand pick draws.

Notice that the displayed column and the interval column carry the same information here, offset by the datum. Ekene-1 displays at 1498, which is 1450 plus 48. Ekene-2 at 1503, which is 1450 plus 53. Ekene-3 at 1496, which is 1450 plus 46. Ekene-4 at 1510, which is 1450 plus 60. That is not a coincidence of these numbers. It follows from the algebra: the displayed TOP_SAND is the measured TOP_SAND plus the shift, the shift is 1450 minus the measured TOP_A, and the two measured depths combine into the datum plus the interval. Flattening on TOP_A turns the sand line into a direct picture of the A-to-SAND interval.

## The check that costs nothing

Substitute TOP_A itself into the two formulas and the measured depth cancels:

$$displayed = md + (datum - md) = datum$$

So every well's TOP_A displays at exactly 1450 m, in every well, by construction. This is algebra rather than an approximation, and it does not depend on the numbers. Before you read anything else off a flattened panel, check that the flattening top sits on one perfectly flat line at the datum depth. If it does not, the datum is not what you think it is.

## The three wrong answers

**115.** This comes from subtracting the datum from the pick, 1565 minus 1450. The result is a real quantity, but it is the distance from the datum down to the sand pick in measured terms, not a displayed depth. The giveaway is its size: a displayed depth on this panel is a number in the 1450 to 1600 band, so a three-digit answer near 115 cannot be one.

**1627.** This is a sign flip, 1565 plus 62. The shift is negative here, so a displayed depth in this section is always shallower than its measured depth. Every well moves up. If one of your displayed numbers came out deeper than the measured pick it came from, you added where you should have subtracted.

**1515.** This is Ekene-2's pick with Ekene-1's shift, 1565 minus 50. It is the error that survives a careful calculation, because nothing about the arithmetic looks wrong. The defence is procedural: write the shift at the head of the well's column and do not read across rows.

The lead-in habit that avoids all three is to name the well, write its shift, then add. Well, shift, add.

## Why an integer is graded to a hundredth

The graded answer is 1503 m and the tolerance on it is 0.01 m. Every number in this section is a whole metre, so the tolerance never comes into play here, and that is the point of it. The tolerance is there because the flattening arithmetic runs on real picks in real projects, where a top might be at 1565.4 m and a datum at 1450.0 m, and the same two lines of arithmetic still apply. Nothing about the method changes when the decimals arrive. If your answer differs from 1503 by more than a centimetre, the cause is one of the three errors above rather than rounding.

The panel below flattens the section on a top and datum you choose, and lists the shift, the displayed depth and the interval for every pick.

{{panel:wc-flatten-explorer}}

## Exercise

Compute Ekene-3's shift on this tier's datum, then use it to get the displayed depths of that well's TOP_SAND, at a measured 1541 m, and its BASE_SAND, at a measured 1570 m. Then check your TOP_SAND answer against the table above, and check that Ekene-3's TOP_A, at a measured 1495 m, lands on the datum.

Self-check: the shift is 1450 minus 1495, which is -45, matching the table. TOP_SAND displays at 1541 minus 45, which is 1496 m displayed, matching the table. BASE_SAND displays at 1570 minus 45, which is 1525 m displayed. TOP_A displays at 1495 minus 45, which is 1450 m displayed, the datum, as it must be in every well. If your BASE_SAND answer came out deeper than 1570, you flipped the sign of the shift.
