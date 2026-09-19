# The rule of three, and where it differs

{{panel:ss-intervals-explorer}}

Three upper limits on the ABO crew's 0 recordables in 41300 hours:

| method | count upper | rate upper per 200,000 |
| --- | --- | --- |
| rule of three, derived | 3 | 14.527845 |
| engine, central 90 percent | 2.995732273554 | 14.507178 |
| engine, central 95 percent | 3.688879454114 | 17.863823 |

The rule of three sits almost on top of the central 90 percent limit and well below the central 95 percent one.

## What the rule says

The rule of three says that an upper 95 percent limit at zero events is about 3 events. Divide 3 by the exposure on your base and you have a quick upper limit on the rate. It is taught widely because it needs no tables and no software, and on the ABO hours it gives 14.527845 per 200,000 hours.

## Why the engine gives a larger figure

The engine's 95 percent interval is central. It leaves 2.5 percent of the miss in the upper tail, and at zero events that puts the count upper limit at 3.688879454114, which is minus the natural log of 2.5 percent. The rule of three is a one-sided limit. It puts the whole 5 percent of the miss in the upper tail, and the count that leaves 5 percent above it is minus the natural log of 5 percent.

The central 90 percent interval also leaves 5 percent in the upper tail. So its upper limit is exactly the one-sided 95 percent limit the rule of three approximates, and the engine returns it as 2.995732273554. Three over that figure is 1.001425, which is how close the rule gets.

## Two answers to two questions

Neither limit is wrong. They answer different questions, and a report has to say which one it is answering.

A one-sided 95 percent limit asks only how high the true rate could be. A central 95 percent interval asks how high and how low, and splits its miss between them. At zero events the low side is empty, because the lower limit is 0 anyway, so the central interval spends half its miss guarding a side that cannot be breached. That is why its upper limit is higher.

The engine returns the central interval because the same function serves every count and every confidence, and the central form is the one this engine uses throughout, including the rate-ratio interval of module four. A reader who wants the one-sided figure can ask the engine for a central 90 percent interval and read off its upper limit.

## How to report it

Say which you used. The rule of three and the one-sided limit from a central 90 percent interval give 14.527845 and 14.507178 on the ABO hours, and those are close enough to treat as one figure. The central 95 percent limit of 17.863823 is a different claim, and quoting it as a rule of three figure would overstate the limit by more than a fifth.

## Exercise

Divide 3 by the engine's central 90 percent count upper limit of 2.995732273554 and confirm the ratio of 1.001425. Then divide the central 95 percent rate upper limit, 17.863823, by the rule of three figure, 14.527845, and state in one sentence which of the two limits you would quote to a client asking how bad the crew's rate could be, and why.
