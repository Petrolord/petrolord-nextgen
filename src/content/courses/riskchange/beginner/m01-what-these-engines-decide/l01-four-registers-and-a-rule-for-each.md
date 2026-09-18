# Four registers and a rule for each

An assurance function keeps registers. A risk register lists what could go wrong and how badly. A change register lists what is being altered on a facility and who has signed for it. A review register tracks the comments raised on a piece of work, and a lessons register holds what an organisation has learned and whether anybody used it. This course is about the rules that read each of those records and give it a status.

## Four apps and four engines

In the Suite, four apps in the Assurance module call these rules, and each rule set lives in an engine of its own. All four apps read calendar dates through one shared module, calendar.js.

| app | engine it calls | the state the engine decides |
| --- | --- | --- |
| Risk Register, with its Heatmap tab | riskScoring | a band and an appetite verdict for a risk |
| Management of Change | managementOfChange | a stage move and an expiry state for a change |
| Peer Review Manager | peerReview | a closure verdict for a review |
| Lessons Learned | lessonsLearned | an acceptance and an embedding verdict for a lesson |

Read the right-hand column carefully. Every entry is a STATE decided from a record. A band is a state. An appetite verdict is a state. Whether a change may move to its next stage is a state. None of them is a number somebody typed in.

## The engine stores nothing

None of the four engines stores anything. The app stores the record, and it asks the engine what that record means. This split is the most useful thing to understand before you meet a single score. When you see a band beside a risk, you are reading the engine's answer about the record as it stands at that moment. Change the likelihood on the record and the band that follows is a fresh answer from the same rule. Nobody edits a band directly, because a band is always derived.

It also tells you where to look when a status surprises you. The rule is fixed and the same for every user. What varies is the record, so the question to ask first is which field of the record produced the answer.

## How big each engine is

The exports of each module were measured by loading it. An export is anything the module makes available to an app: a function, or a frozen table or constant such as the band table riskScoring carries.

| module | exports | functions | frozen tables and constants | functions that take a date |
| --- | --- | --- | --- | --- |
| calendar | 6 | 5 | 1 | 1 |
| riskScoring | 15 | 7 | 8 | 1 |
| managementOfChange | 34 | 15 | 19 | 7 |
| peerReview | 29 | 17 | 12 | 4 |
| lessonsLearned | 40 | 26 | 14 | 6 |

The last column matters enough to have a lesson of its own, which comes next.

## What this tier covers

The Associate tier works in riskScoring and in calendar. It covers the score, the band, the residual, appetite and the date. The Professional tier takes the change register, and the Expert tier takes peer review and lessons.

## The mistake

The mistake is to treat a status on the screen as a stored fact that somebody decided. It is an answer the engine gives about a record, and it can only be as right as the record it was handed.

## Exercise

For each of the four apps, record the engine it calls and the state that engine decides. Then record the number of exports and the number of functions in riskScoring and in calendar, and state the rule that explains why an app never saves a band by hand.
