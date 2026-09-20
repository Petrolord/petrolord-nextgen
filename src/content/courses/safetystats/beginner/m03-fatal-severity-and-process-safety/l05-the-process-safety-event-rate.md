# The process safety event rate

{{panel:ss-rates-explorer}}

UGHELLI reported 1 Tier 1 and 4 Tier 2 process safety events in 2318640 hours. On the 200,000 hour base the engine rates them at 0.086257 and 0.345030. On the 1,000,000 hour base they read 0.431287 and 1.725149. The engine's formula line reads "Tier 1 PSE count x base / total work hours" for the first, and names Tier 2 for the second.

| tier, stated | events, stated | base | PSE rate |
| --- | --- | --- | --- |
| 1 | 1 | 200000 | 0.086257 |
| 1 | 1 | 1000000 | 0.431287 |
| 2 | 4 | 200000 | 0.345030 |
| 2 | 4 | 1000000 | 1.725149 |

API RP 754 sorts process safety events into tiers, and a process safety event rate is the count in one tier times a base over the total hours worked. The engine's standard line names its source: "API RP 754, API Guide to Reporting Process Safety Events section 3.3".

## The tier is an input

The engine does not decide whether an event is Tier 1 or Tier 2. That decision needs the threshold quantity tables of API RP 754, which set how much of each material has to be released for an event to reach each tier. Those tables are licensed content. They appear nowhere in the engine, the golden or this course.

So the caller tells the engine the tier. A learner given a tier can rate it; a learner given a release has to classify it outside this engine first. If the tier is missing, or is anything other than 1 or 2, the engine refuses:

> tier must be 1 or 2: classify the events against API RP 754 before rating them

The same message covers a call with tier 3 and a call with no tier at all. It names the field, and it tells the caller what to do before trying again.

## Two bases only

A PSE rate is accepted on the 200,000 or the 1,000,000 hour base, and on no other. The engine quotes the reason from the standard: the rate is taken "consistent with the basis for calculating the Company's occupational injury rate". A company that reports its recordable rate per 200,000 hours reports its PSE rate the same way. A call on the FAR base is refused:

> base must be 200,000 or 1,000,000 for an API RP 754 PSE rate

## Two golden cases

The golden carries two further cases. Two Tier 1 events in 1650000 hours on the OSHA base give 0.242424. Nine Tier 2 events in the same 1650000 hours on the million hour base give 5.454545. The engine matches both with a relative difference of 0.

| golden case | tier | events | hours | base | rate |
| --- | --- | --- | --- | --- | --- |
| Tier 1 on the OSHA base | 1 | 2 | 1650000 | 200000 | 0.242424 |
| Tier 2 on the million base | 2 | 9 | 1650000 | 1000000 | 5.454545 |

## Reading it beside the injury rates

UGHELLI's Tier 2 rate of 0.345030 per 200,000 hours equals its DART rate on the same base, because both come from a count of 4 over the same hours. That equality is arithmetic and says nothing about how the two kinds of event relate: a site can do well on one and badly on the other.

## Exercise

Multiply UGHELLI's 1 Tier 1 event by 200,000 and divide by 2318640 hours, and check you reach 0.086257. Then open the rates explorer, go to the PSE view, and rate the same event on the FAR base. Copy the refusal. Finally, set the tier box to 3 and record which field the engine names and what it tells you to do first.
