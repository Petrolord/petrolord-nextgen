# Only a change in effect can expire

Module four showed that a Temporary or Emergency change must carry a readable expiry date before it goes in. This module reads what the engine does with that date once it has one. The first rule is about when the date means anything at all.

## An expiry date is a plan until the change is in effect

Only a change in effect can expire. The in-effect stages are "Implementation" and the Closed stage. A temporary change still in "Screening" or "Review" is not running anywhere, so its expiry date is a plan. Nothing on the plant has been altered, so nothing needs to come back out.

The engine prints the same expiry date, one day past the as-of date of 2026-10-01, read across types and stages:

| type | stage | expiry state | counted expired |
| --- | --- | --- | --- |
| "Temporary" | "Implementation" | "Expired" | yes |
| "Emergency" | "Implementation" | "Expired" | yes |
| "Temporary" | "Closed" | "Closed out" | no |
| "Temporary" | "Review" | "No expiry" | no |
| "Temporary" | "Screening" | "No expiry" | no |
| "Temporary" | "Cancelled" | "No expiry" | no |
| "Permanent" | "Implementation" | "Permanent change" | no |

Every row in that table was also replayed through the module's independent Python oracle.

## Read the table by its stage column

The date is the same on every row. What changes the answer is the stage and the type.

- **"Implementation"**: the change is on the facility, the date has passed, and both a Temporary and an Emergency change read "Expired". Both are counted expired.
- **The Closed stage**: the change is finished. A closed temporary change reads "Closed out", so a change that was taken through to the Closed stage is not reported as expired for ever after.
- **"Review", "Screening" and "Cancelled"**: the change is not in effect, so its date is not an expiry the engine will act on. It reads "No expiry".
- **"Permanent"**: there is no expiry to read, whatever the stage. It reads "Permanent change".

Only the two "Implementation" rows on a type that carries an expiry are counted expired.

## A date in the past on a change not yet in

The ESANMI register carries a live example. ES-10 is a Temporary change in "Screening" with an expiry of 2026-09-01, a date already behind the as-of date of 2026-10-01. It reads "No expiry" and is not counted expired. The date passed while the change was still being screened, and nothing on the facility is due to come out, because nothing went in.

{{panel:rc-change-explorer}}

## Why the rule is written this way

An expired count on a dashboard is an alarm: something is on the plant that should have come off. If the count included changes not yet implemented, the alarm would fire for paperwork, and people learn to ignore alarms that fire for paperwork. Reading expiry only while the change is in effect keeps the count to the changes where it means something.

## Exercise

For a date one day past 2026-10-01, record the expiry state and whether it is counted expired for a Temporary change in "Implementation", in the Closed stage, in "Review" and in "Cancelled", and for a Permanent change in "Implementation". Then record ES-10's expiry state from the ESANMI register and say which rule produced it.
