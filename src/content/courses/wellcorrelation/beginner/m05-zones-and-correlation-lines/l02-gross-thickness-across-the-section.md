# Gross thickness across the section

Gross thickness is the first number a correlation produces that anyone outside the geoscience team will ask about. It is also the simplest. Within one well, gross thickness of a zone is the base depth minus the top depth. Nothing else enters the calculation. No logs, no cutoffs, no petrophysics, no interpretation beyond the two picks themselves.

$$h_{gross} = d_{base} - d_{top}$$

Both depths come from the same well, and in this course both are measured depths in metres. The result is a length in metres.

## Why the view cannot change it

The previous lesson ended on the claim that the span moves with the view but the thickness does not. Here is the reason, and it is worth seeing rather than accepting.

Flattening applies one additive shift per well. Every depth in that well, top and base alike, gets the same number added to it. Write the shift as $s$ and the subtraction becomes:

$$(d_{base} + s) - (d_{top} + s) = d_{base} - d_{top}$$

The shift cancels. It has to, because it appears once with a plus sign and once with a minus sign. This is why you can measure thickness confidently off a flattened section, off a structural section, or off any datum anybody chooses later, and get the same answer every time. Thickness is a property of the rock. The view is a property of the display.

The same reasoning tells you what flattening does not preserve. Any quantity that subtracts depths from **different** wells, such as structural relief on a top, changes completely under flattening, because the two wells carry different shifts and nothing cancels. Within one well, cancel. Across wells, do not.

## The Ekene SAND zone

Work the four wells in section order, using structural depths for TOP_SAND and BASE_SAND.

* Ekene-1: 1580 - 1548 = **32 m**
* Ekene-2: 1601 - 1565 = **36 m**
* Ekene-3: 1570 - 1541 = **29 m**
* Ekene-4: 1615 - 1590 = **25 m**

That 29 m for Ekene-3 is one of the six numbers you will be asked to reproduce in the capstone, so it is worth checking the subtraction now rather than at the end.

Now prove the view-independence with real numbers instead of algebra. In the capstone flattened view, TOP_SAND is hung at a datum of 1500, so Ekene-3 displays TOP_SAND at 1500 and BASE_SAND at 1529. The subtraction becomes 1529 - 1500 = 29. Identical to the structural answer, as it must be. Repeat the exercise for Ekene-1 and you get 1532 - 1500 = 32, again identical.

## Reading the story in the numbers

Four thicknesses are not just four numbers. Laid out in section order they describe how the sand behaves across the area.

Ekene-3 has 29 m. Ekene-1 has 32 m. Ekene-2 has 36 m. Ekene-4 has 25 m. The sand thickens from Ekene-3 through Ekene-1 to a maximum at Ekene-2, then thins sharply into Ekene-4.

Put a scale on that. The spread is 36 - 25 = 11 m, and the mean of the four is 122 divided by 4, which is 30.5 m. So the variation is about 11 m on a mean of about 30.5 m, roughly a third of the average thickness. That is a meaningful change, not measurement noise, and it is the kind of pattern that would drive the next question in a real study: is this a depositional thickening toward Ekene-2, or is something structural removing section at Ekene-4?

A beginner course cannot answer that from four wells. What it can teach is the habit of stating the observation cleanly before reaching for an explanation. The observation is: the SAND zone thickens toward Ekene-2 and thins toward Ekene-4, with an 11 m spread on a mean near 30.5 m.

## Gross is not net

One distinction has to be nailed down before these numbers travel any further, because it is the most common place beginners overstate a result.

Gross thickness is the full interval between the two bounding tops. Every metre between TOP_SAND and BASE_SAND counts, including shale beds, tight streaks, and anything else caught inside the zone. Correlation gives you gross thickness and nothing more, because correlation only knows where the two surfaces are.

Net pay is what survives after petrophysical cutoffs are applied inside that interval. Shale volume, porosity and water saturation each have a threshold, and only the sample intervals that pass all of them count toward net. Getting net pay requires logs, cutoffs, and the whole petrophysics workflow taught in its own course. It is always less than or equal to gross, usually noticeably less.

So Ekene-2's 36 m is 36 m of gross SAND zone. It is not 36 m of pay, and it should never be quoted as though it were. This course books gross thickness only. When you hand a gross number to anyone, label it gross, and let the petrophysicist supply the net.

## Exercise

Compute the gross SAND thickness for Ekene-4 twice, once from the structural depths of 1590 and 1615, and once from the flattened displayed depths of 1500 and 1525. Then say which of these two quantities changes when you switch from the structural view to the flattened view: the gross thickness of the SAND in Ekene-2, or the depth difference between TOP_SAND in Ekene-2 and TOP_SAND in Ekene-4.

Self-check: 1615 - 1590 = 25 m and 1525 - 1500 = 25 m, the same answer both ways. The gross thickness in Ekene-2 does not change, because one shift cancels against itself. The depth difference between two different wells does change, because the two wells carry different shifts.
