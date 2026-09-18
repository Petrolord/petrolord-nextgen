# A typed name and the actor

The validation form in the Lessons Learned app has a field for the validator's name. The engine has to decide what that field means, because a name typed into a box is not the same as the person pressing the button.

{{panel:rc-review-explorer}}

## Two people in one validation

Every validation involves an actor, the signed-in person doing it. It may also carry a typed name. The engine keeps the two apart. The actor is always the signed-in person doing the validation, whatever name is typed. A typed name records an external reviewer and cannot launder the author.

That rule is owner policy, decided on 2026-09-18 under AS15 as Q10, validation by typed name.

## The author typing a colleague's name

ON-01 was written by u-musa. Read as if it were still "Submitted", the digest asks the engine what happens when the author validates it while typing a colleague name as the validator:

- REFUSED, its author validating it while typing a colleague name as the validator: The author of a lesson cannot validate it, and that includes recording somebody else's name. Ask a colleague who was not involved in writing it to validate it.

The sentence is the one the author gets without a typed name. The engine looks at who is signed in, finds the author, and refuses. The words "that includes recording somebody else's name" are there because this is the workaround the rule has to close.

## What a typed name is for

A typed name has a legitimate use. Some lessons are checked by somebody who has no account in the app: a specialist from a contractor, a reviewer from another company in a joint venture. The digest records the case:

- ALLOWED, u-grace recording an external reviewer by name.

Here u-grace is signed in, did not write ON-01, and records the external reviewer's name. The actor is independent of the lesson, and the typed name adds who else looked at it. The record shows both people.

## Why the actor decides

A name in a text field proves nothing about who typed it. If the engine accepted the typed name as the validator, the author could validate their own lesson by typing anyone's name, and the record would show an independent validation that never happened. So the engine reads the signed-in identity and treats the typed name as a note beside it.

## A limit at the next step

The rule protects the validation step itself. The digest records a held limit one step later: publishing a lesson checks that a validation record exists and does not check again who validated it. The protection therefore sits where the validation is recorded, and the fifth module of this tier reads that limit with the other held items.

Every answer here was also replayed through the independent oracle for lessonsLearned, so each is two methods agreeing.

## Exercise

Record the engine's sentence when u-musa validates ON-01 while typing a colleague's name, and whether u-grace recording an external reviewer by name is allowed. Say which of the two names the engine reads as the actor, which owner decision holds that rule and on which date it was taken, and what the publishing step does not check again.
