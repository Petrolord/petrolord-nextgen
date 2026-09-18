# The lifecycle answers for itself

Every obligation has a lifecycle as well as dates. complianceStatus.LIFECYCLES holds four words for it: Active, Draft, Superseded and Not applicable. An Active obligation is counted down against its dates. For the other three the lifecycle is the status, and the engine says so in its reason. The lifecycle is a field on the record because it records a decision somebody made about the obligation. The status is still derived.

## Three rows the dates do not touch

These three IKORO obligations all carry dates, and none of them is tracked against those dates at the as-of date of 2026-10-15:

| code | obligation | lifecycle | due | days until | status |
| --- | --- | --- | --- | --- | --- |
| REG-2026-009 | Original environmental impact approval | Superseded | 2025-01-06 | -647 | Superseded |
| REG-2026-010 | Safety case resubmission | Draft | 2027-06-30 | 258 | Draft |
| REG-2026-011 | Night noise permit | Not applicable | 2026-05-01 | -167 | Not applicable |

{{panel:compliance-register-explorer}}

explainStatus gives the reason for each, and the three reasons share one shape:

- REG-2026-009: "Lifecycle is Superseded, so it is not tracked against a date."
- REG-2026-010: "Lifecycle is Draft, so it is not tracked against a date."
- REG-2026-011: "Lifecycle is Not applicable, so it is not tracked against a date."

Look at the days until column. The night noise permit's due date passed, and its count reads -167. The original approval's count reads -647. Neither is Overdue. The day count is still printed because the date is still on the record, and the status ignores it because the lifecycle says the obligation is not live.

## What each lifecycle means

Draft is an obligation being set up. The safety case resubmission has a due date entered, but the record is not yet in force, so it would be wrong to warn anyone about it.

Superseded is an obligation replaced by another. The original environmental impact approval has been overtaken, and whatever replaced it carries the live dates.

Not applicable is an obligation that does not bind this operator. The night noise permit is on the register as a record of that decision.

## The lifecycle is checked first

The digest takes one obligation and changes one field at a time to show the order the engine checks things. REG-2026-005, the radioactive source licence, reads Expired as recorded, with a count of -15. Set its lifecycle to Superseded and nothing else, and it reads Superseded with the same -15. The lapsed expiry that made it the worst row in the register no longer counts, because the lifecycle is read first.

One more variant is worth knowing. Give the same licence a lifecycle word the list does not have, Archived, and it reads Expired, the same status as the licence as recorded. A word outside the four does not switch the countdown off. Only Draft, Superseded and Not applicable do that.

## Exercise

Read the days until and the status of REG-2026-011 and of REG-2026-009. Say why neither reads Overdue although both due dates have passed. Then read the two variants of REG-2026-005, Superseded and Archived, and say what each one shows about the order in which the engine reads the lifecycle and the dates.
