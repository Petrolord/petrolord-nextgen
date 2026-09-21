# The ratification window

An Emergency change goes in on its first signature. The remaining levels must then sign within EMERGENCY_RATIFY_DAYS, 7 days, of the actual implementation date. This lesson reads how that window is counted and the four ratification states that report it.

## Four states

The engine's ratification states are "Not required", "Awaiting ratification", "Ratification overdue" and "Ratified".

- "Not required": the change is not on the emergency route. A Temporary change reads "Not required"; ratification belongs to the emergency route alone.

The window only opens once the change is in effect, in "Implementation" or "Closed". An Emergency change still in Draft, Screening, Review or Approval has not gone in, so there is nothing yet to ratify, and it reads "Not required" as well. So does one that was "Rejected" or "Cancelled" before it went in. That holds whatever its levels show and whatever implementation date the record carries. Read the type and the stage together before you read the window.
- "Awaiting ratification": an Emergency change with levels still unsigned, inside its window.
- "Ratification overdue": an Emergency change with levels still unsigned, past its window or with no implementation date recorded.
- "Ratified": every level signed, however long ago it went in.

## One change, its implementation date moved

The engine prints one Emergency change in "Implementation" with level 2 unsigned, its implementation date moved back from the as-of date, 2026-10-01:

| implemented on | days since | ratification due | state |
| --- | --- | --- | --- |
| 2026-10-01 | 0 | 2026-10-08 | "Awaiting ratification" |
| 2026-09-30 | 1 | 2026-10-07 | "Awaiting ratification" |
| 2026-09-25 | 6 | 2026-10-02 | "Awaiting ratification" |
| 2026-09-24 | 7 | 2026-10-01 | "Awaiting ratification" |
| 2026-09-23 | 8 | 2026-09-30 | "Ratification overdue" |
| 2026-09-01 | 30 | 2026-09-08 | "Ratification overdue" |

Every row was also replayed through the module's independent Python oracle.

## Counted from the actual implementation date

The due date is the implementation date plus 7 calendar days. Implemented on 2026-10-01, due 2026-10-08. Implemented on 2026-09-24, due 2026-10-01. The window starts on the date the change actually went in, because what the window controls is a change running on the plant on one signature, and that starts when the change goes in.

## Day seven is still inside

Look at the row for 2026-09-24. The change went in 7 days before the as-of date, and its ratification is due on 2026-10-01, the as-of date itself. It reads "Awaiting ratification". A due date equal to the as-of date has not passed.

One day earlier, implemented on 2026-09-23, the due date is 2026-09-30, the day before the as-of date. That window has closed, and the change reads "Ratification overdue". Day seven is the last day inside the window; day eight is outside it.

This is the same calendar rule the expiry lead follows. An expiry on the as-of date reads "Expiring soon", and a ratification due on the as-of date reads "Awaiting ratification". A date equal to the as-of date has not passed.

## "Overdue" in this lesson

"Ratification overdue" is its own state. It is not the overdue flag on a change, which is read against a target date and only before the change is in effect. An Emergency change in "Implementation" reads the overdue flag as no, and may still read "Ratification overdue". Keep the two apart when you report them.

{{panel:rc-change-explorer}}

## The register on the as-of date

In the ESANMI register, read on 2026-10-01, ES-04 reads "Awaiting ratification", due 2026-10-03, and ES-05 reads "Ratification overdue", due 2026-09-27. The summary counts them: ratificationPending 1 and ratificationOverdue 2. The second overdue ratification is ES-12, which the next lesson reads.

## Exercise

Using the table, record the ratification due date and state for implementation dates of 2026-09-24 and 2026-09-23, read on 2026-10-01. Say which rule makes the first one inside the window. Then record the ratification state and due date of ES-04 and ES-05 from the ESANMI register, and the date those states are true on.
