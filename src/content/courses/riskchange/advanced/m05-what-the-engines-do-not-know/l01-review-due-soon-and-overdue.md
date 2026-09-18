# Review due soon and overdue

A lesson written in one year can be wrong a few years later: the equipment changed, the procedure it altered was replaced, the risk it raised was closed. So a visible lesson carries a review date, and the engine reads two statuses from it. Both depend on the day they are asked, and every reading in this lesson is the reading on 2026-10-01.

{{panel:rc-review-explorer}}

## "Overdue" here is a lesson's review date

In this lesson "overdue" means a visible lesson whose review date has passed. It is a different question from a peer review's due date, a risk's review date or an action's due date, and the engine answers each separately.

## Two statuses and a lead

A visible lesson reads "review due soon" from REVIEW_LEAD_DAYS, 30 days, before its review date, both ends counted. It reads "review overdue" once the date has passed. The digest moves one review date across the as-of date to show the edges:

| review due | days until | overdue | due soon |
| --- | --- | --- | --- |
| 2026-09-30 | -1 | yes | no |
| 2026-10-01 | 0 | no | yes |
| 2026-10-02 | 1 | no | yes |
| 2026-10-30 | 29 | no | yes |
| 2026-10-31 | 30 | no | yes |
| 2026-11-01 | 31 | no | no |

Read the edges. A review due on 2026-10-01 itself, 0 days away, is due soon and not overdue: the date has arrived and has not passed. A review 30 days away is still due soon, because both ends of the lead are counted. At 31 days away the lesson reads neither. The day after the date, at -1, it reads overdue and not due soon. No row of the table reads both.

## Only a visible lesson has a review status

The engine asks these questions only of a visible lesson, one that is "Published" or "Embedded". A lesson that is not visible has no review status at all.

ON-05 on the ONNE register shows why that matters. It is "Validated", with a review date of 2026-10-06, inside the lead on 2026-10-01. It reads neither overdue nor due soon, because it is not yet visible to anybody. A lesson nobody can read yet has nobody to act on a reminder about it.

## The ONNE lessons that read a status

On 2026-10-01 the ONNE register gives:

- ON-02, "Embedded", review due 2026-09-20: overdue.
- ON-01, "Published", review due 2026-10-20: due soon.
- ON-03, "Published", review due 2026-10-31: due soon.
- ON-10, "Published", review due 2026-11-01: neither.
- ON-04, "Published", with no review date: neither.

ON-03 sits on the far edge of the lead, due in 30 days, and reads due soon. ON-10 sits one day past it, due in 31 days, and reads neither. Both are exactly the rows of the edge table above.

The summary counts reviewsOverdue 1 and reviewsDueSoon 2.

## What the app does with them

The digest records an app finding beside these counts: the Lessons Learned dashboard computes reviewsOverdue and reviewsDueSoon and does not display either. The engine answers the question. Whether a user sees the answer is the app's part, and RECON.md records that gap.

Every answer here was also replayed through the independent oracle for lessonsLearned, so each is two methods agreeing.

## Exercise

Record, on 2026-10-01, the overdue and due soon readings for review dates of 2026-10-01, 2026-10-31 and 2026-11-01, and ON-05's readings with its review date. Then record reviewsOverdue and reviewsDueSoon for the ONNE register. Say which rule sets the edge of the lead, and which rule leaves ON-05 without a status.
