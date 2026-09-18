# A missing lead time

Not every obligation on a register has its lead time filled in, and some have something in the field that is not a lead time at all. The engine does not let a missing or unusable lead time switch the warning off. It applies a default.

## The default

complianceStatus.DEFAULT_LEAD_TIME_DAYS is 30. With no usable lead time the engine uses it.

The digest shows this on the same obligation as the last lesson, REG-2026-003, the quarterly flare and venting return, due 2026-10-31, 16 days after the as-of date of 2026-10-15. Only the lead time is varied:

| lead_time_days given | status |
| --- | --- |
| null | Due soon |
| '' (empty) | Due soon |
| -5 | Due soon |
| 'ten' | Due soon |
| not set at all | Due soon |
| 30 | Due soon |
| 0 | On track |

{{panel:compliance-register-explorer}}

Every one of the first five rows reads Due soon, the same status the return carries with a lead time of 30. A null, an empty string, a negative number, a word typed where a number belongs and a field left out altogether all give the same answer.

Now look at the last row. A lead time of 0 reads On track. Zero is a number the engine can use, and a lead time of zero days means the obligation asked for no advance warning at all. The digest shows the difference directly: 0 gives On track and 30 gives Due soon, so the engine is applying the 0 it was given.

## Why a default and never a blank

The alternative would be to treat a missing lead time as no warning window. Then every obligation whose lead time nobody entered would go straight from On track to Overdue on the day its due date passed, with no Due soon in between. The rows most likely to be missing a lead time are the ones nobody has looked at closely, which are the rows that most need a warning. A default of 30 gives every obligation a window, whether or not somebody chose one.

## The rental that nobody gave a lead time

REG-2026-012, the annual concession rental, is recorded with its lead time as null. It is due 2026-11-09, 25 days after the as-of date, and it reads Due soon. explainStatus gives the reason "Due in 25 days, inside the default 30 day lead time (none is set for this obligation)."

Read that reason against the record. The lead time on the record is null. The 30 in the sentence is DEFAULT_LEAD_TIME_DAYS, the window the engine applied because none was given, and the sentence says so twice: it calls the window the default, and it says none is set for this obligation. Compare REG-2026-001, whose reason names the 60 day lead time set for this obligation. The two sentences let a reader tell a chosen window from a supplied one without opening either record.

## A default is still a choice

The default is a safety net, set once in the module, and the same 30 goes to a routine return and to a licence whose renewal takes months. If an obligation needs a longer window, somebody has to put one on the record.

## Exercise

Read the five rows of the table that carry no usable lead time, and the row for 30. Say what status they share and which constant supplies the window. Then read the row for 0 and say what it shows about how the engine treats a lead time of zero. Finally, read the lead time recorded for REG-2026-012 and the lead time its reason names, and say which words in the reason tell you where the second figure comes from.
