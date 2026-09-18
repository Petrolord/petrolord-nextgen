# One as-of date for every status

Some statuses in this course depend on nothing but the record. A score of 12 is "High" on any day of the year. Others depend on a date as well: whether a risk review is overdue, how many days remain until it, whether something has expired. Those statuses have two inputs, the record and the date you read it on, and a status quoted without its date has lost half of what produced it.

{{panel:rc-risk-explorer}}

## The date every line of this course uses

Every date-dependent status in this course is true ON 2026-10-01, a Thursday. That is the as-of date. Every engine call that takes a date was handed this one explicitly, and none of them read a clock. When a lesson says a review is overdue, it means overdue on 2026-10-01.

## Which functions take a date

Each of these was read from its signature in the engine source. Each has a date parameter that defaults to the machine clock when the caller leaves it out.

| module | functions that take a date, with the argument position |
| --- | --- |
| calendar | daysUntil (argument 2) |
| riskScoring | isReviewOverdue (argument 2) |
| managementOfChange | byUrgency (1), daysUntil (2), expiryState (2), isExpired (2), isOverdue (2), ratificationState (3), summarise (3) |
| peerReview | byUrgency (1), daysUntil (2), isOverdue (2), summarise (3) |
| lessonsLearned | daysUntil (2), isReviewDueSoon (2), isReviewOverdue (2), lessonAgeDays (2), lessonByAttention (2), summarise (2) |

In this tier you meet two of them. daysUntil in calendar counts whole days from the as-of date to another date. isReviewOverdue in riskScoring answers whether a risk review is overdue, and it takes the as-of date as its second argument.

## Why the clock default is a trap

A default is convenient. Call isReviewOverdue with only a risk and it quietly fills in today from the machine running it. The answer looks complete, and it is an answer to a question nobody wrote down.

A function that defaults its date to the clock answers a different question every day it is run. A report that does not state its as-of date cannot be checked by anybody, including its author the next morning. Two people who open the same register a day apart can both be right and still disagree, and neither can show the other why without the date.

Handing the date in explicitly fixes both problems. The answer becomes a property of two named inputs, and anybody holding those inputs gets the same answer.

## What the date does to one record

On the OBODO register, risk OB-01 is "Open" with its next review on 2026-10-01. Read on 2026-10-01 it is 0 days away and not overdue. Here "overdue" means one thing only: the risk's review date has passed. The same record read on another date can give another answer, and only the date written beside the answer tells a reader which one they hold.

## The mistake

Writing "OB-01 is not overdue". The sentence that can be checked is "OB-01 is not overdue on 2026-10-01", and the habit of writing the date every time is the habit this course grades.

## Exercise

Record the as-of date and its day of the week. Record the argument position of the date in daysUntil and in isReviewOverdue. Then record OB-01's next review date, its days until and its overdue answer on 2026-10-01, and state the rule that makes the date part of the answer.
