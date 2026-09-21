# A decision is a date and a name

A point on the Abam plan changes status only through a gate. The request goes to canDecideCheckpoint first, and the engine answers ALLOWED or REFUSED with its reason. A refused request changes nothing on the plan: the point keeps the status it had. This lesson reads the gate's answers when somebody asks to pass a point.

{{panel:compliance-plan-explorer}}

## Passing a hold point

H-08 is the hydrostatic test, a Hold point, Pending at the as-of date 2026-10-15 and planned for 2026-10-20. Asked to pass it with nobody named, the engine refuses:

"A hold point needs the date it was verified and who verified it. Without those it has not been held."

Asked to pass it with a date and a verifier, the engine answers ALLOWED. Those are the two rows the engine prints for H-08, and the difference between them is the record. What the gate reads is whether the plan will show when the hold was released and by whom. A pass with neither is an assertion nobody can check later.

## Passing a witness point

W-09, the hydrotest chart review, is a Witness point and also Pending at the as-of date. Asked to pass it with nobody named, the engine refuses with a different sentence:

"Record the date this was decided and who decided it."

A witness point does not stop work, yet its pass still needs a date and a name. The wording changes with the type. A hold point is "verified", a witness point is "decided", and the hold point refusal adds that without the record it "has not been held". The requirement underneath is the same pair: a date and a person.

## A status the vocabulary does not have

The engine also refuses a status it does not know:

"Accepted is not a checkpoint status."

The checkpoint vocabulary is a fixed list. The plan table at the as-of date uses Passed, Failed, Waived, Pending, In progress, Notified and Not applicable, and CHECKPOINT_RESOLVED_STATUSES counts three of them as resolved: Passed, Waived and Not applicable. A reviewer who types a friendly word such as Accepted has asked for nothing the plan can count, so the gate refuses it before it can reach the record.

## Why the gate comes first

Three things follow from putting the gate in front of the record.

1. A point's status is only ever one the engine has allowed, so progress counted from the statuses rests on allowed decisions.
2. Every resolved hold point carries a date and a verifier, because the engine refuses to resolve one without them.
3. The reason for a refusal names what is missing, so the person asking knows what to bring back.

The plan records who took responsibility for a check and when, and the name on the record is how anyone finds that person later.

## Exercise

In the plan explorer, ask to pass H-08 with nobody named, then with a date and a verifier, and do the same for W-09. Read the four answers against the engine's rows in SECTION 10. Say what the pair of refusals shows: what the hold point and the witness point both ask for, which words differ between the two sentences, and whether H-08's status moved after the refused request.
