# The edge of the window

Every warning window has an edge, and a rule that is vague about its edge will be argued about on exactly the day it matters. This lesson reads the edge of the Due soon window from the engine's own rows, and it is careful to read only what the rows print.

## The rows either side of the edge

The flare and venting return, REG-2026-003, is due 2026-10-31. At the as-of date of 2026-10-15 that is 16 days away, and explainStatus puts the figure in its reason: "Due in 16 days." These are the rows of the lead time table closest to 16:

| lead_time_days given | status |
| --- | --- |
| 14 | On track |
| 15 | On track |
| 16 | Due soon |
| 17 | Due soon |

{{panel:compliance-register-explorer}}

Read the middle row. The lead time is 16 and the days until is 16, the same number, and the return reads Due soon. An obligation whose days until equals its lead time is inside its window. The edge belongs to Due soon.

The row above it has a lead time of 15 and reads On track. The row below has 17 and reads Due soon.

## One day either side

The table prints the row for a lead time of 15, one day short of the 16 days remaining, and it reads On track. So the two rows either side of the line are printed, and nothing at the edge has to be filled in by reasoning. A lead time of 15 leaves the return On track. A lead time of 16, equal to the days remaining, makes it Due soon. That is the one fact a user needs at the edge. For any lead time the table does not print, move the control in the panel and read the status the engine gives.

## The same edge on the documents side

Document Control has a review window of its own. documentControl.REVIEW_LEAD_DAYS is 30, and the review state Review due soon plays the part Due soon plays in the register. The IKORO terminal emergency response plan, OPS-PLA-0002, has its next review on 2026-11-02, 18 days after the as-of date, and reads Review due soon. Module five reads the library in full.

## Why the edge should be inclusive

Consider an obligation whose lead time is 30 days because the work takes 30 days. On the day it is exactly 30 days from due, the work has to start. A window that excluded its own edge would stay quiet on that day and speak up a day later, with one day too few to do the work. Putting the edge inside the window means the warning arrives on the last day the lead time can still be met, and not after it.

There is a second reason. People set lead times in round numbers: 14, 30, 60, 90. Due dates also fall on round intervals. The day on which the days remaining exactly equals the lead time is not a rare corner. It turns up across a register every month, and the rule has to say plainly which side of the line it is on.

## Exercise

Read the four rows of the table above and the return's 16 days to its due date. Say which lead time in the table is the same number as the days until, what status it gives, and what that shows about which side of the edge the equal case falls on. Then read the rows for 15 and 16 and say what the two statuses, one day apart, show about where the window begins.
