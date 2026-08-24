# The capstone walkthrough

The Expert capstone for this course is called Predict the missing TOP_B in Ekene-4, and it is short. Ekene-4 reached total depth above TOP_B. You predict the missing pick two ways from the three wells that carry it, project the mean TOP_A to TOP_B interval down from TOP_A for the layer-cake estimate and the mean TOP_SAND to TOP_B interval down from TOP_SAND for the other, and report both predictions, their spread, the two mean intervals and the structural relief of TOP_B where it is drilled. Six numbers are graded.

This lesson walks the six in capstone order, gives the unit and tolerance of each as the assessment defines them, and says where each one is read.

## The six graded fields

| Field | Unit | Tolerance |
| --- | --- | --- |
| Mean TOP_A to TOP_B interval | m | 0.01 |
| Mean TOP_SAND to TOP_B interval | m | 0.01 |
| Ekene-4 TOP_B, layer-cake estimate | m | 0.01 |
| Ekene-4 TOP_B, from TOP_SAND | m | 0.01 |
| Spread between the two estimates | m | 0.01 |
| TOP_B structural relief (3 wells) | m | 0.01 |

**1. Mean TOP_A to TOP_B interval, in m, tolerance 0.01.** The value is 141 m. Read it from the mean TOP_A to TOP_B tile, which is on the panel whichever marker button is selected. With the from TOP_A button active it also appears in the marker tile and the table column shows the three intervals it averages, 140 m in Ekene-1, 150 m in Ekene-2 and 133 m in Ekene-3. By hand it is 423 divided by 3.

**2. Mean TOP_SAND to TOP_B interval, in m, tolerance 0.01.** The value is 92 m, from the mean TOP_SAND to TOP_B tile. Select the from TOP_SAND button and the table column shows the three intervals, 92 m, 97 m and 87 m. By hand it is 276 divided by 3. Note that Ekene-1's own interval is also 92 m, which is a coincidence of this section and not the reason the mean is 92 m.

**3. Ekene-4 TOP_B, layer-cake estimate, in m, tolerance 0.01.** The value is 1671 m, from the layer-cake estimate tile. It is also what the prediction from this marker tile shows while the from TOP_A button is selected. By hand it is Ekene-4's TOP_A at 1530 m plus the 141 m mean.

**4. Ekene-4 TOP_B, from TOP_SAND, in m, tolerance 0.01.** The value is 1682 m, from the from TOP_SAND estimate tile, and from the prediction from this marker tile with the from TOP_SAND button selected. By hand it is Ekene-4's TOP_SAND at 1590 m plus the 92 m mean.

**5. Spread between the two estimates, in m, tolerance 0.01.** The value is 11 m, from the spread between them tile, and it is drawn on the panel as the band between the two prediction lines. By hand it is 1682 minus 1671.

**6. TOP_B structural relief over three wells, in m, tolerance 0.01.** The value is 34 m, from the TOP_B structural relief tile, whose unit label states the three-well denominator. By hand it is 1662 in Ekene-2 minus 1628 in Ekene-3.

Six readings, one panel, two marker settings. Do the two TOP_A fields with the first button, switch once, and do the two TOP_SAND fields with the second. The spread and the relief tiles are visible under either setting.

## The means feed the predictions, so an error propagates

Fields 1 and 3 are not independent, and neither are fields 2 and 4. Each prediction is its mean plus a fixed anchor depth, so an error in a mean carries into its prediction metre for metre, and then into the spread.

This matters because the most common error at this tier is a divisor error, and it enters at field 1 or field 2. Divide 423 by 4 instead of 3 and field 1 becomes 105.75 m, field 3 becomes 1635.75 m, and field 5 becomes 1682 minus 1635.75, which is 46.25 m. One mistake, three fields lost, and the spread you report is now larger than the structural relief, which should itself look wrong to you.

The defence is the divisor. Both means are over the three wells that carry TOP_B, so both are divided by 3. Ekene-4 contributes no interval to either mean, because it has no TOP_B to measure to. It contributes only its anchor depths.

## The spread must equal the difference of the two predictions

Field 5 is a reconciliation, not an independent measurement. Whatever you enter for fields 3 and 4, field 5 must be their difference. Report 1671 m, 1682 m and 11 m and the three numbers are consistent. Report 1671 m, 1682 m and anything other than 11 m and one of the three has been produced separately from the others.

Check it before submitting, since one subtraction catches a stale field left over from an earlier attempt.

## The relief is a separate reading

Field 6 is the only one of the six that is not derived from the predictions at all. It comes from three measured picks, 1640 m, 1662 m and 1628 m, and it would be 34 m if nobody had ever attempted a prediction. It is not the error bar on fields 3 and 4, and the marks are lost by entering 34 m at field 5 or 11 m at field 6.

The two swapped answers are easy to spot. A spread of 34 m with predictions 11 m apart is field 6 in field 5's box. A relief of 11 m alongside picks ranging from 1628 m to 1662 m is field 5 in field 6's box.

Open the panel and locate all six values in capstone order before you submit anything.

{{panel:wc-prediction-explorer}}

## Exercise

Without opening the panel, list the six graded fields in capstone order with the unit and tolerance of each, and give the hand arithmetic for each one. Then answer in two sentences: if you mistakenly averaged the TOP_SAND to TOP_B intervals over four wells, which fields would be wrong and what would each become.

As a self check: mean TOP_A to TOP_B in m at tolerance 0.01, which is 423 divided by 3, or 141 m; mean TOP_SAND to TOP_B in m at tolerance 0.01, which is 276 divided by 3, or 92 m; Ekene-4 TOP_B layer-cake in m at tolerance 0.01, which is 1530 plus 141, or 1671 m; Ekene-4 TOP_B from TOP_SAND in m at tolerance 0.01, which is 1590 plus 92, or 1682 m; the spread in m at tolerance 0.01, which is 1682 minus 1671, or 11 m; and TOP_B structural relief over three wells in m at tolerance 0.01, which is 1662 minus 1628, or 34 m. Dividing 276 by 4 gives 69 m at field 2, so field 4 becomes 1590 plus 69, which is 1659 m, and field 5 becomes 1671 minus 1659, which is 12 m. Fields 1, 3 and 6 would be unaffected, since the TOP_A mean, the layer-cake estimate and the relief do not use that interval.
