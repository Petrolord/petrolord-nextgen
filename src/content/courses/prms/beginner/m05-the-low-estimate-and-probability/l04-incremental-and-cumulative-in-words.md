# Incremental and cumulative, in words

{{panel:prms-classification-calculator}}

The categories module showed the two forms side by side. This lesson puts them in plain words and ties them to the probability labels, because the labels belong to one form only. The cumulative figures are the ones that carry P90, P50 and P10. The increments are slices between them and carry no probability of their own.

## The two forms of the Ekene Main Reserves

| cumulative | probability label | value (engine) | increment | value (engine) |
| --- | --- | --- | --- | --- |
| 1P | P90 | 8.890000 | Proved (P1) | 8.890000 |
| 2P | P50 | 16.650000 | Probable (P2) | 7.760000 |
| 3P | P10 | 24.990000 | Possible (P3) | 8.340000 |

## Cumulative counts up from zero

The cumulative categories each count everything up to their estimate. The 1P is the low estimate. The 2P includes the 1P and goes up to the best estimate. The 3P includes both and goes up to the high. Each cumulative figure is an estimate of the whole quantity, so each can carry an exceedance probability.

## Incremental cuts the range into slices

Proved (P1) is the 1P. Probable (P2) is what the 2P adds to the 1P. Possible (P3) is what the 3P adds to the 2P. A slice is the gap between two estimates. It has no exceedance probability of its own: saying the Probable (P2) of 7.760000 has a 50 percent chance would be wrong, because 7.760000 is not an estimate of the whole quantity.

## Which form a set is stated in

The engine asks you to state the method. "cumulative" takes a low, a best and a high; "incremental" takes a first, a second and a third slice. The "Method (stated)" control writes it, and when you change it the control rewrites the estimates into the other form, so no key of the old form is left behind. The method has no default. Leaving it out is refused:

> method must be one of "cumulative", "incremental"; got nothing

Whichever form you state, the engine returns both. For Reserves and Contingent Resources the answer is the same set of categories. Prospective Resources take the cumulative method only.

## Reading a mixed report

Reports sometimes mix the forms: a 1P beside a Probable (P2), for instance. Read each figure with its label and turn it into the form you need before adding or comparing. Adding a 2P to a Probable (P2) counts the Proved slice once and the Probable slice twice.

## The limit of this tier

At this tier you read the two forms; you do not need to build one from the other by hand. The Professional tier builds the cumulative figures from three increments, and the increments from three forecasts, and works through a slice that is exactly zero.

## Exercise

Open the classification calculator, the course's own calculator panel, in the view "The categories of a set of estimates", and start from "Ekene Main Reserves, stated cumulatively". Set the "Method (stated)" control to "not stated" and read the refusal. Then set it to incremental, read the box to see how the control rewrote the estimates, and run it: check that the categories match the table above. Finally start from "Ekene North, stated incrementally" and write each of its figures in words, naming the form it belongs to.
