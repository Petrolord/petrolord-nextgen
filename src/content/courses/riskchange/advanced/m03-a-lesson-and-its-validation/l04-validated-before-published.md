# Validated before published

Publishing a lesson puts it in front of everyone in the organisation. The engine allows that only once somebody other than the author has accepted it, and it checks for the record of that acceptance at the moment of publishing.

{{panel:rc-review-explorer}}

## ON-05, a lesson waiting to be published

ON-05 is "Validated" on the ONNE register. It has substance, the organisation has accepted it, and it is not yet visible. The legal next statuses from "Validated" are "Published", "Submitted" and "Archived".

This lesson asks the engine to publish it twice:

- REFUSED, ON-05 moved to Published after its validation record is removed: This lesson has not been validated. Somebody other than its author has to accept it before it is published to everyone.
- ALLOWED, ON-05, validated by u-grace, moved to Published.

The status alone does not satisfy the engine. With the validation record removed, a lesson whose status reads "Validated" is refused publication, and the refusal says why in terms of people: somebody other than its author has to accept it first.

## Why the record matters more than the status

A status is one field, and a field can be set by anything that writes to the table. A validation record says who accepted the lesson and when. By asking for the record, the engine ties publication to an act by a person, and a lesson cannot reach everyone on the strength of a status somebody typed.

## What visibility decides

The engine's visible statuses are "Published" and "Embedded". Visibility decides several of the answers the rest of this tier reads. Only a visible lesson has a review status, so only a visible lesson can read review due soon or review overdue. The summary counts lessonsApplied and lessonsUnapplied over visible lessons only. And the attention order, lessonByAttention, puts visible lessons nobody has applied first.

ON-05 shows the edge on 2026-10-01. Its review date is 2026-10-06, inside the lead before a review, and it reads neither overdue nor due soon, because it is not yet visible to anybody. Once it is published it will be asked those questions like any other visible lesson.

## A stated limit

The engine checks that a validation record exists. The course lists, among the held items, that publishing does not check again who validated it. The independence rule is enforced when the validation is recorded, and the second and third lessons of this module read that rule in full. Publishing relies on it having been enforced there.

## The route back

A validated lesson can also go back to "Submitted", and a submitted lesson back to "Draft". If the validator finds a gap, the lesson returns to its author rather than being published with the gap in it.

Every answer here was also replayed through the independent oracle for lessonsLearned, so each is two methods agreeing.

## Exercise

Record the engine's sentence when ON-05 is published with its validation record removed, and whether it may be published once validated by u-grace. Then record ON-05's review date and its overdue and due soon readings on 2026-10-01. Say which rule gives those readings, and which two statuses the engine counts as visible.
