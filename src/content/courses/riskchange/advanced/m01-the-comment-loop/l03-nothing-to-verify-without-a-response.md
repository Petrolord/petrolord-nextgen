# Nothing to verify without a response

The table of legal moves says a "Responded" comment may go to "Verified". The engine asks one more question before it allows that move: is there a response to verify?

{{panel:rc-review-explorer}}

## The status and the text are two fields

A comment in the Peer Review Manager carries a status and, separately, the author's response text. The engine is handed both, and the two can disagree: a comment can arrive with its status reading "Responded" and no response text on it at all. If the engine looked only at the status, a reviewer could verify a response nobody wrote, and the record would claim a question had been answered with nothing to show for it.

So the move to "Verified" checks the text as well. The digest records the probe, a comment set to "Responded" with no response text on it, asked to move to "Verified":

- REFUSED, Responded to Verified with no response text on the comment: A comment cannot be verified before the author has responded to it.

The refusal names the missing step in plain words. The author has to respond, and then there is something to verify.

## What verifying means

Verifying is the reviewer's statement that the author's response answers the comment. It is a judgement about text, and a judgement about text needs text. That is why the loop turns on the response. The author's move produces the thing the reviewer judges. The reviewer's "Rejected" sends it back for a better answer, and the author responds again from "Rejected", which the legal table allows. Each turn of the loop leaves a response behind it.

## A comment with no status

The engine also has an answer for the opposite gap, a comment row with no status at all. It reads as "Open". The digest records the probe:

- REFUSED, a comment with no status, which reads as Open, moved to Closed: An open comment can only go to Responded or Withdrawn.

The engine does not guess that a statusless comment is finished. It treats it as the start of the loop, where somebody still has to act, and it refuses the shortcut to "Closed" with the same sentence any open comment gets.

Both answers were also replayed through the independent oracle for peerReview, so each is two methods agreeing.

## What the engine does not judge

The check is for a response, and it stops there. The engine cannot tell whether the response is correct, or even whether it addresses the comment. That remains the reviewer's work, which is why verifying belongs to the reviewer and to nobody else.

## Exercise

In the review explorer set a comment to "Responded" with an empty response and ask for "Verified". Record the engine's sentence. Then clear the comment's status, ask for "Closed" and record that sentence too. Say which status the engine reads a statusless comment as, and which field the move to "Verified" checks besides the status.
