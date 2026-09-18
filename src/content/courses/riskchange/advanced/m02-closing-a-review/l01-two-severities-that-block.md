# Two severities that block

Every comment in a peer review carries a severity, and the severity decides whether an unresolved comment can hold the whole review open. The engine rates comments on four levels and lets two of them block.

{{panel:rc-review-explorer}}

## Four severities, worst first

The engine lists the comment severities worst first: "Critical", "Major", "Minor", "Editorial". The blocking severities are "Critical" and "Major". A blocking comment is one with a blocking severity whose status is unresolved, meaning "Open", "Responded" or "Rejected". A "Minor", an "Editorial" or an unrated comment never blocks, open or not.

## IK-01's comment log

IK-01, Water injection pump selection, is a review in "Verification" on the IKANG register. Its log, as the engine reads it:

| comment | severity | status | resolved | blocking |
| --- | --- | --- | --- | --- |
| C-01 | "Critical" | "Open" | no | yes |
| C-02 | "Critical" | "Verified" | yes | no |
| C-03 | "Major" | "Responded" | no | yes |
| C-04 | "Major" | "Rejected" | no | yes |
| C-05 | "Major" | "Withdrawn" | yes | no |
| C-06 | "Minor" | "Open" | no | no |
| C-07 | "Editorial" | "Open" | no | no |
| C-08 | "Critical" | "Closed" | yes | no |
| C-09 | none | "Open" | no | no |

Read the blocking column as two questions asked in turn. Is the severity "Critical" or "Major"? Is the status one of the three unresolved ones? Only a yes to both blocks.

## Severity alone does not block

C-02 and C-08 are both "Critical" and neither blocks, because C-02 is "Verified" and C-08 is "Closed". C-05 is "Major" and does not block, because the reviewer withdrew it. A severe comment that has been dealt with holds nothing open.

## Status alone does not block either

C-06, C-07 and C-09 are all "Open", and none of them blocks. C-06 is "Minor", C-07 is "Editorial", and C-09 carries no severity at all. A reviewer who wants a comment to stop the review has to rate it "Critical" or "Major". A comment with no rating cannot hold a review open on its own.

## Responded and Rejected still block

The two rows a reader is most tempted to misread are C-03 and C-04. C-03 is "Responded": the author has answered, and the reviewer has not yet accepted the answer. C-04 is "Rejected": the reviewer did not accept the answer. Both still block. A response is a claim that the comment is dealt with, and only the reviewer's verification turns that claim into a resolved comment.

So the blocking comments on IK-01 are C-01, C-03 and C-04, 3 in all. The engine reads 1 of them as "Critical" and 2 as "Major", and the next lesson quotes the refusal that says exactly that.

## Where the unrated comment is counted

C-09 still appears in the review's counts. The engine's summary puts it in the comment total and in the open count, and in no severity column, because it has no severity to be counted under. The count of comments on IK-01 is 9, and the severity columns hold "Critical" 3, "Major" 3, "Minor" 1 and "Editorial" 1.

These answers were also replayed through the independent oracle for peerReview, so each is two methods agreeing.

## Exercise

In the review explorer load IK-01 and record which comments block, how many are "Critical" and how many "Major". Then record the comment total and the four severity columns from the summary. Say which two conditions a comment has to meet to block, and why C-09 is open but never blocking.
