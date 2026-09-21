# The ONNE register summarised

The Lessons Learned dashboard does not read lessons one at a time. It asks the engine for a summary and an order, and this lesson reads both for the ONNE register as they stand on 2026-10-01.

{{panel:rc-review-explorer}}

## The register on 2026-10-01

| lesson | status | event date | age in days | review due | overdue | due soon | applied nowhere |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ON-01 | "Published" | 2026-03-12 | 203 | 2026-10-20 | no | yes | no |
| ON-02 | "Embedded" | 2026-01-20 | 254 | 2026-09-20 | yes | no | no |
| ON-03 | "Published" | 2026-06-05 | 118 | 2026-10-31 | no | yes | yes |
| ON-04 | "Published" | 2026-05-30 | 124 | null | no | no | yes |
| ON-05 | "Validated" | 2026-08-14 | 48 | 2026-10-06 | no | no | no |
| ON-06 | "Submitted" | 2026-09-10 | 21 | null | no | no | no |
| ON-07 | "Draft" | 2026-09-25 | 6 | null | no | no | no |
| ON-08 | "Archived" | 2025-02-01 | 607 | null | no | no | no |
| ON-09 | "Superseded" | 2025-06-01 | 487 | null | no | no | no |
| ON-10 | "Published" | 2026-07-01 | 92 | 2026-11-01 | no | no | no |

## Age is counted from the event

A lesson's age is counted from its event date, the day the thing it records happened, to the as-of date. With no event date it falls back to the record's creation timestamp, read as the local calendar date of that instant, so the same row can be a day older in Lagos than in UTC. Every ONNE lesson records its event date, which is why every age above is the same in every zone.

Age carries no status of its own. ON-02, at 254 days, reads overdue because its review date, 2026-09-20, has passed. ON-01, at 203 days, reads due soon because its review date, 2026-10-20, falls inside the lead. ON-08, at 607 days, reads neither, because an archived lesson is not visible and has no review status. The review date and the status decide; the age is context for the reader.

## The summary

| count | value |
| --- | --- |
| lessons | 10 |
| live | 8 |
| visible | 5 |
| awaitingValidation | 1 |
| drafts | 1 |
| applications | 6 |
| applied | 4 |
| rejected | 2 |
| lessonsApplied | 3 |
| lessonsUnapplied | 2 |
| intoRiskRegister | 1 |
| intoMoc | 1 |
| reviewsOverdue | 1 |
| reviewsDueSoon | 2 |

Two kinds of count sit in the same table, and this lesson separates them. lessonsApplied and lessonsUnapplied count LESSONS, visible ones only. applied, rejected, intoRiskRegister and intoMoc count APPLICATIONS.

So lessonsApplied 3 is ON-01, ON-02 and ON-10, the visible lessons with at least one adoption or adaptation. lessonsUnapplied 2 is ON-03 and ON-04, the two rows reading "applied nowhere" above. Beside them, applied 4 counts the adopting and adapting applications themselves, two of which belong to ON-01. The two kinds of count answer two different questions, and a dashboard tile that showed "applied" without saying which would invite the wrong reading.

awaitingValidation 1 is ON-06, "Submitted". drafts 1 is ON-07. reviewsOverdue 1 is ON-02, and reviewsDueSoon 2 is ON-01 and ON-03; ON-05 is not among them, because it is not yet visible. live 8 is the ten lessons less ON-08 and ON-09. visible 5 is the four "Published" lessons and the one "Embedded".

## What needs attention first

The engine's lessonByAttention orders the register for the person responsible for it: visible lessons nobody has applied, then lessons awaiting validation, then overdue reviews, then other live lessons, then the rest, newest event first within a rank:

- ON-03, ON-04, ON-06, ON-02, ON-07, ON-05, ON-10, ON-01, ON-09, ON-08.

ON-03 leads ON-04 inside the first rank because its event date, 2026-06-05, is newer than 2026-05-30. The two lessons out of use, ON-09 and ON-08, come last.

The ranking puts a visible lesson that has changed nothing ahead of a late review, and ahead of a lesson still waiting for validation. ON-02, the one overdue review, comes fourth.

Every figure here was also replayed through the independent oracle for lessonsLearned, so each is two methods agreeing.

## Exercise

Record, on 2026-10-01, the ONNE summary's lessons, live, visible, applications, applied, lessonsApplied and lessonsUnapplied, and name the lessons behind lessonsApplied and lessonsUnapplied. Then record the lessonByAttention order. Say which of those counts are counts of lessons and which are counts of applications, and which rule orders ON-03 ahead of ON-04.
