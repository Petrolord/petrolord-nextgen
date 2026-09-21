# What the credit rules rest on

{{panel:lp-worksheet}}

Most of what this engine does rests on evidence outside itself. The Annex B forms are stated identically by two published sources and reproduce a published worked function. The layer of protection analysis arithmetic is decided in exact rationals by an independent oracle. The longest interval search agrees with that oracle's exact solution. The IPL credit rules rest on none of that, and this lesson says exactly what they do rest on.

## The rule, in the engine's words

The engine credits an IPL once, and only when it is flagged independent as exactly true and is not flagged auditable as false. Anything else goes into the uncredited list with a reason. An IPL whose independence flag is the string yes is uncredited with the reason that it is not flagged independent, because independence must be true to take credit. A missing flag is treated the same way. A layer flagged not auditable is uncredited for that reason instead.

## What that rule is worth on one row

| quantity | ORONI as analysed | if all four IPLs were credited |
| --- | --- | --- |
| mitigated frequency without a SIF, per year | 0.000013500000 | 0.000000135000 |
| required RRF | 13.500000 | 0.135000 |
| outcome | SIL1 | NO_SIF_REQUIRED |

Two of ORONI's four layers are credited and two are not. Crediting all four would move the mitigated frequency by a factor of 100.000000, take the required RRF from 13.500000 to 0.135000, and turn a row that demands a safety instrumented function into a row that demands none. The credit rules are therefore among the most powerful lines of code in the engine.

## They are specification

The engine's validation record states that no independent route validates the credit rules. They are a contract the engine keeps, pinned by behaviour tests, and the behaviour tests were written from the same contract. The shared negative control makes this concrete. It removed the auditable exclusion from both the engine and the oracle at once, and the whole suite stayed green, because the oracle had no separate opinion to disagree with. A control that stays green when a rule is deleted is a control that cannot see the rule.

## What follows for grading, and for practice

Because the auditable flag has no independent check behind it, this course never grades it. No capstone field turns on whether a layer was flagged auditable. The academy's standing rule says so: a piece of logic checked for transcription only must not carry a graded answer.

For practice the consequence is the opposite of reassuring. The engine applies the flags exactly as typed and cannot see what they mean. It cannot tell that an alarm shares its transmitter with the initiating loop, that a relief valve and the trip share a block, or that the operator response credited on two rows is the same operator. Independence and auditability are judgements made by people who walked the system, and they are the judgements this engine is least able to protect you from.

## Exercise

Take the two rows above. Work out how many times the required RRF changes when the two uncredited layers are credited, and check your answer against the factor printed for the mitigated frequency. Then write the sentence you would require beside each credited layer on a worksheet so that a reviewer can see why the flag was set.
