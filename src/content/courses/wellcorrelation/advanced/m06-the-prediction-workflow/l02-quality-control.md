# Quality control

A predicted pick is a manufactured number and it can fail in ways a measured pick cannot. The failures are not subtle once you look for them, but they are invisible in the answer itself, because a wrong prediction is a plausible depth in metres and nothing about it looks wrong.

Six checks catch nearly everything at this tier. Each has a pass condition you can state before you look, which is the property that makes a check worth running. Run them in this order, because an early failure makes the later checks pointless.

## Check one: only the wells that carry the target were used

Every interval in the calculation must come from a well that has both the anchor marker and the target surface. On Ekene that is Ekene-1, Ekene-2 and Ekene-3, so the mean is over three values and the divisor is 3.

The pass condition is arithmetic you can state in advance. The mean TOP_A to TOP_B interval is 423 divided by 3, which is 141 m. The mean TOP_SAND to TOP_B interval is 276 divided by 3, which is 92 m. If a mean was taken over four wells, Ekene-4 contributed an interval to a surface it does not have, which is impossible, so the divisor is the tell. A four-well divisor on a three-well numerator drags the mean down by a quarter and the error is large and silent.

## Check two: the anchor is a marker the target well actually has

Name the anchor and then find it in the target well's own tops. Ekene-4 carries TOP_A at 1530 m and TOP_SAND at 1590 m, so both anchors used here pass.

The failure this catches is a prediction built on an invented starting depth. If somebody anchored to BASE_SAND they would still pass, since Ekene-4 has it at 1615 m, but if somebody anchored to a marker Ekene-4 lacks they would have had to estimate the anchor first, and the result would be an estimate projected from an estimate with no way to separate the two errors. The check is quick and it is absolute. The anchor is a pick in the target well or the prediction is not defensible.

## Check three: both estimates were computed, not one

Count the predictions on the page. There must be two, from two different anchors, and both must be written down even when one is preferred.

This is the check most often skipped, because one estimate looks like a complete answer. It is not. A single prediction has no range, and without a range there is no way to say how much to trust it. The second estimate is not a cross-check on the first, it is the source of the only uncertainty statement the method can produce. Computing 1671 m and stopping is the difference between a result and a number.

## Check four: the spread is reported

Find the spread in your own text. It is 1682 minus 1671, which is 11 m, and it must appear alongside the predicted depth rather than in a working file.

The pass condition has a useful arithmetic form: the spread must equal the difference of the two predictions exactly. If your reported spread does not reconcile against your two reported depths, one of the three numbers has been edited independently of the others, which usually means a prediction was updated and the spread was not.

## Check five: the prediction is labelled as a prediction

Read every place the number appears and confirm each one says it is predicted. The tops table entry for Ekene-4 TOP_B stays blank, the correlation line still stops after the third well, and the count of wells carrying all four tops stays at 3 of 4.

This is the boring check and it is the one that costs real money when it fails. A predicted depth entered in a tops table becomes a control point, then a contour, then a volume, and by the time anybody asks where it came from the section is a year old. The label is the only thing that stops it.

## Check six: relief is kept separate from spread

Look at both numbers in your report and confirm they are doing different jobs. TOP_B relief is 34 m over the three wells that carry it, and it is a structural reading. The spread is 11 m and it is the uncertainty on the Ekene-4 prediction.

The failure is quoting 34 m as the error bar, which is the classic mistake at this tier. It is three times the measured disagreement, and it is not even a band that contains the answers, since both estimates at 1671 m and 1682 m are deeper than the deepest measured TOP_B at 1662 m. The check also fails in the rarer opposite direction, where somebody hands a mapper 11 m as the structural relief of TOP_B, which understates the surface's expression by more than half.

Open the panel and run all six checks on the values it shows before reading anything for the record.

{{panel:wc-prediction-explorer}}

## Exercise

You receive a prediction note reading: Ekene-4 TOP_B predicted 1635.75 m from the mean TOP_A to TOP_B interval of 105.75 m, uncertainty 34 m. Work out which checks fail and what single mistake accounts for the numbers. Then say what else is missing from the note.

As a self check: check one fails, because a mean TOP_A to TOP_B interval of 105.75 m is 423 divided by 4 rather than by 3, so the calculation used a four-well divisor on the three wells that carry TOP_B, and 1530 plus 105.75 is 1635.75 m, which reproduces the quoted depth. That single mistake accounts for both numbers in the first half of the note. Check three fails because only one estimate was computed, check four fails because no spread is reported, and check six fails because the quoted uncertainty of 34 m is the structural relief of TOP_B rather than the disagreement between two methods. Check two passes, since TOP_A at 1530 m is a real pick in Ekene-4. The note is also missing the wells the interval came from and an explicit label that the depth is a prediction rather than a pick.
