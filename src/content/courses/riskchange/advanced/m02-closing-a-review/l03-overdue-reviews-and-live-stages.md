# Overdue reviews and live stages

A peer review carries a due date, and the engine answers whether it is overdue. That answer depends on the date it is asked, so every status in this lesson is the status on 2026-10-01, the as-of date the digest hands the engine on every call.

{{panel:rc-review-explorer}}

## "Overdue" here is a review's due date

The word "overdue" answers a different question in each register of this course. Here it means one thing: a peer review whose due date has passed while the review is still live. It says nothing about a comment, a lesson's review date or a change's target date.

## The IKANG register on 2026-10-01

| review | stage | due | overdue |
| --- | --- | --- | --- |
| IK-01 | "Verification" | 2026-09-29 | yes |
| IK-02 | "In Review" | 2026-10-01 | no |
| IK-03 | "Closed" | 2026-08-15 | no |
| IK-04 | "Cancelled" | 2026-08-01 | no |
| IK-05 | "Draft" | 2026-10-20 | no |

The engine's summary over the register reads reviews 5, active 3, overdue 1. The active stages are "Draft", "In Review" and "Verification", and IK-01, IK-02 and IK-05 are in them.

## Due today is not overdue

IK-02 is due on 2026-10-01 itself and reads not overdue. A due date is the last day the work is on time. IK-01, due 2026-09-29, has passed it and reads overdue on 2026-10-01.

## A finished review carries no due date that matters

IK-03 and IK-04 both have due dates before 2026-10-01, and neither reads overdue. IK-03 is in the review's "Closed" stage, and the work is done. IK-04 is "Cancelled", and the digest says it plainly: it is never overdue, whatever its date. On this register only a review in an active stage reads overdue, much as only a live risk can be review-overdue in the risk register.

## The urgency order

The engine's byUrgency sorts the register for a coordinator deciding what to look at first:

- IK-01, IK-02, IK-05, IK-04, IK-03.

The overdue review leads, the other two live reviews follow it, and the two finished reviews come last.

## The whole register counted

A summary over every review on the register also counts every comment on it. IKANG holds three comments beyond IK-01's own log:

| comment | review | review stage | severity | status | blocking on its own |
| --- | --- | --- | --- | --- | --- |
| C-10 | IK-04 | "Cancelled" | "Critical" | "Open" | yes |
| C-11 | IK-04 | "Cancelled" | "Major" | "Responded" | yes |
| C-12 | IK-02 | "In Review" | "Major" | "Open" | yes |

The summary over all five reviews and all 12 comments reads totalComments 12, open 7, blocking 4. C-10 and C-11 would block on their own, but they sit on IK-04, which is "Cancelled" and locked, so nobody can resolve them. They stay in the comment total and in the severity and status columns, and they are not counted as open or blocking. C-12 is on IK-02, which is live, and counts. The open and blocking counts are therefore IK-01's 6 and 3, each with C-12 added.

Counting them as open work would put a blocker on the dashboard that nobody has the power to clear.

## A limit the summary states

A comment whose review is missing from the list handed to the summary still counts as open work. The digest lists that among the held limits, and the fifth module reads it there.

These answers were also replayed through the independent oracle for peerReview, so each is two methods agreeing.

## Exercise

Record, on 2026-10-01, which IKANG reviews are overdue, and the reviews, active and overdue counts. Then record totalComments, open and blocking over the whole register. Say which rule keeps IK-02 from reading overdue, and which rule keeps C-10 and C-11 out of the open and blocking counts.
