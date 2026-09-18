# Two oracles, one answer

Every lesson in this course has said that its figures were also replayed through an independent oracle. This lesson says what that means, what it checks and what it cannot.

## Two methods for every answer

Each of the four engines, and the calendar they share, has an independent Python oracle. The oracles were written from the rules as stated rather than from the JavaScript. So when the engine and the oracle agree on an answer, two methods built from the same rule by different routes have reached it.

The digest is built on that agreement. Every engine answer it prints was also replayed through the oracle for its module by oracle_bridge.py, so each one is two methods agreeing. A line that says golden or measured is the one exception: it is a count read from a file, and the engine is not answering it.

## The golden case files

The oracles also write published case files, one a module. The digest measures them by reading them:

| golden file | cases | cases carrying a repaired marker | functions exercised |
| --- | --- | --- | --- |
| calendar_cases.json | 77 | 25 | 5 |
| riskScoring_cases.json | 140 | 30 | 7 |
| managementOfChange_cases.json | 291 | 69 | 15 |
| peerReview_cases.json | 184 | 38 | 17 |
| lessonsLearned_cases.json | 345 | 19 | 26 |

Every exported function of each module is exercised by at least one golden case. The digest measures the function counts separately, by loading each module, and they read the same: calendar 5, riskScoring 7, managementOfChange 15, peerReview 17, lessonsLearned 26. The gate replays every case in five time zones, so an answer that changed with the zone of the machine running it would show.

Golden cases, measured: 1037 across the five files in the table. The other five assurance golden files belong to Compliance, Audit & Quality.

A golden line is not the engine answering. The case files are written by the oracles, and the engine is checked against them.

## Two different records

The goldens and the bridge check the engine on different data. A golden case checks the engine on the records the oracle author chose. The bridge checks it on this course's records: the IKANG review register, the ONNE lessons and the others. A defect that only shows on one record slips past a check that never meets it.

## What agreement proves and what it does not

Agreement proves the engine does what the stated rule says, on those inputs. It does not prove the rule is the right rule. That question belongs to the owner decisions, D1, Q9, Q10 and Q3, taken on 2026-09-18. And it does not remove the held items: a limit that both methods share is still a limit, and the previous lesson reads them as such.

## Why this course leans on it

A figure in a lesson is only as good as the method behind it. The digest's rule is that every figure is the engine answering at the inputs named beside it, and every such answer was confirmed by a second method. That is what lets a learner treat the digest as truth and check the app against it, instead of the other way round.

## Exercise

Record the case count, the repaired-marker count and the functions exercised for peerReview_cases.json and lessonsLearned_cases.json. Record the golden case total across the five files, and how many time zones the gate replays every case in. Then say which records a golden case checks the engine on, which records the bridge checks it on, and what agreement between the engine and its oracle does not prove.
