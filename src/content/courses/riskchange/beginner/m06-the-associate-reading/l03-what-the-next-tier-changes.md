# What the next tier changes

The Associate tier has worked on one register, the risk register, and one question about it: what does each record mean on a given date? The Professional tier moves to the change register, and the kind of question changes with it.

## What this tier has built

Every rule in this tier reads a record and returns a state: a score from two whole levels, a band from its lower edge, a residual that falls back one axis at a time, appetite against a target, whole days from the as-of date, and a band count over the population the caller hands over.

None of those rules moves a record anywhere. A risk's status is set by people, and the engine reads it.

## What the Professional tier adds

A change on a facility has a life. It passes through stages, and the engine decides which moves between them are allowed. So the Professional tier is about stages and legal moves, and about a refusal: the answer an engine gives, with a reason a user can act on, when a move is not allowed.

It is also about signatures. A change is approved in levels, and the person who raised a change is not the person who approves it. That rule, segregation of duties, is one this course owns. The tier also covers the actions a change carries, a temporary change that has to come back out by a date, and an emergency route with reduced authority up front and full review afterwards.

## Two words that change meaning

"Overdue" in this tier means a live risk's review date has passed. In the next tier a change can be overdue against its target date, which is a different question about a different record. Name which one you mean every time.

"Closed" in this tier is a status of a risk, one of the two that is not live. In the next tier "Closed" is a stage of a change, one of its three terminal stages, beside "Rejected" and "Cancelled". A closed risk and a closed change are different things.

## What carries over unchanged

The as-of date carries over. Every dated status in the next tier is still true on 2026-10-01 and is quoted with that date. The calendar carries over: the same whole days and the same null for a date that does not exist. The shape of a refused verdict, an object with `ok` and a `reason`, is the same in every engine.

## The mistake

The mistake is to expect the change register to behave like the risk register. A risk is read; a change is moved. The next tier's answers are often a refusal, and a refusal is read as carefully as a band.

## Exercise

Record the as-of date the next tier uses. Write one sentence each for what "overdue" and "Closed" mean in this tier. Then list the rules from this tier that carry over unchanged, and state which engine module both tiers read dates through.
