# Who moves a comment

A legal move is only half of what the engine checks. Every legal move also has an owner, and the engine carries that ownership in a table it calls TRANSITION_ACTOR. Three roles take part in a comment's life, and each has its own moves.

{{panel:rc-review-explorer}}

## The author

The author wrote the work under review. The author's one move is "Responded", from "Open" or from "Rejected". Responding means writing an answer on the comment: the change made, or the reason nothing needs changing. The author never decides whether that answer is good enough.

## The reviewer

The reviewer raised the comment and owns three moves. From "Responded" the reviewer takes it to "Verified", accepting the answer, or to "Rejected", refusing it. From "Open" or "Rejected" the reviewer can take it to "Withdrawn", withdrawing a comment that on reflection should never stand. All three are judgements about the substance of the comment, and they belong to the person who raised it.

## The coordinator

The coordinator runs the review. The coordinator's one move is "Closed", from "Verified". It is administrative: the reviewer has already accepted the response, and closing records that the comment is finished with.

## The table read by role

| from | legal next statuses | who makes each move |
| --- | --- | --- |
| "Open" | "Responded", "Withdrawn" | Responded by the author, Withdrawn by the reviewer |
| "Responded" | "Verified", "Rejected" | Verified by the reviewer, Rejected by the reviewer |
| "Verified" | "Closed" | Closed by the coordinator |
| "Rejected" | "Responded", "Withdrawn" | Responded by the author, Withdrawn by the reviewer |

Count the moves by owner and the shape of the loop shows. The author has "Responded" from two statuses. The reviewer has "Withdrawn" from two statuses, and "Verified" and "Rejected" from one. The coordinator has "Closed" from one. That is the 7 legal moves the lab counts, split so that the person being reviewed answers and the person reviewing decides.

## Why the split matters

A comment loop is a small piece of segregation of duties. If the author could verify their own response, a comment would be resolved by the person it was aimed at, and the record would say "Verified" over a judgement nobody independent made. The engine reads the reviewer's three moves as the ones the author may never take. On IKANG review IK-01, whose author is u-efe, the author responding to C-01 is allowed, and the author closing out C-02, a comment that is already "Verified", is allowed too. The author verifying, rejecting or withdrawing is refused, and the second module of this tier teaches that rule from the engine's own sentences.

Two refusals sit outside the roles. A move asked with nobody signed in is refused with "Sign in to act on this comment." A move the table does not hold is refused whoever asks: u-kemi, an independent reviewer, responding to C-02, which is already "Verified", reads "A verified comment can only go to Closed."

## Exercise

Record which role makes each of the 7 legal moves, and how many moves each role owns. Then take C-03, a "Responded" comment on IK-01, and record what the reviewer may move it to and what the author may move it to. Say which table in the engine produced each answer.
