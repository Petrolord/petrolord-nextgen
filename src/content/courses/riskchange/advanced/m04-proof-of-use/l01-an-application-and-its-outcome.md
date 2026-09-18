# An application and its outcome

A lesson that is published has been accepted. It has not yet been learned. The lessonsLearned engine keeps a separate record for the moment somebody takes a lesson and does something with it, and it calls that record an application.

{{panel:rc-review-explorer}}

## Where a lesson can go

An application names a target, the thing the lesson was applied to. The engine knows eight target types: "Risk register", "Management of change", "Procedure", "Training", "Design standard", "Contract or tender", "Maintenance plan", "Other".

Two of those are Suite registers and carry a real key: "Risk register" and "Management of change". An application into either names a record another engine in this course decides about, a risk row or a change record. The other six name things outside the Suite registers, such as a procedure or a training course.

## Three outcomes

Every application carries an outcome: "Adopted", "Adapted" or "Rejected". The outcomes that changed something are "Adopted" and "Adapted". In plain terms, adopted means the lesson was taken as written, adapted means it was changed to fit and then used, and rejected means somebody considered the lesson for that target and decided against it.

A rejection is a real record. It is evidence that the lesson was read and weighed by somebody responsible for the target. It embeds nothing, because nothing changed.

## The ONNE application log

| application | lesson | target | outcome | applied on |
| --- | --- | --- | --- | --- |
| AA-01 | ON-01 | "Risk register" | "Adopted" | 2026-05-02 |
| AA-02 | ON-01 | "Procedure" | "Adapted" | 2026-07-14 |
| AA-03 | ON-01 | "Training" | "Rejected" | 2026-08-01 |
| AA-04 | ON-02 | "Management of change" | "Adopted" | 2026-06-10 |
| AA-05 | ON-03 | "Procedure" | "Rejected" | 2026-07-01 |
| AA-06 | ON-10 | "Maintenance plan" | "Adopted" | 2026-08-20 |

Six applications across four lessons. ON-01 has three, with every outcome represented once. ON-02 and ON-10 each have one adoption. ON-03 has one rejection and nothing else. ON-04, published like the others, has no application at all.

## Why the outcome is recorded at all

A system that recorded only adoptions would show every lesson either used or ignored. The real picture has a third state: considered and turned down for a reason. That state matters to the next person who picks up the lesson, because a rejection with its reasoning saves them repeating the same evaluation, and a string of rejections says something about the lesson itself.

The summary over the ONNE register counts applications 6, applied 4 and rejected 2. The applied count is the "Adopted" and "Adapted" applications, AA-01, AA-02, AA-04 and AA-06. The rejected count is AA-03 and AA-05. intoRiskRegister reads 1 and intoMoc reads 1, AA-01 and AA-04, because those are the two applications into the Suite registers.

## "Rejected" is used twice

The word "Rejected" appears in this course as a comment status, a change stage and an application outcome. Here it is an outcome: a decision recorded against one target, which says nothing about the lesson's own status. ON-01 has a rejected application and is still "Published".

Every figure here was also replayed through the independent oracle for lessonsLearned, so each is two methods agreeing.

## Exercise

Record the eight target types and name the two that carry a real key. Then record, from the ONNE summary, applications, applied, rejected, intoRiskRegister and intoMoc, and name the applications behind each count. Say which outcomes the engine counts as having changed something, and why a rejection is still a record worth keeping.
