# On track and compliant are two words

On track and Compliant sit next to each other in the severity list, fourth and fifth, and in conversation people use them as if they meant the same thing. In the Regulatory Compliance app they are two statuses with two different meanings, and confusing them is how a register tells a manager that something is done when it has not been started.

## Four rows

At the as-of date of 2026-10-15, four IKORO obligations carry one of the two words:

| code | obligation | frequency | due | last filed | days until | status |
| --- | --- | --- | --- | --- | --- | --- |
| REG-2026-003 | Quarterly flare and venting return | Quarterly | 2026-10-31 | 2026-07-28 | 16 | On track |
| REG-2026-004 | Annual environmental monitoring report | Annual | 2027-03-31 | 2026-03-30 | 167 | On track |
| REG-2026-006 | Pipeline right of way consent | One-off | 2026-08-14 | 2026-08-10 | -62 | Compliant |
| REG-2026-008 | Host community development report | Semi-annual | 2027-01-31 | 2026-08-05 | 108 | Compliant |

{{panel:compliance-register-explorer}}

## What On track says

On track says the due date is ahead, the obligation is outside its warning window, and nothing has been filed for the period it is in. explainStatus is explicit about the last part:

- REG-2026-003: "Due in 16 days. The last filing (2026-07-28) was for an earlier period, so nothing has been filed for this one yet."
- REG-2026-004: "Due in 167 days. The last filing (2026-03-30) was for an earlier period, so nothing has been filed for this one yet."

Both of these obligations have a filing on the record. Neither filing counts, because each belongs to an earlier period. The work for the current period is still to do. On track tells you there is time to do it.

## What Compliant says

Compliant says the obligation has been met for the period it is in. The reasons read differently:

- REG-2026-008: "Last filed 2026-08-05, next due in 108 days."
- REG-2026-006: "Filed 2026-08-10. A one-off obligation, nothing further is due."

The host community development report has a filing inside its current period, so the requirement for that period is discharged. The next due date is ahead and there is nothing to do until the next period opens. The right of way consent is a One-off that was filed, so nothing further is due at all, and module four gives it a lesson of its own.

## The rule behind the difference

Owner decision AS15 Q2 states it: evidence counts towards Compliant only for the current period. A filing made for last quarter says nothing about this quarter. So a return that was filed on time every period so far still reads On track, and never Compliant, until something is filed for the period it is now in. The next module shows exactly where the current period starts and how one day decides whether a filing counts.

## Why the order puts On track first

In complianceStatus.STATUS_SEVERITY On track is fourth and Compliant is fifth. On track is the worse of the two because it has work outstanding. In the register sorted worst first the two On track rows sit sixth and seventh and the two Compliant rows sit eighth and ninth.

The practical consequence is for anyone who summarises the register. A report that lumps On track and Compliant together under a heading like "fine" has thrown away the one thing the distinction was there to say: which obligations still need a filing this period. At IKORO the engine's summarise prints On track 2 and Compliant 2, and those two counts describe two different states.

## Exercise

Read the status and the reason for REG-2026-003 and for REG-2026-008. Both have a filing on the record and a due date ahead. Say what each reason says about the period its filing belongs to, and which of the two obligations still needs something filed. Then read the positions the sorted register gives the On track rows and the Compliant rows.
