# The east contact ten metres shallower

Take the eastern compartment's contact up from 1560 m to 1550 m, leaving the west at 1560 m, and watch what happens. The answer is out of all proportion to the change.

## The numbers

| Setting | East cells | East STOIIP (MMstb) |
| --- | --- | --- |
| East contact 1560 m | 52 | 2.283591 |
| East contact 1550 m | 18 | 0.327859 |

The east block loses 34 of its 52 cells and 86 percent of its oil for a ten metre change in an assumption.

The west block does not move at all. It still holds 117 cells and 9.855617 MMstb, because it was clipped against its own contact, which you did not touch.

The field, if you insist on adding them, falls from 12.139208 to 10.183477 MMstb.

## Why the response is so violent

The Associate tier established that volume responds to contact non linearly, because raising a contact removes both area and column at the same time. Two things multiply, so the effect compounds.

In the east block that compounding is at its most severe, for a structural reason. The eastern compartment is a flank. Its cells were already thin, with a mean column of 8.06 m at 1560 m. Raise the contact 10 m and every cell loses 10 m of potential column, which for most of them is more than they had.

A block whose mean column is 8 m cannot survive a 10 m rise in its contact with much left. That is the general rule: the thinner the compartment, the more violent its response to its contact, and thin compartments are exactly the ones whose contacts are least constrained.

## Reading it off the panel

Set the fault to 1800 m, the west contact to 1560 m and the east contact to 1550 m.

{{panel:rc-block-explorer}}

Watch the map rather than the tiles as you switch the east contact between 1560 and 1550. The amber band immediately east of the fault survives, because those cells have the tallest eastern columns. Everything further east disappears.

That surviving band is the cluster around Ekene-6, which is the only eastern well that found oil. The 18 cells left at 1550 m are essentially the rock that well proved, and nothing else.

Notice too what happens to the well posts. Ekene-2 was already dry at 1560 m and stays dry. No eastern well changes state, which is worth noting: the well data cannot distinguish these two cases, and yet they differ by 86 percent of the compartment.

## Worked example

Check the 18 cell figure against the mean column, to see the compounding directly.

At 1560 m the east block has 52 cells with a mean column of 8.056122 m, so its gross rock volume is $52 \times 10{,}000 \times 8.056122 = 4.189183$ million cubic metres.

At 1550 m it has 18 cells. Its gross rock volume falls to about 0.601 million cubic metres, which implies a mean column of

$$\frac{0.601 \times 10^6}{18 \times 10{,}000} = 3.34 \ \mathrm{m}$$

So the area fell by 65 percent and the mean column of what survived fell by 59 percent. Multiply those two survivals together: $0.35 \times 0.41 = 0.14$, which is the 14 percent of the oil that remains.

That multiplication is the whole mechanism. Neither factor alone would have been alarming.

## What it means for a decision

At 1560 m the eastern compartment holds 2.283591 MMstb, which might carry a well. At 1550 m it holds 0.327859 MMstb, which certainly does not.

The evidence available cannot tell those two cases apart, since no well changes state between them. So the decision about whether to drill the east block cannot be made from the volumetric model at all. It needs a contact, and getting one needs either a pressure measurement in the eastern compartment or a well.

That is a legitimate and useful conclusion for a volumetric study to reach. Reporting 2.283591 MMstb without it invites a decision the data does not support.

## Exercise

Set the west contact to 1550 m as well, so both blocks sit at 1550 m, and record both blocks' cells and volumes. Then explain why the west block's response is so much gentler than the east's.

Self check: at 1550 m in both blocks the west holds 110 cells and 3.507956 MMstb and the east 18 cells and 0.327859 MMstb. The west block's cell count barely moves, from 117 to 110, because its structure is broad and shallow so few cells fall below the new contact, but its volume falls steeply because every surviving cell loses 10 m of column. The east block loses on both counts at once, which is why its response is far more severe.
