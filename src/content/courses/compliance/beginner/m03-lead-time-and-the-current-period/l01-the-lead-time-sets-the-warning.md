# The lead time sets the warning

Due soon is a warning, and a warning is only useful if it comes early enough to act on. Each obligation in the Regulatory Compliance app carries its own lead time in days, and the lead time decides when the warning starts. A return that takes an afternoon to file needs a short one. A permit renewal that needs a regulator's site visit needs a long one.

## One obligation, one field varied

The digest takes REG-2026-003, the IKORO quarterly flare and venting return, and changes nothing but its lead time. The return is due 2026-10-31, which is 16 days after the as-of date of 2026-10-15. Its recorded lead time is 14.

| lead_time_days given | status |
| --- | --- |
| 0 | On track |
| 7 | On track |
| 14 | On track |
| 15 | On track |
| 16 | Due soon |
| 17 | Due soon |
| 30 | Due soon |
| 90 | Due soon |

{{panel:compliance-register-explorer}}

The due date does not move and neither does the as-of date. The only thing that changes is how far ahead the obligation asked to be warned, and that alone turns On track into Due soon. As recorded, with a lead time of 14, the return reads On track and explainStatus says "Due in 16 days. The last filing (2026-07-28) was for an earlier period, so nothing has been filed for this one yet." A lead time of 15 still leaves it On track. With a lead time of 16 or 17 or 30 or 90 the same return, on the same day, reads Due soon.

## Two rows that are inside their window

Two IKORO obligations are Due soon at 2026-10-15, and each reason names the window that put it there:

- REG-2026-001, the produced water discharge permit: "Due in 36 days, inside the 60 day lead time set for this obligation."
- REG-2026-012, the annual concession rental: "Due in 25 days, inside the default 30 day lead time (none is set for this obligation)."

The reason tells you both numbers, the days remaining and the window they are inside. It also says whether that window was set on the record or applied by default, so a reader can see why the row is Due soon without opening the record.

## Choosing a lead time is a decision

The lead time is the one number on the row that somebody chooses on purpose. The discharge permit carries 60, the kind of window a permit renewal asks for. The flare return carries 14, the kind of window a routine quarterly report asks for.

Choose one too short and the warning arrives when there is no longer time to do the work. Choose one too long and everything in the register is Due soon for weeks at a time, and a register where every row is Due soon stops being read. The engine does not choose for you. It applies the number on the record, and when there is no usable number it applies a default, which is the next lesson.

## What the panel lets you do

The panel puts the flare return's lead time under your hand, with its status beside it. Step the lead time up from 14 and watch for the value at which On track turns into Due soon. Then read the reason sentence beside it, which changes with the status.

## Exercise

Read the lead time table for REG-2026-003. Quote the largest lead time in the table that leaves the return On track and the smallest that makes it Due soon, and the 16 days to its due date. Then read the reasons of REG-2026-001 and REG-2026-012 and say, for each, what two figures the reason gives and what they show about why the row is Due soon.
