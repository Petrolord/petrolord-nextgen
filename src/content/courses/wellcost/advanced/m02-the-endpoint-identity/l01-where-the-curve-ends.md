# Where the curve ends

The last point of the cost time curve is not the number on the AFE, and the difference between the two is the whole subject of this module.

{{panel:wc-risk-explorer}}

## Two endpoints, one of them chosen

The golden curve ends at elapsed hour 432 and 5,380,000 USD.

The golden AFE has three headline figures. The base is 5,380,000 USD. The contingency at a fraction of 0.1 is 538,000 USD. The total carried forward for approval is 5,918,000 USD.

The curve lands on the first of those, exactly. It does not land on the third, and it never approaches it.

## The time endpoint too

Both coordinates of that final point are pinned, not just the money. The curve's final elapsed hour equals the schedule's total hours, with an error of 0 hours. There is no trailing segment after the last activity, and no cost accrues in a period the schedule does not contain.

That sounds obvious until you have seen a spreadsheet where the cumulative column runs one row past the schedule because a lump was parked at the bottom with nowhere to attach.

## Why the base and not the total

The base is the sum of what the lines bill for the work described. Every dollar of it is attached to an activity, a day, or a metre, so every dollar of it has a place on a time axis.

The contingency is not attached to anything. It is a provision against events that are not in the programme. There is no activity it belongs to, no rate it accrues at, and no hour at which it becomes owed.

So the curve carries the base and the AFE carries both. The engine states this as a design commitment rather than an accident: the final point equals the base subtotal, contingency excluded by design.

## What that buys you

It gives you a clean separation between two questions people constantly run together. How is this well tracking against what we costed is a curve question. Do we have enough authority to finish is a total question.

Keep the provision off the curve and each question gets an honest answer. Put it on the curve and neither does.

## Exercise

Read the final point off the panel and write it beside the AFE base, the contingency and the total.

Then say which of those four numbers would change if the contingency fraction were raised, and which would not.
