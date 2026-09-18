# A review that cannot close

A peer review exists to end in a decision that the work is fit to use. The engine lets the review reach its "Closed" stage only when nothing blocking is unresolved, and it says in one sentence what stands in the way when something is.

{{panel:rc-review-explorer}}

## "Closed" here is a review stage

The review stages are "Draft", "In Review", "Verification", "Closed" and "Cancelled", and the active ones are the first three. This lesson is about the review moving into its "Closed" stage. The comment status of the same name, the coordinator's move after verification, is a different thing, and a review can close while some of its comments are in statuses other than "Closed".

## IK-01 asked to close

IK-01, Water injection pump selection, is in "Verification". Its blocking comments are C-01 (a "Critical" still "Open"), C-03 (a "Major" that is "Responded") and C-04 (a "Major" that is "Rejected"). Asked to close as it stands, the engine answers:

- REFUSED, closing IK-01 as it stands: 1 critical and 2 major comments still need resolving. Verify, close out or withdraw them first.

The sentence counts the blockers by severity, names the three ways a comment becomes resolved (verify, close out or withdraw) and says "first", so the order of work is plain.

## What closing does not wait for

The engine then asks the same question after IK-01's blocking comments are withdrawn:

- ALLOWED, closing IK-01 once its blocking comments are withdrawn, with a Minor, an Editorial and an unrated comment still Open.

C-06, C-07 and C-09 are still "Open", and the review closes anyway. A review that waited on every editorial remark would stay open for a spelling point. By letting only "Critical" and "Major" block, the engine keeps the stop for the comments that should stop the work.

## The counts beside the verdict

The engine's summary over IK-01 and its own log reads:

| count | value |
| --- | --- |
| totalComments | 9 |
| openComments | 6 |
| blockingComments | 3 |

By status the log holds "Open" 4, "Responded" 1, "Verified" 1, "Closed" 1, "Rejected" 1, "Withdrawn" 1. The open count, 6, is the four "Open" comments plus the one "Responded" and the one "Rejected": every comment in an unresolved status. The blocking count, 3, is the unresolved comments whose severity is "Critical" or "Major".

## Worst first, unresolved before resolved

The engine also sorts the log for the reader, with the function bySeverityThenAge. Unresolved comments come first, worst severity first within them, then the resolved ones:

- C-01, C-03, C-04, C-06, C-07, C-09, C-08, C-02, C-05.

The three blockers lead the list, which is where a coordinator reading down it needs them. The unrated C-09 sorts after every rated unresolved comment in this log, the "Editorial" C-07 included, so its missing severity does not lift it above the comments that were rated.

Every answer here was also replayed through the independent oracle for peerReview, so each is two methods agreeing.

## Exercise

Record the engine's sentence when IK-01 is asked to close as it stands, and the totalComments, openComments and blockingComments of its summary. Then record the bySeverityThenAge order and say which rule puts C-09 after C-07. Say which three comments must be resolved for IK-01 to close, and which three can stay "Open".
