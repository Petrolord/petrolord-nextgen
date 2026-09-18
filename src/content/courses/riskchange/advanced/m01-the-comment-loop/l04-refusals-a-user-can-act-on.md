# Refusals a user can act on

Of the 36 ordered pairs of comment statuses, 7 are legal moves. The digest asks the engine for every one of the others, and every refusal comes back with a sentence. This lesson reads those sentences for what they tell the person who asked.

{{panel:rc-review-explorer}}

## The shape of every refusal

A refused move comes back as an object with `ok` false and a `reason`. The four assurance engines refuse in the same shape, and the reason is written for a user rather than for a log file. The comment refusals fall into three families.

## A move to where it already is

Asking a comment to move to its own status is refused with a sentence that says so:

- REFUSED, Open to Open: This comment is already open.
- REFUSED, Responded to Responded: This comment is already responded.
- REFUSED, Verified to Verified: This comment is already verified.
- REFUSED, Rejected to Rejected: This comment is already rejected.

A user who clicks twice learns that nothing needed doing. The record does not change, and nothing pretends it did.

## A move the status does not allow

When the target is illegal from the current status, the refusal lists the legal targets instead of only saying no:

- REFUSED, Open to Verified: An open comment can only go to Responded or Withdrawn.
- REFUSED, Responded to Closed: A responded comment can only go to Verified or Rejected.
- REFUSED, Verified to Rejected: A verified comment can only go to Closed.
- REFUSED, Rejected to Closed: A rejected comment can only go to Responded or Withdrawn.

Each sentence names the way forward. A reviewer who tries to verify an open comment reads that it can go to "Responded" or "Withdrawn", and so learns that the author has to answer first.

## A move out of a final status

From "Closed" and "Withdrawn" every move is refused with one sentence for each status:

- REFUSED, Closed to Open: A closed comment is final.
- REFUSED, Withdrawn to Responded: A withdrawn comment is final.

A final status lists no way forward because there is none. The only exception in wording is the move to the same status, which reads "This comment is already closed." or "This comment is already withdrawn."

## Why the sentences matter

A refusal that only said "not allowed" would leave the user guessing, and a guess tends to become a workaround: a new comment raised to replace the stuck one, or a status edited directly in the database. A refusal that names the legal moves keeps the user inside the loop, and the loop is what the record is for.

These sentences are quoted exactly as the engine prints them, so the words a learner reads here are the words the app shows. Every answer was also replayed through the independent oracle for peerReview, so each is two methods agreeing.

## Exercise

In the review explorer, ask one comment in each of the six statuses to move to "Closed". Record which of the six moves are allowed and the exact sentence for each refusal. Then sort those sentences into the three families above, and say which family never names a way forward and why.
