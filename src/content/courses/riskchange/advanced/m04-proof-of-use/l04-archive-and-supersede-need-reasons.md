# Archive and supersede need reasons

A lesson leaves use in one of two ways. It is archived, because it no longer applies, or it is superseded, because a better lesson replaces it. Both statuses are final, and the engine asks for the reason before it allows either.

{{panel:rc-review-explorer}}

## Where the two exits sit

| from | legal next statuses |
| --- | --- |
| "Draft" | "Submitted", "Archived" |
| "Submitted" | "Validated", "Draft", "Archived" |
| "Validated" | "Published", "Submitted", "Archived" |
| "Published" | "Embedded", "Superseded", "Archived" |
| "Embedded" | "Superseded", "Archived" |
| "Archived" | none |
| "Superseded" | none |

Archiving is open from every live status. Superseding is open only from "Published" and "Embedded", the two visible statuses. Neither exit has a way back.

## Archiving asks why

ON-10 is "Published" on the ONNE register. Asked to archive it with no reason given, the engine refuses:

- REFUSED, ON-10 archived with no reason: Say why this lesson is being archived. "Archived, nobody said why" is how a lessons database becomes a folder of PDFs.
- ALLOWED, ON-10 archived with a reason.

The refusal's second sentence is the warning. A lesson that disappears without a reason leaves the next reader unable to tell whether it was wrong, out of date or simply tidied away. Enough of those and the database stops being a record of what the organisation learned.

## Superseding asks what replaces it

A superseded lesson has a successor. The engine refuses the move without one, and refuses the one successor that makes no sense:

- REFUSED, ON-10 superseded with no successor named: Name the lesson that replaces this one.
- REFUSED, ON-10 superseded by itself: A lesson cannot supersede itself.

Naming the successor keeps the trail intact. A reader who finds ON-09, "Superseded" on the ONNE register, should be able to follow it to the lesson that took its place.

## Final means final

Once a lesson is archived, every move out of it is refused:

- REFUSED, an Archived lesson moved anywhere: An archived lesson is final.

The legal table lists no move out of "Superseded" either. The record of why a lesson left use stays as it was written.

## The shortcut refused

The same table stops a lesson skipping its checks:

- REFUSED, a Draft lesson moved straight to Published: A lesson that is draft can only move to Submitted, Archived.

A draft goes to "Submitted" and on through validation, or it is archived.

Every answer here was also replayed through the independent oracle for lessonsLearned, so each is two methods agreeing.

## Exercise

Record the engine's sentence when ON-10 is archived with no reason, superseded with no successor and superseded by itself. Then record the legal next statuses from "Published" and from "Draft". Say which two statuses a lesson can be superseded from, and what the engine needs before it allows each exit.
