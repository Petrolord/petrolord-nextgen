# Three parts of a lesson

The Lessons Learned app keeps an organisation's lessons, and the lessonsLearned engine decides what each one's record means. The first thing it asks of a lesson is whether it has substance at all.

{{panel:rc-review-explorer}}

## What happened, why, and what to do

A lesson has substance when it records three things: what happened, why it happened and what to do about it. The engine checks for all three. The first two without the third are a story: an account of an event that tells the next person nothing they can act on.

The third part is the one that makes a lesson useful to somebody who was not there. A crane lift that dropped a load, told well, is an incident report. The same account with a recommendation attached is a lesson another site can apply.

## The ONNE register read for substance

| lesson | status | substance | missing | accepted | visible |
| --- | --- | --- | --- | --- | --- |
| ON-01 | "Published" | yes | none | yes | yes |
| ON-02 | "Embedded" | yes | none | yes | yes |
| ON-03 | "Published" | yes | none | yes | yes |
| ON-04 | "Published" | yes | none | yes | yes |
| ON-05 | "Validated" | yes | none | yes | no |
| ON-06 | "Submitted" | no | what to do about it | no | no |
| ON-07 | "Draft" | no | why it happened, what to do about it | no | no |
| ON-08 | "Archived" | yes | none | no | no |
| ON-09 | "Superseded" | yes | none | no | no |
| ON-10 | "Published" | yes | none | yes | yes |

ON-06 is "Submitted" and lacks its recommendation. ON-07 is a "Draft" that records only what happened. Both read substance no, and the missing column names the parts in the engine's own words.

## Seven statuses and three groups

The engine knows seven lesson statuses: "Draft", "Submitted", "Validated", "Published", "Embedded", "Archived", "Superseded". It groups them three ways.

- Live: "Draft", "Submitted", "Validated", "Published", "Embedded".
- Accepted by the organisation: "Validated", "Published", "Embedded".
- Visible to everyone: "Published", "Embedded".

Accepted and visible are different questions. ON-05 is "Validated": the organisation has accepted it, and it is not yet visible to everyone. The accepted column reads yes and the visible column no. ON-08 and ON-09 have substance and are neither accepted nor visible, because an archived or superseded lesson is out of use.

## Where substance is enforced

A lesson without its third part can still be written and submitted. The check bites at validation, the step where somebody other than the author accepts the lesson for the organisation. Asked to validate ON-06, the engine refuses:

- REFUSED, ON-06, which has no recommendation, validated by u-grace: This lesson is missing what to do about it. A lesson is what happened, why it happened and what to do about it; the first two without the third are a story.

u-grace did not write ON-06, so independence is not the problem. The lesson itself is incomplete, and the refusal names the missing part so the author knows what to add.

Every answer here was also replayed through the independent oracle for lessonsLearned, so each is two methods agreeing.

## Exercise

Record the substance and missing columns for ON-06 and ON-07, and the engine's sentence when u-grace validates ON-06. Then record the three status groups and say which rule makes ON-05 accepted and not visible.
