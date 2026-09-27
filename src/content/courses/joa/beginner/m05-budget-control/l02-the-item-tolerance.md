# The item tolerance

{{panel:joa-account-calculator}}

No budget is exact, and sending every small overspend back to the committee would stall the work, so the agreement gives the operator a margin on each line: it may exceed an approved item by a stated percentage without asking. That margin is the item tolerance.

## What the Norwegian agreement says

The Norwegian joint operating agreement (Attachment A, an unofficial English translation of the 2007 text, cited from its Wayback Machine capture of 26 May 2024) states the margin:

> "In carrying out an approved work program, however, the Operator may exceed a budget item or an AFE by up to 10%." (Norway JOA Art. 12.5)

The 10% is the Norwegian text's figure. The engine holds no item tolerance of its own: `itemTolerancePct` is a required input, and a call without it is refused.

> itemTolerancePct must be a finite number at or above 0; got nothing

## The engine's rule

The engine states the test in its basis:

> an item is inside its tolerance when actual <= approved x (100 + itemTolerancePct) / 100; the budget is inside when the total overrun <= the lower of pct % of the approved total and the stated amount

The first half is the item test. The limit of an item is its approved amount raised by the tolerance, and the item is inside when its actual does not exceed the limit.

## Exactly on the tolerance

The words "by up to" in the Norwegian text include the limit itself. The engine states the boundary in the same terms:

> an overrun of exactly the tolerance is inside ("may exceed ... by up to")

The Ekene fixture plants an item on that boundary. Geology and geophysics was approved at 6000000.000000 and spent 6600000.000000, an overrun of exactly 10.000000 percent. Its limit is 6600000.000000, and it is inside:

> geology and geophysics: 6600000 against 6000000 approved is an overrun of 600000, inside the item tolerance of 10% (limit 6600000)

Two small worked cases show the edge from both sides. An item approved at 50.000000 and spent 55.000000 is inside at a 10 percent tolerance. The same item spent 55.500000 is beyond it:

> x: 55.5 against 50 approved is an overrun of 5.5, beyond the item tolerance of 10% (limit 55)

## Beyond the tolerance

Exploration drilling was approved at 48000000.000000 and spent 53500000.000000, an overrun of 11.458333 percent. Its limit is 52800000.000000:

> exploration drilling: 53500000 against 48000000 approved is an overrun of 5500000, beyond the item tolerance of 10% (limit 52800000)

An item beyond its tolerance is still a result, with a reason. It is no refusal.

## An underrun

Facilities engineering spent less than approved. Its overrun is -800000.000000, which is inside any tolerance at or above zero. The engine prints it `true` in the column "inside its tolerance".

## Exercise

Open the account calculator, the course's own calculator panel, and choose "Budget control". Start from "The Ekene 2027 budget" and run it. Read the limit and the "inside its tolerance" column for each line. Then raise the control "Item tolerance, percent (stated)" one whole percent at a time, running each time, and write down the smallest whole-number tolerance at which exploration drilling comes inside. Finally, clear the control and read the refusal.
