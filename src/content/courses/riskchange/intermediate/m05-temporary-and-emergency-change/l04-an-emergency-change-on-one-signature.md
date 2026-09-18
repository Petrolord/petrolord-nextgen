# An emergency change on one signature

Most changes wait at the gate into "Implementation" until every approval level has signed. An Emergency change does not have to. This lesson reads the route the engine opens for it and the conditions that still hold.

## The route, as owner policy

The emergency route and its ratification window are owner policy, decision Q9 under AS15, taken on 2026-09-18. The owner's own summary of it is: reduced authority up front so a hazard can be dealt with, full review after the event.

In the engine's terms, an Emergency change may go into "Implementation" once its FIRST approval level has signed and nobody has rejected it. Every other level must then sign within EMERGENCY_RATIFY_DAYS, 7 days, of the actual implementation date, and the change cannot close until they have.

## Three probes at the gate

Each probe was also replayed through the module's independent oracle:

- ALLOWED, an Emergency change in Approval into Implementation with level 1 signed and level 2 pending.
- REFUSED, the same change with level 1 unsigned: An emergency change can go in once approval level 1 has signed, with the rest ratified within 7 days. Level 1 has not signed yet.
- REFUSED, a Permanent change with level 1 signed and level 2 pending: Approval level 2 has not signed yet.

The first and third probes have the same signatures, level 1 signed and level 2 pending. Only the type differs, and the type decides: a Permanent change needs every level, an Emergency change only level 1.

The second refusal states the whole policy in one sentence: the change can go in on level 1, the rest must ratify within 7 days, and level 1 is the one missing.

## What the route does not relax

The route changes one condition of the gate. It still holds:

- **Nobody has rejected it.** A rejection anywhere stops an emergency change exactly as it stops any other.
- **Level 1 must sign.** One signature is reduced authority; none is no authority.
- **Pre-implementation actions** must be finished.
- **A readable expiry date.** "Emergency" is one of the two types that must carry one.

And it adds a condition at the other end. The gate into the Closed stage refuses an Emergency change until every level has signed:

- REFUSED, an Emergency change in Implementation into Closed with level 2 still unsigned: Approval level 2 has not ratified this emergency change. It cannot close until every level has signed.

The route lets the change in early and never lets it finish early.

{{panel:rc-change-explorer}}

## The route belongs to the type

The route belongs to the type, "Emergency", which stays on the record, so every later reader can see that the change went in on one signature. The ESANMI register holds three, ES-04, ES-05 and ES-12, all in "Implementation" on 2026-10-01.

## Exercise

Record the engine's answer at the gate into "Implementation" for an Emergency change with level 1 signed and level 2 pending, for the same change with level 1 unsigned, and for a Permanent change with level 1 signed and level 2 pending. Quote both refusals. Then record the refusal when that Emergency change is moved to the Closed stage with level 2 unsigned, and say which part of decision Q9 produced each answer.
