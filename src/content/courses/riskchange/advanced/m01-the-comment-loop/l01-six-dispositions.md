# Six dispositions

This tier leaves the risk register and the change register behind and follows the work that happens after a design is written: somebody reads it, raises comments, and the comments are dealt with one at a time until the review can close. The Peer Review Manager keeps that record, and the peerReview engine decides what each comment's status means.

{{panel:rc-review-explorer}}

## A comment carries one status at a time

The engine knows six comment statuses: "Open", "Responded", "Verified", "Closed", "Rejected" and "Withdrawn". A comment starts "Open" when a reviewer raises it. Every other status is reached by a move from the one before, and the engine allows only the moves in this table:

| from | legal next statuses | who makes each move |
| --- | --- | --- |
| "Open" | "Responded", "Withdrawn" | Responded by the author, Withdrawn by the reviewer |
| "Responded" | "Verified", "Rejected" | Verified by the reviewer, Rejected by the reviewer |
| "Verified" | "Closed" | Closed by the coordinator |
| "Closed" | none | none |
| "Rejected" | "Responded", "Withdrawn" | Responded by the author, Withdrawn by the reviewer |
| "Withdrawn" | none | none |

Read the table as a loop with two exits. The author answers an open comment, which makes it "Responded". The reviewer then either accepts the answer, making it "Verified", or refuses it, making it "Rejected". A rejected comment goes back to the author, who responds again, and the loop turns until the reviewer is satisfied or withdraws the comment. A verified comment is handed to the coordinator, who closes it out.

## Resolved is a set, and it has three members

The engine groups three statuses as resolved, meaning nobody still has to act: "Verified", "Closed" and "Withdrawn". The other three, "Open", "Responded" and "Rejected", each wait on somebody. An open comment waits on the author. A responded comment waits on the reviewer. A rejected comment waits on the author again.

That grouping is the whole reason the statuses matter. Later in this tier a review is refused closure while any blocking comment is unresolved, and "unresolved" means exactly those three statuses.

## "Closed" here is a comment status

The word "Closed" appears twice in peer review. It is one of the six comment statuses above, the coordinator's move after verification. It is also one of the five review stages ("Draft", "In Review", "Verification", "Closed", "Cancelled"). This module uses it for the comment unless it says the review.

## Seven moves out of thirty-six

With six statuses there are 36 ordered pairs of a status and a status to move to. The digest records that 7 of them are legal moves, and those seven are the entries in the table. Every other pair is refused, and the engine explains each refusal in its own words, which is the subject of the fourth lesson in this module.

Every engine answer quoted in this module was also replayed through the independent Python oracle for peerReview, so each is two methods agreeing.

## Exercise

Open the review explorer and walk one comment from "Open" to "Closed" by the shortest legal path. Record each status it passes through and who makes each move. Then record the three resolved statuses, the number of ordered pairs of statuses and the number of legal moves among them, and say which rule makes a "Rejected" comment count as unresolved.
