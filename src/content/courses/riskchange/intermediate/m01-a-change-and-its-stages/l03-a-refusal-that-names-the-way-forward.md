# A refusal that names the way forward

Every engine in this course answers a question that can be refused in the same shape. The verdict comes back as an object with `ok`, and a refusal carries a `reason` a user can act on. The stage machine is where that shape is easiest to see, because its reasons are built from the table itself.

## Four refusals and one allowance

These are the engine's own words, quoted exactly:

- REFUSED, Review straight to Closed: A change in Review can only move to Approval, Rejected, Cancelled, Screening.
- REFUSED, Draft straight to Approval: A change in Draft can only move to Screening, Cancelled.
- REFUSED, Implementation back to Approval: A change in Implementation can only move to Closed, Cancelled.
- REFUSED, a Closed change moved anywhere: A closed change is final.
- ALLOWED, Draft to Screening.

Each of these was also replayed through the module's independent oracle.

## The sentence is the row

Read the first refusal against the table from the last lesson. The row for "Review" lists "Approval", "Rejected", "Cancelled" and "Screening", and the refusal lists the same four in the same order. It names the stage the change is in and every move that stage allows.

That is what "a reason a user can act on" means in practice. Somebody who tried to close a change in review learns, from the sentence alone, that the change has to go through "Approval" first. Nobody has to open the stage table to find the way forward, because the refusal carried it.

## When there is no way forward

A final stage has an empty row, so the sentence changes shape. "A closed change is final." and "A rejected change is final." list no moves because there are none to list. The refusal is still actionable: it tells the user that no move exists for this record.

## Allowed is an answer too

"ALLOWED, Draft to Screening" is as much an engine answer as any refusal. An allowed move carries no reason because nothing needs explaining, and a report should record it with the same care.

{{panel:rc-change-explorer}}

## Refusals later in this tier

The same shape runs through every gate this tier reads, and each reason again names the way forward:

- an approval assigned to the originator: The originator of a change cannot approve it. Choose somebody independent of the change.
- a gate with approvals unsigned: Approval levels 2 and 3 have not signed yet.
- a gate with a Pre-implementation action open: 1 pre-implementation action still open. They exist to be done before the change goes in.

Each one says what stands in the way and what would clear it: choose somebody independent, get levels 2 and 3 signed, finish the action. Read every refusal in this course for those two parts.

## Quote the sentence exactly

Quote a refusal the way the engine prints it. A paraphrase such as "cannot close from review" loses the list of legal moves, the useful half of the sentence.

## Exercise

Take the refusal for Implementation back to Approval. Record the stage the change is in, the moves the sentence lists, and the row of the stage table that produced them. Then record the refusal for a Closed change moved anywhere, and say why its sentence lists no moves.
