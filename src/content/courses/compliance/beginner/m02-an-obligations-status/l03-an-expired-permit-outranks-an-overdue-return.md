# An expired permit outranks an overdue return

An obligation can carry two dates that mean two different things. A due date is when something has to be filed or done. An expiry date is when a permit or licence stops being valid. When a due date passes, a return is late. When an expiry passes, the operator is working without the authority the permit gave it. The engine ranks the second above the first, and this lesson shows the precedence one field at a time.

## The licence as recorded

REG-2026-005 is the IKORO radioactive source licence. It is Active and Biennial, its due date is 2026-12-31 and its expiry is 2026-09-30. At the as-of date of 2026-10-15 it reads Expired with a days until of -15, and explainStatus gives the reason "The permit expired 15 days ago."

Its due date is still ahead. That does not rescue it. The passed expiry decides the status, and the due date ahead does not change it.

{{panel:compliance-register-explorer}}

## One field at a time

The digest varies this one obligation, changing a single field in each row:

| variant | status | days until |
| --- | --- | --- |
| as recorded (expiry passed, due date ahead) | Expired | -15 |
| the same with lifecycle Superseded | Superseded | -15 |
| the same with the expiry removed | On track | 77 |
| the same with the expiry moved to 2027-09-30 | On track | 77 |
| the same with the due date moved to 2026-10-01 and no expiry | Overdue | -14 |
| the same with an unknown lifecycle word, Archived | Expired | -15 |

Read the rows in pairs. Remove the expiry and the licence reads On track, counting 77 days to its due date. Move the expiry out to 2027-09-30 and it reads On track with the same 77, because the due date is now the date that comes first. Take the expiry away and move the due date back to 2026-10-01, and the licence reads Overdue at -14. A passed due date gives Overdue. A passed expiry gives Expired.

The Superseded row belongs to the last lesson: the lifecycle is read before any date. The Archived row shows that a lifecycle word outside the list leaves the dates in charge.

## Expired sits above Overdue

In complianceStatus.STATUS_SEVERITY Expired is first and Overdue is second. The register sorted worst first shows what that does in practice:

| order | code | status | next action date |
| --- | --- | --- | --- |
| 1 | REG-2026-005 | Expired | 2026-09-30 |
| 2 | REG-2026-007 | Overdue | 2026-09-01 |
| 3 | REG-2026-002 | Overdue | 2026-10-10 |

REG-2026-002 is the monthly produced water quality return, and its reason reads "The due date passed 5 days ago." REG-2026-007 is the oil spill contingency plan notification, and its reason reads "The due date passed 44 days ago." Both are late. The licence sits above both of them, including the notification whose next action date is the earlier one, because the status decides the order before the date does.

## Why the precedence is right

A late return is a failure to report. It carries a penalty, and it can usually be put right by filing. An expired licence means the activity it covers has no authority behind it on this day. For a radioactive source that is a matter for the regulator and for the people near the source, and it is the row that has to be dealt with first. The engine encodes that judgement in the order of one list, so no reader has to make it again.

## Exercise

Read the six variants of REG-2026-005. Name the variant that turns Expired into Overdue and quote its days until, and name the two variants that read On track and quote the days until they share. Then read the first three rows of the sorted register and say why the licence sits above a notification whose next action date is the earlier one.
