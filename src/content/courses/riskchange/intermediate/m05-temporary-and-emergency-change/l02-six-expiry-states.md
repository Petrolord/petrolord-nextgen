# Six expiry states

The engine gives every change exactly one expiry state. There are six, and each one answers a slightly different question about the change's date and where the change is.

## The six, as the engine spells them

- "Expired": in effect, and the expiry date has passed.
- "Expiring soon": in effect, and the expiry date falls within the lead before it.
- "Within expiry": in effect, and the expiry date is further off than the lead.
- "No expiry": there is no expiry the engine will act on.
- "Permanent change": the change is "Permanent", so it carries no expiry.
- "Closed out": the change carries an expiry and is in the Closed stage.

Quote them exactly. "Expiring soon" is the engine's word; "due to expire" and "near expiry" are not.

## All six in one register

The ESANMI register, read on 2026-10-01, shows every state at least once:

| change | type | stage | expiry | expiry state |
| --- | --- | --- | --- | --- |
| ES-03 | "Temporary" | "Implementation" | 2026-09-28 | "Expired" |
| ES-02 | "Temporary" | "Implementation" | 2026-10-14 | "Expiring soon" |
| ES-04 | "Emergency" | "Implementation" | 2026-11-29 | "Within expiry" |
| ES-10 | "Temporary" | "Screening" | 2026-09-01 | "No expiry" |
| ES-01 | "Permanent" | "Approval" | null | "Permanent change" |
| ES-07 | "Temporary" | "Closed" | 2026-08-01 | "Closed out" |

Every one of those states was also replayed through the module's independent oracle.

## Three states that depend on the date

"Expired", "Expiring soon" and "Within expiry" are the three that move with the as-of date. They only appear on a change in effect with a readable expiry, and they are the three that change from day to day. ES-02 reads "Expiring soon" on 2026-10-01; the same record read on another date could read something else. Always quote these three with the date they are true on.

The line between "Expiring soon" and "Within expiry" is the lead, EXPIRY_LEAD_DAYS, 14 days, counted inclusively. The next lesson reads exactly where it falls.

## Three states that do not

"No expiry", "Permanent change" and "Closed out" come from the record, and the calendar does not move them.

- "Permanent change" comes from the type.
- "Closed out" comes from the Closed stage on a change that carries an expiry. ES-07 carries an expiry of 2026-08-01, a date before the as-of date, and reads "Closed out" because it is in the Closed stage.
- "No expiry" comes from either of two things: the change is not in effect (ES-10, in "Screening"), or the expiry cannot be read. A Temporary change in "Implementation" whose expiry reads "after the turnaround" reads "No expiry".

That second case is worth a pause. A change on the plant with an unreadable expiry is exactly the change the gate into "Implementation" refuses. If one reaches the plant anyway, the engine will not guess a date for it, so it can never read "Expired".

{{panel:rc-change-explorer}}

## The counts on the dashboard

The summary for ESANMI reads expired 1 and expiringSoon 2. In the register, one change reads "Expired" (ES-03) and two read "Expiring soon" (ES-02 and ES-05). The dashboard counts are the states, counted.

## Exercise

For each change in the ESANMI register, record its expiry state on 2026-10-01. Mark which of the six states depend on the as-of date and which come from the record alone. Then record expired and expiringSoon from the summary, and name the changes behind each.
