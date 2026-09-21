# Every examiner

An audit is more than its lead. Other people on the audit record results against clauses, and each of them is an examiner. Lesson 1 read the check on the lead auditor over the whole scope. This lesson reads the second check, on the person recording a single clause result, and the owner decision that puts it there.

{{panel:compliance-readiness-explorer}}

## The owner decision

Owner decision AS15 Q5 reads, as this course records it: every examiner is checked for independence, through canExamineClause. The check is made for each clause result as it is recorded. It asks one question: does the person recording this result own this clause?

## The two rows

The lab prints canExamineClause for clause 8.1, which u-kalu owns:

- u-kalu recording 8.1: REFUSED.
- u-chidi recording 8.1: ALLOWED.

The refusal, verbatim:

REFUSED: You own clause 8.1. An auditor may not audit their own work (ISO 19011), so somebody else on the audit has to record this result.

The sentence is addressed to the person at the keyboard. It names the one clause they own, and it names the remedy: somebody else on the audit records the result. It does not offer a change of scope.

## Why the lead check is not enough

The lead auditor check of lesson 1 reads one person against every clause in scope. An audit team can hold several people, and any of them may record a result. A lead auditor who is independent of every clause in the scope says nothing about the others on the team. If u-kalu joined an audit led by u-chidi, the lead check would read ALLOWED, and without a second check u-kalu could record the result for clause 8.1, a clause u-kalu owns.

canExamineClause closes that gap one result at a time. The team may include somebody who owns a clause in scope. That person simply may not be the one who records the result for it. The rule prevents the case the lead check cannot see: an owner examining their own clause from inside an audit whose lead is independent.

## Two checks, two moments

The two checks read different things:

| check | what it reads | the case the engine prints |
| --- | --- | --- |
| lead auditor | the lead against every clause in scope | a planned internal audit |
| canExamineClause | the person recording against one clause | a clause result being recorded |

The first check's refusal offers a change of scope or of auditor. The second offers only a change of who records. Both cite ISO 19011 in the same words: "An auditor may not audit their own work (ISO 19011)". The first sentence of each refusal is what differs, because the first speaks about a plan and the second speaks to a person.

## What the rule reads and what it does not

Both checks read the clause owner recorded in the register. The lab prints the owners of the four clauses in scope, 8.1 u-kalu, 8.2 u-kalu, 9.1.1 u-tari and 9.2 u-nneka, and every verdict in it follows from those four names. u-kalu is refused for 8.1 because the register names u-kalu as its owner, and u-chidi is allowed because the register names u-chidi against none of them.

## Exercise

Read the two canExamineClause rows for clause 8.1, and the lead auditor rows from lesson 1 for u-kalu and u-chidi. Say what each of the four rows was asked, what it answered, and which remedy each refusal offers. Then describe, in words only, an audit team on which the lead auditor check reads ALLOWED and canExamineClause still refuses one member, using clause owners from the ORASHI register.
